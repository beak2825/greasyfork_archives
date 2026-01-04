// ==UserScript==
// @name         Arca base64 to link
// @description  Arcalive의 게시물에 있는 base64 코드를 즉시 디코딩해 링크로 만듭니다.
// @namespace    https://greasyfork.org/users/1061188-mowajelly
// @author       Mowa
// @version      1.1
// @match        https://arca.live/b/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464133/Arca%20base64%20to%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/464133/Arca%20base64%20to%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const TAG = 'ARCA_BASE64_DECODE>';
    const LINK_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAYCAYAAAALQIb7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGzSURBVEhLvZNPSwJBGIf9Inv3Ht7EW0IIJfQBvAgSeIikW4LQoYMQKF7qIkLSScHQwItEJuthTQhiDxUKmVpgJQSGqb/2j+bMzmh0mAaewzzzm/ddeGdttogN/wZXioIrRcGVouBKUXClKLgyYsd6MY5sQ4b8SJM8NzNr5TxzJt+lEc7YLbUIGJHYQrr3gUVLqZg5n9qZGusaotuIwGWtq0MLL1KvI+PK6FNFoRZGIO2Bh8CZMLPS0SrlPZkdxNUaumPjNlqqHxJVW4PcSBdXGOjZoYJokgj9Aeksi9ZEL/KA1InlnNzsNY1WuFUcRCiIpHU2VupBIj+vU5clylPNom0j8zMXkygUUy9e7SiRn8+zo/ooTzXbvn83Qs0bLxHaQKgaQ2wZxQ0i70DiWZ/7CNXyzE2hNoUCenq3SQu5/JInvBAJblmB8Za/tLkfW86pjRb2qy3tm/SGAzy9sPNZ9p9dv/XNu1o7peIi6k5hRMSFXVVF33hR7Pr1Pxt3Ubp0s89ehxEzEk4ESux8QqfmuSO3z5wdFDexcmipQ8KVouBKUXClKLhSFFwpCq4UBVcKwYZvEEnkgzVZybcAAAAASUVORK5CYII=';
    
    function buildLinkElement (linkStr) {
        const linkElement = document.createElement('a');
        linkElement.style = 'color: #090 !important; text-decoration: underline;';
        linkElement.href = linkStr;
        linkElement.target = '_blank';
        linkElement.referrerPolicy = 'no-referrer';
        const strElement = document.createTextNode(' ' + linkStr);
        const imgElement = document.createElement('img');
        imgElement.src = LINK_IMG;
        imgElement.style = 'width: 16px; height: 16px; margin-left: 4px; vertical-align: middle;';
        linkElement.appendChild(imgElement);
        linkElement.appendChild(strElement);

        return linkElement;
    }

    function findElementContainText (element, text) {
        const children = element.childNodes;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // child.nodeType === 3 : TEXT_NODE
            if (child.nodeType === 3 && (''+child.nodeValue).includes(text)) {
                return child;
            }
            const result = findElementContainText(child, text);
            if (result) {
                return result;
            }
        }
        return null;
    }

    async function init () {
        const articleElement = document.querySelector('.article-content');
        if (!articleElement) return;

        // 게시물 전문을 공백과 개행으로 분리한 후, base64 코드가 있는지 확인합니다.
        const articleText = articleElement.innerText;
        const articleTextArray = articleText.split(/\s+/g);

        for (let i = 0; i < articleTextArray.length; i++) {
            const target = articleTextArray[i];
            if (!target.match(/^[a-zA-Z0-9+/]{20,}={0,2}$/)) continue;
            try {
                const decoded = atob(target);
                if (!decoded.startsWith('http')) continue;
                const linkElement = buildLinkElement(decoded);
                const textNode = findElementContainText(articleElement, target);
                if (!textNode) {
                    // 게시물 전문에 base64 코드가 없는 경우, 게시물 전문의 맨 뒤에 링크를 추가합니다.
                    articleElement.appendChild(linkElement);
                    continue;
                }
                // 게시물 전문에 base64 코드가 있는 경우, 해당 코드뒤에 링크를 추가합니다.
                textNode.parentNode.insertBefore(linkElement, textNode.nextSibling);
            } catch (err) {
                console.error(TAG, 'parse fail>', err);
            }
        }
    }

    init().catch(err => {
        console.error(TAG, 'init fail>', err);
    });
})();