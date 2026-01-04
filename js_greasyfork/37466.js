// ==UserScript==
// @name        Booru Downloader + Viewer SFW
// @description The original fullsize images downloader, and viewer for the various booru imageboards
// @namespace   https://greasyfork.org/users/155308
// @author      se7en
// @version     1.1.0
// -------- INCLUDE SFW
// @include     *://safebooru.org/*
// @include     *://mspabooru.com/*
// @include     *://e926.net/*
// -------- EXCLUDE SFW
// @exclude     *://safebooru.org*//images/*
// @exclude     *://mspabooru.com*//images/*
// @exclude     *://static1.e926.net*/data/*
// -------- CONNECT SFW
// @connect     safebooru.org
// @connect     mspabooru.org
// @connect     e926.net
// -------- GREASEMONKEY API
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_download
// @grant       GM_info
// ------  GREASEMONKEY 4.0+ COMPATIBILITY
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @grant       GM.download
// @grant       GM.info
// @downloadURL https://update.greasyfork.org/scripts/37466/Booru%20Downloader%20%2B%20Viewer%20SFW.user.js
// @updateURL https://update.greasyfork.org/scripts/37466/Booru%20Downloader%20%2B%20Viewer%20SFW.meta.js
// ==/UserScript==

// -------- INCLUDE NSFW
// @include     *://gelbooru.com/*
// @include     *://rule34.xxx/*
// @include     *://yande.re/*
// @include     *://*.donmai.us/*
// @include     *://*.sankakucomplex.com/*
// @include     *://behoimi.org/*
// @include     *://youhate.us/*
// @include     *://uberbooru.com/*
// @include     *://bronibooru.com/*
// @include     *://www.bronibooru.com/*
// @include     *://e621.net/*
// @include     *://*.booru.org/*
// @include     *://atfbooru.ninja/*
// @include     *://lolibooru.moe/*
// @include     *://hypnohub.net/*
// @include     *://tbib.org/*
// @include     *://konachan.net/*
// @include     *://konachan.com/*
// @include     *://rule34.paheal.net/*
// -------- EXCLUDE NSFW
// @exclude     *://simg3.gelbooru.com*//images/*
// @exclude     *://img.rule34.xxx*//images/*
// @exclude     *://files.yande.re*/images/*
// @exclude     *://files.yande.re*/jpeg/*
// @exclude     *://*.donmai.us*/data/*
// @exclude     *://*s.sankakucomplex.com*/data/*
// @exclude     *://behoimi.org*/data/*
// @exclude     *://uberbooru.com*/data/*
// @exclude     *://s3.amazonaws.com*/bronibooru/*
// @exclude     *://static1.e621.net*/data/*
// @exclude     *://img.booru.org*/*//images/*
// @exclude     *://atfbooru.ninja*/data/*
// @exclude     *://lolibooru.moe*/image/*
// @exclude     *://hypnohub.net*//data/image/*
// @exclude     *://tbib.org*//images/*
// @exclude     *://konachan.net*/images/*
// @exclude     *://konachan.net*/jpeg/*
// @exclude     *://konachan.com*/images/*
// @exclude     *://konachan.com*/jpeg/*
// @exclude     *://*.paheal.net*/_images/*
// -------- CONNECT NSFW
// @connect     gelbooru.com
// @connect     rule34.xxx
// @connect     yande.re
// @connect     donmai.us
// @connect     sankakucomplex.com
// @connect     behoimi.org
// @connect     uberbooru.com
// @connect     s3.amazonaws.com
// @connect     bronibooru.com
// @connect     e621.net
// @connect     booru.org
// @connect     atfbooru.ninja
// @connect     lolibooru.moe
// @connect     hypnohub.net
// @connect     tbib.org
// @connect     konachan.net
// @connect     konachan.com
// @connect     paheal.net

/*
 This is SFW version of my ImageBoard Downloader script
 Visit https://sleazyfork.org/scripts/34175/ to install Full version (Adult + SFW)
*/

if( window.self !== window.top )
	return;
var RANDOM = '1681238';//Math.floor(Math.random()*1e6 + 1e6);
var DEBUG = false;
console.log('start ' + GM.info.script.name + ' v' + GM.info.script.version + '..');
(async function(){
	function consoleLog(){window.console.log.apply(this, arguments);}
	function blank(){}
	var clog = (DEBUG ? consoleLog : blank);
	var userOptions = await initOptions(),
	    methodsObject = initMethodsObject(),
		imageBoard = initImageBoard();
	newCssClasses();
	
	//------------------------------------------------------------------------------------//
	//------------------------------------ IMAGE BOARD -----------------------------------//
	function initImageBoard( d )
	{
		/*
		var elmClass = initImageBoardClasses(d),
			elmData  = initImageBoardDataset(d),
			siteList = initSiteList(),
			download = initImageBoardDownloader(d),
			userMenu = initUserMenu(),
			view     = initImageBoardViewer(d),
			state    = {'viewMode': false, 'userMenu': false, 'downloadMode': false},
			divID    = 'image-board-div-' + RANDOM;
		*/
		var imgBrdCl = initImageBoardClasses(d),
			imgBrdDt = initImageBoardDataset(d),
			siteList = initSiteList(),
			imgBrdDw = initImageBoardDownloader(d),
			userMenu = initUserMenu(),
			imgBrdVw = initImageBoardViewer(d),
			imgBrdSt = {'viewMode': false, 'userMenu': false, 'downloadMode': false},
			imgBrdId = 'image-board-div-' + RANDOM;
		var retVal   = {
			get siteList(){return siteList;},
			get imgBrdCl(){return imgBrdCl;},
			get imgBrdDt(){return imgBrdDt;},
			get imgBrdId(){return imgBrdId;},
			get imgBrdDw(){return imgBrdDw;},
			get userMenu(){return userMenu;},
			get imgBrdVw(){return imgBrdVw;},
			get imgBrdSt(){return imgBrdSt;},
			get images(){return this.data.images;},
			get downloader(){return this.data.downloader;},
			get viewer(){return this.data.viewer;},
			data: {
				'images': {
					list: null,
					init: function( doc, type ){
						clog("imageBoard init..");
						siteList.init(type);
						imgBrdDt.init(doc);
						imgBrdCl.init(doc);
						this.list = this.list || [];
						this.doc = doc || document;
						var siteObj = siteList.val(type),
							isPost = siteObj.isPost(),
							imgD;
						if( isPost )
						{
							var img = siteObj.getPostImage();
							if( img && !imgBrdCl.hasClass( img, 'counted') )
								imgD = this.addNewImage( img, isPost, siteObj );
						}
						var thumbs = siteObj.getImageThumbs( this.doc ),
							_3ParentTypes = ['yande.re', 'lolibooru', 'hypnohub', 'konachan'],
							name = siteObj.name,
							num = (_3ParentTypes.indexOf(name) != -1 ? 3 : 2);
						clog("thumbs.length: ", thumbs.length);
						for( var i = 0, len = thumbs.length, thumb, par, h; i < len; ++i )
						{
							thumb = thumbs[i];
							if( imgBrdCl.hasClass( thumb, 'counted' ) )
								continue;
							imgD = this.addNewImage( thumb, false, siteObj );
							par = parent( thumb, num );
							par.appendChild( this.createProgressBar(imgD.index) );
							if( par.tagName === 'ARTICLE' )
							{
								try{
									h = par.style.height;
									h = parseInt(h.match(/\d+/)[0], 10);
									h += 15;
									h += 'px';
								}catch(er){
									console.error(er);
									h = null;
								}
								par.style.height = h || '170px';
							}
						}
					},
					addNewImage: function( img, isPost, siteObj ){
						this.list.push({});
						var imgD = last(this.list), pdiv;
						imgD.state = 'empty';
						imgD.index = this.list.length - 1;
						imgD.type = siteObj.name;
						if( isPost )
						{
							imgD.postId = siteObj.getPostId();
							imgD.postUrl = window.location.href;
							siteObj.setImageDataDoc(imgD);
							pdiv = this.createProgressBar(imgD.index);
							if( img.parentNode.tagName != 'A' )
								img.parentNode.insertBefore(pdiv, img.nextSibling);
							else
								img.parentNode.parentNode.appendChild(pdiv);
						}else
							siteObj.setImageDataThumb( imgD, img );
						imgBrdDt.val( img, 'index', imgD.index);
						imgBrdCl.addClass( img, 'counted' );
						if( imgD.state === 'ready' )
						{
							siteObj.createDiv( imgBrdId, this.doc);
							imgBrdDw.init(imgBrdId, this.doc);
							setReadyImage( imgD, imgBrdCl, imgBrdDt, imgBrdDw, imgBrdVw );
						}
						return imgD;
					},
					createProgressBar: function(index ){
						var div = document.createElement('div'),
							html = '<div id="progress-stripe-' + index + '" ' +
							'class="progress-stripe progress-counted"></div>';
						div.setAttribute('class', 'progress-bar');
						div.insertAdjacentHTML('beforeend', html);
						return div;
					},
					getEmpty: function(){
						var empty = [];
						for( var i = 0; i < this.list.length; ++i )
						{
							if( this.list[i].state === 'empty' )
								empty.push(i);
						}
						return empty;
					},
					fix: function()
					{
						var empty = this.getEmpty(), animate = userOptions.val('animateProgress');
						clog("fix start..", empty.length);
						for( var i = 0, idx, imgD; i < empty.length; ++i )
						{
							idx = empty[i];
							imgD = this.list[idx];
							imgD.state = 'busy';
							this.getImageData(imgD, animate);
						}
					},
					getImageData: function(imgD, animate)
					{
						if( siteList.needXHR(imgD.type) )
						{
							if( animate )
								addClass(document.querySelectorAll('#progress-stripe-' + imgD.index), 'progress-animated');
							GM.xmlHttpRequest({
								url: imgD.postUrl,
								method: 'GET',
								context: {
									'index': imgD.index,
									'url': imgD.postUrl,
								},
								onload: xhrImageData,
							});
						}else{
							console.log("TODO :D");
							var siteObj = siteList.val(imgD.type);
							//siteObj.setImageDataFull(imgD);// TODO (yande.re, donmai)
						}
					},
				},
				'downloader': {
					init: function(doc, type){
						clog("downloader init..");
						siteList.init(type);
						var siteObj = siteList.val(type);
						siteObj.createDiv( imgBrdId, doc);
						imgBrdDw.init(imgBrdId, doc);
					},
					isActive: function(){
						//return imgBrdDw && imgBrdDw.isActive() || false;
						return imgBrdSt.downloadMode;
					},
					activateImage: function(thumb){
						if( !thumb )
							return;
						var a = thumb.parentNode;
						if( !imgBrdCl.hasClass(thumb, 'ready' ) )
							return;
						else if( !imgBrdCl.hasClass( a, 'downloadAttach' ) )
						{
							a.addEventListener('click', handleDownloadEvent, false);
							imgBrdCl.addClass( a, 'downloadAttach' );
						}
						imgBrdCl.addClass( a, 'downloadActive' );
					},
					activate: function(doc){
						clog("[downloader] activate");
						doc = doc || document;
						imgBrdCl.init(doc);
						var thumbs = imgBrdCl.queryAll('counted');
						for( var i = 0, len = thumbs.length; i < len; ++i )
							this.activateImage( thumbs[i] );
						imgBrdDw.downloadOn();
						imgBrdSt.downloadMode = true;
					},
					deactivate: function(doc){
						clog("[downloader] deactivate");
						doc = doc || document;
						imgBrdCl.init(doc);
						var activ = imgBrdCl.queryAll('downloadActive');
						clog("active.length: ", activ.length);
						for( var i = 0, len = activ.length; i < len; ++i )
							imgBrdCl.removeClass( activ[i], 'downloadActive' );
						imgBrdDw.downloadOff();
						imgBrdSt.downloadMode = false;
					},
					downloadAll: function(){
						imgBrdDw.downloadAll.click();// =)
					},
				},
				'userMenu': {
					init: function(doc, type){
						clog("userMenu init..");
						siteList.init(type);
						var siteObj = siteList.val(type);
						siteObj.createDiv( imgBrdId, doc);
						userMenu.init(imgBrdId, doc);
					},
				},
				'keyboard': {
					val: null,
					init: function(){
						if( !this.isActive )
							this.activate();
					},
					get isActive(){ return !!this.val;},
					activate: function(){
						activateKeyboard();
						this.val = true;
					},
					deactivate: function(){
						deactivateKeyboard();
						this.val = false;
					},
				},
				'viewer': {
					init: function(doc, type){
						clog("viewer init..");
						siteList.init(type);
						var siteObj = siteList.val(type);
						siteObj.createDiv( imgBrdId, doc);
						imgBrdVw.init(imgBrdId, doc, siteObj.viewDivInsertionPlace);
					},
					activateImage: function( thumb ){
						if( !thumb )
							return;
						var a = thumb.parentNode;
						if( !imgBrdCl.hasClass(thumb, 'ready' ) )
							return;
						else if( !imgBrdCl.hasClass( a, 'viewAttach' ) )
						{
							a.addEventListener('click', handleViewerEvent, false);
							imgBrdCl.addClass( a, 'viewAttach' );
						}
						imgBrdCl.addClass( a, 'viewActive' );
					},
					activate: function(doc){
						clog("viewer activate");
						doc = doc || document;
						imgBrdCl.init(doc);
						var thumbs = imgBrdCl.queryAll('counted');
						for( var i = 0, len = thumbs.length; i < len; ++i )
							this.activateImage( thumbs[i] );
						imgBrdVw.viewerOn();
						imgBrdSt.viewMode = true;
					},
					deactivate: function(doc){
						clog("viewer deactivate");
						doc = doc || document;
						imgBrdCl.init(doc);
						var activ = imgBrdCl.queryAll('viewActive');
						clog("active.length: ", activ.length);
						for( var i = 0, len = activ.length; i < len; ++i )
							imgBrdCl.removeClass( activ[i], 'viewActive' );
						imgBrdVw.viewerOff();
						imgBrdSt.viewMode = false;
					},
					isActive: function(){
						//return imgBrdVw.isActive();
						return imgBrdSt.viewMode;
					},
				},
			},
			init: function(doc){
				for( var key in this.data )
					this.data[key].init(doc);
			},
			fix: function(){
				this.data.images.fix();
			},
			initDiv: function(doc){
				doc = doc || document;
				var div = doc.querySelector('#' + imgBrdId),
					siteObj = siteList.val();
				if( !div )
					div = siteObj.createDiv(imgBrdId);
				if( !hasClass(div, 'image-board-div-activated') )
				{
					div.addEventListener('click', handleImageBoardEvent, false);
					addClass(div, 'image-board-div-activated');
				}
			},
		};
		retVal.init(d);
		setTimeout(function(){retVal.initDiv(d);}, 100);
		if( userOptions.val('autoRun') )
			retVal.fix();
		return retVal;
	}
	function handleImageBoardEvent(event)
	{
		var t = event.target,
			dId = 'image-board-download-switch-' + RANDOM,
			aId = 'image-board-download-all-' + RANDOM,
			vId = 'image-board-viewer-button-' + RANDOM,
			mId = 'image-board-user-menu-id-' + RANDOM;
		if( t.tagName === 'SPAN' )
			t = t.parentNode;
		if( t.tagName !== 'BUTTON' )
			return;
		else if( t.id === dId )
		{
			handleDownloadSwitchEvent();
		}
		else if( t.id === aId )
		{
			handleDownloadAllEvent();
		}
		else if( t.id === vId )
		{
			handleViewerSwitchEvent();
		}
		else if( t.id === mId )
		{
			handleUserMenuEvent();
		}else
			console.error("unknown element: ", t);
	}
	//------------------------------------ IMAGE BOARD -----------------------------------//
	//------------------------------------------------------------------------------------//
	//----------------------------------- XRH IMAGE DATA ---------------------------------//
	function xhrImageData(xhr)
	{
		var imgD = imageBoard.images.list[xhr.context.index];
		if( xhr.status !== 200 )
		{
			var context = xhr.context;
			console.error("xhr.status: ", xhr.status, xhr.statusText );
			console.error("index: ", context ? context.index : null);
			console.error("postUrl: ", context && context.url || null );
			if( imgD.state !== 'ready' )
				imgD.state = 'empty';
			removeClass( document.querySelectorAll('#progress-stripe-' + context.index), 'progress-animated' );
			return;
		}
		if( !imgD || imgD.state === 'ready' )
		{
			console.error("invalid context: ", imgD);
			return;
		}
		var siteObj = imageBoard.siteList.val(imgD.type);
		if( !siteObj )
		{
			console.error("invalid site type: ", imgD.type);
			return;
		}
		var doc = document.implementation.createHTMLDocument("");
		doc.documentElement.innerHTML = xhr.response;
		siteObj.setImageDataDoc(imgD, doc);
		clog("xhrImageData[" + imgD.index + "].state : " + imgD.state);
		if( imgD.state === 'ready' )
		{
			setReadyImage( imgD );
		}
	}
	function setReadyImage( imgD, imgBrdCl, imgBrdDt, imgBrdDw, imgBrdVw )
	{
		if( (!imgBrdCl || !imgBrdDt || !imgBrdDw || !imgBrdVw) && imageBoard )
		{
			imgBrdCl = imageBoard.imgBrdCl;
			imgBrdDt = imageBoard.imgBrdDt;
			imgBrdDw = imageBoard.imgBrdDw;
			imgBrdVw = imageBoard.imgBrdVw;
		}
		var thumb = imgBrdDt.query('index', imgD.index + ''),
			stripe = document.querySelectorAll('#progress-stripe-' + imgD.index);
		addClass(stripe, 'image-ready');
		removeClass(stripe, 'progress-animated');
		imgBrdCl.addClass( thumb, 'ready' );
		imgBrdDt.val( thumb, 'source', imgD.source );
		if( imgD.bytes ) imgBrdDt.val( thumb, 'bytes', imgD.bytes );
		imgBrdDw.total += 1;
		imgBrdVw.total += 1;
		clog("name: " + imgD.name);
		if( imageBoard )
		{
			if( imageBoard.downloader.isActive() )
				imageBoard.downloader.activateImage( thumb );
			if( imageBoard.viewer.isActive() )
				imageBoard.viewer.activateImage( thumb );
		}
	}
	//----------------------------------- XRH IMAGE DATA ---------------------------------//
	//------------------------------------------------------------------------------------//
	//------------------------------------- SITE LIST ------------------------------------//
	function initSiteList()
	{
		var retVal = {
			settings: {
				/*
				'gelbooru':   getGelbooruSettings,
				'rule34.xxx': getRule34Settings,
				'yande.re':   getYandereSettings,
				'donmai':     getDonmaiSettings,
				'sankaku':    getSankakuSettings,
				'behoimi':    getBehoimiSettings,
				'youhate':    getGelbooruSettings,
				*/
				'safebooru':  getSafebooruSettings,
				/*
				'uberbooru':  getUberbooruSettings,
				'bronibooru': getBronibooruSettings,
				*/
				'mspabooru':  getMspabooruSettings,
				'e926.net':   getE926netSettings,
				/*
				'e621.net':   getE621netSettings,
				'.booru.org': getBooruorgSettings,
				'atfbooru':   getAtfbooruSettings,
				'lolibooru':  getLolibooruSettings,
				'hypnohub':   getHypnohubSettings,
				'tbib':       getTbibSettings,
				'konachan':   getKonachanSettings,
				'paheal.net': getPahealSettings,
				*/
			},
			data: null,
			get: function( type, prop1, prop2 ){
				var obj;
				if( !type )
					obj = this.currentObj;
				else{
					this.data[type].init();
					obj = this.data[type];
				}
				return nodeWalk.call( obj, prop1, prop2 );
			},
			style: function(type){
				return this.get( type, 'style' );
			},
			val: function(type){
				return this.get( type, 'val' );
			},
			needXHR: function(type){
				return this.get( type, 'needXHR' );
			},
			init: function(type, prefix){
				if( !this.data )
				{
					this.data = {};
					for( var key in this.settings )
						this.data[key] = getSiteObject( key, this.settings[key], prefix );
				}
				if( !type )
					this.initCurrent();
				else if( this.data[type] )
					this.data[type].init();
			},
			getSiteType: function(url){
				url = url || window.location.href;
				for( var key in this.data )
				{
					if( this.data[key].regexp.test(url) )
						return key;
				}
				console.error("no site object found for this host");
				return null;
			},
			initCurrent: function(){
				if( !this.currentObj )
				{
					var type = this.getSiteType();
					if( !type )
						return;
					this.currentObj = this.data[type];
				}
				this.currentObj.init();
			},
		};
		retVal.init();
		clog("siteList.current: ", retVal.val());
		return retVal;
	}
	//------------------------------------- SITE LIST ------------------------------------//
	//------------------------------------------------------------------------------------//
	//------------------------------------- SITE OBJECT ----------------------------------//
	function getSiteObject( siteName, getSiteSettings, prefix )
	{
		return {
			val: null,
			name: siteName,
			regexp: new RegExp( siteName ),
			get needXHR(){return this.val.needXHR;},
			get style(){return this.val.style;},
			get settings(){
				var s = ( typeof getSiteSettings === 'function' ? getSiteSettings(prefix) : null);
				Object.defineProperty( this, 'settings', {
					get: function(){return s;},
					enumerable: true,
					configurable: true,
				});
				return s;
			},
			init: function(){
				this.val = this.val || initSiteObject( this.settings );
			},
		};
	}
	function initSiteObject( siteSettings )
	{
		var retVal = {
			data: null,
			
			get name(){ return this.data.name; },
			get prefixedName(){
				var prefix = this.prefix,
					name = this.shortName;
				if( prefix )
					name = prefix + name;
				Object.defineProperty( this, 'prefixedName', {
					get: function(){return name;},
					enumerable: true,
					configurable: true,
				});
				return name;
			},
			get prefix(){return this.data.prefix; },
			get shortName(){
				var name = this.name.replace(/^\./, '');
				Object.defineProperty( this, 'shortName', {
					get: function(){return name;},
					enumerable: true,
					configurable: true,
				});
				return name;
			},
			get hostname(){return this.data.hostname; },
			get imageHostname(){return this.data.imageHostname;},
			get imageDir(){return this.data.imageDir; },
			get style(){return this.data.style;},
			get postDivInsertionPlace(){return this.data.postDivInsertionPlace;},
			get listDivInsertionPlace(){return this.data.listDivInsertionPlace;},
			get viewDivInsertionPlace(){return this.data.viewDivInsertionPlace;},
			get methodsMap(){return this.data.methodsMap;},
			get needXHR(){return (typeof this.data.needXHR === 'boolean' ? this.data.needXHR : true);},
			init: function( settings ){
				this.data = this.data || settings;
				if( !this.data )
				{
					console.error("[initSiteObject] can't init siteObject, invalid data: ", this.data);
					return;
				}
				for( var i = 0, len = methodsObject.list.length, name, type, map = this.methodsMap || {}; i < len; ++i )
				{
					name = methodsObject.list[i];
					type = map[name] || 'booru';
					if( typeof methodsObject.method(type, name) === 'function' )
						this[name] = methodsObject.method(type, name);
				}
			},
		};
		retVal.init( siteSettings );
		return retVal;
	}
	/*
	//------------------------------------------------------------------------------------//
	//-------------------------------------- GELBOORU ------------------------------------//
	function getGelbooruSettings()
	{
		return {
			name: 'gelbooru',
			hostname: 'gelbooru.com',
			imageDir: '/images',
			imageHostname: 'simg3.gelbooru.com',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: '.contain-push',
			viewDivInsertionPlace: '.padding15',
			style: {
				color: '#fff',
				width: '180px',
				background: '#0773fb',
				backgroundHover: '#fbb307',
				colorHover: '#fff',
				backgroundView: '#fff',
			},
			methodsMap: {
				isPost: 'gelbooru',
				getPostId: 'gelbooru',
				getPostUrl: 'gelbooru',
			},
			needXHR: true,
		};
	}
	//------------------------------------------------------------------------------------//
	//--------------------------------------- RULE34 -------------------------------------//
	function getRule34Settings()
	{
		return {
			name: 'rule34.xxx',
			hostname: 'rule34.xxx',
			imageDir: '/images',
			imageHostname: 'img.rule34.xxx',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#post-list',
			style: {
				color: '#fff',
				width: '180px',
				background: '#84AE83',
				backgroundHover: '#A4CEA3',
				colorHover: '#fff',
			},
			methodsMap: {
				isPost: 'gelbooru',
				getPostId: 'gelbooru',
				getPostUrl: 'gelbooru',
			},
			needXHR: true,
		};
	}
	//------------------------------------------------------------------------------------//
	//------------------------------------- YANDE.RE -------------------------------------//
	function getYandereSettings()
	{
		return {
			name: 'yande.re',
			hostname: 'yande.re',
			imageDir: 'image',
			imageHostname: 'files.yande.re',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#post-list',
			style: {
				color: '#ee8887',
				width: '180px',
				background: '#222',
				backgroundHover: '#444',
				colorHover: '#ee8887',
			},
			methodsMap: null,
			needXHR: true,
		};
	}
	//------------------------------------------------------------------------------------//
	//-------------------------------------- DONMAI --------------------------------------//
	function getDonmaiSettings( prefix )
	{
		var prefixList = ['safebooru.', 'danbooru.', 'sonohara.', 'hijiribe.'],
			hostnameSuffix = 'donmai.us';
		prefix = getHostnamePrefix( hostnameSuffix, prefixList, prefix );
		var hostname = prefix + hostnameSuffix;
		return {
			name: 'donmai',
			prefix: prefix,
			hostname: hostname,
			imageHostname: hostname,
			imageDir: 'data',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: '#posts',
			viewDivInsertionPlace: '#page', //'#c-posts',
			style: {
				color: '#0073ff',
				width: '180px',
				background: '#f5f5ff',
				backgroundHover: '#f5f5ff',
				colorHover: '#80b9ff',
			},
			methodsMap: {
				isPost: 'donmai',
				getPostId: 'donmai',
				getPostUrl: 'donmai',
			},
			needXHR: true,
		};
	}
	//------------------------------------------------------------------------------------//
	//-------------------------------------- SANKAKU -------------------------------------//
	function getSankakuSettings(prefix)
	{
		var prefixList = ['chan.', 'idol.'],
			hostnameSuffix = 'sankakucomplex.com';
		prefix = getHostnamePrefix( hostnameSuffix, prefixList, prefix );
		var hostname = prefix + hostnameSuffix,
			imageHostnamePrefix = (prefix ? prefix[0] + 's.' : '');
		return {
			name: 'sankaku',
			prefix: prefix,
			hostname: hostname,
			imageHostname: imageHostnamePrefix + hostnameSuffix,
			imageDir: 'data',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: '#content',
			viewDivInsertionPlace: '#content',
			style: {
				color: '#ff761c',
				width: '180px',
				background: '',
				backgroundHover: '',
				colorHover: '#666',
			},
			methodsMap: null,
			needXHR: true,
		};
	}
	//------------------------------------------------------------------------------------//
	//-------------------------------------- BEHOIMI -------------------------------------//
	function getBehoimiSettings()
	{
		return {
			name: 'behoimi',
			hostname: 'behoimi.org',
			imageHostname: 'behoimi.org',
			imageDir: 'data',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#post-list',
			style: {
				color: '#43333f',
				width: '180px',
				background: '',
				backgroundHover: '',
				colorHover: '#354d99',
			},
			methodsMap: null,
			needXHR: true,
		};
	}
	*/
	//------------------------------------------------------------------------------------//
	//-------------------------------------- SAFEBOORU -----------------------------------//
	function getSafebooruSettings()
	{
		return {
			name: 'safebooru',
			hostname: 'safebooru.org',
			imageHostname: 'safebooru.org',
			imageDir: '/images',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#post-list',
			style: {
				color: '#fff',
				width: '180px',
				background: '#006ffa',
				backgroundHover: '#006ffa',
				colorHover: '#33cfff',
			},
			methodsMap: {
				isPost: 'gelbooru',
				getPostId: 'gelbooru',
				getPostUrl: 'gelbooru',
			},
			needXHR: true,
		};
	}
	/*
	//------------------------------------------------------------------------------------//
	//-------------------------------------- UBERBOORU -----------------------------------//
	function getUberbooruSettings()
	{
		return {
			name: 'uberbooru',
			hostname: 'uberbooru.com',
			imageHostname: 'uberbooru.com',
			imageDir: 'data',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: '#posts',
			viewDivInsertionPlace: 'div#page', // 'div#c-posts',
			style: {
				color: '#000',
				width: '180px',
				background: '#e6e6e6',
				backgroundHover: '#e6e6e6',
				colorHover: '#008',
			},
			methodsMap: {
				isPost: 'donmai',
				getPostId: 'donmai',
				getPostUrl: 'donmai',
			},
			needXHR: true,
		};
	}
	//------------------------------------------------------------------------------------//
	//------------------------------------- BRONIBOORU -----------------------------------//
	function getBronibooruSettings()
	{
		return {
			name: 'bronibooru',
			hostname: 'bronibooru.com',
			imageHostname: 's3.amazonaws.com',
			imageDir: 'bronibooru',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: '#posts',
			viewDivInsertionPlace: 'div#page', // 'div#c-posts',
			style: {
				color: '#0073ff',
				width: '180px',
				background: '#f7f7ff',
				backgroundHover: '#f7f7ff',
				colorHover: '#80b9ff',
			},
			methodsMap: {
				isPost: 'donmai',
				getPostId: 'donmai',
				getPostUrl: 'donmai',
			},
			needXHR: true,
		};
	}
	*/
	//------------------------------------------------------------------------------------//
	//-------------------------------------- MSPABOORU -----------------------------------//
	function getMspabooruSettings()
	{
		return {
			name: 'mspabooru',
			hostname: 'mspabooru.com',
			imageHostname: 'mspabooru.com',
			imageDir: '/images',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#post-list', // 'div#content',
			style: {
				color: '#fff',
				width: '180px',
				background: '#006ffa',
				backgroundHover: '#006ffa',
				colorHover: '#33cfff',
			},
			methodsMap: {
				isPost: 'gelbooru',
				getPostId: 'gelbooru',
				getPostUrl: 'gelbooru',
			},
			needXHR: true,
		};
	}
	//------------------------------------------------------------------------------------//
	//--------------------------------------- E926NET ------------------------------------//
	function getE926netSettings()
	{
		return {
			name: 'e926.net',
			hostname: 'e926.net',
			imageHostname: 'static1.e926.net',
			imageDir: 'data',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content-post',
			viewDivInsertionPlace: 'div#content', // 'div#post-list',
			style: {
				color: '#fff',
				width: '180px',
				background: '#152f56',
				backgroundHover: '#152f56',
				colorHover: '#2e76b4',
			},
			methodsMap: null,
			needXHR: true,
		};
	}
	/*
	//------------------------------------------------------------------------------------//
	//--------------------------------------- E621NET ------------------------------------//
	function getE621netSettings()
	{
		return {
			name: 'e621.net',
			hostname: 'e621.net',
			imageHostname: 'static1.e621.net',
			imageDir: 'data',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content-post',
			viewDivInsertionPlace: 'div#content', // 'div#post-list',
			style: {
				color: '#fff',
				width: '180px',
				background: '#152f56',
				backgroundHover: '#152f56',
				colorHover: '#2e76b4',
			},
			methodsMap: null,
			needXHR: true,
		};
	}
	//------------------------------------------------------------------------------------//
	//--------------------------------------- *.BOORU ------------------------------------//
	function getBooruorgSettings(prefix)
	{
		var prefixList = [], hostnameSuffix = 'booru.org';
		prefix = getHostnamePrefix( hostnameSuffix, prefixList, prefix );
		var hostname = prefix + hostnameSuffix;
		return {
			name: '.booru.org',
			prefix: prefix,
			hostname: hostname,
			imageHostname: 'img.booru.org',
			imageDir: prefix + '//images',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#content', // 'div#post-list',
			style: {
				color: '#fff',
				width: '180px',
				background: '#0773fb',
				backgroundHover: '#fbb307',
				colorHover: '#fff',
			},
			methodsMap: {
				isPost: 'gelbooru',
				getPostId: 'gelbooru',
				getPostUrl: 'gelbooru',
			},
			needXHR: true,
		};
	}
	//------------------------------------------------------------------------------------//
	//--------------------------------------- ATFBOORU -----------------------------------//
	function getAtfbooruSettings()
	{
		return {
			name: 'atfbooru',
			hostname: 'atfbooru.ninja',
			imageHostname: 'atfbooru.ninja',
			imageDir: 'data',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: '#posts',
			viewDivInsertionPlace: '#page', //'#c-posts',
			style: {
				color: '#0073ff',
				width: '180px',
				background: '#f5f5ff',
				backgroundHover: '#f5f5ff',
				colorHover: '#80b9ff',
			},
			methodsMap: {
				isPost: 'donmai',
				getPostId: 'donmai',
				getPostUrl: 'donmai',
			},
			needXHR: true,
		};// donmai like
	}
	//------------------------------------------------------------------------------------//
	//------------------------------------- LOLIBOORU ------------------------------------//
	function getLolibooruSettings()
	{
		return {
			name: 'lolibooru',
			hostname: 'lolibooru.moe',
			imageDir: 'image',
			imageHostname: 'lolibooru.moe',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#post-list',
			style: {
				color: '#ee8887',
				width: '180px',
				background: '#222',
				backgroundHover: '#444',
				colorHover: '#ee8887',
			},
			methodsMap: null,
			needXHR: true,
		};// yande.re like
	}
	//------------------------------------------------------------------------------------//
	//------------------------------------- HYPNOHUB -------------------------------------//
	function getHypnohubSettings()
	{
		return {
			name: 'hypnohub',
			hostname: 'hypnohub.net',
			imageDir: '/data/image',
			imageHostname: 'hypnohub.net',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#post-list',
			style: {
				color: '#ee8887',
				width: '180px',
				background: '#222',
				backgroundHover: '#444',
				colorHover: '#ee8887',
			},
			methodsMap: null,
			needXHR: true,
		};// yande.re like
	}
	//------------------------------------------------------------------------------------//
	//---------------------------------------- TBIB --------------------------------------//
	function getTbibSettings()
	{
		return {
			name: 'tbib',
			hostname: 'tbib.org',
			imageDir: '/images',
			imageHostname: 'tbib.org',
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#post-list',
			style: {
				color: '#fff',
				width: '180px',
				background: '#0773fb',
				backgroundHover: '#fbb307',
				colorHover: '#fff',
			},
			methodsMap: {
				isPost: 'gelbooru',
				getPostId: 'gelbooru',
				getPostUrl: 'gelbooru',
			},
			needXHR: true,
		};// gelbooru like
	}
	//------------------------------------------------------------------------------------//
	//------------------------------------- KONACHAN -------------------------------------//
	function getKonachanSettings()
	{
		var hostname = window.location.hostname;
		return {
			name: 'konachan',
			hostname: hostname,
			imageDir: 'image',
			imageHostname: hostname,
			postDivInsertionPlace: '#image',
			listDivInsertionPlace: 'div.content',
			viewDivInsertionPlace: 'div#post-list',
			style: {
				color: '#ee8887',
				width: '180px',
				background: '#222',
				backgroundHover: '#444',
				colorHover: '#ee8887',
			},
			methodsMap: null,
			needXHR: true,
		};// yande.re like
	}
	//------------------------------------------------------------------------------------//
	//--------------------------------------- PAHEAL -------------------------------------//
	function getPahealSettings()
	{
		return {
			name: 'paheal.net',
			prefix: 'rule34.',
			hostname: 'rule34.paheal.net',
			imageDir: '_images',
			imageHostname: '.paheal.net',
			postDivInsertionPlace: '#main_image',
			listDivInsertionPlace: '#imagelist',
			viewDivInsertionPlace: '#imagelist',
			style: {
				color: '#fff',
				width: '180px',
				background: '#84AE83',
				backgroundHover: '#A4CEA3',
				colorHover: '#fff',
			},
			methodsMap: {
				isPost: 'paheal',
				getPostId: 'paheal',
				getPostUrl: 'paheal',
			},
			needXHR: true,
		};
	}
	*/
	//------------------------------------------------------------------------------------//
	//------------------------------------- HOST PREFIX ----------------------------------//
	function getHostnamePrefix( hostnameSuffix, prefixList, prefix )
	{
		var hostname,
			errorMessage = "[getHostnamePrefix](hostnameSuffix='" + hostnameSuffix +
			"', prefixList=[" + prefixList.join(',') + "]" + (prefix ? ", prefix='" + prefix + "'" : "") + ") ",
			regExp;
		if( prefix )
		{
			if( prefixList.indexOf(prefix) == -1 )
			{
				console.error(errorMessage + "\nnot supported prefix");
				return '';
			}
		}else{
			hostname = window.location.hostname;
			if( hostname.indexOf(hostnameSuffix) == -1 )
			{
				console.error(errorMessage + "\ninvalid hostname: " + hostname );
				return '';
			}
			for( var i = 0, len = prefixList.length; i < len; ++i )
			{
				if( hostname.indexOf(prefixList[i]) == -1 )
					continue;
				prefix = prefixList[i];
				break;
			}
		}
		if( !prefix )
		{
			try{
				regExp = new RegExp('([^\\.]+\\.)(' + hostnameSuffix + ')' );
				prefix = hostname.match(regExp)[1];
			}catch(e){
				console.error(e);
				console.error(errorMessage + "\nno valid prefix for hostname: " + hostname );
			}
		}
		return prefix || '';
	}
	//------------------------------------------------------------------------------------//
	//----------------------------------- METHODS OBJECT ---------------------------------//
	function initMethodsObject()
	{
		var retVal = {
			get list(){return this.map.list;},
			map: {
				list: [
					'isPost',
					'getPostId',// get post id from href
					'getPostUrl',// get post url by postId
					// method of thumbnail data grabbing
					'getImageThumbs',
					'setImageDataThumb',
					// methods of image data getting from image post page
					'getPostImage',
					'setImageOriginalResolution',
					'setImageDataSize',
					'setImageDataSourceLowres',
					'setImageDataSourceHighres',
					'setImageDataTags',
					'setImageDataName',
					'setImageDataExtension',
					'setImageDataBytes',
					'setImageDataDoc',
					// create place for buttons insertion
					'getPostDivInsertionPlace',
					'getListDivInsertionPlace',
					'createDiv',
				],
			},
			data: {
				'booru': {
					val: null,
					init: function(){
						this.val = this.val || getBooruMethodsObject();
					},
				},
				'gelbooru': {
					val: null,
					init: function(){
						this.val = this.val || getGelbooruMethodsObject();
					},
				},
				'donmai': {
					val: null,
					init: function(){
						this.val = this.val || getDonmaiMethodsObject();
					},
				},
				'paheal': {
					val: null,
					init: function(){
						this.val = this.val || getPahealMethodsObject();
					},
				},
			},
			init: function(){
				for( var type in this.data )
					this.data[type].init();
			},
			method: function( type, name ){
				if( this.data[type] )
				{
					if( name )
						return this.data[type].val[name];
					return this.data[type].val;
				}
				return null;
			},
		};
		retVal.init();
		return retVal;
	}
	//----------------------------------- METHODS OBJECT ---------------------------------//
	//------------------------------------------------------------------------------------//
	//-------------------------------- BOORU METHODS OBJECT ------------------------------//
	function getBooruMethodsObject()
	{
		var retVal = {
			isPost: function(url){
				url = url || window.location.pathname || window.location.href;
				return /\/post\/show\/\d+/.test(url);
			},
			getPostId: function(url){
				url = url || window.location.href;
				if( this.isPost(url) )
					return getLocation(url, 'pathname').match(/\d+/)[0];
				return null;
			},
			getPostUrl: function(postId){
				return window.location.protocol + '//' + this.hostname + '/post/show/' + postId;
			},
			getPostDivInsertionPlace: function(doc){
				doc = doc || document;
				var insertPlace = doc.querySelector( this.postDivInsertionPlace );
				if( insertPlace )
				{
					var parent = insertPlace.parentNode;
					if( parent.tagName === 'A' )
						return parent.nextSibling || parent;
					return insertPlace.nextSibling || insertPlace;
				}
				return null;
			},
			getListDivInsertionPlace: function(doc){
				doc = doc || document;
				var insertPlace = doc.querySelector(this.listDivInsertionPlace);
				if( insertPlace )
					return insertPlace.firstChild || insertPlace;
				return null;
			},
			getPostImage: function(doc){
				doc = doc || document;
				return doc.querySelector('#image') || doc.querySelector('#main_image');//paheal
			},
			getImageThumbs: function( doc ){
				doc = doc || document;
				var thumbs = doc.querySelectorAll('img.preview');
				if( thumbs && thumbs.length === 0 )
					thumbs = doc.querySelectorAll('article > a > img');// donmai, uberbooru
				if( thumbs && thumbs.length === 0 )
					thumbs = doc.querySelectorAll('img[itemprop="thumbnailUrl"]');// donmai
				if( thumbs && thumbs.length === 0 )
					thumbs = doc.querySelectorAll('span.thumb > a > img');// *.booru.org
				if( thumbs && thumbs.length === 0 )
					thumbs = doc.querySelectorAll('a > img[id*="thumb_"]');// rule34.paheal.net
				return thumbs;
			},
			setImageDataThumb: function( imgD, thumb ){
				if( thumb && imgD )
				{
					if( thumb.dataset && thumb.dataset.original )
						imgD.thumbSource = thumb.dataset.original;
					else
						imgD.thumbSource = thumb.src;
					imgD.postUrl = thumb.parentNode.href;
					if( thumb.parentNode.id && /\d+/.test(thumb.parentNode.id) )
						imgD.postId = thumb.parentNode.id.match(/\d+/)[0];
					else
						imgD.postId = this.getPostId( imgD.postUrl );
					if( thumb.title )
						imgD.thumbTitle = thumb.title;
				}
			},
			setImageDataSourceLowres: function( imgD, doc ){
				var img = this.getPostImage(doc);
				if( img )
					imgD.lowresSource = img.src;
				else
					return 1;
				return 0;
			},
			setImageOriginalResolution: function( imgD, img ){
				if( !img )
					return false;
				var width, height;
				width = img.getAttribute('large_width');
				height = img.getAttribute('large_height');
				if( !width || !height )
				{
					width = img.getAttribute('data-original-width');
					height = img.getAttribute('data-original-height');
				}
				if( !width || !height )
				{
					// sankaku
					width = img.getAttribute('orig_width');
					height = img.getAttribute('orig_height');
				}
				if( !width || !height )
				{
					// e926.net, e621.net
					width = img.getAttribute('data-orig_width');
					height = img.getAttribute('data-orig_height');
				}
				if( (!width || !height) && this.name === 'paheal.net' )
				{
					// paheal.net
					width = img.getAttribute('data-width');
					height = img.getAttribute('data-height');
				}
				if( width && height )
				{
					imgD.width = width;
					imgD.height = height;
					return true;
				}
				return false;
			},
			setImageDataSize: function( imgD, doc ){
				doc = doc || document;
				var img = this.getPostImage(doc), res;
				if( this.setImageOriginalResolution )
					res = this.setImageOriginalResolution( imgD, img );
				if( res )
					return;
				var lis = doc.querySelectorAll('li'), i, li, len = lis.length;
				for( i = 0; i < len; ++i )
				{
					li = lis[i];
					if( li.innerHTML.indexOf('Size:') != -1 )
						break;
				}
				var match = li.innerHTML.match(/(\d+)x(\d+)/);
				if( i < len && match )
				{
					imgD.width = match[1];
					imgD.height = match[2];
				}else
					console.error("[setImageDataSize] can't find image size (width x height)");
			},
			setImageDataSourceHighres: function( imgD, doc ){
				doc = doc || document;
				var imgHost = this.imageHostname || this.hostname,
					i, l, href,
					link = doc.querySelectorAll('li > a[href*="' + imgHost + '/' + this.imageDir + '/"]');
				if( link.length === 0 )// same origin imageboards
					link = doc.querySelectorAll('li > a[href*="/' + this.imageDir + '/"]');
				if( link.length > 0 )
				{
					for( i = 0, href = null; i < link.length; ++i )
					{
						l = link[i];
						if( l.href.indexOf('sample') == -1 )
						{
							href = l.href;
							break;
						}
					}
					imgD.source = href ? href : last(link).href;
				}
				else if( imgD.lowresSource )
					imgD.source = imgD.lowresSource;
				else{
					console.error("[setImageDataSourceHighres] no image source found");
					return 1;
				}
				// jpeg image for yande.re like imageboards
				var jpeg = doc.querySelector('li > a[href*="' + imgHost + '/jpeg/"]');
				if( jpeg )
					imgD.jpegSource = jpeg.href;
				clog("imgD.source: " + imgD.source);
				this.setType = this.setType || function( _type, _source, _imgD )
				{
					_imgD[_type + '-source'] = _source;
					_imgD[_type + '-extension'] = getFileExt(_source);
				};
				this.setType( 'thumnail', imgD.thumbSource, imgD );
				if( /mp4|webm|ogv|ogg/.test(getFileExt(imgD.source)) )
				{
					this.setType( 'vid_file', imgD.source, imgD );
					imgD.viewType = 'vid_file';
				}else{
					this.setType( 'orig_img', imgD.source, imgD );
					imgD.viewType = 'orig_img';
					if( imgD.jpegSource )
					{
						this.setType( 'jpeg_img', imgD.jpegSource, imgD );
						imgD.viewType = 'jpeg_img';
					}
					if( !isSameLink(imgD.source, imgD.lowresSource) )
					{
						this.setType( 'samp_img', imgD.lowresSource, imgD );
						imgD.viewType = 'samp_img';
					}
				}
				return 0;
			},
			setImageDataTags: function( imgD, doc ){
				doc = doc || document;
				this.getTagName = this.getTagName || function( tagElm, fl)
				{
					if( tagElm.querySelectorAll('a').length === 0 )
						return '';
					if( fl )
						return tagElm.querySelectorAll('a')[0].innerText.trim().replace(/\s+/g, '_');// sankaku, safebooru.org
					return last(tagElm.querySelectorAll('a')).innerText.trim().replace(/\s+/g, '_');
				};
				this.tagsId = this.tagsId || {
					'general'  : '0',
					'artist'   : '1',
					'copyright': '3',
					'character': '4',
					'metadata' : '5',
					// 3dbooru tags
					'species'  : '-1',
					'model'    : '-1',
					'idol'     : '-1',
					'photo_set': '-1',
					'circle'   : '-1',
					'medium'   : '-1',
					'faults'   : '-1',
				};
				this.createTagObj = this.createTagObj || function( tagElm, tagsClass, fl )
				{
					try{
					var links = tagElm.querySelectorAll('a'),
						post_count = tagElm.querySelector('span.post-count') || tagElm.querySelector('span[style]'),
						searchLink = null,
						obj = {};
					if( tagsClass === 'tag-type' )
					{
						if( fl )
						{
							obj.href = links[0].href;
							obj.wiki = links[1].href;
							searchLink = links[0];
						}else{
							obj.href = last(links).href;
							obj.wiki = (links.length == 1 ? null : links[0].href);
						}
						obj.category = tagElm.className.match(/tag-type-([^\s]+)/)[1];
					}
					else if( tagsClass === 'category' )
					{
						obj.href = last(links).href;
						obj.wiki = (links.length == 1 ? null : links[0].href);
						obj.category = tagElm.className.match(/category-([^\s]+)/)[1];
					}
					else if( tagsClass === 'tag_name_cell' )
					{
						obj.href = links[1].href;
						obj.wiki = links[0].href;
						post_count = tagElm.querySelector('span.tag_count');
						obj.category = null;
					}else{
						obj.href = links[0].href;
						obj.wiki = null;
						post_count = links[0].nextSibling;
						obj.category = null;
					}
					if( obj.category )
						obj.class = tagsClass;
					searchLink = searchLink || last(links);
					obj.count = parseInt(post_count.textContent, 10);
					obj.name = searchLink.textContent;
					return obj;
					}catch(e){console.error(e);}
				};
				/*
				-------------->  n1 [ n2 ]
				n1 - number of links in tag element
				n2 - index 0..(n1-1) of search tag link (here, tag link)
				-------------->  2  1
				--> gelbooru:
				ul#tag-list
					div
						div[style] -- tag category name
						li.tag-type-
							a[href] -- wiki link
							a[href] -- tag link
							span[style]
				-------------->  1
				--> rule34.xxx:
				ul#tag-sidebar
					li -- tag category name
					li.tag-type- [class="tag"]
						a[href] -- tag
						span[style]
				-------------->  2  1
				--> yande.re,
				--> 3dbooru (behoimi):
				ul#tag-sidebar
					li.tag-type-
						a[href] -- wiki link
						a[href] -- tag link
						span.post-count
				-------------->  2  0
				--> sankaku:
				ul#tag-sidebar
					li.tag-type-
						a[href, title] -- tag link
						span.tag-extra-info
							a[href] -- wiki link
							span.post-count
				-------------->  1
				--> safebooru,
				--> mspabooru,
				--> tbib:
				ul#tag-sidebar
					li.tag-type-
						a[href] -- tag link
						span[style]
				-------------->  2  1
				--> e621.net,
				--> e926.net:
				ul#tag-sidebar
					li.category- -- tag category name
					li.tag-type-
						a[style, href] -- wiki
						a[href] -- tag
						span.post-count
				-------------->  1
				--> booru.org:
				div#tag_list
					ul
						li
							span[style]
								?
								a[href] -- tag
								number -- post count
				-------------->  2  1
				--> uberbooru,
				--> bronibooru:
				section#tag-list
					h2 -- tag category name
					ul
						li.category-
							a.wiki-link [href]
							a.search-tag [href]
							span.post-count
				-------------->  2  1
				--> donmai,
				--> atfbooru:
				section#tag-list
					h2.copyright-tag-list -- tag category name
					ul.copyright-tag-list
						li.category-
							a.wiki-link [href]
							a.search-tag [href]
							span.post-count
				-------------->  2  1
				--> lolibooru,
				--> hypnohub,
				--> konachan:
				ul#tag-sidebar
					li.tag-type- [class="tag-link", data-name="name of tag", data-type="tag category"]
						a[href] -- wiki
						a[href] -- tag
						span.post-count
				-------------->  2  1
				--> rule34.paheal.net:
				table.tag_list
					tbody tr
						td.tag_info_link_cell
							a.tag_info_link [href] -- wiki
						td.tag_name_cell
							a.tag_name [href] -- tag
						td.tag_count_cell
							span.tag_count
				*/
				var getTagName = this.getTagName,
					tagsId = this.tagsId,
					createTagObj = this.createTagObj,
					tagsClass = '';
				var nameList = ['sankaku'],
					tagsOrder = userOptions.val('tagsOrder'),
					iter = 0, _fl = null, i, k, tags, tagType;
				imgD.tags = imgD.tags || [];
				imgD.tags.length = 0;
				if( doc.querySelectorAll('li[class*="tag-type-"]').length > 0 )
					tagsClass = 'tag-type';
				else if( doc.querySelectorAll('li[class*="category-"]').length > 0 )
					tagsClass = 'category';
				for( i = 0, _fl = (nameList.indexOf(this.name) != -1); i < tagsOrder.length; ++i )
				{
					tagType = tagsOrder[i];
					if( tagsClass === 'tag-type' )
						tags = doc.querySelectorAll('li.tag-type-' + tagType);
					else if( tagsClass === 'category' )
						tags = doc.querySelectorAll('li.category-' + tagsId[tagType]);// donmai like
					for( k = 0; tags && k < tags.length; ++k, ++iter )
					{
						imgD.tags.push( getTagName(tags[k], _fl) );
					}
				}
				if( iter === 0 )
				{
					// not categorized tags
					tagsClass = '';
					tags = doc.querySelectorAll('div#tag_list li');// *.booru.org
					if( !tags || tags.length === 0 )
					{
						tags = doc.querySelectorAll('.tag_name_cell');// paheal.net
						tagsClass = 'tag_name_cell';
					}
					for( k = 0, _fl = (nameList.indexOf(this.name) != -1); tags && k < tags.length; ++k )
					{
						imgD.tags.push( getTagName(tags[k], _fl) );
					}
				}
				// tag object
				imgD.tagList = imgD.tagList || [];
				imgD.tagList.length = 0;
				if( tagsClass === 'tag-type' )
					tags = doc.querySelectorAll('li[class*="tag-type-"]');
				else if( tagsClass === 'category' )
					tags = doc.querySelectorAll('ul li[class*="category-"]');
				else if( tagsClass === 'tag_name_cell' )
					tags = doc.querySelectorAll('table.tag_list > tbody tr');// paheal.net
				else
					tags = doc.querySelectorAll('div#tag_list ul li span');// .booru.org
				for( i = 0; i < tags.length; ++i )
				{
					imgD.tagList.push( createTagObj(tags[i], tagsClass, _fl) );
				}
			},
			createDiv: function(id, doc){
				doc = doc || document;
				var div = doc.querySelector('#' + id);
				clog("[createDiv] div#" + id + ": ", div);
				if( div )
					return div;
				div = document.createElement('div');
				var insertPlace;
				if( this.isPost() )
					insertPlace = this.getPostDivInsertionPlace(doc);
				else
					insertPlace = this.getListDivInsertionPlace(doc) || doc.querySelector(".thumb") || doc.body.firstChild;
				if( !insertPlace )
					return null;
				div.setAttribute('id', id);
				if( insertPlace.tagName !== 'IMG' )
					div = insertPlace.parentNode.insertBefore( div, insertPlace.nextSibling);// check_it_out
				else
					div = insertPlace.parentNode.appendChild(div);
				if( typeof this.keyboardDiv === 'function' )
					this.keyboardDiv( id, doc );
				return div;
			},
			setImageDataDoc: function( imgD, doc ){
				if( !imgD || imgD.state === 'ready' )
					return 1;
				doc = doc || document;
				// size
				this.setImageDataSize( imgD, doc );
				// lowres
				var errN = this.setImageDataSourceLowres( imgD, doc );
				// highres
				errN += this.setImageDataSourceHighres( imgD, doc );
				if( errN > 1 )
					return errN;
				if( !imgD.lowresSource )
					imgD.lowresSource = (imgD.jpegSource || imgD.source);
				// tags
				this.setImageDataTags( imgD, doc );
				// name
				this.setImageDataName( imgD );
				// extension
				this.setImageDataExtension( imgD );
				imgD.state = 'ready';
				return 0;
			},
			setImageDataName: function( imgD ){
				if( !imgD || !imgD.tags )
					return;
				var tagsLen = imgD.tags.length,
					uLen = userOptions.val('maxTagsInName'),
					tagsDelim = userOptions.val('tagsDelim'),
					imageId = imgD.postId,
					boardName = '', name = '',
					ignoredTags = userOptions.val('ignoredTags'),
					tagName;
				if( userOptions.val('addImgBrdName') )
				{
					boardName = (userOptions.val('prefixedName') ? this.prefixedName : this.shortName);
					imageId = boardName + tagsDelim + imgD.postId;
				}
				for( var i = 0; i < tagsLen && i < uLen; ++i )
				{
					tagName = imgD.tags[i];
					if( tagName.length > 0 && ignoredTags.indexOf(tagName) == -1 )
						name += tagName + tagsDelim;
				}
				if( userOptions.val('imgIdAtNameEnd') )
					imgD.name = name + imageId;
				else
					imgD.name = imageId + tagsDelim + name.slice(0, -tagsDelim.length);
			},
			setImageDataExtension: function( imgD ){
				imgD.extension = getFileExt( imgD.source );
				if( imgD.jpegSource )
					imgD.jpegExtension = getFileExt( imgD.jpegSource );
			},
		};
		return retVal;
	}
	//-------------------------------- BOORU METHODS OBJECT ------------------------------//
	//------------------------------------------------------------------------------------//
	//------------------------------- GELBOORU METHODS OBJECT ----------------------------//
	function getGelbooruMethodsObject()
	{
		var retVal = {
			isPost: function( url ){
				url = url || window.location.href;
				if( this.getPostId(url) )
					return true;
				return false;
			},
			getPostId: function( postUrl ){
				postUrl = postUrl || window.location.href;
				var srch = getLocation( postUrl, 'search' ),
					keys = getSearchObject( srch );
				if( keys.s === 'view' && keys.page === 'post' )
					return keys.id;
				else
					return null;
			},
			getPostUrl: function( postId ){
				return window.location.protocol + this.hostname + '/index.php?page=post&s=view&id=' + postId;
			},
		};
		return retVal;
	}
	//------------------------------------------------------------------------------------//
	//-------------------------------- DONMAI METHODS OBJECT -----------------------------//
	function getDonmaiMethodsObject()
	{
		var retVal = {
			isPost: function(url){
				url = url || window.location.href;
				return /\/posts\/\d+/.test(url);
			},
			getPostId: function(url){
				url = url || window.location.href;
				if( this.isPost(url) )
					return getLocation(url, 'pathname').match(/(\/posts\/)?(\d+)?/)[2];
				return null;
			},
			getPostUrl: function(postId){
				return window.location.protocol + '//' + this.hostname + '/posts/' + postId;
			},
		};
		return retVal;
	}
	//------------------------------------------------------------------------------------//
	//-------------------------------- PAHEAL METHODS OBJECT -----------------------------//
	function getPahealMethodsObject()
	{
		var retVal = {
			isPost: function(url){
				url = url || window.location.href;
				return /\/post\/view\/\d+/.test(url);
			},
			getPostId: function(url){
				if( this.isPost(url) )
					return getLocation(url, 'pathname').match(/(\/post\/view\/)?(\d+)?/)[2];
				return null;
			},
			getPostUrl: function(postId){
				return window.location.protocol + '//' + this.hostname + '/post/view/' + postId;
			},
		};
		return retVal;
	}
	//------------------------------------------------------------------------------------//
	//-------------------------------------- DATASET -------------------------------------//
	function initImageBoardDataset(d)
	{
		var retVal = {
			data: {
				source: 'data-image-board-source',
				index: 'data-image-board-index',
				extension: 'data-image-board-extension',
				bytes: 'data-image-board-bytes',
			},
			val: function(elm, propName, v){
				if( this.data[propName] )
				{
					if( v !== undefined )
						elm.setAttribute(this.data[propName], v);
					else
						return elm.getAttribute(this.data[propName]);
				}
				return null;
			},
			init: function(doc){
				this.doc = doc || document;
			},
			getSelector: function(propName, v){
				var sel = this.data[propName];
				if( sel )
				{
					if( v !== undefined )
					{
						var pos = v.indexOf('=');// &=, *=, ^=
						if( pos > -1 && pos < 2 )
							sel += v;
						else
							sel += '="' + v + '"';
					}
					return '[' + sel + ']';
				}
				return null;
			},
			query: function(propName, v){
				var sel = this.getSelector(propName, v);
				if( sel )
					return this.doc.querySelector(sel);
				return null;
			},
			queryAll: function(propName, v){
				var sel = this.getSelector(propName, v);
				if( sel )
					return this.doc.querySelectorAll(sel);
				return null;
			},
		};
		retVal.init(d);
		return retVal;
	}
	//-------------------------------------- DATASET -------------------------------------//
	//------------------------------------------------------------------------------------//
	//-------------------------------------- CLASSES -------------------------------------//
	function initImageBoardClasses(d)
	{
		var retVal = {
			get counted(){return this.data.counted;},
			get viewActive(){return this.data.viewActive;},
			get viewAttach(){return this.data.viewAttach;},
			get ready(){return this.data.ready;},
			get downloaded(){return this.data.downloaded;},
			get downloadAttach(){ return this.data.downloadAttach;},
			get downloadActive(){ return this.data.downloadActive;},
			data: {
				counted: 'image-board-counted',
				viewAttach: 'image-board-attach-view-event',
				viewActive: 'image-board-active-for-view',
				ready: 'image-board-has-original-source',
				downloaded: 'image-board-downloaded-original',
				downloadAttach: 'image-board-attach-download-event',
				downloadActive: 'image-board-active-for-download',
			},
			hasClass: function(elm, propName){
				if( this.data[propName] )
					return hasClass(elm, this.data[propName]);
				return false;
			},
			addClass: function(elm, propName){
				if( this.data[propName] )
					addClass(elm, this.data[propName]);
			},
			removeClass: function(elm, propName){
				if( this.data[propName] )
					removeClass(elm, this.data[propName]);
			},
			toggleClass: function(elm, newPropName, oldPropName){
				if( oldPropName && !this.data[oldPropName] )
					return;
				else if( !newPropName || !this.data[newPropName] )
					return;
				toggleClass( elm, this.data[newPropName], this.data[oldPropName] );
			},
			queryAll: function(propName){
				if( this.data[propName] )
					return this.doc.querySelectorAll('.' + this.data[propName]);
				return null;
			},
			init: function(doc){this.doc = doc || document;},
		};
		retVal.init(d);
		return retVal;
	}
	//-------------------------------------- CLASSES -------------------------------------//
	//------------------------------------------------------------------------------------//
	//------------------------------------- DOWNLOADER -----------------------------------//
	function initImageBoardDownloader(d)
	{
		var iter = {
			total : 0,
			done: 0,
		};
		var retVal = {
			get total(){return iter.total;},
			set total(n){
				iter.total = n;
				this.downloadAllHtml(iter.total, iter.done);
			},
			get done(){return iter.done;},
			set done(n){
				iter.done = n;
				this.downloadAllHtml(iter.total, iter.done);
			},
			data: {
				downloaderId: 'image-board-downloader-' + RANDOM,
				downloadAllId: 'image-board-download-all-' + RANDOM,
				downloadSwitchId: 'image-board-download-switch-' + RANDOM,
				classBtn: 'image-board-downloader-button',
				classOn: 'image-board-downloader-on',
				classOff: 'image-board-downloader-off',
				classActive: 'image-board-downloader-active',
			},
			get downloaderId(){return this.data.downloaderId;},
			get downloadAllId(){return this.data.downloadAllId;},
			get downloadSwitchId(){return this.data.downloadSwitchId;},
			get classBtn(){return this.data.classBtn;},
			get classOn(){return this.data.classOn;},
			get classOff(){return this.data.classOff;},
			get classActive(){return this.data.classActive;},
			init: function(id, doc){
				doc = doc || document;
				clog("[initImageBoardDownloader] init, doc: ", doc);
				var div = doc.querySelector('div#' + id), html = '', btn;
				clog("div: ", div, id);
				if( !div )
				{
					console.error("[initImageBoardDownloader] can't find div#" + id);
					return;
				}
				var downloadSwitch = doc.querySelector('#' + this.downloadSwitchId);
				if( !downloadSwitch )
				{
					btn = document.createElement('button');
					btn.setAttribute('id', this.downloadSwitchId);
					btn.setAttribute('class', this.classOff + ' ' + this.classBtn );
					btn.setAttribute('title', 'Press \'Shift+D\' to switch download mode on/off');
					btn.appendChild(document.createTextNode('Donwload Mode'));
					downloadSwitch = div.appendChild( btn );
				}
				var downloadAll = doc.querySelector('#' + this.downloadAllId);
				if( !downloadAll )
				{
					btn = document.createElement('button');
					btn.setAttribute('id', this.downloadAllId );
					btn.setAttribute('class', this.classBtn );
					btn.appendChild(document.createTextNode('Donwload All (0)'));
					downloadAll = div.appendChild( btn );
				}
				return div;
			},
			downloadAllHtml: function( total, loaded, elm ){
				if( !elm ) elm = document.querySelector('#' + this.downloadAllId );
				elm.textContent = 'Download All (' + (loaded ? loaded + ' / ': '') + (total ? total : 0) + ')';
			},
			downloadOn: function(elm){
				if( !elm ) elm = document.querySelector('#' + this.downloadSwitchId);
				if( elm )
					toggleClass( elm, this.classOn, this.classOff );
				else
					console.error("[downloadOn] empty elm: ", elm );
			},
			downloadOff: function(elm){
				if( !elm ) elm = document.querySelector('#' + this.downloadSwitchId);
				if( elm )
					toggleClass( elm, this.classOff, this.classOn );
				else
					console.error("[downloadOff] empty elm: ", elm );
			},
			isActive: function(elm){
				if( !elm ) elm = document.querySelector('#' + this.downloadSwitchId);
				return hasClass(elm, this.classOn);
			},
		};
		return retVal;
	}
	//------------------------------------- DOWNLOADER -----------------------------------//
	//------------------------------------------------------------------------------------//
	//------------------------------------ DOWNLOADER-2 ----------------------------------//
	function handleDownloadEvent(event)
	{
		if( !imageBoard.imgBrdCl.hasClass( this, 'downloadActive' ) )
			return;
		event.preventDefault();
		var thumb = event.target,
			index = imageBoard.imgBrdDt.val( thumb, 'index' ),
			imgD = imageBoard.images.list[index];
		downloadFile( imgD );
	}
	function downloadFile( imgD )
	{
		if( imgD.state !== 'ready' || imgD.downloadState === 'downloaded' || imgD.downloadState === 'inProgress' )
			return;
		imgD.downloadState = 'inProgress';
		var hostname = getLocation(imgD.source, 'hostname'), source, ext, stripe;
		if( userOptions.val('downloadJPEG') && imgD.jpegSource )
			source = imgD.jpegSource;
		else
			source = imgD.source;
		ext = getFileExt(source);
		stripe = document.querySelectorAll('#progress-stripe-' + imgD.index);
		addClass( stripe, 'download-in-progress' );
		if( userOptions.val('animateProgress') )
			addClass( stripe, 'progress-animated' );
		attr( stripe, 'style', 'width:0%;' );
		if( hostname === window.location.hostname )
		{
			imageBoardDownloader( imgD, source, ext );
			return;
		}
		GM.xmlHttpRequest({
			url: source,
			method: 'GET',
			context: {
				'index': imgD.index,
				'url': source,
				'ext': ext,
				'stripe': stripe,
			},
			responseType: 'blob',
			onload: blibBlobDownloader,
			onprogress: downloadProgress,
		});
	}
	function downloadProgress( xhr )
	{
		try{
		if( !xhr.lengthComputable )
			return;
		var stripe = xhr.context.stripe || document.querySelectorAll('#progress-stripe-' + xhr.context.index),
			width = Math.floor(xhr.loaded/xhr.total*100);
		attr(stripe, 'style', 'width:' + width + '%');
		}catch(e){console.error(e);}
	}
	function blibBlobDownloader( xhr )
	{
		var imgD = imageBoard.images.list[xhr.context.index];
		if( xhr.status !== 200 )
		{
			console.error("xhr.status: ", xhr.status, xhr.statusText);
			console.error("url: " + xhr.context.url);
			if( imgD && imgD.downloadState === 'inProgress' )
				imgD.downloadState = '';
			return;
		}
		var wndURL = window.webkitURL || window.URL,
			resource = wndURL.createObjectURL(xhr.response);
		imageBoardDownloader( imgD, resource, xhr.context.ext );
		wndURL.revokeObjectURL( resource );
	}
	function imageBoardDownloader( imgD, resource, extension )
	{
		var name = imgD.name + '.' + (extension || imgD.extension);
		fileDownloader( name, resource );
		var thumb = imageBoard.imgBrdDt.query('index', imgD.index + ''),
			stripe = document.querySelectorAll('#progress-stripe-' + imgD.index);
		imageBoard.imgBrdCl.addClass( thumb, 'downloaded' );
		if( imgD.downloadState !== 'downloaded' )
			imageBoard.imgBrdDw.done += 1;
		imgD.downloadState = 'downloaded';
		attr(stripe, 'style', 'width:100%');
		//setTimeout(function(){
		removeClass( stripe, 'download-in-progress' );
		removeClass( stripe, 'progress-animated' );
		addClass( stripe, 'progress-complete' );
		//}, 50 );
	}
	function fileDownloader( name, resource )
	{
		var a = document.createElement('a'),
			body = document.body || document.getElementsByTagName('body')[0];
		a.setAttribute('download', name);
		a.href = resource;
		body.appendChild(a);
		a.click();
		body.removeChild(a);
	}
	function handleDownloadAllEvent(event)
	{
		var list = imageBoard.images.list;
		for( var i = 0, len = list.length, imgD; i < len; ++i )
		{
			imgD = list[i];
			downloadFile( imgD );
		}
	}
	function handleDownloadSwitchEvent(event)
	{
		if( imageBoard.imgBrdDw.isActive() )
		{
			imageBoard.downloader.deactivate();
		}else{
			imageBoard.downloader.activate();
		}
	}
	//------------------------------------ DOWNLOADER-2 ----------------------------------//
	//------------------------------------------------------------------------------------//
	//-------------------------------------- KEYBOARD ------------------------------------//
	function activateKeyboard()
	{
		window.addEventListener('keydown', handleKeyboardEvent, false);
		clog("--------> keyboard activated");
	}
	function deactivateKeyboard()
	{
		window.removeEventListener('keydown', handleKeyboardEvent, false);
		clog("--------> keyboard deactivated");
	}
	function handleKeyboardEvent(event)
	{
		var charCode = event.keyCode || event.which,
			str = String.fromCharCode(charCode).toLowerCase();
		if( !event.shiftKey || event.ctrlKey || event.altKey )
			return;
		else if( str === 'a' )
		{
			handleDownloadAllEvent();
		}
		else if( str === 'd' )
		{
			handleDownloadSwitchEvent();
		}
		else if( str === 'i' )
		{
			if( imageBoard )
			{
				imageBoard.init();
				imageBoard.fix();
			}
		}
		else if( str === 'm' )
		{
			handleUserMenuEvent();
		}
		else if( str === 'v' )
		{
			handleViewerSwitchEvent();
		}
	}
	//-------------------------------------- KEYBOARD ------------------------------------//
	//------------------------------------------------------------------------------------//
	//--------------------------------------- VIEWER -------------------------------------//
	function initImageBoardViewer(d)
	{
		var iter = {
			curr: 0,
			total: 0,
		};
		var retVal = {
			get curr(){return iter.curr;},
			set curr(n){
				n = parseInt(n, 10);
				var elm = (this.doc || document).querySelector('#' + this.currentId);
				if( elm )
					elm.textContent = '' + (n + 1);
				iter.curr = n;
			},
			set total(n){iter.total = parseInt(n, 10);},
			get total(){return iter.total;},
			data: {
				buttonId: 'image-board-viewer-button-' + RANDOM,
				containerId: 'image-board-viewer-container-' + RANDOM,
				tagsId: 'image-board-viewer-tags-' + RANDOM,
				listId: 'image-board-viewer-list-' + RANDOM,
				bottomId: 'image-board-viewer-bottom-' + RANDOM,
				thumbsId: 'image-board-viewer-thumbs-' + RANDOM,
				// bottom div panel
				prevId: 'image-board-viewer-show-prev-' + RANDOM,
				nextId: 'image-board-viewer-show-next-' + RANDOM,
				downloadId: 'image-board-viewer-downlaod-' + RANDOM,
				closeId: 'image-board-viewer-close-' + RANDOM,
				sourceId: 'image-board-viewer-source-' + RANDOM,
				currentId: 'image-board-viewer-current-' + RANDOM,
				// classes
				classActive: 'image-board-viewer-active',
				classOn: 'image-board-viewer-on',
				classOff: 'image-board-viewer-off',
				classBtn: 'image-board-viewer-btn',
				classBottom: 'image-board-viewer-bottom-class',
			},
			get buttonId(){return this.data.buttonId;},
			get containerId(){return this.data.containerId;},
			get tagsId(){return this.data.tagsId;},
			get listId(){return this.data.listId;},
			get bottomId(){return this.data.bottomId;},
			get thumbsId(){return this.data.thumbsId;},
			
			get prevId(){return this.data.prevId;},
			get nextId(){return this.data.nextId;},
			get downloadId(){return this.data.downloadId;},
			get closeId(){return this.data.closeId;},
			get sourceId(){return this.data.sourceId;},
			get currentId(){return this.data.currentId;},
			
			get classActive(){return this.data.classActive;},
			get classOn(){return this.data.classOn;},
			get classOff(){return this.data.classOff;},
			get classBtn(){return this.data.classBtn;},
			get classBottom(){return this.data.classBottom;},
			init: function(id, doc, selector){
				if( !userOptions.val('createViewer') )
					return;
				doc = doc || document;
				this.doc = doc;
				var div = doc.querySelector('#' + id), viewDiv, html;
				if( !div )
				{
					console.error("[initImageBoardViewer] imageBoard div not found, id: " + id);
					return;
				}
				var btn = doc.querySelector('#' + this.buttonId);
				if( !btn )
				{
					btn = document.createElement('button');
					btn.setAttribute('id', this.buttonId);
					btn.setAttribute('class', this.classOff);
					btn.appendChild(document.createTextNode('Viewer'));
					btn = div.insertBefore( btn, div.firstChild );
				}
				var cont = doc.querySelector('#' + this.containerId);
				if( !cont )
				{
					cont = document.createElement('div');
					var obj = {
						'id': this.containerId,
						'class': this.classOff + ' image-board-viewer-container',
						'data-class-button': this.classBtn,
						'data-prev-id': this.prevId,
						'data-next-id': this.nextId,
						'data-download-id': this.downloadId,
						'data-current-id': this.currentId,
						'data-close-id': this.closeId,
						'data-source-id': this.sourceId,
						'data-list-id': this.listId,
					};
					for( var key in obj )
						cont.setAttribute( key, obj[key] );
					html = '' +
					'<div id="' + this.tagsId + '" class="viewer-tag-list" tabindex="1000"></div>' +
					'<div id="' + this.thumbsId + '" class="viewer-thumb-list" tabindex="1001"></div>' +
					'<div id="' + this.listId + '" class="viewer-img-list" style="text-align:center;"></div>' +
					'<div id="' + this.bottomId + '" class="' + this.classBottom + ' viewer-bottom">' +
						'<button id="' + this.prevId + '" class="' + this.classBtn + ' viewer-navigation-bar">Prev</button>' +
						'<button id="' + this.sourceId + '" class="' + this.classBtn + ' viewer-navigation-bar">Source</button>' +
						'<button id="' + this.closeId + '" class="' + this.classBtn + ' viewer-navigation-bar">Close</button>' +
						'<button id="' + this.currentId + '" class="viewer-navigation-bar" style="width:40px;">' + '-' + '</button>' +
						'<button id="' + this.downloadId + '" class="' + this.classBtn + ' viewer-navigation-bar">Download</button>' +
						'<button id="' + this.nextId + '" class="' + this.classBtn + ' viewer-navigation-bar">Next</button>' +
					'</div>';
					cont.insertAdjacentHTML('beforeend', html);
					if( userOptions.val('fixedThumbs') )
						addClass( cont, 'viewer-thumb-list-fixed' );
					if( userOptions.val('fixedTags') )
						addClass( cont, 'viewer-tag-list-fixed' );
					doc.body.appendChild(cont);
				}
				if( !cont.classList.contains(this.classActive) )
				{
					cont.addEventListener('click', handleViewerNavigationEvent, false);
					cont.classList.add(this.classActive);
					activateViewerKeyboard();
					var activateSidebar = function(elm)
					{
						if( elm )
						{
							elm.addEventListener('mouseover', function(){this.focus();}, false);
							elm.addEventListener('mouseout', function(){this.blur();}, false);
						}
					};
					activateSidebar(doc.querySelector('#' + this.tagsId ));
					activateSidebar(doc.querySelector('#' + this.thumbsId ));
				}
			},
			showNext: function(){
				if( !this.isActive() )
					return;
				try{
					var idx = (this.curr + this.total + 1)%this.total;
					viewImage(idx);
				}catch(e){console.error(e);}
			},
			showPrev: function(){
				if( !this.isActive() )
					return;
				try{
					var idx = (this.curr + this.total - 1)%this.total;
					viewImage(idx);
				}catch(e){console.error(e);}
			},
			isActive: function(){
				if( !this.btn ) this.btn = document.querySelector('#' + this.buttonId);
				return hasClass( this.btn, this.classOn );
			},
			viewerOn: function(){
				if( !this.btn ) this.btn = document.querySelector('#' + this.buttonId);
				if( !this.cont ) this.cont = document.querySelector('#' + this.containerId);
				toggleClass(this.btn, this.classOn, this.classOff);
				toggleClass(this.cont, this.classOn, this.classOff);
				this.setOverflow = this.setOverflow || function(elm, val){if(elm) elm.style.overflow = val;};
				try{
					var html = this.cont.querySelector('#' + this.currentId).textContent;
					if( userOptions.val('viewFirst') && html === '-' )
						viewImage(0);
					else
						viewImage('-');
					this.setOverflow( document.body || document.getElementsByTagName('body')[0], 'hidden' );
					this.setOverflow( document.getElementsByTagName('html')[0], 'hidden' );
				}catch(e){console.error(e);}
				resumeVideo(this.curr);
			},
			viewerOff: function(){
				this.setOverflow = this.setOverflow || function(elm, val){if(elm) elm.style.overflow = val;};
				this.setOverflow( document.body || document.getElementsByTagName('body')[0], 'auto' );
				this.setOverflow( document.getElementsByTagName('html')[0], 'auto' );
				toggleClass(this.btn, this.classOff, this.classOn);
				toggleClass(this.cont, this.classOff, this.classOn);
				historyChange( null );
				pauseVideo(this.curr);
			},
		};
		return retVal;
	}
	//--------------------------------------- VIEWER -------------------------------------//
	//------------------------------------------------------------------------------------//
	//-------------------------------------- VIEWER-2 ------------------------------------//
	function activateViewerKeyboard()
	{
		window.addEventListener('keydown', handleViewerKeyboardEvent, false);
	}
	function deactivateViewerKeyboard()
	{
		window.removeEventListener('keydown', handleViewerKeyboardEvent, false);
	}
	function handleViewerKeyboardEvent(event)
	{
		var charCode = event.keyCode || event.which,
			useCtrl = userOptions.val('holdCtrl') || window.location.hostname.indexOf('donmai.us') != -1,
			condition1 = event.shiftKey || !event.ctrlKey || event.altKey,
			condition2 = event.shiftKey ||  event.ctrlKey || event.altKey;
		if( (useCtrl && condition1) || (!useCtrl && condition2) )
			return;
		var viewer = imageBoard.imgBrdVw;
		if( charCode == 37 )
			viewer.showPrev();
		else if( charCode == 39 )
			viewer.showNext();
	}
	function handleViewerEvent(event)
	{
		if( !imageBoard.imgBrdCl.hasClass( this, 'viewActive' ) )
			return;
		event.preventDefault();
		var t = event.target;
		if( t.tagName !== 'IMG' )
			t = t.firstChild;
		if( t.tagName !== 'IMG' )
			return;
		var idx = imageBoard.imgBrdDt.val(t, 'index');
		clog("[handleViewerEvent] index: " + idx);
		if( idx !== null && idx !== undefined )
			viewImage( idx );
		else
			console.error("image index not found, img: ", t.src);
	}
	function viewImage( idx )
	{
		if( !imageBoard )
			return;
		var viewer = imageBoard.imgBrdVw,
			hostname = window.location.hostname,
			div, imgD, dwSource;
		if( !viewer || !viewer.isActive() )
			return;
		idx = parseInt(idx, 10);
		idx = (viewer.total + idx)%viewer.total;
		makeThumbListHTML();
		makeImageListHTML();
		imgD = imageBoard.images.list[idx];
		if( !imgD || imgD.state !== 'ready' )
			return;
		setImageList(true);// loop over all .viewer-img-list > div
		if( hostname.indexOf('sankakucomplex') != -1 )
			historyChange( imgD.postUrl );
		div = document.querySelector('div[data-image-index="' + imgD.index + '"]');
		loadImage(imgD.index, div);
		if( userOptions.val('downloadJPEG') && imgD.jpegSource )
			dwSource = imgD.jpegSource;
		else
			dwSource = imgD.source;
		removeClass( document.querySelectorAll('div.viewer-img-div'), 'img-show' );
		addClass( div, 'img-show' );
		makeTagListHTML(idx);
		setViewerBottom( viewer, dwSource, imgD.name );
		pauseVideo(viewer.curr);
		viewer.curr = idx;
	}
	//------------------------------------------------------------------------------------//
	//--------------------------------- VIEWER-THUMB-LIST --------------------------------//
	function makeThumbListHTML()
	{
		var thumbListDiv = document.querySelector('.viewer-thumb-list');
		if( !thumbListDiv )
		{
			console.error("[makeThumbListHTML] can't find div");
			return;
		}
		var imageList = imageBoard.images.list,
			thumbTitle = '', html = '',
			oldLen = thumbListDiv.getAttribute('data-viewer-thumb-length') || 0,
			animate = userOptions.val('animateProgress'),
			showProgress = userOptions.val('showProgress'),
			i, len, imgD, img;
		oldLen = parseInt(oldLen, 10);
		for( i = oldLen, len = imageList.length; i < len; ++i )
		{
			imgD = imageList[i];
			if( imgD.tags )
				thumbTitle = imgD.tags.join(' ');
			else if( imgD.thumbTitle )
				thumbTitle = imgD.thumbTitle;
			else
				thumbTitle = '';
			html += '<div class="viewer-thumb-div" data-viewer-thumb-div-index="' + imgD.index + '">';
			html += '<span class="viewer-thumb-span">';
			html += '<img data-viewer-thumb-index="' + imgD.index + '" ' +
			'class="viewer-thumb" src="' + (imgD.thumbSource || imgD.lowresSource) + '" ' +
			'title="' + thumbTitle + '"/>';
			html += '</span>';
			html += (showProgress ? makeProgressBarHTML( imgD, animate) : '');
			html += '</div>';
		}
		thumbListDiv.setAttribute('data-viewer-thumb-length', len);
		thumbListDiv.insertAdjacentHTML('beforeend', html);
		if( hasClass(thumbListDiv, 'viewer-thumb-list-activated') )
			return;
		thumbListDiv.addEventListener('click', handleViewerThumbEvent, false);
		addClass(thumbListDiv, 'viewer-thumb-list-activated');
	}
	function makeProgressBarHTML( imgD, animate )
	{
		return '<div class="progress-bar">' +
			'<div id="progress-stripe-' + imgD.index + '" class="progress-stripe progress-counted' +
			(imgD.state === 'ready' ? ' image-ready' : '') + '' +
			(imgD.state === 'busy' && !!animate ? ' animate-progess' : '') + '' +
			(imgD.downloadState === 'inProgress' ? ' download-in-progress' : '') + '' +
			(imgD.downloadState === 'downloaded' ? ' progress-complete': '') + '' +
			'"></div></div>';
	}
	function showViewerProgressBar( showProgress )
	{
		var animate = userOptions.val('animateProgress'),
			divList = document.querySelectorAll('.viewer-thumb-div'),
			imageList = imageBoard.images.list,
			animate = userOptions.val('animateProgress'),
			html, i, len, div, index, imgD, stripe;
		for( i = 0, len = divList.length; i < len; ++i )
		{
			div = divList[i];
			index = div.getAttribute('data-viewer-thumb-div-index');
			stripe = div.querySelector('#progress-stripe-' + index);
			if( !showProgress )
				hide(stripe);
			else if( !stripe )
			{
				imgD = imageList[index];
				html = makeProgressBarHTML(imgD, animate);
				div.insertAdjacentHTML('beforeend', html);
			}else
				show(stripe);
		}
	}
	function handleViewerThumbEvent(event)
	{
		var t = event.target;
		if( t.tagName !== 'IMG' )
			return;
		var idx = t.getAttribute('data-viewer-thumb-index');
		viewImage(idx);
	}
	//--------------------------------- VIEWER-THUMB-LIST --------------------------------//
	//------------------------------------------------------------------------------------//
	//--------------------------------- VIEWER-IMAGE-LIST --------------------------------//
	function makeImageListHTML()
	{
		var imgListDiv = document.querySelector('.viewer-img-list');
		if( !imgListDiv )
			return;
		var imageList = imageBoard.images.list,
			imgLen = imgListDiv.getAttribute('data-image-list-length') || 0,
			html = '', i, len;
		imgLen = parseInt(imgLen, 10);
		for( i = imgLen, len = imageList.length; i < len; ++i )
		{
			html += '<div data-image-index="' + i + '" class="viewer-img-div">';
			html += '<video class="vid_file" controls loop></video>';
			html += '<img class="orig_img"></img>';
			html += '<img class="jpeg_img"></img>';
			html += '<img class="samp_img"></img>';
			html += '</div>';
		}
		imgListDiv.setAttribute('data-image-list-length', len);
		imgListDiv.insertAdjacentHTML('beforeend', html);
	}
	function setImageList( reset )
	{
		var imgListDiv = document.querySelector('.viewer-img-list');
		if( !imgListDiv )
			return;
		var imageDivs = imgListDiv.querySelectorAll('.viewer-img-div'),
			imageList = imageBoard.images.list,
			imgLen = imgListDiv.getAttribute('data-image-list-length') || 0,
			viewOriginal = userOptions.val('viewOriginal'),
			viewJPEG = userOptions.val('viewJPEG'),
			i, imgD, imgDiv, viewType;
		imgLen = parseInt(imgLen, 10);
		for( i = 0; i < imgLen; ++i )
		{
			imgD = imageList[i];
			imgDiv = imageDivs[i];
			viewType = imgDiv.getAttribute('data-image-view-type');
			if( reset || !viewType || viewType === 'none_src' )
				imgDiv.setAttribute('data-image-view-type', getImageViewType(imgD, viewOriginal, viewJPEG) );
		}
	}
	function getImageViewType( imgD, viewOriginal, viewJPEG )
	{
		if( imgD['vid_file-source'] )
			imgD.viewType = 'vid_file';
		else if( imgD['jpeg_img-source'] && viewJPEG && viewOriginal )
			imgD.viewType = 'jpeg_img';
		else if( imgD['orig_img-source'] && (viewOriginal || !imgD['samp_img-source']) )
			imgD.viewType = 'orig_img';
		else if( imgD['samp_img-source'] )
			imgD.viewType = 'samp_img';
		else
			imgD.viewType = 'none_src';
		return imgD.viewType;
	}
	//--------------------------------- VIEWER-IMAGE-LIST --------------------------------//
	//------------------------------------------------------------------------------------//
	//------------------------------------ LOAD-IMAGE ------------------------------------//
	function loadImage(idx, div, isNext)
	{
		idx = parseInt(idx, 10);
		div = div || document.querySelector('div[data-image-index="' + idx + '"]');
		var viewType = div.getAttribute('data-image-view-type');
		if( !viewType || viewType === 'none_src' )
			return;
		var img = div.querySelector('.' + viewType),
			//complete = (img.tagName === 'IMG' && img.complete),// || (img.tagName === 'VIDEO' && img.readyState > 2),
			imgD = imageBoard.images.list[idx],
			total = imageBoard.imgBrdVw.total,
			curr = imageBoard.imgBrdVw.curr,
			diff = (total + idx - curr)%total,
			next = (total + idx + diff)%total;
		if( isNext && img.tagName === 'VIDEO' )
			return;
		else if( !img.src )
			img.src = imgD[viewType + '-source'];
		if( (diff == 1 || diff == (total-1)) && total > 1 )
		{
			if( (img.tagName === 'IMG' && img.complete) || img.tagName === 'VIDEO' )
				loadImage( next, diff == 1 ? div.nextSibling : div.previousSibling, true );
			else{
				img.setAttribute('data-index-diff', (diff == 1 ? 1 : -1) );
				img.setAttribute('data-index-next', next );
				img.addEventListener('load', preloadImageEvent, false);
			}
		}
		if( img.tagName === 'VIDEO' && img.src )
			resumeVideo( idx, div, img );
	}
	function preloadImageEvent(event)
	{
		var t = this,
			p = t.parentNode,
			diff = t.getAttribute('data-index-diff'),
			next = t.getAttribute('data-index-next');
		if( diff == 1 )
			loadImage(next, p.nextSibling, true);
		else if( diff == -1 )
			loadImage(next, p.previousSibling, true);
		else
			loadImage(next);
		t.removeAttribute('data-index-diff');
		t.removeAttribute('data-index-next');
		setTimeout(function(){
			t.removeEventListener('load', preloadImageEvent, false);
		}, 100);
	}
	function getVideoElm( idx, div, img )
	{
		if( !img || img.tagName === 'VIDEO' )
		{
			div = div || document.querySelector('[data-image-index="' + idx + '"]');
			if( div.getAttribute('data-image-view-type') != 'vid_file' )
				return;
			img = div.querySelector('.vid_file');
		}
		return img;
	}
	function pauseVideo( idx, div, img )
	{
		img = getVideoElm( idx, div, img );
		if( !img )
			return;
		else if( img.paused )
			addClass( img, 'video-paused');
		else
			removeClass( img, 'video-paused');
		img.pause();
	}
	function resumeVideo( idx, div, img, forcePause )
	{
		img = getVideoElm( idx, div, img );
		if( !img )
			return;
		else if( forcePause || hasClass(img, 'video-paused') )
			img.pause();
		else
			img.play();
	}
	//------------------------------------------------------------------------------------//
	//---------------------------------- VIEWER-TAG-LIST ---------------------------------//
	function makeTagListHTML( idx )
	{
		var tagListDiv = document.querySelector('.viewer-tag-list');
		if( !tagListDiv )
		{
			console.error("[makeTagListHTML] can't find div");
			return;
		}
		var imgD = imageBoard.images.list[idx],
			tagList = imgD.tagList,
			tagClass = (tagList && tagList[0] || {'class': ''}).class,
			templ, html = '';
		if( tagClass === 'tag-type' )
			templ = '<li class="tag-type-';
		else if( tagClass === 'category' )
			templ = '<li class="category-';
		else
			templ = '<li class="empty-category';
		html = '<h4 style="color:#a0a0a0;">Tags</h4>';
		for( var i = 0, tagObj; i < tagList.length; ++i )
		{
			tagObj = tagList[i];
			html += templ + (tagObj.category !== null ? tagObj.category : '') + '">';
			html += makeTagHTML( tagObj );
			html += '</li>';
		}
		tagListDiv.innerHTML = html;
	}
	function makeTagHTML( tagObj )
	{
		var html = (tagObj.wiki ? '<a href="' + tagObj.wiki + '"> ? </a>' : '') + '' +
		'<a href="' + tagObj.href + '">' + tagObj.name + '</a>' +
		'<span class="post-count" style="color:#a0a0a0;"> ' + (!!tagObj.count ? tagObj.count : '') + ' </span>';
		return html;
	}
	//---------------------------------- VIEWER-TAG-LIST ---------------------------------//
	//------------------------------------------------------------------------------------//
	function historyChange( postURL )
	{
		this.href = this.href || window.location.href;
		if( postURL )
			window.history.replaceState(null, null, postURL);
		else
			window.history.replaceState(null, null, this.href);
	}
	function setViewerBottom( viewer, source, name )
	{
		var doc = document,
			prevElm = doc.querySelector('#' + viewer.prevId ),
			nextElm = doc.querySelector('#' + viewer.nextId ),
			sourceElm = doc.querySelector('#' + viewer.sourceId ),
			downloadElm = doc.querySelector('#' + viewer.downloadId ),
			useCtrl = userOptions.val('holdCtrl') || window.location.hostname.indexOf('donmai.us') != -1;
		prevElm.setAttribute('title', (useCtrl ? 'Ctrl+' : '') + 'Left');
		nextElm.setAttribute('title', (useCtrl ? 'Ctrl+' : '') + 'Right');
		sourceElm.setAttribute('title', source );
		downloadElm.setAttribute('title', name );
	}
	function handleViewerSwitchEvent(event)
	{
		if( imageBoard.viewer.isActive() )
		{
			imageBoard.viewer.deactivate();
		}else{
			imageBoard.viewer.activate();
		}
	}
	function handleViewerNavigationEvent(event)
	{
		var t = event.target,
			viewer, idx, total, imgD;
		if( !hasClass(t, this.getAttribute('data-class-button')) )
			return;
		viewer = imageBoard.imgBrdVw;
		if( !viewer )
			return;
		idx = viewer.curr;
		total = viewer.total;
		clog("[navigation] index: " + idx);
		clog("[navigation] total: " + total);
		idx = parseInt(idx, 10);
		total = parseInt(total, 10);
		if( t.id == this.getAttribute('data-prev-id') )
		{
			viewImage( (idx + total - 1)%total );
		}
		else if( t.id == this.getAttribute('data-next-id') )
		{
			viewImage( (idx + total + 1)%total );
		}
		else if( t.id == this.getAttribute('data-download-id') )
		{
			imgD = imageBoard.images.list[idx];
			downloadFile( imgD );
		}
		else if( t.id == this.getAttribute('data-source-id') )
		{
			imgD = imageBoard.images.list[idx];
			window.open( imgD.source );
		}
		else if( t.id == this.getAttribute('data-close-id') )
		{
			handleViewerSwitchEvent();
		}
	}
	//-------------------------------------- VIEWER-2 ------------------------------------//
	//------------------------------------------------------------------------------------//
	//------------------------------------- USER MENU ------------------------------------//
	function initUserMenu()
	{
		var retVal = {
			data: {
				'container-id': 'image-board-user-menu-container-' + RANDOM,
				'container-class': 'image-board-user-menu-container',
				'title-class': 'image-board-user-menu-title',
				'content-class': 'image-board-user-menu-content',
				'bottom-class': 'image-board-user-menu-bottom',
				'open-class': 'image-board-user-menu-open',
				'close-class': 'image-board-user-menu-close',
			},
			get containerId(){return this.data['container-id'];},
			get containerClass(){return this.data['container-class'];},
			get titleClass(){return this.data['title-class'];},
			get contentClass(){return this.data['content-class'];},
			get bottomClass(){return this.data['bottom-class'];},
			get openClass(){return this.data['open-class'];},
			get closeClass(){return this.data['close-class'];},
			init: function(id, doc){
				doc = doc || document;
				var div = doc.querySelector('div#' + id), btn;
				clog("div: ", div, id);
				if( !div )
				{
					console.error("[initUserMenu] can't find div#" + id);
					return;
				}
				var userMenuId = 'image-board-user-menu-id-' + RANDOM,
					userMenuActive = 'image-board-user-menu-button-active',
					userMenuBtn = div.querySelector('#' + userMenuId );
				if( !userMenuBtn )
				{
					btn = document.createElement('button');
					btn.setAttribute('id', userMenuId );
					for( var key in this.data )
						btn.setAttribute('data-' + key, this.data[key] );
					btn.setAttribute('title', 'Press \'Shift+M\' to open/close User Menu');
					btn.appendChild(document.createTextNode('User Menu'));
					userMenuBtn = div.insertBefore( btn, div.firstChild );
				}
				return div;
			},
		};
		return retVal;
	}
	function handleUserMenuEvent(event)
	{
		var dataSet = (this.dataset && this.dataset.containerId ? this.dataset : imageBoard.userMenu ),
			div = document.querySelector('#' + dataSet.containerId ),
			body = document.body, contentHtml, bottomHtml,
			html = '';
		if( !div )
		{
			contentHtml = makeUserMenuContentHtml();
			bottomHtml = makeUserMenuBottomHtml();
			div = document.createElement('div');
			div.setAttribute('id', dataSet.containerId);
			div.setAttribute('class', dataSet.containerClass);
			html = '' +
			'<div class="' + dataSet.titleClass + '">' +
				'<span>' + GM.info.script.name + ' v' + GM.info.script.version + '</span>' +
				'<span class="image-board-user-menu-x"></span>' +
			'</div>' +
			'<div class="' + dataSet.contentClass + '">' + contentHtml + '</div>' +
			'<div class="' + dataSet.bottomClass + '">' + bottomHtml + '</div>';
			div.insertAdjacentHTML('beforeend', html);
			div = body.appendChild(div);
			addClass( div, dataSet.closeClass );
			activateUserMenu();
		}
		if( hasClass(div, dataSet.openClass) )
		{
			closeUserMenu.call(this);
			imageBoard.imgBrdSt.userMenu = false;
		}
		else if( hasClass(div, dataSet.closeClass) )
		{
			openUserMenu.call(this);
			imageBoard.imgBrdSt.userMenu = true;
		}
	}
	function makeUserMenuContentHtml()
	{
		var typeList = ['checkbox', 'number', 'text'],
			longOptions = ['tagsOrder', 'ignoredTags'],
			html = '', key, dt, inp, labl, inputWidth, i, k, catName, keyList;
		html += '<div class="image-board-user-menu-tabs-navigation">';
		html += '<ul class="image-board-user-menu-tabs-list">';
		for( i = 0; i < userOptions.categoryList.length; ++i )
		{
			catName = userOptions.categoryList[i];
			html += '<li id="image-board-user-menu-tab-nav-' + catName.replace(/\s+/g, '-') + '" ' +
				'class="' + (catName === 'General' ? 'tab-nav-active' : '') + '"><span>' + catName + '</span></li>';
		}
		html += '</ul></div>';
		html += '<div class="image-board-user-menu-tabs-content">';
		for( i = 0; i < userOptions.categoryList.length; ++i )
		{
			catName = userOptions.categoryList[i];
			keyList = userOptions.category(catName);
			html += '<div id="image-board-user-menu-tab-' + catName.replace(/\s+/g, '-') + '" ' +
				'tab-selected="' + (catName === 'General' ? 'true' : 'false') + '">';
			for( k = 0; k < keyList.length; ++k )
			{
				key = keyList[k];
				dt = userOptions.data[key];
				if( typeList.indexOf(dt.type) == -1 )
					continue;
				inputWidth = (longOptions.indexOf(key) != -1 ? '200px' : '70px');
				inp = '<input id="image-board-user-menu-' + key + '-val" type="' + dt.type + '" ' +
					'style="' + (dt.type!=='checkbox' ? 'text-align: center; width: ' + inputWidth: '') + '"/>';
				labl = '<label id="image-board-user-menu-' + key + '-caption" ' + (key == 'holdCtrl' ? 'title="Hodor" ': '') + '' +
					'for="image-board-user-menu-' + key + '-val" style="cursor: pointer;">' + dt.getDesc() + '</label>';
				html += '<section class="image-board-user-menu-section">' +
					(dt.type === 'checkbox' ? inp + labl : labl + inp ) + '</section>';
			}
			html += '</div>';
		}
		html += '</div>';
		return html;
	}
	function getUserOptionsListOf( prop )
	{
		var propList = [], key, dt;
		for( key in userOptions.data )
		{
			dt = userOptions.data[key];
			if( propList.indexOf(dt[prop]) == -1 )
				propList.push(dt[prop]);
		}
		return propList;
	}
	function makeUserMenuBottomHtml()
	{
		this.btnList = this.btnList || {
			'reset': {
				html: 'Reset',
				title: 'Reset all options to default ones',
			},
			'remove': {
				html: 'Remove',
				title: 'Remove all saved options',
			},
			'save': {
				html: 'Save Settings',
				title: '',
			},
		};
		var key, val, html = '';
		for( key in this.btnList )
		{
			val = this.btnList[key];
			html += '<button id="image-board-user-menu-' + key + '-button" class="user-menu-button" ' +
			'title="' + val.title + '">' + val.html + '</button>';
		}
		return html;
	}
	function activateUserMenu()
	{
		var doc = document,
			active = 'image-board-user-menu-button-active',
			btn, key;
		var userMenuMethodsObj = {
			'save': saveUserMenu,
			'remove': removeUserMenu,
			'reset': resetUserMenu,
			'x': closeUserMenu,
			'tabs-navigation': tabsUserMenu,
		};
		for( key in userMenuMethodsObj )
		{
			btn = doc.querySelector('#image-board-user-menu-' + key + '-button');
			if( !btn )
				btn = doc.querySelector('.image-board-user-menu-' + key );
			if( btn && !btn.classList.contains(active) )
			{
				btn.addEventListener('click', userMenuMethodsObj[key], false );
				btn.classList.add(active);
			}
		}
	}
	function setUserMenu()
	{
		var doc = document,
			key, dt, valueElm, captionElm;
		for( key in userOptions.data )
		{
			dt = userOptions.data[key];
			valueElm = doc.querySelector('#image-board-user-menu-' + key + '-val');
			if( !valueElm )
				continue;
			else if( dt.type === 'checkbox' )
				valueElm.checked = dt.val;
			else if( dt.type === 'number' || dt.type === 'text' )
				valueElm.value = _toString_( dt.val, ', ' );
			captionElm = doc.querySelector('#image-board-user-menu-' + key + '-caption');
			if( captionElm )
				captionElm.textContent = dt.getDesc();
		}
	}
	function saveUserMenu()
	{
		var doc = document,
			key, dt, valueElm;
		for( key in userOptions.data )
		{
			dt = userOptions.data[key];
			valueElm = doc.querySelector('#image-board-user-menu-' + key + '-val');
			if( !valueElm )
				continue;
			else if( dt.type === 'checkbox' )
				userOptions.val(key, valueElm.checked );
			else if( dt.type === 'number' || dt.type === 'text' )
				userOptions.val( key, valueElm.value );
		}
		userOptions.saveData();
		closeUserMenu();
		renameImages();
		resetViewerSettings();
		showViewerProgressBar( userOptions.val('showProgress') );
	}
	function renameImages()
	{
		if( !imageBoard )
			return;
		try{
			var list = imageBoard.images.list,
				site = imageBoard.siteList.val();
			for( var i = 0, len = list.length; i < len; ++i )
				site.setImageDataName( list[i] );
		}catch(error){
			console.error(error);
		}
	}
	function resetViewerSettings()
	{
		if( !imageBoard )
			return;
		var viewer = imageBoard.imgBrdVw,
			container = document.querySelector('#' + viewer.containerId);
		if( userOptions.val('fixedThumbs') )
			addClass( container, 'viewer-thumb-list-fixed' );
		else
			removeClass( container, 'viewer-thumb-list-fixed' );
		if( userOptions.val('fixedTags') )
			addClass( container, 'viewer-tag-list-fixed' );
		else
			removeClass( container, 'viewer-tag-list-fixed' );
	}
	function removeUserMenu()
	{
		userOptions.removeData();
	}
	function resetUserMenu()
	{
		userOptions.setDefs();
		userOptions.saveData();
		setUserMenu();
		renameImages();
	}
	function closeUserMenu()
	{
		var dataSet = imageBoard.userMenu.data,
			userMenu = document.querySelector('#' + dataSet['container-id']);
		toggleClass( userMenu, dataSet['close-class'], dataSet['open-class'] );
		imageBoard.imgBrdSt.userMenu = false;
	}
	function openUserMenu()
	{
		var dataSet = imageBoard.userMenu.data,
			userMenu = document.querySelector('#' + dataSet['container-id']);
		toggleClass( userMenu, dataSet['open-class'], dataSet['close-class'] );
		setUserMenu();
		imageBoard.imgBrdSt.userMenu = true;
	}
	function tabsUserMenu(event)
	{
		var t = event.target, categoryName, tabsNav, tabs, activeTab, i;
		if( t.tagName === 'SPAN' )
			t = t.parentNode;
		if( t.tagName !== 'LI' )
			return;
		tabsNav = document.querySelectorAll('.image-board-user-menu-tabs-navigation li');
		tabs = document.querySelectorAll('div[tab-selected]');
		for( i = 0; i < tabs.length; ++i )
		{
			tabs[i].setAttribute('tab-selected', 'false');
			removeClass( tabsNav[i], 'tab-nav-active' );
		}
		categoryName = t.id.replace('image-board-user-menu-tab-nav-', '');
		activeTab = document.querySelector('#image-board-user-menu-tab-' + categoryName);
		if( !activeTab )
			return;
		activeTab.setAttribute('tab-selected', 'true');
		addClass(t, 'tab-nav-active');
	}
	//------------------------------------- USER MENU ------------------------------------//
	//------------------------------------------------------------------------------------//
	//------------------------------------ USER OPTIONS ----------------------------------//
	async function initOptions()
	{
		function _setDef(){this.val = this.def;}
		var tagsType = ['character', 'copyright', 'artist', 'species', 'model', 'idol', 'photo_set', 'circle', 'medium', 'metadata', 'general', 'faults'];
		var retVal = {
			data: {
				'autoRun': {
					val: null,
					def: true,
					type: 'checkbox',
					category: 'General',
					setDef: _setDef,
					getDesc: function(){return 'Initialize the Script on start';},
				},
				'createViewer': {
					val: null,
					def: true,
					type: 'checkbox',
					category: 'General',
					setDef: _setDef,
					getDesc: function(){return 'Add Image Viewer to ImageBoard';},
				},
				'downloadJPEG': {
					val: null,
					def: false,
					type: 'checkbox',
					category: 'General',
					setDef: _setDef,
					getDesc: function(){return 'Donwload jpeg instead of png (yande.re option)';},
				},
				'animateProgress': {
					val: null,
					def: true,
					type: 'checkbox',
					category: 'General',
					setDef: _setDef,
					getDesc: function(){return 'Animate initialization/downloading progress'; },
				},
				'maxTagsInName': {
					val: null,
					def: 10,
					type: 'number',
					category: 'Filename',
					setDef: _setDef,
					getDesc: function(){return 'Maximum tags in file name:';},
					validator: function( v ){
						return v > 3 && v < 100;
					},
				},
				'tagsOrder': {
					_val: null,
					set val(s){
						if( !this._val )
							this._val = [];
						if( typeof s === 'string' )
							s = s.split(/\s?\,\s?/i);
						else if( !s )
							s = tagsType
						this._val.length = 0;
						for( var i = 0; i < s.length; ++i )
							this._val.push(s[i].trim());
					},
					get val(){return this._val;},
					def: tagsType.join(','),
					type: 'text',
					category: 'Filename',
					setDef: _setDef,
					getDesc: function(){return 'Tags order in file name:';},
					validator: function(s){
						if( !s )
							return false;
						else if( typeof s === 'string' )
							s = s.trim().split(/\s?\,\s?/i);
						for( var i = 0, len = s.length; i < len; ++i )
						{
							if( tagsType.indexOf(s[i]) == -1 )
								return false;
						}
						return true;
					},
				},
				'ignoredTags': {
					_val: null,
					set val(s){
						if( !this._val )
							this._val = [];
						if( !s )
							s = [];
						else if( typeof s === 'string' )
							s = s.trim().split(',');
						this._val.length = 0;
						for( var i = 0; i < s.length; ++i )
							this._val.push(s[i].trim());
					},
					get val(){return this._val;},
					def: '',
					type: 'text',
					category: 'Filename',
					setDef: _setDef,
					getDesc: function(){return 'Ignored tag names:';},
				},
				'tagsDelim': {
					val: null,
					def: '-',
					type: 'text',
					category: 'Filename',
					setDef: _setDef,
					getDesc: function(){return 'Tags delimeter:';},
					validator: function(v){
						v = v.toString();
						return v.length > 0 && v.length < 5;
					},
				},
				'addImgBrdName': {
					val: null,
					def: true,
					type: 'checkbox',
					category: 'Filename',
					setDef: _setDef,
					getDesc: function(){return 'Add ImageBoard name to file name';},
				},
				'prefixedName': {
					val: null,
					def: false,
					type: 'checkbox',
					category: 'Filename',
					setDef: _setDef,
					getDesc: function(){return 'Prefixed ImageBoard name';},
				},
				'imgIdAtNameEnd': {
					val: null,
					def: true,
					type: 'checkbox',
					category: 'Filename',
					setDef: _setDef,
					getDesc: function(){return 'Image ID, and ImageBoard name at file name end';},
				},
				'viewOriginal': {
					val: null,
					def: false,
					type: 'checkbox',
					category: 'Viewer',
					setDef: _setDef,
					getDesc: function(){return 'View original images';},
				},
				'viewJPEG': {
					val: null,
					def: false,
					type: 'checkbox',
					category: 'Viewer',
					setDef: _setDef,
					getDesc: function(){return 'View jpeg image (yande.re option)';},
				},
				'viewFirst': {
					val: null,
					def: true,
					type: 'checkbox',
					category: 'Viewer',
					setDef: _setDef,
					getDesc: function(){return 'Load 1st image on viewer activation';},
				},
				'holdCtrl': {
					val: null,
					def: false,
					type: 'checkbox',
					category: 'Viewer',
					setDef: _setDef,
					getDesc: function(){return 'Hold Ctrl key to left/right navigate when viewing';},
				},
				'fixedTags': {
					val: null,
					def: true,
					type: 'checkbox',
					category: 'Viewer',
					setDef: _setDef,
					getDesc: function(){return 'Fix tag list';},
				},
				'fixedThumbs': {
					val: null,
					def: false,
					type: 'checkbox',
					category: 'Viewer',
					setDef: _setDef,
					getDesc: function(){return 'Fix thumb list';},
				},
				'showProgress': {
					val: null,
					def: true,
					type: 'checkbox',
					category: 'Viewer',
					setDef: _setDef,
					getDesc: function(){return 'Show progress/status bar';},
				},
			},
			get storageKey(){ return 'user-options-storage-key';},
			get categoryList()
			{
				var catList = [], key, opt;
				for( key in this.data )
				{
					opt = this.data[key];
					if( catList.indexOf(opt.category) == -1 )
						catList.push(opt.category);
				}
				Object.defineProperty(this, 'categoryList', {
					get: function(){return catList;},
					enumerable: true,
					configurable: true,
				});
				return catList;
			},
			category: function( categoryName )
			{
				if( this.keyList === undefined )
				{
					this.keyList = {};
					var opt, key, list, i, catName;
					for( i = 0; i < this.categoryList.length; ++i )
					{
						catName = this.categoryList[i];
						list = this.keyList[catName] = [];
						for( key in this.data )
						{
							opt = this.data[key];
							if( opt.category === catName )
								list.push(key);
						}
					}
					Object.defineProperty(this, 'category', {
						value: function(name)
						{
							if( this.categoryList.indexOf(name) == -1 )
								return null;
							return this.keyList[name];
						},
						enumerable: true,
						configurable: true,
					});
				}
				return this.keyList[categoryName];
			},
			val: function( opt, v )
			{
				if( this.data[opt] )
				{
					if( v !== undefined )
					{
						if( typeof this.data[opt].validator !== 'function' && v !== null )
							this.data[opt].val = v;
						else if( this.data[opt].validator(v) )
							this.data[opt].val = v;
					}
					return this.data[opt].val;
				}else
					return null;
			},
			fixStorage: async function(){
				/*
				// backward compatibility with v0.2.0 and older
				var oldKey = 'user-options-storage-key-1681238',
					objStr = await GM.getValue( oldKey, '' );
				if( objStr )
				{
					GM.deleteValue(oldKey);
					GM.setValue( this.storageKey, objStr );
				}
				// backward compatibility with v0.7.0 and older
				var obj = null;
				objStr = await GM.getValue(this.storageKey, '');
				if( objStr )
					obj = JSON.parse(objStr);
				if( obj && obj.viewSample !== undefined )
				{
					obj.viewOriginal = !obj.viewSample;
					delete obj.viewSample;
					GM.deleteValue(this.storageKey);
					GM.setValue(this.storageKey, JSON.stringify(obj));
				}
				*/
			},
			saveData: function(){
				var storageObj = {};
				for( var key in this.data )
					storageObj[key] = this.data[key].val;
				GM.setValue( this.storageKey, JSON.stringify(storageObj) );
			},
			removeData: function(){
				GM.deleteValue(this.storageKey);
			},
			loadData: async function(){
				var storageObj = await GM.getValue(this.storageKey, null), v;
				if( storageObj )
					storageObj = JSON.parse(storageObj);
				else
					storageObj = {};
				for( var key in this.data )
				{
					v = storageObj[key];
					if( v !== undefined )
						this.val( key, v );
					else
						this.data[key].setDef();
				}
				this.saveData();
			},
			setDefs: function(){
				for( var key in this.data )
					this.data[key].setDef();
				this.saveData();
			},
			init: async function(){
				startInfo();
				await this.fixStorage();
				await this.loadData();
			},
		};
		await retVal.init();
		return retVal;
	}
	//------------------------------------ USER OPTIONS ----------------------------------//
	//------------------------------------------------------------------------------------//
	async function startInfo()
	{
		try{
		var toOpen = await GM.getValue('to-open', true );
		consoleLog("to-open: ", toOpen);
		if( !toOpen )
			return;
		var div = document.createElement('div'),
			div2 = document.createElement('div'),
			body = document.body || document.querySelector('body'),
			html;
		html = '' +
		'<div class="info-wnd-inner-div">' +
		'<div class="info-content">' +
			'<div class="info-text">' +
				'This is SFW version of my <b>' + GM.info.script.name.slice(0, -4) + '</b> script'+
				'<br>' +
				'Visit ' +
				'<a target="_blank" href="https://sleazyfork.org/scripts/34175/">' +
					'https://sleazyfork.org/scripts/34175/' +
				'</a> ' +
				'<br>' +
				'to install Full version (Adult + SFW)' +
				'<br>' +
				'Or click on the "Install" button' +
			'</div>' +
		'</div>' +
		'<div class="info-bottom">' +
			'<div class="info-buttons">' +
				'<button class="info-close-once">Close</button>' +
				'<button class="info-close">Don\'t show again</button>' +
				'<button class="info-install-full" title="https://sleazyfork.org/scripts/34175/code/script.user.js">Install</button>' +
			'</div>' +
		'</div>' +
		'</div>';
		div.classList.add('info-wnd-modal');
		div.setAttribute('title', 'Close');
		div2.classList.add('info-wnd');
		div2.innerHTML = html;
		body.appendChild(div);
		body.appendChild(div2);
		div.addEventListener('click', function(event){
			hide( document.querySelectorAll('.info-wnd-modal, .info-wnd') );
		}, false);
		div2.addEventListener('click', function(event){
			var t = event.target;
			if( t.tagName !== 'BUTTON' )
				return;
			else if( t.classList.contains('info-close') )
			{
				GM.setValue('to-open', false);
			}
			else if( t.classList.contains('info-install-full') )
			{
				GM.setValue('to-open', false);
				var a = document.createElement('a'),
					body = document.body || document.querySelector('body');
				a.href = "https://sleazyfork.org/scripts/34175/code/script.user.js";
				body.appendChild(a);
				a.click();
				body.removeChild(a);
			}
			hide( document.querySelectorAll('.info-wnd-modal, .info-wnd') );
		}, false);
		addCssClass(`
			.info-wnd-modal {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				opacity: 0.9;
				z-index: 1001000;
				cursor: pointer;
			}
			.info-wnd-modal,
			.info-wnd div {
				background: #000;
			}
			.info-wnd {
				position: fixed;
				bottom: 10px;
				right: 10px;
				width: 50%;
				height: 50%;
				z-index: 1001001;
				overflow: auto;
				max-height: 150px;
				max-width: 500px;
				border-radius: 3px;
			}
			.info-wnd-inner-div {
				position: relative;
				top: 0;
				left: 0;
				min-width: 400px;
				min-height: 140px;
				width: 100%;
				height: 100%;
			}
			.info-wnd .info-content {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 30px;
				left: 0px;
				text-align: center;
			}
			.info-wnd .info-bottom {
				position: absolute;
				bottom: 0px;
				width: 100%;
				height: 30px;
				text-align: center;
			}
			.info-content > .info-text {
				position: relative;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				color: #808080;
				margin: 10px 0;
			}
			.info-bottom > .info-buttons {
				position: absolute;
				top: 0;
				left: 0;
				height: 100%;
				width: 100%;
			}
			.info-buttons > button {
				margin: 1px 2px;
				padding: 4px 6px;
				color: #a0a0a0;
				font-weight: bold;
				border: 0;
				border-radius: 2px;
				background: #101010;
				cursor: pointer;
			}
			.info-buttons > button:hover {
				background: #a0a0a0;
				color: #101010;
			}
		`, 'info-wnd-css');
		}catch(err){console.error(err);}
	}
	function newCssClasses()
	{
		generalCssClass();
		userMenuCssClass();
		imageViewerCssClass();
		progressBarCssClass();
	}
	function generalCssClass()
	{
		var id = 'general-css-' + RANDOM;
		addCssClass(`
			#image-board-div-${RANDOM} {
				text-align: right;
				position: relative;
			}
			#image-board-user-menu-container-${RANDOM} button,
			#image-board-div-${RANDOM} button {
				margin: 3px 10px;
				color: ${imageBoard.siteList.style().color};
				font-weight: bold;
				width: 180px;
				border: 0px;
				padding: 5px;
				background: ${imageBoard.siteList.style().background};
				cursor: pointer;
			}
			.image-board-viewer-bottom-class button:hover ,
			#image-board-user-menu-container-${RANDOM} button:hover ,
			#image-board-div-${RANDOM} button:hover {
				background: ${imageBoard.siteList.style().backgroundHover};
				color: ${imageBoard.siteList.style().colorHover};
			}
			div.image-board-viewer-on ,
			.image-board-user-menu-open {
				display: initial;
			}
			div.image-board-viewer-off ,
			.image-board-user-menu-close {
				display: none;
			}
			.image-board-downloader-off::after {
				content: " [off]";
			}
			.image-board-downloader-on::after {
				content: " [on]";
			}
			button.image-board-viewer-off::after {
				content: " [+]";
			}
			button.image-board-viewer-on::after {
				content: " [\u2013]";
			}
			.image-board-active-for-view,
			.image-board-active-for-download {
				cursor: default;
			}
		`, id);
	}
	function userMenuCssClass()
	{
		var id = 'user-menu-css-' + RANDOM;
		addCssClass(`
			.image-board-user-menu-title,
			#image-board-user-menu-container-${RANDOM} {
				border-top-left-radius: 5px;
				border-top-right-radius: 5px;
			}
			.image-board-user-menu-bottom,
			#image-board-user-menu-container-${RANDOM} {
				border-bottom-left-radius: 5px;
				border-bottom-right-radius: 5px;
			}
			#image-board-user-menu-container-${RANDOM} {
				position: fixed;
				bottom: 10px;
				right: 10px;
				z-index: 100200;
				background-color: #e7e7e7;
				width: 40%;
				height: 40%;
			}
			div.image-board-user-menu-title {
				font-weight: bold;
				line-height: 30px;
				color: ${imageBoard.siteList.style().color};
				background-color: ${imageBoard.siteList.style().background};
				position: absolute;
				width: 100%;
				height: 30px;
			}
			div.image-board-user-menu-title > span {
				padding-left: 8px;
			}
			.image-board-user-menu-x::after,
			.image-board-user-menu-x::before {
				content: "";
				position: absolute;
				width: 2px;
				height: 1.5em;
				background: ${imageBoard.siteList.style().color} !important;
				display: block;
				transform: rotate(45deg);
				left: 50%;
				margin: -1px 0 0 -1px;
				top: 0;
			}
			.image-board-user-menu-x::before {
				transform: rotate(-45deg);
			}
			.image-board-user-menu-x:hover::after,
			.image-board-user-menu-x:hover::before {
				background: ${imageBoard.siteList.style().colorHover} !important;
			}
			.image-board-user-menu-x:hover {
				background: ${imageBoard.siteList.style().backgroundHover};
			}
			.image-board-user-menu-x {
				position: absolute;
				width: 1.3em;
				height: 1.3em;
				cursor: pointer;
				top: 8px;
				right: 1px;
			}
			div.image-board-user-menu-content {
				background-color: #eeeeee;
				overflow-x: auto;
				overflow-y: hidden;
				position: absolute;
				top: 30px;
				right: 0px;
				bottom: 30px;
				left: 0px;
			}
			div.image-board-user-menu-content label {
				font-family: verdana, sans-serif;
				font-weight: initial;
				font-size: 12px;
				color: #7d7d7d !important;
				line-height: 30px;
				display: initial !important;
				white-space: initial !important;
			}
			.image-board-user-menu-content label {
				padding: 0 3px;
			}
			.image-board-user-menu-tabs-navigation {
				position: absolute;
				left: 0;
				width: 100px;
				height: 100%;
				overflow-y: auto;
				background-color: #e0e0e0;
			}
			.image-board-user-menu-tabs-navigation ul {
				padding: 0;
			}
			.image-board-user-menu-tabs-navigation li {
				list-style-type: none;
				color: #7d7d7d !important;
				height: 30px;
				line-height: 30px;
				padding-left: 10px;
				margin: 0;
				cursor: pointer;
			}
			.image-board-user-menu-tabs-navigation li:hover ,
			.image-board-user-menu-tabs-navigation li.tab-nav-active {
				background-color: #d0d0d0;
			}
			.image-board-user-menu-tabs-navigation li.tab-nav-active {
				font-weight: bold;
			}
			div.image-board-user-menu-tabs-content {
				position: absolute;
				left: 100px;
				right: 0;
				padding-left: 10px;
				overflow-y: auto;
				min-width: 240px;
				height: 100%;
			}
			div.image-board-user-menu-tabs-content div {
				display: none;
			}
			div.image-board-user-menu-tabs-content div[tab-selected="true"] {
				display: initial;
			}
			.image-board-user-menu-bottom {
				/*text-align: right;*/
				background-color: ${imageBoard.siteList.style().background};
				position: absolute;
				bottom: 0px;
				width: 100%;
				height: 30px;
			}
			#image-board-user-menu-reset-button {
				left: 10px;
			}
			#image-board-user-menu-save-button {
				position: absolute;
				right: 10px;
			}
			#image-board-user-menu-container-${RANDOM} button {
				width: initial;
				margin: 1px 2px;
				padding: 4px 6px;
		`, id);
	}
	function imageViewerCssClass()
	{
		var id = 'image-viewer-css-' + RANDOM,
			col = '#000';
		addCssClass(`
			.image-board-viewer-container {
				position: fixed;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				z-index: 100100;
				background-color: ${col};
			}
			button.image-board-viewer-btn {
				cursor: pointer;
			}
			.viewer-tag-list li {
				list-style-type: none;
				line-height: 1.8em;
				display: block;
				padding-left: 4px;
			}
			.viewer-thumb-div,
			.viewer-tag-list * {
				background-color: #303030;
			}
			.viewer-tag-list li.category-0 a,
			.viewer-tag-list li.tag-type-general a,
			.viewer-tag-list li.empty-category a {
				color: #337ab7;
			}
			div.viewer-tag-list-fixed > div.viewer-tag-list {
				opacity: 1;
				left: 0;
			}
			div.viewer-tag-list-fixed > div.viewer-img-list {
				left: 200px;
			}
			.viewer-tag-list:hover {
				opacity: 1;
				left: 0;
			}
			.viewer-tag-list:hover + * + .viewer-img-list {
				left: 200px;
			}
			.viewer-tag-list {
				position: absolute;
				width: 200px;
				min-width: 50px;
				top: 0;
				left: -170px;
				overflow-y: auto;
				height: 100%;
				/*padding: 3px 10px;*/
				background-color: #303030;
				opacity: 0.2;
				transition: all 0.75s;
			}
			div.viewer-thumb-list-fixed > div.viewer-thumb-list {
				opacity: 1;
				right: 0;
			}
			div.viewer-thumb-list-fixed > div.viewer-img-list {
				right: 200px;
			}
			.viewer-thumb-list:hover {
				opacity: 1;
				right: 0;
			}
			.viewer-thumb-list {
				position: absolute;
				width: 200px;
				min-width: 50px;
				top: 0;
				right: -170px;
				opacity: 0.2;
				overflow-y: auto;
				height: 100%;
				background-color: #303030;
				text-align: right;
				transition: all 0.75s;
			}
			.viewer-thumb-div {
				max-width: 200px;
				padding: 2px 1px 2px 0;
			}
			.viewer-thumb {
				max-width: 180px;
				/*max-height: 240px;*/
			}
			.viewer-thumb-list:hover + .viewer-img-list {
				right: 200px;
			}
			.viewer-img-list {
				position: absolute;
				top: 0;
				left: 30px;
				right: 30px;
				bottom: 5px;
				transition: all 0.75s;
			}
			.viewer-img-list > .viewer-img-div:not(.img-show) ,
			div[data-image-view-type="none_src"],
			div[data-image-view-type="vid_file"] > *:not(.vid_file) ,
			div[data-image-view-type="orig_img"] > *:not(.orig_img) ,
			div[data-image-view-type="jpeg_img"] > *:not(.jpeg_img) ,
			div[data-image-view-type="samp_img"] > *:not(.samp_img) {
				display: none;
			}
			.viewer-img-div.img-show {
				width: 100%;
				height: 100%;
				text-align: center;
				background-color: ${col};
			}
			.viewer-img-div > * {
				max-width: 100%;
				max-height: 100%;
			}
			.viewer-img-div:before {
				content: "";
				display: inline-block;
				height: 100%;
				vertical-align: middle;
			}
			.viewer-bottom:hover {
				opacity: 1;
			}
			.viewer-bottom {
				transition: all 0.5s;
				opacity: 0.2;
				background-color: ${col};
			}
			.image-board-viewer-bottom-class {
				position: absolute;
				left: 200px;
				right: 200px;
				bottom: 0px;
				text-align: center;
			}
			.image-board-viewer-bottom-class button {
				color: ${imageBoard.siteList.style().color};
				background-color: #303030;/*${imageBoard.siteList.style().background};*/
				cursor: initial;
				margin: 1px 1px 3px 1px;
				padding: 1px 5px;
				border: 0;
				font-weight: bold;
			}
		`, id);
	}
	function progressBarCssClass()
	{
		var id = 'progress-bar-css-' + RANDOM;
		addCssClass(`
			@-webkit-keyframes progression{
				from{background-position:0px 0px;}
				to{background-position:50px 0px;}
			}
			@-o-keyframes progression{
				from{background-position:0px 0px;}
				to{background-position:50px 0px;}
			}
			@keyframes progression{
				from{background-position:0px 0px;}
				to{background-position:50px 0px;}
			}
			.progress-bar div.progress-counted {
				background-color: #da504e;
				width: 100%;
			}
			.progress-bar div.image-ready {
				background-color: #fda02e;
			}
			div.progress-bar > div.progress-complete {
				background-color: #5db75d;
			}
			div.progress-stripe {
				background-image:-webkit-linear-gradient(-45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);
				background-image:-o-linear-gradient(-45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);
				background-image:linear-gradient(-45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent);
				background-size: 50px 50px;
				height: 12px;
			}
			div.progress-bar{
				margin: 2px 2px 0px 0px;
			}
			.progress-bar > div.download-in-progress {
				background-color: #0773fb;
			}
			div.progress-animated {
				animation: progression 2s linear infinite;
			}
		`, id);
	}
	function addCssClass(cssClass, id)
	{
		var style = document.createElement('style'),
			head = document.querySelector('head');
		style.type = 'text/css';
		if( id )
			style.setAttribute('id', id);
		if( style.styleSheets )
			style.styleSheets.cssText = cssClass;
		else
			style.appendChild(document.createTextNode(cssClass));
		return head.appendChild(style);
	}
	function resetCssClass(cssClass, id)
	{
		var style = document.getElementById(id);
		if( style && style.type === 'text/css' )
			remove( style );
		addCssClass(cssClass, id);
	}
	function attr( elm, name, val )
	{
		var cond = (val === null || val === undefined);
		if( !elm || !name )
			return;
		if( cond )
		{
			if( elm.length === undefined )
				return elm.getAttribute(name);
			return null;
		}
		else if( elm.length > 0 )
			[].forEach.call(elm, function(it){it.setAttribute(name, val);});
		else
			elm.setAttribute(name, val);
	}
	function addClass( elm, name )
	{
		if( elm && name )
		{
			if( elm.length > 0 )
				[].forEach.call(elm, function(it){it.classList.add(name);});
			else
				elm.classList.add(name);
		}
	}
	function removeClass( elm, name )
	{
		if( elm && name )
		{
			if( elm.length > 0 )
				[].forEach.call(elm, function(it){it.classList.remove(name);});
			else
				elm.classList.remove(name);
		}
	}
	function hasClass( elm, name )
	{
		if( elm && name )
			return elm.classList.contains(name);
		return false;
	}
	function toggleClass( elm, newClass, oldClass )
	{
		if( !elm || !newClass )
			return;
		if( oldClass )
		{
			elm.classList.remove(oldClass);
			elm.classList.add(newClass);
		}
		else if( elm.classList.contains(newClass) )
			elm.classList.remove(newClass);
		else
			elm.classList.add(newClass);
	}
	function getLocation( url, attr )
	{
		if( !url || !attr )
			return null;
		this.link = this.link || document.createElement('a');
		this.link.href = url;
		return this.link[attr];
	}
	function getFileExt( source )
	{
		var ext = source ? getLocation( source, 'pathname' ) : null;
		ext = ext ? ext.match(/\.([^\.]+)$/) : null;
		ext = ext ? ext[1] : null;
		return ext;
	}
	function getSearchObject( search )
	{
		var keys = {};
		if( search )
		{
			search = search.replace(/^\?/, '');
			search.split('&').forEach(function(item){
				item = item.split('=');
				keys[item[0]] = item[1];
			});
		}
		return keys;
	}
	function isSameLink( lhs, rhs )
	{
		lhs = getLocation(lhs, 'href');
		rhs = getLocation(rhs, 'href');
		return lhs === rhs;
	}
	function last( arr )
	{
		if( arr && arr.length > 0 )
			return arr[arr.length-1];
		return null;
	}
	function copy( arr, v )
	{
		arr = arr || [];
		if( v && v.length !== undefined )
		{
			arr.length = 0;
			for( var i = 0, len = v.length; i < len; ++i )
				arr.push(v[i]);
		}
		return arr;
	}
	function _toString_( obj, delim )
	{
		if( typeof obj === 'string' )
			return obj;
		else if( obj && obj.length !== undefined )
			try{
				return obj.join( delim || ', ' );
			}catch(e){
				return obj.toString();
			}
		else if( obj )
			return obj.toString();
		return '';
	}
	function nodeWalk()
	{
		var len = arguments.length, obj = this, i, arg;
		for( i = 0; i < len; ++i )
		{
			arg = arguments[i];
			if( arg === undefined )
				return obj;
			else if( obj[arg] === undefined )
				return null;
			obj = obj[arg];
		}
		return obj;
	}
	function hide( elm )
	{
		if( !elm )
			return;
		else if( elm.length === undefined )
			elm.style.display = 'none';
		else{
			for( var i = 0, len = elm.length; i < len; ++i )
				elm[i].style.display = 'none';
		}
	}
	function show( elm )
	{
		if( elm )
			elm.style.display = '';
	}
	function remove( elm )
	{
		if( elm && elm.parentNode )
			return elm.parentNode.removeChild(elm);
		return null;
	}
	function parent( elm, n )
	{
		if( !elm || n === null || n === undefined )
			return elm;
		else if( /^\d+$/.test(n.toString()) )
		{
			n = parseInt(n, 10);
			for( var i = 0; i < n && elm; ++i )
				elm = elm.parentNode;
		}
		else if( typeof n === 'string' )
		{
			n = n.toUpperCase();
			while( elm && elm.tagName !== n )
				elm = elm.parentNode;
		}
		return elm;
	}
})();