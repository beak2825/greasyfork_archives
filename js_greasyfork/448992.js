// ==UserScript==
// @name         Google Meet VictimSelector
// @namespace    https://meet.google.com/
// @version      1.1
// @description  Select a random victim from a Google Meet chat.
// @author       Joost Visser
// @email        joost.visser@lightyear.one
// @license      MIT
// @match        https://meet.google.com/*-*-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448992/Google%20Meet%20VictimSelector.user.js
// @updateURL https://update.greasyfork.org/scripts/448992/Google%20Meet%20VictimSelector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function selectVictim(i = 2e3) {
        try {
            function e(a, b = 0) {
                if (b > 7 || "object" != typeof a || null === a || a === window) {
                    return;
                }
                let c = Object.getOwnPropertyDescriptors(a);
                for (let d in c) {
                    if (d.startsWith('["spaces/')) {
                        return Object.values(a);
                    }
                    let f = e(c[d].value, b + 1);
                    if (void 0 !== f) {
                        return f
                    }
                }
            }
            let f = Object.entries(window).find(a => a[0].startsWith("closure_lm_"))[1], c = e(f), a = [];
            function g(b) {
                for (let c in b) {
                    let a = b[c];
                    if ("object" == typeof a && null !== a && "string" == typeof a[1]) {
                        return a[1]
                    }
                }
            }

            for (let b = 0; b < c.length; b++) {
                let d = g(c[b]);
                -1 === a.indexOf(d) && a.push(d)
            }
            if (0 === a.length) {
                throw new Error("Could not find any name.");
            }
            a.sort((a, b) => a.localeCompare(b)),
                a.slice(1).reduce((a, b) => (
                a[0].length + b.length + 1 >= i ? a.unshift(b) : a[0] += "\n" + b, a),
                                  [a[0]]).reverse(),
                console.log(a),
                alert("The victim is " + a[Math.floor(Math.random() * a.length)])
        } catch (h) {
            alert("Unexpected error when running the script: " + h)
        }
    }

    function addVictimSelector(mutationList) {
        if (mutationList.length > 0) {
            let settingsListNode = null;
            for (let i = 8; i < 12; i++) {
                settingsListNode = document.querySelector("body > div:nth-child(" + i + ") > div > ul");
                if (settingsListNode !== null) {
                    break;
                }
            }

            if (settingsListNode !== null) {
                if (settingsListNode.querySelector(".victimSelectorAdded") === null) {
                    let divider = document.createElement("li")
                    divider.className = "VfPpkd-StrnGf-rymPhb-clz4Ic victimSelectorAdded"
                    let victimSelector = settingsListNode.children[1].cloneNode(true);
                    settingsListNode.attributes
                    victimSelector.children[1].children[0].textContent = "sentiment_very_dissatisfied";
                    victimSelector.children[2].textContent = "Victim Selector"

                    // Remove the onClick action of the new node
                    for (let i=1; i < victimSelector.attributes.length; i++) {
                        victimSelector.removeAttribute(victimSelector.attributes[i].name);
                    }
                    victimSelector.addEventListener("click", selectVictim);
                    settingsListNode.appendChild(divider);
                    settingsListNode.appendChild(victimSelector);
                }
            }
        }
    }

    let observer = new MutationObserver(addVictimSelector);
    let targetNode = document.querySelector('body');


    observer.observe(targetNode, { "childList": true });



})();