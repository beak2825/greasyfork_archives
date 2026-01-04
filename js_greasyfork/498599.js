// ==UserScript==
// @name         Bing Simplify
// @namespace    http://tampermonkey.net/
// @version      2024-06-22
// @description  Simplify the Bing
// @license      MIT
// @author       Sokranotes
// @match        *://*/*
// @match        https://cn.bing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498599/Bing%20Simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/498599/Bing%20Simplify.meta.js
// ==/UserScript==


// *://*/* to match the default new tab
// ref: https://stackoverflow.com/questions/45300745/can-i-run-a-userscript-on-the-new-tab-page

function click(){
    //console.log("click");
    document.querySelector('.sb_form_placeholder_query').setAttribute('style','display:none');
    document.getElementById('sa_hd').setAttribute('style','display:none');
};

(function () {
    'use strict';
    if((document.URL == 'https://cn.bing.com/chrome/newtab' || document.domain == 'cn.bing.com' || document.domain == 'bing.com') && document.title == '必应'){
        simplifyBingCN();
    }
})();

function simplifyBingCN(){
    console.log("Simplify the Bing");
    document.getElementById('vs_cont').parentElement.setAttribute('style','display:none');
    document.getElementById('sb_form_q').addEventListener = click;
    document.getElementById('id_h').setAttribute('style','display:none');
    document.getElementById('images').setAttribute('style','display:none');
    document.getElementById('video').setAttribute('style','display:none');
    document.getElementById('dots_overflow_menu_container').setAttribute('style','display:none');
    document.getElementById('est_switch').setAttribute('style','display:none');
    //cleanSearch();
}

function cleanSearch() {
    const el = document.querySelector('.SearchBar-input > input');
    const observer = new MutationObserver((mutationsList, observer) => {
        if (mutationsList[0].attributeName === 'placeholder' && mutationsList[0].target.placeholder != '') mutationsList[0].target.placeholder = '';
    });
    el.placeholder = '';
    observer.observe(el, { attributes: true });
    document.documentElement.appendChild(document.createElement('style')).textContent = '.AutoComplete-group > .SearchBar-label:not(.SearchBar-label--history), .AutoComplete-group > [id^="AutoComplete2-topSearch-"], .AutoComplete-group > [id^="AutoComplete3-topSearch-"] {display: none !important;}';
}