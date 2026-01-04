// ==UserScript==
// @name         chatGPT显示地区不支持导致无法登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  这两天登录发现了这个问题，如果你使用的国内邮箱注册的话，即使挂上代理后chatGPT还是有可能会显示地区不支持导致无法登录，使用此脚本可以成功登录。注意必须是已经注册好的账号，并不能用于注册账号。
// @author       thunder-sword
// @match        *://auth0.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457888/chatGPT%E6%98%BE%E7%A4%BA%E5%9C%B0%E5%8C%BA%E4%B8%8D%E6%94%AF%E6%8C%81%E5%AF%BC%E8%87%B4%E6%97%A0%E6%B3%95%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/457888/chatGPT%E6%98%BE%E7%A4%BA%E5%9C%B0%E5%8C%BA%E4%B8%8D%E6%94%AF%E6%8C%81%E5%AF%BC%E8%87%B4%E6%97%A0%E6%B3%95%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.localStorage.removeItem(Object.keys(window.localStorage).find(i=>i.startsWith('@@auth0spajs')));
})();