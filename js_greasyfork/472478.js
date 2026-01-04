// ==UserScript==
// @name		kuaishouLiveAutoSendDanmuku
// @author		Yiero
// @description		快手直播自动发送内容
// @version		1.1.1
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts
// @match		https://live.kuaishou.com/*
// @icon		https://live.kuaishou.com/favicon.ico
// @license		GPL
// @grant		GM_addStyle
// @grant		GM_registerMenuCommand
// @grant		GM_unregisterMenuCommand
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_listValues
// @updateUrl		https://raw.githubusercontent.com/AliubYiero/TamperMonkeyScripts/master/dist/kuaishouLiveAutoSendDanmuku.js
// @downloadUrl		https://raw.githubusercontent.com/AliubYiero/TamperMonkeyScripts/master/dist/kuaishouLiveAutoSendDanmuku.js
// @downloadURL https://update.greasyfork.org/scripts/472478/kuaishouLiveAutoSendDanmuku.user.js
// @updateURL https://update.greasyfork.org/scripts/472478/kuaishouLiveAutoSendDanmuku.meta.js
// ==/UserScript==

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
const registerMenu = ( title, callback ) => {
	return GM_registerMenuCommand( title, function () {
		callback();
	} );
};
const unregisterMenu = ( menuId ) => {
	GM_unregisterMenuCommand( menuId );
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
const tupleToObject = ( keyArray, valueArray ) => {
	return keyArray.reduce( ( obj, key, index ) => {
		obj[key] = valueArray[index];
		return obj;
	}, {} );
};

class GMStorage {
	constructor( key ) {
		__publicField( this, "key" );
		this.key = key;
	}
	
	/** 设置/更新键 */
	static set( key, value ) {
		GM_setValue( key, value );
	}
	
	/** 获取值 */
	static get( key, defaultValue = null ) {
		return GM_getValue( key, defaultValue );
	}
	
	/** 移除键 */
	static remove( key ) {
		GM_deleteValue( key );
	}
	
	/** 设置/更新键 */
	set( value ) {
		GM_setValue( this.key, value );
	}
	
	/** 批量设置/更新键 */
	setList( keyValueObject ) {
		for ( let key in keyValueObject ) {
			const value = keyValueObject[key];
			GMStorage.set( key, value );
		}
	}
	
	/** 获取值 */
	get( defaultValue = null ) {
		return GM_getValue( this.key, defaultValue );
	}
	
	/** 批量获取值 */
	getList( keys, defaultValue = null ) {
		const values = [];
		keys.forEach( ( key ) => {
			values.push( GMStorage.get( key, defaultValue ) );
		} );
		return values;
	}
	
	/** 移除键 */
	remove() {
		GM_deleteValue( this.key );
	}
	
	/**
	 * 返回所有键
	 * */
	keys() {
		return GM_listValues();
	}
	
	/** 返回所有值 */
	values() {
		const values = [];
		const keys = this.keys();
		keys.forEach( ( key ) => {
			values.push( GMStorage.get( key ) );
		} );
		return values;
	}
	
	/** 返回所有键值对对象 */
	getAll() {
		const keys = this.keys();
		const values = this.values();
		return tupleToObject( keys, values );
	}
	
	/** 清除所有储存 */
	clear() {
		const keys = this.keys();
		keys.forEach( ( key ) => {
			GMStorage.remove( key );
		} );
	}
}

var SendWay = /* @__PURE__ */ ( ( SendWay2 ) => {
	SendWay2[SendWay2["loop"] = 0] = "loop";
	SendWay2[SendWay2["random"] = 1] = "random";
	return SendWay2;
} )( SendWay || {} );

class Config {
	get openRandomCodeStorage() {
		return new GMStorage( "openRandomCode" + this.spaceId );
	}
	
	get openFreshAutoSendStorage() {
		return new GMStorage( "sendWay" + this.spaceId );
	}
	
	get contentListStorage() {
		return new GMStorage( "freshPageDelayPerSecond" + this.spaceId );
	}
	
	get freshPageDelayStorage() {
		return new GMStorage( "contentList" + this.spaceId );
	}
	
	get sendWayStorage() {
		return new GMStorage( "openFreshAutoSend" + this.spaceId );
	}
	
	get sendDelayStorage() {
		return new GMStorage( "sendDelayPerSecond" + this.spaceId );
	}
	
	get sendDelayMaxStorage() {
		return new GMStorage( "sendDelayMaxStorage" + this.spaceId );
	}
	
	/** 发送延时getter */
	get sendDelayPerSecond() {
		return this.sendDelayStorage.get( 5 );
	}
	
	/** 发送延时setter */
	set sendDelayPerSecond( s ) {
		this.sendDelayStorage.set( s );
	}
	
	/** 发送延时getter */
	get sendDelayMaxPerSecond() {
		return this.sendDelayMaxStorage.get( 6 );
	}
	
	/** 发送延时setter */
	set sendDelayMaxPerSecond( s ) {
		this.sendDelayMaxStorage.set( s );
	}
	
	/** 开启文本乱码后缀getter */
	get openRandomCode() {
		return this.openRandomCodeStorage.get( true );
	}
	
	/** 开启文本乱码后缀setter */
	set openRandomCode( status ) {
		this.openRandomCodeStorage.set( status );
	}
	
	/** 弹幕发送方式getter  */
	get sendWay() {
		return this.sendWayStorage.get(
			0
			/* loop */
		);
	}
	
	/** 弹幕发送方式setter  */
	set sendWay( way ) {
		this.sendWayStorage.set( way );
	}
	
	/** 弹幕发送方式getter  */
	get isOpenFreshAutoSend() {
		return this.openFreshAutoSendStorage.get( true );
	}
	
	/** 弹幕发送方式setter  */
	set isOpenFreshAutoSend( status ) {
		this.openFreshAutoSendStorage.set( status );
	}
	
	/** 页面刷新延时getter */
	get freshPageDelayPerMinute() {
		return this.freshPageDelayStorage.get( 0 );
	}
	
	/** 页面刷新延时setter */
	set freshPageDelayPerMinute( s ) {
		this.freshPageDelayStorage.set( s );
	}
	
	/** 文本列表getter  */
	get contentList() {
		return this.contentListStorage.get( [
			"测试自定义文本1"
		] );
	}
	
	set contentList( contentList ) {
		this.contentListStorage.set( contentList );
	}
	
	get spaceId() {
		const spaceId = document.URL.match( new RegExp( "(?<=u\\/)[^/]*", "g" ) );
		if ( spaceId ) {
			return spaceId[0];
		}
		return "";
	}
}

class ConfigStorage {
	constructor() {
		__publicField( this, "config" );
		this.config = new Config();
	}
	
	/** 添加文本 */
	addContentToContentList( content ) {
		configStorage.config.contentList = [ .../* @__PURE__ */ new Set( [ ...this.config.contentList, content ] ) ];
	}
	
	/** 删除文本 */
	removeContentFromContentList( content ) {
		const contentList = new Set( this.config.contentList );
		contentList.delete( content );
		this.config.contentList = [ ...contentList ];
	}
}

const configStorage = new ConfigStorage();
const mathRandom = ( minOrMax, max ) => {
	if ( !max ) {
		max = minOrMax;
		minOrMax = 0;
	}
	minOrMax = Math.floor( minOrMax );
	max = Math.floor( max );
	const randomNumber = Math.floor( Math.random() * ( max - minOrMax + 1 ) );
	return randomNumber + minOrMax;
};
let nanoid = ( size = 21 ) => crypto.getRandomValues( new Uint8Array( size ) ).reduce( ( id, byte ) => {
	byte &= 63;
	if ( byte < 36 ) {
		id += byte.toString( 36 );
	}
	else if ( byte < 62 ) {
		id += ( byte - 26 ).toString( 36 ).toUpperCase();
	}
	else if ( byte > 62 ) {
		id += "-";
	}
	else {
		id += "_";
	}
	return id;
}, "" );

function inputEvent( aimElement, inputContent2 ) {
	aimElement.value = inputContent2;
	aimElement.dispatchEvent( new Event( "focus" ) );
	aimElement.dispatchEvent( new Event( "change" ) );
	aimElement.dispatchEvent( new Event( "input" ) );
	aimElement.dispatchEvent( new Event( "blur" ) );
}

function clickEvent( aimElement ) {
	aimElement.dispatchEvent( new Event( "click" ) );
}

function sendDanmuku( content ) {
	inputContent( content );
	clickSendBtn();
}

function inputContent( content ) {
	domList.sendInputBar = document.querySelector( ".chat-actions textarea" );
	inputEvent( domList.sendInputBar, content );
}

function clickSendBtn() {
	domList.sendBtn = document.querySelector( ".chat-actions .submit-button" );
	clickEvent( domList.sendBtn );
}

class AutoSendData {
	constructor() {
	}
	
	/** 开启自动发送 */
	open() {
		sessionStorage.setItem( "isOpenAutoSend", "true" );
	}
	
	/** 关闭自动发送 */
	close() {
		sessionStorage.removeItem( "isOpenAutoSend" );
	}
	
	/** 判断开关状态 */
	isOpenAutoSend() {
		return !!sessionStorage.getItem( "isOpenAutoSend" );
	}
}

class AutoSendEvent {
	constructor() {
		// @ts-ignore
		__publicField( this, "timer" );
		__publicField( this, "pageTimer" );
		__publicField( this, "_contentIndex", 0 );
	}
	
	/** 获取文本的当前索引getter */
	get contentIndex() {
		if ( configStorage.config.sendWay ) {
			return mathRandom( configStorage.config.contentList.length - 1 );
		}
		else {
			return this._contentIndex++ % configStorage.config.contentList.length;
		}
	}
	
	/** 随机时间 */
	get randomTime() {
		return mathRandom( configStorage.config.sendDelayPerSecond * 1e3, configStorage.config.sendDelayMaxPerSecond * 1e3 );
	}
	
	/** 开启自动发送弹幕事件 */
	open() {
		if ( configStorage.config.freshPageDelayPerMinute ) {
			this.freshPageOpen();
		}
		const callback = () => {
			print.log( this.getContentFromContentList() );
			sendDanmuku( this.getContentFromContentList() );
		};
		const sendTimer = () => {
			this.timer = setTimeout( () => {
				callback();
				if ( this.timer ) {
					sendTimer();
				}
			}, this.randomTime );
		};
		sendTimer();
	}
	
	/** 关闭自动发送弹幕时间 */
	close() {
		clearTimeout( this.timer );
		this.timer = void 0;
		this.freshPageClose();
	}
	
	/** 给文本添加后缀 */
	addSuffixToContent( content ) {
		return `${ content }_${ nanoid( 4 ) }`;
	}
	
	/** 随机获取文本 */
	getContentFromContentList() {
		if ( configStorage.config.openRandomCode ) {
			return this.addSuffixToContent( configStorage.config.contentList[this.contentIndex] );
		}
		return configStorage.config.contentList[this.contentIndex];
	}
	
	/** 定时刷新网页 */
	freshPageOpen() {
		this.pageTimer = setTimeout( () => {
			location.reload();
		}, configStorage.config.freshPageDelayPerMinute * 1e3 * 60 );
	}
	
	/** 关闭定时刷新网页, 在关闭弹幕发送的同时 */
	freshPageClose() {
		clearTimeout( this.pageTimer );
	}
}

class AutoSendUIConfig {
	constructor() {
		__publicField( this, "menuId" );
	}
	
	/** 添加开启选项 */
	open() {
		this.menuId = registerMenu( "[自动发送] 开启", () => {
			autoSendData.open();
			this.fresh();
			autoSendEvent.open();
		} );
	}
	
	/** 添加关闭选项 */
	close() {
		this.menuId = registerMenu( "[自动发送] 关闭", () => {
			autoSendData.close();
			this.fresh();
			autoSendEvent.close();
		} );
	}
	
	/** 刷新选项 */
	fresh() {
		if ( this.menuId ) {
			unregisterMenu( this.menuId );
		}
		if ( autoSendData.isOpenAutoSend() ) {
			this.close();
		}
		else {
			this.open();
		}
	}
}

const autoSendData = new AutoSendData();
const autoSendEvent = new AutoSendEvent();
const autoSendUIConfig = new AutoSendUIConfig();

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
		return [ this.header, `[${ (/* @__PURE__ */ new Date() ).toLocaleString( "zh-ch" ) }]`, ...msg ];
	}
}

class UiMenu {
	constructor() {
		__publicField( this, "domList", {} );
		this.registerFormElement();
		this.domList.form = this.form;
		this.domList.sendDelayInput = this.sendDelayInput;
		this.domList.sendDelayMaxInput = this.sendDelayMaxInput;
		this.domList.sendWayLoopInput = this.sendWayLoopInput;
		this.domList.sendWayRandomInput = this.sendWayRandomInput;
		this.domList.freshPageDelayInput = this.freshPageDelayInput;
		this.domList.freshPageDelayOpenInput = this.freshPageDelayOpenInput;
		this.domList.freshPageDelayCloseInput = this.freshPageDelayCloseInput;
		this.domList.contentListContainer = this.contentListContainer;
		this.domList.inputContentSubmit = this.inputContentSubmit;
		this.domList.textCodeOpenInput = this.textCodeOpenInput;
		this.domList.textCodeCloseInput = this.textCodeCloseInput;
	}
	
	/** 获取form表单项, 并阻止其自动提交 */
	get form() {
		const form = document.querySelector( ".config--container" );
		this.preventFormSubmit( form );
		return form;
	}
	
	/** 获取发送间隔表单项*/
	get sendDelayInput() {
		const inputElement = this.domList.form.querySelector( "#config--right__delay" );
		inputElement.value = String( configStorage.config.sendDelayPerSecond );
		inputElement.addEventListener( "change", () => {
			configStorage.config.sendDelayPerSecond = +inputElement.value;
			this.domList.sendDelayMaxInput.min = inputElement.value;
			if ( this.domList.sendDelayMaxInput.value < inputElement.value ) {
				this.domList.sendDelayMaxInput.value = inputElement.value;
			}
		} );
		return inputElement;
	}
	
	/** 获取发送间隔结束表单项 */
	get sendDelayMaxInput() {
		const inputElement = this.domList.form.querySelector( "#config--right__delay-end" );
		inputElement.value = String( configStorage.config.sendDelayMaxPerSecond );
		inputElement.min = this.domList.sendDelayInput.value;
		inputElement.addEventListener( "change", () => {
			configStorage.config.sendDelayMaxPerSecond = +inputElement.value;
		} );
		return inputElement;
	}
	
	/** 获取发送方式(循环)表单项 */
	get sendWayLoopInput() {
		const radioElement = this.domList.form.querySelector( "#config-right__send-way-loop" );
		radioElement.checked = !configStorage.config.sendWay;
		radioElement.addEventListener( "change", () => {
			if ( radioElement.checked ) {
				print.log( "sendWayOrigin", configStorage.config.sendWay );
				configStorage.config.sendWay = SendWay.loop;
				print.log( "sendWayChange", configStorage.config.sendWay );
			}
		} );
		return radioElement;
	}
	
	/** 获取发送方式(随机)表单项 */
	get sendWayRandomInput() {
		const radioElement = this.domList.form.querySelector( "#config-right__send-way-random" );
		radioElement.checked = !!configStorage.config.sendWay;
		radioElement.addEventListener( "change", () => {
			if ( radioElement.checked ) {
				configStorage.config.sendWay = SendWay.random;
				print.log( "sendWay", configStorage.config.sendWay );
			}
		} );
		return radioElement;
	}
	
	/** 获取刷新页面状态(开启)表单项 */
	get freshPageDelayOpenInput() {
		const radioElement = this.domList.form.querySelector( "#config--right__fresh-page-true" );
		radioElement.checked = !!configStorage.config.freshPageDelayPerMinute;
		radioElement.addEventListener( "change", () => {
			if ( radioElement.checked ) {
				this.domList.freshPageDelayInput.disabled = false;
				configStorage.config.freshPageDelayPerMinute = 1;
				this.domList.freshPageDelayInput.value = "1";
			}
		} );
		return radioElement;
	}
	
	/** 获取刷新页面状态(关闭)表单项 */
	get freshPageDelayCloseInput() {
		const radioElement = this.domList.form.querySelector( "#config--right__fresh-page-false" );
		radioElement.checked = !configStorage.config.freshPageDelayPerMinute;
		if ( radioElement.checked ) {
			print.log( radioElement.checked, this.domList.freshPageDelayInput );
			this.domList.freshPageDelayInput.disabled = true;
			configStorage.config.freshPageDelayPerMinute = 0;
		}
		radioElement.addEventListener( "change", () => {
			if ( radioElement.checked ) {
				this.domList.freshPageDelayInput.disabled = true;
				configStorage.config.freshPageDelayPerMinute = 0;
				this.domList.freshPageDelayInput.value = "0";
			}
		} );
		return radioElement;
	}
	
	/** 获取文本乱码状态(开启)表单项 */
	get textCodeOpenInput() {
		const radioElement = this.domList.form.querySelector( "#config-right__send-text-code-true" );
		radioElement.checked = configStorage.config.openRandomCode;
		radioElement.addEventListener( "change", () => {
			if ( radioElement.checked ) {
				configStorage.config.openRandomCode = true;
			}
		} );
		return radioElement;
	}
	
	/** 获取文本乱码状态(关闭)表单项 */
	get textCodeCloseInput() {
		const radioElement = this.domList.form.querySelector( "#config-right__send-text-code-false" );
		radioElement.checked = !configStorage.config.openRandomCode;
		radioElement.addEventListener( "click", () => {
			if ( radioElement.checked ) {
				configStorage.config.openRandomCode = false;
			}
		} );
		return radioElement;
	}
	
	/** 获取刷新页面延时表单项 */
	get freshPageDelayInput() {
		const radioElement = this.domList.form.querySelector( "#config--right__fresh-page-delay" );
		radioElement.value = String( configStorage.config.freshPageDelayPerMinute );
		radioElement.addEventListener( "change", () => {
			configStorage.config.freshPageDelayPerMinute = +radioElement.value;
		} );
		return radioElement;
	}
	
	/** 获取输入文本表单项 */
	get inputContent() {
		return this.domList.form.querySelector( "#config--right__input" );
	}
	
	/** 获取输入文本提交表单项 */
	get inputContentSubmit() {
		const inputContentSubmitBtn = this.domList.form.querySelector( "#config--right__input-btn" );
		inputContentSubmitBtn.addEventListener( "click", () => {
			let text = this.inputContent.value;
			text.split( "\n" ).forEach( ( text2 ) => {
				if ( !text2.trim() ) {
					return;
				}
				configStorage.addContentToContentList( text2.trim() );
			} );
			this.inputContent.value = "";
			this.contentListContainer;
		} );
		return inputContentSubmitBtn;
	}
	
	/** 获取自定义文本列表表单项 */
	get contentListContainer() {
		const radioElement = this.domList.form.querySelector( ".config--show-content-list .config--right__container" );
		radioElement.innerHTML = "";
		print.log( configStorage.config.contentList );
		configStorage.config.contentList.forEach( ( content ) => {
			radioElement.innerHTML += `
			<section class="config--right__content-container">
	            <p class="config--right__contents">${ content }</p>
	            <input class="config--right__content-delete-btn" type="button" value="删除">
            </section>
			`;
		} );
		const contentListNodeList = radioElement.querySelectorAll( ".config--right__content-container" );
		contentListNodeList.forEach( ( contentContainer ) => {
			const inputDom = contentContainer.querySelector( ".config--right__content-delete-btn" );
			const pDom = contentContainer.querySelector( ".config--right__contents" );
			inputDom.addEventListener( "click", () => {
				print.log( "删除文本", pDom.innerText );
				configStorage.removeContentFromContentList( pDom.innerText );
				this.contentListContainer;
			} );
		} );
		return radioElement;
	}
	
	/** 注册表单 */
	registerFormElement() {
		const form = createElement( {
			tagName: "form",
			className: [ "config--container", "hide" ],
			innerHTML: `
				<form class="config--container"><h1 class="config--title">配置菜单</h1><aside class="config--close-btn">×</aside><section class="config--delay"><label class="config--left__content" for="config--right__delay">发送间隔(s):</label><section class="config--right__container"><input id="config--right__delay" type="number" placeholder="输入发言的最小时间间隔(单位: s)" step="0.1" min="0.1" required><input id="config--right__delay-end" type="number" placeholder="输入发言的最大时间间隔(单位: s)" step="0.1" min="0.1" required></section></section><section class="config--send-way"><label class="config--left__content">发送方式:</label><section class="config--right__container"><label class="config--right__content" for="config-right__send-way-loop">循环发送<input id="config-right__send-way-loop" type="radio" name="send-way" value="loop"></label><label class="config--right__content" for="config-right__send-way-random">随机发送<input id="config-right__send-way-random" type="radio" name="send-way" value="random"></label></section></section><section class="config--send-text-code"><label class="config--left__content">开启乱码后缀:</label><section class="config--right__container"><label class="config--right__content" for="config-right__send-text-code-true">开启<input id="config-right__send-text-code-true" type="radio" name="send-text-code" value="true"></label><label class="config--right__content" for="config-right__send-text-code-false">关闭<input id="config-right__send-text-code-false" type="radio" name="send-text-code" value="false"></label></section></section><section class="config--fresh-page"><label class="config--left__content">刷新页面:</label><section class="config--right__container"><label class="config--right__content" for="config--right__fresh-page-true">开启<input id="config--right__fresh-page-true" type="radio" name="is-fresh-page" value="true"></label><label class="config--right__content" for="config--right__fresh-page-false">关闭<input id="config--right__fresh-page-false" type="radio" name="is-fresh-page" value="false"></label></section></section><section class="config--fresh-page"><label class="config--left__content">刷新页面延时(min):</label><section class="config--right__container"><input id="config--right__fresh-page-delay" type="number" placeholder="请输入刷新延时(单位: min)" min="0"></section></section><section class="config--input"><label class="config--left__content">输入文本:</label><section class="config--right__container"><textarea id="config--right__input" placeholder="请输入要发送的自定义文本"></textarea><button id="config--right__input-btn">发送</button></section></section><section class="config--show-content-list"><label class="config--left__content">自定义文本列表:</label><section class="config--right__container"></section></section>
			`
		} );
		const menuCssString = `
			.hide{display:none !important}input[id^=config],textarea[id^=config]{-webkit-appearance:radio;outline:none;border:solid 1px #f8f8f8;border-radius:5px;margin:0;padding:0}.config--container{width:500px;height:600px;border:2px solid #a6a6a6;border-radius:5px;margin:0 auto;background-color:#ffffff;display:flex;flex-flow:column;align-items:center;position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999}.config--container>[class^=config]{width:95%;border:1px solid #f8f8f8;border-radius:5px;margin:5px}.config--container>section{display:flex}.config--title{margin:0;text-align:center;border:none !important}.config--close-btn{font-size:20px;line-height:20px;text-align:center;width:20px !important;height:20px;position:absolute;right:10px;top:10px;border-radius:5px;padding:0;margin:0;background-color:#a6a6a6;color:white}.config--left__content{padding:5px 10px;height:30px;line-height:30px;text-align:center;font-size:15px;font-weight:bolder}.config--right__content{padding:5px 10px;height:30px;line-height:30px;text-align:center;width:40%;margin-right:30px;vertical-align:center}.config--right__container{padding:5px 10px;height:30px;flex:1}input[type="radio"]{width:15px;height:15px;vertical-align:center;transform:translate(5px, 3px)}#config--right__delay,#config--right__input,#config--right__fresh-page-delay,#config--right__delay-end{box-sizing:border-box;height:30px;line-height:30px;padding-left:10px;width:100%}#config--right__delay:focus,#config--right__input:focus,#config--right__fresh-page-delay:focus,#config--right__delay-end:focus{border:2px solid #a6a6a6}#config--right__delay,#config--right__delay-end{width:50%}.config--input .config--right__container{display:flex;gap:5px}#config--right__input{width:90%;resize:none;font-size:12px;line-height:12px}#config--right__input-btn{width:50px;height:30px}#config--right__input-btn,.config--right__content-delete-btn{border:none;background:#a6a6a6;border-radius:5px;color:#ffffff}.config--show-content-list>.config--left__content{width:100%}.config--show-content-list{flex:1;display:flex;flex-flow:column;overflow-y:scroll;overflow-x:hidden}.config--show-content-list .config--right__container{display:flex;flex-flow:column}.config--right__contents{margin:0;flex:1;width:70%;border:1px solid #f8f8f8;padding:2px}.config--right__content-container{display:flex;padding:5px -0px;gap:5px}
		`;
		addElementToDocument( form, menuCssString );
		form.querySelector( ".config--close-btn" ).addEventListener( "click", () => {
			this.hideForm();
		} );
	}
	
	/** 开启表单 */
	showForm() {
		this.domList.form.classList.remove( "hide" );
	}
	
	/** 隐藏表单 */
	hideForm() {
		this.domList.form.classList.add( "hide" );
	}
	
	/** 阻止form表单自动提交 */
	preventFormSubmit( form ) {
		form.addEventListener( "submit", ( e ) => {
			e.preventDefault();
		} );
	}
}

const print = new Info( "kuaishouLiveAutoSendDanmuku" );
const domList = {};
( async () => {
	const uiMenu = new UiMenu();
	registerMenu( "配置", () => {
		uiMenu.showForm();
	} );
	/* @__PURE__ */
	( () => {
	} )( autoSendData.isOpenAutoSend() );
	if ( autoSendData.isOpenAutoSend() && configStorage.config.freshPageDelayPerMinute && configStorage.config.isOpenFreshAutoSend ) {
		autoSendEvent.open();
	}
	else {
		autoSendData.close();
	}
	autoSendUIConfig.fresh();
} )();
