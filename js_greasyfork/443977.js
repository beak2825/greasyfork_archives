// ==UserScript==
// @name         WordPress.org Plugins
// @namespace    https://wpdevdesign.com/
// @version      0.1
// @description  Adds Copy URL and Copy Name buttons
// @author       Sridhar Katakam
// @match        https://wordpress.org/plugins/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordpress.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443977/WordPressorg%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/443977/WordPressorg%20Plugins.meta.js
// ==/UserScript==

(function() {

	'use strict';

	function copyToClipboard(event) {
		const buttonText = event.target.textContent;
		let helper = document.createElement('input');

		document.body.appendChild(helper);
		helper.value = this.value;
		helper.select();
		document.execCommand('copy');
		this.textContent = "Copied ✓";
		setTimeout(() => {
			this.textContent = buttonText;
		}, 1000)
		helper.remove();

		event.preventDefault();
		event.stopPropagation();
	}

	const entryHeaders = document.getElementsByClassName('entry-header');

	document.querySelectorAll('.entry-header').forEach(el => {
		el.querySelector('.entry-title').style.cssText = "margin-bottom: 0;";
		let href = el.querySelector('.entry-title a').href;
		let name = el.querySelector('.entry-title a').textContent;

		let buttonStyles = "cursor: pointer; border-radius: 4px; padding: 5px 10px; border: 1px solid #fff; font-size: 11px; background-color: #3e58e1; color: #fff; min-width: 82px;";
		let buttonHoverStyles = "cursor: pointer; border-radius: 4px; padding: 5px 10px; border: 1px solid #fff; font-size: 11px; background-color: #213fd4; color: #fff; min-width: 82px;";

		let copyUrlButton = document.createElement("button");
		copyUrlButton.textContent = "Copy Link";
		copyUrlButton.value = href;
		copyUrlButton.style.cssText = buttonStyles;
		copyUrlButton.addEventListener('mouseover',function(){
			this.style.cssText = buttonHoverStyles;
		})
		copyUrlButton.addEventListener('mouseleave',function(){
			this.style.cssText = buttonStyles;
		})
		copyUrlButton.addEventListener("click", copyToClipboard);

		let copyNameButton = document.createElement("button");
		copyNameButton.textContent = "Copy Name";
		copyNameButton.value = name;
		copyNameButton.style.cssText = buttonStyles;
		copyNameButton.addEventListener('mouseover',function(){
			this.style.cssText = buttonHoverStyles;
		})
		copyNameButton.addEventListener('mouseleave',function(){
			this.style.cssText = buttonStyles;
		})
		copyNameButton.addEventListener("click", copyToClipboard);

		let buttonsDiv = document.createElement("div");
		buttonsDiv.className = 'entry-buttons';
        buttonsDiv.style.cssText = "display: flex; gap: 6px; align-items: center; margin-top: 8px; margin-bottom: 8px;";

        el.append(buttonsDiv);

		buttonsDiv.append(copyUrlButton);
		buttonsDiv.append(copyNameButton);
	});

})();