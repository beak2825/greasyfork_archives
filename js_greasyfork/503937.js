// ==UserScript==
// @name            arca.live Auto Base64 Decoder
// @description     Automatically decodes Base64 content in mod pages and converts valid URLs into clickable links on arca.live.
// @description     모드 페이지의 Base64 콘텐츠를 자동으로 디코딩하고 유효한 URL을 arca.live에서 클릭 가능한 링크로 변환합니다.
// @description     自动解码 MOD 页面中的 Base64 内容，并将有效 URL 转换为 arca.live 上的可点击链接。
// @version         0.4
// @author          
// @match           *://arca.live/b/*/*
// @grant           none
// @run-at          document-end
// @license         MIT
// @namespace https://greasyfork.org/users/1350640
// @downloadURL https://update.greasyfork.org/scripts/503937/arcalive%20Auto%20Base64%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/503937/arcalive%20Auto%20Base64%20Decoder.meta.js
// ==/UserScript==

function decodeBase64(str) {
    try {
        let padding = str.length % 4;
        if (padding > 0) {
            str += '='.repeat(4 - padding);
        }
        return decodeURIComponent(escape(window.atob(str)));
    } catch {
        return str;
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function processTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        const base64Pattern = /[A-Za-z0-9+/]{4,}={0,2}/g;

        let updatedText = text.replace(base64Pattern, (match) => {
            let decoded = decodeBase64(match);
            decoded = decoded.replace(/=+$/, ''); // Remove any remaining padding

            if (decoded !== match) {
                if (isValidUrl(decoded)) {
                    return `<a href="${decoded}" target="_blank">${decoded}</a>`;
                }
                return decoded;
            }
            return match; // Return the original match if no valid decoding occurs
        });

        if (updatedText !== text) {
            // Safely update the text content without altering the HTML structure
            let tempElement = document.createElement('span');
            tempElement.innerHTML = updatedText;
            node.parentNode.replaceChild(tempElement, node);
        }
    }
}

function traverseNodes(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        // Process child nodes within elements
        node.childNodes.forEach(traverseNodes);
    } else {
        processTextNode(node);
    }
}

// Check if the current page is a thread page
function isThreadPage() {
    return window.location.href.match(/https:\/\/arca\.live\/b\/[^\/]+\/\d+/);
}

(function() {
    'use strict';

    if (isThreadPage()) {
        // Select elements with both "article-body" and "message" classes
        let elements = document.querySelectorAll('.article-body, .message');
        elements.forEach(element => {
            traverseNodes(element);
        });
    }
})();