// ==UserScript==
// @name         Pornhub Pro-ish
// @namespace    https://www.reddit.com/user/Alpacinator
// @version      6.1.3
// @include      *://*.pornhub.com/*
// @grant        none
// @description  Alters and improves the PH experience with better performance and code structure
// @downloadURL https://update.greasyfork.org/scripts/473397/Pornhub%20Pro-ish.user.js
// @updateURL https://update.greasyfork.org/scripts/473397/Pornhub%20Pro-ish.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  // Configuration
  const CONFIG = {
	SCRIPT_NAME: 'Pornhub Pro-ish Enhanced',
	TIMING: {
	  MUTATION_DEBOUNCE_MS: 300,
	  LANGUAGE_CHECK_DELAY_MS: 1000,
	  CURSOR_HIDE_DELAY_MS: 3,
	  AUTOSCROLL_CHECK_INTERVAL_MS: 2000,
	  AUTOSCROLL_TIMEOUT_MS: 2000,
	  SCROLL_STEP_DELAY_MS: 1000,
	  SCROLL_WAIT_MS: 1000,
	  BUTTON_FLASH_MS: 100
	},
	SELECTORS: {
	  VIDEO_LISTS: 'ul.videos, ul.videoList',
	  WATCHED_INDICATORS: '.watchedVideoText, .watchedVideo',
	  PAID_CONTENT: 'span.price, .premiumicon, img.privateOverlay',
	  MUTE_BUTTON: 'div.mgp_volume[data-text="Mute"]',
	  LOAD_MORE_BUTTONS: '#loadMoreRelatedVideosCenter, [data-label="recommended_load_more"]',
	  LANGUAGE_DROPDOWN: 'li.languageDropdown',
	  ENGLISH_OPTION: 'li[data-lang="en"] a.networkTab',
	  PLAYLIST_CONTAINERS: [
		'#videoPlaylist',
		'#videoPlaylistSection', 
		'#playListSection',
		'[id*="playlist"]',
		'[class*="playlist"]',
		'[data-context="playlist"]'
	  ],
	  ELEMENTS_TO_HIDE: [
		'#countryRedirectMessage',
		'#js-abContainterMain',
		'#welcome',
     '#cmtContent',
		'div.pornInLangWrapper',
		'#loadMoreRelatedVideosCenter',
		'[data-label="recommended_load_more"]'
	  ]
	}
  };
 
  // Event system for loose coupling
  class EventEmitter {
	constructor() {
	  this.events = {};
	}
 
	on(event, callback) {
	  if (!this.events[event]) {
		this.events[event] = [];
	  }
	  this.events[event].push(callback);
	}
 
	emit(event, data) {
	  if (this.events[event]) {
		this.events[event].forEach(callback => {
		  try {
			callback(data);
		  } catch (error) {
			console.error(`Error in event handler for ${event}:`, error);
		  }
		});
	  }
	}
 
	off(event, callback) {
	  if (this.events[event]) {
		this.events[event] = this.events[event].filter(cb => cb !== callback);
	  }
	}
  }
 
  // Enhanced utilities with better error handling
  const Utils = {
	log: (message, level = 'info') => {
	  const prefix = `${CONFIG.SCRIPT_NAME}:`;
	  switch (level) {
		case 'error':
		  console.error(prefix, message);
		  break;
		case 'warn':
		  console.warn(prefix, message);
		  break;
		default:
		  console.log(prefix, message);
	  }
	},
 
	debounce: (func, wait) => {
	  let timeout;
	  return function executedFunction(...args) {
		const later = () => {
		  clearTimeout(timeout);
		  func.apply(this, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	  };
	},
 
	throttle: (func, limit) => {
	  let inThrottle;
	  return function(...args) {
		if (!inThrottle) {
		  func.apply(this, args);
		  inThrottle = true;
		  setTimeout(() => inThrottle = false, limit);
		}
	  };
	},
 
	parseDuration: (durationString) => {
	  if (!durationString || typeof durationString !== 'string') return 0;
	  
	  const parts = durationString.trim().split(':').map(Number);
	  return parts.reduce((acc, part) => {
		return isNaN(part) ? acc : acc * 60 + part;
	  }, 0);
	},
 
	createElement: (tag, options = {}) => {
	  const element = document.createElement(tag);
	  
	  Object.entries(options).forEach(([key, value]) => {
		try {
		  if (key === 'style' && typeof value === 'object') {
			Object.assign(element.style, value);
		  } else if (key === 'textContent') {
			element.textContent = value;
		  } else if (key === 'className') {
			element.className = value;
		  } else if (key === 'dataset' && typeof value === 'object') {
			Object.assign(element.dataset, value);
		  } else {
			element.setAttribute(key, value);
		  }
		} catch (error) {
		  Utils.log(`Error setting ${key} on element:`, 'error');
		}
	  });
	  
	  return element;
	},
 
	safeQuerySelector: (selector, context = document) => {
	  try {
		return context.querySelector(selector);
	  } catch (error) {
		Utils.log(`Invalid selector: ${selector}`, 'error');
		return null;
	  }
	},
 
	safeQuerySelectorAll: (selector, context = document) => {
	  try {
		return Array.from(context.querySelectorAll(selector));
	  } catch (error) {
		Utils.log(`Invalid selector: ${selector}`, 'error');
		return [];
	  }
	},
 
	sanitizeFilterWords: (input) => {
	  if (!input || typeof input !== 'string') return [];
	  
	  return input
		.split(/[,\s]+/)
		.map(word => word.trim().toLowerCase())
		.filter(word => word.length >= 2)
		.filter(word => /^[\w\-]+$/.test(word));
	},
 
	addStylesheet: (css) => {
	  const style = Utils.createElement('style', {
		textContent: css
	  });
	  document.head.appendChild(style);
	  return style;
	}
  };
 
  // Enhanced state management with validation
  class StateManager {
	constructor(eventEmitter) {
	  this.cache = new Map();
	  this.eventEmitter = eventEmitter;
	  this.validators = new Map();
	}
 
	addValidator(key, validator) {
	  this.validators.set(key, validator);
	}
 
	get(key, defaultValue = false) {
	  if (this.cache.has(key)) {
		return this.cache.get(key);
	  }
 
	  try {
		const stored = localStorage.getItem(key);
		let value = stored !== null ? stored === 'true' : defaultValue;
 
		const validator = this.validators.get(key);
		if (validator) {
		  value = validator(value) ? value : defaultValue;
		}
 
		if (stored === null) {
		  this.set(key, defaultValue, false);
		}
 
		this.cache.set(key, value);
		return value;
	  } catch (error) {
		Utils.log(`Error reading state for ${key}:`, 'error');
		return defaultValue;
	  }
	}
 
	set(key, value, emit = true) {
	  try {
		const validator = this.validators.get(key);
		if (validator && !validator(value)) {
		  Utils.log(`Invalid value for ${key}: ${value}`, 'warn');
		  return false;
		}
 
		localStorage.setItem(key, value);
		const oldValue = this.cache.get(key);
		this.cache.set(key, value);
 
		if (emit && oldValue !== value) {
		  this.eventEmitter.emit('stateChanged', { key, oldValue, newValue: value });
		}
 
		return true;
	  } catch (error) {
		Utils.log(`Error setting state for ${key}:`, 'error');
		return false;
	  }
	}
 
	toggle(key, emit = true) {
	  const newValue = !this.get(key);
	  this.set(key, newValue, emit);
	  return newValue;
	}
 
	clearCache() {
	  this.cache.clear();
	}
  }
 
  // Improved AutoScroller with better state management
  class AutoScroller {
	constructor(eventEmitter) {
	  this.eventEmitter = eventEmitter;
	  this.isRunning = false;
	  this.timeoutId = null;
	  this.intervalId = null;
	  this.lastPageHeight = 0;
	  this.lastUpdateTime = Date.now();
	  this.pageUpSteps = 2;
	}
 
	start() {
	  if (this.isRunning) {
		Utils.log('AutoScroll already running');
		return false;
	  }
 
	  this.isRunning = true;
	  this.lastPageHeight = document.body.scrollHeight;
	  this.lastUpdateTime = Date.now();
	  
	  Utils.log('AutoScroll started');
	  this.eventEmitter.emit('autoscrollStateChanged', { isRunning: true });
	  
	  this.scrollLoop();
	  this.startUpdateChecker();
	  
	  return true;
	}
 
	stop() {
	  if (!this.isRunning) {
		return false;
	  }
 
	  this.isRunning = false;
	  
	  if (this.timeoutId) {
		clearTimeout(this.timeoutId);
		this.timeoutId = null;
	  }
	  
	  if (this.intervalId) {
		clearInterval(this.intervalId);
		this.intervalId = null;
	  }
	  
	  Utils.log('AutoScroll stopped');
	  this.eventEmitter.emit('autoscrollStateChanged', { isRunning: false });
	  
	  return true;
	}
 
  scrollLoop() {
    if (!this.isRunning) return;

    window.scrollTo(0, document.body.scrollHeight);

    this.timeoutId = setTimeout(() => {
      if (!this.isRunning) return;

      this.performPageUps(2);  // Pass 2 directly

      this.timeoutId = setTimeout(() => this.scrollLoop(), CONFIG.TIMING.SCROLL_STEP_DELAY_MS);
    }, CONFIG.TIMING.SCROLL_WAIT_MS);
  }

  performPageUps(steps) {
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        if (!this.isRunning) return;

        const currentScroll = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        const newScroll = Math.max(0, currentScroll - viewportHeight);
        window.scrollTo(0, newScroll);
      }, i * CONFIG.TIMING.SCROLL_STEP_DELAY_MS);
    }
  }

	startUpdateChecker() {
	  this.intervalId = setInterval(() => {
		if (!this.isRunning) return;
 
		const currentPageHeight = document.body.scrollHeight;
		const now = Date.now();
		
		if (currentPageHeight > this.lastPageHeight) {
		  this.lastPageHeight = currentPageHeight;
		  this.lastUpdateTime = now;
		  Utils.log('Page updated, continuing autoscroll');
		} else if (now - this.lastUpdateTime > CONFIG.TIMING.AUTOSCROLL_TIMEOUT_MS) {
		  Utils.log('No page updates for 2 seconds, stopping autoscroll');
		  this.stop();
		}
	  }, CONFIG.TIMING.AUTOSCROLL_CHECK_INTERVAL_MS);
	}
 
	toggle() {
	  return this.isRunning ? this.stop() : this.start();
	}
  }
 
  // Enhanced feature system with better organization
  class Feature {
	constructor(config) {
	  this.label = config.label;
	  this.key = config.key;
	  this.handler = config.handler;
	  this.id = config.id;
	  this.defaultState = config.defaultState || false;
	  this.category = config.category || 'general';
	  this.description = config.description || '';
	}
  }
 
  // Improved video sorting with better error handling
  class VideoSorter {
	constructor(stateManager) {
	  this.state = stateManager;
	}
 
	findVideoLists(includePlaylist = null) {
	  const allLists = Utils.safeQuerySelectorAll(CONFIG.SELECTORS.VIDEO_LISTS);
 
	  if (includePlaylist === null) {
		includePlaylist = this.state.get('sortWithinPlaylistsState');
	  }
 
	  return allLists.filter(list => {
		const isInPlaylist = CONFIG.SELECTORS.PLAYLIST_CONTAINERS.some(selector => {
		  return list.closest(selector) || list.matches(selector) || 
				 list.id.toLowerCase().includes('playlist');
		});
 
		if (!includePlaylist && isInPlaylist) {
		  Utils.log(`Excluding playlist container: ${list.id || list.className}`);
		  return false;
		}
 
		return true;
	  });
	}
 
	findPlaylistLists() {
	  const playlistSelectors = CONFIG.SELECTORS.PLAYLIST_CONTAINERS.map(selector => 
		`${selector} ul.videos`
	  );
 
	  return playlistSelectors.flatMap(selector => 
		Utils.safeQuerySelectorAll(selector)
	  );
	}
 
	sortByDuration(forceIncludePlaylist = false) {
	  const lists = forceIncludePlaylist ? 
		this.findPlaylistLists().concat(this.findVideoLists(true)) : 
		this.findVideoLists();
 
	  Utils.log(`Sorting ${lists.length} video lists by duration`);
 
	  lists.forEach(list => this.sortListByDuration(list));
	}
 
	sortListByDuration(list) {
	  const items = Utils.safeQuerySelectorAll('li', list)
		.filter(li => li.querySelector('.duration'));
 
	  if (items.length === 0) return;
 
	  Utils.log(`Sorting ${items.length} items in list: ${list.id || list.className}`);
 
	  try {
		items.sort((a, b) => {
		  const durationA = Utils.parseDuration(
			a.querySelector('.duration')?.textContent || '0'
		  );
		  const durationB = Utils.parseDuration(
			b.querySelector('.duration')?.textContent || '0'
		  );
		  return durationB - durationA;
		});
 
		items.forEach(item => list.appendChild(item));
	  } catch (error) {
		Utils.log(`Error sorting list: ${error.message}`, 'error');
	  }
	}
 
	sortByTrophy(forceIncludePlaylist = false) {
	  const lists = forceIncludePlaylist ? 
		this.findPlaylistLists().concat(this.findVideoLists(true)) : 
		this.findVideoLists();
 
	  Utils.log(`Sorting ${lists.length} video lists by trophy`);
 
	  lists.forEach(list => this.sortListByTrophy(list));
	}
 
	sortListByTrophy(list) {
	  const items = Utils.safeQuerySelectorAll('li', list);
	  const trophyItems = [];
	  const otherItems = [];
 
	  items.forEach(item => {
		const trophy = item.querySelector('i.award-icon');
		if (trophy) {
		  trophyItems.push(item);
		} else {
		  otherItems.push(item);
		}
	  });
 
	  Utils.log(`Found ${trophyItems.length} trophy items and ${otherItems.length} other items in list: ${list.id || list.className}`);
 
	  [...trophyItems, ...otherItems].forEach(item => list.appendChild(item));
	}
  }
 
  // Enhanced video hiding with better performance
  class VideoHider {
	constructor(stateManager, videoSorter) {
	  this.state = stateManager;
	  this.videoSorter = videoSorter;
	  this.cachedFilterWords = null;
	  this.lastFilterString = '';
	}
 
	getFilterWords() {
	  const filterString = localStorage.getItem('savedFilterWords') || '';
	  
	  if (filterString === this.lastFilterString && this.cachedFilterWords) {
		return this.cachedFilterWords;
	  }
 
	  this.lastFilterString = filterString;
	  this.cachedFilterWords = Utils.sanitizeFilterWords(filterString);
	  
	  return this.cachedFilterWords;
	}
 
	hideVideos() {
	  const hideWatched = this.state.get('hideWatchedState');
	  const hidePaid = this.state.get('hidePaidContentState');
	  const filterWords = this.getFilterWords();
 
	  const lists = this.videoSorter.findVideoLists(true);
	  const items = lists.flatMap(list => Utils.safeQuerySelectorAll('li', list));
 
	  Utils.log(`Processing ${items.length} video items for hiding`);
 
	  items.forEach(item => {
		try {
		  const shouldHide = this.shouldHideItem(item, {
			hideWatched,
			hidePaid,
			filterWords
		  });
 
		  item.style.display = shouldHide ? 'none' : '';
		} catch (error) {
		  Utils.log(`Error processing item: ${error.message}`, 'error');
		}
	  });
	}
 
	shouldHideItem(item, options) {
	  const { hideWatched, hidePaid, filterWords } = options;
 
	  if (hideWatched) {
		const watchedDiv = item.querySelector(CONFIG.SELECTORS.WATCHED_INDICATORS);
		if (watchedDiv && !watchedDiv.classList.contains('hidden')) {
		  return true;
		}
	  }
 
	  if (hidePaid) {
		const hasPaidContent = item.querySelector(CONFIG.SELECTORS.PAID_CONTENT) ||
		  (item.querySelector('a')?.getAttribute('href') === 'javascript:void(0)');
		if (hasPaidContent) {
		  return true;
		}
	  }
 
	  if (filterWords.length > 0) {
		const textContent = item.textContent.toLowerCase();
		if (filterWords.some(word => textContent.includes(word))) {
		  return true;
		}
	  }
 
	  return false;
	}
  }
 
  // Improved video player functionality
  class VideoPlayer {
	static mute() {
	  const muteButtons = Utils.safeQuerySelectorAll(CONFIG.SELECTORS.MUTE_BUTTON);
 
	  muteButtons.forEach(button => {
		try {
		  const events = ['mouseover', 'focus', 'mousedown', 'mouseup', 'click'];
		  events.forEach(eventType => {
			button.dispatchEvent(new Event(eventType, {
			  view: window,
			  bubbles: true,
			  cancelable: true
			}));
		  });
		} catch (error) {
		  Utils.log(`Error muting video: ${error.message}`, 'error');
		}
	  });
 
	  if (muteButtons.length > 0) {
		Utils.log(`${muteButtons.length} video elements were muted.`);
	  }
	}
 
	static toggleCursorHide(enabled) {
	  const existingStyle = document.getElementById('cursor-hide-style');
 
	  if (enabled && !existingStyle) {
		const style = Utils.createElement('style', {
		  id: 'cursor-hide-style',
		  textContent: `
			@keyframes hideCursor {
			  0%, 99% { cursor: default; }
			  100% { cursor: none; }
			}
			.mgp_playingState { animation: none; }
			.mgp_playingState:hover { 
			  animation: hideCursor ${CONFIG.TIMING.CURSOR_HIDE_DELAY_MS}s forwards; 
			}
		  `
		});
		document.head.appendChild(style);
		Utils.log('Cursor hide style added.');
	  } else if (!enabled && existingStyle) {
		existingStyle.remove();
		Utils.log('Cursor hide style removed.');
	  }
	}
  }
 
  // Enhanced language management
  class LanguageManager {
	constructor(stateManager) {
	  this.state = stateManager;
	}
 
	redirectToEnglish() {
	  if (!this.state.get('redirectToEnglishState')) return;
 
	  setTimeout(() => {
		try {
		  const languageDropdown = Utils.safeQuerySelector(CONFIG.SELECTORS.LANGUAGE_DROPDOWN);
		  const isEnglish = languageDropdown?.querySelector('span.networkTab')
			?.textContent.trim().toLowerCase() === 'en';
 
		  if (!isEnglish) {
			const englishLink = Utils.safeQuerySelector(CONFIG.SELECTORS.ENGLISH_OPTION);
			if (englishLink) {
			  englishLink.click();
			  Utils.log('Redirected to English.');
			}
		  }
		} catch (error) {
		  Utils.log(`Error checking language: ${error.message}`, 'error');
		}
	  }, CONFIG.TIMING.LANGUAGE_CHECK_DELAY_MS);
	}
  }
 
  // Improved element hiding
  class ElementHider {
	static hideElements() {
	  Utils.log('Hiding unwanted elements...');
 
	  CONFIG.SELECTORS.ELEMENTS_TO_HIDE.forEach(selector => {
		try {
		  const elements = Utils.safeQuerySelectorAll(selector);
		  elements.forEach(element => {
			element.style.display = 'none';
		  });
		} catch (error) {
		  Utils.log(`Error hiding elements with selector ${selector}: ${error.message}`, 'error');
		}
	  });
	}
  }
 
  // Enhanced playlist functionality
  class PlaylistManager {
	constructor(eventEmitter) {
	  this.eventEmitter = eventEmitter;
	}
 
	addRedOverlay(element) {
	  try {
		const overlay = Utils.createElement('div', {
		  style: {
			position: 'absolute',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			backgroundColor: 'red',
			opacity: '0.5',
			pointerEvents: 'none',
			zIndex: '1000'
		  }
		});
 
		const parentLi = element.closest('li');
		if (parentLi) {
		  parentLi.style.position = 'relative';
		  parentLi.appendChild(overlay);
		  Utils.log('Added red overlay to playlist item');
		}
	  } catch (error) {
		Utils.log(`Error adding red overlay: ${error.message}`, 'error');
	  }
	}
 
	init() {
	  document.addEventListener('click', (event) => {
		if (event.target?.matches('button[onclick="deleteFromPlaylist(this);"]')) {
		  this.addRedOverlay(event.target);
		}
	  });
	}
  }
 
  // Enhanced menu system with CSS class for h3
  class MenuManager {
	constructor(stateManager, eventEmitter, autoScroller, scrollToTop) {
	  this.state = stateManager;
	  this.eventEmitter = eventEmitter;
	  this.autoScroller = autoScroller;
	  this.scrollToTop = scrollToTop;
	  this.menu = null;
	  this.toggle = null;
	  this.filterInput = null;
	  this.styleSheet = null;
 
	  this.eventEmitter.on('autoscrollStateChanged', this.updateAutoscrollButton.bind(this));
	}
 
	create() {
	  Utils.log('Creating menu...');
	  try {
		this.addMenuStyles();
		this.createMenuContainer();
		this.addFeatureToggles();
		this.addManualButtons();
		this.addFilterSection();
		this.createToggleButton();
 
		document.body.insertBefore(this.menu, document.body.firstChild);
		this.syncVisibility();
	  } catch (error) {
		Utils.log(`Error creating menu: ${error.message}`, 'error');
	  }
	}
 
	addMenuStyles() {
	  const css = `
		.menu-category-header {
		  color: orange;
		  background-color: #1e1e1e;
		  margin-bottom: 10px;
		  margin-top: 20px;
		  display: block;
		  font-size: 16px;
		  padding: 10px;
		  border-radius: 4px;          
		  text-transform: uppercase;
		}
	  `;
	  
	  this.styleSheet = Utils.addStylesheet(css);
	}
 
	createMenuContainer() {
	  this.menu = Utils.createElement('div', {
		id: 'sideMenu',
		style: {
		  position: 'fixed',
		  top: '0',
		  left: '0',
		  padding: '60px 20px 20px 20px',
		  height: '100vh',
		  width: 'min-content',
			  backgroundColor: 'rgba(0,0,0,0.8)',
		  zIndex: '9999',
		  display: 'block',
		  flexDirection: 'column',
		  justifyContent: 'flex-start',
		  alignItems: 'flex-start',
		  transition: 'opacity 0.3s ease, transform 0.3s ease',
		  boxSizing: 'border-box',
		  overflowY: 'auto'
		}
	  });
	}
 
	addFeatureToggles() {
	  const features = this.getFeatureDefinitions();
	  
	  const grouped = features.reduce((acc, feature) => {
		if (!acc[feature.category]) acc[feature.category] = [];
		acc[feature.category].push(feature);
		return acc;
	  }, {});
 
	  Object.entries(grouped).forEach(([category, categoryFeatures]) => {
		const header = Utils.createElement('h3', {
		  textContent: category.charAt(0).toUpperCase() + category.slice(1),
		  className: 'menu-category-header'
		});
		this.menu.appendChild(header);
 
		categoryFeatures.forEach(feature => {
		  const toggle = this.createToggle(feature);
		  this.menu.appendChild(toggle);
		});
	  });
	}
 
	getFeatureDefinitions() {
	  return [
		new Feature({
		  label: 'Always use English',
		  key: 'redirectToEnglishState',
		  handler: () => this.eventEmitter.emit('redirectToEnglish'),
		  id: 'redirectToEnglishToggle',
		  defaultState: true,
		  category: 'general'
		}),
		new Feature({
		  label: 'Sort within playlists',
		  key: 'sortWithinPlaylistsState',
		  handler: () => Utils.log('Playlist sorting scope updated'),
		  id: 'sortWithinPlaylistsToggle',
		  defaultState: false,
		  category: 'sorting'
		}),
		new Feature({
		  label: 'Sort videos by duration',
		  key: 'sortByDurationState',
		  handler: () => this.eventEmitter.emit('sortByDuration'),
		  id: 'sortByDurationToggle',
		  defaultState: false,
		  category: 'sorting'
		}),
		new Feature({
		  label: 'Sort videos by 🏆',
		  key: 'sortByTrophyState',
		  handler: () => this.eventEmitter.emit('sortByTrophy'),
		  id: 'sortByTrophyToggle',
		  defaultState: false,
		  category: 'sorting'
		}),
		new Feature({
		  label: 'Hide watched videos',
		  key: 'hideWatchedState',
		  handler: () => this.eventEmitter.emit('hideVideos'),
		  id: 'hideWatchedToggle',
		  defaultState: false,
		  category: 'filtering'
		}),
		new Feature({
		  label: 'Hide paid content',
		  key: 'hidePaidContentState',
		  handler: () => this.eventEmitter.emit('hideVideos'),
		  id: 'hidePaidContentToggle',
		  defaultState: true,
		  category: 'filtering'
		}),
		new Feature({
		  label: 'Mute by default',
		  key: 'muteState',
		  handler: () => VideoPlayer.mute(),
		  id: 'muteToggle',
		  defaultState: false,
		  category: 'player'
		}),
		new Feature({
		  label: 'Hide cursor on video',
		  key: 'cursorHideState',
		  handler: () => this.eventEmitter.emit('toggleCursorHide'),
		  id: 'cursorHideToggle',
		  defaultState: true,
		  category: 'player'
		})
	  ];
	}
 
	addManualButtons() {
	  const buttonsContainer = Utils.createElement('div', {
		style: { marginTop: '20px', width: '100%' }
	  });
 
	  const buttons = [
		{
		  text: 'Put 🏆 first manually',
		  handler: () => this.eventEmitter.emit('sortByTrophy', true)
		},
		{
		  text: 'Sort by duration manually',
		  handler: () => this.eventEmitter.emit('sortByDuration', true)
		}
	  ];
 
	  buttons.forEach(({ text, handler }) => {
		const button = this.createButton(text, handler);
		buttonsContainer.appendChild(button);
	  });
 
	  const autoscrollButton = this.createAutoscrollButton();
	  buttonsContainer.appendChild(autoscrollButton);
 
	  const scrolltotopButton = this.createScrollToTopButton();
	  buttonsContainer.appendChild(scrolltotopButton);
	  
	  this.menu.appendChild(buttonsContainer);
	}
 
	createAutoscrollButton() {
	  const button = Utils.createElement('button', {
		id: 'autoscrollButton',
		textContent: 'Start Autoscroll',
		style: {
		  marginBottom: '15px',
		  padding: '8px 12px',
		  backgroundColor: 'black',
		  color: 'white',
		  border: '1px solid white',
		  borderRadius: '10px',
		  cursor: 'pointer',
		  transition: 'all 0.3s',
		  width: '100%'
		}
	  });
 
	  this.setupButtonHoverEffects(button);
 
	  button.addEventListener('click', () => {
		this.autoScroller.toggle();
	  });
 
	  return button;
	}
 
	updateAutoscrollButton(data) {
	  const button = document.getElementById('autoscrollButton');
	  if (!button) return;
 
	  if (data.isRunning) {
		button.textContent = 'Stop Autoscroll';
		button.style.backgroundColor = 'red';
		button.style.borderColor = 'red';
	  } else {
		button.textContent = 'Start Autoscroll';
		button.style.backgroundColor = 'black';
		button.style.borderColor = 'white';
	  }
	}
	
	createScrollToTopButton() {
	  const button = Utils.createElement('button', {
		id: 'scrolltotopButton',
		textContent: 'Scroll to top of the page',
		style: {
		  marginBottom: '15px',
		  padding: '8px 12px',
		  backgroundColor: 'black',
		  color: 'white',
		  border: '1px solid white',
		  borderRadius: '10px',
		  cursor: 'pointer',
		  transition: 'all 0.3s',
		  width: '100%'
		}
	  });
	  
button.addEventListener('click', () => {
	button.style.backgroundColor = 'orange';
	setTimeout(() => {
		button.style.backgroundColor = 'black';
	}, CONFIG.TIMING.BUTTON_FLASH_MS);
 
	this.scrollToTop.scrollToTop();
});
 
	  return button;
	}
	
	addFilterSection() {
	  const filterContainer = Utils.createElement('div', {
	  style: { 
		marginTop: '20px', 
		width: '100%', 
		display: 'flex',
		flexDirection: 'column'
	  }
	  });
 
	  const filterLabel = Utils.createElement('label', {
		textContent: 'Words to filter out:',
		style: {
		  color: 'white',
		  display: 'block',
		  marginBottom: '5px',
		  fontSize: '14px',
		  width: '100%'
		}
	  });
 
	  this.filterInput = Utils.createElement('input', {
		type: 'text',
		id: 'inputFilterWords',
		placeholder: 'Separate with space or comma',
		style: {
		  display: 'block',
		  padding: '8px',
		  border: '1px solid #ccc',
		  borderRadius: '5px',
		  fontSize: '14px'
		}
	  });
 
	  const savedWords = localStorage.getItem('savedFilterWords');
	  if (savedWords) {
		this.filterInput.value = savedWords;
	  }
 
	  this.filterInput.addEventListener('input', Utils.debounce(() => {
		const value = this.filterInput.value;
		localStorage.setItem('savedFilterWords', value);
		this.eventEmitter.emit('hideVideos');
	  }, 300));
 
	  filterContainer.appendChild(filterLabel);
	  filterContainer.appendChild(this.filterInput);
	  this.menu.appendChild(filterContainer);
	}
 
	createToggle(feature) {
	  const container = Utils.createElement('div', {
		style: {
		  display: 'flex',
		  alignItems: 'center',
		  marginBottom: '10px',
		  width: '100%'
		}
	  });
 
	  const isActive = this.state.get(feature.key, feature.defaultState);
 
	  const toggle = Utils.createElement('div', {
		id: feature.id,
		style: {
		  position: 'relative',
		  width: '40px',
		  height: '20px',
		  backgroundColor: isActive ? 'orange' : '#666',
		  borderRadius: '20px',
		  cursor: 'pointer',
		  transition: 'background-color 0.2s',
		  flexShrink: '0'
		}
	  });
 
	  const slider = Utils.createElement('div', {
		style: {
		  position: 'absolute',
		  left: isActive ? '22px' : '2px',
		  top: '2px',
		  width: '16px',
		  height: '16px',
		  backgroundColor: 'white',
		  borderRadius: '50%',
		  transition: 'left 0.2s',
		  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
		}
	  });
 
	  const label = Utils.createElement('span', {
		textContent: feature.label,
		style: {
		  color: 'white',
		  marginLeft: '12px',
		  fontSize: '13px',
		  lineHeight: '20px',
		  cursor: 'pointer',
		  width: 'max-content'
		}
	  });
 
	  toggle.appendChild(slider);
	  
	  const clickHandler = () => this.handleToggleClick(feature, toggle, slider);
	  toggle.addEventListener('click', clickHandler);
	  label.addEventListener('click', clickHandler);
 
	  container.appendChild(toggle);
	  container.appendChild(label);
 
	  return container;
	}
 
	createButton(text, clickHandler) {
	  const button = Utils.createElement('button', {
		textContent: text,
		style: {
		  marginBottom: '10px',
		  padding: '8px 12px',
		  backgroundColor: 'black',
		  color: 'white',
		  border: '1px solid white',
		  borderRadius: '10px',
		  cursor: 'pointer',
		  transition: 'all 0.3s',
		  width: '100%',
		  fontSize: '13px'
		}
	  });
 
	  this.setupButtonHoverEffects(button);
 
	  button.addEventListener('click', () => {
		button.style.backgroundColor = 'orange';
		setTimeout(() => {
		  button.style.backgroundColor = 'black';
		}, CONFIG.TIMING.BUTTON_FLASH_MS);
		clickHandler();
	  });
 
	  return button;
	}
 
	setupButtonHoverEffects(button) {
	  button.addEventListener('mouseenter', () => {
		if (button.style.backgroundColor !== 'red') {
		  button.style.color = 'orange';
		  button.style.borderColor = 'orange';
		}
	  });
 
	  button.addEventListener('mouseleave', () => {
		if (button.style.backgroundColor !== 'red') {
		  button.style.color = 'white';
		  button.style.borderColor = 'white';
		}
	  });
	}
 
	createToggleButton() {
	  const isVisible = this.state.get('menuShowState', true);
 
	  this.toggle = Utils.createElement('div', {
		id: 'menuToggle',
		textContent: isVisible ? 'Hide Menu' : 'Show Menu',
		style: {
		  position: 'fixed',
		  left: '5px',
		  top: '5px',
		  fontSize: '12px',
		  color: 'orange',
		  cursor: 'pointer',
		  zIndex: '10000',
		  transition: 'all 0.3s',
		  padding: '8px 12px',
		  backgroundColor: 'rgba(0,0,0,0.8)',
		  border: '1px solid orange',
		  borderRadius: '15px',
		  fontWeight: 'bold'
		}
	  });
 
	  this.toggle.addEventListener('click', this.toggleVisibility.bind(this));
	  this.toggle.addEventListener('mouseenter', () => {
		this.toggle.style.backgroundColor = 'rgba(255,165,0,0.2)';
	  });
	  this.toggle.addEventListener('mouseleave', () => {
		this.toggle.style.backgroundColor = 'rgba(0,0,0,0.8)';
	  });
 
	  document.body.appendChild(this.toggle);
	}
 
	handleToggleClick(feature, toggleElement, slider) {
	  try {
		const newState = this.state.toggle(feature.key);
 
		toggleElement.style.backgroundColor = newState ? 'orange' : '#666';
		slider.style.left = newState ? '22px' : '2px';
 
		setTimeout(() => feature.handler(), 0);
	  } catch (error) {
		Utils.log(`Error handling toggle for ${feature.key}: ${error.message}`, 'error');
	  }
	}
 
	toggleVisibility() {
	  const newState = this.state.toggle('menuShowState');
	  if (newState) {
		this.show();
	  } else {
		this.hide();
	  }
	}
 
	show() {
	  if (this.menu) {
		this.menu.style.visibility = 'visible';
		this.menu.style.opacity = '1';
		this.menu.style.transform = 'translateX(0)';
	  }
	  if (this.toggle) {
		this.toggle.textContent = 'Hide Menu';
	  }
	}
 
	hide() {
	  if (this.menu) {
		this.menu.style.visibility = 'hidden';
		this.menu.style.opacity = '0';
		this.menu.style.transform = 'translateX(-100%)';
	  }
	  if (this.toggle) {
		this.toggle.textContent = 'Show Menu';
	  }
	}
 
	syncVisibility() {
	  const shouldShow = this.state.get('menuShowState', true);
	  if (shouldShow) {
		this.show();
	  } else {
		this.hide();
	  }
	}
 
	updateToggleStates() {
	  try {
		const features = this.getFeatureDefinitions();
		features.forEach(feature => {
		  const element = document.getElementById(feature.id);
		  if (element) {
			const currentState = this.state.get(feature.key);
			const slider = element.querySelector('div');
 
			element.style.backgroundColor = currentState ? 'orange' : '#666';
			if (slider) {
			  slider.style.left = currentState ? '22px' : '2px';
			}
		  }
		});
	  } catch (error) {
		Utils.log(`Error updating toggle states: ${error.message}`, 'error');
	  }
	}
 
	cleanup() {
	  if (this.styleSheet) {
		this.styleSheet.remove();
	  }
	}
  }
  
  class ScrollToTop {
	scrollToTop() {
	  window.scrollTo({ top: 0, behavior: 'smooth' });
	}
  }
 
  // Main application controller with better error handling and organization
  class App {
	constructor() {
	  this.eventEmitter = new EventEmitter();
	  this.state = new StateManager(this.eventEmitter);
	  this.autoScroller = new AutoScroller(this.eventEmitter);
	  this.videoSorter = new VideoSorter(this.state);
	  this.videoHider = new VideoHider(this.state, this.videoSorter);
	  this.languageManager = new LanguageManager(this.state);
	  this.playlistManager = new PlaylistManager(this.eventEmitter);
	  this.scrollToTop = new ScrollToTop(this.eventEmitter);
	  this.menu = new MenuManager(this.state, this.eventEmitter, this.autoScroller, this.scrollToTop);
 
	  this.observer = null;
	  this.debouncedInitialize = Utils.debounce(
		this.initializeFeatures.bind(this), 
		CONFIG.TIMING.MUTATION_DEBOUNCE_MS
	  );
 
	  this.setupEventHandlers();
	  this.setupStateValidators();
	}
 
	setupStateValidators() {
	  const booleanKeys = [
		'sortWithinPlaylistsState', 'sortByTrophyState', 'sortByDurationState',
		'hideWatchedState', 'hidePaidContentState', 'redirectToEnglishState',
		'muteState', 'cursorHideState', 'menuShowState'
	  ];
 
	  booleanKeys.forEach(key => {
		this.state.addValidator(key, value => typeof value === 'boolean');
	  });
	}
 
	setupEventHandlers() {
	  this.eventEmitter.on('sortByTrophy', (forceIncludePlaylist = false) => {
		this.videoSorter.sortByTrophy(forceIncludePlaylist);
	  });
 
	  this.eventEmitter.on('sortByDuration', (forceIncludePlaylist = false) => {
		this.videoSorter.sortByDuration(forceIncludePlaylist);
	  });
 
	  this.eventEmitter.on('hideVideos', () => {
		this.videoHider.hideVideos();
	  });
 
	  this.eventEmitter.on('redirectToEnglish', () => {
		this.languageManager.redirectToEnglish();
	  });
 
	  this.eventEmitter.on('toggleCursorHide', () => {
		const enabled = this.state.get('cursorHideState');
		VideoPlayer.toggleCursorHide(enabled);
	  });
 
	  this.eventEmitter.on('stateChanged', ({ key, newValue }) => {
		Utils.log(`State changed: ${key} = ${newValue}`);
	  });
	}
 
	async init() {
	  try {
		Utils.log('Initializing application...');
 
		ElementHider.hideElements();
		this.languageManager.redirectToEnglish();
		
		const cursorHideEnabled = this.state.get('cursorHideState', true);
		VideoPlayer.toggleCursorHide(cursorHideEnabled);
 
		this.playlistManager.init();
		this.menu.create();
 
		setTimeout(() => {
		  this.initializeFeatures();
		}, 100);
 
		this.setupObserver();
		this.setupEventListeners();
 
		Utils.log('Application initialized successfully');
	  } catch (error) {
		Utils.log(`Error during initialization: ${error.message}`, 'error');
	  }
	}
 
	initializeFeatures() {
	  try {
		if (this.state.get('sortByTrophyState')) {
		  this.videoSorter.sortByTrophy();
		}
 
		if (this.state.get('sortByDurationState')) {
		  this.videoSorter.sortByDuration();
		}
 
		if (this.state.get('hideWatchedState') || this.state.get('hidePaidContentState')) {
		  this.videoHider.hideVideos();
		}
 
		if (this.state.get('muteState')) {
		  VideoPlayer.mute();
		}
 
		Utils.log('Features initialized');
	  } catch (error) {
		Utils.log(`Error initializing features: ${error.message}`, 'error');
	  }
	}
 
	setupObserver() {
	  try {
		if (this.observer) {
		  this.observer.disconnect();
		}
		// Track initial state
		this.lastPageHeight = document.body.scrollHeight;
		this.lastVideoCount = this.getVideoCount();
		this.observer = new MutationObserver(Utils.throttle((mutations) => {
		  if (this.shouldProcessMutations(mutations)) {
			this.debouncedInitialize();
		  }
		}, 1000)); // Increased throttle to 1000ms
		this.observer.observe(document.body, {
		  childList: true,
		  subtree: true,
		  attributes: false,
		  characterData: false
		});
		Utils.log('Optimized DOM observer setup complete');
	  } catch (error) {
		Utils.log(`Error setting up observer: ${error.message}`, 'error');
	  }
	}
	
	// Add these new methods to the App class:
	getVideoCount() {
	  try {
		return Utils.safeQuerySelectorAll('li').filter(li => 
		  li.querySelector('.duration') || li.querySelector('a[href*="/view_video"]')
		).length;
	  } catch (error) {
		return 0;
	  }
	}
	
	shouldProcessMutations(mutations) {
	  // Check if page height increased significantly (new content loaded)
	  const currentPageHeight = document.body.scrollHeight;
	  const heightChanged = currentPageHeight > this.lastPageHeight + 100; // 100px threshold
	  
	  // Check if new video items were added
	  const currentVideoCount = this.getVideoCount();
	  const videosAdded = currentVideoCount > this.lastVideoCount;
	  
	  // Check for direct LI additions to video containers or new video containers
	  const hasNewLiElements = mutations.some(mutation => {
		if (mutation.type !== 'childList') return false;
		
		// Check if mutation target is a video list container and LI was added directly
		const target = mutation.target;
		if (target && target.matches && target.matches(CONFIG.SELECTORS.VIDEO_LISTS)) {
		  return Array.from(mutation.addedNodes).some(node => 
			node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI'
		  );
		}
		
		// Check if new video containers were added to the page
		return Array.from(mutation.addedNodes).some(node => {
		  if (node.nodeType !== Node.ELEMENT_NODE) return false;
		  
		  const element = node;
		  return element.matches && element.matches(CONFIG.SELECTORS.VIDEO_LISTS);
		});
	  });
	  
	  // Update tracked values if changes detected
	  if (heightChanged || videosAdded || hasNewLiElements) {
		this.lastPageHeight = currentPageHeight;
		this.lastVideoCount = currentVideoCount;
		
		Utils.log(`Observer triggered: height=${heightChanged}, videos=${videosAdded}, newLi=${hasNewLiElements}`);
		return true;
	  }
	  
	  return false;
	}
 
	setupEventListeners() {
	  document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') {
		  Utils.log('Tab is visible, syncing states...');
		  
		  try {
			this.state.clearCache();
			this.menu.updateToggleStates();
			this.menu.syncVisibility();
			
			setTimeout(() => this.initializeFeatures(), 100);
		  } catch (error) {
			Utils.log(`Error syncing states: ${error.message}`, 'error');
		  }
		}
	  });
 
	  window.addEventListener('beforeunload', () => {
		if (this.observer) {
		  this.observer.disconnect();
		}
		if (this.autoScroller.isRunning) {
		  this.autoScroller.stop();
		}
	  });
 
	  window.addEventListener('error', (event) => {
		if (event.filename?.includes('Pornhub Pro-ish')) {
		  Utils.log(`Global error: ${event.message}`, 'error');
		}
	  });
	}
 
	cleanup() {
	  try {
		if (this.observer) {
		  this.observer.disconnect();
		  this.observer = null;
		}
 
		if (this.autoScroller.isRunning) {
		  this.autoScroller.stop();
		}
 
		if (this.menu) {
		  this.menu.cleanup();
		}
 
		this.eventEmitter.events = {};
 
		Utils.log('Cleanup completed');
	  } catch (error) {
		Utils.log(`Error during cleanup: ${error.message}`, 'error');
	  }
	}
  }
 
  // Application initialization with proper error handling
  function initializeApp() {
	try {
	  const app = new App();
 
	  if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => app.init());
	  } else {
		app.init();
	  }
 
	  window.PornhubProApp = app;
  
		 //extra run of hiding divs, for content that spawns later
		window.addEventListener('load', () => {
			setTimeout(() => {
			ElementHider.hideElements();
			}, 500); // wait 500ms after load
		});
	} catch (error) {
	  console.error(`${CONFIG.SCRIPT_NAME}: Fatal error during app creation:`, error);
	}
  }
 
  initializeApp();
 
})();

