// ==UserScript==
// @name         贴吧助手-去水印无痕大师
// @version      1.0
// @author       去水印无痕大师
// @license      MIT
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @description  精简美化页面，去除广告内容，在主页帖子列表可以自定义屏蔽用户的帖子
// @match        https://tieba.baidu.com/*
// @match        http://tieba.baidu.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/857540
// @downloadURL https://update.greasyfork.org/scripts/482738/%E8%B4%B4%E5%90%A7%E5%8A%A9%E6%89%8B-%E5%8E%BB%E6%B0%B4%E5%8D%B0%E6%97%A0%E7%97%95%E5%A4%A7%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/482738/%E8%B4%B4%E5%90%A7%E5%8A%A9%E6%89%8B-%E5%8E%BB%E6%B0%B4%E5%8D%B0%E6%97%A0%E7%97%95%E5%A4%A7%E5%B8%88.meta.js
// ==/UserScript==

// 微信公众号：去水印无痕大师
// 帖子列表屏蔽广告

;(function () {
  'use strict'
  var keywords = ['广告'] // 替换或者增加你想屏蔽的用户名，第一个要保留。
  function shouldHideElement(element) {
    var content = element.textContent
    return keywords.some((s) => content.includes(s))
  }
  window.addEventListener('load', function () {
    var commonDivs = document.querySelectorAll('.thread_item_box')
    commonDivs.forEach(function (div) {
      if (shouldHideElement(div)) {
        div.style.display = 'none'
      }
    })
    var commonDivs2 = document.querySelectorAll('.l_post_bright')
    commonDivs2.forEach(function (div) {
      if (shouldHideElement(div)) {
        div.style.display = 'none'
      }
    })
  })
})()

//左侧固定广告删除
;(function () {
  'use strict'
  const targetClass = 'label_text'
  const spanContent = '广告'
  const divs = document.querySelectorAll('div.clearfix')
  divs.forEach((div) => {
    const targetSpan = div.querySelector('span.' + targetClass)
    if (targetSpan && targetSpan.textContent === spanContent) {
      div.remove()
    }
  })
})()

// 精简页面
const divsToRemove = document.querySelectorAll(
  'div.card_banner,.right_section,.search_nav,.search_main_wrap,.u_split,.d_icons,.tbui_fbar_auxiliaryCare,.fix-for-ie8,#mediago-tb-pb-list-2'
)
divsToRemove.forEach((div) => {
  div.remove()
})
;(function () {
  'use strict'
  var customHTML =
    '<div id="branding_adsv">\u8d34\u5427\u52a9\u624bby <a rel="noopener" href="/home/main?un=%E7%9C%8B%E8%BF%87%E8%90%BD%E6%97%A5" title="\u963f\u571f\u7684\u4e3b\u9875" target="_blank" class="j_th_tit ">\u963f\u571f</a><a rel="noopener" href="http://zhaowenlong.com/618/" title="\u4f7f\u7528\u6559\u7a0b" target="_blank" class="j_th_tit "> / \u4f7f\u7528\u6559\u7a0b</a></div>'
  var targetDiv = document.querySelector('#aside')
  if (targetDiv) {
    targetDiv.innerHTML += customHTML
  } else {
    console.log('\u672a\u627e\u5230\u76ee\u6807 div \u5143\u7d20\u3002')
  }
})()
;(function () {
  'use strict'
  const divSelector = ['.j_thread_list', '.thread_item_box']
  const targetContent = '\u963f\u571f'
  window.addEventListener('load', function () {
    const divs = document.querySelectorAll(divSelector)
    divs.forEach(function (div) {
      if (div.textContent.includes(targetContent)) {
        div.classList.add('highlight')
      }
    })
  })
})()

// 以下css美化代码，有能力修改的可以自定义
GM_addStyle(`
  /* 背景颜色重写*/
  .skin_normal, .wrap1{
  background: #d1e4ff!important;
  }
  .content{
  background: none!important;
  }
  #head {
  background: #fff!important;
  height: 32px;
  overflow: hidden;
  margin-bottom: 30px;
  }
  /* 隐藏banner
  .card_banner{
  display:none !important;
  }*/
  /* 贴吧名位置优化 */
  .card_top_theme .card_top{
  padding-left: 100px!important;
  }
  /* 贴吧logo */
  .card_top_theme .card_head, .card_top_theme .card_head_img{
  width:50px!important;
  height:50px!important;
  border-radius: 50%!important;
  }
  /* 贴吧关注部分 */
  .head_main{
  margin: 20px;
  }
  .card_top_theme, .card_top_theme2 {
  border: none!important;
  border-top-left-radius: 5px !important;
  border-top-right-radius: 5px !important;
  background-color: #fff!important;
  box-shadow: 0px 0px 2px rgb(98 124 153 / 30%)!important;
  }
  .nav_wrap{
  box-shadow: 0px 0px 2px rgb(98 124 153 / 30%)!important;
  border: none;
  border-bottom-right-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
  }
  .search_internal_btn {
  position: relative;
  top: -3px;
  }
  .thread_top_list_folder{
  border: none!important;
  border-radius: 5px!important;
  box-shadow: 0px 0px 2px rgb(98 124 153 / 30%)!important;
  margin: 0px 5px 5px 0px!important;
  }
  /* 帖子详情页顶部翻页部分 */
  .thread_theme_5, .p_thread thread_theme_5{
  width:980px!important;
  background: #f5f7fa!important;
  border: none!important;
  margin: 10px 0px 10px 0px!important;
  box-shadow: 0px 0px 2px rgb(98 124 153 / 30%)!important;
  border-radius: 5px!important;
  }
  /* 帖子详情页内容部分 */
  .pb_content{
  border: none!important;
  background: none!important;
  box-shadow: 0px 0px 2px rgb(98 124 153 / 30%)!important;
  border-radius: 5px!important;
  overflow: hidden;
  }
  .left_section{
  width: 980px!important;
  border-radius: 5px!important;
  }
  .core_title_wrap_bright{
  width: 950px!important;
  padding: 0px 5px 0px 25px!important;
  box-shadow: 0px 0px 2px rgb(98 124 153 / 50%)!important;
  border: none!important;
  z-index: 1;
  }
  .l_post_bright {
  border-left: 0px solid #E5E5E5!important;
  border-bottom: 1px solid #f1f2f3!important;
  background: none!important;
  width: 980px;
  }
   /* 用户头像资料 */
  .p_author_face{
  background: none!important;
  border: none!important;
  height: 90px!important;
  padding: 0px!important;
  width: 90px!important;
  cursor: pointer;
  border-radius: 5px!important;
  overflow: hidden;
  box-shadow: 0px 0px 2px rgb(98 124 153 / 30%)!important;
  }
  .icon_relative img{
  height: 90px!important;
  width: 90px!important;
  }
  .d_badge_bright{
  border-radius: 5px!important
  }
  .d_badge_title{
  font-family: 微软雅黑!important;
  }
  .d_author{
  width: 175px;
  }

  /* 帖子内容页 */
  .d_post_content_main{
  width: 785px!important;
  }
  .lzl_link_fold{
  border-radius: 5px!important;
  border-top-left-radius: 5px!important;
  border-top-right-radius: 5px!important;
  }
  .core_reply_wrapper{
  float: right!important;
  width: 780px!important;
  border-top-left-radius: 5px!important;
  border-bottom-right-radius: 5px!important;
  border-bottom-left-radius: 5px!important;
  }
  /*.BDE_Image{
  max-width:none!important;
  width: 765px!important;
  height: auto!important;
  }*/

  /* 关闭右侧广告*/
  .celebrity, .app_download_box, .config-tab-tip{
  display:none !important;
  }
  #branding_adsv{
  float:right;
  padding-right:5px;
  color:#888;
  }

  /* 列表页面优化 */
  .forum_content{
  background: none!important;
  border:none!important;
  }
  /*.main, .left_section{
  width:100%!important;
  }*/
  /* 帖子列表美化 */
  .threadlist_title{
  font-size: 15px!important;
  }
  .threadlist_bright>li {
  position: relative;
  border-bottom: none!important;
  border-radius: 5px!important;
  box-shadow: 0px 0px 2px rgb(98 124 153 / 30%)!important;
  margin: 0px 5px 8px 0px!important;
  background: #fff;
  transition: all 0.3s linear
  }
  .threadlist_bright>li:hover {
  background-color: #e9f2ff!important;
  }
  /* 帖子列表图片美化 */
  .vpic_wrap img{
  border-radius: 5px!important;
  }
  .threadlist_bright .threadlist_media li{
  max-width: 400px;
  max-height: 200px;
  }
  .icon_wrap_theme1{display:none!important;}
  /* 右侧部分块优化 */
  .aside_region {
  border-bottom: none!important;
  border-radius: 5px!important;
  box-shadow: 0px 0px 2px rgb(98 124 153 / 30%)!important;
  margin: 0px 0px 8px 0px!important;
  background: #fff!important;
  }
  /* 翻页按钮优化 */
  .pagination-current, .pagination-item{
  border-radius: 5px!important;
  }
  /* 底部发帖优化 */
  .frs_content_footer_pagelet{
  width: 735px!important;
  background:none!important;
  border-bottom: none!important;
  border-radius: 5px!important;
  box-shadow: 0px 0px 2px rgb(98 124 153 / 30%)!important;
  margin: 0px 5px 5px 0px!important;
  background: #fff!important;
  }
  .old_style_wrapper, .edui-container{
  width: 695px!important;
  }
  #tb_rich_poster_container{
  width: 950px!important;
  }
  .editor_title{
  width: 620px!important;;
  }
  /* 帖子内容页 底部发帖优化 */
  .thread_theme_7 {
  margin: 20px 0!important;
  border-radius: 5px!important;
  overflow: hidden!important;
  }
  .pb_footer{
  background: #f1f2f3!important;
  border-radius: 5px!important;
  border: none!important;
  margin-bottom: 20px!important;
  }

  /* 右侧按钮美化 */
  .tbui_aside_float_bar li a {
  border-radius: 5px!important;
  }

  .highlight{
  background: linear-gradient(45deg, rgb(62 137 250 / 5%) 25%, rgb(255 255 255) 25%, rgb(255 255 255) 50%, rgb(62 137 250 / 5%) 50%, rgb(62 137 250 / 5%) 75%, rgb(255 255 255) 75%)!important;
  background-size: 40px 40px!important;
  }

  /*.highlight:hover{
  background: #accab5!important;
  }*/


`)
