// ==UserScript==
// @name     SubsPlease Images View
// @match    https://subsplease.org/
// @version  1.1
// @grant    none
// @author   Odex
// @description Show image preview next to the anime titles
// @namespace https://greasyfork.org/users/712999
// @downloadURL https://update.greasyfork.org/scripts/417888/SubsPlease%20Images%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/417888/SubsPlease%20Images%20View.meta.js
// ==/UserScript==

const injectImages = () => {
	setTimeout(() => {
		document.querySelectorAll(".frontpage-releases-container tr:not(.has-image)").forEach(row => {
			const img = document.createElement("img");
			const name = row.querySelector(".release-item a");
			const { previewImage } = name.dataset;
			img.setAttribute("src", previewImage);
			img.style.width = "200px";
			img.style.cursor = "pointer";
			img.onclick = () => window.location.pathname = name.href;

			const td = document.createElement("td");
			td.style.paddingRight = 0;
			td.appendChild(img);

			row.insertBefore(td, row.querySelector("td:first-child"));
			row.classList.add('has-image');

			const info = row.querySelector(".release-item-time");
			info.style.verticalAlign = "top";
		});
	}, 1500);
}

// Execute
injectImages();
document.querySelector("#latest-load-more span").addEventListener("click", injectImages);