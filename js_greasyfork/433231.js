// ==UserScript==
// @name         收件箱一键已读
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  nexusphp 未读消息一键已读
// @author       yigezhanghao
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://pt.keepfrds.com/messages.php*
// @match        https://hdsky.me/messages.php*
// @match        https://pterclub.com/messages.php*
// @match        https://springsunday.net/messages.php*
// @match        https://ourbits.club/messages.php*
// @match        https://pthome.net/messages.php*
// @match        https://www.tjupt.org/messages.php*
// @downloadURL https://update.greasyfork.org/scripts/433231/%E6%94%B6%E4%BB%B6%E7%AE%B1%E4%B8%80%E9%94%AE%E5%B7%B2%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/433231/%E6%94%B6%E4%BB%B6%E7%AE%B1%E4%B8%80%E9%94%AE%E5%B7%B2%E8%AF%BB.meta.js
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
    .find('table:last > tbody > tr')
    .slice(1, -2)
    .each(function () {
      // alt is Read or Unread
      var alt = $(this).find('td:first > img').attr('alt')
      if (alt === 'Unread') {
        var msgId = $(this).find('td:last > input').val()
        unreadMsgIds.push(msgId)
      }
    })
  return unreadMsgIds
}

var isLastUnread = html => {
  var rows = $(html).find('table:last > tbody > tr')
  var lastRow = rows.get(-3)
  var alt = $(lastRow).find('td:first > img').attr('alt')
  return alt === 'Unread' ? true : false
}

var handleNextPage = html => {
  var currentPageEle = $(html).find('p[align="center"] > font:contains("-")')
  var nextPageLink = currentPageEle.next().attr('href')
  $.get(nextPageLink).done(e => clearPageUnread(e))
}

var hasNextPage = html => {
  var currentPageEle = $(html).find('p[align="center"] > font:contains("-")')
  return currentPageEle.next().length === 0 ? false : true
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
  var searchBtn = $('input[value="给我搜"]')
  var clearBtn = `<input id="clear-btn" class="btn" type="button" value="一键已读" style="margin-left: 20px;">`
  searchBtn.after(clearBtn)
  var searchRow = searchBtn.closest('table')
  searchRow.after(
    '<div id="result" style="margin-top: 20px; font-size: 20px; color: #616161;"></div>'
  )
  $('#clear-btn').click(onClickClear)
})()
