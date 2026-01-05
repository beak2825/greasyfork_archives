// ==UserScript==
// Do not modify and re-release this script!
// If you would like to add support for other sites, please tell me and I'll put it in the includes.

// @id             youtube-me-again
// @name           YouTube Me Again!
// @namespace      hateradio)))
// @author         hateradio
// @version        8.0.1
// @description    ytma! automatically converts YouTube(TM), Vimeo, Vine, Soundcloud, WebM, and MP4 links into real embedded videos.
// @homepageURL    https://greasyfork.org/en/scripts/1023-youtube-me-again
// @icon           https://www.dropbox.com/s/b85qmq0bsim407s/ytma32.png?dl=1
// @icon64         https://www.dropbox.com/s/5zw3al38yf39wxb/ytma64.png?dl=1
// @screenshot     https://www.dropbox.com/s/syy9916b1prygl9/ytmascreen5.png?dl=1

// @include        https://vine.co/v/*/embed/simple
// @match          https://vine.co/v/*/embed/simple

// @include        https://gfycat.com/iframe/*
// @match          https://gfycat.com/iframe/*

// @include        http*://*.neogaf.com/threads/*
// @include        http*://*.resetera.com/threads/*

// @match          *://*.neogaf.com/threads/*
// @match          *://*.resetera.com/threads/*

// @updated        2020-06-16T08:47:28.845Z

// @grant          GM.xmlhttpRequest
// @grant          GM_xmlhttpRequest

// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/1023/YouTube%20Me%20Again%21.user.js
// @updateURL https://update.greasyfork.org/scripts/1023/YouTube%20Me%20Again%21.meta.js
// ==/UserScript==

/*

## Updates

#### 8.1

* Fix: Checks for supported embeds

#### 8

* Update YTMA to ESNext
* Fix: (XenoForo) YouTube embed

#### 7.9.1

* Fix: (XenoForo) Ignore links in more text areas

#### 7.9

* Fix: (XenoForo) Ignore links in text areas

#### 7.8

* Fix iFrame selectors
* Adds a monitoring interface to check for updated pages

#### 7.7

* New: YTMA will now try to find new links on AJAX-loaded posts on ResetEra
* Reverts Gfycat iFrame support; removes video tag for wider support
* Removes an outdated Chrome blacklist

#### 7.6

* Fix: overrides resetera support of embeded videos

#### 7.5

* New: Support for ResetEra
* Fix: Parses hours from YouTube URLs

#### 7.2.2

* Updates YouTube iFrame to hide related video feature when pausing

#### 7.2.1

* New: Extension info
* Updates JSHint options
* Removes outdated @include links

#### 7.2

* New: CSS rule to make videos fit within smaller windows
* New: GitHub repository and update links
* New: Streamable favicon
* Fix: Vimeo favicon

#### 7.1

* HTTPS links for Vimeo and Gfycat
* Fix: Safari bug

#### 7

* New: NeoGAF HTTPS Support
* New: Streamable.com added
* New: Soundcloud playlist support
* Improved time parser
* Upon scrolling, cached descriptions are shown
* Code reorganization makes adding new media sites easier

### 6

* New: Imgur GIFV (WEBM/MP4) support
* New: Button to remove cache (descriptions/thumbnail links/etc)
* New: SoundCloud playlist support
* Default video quality is now 720p/HD
* Soundcloud now uses HTML5 player
* Players that open on scroll will no longer trigger the opening of players higher on the page
* Adds HTML5, Gfycat, Imgur icons on links
* Improved Soundcloud and GfyCat URL matchers
* Restructured code base to simplify creation of media controls
* Restructured CSS
* Patched back Gfycat iFrame setting for Safari (it is incompatible with new settings)
* Updates YouTube data API
* Removes:
	* Object tag for YouTube for Flash (Deprecated)
	* "Batch" loading of descriptions (Only manual and scroll methods are supported)

// #Updates

Whitelist these sites on NoScript/NotScript/etc.
------------------------------------------------

* neogaf.com
* youtube.com
* youtube-nocookie.com
* googlevideo.com (HTML5 player sends videos from this domain)
* googleapis.com (YT video descriptions)
* vimeo.com
* vimeocdn.com
* soundcloud.com
* sndcdn.com
* vineco.com
* vine.com
* vine.co
* gfycat.com
* github.io


Whitelist these on Ghostery
---------------------------

* SoundCloud (Widgets, Audio / Music Player)

*/


/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_Helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/Helpers */ "./src/modules/Helpers.js");
/* harmony import */ var _modules___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/_ */ "./src/modules/_.js");
/* harmony import */ var _modules_strg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/strg */ "./src/modules/strg.js");
/* harmony import */ var _modules_update__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/update */ "./src/modules/update.js");





(() => {

	/** Y T M A CLASS
	 * @private
	 * Base YTMA class, filled through constructor() or reactivate() though sub-classes
	 * Y's only concerned about the anchor and the data props
	 *
	 * @param {object} props Properties
	 * @param {String|Number} props.id Unique ID
	 * @param {String} props.site Website name eg: youtube, vimeo
	 * @param {HTMLAnchorElement} props.anchor Anchor element
	 */
	class Y {

		constructor({ id, site, anchor }) {
			const uid = Y.escapeId(`${id}_${Y.num += 1}`);

			this.state = {
				id,
				uid: Y.escapeId(uid), // unique id
				sid: Y.escapeId(id), // shared id
				site,
				uri: anchor.href
			};

			if (anchor && !anchor.dataset.ytmscroll) { anchor.dataset.ytmscroll = true; }

			this.anchor = anchor;
		}

		/**
		 * Recreates a YTMA object from a trigger element
		 * @param {HTMLElement} element the element's dataset for the resurection!
		 */
		reactivate({ dataset }) {
			const id = dataset.ytmid;
			const anchor = document.querySelector(`a[data-ytmuid="${dataset.ytmuid}"]`);

			this.state = {
				id,
				uid: dataset.ytmuid,
				sid: dataset.ytmsid,
				site: dataset.ytmsite,
				uri: anchor.href
			};

			this.anchor = anchor;

			return this;
		}

		disableOpenOnScroll() {
			this.anchor.dataset.ytmscroll = false;
		}

		canScroll() {
			return this.anchor.dataset.ytmscroll === 'true';
		}

		isBelow(link) {
			return Scroll.compare(this.anchor, link) < 1;
		}

		canShowUnder(link) {
			this.canScroll() && this.isBelow(link);
		}

		updateAnchor() {
			if (this.anchor.getElementsByTagName('img').length === 0) {
				this.anchor.classList.add('ytm_link', `ytm_link_${this.state.site}`);
			}
			this.anchor.dataset.ytmid = this.state.id;
			this.anchor.dataset.ytmuid = this.state.uid;
			this.anchor.dataset.ytmsid = this.state.sid;
			this.anchor.title = 'Visit the video page.';
		}

	}

	/** C O N T A I N E R CLASS
	 * The container, as the name implies, contains all the interactive elements
	 * Thumbnail, Player, Controls, etc.
	 */
	class Container extends Y {

		createInterface() {
			const { state } = this;
			this.site = Y.DB.sites[state.site];
			const { ajax, slim } = this.site;

			this.updateAnchor();

			this.body = _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('div', {
				id: `w${state.uid}`,
				className: `ytm_spacer ytm_block ytm_site_${state.site}`,
				innerHTML: this.createThumbnailTemplate()
			});

			this.thumbnail = this.body.firstElementChild;

			if (ajax) { this.createAjaxLink(); }
			if (slim) { this.body.classList.add('ytm_site_slim'); }

			this.anchor.insertAdjacentElement('afterend', this.body);

			try {
				Container.decorators[state.site].gui(this);
			} catch (e) {
				// meh
			}
		}

		updateAnchor() {
			const { scroll, https } = this;
			if (scroll) { this.anchor.classList.add('ytm_scroll'); }
			if (https) { this.anchor.href = this.anchor.href.replace('http:', 'https:'); }

			super.updateAnchor();
		}

		createThumbnailTemplate() {
			const { title, thumb = '' } = this.site;
			const { id, uid, sid, site } = this.state;

			const bg = thumb ? `background-image: ${thumb.replace('%key', id)}` : '';

			const template = `
				<span class="ytm_trigger ytm_block ytm_normalize ytm_sans"
					title="${title}"
					data-ytmid="${id}"
					data-ytmsite="${id}"
					style="${bg}">
					<span class="ytm_init ytm_label ytm_sans ytm_box">${title}</span>
						<var class="ytm_label ytm_box"
							data-ytmid="${id}"
							data-ytmuid="${uid}"
							data-ytmsid="${sid}"
							data-ytmsite="${site}">\u25B6</var>
					</span>
				</span>`;
			return template;
		}

		createAjaxLink() {
			const { sid, id, site, uri } = this.state;
			const template = `
				<span class="ytm_bd ytm_normalize ytm_manual _${sid}">
					<a href="#" class="ytm_title" title="Load this video's description."
						data-ytmid="${id}"
						data-ytmsite="${site}"
						data-ytmuri="${uri}"
						data-ytmdescription="true"
					>Load Description</a>
				</span>`;
			this.body.insertAdjacentHTML('beforeend', template);
		}

		createProjector() {
			this.projector = _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('div', {
				className: 'ytm_projector ytm_none ytm_block ytm_normalize ytm_sans',
				innerHTML: Container.templates.menu
			});
			this.thumbnail.insertAdjacentElement('afterend', this.projector);
		}

		showPlayer() {
			this.thumbnail.classList.add('ytm_none');
			this.projector.classList.remove('ytm_none');
		}

		hidePlayer() {
			this.thumbnail.classList.remove('ytm_none');
			this.projector.classList.add('ytm_none');
		}

	}

	Container.templates = {
		menu: `
			<ul class="ytm_options ytm_sans">
				<li>
					<ul class="ytm_ratios">
						<li data-type="ratio" data-value="1" title="SD">4:3</li>
						<li data-type="ratio" data-value="2" title="Landscape">16:9</li>
						<li data-type="ratio" data-value="3" title="Portrait">9:16</li>
					</ul>
				</li>
				<li>
					<ul class="ytm_sizes">
						<li data-type="size" data-value="0" title="Hide the video.">\u00D8</li>
						<li data-type="size" data-value="240" title="240p">S</li>
						<li data-type="size" data-value="360" title="360p">M</li>
						<li data-type="size" data-value="480" title="480p">L</li>
						<li data-type="size" data-value="720" title="720p">X</li>
					</ul>
				</li>
				<li>
					<ul class="ytm_options">
						${_modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].on ? '<li data-type="settings" data-value="" title="YTMA Settings">!</li>' : ''}
						<li data-type="close" data-value="" title="Close the video.">\u00D7</li>
					</ul>
				</li>
			</ul>`
	};

	Container.decorators = { // modify interface according to site
		youtube: {
			gui: function (control) {
				control.anchor.href = this.anchor.href.replace('youtu.be/', 'youtube.com/watch?v=');
			},
			thumbEvent: function (e) {
				let time = +this.dataset.time || 1;
				if (this.classList.contains('ytm_trigger') && e.type === 'mouseenter' && time < 50) {
					this.dataset.thumb = ((this.dataset.thumb || 0) + 1) % 3;
					this.style.backgroundImage = `url(https://i3.ytimg.com/vi/${this.dataset.ytmid}/${(+this.dataset.thumb) + 1}.jpg)`;
					window.clearTimeout(this.dataset.timeout);
					console.log('mouseenter -- clear before setting new ', this.dataset);
					this.dataset.timeout = window.setTimeout(Container.decorators.youtube.thumbEvent.bind(this, e), 800);
					console.log('mouseenter -- new timeout', this.dataset);
					this.dataset.time = time += 1;
				} else {
					window.clearTimeout(this.dataset.timeout);
					this.dataset.time = 0;
					console.log('mouseleave -- ', this.dataset);
				}
			}
		}
	};

	Container.events = {
		setup: () => {
			Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["on"])(document.body, 'click', 'var[data-ytmuid]', Container.events.fromTarget);
			Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["on"])(document.body, 'click', 'a[data-ytmdescription]', Container.events.manualLoad);
			Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["on"])(document.body, 'dblclick', 'q[data-full]', Container.events.titleToggle);

			Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["on"])(document.body, 'mouseenter mouseleave', 'div.ytm_site_youtube span.ytm_trigger', Container.decorators.youtube.thumbEvent);
		},
		fromTarget: ({ target }) => { // trigger the ui
			console.info('ytma//click+trig(id)', target.dataset.ytmuid);
			Control.createFromTrigger(target).showPlayer();
		},
		manualLoad: e => {
			e.preventDefault();
			const { target } = e;
			console.info('ytma//click+desc(id)', target.dataset.ytmid);
			if ((target.dataset.tries || 0) <= 4) {
				Y.ajax.loadFromDataset(target.dataset);
			}
		},
		titleToggle: e => {
			const target = e.target;
			target.classList.toggle('ytm_descr_open');
			target.textContent = target.textContent.length < 140 ? target.dataset.full : `${target.dataset.full.substr(0, 130)} . . .`;
			target.removeAttribute('style');
		}
	};

	Y.num = 0;

	Y.addToSet = ytma => Y.set[ytma.state.uid] = ytma;

	Y.create = link => Y.grabIdAndSite(link, (data, err) => {
		if (err) {
			console.warn(link.href, err);
			return {};
		}

		const control = new Control({ ...data, anchor: link });
		Y.addToSet(control);
		control.createInterface();

		return control;
	});

	Y.grabIdAndSite = (link, cb) => {
		let uri = link.href || link.src;
		let id;
		let match;
		try {
			const site = Y.reg.siteByTest[Y.reg.siteExpressions.test(uri) ? RegExp.lastMatch : ''];
			// console.log(site);

			if (site === 'html5') { // || site === 'html5-audio'
				id = uri.slice(-15);
			} else if (site === 'soundcloud') {
				if (!Y.reg.extra.soundcloud.playlist.test(uri)) {
					link.href = uri = Y.reg.fix.soundcloud(uri);
				}

				match = Y.DB.sites.soundcloud.matcher.exec(uri);
				id = Y.escapeId(match[1]);

				if (match && Y.reg.extra.soundcloud.tracks.test(uri)) {
					id = id.slice(-50);
				}
			} else {
				id = uri.match(Y.DB.sites[site].matcher)[1];
			}

			console.info('ytma//id+site', id, site, match);
			if (id && Y.DB.sites[site]) {
				return cb({ id, site }, null);
			}
			throw TypeError(`Invalid ID/Site: ${id} @ ${site}`);
		} catch (e) {
			return cb(null, e);
		}
	};

	Y.escapeId = id => `${id}`.replace(/(?:\W)/g, '_');

	Y.set = {};

	Y.collect = id => {
		const a = Object.values(Y.set).filter(ytma => ytma && ytma.data.id === id);
		return a;
	};

	Y.route = {
		host: document.location.host.replace('www.', ''),
		control: {
			$: {
				checkStorage: function () {
					if (_modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].full() === true) {
						console.log('YTMA ERROR: Storage is full!');
						try {
							localStorage.removeItem(Y.external.version);
							_modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].on = _modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].test();
						} catch (e) {
							console.error(e);
						}
					}
				},
				runOnce: function (loop) {
					if (!document.body.dataset.ytmaenabled) {
						document.body.dataset.ytmaenabled = true;

						this.checkStorage();

						if (!Y.DB.extension) { _modules_update__WEBPACK_IMPORTED_MODULE_3__["default"].check(); }

						Y.css();
						Y.user.init();
						Y.DB.postInit();

						if (loop) {
							document.body.dataset.YTMA_LOOP = window.setInterval(loop, 5000);
							loop();
						}

						Container.events.setup();
					}
				}
			},
			go: function (host) {
				console.info('ytma//host', host);
				if (/(?:googlevideo|youtube-nocookie\.com|youtube\.com\.?)/i.test(host)) {
					this.sites.youtube();
				} else if (this.sites[host]) {
					this.sites[host]();
				} else {
					this.sites.$generic();
				}
			},
			sites: {
				$generic: function () {
					function loop() {
						if (Y.selector.processor() > 0) {
							Y.user.fn.loadPreferences();
						}

						console.info('ytma//again++');
					}

					Y.route.control.$.runOnce(loop);
				},
				'resetera.com': function () {
					_modules___WEBPACK_IMPORTED_MODULE_1__["default"].css('.ytm_options li ul li { height: 24px !important }');
					_modules___WEBPACK_IMPORTED_MODULE_1__["default"].css('.bbCodeQuote .quoteContainer .quote { max-height: initial } .bbCodeQuote .quoteContainer .quoteExpand.quoteCut { display: none }');
					_modules___WEBPACK_IMPORTED_MODULE_1__["default"].css('.bbCodeQuote .ytm_block iframe, .bbCodeQuote .ytm_block [data-s9e-mediaembed], .bbCodeQuote .ytm_block .fb_iframe_widget, .bbCodeQuote .ytm_block object, .bbCodeQuote .ytm_block embed { max-height: initial; max-width: initial }');
					this.$generic();
				},
				'gfycat.com': function () {
					const v = document.querySelector('video');
					v.controls = true;
					_modules___WEBPACK_IMPORTED_MODULE_1__["default"].css('body,html {overflow:hidden;height:100%;width:100%} video {display:table;height:100%;margin:0 auto;}');
					document.body.appendChild(v);
				},
				'vine.co': function () {
					// console.log('vine.co');

					window.addEventListener('resize', () => {
						_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s('[style]', e => {
							e.removeAttribute('style');
						});
					});
				},
				youtube: function () { // lets force some quality parity
				}
			}
		},
		load: function () {
			this.control.go(this.host);
		}
	};

	Y.main = () => {
		Y.reg.siteExpressions = Y.reg.getAllSiteRegExps();
		// console.log(YTMA.reg.siteExpressions);
		Y.route.load();
	};

	Y.reg = {
		siteExpressions: null,
		time: /(?:t=(?:(\d+)h)?(?:(\d+)m)?(\d+))/,
		ios: /(?:\b(?:ipod|iphone|ipad))\b/i,
		extra: {
			soundcloud: {
				playlist: /(?:soundcloud\.com\/.+\/sets\/)/,
				tracks: /(?:soundcloud\.com\/.+\/tracks\/)/
			}
		},
		siteByTest: {
			youtu: 'youtube',
			vimeo: 'vimeo',
			vine: 'vine',
			gfycat: 'gfycat',
			imgur: 'imgur',
			'.webm': 'html5',
			'.mp4': 'html5',
			// '.mp3': 'html5-audio',
			'.gifv': 'html5',
			soundcloud: 'soundcloud',
			'streamable.com': 'streamable'
		},
		getAllSiteRegExps: function () {
			const regs = Object.values(Y.DB.sites)
				.filter(({ reg }) => reg)
				.map(({ reg }) => reg);

			return new RegExp(`\\b${regs.join('|')}`);
		},
		fix: {
			soundcloud: function (uri) {
				const match = Y.DB.sites.soundcloud.matcher.exec(uri);
				if (match) {
					const id = match[1].split('/', 2).join('/');
					uri = Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["removeSearch"])(`https://soundcloud.com/${id}`, true);
				}

				return uri;
			}
		}
	};

	Y.selector = { // to build the selector
		parentBlacklist: ['.smallfont', '.colhead_dark', '.spoiler', 'pre', '.messageUserInfo', '.fr-box'],
		getAllSiteSelectors: function () {
			const sels = Object.values(Y.DB.sites)
				.filter(({ selector }) => selector)
				.map(({ selector }) => selector);

			return sels.join();
		},
		ignore: function () {
			const ignore = [];
			const all = Y.selector.getAllSiteSelectors().split(',');
			const blacklist = this.parentBlacklist;
			for (let i = 0; i < blacklist.length; i++) {
				for (let j = 0; j < all.length; j++) {
					ignore.push(`${blacklist[i]} ${all[j]}`);
				}
			}
			// console.log(ignore.join(','));
			return ignore.join(',');
		},
		iframes: function () { // for resetera, convert iframes back to anchors
			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s('.message-body iframe', f => {
				if (/vi\/(.+?)\/hqdefault/.test(f.style.backgroundImage)) {
					const src = `https://youtu.be/${RegExp.$1}`;
					const span = f.closest('[data-s9e-mediaembed]');
					span.insertAdjacentHTML('beforebegin', `<a href="${src}">youtube</a>`);
					span.parentElement.removeChild(span);
				}
			});

			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s('[data-s9e-mediaembed-iframe]', s => {
				if (Y.DB.sites[s.dataset.s9eMediaembed]) {
					const dat = JSON.parse(s.dataset.s9eMediaembedIframe);
					const link = dat[dat.length - 1];
					s.parentElement.parentElement.innerHTML = `<a href="${link}">${link}</a>`;
				}
			});
		},
		links: function () {
			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s(Y.selector.ignore(), ({ dataset }) => dataset.ytmaignore = true);

			const links = _modules___WEBPACK_IMPORTED_MODULE_1__["default"].qsa(Y.selector.getAllSiteSelectors()).filter(({ dataset }) => {
				const r = !dataset.ytmaprocessed && !dataset.ytmaignore;
				dataset.ytmaprocessed = true;
				return r;
			});

			return links;
		},
		processor: function () {
			this.iframes();
			const links = this.links();

			if (links.length > 0) {
				links.forEach(Y.create);
			}

			return links.length;
		}
	};

	/**
	 * User Preferences
	 * size: Small (240p), Medium (360p), Large (480p), XL (720p)
	 * ratio: 1 4:3, 2 16:9
	 * quality: 240, 360, 480, 720, 1080
	 * focus: 0/1; Will attempt to set the window's focus near the video
	 * autoShow: 0/1; Will automatically display HTML5 videos, which currently lack descriptions and thumbnails
	 * desc: (Descriptions) 0 None; 1 Yes on scroll; 2 Yes all at once
	 * yt_nocookie: 0/1; Will disable/enable youtube-nocookie.com
	 * yt_annotation: 0/1; youtube annotations
	 */
	Y.user = {
		KEY: 'ytmasetts',
		$form: null,
		init: function () {
			this.load();

			if (_modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].on) {
				this.fn.makeForm();
				this.mark();
			}
		},
		valid: {
			focus: [0, 1],
			desc: [0, 1, 2],
			ratio: [1, 2],
			size: [240, 360, 480, 720],
			quality: [240, 360, 480, 720, 1080],
			autoShow: [0, 1],
			yt_nocookie: [0, 1],
			yt_annotation: [0, 1] // hide | show
		},
		mapping: { // map values to some other values used by an external API, for example
			yt_annotation: [3, 1] // 3 = hide | 1 = show
		},
		validate: function (property, n) {
			n = +n;
			return Y.user.valid[property].includes(n) ? n : Y.user.defaults[property];
		},
		get defaults() {
			return {
				focus: 0,
				desc: 1,
				ratio: 2,
				size: 360,
				quality: 720,
				autoShow: 1,
				yt_nocookie: 0,
				yt_annotation: 1
			};
		},
		load: function () {
			const s = _modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].grab(Y.user.KEY, {});

			Y.user.preferences = Object.keys(this.defaults).reduce((valid, k) => {
				valid[k] = Y.user.validate(k, s[k]);
				return valid;
			}, {});

			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].o(Y.user.mapping, (key, val) => {
				if (!val.hasOwnProperty('indexOf')) {
					Y.user.preferences[key] = val[Y.user.valid[key].indexOf(Y.user.preferences[key])];
				}
			});

			console.info('ytma//user+loaded(prefs)', Y.user.preferences);
		},
		mark: function () {
			const a = {};
			a.ytma__focus = !!Y.user.preferences.focus;
			a.ytma__autoShow = !!Y.user.preferences.autoShow;
			a.ytma__yt_nocookie = !!Y.user.preferences.yt_nocookie;
			a.ytma__yt_annotation = !!Y.user.preferences.yt_annotation;
			a[`ytma__ratio${Y.user.preferences.ratio}`] = true;
			a[`ytma__size${Y.user.preferences.size}`] = true;
			a[`ytma__desc${Y.user.preferences.desc}`] = true;
			a[`ytma__quality${Y.user.preferences.quality}`] = !!Y.user.preferences.quality;

			// console.log('marking', a);
			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].o(a, (id, val) => {
				try {
					const el = document.getElementById(id);
					el.checked = val;
					el.value = val;
				} catch (e) {
					// console.log(id, e);
				}
			});
		},
		events: {
			save: function () {
				// console.log(YTMA.user.$form.querySelectorAll('[data-key]'));
				// [data-key]:checked
				const settings = Array.from(Y.user.$form.querySelectorAll('[data-key]')).reduce((obj, e) => {
					let key = e.dataset.key;

					if (e.type === 'checkbox') {
						obj[key] = +e.checked;
					} else if (e.type === 'radio') {
						if (e.checked) {
							if (e.dataset.num) {
								obj[key] = +e.dataset.num;
							}
						}
					} else {
						obj[key] = +e.value;
					}

					return obj;
				}, {});

				if (_modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].save(Y.user.KEY, settings)) {
					Y.user.load();
				} else {
					Y.user.error.classList.remove('ytm_none');
				}

			},
			reset: function () {
				Y.user.preferences = Y.user.defaults;
				Y.user.mark();
				_modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].wipe(Y.user.KEY);
				Y.user.error.classList.add('ytm_none');
			},
			clear: function () {
				try {
					localStorage.removeItem(Y.external.version);
					Y.user.events.reset();
					console.info('ytma//cache+remove', 'removed all YTMA cache');
				} catch (e) {
					console.error(e);
				}
			},
			formToggle: function (e) {
				if (Y.user.$form && (!e || (e && e.target && !(/(?:INPUT|LABEL)/i).test(e.target.nodeName)))) {
					Y.user.$form.classList.toggle('ytm_none');
				}
			},
			formToggleKeyboard: function (e) {
				// press CTRL+SHIFT+Y (META+SHIFT+Y) to display settings form
				if ((e.ctrlKey || e.metaKey) && e.shiftKey && String.fromCharCode(e.which).toLowerCase() === 'y') {
					e.preventDefault();
					Y.user.events.formToggle();
				}
			}
		},
		fn: {
			$scroller: null,
			$once: false,
			loadPreferences: function () {
				Y.user.fn.onScrollLoadDescriptions(Y.user.preferences.desc === 1);

				this.loadPreferencesOnce();
			},
			loadPreferencesOnce: function () {
				if (this.$once) { return; }

				this.$once = true;

				if (Y.user.preferences.autoShow === 1) {
					Y.user.fn.onScrollViewMedia();
				}
			},
			showMedia: function () {
				// console.info('ytma//user+fn-showMedia');
				return new Scroll('a.ytm_scroll:not([data-ytmscroll="false"])', link => {
					if (Scroll.visibleAll(link, 50)) {
						_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s(`var[data-ytmsid="${link.dataset.ytmsid}"]:not([data-ytmscroll="false"])`, trigger => {
							const ui = Control.createFromTrigger(trigger);
							ui.showOnScroll(link);
						});
					}
				});
			},
			toggleMedia: function () {
				return new Scroll('div.ytm_panel_switcher', div => {
					const v = div.querySelector('video');
					const paused = v && (v.paused || v.ended);
					const ui = Y.set[div.dataset.ytmuid].getControl();

					if (paused && !Scroll.visibleAll(div, 0)) {
						return ui.play.switchStandby();
					}

					if (ui.play.isStandby() && Scroll.visibleAll(div, 200)) {
						return ui.play.switchOn();
					}

					// todo ascertain embedded player properties
					// f = div.querySelector('iframe, object');
					// if (f && !YTMA.Scroll.visibleAll(div, 200)) {
					// 	y.hidePlayer();
					// }
				});
			},
			onScrollViewMedia: function () {
				this.showMedia();
				this.toggleMedia();
			},
			onScrollLoadDescriptions: function (ajax) {
				if (Y.user.fn.$scroller) { Y.user.fn.$scroller.stop(); }

				Y.user.fn.$scroller = new Scroll('span.ytm_manual > a.ytm_title:not(.ytm_error)', a => {
					if (Scroll.visibleAll(a, 200)) {
						if (ajax) {
							Y.ajax.loadFromDataset(a.dataset);
						} else {
							Y.ajax.loadFromCacheDataset(a.dataset);
						}
						// console.log('doc', document.querySelectorAll(YTMA.user.fn.$scroller.selector).length, a.dataset.id);
					}

					if (document.querySelectorAll(Y.user.fn.$scroller.selector).length === 0) {
						Y.user.fn.$scroller.stop();
					}
				});
			},
			makeForm: function () {
				const template = `
					<div id="ytm_settings" class="ytm_sans ytm_block ytm_normalize">
						<form action="" title="Double click to close">
							<div id="ytm_settingst">ytma! Site Settings</div><div class="ytm_field_container">
								<fieldset><legend title="Load descriptions from the content sever.">Load Descriptions</legend><p><span><input id="ytma__desc0" type="radio" data-num="0" name="ytma__desc" data-key="desc"><label for="ytma__desc0" title="Load descriptions on demand">Manually</label></span><span><input id="ytma__desc1" type="radio" data-num="1" name="ytma__desc" data-key="desc"><label for="ytma__desc1" title="Load descriptions as they become visible on the screen.">Automatically, on scrolling</label></span></p></fieldset>
								<fieldset><legend>HTML5 Players</legend><p><input name="ytma__autoShow" data-key="autoShow" id="ytma__autoShow" type="checkbox"><label for="ytma__autoShow">Automatically show WebM, MP4 and Soundcloud players</label></p></fieldset>
								<fieldset><legend>Player Size</legend><p><span><input type="radio" name="ytma__size" data-key="size" data-num="240" id="ytma__size240" /><label for="ytma__size240">S <small>240p</small></label></span><span><input name="ytma__size" data-key="size" type="radio" id="ytma__size360" data-num="360" /><label for="ytma__size360">M <small>360p</small></label></span><span><input type="radio" name="ytma__size" data-key="size" data-num="480" id="ytma__size480" /><label for="ytma__size480">L <small>480p</small></label></span><span><input type="radio" name="ytma__size" data-key="size" data-num="720" id="ytma__size720" /><label for="ytma__size720">X <small>720p</small></label></span></p></fieldset>
								<fieldset><legend>Quality</legend><p><span><input name="ytma__quality" data-key="quality" data-num="240" id="ytma__quality240" type="radio"><label for="ytma__quality240">240p</label></span><span><input name="ytma__quality" data-key="quality" id="ytma__quality360" data-num="360" type="radio"><label for="ytma__quality360">360p</label></span><span><input name="ytma__quality" data-key="quality" data-num="480" id="ytma__quality480" type="radio"><label for="ytma__quality480">480p</label></span><span><input name="ytma__quality" data-key="quality" data-num="720" id="ytma__quality720" type="radio"><label for="ytma__quality720">720p</label></span><span><input name="ytma__quality" data-key="quality" data-num="1080" id="ytma__quality1080" type="radio"><label for="ytma__quality1080">1080p</label></span></p></fieldset>
								<fieldset><legend>Aspect Ratio</legend><p><span><input name="ytma__ratio" data-key="ratio" type="radio" id="ytma__ratio2" data-num="2" /><label for="ytma__ratio2">16:9</label></span><span><input type="radio" name="ytma__ratio" data-key="ratio" data-num="1" id="ytma__ratio1" /><label for="ytma__ratio1">4:3</label></span></p></fieldset>
								<fieldset><legend>YouTube</legend>
									<p><input name="ytma__yt_annotation" data-key="yt_annotation" type="checkbox" id="ytma__yt_annotation" /><label for="ytma__yt_annotation">Enable video annotations</label></p>
									<p><input name="ytma__yt_nocookie" data-key="yt_nocookie" type="checkbox" id="ytma__yt_nocookie" /><label for="ytma__yt_nocookie">Use https://youtube-nocookie.com to load videos</label></p>
								</fieldset>
								<fieldset><legend>Window Focus</legend><p><input name="ytma__focus" data-key="focus" type="checkbox" id="ytma__focus" value="focus" /><label for="ytma__focus">After clicking the thumbnail, set the video at the top of the window.</label></p></fieldset>
							</div>
							<p><small id="ytm_settings_error" class="ytm_error ytm_none ytm_title">Error! Your settings could not be saved.</small></p>
							<p id="ytm_opts">
								<button type="button" id="ytmaclose">Close</button> <button type="button" id="ytmareset">Reset</button> <button type="button" id="ytmaclear" title="Remove all video descriptions that have been cached">Reset & Remove Cache</button>
							</p>
						</form>
					</div>`;

				Y.user.$form = _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('div', { className: 'ytm_fix_center ytm_none ytm_box', innerHTML: template }, document.body);
				Y.user.error = document.getElementById('ytm_settings_error');

				Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["on"])(Y.user.$form, 'keyup click', 'input, label', Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["debounce"])(Y.user.events.save, 500));
				Y.user.$form.addEventListener('submit', e => e.preventDefault(), false);

				document.getElementById('ytmareset').addEventListener('click', Y.user.events.reset, false);
				document.getElementById('ytmaclear').addEventListener('click', Y.user.events.clear, false);

				// close
				Y.user.$form.addEventListener('dblclick', Y.user.events.formToggle, false);
				document.getElementById('ytmaclose').addEventListener('click', Y.user.events.formToggle, false);
				document.body.addEventListener('keydown', Y.user.events.formToggleKeyboard, false);
			}
		}
	};

	Y.css = () => {
		const playerCss = Player.css.generator();
		const loadingIcon = 'data:image/gif;base64,R0lGODlhDgAKAJEAAP///+BKV////wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgACACwAAAAADgAKAAACHFSOeQYI71p6MtAJz41162yBH+do5Ih1kKG0QgEAIfkEBQoAAgAsAAABAA0ACAAAAhSUYGEoerkgdIzKGlu2ET/9ceJmFAAh+QQFCgACACwAAAEADQAIAAACFJRhcbmiglx78SXKYK6za+NxHyYVACH5BAUKAAIALAAAAQANAAgAAAIWVCSAl+hqEGRTLhtbdvTqnlUf9nhTAQAh+QQFCgACACwAAAEADQAIAAACFZRiYCh6uaCRzNXYsKVT+5eBW3gJBQAh+QQJCgACACwAAAAADgAKAAACGpSPaWGwfZhwQtIK8VTUvuxpm9Yp4XlmpiIUADs=';

		// console.log(playerCss);
		_modules___WEBPACK_IMPORTED_MODULE_1__["default"].css(playerCss);

		// images
		// todo update(site, size, padding)
		_modules___WEBPACK_IMPORTED_MODULE_1__["default"].css(`
			.ytm_loading{background:url(${loadingIcon}) 0 3px no-repeat;}
			.ytm_link{position:relative !important;background:url(${Y.DB.sites.youtube.favicon}) 0 center no-repeat !important;margin-left:4px;padding-left:20px!important;}
			.ytm_link.ytm_link_vimeo{background-image:url(${Y.DB.sites.vimeo.favicon}) !important;background-size:12px 12px !important;padding-left:18px!important}
			.ytm_link.ytm_link_vine{background-image:url(${Y.DB.sites.vine.favicon}) !important;background-size:10px 10px!important;padding-left:16px!important}
			.ytm_link.ytm_link_soundcloud{background-image:url(${Y.DB.sites.soundcloud.favicon})!important;padding-left:17px!important}
			.ytm_link.ytm_link_html5{background-image:url(${Y.DB.sites.html5.favicon}) !important;padding-left:16px!important}
			.ytm_link.ytm_link_gfycat{background-image:url(${Y.DB.sites.gfycat.favicon}) !important;background-size:12px 12px !important;padding-left:16px!important;}
			.ytm_link.ytm_link_imgur{background-image:url(${Y.DB.sites.imgur.favicon}) !important;background-size:12px 12px !important;padding-left:16px!important}
			.ytm_link.ytm_link_streamable{background-image:url(${Y.DB.sites.streamable.favicon}) !important; background-size: 12px 12px !important;padding-left: 14px !important;}
		`);

		_modules___WEBPACK_IMPORTED_MODULE_1__["default"].css('.ytm_none,.ytm_link br{display:none!important}.ytm_box{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.ytm_block{display:block;position:relative;clear:both;text-align:left;border:0;margin:0;padding:0;overflow:hidden}.ytm_normalize{font-weight:400!important;font-style:normal!important;line-height:1.2!important}.ytm_sans{font-family:Arial,Helvetica,sans-serif!important}.ytm_spacer{overflow:auto;margin:0 0 6px;padding:4px}.ytm_spacer.ytm_site_slim{display:inline}.ytm_clear:after{content:"";display:table;clear:both}.ytm_center{text-align:center}.ytm_link b,.ytm_link strong{font-weight:400!important}.ytm_link u{text-decoration:none!important}.ytm_link i,.ytm_link em{font-style:normal!important}.ytm_trigger{width:118px;height:66px;background-color:#262626!important;cursor:pointer;background-position:-1px -12px;float:left;box-shadow:2px 2px rgba(0,0,0,.3);background-size:auto 90px!important;color:#fff;text-shadow:#333 0 0 2px;font-size:13px}.ytm_trigger:hover{box-shadow:2px 2px #60656b80;opacity:.95}.ytm_trigger var{z-index:2;height:100%;width:100%;position:absolute;left:0;top:0;text-align:right}.ytm_label{display:block;padding:3px 6px;line-height:1.2;font-style:normal}.ytm_init{height:22px;background:rgba(11,11,11,.62);padding:4px 25px 6px 6px}.ytm_site_vine .ytm_trigger{background-color:#90ee90!important;background-size:120px auto!important}.ytm_site_slim .ytm_trigger{background:#e34c26!important;height:auto;box-shadow:0 0 2px #ffdb9d inset,2px 2px rgba(0,0,0,.3);margin:0 3px 0 0;width:auto;transition:all .3s ease-in-out 0s}.ytm_site_slim .ytm_trigger:hover{opacity:.8}.ytm_site_slim .ytm_label{text-shadow:0 0 1px #f06529}.ytm_site_slim .ytm_init{background:transparent}.ytm_bd{float:left;max-width:450px;margin:2px 10px;font-size:12px}.ytm_title{font-weight:700}.ytm_error{color:#cc2f24;font-style:italic}.ytm_loading{font-style:italic;padding:1px 1.5em}.ytm_descr{word-wrap:break-word;max-height:48px;overflow:auto;padding-right:20px}.ytm_descr[data-full]{cursor:pointer}.ytm_descr_open{resize:both;white-space:pre-line;background:linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 50%,rgba(0,0,0,0) 80%,rgba(0,0,0,0.1) 100%)}.ytm_descr_open[style]{max-height:none}.ytm_projector{margin-bottom:4px}ul.ytm_options{overflow:hidden;margin:0!important;padding:3px 0 1px;list-style-position:outside!important}.ytm_options li{display:inline;margin:0!important;padding:0!important}.ytm_options li>ul{display:inline-block;margin:0;padding:0 1px 0 0}.ytm_options li ul li{-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;user-select:none;list-style-type:none;cursor:pointer;float:left;color:#858585;border:1px solid #1d1d1d;border-bottom:1px solid #181818;border-top:1px solid #292929;box-shadow:0 0 1px #555;height:14px;font-size:12px!important;line-height:12px!important;background:#222;background:linear-gradient(#2d2c2c,#222);margin:0!important;padding:5px 9px 3px!important}.ytm_options li ul li:first-child{border-radius:2px 0 0 2px}.ytm_options li ul li:last-child{border-left:0!important;border-radius:0 2px 2px 0;margin:0 2px 0 0!important}.ytm_options li ul li:first-child:last-child,.ytm_li_setting{border-radius:2px}.ytm_options li ul li:hover{color:#ccc;text-shadow:1px 1px 0 #333;background:#181818}.ytm_options li ul li[id]{color:#ddd;text-shadow:0 0 2px #444}.ytm_panel_size{background:#000;max-width:100%;}.ytm_panel_switcher[data-standby="true"]{background:#111}.ytm_panel_switcher[data-standby="true"]:after{cursor:cell;color:#0e0e0e;content:"ytma!";display:block;font-size:85px;font-style:italic;font-weight:700;left:50%;position:absolute;text-shadow:2px 1px #181818,-1px -1px #0a0a0a;top:50%;transform:translate(-50%,-50%)}.ytm_site_soundcloud .ytm_panel_size.ytm_soundcloud-playlist{height:334px!important}.ytm_fix_center{background:rgba(51,51,51,.41);height:100%;left:0;position:fixed;top:0;width:100%;z-index:99998}#ytm_settings{z-index:99999;max-width:500px;max-height:85%;overflow:auto;background:#fbfbfb;border:1px solid #bbb;color:#444;box-shadow:0 0 5px rgba(0,0,0,.2),0 0 3px rgba(239,239,239,.1) inset;margin:4% auto;padding:4px 8px 0}#ytm_settings p{margin:5px 0;padding:0}#ytm_settings fieldset{vertical-align:top;border-radius:3px;border:1px solid #ccc;margin:0 0 5px;padding:3px}#ytm_settings legend{padding:3px}#ytm_settings fieldset span{display:inline-block;min-width:5em}#ytm_settings input{vertical-align:baseline!important;margin:3px 5px!important}#ytm_settingst{font-size:110%;border-bottom:1px solid #d00;margin:3px 0 9px;padding:0 3px 3px}#ytm_settings label{cursor:pointer}#ytm_settings small{font-size:90%}#ytm_opts button{cursor:pointer;margin:10px 5px 8px 2px;padding:3px;border:1px solid #adadad;border-radius:2px;background:#eee;font-size:90%}#ytm_opts button:hover{background:#ddd}');
	};

	Y.ajax = {
		load: function (site, id, uri) {
			console.info('ytma//ajax+load(id)', site, id, uri);
			uri = Y.DB.sites[site].ajax.replace('%key', id).replace('%uri', uri);

			if (Y.DB.sites[site].ajaxExtension) { return this.gmxhr(uri, site, id); }

			console.info('ytma//ajax+load(uri)', Y.DB.sites[site].ajax.replace('%key', id).replace('%uri', uri));
			if (Y.DB.sites[site].ajax) {
				// console.log('preping uri');
				return this.xhr(uri, site, id);
			}

			return null;
		},
		loadFromDataset: function (dataset) {
			if (!this.loadFromCacheDataset(dataset)) {
				return this.load(dataset.ytmsite, dataset.ytmid, dataset.ytmuri);
			}
		},
		loadFromCacheDataset: function ({ ytmsite, ytmid }) {
			const cache = Y.external.dataFromStorage(ytmsite, ytmid);

			console.info('ytma//ajax+cache(id)', ytmsite, ytmid);
			console.info('ytma//ajax+cache(data)', cache);

			if (cache) { Y.external.populate(cache); }

			return cache;
		},
		gmxhr: function (uri, site, id) {
			try {
				// console.log('gmxhr starting!');
				GM.xmlhttpRequest({
					method: 'GET',
					url: uri,
					onload: function ({ responseText }) {
						// console.log(response);
						Y.external.parse(responseText, site, id);
					},
					onerror: function () {
						console.log('GM Cannot XHR');
						Y.ajax.failure.call({ id });
					}
				});

				Y.ajax.preProcess(id);

			} catch (e) {
				if (Y.DB.extension) {
					console.info('ytma//gmxhr-cors');
					this.xhr(uri, site, id);
				} else {
					console.log('No applicable CORS request available.');
					this.failure.call({ id });
				}
			}
		},
		xhr: function (uri, site, id) {
			const x = new XMLHttpRequest();
			console.info('ytma//xhr', uri, id, site);

			Y.ajax.preProcess(id);

			x.onreadystatechange = function () {
				if (this.readyState === this.DONE) {
					// console.log(this.readyState, this.status);
					if (this.status === 200) {
						Y.external.parse(this.responseText, site, id);
					} else if (this.status === 403) {
						Y.external.populate({ site, id, title: 'Error 403', desc: '' });
						Y.external.save({ site, id, title: 'Error 403', desc: '' });
					} else { // if (this.status >= 400 || this.status === 0) {
						Y.ajax.failure.call({ id });
					}
				}
			};

			try {
				// console.info('ytma//xhr+sending');
				x.open('get', uri, true);
				x.send();
			} catch (e) {
				console.error('ytma//xhr+failed(cannot send xhr)', uri);
				Y.ajax.failure.call({ id });
				console.error(e);
			}
		},
		failure: function () {
			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s(`.ytm_bd._${Y.escapeId(this.id)}`, el => {
				const a = el.querySelector('a');
				a.dataset.tries = a.dataset.tries ? parseFloat(a.dataset.tries) + 1 : 1;
				if (a.dataset.tries >= 5) {
					a.textContent = 'Max attempts reached';
				} else {
					a.textContent = `Error, unable to load data.${a.dataset.tries > 1 ? '' : ' [Retry]'}`;
				}
				a.className = 'ytm_error ytm_title';
			});
		},
		preProcess: function (id) {
			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s(`.ytm_manual._${Y.escapeId(id)} a`, el => {
				el.classList.add('ytm_loading');
				el.textContent = 'Loading';
				el.title = 'Retry loading data.';
			});
		}
	};

	/** E X T E R N A L Apparatus
	 * Data from external sites
	 */
	Y.external = {
		version: 'ytma.4.1.dat',
		parse: function (response, site, id) {
			if (this.parsers[site]) {
				response = Y.DB.sites[site].rawResponse ? response : JSON.parse(response);
				this.populate(this.helper.cutDescription(this.parsers[site](response, id)));
			}
		},
		parsers: {
			soundcloud: function ({ title, description, thumbnail_url }, id) {
				return {
					site: 'soundcloud',
					id, //unescape(j.html).match(/tracks\/(\d+)/)[1],
					title,
					desc: description,
					th: Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["removeSearch"])(thumbnail_url)
				};
			},
			vimeo: function (j) {
				j = j[0];
				return {
					site: 'vimeo',
					id: j.id,
					title: `${j.title} ${Y.external.time.fromSeconds(j.duration)}`,
					desc: j.description.replace(/<br.?.?>/g, ''),
					th: decodeURI(j.thumbnail_medium)
				};
			},
			youtube: function (j, id) {
				if (j.pageInfo.totalResults < 1 || j.items.length === 0) {
					return { id, error: true };
				}

				j = j.items[0];
				const o = {
					site: 'youtube',
					id,
					title: `${j.snippet.title} ${Y.external.time.fromIso8601(j.contentDetails.duration)}`,
					desc: j.snippet.description
					// aspectRatio: j.contentDetails.aspectRatio
				};

				return o;
			},
			vine: function ({ title, thumbnail_url }, id) {
				return {
					site: 'vine',
					id,
					title,
					th: Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["removeSearch"])(thumbnail_url)
				};
			},
			gfycat: function (html, id) {
				if (html) {
					return {
						site: 'gfycat',
						id: id,
						title: id
					};
				}
			},
			streamable: function ({ title }, id) {
				return {
					site: 'streamable',
					id,
					title: title || 'Untitled'
				};
			}
		},
		set: function (data) {
			if (!this.db[data.site]) {
				this.db[data.site] = {};
			}
			this.db[data.site][data.id] = data;
			return this.save();
		},
		unset: function ({ site, id }) {
			// console.log('unset', data.id);
			if (site) {
				delete this.db[site][id];
				return this.save();
			}
		},
		limitDB: function (max, db) {
			// limits an object's items by half of the max
			// removes the older items at the start of the object
			const keys = Object.keys(db);

			const half = Math.floor(max / 2);
			let start;
			let ndb;
			let i;

			if (keys.length > max) {
				ndb = {};
				start = keys.length - half;

				for (i = start; i < keys.length; i++) {
					ndb[keys[i]] = db[keys[i]];
				}
			}

			return ndb || db;
		},
		save: function () {
			this.db = this.limitDB(1000, this.db);
			return _modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].save(this.version, this.db);
		},
		helper: {
			cutDescription: function (data) {
				if (data.desc && data.desc.length > 140) {
					data.full = data.desc;
					data.desc = `${data.desc.substr(0, 130)} . . .`;
				}
				return data;
			},
			thumbnail: function ({ id, th }) {
				_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s(`[data-ytmid="${id}"].ytm_trigger`, el => el.setAttribute('style', `background: url(${th})`));
			}
		},
		time: {
			keepMinutesAndSeconds: function (v, i) {
				return i > 1 || v > 0;
			},
			leadingZero: function (v, i) {
				return i > 0 ? (`00${v}`).slice(-2) : v;
			},
			fromArray: function (a) {
				// [days, hours, mins, secs]
				let b;

				let p = '';

				try {
					// Remove empty values, but keep lower indexes (m:s); a[i] > 0 || i > 1
					// Add leading 0's, ignoring the first index
					// a.slice(0, 1).concat(a.slice(1))
					b = a.filter(this.keepMinutesAndSeconds).map(this.leadingZero);
					p = `(${b.join(':')})`;
				} catch (e) {
					console.error('Could not parse this time.');
				}

				console.info('ytma//time+array', { a, b, p });
				return p;
			},
			fromIso8601: function (iso8601) {
				// eg PT3M, T29S
				let a;

				const parseDigits = reg => {
					if (reg.test(iso8601)) {
						return RegExp.lastParen;
					}
					return 0;
				};

				// P#DT#H#M#S || PT#H#M#S
				a = [/(\d+)D/, /(\d+)H/, /(\d+)M/, /(\d+)S/].map(parseDigits);

				return this.fromArray(a);
			},
			fromSeconds: function (seconds) {
				const a = [
					Math.floor(seconds / 86400) % 24,
					Math.floor(seconds / 3600) % 60,
					Math.floor(seconds / 60) % 60,
					seconds % 60
				];
				return this.fromArray(a);
			}
		},
		validate: function (data) {
			if (!data || !data.id || data.error) {
				return Y.ajax.failure.call(data);
			}

			// todo? empty titles and descriptions should be okay
			// if (data.id && !data.title && !data.desc) {
			// 	this.unset(data.id);
			// 	return YTMA.ajax.failure.call(data);
			// }

			return true;
		},
		populate: function (data, ignoreValidation) {
			if (!ignoreValidation && !this.validate(data)) { return; }

			this.set(data);
			const { id, th, full, desc, title } = data;

			if (th) { this.helper.thumbnail(data); }

			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s(`.ytm_bd._${Y.escapeId(id)}`, el => {
				el.innerHTML = `<span class="ytm_title">${title}</span>`;
				if (desc) {
					const q = _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('q', { className: 'ytm_descr ytm_block', textContent: desc }, el);
					if (full.length > desc.length) {
						q.dataset.full = full;
						q.title = 'Double click to toggle the description.';
					}
				}
			});
		},
		dataFromStorage: function (site, id) {
			if (this.db && this.db[site]) {
				return this.db[site][id];
			}
		}
	};
	Y.external.db = _modules_strg__WEBPACK_IMPORTED_MODULE_2__["default"].grab(Y.external.version, {});

	/** Database */
	Y.DB = {
		postInit: function () {
			if (Y.user.preferences.yt_nocookie) {
				Y.DB.sites.youtube.home = 'https://www.youtube-nocookie.com/';
				Y.DB.sites.youtube.embed = 'https://www.youtube-nocookie.com/embed/%key';
			}
		},
		extension: window.chrome && window.chrome.extension,
		sites: { // supported sites - to add more also make a parser (if api is available) and add an item to sources (if necessary)
			youtube: {
				title: 'ytma!',
				home: 'https://www.youtube.com/',
				embed: 'https://www.youtube.com/embed/%key',
				ajax: `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=%key${window.atob('JmtleT1BSXphU3lEVG5INkxzRERyVElYaFZTZWRQQjlyRHo1czBSczQzZnM=')}`,
				thumb: 'url(https://i3.ytimg.com/vi/%key/1.jpg)',
				selector: 'a[href*="youtube."], a[href*="youtu.be/"]',
				favicon: 'https://www.youtube.com/favicon.ico',
				key: 'id',
				reg: '(youtu)',
				matcher: /(?:(?:(?:v=|#p\/u\/\d*?\/)|(?:v=|#p\/c\/[a-zA-Z0-9]+\/\d*?\/)|(?:embed\/)|(?:v\/)|(?:\.be\/))([A-Za-z0-9-_]{11}))/i,
				https: true
			},
			vimeo: {
				title: 'vimeo too!',
				home: 'https://vimeo.com/',
				embed: 'https://player.vimeo.com/video/%key?badge=0',
				ajax: 'https://vimeo.com/api/v2/video/%key.json',
				selector: 'a[href*="vimeo.com/"]',
				favicon: 'https://f.vimeocdn.com/images_v6/favicon.ico',
				key: 'id',
				reg: '(vimeo)',
				matcher: /(?:vimeo\.com\/(\d+))/i,
				https: true
			},
			vine: {
				title: 'vine me!',
				home: 'https://vine.co/',
				embed: 'https://vine.co/v/%key/embed/simple?audio=1',
				ajaxExtension: true,
				ajax: 'https://vine.co/oembed.json?url=https%3A%2F%2Fvine.co%2Fv%2F%key',
				selector: 'a[href*="vine.co/"]',
				favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABcklEQVQ4jX2SvyvFYRTGP+9NdzAYbpIkysA/ICnKoEwvA4vlUkoyGQzvoOiK4R0YbDLhDhbi9maWIjEqcScWkyRhMNzXcM/3On39OMt5nvOe85wfvSbGyH9mgs8Cq8AUkAMegU1gJVpXqfu3umpbwITiLUBB8HJGuryb4KMJ/izVvUMVnwNjwJPwGYCMkLL4zlT3XoUL0boD4FBNUhO4Fd9ogm9SRVmFn8Una79qgWuV2K3wvcLJdG3iL7TaiUocAI4Fn0vnHDBrgt+L1g2q3NoEl8CH4KHkMVr3CSwI7QeOTPA9WsAk/8AEvw+MSrwrWleuJQVfABZJWbTOZBTfVXg6lbgEHKjQTcL1BFngAWimeuH2aN2LvHUDV1JcjNbl0zdI9l0T2pDsboKvB7Yl/ga4X2+gku+AVqAC9AFzwLik5KN1xT8FRGQEOBL6yfdn2onWTZKyTDoQrSsB60KT4lNSh/1TQETmgQ1ZowQMy41+2BeLRXeRaKuHSAAAAABJRU5ErkJggg==',
				key: 'id',
				reg: '(vine)',
				matcher: /(?:vine\.co\/v\/([A-Za-z0-9-_]{11}))/i
			},
			soundcloud: {
				title: 'sound off!',
				home: 'https://soundcloud.com/',
				embed: 'https://w.soundcloud.com/player/?show_comments=false&url=%key',
				ajax: 'https://soundcloud.com/oembed?format=json&url=%uri',
				favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXZJREFUeNp0UjFOw0AQnD3bCYaEoIgiUIQKikiAKKGgSAkFL0BQ0FEgUfECShpewB+QEE+gokDiBxGRiCCEBBzHd8ucLYGQ4Kw7+9azc7OzJ6oKnFYUxgD+W/DHYNA54GIooifTitYqg1okaPFff6BcTLF5fECYb5IJNJ3kMfUP2dxHPycwcQ0SliARocSGsA46YkKWQW0GS6BDAGlu5Myu84AgSmHKM/DY0NegwwR2+AJrSjBre5BaA1H7GFKpI729QHp9jqiaeTBn5mB7fWirjWB9B9JYBrwEMnop5d0zfD53YO9vYMY8SQcpZGkTZvsIstiivDfoaxfIxt8exYeXCLYOSOwlJZQ6twSpL0DfX4EoZtkCqc7/Njalbxnfdt+oSwhurkBnCWI/1FlgqgKNZ3JnZDSA3FFSpYdQAoF56tKNDmhOYTzJ3OSHXZkflJhYEyawcnH02HpmxZ+DrRJlgmacvrsHRmHln2tRnIiAy5WTLwEGAK4QoBQmtGHkAAAAAElFTkSuQmCC',
				selector: 'a[href*="soundcloud.com/"]',
				key: 'uri',
				reg: '(soundcloud)',
				matcher: /(?:\/\/(?:\bwww|m\.\b)?soundcloud\.com\/(.+?\/.+))/i,
				https: true,
				scroll: true
			},
			gfycat: {
				title: 'gfycat meow!',
				home: 'https://gfycat.com/',
				embed: 'https://gfycat.com/iframe/%key',
				ajaxExtension: true,
				rawResponse: true,
				ajax: 'https://gfycat.com/%key',
				thumb: 'url(https://thumbs.gfycat.com/%key-poster.jpg)',
				selector: 'a[href*="gfycat.com/"]',
				favicon: 'https://gfycat.com/favicon.ico',
				key: 'id',
				reg: '(gfycat)',
				matcher: /(?:gfycat\.com\/(?:(\b(?:[A-Z][a-z]*){3,}\b)))/i,
				https: true,
				scroll: true
			},
			streamable: {
				title: 'streamable!',
				home: 'https://streamable.com/',
				embed: 'https://streamable.com/e/%key',
				ajax: 'https://api.streamable.com/oembed.json?url=%uri',
				thumb: 'url(https://cdn.streamable.com/image/%key.jpg)',
				selector: 'a[href*="streamable.com/"]',
				favicon: 'https://streamable.com/favicon.ico',
				key: 'id',
				reg: '(streamable\\.com)',
				matcher: /(?:streamable\.com\/([A-Za-z0-9-_]+))/i,
				https: true
			},
			imgur: {
				title: 'imgur it!',
				home: 'https://i.imgur.com/',
				embed: 'https://i.imgur.com/%key',
				thumb: 'url(https://i.imgur.com/%keyh.jpg)',
				selector: 'a[href*=".gifv"]',
				favicon: 'https://imgur.com/favicon.ico',
				reg: '(\\.gifv$)|(imgur)',
				matcher: /(?:imgur\.com\/(\w+)\.(?:gifv|mp4|webm))/i,
				https: true,
				scroll: true,
				videoTag: true
			},
			html5: {
				home: true,
				title: 'html5 go!',
				selector: 'a[href*=".webm"], a[href*=".mp4"]',
				favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdlJREFUeNpcks9rE0EUx7+b3TRktxvbhUhrNm6SrUWtxxbxJ9iLl0JFKWg8WLD05EWhIuRieogXwYPX4tGb/gPSq/oP6KH+uG2MFaRJJXaTbp7fWbsl+uDDzLx533lv3ozmeyUM2VlSJxeISULygTwhr5Og1JDgOXlPrpLRMAxTIpLlfJa8Ipv/i56Re4lT07SYKIqQSh2eO0/eqYnujI35HF8O19jr9XBneRmt1je0d3ag63qy5ZIAvNObE+WKTJXKktENoVPsrCntdlsWFxbiNXNJyS3KdMUXxv8w6LzY7XZhmiYer9fBYOTzR5HL5XCzWsWxYhFnTs/gxcYGgiCAZVmOyhR5BVcm8nlZvbsi29+3ZdgGg4Gs1+viua4UJiZVpkiJeqo0VaIqxbGPSKfTORRduXQ59peLx5PyItWaj9yDQtmt21XYto1GoxGvbywtxaNhGHE3ab+V6L6aKYczPo7ZuTk8WnuIWq2G64vX4JU8zJw8BXXv5D21gx+xydrn7VEb/f0+tj5twa/4+Pz1C6Y4Oo6DZrOJdDrdYuxkIlKP+ZbZzoV7e8iyk8kD/9rdRXpkBJlMpsmDC/98I97pPF//AQUBl/2/jRvsm5b1kxmeJgJlfwQYAKZQxgzeI6/EAAAAAElFTkSuQmCC',
				reg: '(\\.webm$)|(\\.mp4$)',
				slim: true,
				scroll: true,
				videoTag: true
			},
			'html5-audio': {
				home: true,
				title: 'hey, listen!',
				selector: 'a[href*=".mp3"]',
				reg: '(\\.mp3$)',
				slim: true,
				scroll: true
			}
		}
	};

	class Control extends Container {
		/** U I CLASS
		 * Class for the player controls
		 * This is the control bar once the user clicks on the thumbnail
		 * Contains its own instance of a Player
		 * Acts like a decorator on the YTMA and Container intances by adding events
		 * @param {Y} ytma A YTMA instance
		 */
		constructor(props) {
			super(props);

			this.open = false;
			this.selected = { size: null, ratio: null };
		}

		getControl() {
			if (!this.projector) {
				this.createProjector();
			}
			return this;
		}

		createProjector() {
			super.createProjector();
			this.projector.addEventListener('click', Control.events.videoBar.bind(this), false);
			this.play = new Player(this);

			this.markSelected(`li[data-type="size"][data-value="${this.play.attrs.size}"]`, 'size');
			this.markSelected(`li[data-type="ratio"][data-value="${this.play.attrs.ratio}"]`, 'ratio');
		}

		resetViewSize() {
			this.play.dimmensions();
			this.setControlBarSize(this.play.attrs.size);
		}

		showOnScroll(link) {
			if (!this.open && this.canShowUnder(link)) {
				this.showPlayer();
			}
		}

		showPlayer() {
			this.open = true;

			super.showPlayer();
			this.attachPlayerPanel();
			this.play.switchOn();

			if (Y.user.preferences.focus) {
				document.location.hash = `#${this.body.id}`;
			}
		}

		hidePlayer() {
			this.open = false;

			this.play.switchOff();
			super.hidePlayer();
		}

		attachPlayerPanel() {
			if (!this.play.panel.parentNode) {
				// console.log('attaching display panel');
				this.projector.appendChild(this.play.panel);
			}
		}

		hideAllPlayers() {
			const group = Y.collect(this.state.id);
			console.info('ytma//hide+all(id)', this.state.id, group.length);
			group.forEach(g => {
				g.disableOpenOnScroll();
				g.getControl().hidePlayer();
			});
		}

		setControlBarSize(size) {
			this.markSelected(`li[data-type="size"][data-value="${size}"]`, 'size');
		}

		markSelected(el, type) {
			if (typeof el === 'string') {
				el = this.projector.querySelector(el);
			}
			el.id = type + this.state.uid;
			try {
				this.selected[type].removeAttribute('id');
			} catch (e) { }
			this.selected[type] = el;
		}
	}

	Control.ratios = {
		SD: 1,
		HD: 2,
		PORTRAIT: 3
	};

	Control.sizes = {
		HIDDEN: 0,
		S: 240,
		M: 360,
		L: 480,
		X: 720
	};

	/** Trigger is the VAR element
	 * @param {HTMLElement} t VAR element
	 */
	Control.createFromTrigger = t => {
		// console.info('ytma//trigger');
		if (t && t.dataset.ytmuid && !Y.set[t.dataset.ytmuid]) {
			console.info('ytma//trigger+new');
			Y.addToSet(new Control().reactivate(t));
		}
		console.info('ytma//trigger+control');
		return Y.set[t.dataset.ytmuid].getControl();
	};

	Control.events = {
		$fire: {
			settings: function () {
				Y.user.events.formToggle();
			},
			close: function () {
				if (this.site.scroll) {
					// console.log('events.close-1');
					this.hideAllPlayers();
				} else {
					// console.log('events.close-2');
					this.disableOpenOnScroll();
					this.hidePlayer();
				}
			},
			ratio: function (li) {
				const ratio = parseInt(li.dataset.value, 10);
				this.play.dimmensions({ ratio });
				this.markSelected(li, 'ratio');
			},
			size: function (li) {
				const size = parseInt(li.dataset.value, 10);
				this.play.dimmensions({ size });
				this.markSelected(li, 'size');
			}
		},
		videoBar: function ({ target }) {
			if (target.tagName.toLowerCase() === 'li' && target.dataset && target.dataset.type) {
				const t = target.dataset.type;
				if (Control.events.$fire[t]) {
					Control.events.$fire[t].call(this, target);
				}
			}
		}
	};

	/** P L A Y E R CLASS
	 *  @param {Control} parent Instance
	 */
	class Player {

		constructor(parent) {
			this.parent = parent;

			this.mode = 'off';

			this.attrs = {
				sources: null,
				quality: this.quality,
				size: null,
				ratio: null,
				start: this.time(),
				type: null
			};

			this.attrs.sources = this.sources;

			// todo improve type/media
			this.attrs.type = this.findType();
			this.media = Player.makeMedia[this.attrs.type](this);

			this.channel = _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('div', { className: 'ytm_panel_channel ytm_block' }, this.media, true);
			this.switcher = _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('div', { className: `ytm_panel_switcher ytm_panel_size ytm_block ytm_${this.attrs.type}`, _ytmuid: this.parent.state.uid, _standby: true });
			this.panel = _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('div', { className: 'ytm_panel ytm_block' }, this.switcher, true);

			if (parent.state.site === 'soundcloud' && Y.reg.extra.soundcloud.playlist.test(parent.anchor.href)) {
				this.media.classList.add('ytm_soundcloud-playlist');
				this.switcher.classList.add('ytm_soundcloud-playlist');
			}

			this.dimmensions(Y.user.preferences);
		}

		get sources() {
			try {
				return (Player.sources[this.parent.state.site] || Player.sources.iframe)(this.parent.state, this.attrs);
			} catch (e) {
				console.error(e);
			}
		}

		get quality() {
			return Player.qualities[Y.user.preferences.quality] || Player.qualities[360];
		}

		get className() {
			return `ytm_panel ytm_block ytm_panel-${Player.dimms.ratios[this.attrs.ratio]} ytm_panel-${Player.dimms.sizes[this.attrs.size]}`;
		}

		dimmensions({ ratio, size }) {
			this.attrs.ratio = Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(ratio) ? ratio : this.attrs.ratio;
			this.attrs.size = Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(size) ? size : this.attrs.size;
			this.panel.className = this.className;
		}

		time() {
			try {
				// debugger;
				const m = this.parent.state.uri.match(Y.reg.time).slice(1, 4);
				return ((+m[0] || 0) * 60 * 60) + ((+m[1] || 0) * 60) + (+m[2] || 0);
			} catch (e) { return 0; }
		}

		findType() {
			if (this.parent.state.site === 'html5-audio') { return 'audio'; }
			if (this.parent.site.videoTag) { return 'video'; }
			return 'iframe';
		}

		switchOff() {
			// console.log('removed media');

			if (this.media.pause) {
				// console.log('pausing');
				this.media.pause();
			}

			try {
				this.switcher.removeChild(this.channel);
			} catch (e) {
				// console.error(e);
			}
			this.mode = 'off';
		}

		switchOn() {
			if (this.attrs.size === 0) {
				this.attrs.size = Y.user.preferences.size;
				this.parent.resetViewSize();
			}
			// console.log('switch to media');
			this.switcher.appendChild(this.channel);
			this.switcher.dataset.standby = false;
			this.mode = 'on';
		}

		switchStandby() {
			// console.log('switch to standby');
			this.switchOff();
			this.switcher.dataset.standby = true;
			this.mode = 'standby';
		}

		isStandby() {
			return this.mode === 'standby';
		}
	}

	Player.sources = {
		iframe: function (data) {
			const key = Y.DB.sites[data.site].key;

			return [
				{ type: 'text/html', src: Y.DB.sites[data.site].embed.replace('%key', data[key]) }
			];
		},
		'html5-audio': function ({ uri }) {
			return [
				{ type: 'audio/mp3', src: uri }
			];
		},
		html5: function ({ uri }) {
			// attaching the type as either mp4 or webm

			if (/(?:webm)/.test(uri)) {
				return [
					{ type: 'video/webm', src: uri }
				];
			}

			return [
				{ type: 'video/mp4', src: uri },
				{ type: 'video/webm', src: uri },
				{ type: 'video/ogg; codecs="theora, vorbis"', src: uri }
			];
		},
		imgur: function ({ id }) {
			const src = Y.DB.sites.imgur.embed.replace('%key', id);

			return [
				{ type: 'video/webm', src: `${src}.webm` },
				{ type: 'video/mp4', src: `${src}.mp4` }
			];
		},
		youtube: function ({ id }, { quality, start }) {
			const params = `?html5=1&version=3&modestbranding=1&rel=0&showinfo=1&vq=${quality}&iv_load_policy=${Y.user.preferences.yt_annotation}&start=${start}&rel=0`;

			return [
				{ type: 'text/html', src: Y.DB.sites.youtube.embed.replace('%key', id) + params }
			];
		}
	};

	Player.dimms = {
		ratios: {
			1: 'sd',
			2: 'hd',
			3: 'pr'
		},
		sizes: {
			0: 'h',
			240: 's',
			360: 'm',
			480: 'l',
			720: 'xl'
		},
		aspects: {
			1: 4 / 3,
			2: 16 / 9,
			3: 16 / 9
		}
	};

	Player.qualities = {
		240: 'small',
		360: 'medium',
		480: 'large',
		720: 'hd720',
		1080: 'hd1080',
		1081: 'highres'
	};

	Player.css = {
		item: function (key, value) {
			if (Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(value)) {
				value += 'px';
			}

			return `\t${key}: ${value};\n`;
		},
		iter: function (css, cssEntries) {
			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].o(cssEntries, (key, value) => {
				css.push(Player.css.item(key, value));
			});
			css.push('}');
		},
		generator: function () {
			const css = [];

			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].o(this.sizes, (size, sizes) => {
				_modules___WEBPACK_IMPORTED_MODULE_1__["default"].o(sizes, (dimm, keys) => {
					css.push(`\n.ytm_panel-${size}.ytm_panel-${dimm} .ytm_panel_size {\n`);
					Player.css.iter(css, keys);
				});
			});

			// add site overrides
			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].o(this.sites, (site, data) => {
				_modules___WEBPACK_IMPORTED_MODULE_1__["default"].o(data, (setting, keys) => {
					if (setting === 'all') {
						css.push(`\n.ytm_site_${site} .ytm_panel_size {\n`);
					} else {
						css.push(`\n.ytm_site_${site} .ytm_panel-${setting} .ytm_panel_size {\n`);
					}
					Player.css.iter(css, keys);
				});
			});

			return css.join('');
		},
		sizes: (() => {
			const merge = {};

			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].o(Player.dimms.sizes, (num, size) => {
				if (num >= 0) {
					merge[size] = {};

					_modules___WEBPACK_IMPORTED_MODULE_1__["default"].o(Player.dimms.ratios, (k, ratio) => {
						if (ratio === 'pr') {
							const w = Math.floor(num * 0.95); // smaller than the normal sizes
							merge[size][ratio] = {
								width: w,
								height: Math.floor(w * Player.dimms.aspects[k])
							};
						} else {
							merge[size][ratio] = {
								width: Math.floor(num * Player.dimms.aspects[k]),
								height: num
							};
						}
					});
				}
			});

			return merge;
		})(),
		sites: { // custom sizes per site
			soundcloud: {
				all: {
					height: '118px !important'
				}
			},
			vine: {
				s: {
					width: 240,
					height: 240
				},
				m: {
					width: 360,
					height: 360
				},
				l: {
					width: 480,
					height: 480
				},
				xl: {
					width: 720,
					height: 720
				}
			}
		}
	};

	Player.makeMedia = {
		$css: function (type) {
			return `ytm_panel_media ytm_panel_size ytm_block ytm_${type}`;
		},
		video: function ({ attrs }) {
			const video = _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('video', {
				controls: true,
				autoplay: false,
				loop: true,
				className: this.$css('video'),
				$allowscriptaccess: true,
				preload: 'metadata'
			});

			const links = [];

			attrs.sources.forEach(({ src, type }) => {
				_modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('source', { src, $type: type }, video);

				links.push(`<a href="${src}">${src}</a>`);
			});

			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('p', { innerHTML: `Could not load source(s): ${links.join('<br />')}` }, video);

			return video;
		},
		iframe: function ({ attrs }) {
			return _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('iframe', {
				$allowfullscreen: true,
				$referrerpolicy: 'no-referrer',
				// $sandbox: 'allow-same-origin allow-scripts allow-popups',
				$type: attrs.sources[0].type,
				src: attrs.sources[0].src,
				className: this.$css('iframe')
			});
		},
		audio: function ({ attrs }) {
			return _modules___WEBPACK_IMPORTED_MODULE_1__["default"].e('audio', {
				src: attrs.sources[0].src,
				$type: attrs.sources[0].type
			});
		}
	};

	/** S C R O L L CLASS
	 * Window-Scroll Event Helper
	 */
	class Scroll {
		constructor(selector, cb, delay = 500) {
			this.selector = selector;
			this.cb = cb;
			this.monitor = this.monitor.bind(this);

			// console.log('YTMA.Scroll Monitor: ', selector);
			this.bound = Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["debounce"])(this.monitor, delay);

			this.bound();
			window.addEventListener('scroll', this.bound, false);
		}

		stop() {
			// console.log('clear scroll: ', this.selector);
			window.removeEventListener('scroll', this.bound);
		}

		monitor() {
			_modules___WEBPACK_IMPORTED_MODULE_1__["default"].s(this.selector, this.cb);
		}
	}

	Scroll.visible = el => {
		const bound = el.getBoundingClientRect();
		return (bound.top >= 0 && bound.top <= document.documentElement.clientHeight);
	};

	Scroll.visibleAll = (el, offset) => {
		const bound = el.getBoundingClientRect();
		const height = document.documentElement.clientHeight;
		offset = Object(_modules_Helpers__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(offset) ? +offset : 0;
		return ((bound.bottom + offset >= 0)
			&& (bound.top <= height + offset || bound.bottom <= height - offset));
	};

	/** Returns 1, 0, -1 when el1 is above, exactly the same, or below el2 */
	Scroll.compare = (el1, el2) => {
		const a = el1.getBoundingClientRect().y;
		const b = el2.getBoundingClientRect().y;

		if (a < b) { return 1; }
		if (a === b) { return 0; }
		return -1;
	};


	Y.main();
})();


/***/ }),

/***/ "./src/modules/Helpers.js":
/*!********************************!*\
  !*** ./src/modules/Helpers.js ***!
  \********************************/
/*! exports provided: isNumber, removeSearch, on, debounce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNumber", function() { return isNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeSearch", function() { return removeSearch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "on", function() { return on; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
if (!Element.prototype.matches)
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);

const removeSearch = (uri, keepHash) => {
	// removes search query from a uri
	const s = uri.indexOf('?');
	const h = uri.indexOf('#');
	let hash = '';
	if (s > -1) {
		if (keepHash && h > -1) {
			hash = uri.substr(h);
		}
		uri = uri.substr(0, s) + hash;
	}
	return uri;
};

/**
 * @param {HTMLElement} element HTML element
 * @param {string} events Space- or coma-separated string of one or more types, eg "click dblclick"
 * @param {string} selector CSS selector for the elements to trigger the event on
 * @param {Function} listener A callback
 * @param {Boolean} cancel Cancel
 */
const on = (element, events, selector, listener, cancel = true) => {
	events = events.split(/(?:\s+|,)/).filter(f => f);

	if (events.length === 0) return;

	const fn = event => {
		const found = event.target.closest(selector);
		if (found) listener.call(found, event);
	};

	events.forEach(type => element.addEventListener(type, fn, cancel));
};

const debounce = (fn, delay = 250) => {
	let timeout;

	return function (...args) {
		const timed = () => {
			timeout = null;
			fn.apply(this, args);
		};

		window.clearTimeout(timeout);
		timeout = window.setTimeout(timed, delay);
	};
};

/***/ }),

/***/ "./src/modules/_.js":
/*!**************************!*\
  !*** ./src/modules/_.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// H E L P E R Handle
const _ = {
	s: (selector, cb) => {
		const elements = _.qsa(selector);
		elements.some((element, index) => cb(element, index, elements) === false);
	},
	o: function (object, cb) {
		Object.keys(object).some(key => cb(key, object[key], object) === false);
	},
	e: function (t, o, e, p) {
		const c = document.createElement(t);
		_.o(o, (k, v) => {
			const b = k.charAt(0);
			if (b === '_')
				c.dataset[k.substring(1)] = v;
			else if (b === '$')
				c.setAttribute(k.substring(1), v);
			else
				c[k] = v;
		});

		if (e && p) {
			c.appendChild(e);
		} else if (e) {
			e.appendChild(c);
		}
		return c;
	},
	qsa: selector => Array.from(document.querySelectorAll(selector)),
	css: function (text) {
		if (!this.style) {
			this.style = document.createElement('style');
			this.style.type = 'text/css';
			document.body.appendChild(this.style);
		}
		this.style.appendChild(document.createTextNode(`${text}\n`));
	},
	js: t => {
		const j = document.createElement('script');
		j.type = 'text/javascript';
		j[/^https?:\/\//i.test(t) ? 'src' : 'textContent'] = t;
		document.head.appendChild(j);
	}
};

/* harmony default export */ __webpack_exports__["default"] = (_);

/***/ }),

/***/ "./src/modules/strg.js":
/*!*****************************!*\
  !*** ./src/modules/strg.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// S T O R A G E HANDLE
const strg = {
	MAX: 5012,
	on: false,
	test: () => {
		try {
			const l = localStorage;
			const c = Math.random().toString(16).substr(2, 8);
			l.setItem(c, c);
			return l.getItem(c) === c ? !l.removeItem(c) : false;
		} catch (e) { return false; }
	},
	read: (key) => {
		try {
			return JSON.parse(localStorage.getItem(key));
		} catch (e) {
			return console.error(`${e.lineNumber}:${e.message}`);
		}
	},
	save: (key, val) => strg.on ? !localStorage.setItem(key, JSON.stringify(val)) : false,
	wipe: key => strg.on ? !localStorage.removeItem(key) : false,
	zero: o => { for (let k in o) { if (o.hasOwnProperty(k)) { return false; } } return true; }, // check if the object is empty
	grab: (key, def) => { const s = strg.read(key); return strg.zero(s) ? def : s; },
	size: () => {
		let length = 0;
		let key;
		try {
			for (key in window.localStorage) {
				if (window.localStorage.hasOwnProperty(key)) {
					length += window.localStorage[key].length;
				}
			}
		} catch (e) {
			// no more space
		}
		return 3 + ((length * 16) / (8 * 1024));
	},
	full: () => {
		try {
			const date = +(new Date());
			localStorage.setItem(date, date);
			localStorage.removeItem(date);
			return false;
		} catch (e) {
			if (e.name === 'QuotaExceededError' ||
					e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
				return true;
			}
		}
	},
	init: () => { strg.on = strg.test(); }
};
strg.init();

/* harmony default export */ __webpack_exports__["default"] = (strg);

/***/ }),

/***/ "./src/modules/update.js":
/*!*******************************!*\
  !*** ./src/modules/update.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _strg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./strg */ "./src/modules/strg.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_ */ "./src/modules/_.js");



// U P D A T E HANDLE
const update = {
	name: 'ytma!',
	version: 8010,
	key: 'ujs_YTMA_UPDT_HR',
	callback: 'ytmaupdater',
	page: 'https://greasyfork.org/scripts/1023-youtube-me-again',
	json: 'https://hateradio.github.io/ytma/update.json',
	interval: 7,
	day: (new Date()).getTime(),
	show: false,
	time: () => new Date(update.day + (1000 * 60 * 60 * 24 * update.interval)).getTime(),
	notification: ({ version, page }) => {
		if (update.version < version) {
			_strg__WEBPACK_IMPORTED_MODULE_0__["default"].save(update.key, { date: update.time(), version, page });
			update.link();
		}
	},
	link: () => {
		if (update.show) { return; }
		update.show = true;

		const { page } = _strg__WEBPACK_IMPORTED_MODULE_0__["default"].read(update.key);
		const link = `
				<a href="${page || update.page}" id=updatev3 title=Update target=_blank>
					An update for ${update.name} is available.
				</a>`;

		___WEBPACK_IMPORTED_MODULE_1__["default"].css(update.css);
		document.body.insertAdjacentHTML('beforeend', link);
		___WEBPACK_IMPORTED_MODULE_1__["default"].on(document.body, 'click', '#updatev3', e => e.target.style.display = 'none');
	},
	check: (opt) => {
		if (!_strg__WEBPACK_IMPORTED_MODULE_0__["default"].on) { return; }
		if (window.chrome && window.chrome.extension) { return; }
		const stored = _strg__WEBPACK_IMPORTED_MODULE_0__["default"].read(update.key);
		let page;

		if (opt || !stored || stored.date < update.day) {
			page = (stored && stored.page) || update.page;
			_strg__WEBPACK_IMPORTED_MODULE_0__["default"].save(update.key, { date: update.time(), version: update.version, page });
			fetch(update.json).then(res => res.json()).then(update.notification);
		} else if (update.version < stored.version) {
			update.link();
		}
	},
	css: '#updater3,#updater3:visited{box-shadow:1px 1px 6px #7776;border-bottom:3px solid #e39c2d;cursor:pointer;color:#555;font-family:sans-serif;font-size:12px;font-weight:700;text-align:justify;position:fixed;z-index:999999;right:10px;top:10px;background:#ebebeb url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTM0IDUxMiA1MTIiPjxwYXRoIGZpbGw9IiNlNWViZjUiIGQ9Ik0yNzAuNzgxIDcuNUgyNDEuMjJMOC42NiA0MTAuMzA1bDE0Ljc4MSAyNS42MDFINDg4LjU2bDE0Ljc4LTI1LjYwMXptMCAwIi8+PHBhdGggZmlsbD0iI2Y4ZTg2OCIgZD0iTTQ4LjcwNyA0MDAuOTM0TDI1My4xMjkgNDYuODY3aDUuNzQybDIwNC40MjIgMzU0LjA2N2MtMS4yNzcgMi4yMS0xLjU5NCAyLjc2NS0yLjg3MSA0Ljk3Nkg1MS41NzhjLTEuMjc3LTIuMjEtMS41OTQtMi43NjUtMi44NzEtNC45NzZ6bTAgMCIvPjxwYXRoIGZpbGw9IiNlMzljMmQiIGQ9Ik0yNzUuOTk2IDc2LjUyN2wtMTcuMTI1LTI5LjY2aC01Ljc0Mkw0OC43MDcgNDAwLjkzNGMxLjI3NyAyLjIxIDEuNTk0IDIuNzY1IDIuODcxIDQuOTc2aDM5Ljk5NmMtMS4yNzctMi4yMS0xLjU5Ny0yLjc2NS0yLjg3LTQuOTc2em0wIDAiLz48cGF0aCBmaWxsPSIjY2FkOGVhIiBkPSJNMjc1Ljk5NiAxNi41MzVMMjcwLjc4MSA3LjVIMjQxLjIyTDguNjYgNDEwLjMwNWM2LjU2NyAxMS4zNzkgOC4yMTEgMTQuMjIyIDE0Ljc4MSAyNS42MDFoMzkuOTk2Yy02LjU3LTExLjM3OS04LjIxNC0xNC4yMjItMTQuNzgtMjUuNjAxem0wIDAiLz48cGF0aCBmaWxsPSIjNzI4NjllIiBkPSJNMjcwLjg1NSAzMDIuNDU3aC0yOS43MWMtMy4wMDQtMy4wMDQtNC42OTItNC42ODctNy42OTYtNy42OTFWMTYzLjg2M2g0NS4xMDJ2MTMwLjkwM2MtMy4wMDggMy4wMDQtNC42OTIgNC42ODctNy42OTYgNy42OTF6bTAgMCIvPjxwYXRoIGZpbGw9IiM1MzYyNzUiIGQ9Ik0yNTMuNDUgMTYzLjg2M2gtMjB2MTMwLjkwM2MzLjAwMyAzLjAwNCA0LjY5IDQuNjg3IDcuNjk1IDcuNjkxaDE5Ljk5NmwtNy42OTItNy42OTF6bTAgMCIvPjxwYXRoIGZpbGw9IiM3Mjg2OWUiIGQ9Ik0yMzMuNDUgMzMwLjgxM2g0NS4xdjQ1LjEwMWgtNDUuMXptMCAwIi8+PHBhdGggZmlsbD0iIzUzNjI3NSIgZD0iTTIzMy40NSAzMzAuODEzaDIwdjQ1LjEwMWgtMjB6bTAgMCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yNzUuOTk2IDE0MS4zNjdIMjYxdi0xNWgxNC45OTZ6bS0yNC45OTYgMGgtMTV2LTE1aDE1em0wIDAiLz48cGF0aCBkPSJNNDAwLjQzIDIxNy4wNTlsLTEyLjk4OSA3LjVMNDk0LjY4IDQxMC4zMDVsLTEwLjQ1IDE4LjEwMUgyNy43N2wtMTAuNDU0LTE4LjEwMUwyNDUuNTQ2IDE1aDIwLjkwN2wxMDcuMjM4IDE4NS43NDYgMTIuOTg5LTcuNUwyNzUuMTEzIDBoLTM4LjIyMkwwIDQxMC4zMDVsMTkuMTEgMzMuMTAxaDQ3My43NzdMNTEyIDQxMC4zMDV6bTAgMCIvPjxwYXRoIGQ9Ik0xMjUuMTU2IDQxMy40MDZINDY0Ljc1bDcuMjAzLTEyLjQ3Mi0yMDguNzUtMzYxLjU2N2gtMTQuNDA2TDQwLjA0NyA0MDAuOTM0bDcuMiAxMi40NzJoNTcuOTEzVjM5OC40MUg1OC44MjRMMjU2IDU2Ljg5bDE5Ny4xNzYgMzQxLjUyaC0zMjguMDJ6bTAgMCIvPjxwYXRoIGQ9Ik0yODYuMDQ3IDIyOS41NTl2LTczLjE5NmgtNjAuMDk4djE0MS41MDhsMTIuMDkgMTIuMDg2aDM1LjkyMmwxMi4wODYtMTIuMDg2VjI0OS41NkgyNzEuMDV2NDIuMDk3bC0zLjMwMSAzLjMwNWgtMjMuNWwtMy4zLTMuMzA1VjE3MS4zNjNoMzAuMXY1OC4xOTZ6bTAgME0yMjUuOTUgMzgzLjQxaDYwLjA5N3YtNjAuMDk4aC02MC4wOTh6bTE1LTQ1LjA5OGgzMC4xdjMwLjEwMmgtMzAuMXptMCAwIi8+PC9zdmc+) no-repeat 10px center;background-size:40px;padding:0 20px 0 60px;height:55px;line-height:55px}#updater3:hover,#updater3:visited:hover{color:#b33a3a !important;border-color:#ce4b30;text-decoration: none;}' // Icon made by Freepik from www.flaticon.com 
};
update.check();

/* harmony default export */ __webpack_exports__["default"] = (update);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9tb2R1bGVzL0hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZHVsZXMvXy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kdWxlcy9zdHJnLmpzIiwid2VicGFjazovLy8uL3NyYy9tb2R1bGVzL3VwZGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtB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QUFDQSxFQUFFLHlDQUFDO0FBQ0gsRUFBRTtBQUNGO0FBQ0EsT0FBTyw2Q0FBSSxNQUFNLFFBQVE7QUFDekIsaURBQWlELFFBQVE7QUFDekQsaUJBQWlCLDZDQUFJO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQSxHQUFHLDZDQUFJLG1CQUFtQixxREFBcUQ7QUFDL0U7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUU7QUFDRixtQ0FBbUMsNkJBQTZCLGdDQUFnQyxlQUFlLFdBQVcsdUJBQXVCLGVBQWUsZ0JBQWdCLG1CQUFtQixlQUFlLGVBQWUsV0FBVyxTQUFTLDBDQUEwQyxteEVBQW14RSxxQkFBcUIsc0JBQXNCLFlBQVksaUJBQWlCLHdDQUF3Qyx5QkFBeUIscUJBQXFCLHVCQUF1QjtBQUN2dUY7QUFDQTs7QUFFZSxxRUFBTSxFIiwiZmlsZSI6Inl0bWEudXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiaW1wb3J0IHsgaXNOdW1iZXIsIHJlbW92ZVNlYXJjaCwgb24sIGRlYm91bmNlIH0gZnJvbSAnLi9tb2R1bGVzL0hlbHBlcnMnO1xyXG5pbXBvcnQgXyBmcm9tICcuL21vZHVsZXMvXyc7XHJcbmltcG9ydCBzdHJnIGZyb20gJy4vbW9kdWxlcy9zdHJnJztcclxuaW1wb3J0IHVwZGF0ZSBmcm9tICcuL21vZHVsZXMvdXBkYXRlJztcclxuXHJcbigoKSA9PiB7XHJcblxyXG5cdC8qKiBZIFQgTSBBIENMQVNTXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBCYXNlIFlUTUEgY2xhc3MsIGZpbGxlZCB0aHJvdWdoIGNvbnN0cnVjdG9yKCkgb3IgcmVhY3RpdmF0ZSgpIHRob3VnaCBzdWItY2xhc3Nlc1xyXG5cdCAqIFkncyBvbmx5IGNvbmNlcm5lZCBhYm91dCB0aGUgYW5jaG9yIGFuZCB0aGUgZGF0YSBwcm9wc1xyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtvYmplY3R9IHByb3BzIFByb3BlcnRpZXNcclxuXHQgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHByb3BzLmlkIFVuaXF1ZSBJRFxyXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wcy5zaXRlIFdlYnNpdGUgbmFtZSBlZzogeW91dHViZSwgdmltZW9cclxuXHQgKiBAcGFyYW0ge0hUTUxBbmNob3JFbGVtZW50fSBwcm9wcy5hbmNob3IgQW5jaG9yIGVsZW1lbnRcclxuXHQgKi9cclxuXHRjbGFzcyBZIHtcclxuXHJcblx0XHRjb25zdHJ1Y3Rvcih7IGlkLCBzaXRlLCBhbmNob3IgfSkge1xyXG5cdFx0XHRjb25zdCB1aWQgPSBZLmVzY2FwZUlkKGAke2lkfV8ke1kubnVtICs9IDF9YCk7XHJcblxyXG5cdFx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRcdGlkLFxyXG5cdFx0XHRcdHVpZDogWS5lc2NhcGVJZCh1aWQpLCAvLyB1bmlxdWUgaWRcclxuXHRcdFx0XHRzaWQ6IFkuZXNjYXBlSWQoaWQpLCAvLyBzaGFyZWQgaWRcclxuXHRcdFx0XHRzaXRlLFxyXG5cdFx0XHRcdHVyaTogYW5jaG9yLmhyZWZcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmIChhbmNob3IgJiYgIWFuY2hvci5kYXRhc2V0Lnl0bXNjcm9sbCkgeyBhbmNob3IuZGF0YXNldC55dG1zY3JvbGwgPSB0cnVlOyB9XHJcblxyXG5cdFx0XHR0aGlzLmFuY2hvciA9IGFuY2hvcjtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJlY3JlYXRlcyBhIFlUTUEgb2JqZWN0IGZyb20gYSB0cmlnZ2VyIGVsZW1lbnRcclxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgdGhlIGVsZW1lbnQncyBkYXRhc2V0IGZvciB0aGUgcmVzdXJlY3Rpb24hXHJcblx0XHQgKi9cclxuXHRcdHJlYWN0aXZhdGUoeyBkYXRhc2V0IH0pIHtcclxuXHRcdFx0Y29uc3QgaWQgPSBkYXRhc2V0Lnl0bWlkO1xyXG5cdFx0XHRjb25zdCBhbmNob3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBhW2RhdGEteXRtdWlkPVwiJHtkYXRhc2V0Lnl0bXVpZH1cIl1gKTtcclxuXHJcblx0XHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdFx0aWQsXHJcblx0XHRcdFx0dWlkOiBkYXRhc2V0Lnl0bXVpZCxcclxuXHRcdFx0XHRzaWQ6IGRhdGFzZXQueXRtc2lkLFxyXG5cdFx0XHRcdHNpdGU6IGRhdGFzZXQueXRtc2l0ZSxcclxuXHRcdFx0XHR1cmk6IGFuY2hvci5ocmVmXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR0aGlzLmFuY2hvciA9IGFuY2hvcjtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRpc2FibGVPcGVuT25TY3JvbGwoKSB7XHJcblx0XHRcdHRoaXMuYW5jaG9yLmRhdGFzZXQueXRtc2Nyb2xsID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Y2FuU2Nyb2xsKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5hbmNob3IuZGF0YXNldC55dG1zY3JvbGwgPT09ICd0cnVlJztcclxuXHRcdH1cclxuXHJcblx0XHRpc0JlbG93KGxpbmspIHtcclxuXHRcdFx0cmV0dXJuIFNjcm9sbC5jb21wYXJlKHRoaXMuYW5jaG9yLCBsaW5rKSA8IDE7XHJcblx0XHR9XHJcblxyXG5cdFx0Y2FuU2hvd1VuZGVyKGxpbmspIHtcclxuXHRcdFx0dGhpcy5jYW5TY3JvbGwoKSAmJiB0aGlzLmlzQmVsb3cobGluayk7XHJcblx0XHR9XHJcblxyXG5cdFx0dXBkYXRlQW5jaG9yKCkge1xyXG5cdFx0XHRpZiAodGhpcy5hbmNob3IuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdHRoaXMuYW5jaG9yLmNsYXNzTGlzdC5hZGQoJ3l0bV9saW5rJywgYHl0bV9saW5rXyR7dGhpcy5zdGF0ZS5zaXRlfWApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuYW5jaG9yLmRhdGFzZXQueXRtaWQgPSB0aGlzLnN0YXRlLmlkO1xyXG5cdFx0XHR0aGlzLmFuY2hvci5kYXRhc2V0Lnl0bXVpZCA9IHRoaXMuc3RhdGUudWlkO1xyXG5cdFx0XHR0aGlzLmFuY2hvci5kYXRhc2V0Lnl0bXNpZCA9IHRoaXMuc3RhdGUuc2lkO1xyXG5cdFx0XHR0aGlzLmFuY2hvci50aXRsZSA9ICdWaXNpdCB0aGUgdmlkZW8gcGFnZS4nO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdC8qKiBDIE8gTiBUIEEgSSBOIEUgUiBDTEFTU1xyXG5cdCAqIFRoZSBjb250YWluZXIsIGFzIHRoZSBuYW1lIGltcGxpZXMsIGNvbnRhaW5zIGFsbCB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudHNcclxuXHQgKiBUaHVtYm5haWwsIFBsYXllciwgQ29udHJvbHMsIGV0Yy5cclxuXHQgKi9cclxuXHRjbGFzcyBDb250YWluZXIgZXh0ZW5kcyBZIHtcclxuXHJcblx0XHRjcmVhdGVJbnRlcmZhY2UoKSB7XHJcblx0XHRcdGNvbnN0IHsgc3RhdGUgfSA9IHRoaXM7XHJcblx0XHRcdHRoaXMuc2l0ZSA9IFkuREIuc2l0ZXNbc3RhdGUuc2l0ZV07XHJcblx0XHRcdGNvbnN0IHsgYWpheCwgc2xpbSB9ID0gdGhpcy5zaXRlO1xyXG5cclxuXHRcdFx0dGhpcy51cGRhdGVBbmNob3IoKTtcclxuXHJcblx0XHRcdHRoaXMuYm9keSA9IF8uZSgnZGl2Jywge1xyXG5cdFx0XHRcdGlkOiBgdyR7c3RhdGUudWlkfWAsXHJcblx0XHRcdFx0Y2xhc3NOYW1lOiBgeXRtX3NwYWNlciB5dG1fYmxvY2sgeXRtX3NpdGVfJHtzdGF0ZS5zaXRlfWAsXHJcblx0XHRcdFx0aW5uZXJIVE1MOiB0aGlzLmNyZWF0ZVRodW1ibmFpbFRlbXBsYXRlKClcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLnRodW1ibmFpbCA9IHRoaXMuYm9keS5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHJcblx0XHRcdGlmIChhamF4KSB7IHRoaXMuY3JlYXRlQWpheExpbmsoKTsgfVxyXG5cdFx0XHRpZiAoc2xpbSkgeyB0aGlzLmJvZHkuY2xhc3NMaXN0LmFkZCgneXRtX3NpdGVfc2xpbScpOyB9XHJcblxyXG5cdFx0XHR0aGlzLmFuY2hvci5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgdGhpcy5ib2R5KTtcclxuXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0Q29udGFpbmVyLmRlY29yYXRvcnNbc3RhdGUuc2l0ZV0uZ3VpKHRoaXMpO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0Ly8gbWVoXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR1cGRhdGVBbmNob3IoKSB7XHJcblx0XHRcdGNvbnN0IHsgc2Nyb2xsLCBodHRwcyB9ID0gdGhpcztcclxuXHRcdFx0aWYgKHNjcm9sbCkgeyB0aGlzLmFuY2hvci5jbGFzc0xpc3QuYWRkKCd5dG1fc2Nyb2xsJyk7IH1cclxuXHRcdFx0aWYgKGh0dHBzKSB7IHRoaXMuYW5jaG9yLmhyZWYgPSB0aGlzLmFuY2hvci5ocmVmLnJlcGxhY2UoJ2h0dHA6JywgJ2h0dHBzOicpOyB9XHJcblxyXG5cdFx0XHRzdXBlci51cGRhdGVBbmNob3IoKTtcclxuXHRcdH1cclxuXHJcblx0XHRjcmVhdGVUaHVtYm5haWxUZW1wbGF0ZSgpIHtcclxuXHRcdFx0Y29uc3QgeyB0aXRsZSwgdGh1bWIgPSAnJyB9ID0gdGhpcy5zaXRlO1xyXG5cdFx0XHRjb25zdCB7IGlkLCB1aWQsIHNpZCwgc2l0ZSB9ID0gdGhpcy5zdGF0ZTtcclxuXHJcblx0XHRcdGNvbnN0IGJnID0gdGh1bWIgPyBgYmFja2dyb3VuZC1pbWFnZTogJHt0aHVtYi5yZXBsYWNlKCcla2V5JywgaWQpfWAgOiAnJztcclxuXHJcblx0XHRcdGNvbnN0IHRlbXBsYXRlID0gYFxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwieXRtX3RyaWdnZXIgeXRtX2Jsb2NrIHl0bV9ub3JtYWxpemUgeXRtX3NhbnNcIlxyXG5cdFx0XHRcdFx0dGl0bGU9XCIke3RpdGxlfVwiXHJcblx0XHRcdFx0XHRkYXRhLXl0bWlkPVwiJHtpZH1cIlxyXG5cdFx0XHRcdFx0ZGF0YS15dG1zaXRlPVwiJHtpZH1cIlxyXG5cdFx0XHRcdFx0c3R5bGU9XCIke2JnfVwiPlxyXG5cdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJ5dG1faW5pdCB5dG1fbGFiZWwgeXRtX3NhbnMgeXRtX2JveFwiPiR7dGl0bGV9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHQ8dmFyIGNsYXNzPVwieXRtX2xhYmVsIHl0bV9ib3hcIlxyXG5cdFx0XHRcdFx0XHRcdGRhdGEteXRtaWQ9XCIke2lkfVwiXHJcblx0XHRcdFx0XHRcdFx0ZGF0YS15dG11aWQ9XCIke3VpZH1cIlxyXG5cdFx0XHRcdFx0XHRcdGRhdGEteXRtc2lkPVwiJHtzaWR9XCJcclxuXHRcdFx0XHRcdFx0XHRkYXRhLXl0bXNpdGU9XCIke3NpdGV9XCI+XFx1MjVCNjwvdmFyPlxyXG5cdFx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdDwvc3Bhbj5gO1xyXG5cdFx0XHRyZXR1cm4gdGVtcGxhdGU7XHJcblx0XHR9XHJcblxyXG5cdFx0Y3JlYXRlQWpheExpbmsoKSB7XHJcblx0XHRcdGNvbnN0IHsgc2lkLCBpZCwgc2l0ZSwgdXJpIH0gPSB0aGlzLnN0YXRlO1xyXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IGBcclxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cInl0bV9iZCB5dG1fbm9ybWFsaXplIHl0bV9tYW51YWwgXyR7c2lkfVwiPlxyXG5cdFx0XHRcdFx0PGEgaHJlZj1cIiNcIiBjbGFzcz1cInl0bV90aXRsZVwiIHRpdGxlPVwiTG9hZCB0aGlzIHZpZGVvJ3MgZGVzY3JpcHRpb24uXCJcclxuXHRcdFx0XHRcdFx0ZGF0YS15dG1pZD1cIiR7aWR9XCJcclxuXHRcdFx0XHRcdFx0ZGF0YS15dG1zaXRlPVwiJHtzaXRlfVwiXHJcblx0XHRcdFx0XHRcdGRhdGEteXRtdXJpPVwiJHt1cml9XCJcclxuXHRcdFx0XHRcdFx0ZGF0YS15dG1kZXNjcmlwdGlvbj1cInRydWVcIlxyXG5cdFx0XHRcdFx0PkxvYWQgRGVzY3JpcHRpb248L2E+XHJcblx0XHRcdFx0PC9zcGFuPmA7XHJcblx0XHRcdHRoaXMuYm9keS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRlbXBsYXRlKTtcclxuXHRcdH1cclxuXHJcblx0XHRjcmVhdGVQcm9qZWN0b3IoKSB7XHJcblx0XHRcdHRoaXMucHJvamVjdG9yID0gXy5lKCdkaXYnLCB7XHJcblx0XHRcdFx0Y2xhc3NOYW1lOiAneXRtX3Byb2plY3RvciB5dG1fbm9uZSB5dG1fYmxvY2sgeXRtX25vcm1hbGl6ZSB5dG1fc2FucycsXHJcblx0XHRcdFx0aW5uZXJIVE1MOiBDb250YWluZXIudGVtcGxhdGVzLm1lbnVcclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMudGh1bWJuYWlsLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCB0aGlzLnByb2plY3Rvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0c2hvd1BsYXllcigpIHtcclxuXHRcdFx0dGhpcy50aHVtYm5haWwuY2xhc3NMaXN0LmFkZCgneXRtX25vbmUnKTtcclxuXHRcdFx0dGhpcy5wcm9qZWN0b3IuY2xhc3NMaXN0LnJlbW92ZSgneXRtX25vbmUnKTtcclxuXHRcdH1cclxuXHJcblx0XHRoaWRlUGxheWVyKCkge1xyXG5cdFx0XHR0aGlzLnRodW1ibmFpbC5jbGFzc0xpc3QucmVtb3ZlKCd5dG1fbm9uZScpO1xyXG5cdFx0XHR0aGlzLnByb2plY3Rvci5jbGFzc0xpc3QuYWRkKCd5dG1fbm9uZScpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdENvbnRhaW5lci50ZW1wbGF0ZXMgPSB7XHJcblx0XHRtZW51OiBgXHJcblx0XHRcdDx1bCBjbGFzcz1cInl0bV9vcHRpb25zIHl0bV9zYW5zXCI+XHJcblx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0PHVsIGNsYXNzPVwieXRtX3JhdGlvc1wiPlxyXG5cdFx0XHRcdFx0XHQ8bGkgZGF0YS10eXBlPVwicmF0aW9cIiBkYXRhLXZhbHVlPVwiMVwiIHRpdGxlPVwiU0RcIj40OjM8L2xpPlxyXG5cdFx0XHRcdFx0XHQ8bGkgZGF0YS10eXBlPVwicmF0aW9cIiBkYXRhLXZhbHVlPVwiMlwiIHRpdGxlPVwiTGFuZHNjYXBlXCI+MTY6OTwvbGk+XHJcblx0XHRcdFx0XHRcdDxsaSBkYXRhLXR5cGU9XCJyYXRpb1wiIGRhdGEtdmFsdWU9XCIzXCIgdGl0bGU9XCJQb3J0cmFpdFwiPjk6MTY8L2xpPlxyXG5cdFx0XHRcdFx0PC91bD5cclxuXHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdDxsaT5cclxuXHRcdFx0XHRcdDx1bCBjbGFzcz1cInl0bV9zaXplc1wiPlxyXG5cdFx0XHRcdFx0XHQ8bGkgZGF0YS10eXBlPVwic2l6ZVwiIGRhdGEtdmFsdWU9XCIwXCIgdGl0bGU9XCJIaWRlIHRoZSB2aWRlby5cIj5cXHUwMEQ4PC9saT5cclxuXHRcdFx0XHRcdFx0PGxpIGRhdGEtdHlwZT1cInNpemVcIiBkYXRhLXZhbHVlPVwiMjQwXCIgdGl0bGU9XCIyNDBwXCI+UzwvbGk+XHJcblx0XHRcdFx0XHRcdDxsaSBkYXRhLXR5cGU9XCJzaXplXCIgZGF0YS12YWx1ZT1cIjM2MFwiIHRpdGxlPVwiMzYwcFwiPk08L2xpPlxyXG5cdFx0XHRcdFx0XHQ8bGkgZGF0YS10eXBlPVwic2l6ZVwiIGRhdGEtdmFsdWU9XCI0ODBcIiB0aXRsZT1cIjQ4MHBcIj5MPC9saT5cclxuXHRcdFx0XHRcdFx0PGxpIGRhdGEtdHlwZT1cInNpemVcIiBkYXRhLXZhbHVlPVwiNzIwXCIgdGl0bGU9XCI3MjBwXCI+WDwvbGk+XHJcblx0XHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0PHVsIGNsYXNzPVwieXRtX29wdGlvbnNcIj5cclxuXHRcdFx0XHRcdFx0JHtzdHJnLm9uID8gJzxsaSBkYXRhLXR5cGU9XCJzZXR0aW5nc1wiIGRhdGEtdmFsdWU9XCJcIiB0aXRsZT1cIllUTUEgU2V0dGluZ3NcIj4hPC9saT4nIDogJyd9XHJcblx0XHRcdFx0XHRcdDxsaSBkYXRhLXR5cGU9XCJjbG9zZVwiIGRhdGEtdmFsdWU9XCJcIiB0aXRsZT1cIkNsb3NlIHRoZSB2aWRlby5cIj5cXHUwMEQ3PC9saT5cclxuXHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0PC9saT5cclxuXHRcdFx0PC91bD5gXHJcblx0fTtcclxuXHJcblx0Q29udGFpbmVyLmRlY29yYXRvcnMgPSB7IC8vIG1vZGlmeSBpbnRlcmZhY2UgYWNjb3JkaW5nIHRvIHNpdGVcclxuXHRcdHlvdXR1YmU6IHtcclxuXHRcdFx0Z3VpOiBmdW5jdGlvbiAoY29udHJvbCkge1xyXG5cdFx0XHRcdGNvbnRyb2wuYW5jaG9yLmhyZWYgPSB0aGlzLmFuY2hvci5ocmVmLnJlcGxhY2UoJ3lvdXR1LmJlLycsICd5b3V0dWJlLmNvbS93YXRjaD92PScpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aHVtYkV2ZW50OiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdGxldCB0aW1lID0gK3RoaXMuZGF0YXNldC50aW1lIHx8IDE7XHJcblx0XHRcdFx0aWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCd5dG1fdHJpZ2dlcicpICYmIGUudHlwZSA9PT0gJ21vdXNlZW50ZXInICYmIHRpbWUgPCA1MCkge1xyXG5cdFx0XHRcdFx0dGhpcy5kYXRhc2V0LnRodW1iID0gKCh0aGlzLmRhdGFzZXQudGh1bWIgfHwgMCkgKyAxKSAlIDM7XHJcblx0XHRcdFx0XHR0aGlzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoaHR0cHM6Ly9pMy55dGltZy5jb20vdmkvJHt0aGlzLmRhdGFzZXQueXRtaWR9LyR7KCt0aGlzLmRhdGFzZXQudGh1bWIpICsgMX0uanBnKWA7XHJcblx0XHRcdFx0XHR3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuZGF0YXNldC50aW1lb3V0KTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdtb3VzZWVudGVyIC0tIGNsZWFyIGJlZm9yZSBzZXR0aW5nIG5ldyAnLCB0aGlzLmRhdGFzZXQpO1xyXG5cdFx0XHRcdFx0dGhpcy5kYXRhc2V0LnRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChDb250YWluZXIuZGVjb3JhdG9ycy55b3V0dWJlLnRodW1iRXZlbnQuYmluZCh0aGlzLCBlKSwgODAwKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdtb3VzZWVudGVyIC0tIG5ldyB0aW1lb3V0JywgdGhpcy5kYXRhc2V0KTtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YXNldC50aW1lID0gdGltZSArPSAxO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuZGF0YXNldC50aW1lb3V0KTtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YXNldC50aW1lID0gMDtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdtb3VzZWxlYXZlIC0tICcsIHRoaXMuZGF0YXNldCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Q29udGFpbmVyLmV2ZW50cyA9IHtcclxuXHRcdHNldHVwOiAoKSA9PiB7XHJcblx0XHRcdG9uKGRvY3VtZW50LmJvZHksICdjbGljaycsICd2YXJbZGF0YS15dG11aWRdJywgQ29udGFpbmVyLmV2ZW50cy5mcm9tVGFyZ2V0KTtcclxuXHRcdFx0b24oZG9jdW1lbnQuYm9keSwgJ2NsaWNrJywgJ2FbZGF0YS15dG1kZXNjcmlwdGlvbl0nLCBDb250YWluZXIuZXZlbnRzLm1hbnVhbExvYWQpO1xyXG5cdFx0XHRvbihkb2N1bWVudC5ib2R5LCAnZGJsY2xpY2snLCAncVtkYXRhLWZ1bGxdJywgQ29udGFpbmVyLmV2ZW50cy50aXRsZVRvZ2dsZSk7XHJcblxyXG5cdFx0XHRvbihkb2N1bWVudC5ib2R5LCAnbW91c2VlbnRlciBtb3VzZWxlYXZlJywgJ2Rpdi55dG1fc2l0ZV95b3V0dWJlIHNwYW4ueXRtX3RyaWdnZXInLCBDb250YWluZXIuZGVjb3JhdG9ycy55b3V0dWJlLnRodW1iRXZlbnQpO1xyXG5cdFx0fSxcclxuXHRcdGZyb21UYXJnZXQ6ICh7IHRhcmdldCB9KSA9PiB7IC8vIHRyaWdnZXIgdGhlIHVpXHJcblx0XHRcdGNvbnNvbGUuaW5mbygneXRtYS8vY2xpY2srdHJpZyhpZCknLCB0YXJnZXQuZGF0YXNldC55dG11aWQpO1xyXG5cdFx0XHRDb250cm9sLmNyZWF0ZUZyb21UcmlnZ2VyKHRhcmdldCkuc2hvd1BsYXllcigpO1xyXG5cdFx0fSxcclxuXHRcdG1hbnVhbExvYWQ6IGUgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGNvbnN0IHsgdGFyZ2V0IH0gPSBlO1xyXG5cdFx0XHRjb25zb2xlLmluZm8oJ3l0bWEvL2NsaWNrK2Rlc2MoaWQpJywgdGFyZ2V0LmRhdGFzZXQueXRtaWQpO1xyXG5cdFx0XHRpZiAoKHRhcmdldC5kYXRhc2V0LnRyaWVzIHx8IDApIDw9IDQpIHtcclxuXHRcdFx0XHRZLmFqYXgubG9hZEZyb21EYXRhc2V0KHRhcmdldC5kYXRhc2V0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHRpdGxlVG9nZ2xlOiBlID0+IHtcclxuXHRcdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblx0XHRcdHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCd5dG1fZGVzY3Jfb3BlbicpO1xyXG5cdFx0XHR0YXJnZXQudGV4dENvbnRlbnQgPSB0YXJnZXQudGV4dENvbnRlbnQubGVuZ3RoIDwgMTQwID8gdGFyZ2V0LmRhdGFzZXQuZnVsbCA6IGAke3RhcmdldC5kYXRhc2V0LmZ1bGwuc3Vic3RyKDAsIDEzMCl9IC4gLiAuYDtcclxuXHRcdFx0dGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRZLm51bSA9IDA7XHJcblxyXG5cdFkuYWRkVG9TZXQgPSB5dG1hID0+IFkuc2V0W3l0bWEuc3RhdGUudWlkXSA9IHl0bWE7XHJcblxyXG5cdFkuY3JlYXRlID0gbGluayA9PiBZLmdyYWJJZEFuZFNpdGUobGluaywgKGRhdGEsIGVycikgPT4ge1xyXG5cdFx0aWYgKGVycikge1xyXG5cdFx0XHRjb25zb2xlLndhcm4obGluay5ocmVmLCBlcnIpO1xyXG5cdFx0XHRyZXR1cm4ge307XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgY29udHJvbCA9IG5ldyBDb250cm9sKHsgLi4uZGF0YSwgYW5jaG9yOiBsaW5rIH0pO1xyXG5cdFx0WS5hZGRUb1NldChjb250cm9sKTtcclxuXHRcdGNvbnRyb2wuY3JlYXRlSW50ZXJmYWNlKCk7XHJcblxyXG5cdFx0cmV0dXJuIGNvbnRyb2w7XHJcblx0fSk7XHJcblxyXG5cdFkuZ3JhYklkQW5kU2l0ZSA9IChsaW5rLCBjYikgPT4ge1xyXG5cdFx0bGV0IHVyaSA9IGxpbmsuaHJlZiB8fCBsaW5rLnNyYztcclxuXHRcdGxldCBpZDtcclxuXHRcdGxldCBtYXRjaDtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0IHNpdGUgPSBZLnJlZy5zaXRlQnlUZXN0W1kucmVnLnNpdGVFeHByZXNzaW9ucy50ZXN0KHVyaSkgPyBSZWdFeHAubGFzdE1hdGNoIDogJyddO1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhzaXRlKTtcclxuXHJcblx0XHRcdGlmIChzaXRlID09PSAnaHRtbDUnKSB7IC8vIHx8IHNpdGUgPT09ICdodG1sNS1hdWRpbydcclxuXHRcdFx0XHRpZCA9IHVyaS5zbGljZSgtMTUpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHNpdGUgPT09ICdzb3VuZGNsb3VkJykge1xyXG5cdFx0XHRcdGlmICghWS5yZWcuZXh0cmEuc291bmRjbG91ZC5wbGF5bGlzdC50ZXN0KHVyaSkpIHtcclxuXHRcdFx0XHRcdGxpbmsuaHJlZiA9IHVyaSA9IFkucmVnLmZpeC5zb3VuZGNsb3VkKHVyaSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRtYXRjaCA9IFkuREIuc2l0ZXMuc291bmRjbG91ZC5tYXRjaGVyLmV4ZWModXJpKTtcclxuXHRcdFx0XHRpZCA9IFkuZXNjYXBlSWQobWF0Y2hbMV0pO1xyXG5cclxuXHRcdFx0XHRpZiAobWF0Y2ggJiYgWS5yZWcuZXh0cmEuc291bmRjbG91ZC50cmFja3MudGVzdCh1cmkpKSB7XHJcblx0XHRcdFx0XHRpZCA9IGlkLnNsaWNlKC01MCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlkID0gdXJpLm1hdGNoKFkuREIuc2l0ZXNbc2l0ZV0ubWF0Y2hlcilbMV07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnNvbGUuaW5mbygneXRtYS8vaWQrc2l0ZScsIGlkLCBzaXRlLCBtYXRjaCk7XHJcblx0XHRcdGlmIChpZCAmJiBZLkRCLnNpdGVzW3NpdGVdKSB7XHJcblx0XHRcdFx0cmV0dXJuIGNiKHsgaWQsIHNpdGUgfSwgbnVsbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhyb3cgVHlwZUVycm9yKGBJbnZhbGlkIElEL1NpdGU6ICR7aWR9IEAgJHtzaXRlfWApO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gY2IobnVsbCwgZSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0WS5lc2NhcGVJZCA9IGlkID0+IGAke2lkfWAucmVwbGFjZSgvKD86XFxXKS9nLCAnXycpO1xyXG5cclxuXHRZLnNldCA9IHt9O1xyXG5cclxuXHRZLmNvbGxlY3QgPSBpZCA9PiB7XHJcblx0XHRjb25zdCBhID0gT2JqZWN0LnZhbHVlcyhZLnNldCkuZmlsdGVyKHl0bWEgPT4geXRtYSAmJiB5dG1hLmRhdGEuaWQgPT09IGlkKTtcclxuXHRcdHJldHVybiBhO1xyXG5cdH07XHJcblxyXG5cdFkucm91dGUgPSB7XHJcblx0XHRob3N0OiBkb2N1bWVudC5sb2NhdGlvbi5ob3N0LnJlcGxhY2UoJ3d3dy4nLCAnJyksXHJcblx0XHRjb250cm9sOiB7XHJcblx0XHRcdCQ6IHtcclxuXHRcdFx0XHRjaGVja1N0b3JhZ2U6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGlmIChzdHJnLmZ1bGwoKSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnWVRNQSBFUlJPUjogU3RvcmFnZSBpcyBmdWxsIScpO1xyXG5cdFx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFkuZXh0ZXJuYWwudmVyc2lvbik7XHJcblx0XHRcdFx0XHRcdFx0c3RyZy5vbiA9IHN0cmcudGVzdCgpO1xyXG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cnVuT25jZTogZnVuY3Rpb24gKGxvb3ApIHtcclxuXHRcdFx0XHRcdGlmICghZG9jdW1lbnQuYm9keS5kYXRhc2V0Lnl0bWFlbmFibGVkKSB7XHJcblx0XHRcdFx0XHRcdGRvY3VtZW50LmJvZHkuZGF0YXNldC55dG1hZW5hYmxlZCA9IHRydWU7XHJcblxyXG5cdFx0XHRcdFx0XHR0aGlzLmNoZWNrU3RvcmFnZSgpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCFZLkRCLmV4dGVuc2lvbikgeyB1cGRhdGUuY2hlY2soKTsgfVxyXG5cclxuXHRcdFx0XHRcdFx0WS5jc3MoKTtcclxuXHRcdFx0XHRcdFx0WS51c2VyLmluaXQoKTtcclxuXHRcdFx0XHRcdFx0WS5EQi5wb3N0SW5pdCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGxvb3ApIHtcclxuXHRcdFx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmRhdGFzZXQuWVRNQV9MT09QID0gd2luZG93LnNldEludGVydmFsKGxvb3AsIDUwMDApO1xyXG5cdFx0XHRcdFx0XHRcdGxvb3AoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Q29udGFpbmVyLmV2ZW50cy5zZXR1cCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Z286IGZ1bmN0aW9uIChob3N0KSB7XHJcblx0XHRcdFx0Y29uc29sZS5pbmZvKCd5dG1hLy9ob3N0JywgaG9zdCk7XHJcblx0XHRcdFx0aWYgKC8oPzpnb29nbGV2aWRlb3x5b3V0dWJlLW5vY29va2llXFwuY29tfHlvdXR1YmVcXC5jb21cXC4/KS9pLnRlc3QoaG9zdCkpIHtcclxuXHRcdFx0XHRcdHRoaXMuc2l0ZXMueW91dHViZSgpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5zaXRlc1tob3N0XSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zaXRlc1tob3N0XSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnNpdGVzLiRnZW5lcmljKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzaXRlczoge1xyXG5cdFx0XHRcdCRnZW5lcmljOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRmdW5jdGlvbiBsb29wKCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoWS5zZWxlY3Rvci5wcm9jZXNzb3IoKSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRZLnVzZXIuZm4ubG9hZFByZWZlcmVuY2VzKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuaW5mbygneXRtYS8vYWdhaW4rKycpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFkucm91dGUuY29udHJvbC4kLnJ1bk9uY2UobG9vcCk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQncmVzZXRlcmEuY29tJzogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0Xy5jc3MoJy55dG1fb3B0aW9ucyBsaSB1bCBsaSB7IGhlaWdodDogMjRweCAhaW1wb3J0YW50IH0nKTtcclxuXHRcdFx0XHRcdF8uY3NzKCcuYmJDb2RlUXVvdGUgLnF1b3RlQ29udGFpbmVyIC5xdW90ZSB7IG1heC1oZWlnaHQ6IGluaXRpYWwgfSAuYmJDb2RlUXVvdGUgLnF1b3RlQ29udGFpbmVyIC5xdW90ZUV4cGFuZC5xdW90ZUN1dCB7IGRpc3BsYXk6IG5vbmUgfScpO1xyXG5cdFx0XHRcdFx0Xy5jc3MoJy5iYkNvZGVRdW90ZSAueXRtX2Jsb2NrIGlmcmFtZSwgLmJiQ29kZVF1b3RlIC55dG1fYmxvY2sgW2RhdGEtczllLW1lZGlhZW1iZWRdLCAuYmJDb2RlUXVvdGUgLnl0bV9ibG9jayAuZmJfaWZyYW1lX3dpZGdldCwgLmJiQ29kZVF1b3RlIC55dG1fYmxvY2sgb2JqZWN0LCAuYmJDb2RlUXVvdGUgLnl0bV9ibG9jayBlbWJlZCB7IG1heC1oZWlnaHQ6IGluaXRpYWw7IG1heC13aWR0aDogaW5pdGlhbCB9Jyk7XHJcblx0XHRcdFx0XHR0aGlzLiRnZW5lcmljKCk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnZ2Z5Y2F0LmNvbSc6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlbycpO1xyXG5cdFx0XHRcdFx0di5jb250cm9scyA9IHRydWU7XHJcblx0XHRcdFx0XHRfLmNzcygnYm9keSxodG1sIHtvdmVyZmxvdzpoaWRkZW47aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJX0gdmlkZW8ge2Rpc3BsYXk6dGFibGU7aGVpZ2h0OjEwMCU7bWFyZ2luOjAgYXV0bzt9Jyk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHYpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3ZpbmUuY28nOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygndmluZS5jbycpO1xyXG5cclxuXHRcdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdF8ucygnW3N0eWxlXScsIGUgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGUucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0eW91dHViZTogZnVuY3Rpb24gKCkgeyAvLyBsZXRzIGZvcmNlIHNvbWUgcXVhbGl0eSBwYXJpdHlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRsb2FkOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoaXMuY29udHJvbC5nbyh0aGlzLmhvc3QpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdFkubWFpbiA9ICgpID0+IHtcclxuXHRcdFkucmVnLnNpdGVFeHByZXNzaW9ucyA9IFkucmVnLmdldEFsbFNpdGVSZWdFeHBzKCk7XHJcblx0XHQvLyBjb25zb2xlLmxvZyhZVE1BLnJlZy5zaXRlRXhwcmVzc2lvbnMpO1xyXG5cdFx0WS5yb3V0ZS5sb2FkKCk7XHJcblx0fTtcclxuXHJcblx0WS5yZWcgPSB7XHJcblx0XHRzaXRlRXhwcmVzc2lvbnM6IG51bGwsXHJcblx0XHR0aW1lOiAvKD86dD0oPzooXFxkKyloKT8oPzooXFxkKyltKT8oXFxkKykpLyxcclxuXHRcdGlvczogLyg/OlxcYig/Omlwb2R8aXBob25lfGlwYWQpKVxcYi9pLFxyXG5cdFx0ZXh0cmE6IHtcclxuXHRcdFx0c291bmRjbG91ZDoge1xyXG5cdFx0XHRcdHBsYXlsaXN0OiAvKD86c291bmRjbG91ZFxcLmNvbVxcLy4rXFwvc2V0c1xcLykvLFxyXG5cdFx0XHRcdHRyYWNrczogLyg/OnNvdW5kY2xvdWRcXC5jb21cXC8uK1xcL3RyYWNrc1xcLykvXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRzaXRlQnlUZXN0OiB7XHJcblx0XHRcdHlvdXR1OiAneW91dHViZScsXHJcblx0XHRcdHZpbWVvOiAndmltZW8nLFxyXG5cdFx0XHR2aW5lOiAndmluZScsXHJcblx0XHRcdGdmeWNhdDogJ2dmeWNhdCcsXHJcblx0XHRcdGltZ3VyOiAnaW1ndXInLFxyXG5cdFx0XHQnLndlYm0nOiAnaHRtbDUnLFxyXG5cdFx0XHQnLm1wNCc6ICdodG1sNScsXHJcblx0XHRcdC8vICcubXAzJzogJ2h0bWw1LWF1ZGlvJyxcclxuXHRcdFx0Jy5naWZ2JzogJ2h0bWw1JyxcclxuXHRcdFx0c291bmRjbG91ZDogJ3NvdW5kY2xvdWQnLFxyXG5cdFx0XHQnc3RyZWFtYWJsZS5jb20nOiAnc3RyZWFtYWJsZSdcclxuXHRcdH0sXHJcblx0XHRnZXRBbGxTaXRlUmVnRXhwczogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRjb25zdCByZWdzID0gT2JqZWN0LnZhbHVlcyhZLkRCLnNpdGVzKVxyXG5cdFx0XHRcdC5maWx0ZXIoKHsgcmVnIH0pID0+IHJlZylcclxuXHRcdFx0XHQubWFwKCh7IHJlZyB9KSA9PiByZWcpO1xyXG5cclxuXHRcdFx0cmV0dXJuIG5ldyBSZWdFeHAoYFxcXFxiJHtyZWdzLmpvaW4oJ3wnKX1gKTtcclxuXHRcdH0sXHJcblx0XHRmaXg6IHtcclxuXHRcdFx0c291bmRjbG91ZDogZnVuY3Rpb24gKHVyaSkge1xyXG5cdFx0XHRcdGNvbnN0IG1hdGNoID0gWS5EQi5zaXRlcy5zb3VuZGNsb3VkLm1hdGNoZXIuZXhlYyh1cmkpO1xyXG5cdFx0XHRcdGlmIChtYXRjaCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgaWQgPSBtYXRjaFsxXS5zcGxpdCgnLycsIDIpLmpvaW4oJy8nKTtcclxuXHRcdFx0XHRcdHVyaSA9IHJlbW92ZVNlYXJjaChgaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS8ke2lkfWAsIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHVyaTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdFkuc2VsZWN0b3IgPSB7IC8vIHRvIGJ1aWxkIHRoZSBzZWxlY3RvclxyXG5cdFx0cGFyZW50QmxhY2tsaXN0OiBbJy5zbWFsbGZvbnQnLCAnLmNvbGhlYWRfZGFyaycsICcuc3BvaWxlcicsICdwcmUnLCAnLm1lc3NhZ2VVc2VySW5mbycsICcuZnItYm94J10sXHJcblx0XHRnZXRBbGxTaXRlU2VsZWN0b3JzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGNvbnN0IHNlbHMgPSBPYmplY3QudmFsdWVzKFkuREIuc2l0ZXMpXHJcblx0XHRcdFx0LmZpbHRlcigoeyBzZWxlY3RvciB9KSA9PiBzZWxlY3RvcilcclxuXHRcdFx0XHQubWFwKCh7IHNlbGVjdG9yIH0pID0+IHNlbGVjdG9yKTtcclxuXHJcblx0XHRcdHJldHVybiBzZWxzLmpvaW4oKTtcclxuXHRcdH0sXHJcblx0XHRpZ25vcmU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Y29uc3QgaWdub3JlID0gW107XHJcblx0XHRcdGNvbnN0IGFsbCA9IFkuc2VsZWN0b3IuZ2V0QWxsU2l0ZVNlbGVjdG9ycygpLnNwbGl0KCcsJyk7XHJcblx0XHRcdGNvbnN0IGJsYWNrbGlzdCA9IHRoaXMucGFyZW50QmxhY2tsaXN0O1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJsYWNrbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgYWxsLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRpZ25vcmUucHVzaChgJHtibGFja2xpc3RbaV19ICR7YWxsW2pdfWApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhpZ25vcmUuam9pbignLCcpKTtcclxuXHRcdFx0cmV0dXJuIGlnbm9yZS5qb2luKCcsJyk7XHJcblx0XHR9LFxyXG5cdFx0aWZyYW1lczogZnVuY3Rpb24gKCkgeyAvLyBmb3IgcmVzZXRlcmEsIGNvbnZlcnQgaWZyYW1lcyBiYWNrIHRvIGFuY2hvcnNcclxuXHRcdFx0Xy5zKCcubWVzc2FnZS1ib2R5IGlmcmFtZScsIGYgPT4ge1xyXG5cdFx0XHRcdGlmICgvdmlcXC8oLis/KVxcL2hxZGVmYXVsdC8udGVzdChmLnN0eWxlLmJhY2tncm91bmRJbWFnZSkpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHNyYyA9IGBodHRwczovL3lvdXR1LmJlLyR7UmVnRXhwLiQxfWA7XHJcblx0XHRcdFx0XHRjb25zdCBzcGFuID0gZi5jbG9zZXN0KCdbZGF0YS1zOWUtbWVkaWFlbWJlZF0nKTtcclxuXHRcdFx0XHRcdHNwYW4uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmViZWdpbicsIGA8YSBocmVmPVwiJHtzcmN9XCI+eW91dHViZTwvYT5gKTtcclxuXHRcdFx0XHRcdHNwYW4ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChzcGFuKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Xy5zKCdbZGF0YS1zOWUtbWVkaWFlbWJlZC1pZnJhbWVdJywgcyA9PiB7XHJcblx0XHRcdFx0aWYgKFkuREIuc2l0ZXNbcy5kYXRhc2V0LnM5ZU1lZGlhZW1iZWRdKSB7XHJcblx0XHRcdFx0XHRjb25zdCBkYXQgPSBKU09OLnBhcnNlKHMuZGF0YXNldC5zOWVNZWRpYWVtYmVkSWZyYW1lKTtcclxuXHRcdFx0XHRcdGNvbnN0IGxpbmsgPSBkYXRbZGF0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0cy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuaW5uZXJIVE1MID0gYDxhIGhyZWY9XCIke2xpbmt9XCI+JHtsaW5rfTwvYT5gO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0bGlua3M6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Xy5zKFkuc2VsZWN0b3IuaWdub3JlKCksICh7IGRhdGFzZXQgfSkgPT4gZGF0YXNldC55dG1haWdub3JlID0gdHJ1ZSk7XHJcblxyXG5cdFx0XHRjb25zdCBsaW5rcyA9IF8ucXNhKFkuc2VsZWN0b3IuZ2V0QWxsU2l0ZVNlbGVjdG9ycygpKS5maWx0ZXIoKHsgZGF0YXNldCB9KSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgciA9ICFkYXRhc2V0Lnl0bWFwcm9jZXNzZWQgJiYgIWRhdGFzZXQueXRtYWlnbm9yZTtcclxuXHRcdFx0XHRkYXRhc2V0Lnl0bWFwcm9jZXNzZWQgPSB0cnVlO1xyXG5cdFx0XHRcdHJldHVybiByO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBsaW5rcztcclxuXHRcdH0sXHJcblx0XHRwcm9jZXNzb3I6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dGhpcy5pZnJhbWVzKCk7XHJcblx0XHRcdGNvbnN0IGxpbmtzID0gdGhpcy5saW5rcygpO1xyXG5cclxuXHRcdFx0aWYgKGxpbmtzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRsaW5rcy5mb3JFYWNoKFkuY3JlYXRlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGxpbmtzLmxlbmd0aDtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBVc2VyIFByZWZlcmVuY2VzXHJcblx0ICogc2l6ZTogU21hbGwgKDI0MHApLCBNZWRpdW0gKDM2MHApLCBMYXJnZSAoNDgwcCksIFhMICg3MjBwKVxyXG5cdCAqIHJhdGlvOiAxIDQ6MywgMiAxNjo5XHJcblx0ICogcXVhbGl0eTogMjQwLCAzNjAsIDQ4MCwgNzIwLCAxMDgwXHJcblx0ICogZm9jdXM6IDAvMTsgV2lsbCBhdHRlbXB0IHRvIHNldCB0aGUgd2luZG93J3MgZm9jdXMgbmVhciB0aGUgdmlkZW9cclxuXHQgKiBhdXRvU2hvdzogMC8xOyBXaWxsIGF1dG9tYXRpY2FsbHkgZGlzcGxheSBIVE1MNSB2aWRlb3MsIHdoaWNoIGN1cnJlbnRseSBsYWNrIGRlc2NyaXB0aW9ucyBhbmQgdGh1bWJuYWlsc1xyXG5cdCAqIGRlc2M6IChEZXNjcmlwdGlvbnMpIDAgTm9uZTsgMSBZZXMgb24gc2Nyb2xsOyAyIFllcyBhbGwgYXQgb25jZVxyXG5cdCAqIHl0X25vY29va2llOiAwLzE7IFdpbGwgZGlzYWJsZS9lbmFibGUgeW91dHViZS1ub2Nvb2tpZS5jb21cclxuXHQgKiB5dF9hbm5vdGF0aW9uOiAwLzE7IHlvdXR1YmUgYW5ub3RhdGlvbnNcclxuXHQgKi9cclxuXHRZLnVzZXIgPSB7XHJcblx0XHRLRVk6ICd5dG1hc2V0dHMnLFxyXG5cdFx0JGZvcm06IG51bGwsXHJcblx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoaXMubG9hZCgpO1xyXG5cclxuXHRcdFx0aWYgKHN0cmcub24pIHtcclxuXHRcdFx0XHR0aGlzLmZuLm1ha2VGb3JtKCk7XHJcblx0XHRcdFx0dGhpcy5tYXJrKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR2YWxpZDoge1xyXG5cdFx0XHRmb2N1czogWzAsIDFdLFxyXG5cdFx0XHRkZXNjOiBbMCwgMSwgMl0sXHJcblx0XHRcdHJhdGlvOiBbMSwgMl0sXHJcblx0XHRcdHNpemU6IFsyNDAsIDM2MCwgNDgwLCA3MjBdLFxyXG5cdFx0XHRxdWFsaXR5OiBbMjQwLCAzNjAsIDQ4MCwgNzIwLCAxMDgwXSxcclxuXHRcdFx0YXV0b1Nob3c6IFswLCAxXSxcclxuXHRcdFx0eXRfbm9jb29raWU6IFswLCAxXSxcclxuXHRcdFx0eXRfYW5ub3RhdGlvbjogWzAsIDFdIC8vIGhpZGUgfCBzaG93XHJcblx0XHR9LFxyXG5cdFx0bWFwcGluZzogeyAvLyBtYXAgdmFsdWVzIHRvIHNvbWUgb3RoZXIgdmFsdWVzIHVzZWQgYnkgYW4gZXh0ZXJuYWwgQVBJLCBmb3IgZXhhbXBsZVxyXG5cdFx0XHR5dF9hbm5vdGF0aW9uOiBbMywgMV0gLy8gMyA9IGhpZGUgfCAxID0gc2hvd1xyXG5cdFx0fSxcclxuXHRcdHZhbGlkYXRlOiBmdW5jdGlvbiAocHJvcGVydHksIG4pIHtcclxuXHRcdFx0biA9ICtuO1xyXG5cdFx0XHRyZXR1cm4gWS51c2VyLnZhbGlkW3Byb3BlcnR5XS5pbmNsdWRlcyhuKSA/IG4gOiBZLnVzZXIuZGVmYXVsdHNbcHJvcGVydHldO1xyXG5cdFx0fSxcclxuXHRcdGdldCBkZWZhdWx0cygpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRmb2N1czogMCxcclxuXHRcdFx0XHRkZXNjOiAxLFxyXG5cdFx0XHRcdHJhdGlvOiAyLFxyXG5cdFx0XHRcdHNpemU6IDM2MCxcclxuXHRcdFx0XHRxdWFsaXR5OiA3MjAsXHJcblx0XHRcdFx0YXV0b1Nob3c6IDEsXHJcblx0XHRcdFx0eXRfbm9jb29raWU6IDAsXHJcblx0XHRcdFx0eXRfYW5ub3RhdGlvbjogMVxyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHRcdGxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Y29uc3QgcyA9IHN0cmcuZ3JhYihZLnVzZXIuS0VZLCB7fSk7XHJcblxyXG5cdFx0XHRZLnVzZXIucHJlZmVyZW5jZXMgPSBPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzKS5yZWR1Y2UoKHZhbGlkLCBrKSA9PiB7XHJcblx0XHRcdFx0dmFsaWRba10gPSBZLnVzZXIudmFsaWRhdGUoaywgc1trXSk7XHJcblx0XHRcdFx0cmV0dXJuIHZhbGlkO1xyXG5cdFx0XHR9LCB7fSk7XHJcblxyXG5cdFx0XHRfLm8oWS51c2VyLm1hcHBpbmcsIChrZXksIHZhbCkgPT4ge1xyXG5cdFx0XHRcdGlmICghdmFsLmhhc093blByb3BlcnR5KCdpbmRleE9mJykpIHtcclxuXHRcdFx0XHRcdFkudXNlci5wcmVmZXJlbmNlc1trZXldID0gdmFsW1kudXNlci52YWxpZFtrZXldLmluZGV4T2YoWS51c2VyLnByZWZlcmVuY2VzW2tleV0pXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Y29uc29sZS5pbmZvKCd5dG1hLy91c2VyK2xvYWRlZChwcmVmcyknLCBZLnVzZXIucHJlZmVyZW5jZXMpO1xyXG5cdFx0fSxcclxuXHRcdG1hcms6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Y29uc3QgYSA9IHt9O1xyXG5cdFx0XHRhLnl0bWFfX2ZvY3VzID0gISFZLnVzZXIucHJlZmVyZW5jZXMuZm9jdXM7XHJcblx0XHRcdGEueXRtYV9fYXV0b1Nob3cgPSAhIVkudXNlci5wcmVmZXJlbmNlcy5hdXRvU2hvdztcclxuXHRcdFx0YS55dG1hX195dF9ub2Nvb2tpZSA9ICEhWS51c2VyLnByZWZlcmVuY2VzLnl0X25vY29va2llO1xyXG5cdFx0XHRhLnl0bWFfX3l0X2Fubm90YXRpb24gPSAhIVkudXNlci5wcmVmZXJlbmNlcy55dF9hbm5vdGF0aW9uO1xyXG5cdFx0XHRhW2B5dG1hX19yYXRpbyR7WS51c2VyLnByZWZlcmVuY2VzLnJhdGlvfWBdID0gdHJ1ZTtcclxuXHRcdFx0YVtgeXRtYV9fc2l6ZSR7WS51c2VyLnByZWZlcmVuY2VzLnNpemV9YF0gPSB0cnVlO1xyXG5cdFx0XHRhW2B5dG1hX19kZXNjJHtZLnVzZXIucHJlZmVyZW5jZXMuZGVzY31gXSA9IHRydWU7XHJcblx0XHRcdGFbYHl0bWFfX3F1YWxpdHkke1kudXNlci5wcmVmZXJlbmNlcy5xdWFsaXR5fWBdID0gISFZLnVzZXIucHJlZmVyZW5jZXMucXVhbGl0eTtcclxuXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdtYXJraW5nJywgYSk7XHJcblx0XHRcdF8ubyhhLCAoaWQsIHZhbCkgPT4ge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuXHRcdFx0XHRcdGVsLmNoZWNrZWQgPSB2YWw7XHJcblx0XHRcdFx0XHRlbC52YWx1ZSA9IHZhbDtcclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhpZCwgZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRldmVudHM6IHtcclxuXHRcdFx0c2F2ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKFlUTUEudXNlci4kZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1rZXldJykpO1xyXG5cdFx0XHRcdC8vIFtkYXRhLWtleV06Y2hlY2tlZFxyXG5cdFx0XHRcdGNvbnN0IHNldHRpbmdzID0gQXJyYXkuZnJvbShZLnVzZXIuJGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEta2V5XScpKS5yZWR1Y2UoKG9iaiwgZSkgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IGtleSA9IGUuZGF0YXNldC5rZXk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGUudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xyXG5cdFx0XHRcdFx0XHRvYmpba2V5XSA9ICtlLmNoZWNrZWQ7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ3JhZGlvJykge1xyXG5cdFx0XHRcdFx0XHRpZiAoZS5jaGVja2VkKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGUuZGF0YXNldC5udW0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9ialtrZXldID0gK2UuZGF0YXNldC5udW07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRvYmpba2V5XSA9ICtlLnZhbHVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHJldHVybiBvYmo7XHJcblx0XHRcdFx0fSwge30pO1xyXG5cclxuXHRcdFx0XHRpZiAoc3RyZy5zYXZlKFkudXNlci5LRVksIHNldHRpbmdzKSkge1xyXG5cdFx0XHRcdFx0WS51c2VyLmxvYWQoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0WS51c2VyLmVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ3l0bV9ub25lJyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0cmVzZXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRZLnVzZXIucHJlZmVyZW5jZXMgPSBZLnVzZXIuZGVmYXVsdHM7XHJcblx0XHRcdFx0WS51c2VyLm1hcmsoKTtcclxuXHRcdFx0XHRzdHJnLndpcGUoWS51c2VyLktFWSk7XHJcblx0XHRcdFx0WS51c2VyLmVycm9yLmNsYXNzTGlzdC5hZGQoJ3l0bV9ub25lJyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNsZWFyOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFkuZXh0ZXJuYWwudmVyc2lvbik7XHJcblx0XHRcdFx0XHRZLnVzZXIuZXZlbnRzLnJlc2V0KCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmluZm8oJ3l0bWEvL2NhY2hlK3JlbW92ZScsICdyZW1vdmVkIGFsbCBZVE1BIGNhY2hlJyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGZvcm1Ub2dnbGU6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFx0aWYgKFkudXNlci4kZm9ybSAmJiAoIWUgfHwgKGUgJiYgZS50YXJnZXQgJiYgISgvKD86SU5QVVR8TEFCRUwpL2kpLnRlc3QoZS50YXJnZXQubm9kZU5hbWUpKSkpIHtcclxuXHRcdFx0XHRcdFkudXNlci4kZm9ybS5jbGFzc0xpc3QudG9nZ2xlKCd5dG1fbm9uZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Zm9ybVRvZ2dsZUtleWJvYXJkOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdC8vIHByZXNzIENUUkwrU0hJRlQrWSAoTUVUQStTSElGVCtZKSB0byBkaXNwbGF5IHNldHRpbmdzIGZvcm1cclxuXHRcdFx0XHRpZiAoKGUuY3RybEtleSB8fCBlLm1ldGFLZXkpICYmIGUuc2hpZnRLZXkgJiYgU3RyaW5nLmZyb21DaGFyQ29kZShlLndoaWNoKS50b0xvd2VyQ2FzZSgpID09PSAneScpIHtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFkudXNlci5ldmVudHMuZm9ybVRvZ2dsZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGZuOiB7XHJcblx0XHRcdCRzY3JvbGxlcjogbnVsbCxcclxuXHRcdFx0JG9uY2U6IGZhbHNlLFxyXG5cdFx0XHRsb2FkUHJlZmVyZW5jZXM6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRZLnVzZXIuZm4ub25TY3JvbGxMb2FkRGVzY3JpcHRpb25zKFkudXNlci5wcmVmZXJlbmNlcy5kZXNjID09PSAxKTtcclxuXHJcblx0XHRcdFx0dGhpcy5sb2FkUHJlZmVyZW5jZXNPbmNlKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGxvYWRQcmVmZXJlbmNlc09uY2U6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy4kb25jZSkgeyByZXR1cm47IH1cclxuXHJcblx0XHRcdFx0dGhpcy4kb25jZSA9IHRydWU7XHJcblxyXG5cdFx0XHRcdGlmIChZLnVzZXIucHJlZmVyZW5jZXMuYXV0b1Nob3cgPT09IDEpIHtcclxuXHRcdFx0XHRcdFkudXNlci5mbi5vblNjcm9sbFZpZXdNZWRpYSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0c2hvd01lZGlhOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5pbmZvKCd5dG1hLy91c2VyK2ZuLXNob3dNZWRpYScpO1xyXG5cdFx0XHRcdHJldHVybiBuZXcgU2Nyb2xsKCdhLnl0bV9zY3JvbGw6bm90KFtkYXRhLXl0bXNjcm9sbD1cImZhbHNlXCJdKScsIGxpbmsgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKFNjcm9sbC52aXNpYmxlQWxsKGxpbmssIDUwKSkge1xyXG5cdFx0XHRcdFx0XHRfLnMoYHZhcltkYXRhLXl0bXNpZD1cIiR7bGluay5kYXRhc2V0Lnl0bXNpZH1cIl06bm90KFtkYXRhLXl0bXNjcm9sbD1cImZhbHNlXCJdKWAsIHRyaWdnZXIgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IHVpID0gQ29udHJvbC5jcmVhdGVGcm9tVHJpZ2dlcih0cmlnZ2VyKTtcclxuXHRcdFx0XHRcdFx0XHR1aS5zaG93T25TY3JvbGwobGluayk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0b2dnbGVNZWRpYTogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgU2Nyb2xsKCdkaXYueXRtX3BhbmVsX3N3aXRjaGVyJywgZGl2ID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IHYgPSBkaXYucXVlcnlTZWxlY3RvcigndmlkZW8nKTtcclxuXHRcdFx0XHRcdGNvbnN0IHBhdXNlZCA9IHYgJiYgKHYucGF1c2VkIHx8IHYuZW5kZWQpO1xyXG5cdFx0XHRcdFx0Y29uc3QgdWkgPSBZLnNldFtkaXYuZGF0YXNldC55dG11aWRdLmdldENvbnRyb2woKTtcclxuXHJcblx0XHRcdFx0XHRpZiAocGF1c2VkICYmICFTY3JvbGwudmlzaWJsZUFsbChkaXYsIDApKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB1aS5wbGF5LnN3aXRjaFN0YW5kYnkoKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAodWkucGxheS5pc1N0YW5kYnkoKSAmJiBTY3JvbGwudmlzaWJsZUFsbChkaXYsIDIwMCkpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHVpLnBsYXkuc3dpdGNoT24oKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyB0b2RvIGFzY2VydGFpbiBlbWJlZGRlZCBwbGF5ZXIgcHJvcGVydGllc1xyXG5cdFx0XHRcdFx0Ly8gZiA9IGRpdi5xdWVyeVNlbGVjdG9yKCdpZnJhbWUsIG9iamVjdCcpO1xyXG5cdFx0XHRcdFx0Ly8gaWYgKGYgJiYgIVlUTUEuU2Nyb2xsLnZpc2libGVBbGwoZGl2LCAyMDApKSB7XHJcblx0XHRcdFx0XHQvLyBcdHkuaGlkZVBsYXllcigpO1xyXG5cdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRvblNjcm9sbFZpZXdNZWRpYTogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuc2hvd01lZGlhKCk7XHJcblx0XHRcdFx0dGhpcy50b2dnbGVNZWRpYSgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRvblNjcm9sbExvYWREZXNjcmlwdGlvbnM6IGZ1bmN0aW9uIChhamF4KSB7XHJcblx0XHRcdFx0aWYgKFkudXNlci5mbi4kc2Nyb2xsZXIpIHsgWS51c2VyLmZuLiRzY3JvbGxlci5zdG9wKCk7IH1cclxuXHJcblx0XHRcdFx0WS51c2VyLmZuLiRzY3JvbGxlciA9IG5ldyBTY3JvbGwoJ3NwYW4ueXRtX21hbnVhbCA+IGEueXRtX3RpdGxlOm5vdCgueXRtX2Vycm9yKScsIGEgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKFNjcm9sbC52aXNpYmxlQWxsKGEsIDIwMCkpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGFqYXgpIHtcclxuXHRcdFx0XHRcdFx0XHRZLmFqYXgubG9hZEZyb21EYXRhc2V0KGEuZGF0YXNldCk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0WS5hamF4LmxvYWRGcm9tQ2FjaGVEYXRhc2V0KGEuZGF0YXNldCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ2RvYycsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoWVRNQS51c2VyLmZuLiRzY3JvbGxlci5zZWxlY3RvcikubGVuZ3RoLCBhLmRhdGFzZXQuaWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFkudXNlci5mbi4kc2Nyb2xsZXIuc2VsZWN0b3IpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRZLnVzZXIuZm4uJHNjcm9sbGVyLnN0b3AoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bWFrZUZvcm06IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IGBcclxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJ5dG1fc2V0dGluZ3NcIiBjbGFzcz1cInl0bV9zYW5zIHl0bV9ibG9jayB5dG1fbm9ybWFsaXplXCI+XHJcblx0XHRcdFx0XHRcdDxmb3JtIGFjdGlvbj1cIlwiIHRpdGxlPVwiRG91YmxlIGNsaWNrIHRvIGNsb3NlXCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBpZD1cInl0bV9zZXR0aW5nc3RcIj55dG1hISBTaXRlIFNldHRpbmdzPC9kaXY+PGRpdiBjbGFzcz1cInl0bV9maWVsZF9jb250YWluZXJcIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxmaWVsZHNldD48bGVnZW5kIHRpdGxlPVwiTG9hZCBkZXNjcmlwdGlvbnMgZnJvbSB0aGUgY29udGVudCBzZXZlci5cIj5Mb2FkIERlc2NyaXB0aW9uczwvbGVnZW5kPjxwPjxzcGFuPjxpbnB1dCBpZD1cInl0bWFfX2Rlc2MwXCIgdHlwZT1cInJhZGlvXCIgZGF0YS1udW09XCIwXCIgbmFtZT1cInl0bWFfX2Rlc2NcIiBkYXRhLWtleT1cImRlc2NcIj48bGFiZWwgZm9yPVwieXRtYV9fZGVzYzBcIiB0aXRsZT1cIkxvYWQgZGVzY3JpcHRpb25zIG9uIGRlbWFuZFwiPk1hbnVhbGx5PC9sYWJlbD48L3NwYW4+PHNwYW4+PGlucHV0IGlkPVwieXRtYV9fZGVzYzFcIiB0eXBlPVwicmFkaW9cIiBkYXRhLW51bT1cIjFcIiBuYW1lPVwieXRtYV9fZGVzY1wiIGRhdGEta2V5PVwiZGVzY1wiPjxsYWJlbCBmb3I9XCJ5dG1hX19kZXNjMVwiIHRpdGxlPVwiTG9hZCBkZXNjcmlwdGlvbnMgYXMgdGhleSBiZWNvbWUgdmlzaWJsZSBvbiB0aGUgc2NyZWVuLlwiPkF1dG9tYXRpY2FsbHksIG9uIHNjcm9sbGluZzwvbGFiZWw+PC9zcGFuPjwvcD48L2ZpZWxkc2V0PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGZpZWxkc2V0PjxsZWdlbmQ+SFRNTDUgUGxheWVyczwvbGVnZW5kPjxwPjxpbnB1dCBuYW1lPVwieXRtYV9fYXV0b1Nob3dcIiBkYXRhLWtleT1cImF1dG9TaG93XCIgaWQ9XCJ5dG1hX19hdXRvU2hvd1wiIHR5cGU9XCJjaGVja2JveFwiPjxsYWJlbCBmb3I9XCJ5dG1hX19hdXRvU2hvd1wiPkF1dG9tYXRpY2FsbHkgc2hvdyBXZWJNLCBNUDQgYW5kIFNvdW5kY2xvdWQgcGxheWVyczwvbGFiZWw+PC9wPjwvZmllbGRzZXQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZmllbGRzZXQ+PGxlZ2VuZD5QbGF5ZXIgU2l6ZTwvbGVnZW5kPjxwPjxzcGFuPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwieXRtYV9fc2l6ZVwiIGRhdGEta2V5PVwic2l6ZVwiIGRhdGEtbnVtPVwiMjQwXCIgaWQ9XCJ5dG1hX19zaXplMjQwXCIgLz48bGFiZWwgZm9yPVwieXRtYV9fc2l6ZTI0MFwiPlMgPHNtYWxsPjI0MHA8L3NtYWxsPjwvbGFiZWw+PC9zcGFuPjxzcGFuPjxpbnB1dCBuYW1lPVwieXRtYV9fc2l6ZVwiIGRhdGEta2V5PVwic2l6ZVwiIHR5cGU9XCJyYWRpb1wiIGlkPVwieXRtYV9fc2l6ZTM2MFwiIGRhdGEtbnVtPVwiMzYwXCIgLz48bGFiZWwgZm9yPVwieXRtYV9fc2l6ZTM2MFwiPk0gPHNtYWxsPjM2MHA8L3NtYWxsPjwvbGFiZWw+PC9zcGFuPjxzcGFuPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwieXRtYV9fc2l6ZVwiIGRhdGEta2V5PVwic2l6ZVwiIGRhdGEtbnVtPVwiNDgwXCIgaWQ9XCJ5dG1hX19zaXplNDgwXCIgLz48bGFiZWwgZm9yPVwieXRtYV9fc2l6ZTQ4MFwiPkwgPHNtYWxsPjQ4MHA8L3NtYWxsPjwvbGFiZWw+PC9zcGFuPjxzcGFuPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwieXRtYV9fc2l6ZVwiIGRhdGEta2V5PVwic2l6ZVwiIGRhdGEtbnVtPVwiNzIwXCIgaWQ9XCJ5dG1hX19zaXplNzIwXCIgLz48bGFiZWwgZm9yPVwieXRtYV9fc2l6ZTcyMFwiPlggPHNtYWxsPjcyMHA8L3NtYWxsPjwvbGFiZWw+PC9zcGFuPjwvcD48L2ZpZWxkc2V0PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGZpZWxkc2V0PjxsZWdlbmQ+UXVhbGl0eTwvbGVnZW5kPjxwPjxzcGFuPjxpbnB1dCBuYW1lPVwieXRtYV9fcXVhbGl0eVwiIGRhdGEta2V5PVwicXVhbGl0eVwiIGRhdGEtbnVtPVwiMjQwXCIgaWQ9XCJ5dG1hX19xdWFsaXR5MjQwXCIgdHlwZT1cInJhZGlvXCI+PGxhYmVsIGZvcj1cInl0bWFfX3F1YWxpdHkyNDBcIj4yNDBwPC9sYWJlbD48L3NwYW4+PHNwYW4+PGlucHV0IG5hbWU9XCJ5dG1hX19xdWFsaXR5XCIgZGF0YS1rZXk9XCJxdWFsaXR5XCIgaWQ9XCJ5dG1hX19xdWFsaXR5MzYwXCIgZGF0YS1udW09XCIzNjBcIiB0eXBlPVwicmFkaW9cIj48bGFiZWwgZm9yPVwieXRtYV9fcXVhbGl0eTM2MFwiPjM2MHA8L2xhYmVsPjwvc3Bhbj48c3Bhbj48aW5wdXQgbmFtZT1cInl0bWFfX3F1YWxpdHlcIiBkYXRhLWtleT1cInF1YWxpdHlcIiBkYXRhLW51bT1cIjQ4MFwiIGlkPVwieXRtYV9fcXVhbGl0eTQ4MFwiIHR5cGU9XCJyYWRpb1wiPjxsYWJlbCBmb3I9XCJ5dG1hX19xdWFsaXR5NDgwXCI+NDgwcDwvbGFiZWw+PC9zcGFuPjxzcGFuPjxpbnB1dCBuYW1lPVwieXRtYV9fcXVhbGl0eVwiIGRhdGEta2V5PVwicXVhbGl0eVwiIGRhdGEtbnVtPVwiNzIwXCIgaWQ9XCJ5dG1hX19xdWFsaXR5NzIwXCIgdHlwZT1cInJhZGlvXCI+PGxhYmVsIGZvcj1cInl0bWFfX3F1YWxpdHk3MjBcIj43MjBwPC9sYWJlbD48L3NwYW4+PHNwYW4+PGlucHV0IG5hbWU9XCJ5dG1hX19xdWFsaXR5XCIgZGF0YS1rZXk9XCJxdWFsaXR5XCIgZGF0YS1udW09XCIxMDgwXCIgaWQ9XCJ5dG1hX19xdWFsaXR5MTA4MFwiIHR5cGU9XCJyYWRpb1wiPjxsYWJlbCBmb3I9XCJ5dG1hX19xdWFsaXR5MTA4MFwiPjEwODBwPC9sYWJlbD48L3NwYW4+PC9wPjwvZmllbGRzZXQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZmllbGRzZXQ+PGxlZ2VuZD5Bc3BlY3QgUmF0aW88L2xlZ2VuZD48cD48c3Bhbj48aW5wdXQgbmFtZT1cInl0bWFfX3JhdGlvXCIgZGF0YS1rZXk9XCJyYXRpb1wiIHR5cGU9XCJyYWRpb1wiIGlkPVwieXRtYV9fcmF0aW8yXCIgZGF0YS1udW09XCIyXCIgLz48bGFiZWwgZm9yPVwieXRtYV9fcmF0aW8yXCI+MTY6OTwvbGFiZWw+PC9zcGFuPjxzcGFuPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwieXRtYV9fcmF0aW9cIiBkYXRhLWtleT1cInJhdGlvXCIgZGF0YS1udW09XCIxXCIgaWQ9XCJ5dG1hX19yYXRpbzFcIiAvPjxsYWJlbCBmb3I9XCJ5dG1hX19yYXRpbzFcIj40OjM8L2xhYmVsPjwvc3Bhbj48L3A+PC9maWVsZHNldD5cclxuXHRcdFx0XHRcdFx0XHRcdDxmaWVsZHNldD48bGVnZW5kPllvdVR1YmU8L2xlZ2VuZD5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PHA+PGlucHV0IG5hbWU9XCJ5dG1hX195dF9hbm5vdGF0aW9uXCIgZGF0YS1rZXk9XCJ5dF9hbm5vdGF0aW9uXCIgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJ5dG1hX195dF9hbm5vdGF0aW9uXCIgLz48bGFiZWwgZm9yPVwieXRtYV9feXRfYW5ub3RhdGlvblwiPkVuYWJsZSB2aWRlbyBhbm5vdGF0aW9uczwvbGFiZWw+PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8cD48aW5wdXQgbmFtZT1cInl0bWFfX3l0X25vY29va2llXCIgZGF0YS1rZXk9XCJ5dF9ub2Nvb2tpZVwiIHR5cGU9XCJjaGVja2JveFwiIGlkPVwieXRtYV9feXRfbm9jb29raWVcIiAvPjxsYWJlbCBmb3I9XCJ5dG1hX195dF9ub2Nvb2tpZVwiPlVzZSBodHRwczovL3lvdXR1YmUtbm9jb29raWUuY29tIHRvIGxvYWQgdmlkZW9zPC9sYWJlbD48L3A+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2ZpZWxkc2V0PlxyXG5cdFx0XHRcdFx0XHRcdFx0PGZpZWxkc2V0PjxsZWdlbmQ+V2luZG93IEZvY3VzPC9sZWdlbmQ+PHA+PGlucHV0IG5hbWU9XCJ5dG1hX19mb2N1c1wiIGRhdGEta2V5PVwiZm9jdXNcIiB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInl0bWFfX2ZvY3VzXCIgdmFsdWU9XCJmb2N1c1wiIC8+PGxhYmVsIGZvcj1cInl0bWFfX2ZvY3VzXCI+QWZ0ZXIgY2xpY2tpbmcgdGhlIHRodW1ibmFpbCwgc2V0IHRoZSB2aWRlbyBhdCB0aGUgdG9wIG9mIHRoZSB3aW5kb3cuPC9sYWJlbD48L3A+PC9maWVsZHNldD5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8cD48c21hbGwgaWQ9XCJ5dG1fc2V0dGluZ3NfZXJyb3JcIiBjbGFzcz1cInl0bV9lcnJvciB5dG1fbm9uZSB5dG1fdGl0bGVcIj5FcnJvciEgWW91ciBzZXR0aW5ncyBjb3VsZCBub3QgYmUgc2F2ZWQuPC9zbWFsbD48L3A+XHJcblx0XHRcdFx0XHRcdFx0PHAgaWQ9XCJ5dG1fb3B0c1wiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJ5dG1hY2xvc2VcIj5DbG9zZTwvYnV0dG9uPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInl0bWFyZXNldFwiPlJlc2V0PC9idXR0b24+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwieXRtYWNsZWFyXCIgdGl0bGU9XCJSZW1vdmUgYWxsIHZpZGVvIGRlc2NyaXB0aW9ucyB0aGF0IGhhdmUgYmVlbiBjYWNoZWRcIj5SZXNldCAmIFJlbW92ZSBDYWNoZTwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHRcdDwvcD5cclxuXHRcdFx0XHRcdFx0PC9mb3JtPlxyXG5cdFx0XHRcdFx0PC9kaXY+YDtcclxuXHJcblx0XHRcdFx0WS51c2VyLiRmb3JtID0gXy5lKCdkaXYnLCB7IGNsYXNzTmFtZTogJ3l0bV9maXhfY2VudGVyIHl0bV9ub25lIHl0bV9ib3gnLCBpbm5lckhUTUw6IHRlbXBsYXRlIH0sIGRvY3VtZW50LmJvZHkpO1xyXG5cdFx0XHRcdFkudXNlci5lcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5dG1fc2V0dGluZ3NfZXJyb3InKTtcclxuXHJcblx0XHRcdFx0b24oWS51c2VyLiRmb3JtLCAna2V5dXAgY2xpY2snLCAnaW5wdXQsIGxhYmVsJywgZGVib3VuY2UoWS51c2VyLmV2ZW50cy5zYXZlLCA1MDApKTtcclxuXHRcdFx0XHRZLnVzZXIuJGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiBlLnByZXZlbnREZWZhdWx0KCksIGZhbHNlKTtcclxuXHJcblx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3l0bWFyZXNldCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgWS51c2VyLmV2ZW50cy5yZXNldCwgZmFsc2UpO1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5dG1hY2xlYXInKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIFkudXNlci5ldmVudHMuY2xlYXIsIGZhbHNlKTtcclxuXHJcblx0XHRcdFx0Ly8gY2xvc2VcclxuXHRcdFx0XHRZLnVzZXIuJGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBZLnVzZXIuZXZlbnRzLmZvcm1Ub2dnbGUsIGZhbHNlKTtcclxuXHRcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneXRtYWNsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBZLnVzZXIuZXZlbnRzLmZvcm1Ub2dnbGUsIGZhbHNlKTtcclxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBZLnVzZXIuZXZlbnRzLmZvcm1Ub2dnbGVLZXlib2FyZCwgZmFsc2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0WS5jc3MgPSAoKSA9PiB7XHJcblx0XHRjb25zdCBwbGF5ZXJDc3MgPSBQbGF5ZXIuY3NzLmdlbmVyYXRvcigpO1xyXG5cdFx0Y29uc3QgbG9hZGluZ0ljb24gPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoRGdBS0FKRUFBUC8vLytCS1YvLy8vd0FBQUNIL0MwNUZWRk5EUVZCRk1pNHdBd0VBQUFBaCtRUUZDZ0FDQUN3QUFBQUFEZ0FLQUFBQ0hGU09lUVlJNzFwNk10QUp6NDExNjJ5QkgrZG81SWgxa0tHMFFnRUFJZmtFQlFvQUFnQXNBQUFCQUEwQUNBQUFBaFNVWUdFb2Vya2dkSXpLR2x1MkVULzljZUptRkFBaCtRUUZDZ0FDQUN3QUFBRUFEUUFJQUFBQ0ZKUmhjYm1pZ2x4NzhTWEtZSzZ6YStOeEh5WVZBQ0g1QkFVS0FBSUFMQUFBQVFBTkFBZ0FBQUlXVkNTQWwraHFFR1JUTGh0YmR2VHFubFVmOW5oVEFRQWgrUVFGQ2dBQ0FDd0FBQUVBRFFBSUFBQUNGWlJpWUNoNnVhQ1J6TlhZc0tWVCs1ZUJXM2dKQlFBaCtRUUpDZ0FDQUN3QUFBQUFEZ0FLQUFBQ0dwU1BhV0d3Zlpod1F0SUs4VlRVdnV4cG05WXA0WGxtcGlJVUFEcz0nO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKHBsYXllckNzcyk7XHJcblx0XHRfLmNzcyhwbGF5ZXJDc3MpO1xyXG5cclxuXHRcdC8vIGltYWdlc1xyXG5cdFx0Ly8gdG9kbyB1cGRhdGUoc2l0ZSwgc2l6ZSwgcGFkZGluZylcclxuXHRcdF8uY3NzKGBcclxuXHRcdFx0Lnl0bV9sb2FkaW5ne2JhY2tncm91bmQ6dXJsKCR7bG9hZGluZ0ljb259KSAwIDNweCBuby1yZXBlYXQ7fVxyXG5cdFx0XHQueXRtX2xpbmt7cG9zaXRpb246cmVsYXRpdmUgIWltcG9ydGFudDtiYWNrZ3JvdW5kOnVybCgke1kuREIuc2l0ZXMueW91dHViZS5mYXZpY29ufSkgMCBjZW50ZXIgbm8tcmVwZWF0ICFpbXBvcnRhbnQ7bWFyZ2luLWxlZnQ6NHB4O3BhZGRpbmctbGVmdDoyMHB4IWltcG9ydGFudDt9XHJcblx0XHRcdC55dG1fbGluay55dG1fbGlua192aW1lb3tiYWNrZ3JvdW5kLWltYWdlOnVybCgke1kuREIuc2l0ZXMudmltZW8uZmF2aWNvbn0pICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1zaXplOjEycHggMTJweCAhaW1wb3J0YW50O3BhZGRpbmctbGVmdDoxOHB4IWltcG9ydGFudH1cclxuXHRcdFx0Lnl0bV9saW5rLnl0bV9saW5rX3ZpbmV7YmFja2dyb3VuZC1pbWFnZTp1cmwoJHtZLkRCLnNpdGVzLnZpbmUuZmF2aWNvbn0pICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1zaXplOjEwcHggMTBweCFpbXBvcnRhbnQ7cGFkZGluZy1sZWZ0OjE2cHghaW1wb3J0YW50fVxyXG5cdFx0XHQueXRtX2xpbmsueXRtX2xpbmtfc291bmRjbG91ZHtiYWNrZ3JvdW5kLWltYWdlOnVybCgke1kuREIuc2l0ZXMuc291bmRjbG91ZC5mYXZpY29ufSkhaW1wb3J0YW50O3BhZGRpbmctbGVmdDoxN3B4IWltcG9ydGFudH1cclxuXHRcdFx0Lnl0bV9saW5rLnl0bV9saW5rX2h0bWw1e2JhY2tncm91bmQtaW1hZ2U6dXJsKCR7WS5EQi5zaXRlcy5odG1sNS5mYXZpY29ufSkgIWltcG9ydGFudDtwYWRkaW5nLWxlZnQ6MTZweCFpbXBvcnRhbnR9XHJcblx0XHRcdC55dG1fbGluay55dG1fbGlua19nZnljYXR7YmFja2dyb3VuZC1pbWFnZTp1cmwoJHtZLkRCLnNpdGVzLmdmeWNhdC5mYXZpY29ufSkgIWltcG9ydGFudDtiYWNrZ3JvdW5kLXNpemU6MTJweCAxMnB4ICFpbXBvcnRhbnQ7cGFkZGluZy1sZWZ0OjE2cHghaW1wb3J0YW50O31cclxuXHRcdFx0Lnl0bV9saW5rLnl0bV9saW5rX2ltZ3Vye2JhY2tncm91bmQtaW1hZ2U6dXJsKCR7WS5EQi5zaXRlcy5pbWd1ci5mYXZpY29ufSkgIWltcG9ydGFudDtiYWNrZ3JvdW5kLXNpemU6MTJweCAxMnB4ICFpbXBvcnRhbnQ7cGFkZGluZy1sZWZ0OjE2cHghaW1wb3J0YW50fVxyXG5cdFx0XHQueXRtX2xpbmsueXRtX2xpbmtfc3RyZWFtYWJsZXtiYWNrZ3JvdW5kLWltYWdlOnVybCgke1kuREIuc2l0ZXMuc3RyZWFtYWJsZS5mYXZpY29ufSkgIWltcG9ydGFudDsgYmFja2dyb3VuZC1zaXplOiAxMnB4IDEycHggIWltcG9ydGFudDtwYWRkaW5nLWxlZnQ6IDE0cHggIWltcG9ydGFudDt9XHJcblx0XHRgKTtcclxuXHJcblx0XHRfLmNzcygnLnl0bV9ub25lLC55dG1fbGluayBicntkaXNwbGF5Om5vbmUhaW1wb3J0YW50fS55dG1fYm94ey13ZWJraXQtYm94LXNpemluZzpib3JkZXItYm94Oy1tb3otYm94LXNpemluZzpib3JkZXItYm94O2JveC1zaXppbmc6Ym9yZGVyLWJveH0ueXRtX2Jsb2Nre2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246cmVsYXRpdmU7Y2xlYXI6Ym90aDt0ZXh0LWFsaWduOmxlZnQ7Ym9yZGVyOjA7bWFyZ2luOjA7cGFkZGluZzowO292ZXJmbG93OmhpZGRlbn0ueXRtX25vcm1hbGl6ZXtmb250LXdlaWdodDo0MDAhaW1wb3J0YW50O2ZvbnQtc3R5bGU6bm9ybWFsIWltcG9ydGFudDtsaW5lLWhlaWdodDoxLjIhaW1wb3J0YW50fS55dG1fc2Fuc3tmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZiFpbXBvcnRhbnR9Lnl0bV9zcGFjZXJ7b3ZlcmZsb3c6YXV0bzttYXJnaW46MCAwIDZweDtwYWRkaW5nOjRweH0ueXRtX3NwYWNlci55dG1fc2l0ZV9zbGlte2Rpc3BsYXk6aW5saW5lfS55dG1fY2xlYXI6YWZ0ZXJ7Y29udGVudDpcIlwiO2Rpc3BsYXk6dGFibGU7Y2xlYXI6Ym90aH0ueXRtX2NlbnRlcnt0ZXh0LWFsaWduOmNlbnRlcn0ueXRtX2xpbmsgYiwueXRtX2xpbmsgc3Ryb25ne2ZvbnQtd2VpZ2h0OjQwMCFpbXBvcnRhbnR9Lnl0bV9saW5rIHV7dGV4dC1kZWNvcmF0aW9uOm5vbmUhaW1wb3J0YW50fS55dG1fbGluayBpLC55dG1fbGluayBlbXtmb250LXN0eWxlOm5vcm1hbCFpbXBvcnRhbnR9Lnl0bV90cmlnZ2Vye3dpZHRoOjExOHB4O2hlaWdodDo2NnB4O2JhY2tncm91bmQtY29sb3I6IzI2MjYyNiFpbXBvcnRhbnQ7Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZC1wb3NpdGlvbjotMXB4IC0xMnB4O2Zsb2F0OmxlZnQ7Ym94LXNoYWRvdzoycHggMnB4IHJnYmEoMCwwLDAsLjMpO2JhY2tncm91bmQtc2l6ZTphdXRvIDkwcHghaW1wb3J0YW50O2NvbG9yOiNmZmY7dGV4dC1zaGFkb3c6IzMzMyAwIDAgMnB4O2ZvbnQtc2l6ZToxM3B4fS55dG1fdHJpZ2dlcjpob3Zlcntib3gtc2hhZG93OjJweCAycHggIzYwNjU2YjgwO29wYWNpdHk6Ljk1fS55dG1fdHJpZ2dlciB2YXJ7ei1pbmRleDoyO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3RvcDowO3RleHQtYWxpZ246cmlnaHR9Lnl0bV9sYWJlbHtkaXNwbGF5OmJsb2NrO3BhZGRpbmc6M3B4IDZweDtsaW5lLWhlaWdodDoxLjI7Zm9udC1zdHlsZTpub3JtYWx9Lnl0bV9pbml0e2hlaWdodDoyMnB4O2JhY2tncm91bmQ6cmdiYSgxMSwxMSwxMSwuNjIpO3BhZGRpbmc6NHB4IDI1cHggNnB4IDZweH0ueXRtX3NpdGVfdmluZSAueXRtX3RyaWdnZXJ7YmFja2dyb3VuZC1jb2xvcjojOTBlZTkwIWltcG9ydGFudDtiYWNrZ3JvdW5kLXNpemU6MTIwcHggYXV0byFpbXBvcnRhbnR9Lnl0bV9zaXRlX3NsaW0gLnl0bV90cmlnZ2Vye2JhY2tncm91bmQ6I2UzNGMyNiFpbXBvcnRhbnQ7aGVpZ2h0OmF1dG87Ym94LXNoYWRvdzowIDAgMnB4ICNmZmRiOWQgaW5zZXQsMnB4IDJweCByZ2JhKDAsMCwwLC4zKTttYXJnaW46MCAzcHggMCAwO3dpZHRoOmF1dG87dHJhbnNpdGlvbjphbGwgLjNzIGVhc2UtaW4tb3V0IDBzfS55dG1fc2l0ZV9zbGltIC55dG1fdHJpZ2dlcjpob3ZlcntvcGFjaXR5Oi44fS55dG1fc2l0ZV9zbGltIC55dG1fbGFiZWx7dGV4dC1zaGFkb3c6MCAwIDFweCAjZjA2NTI5fS55dG1fc2l0ZV9zbGltIC55dG1faW5pdHtiYWNrZ3JvdW5kOnRyYW5zcGFyZW50fS55dG1fYmR7ZmxvYXQ6bGVmdDttYXgtd2lkdGg6NDUwcHg7bWFyZ2luOjJweCAxMHB4O2ZvbnQtc2l6ZToxMnB4fS55dG1fdGl0bGV7Zm9udC13ZWlnaHQ6NzAwfS55dG1fZXJyb3J7Y29sb3I6I2NjMmYyNDtmb250LXN0eWxlOml0YWxpY30ueXRtX2xvYWRpbmd7Zm9udC1zdHlsZTppdGFsaWM7cGFkZGluZzoxcHggMS41ZW19Lnl0bV9kZXNjcnt3b3JkLXdyYXA6YnJlYWstd29yZDttYXgtaGVpZ2h0OjQ4cHg7b3ZlcmZsb3c6YXV0bztwYWRkaW5nLXJpZ2h0OjIwcHh9Lnl0bV9kZXNjcltkYXRhLWZ1bGxde2N1cnNvcjpwb2ludGVyfS55dG1fZGVzY3Jfb3BlbntyZXNpemU6Ym90aDt3aGl0ZS1zcGFjZTpwcmUtbGluZTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMCwwLDAsMCkgMCUscmdiYSgwLDAsMCwwKSA1MCUscmdiYSgwLDAsMCwwKSA4MCUscmdiYSgwLDAsMCwwLjEpIDEwMCUpfS55dG1fZGVzY3Jfb3BlbltzdHlsZV17bWF4LWhlaWdodDpub25lfS55dG1fcHJvamVjdG9ye21hcmdpbi1ib3R0b206NHB4fXVsLnl0bV9vcHRpb25ze292ZXJmbG93OmhpZGRlbjttYXJnaW46MCFpbXBvcnRhbnQ7cGFkZGluZzozcHggMCAxcHg7bGlzdC1zdHlsZS1wb3NpdGlvbjpvdXRzaWRlIWltcG9ydGFudH0ueXRtX29wdGlvbnMgbGl7ZGlzcGxheTppbmxpbmU7bWFyZ2luOjAhaW1wb3J0YW50O3BhZGRpbmc6MCFpbXBvcnRhbnR9Lnl0bV9vcHRpb25zIGxpPnVse2Rpc3BsYXk6aW5saW5lLWJsb2NrO21hcmdpbjowO3BhZGRpbmc6MCAxcHggMCAwfS55dG1fb3B0aW9ucyBsaSB1bCBsaXstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1vLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTtsaXN0LXN0eWxlLXR5cGU6bm9uZTtjdXJzb3I6cG9pbnRlcjtmbG9hdDpsZWZ0O2NvbG9yOiM4NTg1ODU7Ym9yZGVyOjFweCBzb2xpZCAjMWQxZDFkO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICMxODE4MTg7Ym9yZGVyLXRvcDoxcHggc29saWQgIzI5MjkyOTtib3gtc2hhZG93OjAgMCAxcHggIzU1NTtoZWlnaHQ6MTRweDtmb250LXNpemU6MTJweCFpbXBvcnRhbnQ7bGluZS1oZWlnaHQ6MTJweCFpbXBvcnRhbnQ7YmFja2dyb3VuZDojMjIyO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KCMyZDJjMmMsIzIyMik7bWFyZ2luOjAhaW1wb3J0YW50O3BhZGRpbmc6NXB4IDlweCAzcHghaW1wb3J0YW50fS55dG1fb3B0aW9ucyBsaSB1bCBsaTpmaXJzdC1jaGlsZHtib3JkZXItcmFkaXVzOjJweCAwIDAgMnB4fS55dG1fb3B0aW9ucyBsaSB1bCBsaTpsYXN0LWNoaWxke2JvcmRlci1sZWZ0OjAhaW1wb3J0YW50O2JvcmRlci1yYWRpdXM6MCAycHggMnB4IDA7bWFyZ2luOjAgMnB4IDAgMCFpbXBvcnRhbnR9Lnl0bV9vcHRpb25zIGxpIHVsIGxpOmZpcnN0LWNoaWxkOmxhc3QtY2hpbGQsLnl0bV9saV9zZXR0aW5ne2JvcmRlci1yYWRpdXM6MnB4fS55dG1fb3B0aW9ucyBsaSB1bCBsaTpob3Zlcntjb2xvcjojY2NjO3RleHQtc2hhZG93OjFweCAxcHggMCAjMzMzO2JhY2tncm91bmQ6IzE4MTgxOH0ueXRtX29wdGlvbnMgbGkgdWwgbGlbaWRde2NvbG9yOiNkZGQ7dGV4dC1zaGFkb3c6MCAwIDJweCAjNDQ0fS55dG1fcGFuZWxfc2l6ZXtiYWNrZ3JvdW5kOiMwMDA7bWF4LXdpZHRoOjEwMCU7fS55dG1fcGFuZWxfc3dpdGNoZXJbZGF0YS1zdGFuZGJ5PVwidHJ1ZVwiXXtiYWNrZ3JvdW5kOiMxMTF9Lnl0bV9wYW5lbF9zd2l0Y2hlcltkYXRhLXN0YW5kYnk9XCJ0cnVlXCJdOmFmdGVye2N1cnNvcjpjZWxsO2NvbG9yOiMwZTBlMGU7Y29udGVudDpcInl0bWEhXCI7ZGlzcGxheTpibG9jaztmb250LXNpemU6ODVweDtmb250LXN0eWxlOml0YWxpYztmb250LXdlaWdodDo3MDA7bGVmdDo1MCU7cG9zaXRpb246YWJzb2x1dGU7dGV4dC1zaGFkb3c6MnB4IDFweCAjMTgxODE4LC0xcHggLTFweCAjMGEwYTBhO3RvcDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpfS55dG1fc2l0ZV9zb3VuZGNsb3VkIC55dG1fcGFuZWxfc2l6ZS55dG1fc291bmRjbG91ZC1wbGF5bGlzdHtoZWlnaHQ6MzM0cHghaW1wb3J0YW50fS55dG1fZml4X2NlbnRlcntiYWNrZ3JvdW5kOnJnYmEoNTEsNTEsNTEsLjQxKTtoZWlnaHQ6MTAwJTtsZWZ0OjA7cG9zaXRpb246Zml4ZWQ7dG9wOjA7d2lkdGg6MTAwJTt6LWluZGV4Ojk5OTk4fSN5dG1fc2V0dGluZ3N7ei1pbmRleDo5OTk5OTttYXgtd2lkdGg6NTAwcHg7bWF4LWhlaWdodDo4NSU7b3ZlcmZsb3c6YXV0bztiYWNrZ3JvdW5kOiNmYmZiZmI7Ym9yZGVyOjFweCBzb2xpZCAjYmJiO2NvbG9yOiM0NDQ7Ym94LXNoYWRvdzowIDAgNXB4IHJnYmEoMCwwLDAsLjIpLDAgMCAzcHggcmdiYSgyMzksMjM5LDIzOSwuMSkgaW5zZXQ7bWFyZ2luOjQlIGF1dG87cGFkZGluZzo0cHggOHB4IDB9I3l0bV9zZXR0aW5ncyBwe21hcmdpbjo1cHggMDtwYWRkaW5nOjB9I3l0bV9zZXR0aW5ncyBmaWVsZHNldHt2ZXJ0aWNhbC1hbGlnbjp0b3A7Ym9yZGVyLXJhZGl1czozcHg7Ym9yZGVyOjFweCBzb2xpZCAjY2NjO21hcmdpbjowIDAgNXB4O3BhZGRpbmc6M3B4fSN5dG1fc2V0dGluZ3MgbGVnZW5ke3BhZGRpbmc6M3B4fSN5dG1fc2V0dGluZ3MgZmllbGRzZXQgc3BhbntkaXNwbGF5OmlubGluZS1ibG9jazttaW4td2lkdGg6NWVtfSN5dG1fc2V0dGluZ3MgaW5wdXR7dmVydGljYWwtYWxpZ246YmFzZWxpbmUhaW1wb3J0YW50O21hcmdpbjozcHggNXB4IWltcG9ydGFudH0jeXRtX3NldHRpbmdzdHtmb250LXNpemU6MTEwJTtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZDAwO21hcmdpbjozcHggMCA5cHg7cGFkZGluZzowIDNweCAzcHh9I3l0bV9zZXR0aW5ncyBsYWJlbHtjdXJzb3I6cG9pbnRlcn0jeXRtX3NldHRpbmdzIHNtYWxse2ZvbnQtc2l6ZTo5MCV9I3l0bV9vcHRzIGJ1dHRvbntjdXJzb3I6cG9pbnRlcjttYXJnaW46MTBweCA1cHggOHB4IDJweDtwYWRkaW5nOjNweDtib3JkZXI6MXB4IHNvbGlkICNhZGFkYWQ7Ym9yZGVyLXJhZGl1czoycHg7YmFja2dyb3VuZDojZWVlO2ZvbnQtc2l6ZTo5MCV9I3l0bV9vcHRzIGJ1dHRvbjpob3ZlcntiYWNrZ3JvdW5kOiNkZGR9Jyk7XHJcblx0fTtcclxuXHJcblx0WS5hamF4ID0ge1xyXG5cdFx0bG9hZDogZnVuY3Rpb24gKHNpdGUsIGlkLCB1cmkpIHtcclxuXHRcdFx0Y29uc29sZS5pbmZvKCd5dG1hLy9hamF4K2xvYWQoaWQpJywgc2l0ZSwgaWQsIHVyaSk7XHJcblx0XHRcdHVyaSA9IFkuREIuc2l0ZXNbc2l0ZV0uYWpheC5yZXBsYWNlKCcla2V5JywgaWQpLnJlcGxhY2UoJyV1cmknLCB1cmkpO1xyXG5cclxuXHRcdFx0aWYgKFkuREIuc2l0ZXNbc2l0ZV0uYWpheEV4dGVuc2lvbikgeyByZXR1cm4gdGhpcy5nbXhocih1cmksIHNpdGUsIGlkKTsgfVxyXG5cclxuXHRcdFx0Y29uc29sZS5pbmZvKCd5dG1hLy9hamF4K2xvYWQodXJpKScsIFkuREIuc2l0ZXNbc2l0ZV0uYWpheC5yZXBsYWNlKCcla2V5JywgaWQpLnJlcGxhY2UoJyV1cmknLCB1cmkpKTtcclxuXHRcdFx0aWYgKFkuREIuc2l0ZXNbc2l0ZV0uYWpheCkge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdwcmVwaW5nIHVyaScpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnhocih1cmksIHNpdGUsIGlkKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9LFxyXG5cdFx0bG9hZEZyb21EYXRhc2V0OiBmdW5jdGlvbiAoZGF0YXNldCkge1xyXG5cdFx0XHRpZiAoIXRoaXMubG9hZEZyb21DYWNoZURhdGFzZXQoZGF0YXNldCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkKGRhdGFzZXQueXRtc2l0ZSwgZGF0YXNldC55dG1pZCwgZGF0YXNldC55dG11cmkpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0bG9hZEZyb21DYWNoZURhdGFzZXQ6IGZ1bmN0aW9uICh7IHl0bXNpdGUsIHl0bWlkIH0pIHtcclxuXHRcdFx0Y29uc3QgY2FjaGUgPSBZLmV4dGVybmFsLmRhdGFGcm9tU3RvcmFnZSh5dG1zaXRlLCB5dG1pZCk7XHJcblxyXG5cdFx0XHRjb25zb2xlLmluZm8oJ3l0bWEvL2FqYXgrY2FjaGUoaWQpJywgeXRtc2l0ZSwgeXRtaWQpO1xyXG5cdFx0XHRjb25zb2xlLmluZm8oJ3l0bWEvL2FqYXgrY2FjaGUoZGF0YSknLCBjYWNoZSk7XHJcblxyXG5cdFx0XHRpZiAoY2FjaGUpIHsgWS5leHRlcm5hbC5wb3B1bGF0ZShjYWNoZSk7IH1cclxuXHJcblx0XHRcdHJldHVybiBjYWNoZTtcclxuXHRcdH0sXHJcblx0XHRnbXhocjogZnVuY3Rpb24gKHVyaSwgc2l0ZSwgaWQpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnZ214aHIgc3RhcnRpbmchJyk7XHJcblx0XHRcdFx0R00ueG1saHR0cFJlcXVlc3Qoe1xyXG5cdFx0XHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0XHRcdHVybDogdXJpLFxyXG5cdFx0XHRcdFx0b25sb2FkOiBmdW5jdGlvbiAoeyByZXNwb25zZVRleHQgfSkge1xyXG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRcdFx0XHRcdFkuZXh0ZXJuYWwucGFyc2UocmVzcG9uc2VUZXh0LCBzaXRlLCBpZCk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0b25lcnJvcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnR00gQ2Fubm90IFhIUicpO1xyXG5cdFx0XHRcdFx0XHRZLmFqYXguZmFpbHVyZS5jYWxsKHsgaWQgfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFkuYWpheC5wcmVQcm9jZXNzKGlkKTtcclxuXHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRpZiAoWS5EQi5leHRlbnNpb24pIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbygneXRtYS8vZ214aHItY29ycycpO1xyXG5cdFx0XHRcdFx0dGhpcy54aHIodXJpLCBzaXRlLCBpZCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdObyBhcHBsaWNhYmxlIENPUlMgcmVxdWVzdCBhdmFpbGFibGUuJyk7XHJcblx0XHRcdFx0XHR0aGlzLmZhaWx1cmUuY2FsbCh7IGlkIH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHhocjogZnVuY3Rpb24gKHVyaSwgc2l0ZSwgaWQpIHtcclxuXHRcdFx0Y29uc3QgeCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRjb25zb2xlLmluZm8oJ3l0bWEvL3hocicsIHVyaSwgaWQsIHNpdGUpO1xyXG5cclxuXHRcdFx0WS5hamF4LnByZVByb2Nlc3MoaWQpO1xyXG5cclxuXHRcdFx0eC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLnJlYWR5U3RhdGUsIHRoaXMuc3RhdHVzKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XHJcblx0XHRcdFx0XHRcdFkuZXh0ZXJuYWwucGFyc2UodGhpcy5yZXNwb25zZVRleHQsIHNpdGUsIGlkKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgPT09IDQwMykge1xyXG5cdFx0XHRcdFx0XHRZLmV4dGVybmFsLnBvcHVsYXRlKHsgc2l0ZSwgaWQsIHRpdGxlOiAnRXJyb3IgNDAzJywgZGVzYzogJycgfSk7XHJcblx0XHRcdFx0XHRcdFkuZXh0ZXJuYWwuc2F2ZSh7IHNpdGUsIGlkLCB0aXRsZTogJ0Vycm9yIDQwMycsIGRlc2M6ICcnIH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHsgLy8gaWYgKHRoaXMuc3RhdHVzID49IDQwMCB8fCB0aGlzLnN0YXR1cyA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRZLmFqYXguZmFpbHVyZS5jYWxsKHsgaWQgfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmluZm8oJ3l0bWEvL3hocitzZW5kaW5nJyk7XHJcblx0XHRcdFx0eC5vcGVuKCdnZXQnLCB1cmksIHRydWUpO1xyXG5cdFx0XHRcdHguc2VuZCgpO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcigneXRtYS8veGhyK2ZhaWxlZChjYW5ub3Qgc2VuZCB4aHIpJywgdXJpKTtcclxuXHRcdFx0XHRZLmFqYXguZmFpbHVyZS5jYWxsKHsgaWQgfSk7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGZhaWx1cmU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Xy5zKGAueXRtX2JkLl8ke1kuZXNjYXBlSWQodGhpcy5pZCl9YCwgZWwgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IGEgPSBlbC5xdWVyeVNlbGVjdG9yKCdhJyk7XHJcblx0XHRcdFx0YS5kYXRhc2V0LnRyaWVzID0gYS5kYXRhc2V0LnRyaWVzID8gcGFyc2VGbG9hdChhLmRhdGFzZXQudHJpZXMpICsgMSA6IDE7XHJcblx0XHRcdFx0aWYgKGEuZGF0YXNldC50cmllcyA+PSA1KSB7XHJcblx0XHRcdFx0XHRhLnRleHRDb250ZW50ID0gJ01heCBhdHRlbXB0cyByZWFjaGVkJztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0YS50ZXh0Q29udGVudCA9IGBFcnJvciwgdW5hYmxlIHRvIGxvYWQgZGF0YS4ke2EuZGF0YXNldC50cmllcyA+IDEgPyAnJyA6ICcgW1JldHJ5XSd9YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YS5jbGFzc05hbWUgPSAneXRtX2Vycm9yIHl0bV90aXRsZSc7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdHByZVByb2Nlc3M6IGZ1bmN0aW9uIChpZCkge1xyXG5cdFx0XHRfLnMoYC55dG1fbWFudWFsLl8ke1kuZXNjYXBlSWQoaWQpfSBhYCwgZWwgPT4ge1xyXG5cdFx0XHRcdGVsLmNsYXNzTGlzdC5hZGQoJ3l0bV9sb2FkaW5nJyk7XHJcblx0XHRcdFx0ZWwudGV4dENvbnRlbnQgPSAnTG9hZGluZyc7XHJcblx0XHRcdFx0ZWwudGl0bGUgPSAnUmV0cnkgbG9hZGluZyBkYXRhLic7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKiBFIFggVCBFIFIgTiBBIEwgQXBwYXJhdHVzXHJcblx0ICogRGF0YSBmcm9tIGV4dGVybmFsIHNpdGVzXHJcblx0ICovXHJcblx0WS5leHRlcm5hbCA9IHtcclxuXHRcdHZlcnNpb246ICd5dG1hLjQuMS5kYXQnLFxyXG5cdFx0cGFyc2U6IGZ1bmN0aW9uIChyZXNwb25zZSwgc2l0ZSwgaWQpIHtcclxuXHRcdFx0aWYgKHRoaXMucGFyc2Vyc1tzaXRlXSkge1xyXG5cdFx0XHRcdHJlc3BvbnNlID0gWS5EQi5zaXRlc1tzaXRlXS5yYXdSZXNwb25zZSA/IHJlc3BvbnNlIDogSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcblx0XHRcdFx0dGhpcy5wb3B1bGF0ZSh0aGlzLmhlbHBlci5jdXREZXNjcmlwdGlvbih0aGlzLnBhcnNlcnNbc2l0ZV0ocmVzcG9uc2UsIGlkKSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0cGFyc2Vyczoge1xyXG5cdFx0XHRzb3VuZGNsb3VkOiBmdW5jdGlvbiAoeyB0aXRsZSwgZGVzY3JpcHRpb24sIHRodW1ibmFpbF91cmwgfSwgaWQpIHtcclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0c2l0ZTogJ3NvdW5kY2xvdWQnLFxyXG5cdFx0XHRcdFx0aWQsIC8vdW5lc2NhcGUoai5odG1sKS5tYXRjaCgvdHJhY2tzXFwvKFxcZCspLylbMV0sXHJcblx0XHRcdFx0XHR0aXRsZSxcclxuXHRcdFx0XHRcdGRlc2M6IGRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0dGg6IHJlbW92ZVNlYXJjaCh0aHVtYm5haWxfdXJsKVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0sXHJcblx0XHRcdHZpbWVvOiBmdW5jdGlvbiAoaikge1xyXG5cdFx0XHRcdGogPSBqWzBdO1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRzaXRlOiAndmltZW8nLFxyXG5cdFx0XHRcdFx0aWQ6IGouaWQsXHJcblx0XHRcdFx0XHR0aXRsZTogYCR7ai50aXRsZX0gJHtZLmV4dGVybmFsLnRpbWUuZnJvbVNlY29uZHMoai5kdXJhdGlvbil9YCxcclxuXHRcdFx0XHRcdGRlc2M6IGouZGVzY3JpcHRpb24ucmVwbGFjZSgvPGJyLj8uPz4vZywgJycpLFxyXG5cdFx0XHRcdFx0dGg6IGRlY29kZVVSSShqLnRodW1ibmFpbF9tZWRpdW0pXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSxcclxuXHRcdFx0eW91dHViZTogZnVuY3Rpb24gKGosIGlkKSB7XHJcblx0XHRcdFx0aWYgKGoucGFnZUluZm8udG90YWxSZXN1bHRzIDwgMSB8fCBqLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHsgaWQsIGVycm9yOiB0cnVlIH07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRqID0gai5pdGVtc1swXTtcclxuXHRcdFx0XHRjb25zdCBvID0ge1xyXG5cdFx0XHRcdFx0c2l0ZTogJ3lvdXR1YmUnLFxyXG5cdFx0XHRcdFx0aWQsXHJcblx0XHRcdFx0XHR0aXRsZTogYCR7ai5zbmlwcGV0LnRpdGxlfSAke1kuZXh0ZXJuYWwudGltZS5mcm9tSXNvODYwMShqLmNvbnRlbnREZXRhaWxzLmR1cmF0aW9uKX1gLFxyXG5cdFx0XHRcdFx0ZGVzYzogai5zbmlwcGV0LmRlc2NyaXB0aW9uXHJcblx0XHRcdFx0XHQvLyBhc3BlY3RSYXRpbzogai5jb250ZW50RGV0YWlscy5hc3BlY3RSYXRpb1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHJldHVybiBvO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR2aW5lOiBmdW5jdGlvbiAoeyB0aXRsZSwgdGh1bWJuYWlsX3VybCB9LCBpZCkge1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRzaXRlOiAndmluZScsXHJcblx0XHRcdFx0XHRpZCxcclxuXHRcdFx0XHRcdHRpdGxlLFxyXG5cdFx0XHRcdFx0dGg6IHJlbW92ZVNlYXJjaCh0aHVtYm5haWxfdXJsKVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0sXHJcblx0XHRcdGdmeWNhdDogZnVuY3Rpb24gKGh0bWwsIGlkKSB7XHJcblx0XHRcdFx0aWYgKGh0bWwpIHtcclxuXHRcdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRcdHNpdGU6ICdnZnljYXQnLFxyXG5cdFx0XHRcdFx0XHRpZDogaWQsXHJcblx0XHRcdFx0XHRcdHRpdGxlOiBpZFxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHN0cmVhbWFibGU6IGZ1bmN0aW9uICh7IHRpdGxlIH0sIGlkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdHNpdGU6ICdzdHJlYW1hYmxlJyxcclxuXHRcdFx0XHRcdGlkLFxyXG5cdFx0XHRcdFx0dGl0bGU6IHRpdGxlIHx8ICdVbnRpdGxlZCdcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0c2V0OiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRpZiAoIXRoaXMuZGJbZGF0YS5zaXRlXSkge1xyXG5cdFx0XHRcdHRoaXMuZGJbZGF0YS5zaXRlXSA9IHt9O1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZGJbZGF0YS5zaXRlXVtkYXRhLmlkXSA9IGRhdGE7XHJcblx0XHRcdHJldHVybiB0aGlzLnNhdmUoKTtcclxuXHRcdH0sXHJcblx0XHR1bnNldDogZnVuY3Rpb24gKHsgc2l0ZSwgaWQgfSkge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygndW5zZXQnLCBkYXRhLmlkKTtcclxuXHRcdFx0aWYgKHNpdGUpIHtcclxuXHRcdFx0XHRkZWxldGUgdGhpcy5kYltzaXRlXVtpZF07XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2F2ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0bGltaXREQjogZnVuY3Rpb24gKG1heCwgZGIpIHtcclxuXHRcdFx0Ly8gbGltaXRzIGFuIG9iamVjdCdzIGl0ZW1zIGJ5IGhhbGYgb2YgdGhlIG1heFxyXG5cdFx0XHQvLyByZW1vdmVzIHRoZSBvbGRlciBpdGVtcyBhdCB0aGUgc3RhcnQgb2YgdGhlIG9iamVjdFxyXG5cdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZGIpO1xyXG5cclxuXHRcdFx0Y29uc3QgaGFsZiA9IE1hdGguZmxvb3IobWF4IC8gMik7XHJcblx0XHRcdGxldCBzdGFydDtcclxuXHRcdFx0bGV0IG5kYjtcclxuXHRcdFx0bGV0IGk7XHJcblxyXG5cdFx0XHRpZiAoa2V5cy5sZW5ndGggPiBtYXgpIHtcclxuXHRcdFx0XHRuZGIgPSB7fTtcclxuXHRcdFx0XHRzdGFydCA9IGtleXMubGVuZ3RoIC0gaGFsZjtcclxuXHJcblx0XHRcdFx0Zm9yIChpID0gc3RhcnQ7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRuZGJba2V5c1tpXV0gPSBkYltrZXlzW2ldXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBuZGIgfHwgZGI7XHJcblx0XHR9LFxyXG5cdFx0c2F2ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR0aGlzLmRiID0gdGhpcy5saW1pdERCKDEwMDAsIHRoaXMuZGIpO1xyXG5cdFx0XHRyZXR1cm4gc3RyZy5zYXZlKHRoaXMudmVyc2lvbiwgdGhpcy5kYik7XHJcblx0XHR9LFxyXG5cdFx0aGVscGVyOiB7XHJcblx0XHRcdGN1dERlc2NyaXB0aW9uOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdGlmIChkYXRhLmRlc2MgJiYgZGF0YS5kZXNjLmxlbmd0aCA+IDE0MCkge1xyXG5cdFx0XHRcdFx0ZGF0YS5mdWxsID0gZGF0YS5kZXNjO1xyXG5cdFx0XHRcdFx0ZGF0YS5kZXNjID0gYCR7ZGF0YS5kZXNjLnN1YnN0cigwLCAxMzApfSAuIC4gLmA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR0aHVtYm5haWw6IGZ1bmN0aW9uICh7IGlkLCB0aCB9KSB7XHJcblx0XHRcdFx0Xy5zKGBbZGF0YS15dG1pZD1cIiR7aWR9XCJdLnl0bV90cmlnZ2VyYCwgZWwgPT4gZWwuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBiYWNrZ3JvdW5kOiB1cmwoJHt0aH0pYCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0dGltZToge1xyXG5cdFx0XHRrZWVwTWludXRlc0FuZFNlY29uZHM6IGZ1bmN0aW9uICh2LCBpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGkgPiAxIHx8IHYgPiAwO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRsZWFkaW5nWmVybzogZnVuY3Rpb24gKHYsIGkpIHtcclxuXHRcdFx0XHRyZXR1cm4gaSA+IDAgPyAoYDAwJHt2fWApLnNsaWNlKC0yKSA6IHY7XHJcblx0XHRcdH0sXHJcblx0XHRcdGZyb21BcnJheTogZnVuY3Rpb24gKGEpIHtcclxuXHRcdFx0XHQvLyBbZGF5cywgaG91cnMsIG1pbnMsIHNlY3NdXHJcblx0XHRcdFx0bGV0IGI7XHJcblxyXG5cdFx0XHRcdGxldCBwID0gJyc7XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQvLyBSZW1vdmUgZW1wdHkgdmFsdWVzLCBidXQga2VlcCBsb3dlciBpbmRleGVzIChtOnMpOyBhW2ldID4gMCB8fCBpID4gMVxyXG5cdFx0XHRcdFx0Ly8gQWRkIGxlYWRpbmcgMCdzLCBpZ25vcmluZyB0aGUgZmlyc3QgaW5kZXhcclxuXHRcdFx0XHRcdC8vIGEuc2xpY2UoMCwgMSkuY29uY2F0KGEuc2xpY2UoMSkpXHJcblx0XHRcdFx0XHRiID0gYS5maWx0ZXIodGhpcy5rZWVwTWludXRlc0FuZFNlY29uZHMpLm1hcCh0aGlzLmxlYWRpbmdaZXJvKTtcclxuXHRcdFx0XHRcdHAgPSBgKCR7Yi5qb2luKCc6Jyl9KWA7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignQ291bGQgbm90IHBhcnNlIHRoaXMgdGltZS4nKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnNvbGUuaW5mbygneXRtYS8vdGltZSthcnJheScsIHsgYSwgYiwgcCB9KTtcclxuXHRcdFx0XHRyZXR1cm4gcDtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZnJvbUlzbzg2MDE6IGZ1bmN0aW9uIChpc284NjAxKSB7XHJcblx0XHRcdFx0Ly8gZWcgUFQzTSwgVDI5U1xyXG5cdFx0XHRcdGxldCBhO1xyXG5cclxuXHRcdFx0XHRjb25zdCBwYXJzZURpZ2l0cyA9IHJlZyA9PiB7XHJcblx0XHRcdFx0XHRpZiAocmVnLnRlc3QoaXNvODYwMSkpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIFJlZ0V4cC5sYXN0UGFyZW47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQvLyBQI0RUI0gjTSNTIHx8IFBUI0gjTSNTXHJcblx0XHRcdFx0YSA9IFsvKFxcZCspRC8sIC8oXFxkKylILywgLyhcXGQrKU0vLCAvKFxcZCspUy9dLm1hcChwYXJzZURpZ2l0cyk7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzLmZyb21BcnJheShhKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZnJvbVNlY29uZHM6IGZ1bmN0aW9uIChzZWNvbmRzKSB7XHJcblx0XHRcdFx0Y29uc3QgYSA9IFtcclxuXHRcdFx0XHRcdE1hdGguZmxvb3Ioc2Vjb25kcyAvIDg2NDAwKSAlIDI0LFxyXG5cdFx0XHRcdFx0TWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCkgJSA2MCxcclxuXHRcdFx0XHRcdE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKSAlIDYwLFxyXG5cdFx0XHRcdFx0c2Vjb25kcyAlIDYwXHJcblx0XHRcdFx0XTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mcm9tQXJyYXkoYSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR2YWxpZGF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0aWYgKCFkYXRhIHx8ICFkYXRhLmlkIHx8IGRhdGEuZXJyb3IpIHtcclxuXHRcdFx0XHRyZXR1cm4gWS5hamF4LmZhaWx1cmUuY2FsbChkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gdG9kbz8gZW1wdHkgdGl0bGVzIGFuZCBkZXNjcmlwdGlvbnMgc2hvdWxkIGJlIG9rYXlcclxuXHRcdFx0Ly8gaWYgKGRhdGEuaWQgJiYgIWRhdGEudGl0bGUgJiYgIWRhdGEuZGVzYykge1xyXG5cdFx0XHQvLyBcdHRoaXMudW5zZXQoZGF0YS5pZCk7XHJcblx0XHRcdC8vIFx0cmV0dXJuIFlUTUEuYWpheC5mYWlsdXJlLmNhbGwoZGF0YSk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSxcclxuXHRcdHBvcHVsYXRlOiBmdW5jdGlvbiAoZGF0YSwgaWdub3JlVmFsaWRhdGlvbikge1xyXG5cdFx0XHRpZiAoIWlnbm9yZVZhbGlkYXRpb24gJiYgIXRoaXMudmFsaWRhdGUoZGF0YSkpIHsgcmV0dXJuOyB9XHJcblxyXG5cdFx0XHR0aGlzLnNldChkYXRhKTtcclxuXHRcdFx0Y29uc3QgeyBpZCwgdGgsIGZ1bGwsIGRlc2MsIHRpdGxlIH0gPSBkYXRhO1xyXG5cclxuXHRcdFx0aWYgKHRoKSB7IHRoaXMuaGVscGVyLnRodW1ibmFpbChkYXRhKTsgfVxyXG5cclxuXHRcdFx0Xy5zKGAueXRtX2JkLl8ke1kuZXNjYXBlSWQoaWQpfWAsIGVsID0+IHtcclxuXHRcdFx0XHRlbC5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJ5dG1fdGl0bGVcIj4ke3RpdGxlfTwvc3Bhbj5gO1xyXG5cdFx0XHRcdGlmIChkZXNjKSB7XHJcblx0XHRcdFx0XHRjb25zdCBxID0gXy5lKCdxJywgeyBjbGFzc05hbWU6ICd5dG1fZGVzY3IgeXRtX2Jsb2NrJywgdGV4dENvbnRlbnQ6IGRlc2MgfSwgZWwpO1xyXG5cdFx0XHRcdFx0aWYgKGZ1bGwubGVuZ3RoID4gZGVzYy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0cS5kYXRhc2V0LmZ1bGwgPSBmdWxsO1xyXG5cdFx0XHRcdFx0XHRxLnRpdGxlID0gJ0RvdWJsZSBjbGljayB0byB0b2dnbGUgdGhlIGRlc2NyaXB0aW9uLic7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRkYXRhRnJvbVN0b3JhZ2U6IGZ1bmN0aW9uIChzaXRlLCBpZCkge1xyXG5cdFx0XHRpZiAodGhpcy5kYiAmJiB0aGlzLmRiW3NpdGVdKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGJbc2l0ZV1baWRdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRZLmV4dGVybmFsLmRiID0gc3RyZy5ncmFiKFkuZXh0ZXJuYWwudmVyc2lvbiwge30pO1xyXG5cclxuXHQvKiogRGF0YWJhc2UgKi9cclxuXHRZLkRCID0ge1xyXG5cdFx0cG9zdEluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKFkudXNlci5wcmVmZXJlbmNlcy55dF9ub2Nvb2tpZSkge1xyXG5cdFx0XHRcdFkuREIuc2l0ZXMueW91dHViZS5ob21lID0gJ2h0dHBzOi8vd3d3LnlvdXR1YmUtbm9jb29raWUuY29tLyc7XHJcblx0XHRcdFx0WS5EQi5zaXRlcy55b3V0dWJlLmVtYmVkID0gJ2h0dHBzOi8vd3d3LnlvdXR1YmUtbm9jb29raWUuY29tL2VtYmVkLyVrZXknO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0ZXh0ZW5zaW9uOiB3aW5kb3cuY2hyb21lICYmIHdpbmRvdy5jaHJvbWUuZXh0ZW5zaW9uLFxyXG5cdFx0c2l0ZXM6IHsgLy8gc3VwcG9ydGVkIHNpdGVzIC0gdG8gYWRkIG1vcmUgYWxzbyBtYWtlIGEgcGFyc2VyIChpZiBhcGkgaXMgYXZhaWxhYmxlKSBhbmQgYWRkIGFuIGl0ZW0gdG8gc291cmNlcyAoaWYgbmVjZXNzYXJ5KVxyXG5cdFx0XHR5b3V0dWJlOiB7XHJcblx0XHRcdFx0dGl0bGU6ICd5dG1hIScsXHJcblx0XHRcdFx0aG9tZTogJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tLycsXHJcblx0XHRcdFx0ZW1iZWQ6ICdodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8la2V5JyxcclxuXHRcdFx0XHRhamF4OiBgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20veW91dHViZS92My92aWRlb3M/cGFydD1zbmlwcGV0LGNvbnRlbnREZXRhaWxzJmlkPSVrZXkke3dpbmRvdy5hdG9iKCdKbXRsZVQxQlNYcGhVM2xFVkc1SU5reHpSRVJ5VkVsWWFGWlRaV1JRUWpseVJIbzFjekJTY3pRelpuTT0nKX1gLFxyXG5cdFx0XHRcdHRodW1iOiAndXJsKGh0dHBzOi8vaTMueXRpbWcuY29tL3ZpLyVrZXkvMS5qcGcpJyxcclxuXHRcdFx0XHRzZWxlY3RvcjogJ2FbaHJlZio9XCJ5b3V0dWJlLlwiXSwgYVtocmVmKj1cInlvdXR1LmJlL1wiXScsXHJcblx0XHRcdFx0ZmF2aWNvbjogJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2Zhdmljb24uaWNvJyxcclxuXHRcdFx0XHRrZXk6ICdpZCcsXHJcblx0XHRcdFx0cmVnOiAnKHlvdXR1KScsXHJcblx0XHRcdFx0bWF0Y2hlcjogLyg/Oig/Oig/OnY9fCNwXFwvdVxcL1xcZCo/XFwvKXwoPzp2PXwjcFxcL2NcXC9bYS16QS1aMC05XStcXC9cXGQqP1xcLyl8KD86ZW1iZWRcXC8pfCg/OnZcXC8pfCg/OlxcLmJlXFwvKSkoW0EtWmEtejAtOS1fXXsxMX0pKS9pLFxyXG5cdFx0XHRcdGh0dHBzOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdHZpbWVvOiB7XHJcblx0XHRcdFx0dGl0bGU6ICd2aW1lbyB0b28hJyxcclxuXHRcdFx0XHRob21lOiAnaHR0cHM6Ly92aW1lby5jb20vJyxcclxuXHRcdFx0XHRlbWJlZDogJ2h0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8la2V5P2JhZGdlPTAnLFxyXG5cdFx0XHRcdGFqYXg6ICdodHRwczovL3ZpbWVvLmNvbS9hcGkvdjIvdmlkZW8vJWtleS5qc29uJyxcclxuXHRcdFx0XHRzZWxlY3RvcjogJ2FbaHJlZio9XCJ2aW1lby5jb20vXCJdJyxcclxuXHRcdFx0XHRmYXZpY29uOiAnaHR0cHM6Ly9mLnZpbWVvY2RuLmNvbS9pbWFnZXNfdjYvZmF2aWNvbi5pY28nLFxyXG5cdFx0XHRcdGtleTogJ2lkJyxcclxuXHRcdFx0XHRyZWc6ICcodmltZW8pJyxcclxuXHRcdFx0XHRtYXRjaGVyOiAvKD86dmltZW9cXC5jb21cXC8oXFxkKykpL2ksXHJcblx0XHRcdFx0aHR0cHM6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0dmluZToge1xyXG5cdFx0XHRcdHRpdGxlOiAndmluZSBtZSEnLFxyXG5cdFx0XHRcdGhvbWU6ICdodHRwczovL3ZpbmUuY28vJyxcclxuXHRcdFx0XHRlbWJlZDogJ2h0dHBzOi8vdmluZS5jby92LyVrZXkvZW1iZWQvc2ltcGxlP2F1ZGlvPTEnLFxyXG5cdFx0XHRcdGFqYXhFeHRlbnNpb246IHRydWUsXHJcblx0XHRcdFx0YWpheDogJ2h0dHBzOi8vdmluZS5jby9vZW1iZWQuanNvbj91cmw9aHR0cHMlM0ElMkYlMkZ2aW5lLmNvJTJGdiUyRiVrZXknLFxyXG5cdFx0XHRcdHNlbGVjdG9yOiAnYVtocmVmKj1cInZpbmUuY28vXCJdJyxcclxuXHRcdFx0XHRmYXZpY29uOiAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQmNrbEVRVlE0algyU3Z5dkZZUlRHUCs5TmR6QVlicElreXNBL0lDbktvRXd2QTR2bFVrb3lHUXp2b09pSzRSMFliRExoRGhiaTltYVdJakVxY1NjV2t5UmhNTnpYY00vM09uMzlPTXQ1bnZPZTg1d2Z2U2JHeUg5bWdzOENxOEFVa0FNZWdVMWdKVnBYcWZ1M3VtcGJ3SVRpTFVCQjhISkd1cnliNEtNSi9pelZ2VU1WbndOandKUHdHWUNNa0xMNHpsVDNYb1VMMGJvRDRGQk5VaE80RmQ5b2dtOVNSVm1GbjhVbmE3OXFnV3VWMkszd3ZjTEpkRzNpTDdUYWlVb2NBSTRGbjB2bkhEQnJndCtMMWcycTNOb0VsOENINEtIa01WcjNDU3dJN1FlT1RQQTlXc0FrLzhBRXZ3K01TcndyV2xldUpRVmZBQlpKV2JUT1pCVGZWWGc2bGJnRUhLalFUY0wxQkZuZ0FXaW1ldUgyYU4yTHZIVURWMUpjak5ibDB6ZEk5bDBUMnBEc2JvS3ZCN1lsL2dhNFgyK2drdStBVnFBQzlBRnp3TGlrNUtOMXhUOEZSR1FFT0JMNnlmZG4yb25XVFpLeVREb1FyU3NCNjBLVDRsTlNoLzFUUUVUbWdRMVpvd1FNeTQxKzJCZUxSWGVSYUt1SFNBQUFBQUJKUlU1RXJrSmdnZz09JyxcclxuXHRcdFx0XHRrZXk6ICdpZCcsXHJcblx0XHRcdFx0cmVnOiAnKHZpbmUpJyxcclxuXHRcdFx0XHRtYXRjaGVyOiAvKD86dmluZVxcLmNvXFwvdlxcLyhbQS1aYS16MC05LV9dezExfSkpL2lcclxuXHRcdFx0fSxcclxuXHRcdFx0c291bmRjbG91ZDoge1xyXG5cdFx0XHRcdHRpdGxlOiAnc291bmQgb2ZmIScsXHJcblx0XHRcdFx0aG9tZTogJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vJyxcclxuXHRcdFx0XHRlbWJlZDogJ2h0dHBzOi8vdy5zb3VuZGNsb3VkLmNvbS9wbGF5ZXIvP3Nob3dfY29tbWVudHM9ZmFsc2UmdXJsPSVrZXknLFxyXG5cdFx0XHRcdGFqYXg6ICdodHRwczovL3NvdW5kY2xvdWQuY29tL29lbWJlZD9mb3JtYXQ9anNvbiZ1cmw9JXVyaScsXHJcblx0XHRcdFx0ZmF2aWNvbjogJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQXdBQUFBTUNBWUFBQUJXZFZ6bkFBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCQlpHOWlaU0JKYldGblpWSmxZV1I1Y2NsbFBBQUFBWFpKUkVGVWVOcDBVakZPdzBBUW5EM2JDWWFFb0lnaVVJUUtpa2lBS0tHZ1NBa0ZMMEJRMEZFZ1VmRUNTaHBld0IrUUVFK2dva0RpQnhHUmlDQ0VCQnpIZDh1Y0xZR1E0S3c3KzlhemM3T3pKNm9LbkZZVXhnRCtXL0RIWU5BNTRHSW9vaWZUaXRZcWcxb2thUEZmZjZCY1RMRjVmRUNZYjVJSk5KM2tNZlVQMmR4SFB5Y3djUTBTbGlBUm9jU0dzQTQ2WWtLV1FXMEdTNkJEQUdsdTVNeXU4NEFnU21IS00vRFkwTmVnd3dSMitBSnJTakJyZTVCYUExSDdHRktwSTcyOVFIcDlqcWlhZVRCbjVtQjdmV2lyaldCOUI5SllCcndFTW5vcDVkMHpmRDUzWU85dllNWThTUWNwWkdrVFp2c0lzdGlpdkRmb2F4Zkl4dDhleFllWENMWU9TT3dsSlpRNnR3U3BMMERmWDRFb1p0a0NxYzcvTmphbGJ4bmZkdCtvU3dodXJrQm5DV0kvMUZsZ3FnS05aM0puWkRTQTNGRlNwWWRRQW9GNTZ0S05EbWhPWVR6SjNPU0hYWmtmbEpoWUV5YXdjbkgwMkhwbXhaK0RyUkpsZ21hY3Zyc0hSbUhsbjJ0Um5JaUF5NVdUTHdFR0FLNFFvQlFtdEdIa0FBQUFBRWxGVGtTdVFtQ0MnLFxyXG5cdFx0XHRcdHNlbGVjdG9yOiAnYVtocmVmKj1cInNvdW5kY2xvdWQuY29tL1wiXScsXHJcblx0XHRcdFx0a2V5OiAndXJpJyxcclxuXHRcdFx0XHRyZWc6ICcoc291bmRjbG91ZCknLFxyXG5cdFx0XHRcdG1hdGNoZXI6IC8oPzpcXC9cXC8oPzpcXGJ3d3d8bVxcLlxcYik/c291bmRjbG91ZFxcLmNvbVxcLyguKz9cXC8uKykpL2ksXHJcblx0XHRcdFx0aHR0cHM6IHRydWUsXHJcblx0XHRcdFx0c2Nyb2xsOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdGdmeWNhdDoge1xyXG5cdFx0XHRcdHRpdGxlOiAnZ2Z5Y2F0IG1lb3chJyxcclxuXHRcdFx0XHRob21lOiAnaHR0cHM6Ly9nZnljYXQuY29tLycsXHJcblx0XHRcdFx0ZW1iZWQ6ICdodHRwczovL2dmeWNhdC5jb20vaWZyYW1lLyVrZXknLFxyXG5cdFx0XHRcdGFqYXhFeHRlbnNpb246IHRydWUsXHJcblx0XHRcdFx0cmF3UmVzcG9uc2U6IHRydWUsXHJcblx0XHRcdFx0YWpheDogJ2h0dHBzOi8vZ2Z5Y2F0LmNvbS8la2V5JyxcclxuXHRcdFx0XHR0aHVtYjogJ3VybChodHRwczovL3RodW1icy5nZnljYXQuY29tLyVrZXktcG9zdGVyLmpwZyknLFxyXG5cdFx0XHRcdHNlbGVjdG9yOiAnYVtocmVmKj1cImdmeWNhdC5jb20vXCJdJyxcclxuXHRcdFx0XHRmYXZpY29uOiAnaHR0cHM6Ly9nZnljYXQuY29tL2Zhdmljb24uaWNvJyxcclxuXHRcdFx0XHRrZXk6ICdpZCcsXHJcblx0XHRcdFx0cmVnOiAnKGdmeWNhdCknLFxyXG5cdFx0XHRcdG1hdGNoZXI6IC8oPzpnZnljYXRcXC5jb21cXC8oPzooXFxiKD86W0EtWl1bYS16XSopezMsfVxcYikpKS9pLFxyXG5cdFx0XHRcdGh0dHBzOiB0cnVlLFxyXG5cdFx0XHRcdHNjcm9sbDogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdHJlYW1hYmxlOiB7XHJcblx0XHRcdFx0dGl0bGU6ICdzdHJlYW1hYmxlIScsXHJcblx0XHRcdFx0aG9tZTogJ2h0dHBzOi8vc3RyZWFtYWJsZS5jb20vJyxcclxuXHRcdFx0XHRlbWJlZDogJ2h0dHBzOi8vc3RyZWFtYWJsZS5jb20vZS8la2V5JyxcclxuXHRcdFx0XHRhamF4OiAnaHR0cHM6Ly9hcGkuc3RyZWFtYWJsZS5jb20vb2VtYmVkLmpzb24/dXJsPSV1cmknLFxyXG5cdFx0XHRcdHRodW1iOiAndXJsKGh0dHBzOi8vY2RuLnN0cmVhbWFibGUuY29tL2ltYWdlLyVrZXkuanBnKScsXHJcblx0XHRcdFx0c2VsZWN0b3I6ICdhW2hyZWYqPVwic3RyZWFtYWJsZS5jb20vXCJdJyxcclxuXHRcdFx0XHRmYXZpY29uOiAnaHR0cHM6Ly9zdHJlYW1hYmxlLmNvbS9mYXZpY29uLmljbycsXHJcblx0XHRcdFx0a2V5OiAnaWQnLFxyXG5cdFx0XHRcdHJlZzogJyhzdHJlYW1hYmxlXFxcXC5jb20pJyxcclxuXHRcdFx0XHRtYXRjaGVyOiAvKD86c3RyZWFtYWJsZVxcLmNvbVxcLyhbQS1aYS16MC05LV9dKykpL2ksXHJcblx0XHRcdFx0aHR0cHM6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0aW1ndXI6IHtcclxuXHRcdFx0XHR0aXRsZTogJ2ltZ3VyIGl0IScsXHJcblx0XHRcdFx0aG9tZTogJ2h0dHBzOi8vaS5pbWd1ci5jb20vJyxcclxuXHRcdFx0XHRlbWJlZDogJ2h0dHBzOi8vaS5pbWd1ci5jb20vJWtleScsXHJcblx0XHRcdFx0dGh1bWI6ICd1cmwoaHR0cHM6Ly9pLmltZ3VyLmNvbS8la2V5aC5qcGcpJyxcclxuXHRcdFx0XHRzZWxlY3RvcjogJ2FbaHJlZio9XCIuZ2lmdlwiXScsXHJcblx0XHRcdFx0ZmF2aWNvbjogJ2h0dHBzOi8vaW1ndXIuY29tL2Zhdmljb24uaWNvJyxcclxuXHRcdFx0XHRyZWc6ICcoXFxcXC5naWZ2JCl8KGltZ3VyKScsXHJcblx0XHRcdFx0bWF0Y2hlcjogLyg/OmltZ3VyXFwuY29tXFwvKFxcdyspXFwuKD86Z2lmdnxtcDR8d2VibSkpL2ksXHJcblx0XHRcdFx0aHR0cHM6IHRydWUsXHJcblx0XHRcdFx0c2Nyb2xsOiB0cnVlLFxyXG5cdFx0XHRcdHZpZGVvVGFnOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdGh0bWw1OiB7XHJcblx0XHRcdFx0aG9tZTogdHJ1ZSxcclxuXHRcdFx0XHR0aXRsZTogJ2h0bWw1IGdvIScsXHJcblx0XHRcdFx0c2VsZWN0b3I6ICdhW2hyZWYqPVwiLndlYm1cIl0sIGFbaHJlZio9XCIubXA0XCJdJyxcclxuXHRcdFx0XHRmYXZpY29uOiAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBMEFBQUFOQ0FZQUFBQnk2K1I4QUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUFkbEpSRUZVZU5wY2tzOXJFMEVVeDcrYjNUUmt0eHZiaFVock5tNlNyVVd0eHhieEo5aUxsMEpGS1dnOFdMRDA1RVdoSXVSaWVvZ1h3WVBYNHRHYi9nUFNxL29QNktIK3VHMk1GYVJKSlhhVGJwN2ZXYnNsK3VERHpMeDUzM2x2M296bWV5VU0yVmxTSnhlSVNVTHlnVHdocjVPZzFKRGdPWGxQcnBMUk1BeFRJcExsZkphOElwdi9pNTZSZTRsVDA3U1lLSXFRU2gyZU8wL2VxWW51akkzNUhGOE8xOWpyOVhCbmVSbXQxamUwZDNhZzYzcXk1WklBdk5PYkUrV0tUSlhLa3RFTm9WUHNyQ250ZGxzV0Z4YmlOWE5KeVMzS2RNVVh4djh3Nkx6WTdYWmhtaVllcjlmQllPVHpSNUhMNVhDeldzV3hZaEZuVHMvZ3hjWUdnaUNBWlZtT3loUjVCVmNtOG5sWnZic2kyOSszWmRnR2c0R3MxK3ZpdWE0VUppWlZwa2lKZXFvMFZhSXF4YkdQU0tmVE9SUmR1WFE1OXBlTHg1UHlJdFdhajl5RFF0bXQyMVhZdG8xR294R3ZieXd0eGFOaEdIRTNhYitWNkw2YUtZY3pQbzdadVRrOFdudUlXcTJHNjR2WDRKVTh6Snc4QlhYdjVEMjFneCt4eWRybjdWRWIvZjArdGo1dHdhLzQrUHoxQzZZNE9vNkRack9KZERyZFl1eGtJbEtQK1piWnpvVjdlOGl5azhrRC85cmRSWHBrQkpsTXBzbURDLzk4STk3cFBGLy9BUVVCbC8yL2pSdnNtNWIxa3htZUpnSmxmd1FZQUtaUXhnemVJNi9FQUFBQUFFbEZUa1N1UW1DQycsXHJcblx0XHRcdFx0cmVnOiAnKFxcXFwud2VibSQpfChcXFxcLm1wNCQpJyxcclxuXHRcdFx0XHRzbGltOiB0cnVlLFxyXG5cdFx0XHRcdHNjcm9sbDogdHJ1ZSxcclxuXHRcdFx0XHR2aWRlb1RhZzogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnaHRtbDUtYXVkaW8nOiB7XHJcblx0XHRcdFx0aG9tZTogdHJ1ZSxcclxuXHRcdFx0XHR0aXRsZTogJ2hleSwgbGlzdGVuIScsXHJcblx0XHRcdFx0c2VsZWN0b3I6ICdhW2hyZWYqPVwiLm1wM1wiXScsXHJcblx0XHRcdFx0cmVnOiAnKFxcXFwubXAzJCknLFxyXG5cdFx0XHRcdHNsaW06IHRydWUsXHJcblx0XHRcdFx0c2Nyb2xsOiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRjbGFzcyBDb250cm9sIGV4dGVuZHMgQ29udGFpbmVyIHtcclxuXHRcdC8qKiBVIEkgQ0xBU1NcclxuXHRcdCAqIENsYXNzIGZvciB0aGUgcGxheWVyIGNvbnRyb2xzXHJcblx0XHQgKiBUaGlzIGlzIHRoZSBjb250cm9sIGJhciBvbmNlIHRoZSB1c2VyIGNsaWNrcyBvbiB0aGUgdGh1bWJuYWlsXHJcblx0XHQgKiBDb250YWlucyBpdHMgb3duIGluc3RhbmNlIG9mIGEgUGxheWVyXHJcblx0XHQgKiBBY3RzIGxpa2UgYSBkZWNvcmF0b3Igb24gdGhlIFlUTUEgYW5kIENvbnRhaW5lciBpbnRhbmNlcyBieSBhZGRpbmcgZXZlbnRzXHJcblx0XHQgKiBAcGFyYW0ge1l9IHl0bWEgQSBZVE1BIGluc3RhbmNlXHJcblx0XHQgKi9cclxuXHRcdGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcblx0XHRcdHN1cGVyKHByb3BzKTtcclxuXHJcblx0XHRcdHRoaXMub3BlbiA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkID0geyBzaXplOiBudWxsLCByYXRpbzogbnVsbCB9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGdldENvbnRyb2woKSB7XHJcblx0XHRcdGlmICghdGhpcy5wcm9qZWN0b3IpIHtcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZVByb2plY3RvcigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNyZWF0ZVByb2plY3RvcigpIHtcclxuXHRcdFx0c3VwZXIuY3JlYXRlUHJvamVjdG9yKCk7XHJcblx0XHRcdHRoaXMucHJvamVjdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgQ29udHJvbC5ldmVudHMudmlkZW9CYXIuYmluZCh0aGlzKSwgZmFsc2UpO1xyXG5cdFx0XHR0aGlzLnBsYXkgPSBuZXcgUGxheWVyKHRoaXMpO1xyXG5cclxuXHRcdFx0dGhpcy5tYXJrU2VsZWN0ZWQoYGxpW2RhdGEtdHlwZT1cInNpemVcIl1bZGF0YS12YWx1ZT1cIiR7dGhpcy5wbGF5LmF0dHJzLnNpemV9XCJdYCwgJ3NpemUnKTtcclxuXHRcdFx0dGhpcy5tYXJrU2VsZWN0ZWQoYGxpW2RhdGEtdHlwZT1cInJhdGlvXCJdW2RhdGEtdmFsdWU9XCIke3RoaXMucGxheS5hdHRycy5yYXRpb31cIl1gLCAncmF0aW8nKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXNldFZpZXdTaXplKCkge1xyXG5cdFx0XHR0aGlzLnBsYXkuZGltbWVuc2lvbnMoKTtcclxuXHRcdFx0dGhpcy5zZXRDb250cm9sQmFyU2l6ZSh0aGlzLnBsYXkuYXR0cnMuc2l6ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2hvd09uU2Nyb2xsKGxpbmspIHtcclxuXHRcdFx0aWYgKCF0aGlzLm9wZW4gJiYgdGhpcy5jYW5TaG93VW5kZXIobGluaykpIHtcclxuXHRcdFx0XHR0aGlzLnNob3dQbGF5ZXIoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHNob3dQbGF5ZXIoKSB7XHJcblx0XHRcdHRoaXMub3BlbiA9IHRydWU7XHJcblxyXG5cdFx0XHRzdXBlci5zaG93UGxheWVyKCk7XHJcblx0XHRcdHRoaXMuYXR0YWNoUGxheWVyUGFuZWwoKTtcclxuXHRcdFx0dGhpcy5wbGF5LnN3aXRjaE9uKCk7XHJcblxyXG5cdFx0XHRpZiAoWS51c2VyLnByZWZlcmVuY2VzLmZvY3VzKSB7XHJcblx0XHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaGFzaCA9IGAjJHt0aGlzLmJvZHkuaWR9YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGhpZGVQbGF5ZXIoKSB7XHJcblx0XHRcdHRoaXMub3BlbiA9IGZhbHNlO1xyXG5cclxuXHRcdFx0dGhpcy5wbGF5LnN3aXRjaE9mZigpO1xyXG5cdFx0XHRzdXBlci5oaWRlUGxheWVyKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0YXR0YWNoUGxheWVyUGFuZWwoKSB7XHJcblx0XHRcdGlmICghdGhpcy5wbGF5LnBhbmVsLnBhcmVudE5vZGUpIHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnYXR0YWNoaW5nIGRpc3BsYXkgcGFuZWwnKTtcclxuXHRcdFx0XHR0aGlzLnByb2plY3Rvci5hcHBlbmRDaGlsZCh0aGlzLnBsYXkucGFuZWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aGlkZUFsbFBsYXllcnMoKSB7XHJcblx0XHRcdGNvbnN0IGdyb3VwID0gWS5jb2xsZWN0KHRoaXMuc3RhdGUuaWQpO1xyXG5cdFx0XHRjb25zb2xlLmluZm8oJ3l0bWEvL2hpZGUrYWxsKGlkKScsIHRoaXMuc3RhdGUuaWQsIGdyb3VwLmxlbmd0aCk7XHJcblx0XHRcdGdyb3VwLmZvckVhY2goZyA9PiB7XHJcblx0XHRcdFx0Zy5kaXNhYmxlT3Blbk9uU2Nyb2xsKCk7XHJcblx0XHRcdFx0Zy5nZXRDb250cm9sKCkuaGlkZVBsYXllcigpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRzZXRDb250cm9sQmFyU2l6ZShzaXplKSB7XHJcblx0XHRcdHRoaXMubWFya1NlbGVjdGVkKGBsaVtkYXRhLXR5cGU9XCJzaXplXCJdW2RhdGEtdmFsdWU9XCIke3NpemV9XCJdYCwgJ3NpemUnKTtcclxuXHRcdH1cclxuXHJcblx0XHRtYXJrU2VsZWN0ZWQoZWwsIHR5cGUpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRlbCA9IHRoaXMucHJvamVjdG9yLnF1ZXJ5U2VsZWN0b3IoZWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsLmlkID0gdHlwZSArIHRoaXMuc3RhdGUudWlkO1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHRoaXMuc2VsZWN0ZWRbdHlwZV0ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7IH1cclxuXHRcdFx0dGhpcy5zZWxlY3RlZFt0eXBlXSA9IGVsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Q29udHJvbC5yYXRpb3MgPSB7XHJcblx0XHRTRDogMSxcclxuXHRcdEhEOiAyLFxyXG5cdFx0UE9SVFJBSVQ6IDNcclxuXHR9O1xyXG5cclxuXHRDb250cm9sLnNpemVzID0ge1xyXG5cdFx0SElEREVOOiAwLFxyXG5cdFx0UzogMjQwLFxyXG5cdFx0TTogMzYwLFxyXG5cdFx0TDogNDgwLFxyXG5cdFx0WDogNzIwXHJcblx0fTtcclxuXHJcblx0LyoqIFRyaWdnZXIgaXMgdGhlIFZBUiBlbGVtZW50XHJcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdCBWQVIgZWxlbWVudFxyXG5cdCAqL1xyXG5cdENvbnRyb2wuY3JlYXRlRnJvbVRyaWdnZXIgPSB0ID0+IHtcclxuXHRcdC8vIGNvbnNvbGUuaW5mbygneXRtYS8vdHJpZ2dlcicpO1xyXG5cdFx0aWYgKHQgJiYgdC5kYXRhc2V0Lnl0bXVpZCAmJiAhWS5zZXRbdC5kYXRhc2V0Lnl0bXVpZF0pIHtcclxuXHRcdFx0Y29uc29sZS5pbmZvKCd5dG1hLy90cmlnZ2VyK25ldycpO1xyXG5cdFx0XHRZLmFkZFRvU2V0KG5ldyBDb250cm9sKCkucmVhY3RpdmF0ZSh0KSk7XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmluZm8oJ3l0bWEvL3RyaWdnZXIrY29udHJvbCcpO1xyXG5cdFx0cmV0dXJuIFkuc2V0W3QuZGF0YXNldC55dG11aWRdLmdldENvbnRyb2woKTtcclxuXHR9O1xyXG5cclxuXHRDb250cm9sLmV2ZW50cyA9IHtcclxuXHRcdCRmaXJlOiB7XHJcblx0XHRcdHNldHRpbmdzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0WS51c2VyLmV2ZW50cy5mb3JtVG9nZ2xlKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNsb3NlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuc2l0ZS5zY3JvbGwpIHtcclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdldmVudHMuY2xvc2UtMScpO1xyXG5cdFx0XHRcdFx0dGhpcy5oaWRlQWxsUGxheWVycygpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnZXZlbnRzLmNsb3NlLTInKTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZU9wZW5PblNjcm9sbCgpO1xyXG5cdFx0XHRcdFx0dGhpcy5oaWRlUGxheWVyKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRyYXRpbzogZnVuY3Rpb24gKGxpKSB7XHJcblx0XHRcdFx0Y29uc3QgcmF0aW8gPSBwYXJzZUludChsaS5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcblx0XHRcdFx0dGhpcy5wbGF5LmRpbW1lbnNpb25zKHsgcmF0aW8gfSk7XHJcblx0XHRcdFx0dGhpcy5tYXJrU2VsZWN0ZWQobGksICdyYXRpbycpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzaXplOiBmdW5jdGlvbiAobGkpIHtcclxuXHRcdFx0XHRjb25zdCBzaXplID0gcGFyc2VJbnQobGkuZGF0YXNldC52YWx1ZSwgMTApO1xyXG5cdFx0XHRcdHRoaXMucGxheS5kaW1tZW5zaW9ucyh7IHNpemUgfSk7XHJcblx0XHRcdFx0dGhpcy5tYXJrU2VsZWN0ZWQobGksICdzaXplJyk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR2aWRlb0JhcjogZnVuY3Rpb24gKHsgdGFyZ2V0IH0pIHtcclxuXHRcdFx0aWYgKHRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdsaScgJiYgdGFyZ2V0LmRhdGFzZXQgJiYgdGFyZ2V0LmRhdGFzZXQudHlwZSkge1xyXG5cdFx0XHRcdGNvbnN0IHQgPSB0YXJnZXQuZGF0YXNldC50eXBlO1xyXG5cdFx0XHRcdGlmIChDb250cm9sLmV2ZW50cy4kZmlyZVt0XSkge1xyXG5cdFx0XHRcdFx0Q29udHJvbC5ldmVudHMuJGZpcmVbdF0uY2FsbCh0aGlzLCB0YXJnZXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKiBQIEwgQSBZIEUgUiBDTEFTU1xyXG5cdCAqICBAcGFyYW0ge0NvbnRyb2x9IHBhcmVudCBJbnN0YW5jZVxyXG5cdCAqL1xyXG5cdGNsYXNzIFBsYXllciB7XHJcblxyXG5cdFx0Y29uc3RydWN0b3IocGFyZW50KSB7XHJcblx0XHRcdHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG5cclxuXHRcdFx0dGhpcy5tb2RlID0gJ29mZic7XHJcblxyXG5cdFx0XHR0aGlzLmF0dHJzID0ge1xyXG5cdFx0XHRcdHNvdXJjZXM6IG51bGwsXHJcblx0XHRcdFx0cXVhbGl0eTogdGhpcy5xdWFsaXR5LFxyXG5cdFx0XHRcdHNpemU6IG51bGwsXHJcblx0XHRcdFx0cmF0aW86IG51bGwsXHJcblx0XHRcdFx0c3RhcnQ6IHRoaXMudGltZSgpLFxyXG5cdFx0XHRcdHR5cGU6IG51bGxcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuYXR0cnMuc291cmNlcyA9IHRoaXMuc291cmNlcztcclxuXHJcblx0XHRcdC8vIHRvZG8gaW1wcm92ZSB0eXBlL21lZGlhXHJcblx0XHRcdHRoaXMuYXR0cnMudHlwZSA9IHRoaXMuZmluZFR5cGUoKTtcclxuXHRcdFx0dGhpcy5tZWRpYSA9IFBsYXllci5tYWtlTWVkaWFbdGhpcy5hdHRycy50eXBlXSh0aGlzKTtcclxuXHJcblx0XHRcdHRoaXMuY2hhbm5lbCA9IF8uZSgnZGl2JywgeyBjbGFzc05hbWU6ICd5dG1fcGFuZWxfY2hhbm5lbCB5dG1fYmxvY2snIH0sIHRoaXMubWVkaWEsIHRydWUpO1xyXG5cdFx0XHR0aGlzLnN3aXRjaGVyID0gXy5lKCdkaXYnLCB7IGNsYXNzTmFtZTogYHl0bV9wYW5lbF9zd2l0Y2hlciB5dG1fcGFuZWxfc2l6ZSB5dG1fYmxvY2sgeXRtXyR7dGhpcy5hdHRycy50eXBlfWAsIF95dG11aWQ6IHRoaXMucGFyZW50LnN0YXRlLnVpZCwgX3N0YW5kYnk6IHRydWUgfSk7XHJcblx0XHRcdHRoaXMucGFuZWwgPSBfLmUoJ2RpdicsIHsgY2xhc3NOYW1lOiAneXRtX3BhbmVsIHl0bV9ibG9jaycgfSwgdGhpcy5zd2l0Y2hlciwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRpZiAocGFyZW50LnN0YXRlLnNpdGUgPT09ICdzb3VuZGNsb3VkJyAmJiBZLnJlZy5leHRyYS5zb3VuZGNsb3VkLnBsYXlsaXN0LnRlc3QocGFyZW50LmFuY2hvci5ocmVmKSkge1xyXG5cdFx0XHRcdHRoaXMubWVkaWEuY2xhc3NMaXN0LmFkZCgneXRtX3NvdW5kY2xvdWQtcGxheWxpc3QnKTtcclxuXHRcdFx0XHR0aGlzLnN3aXRjaGVyLmNsYXNzTGlzdC5hZGQoJ3l0bV9zb3VuZGNsb3VkLXBsYXlsaXN0Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZGltbWVuc2lvbnMoWS51c2VyLnByZWZlcmVuY2VzKTtcclxuXHRcdH1cclxuXHJcblx0XHRnZXQgc291cmNlcygpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRyZXR1cm4gKFBsYXllci5zb3VyY2VzW3RoaXMucGFyZW50LnN0YXRlLnNpdGVdIHx8IFBsYXllci5zb3VyY2VzLmlmcmFtZSkodGhpcy5wYXJlbnQuc3RhdGUsIHRoaXMuYXR0cnMpO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGdldCBxdWFsaXR5KCkge1xyXG5cdFx0XHRyZXR1cm4gUGxheWVyLnF1YWxpdGllc1tZLnVzZXIucHJlZmVyZW5jZXMucXVhbGl0eV0gfHwgUGxheWVyLnF1YWxpdGllc1szNjBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGdldCBjbGFzc05hbWUoKSB7XHJcblx0XHRcdHJldHVybiBgeXRtX3BhbmVsIHl0bV9ibG9jayB5dG1fcGFuZWwtJHtQbGF5ZXIuZGltbXMucmF0aW9zW3RoaXMuYXR0cnMucmF0aW9dfSB5dG1fcGFuZWwtJHtQbGF5ZXIuZGltbXMuc2l6ZXNbdGhpcy5hdHRycy5zaXplXX1gO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRpbW1lbnNpb25zKHsgcmF0aW8sIHNpemUgfSkge1xyXG5cdFx0XHR0aGlzLmF0dHJzLnJhdGlvID0gaXNOdW1iZXIocmF0aW8pID8gcmF0aW8gOiB0aGlzLmF0dHJzLnJhdGlvO1xyXG5cdFx0XHR0aGlzLmF0dHJzLnNpemUgPSBpc051bWJlcihzaXplKSA/IHNpemUgOiB0aGlzLmF0dHJzLnNpemU7XHJcblx0XHRcdHRoaXMucGFuZWwuY2xhc3NOYW1lID0gdGhpcy5jbGFzc05hbWU7XHJcblx0XHR9XHJcblxyXG5cdFx0dGltZSgpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvLyBkZWJ1Z2dlcjtcclxuXHRcdFx0XHRjb25zdCBtID0gdGhpcy5wYXJlbnQuc3RhdGUudXJpLm1hdGNoKFkucmVnLnRpbWUpLnNsaWNlKDEsIDQpO1xyXG5cdFx0XHRcdHJldHVybiAoKCttWzBdIHx8IDApICogNjAgKiA2MCkgKyAoKCttWzFdIHx8IDApICogNjApICsgKCttWzJdIHx8IDApO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7IHJldHVybiAwOyB9XHJcblx0XHR9XHJcblxyXG5cdFx0ZmluZFR5cGUoKSB7XHJcblx0XHRcdGlmICh0aGlzLnBhcmVudC5zdGF0ZS5zaXRlID09PSAnaHRtbDUtYXVkaW8nKSB7IHJldHVybiAnYXVkaW8nOyB9XHJcblx0XHRcdGlmICh0aGlzLnBhcmVudC5zaXRlLnZpZGVvVGFnKSB7IHJldHVybiAndmlkZW8nOyB9XHJcblx0XHRcdHJldHVybiAnaWZyYW1lJztcclxuXHRcdH1cclxuXHJcblx0XHRzd2l0Y2hPZmYoKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdyZW1vdmVkIG1lZGlhJyk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5tZWRpYS5wYXVzZSkge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdwYXVzaW5nJyk7XHJcblx0XHRcdFx0dGhpcy5tZWRpYS5wYXVzZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHRoaXMuc3dpdGNoZXIucmVtb3ZlQ2hpbGQodGhpcy5jaGFubmVsKTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUuZXJyb3IoZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5tb2RlID0gJ29mZic7XHJcblx0XHR9XHJcblxyXG5cdFx0c3dpdGNoT24oKSB7XHJcblx0XHRcdGlmICh0aGlzLmF0dHJzLnNpemUgPT09IDApIHtcclxuXHRcdFx0XHR0aGlzLmF0dHJzLnNpemUgPSBZLnVzZXIucHJlZmVyZW5jZXMuc2l6ZTtcclxuXHRcdFx0XHR0aGlzLnBhcmVudC5yZXNldFZpZXdTaXplKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ3N3aXRjaCB0byBtZWRpYScpO1xyXG5cdFx0XHR0aGlzLnN3aXRjaGVyLmFwcGVuZENoaWxkKHRoaXMuY2hhbm5lbCk7XHJcblx0XHRcdHRoaXMuc3dpdGNoZXIuZGF0YXNldC5zdGFuZGJ5ID0gZmFsc2U7XHJcblx0XHRcdHRoaXMubW9kZSA9ICdvbic7XHJcblx0XHR9XHJcblxyXG5cdFx0c3dpdGNoU3RhbmRieSgpIHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ3N3aXRjaCB0byBzdGFuZGJ5Jyk7XHJcblx0XHRcdHRoaXMuc3dpdGNoT2ZmKCk7XHJcblx0XHRcdHRoaXMuc3dpdGNoZXIuZGF0YXNldC5zdGFuZGJ5ID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5tb2RlID0gJ3N0YW5kYnknO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlzU3RhbmRieSgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubW9kZSA9PT0gJ3N0YW5kYnknO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0UGxheWVyLnNvdXJjZXMgPSB7XHJcblx0XHRpZnJhbWU6IGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdGNvbnN0IGtleSA9IFkuREIuc2l0ZXNbZGF0YS5zaXRlXS5rZXk7XHJcblxyXG5cdFx0XHRyZXR1cm4gW1xyXG5cdFx0XHRcdHsgdHlwZTogJ3RleHQvaHRtbCcsIHNyYzogWS5EQi5zaXRlc1tkYXRhLnNpdGVdLmVtYmVkLnJlcGxhY2UoJyVrZXknLCBkYXRhW2tleV0pIH1cclxuXHRcdFx0XTtcclxuXHRcdH0sXHJcblx0XHQnaHRtbDUtYXVkaW8nOiBmdW5jdGlvbiAoeyB1cmkgfSkge1xyXG5cdFx0XHRyZXR1cm4gW1xyXG5cdFx0XHRcdHsgdHlwZTogJ2F1ZGlvL21wMycsIHNyYzogdXJpIH1cclxuXHRcdFx0XTtcclxuXHRcdH0sXHJcblx0XHRodG1sNTogZnVuY3Rpb24gKHsgdXJpIH0pIHtcclxuXHRcdFx0Ly8gYXR0YWNoaW5nIHRoZSB0eXBlIGFzIGVpdGhlciBtcDQgb3Igd2VibVxyXG5cclxuXHRcdFx0aWYgKC8oPzp3ZWJtKS8udGVzdCh1cmkpKSB7XHJcblx0XHRcdFx0cmV0dXJuIFtcclxuXHRcdFx0XHRcdHsgdHlwZTogJ3ZpZGVvL3dlYm0nLCBzcmM6IHVyaSB9XHJcblx0XHRcdFx0XTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIFtcclxuXHRcdFx0XHR7IHR5cGU6ICd2aWRlby9tcDQnLCBzcmM6IHVyaSB9LFxyXG5cdFx0XHRcdHsgdHlwZTogJ3ZpZGVvL3dlYm0nLCBzcmM6IHVyaSB9LFxyXG5cdFx0XHRcdHsgdHlwZTogJ3ZpZGVvL29nZzsgY29kZWNzPVwidGhlb3JhLCB2b3JiaXNcIicsIHNyYzogdXJpIH1cclxuXHRcdFx0XTtcclxuXHRcdH0sXHJcblx0XHRpbWd1cjogZnVuY3Rpb24gKHsgaWQgfSkge1xyXG5cdFx0XHRjb25zdCBzcmMgPSBZLkRCLnNpdGVzLmltZ3VyLmVtYmVkLnJlcGxhY2UoJyVrZXknLCBpZCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gW1xyXG5cdFx0XHRcdHsgdHlwZTogJ3ZpZGVvL3dlYm0nLCBzcmM6IGAke3NyY30ud2VibWAgfSxcclxuXHRcdFx0XHR7IHR5cGU6ICd2aWRlby9tcDQnLCBzcmM6IGAke3NyY30ubXA0YCB9XHJcblx0XHRcdF07XHJcblx0XHR9LFxyXG5cdFx0eW91dHViZTogZnVuY3Rpb24gKHsgaWQgfSwgeyBxdWFsaXR5LCBzdGFydCB9KSB7XHJcblx0XHRcdGNvbnN0IHBhcmFtcyA9IGA/aHRtbDU9MSZ2ZXJzaW9uPTMmbW9kZXN0YnJhbmRpbmc9MSZyZWw9MCZzaG93aW5mbz0xJnZxPSR7cXVhbGl0eX0maXZfbG9hZF9wb2xpY3k9JHtZLnVzZXIucHJlZmVyZW5jZXMueXRfYW5ub3RhdGlvbn0mc3RhcnQ9JHtzdGFydH0mcmVsPTBgO1xyXG5cclxuXHRcdFx0cmV0dXJuIFtcclxuXHRcdFx0XHR7IHR5cGU6ICd0ZXh0L2h0bWwnLCBzcmM6IFkuREIuc2l0ZXMueW91dHViZS5lbWJlZC5yZXBsYWNlKCcla2V5JywgaWQpICsgcGFyYW1zIH1cclxuXHRcdFx0XTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRQbGF5ZXIuZGltbXMgPSB7XHJcblx0XHRyYXRpb3M6IHtcclxuXHRcdFx0MTogJ3NkJyxcclxuXHRcdFx0MjogJ2hkJyxcclxuXHRcdFx0MzogJ3ByJ1xyXG5cdFx0fSxcclxuXHRcdHNpemVzOiB7XHJcblx0XHRcdDA6ICdoJyxcclxuXHRcdFx0MjQwOiAncycsXHJcblx0XHRcdDM2MDogJ20nLFxyXG5cdFx0XHQ0ODA6ICdsJyxcclxuXHRcdFx0NzIwOiAneGwnXHJcblx0XHR9LFxyXG5cdFx0YXNwZWN0czoge1xyXG5cdFx0XHQxOiA0IC8gMyxcclxuXHRcdFx0MjogMTYgLyA5LFxyXG5cdFx0XHQzOiAxNiAvIDlcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRQbGF5ZXIucXVhbGl0aWVzID0ge1xyXG5cdFx0MjQwOiAnc21hbGwnLFxyXG5cdFx0MzYwOiAnbWVkaXVtJyxcclxuXHRcdDQ4MDogJ2xhcmdlJyxcclxuXHRcdDcyMDogJ2hkNzIwJyxcclxuXHRcdDEwODA6ICdoZDEwODAnLFxyXG5cdFx0MTA4MTogJ2hpZ2hyZXMnXHJcblx0fTtcclxuXHJcblx0UGxheWVyLmNzcyA9IHtcclxuXHRcdGl0ZW06IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcblx0XHRcdGlmIChpc051bWJlcih2YWx1ZSkpIHtcclxuXHRcdFx0XHR2YWx1ZSArPSAncHgnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gYFxcdCR7a2V5fTogJHt2YWx1ZX07XFxuYDtcclxuXHRcdH0sXHJcblx0XHRpdGVyOiBmdW5jdGlvbiAoY3NzLCBjc3NFbnRyaWVzKSB7XHJcblx0XHRcdF8ubyhjc3NFbnRyaWVzLCAoa2V5LCB2YWx1ZSkgPT4ge1xyXG5cdFx0XHRcdGNzcy5wdXNoKFBsYXllci5jc3MuaXRlbShrZXksIHZhbHVlKSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRjc3MucHVzaCgnfScpO1xyXG5cdFx0fSxcclxuXHRcdGdlbmVyYXRvcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRjb25zdCBjc3MgPSBbXTtcclxuXHJcblx0XHRcdF8ubyh0aGlzLnNpemVzLCAoc2l6ZSwgc2l6ZXMpID0+IHtcclxuXHRcdFx0XHRfLm8oc2l6ZXMsIChkaW1tLCBrZXlzKSA9PiB7XHJcblx0XHRcdFx0XHRjc3MucHVzaChgXFxuLnl0bV9wYW5lbC0ke3NpemV9Lnl0bV9wYW5lbC0ke2RpbW19IC55dG1fcGFuZWxfc2l6ZSB7XFxuYCk7XHJcblx0XHRcdFx0XHRQbGF5ZXIuY3NzLml0ZXIoY3NzLCBrZXlzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBhZGQgc2l0ZSBvdmVycmlkZXNcclxuXHRcdFx0Xy5vKHRoaXMuc2l0ZXMsIChzaXRlLCBkYXRhKSA9PiB7XHJcblx0XHRcdFx0Xy5vKGRhdGEsIChzZXR0aW5nLCBrZXlzKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoc2V0dGluZyA9PT0gJ2FsbCcpIHtcclxuXHRcdFx0XHRcdFx0Y3NzLnB1c2goYFxcbi55dG1fc2l0ZV8ke3NpdGV9IC55dG1fcGFuZWxfc2l6ZSB7XFxuYCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjc3MucHVzaChgXFxuLnl0bV9zaXRlXyR7c2l0ZX0gLnl0bV9wYW5lbC0ke3NldHRpbmd9IC55dG1fcGFuZWxfc2l6ZSB7XFxuYCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRQbGF5ZXIuY3NzLml0ZXIoY3NzLCBrZXlzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gY3NzLmpvaW4oJycpO1xyXG5cdFx0fSxcclxuXHRcdHNpemVzOiAoKCkgPT4ge1xyXG5cdFx0XHRjb25zdCBtZXJnZSA9IHt9O1xyXG5cclxuXHRcdFx0Xy5vKFBsYXllci5kaW1tcy5zaXplcywgKG51bSwgc2l6ZSkgPT4ge1xyXG5cdFx0XHRcdGlmIChudW0gPj0gMCkge1xyXG5cdFx0XHRcdFx0bWVyZ2Vbc2l6ZV0gPSB7fTtcclxuXHJcblx0XHRcdFx0XHRfLm8oUGxheWVyLmRpbW1zLnJhdGlvcywgKGssIHJhdGlvKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmIChyYXRpbyA9PT0gJ3ByJykge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IHcgPSBNYXRoLmZsb29yKG51bSAqIDAuOTUpOyAvLyBzbWFsbGVyIHRoYW4gdGhlIG5vcm1hbCBzaXplc1xyXG5cdFx0XHRcdFx0XHRcdG1lcmdlW3NpemVdW3JhdGlvXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiB3LFxyXG5cdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiBNYXRoLmZsb29yKHcgKiBQbGF5ZXIuZGltbXMuYXNwZWN0c1trXSlcclxuXHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdG1lcmdlW3NpemVdW3JhdGlvXSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiBNYXRoLmZsb29yKG51bSAqIFBsYXllci5kaW1tcy5hc3BlY3RzW2tdKSxcclxuXHRcdFx0XHRcdFx0XHRcdGhlaWdodDogbnVtXHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBtZXJnZTtcclxuXHRcdH0pKCksXHJcblx0XHRzaXRlczogeyAvLyBjdXN0b20gc2l6ZXMgcGVyIHNpdGVcclxuXHRcdFx0c291bmRjbG91ZDoge1xyXG5cdFx0XHRcdGFsbDoge1xyXG5cdFx0XHRcdFx0aGVpZ2h0OiAnMTE4cHggIWltcG9ydGFudCdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHZpbmU6IHtcclxuXHRcdFx0XHRzOiB7XHJcblx0XHRcdFx0XHR3aWR0aDogMjQwLFxyXG5cdFx0XHRcdFx0aGVpZ2h0OiAyNDBcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdG06IHtcclxuXHRcdFx0XHRcdHdpZHRoOiAzNjAsXHJcblx0XHRcdFx0XHRoZWlnaHQ6IDM2MFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bDoge1xyXG5cdFx0XHRcdFx0d2lkdGg6IDQ4MCxcclxuXHRcdFx0XHRcdGhlaWdodDogNDgwXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR4bDoge1xyXG5cdFx0XHRcdFx0d2lkdGg6IDcyMCxcclxuXHRcdFx0XHRcdGhlaWdodDogNzIwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0UGxheWVyLm1ha2VNZWRpYSA9IHtcclxuXHRcdCRjc3M6IGZ1bmN0aW9uICh0eXBlKSB7XHJcblx0XHRcdHJldHVybiBgeXRtX3BhbmVsX21lZGlhIHl0bV9wYW5lbF9zaXplIHl0bV9ibG9jayB5dG1fJHt0eXBlfWA7XHJcblx0XHR9LFxyXG5cdFx0dmlkZW86IGZ1bmN0aW9uICh7IGF0dHJzIH0pIHtcclxuXHRcdFx0Y29uc3QgdmlkZW8gPSBfLmUoJ3ZpZGVvJywge1xyXG5cdFx0XHRcdGNvbnRyb2xzOiB0cnVlLFxyXG5cdFx0XHRcdGF1dG9wbGF5OiBmYWxzZSxcclxuXHRcdFx0XHRsb29wOiB0cnVlLFxyXG5cdFx0XHRcdGNsYXNzTmFtZTogdGhpcy4kY3NzKCd2aWRlbycpLFxyXG5cdFx0XHRcdCRhbGxvd3NjcmlwdGFjY2VzczogdHJ1ZSxcclxuXHRcdFx0XHRwcmVsb2FkOiAnbWV0YWRhdGEnXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Y29uc3QgbGlua3MgPSBbXTtcclxuXHJcblx0XHRcdGF0dHJzLnNvdXJjZXMuZm9yRWFjaCgoeyBzcmMsIHR5cGUgfSkgPT4ge1xyXG5cdFx0XHRcdF8uZSgnc291cmNlJywgeyBzcmMsICR0eXBlOiB0eXBlIH0sIHZpZGVvKTtcclxuXHJcblx0XHRcdFx0bGlua3MucHVzaChgPGEgaHJlZj1cIiR7c3JjfVwiPiR7c3JjfTwvYT5gKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRfLmUoJ3AnLCB7IGlubmVySFRNTDogYENvdWxkIG5vdCBsb2FkIHNvdXJjZShzKTogJHtsaW5rcy5qb2luKCc8YnIgLz4nKX1gIH0sIHZpZGVvKTtcclxuXHJcblx0XHRcdHJldHVybiB2aWRlbztcclxuXHRcdH0sXHJcblx0XHRpZnJhbWU6IGZ1bmN0aW9uICh7IGF0dHJzIH0pIHtcclxuXHRcdFx0cmV0dXJuIF8uZSgnaWZyYW1lJywge1xyXG5cdFx0XHRcdCRhbGxvd2Z1bGxzY3JlZW46IHRydWUsXHJcblx0XHRcdFx0JHJlZmVycmVycG9saWN5OiAnbm8tcmVmZXJyZXInLFxyXG5cdFx0XHRcdC8vICRzYW5kYm94OiAnYWxsb3ctc2FtZS1vcmlnaW4gYWxsb3ctc2NyaXB0cyBhbGxvdy1wb3B1cHMnLFxyXG5cdFx0XHRcdCR0eXBlOiBhdHRycy5zb3VyY2VzWzBdLnR5cGUsXHJcblx0XHRcdFx0c3JjOiBhdHRycy5zb3VyY2VzWzBdLnNyYyxcclxuXHRcdFx0XHRjbGFzc05hbWU6IHRoaXMuJGNzcygnaWZyYW1lJylcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0YXVkaW86IGZ1bmN0aW9uICh7IGF0dHJzIH0pIHtcclxuXHRcdFx0cmV0dXJuIF8uZSgnYXVkaW8nLCB7XHJcblx0XHRcdFx0c3JjOiBhdHRycy5zb3VyY2VzWzBdLnNyYyxcclxuXHRcdFx0XHQkdHlwZTogYXR0cnMuc291cmNlc1swXS50eXBlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKiBTIEMgUiBPIEwgTCBDTEFTU1xyXG5cdCAqIFdpbmRvdy1TY3JvbGwgRXZlbnQgSGVscGVyXHJcblx0ICovXHJcblx0Y2xhc3MgU2Nyb2xsIHtcclxuXHRcdGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBjYiwgZGVsYXkgPSA1MDApIHtcclxuXHRcdFx0dGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cdFx0XHR0aGlzLmNiID0gY2I7XHJcblx0XHRcdHRoaXMubW9uaXRvciA9IHRoaXMubW9uaXRvci5iaW5kKHRoaXMpO1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ1lUTUEuU2Nyb2xsIE1vbml0b3I6ICcsIHNlbGVjdG9yKTtcclxuXHRcdFx0dGhpcy5ib3VuZCA9IGRlYm91bmNlKHRoaXMubW9uaXRvciwgZGVsYXkpO1xyXG5cclxuXHRcdFx0dGhpcy5ib3VuZCgpO1xyXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5ib3VuZCwgZmFsc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN0b3AoKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdjbGVhciBzY3JvbGw6ICcsIHRoaXMuc2VsZWN0b3IpO1xyXG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5ib3VuZCk7XHJcblx0XHR9XHJcblxyXG5cdFx0bW9uaXRvcigpIHtcclxuXHRcdFx0Xy5zKHRoaXMuc2VsZWN0b3IsIHRoaXMuY2IpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0U2Nyb2xsLnZpc2libGUgPSBlbCA9PiB7XHJcblx0XHRjb25zdCBib3VuZCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0cmV0dXJuIChib3VuZC50b3AgPj0gMCAmJiBib3VuZC50b3AgPD0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCk7XHJcblx0fTtcclxuXHJcblx0U2Nyb2xsLnZpc2libGVBbGwgPSAoZWwsIG9mZnNldCkgPT4ge1xyXG5cdFx0Y29uc3QgYm91bmQgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdGNvbnN0IGhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcblx0XHRvZmZzZXQgPSBpc051bWJlcihvZmZzZXQpID8gK29mZnNldCA6IDA7XHJcblx0XHRyZXR1cm4gKChib3VuZC5ib3R0b20gKyBvZmZzZXQgPj0gMClcclxuXHRcdFx0JiYgKGJvdW5kLnRvcCA8PSBoZWlnaHQgKyBvZmZzZXQgfHwgYm91bmQuYm90dG9tIDw9IGhlaWdodCAtIG9mZnNldCkpO1xyXG5cdH07XHJcblxyXG5cdC8qKiBSZXR1cm5zIDEsIDAsIC0xIHdoZW4gZWwxIGlzIGFib3ZlLCBleGFjdGx5IHRoZSBzYW1lLCBvciBiZWxvdyBlbDIgKi9cclxuXHRTY3JvbGwuY29tcGFyZSA9IChlbDEsIGVsMikgPT4ge1xyXG5cdFx0Y29uc3QgYSA9IGVsMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55O1xyXG5cdFx0Y29uc3QgYiA9IGVsMi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55O1xyXG5cclxuXHRcdGlmIChhIDwgYikgeyByZXR1cm4gMTsgfVxyXG5cdFx0aWYgKGEgPT09IGIpIHsgcmV0dXJuIDA7IH1cclxuXHRcdHJldHVybiAtMTtcclxuXHR9O1xyXG5cclxuXHJcblx0WS5tYWluKCk7XHJcbn0pKCk7XHJcbiIsImlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcylcclxuXHRFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yO1xyXG5cclxuaWYgKCFFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0KSB7XHJcblx0RWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCA9IGZ1bmN0aW9uIChzKSB7XHJcblx0XHR2YXIgZWwgPSB0aGlzO1xyXG5cdFx0aWYgKCFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY29udGFpbnMoZWwpKSByZXR1cm4gbnVsbDtcclxuXHRcdGRvIHtcclxuXHRcdFx0aWYgKGVsLm1hdGNoZXMocykpIHJldHVybiBlbDtcclxuXHRcdFx0ZWwgPSBlbC5wYXJlbnRFbGVtZW50IHx8IGVsLnBhcmVudE5vZGU7XHJcblx0XHR9IHdoaWxlIChlbCAhPT0gbnVsbCAmJiBlbC5ub2RlVHlwZSA9PT0gMSk7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaXNOdW1iZXIgPSBuID0+ICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVTZWFyY2ggPSAodXJpLCBrZWVwSGFzaCkgPT4ge1xyXG5cdC8vIHJlbW92ZXMgc2VhcmNoIHF1ZXJ5IGZyb20gYSB1cmlcclxuXHRjb25zdCBzID0gdXJpLmluZGV4T2YoJz8nKTtcclxuXHRjb25zdCBoID0gdXJpLmluZGV4T2YoJyMnKTtcclxuXHRsZXQgaGFzaCA9ICcnO1xyXG5cdGlmIChzID4gLTEpIHtcclxuXHRcdGlmIChrZWVwSGFzaCAmJiBoID4gLTEpIHtcclxuXHRcdFx0aGFzaCA9IHVyaS5zdWJzdHIoaCk7XHJcblx0XHR9XHJcblx0XHR1cmkgPSB1cmkuc3Vic3RyKDAsIHMpICsgaGFzaDtcclxuXHR9XHJcblx0cmV0dXJuIHVyaTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEhUTUwgZWxlbWVudFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRzIFNwYWNlLSBvciBjb21hLXNlcGFyYXRlZCBzdHJpbmcgb2Ygb25lIG9yIG1vcmUgdHlwZXMsIGVnIFwiY2xpY2sgZGJsY2xpY2tcIlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgQ1NTIHNlbGVjdG9yIGZvciB0aGUgZWxlbWVudHMgdG8gdHJpZ2dlciB0aGUgZXZlbnQgb25cclxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgQSBjYWxsYmFja1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhbmNlbCBDYW5jZWxcclxuICovXHJcbmV4cG9ydCBjb25zdCBvbiA9IChlbGVtZW50LCBldmVudHMsIHNlbGVjdG9yLCBsaXN0ZW5lciwgY2FuY2VsID0gdHJ1ZSkgPT4ge1xyXG5cdGV2ZW50cyA9IGV2ZW50cy5zcGxpdCgvKD86XFxzK3wsKS8pLmZpbHRlcihmID0+IGYpO1xyXG5cclxuXHRpZiAoZXZlbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuXHRjb25zdCBmbiA9IGV2ZW50ID0+IHtcclxuXHRcdGNvbnN0IGZvdW5kID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xyXG5cdFx0aWYgKGZvdW5kKSBsaXN0ZW5lci5jYWxsKGZvdW5kLCBldmVudCk7XHJcblx0fTtcclxuXHJcblx0ZXZlbnRzLmZvckVhY2godHlwZSA9PiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZm4sIGNhbmNlbCkpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlYm91bmNlID0gKGZuLCBkZWxheSA9IDI1MCkgPT4ge1xyXG5cdGxldCB0aW1lb3V0O1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcclxuXHRcdGNvbnN0IHRpbWVkID0gKCkgPT4ge1xyXG5cdFx0XHR0aW1lb3V0ID0gbnVsbDtcclxuXHRcdFx0Zm4uYXBwbHkodGhpcywgYXJncyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XHJcblx0XHR0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQodGltZWQsIGRlbGF5KTtcclxuXHR9O1xyXG59OyIsIi8vIEggRSBMIFAgRSBSIEhhbmRsZVxyXG5jb25zdCBfID0ge1xyXG5cdHM6IChzZWxlY3RvciwgY2IpID0+IHtcclxuXHRcdGNvbnN0IGVsZW1lbnRzID0gXy5xc2Eoc2VsZWN0b3IpO1xyXG5cdFx0ZWxlbWVudHMuc29tZSgoZWxlbWVudCwgaW5kZXgpID0+IGNiKGVsZW1lbnQsIGluZGV4LCBlbGVtZW50cykgPT09IGZhbHNlKTtcclxuXHR9LFxyXG5cdG86IGZ1bmN0aW9uIChvYmplY3QsIGNiKSB7XHJcblx0XHRPYmplY3Qua2V5cyhvYmplY3QpLnNvbWUoa2V5ID0+IGNiKGtleSwgb2JqZWN0W2tleV0sIG9iamVjdCkgPT09IGZhbHNlKTtcclxuXHR9LFxyXG5cdGU6IGZ1bmN0aW9uICh0LCBvLCBlLCBwKSB7XHJcblx0XHRjb25zdCBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0KTtcclxuXHRcdF8ubyhvLCAoaywgdikgPT4ge1xyXG5cdFx0XHRjb25zdCBiID0gay5jaGFyQXQoMCk7XHJcblx0XHRcdGlmIChiID09PSAnXycpXHJcblx0XHRcdFx0Yy5kYXRhc2V0W2suc3Vic3RyaW5nKDEpXSA9IHY7XHJcblx0XHRcdGVsc2UgaWYgKGIgPT09ICckJylcclxuXHRcdFx0XHRjLnNldEF0dHJpYnV0ZShrLnN1YnN0cmluZygxKSwgdik7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjW2tdID0gdjtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmIChlICYmIHApIHtcclxuXHRcdFx0Yy5hcHBlbmRDaGlsZChlKTtcclxuXHRcdH0gZWxzZSBpZiAoZSkge1xyXG5cdFx0XHRlLmFwcGVuZENoaWxkKGMpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGM7XHJcblx0fSxcclxuXHRxc2E6IHNlbGVjdG9yID0+IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpLFxyXG5cdGNzczogZnVuY3Rpb24gKHRleHQpIHtcclxuXHRcdGlmICghdGhpcy5zdHlsZSkge1xyXG5cdFx0XHR0aGlzLnN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRcdFx0dGhpcy5zdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7dGV4dH1cXG5gKSk7XHJcblx0fSxcclxuXHRqczogdCA9PiB7XHJcblx0XHRjb25zdCBqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcblx0XHRqLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuXHRcdGpbL15odHRwcz86XFwvXFwvL2kudGVzdCh0KSA/ICdzcmMnIDogJ3RleHRDb250ZW50J10gPSB0O1xyXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChqKTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfOyIsIi8vIFMgVCBPIFIgQSBHIEUgSEFORExFXHJcbmNvbnN0IHN0cmcgPSB7XHJcblx0TUFYOiA1MDEyLFxyXG5cdG9uOiBmYWxzZSxcclxuXHR0ZXN0OiAoKSA9PiB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBsID0gbG9jYWxTdG9yYWdlO1xyXG5cdFx0XHRjb25zdCBjID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc3Vic3RyKDIsIDgpO1xyXG5cdFx0XHRsLnNldEl0ZW0oYywgYyk7XHJcblx0XHRcdHJldHVybiBsLmdldEl0ZW0oYykgPT09IGMgPyAhbC5yZW1vdmVJdGVtKGMpIDogZmFsc2U7XHJcblx0XHR9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdH0sXHJcblx0cmVhZDogKGtleSkgPT4ge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiBjb25zb2xlLmVycm9yKGAke2UubGluZU51bWJlcn06JHtlLm1lc3NhZ2V9YCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzYXZlOiAoa2V5LCB2YWwpID0+IHN0cmcub24gPyAhbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWwpKSA6IGZhbHNlLFxyXG5cdHdpcGU6IGtleSA9PiBzdHJnLm9uID8gIWxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSkgOiBmYWxzZSxcclxuXHR6ZXJvOiBvID0+IHsgZm9yIChsZXQgayBpbiBvKSB7IGlmIChvLmhhc093blByb3BlcnR5KGspKSB7IHJldHVybiBmYWxzZTsgfSB9IHJldHVybiB0cnVlOyB9LCAvLyBjaGVjayBpZiB0aGUgb2JqZWN0IGlzIGVtcHR5XHJcblx0Z3JhYjogKGtleSwgZGVmKSA9PiB7IGNvbnN0IHMgPSBzdHJnLnJlYWQoa2V5KTsgcmV0dXJuIHN0cmcuemVybyhzKSA/IGRlZiA6IHM7IH0sXHJcblx0c2l6ZTogKCkgPT4ge1xyXG5cdFx0bGV0IGxlbmd0aCA9IDA7XHJcblx0XHRsZXQga2V5O1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Zm9yIChrZXkgaW4gd2luZG93LmxvY2FsU3RvcmFnZSkge1xyXG5cdFx0XHRcdGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuXHRcdFx0XHRcdGxlbmd0aCArPSB3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0ubGVuZ3RoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvLyBubyBtb3JlIHNwYWNlXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gMyArICgobGVuZ3RoICogMTYpIC8gKDggKiAxMDI0KSk7XHJcblx0fSxcclxuXHRmdWxsOiAoKSA9PiB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBkYXRlID0gKyhuZXcgRGF0ZSgpKTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oZGF0ZSwgZGF0ZSk7XHJcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGRhdGUpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGlmIChlLm5hbWUgPT09ICdRdW90YUV4Y2VlZGVkRXJyb3InIHx8XHJcblx0XHRcdFx0XHRlLm5hbWUgPT09ICdOU19FUlJPUl9ET01fUVVPVEFfUkVBQ0hFRCcpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0aW5pdDogKCkgPT4geyBzdHJnLm9uID0gc3RyZy50ZXN0KCk7IH1cclxufTtcclxuc3RyZy5pbml0KCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzdHJnOyIsImltcG9ydCBzdHJnIGZyb20gJy4vc3RyZyc7XHJcbmltcG9ydCBfIGZyb20gJy4vXyc7XHJcblxyXG4vLyBVIFAgRCBBIFQgRSBIQU5ETEVcclxuY29uc3QgdXBkYXRlID0ge1xyXG5cdG5hbWU6ICd5dG1hIScsXHJcblx0dmVyc2lvbjogODAxMCxcclxuXHRrZXk6ICd1anNfWVRNQV9VUERUX0hSJyxcclxuXHRjYWxsYmFjazogJ3l0bWF1cGRhdGVyJyxcclxuXHRwYWdlOiAnaHR0cHM6Ly9ncmVhc3lmb3JrLm9yZy9zY3JpcHRzLzEwMjMteW91dHViZS1tZS1hZ2FpbicsXHJcblx0anNvbjogJ2h0dHBzOi8vaGF0ZXJhZGlvLmdpdGh1Yi5pby95dG1hL3VwZGF0ZS5qc29uJyxcclxuXHRpbnRlcnZhbDogNyxcclxuXHRkYXk6IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXHJcblx0c2hvdzogZmFsc2UsXHJcblx0dGltZTogKCkgPT4gbmV3IERhdGUodXBkYXRlLmRheSArICgxMDAwICogNjAgKiA2MCAqIDI0ICogdXBkYXRlLmludGVydmFsKSkuZ2V0VGltZSgpLFxyXG5cdG5vdGlmaWNhdGlvbjogKHsgdmVyc2lvbiwgcGFnZSB9KSA9PiB7XHJcblx0XHRpZiAodXBkYXRlLnZlcnNpb24gPCB2ZXJzaW9uKSB7XHJcblx0XHRcdHN0cmcuc2F2ZSh1cGRhdGUua2V5LCB7IGRhdGU6IHVwZGF0ZS50aW1lKCksIHZlcnNpb24sIHBhZ2UgfSk7XHJcblx0XHRcdHVwZGF0ZS5saW5rKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRsaW5rOiAoKSA9PiB7XHJcblx0XHRpZiAodXBkYXRlLnNob3cpIHsgcmV0dXJuOyB9XHJcblx0XHR1cGRhdGUuc2hvdyA9IHRydWU7XHJcblxyXG5cdFx0Y29uc3QgeyBwYWdlIH0gPSBzdHJnLnJlYWQodXBkYXRlLmtleSk7XHJcblx0XHRjb25zdCBsaW5rID0gYFxyXG5cdFx0XHRcdDxhIGhyZWY9XCIke3BhZ2UgfHwgdXBkYXRlLnBhZ2V9XCIgaWQ9dXBkYXRldjMgdGl0bGU9VXBkYXRlIHRhcmdldD1fYmxhbms+XHJcblx0XHRcdFx0XHRBbiB1cGRhdGUgZm9yICR7dXBkYXRlLm5hbWV9IGlzIGF2YWlsYWJsZS5cclxuXHRcdFx0XHQ8L2E+YDtcclxuXHJcblx0XHRfLmNzcyh1cGRhdGUuY3NzKTtcclxuXHRcdGRvY3VtZW50LmJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBsaW5rKTtcclxuXHRcdF8ub24oZG9jdW1lbnQuYm9keSwgJ2NsaWNrJywgJyN1cGRhdGV2MycsIGUgPT4gZS50YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdub25lJyk7XHJcblx0fSxcclxuXHRjaGVjazogKG9wdCkgPT4ge1xyXG5cdFx0aWYgKCFzdHJnLm9uKSB7IHJldHVybjsgfVxyXG5cdFx0aWYgKHdpbmRvdy5jaHJvbWUgJiYgd2luZG93LmNocm9tZS5leHRlbnNpb24pIHsgcmV0dXJuOyB9XHJcblx0XHRjb25zdCBzdG9yZWQgPSBzdHJnLnJlYWQodXBkYXRlLmtleSk7XHJcblx0XHRsZXQgcGFnZTtcclxuXHJcblx0XHRpZiAob3B0IHx8ICFzdG9yZWQgfHwgc3RvcmVkLmRhdGUgPCB1cGRhdGUuZGF5KSB7XHJcblx0XHRcdHBhZ2UgPSAoc3RvcmVkICYmIHN0b3JlZC5wYWdlKSB8fCB1cGRhdGUucGFnZTtcclxuXHRcdFx0c3RyZy5zYXZlKHVwZGF0ZS5rZXksIHsgZGF0ZTogdXBkYXRlLnRpbWUoKSwgdmVyc2lvbjogdXBkYXRlLnZlcnNpb24sIHBhZ2UgfSk7XHJcblx0XHRcdGZldGNoKHVwZGF0ZS5qc29uKS50aGVuKHJlcyA9PiByZXMuanNvbigpKS50aGVuKHVwZGF0ZS5ub3RpZmljYXRpb24pO1xyXG5cdFx0fSBlbHNlIGlmICh1cGRhdGUudmVyc2lvbiA8IHN0b3JlZC52ZXJzaW9uKSB7XHJcblx0XHRcdHVwZGF0ZS5saW5rKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRjc3M6ICcjdXBkYXRlcjMsI3VwZGF0ZXIzOnZpc2l0ZWR7Ym94LXNoYWRvdzoxcHggMXB4IDZweCAjNzc3Njtib3JkZXItYm90dG9tOjNweCBzb2xpZCAjZTM5YzJkO2N1cnNvcjpwb2ludGVyO2NvbG9yOiM1NTU7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjtmb250LXNpemU6MTJweDtmb250LXdlaWdodDo3MDA7dGV4dC1hbGlnbjpqdXN0aWZ5O3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6OTk5OTk5O3JpZ2h0OjEwcHg7dG9wOjEwcHg7YmFja2dyb3VuZDojZWJlYmViIHVybChkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSFpwWlhkQ2IzZzlJakFnTFRNMElEVXhNaUExTVRJaVBqeHdZWFJvSUdacGJHdzlJaU5sTldWaVpqVWlJR1E5SWsweU56QXVOemd4SURjdU5VZ3lOREV1TWpKTU9DNDJOaUEwTVRBdU16QTFiREUwTGpjNE1TQXlOUzQyTURGSU5EZzRMalUyYkRFMExqYzRMVEkxTGpZd01YcHRNQ0F3SWk4K1BIQmhkR2dnWm1sc2JEMGlJMlk0WlRnMk9DSWdaRDBpVFRRNExqY3dOeUEwTURBdU9UTTBUREkxTXk0eE1qa2dORFl1T0RZM2FEVXVOelF5YkRJd05DNDBNaklnTXpVMExqQTJOMk10TVM0eU56Y2dNaTR5TVMweExqVTVOQ0F5TGpjMk5TMHlMamczTVNBMExqazNOa2cxTVM0MU56aGpMVEV1TWpjM0xUSXVNakV0TVM0MU9UUXRNaTQzTmpVdE1pNDROekV0TkM0NU56WjZiVEFnTUNJdlBqeHdZWFJvSUdacGJHdzlJaU5sTXpsak1tUWlJR1E5SWsweU56VXVPVGsySURjMkxqVXlOMnd0TVRjdU1USTFMVEk1TGpZMmFDMDFMamMwTWt3ME9DNDNNRGNnTkRBd0xqa3pOR014TGpJM055QXlMakl4SURFdU5UazBJREl1TnpZMUlESXVPRGN4SURRdU9UYzJhRE01TGprNU5tTXRNUzR5TnpjdE1pNHlNUzB4TGpVNU55MHlMamMyTlMweUxqZzNMVFF1T1RjMmVtMHdJREFpTHo0OGNHRjBhQ0JtYVd4c1BTSWpZMkZrT0dWaElpQmtQU0pOTWpjMUxqazVOaUF4Tmk0MU16Vk1NamN3TGpjNE1TQTNMalZJTWpReExqSXlURGd1TmpZZ05ERXdMak13TldNMkxqVTJOeUF4TVM0ek56a2dPQzR5TVRFZ01UUXVNakl5SURFMExqYzRNU0F5TlM0Mk1ERm9Nemt1T1RrMll5MDJMalUzTFRFeExqTTNPUzA0TGpJeE5DMHhOQzR5TWpJdE1UUXVOemd0TWpVdU5qQXhlbTB3SURBaUx6NDhjR0YwYUNCbWFXeHNQU0lqTnpJNE5qbGxJaUJrUFNKTk1qY3dMamcxTlNBek1ESXVORFUzYUMweU9TNDNNV010TXk0d01EUXRNeTR3TURRdE5DNDJPVEl0TkM0Mk9EY3ROeTQyT1RZdE55NDJPVEZXTVRZekxqZzJNMmcwTlM0eE1ESjJNVE13TGprd00yTXRNeTR3TURnZ015NHdNRFF0TkM0Mk9USWdOQzQyT0RjdE55NDJPVFlnTnk0Mk9URjZiVEFnTUNJdlBqeHdZWFJvSUdacGJHdzlJaU0xTXpZeU56VWlJR1E5SWsweU5UTXVORFVnTVRZekxqZzJNMmd0TWpCMk1UTXdMamt3TTJNekxqQXdNeUF6TGpBd05DQTBMalk1SURRdU5qZzNJRGN1TmprMUlEY3VOamt4YURFNUxqazVObXd0Tnk0Mk9USXROeTQyT1RGNmJUQWdNQ0l2UGp4d1lYUm9JR1pwYkd3OUlpTTNNamcyT1dVaUlHUTlJazB5TXpNdU5EVWdNek13TGpneE0yZzBOUzR4ZGpRMUxqRXdNV2d0TkRVdU1YcHRNQ0F3SWk4K1BIQmhkR2dnWm1sc2JEMGlJelV6TmpJM05TSWdaRDBpVFRJek15NDBOU0F6TXpBdU9ERXphREl3ZGpRMUxqRXdNV2d0TWpCNmJUQWdNQ0l2UGp4d1lYUm9JR1pwYkd3OUlpTm1abVlpSUdROUlrMHlOelV1T1RrMklERTBNUzR6TmpkSU1qWXhkaTB4TldneE5DNDVPVFo2YlMweU5DNDVPVFlnTUdndE1UVjJMVEUxYURFMWVtMHdJREFpTHo0OGNHRjBhQ0JrUFNKTk5EQXdMalF6SURJeE55NHdOVGxzTFRFeUxqazRPU0EzTGpWTU5EazBMalk0SURReE1DNHpNRFZzTFRFd0xqUTFJREU0TGpFd01VZ3lOeTQzTjJ3dE1UQXVORFUwTFRFNExqRXdNVXd5TkRVdU5UUTJJREUxYURJd0xqa3dOMnd4TURjdU1qTTRJREU0TlM0M05EWWdNVEl1T1RnNUxUY3VOVXd5TnpVdU1URXpJREJvTFRNNExqSXlNa3d3SURReE1DNHpNRFZzTVRrdU1URWdNek11TVRBeGFEUTNNeTQzTnpkTU5URXlJRFF4TUM0ek1EVjZiVEFnTUNJdlBqeHdZWFJvSUdROUlrMHhNalV1TVRVMklEUXhNeTQwTURaSU5EWTBMamMxYkRjdU1qQXpMVEV5TGpRM01pMHlNRGd1TnpVdE16WXhMalUyTjJndE1UUXVOREEyVERRd0xqQTBOeUEwTURBdU9UTTBiRGN1TWlBeE1pNDBOekpvTlRjdU9URXpWak01T0M0ME1VZzFPQzQ0TWpSTU1qVTJJRFUyTGpnNWJERTVOeTR4TnpZZ016UXhMalV5YUMwek1qZ3VNREo2YlRBZ01DSXZQanh3WVhSb0lHUTlJazB5T0RZdU1EUTNJREl5T1M0MU5UbDJMVGN6TGpFNU5tZ3ROakF1TURrNGRqRTBNUzQxTURoc01USXVNRGtnTVRJdU1EZzJhRE0xTGpreU1td3hNaTR3T0RZdE1USXVNRGcyVmpJME9TNDFOa2d5TnpFdU1EVjJOREl1TURrM2JDMHpMak13TVNBekxqTXdOV2d0TWpNdU5Xd3RNeTR6TFRNdU16QTFWakUzTVM0ek5qTm9NekF1TVhZMU9DNHhPVFo2YlRBZ01FMHlNalV1T1RVZ016Z3pMalF4YURZd0xqQTVOM1l0TmpBdU1EazRhQzAyTUM0d09UaDZiVEUxTFRRMUxqQTVPR2d6TUM0eGRqTXdMakV3TW1ndE16QXVNWHB0TUNBd0lpOCtQQzl6ZG1jKykgbm8tcmVwZWF0IDEwcHggY2VudGVyO2JhY2tncm91bmQtc2l6ZTo0MHB4O3BhZGRpbmc6MCAyMHB4IDAgNjBweDtoZWlnaHQ6NTVweDtsaW5lLWhlaWdodDo1NXB4fSN1cGRhdGVyMzpob3ZlciwjdXBkYXRlcjM6dmlzaXRlZDpob3Zlcntjb2xvcjojYjMzYTNhICFpbXBvcnRhbnQ7Ym9yZGVyLWNvbG9yOiNjZTRiMzA7dGV4dC1kZWNvcmF0aW9uOiBub25lO30nIC8vIEljb24gbWFkZSBieSBGcmVlcGlrIGZyb20gd3d3LmZsYXRpY29uLmNvbSBcclxufTtcclxudXBkYXRlLmNoZWNrKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB1cGRhdGU7Il0sInNvdXJjZVJvb3QiOiIifQ==