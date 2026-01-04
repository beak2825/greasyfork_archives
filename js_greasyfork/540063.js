// ==UserScript==
// @name         IMHentai Remove Sensitive Image Filters
// @version      1.0
// @description  Remove blurring and filters from images and links on imhentai.xxx
// @match        https://imhentai.xxx/*
// @license      public domain
// @namespace    https://sleazyfork.org/users/1468364
// @downloadURL https://update.greasyfork.org/scripts/540063/IMHentai%20Remove%20Sensitive%20Image%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/540063/IMHentai%20Remove%20Sensitive%20Image%20Filters.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// =============================================
	// PART 1: REMOVE BLUR/FILTER EFFECTS (CSS)
	// =============================================
	const style = document.createElement('style');
	style.textContent = `
		.blacklisted,
		.filtered,
		.filtered_reader {
			opacity: 1;
			-webkit-filter: none;
			filter: none;
			pointer-events: auto;
		}
		.filtered::after,
		.filtered_reader::after,
		.alert-warning {
			display: none;
		}
		.filtered_thumbs {
			pointer-events: auto;
			user-select: auto;
		}
		.filtered_thumbs img::after {
			pointer-events: auto;
		}
		.a_filtered {
			font-size: inherit;
			user-select: auto;
		}
	`;
	document.head.appendChild(style);

	// =============================================
	// PART 2: INJECT "VIEW MORE/ALL" BUTTONS (IF MISSING)
	// =============================================
	const commentsDiv = document.getElementById('comments_div');
	if (commentsDiv) {
		// Check if buttons already exist
		const existingButtons = commentsDiv.querySelector('#load_more, #load_all');
		if (!existingButtons) {
			const buttonHTML = `
				<div style="text-align: center;">
					<button id="load_more" class="btn btn-primary view_link">
						<i class="fa fa-angle-down"></i> View More
					</button>
					<button id="load_all" class="btn btn-primary view_link">
						<i class="fa fa-angle-double-down"></i> View All
					</button>
				</div>
			`;
			commentsDiv.insertAdjacentHTML('beforeend', buttonHTML);
		}

		// =============================================
		// PART 3: JS CLICK HANDLERS FOR BUTTONS
		// =============================================
		document.addEventListener('DOMContentLoaded', function() {
			const loadMoreBtn = document.getElementById('load_more');
			const loadAllBtn = document.getElementById('load_all');

			if (loadMoreBtn && loadAllBtn) {
				// Shared function for AJAX requests
				function loadThumbs(type) {
					const formData = new FormData();
					formData.append('server', document.getElementById('load_server')?.value || '');
					formData.append('u_id', document.getElementById('gallery_id')?.value || '');
					formData.append('g_id', document.getElementById('load_id')?.value || '');
					formData.append('img_dir', document.getElementById('load_dir')?.value || '');
					formData.append('visible_pages', document.querySelectorAll('.gallery_th:not([style*="display: none"])').length);
					formData.append('total_pages', document.getElementById('load_pages')?.value || '');
					formData.append('type', type);

					fetch('/inc/thumbs_loader.php', {
						method: 'POST',
						body: formData
					})
					.then(response => response.text())
					.then(response => {
						const appendThumbs = document.getElementById('append_thumbs');
						if (appendThumbs) appendThumbs.insertAdjacentHTML('beforeend', response);

						// Hide buttons if all thumbs are visible
						const visibleThumbs = document.querySelectorAll('.gallery_th:not([style*="display: none"])').length;
						const totalThumbs = parseInt(document.getElementById('load_pages')?.value || '0');
						if (visibleThumbs >= totalThumbs) {
							document.querySelectorAll('.view_link').forEach(btn => btn.style.display = 'none');
						}

						// Reinitialize LazyLoad
						if (window.LazyLoad) {
							new LazyLoad({
								threshold: 0,
								callback_error: (element) => {
									element.src = 'https://imhentai.xxx/images/load_error.png';
								}
							});
						}
					})
					.catch(error => console.error('Error:', error));
				}

				// Button event listeners
				loadMoreBtn.addEventListener('click', () => loadThumbs(1));
				loadAllBtn.addEventListener('click', () => loadThumbs(2));
			}
		});
	}
})();