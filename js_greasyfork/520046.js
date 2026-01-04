// ==UserScript==
// @name         随机元素旋转器 - Random Element Rotator
// @namespace    https://github.com/Losketch
// @version      0.2
// @author       Losketch
// @description  随机旋转网页元素 - Randomly rotate elements on webpage
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTA4MCAxMDgwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSI4ODUuOSIgeDI9IjM5NC4xIiB5MT0iLTY1LjkiIHkyPSI3ODUuOSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtNDIwKSBzY2FsZSgxLjUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3ByZWFkTWV0aG9kPSJyZWZsZWN0Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0QzcxRjIiLz48c3RvcCBvZmZzZXQ9Ii41IiBzdG9wLWNvbG9yPSIjNzRDNEU5Ii8+PHN0b3Agb2Zmc2V0PSIuOCIgc3RvcC1jb2xvcj0iIzc0QzRFOSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzJGODBFRCIgc3RvcC1vcGFjaXR5PSIuNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzJGODBFRCIgc3RvcC1vcGFjaXR5PSIuNyIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iNjQwIiB4Mj0iNjQwIiB5MT0iMTgwIiB5Mj0iNTQwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgc3ByZWFkTWV0aG9kPSJyZWZsZWN0Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNGMEY4RkQiLz48c3RvcCBvZmZzZXQ9Ii42IiBzdG9wLWNvbG9yPSIjNzRDNEU5Ii8+PHN0b3Agb2Zmc2V0PSIuOCIgc3RvcC1jb2xvcj0iIzUwOTVGMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Q1RTVGQSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHhsaW5rOmhyZWY9IiNhIiBpZD0iZSIgeDE9IjY0MCIgeDI9IjY0MCIgeTE9IjE4MCIgeTI9IjU0MCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjQ5MTczIDAgMCAxLjQ5MDg5IC00MTQgMSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBzcHJlYWRNZXRob2Q9InJlZmxlY3QiLz48ZmlsdGVyIGlkPSJkIiB3aWR0aD0iMTIwJSIgaGVpZ2h0PSIxMjAlIiB4PSItMTAlIiB5PSItMTAlIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIHByaW1pdGl2ZVVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGZlQ29tcG9uZW50VHJhbnNmZXIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVGdW5jUiB0YWJsZVZhbHVlcz0iMC4yOTgwMzkgMC4yOTgwMzkiIHR5cGU9ImRpc2NyZXRlIi8+PGZlRnVuY0cgdGFibGVWYWx1ZXM9IjAuNDQzMTM3IDAuNDQzMTM3IiB0eXBlPSJkaXNjcmV0ZSIvPjxmZUZ1bmNCIHRhYmxlVmFsdWVzPSIwLjk0OTAyIDAuOTQ5MDIiIHR5cGU9ImRpc2NyZXRlIi8+PGZlRnVuY0EgdHlwZT0ibGluZWFyIi8+PC9mZUNvbXBvbmVudFRyYW5zZmVyPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIuMjIyMjIgMi4yMjIyMiIvPjwvZmlsdGVyPjwvZGVmcz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDEwODB2MTA4MEgweiIvPjxwYXRoIGZpbGw9IiM1OGI3ZjUiIGQ9Ik0xNTkgMTAwMmgtMTJ2MmgzbDEgMXYzN2wtMSAyLTIgMXYyaDE4di0yaC0ybC0xLTJ2LTEybDIgMSAyIDIgMiA1IDIgM3YzaC0xdjJoMTd2LTJsLTItMS0zLTUtOC0xMyA0LTUgMy0yIDQtMnYtMWgtMTR2MWwyIDF2M2wtMiAzYTQxIDQxIDAgMCAxLTUgNCA1IDUgMCAwIDEtMiAwaC0xdi0yNnptMTM5IDBoLTEydjJoM2wxIDF2MzhsLTEgMS0yIDF2MmgxOHYtMmwtMi0xLTEtMXYtMTlhNSA1IDAgMCAxIDEtMSA1IDUgMCAwIDEgMi0yIDQgNCAwIDAgMSAxIDBsMyAxIDEgMnYxOWwtMSAyaC0ydjJoMTh2LTJoLTJhMyAzIDAgMCAxLTEtMXYtMTZsLTEtNXYtM2E3IDcgMCAwIDAtMi0zbC0zLTFhMTIgMTIgMCAwIDAtOCAwbC02IDR2LTE4em0tMjU4IDJ2MWwyIDEgMSAxIDEgMnYzNGwtMSAxLTMgMXYyaDMzbDEtMTNoLTRsLTEgNi0zIDMtNCAxaC02di0zMmwxLTR2LTFsMS0xIDItMXYtMXptMTIwIDB2NDBoLTV2LTM5em0xMzkgMHY0MGgtNXYtMzl6bS0yNTEgM2g1djM3aC01em0xODQgMS0xIDQtMSAzYTUgNSAwIDAgMS0yIDJoLTN2Mmg1djE3bDEgNWE5IDkgMCAwIDAgMiAzIDkgOSAwIDAgMCAzIDNoNWw1LTFhMTkgMTkgMCAwIDAgNi0zbC0yLTItMiAxaC00YTMgMyAwIDAgMS0yLTF2LTIyaDl2LTNoLTl2LTh6bTMgMmgzdjI2bDEgNCAxIDNhNyA3IDAgMCAwIDMgMXYxYTExIDExIDAgMCAxLTIgMGwtNC0xYTYgNiAwIDAgMS0yLTJsLTEtMi0xLTV2LTE5bDItNnptLTE0MCA1LTkgMi01IDVjLTIgMy0zIDYtMyAxMCAwIDUgMiA5IDQgMTEgMyAzIDcgNCAxMyA0IDUgMCA5LTEgMTItNHM1LTcgNS0xMi0yLTktNS0xMmMtMi0zLTYtNC0xMi00em0zNyAwLTggMS01IDQtMSA1IDEgNSA2IDQgNCAzIDIgMSAxIDItMSAzLTQgMS00LTEtMi00aC0zdjdhNDkgNDkgMCAwIDAgNSAxaDZjNCAwIDggMCAxMC0yczMtNCAzLThsLTEtNS03LTUtNC0yLTItMXYtMmwxLTMgMy0xIDMgMSAxIDEgMiAzaDN2LTdhNTcgNTcgMCAwIDAtNS0xaC00em03NSAwLTkgMmMtMyAxLTUgMy02IDZsLTIgOGMwIDYgMSAxMCA0IDEyIDMgMyA3IDQgMTIgNGw4LTEgNy01LTItMy01IDRhMTAgMTAgMCAwIDEtNCAxYy01IDAtOC00LTgtMTJoMjBsLTEtNy0yLTUtNS0zLTctMXptNjUgMGMtNiAwLTEwIDItMTMgNC0zIDMtNSA3LTUgMTNsMiA4IDUgNWMyIDIgNSAyIDkgMmw3LTEgNi00LTItMy00IDMtNCAxYy0yIDAtNC0xLTUtM2wtMi05IDItMTBjMS0yIDItMyA1LTNsMyAxIDIgNWg0di03bC01LTJhMzYgMzYgMCAwIDAtNSAwem0tNjIgMmMzIDEgNSAyIDYgNCAyIDIgMiA1IDIgOGgtNGwtMS03LTMtNHptLTcgMS00IDQtMSA5YzAgOCAzIDEyIDkgMTRoLTFjLTQgMC03LTEtOS0zLTMtMy00LTYtNC0xMSAwLTQgMS03IDMtOSAxLTIgNC00IDctNHptNjQgMC0zIDQtMSA5YzAgNCAwIDcgMiA5IDEgMiAzIDQgNiA1LTUgMC04LTEtMTAtNC0yLTItMy01LTMtMTAgMC00IDAtNyAyLTlzNC00IDctNHptLTE3NiAwYy0xIDEtMyAyLTMgNWwtMSA4YzAgNyAxIDEyIDQgMTQtMy0xLTYtMi03LTUtMi0yLTItNS0yLTkgMC03IDMtMTIgOS0xM3ptMzYgMGMtMiAxLTIgMy0yIDV2MmwyIDIgNCAyIDUgMyAyIDMgMSAzLTEgNS01IDJ2LTFsMi0ydi0ybC0xLTQtNS00LTUtMi0yLTItMS00IDItNCA0LTJ6bS0yOCAwYzMgMCA1IDIgNyA0czIgNiAyIDEwbC0yIDhjLTIgMy00IDQtNyA1bDMtNSAxLTljMC02LTEtMTEtNC0xM3ptMjEzIDAgMyAxYTUgNSAwIDAgMSAyIDEgNyA3IDAgMCAxIDEgM3YyMWgtNXYtMjJhNSA1IDAgMCAwLTItMmwtMi0xIDMtMXptLTEwNSAwYzEgMCAyIDEgMiAzbDEgN2gtOGwxLTdjMS0yIDItMyA0LTN6bS0xMTIgMGMyIDAgMyAyIDQgNGwxIDEwLTEgOWMtMSAyLTIgMy00IDNzLTMtMS00LTNsLTEtMTAgMS0xMGMxLTIgMi0zIDQtM3ptNzYgOSAxMCAxN2gtNWwtOC0xNHoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMCAwaDEwODB2MTA4MEgweiIvPjxnIGNsaXAtcGF0aD0idXJsKCNjKSIgdHJhbnNmb3JtPSJtYXRyaXgoMS40OTE3MyAwIDAgMS40OTA4OSAtNDE0IDEpIj48ZyBmaWx0ZXI9InVybCgjZCkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1NiAxNzMpIj48cGF0aCBkPSJNNzIgOHY3MGwtNjIgNjMgNjIgNjN2OTNsLTM5IDQwdi01M0w5IDI2MCA4IDM3OWwxMTctMy0yNi0yNS01MCAxIDQyLTQzaDI4MnYtMjFIMTEzbDM3LTM4LTU3LTU2Vjg3bDY1LTY1LTE0LTE0LTUxIDUwVjh6bTAgMTAwdjY2bC0zMi0zM1ptMjEgMTE3IDI3IDI1LTI3IDI3WiIvPjwvZz48cGF0aCBmaWxsPSJ1cmwoI2UpIiBkPSJNMzY5IDI3MHYxMDJsLTg5IDkxIDg5IDkwdjEzNWwtNTcgNTggMS03Ni0zNS0zNS0yIDE3MSAxNzAtMy0zNy0zOC03MyAyIDYxLTYxaDQwN3YtMzFINDI5bDU0LTU1LTgzLTgxVjM4NGw5NC05NC0yMS0yMC03MyA3MnYtNzJ6bTAgMTQ0djk1bC00Ni00N3ptMzEgMTcwIDM5IDM1LTM5IDM5eiIgdHJhbnNmb3JtPSJtYXRyaXgoLjY3MDM2IDAgMCAuNjcwNzQgMjc4IC0xKSIvPjwvZz48L3N2Zz4=
// @grant        none
// @sandbox      JavaScript
// @license      WTFPL
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/520046/%E9%9A%8F%E6%9C%BA%E5%85%83%E7%B4%A0%E6%97%8B%E8%BD%AC%E5%99%A8%20-%20Random%20Element%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/520046/%E9%9A%8F%E6%9C%BA%E5%85%83%E7%B4%A0%E6%97%8B%E8%BD%AC%E5%99%A8%20-%20Random%20Element%20Rotator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 基础元素标签列表
    const basicElements = [
        'HTML', 'BODY', 'MAIN', 'SECTION', 'ARTICLE',
        'NAV', 'HEADER', 'FOOTER', 'ASIDE', 'SCRIPT', 'STYLE',
        'META', 'LINK', 'LI',
        'DIV'
    ];

    // 获取随机角度
    //function getRandomRotation(){return Math.floor(Math.random()*91)-45;}
    function getRandomRotation() {
        const min = -5;
        const max = 5;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 为所有非基础元素添加旋转效果
    function rotateElements() {
        console.log('Script is running...'); // 调试信息
        const allElements = document.querySelectorAll('*');
        let count = 0;

        allElements.forEach(element => {
            if (!basicElements.includes(element.tagName)) {
                const rotation = getRandomRotation();
                element.style.setProperty('transform', `rotate(${rotation}deg)`, 'important');
                element.style.setProperty('display', 'inline-block', 'important');
                element.style.setProperty('transition', 'transform 0.8s linear(0 0%, 0 1.8%, 0.01 3.6%, 0.03 6.35%, 0.07 9.1%, 0.13 11.4%, 0.19 13.4%, 0.27 15%, 0.34 16.1%, 0.54 18.35%, 0.66 20.6%, 0.72 22.4%, 0.77 24.6%, 0.81 27.3%, 0.85 30.4%, 0.88 35.1%, 0.92 40.6%, 0.94 47.2%, 0.96 55%, 0.98 64%, 0.99 74.4%, 1 86.4%, 1 100%)', 'important');
                // element.style.setProperty('transition', 'transform 0.6s ease', 'important'); // 添加平滑过渡
                element.style.setProperty('transform', `rotate(${rotation}deg)`, 'important');
                element.style.setProperty('display', 'inline-block', 'important'); // 确保旋转效果可见
                // element.style.setProperty('overflow', 'visible;');
                count++;
            }
        });

        console.log(`Applied rotation to ${count} elements`); // 调试信息
    }

    // rotateElements(); // 立即执行一次
    setTimeout(rotateElements, 5000); // 5秒后再执行一次，确保动态加载的内容也能被处理
})();