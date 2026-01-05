// ==UserScript==
// @name        kinopoisk.ru and other downloader
// @name:ru     Получение ссылок на изображения с kinopoisk.ru и других сайтов
// @namespace   kinopoisk_and_other
// @description Download from kinopoisk.ru, filmz.ru, celeber.ru and some theme of tumblr.com.
// @description:ru Получает ссылки на изображения на сайтах: kinopoisk.ru, filmz.ru, celeber.ru и некоторых темах tumblr.com.
// @author      Heinrich Schweinsteiger
// @include     htt*://www.kinopoisk.ru/*/posters/
// @include     htt*://www.kinopoisk.ru/*/fanart/
// @include     htt*://www.kinopoisk.ru/*/stills/
// @include     htt*://www.kinopoisk.ru/*/shooting/
// @include     htt*://www.kinopoisk.ru/*/promo/
// @include     htt*://www.kinopoisk.ru/*/concept/
// @include     htt*://www.kinopoisk.ru/*/covers/
// @include     http://www.filmz.ru/photos/*
// @include     http://www.celeber.ru/browse/*
// @include     http://www.celeber.ru/photo/*
// @include     htt*.tumblr.com/*
// @include     http://thecrossfit.es/
// @exclude     htt*.tumblr.com*iframe*
// @exclude     htt*.tumblr.com*analytics.html*
// @exclude     htt*.tumblr.com*yahoo_cookie_receiver.html*
// @exclude     htt*.tumblr.com/uncacheable/*
// @include     http://greatmusclebodies.com/*
// @version     0.0.9
// @license GPL
// @grant       GM_xmlhttpRequest
// @run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/21546/kinopoiskru%20and%20other%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/21546/kinopoiskru%20and%20other%20downloader.meta.js
// ==/UserScript==

var DEBUG_MODE = true;

function DebugLog(text)
{
	if (DEBUG_MODE)
	{
		console.log(text);
	}
}

var baseRipper = {
	isChrome : /chrome/i.test(navigator.userAgent),
	isFireFox : /firefox/i.test(navigator.userAgent),
	abortLinkGrabbing: false,	// flag to abort link grabbing

	pages : {
		//recurse var used for thumbnail pages mainly. if set to 0 and button
		//clicked on single page it doesn't really do anything useful.
		recurse: true,     // recuse into lower gallery pages
		current: 0,        // current counter reused for image and gallery parsing
		totalPagesForDown: 0,		// total counter used for image parsing
		//directlyAddedImages: 0,		// 
		hasFailedPage : false,
		URLs: [],          // ссылки для скачивания изображений, создаем из экзмепляров URLTemplate holder for url html list
		//1 содержит galleryIndex, 2 ссылку
		URLTemplate: function (url, decription) {
			this.URL = url;
			if (!decription)
				this.Decription = url.split('/').pop();
			else
				this.Decription	= decription;
		},
		toParse: [], // список ссылок на страницы из которых надо выудить ссылки на скачивание list of urls of single image pages that need to be parsed for DDL
		//toParseSecond: [],
		//textbox: null,     // textbox holder
		fetchStatus: 0,     // status id for script checking status:
							// 0 = not started
							// 1 = getting indexes
							// 2 = getting image DDL
							// 3 = finished everything
							// 4 = displayed urls (finished or aborted)
        /*fetchStatus : {
            NotStarted: 0,
            GettingIndexes: 1,
            GettingImageDDL: 2,
        }*/
        
        AddURL : function (href, desc) {
            //debugger;
            /*if (URLs.some(function(u) u.URL == href)) {
                // URLs contains the element we're looking for 
            }*/
            for(var i = 0; i < this.URLs.length; i++) {
                if (this.URLs[i].URL == href) {
                    //debugger;
                    DebugLog('AddURL(): URLs already contain ' + href);
                    if (!this.URLs[i].Decription && desc) {
                        DebugLog('AddURL(): Add decription (' + desc + ') to ' + href);
                    }
                    return;
                }
            }
            DebugLog('AddURL(): Add ' + href);
            this.URLs.push(new this.URLTemplate(href, desc));
        }
	},
	//добавление в HandleOnClick
	//удаление в checkers.NextGallery
	GalleryPages: [], // массив ссылкок на страницы с эскизами, list of urls to thumbnail pages needed to fetch
	GalleryData: {},// holds thumbnail image target info (GalleryTemplate)
	GalleryTemplate: function () {
		this.isFetched 	= false;	// if page was fetched set during ScanFirstLevel
		this.Failed		= null;		// flag if page failed to find a image link
		this.error		= '';		// error value to show on list
		this.url 		= null;		// url of image page set during ScanGallery
		this.id 		= null;		// id of image set during ScanFirstLevel
		this.ddl		= null;		// ddl link to image file set by ScanFirstLevel
		//this.title		= null;		// title of the image for failure display
		this.description		= null;
		this.xhttp		= null;		// xHttpRequest result holder
	},
	
	URLbox: document.createElement('div'),
	//tableFailed: document.createElement('table'),
	tableFailed: document.createElement('div'),

	httpCounter: {
		MAXREQ:  4, //количество потоков скачки
		runCon:  0, //running connections
		interval: null //хранит ссылку на функцию интервала, которая по времени запускает переданную функцию
	}, // end httpCounter
	
	sleepTime : 2000, //сколько времени спать при получение ошибки 503. The server is currently unavailable
	
	//levelForURLScaning : 1, //уровень с которого будем получать ссылки, если стоит 2 значит будет запускаться ScanSecondLevel()
	
	_this : undefined,
	
    /*
	 * init()
	 * 
	 * Called as first function execution upon script load.
	 * Sets up the xmlHttpRequest helpers and generates click button.
	 */
	init : function () {
		DebugLog("init() isChrome: " + this.isChrome + ", isFireFox: " + this.isFireFox);
		//if (pages.isChrome) pages.Get_URL_CB = GM_Get_URL_CB;
		//if (baseRipper.isFireFox === true) { baseRipper.Get_URL_CB = baseRipper.GM_Get_URL_CB; }

		_this = this;

		this.btn.btnID = this.btn.GenerateButton(this);
	},

	btn: {			// button holder
		btnID : null,
		// creates the click button for our page
		GenerateButton : function (base) {
			DebugLog('GenerateButton()');
			var new_button;
			var btnLoc;

			//debugger;
			//base.tableFailed.innerHTML = '<table width="97%"><tr><td>http://media.filmz.ru/photos/full/filmz.ru_f_226002.jpg Not Loaded</td></tr></table>';
			//base.tableFailed.style.background = "red";
			base.tableFailed.style.display = 'none';
			document.body.insertBefore(base.tableFailed, document.body.firstChild);

			/*base.URLbox.style.overflow = "auto";
			//base.URLbox.style.overflow = "visible";
			base.URLbox.style.height = "100px";
			base.URLbox.style.width = "97%";
            //base.URLbox.style.zIndex = 1;
            base.URLbox.style.background = "white";
            base.URLbox.innerHTML = '<table width="97%"><tr><td><a title="Марго Робби Title" href="http://media.filmz.ru/photos/full/filmz.ru_f_226002.jpg">Марго Робби</a></td></tr></table>';
            //urlLoc = document.querySelector('#top');
            //document.body.insertBefore(base.URLbox, urlLoc);*/
            
			base.URLbox.style.display = 'none';
			document.body.insertBefore(base.URLbox, document.body.firstChild);

			new_button = document.createElement('input');
			new_button.type = 'button';
			new_button.value = 'Get URLs for Gallery';
			new_button.setAttribute('onsubmit', 'return false;');
			//new_button.addEventListener('click', this.btn.debugToggleCheck, false);
			
			/*
			 * use individual selector OR's to get target by preference instead of first
			 * dom object availability
			 *
			 * alternate: btnLoc = document.querySelector('#gmi-ResViewContainer, #gmi-GalleryEditor, #output');
			 */
			btnLoc = base.parsers.GetButtonLocation();
			
			if (btnLoc) {
				btnLoc.insertBefore(new_button, btnLoc.firstChild);
				new_button.addEventListener('click', base.HandleOnClick, false);
			}
			else {
				new_button.value = 'Root Thumbnail Page?';
				document.body.insertBefore(new_button, document.body.firstChild);
			}
			
			// Disable button on base domain if using chrome due to same origin complications
			/* DA seems to have changed server settings to fix same origin
			 * issues from www.deviantart.com and other subdomains commented
			 * for testing. will re-enable if problems show up.
			 * actually seems to have been Chrome whose behavior changed. If script is loaded
			 * as an extension it is allowed to violate same origin rules. If pasted into the
			 * developer console it errors out same origin failures.
			 if (document.location.hostname === 'www.deviantart.com' && pages.isChrome === true) {
				new_button.value = 'Script will fail on root www.deviantart.com';
				new_button.disabled = true;
			}
			*/
			DebugLog('GenerateButton(): Created Button:');
			DebugLog(new_button);
			return new_button;
		}, // end GenerateButton
	}, // end btn
    
	 /*Основной цикл сбора ссылок, запускается по нажатию на кнопку
	 * 
	 * onclick function triggered when the
	 * button we injected is clicked to get
	 * our direct links.
	 */
	HandleOnClick : function (eventID) {
		var galleryLink = document;
		var a_gallery; //страницы со ссылками найденные на странице
        DebugLog('HandleOnClick()');
		//debugger;
        _this.btn.btnID.removeEventListener('click', _this.HandleOnClick, false);
		_this.btn.btnID.addEventListener('click', _this.AbortLinkChecking, false);
		if (_this.checkers.isThumbnailGallery(galleryLink)) {
			galleryLink = document.location.href;
		}
		else {
			DebugLog('HandleOnClick(): Current page is not a gallery.');
			/*DebugLog('HandleOnClick(): Current page is not a gallery trying to find it.');
			galleryLink = this.parsers.GetLinkOnNextGalleryPage();
			DebugLog(galleryLink);*/
		}
		_this.GalleryPages.push(galleryLink);
		DebugLog("HandleOnClick(): Gallery link found: " + _this.GalleryPages);
		_this.pages.fetchStatus = 1;
		//запускаем получение ссылок со страниц галерей
		_this.httpCounter.interval = setInterval(_this.intervalFunc.LoadGalleries, 50);
	}, // end HandleOnClick
	
	// button click abort function
	AbortLinkChecking : function (eventID)
	{
        //debugger;
		_this.abortLinkGrabbing = true;
		DebugLog('AbortLinkChecking(): FetchStatus: ' + _this.pages.fetchStatus + ", runCon: " + _this.httpCounter.runCon + ', httpCounter.interval=' + _this.httpCounter.interval);
		_this.btn.btnID.removeEventListener('click', _this.AbortLinkChecking, false);
		_this.btn.btnID.value = 'Aborted: ' + _this.btn.btnID.value;
        //clearInterval(_this.httpCounter.interval);
        
		/*if (_this.pages.fetchStatus === 1) {
            if (_this.httpCounter.runCon === 0) {
                debugger;
                _this.StartLoadImages();
            }
		}
        else*/if (_this.pages.fetchStatus > 1) {
            clearInterval(_this.httpCounter.interval);
            DebugLog("AbortLinkChecking(): clearInterval, httpCounter.interval=" + _this.httpCounter.interval);
            if (_this.pages.URLs.length > 0) 
                _this.DoneDisplayUrlList();
            else 
                DebugLog('AbortLinkChecking(): Nothing to show.');
        }

		//_this.GalleryPages = [];
		//_this.pages.toParse = [];
	}, // end AbortLinkChecking
	
    StartLoadImages: function () {
        //debugger;
        DebugLog('StartLoadImages():');
        clearInterval(_this.httpCounter.interval);
        _this.abortLinkGrabbing = false;
        _this.httpCounter.runCon = 0;
        _this.btn.btnID.value = 'Finished loading galleries (' + _this.pages.current + ')';
        _this.pages.current = 0;
        _this.pages.fetchStatus = 2;
        DebugLog('StartLoadImages(): pages.toParse.length = ' + _this.pages.toParse.length);
        _this.btn.btnID.addEventListener('click', _this.AbortLinkChecking, false);
        _this.httpCounter.interval = setInterval(_this.intervalFunc.LoadImages, 50);
    },
    
	//функции которые запускаются в setInterval
	intervalFunc : {
		// heartbeat while loading galleries (страница с несколькими изображениями)
		LoadGalleries : function () {
            DebugLog("LoadGalleries(): isAborted: " + _this.checkers.isAborted() + ", fetchStatus: " + _this.pages.fetchStatus + ", runCon: " + _this.httpCounter.runCon);
            //debugger;
            //if (_this.checkers.isAborted() && _this.pages.fetchStatus === 1 && _this.httpCounter.runCon === 0) {
            if (_this.checkers.isAborted() && _this.pages.fetchStatus === 1) {
                //debugger;
                if (_this.httpCounter.runCon === 0)
                    _this.StartLoadImages();
            }
            //else 
            {
                if ((_this.httpCounter.runCon < _this.httpCounter.MAXREQ) && (_this.GalleryPages.length)) {
                    DebugLog("LoadGalleries():" + 
                             ' GalleryPages.length=' + _this.GalleryPages.length +
                             ', running connections: (' + _this.httpCounter.runCon + ')' +
                             ', max running (' + _this.httpCounter.MAXREQ + ')');
                    DebugLog('Получение ссылок на изображения с загруженного списка галерей');

                    //скачка галерей
                    _this.checkers.NextGallery();
                }

                //все галлереи загружены, запускаем скачку изображений
                if ((_this.GalleryPages.length === 0) && (_this.httpCounter.runCon === 0)) 
                {
                    DebugLog('LoadGalleries(): все галлереи загружены, запускаем скачку изображений');
                    //Останавливаем таймер pages.xmlHttp_Counter.interval = LoadGalleries
                    DebugLog('LoadGalleries(): Stopping heartbeat out of galleries to check.');
                    clearInterval(_this.httpCounter.interval);
                    _this.btn.btnID.value = 'Finished loading galleries (' + _this.pages.current + ')';
                    _this.pages.current = 0;
                    _this.pages.fetchStatus = 2;
                    _this.httpCounter.interval = setInterval(_this.intervalFunc.LoadImages, 50);
                }
            }
		}, // end LoadGalleries

		// оканчивается когда pages.toParse = 0
		// heartbeat while loading images
		LoadImages : function () {
			//debugger;
			DebugLog('LoadImages(): pages.toParse.length = ' + _this.pages.toParse.length + ', runCon=' + _this.httpCounter.runCon);
			//if (_this.httpCounter.runCon < 0)
			//	throw new Error('httpCounter.runCon(' + _this.httpCounter.runCon + ') < 0 !');
			if ((_this.httpCounter.runCon < _this.httpCounter.MAXREQ) && (_this.pages.toParse.length)) {
				DebugLog("LoadImages(): " + 
					'running connections: (' + _this.httpCounter.runCon + ') ' +
					'max running (' + _this.httpCounter.MAXREQ + ')');
				//debugger;
				//if (_this.pages.totalPagesForDown !== _this.pages.toParse.length)
				//	throw new Error("pages.totalPagesForDown != pages.toParse.length");
				//скачка изображений
				_this.checkers.NextImage();
			}
			
			if ((_this.pages.toParse.length === 0) && (_this.httpCounter.runCon === 0)) {
                //debugger;
				DebugLog('LoadImages():Stopping heartbeat out of images to load. pages.toParse=' + _this.pages.toParse.length + ' httpCounter.runCon=' + _this.httpCounter.runCon);
				_this.DoneDisplayUrlList(); 
				_this.pages.fetchStatus = 3;
				clearInterval(_this.httpCounter.interval);
			}
		} // end LoadImages
	}, // end intervalFunc


	checkers : {
		// checkers.isThumbnailGallery (doc)
		// return true if page seems to be a gallery
		// or false if it looks like its a single image page
		// detection is looking for the comments by the artist
		// usually found on the single image page
		isThumbnailGallery : function (docbase) {
			var rtnval;
			//DebugLog('Call: isThumbnailGallery()');
            var container = _this.parsers.FindThumbnailContainer(docbase);
            DebugLog('isThumbnailGallery() container = ' + rtnval);
			rtnval = (container) ? true : false;
			DebugLog('isThumbnailGallery(): ' + rtnval);
			return rtnval;
		}, // end isThumbnailGallery

		// скачка сраниц из GalleryPages и запуск для скаченных ScanGallery()
		// get our next gallery page from our stack
		NextGallery : function () {
			var link_info;
			DebugLog('NextGallery()');
 			if (_this.checkers.isAborted()) return;
			if (_this.GalleryPages.length) 
			{
				link_info = _this.GalleryPages.shift(); //Метод shift() удаляет и возвращает первый элемент массива
				_this.Get_URL_CB(link_info, _this.callbacks.ScanGallery, _this.GalleryPages.length);
			}
		}, // end NextGallery

		// уменьшает pages.toParse
		// get the next image page from our stack
		NextImage : function () {
			var link_info;
			DebugLog('NextImage()');
            //debugger;
			if (_this.checkers.isAborted()) return;
			if (_this.pages.toParse) {
				// pull image page url and index off the stack
				// index 0 is the page #, index 1 is the url
				link_info = _this.pages.toParse.shift();
                if(link_info[1] === "")
                    throw new Error('Пустая ссылка!'); 
				DebugLog('NextImage(): Start download image and (ScanFirstLevel()) on link: ' + link_info);
				_this.Get_URL_CB(link_info[1], _this.callbacks.ScanFirstLevel, link_info[0]);
			}
		}, // end NextImage

		// function checkers.isAborted ()
		// check if we clicked the button to abort script
		// if we did it requires a page reload to start again
		isAborted : function () {
			if (_this.abortLinkGrabbing) {
				//DebugLog('checkers.isAborted(): ' + _this.abortLinkGrabbing);
				return true;
			}
			return false;
		} // end isAborted
	}, // end checkers
    
    RemoveInvalidSymbols : function (string) {
        //debugger;
        //var strin = 'For more Beautiful Women follow me at:-1_2 3$4^5`6~7?8>9<a=b+c/d\g*h@i';
        //var res = strin.replace(/[^\wА-Я-Ё ]/gi, "");
        //var str = 'Ну вот люблю я стиль BLACK fashion не могу долго носить платья и каблуки В нем я себя чувствую смело и раскрепощенно Спасибо protest_store Well I love the style of BLACK fashion can not wear long dresses and heels In it I feel safe and relaxed angelica at Красная Площадь Москва';
        var maxLen = 200;
        //if (str.length > maxLen)
        //    var short = str.substr(0, maxLen);
        //^ Соответствует началу ввода.
        //\s Пробельный символ
        //+ Соответствует предыдущему символу повторенному 1 или более раз
        //x|y Соответствует либо 'x' либо 'y'.
        //$ Соответствует концу ввода. 
        // g 	Глобальный поиск.
        //trim
        //return string.replace(/^\s+|\s+$/g, "");
        //? 	Соответствует предыдущему символу повторенному 0 или 1 раз
        //\w  Соотвествует любому цифробуквенному символу включая нижнее подчеркивание. Эквивалентен [A-Za-z0-9_].
        //debugger;
        //var s = 'Hardbody selfie http://loveabs.net';
        //var v1 = s.replace(/(https?|http?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, "");
        //var v2 = s.replace(/((https|http)?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, "");
        var withoutUrl = string.replace(/(https?|http?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, "");
        //return withoutUrl.replace(/[\\/|<>?*:"]/g, "");
        var cleared = withoutUrl.replace(/[^\wА-Я-Ё ]/gi, "");
        if (cleared.length > maxLen)
           return cleared.substr(0, maxLen);
        return cleared;
    },
	
	callbacks :	{
		/* 	Обработка страницы галереи скаченной Get_URL_CB.
			Запускается GetLinks-LoadGalleries
			function callback_ScanPages(docbase)
			called when gallery page html is loaded so we can parse images out and set next page
		 */
		ScanGallery : function (docbase, GalleryURL) {
            //debugger;
			//galleryIndex = GalleryURL будет пустым
			DebugLog('ScanGallery(): Получение ссылок на иконки с галереи по адресу:' + GalleryURL);
			_this.pages.current += 1;
			DebugLog('ScanGallery(): pages.current=' + _this.pages.current);
			_this.btn.btnID.value = 'Loading gallery page ' + _this.pages.current;
			_this.parsers.GetLinksOnThumbsOnGalleryPage(docbase);
			if (_this.pages.recurse === true) {
				nextPage = _this.parsers.GetNextGalleryPageLink(docbase);
				if (nextPage) 
					_this.GalleryPages.push(nextPage);
			}
		}, // end ScanGallery
        
		// callback from Get_URL_CB
		// Из скаченной страницы получение ссылки на большой файл.
		// Функция остановится когда pages.current == pages.totalPagesForDown
		// callback routine when getting an image page to parse out the DDL link.
		ScanFirstLevel : function (docbase, galleryIndex) {
			//DebugLog('ScanFirstLevel(baseURI=' + docbase.baseURI + ', galleryIndex=' + galleryIndex + ')');
			DebugLog('ScanFirstLevel(galleryIndex=' + galleryIndex + ')');
			//DebugLog("docbase code: \n" + docbase.innerHTML);
            //debugger;
            var desc;
            
            if (_this.checkers.isAborted()) return;
			_this.pages.current += 1;
			_this.btn.btnID.value = 'Loading image page ' + _this.pages.current + ' of ' + _this.pages.totalPagesForDown;
			DebugLog('ScanFirstLevel(): Loading image page ' + _this.pages.current + ' of ' + _this.pages.totalPagesForDown);

			if (!_this.GalleryData[galleryIndex].description) {
				if(_this.parsers.GetDescription) {
					desc = _this.parsers.GetDescription(docbase);
					if(desc) {
						DebugLog('ScanFirstLevel(): Description: ' + desc);
					}
					else {
						var title = docbase.querySelector('title');
						if (title) { 
							desc = title.text; 
						}
					}
					
					 desc = _this.RemoveInvalidSymbols(desc);
					_this.GalleryData[galleryIndex].description = desc;
				}
            }
            else {
                 desc = _this.RemoveInvalidSymbols(_this.GalleryData[galleryIndex].description);
            }
			
			if (_this.GalleryData[galleryIndex].error !== '') 
			{
				if (_this.pages.current === _this.pages.totalPagesForDown) 
				{ 
					DebugLog('pages.current = pages.totalPagesForDown, return');
					_this.DoneDisplayUrlList(); 
				}
				return;
			}
			
			//debugger;
			var urlOnPage;
			var urlOnImage;
			urlOnPage = _this.parsers.GetUrlOnPageFromPage(docbase);
			if (urlOnPage) {
				DebugLog('ScanFirstLevel(): Found url on page: ' + urlOnPage);
				_this.GalleryData[galleryIndex].ddl = urlOnPage;
				_this.Get_URL_CB(urlOnPage, _this.callbacks.ScanSecondLevel, galleryIndex);
			}
			else {
				urlOnImage = _this.parsers.GetUrlOnImageFromPage(docbase);
				if (urlOnImage) {
					if (Array.isArray(urlOnImage)) {
						for(var i = 0; i < urlOnImage.length; i++) {
							_this.pages.AddURL(urlOnImage[i], null);
						}
					}
					else
						_this.pages.AddURL(urlOnImage, desc);
				}
			}
            
            //если ссылка на страницу или изображение для загрузки не найдено то пытаемся найти маленькую картинку
			if (!urlOnPage && !urlOnImage) 
			{
				DebugLog('ScanFirstLevel(): Failed found url to page or image');
				{
					urlOnImage = _this.parsers.GetUrlOnImageFromPage2(docbase);
					if (urlOnImage) {
						DebugLog('ScanFirstLevel(): Found download url for small image: ' + urlOnImage);
						_this.GalleryData[galleryIndex].ddl = urlOnImage;
						//_this.pages.URLs.push(new _this.pages.URLTemplate(urlOnImage, desc));
						_this.pages.AddURL(urlOnImage, desc);
					} else {
						DebugLog('ScanFirstLevel(): Failed found small image');
						// no image found, probably a text page for a poem or something.
						_this.GalleryData[galleryIndex].error = 'No download or large image found.';
						_this.pages.hasFailedPage = true;

						// check if we're done loading since the throw below will prevent a
						if (_this.pages.current === _this.pages.totalPagesForDown) { 
                            DebugLog('ScanFirstLevel(): pages.current(' + _this.pages.current + ') = pages.totalPagesForDown(' + _this.pages.totalPagesForDown + ')');
							_this.DoneDisplayUrlList(); 
						}
						return false;
						//throw this.GalleryData[galleryIndex].error + ' (' + this.GalleryData[galleryIndex].url + ')';
					}
				}
			}
			
            DebugLog("Image[" + galleryIndex + "] check founded, Failed = false");
			_this.GalleryData[galleryIndex].Failed = false;
			//if (this.pages.current == this.pages.totalPagesForDown) { 
			//	this.DoneDisplayUrlList(); 
			//}
		}, // end ScanFirstLevel
		
		ScanSecondLevel : function (docbase, galleryIndex) {
            //debugger;
			var bigImageUrl;
			DebugLog('Call: ScanSecondLevel( docbase=' + docbase + ', galleryIndex=' + galleryIndex + ')');
			bigImageUrl = _this.parsers.GetUrlOnImageFromPage2(docbase);
			if (bigImageUrl) {
					DebugLog('ScanSecondLevel(): Found download url for big image: ' + bigImageUrl);
					_this.GalleryData[galleryIndex].ddl = bigImageUrl;
					//_this.pages.URLs.push(new _this.pages.URLTemplate(bigImageUrl, null));
					_this.pages.AddURL(bigImageUrl, null);
			}
			else
				DebugLog('ScanSecondLevel(): Failed found big image');
		}, // end ScanSecondLevel
	}, // end callbacks
	
	parsers : {
		GetButtonLocation : function () 
		{
			throw new Error("Функция не реализована");
		},
		
		FindThumbnailContainer : function (docbase) {
			return docbase.querySelector('div.block_left');
		}, // end FindThumbnailContainer
		
		/* 	возврашет ссылку на следующую страницу галлереи
			GetNextGalleryPageLink(docbase)
			requires docbase: DOM Object
			returns string of url for next page
		 */	
		GetNextGalleryPageLink : function (docbase) {
            //throw new Error("Функция не реализована");
			DebugLog('Заглушка GetNextGalleryPageLink() всегда возврашет что нет следующих страниц галлерей');
			return false;
		}, // end GetNextGalleryPageLink

		GetContainerFromGalleryPage : function (docbase) {
			DebugLog('Заглушка GetContainerFromGalleryPage()');
			return false;
		}, // end GetContainerFromGalleryPage

		GetRefOnPageFromContainer : function (obj) {
            //по умолчанию возврашат атрибут href
			DebugLog('GetRefOnPageFromContainer(): return href');
            var href = obj.getAttribute('href');
            if (href) {
                DebugLog('GetRefOnPageFromContainer():  href = ' + href);
                return href;
            }
			return false;
		}, // end GetRefOnPageFromContainer

		GetDownRefFromContainer : function (obj) {
            DebugLog('Заглушка GetDownRefFromContainer()');
		}, // end GetDownRefFromContainer 
        
        GetDescription : function (docbase) {
            DebugLog('Заглушка GetDescription()');
        },

		/* 	GetLinksOnThumbsOnGalleryPage(docbase)
			Заполняет GalleryData ссылками на эскизы.
			requires docbase: DOM Object to scan
		 */
		GetLinksOnThumbsOnGalleryPage : function (docbase) 
		{
			var ref_container;
			var container_count;
			var newdocbase;
			var galleryIndex;
            //debugger;
		
			// look for thumbnail container
			DebugLog('GetLinksOnThumbsOnGalleryPage(): Searching for thumbnail container on: ' + docbase.baseURI);
			newdocbase = this.FindThumbnailContainer(docbase);
			if (newdocbase) {
				//Находим ссылки на эскизы в найденном контейнере.
                ref_container = this.GetContainerFromGalleryPage(newdocbase);
			}
			else {
				//throw 'Error finding thumbnail window.';
				DebugLog('GetLinksOnThumbsOnGalleryPage(): Error finding thumbnail window.');
			}
			
			if (!ref_container) {
				// no thumbnails found so stop searching pages
				// this happens if you scan browse pages and it runs over the 1000 image limit
				if (_this.parsers.FindNoResultsContainer(docbase)) {
					_this.pages.recurse = false;
				}
				return false;
			}
			
			DebugLog('GetLinksOnThumbsOnGalleryPage(): Found ' + ref_container.length + ' link on thumbs');
			container_count = ref_container.length;
			for (container_counter = 0; container_counter < container_count; container_counter += 1) 
			{
				var refOnPage = this.GetRefOnPageFromContainer(ref_container[container_counter]);
				DebugLog('GetLinksOnThumbsOnGalleryPage(): container_counter=' + container_counter + '; ' +
					'container_count=' + container_count + '; ' + refOnPage);
				var desc;
				if (refOnPage)
				{
					//debugger;
					_this.pages.totalPagesForDown += 1;
					galleryIndex = _this.pages.totalPagesForDown;
					//galleryIndex = _this.pages.toParse.length + 1;

                    DebugLog('GetLinksOnThumbsOnGalleryPage(): Push reference on page: index=' + galleryIndex + ', url=' + refOnPage);
                    _this.pages.toParse.push([galleryIndex, refOnPage]);
                    _this.GalleryData[galleryIndex] = new _this.GalleryTemplate();
                    _this.GalleryData[galleryIndex].url = refOnPage;
                    //_this.GalleryData[galleryIndex].title = 'NotLoaded-' + _this.GalleryData[galleryIndex].url.split('/').pop();
					desc = _this.parsers.GetDescription(ref_container[container_counter]);
					if (desc)
						_this.GalleryData[galleryIndex].description = desc;
					//else
					//	_this.GalleryData[galleryIndex].description = 'NotLoaded-' + _this.GalleryData[galleryIndex].url.split('/').pop();
                    _this.GalleryData[galleryIndex].Failed = true;
                }
                else {
                    DebugLog('GetLinksOnThumbsOnGalleryPage(): GetRefOnPageFromContainer() return null');
                
                    var href = this.GetDownRefFromContainer(ref_container[container_counter]);
                    if (href) {
                        DebugLog('GetLinksOnThumbsOnGalleryPage(): Push reference on image: index=' + galleryIndex + ', url=' + href);
                        if(_this.parsers.GetDescription) {
                            desc = _this.parsers.GetDescription(ref_container[container_counter]);
                            if (desc)
                                desc =  _this.RemoveInvalidSymbols(desc);
                        }
                        //debugger;
                        //_this.pages.directlyAddedImages += 1;
                        _this.pages.AddURL(href, desc);
                    }
                }
			}
			return true;
			//DebugLog(this.pages);
		}, // end GetLinksOnThumbsOnGalleryPage
		
		FindNoResultsContainer : function (docbase)
		{
			return docbase.querySelector('div.browse-no-results');
		}, // end FindNoResultsContainer
		
		GetUrlOnImageFromPage : function (docbase)
		{
			return false;
		}, // end GetUrlOnImageFromPage

		GetUrlOnPageFromPage: function (docbase) {
			return false;
		}, //GetUrlOnPageFromPage
		
		// если нет увеличенной версии.
		GetUrlOnImageFromPage2 : function (docbase)	{
		}, // end GetUrlOnImageFromPage2
				
	}, // end parsers
	
	DoneDisplayUrlList : function () {
        //debugger;
		DebugLog('DoneDisplayUrlList()');
		if (_this.pages.fetchStatus > 3) return;
		var urlList;
		urlList = _this.URLbox;
        DebugLog('DoneDisplayUrlList(): fetchStatus=' + _this.pages.fetchStatus + ', httpCounter.interval=' + _this.httpCounter.interval);
	
		/*urlList.rows = 15;
		urlList.style.width = '100%';
		urlList.innerHTML = _this.pages.URLs.join('\r\n');*/
		var table = '<table width="97%">';
		//_this.pages.URLs.forEach(function(item, i, URLs) {
		//	table += '<tr><td><a title="Title" href="' + item.URL + '">' + item.Decription ? item.Decription : '' + '</a></td></tr>';
		//});
		for(var i = 0; i < _this.pages.URLs.length; i++){
			table += '<tr><td><a style="color: black" title="Title" href="' + _this.pages.URLs[i].URL + '">';
            table += _this.pages.URLs[i].Decription;
			//table += _this.pages.URLs[i].Decription ? _this.pages.URLs[i].Decription : _this.pages.URLs[i].URL;
			table += '</a></td></tr>';
		}
		table += '</table>';
		urlList.innerHTML = table;
		urlList.style.overflow = "auto";
		//urlList.style.overflow = "visible";
		urlList.style.height = "100px";
		urlList.style.width = "97%";
		//base.URLbox.style.zIndex = 1;
		urlList.style.background = "white";
        //urlList.style.color = "black";
		urlList.style.display = '';
        _this.pages.fetchStatus = 4;

		if (_this.pages.hasFailedPage) {
			//_this.btn.btnID.value = 'Some pages failed to find links (found ' + _this.pages.URLs.length + ' of ' + _this.pages.totalPagesForDown + ')';
			_this.btn.btnID.value = 'Some pages failed to find links';
			_this.ShowFailedUrlList();
		}
		else {
			_this.btn.btnID.value = 'Displaying (found ' + _this.pages.URLs.length + ', from pages ' + _this.pages.totalPagesForDown + ')';
		}
	}, // end DoneDisplayUrlList
	
	ShowFailedUrlList : function () {
		DebugLog('ShowFailedUrlList()');
		var counter;
		var failedURLs;
		var tableFailed, tableInner;
        
		tableFailed = _this.tableFailed;
        tableFailed.style.overflow = "auto";
        tableFailed.style.height = "100px";
		//tableFailed.width = '100%';
        tableFailed.style.width = "97%";
		//tableFailed.border = '2 px';
        tableFailed.style.border = '2px double black';
		tableFailed.style.backgroundColor= 'white';
        //tableFailed.style.background = "red";
		tableInner = '';
		
		for (counter in _this.GalleryData) 
		{
			if (_this.GalleryData[counter].Failed === true) 
			{
				/*tableInner = tableInner + 
					'<a href="' + this.GalleryData[counter].url + '">' +
						this.GalleryData[counter].title + '</a> ' +
						this.GalleryData[counter].error +
				'<br/>';*/
				tableInner = tableInner + 
					'<a href="' + _this.GalleryData[counter].url + '">' +
                    "Image[" + counter + "] " +
						_this.GalleryData[counter].url + '</a> ' +
						'NotLoaded-' + 
						_this.GalleryData[counter].error +
					'<br/>';
			}
		}
		tableInner = '<table width="97%"><tbody><tr><td>' + 
			'<b>Failed Pages:</b>' + '</td></tr><tr><td>' + 
			tableInner + 
			'</td></tr></tbody></table>';
		tableFailed.innerHTML = tableInner;
		tableFailed.style.display = '';
	}, // end ShowFailedUrlList
	
	createRequestObject : function () 
	{
		/*if (typeof XMLHttpRequest === 'undefined') 
        {
            XMLHttpRequest = function() 
            {
                try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
                catch(e) {}
                try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
                catch(e) {}
                try { return new ActiveXObject("Msxml2.XMLHTTP"); }
                catch(e) {}
                try { return new ActiveXObject("Microsoft.XMLHTTP"); }
                catch(e) {}
                throw new Error("This browser does not support XMLHttpRequest.");
            };
		}*/
		return new XMLHttpRequest();
	},
	
	/*html2dom : function (html)
	{
		var container = document.createElement("tbody");
		container.innerHTML = html.replace(/<script(.|\s)*?\/script>/gi,"").replace(/<iframe(.|\s)*?\/iframe>/gi,"");
		return container;
	},*/
    
    //ChangeEncoding: function (httpReq) {}, 
	
	/* 	function Get_URL_CB(url_link, callback, galleryIndex)
		multithreaded url fetching routine
		url_link	:	downloads contect from this url
		callback	:	function to call once content is downloaded
		 	called as callback(DOM object, galleryIndex)
		 	DOM object containing newly downloaded page content
		galleryIndex:	identifier of the image # to reference pages.GalleryPage
		gets url contents and puts in an on the fly div
		then calls routine "callback" with div object
		callback это ScanGallery(docbase) или
	 */
	Get_URL_CB	: function (url_link, callback, galleryIndex) {
		DebugLog('Get_URL_CB(' + url_link + '): index: ' + galleryIndex + ', httpCounter.runCon=' + _this.httpCounter.runCon);
		_this.httpCounter.runCon += 1;
        DebugLog('Get_URL_CB() after adding: httpCounter.runCon=' + _this.httpCounter.runCon);
		try {
			//var httpReq = new XMLHttpRequest();
			var httpReq = _this.createRequestObject();
			httpReq.onreadystatechange = function(xHttpRequest) {
				//if (galleryIndex) { pages.GalleryData[galleryIndex].xhttp = xHttpRequest; }
				//DebugLog('xmlhttpRequest readystate: ' + xHttpRequest.target.readyState + ' on ' + url_link);
				if (xHttpRequest.target.readyState == 4) {
					if (xHttpRequest.target.status == 200) 
					{
						//загружен адрес успешно
						//DebugLog('xmlhttpRequest response: ' + xHttpRequest.target.readyState + ' ' + xHttpRequest.target.status + //' ' + url_link);
						//if (_this.checkers.isAborted()) return;
						DebugLog('Get_URL_CB(): Got 200 OK: ' + url_link);
						
                        //debugger;
                        //DebugLog(xHttpRequest.target.responseText);
                        
						var container = document.implementation.createHTMLDocument("");
						container.body.innerHTML = xHttpRequest.target.responseText;
						callback(container, galleryIndex);
						
						/*var xmlDoc = document.createElement('div');
						xmlDoc.innerHTML = xHttpRequest.target.responseText;
						callback(xmlDoc, galleryIndex);
						while (xmlDoc.firstChild) {
							xmlDoc.removeChild(xmlDoc.firstChild);
						}
						xmlDoc = null;*/
					}
					else 
					{
						DebugLog('xmlhttpRequest status error: ' + xHttpRequest.target.status + '. If 0, Probably using chrome and errored on cross-domain issue.');
						switch(xHttpRequest.target.status) {
							case 0:
								if(_this.GalleryData[galleryIndex])
									_this.GalleryData[galleryIndex].error = '0. Cross Domain Block'; 
								DebugLog('Probably using chrome and errored on cross-domain issue.');
								_this.pages.hasFailedPage = true;
								break;
                            case 503:
								DebugLog(url_link + ' 503. The server is currently unavailable. Sleep ' + _this.sleepTime);
								setTimeout(function(){
									DebugLog(url_link + ' Relaunch after 503.');
									_this.Get_URL_CB(url_link, callback, galleryIndex, true);
								}, _this.sleepTime);
								return;
							default:
								if(_this.GalleryData[galleryIndex])
									_this.GalleryData[galleryIndex].error = 'xmlhttpRequest status: ' + xHttpRequest.target.status;
								_this.pages.hasFailedPage = true;
						}
						// call the callback so we decrement the fetch counter and try another
						// запускаем на пустом div, поэтому ничего там не найдется
						//callback(document.createElement('div'), galleryIndex);
						//callback(xHttpRequest.target.response, galleryIndex);
					}
					//DebugLog('run connections: ' + this.httpCounter.runCon);
					_this.httpCounter.runCon -= 1;
					//DebugLog('run connections: ' + this.httpCounter.runCon);
				}
			};
			httpReq.open('GET', url_link, true);
			//httpReq.setRequestHeader("Access-Control-Allow-Origin", "*") 
            //_this.ChangeEncoding(httpReq);
            //для следующей галереии kinopoiska
			//if (httpReq.overrideMimeType) { 
			//	httpReq.overrideMimeType('text/html; charset=windows-1251'); 
			//}
			httpReq.send('');
		}
		catch (err) {
			//nothing to do really
			_this.httpCounter.runCon -= 1;
			DebugLog('Error occured: ' + err.message);
		}
	}, // end Get_URL_CB
	/* 	function GM_Get_URL_CB(url_link, callback, galleryIndex)
		multithreaded url fetching routine
		url_link	:	downloads contect from this url
		callback	:	function to call once content is downloaded
		 	called as callback(DOM object, galleryIndex)
		 	DOM object containing newly downloaded page content
		galleryIndex:	identifier of the image # to reference pages.GalleryPage
		gets url contents and puts in an on the fly div
		then calls routine "callback" with div object

	 	grease monkey specific url fetching routine
		needs to be used in firefox when handling
		search thumbnail pages to get around the
		same origin limitations. can be used in
		google chrome as converted userscript but
		still has same origin restriction so will fail
		on search pages.
	 */
	GM_Get_URL_CB : function (url_link, callback, galleryIndex) {
		DebugLog('Call: GM_Get_URL_CB(' + url_link + '): index: ' + galleryIndex);
		_this.httpCounter.runCon += 1;
		try {
			GM_xmlhttpRequest({
				method:'GET',
				url:url_link,
				onload:function(xHttpRequest) {
					//if (galleryIndex) { pages.GalleryData[galleryIndex].xhttp = xHttpRequest; }
					DebugLog('GM_xmlhttpRequest onload: ' + xHttpRequest.readyState + ' ' + url_link);
					if (checkers.isAborted()) return;
					if (xHttpRequest.readyState == 4) {
						if (xHttpRequest.status == 200) {
							DebugLog('xmlhttpRequest response: ' + xHttpRequest.readyState + ' ' + xHttpRequest.status + ' ' + url_link);
							if (checkers.isAborted()) return;
							if (ScriptDebug && SuperVerbose) { GM_log('Response: ' + xHttpRequest.responseText); }
							DebugLog('Got 200 OK: ' + url_link);
							var xmlDoc = document.createElement('div');
							xmlDoc.innerHTML = xHttpRequest.responseText;
							callback(xmlDoc, galleryIndex);
							while (xmlDoc.firstChild) {
								xmlDoc.removeChild(xmlDoc.firstChild);
							}
							xmlDoc = null;
						}
						else {
							DebugLog('xmlhttpRequest status error: ' + xHttpRequest.status + '. If 0, Probably using chrome and errored on cross-domain issue.');
							if (xHttpRequest.status === 0) { 
								_this.GalleryData[galleryIndex].error = 'Cross Domain Block'; 
							}
							// call the callback so we decrement the fetch counter and try another
							callback(document.createElement('div'), galleryIndex);
						}
						_this.http_Counter.runCon -= 1;
					}
				}
			});
		}
		catch (err) {
			//nothing to do really
			_this.httpCounter.runCon -= 1;
			DebugLog('Error occured: ' + err.message);
		}
	} // end GM_Get_URL_CB
};//end of baseRipper


/* Implementation */
//var kinopoiskRipper = function() {};
var KinopoiskRipper = function() {};
KinopoiskRipper.prototype = Object.create(baseRipper);
KinopoiskRipper.prototype.parsers = Object.create(baseRipper.parsers);
KinopoiskRipper.prototype.parsers.GetButtonLocation = function()
{
	DebugLog('kinopoiskRipper.GetButtonLocation');
	return	document.querySelector('div.block_left table tbody tr td');
}; // end GetButtonLocation
/* 	возврашет ссылку на следующую страницу галлереи
GetNextGalleryPageLink(docbase)
requires docbase: DOM Object
returns string of url for next page
*/	
KinopoiskRipper.prototype.parsers.GetNextGalleryPageLink = function (docbase) {
    DebugLog('GetNextGalleryPageLink()');
    var links;
    var rtn_val;

    DebugLog('GetNextGalleryPageLink(): Looking for pagination container');
    links = docbase.querySelectorAll('div.navigator > ul.list > li.arr a');
    if (links) 
    {
        for (index = 0; index < links.length; ++index) 
        {
            //DebugLog(links[index]);
            if (links[index] && links[index].text === "»") 
            {
                var href = links[index].getAttribute('href');
                DebugLog('GetNextGalleryPageLink(): Next gallery is: ' + href);
                return href;
            }
        }
    }
    DebugLog('GetNextGalleryPageLink(): Failed to found next gallery.');
    return false;
}; // end GetNextGalleryPageLink
KinopoiskRipper.prototype.parsers.GetContainerFromGalleryPage = function (docbase) {
	var links = docbase.querySelectorAll('table.fotos tr td b a');
	return links;
	/*urls = [];

	for (i = 0; i < links.length; i += 1) 
	{
		var href = links[i].getAttribute('href');
		urls.push(href);
	}
	return urls;*/
}; // end GetContainerFromGalleryPage
KinopoiskRipper.prototype.parsers.GetRefOnPageFromContainer = function (obj) {
	return obj.getAttribute('href');
}; // end GetRefOnPageFromContainer
KinopoiskRipper.prototype.parsers.GetUrlOnImageFromPage =
KinopoiskRipper.prototype.parsers.GetUrlOnImageFromPage2 = function (docbase)
{
	//debugger;
	//Ссылка на изображение в полный размер
	var image = docbase.querySelector('img#image');
	if (image) {
		//var src = image.src;
		var src = image.getAttribute('src');
		if (src === undefined) 
			DebugLog('GetUrlOnImageFromPage2(): image.src = undefined, image: ' + image);
		if (src.lastIndexOf('//', 0) === 0)
			src = 'https:' + src;
		return src;
	}
	return false;
}; // end GetUrlOnImageFromPage
KinopoiskRipper.prototype.parsers.GetUrlOnPageFromPage = function (docbase) {
	//Ссылка на сраницу с большой каринкой
	var dlbutton = docbase.querySelector('b.enlarge_3 a');
	if (dlbutton) {
		//DebugLog('dlbutton=' + dlbutton);
		var src = dlbutton.getAttribute('href');
		if (src === undefined) 
			DebugLog('GetUrlOnImageFromPage(): dlbutton.href = undefined, dlbutton: ' + dlbutton);
		return src;
	}
	//DebugLog('GetUrlOnImageFromPage(): return false');
	return false;
}; //GetUrlOnPageFromPage
//KinopoiskRipper.prototype.ChangeEncoding = function (httpReq) {
    //для следующей галереии kinopoiska
	//if (httpReq.overrideMimeType)
	//	httpReq.overrideMimeType('text/html; charset=windows-1251'); 
//};
var kinopoiskRipper = new KinopoiskRipper();

//if (!kinopoiskRipper.hasOwnProperty('GetButtonLocation'))
//    throw new Error("kinopoiskRipper не имеет свойства GetButtonLocation");
//alert( kinopoiskRipper.hasOwnProperty('isChrome') );
//alert( kinopoiskRipper.parsers.hasOwnProperty('GetButtonLocation') );


var FilmzRipper = function() {};
FilmzRipper.prototype = Object.create(baseRipper);
FilmzRipper.prototype.httpCounter.MAXREQ = 1;
FilmzRipper.prototype.parsers = Object.create(baseRipper.parsers);
FilmzRipper.prototype.parsers.GetButtonLocation = function(){
	return document.querySelector('div.pages');
}; // end GetButtonLocation
FilmzRipper.prototype.parsers.GetNextGalleryPageLink = function (docbase) {
    var links = docbase.querySelectorAll('div.pages.fll.br5 > a');
    DebugLog('GetNextGalleryPageLink(): Looking for next button: ' + links);
    /*links.forEach(function(entry) {
				DebugLog(entry);
			});*/
    DebugLog("GetNextGalleryPageLink(): links:");
    for (index = 0; index < links.length; ++index) 
    {
        if (links[index] && links[index].text == "следующая") 
        {
            var href = links[index].getAttribute('href');
            DebugLog('NextGallery: ' + href);
            return href;
        }
    }
    return false;
}; // end GetNextGalleryPageLink
FilmzRipper.prototype.parsers.FindThumbnailContainer = function (docbase) {
	return docbase.querySelector('#photos_list > center:nth-child(2)');
}; // end FindThumbnailContainer
FilmzRipper.prototype.parsers.GetContainerFromGalleryPage = function (docbase) {
    return docbase.querySelectorAll('a.fullink[href*=full]');
}; // end FindLinks
FilmzRipper.prototype.parsers.GetUrlOnImageFromPage = function (docbase) {
    //debugger;
	//var image = docbase.querySelector('div.content > div:nth-child(4) > center:nth-child(3) > a:nth-child(1) > img:nth-child(1)') ||
	//docbase.querySelector('div.content > div:nth-child(4) > center:nth-child(3) > img:nth-child(1)');
	var image = docbase.querySelector('div.content center a img');
	if (image) {
		var src = image.getAttribute('src');
		if (src === undefined) 
			DebugLog('GetBigImageUrl(): image.src = undefined, image: ' + image);
		return src;
	}
	return false;
}; // end GetUrlOnImageFromPage
//FilmzRipper.prototype.callbacks = Object.create(baseRipper.callbacks);
FilmzRipper.prototype.parsers.GetDescription = function (docbase) {
    var sel;
    sel = docbase.querySelector('div.content > div > div.text > p:nth-child(2)');
    if (sel) {
        //debugger;
        var pers = sel.querySelector('b');
        if (pers && pers.innerText === 'персоны на фото:') {
           var refs = sel.querySelectorAll('a');
           var text;
           for(var i = 0; i < refs.length; i++) {
                if (i === 0)
                    text = refs[i].text;
                else
                    text = text + '_' + refs[i].text;
           }
           return text;
        }
    }
};
var filmzRipper = new FilmzRipper();


var CeleberRipper = function() {};
CeleberRipper.prototype = Object.create(baseRipper);
CeleberRipper.prototype.parsers = Object.create(baseRipper.parsers);
CeleberRipper.prototype.parsers.GetButtonLocation = function()
{
	return	document.querySelector('#real_content') || 
			document.querySelector('#google-horizontal-ad') ||
			document.querySelector('#front_page_content > h1');
}; // end GetButtonLocation
CeleberRipper.prototype.parsers.FindThumbnailContainer = function (docbase) {
	//return docbase.querySelector('div > .normal-thumbs');
    return docbase.querySelector('div.global-block');
}; // end FindThumbnailContainer
CeleberRipper.prototype.parsers.GetContainerFromGalleryPage = function (docbase) {
    return docbase.querySelectorAll('a');
}; // end FindLinks
CeleberRipper.prototype.parsers.GetNextGalleryPageLink = function (docbase) {
    DebugLog('GetNextGalleryPageLink()');
    var newdocbase;
    var rtn_val;

    DebugLog('Looking for pagination container');
    newdocbase = docbase.querySelector('div.pages');

    DebugLog('Looking for next button in ' + newdocbase);
    if (newdocbase) 
        rtn_val = newdocbase.querySelector('a.next-page');

    if (rtn_val) 
    {
        //rtn_val.href
        var href = rtn_val.getAttribute('href');
        DebugLog('NextGallery: ' + href);
        return href;
    }
    else 
        return false;
    DebugLog('GetNextGalleryPageLink(): Failed to found next gallery.');
    return false;
}; // end GetNextGalleryPageLink
CeleberRipper.prototype.parsers.GetUrlOnImageFromPage = function (docbase)
{
    //debugger;
	//var but = docbase.querySelector('#download_button < a');
    //var but = docbase.querySelector('#download_button a');
    //if (but)
    //    return but.href;
    //var but = docbase.querySelector('#real_content > div.zoom-container > img');
    var but = docbase.querySelector('#real_content > div.photo > div.image-bg > a.image-holder');
    if (but)
        return but.href;
    //return but.getAttribute('data-src');
}; // end GetUrlOnImageFromPage
CeleberRipper.prototype.parsers.GetUrlOnImageFromPage2 = function (docbase)
{
    //return docbase.querySelector('a.image-holder img');
    var smallImage = docbase.querySelector('#image_1');
    if (smallImage)
        return smallImage.src;
}; // end GetUrlOnImageFromPage2
CeleberRipper.prototype.parsers.GetDescription = function (docbase) {
    //var desc = docbase.querySelector('#real_content > div.description > p:nth-child(1)');
    var desc = docbase.querySelector('#photo_title');
    if (desc)
        return desc.innerText;
}; 
var celeberRipper = new CeleberRipper();



var GreatmusclebodiesRipper = function() {};
GreatmusclebodiesRipper.prototype = Object.create(baseRipper);
GreatmusclebodiesRipper.prototype.parsers = Object.create(baseRipper.parsers);
GreatmusclebodiesRipper.prototype.parsers.GetButtonLocation = function(){
	//debugger;
	/*if (location.href.match(/thumbnails/))
		_this.levelForURLScaning = 2;
	else
	_this.levelForURLScaning = 1;*/

	return document.querySelector('#content td.statlink') ||
		document.querySelector('#content tr >td.tableh1');
}; // end GetButtonLocation*/
GreatmusclebodiesRipper.prototype.parsers.FindThumbnailContainer = function (docbase) {
    return docbase;
}; // end FindThumbnailContainer
GreatmusclebodiesRipper.prototype.parsers.GetContainerFromGalleryPage = function (docbase) {
    //debugger;
    var sel;
	if (location.href.match(/thumbnails/)) 
		sel = docbase.querySelectorAll('#content > table.maintable td.thumbnails a');
	else
		sel = docbase.querySelectorAll('#content td.display_media td[align=center]');
	return sel;
}; // end FindLinks
GreatmusclebodiesRipper.prototype.parsers.GetRefOnPageFromContainer = function (doc) {
	//debugger;
	var code;
	var ref = doc.querySelector('a');
	if (ref) {
		code = ref.getAttribute('onclick');
		if (code) {
			var startStr = 'MM_openBrWindow(\'';
			var start = code.indexOf(startStr) + startStr.length;
			var end = code.indexOf('\',\'');
			var code2 = code.substring(start, end);
			//var decode = decodeURI(code2);
			if (code2)
				return code2;
		}
	}
    else { //thumbnails
		code = doc.getAttribute('href');
		if (code) {
			return code;
		}
    }
};
GreatmusclebodiesRipper.prototype.parsers.GetDownRefFromContainer = function (doc) {
    //debugger;
    var atr;
    var link = doc.querySelector('img');
    if (link) {
        atr = link.getAttribute('src');
        if (atr) 
            return atr;
    }
};
GreatmusclebodiesRipper.prototype.parsers.GetNextGalleryPageLink = function (docbase) {
    //debugger;
    var href;
    var img;

	img = docbase.querySelector("img[src='images/navbar/next.png']");
    if (!img)
		img = docbase.querySelector("#content td.navmenu > a > img[src='images/icons/tab_right.png']");
    
    if (img) {
        if (img.parentNode) {
            var parent = img.parentNode;
            if(parent)
            {
                href = parent.getAttribute('href');
                DebugLog('NextGallery: ' + href);
                return href;
            }
        }
    }
    return false;
}; // end GetNextGalleryPageLink
GreatmusclebodiesRipper.prototype.parsers.GetUrlOnImageFromPage2 =
GreatmusclebodiesRipper.prototype.parsers.GetUrlOnImageFromPage = function (docbase) {
    //debugger;
    var img = docbase.querySelector('#fullsize_image');
    if (img)
        return img.getAttribute('src');
    
    img = docbase.querySelector('#content td.display_media td[align=center] img');
    if (img) {
        //debugger;
        var atr = img.getAttribute('src');
        if (atr) 
            return atr;
    }
    //else
    //    debugger;
}; // end GetUrlOnImageFromPage
GreatmusclebodiesRipper.prototype.parsers.GetUrlOnPageFromPage = function (docbase) {
    //debugger;
    var ref = docbase.querySelector('#content td.display_media td[align=center] a');
    if (ref) {
        var code = ref.getAttribute('onclick');
        if (code) {
            var startStr = 'MM_openBrWindow(\'';
            var start = code.indexOf(startStr) + startStr.length;
            var end = code.indexOf('\',\'');
            var code2 = code.substring(start, end);
            //var decode = decodeURI(code2);
            if (code2)
                return code2;
        }
    }
}; // end GetUrlOnImageFromPage
var greatmusclebodiesRipper = new GreatmusclebodiesRipper();


var TumblrRipper = function() {};
TumblrRipper.prototype = Object.create(baseRipper);
//TumblrRipper.prototype.levelForURLScaning = 0;
TumblrRipper.prototype.parsers = Object.create(baseRipper.parsers);
TumblrRipper.prototype.parsers.GetButtonLocation = function(){
    //debugger;
    //return	document.querySelector('#content');
    //return	document.querySelector('.description') ||
    return document.querySelector('#content-wrapper > div.grid.three-col > article') ||
        document.querySelector('#header > div.xnav') ||
        document.querySelector('#masthead') ||
        document.querySelector('header > h1') ||
        document.querySelector('#inside') ||
        document.querySelector('#menu') ||
        document.querySelector('#user-info') || //sl.house
        document.querySelector('#header h1.blog-title') ||//...myhair.tumblr.com photoset_iframe
        document.querySelector('#header > div.header-image-wrapper > header') || //awesomeabduction.tumblr.com photoset_iframe
        document.querySelector('#slide') || //thedopeapproach.tumblr.com, sosexyandfit.tumblr.com
        //document.querySelector('#CDT') ;
        //document.querySelector('#blog_info > h1');
        document.querySelector('body div.main > div > div > center > form > font > p') ;
}; // end GetButtonLocation*/
TumblrRipper.prototype.parsers.GetNextGalleryPageLink = function (docbase) {
    //debugger;
    var href;
    var link = docbase.querySelector('#content-wrapper > div.pagination > a.next');
    DebugLog('GetNextGalleryPageLink(): Looking for next button: ' + link);
    if(link)
    {
        href = link.getAttribute('href');
        DebugLog('NextGallery: ' + href);
        return href;
    }
    
    if (!link)
        link = docbase.querySelector('#pagination > a.next');
    
    if (!link)
        link = docbase.querySelector('#pagination > a');
    if(link) {
        href = link.getAttribute('href');
        var totalPages = link.getAttribute('data-total-pages');
        if (totalPages)
            DebugLog('data-total-pages: ' + totalPages);
        return href;
    }
    
    if (!link)
        link = docbase.querySelector('#next_page');
    if (!link)
        link = docbase.querySelector('#nextPage');
    if (!link)
        link = docbase.querySelector('#older');
    if (!link)
        link = docbase.querySelector('body > div.nav > a');
    if (!link) {
        //debugger;
        var links = docbase.querySelectorAll('#content div.standard-pagination > a');
        for(var i = 0; i < links.length; i++) {
			if (links[i].text === 'Next') {
                link = links[i];
                break;
            }
		}
    }
    
    if (!link)
        link = docbase.querySelector('#pageNavOlder'); //fit-and-sexxy.tumblr.com     
    if (!link)
        link = docbase.querySelector('#posts > div.pagination > a.next'); //sl.house
    if (!link)
        link = docbase.querySelector('#next'); //superbo
    
    if(link) {
         href = link.getAttribute('href');
         if (href)
             return href;
    }
    
    return false;
}; // end GetNextGalleryPageLink
TumblrRipper.prototype.parsers.FindThumbnailContainer = function (docbase) {
    //debugger;
    //var i1 = docbase.querySelectorAll('#content-wrapper div.post-content');
    //var i2 = docbase.querySelectorAll('#content-wrapper > div.post-content');
    //return docbase.querySelectorAll('#content-wrapper ');
    //return docbase.querySelector('#content-wrapper div.init-posts.active');
	//return docbase.querySelector('#content-wrapper div.post-content');
    return docbase;
}; // end FindThumbnailContainer
TumblrRipper.prototype.parsers.GetContainerFromGalleryPage = function (docbase) {
    //debugger;
	var links = docbase.querySelectorAll('#content-wrapper div.post-content');
    
    if (links.length === 0)
        links = docbase.querySelectorAll('#posts section.top.media > a > img');
    
    //var s1 = docbase.querySelectorAll('#posts > div > article.photoset > div > section.post > figure');
    //var s2 = docbase.querySelectorAll('div.photoset_row > a');
    /*var frames = docbase.querySelectorAll('#posts > div > article.photoset > div > section.post > figure iframe');
    if(frames) {
        var frameDocs = [];
        for(var i = 0; i < frames.length; i++) {
            //frameDocs.push(frames[i].contentWindow.document);
            if (frames[i].contentWindow)
                var frameDoc = frames[i].contentWindow.document;
        }
    }*/
    if (links.length === 0) 
        links = Array.prototype.slice.call(docbase.querySelectorAll('#posts > div > article.photoset > div > section.post > figure'))  //awesomeabduction.tumblr.com
            .concat(Array.prototype.slice.call(docbase.querySelectorAll('div.photoset_row > a')));
    
    if (links.length === 0)
        links = docbase.querySelectorAll('#posts > div > article'); //sashalee-kong.tumblr.com
    //#posts > div > article.photo > div > section.post > figure > div > div > a > img
    
    if (links.length === 0)
        links = docbase.querySelectorAll('#posts > article > div.photo > a'); //thedopeapproach.tumblr.com
    
    //if (links.length === 0)
    //    links = docbase.querySelectorAll('#content > div');
    //http://stackoverflow.com/questions/23423875/merge-two-list-of-elements-returned-by-queryselectorall
    if (links.length === 0)
        links = Array.prototype.slice.call(docbase.querySelectorAll("#content > article.item div.photoset img")) //laminatedlust.tumblr.com/
            .concat(Array.prototype.slice.call(docbase.querySelectorAll("#content > article.item div.photobox > a"))) //tumblr.com/image/
            .concat(Array.prototype.slice.call(docbase.querySelectorAll("#content > article.item div.photoset-row > a")));
        //links = docbase.querySelectorAll("#content > article.item div.photoset-row > a");
        //links = docbase.querySelectorAll("!div.photoset-row > a");
        //links = docbase.querySelectorAll('#content > article.item div.photoset img, #content > article.item div.photobox > a > img');
    
    if (links.length === 0)
        //links = docbase.querySelectorAll('#posts > article div.photo-cover'); //gorgeousfitnessgirls.tumblr.com содержит like_iframe.html
        links = docbase.querySelectorAll('#posts > article > div.wrapper');
    
    if (links.length === 0)
         links = docbase.querySelectorAll('#main > div > article > div'); //fit-and-sexxy.tumblr.com
   
    if (links.length === 0)
        //links = docbase.querySelectorAll('div#photo img'); //hotfitdivas.tumblr.com
        links = docbase.querySelectorAll('div#post #side-permalink > a');
    
    if (links.length === 0)
        links = docbase.querySelectorAll('#allposts > div.box > a:nth-child(1)');
    
    if (links.length === 0)
        links = docbase.querySelectorAll('#posts > div.post > div.content > div.photo > a > img');
    
    if (links.length === 0) 
        links = docbase.querySelectorAll('#posts > div > article.photo > div > section.post > figure > div > div'); //...myhair.tumblr.com
    
    if (links.length === 0) 
        links = docbase.querySelectorAll('#content > div.autopagerize_page_element'); //sirrendre.tumblr.com
    
    if (links.length === 0) 
        links = docbase.querySelectorAll('#content > div > a'); //thecrossfit.es
    
    if (links.length === 0) 
        links = docbase.querySelectorAll('#grid > li > div.post2'); //superbo
    
    if (links.length === 0) 
        links = docbase.querySelectorAll('body article'); //2use.tumblr.com
    
    if (links.length === 0)
         links = docbase.querySelectorAll('article div a'); //babesinjeans.tumblr.com
    
    //links = docbase.querySelectorAll('div.photoset');
    /*var links = [];
    for(var i = 0; i < docbase.length; i++)
    {
        links.push(docbase[i].querySelector('div.post-content > a > img'));
    }*/
    return links;
}; // end GetContainerFromGalleryPage
TumblrRipper.prototype.parsers.GetRefOnPageFromContainer = function (doc) {
    //debugger;
    //если a
    var href;
    var link;
    var high;
    href = doc.getAttribute('href');
    
    if (!href) {
        link = doc.querySelector('a > img');
        if (link) {
            high = link.getAttribute('data-highres');
            if (high)
                return;
            if (link.parentNode) {
                var parent = link.parentNode;
                if(parent)
                {
                    href = parent.getAttribute('href');
                    //if (href) return href;
                }
            }
        }
    }
    
    high = doc.querySelector('div.p > div.h_2 > span.photoset-grid > a'); //2use.tumblr.com
    if (high) {
        return;
        /*debugger;
        link = doc.querySelector('div.p > div.h_2 > a');
        if (link)
             href = parent.getAttribute('href');*/
    }
    
    if (href) {
        //debugger;
        if (href.match('tumblr.com/image/') ||
            href.match('tumblr.com/post/') ||
            href.match('thecrossfit.es/post/') ||
            href.match('thecrossfit.es/image/') )
            return href;
    }
    
    //ищем iframe-ы
    link = doc.querySelector('iframe');
    if (link) {
        href = link.getAttribute('src');
        if (href && href.match('photoset_iframe'))
            return href;
    }
};
TumblrRipper.prototype.parsers.GetDownRefFromContainer = function (doc) {
    //debugger;
    var atr;
    var link = doc.querySelector('a > img');
    if (link) {
        atr = link.getAttribute('data-highres');
        if (atr) return atr;
        
        atr = link.getAttribute('src');
        if (atr) return atr;
    }
    
    link = doc.querySelector('div.photoset_row > a');
    if (link) {
        atr = link.getAttribute('href');
        if (atr) return atr;
    }
    
    link = doc.querySelector('div.p > div.h_2 > span.photoset-grid > a'); //2use.tumblr.com
    if (link) {
        atr = link.getAttribute('href');
        if (atr) return atr;
    }
    
    link = doc.querySelector('img');
    if (link) {
        atr = link.getAttribute('src');
        if (atr) return atr;
    }
    
    if (doc.text === 'High-Res') {
        atr = doc.getAttribute('href');
        if (atr) return atr;
    }
  
    link = doc.querySelector('div.photoset img');
    if (link) {
        atr = link.getAttribute('href');
        if (atr) return atr;
    }
    
    link = doc.querySelector('div.photo-wrapper img');
    if (link) {
        atr = link.getAttribute('src');
        if (atr) return atr;
    }
    
    /*var style = doc.getAttribute('style'); //gorgeousfitnessgirls.tumblr.com
    if (style) {
        var startStr = 'url(';
        var start = style.indexOf(startStr) + startStr.length;
        var end = style.indexOf(')');
        var extract = style.substring(start, end);
        if (extract) return extract;
    }*/
    link = doc.querySelector('div.photo-wrap > a');
    if (link) {
        atr = link.getAttribute('href');
        if (atr) return atr;
    }

    //если ничего не нашлось берем просто ссылку, что плохо
    link = doc.querySelector('a');
    if (link) {
        atr = link.getAttribute('href');
        if (atr) {
            if (atr.endsWith('.jpeg') ||
                atr.endsWith('.jpg') ||
                atr.endsWith('.png') ||
                atr.endsWith('.gif') )
                return atr;
            else
                DebugLog('GetDownRefFromContainer(): Ref ' + atr + ' not match with .jpg,.png,.gif)');
        }
    }
    
    // если сразу img передаем
    atr = doc.getAttribute('src');
    if (atr) return atr;
}; // end GetRefOnPageFromContainer
TumblrRipper.prototype.parsers.GetDescription = function (docbase) {
    //debugger;
    var text;
    var sel;
    var atr;
    
    if (docbase.getAttribute) {
        atr = docbase.getAttribute('alt');
        if (atr) 
            return atr;
    }
    
    sel = docbase.querySelector('div > section.post figcaption.caption');
    if (!sel)
        sel = docbase.querySelector('div.post-caption.typography > blockquote > h2'); //gorgeousfitnessgirls.tumblr.com
    //fit-and-sexxy.tumblr.com
    if (!sel)
        sel = docbase.querySelector('div.photoCaption > blockquote > p:nth-child(1) > b'); 
    if (!sel)
        sel = docbase.querySelector('div.photoCaption > blockquote > p');
    // end fit-and-sexxy.tumblr.com
    if (!sel)
        sel = docbase.querySelector('blockquote > p');
    if (!sel) {
        sel = docbase.querySelector('#content > div.photo > a > img'); //thecrossfit.es
        if (sel) {
            atr = sel.getAttribute('alt');
            if (atr) 
                return atr;
        }
    }
    
    if (sel) {
         text = sel.textContent;
         if (text) {
            text = text.replace(/www.OnlyRippedGirls.com/gi, "");
            text = text.replace(/More Girls on the website/gi, "");
            text = text.trim();
            return text;
        }
    }
    return false;
};
//First level
TumblrRipper.prototype.parsers.GetUrlOnImageFromPage = function (docbase) {
    //debugger;
    var image;
    var ref;
    // случай tumblr.com/image/
    image = docbase.querySelector('#content-image');
    if (image) {
        ref = image.getAttribute('data-src');
        if (ref)
            return ref;
    }
    // случай tumblr.com/post/
    image = docbase.querySelector('#allposts > div > a:nth-child(1) > img');
    if (!image)
        image = docbase.querySelector('#allposts > div > img');
    if (!image)
        image = docbase.querySelector('#photo > center > img'); //hotfitdivas.tumblr.com
    if (!image)
        image = docbase.querySelector('#posts div.photo > a > img'); //sosexyandfit.tumblr.com
    if (!image)
        image = docbase.querySelector('#content > div.photo > a > img'); //thecrossfit.es
    if (image) {
        ref = image.getAttribute('src');
        if (ref)
            return ref;
    }
    //случай iframe
    var images = docbase.querySelectorAll('div.photoset_row > a');
    if (images) {
        var links = [];
        for(var i = 0; i < images.length; i++)
        {
            ref = images[i].getAttribute('href');
            if (ref)
                links.push(ref);
        }
        if (links.length > 0)
            return links;
    }
    //return docbase.querySelector('#content-image').getAttribute('src');
}; // end GetUrlOnImageFromPage
TumblrRipper.prototype.parsers.GetUrlOnPageFromPage = function (docbase) {
    //ищем ссылку на /image
    var img = docbase.querySelector('#content > div > div > a > img');
    if (img) {
        var high = img.getAttribute('data-highres');
        if (!high && img.parentNode) {
            var parent = img.parentNode;
            if(parent)
            {
                href = parent.getAttribute('href');
                if (href && href.match('tumblr.com/image/'))
                    return href;
            }
        }
    }
	return false;
}; //GetUrlOnPageFromPage
TumblrRipper.prototype.parsers.GetUrlOnImageFromPage2 = function (docbase) {
    //throw new Error('Для TumblrRipper не должно быть второго уровня!');
    //debugger;
    var image;
    var ref;
    image = docbase.querySelector('#content-image');
    if (image) {
        ref = image.getAttribute('data-src');
        if (ref)
            return ref;
    }
}; // end GetUrlOnImageFromPage2
var tumblrRipper = new TumblrRipper();


function ready() {
	//alert( 'DOM готов' );
	//alert( "Размеры картинки: " + img.offsetWidth + "x" + img.offsetHeight );
    //debugger;
	DebugLog("Current URL loaded from: " + document.location.href);
	try 
	{
		//DebugLog(kinopoiskRipper.parsers);
		//var t = kinopoiskRipper.parsers.GetButtonLocation();
		//DebugLog(t);
		if(location.href.match('filmz.ru')){
			DebugLog('Запускаем filmzRipper');
			filmzRipper.init();
		}
		else if(location.href.match('kinopoisk.ru')){
            DebugLog('Запускаем kinopoiskRipper');
			kinopoiskRipper.init();
		}
        //x(?!y) 	Находит x, только если за x не следует y. 
        //Например, /\d+(?!\.)/ найдет число, только если за ним не следует десятичная точка. /\d+(?!\.)/.exec("3.141") найдет 141, но не 3.141.
        //else if(location.href.match(/tumblr.com.*(?!iframe)/)){
        else if((location.href.match(/tumblr.com/) || location.href.match(/thecrossfit.es/))  &&
               !location.href.match(/iframe/) &&
               !location.href.match(/analytics.html/) &&
               !location.href.match(/yahoo_cookie_receiver.html/) &&
               !location.href.match("tumblr.com/uncacheable/") &&
               !location.href.match("tumblr.com/video/") ){
            DebugLog('Запускаем TumblrRipper');
			tumblrRipper.init();
		}
		else if(location.href.match('celeber.ru')){
            DebugLog('Запускаем CeleberRipper');
			celeberRipper.init();
		}
        else if(location.href.match('greatmusclebodies.com')){
			greatmusclebodiesRipper.init();
		}
	}
	catch(e)
	{
		alert('Ripper error: ' + e);
	}
}
  

document.addEventListener("DOMContentLoaded", ready, false);
if (baseRipper.isChrome)
    setTimeout(ready, 2000);

/*window.onload = function() 
{
	DebugLog("Current URL loaded from: " + document.location.href);
	try 
	{
		baseRipper.init();
	}
	catch(e)
	{
		alert(e);
	}
};*/

