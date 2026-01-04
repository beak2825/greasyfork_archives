// ==UserScript==
// @name         Edit Name Sfacg Chat Novel
// @namespace    Hexros Raymond
// @version      1.1.3
// @description  Chỉnh sửa name cho truyện dạng chat của nguồn Sfacg
// @author       Hexros Raymond
// @license      MPL 2.0
// @match        *://*/truyen/sfacg/1/*/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505114/Edit%20Name%20Sfacg%20Chat%20Novel.user.js
// @updateURL https://update.greasyfork.org/scripts/505114/Edit%20Name%20Sfacg%20Chat%20Novel.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function createButton(text, onClickFunction, bottomOffset) {
        var button = document.createElement("button");
        button.className = "new-btn";
        button.textContent = text;

        let styles = {
            position: "fixed",
            bottom: bottomOffset + "px",
            right: "13px",
            fontSize: "14px",
            outline: "none",
            borderRadius: "100%",
            height: "50px",
            width: "50px",
            margin: "2px",
        };

        Object.assign(button.style, styles);
        button.addEventListener("click", onClickFunction);
        document.body.appendChild(button);
        return button;
    }

    function runName() {
        document.querySelector("button[onclick='showNS()']").click();
        let copyText = document.querySelector("#namewd").value;
        document.querySelector("button[onclick='hideNS()']").click();

        const names = [];
        copyText = copyText.split("\n");
        copyText.forEach((text) => {
            if (text.startsWith("$")) {
                text = text.replace("$", "");
                text = text.split("=");
                names.push({
                    original: text[0],
                    translated: text[1],
                });
            }
        });

        const chat_novel = document.querySelectorAll(".chatnovel > div");

        for (let k = names.length - 1; k >= 0; k--) {
            chat_novel.forEach((div) => {
                const textElements = div.querySelectorAll("i");

                for (let i = 0; i < textElements.length; i++) {
                    let combinedText = "";
                    let elementsToReplace = [];

                    for (let j = i; j < textElements.length; j++) {
                        if (
                            i === j &&
                            !names[k].original.startsWith(
                                textElements[j].getAttribute("t")
                            )
                        ) {
                            break;
                        }
                        combinedText += textElements[j].getAttribute("t");
                        elementsToReplace.push(textElements[j]);
                        if (combinedText === names[k].original) {
                            const newElement = document.createElement("i");
                            let h = "";
                            for (let k = 0; k < elementsToReplace.length; k++) {
                                h +=
                                    elementsToReplace[k].getAttribute("h") +
                                    " ";
                            }
                            h = h.trim();
                            newElement.setAttribute("h", h);
                            newElement.setAttribute("t", names[k].original);
                            newElement.setAttribute("v", names[k].translated);
                            newElement.setAttribute(
                                "id",
                                elementsToReplace[0].id
                            );
                            newElement.setAttribute(
                                "p",
                                elementsToReplace[0].getAttribute("p")
                            );
                            newElement.style.color = "inherit";
                            newElement.setAttribute("isname", "true");

                            newElement.textContent = names[k].translated;

                            elementsToReplace[0].replaceWith(newElement);

                            for (let l = 1; l < elementsToReplace.length; l++) {
                                elementsToReplace[l].remove();
                            }
                        }

                        if (combinedText.length > names[k].original.length) {
                            break;
                        }
                    }
                }
            });
        }
    }
    function checkForChatNovel() {
        const chatNovelExists = document.querySelector(".chatnovel");
        if (chatNovelExists) {
            runName();
        } else {
            setTimeout(checkForChatNovel, 500);
        }
    }
    window.onload = function () {
        createButton("Run", runName, 90);
        checkForChatNovel();
    };
})();
