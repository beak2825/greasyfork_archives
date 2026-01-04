// ==UserScript==
// @name         Hack Space4Online
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hack space4.online~
// @author       You
// @match        http://space4.online/problems/*
// @icon         https://www.google.com/s2/favicons?domain=space4.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428099/Hack%20Space4Online.user.js
// @updateURL https://update.greasyfork.org/scripts/428099/Hack%20Space4Online.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        // move the toolbar at the bottom
        let content = document.getElementById("blah2");
        let header = content.previousElementSibling;
        header.parentElement.insertBefore(content, header);

        // remove footer
        document.getElementsByTagName('footer')[0].remove();

        // get the height of header;
        let header_height = document.getElementsByTagName('header')[0].offsetHeight;

        // let the main part's display is flex.
        let main_part = header.parentElement.parentElement.parentElement.parentElement;
        main_part.style.display = "flex";
        main_part.style.height = "calc(100vh - " + header_height + "px)";
        console.log("calc(100vh - " + header_height + "px)");
        let left = main_part.children[0];
        let right = main_part.children[1];

        // change left's outlook
        left.style.overflow="scroll";
        left.style.width = "40%";
        left.children[2].style["max-width"] = "100%";
        left.children[2].style.display = "block";
        let tags = left.children[2].children[1];
        let text = left.children[2].children[0];
        text.parentElement.insertBefore(tags, text);

        // change right's outlook
        right.style["min-height"] = "0";
        right.style.width = "60%";
        right.children[0].style.height = "75%";
        right.children[1].style.height = "25%";
        right.children[1].children[0].style["min-height"] = "0";
        right.children[1].children[1].style["min-height"] = "0";

        // refrash
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("resize", true, true);
        window.dispatchEvent(evt);
    }, 3000);
})();