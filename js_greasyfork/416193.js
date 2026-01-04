// ==UserScript==
// @name         Enhanced arXiv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add some functions for arXiv
// @author       You
// @match        https://arxiv.org/abs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416193/Enhanced%20arXiv.user.js
// @updateURL https://update.greasyfork.org/scripts/416193/Enhanced%20arXiv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(prompt, callback) {
        return `<button style="margin:0 8px;" class="button is-small" onclick='window.${callback}()'>${prompt}</button>`
    }

    function main() {
        init();
        let targetElement = document.getElementsByClassName("authors")[0];
        let copyTitleButton = createButton("Copy Title", "copyTitle");
        let copyPDFLinkButton = createButton("Copy PDF Link", "copyPDFLink");
        let searchGoogleButton = createButton("Search With Google", "searchGoogle");
        targetElement.insertAdjacentHTML('beforeend', copyTitleButton);
        targetElement.insertAdjacentHTML('beforeend', copyPDFLinkButton);
        targetElement.insertAdjacentHTML('beforeend', searchGoogleButton);
    }

    function init() {
        let hiddenTextArea = document.createElement('textarea');
        hiddenTextArea.setAttribute("id", "hiddenTextArea");
        hiddenTextArea.style.cssText = "display:hidden;";
        document.body.appendChild(hiddenTextArea);
        window.copyText = copyText;
        window.copyTitle = copyTitle;
        window.getPaperTitle = getPaperTitle;
        window.copyPDFLink = copyPDFLink;
        window.searchGoogle = searchGoogle;
    }

    function copyText(text) {
        const textArea = document.getElementById('hiddenTextArea');
        textArea.textContent = text;
        document.body.append(textArea);
        textArea.select();
        document.execCommand("copy");
    }

    function getPaperTitle() {
        let title = document.getElementsByTagName("h1")[2].textContent;
        title = title.replace("Title:", "");
        return title;
    }

    function copyTitle() {
        let title = window.getPaperTitle();
        window.copyText(title)
    }

    function copyPDFLink() {
        let link = document.getElementsByClassName("download-pdf")[0].href;
        window.copyText(link)
    }

    function searchGoogle() {
        let title = window.getPaperTitle();
        window.open(`https://www.google.com/search?q=${title}`);
    }
    main();
})();