// ==UserScript==
// @name        SOja disable enter key
// @name:ja     SOja Enterキー無効化
// @namespace   https://ja.stackoverflow.com/users/3054/mjy
// @match       https://ja.stackoverflow.com/*
// @match       https://ja.meta.stackoverflow.com/*
// @grant       none
// @version     2024-01-14
// @author      mjy
// @license     0BSD
// @description    In SOja (Stack Overflow in Japanese), disable sending a post by pressing the Enter key. It is a simple proof of concept that is currently requested on SOja (https://ja.meta.stackoverflow.com/questions/3950/).
// @description:ja SOja（Stack Overflow日本語版）において、Enter キーの押下による投稿の送信を無効にします。これは、現在 SOja でリクエストされている (https://ja.meta.stackoverflow.com/questions/3950/) 機能の単純な概念実証です。
// @downloadURL https://update.greasyfork.org/scripts/484761/SOja%20disable%20enter%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/484761/SOja%20disable%20enter%20key.meta.js
// ==/UserScript==

;(function () {
	"use strict"

	// For question and answer:
	// Disables the browser's standard behavior of the enter key on some input elements.
	document.body.addEventListener("keydown", (event) => {
		if (event.key !== "Enter") {
			return
		}

		const classList = event.target.classList
		if (
			classList.contains("js-post-title-field") ||
			classList.contains("js-tageditor-replacing") ||
			classList.contains("js-post-edit-comment-field")
		) {
			console.log("disable enter key to submit")
			event.stopPropagation()
			event.preventDefault()
		}
	})

	// For comment:
	// Stack Exchange sites already have a way to disable enter key to submit comments.
	// It just adds a class to the comment form element.
	document.body.addEventListener("focusin", (event) => {
		const classForPrevent = "js-prevent-submit-form-on-enter-press"

		if (!event.target?.classList?.contains("js-comment-text-input")) {
			return
		}
		const form = event.target.closest("form")
		if (!form) {
			return
		}
		if (form.classList.contains(classForPrevent)) {
			return
		}

		console.log("add class for disable enter key", form)
		form.classList.add(classForPrevent)
	})
})()
