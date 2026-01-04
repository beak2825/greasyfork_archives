// ==UserScript==
// @name         Gitlab 增强
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Gitlab 变好看点～
// @author       You
// @match        https://code.byted.org/*
// @match        *gitlab.com*
// @icon         https://about.gitlab.com/ico/mstile-144x144.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440070/Gitlab%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/440070/Gitlab%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addNewStyle('.ci-table .branch-commit .ref-name {max-width: unset; display: block; overflow: unset;}');
    addNewStyle('.flex-truncate-child:hover{overflow: unset}');
    addNewStyle('.branch-commit .icon-container {display: none}');
    addNewStyle('#bytedance-gitlab-watermark {display: none}');
})();



function addNewStyle(newStyle) {
    console.log("👴 add new style:", newStyle)
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
}