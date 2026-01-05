// ==UserScript==
// @name          Humble Enhancer
// @author        Nathaniel Watson <nathaniel@nwatson.nz> (http://nwatson.nz)
// @namespace     http://www.nwatson.nz
// @description   Enhances Humble Bundle pages with additional info
// @license       https://github.com/nathanielw/humble-enhancer/blob/master/LICENSE
// @supportURL    https://github.com/nathanielw/humble-enhancer/issues
// @homepageURL   https://github.com/nathanielw/humble-enhancer
// @source        https://github.com/nathanielw/humble-enhancer
// @compatible    firefox
// @compatible    chrome
// @include       https://www.humblebundle.com/*
// @exclude       https://www.humblebundle.com/books*
// @exclude       https://www.humblebundle.com/monthly*
// @exclude       https://www.humblebundle.com/store*
// @version       0.3.0
// @grant         GM_xmlhttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_listValues
// @grant         GM_deleteValue
// @grant         GM_getResourceText
// @grant         GM_addStyle
// @connect       humblebundle.com
// @connect       cheapshark.com
// @connect       www.cheapshark.com
// @resource      style https://cdn.rawgit.com/nathanielw/humble-enhancer/v0.3.0/dist/style.css
// @downloadURL https://update.greasyfork.org/scripts/17343/Humble%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/17343/Humble%20Enhancer.meta.js
// ==/UserScript==
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _quantizer = require('./quantizer');

var _quantizer2 = _interopRequireDefault(_quantizer);

var _cheapshark = require('./cheapshark');

var Cheapshark = _interopRequireWildcard(_cheapshark);

var _htmlEscape = require('./util/html-escape');

var _htmlEscape2 = _interopRequireDefault(_htmlEscape);

var _constants = require('./constants');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var scoreQuantizer = new _quantizer2.default(40, 99, ['lowest', 'low', 'medium', 'high', 'highest']);

var BundleGameView = function () {
	function BundleGameView(element, model) {
		_classCallCheck(this, BundleGameView);

		this.element = element;
		this.model = model;
	}

	_createClass(BundleGameView, [{
		key: 'displayInfo',
		value: function displayInfo(storeManager) {
			var _this = this;

			var outer = this.element.querySelector('.table-wrapper');

			if (outer) {
				(function () {
					var buttonContainer = document.createElement('div');
					buttonContainer.className = 'he-button-container';
					buttonContainer.innerHTML = '\n\t\t\t\t<div class=\'he-button-container__group he-button-container__group--left\'>\n\t\t\t\t\t' + (_this.model.info.metacriticScore && _this.model.info.metacriticLink ? '<a class=\'he-info-button tooltip-top he-metacritic he-metacritic--' + scoreQuantizer.quantize(_this.model.info.metacriticScore) + '\'\n\t\t\t\t\t\t\tdata-tooltip=\'Metacritic score for ' + (0, _htmlEscape2.default)(_this.model.info.external) + '\'\n\t\t\t\t\t\t\thref=\'http://www.metacritic.com' + _this.model.info.metacriticLink + '\'>\n\t\t\t\t\t\t' + _this.model.info.metacriticScore + '\n\t\t\t\t\t\t</a>' : '') + '\n\t\t\t\t</div>\n\t\t\t\t<div class=\'he-button-container__group he-button-container__group--right\'>\n\t\t\t\t\t' + (_this.model.steamLink ? '<a class=\'he-info-button\' href=\'' + _this.model.steamLink + '\'>\n\t\t\t\t\t\t\t<i class=\'fa fa-steam\'></i>\n\t\t\t\t\t\t</a>' : '') + '\n\t\t\t\t\t<span class=\'he-info-button he-info-button--price he-tooltipped\'>\n\t\t\t\t\t\t<i class=\'fa fa-usd\'></i>\n\t\t\t\t\t\t<div class=\'he-tooltip he-tooltip--medium\'>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</span>\n\t\t\t\t</div>';

					var priceButton = buttonContainer.querySelector('.he-info-button--price');
					var priceTooltip = priceButton.querySelector('.he-tooltip');

					if (_this.model.deals) {
						_this._createTooltip(priceTooltip, storeManager);
					} else {
						(function () {
							var hoverHandler = function hoverHandler() {
								priceButton.removeEventListener('mouseover', hoverHandler);
								priceTooltip.innerHTML = '<div class="he-tooltip__inner">Loading deals...</div>';
								Cheapshark.deals({ title: _this.model.info.external, exact: 1 }, function (err, dealsData) {
									if (!err && dealsData.length > 0) {
										_this.model.deals = dealsData;
										_this._createTooltip(priceTooltip, storeManager);
									} else {
										priceTooltip.innerHTML = '<div class="he-tooltip__inner">No deals found</div>';
									}
								});
							};

							priceButton.addEventListener('mouseover', hoverHandler);
						})();
					}

					outer.insertBefore(buttonContainer, outer.firstChild);
				})();
			}
		}
	}, {
		key: '_createTooltip',
		value: function _createTooltip(tooltipEl, storeManager) {
			var self = this;

			tooltipEl.innerHTML = '\n\t\t\t<div class=\'he-tooltip__inner\'>\n\t\t\t\t<h3 class=\'he-tooltip__title\'>External Prices</h3>\n\t\t\t\t<span class=\'he-tooltip__subtitle\'>' + this.model.info.external + '</span>\n\t\t\t</div>\n\t\t\t<div class=\'he-price-list\'>\n\t\t\t\t' + function () {
				var list = '';

				for (var i = 0; i < self.model.deals.length; i++) {
					var deal = self.model.deals[i];
					var store = storeManager.getStore(parseInt(deal.storeID));

					if (store) {
						list += '\n\t\t\t\t\t\t\t\t<a class=\'he-price-list__item\' href=' + (_constants.DEAL_BASE + deal.dealID) + '>\n\t\t\t\t\t\t\t\t\t<span class=\'he-price-list__cell\'>\n\t\t\t\t\t\t\t\t\t\t<img src=\'//cheapshark.com/' + (0, _htmlEscape2.default)(store.images.icon) + '\' />\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\'he-price-list__cell\'>\n\t\t\t\t\t\t\t\t\t\t' + (0, _htmlEscape2.default)(store.storeName) + '\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\'he-price-list__cell he-price-list__cell--right\'>\n\t\t\t\t\t\t\t\t\t\t$' + deal.salePrice + '\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</a>';
					}
				}
				return list;
			}() + '\n\t\t\t</div>\n\t\t';
		}
	}]);

	return BundleGameView;
}();

exports.default = BundleGameView;
},{"./cheapshark":3,"./constants":4,"./quantizer":7,"./util/html-escape":9}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getValue = getValue;
exports.setValue = setValue;
exports.clearExpired = clearExpired;
exports.clearAll = clearAll;
exports.getLastCleared = getLastCleared;
var EXPIRY_PREFIX = 'expiry';
var LAST_CLEARED_KEY = 'lastcleared';

function getValue(type, id) {
	var value = GM_getValue(type + ':' + id);

	try {
		return JSON.parse(value);
	} catch (ex) {
		return value;
	}
}

function setValue(type, id, value, expiry) {
	if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
		value = JSON.stringify(value);
	}

	GM_setValue(formatKey(type, id), value);

	if (expiry !== undefined) {
		GM_setValue(formatKey(EXPIRY_PREFIX, formatKey(type, id)), expiry);
	}
}

function clearExpired() {
	var keys = GM_listValues();
	var now = Date.now();

	GM_setValue(LAST_CLEARED_KEY, now);

	keys.forEach(function (key) {
		if (key.lastIndexOf(EXPIRY_PREFIX, 0) === 0) {
			var expiry = GM_getValue(key);
			if (expiry <= now) {
				var mainKey = expiryKeyToKey(key);
				GM_deleteValue(mainKey);
			}
		}
	});
}

function clearAll() {
	GM_listValues().forEach(function (key) {
		GM_deleteValue(key);
	});
}

function getLastCleared() {
	var time = GM_getValue(LAST_CLEARED_KEY);

	if (time === undefined) {
		time = Date.now();
		GM_setValue(LAST_CLEARED_KEY, time);
	}

	return time;
}

function formatKey(type, id) {
	return type + ':' + id;
}

function expiryKeyToKey(expiryKey) {
	return expiryKey.substring(EXPIRY_PREFIX.length + 1);
}
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.games = games;
exports.deals = deals;
exports.stores = stores;

var _networkUtil = require('./util/network-util');

var net = _interopRequireWildcard(_networkUtil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var API_URL = 'http://www.cheapshark.com/api/1.0/';

function games(opts, callback) {
  sendGet('games', opts, callback);
}

function deals(opts, callback) {
  sendGet('deals', opts, callback);
}

function stores(callback) {
  sendGet('stores', null, callback);
}

function sendGet(endpoint, opts, callback) {
  net.httpGet(API_URL + endpoint, opts, responseHandler(callback), responseHandler(callback));
}

function responseHandler(callback) {
  return function (err, response) {
    if (err) {
      callback(err, null);
    } else {
      var data = JSON.parse(response);
      callback(null, data);
    }
  };
}
},{"./util/network-util":10}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SECONDS = exports.SECONDS = 1000;
var MINUTES = exports.MINUTES = 60000;
var HOURS = exports.HOURS = 3600000;
var DAYS = exports.DAYS = 8640000;

var DEAL_BASE = exports.DEAL_BASE = 'http://www.cheapshark.com/redirect.php?dealID=';
},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TITLE_REGEX = /[^a-zA-Z0-9\s]/g;
var STEAM_BASE = 'http://store.steampowered.com/app/';

var Game = function () {
	function Game(title) {
		_classCallCheck(this, Game);

		this.title = title;
		this.info = {};
	}

	_createClass(Game, [{
		key: 'setInfo',
		value: function setInfo(info) {
			for (var attr in info) {
				this.info[attr] = info[attr];
			}
		}
	}, {
		key: 'setMetacriticInfo',
		value: function setMetacriticInfo(score, link) {
			if (typeof score !== 'number') {
				throw Error('Invalid type: Metacritic score must be a number');
			}

			this.info.metacriticScore = score;
			this.info.metacriticLink = link;
		}
	}, {
		key: 'id',
		get: function get() {
			return this.title.replace(TITLE_REGEX, '');
		}
	}, {
		key: 'deals',
		set: function set(deals) {
			this._deals = deals.sort(function (a, b) {
				return parseFloat(a.salePrice) - parseFloat(b.salePrice);
			});
		},
		get: function get() {
			return this._deals;
		}
	}, {
		key: 'steamLink',
		set: function set(steamLink) {
			this.info.steamLink = steamLink;
		},
		get: function get() {
			if (this.info.steamAppID != null) {
				return STEAM_BASE + this.info.steamAppID;
			} else {
				return this.info.steamLink;
			}
		}
	}]);

	return Game;
}();

exports.default = Game;
},{}],6:[function(require,module,exports){
'use strict';

var _cheapshark = require('./cheapshark');

var Cheapshark = _interopRequireWildcard(_cheapshark);

var _cache = require('./cache');

var Cache = _interopRequireWildcard(_cache);

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

var _bundleGameView = require('./bundle-game-view');

var _bundleGameView2 = _interopRequireDefault(_bundleGameView);

var _storeManager = require('./store-manager');

var _storeManager2 = _interopRequireDefault(_storeManager);

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

var _updateTasks = require('./util/update-tasks');

var _updateTasks2 = _interopRequireDefault(_updateTasks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var TYPE_GAME = 'game';

function main() {
	(0, _updateTasks2.default)();
	cleanCache();
	GM_addStyle(GM_getResourceText('style'));

	var stores = new _storeManager2.default();
	stores.init(initGameInfo);
}

function initGameInfo(storeManager) {
	var games = findBundleGames();
	var expiry = Date.now() + Constants.DAYS * 14;

	games.forEach(function (g) {
		var gameInfo = Cache.getValue(TYPE_GAME, g.model.id);
		if (gameInfo !== undefined) {
			if (gameInfo !== null) {
				g.model.setInfo(gameInfo);
				g.displayInfo(storeManager);
			}
		} else {
			Cheapshark.games({ title: g.model.title, limit: 10, exact: 1 }, function (err, gamesData) {
				if (!err) {
					if (gamesData.length > 0) {
						g.model.setInfo(gamesData[0]);

						Cheapshark.deals({ title: g.model.info.external, exact: 1 }, function (err, dealsData) {
							if (!err && dealsData.length > 0) {
								g.model.deals = dealsData;

								var hasSteam = g.model.info.steamAppID != null;
								var hasMetacritic = false;

								for (var i = 0; i < dealsData.length && !(hasSteam && hasMetacritic); i++) {
									var deal = dealsData[i];

									if (!hasMetacritic && deal.metacriticLink && deal.metacriticScore) {
										g.model.setMetacriticInfo(parseInt(deal.metacriticScore), deal.metacriticLink);
										hasMetacritic = true;
									}

									if (!hasSteam && deal.storeID == 1) {
										g.model.steamLink = Constants.DEAL_BASE + deal.dealID;
										hasSteam = true;
									}
								}

								Cache.setValue(TYPE_GAME, g.model.id, g.model.info, expiry);
							} else {
								g.model.deals = [];
							}

							g.displayInfo(storeManager);
						});
					} else {
						Cache.setValue(TYPE_GAME, g.model.id, null, expiry);
					}
				}
			});
		}
	});
}

function cleanCache() {
	var now = Date.now();

	if (now - Cache.getLastCleared() >= Constants.DAYS) {
		Cache.clearExpired();
	}
}

function findBundleGames() {
	var gameEls = [].concat(_toConsumableArray(document.querySelectorAll('.promo-body .game-border:not(.charity) .game-boxes > li')));

	var gameList = gameEls.map(function (gameEl) {
		var titleEl = gameEl.querySelector('.game-description h2');

		if (titleEl !== null) {
			var title = titleEl.textContent.trim();

			var game = new _game2.default(title);
			return new _bundleGameView2.default(gameEl, game);
		} else {
			return null;
		}
	}).filter(function (game) {
		return game !== null;
	});

	return gameList;
}

main();
},{"./bundle-game-view":1,"./cache":2,"./cheapshark":3,"./constants":4,"./game":5,"./store-manager":8,"./util/update-tasks":11}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Quantizer = function () {
	function Quantizer(low, high, values) {
		_classCallCheck(this, Quantizer);

		this.low = low;
		this.high = high;
		this.values = values;
	}

	_createClass(Quantizer, [{
		key: 'quantize',
		value: function quantize(value) {
			var maxIndex = this.values.length - 1;
			var ratio = (value - this.low) / (this.high - this.low);
			var index = Math.ceil(ratio * this.values.length) - 1;
			index = Math.max(Math.min(index, maxIndex), 0);

			return this.values[index];
		}
	}]);

	return Quantizer;
}();

exports.default = Quantizer;
},{}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _cheapshark = require('./cheapshark');

var Cheapshark = _interopRequireWildcard(_cheapshark);

var _cache = require('./cache');

var Cache = _interopRequireWildcard(_cache);

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TYPE_STORES = 'stores';
var STORES_KEY = 'all-stores';

var StoreManager = function () {
	function StoreManager() {
		_classCallCheck(this, StoreManager);
	}

	_createClass(StoreManager, [{
		key: 'init',
		value: function init(callback) {
			var _this = this;

			var stores = Cache.getValue(TYPE_STORES, STORES_KEY);
			var expiry = Date.now() + Constants.DAYS * 14;

			if (stores !== undefined) {
				this._setStores(stores);
				callback(this);
			} else {
				Cheapshark.stores(function (err, data) {
					if (!err) {
						Cache.setValue(TYPE_STORES, STORES_KEY, data, expiry);
						_this._setStores(data);
					} else {
						_this._setStores([]);
					}

					callback(_this);
				});
			}
		}
	}, {
		key: '_setStores',
		value: function _setStores(stores) {
			var _this2 = this;

			this._storeDict = {};
			stores.forEach(function (store) {
				_this2._storeDict[store.storeID] = store;
			});
		}
	}, {
		key: 'getStore',
		value: function getStore(id) {
			if (this._storeDict === undefined) {
				throw Error('Store manager has not been initialised.');
			}

			return this._storeDict[id];
		}
	}]);

	return StoreManager;
}();

exports.default = StoreManager;
},{"./cache":2,"./cheapshark":3,"./constants":4}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = htmlEscape;
function htmlEscape(str) {
	return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;');
}
},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.httpGet = httpGet;
exports.queryStringify = queryStringify;
function httpGet(url, params, callback) {
	GM_xmlhttpRequest({
		url: url + '?' + queryStringify(params),
		method: 'GET',
		onload: responseHandler(callback),
		onerror: responseHandler(callback, true)
	});
}

function queryStringify(params) {
	var queryString = '';

	if (params) {
		queryString = Object.keys(params).reduce(function (a, k) {
			a.push(k + '=' + encodeURIComponent(params[k]));
			return a;
		}, []).join('&');
	}

	return queryString;
}

function responseHandler(callback, wasError) {
	return function (response) {
		if (wasError || response.status !== 200) {
			callback(new Error('Error communicating with server. ' + response.status + ' ' + response.statusText), null);
		} else {
			callback(null, response.responseText);
		}
	};
}
},{}],11:[function(require,module,exports){


'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = updateTasks;

var _cache = require('../cache');

var Cache = _interopRequireWildcard(_cache);

var _versionUtil = require('./version-util');

var VersionUtil = _interopRequireWildcard(_versionUtil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var TYPE_VERSION = 'version';
var ID_VERSION = 'installed';
var VERSION = '0.3.0';

function updateTasks() {
	var oldVersion = Cache.getValue(TYPE_VERSION, ID_VERSION);

	if (!oldVersion) {
		performTasks();
	} else {
		var oldMajor = VersionUtil.getMajorVersion(oldVersion);
		var newMajor = VersionUtil.getMajorVersion(VERSION);
		var oldMinor = VersionUtil.getMinorVersion(oldVersion);
		var newMinor = VersionUtil.getMinorVersion(VERSION);

		if (newMajor !== oldMajor || newMajor === 0 && oldMinor !== newMinor) {
			performTasks();
		}
	}
}

function performTasks() {
	Cache.clearAll();
	Cache.setValue(TYPE_VERSION, ID_VERSION, VERSION);
}
},{"../cache":2,"./version-util":12}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMajorVersion = getMajorVersion;
exports.getMinorVersion = getMinorVersion;
function getMajorVersion(verString) {
  return parseInt(verString.split('.')[0]);
}

function getMinorVersion(verString) {
  return parseInt(verString.split('.')[1]);
}
},{}]},{},[6]);
