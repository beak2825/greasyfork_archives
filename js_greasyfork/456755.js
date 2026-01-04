/* 
	meduza.io photo downloader

	Copyright (C) 2022 T1mL3arn

	This program is free software: you can redistribute it and/or modify 
	it under the terms of the GNU General Public License as published by 
	the Free Software Foundation, version 3. 

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	You should have received a copy of the GNU General Public License
	along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name        meduza.io photo downloader
// @description The script lets you download photos from meduza.io in max quality. It adds 2 buttons to each downloadable photo. One of the buttons opens the photo in a new tab in max quality, the second one downloads the photo.
// @description:ru Скрипт позволяет скачивать фотографии с meduza.io в максимальном качестве. Он добавляет две кнопки для каждой фотографии, которую можно скачать. Одно кнпока открывает фотографию в новой вкладке в максимальном качестве, другая скачивает фотографию.
// @version     1.0.3
// @match       https://meduza.io/*
// @grant       none
// @author      T1mL3arn
// @icon				https://pbs.twimg.com/profile_images/1315630633952202757/JDNwKd7P_200x200.png
// @license			GPL-3.0-only
// @namespace https://greasyfork.org/users/51268
// @downloadURL https://update.greasyfork.org/scripts/456755/meduzaio%20photo%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/456755/meduzaio%20photo%20downloader.meta.js
// ==/UserScript==

const DOWN_BUTTONS_CONTAINER_WRAPPER_PROP = 'mdz-photo-buttons-wrap'
const DOWN_BUTTONS_CONTAINER_CLASS = 'mdz-photo-buttons'
const DOWN_BUTTONS_CONTAINER_PROP = DOWN_BUTTONS_CONTAINER_CLASS
const BUTTON_CLASS = 'mdzd-button'
const BUTTON_CLASS__DOWN = 'mdzd-button--dl'
const BUTTON_CLASS__TAB = 'mdzd-button--tab'
const PROCESSED_FIGURE_ATTR_NAME = 'mdzd-processed'

const CSS = `

.${DOWN_BUTTONS_CONTAINER_CLASS} {
	box-sizing: border-box;
	position: absolute;
	right: 12px;
	/* original button 12px padding + its height 40px + margin 12px*/
	bottom: 64px;

	display: flex;
	flex-flow: column;

	opacity: 0;
	transition: opacity 0.25s ease;
	pointer-events: none;
}

/* disable buttons for small avatar pictures (buttons still available in fullscreen) 
*/
.EmbedBlock-module_xs__PNHGz .${DOWN_BUTTONS_CONTAINER_CLASS} {
	display: none;
}

.${DOWN_BUTTONS_CONTAINER_CLASS} > *:not(:last-child) {
	margin-bottom: 12px;
}

.Image-module_root__H5wAh:hover .${DOWN_BUTTONS_CONTAINER_CLASS} {
	opacity: 1;
}

.Lightbox-module-control > .${DOWN_BUTTONS_CONTAINER_CLASS} {
	margin-top: 12px;
	position: static;
	opacity: 1;
}

.${BUTTON_CLASS} {
	width: 42px;
	height: 42px;
	display: block;

	background-color: rgba(0,0,0,.65);
	background-repeat: no-repeat;
	background-position: 50%;
	background-size: 65%;

	border-radius: 50%;
	opacity: 0.75;
	cursor: pointer;
	pointer-events: auto;
}

.${BUTTON_CLASS}:hover {
	opacity: 1;
}

.${BUTTON_CLASS__DOWN} {
	background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDg1IDQ4NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDg1IDQ4NTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9Im5vbmUiPg0KPGcgc3Ryb2tlPScjRUVFRUVFJyBzdHJva2Utd2lkdGg9JzI1JyBmaWxsPScjRUVFRUVFJz4NCgk8Zz4NCgkJPHBhdGggZD0iTTIzMywzNzguN2MyLjYsMi42LDYuMSw0LDkuNSw0czYuOS0xLjMsOS41LTRsMTA3LjUtMTA3LjVjNS4zLTUuMyw1LjMtMTMuOCwwLTE5LjFjLTUuMy01LjMtMTMuOC01LjMtMTkuMSwwTDI1NiwzMzYuNQ0KCQkJdi0zMjNDMjU2LDYsMjUwLDAsMjQyLjUsMFMyMjksNiwyMjksMTMuNXYzMjNsLTg0LjQtODQuNGMtNS4zLTUuMy0xMy44LTUuMy0xOS4xLDBzLTUuMywxMy44LDAsMTkuMUwyMzMsMzc4Ljd6Ii8+DQoJCTxwYXRoIGQ9Ik00MjYuNSw0NThoLTM2OEM1MSw0NTgsNDUsNDY0LDQ1LDQ3MS41UzUxLDQ4NSw1OC41LDQ4NWgzNjhjNy41LDAsMTMuNS02LDEzLjUtMTMuNVM0MzQsNDU4LDQyNi41LDQ1OHoiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==);
	background-position-y: 37%;
}

.${BUTTON_CLASS__TAB} {
	background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIGlkPSJpY29uIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIGZpbGw9JyNFRUVFRUUnPgogICAgPHBhdGggZD0iTTI2LDI2SDZWNkgxNlY0SDZBMi4wMDIsMi4wMDIsMCwwLDAsNCw2VjI2YTIuMDAyLDIuMDAyLDAsMCwwLDIsMkgyNmEyLjAwMiwyLjAwMiwwLDAsMCwyLTJWMTZIMjZaIi8+CiAgICA8cGF0aCBkPSJNMjYsMjZINlY2SDE2VjRINkEyLjAwMiwyLjAwMiwwLDAsMCw0LDZWMjZhMi4wMDIsMi4wMDIsMCwwLDAsMiwySDI2YTIuMDAyLDIuMDAyLDAsMCwwLDItMlYxNkgyNloiLz4KICA8L2c+CiAgPHBvbHlnb24gc3Ryb2tlPScjRUVFRUVFJyBzdHJva2Utd2lkdGg9JzInIGZpbGw9JyNFRUVFRUUnIHBvaW50cz0iMjYgNiAyNiAyIDI0IDIgMjQgNiAyMCA2IDIwIDggMjQgOCAyNCAxMiAyNiAxMiAyNiA4IDMwIDggMzAgNiAyNiA2Ii8+CiAgPHJlY3QgaWQ9Il9UcmFuc3BhcmVudF9SZWN0YW5nbGVfIiBkYXRhLW5hbWU9IiZsdDtUcmFuc3BhcmVudCBSZWN0YW5nbGUmZ3Q7IiBmaWxsPSJub25lIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiLz4KPC9zdmc+Cg==);
}
`

const state = {
	savingFormat: 'png',		// webp is also supported
	fsButtons: null, 
}

function initStyle() {
	let elt = document.head.appendChild(document.createElement('style'))
	elt.id = 'meduza-photo-downloader-css'
	elt.textContent = CSS
}

function createDownloadButtons() {
	let downButton = document.createElement('a')
	downButton.classList.add(BUTTON_CLASS, BUTTON_CLASS__DOWN)
	downButton.title = 'Download image in max resolution'

	let tabButton = document.createElement('a')
	tabButton.classList.add(BUTTON_CLASS, BUTTON_CLASS__TAB)
	tabButton.target = "_blank"
	tabButton.title = 'Open image in new tab'

	let div = document.createElement('div')
	div.classList.add(DOWN_BUTTONS_CONTAINER_CLASS)
	div.appendChild(downButton)
	div.appendChild(tabButton)

	return div;
}

function setupButtons(e) {
	const figureElt = e.currentTarget

	// find the best URL
	let urls = figureElt.querySelectorAll(`source[type="image/${state.savingFormat}"]`).item(0).srcset
	// srcset here contains "2x" as the first source, so I just take it
	const bestImageUrl = urls.split(',')[0].split(' ')[0]

	// build the image name
	const { fileName } = getImageInfo(figureElt)

	// setup buttons
	let buttons = figureElt.querySelectorAll(`.${BUTTON_CLASS}`)
	if (buttons.length === 0) {
		// buttons are not here yet, need to add them
		const target = figureElt[DOWN_BUTTONS_CONTAINER_WRAPPER_PROP]
		const buttonsContainer = figureElt[DOWN_BUTTONS_CONTAINER_PROP]
		target.appendChild(buttonsContainer)
		buttons = buttonsContainer.children
	}
	//// download button
	buttons.item(0).href = bestImageUrl
	// Download attribute does not work due to image Content-Disposition header
	// specifies filename, see more https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#sect1 
	// Workaround (not the good one): https://stackoverflow.com/questions/3102226/how-to-set-name-of-file-downloaded-from-browser#answer-73939464
	buttons.item(0).download = fileName
	//// new tab button
	buttons.item(1).href = bestImageUrl

	// setup fullscreen buttons
	let fsButtons = state.fsButtons || (state.fsButtons = createDownloadButtons())
	fsButtons.children.item(0).href = bestImageUrl
	fsButtons.children.item(0).download = fileName
	fsButtons.children.item(1).href = bestImageUrl

	figureElt.querySelector('picture img').addEventListener('click', showFullscreenButtons)
}

function getImageInfo(figureElt) {

	let fullDescription = figureElt.querySelector('.MediaCaption-module_caption__ewfcc')?.textContent || ''
	let fileName = (/(.+?)(?:\.|$)/i).exec(fullDescription)?.[1] || getDate()

	return ({
		fileName: fileName + `.${state.savingFormat}`,
		fullDescription,
	})
}

function getDate() {
	return document.body.querySelector('.MetaItem-module_datetime__--O8c time.Timestamp-module_root__jPJ6w')?.textContent ||new Date().toLocaleDateString('ru-RU', {year: 'numeric', month: 'long', day: 'numeric'})
}

function showFullscreenButtons(e) {
	setTimeout(() => {
		document.querySelector('.Lightbox-module-container .Lightbox-module-control')
			.appendChild(state.fsButtons)
	}, 200);
}

function work() {
	Array(...document.querySelectorAll(`figure.EmbedBlock-module_root__wNZlD:not([${PROCESSED_FIGURE_ATTR_NAME}]), .HalfBlock-module_image__2lYel:not([${PROCESSED_FIGURE_ATTR_NAME}])`))
		.forEach(figureElt => {
			const img = figureElt.querySelector('.Image-module_root__H5wAh')

			if (img) {
				/* 

				I cannot rely on meduza to hold new buttons permanently as children.
				(example of such page where new buttons are removed from markup
				https://meduza.io/feature/2018/08/24/150-let-nazad-rossiya-deportirovala-cherkesov-v-siriyu-teper-oni-begut-obratno-no-i-zdes-im-ne-rady)
				So the buttons are stored as a property of its parent <figure> element

				*/

				figureElt[DOWN_BUTTONS_CONTAINER_PROP] = createDownloadButtons()
				figureElt[DOWN_BUTTONS_CONTAINER_WRAPPER_PROP] = img
				figureElt.setAttribute(PROCESSED_FIGURE_ATTR_NAME, true)
				figureElt.addEventListener('mouseover', setupButtons)
			}
		})
}

(function init() {
	initStyle();

	// TODO make it work for collage pictures 
	// on this https://meduza.io/feature/2022/12/20/chto-tut-bylo page?

	/* 
	
		NOTE: images for which buttons didn't work

		Buttons are added in fullscreen, but not on the preview
		https://meduza.io/feature/2023/03/14/ukraina-obvinila-dvuh-rossiyskih-snayperov-v-iznasilovanii-chetyrehletney-devochki-i-ee-materi-v-kievskoy-oblasti
	*/

	work();
	new MutationObserver(work).observe(document.getElementById('root'), { childList: true, subtree: true })
})()

/*
	pages to test:

	https://meduza.io/feature/2022/12/20/chto-tut-bylo 
	https://meduza.io/feature/2023/03/14/ukraina-obvinila-dvuh-rossiyskih-snayperov-v-iznasilovanii-chetyrehletney-devochki-i-ee-materi-v-kievskoy-oblasti
	https://meduza.io/feature/2018/08/24/150-let-nazad-rossiya-deportirovala-cherkesov-v-siriyu-teper-oni-begut-obratno-no-i-zdes-im-ne-rady

	avatar/photo images (download buttons are disabled by default, but
	still visible in fullscreen):
	https://meduza.io/feature/2023/09/14/moralnaya-otvetstvennost-budet-na-mne-do-kontsa-zhizni
*/