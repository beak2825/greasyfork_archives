// ==UserScript==
// @name         QuickWaddle
// @namespace    https://cocotais.cn/
// @version      0.2
// @description  在CoCo中添加Waddle相关功能
// @author       小鱼yuzifu & Cocotais
// @match        *://coco.codemao.cn/editor/*
// @icon         https://static.codemao.cn/coco/player/unstable/Syysxk49p.image/png?hash=FjxRSuma3-zmaTIij5IW_rnZqV4L
// @require      https://cdn.staticfile.org/layui/2.9.7/layui.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @license      GPLv3

// @downloadURL https://update.greasyfork.org/scripts/474095/QuickWaddle.user.js
// @updateURL https://update.greasyfork.org/scripts/474095/QuickWaddle.meta.js
// ==/UserScript==

(function () {
  "use strict";
  $("head").append(`
  <link href="https://cdn.staticfile.org/layui/2.9.7/css/layui.css" rel="stylesheet">
  <style>
  .layui-layer {
    border-radius: 10px;
  }
  </style>
  `);
  let loading = setInterval(() => {
    if (!document.querySelector(".open-waddle")) {
      let openWaddle = false;
      let index;
      /*let waddleImport = document.createElement("div");
        waddleImport.className = "coco-menu-item waddle-import";
        waddleImport.innerHTML = '<div class="Header_itemContent__1PHwD">从Waddle导入</div>';
        insertAfter(waddleImport, document.querySelector(".coco-menu-item:has(.coco-upload-button.Header_itemUploadButton__12gPJ)"));*/
      $(".style_users__1_LCz").after(`<button class="open-waddle coco-button coco-button-circle Header_packageBtn__uKJgR" style="width:90px">Waddle</button>`);
      $("button.open-waddle").on("click", function () {
        if (!openWaddle) {
          index = layer.open({
            type: 2,
            title: "Waddle",
            maxmin: true,
            area: ["900px", "600px"],
            content: "https://waddle.cocotais.cn/",
            shade: 0,
            closeBtn: 1,
            end: function () {
              openWaddle = false;
            },
          });
          openWaddle = true;
        } else {
          layer.close(index);
          openWaddle = false;
        }
      });
      document.clearInterval(loading);
    }
  }, 100);
})();
