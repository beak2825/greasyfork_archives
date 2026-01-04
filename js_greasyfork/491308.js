// ==UserScript==
// @name         论坛话题预览
// @namespace    http://yourwebsite.com
// @version      0.2
// @description  Preview link content on mouse hover
// @author       zheng
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/491308/%E8%AE%BA%E5%9D%9B%E8%AF%9D%E9%A2%98%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/491308/%E8%AE%BA%E5%9D%9B%E8%AF%9D%E9%A2%98%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const contentCache = {};

	var previewPopup = document.createElement("div");
	previewPopup.id = "linkPreviewPopup";
	previewPopup.style.display = "none";
	previewPopup.style.position = "absolute";
	previewPopup.style.background = "#fff";
	previewPopup.style.border = "1px solid #ccc";
	previewPopup.style.padding = "10px";
	previewPopup.style.maxWidth = "300px";
	previewPopup.style.boxShadow = "3px 3px 5px rgba(0,0,0,0.3)";
	document.body.appendChild(previewPopup);

	// Add styles for preview popup
	GM_addStyle(`
      #linkPreviewPopup {
          z-index: 9999999;
      }
  `);

	// Function to fetch preview content
	async function getPreviewContent(linkHref) {
		try {
			if (contentCache[linkHref]) {
				console.log("Content found in cache:", contentCache[linkHref]);
				return contentCache[linkHref];
			}
			console.log("linkHref: " + linkHref);

            const response = await fetch(linkHref);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const html = await response.text();

			// Create a temporary div element to hold the HTML content
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = html;
			const metaDescription = tempDiv.querySelector('meta[name="description"]');
			let descriptionContent = metaDescription ? metaDescription.getAttribute("content") : "";
			descriptionContent = descriptionContent.trim();
			contentCache[linkHref] = descriptionContent;

			console.log("Description content:", descriptionContent);
			return descriptionContent;
		} catch (error) {
			console.error("Error fetching link preview content:", error);
			return null;
		}
	}

	// Function to show preview popup
	function showPreviewPopup(link, event) {
		getPreviewContent(link)
			.then((previewContent) => {
				if (previewContent) {
					console.log("previewContent: " + previewContent);
					// Set preview content
					previewPopup.innerHTML = previewContent.replace(/<[^>]*>/g, '');

					// Position the preview popup
					previewPopup.style.top = event.pageY + 30 + "px";
					previewPopup.style.left = event.pageX + 10 + "px";

					// Show the preview popup
					previewPopup.style.display = "block";
				}
			})
			.catch((error) => {
				console.error("Error fetching link preview content:", error);
			});
	}

    function hidePreviewPopup() {
		previewPopup.style.display = "none";
	}

    $(document).on('mouseenter', 'a', function(event) {
        var target = $(event.target).closest('a');
        var url = target.attr('href');
        console.log("URL: " + url);
        console.log("Mouse enter");
        showPreviewPopup(url, event);
    });
    $(document).on('mouseout', 'a', function() {
        console.log("Mouse out");
        hidePreviewPopup();
    });

})();
