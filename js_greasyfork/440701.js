// ==UserScript==
// @name         扑家显示下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  扑家显示下载按钮 扑家显示下载按钮
// @author       You
// @match        http*://www.pujia8.com/library/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440701/%E6%89%91%E5%AE%B6%E6%98%BE%E7%A4%BA%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/440701/%E6%89%91%E5%AE%B6%E6%98%BE%E7%A4%BA%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var html = $('#game_dl').html()
    html = html.replace('<!--','')
    html = html.replace('-->','')
    $('#game_dl').html(html)
})();