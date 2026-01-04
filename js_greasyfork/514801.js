// ==UserScript==
// @name         iframe最大化
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  将当前页面中的iframe最大化，并可以回退到原始页面。
// @author       liheji
// @match        http://mis.duxiaoman-int.com/*
// @match        http://hamlet.docker.duxiaoman-int.com/*
// @match        http://xloan.strategyplatform.duxiaoman-int.com/*
// @match        http://fscene-strategy-platform-fe.docker.duxiaoman-int.com/*
// @icon         https://www.duxiaoman.com/static/fe-duxiaoman/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514801/iframe%E6%9C%80%E5%A4%A7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/514801/iframe%E6%9C%80%E5%A4%A7%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    if (window.self !== window.top) {
        // Script is running in iframe, do nothing
        return;
    }

    function createButton(text, onClick) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.display = 'block';
        button.addEventListener('click', onClick);
        document.body.appendChild(button);
        return button;
    }

    if (location.href.indexOf("strategy") == -1 && location.href.indexOf("platform") == -1) {
        // Create fullscreen button
        var fullscreenButton = createButton('全屏', function() {
            var oldUrl = location.href; // Get current URL as oldUrl
            var ife = document.getElementById("iframeEle"); // Get iframe element
            if (ife) {
                location.href = ife.src;
                GM_setValue('pre_url', oldUrl);
            } else {
                console.log('No nextUrl found.');
            }
        });
    } else {
        // Create restore button
        var restoreButton = createButton('恢复', function() {
            var defaultUrl = "http://hamlet.docker.duxiaoman-int.com/static/mis2/#/branch/manage"
            if (location.href.indexOf("docker") == -1) {
                defaultUrl = "http://mis.duxiaoman-int.com/static/mis2/#/branch/manage"
            }
            var nextUrl = GM_getValue('pre_url') || defaultUrl;
            GM_deleteValue('pre_url')
            location.href = nextUrl
        });
    }
})();