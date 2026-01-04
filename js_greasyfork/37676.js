// ==UserScript==
// @name       Dostępny
// @namespace  http://www.wykop.pl/*
// @version    1.1
// @description  sprawdź dostępność 
// @match      *://www.wykop.pl/*
// @copyright  Arkatch
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/37676/Dost%C4%99pny.user.js
// @updateURL https://update.greasyfork.org/scripts/37676/Dost%C4%99pny.meta.js
// ==/UserScript==

	function ajax(url){
		return new Promise((resolve, reject)=>{
			var request = new XMLHttpRequest()
			request.onload = ()=>{
				if(request.status == 200){
					resolve(request.responseText)
				}else{
					reject(request.statusText)
				}
			}
			request.onerror = ()=>{
			  reject(request.statusText)
			}
			request.open("GET", url, true)
			request.send()
		})
	}
	async function responseAsync(name){
		try{
			let apiResponse = await ajax(name)
			let el = parseHTML(apiResponse)
			return (el.querySelector('div.clearfix.m-reset-padding span[style="color: green; font-weight: bold; font-size: 40px; line-height: 18px; vertical-align: middle;"]'))
		}catch(e){
			console.log(e)
		}
	}
	function getName(){
		let nickName = []
		let block = document.getElementsByClassName('comments-stream')[0]
		let comm = block.getElementsByClassName('entry iC')
		for(let n of comm){
			let prof = n.getElementsByClassName('profile')
			for(let ref of prof){
				nickName.push(ref.href)
			}
			
		}
		return nickName.filter(onlyUnique)
	}
	function parseHTML(Text){
		let x = document.createElement('html')
		x.innerHTML = Text
		return x
	}
	function onlyUnique(value, index, self) { 
		return self.indexOf(value) === index
	}
	function appendSpan(elem){
		let d = document.createElement('span')
		d.innerHTML = '<span style="color: green; font-weight: bold; font-size: 40px; line-height: 18px; vertical-align: middle;">•</span>'
		elem.appendChild(d)
	}
	function showActive(profile){
		let prof = document.querySelectorAll('div.author.ellipsis a[href="'+profile+'"]')
		for(let part of prof){
			let ellips = part.closest('div.author.ellipsis')
			appendSpan(ellips)
		}
	}
	async function main(){
		let profile = getName()
		let active = []
		for(let nick of profile){
			try{
				let temp = await responseAsync(nick)
				if(temp){
					showActive(nick)
				}
			}catch(e){
				console.log(e)
			}
		}
	}
{
	document.onreadystatechange = ()=>{
		if(document.readyState === "complete") {
				main()
		}
	}
}