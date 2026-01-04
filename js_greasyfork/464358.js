// ==UserScript==
// @name               PWA Auto Dark Titlebar
// @name:zh-CN         PWA 自动深色标题栏
// @namespace          http://tampermonkey.net/
// @version            0.1
// @description        Auto apply dark titlebar for PWA follow system setting
// @description:zh-CN  根据系统设置自动设置PWA深色标题栏
// @author             TGSAN
// @match              *://*/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/464358/PWA%20Auto%20Dark%20Titlebar.user.js
// @updateURL https://update.greasyfork.org/scripts/464358/PWA%20Auto%20Dark%20Titlebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let titlebar = document.createElement("meta");
    titlebar.name = "theme-color";
    document.head.appendChild(titlebar);
    let listeners = {
        dark:(mediaQueryList) => {
            if(mediaQueryList.matches){
                titlebar.content = "#202020";
            }
        },
        light:(mediaQueryList) => {
            if(mediaQueryList.matches){
                titlebar.content = "";
            }
        }
    }
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
        titlebar.content = "#202020";
    } else if(window.matchMedia('(prefers-color-scheme: light)').matches) {
        titlebar.content = "";
    }

    window.matchMedia('(prefers-color-scheme: dark)').addListener(listeners.dark)
    window.matchMedia('(prefers-color-scheme: light)').addListener(listeners.light)
})();