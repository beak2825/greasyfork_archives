// ==UserScript==
// @name		Twitter - One Click Share + FixTweet
// @namespace		codeberg.org/skye
// @homepageURL		https://codeberg.org/skye/userscripts
// @version		1.0.1
// @description		Copy FixTweet links with one click, removing tracking paramaters
// @author		freyja <freyja@dioxas.net>
// @match		https://*.twitter.com/*
// @grant		none
// @icon		data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=
// @license		MIT
// @downloadURL https://update.greasyfork.org/scripts/467447/Twitter%20-%20One%20Click%20Share%20%2B%20FixTweet.user.js
// @updateURL https://update.greasyfork.org/scripts/467447/Twitter%20-%20One%20Click%20Share%20%2B%20FixTweet.meta.js
// ==/UserScript==


(function()
{
	'use strict';
	let id = 'fx-copy';

	/* toast */
		const toast = document.createElement('div');
		toast.setAttribute('id', 'fx-toast');
		document.body.appendChild(toast);
		const showToast = (text) => {
			toast.innerText = text;
			toast.style.display = 'block';
			setTimeout(() => { toast.style.display = 'none' }, 1000);
		}

	/* function + button */
	let make_button = function()
	{
		let button = document.createElement('button');
		button.textContent = 'FX';
		button.onclick = function ()
		{
			let url = new URL(button.closest('article').querySelector('[href*="status"]').href);
			url.pathname = url.pathname.split('/').slice(0,4).join('/');
			navigator.clipboard.writeText(url.toString().replace("twitter.com","fxtwitter.com"));
			showToast('Copied!');
		};
		button.id = id;
		return button;
	};

	setInterval(function()
	{
		let nodes = document.querySelectorAll('article div[role=group]:last-child');
		for (let node of nodes)
		{
			if (!node.querySelector(`#${id}`))
			{
				node.appendChild(make_button());
			}
		}
	}, 250);

	const style = document.createElement('style');
	style.innerText = 
	/* css */ 
	` 
		#fx-copy {
			border-color: transparent;
			border-radius: 50%;
			background: transparent;
			color: rgb(110, 118, 125);
			line-height: 20px;
			font-size: 1.1rem;
			margin: 3px;
			cursor: pointer;
			aspect-ratio: 1;
		}
		#fx-copy:hover {
			background: rgba(255, 227, 0, 0.1);
				color: rgb(255, 227, 0);
		}

		#fx-toast {
			background: rgba(41, 50, 62, 0.6);
			padding: 1rem;
			font-family: sans-serif;
			font-size: 1.05rem;
			border-radius: 2rem;
			color: white;
			position: fixed;
			bottom: 4rem;
			left: 50%;
			transform: translate(-50%);
			display: none;
	}`;
	document.querySelector('head').appendChild(style);
})();