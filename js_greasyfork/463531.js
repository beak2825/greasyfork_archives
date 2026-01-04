// ==UserScript==
// @name		绅士仓库历史记录可视化
// @name:en		CangkuHistoryRecord
// @description		绅士仓库历史记录可视化.
// @description:en		绅士仓库历史记录可视化.
// @author		Yiero
// @version		2.5.2
// @match		https://cangku.moe/*
// @icon		https://cangku.moe/favicon.ico
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts/
// @license		GPL
// @run-at		document-idle
// @grant		GM_addStyle
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addElement
// @grant		GM_registerMenuCommand
// @grant		GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/463531/%E7%BB%85%E5%A3%AB%E4%BB%93%E5%BA%93%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%8F%AF%E8%A7%86%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/463531/%E7%BB%85%E5%A3%AB%E4%BB%93%E5%BA%93%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%8F%AF%E8%A7%86%E5%8C%96.meta.js
// ==/UserScript==

const globalConfig = {
	// 已看帖子透明度
	opacity: 0.3,
	// 按钮显示 (true表示显示按钮, false表示关闭按钮)
	displayBtn: true,
	// 获取到元素之后的相应延时
	getElementDelayPerSecond: 0.5
};

var __defProp = Object.defineProperty;

var __defNormalProp = ( obj, key, value ) => key in obj ? __defProp( obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value: value
} ) : obj[key] = value;

var __publicField = ( obj, key, value ) => {
	__defNormalProp( obj, typeof key !== "symbol" ? key + "" : key, value );
	return value;
};

class GMStorage {
	constructor( key ) {
		__publicField( this, "key" );
		this.key = key;
	}
	
	set( value ) {
		dispatchEvent( new CustomEvent( "GMStorageUpdate", {
			detail: {
				newValue: value,
				oldValue: this.get(),
				target: this.key
			}
		} ) );
		GM_setValue( this.key, value );
	}
	
	get( defaultValue = null ) {
		return GM_getValue( this.key, defaultValue );
	}
	
	remove() {
		dispatchEvent( new CustomEvent( "GMStorageUpdate", {
			detail: {
				newValue: null,
				oldValue: this.get(),
				target: this.key
			}
		} ) );
		GM_deleteValue( this.key );
	}
}

const globalConfigStorage = function uploadConfig() {
	let config = {
		opacity: new GMStorage( "opacity" ),
		displayBtn: new GMStorage( "displayBtn" ),
		getElementDelayPerSecond: new GMStorage( "getElementDelayPerSecond" )
	};
	config.opacity.set( globalConfig.opacity );
	config.displayBtn.set( globalConfig.displayBtn );
	config.getElementDelayPerSecond.set( globalConfig.getElementDelayPerSecond );
	return config;
}();

const readStyle = {
	readBtnSign: {
		".is-read": {
			transition: "opacity .25s ease-in-out",
			opacity: globalConfigStorage.opacity.get()
		},
		".is-read:hover": {
			opacity: 1
		},
		".is-read, .is-not-read": {
			position: "relative"
		},
		".is-read::before": {
			content: '"已看"',
			"background-color": "hsla(0, 0%, 60%, .77)",
			"font-size": "13px",
			padding: "3px 8px",
			color: "#fff",
			"font-weight": 700,
			"border-radius": "4px",
			"z-index": 1,
			display: globalConfigStorage.displayBtn.get() ? "block" : "none"
		},
		".is-not-read::before": {
			content: '"未看"',
			"background-color": "rgba(3, 169, 244, .77)",
			"font-size": "13px",
			padding: "3px 8px",
			color: "#fff",
			"font-weight": 700,
			"border-radius": "4px",
			"z-index": 1,
			display: globalConfigStorage.displayBtn.get() ? "block" : "none"
		},
		[`.post-list .is-read::before, .post-list .is-not-read::before,\n\t\t\t.category-post .is-read::before, .category-post .is-not-read::before,\n\t\t\t.rank-post .is-read::before, .rank-post .is-not-read::before `]: {
			position: "absolute",
			top: "5px",
			left: "calc(15px + 5px)"
		},
		".related-post .is-read::before, .related-post .is-not-read::before": {
			position: "absolute",
			top: "5px",
			left: "calc(6px + 5px)"
		},
		".card-body .is-read::before, .card-body .is-not-read::before": {
			position: "absolute",
			top: "5px",
			right: "5px"
		}
	}
};

function transformedPrefSelectorList( prefSelectorList ) {
	return Object.entries( Object.values( prefSelectorList ).flat().reduce( ( ( result, current ) => ( {
		...result,
		...current
	} ) ) ) ).map( ( ( [ selector, rule ] ) => ( {
		selector: selector,
		rule: rule
	} ) ) );
}

function addReadStyle( cssRule2 ) {
	cssRule2.pushList( transformedPrefSelectorList( readStyle ) ).submit();
}

class Info {
	constructor( projectName ) {
		__publicField( this, "projectName" );
		__publicField( this, "header" );
		this.projectName = projectName;
		this.header = `[${ projectName }]`;
	}
	
	log( ...msg ) {
		( () => {} )( ...this.contentInfo( ...msg ) );
	}
	
	info( ...msg ) {
		console.info( ...this.contentInfo( ...msg ) );
	}
	
	warn( ...msg ) {
		console.warn( ...this.contentInfo( ...msg ) );
	}
	
	error( ...msg ) {
		console.error( ...this.contentInfo( ...msg ) );
	}
	
	contentInfo( ...msg ) {
		return [ this.header, ...msg ];
	}
}

class EntryBranch {
	constructor() {
		__publicField( this, "branchList", [] );
	}
	
	add( condition, callback ) {
		if ( typeof condition === "boolean" ) {
			this.branchList.push( [ () => condition, callback ] );
		}
		else {
			this.branchList.push( [ condition, callback ] );
		}
		return this;
	}
	
	default( callback ) {
		this.add( true, callback );
		return this;
	}
	
	run() {
		const entry = this.branchList.find( ( entry2 => entry2[0]() ) );
		if ( entry ) {
			new Info( "EntryBranch" ).log( "进入分支", entry );
			entry[1]();
		}
	}
}

function isMatchURL( ...regExpList ) {
	const matchResultList = [];
	regExpList.forEach( ( regExp => {
		if ( typeof regExp === "string" ) {
			regExp = new RegExp( regExp );
		}
		matchResultList.push( !!document.URL.match( regExp ) );
	} ) );
	return matchResultList.includes( true );
}

function freshListenerPushState( callback, s = 1 ) {
	let _pushState = window.history.pushState;
	window.history.pushState = function () {
		setTimeout( callback, s * 1e3 );
		return _pushState.apply( this, arguments );
	};
}

const getEl = document.querySelector.bind( document );

const getEls = document.querySelectorAll.bind( document );

function parsePost( postList, postCard ) {
	const domList = {
		postCard: postCard,
		link: postCard.querySelector( ".post-card a" ) || postCard.querySelector( ".sidebar-rank-post-wrap a" ) || postCard.querySelector( ".related-post-card a" )
	};
	if ( !domList.postCard.innerText ) {
		return;
	}
	postList.push( {
		target: postCard,
		achieveId: Number( domList.link.href.slice( domList.link.href.lastIndexOf( "/" ) + 1 ) )
	} );
}

function writeHistoryBtn( postList ) {
	for ( const post of postList ) {
		if ( post.isRead ) {
			print.log( post.achieveId, "is-read" );
			post.target.classList.remove( "is-not-read" );
			post.target.classList.add( "is-read" );
		}
		else {
			print.log( post.achieveId, "is-not-read" );
			post.target.classList.remove( "is-read" );
			post.target.classList.add( "is-not-read" );
		}
	}
}

function bindNotReadBtnEvent( postList ) {
	postList.forEach( ( post => {
		if ( !post.isRead ) {
			let bindPostClickEvent = function ( e ) {
				if ( e.button !== 2 ) {
					post.target.classList.remove( "is-not-read" );
					post.target.classList.add( "is-read" );
				}
				else {
					post.target.addEventListener( "mousedown", bindPostClickEvent, {
						once: true
					} );
				}
			};
			post.target.addEventListener( "mousedown", bindPostClickEvent, {
				once: true
			} );
		}
	} ) );
}

async function getReadHistory( postList ) {
	const postDataList = [];
	for ( const post of postList ) {
		postDataList.push( {
			...post,
			isRead: await readHistory.has( post.achieveId )
		} );
	}
	return postDataList;
}

async function parseMainPost() {
	const postList = [];
	const postCardList = getEls( "span.row .post" );
	postCardList == null ? void 0 : postCardList.forEach( ( post => {
		parsePost( postList, post );
	} ) );
	const postDataList = await getReadHistory( postList );
	writeHistoryBtn( postDataList );
	bindNotReadBtnEvent( postDataList );
}

async function parseAsidePost() {
	const postList = [];
	const postCardList = getEls( ".sidebar-rank-post-card li" );
	postCardList == null ? void 0 : postCardList.forEach( ( post => {
		parsePost( postList, post );
	} ) );
	const postDataList = await getReadHistory( postList );
	writeHistoryBtn( postDataList );
}

function getElement( parent = document.body, selector, timeoutPerSecond = 0, getElementDelayPerSecond = 0 ) {
	return new Promise( ( resolve => {
		let result = parent.querySelector( selector );
		if ( result ) {
			return resolve( result );
		}
		let timer;
		const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
		if ( mutationObserver ) {
			const observer = new mutationObserver( ( mutations => {
				for ( let mutation of mutations ) {
					for ( let addedNode of mutation.addedNodes ) {
						if ( addedNode instanceof Element ) {
							result = addedNode.matches( selector ) ? addedNode : addedNode.querySelector( selector );
							if ( result ) {
								observer.disconnect();
								timer && clearTimeout( timer );
								setTimeout( ( () => resolve( result ) ), getElementDelayPerSecond * 1e3 );
							}
						}
					}
				}
			} ) );
			observer.observe( parent, {
				childList: true,
				subtree: true
			} );
			if ( timeoutPerSecond > 0 ) {
				timer = setTimeout( ( () => {
					observer.disconnect();
					return resolve( null );
				} ), timeoutPerSecond * 1e3 );
			}
		}
	} ) );
}

async function HomePageEntry() {
	var _a;
	await getElement( document.body, ".post-card-wrap .cover", 20, globalConfig.getElementDelayPerSecond );
	await parseMainPost();
	await getElement( document.body, ".sidebar-rank-post-wrap .cover", 20, globalConfig.getElementDelayPerSecond );
	await parseAsidePost();
	( _a = getEl( ".nav-pills" ) ) == null ? void 0 : _a.addEventListener( "click", ( () => {
		setTimeout( ( () => {
			HomePageEntry();
		} ), 500 );
	} ), {
		once: true
	} );
}

function promisifyRequest( request ) {
	return new Promise( ( ( resolve, reject ) => {
		request.oncomplete = request.onsuccess = () => resolve( request.result );
		request.onabort = request.onerror = () => reject( request.error );
	} ) );
}

function createStore( dbName, storeName ) {
	const request = indexedDB.open( dbName );
	request.onupgradeneeded = () => request.result.createObjectStore( storeName );
	const dbp = promisifyRequest( request );
	return ( txMode, callback ) => dbp.then( ( db => callback( db.transaction( storeName, txMode ).objectStore( storeName ) ) ) );
}

let defaultGetStoreFunc;

function defaultGetStore() {
	if ( !defaultGetStoreFunc ) {
		defaultGetStoreFunc = createStore( "keyval-store", "keyval" );
	}
	return defaultGetStoreFunc;
}

function get( key, customStore = defaultGetStore() ) {
	return customStore( "readonly", ( store => promisifyRequest( store.get( key ) ) ) );
}

function setMany( entries, customStore = defaultGetStore() ) {
	return customStore( "readwrite", ( store => {
		entries.forEach( ( entry => store.put( entry[1], entry[0] ) ) );
		return promisifyRequest( store.transaction );
	} ) );
}

function eachCursor( store, callback ) {
	store.openCursor().onsuccess = function () {
		if ( !this.result ) return;
		callback( this.result );
		this.result.continue();
	};
	return promisifyRequest( store.transaction );
}

function values( customStore = defaultGetStore() ) {
	return customStore( "readonly", ( store => {
		if ( store.getAll ) {
			return promisifyRequest( store.getAll() );
		}
		const items = [];
		return eachCursor( store, ( cursor => items.push( cursor.value ) ) ).then( ( () => items ) );
	} ) );
}

class ReadHistory {
	constructor() {
		__publicField( this, "store" );
		this.store = createStore( "animax-post", "post-view-history" );
	}
	
	async has( key ) {
		return !!( await get( key, this.store ) );
	}
	
	getAll() {
		return values( this.store );
	}
	
	async setList( historyList ) {
		const entries = [];
		historyList.forEach( ( history => {
			entries.push( [ void 0, history ] );
		} ) );
		await setMany( entries, this.store );
	}
}

async function categoryPageEntry() {
	await getElement( document.body, ".post-card-wrap .cover", 20, globalConfig.getElementDelayPerSecond );
	await parseMainPost();
}

class CSSRule {
	constructor() {
		__publicField( this, "cssRuleSet", new Set );
		__publicField( this, "styleDom", document.createElement( "style" ) );
	}
	
	push( selector, rule ) {
		let ruleString = "";
		for ( let ruleKey in rule ) {
			const ruleValue = rule[ruleKey];
			ruleString += `${ ruleKey }:${ ruleValue };`;
		}
		this.cssRuleSet.add( `${ selector } {${ ruleString }}` );
		return this;
	}
	
	pushImportant( selector, rule ) {
		let ruleString = "";
		for ( let ruleKey in rule ) {
			let ruleValue = rule[ruleKey];
			if ( typeof ruleValue === "string" ) {
				ruleValue = ruleValue.replace( "!important", "" );
			}
			ruleString += `${ ruleKey }:${ ruleValue } !important;`;
		}
		this.cssRuleSet.add( `${ selector } {${ ruleString }}` );
		return this;
	}
	
	pushHide( selector ) {
		this.pushImportant( selector, {
			display: "none"
		} );
		return this;
	}
	
	pushHideList( selectorList ) {
		selectorList.forEach( ( selector => {
			this.pushImportant( selector, {
				display: "none"
			} );
		} ) );
		return this;
	}
	
	pushList( ruleList ) {
		ruleList.forEach( ( ( { selector: selector, rule: rule } ) => {
			this.push( selector, rule );
		} ) );
		return this;
	}
	
	pushImportantList( ruleList ) {
		ruleList.forEach( ( ( { selector: selector, rule: rule } ) => {
			this.pushImportant( selector, rule );
		} ) );
		return this;
	}
	
	submit() {
		this.removeAll();
		new Info( "AddStyle" ).log( Array.from( this.cssRuleSet ).join( " " ) );
		this.styleDom = GM_addStyle( Array.from( this.cssRuleSet ).join( " " ) );
	}
	
	removeAll() {
		if ( this.styleDom ) {
			this.styleDom.remove();
		}
		return this;
	}
}

async function rankPageEntry() {
	var _a;
	await getElement( document.body, ".post-card-content > .cover", 20, globalConfig.getElementDelayPerSecond );
	await parseMainPost();
	( _a = getEl( ".rank-wrapper" ) ) == null ? void 0 : _a.addEventListener( "click", ( () => {
		setTimeout( rankPageEntry, 500 );
	} ), {
		once: true
	} );
}

async function parseAchieveBottomPost() {
	const postList = [];
	const postCardList = getEls( ".related-post .related-post-card" );
	postCardList == null ? void 0 : postCardList.forEach( ( post => {
		parsePost( postList, post );
	} ) );
	const postDataList = await getReadHistory( postList );
	writeHistoryBtn( postDataList );
}

async function achievePageEntry() {
	var _a;
	await getElement( document.body, ".related-post-card .cover", 20, globalConfig.getElementDelayPerSecond );
	await parseAchieveBottomPost();
	await getElement( document.body, ".sidebar-rank-post-wrap .cover", 20, globalConfig.getElementDelayPerSecond );
	await parseAsidePost();
	( _a = getEl( ".nav-pills" ) ) == null ? void 0 : _a.addEventListener( "click", ( () => {
		setTimeout( ( () => {
			achievePageEntry();
		} ), 500 );
	} ), {
		once: true
	} );
}

async function historyBackup() {
	const historyList = await readHistory.getAll();
	const GMHistory = new GMStorage( "history" );
	const GMHistoryList = GMHistory.get( [] );
	print.info( "正在比较备份记录条目: ", `脚本储存条目(${ GMHistoryList.length })`, `仓库本地储存条目(${ historyList.length })` );
	if ( GMHistoryList.length > historyList.length ) {
		print.info( `历史记录丢失, 正在将备份写入历史记录: `, GMHistoryList );
		await readHistory.setList( GMHistoryList );
	}
	else if ( GMHistoryList.length < historyList.length ) {
		print.info( "正在备份历史记录到脚本储存中. " );
		GMHistory.set( [ ...new Set( [ ...GMHistoryList, ...historyList ] ) ] );
	}
}

async function pushNewReadAchieve() {
	const achieveId = document.URL.slice( document.URL.lastIndexOf( "/" ) + 1 );
	if ( await readHistory.has( Number( achieveId ) ) ) {
		localStorage.setItem( "history", achieveId );
	}
}

const downloadFile = ( blob, fileName ) => {
	const url = URL.createObjectURL( blob );
	const a = document.createElement( "a" );
	a.href = url;
	a.download = fileName;
	a.click();
	URL.revokeObjectURL( url );
	a.remove();
};

function importJson() {
	const importInput = GM_addElement( "input", {
		type: "file",
		accept: ".json"
	} );
	importInput.click();
	return new Promise( ( resolve => {
		importInput.addEventListener( "change", ( e => {
			const inputDom = e.target;
			if ( inputDom.files ) {
				const fileReader = new FileReader;
				fileReader.readAsText( inputDom.files[0] );
				fileReader.onload = () => {
					resolve( fileReader.result || "" );
				};
			}
		} ) );
	} ) );
}

class SaveBtn {
	constructor() {
		__publicField( this, "domList", {
			ulList: getEl( ".menu-group-list" )
		} );
	}
	
	download() {
		var _a;
		const downloadBtn = GM_addElement( this.domList.ulList, "li", {
			class: "menu-list-item"
		} );
		downloadBtn.innerHTML = `\n\t\t\t<a class="router-link-exact-active download-btn" href="javascript:;">保存历史记录</a>\n\t\t`;
		( _a = downloadBtn.querySelector( ".download-btn" ) ) == null ? void 0 : _a.addEventListener( "click", ( async () => {
			downloadFile( new Blob( [ JSON.stringify( await readHistory.getAll() ) ], {
				type: "application/json"
			} ), "ReadHistoryBackUp.json" );
		} ) );
	}
	
	import() {
		var _a;
		const downloadBtn = GM_addElement( this.domList.ulList, "li", {
			class: "menu-list-item"
		} );
		downloadBtn.innerHTML = `\n\t\t\t<a class="router-link-exact-active import-btn" href="javascript:;">导入历史记录</a>\n\t\t`;
		( _a = downloadBtn.querySelector( ".import-btn" ) ) == null ? void 0 : _a.addEventListener( "click", ( async () => {
			const historyJsonString = await importJson();
			const historyArray = JSON.parse( historyJsonString );
			if ( Array.isArray( historyArray ) ) {
				const isRightHistoryArray = !historyArray.find( ( ( { id: id, date: date } ) => !( id && date ) ) );
				if ( isRightHistoryArray ) {
					await readHistory.setList( historyArray );
					alert( "导入历史记录成功. " );
					return;
				}
			}
			else {
				alert( "导入Json文件为错误的历史记录文件. " );
			}
		} ) );
	}
}

async function addFreshBtn( entryBranch ) {
	var _a;
	await getElement( document.body, ".navbar-nav", 0, .5 );
	const freshBtn = GM_addElement( getEl( ".navbar-nav" ), "li", {
		class: "nav-item"
	} );
	const dataHash = getEl( ".navbar-nav > .nav-item" ).getAttributeNames().find( ( attribute => attribute.startsWith( "data-v" ) ) );
	freshBtn.innerHTML = `\n\t\t<a class="text-truncate fresh-btn" ${ dataHash } href="javascript:;">刷新</a>\n\t`;
	( _a = freshBtn.querySelector( ".fresh-btn" ) ) == null ? void 0 : _a.addEventListener( "click", ( () => {
		entryBranch.run();
	} ) );
}

const print = new Info( "postCardList" );

const cssRule = new CSSRule;

const readHistory = new ReadHistory;

( async () => {
	addReadStyle( cssRule );
	await historyBackup();
	const entryBranch = new EntryBranch;
	entryBranch.add( ( () => isMatchURL( "^https://cangku.moe/$" ) ), HomePageEntry ).add( ( () => isMatchURL( "^https://cangku.moe/\\?page" ) ), ( async () => {
		await HomePageEntry();
		cssRule.pushHide( ".global-announce" ).submit();
	} ) ).add( ( () => isMatchURL( /https:\/\/cangku.moe\/archives\/\d+/ ) ), ( async () => {
		await achievePageEntry();
		await pushNewReadAchieve();
	} ) ).add( ( () => isMatchURL( /https:\/\/cangku.moe\/category\/\d+/ ) ), categoryPageEntry ).add( ( () => isMatchURL( "https://cangku.moe/rank" ) ), rankPageEntry ).add( ( () => isMatchURL( "https://cangku.moe/account/" ) ), ( async () => {
		await getElement( document.body, ".menu-group-list", 0, .5 );
		const saveBtn = new SaveBtn;
		saveBtn.download();
		saveBtn.import();
	} ) ).run();
	freshListenerPushState( ( () => {
		entryBranch.run();
	} ) );
	await addFreshBtn( entryBranch );
} )();
