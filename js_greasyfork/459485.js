// ==UserScript==
// @name         CN Bing return to Global Bing
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  重定向国内版bing到国际版bing
// @author       You
// @license MIT
// @match        https://cn.bing.com/search*
// @match        https://cn.bing.com/*
// @match        https://www.bing.com
// @match        https://cn.bing.com/
// @match        https://cn.bing.com
// @match        https://global.bing.com/*
// @match        https://www.bing.com/
// @match        https://bing.com/*
// @match        https://bing.com/
// @match        https://www.bing.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459485/CN%20Bing%20return%20to%20Global%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/459485/CN%20Bing%20return%20to%20Global%20Bing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var global_bing = "https://global.bing.com/search?setmkt=en-US&setlang=en-US&filt=custom&cc=US";
    let current_url = window.location.href;
    if (current_url == "https://global.bing.com/?scope=web&cc=US" || current_url.startsWith("https://global.bing.com/account" )){

    return 0;}
    var query = "";
    var cc = "";
    var mkt = "";
    var lang = "";
    var filters = "";
    var form = "";
    if (current_url.match (/[\?\&]q=([^\&\#]+)[\&\#]/i)){
    query = current_url.match (/[\?\&]q=([^\&\#]+)[\&\#]/i) [1];}

    if (current_url == "https://cn.bing.com/" || current_url == "https://cn.bing.com"){
        window.location.replace("https://global.bing.com/?FORM=Z9FD1")
        return 0;
    }


    if (current_url.startsWith("https://cn.bing.com") || current_url.startsWith("https://www.bing.com") && query == ""){
        window.location.hostname = "global.bing.com"
        if(current_url.match(/[\?\&]*=([^\&\#]+)[\&\#]/i)){
        window.location.href(window.location+"&setmkt=en-US&setlang=en-US&cc=US")}
        else{
            window.location.href(window.location+"?setmkt=en-US&setlang=en-US&cc=US")
        }
        return 0;
    }


    if (!current_url.startsWith("https://global.bing.com") && query != "" ) {
        window.location.hostname = "global.bing.com"
        window.location.href(window.location+"&setmkt=en-US&setlang=en-US&cc=US")
        return 0;

    }

    if (current_url.match (/[\?\&]cc=([^\&\#]+)[\&\#]/i)){
    cc = current_url.match (/[\?\&]cc=([^\&\#]+)[\&\#]/i) [1];}
    if (current_url.match (/[\?\&]setmkt=([^\&\#]+)[\&\#]/i)){
    mkt = current_url.match (/[\?\&]setmkt=([^\&\#]+)[\&\#]/i) [1];}
    if (current_url.match (/[\?\&]setlang=([^\&\#]+)[\&\#]/i)){
    lang = current_url.match (/[\?\&]setlang=([^\&\#]+)[\&\#]/i) [1];}
    if (current_url.match (/[\?\&]filters=([^\&\#]+)[\&\#]/i)){
    filters = current_url.match (/[\?\&]filters=([^\&\#]+)[\&\#]/i) [1];}
    if (current_url.match (/[\?\&]FORM=([^\&\#]+)[\&\#]/i)){
    form = current_url.match (/[\?\&]FORM=([^\&\#]+)[\&\#]/i) [1];}

    if (current_url.startsWith("https://global.bing.com") && (cc.endsWith("CN") || mkt.endsWith("CN") || lang.endsWith("CN")||mkt == "" || lang == "")){
        window.location.hostname = "global.bing.com"
        if(current_url.match(/[\?\&]*=([^\&\#]+)[\&\#]/i)){
        window.location.replace(window.location+"&setmkt=en-US&setlang=en-US&cc=US")}
        else{
            window.location.replace(window.location+"?setmkt=en-US&setlang=en-US&cc=US")
        }
        return 0;
    return 0;
    }

    document.body.innerHTML = document.body.innerHTML.replace(/cn.bing.com/g,"global.bing.com");

    // Your code here...
})();