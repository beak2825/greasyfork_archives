// ==UserScript==
// @name         AK Google Search
// @namespace    http://chataignehahaha.jaipasdesite/
// @version      0.1.2
// @description  Un moteur de recherche moins pourri pour AK :3
// @author       Châtaigne
// @match        http://www.anime-kun.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423859/AK%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/423859/AK%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const gcseStyle = function() {
        let style = document.querySelector("#___gcse_0 > div").style;
        style.position = "absolute";
        style.right = "0";
        style.width = "320px";
        style.backgroundColor = "transparent";
        style.borderColor = "transparent";
        style.zIndex = "5000";

        style = document.querySelector("#___gcse_0 > div > div > form > table > tbody > tr > td.gsc-search-button > button").style;
        style.backgroundColor = "transparent";
        style.borderColor = "transparent";
        style.padding = "0";

        style = document.querySelector("#gsc-i-id1").style;
        style.fontSize = "13px";
        style.paddingBottom = "4px";
    };

    const gcseInit = function() {
        if (document.readyState == 'complete') {
            // Document is ready when Search Element is initialized.
            // Render an element with both search box and search results in div with id 'test'.
            google.search.cse.element.render(
                {
                    div: "cse-g-search",
                    tag: 'search'
                });
            gcseStyle();
        } else {
            // Document is not ready yet, when Search Element is initialized.
            google.setOnLoadCallback(function() {
                // Render an element with both search box and search results in div with id 'test'.
                google.search.cse.element.render(
                    {
                        div: "cse-g-search",
                        tag: 'search'
                    });
                gcseStyle();
            }, true);
        }
    };

    // Insert it before the Search Element code snippet so the global properties like parsetags and callback
    // are available when cse.js runs.
    window.__gcse = {
        parsetags: 'explicit',
        initializationCallback: gcseInit
    };

    const switchSearchEngine = function() {
        document.getElementById("ak-g-search").classList.toggle("priorityHide");
        document.getElementById("cse-g-search").classList.toggle("priorityHide");

        if (this.checked) {
            setCookie("ak-cse-switch", "1");
        } else {
            setCookie("ak-cse-switch", "0");
        }
    };

    let gsearchCopy = document.getElementById("g-search").innerHTML;
    document.getElementById("g-search").innerHTML = '<div id="cse-g-search"></div><div id="ak-g-search" class="priorityHide"></div>';
    document.getElementById("ak-g-search").innerHTML = gsearchCopy;
    document.getElementById("ak-g-search").firstElementChild.firstElementChild.placeholder = "Rechercher avec AK";
    document.getElementById("g-search").innerHTML += '<div style="font-size: 10px;position: absolute;right: 86px;top: -3px;display: inline-flex;width: 248px;">\
<input type="checkbox" id="ak-cse-switch" name="ak-cse-switch" style="vertical-align: middle; z-index: 10000;">\
<label for="ak-cse-switch" style="vertical-align: middle; padding-left: 3px;">Revenir à la recherche par défaut</label></div>';

    document.getElementById("ak-cse-switch").addEventListener("change", switchSearchEngine, false);

    let styleText = "\
#___gcse_0 > div > div > div.gsc-results-wrapper-overlay.gsc-results-wrapper-visible > div:nth-child(3) > div > div {\
text-align: center;\
}\
\
#___gcse_0 > div > div > div.gsc-results-wrapper-overlay.gsc-results-wrapper-visible {\
width: 932px;\
left: calc((100vw - 992px) / 2);\
overflow-y: scroll;}\
\
#ak-g-search form {\
    position: absolute;\
    right: 0;\
    display: flex;\
    top: 14px;\
}\
#g-search #g-text {height: 32px !important; width: 279px !important;}\
#g-search #g-submit {width: 43px !important;}\
.priorityHide { display: none !important; }";

    let styleSheet = document.createElement('style');
    styleSheet.type='text/css';
    if (styleSheet.styleSheet) {
        styleSheet.styleSheet.cssText = styleText;
    } else {
        styleSheet.appendChild(document.createTextNode(styleText));
    }

    // Add script to document
    let scr = document.createElement('script'),
    head = document.head || document.getElementsByTagName('head')[0];
    scr.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//cse.google.com/cse.js?cx=94c24ddc13c97ae90';
    scr.async = false;

    head.insertBefore(scr, head.firstChild);
    head.insertBefore(styleSheet, head.firstChild);

    window.onload = function() {
        document.querySelector("#gsc-i-id1").placeholder = "Rechercher avec Google";
        if (getCookie("ak-cse-switch") == "1") {
            document.getElementById("ak-cse-switch").checked = true;
            switchSearchEngine();
        }
    };

    function setCookie(cname, cvalue, exdays = 365) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
})();