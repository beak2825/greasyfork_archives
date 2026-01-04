// ==UserScript==
// @name         Open As User Script
// @namespace    https://gitlab.com/Dwyriel
// @version      0.4.1
// @description  Opens gitlab or github files as a userscript on Violentmonkey
// @author       Dwyriel
// @license      MIT
// @match        *://*.gitlab.com/*
// @match        *://*.github.com/*
// @grant        none
// @run-at       document-idle
// @homepageURL  https://gitlab.com/Dwyriel/Greasyfork-Scripts
// @downloadURL https://update.greasyfork.org/scripts/505561/Open%20As%20User%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/505561/Open%20As%20User%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const svgHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488.17122 451.46743"><path d="M347.40064,23.76436H235.12832V38.087h48.97474v179.7281s2.31016,59.13917-55.90521,61.91145c-58.21515,2.772-72.99988-8.31661-72.99988-8.31661s-22.40839-8.54745-24.32225-52.88553c-.11377-2.63311.29688-5.26269.29688-7.89823V38.087h34.65191V23.76436H53.55219V38.087H89.12811V221.98343c0,15.9756,4.41178,31.79326,13.51435,44.92192,12.01268,17.32595,23.44771,33.15023,76.58065,36.38441h42.05554c31.31612,0,60.68214-17.05513,74.58085-45.11808q.91684-1.85058,1.77536-3.80232a96.7686,96.7686,0,0,0,7.72129-38.97688V38.087h42.04449Z" transform="translate(-53.55219 -23.76436)"/><path d="M537.6011,350.10831S533.28894,308.218,465.525,286.65676c-30.90436-9.83307-50.66152-19.15388-63.01107-26.38433-15.55236-9.10566-25.98739-25.42652-26.20828-43.447-.499-40.71248,50.40925-44.13486,50.40925-44.13486,71.68709.49768,81.1559,26.73424,82.15193,36.788v21.73509h18.26168V159.90786c-71.98728-18.32707-129.9833-5.08244-129.9833-5.08244s-60.37134,16.633-62,80.08455,59.5359,78.85237,59.5359,78.85237c51.214,11.41934,76.77018,26.72628,89.33378,37.95014A45.49218,45.49218,0,0,1,498.085,376.84211c18.01935,90.13167-73.83422,79.22414-73.83422,79.22414-70.22783,1.848-70.84392-65.29958-70.84392-65.29958v-4.1582H335.1452v76.85015c78.72667,21.15788,143.89239,8.51718,160.1143,2.57148a101.02229,101.02229,0,0,1,10.39018-3.43365C558.64234,449.46956,537.6011,350.10831,537.6011,350.10831Z" transform="translate(-53.55219 -23.76436)"/></svg>`;
    const elementID_1 = "OaUS_g893n1g7f561nf_1";
    const elementID_2 = "OaUS_g893n1g7f561nf_2";
    const config = { attributes: true, childList: true, subtree: true };
    const svgDoc = new DOMParser().parseFromString(svgHTML, 'image/svg+xml');
    let mutationObs = null;
    function openUrl(url) {
        var newWindow = window.open(url, "File as UserScript");
        let intervalHandler = setInterval(() => {
            if (newWindow.closed) {
                clearInterval(intervalHandler);
                return;
            }
            newWindow.close();
        }, 1000);
    }
    function genUrlFromGitlab() {
        let url = window.location.toString().replace('blob', 'raw');
        return url.includes("?") ? `${url}&file=as/script.user.js` : `${url}?file=as/script.user.js`;
    }
    function gitlabCallback() {
        if (document.getElementById(elementID_1))
            return;
        let btnToClone = document.querySelector(`div[data-testid="default-actions-container"]`)?.querySelector("[title*='raw']");
        if (!btnToClone)
            return;
        let clonedNode = btnToClone.cloneNode(true);
        let clonedSVG = svgDoc.firstChild.cloneNode(true);
        let svg = clonedNode.children[0];
        clonedSVG.classList = svg.classList;
        svg.after(clonedSVG);
        svg.remove();
        clonedNode.id = elementID_1;
        clonedNode.removeAttribute('href');
        clonedNode.setAttribute('aria-label', "Open as Userscript");
        clonedNode.setAttribute('title', "Open as Userscript");
        clonedNode.onclick = function () { openUrl(genUrlFromGitlab()) };
        btnToClone.after(clonedNode);
    }
    function genUrlFromGithub() {
        let url = window.location.toString().replace('github.com', 'raw.githubusercontent.com').replace('blob/', '');
        return url.includes("?") ? `${url}&file=as/script.user.js` : `${url}?file=as/script.user.js`;
    }
    function githubCreateDesktopButton() {
        if (document.getElementById(elementID_1))
            return;
        let btnToClone = document.querySelectorAll('[class*="ButtonGroup"]')[0]?.parentNode.querySelector('[data-testid*="copy-raw"]');
        if (!btnToClone)
            return;
        let clonedNode = btnToClone.cloneNode(true);
        let clonedSVG = svgDoc.firstChild.cloneNode(true);
        let svg = clonedNode.children[0];
        clonedSVG.classList = svg.classList;
        clonedSVG.setAttribute('width', 16);
        clonedSVG.setAttribute('height', 16);
        svg.after(clonedSVG);
        svg.remove();
        clonedNode.id = elementID_1;
        clonedNode.removeAttribute('data-hotkey');
        clonedNode.removeAttribute('aria-describeby');
        clonedNode.setAttribute('aria-label', "Open as Userscript");
        clonedNode.setAttribute('title', "Open as Userscript");
        clonedNode.setAttribute('data-testid', "open-as-userscript");
        clonedNode.onclick = function () { openUrl(genUrlFromGithub()) };
        btnToClone.after(clonedNode);
    }
    function githubCreateMobileButton() {
        if (document.getElementById(elementID_2))
            return;
        let rawFileList = document.querySelectorAll('[class*="List__ListBox"]')[0]?.lastChild;
        if (!rawFileList)
            return;
        let listEntries = rawFileList.querySelectorAll('[class*="Link__StyledLink"]');
        if (listEntries.length == 0)
            return;
        let listEntry = listEntries[listEntries.length - 1].parentNode;
        let clonedNode = listEntry.cloneNode(true);
        clonedNode.id = elementID_2;
        clonedNode.firstChild.innerText = "As Userscript"
        clonedNode.firstChild.onclick = function () { openUrl(genUrlFromGithub()) };
        listEntry.after(clonedNode);
    }
    function githubCallbcak() {
        if (!document.getElementById(elementID_1))
            githubCreateDesktopButton();
        if (!document.getElementById(elementID_2))
            githubCreateMobileButton();
    }
    if (window.location.toString().includes("//gitlab.com/"))
        mutationObs = new MutationObserver(gitlabCallback);
    else if (window.location.toString().includes("//github.com/"))
        mutationObs = new MutationObserver(githubCallbcak);
    if (mutationObs)
        mutationObs.observe(document.body, config);
})();
