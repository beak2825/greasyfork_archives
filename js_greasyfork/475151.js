// ==UserScript==
// @name         Power Automate - Show Complete Expressions
// @namespace    http://www.rnwood.co.uk/
// @version      0.2
// @description  Extends the Power Automate editor so that full expressions are displayed instead of including ...
// @author       rob@rnwood.co.uk
// @match        https://make.powerautomate.com/environments/*/flows/*
// @match        https://make.powerautomate.com/environments/*/solutions/*/flows/*
// @match        https://make.powerautomate.com/*/widgets/manage/environments/*/flows/*
// @match        https://make.powerautomate.com/*/widgets/manage/environments/*/solutions/*/flows/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=powerautomate.com
// @license      MIT
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475151/Power%20Automate%20-%20Show%20Complete%20Expressions.user.js
// @updateURL https://update.greasyfork.org/scripts/475151/Power%20Automate%20-%20Show%20Complete%20Expressions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EXPRESSIONSELECTOR = `span.msla-editor-input-token-wrapper span.msla-editor-input-token span span[data-text="true"]`;

    GM_addStyle ( EXPRESSIONSELECTOR + ` {
              max-width: none !important;
              font-family: monospace !important;
              white-space: normal !important;
              overflow-wrap: anywhere !important;
          }
    `);

    function processElement(elem) {
        debugger;
        elem.innerText = elem.parentNode.parentNode.title;
        new MutationObserver((mutationRecords) => {
            elem.innerText = elem.parentNode.parentNode.title;
        }).observe(elem.parentNode.parentNode, {attributes: true, attributeFilter:['title'] });

        elem.parentNode.parentNode.style.display = "inline-block;";
        elem.parentNode.parentNode.style.height = "fit-content";
        elem.parentNode.style.height = "fit-content";
    }

    const observer = new MutationObserver((mutationRecords) => {
        for(const mutationRecord of mutationRecords) {
            for(const addedNode of mutationRecord.addedNodes) {
                if (addedNode.nodeType == Node.ELEMENT_NODE) {
                    if (addedNode.matches(EXPRESSIONSELECTOR)) {
                        processElement(addedNode);
                    }
                    for(var elem of addedNode.querySelectorAll(EXPRESSIONSELECTOR)) {
                        processElement(elem);
                    }
                }
            }
        }
    });

    observer.observe(document, { childList: true, subtree: true });

    for(const elem of document.querySelectorAll(EXPRESSIONSELECTOR)) {
        processElement(elem);
    }
})();