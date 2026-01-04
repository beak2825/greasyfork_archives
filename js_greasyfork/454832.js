// ==UserScript==
// @name         marketHandler
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Simplifies buying listings or creating buyorders from SCM.
// @author       gortik
// @license      MIT
// @match        https://steamcommunity.com/market/pricehistory/
// @match        https://steamcommunity.com/market/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454832/marketHandler.user.js
// @updateURL https://update.greasyfork.org/scripts/454832/marketHandler.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();

/*


buylisting
	
	fail:
	{message: "You've already purchased this item."}
	
buyorder
	{"success":1,"buy_orderid":"5551566664"}
	
	
ShowPromptDialog
*/

var logger = ( LOG_PREFIX ) =>
	function log( ...args ) {
		// 2. Prepend log prefix log string
		args.unshift('[' + LOG_PREFIX + '] ' );
		// 3. Pass along arguments to console.log
		console.log.apply( this, args );
	}


var mtoast = {
	css: `
		.mtoast {

			/* (B) DIMENSION */
			//width: 200px;
			padding: 10px;

			/* (C) COLORS */
			border: 1px solid #c52828;
			background: #ffebe1;
			border: 1px solid #000;


			border-radius: 5px;
			margin-bottom: 20px;
		}

		.mtoast.show {
			display:block
		}

		#mtoast-holder {
			position: fixed;
			z-index: 999;
			right: 20px;
			top: 50px;
			width: 200px;
			display: flex;
			flex-direction: column;
		}

		.fade-in {
			animation: fadeIn linear .8s;
		}

		.fade-out {
			animation: fadeOut linear .5s;
		}
		@keyframes fadeIn {
			0% {
				opacity: 0;
				max-height: 0px;
			}

			100% {
				opacity: 1;
				max-height: 100px;
			}
		}

		@keyframes fadeOut {
			0% {
				opacity: 1;
				max-height: 100px;
			}
			100% {
				opacity: 0;
				max-height: 0;
			}
		}
	`,
	container: null,


	addCSStyle: (styleText) => {
		let style = document.createElement('style');
		style.type = 'text/css';
		document.head.appendChild(style);
		style.appendChild(document.createTextNode(styleText));
	},

	init: ( ) => {
		mtoast.addCSStyle( mtoast.css );
		let container = document.createElement( 'div' );
		container.setAttribute( 'id', 'mtoast-holder' );
		document.body.insertAdjacentElement( 'afterbegin', container );
		mtoast.container = container;
	},

	removeMToast: ( e ) => {
		e.target.classList.add( 'fade-out' );
		setTimeout( () => e.target.remove( ), 500 );
	},

	createMToast: ( ) => {
		let toast = document.createElement( 'div' );
		toast.classList.add( 'mtoast' );
		toast.classList.add( 'fade-in' );
		mtoast.container.insertAdjacentElement( 'afterbegin', toast );
		return toast;
    },

	msg: ( msg ) => {
		if (!mtoast.container)
			toast.init();
		let toast = mtoast.createMToast();
		toast.innerHTML = msg;
		toast.classList.add( 'show' );
		toast.addEventListener( 'click', mtoast.removeMToast  );
	}
}

mtoast.init();

var htmlHandler = (function() {

	_addHTML( );

	function addCSS( css ) {
		document.head.appendChild( document.createElement( 'style') ).innerHTML = css;
	}
	
	function _newElement(tag, innerHTML, append, attrs, listeners) {
		//create the element with a specified string:
		let element = document.createElement(tag);
		element.innerHTML = innerHTML;
		//create a for...in loop set attributes
		for (let val in attrs)
			element.setAttribute(val, attrs[val]);
			//element[val] = attrs[val];
		//create a for...in loop set listeners
		for (let lis in listeners)
			element.addEventListener(lis, listeners[lis]);

		if (append.parent)
			append.parent.insertAdjacentElement( append.where, element );
		if (append.selector)
			document.querySelector(append.selector).appendChild(element);

		/*if (innerHTML)
			element.innerHTML = innerHTML;*/
		return element;
	}

	function _addHTML() {
		let	innerHTML = '',
			parent;
		//steam market main page
		if ( document.querySelector('.pick_and_sell_button') ) {
			innerHTML = `<a id="buy-listing-btn" class="item_market_action_button item_market_action_button_green"><span class="item_market_action_button_contents">Buy Listing</span></a><a id="buy-order-btn" class="item_market_action_button item_market_action_button_green"><span class="item_market_action_button_contents">BuyOrder</span></a>`;
			parent = document.querySelector('.pick_and_sell_button');
			//remove Sell an item button
			document.querySelector('.pick_and_sell_button a').remove( );
		} else {
			innerHTML = `<button id="buy-order-btn">BuyOrder</button><button id="buy-listing-btn">Buy Listing</button><br><br>`;
			parent = document.body;
		}
		parent.insertAdjacentHTML( 'afterbegin',  innerHTML);
		addCSS( '.pick_and_sell_button>a:not(:last-child) { margin: 0px 10px; }' )
	}

	return { }
})();



var marketHandler = (function() {
	let	_address,
		_session_id,
		_currency_euro = 3,	//euro
		_currency_sign = '€',
		_log = logger( 'Market' );
	
	const _html = {
			btns: [ {
				selector: '#buy-order-btn',
				fn: parseInput_buyOrder,
				infoTxt: 'BuyOrder: itemName, price, quantity'
			}, {
				selector: '#buy-listing-btn',
				fn: parseInput_purchaseListing,
				infoTxt: 'Buy listing: listingID, price_without_fess_cents, fee_cents'
			}]
		}
	
	init();

	function _htmlInit() {
		_html.btns.forEach( btn_info => {
			let btn = document.querySelector( btn_info.selector );			
			btn.addEventListener( 'click', () => {
				let response = window.prompt( btn_info.infoTxt );
				btn_info.fn( response );
			});
		});
	}
	
	function _createDoc( innerHTML ) {
		let doc = document.implementation.createHTMLDocument( 'tmp' );
		doc.documentElement.innerHTML = innerHTML;
		return doc;
	}

	function _parseAddress( doc ) {
		let	arr, empty_properties = 0,
			//if listings page has visible listings from people or just buy/sell orders
			buyTypeSelector = doc.querySelector('.market_buynow_paymentinfo_row') ? 'market_buynow_paymentinfo_row' : 'market_dialog_row';

		arr = doc.querySelectorAll('.' + buyTypeSelector + ' input');
		//Address not found.
		if (arr.length == 0)
			return false;

		_address = { };
		arr.forEach(e => {
			//billing_country_buynow	SK
			let	propertyName = e.name.split( '_buynow' )[0],
				value = e.value;
			//save_my_address is checkbox
			if (e.type == 'checkbox')
				value = 1;
			_address[ propertyName ] = value;
			//console.log(propertyName + '\t' + value);
			if (e.value == '' && ++empty_properties > 2)
				throw 'Address is missing inputs';
		});
		return true;
	}

	function _getSessionID( doc ) {
		let result = doc.documentElement.innerHTML.match(/g_sessionID = "([\w\d]+)"/);
		if (result) {
			return result[1];
		}
		else {
			console.log( doc.documentElement.innerHTML );
			throw 'Session_ID not found';
		}
	}

	//gets user full name and address + sessionid
	async function _downloadData() {
		let	doc = document;
		//try to get Address from actual document and check if variable g_sessionID is defined
		if ( !_parseAddress( doc ) && typeof g_sessionID == 'undefined' ) {
			let res = await fetch( 'https://steamcommunity.com/market/' );
			let text = await res.text();
			doc = _createDoc( text );
		}
		_parseAddress( doc );
		_session_id = _getSessionID( doc );

		_log( 'Init: success' );
		_log( _address );
		_log( 'sessionID: ' + _session_id );
	}
	
	async function _post( url, data ) {
		_log( 'Post: ' + url + '\n', data );
		let response = await fetch( url, {
			"headers": {
				"accept":"*/*",
				"content-type":"application/x-www-form-urlencoded; charset=UTF-8",
			},
			//"body":"sessionid=d70d067dd4f5e506c4b0ae07&currency=3&subtotal=12&fee=2&total=14&quantity=1&first_name=Jan&last_name=Mrk&billing_address=Ruzova+61&billing_address_two=&billing_country=SK&billing_city=Bystrica&billing_state=&billing_postal_code=95911&save_my_address=1",
			body: new URLSearchParams( data ).toString(),
			"method":"POST",
		});
		let json = await response.json();
		return json;
	}

	function _parseBuyListing( json ) {
		let msg = ''
		_log( json );
		if ( json ) {
			if ( json.wallet_info )
				msg = 'Success.';
			if ( json.message )
				msg = 'Fail: ' + json.message;
		} else
			msg = 'Fail.';

		mtoast.msg( msg );
	}

	async function purchaseListing(listing_id, price_without_fess_cents, fee_cents, quantity = 1) {
		let url = 'https://steamcommunity.com/market/buylisting/' + listing_id;
		//convert to int
		price_without_fess_cents *= 1;	fee_cents *= 1;
		let	data = {
				sessionid: _session_id,
				currency: _currency_euro,
				subtotal: price_without_fess_cents,
				fee: fee_cents,
				total: price_without_fess_cents + fee_cents,
				quantity: quantity
			};		
		//merge data
		data = { ...data, ..._address };

		mtoast.msg( `Buying: ${listing_id} for ${data.total/100} euro` );

		let json = await _post( url, data );
		_parseBuyListing( json );
	}

	function parseInput_purchaseListing( str ) {
		//str: listing_id	 price_without_fess_cents	 fee_cents	 quantity = 1	//all digits
		if ( str ) {
			let result = str.match(/\d+/g);
			if ( result && (result.length == 3 || result.length == 4) ) {
				//spread argument
				purchaseListing( ...result );
				return;
			}
		}
		mtoast.msg( `Bad input: '${str}'`);
	}

	function _parseBuyOrder( json ) {
		let msg = '';
		_log( json );
		if ( json && json.success)
			msg = 'Success.';
		else
			msg = 'Fail.';
		mtoast.msg( msg );
	}	
	
	function parseInput_buyOrder( str ) {
		//str: market_hash_name,	price_in_euro_per_unit,	quantity,	appid = 440
		if ( str ) {
			let result = str.split( ',' );
			if ( result && (result.length == 3 || result.length == 4) ) {
				//spread argument
				createBuyOrder( ...result );
				return;
			}
		}
		mtoast.msg( `Bad input: '${str}'`);
	}	
	
	async function createBuyOrder(market_hash_name, price_in_euro_per_unit, quantity, appid = 440) {
		let	url = 'https://steamcommunity.com/market/createbuyorder/',
			//total price for buyOrder in cents
			price_total = Math.round( price_in_euro_per_unit * quantity * 100 ),
			data = {
				sessionid: _session_id,
				currency: _currency_euro,
				appid: appid,
				market_hash_name: market_hash_name,
				price_total: price_total,
				quantity: quantity
			};
		//merge data
		data = { ...data, ..._address };

		mtoast.msg(`${quantity} x '${market_hash_name}' for ${price_in_euro_per_unit}${_currency_sign} | (${price_total})`);

		let json = await _post( url, data );
		_parseBuyOrder( json );
	}
	
	function init( ) {
		if ( _address && _session_id) {
			_log( 'Address and sessionID already prepared.' );
		} else {
			_downloadData();
		}
		_htmlInit();
	}

	return {
		init: init,
		parseInput_purchaseListing: parseInput_purchaseListing,
		purchaseListing: purchaseListing,
		parseInput_buyOrder: parseInput_buyOrder,
		createBuyOrder: createBuyOrder
	}	
})();



function purchaseListing(listing_id, price_without_fess_cents, fee_cents, quantity = 1) {
	marketHandler.purchaseListing( listing_id, price_without_fess_cents, fee_cents, quantity );
}


//await buyerHandler.init()
//purchaseListing( '5490478797650994539', 896, 133 )