/*------------------------------------------------------------------------
 * JavaScript Library for Toggl-Button for GreaseMonkey
 *
 * (c) Jürgen Haas, PARAGON Executive Services GmbH
 * Version: 1.9
 *
 * @see https://gitlab.paragon-es.de/toggl-button/core
 *------------------------------------------------------------------------
 */

function TogglButtonGM(selector, renderer) {

  var
    $activeApiUrl = null,
    $apiUrl = "https://www.toggl.com/api/v7",
    $newApiUrl = "https://www.toggl.com/api/v8",
    $legacyApiUrl = "https://new.toggl.com/api/v8",
    $triedAlternative = false,
    $addedDynamicListener = false,
    $api_token = null,
    $default_wid = null,
    $clientMap = {},
    $projectMap = {},
    $instances = {};

  init(selector, renderer);

  function init(selector, renderer, apiUrl) {
    var timeNow = new Date().getTime(),
      timeAuth = GM_getValue('_authenticated', 0);
    apiUrl = apiUrl || $newApiUrl;
    $api_token = GM_getValue('_api_token', false);
    if ($api_token && (timeNow - timeAuth) < (6*60*60*1000)) {
      $activeApiUrl = GM_getValue('_api_url', $newApiUrl);
      $default_wid = GM_getValue('_default_wid', 0);
      $clientMap   = JSON.parse(GM_getValue('_clientMap', {}));
      $projectMap  = JSON.parse(GM_getValue('_projectMap', {}));
      if ($activeApiUrl == $legacyApiUrl) {
        // See issue #22.
        $activeApiUrl = $newApiUrl;
        GM_setValue('_api_url', $activeApiUrl);
      }
      render(selector, renderer);
      return;
    }

    var headers = {};
    if ($api_token) {
      headers = {
        "Authorization": "Basic " + btoa($api_token + ':api_token')
      };
    }
    $activeApiUrl = apiUrl;
    GM_xmlhttpRequest({
      method: "GET",
      url: apiUrl + "/me?with_related_data=true",
      headers: headers,
      onload: function(result) {
        if (result.status === 200) {
          var resp = JSON.parse(result.responseText);
          $clientMap[0] = 'No Client';
          if (resp.data.clients) {
            resp.data.clients.forEach(function (client) {
              $clientMap[client.id] = client.name;
            });
          }
          if (resp.data.projects) {
            resp.data.projects.forEach(function (project) {
              if ($clientMap[project.cid] == undefined) {
                project.cid = 0;
              }
              if (project.active) {
                $projectMap[project.id] = {
                  id: project.id,
                  cid: project.cid,
                  name: project.name,
                  billable: project.billable
                };
              }
            });
          }
          GM_setValue('_authenticated', new Date().getTime());
          GM_setValue('_api_token', resp.data.api_token);
          GM_setValue('_api_url', $activeApiUrl);
          GM_setValue('_default_wid', resp.data.default_wid);
          GM_setValue('_clientMap', JSON.stringify($clientMap));
          GM_setValue('_projectMap', JSON.stringify($projectMap));
          $api_token = resp.data.api_token;
          $default_wid = resp.data.default_wid;
          render(selector, renderer);
        } else if (!$triedAlternative) {
          $triedAlternative = true;
          if (apiUrl === $apiUrl) {
            init(selector, renderer, $newApiUrl);
          } else if (apiUrl === $newApiUrl) {
            init(selector, renderer, $apiUrl);
          }
        } else if ($api_token) {
          // Delete the API token and try again
          GM_setValue('_api_token', false);
          $triedAlternative = false;
          init(selector, renderer, $newApiUrl);
        } else {
          var wrapper = document.createElement('div'),
            content = createTag('div', 'content'),
            link = createLink('login', 'a', 'https://new.toggl.com/', 'Login');
          GM_addStyle(GM_getResourceText('togglStyle'));
          link.setAttribute('target', '_blank');
          wrapper.setAttribute('id', 'toggl-button-auth-failed');
          content.appendChild(document.createTextNode('Authorization to your Toggl account failed!'));
          content.appendChild(link);
          wrapper.appendChild(content);
          document.querySelector('body').appendChild(wrapper);
        }
      }
    });
  }

  function render(selector, renderer) {
    if (selector == null) {
      return;
    }
    var i, len, elems = document.querySelectorAll(selector + ':not(.toggl)');
    for (i = 0, len = elems.length; i < len; i += 1) {
      elems[i].classList.add('toggl');
      $instances[i] = new TogglButtonGMInstance(renderer(elems[i]));
    }

    if (!$addedDynamicListener) {
      $addedDynamicListener = true;

      document.addEventListener('TogglButtonGMUpdateStatus', function() {
        GM_xmlhttpRequest({
          method: "GET",
          url: $activeApiUrl + "/time_entries/current",
          headers: {
            "Authorization": "Basic " + btoa($api_token + ':api_token')
          },
          onload: function (result) {
            if (result.status === 200) {
              var resp = JSON.parse(result.responseText),
                data = resp.data || false;
              for (i in $instances) {
                $instances[i].checkCurrentLinkStatus(data);
              }
            }
          }
        });
      });

      window.addEventListener('focus', function() {
        document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
      });

      if (selector !== 'body') {
        document.body.addEventListener('DOMSubtreeModified', function () {
          setTimeout(function () {
            render(selector, renderer);
          }, 1000);
        });
      }
    }
  }

  this.clickLinks = function() {
    for (i in $instances) {
      $instances[i].clickLink();
    }
  };

  this.getCurrentTimeEntry = function(callback) {
    GM_xmlhttpRequest({
      method: "GET",
      url: $activeApiUrl + "/time_entries/current",
      headers: {
        "Authorization": "Basic " + btoa($api_token + ':api_token')
      },
      onload: function (result) {
        if (result.status === 200) {
          var resp = JSON.parse(result.responseText),
            data = resp.data || false;
          if (data) {
            callback(data.id, true);
          }
        }
      }
    });
  };

  this.stopTimeEntry = function(entryId, asCallback) {
    if (entryId == null) {
      if (asCallback) {
        return;
      }
      this.getCurrentTimeEntry(this.stopTimeEntry);
      return;
    }
    GM_xmlhttpRequest({
      method: "PUT",
      url: $activeApiUrl + "/time_entries/" + entryId + "/stop",
      headers: {
        "Authorization": "Basic " + btoa($api_token + ':api_token')
      },
      onload: function () {
        document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
      }
    });
  };

  function TogglButtonGMInstance(params) {

    var
      $curEntryId = null,
      $isStarted = false,
      $link = null,
      $generalInfo = null,
      $buttonTypeMinimal = false,
      $projectSelector = window.location.host,
      $projectId = null,
      $projectSelected = false,
      $projectSelectElem = null,
      $stopCallback = null,
      $tags = params.tags || [];

    this.checkCurrentLinkStatus = function (data) {
      var started, updateRequired = false;
      if (!data) {
        if ($isStarted) {
          updateRequired = true;
          started = false;
        }
      } else {
        if ($generalInfo != null) {
          if (!$isStarted || ($curEntryId != null && $curEntryId != data.id)) {
            $curEntryId = data.id;
            $isStarted = false;
          }
        }
        if ($curEntryId == data.id) {
          if (!$isStarted) {
            updateRequired = true;
            started = true;
          }
        } else {
          if ($isStarted) {
            updateRequired = true;
            started = false;
          }
        }
      }
      if (updateRequired) {
        if (!started) {
          $curEntryId = null;
        }
        if ($link != null) {
          updateLink(started);
        }
        if ($generalInfo != null) {
          if (data) {
            var projectName = 'No project',
              clientName = 'No client';
            if (data.pid !== undefined) {
              if ($projectMap[data.pid] == undefined) {
                GM_setValue('_authenticated', 0);
                window.location.reload();
                return;
              }
              projectName = $projectMap[data.pid].name;
              clientName = $clientMap[$projectMap[data.pid].cid];
            }
            var content = createTag('div', 'content'),
              contentClient = createTag('div', 'client'),
              contentProject = createTag('div', 'project'),
              contentDescription = createTag('div', 'description');
            contentClient.innerHTML = clientName;
            contentProject.innerHTML = projectName;
            contentDescription.innerHTML = data.description;
            content.appendChild(contentClient);
            content.appendChild(contentProject);
            content.appendChild(contentDescription);
            while ($generalInfo.firstChild) {
              $generalInfo.removeChild($generalInfo.firstChild);
            }
            $generalInfo.appendChild(content);
          }
          updateGeneralInfo(started);
        }
      }
    };

    this.clickLink = function (data) {
      $link.dispatchEvent(new CustomEvent('click'));
    };

    createTimerLink(params);

    function createTimerLink(params) {
      GM_addStyle(GM_getResourceText('togglStyle'));
      if (params.generalMode !== undefined && params.generalMode) {
        $generalInfo = document.createElement('div');
        $generalInfo.id = 'toggl-button-gi-wrapper';
        $generalInfo.addEventListener('click', function (e) {
          e.preventDefault();
          $generalInfo.classList.toggle('collapsed');
        });
        document.querySelector('body').appendChild($generalInfo);
        document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
        return;
      }
      if (params.projectIds !== undefined) {
        $projectSelector += '-' + params.projectIds.join('-');
      }
      if (params.stopCallback !== undefined) {
        $stopCallback = params.stopCallback;
      }
      updateProjectId();
      $link = createLink('toggl-button');
      $link.classList.add(params.className);

      if (params.buttonType === 'minimal') {
        $link.classList.add('min');
        $link.removeChild($link.firstChild);
        $buttonTypeMinimal = true;
      }

      $link.addEventListener('click', function (e) {
        var opts = '';
        e.preventDefault();
        if ($isStarted) {
          stopTimeEntry();
        } else {
          var billable = false;
          if ($projectId != undefined && $projectId > 0) {
            billable = $projectMap[$projectId].billable;
          }
          opts = {
            $projectId: $projectId || null,
            billable: billable,
            description: invokeIfFunction(params.description),
            createdWith: 'TogglButtonGM - ' + params.className
          };
          createTimeEntry(opts);
        }
        return false;
      });

      // new button created - reset state
      $isStarted = false;

      // check if our link is the current time entry and set the state if it is
      checkCurrentTimeEntry({
        $projectId: $projectId,
        description: invokeIfFunction(params.description)
      });

      document.querySelector('body').classList.add('toggl-button-available');
      if (params.targetSelectors == undefined) {
        var wrapper,
          existingWrapper = document.querySelectorAll('#toggl-button-wrapper'),
          content = createTag('div', 'content');
        content.appendChild($link);
        content.appendChild(createProjectSelect());
        if (existingWrapper.length > 0) {
          wrapper = existingWrapper[0];
          while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
          }
          wrapper.appendChild(content);
        }
        else {
          wrapper = document.createElement('div');
          wrapper.id = 'toggl-button-wrapper';
          wrapper.appendChild(content);
          document.querySelector('body').appendChild(wrapper);
        }
      } else {
        var elem = params.targetSelectors.context || document;
        if (params.targetSelectors.link != undefined) {
          elem.querySelector(params.targetSelectors.link).appendChild($link);
        }
        if (params.targetSelectors.projectSelect != undefined) {
          elem.querySelector(params.targetSelectors.projectSelect).appendChild(createProjectSelect());
        }
      }

      return $link;
    }

    function createTimeEntry(timeEntry) {
      var start = new Date();
      GM_xmlhttpRequest({
        method: "POST",
        url: $activeApiUrl + "/time_entries",
        headers: {
          "Authorization": "Basic " + btoa($api_token + ':api_token')
        },
        data: JSON.stringify({
          time_entry: {
            start: start.toISOString(),
            description: timeEntry.description,
            wid: $default_wid,
            pid: timeEntry.$projectId || null,
            billable: timeEntry.billable || false,
            duration: -(start.getTime() / 1000),
            tags: $tags,
            created_with: timeEntry.createdWith || 'TogglButtonGM'
          }
        }),
        onload: function (res) {
          var responseData, entryId;
          responseData = JSON.parse(res.responseText);
          entryId = responseData && responseData.data && responseData.data.id;
          $curEntryId = entryId;
          document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
        }
      });
    }

    function checkCurrentTimeEntry(params) {
      GM_xmlhttpRequest({
        method: "GET",
        url: $activeApiUrl + "/time_entries/current",
        headers: {
          "Authorization": "Basic " + btoa($api_token + ':api_token')
        },
        onload: function (result) {
          if (result.status === 200) {
            var resp = JSON.parse(result.responseText);
            if (resp == null) {
              return;
            }
            if (params.description === resp.data.description) {
              $curEntryId = resp.data.id;
              updateLink(true);
            }
          }
        }
      });
    }

    function stopTimeEntry(entryId) {
      entryId = entryId || $curEntryId;
      if (!entryId) {
        return;
      }
      GM_xmlhttpRequest({
        method: "PUT",
        url: $activeApiUrl + "/time_entries/" + entryId + "/stop",
        headers: {
          "Authorization": "Basic " + btoa($api_token + ':api_token')
        },
        onload: function (result) {
          $curEntryId = null;
          document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
          if (result.status === 200) {
            var resp = JSON.parse(result.responseText),
              data = resp.data || false;
            if (data) {
              if ($stopCallback !== undefined && $stopCallback !== null) {
                var currentdate = new Date();
                $stopCallback((currentdate.getTime() - (data.duration * 1000)), data.duration);
              }
            }
          }
        }
      });
    }

    function createTag(name, className, innerHTML) {
      var tag = document.createElement(name);
      tag.className = className;

      if (innerHTML) {
        tag.innerHTML = innerHTML;
      }

      return tag;
    }

    function createLink(className, tagName, linkHref, linkText) {
      // Param defaults
      tagName = tagName || 'a';
      linkHref = linkHref || '#';
      linkText = linkText || 'Start timer';

      var link = createTag(tagName, className);

      if (tagName === 'a') {
        link.setAttribute('href', linkHref);
      }

      link.appendChild(document.createTextNode(linkText));
      return link;
    }

    function updateGeneralInfo(started) {
      if (started) {
        $generalInfo.classList.add('active');
      } else {
        $generalInfo.classList.remove('active');
      }
      $isStarted = started;
    }

    function updateLink(started) {
      var linkText, color = '';

      if (started) {
        document.querySelector('body').classList.add('toggl-button-active');
        $link.classList.add('active');
        color = '#1ab351';
        linkText = 'Stop timer';
      } else {
        document.querySelector('body').classList.remove('toggl-button-active');
        $link.classList.remove('active');
        linkText = 'Start timer';
      }
      $isStarted = started;

      $link.setAttribute('style', 'color:'+color+';');
      if (!$buttonTypeMinimal) {
        $link.innerHTML = linkText;
      }

      $projectSelectElem.disabled = $isStarted;
    }

    function updateProjectId(id) {
      id = id || GM_getValue($projectSelector, 0);

      $projectSelected = (id != 0);

      if (id <= 0) {
        $projectId = null;
      }
      else {
        $projectId = id;
      }

      if ($projectSelectElem != undefined) {
        $projectSelectElem.value = id;
        $projectSelectElem.disabled = $isStarted;
      }

      GM_setValue($projectSelector, id);

      if ($link != undefined) {
        if ($projectSelected) {
          $link.classList.remove('hidden');
        }
        else {
          $link.classList.add('hidden');
        }
      }
    }

    function invokeIfFunction(trial) {
      if (trial instanceof Function) {
        return trial();
      }
      return trial;
    }

    function createProjectSelect() {
      var pid,
        wrapper = createTag('div', 'toggl-button-project-select'),
        noneOptionAdded = false,
        noneOption = document.createElement('option'),
        emptyOption = document.createElement('option'),
        resetOption = document.createElement('option');

      $projectSelectElem = createTag('select');

      // None Option to indicate that a project should be selected first
      if (!$projectSelected) {
        noneOption.setAttribute('value', '0');
        noneOption.text = '- First select a project -';
        $projectSelectElem.appendChild(noneOption);
        noneOptionAdded = true;
      }

      // Empty Option for tasks with no project
      emptyOption.setAttribute('value', '-1');
      emptyOption.text = 'No Project';
      $projectSelectElem.appendChild(emptyOption);

      var optgroup, project, clientMap = [];
      for (pid in $projectMap) {
        //noinspection JSUnfilteredForInLoop
        project = $projectMap[pid];
        if (clientMap[project.cid] == undefined) {
          optgroup = createTag('optgroup');
          optgroup.label = $clientMap[project.cid];
          clientMap[project.cid] = optgroup;
          $projectSelectElem.appendChild(optgroup);
        } else {
          optgroup = clientMap[project.cid];
        }
        var option = document.createElement('option');
        option.setAttribute('value', project.id);
        option.text = project.name;
        optgroup.appendChild(option);
      }

      // Reset Option to reload settings and projects from Toggl
      resetOption.setAttribute('value', 'RESET');
      resetOption.text = 'Reload settings';
      $projectSelectElem.appendChild(resetOption);

      $projectSelectElem.addEventListener('change', function () {
        if ($projectSelectElem.value == 'RESET') {
          GM_setValue('_authenticated', 0);
          window.location.reload();
          return;
        }

        if (noneOptionAdded) {
          $projectSelectElem.removeChild(noneOption);
          noneOptionAdded = false;
        }

        updateProjectId($projectSelectElem.value);

      });

      updateProjectId($projectId);

      wrapper.appendChild($projectSelectElem);
      return wrapper;
    }
  }

}
