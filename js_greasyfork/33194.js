// ==UserScript==
// @name         让北理工网站正常一点
// @namespace    YinTianliang_i
// @version      0.3
// @description  让北理工网站能够在chrome/firefox/等上正常运行
// @author       YinTianliang
// @grant        unsafeWindow
// @match        *://10.5.2.80/*
// @downloadURL https://update.greasyfork.org/scripts/33194/%E8%AE%A9%E5%8C%97%E7%90%86%E5%B7%A5%E7%BD%91%E7%AB%99%E6%AD%A3%E5%B8%B8%E4%B8%80%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/33194/%E8%AE%A9%E5%8C%97%E7%90%86%E5%B7%A5%E7%BD%91%E7%AB%99%E6%AD%A3%E5%B8%B8%E4%B8%80%E7%82%B9.meta.js
// ==/UserScript==



unsafeWindow.findObj = function(n, d) {return $(n);};

document.getElementById('bottom').remove();
