// ==UserScript==
// @name         TestMTLH
// @namespace    https://misskey.io/@secineralyr
// @version      0.0.3.beta
// @description  テスト用/TLノート制御
// @author       しせる
// @match        https://misskey.io/*
// @downloadURL https://update.greasyfork.org/scripts/467650/TestMTLH.user.js
// @updateURL https://update.greasyfork.org/scripts/467650/TestMTLH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const extendWindowHeight = 1000;
    const topUpdateY = 16;

    window.addEventListener("load", () => {
        let isLockedFirstChild = false;
        let firstChild = null;
        let timeLinePadding = 0;
        const topElementStack = [];
        const bottomElementStack = [];

        const scrollEvent = () => {
            if (window.scrollY <= topUpdateY) {
                isLockedFirstChild = false;
                firstChild = null;
                timeLinePadding = 0;
                const e = document.querySelector(".xcSej.x3762");
                if (e != null) {
                    e.parentElement.style.paddingTop = "";
                    const allList = [...topElementStack.map(v => v[1]), ...bottomElementStack.reverse().map(v => v[1])];
                    if (allList.length !== 0) {
                        e.parentElement.prepend(allList[0]);
                    }
                    e.parentElement.append();
                }
                topElementStack.splice(0);
                bottomElementStack.splice(0);
                return;
            }
            const notes = [...document.querySelectorAll(".xcSej.x3762")];
            if (notes.length === 0) {
                return;
            }

            if (!isLockedFirstChild) {
                isLockedFirstChild = true;
                firstChild = notes[0];
            }

            const parentElement = notes[0].parentElement;

            const emptyDivElements = parentElement.querySelectorAll(":scope > div:where(:not([class]), [class=''])");
            for (const divElement of emptyDivElements) {
                parentElement.removeChild(divElement);
            }

            const topElement = topElementStack.pop();
            if (typeof topElement !== "undefined") {
                const pos = notes[0].getBoundingClientRect();
                const top_y = pos.y - topElement[0];
                if (pos.y + extendWindowHeight >= 0 && top_y <= window.outerHeight + extendWindowHeight) {
                    firstChild.after(topElement[1]);
                    timeLinePadding -= topElement[0];
                }
                else {
                    topElementStack.push(topElement);
                }
            }
            const bottomElement = bottomElementStack.shift();
            if (typeof bottomElement !== "undefined") {
                const pos = notes[notes.length - 1].getBoundingClientRect();
                const top_y = pos.y + pos.height;
                const bottom_y = top_y + bottomElement[0];
                if (bottom_y + extendWindowHeight >= 0 && top_y <= window.outerHeight + extendWindowHeight) {
                    parentElement.append(bottomElement[1]);
                }
                else {
                    bottomElementStack.unshift(bottomElement);
                }
            }

            if (notes.findIndex(v => v.classList.contains("list-move")) !== -1) return;

            let removeCount = 0;
            for (const note of notes) {
                note.querySelectorAll("div.image:not([data-isinited])").forEach(v => {
                    v.setAttribute('data-isinited', '1');
                    const bt1 = v.querySelector(".xEvDK._button");
                    v.removeChild(bt1);

                    let isPopupOpened = false;
                    v.addEventListener('mouseenter', () => {
                        if (isPopupOpened) return;
                        v.append(bt1);
                    });
                    v.addEventListener('mouseleave', () => {
                        const popupElement = document.querySelector("._popup._shadow.x7rzo:has(.x6Ns0.xunvs)");
                        if (popupElement != null) {
                            isPopupOpened = true;
                        }
                        if (isPopupOpened) return;
                        v.removeChild(bt1);
                    });

                    const bt2 = v.querySelector(".xlnR0._button");
                    v.removeChild(bt2);

                    v.addEventListener('mouseenter', () => {
                        v.append(bt2);
                    });
                    v.addEventListener('mouseleave', () => {
                        v.removeChild(bt2);
                    });
                });

                if (note === firstChild) continue;

                if (notes.length - removeCount < 2) break;
                const pos = note.getBoundingClientRect();
                const bottom_y = pos.y + pos.height;
                if (bottom_y + extendWindowHeight < 0 && pos.y + extendWindowHeight < 0) {
                    topElementStack.push([pos.height, note]);
                    parentElement.removeChild(note);
                    timeLinePadding += pos.height;
                    removeCount++;
                }
                else if (pos.y > window.outerHeight + extendWindowHeight && bottom_y > window.outerHeight + extendWindowHeight) {
                    bottomElementStack.push([pos.height, note]);
                    parentElement.removeChild(note);
                    removeCount++;
                }
            }

            parentElement.style.paddingTop = timeLinePadding + "px";
        };

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            addEventListener("touchmove", scrollEvent);
        }
        addEventListener("scroll", scrollEvent);
    }, { once: true });
})();
