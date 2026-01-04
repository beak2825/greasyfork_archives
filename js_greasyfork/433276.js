// ==UserScript==
// @name         HLW 统计
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  统计资源体积和数量
// @author       HLW
// @icon         https://www.google.com/s2/favicons?domain=m-team.cc
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://kp.m-team.cc/userdetails.php?id=*
// @downloadURL https://update.greasyfork.org/scripts/433276/HLW%20%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/433276/HLW%20%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

var copyToClipboard = text => {
  var $temp = $('<input>')
  $('body').append($temp)
  $temp.val(text).select()
  document.execCommand('copy')
  $temp.remove()
}

var formatKB = sizeKB => {
  if (sizeKB == 0) return '0 KB'
  var sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(sizeKB) / Math.log(1024))
  return parseFloat((sizeKB / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

var strToKB = sizeStr => {
  var sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = sizes.findIndex(unit => sizeStr.includes(unit))
  var digit = parseFloat(sizeStr.slice(0, -2))
  return digit * Math.pow(1024, i)
}

var checkFrds = tr => {
  var title = $(tr).find('td:eq(1) > a').text()
  if (/[@-]FRDS$/.test(title)) {
    result.frds.num++
    var sizeStr = $(tr).find('td:eq(2)').text()
    result.frds.sizeKB += strToKB(sizeStr)
  }
}

var checkVideo = tr => {
  var typeTitle = $(tr).find('td:first img').attr('title')
  var videoTypes = ['Movie', 'TV Series', '紀錄教育', 'Anime']
  if (videoTypes.some(t => typeTitle.includes(t))) {
    result.video.num++
    var sizeStr = $(tr).find('td:eq(2)').text()
    result.video.sizeKB += strToKB(sizeStr)
  }
}

var handleRow = tr => {
  checkFrds(tr)
  checkVideo(tr)
}

var getPageSum = html => {
  $(html)
    .find('table:last tr')
    .slice(1)
    .each(function () {
      handleRow(this)
    })
}

var getNextPageLinks = html => {}

var getSum = async (seedingUrl, html) => {
  if ($(html).find('p:first > a:contains("-")').length === 0) {
    var maxPageNum = 0
  } else {
    var maxPageNum = parseInt(
      $(html)
        .find('p:first > a:contains("-"):last')
        .attr('href')
        .split('=')
        .pop()
    )
  }
  var pageNums = Array.from(Array(maxPageNum + 1).keys())
  for (var p in pageNums) {
    var pageUrl = seedingUrl + '&page=' + p
    console.log('pageUrl: ', pageUrl)
    var pageHtml = await $.get(pageUrl)
    getPageSum(pageHtml)
  }
}

var result = {
  video: { num: 0, sizeKB: 0 },
  frds: { num: 0, sizeKB: 0 },
}

var cal = async () => {
  $('head').append(`
    <style type="text/css">
      #o table,
      #o th,
      #o td {
        border: 1px solid #999;
        font-size: 14px;
        color: #222;
        padding: 5px 20px;
      }

      #o table {
        margin: 20px;
        background: #ddd;
      }
    </style>
    `)

  var seedingStatusEle = `
    <div id="o">
      <table>
        <tr>
          <th colspan="3">保种统计</th>
        </tr>
        <tr>
          <th></th>
          <td>数量</td>
          <td>体积</td>
        </tr>
        <tr>
          <td>影视剧</td>
          <td id="video-num">统计中...</td>
          <td id="video-size">统计中...</td>
        </tr>
        <tr>
          <td>FRDS 资源</td>
          <td id="frds-num">统计中...</td>
          <td id="frds-size">统计中...</td>
        </tr>
      </table>
    </div>
    `
  $('#copy-result').after(seedingStatusEle)

  var searchParams = new URLSearchParams(window.location.search)
  var id = searchParams.get('id')
  var seedingUrl = `https://kp.m-team.cc/getusertorrentlist.php?userid=${id}&type=seeding`
  var html = await $.get(seedingUrl)
  await getSum(seedingUrl, html)

  $('#video-num').text(result.video.num)
  $('#video-size').text(formatKB(result.video.sizeKB))
  $('#frds-num').text(result.frds.num)
  $('#frds-size').text(formatKB(result.frds.sizeKB))
}

;(function () {
  'use strict'
  $.ajax({
    url: 'https://pt.keepfrds.com/userdetails.php?id=34548',
    crossDomain: true,
  }).done(e => console.log('out:', e))
  var see = $('tr:contains("目前做種"):last > td:last > a')
  var moreEle = `
    <button type="button" id="btn-cal" style="margin-left: 20px; cursor: pointer;">统计</button>
    <button type="button" id="btn-copy" style="margin-left: 20px; cursor: pointer;">复制邮箱</button>
    <span id="copy-result"></span>
    `
  see.after(moreEle)
  $('#btn-cal').click(cal)
  $('#btn-copy').click(() => {
    var mail = $('tr:contains("郵箱"):last > td:last').text()
    copyToClipboard(mail)
    $('#copy-result').text('邮箱已复制！')
  })
})()
