// ==UserScript==
// @name         Reddit Modmail Automatic replies
// @namespace    https://terrasoft.gr/userscripts/modmail-helper/
// @version      0.1
// @description  Show automatic replies for reddit modmail
// @author       George Schizas
// @match        https://mod.reddit.com/*
// @connect      www.reddit.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/26113/Reddit%20Modmail%20Automatic%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/26113/Reddit%20Modmail%20Automatic%20replies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var optionArray = null;

    function loadData() {
        var threadId = ___r.platform.currentPage.urlParams.threadId;
        var subreddit = ___r.threads.data[threadId].owner.displayName;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.reddit.com/r/" + subreddit + "/wiki/modmail-helper.json",
            onload: function(response) {
                var wikiPage = JSON.parse(response.responseText);
                if (!wikiPage.data) {
                    console.log(wikiPage.message + ': ' + wikiPage.reason);
                    return;
                }
                optionArray = {'--select--':''};
                var newOptionArray = JSON.parse(wikiPage.data.content_md);
                for (var optionItem in newOptionArray) {
                    optionArray[optionItem] = newOptionArray[optionItem];
                }
                injectHtml();
            }
        });
    }

    function injectHtml() {
        var textArea = document.getElementsByName("body")[0];
        var replyOptions = document.getElementsByClassName("FancySelect ThreadViewerReplyForm__replyOptions")[0];
        if (!textArea || !replyOptions) {
            return;
        }

        var macroText = document.createElement("select");

        for (var optionValue in optionArray) {
            var option = document.createElement("option");
            option.value = optionValue;
            option.text = optionValue;
            macroText.appendChild(option);
        }

        macroText.className = 'FancySelect ThreadViewerReplyForm__replyOptions';
        macroText.addEventListener("change", macroSelected);
        replyOptions.parentElement.insertBefore(macroText, replyOptions);

    }

    function macroSelected(e) {
        var selectedValue = e.target.selectedOptions[0].value;
        if (selectedValue == '--select--') {
            return;
        }
        var textArea = document.getElementsByName("body")[0];
        textArea.textContent += optionArray[selectedValue] + '\n';
    }

    function init() {
        loadData();
    }

    init();
})();