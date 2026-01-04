
// ==UserScript==
// @name            vk.com Like By Press 1, Dislike Press - 2
// @name:en         vk.com Like By Press 1, Dislike Press - 2
// @name:ru         vk.com Лайк по нажатию 1, Дизлайк - 2
// @version         1.1.0
    //Add dislike on press 2
// @description     Automate click like(1)/dislike(2) button for any 1st post on the page.
// @description:en     Automate click like(1)/dislike(2) button for any 1st post on the page.
// @author          Paul Malyarevich
// @contributor     malyarevich
// @connect         vk.com
// @include         https://vk.cc/*
// @include         https://vk.com/*
// @include         https://www.vk.com/*
// @run-at          document-start
// @encoding        utf-8
// @namespace https://greasyfork.org/users/217675
// @downloadURL https://update.greasyfork.org/scripts/372902/vkcom%20Like%20By%20Press%201%2C%20Dislike%20Press%20-%202.user.js
// @updateURL https://update.greasyfork.org/scripts/372902/vkcom%20Like%20By%20Press%201%2C%20Dislike%20Press%20-%202.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(e){
	if(e.key === "1") {
		document.querySelector("div.post_info > div.like_wrap > div.like_cont > div.like_btns > a.like_btn.like._like:not(.active)").scrollIntoView({block: "end", inline: "nearest"});
		document.querySelector("div.post_info > div.like_wrap > div.like_cont > div.like_btns > a.like_btn.like._like:not(.active)").click();
	} else if(e.key === "2") {
		document.querySelector("div.post_info > div.like_wrap > div.like_cont > div.like_btns > a.like_btn.like._like.active").scrollIntoView({block: "end", inline: "nearest"});
		document.querySelector("div.post_info > div.like_wrap > div.like_cont > div.like_btns > a.like_btn.like._like.active").click();
	}
})