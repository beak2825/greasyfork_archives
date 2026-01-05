// ==UserScript==
// @name            Hide github fork button
// @namespace       https://github.com/mozillazg/hide-github-fork-button.user.js
// @description     Hide github fork button for some reason.
// @version         0.3.0
// @author          mozillazg
// @include         https://github.com/test/*
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/18730/Hide%20github%20fork%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/18730/Hide%20github%20fork%20button.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function isContainFork() {
    return (document.querySelectorAll("#fork-destination-box").length !== 0);
  }

  function getSubmitTypeButtons() {
    var navigations = document.querySelectorAll("#js-repo-pjax-container .file-navigation button[type=submit]");
    var headers = document.querySelectorAll("#js-repo-pjax-container .file-header button[type=submit]");
    return [navigations, headers];  // edit, delete buttons
  }

  function getRepoName() {
    var href = document.querySelectorAll('#js-repo-pjax-container h1 strong[itemprop="name"] a')[0].attributes.href;
    var name = href.value;
    return name;  // "/<account>/<repo>"
  }

  function getUploadFilesButtons(repoName) {
    var urlSubContent = repoName + '/upload/';
    var selector = '#js-repo-pjax-container .file-navigation a[href^="' + urlSubContent + '"]';
    console.debug(selector);
    var buttons = document.querySelectorAll(selector);
    return buttons;
  }

  function hideFork() {
    var buttons = document.querySelectorAll(".experiment-repo-nav .pagehead-actions li");
    if (buttons.length > 2) {
      var forkButton = buttons[2];
      forkButton.remove();
    }
  }

  function hideSubmitTypeButtons() {
    var submitTypeButtons = getSubmitTypeButtons();
    submitTypeButtons.map(function(buttons) {
      buttons.forEach(function(button) {
        button.remove();
      });
    });
  }

  function hideUploadFileButtons() {
    var repoName = getRepoName();
    var buttons = getUploadFilesButtons(repoName);
    buttons.forEach(function(button) {
      button.remove();
    });
  }

  // run
  function run() {
    if (isContainFork()) {
      hideFork();
      hideSubmitTypeButtons();
      hideUploadFileButtons();
    }
  }

  // DOM targets - to detect GitHub dynamic ajax page loading
  var targets = document.querySelectorAll([
    "#js-repo-pjax-container",
    "#js-pjax-container"
  ].join(","));

  Array.prototype.forEach.call(targets, function(target) {
    // detect DOM change
    new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        run();
      });
    }).observe(target, {
      childList: true,
      subtree: true
    });
  });

  run();
})();
