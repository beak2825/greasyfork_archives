// ==UserScript==
// @name         百度搜索-黑色主题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度搜索的黑色模式，为了护眼。
// @author       You
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480020/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2-%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/480020/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2-%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  $(window).bind('load', function () {
    cbc();
  })
  cbc();
})();

function asyncFunc(fn, timeout = 100) {
  setTimeout(fn, timeout);
}

function cbc() {
  $('body').css({
    'background-color': '#242424',
    'color': '#d8d8d8'
  })
  // 背景色显示为黑色
  asyncFunc(function () {
    $('a:not(.s-tab-item)').css({
      'color': '#8ab4f8',
    })
    $('#wrapper > :nth-child(1)').css({
      'background-image': 'none',
      'background-color': '#242424'
    })
    $('#su').css({
      'background-color': '#4e6ef2',
    })
  })
  $('#kw').css({
    'background-color': '#242424',
    'color': '#d8d8d8',
  })
  $('#head_wrapper #s_fm #form .bdsug').css({
    'background-color': '#242424'
  })
  $('#head_wrapper #s_fm #form .bdsug, #head_wrapper #s_fm #form .bdsug-new ul, #head_wrapper #s_fm #form .bdsug-new ul li').css({
    'background-color': '#242424'
  })

  $('#s_kw_wrap').bind('input', function (e) {
    asyncFunc(function () {
      $('#head_wrapper #s_fm #form .bdsug').css({
        'background-color': '#242424',
        'color': '#d8d8d8'
      })
      $('#head_wrapper #s_fm #form .bdsug-new ul').css({
        'background-color': '#242424',
        'color': '#d8d8d8'
      })
      $('#head_wrapper #s_fm #form .bdsug-new ul li').css({
        'background-color': '#242424',
        'color': '#d8d8d8'
      })
      $('#head_wrapper #s_fm #form .bdsug-new ul li b').css({
        'color': '#6a6a6a'
      })
    })
  })

  // 搜索列表页 搜索框
  $('#form span.bg').css({
    'background-color': '#242424',
    'overflow': 'hidden'
  })

  // 搜图图标
  $('#s_kw_wrap span.soutu-btn').css({
    'background-color': '#242424',
    'color': '#d8d8d8',
    'overflow': 'hidden'
  })
  $('#form span.soutu_btn').css({
    'background-color': '#242424',
    'color': '#d8d8d8',
    'overflow': 'hidden'
  })

  // 搜图图标
  $('#head > div.head_wrapper > div.s_form').css({
    'background-color': '#242424',
    'color': '#d8d8d8',
  })

  // 下面的tab
  $('#wrapper div#s_tab div.s_tab_inner b').css({
    'background-color': '#242424',
    'color': '#d8d8d8',
  })
  $('#wrapper div#s_tab div.s_tab_inner a').css({
    'background-color': '#242424',
    'color': '#949494',
  })
  $('#wrapper div#s_tab div.s_tab_inner a').bind('mouseover', function (){
    $(this).css({
      'background-color': '#242424',
      'color': '#8ab4f8',
    })
  })
  $('#wrapper div#s_tab div.s_tab_inner a').bind('mouseout', function (){
    $(this).css({
      'background-color': '#242424',
      'color': '#949494',
    })
  })
  $('#wrapper div#s_tab div.s_tab_inner b.cur-tab').css({
    'color': '#fbfbfb',
  })

  // 标签
  $('#searchTag').css({
    'background-color': '#242424',
    'color': '#d8d8d8',
  })
  $('#searchTag > div > div > a').css({
    'background-color': '#353535',
    'color': '#d8d8d8',
  })
  $('#searchTag > div > div > a.tag-selected_1iG7R').css({
    'background-color': '#4a4a4a',
    'color': '#8ab4f8',
  })

  // 搜索结果列表
  $('#content_left .c-container .content-right_8Zs40').css({
    'color': '#d8d8d8',
  })
  $('#content_left > .result > .c-container .c-title a').css({
    'color': '#8ab4f8',
    'text-decoration': 'none'
  })
  $('#content_left > .result > .c-container .c-title a').bind('mouseover', function () {
    $(this).css({
      'text-decoration': 'underline'
    })
  })
  $('#content_left > .result > .c-container .c-title a').bind('mouseout', function () {
    $(this).css({
      'text-decoration': 'none'
    })
  })
  $('#content_left .result-op .item_3WKCf').css({
    'background': 'none',
    'background-color': '#404040',
    'color': '#8ab4f8',
  })
  $('#container .result-molecule .rs-link_2DE3Q').css({
    'background': 'none',
    'background-color': '#404040',
    'color': '#8ab4f8',
  })
  $('.new-pmd .c-color-gray').css({
    'color': '#a7a7a7',
  })
  $('.op_dict3_title').css({
    'color': 'inherit',
  })
  $('.c-container').css({
    'color': 'inherit',
  })
  $('.op_dict3_inlineblock').css({
    'color': 'inherit',
  })
  $('.new-pmd .c-color-text').css({
    'color': 'inherit',
  })

  // 分页
  $('#page').css({
    'background': 'none',
    'background-color': '#343333',
    'color': '#8ab4f8',
  })
  $('#page .page-inner_2jZi2 a').css({
    'background': 'none',
    'background-color': '#626262',
    'color': '#d8d8d8',
  })

  // 页脚
  $('#foot').css({
    'background-color': '#242424',
    'color': '#d8d8d8',
  })

  // 右侧
  $('.opr-toplist1-link_2YUtD a').css({
    'color': '#8ab4f8',
  })
  $('.new-pmd .c-color-t').css({
    'color': '#8ab4f8',
  })
  $('.opr-toplist1-update_2WHdj .toplist-refresh-btn_lqkiP').css({
    'color': '#d8d8d8',
  })
}
