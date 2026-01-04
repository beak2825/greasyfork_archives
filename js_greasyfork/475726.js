// ==UserScript==
// @name        Flaticon Free SVG Download
// @namespace   Violentmonkey Scripts
// @match       https://www.flaticon.com/free-icon/*
// @grant       none
// @version     1.0.1
// @author      Der_Floh
// @description Enables the SVG download for free. Requires to be Logged In
// @license     MIT
// @icon        https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_e7b8a53bf9ee1f0023a60ce6644dd5f8/flaticon.jpg
// @homepageURL	https://greasyfork.org/de/scripts/475726-flaticon-free-svg-download
// @supportURL	https://greasyfork.org/de/scripts/475726-flaticon-free-svg-download/feedback
// @downloadURL https://update.greasyfork.org/scripts/475726/Flaticon%20Free%20SVG%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/475726/Flaticon%20Free%20SVG%20Download.meta.js
// ==/UserScript==

// jshint esversion: 8

window.addEventListener("load", () => {
	const downloadContainer = document.getElementById("download");
	const downloadSvgButton = downloadContainer.querySelector('a[class*="btn-svg"]');
	const spanElem = downloadSvgButton.querySelector("span");
	spanElem.textContent = "Download SVG Free";
	const premiumIcon = downloadSvgButton.querySelector('i[class*="icon"]');
	premiumIcon.parentNode.removeChild(premiumIcon);
	downloadSvgButton.onclick = startDownloadSvg;
});

async function startDownloadSvg() {
	const editButton = document.getElementById("detail_edit_icon");
	editButton.click();

	const detailContainer = await waitForElementToExistId("detail");
	const iconHolder = await waitForElementToExistQuery(detailContainer, 'div[class*="icon-holder"]');
	if (detailContainer.querySelector('div[class="alert warning free_user_warning"]')) {
		console.warn("You need to Log in to download SVG for Free");
		return;
	}
	const svgElem = await waitForElementToExistQuery(iconHolder, "svg");
	const filename = getLastURLPart(window.location.toString()) + ".svg";

	downloadSvg(svgElem, filename);

	const backButton = detailContainer.querySelector('button[class*="bj-button"]');
	backButton.click();
}

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

function downloadSvg(svg, filename) {
	const content = new XMLSerializer().serializeToString(svg);
	const type = "image/svg+xml";
	const url = URL.createObjectURL(new Blob([content], {type}));

	const a = document.createElement('a');
	a.href = url;
	a.download = filename || 'vector-image.svg';
	a.style.display = 'none';

	document.body.appendChild(a);
	a.click();

	document.body.removeChild(a);
	window.URL.revokeObjectURL(url);
}

function getLastURLPart(url) {
	const parsedURL = new URL(url);
	const pathname = parsedURL.pathname;
	const segments = pathname.split('/');
	const filteredSegments = segments.filter(segment => segment !== '');
	const lastSegment = filteredSegments.pop();

	return lastSegment || '';
}
