// ==UserScript==
// @name        Local time for LOR
// @name:en     Local time for LOR
// @description:ru Местное время для Linux.Org.ru
// @description:en Local time userscript for Linux.Org.Ru
// @namespace   https://maximov.space/userscripts
// @include     https://www.linux.org.ru/*
// @version     0.6.2
// @grant       none
// @description Местное время для Linux.Org.ru
// @downloadURL https://update.greasyfork.org/scripts/18078/Local%20time%20for%20LOR.user.js
// @updateURL https://update.greasyfork.org/scripts/18078/Local%20time%20for%20LOR.meta.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _date = __webpack_require__(1);

	var _dateFormat = __webpack_require__(3);

	var _schedule = __webpack_require__(5);

	var TABULAR_VIEW_RE = /^\/(forum\/\w+|notifications|tracker)\/?$/;

	function shortDates() {
	  return TABULAR_VIEW_RE.test(window.location.pathname);
	}

	var setLocalTime = function setLocalTime(elem) {
	  // Chromium-based browsers don't yet recognize HTMLTimeElement,
	  // so `dateTime` is undefined, then use `getAttribute` instead.
	  var time = elem.dateTime ? elem.dateTime : elem.getAttribute('datetime');
	  var date = new Date(time);

	  var update = function update(date) {
	    return elem.textContent = (0, _dateFormat.display)(date, _dateFormat.FORMAT.ELAPSED, { shortDates: shortDates() });
	  };

	  var scheduleUpdateDays = function scheduleUpdateDays() {
	    return (0, _schedule.schedule)(update, { stop: (0, _schedule.after)({ days: 2 }), every: { hours: 1 } }, date);
	  };
	  var scheduleUpdateMinutes = function scheduleUpdateMinutes() {
	    return (0, _schedule.schedule)(update, { stop: (0, _schedule.after)({ hours: 1 }), every: { seconds: 10 } }, date);
	  };

	  update(date);
	  elem.setAttribute('data-tooltip', (0, _dateFormat.display)(date, _dateFormat.FORMAT.EXACT));

	  if (!(0, _date.elapsed)(date, { hours: 1 })) {
	    scheduleUpdateMinutes().then(scheduleUpdateDays);
	  } else if (!(0, _date.elapsed)(date, { days: 2 })) {
	    scheduleUpdateDays();
	  }
	};

	var css = '\ntime[data-tooltip] {\n  border-bottom: 2px dotted grey;\n  cursor: pointer;\n}\ntime[data-tooltip]:hover {\n  position: relative;\n}\ntime[data-tooltip]:hover:after {\n  font-size: small;\n  content: attr(data-tooltip);\n  padding: 0.3em 0.5em;\n  color: #333;\n  position: absolute;\n  left: 2em;\n  top: 150%;\n  white-space: nowrap;\n  z-index: 20;\n  border-radius: 0.5em;\n  box-shadow: 0px 0px 4px #222;\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #eeeeee),color-stop(1, #cccccc));\n  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);\n}\n';

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	document.body.appendChild(style);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
	  for (var _iterator = document.querySelectorAll('time')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	    var time = _step.value;

	    setLocalTime(time);
	  }
	} catch (err) {
	  _didIteratorError = true;
	  _iteratorError = err;
	} finally {
	  try {
	    if (!_iteratorNormalCompletion && _iterator.return) {
	      _iterator.return();
	    }
	  } finally {
	    if (_didIteratorError) {
	      throw _iteratorError;
	    }
	  }
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.elapsed = exports.minutesElapsedSince = exports.sameDay = exports.yesterday = exports.getDay = exports.getMonth = exports.getYear = undefined;

	var _delay = __webpack_require__(2);

	var getYear = exports.getYear = function getYear(date) {
	  return date.getFullYear();
	};
	var getMonth = exports.getMonth = function getMonth(date) {
	  return date.getMonth() + 1;
	};
	var getDay = exports.getDay = function getDay(date) {
	  return date.getDate();
	};

	var yesterday = exports.yesterday = function yesterday(date) {
	  var newDate = new Date(date);
	  newDate.setDate(date.getDate() - 1);
	  return newDate;
	};

	var sameDay = exports.sameDay = function sameDay(date1, date2) {
	  return getYear(date1) === getYear(date2) && getMonth(date1) === getMonth(date2) && getDay(date1) === getDay(date2);
	};

	var minutesElapsedSince = exports.minutesElapsedSince = function minutesElapsedSince(date) {
	  var now = new Date();
	  var minutesDiff = (now - date) / _delay.FACTORS.minutes;
	  var roundingFunction = minutesDiff < 1 ? Math.ceil : Math.floor;
	  return roundingFunction(minutesDiff);
	};

	var elapsed = exports.elapsed = function elapsed(date, delay) {
	  return new Date() - date >= (0, _delay.translateDelay)(delay);
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var FACTORS = exports.FACTORS = {
	  millis: 1,
	  millisecond: 1,
	  milliseconds: 1,
	  seconds: 1000,
	  second: 1000,
	  minutes: 1000 * 60,
	  minute: 1000 * 60,
	  hours: 1000 * 60 * 60,
	  hour: 1000 * 60 * 60,
	  days: 1000 * 60 * 60 * 24,
	  day: 1000 * 60 * 60 * 24
	};
	var units = Object.keys(FACTORS);

	var translateDelay = exports.translateDelay = function translateDelay(delay) {
	  var translated = 0;
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = units[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var unit = _step.value;

	      var value = delay[unit] || 0;
	      translated += value * FACTORS[unit];
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return translated;
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.display = exports.displayMinutes = exports.displayDate = exports.FORMAT = undefined;

	var _util = __webpack_require__(4);

	var _date = __webpack_require__(1);

	var FORMAT = exports.FORMAT = {
	  EXACT: 'EXACT',
	  ELAPSED: 'ELAPSED'
	};

	var displayDate = exports.displayDate = function displayDate(date, format) {
	  var verbose = format === FORMAT.ELAPSED;

	  var year = (0, _date.getYear)(date).toString();
	  var month = (0, _util.zeroPad)((0, _date.getMonth)(date), 2);
	  var day = (0, _util.zeroPad)((0, _date.getDay)(date), 2);

	  var now = new Date();

	  var dateString = undefined;

	  if (verbose && (0, _date.sameDay)(date, now)) {
	    dateString = 'сегодня';
	  } else if (verbose && (0, _date.sameDay)(date, (0, _date.yesterday)(now))) {
	    dateString = 'вчера';
	  } else {
	    dateString = day + '.' + month + '.' + year;
	  }

	  return dateString;
	};

	var pluralizeMinutes = function pluralizeMinutes(minutes) {
	  var lastDigit = minutes % 10;

	  if (minutes >= 10 && minutes <= 20 || lastDigit == 0 || lastDigit >= 5) return "минут";
	  if (lastDigit == 1) return "минута";
	  return "минуты";
	};

	var displayMinutes = exports.displayMinutes = function displayMinutes(elapsedMinutes) {
	  if (elapsedMinutes === 1) {
	    return 'минуту назад';
	  }
	  var minutesString = pluralizeMinutes(elapsedMinutes);
	  return elapsedMinutes + ' ' + minutesString + ' назад';
	};

	var display = exports.display = function display(date, format) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? { shortDates: false } : arguments[2];

	  var verbose = format === FORMAT.ELAPSED;

	  if (verbose) {
	    var elapsedMinutes = (0, _date.minutesElapsedSince)(date);

	    if (elapsedMinutes < 60) {
	      return displayMinutes(elapsedMinutes);
	    }
	  }

	  var hour = (0, _util.zeroPad)(date.getHours(), 2);
	  var minute = (0, _util.zeroPad)(date.getMinutes(), 2);
	  var seconds = (0, _util.zeroPad)(date.getSeconds(), 2);

	  var dateString = displayDate(date, format);

	  dateString = dateString + ' ' + hour + ':' + minute;

	  if (!options.shortDates) {
	    dateString = dateString + ':' + seconds;
	  }

	  return dateString;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var zeroPad = exports.zeroPad = function zeroPad(num, places) {
	  var numString = num.toString();
	  var zero = places - numString.length + 1;
	  return Array(+(zero > 0 && zero)).join('0') + num;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.schedule = exports.after = undefined;

	var _delay = __webpack_require__(2);

	var _date = __webpack_require__(1);

	var after = exports.after = function after(delay) {
	  return function (date) {
	    return (0, _date.elapsed)(date, delay);
	  };
	};

	var schedule = exports.schedule = function schedule(action, options) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  options = options || {};

	  return new Promise(function (resolve, reject) {
	    if (!options.every) return reject(new Error('options.every not set'));
	    if (!options.stop) return reject(new Error('options.stop not set'));

	    if (typeof options.stop !== 'function') return reject(new Error('options.stop is not a function'));
	    if (_typeof(options.every) !== 'object') return reject(new Error('options.every is not an object'));

	    var interval = undefined;

	    interval = setInterval(function () {
	      var _options;

	      var result = action.apply(undefined, args);
	      if ((_options = options).stop.apply(_options, args)) {
	        clearInterval(interval);
	        return resolve(result);
	      }
	    }, (0, _delay.translateDelay)(options.every));
	  });
	};

/***/ }
/******/ ]);