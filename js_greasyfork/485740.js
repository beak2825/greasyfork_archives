// ==UserScript==
// @name         Record Clicked Javarchive Post
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @author       Ian Yu
// @description  Save your time to click the same post again and again on Javarchive, and make the post gray if you have clicked it before.
// @match        https://javarchive.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485740/Record%20Clicked%20Javarchive%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/485740/Record%20Clicked%20Javarchive%20Post.meta.js
// ==/UserScript==
(function() {
	'use strict';
	
	// 功能 1. 記錄已開啟過的圖片
	var clicked = JSON.parse(localStorage.getItem('clicked')) || [];
	var posts = document.querySelectorAll(".category_news > ul:nth-child(1) > li")
	posts.forEach(function(post){
		var link = post.querySelector('a');
		var img = post.querySelector('img');
		var href = link.href;

		if(clicked.indexOf(href) !== -1){
			console.log('clicked href:', href);
			img.style.filter = 'grayscale(100%)';
		}

		link.addEventListener('click', function(e){
			e.preventDefault();

			if(clicked.indexOf(href) === -1){
				console.log('clicked href:', href);
				clicked.push(href);
				localStorage.setItem('clicked', JSON.stringify(clicked));
			}

			// 找到裡面的圖片，變成灰階
			img.style.filter = 'grayscale(100%)';
			window.location.href = href;
		});

		// 如果 link 是用中間鍵開啟，也要記錄
		link.addEventListener('auxclick', function(e){
			if(e.which === 2){
				//e.preventDefault();

				if(clicked.indexOf(href) === -1){
					console.log('clicked href:', href);
					clicked.push(href);
					localStorage.setItem('clicked', JSON.stringify(clicked));
				}

				// 找到裡面的圖片，變成灰階
				img.style.filter = 'grayscale(100%)';
			}
		});
	});

	// 功能 2. 顯示縮圖
	var links = document.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		if (links[i].innerText.indexOf("CLICK HERE!") != -1 && !localStorage.getItem(links[i].href)) {
		    console.log("CLICK HERE!:", links[i].href)
                    localStorage.setItem(links[i].href, 'true');
                    window.location.href = links[i].href;
                    break;
		}
	}
})();
