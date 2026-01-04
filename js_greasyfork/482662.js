// ==UserScript==
// @name         No sep slides!
// @namespace    http://tampermonkey.net/
// @version      2023-12-19
// @license      MIT
// @description  No sep slides
// @author       Racosel
// @match        https://sep.ucas.ac.cn/appStore
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ucas.ac.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482662/No%20sep%20slides%21.user.js
// @updateURL https://update.greasyfork.org/scripts/482662/No%20sep%20slides%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const class1 = "b-applist-nav";
    const class2 = "app-black";
    window.onload = function(){
        // change all elements of class 1 and 2 to:
        // width: 23vw;
        let elements = document.getElementsByClassName(class1);
        for (let i = 0; i < elements.length; i++){
            elements[i].style.width = "23vw";
        }
        elements = document.getElementsByClassName(class2);
        for (let i = 0; i < elements.length; i++){
            elements[i].style.width = "23vw";
        }

        // delete the ticks from class .icon-ok
        elements = document.getElementsByClassName("icon-ok");
        for (let i = 0; i < elements.length; i++){
            elements[i].parentNode.removeChild(elements[i]);
        }

        // inject this css
        const css = "\
        \
        .app-black a {\
            position: relative;\
            display: block;\
            float: left;\
            margin: 0 4px 4px 0;\
            padding: 0;\
            width: 7vw;\
            text-align: center;\
        }\
        h5 {\
            font-size: 12px;\
            text-align: center;\
            overflow: visible;\
        }\
        \
        ";
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);

        // set the 2nd child of #main-metro to:
        // display: flex;    width: 100%;
        elements = document.getElementById("main-metro").children;
        elements[1].style.display = "flex";
        elements[1].style.width = "100%";
    }
})();