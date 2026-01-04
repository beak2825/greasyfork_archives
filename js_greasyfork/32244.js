// ==UserScript==
// @name        Wanikani Random Font II
// @namespace   wanikanirandomfontii
// @description The script changes the font for questions in Wanikani reviews into randomly selected from list, allowing you to practice various typefaces and forms of the kanji. Based on Wanikani Random Font script by Mempo. Before using, edit the list or install fonts specified there!
// @include     http://www.wanikani.com/review/session
// @include     https://www.wanikani.com/review/session
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32244/Wanikani%20Random%20Font%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/32244/Wanikani%20Random%20Font%20II.meta.js
// ==/UserScript==

// Thanks go to:
//   - Mempo, the author of the original script
//   - Google and Stackoverflow, since I know nothing about JS and WEB dev :)

$(function() {
    // Fonts list - add yours, delete those you don't have
    var fonts = [
        "EPSON 教科書体Ｍ",
        "EPSON 正楷書体Ｍ",
        "EPSON 行書体Ｍ",
        "藍原筆文字楷書",
        "青柳隷書SIMO2_T",
        "英椎楷書",
        "いろはマルみかみ Light",
        "無心",
        "RAKO_FONT",
        "nukamiso",
        "仕事メモ書き",
        "さなフォン悠",
        "春夏秋冬ⅡB",
        null            // To get the default one occasionally
        ];

    // Change the font randomly and show the original one on mouse hover
    var randomFont = function() {
        var chosen = fonts[Math.floor(Math.random() * fonts.length)];
        var jpElem = document.getElementById('character').firstElementChild;

        jpElem.style.fontFamily = chosen;

        jpElem.onmouseover = function() {
	        jpElem.style.fontFamily = null;
        }

        jpElem.onmouseout = function() {
	        jpElem.style.fontFamily = chosen;
        }
    };   
    
    var o = new MutationObserver(randomFont);
    o.observe(document.getElementById('character'), {'attributes' : true});
});