// ==UserScript==
// @name         Github index filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  filter your repo star/fork information
// @author       https://github.com/iMeiji
// @match       https://github.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/40284/Github%20index%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/40284/Github%20index%20filter.meta.js
// ==/UserScript==

// enter your GitHub username
const yourGitHubUserName = "iMeiji";

(function () {
    'use strict';
    var regex = `^\\/(${yourGitHubUserName})\\/([^\\s]*)`;

    const observer = new MutationObserver(main);
    let article = document.body;

    let options = {
        'subtree': true,
        'attributes': true
    };

    observer.observe(article, options);

    function remove(startList, root) {
        let removeArr = [];
        for (let fork of startList) {
            let list = fork.getElementsByClassName("f4 lh-condensed text-bold text-gray-dark");
            let a = list.item(0).getElementsByTagName("a");
            let h = a.item(0).getAttribute("href");
            if (h.search(new RegExp(regex)) !== -1) {
                console.log(h);
                removeArr.push(fork);
            }
        }
        removeArr.map((value) => {
            value.parentNode.removeChild(value);
        });
    }

    function main() {
        let root = document.getElementsByClassName("news");
        let forkList = root.item(0).getElementsByClassName("fork");
        let startList = root.item(0).getElementsByClassName("watch_started");
        remove(forkList, root);
        remove(startList, root);
    }
})();