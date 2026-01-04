// ==UserScript==
// @name         Bandcamp Helper
// @namespace    V.L
// @version      1.2.4
// @description  Improve downloading of discographies with the addition of an item count and total size.
// @author       Valerio Lyndon
// @match        https://bandcamp.com/download*
// @match        https://*.bandcamp.com/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/476578/Bandcamp%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/476578/Bandcamp%20Helper.meta.js
// ==/UserScript==

const debug = false;

const url = new URL(window.location);

function style( css ){
	const element = document.createElement('style');
	element.textContent = css;
	document.documentElement.append(element);
}

class MassDownload {
	constructor( ){
		this.wrapper = document.createElement('li');
		this.paragraph = document.createElement('p');
		this.wrapper.append(this.paragraph);
		document.querySelector('.download_list').prepend(this.wrapper);
		this.dropdowns = document.querySelectorAll('select#format-type');
		for( let dropdown of this.dropdowns ){
			dropdown.addEventListener('change', ()=>{
				this.calculateBytes();
			});
		}
		this.calculateBytes();
	}

	calculateBytes( ){
		let totalBytes = 0;
		let totalItems = this.dropdowns.length;
		for( let dropdown of this.dropdowns ){
			dropdown.addEventListener('change', this.calculateBytes);
			let selected = false;
			for( let opt of dropdown.getElementsByTagName('option') ){
				if( opt && opt.selected ){
					selected = opt;
				}
			}
			if( !selected ){
				console.log('skipping 1 entry due to unknown format');
				continue;
			}
			let match = selected.textContent.match(/([\d\.]+)([A-Za-z][bB])/);
			let bytes = Number(match[1]);
			let byteFormat = match[2];
			switch( byteFormat.toUpperCase() ){
				case 'TB':
					bytes *= 1024;
				case 'GB':
					bytes *= 1024;
				case 'MB':
					bytes *= 1024;
				case 'KB':
					bytes *= 1024;
			}

			totalBytes += bytes;
		}

		function formatBytes( bytes ){
			let format = 'B';
			if( bytes / 1024 >= 1 ){
				bytes /= 1024;
				format = 'KiB';
			}
			if( bytes / 1024 >= 1 ){
				bytes /= 1024;
				format = 'MiB';
			}
			if( bytes / 1024 >= 1 ){
				bytes /= 1024;
				format = 'GiB';
			}
			if( bytes / 1024 >= 1 ){
				bytes /= 1024;
				format = 'TiB';
			}
			// round to two decimal places
			bytes = Math.round(bytes*100) / 100;
			return `${bytes}${format}`;
		}

		this.paragraph.textContent = `Total download size for ${totalItems} items of selected quality is ${formatBytes(totalBytes)}`;
	}
}

class Discography {
	constructor( ){
		this.items = Array.from(document.getElementsByClassName('music-grid-item'));

		style(`
			.vl-price-tag {
				position: absolute;
				bottom: 4px;
				right: 4px;
				padding: 2px;
				background: rgba(0,0,0,0.7);
				border-radius: 2px;
				color: #fff;
				font-weight: bold;
				text-shadow: 0 0 5px rgb(0,0,0,0.7);
			}
		`);

		for( let item of this.items ){
			const cached = window.sessionStorage.getItem(`price-${item.dataset.itemId}`);
			let tag = document.createElement('span');
			tag.className = `vl-price-tag`;
			tag.textContent = cached !== null ? cached : '...';
			item.getElementsByClassName('art')[0].append(tag);
			if( cached === null ){
				item.addEventListener('mouseenter', ()=>{ this.assignPrice(item) });
			}
		}

		const grid = document.getElementById('music-grid');
		grid.style.marginTop = '15px';

		const loadAllBtn = document.createElement('a');
		loadAllBtn.href = "#";
		loadAllBtn.textContent = 'Load all prices.';
		loadAllBtn.addEventListener('click', ()=>{ this.lazyLoadItems(0); });
		grid.insertAdjacentElement('beforebegin', loadAllBtn);

		const clearCacheBtn = document.createElement('a');
		clearCacheBtn.href = "#";
		clearCacheBtn.textContent = 'Clear price cache.';
		clearCacheBtn.addEventListener('click', ()=>{ this.clearCache(); });
		if( debug ){
			grid.insertAdjacentElement('beforebegin', clearCacheBtn);
		}
	}

	async lazyLoadItems( index ){
		const item = this.items[index];
		let wait = await this.assignPrice(item);

		if( wait ){
			const delay = 50*(1+(index*0.15));
			setTimeout(()=>{
				this.lazyLoadItems(index+1);
			}, delay);
		}
		else {
			this.lazyLoadItems(index+1);
		}
	}

	async assignPrice( item ){
		if( item.dataset.priced ){
			return false;
		}
		const url = item.getElementsByTagName('a')[0].href;
		const price = await this.getPrice(url);
		let tag = item.querySelector('.vl-price-tag');
		tag.textContent = price;
		window.sessionStorage.setItem(`price-${item.dataset.itemId}`, price);
		item.dataset.priced = true;
		return true;
	}

	async getPrice( url ){
		let price = 'unknown price';
		let previousQuantity = 99999;
		try {
			const page = await fetch(url);
			const text = await page.text();
			const parser = new DOMParser();
			const dom = parser.parseFromString(text, 'text/html');

			const buyOptions = dom.querySelectorAll('.buyItem:not(.buyFullDiscography):not(.subscribeLink)');
			if( buyOptions.length === 0 ){
				price = 'not for sale';
			}
			for( let option of buyOptions ){
				const link = option.querySelector('h4 .buy-link');
				const detail = link ? link.nextElementSibling : null;

				if( option.textContent.includes('Free') ){
					price = 'free';
					break;
				}
				else if( detail === null && dom.querySelector('.buyItem:not(.buyFullDiscography):not(.subscribeLink) .you-own-this') ){
					price = 'owned';
					break;
				}
				else if( detail && detail.childElementCount > 0 ){
					const quantity = detail.querySelector('.base-text-color').textContent;
					const rawQuantity = parseInt(quantity.replaceAll(/\D+/g,''));
					if( rawQuantity < previousQuantity ){
						previousQuantity = rawQuantity;
						const currency = detail.querySelector('.secondaryText').textContent;
						price = `${quantity} ${currency}`;
					}
				}
				else if( detail && detail.className.includes('buyItemExtra') ){
					price = 'name your price';
					break;
				}
			}
		}
		catch {
			false;
		}
		return price;
	}

	clearCache( ){
		for( var i = 0; i < sessionStorage.length; i++ ){
			const key = sessionStorage.key(i);
			if( key.startsWith('price-') ){
				sessionStorage.removeItem(key);
				i--;
			}
		}
	}
}


// Download pages
if( url.pathname.startsWith('/download') ){
	document.querySelector('.bfd-download-dropdown').addEventListener('click', ()=>{ new MassDownload(); });
}

// Discographies
if( (url.hostname.match(/\./g) || []).length === 2 && /^\/$|^\/music\/?$/.test(url.pathname) ){
	new Discography();
}