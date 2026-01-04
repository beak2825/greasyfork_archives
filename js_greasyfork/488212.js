// ==UserScript==
// @name         DLSite Hide Owned
// @namespace    V.L
// @version      1.0.0
// @description  Allows hiding owned items from search results.
// @author       Valerio Lyndon
// @match        https://www.dlsite.com/*
// @run-at       document-idle
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488212/DLSite%20Hide%20Owned.user.js
// @updateURL https://update.greasyfork.org/scripts/488212/DLSite%20Hide%20Owned.meta.js
// ==/UserScript==

'use strict';

const hideClass = 'vl-hidden-due-to-purchase';
const itemClass = 'search_result_img_box_inner';
const itemSelector = `.${itemClass}:not(.${hideClass}):has([data-is_bought="true"])`;

document.head.insertAdjacentHTML('beforeend', `
<style>
	.${hideClass} {
		display: none !important;
	}
</style>`);

async function hideOwned( ){
	const items = document.querySelectorAll(itemSelector);
	Check.count(items.length);
	for( let item of items ){
		item.classList.add(hideClass);
	}
}

async function showOwned( ){
	for( let item of document.querySelectorAll('.'+hideClass) ){
		item.classList.remove(hideClass);
	}
}

const Check = new class {
	#item = document.createElement('li');
	#num = document.createElement('span');

	constructor( hidden = true ){
		this.container = document.createElement('div');
		this.container.className = 'list_content_border';

		let list = document.createElement('ul');
		list.className = 'left_refine_list';

		this.#item.className = 'left_refine_list_item refine_checkbox';
		this.#item.addEventListener('click', ()=>{
			if( this.checked() ){
				this.checked(false);
				showOwned();
			}
			else {
				this.checked(true);
				hideOwned();
			}
			GM.setValue('hide-owned', this.checked());
		});

		let text = document.createElement('a');
		text.textContent = 'Hide Owned ';

		this.container.append(list);
		list.append(this.#item);
		this.#item.append(
			text
		);
		text.append(this.#num);
		this.checked(hidden);
	}

	checked( bool ){
		if( bool === undefined ){
			return this.#item.classList.contains('selected');
		}
		if( bool ){
			this.#item.classList.add('selected');
		}
		else {
			this.#item.classList.remove('selected');
		}
		return bool;
	}

	count( int = 0 ){
		this.#num.textContent = `(${int})`;
	}
}

async function main() {
	let hidden = await GM.getValue('hide-owned', true);

	// add check to DOM
	const insertPoint = document.querySelector('.left_module_content');
	if( insertPoint ){
		Check.checked(hidden);
		insertPoint.insertAdjacentElement('afterbegin', Check.container);
	}

	// wait for shit to load - will stop once it finds purchased items or 5 seconds have passed, whichever comes first
	let waiting = setTimeout(()=>{ waiting = false }, 5000);
	const observer = new MutationObserver((mutationsList, observer)=>{
		if( !waiting || document.querySelector(`.${itemClass} [data-is_bought="true"]`) ){
			if( hidden ){
				hideOwned();
			}
			else {
				const items = document.querySelectorAll(itemSelector);
				Check.count(items.length);
			}
			observer.disconnect();
		}
	});
	observer.observe(document.querySelector('#main'), { childList: true, subtree: true });
}

main();