// ==UserScript==
// @name         Jisho.org Furigana Remover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove furigana from jisho.org results
// @author       EA2
// @match        https://jisho.org/search/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/388328/Jishoorg%20Furigana%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/388328/Jishoorg%20Furigana%20Remover.meta.js
// ==/UserScript==

// Tutorials used:
// https://somethingididnotknow.wordpress.com/2013/07/01/change-page-styles-with-greasemonkeytampermonkey/
// https://www.youtube.com/watch?v=hy27lzmButc

(function() {
    'use strict';
    // Append a ul-based button that will toggle furigana
    $('body').append('<ul id="furi"><li><span>振仮名〇</span><span>振仮名Ⓧ</span></li></ul>')

    // Apply class adjustments on click
    $('#furi').click(function(){
        $('#furi').toggleClass('furiganaOn')
        $('.furigana').toggleClass('furiganaOff')
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
    //Sets up the button
    addGlobalStyle('#furi {position:fixed;top:5px;left:5px;margin:0;padding:0;width:100px;height:30px;z-index:1;border:1px solid #51DD1C;border-radius:4px;cursor:pointer;overflow:hidden;}')
    // Adds "jisho green" color to button border
    addGlobalStyle('#furi.furiganaOn{border-color:#51DD1C;}')
    //
    addGlobalStyle('#furi li{list-style:none;width:100%;height:60px;text-align:center;text-transform:uppercase;transition:0.5s;}')
    //
    addGlobalStyle('#furi.furiganaOn li{transform:translateY(-30px);}')
    // Changes colors of OFF button (darker grey)
    addGlobalStyle('#furi li span{display:block;width:100%;height:30px;line-height:30px;color:#51DD1C;background:#48484a;}')
    // Changes color of ON button ("jisho grey")
    addGlobalStyle('#furi li span:nth-child(1){background:#5A5A5C;color:#51DD1C;}')
    //
    addGlobalStyle('#furi.furiganaOn .furigana{display:;}')
    // Hides the furigana classes
    addGlobalStyle('.furiganaOff{visibility:hidden !important;}')

})();