// ==UserScript==
// @name         HH.ru Автоотклик
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Автоматическая отправка откликов с резюме и сопроводительным письмом на hh.ru
// @author       You
// @match        https://*.hh.ru/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hh.ru
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534293/HHru%20%D0%90%D0%B2%D1%82%D0%BE%D0%BE%D1%82%D0%BA%D0%BB%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/534293/HHru%20%D0%90%D0%B2%D1%82%D0%BE%D0%BE%D1%82%D0%BA%D0%BB%D0%B8%D0%BA.meta.js
// ==/UserScript==

;(function () {
	'use strict'
    if (!location.href.includes('hh.ru/search/vacancy')) return

	// === НАСТРОЙКИ ===
	const RESUME_ID_ATTRIBUTE = '#resume_0c74c60fff0b6bd3c90039ed1f6f7669436378' // Укажи здесь свой резюме ID

	const COVER_LETTER_TEMPLATE = () =>
		`Имею подходящий опыт для работы в вашей компании!`

	const DELAY_SHORT = 500
	const DELAY_LONG = DELAY_SHORT * 2
	const buttonText = 'Авто отклики'

	let isRunning = false

	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

	const addNavLinks = async () => {
		// Создаем контейнер для кнопки
		const stickyContainer = document.createElement('div')
		stickyContainer.style.position = 'sticky'
		stickyContainer.style.top = '0'
		stickyContainer.style.zIndex = '10000'
		stickyContainer.style.background = '#fff'
		stickyContainer.style.textAlign = 'center'
		stickyContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
		stickyContainer.style.width = '100px'
		stickyContainer.style.height = '0px'
		stickyContainer.style.top = '90px'
		stickyContainer.style.left = '20px'

		// Создаем саму кнопку
		const button = document.createElement('button')
		button.textContent = buttonText
		button.style.padding = '10px 20px'
		button.style.fontSize = '16px'
		button.style.cursor = 'pointer'
		button.style.border = 'none'
		button.style.borderRadius = '16px'
		button.style.backgroundColor = '#000'
		button.style.color = '#fff'
		button.style.fontWeight = 'bold'
		button.style.width = '110px'
		button.style.height = '70px'

		button.addEventListener('click', toggleInit)

		stickyContainer.appendChild(button)

		// Добавляем контейнер в начало body
		document.body.prepend(stickyContainer)
	}

	const toggleInit = async () => {
		const button = findElementByText('button', buttonText)

		if (isRunning) {
			isRunning = false
			button.textContent = buttonText
			console.log('⏹️ Остановлено пользователем')
		} else {
			isRunning = true
			button.textContent = 'Стоп'
			console.log('▶️ Запуск откликов')
			await init()
			button.textContent = buttonText
			isRunning = false
		}
	}

	function setTextareaValue(textarea, value) {
		if (!textarea) return

		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLTextAreaElement.prototype,
			'value',
		).set

		nativeInputValueSetter.call(textarea, value)

		textarea.dispatchEvent(new InputEvent('input', { bubbles: true }))
		textarea.dispatchEvent(new Event('change', { bubbles: true }))
	}

	const handlerCoverLetter = async () => {
		await delay(DELAY_LONG)

		const messageArea = document.querySelector(
			'[data-qa="vacancy-response-popup-form-letter-input"]',
		)

		if (messageArea) {
			setTextareaValue(messageArea, COVER_LETTER_TEMPLATE())

			await delay(DELAY_LONG)

			const popup = messageArea.closest('[role="dialog"]')
			const submitButton = popup?.querySelector(
				'[data-qa="vacancy-response-submit-popup"]',
			)

			let retries = 10
			while (retries > 0 && submitButton?.disabled) {
				await delay(DELAY_LONG)
				retries--
			}

			if (submitButton) {
				submitButton.click()
			}
		}
	}

	const handleRelocationWarning = () => {
		const relocationButton = document.querySelector(
			'[data-qa="relocation-warning-confirm"]',
		)
		relocationButton?.click()
	}

	const init = async () => {
		const vacancies = findElementsByTextContains(
			'magritte-button__label',
			'Откликнуться',
		)

		for (let i = 0; i < vacancies.length; i++) {
			if (!isRunning) break

			console.log(`🚀 Обработка вакансии: ${i + 1}`)
			vacancies[i].click()
			vacancies.shift()

			await delay(DELAY_LONG)
			if (document.querySelector('[data-qa="relocation-warning-title"]')) {
				handleRelocationWarning()
				await delay(DELAY_SHORT)
			}

			await delay(DELAY_LONG)
			if (
				document.querySelector(
					'[data-qa="vacancy-response-popup-form-letter-input"]',
				) !== null
			) {
				await handlerCoverLetter()
			}
			// if (document.querySelector(RESUME_ID_ATTRIBUTE)) {
			// } else {
			// 	console.log('⚠️ Резюме не найдено, пропуск текущей вакансии')
			// }
		}
	}

	function findElementsByTextContains(className, text) {
		return Array.from(document.querySelectorAll('span')).filter(
			(element) =>
				element.classList.toString().includes(className) &&
				element.textContent.includes(text),
		)
	}

	function findElementByText(tagName, text) {
		return Array.from(document.querySelectorAll(tagName)).find(
			(element) => element.textContent.trim() === text,
		)
	}
	addNavLinks()
})()
