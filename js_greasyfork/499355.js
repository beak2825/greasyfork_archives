// ==UserScript==
// @name         自动翻译，选中自动翻译，Auto Translate My Word
// @namespace    http://github.com./xygodcyx/
// @version      1.1.3
// @description  选中自动翻译! Auto Translate
// @author       XyGod
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlhttpRequest
// @grant       GM_getResourceText
// @connect     dict.youdao.com
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addElement
// @grant       GM.addElement
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM.addStyle
// @grant       GM_openInTab
// @grant       GM.openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499355/%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%EF%BC%8C%E9%80%89%E4%B8%AD%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%EF%BC%8CAuto%20Translate%20My%20Word.user.js
// @updateURL https://update.greasyfork.org/scripts/499355/%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%EF%BC%8C%E9%80%89%E4%B8%AD%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%EF%BC%8CAuto%20Translate%20My%20Word.meta.js
// ==/UserScript==

;(function () {
	;('use strict')

	let selectText = ''

	/**
	 * wordCardDom
	 * @type {HTMLDivElement} wordCardDom - wordCardDom
	 */
	let wordCardWrapDom = null

	/**
	 * @enum {any} wordStatus
	 */
	const WordStatus = {
		UNKNOWN: 'UNKNOWN',
		UNSKILLED: 'UNSKILLED',
		FAMILIAR: 'FAMILIAR',
	}

	/**
	 * @typedef {Object} WordType
	 * @property {number} id
	 * @property {string} text
	 * @property {string} translate
	 * @property {boolean} isLike
	 * @property {string} type
	 * @property {WordStatus} wordStatus
	 * @property {number} searchCount
	 * @property {number} addDate
	 */

	let isCardExist = false
	let currentWordCard = null
	let isWordCardShow = false

	let isMouseDown = false
	let isMouseUp = false
	let isSelectionchange = false
	let isMouseEnterWordCardWrap = false
	let isMouseLevelWordCardWrap = false
    let enableTranslate = false
    function isEnglishWebsite() {
        // 检查 HTML lang 属性，只有英文网页才显示翻译
        const htmlLang = document.documentElement.lang.toLowerCase();
        if (htmlLang.startsWith('en')) {
            return true;
        }

        // 获取可见文本
        const visibleText = document.body.innerText;

        // 英文常用词列表
        const commonEnglishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I'];

        // 计算常用英文词的出现次数
        const wordCounts = commonEnglishWords.map(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            return (visibleText.match(regex) || []).length;
        });

        // 如果至少有5个常用英文词出现了3次以上，认为是英文网站
        const englishWordThreshold = wordCounts.filter(count => count > 3).length >= 5;

        // 检查非英文字符的比例
        const nonEnglishChars = visibleText.replace(/[a-zA-Z\s\d.,!?;:'"()]/g, '').length;
        const totalChars = visibleText.length;
        const nonEnglishRatio = nonEnglishChars / totalChars;

        return englishWordThreshold && nonEnglishRatio < 0.2;
    }
    function isEnglishContent(text){
        const htmlLang = document.documentElement.lang.toLowerCase();
        if (htmlLang.startsWith('en')) {
            return true; // 英文网站直接返回true
        }
        // 检查是否包含中文字符
        const hasChinese = /[\u4e00-\u9fa5]/g.test(text);

        return !hasChinese
    }
    function isWebLink(text){
        const hasLink = /\b[a-zA-Z][a-zA-Z0-9+\-.]*:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?\b/g.test(text);
        return hasLink
    }

    // 检测网站语言，2024/11/11更新为检测选中的文本是否主要以英文为主
    // const isEnglish = isEnglishWebsite();


	init()
	async function init() {
		return new Promise(async (resolve, reject) => {
			await createWordCard()
			// await deleteAllWord();
			await getWords()
			resolve()
			initDoms()
			hideWordCard()
			if (typeof GM_getResourceText !== 'undefined') {
				addStyle()
			}
            document.addEventListener('keydown',(e)=>{
                if(e.key === 'Control'){
                    enableTranslate = true
                }
            })
            document.addEventListener('keyup',(e)=>{
                if(e.key === 'Control'){
                    enableTranslate = false
                }
            })
			document.addEventListener('pointerdown', () => {
				isMouseDown = true
				isMouseUp = false
				isSelectionchange = false
			})
			
			document.addEventListener('pointerup', () => {
                if(!enableTranslate){
                    return
                }
				isMouseUp = true
				isMouseDown = false
				if (
					isSelectionchange &&
					!isMouseEnterWordCardWrap &&
					selectText &&
					!isWordCardShow
				) {
                    if(!isEnglishContent(selectText)) return
                    if(isWebLink(selectText)) return
					wordInfo.text = selectText
					sendTranslateRequest()
				}
				isSelectionchange = false
			})

			document.addEventListener('selectionchange', (e) => {
				isSelectionchange = true
				if (isMouseEnterWordCardWrap) {
					return
				}
				selectText = document.getSelection().toString().trim()
			})

			let timeout = null
			wordCardWrapDom.addEventListener('mouseleave', (e) => {
				isMouseLevelWordCardWrap = true
				isMouseEnterWordCardWrap = false
				// timeout = setTimeout(() => {
				// 	hideWordCard()
				// }, 300)
			})
			wordCardWrapDom.addEventListener('touchleave', (e) => {
				isMouseLevelWordCardWrap = true
				isMouseEnterWordCardWrap = false
				// timeout = setTimeout(() => {
				// 	hideWordCard()
				// }, 300)
			})

			wordCardWrapDom.addEventListener('mouseenter', (e) => {
				isMouseEnterWordCardWrap = true
				isMouseLevelWordCardWrap = false
			})
			wordCardWrapDom.addEventListener('touchenter', (e) => {
				isMouseEnterWordCardWrap = true
				isMouseLevelWordCardWrap = false
			})

			document.addEventListener('pointerdown', () => {
				if (isMouseLevelWordCardWrap && isWordCardShow) {
					hideWordCard()
				}
			})

			resolve(true)
		})
	}

	async function sendTranslateRequest() {
		hideWordCard()
		const curtime = Math.round(new Date().getTime() / 1000)
		const dev_url = 'http://127.0.0.1:3000/translate'
		const product_url = 'http://93mqvi.natappfree.cc/translate'
		const dict_translate_api = `https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4&time=${curtime}`
		const dev = false
		const use_fetch = false
		if (!use_fetch && typeof GM.xmlHttpRequest !== 'undefined') {
			const response = await GM.xmlHttpRequest({
				method: 'POST',
				url: dev ? dev_url : dict_translate_api,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json, text/plain, */*',
					'Accept-Encoding': 'gzip, deflate, br, zstd',
					'Accept-Language': 'zh-TW,zh-CN;q=0.9,zh;q=0.8,en;q=0.7',
					'Host': 'dict.youdao.com',
					'Origin': 'https://m.youdao.com',
					'Referer': 'https://m.youdao.com/',
					'Sec-Ch-Ua':
						'"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
					'Sec-Ch-Ua-Mobile': '?0',
					'Sec-Ch-Ua-Platform': 'Windows',
					'Sec-Fetch-Dest': 'empty',
					'Sec-Fetch-Mode': 'cors',
					'Sec-Fetch-Site': 'same-site',
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
				},
				responseType: 'json',
				data: `q=${wordInfo.text.toString(
					'utf-8'
				)}&keyfrom=webdict&le=en&t=1&sign=${Math.random()
					.toString(32)
					.substring(2)}`,
			})
			if (typeof response.responseText === 'undefined') {
				console.log('没有response.responseText数据')
				return
			}
			const result_data = JSON.parse(response.responseText)

			const data = result_data
			if (typeof data.meta === 'undefined') {
				console.log('没有翻译的data.meta数据')
				return
			}
			if (data.meta.dicts.includes('fanyi')) {
				//长文本(句子、段落等)
				changeWordCard2Sentence(data)
			} else {
				if (data.meta.dicts.includes('individual')) {
					// 单词
					changeWordCard2Word(data)
				} else if (data.meta.dicts.includes('ec')) {
					// 短语
					changeWordCard2Phrase(data)
				} else if (data.meta.dicts.includes('ce')) {
					// 其他
					changeWordCard2Other(data)
				} else {
					// 实在翻译不了了
					changeWordCard2UnTranslate()
				}
			}
			updateWordCardPosition(e)
			setTimeout(() => {
				showWordCard()
			}, 10)
		} else {
			const response = await fetch(dict_translate_api, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json',
					'Cookie':
						'STUDY_SESS="Bbh2lGBArp6SJUZHXlNv4gCTLwFnKCu7iLzNhoLH88wVT0+B0jIfaCu/K/p0YDk0EmfMUL5Qe8HbDzKg+1n4PPvDZpOz6ClYUc8Nkjshdp9U+sOJaP43JEQWtXJ2/69cM2Z5bsvligfW0aAAh/IMF4mpquiwVkIRzMFhxl7qKpYLhur2Nm2wEb9HcEikV+3FTI8+lZKyHhiycNQo+g+/oA=="; STUDY_INFO="yd.c2a5a6cd016740b5a@163.com|8|1463763113|1689432695932"; DICT_SESS=v2|zZZCECT_LyUlOfpy6LOGRlM0LlEk4qK0z50MwLnLqB0P40fkWOMkY0gz6LJBRHQL0PBRLPykLpuROlOL64k4q40e4kMYfO4O50; DICT_LOGIN=1||1689432695987; OUTFOX_SEARCH_USER_ID_NCOO=466487302.8125763; OUTFOX_SEARCH_USER_ID=-197975799@52.195.225.91; JSESSIONID=abchQfUhHhWF1dW8bDFbz; UM_distinctid=19069a67c91819-068c9f74d0b3a1-26001b51-1fa400-19069a67c92e6c; NTES_YD_SESS=99Gol5E6Cpd5fh4AV9XS2Qcb4lKcQsg1QHjsQOvgQ0mX_q13_H8IY.HI.2ifxS.vWYMrec96ulTGV05.Cr1P4cNlrWpoRhhhFQPOUzkkVbcocS_EUQ75TNe4nKSOLTqdGuX99NvvF2ggODRFbvvQqhHdEmKX_HnQFD_CjCWAWx3QgacB2oJ815YD4a9aK9OJrp0POEwrtCUOg1lYGu8r0Xwft2DbXUb3BxUGAugYeTlLT; S_INFO=1719759677|0|0&60##|13145495910; P_INFO=13145495910|1719759677|1|youdao_zhiyun2018|00&99|null&null&null#jix&360400#10#0#0|&0||13145495910',
				},
				body: {
					q: wordInfo.text,
					keyfrom: 'webdict',
					le: 'en',
					t: 1,
					client: 'web',
					sign: '96eea02156f165866c59ad446fcfa7ed',
				},
			})
		}
	}
	function changeWordCard2Sentence(data) {
		hideWordTextAndType()
		wordInfo.translate = data.fanyi.tran
		doms.word_translate.textContent = wordInfo.translate
	}
	function changeWordCard2Word(data) {
		wordInfo.translate = getTranslateWordStr(true)
		wordInfo.type = getTranslateWordType()
		doms.word_translate.innerHTML = wordInfo.translate
		doms.word_type.textContent = wordInfo.type
		showWordTextAndType()
		function getTranslateWordType() {
			let result = ''
			const types = []
			data.individual.trs.forEach((tr) => {
				types.push(tr.pos)
			})

			result = [...new Set(types)].join('/')
			return result
		}
		function getTranslateWordStr(html = false) {
			let result = ''
			const translates = []
			data.individual.trs.forEach((tr) => {
				translates.push(`${tr.pos}${tr.tran}`)
			})
			result = html ? translates.join('<br>') : translates.join(' ')
			return result
		}
	}

	function changeWordCard2Phrase(data) {
		hideWordTextAndType()
		try {
			wordInfo.translate = data.ec.web_trans.flat().join('/')
			doms.word_translate.innerText = wordInfo.translate
		} catch (err) {
			doms.word_translate.innerText = wordInfo.text
		}
	}
	function changeWordCard2Other(data) {
		hideWordTextAndType()
		wordInfo.translate = data.ce.word.trs[0]['#text']
		doms.word_translate.innerText = wordInfo.translate
	}
	function changeWordCard2UnTranslate() {
		hideWordTextAndType()
		wordInfo.translate = '暂无翻译'
		doms.word_translate.innerText = wordInfo.translate
	}
	function hideWordTextAndType() {
		doms.word_text.style.display = 'none'
		doms.word_type.style.display = 'none'
	}
	function showWordTextAndType() {
		doms.word_text.style.display = 'inline'
		doms.word_type.style.display = 'inline'
	}

	/**
	 * @typedef {Object} DomsType
	 * @property {HTMLElement} word_type
	 * @property {HTMLElement} word_text
	 * @property {HTMLElement} like_btn
	 * @property {HTMLElement} unlike_btn
	 * @property {HTMLElement} word_translate
	 * @property {HTMLElement} wordCard_wrap
	 */

	/**
	 * doms
	 * @type {DomsType} doms - doms
	 */
	let doms = {
		word_type: null,
		word_text: null,
		like_btn: null,
		unlike_btn: null,
		word_translate: null,
		wordCard_wrap: null,
	}
	async function initDoms() {
		return new Promise(async (resolve, reject) => {
			if (!wordCardWrapDom) {
				await createWordCard()
			}
			if (!wordCardWrapDom) {
				throw new Error('wordCardDom is null')
			}
			doms.like_btn = wordCardWrapDom.querySelector(
				'.XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_setting_card .XyGod_AutoTranslate_like_wrap .XyGod_AutoTranslate_like_btn'
			)
			doms.unlike_btn = wordCardWrapDom.querySelector(
				'.XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_setting_card .XyGod_AutoTranslate_like_wrap  .XyGod_AutoTranslate_unlike_btn'
			)
			doms.word_translate = wordCardWrapDom.querySelector(
				'.XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_translate_card .XyGod_AutoTranslate_word_translate'
			)
			doms.word_type = wordCardWrapDom.querySelector(
				'.XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_origin_card .XyGod_AutoTranslate_word_type'
			)
			doms.word_text = wordCardWrapDom.querySelector(
				'.XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_origin_card .XyGod_AutoTranslate_word_text'
			)
			doms.wordCard_wrap = wordCardWrapDom.querySelector(
				'.XyGod_AutoTranslate_wordCard_wrap'
			)
			doms.like_btn.addEventListener('click', () => {
				like()
			})
			doms.unlike_btn.addEventListener('click', () => {
				unlike()
			})
			resolve(true)
		})
	}
	/**
	 * e
	 * @type {MouseEvent} e - e
	 */
	let e = null

	/**
	 * @typedef {Object} WordCardPositionType
	 * @property {number} left
	 * @property {number} top
	 */

	function createWordCard() {
		return new Promise((resolve, reject) => {
			try {
				const wordCardHtmlStr = `
                <div class="XyGod_AutoTranslate_wordCard_wrap">
                    <div class="XyGod_AutoTranslate_setting_card">
                        <div class="XyGod_AutoTranslate_like_wrap">
                            <div class="XyGod_AutoTranslate_like_btn XyGod_AutoTranslate_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                    <path fill="currentColor"
                                        d="M22.5 5c-2.892 0-5.327 1.804-6.5 2.854C14.827 6.804 12.392 5 9.5 5C5.364 5 2 8.364 2 12.5c0 2.59 2.365 4.947 2.46 5.041L16 29.081l11.534-11.534C27.635 17.447 30 15.09 30 12.5C30 8.364 26.636 5 22.5 5" />
                                </svg>
                            </div>
                            <div class="XyGod_AutoTranslate_hide XyGod_AutoTranslate_unlike_btn XyGod_AutoTranslate_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                    <path fill="currentColor"
                                        d="M9.5 5C5.363 5 2 8.402 2 12.5c0 1.43.648 2.668 1.25 3.563a9.25 9.25 0 0 0 1.219 1.468L15.28 28.375l.719.719l.719-.719L27.53 17.531S30 15.355 30 12.5C30 8.402 26.637 5 22.5 5c-3.434 0-5.645 2.066-6.5 2.938C15.145 7.066 12.934 5 9.5 5m0 2c2.988 0 5.75 2.906 5.75 2.906l.75.844l.75-.844S19.512 7 22.5 7c3.043 0 5.5 2.496 5.5 5.5c0 1.543-1.875 3.625-1.875 3.625L16 26.25L5.875 16.125s-.484-.465-.969-1.188C4.422 14.216 4 13.274 4 12.5C4 9.496 6.457 7 9.5 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="XyGod_AutoTranslate_origin_card XyGod_AutoTranslate_card">
                        <span class="XyGod_AutoTranslate_word_type"></span>
                        <span class="XyGod_AutoTranslate_word_text"></span>
                    </div>
                    <div class="XyGod_AutoTranslate_translate_card XyGod_AutoTranslate_card">
                        <p class="XyGod_AutoTranslate_word_translate">
                        </p>
                    </div>
                    <div class="XyGod_AutoTranslate_more"></div>
                    </div>
                                    `
				wordCardWrapDom = document.createElement('div')
				wordCardWrapDom.classList.add('XyGod_AutoTranslate_WordWrap')
				wordCardWrapDom.id = 'XyGod_AutoTranslate_WordWrap'
				wordCardWrapDom.innerHTML = wordCardHtmlStr
				document.body.appendChild(wordCardWrapDom)
				resolve(true)
				window.addEventListener('mousemove', (event) => {
					e = event
					// updateWordCardPosition(e)
				})
			} catch (err) {
				reject(err)
			}
		})
	}

	/**
	 * @typedef {Object} WordInfo
	 * @property {string} text
	 * @property {string} translate
	 * @property {boolean} isLike
	 * @property {string} type
	 * @property {WordCardPositionType} wordCardPosition
	 * @property {string} searchCount
	 */

	/**
	 * wordInfo
	 * @type {WordInfo} wordInfo - wordInfo
	 */
	const wordInfo = {
		id: '',
		text: '',
		translate: '',
		isLike: false,
		type: '',
		wordCardPosition: {
			left: 0,
			top: 0,
		},
		searchCount: 0,
	}

	/**
	 * updateWordCard
	 * @param {WordInfo} wordInfo - wordInfo
	 * @param {MouseEvent} e - e
	 */
	function updateWordCardPosition(e) {
		if (!wordCardWrapDom) {
			return
		}
		// 计算菜单的位置
		// var width = wordCardWrapDom.clientHeight
		wordCardWrapDom.classList.remove('XyGod_AutoTranslate_hide')
		var width = wordCardWrapDom.clientWidth
		var height = wordCardWrapDom.clientHeight

		var mouseX = e.clientX
		var mouseY = e.clientY

		// 检查菜单是否超出右边界
		if (mouseX + width > window.innerWidth) {
			mouseX = window.innerWidth - width
		}
		if (mouseX < 0) {
			mouseX = 0
		}

		// 检查菜单是否超出底部边界
		if (mouseY + height > window.innerHeight) {
			mouseY = window.innerHeight - height
		}
		if (mouseY < 0) {
			mouseY = 0
		}

		//console.log('width', width)
		//console.log('height', height)
		//console.log('mouseX', mouseX)
		//console.log('mouseY', mouseY)
		// 设置菜单的位置
		wordInfo.wordCardPosition.left = mouseX
		wordInfo.wordCardPosition.top = mouseY

		wordCardWrapDom.style.left = +wordInfo.wordCardPosition.left + 'px'
		wordCardWrapDom.style.top = +wordInfo.wordCardPosition.top + 'px'
		wordCardWrapDom.classList.add('XyGod_AutoTranslate_hide')
		// wordCardWrapDom.style.transform = `translateX(${+wordInfo
		// 	.wordCardPosition.left}px) translateY(${+wordInfo.wordCardPosition
		// 	.top}px)`
	}
	async function showWordCard() {
		if (wordCardWrapDom) {
			wordCardWrapDom.classList.remove('XyGod_AutoTranslate_hide')
			isWordCardShow = true
			doms.word_text.textContent = wordInfo.text

			const word = getWordInWords(wordInfo.text)
			if (word) {
				wordInfo.isLike = word.isLike
				updateWord(word.text, word.searchCount + 1)
				showLike()
			} else {
				showUnLike()
			}
		} else {
			await createWordCard()
		}
	}

	function hideWordCard() {
		if (wordCardWrapDom) {
			wordCardWrapDom.classList.add('XyGod_AutoTranslate_hide')
		}
		isWordCardShow = false
	}

	function getMatchWord() {
		let matchWord = words.find((word) => word.word == selectText)
		return matchWord
	}
	/**
	 * @type {Array<WordType>} words - words
	 */
	let words = []
	async function saveWords() {
		if (typeof GM === 'undefined') return
		await GM?.setValue('words', words)
	}
	async function getWords() {
		if (typeof GM === 'undefined') return
		words = await GM?.getValue('words', [])
	}

	function getWordInWords(text, translate) {
		let result = words.find((word) => word.text === text)
		return result
	}
	function getWordIndexInWords(text) {
		let result = words.findIndex((word) => word.text === text)
		return result
	}

	async function addWord() {
		const word = getWordInWords(wordInfo.text)
		if (word) {
			console.warn(`${text} already exist`)
			return
		}
		words.push({
			id: Math.random().toString(16).substring(2),
			isLike: wordInfo.isLike,
			text: wordInfo.text,
			translate: wordInfo.translate ? wordInfo.translate : '暂无翻译',
			wordStatus: WordStatus.UNKNOWN,
			searchCount: 0,
			addDate: Date.now(),
		})
		await saveWords()
	}
	function updateWord(text, searchCount) {
		const index = getWordIndexInWords(text)
		const word = words[index]
		if (!word) {
			console.warn(`${text} is not exist`)
			return
		}
		words[index].searchCount = searchCount
		saveWords()
	}

	async function deleteWord(id) {
		words.forEach((word) => {
			if (word.id == id) {
				words.splice(words.indexOf(word), 1)
			}
		})
		await saveWords()
	}
	async function deleteAllWord() {
		if (typeof GM === 'undefined') return
		await GM?.deleteValue('words')
		await saveWords()
	}

	async function like() {
		wordInfo.isLike = false
		showUnLike()
		const word = getWordInWords(wordInfo.text)
		if (word) {
			deleteWord(word.id)
		}
		await saveWords()
	}
	function showLike() {
		doms.unlike_btn.classList.toggle('XyGod_AutoTranslate_hide', true)
		doms.like_btn.classList.toggle('XyGod_AutoTranslate_hide', false)
	}
	function showUnLike() {
		doms.unlike_btn.classList.toggle('XyGod_AutoTranslate_hide', false)
		doms.like_btn.classList.toggle('XyGod_AutoTranslate_hide', true)
	}
	async function unlike() {
		wordInfo.isLike = true
		showLike()
		await addWord()
	}

	function addStyle() {
		GM_addStyle(`
#XyGod_AutoTranslate_WordWrap.XyGod_AutoTranslate_WordWrap * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#XyGod_AutoTranslate_WordWrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483647 !important;
  margin: 0;
  padding: 0;
  transition: all 0.2s;
  box-sizing: border-box;
  width: -webkit-fit-content;
  width: fit-content;
  height: -webkit-fit-content;
  height: fit-content;
  --red: #f00056;
  --black: #424c50;
  --white: #ffffff;
  --max_width: 300px;
  --min_height: 30px;
  --max_height: 1300px;
}
#XyGod_AutoTranslate_WordWrap svg {
  width: 100%;
  height: 100%;
  color: inherit;
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 0;
}
#XyGod_AutoTranslate_WordWrap.XyGod_AutoTranslate_hide {
  display: none;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap {
  width: -webkit-fit-content;
  width: fit-content;
  max-width: var(--max_width);
  height: -webkit-fit-content;
  height: fit-content;
  min-height: var(--min_height);
  max-height: var(--max_height);
  background-color: #0000009f;
  border-radius: 5px;
  padding: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_card {
  width: -webkit-fit-content;
  width: fit-content;
  max-width: var(--max_width);
  height: -webkit-fit-content;
  height: fit-content;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_setting_card {
  position: absolute;
  right: 5px;
  top: 5px;
  display: none;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_setting_card .XyGod_AutoTranslate_like_wrap {
  width: 20px;
  height: 20px;
  position: block;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_setting_card .XyGod_AutoTranslate_like_wrap .XyGod_AutoTranslate_like_btn {
  color: var(--red);
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_setting_card .XyGod_AutoTranslate_like_wrap .XyGod_AutoTranslate_icon {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: block;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_setting_card .XyGod_AutoTranslate_like_wrap .XyGod_AutoTranslate_icon.XyGod_AutoTranslate_hide {
  display: none;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_origin_card {
  word-wrap: break-word;
  display: block;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_origin_card .XyGod_AutoTranslate_word_type {
  font-size: 0.875rem;
  color: #ffffff;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_origin_card .XyGod_AutoTranslate_word_text {
  color: #ffffff;
  font-size: 1.625rem;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_origin_card.XyGod_AutoTranslate_hide {
  display: none;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_translate_card {
  font-size: 1em;
  word-wrap: break-word;
  border-radius: 5px;
  font-size: 1rem;
}
#XyGod_AutoTranslate_WordWrap .XyGod_AutoTranslate_wordCard_wrap .XyGod_AutoTranslate_translate_card .XyGod_AutoTranslate_word_translate {
  color: #ffffff;
}
`)
	}
})()
