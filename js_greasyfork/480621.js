// ==UserScript==
// @name         Skip Current Level
// @namespace    https://www.webhek.com/post/color-test/
// @version      1.0
// @description  Clears specific content on a Webhek page
// @match        https://www.webhek.com/post/color-test/
// @grant        none
// @author       huoyuuuu
// @homepage     https://github.com/huoyuuu
// @license      the MIT license
// @downloadURL https://update.greasyfork.org/scripts/480621/Skip%20Current%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/480621/Skip%20Current%20Level.meta.js
// ==/UserScript==


(function () {
    function clearContent() {
        var targetSpan = getMostCommonStyledSpan(4, 8);
        removeSpansWithSameStyle(targetSpan.style);
        targetSpan = document.evaluate("/html/body/div[2]/div[2]/div/span[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        targetSpan.click();
    }

    function getMostCommonStyledSpan(startIndex, endIndex) {
        var spans = document.getElementsByTagName('span');
        var spanStyles = new Map();
        for (let i = startIndex - 1; i < Math.min(spans.length, endIndex); i++) {
            let styleText = spans[i].style.cssText;
            if (spanStyles.has(styleText)) {
                spanStyles.set(styleText, spanStyles.get(styleText) + 1);
            } else {
                spanStyles.set(styleText, 1);
            }
        }

        var maxCount = 0;
        var targetSpanStyle = '';
        for (let [styleText, count] of spanStyles) {
            if (count > maxCount) {
                maxCount = count;
                targetSpanStyle = styleText;
            }
        }

        for (let i = startIndex - 1; i < spans.length; i++) {
            if (spans[i].style.cssText === targetSpanStyle) {
                return spans[i];
            }
        }
        return null;
    }

    function removeSpansWithSameStyle(targetStyle) {
        let spans = Array.from(document.getElementsByTagName('span'));
        spans.forEach(span => {
            if (span.style.cssText === targetStyle.cssText) {
                span.parentNode.removeChild(span);
            }
        });
    }

    var button = document.createElement("button");
    button.innerHTML = "跳过本关";
    button.style.position = "fixed";
    button.style.top = "50%";
    button.style.right = "10px";
    button.style.zIndex = 1000;
    document.body.appendChild(button);
    button.addEventListener("click", clearContent);
})();
