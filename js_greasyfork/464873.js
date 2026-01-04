// ==UserScript==
// @name         超星学习通自动跳转到新版页面
// @namespace    KVS:b878ef45-b8b8-75c0-7fa7-62440bdaacad
// @version      0.1
// @description  此脚本可以在你从课程列表进入课程主页时自动跳转到新版页面。
// @author       Vsp72
// @match        https://mooc1.chaoxing.com/mycourse/studentcourse?*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuYjBmOGJlOSwgMjAyMS8xMi8wOC0xOToxMToyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjIgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wNC0yNlQxMToyODowNiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDQtMjZUMTE6Mzc6MTgrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDQtMjZUMTE6Mzc6MTgrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc2NDk2Y2YxLTc0MGEtYjI0Yy04ZTYxLTQxMTRjYzk1OWYwMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3NjQ5NmNmMS03NDBhLWIyNGMtOGU2MS00MTE0Y2M5NTlmMDEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NjQ5NmNmMS03NDBhLWIyNGMtOGU2MS00MTE0Y2M5NTlmMDEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjc2NDk2Y2YxLTc0MGEtYjI0Yy04ZTYxLTQxMTRjYzk1OWYwMSIgc3RFdnQ6d2hlbj0iMjAyMy0wNC0yNlQxMToyODowNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjIgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pm0aWaMAAAHtSURBVDgRBcE9qxZkAAbg637e9xxNixDMgxEtBQqF0RBU0JaNQgQhRVtBLfYPWorAH9DQkFsEIdRgHRoaCoI+aAihMLHBSjAT0jSPnvM+d9eVawffEREMaUQQMQREEUPAkAAsC9oiomoIamKICqgiSiFkTFXAVFBVVE0F4NhhMBUUS7SKoCaCoRgoG3dzzy6Ld49a/XyFf+/o5RsiXU4VDBAUMbE4sMfa289ZPPsQxZ41i81XrE58ppvnwagqiqmKqvHUg9bff97q+99tn/xa/7nFqubnv5qb5xXFsqAmgom1I/dbf+0Jt09+Zdy31/qJp63OnOOvmxbHDmtKg1pOFQwQ2bfb3g+P++/V03rpuvU3nrT1+qeyPe069YI7L39MCYoBxVRVd735jFvvfWP7u4uWLx6x+vEPqwtXLV56zM5HP5mXb6iaqmpUAYxD+y0e3XDrgx/kgXuNwwfcOX2WfbuNQ/ttn/nFVEUVjKKq2H38cVufnNXtHcujD1udv2J16ZrxyIb5903z8g1VUxXFsoqgdn676vYX51Rtf3uRrR1Tra5vyZcXVBFB1UT+PPhWIyCIgGCIiGCIiCAiiFhOzaBAUBHFVAPEVAMEVQwyYKqiqqiCYqqqYqqpCiiWgFSRUgQVAVMFQ1CTDEH9D+lKCJQx2yuwAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464873/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%96%B0%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/464873/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%96%B0%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
  'use strict';
    // 获取“体验新版”元素的 DOM 对象
    let el = document.querySelector('li a.experience');
    // 获取新版页面的 URL
    let url = el.getAttribute('href');
    // 跳转到新版页面
    window.navigation.navigate(url);
})();
