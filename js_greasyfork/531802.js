// ==UserScript==
// @name                Link Helper - Triple Click Text to Link
// @name:zh-CN          链接助手 - 三击自动转换
// @namespace           http://tampermonkey.net/
// @version             1.1
// @description         Convert text URLs to links on triple click
// @description:zh-CN   三击将文本URL转换为可点击链接
// @author              Alex3236
// @match               *://*/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/531802/Link%20Helper%20-%20Triple%20Click%20Text%20to%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/531802/Link%20Helper%20-%20Triple%20Click%20Text%20to%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLICK_TIMEOUT = 1000;
    const CLICK_THRESHOLD = 10;
    const URL_REGEX = /(https?:\/\/[^\s<]+|www\.[^\s<]+\.[^\s<]{2,})/gi;
    const STYLE = "color: #66CCFF; background: #163E64";

    let clicks = [];

    document.addEventListener('click', function(e) {
        const now = Date.now();
        clicks.push({
            time: now,
            x: e.clientX,
            y: e.clientY
        });

        if (clicks.length > 3) clicks.shift();

        if (clicks.length === 3) {
            const [first, second, third] = clicks;

            if (third.time - first.time < CLICK_TIMEOUT &&
                distance(first, second) < CLICK_THRESHOLD &&
                distance(second, third) < CLICK_THRESHOLD) {

                processTripleClick(e.clientX, e.clientY);
                clicks = []; // 重置点击记录
            }
        }
    });

    function distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function processTripleClick(x, y) {
        const textNode = getTextNodeFromPoint(x, y);
        if (!textNode || isInsideLink(textNode)) return;

        const text = textNode.nodeValue;
        const matches = findUrls(text);

        if (matches.length > 0) {
            replaceTextWithLinks(textNode, matches);
        }
    }

    function getTextNodeFromPoint(x, y) {
        let range;
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(x, y);
        } else if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(x, y);
            if (!pos) return null;
            range = document.createRange();
            range.setStart(pos.offsetNode, pos.offset);
            range.collapse(true);
        }
        return range?.startContainer?.nodeType === Node.TEXT_NODE ? range.startContainer : null;
    }

    function isInsideLink(node) {
        let parent = node.parentNode;
        while (parent) {
            if (parent.tagName === 'A') return true;
            parent = parent.parentNode;
        }
        return false;
    }

    function findUrls(text) {
        const matches = [];
        let match;

        while ((match = URL_REGEX.exec(text)) !== null) {
            matches.push({
                start: match.index,
                end: match.index + match[0].length,
                url: match[0]
            });
        }
        return matches;
    }

    function replaceTextWithLinks(textNode, matches) {
        const parent = textNode.parentNode;
        const docFrag = document.createDocumentFragment();
        let lastIndex = 0;

        matches.forEach(match => {
            if (match.start > lastIndex) {
                docFrag.appendChild(document.createTextNode(
                    textNode.nodeValue.slice(lastIndex, match.start)
                ));
            }

            const a = document.createElement('a');
            a.style = STYLE;
            a.href = match.url.startsWith('http') ? match.url : `http://${match.url}`;
            a.textContent = match.url;
            a.target = '_blank';
            docFrag.appendChild(a);

            lastIndex = match.end;
        });

        if (lastIndex < textNode.nodeValue.length) {
            docFrag.appendChild(document.createTextNode(
                textNode.nodeValue.slice(lastIndex)
            ));
        }

        parent.replaceChild(docFrag, textNode);
    }
})();
