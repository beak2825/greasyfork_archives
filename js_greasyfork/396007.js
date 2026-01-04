// ==UserScript==
// @name         useful-wiki
// @namespace    http://tampermonkey.net/
// @version      1.4 Beta
// @description  Delete-reference, QA test
// @author       Klastor
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396007/useful-wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/396007/useful-wiki.meta.js
// ==/UserScript==

(function() {
    let ref = document.querySelectorAll('.reference');
let count;
let pageHeader = document.getElementById('firstHeading');

let configurationColor = ['red','orange','green'];
let configurationText = ['Статья не вызывает доверие!', 'Информацию из статьи следовало бы перепроверить!', 'Статья подкреплена проверенной информацией!'];

function counter(){
	let x = ref.length;
	let y;
	if(x<=4)y=0
	if(x>=5)y=1
	if(x>10)y=2
	return count = y
}

let changer = {
	count : counter(),
	color : configurationColor[count],
	text : configurationText[count],

	changeHeader(){
		pageHeader.style.backgroundColor = this.color;
		pageHeader.setAttribute('title', `${this.text} и количество сносок у нее ${ref.length}`);
	}
}

function refDel(){
	if(ref != 0){
		for(let i=0; i < ref.length; i++){
			ref[i].remove()
		}
	}
}

changer.changeHeader();
refDel();
})();