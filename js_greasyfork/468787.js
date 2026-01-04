// ==UserScript==
// @name        Gartic Phone Avatar Chooser
// @namespace   Violentmonkey Scripts
// @match       *://garticphone.com/*
// @grant       none
// @version     1.3.1
// @author      Der_Floh
// @icon        https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://garticphone.com&size=128
// @homepageURL https://greasyfork.org/de/scripts/468787-gartic-phone-avatar-chooser
// @supportURL  https://greasyfork.org/de/scripts/468787-gartic-phone-avatar-chooser/feedback
// @license     MIT
// @description Adds every Avatar to a Selectionscreen. Now you can Select the Avatar you want
// @downloadURL https://update.greasyfork.org/scripts/468787/Gartic%20Phone%20Avatar%20Chooser.user.js
// @updateURL https://update.greasyfork.org/scripts/468787/Gartic%20Phone%20Avatar%20Chooser.meta.js
// ==/UserScript==

// jshint esversion: 8

class AvatarChooser {
	constructor(container, activationElem) {
		this.images;
		this.container = container;

		this.avatarChooserContainer = document.createElement("div");
		this.avatarChooserContainer.style.display = "none";
		this.container.parentNode.appendChild(this.avatarChooserContainer);

		this.imgElem = activationElem.querySelector("span");
		this.randomImageButton = activationElem.querySelector("button");
		this.randomImageButton.addEventListener("click", () => {
			setTimeout(() => {
				this.jsx  = this.randomImageButton.className;
				this.updateImagesClasses();
			}, 10);
		});
		this.jsx = this.randomImageButton.className;
		this.avatarChooserContainer.className = this.jsx + " avatar-chooser-flex-container";

		const activeTextJsx = this.container.querySelector('span[class*="active"]');

		addCustomStyle(`
			.avatar-hover-target:hover {
  			background-color: rgba(28, 28, 28, 0.8);
			}

			.avatar-text-overlay {
  			display: block;
  			position: absolute;
  			top: 50%;
  			left: 50%;
  			transform: translate(-50%, -50%);
				width: 100%;
				padding-top: 10px;
				padding-bottom: 12px;
				text-align: center;
				font-weight: bold;
				background-color: rgba(28, 28, 28, 0.6);
				border-radius: 7px;
			}

			.avatar-chooser-flex-container {
				display: flex;
				flex-wrap: wrap;
				width: 100%;
				height: 100%;
				align-items: stretch;
        overflow: scroll;
        padding: 20px;
			}

			.avatar-chooser-flex-item {
				flex: 1 1 auto;
        margin: 6px !important;
			}

			.avatar-chooser-flex-item span {
				width: 100%;
				height: 100%;
				background-size: cover;
				background-position: center;
			}

			.avatar-chooser-image-scale-transition {
				transition: transform 0.05s;
			}

			.avatar-chooser-image-scaled {
				transform: scale(0.9);
			}
		`);

		const textElem = document.createElement("p");
		textElem.className = "avatar-text-overlay avatar-hover-target " + activeTextJsx.className;
		textElem.style.cursor = "pointer";
		textElem.textContent = "Choose Avatar";
		textElem.onclick = this.choose.bind(this);
		activationElem.appendChild(textElem);

		this.loadImages();
	}

	async choose() {
		this.container.style.display = "none";
		this.avatarChooserContainer.style.display = "flex";
	}

	async selectImage(imageSrc) {
		let style = window.getComputedStyle(this.imgElem);
		let attributeValue = style.getPropertyValue("background-image");

		while (attributeValue != imageSrc) {
			this.randomImageButton.click();
			style = window.getComputedStyle(this.imgElem);
			attributeValue = style.getPropertyValue("background-image");
		}
		this.updateImagesClasses();
	}

	async updateImagesClasses() {
		this.avatarChooserContainer.className = this.jsx + " avatar-chooser-flex-container";
		for (const div of this.avatarChooserContainer.getElementsByTagName("div"))
			div.className = this.jsx + " avatar avatar-chooser-flex-item";
		for (const span of this.avatarChooserContainer.getElementsByTagName("span")) {
			let classString = this.jsx + " avatar-chooser-image-scale-transition";
			if (span.classList.contains("avatar-chooser-image-scaled"))
				classString += " avatar-chooser-image-scaled";
			span.className = classString;
		}
	}

	async loadImages() {
		this.images = await this.createImages();
		for (const image of this.images) {
			this.avatarChooserContainer.appendChild(image);
		}
	}

	async createImages() {
		const link = "https://garticphone.com/images/avatar/";
		const images = [];
		let i = 0;
		let svg;
		do {
			svg = await this.checkSVGExists(link + i + ".svg");
			if (svg) {
				const image = await this.createImage(i);
				images.push(image);
			}
			i++;
		} while (svg);
		return images;
	}

	async createImage(i) {
		const imageSrc = `url("https://garticphone.com/images/avatar/${i}.svg")`;
		const imgContainer = document.createElement("div");
		imgContainer.className = this.jsx + " avatar avatar-chooser-flex-item";
		//imgContainer.style.margin = "2px";
		imgContainer.style.maxWidth = "158px";
		const image = document.createElement("span");
		image.id = "accountimage-" + i;
		image.className = this.jsx + " avatar-chooser-image-scale-transition";
		image.style.backgroundImage = imageSrc;
		image.style.cursor = "pointer";

		const onImageSelect = () => {
			image.classList.remove("avatar-chooser-image-scaled");
			this.avatarChooserContainer.style.display = "none";
			this.container.style.display = "flex";
		};

		image.onclick = () => {
			event.preventDefault();
			image.classList.add("avatar-chooser-image-scaled");
			image.addEventListener('transitionend', () => {
				setTimeout(() => {
					image.classList.remove("avatar-chooser-image-scaled");
					setTimeout(() => {
						this.selectImage(imageSrc);
						onImageSelect();
					}, 200);
				}, 200);
			}, { once: true });
		};
		imgContainer.appendChild(image);
		return imgContainer;
	}

	async checkSVGExists(url) {
		try {
			const response = await fetch(url, { method: "HEAD" });
			return response.ok;
		} catch (error) {
			console.error("Error checking SVG existence:", error);
			return response.error;
		}
	}
}

if (slashCount(window.location.toString()) > 3)
  return;

window.addEventListener("load", async () => {
	const content = await waitForElementToExistId("content");
	const gameContainer = await waitForElementToExistQuery(content, 'div[class*="start"]');
	const avatarContainer = await waitForElementToExistQuery(content, 'div[class*="avatar"]');

	const avatarChooser = new AvatarChooser(gameContainer, avatarContainer);
});

async function waitForElementToExistQuery(baseNode, query) {
  return new Promise(async (resolve) => {
    async function checkElement() {
      const element = baseNode.querySelector(query);
      if (element !== null)
        resolve(element);
      else
        setTimeout(checkElement, 100);
    }
    await checkElement();
  });
}

async function waitForElementToExistId(elementId) {
  return new Promise(async (resolve) => {
    async function checkElement() {
      const element = document.getElementById(elementId);
      if (element !== null)
        resolve(element);
      else
        setTimeout(checkElement, 100);
    }
    await checkElement();
  });
}

function addCustomStyle(cssString) {
  const style = document.createElement('style');
	style.type = "text/css";
  style.innerHTML = cssString;
  document.head.appendChild(style);
}

function slashCount(str) {
  const regex = /\//g;
  const matches = str.match(regex);
  return matches ? matches.length : 0;
}
