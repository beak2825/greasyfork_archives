// ==UserScript==
// @name         Classic Manga Controls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Classic Manga Controls for Mokuro
// @author       Kaanium
// @match        https://www.mokuro.moe/manga/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mokuro.moe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473992/Classic%20Manga%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/473992/Classic%20Manga%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

   function removeIfExists(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    }

    document.body.setAttribute('style', 'overflow: visible !important; background-color: #1e1e1e !important;');


    removeIfExists("#left-nav")
    removeIfExists("#leftAScreen")
    removeIfExists("#right-nav")
    removeIfExists("#rightAScreen")

    var originalBody = document.querySelector('body');
    var clonedBody = originalBody.cloneNode(true);
    document.body.parentNode.replaceChild(clonedBody, originalBody);

    var prev = document.querySelector("#buttonRight");
    prev.addEventListener("click", nextPage);

    var last = document.querySelector("#buttonRightRight");
    last.addEventListener("click", lastPage);

    var next = document.querySelector("#buttonLeft");
    next.addEventListener("click", prevPage);

    var first = document.querySelector("#buttonLeftLeft");
    first.addEventListener("click", firstPage);

    var input = document.querySelector("#pageIdxInput");
    input.addEventListener("change", function(e) {
        updatePage(e.target.value - 1);
    });

    var doublePage = document.querySelector("#menuDoublePageView");
    doublePage.addEventListener("change", function() {
        state.singlePageView = !document.getElementById('menuDoublePageView').checked;
        saveState();
        updatePage(state.page_idx);
    });

    var hide = document.querySelector("#buttonHideMenu");
    hide.addEventListener("click", function(){
        document.getElementById('showMenuA').style.display = 'inline-block';
        document.getElementById('topMenu').classList.add('hidden');
    });

    var show = document.querySelector("#showMenuA");
    show.addEventListener("click", function(){
        document.getElementById('showMenuA').style.display = 'none';
        document.getElementById('topMenu').classList.remove('hidden');
    });

    var page = document.querySelector("#pagesContainer");

    page.style.position = "absolute"
    page.style.left = "50%"
    page.style.transform = "translate(-50%)"
    let start;

    page.addEventListener('mousedown', function (e) {
        start = Date.now();
    });

    page.addEventListener('mouseup', function (e) {
        if (Date.now() - start < 200 && e.target.nodeName !== "P" && e.button === 0 && e.target.id !== "pagesContainer") {
            nextPage();
            window.scrollTo(0, 0);
        }
    });

    var pages = document.querySelectorAll(".pageContainer");
    var scaleFactor = 1;

    document.addEventListener("keydown", function(e) {
        if (e.key === "+") {
            scaleFactor += 0.1;
            updateImageSize();
            e.preventDefault();
        } else if (e.key === "-") {
            scaleFactor -= 0.1;
            updateImageSize();
            e.preventDefault();
        }
    });

    function updateImageSize() {
        if (scaleFactor < 0.1) {
            scaleFactor = 0.1;
        }
        if (scaleFactor > 3) {
            scaleFactor = 3;
        }

        for (var i = 0; i < pages.length; ++i) {
            var margin = parseFloat(pages[i].style.height) * (scaleFactor - 1) / 2 + "px";
            page.style.marginTop = margin;
            pages[i].parentNode.style.transform = "scale(" + scaleFactor + ")";
        }
    }

    document.addEventListener('keyup', (event) => {
        var name = event.key;

        if (name === 'ArrowRight') {
            nextPage();
            window.scrollTo(0, 0);
        } else if (name === 'ArrowLeft') {
            prevPage();
            window.scrollTo(0, 0);
        }
    });
})();
