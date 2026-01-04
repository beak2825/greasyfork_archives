// ==UserScript==
// @name         Youtube_NG_title
// @namespace    https://greasyfork.org/ja/users/1023652
// @version      1145141919810.0.5
// @description  NGワードに設定した単語がタイトルに入っていたら消します。
// @author       ゆにてぃー
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464584/Youtube_NG_title.user.js
// @updateURL https://update.greasyfork.org/scripts/464584/Youtube_NG_title.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const NG_word = [
		"反応",
		"2ch",
	]
	const desktop_selector = {'video_list_field': 'ytd-rich-item-renderer,ytd-compact-video-renderer','video_title': '[id=video-title]'};
	const mobile_selector = {'video_list_field': 'ytm-rich-item-renderer,ytm-compact-video-renderer','video_title': '.media-item-headline>.yt-core-attributed-string'};
	var env_selector;
    if(document.location.href.match(/https?:\/\/m\.youtube\.com\/.*/)){
		env_selector = mobile_selector;
    }else{
		env_selector = desktop_selector;
    }
	let currentUrl = document.location.href;
	locationChange();
	var already_acquisition_arr = {};
	let updating = false;
	window.addEventListener("scroll", update);
	init();
	function remove_NG_contents(target){
		target.forEach((target_node,index)=>{
			if(NG_word.some(word => target_node.querySelector(env_selector.video_title).innerText.includes(word))){
				console.log(`del: ${target_node.querySelector(env_selector.video_title).innerText}`)
				//target_node.setAttribute("style","display:none");
				target_node.remove();
			}
			target_node.setAttribute("is_title_check","true");
		})
	}
	function init() {
		remove_NG_contents(document.querySelectorAll(`${env_selector.video_list_field}:not([is_title_check="true"])`));
	}
	function update() {
		if(updating) return;
		updating = true;
		init();
		setTimeout(() => {updating = false;}, 1000);
	}

	function locationChange() {
		const observer = new MutationObserver(mutations => {
			mutations.forEach(() => {
				if(currentUrl !== document.location.href) {
					currentUrl = document.location.href;
					init();
					remove_NG_contents(document.querySelectorAll(`${env_selector.video_list_field}:not([is_title_check="true"])`));
				}
			});
		});
		const target = document.body;
		const config = {childList: true,subtree: true};
		observer.observe(target, config);
	}
	function replace_null_to_something(input_character,replace_character = " "){
		if(input_character === null || input_character === undefined || input_character === ""){
			return replace_character;
		}else{
			return input_character;
		}
	}
})();