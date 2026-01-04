// ==UserScript==
// @name         SJTU Teaching Evaluation 上海交通大学研究生网上评教
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description 上海交通大学研究生网上评教脚本
// @author       You
// @match        *://yjs.sjtu.edu.cn/gsapp/sys/wspjapp/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438304/SJTU%20Teaching%20Evaluation%20%E4%B8%8A%E6%B5%B7%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E7%BD%91%E4%B8%8A%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/438304/SJTU%20Teaching%20Evaluation%20%E4%B8%8A%E6%B5%B7%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E7%BD%91%E4%B8%8A%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var run = function (elements) {
       var myFunction = function() {
           //var attribute = this.getAttribute("data-myattribute");
           //alert(attribute);
           console.log("running", this.getAttribute("title"));

           var submit_func = function(papers) {
               for (let i = 0; i < papers.length; i++) {
                   var paper = papers[i].getElementsByClassName("paper_dx")[0];
                   if (typeof paper !== 'undefined') {
                       paper.click();
                   }
               }
               document.querySelectorAll("[data-action=提交]")[0].click();
               Array.from(document.querySelectorAll("a.bh-dialog-btn")).find(el => el.textContent === '确定').click();

               setTimeout(() => {
                   var elements = document.getElementsByClassName("sc-panel-diagonalStrips-text");
                   for (let i = 0; i < elements.length; i++) {
                       elements[i].addEventListener('click', myFunction);
                   }
               }, 1000);
           }

           setTimeout(() => {
               var papers = document.getElementsByClassName("paper_tm");
               if (papers.length === 0) {
                   setTimeout(() => {
                       var papers = document.getElementsByClassName("paper_tm");
                       if (papers.length === 0) {
                           alert("Load too slow!!!");
                       }
                       else {
                           submit_func(papers);
                       }

                   }, 1000);
               }
               else {
                   submit_func(papers);
               }
           }, 1000);
       };

       for (let i = 0; i < elements.length; i++) {
           elements[i].addEventListener('click', myFunction);
       }
   };

setTimeout(() => {
    console.log("Autocomplete mode start");

    var elements = document.getElementsByClassName("sc-panel-diagonalStrips-text");

    if (elements.length === 0) {
        setTimeout(() => {
            var elements = document.getElementsByClassName("sc-panel-diagonalStrips-text");

            if (elements.length === 0) {
                alert("Load too slow!!!");
            }
            else {
                console.log("Second time detected " + elements.length);
                run(elements);
            }
        }, 3000);
    }
    else {
        console.log("First time detected " + elements.length);
        run(elements);
    }
}, 1000);

})();