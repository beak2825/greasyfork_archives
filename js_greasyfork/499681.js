// ==UserScript==
// @name         Facilitating learncpp.com
// @namespace    http://github.com/basilguo
// @description  Move the control button from bottom to top. This is not a responsive script.
// @author       Basil Guo
// @match        https://www.learncpp.com/cpp-tutorial/*
// @icon         https://www.learncpp.com/blog/wp-content/uploads/learncpp.png
// @homepageURL  https://gist.github.com/BasilGuo/84350a125bcb864abe2a779a2768c381
// @license      MIT
// @version      2024-07-04-02
// @note         2024-07-04-02 Modify the description.
// @note         2024-07-04-01 Modify the description.
// @note         2024-07-04-00 Conceal the text as default and will appear after hovering the control buttons.
// @note         2024-05-23-00 Create the script.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499681/Facilitating%20learncppcom.user.js
// @updateURL https://update.greasyfork.org/scripts/499681/Facilitating%20learncppcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    document.body.style.cssText += 'font-size: 1em';
    let pndiv = document.querySelector('.prevnext');
    pndiv.style.cssText = `position:fixed;top:0;width:100%;z-index:101;background-color:#fff`;
    let header = document.querySelector('header')
    header.appendChild(pndiv);

    let prevnext_inline = document.querySelector('.prevnext-inline');
    prevnext_inline.style.cssText = `width:100%;display:flex;flex-direction:row-reverse;max-width:100%;justify-content:space-around;align-items:center;background-color:#fff;margin-top:0`;


    let prevBtn = document.querySelector('.nav-button-prev');
    let prevBtnText = document.querySelector('.nav-button-prev .nav-button-text');
    prevBtn.onmouseover = function(){prevBtnText.style.display = '';};
    prevBtn.onmouseout = function(){prevBtnText.style.display = 'none';};
    prevBtnText.style.display = 'none';

    let nextBtn = document.querySelector('.nav-button-next');
    let nextBtnText = document.querySelector('.nav-button-next .nav-button-text');
    nextBtn.onmouseover = function(){nextBtnText.style.display = '';};
    nextBtn.onmouseout = function(){nextBtnText.style.display = 'none';};
    nextBtnText.style.display = 'none';

    let homeBtn = document.querySelector('.nav-button-index');
    let homeBtnText = document.querySelector('.nav-button-index .nav-button-text');
    let homeBtnIcon = document.querySelector('.nav-button-index .nav-button-icon');
    homeBtn.onmouseover = function(){homeBtnText.style.display = '';};
    homeBtn.onmouseout = function(){homeBtnText.style.display = 'none';};
    homeBtnText.style.cssText = `display:none;line-height:42px;font-size:42px;margin:auto;padding:0 0 0 10px`;
    homeBtnIcon.style.cssText = `width:42px;height:42px;line-height:42px;font-size:42px;margin:auto`;
})();