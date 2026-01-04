// ==UserScript==
// @name         Pixiv预览图片（单图、多图、动图）；顺便清除了历史记录页的灰色屏障
// @version      2.51
// @description  Pixiv 脚本（包括：预览单图、多p图片、动图；清除历史记录页的灰色屏障）;Pixiv Script(Include:Get Img Preview,Clear History Baffle)
// @author       your_chef
// @match        https://www.pixiv.net/*
// @include      https://www.pixiv.net/history.php
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/438784/Pixiv%E9%A2%84%E8%A7%88%E5%9B%BE%E7%89%87%EF%BC%88%E5%8D%95%E5%9B%BE%E3%80%81%E5%A4%9A%E5%9B%BE%E3%80%81%E5%8A%A8%E5%9B%BE%EF%BC%89%EF%BC%9B%E9%A1%BA%E4%BE%BF%E6%B8%85%E9%99%A4%E4%BA%86%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E9%A1%B5%E7%9A%84%E7%81%B0%E8%89%B2%E5%B1%8F%E9%9A%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/438784/Pixiv%E9%A2%84%E8%A7%88%E5%9B%BE%E7%89%87%EF%BC%88%E5%8D%95%E5%9B%BE%E3%80%81%E5%A4%9A%E5%9B%BE%E3%80%81%E5%8A%A8%E5%9B%BE%EF%BC%89%EF%BC%9B%E9%A1%BA%E4%BE%BF%E6%B8%85%E9%99%A4%E4%BA%86%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E9%A1%B5%E7%9A%84%E7%81%B0%E8%89%B2%E5%B1%8F%E9%9A%9C.meta.js
// ==/UserScript==

(function() {
	'use strict';
	setTimeout(function() {
		console.log('[@Pixiv Script] Script On');
		//==========[Get Img Preview]==========
		let checkInterval = setInterval(function() {
			let allImg = document.querySelectorAll('img');
			for (let i = 0; i < allImg.length; i++) {
				if (/(sc-rp5asc-10 erYaF|sc-rp5asc-10 zLpvh|sc-rp5asc-10 hkxipx|sc-1b4yl3n-2 hgPJLQ|sc-7bef31-2 cMHbWo)/
					.test(allImg[i].getAttribute('class'))) {
					clearInterval(checkInterval);
					allImg = null;
					startGetImg();
					break;
				}
			}
		}, 100)
		function startGetImg() {
			console.log('[@Pixiv Script] {Get Img Preview}');
			let img = [];
			let imgEventState = [];
			let currentImg = 1;
			let imgDisplay = document.createElement('img');
			let imgScanButton = document.createElement('div');
			let amountImgCountDiv = document.createElement('div');
			let playGIFInterval;
			let loadGIFCheckInterval;
			function loadGIF(loadGIF_img,loadGIF_ajax){
				loadGIFCheckInterval = setInterval(function(){
					if(imgDisplay.getAttribute('imgLoad') == imgDisplay.getAttribute('isGIF') && imgDisplay.getAttribute('isGIF') < loadGIF_ajax.amount-1){
						imgDisplay.setAttribute('isGIF', Number(Number(imgDisplay.getAttribute('isGIF'))+1));
						imgDisplay.src = 'https://i.pximg.net/img-original/img/' + /\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{8}/.exec(loadGIF_img.currentSrc)[0] + '_ugoira' + imgDisplay.getAttribute('isGIF') + '.jpg';
						loadGIF_ajax.load = imgDisplay.getAttribute('isGIF')
					}
					if(loadGIF_ajax.load == loadGIF_ajax.amount-1){
						clearInterval(loadGIFCheckInterval);
						loadGIF_ajax.load = 'ok';
						playGIF(loadGIF_img,loadGIF_ajax);
					}
					amountImgCountDiv.innerText = Number(/\d+/.exec(/(ugoira)\d+/.exec(imgDisplay.src)[0])[0])+1 + '/' + imgDisplay.getAttribute('GIFAmount')
				},250)
			}
			function playGIF(loadGIF_img,loadGIF_ajax){
				for(let k = 0;k<loadGIF_ajax.amount;k++){
					setTimeout(function(){
						imgDisplay.src = 'https://i.pximg.net/img-original/img/' + /\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{8}/.exec(loadGIF_img.currentSrc)[0] + '_ugoira' + k + '.jpg'
						amountImgCountDiv.innerText = Number(/\d+/.exec(/(ugoira)\d+/.exec(imgDisplay.src)[0])[0])+1 + '/' + imgDisplay.getAttribute('GIFAmount')
					},loadGIF_ajax.delay*k)
				}
				playGIFInterval = setInterval(function(){
					for(let k = 0;k<loadGIF_ajax.amount;k++){
						setTimeout(function(){
							imgDisplay.src = 'https://i.pximg.net/img-original/img/' + /\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{8}/.exec(loadGIF_img.currentSrc)[0] + '_ugoira' + k + '.jpg'
							amountImgCountDiv.innerText = Number(/\d+/.exec(/(ugoira)\d+/.exec(imgDisplay.src)[0])[0])+1 + '/' + imgDisplay.getAttribute('GIFAmount')
						},loadGIF_ajax.delay*k)
					}
				},loadGIF_ajax.delay*loadGIF_ajax.amount)
			}
			document.querySelector('body').appendChild(amountImgCountDiv);
			amountImgCountDiv.style = 'display: none;';
			amountImgCountDiv.id = 'amountImgCountDivId'
			document.querySelector('body').appendChild(imgScanButton);
			document.querySelector('body').appendChild(imgDisplay);
			imgDisplay.style = 'display: none;';
			imgDisplay.id = 'imgDisplayId';
			let imgScanButtonCssId = document.createElement('style');
			imgScanButtonCssId.type = 'text/css';
			imgScanButtonCssId.innerHTML =
				"#imgScanButtonCssId{width: 100px;height: 35px;line-height: 35px;text-align: center;color: #0097f9;cursor: pointer;border: 1px solid #0097f9;transition: all 200ms ease-in;border-radius: 5px;overflow: hidden;position: fixed;top: 80%;right: 0.3%;z-index=11;}";
			document.getElementsByTagName('head').item(0).appendChild(imgScanButtonCssId);
			imgScanButton.id = 'imgScanButtonCssId'
			imgScanButton.innerText = 'Get Preview'
			imgScanButton.addEventListener('mouseover', function() {
				imgScanButton.style =
					'color: #ffffff;background-color: #0097f9;'
			})
			imgScanButton.addEventListener('mousedown', function() {
				imgScanButton.style =
					'color: #ffffff;border: 1px solid #0085d8;transition: all 100ms ease-in;background-color: #0085d8;'
			})
			imgScanButton.addEventListener('mouseout', function() {
				imgScanButton.style = '';
			})
			imgScanButton.addEventListener('click', function() {
				let allImg = document.querySelectorAll('img');
				let tempImg = [];
				let tempImgStart = 0;
				for (let i = 0; i < allImg.length; i++) {
					if (/(sc-rp5asc-10 erYaF|sc-rp5asc-10 zLpvh|sc-rp5asc-10 hkxipx|sc-1b4yl3n-2 hgPJLQ)/
						.test(allImg[i].getAttribute('class'))) {
						tempImg.push(allImg[i]);
					}
				}
				if(img.length != 0){
					for (let i = 0;i< img.length;i++){
						if(img[i] == tempImg[0]){
							tempImgStart = i;
							break;
						}
					}
				}
				for(let i = 0;i<tempImg.length;i++){
					if(tempImg[i] != img[tempImgStart + i]){
						img.splice(tempImgStart + i,0,tempImg[i]);
						imgEventState.splice(tempImgStart + i,0,1);
					}
				}
				allImg = null;
				tempImg = null;
				tempImgStart = null;
				let gifAjaxArray = [];
				for (let i = 0; i < img.length; i++) {
					if (imgEventState[i]) {
						if(img[i].getAttribute('class') == 'sc-rp5asc-10 hkxipx'){
							img[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style =
								'background-color: rgba(0,151,249,0.1);';
						}else if(img[i].getAttribute('class') == 'sc-rp5asc-10 zLpvh'){
							img[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style =
								'border-bottom: 3px solid rgba(0,151,249,0.5);';
						}else if (img[i].parentNode.parentNode.parentNode.parentNode.getAttribute('type') =='illust') {
							img[i].parentNode.parentNode.parentNode.parentNode.parentNode.style =
								'background-color: rgba(0,151,249,0.1);border-radius: 8px;';
						}
						if(img[i].parentNode.children[1]){
							let getGifAjax = new XMLHttpRequest();
							getGifAjax.open('get','https://www.pixiv.net/ajax/illust/' + /[0-9]{8}/.exec(img[i].currentSrc)[0] + '/ugoira_meta',true)
							getGifAjax.send()
							getGifAjax.onreadystatechange=function(){
								if(getGifAjax.readyState == 4 && getGifAjax.status == 200){
									gifAjaxArray.push({'id':/\d{8}/.exec(JSON.parse(getGifAjax.responseText).body.src)[0],'amount': JSON.parse(getGifAjax.responseText).body.frames.length,'load':'0','delay': JSON.parse(getGifAjax.responseText).body.frames[0].delay})
									getGifAjax = null;
								}
							}
						}
						img[i].addEventListener('mousemove', function() {
							let mouseX = event.clientX;
							let mouseY = event.clientY;
							if ((Number(document.body.clientWidth) - mouseX) < Number(document.body.clientWidth) / 2) {
								imgDisplay.style =
									'object-fit:contain;position: fixed;left: 0px;top: 0px;display: block;max-height: 100%;width: ' +
									Number(mouseX - document.body.clientWidth*0.04) +
									'px;background-color: rgba(0, 0, 0, 0.1);alt: "loading";z-index: 100;'
							} else {
								imgDisplay.style =
									'object-fit:contain;position: fixed;right: 0px;top: 0px;display: block;max-height: 100%;width: ' +
									Number(document.body.clientWidth - mouseX - document.body.clientWidth*0.04) +
									'px;background-color: rgba(0, 0, 0, 0.1);alt: "loading";z-index: 100;'
							}
							
							if(img[i].parentNode.children[1] && gifAjaxArray){
								if(!imgDisplay.getAttribute('isGIF') && (!/\d{8}/.exec(imgDisplay.src) || /\d{8}/.exec(imgDisplay.src)[0] != /\d{8}/.exec(img[i].currentSrc)[0])){
									imgDisplay.src = 'https://i.pximg.net/img-original/img/' + /\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{8}/.exec(img[i].currentSrc)[0] + '_ugoira0.jpg'
									imgDisplay.setAttribute('isGIF',/\d+/.exec(/(ugoira)\d+/.exec(imgDisplay.src)[0])[0]);
								}
								for (let j in gifAjaxArray){
									if(gifAjaxArray[j].id == /\d{8}/.exec(img[i].currentSrc)[0]){
										imgDisplay.setAttribute('GIFAmount',gifAjaxArray[j].amount);
										if(gifAjaxArray[j].amount-1 == imgDisplay.getAttribute('isGIF')){
											gifAjaxArray[j].load = 'ok';
										}
										if(gifAjaxArray[j].load != 'ok' && !loadGIFCheckInterval){
											loadGIF(img[i],gifAjaxArray[j]);
										}
										if(gifAjaxArray[j].load == 'ok' && !playGIFInterval){
											playGIF(img[i],gifAjaxArray[j]);
										}
									}
								}
							}
							if(img[i].parentNode.parentNode.children[1].children[1] || img[i].parentNode.children[1] || (img[i].parentNode.parentNode.children[1].children[0] && img[i].parentNode.parentNode.children[1].children[0].children[0] && img[i].parentNode.parentNode.children[1].children[0].children[0].children[1])){
								if(imgDisplay.style.left){
									amountImgCountDiv.style = 'color: #fff;font-size: 18px;text-align: center;line-height:30px;padding:0 10px;position: fixed;top: 10px;left: 10px;display: block;height:30px;background-color: rgba(0,151,249,0.55);border-radius: 30px;z-index: 101;'
								}else {
									amountImgCountDiv.style = 'color: #fff;font-size: 18px;text-align: center;line-height:30px;padding:0 10px;position: fixed;top: 10px;right: 10px;display: block;height:30px;background-color: rgba(0,151,249,0.55);border-radius: 30px;z-index: 101;'
								}
								if(img[i].parentNode.parentNode.children[1].children[1]){
									imgDisplay.setAttribute('isMultImg','1');
									amountImgCountDiv.innerText = currentImg + '/'+ img[i].parentNode.parentNode.children[1].children[1].children[0].children[1].textContent;
								}else if(img[i].parentNode.parentNode.children[1].children[0] && img[i].parentNode.parentNode.children[1].children[0].children[0].children[1]){
									imgDisplay.setAttribute('isMultImg','1');
									amountImgCountDiv.innerText = currentImg + '/'+ img[i].parentNode.parentNode.children[1].children[0].children[0].children[1].textContent;
								}
							}
							if(!img[i].parentNode.children[1] && (!/\d{8}/.exec(imgDisplay.src) || /\d{8}/.exec(imgDisplay.src)[0] != /\d{8}/.exec(img[i].currentSrc)[0])){
								if(imgDisplay.getAttribute('isMultImg')){
									imgDisplay.src = 'https://pixiv.cat/' + /[0-9]{8}/.exec(img[i].currentSrc)[0] + '-' + currentImg + '.png';
								}else{
									imgDisplay.src = 'https://pixiv.cat/' + /[0-9]{8}/.exec(img[i].currentSrc)[0] + '.png';
								}
							}
						},true)
						imgDisplay.src
						img[i].addEventListener('mouseout', function() {
							imgDisplay.src = '';
							imgDisplay.style = 'display:none;';
							imgDisplay.removeAttribute('isMultImg');
							imgDisplay.removeAttribute('isGIF');
							imgDisplay.removeAttribute('GIFAmount');
							amountImgCountDiv.style = 'display:none;';
							currentImg = 1;
							if(img[i].parentNode.children[1] && gifAjaxArray){
								clearInterval(playGIFInterval);
								clearInterval(loadGIFCheckInterval);
								playGIFInterval = 0;
								loadGIFCheckInterval = 0;
							}
						})
						imgEventState[i] = 0;
					}
				}
			})
			imgDisplay.addEventListener('load', function(){
				if (imgDisplay.getAttribute('isGIF')) {
					imgDisplay.setAttribute('imgLoad', imgDisplay.getAttribute('isGIF'))
				}
			})
			document.addEventListener('keydown', function(event){
				if (imgDisplay.getAttribute('isMultImg')) {
					if (event.keyCode == 37) {
						if(currentImg == 1){
							currentImg = Number(/[0-9]+$/.exec(amountImgCountDiv.innerText)[0])
						}else{
							currentImg -= 1;
						}
					}else if(event.keyCode == 39){
						if(currentImg == Number(/[0-9]+$/.exec(amountImgCountDiv.innerText)[0])){
							currentImg = 1;
						}else{
							currentImg += 1;
						}
					}
					amountImgCountDiv.innerText = currentImg + '/'+ /[0-9]+$/.exec(amountImgCountDiv.innerText)[0];
					imgDisplay.src = imgDisplay.src.replace(/\-[0-9]/,'-'+currentImg)
				}
				if(event.keyCode == 90 && event.altKey){
					imgScanButton.click();
				}
			})
		}

		//==========[Clear History Baffle]==========
		if (document.querySelector('._history-items')) {
			console.log('[@Pixiv Script] {Clear History Baffle}');
			let historyImg = document.querySelector('._history-items');
			for (let i in historyImg.children) {
				if (/(SPAN)/.test(historyImg.children[i].nodeName)) {
					let newHistoryImg = document.createElement("newHistoryImg");
					newHistoryImg.innerHTML = '<a href="/artworks/' + /[0-9]{8}/.exec(historyImg.children[i]
							.outerHTML)[0] +
						'" target="_blank" class="_history-item show-detail list-item" rel="noreferrer" style="background-image: url(&quot;' +
						/(https).+(jpg)/.exec(historyImg.children[i].outerHTML)[0] +
						'&quot;);"><div class="status"><span class="_bookmark-icon-like-icon-font white"></span></div></a>'
					historyImg.replaceChild(newHistoryImg, historyImg.children[i])
				}
			}
			historyImg = null;
		}
	}, 1000)
})();