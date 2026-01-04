// ==UserScript==
// @name         Twitch channel sort with favorites
// @namespace    https://github.com/LloydWes
// @version      1.3
// @description  Reorders the followed channels list in the sidebar based on viewcount or alphabetical order, allows to place favorites on the top of the list.
// @author       Lloyd WESTBURY
// @match        https://www.twitch.tv/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_registerMenuCommand
// @grant GM_addStyle
// @run-at document-start
// @homepageURL  https://github.com/LloydWes/Twitch-custom-sort-with-favorite
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517225/Twitch%20channel%20sort%20with%20favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/517225/Twitch%20channel%20sort%20with%20favorites.meta.js
// ==/UserScript==

(async function () {

    'use strict';

    function findReact(dom) {
        if (dom[Object.keys(dom).find(a=>a.startsWith("__reactProps$"))].children) {
            return dom[Object.keys(dom).find(a=>a.startsWith("__reactProps$"))].children;
        }
        else {
            return dom[Object.keys(dom).find(a=>a.startsWith("__reactInternalInstance$"))].pendingProps.children;
        }
    }

    function waitForElement(querySelector) {
        return new Promise((resolve, reject) => {
            if (document.querySelectorAll(querySelector).length) resolve();
            const observer = new MutationObserver(() => {
                if (document.querySelectorAll(querySelector).length) {
                    observer.disconnect();
                    return resolve();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    let callback = null;
    function mettreAJourCallback() {
        if (GM_getValue("alpha")) { 
            callback = (a, b) => {
                let an = getNameWhatever(a);
                let bn = getNameWhatever(b);
                return ('' + an).localeCompare(bn);
            };
        } else {
            callback = (a, b) => {
                return viewcount(b) - viewcount(a);
            }
        }
    }

    async function ajouterBoutonEtLancerTrie() {
        let e;
        let followedSectionButton;
        let g;
        
        while(!(e = document.querySelector("[data-a-target='side-nav-header-expanded']"))) await wait(200);
        while(!(followedSectionButton = document.querySelector(".followed-side-nav-header--expanded"))) await wait(200);
        while(!(g = followedSectionButton.querySelector("button"))) await wait(200);

        let manageButtonSvgChanges = () => {
            g.firstElementChild.firstElementChild.lastElementChild.innerHTML = GM_getValue("alpha") ? "Alpha" : "Spec";
            let svgHolder = g.querySelector('path');
            if (GM_getValue("alpha")) {
                //svgHolder.setAttribute('d', 'M14.94 4.66h-4.72l2.36-2.36 2.36 2.36zm-4.69 14.71h4.66l-2.33 2.33-2.33-2.33zM6.1 6.27L1.6 17.73h1.84l.92-2.45h5.11l.92 2.45h1.84L7.74 6.27H6.1zm-1.13 7.37l1.94-5.18 1.94 5.18H4.97zm10.76 2.5h6.12v1.59h-8.53v-1.29l5.92-8.56h-5.88v-1.6h8.3v1.26l-5.93 8.6z');
                //svgHolder.setAttribute('d', 'M176 352h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.36 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352zm240-64H288a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h56l-61.26 70.45A32 32 0 0 0 272 446.37V464a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-56l61.26-70.45A32 32 0 0 0 432 321.63V304a16 16 0 0 0-16-16zm31.06-85.38l-59.27-160A16 16 0 0 0 372.72 32h-41.44a16 16 0 0 0-15.07 10.62l-59.27 160A16 16 0 0 0 272 224h24.83a16 16 0 0 0 15.23-11.08l4.42-12.92h71l4.41 12.92A16 16 0 0 0 407.16 224H432a16 16 0 0 0 15.06-21.38zM335.61 144L352 96l16.39 48z');
                svgHolder.setAttribute('d', 'M 8.125 13.75 L 6.25 13.75 L 6.25 1.875 C 6.25 1.53125 5.96875 1.25 5.625 1.25 L 4.375 1.25 C 4.03125 1.25 3.75 1.53125 3.75 1.875 L 3.75 13.75 L 1.875 13.75 C 1.320312 13.75 1.039062 14.421875 1.433594 14.816406 L 4.558594 18.566406 C 4.804688 18.8125 5.199219 18.8125 5.441406 18.566406 L 8.566406 14.816406 C 8.960938 14.425781 8.679688 13.75 8.125 13.75 Z M 17.5 11.25 L 12.5 11.25 C 12.15625 11.25 11.875 11.53125 11.875 11.875 L 11.875 13.125 C 11.875 13.46875 12.15625 13.75 12.5 13.75 L 14.6875 13.75 L 12.292969 16.5 C 12.027344 16.738281 11.875 17.078125 11.875 17.4375 L 11.875 18.125 C 11.875 18.46875 12.15625 18.75 12.5 18.75 L 17.5 18.75 C 17.84375 18.75 18.125 18.46875 18.125 18.125 L 18.125 16.875 C 18.125 16.53125 17.84375 16.25 17.5 16.25 L 15.3125 16.25 L 17.707031 13.5 C 17.972656 13.261719 18.125 12.921875 18.125 12.5625 L 18.125 11.875 C 18.125 11.53125 17.84375 11.25 17.5 11.25 Z M 18.714844 7.914062 L 16.398438 1.664062 C 16.308594 1.417969 16.074219 1.25 15.808594 1.25 L 14.191406 1.25 C 13.925781 1.25 13.691406 1.417969 13.601562 1.664062 L 11.285156 7.914062 C 11.21875 8.105469 11.246094 8.320312 11.363281 8.484375 C 11.480469 8.652344 11.671875 8.75 11.875 8.75 L 12.84375 8.75 C 13.117188 8.75 13.355469 8.574219 13.441406 8.316406 L 13.613281 7.8125 L 16.386719 7.8125 L 16.558594 8.316406 C 16.640625 8.574219 16.882812 8.75 17.15625 8.75 L 18.125 8.75 C 18.328125 8.75 18.519531 8.652344 18.636719 8.484375 C 18.753906 8.320312 18.78125 8.105469 18.714844 7.914062 Z M 14.359375 5.625 L 15 3.75 L 15.640625 5.625 Z M 14.359375 5.625 ');
            } else {
                svgHolder.setAttribute('d', 'M11 6 7 2 3 6l1.5 1.5L6 6v6h2V6l1.5 1.5L11 6Zm6 8-4 4-4-4 1.5-1.5L12 14V8h2v6l1.5-1.5L17 14Z');
            }
        };

        let followedButtonCallBack = (event) => {
            GM_setValue("alpha", !GM_getValue("alpha"));
            manageButtonSvgChanges();
            getStreamsAndSortThem();
            event.stopImmediatePropagation();
        }
        g.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
        });
        followedSectionButton.addEventListener('click', followedButtonCallBack, true);
        manageButtonSvgChanges();

    }
    let sidebar;
    let boutonAjouteEtTrie = false;

    while ((sidebar = document.getElementsByClassName("side-bar-contents")[0]) === undefined) {
        await new Promise(r => setTimeout(r, 500));
    }




    let weMutatedDom = false;
    let mutationSideBar = new MutationObserver((mutations) => {
        let fo = document.querySelectorAll(".side-nav-section .tw-transition-group")
        if (fo.length) {
            let bar = document.createElement("div");
            bar.classList.add("truc");
            weMutatedDom = true;
            let div1 = document.createElement("div");
            let div2 = document.createElement("div");
            let div3 = document.createElement("div");
            div3.classList.add("side-nav-card")
            div1.classList.add("mbar");
            div1.style.cssText = "transition-property: transform, opacity; transition-timing-function: ease; border-bottom: 3px solid #bf94ff;"
            div1.appendChild(div2);
            div2.appendChild(div3);

            fo[0].appendChild(div1);

            mutationSideBar.disconnect();
        }
    });
    mutationSideBar.observe(sidebar, {attributes: false, childList: true, subtree: true, characterData: true });
    let getStreamsAndSortThem = (mutations) => {
        mettreAJourCallback();
        if (weMutatedDom) {
            weMutatedDom = false;
            return;
        }

        // We're only interested in "new nodes added" and "text changed" mutations.
        let relevantMutation = false;

        if (mutations && mutations.length) {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes[0] || mutation.type === "characterData") {
                    relevantMutation = true;
                }
            });
        } else {
            relevantMutation = true;
        }
        if (!relevantMutation) return;

        let followedSection = sidebar.getElementsByClassName("side-nav-section")[0];

        // Mapping to 2 parents up, as that's the outermost element for a single channel
        let streams = [...followedSection.querySelectorAll(".side-nav-section div:not(:first-child) div.side-nav-card")].map(el => el.parentNode.parentNode);

            streams.sort((a, b) => {
                let aIsBar = isBar(a);
                let bIsBar = isBar(b);
                if (aIsBar) {
                    let bOnline = isOnline(b);
                    if (bOnline && isFav(b)) {
                        return 1;
                    } else {
                        return -1;
                    }
                } else if (bIsBar) {
                    let aOnline = isOnline(a);
                    if (aOnline && isFav(a)) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                let aOnline = isOnline(a);
                let bOnline = isOnline(b);
                if (aOnline && bOnline) {
                    let aIsFav = isFav(a);
                    let bIsFav = isFav(b);
                    if (aIsFav && bIsFav) {
                        return callback(a,b);
                    } else if (aIsFav) {
                        return -1;
                    } else if (bIsFav) {
                        return 1;
                    } else {
                        return callback(a,b);
                    }
                } else if (aOnline || bOnline) {
                    let aIsFav = isFav(a);
                    let bIsFav = isFav(b);
                    if (aOnline) {
                        return -1;
                    } else if (bOnline) {
                        return 1;
                    } else if (aIsFav) {
                            return -1;
                    } else if (bIsFav) {
                            return 1;
                    } else {
                        return 0;
                    }
                }
            });


        weMutatedDom = true;
        streams[0].parentNode.append(...streams);
        if (!boutonAjouteEtTrie) {
            ajouterBoutonEtLancerTrie();
            boutonAjouteEtTrie = true;
        }
    }

    function isBar(el) {
        return el.classList.contains("mbar")
    }
    function isFav(a) {
        return GM_getValue(getNameWhatever(a).toLowerCase(), undefined) ? 1 : 0;
    }

    function getNameWhatever(element) {
        let component = findReact(element);
        // If "stream" property doesn't exist (optional chaining below) then the stream is offline.
        if (component.props.stream) {
            return component
                .props.stream
                .user.login;
        } else {
            return component
                .props.videoConnection
                .user.login;
        }
    }

    function isOnline(element) {
        let component = findReact(element);
        // If "stream" property doesn't exist (optional chaining below) then the stream is offline.
        if (component.props.stream) {
            return 1
        } else {
            return 0;
        }
    }

    function viewcount(element) {
        let component = findReact(element);
        // If "stream" property doesn't exist (optional chaining below) then the stream is offline.
        if (component.props.stream) {
            return component
                .props.stream
                .content.viewersCount;
        } else {
            return null;
        }
    }

    new MutationObserver(getStreamsAndSortThem).observe(sidebar, {attributes: false, childList: true, subtree: true, characterData: true });


    let clickedEl = null;
    document.addEventListener("contextmenu", function(event){
        clickedEl = event.target;
    });

    GM_registerMenuCommand("toggle favorite", () => {
        if(clickedEl) {
            let e = clickedEl;
            let limit = 10;
            while (!e.classList.contains("side-nav-card")) {
                e = e.parentNode;
                limit--;
                if (limit <= 0) break;
            }
            let n = getNameWhatever(e.parentNode.parentNode);
            let currentValue = GM_getValue(n)
            if (currentValue) {
                GM_deleteValue(n);
            }
            else {
                GM_setValue(n, 1);
            }
            getStreamsAndSortThem();
            clickedEl = null;
        }
    });
    const wait = async (ms) => { await new Promise((resolve) => { setTimeout(resolve, ms); });}
}());
