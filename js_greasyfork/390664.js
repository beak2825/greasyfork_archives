// ==UserScript==
// @name         TypingClub All-In-One
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dirty compilation of the previous scripts to work with the SPA.
// @author       LeReverandNox
// @match        https://www.typingclub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390664/TypingClub%20All-In-One.user.js
// @updateURL https://update.greasyfork.org/scripts/390664/TypingClub%20All-In-One.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var checkExist = null;
    var checkExist2 = null;
    var prevPathname = null;

    function bindingsCb(e) {
        // keys
        const homeKey = 'h';
        const resetKey = 'r';
        const nextKey = 'f';

        // buttons
        const home = document.getElementById("res_menu").children[0];
        const reset = document.getElementById("res_menu").children[1];
        const next = document.getElementById("res_menu").children[2];

        if (e.ctrlKey && e.key == homeKey) {
            e.preventDefault();
            home.click();
        }  else if (e.ctrlKey && e.key == resetKey) {
            e.preventDefault();
            reset.click();
        } else if (e.ctrlKey && e.key == nextKey) {
            e.preventDefault();
            next.click();
        }

    }

    function adFree() {
        checkExist = setInterval(function () {
            const ad = document.getElementById("adslot_1")
            const container = document.getElementsByClassName("container med")[0];
            const textHolder = document.getElementsByClassName("inview")[0];

            if (ad && container && textHolder) {
                for (let i = 1; i < 10; i += 1) {
                    let ad = document.getElementById("adslot_" + i);
                    if (ad) ad.remove();
                }
                container.style.marginRight = "auto";
                textHolder.style.cursor = "none";
                clearInterval(checkExist);
            }
        }, 100);
    }

    function fullWidthPagination() {
        checkExist = setInterval(function () {
            const ad = document.getElementById("adslot_1");
            const lessonNav = document.getElementsByClassName("lessons-nav")[0];
            const rows = [].slice.call(document.getElementsByClassName("lsnrow"));
            const rowHolder = document.getElementsByClassName("lparena")[0];

            if (ad && rows) {
                for (let i = 1; i < 10; i += 1) {
                    let ad = document.getElementById("adslot_" + i);
                    if (ad) ad.remove();
                }
                lessonNav.style.right = "50px";

                const chapters = [];
                let nbBoxes = 0;
                rows.forEach(row => {
                    const f = row.children[0]
                    if (f.tagName == "H2") {
                        chapters.push({ title: f, boxes: [] });
                    }
                    const boxes = chapters[chapters.length - 1].boxes;
                    const r = row.getElementsByClassName("box-row")[0];
                    let tmpBoxes = [].slice.call(r.children);
                    tmpBoxes.forEach(b => {
                        boxes.push(b);
                        nbBoxes += 1;
                    });

                });

                const boxWidth = chapters[0].boxes[0].offsetWidth;
                const rowWidth = rows[0].offsetWidth;
                const boxPerRow = Math.floor(rowWidth / (boxWidth));

                rowHolder.innerHTML = "";

                let currRow = 0;
                let currTitle = "";

                chapters.forEach(c => {
                    let i = 0;
                    c.boxes.forEach(b => {
                        if (i % boxPerRow == 0) {
                            let row = document.createElement("div");
                            row.classList.add("lsnrow");
                            row.classList.add("active");
                            row.setAttribute("name", "row-" + currRow);
                            if (currTitle != c.title.innerText) {
                                row.append(c.title);
                                currTitle = c.title.innerText;
                            }
                            currRow += 1;
                            const boxRow = document.createElement("div");
                            boxRow.classList.add("box-row");
                            row.append(boxRow);
                            rowHolder.append(row);
                        }
                        let boxRow = rowHolder.lastChild.lastChild;
                        boxRow.append(b);
                        i += 1;
                    });
                });

                clearInterval(checkExist);
            }
        });
    }

    function skipPremiumGames() {
        checkExist2 = setInterval(function() {
            const root = document.getElementById("root");

            if (root) {
                const holder = root.firstElementChild.firstElementChild;
                setTimeout(() => {
                    if (holder.children.length) {
                        holder.getElementsByClassName("edmodal-x")[0].click();
                    }
                }, 250);
                clearInterval(checkExist);
            }
        }, 100);
    }

    var checkLocation = setInterval(() => {
        const l = window.location;
        const p = l.pathname;

        if (p !== prevPathname) {
            if (checkExist) clearInterval(checkExist);
            if (checkExist2) clearInterval(checkExist2);
            document.removeEventListener("keydown", bindingsCb);

            if (p.match(/\/sportal\/push_results_display\/*/)) {
                document.addEventListener("keydown", bindingsCb);
            }
            if (p.match(/\/sportal\/program-[0-9]+\/[0-9]+.play/)) {
                adFree();
                skipPremiumGames();
            }
            if (p.match(/\/sportal\/program-[0-9]+.game/)) {
                fullWidthPagination();
            }
        }

        prevPathname = p;
    }, 100);

})();