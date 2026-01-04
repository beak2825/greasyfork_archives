// ==UserScript==
// @name         [HAN] Instagram: Download Photo & Video
// @description  Download photo or video by one button click.
// @namespace	 HANFLY
// @version      1.0.3
// @icon         https://i.imgur.com/obCmlr9.png
// @author       HANFLY
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398184/%5BHAN%5D%20Instagram%3A%20Download%20Photo%20%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/398184/%5BHAN%5D%20Instagram%3A%20Download%20Photo%20%20Video.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // Icon made by https://www.flaticon.com/authors/freepik
    const svgDownload = `<svg width="24" height="24" viewBox="0 0 512 512"><g><g><path d="M472,313v139c0,11.028-8.972,20-20,20H60c-11.028,0-20-8.972-20-20V313H0v139c0,33.084,26.916,60,60,60h392 c33.084,0,60-26.916,60-60V313H472z"></path></g></g><g><g><polygon points="352,235.716 276,311.716 276,0 236,0 236,311.716 160,235.716 131.716,264 256,388.284 380.284,264"></polygon></g></g></svg>`;
    // Icon made by https://www.flaticon.com/authors/those-icons
    const svgNewTab = `<svg width="24" height="24" viewBox="0 0 482.239 482.239"><path d="m465.016 0h-344.456c-9.52 0-17.223 7.703-17.223 17.223v86.114h-86.114c-9.52 0-17.223 7.703-17.223 17.223v344.456c0 9.52 7.703 17.223 17.223 17.223h344.456c9.52 0 17.223-7.703 17.223-17.223v-86.114h86.114c9.52 0 17.223-7.703 17.223-17.223v-344.456c0-9.52-7.703-17.223-17.223-17.223zm-120.56 447.793h-310.01v-310.01h310.011v310.01zm103.337-103.337h-68.891v-223.896c0-9.52-7.703-17.223-17.223-17.223h-223.896v-68.891h310.011v310.01z"></path></svg>`;

    let observer, scrolling = false;

    detectUrl();
    window.addEventListener("load", init);
    window.addEventListener("scroll", scroll);

    function init() {
        for (let i = 0; i < 5; i++) {
            setTimeout(condition, 500 * (i + 1));
        }
    }

    function scroll() {
        if (scrolling) return;
        scrolling = true;
        condition();
        setTimeout(() => { scrolling = false; }, 1000);
    }

    function condition(retry = 0) {
        const sections = document.querySelectorAll("section.ltpMr.Slqrh");
        if (sections.length === 0) {
            if (retry < 5) {
                setTimeout(() => condition(retry + 1), 500);
            } else {
                // personal page: do nothing
            }
        } else if (sections.length === 1) {
            // only one post: add button
            checkSection(sections[0]);
        } else {
            // news feed: add button and connect observer
            sections.forEach(section => checkSection(section));
        }
    }

    function checkSection(section, retry = 0) {
        if (section.childNodes.length < 3) {
            if (retry < 10) {
                setTimeout(() => checkSection(section, retry + 1));
            } else {
                console.log("Error: There is no button here!");
            }
        } else {
            // button 1: Download
            // firefox doesn't support direct download function.
            const isFirefox = typeof InstallTrigger !== 'undefined';
            if (!isFirefox) addButton(section, "download", svgDownload);
            // button 2: New Tab
            addButton(section, "newtab", svgNewTab);
        }
    }

    function addButton(section, className, svg) {
        // check repeat
        let isExist = false;
        section.childNodes.forEach(child => {
            if (child.className.includes(className)) isExist = true;
        });
        // create
        if (isExist) return;
        const outside = document.createElement("span");
        outside.classList.add(className);
        const middle = document.createElement("button");
        middle.classList.add(className);
        middle.classList.add("dCJp8");
        middle.classList.add("afkep");
        middle.innerHTML = svg;
        outside.appendChild(middle);
        section.lastElementChild.before(outside);
        // event
        addListener(middle);
    }

    function addListener(button) {
        button.addEventListener("click", function() {
            const parent = this.closest(".eo2As").previousElementSibling;
            // a page panel under photo or video, it means there is only one photo or video if not exist.
            const isSingle = !parent.querySelectorAll("._3eoV-.IjCL9").length;
            const files = parent.querySelectorAll(".FFVAD").length ? parent.querySelectorAll(".FFVAD") : parent.querySelectorAll("video");
            const link = isSingle ? files[0].src : detectPosition(parent, files);
            download(link, button.className.includes("download"));
        });
    }

    function detectPosition(parent, files) {
        // detect position by 2 dynamic arrow buttons on the view panel.
        const next = parent.querySelectorAll("._6CZji").length;
        const previous = parent.querySelectorAll(".POSa_").length;
        // first
        if (!!next && !previous) return files[0].src;
        // middle || end
        else return files[1].src;
    }

    function download(link, download) {
        if (download) {
            fetch(link).then(t => {
                return t.blob().then(b => {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(b);
                    a.setAttribute("download", getID());
                    a.click();
                });
            });
        } else {
            const tab = window.open(link, '_blank');
            tab.focus();
        }
    }

    function getTime() {
        const date = new Date();
        const year = date.getFullYear();
        const month = addZero(date.getMonth() + 1);
        const day = addZero(date.getDate());
        const hour = addZero(date.getHours());
        const minute = addZero(date.getMinutes());
        const second = addZero(date.getSeconds());
        return `${year}${month}${day}${hour}${minute}${second}`;
    }

    function getID() {
        var ID = document.getElementsByClassName("sqdOP yWX7d     _8A5w5   ZIAjV ")[0].innerHTML;
        var Time = getTime()
        return ID + '(' + Time + ')';
    }

    function addZero(value) {
        return value < 10 ? `0${value}` : `${value}`;
    }

    function detectUrl() {
        window.addEventListener('locationchange', init);
        // condition 1
        history.pushState = (f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushState'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.pushState);
        // condition 2
        history.replaceState = (f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replaceState'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.replaceState);
        // condition 3
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    }

})();
