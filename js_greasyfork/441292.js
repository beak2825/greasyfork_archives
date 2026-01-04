// ==UserScript==
// @name         page_note
// @include      *wikipedia*
// @supportURL   https://github.com/sxlgkxk/browser_script/issues
// @version      0.3
// @description  page note
// @namespace    http://sxlgkxk.github.io/
// @author       sxlgkxk
// @icon         http://sxlgkxk.github.io/im/avatar.jpg
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @require 	 https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/441292/page_note.user.js
// @updateURL https://update.greasyfork.org/scripts/441292/page_note.meta.js
// ==/UserScript==

(function () {

	//-------------------------------- common functions --------------------------------

	function addScript(src) {
		let scripts_dom = document.createElement('script');
		scripts_dom.src = src;
		scripts_dom.type = 'text/javascript';
		document.getElementsByTagName('head')[0].appendChild(scripts_dom);
	}
	addScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js')

	function addStyle(html) {
		let style = document.createElement("div")
		document.body.before(style)
		style.innerHTML = `<style>` + html + `</style>`
	}

	//-------------------------------- code snippets --------------------------------

	if(location.pathname=='/wiki/Main_Page'){
		let password = "123zxccos"
		function mainpage_pull() {
			axios.get(`https://service-dekuoyfq-1259633509.usw.apigw.tencentcs.com/fileSync?password=${password}&path=wiki.md`).then(res => {
				let data = res.data
				let content = data['Data'];
				if (content) {
					localStorage.setItem(`note_${location.pathname}`, content)
					location.reload();
				}
			});
		}
		document.mainpage_pull = mainpage_pull

		function mainpage_push() {
			let data=localStorage.getItem(`note_${location.pathname}`, content)
			axios.post(`https://service-dekuoyfq-1259633509.usw.apigw.tencentcs.com/fileSync?password=${password}&path=wiki.md`, {Data: data}).then(res => {
				let data = res.data
				alert("push success")
			});
		}
		document.mainpage_push = mainpage_push

		let dom=document.createElement('div')
		dom.innerHTML=`
			<button class="pagiBtn" onclick="document.mainpage_pull()">pull</button>
			<button class="pagiBtn" onclick="document.mainpage_push()">push</button>
		`
		document.body.before(dom)
		dom.id="mainpage"
	}
	


	// dom insert
	let note_dom = document.createElement('div')
	document.body.before(note_dom)
	note_dom.innerHTML = `
		<button class="noteBtn" onclick="document.toggleNotePanle()">note</button>
		<textarea class="notePanel" hidden></textarea>
		<select id="pagenote_select">
		</select>
		<div id="pagenote_panel">
			<textarea id="pagenote_textarea">hi</textarea>
		</div>`
	let text = localStorage.getItem(`note_${location.pathname}`)
	document.querySelector("textarea#pagenote_textarea").value = text;

	addStyle(`
		strong{
			color: #37a2da
		}
		button.noteBtn {
			font-weight: bold;
			color: #fff;
			background-color: #333;
			position: fixed;
			bottom: 0px;
			right: 50px;
			width: 50px;
			height: 50px;
			opacity: 0.8;
			z-index: 3000;
		}
		textarea.notePanel{
			font-weight: bold;
			color: #fff;
			background-color: #333;
			position: fixed;
			bottom: 50px;
			right: 0px;
			left: 0px;
			top: 50px;
			opacity: 0.9;
			z-index: 3000;
			padding: 30px;
		}
		textarea#pagenote_textarea{
			color: #fff;
			background-color: #333;
			padding: 20px;
			width: 100%;
			height: 400px;
		}
		select#pagenote_select{
			color: #fff;
			background-color: #666;
			width: 100%;
			padding: 10px;
			margin-bottom: 10px;
		}
		[hidden] { display: none !important; }
	`)

	// hide/show functions
	document.hidePanel = () => {
		let panel = document.querySelector("textarea.notePanel");
		if (!panel.hidden) {
			let text = panel.value;
			localStorage.setItem(`note_${location.pathname}`, text)
			document.querySelector("textarea#pagenote_textarea").value = text;
			panel.hidden = true
		}
	}
	document.showPanel = (name = location.pathname) => {
		let panel = document.querySelector("textarea.notePanel");
		if (panel.hidden) {
			let text = localStorage.getItem("note_" + name)
			panel.value = text;
			panel.hidden = false
		}
	}
	document.toggleNotePanle = () => {
		let note_panel = document.querySelector("textarea.notePanel");
		if (note_panel.hidden)
			document.showPanel()
		else
			document.hidePanel()
	}

	// C-A-e / Esc
	document.addEventListener("keydown", function (event) {
		let panel = document.querySelector("textarea.notePanel");
		if (event.ctrlKey && event.altKey && event.key == "e") {
			let note_panel = document.querySelector("textarea.notePanel");
			if (note_panel.hidden) {
				document.showPanel()
				panel.focus()
			} else
				document.hidePanel()
		} else if (event.key == "Escape") {
			document.hidePanel()
			panel.blur()
		}
	});

	// pagenote_panel
	document.querySelector("textarea#pagenote_textarea").addEventListener("input", function (event) {
		let text = this.value;
		localStorage.setItem(`note_${location.pathname}`, text)
	})
	document.querySelector("textarea.notePanel").addEventListener("input", function (event) {
		let text = this.value;
		localStorage.setItem(`note_${location.pathname}`, text)
	})

	// pagenote_select
	for (let i = 0; i < localStorage.length; i++) {
		let key = localStorage.key(i)
		if (key.substring(0, 5) == "note_") {
			let name = key.substring(5);
			let url = new URL(location.origin + key.substring(5))
			let note = localStorage.getItem(key)
			if (!note) continue

			let opt = document.createElement('option');
			opt.value = name;
			opt.innerHTML = name;
			if (name == location.pathname) opt.selected = true;
			document.querySelector("select#pagenote_select").appendChild(opt);
		}
	}
	if (document.querySelector("select#pagenote_select").value != location.pathname) {
		let opt = document.createElement('option');
		opt.value = location.pathname;
		opt.innerHTML = location.pathname;
		opt.selected = true;
		document.querySelector("select#pagenote_select").appendChild(opt);
	}

	document.querySelector("select#pagenote_select").addEventListener("change", function (event) {
		let name = this.value;
		let url = `${name}`
		window.open(url, '_blank').focus();
	})

})();