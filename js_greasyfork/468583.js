// ==UserScript==
// @name         Likes Counter by_el9in
// @namespace    Likes Counter by_el9in
// @version      0.3
// @description  Likes Counter
// @author       You
// @match        https://zelenka.guru/forums/contests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/468583/Likes%20Counter%20by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/468583/Likes%20Counter%20by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
	const max = 5;

	function calculateAverage(numbers) {
	  if (!Array.isArray(numbers) || numbers.length === 0) {
		// Проверяем, является ли numbers массивом и не пуст ли он
		return null;
	  }

	  const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	  const average = sum / numbers.length;

	  return average;
	}

	const originalFastButton = document.querySelector('a.button.middle.CreatePersonalExtendedTab');
	if (originalFastButton) {
		const clonedButton = originalFastButton.cloneNode(true);
		clonedButton.classList.remove('CreatePersonalExtendedTab');
		clonedButton.classList.add('SrLikes');
		clonedButton.textContent = 'Fast';
		clonedButton.style.marginLeft = '5px';
		clonedButton.removeAttribute('href');
		originalFastButton.parentNode.insertBefore(clonedButton, originalFastButton.nextSibling);
		clonedButton.addEventListener('click', function(event) {
			initLikes();
		});

		let buttonIn = false;
		async function initLikes() {
			if(buttonIn == true) 	{
				clonedButton.textContent = 'Жди! Ещё идёт подчёт.';
				return;
			} else clonedButton.textContent = `Идёт подсчёт (${0}/${max})`;
			buttonIn = true;

			if(window.location.href != "https://zelenka.guru/forums/contests/?node_id=766&order=post_date&direction=desc") {
				window.location.href = 'https://zelenka.guru/forums/contests/?node_id=766&order=post_date&direction=desc';
				return;
			}
			const threads = document.querySelector(".latestThreads._insertLoadedContent");
			const threadsHrefs = threads.querySelectorAll(".listBlock.main.PreviewTooltip");

			const threadsHrefsFast = [];
			for(let thread of threadsHrefs) {
				const isFast = thread.querySelector(".prefix.icon.fast_contest");
				if(isFast) threadsHrefsFast.push(thread);
			}

			const LikesObject = [];

			let i = 0;
			for(let thread of threadsHrefsFast) {
				if(i >= max) break;

				const response = await fetch(thread.href);
				console.log(thread.href);
				const html = await response.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				await new Promise(resolve => setTimeout(resolve, 2000));
				const Likes = doc.querySelector('span.LikeLabel');
				const LikesCount = Likes.innerText | 0;
				LikesObject.push(LikesCount);

				i++;
				clonedButton.textContent = `Идёт подсчёт (${i}/${max})`;
			}

			buttonIn = false;
			clonedButton.textContent = `Fast (${Math.round( calculateAverage(LikesObject) )})`;
		}
	}

	const originalButton = document.querySelector('a.button.middle.CreatePersonalExtendedTab');
	if (originalButton) {
		const clonedButton = originalButton.cloneNode(true);
		clonedButton.classList.remove('CreatePersonalExtendedTab');
		clonedButton.classList.add('SrLikes');
		clonedButton.textContent = 'Количество лайков';
		clonedButton.style.marginLeft = '5px';
		clonedButton.removeAttribute('href');
		originalButton.parentNode.insertBefore(clonedButton, originalButton.nextSibling);
		clonedButton.addEventListener('click', function(event) {
			initLikes();
		});

		let buttonIn = false;
		async function initLikes() {
			if(buttonIn == true) 	{
				clonedButton.textContent = 'Жди! Ещё идёт подчёт.';
				return;
			} else clonedButton.textContent = `Идёт подсчёт (${0}/${max})`;
			buttonIn = true;

			if(window.location.href != "https://zelenka.guru/forums/contests/?node_id=766&order=post_date&direction=desc") {
				window.location.href = 'https://zelenka.guru/forums/contests/?node_id=766&order=post_date&direction=desc';
				return;
			}
			const threads = document.querySelector(".latestThreads._insertLoadedContent");
			const threadsHrefs = threads.querySelectorAll(".listBlock.main.PreviewTooltip");

			const LikesObject = [];

			let i = 0;
			for(let thread of threadsHrefs) {
				if(i >= max) break;

				const response = await fetch(thread.href);
				console.log(thread.href);
				const html = await response.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				await new Promise(resolve => setTimeout(resolve, 2000));
				const Likes = doc.querySelector('span.LikeLabel');
				const LikesCount = Likes.innerText | 0;
				LikesObject.push(LikesCount);

				i++;
				clonedButton.textContent = `Идёт подсчёт (${i}/${max})`;
			}

			buttonIn = false;
			clonedButton.textContent = `Количество лайков (${Math.round( calculateAverage(LikesObject) )})`;
		}
	}
})();