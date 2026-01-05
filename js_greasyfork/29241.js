// ==UserScript==
// @name         i-Comic Player Page Bug Fix / Allow fullscreen
// @name:zh-CN   i-Comic 爱动漫 bug 修复/允许全屏
// @name:zh-TW   i-Comic 愛動漫 bug 修複/允許全屏
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fixes misc bugs, allow fullscreen for googlevideo
// @description:zh-CN    1.允许googlevideo全屏 2.修复宽度小于约600px后播放窗口无法点击的bug
// @description:zh-TW    1.允許googlevideo全屏 2.修複寬度小于約600px後播放窗口無法點擊的bug
// @author       Yifan Gu
// @match        http://www.i-comic.net/anime/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29241/i-Comic%20Player%20Page%20Bug%20Fix%20%20Allow%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/29241/i-Comic%20Player%20Page%20Bug%20Fix%20%20Allow%20fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    var playerContainer = getElementByXpath('/html/body/div[2]');
    var oldContainerStyle = playerContainer.getAttribute('style');
    oldContainerStyle = oldContainerStyle ? oldContainerStyle : '';
    var newContainerStyle = oldContainerStyle + ' z-index: 100;';
    playerContainer.setAttribute('style', newContainerStyle);
    //fix body padding
    var body = document.getElementsByTagName('body')[0];
    var oldBodyStyle = body.getAttribute('style');
    oldBodyStyle = oldBodyStyle ? oldBodyStyle : '';
    var newBodyStyle = oldBodyStyle + ' padding-top: 50px;';
    body.setAttribute('style', newBodyStyle);
    //allowfullscreen
    var vid = document.getElementById('player');
    function onChange () {
        var iframes = vid.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {
            if (iframes[i].allowFullscreen !== true) {
                iframes[i].allowFullscreen = true;
            }
        }
    }
    vid.addEventListener('DOMSubtreeModified', onChange, false);
    onChange();
})();
