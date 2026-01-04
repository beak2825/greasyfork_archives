// ==UserScript==
// @name         Jdownloader IGG Mega
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate opening Mega Links from igg. Also take over the world
// @author       Lucibear
// @license      MIT
// @match        https://mega.nz/file/*
// @match        https://bluemediafile.site/*
// @match        https://igg-games.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mega.nz
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/478671/Jdownloader%20IGG%20Mega.user.js
// @updateURL https://update.greasyfork.org/scripts/478671/Jdownloader%20IGG%20Mega.meta.js
// ==/UserScript==

(function () {
    "use strict";
    switch (true) {
        case window.location.href.includes("mega.nz/file/"):
            console.log("Mega detected");
            initMega();
            break;
        case window.location.href.includes("bluemediafile.site/"):
            console.log("BM detected");
            initBM();
            break;
        case window.location.href.includes("igg-games.com/"):
            console.log("IGG detected");
            initIGG();
            break;
        default:
            console.log("PANIC!");
            breeak;
    }
    function initMega() {
        let anchor = document.querySelector("div.transfer-wrapper");
        if (!anchor) {
            // console.log("failed to get anchor");
            setTimeout(() => {
                initMega();
            }, 100);
            return;
        }
        let location = window.location.href;
        let form = makeForm(location);
        anchor.appendChild(form);
        console.log(form);
        let submitButton = document.querySelector("#JDSubmit");
        submitButton.click();
        setTimeout(() => {
            console.log("closing tab");
            window.close();
        }, 100);
        return;
        function makeForm(link) {
            const form = document.createElement("form");
            form.style.display = "flex";
            form.style.justifyContent = "flex-end";
            form.action = "http://127.0.0.1:9666/flash/add";
            // form.target = "hidden";
            form.method = "POST";

            const source = document.createElement("input");
            source.type = "hidden";
            source.name = "source";
            source.value = "google.com";
            form.appendChild(source);

            const urls = document.createElement("input");
            urls.type = "hidden";
            urls.name = "urls";
            urls.value = link;
            form.appendChild(urls);

            const submit = document.createElement("input");
            submit.style.height = "40px";
            submit.id = "JDSubmit";
            submit.type = "submit";
            submit.name = "submit";
            submit.value = "Add links";
            form.appendChild(submit);

            return form;
        }
    }
    function initBM() {
        const formUrl = document.querySelector("#url");
        if (!formUrl) {
            setTimeout(() => {
                initBM;
            }, 100);
        }
        console.log("BM init", formUrl);
        setInterval(() => {
            if (formUrl.value) {
                console.log("clicking");
                formUrl.parentElement.submit();
            }
        }, 250);
    }
    function initIGG() {
        const linkContainers = Array.from(document.querySelectorAll("b.uk-heading-bullet")).map(
            (x) => x.parentElement
        );
        // console.log(linkContainers);
        linkContainers.map(processLinkContainer);

        function processLinkContainer(linkContainer) {
            const links = Array.from(linkContainer.querySelectorAll("a"));
            if (links.length === 0) return;
            const button = document.createElement("button");
            button.textContent = "Download All";
            button.style.marginLeft = "10px";
            button.onclick = openAll;
            insertAfter(linkContainer.firstChild, button);

            function openAll() {
                console.log("opening", links);
                // chrome.tabs.create({
                //     url: links.map((x) => x.href),
                // });
                links.forEach(async (link) => {
                    console.log(link);
                    GM_openInTab(link.href);
                });
            }
        }
    }
})();

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
