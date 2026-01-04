// ==UserScript==
// @name         [Tool] Arealme - Color Hue Test
// @namespace    -
// @version      1.0
// @description  顯示所有方格的顏色順序。
// @author       LianSheng
// @match        https://www.arealme.com/color-hue-test/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arealme.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471808/%5BTool%5D%20Arealme%20-%20Color%20Hue%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/471808/%5BTool%5D%20Arealme%20-%20Color%20Hue%20Test.meta.js
// ==/UserScript==

(function () {
    /**
     * 將文字格式 `rgb(r, g, b)` 轉成陣列 `[r, g, b]`.
     * @param {string} raw 
     * @returns {Array<number>}
     */
    function toRGB(raw) {
        raw = raw.replace("rgb(", "").replace(")", "");
        return raw.split(", ").map(Number);
    }

    /**
     * 選擇排序依據的色彩通道. 
     * @param {Array<number>} a `A[r, g, b]`
     * @param {Array<number>} b `B[r, g, b]`
     * @returns {number} Array index
     */
    function selectCriteriaChannel(a, b) {
        for (let i = 0; i <= 2; i++) {
            if (a[i] !== b[i]) {
                return i;
            }
        }
    }

    /**
     * 計算每個 box 的順序，並將其值附加至屬性 `ord`.
     * @param {Array<HTMLElement>} boxes 
     * @returns {void}
     */
    function sortBoxes(boxes) {
        const criteria = selectCriteriaChannel(
            toRGB(boxes[0].style.backgroundColor),
            toRGB(boxes[boxes.length - 1].style.backgroundColor)
        );

        const firstBox = boxes[0];

        boxes.sort((a, b) => toRGB(a.style.backgroundColor)[criteria] - toRGB(b.style.backgroundColor)[criteria]);

        if (boxes[0] !== firstBox) {
            boxes.reverse();
        }

        boxes.forEach((each, idx) => each.setAttribute("ord", idx + 1));
    }

    /**
     * 標記所有 box.
     * @param {Array<HTMLElement>} boxes 
     * @returns {void}
     */
    function markBoxes(boxes) {
        boxes.forEach(b => b.classList.add("modified"));
    }

    /**
     * 追加 [Show Hint] 按鈕到原本的打勾按鈕後面.
     * @returns {void}
     */
    function appendHintButton() {
        const confirm = document.querySelector(".dp-confirm-btn");
        const hint = document.createElement("button");
        hint.classList.add("show-hint");
        hint.style.backgroundColor = "red";
        hint.style.color = "black";
        hint.style.margin = "5em 1em";
        hint.style.padding = "6px 12px";
        hint.style.fontSize = "1.5rem";
        hint.style.fontWeight = "bold";
        hint.style.textShadow = "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white";
        hint.style.border = "4px solid #9999";

        hint.innerText = "Show Answer";

        hint.onclick = _ => {
            showHint();
            solveHandler();
        };

        confirm.insertAdjacentElement("afterend", hint);
        confirm.addEventListener("click", solveHandler);
    }

    /**
     * 在所有 box 上顯示答案.
     * @returns {void}
     */
    function showHint() {
        const boxes = [...document.querySelectorAll(".dp-box")];
        boxes.forEach(each => {
            each.innerText = each.getAttribute("ord");
            each.style.fontWeight = "bold";
            each.style.textShadow = "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white";
        });
    }

    /**
     * 主要程式
     * @returns {void}
     */
    function solveHandler() {
        const container = document.querySelector(".dp-box-container");

        if (container) {
            const boxes = [...document.querySelectorAll(".dp-box")];
            const hint = document.querySelector(".show-hint");

            if (boxes[0].classList.contains("modified")) {
                return;
            }

            if (!hint) {
                appendHintButton();
            }

            markBoxes(boxes);
            sortBoxes(boxes);

            return;
        }

        setTimeout(solveHandler, 100);
    }

    solveHandler();
})();