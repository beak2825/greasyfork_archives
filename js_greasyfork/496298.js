// ==UserScript==
// @name         copy images in one click istock
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  provides two buttons on each image: to copy image URL and to copy image itself in the clipboard
// @author       GreatFireDragon
// @match        https://www.istockphoto.com/search/2/*
// @match        https://www.istockphoto.com/*/search/2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=istockphoto.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496298/copy%20images%20in%20one%20click%20istock.user.js
// @updateURL https://update.greasyfork.org/scripts/496298/copy%20images%20in%20one%20click%20istock.meta.js
// ==/UserScript==
(function () {
    const CLICKED_CLASS = "clicked"
const EMOJI_DIV_CLASS = "emoji-div"
const COPIED_CLASS = "emoji_copied"
const SMILEY_EMOJI = "😀"
const HEART_EMOJI = "😍"
const CLEAR_BUTTON_ID = "clearTakenImages"
const urlBuffer = []

function loadClickedImages() {
	const clickedImages = localStorage.getItem("clickedImages")
	return clickedImages ? JSON.parse(clickedImages) : []
}

function saveClickedImage(url) {
	const clickedImages = loadClickedImages()
	if (!clickedImages.includes(url)) {
		clickedImages.push(url)
		localStorage.setItem("clickedImages", JSON.stringify(clickedImages))
	}
}

function applyClickedClass() {
	const clickedImages = loadClickedImages()
	const allImages = document.querySelectorAll("div[data-max-width]:has(img)")
	allImages.forEach((imageDiv) => {
		const imgElement = imageDiv.querySelector("img")
		if (imgElement && clickedImages.includes(decodeURIComponent(imgElement.src))) {
			imageDiv.classList.add(CLICKED_CLASS)
		}
	})
}

function handleClick(event) {
	const target = event.target
	if (target && target.classList.contains(EMOJI_DIV_CLASS)) {
		const img = target.closest("div:has(img)").querySelector("img")
		if (img) {
			const imgUrl = decodeURIComponent(img.src)

			if (target.textContent === SMILEY_EMOJI) {
				handleSmileyClick(event, target, imgUrl)
			} else if (target.textContent === HEART_EMOJI) {
				handleHeartClick(target, img)
			}
		}
	}
}

function handleSmileyClick(event, target, imgUrl) {
	const tempInput = document.createElement("input")
	if (event.ctrlKey || event.shiftKey) {
		urlBuffer.push(imgUrl)
		document.body.appendChild(tempInput)
		tempInput.value = urlBuffer.join(" ")
		tempInput.select()
		document.execCommand("copy")
		document.body.removeChild(tempInput)
	} else {
		urlBuffer.length = 0
		document.body.appendChild(tempInput)
		tempInput.value = imgUrl
		tempInput.select()
		document.execCommand("copy")
		document.body.removeChild(tempInput)
	}

	saveClickedImage(imgUrl)
	target.classList.add(CLICKED_CLASS)

	target.classList.add(COPIED_CLASS)
	setTimeout(() => {
		target.classList.remove(COPIED_CLASS)
	}, 500)
}

function handleHeartClick(target, img) {
	const imgUrl = decodeURIComponent(img.src)
	const xhr = new XMLHttpRequest()
	xhr.open("GET", imgUrl, true)
	xhr.responseType = "blob"
	xhr.onload = function () {
		if (xhr.status === 200) {
			const blob = xhr.response
			const reader = new FileReader()
			reader.onloadend = function () {
				const img = new Image()
				img.src = reader.result
				img.onload = function () {
					const canvas = document.createElement("canvas")
					canvas.width = img.width
					canvas.height = img.height
					const ctx = canvas.getContext("2d")
					ctx.drawImage(img, 0, 0)
					canvas.toBlob(function (blob) {
						const item = new ClipboardItem({"image/png": blob})
						navigator.clipboard
							.write([item])
							.then(() => {
								target.classList.add(COPIED_CLASS)
								setTimeout(() => {
									target.classList.remove(COPIED_CLASS)
								}, 500)
							})
							.catch((err) => {
								console.error("Failed to copy image: ", err)
							})

						saveClickedImage(imgUrl)
						target.classList.add(CLICKED_CLASS)
					}, "image/png")
				}
			}
			reader.readAsDataURL(blob)
		}
	}
	xhr.send()
}
function addEmojis() {
	const imagesContainer = document.querySelector("div[data-testid='gallery-items-container']")
	if (imagesContainer) {
		const allImages = imagesContainer.querySelectorAll("div[data-max-width]:has(img)")
		allImages.forEach(function (imageDiv) {
			if (!imageDiv.querySelector(`.${EMOJI_DIV_CLASS}`)) {
				const smileyDiv = document.createElement("div")
				smileyDiv.textContent = SMILEY_EMOJI
				smileyDiv.classList.add(EMOJI_DIV_CLASS)
				smileyDiv.style.cursor = "pointer"

				const heartDiv = document.createElement("div")
				heartDiv.textContent = HEART_EMOJI
				heartDiv.classList.add(EMOJI_DIV_CLASS)
				heartDiv.style.cursor = "pointer"

				imageDiv.appendChild(smileyDiv)
				imageDiv.appendChild(heartDiv)
			}
		})
		imagesContainer.addEventListener("click", handleClick)
	}

	applyClickedClass()
}

function clearClickedImages() {
	localStorage.removeItem("clickedImages")
	const allImages = document.querySelectorAll(`div.${CLICKED_CLASS}`)
	allImages.forEach((imageDiv) => {
		imageDiv.classList.remove(CLICKED_CLASS)
	})
}

function addClearButton() {
	const clearButton = document.createElement("button")
	clearButton.id = CLEAR_BUTTON_ID
	clearButton.textContent = "Clear Taken Images"
	clearButton.addEventListener("click", clearClickedImages)
	// append as first child
	document.body.insertBefore(clearButton, document.body.firstChild)
}

function mutationCallback(mutations) {
	mutations.forEach(function () {
		addEmojis()
	})
}

const observer = new MutationObserver(mutationCallback)
const config = {childList: true, subtree: true}
observer.observe(document.body, config)

addEmojis()
addClearButton()

GM_addStyle(`
.emoji-div {
    position: absolute;
	top: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0.3;
	padding: 5px;
}

.emoji-div:hover {opacity: 1;}

div[data-testid='gallery-mosaic-asset-overlay'] {display: none;}

div:has(.emoji-div) {position: relative;}

div[data-testid='gallery-items-container'] > a,
.affiliate-promo-code-notification-banner {
    display: none;
}

/* div[ng-non-bindable][data-component][data-prerender][data-app][data-locale][data-site][data-federated-component][data-root]  */

@keyframes backgroundColorChange {
    0% {background-color: initial;}
    50% {background-color: #01cd5d;scale: 2;}
    100% {background-color: initial;}
}
.emoji_copied {animation: backgroundColorChange 0.5s ease-in-out infinite;}

.emoji-div:nth-child(3) {right: 31px;}

.clicked:has(.emoji-div) {
    filter: grayscale(100%);
    transition: filter 0.5s;
}

.clicked:has(.emoji-div):hover {
    filter: grayscale(0%);
}
	`)
})()
