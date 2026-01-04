// ==UserScript==
// @name         b站推荐视频优化
// @namespace    http://tampermonkey.net/
// @version      3.10800
// @description  将b站默认推荐视频从6个增加到20个，并修改排版，有问题欢迎联系我修改，邮箱：1277124969@qq.com
// @author       You
// @match        http://www.dianping.com/ajax/json/shopDynamic/allReview*
// @require       https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @include       http://www.dianping.com/shop/*
// @include       https://www.bilibili.com/*
// @exclude       http://diveintogreasemonkey.org/*
// @exclude       http://www.diveintogreasemonkey.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/425014/b%E7%AB%99%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/425014/b%E7%AB%99%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict'


  //旧版


  var fresh_idx = 0;
  var items = [];
  var rounds = 1;
  var flag = false
   /*
  $('#reportFirst1').css('width', '0')
  $('.v-wrap').css({ 'max-width': '5000px', 'min-width': '10px' })
  $('.bui').css('display', 'none')
  $('.primary-menu-itnl').css('padding', '0')
  let windSize = $(window).width()
  if (windSize <= 1366) {
    $('.l-con').css('width', '831px')
    $('.b-wrap').css('width', '1258px')
    $('#bilibili-player').css({ 'width': '797px', 'height': '618px' })
    $('.rcmd-box').css({ 'width': '100%', 'margin-bottom': '350px' })
  } else {
    $('.l-con').css('width', '1233px')
    $('.b-wrap').css('width', '1630px')
    $('.rcmd-box').css({ 'width': '100%', 'margin-bottom': '486px' })
  }

  */

  var flag = false
  //新版

  $('.recommended-swipe').css('display', 'none')
  $('.container').css('grid-template-columns', 'repeat(5,1fr)')
  //   $('.video-card-reco:nth-child(n+7)').css('display':'block');
  commonSetting()


  //  $('.international-home').append(`<a href="//www.bilibili.com/v/customer-service" target="_blank" class="contact-help custom">联系客服</a>`)
//    $('.custom').css({'top':'calc(50% - 80px)'})
    /*
  $('.change-btn').click(function () {
    sleep(800).then(() => {
      commonSetting()
    })
      /*
      ///x/web-interface/index/top/feed/rcmd?fresh_idx=1&feed_version=V1&fresh_type=4&ps=30&plat=1
    $.get(`https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3&fresh_idx=${++fresh_idx}&fresh_idx_1h=${++fresh_idx}&homepage_ver=0`, function (result) {
    //  $.get(`https://api.bilibili.com/x/web-interface/index/top/rcmd?&feed_version=V1&fresh_type=4&plat=1&fresh_idx=${++fresh_idx}`, function (result) {
      $('.rcmd-box div:nth-child(10)').nextAll().remove()
      var items = result.data.item
      for (let i = 0; i <10; i++) {
        var videoUrl = items[i].uri
        var videoImg = items[i].pic
        var videoDesc = items[i].title
        var videoUpName = items[i].owner.name
        $('.rcmd-box').append(`<div class="video-card-reco"><div class="info-box"><a href=${videoUrl} target="_blank"><img src=${videoImg} alt=${videoDesc}><div class="info"><p title=${videoDesc} class="title">${videoDesc}</p><p class="up"><i class="bilifont bili-icon_xinxi_UPzhu"></i>${videoUpName}</p><p class="play">未知</p></div></a></div><div class="watch-later-video van-watchlater black"><span class="wl-tips" style="display:none;"></span></div></div>`)
      }
    })

  })
  */
  $(document).contextmenu(function (e) {
    e.preventDefault() // 阻止右键菜单默认行为


    /*
    if(!flag){
      $('#reportFirst1').css('width', '0')
      $('.v-wrap').css({ 'max-width': '5000px', 'min-width': '10px' })
      $('.bui').css('display', 'none')
      $('.primary-menu-itnl').css('padding', '0')
      let windSize = $(window).width()
      if (windSize <= 1366) {
        $('.l-con').css('width', '831px')
        $('.b-wrap').css('width', '1258px')
        $('#bilibili-player').css({ 'width': '797px', 'height': '618px' })
        $('.rcmd-box').css({ 'width': '100%', 'margin-bottom': '350px' })
      } else {
        $('.l-con').css('width', '1233px')
        $('.b-wrap').css('width', '1630px')
        $('.rcmd-box').css({ 'width': '100%', 'margin-bottom': '486px' })
      }
      flag = true
    }
    */
    $('.roll-btn')[0].click()
    sleep(500).then(() => {
      commonSetting()
    })
  })
  /*

    if(true ){
         addScript('https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js')
        // 这里写sleep之后需要去做的事情
     ah.proxy({
      onRequest: (config, handler) => {
          handler.next(config);
      },
      onError: (err, handler) => {
      },
      onResponse: (response, handler) => {
        commonSetting()
          if (response.config.url.indexOf ('rcmd') > -1){
            debugger
              items = items.concat(jQuery.parseJSON(response.response).data.item);
              if(rounds++%2 == 0){
                  for (let i = 0; i <20; i++) {
                      var videoUrl = items[i].uri
                      var videoImg = items[i].pic
                      var videoDesc = items[i].title
                      var videoUpName = items[i].owner.name
                      $('.rcmd-box').append(`<div class="video-card-reco"><div class="info-box"><a href=${videoUrl} target="_blank"><img src=${videoImg} alt=${videoDesc}><div class="info"><p title=${videoDesc} class="title">${videoDesc}</p><p class="up"><i class="bilifont bili-icon_xinxi_UPzhu"></i>${videoUpName}</p><p class="play">未知</p></div></a></div><div class="watch-later-video van-watchlater black"><span class="wl-tips" style="display:none;"></span></div></div>`)
                  }
                  commonSetting()
                  items = [];
              } else {
                   $('.rcmd-box').empty();
                  sleep(300).then(() => {
      $('.change-btn').click();
    })

              }

              /*
              sleep(50).then(() => {
             commonSetting()
          })

          }
          handler.next(response)


      }
  })
    }
*/

})()

function commonSetting () {
  $('.elevator .list-box').css('display', 'none')

  //新版
  $('.recommend-container__2-line>*:nth-of-type(1n + 8)').css('cssText', 'display:block!important')
  $('.rcmd-box div:nth-child(n+7)').css('display', 'block')
  $('#bilibili-player').css({ 'width': '1169px', 'height': '739px' })
  $(".left-container").css('width','1169px')
  $('#playerWrap').css('height','739px')
  $('.container>*:nth-of-type(n + 6)').css('margin-top', '0')
  $('.feed-card:nth-of-type(n + 9)').css('display', 'block')
  $('.palette-button-inner .palette-button-wrap').css('display', 'none')
  /*
  $('.rcmd-box div:nth-child(n+7)').css('display', 'block')
  let windSize = $(window).width()
  if (windSize <= 1366) {
    $('.video-card-reco').css({ 'width': '248px', 'height': '135px' })
    $('.video-card-reco .info-box .info .title').css({ 'margin-top': '37px' })
  } else{
    $('.video-card-reco').css({ 'width': '322px', 'height': '181px' })
    $('.video-card-reco .info-box .info .title').css({ 'margin-top': '64px' })
  }
  */
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

function addScript (url) {
  var script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', url)
  document.getElementsByTagName('head')[0].appendChild(script)
}