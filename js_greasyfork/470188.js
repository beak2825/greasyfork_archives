// ==UserScript==
// @name         Disable safesearch
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Set off safesearch on Bing, DuckDuckGo, Yep, You, Yahoo, Ecosia, Qwant, Metager, Startpage, brave
// @author       You
// @match        https://www.bing.com/search?*
// @match        https://www.bing.com/images/search?*
// @match        https://www.bing.com/videos/search?*
// @match        https://www.bing.com/news/search?*
// @match        https://duckduckgo.com/?q=*
// @match        https://yep.com/*
// @match        https://you.com/*
// @match        https://*.search.yahoo.com/*
// @match        https://www.ecosia.org/*
// @match        https://www.qwant.com/*
// @include      /^https://metager.[a-z]*/
// @match        https://www.startpage.com/*
// @match        https://search.brave.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470188/Disable%20safesearch.user.js
// @updateURL https://update.greasyfork.org/scripts/470188/Disable%20safesearch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hostname = window.location.hostname;
    var website = window.location.hostname.split(".").at(-2);
    var cookieSettings = {
        bing : {
            cookie : "SRCHHPGUSR",
            is_array : true,
            name : "ADLT",
            value : "OFF",
            domain : window.location.hostname.split(".").slice(-2).join('.'),
            sameSite : "None",
            separator : "&"
        },
        duckduckgo : {
            cookie : "p",
            is_array : false,
            value : "-2",
            domain : false, //duckduckgo doesn't set domain in cookies
            sameSite : "Lax"
        },
        yep : { //safesearch is broken but ok
            localStorage : "safeSearch",
            value : "off",
            replaceUrl : "safeSearch"
        },
        yahoo : {
            cookie : "sB",
            is_array : true,
            name : "vm",
            value : "p",
            domain : "search."+window.location.hostname.split(".").slice(-2).join('.'),
            sameSite : "None",
            session : true,
            separator : "&"
        },
        you : {
            cookie : "safesearch_guest",
            is_array : false,
            value : "Off",
            domain : false
        },
        ecosia : {
            cookie : "ECFG",
            is_array : true,
            name : "f",
            value : "n",
            domain : window.location.hostname.split(".").slice(-2).join('.'),
            separator : ":",
            sameSite : "Lax"
        },
        qwant : {
            cookie : "s",
            is_array : false,
            value : "0",
            domain : false,
            replaceUrl : "s"
        },
        metager : {
            cookie : "web_setting_s",
            is_array : false,
            value : "o",
            domain : false,
            replaceUrl : "s"
        },
        startpage : {
            cookie : "preferences",
            is_array : true,
            name : "disable_family_filter", //I don't know why they formatted cookies like this
            value : "1",
            separator: "N",
            equal : "EEE",
            domain : window.location.hostname.split(".").slice(-2).join('.')
        },
        brave : {
            cookie : "safesearch",
            is_array : false,
            value : "off",
            domain : false
        }
    };

    if(cookieSettings[website].cookie){
        if(website == "bing"){
            var oldCookieGetAccess = false;
            if(typeof window.cookieGetAccess != "undefined") {
                oldCookieGetAccess = window.cookieGetAccess;
            }
            //bing overwrites document.cookie function to return "" if this variable is false
            window.cookieGetAccess = true;
        }

        var cookies = document.cookie;

        if(website == "bing"){
            window.cookieGetAccess = oldCookieGetAccess;
            /*if(cookies == ""){
            cookies = cookieDesc.get.call(document);
        }*/
        }

        var safeSearchCookie = cookies.match(new RegExp("(?: |;|^)"+cookieSettings[website].cookie+"=[^;]*"));
        if(cookieSettings[website].is_array){
            safeSearchCookie = safeSearchCookie ? safeSearchCookie[0].replaceAll(/[ ;]/g,"") : cookieSettings[website].cookie+"="+cookieSettings[website].name+equalSign();
            if(safeSearchCookie.includes(cookieSettings[website].name+equalSign()) == true){
                if(safeSearchCookie.includes(cookieSettings[website].name+equalSign()+cookieSettings[website].value) == false){
                    safeSearchCookie = safeSearchCookie.replace(
                        new RegExp("( |^"+cookieSettings[website].cookie+"\=|"+separatorSign()+")"+cookieSettings[website].name+"[^"+separatorSign()+"]*"),
                        "$1"+cookieSettings[website].name+equalSign()+cookieSettings[website].value);
                    bingSettings();
                    cookieInjection();
                } else {
                    nothingToDo();
                }
            } else {
                safeSearchCookie = safeSearchCookie +separatorSign()+cookieSettings[website].name+equalSign()+cookieSettings[website].value;
                bingSettings();
                cookieInjection();
            }
        } else {
            if(safeSearchCookie == null || safeSearchCookie[0].replaceAll(/[ ;]/g,"") != cookieSettings[website].cookie+"="+cookieSettings[website].value){
                safeSearchCookie = cookieSettings[website].cookie+"="+cookieSettings[website].value;
                cookieInjection();
            } else {
                nothingToDo();
            }
        }

    } else if (cookieSettings[website].localStorage){
        storageInjection();
    }

    function bingSettings(){
        //Inject dynamic theme
        if(website == "bing"){
            safeSearchCookie = safeSearchCookie.replace(
                new RegExp("( |^"+cookieSettings[website].cookie+"\=|"+separatorSign()+")WEBTHEME[^"+separatorSign()+"]*"),
                "$1WEBTHEME"+equalSign()+"2");
            if(safeSearchCookie.search("WEBTHEME") == -1){
                safeSearchCookie += separatorSign()+"WEBTHEME"+equalSign()+"2";
            }
            //Additional reject cookies
            document.cookie = "BCP=AD=0&AL=0&SM=0; "+(cookieSettings[website].session ? "" : "expires=Fri, 01 Jan 2038 00:00:00 GMT;")+(cookieSettings[website].domain?"domain="+cookieSettings[website].domain+";":"")+" path =/; sameSite="+cookieSettings[website].sameSite+" Secure";
        }
        return safeSearchCookie;
    }

    function equalSign(){
        return cookieSettings[website].equal ? cookieSettings[website].equal : "=";
    }

    function separatorSign(){
        return cookieSettings[website].separator ? cookieSettings[website].separator : "&";
    }

    function cookieInjection() {
        document.cookie = safeSearchCookie+"; "+(cookieSettings[website].session ? "" : "expires=Fri, 01 Jan 2038 00:00:00 GMT;")+(cookieSettings[website].domain?"domain="+cookieSettings[website].domain+";":"")+" path =/; sameSite="+cookieSettings[website].sameSite+" Secure";
        reload();
        console.log(website+" disable safesearch: done!");
    }

    function nothingToDo(){
        if(performance.getEntriesByType("navigation")[0] && performance.getEntriesByType("navigation")[0].type!="reload"){
            console.log(website+" disable safesearch: nothing to do!");
        }
        if(cookieSettings[website].replaceUrl && window.location.toString().match(new RegExp("([?&])"+cookieSettings[website].replaceUrl+"[^&]*&?"))){
            window.location = window.location.toString().replace(new RegExp("([?&])"+cookieSettings[website].replaceUrl+"[^&]*&?"),"$1");
        }
    }

    function storageInjection() {
        if(localStorage.getItem(cookieSettings[website].localStorage) == cookieSettings[website].value && window.location.toString().match(new RegExp("&"+cookieSettings[website].replaceUrl+"[^&]*")) == null){
            nothingToDo();
        } else {
            localStorage.setItem(cookieSettings[website].localStorage,cookieSettings[website].value);
            reload();
        }
    }


    function reload(){
        if(cookieSettings[website].replaceUrl && window.location.toString().match(new RegExp("&"+cookieSettings[website].replaceUrl+"[^&]*"))){
            window.location = window.location.toString().replace(new RegExp("([?&])"+cookieSettings[website].replaceUrl+"[^&]*&?"),"$1");
        } else {
            location.reload();
        }
    }
})();