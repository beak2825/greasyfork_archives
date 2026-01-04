// ==UserScript==
// @name         Snowflake Copy Selected Table Name to Clipboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  In the Snowflake "preview" GUI (September 2021), find the selected view or table, if any, then copy the fully qualified name to the clipboard
// @author       Zev Averbach
// @include      /^https?://app\.snowflake\.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432345/Snowflake%20Copy%20Selected%20Table%20Name%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/432345/Snowflake%20Copy%20Selected%20Table%20Name%20to%20Clipboard.meta.js
// ==/UserScript==
(function() {

    // observer code from https://stackoverflow.com/a/47406751/4386191

    let observer = new MutationObserver(resetTimer);
    let timer = setTimeout(action, 3000, observer); // wait for the page to stay still for 3 seconds
    observer.observe(document, {childList: true, subtree: true});

    function resetTimer(changes, observer) {
        clearTimeout(timer);
        timer = setTimeout(action, 3000, observer);
    }

    function action(o) {
        // find the selected view or table, if any, then copy the fully qualified name to the clipboard
        o.disconnect();
        console.log('script loaded successfully')
        // hardcoded for the Snowflake "preview" GUI as of September 13 2021
        const rows = document.querySelector(".content")
        .children[0]
        .children[1]
        .children[0]
        .children[0]
        .children[1]
        .children[0]
        .children[2]
        .children[0]
        .children[0]
        .children[0]
        .children[0]
        .children[0]
        .children[0]
        .children[0]
        .children[0]
        .children[0]
        .children[1]
        .children

        const getCurrentlySelectedItem = () => Array.from(rows).filter(row => row.dataset.oeNodeColor === "#1a6ce7")[0]

        const getLeftPadding = el => window.getComputedStyle(el, null).getPropertyValue("padding-left")

        const NoneSelected = {}
        const LEFT_PADDING_TABLE_LEVEL = "68px"
        const LEFT_PADDING_IGNORE_LEVEL = "48px"
        const LEFT_PADDING_IGNORE_LEVELS = [LEFT_PADDING_TABLE_LEVEL, LEFT_PADDING_IGNORE_LEVEL]
        const LEFT_PADDING_SCHEMA_LEVEL = "28px"

        const getSelectedNameInSql = () => {
            const selectedElement = getCurrentlySelectedItem()
            if (!selectedElement) {
                throw NoneSelected
            }

            const tableText = selectedElement.innerText

            let currentLevel = LEFT_PADDING_TABLE_LEVEL
            let el = selectedElement

            while (LEFT_PADDING_IGNORE_LEVELS.includes(currentLevel)) {
                el = el.previousSibling
                currentLevel = getLeftPadding(el)
            }

            const schemaText = el.innerText
            while (LEFT_PADDING_IGNORE_LEVELS.concat(LEFT_PADDING_SCHEMA_LEVEL).includes(currentLevel)) {
                el = el.previousSibling
                currentLevel = getLeftPadding(el)
            }

            const dbText = el.innerText

            return `${dbText}.${schemaText}.${tableText}`
            }

        document.addEventListener("keydown", function(e) {
            if (e.key === "0" && e.ctrlKey) {
                const name = getSelectedNameInSql()
                navigator.clipboard.writeText(name)
            }
        })
    }
})();
