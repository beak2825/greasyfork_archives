// ==UserScript==
// @name         Prompt On New Tab
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.2.19
// @license      GNU AGPLv3
// @author       jcunews
// @description  Display a confirmation dialog when the site wants to open a new tab, so that user has the chance to cancel or allow it to open in a new or current tab. This script won't work if the user opens a link in a new tab using web browser's "Open in a new tab", "Open in background tab", or similar which are web browser internal or browser extension features.
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/38392/Prompt%20On%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/38392/Prompt%20On%20New%20Tab.meta.js
// ==/UserScript==

/*
The rejectList and allowList contains the list of source-target rules. The main purpose of these lists
is to provide an automated action on whether opening a new tab is allowed or not. Any matching
rejectList rule will reject the new tab to open without prompting the user. Any matching allowList rule
will allow the new tab to open without prompting the user.

rejectList has higher priority than allowList. Each source-target rule is an array of two values:
*SourceURL* then *TargetURL*. *SourceURL* denotes the current tab's URL, while *TargetURL* denotes the
new tab's URL.

Both source and target URL values can be either a string type or a regular expression object. Each will
be compared against the whole URL.

If string type is used, it must match the whole URL instead of part of it. The comparison is done
without case sensitivity (i.e. character case is ignored). A `*` wildcard can be used to match any one
or more characters. e.g.:

- `"*"` will match any URL.

- `"*://www.site.com/*"` will match against `http://www.site.com/` including
  `http://www.site.com/home`.

- `"www.site.com"` will never match against `http://www.site.com/`.

- `"*www.site.com*"` will match against `http://www.site.com/` but also against
  `http://www.proxy.com/?url=http://www.site.com/`.

- `"*://* /*www.site.com*"` (without the space in the middle) will match against
  `http://www.proxy.com/?url=http://www.site.com/` but not against `http://www.site.com/`.

- `"*url=*www.site.com*"` will match against `http://www.proxy.com/?url=http://www.site.com/`
  but also against `http://www.proxy.com/?url=http://www.other.com/&alt=http://www.site.com/`.

If regular expression object is used, it may match only part of the whole URL, depending on the regular
expression pattern itself. The comparison is done with or without case sensitivity, depending on the
regular expression flags.

A source-target rule will match if the source and target URLs matches.
*/

((open_, submit_, wael, ele) => {

  //===== CONFIGURATION BEGIN =====

  var rejectList = [
    ["*", "*://*.doubleclick.net/*"],
    ["*", /^https?:\/\/[^.]+\.adservices?\.com\//i],
    ["*://site.com/*", /^.*?:\/\/site\.com\/(offer|popup)/i]
  ];

  var allowList = [
    ["*://www.bing.com/*", "*"],
    ["*://www.google.*/*", "*://*.google.*/*"]
  ];

  //If promptToOpenInCurrentTab is enabled, when the confirmation dialog is shown and the user chose
  //Cancel, an additional confirmation dialog will be shown to confirm whether the URL should be
  //opened in current tab or not.
  var promptToOpenInCurrentTab = true;

  //===== CONFIGURATION END =====

  [rejectList, allowList].forEach(list => {
    list.forEach(pair => {
      pair.forEach((str, i) => {
        if (("string" === typeof str) || (str instanceof String)) {
          pair[i] = new RegExp("^" + str.replace(/([(){}\[\]\\^$.+?|])/g,
            "\\$1").replace(/([*])/g, ".*?") + "$", "i");
        }
      });
    });
  });

  function checkUrl(target, curUrl) {
    function checkUrlPair(pair) {
      return pair[0].test(curUrl) && pair[1].test(target);
    }

    curUrl = location.href;
    if (rejectList.some(checkUrlPair)) {
      return -1;
    } else if (allowList.some(checkUrlPair)) {
      return 1;
    } else return 0;
  }

  function dummy(){}

  function doWindow(w, z) {
    try {
      if (w.name) this.push(w.name);
      (w.contentWindow || w).document.querySelectorAll("iframe,frame").forEach(doWindow, this);
    } catch(z) {}
  }

  function isExistingFrameName(name, a, w, p, z) {
    if (!name) return true;
    a = ["_parent", "_self", "_top"];
    if (top !== window) {
      try {
        top.name;
        w = top;
      } catch(z) {
        w = window;
        while ((w = w.parent) && (w !== p)) {
          try {
            w.name;
          } catch(z) {
            w = null;
          }
          p = w;
        }
        w = w || p;
      }
    } else w = window;
    if (w) doWindow.call(a, w);
    return a.includes(name);
  }

  open_ = window.open;
  window.open = function(url, name) {
    var loc = {};
    if (isExistingFrameName(name)) {
      return open_.apply(this, arguments);
    } else switch (checkUrl(url)) {
      case 1:
        return open_.apply(this, arguments);
      case 0:
        if (confirm("This site wants to open a new tab.\nDo you want to allow it?\n\nURL:\n" + url)) {
          return open_.apply(this, arguments);
        } else if (
          promptToOpenInCurrentTab &&
          confirm("URL:\n" + url + "\n\nDo you want to open it in current tab instead?")
        ) {
          name = "_top";
          return open_.apply(this, arguments);
        }
    }
    return {
      document: {
        close: dummy,
        location: loc,
        open: dummy,
        write: dummy
      },
      location: loc
    };
  };

  function reject(ev) {
    if (!ev || !ev.preventDefault) return;
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
  }

  function actionCheckUrl(ele, url, msg, ev) {
    switch (checkUrl(url)) {
      case 0:
        if (!confirm(msg + "\nDo you want to allow it?\n\nURL:\n" + url)) {
          if (
            promptToOpenInCurrentTab &&
            confirm("URL:\n" + url + "\n\nDo you want to open it in current tab instead?")
          ) {
            ele.target = "_top";
            break;
          }
          reject(ev);
          return false;
        } else break;
      case -1:
        reject(ev);
        return false;
    }
    return true;
  }

  function onFormSubmit(ev) {
    if ((/^https?:/).test(this.action) && !isExistingFrameName(this.target) &&
       !actionCheckUrl(this, this.action, "This site wants to submit a form in a new tab.")) return;
    return submit_.apply(this, arguments);
  }
  submit_ = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = onFormSubmit;

  function windowSubmit(ev){
    if (
      !ev.defaultPrevented &&
      (/^https?:/).test(ev.target.action) && !isExistingFrameName(ev.target.target)
    ) {
      return actionCheckUrl(ev.target, ev.target.action,
        "This site wants to submit a form in a new tab.", ev);
    }
  }
  addEventListener("submit", windowSubmit);

  function onAnchorClick(ev) {
    if ((/^(?:f|ht)tps?:/).test(this.href) && !isExistingFrameName(this.target)) {
      return actionCheckUrl(this, this.href, "This site wants to open a new tab.", ev);
    }
    return;
  }

  function windowClick(ev, a){
    if (ev.button || !(a = ev.target) || ev.defaultPrevented) return;
    if (a.tagName === "A") {
      return onAnchorClick.call(a, ev);
    } else while (a = a.parentNode) {
      if (a.tagName === "A") return onAnchorClick.call(a, ev);
    }
  }
  addEventListener("click", windowClick);

  wael = window.addEventListener;
  window.addEventListener = function(type, fn) {
    var res = wael.apply(this, arguments);
    if (type === "click") {
      removeEventListener("click", windowClick);
      wael("click", windowClick);
    } else if (type === "submit") {
      removeEventListener("click", windowSubmit);
      wael("submit", windowSubmit);
    }
    return res;
  };

})();
