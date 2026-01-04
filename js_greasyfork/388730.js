// ==UserScript==
// @name         TypingClub full-widht pagination
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use the entire width to display the boxes in free-mode. it brokes the menu but eeeeh...
// @author       LeReverandNox
// @match        https://www.typingclub.com/sportal/program-*.game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388730/TypingClub%20full-widht%20pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/388730/TypingClub%20full-widht%20pagination.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const checkExist = setInterval(function() {
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
                    chapters.push({title: f, boxes: []});
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
})();