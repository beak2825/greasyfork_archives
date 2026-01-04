// ==UserScript==
// @name         Studocu Hack
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license MIT
// @description  Unblur and download Studocu Premium Documents.
// @author       You
// @match        https://www.studocu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=studocu.com
// @grant        GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/447526/Studocu%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/447526/Studocu%20Hack.meta.js
// ==/UserScript==
GM_addStyle ( `
.nofilter{
    filter: none !important;
}
.download-button-1, .download-button-2, .github-button{
    background: transparent;
    border-radius: 3px;
    color: #fff;
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    transition: background-color .3s,border-color .3s,color .3s;
}

.download-button-1{
    background: #5bc787;
    margin: 0 5px;
    padding: 4px 15px;
}

.download-button-2{
    height: 30px;
    margin: 0 5px;
    min-width: 30px;
}

.github-button{
    background: #333;
    border: 1px solid #333;
    display: block;
    line-height: 1.4286;
    margin-right: 20px;
    padding: 8px 16px;
}


.tooltip-bottom {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
}

.tooltip-bottom .tooltiptext-bottom {
    visibility: hidden;
    width: 200px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    top: 120%;
    left: 50%;
    margin-left: -100px;
    opacity: 0;
    transition: opacity 0.3s;
}

.tooltip-bottom .tooltiptext-bottom::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #555 transparent;
}

.tooltip-bottom:hover .tooltiptext-bottom {
    visibility: visible;
    opacity: 1;
}

` );
(function() {
    'use strict';
window.addEventListener('load', function(){
    var banner = document.getElementById('document-wrapper')
	if(banner != null){
		var banners = banner.childNodes;
		if (banners.length>3){
			banners[0].parentNode.removeChild(banners[0]);
		}
	}
    try{
        var premiumButton = document.getElementById('header-position-handle').childNodes[0].childNodes[1].childNodes[0].childNodes[1];
        premiumButton.parentNode.removeChild(premiumButton);
    }catch{console.log('Was not able to remove premiumButton!');}


	/* Mobile */
	if (window.innerWidth <= 990){
		var pages = document.getElementById('page-container').childNodes;
        let i=0;
		if(pages != null){
			for(i=0; i<pages.length; i++) {
				if(pages[i].id == ''){
					pages[i].parentNode.removeChild(pages[i]);
				}
			}
		}
	}
    try{
		var recomendations = document.getElementById('viewer-recommendations');
		if(recomendations != null){
			recomendations.parentNode.parentNode.removeChild(recomendations.parentNode);
		}
	}catch(err){
		console.log(err);
	}
    var pagess = document.getElementsByClassName('page-content');
    let i = 0;
    let j =0;;
    for(i=0; i<pagess.length; i++){
        var pagecontent=pagess[i].parentNode.childNodes;
        for(j=0; j<pagecontent.length; j++){
            if(pagecontent[j].className != "page-content"){
                pagecontent[j].parentNode.removeChild(pagecontent[j]);
            }
        }
        pagess[i].classList.add("nofilter");
    }
	const prev_buttons = document.getElementsByClassName("fa-cloud-arrow-down");
	if(prev_buttons.length > 0) {
		var button1 = document.createElement("button");
		button1.classList.add("download-button-1");
		button1.setAttribute("id","download-button-1");
		button1.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="fa-cloud-arrow-down" class="svg-inline--fa fa-cloud-arrow-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zm-132.9 88.7L299.3 420.7c-6.2 6.2-16.4 6.2-22.6 0L171.3 315.3c-10.1-10.1-2.9-27.3 11.3-27.3H248V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v112h65.4c14.2 0 21.4 17.2 11.3 27.3z"></path></svg><span style="margin-left: 5px">Download</span>';

		var button2 = document.createElement("button");
		button2.classList.add("download-button-2");
		button2.setAttribute("id","download-button-2");
		button2.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="fa-cloud-arrow-down" class="svg-inline--fa fa-cloud-arrow-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zm-132.9 88.7L299.3 420.7c-6.2 6.2-16.4 6.2-22.6 0L171.3 315.3c-10.1-10.1-2.9-27.3 11.3-27.3H248V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v112h65.4c14.2 0 21.4 17.2 11.3 27.3z"></path></svg><span style="margin-left: 5px">Download</span>';

		try{
			prev_buttons[0].parentNode.parentNode.prepend(button1);
			prev_buttons[1].parentNode.parentNode.removeChild(prev_buttons[1].parentNode);
		}catch(err){
			console.log(err);
		}
		try{
			prev_buttons[5].parentNode.parentNode.prepend(button2);
			prev_buttons[5].parentNode.parentNode.removeChild(prev_buttons[5].parentNode);
		}catch(err){
			console.log(err);
		}


		function downloadDoc(){
			var head = document.getElementsByTagName("head")[0].innerHTML;
			var tit = document.getElementsByTagName("h1")[0].innerHTML;
			var pages = document.getElementById('page-container').childNodes;

			for(i=0; i<pages.length; i++){
				pages[i].childNodes[0].style = "display: block;";
			}

			var pdf = pages[0].parentNode.parentNode.parentNode.innerHTML;

			var newWindow = window.open("", "Document", "height=865,width=625,status=yes,toolbar=no,menubar=no");
			newWindow.document.getElementsByTagName("head")[0].innerHTML = head + "<style> .nofilter{filter: none !important;} </style>" + "<style> @media print  {@page {size: A5;}}</style>";
			newWindow.document.title = tit;
			newWindow.document.getElementsByTagName("body")[0].innerHTML = pdf;
			newWindow.document.getElementsByTagName("body")[0].childNodes[0].style = "transform: scale(1); width: 100%; height: 100%;";

		}

		button1.onclick = function() {downloadDoc()};
		button2.onclick = function() {downloadDoc()};
	}
});
})();