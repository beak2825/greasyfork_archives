// ==UserScript==
// @name         Geeksforgeeks browse improve all in one
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Geeksforgeeks browse improve ultra
// @author       fvydjt
// @match        https://www.geeksforgeeks.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geeksforgeeks.org
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460587/Geeksforgeeks%20browse%20improve%20all%20in%20one.user.js
// @updateURL https://update.greasyfork.org/scripts/460587/Geeksforgeeks%20browse%20improve%20all%20in%20one.meta.js
// ==/UserScript==

let content = document.querySelector('.leftBar');
let sidebar = document.querySelector('.sidebar_wrapper');
sidebar.style.cssText = 'display:auto';
let btn;

let toggle = () => {
    let mark = document.querySelector('#btn');
    if (mark.innerText == '<') {
        sidebar.style.cssText = 'display:none';
        content.setAttribute('style', 'min-width: calc(100%) !important;');
        mark.innerText = '>';
        btn.style.left = '0px';
    } else if (mark.innerText == '>') {
        sidebar.style.cssText = 'display:auto';
        content.setAttribute('style', 'min-width: calc(80%) !important;');
        mark.innerText = '<';
        btn.style.left = '238px';
    }
};

(function () {
    'use strict';
    let cancelSticky = `
        .make_sticky {
            position: initial !important;
        }
    `;
    let sidebarChangeStyle = `
        .sidebar_wrapper {
            border:solid;
            border-color:white black white white;
        }
    `;
    // unfold the list
    let sidebarChangeHeight = `
        .sideBar {
            height:100% !important;
        }
    `;
    let cancelHeaderSticky = `
        .header-main__slider {
            position:initial !important;
        }
    `;
    GM_addStyle(cancelSticky);
    GM_addStyle(sidebarChangeStyle);
    GM_addStyle(sidebarChangeHeight);
    GM_addStyle(cancelHeaderSticky);

    // init text area width
    content.setAttribute('style', 'min-width: calc(80%) !important;');

    // remove ads in article
    let ads = document.querySelectorAll('.inArticleAds');
    for (let i = 0; i < ads.length; i++) {
        ads.outerHTML = '';
    }

    // create button for menu control
    let body = document.querySelector('body');
    btn = document.createElement('div');
    btn.setAttribute('id', 'btn');
    btn.style.cssText = 'position: fixed;z-index: 1;left: 238px;top: 300px;width: 20px;height: 30px;background: #308d46;font-size: 18px;border-radius: 0% 100% 100% 0%;padding-left: 2px;padding-top: 4px;font-weight: bold;color: #cddc39;user-select:none;';
    // btn.setAttribute('style', 'position: fixed;z-index: 1;left: 238px;top: 300px;width: 20px;height: 30px;background: #308d46;font-size: 18px;border-radius: 0% 100% 100% 0%;padding-left: 2px;padding-top: 4px;font-weight: bold;color: #cddc39;user-select:none;');
    let text_in = document.createTextNode('<');
    btn.appendChild(text_in);
    body.appendChild(btn);

    btn.addEventListener('click', toggle);

    // right bar remove
    document.getElementById('.rightBar').style.display = "none";

    // Stop GeeksForGeeks from opening its stupid login modal
    // author: https://github.com/khang06
    localStorage.setItem("gfgViewCount", 0);
    localStorage.setItem("guestPageCount", 0);

})();