// ==UserScript==
// @name         推特圖片自動 orig
// @namespace    https://www.plurk.com/SpyMomiji
// @version      1.2
// @description  推特圖片自動 orig，請先將圖片另開啟新分頁才會有效
// @author       SpyMomiji
// @match        ^https://pbs.twimg.com/media/*
// @run-at       document-start
// @noframes     true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472797/%E6%8E%A8%E7%89%B9%E5%9C%96%E7%89%87%E8%87%AA%E5%8B%95%20orig.user.js
// @updateURL https://update.greasyfork.org/scripts/472797/%E6%8E%A8%E7%89%B9%E5%9C%96%E7%89%87%E8%87%AA%E5%8B%95%20orig.meta.js
// ==/UserScript==

(function() {
    'use strict';

	if( location.hash.startsWith == '#r' ) return;

	var [_,imageID,spliter,args] = location.href.substr(28).match(/^([\w_-]*)(\?|\.)(.*)/);
	var format;
	var isOrig = false;

	if(!imageID) return;
	if( spliter == '?' ){
		args.split('&').forEach((v)=>{
			var [name,value] = v.split('=');
			switch(name){
				case 'format': format = value; break;
				case 'name': isOrig = value == 'orig'; break;
			}
		})
		if(!format) return;
	} else {
		var splited = args.match(/^(jpg|jpeg|png|webp)(:orig)?/i)
		if(!splited) return;
		format = splited[1].toLowerCase();
		isOrig = Boolean(splited[2]);
	}


	if(['jpg','png','jpeg'].includes(format)&&isOrig) return;
	window.stop();


	var tryFormat = format=='webp' ? ['jpg','png','jpeg','webp'] : [format];
	async function sendRequest(url){
		return new Promise(function(reslove,reject){
			var hr = new XMLHttpRequest();
			hr.onreadystatechange = function(state){
				if(hr.readyState != XMLHttpRequest.DONE) return;

				reslove( hr.status == 200 && hr.getResponseHeader('Content-Length') !== '0' );
			}

			hr.open("HEAD", url, true);
			hr.send();
		})
	}


	(async function(){
		var availableURL;

		if(
			format=='webp' &&(
			(await sendRequest(
				availableURL = `https://pbs.twimg.com/media/${imageID}.jpg:orig`
			)) ||
			(await sendRequest(
				availableURL = `https://pbs.twimg.com/media/${imageID}.png:orig`
			)) ||
			(await sendRequest(
				availableURL = `https://pbs.twimg.com/media/${imageID}.jpeg:orig`
			)) ||
			(await sendRequest(
				availableURL = `https://pbs.twimg.com/media/${imageID}.png`
			)) ||
			(await sendRequest(
				availableURL = `https://pbs.twimg.com/media/${imageID}.jpg`
			)) ||
			(await sendRequest(
				availableURL = `https://pbs.twimg.com/media/${imageID}.jpeg`
			)) ||
			(await sendRequest(
				availableURL = `https://pbs.twimg.com/media/${imageID}.webp:orig`
			)) ||
			(await sendRequest(
				availableURL = `https://pbs.twimg.com/media/${imageID}.webp`
			))
		)){
			location.href = availableURL + '#r';
		}

		else if(
			await sendRequest(
				availableURL = `https://pbs.twimg.com/media/${imageID}.${format}:orig`
			)
		){
			location.href = availableURL + '#r';
		}

		else {
			location.href = `https://pbs.twimg.com/media/${imageID}.${format}#r`
		}

	})();

})();