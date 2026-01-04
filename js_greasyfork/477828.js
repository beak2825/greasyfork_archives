// ==UserScript==
// @name        菁优网打印PDF
// @namespace   Violentmonkey Scripts
// @include     *://www.jyeoo.com/*
// @match       *://www.jyeoo.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 菁优网试卷打印PDF格式
// @license     无
// @downloadURL https://update.greasyfork.org/scripts/477828/%E8%8F%81%E4%BC%98%E7%BD%91%E6%89%93%E5%8D%B0PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/477828/%E8%8F%81%E4%BC%98%E7%BD%91%E6%89%93%E5%8D%B0PDF.meta.js
// ==/UserScript==

//添加打印样式
var css = `<style>
/* html{
  height: auto;
  overflow:auto
} */
/* body *{
  page-break-inside: avoid;
} */
@media print {
  /* body{
    min-width: auto;
    text-align: center;
    display: contents;
  } */
  .pageNo{
  /*   page-break-after: always !important; */
  }
  /* 隐藏其他不需要打印的元素 */  
  .top,.header,.return-top,.fixed-bottom,.foot,.nav-menu,.fieldtip,.fright,.h2-txt{  
      display: none !important;  
  }
  #divMsg,#divBread{
    display:none !important;
  }
  /* 修改内容样式 */
  .wrapper {
      width: max-content;
      display: block;
  }
  .list-box li {
    margin-bottom: 0;
    border:0;
  }
  .list-box li {
    page-break-inside: avoid !important;;
  }
  .pt1{
    padding: 0px 0px 15px 20px;
  }
  .pt1 + .pt2{
    margin-top:-20px;
  }
  .btn-print{
    display:none;
  }
  /* 页面设置 */
  @page {
    size: A4 portrait;
    margin: 20mm 0mm 20mm 0mm;
    /* 页码 */
    @top-right {
      content: counter(page);
      font-size: 12pt;
      color: #666666;
    }
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
// 添加打印按钮
let btnBox = `<div class="btn-print">🚦立即处理并打印</div>`;
$("body").append(btnBox);
$('.btn-print').click(function(){
  window.print();
});