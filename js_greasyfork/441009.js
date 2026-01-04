// ==UserScript==
// @name         read_mark
// @include      *wikipedia*
// @include      http://readonlinefreebook.com/*
// @include      https://readonlinefreebook.com/*
// @supportURL   https://github.com/sxlgkxk/browser_script/issues
// @version      0.2
// @description  read mark
// @namespace    http://sxlgkxk.github.io/
// @author       sxlgkxk
// @icon         http://sxlgkxk.github.io/im/avatar.jpg
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/441009/read_mark.user.js
// @updateURL https://update.greasyfork.org/scripts/441009/read_mark.meta.js
// ==/UserScript==

(function () {

	//-------------------------------- common functions --------------------------------

	function addScript(src) {
		var scripts_dom = document.createElement('script');
		scripts_dom.src = src;
		scripts_dom.type = 'text/javascript';
		document.getElementsByTagName('head')[0].appendChild(scripts_dom);
	}
	addScript('https://unpkg.com/axios/dist/axios.min.js')

	function addStyle(html) {
		style = document.createElement("div")
		document.body.before(style)
		style.innerHTML = `<style>` + html + `</style>`
	}

	//-------------------------------- code snippets --------------------------------

	addStyle(`
	#markPanel{
		color: #fff;
		background-color: #333;
		position: fixed;
		bottom: 100px;
		right: 0px;
		width: 250px;
		opacity: 0.9;
		z-index: 3000;
		padding: 5px;
	}
	a.markUrl{
		font-weight: bold;
		color: #8bdb81;
		padding-right: 10px;
		font-size: 12px;
	}
	a:visited{
		color: #f5de19 !important;
    }
	button.markBtn, button.highlightBtn{
		background-color: #fff;
		color: #333;
		padding-top: 4px;
		padding-bottom: 4px;
		padding-left: 9px;
		padding-right: 9px;
		margin-right: 5px;
		margin-bottom: 3px;
		margin-top: 3px;
		border:0px;
	}
	[hidden] { display: none !important; }
`)


	//-------------------------------- markPanel --------------------------------

	mark_panel = document.createElement('div')
	document.body.before(mark_panel)

	mark_panel_list_html = ""
	for (let i = 0; i < 10; i++) {
		data = localStorage.getItem("mark" + i)
		data = data ? JSON.parse(data) : {}
		url = data.url
		title = data.title
		mark_panel_list_html += `
		<div>
			<button onclick="document.setMark(`+ i + `)" class="markBtn">+</button>
			<a href="`+ url + `" class="markUrl" id="mark` + i + `">` + title + `</a>
		</div>
	`
	}

	mark_panel.innerHTML = `<div id="markPanel" hidden>`
		+ mark_panel_list_html
		+ `<button class="highlightBtn" onclick="document.promptHighlight()">highlight</button>`
		+ `<button class="highlightBtn" id="readlaterBtn" onclick="document.addToReadlater()">readlater</button>`
		+ `</div>`

	document.toggleMarkPanel = () => {
		markPanel = document.querySelector("#markPanel");
		if (markPanel.hidden) {
			markPanel.hidden = false
		} else {
			markPanel.hidden = true
		}
	}
	document.setMark = function (val) {
		data = { title: document.title.replace(" - Wikipedia", ''), url: window.location.href }
		localStorage.setItem("mark" + val, JSON.stringify(data))
		document.querySelector("#mark" + val).innerHTML = data.title
		document.querySelector("#mark" + val).href = data.url
	}

	//-------------------------------- mark_button --------------------------------

	body = document.querySelector('body')
	mark_button = document.createElement('button')
	document.body.before(mark_button)

	// move button style
	mark_button.innerHTML = `<style>
	.float_btn{
		font-weight: bold;
		color: #fff;
		background-color: #333;
		position: fixed;
		width: 50px;
		height: 50px;
		opacity: 0.8;
		z-index: 1;
	}
</style`

	// mark_button
	mark_button.innerHTML += 'mark'
	mark_button.id = 'read_mark_btn'
	mark_button.classList.add("float_btn")
	mark_button.style.bottom = '50px'
	mark_button.style.right = '50px'
	mark_button.onclick = () => {
		document.toggleMarkPanel()
	}

	//-------------------------------- highlight --------------------------------

	// style
	function addStyle(html) {
		style = document.createElement("div")
		document.body.before(style)
		style.innerHTML = `<style>` + html + `</style>`
	}
	addStyle(`
		span.highlight{
			color: #555555; 
			font-weight:bold; 
			background-color: #8bdb81;
		}
	`)

	function doHighlight(el = document.body) {
		var keywords = localStorage.getItem("highlight")
		if (!keywords) return;
		keywords = JSON.parse(keywords).join()

		var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
		keywords = keywords.replace(rQuantifiers, '\\$&').split(',').join('|');
		var pat = new RegExp('(' + keywords + ')', 'gi');
		var span = document.createElement('span');
		// getting all text nodes with a few exceptions
		var snapElements = document.evaluate(
			'.//text()[normalize-space() != "" ' +
			'and not(ancestor::style) ' +
			'and not(ancestor::script) ' +
			'and not(ancestor::textarea) ' +
			'and not(ancestor::code) ' +
			'and not(ancestor::pre)]',
			el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

		for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
			var node = snapElements.snapshotItem(i);
			// check if it contains the keywords
			if (pat.test(node.nodeValue)) {
				// check that it isn't already highlighted
				if (node.className != "highlight" && node.parentNode.className != "highlight") {
					// create an element, replace the text node with an element
					var sp = span.cloneNode(true);
					sp.innerHTML = node.nodeValue.replace(pat, '<span class="highlight" title="highlight">$1</span>');
					node.parentNode.replaceChild(sp, node);
				}
			}
		}
	}
	doHighlight();

	function promptHighlight() {
		text = prompt("请输入需要高亮的关键词")
		if (text) {
			keywords = [text]
			localStorage.setItem("highlight", JSON.stringify(keywords))
			doHighlight()
		}
	}
	document.promptHighlight = promptHighlight


	//-------------------------------- readlater --------------------------------

	addStyle(`
		table#readlater_table {
			border-collapse: collapse;
			width: 100%;
			background-color: #222;
		}
		#readlater_table th, #readlater_table td {
			text-align: left;
			padding: 8px;
		}
		button.pagiBtn{
			background-color: #333;
			color: #fff;
			margin: 4px;
			padding-left: 15px;
			padding-right: 15px;
			padding-top: 9px;
			padding-bottom: 9px;
		}
		button#readlaterBtn.added{
			background-color: #8bdb81;
		}
	`)

	for (let i = 1; i <= 31; i++) {
		addStyle(`td.readlaterDay` + i + `{background-color: rgba(` + Math.floor(Math.random() * 255) + `,` + Math.floor(Math.random() * 255) + `,` + Math.floor(Math.random() * 255) + `, 0.5);}`)
	}

	function getReadlaterDateStr(date = null) {
		date = new Date(date)
		month = String(date.getMonth() + 1)
		day = String(date.getDate())
		return month + "." + day
	}

	chapter_dom = document.querySelector("div.chapter-detail")
	if (!chapter_dom) chapter_dom = document.body
	readlater_panel = document.createElement("div")
	chapter_dom.before(readlater_panel)
	readlater_panel.innerHTML = `<div>
	<table id="readlater_table">
	</table>
	<button id="readlater_prev" class="pagiBtn">\<</button>
	<button id="readlater_next" class="pagiBtn">\></button>
	<input id="readlater_input" type="text" value="1" size="3">
	<button id="readlater_go" class="pagiBtn">go</button>
</div>`

	readlater_data = localStorage.getItem('readlater_data')
	readlater_data = readlater_data ? JSON.parse(readlater_data) : {}
	if (readlater_data[location.href]) {
		document.querySelector("#readlaterBtn").classList.add("added")
	}

	function addToReadlater() {
		readlater_data=localStorage.getItem('readlater_data')
		readlater_data = readlater_data ? JSON.parse(readlater_data) : {}
		if (!readlater_data[location.href]) {
			readlater_data[location.href] = { date: new Date().getTime(), title: document.title.replace(" - Wikipedia", ''), url: location.href }
			localStorage.setItem('readlater_data', JSON.stringify(readlater_data))
			btn = document.querySelector('button#readlaterBtn')
			btn.classList.add('added')
		} else {
			delete readlater_data[location.href];
			localStorage.setItem('readlater_data', JSON.stringify(readlater_data))
			btn = document.querySelector('button#readlaterBtn')
			btn.classList.remove('added')
		}
		setReadlaterTable(1)
	}
	document.addToReadlater = addToReadlater

	function setReadlaterTable(page) {
		page = page ? page : 1
		readlater_pageSize = 10
		readlater_table = document.querySelector("#readlater_table")
		readlater_table.innerHTML = ""
		readlater_list = Object.values(readlater_data).sort((a, b) => { return b.date - a.date })

		start = (page - 1) * readlater_pageSize
		end = Math.min(start + readlater_pageSize, readlater_list.length)

		for (i = start; i < end; i++) {
			day = new Date(readlater_list[i].date).getDate()
			readlater_table.innerHTML += `<tr>`
				// + `<td class="readlaterDay` + day + `">` + getReadlaterDateStr(readlater_list[i].date) + `</td>`
				+ `<td><a href="` + readlater_list[i].url + `">` + readlater_list[i].title + `</a></td>
			</tr>`
		}
	}
	setReadlaterTable(1)

	document.querySelector('#readlater_prev').onclick = () => {
		readlater_page = document.querySelector('#readlater_input').value;
		setReadlaterTable(--readlater_page);
		document.querySelector('#readlater_input').value = readlater_page
	}
	document.querySelector('#readlater_next').onclick = () => {
		readlater_page = document.querySelector('#readlater_input').value;
		setReadlaterTable(++readlater_page);
		document.querySelector('#readlater_input').value = readlater_page
	}

	document.querySelector('#readlater_go').onclick = () => {
		readlater_page = document.querySelector('#readlater_input').value;
		setReadlaterTable(readlater_page);
	}

})();