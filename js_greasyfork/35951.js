// ==UserScript==
// @name         zimuzu
// @version      0.3
// @description  在片名后添加老下载页面链接!
// @author       You
// @match        http://www.zimuzu.tv/*
// @match        https://www.zimuzu.tv/*
// @match        http://www.zimuzu.io/*
// @match        https://www.zimuzu.io/*
// @match        http://www.rrys2019.com/*
// @match        https://www.rrys2019.com/*
// @grant        none

// @namespace https://greasyfork.org/users/49924
// @downloadURL https://update.greasyfork.org/scripts/35951/zimuzu.user.js
// @updateURL https://update.greasyfork.org/scripts/35951/zimuzu.meta.js
// ==/UserScript==

$(function() {
    $("#play_status").append("<a style='color:red;' href='"+location.href.replace("/resource/","/resource/list/")+"'>----下载----</a>");
});



