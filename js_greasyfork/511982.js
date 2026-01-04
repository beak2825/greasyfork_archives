// ==UserScript==
// @name         RMS Assistant
// @namespace    http://rms.ywx.xom/
// @version      0.1.3
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @description  RMS小助手
// @author       TAROMED
// @match        http://rms.ywx.com/*
// @match        http://localhost/*
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511982/RMS%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/511982/RMS%20Assistant.meta.js
// ==/UserScript==

/* global $ */
;(function () {
  'use strict'

  const toast = window._toast || console.log

  // 插入CSS样式
  const style = document.createElement('style')
  style.textContent = `#taro.draggable{width:50px;height:50px;position:fixed;color:#000;top:calc(100% - 50px);left:calc(100% - 50px);z-index:9999;}#taro.draggable .circle{width:100%;height:100%;border-radius:50%;background-color:lightblue;font-size:24px;cursor:move;user-select:none;display:flex;justify-content:center;align-items:center;transform:translate(-50%,-50%);position:relative;z-index:1;}#taro ul{margin:0;padding:0;position:absolute;top:0;left:0;font-size:12px;transition:.3s all;transform:translate(0%,0%);margin-left:30px;}#taro ul li{width:100px;list-style:none;background-color:lightblue;margin-bottom:2px;padding:4px 4px;transition:.3s all;white-space:nowrap;overflow:hidden;text-align:left;}#taro ul li.hover,#taro ul li:hover{background-color:lightcyan;cursor:pointer;}#taro.deactivate{opacity:0.5;}#taro.dragging ul li,#taro.deactivate ul li{width:0px;opacity:0;transition-delay:.1s;}#taro.q-tl ul{transform:translate(0%,0%);margin-left:30px;}#taro.q-tr ul{transform:translate(-100%,0%);margin-left:-30px;}#taro.q-bl ul{transform:translate(0%,-100%);margin-left:30px;}#taro.q-br ul{transform:translate(-100%,-100%);margin-left:-30px;}#taro.q-l ul{transform:translate(0%,-50%);margin-left:30px;}#taro.q-r ul{transform:translate(-100%,-50%);margin-left:-30px;}#taro.q-t ul{transform:translate(-50%,0%);margin-top:30px;margin-left:0px;}#taro.q-b ul{transform:translate(-50%,-100%);margin-top:-30px;margin-left:0px;}`
  document.head.appendChild(style)

  //- ----------------插入HTML模板------------------
  const template = `
    <div id="taro" class="draggable deactivate q-br" tabindex="0">
      <div class="circle">+</div>
      <ul>
        <li class="menu-item" data-action="fillBarcode" data-match=".*">扫描条码</li>
        <li class="menu-item" data-action="goTop" data-match=".*">Go Top</li>
        <li class="menu-item" data-action="goBottom" data-match=".*">Go Bottom</li>
      </ul>
    </div>
  `;
  $('body').append(template);

  // 压缩js脚本
  const $draggable=$("#taro.draggable");let offsetX=0,offsetY=0,isDragging=!1,timerId=null;function startDragging(t){isDragging=!0;const e=t.clientX||t.touches[0].clientX,a=t.clientY||t.touches[0].clientY;offsetX=e-$draggable.offset().left,offsetY=a-$draggable.offset().top,$draggable.removeClass("deactivate"),$draggable.addClass("dragging")}function stopDragging(){if(isDragging){isDragging=!1;const t=$draggable.find(".circle")[0].getBoundingClientRect(),e=$(window).width(),a=$(window).height();$draggable.removeClass(function(t,e){return(e.match(/(^|\s)q-\S+/g)||[]).join(" ")}),t.left<0?$draggable.css({left:"0px"}).addClass("deactivate"):t.right>e?$draggable.css({left:`${e}px`}).addClass("deactivate"):t.top<0?$draggable.css({top:"0px"}).addClass("deactivate"):t.bottom>a&&$draggable.css({top:`${a}px`}).addClass("deactivate");let o="";t.left<e/4?o="q-l":t.left>3*e/4?o="q-r":t.top<a/4?o="q-t":t.top>3*a/4&&(o="q-b"),t.left<e/4&&t.top<a/4?o="q-tl":t.left>3*e/4&&t.top<a/4?o="q-tr":t.left<e/4&&t.top>3*a/4?o="q-bl":t.left>3*e/4&&t.top>3*a/4&&(o="q-br"),$draggable.addClass(o),$draggable.removeClass("dragging"),clearTimeout(timerId),timerId=setTimeout(function(){$draggable.addClass("deactivate")},5e3)}}function handleMove(t){if(isDragging){const e=t.clientX||t.touches[0].clientX,a=t.clientY||t.touches[0].clientY;$draggable.css({left:`${e-offsetX}px`,top:`${a-offsetY}px`})}}$draggable.on("mousedown touchstart",function(t){t.preventDefault(),startDragging(t)}),$(document).on("mousemove touchmove",function(t){handleMove(t)}),$(document).on("mouseup touchend",function(){stopDragging()}),$draggable.on("blur",function(){$draggable.addClass("deactivate")}),$(".menu-item").on("click touchstart",function(){const t=$(this).data("action");"function"==typeof window[t]&&window[t]()}),$(".menu-item").on("touchstart",function(){$(this).addClass("hover")}),$(".menu-item").on("touchend",function(){$(this).removeClass("hover")});function fun(){$(".menu-item").each(function(){const t=$(this).data("match");$(this).show(),new RegExp(t).test(location.href)||$(this).hide()})}(function(history){const pushState=history.pushState;const replaceState=history.replaceState;history.pushState=function(state,title,url){const result=pushState.apply(history,arguments);const event=new Event("statechange");window.dispatchEvent(event);return result};history.replaceState=function(state,title,url){const result=replaceState.apply(history,arguments);const event=new Event("statechange");window.dispatchEvent(event);return result}})(window.history);window.addEventListener("statechange",function(event){fun()});window.addEventListener("popstate",function(event){fun()});


  //- -----------定义点击事件处理函数--------------
  window.fillBarcode = function() {
    var res = prompt("请输入条码:");
    unsafeWindow.barcode(res);
  };

  window.goTop = function() {
    const page = document.querySelector('#app > [class^=page]:not(.page-wrapper)') || document.getElementById('app')
    page.scroll({
      behavior: 'smooth',
      top: 0
    })
  };

  window.goBottom = function() {
    const page = document.querySelector('#app > [class^=page]:not(.page-wrapper)') || document.getElementById('app')
    page.scroll({
      behavior: 'smooth',
      top: page.scrollHeight
    })
  };
})()
