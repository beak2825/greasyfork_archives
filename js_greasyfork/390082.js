// ==UserScript==
// @name         4chan f5
// @version      1.0.3
// @description  Scroll to top while you press F5.
// @author       droppey
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://boards.4channel.org/*
// @include        https://boards.4channel.org/*
// @grant        none
// @namespace https://greasyfork.org/users/318204
// @downloadURL https://update.greasyfork.org/scripts/390082/4chan%20f5.user.js
// @updateURL https://update.greasyfork.org/scripts/390082/4chan%20f5.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const $ = window.jQuery;
    const red = "https://i.imgur.com/jOH4kcu.png";
    const white = "https://i.imgur.com/tVMwdg0.png";
    let ctrl, r;
    let arrowDiv, arrowImg, url;

    $(document).ready(() => {
        themeDetect();
        createArrow();
        changeArrow();
        keyListener();
    });

    function themeDetect() {
        url = $("#theme-selector").val() == "" ? red : white;
    }

    function createArrow() {
        arrowDiv = $("<div/>").css({
            "position": "fixed",
            "right": "50px",
            "bottom": "30px"
        }).appendTo("body");

        arrowImg = $("<img/>", {
            src: url
        }).css({
            "width": "45px",
            "height": "auto",
            "cursor": "pointer"
        }).appendTo(arrowDiv);

        arrowImg.on("click", () => {
            goTop();
            location.reload();
        });
    }

    function changeArrow() {
        $("#theme-selector").on("change", () => {
            themeDetect();
            setTimeout(() => {
                arrowImg.attr("src", url);
            }, 400);
        });
    }

    function keyListener() {
        $(document).keydown(e => {
            if (e.keyCode === 116) goTop();
            else if (e.keyCode === 17) ctrl = true;
            else if (e.keyCode === 82) r = true;
            if (ctrl && r) goTop();
        });

        $(document).keyup(e => {
            if (e.keyCode === 17) ctrl = false;
            else if (e.keyCode === 82) r = false;
        });
    }

    function goTop() {
        window.scrollTo(0, document.documentElement.scrollTop * 0.8);
        if (document.documentElement.scrollTop > 0) setTimeout(goTop, 20);
    }

})();