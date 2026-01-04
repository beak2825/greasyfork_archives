// ==UserScript==
// @name         hippo Externals
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Close hippo external product tabs
// @author       e-c
// @include      https://felicia.md/ro/search?query=*
// @include      http://medicamente.md/mo/search/apachesolr_search/*
// @include      https://medicamente.md/mo
// @include      http://medicamente.md/mo
// @include      http://medicamente.md/mo/product/*
// @include      https://www.apteka.md/index.php?route=product/search&search=*
// @include      https://farmacie-online.md/ro/cautare?controller=search&orderby=position&orderway=desc&search_query=*
// @include      https://ff.md/search?type=product&options%5Bprefix%5D=last&q=*
// @include      https://orient.md/ro/products?page_items=20&sort=name&search_key=*
// @include      https://vitapharm.md/md/?s=*
// @include      https://mamico.md/ro/search/?q=*
// @include      https://farmacie.md/ro/search?query=*


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447719/hippo%20Externals.user.js
// @updateURL https://update.greasyfork.org/scripts/447719/hippo%20Externals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //random stuff
    if (location.href.startsWith("http://medicamente.md/mo/product/")) {//http://medicamente.md/mo/product/
    	return document.querySelector('.info-basket .info a').click();
    }

const selectors = {
        'felicia.md': '.search-row .product-item-container',
        'medicamente.md': '.resuls > tbody> tr',
        'www.apteka.md': '.main-products > div',
        'farmacie-online.md': '.product_item',
        'ff.md': '.product-list .product-item',
        'orient.md': '.item_catalog',
        'vitapharm.md': '.default_page div p',
        'mamico.md': '.catalog__pills__row .catalog__pill',
        'farmacie.md': '.product_catalog_flex',
    };

    const includes = [
		'https://felicia.md/ro/search?query=*',
		'http://medicamente.md/mo/search/apachesolr_search/*',
		'https://www.apteka.md/index.php?route=product/search&search=*',
		'https://farmacie-online.md/ro/cautare?controller=search&orderby=position&orderway=desc&search_query=*',
		'https://ff.md/search?type=product&options%5Bprefix%5D=last&q=*',
		'https://orient.md/ro/products?page_items=20&sort=name&search_key=*',
		'https://vitapharm.md/md/?s=*',
		'https://mamico.md/ro/search/?q=*',
		'https://farmacie.md/ro/search?query=*',

    ];

    const searchInputs = {
		'www.smart.md': '.__new_input_search_home',
    }

    let sleepBool = false;
    if(searchInputs[location.hostname] !== undefined && location.hash) {
        let search = decodeURI(location.hash.substring(1).split('&')[0]);
        if (['fotomax.md'].includes(location.hostname)) {
			// load jQuery and execute the main function
			// addJQuery(main);
			document.querySelector(searchInputs[location.hostname]).value=search;
			document.querySelector('.sns-searchwrap .innericon').click();
        }else if(['termotrade.md'].includes(location.hostname)) {
        	// addJQuery(main);
			jQuery(searchInputs[location.hostname]).val(search);
			jQuery(searchInputs[location.hostname]).trigger('mouseup');
        }
        else {
        	if ($(searchInputs[location.hostname]).last().val() != search)
				$(searchInputs[location.hostname]).val(search).trigger('keyup').trigger('change').click().parents('form').submit();
        }
		//$('#search_input').val('iphone 11').trigger('keyup').trigger('change').click();
		sleepBool = true;
    }

    //new add sleep for ajax reslut websites like zap.md
    if (['www.zap.md','bigshop.md','f24.md','power-tools.md'].includes(location.hostname)) {sleepBool = true;}
	var close = true;
    if(['www.mvideo.ru','www.eldorado.ru'].includes(location.hostname)) close=false;

    let searchText;
    var str = location.href;
	const urlParams = new URLSearchParams(window.location.search);
	let hashSlipt = location.hash.split('&');
    includes.forEach((product) => {
        if(!product.includes(location.origin)) return;
        product = product.replace('*', '');
        str = str.replace(product, '');
        str = str.replace('%21', '!');
        // alert(str);
        // alert(encodeURI(urlParams.get('dopsearch')));
        // alert(encodeURIComponent(urlParams.get('dopsearch')));
        // str = str.replaceAll('/', '');

		if(urlParams.has('ns')) str = str.replace('&ns='+encodeURI(urlParams.get('ns')), '').replace('?ns='+encodeURI(urlParams.get('ns')), '');//mb encodeURIComponent
		if(urlParams.has('dopsearch')) str = str.replace('&dopsearch='+encodeURI(urlParams.get('dopsearch')), '').replace('?dopsearch='+encodeURI(urlParams.get('dopsearch')), '');//mb encodeURIComponent
		if(hashSlipt.length>1) str = str.replace('&'+hashSlipt[1], '');//mb encodeURIComponent
	});

	// alert(str);
	// alert(decodeURIComponent(str));
	searchText = decodeURIComponent(str.replace(/\+/g, '%20'));

	if (['eshop.moldcell.md'].includes(location.hostname)) {
		$('.search .fa.fa-search').click();
		$(searchInputs[location.hostname]).val(searchText).trigger('keydown').trigger('keyup');
		sleepBool = true;
	}

	async function searchResults() {
		if(sleepBool) await sleep(5500);
	    var products = document.querySelectorAll(selectors[location.hostname]);
	    if(!products.length && close) {
	    	//return window.close();
	    }

	    //vipapharm
	    if (products.length==1 && !products[0].querySelectorAll('a').length) return window.close();

	    //new some websites give results even if keywords were not found. Search products text to find keywords or close.
		if(['www.zap.md'].includes(location.hostname)) {
			var hash = window.location.hash.substr(1);
			var result = hash.split('&');
			str = result[0].substring(5);
			searchText = decodeURI(str.replace(/\+/g, '%20'));
		}

		// alert(str);
		console.log(products);
		if (/*(location.hostname === 'enter.online' && products.length === 10) || */location.hostname === 'www.smart.md' && products.length === 5) close = false;

	    let found = 0;
	    products.forEach((product) => {
            let element = products[0];
            let href = '';
			if (location.hostname === 'www.apteka.md') href = element.querySelectorAll('a')[1].getAttribute('href');
			else if(location.hostname === 'ff.md') href = element.querySelectorAll('a[href^="/products/"]')[0].getAttribute('href');
            else href = element.querySelectorAll('a')[0].getAttribute('href');
            console.log(href);
	    	href ? href.toLowerCase() : '';
    		if(product.textContent.toLowerCase().includes(searchText.toLowerCase())) {
    			found++;
    		}else if(product.textContent.toLowerCase().includes(searchText.replace(' ', '').toLowerCase()) || product.textContent.toLowerCase().includes(searchText.replace(' ', '-').toLowerCase())){
    			found++;
			}else if(href.includes(searchText.replace(' ', '_').toLowerCase()) || href.includes(searchText.replace(' ', '-').toLowerCase())){
				found++;
			}else {
    			if(!['www.mvideo.ru'].includes(location.hostname))
					product.remove();
    		}
		});


		var products = document.querySelectorAll(selectors[location.hostname]);
		console.log(products);
		console.log(searchText);
		// if search 1 word then find exact that word
		var searchTextSplit = searchText.split(" ");
		if(products.length > 1 && searchTextSplit.length == 1) {
		    products.forEach((product) => {
		    	// console.log(product.textContent.replace(/\r?\n|\r/g, " ").replace(/['"]+/g, '').replace(',', '').toLowerCase())
	    		if(product.textContent.replace(/\r?\n|\r/g, " ").replace(/['"]+/g, '').replace(',', '').toLowerCase().split(" ").includes(searchText.toLowerCase())) {
	    			found++;
	    		}else {
					//product.remove();
	    		}
			});

			products = document.querySelectorAll(selectors[location.hostname]);
		}

		if(products.length == 2 && selectors[location.hostname].includes(',')) {
			let selectorsSplit = selectors[location.hostname].split(",");
			products = document.querySelectorAll(selectorsSplit[0]);
			if(!products.length) products = document.querySelectorAll(selectorsSplit[1]);
		}



		//NEW. search by dop keywords
		if (products.length) {
			const urlParams = new URLSearchParams(window.location.search);
			let dopSearches = [];
			if(urlParams.has('dopsearch')) {
				dopSearches.push(urlParams.get('dopsearch').split('|'));
			}else if(location.hash.split('&').length > 1 && location.hash.includes('dopsearch')) {
				dopSearches.push(decodeURIComponent(location.hash.split('&')[1].replace('dopsearch=', '')).split('|'));
			}
			if (dopSearches.length) {
				found=0;
			    dopSearches[0].forEach((s) => {
			    	products = document.querySelectorAll(selectors[location.hostname]);
			    	console.log(s);
				    products.forEach((product) => {
			    		// alert(s[0]);

				    	if(s[0] === '!') {
				    		var s2 = s.replace('!','');
				    		console.log(s2);
		    				var searchTextSplit2 = s2.split(" ");
							// if(searchTextSplit.length == 1) {
							// }
							if(searchTextSplit2.length == 1 && product.textContent.replace(/\r?\n|\r/g, " ").replace(/['"]+/g, '').replace(',', '').toLowerCase().split(" ").includes(s2.toLowerCase())) {
				    		// if(product.textContent.toLowerCase().includes(s2.toLowerCase()) || product.textContent.toLowerCase().includes(s2.replace(' ', '').toLowerCase()) || product.textContent.toLowerCase().includes(s2.replace(' ', '').toLowerCase())) {
				    			// console.log(product.textContent.toLowerCase());
				    			product.remove();
				    		}else {
								found++;
				    		}
				    	}else {
				    		if(product.textContent.toLowerCase().includes(s.toLowerCase()) || product.textContent.toLowerCase().includes(s.replace(' ', '').toLowerCase()) || product.textContent.toLowerCase().includes(s.replace(' ', '').toLowerCase())) {
				    			found++;
				    		}else {
								product.remove();
				    		}
				    	}

					});
				});
				console.log(dopSearches);
			}
		}

		products = document.querySelectorAll(selectors[location.hostname]);
	    if(products.length == 1) {
	    	let element = products[0];
			if (location.hostname === 'www.apteka.md') element = element.querySelectorAll('a')[1];
			else if(location.hostname === 'ff.md') element = element.querySelectorAll('a[href^="/products/"]')[0];
			else if(products[0].tagName !== 'A') element = element.querySelectorAll('a')[0];
			// new item can be wrapped in a tag so check parent.
			if(!element && products[0].parentElement.tagName === 'A') element = products[0].parentElement;

			element.removeAttribute('target');
			element.click();

	    	// console.log(element);
	    }



		// console.log(found);
		const urlParams = new URLSearchParams(window.location.search);

		if(!found && close/* && !urlParams.has('dopsearch')*/) {
			// NEW. try to search another keyword
			if(!sleepBool) {
				if(urlParams.has('ns') && urlParams.get('ns') !== str && urlParams.get('ns') !== searchText) return location.href = location.href.replace(str, urlParams.get('ns'));

				if(searchTextSplit.length == 1 && searchText.includes('-')) {
					// var url = new URL(location.href.replace(str, str.replace('-', '')));
					// url.searchParams.append('ns', searchText.replace('-', '%20'));
					var url = location.href.replace(str, str.replace('-', ''));
					if(url.includes('?')) url+= '&ns='+str.replace('-', ' ');
					else url+= '?ns='+str.replace('-', ' ');


					return location.href = url;
				}
			}

			return window.close();
		}

	}


    searchResults();


    //sleep helper
    function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function addJQuery(callback) {
		var script = document.createElement("script");
		script.setAttribute("src", "//code.jquery.com/jquery-3.4.1.min.js");
		script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
		document.body.appendChild(script);
		}, false);
		document.body.appendChild(script);
	}

	// the guts of this userscript
	function main() {
		let search = decodeURI(location.hash.substring(1));
		jQuery('#mod-mls-searchword-mls_mod_187').val(search).trigger('mouseup').trigger('keyup').trigger('change').click().parent().submit();
		jQuery('#mod-mls-searchword-mls_mod_187').trigger('mouseup').trigger('keyup').trigger('change').click().parent().submit();

	}

	// window.addEventListener('message', event => {
	//     // IMPORTANT: check the origin of the data!
	//     if (event.origin.startsWith('https://e-catalog.md')) {
	//         // The data was sent from your site.
	//         // Data sent with postMessage is stored in event.data:
	//         console.log(event.data);
	//         alert(event.data);
	//     } else {
	//         // The data was NOT sent from your site!
	//         // Be careful! Do not use it. This else branch is
	//         // here just for clarity, you usually shouldn't need it.
	//         return;
	//     }
	// });
})();