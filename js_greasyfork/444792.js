// ==UserScript==
// @name         Geekbang player tweak
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tweak caption size
// @author       You
// @match        https://u.geekbang.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geekbang.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444792/Geekbang%20player%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/444792/Geekbang%20player%20tweak.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var fontSize = 55;
        var btn = document.createElement('button');
        btn.type = 'button';
        var style = btn.style;
        style.position = 'absolute';
        style.top = '190px';
        style.right = '10px';
        style.zIndex = 9999;
        style.paddingLeft = '10px';
        style.paddingRight = '10px';
        style.background = 'linear-gradient(-30deg,#f2802a,#fe9022)';
        style.border = 'none';
        style.boxShadow = '1px 3px 15px 0 rgb(242 128 42 / 20%)';
        style.boxSizing = 'border-box';
        style.width = '40px';
        style.height = '40px';
        style.borderRadius = '40px';
        style.cursor = 'pointer';
        var icon = document.createElement('i');
        icon.classList.add('iconfont');
        icon.innerHTML = '😀';
        btn.appendChild(icon);
        document.body.appendChild(btn);
        var options = {
            actived: false
        };
        btn.addEventListener('click', function () {
            function resetFontStyle(e) {
                e.removeAttribute('style');
            }
            function setFontStyle(e) {
                var style = e.style;
                style.fontSize = fontSize + 'px';
                style.lineHeight = fontSize + 'px';
                style.bottom = '100px';
            }
            var captionChildren = document.querySelector('.gkplayer').childNodes;
            var container = captionChildren[6];
            var backdrop = captionChildren[5];
            if (options.actived) {
                resetFontStyle(container);
                resetFontStyle(backdrop);
                options.actived = false;
            } else {
                setFontStyle(container);
                setFontStyle(backdrop);
                options.actived = true;
            }
        });
    }, false);
})();