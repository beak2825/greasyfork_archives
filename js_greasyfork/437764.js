// ==UserScript==
// @name         Google Tieba (no wefan no)
// @namespace    http://nobaiduno.net/
// @version      0.1
// @description  你可能进了个假贴吧，此脚本用来打醒谷歌，进入真贴吧
// @author       yui
// @match        https://wefan.baidu.com/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437764/Google%20Tieba%20%28no%20wefan%20no%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437764/Google%20Tieba%20%28no%20wefan%20no%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
var url=window.location.href;
var newurl=url.replace(/wefan/i,"tieba");
window.location.href=newurl
})();