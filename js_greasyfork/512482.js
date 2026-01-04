// ==UserScript==
// @name         Download button on malfurik
// @namespace    MalfurikDownloadButton
// @version      1.1
// @license      MIT
// @author       Michael1297
// @description  Кнопка загрузки видео на сайт malfurik
// @match        *://*.malfurik.*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512482/Download%20button%20on%20malfurik.user.js
// @updateURL https://update.greasyfork.org/scripts/512482/Download%20button%20on%20malfurik.meta.js
// ==/UserScript==

function createDownloadButtonText(watchButton, textContent) {
	//Текст внутри кнопки "Смотреть онлайн"
	let watchButtonText = watchButton.querySelector('span');
	if(!watchButtonText) {
		return;
	}
	
	//Текст внутри кнопки скачать
	let downloadButtonText = document.createElement('span');
	downloadButtonText.textContent = textContent;
	downloadButtonText.style.marginRight = '0px';
	downloadButtonText.className = watchButtonText.className;
	
	//Значок загрузки внутри кнопки скачать
	let downloadButtonSign = document.createElement('i');
	downloadButtonSign.className = "fa fa-download";
	downloadButtonSign.ariaHidden = "";
	downloadButtonText.appendChild(downloadButtonSign);
	
	//Цвет кнопки синхронизировать с цветом кнопки у кнопки "Смотреть онлайн"
	const observer = new MutationObserver(() => {
		downloadButtonText.className = watchButtonText.className;
	});
	observer.observe(watchButtonText, {
		childList: true,
		subtree: true,
		attributeFilter: ['class']
	});
	
	return downloadButtonText;
}


(function () {
	//Меню с кнопками
	let menu = document.querySelector('.pmovie__player-controls');
	
	//Встроеная кнопка "Скачать сезон" иногда присутствует на странице
	let downloadButtonSeason = document.querySelector('.pmovie__player  a.download__top');
	
	//Кнопка "Смотреть онлайн"
	let watchButton = document.querySelector('.pmovie__player  .tabs-block__select');
	if(!menu && !watchButton && !watchButton.querySelector('span')) {
		return;
	}	

	//Кнопка скачать
	let downloadButton = document.createElement('div');
	downloadButton.className = `tabs-block__select d-flex flex-grow-${downloadButtonSeason ? '1' : '2'}`;
	downloadButton.title = 'Скачать серию';	
	downloadButton.appendChild(createDownloadButtonText(watchButton, 'Скачать \u00A0'));	
	
	downloadButton.addEventListener('click', function () {
		let video = document.querySelector('.plyr__video-wrapper > video')
		if(video && video.src) {
			window.open(video.src);
        }
    });	
	
	//добавить кнопку скачать
	watchButton.parentNode.insertBefore(downloadButton, watchButton.nextSibling);
	
	if(downloadButtonSeason) {
		const href = downloadButtonSeason.href;		
		downloadButtonSeason.remove();
		downloadButtonSeason = document.createElement('a');
		downloadButtonSeason.className =  'tabs-block__select d-flex flex-grow-2';
		downloadButtonSeason.href = href;
		downloadButtonSeason.appendChild(createDownloadButtonText(watchButton, 'Скачать сезон \u00A0'));		
		
		menu.appendChild(downloadButtonSeason);
	}
})();