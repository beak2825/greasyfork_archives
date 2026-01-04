// ==UserScript==
// @name         DLSite Price History
// @namespace    V.L
// @version      0.2.1
// @description  Remembers and displays the prices you have seen for listings.
// @author       Valerio Lyndon
// @match        https://www.dlsite.com/*
// @run-at       document-start
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.listValues
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488150/DLSite%20Price%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/488150/DLSite%20Price%20History.meta.js
// ==/UserScript==

const version = '0.2.1';
// change this to "true" to disable modifying any properties. useful when developing.
const debug = false;

GM.addStyle(`
.vl-phist {
	max-width: 200px;
	padding: 0 6px;
	border-radius: 2px;
	background: #c4c4c4;
	color: #fff;
	font-size: 11px;
	font-weight: bold;
	line-height: 17px;
	vertical-align: middle;
	box-sizing: border-box;
	text-align: center;
	text-transform: uppercase;
}
.vl-phist.best {
	background: #68e;
}
.vl-phist.new.best {
	background: #d78d2e;
}
.vl-phist.worse {
	background: #e69;
}
.cp_work_deals .vl-phist {
	display: inline-block;
	width: 49%;
}
.search_result_img_box_inner .vl-phist {
	margin-top: 5px;
}
`);

class HistoricalData {
	constructor( best, bestDate = Date.now(), addedDate = Date.now() ){
		this.best = best;
		this.bestDate = bestDate;
		this.addedDate = addedDate;
		if( this.best < 0 ){
			throw new RangeError('price cannot be less than zero');
		}
	}

	/**
	 * compares a new price to the best seen.
	 *
	 * returns negative if new price is worse OR positive if better
	 * use as true/false by checking >0 or <0 or as difference with the full return;
	 */
	compare( price ){
		return this.best - price;
	}

	toDict( ){
		return {
			'best': this.best,
			'best_date': this.bestDate,
			'added_date': this.addedDate
		}
	}

	toString( ){
		return JSON.stringify(this.toDict());
	}

	static from( stringOrObj ){
		let obj = typeof stringOrObj === 'string' ? JSON.parse(stringOrObj) : stringOrObj;
		return new HistoricalData(obj['best'], obj['best_date'], obj['added_date']);
	}
}

function hoursApart( unix1, unix2 = Date.now() ){
	return Math.floor(Math.abs(unix1 - unix2) / (1000 * 60 * 60));
}

function daysApart( unix1, unix2 = Date.now() ){
	return Math.floor(hoursApart(unix1,unix2) / 24);
}

function generateSeenAt( unix ){
	const date = new Date();

    let days = daysApart(date.getTime(), unix);
	let year = date.getFullYear();
	let month = Intl.DateTimeFormat('en-US', {'month': 'short'}).format(date);
	let day = date.getDate();

    let dayStr = days === 1 ? "1 day ago" : `${days} days ago`;
	let string = `Seen ${dayStr} on ${year}-${month}-${day}`;

    return string;
}

class PriceProcessor {
	constructor( parent ){
		this.parent = parent || document;
		this.processWorkPage();
		this.processCarousel();
		this.processGrid();
		this.processRecommended();
		this.processFavourites();
	}

	async insertPrice( workId, price, marker, placement = 'afterend' ){
		let previous = await GM.getValue(workId, false);
		previous = previous === false ? new HistoricalData(price) : HistoricalData.from(previous);

		let alert = document.createElement('div');
		alert.className = 'vl-phist';

		if( hoursApart(previous.bestDate) <= 12 ){
			alert.textContent = 'Newly recorded';
		}
		else if( previous.compare(price) >= 0 ){
			// update storage
			if( !debug ){ GM.setValue(workId, new HistoricalData(price).toString()); }

			alert.classList.add('best');
			if( hoursApart(previous.bestDate) <= 12 ){
				alert.textContent = 'NEW BEST';
				alert.classList.add('new');
			}
			else {
				alert.textContent = 'MATCHES BEST';
			}
		}
		else {
			alert.classList.add('worse');
			alert.textContent = `Best seen: ${previous.best} JPY`;
		}
		alert.title = generateSeenAt(previous.bestDate);

		marker.insertAdjacentElement(placement, alert);
	}

	async processWorkPage( ){
		const item = this.parent.querySelector('#work_buy_box_wrapper');
		if( !item ){
			return;
		}

		const workId = item.dataset.productId;
		if( !workId ){
			console.log('failed to read workId number: ', item);
			return;
		}

		let currentPrice = item.querySelector('.work_buy_content .price')?.firstChild?.textContent;
		if( currentPrice === undefined ){
			console.log('failed to read price of '+workId);
			return;
		}
		currentPrice = parseInt(currentPrice.replaceAll(/\D+/g, ''));

		let insertAgain = ()=>{
			const marker = item.querySelector('.work_buy_container');
			this.insertPrice( workId, currentPrice, marker, 'afterbegin' );
		};
		insertAgain();

		const observer = new MutationObserver((mutationsList, observer)=>{
			insertAgain();
		});
		observer.observe(item, { childList: true });
	}

	async processCarousel( ){
		const listings = this.parent.querySelectorAll('.cp_work_item');
		for( let item of listings ){
			const workId = item.dataset.workno;
			if( !workId ){
				console.log('failed to read workId number: ', item);
				continue;
			}

			let currentPrice = item.querySelector('.cp_work_price')?.firstChild?.textContent;
			if( currentPrice === undefined ){
				console.log('failed to read price of '+workId);
				continue;
			}
			currentPrice = parseInt(currentPrice.replaceAll(/\D+/g, ''));

			const marker = item.querySelector('.cp_work_deals span:last-of-type') || item.querySelector('.cp_work_value');
			this.insertPrice( workId, currentPrice, marker );
		}
	}

	async processGrid( ){
		const listings = this.parent.querySelectorAll('.search_result_img_box_inner');
		for( let item of listings ){
			let workId = item.getElementsByTagName('dt')?.[0]?.id;
			workId = typeof workId === 'string' ? workId.substring(6) : undefined;
			if( !workId ){
				console.log('failed to read workId number: ', item);
				continue;
			}

			let currentPrice = item.querySelector('.work_price')?.firstChild?.textContent;
			if( currentPrice === undefined ){
				console.log('failed to read price of '+workId);
				continue;
			}
			currentPrice = parseInt(currentPrice.replaceAll(/\D+/g, ''));

			const marker = item.querySelector('.work_deals');
			this.insertPrice( workId, currentPrice, marker );
		}
	}

	async processRecommended( ){
		const listings = this.parent.querySelectorAll('.recommend_list .swiper-slide');
		for( let item of listings ){
			const workId = item.dataset.prod;
			if( !workId ){
				console.log('failed to read workId number: ', item);
				continue;
			}

			let currentPrice = item.querySelector('.work_price')?.firstChild?.textContent;
			if( currentPrice === undefined ){
				console.log('failed to read price of '+workId);
				continue;
			}
			currentPrice = parseInt(currentPrice.replaceAll(/\D+/g, ''));

			const marker = item.querySelector('.recommend_work_item div:nth-last-of-type(2)');
			this.insertPrice( workId, currentPrice, marker );
		}
	}

	async processFavourites( ){
		const listings = this.parent.querySelectorAll('._favorite_item');
		for( let item of listings ){
			let workId = item.querySelector('.work_thumb a')?.id;
			workId = typeof workId === 'string' ? workId.substring(6) : undefined;
			if( !workId ){
				console.log('failed to read workId number: ', item);
				continue;
			}

			let currentPrice = item.querySelector('.work_price')?.firstChild?.textContent;
			if( currentPrice === undefined ){
				console.log('failed to read price of '+workId);
				continue;
			}
			currentPrice = parseInt(currentPrice.replaceAll(/\D+/g, ''));

			const marker = item.querySelector('.work_price_wrap');
			this.insertPrice( workId, currentPrice, marker );
		}
	}
}

// process older versions of the script
const reserved_keys = ['version'];
async function updateVersion( ){
	if( await GM.getValue('version', '0.1.0') === '0.1.0' ){
		for( let key of await GM.listValues() ){
			let value = parseFloat(await GM.getValue(key));
			if( reserved_keys.includes(key) || value === NaN ){
				continue;
			}

			let data = new HistoricalData(value);

			if( !debug ){ GM.setValue(key, data.toString()); }
		}
	}

	if( !debug ){ GM.setValue('version', version); }
}

// run script
document.addEventListener('DOMContentLoaded', async ()=>{
	await updateVersion();
	new PriceProcessor();

	document.querySelectorAll('.recommend_list').forEach((targetNode)=>{
		const observer = new MutationObserver((mutationsList, observer)=>{
			new PriceProcessor(targetNode);
			observer.disconnect();
		});
		observer.observe(targetNode, { childList: true });
	});
});

