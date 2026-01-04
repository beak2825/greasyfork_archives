// ==UserScript==
// @name         [YouTube] Auto add Text in ChatBox
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto add Text in ChatBox.
// @author       You
// @include        https://www.youtube.com/watch*
// @include        https://www.youtube.com/live_chat*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
const chat = document.querySelector("#input > #input")
if(localStorage.getItem('enable-words-typing') != 'false'){
	addText(localStorage.getItem('add-text') == null ? '＃' : localStorage.getItem('add-text'))
}

chat.addEventListener("keyup", e => {

	if(e.key == "Enter" && htmlSetUp && localStorage.getItem('enable-words-typing') != 'false'){
		//テキストボックスに指定した文字を追加。
		addText(htmlSetUp.addTextOption.value == null ? '＃' : htmlSetUp.addTextOption.value)
	}

})

/**
 *@Description 自動でチャットボックスにテキストを追加
*/
function addText(text){

		document.querySelector('#input').setAttribute("has-text" , "")
		chat.setAttribute("aria-invalid" , "")
		chat.textContent = text
		moveEndCaret(chat)

}

/**
 *@Description キャレットの位置を文末に変更
*/
function moveEndCaret(textBox){

	const selection = window.getSelection()
	const range = document.createRange()
	const offset = textBox.innerText.length
	range.setStart(textBox.firstChild, offset)
	range.setEnd(textBox.firstChild, offset)
	selection.removeAllRanges()
	selection.addRange(range)

}