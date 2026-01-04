// ==UserScript==
// @name         autoSlide
// @license MIT
// @namespace    http://oneoneone.cn/
// @version      1.4
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
// @downloadURL https://update.greasyfork.org/scripts/503154/autoSlide.user.js
// @updateURL https://update.greasyfork.org/scripts/503154/autoSlide.meta.js
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

function sleep(time) {
  return new Promise((resolve) => {
	setTimeout(() => {
	  resolve()
	}, time)
  })
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

(function() {
  'use strict'
  console.log('AutoSlide Plugin Start')
  let isVerifying = false
  let verifyType = 0 // 0:还没获取到数据
  let verifyResult = false
  ajaxHooker.hook(request => {
	if (request.url === '/api/phantom/obtain_captcha') {
	  request.response = res => {
		verifyType = JSON.parse(res.responseText).type
		console.log('verifyType 1:', verifyType)
	  }
	}
	if (request.url === '/api/phantom/user_verify') {
	  request.response = res => {
		verifyResult = JSON.parse(res.responseText).result
		console.log('verifyResult:', verifyResult)
		// 验证成功如何处理
	  }
	}
  })
  //====================Function 3: auto slide =======================================
  // check dialog
  const interval_verifyDialog = setInterval(() => {
	const element = document.querySelector('.verifyDialog')
	if (element && !isVerifying) {
	  waitElement('#slider')
		.then(result => {
		  // 普通滑块
		  if (verifyType == 23){
		  beginCrack()
		  }
		})
		.catch(err => {
		  console.log('good , no need to slide')
		  if (verifyType == 11) {
			// 点击类
			//doPictureClick()
		  }
		  else {
			//doRandomGo()
		  }
		  //window.location.replace('https://www.temu.com/uk?' + Math.random())
		})
	}
  }, 10000)

  async function doPictureClick() {
	console.log('doPictureClick')
	isVerifying = true
	var picture = $('#Picture')[0]
	//
	var mousedown = document.createEvent('MouseEvents')
	var rect = picture.getBoundingClientRect()
	var x = rect.width * 0.5 + getRandomInteger(-10, 10)
	var y = rect.height * 0.5 + getRandomInteger(-10, 10)
	mousedown.initMouseEvent(
	  'mousedown',
	  true,
	  true,
	  document.defaultView,
	  0,
	  x,
	  y,
	  x,
	  y,
	  false,
	  false,
	  false,
	  false,
	  0,
	  null
	)
	picture.dispatchEvent(mousedown)
	await sleep(100)
	//
	var mousemove = document.createEvent('MouseEvents')
	var _x = x + getRandomInteger(-10, 10)
	var _y = y + getRandomInteger(-10, 10)
	mousemove.initMouseEvent(
	  'mousemove',
	  true,
	  true,
	  document.defaultView,
	  0,
	  _x,
	  _y,
	  _x,
	  _y,
	  false,
	  false,
	  false,
	  false,
	  0,
	  null
	)
	picture.dispatchEvent(mousemove)
	//
	await sleep(500)
	var __x = _x + getRandomInteger(-10, 10)
	var __y = _y + getRandomInteger(-10, 10)
	var mouseup = document.createEvent('MouseEvents')
	mouseup.initMouseEvent(
	  'mouseup',
	  true,
	  true,
	  document.defaultView,
	  0,
	  __x,
	  __y,
	  __x,
	  __y,
	  false,
	  false,
	  false,
	  false,
	  0,
	  null
	)
	picture.dispatchEvent(mouseup)
	$('#captchaImg')
	  .parent()
	  .click()
	isVerifying = false
  }

  async function doRandomGo() {
	console.log('doRandomGo')
	isVerifying = true
	var verifyDialog = $('.verifyDialog')[0]
	//
	var mousedown = document.createEvent('MouseEvents')
	var rect = verifyDialog.getBoundingClientRect()
	var x = rect.width * 0.5 + getRandomInteger(-10, 10)
	var y = rect.height * 0.5 + getRandomInteger(-10, 10)
	mousedown.initMouseEvent(
	  'mousedown',
	  true,
	  true,
	  document.defaultView,
	  0,
	  x,
	  y,
	  x,
	  y,
	  false,
	  false,
	  false,
	  false,
	  0,
	  null
	)
	verifyDialog.dispatchEvent(mousedown)
	await sleep(100)
	//
	var mousemove = document.createEvent('MouseEvents')
	var _x = x + getRandomInteger(-10, 10)
	var _y = y + getRandomInteger(-10, 10)
	mousemove.initMouseEvent(
	  'mousemove',
	  true,
	  true,
	  document.defaultView,
	  0,
	  _x,
	  _y,
	  _x,
	  _y,
	  false,
	  false,
	  false,
	  false,
	  0,
	  null
	)
	verifyDialog.dispatchEvent(mousemove)
	//
	await sleep(1000)
	var __x = _x + getRandomInteger(-10, 10)
	var __y = _y + getRandomInteger(-10, 10)
	var mouseup = document.createEvent('MouseEvents')
	mouseup.initMouseEvent(
	  'mouseup',
	  true,
	  true,
	  document.defaultView,
	  0,
	  __x,
	  __y,
	  __x,
	  __y,
	  false,
	  false,
	  false,
	  false,
	  0,
	  null
	)
	verifyDialog.dispatchEvent(mouseup)
	$('.verifyDialog')
	  .click()
	isVerifying = false
  }

  //=======================================================
  async function beginCrack() {
	if (isVerifying) {
	  console.log('isVerifying...')
	  return
	}
	isVerifying = true
	await doMouseDown()
	await doRareMove()
	let isNeedWait = true
	do {
	  console.log('do check isNeedSlide ...')
	  const element = document.querySelector('#img-button>img')
	  // console.log('element:', element)
	  // console.log('verifyType 2:', verifyType)
	  if (element && !!verifyType) {
		verifyType = 0
		doSlide()
		isNeedWait = false
	  }
	  await doMouseDown()
	  await sleep(200)
	} while (isNeedWait)
  }

  async function doSlide() {
	console.log('doSlide...')
	var fullimg_base64 = $('#slider>img')
	  .attr('src')
	var gapimg_base64 = $('#img-button>img')
	  .attr('src')
	if (fullimg_base64 && gapimg_base64) {
	  try {
		const gapOffset = await getOffset2Img()
		// console.log('gapOffset:', gapOffset)
		const padding = await doPost(gapimg_base64, fullimg_base64)
		// console.log('padding:', padding)
		doMove(padding, gapOffset)
	  }
	  catch (e) {
		endCrack()
		setTimeout(() => {
		  beginCrack()
		}, 1000)
	  }
	}
	else {
	  //console.error('没有拿到base64~~~~~~~~~~~')
	  endCrack()
	  setTimeout(() => {
		beginCrack()
	  }, 1000)
	}
  }

  function endCrack() {
	console.log('endCrack')
	isVerifying = false
	doMouseUp()
  }

  function doMouseDown() {
	return new Promise((resolve, reject) => {
	  console.log('doMouseDown')
	  var btn = $('#slide-button')[0]
	  var mousedown = document.createEvent('MouseEvents')
	  var rect = btn.getBoundingClientRect()
	  var x = rect.x + getRandomInteger(0, 2)
	  var y = rect.y + getRandomInteger(-2, 2)
	  mousedown.initMouseEvent(
		'mousedown',
		true,
		true,
		document.defaultView,
		0,
		x,
		y,
		x,
		y,
		false,
		false,
		false,
		false,
		0,
		null
	  )
	  btn.dispatchEvent(mousedown)
	  resolve()
	})
  }

  function doMouseUp() {
	console.log('doMouseUp')
	var btn = $('#slide-button')[0]
	var rect = btn.getBoundingClientRect()
	var x = rect.x + getRandomInteger(0, 2)
	var y = rect.y + getRandomInteger(-2, 2)
	var mouseup = document.createEvent('MouseEvents')
	mouseup.initMouseEvent(
	  'mouseup',
	  true,
	  true,
	  document.defaultView,
	  0,
	  x,
	  y,
	  x,
	  y,
	  false,
	  false,
	  false,
	  false,
	  0,
	  null
	)
	btn.dispatchEvent(mouseup)
  }

  function doPost(gapimg_base64, fullimg_base64) {
	return new Promise((resolve, reject) => {
	  GM_xmlhttpRequest({
		method: 'post',
		url: 'http://127.0.0.1:6699/api/ocr/slider/gap',
		data: JSON.stringify({
		  gapimg_base64: gapimg_base64,
		  fullimg_base64: fullimg_base64
		}),
		headers: {
		  'Content-Type': 'application/json; charset=utf-8'
		},
		dataType: 'json',
		onload: function(res) {
		  if (res.status === 200) {
			const responseData = JSON.parse(res.responseText)
			const padding = responseData.result.target[0]
			resolve(padding)
		  }
		  else {
			//console.log('失败')
			//console.log(res)
			endCrack()
			reject(0)
		  }
		},
		onerror: function(err) {
		  //console.log('error')
		  //console.log(err)
		  endCrack()
		  reject(0)
		}
	  })
	})
  }

  function getOffset2Img() {
	return new Promise((resolve, reject) => {
	  // 步骤1: 加载图片
	  var img = new Image()
	  img.src = $('#img-button>img')
		.attr('src')
	  img.onload = function() {
		// 步骤2: 创建Canvas并绘制图片
		var canvas = document.createElement('canvas')
		canvas.width = img.width
		canvas.height = img.height
		var ctx = canvas.getContext('2d')
		ctx.drawImage(img, 0, 0)
		// 步骤3: 获取像素数据
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		var data = imageData.data
		// 初始化最左边非透明像素点坐标
		var leftMostPixel = {x: -1, y: -1}
		// 步骤4: 遍历每一行，寻找最左边的非透明像素点
		for (var y = 0; y < canvas.height; y++) {
		  for (var x = 0; x < canvas.width; x++) {
			var i = (y * canvas.width + x) * 4
			if (data[i + 3] !== 0) { // 检查alpha通道是否不为0
			  // 如果这是第一个非透明像素点或者比之前记录的更靠左
			  if (leftMostPixel.x === -1 || x < leftMostPixel.x) {
				leftMostPixel = {x: x, y: y}
			  }
			  break // 找到非透明像素点后，跳出内层循环
			}
		  }
		}
		// 打印结果
		if (leftMostPixel.x !== -1) {
		  //console.log('最左边的第一个非透明像素点坐标:', leftMostPixel)
		  resolve(leftMostPixel.x)
		}
		else {
		  //console.log('没有找到非透明像素点')
		  resolve(0)
		}
	  }
	})
  }

  function doRareMove() {
	console.log('doRareMove')
	return new Promise((resolve, reject) => {
	  var btn = $('#slide-button')[0]
	  var rect = btn.getBoundingClientRect()
	  var x = rect.x
	  var y = rect.y
	  var dx = getRandomInteger(-2, 2)
	  var dy = getRandomInteger(-2, 2)
	  var mousemove = document.createEvent('MouseEvents')
	  var _x = x + dx
	  var _y = y + dy
	  mousemove.initMouseEvent(
		'mousemove',
		true,
		true,
		document.defaultView,
		0,
		_x,
		_y,
		_x,
		_y,
		false,
		false,
		false,
		false,
		0,
		null
	  )
	  btn.dispatchEvent(mousemove)
	  resolve()
	})
  }

  function doMove(length, gapOffset) {
	if (!length) {
	  length = 0
	}
	if (length > 230) {
	  length = 130
	}
	doFeedDog()
	console.log('Move:', length, gapOffset)
	var btn = $('#slide-button')[0]
	var rect = btn.getBoundingClientRect()
	var x = rect.x
	var y = rect.y
	var dx = 0
	var dy = 0
	let varible = null
	var sliderLeft = $('#slider')
	  .offset().left
	var targetLeft = $('#img-button > img')
	  .offset().left - sliderLeft
	var targetWidth = $('#img-button > img')
	  .width()

	var distance = length * 203 / 250
	dx = distance / 3 + getRandomInteger(-10, 10)
	var mousemove = document.createEvent('MouseEvents')
	var _x = x + dx + getRandomInteger(0, 2)
	var _y = y + dy + getRandomInteger(-2, 2)

	mousemove.initMouseEvent(
	  'mousemove',
	  true,
	  true,
	  document.defaultView,
	  0,
	  _x,
	  _y,
	  _x,
	  _y,
	  false,
	  false,
	  false,
	  false,
	  0,
	  null
	)
	btn.dispatchEvent(mousemove)

	var interval = setInterval(function() {
	  var mousemove = document.createEvent('MouseEvents')
	  var _x = x + dx + getRandomInteger(0, 2)
	  var _y = y + dy + getRandomInteger(-2, 2)
	  x = _x
	  y = _y
	  //console.log('mousemove:', x,y,dx,dy)

	  mousemove.initMouseEvent(
		'mousemove',
		true,
		true,
		document.defaultView,
		0,
		_x,
		_y,
		_x,
		_y,
		false,
		false,
		false,
		false,
		0,
		null
	  )
	  btn.dispatchEvent(mousemove)
	  var newTargetLeft = $('#img-button > img')
		.offset().left
	  varible = newTargetLeft - sliderLeft + gapOffset
	  //console.log('gapOffset:',gapOffset)
	  //console.log('distance:',distance)
	  //console.log('newTargetLeft:',newTargetLeft)
	  //console.log('sliderLeft:',sliderLeft)
	  //console.log('varible:',varible)
	  var size = varible - distance
	  console.log('size:',size)
	  if (size > -1 && size < 1) {
		doRareMove()
		clearInterval(interval)
		console.log('finish move:',varible , distance)
		endCrack()
		setTimeout(() => {
		  beginCrack()
		}, 1000)
	  }
	  else {
		if (distance > varible) {
		  if (distance - varible < 40) {
			dx = getRandomInteger(0, 4)
		  }
		  else {
			dx = getRandomInteger(8, 16)
		  }
		}
		else {
		  dx = - getRandomInteger(0, 2)
		}
	  }
	}, 30)
  }

  /**
   * 喂狗,防止程序卡死,20s无操作刷新页面
   */
  let dogTime = 0

  function doFeedDog() {
	console.log('doFeedDog')
	dogTime = 0
  }

  setInterval(() => {
	dogTime++
	if (dogTime > 30) {
	  console.log('timeout~~~~~~~~~~~~~~~~')
	  window.location.replace('https://www.temu.com/uk?' + Math.random())
	}
  }, 1000)
})()
