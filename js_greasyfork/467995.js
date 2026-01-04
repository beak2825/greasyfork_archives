// ==UserScript==
// @name	考试宝答题界面优化
// @version	1.2.8
// @license	GPL-3
// @namespace	https://github.com/AliubYiero/TamperMonkeyScripts
// @run-at	document-start
// @author	Yiero
// @homepage	https://github.com/AliubYiero/TamperMonkeyScripts
// @description	优化考试宝答题界面UI，增加按键绑定
// @match	https://www.zaixiankaoshi.com/*
// @grant	GM_addStyle
// @icon	https://www.zaixiankaoshi.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/467995/%E8%80%83%E8%AF%95%E5%AE%9D%E7%AD%94%E9%A2%98%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/467995/%E8%80%83%E8%AF%95%E5%AE%9D%E7%AD%94%E9%A2%98%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

var _options, __defProp = Object.defineProperty,
	__publicField = ( obj, key, value ) => ( ( ( obj, key, value ) => {
		key in obj ? __defProp( obj, key, {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: value,
		} ) : obj[key] = value;
	} )( obj, 'symbol' != typeof key ? key + '' : key, value ), value ),
	__accessCheck = ( obj, member, msg ) => {
		if ( !member.has( obj ) ) {
			throw TypeError( 'Cannot ' + msg );
		}
	};

class SubmitAnswerStatusChange {
	static submit() {
		this.isSubmit = !0;
	}
	
	static close() {
		this.isSubmit = !1;
	}
	
	static fresh() {
		this.close();
	}
}

__publicField( SubmitAnswerStatusChange, 'isSubmit', !1 );

class OptionObserver extends MutationObserver {
	constructor( node, callback ) {
		super( callback ), super.observe( node, {
			childList: !0,
		} );
	}
}

function urlJudge( urlHeader ) {
	return 'string' == typeof urlHeader && ( urlHeader = new RegExp( urlHeader ) ), !!document.URL.match( urlHeader );
}

class OptionListStorage {
	static get() {
		return __accessCheck( obj = this, member = _options, 'read from private field' ),
			getter ? getter.call( obj ) : member.get( obj );
		var obj, member, getter;
	}
	
	static set( optionList ) {
		var obj, member, value, setter;
		value = optionList, __accessCheck( obj = this, member = _options, 'write to private field' ),
			setter ? setter.call( obj, value ) : member.set( obj, value );
	}
}

_options = new WeakMap, ( ( obj, member, value ) => {
	if ( member.has( obj ) ) {
		throw TypeError( 'Cannot add the same private member more than once' );
	}
	member instanceof WeakSet ? member.add( obj ) : member.set( obj, value );
} )( OptionListStorage, _options, void 0 );

const functionChainCall = new class {
	constructor() {
		__publicField( this, 'callChain' ), this.callChain = [];
	}
	
	set( fn, params = [] ) {
		this.callChain.push( [ fn, params ] );
	}
	
	setList( array ) {
		array.forEach( ( fn => {
			Array.isArray( fn ) ? this.set( fn[0], fn[1] ) : this.set( fn );
		} ) );
	}
	
	show() {
		console.info( this.callChain );
	}
	
	async call() {
		let returnString;
		for ( ; this.callChain[0]; ) {
			if ( 'stop' === returnString ) {
				return;
			}
			if ( 'skip' === returnString ) {
				this.callChain.shift();
				continue;
			}
			const fn = this.callChain[0];
			returnString = await fn[0].apply( null, fn[1] ), this.callChain.shift();
		}
	}
};

functionChainCall.set( ( function () {
	if ( !urlJudge( /https:\/\/www\.zaixiankaoshi\.com\/mnks\/\?paperid/ ) ) {
		return;
	}
	console.info( 'Add quick question choose option. ' ), document.querySelector( '.custom-table' ).querySelectorAll( 'tr:not(:last-of-type)' ).forEach( ( col => {
		const row = col.querySelector( 'td:nth-of-type(2)' ),
			colInput = row.querySelector( 'input' ), {
				min: min,
				max: max,
			} = colInput, maxBtn = document.createElement( 'button' );
		maxBtn.classList.add( 'el-button' ), maxBtn.innerText = 'Max', maxBtn.addEventListener( 'click', ( e => {
			e.preventDefault(), colInput.value = max;
		} ) );
		const minBtn = document.createElement( 'button' );
		minBtn.classList.add( 'el-button' ), minBtn.innerText = 'Min', minBtn.addEventListener( 'click', ( e => {
			e.preventDefault(), colInput.value = min;
		} ) );
		const tenPercentBtn = document.createElement( 'button' );
		tenPercentBtn.classList.add( 'el-button' ), tenPercentBtn.innerText = '10%', tenPercentBtn.addEventListener( 'click', ( e => {
			e.preventDefault(), colInput.value = String( Math.ceil( .1 * parseInt( max ) ) );
		} ) ), row.append( maxBtn ), row.append( minBtn ), row.append( tenPercentBtn );
	} ) );
} ) );

const fnList = [ function () {
	urlJudge( /^https:\/\/www.zaixiankaoshi.com\/(online\/\?paperId)|(mnks\/simulation)/ ) && GM_addStyle( '\n\t\t/* \u5c45\u4e2d\u4e3b\u5bb9\u5668 */\n\t\t.app-main {\n\t\t\tdisplay: flex;\n\t\t\tjustify-content: center;\n\t\t\talign-items: center;\n\t\t\tpadding: 0;\n\t\t}\n\t\t\n\t\t/* \u4f18\u5316\u4e3b\u5bb9\u5668UI */\n\t\t.middle-container {\n\t\t\tpadding: 10px 61 px;\n\t\t\tborder-radius: 10px;\n\t\t}\n\t\t\n\t\t/*\u663e\u793aai\u89e3\u6790*/\n\t\t.prative-page .answer-box .hide-height .answer-analysis {\n\t\t\tmargin-right: 8px;\n\t\t\twidth: 100%;\n\t\t\t-webkit-line-clamp: 1;\n\t\t\toverflow: hidden;\n\t\t\twhite-space: normal;\n\t\t}\n\t\t\n\t\t/* \u9690\u85cf\u591a\u4f59\u5143\u7d20 */\n\t\t.vip-quanyi,\n\t\t.new-footer,\n\t\t.header,\n\t\t.vip-tips,\n\t\t.right-float-window,\n\t\t.el-button.el-button--warning.el-button--mini,\n\t\t.page-main .pull-right > :not(.serch-form) {\n\t\t\tdisplay: none;\n\t\t}\n\t' );
}, function () {
	if ( !urlJudge( /https:\/\/www\.zaixiankaoshi\.com\/mnks\/\?paperid/ ) ) {
		return;
	}
	localStorage.removeItem( 'openRandomOption' ), console.info( 'Remove Origin Random Option Btn. ' );
	const formContainer = document.querySelectorAll( 'div.box-card > form > div' );
	let randomOptionLabel = document.createElement( 'div' );
	formContainer.forEach( ( formItem => {
		var _a;
		'\u9009\u9879\u4e71\u5e8f' === ( null == ( _a = formItem.querySelector( 'label' ) ) ? void 0 : _a.innerText ) && ( randomOptionLabel = formItem );
	} ) ), randomOptionLabel.querySelector( 'div' ).remove();
	const reRandomOptionBtnContainer = document.createElement( 'form' );
	reRandomOptionBtnContainer.id = 'random-option-container', reRandomOptionBtnContainer.style.height = '40px',
		reRandomOptionBtnContainer.style.lineHeight = '40px', reRandomOptionBtnContainer.innerHTML = '\n\t\t<input type="radio" name="randomOption" id="random-option--open" value="true">\n\t\t<label for="random-option--open">\u5f00\u542f</label>\n\t\t<input type="radio" name="randomOption" id="random-option--close" value="false">\n\t\t<label for="random-option--close">\u5173\u95ed</label>\n\t\t\x3c!-- <div style="text-indent: 2em;color:red;background:#f8f8f8;">\u8bf7\u6ce8\u610f\uff0c\u5f53\u60a8\u5f00\u542f\u672c\u811a\u672c\u7684\u968f\u673a\u9009\u9879\u65f6\uff0c\u60a8\u9700\u8981\u4f7f\u7528\u952e\u76d8\u9009\u62e9\u9009\u9879\uff0c\u4f7f\u7528\u9f20\u6807\u9009\u62e9\u9009\u9879\u4f1a\u51fa\u73b0\u9009\u9879\u6620\u5c04\u9519\u8bef\u5bfc\u81f4\u65e0\u6cd5\u83b7\u5f97\u6b63\u786e\u7b54\u6848\u3002</div> --\x3e\n\t',
		randomOptionLabel.append( reRandomOptionBtnContainer ), reRandomOptionBtnContainer.addEventListener( 'change', ( e => {
		localStorage.setItem( 'openRandomOption', e.target.value );
	} ) );
}, function () {
	const localURL = document.URL.split( '/' );
	if ( localURL[localURL.length - 2], -1 === [ 'online', 'simulation' ].indexOf( localURL[localURL.length - 2] ) ) {
		return console.info( '\u975e\u7b54\u9898\u754c\u9762\uff0c\u5df2\u9000\u51fa' ),
			function () {
				function reloadPage() {
					console.info( 'Reload Page.' ), location.reload();
				}
				
				window.addEventListener( 'hashchange', reloadPage );
				let _pushState = window.history.pushState;
				window.history.pushState = function () {
					return setTimeout( reloadPage, 1e3 ), _pushState.apply( this, arguments );
				};
			}(), 'stop';
	}
}, function () {
	if ( 'true' !== localStorage.getItem( 'openRandomOption' ) || !urlJudge( 'https://www.zaixiankaoshi.com/mnks/simulation/' ) ) {
		return;
	}
	console.info( 'Use Random Option.' );
	const optionContainer = document.querySelector( '.select-left' ),
		optionList = Array.from( optionContainer.querySelectorAll( '.option' ) );
	optionList.sort( ( () => Math.random() - .5 ) );
	const upperAlphaList = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ];
	for ( let i = 0; i < optionList.length; i++ ) {
		optionList[i].querySelector( '.before-icon' ).innerText = upperAlphaList[i];
	}
	optionList.forEach( ( option => {
		optionContainer.append( option );
	} ) );
}, function () {
	if ( !urlJudge( /https:\/\/www\.zaixiankaoshi\.com\/mnks\/\?paperid/ ) ) {
		return;
	}
	document.querySelector( 'div.clearfix.font-set span:nth-of-type(3)' ).click();
}, function () {
	const questionBox = document.querySelector( '.qusetion-box' );
	new OptionObserver( questionBox, ( () => {
		console.info( 'Change question' ), SubmitAnswerStatusChange.fresh();
	} ) );
}, function () {
	let optionList = document.querySelectorAll( '.options-w > .option' );
	try {
		new OptionObserver( document.querySelector( '.top-hd' ), ( () => {
			new OptionObserver( document.querySelector( '.options-w' ), ( () => {
				console.info( 'Fresh Options: ' ), optionList = document.querySelectorAll( '.options-w > .option' );
			} ) );
		} ) );
	}
	catch ( e ) {
	}
	OptionListStorage.set( optionList );
}, function () {
	const optionList = OptionListStorage.get();
	try {
		window.addEventListener( 'keydown', ( e => {
			var _a;
			const chosenOptionNumber = parseInt( e.key ) - 1;
			if ( chosenOptionNumber >= 0 && chosenOptionNumber < optionList.length ) {
				return console.info( 'Enter Option Chosen' ),
					void ( null == ( _a = optionList[chosenOptionNumber] ) || _a.click() );
			}
			const submitAnswer = document.querySelectorAll( '.topic [style="clear: both;"]' );
			if ( 2 === submitAnswer.length && !SubmitAnswerStatusChange.isSubmit && -1 !== [ 'Enter' ].indexOf( e.key ) ) {
				return SubmitAnswerStatusChange.submit(),
					void submitAnswer[0].querySelector( 'button' ).click();
			}
			if ( SubmitAnswerStatusChange.fresh(), -1 !== [ 'ArrowLeft' ].indexOf( e.key ) || -1 !== [ 'NumpadSubtract' ].indexOf( e.code ) ) {
				document.querySelector( '.next-preve > button:nth-of-type(1)' ).click();
			}
			else if ( -1 !== [ 'Enter', '+', 'ArrowRight' ].indexOf( e.key ) ) {
				const rightBtn = document.querySelector( '.next-preve > button:nth-of-type(2)' );
				if ( rightBtn.disabled && urlJudge( 'https://www.zaixiankaoshi.com/mnks/simulation/' ) ) {
					return void document.querySelector( '.submit-btn' ).click();
				}
				rightBtn.click();
			}
		} ) );
	}
	catch ( e ) {
		console.error( e );
		confirm( '\nKeyBoard binding got an error, should fresh this page to reload?\n\u6309\u952e\u7ed1\u5b9a\u5931\u8d25\u3002\u662f\u5426\u9700\u8981\u91cd\u65b0\u5237\u65b0\u9875\u9762\u91cd\u65b0\u8f7d\u5165\u811a\u672c\uff1f\n\t\t' ) && location.reload();
	}
} ];

functionChainCall.setList( fnList ), window.onload = () => {
	setTimeout( ( () => {
		functionChainCall.call();
	} ), 1e3 );
};
