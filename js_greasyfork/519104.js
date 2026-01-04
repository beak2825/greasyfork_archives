// ==UserScript==
// @name         GBT scroller-coaster (GBTSC)
// @namespace    _pc
// @version      0.999
// @license      MIT
// @description  [BETA] Infinity scrolling for videos (main, search, channels) & photos (photos, search, channels)
// @author       verydelight
// @match        *://*.gayporntube.com
// @match        *://*.gayporntube.com/
// @match        *://*.gayporntube.com/channels/*
// @match        *://*.gayporntube.com/search/videos/*
// @match        *://*.gayporntube.com/photos/*
// @match        *://*.gayporntube.com/search/photos/*
// @connect      gayporntube.com
// @include      gayporntube.com
// @icon         https://www.gayporntube.com/favicon.ico
// @run-at       document-end
// @compatible   Firefox Tampermonkey
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @grant        GM_xmlHttpRequest
// @grant        GM.download
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/519104/GBT%20scroller-coaster%20%28GBTSC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519104/GBT%20scroller-coaster%20%28GBTSC%29.meta.js
// ==/UserScript==
'use strict';
const path = window.location.pathname;
if (
path === "" ||
path === "/" ||
path.startsWith("/channels") ||
path.startsWith("/search/videos") ||
path.startsWith("/photos") ||
path.startsWith("/search/photos")
){
	let area = window.location.pathname.split("/");
	let testArea,baseUrl
	let videoPage=false;
	const identifier = $('div[id]')[2].id;
	testArea = area[2] ? `${area[1]}/${area[2]}` : (area[1] || "videos");
	switch(testArea) {
		case "videos":
		baseUrl = "https://www.gayporntube.com/page";
		gbtScroller(identifier,baseUrl);
		videoPage = true;
		break;
		case "search/videos":
		baseUrl = "https://www.gayporntube.com/search/videos/"+area[area.length - 2]+"/page";
		gbtScroller(identifier,baseUrl);
		videoPage = true;
		break;
		case testArea.match(/^channels\/[0-9]{1,3}/)?.input:
		baseUrl = "https://www.gayporntube.com/channels/"+area[area.length - 3]+"/"+area[area.length - 2]+"/page";
		gbtScroller(identifier,baseUrl);
		videoPage = true;
		break;
		case "photos":
		baseUrl = "https://www.gayporntube.com/photos/page";
            console.log(baseUrl);
		gbtScroller(identifier,baseUrl);
		break;
		case "search/photos":
		baseUrl = "https://www.gayporntube.com/search/photos/"+area[area.length - 2]+"/page";
		gbtScroller(identifier,baseUrl);
		break;
		case "photos/channels":
		baseUrl = "https://www.gayporntube.com/photos/channels/"+area[area.length - 2]+"/page";
		gbtScroller(identifier,baseUrl);
		break;
		default:
	}
	function gbtScroller(identifier,baseUrl){
		const style = document.createElement('style')
		style.type = 'text/css';
		style.textContent = `.gbtloader {
			width: 60px;
			display: block;
			aspect-ratio: 4;
			background: radial-gradient(circle closest-side,#009ec5CC 90%,#0000) 0/calc(100%/3) 100% space;
			clip-path: inset(0 100% 0 0);
			animation: l1 0.8s steps(4) infinite;
			transform: translate(10px, 10px);
		}
		@keyframes l1 {
			to {clip-path: inset(0 -34% 0 0);}
		}`;
		document.head.appendChild(style);
		let videoListing = document.getElementById(identifier);
		videoListing.nextElementSibling.remove();
		let loadTrigger = document.createElement("postloader");
		loadTrigger.id = 'postloader-1';
		loadTrigger.classList.add('item','item-col','gbtloader');
		//loadTrigger.append("(Loading...)");
		videoListing.append(loadTrigger)
		let target = videoListing.getElementsByTagName('postloader')[0];
		let options = {
			root: null,
			rootMargin: '0px',
			threshold: 0
		}
		let firstCallImminent = true;
		if (target.getBoundingClientRect().top < window.innerHeight && target.getBoundingClientRect().bottom > 0) {
			// The target is within the viewport
			//callback([{isIntersecting: true}]);
			firstCallImminent = false;
		}
		let observer = new IntersectionObserver(callback, options);
		if (target){ observer.observe(target); }
		function callback() {
			if(!firstCallImminent){
				observer.unobserve(target);
				var nextPage = parseInt(loadTrigger.id.split("-")[1])+1;
				var nextPageUrl = baseUrl+nextPage+".html";
				loadNextPage(nextPageUrl,nextPage);
				//firstCallImminent = true;
			}else{
				firstCallImminent = false;
			}
		}
		async function loadNextPage(url,nextPage) {
            console.log("loading:",url);
			try {
				const response = await GM.xmlHttpRequest({
					method: 'GET',
					responseType: 'document',
					url: url,
				});
				const newResults = response.response;
				var childResults = newResults.getElementById(identifier).children;
				while (childResults.length > 0)
				{
					if (videoPage){
						if(childResults[0].querySelector('img')){
							const firstChildNode = childResults[0].firstElementChild;
							const lastChildNode = childResults[0].lastElementChild;
							const newWrapper = document.createElement("div");
							newWrapper.classList.add("item", "item-col");
							const aImg = childResults[0].querySelector('a');
							aImg.removeAttribute('class');
							aImg.setAttribute("data-title",aImg.title);
							aImg.removeAttribute('title');
							aImg.classList.add("image");
							const videoImage = firstChildNode.querySelector('img');
							const videoElement = document.createElement("video");
							videoElement.alt = videoImage.getAttribute("alt");
							videoElement.poster = videoImage.getAttribute("data-src");
							videoElement.controls = false;
							videoElement.style.objectFit = "cover";
							videoElement.style.position = "absolute";
							videoElement.style.left = "0px";
							videoElement.style.top = "0px";
							videoElement.setAttribute('webkit-playsinline', 'true');
							videoElement.setAttribute('playsinline', 'true');
							videoElement.preload = "auto";
							videoElement.height = videoImage.getAttribute("height");
							videoElement.width = videoImage.getAttribute("width");
                            videoElement.muted = true;
							videoElement.addEventListener('mouseover', () => {
								if(!videoElement.src){
									const previewUrl = videoImage.getAttribute("data-preview");
                                    downloadPreview(previewUrl);
								}
                                //download needed to avoid CORS
								async function downloadPreview(url) {
									try {
										const response = await GM.xmlHttpRequest({
											method: 'GET',
											responseType: 'blob',
											url: url,
											headers: {
												"Content-Type": "video/mp4", "Accept": "video/mp4"
											},
										});
										const blob = new Blob([response.response],{type: 'video/mp4'});
										videoElement.src = URL.createObjectURL(blob);
									} catch (err) {
										console.error("GBTSC: Error in fetching and downloading preview file:", err);
									}
								}
								videoElement.play();
							});
							videoElement.addEventListener('mouseleave', () => {
								videoElement.style.display = 'none';
								videoElement.load();
							});
							videoImage.addEventListener('mouseenter', () => {
								videoElement.style.display = '';
								videoElement.load();
							});
							videoElement.style.display = 'none';
							newWrapper.append(firstChildNode);
							videoImage.insertAdjacentElement('afterend', videoElement)
							newWrapper.append(lastChildNode);
							videoListing.appendChild(newWrapper);
						}else{
							childResults[0].remove()
						}
					}else{
						videoListing.appendChild(childResults[0]);
					}
				}
				//firstCallImminent = true;
                loadTrigger.remove();
				loadTrigger.id = 'postloader-'+nextPage;
				videoListing.append(loadTrigger);
				if (target.getBoundingClientRect().top < window.innerHeight && target.getBoundingClientRect().bottom > 0) {
                    firstCallImminent = false;
                }else{
                    firstCallImminent = true;
                }
                //console.log("appended");
				observer.observe(target);
			} catch (err) {
				console.error("GBTSC: Error in fetching and downloading next videos:", err);
				observer.unobserve(target);
				loadTrigger.remove();
			}
            console.log("loaded: ",url);
		}
	}
}