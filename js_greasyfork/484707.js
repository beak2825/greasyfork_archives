// ==UserScript==
// @name         GXOJ 美化
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  让网站变得更加美观
// @author       So_noSlack
// @match        https://zyz.tboj.cn/*
// @match        http://tboj.cn/*
// @match        http://gxoj.tboj.cn/*
// @match        http://118.195.142.166/*
// @license      MIT
// @icon         http://118.195.142.166/file/2/GXOJ_logo.png
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/484707/GXOJ%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/484707/GXOJ%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*卡片圆角*/
    const a = document.createElement('style');
    a.innerHTML = `.section{border-radius:15px}`;
    document.head.append(a);

})();