// ==UserScript==
// @name 	   	 wikinote
// @include      *wikipedia*
// @supportURL   https://github.com/sxlgkxk/browser_script/issues
// @version      0.1
// @description  wikipedia note
// @namespace    http://sxlgkxk.github.io/
// @author       sxlgkxk
// @icon         http://sxlgkxk.github.io/im/avatar.jpg
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/443259/wikinote.user.js
// @updateURL https://update.greasyfork.org/scripts/443259/wikinote.meta.js
// ==/UserScript==
/*
1. 代码功能
	添加对每个wiki词条的一句话评语

*/

(function () {

	//-------------------------------- common functions --------------------------------

	function addScript(src) {
		var scripts_dom = document.createElement('script');
		scripts_dom.src = src;
		scripts_dom.type = 'text/javascript';
		document.getElementsByTagName('head')[0].appendChild(scripts_dom);
	}
	addScript('https://unpkg.com/axios/dist/axios.min.js')

	function getGistToken() {
		gist_token = localStorage.getItem('gist_token')
		if (gist_token != null) {
			gist_token = prompt('gist_token?')
			localStorage.setItem('gist_token', gist_token)
		}
		return gist_token
	}

	async function gist_get_async(gist_id, filename) {
		response = await axios.get("https://api.github.com/gists/" + gist_id)
		data = response.data
		content = data.files[filename].content
		return content
	}

	async function gist_set_async(gist_id, filename, content) {
		files = {}
		files[filename] = { "content": content }
		gist_token = getGistToken()
		return await axios.patch("https://api.github.com/gists/" + gist_id, { files: files }, { headers: { Authorization: "token " + gist_token } })
	}

	function addStyle(html) {
		style = document.createElement("div")
		document.body.before(style)
		style.innerHTML = `<style>` + html + `</style>`
	}

	//-------------------------------- code snippets --------------------------------

	function merge(remote, local){
		return local
	}

	function updateWikinoteGist() {
		gist_id = "c2fd12975661b569c71d303725bfb8c5"
		filename = "wikinote.json"

		// pull
		gist_get_async(gist_id, filename).then((content) => {
			content = JSON.parse(content)

			wikinote = localStorage.getItem('wikinote')
			wikinote=wikinote?JSON.parse(wikinote):{}

			content=merge(content, wikinote)

			// push
			gist_set_async(gist_id, filename, JSON.stringify(content)).then((response) => { alert("update success") })
			localStorage.setItem('wikinote', JSON.stringify(content))
		})
	}
	window.updateWikinoteGist=updateWikinoteGist

	head=document.querySelector('#firstHeading')
	dom = document.createElement("div")
	dom.innerHTML='null'
	dom.style.cssText = 'background-color: #000; color: #ddd; padding: 15px; margin: 5px;'
	head.before(dom)
	wikinote=localStorage.getItem('wikinote')
	wikinote=wikinote?JSON.parse(wikinote):[]
	cur_title=location.href.split('/')[4]
	for(i in wikinote){
		if(wikinote[i].title==cur_title){
			dom.innerHTML=wikinote[i].note
			break
		}
	}

	function getReadableDateStr(date = 0) {
		date = parseInt(date) ? new Date(parseInt(date)) : new Date()
		year = String(date.getFullYear())
		month = String(date.getMonth() + 1)
		day = String(date.getDate())
		return year + `.` + month + `.` + day
	}

	function updateWikinote(){
		lastWikinoteUpdateTime=localStorage.getItem('lastWikinoteUpdateTime')
		nowStr=getReadableDateStr()
		if (lastWikinoteUpdateTime != nowStr) {
			updateWikinoteGist()
			localStorage.setItem('lastWikinoteUpdateTime', nowStr)
		}
	}

	dom.addEventListener('click',function(){
		wikinote=localStorage.getItem('wikinote')
		wikinote=wikinote?JSON.parse(wikinote):[]
		cur_title=location.href.split('/')[4]

		isExist=false
		for(i in wikinote){
			if(wikinote[i].title==cur_title){
				isExist=true
				note=wikinote[i].note
				val=prompt('note?',note)
				if(val && val!=note){
					wikinote[i].note=val
					this.innerHTML=val
					localStorage.setItem('wikinote',JSON.stringify(wikinote))
					updateWikinote()
				}

				break
			}
		}
		if(!isExist){
			val=prompt('note?','')
			if (val) {
				wikinote.push({title:cur_title,note:val,created:new Date().getTime()})
				this.innerHTML=val
				localStorage.setItem('wikinote',JSON.stringify(wikinote))
				updateWikinote()
			}
		}
	})

})();