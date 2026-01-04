// ==UserScript==
// @name        幕布兑换会员 - mubu.com
// @namespace   Violentmonkey Scripts
// @match       https://mubu.com/*
// @grant       none
// @version     1.2
// @author      -
// @description 2020/7/15 上午10:27:16
// @downloadURL https://update.greasyfork.org/scripts/407083/%E5%B9%95%E5%B8%83%E5%85%91%E6%8D%A2%E4%BC%9A%E5%91%98%20-%20mubucom.user.js
// @updateURL https://update.greasyfork.org/scripts/407083/%E5%B9%95%E5%B8%83%E5%85%91%E6%8D%A2%E4%BC%9A%E5%91%98%20-%20mubucom.meta.js
// ==/UserScript==

function get_one_code() {
  const use_code = [
    '1357-3192-0691-2172',
    '1574-2480-0697-2758',
    '2655-6873-0544-4357',
    '2668-3983-0634-8640',
    '3018-3365-0406-7069',
    '3305-7677-0649-5236',
    '5445-3804-0643-5009',
    '5546-5107-0246-4145',
    '6435-7684-0945-7952',
    '6828-5611-0174-5278',
    '6853-8233-0422-8588',
    '7191-5622-0728-8647',
    '9349-8930-0749-1774',
    '9642-9716-0768-8881',
    '9878-8560-0725-1240',
    '7434-4489-0365-1171',
  ]

  const code_index = Math.floor(Math.random() * 10000 % use_code.length)
  
  const code = use_code[code_index]
  
  console.log(code)
  return code
}

function openVipUpgradePage() {
  if (window.location.href !== 'https://mubu.com/upgrade') {
    window.location.href = 'https://mubu.com/upgrade'
    return
  }
  
  window.location.reload()
}

function openVip() {
  if (window.location.href !== 'https://mubu.com/upgrade') {
    openVipUpgradePage()
    return
  }
  
  const code = get_one_code()

  document.querySelector('#use-update-code').click()

  document.querySelector('#upgrade-code-input').value = code

  document.querySelector('#submit-code-btn').click()
  
  // const sleepTime = Math.floor(Math.random() / 1000)
  const sleepTime = 1000
  
  // openVipUpgradePage()
  setTimeout(() => {
    console.log(`休息 ${sleepTime}s 再继续`)
  
    window.location.reload()
  }, sleepTime)
}

try {
  openVip()
} catch(e) {
  console.error(e)
  openVipUpgradePage()
}
