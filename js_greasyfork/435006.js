// ==UserScript==
// @name         Re-enable browser spell checking for Adobe forums
// @namespace    http://johnrellis.com/
// @version      1.2
// @description  Re-enables browser spell checking for posting in Adobe forums
// @author       John R Ellis <ellis-lightroom@johnrellis.com>
// @match        https://community.adobe.com/t5/*
// @icon         https://www.google.com/s2/favicons?domain=adobe.com
// @grant        none
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/435006/Re-enable%20browser%20spell%20checking%20for%20Adobe%20forums.user.js
// @updateURL https://update.greasyfork.org/scripts/435006/Re-enable%20browser%20spell%20checking%20for%20Adobe%20forums.meta.js
// ==/UserScript==

function fixIframe (iframe) {
    var body = iframe.contentWindow.document.getElementById ("tinymce")
    if (body == null) return
    body.setAttribute ("spellcheck", "true")}

(function() {
    'use strict';
    var iframes = document.getElementsByTagName ("iframe")
    for (let iframe of iframes) fixIframe (iframe)
    new MutationObserver(function (records) {
        for (let record of records) {
            for (let node of record.addedNodes) {
                if (node.tagName === `IFRAME`) fixIframe (node)}}})
        .observe (document.body, {childList: true, subtree: true})})()