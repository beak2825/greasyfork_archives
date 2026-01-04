// ==UserScript==
// @name         furigana remover 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove furigana from itazuraneko/djt online novels
// @author       EA2
// @match        https://itazuranekoyomi1.neocities.org/library/shousetu/volume/*
// @match        https://itazuranekoyomi2.neocities.org/library/shousetu/volume/*
// @match        https://djt.netlify.com/b/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/387853/furigana%20remover%202.user.js
// @updateURL https://update.greasyfork.org/scripts/387853/furigana%20remover%202.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').append('<ul><li><span>振仮名〇</span><span>振仮名Ⓧ</span></li></ul>')

    //$(document).ready(function(){
    $('ul').click(function(){
        $('ul').toggleClass('furiganaOn')
        $('rt').toggleClass('furiganaOff')
    })

    // Enable global CSS adding
    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    }

    // Add CSS
    addGlobalStyle('ul{position:fixed;top:5px;left:5px;margin:0;padding:0;width:100px;height:30px;z-index:1;border:1px solid #000;border-radius:4px;cursor:pointer;overflow:hidden;}')
    addGlobalStyle('ul.furiganaOn{border-color:#fff;}')
    addGlobalStyle('ul li{list-style:none;width:100%;height:60px;text-align:center;text-transform:uppercase;transition:0.5s;}')
    addGlobalStyle('ul.furiganaOn li{transform:translateY(-30px);}')
    addGlobalStyle('ul li span{display:block;width:100%;height:30px;line-height:30px;color:#fff;background:#000;}')
    addGlobalStyle('ul li span:nth-child(1){background:#262626;color:#fff;}')
    addGlobalStyle('ul.furiganaOn rt{display:;}')
    addGlobalStyle('.furiganaOff{display: none;}')
    //addGlobalStyle('')

})();
