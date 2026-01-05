// ==UserScript==
// @name        Save GameFAQs as a text file
// @description Save GameFAQs as a text file.
// @namespace   undefined
// @include     https://gamefaqs.gamespot.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29051/Save%20GameFAQs%20as%20a%20text%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/29051/Save%20GameFAQs%20as%20a%20text%20file.meta.js
// ==/UserScript==
/*jslint browser*/
(function () {
    const faqTextDiv = document.getElementById("faqtext");
    /**
     * @param {HTMLElement} textDiv
     * @returns {Blob}
     */
    const createBlob = (textDiv) => new Blob(
        [Array.from(textDiv.getElementsByTagName("pre")).map(
            (faqSpan) => faqSpan.textContent
        ).join("\n")],
        {endings: "native"}
    );
    function getDownloadName() {
        const faqTitleHead = document.querySelector("div.ffaq > h2.title");
        if (faqTitleHead) {
            return faqTitleHead.textContent + ".txt";
        }
        return "faq.txt";
    }
    /**
     * @param {Blob} blob - The blob data to be downloaded.
     * @param {string} downloadName - The name for the downloaded file.
     * @returns {HTMLAnchorElement}
     */
    function makeAnchor(blob, downloadName) {
        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = downloadName;
        return anchor;
    }
    if (faqTextDiv) {
        const textModeButton = document.getElementById("printable");
        if (textModeButton) {
            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Download the Text File";
            downloadButton.addEventListener("click", function () {
                const anchor = makeAnchor(
                    createBlob(faqTextDiv),
                    getDownloadName()
                );
                anchor.click();
                URL.revokeObjectURL(anchor.href);
            });
            textModeButton.parentNode.append(" ", downloadButton);
        }
    }
}());
