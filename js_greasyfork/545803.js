// ==UserScript==
// @name        Pouët logozoomer
// @namespace   raina
// @match       https://www.pouet.net/*
// @grant       none
// @version     1.0
// @author      raina
// @description 8/14/2025, 11:54:40 AM
// @runAt       document-end
// @downloadURL https://update.greasyfork.org/scripts/545803/Pou%C3%ABt%20logozoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/545803/Pou%C3%ABt%20logozoomer.meta.js
// ==/UserScript==
let logo = document.getElementById("logo");
let a = logo.querySelector("a")
let img = logo.querySelector("img")

function getDims() {
	a.style.setProperty("--width", `${a.offsetWidth}px`);
	a.style.setProperty("--height", `${a.offsetHeight}px`);
}

let style = document.createElement("style");
style.textContent = `
	#logo a {
		display: inline-block;
		position: relative;
		overflow: clip;
		font-size: 0;
		&, &:is(:hover, :focus) {
			img {
				visibility: hidden;
			}
			&::after {
				position: absolute;
				background-image: var(--background-image);
				content: "";
				height: 1200%;
				width: 1000%;
				left: -500%;
				top: -600%;
				transform-origin: calc(50% + var(--width) / 2) calc(50% + var(--height) / 2);
				rotate: 0deg;
				animation: infinite;
				animation-name: roto, zoom;
				animation-duration: 5s, 10s;
				animation-timing-function: linear, ease-in-out;
				animation-delay: 0s, -4s;
				image-rendering: pixelated;
			}
		}
	}
	@keyframes roto {
		100% { rotate: 360deg; }
	}
	@keyframes zoom {
		0%,100% { scale: .2; }
		50% { scale: 5; }
	}
`;
a.style.setProperty("--background-image", `url(${img.src})`);
document.head.appendChild(style);

img.complete ? getDims() : img.addEventListener("load", getDims, {once: true});