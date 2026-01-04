// ==UserScript==
// @name Show Mandiner Comments
// @name:hu Mandiner Hozzászólás Mutató
// @license MIT
// @description	Userscript for showing mandiner.hu's quoted comments / replies
// @description:hu	Felhasználói szkript a mandiner.hu idézett hozzászólásainak / válaszainak megjelentéséhez
// @icon	https://mandiner.hu/images/favicon.png
// @version	1.2
// @include	https://*mandiner.hu/cikk/*
// @grant   none
// @namespace https://greasyfork.org/users/412587
// @downloadURL https://update.greasyfork.org/scripts/393344/Show%20Mandiner%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/393344/Show%20Mandiner%20Comments.meta.js
// ==/UserScript==

let myStyle = document.createElement('style');
myStyle.innerHTML = '.commentToolTips { position: absolute; z-index: 9999; text-align: left; background-color: #000000bb; color: #fff; border: 1px solid #000; border-radius: 10px; margin-top: 5px; padding: 5px; }';
document.querySelector('head').appendChild(myStyle);

let commentLinks = document.querySelectorAll('.jump-comment');
for (let commentLink of commentLinks) {
	commentLink.onmouseover = function() {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let comment = JSON.parse(xhr.responseText).Content,
					commentToolTip = document.createElement('div');
				commentToolTip.setAttribute('id', 'commentToolTip_' + commentLink.getAttribute('data-id'));
				commentToolTip.classList.add('commentToolTips');
				commentToolTip.innerHTML = comment;
				if (commentLink.parentNode.nodeName === 'B') {
					commentLink.parentNode.parentNode.insertBefore(commentToolTip, commentLink.nextSibling);
				} else {
					commentToolTip.style.right = '0';
					commentLink.parentNode.insertBefore(commentToolTip, commentLink.nextSibling);
				}
			}
		};
		xhr.open('GET','https://mandiner.hu/comment/' + commentLink.getAttribute('data-id'));
		xhr.send();
	};
  
	commentLink.onmouseout = function() {
		let commentToolTips = document.querySelectorAll('.commentToolTips');
		console.log(commentToolTips);
		for (let commentToolTip of commentToolTips) {
			commentToolTip.parentNode.removeChild(commentToolTip);
		}
	
	};
}