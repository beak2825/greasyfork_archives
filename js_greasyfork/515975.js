// ==UserScript==
// @name         Bitrix Helper
// @version      0.1
// @description  Удобности для Битрикса
// @author       Михаил Смирнов
// @match        *://bitrix.selfmedia.group/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @namespace    https://greasyfork.org/users/1257876
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/515975/Bitrix%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/515975/Bitrix%20Helper.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */


function changeValue(button) {
	let target = button.dataset.day
	let value = parseInt(button.dataset.value)
	let resultEl = document.querySelector(`#parser-${target}-result`)
	resultEl.innerHTML = parseInt(resultEl.innerText) + value

	let time = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
	document.querySelector("#parser-form").title = "Последнее обновление " + time

	window.localStorage.setItem("parser-counter", JSON.stringify({
		monday: parseInt(document.querySelector("#parser-monday-result").innerText),
		tuesday: parseInt(document.querySelector("#parser-tuesday-result").innerText),
		updated: time
	}))
}


function createForm() {
	let form = document.createElement("div")
	form.innerHTML = `
		<div class="parser-row">
			<span>ПН</span>
			<span id="parser-monday-result">0</span>
			<button data-day="monday" data-value="+1">+</button>
			<button data-day="monday" data-value="-1">-</button>
		</div>
		<div class="parser-row">
			<span>ВТ</span>
			<span id="parser-tuesday-result">0</span>
			<button data-day="tuesday" data-value="+1">+</button>
			<button data-day="tuesday" data-value="-1">-</button>
		</div>
	`
	form.id = "parser-form"
	form.querySelectorAll("button").forEach(button => {
		button.addEventListener("click", () => {
			changeValue(button)
		})
	})

	let storage = JSON.parse(window.localStorage.getItem("parser-counter")) || {}
	form.querySelector("#parser-monday-result").innerHTML = storage.monday || 0
	form.querySelector("#parser-tuesday-result").innerHTML = storage.tuesday || 0


	let style = document.createElement('style')
	style.innerHTML = `
		#parser-form {
			position: fixed;
			width: 110px;
			background-color: #F9FAFB;
			border-radius: 3px;
			padding: 3px;
			right: 100px;
			bottom: 40px;
			display: flex;
			flex-direction: column;
			gap: 3px;
			color: rgb(51, 51, 51);
			z-index: 99999;
			font-size: 1em;
			opacity: 0.3;
			transition: opacity 0.15s;
		}

		#parser-form:hover {
			opacity: 1;
			outline: 1px solid #D3D7DC;
		}

		#parser-form > .parser-row {
			display: flex;
			justify-content: space-evenly;
			gap: 3px;
		}

		#parser-form button {
			cursor: pointer;
			border: none;
			flex: 1;
			border-radius: 3px;
			box-sizing: border-box;
			background-color: #D3D7DC;
			width: fit-content;
			transition: all 0.15s;
		}

		#parser-form button:last-child {
			width: 30px;
			font-size: 0.86em;
		}

		#parser-form button:last-child:empty {
			display: none;
		}

		#parser-form button:hover {
			background-color: #2ECEFF;
		}
		
		#parser-form span {
			width: 30px;
			text-align: center;
		}
	`
	document.body.appendChild(style)
	document.body.appendChild(form)
}
createForm()




function copyAllYoutube() {
	let links = Array.from(document.querySelectorAll("[data-name=linkField]")).map(x => x.innerText)
	links = links.filter(x => x.toLowerCase().includes("youtube.com"))
	navigator.clipboard.writeText(links.join("\n"))
}
GM_registerMenuCommand("Скопировать все YouTube ссылки для бота", copyAllYoutube, "y")




function clearParserResults() {
	document.querySelector("#parser-monday-result").innerHTML = 0
	document.querySelector("#parser-tuesday-result").innerHTML = 0
}
GM_registerMenuCommand("Обнулить оба счётчика", clearParserResults)




// function copyAllFacebook() {
// 	// রাজমিস্ত্রী-১২০	28.10.2024 - 03.11.2024	https://facebook.com/profile.php?id=61554222840372	8031000
// 	let table = document.querySelector("table.table:has([data-name=linkField]):has([data-name=partnerViewsField])")
// 	let rows = Array.from(table.querySelectorAll("tr")).slice(1)
// 	let data = rows.map(row => {
// 		let cells = Array.from(row.querySelectorAll("td"))
// 		let title = cells[0].innerText
// 		let date = cells[1].innerText
// 		let link = cells[2].innerText
// 		let views = cells[3].innerText
// 		return {
// 			title,
// 			date,
// 			link,
// 			views
// 		}
// 	})

// }
// GM_registerMenuCommand("Скопировать все FaceBook ссылки для таблицы", copyAllFacebook, "f")