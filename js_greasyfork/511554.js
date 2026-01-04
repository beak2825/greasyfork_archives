// ==UserScript==
// @name                Convert Text to Hyperlink
// @name:zh-CN          文本识别为超链接
// @namespace           https://github.com/KPI0/tampermonkey
// @version             1.5
// @description         Convert URLs in text nodes to hyperlinks using regular expressions
// @description:zh-cn   通过正则表达式将文本中的链接转换为超链接
// @author              KPI0
// @match               *://*/*
// @icon                data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzI4MTE3NTk1Mjc5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE2MjAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTU3My40NCA2NDBhMTg3LjY4IDE4Ny42OCAwIDAgMS0xMzIuOC01NS4zNkw0MTYgNTYwbDQ1LjI4LTQ1LjI4IDI0LjY0IDI0LjY0YTEyNC4zMiAxMjQuMzIgMCAwIDAgMTcwLjA4IDUuNzZsMS40NC0xLjI4YTQ5LjQ0IDQ5LjQ0IDAgMCAwIDQtMy44NGwxMDEuMjgtMTAxLjI4YTEyNC4xNiAxMjQuMTYgMCAwIDAgMC0xNzZsLTEuOTItMS45MmExMjQuMTYgMTI0LjE2IDAgMCAwLTE3NiAwbC01MS42OCA1MS42OGE0OS40NCA0OS40NCAwIDAgMC0zLjg0IDRsLTIwIDI0Ljk2LTQ5LjkyLTQwTDQ4MCAyNzYuMzJhMTA4LjE2IDEwOC4xNiAwIDAgMSA4LjY0LTkuMjhsNTEuNjgtNTEuNjhhMTg4LjE2IDE4OC4xNiAwIDAgMSAyNjYuNzIgMGwxLjkyIDEuOTJhMTg4LjE2IDE4OC4xNiAwIDAgMSAwIDI2Ni43MmwtMTAxLjI4IDEwMS4yOGExMTIgMTEyIDAgMCAxLTguNDggNy44NCAxOTAuMjQgMTkwLjI0IDAgMCAxLTEyNS4yOCA0OHoiIGZpbGw9IiMzMzMzMzMiIHAtaWQ9IjE2MjEiPjwvcGF0aD48cGF0aCBkPSJNMzUwLjcyIDg2NGExODcuMzYgMTg3LjM2IDAgMCAxLTEzMy4yOC01NS4zNmwtMS45Mi0xLjkyYTE4OC4xNiAxODguMTYgMCAwIDEgMC0yNjYuNzJsMTAxLjI4LTEwMS4yOGExMTIgMTEyIDAgMCAxIDguNDgtNy44NCAxODguMzIgMTg4LjMyIDAgMCAxIDI1OC4wOCA3Ljg0TDYwOCA0NjRsLTQ1LjI4IDQ1LjI4LTI0LjY0LTI0LjY0QTEyNC4zMiAxMjQuMzIgMCAwIDAgMzY4IDQ3OC44OGwtMS40NCAxLjI4YTQ5LjQ0IDQ5LjQ0IDAgMCAwLTQgMy44NGwtMTAxLjI4IDEwMS4yOGExMjQuMTYgMTI0LjE2IDAgMCAwIDAgMTc2bDEuOTIgMS45MmExMjQuMTYgMTI0LjE2IDAgMCAwIDE3NiAwbDUxLjY4LTUxLjY4YTQ5LjQ0IDQ5LjQ0IDAgMCAwIDMuODQtNGwyMC0yNC45NiA1MC4wOCA0MC0yMC44IDI1LjEyYTEwOC4xNiAxMDguMTYgMCAwIDEtOC42NCA5LjI4bC01MS42OCA1MS42OEExODcuMzYgMTg3LjM2IDAgMCAxIDM1MC43MiA4NjR6IiBmaWxsPSIjMzMzMzMzIiBwLWlkPSIxNjIyIj48L3BhdGg+PC9zdmc+
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/511554/Convert%20Text%20to%20Hyperlink.user.js
// @updateURL https://update.greasyfork.org/scripts/511554/Convert%20Text%20to%20Hyperlink.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Regular expression to match URLs starting with http or https
    const urlRegex = /(http:\/\/[^\s]+|https:\/\/[^\s]+)/g;

    function convertTextLinksToHyperlinks(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;
            const matches = text.match(urlRegex);

            if (matches) {
                const span = document.createElement('span');
                let lastIndex = 0;

                matches.forEach((match) => {
                    const matchIndex = text.indexOf(match, lastIndex);

                    // Append normal text
                    if (matchIndex > lastIndex) {
                        span.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
                    }

                    // Create hyperlink element
                    const link = document.createElement('a');
                    link.href = match;
                    link.target = '_blank'; // Open in a new tab
                    link.textContent = match;
                    span.appendChild(link);

                    lastIndex = matchIndex + match.length;
                });

                // Append remaining normal text
                if (lastIndex < text.length) {
                    span.appendChild(document.createTextNode(text.substring(lastIndex)));
                }

                node.parentNode.replaceChild(span, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip certain tags that should not contain links or be processed
            const skipTags = ['A', 'SCRIPT', 'STYLE', 'IMG', 'VIDEO', 'AUDIO', 'PICTURE', 'IFRAME', 'BUTTON', 'CANVAS', 'NAV', 'HEADER', 'FOOTER'];
            if (!skipTags.includes(node.tagName)) {
                // Recursively process child nodes
                for (let child of Array.from(node.childNodes)) {
                    convertTextLinksToHyperlinks(child);
                }
            }
        }
    }

    // Execute after the page has fully loaded
    window.addEventListener('load', function () {
        const mainContentSelectors = ['#main', '.content', '.article', '#content', '.post', '.entry']; // Common main content containers
        mainContentSelectors.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) {
                convertTextLinksToHyperlinks(container);
            }
        });
    });

})();
