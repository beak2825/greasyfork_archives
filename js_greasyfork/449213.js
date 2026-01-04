// ==UserScript==
// @name         小白菜评论下载器（抖音、快手、小红书、B站）
// @namespace    http://www.jsjunqiao.com
// @version      0.1
// @description  可以扒取四个平台的昵称和评论内容
// @author       一颗小白菜
// @grant        none
// @match        *://*.douyin.com/video/*
// @match        *://*.xiaohongshu.com/discovery/*
// @match        *://*.kuaishou.com/short-video/*
// @match        *://*.bilibili.com/video/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/xlsx-core@1.0.3/xlsx.core.min.js
// @require https://greasyfork.org/scripts/449207-xlsxstyle-core-min-js/code/xlsxStylecoreminjs.js?version=1079578
// @require https://greasyfork.org/scripts/449210-xlsxstyle-utils-js/code/xlsxStyleutilsjs.js?version=1079581
// @require https://greasyfork.org/scripts/449211-xlsxexport-utils-js/code/xlsxExportutilsjs.js?version=1079584
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449213/%E5%B0%8F%E7%99%BD%E8%8F%9C%E8%AF%84%E8%AE%BA%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E6%8A%96%E9%9F%B3%E3%80%81%E5%BF%AB%E6%89%8B%E3%80%81%E5%B0%8F%E7%BA%A2%E4%B9%A6%E3%80%81B%E7%AB%99%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/449213/%E5%B0%8F%E7%99%BD%E8%8F%9C%E8%AF%84%E8%AE%BA%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E6%8A%96%E9%9F%B3%E3%80%81%E5%BF%AB%E6%89%8B%E3%80%81%E5%B0%8F%E7%BA%A2%E4%B9%A6%E3%80%81B%E7%AB%99%EF%BC%89.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  window.onload = function () {
    $('body').append('<div id="my-download" style="width: 100px;height: 40px;background: #fe2c55;position: fixed;top: 30px;left: 30px;z-index: 100000;text-align: center;line-height: 40px;color: #fff;border-radius: 8px;cursor: pointer;">下载评论</div>')

    $('#my-download').click(function () {
      var target = $('.CDx534Ub')
      var table = [['昵称', '评论']]
      var env = judgeEnv()

      if (env === 'douyin') {
        for (var i = 0; i < target.length; i++) {
          var CDx534Ub = $('.CDx534Ub').eq(i)
          var name = CDx534Ub.find('.YzbzCgxU .AMzEzRWv').eq(0).find('.Uvaas5kD .nEg6zlpW').html()
          var comment = CDx534Ub.find('.YzbzCgxU .a9uirtCT').eq(0).find('.Nu66P_ba').html()
          table.push([name, comment])
        }

      } else if (env === 'xiaohongshu') {
        var comment = $('.comment')
        for (var i = 0; i < comment.length; i++) {
          var x_comment = comment.eq(i)
          var name = x_comment.find('.comment-info .user-nickname').html()
          var content = x_comment.find('.content').eq(0).html()
          table.push([name, content])
          if (x_comment.find('.reply').length > 0) {
            var reply = x_comment.find('.reply')
            for (var j = 0; j < reply.length; j++) {
              var reply_name = reply.eq(j).find('.replier').html()
              var reply_content = reply.eq(j).find('.reply-content').html()
              table.push([reply_name, reply_content])
            }
          }
        }
      } else if (env === 'kuaishou') {
        var comment = $('.comment-item')
        for (var i = 0; i < comment.length; i++) {
          var x_comment = comment.eq(i)
          var name = x_comment.find('.comment-item-body .comment-item-author .router-link .author-name').html()
          var content = x_comment.find('.comment-item-body .comment-item-content').html()
          table.push([name, content])
          if (x_comment.find('.comment-sub-item').length > 0) {
            var reply = x_comment.find('.comment-sub-item')
            for (var j = 0; j < reply.length; j++) {
              var reply_name = reply.eq(j).find('.reply-name').text()
              var reply_content = reply.eq(j).find('.comment-item-warp').html()
              table.push([reply_name, reply_content])
            }
          }
        }
      } else if (env === 'bilibili') {
        var comment = $('.reply-item')
        for (var i = 0; i < comment.length; i++) {
          var x_comment = comment.eq(i)
          var name = x_comment.find('.user-info .user-name').html()
          var content = x_comment.find('.root-reply .reply-content').html()
          table.push([name, content])
          if (x_comment.find('.sub-reply-list .sub-reply-item').length > 0) {
            var reply = x_comment.find('.sub-reply-list .sub-reply-item')
            for (var j = 0; j < reply.length; j++) {
              var reply_name = reply.eq(j).find('.sub-user-info .sub-user-name').html()
              var reply_content = reply.eq(j).find('.reply-content').html()
              table.push([reply_name, reply_content])
            }
          }
        }
      }else{
        alert('解析出错！')
        return false
      }
      //生成表格
      exportExcel(table, env)
    })

    function exportExcel(data, env) {
      for (var i = 0; i < data.length; i++) {
        data[i][0] = removeImgTag(data[i][0])
        data[i][1] = removeImgTag(data[i][1])
      }
      XSExport.excelExport(data, env + '评论数据')
    }

    function judgeEnv() {
      var location = window.location.href
      if (location.indexOf('douyin') > -1) {
        return 'douyin'
      } else if (location.indexOf('xiaohongshu') > -1) {
        return 'xiaohongshu'
      } else if (location.indexOf('kuaishou') > -1) {
        return 'kuaishou'
      } else if (location.indexOf('bilibili') > -1) {
        return 'bilibili'
      } else {
        return -1
      }
    }

    function removeImgTag( html )   {
      var regex1 = /<img[^>]*>/gi
      var regex2 = /<[^>]*a[^>]*>/gi
      var regex3 = /<[^>]*i[^>]>/gi
      var regex4 = /<[^>]*span[^>]>/gi
      var regex5 = /<[^>]*div[^>]>/gi
      var regex6 = /<!---->/gi
      var html = html.replace(regex1, '').replace(regex2, '').replace(regex3, '').replace(regex4, '').replace(regex5, '').replace(regex6, '')
      return html
   }
  }
})()
