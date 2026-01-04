// ==UserScript==
// @name         Geekforgeeks
// @namespace    http://tampermonkey.net/
// @version      0.7.3
// @description  try to take over the world!
// @author       You
// @match        https://www.geeksforgeeks.org/*
// @icon         https://www.google.com/s2/favicons?domain=geeksforgeeks.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428443/Geekforgeeks.user.js
// @updateURL https://update.greasyfork.org/scripts/428443/Geekforgeeks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName('article-page_flex')[0].style.backgroundColor = '#272822';

    document.getElementsByClassName('title')[0].style.color = '#48b22b';

    document.getElementsByClassName('a-wrapper')[0].style.left = '25%';
    document.getElementsByClassName('a-wrapper')[0].style.backgroundColor = '#272822';

    document.getElementsByClassName('text')[4].style.fontSize = '20px';
    document.getElementsByClassName('text')[4].style.textAlign = 'Justify';
    document.getElementsByClassName('text')[4].style.color = '#e6db74';

    var p_list = document.getElementsByTagName('p');
    for(let i = 0; i<p_list.length;i++){p_list[i].style.color = '#e6db74'};
    for(let i = 0; i<3;i++){p_list[p_list.length-1].remove();};

    var strong_list = document.getElementsByTagName('strong');
    for(let i = 0; i<strong_list.length;i++){strong_list[i].style.color = '#48b22b'};

    var italic_list = document.getElementsByTagName('i');
    for(let i = 0; i<italic_list.length;i++){italic_list[i].style.color = '#59d9ef'};

    var pre_list = document.getElementsByTagName('pre');
    for(let i = 0; i<pre_list.length;i++){pre_list[i].style.color = '#48b22b'};

    var br_list = document.getElementsByTagName('br');
    for(let i = 0; i<4;i++){br_list[br_list.length-3].remove();};
    //var tb_list = document.getElementsByClassName('code-block'); for(let i = 0; i<tb_list.length;i++){tb_list[i].style.cssText = 'border: 1px solid black'};

    var img_list = document.getElementsByTagName('img');
    for(let i = 0; i<img_list.length;i++){img_list[i].style.cssText = 'max-height: 100% !important;height: 100% !important'};

    var header_bookmark = document.getElementsByClassName('header-main__slider-flex-inner')[1];
    document.getElementsByClassName('header-main__left-list')[0].appendChild(header_bookmark);

})();