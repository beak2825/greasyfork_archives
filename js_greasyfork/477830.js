// ==UserScript==
// @name        百度文库打印PDF
// @namespace   Violentmonkey Scripts
// @include     http://wenku.baidu.com/*
// @include     https://wenku.baidu.com/*
// @match       https://wenku.baidu.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 百度文库打印PDF文件
// @license     无
// @downloadURL https://update.greasyfork.org/scripts/477830/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%89%93%E5%8D%B0PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/477830/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%89%93%E5%8D%B0PDF.meta.js
// ==/UserScript==

//添加打印样式
var css = `<style>
html{
  height: auto;
  overflow:auto
}
/* body *{
  page-break-inside: avoid;
} */
@media print {
body{
  min-width: auto;
  text-align: center;
  display: contents;
}
.pageNo{
/*   page-break-after: always !important; */
}
/* 隐藏其他不需要打印的元素 */  
.hx-warp,.header-wrapper,.reader-topbar,.sidebar-wrapper,.tool-bar-wrapper,.try-end-fold-page,.vip-member-pop-content,.copyright-wrap,.new-header,.is-top,
  .menubar,.user-guide,.top-bar-right,.edit-history-banner,.tool-bar-wrap,.catalog-wrap,.no-full-screen{  
    display: none !important;  
}
#right-wrapper-id,#page-footer,#footer-wrapper-id,#app-reader-editor-below,#app-right{
  display:none !important;
}
/* 修改内容样式 */
.content-wrapper{
  width:100% !important;
}
#reader-container{
  margin-top:0;  
}
.left-wrapper{
  margin: 0 !important;
  padding: 0 !important;
}
    .btn-print{
    display:none;
  }
/* 页面设置 */
@page {
  size: A4 portrait;
  margin: 0mm 0mm 0mm 0mm;
  padding:0mm 0mm 0mm 0mm;
}
}
  
  .btn-print{
    cursor: pointer;
    padding: 0 10px;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    user-select: none;
    font-size: 14px;
    border-radius: 4px;
    color: #ffffff;
    background-color: #ff8a00;
    height: 36px;
    line-height: 36px;
    position: fixed;
    right: 100px;
    top: 33%;
    z-index:9999999999;
  }
</style>`;
$("body").append(css);


//滚动显示所有内容
$(window).scroll(function(){
  if($(".creader-root").length>0){
		$(".creader-root").find("canvas").each(function(index, ele){
      if($(ele).attr("width")>0){
        // console.log($(ele).attr("id"));
        $(ele).css({"width":"945px","height": "1336.45px"});
        $(ele).attr("id", "");
      }
		});
  }
});

// 添加打印按钮
let btnBox = `<div class="btn-print">🚦立即处理并打印</div>`;
$("body").append(btnBox);
$('.btn-print').click(function(){
  window.print();
});