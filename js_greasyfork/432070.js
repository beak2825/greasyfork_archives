// ==UserScript==
// @name         自定义猫粮赠送
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自定义猫粮赠送!
// @author       yigezhanghao
// @match        https://pterclub.com/mybonus.php
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432070/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%8C%AB%E7%B2%AE%E8%B5%A0%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/432070/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%8C%AB%E7%B2%AE%E8%B5%A0%E9%80%81.meta.js
// ==/UserScript==

const send = (username, bonusgift, message) => {
  const data =
    'username=' +
    username +
    '&bonusgift=' +
    bonusgift +
    '&message=' +
    message +
    '&option=13&submit=赠送'

  GM.xmlHttpRequest({
    method: 'POST',
    url: 'https://pterclub.com/mybonus.php?action=exchange',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data,
    onload: response => {
      if (response.response.indexOf('错误') == -1) {
        sendedAmount += bonusgift
        $('#sended-amount').text(sendedAmount)
      }
    },
  })
}

const resetFields = () => {
  username.val('')
  giftcustom.val('')
  message.val('')
  sendedAmount = 0
}

const handleSend = () => {
  let amount = parseInt(giftcustom.val())

  // check input points
  if (isNaN(amount)) {
    alert(numAlertText)
    giftcustom.val('')
    return
  }

  // check username
  if (username.val() === '') {
    alert(userAlertText)
    username.val('')
    return
  }

  $('#send_ml').after(
    `<p>向 ${username.val()}  成功赠送: <span id="sended-amount">${sendedAmount}</span>克猫粮！</p>`
  )

  while (amount > 10000) {
    send(username.val(), 10000, message.val())
    amount -= 10000
  }

  if (amount) {
    send(username.val(), amount, message.val())
  }

  resetFields()
}

const data = [
  {
    lang: '简体中文',
    btnText: '自定义猫粮赠送!',
    numAlertText: '您输入的猫粮数值有误，请重新输入！',
    userAlertText: '请输入受赠人的用户名！',
  },
  {
    lang: '繁體中文',
    btnText: '自定義貓糧贈送!',
    numAlertText: '您輸入的貓糧數值有誤，請重新輸入！',
    userAlertText: '請輸入受贈人的用戶名！',
  },
  {
    lang: 'English',
    btnText: 'Custom Karma Gift!',
    numAlertText: 'Wrong points, please input point number again!',
    userAlertText: 'Please input username!',
  },
]
const lang = $('#lang-selector > img').attr('title')
const config = data.find(i => i.lang === lang)
const { btnText, numAlertText, userAlertText } = config

let sendedAmount = 0

const row = $('#outer tbody > tr:nth-last-child(3)')
const username = row.find('input[name="username"]')
const giftcustom = row.find('#giftcustom')
const message = row.find('input[name="message"]')

;(function () {
  'use strict'

  const btn = row.find('input[name="submit"]')
  const newBtn = `<button type="button" id="send_ml" >${btnText}</button>`

  btn.after(newBtn)

  $('#send_ml').click(() => handleSend())
})()
