// ==UserScript==
// @name         visual-paradigm导出去水印(☆svg☆|png|jpg)
// @namespace    visual-paradigm.taozhiyu.github.io
// @version      0.1
// @description  online.visual-paradigm.com/app/diagrams 去水印
// @author       涛之雨
// @match        *://online.visual-paradigm.com/*
// @icon         https://online.visual-paradigm.com/favicon-32x32.png
// @grant        none
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/453315/visual-paradigm%E5%AF%BC%E5%87%BA%E5%8E%BB%E6%B0%B4%E5%8D%B0%28%E2%98%86svg%E2%98%86%7Cpng%7Cjpg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453315/visual-paradigm%E5%AF%BC%E5%87%BA%E5%8E%BB%E6%B0%B4%E5%8D%B0%28%E2%98%86svg%E2%98%86%7Cpng%7Cjpg%29.meta.js
// ==/UserScript==

/* global Graph*/
(function() {
    'use strict';
    if(!location.pathname.endsWith("app/diagrams/"))return;
    Object.keys(Graph.prototype).filter(
        t=>"function"==typeof Graph.prototype[t]&&
        Graph.prototype[t].toString().includes("mxSvgCanvas2D")
    ).map(t=>{
        Graph.prototype[t+"_"]=Graph.prototype[t+"_"]||Graph.prototype[t];
        Graph.prototype[t]=function(...p){
            16===p.length&&(p[p.length-2]=!0);
            return this[t+"_"](...p);
        };
    });
})();