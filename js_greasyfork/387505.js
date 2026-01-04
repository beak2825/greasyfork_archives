// ==UserScript==
// @name         osu! download redirector
// @namespace    https://github.com/lywbh/osu-download-redirector
// @version      0.1.7
// @description  redirect download request from ppy.sh to bloodcat.com
// @author       kamimi
// @match        https://osu.ppy.sh/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387505/osu%21%20download%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/387505/osu%21%20download%20redirector.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /**
     * when page loaded/refreshed.
     */
    window.onload = () => {
        handleNewSite();
    };

    /**
     * The new osu site is a single page app, modify the xhr here for listening page redirect.
     */
    let oldXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = newXHR;

    function newXHR() {
        let realXHR = new oldXHR();
        realXHR.addEventListener('readystatechange', function () {
            ajaxEventTrigger.call(this, 'ajaxReadyStateChange');
        });
        return realXHR;
    }

    function ajaxEventTrigger(event) {
        let ajaxEvent = new CustomEvent(event, {detail: this});
        window.dispatchEvent(ajaxEvent);
    }

    /**
     * listen page redirect.
     */
    window.addEventListener('ajaxReadyStateChange', e => {
        if (e.detail.readyState === 4) {
            if (/^https:\/\/osu.ppy.sh\/beatmapsets(\/)?[0-9]*$/.test(e.detail.responseURL)) {
                // wait a while for dom rendering
                setTimeout(handleNewSite, 500);
            }
        }
    });

    /**
     * add icons for new site.
     */
    function handleNewSite() {
        if (window.location.pathname === "/beatmapsets") {
            // beatmap list
            let beatmapList = document.getElementsByClassName("beatmapsets__items")[0];
            if (beatmapList) {
                let iconBoxes = beatmapList.getElementsByClassName("beatmapset-panel__menu");
                addIconList(iconBoxes);
                beatmapList.addEventListener("DOMNodeInserted", e => {
                    let iconBoxes = e.target.getElementsByClassName("beatmapset-panel__menu");
                    addIconList(iconBoxes);
                });
            }
        } else if (/^\/beatmapsets\/[0-9]*.*$/.test(window.location.pathname)) {
            // beatmap details
            let iconBoxes = document.getElementsByClassName("beatmapset-header__buttons");
            addIconDetail(iconBoxes);
        }
    }

    function addIconList(iconBoxes) {
        for (let i = 0; i < iconBoxes.length; i++) {
            let downloadLink = iconBoxes[i].getElementsByClassName("beatmapset-panel__menu-item")[1];
            if (downloadLink) {
                let newNode = deepCloneNode(downloadLink);
                replaceUrl(newNode, -2);
                newNode.style.color = "#4ad";
                iconBoxes[i].appendChild(newNode);
            }
        }
    }

    function addIconDetail(iconBoxes) {
        for (let i = 0; i < iconBoxes.length; i++) {
            let downloadLink = iconBoxes[i].getElementsByClassName("btn-osu-big--beatmapset-header")[0];
            if (downloadLink) {
                let newNode = deepCloneNode(downloadLink);
                replaceUrl(newNode, -2);
                newNode.style.backgroundColor = "#4ad";
                let textNode = newNode.getElementsByClassName("btn-osu-big__left")[0];
                textNode.innerHTML = "BloodCat";
                iconBoxes[i].appendChild(newNode);
            }
        }
    }

    /**
     * replace the origin url with bloodcat.com in download button element
     */
    function replaceUrl(linkNode, pathIndex) {
        const bloodUrl = "https://bloodcat.com/osu/s/";
        if (linkNode.href && linkNode.href.indexOf(bloodUrl) === -1) {
            let splitUrl = linkNode.href.split("/");
            let index;
            if (pathIndex >= 0) {
                index = pathIndex;
            } else {
                index = splitUrl.length + pathIndex;
            }
            let setId = splitUrl[index];
            linkNode.href = bloodUrl + setId;
        }
    }

    function deepCloneNode(linkNode) {
        let objE = document.createElement("div");
        objE.innerHTML = linkNode.outerHTML;
        return objE.childNodes[0];
    }
})();
