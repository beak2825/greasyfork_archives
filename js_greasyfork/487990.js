// ==UserScript==
// @name         Plagiarism Certification Tests Helper
// @namespace    http://tampermonkey.net/
// @version      2025-09-25
// @description  Highlight Word-for-word plagiarism, and enable text copy.
// @author       pangbo
// @match        https://plagiarism.iu.edu/plagiarismTest*
// @match        https://plagiarism.tedfrick.me/plagiarismTest*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iu.edu
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487990/Plagiarism%20Certification%20Tests%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/487990/Plagiarism%20Certification%20Tests%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightCommonWords(originalStr1, originalStr2) {
        const str1 = originalStr1.toLowerCase();
        const str2 = originalStr2.toLowerCase();

        const words1 = str1.split(' ');
        const words2 = str2.split(' ');
        let common = [];

        for (let i = 0; i < words1.length; i++) {
            let max_string = "";
            let max_len = 0;
            for (let j = 0; j < words2.length; j++) {
                if (words1[i] === words2[j]) {
                    let temp = words1[i];
                    let k = 1;
                    while (words1[i + k] && words2[j + k] &&
                        words1[i + k] === words2[j + k]) {
                        temp += ' ' + words1[i+k];
                        k++;
                    }
                    if (k > 2 && k > max_len) {
                        max_string = temp;
                        max_len = k;
                    }
                }
            }
            if (max_len > 2) {
                common.push(max_string);
                i += max_len - 1;
            }
        }

        common.forEach(function(item) {
            const regex = new RegExp(item, "gi");
            originalStr1 = originalStr1.replace(regex, '<span style="background-color: yellow;">$&</span>');
            originalStr2 = originalStr2.replace(regex, '<span style="background-color: yellow;">$&</span>');
        });

        return [originalStr1, originalStr2];
    }

    document.querySelectorAll('table').forEach(function (table) {
        table.style.userSelect = "initial";

        const p1 = table.querySelector("tr:nth-of-type(2) td:nth-of-type(1) p:nth-of-type(1)");
        const p2 = table.querySelector("tr:nth-of-type(2) td:nth-of-type(2) p:nth-of-type(1)");
        [p1.innerHTML, p2.innerHTML] = highlightCommonWords(p1.innerHTML, p2.innerHTML);

        if (
            Array.from(table.querySelectorAll("tr:nth-of-type(2) td:nth-of-type(2) p")).filter(
                (p) => p.innerText.trim().startsWith("References")
            ).length == 0
        ) {
            const newP = document.createElement("p");
            newP.innerHTML = '<span style="background-color: yellow; color: red;">No References</span>';
            table.querySelector("tr:nth-of-type(2) td:nth-of-type(2)").appendChild(newP);
        }
    });
})();