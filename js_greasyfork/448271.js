// ==UserScript==
// @name         anime.jottocraft.com addon for MyAnimeList
// @version      2.0.1
// @description  Shows anime.jottocraft.com statuses and links in MyAnimeList
// @author       jottocraft <code@jottocraft.com>
// @match        https://myanimelist.net/anime/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/154395
// @downloadURL https://update.greasyfork.org/scripts/448271/animejottocraftcom%20addon%20for%20MyAnimeList.user.js
// @updateURL https://update.greasyfork.org/scripts/448271/animejottocraftcom%20addon%20for%20MyAnimeList.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //Get MAL anime ID
    const malID = window.location.pathname.match(/^\/anime\/(.*?)\//u)?.[1];

    const SELECTOR = ".anime-detail-header-stats .user-status-block";

    function setYtbButtonStyles(node) {
        //Add CSS styles
        const style = node.style;
        style.color = "white";
        style.backgroundColor = "#282828";
        style.padding = "5px 8px";
        style.paddingLeft = "7px";
        style.verticalAlign = "middle";
        style.borderRadius = "4px";

        //Add YTB Icon
        const YtbLogo = document.createElement("img");
        YtbLogo.src = "https://anime.jottocraft.com/hub/api/rest/projects/3bd58133-39fe-4a90-97f8-bd1a5b1b4284/icon?size=11";
        YtbLogo.style.width = "16px";
        YtbLogo.style.height = "16px";
        YtbLogo.style.verticalAlign = "middle";
        YtbLogo.style.marginRight = "4px";
        YtbLogo.style.objectFit = "contain";
        node.prepend(YtbLogo);
    }

    let added = false;
    function addJottocraftButtons(node) {
        if (added) return;
        added = true;

        const YtbCreate = document.createElement("a");
        YtbCreate.href = `https://anime.jottocraft.com/newIssue?project=A&textFields=id%3D156-12%26value%3D${malID}%26%2524type%3DTextFieldAndValue`;
        YtbCreate.setAttribute("target", "_blank");
        YtbCreate.innerText = "Create";
        setYtbButtonStyles(YtbCreate);
        YtbCreate.style.marginRight = "4px";

        const YtbLocate = document.createElement("a");
        YtbLocate.href = `https://anime.jottocraft.com/issues?q=MAL%20Entry:%20%7Bhttps://myanimelist.net/anime/${malID}%7D`;
        YtbLocate.setAttribute("target", "_blank");
        YtbLocate.innerText = "Locate";
        setYtbButtonStyles(YtbLocate);
        YtbLocate.style.marginRight = "8px";

        node.prepend(YtbCreate, YtbLocate);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches(SELECTOR)) {
                    addJottocraftButtons(node);
                }
            })
        })
    });

    //Starts the monitoring
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    //Check if we missed it (for late script loads, aka safari)
    const existingNode = document.querySelector(SELECTOR);
    if (existingNode) addJottocraftButtons(existingNode);
})();