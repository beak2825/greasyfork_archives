// ==UserScript==
// @name         Jira-CopyTitle
// @namespace    https://github.com/Tharkis/Userscript-Jira-CopyTitle/blob/master/Userscript-Jira-CopyTitle.js
// @version      0.1.0
// @description  Adds a "Copy Task Title" button to the right of the "Workflow" dropdown in Jira.
// @author       Joe Etten
// @license      MIT
// @match        https://*.atlassian.net/secure/*
// @match        https://*.atlassian.net/browse/*
// @grant        none

// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js

// @downloadURL https://update.greasyfork.org/scripts/403585/Jira-CopyTitle.user.js
// @updateURL https://update.greasyfork.org/scripts/403585/Jira-CopyTitle.meta.js
// ==/UserScript==

(function($, JIRA) {
    'use strict';

    function addCopyButton() {
      // console.info('addCopyButton');

      if(!$('#clipboardBtn').next().length) {
        $('#clipboardBtn').remove();
        var container = $("#THIRD_PARTY_TAB .call-to-actions, .toolbar-split-left");
        container.append("<a id='clipboardBtn' class='btn aui-button aui-button-primary aui-style'>Copy Task Title</a>");
      }
    }

    function getIssueFullTitle () {
      var issueKey = "";
      var issueTitle = $('#summary-val').text();
      if($('#issuekey-val').length){
        issueKey = $('#issuekey-val').text();
      }
      if($('#key-val').length){
        issueKey = $('#key-val').text();
      }

      return issueKey + ' - ' + issueTitle;
    }

    function handleCopyButton () {

      var clipboard = new Clipboard('#clipboardBtn', {
        text: function(trigger) {
          return getIssueFullTitle();
        }
      });

      clipboard.on('success', function(e) {
        $.notify("Copied to clipboard", "success");
        $.notify(getIssueFullTitle(), "success");
      });

      clipboard.on('error', function(e) {
        $.notify("Access granted", "error");
      });
    }

    function init() {
      // console.info("init");
      updateHandlers();
      handleCopyButton();
      addCopyButton();

      JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function() {
        updateHandlers();
      });
    }

    function updateHandlers() {
      addCopyButton();
    }

    // init when page ready
    document.onreadystatechange = function() {
      if (document.readyState == "complete") {
        init();
      }
    };


})(window.$, window.JIRA);
