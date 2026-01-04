// ==UserScript==
// @name         电子科技大学专升本课程助手
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  自动化挂机完成课程任务,适用于https://xuexi.qsxueli.com/web/
// @author       ZaneBill
// @match        https://xuexi.qsxueli.com/web/
// @grant        none
// @license      AGPL License
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/428055/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E4%B8%93%E5%8D%87%E6%9C%AC%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428055/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E4%B8%93%E5%8D%87%E6%9C%AC%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';
  $(document).ready(function(){
    let operateBox = "<div class='operateBox'><div class='videoBox'><span>视频课程：</span><span class='startVideo'>点击开始</span></div><div class='pdfBox'><span>课程资料：</span><span class='startPDF'>点击开始</span></div></div>"
    $('body').append(operateBox)
    $('.operateBox').css({
      'position': 'fixed',
      'top': '230px',
      'right': '30px',
      'background': '#fff',
      'border-radius': '4px',
      'padding': '5px'
    })
    $('.videoBox').css({
      'height': '30px',
      'line-height': '30px'
    })
    $('.startVideo').css({
      'color': 'red',
      'cursor': 'pointer'
    })
    $('.pdfBox').css({
      'height': '30px',
      'line-height': '30px'
    })
    $('.startPDF').css({
      'color': 'red',
      'cursor': 'pointer'
    })
    let needPlayPdfList = []
    let videoInterval,pdfInterval
    let isInitVideo = true
    let isInitPDF = true
    $('.startVideo').on('click', function(){
      if($('.startVideo').text() === '运行中') {
        clearInterval(videoInterval)
        $('.startVideo').text('点击开始')
        isInitVideo = true
        return
      }
      $('.startVideo').text('运行中')
      $('.ke_menu li')[1].click()
      window.onblur = null
      $('html').on('mouseleave', function(e){
	     e.stopPropagation()
      })
      // 展开所有章节
      $('.shipinList').children().each((index ,ele) => {
        $(ele).addClass('show')
      })
      isInitVideo && autoPlayVideo()
      videoInterval = setInterval(() => {
        let isFinnish = $('.el-message-box__message').text() === '本小节学习已完成'
        let isClick = $('.el-message-box__wrapper').css('display') === 'none'
        isInitVideo = false
        if(isFinnish && !isClick){
          console.log('video已完成====', new Date())
          $('.el-message-box__btns .el-button--primary').click()
          autoPlayVideo()
        }
        let $video = $('#courseVideo video')[0]
        if($video && $video.paused){
          $video.play()
          $video.muted = true
        }
      }, 3000);
    })
    
    $('.startPDF').on('click', function(){
      if($('.startPDF').text() === '运行中'){
        clearInterval(pdfInterval)
        $('.startPDF').text('点击开始')
        isInitPDF = true
        return
      }
      $('.startPDF').text('运行中')
      $('.ke_menu li')[2].click()
      window.onblur = null
      $('html').on('mouseleave', function(e){
	     e.stopPropagation()
      })
      isInitPDF && autoPlayPDF()
      pdfInterval = setInterval(() => {
        isInitPDF = false
        if($(needPlayPdfList[0]).children().length){
          console.log('pdf已完成===', new Date())
          autoPlayPDF()
        }
      }, 3000);
    })
   
    function autoPlayVideo(){
      let needPlayList = []
      $('.shipinList .el-progress__text').each((index,ele)=>{
        if($(ele).text()){
            needPlayList.push(ele)
          }
        })
      $(needPlayList[0]).click()
    }

    function autoPlayPDF(){
      needPlayPdfList = []
      $('.ziliaoList .el-progress__text').each((index,ele)=>{
        if($(ele).text()){
          needPlayPdfList.push(ele)
        }
      })
      $(needPlayPdfList[0]).click()
    }
  })
})();