// ==UserScript==
// @name        csdn不登录展开评论 去除页面侧边栏，只保留作者信息，按钮一键隐藏弹出的登录框，免登录复制
// @namespace    http://tampermonkey.net/
// @version      15
// @description  不登录展开评论 去除页面侧边栏，只保留作者信息，按钮一键隐藏弹出的登录框，免登录复制
// @author       lzcer
// @match        https://blog.csdn.net/*/*/details/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/412128/csdn%E4%B8%8D%E7%99%BB%E5%BD%95%E5%B1%95%E5%BC%80%E8%AF%84%E8%AE%BA%20%E5%8E%BB%E9%99%A4%E9%A1%B5%E9%9D%A2%E4%BE%A7%E8%BE%B9%E6%A0%8F%EF%BC%8C%E5%8F%AA%E4%BF%9D%E7%95%99%E4%BD%9C%E8%80%85%E4%BF%A1%E6%81%AF%EF%BC%8C%E6%8C%89%E9%92%AE%E4%B8%80%E9%94%AE%E9%9A%90%E8%97%8F%E5%BC%B9%E5%87%BA%E7%9A%84%E7%99%BB%E5%BD%95%E6%A1%86%EF%BC%8C%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/412128/csdn%E4%B8%8D%E7%99%BB%E5%BD%95%E5%B1%95%E5%BC%80%E8%AF%84%E8%AE%BA%20%E5%8E%BB%E9%99%A4%E9%A1%B5%E9%9D%A2%E4%BE%A7%E8%BE%B9%E6%A0%8F%EF%BC%8C%E5%8F%AA%E4%BF%9D%E7%95%99%E4%BD%9C%E8%80%85%E4%BF%A1%E6%81%AF%EF%BC%8C%E6%8C%89%E9%92%AE%E4%B8%80%E9%94%AE%E9%9A%90%E8%97%8F%E5%BC%B9%E5%87%BA%E7%9A%84%E7%99%BB%E5%BD%95%E6%A1%86%EF%BC%8C%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

;(function () {
  $(function () {
    console.log('加载完成!')
    let color = $('#csdn-toolbar>div>div>ul>li:first-child>a').css('color')
    let background = $('#csdn-toolbar>div>div').css('background-color')
    let height = $('#csdn-toolbar>div>div').css('height')
    $('#csdn-toolbar>div>div').prepend('<div id="mySlot">隐藏登录框</div>')
    $('#mySlot').css({
      zIndex: 999900,
      width: '80px',
      height: '100%',
      backgroundColor: background,
      textAlign: 'center',
      lineHeight: height,
      color: color,
      cursor: 'pointer',
      marginTop: '0',
      float: 'left',
      marginRight: '8px',
      boxSizing: 'border-box',
    })
    $('#mySlot').click(function () {
      console.log('hiddenClicked')
      $('#passportbox').css({
        display: 'none',
      })
      $('.login-mark').css({
        display: 'none',
      })
    })
    $('#asideCustom').css({
      display: 'none',
    })
    $('#rightAside').css({
      display: 'none',
    })
    $('#asideHotArticle').css({
      display: 'none',
    })
    $('#csdn-shop-window-top').css({
      display: 'none',
    })
    $('#csdn-shop-window').css({
      display: 'none',
    })
    $('#asideCategory').css({
      display: 'none',
    })
    $('#asideNewComments').css({
      display: 'none',
    })
    $('#asideArchive').css({
      display: 'none',
    })
    $('#mainBox > main > .recommend-box').css({
      display: 'none',
    })
    GM_addStyle('.login-mark,#passportbox{display:none!important;}')
    var copyBtn = $('#content_views  pre > code>div')
    if (copyBtn.length == 0) {
      copyBtn = $('#content_views  pre > code + div')
    }
    copyBtn.attr({
      'data-title': '复制',
    })
    copyBtn.click(function () {
      GM_setClipboard(this.parentNode.innerText)
      $(this).attr({
        'data-title': '复制成功',
      })
      let this_ = $(this)
      setTimeout(function () {
        this_.attr({
          'data-title': '复制',
        })
      }, 1000)
    })
    var scriptData
    var filterDir = ['edu', 'live', 'school']
    var filterMenu = []
    $.getJSON(
      'https://img-home.csdnimg.cn/data_json/toolbar/toolbar1217.json',
      function (res) {
        scriptData = res.menus
        scriptData.forEach((item, index) => {
          if (filterDir.includes(item.id)) {
              console.log(index,item);
            $('.toolbar-menus> li:nth-child(' + (index+1) + ')').css({
              display: 'none',
            })
          }
        })
      }
    )

    var count = 0
    var intv = setInterval(function () {
      count++
      if (count > 50) {
        clearInterval(intv)
        return
      }
      console.log('changing')
      var btn = $('#btnMoreComment')
      var span = $('#btnMoreComment >span')
      if (span.length == 0) {
        return
      }
      if (span.html() != '展开评论') {
        span.html('展开评论')
        btn.click(function (e) {
          console.log('clicked')
          var box = $('.comment-list-box')
          box.css({
            maxHeight: box.css('maxHeight') == 'none' ? '132px' : 'none',
          })
          span.html(span.html() == '收起评论' ? '展开评论' : '收起评论')
          $('#passportbox').css({
            display: 'none',
          })
          $('.login-mark').css({
            display: 'none',
          })
        })
      } else clearInterval(intv)
    }, 100)
  })
})()
