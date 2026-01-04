// ==UserScript==
// @name         Return download button on animaunt
// @namespace    AnimauntAddDownloadButton
// @version      1.1
// @license      MIT
// @author       Michael1297
// @description  Вернуть кнопку загрузки видео на сайт animaunt
// @match        https://animaunt.org/*
// @match        https://animaunt.tv/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488626/Return%20download%20button%20on%20animaunt.user.js
// @updateURL https://update.greasyfork.org/scripts/488626/Return%20download%20button%20on%20animaunt.meta.js
// ==/UserScript==

(function () {
	let button = document.createElement('a');
	button.className = 'player-tabs-list-win';
	button.target = '_blank';
	button.title = 'Скачать серию';
	button.innerHTML = '<span class="fa fa-download"></span>';
	
	button.addEventListener('click', function () {
        const iframe = document.querySelector("iframe");
        if(iframe && iframe.contentDocument) {
            const video = iframe.contentDocument.querySelector("video");
            if(video) {
                window.open(video.src);
            }
        }
    });	
	
	const menu = document.querySelector('.player-tabs-list');
	if(menu) {
		menu.appendChild(button);
	}    
})();