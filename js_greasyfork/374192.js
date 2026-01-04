// ==UserScript==

// @name            mamba.** button control
// @name:en         mamba.** button control
// @name:ru         mamba.** управление нажатием кнопок
// @version         1.0.2
    //next page result - 0
    //like - 1
    //dislike - 2
// @description  Button control for basic function, such as: Open next - press 0, Like person - press 1, Dislike(skip) - press 2.
// @description:en  Button control for basic function, such as: Open next - press 0, Like person - press 1, Dislike(skip) - press 2.
// @description:ru  Управление нажатием кнопок для основных функций, как: открыть следующую страницу - нажмите 0, Лайк - нажмите 1, Дизлайк(пропустить) - нажмите 2. 

// @author          Paul Malyarevich
// @contributor     malyarevich

// @connect         mamba.ua
// @include         https://mamba.*
// @include         */mamba.*
// @include         *.mamba.*
// @include         */wamba.*
// @include         *.wamba.*
// @include         https://*.mamba.ua/*
// @include         https://*.mamba.ru/*
// @include         https://*.mamba.com/*
// @include         https://*.mamba.us/*
// @include         https://*.mamba.net/*
// @include         https://*.mamba.uk/*
// @include         https://*.mamba.pl/*
// @include         https://apps.facebook.com/mamba/*
// @include         https://vk.com/mamba?*
// @include         https://*.mamba.*/
// @include         https://*mamba.*/
// @include         https://*wamba.*/
// @include         https://*.wamba.*/

// @run-at          document-start
// @encoding        utf-8
// @namespace       https://greasyfork.org/users/217675

// @downloadURL https://update.greasyfork.org/scripts/374192/mamba%2A%2A%20button%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/374192/mamba%2A%2A%20button%20control.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(e){
	if(e.view.stats.scriptName === "mamba:/search.phtml" || document.getElementById("Anketa_Info") ) {
		if(e.key === "0") {
			console.log("SEARCH")
			document.querySelector(".b-tile .b-tile__link:first-child").click();
		}
	}
	if(e.view.stats.scriptName === "mamba:/dispatcher.php" && !document.getElementById("Anketa_Info")) {
	
		console.log("DATING")
		if(e.key === "1") {
			document.querySelector(".photo-vote-ctrl-section-text").click();
		}
		if(e.key === "2") {
			document.querySelector(".button_white_zone .photo-vote-ctrl-section-link:last-child").click();
		}
	}
});