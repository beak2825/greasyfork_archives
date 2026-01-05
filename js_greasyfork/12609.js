// ==UserScript==
//
// @name         Github to Redmine autolink
// @version      4.5
// @description  Autolink Redmine issue in GitHub PR
//
// @author       Ronan LE BRIS <ronan.lebris.rolebi@gmail.com>
//
// @include      /^https:\/\/github.com\/[^\/]+\/[^\/]+(\/.*)?$/
// @exclude      /^https:\/\/github.com\/[^\/]+\/[^\/]+\/settings(\/.*)?$/
// @exclude      /^https:\/\/github.com\/settings(\/.*)?$/
//
// @namespace    https://greasyfork.org/users/15646
//
// @grant        GM_xmlhttpRequest
//
// @downloadURL https://update.greasyfork.org/scripts/12609/Github%20to%20Redmine%20autolink.user.js
// @updateURL https://update.greasyfork.org/scripts/12609/Github%20to%20Redmine%20autolink.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  /**********************************************************************************************
   * Storage, help to store data for a given session or across sessions + manages data expiration
   */

  function CachedData(data, expireIn) {
    this.expireAt = expireIn ? new Date((new Date()).getTime() + expireIn * 1000) : null;
    this.data = data;
  }

  function NonPersistentStorage() {
    this.storage = {};
  }

  NonPersistentStorage.prototype.get = function (key) {
    return this.storage[key];
  };

  NonPersistentStorage.prototype.set = function (key, value) {
    this.storage[key] = value;
  };

  function PersistentStorage(prefix) {
    this.prefix = prefix + '~';
    this.storage = window.localStorage;
  }

  PersistentStorage.prototype.get = function (key) {
    return this.storage.getItem(this.prefix + key);
  };

  PersistentStorage.prototype.set = function (key, value) {
    this.storage.setItem(this.prefix + key, value);
  };

  function AsyncCachedStorage(storage) {
    this.storage = storage;
  }

  AsyncCachedStorage.prototype.unset = function (index) {
    this.storage.set(index, null);
  };

  AsyncCachedStorage.prototype.set = function (index, expireIn, value) {
    this.storage.set(index, new CachedData(value, expireIn));
  };

  AsyncCachedStorage.prototype.get = function (index) {
    var entry = this.storage.get(index);
    if (entry && (!entry.expireAt || entry.expireAt.getTime() > (new Date()).getTime())) {
      return entry.data ? entry.data : null;
    }

    return null;
  };

  AsyncCachedStorage.prototype.retrieve = function (index, expireIn, onSuccess, onFailure) {
    var value;

    if ((value = this.get(index))) {
      onSuccess(value);
    }

    // Don't retrieve data when already loading them. Grace time 4 seconds.
    this.set(index, 4, null);

    var that = this;

    onFailure(index, function (value) {
      that.set(index, expireIn, value);
      onSuccess(value);
    });
  };

  /**********************************************************************************************
   * Redmine API, wrappers for calls to Redmine API
   */

  function RedmineApi(host, apiKeyGetter, cacheDurations) {
    var that = this;

    if (!host) {
      throw 'Host is required';
    }

    this.issues = new AsyncCachedStorage(new NonPersistentStorage());
    this.users = new AsyncCachedStorage(new NonPersistentStorage());
    this.configStorage = new PersistentStorage('redmine_api');

    if (this.configStorage.get('host') !== host) {
      this.cleanCache();
    }

    this.cacheDurations = typeof cacheDurations === 'object' ? cacheDurations : {
      issues: cacheDurations,
      users: cacheDurations,
      api_user: cacheDurations
    };

    this.configStorage.set('host', host);

    this.setUpApiKey(apiKeyGetter);

    this.statuses = {
      code_review_in_progress: 55,
      delivered_for_code_review: 56,
      code_review_ok: 57,
      code_review_ko: 58,
      ready_to_deliver_for_internal_testing: 54
    };

    this.statusesPerID = {};

    $.each(this.statuses, function (key, value) {
      that.statusesPerID[value] = key;
    });
  }

  RedmineApi.prototype.cleanCache = function () {
    this.configStorage.set('api_key', '');
    this.configStorage.set('host', '');
  };

  RedmineApi.prototype.setUpApiKey = function (apiKeyGetter) {
    if (this.configStorage.get('api_key')) {
      return;
    }

    var apiKey = apiKeyGetter(this.configStorage.get('host'));
    if (!apiKey) {
      throw 'Redmine Api key for host ' + this.configStorage.get('host') + ' is required';
    }

    this.configStorage.set('api_key', apiKey);
  };

  RedmineApi.prototype.get = function (endpoint, data, onSuccess) {
    this.call('GET', endpoint, data, onSuccess);
  };

  RedmineApi.prototype.put = function (endpoint, data, onSuccess) {
    this.call('PUT', endpoint, data, onSuccess);
  };

  RedmineApi.prototype.call = function (method, endpoint, data, onSuccess) {
    var query = method === 'GET' && data ? $.param(data) : '';

    var config = {
      method: method,
      url: this.configStorage.get('host') + endpoint + (query ? '?' + query : ''),
      headers: {
        'X-Redmine-Api-Key': this.configStorage.get('api_key'),
        'Accept': 'application/json'
      },

      onload: function (response) {
        onSuccess(response.responseText ? JSON.parse(response.responseText) : null);
      }
    };

    if (method === 'PUT') {
      config.headers['Content-Type'] = 'application/json';
      config.data = JSON.stringify(data);
    }

    GM_xmlhttpRequest(config);
  };

  RedmineApi.prototype.updateIssue = function (issue, data, onSuccess) {
    var that = this;

    that.put('/issues/' + issue + '.json', {issue: data}, function () {
      that.issues.unset(issue);
      that.retrieveIssue(issue, function (issue) {
        onSuccess(issue);
      });
    });
  };

  RedmineApi.prototype.retrieveIssueWithJournals = function (issue, onSuccess) {
    var value = this.issues.get(issue);

    if (value && value.journals) {
      return value;
    }

    var that = this;

    this.issues.unset(issue);

    this.issues.retrieve(issue, this.cacheDurations.issues, onSuccess, function (issue, setter) {
      that.get('/issues/' + issue + '.json', {include: 'journals'}, function (data) {
        data.issue && setter(data.issue);
      });
    });
  };

  RedmineApi.prototype.retrieveIssue = function (issue, onSuccess) {
    var that = this;

    this.issues.retrieve(issue, this.cacheDurations.issues, onSuccess, function (issue, setter) {
      that.get('/issues/' + issue + '.json', null, function (data) {
        data.issue && setter(data.issue);
      });
    });
  };

  RedmineApi.prototype.retrieveApiUser = function (onSuccess) {
    var that = this;

    this.users.retrieve('current', this.cacheDurations.api_user, onSuccess, function (user, setter) {
      that.get('/users/' + user + '.json', null, function (data) {
        data.user && setter(data.user);
      });
    });
  };


  /*************************************************************************************
   * Issues helper.
   */

  var getLatestStatusChangerPerStatus = function (issue, status) {
    var changer = false;

    $.each(issue.journals, function (index, journal) {
      $.each(journal.details, function (index, detail) {
        if (detail.property === 'attr' && detail.name === 'status_id' && parseInt(detail.new_value) === status) {
          changer = journal.user;

          return false;
        }
      });

      if (changer) {
        return false;
      }
    });

    return changer;
  };

  function CodeReviewWorkflow(redmineApi) {
    this.redmineApi = redmineApi;
  }

  /************************************************************************************
   * Worflows
   */

  CodeReviewWorkflow.prototype.getActionsForStatus = function (status) {
    switch (status) {
      case this.redmineApi.statuses.delivered_for_code_review:
        return {start: {label: 'Start code review'}};

      case this.redmineApi.statuses.code_review_in_progress:
        return {ok: {label: 'Code review OK'}, ko: {label: 'code review KO'}};

      case this.redmineApi.statuses.code_review_ok:
        return {deliver: {label: 'Ready to deliver'}};
    }

    return null;
  };

  CodeReviewWorkflow.prototype.start = function (issue, onSuccess) {
    var that = this;
    this.redmineApi.retrieveApiUser(function (user) {
      that.redmineApi.updateIssue(issue, {
        status_id: that.redmineApi.statuses.code_review_in_progress,
        assigned_to_id: user.id
      }, onSuccess);
    });
  };

  CodeReviewWorkflow.prototype.ok = function (issue, onSuccess) {
    var that = this;
    this.redmineApi.retrieveApiUser(function (user) {
      that.redmineApi.updateIssue(issue, {
        status_id: that.redmineApi.statuses.code_review_ok,
        assigned_to_id: user.id
      }, onSuccess);
    });
  };

  CodeReviewWorkflow.prototype.ko = function (issueId, onSuccess) {
    var that = this;

    that.redmineApi.retrieveIssueWithJournals(issueId, function (issue) {
      that.redmineApi.updateIssue(issueId, {
        status_id: that.redmineApi.statuses.code_review_ko,
        assigned_to_id: getLatestStatusChangerPerStatus(
          issue,
          that.redmineApi.statuses.delivered_for_code_review
        ).id
      }, onSuccess);
    });
  };

  CodeReviewWorkflow.prototype.deliver = function (issueId, onSuccess) {
    var that = this;

    that.redmineApi.retrieveIssue(issueId, function () {
      that.redmineApi.updateIssue(issueId, {
        status_id: that.redmineApi.statuses.ready_to_deliver_for_internal_testing
      }, onSuccess);
    });
  };

  /**********************************************************************************************
   * Text Helper, manipulates strings.
   */

  function TextHelper() {
    this.prefixReg = /^[\n ]*(\[\w+]) */i;
    this.issueReg = /^[\n ]*(?:\[\w+] *)?(?:(?:Ticket|Fix|Redmine) +)?#?(\d{4,})[ -:]*/i;
    this.apiKeyReg = /^[a-f0-9]{40}$/;
    this.uriReg = /^https?:\/\//;
  }

  TextHelper.prototype.extractPrefix = function (text) {
    var matches = text.match(this.prefixReg);

    if (!matches) {
      return '';
    }

    return matches[1];
  };

  TextHelper.prototype.extractIssue = function (text) {
    var matches = text.match(this.issueReg);

    if (!matches) {
      return '';
    }

    return matches[1];
  };

  TextHelper.prototype.cleanupText = function (text) {
    var newText = text.replace(this.issueReg, '').trim();

    // never return an empty string
    return this.extractPrefix(text) + ' ' + (newText ? newText : text);
  };

  TextHelper.prototype.validateUri = function (uri) {
    if (typeof uri === 'string' && this.uriReg.test(uri)) {
      return true;
    }

    return ['The given uri is not valid, it must start with either http:// or https://'];
  };

  TextHelper.prototype.validateApiKey = function (apiKey) {
    if (typeof apiKey === 'string' && this.apiKeyReg.test(apiKey)) {
      return true;
    }

    return ['The given api key is not in a valid format, expecting 40 alphanumeric characters'];
  };

  /**********************************************************************************************
   * Dom Observer, helps attach handler on DOM changes.
   */

  function DomObserver(config) {
    this.MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    this.obsConfig = config;
  }

  DomObserver.prototype.createHandler = function (callback) {
    return function (mutationRecords) {
      mutationRecords.forEach(function (mutation) {
        if (typeof mutation.removedNodes === 'object') {
          callback($(mutation.addedNodes));
        }
      });
    };
  };

  DomObserver.prototype.observe = function (element, callback) {
    var observer = new this.MutationObserver(this.createHandler(callback));
    observer.observe(element, this.obsConfig);
  };

  function IssueBox(issue, workflows) {
    var that = this;

    this.workflows = workflows;
    this.issue = issue;
    this.$elem = $(
      '<div class="__redmine_autolink--box">' +
      '<h3 class="title">Loading ...</h3>' +
      '<ul class="properties">' +
      '<li class="author"><strong>Author</strong>&nbsp;<span class="content"></span></li>' +
      '<li class="status"><strong>Status</strong>&nbsp;<span class="content"></span></li>' +
      '<li class="assignee"><strong>Assigned to</strong>&nbsp;<span class="content"></span></li>' +
      '<li class="version"><strong>Version</strong>&nbsp;<span class="content"></span></li>' +
      '</ul>' +
      '</div>'
    )
      .data('box', this);

    // no delegation as Github JS UI catches all events
    this.$elem.on('mouseleave', function (e) {
      var $target = $(e.relatedTarget);
      if (!$target.is('.__redmine_autolink--link') || ($target.data('link') && $target.data('link').issue !== that.issue)) {
        that.hide();
      }
    });

    this.$elem.on('click', '.actions button', function (e) {
      var $action = $(e.target);
      var workflow = $action.data('workflow');
      if (workflow && that.workflows[workflow] !== undefined) {
        that.loading();
        that.workflows[workflow][$action.data('action')](issue, function (issue) {
          if (issue) {
            that.update(issue);
          }
          that.stopLoading();
        });
      }

      return false;
    });
  }

  IssueBox.prototype.getElem = function () {
    return this.$elem;
  };

  IssueBox.prototype.show = function (link) {
    this.$elem.css({
      top: link.getElem().offset().top + link.getElem().outerHeight(true) + 6,
      left: link.getElem().offset().left
    });

    $('.__redmine_autolink--box').not(this.$elem).hide();
    this.$elem.show();
  };

  IssueBox.prototype.loading = function () {
    this.$elem.addClass('loading');
  };

  IssueBox.prototype.stopLoading = function () {
    this.$elem.removeClass('loading');
  };

  IssueBox.prototype.hide = function () {
    this.$elem.hide();
  };

  IssueBox.prototype.update = function (issue) {
    var that = this;

    this.$elem
      .find('.title').text(issue.id + ' - ' + issue.subject).end()
      .find('.author .content').text(issue.author.name).end()
      .find('.status .content').text(issue.status.name).end()
      .find('.assignee .content').text(issue.assigned_to ? issue.assigned_to.name : ' No one').end()
      .find('.version .content').text(issue.fixed_version ? issue.fixed_version.name : 'No version').end()

      .find('.actions').remove()
    ;

    $.each(this.workflows, function (workflowName, workflow) {
      var actions = workflow.getActionsForStatus(issue.status.id);

      if (actions) {
        var $actions = $('<div class="actions" />').addClass(workflowName);

        $.each(actions, function (actionName, action) {
          $actions.append(
            $('<button class="btn btn-sm"/>')
              .addClass(actionName)
              .data('workflow', workflowName)
              .data('action', actionName)
              .text(action.label)
          );
        });

        that.$elem.append($actions);
      }
    });
  };

  function IssueLink(issue, link, box, callbacks) {
    var that = this;

    this.issue = issue;
    this.box = box;
    this.$elem = $('<a class="__redmine_autolink--link" target="_blank" title="Go to redmine issue"/>')
      .text('#' + issue)
      .data('link', this)
      .attr('href', link);
    this.callbacks = callbacks;

    this.$elem.hoverIntent({
      over: function () {
        that.hoverIn();
      },

      out: function () {
        // no hover intent on out handler
      }
    });

    this.$elem.on('mouseleave', function (e) {
      if (!$(e.relatedTarget).is(that.box.getElem())) {
        that.hoverOut();
      }
    });
  }

  IssueLink.prototype.getElem = function () {
    return this.$elem;
  };

  IssueLink.prototype.hoverIn = function () {
    this.box && this.box.show(this);

    this.callbacks.hoverIn && this.callbacks.hoverIn(this);
  };

  IssueLink.prototype.hoverOut = function () {
    this.box && this.box.hide();

    this.callbacks.hoverOut && this.callbacks.hoverOut(this);
  };

  /**********************************************************************************************
   * Aker, help retrieve input from user.
   */

  function Prompt(question) {
    this.question = question;
  }

  Prompt.prototype.promptUntilValid = function (validators) {
    var answer = null;
    var errors = [];

    do {
      answer = prompt(this.question + (errors.length ? "\n\nErrors:\n  - " + errors.join("\n  - ") + "\n" : ''));

      if (answer === null) {
        break;
      }

      errors = [];
      $.each(validators, function (index, validator) {
        var errorMessages = validator(answer);
        if ($.isArray(errorMessages) && errorMessages.length) {
          errors = errors.concat(errorMessages);
        }
      });
    } while (errors.length);

    return answer;
  };

  function Confirmation(question) {
    this.question = question;
  }

  Confirmation.prototype.confirm = function () {
    return confirm(this.question);
  };

  /**********************************************************************************************
   * Plugin implementation.
   */

  function GitHubToRedmine() {
    this.configStorage = new PersistentStorage('github_to_redmine');

    this.observer = new DomObserver({
      childList: true,
      characterData: true,
      subtree: true
    });

    this.textHelper = new TextHelper();

    this.workflows = {};
    this.issuesBoxes = {};
  }

  GitHubToRedmine.prototype.setUp = function (workflows) {
    var that = this;
    var host = this.configStorage.get('host');

    if (!host) {
      if (!(host = this.askForRedmineHost())) {
        throw 'Host is required';
      }
      this.configStorage.set('host', host);
    }

    var apiSupport = this.configStorage.get('api_support');
    if (apiSupport === null) {
      this.configStorage.set('api_support', apiSupport = this.askForApiSupport());
    }

    if (apiSupport) {
      this.redmineApi = new RedmineApi(
        host,
        function (host) {
          return that.askForApiKey(host);
        }, {
          users: 10,
          issues: 10,
          api_user: 60 * 60 * 24
        }
      );

      this.redmineApi.retrieveApiUser(function () {
      });

      $.each(workflows, function (index, factory) {
        that.workflows[index] = factory(that.redmineApi);
      });
    }
  };

  GitHubToRedmine.prototype.askForApiKey = function (host) {
    var that = this;

    return (new Prompt('Github to Remine Plugin: Please enter your Redmine Api access key (' + host + '/my/account).'))
      .promptUntilValid([
        function (value) {
          return that.textHelper.validateApiKey(value);
        }
      ]);
  };

  GitHubToRedmine.prototype.askForRedmineHost = function () {
    var that = this;

    var uri = (new Prompt('Please enter your Redmine host (http://example.com).'))
      .promptUntilValid([
        function (value) {
          return that.textHelper.validateUri(value);
        }
      ]);

    return uri ? uri.trim().replace(/\/$/, '') : null;
  };

  GitHubToRedmine.prototype.askForApiSupport = function () {
    return (new Confirmation(
      'Github to Remine Plugin: Would you like to display information relative to issues directly in Github (require a Redmine API key) ?'
    )).confirm();
  };

  GitHubToRedmine.prototype.getIssueBox = function (issue) {
    var box = null;

    if (this.redmineApi) {
      if (!(box = this.issuesBoxes[issue])) {
        box = new IssueBox(issue, this.workflows);
        this.issuesBoxes[issue] = box;

        box.hide();

        $('body').append(box.getElem());
      }
    }

    return box;
  };

  GitHubToRedmine.prototype.newIssueLink = function (issue, box) {
    var that = this;

    return new IssueLink(issue, this.configStorage.get('host') + '/issues/' + issue, box, {
      hoverIn: function () {
        box.loading();
        that.redmineApi.retrieveIssue(issue, function (issue) {
          box.update(issue);
          box.stopLoading();
        });
      }
    });
  };

  GitHubToRedmine.prototype.autolink = function ($context) {
    var that = this;

    $('.js-issue-title, .full-commit .commit-title, .commit-title .message, .commit-message .message, .issue-title-link, .discussion-item-ref-title', $context)
      .not('.__redmine_autolink--initiator')
      .addClass('__redmine_autolink--initiator')
      .each(function () {
        var $this = $(this);
        var text = $this.text();
        var issue = that.textHelper.extractIssue(text);

        if (!issue) {
          return;
        }

        var box = that.getIssueBox(issue);
        var link = that.newIssueLink(issue, box);

        var cleanedText = that.textHelper.cleanupText(text);

        if ($this.is('a')) {
          $this.before(link.getElem()).before($('<span> - </span>')).text(cleanedText);
        } else {
          $this.empty().text(' - ' + cleanedText).prepend(link.getElem());
        }
      });
  };

  /**********************************************************************************************
   * Style.
   */

  GitHubToRedmine.prototype.dress = function () {
    // jshint multistr: true
    // jscs:disable disallowMultipleLineStrings

    $('head').append($('<style type="text/css"/>').html('\
    .__redmine_autolink--link {\
      color: #4078c0 !important;\
    }\
\
    .__redmine_autolink--link:hover {\
      text-decoration: underline !important;\
      color: #4078c0 !important;\
    }\
\
    .table-list-issues .__redmine_autolink--link, .table-list-issues .__redmine_autolink--link + span {\
      text-decoration: none;\
      font-weight: bold;\
      font-size: 15px;\
      line-height: 1.2;\
      color: #333;\
    }\
\
    .__redmine_autolink--box {\
      min-width: 350px;\
      max-width: 500px;\
      position: absolute;\
      top: 10px;\
      left: 10px;\
      background-color: #fff;\
      border: 1px solid #ddd;\
      border-radius: 3px;\
      color: #767676;\
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\
    }\
\
    .__redmine_autolink--box.loading {\
      background: url("/images/spinners/octocat-spinner-32-EAF2F5.gif") 50% 65px no-repeat #eee;\
    }\
\
    .__redmine_autolink--box.loading .properties, .__redmine_autolink--box.loading .actions .btn {\
      visibility: hidden;\
    }\
\
    .__redmine_autolink--box:before {\
      position: absolute;\
      top: -7px;\
      left: 0;\
      width: 100px;\
      height: 7px;\
      display: block;\
      content: " "\
    }\
\
    .__redmine_autolink--box .title {\
      padding: 10px 15px; \
      margin: 0; \
      color: #333;\
      background-color: #f7f7f7;\
      border-bottom: 1px solid #eee;\
      font-size: 1em;\
      border-top-left-radius: 3px;\
      border-top-right-radius: 3px;\
    }\
\
    .__redmine_autolink--box .title:before, .__redmine_autolink--box .title:after {\
      position: absolute;\
      top: -16px;\
      left: 17px;\
      width: 0;\
      height: 0;\
      display: block;\
      content: " ";\
      border-color: transparent;\
      border-style: solid outset solid outset;\
      pointer-events: none;\
    }\
\
    .__redmine_autolink--box .title:before {\
      border-bottom-color: #ddd;\
      border-width: 8px;\
    }\
\
    .__redmine_autolink--box .title:after {\
      border-width: 7px;\
      border-bottom-color: #f7f7f7;\
      margin-top: 2px;\
      margin-left: 1px;\
    }\
\
    .__redmine_autolink--box .properties {\
      padding: 15px;\
      font-size: 12px;\
      list-style: none;\
    }\
    \
    .__redmine_autolink--box .properties strong:after {\
      content: \':\';\
    }\
\
    .__redmine_autolink--box .btn + .btn {\
      margin-left: 5px;\
    }\
\
    .__redmine_autolink--box .actions {\
      padding: 10px 15px;\
      border-top: 1px solid #ddd;\
      background-color: #f7f7f7;\
    }\
\
    .__redmine_autolink--box .actions .btn {\
      padding: 1px 8px;\
    }\
\
    .__redmine_autolink--box .actions .ko {\
      color: #900;\
    }\
\
    .__redmine_autolink--box .actions .ko:hover {\
      color: #fff; \
      background-color: #b33630;\
      background-image: linear-gradient(#dc5f59, #b33630);\
      border-color: #cd504a;\
    }\
'));
  };

  GitHubToRedmine.prototype.run = function (workflows) {
    var that = this;

    this.setUp(workflows || {});
    this.dress();

    this.autolink($('body'));

    this.observer.observe(document.body, function ($context) {
      that.autolink($context);
    });
  };

  /**********************************************************************************************
   * Vendors.
   */

  (function () {
    /*!
     * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
     * http://cherne.net/brian/resources/jquery.hoverIntent.html
     *
     * You may use hoverIntent under the terms of the MIT license. Basically that
     * means you are free to use hoverIntent as long as this header is left intact.
     * Copyright 2007, 2014 Brian Cherne
     */

    $.fn.hoverIntent = function (handlerIn, handlerOut, selector) {
      var cfg = {interval: 100, sensitivity: 6, timeout: 0};
      if (typeof handlerIn === "object") {
        cfg = $.extend(cfg, handlerIn)
      } else {
        if ($.isFunction(handlerOut)) {
          cfg = $.extend(cfg, {over: handlerIn, out: handlerOut, selector: selector})
        } else {
          cfg = $.extend(cfg, {over: handlerIn, out: handlerIn, selector: handlerOut})
        }
      }
      var cX, cY, pX, pY;
      var track = function (ev) {
        cX = ev.pageX;
        cY = ev.pageY
      };
      var compare = function (ev, ob) {
        ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
        if (Math.sqrt((pX - cX) * (pX - cX) + (pY - cY) * (pY - cY)) < cfg.sensitivity) {
          $(ob).off("mousemove.hoverIntent", track);
          ob.hoverIntent_s = true;
          return cfg.over.apply(ob, [ev])
        } else {
          pX = cX;
          pY = cY;
          ob.hoverIntent_t = setTimeout(function () {
            compare(ev, ob)
          }, cfg.interval)
        }
      };
      var delay = function (ev, ob) {
        ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
        ob.hoverIntent_s = false;
        return cfg.out.apply(ob, [ev])
      };
      var handleHover = function (e) {
        var ev = $.extend({}, e);
        var ob = this;
        if (ob.hoverIntent_t) {
          ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t)
        }
        if (e.type === "mouseenter") {
          pX = ev.pageX;
          pY = ev.pageY;
          $(ob).on("mousemove.hoverIntent", track);
          if (!ob.hoverIntent_s) {
            ob.hoverIntent_t = setTimeout(function () {
              compare(ev, ob)
            }, cfg.interval)
          }
        } else {
          $(ob).off("mousemove.hoverIntent", track);
          if (ob.hoverIntent_s) {
            ob.hoverIntent_t = setTimeout(function () {
              delay(ev, ob)
            }, cfg.timeout)
          }
        }
      };
      return this.on({"mouseenter.hoverIntent": handleHover, "mouseleave.hoverIntent": handleHover}, cfg.selector)
    }
  }());

  $(function () {
    /**********************************************************************************************
     * Plugin instantiation.
     */

    var plugin = new GitHubToRedmine();

    plugin.run({
      code_review: function (redmineApi) {
        return new CodeReviewWorkflow(redmineApi);
      }
    });
  });

}(jQuery));

