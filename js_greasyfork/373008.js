// ==UserScript==
// @name         百度搜索优化sp
// @namespace    bdso_sp
// @description  Tampermonkey脚本,屏蔽百度推广和各种广告+页面样式美化+url重定向
// @update-url   https://greasyfork.org/zh-CN/users/218062-vizo
// @author       vizo
// @version      3.0.2
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @include      https://www.baidu.com/s*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/373008/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96sp.user.js
// @updateURL https://update.greasyfork.org/scripts/373008/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96sp.meta.js
// ==/UserScript==

let bdcss = `
body,
div,
th,
td,
.p1,
.p2,
h1,
h2,
h3,
h4,
h5,
h6,
a {
  font-family: sans-serif,"Helvetica Neue",Helvetica,"PingFang SC","Microsoft YaHei","Hiragino Sans GB",Arial;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal !important;
}
.c-tools,
.to_tieba,
.res_top_banner,
.op-soft-normal-tip,
.hint_right_middle,
.rrecom-container,
.hint_common_restop,
.rrecom-btn-parent,
.c-pingjia,
.ad-block,
#m2c69bdd0,
#imsg,
#rs_top_new,
#foot,
#page .fk,
#content_left .leftBlock,
#content_left > table,
#content_right .c-gray,
#content_right .hint_right_top,
#content_right .opr-toplist-info,
#content_right table table {
  display: none !important;
}
a.m {
  box-shadow: -9px 0px 0 0px #fff;
  color: #fff;
  pointer-events: none;
}
.container_l {
  width: 100%;
}
#wrapper.wrapper_l {
  overflow: hidden;
}
#head .headBlock {
  margin: 4px 0 10px 0 !important;
}
#head .headBlock a:hover {
  text-decoration: underline !important;
}
#head .headBlock .hint_toprq_tips {
  width: 730px;
  margin: 0 auto;
}
body .result-molecule {
  width: 748px !important;
  margin: 10px auto 10px auto !important;
  padding: 0 !important;
}
#form {
  float: none !important;
  margin: 0 auto !important;
  width: 740px;
  display: block;
  padding-top: 16px;
  padding-left: 0;
  transform: translateX(-6px);
}
#form .s_ipt_wr {
  width: 616px !important;
  height: 36px;
  border: 1px solid #c4c7ce;
  border-radius: 0;
}
#form .s_btn {
  height: 38px !important;
  line-height: 40px;
  font-size: 16px;
  display: block;
  border-radius: 0;
  background-color: #07e;
}

#head.fix-head #form {
  padding-top: 8px;
}
#head.fix-head #form #xyb_goo_so_btn {
  top: 16px;
}
#head.fix-head #form .bdsug-new {
  top: 49px;
}

.soutu-env-result .soutu-layer,
.soutu-env-imgresult .soutu-layer {
  width: 748px !important;
}
.soutu-layer .soutu-url-btn {
  width: 186px !important;
}
.wrapper_l #kw {
  height: 36px;
  font: 16px/36px Microsoft YaHei;
  width: 570px !important;
  margin: 0 !important;
  padding-left: 7px;
}
.content_none {
  width: 748px;
  padding: 40px 0;
  margin: 0 auto;
}
.search_tool_conter {
  margin: 0 auto !important;
}
.nums {
  margin: 0 auto !important;
}
#s_tab {
  width: 717px;
  margin: 0 auto;
  position: relative;
  padding: 72px 0 0 0 !important;
  overflow: visible !important;
  border-bottom: none !important;
  opacity: 0;
  animation: fadeIn 1s both;
}
.s_form::after,
.s_tab::after {
  visibility: visible !important;
}
#s_tab::after {
  content: '';
  width: 5000px;
  height: 1px;
  background: #e1e1e1;
  position: absolute;
  left: -2500px;
  bottom: -2px;
  z-index: 3;
}
.head_nums_cont_inner {
  overflow-x: hidden !important;
  opacity: 0;
  animation: fadeIn 1s both;
}

#content_right {
  display: none !important;
}

body {
  background: #f9f9f9;
  background-attachment: fixed;
}
a {
  text-decoration: none !important;
  color: #07e;
}
a:hover {
  color: #07e;
}
a em {
  text-decoration: none;
}

#u,
#head,
#tool,
#search,
#foot {
  font-size: 14px;
}
#form .s_ipt_wr {
  width: 625px;
}

body .wrapper_new #form .bdsug-new {
  width: 615px;
  border: 1px solid #c4c5c6 !important;
  border-radius: 0;
  top: 57px;
}
.wrapper_new #form .bdsug-new ul {
  border-top: 0 !important;
}
#s_tab b {
  border-bottom: 3px #07e solid;
  color: #07e;
}

#rs {
  width: 690px;
  padding: 10px 20px 10px;
  margin: 10px auto 10px auto !important;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 5px #dbdbdb;
  opacity: 0;
  overflow: hidden;
  animation: fadeInUp 0.35s both;
}
#rs a:hover {
  text-decoration: underline !important;
}
#rs .tt {
  border-bottom: 1px solid #ddd;
}
#rs th {
  width: 300px;
  font-size: 15px;
  padding-top: 5px;
  padding-left: 50px;
}
#container {
  margin: 0 auto !important;
}
#content_left {
  width: 748px !important;
}
#content_left td a:hover,
#content_left .c-row a:hover {
  text-decoration: underline !important;
}
#wrapper_wrapper #content_left {
  width: 730px;
  padding-left: 0;
  float: none;
  margin: 0 auto !important;
  padding: 0 !important;
  opacity: 0;
  animation: fadeInUp 0.35s both;
}
#content_left > .c-container {
  width: 100% !important;
  box-sizing: border-box;
  margin-bottom: 10px !important;
  padding: 10px 15px 10px 15px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #d3d5d7;
}
#content_left article[class*="open-source-software-card_"],
#content_left article[class*="aladdin_"] {
  padding: 0;
  box-shadow: none;
}
#content_left .c-container h3 {
  padding-bottom: 5px;
  margin-bottom: 8px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}
.c-container h3 a {
  position: relative;
  display: inline-block;
  font-size: 18px;
  font-family: Helvetica Neue, sans-serif, Microsoft YaHei, helvetica, arial;
}
#content_left .c-container h3 a.favurl {
  background-position: 0 5px;
  background-repeat: no-repeat;
}
#content_left .OP_LOG_LINK.c-text {
  font-size: 14px !important;
  vertical-align: -5px;
}
#content_left .OP_LOG_LINK.c-text:visited {
  color: #fff;
}
#content_left .OP_LOG_LINK.c-text:hover {
  color: #fff;
}
#content_left .c-container h3 a:hover {
  color: #07e;
}
#content_left .c-container h3 a:hover:after {
  left: 0;
  width: 100%;
  transition: width 0.35s;
}
#content_left .c-container h3 a:after {
  content: '';
  position: absolute;
  border-bottom: 2px solid #37e;
  bottom: -4px;
  left: 100%;
  width: 0;
  transition: width 0.35s, left 0.35s;
}

#content_left .c-container h3 a {
  position: relative;
}
#content_left .c-container h3 a:visited {
  color: #660099;
}
#content_left .c-container h3 a:visited:hover:after {
  left: 0;
  width: 100%;
  transition: width 0.35s;
}
#content_left .c-container h3 a:visited:after {
  content: '';
  position: absolute;
  border-bottom: 2px solid #660099;
  bottom: -2px;
  left: 100%;
  width: 0;
  transition: width 0.35s, left 0.35s;
}

#content_left .c-abstract {
  width: 100%;
}
#content_left .c-span18 {
  width: 560px;
}
#content_left .c-border {
  width: auto;
  box-shadow: none;
}

#content_left .op-soft-btnbox .c-btn-primary {
  display: none;
}
#content_left .op-soft-btnbox a {
  border: 1px solid;
  padding: 7px;
}

#content_left .op-soft-btnbox a:hover {
  text-decoration: none !important;
  background: #2c99ff;
  color: #fff;
}
#content_left .c-container .f13,
#content_left .c-container .c-row,
.c-abstract {
  font-size: 14px;
  line-height: 24px;
}
.c-border {
  width: 518px;
  padding: 9px;
  margin: auto;
  border: 1px solid #f3f3f3;
  border-bottom-color: #f3f3f3;
  border-right-color: #f3f3f3;
  box-shadow: 1px 2px 0px rgba(0, 0, 0, 0);
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    -webkit-transform: translateY(30px);
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#page {
  display: block;
  width: 710px;
  height: 40px;
  line-height: 40px;
  background-color: transparent !important;
  padding: 5px 5px 5px 15px !important;
  border-radius: 3px;
  margin: 30px auto 80px auto !important;
  text-align: center;
}
#page a,
#page strong {
  height: auto;
  box-shadow: 0 0 10px #c4c5c6;
}
#page .pc:hover {
  background: #07e;
  color: #07e;
}
#page strong .pc {
  background: #07e;
  color: #fff;
}
#page strong .pc:hover {
  background: #07e;
  color: #fff;
}

#page a span:hover {
  background: #07e !important;
  color: #fff !important;
}

#page [class*="page-inner"] {
  padding: 0 !important;
}

#con-at .result-op {
  margin: 10px auto auto 10px;
  padding: 5px 40px 5px 20px;
  background: #fdfdfd;
  box-shadow: 0 0px 1px 0.5px #0f93d2, 0 1px 5px 0px rgba(0, 0, 0, 0.7);
  transition: 0.4s;
}

body > .result-op {
  background: none !important;
}

#content_left > div:not([id]) {
  width: 640px;
  margin-bottom: 10px;
  padding: 10px 45px;
  border-radius: 2px;
  box-shadow: 0 0 5px #c4c5c6;
}
.t > div:not([id]) {
  width: 640px;
  margin-bottom: 10px;
  padding: 10px 45px;
  border-radius: 3px;
  box-shadow: 0 0 10px #c4c5c6;
}

body > div[style*='position: absolute;'],
body > div[style*='position: fixed;'] {
  display: none !important;
}

#content_left > div[style*='display:block !important'] {
  position: absolute !important;
  top: -5000px !important;
  display: none !important;
}

.bdpage-l,
.bdpage-r {
  width: 300px;
  height: 500px;
  overflow: hidden;
  cursor: pointer;
  position: fixed;
  top: 0;
  bottom: 0;
  margin: auto;
}
.bdpage-l.disa,
.bdpage-r.disa {
  cursor: not-allowed;
}
.bdpage-l:hover,
.bdpage-r:hover {
  background: rgba(100, 100, 100, 0.03);
}
.bdpage-l::before,
.bdpage-r::before {
  content: '';
  width: 100px;
  height: 100px;
  border-left: 2px solid #e7e9eb;
  border-bottom: 2px solid #e7e9eb;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}
.bdpage-l:hover::before,
.bdpage-r:hover::before {
  border-color: #fff;
}
.bdpage-l {
  left: 0;
}
.bdpage-l::before {
  left: 45%;
  transform: rotate(45deg);
}
.bdpage-r {
  right: 0;
}
.bdpage-r::before {
  right: 45%;
  transform: rotate(225deg);
}
#xyb_goo_so_btn {
  font-size: 15px;
  cursor: pointer;
  position: absolute;
  top: 24px;
  right: -68px;
  z-index: 5;
}
.dn {
  display: none !important;
}

a.cdx_ed {
  position: relative;
}
a.cdx_ed::before {
  content: '已解析url';
  color: #ccc;
  font-size: 12px;
  width: 60px;
  height: 15px;
  line-height: 15px;
  text-align: left;
  position: absolute;
  top: -10px;
  left: 10px;
  z-index: 1;
}
.load-zp {
  width: 8px;
  height: 8px;
  border-radius: 55%;
  box-shadow: -9px -9px #098deb, 9px -9px #098deb, -9px 9px #098deb, 9px 9px #098deb;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 5000;
  pointer-events: none;
  animation: anim1z .9s linear infinite;
}

@keyframes anim1z {
  100% {
    transform: rotate(1turn);
  }
}

@media (max-width: 1280px) {
  .bdpage-l,
  .bdpage-r {
    width: 150px;
  }
}

`

appendBdCss()

function appendBdCss() {
  GM_addElement('style', {
    textContent: bdcss,
    class: 'bdso444yx',
  })
}

//导入CSS

function importCSS() {
  
  let isAddStyle = document.head.querySelector('.bdso444yx')
  
  if (!isAddStyle) {
    appendBdCss()
  }
  
  let gooSo = $('body').find('#xyb_goo_so_btn').length
  if (!gooSo) {
    $('body').find('#form').append('<a id="xyb_goo_so_btn" href="javascript:;">谷歌搜索</a>')
  }
}

$(function() {
  initFunc()

  try {
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let observer = new MutationObserver(initFunc)
    let wrapper = document.querySelector('#wrapper_wrapper')
    //动态监视DOM树的变化
    observer.observe(wrapper, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  } catch (e) {}

  function initFunc() {
    importCSS()
    removeADS()
    cdxUrl()
    appendElem()
    setPNStatus()
  }

  // 设置a标签真实地址
  function cdxUrl() {
    $('#content_left .c-container[mu^="http"]').each((i, v) => {
      let tis = $(v)
      const murl = tis.attr('mu')
      const link = tis.find('.t > a')
      const lnkUrl = link.attr('href')
      if (
        lnkUrl !== murl
        && !murl.includes('baidu.com')
      ) {
        link.attr('href', murl)
      }
    })
  }

  // 上一页下一页按钮
  function appendElem() {
    let len = $('body').find('.bdpage-l').length
    if (!len) {
      $('body').append('<div class="bdpage-l"></div><div class="bdpage-r"></div>')
    }
  }
  
  function showLoading() {
    $('body').append('<div class="load-zp"></div>')
  }
  
  function hideLoading() {
    $('body').find('.load-zp')?.remove()
  }
  
  function throttle(func, wait) {
    let start = 0
    return function(...args) {
      let now = Date.now()
      if (now - start >= wait) {
        func.apply(this, args)
        start = now
      }
    }
  }

  // 设置上下页状态
  function setPNStatus() {
    let fkl = true
    let fkr = true
    $('#page .n').each(function() {
      let that = $(this)
      let text = that.text()
      if (text.includes('上一页')) {
        fkl = false
      }
      if (text.includes('下一页')) {
        fkr = false
      }
    })
    if (fkl) {
      $('body')
        .find('.bdpage-l')
        .addClass('disa')
    } else {
      $('body')
        .find('.bdpage-l')
        .removeClass('disa')
    }
    if (fkr) {
      $('body')
        .find('.bdpage-r')
        .addClass('disa')
    } else {
      $('body')
        .find('.bdpage-r')
        .removeClass('disa')
    }
  }
  
  function showDeferHideLoad() {
    showLoading()
    setTimeout(hideLoading, 3000)
  }
  
  function ckPage(type = 1) {
    $('#page .n').each(function() {
      let that = $(this)
      let text = that.text()
      if (text.includes(type === 1 ? '上一页' : '下一页')) {
        that[0].click()
        showDeferHideLoad()
      }
    })
  }
  
  //屏蔽广告和推广
  function removeADS() {
    let $ads = ['#content_left>div[style*="display:block !important"]', '#content_left>div:not([id])', '#content_left>#clone']
    let $selctor = $($ads.join())
    $selctor.remove()

    $('#content_left .result[id=1]').each(function() {
      let tis = $(this)
      let txt = tis.find('.f13 .m').text()
      if (txt == '广告') {
        tis.remove()
      }
    })
  }
  
  $('body').on('click', '.bdpage-l', function() {
    ckPage(1)
  })
  $('body').on('click', '.bdpage-r', function() {
    ckPage(2)
  })
  
  // 点击谷歌搜索
  $('body').on('mousedown', '#xyb_goo_so_btn', function(e) {
    e.preventDefault()
    if (e.button === 0 || e.button === 1) {
      const goo = localStorage.getItem('bdso[gooUrl]') || 'https://www.google.com.hk/search?q='
      const wd = $('body').find('#kw').val()
      const kw = wd ? encodeURIComponent(wd) : wd
      window.open(goo + kw, '_blank')
    }
  })
  
})
