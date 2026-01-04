// ==UserScript==
// @name         cpppcPDF下载
// @namespace    cpppcPDFDownloader.taozhiyu.gitee.io
// @version      0.1
// @description  cpppc网站pdf文件下载
// @author       涛之雨
// @match        https://www.cpppc.org:8082/inforpublic/homepage.html*
// @match        https://www.cpppc.org:8082/inforpublic/pdfJs/web/viewer.html*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABYRJREFUeF7tm2eIJEUUgL8TjCgmzAFEBfFMKOasKOaMARHMnhEDpgNRwSwIIiqKnnrmdGdCETPGE3NCzAkF8w9FVAT5zqqlrq9np3p2unvcnQdD381WeO+r6qpX79VMYoLLpAluP0MAwxnQLoHlgC2B1YBVk+fSwI/AT+F5G/AE8FW/1W3rFdDwY4CjgOUrGPUwcD3wSIU6oxZtGkAnw78FvgN8fgP8AiwDLAusA6xUsKJvIJoEsBFwC7BGYsx04Grg1S4jujGwc8mMuQw4cyyzoSkA2wO3As4AZWYw/KmKyscZNBWYN9R9FNi1YjsjxZsAsA9wO7BA6PVs4JJeFQ71dgFuSIDanu1WlroBuLo/A6wYNDseuKaylp0rPA9sEf58OHBT1bb7AcBp6edd4O+CAvcB+4bvDgHczvotXwIrh0Y3B16q0kGvADTGabhh2L/t80/gdcB38kLgdMBFSjkHuKCKYhXKbhNmmVVmJMCzmqgKwPf4CuDYrNb/K/Qx4Cru1laXXAccHRo/GLgjt6MqANYE3k8afhN4DXgLcBquC6xfMgInA1fmKtRjuQ2CLlZ/Bdg0t50qAHRDo0OiN3Ya8FtJR74elwdH5g3A/f+fXIXGUO4u4IBQX+9Sx6qr5AK4CjghtDYNOKJLy3pvWwFPAx901aI/BY4LvoWt7Qfcn9NsDoBFgE+BpYBZwCY5DbdQRv2+D/1me4g5APYOq6ttbwa83IJxuV260C5WZTfIAaCv7vT6C3A2+BxU+QhYHXgnLMpd9RwNwOJhP49bniu++/4gy4thlv4BLJSjaCcAJwJnFc7qrvye4QdZdLt1jBR19ZTpNt1RygCcB5yb1LABt5hLB9nyoFsKIKqrd+qZ4SLgh6INRQCp8To9/l9//v8i6rs1oGPkepXKJyGe8Gz6ZQog3Uc1fv8G9/A6AK8X1izDbunaNceJNAJwD3V7MzA5HowvAr07DGj8fuTUGAFcHBY9CxwG3FzHkLTc5h7Ag0EHXfjZr4gAPMB4hp4feBLYoWVF6+xed163XnHQpwrgoOT4KCUjruNZ7g1nBW3cUQBp4MLIytfj2frgKOkwKacKILq6PwNLNmy8r948wIHAFw31bTRZWxcGpgngMWCnFk56aShrW2CO/blmGNFlniWAGLg0I1PMwNSpR5sADOudAvwugDTY0eQa0CYAEzN76fMIYApwbRjqPYGH6hz2pO02AcTw3o0CMGkRV/7zg//fBIO2AKwd4gXaeGT0BB313YPV5tmM7dctbQEwjRYTqpMjgN0SB8j4nymtuqUNAB6KYibaXMKU9DT4AOAaoDTxKrQBwBsnSwC/Aqv4TAGY39MZmS9AMIhwKPBZTVOhSQCm5+8MkW3N2S6m04oBEY+JLxQMPik4SwYU+ilNAFgrpPGMdURxphvpni1lITFTYPcAkwvWulO8l3GbI63meuLFiDLJAbBgOJ57aaqKeMI1KlS8f3RGyFqNtNUpKOr9HFNcfszyjEU6xRdyANj322PpPNT1BKjxc503cvIC7hBukRJ1nahyq8vokvXLDjo5AFYAHi+Zjd2Y+Br7MTdpErfj65sDoFtnvf49B0CvbWfXGwLIRtX/gsMZkFxtaToe0HUX6P94z93ihJkB3vD0apy3RM3cRBkNQMxQ6bDouNQmTSyCabotPWN0ApCWN0zm61GbNAGg6FlGCGUAUuM/DOHr9GJW30E0AUClyyA4umZzFUdZIDEr/XkwXkemVmkKQCcI0WBnRfy3V+a9Xep1t9qlSQBlEIoGel7X+Odqtzx00DSA0SCYsPRmuT+NaUzaAFAGwUvWGt+3n8LkEmwLQITgL0YWDUFKLzo3Lm0CaNzYsg6HAAZiGFpUYjgDWoQ/EF1P+BnwL/lAF1yGg7IJAAAAAElFTkSuQmCC
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445171/cpppcPDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/445171/cpppcPDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("下载",function(){
        (function(){var i=window.PDFViewerApplication||frames[0].PDFViewerApplication;void 0===window["0_0"]&&(i.contentDispositionFilename=new TextDecoder("gbk").decode(new Uint8Array(i.contentDispositionFilename.split("").map(function(i){return i.codePointAt();})).buffer),window["0_0"]="");i.download();})();
    });
})();