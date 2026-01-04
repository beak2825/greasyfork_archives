// ==UserScript==
// @name         Dropdown Mentioning for Shoutbox
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Easy to use mentioning system for shoutbox without the use of mouse.
// @author       sojomojo
// @match        https://www.torrentbd.net/
// @match        https://www.torrentbd.net/?spotlight
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546912/Dropdown%20Mentioning%20for%20Shoutbox.user.js
// @updateURL https://update.greasyfork.org/scripts/546912/Dropdown%20Mentioning%20for%20Shoutbox.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
.mention{
    background: #2f2e2e;
    width: 95%;
    border-radius: 8px;
    border: 1px solid black;
    position: absolute;
    max-height: 200px;
    height: auto;
    bottom: 38px;
    overflow: auto;
    scrollbar-width: none;
    transition: .3s;
    display: none;
}
.spotlightCh{
    bottom: 65px !important;
}
.userMention{
    margin: 4px 7px;
    padding: 10px;
    transition: .5s
    cursor: pointer;
    border-radius: 4px;
}
.userMention:hover{
    background: rgb(25 25 25);
}
.userMention:focus{
    outline: none;
    background: rgb(25 25 25);
}
.active{
    background: rgb(25 25 25);
}

    `);

const showMentions = document.createElement('div')
showMentions.classList.add('mention')
const parent = document.querySelector("#shout-send-container")
parent.style.position = "relative"
parent.appendChild(showMentions)
 
const input = document.querySelector(".shoutbox-text")
 
let mentionable = []
let allCurrentMentionable = []
 
let scrolling = false
let insideMention = false

let searchQuery = ""
 
const availableQuery = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "!", "#", "&", "-", "_", "<", ">", "?"]


if(window.location.href == "https://www.torrentbd.net/?spotlight"){
	showMentions.classList.add("spotlightCh")
}

function resetAll(){
	searchQuery = ""
	showMentions.style.display = 'none'
	insideMention = false
	scrolling = false
}

function onClickFunc(user){
	const revINP = input.value.split("").reverse().join("")
	const revSQ = searchQuery.split("").reverse().join("")
	const newInp = revINP.replace(revSQ, "")

	input.value = newInp.split("").reverse().join("")+ user + " "
	input.focus()
	resetAll()
}
 
function createMenEl(userName, index){
	let menEl = document.createElement('div')
	menEl.classList.add('userMention')
	menEl.tabIndex = index.toString()
	menEl.onclick = ()=>{
		onClickFunc(userName)
	}
	menEl.innerText = userName
	return menEl
}
function getUsers(query){
	let users = document.querySelectorAll(".shout-item")
	let newMentionable = []
	for (let i = 0; i < users.length; i++) {
		if(users[i].querySelector(".tbdrank")){
			  let user = users[i].querySelector(".tbdrank").textContent.replace(/\s/g,'')
			  if(!mentionable.includes(user)){
				mentionable.push(user)
			  }
		}
	}
	newMentionable = mentionable.filter((item)=>{
		return item.toLowerCase().includes(searchQuery.toLowerCase())
	})
	showMentions.innerHTML = ''
	allCurrentMentionable = newMentionable
	newMentionable.forEach((name, index)=>{
		if(index==0){
			showMentions.appendChild(createMenEl(name, 0))
		}else{
			showMentions.appendChild(createMenEl(name, -1))
		}
	})
	showMentions.style.display = 'inline'
	if(newMentionable.length > 0){		
		showMentions.querySelector('div').classList.add("active")
		let items = showMentions.querySelectorAll('div')
	 
		items.forEach((it, index)=>{
			it.addEventListener("keydown", (e)=>{
				let nextIndex;
				if(e.key=="ArrowDown"){
					nextIndex = (index + 1)
				}else if(e.key =="ArrowUp"){
					nextIndex = (index - 1)
				}
	 
				if(nextIndex !== undefined){
					items.forEach(el => el.setAttribute("tabindex", "-1"));
					if(items[nextIndex]){
						items[nextIndex].setAttribute("tabindex", "0");
						items[nextIndex].focus();
					}
					e.preventDefault();
				}
	 
				if(e.key == "Enter" || e.key == "Tab"){
					e.preventDefault()
					onClickFunc(it.innerText)
				}
				if(availableQuery.includes(e.key)){
					input.focus()
					searchQuery += e.key
					getUsers(searchQuery)
				}
			})
		})
	}
}
 
 
 
input.addEventListener("focus",()=>{
	scrolling = false
})
 
input.onkeydown=(e)=>{
	if(e.key == "@"){
		getUsers()
		insideMention = true
	}
	if(insideMention){
		if(e.key == "Backspace"){
			if(searchQuery==""){
				showMentions.style.display = "none"
			}else{
				let newQuery = searchQuery.slice(0, -1);
				searchQuery = newQuery
				getUsers(searchQuery)
			}
		}else if(e.key == "Tab" || e.key == "Enter"){
			e.preventDefault()
			showMentions.querySelector('div').click()
		}
		else if(availableQuery.includes(e.key)){
			searchQuery += e.key
			getUsers(searchQuery)
			scrolling = false
		}else if(e.key == "ArrowUp" || e.key =="ArrowDown"){
			if(scrolling ==false){
				e.preventDefault()
				let aLL = showMentions.querySelectorAll('div')
				aLL[0].classList.remove("active")
				aLL[1].focus()
				scrolling = true
			}
		}else if(e.code == "Space"){
			try{
				let first = showMentions.querySelector('div')
				if(searchQuery.toLowerCase()==first.innerText.toLowerCase()){
					e.preventDefault()
					first.click()
					return
				}
			}catch(e){}
			resetAll()
		}
	}
}

})();