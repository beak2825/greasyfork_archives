// ==UserScript==
// @name         收件箱一键已读 大聪明
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nexusphp 未读消息一键已读
// @author       wdiasda
// @icon         https://hhanclub.top/favicon.ico
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://hhanclub.top/messages.php*
// @downloadURL https://update.greasyfork.org/scripts/473793/%E6%94%B6%E4%BB%B6%E7%AE%B1%E4%B8%80%E9%94%AE%E5%B7%B2%E8%AF%BB%20%E5%A4%A7%E8%81%AA%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/473793/%E6%94%B6%E4%BB%B6%E7%AE%B1%E4%B8%80%E9%94%AE%E5%B7%B2%E8%AF%BB%20%E5%A4%A7%E8%81%AA%E6%98%8E.meta.js
// ==/UserScript==
 
var markread = async unreadMsgIds => {
  console.log('mark read:', unreadMsgIds)
  var { origin, pathname } = window.location
  var url = origin + pathname
  var params = {
    action: 'moveordel',
    markread: '设为已读',
    box: '1',
  }
  var data =
    $.param(params) +
    '&' +
    unreadMsgIds.map(id => 'messages%5B%5D=' + id).join('&')
  await $.post(url, data)
}
 
var getUnreadMsgIds = html => {
  var unreadMsgIds = []
  $(html)
    .find('form:last > div')
    .eq(1)
    .find('div')
    .each(function () {
      var alt = $(this).find('div:nth-child(2) img').attr('src')
      if (alt === 'styles/HHan/icons/icon-unread.svg') {
        var msgId = $(this).find('div:first-child input').val()
        unreadMsgIds.push(msgId)
      }
    })
  console.log(unreadMsgIds)
  return unreadMsgIds
}
 
var isLastUnread = html => {
  var lastRow = $(html).find('form:last > div').eq(1).find('div:last-child')
  var alt = $(lastRow).find('div:nth-child(2) img').attr('src')
  return alt === 'styles/HHan/icons/icon-unread.svg' ? true : false
}
 
var handleNextPage = html => {
 
   // 获取选中的选项
  var selectElement = $(html).find('select[class="px-5"]')
  var selectedOption = selectElement.find('option:selected');
    // 判断选中的选项是否有下一个选项
  if (selectedOption.next().is('option')) {
  // 获取下一个选项的 value 属性值
    var nextOptionValue = selectedOption.next().val();
    console.log('Next option value:', nextOptionValue);
  } else {
    console.log('No next option available.');
  }
  var nextPageLink = 'https://hhanclub.top/messages.php?action=viewmailbox&box=1&place=both&page=' + (nextOptionValue)
  $.get(nextPageLink).done(e => clearPageUnread(e))
}
 
var hasNextPage = html => {
  // 获取选中的选项
  var selectElement = $(html).find('select[class="px-5"]')
  var selectedOption = selectElement.find('option:selected');
    // 判断选中的选项是否有下一个选项
  if (selectedOption.next().is('option')) {
  // 获取下一个选项的 value 属性值
    var nextOptionValue = selectedOption.next().val();
    console.log('Next option value:', nextOptionValue);
    return true
  } else {
    return false
  }
}
 
var clearPageUnread = async html => {
  var unreadMsgIds = getUnreadMsgIds(html)
  if (unreadMsgIds.length === 0) {
    $('#result').text('已读完毕！')
    return
  } else {
    await markread(unreadMsgIds)
    if (isLastUnread(html) && hasNextPage(html)) {
      handleNextPage(html)
    } else {
      $('#result').text('已读完毕！')
      location.reload()
    }
  }
}
 
var onClickClear = () => {
  $('#result').text('已读中...')
  clearPageUnread(document)
}
 
;(function () {
  'use strict'
  var searchBtn = $('div[class="flex items-center gap-x-[3px]"]')
  var clearBtn = `<input id="clear-btn" class="btn px-6 py-1 text-center text-md font-medium bg-[#4F5879B2] text-[#FFFFFF] flex items-center justify-center rounded-md" type="button" value="一键已读" style="margin-left: 20px;">`
  searchBtn.after(clearBtn)
  //var searchRow = $('form[action="messages.php"]')
  var searchRow = $('form[method="post"]')
  searchRow.before(
    //'<div id="result" style="margin-top: 20px; font-size: 20px; color: #616161;"></div>'
    '<br><br><div class="text-xl font-bold text-[#9B9B9B]">已读状态：</div><div id="result" class="text-xl font-bold text-[#F29D38]">请点击页面右下方一键已读按钮</div>'
  )
  $('#clear-btn').click(onClickClear)
})()