// ==UserScript==
// @name         SauceNAO Compress & Downscale Image Before Uploading
// @version      1.0
// @description  Compresses large images (>20KB) to WebP (max 250px) before uploading for faster uploads
// @match        https://saucenao.com/
// @license      public domain
// @namespace    https://greasyfork.org/en/users/1468364
// @downloadURL https://update.greasyfork.org/scripts/544013/SauceNAO%20Compress%20%20Downscale%20Image%20Before%20Uploading.user.js
// @updateURL https://update.greasyfork.org/scripts/544013/SauceNAO%20Compress%20%20Downscale%20Image%20Before%20Uploading.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Configuration
	const SIZE_THRESHOLD = 20 * 1024; // 20KB in bytes
	const MAX_DIMENSION = 250;		// Max width/height in pixels
	const WEBP_QUALITY = 0.6;		 // WebP quality (0-1)

	// Override file handling
	const originalCheckImageFile = window.checkImageFile;
	window.checkImageFile = function(fileInput) {
		const file = fileInput.files[0];

		// Skip non-images or small files
		if (!file || !file.type.match('image.*') || file.size <= SIZE_THRESHOLD) {
			return originalCheckImageFile.call(this, fileInput);
		}

		const reader = new FileReader();
		reader.onload = function(e) {
			const img = new Image();
			img.onload = function() {
				// Calculate new dimensions
				let width = img.width;
				let height = img.height;
				const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);

				width = Math.floor(width * ratio);
				height = Math.floor(height * ratio);

				// Create canvas
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');

				// Draw resized image
				ctx.imageSmoothingQuality = 'medium';
				ctx.drawImage(img, 0, 0, width, height);

				// Convert to WebP
				canvas.toBlob(function(blob) {
					console.log(`Reduced from ${formatBytes(file.size)} to ${formatBytes(blob.size)} (WebP)`);

					// Create new file
					const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
						type: 'image/webp',
						lastModified: Date.now()
					});

					// Replace original file
					const dataTransfer = new DataTransfer();
					dataTransfer.items.add(optimizedFile);
					fileInput.files = dataTransfer.files;

					// Continue with original processing
					originalCheckImageFile.call(window, fileInput);
				}, 'image/webp', WEBP_QUALITY);
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(file);
	};

	// Helper function to format bytes
	function formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	// Override drop handler
	document.ondrop = function(event) {
		event.preventDefault();
		const fileInput = document.getElementById("fileInput");

		if (event.dataTransfer.files.length > 0) {
			fileInput.files = event.dataTransfer.files;
			checkImageFile(fileInput);
		} else {
			const urlInput = document.getElementById("urlInput");
			urlInput.value = event.dataTransfer.getData("text/uri-list");
			getURLInput(urlInput);
		}
	};
})();