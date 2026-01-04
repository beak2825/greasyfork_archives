// ==UserScript==
// @name		Favstar Pro - Best Tweet Unlocker
// @name:ru		Favstar Pro - Лучший разблокировать Tweet
// @name:es		Favstar Pro - Mejor desbloqueador de tweets
// @description		Automatically unlocks the Best Tweet on any user's profile.
// @description:ru	Автоматически разблокирует Best Tweet в профиле любого пользователя.
// @description:es	Desbloquea automáticamente el mejor tweet en el perfil de cualquier usuario.
// @namespace		iamMG
// @author		iamMG
// @version		1.0.1
// @icon		https://i.imgur.com/OUZgZDE.jpg
// @match		https://favstar.fm/users/*
// @match		http://favstar.fm/users/*
// @run-at		document-end
// @license		MIT
// @grant		none
// @copyright		2018, iamMG (https://openuserjs.org/users/iamMG)
// @downloadURL https://update.greasyfork.org/scripts/42419/Favstar%20Pro%20-%20Best%20Tweet%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/42419/Favstar%20Pro%20-%20Best%20Tweet%20Unlocker.meta.js
// ==/UserScript==

document.querySelector(".redacted").querySelector(".fs-tweet-text").innerHTML = document.querySelector(".redacted").dataset.model.split(/("text":"|","profile_image_url")/)[2].replace(/\\"/g, ''); //replaces "Gift Favstar Pro!" overlay with the actual tweet content.
document.querySelector(".redacted").classList.remove("redacted");	//removes redaction of the tweet.