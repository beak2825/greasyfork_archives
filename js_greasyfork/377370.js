// ==UserScript==
// @name         Tv Series Toolkit Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects user to requested episode. Works with Tv Series Toolkit
// @author       Noruf
// @match        https://www.cda.pl/*/folder/*
// @match        https://fili.cc/serial/*
// @match        http://seriale.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377370/Tv%20Series%20Toolkit%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/377370/Tv%20Series%20Toolkit%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cdaRedirect(){
        const regex=new RegExp(se,"i");
        const link = Array.from(document.querySelectorAll(`a.link-title-visit`))
        .find(x=>regex.test(x.text));
        if(link)link.click();
    }

    function filiccRedirect(){
        const link = document.querySelector(`a[href*="${se}"]`);
        if(link)link.click();
    }
    function serialecoRedirect(){
        const search = se.toUpperCase();
        const link = document.querySelector(`.seod[data=${search}]`);
        if(link)link.click();
    }

    function onReadyEvent(callback){
        if (document.readyState!='loading') callback();
        else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
        else {document.attachEvent('onreadystatechange', function(){
            if (document.readyState=='complete') callback();
        });}
    }

    const url = new URL(window.location.href);
    const se = url.searchParams.get("se");
    if(!se)return;
    switch(window.location.host){
        case "www.cda.pl": onReadyEvent(cdaRedirect);break;
        case "fili.cc": onReadyEvent(filiccRedirect);break;
        case "seriale.co": onReadyEvent(serialecoRedirect);break;
        default: break;
    }
})();