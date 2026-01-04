// ==UserScript==
// @name         机械工业下载器
// @namespace    https://qinlili.bid
// @version      0.1
// @description  劫持PDFJS下载
// @author       琴梨梨
// @match        https://dcd.cmanuf.com/ebook/web/index.html*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448793/%E6%9C%BA%E6%A2%B0%E5%B7%A5%E4%B8%9A%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/448793/%E6%9C%BA%E6%A2%B0%E5%B7%A5%E4%B8%9A%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dlFile = (link, name) => {
        let eleLink = document.createElement('a');
        eleLink.download = name;
        eleLink.style.display = 'none';
        eleLink.href = link;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    };
    let originConsole=console.log;
    originConsole("Launching...");
    //劫持Uptodown的谷歌play按钮
    (function (appendChild) {
        Node.prototype.appendChild = function (node) {
            if (node.src&&node.src.indexOf("pdf_viewer.min.js")>0 ){
                alert("Hook Success!");
                originConsole("Ready...");
                let originGet=pdfjsLib.getDocument;
                pdfjsLib.getDocument=doc=>{
                    originConsole(doc);
                    dlFile(URL.createObjectURL(new Blob([doc.data])),Date.now()+".pdf")
                    return originGet(doc);
                }
                return appendChild.call(this, node);
            } else {
                return appendChild.call(this, node);
            }
        };
    })(Node.prototype.appendChild);

})();