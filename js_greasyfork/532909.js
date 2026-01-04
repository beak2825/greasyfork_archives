// ==UserScript==
// @name Bunkr Albums Enhanced with Sorting
// @namespace https://github.com/WendysBro/bunkr-albums-autoload-previews
// @version 1.2.2
// @description Adds infinite scroll, hover previews, and sorting to Bunkr Albums pages
// @author WendysBro
// @match https://bunkr-albums.io/?search=*
// @match https://bunkr-albums.io/topalbums*
// @license MIT
// @homepageURL https://github.com/WendysBro/bunkr-albums-autoload-previews
// @supportURL https://github.com/WendysBro/bunkr-albums-autoload-previews/issues
// @grant none
// @icon https://www.google.com/s2/favicons?sz=64&domain=bunkrrr.org
// @downloadURL https://update.greasyfork.org/scripts/532909/Bunkr%20Albums%20Enhanced%20with%20Sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/532909/Bunkr%20Albums%20Enhanced%20with%20Sorting.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const CONFIG = {
		previewDelay: 200,
		maxPreviews: 15,
		previewSize: '180px',
		scrollThreshold: 500,
	};

	function addSortingControls() {
		const controls = document.createElement('div');
		controls.style = 'margin: 10px 0; display: flex; gap: 10px; align-items: center;';

		const label = document.createElement('label');
		label.textContent = 'Sort albums by:';
		label.style = 'color: white;';

		const select = document.createElement('select');
		select.innerHTML = `
<option value="default">Default</option>
<option value="name">Name (A–Z)</option>
<option value="count">File Count</option>
`;
		select.style = 'padding: 4px; border-radius: 6px;';

		select.addEventListener('change', () => sortAlbums(select.value));
		controls.append(label, select);

		const gridContainer = document.querySelector('div.grid.auto-rows-max.gap-1\\.5');
		if (gridContainer && gridContainer.parentElement) {
			gridContainer.parentElement.insertBefore(controls, gridContainer);
		}
	}

	function sortAlbums(method) {
		const container = document.querySelector('div.grid.auto-rows-max.gap-1\\.5');
		if (!container) return;

		const albums = Array.from(container.children);
		if (method === 'name') {
			albums.sort((a, b) => {
				const nameA = a.querySelector('p.text-subs span')?.textContent.trim().toLowerCase() || '';
				const nameB = b.querySelector('p.text-subs span')?.textContent.trim().toLowerCase() || '';
				return nameA.localeCompare(nameB);
			});
		} else if (method === 'count') {
			albums.sort((a, b) => {
				const countA = parseInt(a.querySelector('p.text-xs span')?.textContent.match(/\d+/)?.[0] || '0');
				const countB = parseInt(b.querySelector('p.text-xs span')?.textContent.match(/\d+/)?.[0] || '0');
				return countB - countA;
			});
		} else {
			return;
		}

		albums.forEach((album) => container.appendChild(album));
	}

	class BunkrAlbumsEnhanced {
		constructor() {
			this.nextPage = 2;
			this.loading = false;
			this.previewTimeout = null;
			this.isTopAlbumsPage = window.location.pathname.includes('/topalbums');
			this.init();
		}

		init() {
			this.setupInfiniteScroll();
			this.setupAllHoverPreviews();
			addSortingControls();
		}

		qs(selector, el = document) {
			return el.querySelector(selector);
		}

		qsa(selector, el = document) {
			return Array.from(el.querySelectorAll(selector));
		}

		getCurrentParams() {
			const params = new URLSearchParams(window.location.search);
			return this.isTopAlbumsPage ? { lapse: params.get('lapse') || '24h', page: this.nextPage } : { search: params.get('search') || '', page: this.nextPage };
		}

		getAlbumDomain(albumUrl) {
			const match = albumUrl.match(/https:\/\/(bunkr\.[a-z]+)/);
			return match ? match[1] : 'bunkr.cr';
		}

		setupInfiniteScroll() {
			if (!this.isLastPage()) {
				window.addEventListener('scroll', this.handleScroll.bind(this));
			}
		}

		isLastPage() {
			return !!this.qs('.text-center.text-xs.text-subtle');
		}

		handleScroll() {
			if (this.loading) return;
			const scrollPosition = window.innerHeight + window.scrollY;
			if (scrollPosition >= document.body.offsetHeight - CONFIG.scrollThreshold) {
				this.loadNextPage();
			}
		}

		async loadNextPage() {
			this.loading = true;
			const params = this.getCurrentParams();
			const url = this.isTopAlbumsPage ? `/topalbums?lapse=${params.lapse}&page=${params.page}` : `/?search=${encodeURIComponent(params.search)}&page=${params.page}`;

			try {
				const response = await fetch(url);
				if (!response.ok) throw new Error(`Failed to load page ${params.page}`);

				const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
				const newAlbums = this.qsa('.rounded-xl.bg-mute.border-b', doc);
				const container = this.qs('div.grid.auto-rows-max.gap-1\\.5');

				if (newAlbums.length && container) {
					newAlbums.forEach((album) => this.setupHoverPreview(album));
					container.append(...newAlbums);
					this.nextPage++;

					// reapply sort if user selected a sort option
					const sortMethod = document.querySelector('select')?.value;
					if (sortMethod && sortMethod !== 'default') sortAlbums(sortMethod);
				} else {
					window.removeEventListener('scroll', this.handleScroll);
				}
			} catch (error) {
				console.error('[Bunkr Albums Enhanced]', error);
			} finally {
				this.loading = false;
			}
		}

		setupAllHoverPreviews() {
			this.qsa('.rounded-xl.bg-mute.border-b').forEach((album) => {
				this.setupHoverPreview(album);
			});
		}

		setupHoverPreview(album) {
			const albumLink = this.qs("a[href^='https://bunkr.']", album);
			if (!albumLink) return;
			const albumUrl = albumLink.href;

			const albumTextContainer = this.qs('.flex-1.grid.auto-rows-max', album);
			if (!albumTextContainer) return;

			const previewContainer = this.createPreviewContainer();
			albumTextContainer.appendChild(previewContainer);

			album.addEventListener('mouseenter', () => this.showPreview(albumUrl, previewContainer));
			album.addEventListener('mouseleave', () => this.hidePreview(previewContainer));
			album.addEventListener('click', (e) => this.handleAlbumClick(e, albumUrl, previewContainer));
		}

		createPreviewContainer() {
			const container = document.createElement('div');
			container.className = 'album-preview-flex';
			container.style = `
display: none;
flex-wrap: wrap;
justify-content: center;
gap: 8px;
padding: 10px;
background: #222;
border-radius: 5px;
margin-top: 10px;
max-width: 100%;
overflow: hidden;
`;
			return container;
		}

		async showPreview(albumUrl, container) {
			this.previewTimeout = setTimeout(async () => {
				if (container.innerHTML.trim()) {
					container.style.display = 'flex';
					return;
				}

				try {
					const response = await fetch(albumUrl);
					if (!response.ok) throw new Error('Failed to load album contents');

					const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
					const albumDomain = this.getAlbumDomain(albumUrl);
					const items = this.qsa('.grid-images .theItem', doc);

					container.innerHTML = '';
					items.slice(0, CONFIG.maxPreviews).forEach((item) => {
						const img = this.qs('.grid-images_box-img', item);
						const fileLink = this.qs("a[href^='/f/']", item);
						if (img && fileLink) this.addPreviewItem(img, fileLink, albumDomain, container);
					});

					container.style.display = 'flex';
				} catch (error) {
					console.error('[Bunkr Albums Enhanced]', error);
					container.innerHTML = '<p style="color:white">Preview unavailable</p>';
					container.style.display = 'flex';
				}
			}, CONFIG.previewDelay);
		}

		addPreviewItem(img, fileLink, domain, container) {
			const thumb = document.createElement('img');
			thumb.src = img.src;
			thumb.style = `width: ${CONFIG.previewSize}; height: auto; border-radius: 3px; cursor: pointer;`;
			thumb.alt = 'Preview';
			thumb.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				window.open(`https://${domain}${fileLink.getAttribute('href')}`, '_blank');
			});
			container.appendChild(thumb);
		}

		hidePreview(container) {
			clearTimeout(this.previewTimeout);
			container.style.display = 'none';
		}

		handleAlbumClick(e, albumUrl, previewContainer) {
			if (!e.target.closest('.album-preview-flex img')) {
				window.location.href = albumUrl;
			}
		}
	}

	new BunkrAlbumsEnhanced();
})();
