/*jshint esversion: 6 */ 
// ==UserScript==
// @name         yandex-image-buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try to overcome anti-features!
// @author       You
// @match        http*://yandex.ru/images/search*
// @match        http*://yandex.ru/images/search?img_url=*&rpt=simage*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432442/yandex-image-buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/432442/yandex-image-buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var myhackydiv = document.createElement('myhackydiv');
    myhackydiv.classList.add('myhackybuttons');
    myhackydiv.innerHTML = '<ul class="myhackybtn_list"><li><button class="myhackybtn open"><div class="myhackyicon"></div><div class="myhackybtn_text"><span class="txt">Open</span></div></button></li><li><button class="myhackybtn same"><div class="myhackyicon"></div><div class="myhackybtn_text"><span class="txt">Same</span></div></button></li></ul>';
    document.body.appendChild(myhackydiv);
    // Create our new STYLE element
    var mysheet = (function() {
        // Create the <style> tag
        var style = document.createElement("style");
        // Add a media (and/or media query) here if you'd like!
        // style.setAttribute("media", "screen")
        // style.setAttribute("media", "only screen and (max-width : 1024px)")
        // WebKit hack :(
        style.appendChild(document.createTextNode(""));
        // Add our <style> element to the page
        document.head.appendChild(style);
        return style.sheet;
    })();
	// Crossbrowser function to add css rules
    function addCSSRule(sheet, selector, rules, index) {
        if("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
        else if("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }
    }
    // Use it!
    addCSSRule(mysheet, ".myhackybuttons", "position: fixed; bottom: 20px; left: calc(50% - 130px); z-index: 999999;");
    addCSSRule(mysheet, ".myhackybuttons .myhackybtn_list, myhackybuttons .myhackybtn_list *", "box-sizing: border-box;font-size: 14px;");
    addCSSRule(mysheet, ".myhackybuttons .myhackybtn_list", "list-style: none; text-align: center; width: 260px; background: rgba(0,0,0,0.3); border-radius: 50px; box-shadow: rgba(0, 0, 0, 0.65) 0px 6px 28px; margin: 0; padding: 0; overflow: hidden;");
    addCSSRule(mysheet, ".myhackybuttons li", "display: inline-block; padding: 0; margin: 0; margin-right: 20px; cursor: pointer");
    addCSSRule(mysheet, ".myhackybuttons .myhackybtn", "display: flex; justify-content: center; align-items: center; margin: 0; overflow: hidden; padding: 10px 10px; cursor: pointer; background: none; border: none;");
    addCSSRule(mysheet, ".myhackybuttons li:last-child", "margin-right: 0;");
    addCSSRule(mysheet, ".myhackybuttons .myhackyicon", "width: 1.37em; height: 1.37em;");
    addCSSRule(mysheet, ".myhackybuttons .myhackybtn.open .myhackyicon", "transform: rotate(225deg); background: url(\"data:image/svg+xml,%3Csvg width='16' height='17' viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Cpath d='M8 1.5V15.5M8 15.5L15 8.5M8 15.5L1 8.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E %3C/svg%3E \") no-repeat;");
    addCSSRule(mysheet, ".myhackybuttons .myhackybtn.same .myhackyicon", "background: url(\"data:image/svg+xml,%3Csvg width='18' height='19' viewBox='0 0 18 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Cpath d='M1 1.5H7.22222V7.72222H1V1.5Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E %3Cpath d='M10.7778 1.5H17V7.72222H10.7778V1.5Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E %3Cpath d='M10.7778 11.2778H17V17.5H10.7778V11.2778Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E %3Cpath d='M1 11.2778H7.22222V17.5H1V11.2778Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E %3C/svg%3E  \") no-repeat;");
    addCSSRule(mysheet, ".myhackybuttons .myhackybtn_text", "padding: 0 0 0 13px; overflow: hidden;");
    addCSSRule(mysheet, ".myhackybuttons .txt", "color: white; font-family: sans-serif; font-weight: normal; font-size: 1.2em; line-height: 1.37em; text-align: left; vertical-align: middle;");

	// At last set click events to buttons
    var openimg = document.querySelector(".myhackybtn.open");
    var sameimg = document.querySelector(".myhackybtn.same");
    openimg.addEventListener('click', ()=>{
        document.querySelector("a.MMViewerButtons-OpenImage").click();
        setTimeout(() => document.querySelector("a.MMUnauthPopup-Skip").click(), 150);
    });
    sameimg.addEventListener('click', ()=>{
        document.querySelector("a.MMViewerButtons-SearchByImage").click();
        setTimeout(() => document.querySelector("a.MMUnauthPopup-CloseIcon").click(), 150);
        document.querySelector("a.MMViewerButtons-SearchByImage").click();
    });
})();