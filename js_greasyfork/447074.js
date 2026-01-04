// ==UserScript==
// @name         Twitter Endless Scroll [X]
// @namespace    Twitter
// @version      1.8
// @description  Endless scrolling between image posts with mousewheel
// @author       NightLancerX
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      CC-BY-NC-SA
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/447074/Twitter%20Endless%20Scroll%20%5BX%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/447074/Twitter%20Endless%20Scroll%20%5BX%5D.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const DEBUG = false;

	let nextPost, shifted = false, lastIndex = 0;
	let img = new Image();
	let block_selector = 'article' //'li[role="listitem"]'
	let content_selector = 'img[src*="https://pbs.twimg.com/media/"]'; //, img[src*="pbs.twimg.com/tweet_video_thumb/"]';//, img[src*="pbs.twimg.com/amplify_video_thumb/"]';
	let offset_selector = '[data-testid="cellInnerDiv"]'

	function changePost(shift, useFirst = true){
		let posts = [...document.querySelectorAll(`${block_selector}:has(${content_selector})`)];
		if (DEBUG) console.log(posts);
		let index = posts.indexOf(document.querySelector(`${block_selector}:has([href='${location.pathname}'])`));
		if (DEBUG) console.log(`lastIndex: ${lastIndex}`);
		if (DEBUG) console.log(`index: ${index}`);
		if (index<0){ //needed anymore?
			index = lastIndex;
		}

		nextPost = posts[index+shift];
		if (DEBUG) console.log(nextPost);

		if (nextPost){
			nextPost.scrollIntoView();
			let elements = nextPost.querySelectorAll(content_selector);
			((elements.length==1 || useFirst) ? elements[0] : elements[elements.length - 1])?.click();
			shifted = true;
			lastIndex = index+shift;
		}
	}

	function check(){
		if (location.pathname.endsWith("/media"))
			block_selector = 'li[role="listitem"]'
		else if (!location.pathname.includes("/status/"))
			block_selector = 'article'
		console.log("block_selector:", block_selector);
	}

	$(function() {
		check(); // initial page load

		document.body.addEventListener("click", (e) => {
			const target = e.target.closest(`
            a[href$="/media"],
            a[href$="/home"],
			a[href$="/${location.pathname.match(/^\/([^\/]+)/)?.[1]}"],
            [data-testid="app-bar-back"]
        `);
			if (target) check();
		});
	});

	function image_count(){
		return document.querySelectorAll(`${block_selector} [href*='${location.pathname.replace(/\/\d+$/, "")}']`)?.length ?? 0
	}

	$('body').on('wheel', '[aria-labelledby="modal-header"]', function(e){
		e.preventDefault();
		e.stopPropagation();

		let left;
		if (e.originalEvent.deltaY < 0){
			if ((left = document.querySelector('[data-testid="Carousel-NavLeft"]')) && image_count() > 1){
				left.click();
			}
			else
				changePost(-1, false);
		}

		let right;
		if (e.originalEvent.deltaY > 0){
			if ((right = document.querySelector('[data-testid="Carousel-NavRight"]')) && image_count() > 1){
				right.click();
			}
			else
				changePost(+1);
		}
	});

	$('body').on('click', '[aria-labelledby="modal-header"] [data-testid="swipe-to-dismiss"]', function(e){
		if (shifted) setTimeout(()=>{
			let offset = nextPost?.closest(`${offset_selector}`).style.transform.match(/\d+/)?.[0];
			window.scroll(0, offset);
			shifted = false;
		}, 500);
	})
})();