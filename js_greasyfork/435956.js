// ==UserScript==
// @name         B站获取up主投稿数据
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  此插件用于获取B站up主投稿列表数据,附带导出Excel网站  进入up主投稿视频列表后，首先选择右侧列表展示（不支持方块展示）。  此时，页面“TA的视频”标题处将出现“开始统计”按钮，点击后将从当前页开始统计数据。  期间请保持网络状态稳定，切勿操作当前页面（不影响其他窗口页面操作）。  一页数据大概耗时1秒（过于频繁会被封ip），根据总页数自行判断所需时间。  待数据统计完毕后，“开始统计”按钮后会出现 文本输入域（内含所有统计数据） 和 导出Excel的跳转按钮。  首选选中复制文本输入域内所有文字，然后点击“导出Excel”跳转按钮。  在新开页面右侧，粘贴复制的统计数据,页面下方即出现下载按钮。
// @author       You
// @include      https://space.bilibili.com/*
// @icon         https://space.bilibili.com/favicon.ico
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435956/B%E7%AB%99%E8%8E%B7%E5%8F%96up%E4%B8%BB%E6%8A%95%E7%A8%BF%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/435956/B%E7%AB%99%E8%8E%B7%E5%8F%96up%E4%B8%BB%E6%8A%95%E7%A8%BF%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        let videoList = []
        let totalPage = 0
        let nowPage = 0
        $('.page-head__left').append(`<button id="startCalc">开始统计</button>`)
        $(document).on('click', '#startCalc', function() {
          if ($('.be-pager-item-active').attr('title').split(':')[0] === '最后一页') {
            nowPage = parseInt($('.be-pager-item-active').attr('title').split(':')[1])
          } else {
            nowPage = parseInt($('.be-pager-item-active').attr('title'))
          }
          totalPage = parseInt($('.be-pager-total').text().split('共 ')[1].split(' 页，')[0])
          startCalc()
        })
        $(document).on('click', '#checkResult', function() {
          $('.page-head__left').append(`<textarea id="dataText" value="" type="text"></textarea><a href="https://data.page/json/csv" target="blank">导出Excel</a>`)
          $('#dataText').val(JSON.stringify(videoList))
        })
        function startCalc() {
          console.log(nowPage)
          if (nowPage > totalPage) {
            $('.page-head__left').append(`<textarea id="dataText" value="" type="text" readonly></textarea><a href="https://data.page/json/csv" target="blank">导出Excel</a>`)
            $('#dataText').val(JSON.stringify(videoList))
            return
          }
          for (let i = 0; i < $('.list-list').children('.list-item').length; i++) {
              const element = $('.list-list').children('.list-item').eq(i)
              let title = element.children('.c').children('.title-row').children('.title').attr('title')
              let href = element.children('.c').children('.title-row').children('.title').attr('href')
              let desc = element.children('.c').children('.desc').attr('title')
              let play = element.children('.c').children('.meta').children('.play').text().split('\n')[0]
              let bulletComments = element.children('.c').children('.meta').children('.comments').text().split('\n')[0]
              videoList.push({
                title: title,
                href: href,
                desc: desc,
                play: play,
                bulletComments: bulletComments
              })
          }
          // loopCheck()
          $('.be-pager-next').click()
          nowPage++
          console.log(videoList)
          setTimeout(() => {
            startCalc()
          }, 1000)
        }
    }, 2000)
})();