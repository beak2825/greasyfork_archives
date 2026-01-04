// ==UserScript==
// @name            关闭百度首页推荐
// @description   百度首页默认展示我的关注
// @version     1.0
// @author      ll
// @license      MIT
// @match       https://www.baidu.com
// @match       https://www.baidu.com/
// @match       https://www.baidu.com/?tn=baiduhome_pg
// @match       https://www.baidu.com/home
// @match       https://www.baidu.com/?vit=1
// @icon          https://www.baidu.com/favicon.ico
// @namespace     https://github.com/llsccm
// @supportURL    https://github.com/llsccm/userscript/issues
// @homepageURL  https://github.com/llsccm/userscript
// @run-at       document-end
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/470692/%E5%85%B3%E9%97%AD%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/470692/%E5%85%B3%E9%97%AD%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

; (function () {
  'use strict'
  // document.querySelector('#head_wrapper').className = 's-isindex-wrap head_wrapper s-title-img'
  $('#head_wrapper').removeClass('s-ps-islite')
  const baiduCss = `#head_wrapper.s-ps-islite .s-p-top{position:relative;bottom:unset;height:60%}#head_wrapper.s-ps-islite .fm{position:unset;bottom:unset}#s_menu_gurd{display:block!important}#s_main{display:block!important;opacity:0;transition:all .4s}#head_wrapper.s-down .s_form{width:100%;min-width:1250px;margin:0 auto;height:100%;padding-left:0;margin-top`
  GM_addStyle(baiduCss)
  setTimeout(() => {
    $('#s_main').css({ opacity: 1 })
    $('#head').append(`<div id="bottom_space" class="s-bottom-space"></div>`)
  })
})()