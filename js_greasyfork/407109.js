// ==UserScript==
// @name         百度背景搜索优化
// @namespace    bdso_sp
// @description  屏蔽百度推广以及广告+页面样式美化+url重定向+屏蔽域名
// @update-url   https://greasyfork.org/zh-CN/users/2020-07-15/Har_lan
// @author       Har_lan
// @version      2.7.7
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @include      *://www.baidu.com/*

// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/407109/%E7%99%BE%E5%BA%A6%E8%83%8C%E6%99%AF%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/407109/%E7%99%BE%E5%BA%A6%E8%83%8C%E6%99%AF%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

'use strict'

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
#wrapper {
position: relative;
z-index:999
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
  border-radius: 0;
}
#form .s_btn {
  height: 38px !important;
  line-height: 40px;
  font-size: 16px;
  display: block;
  border-radius: 0;
  background-color: #a923c5;
}

#head.fix-head #form {
  padding-top: 8px;
}
#head.fix-head #form #xyb_goo_so_btn {
  top: 16px;
}
#head.fix-head #form .bdsug-new {
  top: 52px;
}

.soutu-env-result .soutu-layer,
.soutu-env-imgresult .soutu-layer {
  width: 725px !important;
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
  width: 725px;
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
  background: #f8f8f8;
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

#head_wrapper #form .bdsug-new {
 top:55px;
 z-index:0
}
#head_wrapper #kw:focus {
border-radius: 0;
border: 1px solid #c4c7ce;
}
#head_wrapper #form .bdsug-new {
border: 1px solid #4E6EF2!important;
border-radius: 0;
}
#head_wrapper #kw {
border-radius: 0;
    border: 1px solid #c4c7ce;
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

#content_left td a:hover,
#content_left .c-row a:hover {
  text-decoration: underline !important;
}
#wrapper_wrapper #content_left {
  width: 730px;
  padding-left: 0;
  float: none;
  margin: 0 auto;
  opacity: 0;
  animation: fadeInUp 0.35s both;
}
#content_left .c-container {
  width: 700px;
  margin-bottom: 10px;
  padding: 10px 15px 10px 15px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 5px #c4c5c6;
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
  padding-left: 0px;
  padding: 5px 5px 5px 15px;
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
#page .page-inner {
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
@media (max-width: 1280px) {
  .bdpage-l,
  .bdpage-r {
    width: 150px;
  }
}


body,p,div,ol,ul,li,dl,dt,dd,h1,h2,h3,h4,h5,h6,form,input,iframe,nav {
    margin: 0;
    padding: 0;
}
html,body {
    width: 100%;
    height: 100%;
}
body {
    font: 14px Microsoft YaHei;
    -webkit-text-size-adjust:100%;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    position: relative;
    background: #000;
}
a {
    text-decoration: none;
}
ol,ul {
    list-style: none;
}
img {
    border: 0;
}
.wrapper .btn_w {
    position: absolute;
    margin: auto;
    top: 50%;
    left: 50%;
    margin-top: -22px;
    margin-left: -155px;
    z-index: 10}
;

.wrapper .btn_w .btn {
    background: transparent url(http://ww3.sinaimg.cn/large/bea70753gw1f2g4snrc2cj203m02e3yb.jpg) no-repeat 0 0;
    display: inline-block;
    width: 130px;
    height: 43px;
    margin: 0 10px;
    font: 18px/43px Microsoft YaHei;
    color: #069;
    text-align: center;
    transition: .5s;
}

.wrapper .btn_w .btn:hover {
    background-position: 0 -43px;
    color: #27b;
    box-shadow: 0 0 6px #27b;
}
#canvas {
    width: 100%;
    height: 100%;
    display: block;
    opacity: .8;
    position: absolute;
    top: 0;
    z-index:-1
}
    .c-color-t,.c-link {
color:#fff
}
.s-top-wrap {
    background: transparent;
}
#bottom_layer {
  background-color: transparent;
}

`

GM_addStyle(bdcss)

//导入CSS

function importCSS() {
  let isAddStyle = !Array.from(document.querySelectorAll('style')).some((v) => {
    return /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(v.id)
  })

  if (isAddStyle) {
    GM_addStyle(bdcss)
  }
}

$(function () {
  init()

  try {
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let observer = new MutationObserver(mutationfunc)
    let wrapper = document.querySelector('#wrapper_wrapper')
    //动态监视DOM树的变化
    observer.observe(wrapper, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  } catch (e) {}

  // 动态加载函数
  function mutationfunc() {
    init()
  }

  function init() {
    bg()
    importCSS()
    removeADS()
    cdxUrl()
    appendElem()
    setPNStatus()
  }

  // 设置a标签真实地址
  function cdxUrl() {
    // 忽略解析的域名列表
    let ignore_list = ['segmentfault.com']

    $('#content_left .c-container .t > a').each(function () {
      let that = $(this)
      let url = that.attr('href')
      let u_txt = that.closest('.result').find('.f13 > .c-showurl').text()
      let dms = u_txt.match(/\b[\w]+\.[a-z]+(?=\/|$)/) + ''
      let cdx = that.hasClass('cdx_ed')

      if (!cdx && !ignore_list.includes(dms)) {
        GM_xmlhttpRequest({
          url: url,
          method: 'head',
          onload: function (xhr) {
            try {
              that.attr('href', xhr.finalUrl).addClass('cdx_ed')
            } catch (e) {}
          },
        })
      }
    })
  }
  //百度背景
  function bg() {
    $('body')
      .find('#wrapper')
      .append(
        '<canvas id="canvas"></canvas><audio class="audio" id="oAu" src="http://m2.music.126.net/_lEPRuhlSTnuPesqWU-W2A==/5792227255321905.mp3" autoplay loop></audio>',
      )
    // 音量大小,0.01-1
    document.getElementById('oAu').volume = 0.7

    //宇宙特效
    ;('use strict')
    var canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      w = (canvas.width = window.innerWidth),
      h = (canvas.height = window.innerHeight),
      hue = 217,
      stars = [],
      count = 0,
      maxStars = 1100 //星星数量,默认1300
    var canvas2 = document.createElement('canvas'),
      ctx2 = canvas2.getContext('2d')
    canvas2.width = 100
    canvas2.height = 100
    var half = canvas2.width / 2,
      gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
    gradient2.addColorStop(0.025, '#CCC')
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)')
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)')
    gradient2.addColorStop(1, 'transparent')

    ctx2.fillStyle = gradient2
    ctx2.beginPath()
    ctx2.arc(half, half, half, 0, Math.PI * 2)
    ctx2.fill()

    // End cache
    function random(min, max) {
      if (arguments.length < 2) {
        max = min
        min = 0
      }

      if (min > max) {
        var hold = max
        max = min
        min = hold
      }

      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function maxOrbit(x, y) {
      var max = Math.max(x, y),
        diameter = Math.round(Math.sqrt(max * max + max * max))
      return diameter / 2
      //星星移动范围，值越大范围越小，
    }

    var Star = function () {
      this.orbitRadius = random(maxOrbit(w, h))
      this.radius = random(60, this.orbitRadius) / 10 //星星大小,值越大星星越小,默认8

      this.orbitX = w / 2
      this.orbitY = h / 2
      this.timePassed = random(0, maxStars)
      this.speed = random(this.orbitRadius) / 80000 //星星移动速度,值越大越慢,默认5W

      this.alpha = random(2, 10) / 10

      count++
      stars[count] = this
    }

    Star.prototype.draw = function () {
      var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
        y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
        twinkle = random(10)

      if (twinkle === 1 && this.alpha > 0) {
        this.alpha -= 0.05
      } else if (twinkle === 2 && this.alpha < 1) {
        this.alpha += 0.05
      }

      ctx.globalAlpha = this.alpha
      ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius)
      this.timePassed += this.speed
    }

    for (var i = 0; i < maxStars; i++) {
      new Star()
    }

    function animation() {
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.5 //尾巴
      ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)'
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'
      for (var i = 1, l = stars.length; i < l; i++) {
        stars[i].draw()
      }

      window.requestAnimationFrame(animation)
    }

    animation()
  }
  // 上一页下一页按钮
  function appendElem() {
    let len = $('body').find('.bdpage-l').length
    if (!len) {
      $('body').append('<div class="bdpage-l"></div><div class="bdpage-r"></div>')
    }
  }

  // 设置上下页状态
  function setPNStatus() {
    let fkl = true
    let fkr = true
    $('#page .n').each(function () {
      let that = $(this)
      let text = that.text()
      if (~text.indexOf('上一页')) {
        fkl = false
      }
      if (~text.indexOf('下一页')) {
        fkr = false
      }
    })
    if (fkl) {
      $('body').find('.bdpage-l').addClass('disa')
    } else {
      $('body').find('.bdpage-l').removeClass('disa')
    }
    if (fkr) {
      $('body').find('.bdpage-r').addClass('disa')
    } else {
      $('body').find('.bdpage-r').removeClass('disa')
    }
  }

  //屏蔽广告和推广
  function removeADS() {
    let $ads = ['#content_left>div[style*="display:block !important"]', '#content_left>div:not([id])', '#content_left>#clone']
    let $selctor = $($ads.join())
    $selctor.remove()

    $('#content_left .result[id=1]').each(function () {
      let tis = $(this)
      let txt = tis.find('.f13 .m').text()
      if (txt == '广告') {
        tis.remove()
      }
    })
  }

  // 空格键按下快速搜索
  $(document).on('keydown', function (e) {
    let isFocus = $('#kw').is(':focus')
    if (!isFocus && e.which === 32) {
      $('#kw').focus().select()
      return false
    }
  })
  $('body').on('click', '.bdpage-l', function () {
    $('#page .n').each(function () {
      let that = $(this)
      let text = that.text()
      if (~text.indexOf('上一页')) {
        that[0].click()
      }
    })
  })
  $('body').on('click', '.bdpage-r', function () {
    $('#page .n').each(function () {
      let that = $(this)
      let text = that.text()
      if (~text.indexOf('下一页')) {
        that[0].click()
      }
    })
  })
})
