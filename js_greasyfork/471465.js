// ==UserScript==
// @name		BiliBili动态隐藏
// @author		Yiero
// @description		根据Up主名称，在动态页进行筛选，隐藏屏蔽的Up主动态。
// @version		1.4.5
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts
// @match		https://t.bilibili.com/*
// @icon		https://t.bilibili.com/favicon.ico
// @resource		layuiCss https://cdn.staticfile.org/layui/2.8.11/css/layui.min.css
// @license		GPL
// @grant		GM_registerMenuCommand
// @grant		GM_unregisterMenuCommand
// @grant		GM_addStyle
// @grant		GM_getResourceText
// @run-at		document-start
// @updateUrl		https://raw.githubusercontent.com/AliubYiero/TamperMonkeyScripts/master/dist/HideDynamic.js
// @downloadUrl		https://raw.githubusercontent.com/AliubYiero/TamperMonkeyScripts/master/dist/HideDynamic.js
// @downloadURL https://update.greasyfork.org/scripts/471465/BiliBili%E5%8A%A8%E6%80%81%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/471465/BiliBili%E5%8A%A8%E6%80%81%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==
GM_addStyle( GM_getResourceText( 'layuiCss' ) )

var __defProp = Object.defineProperty;
var __defNormalProp = ( obj, key, value ) => key in obj ? __defProp( obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
} ) : obj[key] = value;
var __publicField = ( obj, key, value ) => {
	__defNormalProp( obj, typeof key !== "symbol" ? key + "" : key, value );
	return value;
};

function getElement( parent, selector, timeout = 0 ) {
	return new Promise( ( resolve ) => {
		let result = parent.querySelector( selector );
		if ( result ) {
			return resolve( result );
		}
		let timer;
		const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
		if ( mutationObserver ) {
			const observer = new mutationObserver( ( mutations ) => {
				for ( let mutation of mutations ) {
					for ( let addedNode of mutation.addedNodes ) {
						if ( addedNode instanceof Element ) {
							result = addedNode.matches( selector ) ? addedNode : addedNode.querySelector( selector );
							if ( result ) {
								observer.disconnect();
								timer && clearTimeout( timer );
								return resolve( result );
							}
						}
					}
				}
			} );
			observer.observe( parent, {
				childList: true,
				subtree: true
			} );
			if ( timeout > 0 ) {
				timer = setTimeout( () => {
					observer.disconnect();
					return resolve( null );
				}, timeout );
			}
		}
		else {
			const listener = ( e ) => {
				if ( e.target instanceof Element ) {
					result = e.target.matches( selector ) ? e.target : e.target.querySelector( selector );
					if ( result ) {
						parent.removeEventListener( "DOMNodeInserted", listener, true );
						timer && clearTimeout( timer );
						return resolve( result );
					}
				}
			};
			parent.addEventListener( "DOMNodeInserted", listener, true );
			if ( timeout > 0 ) {
				timer = setTimeout( () => {
					parent.removeEventListener( "DOMNodeInserted", listener, true );
					return resolve( null );
				}, timeout );
			}
		}
	} );
}

const registerMenu = ( title, callback ) => {
	GM_registerMenuCommand( title, function () {
		callback();
	} );
};
const createElement = ( elementConfig ) => {
	const { tagName, className, id, innerHTML, innerText } = elementConfig;
	const element = document.createElement( tagName );
	if ( className && typeof className === "string" ) {
		element.classList.add( className );
	}
	else if ( className && Array.isArray( className ) ) {
		element.classList.add( ...className );
	}
	if ( id ) {
		element.id = id;
	}
	if ( innerHTML ) {
		element.innerHTML = innerHTML;
	}
	if ( innerText ) {
		element.innerText = innerText;
	}
	for ( let elementConfigKey in elementConfig ) {
		if ( [ "tagName", "className", "id", "innerHTML", "innerText" ].indexOf( elementConfigKey ) !== -1 ) {
			continue;
		}
		element.setAttribute( elementConfigKey, elementConfig[elementConfigKey] );
	}
	return element;
};
const addElementToDocument = ( element, cssString, fatherElement = document.body ) => {
	fatherElement.append( element );
	GM_addStyle( cssString );
};
const addStyle = ( cssString ) => {
	GM_addStyle( cssString );
};

class Info {
	constructor( projectName ) {
		// @ts-ignore
		__publicField( this, "projectName" );
		__publicField( this, "header" );
		this.projectName = projectName;
		this.header = `[${ projectName }]`;
	}
	
	log( ...msg ) {
		/* @__PURE__ */
		( () => {
		} )( ...this.contentInfo( ...msg ) );
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

function importLayui() {
	let script = document.createElement( "script" );
	script.type = "text/javascript";
	script.src = "https://cdn.staticfile.org/layui/2.8.11/layui.min.js";
	document.head.appendChild( script );
}

class Sleep {
	/** 延时睡眠等待 */
	static time( delay = 1 ) {
		return new Promise( ( resolve ) => {
			setTimeout( resolve, delay * 1e3 );
		} );
	}
	
	/** 页面加载等待 */
	static windowLoad( delay = 0 ) {
		return new Promise( ( resolve ) => {
			window.addEventListener( "load", () => {
				setTimeout( resolve, delay * 1e3 );
			} );
		} );
	}
}

class Data {
	/** @param {array} newData */
	constructor( newData ) {
		/** @type {Map<string, {id: string, isBandLive: boolean, isBandDynamic: boolean, isBandVideo: boolean}>} */
		__publicField( this, "data" );
		__publicField( this, "originData" );
		if ( newData ) {
			this.setToLocalStorage( this.arrayToMap( newData ) );
		}
		this.getFromLocalStorage();
	}
	
	/** 防止多余数据提交到data中，进行重新赋值 */
	limitValue( obj ) {
		const { id, isBandLive, isBandDynamic, isBandVideo } = obj;
		return {
			id,
			isBandLive: isBandLive || false,
			isBandDynamic: isBandDynamic || false,
			isBandVideo: isBandVideo || false
		};
	}
	
	/** 添加一个对象 */
	set( newObj ) {
		if ( this.data.has( newObj.id ) ) {
			return;
		}
		const limitData = this.limitValue( newObj );
		this.data.set( newObj.id, limitData );
		this.setToLocalStorage();
		return limitData;
	}
	
	/** 更新其中一个对象 */
	update( newObj ) {
		const limitData = this.limitValue( newObj );
		this.data.set( newObj.id, limitData );
		this.setToLocalStorage();
	}
	
	/** 删除其中一个对象 */
	delete( newObjOrId ) {
		if ( typeof newObjOrId === "string" ) {
			this.data.delete( newObjOrId );
		}
		else {
			this.data.delete( newObjOrId.id );
		}
		this.setToLocalStorage();
	}
	
	/** 改变其中一个对象的键（删除原对象，建立新对象） */
	change( newObj, oldObjOrId ) {
		this.delete( oldObjOrId );
		this.set( this.limitValue( newObj ) );
		this.setToLocalStorage();
	}
	
	/** 从localStorage中获取data */
	getFromLocalStorage() {
		this.originData = JSON.parse( localStorage.getItem( "bandList" ) || "[]" );
		this.data = this.arrayToMap( this.originData );
	}
	
	/** 将data设置到localStorage中 */
	setToLocalStorage( value = this.data ) {
		localStorage.setItem( "bandList", JSON.stringify( this.mapToArray( value ) ) );
	}
	
	/**
	 * 数组转Map
	 * @param {{id: string, [propName: string]: any}[]} array
	 * @return {Map}
	 * */
	arrayToMap( array ) {
		const map = /* @__PURE__ */ new Map();
		array.forEach( ( value ) => {
			value.id = value.id.trim();
			map.set( value.id, value );
		} );
		return map;
	}
	
	/**
	 * Map转数组
	 * @param {Map} map
	 * @return {any[]}
	 * */
	mapToArray( map ) {
		const array = [];
		for ( let value of map.values() ) {
			array.push( value );
		}
		return array;
	}
}

class UiEvent {
	constructor( data ) {
		__publicField( this, "data" );
		__publicField( this, "treeTable" );
		__publicField( this, "domList" );
		this.data = data;
		this.treeTable = layui.treeTable;
		this.domList = {
			main: void 0
		};
		this.getMainDom();
	}
	
	/** 添加数据 */
	add( res ) {
		const addData = ( res2 ) => {
			res2 = res2.trim();
			if ( !res2 ) {
				return;
			}
			const newData = this.data.set( { id: res2 } );
			if ( !newData ) {
				return;
			}
			this.treeTable.addNodes( "table-bili-band-config", {
				index: 0,
				data: newData
			} );
			this.treeTable.reloadData( "table-bili-band-config" );
		};
		if ( res ) {
			addData( res );
			return;
		}
		layer.prompt( { title: "输入要屏蔽Up主名" }, ( res2, index ) => {
			layer.close( index );
			addData( res2 );
		} );
	}
	
	/**
	 * 删除当前行数据
	 * @param {Object} e layui数据对象
	 * */
	delete( e ) {
		this.data.delete( e.data );
		e.del();
		this.treeTable.reloadData( "table-bili-band-config" );
	}
	
	/** 更新当前行的数据
	 * @param {Object} originData
	 * @param {'dynamic' | 'video' | 'live'} type
	 * @param {number} index
	 * */
	update( originData, type, index ) {
		let newData = { ...originData };
		switch ( type ) {
			case "dynamic":
				newData.isBandDynamic = !originData.isBandDynamic;
				break;
			case "video":
				newData.isBandVideo = !originData.isBandVideo;
				break;
			case "live":
				newData.isBandLive = !originData.isBandLive;
				break;
		}
		this.treeTable.updateNode( "table-bili-band-config", index, newData );
		this.data.update( newData );
	}
	
	/** 改变Up主名称（因为需要改变键值，所以不能直接更新） */
	change( e ) {
		this.data.change( e.data, e.oldValue );
		this.treeTable.reloadData( "table-bili-band-config" );
	}
	
	/** 展示UI界面 */
	show() {
		if ( !this.domList.main ) {
			this.getMainDom();
		}
		const mainContainer = this.domList.main;
		if ( mainContainer.style.display === "none" ) {
			mainContainer.style.display = "block";
		}
		mainContainer.classList.remove( "layui-anim-fadeout", "hide" );
		mainContainer.classList.add( "layui-anim-fadein" );
	}
	
	/** 隐藏UI界面 */
	hide() {
		if ( !this.domList.main ) {
			this.getMainDom();
		}
		const mainContainer = this.domList.main;
		mainContainer.classList.remove( "layui-anim-fadein" );
		mainContainer.classList.add( "layui-anim-fadeout", "hide" );
	}
	
	getMainDom() {
		this.domList.main = document.querySelector( ".bili-band-config-container" );
	}
	
	submitSearch( input ) {
		const { value } = input;
		if ( !value.trim() ) {
			return false;
		}
		input.value = "";
		const newData = [];
		let isMatchValue = false;
		this.data.mapToArray( this.data.data ).forEach( ( bandData ) => {
			if ( bandData.id.match( value ) ) {
				isMatchValue = true;
				newData.unshift( bandData );
			}
			else {
				newData.push( bandData );
			}
		} );
		if ( !isMatchValue ) {
			layer.confirm( `没有搜索到UP主 [${ value }] ，是否新建UP主
(2s后自动关闭窗口)`, {
				time: 2e3,
				btn: [ "确认", "取消" ]
			}, ( index ) => {
				layer.close( index );
				this.add( value );
			} );
			return false;
		}
		this.treeTable.reloadData( "table-bili-band-config", {
			data: newData,
			page: {
				// 将当前页面设置到第一页，避免看不到搜索结果
				curr: 1
			}
		} );
	}
}

class ConfigUI {
	constructor() {
		// @ts-ignore
		__publicField( this, "data" );
		// @ts-ignore
		__publicField( this, "uiEvent" );
		importLayui();
		Sleep.windowLoad().then(
			() => {
				this.data = new Data();
				this.uiEvent = new UiEvent( this.data );
				this.createContainer();
				this.createElementEvent();
				this.show = () => {
					this.uiEvent.show();
				};
				this.hide = () => {
					this.uiEvent.hide();
				};
			}
		);
	}
	
	/** 创建UI界面框架 */
	createContainer() {
		const container = createElement( {
			tagName: "main",
			className: [ "bili-band-config-container", "layui-anim", "hide" ],
			innerHTML: `<table class="layui-anim-fadeout" id="ID-table-bili-band-config" lay-filter="show"></table>`
		} );
		addElementToDocument( container, `.bili-band-config-container {position: fixed; top: 0; left:calc(50% - 355px);background: #ffffff; z-index: 10003; width: 710px;}`, document.body );
	}
	
	/**
	 * 创建UI内容，创建UI事件
	 * */
	createElementEvent() {
		layui.use( "table", () => {
			const { treeTable, form } = layui;
			treeTable.render( {
				elem: "#ID-table-bili-band-config",
				id: "table-bili-band-config",
				cols: [ [
					{
						field: "index",
						title: "编号",
						type: "numbers",
						width: 60
					},
					{
						field: "id",
						title: "UP主",
						width: 200,
						sort: true,
						align: "center",
						edit: true
					},
					{
						field: "dynamic",
						title: "动态卡片",
						width: 110,
						sort: true,
						align: "center",
						templet: ( d ) => `<input type="checkbox" lay-skin="switch" lay-filter="toggleDynamicStatus" ${ d.isBandDynamic ? "checked" : "" }/>`
					},
					{
						field: "video",
						title: "视频卡片",
						width: 110,
						sort: true,
						align: "center",
						templet: ( d ) => `<input type="checkbox" lay-skin="switch" lay-filter="toggleVideoStatus" ${ d.isBandVideo ? "checked" : "" }/>`
					},
					{
						field: "live",
						title: "直播卡片",
						width: 110,
						sort: true,
						align: "center",
						templet: ( d ) => `<input type="checkbox" lay-skin="switch" lay-filter="toggleLiveStatus" ${ d.isBandLive ? "checked" : "" }/>`
					},
					{
						field: "delete",
						title: "操作",
						width: 110,
						sort: false,
						align: "center",
						fixed: "right",
						templet: () => `<button type="button" class="layui-btn layui-btn-sm layui-btn-danger layui-btn-radius" lay-event="delete">Delete</button>`
					}
				] ],
				data: this.data.originData,
				size: "lg",
				skin: "line",
				page: {
					layout: [ "prev", "page", "next", "count", "skip" ]
				},
				// 底部工具栏
				pagebar: `
					<div>
						<button type="button" class="layui-btn layui-btn-sm" lay-event="add"> Add </button>
						<button type="button" class="layui-btn layui-btn-sm" lay-event="addFromClipboard"> ReadClipboard </button>
						<button type="button" class="layui-btn layui-btn-sm layui-btn-warm" lay-event="close"> Close </button>
					</div>
				`,
				// 顶部工具栏
				toolbar: `
					<div>
						<form class="form-search" style="display: flex;">
							<input type="text" class="layui-input" style="width: 200px;" placeholder="输入需要搜索的UP主"/>
							<button type="button" lay-submit lay-filter="table-search" class="layui-btn" style="margin-left: 20px;">Search</button>
							<button type="button" lay-submit lay-filter="table-clear" class="layui-btn" style="margin-left: 20px;">Clear</button>
						</form>
					</div>
				`,
				width: 710,
				// 不开启顶部右侧默认工具栏
				defaultToolbar: ""
			} );
			treeTable.on( "tool(show)", ( e ) => {
				this.uiEvent.delete( e );
			} );
			treeTable.on( "edit(show)", ( e ) => {
				this.uiEvent.change( e );
			} );
			
			class Checkbox {
				constructor( input ) {
					__publicField( this, "input" );
					__publicField( this, "domList" );
					this.input = input;
					this.domList = {
						input: this.input,
						tr: this.getTrDom()
					};
				}
				
				getTrDom() {
					var _a, _b, _c;
					return ( _c = ( _b = ( _a = this.input ) == null ? void 0 : _a.parentElement ) == null ? void 0 : _b.parentElement ) == null ? void 0 : _c.parentElement;
				}
				
				getTableDataIndex() {
					return parseInt( this.domList.tr.dataset.index );
				}
				
				getTableData( index ) {
					index || ( index = this.getTableDataIndex() );
					return treeTable.getNodeDataByIndex( "table-bili-band-config", index );
				}
			}
			
			form.on( "switch(toggleDynamicStatus)", ( e ) => {
				const input = new Checkbox( e.elem );
				const index = input.getTableDataIndex();
				const data = input.getTableData( index );
				this.uiEvent.update( data, "dynamic", index );
			} );
			form.on( "switch(toggleVideoStatus)", ( e ) => {
				const input = new Checkbox( e.elem );
				const index = input.getTableDataIndex();
				const data = input.getTableData( index );
				this.uiEvent.update( data, "video", index );
			} );
			form.on( "switch(toggleLiveStatus)", ( e ) => {
				const input = new Checkbox( e.elem );
				const index = input.getTableDataIndex();
				const data = input.getTableData( index );
				this.uiEvent.update( data, "live", index );
			} );
			treeTable.on( "pagebar(show)", ( e ) => {
				const { event } = e;
				if ( ![ "add", "close", "addFromClipboard" ].includes( event ) ) {
					return;
				}
				if ( event === "add" ) {
					this.uiEvent.add();
					return;
				}
				if ( event === "addFromClipboard" ) {
					navigator.clipboard.readText().then(
						( res ) => {
							this.uiEvent.add( res );
						},
						( err ) => {
							layer.msg( err );
						}
					);
					return;
				}
				if ( event === "close" ) {
					this.uiEvent.hide();
					return;
				}
			} );
			form.on( "submit(table-search)", ( res ) => {
				const input = res.form.querySelector( "input" );
				this.uiEvent.submitSearch( input );
				return false;
			} );
			form.on( "submit(table-clear)", ( res ) => {
				res.form.querySelector( "input" ).value = "";
				return false;
			} );
			const domList = {
				form: document.querySelector( ".form-search" ),
				input: document.querySelector( ".form-search > input" )
			};
			domList.form.addEventListener( "submit", ( e ) => {
				e.preventDefault();
				this.uiEvent.submitSearch( domList.input );
			} );
		} );
	}
	
	// 向外暴露出show事件
	// 初始化声明show函数，具体内容会在构造函数定义
	show() {
	}
	
	// 向外暴露出hide事件
	// 初始化声明hide函数，具体内容会在构造函数定义
	hide() {
	}
}

( async () => {
	const print = new Info( "BiliBiliHideDynamic" );
	addStyle( `.hide {display: none !important}` );
	print.info( "引入UI" );
	const configUI = new ConfigUI();
	await Sleep.windowLoad();
	
	class Observer {
		constructor() {
		}
		
		async observe( observerSelectorList, callback ) {
			await getElement( document.body, observerSelectorList.waitLoadElementSelector );
			const observer2 = new MutationObserver( ( e ) => {
				e.forEach( ( record ) => {
					var _a;
					const item = record.addedNodes[0];
					if ( !item || !( ( _a = item == null ? void 0 : item.classList ) == null ? void 0 : _a.contains( observerSelectorList.filterToken || "" ) ) ) {
						return;
					}
					callback( item );
				} );
			} );
			/* @__PURE__ */
			( () => {
			} )( observerSelectorList.observeElementSelector );
			observer2.observe( document.querySelector( observerSelectorList.observeElementSelector ), {
				childList: true
			} );
		}
	}
	
	class BandEvent {
		constructor( bandList ) {
			__publicField( this, "bandList" );
			__publicField( this, "bandTypeList", [ "dynamic", "video" ] );
			this.bandList = bandList;
		}
		
		/** 判断当前动态的Up主是否在屏蔽列表中，如果是则隐藏 */
		band( item, upNameSelector, bandType ) {
			var _a;
			const upName = ( _a = item.querySelector( upNameSelector ) ) == null ? void 0 : _a.innerText.trim();
			let bandTypeKey;
			bandTypeKey = {
				dynamic: "isBandDynamic",
				video: "isBandVideo",
				live: "isBandLive"
			};
			if ( this.bandList.has( upName ) && this.bandList.get( upName )[bandTypeKey[bandType]] ) {
				item.classList.add( "hide" );
			}
			else {
				item.classList.remove( "hide" );
			}
		}
		
		/**
		 * 获取当前所处的动态卡片编号，并根据动态卡片编号，返回不同的BandType
		 * */
		judgeBandType( tabsItemListSelector ) {
			let tabsItemIndex = 0;
			const tabsItemList = document.querySelectorAll( tabsItemListSelector );
			for ( let i = 0; i < tabsItemList.length; i++ ) {
				const tabsItem = tabsItemList[i];
				if ( tabsItem.classList.contains( "active" ) ) {
					tabsItemIndex = i;
					break;
				}
			}
			return this.bandTypeList[tabsItemIndex];
		}
		
		/** 刷新页面数据 */
		fresh( observerSelectorList, bandType ) {
			const { aimElementSelector, upNameSelector } = observerSelectorList;
			const upNameNodeList = document.querySelectorAll( aimElementSelector );
			upNameNodeList.forEach( ( aimElement ) => {
				this.band( aimElement, upNameSelector, bandType );
			} );
		}
		
		// 刷新动态卡片 / 视频卡片数据
		freshDynamic( dynamicSelectorList ) {
			const bandType = this.judgeBandType( dynamicSelectorList.tabsItemListSelector );
			bandEvent.fresh( dynamicSelectorList, bandType );
		}
		
		// 刷新直播数据
		freshLive( liveSelectorList ) {
			bandEvent.fresh( liveSelectorList, "live" );
		}
	}
	
	let domSelector = {
		dynamic: {
			waitLoadElementSelector: ".bili-dyn-list",
			observeElementSelector: ".bili-dyn-list__items",
			upNameSelector: ".bili-dyn-title__text",
			tabsItemListSelector: ".bili-dyn-list-tabs__item",
			filterToken: "bili-dyn-list__item",
			aimElementSelector: ".bili-dyn-list__item"
		},
		// Bilibili-Evolved直播侧边栏
		live: {
			waitLoadElementSelector: ".be-live-list-content",
			observeElementSelector: ".be-live-list-content",
			upNameSelector: ".be-live-list-item-user",
			filterToken: "be-live-list-item",
			aimElementSelector: ".be-live-list-item"
		},
		// 旧版直播侧边栏
		oldLive: {
			waitLoadElementSelector: ".bili-dyn-live-users__body",
			observeElementSelector: ".bili-dyn-live-users__body",
			upNameSelector: ".bili-dyn-live-users__item__uname",
			filterToken: "bili-dyn-live-users__item",
			aimElementSelector: ".bili-dyn-live-users__item"
		},
		// 新版直播侧边栏
		newLive: {
			waitLoadElementSelector: ".bili-dyn-live-users__body",
			observeElementSelector: ".bili-dyn-live-users__body",
			upNameSelector: ".bili-dyn-live-users__item__uname",
			filterToken: "bili-dyn-live-users__container",
			aimElementSelector: ".bili-dyn-live-users__container"
		}
	};
	( function judgeBiliUiVersion() {
		if ( document.querySelector( "#bili-header-container" ) && document.querySelector( ".bili-header.fixed-header" ) ) {
			domSelector.live = domSelector.newLive;
		}
		else if ( document.querySelector( "#bili-header-container" ) ) {
			;
		}
		else {
			domSelector.live = domSelector.oldLive;
		}
	} )();
	const observer = new Observer();
	const bandEvent = new BandEvent( configUI.data.data );
	await observer.observe( domSelector.dynamic, ( item ) => {
		const bandType = bandEvent.judgeBandType( domSelector.dynamic.tabsItemListSelector );
		bandEvent.band( item, domSelector.dynamic.upNameSelector, bandType );
	} );
	bandEvent.freshDynamic( domSelector.dynamic );
	await observer.observe( domSelector.live, ( item ) => {
		bandEvent.band( item, domSelector.live.upNameSelector, "live" );
	} );
	bandEvent.freshLive( domSelector.live );
	registerMenu( "添加屏蔽", () => {
		configUI.show();
	} );
	
	class DragEvent {
		constructor() {
			// Dom集合
			__publicField( this, "domList" );
			// 坐标集合
			__publicField( this, "position" );
			this.domList = {
				main: document.querySelector( ".bili-band-config-container" )
			};
			this.domList.tool = this.domList.main.querySelector( ".layui-table-tool" );
			this.position = {
				start: { x: 0, y: 0 },
				end: { x: 0, y: 0 },
				relative: { x: 0, y: 0 }
			};
			this.bindDragEvent( this.domList.tool );
		}
		
		/** 绑定拖拽事件 */
		bindDragEvent( willDraggableElement ) {
			willDraggableElement.draggable = true;
			willDraggableElement.addEventListener( "dragstart", ( e ) => {
				this.getStartPosition( e );
			} );
			willDraggableElement.addEventListener( "dragend", ( e ) => {
				e.preventDefault();
				this.getEndPosition( e );
				this.getRelativePosition();
				this.changeDomPosition();
			} );
		}
		
		/** 获取开始坐标 */
		getStartPosition( e ) {
			const { pageX, pageY } = e;
			this.position.start = {
				x: pageX,
				y: pageY
			};
		}
		
		/** 获取结束坐标 */
		getEndPosition( e ) {
			const { pageX, pageY } = e;
			this.position.end = {
				x: pageX,
				y: pageY
			};
		}
		
		/** 获取相对坐标 */
		getRelativePosition() {
			this.position.relative = {
				x: this.position.relative.x + this.position.end.x - this.position.start.x,
				y: this.position.relative.y + this.position.end.y - this.position.start.y
			};
		}
		
		/** 改变main容器的坐标位置 */
		changeDomPosition() {
			this.domList.main.style.transform = `translate(${ this.position.relative.x }px, ${ this.position.relative.y }px)`;
		}
	}
	
	( () => {
		const domList = {
			closeBtn: document.querySelector( "[lay-event=close]" )
		};
		domList.closeBtn.addEventListener( "click", () => {
			bandEvent.freshDynamic( domSelector.dynamic );
			bandEvent.freshLive( domSelector.live );
		} );
		new DragEvent();
	} )();
} )();
