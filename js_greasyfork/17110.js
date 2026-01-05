// ==UserScript==
// @name         isec style fix
// @namespace    https://greasyfork.org/en/scripts/17110-isec-style-fix
// @version      20160821
// @description  fixing isec.pt styling issues
// @author       Ivo Barros
// @twitter      @L3v3L
// @homepage     http://ibarros.com/
// @match        http*://www.isec.pt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17110/isec%20style%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/17110/isec%20style%20fix.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//replaces an image url with another url
function replaceImages(oldUrl, newUrl) {
    var imgs = document.getElementsByTagName('img');
    for (i = 0; i<imgs.length; i++) {
        imgs[i].src = imgs[i].src.replace(oldUrl, newUrl);
    }
}

var dropDownMenu = document.querySelectorAll('.dropdown-menu'), i;
for (i = 0; i < dropDownMenu.length; ++i) {
    dropDownMenu[i].style.margin = "0px";
}

replaceImages('http://www.isec.pt/custom/img/about/presidente/Foto_JorBar_siteISEC.jpg', 'https://pp.vk.me/c10868/v10868007/163/UddpNN7poTg.jpg');