// ==UserScript==
// @name        tower工作区全屏切换
// @namespace   Violentmonkey Scripts
// @match       https://tower.im/teams/*
// @match       https://tower.im/projects/*
// @grant       none
// @version     1.0
// @author      -
// @description 2020/12/2 下午10:38:33
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://cdn.bootcss.com/async/3.1.0/async.min.js
// @require      https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js
// @require      https://cdn.bootcss.com/lockr/0.8.5/lockr.min.js
// @downloadURL https://update.greasyfork.org/scripts/417634/tower%E5%B7%A5%E4%BD%9C%E5%8C%BA%E5%85%A8%E5%B1%8F%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/417634/tower%E5%B7%A5%E4%BD%9C%E5%8C%BA%E5%85%A8%E5%B1%8F%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==
const styles = `
  .full .todolists
  ,.full tr-project-list-view 
  {
      position:fixed;
      z-index:500;
      top:0;
      left:0;
      height:100%;
      width:100%;
      padding:0 !important;
      background:#f0f0f0;
  }

  .full-screen-toggler{
      position:fixed;
      z-index:5147483001;
      bottom:0;
      right:0;
      background:#f50;
      padding:6px 12px;
      color:#fff;
      cursor:default;
  }

`

$(__=>{
  
  $("header").append(`<style>${styles}</style>`);
  
  $("<a class='full-screen-toggler'>全屏切换</a>").appendTo("body").click(__=>{
      $("body").toggleClass("full");
  }).trigger("click")
})