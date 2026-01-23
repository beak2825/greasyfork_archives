// ==UserScript==
// @name         SauceNAO Compress & Downscale Image Before Uploading
// @version      1.1
// @description  Compresses large images (>20KB) to WebP (max 250px) before uploading for faster uploads
// @match        https://saucenao.com/
// @license      public domain
// @namespace    https://greasyfork.org/en/users/1468364
// @downloadURL https://update.greasyfork.org/scripts/544013/SauceNAO%20Compress%20%20Downscale%20Image%20Before%20Uploading.user.js
// @updateURL https://update.greasyfork.org/scripts/544013/SauceNAO%20Compress%20%20Downscale%20Image%20Before%20Uploading.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const SIZE_THRESHOLD = 20 * 1024;
	const MAX_DIMENSION = 250;
	const WEBP_QUALITY = 0.5;

	function compressImage(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = e => {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					// Calculate dimensions
					let width = img.width;
					let height = img.height;

					if (width > height) {
						// Landscape or square
						if (width > MAX_DIMENSION) {
							const ratio = MAX_DIMENSION / width;
							width = MAX_DIMENSION;
							height = Math.round(height * ratio);
						}
					} else {
						// Portrait
						if (height > MAX_DIMENSION) {
							const ratio = MAX_DIMENSION / height;
							height = MAX_DIMENSION;
							width = Math.round(width * ratio);
						}
					}

					canvas.width = width;
					canvas.height = height;

					ctx.imageSmoothingEnabled = true;
					ctx.imageSmoothingQuality = 'high';

					ctx.drawImage(img, 0, 0, width, height);

					canvas.toBlob(blob => {
						const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
							type: 'image/webp'
						});
						resolve(newFile);
					}, 'image/webp', WEBP_QUALITY);
				};
				img.src = e.target.result;
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	function setup() {
		const fileInput = document.getElementById('fileInput');
		if (!fileInput) return;

		const originalOnChange = fileInput.onchange;
		fileInput.onchange = async function(e) {
			const file = this.files[0];

			if (!file || !file.type.startsWith('image/') || file.size <= SIZE_THRESHOLD) {
				if (originalOnChange) originalOnChange.call(this, e);
				return;
			}

			try {
				const compressed = await compressImage(file);
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(compressed);
				this.files = dataTransfer.files;

				if (originalOnChange) originalOnChange.call(this, e);
				else this.dispatchEvent(new Event('change'));
			} catch {
				if (originalOnChange) originalOnChange.call(this, e);
			}
		};

		const originalDrop = document.ondrop;
		document.ondrop = async function(e) {
			const fileInput = document.getElementById('fileInput');

			if (e.target !== fileInput && e.dataTransfer.files.length > 0) {
				const file = e.dataTransfer.files[0];
				if (file.type.startsWith('image/') && file.size > SIZE_THRESHOLD) {
					e.preventDefault();

					try {
						const compressed = await compressImage(file);
						const dataTransfer = new DataTransfer();
						dataTransfer.items.add(compressed);
						fileInput.files = dataTransfer.files;
						fileInput.dispatchEvent(new Event('change'));
						return;
					} catch {
						// Fall through
					}
				}
			}

			if (originalDrop) return originalDrop.call(this, e);
		};
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', setup);
	} else {
		setup();
	}
})();