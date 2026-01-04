// ==UserScript==
// @name         MOTRIMGv3
// @namespace    http://tampermonkey.net/
// @version      2024-09-19
// @description  fix missing images at motr-online.com
// @author       MOTRIMG
// @match        https://motr-online.com/*
// @match        http://motr-online.com/*
// @license      WTFPL
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/509160/MOTRIMGv3.user.js
// @updateURL https://update.greasyfork.org/scripts/509160/MOTRIMGv3.meta.js
// ==/UserScript==

/*globals $*/

$(document).ready(function(){
    //заменяем адреса картинок на спрятанные (О1 спрятал картинки с сайта, добавив к каждой "_" в конце
    document.body.innerHTML = document.body.innerHTML.replace(new RegExp("//dbpic.motr-online.com/dbpic/","g"), "//dbpic.motr-online.com/dbpic_/");
    //я хз что это за штука, но без этого некоторые картинки не грузятся
    document.body.innerHTML = document.body.innerHTML.replace(new RegExp("  alt=","g"), "");
});