// ==UserScript==
// @name        Sunny Comment Screener
// @namespace   sunny-is-mod
// @description Modified version of DW blocker, allows screening of threads upon page load.
// @include     *://fail-fandomanon.dreamwidth.org/*
// @version     0.1
// @run-at      document-end
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/442333/Sunny%20Comment%20Screener.user.js
// @updateURL https://update.greasyfork.org/scripts/442333/Sunny%20Comment%20Screener.meta.js
// ==/UserScript==

var myCommentInfo = null;

function logDebug(message) {
  // Uncomment the following three lines to enable informational messages:
  // var now = new Date();
  // var millis = (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
  // console.log(millis + ": " + message);
}

function getTextElements(root, results) {
  if (! root.hasChildNodes()) {
    if (root.nodeType == 3) {
      results.push(root);
    }
  } else {
    for (var i = 0; i < root.childNodes.length; ++i) {
      getTextElements(root.childNodes[i], results);
    }
  }
}

function getText(element) {
  if (element === null) {
    return null;
  }

  var nodes = [];
  var result = "";

  getTextElements(element, nodes);
  for (var i = 0; i < nodes.length; ++i) {
    if (i > 0) result += " ";
    result += nodes[i].nodeValue;
  }

  return result;
}

function getLink(element) {
  if (element === null) {
    return null;
  } else if (element.tagName == "A") {
    return element.getAttribute("href");
  } else {
    for (var i = 0; i < element.childNodes.length; ++i) {
      var temp = getLink(element.childNodes[i]);
      if (temp !== null) {
        return temp;
      }
    }
  }

  return null;
}

function getMenuRules() {
  var rules = {};

  rules['.sunny-screener-open'] = {
    'position': 'fixed',
    'top': '40px',
    'right': '10px',
    'background-color': 'lightgray',
    'padding': '5px',
  };

  rules['.sunny-screener-open a'] = {
    'color': 'black',
  };

  rules['#dreamwidth-blocker-settings'] = {
    'background-color': 'white',
    'color': 'black',
    'transition': 'top 0.5s',
    'display': 'none',
    'position': 'fixed',
    'top': '-50%', // starts offscreen
    'left': '50%',
    'width': '800px',
    'height': '600px',
    'margin': '-300px -400px',
    'box-shadow': '10px 10px 20px rgba(0, 0, 0, 0.5)',
    'z-index': '10',
    'border': '1px solid black',
    'font-size': '14px',

  };

  rules['#dreamwidth-blocker-title'] = {
    'position': 'absolute',
    'right': '10px',
    'height': '30px',
    'line-height': '30px',
    'left': '10px',
    'top': '10px',
    'text-align': 'center',
    'font-size': '30px',
  };

  rules['#dreamwidth-blocker-tablist'] = {
    'position': 'absolute',
    'right': '0px',
    'left': '0px',
    'top': '50px',
    'height': '30px',
    'text-align': 'center',
    'border-bottom': '1px solid black',
  };

  rules['.dreamwidth-blocker-tab'] = {
    'position': 'relative',
    'display': 'inline-block',
    'margin-left': '5px',
    'margin-right': '5px',
    'padding': '5px',
    'height': '19px',
    'line-height': '19px',
    'background': 'lightgray',
    'color': 'black',
    'border': '1px solid black',
    'border-bottom': 'none',
    'box-size': 'border-box',
  };

  rules['#dreamwidth-blocker-viewport'] = {
    'position': 'absolute',
    'top': '90px',
    'left': '10px',
    'right': '10px',
    'bottom': '35px',
  };

  rules['.dreamwidth-blocker-view'] = {
    'display': 'none',
  };

  rules['.dreamwidth-blocker-active.dreamwidth-blocker-view'] = {
    'display': 'block',
  };

  rules['.dreamwidth-blocker-active.dreamwidth-blocker-tab'] = {
    'background': '#FFF',
    'border-bottom': 'none',
  };

  rules['#dreamwidth-blocker-checkboxes'] = {
    'position': 'absolute',
    'right': '0px',
    'top': '30px',
    'left': '0px',
    'bottom': '0px',
  };

  rules['.dreamwidth-blocker-left'] = {
    'position': 'absolute',
    'width': '385px',
    'top': '0px',
    'left': '0px',
    'bottom': '0px',
  };

  rules['.dreamwidth-blocker-right'] = {
    'position': 'absolute',
    'width': '385px',
    'top': '0px',
    'right': '0px',
    'bottom': '0px',
  };

  rules['#dreamwidth-blocker-refresh'] = {
    'position': 'absolute',
    'height': '15px',
    'line-height': '15px',
    'font-size': '15px',
    'left': '10px',
    'bottom': '10px',
    'right': '10px',
    'text-align': 'center',
  };

  rules['.dreamwidth-blocker-textarea'] = {
    'position': 'absolute',
    'left': '0px',
    'width': '385px',
    'top': '30px',
    'display': 'block',
    'resize': 'none',
    'box-sizing': 'border-box',
  };

  rules['#dreamwidth-blocker-css'] = {
    'position': 'absolute',
    'left': '0px',
    'top': '30px',
    'width': '780px',
    'height': '410px',
    'display': 'block',
    'resize': 'none',
    'box-sizing': 'border-box',
  };

  rules['#dreamwidth-blocker-css-reset'] = {
    'display': 'block',
    'position': 'absolute',
    'left': '0px',
    'width': '780px',
    'bottom': '0px',
    'height': '25px',
    'font-size': '15px'
  };

  rules['#dreamwidth-blocker-import'] = {
    'height': '410px',
  };

  rules['#dreamwidth-blocker-import-button'] = {
    'display': 'block',
    'position': 'absolute',
    'left': '0px',
    'width': '385px',
    'bottom': '0px',
    'height': '25px',
    'font-size': '15px'
  };

  rules['#dreamwidth-blocker-export'] = {
    'height': '445px',
  };

  rules['.dreamwidth-blocker-header'] = {
    'position': 'absolute',
    'left': '0px',
    'right': '0px',
    'top': '0px',
    'height': '20px',
    'line-height': '20px',
    'font-size': '20px',
    'text-align': 'center',
  };

  rules['.dreamwidth-blocker-list'] = {
    'position': 'absolute',
    'left': '0px',
    'right': '0px',
    'top': '30px',
    'bottom': '0px',
    'overflow': 'scroll',
  };

  rules['.dreamwidth-blocker-action'] = {
    'font-size': '12px',
    'margin-left': '5px',
    'color': 'blue !important',
  };

  rules['.dreamwidth-blocker-action:before'] = {
    'content': '"("',
  };

  rules['.dreamwidth-blocker-action:after'] = {
    'content': '")"',
  };

  rules['.dreamwidth-blocker-item'] = {
    'padding': '2px',
  };

  rules['.dreamwidth-blocker-filter:before'] = {
    'content': '\'"\'',
  };

  rules['.dreamwidth-blocker-filter:after'] = {
    'content': '\'"\'',
  };

  return rules;
}

function getDefaultRules() {
  var rules = {};

  var blockedBackground = 'pink';
  var blockedColor = 'none';
  var blockedLink = 'none';

  rules['.dreamwidth-blocker-blocked'] = {
    'background-color': blockedBackground,
    'color': blockedColor,
    'padding': '5px',
    'margin-top': '5px',
    'margin-bottom': '5px',
  };

  rules['.dreamwidth-blocker-blocked a'] = {
    'color': blockedLink,
  };

  return rules;
}

function makeStyleCode(rules) {
  var contents = "";

  for (var descriptor in rules) {
    if (! rules.hasOwnProperty(descriptor)) continue;

    contents += descriptor + " {\n";

    for (var property in rules[descriptor]) {
      if (! rules[descriptor].hasOwnProperty(property)) continue;

      contents += "    " + property + ": " + rules[descriptor][property] + ";\n";
    }

    contents += "}\n";
  }

  return contents;
}

function makeStyleSheet(str) {
  var sheet = document.createElement('style');
  sheet.innerHTML = str;
  document.body.appendChild(sheet);
}

async function loadCustomCSS() {
  var result = await GM.getValue('custom-css', null);
  if (result === null)
    result = makeStyleCode(getDefaultRules());

  return result;
}

async function getArrayLength(name) {
  return parseInt(await GM.getValue(name + "-length", 0));
}

async function setArrayLength(name, length) {
  await GM.setValue(name + "-length", length);
}

async function getArrayItem(name, index) {
  return await GM.getValue(name + "-" + index, null);
}

async function setArrayItem(name, index, value) {
  await GM.setValue(name + "-" + index, value);
}

async function cutArrayItem(name, index) {
  var oldLength = await getArrayLength(name);

  for (var i = index + 1; i < oldLength; ++i) {
    await setArrayItem(name, i - 1, await getArrayItem(name, i));
  }

  await setArrayLength(name, oldLength - 1);
  await GM.deleteValue(name + "-" + (oldLength - 1));
}

async function addArrayItem(name, value) {
  var oldLength = await getArrayLength(name);
  await setArrayItem(name, oldLength, value);
  await setArrayLength(name, oldLength + 1);
}

async function getArray(name) {
  var length = await getArrayLength(name);
  var array = [];

  for (var i = 0; i < length; ++i) {
    array.push(await getArrayItem(name, i));
  }

  return array;
}

async function getFilterSettings() {
  logDebug("Loading filter settings ...");

  var settings = {};

  settings['blacklist'] = await getArray('blacklist');
  settings['whitelist'] = await getArray('whitelist');

  var booleanNames = [
    'sunny-screen',
    'by-thread',
    'include-contents',
    'whole-words',
    'case-sensitive',
    'clear-identifiers',
    'use-regex',
    'full-only',
  ];

  for (var i = 0; i < booleanNames.length; ++i) {
    var name = booleanNames[i];
    settings[name] = await GM.getValue(name, false);
  }

  settings['custom-css'] = await loadCustomCSS();

  logDebug("Done loading filter settings.");

  return settings;
}

async function saveFilterSettings(settings) {
  logDebug("Saving filter settings ...");

  var arrayNames = ['blacklist', 'whitelist'];
  for (var i = 0; i < arrayNames.length; ++i) {
    var name = arrayNames[i];

    // delete old data
    var oldLength = await getArrayLength(name);
    for (var j = 0; j < oldLength; ++j) {
      GM.deleteValue(name + "-" + j);
    }

    setArrayLength(name, 0);

    // generate new data
    var arr = settings[name];
    for (var j = 0; j < arr.length; ++j) {
      setArrayItem(name, j, arr[j]);
    }

    setArrayLength(name, arr.length);
  }

  var booleanNames = [
    'sunny-screen',
    'by-thread',
    'include-contents',
    'whole-words',
    'case-sensitive',
    'clear-identifiers',
    'use-regex',
    'full-only',
  ];

  for (var i = 0; i < booleanNames.length; ++i) {
    var name = booleanNames[i];
    if (settings.hasOwnProperty(name)) {
      GM.setValue(name, settings[name]);
    }
  }

  if (settings.hasOwnProperty('custom-css'))
    GM.setValue('custom-css', settings['custom-css']);
}

function checkBlocked(info, filterSettings) {
  var blacklisted = checkFilter(info, filterSettings, "blacklist");

  if (blacklisted !== null) {
    var whitelisted = checkFilter(info, filterSettings, "whitelist");
    if (whitelisted !== null) {
      return null;
    }
  }

  return blacklisted;
}

function checkFilter(info, filterSettings, filterName) {
  var searchable = info['title'];
  if (filterSettings['include-contents'] && info.hasOwnProperty('content')) {
    searchable += "\n" + info['content'];
  }
  searchable += "\n" + info['ip'];

  var reModifiers = (filterSettings['case-sensitive'] ? '' : 'i');
  var filterList = filterSettings[filterName];
  var matches = [];
  for (var i = 0; i < filterList.length; ++i) {
    var reText = filterList[i];

    if (! filterSettings['use-regex']) {
      reText = reText.replace(/([.*?()\[\]\\^$])/g, "\\$1");
    }

    if (filterSettings['whole-words']) {
      reText = '(?:\\b|\\s|^)' + reText + '(?:\\b|\\s|$)';
    }

    var pattern = new RegExp(reText, reModifiers);
    if (pattern.test(searchable)) {
      matches.push(filterList[i]);
    }
  }

  if (matches.length === 0)
    return null;

  return matches;
}

function removeContents(info) {
  info['children'] = [];

  var element = info['element'];
  for (var i = 0; i < element.children.length; ++i) {
    info['children'].push(element.children[i]);
  }

  while (element.firstChild != null) {
    element.removeChild(element.firstChild);
  }
}

function restoreContents(info) {
  if (! info.hasOwnProperty('children')) {
    logDebug("No Children Found!");
    return;
  }

  var element = info['element'];
  while (element.firstChild != null) {
    element.removeChild(element.firstChild);
  }

  var children = info['children'];
  for (var i = 0; i < children.length; ++i) {
    element.appendChild(children[i]);
  }
}

function formatReasons(reasons) {
  var result = "Blocked for containing ";

  if (reasons.length == 1) {
    result += "the keyword ";
  } else {
    result += "the keywords ";
  }

  if (reasons.length == 2) {
    result += "\"" + reasons[0] + "\" and ";
  } else if (reasons.length > 2) {
    for (var i = 0; i < reasons.length - 1; ++i) {
      result += "\"" + reasons[i] + ",\" "
    }

    result += "and ";
  }

  result += "\"" + reasons[reasons.length - 1] + ".\" ";

  return result;
}

function hideComment(info, reasons, identifiers) {
  removeContents(info);

  var link = document.createElement("a");
  link.href = "javascript:void(0)";
  link.onclick = function() {
    showComment(info);
  };

  var element = info['element'];
  var blocked = document.createElement("div");
  blocked.className = "dreamwidth-blocker-blocked";
  element.appendChild(blocked);

  blocked.appendChild(document.createTextNode(formatReasons(reasons)));
  link.appendChild(document.createTextNode("Show this comment anyway."));

  blocked.appendChild(link);

  if (identifiers) {
    element.id = "";
  }
}

function showComment(info) {
  restoreContents(info);
}

function getDescendants(id, result) {
  if (myCommentInfo.hasOwnProperty(id)) {
    var children = myCommentInfo[id]['rc'];
    for (var i = 0; i < children.length; ++i) {
      result.push(children[i]);
      getDescendants(children[i], result);
    }
  }
}

function hideThread(info, reasons, identifiers, hiddenComments) {
  var descendantIDs = [];
  getDescendants(info['id'], descendantIDs);

  var descendantElements = [];
  var originalIDs = [];

  hiddenComments['cmt' + info['id']] = true;

  for (var i = 0; i < descendantIDs.length; ++i) {
    var id = "cmt" + descendantIDs[i];
    var element = document.getElementById(id);
    hiddenComments[id] = true;

    if (element !== null) {
      descendantElements.push(element);
      originalIDs.push(id);

      element.style.display = "none";
      if (identifiers) {
        element.id = "";
      }
    }
  }

  removeContents(info);

  var link = document.createElement("a");
  link.href = "javascript:void(0)";
  link.onclick = function() {
    showThread(info, descendantElements, originalIDs);
  };

  var element = info['element'];
  var blocked = document.createElement("div");
  blocked.className = "dreamwidth-blocker-blocked";
  element.appendChild(blocked);

  blocked.appendChild(document.createTextNode(formatReasons(reasons)));
  link.appendChild(document.createTextNode("Show this comment "));
  if (descendantElements.length == 1) {
    link.appendChild(document.createTextNode('(and ' + descendantElements.length + ' reply) '));
  } else if (descendantElements.length > 1) {
    link.appendChild(document.createTextNode('(and ' + descendantElements.length + ' replies) '));
  }
  link.appendChild(document.createTextNode("anyway."));

  blocked.appendChild(link);

  if (identifiers) {
    element.id = "";
  }
}

function showThread(info, descendantElements, originalIDs) {
  restoreContents(info);
  info['element'].id = "cmt" + info['id'];
  for (var i = 0; i < descendantElements.length; ++i) {
    descendantElements[i].style.display = "block";
    descendantElements[i].id = originalIDs[i];
  }
}

function getMatched(re, str) {
  var match = re.exec(str);
  if (match === null)
    return null;
  else
    return match[1];
}

function filter(comment, filterSettings, hiddenComments) {
  // skip if the comment is already hidden
  // the user is in top-level-only view, and handling should occur later
  if (comment.style.display == "none")
    return;

  var id = comment.getAttribute("id").split("cmt")[1];
  var titleElement = comment.querySelector(".comment-title");
  var title = getText(titleElement);

  var loaded = (comment.querySelector(".full") !== null);

  var ipElement = comment.querySelector(".poster-ip");
  var ip = getText(ipElement);

  var info = {};
  info['element'] = comment;
  info['id'] = id;
  info['title'] = title;
  info['loaded'] = loaded;
  info['ip'] = ip;

  if (loaded) {
    var contentElement = comment.querySelector(".comment-content");
    info['content'] = getText(contentElement);
  }

  if (filterSettings['full-only'] && ! loaded) {
    // skip comments that haven't been fully loaded
    // only if the full-only option is enabled
getText
  }

  if (filterSettings['sunny-screen']) {
    if (id !== undefined && ! hiddenComments.hasOwnProperty("cmt" + id)) {
      // none of this comment's ancestors were blocked
      var reasons = checkBlocked(info, filterSettings);
      if (reasons !== null) {
            //Screen the comment if it contains a blocked word, and no whitelisted word.
          if (!comment.innerText.includes('(screened comment)')) {
              comment.querySelector("li.link.screen_comment").firstChild.click();
              comment.querySelector("li.link.freeze_thread").firstChild.click();
          }
      }
    }
  }
}

function filterHandler(filterSettings, hiddenComments) {
  return function(e) {
    filter(e.target, filterSettings, hiddenComments);
  };
}

// find unprocessed comments and process them
function process(filterSettings, hiddenComments) {
  logDebug("Processing comments ...");

  var full = document.querySelectorAll(".dwexpcomment");

  for (var i = 0; i < full.length; ++i) {
    filter(full[i], filterSettings, hiddenComments);
  }

  logDebug("Done processing comments.");
}

function toggleSettings() {
  var settings = document.getElementById("dreamwidth-blocker-settings");
  if (settings === null) return;

  if (settings.style.display == "block") {
    settings.style.top = "-50%";
    setTimeout(function() {
      settings.style.display = "none";
    }, 500);
  } else {
    settings.style.display = "block";
    setTimeout(function() {
      settings.style.top = "50%";
    }, 50);
  }
}

function addTab(container, name, view, active, action) {
  var classView = "dreamwidth-blocker-view";
  var classActive = "dreamwidth-blocker-active";
  var classTab = "dreamwidth-blocker-tab";

  var link = document.createElement("a");
  link.className = classTab;
  link.href = "javascript:void(0)";
  var text = document.createTextNode(name);
  link.appendChild(text);
  container.appendChild(link);

  var viewElement = document.getElementById(view);
  viewElement.className = classView;

  link.onclick = function(e) {
    var views = document.getElementsByClassName(classView);
    for (var i = 0; i < views.length; ++i)
      views[i].className = classView;

    var tabs = document.getElementsByClassName(classTab);
    for (var i = 0; i < tabs.length; ++i)
      tabs[i].className = classTab;

    viewElement.className += " " + classActive;
    link.className += " " + classActive;

    if (action !== undefined && action !== null)
      action();
  };

  if (active) {
    viewElement.className += " " + classActive;
    link.className += " " + classActive;
  }
}

function makeActionLink(text, action) {
  var link = document.createElement("a");
  link.href = "javascript:void(0)";
  link.className = "dreamwidth-blocker-action";
  link.onclick = action;
  link.appendChild(document.createTextNode(text));
  return link;
}

function makeFilterItem(identifier, index, value, refresh) {
  var element = document.createElement("div");
  element.className = "dreamwidth-blocker-item";
  var filter = document.createElement("span");
  filter.className = "dreamwidth-blocker-filter";
  var textNode = document.createTextNode(value);

  var edit = makeActionLink("edit", function() {
    var text = prompt("Modify the keyword for the " + identifier + ":", textNode.nodeValue);

    if (text !== null) {
      textNode.nodeValue = text;
      setArrayItem(identifier, index, text);
    }
  });

  var remove = makeActionLink("remove", async function() {
    await cutArrayItem(identifier, index);
    await refresh();
  });

  filter.appendChild(textNode);

  element.appendChild(filter);
  element.appendChild(edit);
  element.appendChild(remove);

  return element;
}

function makeFilterList(container, identifier, title) {
  var header = document.createElement("div");
  header.className = "dreamwidth-blocker-header";

  var list = document.createElement("div");
  list.className = "dreamwidth-blocker-list";

  var refresh = async function() {
    // Load the array first to prevent visual glitches.
    var array = await getArray(identifier);

    while (list.firstChild !== null) {
      list.removeChild(list.firstChild);
    }

    for (var i = 0; i < array.length; ++i) {
      list.appendChild(makeFilterItem(identifier, i, array[i], refresh));
    }
  };

  header.appendChild(document.createTextNode(title));
  header.appendChild(makeActionLink("add", async function() {
    var text = prompt("Enter a keyword to add to the " + identifier + ":");
    if (text !== null) {
      await addArrayItem(identifier, text);
      await refresh();
    }
  }));

  refresh();

  container.appendChild(header);
  container.appendChild(list);

  return refresh;
}

function makeListTab(viewport) {
  logDebug("Making keywords tab ...");

  // Create the tab with the blacklist and whitelist.
  var keywords = document.createElement("div");
  keywords.id = "dreamwidth-blocker-keywords";
  viewport.appendChild(keywords);

  var blacklist = document.createElement("div");
  blacklist.className = "dreamwidth-blocker-left";
  var blacklistRefresh = makeFilterList(blacklist, "blacklist", "Blacklist");
  keywords.appendChild(blacklist);

  var whitelist = document.createElement("div");
  whitelist.className = "dreamwidth-blocker-right";
  var whitelistRefresh = makeFilterList(whitelist, "whitelist", "Whitelist");
  keywords.appendChild(whitelist);

  return async function() {
    await blacklistRefresh();
    await whitelistRefresh();
  };
}

async function addCheckbox(container, identifier, caption, hover) {
  var item = document.createElement("div");

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "dreamwidth-blocker-settings-" + identifier;

  checkbox.checked = await GM.getValue(identifier, false);
  checkbox.onclick = async function() {
    await GM.setValue(identifier, checkbox.checked);
  };

  var label = document.createElement("label");
  label.appendChild(document.createTextNode(caption));
  label.setAttribute('for', "dreamwidth-blocker-settings-" + identifier);
  label.setAttribute('title', hover);

  item.appendChild(checkbox);
  item.appendChild(label);
  container.appendChild(item);

  var refresh = async function() {
    checkbox.checked = await GM.getValue(identifier, false);
  };

  return refresh;
}

async function makeFilterTab(viewport) {
  logDebug("Making options tab ...");

  // Create the tab with the general settings.
  var general = document.createElement("div");
  general.id = "dreamwidth-blocker-general";
  viewport.appendChild(general);

  var header = document.createElement("div");
  header.className = "dreamwidth-blocker-header";
  header.appendChild(document.createTextNode("Filter Settings"));
  general.appendChild(header);

  var checkboxes = document.createElement("div");
  checkboxes.id = "dreamwidth-blocker-checkboxes";
  general.appendChild(checkboxes);

  var refreshList = [];


  refreshList.push(
    await addCheckbox(checkboxes, "sunny-screen",
                      "Turn on comment screener functionality?",
                      "Select this to turn on the screener!" +
                      "Works on IPs and comment text both."));

  refreshList.push(
    await addCheckbox(checkboxes, "by-thread",
                      "When a comment is blocked, hide all replies.",
                      "This is equivalent to the old setting for hiding threads, " +
                      "but additionally blocks subthreads that match the blacklist/whitelist settings.  " +
                      "Note that, even if you've whitelisted a term in one of the replies, " +
                      "the reply still won't show up if you enable this option.  " +
                      "You should only enable this if you're really and truly uninterested " +
                      "in any threads where the first post matches your blacklist/whitelist settings."));
  refreshList.push(
    await addCheckbox(checkboxes, "include-contents",
                      "Filter based on the content of the comments, not just the title.",
                      "If you want to catch words in the body of a comment, you should enable this option.  " +
                      "If you have this enabled, you should strongly consider also enabling the next option, as well.  " +
                      "If a comment contains a blacklisted word in the title and a whitelisted word in the body, " +
                      "the comment will only be whitelisted if it was loaded before being filtered."));
  refreshList.push(
    await addCheckbox(checkboxes, "full-only",
                      "Only filter comments whose contents have been loaded.",
                      "Holds off on filtering comments unless and until the whole thing has been loaded, body and all.  " +
                      "Will filter comments that are loaded with the page, and any comments loaded by clicking \"Expand.\"  " +
                      "Very useful in conjunction with the previous option."));
  refreshList.push(
    await addCheckbox(checkboxes, "use-regex",
                      "Use regular expressions in filter keywords.",
                      "By default, this userscript will escape special characters.  " +
                      "If the regex option is enabled, the user can enter arbitrary regular expressions to match comments."));
  refreshList.push(
    await addCheckbox(checkboxes, "whole-words",
                      "Keywords must appear as full words, not as partial words.",
                      "Restricts the search to only look for the filtered word or phrase " +
                      "if the beginning and end of the phrase don't run into other words."));
  refreshList.push(
    await addCheckbox(checkboxes, "case-sensitive",
                      "Keywords are case sensitive.",
                      "Enable case-sensitive matching."));
  refreshList.push(
    await addCheckbox(checkboxes, "clear-identifiers",
                      "Hide blocked comments from LJ New Comments userscript.",
                      "If this option is enabled and this script is set to execute before the LJ New Comments script, " +
                      "it will ensure that no blocked comments are marked as new.  " +
                      "Most useful for those who like to use the n/p shortcuts, " +
                      "but don't want to have to flip through all of the blocked comments.  " +
                      "Note that this will only work for comments that were blocked on page load, " +
                      "because that's when the LJ New Comments script figures out which comments are new."));

  return async function() {
    for (var i = 0; i < refreshList.length; ++i) {
      await refreshList[i]();
    }
  };
}

// Unicode fix from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

async function updateExport() {
  var exportText = document.getElementById("dreamwidth-blocker-export");
  var settings = await getFilterSettings();

  exportText.value = utf8_to_b64(JSON.stringify(settings));
  exportText.select();
  exportText.focus();
}

async function doImport() {
  var importText = document.getElementById("dreamwidth-blocker-import");

  try {
    var settings = JSON.parse(b64_to_utf8(importText.value));
    await saveFilterSettings(settings);
    updateExport();
  } catch (e) {
    alert("Invalid data.");
  }
}

function makeSaveTab(viewport) {
  logDebug("Making import/export tab ...");

  // Create the tab with save and export boxes.
  var save = document.createElement("div");
  save.id = "dreamwidth-blocker-save";
  viewport.appendChild(save);

  var importContainer = document.createElement("div");
  importContainer.className = "dreamwidth-blocker-right";
  save.appendChild(importContainer);

  var importHeader = document.createElement("div");
  importHeader.className = "dreamwidth-blocker-header";
  importHeader.appendChild(document.createTextNode("Import"));
  importContainer.appendChild(importHeader);

  var importText = document.createElement("textarea");
  importText.id = "dreamwidth-blocker-import";
  importText.className = "dreamwidth-blocker-textarea";
  importContainer.appendChild(importText);

  var importButton = document.createElement("input");
  importButton.id = "dreamwidth-blocker-import-button";
  importButton.type = "button";
  importButton.value = "Import";
  importButton.onclick = doImport;
  importContainer.appendChild(importButton);

  var exportContainer = document.createElement("div");
  exportContainer.className = "dreamwidth-blocker-left";
  save.appendChild(exportContainer);

  var exportHeader = document.createElement("div");
  exportHeader.className = "dreamwidth-blocker-header";
  exportHeader.appendChild(document.createTextNode("Export"));
  exportContainer.appendChild(exportHeader);

  var exportText = document.createElement("textarea");
  exportText.id = "dreamwidth-blocker-export";
  exportText.className = "dreamwidth-blocker-textarea";
  exportText.readOnly = true;
  exportContainer.appendChild(exportText);

  return updateExport;
}

async function updateCSS() {
  var cssText = document.getElementById("dreamwidth-blocker-css");
  cssText.value = await loadCustomCSS();
}

async function saveCSS() {
  var cssText = document.getElementById("dreamwidth-blocker-css");
  await GM.setValue('custom-css', cssText.value);
}

async function resetCSS() {
  await GM.deleteValue('custom-css');
  await updateCSS();
}

function makeColorsTab(viewport) {
  logDebug("Making colors tab ...");

  // Create the tab with the custom CSS editor.
  var colors = document.createElement("div");
  colors.id = "dreamwidth-blocker-colors";
  viewport.appendChild(colors);

  var cssHeader = document.createElement("div");
  cssHeader.className = "dreamwidth-blocker-header";
  cssHeader.appendChild(document.createTextNode("Blocked Comment Style"));
  colors.appendChild(cssHeader);

  var css = document.createElement("textarea");
  css.id = "dreamwidth-blocker-css";
  colors.appendChild(css);

  var cssButton = document.createElement("input");
  cssButton.id = "dreamwidth-blocker-css-reset";
  cssButton.type = "button";
  cssButton.value = "Reset to Default";
  cssButton.onclick = resetCSS;
  colors.appendChild(cssButton);

  css.onchange = saveCSS;

  return updateCSS;
}

async function makeSettings() {
  logDebug("Building the settings window ...");

  // Create the settings window.
  var settings = document.createElement("div");
  settings.id = "dreamwidth-blocker-settings";

  var header = document.createElement("div");
  header.id = "dreamwidth-blocker-title";
  header.appendChild(document.createTextNode("Comment Screening Tool"));
  settings.appendChild(header);

  var tabs = document.createElement("div");
  tabs.id = "dreamwidth-blocker-tablist";
  settings.appendChild(tabs);

  var viewport = document.createElement("div");
  viewport.id = "dreamwidth-blocker-viewport";
  settings.appendChild(viewport);

  var refresh = document.createElement("div");
  refresh.id = "dreamwidth-blocker-refresh";
  refresh.appendChild(document.createTextNode("Refresh the page to make your new settings and blacklist take effect."));

  settings.appendChild(refresh);
  document.body.appendChild(settings);

  // Create the tabs and add them.
  var generalRefresh = await makeFilterTab(viewport);
  var keywordsRefresh = await makeListTab(viewport);
  var saveRefresh = await makeSaveTab(viewport);
  var colorsRefresh = await makeColorsTab(viewport);

  addTab(tabs, "Blacklist & Whitelist", "dreamwidth-blocker-keywords", true, keywordsRefresh);
  addTab(tabs, "Settings", "dreamwidth-blocker-general", false, generalRefresh);
  addTab(tabs, "Custom CSS", "dreamwidth-blocker-colors", false, colorsRefresh);
  addTab(tabs, "Import & Export", "dreamwidth-blocker-save", false, saveRefresh);
}

function makeMenu() {
  logDebug("Creating 'Blocker' button ...");

  var menuOpen = document.createElement("div");
  var menuLink = document.createElement("a");

  menuOpen.className = "sunny-screener-open";
  menuOpen.appendChild(menuLink);
  //menuOpen.css({marginTop: '+=10px'});

  menuLink.href = "javascript:void(0)";
  menuLink.appendChild(document.createTextNode("Screener"));
  menuLink.onclick = toggleSettings;

  document.body.appendChild(menuOpen);
}

function getCommentInfo() {
  logDebug("Loading comment info ...");

  var query = "var LJ_cmtinfo = ";

  var scripts = document.getElementsByTagName("script");
  for (var i = 0; i < scripts.length; ++i) {
    var text = scripts[i].innerHTML;
    var index = text.indexOf(query);
    if (index != -1) {
      var json = text.substring(index + query.length);
      return JSON.parse(json);
    }
  }

  return null;
}

// only executed in the context of the original page
// don't need jQuery for the script, just for the page that loaded
var updateSetup = function() {
  // pass a message every time a comment is updated
  $(document.body).delegate("*", "updatedcontent.comment", function(e) {
    window.postMessage(e.target.id, location.href);
  });
};

async function init() {
  var filterSettings = await getFilterSettings();

  myCommentInfo = getCommentInfo();
  if (myCommentInfo === null) {
    logDebug("No comment info found ...");
    return;
  }

  var hiddenComments = {};

  try {
    process(filterSettings, hiddenComments);
  } catch (e) {
    logDebug(e);
  }

  makeSettings();
  makeMenu();

  logDebug("Creating style sheets ...");
  makeStyleSheet(makeStyleCode(getMenuRules()));
  makeStyleSheet(filterSettings['custom-css']);

  logDebug("Setting up expand comment listener ...");

  // set up the messaging system to get callbacks when comments are expanded
  var updateListener = function(e) {
    if (e.origin == location.origin) {
      if (typeof(e.data) == "string") {
        var element = document.getElementById(e.data);
        if (element != null) {
          filter(element, filterSettings, hiddenComments);
        }
      }
    }
  };

  window.addEventListener("message", updateListener);

  var script = document.createElement("script");
  script.textContent = "(" + updateSetup.toString() + ")();";
  document.body.appendChild(script);
}

init();
