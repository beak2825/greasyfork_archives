// ==UserScript==
// @name         HLW 批量发邀请
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  hdsky 批量发邀请
// @author       yigezhanghao
// @icon         https://www.google.com/s2/favicons?domain=hdsky.me
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        GM.xmlHttpRequest

// @match        https://pt.keepfrds.com/*
// @match        https://pterclub.com/*

// @downloadURL https://update.greasyfork.org/scripts/432279/HLW%20%E6%89%B9%E9%87%8F%E5%8F%91%E9%82%80%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/432279/HLW%20%E6%89%B9%E9%87%8F%E5%8F%91%E9%82%80%E8%AF%B7.meta.js
// ==/UserScript==

// add invite button in info block
if (/pt.keepfrds.com/.test(location.href)) {
  var id = $('a.Administrator_Name:first')?.attr('href')?.split('=')[1]
  $('#info_block .bottom:first').append(
    `<form method="post" action="invite.php?id=${id}&amp;type=new" style="display:inline-block; margin-left: 20px">
    <button type="submit">邀请其他人</button>
  </form>`
  )
}

if (/pterclub.com/.test(location.href)) {
  var id = $('a.User_Name')?.attr('href')?.split('=')[1]
  $('#info_block .bottom:first').append(
    `<form method="post" action="invite.php?id=${id}&amp;type=new" style="margin-left: 20px; display:inline-block;">
    <button type="submit">邀请其他人</button>
  </form>`
  )
}

// new invite
if (/invite.php\?id=\d+&type=new/.test(window.location.href)) {
  var showInviteResult = () => {
    console.log('inviteResult:', inviteResult)
    var resultHtml = ''
    for (mail in inviteResult) {
      var mailResult = `<li>${mail}: ${inviteResult[mail]}</li>`
      resultHtml += mailResult
    }
    $('#invite-result').append(resultHtml)
  }

  var sendInvite = (url, mail, msg) => {
    var data = `email=${mail}&body=${encodeURIComponent(msg)}`
    // console.log('url: ', url)
    // console.log('data: ', data)

    GM.xmlHttpRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
      onload: response => {
        console.log('response:', response)
        // console.log('!!res.res:', response.response)
        sendedMailAmount += 1

        if (response.status !== 200) {
          inviteResult[mail] = '发送失败！'
        } else if (
          response.responseText &&
          response.responseText.indexOf('已经在使用') !== -1
        ) {
          inviteResult[mail] = '失败！此邮箱已经在使用！'
        } else {
          inviteResult[mail] = 'OK'
        }

        if (sendedMailAmount === mailList.length) {
          showInviteResult()
        }
      },
    })
  }

  // invite button
  var onClickInvite = () => {
    if (!detected) {
      alert('请先点击检测按钮，确认邮箱！')
      return
    }

    if (!mailList.length) {
      alert('未检测到任何邮箱！')
      return
    }

    var searchParams = new URLSearchParams(window.location.search)
    var id = searchParams.get('id')
    var inviteUrl = `https://${window.location.host}/takeinvite.php?id=${id}`

    var msg = oriInviteMsgInput.val()

    mailList.forEach(mail => {
      sendInvite(inviteUrl, mail, msg)
    })
  }

  // const result = {
  //   a: { target: 1000, sended: 1000, info: 'OK' },
  //   e: { target: 1000, sended: 1000, info: '考核中！' },
  //   b: { target: 1000, sended: 1000, info: 'OK' },
  //   d: { target: 1000, sended: 1000, info: '用户不存在！' },
  //   f: { target: 1000, sended: 1000, info: '考核中！' },
  //   c: { target: 1000, sended: 1000, info: '用户不存在！' },
  // }

  // for (i in result) {
  //   console.log(i)
  //   console.log(result[i])
  // }

  var showSendPointsResult = () => {
    console.log('showSendPointsResult:', sendPointsResult)
    var resultHtml = ''
    for (account in sendPointsResult) {
      var accountResult = sendPointsResult[account]
      var info = accountResult['info']
      var successText = `成功发送 ${accountResult['sendedPoints']}`
      var accountResultEle = `<li>
        ${account}: ${info === 'OK' ? successText : info}
        </li>`
      resultHtml += accountResultEle
    }
    $('#send-points-result').append(resultHtml)
  }

  var sendPoints = (account, points, msg) => {
    var url = `https://${window.location.host}/mybonus.php?action=exchange`
    // hdsky: option 10
    // keepfrds: option 7
    if (/keepfrds/.test(window.location.href)) {
      var option = 7
    } else {
      var option = 10
    }
    var data = `username=${account}&bonusgift=${points}&message=${msg}&option=${option}&submit=赠送`
    // var data = `username=GG123456&bonusgift=1000&message=test1000&option=7&submit=赠送`
    console.log('url: ', url)
    console.log('data: ', data)

    GM.xmlHttpRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
      onload: response => {
        console.log(`send to ${account}: ${points}, msg: ${msg}:`, response)
        console.log('response: ', response.response)
        console.log(`sendPointsResult ${account}: `, sendPointsResult[account])

        if (response.responseText.indexOf('不存在') !== -1) {
          sendPointsResult[account]['info'] = '用户不存在！'
          sendedPointsAmount += 1
        } else if (response.responseText.indexOf('考核中') !== -1) {
          sendPointsResult[account]['info'] = '考核中！'
          sendedPointsAmount += 1
        } else if (response.responseText.indexOf('错误') == -1) {
          sendPointsResult[account]['sendedPoints'] += points
          if (
            sendPointsResult[account]['sendedPoints'] ===
            sendPointsResult[account]['targetPoints']
          ) {
            sendPointsResult[account]['info'] = 'OK'
            sendedPointsAmount += 1
          }
        }

        if (sendedPointsAmount === accountList.length) {
          showSendPointsResult()
        }
      },
    })
  }

  // send points button
  var onClickSendPoints = () => {
    if (!detected) {
      alert('请先点击检测按钮，确认邮箱！')
      return
    }

    if (!accountList.length) {
      alert('未检测到任何账号！')
      return
    }

    var pointsStr = $("input[type='radio'][name='points']:checked").val()
    var points = parseInt(
      pointsStr === 'custom' ? $('#points-input').val() : pointsStr
    )
    console.log('points: ', points)

    var msg = $('#send-points-msg').val()

    accountList.forEach(account => {
      sendPointsResult[account] = {}
      sendPointsResult[account]['targetPoints'] = points
      sendPointsResult[account]['sendedPoints'] = 0
      sendPointsResult[account]['info'] = ''

      let amount = points
      const step = 10000
      while (amount > step && sendPointsResult[account]['info'] == '') {
        sendPoints(account, step, msg)
        amount -= step
      }
      if (amount && sendPointsResult[account]['info'] == '') {
        sendPoints(account, amount, msg)
      }
    })
  }

  // detect button
  var onClickDetect = () => {
    var input = $('#mail-input').val()

    $('#invite-result').text('')
    inviteResult = {}
    sendedMailAmount = 0
    mailList = []

    $('#send-points-result').text('')
    sendPointsResult = {}
    sendedPointsAmount = 0
    accountList = []

    input
      .split('\n')
      .map(s => s.trim())
      .forEach(s => {
        var re = /\S+@\S+\.\S+/
        if (re.test(s)) {
          mailList.push(s)
        } else {
          s !== '' && accountList.push(s)
        }
      })
    // remove duplicate
    mailList = Array.from(new Set(mailList))
    accountList = Array.from(new Set(accountList))

    $('#mail-num').text(mailList.length)
    $('#mail-list')
      .text('')
      .append(mailList.map(s => `<li>${s}</li>`).join(''))
    $('#account-num').text(accountList.length)
    $('#account-list')
      .text('')
      .append(accountList.map(s => `<li>${s}</li>`).join(''))

    detected = true
  }

  // first row, mail or account input & result
  var mailInputRow = $('tr:contains("邮箱地址"):last')
  mailInputRow.find('td:first').text('邮箱地址/账号')
  var oriMailInput = mailInputRow.find('input')

  var info = `
  <div>
    请输入含有邮箱或账号的文本，一行一个，不能识别为邮箱的文本自动当作账号处理
  </div>
  `
  oriMailInput.before(info)

  var replacedArea = `
  <div style="display: flex;">
    <textarea id="mail-input" name="mail-input" rows="12" cols="50">
    </textarea>

    <div style="display: flex; flex-direction: column; margin-left: 50px; flex: 1 1 0%;">
      <div>
        <div style="font-size: 1.2em; color: #d32f2f;">
          检测到 <span id="mail-num">0</span> 个邮箱:</div>
        <div id="mail-list"></div>
      </div>

      <div style="margin-top: 20px;">
        <div style="font-size: 1.2em; color: #d32f2f;">邀请结果:</div>
        <div id="invite-result"></div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; margin-left: 50px; flex: 1 1 0%;">
      <div>
        <div style="font-size: 1.2em; color: #d32f2f;">
          检测到 <span id="account-num">0</span> 个账号:</div>
        <div id="account-list"></div>
      </div>

      <div style="margin-top: 20px;">
        <div style="font-size: 1.2em; color: #d32f2f;">发魔结果:</div>
        <div id="send-points-result"></div>
      </div>
    </div>
  </div>
  `
  oriMailInput.replaceWith(replacedArea)

  // second row, invite msg
  var oriInviteMsgInput = $('textarea:last')
  oriInviteMsgInput.attr('id', 'invite-msg')
  var oriInviteMsgRow = oriInviteMsgInput.closest('tr')
  oriInviteMsgRow.find('td:first').text('邀请留言')

  // third row, points input
  var pointsRowEle = `
    <tr>
      <td class="rowhead nowrap" valign="top" align="right">赠送魔力值</td>
      <td align="left">
        <div>
          <input type="radio" id="points-1k"
          name="points" value="1000">
          <label for="points-1k">1000</label>

          <input type="radio" id="points-1w"
          name="points" value="10000" style="margin-left: 20px" checked>
          <label for="points-1w">10,000</label>

          <input type="radio" id="points-10w"
          name="points" value="100000" style="margin-left: 20px">
          <label for="points-10w">100,000</label>

          <input type="radio" id="points-custom"
          name="points" value="custom" style="margin-left: 20px">
          <label for="points-custom">自定义</label>
          <input type="number" id="points-input" name="points-input">
      </div>
      </td>
    </tr>
    `
  oriInviteMsgRow.after(pointsRowEle)

  // forth row, points msg
  var sendPointsMsgRow = `
    <tr>
      <td class="rowhead nowrap" valign="top" align="right">发魔留言</td>
      <td align="left">
        <textarea id="send-points-msg" name="body" rows="8" cols="120"></textarea>
      </td>
    </tr>
  `
  oriInviteMsgRow.next().after(sendPointsMsgRow)

  // last row, buttons
  var oriInviteBtn = $('input[value="邀请"]')

  var BtnsEle = `
<button type="button" id="btn-detect" style="padding: 5px 10px;">
  检测
</button>

<button type="button" id="btn-invite" style="margin-left: 10px;padding: 5px 10px;">
  邀请
</button>

<button type="button" id="btn-send-points" style="margin-left: 10px;padding: 5px 10px;">
  发魔
</button>
  `
  oriInviteBtn.replaceWith(BtnsEle)
  var detectBtn = $('#btn-detect')
  var inviteBtn = $('#btn-invite')
  var sendPointsBtn = $('#btn-send-points')

  var mailList = []
  var accountList = []
  var detected = false
  var inviteResult = {}
  var sendPointsResult = {}
  var sendedMailAmount = 0
  var sendedPointsAmount = 0
}

;(function () {
  'use strict'

  // new invite
  if (/invite.php\?id=\d+&type=new/.test(window.location.href)) {
    detectBtn.click(() => onClickDetect())
    inviteBtn.click(() => onClickInvite())
    sendPointsBtn.click(() => onClickSendPoints())
  }

  // invite
  if (/invite.php\?id=\d+$/.test(window.location.href)) {
    var btnForm = $('form:last')
    btnForm.css('text-align', 'center')
    $('h1').after(btnForm)
  }
})()
