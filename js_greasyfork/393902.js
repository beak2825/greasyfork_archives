// ==UserScript==
// @name         Youtube Simple URL, Visited and Blacklist
// @namespace    http://tampermonkey.net/
// @version      0.57
// @description  This script is designed to work only on Youtube Trending page. Script cuts the time parameter which is used to continue watching from last position, changes the color of visited links to aqua and most importantly lets you ignore channels on trending page.
// @author       taipignas
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/393902/Youtube%20Simple%20URL%2C%20Visited%20and%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/393902/Youtube%20Simple%20URL%2C%20Visited%20and%20Blacklist.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var ran;
    var startTime;
    const buttonStyle = `color: green; background: black; border: 1px solid green; padding: 10px; cursor: pointer;`;
    if (document.querySelector("ytd-video-renderer"))
        startTime = Date.now();


    // apply display none
    function displayNone(node, i) {
        if (i > 19) {
            console.log("node reached more than 20 iterations");
            console.log(node);
            return;
        }
        else if (node.parentNode == undefined) console.log('no parent');
        else if (node.parentNode.localName == "ytd-video-renderer") node.parentNode.style.display = "none";
        else displayNone(node.parentNode, i + 1);
    }

    // hide single video tile. used when clicking a button
    function hideSingle(e) {
        displayNone(document.querySelector(`a[href*="${e}"]`), 0);
    }

    // hide all video tiles matching id. used in main function to hide all ignored channel on initialization.
    function hideAll(e) {
        document.querySelectorAll(`a[href*="${e}"]`).forEach(node => displayNone(node, 0));
    }

    // add channel or user id to localstorage ignorelist
    function ignore(e) {
        hideSingle(e);
        let ignoreList = [];
        ignoreList[0] = localStorage.getItem('ignoreList');
        ignoreList.push(e);
        localStorage.setItem('ignoreList', ignoreList);
        console.log(localStorage.getItem('ignoreList'));
    }

    function Unignore(username) {
        let ignoreList = localStorage.getItem('ignoreList');
        let usernameArray = ignoreList.split(",");
        let index = usernameArray.indexOf(username);
        console.log(index)
        if (index > 0)
            usernameArray.splice(index, 1);
        console.log(usernameArray)
        localStorage.setItem('ignoreList', usernameArray);
        console.log(localStorage.getItem('ignoreList'));
    }

    function ToggleBlacklistedVisability() {
        localStorage.getItem('ignoreListSetting') == 1 ? localStorage.setItem('ignoreListSetting', 0) : localStorage.setItem('ignoreListSetting', 1);
        window.location.reload();
        console.log(localStorage.getItem('ignoreListSetting'));
    }

    function Button(username, func) {
        let button = document.createElement(`button`);
        button.textContent = func.name;
        // (func == ignore) ? `ignore` : `unignore`;
        button.setAttribute(`style`, buttonStyle);
        button.className = "hide-button";
        button.value = username;
        button.onclick = function () { func(this.value) };
        return button;
    }

    function ClearPreviousButtons() {
        document.querySelectorAll(".hide-button").forEach(b => b.parentNode.removeChild(b));
    }

    // main function
    function main() {
        processUrls();
        if (window.location.href.includes('trending') && document.querySelector("ytd-video-renderer")) {
            if (ran == false) {
                location.reload();
                console.log('yt script reloaded the page');
            }
            ran = true;
            ClearPreviousButtons();
            console.log("youtube ignore script loaded at " + window.location.href + " after " + (Date.now() - startTime) + "ms");

            let ignoreList = localStorage.getItem('ignoreList');
            let ignoreListSetting = localStorage.getItem('ignoreListSetting');
            if (ignoreListSetting == undefined) {
                localStorage.setItem('ignoreListSetting', 1);
                ignoreListSetting = 1;
            }

            // query local storage ignorelist and hide all
            if (ignoreListSetting == 1 && ignoreList != null) {
                for (let channel of ignoreList.split(',')) {
                    hideAll(channel);
                }
            }

            // query video tiles container and add each a button to send its channel id to ignore function
            var container = document.querySelectorAll("ytd-video-renderer");
            for (let tile of container) {
                let url = tile.querySelector("a[href^='/user/']") || tile.querySelector("a[href^='/c/']") || tile.querySelector("a[href^='/channel/']") || tile.querySelector("a[href]:not([href*='/watch?v='])");
                if (url !== null && url !== undefined) {
                    let username = url.href.slice(url.href.lastIndexOf('/') + 1);
                    tile.firstElementChild.appendChild(Button(username, ignore));
                    if (ignoreList != null)
                        if (ignoreListSetting == 0 && ignoreList.indexOf(username) >= 0)
                            tile.firstElementChild.appendChild(Button(username, Unignore));
                }
            }

            let button = document.createElement(`button`);
            button.setAttribute(`style`, buttonStyle);
            button.textContent = (ignoreListSetting == 1 ? `show` : `hide`) + ` ignored channels`;
            button.className = "hide-button";
            // (ignoreListSetting=="1"? `show` : `hide`) +
            // button.setAttribute(`style`, `position: absolute; right: 0;`);
            button.onclick = function () { ToggleBlacklistedVisability() };
            document.querySelector("ytd-video-renderer").parentNode.parentNode.prepend(button);
        }
    }

    const processUrls = () => {
        // leave only simple video link with no properties like time to continue from
        document.querySelectorAll("a#video-title[href^='/watch?v=']").forEach(element => { element.href = element.href.slice(0, 43) });

        // css code to change style color of visited links
        var style = document.createElement('style');
        style.innerHTML = `a#video-title:visited {color:aqua  !important;}`;
        document.head.appendChild(style);
    }

    // run main function on initialization, not just on title change
    // call main at the beginning
    main();
    setInterval(main, 1500);
    //console log mutation description
    function printMutation(mutation) {
        console.log('Mutation detected at: ' + mutation + ' node, ran status: ' + ran);
    }

    // setup title change listener
    var title = document.querySelector('title');
    const config = { attributes: true, childList: true, subtree: true, characterData: true };
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                printMutation('child');
            }
            if (mutation.type === 'subtree') {
                printMutation('subtree');
            }
            if (mutation.type === 'characterData') {
                printMutation('characterData');
            }
            if (mutation.type === 'attributes') {
                printMutation('attribute: ' + mutation.attributeName);
            }
            if (mutation.addedNodes[0].wholeText.toLowerCase().includes('trending')) {
                main();
            }
            if (!window.location.href.includes('trending') && ran == true) {
                console.log("wrong window - marked ran as false");
                ran = false;
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(title, config);
})();