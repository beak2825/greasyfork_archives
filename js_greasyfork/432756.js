// ==UserScript==
// @name         改变网页代码块的字体样式
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  改变网页代码块的字体样式，LeetCode、CSDN、掘金、博客园的代码块字体全被设置为Cascadia Code这款字体，后面还有YaHei Consolas Hybrid和Lucida Console这两款字体做候选，最后由CSDN代码块的字体样式兜底
// @author       LiarCoder
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF7GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA5LTIxVDIwOjEwOjI4KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yMVQyMDoxMzo0NSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yMVQyMDoxMzo0NSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMzIwY2FlMi00ZWM2LTdiNDAtYjFiYi1mZjU3MzQxYzdhMjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YjNmNTA4MmEtMmUwYi03YzQwLTlmNTYtYjg3NDA3ZTU5OTA4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YjNmNTA4MmEtMmUwYi03YzQwLTlmNTYtYjg3NDA3ZTU5OTA4Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiM2Y1MDgyYS0yZTBiLTdjNDAtOWY1Ni1iODc0MDdlNTk5MDgiIHN0RXZ0OndoZW49IjIwMjEtMDktMjFUMjA6MTA6MjgrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjMyMGNhZTItNGVjNi03YjQwLWIxYmItZmY1NzM0MWM3YTI3IiBzdEV2dDp3aGVuPSIyMDIxLTA5LTIxVDIwOjEzOjQ1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YOpH+QAAAXFJREFUOMtj/P//PzMDA8M/IP7PQBpgBGImFpDmv3//Ms+ePbv84MGDpoyMjCIwFVJSUg+YmZn/PH78WAUmBlT7wdbW9kxmZmYLUO4vI9AFDJ8/fxaWlZV9w83NzaCrq3sdqA7kqr9XrlzR/P37N4OhoeENqI3/bty4ofHx40fGhw8fivLx8b1hgBogwMrK+n/evHkFID4Mx8bG7vH09LyGLLZp06YwLi6u/58+fRIG8UFeYALa/Gnfvn1OqqqqN5E9CXQu+79//1iQxWxsbPbt2rXLiYeH5wMsDIDeZvwPlNgPVQMPVCBghDodBpgFBQXfWFtbg9QygeRYkEKUmcjQR1HHxEAhGMYG/KfEgL8wBjBxfQcm11/Y5BBWATMTEma8fv26tr+//77g4OADCgoK/4H54X9oaOhBYIrcf/r0aQuQGmQ9LOgGAtM+y5s3b8SBtrM5OzvvBGWmO3fuqAOT7l+gHBtGloRmZwa8zsSTkAByYbm+1SH7+AAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432756/%E6%94%B9%E5%8F%98%E7%BD%91%E9%A1%B5%E4%BB%A3%E7%A0%81%E5%9D%97%E7%9A%84%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/432756/%E6%94%B9%E5%8F%98%E7%BD%91%E9%A1%B5%E4%BB%A3%E7%A0%81%E5%9D%97%E7%9A%84%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let codeBlockStyle = document.createElement('style');
  let CSDNCodeBlockOriginalFont = 'Source Code Pro,DejaVu Sans Mono,Ubuntu Mono,Anonymous Pro,Droid Sans Mono,Menlo,Monaco,Consolas,Inconsolata,Courier,monospace,PingFang SC,Microsoft YaHei,sans-serif';
  let CSDNCodeBlockSelector = 'span.token, .prism-atom-one-dark .prism *';
  let cnblogCodeBlockSelector = '.syntaxhighlighter a, .syntaxhighlighter div, .syntaxhighlighter code, .syntaxhighlighter table, .syntaxhighlighter table td, .syntaxhighlighter table tr, .syntaxhighlighter table tbody, .syntaxhighlighter table thead, .syntaxhighlighter table caption, .syntaxhighlighter textarea';
  let leetcodeDescriptionBlockSelector = '.notranslate, pre';
  // let greasyForkCodeBlockSelector = '#ace-editor div.ace_content, textarea';
  codeBlockStyle.innerText = `${CSDNCodeBlockSelector}, ${cnblogCodeBlockSelector}, ${leetcodeDescriptionBlockSelector}, textarea, blockquote, code{
    font-family: 'Cascadia Code', 'YaHei Consolas Hybrid', 'Lucida Console', ${CSDNCodeBlockOriginalFont} !important;
  }
  div.view-line>span>span.mtk3{
    font-family: 'YaHei Consolas Hybrid', ${CSDNCodeBlockOriginalFont} !important;
  }`;
  document.body.appendChild(codeBlockStyle);
})();