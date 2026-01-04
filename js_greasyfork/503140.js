// ==UserScript==
// @name         autoLogin
// @license MIT
// @namespace    http://oneoneone.cn/
// @version      1.0
// @description  This is a script file used to move the slider verification code, but the success rate cannot be guaranteed.
// @author       ChoiWan
// @match        https://*.temu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      127.0.0.1
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/short-unique-id@5.2.0/dist/short-unique-id.min.js

// @downloadURL https://update.greasyfork.org/scripts/503140/autoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/503140/autoLogin.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);


function doCheckJumpToLogin() {
  let isLogining = false

  const timeout = getRandomInteger(10, 20) * 1000
  setInterval(() => {
	if (!isLogining) {
	  const href = window.location.href
	  if (href.indexOf('temu.com/login.html') !== -1) {
		isLogining = true
		console.log('bingo ! atempt to login ...')
		waitElement('#user-account')
		  .then(result => {
			var uid = new ShortUniqueId({length: getRandomInteger(9,13), dictionary: 'number'})
			const account = uid.rnd() + '@qq.com'
			$('#user-account')
			  .val(account)
			waitElement('#submit-button')
			  .then(result => {
				$('#submit-button')
				  .click()
				waitElement('#pwdInputInLoginDialog')
				  .then(result => {
					$('#user-account')
					  .val(account)
					$('#pwdInputInLoginDialog')
					  .trigger('focus')
					document.execCommand('insertText', false, account)
					waitElement('#submit-button')
					  .then(result => {
						$('#submit-button')
						  .click()
						isLogining = false
						window.location.replace('https://temu.com/uk?' + Math.random())
					  })
					  .catch(err => {
						console.log('sorry:submit-button2')
						isLogining = false
					  })
				  })
				  .catch(err => {
					console.log('sorry:pwdInputInLoginDialog')
					isLogining = false
				  })
			  })
			  .catch(err => {
				console.log('sorry:submit-button')
				isLogining = false
			  })
			$('#submit-button')
			  .click()
		  })
		  .catch(err => {
			console.log('sorry:user-account')
			isLogining = false
		  })
	  }
	}
  }, timeout)
}

function waitElement(selector, times, interval, flag = true) {
  var _times = times || 50,     // 默认50次
	_interval = interval || 100, // 默认每次间隔100毫秒
	_selector = selector, //选择器
	_iIntervalID,
	_flag = flag //定时器id
  return new Promise(function(resolve, reject) {
	_iIntervalID = setInterval(function() {
	  if (!_times) { //是0就退出
		clearInterval(_iIntervalID)
		reject()
	  }
	  _times <= 0 || _times-- //如果是正数就 --
	  var _self = document.querySelector(_selector) //再次选择
	  if ((_flag && _self) || (!_flag && !_self)) { //判断是否取到
		clearInterval(_iIntervalID)
		resolve(_self)
	  }
	}, _interval)
  })
}

/**
 * 等待一段时间
 * @param time
 * @returns {Promise<unknown>}
 */
function sleep(time) {
  return new Promise((resolve) => {
	setTimeout(() => {
	  resolve()
	}, time)
  })
}

/**
 * 获取随机整数
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 清理所有cookie和localStorage
 */
async function clearAllCookies() {
  localStorage.clear()
  sessionStorage.clear()
  var cookies = document.cookie.split(';')
  for (var i = 0; i < cookies.length; i++) {
	var cookie = cookies[i]
	var eqPos = cookie.indexOf('=')
	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
	document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
  }
  const databases = await indexedDB.databases();
  databases.forEach((element) => {
	// log(`name: ${element.name}, version: ${element.version}`);
	indexedDB.deleteDatabase(element.name);
  });
}

(function() {
  'use strict'
  console.log('AutoLogin Plugin Start')

  doCheckJumpToLogin()
})()
