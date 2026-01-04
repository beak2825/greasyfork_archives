// ==UserScript==
// @name         页面拼接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  拼接大部分网页
// @author       You
// @run-at       document-end
// @author       You
// @include      *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496968/%E9%A1%B5%E9%9D%A2%E6%8B%BC%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/496968/%E9%A1%B5%E9%9D%A2%E6%8B%BC%E6%8E%A5.meta.js
// ==/UserScript==
var lastPageHeight = 0;
(function() {
  'use strict';
  if ( window !== window.top ) return;

  // 加载设置
  var __pageJoiningOption = {
    loading:false,
    text:/^\s*(next\s*page|下一[页章节篇])\s*(\>{0,2}|\→?|\》?)\s*$/i,
    elem:'a',
    // selector:'',
  }
  var wheel = {
    timer:null,
    delay:300,
    thresold:500
  }

  var top = window.frames[0] || window;
  var html = top.document.documentElement;
  var lastFrameWrapper = top.document;
  var loadingWrapper = (function(e) {
    var div = document.createElement('div');
    div.setAttribute('style', 'position:fixed; right:42px; bottom:11px; padding:5px 12px; font-size:10px; line-height:1; color:#fff; background:#4cade7; border-radius:4px; opacity:0; transition-duration:300ms;');
    div.textContent = '加载中~';
    return div;
  })();
  top.document.body.appendChild(loadingWrapper);

  // 优先获取页面配置, 其次默认配置
  setTimeout(()=>{
    __pageJoiningOption = window.__pageJoiningOption || __pageJoiningOption;
    top.addEventListener('scroll', windowScroll);
  }, 200);

  // 滚动事件
  var scrollY = 0;
  function windowScroll(e) {
    clearTimeout(wheel.timer);
    if ( e.delta < 0 ) return;
    scrollY = html.scrollTop;
    wheel.timer = setTimeout(()=>{
      if ( html.clientHeight + scrollY + wheel.thresold>=lastPageHeight + (html.scrollHeight - lastPageHeight) * 0.2 ) joinPage();
    }, wheel.delay)
  };


  function joinPage() {lastPageHeight = html.scrollHeight;
    if ( __pageJoiningOption.loading ) return;
    __pageJoiningOption.loading = true;
    loadingWrapper.style.opacity = 1;

    var linkAddress = '';
    if ( __pageJoiningOption.selector ) {
      linkAddress = lastFrameWrapper.querySelector(__pageJoiningOption.selector).getAttribute('href')
    }
    else if ( __pageJoiningOption.text ) {
      var links = lastFrameWrapper.querySelectorAll(`${__pageJoiningOption.elem||'a'}`), link;
      for (var i=links.length-1; i!==0; i--) {
        link = links[i];
        if ( !link.getAttribute('href') ) continue;
        if ( !__pageJoiningOption.text.test(link.textContent) ) continue;
        linkAddress = link.getAttribute('href');
        break;
      };
    }

    if ( !linkAddress ) {
      __pageJoiningOption.loading = false;
      loadingWrapper.style.opacity = 0;
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.setAttribute('style', `position:fixed; width:0; height:0; overflow:hidden; opacity:0;`);
    iframe.src = linkAddress;
    top.document.body.appendChild(iframe);

    iframe.onload = function() {
      var w = getLastWindow();
      var wd = w.document;
      var td = top.document;
      var wrapper = td.createElement('div');
      wrapper.id = top.document.body.id + ' iframe-wrapper'
      wrapper.className = td.body.className;
      wrapper.innerHTML = wd.body.innerHTML;
      lastFrameWrapper = wrapper;
      iframe.onload = null;
      td.body.removeChild(iframe);
      td.body.appendChild(wrapper);
      html.scrollTo(html.scrollLeft, scrollY);

      setTimeout(()=>{
        loadingWrapper.style.opacity = 0;
        __pageJoiningOption.loading = false;
      },10);

    }
  }

  function getLastWindow() {
    var frames = top.frames;
    return frames[frames.length-1] || top
  }

  window.getLastWindow = getLastWindow;
})();