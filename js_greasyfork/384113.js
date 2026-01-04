// ==UserScript==
// @name               Рейтинг кинопоиска для kinozal.tv
// @namespace          https://github.com/mastdiekin/kinozal-kp
// @description        Добавляет кнопку рейтинга, на главной странице и на странице топа http://kinozal.tv/top.php к раздачам.

// @match              *kinozal.tv/*
// @match              *kinozal-tv.appspot.com/*
// @match              *kinozal.me/*
// @match              *kinozal.guru/*

// @version            1.0.8
// @author             mastdiekin
// @require            https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/noframework.waypoints.min.js
// @icon               http://kinozal.tv/pic/favicon.ico

// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @grant              GM_addStyle

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/384113/%D0%A0%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%20%D0%BA%D0%B8%D0%BD%D0%BE%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20kinozaltv.user.js
// @updateURL https://update.greasyfork.org/scripts/384113/%D0%A0%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%20%D0%BA%D0%B8%D0%BD%D0%BE%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20kinozaltv.meta.js
// ==/UserScript==

/*=======================================================
  Repository
=======================================================

  https://github.com/mastdiekin/kinozal-kp

*/

const showMainPageRatingEnable = true; //показывает рейтинг у раздач на гллавной сайта
const showTopPageRatingEnable = true; //добавляет кнопку "Рейтинг" в топе раздач (http://kinozal.tv/top.php)
const reGetRating = false; //отключает повторное нажатие на пнопку "Рейтинг"

(function () {
	"use strict";

	const props = {
		_brand: "#f1d29c",
		brand: "#C0A067",
		transition: ".1s ease",
		buttonText: "Рейтинг",
		requestText: "Получить рейтинг",
	};

	const svg = `<svg enable-background="new 0 0 70 70" version="1.1" viewBox="0 0 70 70" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m35 0c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm-13.3 13.5c4.7 0 8.4 3.7 8.4 8.4s-3.7 8.4-8.4 8.4-8.4-3.7-8.4-8.4c0.1-4.7 3.8-8.4 8.4-8.4zm0 43c-4.7 0-8.4-3.7-8.4-8.4s3.7-8.4 8.4-8.4 8.4 3.7 8.4 8.4c-0.1 4.7-3.8 8.4-8.4 8.4zm9.7-17.9c-2-2-2-5.3 0-7.3s5.3-2 7.3 0 2 5.3 0 7.3-5.3 2.1-7.3 0zm16.9 17.9c-4.7 0-8.4-3.7-8.4-8.4s3.7-8.4 8.4-8.4 8.4 3.7 8.4 8.4c-0.1 4.7-3.8 8.4-8.4 8.4zm0-26.4c-4.7 0-8.4-3.7-8.4-8.4s3.7-8.4 8.4-8.4 8.4 3.7 8.4 8.4c-0.1 4.7-3.8 8.4-8.4 8.4z" fill="#ffffff"/></svg>`;
	const base64svg = encodeURI(`data:image/svg+xml,${svg}`).replace("#", "%23");

	const styles = `
	.element__rating-button,
	.element__rating-div{
		display: block;
		position: absolute;
		bottom: 0;
		font-size: 12px;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		line-height: 25px;
		background-color: ${props.brand};
		border: 0;
		color: #fff;
		outline: none;
		cursor: pointer;
		opacity: 0;
		transition: all ${props.transition};
		overflow: hidden;
	}
	.element__rating-div {
		opacity: 1;
		cursor: default;
		min-width: 50%;
		min-height: 55px;
		width: auto;
		border-radius: 4px 0 0 0;
		transform: translate(0, 0);
		left: auto;
		right: 0;
		padding: 5px;
		box-sizing: border-box;
	}
	.element__rating-div .element__preloder {
		border-radius: 4px 0 0 0;
	}
	.element__rating-button:hover {
		background-color: ${props._brand};
	}
	.element__wrapper {
		display: block;
		float: left;
		margin: 0 5px 5px 0;
		position: relative;
		*zoom: 1;
	}
	.element__wrapper a {
		position: relative;
		display: block;
		margin: 0 !important;
	}
	.element__wrapper:hover > .element__rating-button {
		opacity: 1;
	}
	.element__wrapper::after {
		content: " "
		display: table
		clear: both
	}
	.element__preloader {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all ${props.transition};
	}
	.element__preloader svg {
		height: 50px;
		fill: ${props._brand};
		animation: linear 2s rotate infinite;
	}
	.element__preloader svg path {
		fill: ${props._brand};
	}
	.static {
		opacity: 1;
		background-color: ${props.brand};
		line-height: 20px;
	}
	.static::before {
		content: url('${base64svg}');
		width: 28px;
		position: absolute;
		bottom: -15px;
		left: -10px;
	}
	.static:hover {
		background-color: ${props.brand} !important;
	}
	.final__rating {
		display: block;
		text-align: center;
	}
	.tp1_a {
		display: block;
		float: left;
		position: relative;
	}
	.tp1_desc > .tp1_a {
		float: right;
	}
	.stable a img {
		width: 107px;
		height: 157px
	}
	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	`;
	const disabledStyles = `
	.stable a {
		float: none;
	}
	`;

	const tpBody = [...document.querySelectorAll(".tp1_body")];

	showTopPageRatingEnable && GM_addStyle(disabledStyles); //стили при выключенном рейтинге в /top.php
	GM_addStyle(styles);

	function wrap(toWrap, wrapper) {
		wrapper = wrapper || document.createElement("div");
		toWrap.parentNode.appendChild(wrapper);
		wrapper.classList.add("element__wrapper");
		return wrapper.appendChild(toWrap);
	}

	function createWrapper() {
		const content = [...document.querySelectorAll(".mn1_content > .bx1.stable a")];
		content.map((a) => {
			wrap(a);
			createButton(a);
		});
	}

	function createButton(a) {
		let button = document.createElement("button");
		button.className = "element__rating-button";
		button.id = "rating";
		button.innerHTML += props.buttonText;
		button.dataset.url = a.href;
		button.setAttribute("title", props.requestText);
		a.parentNode.appendChild(button);
		button.addEventListener("click", function (e) {
			if (!this.classList.contains("static") || reGetRating) {
				//отключаем кнопку
				e.target.disabled = true;
				let preloader = document.createElement("div");
				preloader.className = "element__preloader";
				preloader.innerHTML += svg;
				a.innerHTML += preloader.outerHTML;
				return requestPage(e.target, a);
			}
		});
	}

	function requestPage(element, a) {
		//проверим не кликнуто ли на span с рейтингом и получим именно кнопку.
		element = element.dataset.url ? element : element.parentElement;
		const url = element.dataset.url;

		return GM_xmlhttpRequest({
			method: "GET",
			url,
			headers: {
				"User-Agent": "Mozilla/5.0",
				Accept: "text/xml",
			},
			onload: function (response) {
				//включаем кнопку
				if (element !== undefined) element.disabled = false;

				//удаляем прелодер
				if (a !== undefined && a.children[1].classList.contains("element__preloader")) a.children[1].remove();

				if (response.status === 200) requestPageResponse(element, a, response);
			},
		});
	}

	function requestPageResponse(element, a, response) {
		let doc = response.responseText;
		let html = new DOMParser().parseFromString(doc, "text/html");

		let ul = html.querySelector(".men.w200");
		let items = ul.getElementsByTagName("li");
		let arr = [];
		for (var i = 1; i < items.length; ++i) {
			items[i].className += " id-" + [i];
			let kpSearch = items[i].innerHTML.match(/Кинопоиск|IMDb/m);
			kpSearch && arr.push(kpSearch);
		}

		let imdb_rating, kp_rating;
		let kp_matches = arr.filter((value) => /^Кинопоиск/.test(value));
		let imdb_matches = arr.filter((value) => /^IMDb/.test(value));

		imdb_rating = imdb_matches[0] ? createRating(imdb_matches[0].input) : "n/a";
		kp_rating = kp_matches[0] ? createRating(kp_matches[0].input) : "n/a";

		return createRatingRender(kp_rating, imdb_rating, element);
	}

	function createRating(str) {
		const regex = /(\*|\d+(\.\d+){0,2}(\.\*)?)(\<)/gm;
		let m;
		let arr = [];
		while ((m = regex.exec(str)) !== null) {
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}
			arr.push(m);
		}

		return arr.length > 0 && arr[0][1] ? arr[0][1] : "-";
	}

	function ratingHtmlTemplate(kp, imdb) {
		return {
			template: `
				<span class="final__rating">КП: ${kp}</span>
				<span class="final__rating">IMDb: ${imdb}</span>
			`,
			title: `Кинопоиск: ${kp}, IMDb: ${imdb}`,
		};
	}

	function createRatingRender(kp_rating, imdb_rating, element) {
		const t = ratingHtmlTemplate(kp_rating, imdb_rating);
		if (!element.classList.contains("static")) element.classList.add("static");
		element.innerHTML = t.template;
		element.title = t.title;
	}

	/**
	 * Рейтинги на главной странице
	 */
	function createMainPageRatingsElement() {
		tpBody.map((el) => {
			const a = el.children[0];
			const img = a.children[0];
			img.insertAdjacentHTML("afterend", `<div class='element__rating-div'><div class='element__preloader'>${svg}</div></div>`);
			const div = a.children[1];
			div.dataset.url = a.href;
		});
	}

	function mainPageRatings() {
		//call func when user has an item in sight (https://github.com/imakewebthings/waypoints)
		tpBody.map((el) => {
			const self = el;
			const a = el.children[0];
			const element = a.children[1];

			a.classList.add("tp1_a");

			return new Waypoint({
				element: self,
				handler(direction) {
					requestPage(element, a);
					self.classList.add("__init");
					this.destroy();
				},
				offset: "80%",
			});
		});
	}

	//INIT
	(function init() {
		if (showTopPageRatingEnable) {
			createWrapper();
		}

		if (showMainPageRatingEnable) {
			createMainPageRatingsElement();
			mainPageRatings();
		}
	})();
})();
