// ==UserScript==
// @name         copyBannerId
// @namespace    http://tampermonkey.net/
// @version      0.85
// @description  Copy banners like a pro
// @author       Andy
// @match        https://target.my.com/admin/banners_search/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=my.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470600/copyBannerId.user.js
// @updateURL https://update.greasyfork.org/scripts/470600/copyBannerId.meta.js
// ==/UserScript==

(function() {
    'use strict';




let buffer = []
let filterSettings = []

document.body.onload = () => {

	waitForElementToDisplay('.js-search-button')
	.then((element) => {

		element.onclick = () => {
			console.log('asda')
			checkSit()
		}
		buildControls(element)

	})
	.catch((error) => {
		console.error('Произошла ошибка:', error);
	});
}

function waitForElementToDisplay(selector) {
	return new Promise((resolve, reject) => {
	const observer = new MutationObserver((mutations) => {
		const element = document.querySelector(selector);
		if (element) {
			observer.disconnect();
			resolve(element);
		}
	});

	observer.observe(document.documentElement, { childList: true, subtree: true });

	});
}
	
function addBuffer(set) {

	for (let banner of set){
		if (!banner.querySelector('.chkbox')){

			const checkIt = document.createElement('input')
			const itemBefore = banner.querySelector('.moderation-banner__controls-info__label')
	
			checkIt.setAttribute('type', 'checkbox')
			checkIt.className = 'chkbox'
	
			checkIt.style = 'margin: 5px'
	
			banner.appendChild(checkIt)
	
			banner.insertBefore(checkIt, itemBefore)
	
			checkIt.onclick = () => {
	
				if(checkIt.checked){
					checkIt.setAttribute('checked','')
					buffer.push(banner.querySelector('.moderation-banner__id').innerText)
					
					console.log(buffer)
	
				}
				if(!checkIt.checked){
					checkIt.removeAttribute('checked')
					const index = buffer.indexOf(banner.querySelector('.moderation-banner__id').innerText)
	
					if(index > -1 ) {
						buffer.splice(index, 1)
					}
	
					console.log(buffer)
	
				}
	
			}
		}

	}
}



function checkSit(){
	buffer = []
	console.log('checksit worked');
	waitForElementToDisplay('.moderation-banner__controls-info')
	.then((element) => {
		const banners = document.querySelectorAll('.moderation-banner__controls-info')
		addBuffer(banners)
		console.log(`banners loaded`);
		
		filterSettings.forEach(e=>{
			setFilter(e, banners)
		})

	})
	.catch((error) => {
		console.error('Произошла ошибка:', error);
	});

}

function buildControls(){
		// adding tools
	
		
	console.log(`controls builded`);
	const menu = document.querySelector('.moderation-nt-search__row')
	const checkDiv = document.createElement('div')
	
	const checkAll = document.createElement('input')
	const checkAllText = document.createElement('span')
	const copyButton = document.createElement('button')
	
	checkDiv.style = 'margin: 10px'
	
	checkAllText.innerText = 'Check All'
	checkAll.setAttribute('type', 'checkbox')
	checkAll.className = 'chkAll'
	checkAll.style = 'margin: 5px'
		
	copyButton.innerText = 'Copy Selected'
	copyButton.className = 'copySel-Btn'
	copyButton.style = 'margin: 10px'
	
	const BannedText = document.createElement('span')
	BannedText.innerText = 'Только забаненные'
	const AllowedText = document.createElement('span')
	AllowedText.innerText = 'Только одобренные'
	
	
	checkAll.onclick = () => {
		const banners = document.querySelectorAll('.moderation-banner__controls-info')
		if(checkAll.checked){
			buffer = []
					
			for (let banner of banners){
						
				banner.querySelector('.chkbox').checked = true
				buffer.push(banner.querySelector('.moderation-banner__id').innerText)
	
			}
					
		} else {
					
			for (let banner of banners){
				banner.querySelector('.chkbox').checked = false
	
				}
				buffer = []
	
		}
	}
	
	copyButton.onclick = () => {
	
		navigator.clipboard.writeText(buffer.join(' '))
	
	}
			document.body.addEventListener("keydown", function (ev) {
		  
				// function to check the detection
				ev = ev || window.event; // Event object 'ev'
				const key = ev.which || ev.keyCode; // Detecting keyCode
				  
				// Detecting Ctrl
				const ctrl = ev.ctrlKey ? ev.ctrlKey : ((key === 17)
				? true : false);
				  
				// If key pressed is V and if ctrl is true.
				if (key == 86 && ctrl) {
				// print in console.
				console.log("Ctrl+V is pressed.");
				}
				else if (key == 67 && ctrl) {
					if(buffer.length > 0){
						navigator.clipboard.writeText(buffer.join(' '))
					}
	
				}
				  
				}, false);
	
			const allowedBox = filterCheckBox(filterSettings,'allowed','moderation-banner_allowed')
			const bannedBox	= filterCheckBox(filterSettings,'banned','moderation-banner_banned')
			
			
			
			menu.appendChild(checkDiv)
			menu.appendChild(checkDiv).append(checkAll, checkAllText, copyButton, bannedBox, BannedText, allowedBox, AllowedText)	
			
		
	}

function filterCheckBox(settings, text, clname){

	const inp = document.createElement('input')
	inp.className = `show-${text}`
	inp.style = 'margin: 5px'
	
	inp.setAttribute('type', 'checkbox')
	if(clname && settings) {

		inp.onclick = () => {
			if (!settings.includes(clname)){
				settings.push(clname)
				console.log(settings);
			} else {
				settings.splice(settings.indexOf(clname),1)
				console.log(settings);

			}
			
		}

	}	

	return inp
	
}


function setFilter(setting, objs){

	for(let obj of objs) {

		if (!obj.parentElement.parentElement.className.includes(setting)){
			console.log('banned');
			obj.parentElement.parentElement.remove()
		}
	}
}





    // Your code here...
})();