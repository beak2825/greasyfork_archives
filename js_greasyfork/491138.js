// ==UserScript==
// @name         SurePrintCsdn
// @namespace    http://surewong.com/SurePrint
// @version      0.3
// @description  try to print to pdf of CSDN!
// @author       SureWong
// @license      AGPL License
// @match        https://*.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491138/SurePrintCsdn.user.js
// @updateURL https://update.greasyfork.org/scripts/491138/SurePrintCsdn.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
(function() {
    'use strict';

    // Your code here...
    var surePrintBtn = document.createElement('button');
    surePrintBtn.innerHTML = "准备打印pdf";
    surePrintBtn.className = "sure-print-pdf";

    surePrintBtn.onclick = function (e) {
      document.querySelector("#side")?.remove();
      document.querySelector("#comment_title, #comment_list, #comment_bar, #comment_form, .announce, #ad_cen, #ad_bot")?.remove();
      document.querySelector(".nav_top_2011, #header, #navigator")?.remove();
      document.querySelector(".p4course_target, .comment-box, .recommend-box, #csdn-toolbar, #tool-box")?.remove();
      document.querySelector("aside")?.remove();
      document.querySelector("#toolbarBox")?.remove();
      document.querySelector(".tool-box")?.remove();
      document.querySelector(".more-toolbox-new")?.remove();
      document.querySelector(".csdn-side-toolbar")?.remove();
      document.querySelector(".more-toolbox")?.remove();
      document.querySelector(".template-box")?.remove();
      document.querySelector(".bottom-pub-footer")?.remove();
      document.querySelector(".pre-numbering")?.remove();
      document.querySelector("main").setAttribute('style', 'display: content;');
      document.querySelector("main").setAttribute('style', 'float: left;');

      // 打开代码折叠
      var elements = document.querySelectorAll('.set-code-hide');
      elements.forEach(function(element) {
      element.className = element.className.replace('set-code-hide', 'set-code-show');
      });

      var styleElements = document.getElementsByTagName("style");
      for(var i = 0; i < styleElements.length; i++) {
          if(styleElements[i].textContent.includes(".print_watermark") || styleElements[i].textContent.includes("@page")) {
              styleElements[i].parentNode.removeChild(styleElements[i]);
          }
      }


      // 新增代码：为打印增加@page属性
      var printStyle = document.createElement('style');
      var printStyleContent =`
    @media print {
        @page {
            margin-top:80px;
            margin-bottom: 80px;
            size: portrait; /* 纵向打印 */
        }
        .main_father > #mainBox {
            width: 100%;
            margin-left:200px;
            margin-right:200px;
            padding:0px;
        }
        .blog-content-box {
            width: 85%;
        }
        body, article {
            width: 80%;
        }
        
        
        /* 防止文字溢出打印区域 */
        p, h1, h2, h3, h4, h5, h6 {
          overflow-wrap: break-word;
          word-wrap: break-word;
          -ms-word-break: break-all;
          word-break: break-word;
        }
        h1, h2, h3 {
            page-break-after: avoid; /* 避免标题后直接分页 */
        }
        tr {
            page-break-inside: avoid; /* 确保表格行不会跨页打断 */
        }
     }`;
      printStyle.innerHTML = printStyleContent;
      document.head.appendChild(printStyle);

    };

    var body = document.body;
    var style = document.createElement('style');
    style.id = "sure-print-pdf";
    var css = `.sure-print-pdf{
      position: fixed;
      bottom: 5%;
      right: 1%;
      width: 70px;
      height: 70px;
      background: #add8e640;
      color: cornflowerblue;
      border-radius: 50%;
      font-size: 10px;
      z-index: 999;
      cursor: pointer;
      font-size: 10px;
      overflow: hidden;
    }`;
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    body.appendChild(surePrintBtn);
    body.appendChild(style);
})();