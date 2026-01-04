// ==UserScript==
// @name         autoClear
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
// @require       https://scriptcat.org/lib/637/1.4.3/ajaxHooker.js#sha256=y1sWy1M/U5JP1tlAY5e80monDp27fF+GMRLsOiIrSUY=
// @downloadURL https://update.greasyfork.org/scripts/503153/autoClear.user.js
// @updateURL https://update.greasyfork.org/scripts/503153/autoClear.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true)

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
  const databases = await indexedDB.databases()
  databases.forEach((element) => {
	// log(`name: ${element.name}, version: ${element.version}`);
	indexedDB.deleteDatabase(element.name)
  })
}

function doAutoClick() {
  setInterval(() => {
	const startBtn = $('.kasdsaj>.btn-box>#task-start')
	if (startBtn.length > 0) {
	  const text = startBtn.text()
	  if (text == 'start') {
		console.log('start')
		startBtn.click()
	  }
	  else {
		console.log('stop')
		startBtn.click()
		setTimeout(() => {
		  const _startBtn = $('.kasdsaj>.btn-box>#task-start')
		  const text = startBtn.text()
		  if (text == 'start') {
			console.log('start')
			_startBtn.click()
		  }
		}, 300)
		setTimeout(() => {
		  const _startBtn = $('.kasdsaj>.btn-box>#task-start')
		  const text = startBtn.text()
		  if (text == 'start') {
			console.log('start')
			_startBtn.click()
		  }
		}, 1000)
		setTimeout(() => {
		  const _startBtn = $('.kasdsaj>.btn-box>#task-start')
		  const text = startBtn.text()
		  if (text == 'start') {
			console.log('start')
			_startBtn.click()
		  }
		}, 2000)
	  }
	}
  }, 30000)
}

function doRejectClick() {
  setInterval(() => {
	// Reject all
	const rejectItem = $('span:contains("Reject all")')
	// 隐藏cookie弹框
	if (rejectItem.length > 0) {
	  rejectItem.click()
	}
  }, 500)
}

function doCheckSoldOut() {
  setInterval(() => {
	const flag = $('div:contains("This item is sold out.")')
	if (flag.length > 0) {
	  console.log('sold out')
	  clearAllCookies()
	  window.location.replace('https://temu.com/uk?' + Math.random())
	}
  }, 10000)
}

(function() {
  'use strict'
  //===================Function : HOOK REQUEST ========================================
  /*ajaxHooker.hook(request => {

	  //if (request.url === '/api/bg/sigerus/auth/login_name/is_registered') {

	  // console.log('ajaxHooker :',request)

	  // request.headers['Anti-Content'] = anti
	  //}
  });*/
  //===================Function 1: doAutoRefresh ========================================
  /*doAutoRefresh()
  function doAutoRefresh(){
	  setInterval(() => {
		  waitElement('#best_new_log')
					  .then(result => {
			  const text = $('#best_new_log>p').text()
			  if(text.indexOf('任务队列为空')!=-1){
				  console.log('doAutoRefresh')
				  location.reload();
			  }
		  })

	  },5000)
  }*/
  //===================Function 1: doAutoClick ========================================
  doAutoClick()
  doRejectClick()
  doCheckSoldOut()
})()
