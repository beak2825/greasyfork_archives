// ==UserScript==
// @name         JVC - Profil
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ambiance sonore sur les profils JVC
// @author       Lúthien Sofea Elenassë
// @license      MIT
// @match        https://www.jeuxvideo.com/profil/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jeuxvideo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471631/JVC%20-%20Profil.user.js
// @updateURL https://update.greasyfork.org/scripts/471631/JVC%20-%20Profil.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	const create = {
		element: (tag, attributes, children, listeners) => {
			const element = document.createElement(tag);
			if (attributes) {
				Object.keys(attributes).forEach(attribute => {
					if (attributes[attribute] !== undefined) {
						element.setAttribute(attribute, attributes[attribute])
					}
				})
			}
			if (children !== undefined) {
				(Array.isArray(children) ? children : [children]).forEach(child => child instanceof Node ? element.appendChild(child) : element.appendChild(create.text(child)))
			}
			if (listeners) {
				Object.keys(listeners).forEach(listener => element.addEventListener(listener, listeners[listener], false))
			}
			return element
		},
		text: text => document.createTextNode(text),
	};
	const bloc = document.querySelector(".bloc-default-profil");
	const p = create.element("p");
	const youtube = /https?:\/\/www\.youtube\.com\/watch\?([^#]*&)*v=([^&#]*)(&.*)*/gi;
	const addYoutube = v => {
		p.appendChild(create.element("iframe", {
			width: "560",
			height: "315",
			src: "https://www.youtube.com/embed/" + v + "?autoplay=1&loop=1&rel=0",
			title: "YouTube video player",
			frameborder: "0",
			autoplay: null,
		}, []));
	};
	if (bloc) {
		const links = bloc.querySelectorAll(".bloc-description-desc a");
		let embedded = false;
		const soundBloc = create.element("div", {
			class: "bloc-default-profil",
		}, [
			create.element("div", {
				class: "bloc-default-profil-header",
			}, [
				create.element("h2", {}, ["Ambiance sonore"]),
			]),
			create.element("div", {
				class: "bloc-default-profil-body",
			}, [
				create.element("div", {
					class: "bloc-description-desc",
				}, [
					p,
				])
			]),
		]);
		soundBloc.style.display = "none";
		bloc.parentNode.appendChild(soundBloc);
		const analyse = link => {
			console.log(embedded, link);
			if (!embedded) {
				if (youtube.test(link.href)) {
					addYoutube(RegExp.$2);
					embedded = true;
				}
			}
		};
		
		links.forEach(analyse);
		if (embedded) {
			soundBloc.style.display = "";
		}
	}
	console.log(bloc);
})();
