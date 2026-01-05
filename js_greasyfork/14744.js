// ==UserScript==
// @name         [Neko0] 淘宝天猫一键好评
// @description  用于方便地积攒淘气值，以享用高淘气值的低价88VIP等特殊权益来省钱 taobao tmall AI AI评价 AI评语
// @version      1.8.6
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://www.taobao.com/favicon.ico
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://t.me/+URovzRdPTyHlWtQd
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @run-at       document-idle
// @license      AGPL-3.0-or-later
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/solid.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/fontawesome.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js
// @resource     style https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.2.1/automation/taobao/style.css
// @resource     html-n-box https://cdn.jsdelivr.net/gh/nekozero/neko0-web-tools@1.2.1/automation/taobao/n-box.html
// @include      *://rate.taobao.com/*
// @include      *://ratewrite.tmall.com/*
// @include      *://buyertrade.taobao.com/trade*
// @downloadURL https://update.greasyfork.org/scripts/14744/%5BNeko0%5D%20%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/14744/%5BNeko0%5D%20%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==

/** 初始化设定 开始 */
// 默认值
var taobaorate = {
	autorate: false,
	rateMsgListText:
		'很满意的一次购物。真的很喜欢。完全超出期望值。质量非常好。掌柜好人，一生平安。非常满意。与卖家描述的完全一致。发货速度非常快。包装非常仔细、严实。物流公司服务态度很好。运送速度很快。下次有需求还来买。服务周到，态度热情。发货及时，物流很快。各方面都满意。给你全五星好评。',
	autoSort: true,
	autoDel: 3,
	autoPraiseAll: false,
	openaiApiModel: 'gpt-4o-mini',
	openaiApiKey: '',
	geminiApiKey: '',
	aitextCount: 200,
}
// 判断是否存在设定
if (GM_getValue('taobaorate') === undefined) {
	GM_setValue('taobaorate', taobaorate)
} else {
	let store = GM_getValue('taobaorate')
	$.each(taobaorate, function (i) {
		if (store[i] === undefined) {
			store[i] = taobaorate[i]
		}
	})
	GM_setValue('taobaorate', store)
}

const AIUrl = {
	openai: 'https://api.openai.com/v1/chat/completions',
	gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=',
}

/** 初始化设定 结束 */

// 置入Style
GM_addStyle(GM_getResourceText('style'))

// 置入DOM
$('body').append(GM_getResourceText('html-n-box'))

// 绑定点击事件
// 打开设置窗口
$('.n-box .button.switch').click(() => {
	$('.n-box').toggleClass('open')
})
// 提交评语更新
$('.n-box .button.update.rate-msg-list-text').click(() => {
	let store = GM_getValue('taobaorate')
	store.rateMsgListText = $('#rateMsgListText').val()
	GM_setValue('taobaorate', store)
})
// 切换自动打乱排序
$('.n-box .toggle.auto-sort').click(() => {
	$('.auto-sort .on').toggle()
	$('.auto-sort .off').toggle()

	let store = GM_getValue('taobaorate')
	store.autoSort = !store.autoSort
	GM_setValue('taobaorate', store)
})
// 监听字数
$('.word-count').text($('#rateMsgListText').val().length)
$('#rateMsgListText').bind('input propertychange', function () {
	$('.word-count').text($(this).val().length)
})
// 监听删除数
$('#autoDel').bind('input propertychange', function () {
	let store = GM_getValue('taobaorate')
	store.autoDel = $(this).val()
	GM_setValue('taobaorate', store)
})

// Openai ChatGPT api model
console.log('Openai ChatGPT api model', GM_getValue('taobaorate').openaiApiModel)
$('#openaiApiModel').val(GM_getValue('taobaorate').openaiApiModel)
$('#openaiApiModel').bind('input propertychange', function () {
	let store = GM_getValue('taobaorate')
	store.openaiApiModel = $(this).val()
	GM_setValue('taobaorate', store)
	console.log('Openai ChatGPT api model Update', GM_getValue('taobaorate').openaiApiModel)
})
// Openai ChatGPT api key
console.log('Openai ChatGPT api key', GM_getValue('taobaorate').openaiApiKey)
$('#openaiApiKey').val(GM_getValue('taobaorate').openaiApiKey)
$('#openaiApiKey').bind('input propertychange', function () {
	let store = GM_getValue('taobaorate')
	store.openaiApiKey = $(this).val()
	GM_setValue('taobaorate', store)
	console.log('Openai ChatGPT api key Update', GM_getValue('taobaorate').openaiApiKey)
})
// Google Gemini api key
console.log('Google Gemini api key', GM_getValue('taobaorate').geminiApiKey)
$('#geminiApiKey').val(GM_getValue('taobaorate').geminiApiKey)
$('#geminiApiKey').bind('input propertychange', function () {
	let store = GM_getValue('taobaorate')
	store.geminiApiKey = $(this).val()
	GM_setValue('taobaorate', store)
	console.log('Google Gemini api key Update', GM_getValue('taobaorate').geminiApiKey)
})
// 监听AI生成字数数
console.log('监听AI生成字数数', GM_getValue('taobaorate').aitextCount)
$('#aitextCount').val(GM_getValue('taobaorate').aitextCount)
$('#aitextCount').bind('input propertychange', function () {
	let store = GM_getValue('taobaorate')
	store.aitextCount = $(this).val()
	GM_setValue('taobaorate', store)
	console.log('监听AI生成字数数 更新', GM_getValue('taobaorate').aitextCount)
})

// 写入已存储的设置
$('#rateMsgListText').val(GM_getValue('taobaorate').rateMsgListText)
$('#autoDel').val(JSON.parse(GM_getValue('taobaorate').autoDel))
if (JSON.parse(GM_getValue('taobaorate').autoSort)) {
	$('.auto-sort .on').show()
	$('.auto-sort .off').hide()
} else {
	$('.auto-sort .off').show()
	$('.auto-sort .on').hide()
}

/**
 * 数组随机排序并抽取指定数量
 *
 * @param   {array}  arr    要进行处理的数组
 * @param   {string}  count  最终输出结果的个数
 *
 * @return  {array}         输出处理后的数组
 */
function getRandomArrayElements(arr, count) {
	var shuffled = arr.slice(0),
		i = arr.length,
		min = i - count,
		temp,
		index
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random())
		temp = shuffled[index]
		shuffled[index] = shuffled[i]
		shuffled[i] = temp
	}
	return shuffled.slice(min)
}

/**
 * 对评语进行处理
 *
 * @return  {string}  返回处理过的评语内容
 */
function processedText() {
	var text = GM_getValue('taobaorate').rateMsgListText
	console.log(text)
	var autoDel = JSON.parse(GM_getValue('taobaorate').autoDel)
	// 随机排序评语
	if (JSON.parse(GM_getValue('taobaorate').autoSort)) {
		var arr = text.split('。')
		var count = autoDel ? arr.length - autoDel : arr.length // 随机删除评语个数设定
		text = getRandomArrayElements(arr, count).join(' ')
	}
	return text
}

var host = window.location.host
var isTB = host === 'rate.taobao.com'
var isTM = host === 'ratewrite.tmall.com'
var isList = host === 'buyertrade.taobao.com'

// 淘宝一键好评
function taobaoStar() {
	var tbGoodRate = document.querySelectorAll('.good-rate')
	for (var i = 0, a; (a = tbGoodRate[i++]); ) {
		a.click()
	}
	var tbStar = document.querySelectorAll('.rate-stars label')
	var tbStarGroup = tbStar.length / 5
	for (let i = 1; i < tbStarGroup + 1; i++) {
		let num = i * 5 - 1
		document.querySelectorAll('.rate-stars label')[num].childNodes[0].click()
	}
}

function taobaoMsg() {
	var tbRateMsg = document.querySelectorAll('.rate-msg')
	for (var i = 0, a; (a = tbRateMsg[i++]); ) {
		// 写入评价
		a.value = processedText()
	}
}

async function taobaoMsg_AI() {
	if (!GM_getValue('taobaorate').openaiApiKey) {
		alert('OpenAI key is missing')
		return
	}
	var headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + GM_getValue('taobaorate').openaiApiKey,
	}
	var tbRateMsg = document.querySelectorAll('.rate-msg')
	if (document.querySelector('.item-title a')) {
		//首评
		var tbTitle = document.querySelectorAll('.item-title a')
	} else if (document.querySelector('.item-info h3 a')) {
		//追评
		var tbTitle = document.querySelectorAll('.item-info h3 a')
	}
	for (var i = 0; i < tbRateMsg.length; i++) {
		// 评价商品
		var response = await axios
			.post(
				AIUrl.openai,
				{
					model: GM_getValue('taobaorate').openaiApiModel,
					max_tokens: 200,
					messages: [
						{
							role: 'user',
							content: tbTitle[i].textContent.trim() + '\n\n写出商品评价。简短、口语化',
						},
					],
				},
				{
					headers: headers,
				}
			)
			.then(response => {
				tbRateMsg[i].value = response.data.choices[0].message.content.trim()
			})
			.catch(error => {
				console.log(error.response.data.error.message)
				alert(error.response.data.error.message)
				return 404
			})
	}
}

// 只处理Gimini相关调用进行文字生成
async function Gemini(aitext_commit) {
	const GeminiApiKey = GM_getValue('taobaorate').geminiApiKey
	if (!GeminiApiKey) {
		alert('Gemini key is missing')
		return false
	}

	var headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + GeminiApiKey,
	}
	const url = AIUrl.gemini + GeminiApiKey

	// Data
	const data = {
		safetySettings: [
			{
				category: 'HARM_CATEGORY_HATE_SPEECH',
				threshold: 'BLOCK_NONE',
			},
			{
				category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
				threshold: 'BLOCK_NONE',
			},
			{
				category: 'HARM_CATEGORY_HARASSMENT',
				threshold: 'BLOCK_NONE',
			},
			{
				category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
				threshold: 'BLOCK_NONE',
			},
		],
		contents: [
			{
				role: 'user',
				parts: [{ text: aitext_commit }],
			},
		],
	}
	// 评价商品
	var response = await axios
		.post(url, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(response => {
			ai_res = response.data.candidates[0].content.parts[0].text
			return ai_res
		})
		.catch(error => {
			console.log(error.response.data.error.message)
			alert(error.response.data.error.message)
			return 404
		})
	return response
}

// 只处理Taobao相关页面中逻辑
async function Msg_Gemini() {
	const GeminiApiKey = GM_getValue('taobaorate').geminiApiKey
	if (!GeminiApiKey) {
		alert('Gemini key is missing')
		return false
	}

	// 商品名
	var product_name = ''
	if (isTB) {
		var tbTitle = ''
		if (document.querySelector('.item-title a')) {
			//首评
			tbTitle = document.querySelectorAll('.item-title a')
		} else if (document.querySelector('.item-info h3 a')) {
			//追评
			tbTitle = document.querySelectorAll('.item-info h3 a')
		}
		product_name = tbTitle[i].textContent.trim()
	} else if (isTM) {
		product_name = document.querySelector('.ui-form-label h3').textContent.trim()
	}

	// 字数
	const aitext_count = GM_getValue('taobaorate').aitextCount

	// 分别处理评价
	if (isTB) {
		// 提示词
		const aitext_commit = `写一份关于网购买到的 “${product_name}” 的${aitext_count}字好评`

		var tbRateMsg = document.querySelectorAll('.rate-msg')
		for (var i = 0; i < tbRateMsg.length; i++) {
			// 检测已经填写过的就跳过
			if (!tbRateMsg[i].value) {
				const result = await Gemini(aitext_commit)
				console.log(result)
				if (result !== 404) {
					// 评价商品
					tbRateMsg[i].value = result
				}
			}
		}
	} else if (isTM) {
		// 提示词
		var aitext_commit
		if (document.querySelector('.J_rateItem')) {
			aitext_commit = `写一份关于网购买到的 “${product_name}” 的口语化好评。分别写出${aitext_count}字的商品评价和${aitext_count}字的服务评价。商品评价写完后再写服务评价，商品评价与服务评价之间一定要用|间隔！一定要用|间隔！一定要用|间隔！`
		} else {
			aitext_commit = `写一份关于网购买到的 “${product_name}” 的${aitext_count}字的一段时间使用后的追评好评`
		}

		const result = await Gemini(aitext_commit)
		console.log(result)
		if (result !== 404) {
			// 评价商品
			var rate_content = result.replace(/[\n*]/g, '').split('|')
			console.log(rate_content)
			if (document.querySelector('.J_rateItem')) {
				//首评
				document.querySelector('.J_rateItem').value = rate_content[0].replace('商品评价：', '').trim()
				document.querySelector('.J_rateService').value = rate_content[1].replace('服务评价：', '').trim()
			} else if (document.querySelector('.ap-ct-textinput textarea')) {
				//追评
				document.querySelector('.ap-ct-textinput textarea').value = result
			}
		}
	}

	return 202
}

async function taobaoMsg_Gemini() {
	const GeminiApiKey = GM_getValue('taobaorate').geminiApiKey
	if (!GeminiApiKey) {
		alert('Gemini key is missing')
		return false
	}
	var headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + GeminiApiKey,
	}
	// 回复框
	var tbRateMsg = document.querySelectorAll('.rate-msg')

	const url = AIUrl.gemini + GeminiApiKey
	const aitext_count = GM_getValue('taobaorate').aitextCount

	// 商品名
	if (document.querySelector('.item-title a')) {
		//首评
		var tbTitle = document.querySelectorAll('.item-title a')
	} else if (document.querySelector('.item-info h3 a')) {
		//追评
		var tbTitle = document.querySelectorAll('.item-info h3 a')
	}

	for (var i = 0; i < tbRateMsg.length; i++) {
		// 检测已经填写过的就跳过
		if (!tbRateMsg[i].value) {
			// 商品名
			const product_name = tbTitle[i].textContent.trim()
			// Data
			const data = {
				contents: [
					{
						role: 'user',
						parts: [{ text: `写一份关于网购买到的 “${product_name}” 的${aitext_count}字好评` }],
					},
				],
			}
			// 评价商品
			var response = await axios
				.post(url, data, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
				.then(response => {
					console.log(response.data.candidates[0].content.parts[0].text)
					ai_res = response.data.candidates[0].content.parts[0].text

					// 评价商品
					tbRateMsg[i].value = ai_res
				})
				.catch(error => {
					console.log(error.response.data.error.message)
					alert(error.response.data.error.message)
					return 404
				})
		}
	}
	return 202
}

function taobaoFun() {
	let elemStar = `<div class="submitboxplus">
        <div class="tb-btn star">一键满星</div>
        <div class="tb-btn msg">一键评语</div>
        <div class="tb-btn starmsg">一键满星+评语</div>
        <div class="tb-btn haoping">一键提交好评</div>
    </div>
	<div class="submitboxplusai">
		<div class="tb-btn msg-ai">ChatGPT评语</div>
		<div class="tb-btn msg-gemini">Gemini评语</div>
		<div class="tb-btn haoping-ai">一键满星AI好评</div>
    </div>
	`
	$('.submitbox').after(elemStar)
	$('.tb-btn.star').click(() => {
		taobaoStar()
	})
	$('.tb-btn.msg').click(() => {
		taobaoMsg()
	})
	$('.tb-btn.starmsg').click(() => {
		taobaoMsg()
		taobaoStar()
	})
	$('.tb-btn.haoping').click(() => {
		taobaoMsg()
		taobaoStar()
		setTimeout(() => {
			$('.submitbox [type="submit"]').click()
		}, 500)
	})

	$('.tb-btn.msg-ai').click(() => {
		taobaoMsg_AI()
	})
	$('.tb-btn.msg-gemini').click(() => {
		taobaoMsg_Gemini()
	})

	$('.tb-btn.haoping-ai').click(async () => {
		const result = await taobaoMsg_Gemini()
		console.log(result)

		if (result === 202) {
			taobaoStar()
			setTimeout(() => {
				$('.submitbox [type="submit"]').click()
			}, 500)
		}
	})
}

// 天猫一键好评
function tmallStar() {
	var tmStar = document.querySelectorAll('[data-star-value="5"]')
	for (var i = 0, a; (a = tmStar[i++]); ) {
		a.click()
	}
}

function tmallMsg() {
	// 写入评价
	let textInputer
	if (document.querySelector('.J_textInput')) textInputer = document.querySelectorAll('.J_textInput')
	if (document.querySelector('.J_textEditorContent')) textInputer = document.querySelectorAll('.J_textEditorContent')
	if (document.querySelector('.J_textInput').shadowRoot) {
		if (document.querySelector('.J_textInput').shadowRoot.querySelector('#textEditor').shadowRoot) {
			textInputer = document
				.querySelector('.J_textInput')
				.shadowRoot.querySelector('#textEditor')
				.shadowRoot.querySelectorAll('#textEl')
		}
	}
	for (var i = 0, a; (a = textInputer[i++]); ) {
		a.value = processedText()
	}
}

async function tmallMsg_AI() {
	if (!GM_getValue('taobaorate').openaiApiKey) {
		alert('OpenAI key is missing')
		return
	}
	var headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + GM_getValue('taobaorate').openaiApiKey,
	}
	// 评价商品
	var response = await axios
		.post(
			AIUrl.openai,
			{
				model: GM_getValue('taobaorate').openaiApiModel,
				max_tokens: 200,
				messages: [
					{
						role: 'user',
						content:
							document.querySelector('.ui-form-label h3').textContent.trim() +
							'\n\n分别写出商品评价和服务评价，用|间隔。简短、口语化',
					},
				],
			},
			{
				headers: headers,
			}
		)
		.then(response => {
			var rate_content = response.data.choices[0].message.content.split('|')
			if (document.querySelector('.J_rateItem')) {
				//首评
				document.querySelector('.J_rateItem').value = rate_content[0].replace('商品评价：', '').trim()
				document.querySelector('.J_rateService').value = rate_content[1].replace('服务评价：', '').trim()
			} else if (document.querySelector('.ap-ct-textinput textarea')) {
				//追评
				document.querySelector('.ap-ct-textinput textarea').value = rate_content[0]
					.replace('商品评价：', '')
					.trim()
			}
		})
		.catch(error => {
			console.log(error.response.data.error.message)
			alert(error.response.data.error.message)
			return 404
		})
}

function tmallFun() {
	let elemStar = `<div class="submitboxplus">
        <div class="tm-btn star">一键满星</div>
        <div class="tm-btn msg">一键评语</div>
        <div class="tm-btn starmsg">一键满星+评语</div>
        <div class="tm-btn haoping">一键提交好评</div>
		<br />
        <div class="tm-btn msg-ai">ChatGPT评语</div>
        <div class="tm-btn msg-gemini">Gemini评语</div>
        <div class="tm-btn haoping-ai">一键提交AI好评</div>
    </div>`
	$('.compose-submit').after(elemStar)
	$('.tm-btn.star').click(() => {
		tmallStar()
	})
	$('.tm-btn.msg').click(() => {
		tmallMsg()
	})
	$('.tm-btn.msg-ai').click(() => {
		tmallMsg_AI()
	})
	$('.tm-btn.msg-gemini').click(() => {
		Msg_Gemini()
	})
	$('.tm-btn.starmsg').click(() => {
		tmallMsg()
		tmallStar()
	})
	$('.tm-btn.haoping').click(() => {
		tmallMsg()
		tmallStar()
		setTimeout(() => {
			$('.compose-btn [type="submit"]').click()
		}, 500)
	})
	$('.tm-btn.haoping-ai').click(async () => {
		const result = await Msg_Gemini()
		console.log(result)

		if (result === 202) {
			tmallStar()
			setTimeout(() => {
				$('.compose-btn [type="submit"]').click()
			}, 500)
		}
	})
}

// 自动执行Function
let autorate = () => {
	// 判断开启才执行
	if (GM_getValue('taobaorate').autorate) {
		setTimeout(function () {
			$('.submitboxplus .haoping')[0].click()
			// 关闭自动执行开关
			let store = GM_getValue('taobaorate')
			store.autorate = false
			GM_setValue('taobaorate', store)
		}, 2000)
		setTimeout(() => {
			open(location, '_self').close()
		}, 4000)
	}
}

function test(i) {}

// 判断页面后添加对应页面元素
if (isList) {
	// 单个好评按钮
	$("a[class^='button-']:contains('评价')").each(function () {
		let dom = `<a href="javascript:;" class="list-auto-btn">一键好评</a>`
		$(this).parent().append(dom)
		// console.log($(this).attr('href'))
	})
	$("a:contains('一键好评')").each(function () {
		$(this).click(function () {
			// 打开自动执行开关
			let store = GM_getValue('taobaorate')
			store.autorate = true
			GM_setValue('taobaorate', store)
			// 跳转页面
			setTimeout(() => {
				window.open($(this).prev().attr('href'), '_blank')
			}, 300)
		})
	})
	/** 全体好评按钮 开始 */
	function getQueryVariable(variable) {
		var query = window.location.search.substring(1)
		var vars = query.split('&')
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=')
			if (pair[0] == variable) {
				return pair[1]
			}
		}
		return false
	}
	let autoPraiseAllOn = function () {
		let store = GM_getValue('taobaorate')
		store.autoPraiseAll = true
		GM_setValue('taobaorate', store)
	}
	let autoPraiseAllOff = function () {
		let store = GM_getValue('taobaorate')
		store.autoPraiseAll = false
		GM_setValue('taobaorate', store)
	}
	// 判断是否在待评价列表
	if (getQueryVariable('tabCode') === 'waitRate') {
		// 判断是否有待评价商品
		if ($('.list-auto-btn').length < 1) {
			autoPraiseAllOff()
			return false
		}
		// 判断是否已开启开关
		if (!GM_getValue('taobaorate').autoPraiseAll) {
			/** 未开启 */
			// 置入DOM
			$(`div[class^='simple-pagination-mod__container']`).prepend(
				'<button class="button-auto-praise-all">一键自动全部好评</button>'
			)
			// 绑定Event
			$('.button-auto-praise-all').click(() => {
				// 开启全自动执行
				autoPraiseAllOn()
				// 刷新页面
				$("span:contains('待评价')")[0].click()
			})
		} else {
			/** 已开启 */
			// 置入取消按钮
			let dom = `<div class="fully-automatic-praise"><span class="cancel">停止自动执行</span></div>`
			$('body').append(dom)
			// 绑定Event
			$('.fully-automatic-praise .cancel').click(() => {
				// 关闭全自动执行
				autoPraiseAllOff()
				// 刷新页面
				$("span:contains('待评价')")[0].click()
			})
			// 执行好评
			$.each($('.list-auto-btn'), function (i, el) {
				setTimeout(function () {
					$(el).click()
				}, i * 10000)
			})
			setTimeout(function () {
				// 刷新页面
				$("span:contains('待评价')")[0].click()
			}, ($('.list-auto-btn').length + 1) * 10000)
		}
	}
	/** 全体好评按钮 结束 */
} else if (isTB) {
	taobaoFun()
	autorate()
} else if (isTM) {
    new MutationObserver((_, observer) => {
        const haoping = document.querySelector('.haoping');
        if (!haoping) {
            tmallFun();
            autorate();
        } else {
            observer.disconnect();
        }
    }).observe(document.body, { childList: true, subtree: true });
}