// ==UserScript==

// @name            topface.com Like By Press 1
// @name:en         topface.com Like By Press 1
// @name:ru         topface.com Лайк по нажатию 1
// @version         1.3.0
    //Upgrade and rewrite code (remove jQuery, using native js)
    //and dislike
// @description  Automate click like button for any person on the dating page - press 1, dislike(skip) - press 2.
// @description:en  Automate click like button for any person on the dating page - press 1, dislike(skip) - press 2.
// @description:ru  Автоматическое нажатие(1 кнопка) по симпатии(лайк) для любого человека на странице свиданий(dating), дизлайк нажать 2 

// @author          Paul Malyarevich
// @contributor     malyarevich

// @connect         topface.com
// @include         https://topface.com/*
// @include         https://apps.facebook.com/topface/*
// @include         https://vk.com/topface?*
// @include         https://vk.com/app2257829?*

// @run-at          document-start
// @encoding        utf-8
// @namespace       https://greasyfork.org/users/217675

// @downloadURL https://update.greasyfork.org/scripts/372903/topfacecom%20Like%20By%20Press%201.user.js
// @updateURL https://update.greasyfork.org/scripts/372903/topfacecom%20Like%20By%20Press%201.meta.js
// ==/UserScript==



document.addEventListener("keydown", function(e){
	if(e.key === "1") {
		if (document.querySelector("div.starry.likes-buttons-wrapper")) {
			document.querySelector("div.starry.likes-buttons-wrapper .dating-button-sympathy").click();
		}
		if (document.querySelector("div.td-rd-container-profile-info-panel")) {
			document.querySelector("div.td-rd-container-profile-info-panel .tf-rd-buttons-like-effect").click();
		}
	} else if (e.key === "2") {
		if (document.querySelector("div.starry.likes-buttons-wrapper")) {
			document.querySelector("div.starry.likes-buttons-wrapper .dating-button-skip").click();
		}
		if (document.querySelector("div.td-rd-container-profile-info-panel")) {
			document.querySelector("div.td-rd-container-profile-info-panel .tf-rd-buttons-skip-effect").click();
		}
	} else if (e.key === "3") {
		if (document.querySelector("div.starry.likes-buttons-wrapper")) {
			document.querySelector("div.starry.likes-buttons-wrapper .dating-button-skip").click();
		}
		if (document.querySelector("div.td-rd-container-profile-info-panel")) {
			document.querySelector("div.td-rd-container-profile-info-panel>a").click();
		}
	}
    }
);
