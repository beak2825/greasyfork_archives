// ==UserScript==
// @name         jupyter notebook auto scroll
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add auto scroll to bottom feature for jupyter notebook pages.
// @author       Scruel Tao
// @homepage     https://github.com/scruel/tampermonkey-scripts/blob/main/jupyter-notebook-auto-scroll.js
// @match        http*://*/notebook*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418158/jupyter%20notebook%20auto%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/418158/jupyter%20notebook%20auto%20scroll.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var scrollDelay = 100;
    var defalutEnabled = true;

    var scrollEleIndex = 1;
    // To store the last scroll height attr of element.
    // If disable, set to -1.
    var scrollEleIndexMap = new Map();

    var lastScrollMap = new Map();
    var lastScrollTimekey = null;

    document.querySelectorAll(".output_scroll").forEach((e) => {
        e.scrollTop = e.scrollHeight;
    });

    function callScrollToBottom() {
        setTimeout(scrollToBottom, scrollDelay);
    }

    function scrollMonitor(event) {
        // Sometimes, the user needs to check the output. For output elements that have already scrolled
        // to the bottom, user typically will try to scroll up continuously on the output element, however
        // this operation will be failed if the auto-scroll feature is enabled, and they would have to
        // manually disable this feature before performing the upward scrolling. This function is mean to
        // make it more convenient: if the user attempts multiple upward scrolls, it will automatically
        // disable the auto-scroll feature to prevent the "meaningless scolling operations".
        var currentIndex = event.target.getAttribute("scroll_checkbox_index");
        if (!currentIndex) {
            return;
        }
        currentIndex = parseInt(currentIndex);
        const scrollHeight = scrollEleIndexMap.get(currentIndex);
        if (scrollHeight != -1) {
            const now = new Date();
            const timekey = `${now.getHours()}_${now.getMinutes()}`;
            // Only consider events within one minutes
            if (lastScrollTimekey != timekey) {
                lastScrollTimekey = timekey;
                lastScrollMap.clear();
            }
            const key = `${currentIndex}_${timekey}`;
            if (!lastScrollMap.has(key)) {
                lastScrollMap.set(key, 0);
            }

            if (scrollHeight - (event.target.scrollTop + event.target.clientHeight) > 0) {
                lastScrollMap.set(key, lastScrollMap.get(key) + 1);
            }
            if (lastScrollMap.get(key) > 7) {
                // Disable auto scroll via click checkbox
                document.querySelector(`input[scroll_checkbox_index="${currentIndex}"]`).click();
                lastScrollMap.clear();
            }
        }
    }

    function createCheckboxDiv(ele, currentIndex) {
        var div = document.createElement("div");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (defalutEnabled) {
            checkbox.checked = "checked";
            scrollEleIndexMap.set(currentIndex, ele.scrollHeight);
        }
        checkbox.setAttribute("scroll_checkbox_index", currentIndex);
        checkbox.onclick = function () {
            if (checkbox.checked) {
                scrollEleIndexMap.set(currentIndex, ele.scrollHeight);
            } else {
                scrollEleIndexMap.set(currentIndex, -1);
            }
        };
        div.append("Auto Scroll: ");
        div.append(checkbox);
        return div;
    }

    function scrollToBottom() {
        const outputEles = document.querySelectorAll(".output_scroll");
        outputEles.forEach((ele) => {
            var currentIndex = ele.getAttribute("scroll_checkbox_index");
            if (!currentIndex) {
                currentIndex = scrollEleIndex++;
                ele.setAttribute("scroll_checkbox_index", currentIndex);
                const checkboxDiv = createCheckboxDiv(ele, currentIndex);
                ele.parentElement.before(checkboxDiv);
                ele.addEventListener("scrollend", scrollMonitor);
            } else {
                currentIndex = parseInt(currentIndex);
            }
            var autoScroll = scrollEleIndexMap.get(currentIndex) != -1;
            if (autoScroll) {
                ele.scrollTop = ele.scrollHeight;
            }
        });
        callScrollToBottom();
    }

    scrollToBottom();
})();
