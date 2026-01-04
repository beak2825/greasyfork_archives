// ==UserScript==
// @name         图片管理&添加背景
// @myBlog       wangyongjie.top
// @namespace    undefined
// @version      8.0.0
// @description  图片管理添加背景插件
// @author       图片管理添加背景
// @match        *://cxcms.ds.gome.com.cn/gome-cms-web/gomeCmsImgInfo/list.do
// @match        *://cms.gome.inc/gomeCmsImgInfo/list.do
// @match        http://cxcms.ds.gome.com.cn/gome-cms-web/gomeCmsImgInfo/list.do
// @match        http://cms.gome.inc/gomeCmsImgInfo/list.do
// @match        http://cms.gome.inc/gomeCmsImgInfo/list.do?token=57c20979-d07f-4656-aa47-f69e7ab09f3d
// @match        *://erm.ds.gome.com.cn/main.action
// @match        http://erm.ds.gome.com.cn/main.action
// @match        http://cms.ds.gome.com.cn/gome-mobile-web/gomeCmsImgInfo/imgService.do
// @match        http://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/pageinfo_edit.do
// @match        http://cncms.ds.gome.com.cn/gomeCmsImgInfo/list.do
// @match        *
// @match        图片管理添加背景
// @downloadURL https://update.greasyfork.org/scripts/412123/%E5%9B%BE%E7%89%87%E7%AE%A1%E7%90%86%E6%B7%BB%E5%8A%A0%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/412123/%E5%9B%BE%E7%89%87%E7%AE%A1%E7%90%86%E6%B7%BB%E5%8A%A0%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==
$(document).ready(function () {
    function colorRandom() {
        var a, b, c;
        var a = parseInt(255 - Math.random() * 255).toString(16);
        var b = parseInt(255 - Math.random() * 255).toString(16);
        var c = parseInt(255 - Math.random() * 255).toString(16);
        colorStr = '#' + a + b + c;
    } colorRandom();

    $(".img_slide,.single_item").css({
        background: colorStr
    })
    console.log("变色成功")


// setTimeout(function () {
      var popImage = `
  <div>
  <style>
    #remotePicModal {
      width: 1500px !important;
      height: 1000px !important;
      top: 65% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      margin-left: 0 !important;
      margin-top: 0 !important;
    }

    .collapse.in {
      width: 97% !important;
    }

    .single_item {
      width: 700px !important;
      height: 200px !important;
    }
  </style>
</div>
  `;
      $("body").append(popImage)
    // }, 0)
  
  
  })