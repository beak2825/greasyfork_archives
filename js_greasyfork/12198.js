// ==UserScript==
// @name        Popmundo Assistant
// @description Usability improvements for Popmundo, mainly focused on interactions between characters and navigation.
// @namespace   Dwergie
// @version     1.17.2
//
//
// @include     http://*.popmundo.com/
// @include     https://*.popmundo.com/World/*
// @exclude		https://*.popmundo.com/World/Popmundo.aspx/Setlist
//
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/sprintf/1.0.3/sprintf.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js
// @require     https://cdn.jsdelivr.net/npm/vue
//
// @resource	jqueryUICSS https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.css
//
// @run-at document-end
// @noframes
//
// @grant   GM_getValue
// @grant   GM_setValue
// @grant	GM_getResourceText
// @grant   GM_addStyle
// @grant   GM_deleteValue
// @grant   GM.getValue
// @grant   GM.setValue
// @grant	GM.getResourceText
// @grant   GM.addStyle
// @grant   GM.deleteValue
//
// @downloadURL https://update.greasyfork.org/scripts/12198/Popmundo%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/12198/Popmundo%20Assistant.meta.js
// ==/UserScript==
"use strict";

// Force SSL
if (location.protocol != 'https:') {
	location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

// Track performance & required for the minimum request delay
var start				= new Date();
var character			= null;
var autoInteractActive 	= null;

// External functions
function strtotime (text, now) {
    var parsed;var match;var today;var year;var date;var days;var ranges;var len;var times;var regex;var i;var fail = false;
    if (!text) {
      return fail
    }
    text = text.replace(/^\s+|\s+$/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/[\t\r\n]/g, '')
      .toLowerCase()
  
    var pattern = new RegExp([
      '^(\\d{1,4})',
      '([\\-\\.\\/:])',
      '(\\d{1,2})',
      '([\\-\\.\\/:])',
      '(\\d{1,4})',
      '(?:\\s(\\d{1,2}):(\\d{2})?:?(\\d{2})?)?',
      '(?:\\s([A-Z]+)?)?$'
    ].join(''))
    match = text.match(pattern)
  
    if (match && match[2] === match[4]) {
      if (match[1] > 1901) {
        switch (match[2]) {
          case '-':
            // YYYY-M-D
            if (match[3] > 12 || match[5] > 31) {
              return fail
            }
  
            return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
          case '.':
            // YYYY.M.D is not parsed by strtotime()
            return fail
          case '/':
            // YYYY/M/D
            if (match[3] > 12 || match[5] > 31) {
              return fail
            }
  
            return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        }
      } else if (match[5] > 1901) {
        switch (match[2]) {
          case '-':
            // D-M-YYYY
            if (match[3] > 12 || match[1] > 31) {
              return fail
            }
  
            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
          case '.':
            // D.M.YYYY
            if (match[3] > 12 || match[1] > 31) {
              return fail
            }
  
            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
          case '/':
            // M/D/YYYY
            if (match[1] > 12 || match[3] > 31) {
              return fail
            }
  
            return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        }
      } else {
        switch (match[2]) {
          case '-':
            // YY-M-D
            if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
              return fail
            }
  
            year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1]
            return new Date(year, parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
          case '.':
            // D.M.YY or H.MM.SS
            if (match[5] >= 70) {
              // D.M.YY
              if (match[3] > 12 || match[1] > 31) {
                return fail
              }
  
              return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
            }
            if (match[5] < 60 && !match[6]) {
              // H.MM.SS
              if (match[1] > 23 || match[3] > 59) {
                return fail
              }
  
              today = new Date()
              return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
              match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000
            }
  
            // invalid format, cannot be parsed
            return fail
          case '/':
            // M/D/YY
            if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
              return fail
            }
  
            year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5]
            return new Date(year, parseInt(match[1], 10) - 1, match[3],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
          case ':':
            // HH:MM:SS
            if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
              return fail
            }
  
            today = new Date()
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
            match[1] || 0, match[3] || 0, match[5] || 0) / 1000
        }
      }
    }
  
    // other formats and "now" should be parsed by Date.parse()
    if (text === 'now') {
      return now === null || isNaN(now)
        ? new Date().getTime() / 1000 | 0
        : now | 0
    }
    if (!isNaN(parsed = Date.parse(text))) {
      return parsed / 1000 | 0
    }
    // Browsers !== Chrome have problems parsing ISO 8601 date strings, as they do
    // not accept lower case characters, space, or shortened time zones.
    // Therefore, fix these problems and try again.
    // Examples:
    //   2015-04-15 20:33:59+02
    //   2015-04-15 20:33:59z
    //   2015-04-15t20:33:59+02:00
    pattern = new RegExp([
      '^([0-9]{4}-[0-9]{2}-[0-9]{2})',
      '[ t]',
      '([0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?)',
      '([\\+-][0-9]{2}(:[0-9]{2})?|z)'
    ].join(''))
    match = text.match(pattern)
    if (match) {
      // @todo: time zone information
      if (match[4] === 'z') {
        match[4] = 'Z'
      } else if (match[4].match(/^([+-][0-9]{2})$/)) {
        match[4] = match[4] + ':00'
      }
  
      if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
        return parsed / 1000 | 0
      }
    }
  
    date = now ? new Date(now * 1000) : new Date()
    days = {
      'sun': 0,
      'mon': 1,
      'tue': 2,
      'wed': 3,
      'thu': 4,
      'fri': 5,
      'sat': 6
    }
    ranges = {
      'yea': 'FullYear',
      'mon': 'Month',
      'day': 'Date',
      'hou': 'Hours',
      'min': 'Minutes',
      'sec': 'Seconds'
    }
  
    function lastNext (type, range, modifier) {
      var diff
      var day = days[range]
  
      if (typeof day !== 'undefined') {
        diff = day - date.getDay()
  
        if (diff === 0) {
          diff = 7 * modifier
        } else if (diff > 0 && type === 'last') {
          diff -= 7
        } else if (diff < 0 && type === 'next') {
          diff += 7
        }
  
        date.setDate(date.getDate() + diff)
      }
    }
  
    function process (val) {
      // @todo: Reconcile this with regex using \s, taking into account
      // browser issues with split and regexes
      var splt = val.split(' ')
      var type = splt[0]
      var range = splt[1].substring(0, 3)
      var typeIsNumber = /\d+/.test(type)
      var ago = splt[2] === 'ago'
      var num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1)
  
      if (typeIsNumber) {
        num *= parseInt(type, 10)
      }
  
      if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
        return date['set' + ranges[range]](date['get' + ranges[range]]() + num)
      }
  
      if (range === 'wee') {
        return date.setDate(date.getDate() + (num * 7))
      }
  
      if (type === 'next' || type === 'last') {
        lastNext(type, range, num)
      } else if (!typeIsNumber) {
        return false
      }
  
      return true
    }
  
    times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
      '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
      '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)'
    regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?'
  
    match = text.match(new RegExp(regex, 'gi'))
    if (!match) {
      return fail
    }
  
    for (i = 0, len = match.length; i < len; i++) {
      if (!process(match[i])) {
        return fail
      }
    }
  
	return (date.getTime() / 1000)
}

// V2
let load = function(key, defaultVal) {
	return GM_getValue(key, defaultVal);
};

let save = function(key, val) {
	GM_setValue(key, val);
};

let app = {
	interval: 1000,
	enableDebug: false,

	tick: 0,

	parsers: {},
	modules: {},
	windows: {},

	settings: {
		get: function(key) {
			return localStorage.getItem(key);
		},
		set: function(key, val) {
			localStorage.setItem(key, val);
		}
	},

	activeWindow: null,

	userData: {},

	load: function(key, defaultVal) {
		let val = GM_getValue(key, null);

		if (val === null) {
			val = defaultVal;
		} else {
			val = JSON.parse(val);
		}

		return val;
	},

	save: function(key, val) {
		val = JSON.stringify(val);
		GM_setValue(key, val);
	},

	debug: function(message, level) {
		if (!this.enableDebug) {
			return;
		}

		if (typeof level === 'undefined') {
			level = 'DEBUG';
		}

		console.log('[' + level + '] ' + message);
	},

	start: function() {
		this.debug("Starting Assistant...");
		this.insertBar();

		enable_api = this.load('enable_api', null);

		if (enable_api === null) {
			this.save('enable_api', true);
		}
	},

	insertBar: function() {
		let assistant = this;

		document.querySelector('body').insertAdjacentHTML('beforeend', `
			<div id="assistant-app">
				<button type="button" title="Toggle sidebar" @click="toggleSidebar()">Hide Sidebar</button>
			</div>
		`);

		new Vue({
			el: '#assistant-app',
			data: {
				assistant: assistant,
			},
			methods: {
				toggleSidebar: function() {
					if (assistant.settings.get('hideSidebar') == 1) {
						assistant.settings.set('hideSidebar', 0);
						assistant.legacyRenderSidebar();
					} else {
						assistant.settings.set('hideSidebar', 1);
						assistant.legacyRenderSidebar();
					}
				}
			}
		});
	},

	legacyRenderSidebar: function() {
		setTimeout(function() {insertStatus(), 100});
	}
};

setTimeout(function() {
	app.start();
}, 10);

// Fix for spoilers
unsafeWindow.showSpoiler = function(a) {
  document.getElementById("spoilshow_" + a).classList.add("hidden");
  document.getElementById("spoilhid_" + a).classList.remove("hidden");
};

// Fix for read more
unsafeWindow.showHide = function(id) {
	
	document.getElementById(id).classList.remove("hidden");
	document.getElementById(id).previousSibling.classList.add("hidden");
};

// Disable checking of notifications while auto-interact is active
// This lightens the load on popmundo by removing 2 ajax calls on each page
if (isAutoInteractActive()) {
	unsafeWindow.checkServerDown = function() {};
	unsafeWindow.checkNotificationCount = function() {};
}

// Show notification count in the title bar
var originalTitle	= window.document.title;
var gameBaseURL     = location.origin;

// Locale settings
var localization = {
	lang: 'en-us',
	dateformat: 'DD-MM-YYYY'
}

var dictionaryStrings = {
	'en-us': {
		gender: {
			gender: 'Gender',
			m: 'Male',
			f: 'Female',
			he: 'He',
			she: 'She',
			him: 'Him',
			her: 'Her',
		}
	},
};

// More easily accessible dictionary containing strings for the active language
var dictionary = dictionaryStrings[localization.lang];

// Sound settings
var previousNotificationCount = -1;
var enableNotificationSound = load('enableNotificationSound', false);

$("#top-menu-notifications-num").bind("DOMSubtreeModified", function() {
	var count = parseInt($(this).text());

	if (count > 0) {
		window.document.title = "(" + count.toString() + ") " + originalTitle;
	} else {
		window.document.title = originalTitle;
	}

	previousNotificationCount = count;

});

var showSpoilerFix = function(spoilerId)
{
	$('#spoilhid_' + spoilerId).removeClass('hidden');
}

$('blockquote.spoiler > a').click(function() {
	var spoilId = $(this).attr('href').split('\'')[1];
	showSpoilerFix(spoilId);
});

// Inject MissingO stylesheets
GM_addStyle("table {   border-collapse: collapse;   border-spacing: 0; } td, th {   padding: 0; } table {   max-width: 100%;   background-color: transparent; } th {   text-align: left; } .table {   width: 100%;   margin-bottom: 20px; } .table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td, .table > tbody > tr > td, .table > tfoot > tr > td {   padding: 8px;   line-height: 1.42857143;   vertical-align: top;   border-top: 1px solid #dddddd; } .table > thead > tr > th {   vertical-align: bottom;   border-bottom: 2px solid #dddddd; } .table > caption + thead > tr:first-child > th, .table > colgroup + thead > tr:first-child > th, .table > thead:first-child > tr:first-child > th, .table > caption + thead > tr:first-child > td, .table > colgroup + thead > tr:first-child > td, .table > thead:first-child > tr:first-child > td {   border-top: 0; } .table > tbody + tbody {   border-top: 2px solid #dddddd; } .table .table {   background-color: #ffffff; } .table-condensed > thead > tr > th, .table-condensed > tbody > tr > th, .table-condensed > tfoot > tr > th, .table-condensed > thead > tr > td, .table-condensed > tbody > tr > td, .table-condensed > tfoot > tr > td {   padding: 5px; } .table-bordered {   border: 1px solid #dddddd; } .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {   border: 1px solid #dddddd; } .table-bordered > thead > tr > th, .table-bordered > thead > tr > td {   border-bottom-width: 2px; } .table-striped > tbody > tr:nth-child(odd) > td, .table-striped > tbody > tr:nth-child(odd) > th {   background-color: #f9f9f9; } .table-hover > tbody > tr:hover > td, .table-hover > tbody > tr:hover > th {   background-color: #f5f5f5; } table col[class*='col-'] {   position: static;   float: none;   display: table-column; } table td[class*='col-'], table th[class*='col-'] {   position: static;   float: none;   display: table-cell; } .table > thead > tr > td.active, .table > tbody > tr > td.active, .table > tfoot > tr > td.active, .table > thead > tr > th.active, .table > tbody > tr > th.active, .table > tfoot > tr > th.active, .table > thead > tr.active > td, .table > tbody > tr.active > td, .table > tfoot > tr.active > td, .table > thead > tr.active > th, .table > tbody > tr.active > th, .table > tfoot > tr.active > th {   background-color: #f5f5f5; } .table-hover > tbody > tr > td.active:hover, .table-hover > tbody > tr > th.active:hover, .table-hover > tbody > tr.active:hover > td, .table-hover > tbody > tr.active:hover > th {   background-color: #e8e8e8; } .table > thead > tr > td.success, .table > tbody > tr > td.success, .table > tfoot > tr > td.success, .table > thead > tr > th.success, .table > tbody > tr > th.success, .table > tfoot > tr > th.success, .table > thead > tr.success > td, .table > tbody > tr.success > td, .table > tfoot > tr.success > td, .table > thead > tr.success > th, .table > tbody > tr.success > th, .table > tfoot > tr.success > th {   background-color: #dff0d8; } .table-hover > tbody > tr > td.success:hover, .table-hover > tbody > tr > th.success:hover, .table-hover > tbody > tr.success:hover > td, .table-hover > tbody > tr.success:hover > th {   background-color: #d0e9c6; } .table > thead > tr > td.info, .table > tbody > tr > td.info, .table > tfoot > tr > td.info, .table > thead > tr > th.info, .table > tbody > tr > th.info, .table > tfoot > tr > th.info, .table > thead > tr.info > td, .table > tbody > tr.info > td, .table > tfoot > tr.info > td, .table > thead > tr.info > th, .table > tbody > tr.info > th, .table > tfoot > tr.info > th {   background-color: #d9edf7; } .table-hover > tbody > tr > td.info:hover, .table-hover > tbody > tr > th.info:hover, .table-hover > tbody > tr.info:hover > td, .table-hover > tbody > tr.info:hover > th {   background-color: #c4e3f3; } .table > thead > tr > td.warning, .table > tbody > tr > td.warning, .table > tfoot > tr > td.warning, .table > thead > tr > th.warning, .table > tbody > tr > th.warning, .table > tfoot > tr > th.warning, .table > thead > tr.warning > td, .table > tbody > tr.warning > td, .table > tfoot > tr.warning > td, .table > thead > tr.warning > th, .table > tbody > tr.warning > th, .table > tfoot > tr.warning > th {   background-color: #fcf8e3; } .table-hover > tbody > tr > td.warning:hover, .table-hover > tbody > tr > th.warning:hover, .table-hover > tbody > tr.warning:hover > td, .table-hover > tbody > tr.warning:hover > th {   background-color: #faf2cc; } .table > thead > tr > td.danger, .table > tbody > tr > td.danger, .table > tfoot > tr > td.danger, .table > thead > tr > th.danger, .table > tbody > tr > th.danger, .table > tfoot > tr > th.danger, .table > thead > tr.danger > td, .table > tbody > tr.danger > td, .table > tfoot > tr.danger > td, .table > thead > tr.danger > th, .table > tbody > tr.danger > th, .table > tfoot > tr.danger > th {   background-color: #f2dede; } .table-hover > tbody > tr > td.danger:hover, .table-hover > tbody > tr > th.danger:hover, .table-hover > tbody > tr.danger:hover > td, .table-hover > tbody > tr.danger:hover > th {   background-color: #ebcccc; } .btn {   display: inline-block;   margin-bottom: 0;   font-weight: normal;   text-align: center;   vertical-align: middle;   cursor: pointer;   background-image: none;   border: 1px solid transparent;   white-space: nowrap;   padding: 6px 12px;   font-size: 14px;   line-height: 1.42857143;   border-radius: 4px;   -webkit-user-select: none;   -moz-user-select: none;   -ms-user-select: none;   user-select: none; } .btn:focus, .btn:active:focus, .btn.active:focus {   outline: thin dotted;   outline: 5px auto -webkit-focus-ring-color;   outline-offset: -2px; } .btn:hover, .btn:focus {   color: #333333;   text-decoration: none; } .btn:active, .btn.active {   outline: 0;   background-image: none;   -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);   box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); } .btn.disabled, .btn[disabled], fieldset[disabled] .btn {   cursor: not-allowed;   pointer-events: none;   opacity: 0.65;   filter: alpha(opacity=65);   -webkit-box-shadow: none;   box-shadow: none; } .btn-default {   color: #333333;   background-color: #ffffff;   border-color: #cccccc; } .btn-default:hover, .btn-default:focus, .btn-default:active, .btn-default.active, .open .dropdown-toggle.btn-default {   color: #333333;   background-color: #ebebeb;   border-color: #adadad; } .btn-default:active, .btn-default.active, .open .dropdown-toggle.btn-default {   background-image: none; } .btn-default.disabled, .btn-default[disabled], fieldset[disabled] .btn-default, .btn-default.disabled:hover, .btn-default[disabled]:hover, fieldset[disabled] .btn-default:hover, .btn-default.disabled:focus, .btn-default[disabled]:focus, fieldset[disabled] .btn-default:focus, .btn-default.disabled:active, .btn-default[disabled]:active, fieldset[disabled] .btn-default:active, .btn-default.disabled.active, .btn-default[disabled].active, fieldset[disabled] .btn-default.active {   background-color: #ffffff;   border-color: #cccccc; } .btn-default .badge {   color: #ffffff;   background-color: #333333; } .btn-primary {   color: #ffffff;   background-color: #428bca;   border-color: #357ebd; } .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open .dropdown-toggle.btn-primary {   color: #ffffff;   background-color: #3276b1;   border-color: #285e8e; } .btn-primary:active, .btn-primary.active, .open .dropdown-toggle.btn-primary {   background-image: none; } .btn-primary.disabled, .btn-primary[disabled], fieldset[disabled] .btn-primary, .btn-primary.disabled:hover, .btn-primary[disabled]:hover, fieldset[disabled] .btn-primary:hover, .btn-primary.disabled:focus, .btn-primary[disabled]:focus, fieldset[disabled] .btn-primary:focus, .btn-primary.disabled:active, .btn-primary[disabled]:active, fieldset[disabled] .btn-primary:active, .btn-primary.disabled.active, .btn-primary[disabled].active, fieldset[disabled] .btn-primary.active {   background-color: #428bca;   border-color: #357ebd; } .btn-primary .badge {   color: #428bca;   background-color: #ffffff; } .btn-success {   color: #ffffff;   background-color: #5cb85c;   border-color: #4cae4c; } .btn-success:hover, .btn-success:focus, .btn-success:active, .btn-success.active, .open .dropdown-toggle.btn-success {   color: #ffffff;   background-color: #47a447;   border-color: #398439; } .btn-success:active, .btn-success.active, .open .dropdown-toggle.btn-success {   background-image: none; } .btn-success.disabled, .btn-success[disabled], fieldset[disabled] .btn-success, .btn-success.disabled:hover, .btn-success[disabled]:hover, fieldset[disabled] .btn-success:hover, .btn-success.disabled:focus, .btn-success[disabled]:focus, fieldset[disabled] .btn-success:focus, .btn-success.disabled:active, .btn-success[disabled]:active, fieldset[disabled] .btn-success:active, .btn-success.disabled.active, .btn-success[disabled].active, fieldset[disabled] .btn-success.active {   background-color: #5cb85c;   border-color: #4cae4c; } .btn-success .badge {   color: #5cb85c;   background-color: #ffffff; } .btn-info {   color: #ffffff;   background-color: #5bc0de;   border-color: #46b8da; } .btn-info:hover, .btn-info:focus, .btn-info:active, .btn-info.active, .open .dropdown-toggle.btn-info {   color: #ffffff;   background-color: #39b3d7;   border-color: #269abc; } .btn-info:active, .btn-info.active, .open .dropdown-toggle.btn-info {   background-image: none; } .btn-info.disabled, .btn-info[disabled], fieldset[disabled] .btn-info, .btn-info.disabled:hover, .btn-info[disabled]:hover, fieldset[disabled] .btn-info:hover, .btn-info.disabled:focus, .btn-info[disabled]:focus, fieldset[disabled] .btn-info:focus, .btn-info.disabled:active, .btn-info[disabled]:active, fieldset[disabled] .btn-info:active, .btn-info.disabled.active, .btn-info[disabled].active, fieldset[disabled] .btn-info.active {   background-color: #5bc0de;   border-color: #46b8da; } .btn-info .badge {   color: #5bc0de;   background-color: #ffffff; } .btn-warning {   color: #ffffff;   background-color: #f0ad4e;   border-color: #eea236; } .btn-warning:hover, .btn-warning:focus, .btn-warning:active, .btn-warning.active, .open .dropdown-toggle.btn-warning {   color: #ffffff;   background-color: #ed9c28;   border-color: #d58512; } .btn-warning:active, .btn-warning.active, .open .dropdown-toggle.btn-warning {   background-image: none; } .btn-warning.disabled, .btn-warning[disabled], fieldset[disabled] .btn-warning, .btn-warning.disabled:hover, .btn-warning[disabled]:hover, fieldset[disabled] .btn-warning:hover, .btn-warning.disabled:focus, .btn-warning[disabled]:focus, fieldset[disabled] .btn-warning:focus, .btn-warning.disabled:active, .btn-warning[disabled]:active, fieldset[disabled] .btn-warning:active, .btn-warning.disabled.active, .btn-warning[disabled].active, fieldset[disabled] .btn-warning.active {   background-color: #f0ad4e;   border-color: #eea236; } .btn-warning .badge {   color: #f0ad4e;   background-color: #ffffff; } .btn-danger {   color: #ffffff;   background-color: #d9534f;   border-color: #d43f3a; } .btn-danger:hover, .btn-danger:focus, .btn-danger:active, .btn-danger.active, .open .dropdown-toggle.btn-danger {   color: #ffffff;   background-color: #d2322d;   border-color: #ac2925; } .btn-danger:active, .btn-danger.active, .open .dropdown-toggle.btn-danger {   background-image: none; } .btn-danger.disabled, .btn-danger[disabled], fieldset[disabled] .btn-danger, .btn-danger.disabled:hover, .btn-danger[disabled]:hover, fieldset[disabled] .btn-danger:hover, .btn-danger.disabled:focus, .btn-danger[disabled]:focus, fieldset[disabled] .btn-danger:focus, .btn-danger.disabled:active, .btn-danger[disabled]:active, fieldset[disabled] .btn-danger:active, .btn-danger.disabled.active, .btn-danger[disabled].active, fieldset[disabled] .btn-danger.active {   background-color: #d9534f;   border-color: #d43f3a; } .btn-danger .badge {   color: #d9534f;   background-color: #ffffff; } .btn-link {   color: #428bca;   font-weight: normal;   cursor: pointer;   border-radius: 0; } .btn-link, .btn-link:active, .btn-link[disabled], fieldset[disabled] .btn-link {   background-color: transparent;   -webkit-box-shadow: none;   box-shadow: none; } .btn-link, .btn-link:hover, .btn-link:focus, .btn-link:active {   border-color: transparent; } .btn-link:hover, .btn-link:focus {   color: #2a6496;   text-decoration: underline;   background-color: transparent; } .btn-link[disabled]:hover, fieldset[disabled] .btn-link:hover, .btn-link[disabled]:focus, fieldset[disabled] .btn-link:focus {   color: #999999;   text-decoration: none; } .btn-lg, .btn-group-lg > .btn {   padding: 10px 16px;   font-size: 18px;   line-height: 1.33;   border-radius: 6px; } .btn-sm, .btn-group-sm > .btn {   padding: 5px 10px;   font-size: 12px;   line-height: 1.5;   border-radius: 3px; } .btn-xs, .btn-group-xs > .btn {   padding: 1px 5px;   font-size: 12px;   line-height: 1.5;   border-radius: 3px; } .btn-block {   display: block;   width: 100%;   padding-left: 0;   padding-right: 0; } .btn-block + .btn-block {   margin-top: 5px; } input[type='submit'].btn-block, input[type='reset'].btn-block, input[type='button'].btn-block {   width: 100%; } .btn-group, .btn-group-vertical {   position: relative;   display: inline-block;   vertical-align: middle; } .btn-group > .btn, .btn-group-vertical > .btn {   position: relative;   float: left; } .btn-group > .btn:hover, .btn-group-vertical > .btn:hover, .btn-group > .btn:focus, .btn-group-vertical > .btn:focus, .btn-group > .btn:active, .btn-group-vertical > .btn:active, .btn-group > .btn.active, .btn-group-vertical > .btn.active {   z-index: 2; } .btn-group > .btn:focus, .btn-group-vertical > .btn:focus {   outline: none; } .btn-group .btn + .btn, .btn-group .btn + .btn-group, .btn-group .btn-group + .btn, .btn-group .btn-group + .btn-group {   margin-left: -1px; } .btn-toolbar {   margin-left: -5px; } .btn-toolbar .btn-group, .btn-toolbar .input-group {   float: left; } .btn-toolbar > .btn, .btn-toolbar > .btn-group, .btn-toolbar > .input-group {   margin-left: 5px; } .btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {   border-radius: 0; } .btn-group > .btn:first-child {   margin-left: 0; } .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {   border-bottom-right-radius: 0;   border-top-right-radius: 0; } .btn-group > .btn:last-child:not(:first-child), .btn-group > .dropdown-toggle:not(:first-child) {   border-bottom-left-radius: 0;   border-top-left-radius: 0; } .btn-group > .btn-group {   float: left; } .btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {   border-radius: 0; } .btn-group > .btn-group:first-child > .btn:last-child, .btn-group > .btn-group:first-child > .dropdown-toggle {   border-bottom-right-radius: 0;   border-top-right-radius: 0; } .btn-group > .btn-group:last-child > .btn:first-child {   border-bottom-left-radius: 0;   border-top-left-radius: 0; } .btn-group .dropdown-toggle:active, .btn-group.open .dropdown-toggle {   outline: 0; } .btn-group > .btn + .dropdown-toggle {   padding-left: 8px;   padding-right: 8px; } .btn-group > .btn-lg + .dropdown-toggle {   padding-left: 12px;   padding-right: 12px; } .btn-group.open .dropdown-toggle {   -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);   box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); } .btn-group.open .dropdown-toggle.btn-link {   -webkit-box-shadow: none;   box-shadow: none; } .btn .caret {   margin-left: 0; } .btn-lg .caret {   border-width: 5px 5px 0;   border-bottom-width: 0; } .dropup .btn-lg .caret {   border-width: 0 5px 5px; } .btn-group-vertical > .btn, .btn-group-vertical > .btn-group, .btn-group-vertical > .btn-group > .btn {   display: block;   float: none;   width: 100%;   max-width: 100%; } .btn-group-vertical > .btn-group > .btn {   float: none; } .btn-group-vertical > .btn + .btn, .btn-group-vertical > .btn + .btn-group, .btn-group-vertical > .btn-group + .btn, .btn-group-vertical > .btn-group + .btn-group {   margin-top: -1px;   margin-left: 0; } .btn-group-vertical > .btn:not(:first-child):not(:last-child) {   border-radius: 0; } .btn-group-vertical > .btn:first-child:not(:last-child) {   border-top-right-radius: 4px;   border-bottom-right-radius: 0;   border-bottom-left-radius: 0; } .btn-group-vertical > .btn:last-child:not(:first-child) {   border-bottom-left-radius: 4px;   border-top-right-radius: 0;   border-top-left-radius: 0; } .btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {   border-radius: 0; } .btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child, .btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {   border-bottom-right-radius: 0;   border-bottom-left-radius: 0; } .btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {   border-top-right-radius: 0;   border-top-left-radius: 0; } .btn-group-justified {   display: table;   width: 100%;   table-layout: fixed;   border-collapse: separate; } .btn-group-justified > .btn, .btn-group-justified > .btn-group {   float: none;   display: table-cell;   width: 1%; } .btn-group-justified > .btn-group .btn {   width: 100%; } [data-toggle='buttons'] > .btn > input[type='radio'], [data-toggle='buttons'] > .btn > input[type='checkbox'] {   display: none; } @-webkit-keyframes progress-bar-stripes {   from {     background-position: 40px 0;   }   to {     background-position: 0 0;   } } @keyframes progress-bar-stripes {   from {     background-position: 40px 0;   }   to {     background-position: 0 0;   } } .progress {   overflow: hidden;   height: 20px;   margin-bottom: 20px;   background-color: #f5f5f5;   border-radius: 4px;   -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);   box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); } .progress-bar {   float: left;   width: 0%;   height: 100%;   font-size: 12px;   line-height: 20px;   color: #ffffff;   text-align: center;   background-color: #428bca;   -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);   box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);   -webkit-transition: width 0.6s ease;   transition: width 0.6s ease; } .progress-striped .progress-bar {   background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);   background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);   background-size: 40px 40px; } .progress.active .progress-bar {   -webkit-animation: progress-bar-stripes 2s linear infinite;   animation: progress-bar-stripes 2s linear infinite; } .progress-bar-success {   background-color: #5cb85c; } .progress-striped .progress-bar-success {   background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);   background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); } .progress-bar-info {   background-color: #5bc0de; } .progress-striped .progress-bar-info {   background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);   background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); } .progress-bar-warning {   background-color: #f0ad4e; } .progress-striped .progress-bar-warning {   background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);   background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); } .progress-bar-danger {   background-color: #d9534f; } .progress-striped .progress-bar-danger {   background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);   background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }.pull-right {   float: right !important; } .pull-left {   float: left !important; } .sr-only {   position: absolute;   width: 1px;   height: 1px;   margin: -1px;   padding: 0;   overflow: hidden;   clip: rect(0, 0, 0, 0);   border: 0; } .sr-only-focusable:active, .sr-only-focusable:focus {   position: static;   width: auto;   height: auto;   margin: 0;   overflow: visible;   clip: auto; } .btn {   display: inline-block;   margin-bottom: 0;   font-weight: normal;   text-align: center;   vertical-align: middle;   cursor: pointer;   background-image: none;   border: 1px solid transparent;   white-space: nowrap;   padding: 6px 12px;   font-size: 14px;   line-height: 1.42857143;   border-radius: 4px;   -webkit-user-select: none;   -moz-user-select: none;   -ms-user-select: none;   user-select: none; } .btn:focus, .btn:active:focus, .btn.active:focus {   outline: thin dotted;   outline: 5px auto -webkit-focus-ring-color;   outline-offset: -2px; } .btn:hover, .btn:focus {   color: #333333;   text-decoration: none; } .btn:active, .btn.active {   outline: 0;   background-image: none;   -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);   box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); } .btn.disabled, .btn[disabled], fieldset[disabled] .btn {   cursor: not-allowed;   pointer-events: none;   opacity: 0.65;   filter: alpha(opacity=65);   -webkit-box-shadow: none;   box-shadow: none; } .btn-default {   color: #333333;   background-color: #ffffff;   border-color: #cccccc; } .btn-default:hover, .btn-default:focus, .btn-default:active, .btn-default.active, .open > .dropdown-toggle.btn-default {   color: #333333;   background-color: #e6e6e6;   border-color: #adadad; } .btn-default:active, .btn-default.active, .open > .dropdown-toggle.btn-default {   background-image: none; } .btn-default.disabled, .btn-default[disabled], fieldset[disabled] .btn-default, .btn-default.disabled:hover, .btn-default[disabled]:hover, fieldset[disabled] .btn-default:hover, .btn-default.disabled:focus, .btn-default[disabled]:focus, fieldset[disabled] .btn-default:focus, .btn-default.disabled:active, .btn-default[disabled]:active, fieldset[disabled] .btn-default:active, .btn-default.disabled.active, .btn-default[disabled].active, fieldset[disabled] .btn-default.active {   background-color: #ffffff;   border-color: #cccccc; } .btn-default .badge {   color: #ffffff;   background-color: #333333; } .btn-primary {   color: #ffffff;   background-color: #428bca;   border-color: #357ebd; } .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open > .dropdown-toggle.btn-primary {   color: #ffffff;   background-color: #3071a9;   border-color: #285e8e; } .btn-primary:active, .btn-primary.active, .open > .dropdown-toggle.btn-primary {   background-image: none; } .btn-primary.disabled, .btn-primary[disabled], fieldset[disabled] .btn-primary, .btn-primary.disabled:hover, .btn-primary[disabled]:hover, fieldset[disabled] .btn-primary:hover, .btn-primary.disabled:focus, .btn-primary[disabled]:focus, fieldset[disabled] .btn-primary:focus, .btn-primary.disabled:active, .btn-primary[disabled]:active, fieldset[disabled] .btn-primary:active, .btn-primary.disabled.active, .btn-primary[disabled].active, fieldset[disabled] .btn-primary.active {   background-color: #428bca;   border-color: #357ebd; } .btn-primary .badge {   color: #428bca;   background-color: #ffffff; } .btn-success {   color: #ffffff;   background-color: #5cb85c;   border-color: #4cae4c; } .btn-success:hover, .btn-success:focus, .btn-success:active, .btn-success.active, .open > .dropdown-toggle.btn-success {   color: #ffffff;   background-color: #449d44;   border-color: #398439; } .btn-success:active, .btn-success.active, .open > .dropdown-toggle.btn-success {   background-image: none; } .btn-success.disabled, .btn-success[disabled], fieldset[disabled] .btn-success, .btn-success.disabled:hover, .btn-success[disabled]:hover, fieldset[disabled] .btn-success:hover, .btn-success.disabled:focus, .btn-success[disabled]:focus, fieldset[disabled] .btn-success:focus, .btn-success.disabled:active, .btn-success[disabled]:active, fieldset[disabled] .btn-success:active, .btn-success.disabled.active, .btn-success[disabled].active, fieldset[disabled] .btn-success.active {   background-color: #5cb85c;   border-color: #4cae4c; } .btn-success .badge {   color: #5cb85c;   background-color: #ffffff; } .btn-info {   color: #ffffff;   background-color: #5bc0de;   border-color: #46b8da; } .btn-info:hover, .btn-info:focus, .btn-info:active, .btn-info.active, .open > .dropdown-toggle.btn-info {   color: #ffffff;   background-color: #31b0d5;   border-color: #269abc; } .btn-info:active, .btn-info.active, .open > .dropdown-toggle.btn-info {   background-image: none; } .btn-info.disabled, .btn-info[disabled], fieldset[disabled] .btn-info, .btn-info.disabled:hover, .btn-info[disabled]:hover, fieldset[disabled] .btn-info:hover, .btn-info.disabled:focus, .btn-info[disabled]:focus, fieldset[disabled] .btn-info:focus, .btn-info.disabled:active, .btn-info[disabled]:active, fieldset[disabled] .btn-info:active, .btn-info.disabled.active, .btn-info[disabled].active, fieldset[disabled] .btn-info.active {   background-color: #5bc0de;   border-color: #46b8da; } .btn-info .badge {   color: #5bc0de;   background-color: #ffffff; } .btn-warning {   color: #ffffff;   background-color: #f0ad4e;   border-color: #eea236; } .btn-warning:hover, .btn-warning:focus, .btn-warning:active, .btn-warning.active, .open > .dropdown-toggle.btn-warning {   color: #ffffff;   background-color: #ec971f;   border-color: #d58512; } .btn-warning:active, .btn-warning.active, .open > .dropdown-toggle.btn-warning {   background-image: none; } .btn-warning.disabled, .btn-warning[disabled], fieldset[disabled] .btn-warning, .btn-warning.disabled:hover, .btn-warning[disabled]:hover, fieldset[disabled] .btn-warning:hover, .btn-warning.disabled:focus, .btn-warning[disabled]:focus, fieldset[disabled] .btn-warning:focus, .btn-warning.disabled:active, .btn-warning[disabled]:active, fieldset[disabled] .btn-warning:active, .btn-warning.disabled.active, .btn-warning[disabled].active, fieldset[disabled] .btn-warning.active {   background-color: #f0ad4e;   border-color: #eea236; } .btn-warning .badge {   color: #f0ad4e;   background-color: #ffffff; } .btn-danger {   color: #ffffff;   background-color: #d9534f;   border-color: #d43f3a; } .btn-danger:hover, .btn-danger:focus, .btn-danger:active, .btn-danger.active, .open > .dropdown-toggle.btn-danger {   color: #ffffff;   background-color: #c9302c;   border-color: #ac2925; } .btn-danger:active, .btn-danger.active, .open > .dropdown-toggle.btn-danger {   background-image: none; } .btn-danger.disabled, .btn-danger[disabled], fieldset[disabled] .btn-danger, .btn-danger.disabled:hover, .btn-danger[disabled]:hover, fieldset[disabled] .btn-danger:hover, .btn-danger.disabled:focus, .btn-danger[disabled]:focus, fieldset[disabled] .btn-danger:focus, .btn-danger.disabled:active, .btn-danger[disabled]:active, fieldset[disabled] .btn-danger:active, .btn-danger.disabled.active, .btn-danger[disabled].active, fieldset[disabled] .btn-danger.active {   background-color: #d9534f;   border-color: #d43f3a; } .btn-danger .badge {   color: #d9534f;   background-color: #ffffff; } .btn-link {   color: #428bca;   font-weight: normal;   cursor: pointer;   border-radius: 0; } .btn-link, .btn-link:active, .btn-link[disabled], fieldset[disabled] .btn-link {   background-color: transparent;   -webkit-box-shadow: none;   box-shadow: none; } .btn-link, .btn-link:hover, .btn-link:focus, .btn-link:active {   border-color: transparent; } .btn-link:hover, .btn-link:focus {   color: #2a6496;   text-decoration: underline;   background-color: transparent; } .btn-link[disabled]:hover, fieldset[disabled] .btn-link:hover, .btn-link[disabled]:focus, fieldset[disabled] .btn-link:focus {   color: #777777;   text-decoration: none; } .btn-lg, .btn-group-lg > .btn {   padding: 10px 16px;   font-size: 18px;   line-height: 1.33;   border-radius: 6px; } .btn-sm, .btn-group-sm > .btn {   padding: 5px 10px;   font-size: 12px;   line-height: 1.5;   border-radius: 3px; } .btn-xs, .btn-group-xs > .btn {   padding: 1px 5px;   font-size: 12px;   line-height: 1.5;   border-radius: 3px; } .btn-block {   display: block;   width: 100%; } .btn-block + .btn-block {   margin-top: 5px; } input[type='submit'].btn-block, input[type='reset'].btn-block, input[type='button'].btn-block {   width: 100%; } .fade {   opacity: 0;   -webkit-transition: opacity 0.15s linear;   -o-transition: opacity 0.15s linear;   transition: opacity 0.15s linear; } .fade.in {   opacity: 1; } .collapse {   display: none; } .collapse.in {   display: block; } tr.collapse.in {   display: table-row; } tbody.collapse.in {   display: table-row-group; } .collapsing {   position: relative;   height: 0;   overflow: hidden;   -webkit-transition: height 0.35s ease;   -o-transition: height 0.35s ease;   transition: height 0.35s ease; } .caret {   display: inline-block;   width: 0;   height: 0;   margin-left: 2px;   vertical-align: middle;   border-top: 4px solid;   border-right: 4px solid transparent;   border-left: 4px solid transparent; } .dropdown {   position: relative; } .dropdown-toggle:focus {   outline: 0; } .dropdown-menu {   position: absolute;   top: 100%;   left: 0;   z-index: 1000;   display: none;   float: left;   min-width: 160px;   padding: 5px 0;   margin: 2px 0 0;   list-style: none;   font-size: 14px;   text-align: left;   background-color: #ffffff;   border: 1px solid #cccccc;   border: 1px solid rgba(0, 0, 0, 0.15);   border-radius: 4px;   -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);   box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);   background-clip: padding-box; } .dropdown-menu.pull-right {   right: 0;   left: auto; } .dropdown-menu .divider {   height: 1px;   margin: 9px 0;   overflow: hidden;   background-color: #e5e5e5; } .dropdown-menu > li > a {   display: block;   padding: 3px 20px;   clear: both;   font-weight: normal;   line-height: 1.42857143;   color: #333333;   white-space: nowrap; } .dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {   text-decoration: none;   color: #262626;   background-color: #f5f5f5; } .dropdown-menu > .active > a, .dropdown-menu > .active > a:hover, .dropdown-menu > .active > a:focus {   color: #ffffff;   text-decoration: none;   outline: 0;   background-color: #428bca; } .dropdown-menu > .disabled > a, .dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {   color: #777777; } .dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {   text-decoration: none;   background-color: transparent;   background-image: none;   filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);   cursor: not-allowed; } .open > .dropdown-menu {   display: block; } .open > a {   outline: 0; } .dropdown-menu-right {   left: auto;   right: 0; } .dropdown-menu-left {   left: 0;   right: auto; } .dropdown-header {   display: block;   padding: 3px 20px;   font-size: 12px;   line-height: 1.42857143;   color: #777777;   white-space: nowrap; } .dropdown-backdrop {   position: fixed;   left: 0;   right: 0;   bottom: 0;   top: 0;   z-index: 990; } .pull-right > .dropdown-menu {   right: 0;   left: auto; } .dropup .caret, .navbar-fixed-bottom .dropdown .caret {   border-top: 0;   border-bottom: 4px solid;   content: ''; } .dropup .dropdown-menu, .navbar-fixed-bottom .dropdown .dropdown-menu {   top: auto;   bottom: 100%;   margin-bottom: 1px; } @media (min-width: 768px) {   .navbar-right .dropdown-menu {     left: auto;     right: 0;   }   .navbar-right .dropdown-menu-left {     left: 0;     right: auto;   } } .btn-group, .btn-group-vertical {   position: relative;   display: inline-block;   vertical-align: middle; } .btn-group > .btn, .btn-group-vertical > .btn {   position: relative;   float: left; } .btn-group > .btn:hover, .btn-group-vertical > .btn:hover, .btn-group > .btn:focus, .btn-group-vertical > .btn:focus, .btn-group > .btn:active, .btn-group-vertical > .btn:active, .btn-group > .btn.active, .btn-group-vertical > .btn.active {   z-index: 2; } .btn-group > .btn:focus, .btn-group-vertical > .btn:focus {   outline: 0; } .btn-group .btn + .btn, .btn-group .btn + .btn-group, .btn-group .btn-group + .btn, .btn-group .btn-group + .btn-group {   margin-left: -1px; } .btn-toolbar {   margin-left: -5px; } .btn-toolbar .btn-group, .btn-toolbar .input-group {   float: left; } .btn-toolbar > .btn, .btn-toolbar > .btn-group, .btn-toolbar > .input-group {   margin-left: 5px; } .btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {   border-radius: 0; } .btn-group > .btn:first-child {   margin-left: 0; } .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {   border-bottom-right-radius: 0;   border-top-right-radius: 0; } .btn-group > .btn:last-child:not(:first-child), .btn-group > .dropdown-toggle:not(:first-child) {   border-bottom-left-radius: 0;   border-top-left-radius: 0; } .btn-group > .btn-group {   float: left; } .btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {   border-radius: 0; } .btn-group > .btn-group:first-child > .btn:last-child, .btn-group > .btn-group:first-child > .dropdown-toggle {   border-bottom-right-radius: 0;   border-top-right-radius: 0; } .btn-group > .btn-group:last-child > .btn:first-child {   border-bottom-left-radius: 0;   border-top-left-radius: 0; } .btn-group .dropdown-toggle:active, .btn-group.open .dropdown-toggle {   outline: 0; } .btn-group > .btn + .dropdown-toggle {   padding-left: 8px;   padding-right: 8px; } .btn-group > .btn-lg + .dropdown-toggle {   padding-left: 12px;   padding-right: 12px; } .btn-group.open .dropdown-toggle {   -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);   box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); } .btn-group.open .dropdown-toggle.btn-link {   -webkit-box-shadow: none;   box-shadow: none; } .btn .caret {   margin-left: 0; } .btn-lg .caret {   border-width: 5px 5px 0;   border-bottom-width: 0; } .dropup .btn-lg .caret {   border-width: 0 5px 5px; } .btn-group-vertical > .btn, .btn-group-vertical > .btn-group, .btn-group-vertical > .btn-group > .btn {   display: block;   float: none;   width: 100%;   max-width: 100%; } .btn-group-vertical > .btn-group > .btn {   float: none; } .btn-group-vertical > .btn + .btn, .btn-group-vertical > .btn + .btn-group, .btn-group-vertical > .btn-group + .btn, .btn-group-vertical > .btn-group + .btn-group {   margin-top: -1px;   margin-left: 0; } .btn-group-vertical > .btn:not(:first-child):not(:last-child) {   border-radius: 0; } .btn-group-vertical > .btn:first-child:not(:last-child) {   border-top-right-radius: 4px;   border-bottom-right-radius: 0;   border-bottom-left-radius: 0; } .btn-group-vertical > .btn:last-child:not(:first-child) {   border-bottom-left-radius: 4px;   border-top-right-radius: 0;   border-top-left-radius: 0; } .btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {   border-radius: 0; } .btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child, .btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {   border-bottom-right-radius: 0;   border-bottom-left-radius: 0; } .btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {   border-top-right-radius: 0;   border-top-left-radius: 0; } .btn-group-justified {   display: table;   width: 100%;   table-layout: fixed;   border-collapse: separate; } .btn-group-justified > .btn, .btn-group-justified > .btn-group {   float: none;   display: table-cell;   width: 1%; } .btn-group-justified > .btn-group .btn {   width: 100%; } .btn-group-justified > .btn-group .dropdown-menu {   left: auto; } [data-toggle='buttons'] > .btn > input[type='radio'], [data-toggle='buttons'] > .btn > input[type='checkbox'] {   position: absolute;   z-index: -1;   opacity: 0;   filter: alpha(opacity=0); } .clearfix:before, .clearfix:after, .btn-toolbar:before, .btn-toolbar:after, .btn-group-vertical > .btn-group:before, .btn-group-vertical > .btn-group:after {   content: ' ';   display: table; } .clearfix:after, .btn-toolbar:after, .btn-group-vertical > .btn-group:after {   clear: both; } .center-block {   display: block;   margin-left: auto;   margin-right: auto; } .pull-right {   float: right !important; } .pull-left {   float: left !important; } .hide {   display: none !important; } .show {   display: block !important; } .invisible {   visibility: hidden; } .text-hide {   font: 0/0 a;   color: transparent;   text-shadow: none;   background-color: transparent;   border: 0; } .hidden {   display: none !important;   visibility: hidden !important; } .affix {   position: fixed;   -webkit-transform: translate3d(0, 0, 0);   transform: translate3d(0, 0, 0); }   .form-control {   display: block;   width: 100%;   height: 34px;   padding: 6px 12px;   font-size: 14px;   line-height: 1.42857143;   color: #555;   background-color: #fff;   background-image: none;   border: 1px solid #ccc;   border-radius: 4px;   -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);           box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);   -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;        -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;           transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; } .form-control:focus {   border-color: #66afe9;   outline: 0;   -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);           box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6); } .form-control::-moz-placeholder {   color: #777;   opacity: 1; } .form-control:-ms-input-placeholder {   color: #777; } .form-control::-webkit-input-placeholder {   color: #777; } .form-control[disabled], .form-control[readonly], fieldset[disabled] .form-control {   cursor: not-allowed;   background-color: #eee;   opacity: 1; } textarea.form-control {   height: auto; }");
GM_addStyle(".attrCol {   width:25%; } .valCol {   width:37.5%; } span.relative-date {   border-bottom: 1px dotted; }  #missingo-header { 	box-sizing:border-box; 	position:fixed; 	left:0; 	top:0; 	width:260px; 	background-color:#56686F; 	margin-top:0; 	color: #FFFFFF; 	font-size: 12px; 	font-weight: 500; 	padding: 5px 5px 5px 10px; 	background-image: url('http://popmundo.com/App_Themes/Default/Images/bgr-item-header.png'); 	background-repeat: repeat-x;  	user-select:none; 	-moz-user-select:none; 	cursor:default; }  #missingo-innerstatus { 	position:fixed; 	top:26px; 	left:0; 	bottom:0; 	background-color:#eeeeee; 	width:260px; 	box-sizing:border-box; 	padding:0;  	overflow-x:hidden; 	overflow-y:auto;  	user-select:none; 	-moz-user-select:none; 	cursor:default; }  #missingo-queue { 	width:100%; 	margin:0px; 	padding:0px; 	border-collapse:collapse;}  #missingo-queue tr { 	cursor:n-resize; 	background-color:#d1d1d1; 	border-bottom: 1px solid black; }  #missingo-queue td { padding:3px; }  #missingo-queue tr.highlight { 	background-color: #fff !important; }  #missingo-smokescreen { 	opacity:0.75; 	background-color:#000; 	position:absolute; 	left:0; 	top:0; 	height:100%; 	width:100%; 	display:none; }  td.missingo-delete { 	color:red; 	cursor:pointer; }  .target { 	background-color:green !important; 	opacity:1 !important; }  .dragged { 	display:block; 	background-color:blue; 	z-index:99999; }  .love, .friend, .sex, .auto { 	font-size:11pt; 	cursor:pointer; }  .love { 	color:red; }  .friend { 	color:blue; }  .sex { 	color:purple; }  .auto { 	color: #D2691E; }  .inactive { color:rgba(0,0,0,0.1); }  .failed a { 	color: red; }  .cooldown a { 	color: gray; } .cooldown.phone a {   color: #7097b8; } .onesided {   background-color: #d1c6c6 !important; } .snuggled td.sex {   font-weight:bold; } tr.queue-entry td {font-size:9pt;}");
GM_addStyle(GM_getResourceText('jqueryUICSS'));
GM_addStyle(".highlight { transition: background-color 0.5s ease;} .onesided a:after { content: ' (!)'; } a.relationship { font-style:italic !important; font-size:inherit !important;} a.relationship.snuggle, a.relationship.romance.snuggle { color: purple; } a.relationship.romance { color:magenta; } a.relationship.ended { text-decoration: line-through; color: #111; } tr.same-city td a {font-weight:bold;} tr.other-romance td.love {text-decoration:underline;} #PA-notes { width: 100%; resize:vertical;} #missingo-sidebar {font-size:10pt;font-family:'Roboto','Helvetica';z-index:1000;} ");
GM_addStyle("#pa-sidebar-info { background-color:#efefef; width:400px; height:200px;border-radius:5px;border:1px solid #999;padding:10px;display:none;}tr.pa-selected td{background-color:#fff !important;");

GM_addStyle(".pa-window {background-color:#FFF;width:1000px;z-index:1000;margin-left:auto;margin-right:auto;border-radius:5px;}");
GM_addStyle(`
	#assistant-app {
		position:fixed;
		left:0;
		bottom:0;
		height:35px;
		box-sizing:border-box;
		padding:5px;
        width:250px;
        border-radius: 0px 15px 0px 0px;
		background-color:#333333;
		border-top:1px solid #111111;
		color:#EEEEEE;
		z-index:99999999;
	}

	#assistant-window {
		display:none;
	}

	#assistant-window-manager {
		height:20px;
		background-color:#333333;
		margin:0px 10px 10px 10px;
		padding:5px;
		font-weight:bold;
		color:#dddddd;
		text-align:center;
	}

	#assistant-window-pane {
		margin: 0px 25px;
	}

	#assistant-window-close {
		float:right;
		cursor:pointer;
		color:#ff0000;
	}

	.assistant-noselect {
		user-select:none;
		-webkit-user-select:none;
	}
`);

// Constants
var characterURL = "/World/Popmundo.aspx/Character/";

// Settings
var requestDelay = 250; 			// The minimum amount of time to wait between requests to the popmundo server
var autoInteractSeconds = 1;			// The amount of seconds to wait before automatically pressing the interact button
var minRandomInterval = 0;			// The minimum amount of milliseconds to add to the request delay
var maxRandomInterval = 100;			// The maximum amount of milliseconds to add to the request delay
var relationsUpdateInterval = 60*60*1000;	// Does nothing
var enableBackgroundUpdating = false; // Disabled; from now on updating will happen when auto interact is started
let enable_api = null;

// Store the full URL of the current page
var currentURL = window.location.href;

// Data storage constants
var storageNumAutoInteractionsStat = "missingoNumAutoInteractionsStat";
var storageNumManualInteractionsStat= "missingoNumManualInteractionsStat";
var storageTimeSpentStat = "missingoTimeSpentStat";
var storageNumPagesStat = "missingoNumPagesStat";

// Taken from https://stackoverflow.com/questions/2346011/jquery-scroll-to-an-element-within-an-overflowed-div
// Function to scroll to an element within a overflowed div
jQuery.fn.scrollTo = function(elem) {
	$(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
	return this;
};

/**
 * City ID to city name translations
 */
var cityMap = {
	cities: {
		1: 'Stockholm',
		5: 'London',
		6: 'New York',
		7: 'Berlin',
		8: 'Amsterdam',
		9: 'Barcelona',
		10: 'Melbourne',
		11: 'Nashville',
		14: 'Los Angeles',
		16: 'Toronto',
		17: 'Buenos Aires',
		18: 'Moscow',
		19: 'Helsinki',
		20: 'Paris',
		21: 'São Paulo',
		22: 'Copenhagen',
		23: 'Rome',
		24: 'Madrid',
		25: 'Rio de Janeiro',
		26: 'Tromsø',
		27: 'Glasgow',
		28: 'Vilnius',
		29: 'Dubrovnik',
		30: 'Istanbul',
		31: 'Porto',
		32: 'Mexico City',
		33: 'Brussels',
		34: 'Tallinn',
		35: 'Ankara',
		36: 'Belgrade',
		38: 'Montreal',
		39: 'Singapore',
		42: 'Budapest',
		45: 'Shanghai',
		46: 'Bucharest',
		47: 'Izmir',
		48: 'Warsaw',
		49: 'Sarajevo',
		50: 'Seattle',
		51: 'Johannesburg',
		52: 'Milan',
		53: 'Sofia',
		54: 'Manila',
		55: 'Jakarta',
		56: 'Kiev',
		58: 'Baku',
		60: 'Chicago',
		61: 'Antalya',
		62: 'Tokyo',
	},

	find: function(name) {
		let returnValue= 'u';

		Object.keys(this.cities).forEach((k) => {
			if (this.cities[k] == name) {
				returnValue = k;
			}
		});

		return returnValue;
	},
};

var groupMap = {
	0: 'Default',
	1: 'Friend',
	2: 'Lover',
	3: 'Significant Other',
	4: 'Snuggle Partner',
}

function parseInteractHistory(relationship)
{
	// broken, and doesn't need to be fixed before v2
	storeRelationship(character, relationship);
}

function fetchRelationsBackground(page, viewstate, eventValidation, viewStateGenerator)
{
	// Set page to 1 if it is not provided
	if (typeof page === 'undefined') {
		page = 1;
	}

	// Prepare request
	var relationsURL	= window.location.origin + '/World/Popmundo.aspx/Character/Relations/' + character.id;
	var table			= null;
	var sendData		= {};
	var sendMethod		= 'GET';

	// For pages past 1, prepare a POST request instead
	if (page !== 1) {
		sendData = {
			'__EVENTTARGET': 'ctl00$cphLeftColumn$ctl00$ddlShowPage',
			'__VIEWSTATE': viewstate,
			'__EVENTARGUMENT': '',
			'__LASTFOCUS': '',
			'__EVENTVALIDATION': eventValidation,
			'__VIEWSTATEGENERATOR': viewStateGenerator,
			'ctl00$cphLeftColumn$ctl00$ddlNumItemsPerPage':100,
			'ctl00$cphLeftColumn$ctl00$ddlShowPage':page
		}
		sendMethod = 'POST';
	}

	// Perform AJAX request
	$.ajax({
		type: sendMethod,
		url: relationsURL,
		context: document.body,
		data: sendData
	}).done(function(data) {
		// We're only interested in the table
		table = $(data).find("table.data tbody");
		// Process the results in the table
		updateRelations(table);

		if ($(data).find("#ctl00_cphLeftColumn_ctl00_btnGoNext").length > 0 && page <= 3) {
			// There's another page available
			// Values required for a successful POST request
			var newViewstate = $(data).find('#__VIEWSTATE').val();
			var newEventValidation = $(data).find('#__EVENTVALIDATION').val();
			var newViewStateGenerator = $(data).find('#__VIEWSTATEGENERATOR').val();

			// Fetch data on next pages
			setTimeout(function() {fetchRelationsBackground(page+1, newViewstate, newEventValidation, newViewStateGenerator)}, 500);
		}
	});
}

function updateRelations(table)
{
	fillQueue(table);
	insertStatus();
}

function parseDataFromPresBox(charPresBox, character)
{
	// Attempts to set the following attributes: age, name, cityName, cityId, localeName, localeId, attitude, gameStatus, cardParsed
	var presBox   = $(charPresBox).find("div.characterPresentation").first();

	if (!character) {
		character = {};
	}

	if (presBox) {
		presBox = presBox.first();
	} else {
		console.log('[WARNING] Could not find charPresBox. Did the layout change?');
		return;
	}

	var avatar   = $(charPresBox).find('div.avatar').css('background-image');
	if (avatar) {$('#pa-sidebar-avatar').css('background-image', avatar);character.avatar=avatar;}
	else {console.log("ERROR: Failed to find avatar URL from character background page.");}

	var ageElement = $(presBox).find("p");
	if (ageElement && ageElement.length > 0) {
		var ageText  = $(ageElement).first().text().trim();
		var ageRegex = /^(.+)\ ([0-9]+)/g;
		var ageMatch = ageRegex.exec(ageText)[2];
		if (ageMatch) {
			character.age = ageMatch;
		} else {
			console.log('[WARNING] Could not find age in paragraph text. Did the layout change?');
		}
	} else {
		console.log('[WARNING] Could not find paragraph in charPresBox. Did the layout change?');
	}

	var nameElement = $(charPresBox).find("h2");
	if (nameElement && nameElement.length > 0) {
		nameElement    = nameElement.first();
		character.name = nameElement.text().trim();
	} else {
		console.log('[WARNING] Could not find h2 in charPresBox. Did the layout change?');
	}

	var vipImg = $(nameElement).find("img[src$='VIPNameStar.png']");
	if (vipImg && vipImg.length > 0) {
		character.isVip = true;
	} else {
		character.isVip = false;
	}

	var linkElement = $(presBox).find("a[href*='/Locale/']");
	if (linkElement && linkElement.length > 0) {
		linkElement = linkElement.first();
		var localeId   = $(linkElement).attr('href').split('/');
		character.localeId   = localeId[localeId.length-1];
		character.localeName = $(linkElement).text();
	} else {
		console.log('[WARNING] Could not find locale information in charPresBox. Has the layout changed?');
	}

	var linkElement = $(presBox).find("a[href*='/City/']");
	if (linkElement && linkElement.length > 0) {
		linkElement			 = linkElement.first()
		var cityId     		 = $(linkElement).attr('href').split('/');
		character.cityId     = cityId[cityId.length-1];
		character.cityName   = $(linkElement).text();
	} else {
		console.log('[WARNING] Could not find city information in charPresBox. Has the layout changed?');
	}

	var toolbox = document.getElementsByClassName('charMainToolbox')[0];
	if (toolbox) {
		// Toolbox allows us to parse our own attitude setting and current status
		var attitude = toolbox.querySelector('#ctl00_cphLeftColumn_ctl00_lnkAttitude');
		if (attitude) {
			character.attitude   = attitude.innerHTML.trim().toLowerCase();
		} else {
			console.log('[WARNING] Could not find attitude information in charMainToolbox. Has the layout changed?');
		}

		var gameStatus = toolbox.querySelector('tbody > tr:nth-child(2) > td:nth-child(2)');
		if (gameStatus) {
			character.gameStatus = gameStatus.innerHTML.trim().toLowerCase();
		} else {
			console.log('[WARNING] Could not find status information in charMainToolbox. Has the layout changed?');
		}
	}

	// Store the current timestamp
	character.cardParsed = Date.now();

	return character;
}

function parseDataFromCharacterBackground(contentDiv, character)
{
	// Parses gender and birthday
	if (!character) {
		character = {};
	}

	var birthday = $(contentDiv).find("div.box p:nth-child(4)").first().text();
	var pattern  = /\:\ (.+)/g;
	birthday     = pattern.exec(birthday)[1];
	birthday = moment(birthday, localization.dateformat);
	if (birthday && typeof birthday === 'object') {character.birthday=birthday.format('x')}

	var genderElement = $(contentDiv).find("div.box > p:nth-child(5)");

	if (genderElement && genderElement.length > 0) {
		genderElement = genderElement.first().text().trim().toLowerCase();
		var genderRegex = new RegExp('\:\ (.+)$', 'g');
		genderElement = genderRegex.exec(genderElement)[1];
		for (var key in dictionary.gender) {
			if (dictionary.gender.hasOwnProperty(key)) {
				if (dictionary.gender[key].toLowerCase() == genderElement) {
					character.gender = key;
					break;
				}
			}
		};
	} else {
		console.log('[WARNING] Could not parse gender from page. Did the layout change?');
	}

	character.lastBackgroundParsed = Date.now();

	return character;
}

async function missingo()
{
	var startTime = new Date();
	var ownID     = character.id;

	// Attempt to parse own info
	var characterBox = document.querySelector('#ppm-content div.charPresBox div.avatar div.idHolder');
	if (characterBox && characterBox.innerHTML.trim() == character.id) {
		var charPresBox = document.querySelector('#ppm-content div.charPresBox');
		parseDataFromPresBox(charPresBox, character);
		storeCharacter(character);
	} // End of parsing own info

	// Status window on every page
	insertStatus();

	// Let user highlight table rows
	$("table.data tbody tr").click(function() {
		$(this).parents("table").find("tr.pa-selected").removeClass('pa-selected');
		$(this).addClass('pa-selected');
	});

    if (currentURL.toLowerCase().indexOf("/conversations/conversation") !== -1) {
        try {
            parseConversation(document);
        } catch (e) {}
    }

	// Routing / Router
	if (currentURL.indexOf("/Character/Relations/" + character.id) != -1) {
		var table = $("table.data tbody");

		if (fillQueue(table)) {
			insertStatus();
		}
	} else if (currentURL.indexOf("/Interact/") != -1) {
		var otherID		 = getOtherID();
		var relationship = getRelationship(character, otherID);
		modifyInteractPage();
		evaluateInteraction(true);

		if (relationship) {
			parseInteractHistory(relationship);

			// 1.7: If relationship no longer exists, remove it from storage
			if ($("#infoBox p").text().indexOf("You don't know this character") != -1) {
				if (relationship.status !== 'ended') {
					deleteRelationship(relationship, 'The other person ended the relationship, or the relationship expired.');
				}
			}

			// Check for imbalances
			if (getOwnLove() > 0) {
				relationship.otherRomance = 1;
			} else {
				relationship.otherRomance = 0;
			}

			storeRelationship(character, relationship);
		}
	} else if (currentURL.indexOf('aspx/Character') != -1) {
		var otherID = parseIdFromCharacterPage();

		if (otherID && otherID === character.id) {
			// This is the logged in character
			var elem = $("div.charPresBox");

			parseDataFromPresBox(elem, character);
			storeCharacter(character);
			modifyOwnCharacterPage();
		} else {
			// This is not the logged in character
			var relationship = getRelationship(character, otherID);

			// This is a character we have a relationship with
			if (relationship) {
				var elem = $("div.charPresBox");
				parseDataFromPresBox(elem, relationship);
				console.log(relationship);
				storeRelationship(character, relationship, true);
			}

			// Remove dead characters
			if (relationship && isCharacterDead()) {
				removeFromQueue(relationship.other);
				deleteRelationship(relationship, 'This person died');
			}

			// remove before publishing
			if (otherID && isAutoInteractActive()) {
				try {
					let convoDoc = await axios.get(window.location.origin + '/World/Popmundo.aspx/Conversations/Conversation/' + otherID, {
						responseType: 'document',timeout: 1000,
					});

					await parseConversation(convoDoc.data, otherID);
				} catch (e) {}
			}
		}
	} else if (currentURL.indexOf('aspx/Locale') != -1) {
		modifyLocalePage();
	} else if(currentURL.indexOf('City/Locales/') != -1) {
		// QUICKMOVE: Check if hash is set
		console.log("[DEBUG] On city page");
		var hashfragment = location.hash;

		if (hashfragment.indexOf('pa-qm=') != -1) {
			// Display backdrop to discourage user from interfering
			displayBackdrop("Please Wait...");

			// Check if there already is a list of locales available
			if ($("#tablelocales").length > 0) {
				var linkToFollow = $("#tablelocales a[href*='/MoveToLocale/']").first();
				navigateTo(linkToFollow.attr('href'));
			} else {
				// Quickmove is active, select the given ID
				var localeTypeId = /pa\-qm\=([0-9]+)/g.exec(hashfragment)[1];
				$("form").attr("action", currentURL);
				$("#ctl00_cphLeftColumn_ctl00_ddlLocaleType").val(localeTypeId);
				performDelayed(function() {
					$("#ctl00_cphLeftColumn_ctl00_btnFind").click();
				});
			}
		}
	} else if (currentURL.indexOf('Artist/UpcomingPerformances/') != -1) {
		parseUpcomingPerformances();
	} else if (currentURL.indexOf('/Artist/BookShow') != -1) {
		// [EXPERIMENTAL] Display tour table
		console.log('test');
		modifyBookshow();
	} else if (/Character$/.test(currentURL)) {
		character.name = /\ \-\ (.+)$/.exec(document.title)[1];
		storeCharacter(character);
	}

	if (isAutoInteractActive()) {
		console.log("DEBUG: Auto-interact Active.");
		doAutoInteract();
	}

	// Hashtag "done" indicates that auto interact just finished
	if (window.location.hash.indexOf("#done") !== -1) {
		displayBackdrop();
		insertStatusWindow();

		// Reset location links
		GM_deleteValue("returnLocaleId");
		GM_deleteValue("returnLocaleName");
	}

	// Optionally style all links on the page
	if (character.styleLinks && !isAutoInteractActive()) {
		setTimeout(function() {styleLinks()}, 50);
	}

	console.log("Exiting Popmundo Assistant (" + (new Date().getTime() - startTime.getTime()) + "ms)");
}

function selectShowCity(id)
{
	if ($('#ctl00_cphLeftColumn_ctl01_ddlCities option[value='+id+']').length > 0 && $('#ctl00_cphLeftColumn_ctl01_ddlCities').val() !== id) {
			// Select the city
			$('#ctl00_cphLeftColumn_ctl01_ddlCities').val(id);
			$('#ctl00_cphLeftColumn_ctl01_ddlCities').trigger('change');
	}
}

/**
 * Attempt to select the specified date in the day dropdown menu of the show booking form and submit the form if successful
 * @param date string String in the format YYYY-MM-DD, zero padded
 */
function selectShowDate(date)
{
	if ($('#ctl00_cphLeftColumn_ctl01_ddlDays option[value='+date+']').length > 0 && $('#ctl00_cphLeftColumn_ctl01_ddlDays').val() !== date) {
		console.log('changing value');
		// Select the date
		$('#ctl00_cphLeftColumn_ctl01_ddlDays').val(date);
		console.log('changed value');

		performDelayed(function() {
			$('#ctl00_cphLeftColumn_ctl01_btnFindClubs').click();
		});

		return true;
	}

	return false;
}

function pad(num, size) {
	var s = num.toString();
	while (s.length < size) s = "0" + s;
	return s;
}

function parseUpcomingPerformances()
{
	var tableUpcoming = document.getElementById("tableupcoming");

	Array.from(tableUpcoming.querySelectorAll('tbody tr')).forEach(function(row) {
		console.log('Row');
		// Now looping over all upcoming shows
		var cells      = Array.from(row.querySelectorAll('td'));
		// Remove sortkey span from the list
		cells[0].removeChild(cells[0].querySelector('span'));
		var dateString = cells[0].textContent;
		var cityString = cells[1].querySelectorAll('a')[1].getAttribute('href');

		var dateRegex  = /([0-9]{1,2})-([0-9]{1,2})-([0-9]{4}),\ ([0-9]{2})/g;
		var cityRegex  = /City\/([0-9]+)/g

		var cityId     = cityRegex.exec(cityString)[1];
		var dateExec   = dateRegex.exec(dateString);
		var day        = dateExec[1];
		var month      = dateExec[2];
		var year       = dateExec[3];
		var hour       = dateExec[4];
		var hashString = '' + cityId + ':' + day + ':' + month + ':' + year + ':' + hour;
		console.log(hashString);
		var URL        = window.location.origin + '/World/Popmundo.aspx/Artist/BookShow' + '#' + hashString;
		var newAnchor  = document.createElement('a');
		newAnchor.setAttribute('href', URL);
		newAnchor.textContent = 'Book';
		cells[4].appendChild(newAnchor);
	});

	document.getElementById("ppm-content").insertAdjacentHTML("beforeend", "<div class=\"box\"><h2>Ghost Performances</h2><textarea id=\"assistant-ghost\"></textarea><br /><a href=\"#\" id=\"assistant-ghost-inject\">Inject</a></div>");

	document.getElementById("assistant-ghost-inject").addEventListener("click", function(e) {
		e.stopPropagation();
		injectGhostPerformances(document.getElementById("assistant-ghost").value);
	});
}

let injectGhostPerformances = (textToParse) =>
{
	// Parse the text into objects containing date, time, and city
	// Split on newline
	let lines = textToParse.split("\n");

	lines.forEach(function(line) {
		// Attempt to convert to CVS
		line = line.replace(/\t/g, ",");

		let values = line.split(",");

		let pDate = moment(values[0] + "," + values[1], "YYYY-MM-DD,H:m");
		let pCity = values[2];
		let pCityId = cityMap.find(pCity);
		let bookLink = pCityId.toString() + ":" + pDate.format("D:M:YYYY:H");
		bookLink = window.location.origin + '/World/Popmundo.aspx/Artist/BookShow' + '#' + bookLink;

		let tBody = document.getElementById("tableupcoming").querySelector("tbody");
		tBody.insertAdjacentHTML("beforeend", "<tr><td>" + pDate.format("D-M-YYYY, H:mm") + "</td><td>" + pCity + "("+pCityId+")</td><td>GHOST</td><td></td><td><a href=\"" + bookLink + "\">Book</a></td><td></td></tr>");
	});
};

function getWorldCharacterName()
{
	var name = $(".charPresBox h2").first().text();
	return name;
}

function isPopmundoHoliday(onDate)
{
	return false;
}

function modifyBookshow()
{
	console.log('SessionStorage value is ' + sessionStorage.getItem('autobook'));
	console.log('HashPart value is ' + window.location.hash);


    // Remove booked clubs (because wtf)
    document.querySelectorAll("#tableclubs tr input[type=radio]").forEach(function(elem) {
        if (elem.disabled === true) {
			elem.parentElement.parentElement.style.display = "none";
		} else {
			elem.addEventListener("click", function(e) {
				// Submit form
				document.getElementById("ctl00_cphLeftColumn_ctl01_btnBookShow").click();
				setTimeout(function() {window.close()}, 250);
			});
		}
    });

	if (window.location.hash) {
		sessionStorage.setItem('autobook', window.location.hash);
	} else if (!sessionStorage.getItem('autobook')) {
		return;
	}

	// Check if the hash can be interpreted
	var parts = sessionStorage.getItem('autobook').replace('#', '').split(':');

	// Expecting 5 parts
	if (parts.length !== 5) {
		return;
	}

	// Begin filling in the form
	// First check if the city is already chosen correctly
	var citySelect = document.getElementById('ctl00_cphLeftColumn_ctl01_ddlCities');

	if (citySelect.value != parts[0]) {
		// Value of city is incorrect, change it.
		citySelect.value = parts[0];
		// Todo: find a way to do this without jquery
		$('#ctl00_cphLeftColumn_ctl01_ddlCities').trigger('change');
		// Can only change one value in the form at a time (because popmundo loves it's unnecessary postbacks..)
		// return and wait for next page load
		return;
	}

	var dateSelect = document.getElementById("ctl00_cphLeftColumn_ctl01_ddlDays");

	// The values of dates are padded with a zero, for some reason, while the displayed value is not
	if (parts[2].length < 2) {
		parts[2] = '0' + parts[2];
	}

	if (parts[1].length < 2) {
		parts[1] = '0' + parts[1];
	}

	var expectedValue = parts[3] + '-' + parts[2] + '-' + parts[1];

	if (dateSelect.value !== expectedValue) {
		dateSelect.value = expectedValue;
		console.log('changing date');
		console.log(expectedValue);
	}

	var hourSelect = document.getElementById("ctl00_cphLeftColumn_ctl01_ddlHours");
	if (parts[4] == 12) {
		parts[4] = 14;
	}

	expectedValue = parts[4] + ':00:00';

	if (hourSelect.value !== expectedValue) {
		hourSelect.value = expectedValue;
	}

	// Clean up
	sessionStorage.removeItem('autobook');
	// Submit form
	document.getElementById("ctl00_cphLeftColumn_ctl01_btnFindClubs").click();
}

function insertSkipButton()
{
	// Prevent double buttons
	if ($("#missingo-skip").length > 0) {
		return true;
	}

	// Create the button
	var button = '<input id="missingo-skip" type="button" class="btn btn-default" value="Skip">';

	// Add the button
	$("#interactBox .float_right").first().append(button);

	$("#missingo-skip").click(function() {
		// Prevent multiple clicks
		$(this).prop("disabled",true);
		// Move the queue forward
		setQueueAction("skip");
		doAutoInteract();
	});
}

function missingoInteract()
{
	// Get the current action for auto-interacting
	var action			= getQueueAction();
	var queue			= getQueue();
	var position		= getQueuePosition();

	if (!queue[position]) {
		return false;
	}

	var item			= decodeQueueEntry(queue[position]);
	var relationship	= getRelationship(character, item.id);
	var chosen			= false;

	/*if (relationship.hasOwnProperty('lastInteractionDone') &&  (3*24*60*60*1000) > (Date.now() - new Date(relationship.lastInteractionDone).getTime())) {
		return false;
	}*/

	// If filter is set, only treat relationships with the correct mode/group set
	if (character.hasOwnProperty('filterQueue') && parseInt(character.filterQueue) >= 0 && parseInt(character.filterQueue) !== parseInt(relationship.mode)) {
		return false;
	}

	if (character.hasOwnProperty('settingInteractSameCityOnly') && character.settingInteractSameCityOnly && !isCharacterInSameCity(relationship)) {
		return false;
	}

	// If the relationship is estimated to be on cooldown, skip it
	if (checkCooldownPassed(relationship) === false) {
		return false;
	}

	// If auto interact is not enabled for the relationship and the setting to skip is enabled, skip it
	if (!relationship.allowAutoInteract && character.skipNoAuto) {
		return false;
	}

	// Find out the current action
	if (action == "perform") {
		console.log("Perform");
		// If the action is perform, we expect to be on the interaction page right now
		if (currentURL.indexOf("/Interact/" + item.id) != -1 || currentURL.indexOf("/Interact/Phone/" + item.id) != -1) {
			setAutoInteractStatus("Interacting with " + item.name);

			if ($("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").length <= 0) {
				console.log("No dropdown");
				if (checkCooldownPassed(relationship)) {
					console.log("Cooldown not passed");
					// This is only an error if there is no cooldown active
					relationship.interactfail			= true;
					relationship.interactFailReason		= 4;
				}

				storeRelationship(character, relationship);
				console.log("No dropdown return false");
				return false;
			}

			if (relationship.allowAutoInteract) {
				console.log("allowauto");
				if (!hasRelationship()) {
					console.log("no relationship");
					// There is no relationship between these characters, do not automatically create one
					relationship.interactfail = true;
					relationship.interactFailReason = 3;
					storeRelationship(character, relationship);
					return false;
				}

				if (evaluateInteraction(true)) {
					console.log("evaluating");
					performAutoInteract(relationship.owner, relationship.other);
					// Action performed successfully
					return true;
				} else {
					console.log("other");
					// No interaction could be chosen, move on.
					relationship.interactfail		= false;
					//relationship.interactFailReason	= "MissingO could not choose an interaction for this character.";
					relationship.interactFailReason	= 0;
					storeRelationship(character, relationship);

					return false;
				}

			} else {
				setAutoInteractStatus("Awaiting manual input");
				// Action performed as expected
				return true;
			}

		} else{
			return false;
		}
	}

	if (action == "interact") {
		// If the action is interact, then we must also be on a character screen
		if (currentURL.indexOf(("/Character/" + item.id) != -1)) {
			setAutoInteractStatus("Navigating to interaction screen for " + relationship.other);
			// Set to next phase
			setQueueAction("perform");

			if (!openInteractScreen()) {
				relationship.interactfail		= true;
				relationship.interactFailReason = 1;
				storeRelationship(character, relationship);
				return false;
			} else {
				return true;
			}
		} else {
			relationship.interactfail	= true;
			relationship.interactFailReason = 2;
			storeRelationship(character, relationship);

			return false;
		}
	}

	if (action == "find") {
		// Action find can be active on any page.
		setAutoInteractStatus("Navigating to " + relationship.other);
		// Set to next phase
		setQueueAction("interact");
		// Move to the character screen
		navigateTo(window.location.origin + characterURL + item.id.toString());

		return true;
	}
}


function doAutoInteract()
{
	debugMessage("Auto interact activated. Current action: '" + getQueueAction() + "'");

	if (getQueueAction() === "start") {
		if (currentURL !== window.location.origin + characterURL) {
			// First move to own page
			navigateTo(window.location.origin + characterURL);
		} else {
			// We are at own page, attempt to retrieve locale information
			var locale = getLocale();

			if (locale.id) {
				save("returnLocaleName", locale.name);
				save("returnLocaleId", locale.id);
			}

			// Next step is to find the first characte in the queue
			setQueueAction("find");
			doAutoInteract();
		}
	} else {
		// During each loop, make sure auto interact is still activated
		// If missingoInteract() returns false, this means it is done and needs to move on to the next item
		while ((isAutoInteractActive() && missingoInteract() === false) || getQueueAction() === "skip") {
			// Reset the action
			setQueueAction("find");

			if (advanceQueue() === false) {
				// advanceQueue returned false, indicating that there are no more items in the queue;
				// return to the character's own overview page
				navigateTo(window.location.origin + characterURL + "#done", true);
				break;
			}
		}
	}
}

/**
 * Navigates to a given URL, respecting the minimum time between requests.
 *
 * @param  {string}	url							The URL to navigate to
 * @param  {boolean} ignoreAutoInteractStatus	When set to true, will perform the action regardless of auto interact being disabled
 */
function navigateTo(url, ignoreAutointeractStatus)
{
	// Change the URL when the specified amount of time has passed
	performDelayed(function() {
		window.location.href = url;
	}, ignoreAutointeractStatus);
}

/**
 * Performs a callback function after the minumum amout of time between requests has expired.
 *
 * @param  {function} callback					The function to call after the delay has expired
 * @param  {boolean} ignoreAutoInteractStatus	When set to true, will perform the action regardless of auto interact being disabled
 */
function performDelayed(callback, ignoreAutointeractStatus)
{
	console.log("[DEBUG] Entered performDelayed");

	ignoreAutointeractStatus = typeof ignoreAutointeractStatus !== 'undefined' ? ignoreAutointeractStatus : false;

	// Find out how long it has been since this page loaded
	var now							= new Date();
	var millisecondsSincePageLoad 	= now - start;

	console.log("[DEBUG] Page has been loaded for " + millisecondsSincePageLoad + "ms");

	// Add the minimum and random delays
	var randomDelay 				= Math.floor(Math.random() * (maxRandomInterval - minRandomInterval)) + minRandomInterval;
	var linkDelay					= Math.max(0, ((requestDelay + randomDelay) - millisecondsSincePageLoad));

	console.log("[DEBUG] Delay before loading next page was determined as " + linkDelay + "ms");

	setTimeout(function() {
		console.log("[DEBUG] Callback launched");
		callback();
	}, linkDelay);
}

function setAutoInteractActive(toggle)
{
	debugMessage("Setting auto interact to " + (toggle ? "active" : "inactive"));

	// Auto-interact is being activated
	if (toggle) {
        // Run relationships update
        updateRelationshipsNow(() => {
            // Cannot start if the queue is empty
            var queue = getQueue();

            if (!queue || queue.length <= 0) {
                debugMessage("Failed to fetch queue or queue is empty");
                return false;
            }

            // Attempt to find the locale the character is currently at
            setQueueAction("start");

            // Change button text to stop
            $("#missingo-toggleautointeract").val("Stop auto-interact");

            save("missingo_autoInteractActive", true);

            // Start the auto interact process
            doAutoInteract();
        });
	// Auto-interact is being deactivated
	} else {
		// Reset action to "find"
		setQueueAction("find");

		$("#missingo-toggleautointeract").val("Start auto-interact");

		save("missingo_autoInteractActive", false);
	}
}

function updateRelationshipsNow(callback)
{
    displayBackdrop("Updating relationships...");
    var relationsURL	= window.location.origin + '/World/Popmundo.aspx/Character/Relations/' + character.id + '#update';
    //var relationsURL    = 'about:blank';
    var relationsFrame	= '<iframe id="pa-relFrame" src="' + relationsURL + '" style="display:none;"></iframe>';

    setTimeout(function() {
        $("body").append(relationsFrame);
        $("#pa-relFrame").load(function() {
            var thisFrame = $("#pa-relFrame").contents();

            // Update with current list
            var table	  = $(thisFrame).find("table.data tbody");
            updateRelations(table);

            // Check if there is a next page, and navigate to it if needed
            if ($(thisFrame).find("#ctl00_cphLeftColumn_ctl00_ddlShowPage option").length > 0) {
                var numPages  = $(thisFrame).find("#ctl00_cphLeftColumn_ctl00_ddlShowPage option").length;
                var curPage   = $(thisFrame).find("#ctl00_cphLeftColumn_ctl00_ddlShowPage").val();
            } else {
                numPages = 1;
                curPage = 1;
            }

            changeBackdropMessage('Updating relationships (Page '+curPage+'/'+numPages+')...')

            if (curPage < numPages) {
                setTimeout(function() {
                    $(thisFrame).find("#ctl00_cphLeftColumn_ctl00_ddlShowPage").val(++curPage);
                    $(thisFrame).find("#ctl00_cphLeftColumn_ctl00_ddlShowPage").trigger('change');
                }, 250);
            } else {
                changeBackdropMessage('Done!')
                // Update timestamp
                character.lastRelationshipUpdate = Date.now();
                storeCharacter(character);
                // Remove backdrop
                setTimeout(function() {$("#missingo-backdrop").fadeOut(500)}, 1000);
                $("#pa-relFrame").remove();

                callback();
            }
        });
    }, 250);
}

// todo:meant for personal use, remember to remove this before publishing
let parseConversation = async function(doc, other_id) {
	if (! enable_api) {
		throw "API Disabled";
		return;
	}

	let messages = doc.querySelectorAll("div.tbc");
    let parsedMessages = [];

    if (! messages) {
        // No messages detected
        return;
    }

    messages.forEach(function(message) {
		if (message.classList.contains("tbcb")) {
			return;
		}

		let parsedMessage = {};

        // Prevent the message from being changed in the DOM
        let clonedMessage = message.cloneNode(true);

        // Elements with class "float_right" are the buttons on top of the message; these need to be removed
        let elementsToRemove = clonedMessage.querySelectorAll(".float_right");
        if (elementsToRemove) {
            elementsToRemove.forEach(function(element) {
                element.parentNode.removeChild(element);
            });
        }

        parsedMessage.message = clonedMessage.innerHTML;
        parsedMessage.message = parsedMessage.message.replace(/\<blockquote(.+?)hidden\"\>(.+)\<\/blockquote\>/g, '$2').trim(); // Remove spoiler tags
        clonedMessage = null; // No longer needed

        // Parse sender and receiver
        let other_name = 'unknown';
        if (! other_id) {
			other_id = 0;

			// The id of the character being conversed with can be found in the url
			let other_id_regex = /Conversation\/([0-9]+)/.exec(doc.location);

			if (other_id_regex !== null) {
				other_id = other_id_regex[1];
			}
		}

        try {
            // The name of the character being conversed with can be found in first anchor element under the only h1 element on the page
            other_name = doc.querySelector("h1").parentNode.querySelector("a").innerText;
        } catch (e) {}

        parsedMessage.own_id = character.id;
        parsedMessage.own_name = character.name;
        parsedMessage.partner_id = other_id;
        parsedMessage.partner_name = other_name;

        if (message.classList.contains("tbcg")) { // "tbcw" is a message received by the active character, "tbcg" is sent by the active character
            parsedMessage.is_own_message = 1;
        } else {
            parsedMessage.is_own_message = 0;
        }

        // Parse message timestamp
        try {
            parsedMessage.received = /<img(.+?)>(.+)/.exec(message.parentNode.querySelector("p").innerHTML)[2];
        } catch(e) {
            parsedMessage.received = null;
        }

        parsedMessages.push(parsedMessage);
    });

    // Now encode end send parsedMessages
    let encoded = parsedMessages;
    let endpoint = "https://bheuv.stage-game.com/popmundo/assistant/api/api.php?action=archive";

    let response = await axios({
		timeout: 1000,
        method: 'post',
        url: endpoint,
        headers: {
            'Content-Type': 'text/plain'
        },
        data: {
            messages: encoded
        },
	});
	
	if (response.status == 418) {
		app.save('enable_api', false);
	}
};

function hasRelationship()
{
	var text = $("h2#ctl00_cphTopColumn_ctl00_hdrPeopleInfo").parent().find("p").first().text();

	if (text.indexOf('You don\'t know this character.') !== -1) {
		return false;
	} else {
		return true;
	}
}


function highlightQueuePosition()
{
	var queuePosition   = getQueuePosition();

	// Remove the highlight class from all elements
	$("table#missingo-queue tbody tr").removeClass("highlight");

	// Then add the highlight class to the active element
	var row = $("table#missingo-queue tbody tr").eq(queuePosition);
	$(row).addClass("highlight");

	var rVal = $(row).find("input[name='active-contact']").val();
	$('input[name="active-contact"]').val([rVal]);

	//$("table#missingo-queue").find("input[name='active-contact']").removeAttr("checked");
}

function setAutoInteractStatus(status)
{
	document.title = status;
	//$("span#missingo-statustext").text(status);
}

function getQueuePosition()
{
	var ownID		= character.id;
	var position	= 0;
	var queue		= getQueue();

	if (ownID > 0) {

		position = load('missingo_' + ownID.toString() + '_queuePosition', 0);
		if (position >= queue.length) { position = (queue.length-1); }
		return (position >= 0) ? position : 0;
	}
}

function getQueueAction()
{

	return load("missingo_queueAction", "find");
}

function setQueueAction(action)
{
	save("missingo_queueAction", action);
}

/**
 * Stores the active character in the data storage
 *
 **/
function storeActiveCharacter()
{
	var characterID = $("#ctl00_ctl05_ucCharacterBar_ddlCurrentCharacter").val();

	if (characterID) {
		save("missingo_activeCharacterID", characterID);
	} else {
		GM_deleteValue("missingo_activeCharacterID");
	}
}

/**
 * Retrieves the active character from data storage
 *
 **/

function serialize(value)
{
	return JSON.stringify(value);
}

function unserialize(value)
{
	return JSON.parse(value);
}

function linkCharacter(id, name) {

	var link = urlToCharacter(id);
	link	 = '<a href="' + link + '">' + name + '</a>';
	return link;
}

function urlToCharacter(id)
{
	return window.location.origin + characterURL + id;
}

function setRelationshipProperty(character, otherID, property, value)
{
	var relationship    = getRelationship(character, otherID);
	property            = property.toString();

	relationship[property] = value;

	storeRelationship(character, relationship);
}

function deleteRelationship(relationship, reason)
{
	// Set default reason when no reason is provided or an empty string is passed
	if (typeof reason === 'undefined' || reason.length === 0) {
		reason = 'Unknown reason';
	}

	relationship.endedOn = new Date();
	relationship.endedReason = reason;
	relationship.status = 'ended';
	removeFromQueue(relationship.other);
	storeRelationship(character, relationship);
}

function deleteFromRelationshipList(id)
{
	var list	= getRelationshipList(character);
	var index	= list.indexOf(id);

	if (index > -1) {
		list.splice(index, 1);
	}

	storeRelationshipList(list);
}

function storeRelationshipList(list)
{
	save(character.id + "_relationships", serialize(list));
}

function insertQueueFunctions()
{
	var functions = '<div class="box"><h2>Popmundo Assistant</h2>';
	functions += '<input type="button" id="missingo-queue-addall" value="Add all to queue" />';
	functions += '</div>';

	$('table.data').first().before(functions);

	$('#missingo-queue-addall').click(function() {
		fillQueue();
		insertStatus();
	});
}

/**
 * Attempts to fetch information regarding the current locale from the DOM
 * @return Object
 */
function getLocale()
{
	var localeLink	= $("div.characterPresentation p a[href*=\"/World/Popmundo.aspx/Locale/\"]").first();
	var locale		= new Object();

	if (localeLink.length > 0) {
		// Something was found
		var text        = $(localeLink).attr('href');
		var pattern     = /\/([0-9]+)/g;
		var match       = pattern.exec(text);

		if (match && match.length >= 2) {
			localeId = match[1];

			locale.id	= match[1];
			locale.name = $(localeLink).text();
		}
	}

	return locale;
}

function insertStatusWindow(displayStatsForID)
{
	if (typeof displayStatsForID === "undefined") {
		displayStatsForID = 0;
	}

	// Remove the status window if it already exists
	$("#missingo-status").remove();

	// Build a return link if it was specified

	var returnLocaleId		= load("returnLocaleId", 0);
	var returnLocaleName	= load("returnLocaleName", '');
	var returnLink			= "";
	var version				= GM_info.script.version;

	if (returnLocaleId > 0) {
		// There is a return locale defined http://85.popmundo.com/World/Popmundo.aspx/Locale/MoveToLocale/18

		// Check if we are in the same locale
		var currentLocale = getLocale();
		if (!currentLocale.id || currentLocale.id != returnLocaleId) {
			returnLink = " <a class=\"btn btn-info\" href='" + window.location.origin + "/World/Popmundo.aspx/Locale/MoveToLocale/" + returnLocaleId.toString() + "'>Return to " + returnLocaleName + "</a>";
		}
	}

	var statusWindow = "\
		<div id=\"missingo-status\" class=\"missingo-modal\" style=\"position:fixed; z-index:10001; width:489px;top:177px; background-color:#eeeeee;border-radius:7px;left:50%;margin-left:-244px;box-sizing:border-box;\">\
			<h2 style=\"user-select:none;-moz-user-select:none;-webkit-user-select:none;cursor:move;background-color:#56686F;margin-top:0;color: #FFFFFF;font-size: 12px;font-weight: 500;padding: 5px 5px 5px 10px;background-image: url('http://popmundo.com/App_Themes/Default/Images/bgr-item-header.png');background-repeat: repeat-x;border-top-left-radius:7px;border-top-right-radius:7px;text-align:center;\">Popmundo Assistant\
			<span style=\"float:right;color:#eeeeee;font-weight:bold;background-color:#3e484d;border-radius:15px;padding:0px 5px;cursor:pointer;\" class=\"close\">x</span></h2>\
			<div class=\"missingo-modal-inner\" style=\"padding:3px;max-width:100%;height:400px;max-height:400px;overflow-y:auto;\">\
				<select id=\"missingoStatSelect\" class=\"form-control\"><optgroup label=\"Special\"><option value=\"0\">Global</option><option value=\"-1\">Settings</option></optgroup><optgroup label=\"Characters\"></optgroup></select>\
				<hr />\
			</div>\
			<div>Popmundo Assistant version " + version + ".</a></div>\
			<div class=\"missingo-modal-actions\" style=\"box-sizing:border-box;width:100%;background:#d1d1d1;border-bottom-left-radius:7px;border-bottom-right-radius:7px;padding:3px;\">\
				<a href=\"#\" class=\"btn btn-primary close\">Close</a>" + returnLink + "\
			</div>\
		</div>\
	";

	// Append to body
	$("body").append(statusWindow);

	var relationshipList 	= getRelationshipList(character);
	var statSelect			= $("#missingoStatSelect").first();
	var statSelectChars		= $(statSelect).children("optgroup[label='Characters']");
	var charactersSnuggled	= 0;
	var mostSnugglesDone	= 0;
	var mostSnugglesReceived= 0;
	var mostSnugglesTotal = 0;
	var mostSnugglesReceivedBy = null;
	var mostSnugglesDoneTo = null;
	var mostSnugglesTotalWith = null;

	relationshipList.forEach(function(entry) {
		var relationship = getRelationship(character, entry);

		if (relationship.snugglesReceived > 0 || relationship.snugglesPerformed > 0) {
			if (relationship.snugglesReceived > mostSnugglesReceived) {
				mostSnugglesReceivedBy	= relationship.other;
				mostSnugglesReceived	= relationship.snugglesReceived;
			}
			if (relationship.snugglesPerformed > mostSnugglesDone) {
				mostSnugglesDoneTo		= relationship.other;
				mostSnugglesDone		= relationship.snugglesPerformed;
			}
			if (relationship.snugglesPerformed + relationship.snugglesReceived > mostSnugglesTotal) {
				mostSnugglesTotalWith		= relationship.other;
				mostSnugglesTotal			= relationship.snugglesPerformed + relationship.snugglesReceived;
			}
			charactersSnuggled++;
		}

		if (relationship.name) {
			$(statSelectChars).append('<option value="' + entry + '">' + relationship.name + '</option>');
		}
	});

	character.mostSnugglesDoneTo = mostSnugglesDoneTo;
	character.mostSnugglesReceivedBy = mostSnugglesReceivedBy;
	character.mostSnugglesTotal = mostSnugglesTotalWith;
	character.charactersSnuggled = charactersSnuggled;
	storeCharacter(character);

	$(statSelectChars).children("option").sort(function(a,b){
		a = $(a).text();
		b = $(b).text();

		return a>b;
	}).appendTo(statSelectChars);

	// Make the correct item active
	$(statSelect).val(displayStatsForID);

	$(statSelect).change(function(e) {
		var value = $(statSelect).val();
		updateStatusWindow(value);
	});

	updateStatusWindow(displayStatsForID);

	// Make window movable
	$("#missingo-status").draggable({ handle: "h2" });

	// Allow window to be dismissed
	$("#missingo-status h2 span.close").first().click(function() {
		$("#missingo-status").fadeOut();
		$("#missingo-backdrop").fadeOut();
	});

	$("#missingo-status .missingo-modal-actions a.close").first().click(function() {
		$("#missingo-status").fadeOut();
		$("#missingo-backdrop").fadeOut();
	});
}

function getRelationshipList(character)
{
	return Object.keys(character.relationships);
}

function cleanRelationshipList(character)
{
	var list = Object.keys(character.relationships);

	list.forEach(function(key) {
		if (!key.toString().match(/^([0-9]+)$/)) {
			console.log("[DEBUG] Found non-conform " + key);
			delete character.relationships[key];
			storeCharacter(character);
		}
	});
}

function getCharacter(characterID)
{
	var startTime	= new Date();
	var storageKey	= characterID + "_character";
	var storedData	= load(storageKey, false);
	var returnVal;

	if (storedData !== false) {
		returnVal = unserialize(storedData);
	} else {
		storedData = new Object();
		storedData.id = characterID;
		returnVal = storedData;
	}

	console.log("Retrieved character information (size " + storedData.length + " in " + (new Date().getTime() - startTime.getTime()) + "ms)");
	return returnVal;
}

function storeCharacter(character)
{
	if (character.hasOwnProperty("id")) {
		save(character.id + "_character", serialize(character));
		return true;
	}

	return false;
}

function pad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function millisToReadable(milliseconds)
{
	x = milliseconds / 1000;
	seconds = Math.round(x % 60);
	x /= 60;
	minutes = Math.round(x % 60);
	x /= 60;
	hours = Math.round(x % 24);
	x /= 24;
	days = Math.round(x);

	return pad(hours.toString(), 2) + ':' + pad(minutes.toString(), 2);
}

function updateStatusWindowGlobal()
{

	// Statistics
	var autoInteractTotal		= load(storageNumAutoInteractionsStat, 0);
	var autoInteractSession 	= load(storageNumAutoInteractionsStat + "_session", 0);
	var timeSpentTotal			= millisToReadable(load(storageTimeSpentStat, 0));
	var timeSpentSession		= millisToReadable(load(storageTimeSpentStat + "_session", 0));
	var pageViewTotal			= load(storageNumPagesStat, 0);
	var pageViewSession			= load(storageNumPagesStat + "_session", 0);
	var manualInteractTotal		= load(storageNumManualInteractionsStat, 0);
	var manualInteractSession	= load(storageNumManualInteractionsStat + "_session", 0);
	var mostSnugglesReceived	= character.mostSnugglesReceivedBy ? getRelationship(character.id, character.mostSnugglesReceivedBy) : null;
	var mostSnugglesDone		= character.mostSnugglesDoneTo ? getRelationship(character.id, character.mostSnugglesDoneTo) : null;
	var mostSnugglesTotal		= character.mostSnugglesTotal ? getRelationship(character.id, character.mostSnugglesTotal) : null;

	var table = "";

	table += "\
		<div id=\"missingo-statistics\">\
			<table id=\"missingo-statistics-table\" class=\"table table-striped table-condensed\" style=\"margin:0;\">\
				<thead>\
					<tr><th>Attribute</th><th>Session</th><th>Lifetime</th></tr>\
				</thead>\
				<tbody>\
					<tr><td>Automatic interactions done</td><td>" + autoInteractSession + "</td><td>" + autoInteractTotal + "</td></tr>\
					<tr><td>Manual interactions done</td><td>" + manualInteractSession + "</td><td>" + manualInteractTotal + "</td></tr>\
					<tr><td>Hours spent playing</td><td>" + timeSpentSession + "</td><td>" + timeSpentTotal + "</td></tr>\
					<tr><td>Number of pages viewed</td><td>" + pageViewSession + "</td><td>" + pageViewTotal + "</td></tr>\
				</tbody>\
			</table>\
		</div>\
	";

	/*
	<tr><td>Characters snuggled</td><td></td><td>" + character.charactersSnuggled + "</td></tr>\
					<tr><td>Most snuggles received from</td><td></td><td>" + mostSnugglesReceived.name + " (" + mostSnugglesReceived.snugglesReceived + ")</td></tr>\
					<tr><td>Most snuggles done to</td><td></td><td>" + mostSnugglesDone.name + " (" + mostSnugglesDone.snugglesPerformed + ")</td></tr>\
					<tr><td>Most snuggles with</td><td></td><td>" + mostSnugglesTotal.name + " (" + (mostSnugglesTotal.snugglesPerformed + mostSnugglesTotal.snugglesReceived) + ")</td></tr>\
	 */

	$("#missingo-status div.missingo-modal-inner").append(table);
}

function updateStatusWindowSettings()
{
	var table = '\
		<div id="missingo-statistics">\
			<table id="missingo-statistics-table" class="table table-striped" style="margin:0;">\
				<tr>\
					<td>\
						<input type="checkbox" id="missingo-fraternize" />\
					</td>\
					<td>\
						<label for="missingo-fraternize">Use 6-hour cooldown (character is fraternizing).</label>\
					</td>\
				</tr>\
				<tr>\
					<td>\
						<input type="checkbox" id="missingo-hidecooldown" />\
					</td>\
					<td>\
						<label for="missingo-hidecooldown">Hide relationships from the queue while they are on cooldown.</label>\
					</td>\
				</tr>\
				<tr>\
					<td>\
						<input type="number" id="missingo-onesidedperiod" min="0" max="365" style="width:45px;height:20px;" />\
					</td>\
					<td>\
						<label for="missingo-onesidedperiod">Mark relationships as one sided when the other side hasn\'t interacted back in this many days (set to zero to disable).</label>\
					</td>\
				</tr>\
				<tr>\
					<td>\
						<input type="checkbox" id="missingo-nospank" />\
					</td>\
					<td>\
						<label for="missingo-nospank">Do not spank.</label>\
					</td>\
				</tr>\
				<tr>\
					<td>\
						<input type="checkbox" id="missingo-stylelinks" />\
					</td>\
					<td>\
						<label for="missingo-stylelinks">Style links to characters you have a relationship with.</label>\
					</td>\
				</tr>\
				<tr>\
					<td>\
						<input type="checkbox" id="missingo-skipnoauto" />\
					</td>\
					<td>\
						<label for="missingo-skipnoauto">Completely skip characters without auto-interact enabled.</label>\
					</td>\
				</tr>\
				<tr>\
					<td>\
						<input type="checkbox" id="pa-interactsamecityonly" />\
					</td>\
					<td>\
						<label for="pa-interactsamecityonly">Skip characters that are in a different city.</label>\
					</td>\
				</tr>\
				<tr>\
					<td>\
						<input type="checkbox" id="PA-enableNotificationSound" />\
					</td>\
					<td>\
						<label for="PA-enableNotificationSound">Play a sound for notifications</label> (<a href="#" id="PA-soundPreview">preview</a>).\
					</td>\
				</tr>\
				<tr>\
					<td colspan="2">\
						<button id="shuffleQueue" class="btn btn-default btn-block">Shuffle Queue</button>\
					</td>\
				</tr>\
			</table>\
		</div>\
	';

	$("#missingo-status div.missingo-modal-inner").append(table);

	$("#shuffleQueue").click(function() {
		shuffleQueue();
		insertStatus();
	});

	if (character.fraternize) {
		$("#missingo-fraternize").prop('checked', true);
	}

	if (character.styleLinks) {
		$("#missingo-stylelinks").prop('checked', true);
	}

	if (character.noSpank) {
		$("#missingo-nospank").prop('checked', true);
	}

	if (character.skipNoAuto) {
		$("#missingo-skipnoauto").prop('checked', true);
	}

	if (character.settingInteractSameCityOnly) {
		$("#pa-interactsamecityonly").prop('checked', true);
	}

	if (enableNotificationSound) {
		$("#PA-enableNotificationSound").prop('checked', true);
	}

	$("#PA-soundPreview").click(function() {playNotificationSound();});

	$('#PA-enableNotificationSound').change(function() {
		enableNotificationSound = $(this).prop("checked");
		save('enableNotificationSound', enableNotificationSound);
	});

	$("#missingo-fraternize").change(function() {
		character.fraternize = $(this).prop("checked");
		storeCharacter(character);
	});

	$("#missingo-stylelinks").change(function() {
		character.styleLinks = $(this).prop("checked");
		storeCharacter(character);
	});

	$("#missingo-nospank").change(function() {
		character.noSpank = $(this).prop("checked");
		storeCharacter(character);
	});

	$("#missingo-skipnoauto").change(function() {
		character.skipNoAuto = $(this).prop("checked");
		storeCharacter(character);
	});

	$("#pa-interactsamecityonly").change(function() {
		character.settingInteractSameCityOnly = $(this).prop("checked");
		storeCharacter(character);
	});

	if (character.hideCooldown) {
		$("#missingo-hidecooldown").prop('checked', true);
	}

	$("#missingo-hidecooldown").change(function() {
		character.hideCooldown = $(this).prop("checked");
		storeCharacter(character);
		insertStatus();
	});

	if (character.hasOwnProperty("oneSidedPeriod")) {
		$("#missingo-onesidedperiod").val(parseInt(character.oneSidedPeriod));
	} else {
		$("#missingo-onesidedperiod").val(14);
		character.oneSidedPeriod = 14;
		storeCharacter(character);
	}

	$("#missingo-onesidedperiod").change(function() {
		character.oneSidedPeriod = Math.min(356, Math.max(0, parseInt($(this).val())));
		storeCharacter(character);
	});
}

function updateStatusWindowCharacter(characterID)
{

	var relationship		= getRelationship(character, characterID);
	var cooldownEndRelativeVal = "Now";

	if (relationship.firstDailyInteraction && relationship.hasOwnProperty('interactionsAvailable') && relationship.interactionsAvailable <= 0) {
		var cooldownEnd = new Date(relationship.firstDailyInteraction);
		cooldownEnd.setTime(cooldownEnd.getTime() + getCooldownPeriod());
		var now = new Date();

		if (now.getTime() < cooldownEnd.getTime()) {
			cooldownEndRelativeVal	= moment.to(cooldownEnd);
		}
	}

	var data = {
		interactionsDone:		relationship.interactionsDone ? relationship.interactionsDone : 0,
		interactionsReceived:	relationship.interactionsReceived ? relationship.interactionsReceived : 0,
		selfName: character.name,
		name: relationship.name,
		firstInteractionReceived: relationship.firstInteractionReceived ? moment(relationship.firstInteractionReceived).format('LL') : 'Never',
		firstInteractionReceivedTS: relationship.firstInteractionReceived ? relationship.firstInteractionReceived : '',
		firstInteractionDone: relationship.firstInteractionDone ? moment(relationship.firstInteractionDone).format('LL') : 'Never',
		firstInteractionDoneTS: relationship.firstInteractionDone ? relationship.firstInteractionDone : '',
		lastInteractionReceived: relationship.lastInteractionReceived ? moment(relationship.lastInteractionReceived).format('LL') : 'Never',
		lastInteractionReceivedTS: relationship.lastInteractionReceived ? relationship.lastInteractionReceived : '',
		lastInteractionDone: relationship.lastInteractionDone ? moment(relationship.lastInteractionDone).format('LL') : 'Never',
		lastInteractionDoneTS: relationship.lastInteractionDone ? relationship.lastInteractionDone : '',

		cooldownEndRelative: cooldownEndRelativeVal,

		snugglesReceived: relationship.snugglesReceived ? relationship.snugglesReceived : 0,
		snugglesPerformed: relationship.snugglesPerformed ? relationship.snugglesPerformed : 0
	};

	var table = sprintf('\
		<div id="missingo-statistics">\
			<table id="missingo-statistics-table" class="table table-striped table-condensed" style="margin:0;">\
				<col class="attrCol" />\
				<col class="valCol" />\
				<col class="valCol" />\
				<thead>\
					<tr><th>Attribute</th><th>You</th><th>Them</th></tr>\
				</thead>\
				<tbody>\
					<tr><td>Name</td><td>%(selfName)s</td><td>%(name)s</td></tr>\
					<tr>\
						<td>Interactions done</td>\
						<td>%(interactionsDone)s</td>\
						<td>%(interactionsReceived)s</td>\
					</tr>\
					<tr>\
						<td>Snuggles</td>\
						<td>%(snugglesPerformed)s</td>\
						<td>%(snugglesReceived)s</td>\
					</tr>\
					<tr>\
						<td>First interaction</td>\
						<td><span data-reldate="%(firstInteractionDoneTS)s">%(firstInteractionDone)s</span></td>\
						<td><span data-reldate="%(firstInteractionReceivedTS)s">%(firstInteractionReceived)s</span></td>\
					</tr>\
					<tr>\
						<td>Latest interaction</td>\
						<td><span data-reldate="%(lastInteractionDoneTS)s">%(lastInteractionDone)s</span></td>\
						<td><span data-reldate="%(lastInteractionReceivedTS)s">%(lastInteractionReceived)s</span></td>\
					</tr>\
					<tr>\
						<td>Next available</td>\
						<td>%(cooldownEndRelative)s</td>\
						<td>&nbsp;</td>\
				</tbody>\
			</table>\
			<input id="missingo-btnForgetRelationship" type="button" class="btn btn-danger" value="forget" />\
		</div>\
	', data);

	$("#missingo-status div.missingo-modal-inner").append(table);

	// Todo: remove this
	$("#missingo-btnForgetRelationship").click(function() {
		var reason = window.prompt('Enter a reason to end this relationship, or choose cancel to keep the relationship', 'Unknown reason');

		if (reason === null) {
			// Cancel was chosen, do not continue
			return false;
		} else {
			// The OK button was pressed
			deleteRelationship(relationship, reason);
		}

		return false;
	});

	$("#missingo-statistics span[data-reldate]").filter(function() {
		return $(this).attr("data-reldate") != '';
	}).each(function() {
		$(this).attr('title', moment.to($(this).attr('data-reldate'))).addClass("relative-date");
	});
}

function updateStatusWindow(statisticFor)
{
	statisticFor = parseInt(statisticFor);

	// Check if the status window exists
	if ($("#missingo-status").length < 1) { return false; }

	// Remove the table if it already exists
	$("#missingo-statistics").remove();


	if (statisticFor === 0) {
		// Global stats
		updateStatusWindowGlobal();
	} else if(statisticFor === -1) {
		// -1 = Settings window
		updateStatusWindowSettings();
	} else {
		updateStatusWindowCharacter(statisticFor);
	}
}

function insertBackdrop()
{
	// Remove backdrop if it already exists
	$("#missingo-backdrop").remove();

	// Inisialize as empty string
	var window = "";

	window +="\
		<div id=\"missingo-backdrop\" style=\"display:none;position:fixed;left:0;top:0;background-color:#000;opacity:0.85;z-index:10000;bottom:0;right:0;\"></div>\
	";

	// Append to body
	$("body").append(window);

	// Allow backdrop to close by clicking on it
	$("#missingo-backdrop").click(function() {
		// Call all open modals to close
		$(".missingo-modal h2 span.close").click();
	});
}

function displayBackdrop(message)
{
	$("#missingo-backdrop").show();

	if (typeof message !== 'undefined') {
		$("#missingo-backdrop").append("<div style='padding-top:200px;color:#fff;text-align:center;font-size:32pt;'>" + message + "</div>");
	}
}

function changeBackdropMessage(message)
{
	$("#missingo-backdrop div").text(message);
}

function checkCooldownPassed(relationship)
{
	// If interactions have been detected to be available, there's no reason to care about the cooldown
	if (!relationship.hasOwnProperty("interactionsAvailable") || relationship.interactionsAvailable > 0) {
		return true;
	}

	if (!relationship.hasOwnProperty("firstDailyInteraction")) {
		return true;
	}

	// Otherwise, calculate if we are past the coolodwn period
	var cooldownPeriod = getCooldownPeriod();					// 12 Hours

	// If it is set, find out if the cooldown has passed
	var now    		= new Date();
	var lastDate    = new Date(relationship.firstDailyInteraction);

	// Calculate difference in hours
	var diff    	= now.getTime() - lastDate.getTime();

	return (diff >= cooldownPeriod);
}

function getCooldownPeriod()
{
	if (character && character.hasOwnProperty("fraternize") && character.fraternize) {
		return (6*60*60*1000); // 6 Hours when fraternizing
	} else {
		return (12*60*60*1000); // 12 Hours in every other case
	}
}

function renderRelationship(relationship)
{
	var render       = '';
	var classes      = '';

	var filterQueue = 0;

	if (character.hasOwnProperty('filterQueue')) {
		filterQueue = parseInt(character.filterQueue);
	} else {
		character.filterQueue = filterQueue;
	}


	// Render only entries that fit within the current filter (and file all legacy 'undefined' modes as default)
	if (filterQueue < 0 || (filterQueue === parseInt(relationship.mode) || filterQueue === 0 && typeof relationship.mode == 'undefined')) {

	} else {
		classes += ' hide';
	}

	// Apply cooldown class if the character is currently estimated to be non-interactable
	if (checkCooldownPassed(relationship) == false) {
		// There are no interactions left on this relationship, display it as being on cooldown
		classes += ' cooldown';

		if (character.hideCooldown) {
			classes += ' hide';
		}
	} else if(new Date(relationship.lastCallDone).getTime() > new Date().getTime() - getCooldownPeriod()) {
		//This relationship is on phone cooldown (called within the last cooldown period)
		classes += ' cooldown phone';

		if (character.hideCooldown) {
			classes += ' hide';
		}
	} else if (relationship.interactfail) {
		// There were errors during the last time we tried to interact with this person, display it as failed
		//classes += ' failed';
	}

	if (isCharacterInSameCity(relationship)) {
		classes += ' same-city';
	}

	if (character.hasOwnProperty("oneSidedPeriod") && character.oneSidedPeriod > 0) {
		if (relationship.hasOwnProperty("lastInteractionReceived") && new Date(relationship.lastInteractionReceived).getTime() < (new Date(relationship.lastInteractionDone).getTime() - character.oneSidedPeriod*24*60*60*1000)) {
			classes += ' onesided';
		} else if (relationship.hasOwnProperty("firstInteractionDone") && !relationship.hasOwnProperty("lastInteractionReceived") && new Date(relationship.firstInteractionDone).getTime() < (new Date(relationship.lastInteractionDone).getTime() - character.oneSidedPeriod*24*60*60*1000)) {
			// Fix for characters that have never interacted back
			classes += ' onesided';
		}
	}

	if (relationship.snugglesReceived > 0 || relationship.snugglesPerformed > 0) {
		classes += ' snuggled';
	}

	if (relationship.otherRomance > 0) {
		classes += ' other-romance';
	}

	var snuggleSign = '%';
	if (relationship.gender === 'm' && character.gender === 'm') {
		snuggleSign = '\u26A3';
	}

	if ((relationship.gender === 'm' && character.gender === 'f') || (relationship.gender === 'f' && character.gender === 'm')) {
		snuggleSign = '\u26A4';
	}

	if (relationship.gender === 'f' && character.gender === 'f') {
		snuggleSign = '\u26A2';
	}

	// Render the attributes for the relationship
	render			+= '<tr class="queue-entry ' + classes + '"';
	render          += ' data-charid="' + relationship.other + '"';

	if(relationship.interactfail) {
		render += ' title="' + relationship.interactFailReason + '"';
	}

	render          += '>';
	//render          += '<td class="missingo-delete" title="Remove from queue" data-charid="' + relationship.other + '">[x]</td> ';
	render          += '<td>' + linkCharacter(relationship.other, relationship.name) + '</td>';

	render			+= (relationship.allowFriendship) ? '<td class="friend">&#9787;</td>' : '<td class="friend inactive">&#9787;</td>'
	render     		+= (relationship.allowRomance) ? '<td class="love">&hearts;</td>' : '<td class="love inactive">&hearts;</td>';
	render      	+= (relationship.allowSnuggle) ? '<td class="sex">'+ snuggleSign +'</td>' : '<td class="sex inactive">'+ snuggleSign +'</td>';
	render			+= (relationship.allowAutoInteract) ? '<td class="auto">A</td>' : '<td class="auto inactive">A</td>';

	render          += '</tr>';

	return render;
}

function styleLinks()
{
	var relationships	= Object.keys(character.relationships);
	var characterLinks  = document.getElementById('ppm-content');

	relationships.forEach(function(styleRelationship) {
		var relationship = getRelationship(character, styleRelationship);

		Array.from(characterLinks.querySelectorAll("#ppm-main a[href$='"+ relationship.other +"']")).forEach(function(item) {
			item.classList.add('relationship');

			if (relationship.status === 'ended') {
				item.classList.add('ended');
			}

			if (relationship.allowFriendship) {
				item.classList.add('friend');
			}

			if (relationship.allowRomance) {
				item.classList.add('romance');
			}

			if (relationship.allowSnuggle) {
				item.classList.add('snuggle');
			}
		});

	});
}

function insertStatus()
{
	// Remove the status window if it exists (re-draw)
	let sidebar = document.getElementById('missingo-sidebar');
	if (sidebar) {sidebar.parentNode.removeChild(sidebar)}

	if (app.settings.get('hideSidebar') == 1) {
		return;
	}

	var startTime = new Date();

	var relationship;


	// Retrieve the queue
	var queue	= null;
	var status	= '<div id="missingo-sidebar" style="position:fixed;left:0;top:0;bottom:30px;width:250px;overflow:hidden;box-shadow:1px 1px 5px rgba(0,0,0,0.3);background-color: #eeeeee;border-right: 1px solid #8d9aa0;">';
	var data	= null;
	var autoInteractButtonValue = isAutoInteractActive() ? "Stop" : "Start";
	var autoInteractButtonClass = isAutoInteractActive() ? "btn-danger" : "btn-success";

	var filterOptions = '<option value="-1">All</option>';

	for (var id in groupMap) {
		filterOptions += '<option value="'+id+'">'+groupMap[id]+'</option>';
	};

	status += '<div id="missingo-sidebar-top"><h2 id="missingo-header" style="text-align:center;position:relative;width:100%;max-width:100%;margin-bottom:0px;">Popmundo Assistant</h2>';
	status += '\
				<div style="width:100%">\
					<div class="btn-group btn-group-justified">\
						<a role="button" id="missingo-toggleautointeract" class="btn ' + autoInteractButtonClass + '">' + autoInteractButtonValue + '</a>\
						<a role="button" id="missingo-settings" class="btn btn-primary">Settings</a>\
					</div>\
					<div>\
						<select id="pa-queue-filter">'+filterOptions+'</select>\
						<input type="checkbox" id="hide-queue-toggle" /><label for="hide-queue-toggle" title="Hiding the queue may improve performance."> Hide Queue</label>\
					</div>\
					<div>\
						<div class="input-group">\
						  <span class="input-group-btn">\
							<select class="form-control input-sm" id="pa-queue-sort">\
								<option value="0">Order by...</option>\
								<optgroup label="Special">\
									<option value="shuffle" data-confirm="shuffling">Random (shuffle)</option>\
								</optgroup>\
								<optgroup label="Enabled interactions">\
									<option data-confirm="allowed romance" value="romance">Romance allowed</option>\
									<option data-confirm="allowed friendship" value="friendship">Friendship allowed</option>\
									<option data-confirm="allowed snuggles" value="snuggles">Snuggles allowed</option>\
								</optgroup>\
								<optgroup label="Relationship progress">\
									<option data-confirm="highest romance" value="romance-p">Highest romance</option>\
									<option data-confirm="highest friendship" value="friendship-p">Highest friendship</option>\
								</optgroup>\
								<optgroup label="Time">\
									<option data-confirm="the last time they interacted with you" value="last-interaction-from">Last interaction from</option>\
									<option data-confirm="the last time you interected with them" value="last-interaction-to">Last interaction to</option>\
									<option data-confirm="the last time you snuggled" value="last-snuggle">Last snuggle</option>\
								</optgroup>\
								<optgroup label="Total interactions">\
									<option data-confirm="most snuggles done to" value="most-snuggles-performed">Most snuggles done to</option>\
									<option data-confirm="most snuggles received from" value="most-snuggles-received">Most snuggles received</option>\
									<option data-confirm="most total snuggles" value="most-snuggles">Most snuggles (total)</option>\
									<option data-confirm="most interactions done to" value="most-interactions-performed">Most interactions done to</option>\
									<option data-confirm="most interactions received from" value="most-interactions-received">Most interactions received</option>\
									<option data-confirm="most total interactions" value="most-interactions">Most interactions (total)</option>\
								</optgroup>\
							</select>\
						  </span>\
						</div>\
					</div>\
				</div>\
			</div>\
			<div id="missingo-innerstatus" style="position:relative;width:100%;max-width:100%;max-height:100%;top:0;">\
				<span id="missingo-statustext"></span>\
				<table id="missingo-queue" class="table">\
					<tbody>\
					</tbody>\
				</table>\
			</div>\
		</div>\
	</div>';

	// Insert the element into the DOM
	var div = document.createElement('div');
	div.innerHTML = status;
	document.body.appendChild(div.firstChild);

	var hideQueue = false;
	var filterQueue = -1;

	if (character.hasOwnProperty('hideQueue')) {
		hideQueue = character.hideQueue;
	} else {
		hideQueue = false;
	}

	if (character.hasOwnProperty('filterQueue')) {
		filterQueue = character.filterQueue;
	} else {
		filterQueue = -1;
	}

	$('#hide-queue-toggle').prop('checked', hideQueue);
	$("#pa-queue-filter").val(filterQueue);

	document.getElementById('hide-queue-toggle').addEventListener('change', function() {
		character.hideQueue = $(this).prop("checked");
		storeCharacter(character);
		insertStatus();
	});

	document.getElementById('pa-queue-filter').addEventListener('change', function() {
		character.filterQueue = $("#pa-queue-filter").val();
		storeCharacter(character);
		insertStatus();
	});

	document.getElementById('pa-queue-sort').addEventListener('change', function() {
		var elem = $("#pa-queue-sort option:selected").first();
		$("#pa-queue-sort").val(0);
		if (!confirm('Are you sure you want to sort the sidebar by ' + $(elem).attr('data-confirm') + '?')) {return;}

		sortQueue($(elem).val());
		insertStatus();
	});

	// Make the width of the sidebar adjustable
	$("#missingo-sidebar").width(load("sidebar_width", 250));
	//$("body").css('padding-left', load("sidebar_width", 250));

	document.getElementById('missingo-toggleautointeract').addEventListener('click', function() {
		var isActive = isAutoInteractActive();

		if (isActive) {
			setAutoInteractActive(false);
		} else {
			setAutoInteractActive(true);
		}
	});

	document.getElementById('missingo-settings').addEventListener('click', function() {
		displayBackdrop();
		insertStatusWindow(-1);
	});

	// Don't render the queue when auto-interact is active
	if (isAutoInteractActive() && hideQueue) {
		// Todo: This is messy, but queue MUST be fetched here if auto-interact is running
		queue = getQueue();

		$("#missingo-queue").append(
			"<tr><td colspan='5'>Auto-interact active</td></tr>\
			<tr><td colspan='5'>" + (getQueuePosition()+1) + "/" + queue.length + "</td></tr>"
		);
		return true;
	} else if (hideQueue) {
		return true;
	} else {
		queue = getQueue();
	}

	if (queue) {
		var cache = '';

		queue.forEach(function(id) {
			data = id.split(':');
			relationship = getRelationship(character, data[0]);
			cache += renderRelationship(relationship);
		});

		$("#missingo-queue").append(cache);
	}

	// Make it clear what the currently active item is
	highlightQueuePosition();

	/*$("#missingo-queue tr td[data-openstats]").click(function() {
		displayBackdrop()
		insertStatusWindow($(this).attr("data-openstats"));
	});*/

	/* ---------------------------------------------------------------------------------------------------
	 * Allow clicking on the icons to toggle the options.
	 *
	 */
	setTimeout(function() {
		var queueTable = document.getElementById("missingo-queue");

		// Set queue position on double click
		Array.from(queueTable.querySelectorAll('tbody tr.queue-entry')).forEach(function(item) {
			// Bind row events
			item.addEventListener('dblclick', function() {
				var pos = $("#missingo-queue tr").index(this);

				if (pos > -1) {
					setQueuePosition(pos);
				}
			});

			item.addEventListener('click', function() {
				showSidebarInfo(this);
			});

			item.querySelector('a').addEventListener('click', function(e) {e.stopPropagation();});
			item.querySelector('td.friend').addEventListener('click', function(e) {toggleQueueAttribute(this.parentElement, 'friend');e.stopPropagation();});
			item.querySelector('td.love').addEventListener('click', function(e) {toggleQueueAttribute(this.parentElement, 'love');e.stopPropagation();});
			item.querySelector('td.sex').addEventListener('click', function(e) {toggleQueueAttribute(this.parentElement, 'sex');e.stopPropagation();});
			item.querySelector('td.auto').addEventListener('click', function(e) {toggleQueueAttribute(this.parentElement, 'auto');e.stopPropagation();});
		});
	}, 25);

	// Recalculate the height of the sidebar if the window changes size
	fixSidebarSize();

	// Automatically scroll to the highlighted item
	var highlighted = document.getElementById("missingo-queue").getElementsByClassName('highlight')[0];

	if (highlighted) {
		$("#missingo-innerstatus").scrollTo(highlighted);
	}

	window.addEventListener('resize', function() {
		fixSidebarSize();
	});

	setTimeout(function() {
		// Allow dragging to re-order the sidebar
		$("#missingo-queue tbody").sortable({
			axis: "y",
			delay: 100,
			update: function(event, ui) { orderQueue(this, event, ui); }
		});

		// Allow the sidebar to be resized
		$("#missingo-sidebar").resizable({
			handles: "e",
			maxWidth: 450,
			minWidth: 20,
			stop: function( event, ui ) {
				save("sidebar_width", ui.size.width);
				$("body").css('padding-left', ui.size.width);
			}
		});
	}, 250);

	console.log("Exiting insertStatus (" + (new Date().getTime() - startTime.getTime()) + ")");
}

function showSidebarInfo(tableRow)
{
	var relationship = getRelationship(character, tableRow.getAttribute('data-charid'));
	var sidebarInfo  = document.getElementById('pa-sidebar-info');
	if (sidebarInfo && sidebarInfo.getAttribute('data-charid') == tableRow.getAttribute('data-charid')) {return;} // This window is already open
	else if (sidebarInfo) { sidebarInfo.parentNode.removeChild(sidebarInfo); } // A different sidebar window is open, close it first

	var rect		= tableRow.getBoundingClientRect();
	var sidebarRect = document.getElementById('missingo-sidebar').getBoundingClientRect();
	var pos  = '';
	var cardHeight = 300;

	// Decide if the window should attach to bottom or top
	if (window.innerHeight < rect.top + cardHeight) {
		// Top
		pos = 'top:'+(rect.top-cardHeight)+'px;';
	} else {
		// Bottom
		pos = 'top:'+rect.top+'px;';
	}

	var div = "\
		<div id='pa-sidebar-info' class='box' data-charid='" + relationship.other + "' style='z-index:100;position:fixed;"+pos+" left:-100px;height:"+cardHeight+"px'>\
			<h2><a href='" + gameBaseURL + "/World/Popmundo.aspx/Character/" + relationship.other + "'>" + relationship.name + "</a> (" + relationship.other + ")</h2>\
			<div id='pa-sidebar-info-inner'></div>\
		</div>";

	$("body").append(div);

	var renderCard = function(relationship) {
		var contents = "\
		<div>\
			<table style='width:100%'>\
				<tr>\
					<td style='width:114px;'><div id='pa-sidebar-avatar' class='avatar' style='background-image:"+relationship.avatar+";background-repeat:no-repeat;background-size:contain;margin:0;'></div></td>\
					<td>\
						<table class='table table-striped table-condensed'>\
							<tbody>\
								<tr>\
									<td>Last interaction</td>\
									<td>" + moment(relationship.lastInteractionReceived).fromNow() + "</td>\
								</tr>\
								<tr>\
									<td>Birthday</td>\
									<td id='pa-sidebar-birthday'>" + moment(parseInt(relationship.birthday)).fromNow() + "</td>\
								</tr>\
								<tr>\
									<td>Age</td>\
									<td id='pa-sidebar-age'>" + relationship.age + "</td>\
								</tr>\
								<tr>\
									<td>" + dictionary.gender.gender + "</td>\
									<td id='pa-sidebar-birthday'>" + (relationship.hasOwnProperty('gender') ? dictionary.gender[relationship.gender] : 'unknown') + "</td>\
								</tr>\
								<tr>\
									<td>City</td>\
									<td id='pa-sidebar-city'>" + (relationship.cityName ? relationship.cityName : 'unknown') + "</td>\
								</tr>\
								<tr>\
									<td>Locale</td>\
									<td id='pa-sidebar-locale'>" + (relationship.localeName ? '<a href="' + gameBaseURL + '/World/Popmundo.aspx/Locale/' + relationship.localeId + '">' + relationship.localeName + '</a>' : 'unknown') + "</td>\
								</tr>\
							</tbody>\
						</table>\
					</td>\
				</tr>\
				<tr>\
					<td></td>\
					<td>\
						<table class='table table-condensed'>\
							<tr>\
								<td><input type='checkbox' data-pa-object='relationship' data-pa-object-id='" + relationship.other + "' data-pa-toggle='allowFriendship' id='pa-sidebar-card-friendship' /></td>\
								<td><label for='pa-sidebar-card-friendship'>Do friendly interactions</label></td>\
							</tr>\
							<tr>\
								<td><input type='checkbox' data-pa-object='relationship' data-pa-object-id='" + relationship.other + "' data-pa-toggle='allowRomance' id='pa-sidebar-card-romance' /></td>\
								<td><label for='pa-sidebar-card-romance'>Do romantic interactions</label></td>\
							</tr>\
							<tr>\
								<td><input type='checkbox' data-pa-object='relationship' data-pa-object-id='" + relationship.other + "' data-pa-toggle='allowSnuggle' id='pa-sidebar-card-snuggle' /></td>\
								<td><label for='pa-sidebar-card-snuggle'>Do snuggles</label></td>\
							</tr>\
							<tr>\
								<td><input type='checkbox' data-pa-object='relationship' data-pa-object-id='" + relationship.other + "' data-pa-toggle='allowAutoInteract' id='pa-sidebar-card-autoInteract' /></td>\
								<td><label for='pa-sidebar-card-autoInteract'>Include in auto-interact</label></td>\
							</tr>\
						</table>\
					</td>\
				</tr>\
		</table>\
		</div>\
		<div class='pa-sidebar-links' style='padding:5px; text-align:right;'>\
			<a href='" + gameBaseURL + "/World/Popmundo.aspx/Conversations/Conversation/" + relationship.other + "'>Send message</a> | \
			<a href='" + gameBaseURL + "/World/Popmundo.aspx/Interact/Details/" + relationship.other + "'>View relationship details</a>\
			" + ((character.hasOwnProperty('cityId') && character.cityId == relationship.cityId && character.localeId != relationship.localeId) ? " | <a href='" + gameBaseURL + "/World/Popmundo.aspx/Locale/MoveToLocale/"+relationship.localeId+"/"+relationship.other+"'>Go to interact</a>" : '') + "\
		</div>";

		$("#pa-sidebar-info-inner").children().remove();
		$("#pa-sidebar-info-inner").append(contents);

		bindFormElements(document.getElementById('pa-sidebar-info'));
	};

	renderCard(relationship);
	$("#pa-sidebar-info").show().animate({"left": sidebarRect.right},500);;

	// Make sure the window closes if the user clicks somewhere else
	$("#ppm-wrapper").click(function() {
		$(this).click(function() {});
		$("#pa-sidebar-info").fadeOut(100, function() {
			$(this).remove();
		})
	});

	if (!relationship.hasOwnProperty('lastBackgroundParsed') || (Date.now() - relationship.lastBackgroundParsed) > (60*60*1000)) {

		$.ajax(gameBaseURL + '/World/Popmundo.aspx/Character/PersonalBackground/' + relationship.other.toString(), {
			success: function(data) {
				var contentDiv  = $(data).find("#ppm-content").first();
				var charPresBox = $(contentDiv).find("div.charPresBox");

				// Parse all the data that is exposed on this page
				parseDataFromCharacterBackground(contentDiv, relationship);
				parseDataFromPresBox(charPresBox, relationship);

				// Store the relationship and update the card with the newly parsed data
				storeRelationship(character, relationship, true);
				renderCard(relationship);
			},
		});
	} else {
		console.log("Parsed background info recently, using cached information.");
	}
}

function bindFormElements(rootElement)
{
	if (!rootElement) {
		rootElement = document;
	}

	var relationship = null;

	// Update status of form elements
	Array.from(rootElement.querySelectorAll("input[type='checkbox']")).forEach(function(item) {
		if (
			(item.hasAttribute('data-pa-object') && item.getAttribute('data-pa-object') === 'relationship') &&
			(item.hasAttribute('data-pa-toggle') && item.hasAttribute('data-pa-object-id'))
		) {
			// This is a toggle checkbox for a relationship property
			var prop		 = item.getAttribute('data-pa-toggle');

			if (!relationship || parseInt(relationship.other) !== parseInt(item.getAttribute('data-pa-object-id'))) {
				var relationship = getRelationship(character, parseInt(item.getAttribute('data-pa-object-id')));
			}

			if (relationship.hasOwnProperty(prop)) {
				item.checked = (relationship[prop] == true);
			}

			item.addEventListener('change', function() {toggleRelationshipProperty(this.getAttribute('data-pa-object-id'), this.getAttribute('data-pa-toggle'), this.checked)});
		}
	});
}

function toggleRelationshipProperty(r, p, v)
{
	var relationship = getRelationship(character, r);
	relationship[p] = (v == true);
	storeRelationship(character, relationship, true);
	// Todo: Update info on "data-pa-object=relationship, data-pa-object-id=r, data-pa-object-toggle=p" elements
}

function toggleQueueAttribute(tableRow, attribute)
{
	var supportedAttributes	= {friend:'allowFriendship', love:'allowRomance', sex:'allowSnuggle', auto:'autoInteract'};

	if (Object.keys(supportedAttributes).indexOf(attribute) === -1) {
		return;
	}

	var id                  = tableRow.getAttribute('data-charid');
	var relationship        = getRelationship(character, id);

	relationship[supportedAttributes[attribute]] = (relationship[supportedAttributes[attribute]]) ? false : true;
	storeRelationship(character, relationship);
console.table(relationship);
	tableRow.getElementsByClassName(attribute)[0].classList.toggle('inactive');

	if (relationship.allowAutoInteract) {
		tableRow.getElementsByClassName('auto')[0].classList.remove('inactive');
	} else {
		tableRow.getElementsByClassName('auto')[0].classList.add('inactive');
	}
}

function fixSidebarSize()
{
	$("#missingo-innerstatus").outerHeight($("#missingo-sidebar").height() - $("#missingo-sidebar-top").outerHeight());
}

function isAutoInteractActive()
{
	if (autoInteractActive == null) {
		autoInteractActive = load("missingo_autoInteractActive", false);
	}

	return autoInteractActive;
}

function insertRelationshipSettings(character, toID)
{
	let relationship = getRelationship(character, toID, true); // True to auto-create relationship

	// Prepare the settings menu
	let checkboxes = `
		<input type="checkbox" id="missingO-allowFriendship" /><label style="color:blue;" for="missingO-allowFriendship">Do friendly interactions</label><br />
		<input type="checkbox" id="missingO-allowRomance" /><label style="color:red;" for="missingO-allowRomance">Do romance interactions</label><br />
		<input type="checkbox" id="missingO-allowSexual" /><label style="color:purple;" for="missingO-allowSexual">Do snuggles</label><br />
		<input type="checkbox" id="missingO-enableAuto" /><label for="missingO-enableAuto"><strong>Enable auto-interact</strong></label><br />
		<hr />Mode: <select id="missingO-mode" class="round"><option value="0" data-description="Increase all selected options in a balanced manner.">Default</option><option value="1" data-description="Try to increase friendship first; romance is only attempted when friendship cannot be increased further.">Friend</option><option value="2" data-description="Try to increase romance first; friendship is only attempted when romance cannot be increased further.">Lover</option><option value="3" data-description="Increase all selected options in a balanced manner. This is the only setting that allows the usage of matrimonial and \'I love you\' interactions.">Significant Other</option>
		<option value="4" data-description="Attempt to perform snuggles. If romance is full, this setting will never automatically use the last available interaction unless it is a sexual interaction.">Snuggle Partner</option><option value="5" data-description="This setting follows the other person\'s behaviour and will not take the lead in friendship or romance.">Don\'t Lead</option></select><hr /><div id="behaviour-description">&nbsp;</div>`;

	// Wrap settings in a div
	var settings = "<div class='box'><h2>Popmundo Assistant <span class=\"pull-right\" id=\"openStats\">?</span></h2>" + checkboxes + "</div>";

	// Add to the page
	$("div.interactHolder").prepend( settings );

	$("#PA-toggleNotes").click(function() {
		$("#PA-notes").toggleClass('hidden');
		$("#PA-notes").hasClass('hidden') ? $(this).text('Notes [+]') : $(this).text('Notes [-]');
	});

	if (relationship.hasOwnProperty('notes')) {
		$("#PA-notes").val(relationship.notes);
		if (relationship.notes.length > 0) {
			$("#PA-toggleNotes").addClass('hasContent');
		}
	}

	$("#PA-notes").on('input', function() {
		relationship.notes = $(this).val();
		storeRelationship(character, relationship);
	});

	$("#openStats").click(function() {
		displayBackdrop();
		insertStatusWindow(toID);
	});

	// Set values on the settings menu
	if (relationship.allowRomance) {
		$("#missingO-allowRomance").prop('checked', true);
	}

	if (relationship.allowFriendship) {
		$("#missingO-allowFriendship").prop('checked', true);
	}

	if (relationship.allowSnuggle) {
		$("#missingO-allowSexual").prop('checked', true);
	}

	if (relationship.allowAutoInteract) {
		$("#missingO-enableAuto").prop('checked', true);
	}

	if (relationship.mode) {
		$("#missingO-mode").val(relationship.mode);
	}

	// Disable the auto-interact checkbox if none of the options is enabled
	checkCanAutoInteract();

	var rules = getSpecialRules();

	// Disable options on special relationships
	if (rules.indexOf("underage") != -1 || rules.indexOf("parental") != -1 || rules.indexOf("non-sexual") != -1) {
		// Underage-type relationship; diable romance and sexual
		$("#missingO-allowRomance").prop('checked', false).prop('disabled', true).next().attr('title', 'Cannot enable romance for this relationship');
		$("#missingO-allowSexual").prop('checked', false).prop('disabled', true).next().attr('title', 'Cannot enable sex for this relationship');
	}


	// Register events
	$("#missingO-allowRomance").change(function() {
		setRelationshipProperty(character, toID, 'allowRomance', $(this).prop("checked") );
		checkCanAutoInteract();
		evaluateInteraction(true);
	});

	$("#missingO-allowFriendship").change(function() {
		setRelationshipProperty(character, toID, 'allowFriendship', $(this).prop("checked") );
		checkCanAutoInteract();
		evaluateInteraction(true);
	});

	$("#missingO-allowSexual").change(function() {
		setRelationshipProperty(character, toID, 'allowSnuggle', $(this).prop("checked") );
		checkCanAutoInteract();
		evaluateInteraction(true);
	});

	$("#missingO-enableAuto").change(function() {
		setRelationshipProperty(character, toID, 'allowAutoInteract', $(this).prop("checked") );
		evaluateInteraction(false);
		doAutoInteract();
	});

	$("#missingO-mode").change(function() {
		setRelationshipProperty(character, toID, 'mode', $("#missingO-mode").val());

		// Update helper text
		$("#behaviour-description").html("<p>" + $("#missingO-mode option:selected").attr("data-description") + "</p>");

		evaluateInteraction(true);
	});
}

function checkCanAutoInteract()
{
	if ($("#missingO-allowRomance").prop('checked') || $("#missingO-allowFriendship").prop('checked') || $("#missingO-allowSexual").prop('checked')) {
		$("#missingO-enableAuto").prop('disabled', false)
	} else {
		$("#missingO-enableAuto").prop('checked', false);
		$("#missingO-enableAuto").prop('disabled', true);
	}
}

function evaluateInteraction(allowChange)
{
	// Prepare variables
	var ownID           = character.id;
	var otherID         = getOtherID();
	var ownLove         = getOwnLove();
	var ownFriendship   = getOwnFriendship();
	var theirFriendship = getTheirFriendship();
	var theirLove       = getTheirLove();

	// Keep track of whether or not the auto pick was successfull
	var picked          = false;

	// Always attempt to select an appropriate interaction
	if (allowChange) {
		return chooseInteraction(ownID, otherID, theirLove, theirFriendship, ownLove, ownFriendship);
	} else {
		// We'll assume picking was successful the last time
		return true;
	}
}


function performAutoInteract(ownID, otherID)
{
	// Let the client know we are about to perform an interaction
	setAutoInteractStatus("About to perform interaction...");

	if (autoInteractSeconds < 0) {
		autoInteractSeconds = 0;
	}

	var count       = autoInteractSeconds;
	var button      = $("#ctl00_cphTopColumn_ctl00_btnInteract").first();
	var original    = $(button).val();
	var interrupted = false;

	setTimeout(() => {$(button).trigger("click", [true]);}, requestDelay);
/*
	// Interrupt auto-interact if the interaction select box is clicked
	$("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").click(function() {
		interrupted = true;
	});

	// Interrupt auto-interact if the interaction select box value changed
	$("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").change(function() {
		interrupted = true;
	});

	// Set button to countdown max time
	$(button).val(count.toString());

	var timer = function() {
		count = count - 1;

		if ( interrupted ) {
			// Interrupted!
			clearInterval(countDown);
			$(button).val(original);
			setAutoInteractStatus("Automatic interaction cancelled.");
		} else if ( count <= 0 ) {
			clearInterval(countDown);
			$(button).val(original);
			$(button).trigger("click", [true]);
		} else {
			$(button).val(count.toString());
		}
	}

	// Begin countdown!
	var countDown   = setInterval(timer, 1000);*/
}

function openInteractScreen() {
	if ($("a#ctl00_cphRightColumn_ctl00_lnkInteract").length > 0 && $("a#ctl00_cphRightColumn_ctl00_lnkInteract").attr('href').indexOf("/City/") == -1) {
		navigateTo(window.location.origin + $("a#ctl00_cphRightColumn_ctl00_lnkInteract").attr("href"));
		return true;
	} else if ($("#ctl00_cphRightColumn_ctl00_btnInteract").length > 0 && $("#ctl00_cphRightColumn_ctl00_btnInteract").attr('href').indexOf("/City/") == -1) {
		// Why is the link that has the exact same function sometimes a btnInteract and other times a lnkInteract?!
		performDelayed(function() {
			$("#ctl00_cphRightColumn_ctl00_btnInteract")[0].click();
		});

		return true;
	} else if($("a#ctl00_cphRightColumn_ctl00_lnkInteractPhone").length > 0) {
		navigateTo(window.location.origin + $("a#ctl00_cphRightColumn_ctl00_lnkInteractPhone").attr("href"));
		return true;
	} else {
		return false;
	}
}

function chooseInteraction(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship)
{

	var style = getRelationship(character, toID).mode;

	if (style == 1) {
		return chooseFriendshipFirst(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship);
	} else if (style == 2) {
		return chooseRomanceFirst(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship);
	} else if (style == 3) {
		return chooseSignificantOther(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship);
	} else if (style == 4) {
		return chooseSnugglePartner(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship);
	} else if (style == 5) {
		return chooseNoLead(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship);
	} else {
		return chooseBalanced(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship);
	}

}

function chooseBalanced(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship)
{
	// Default everything to disallow
	var allowFriendship 	= false;
	var allowRomance    	= false;
	var allowSexual     	= false;
	var blockedInteractions = [];
	var relationship = getRelationship(character, toID);

	if ( relationship.allowFriendship ) {
		allowFriendship = true;
	}

	if ( relationship.allowRomance ) {
		allowRomance = true;
	}

	if ( relationship.allowSnuggle ) {
		allowSexual = true;
	}

	// Always prefer sexual first
	if ( allowSexual && selectSexual() ) {
		return true;
	}

	if (allowRomance) {
		blockedInteractions = [69, 70];
	}

	// If both friendship and romance are allowed, we have a choice to make..
	if ( allowFriendship && allowRomance ) {
		// If romance is lower than friendship, try to increase romance
		if ( theirLove <= theirFriendship ) {
			if ( selectRomance(allowSexual) ) {
				return true;
			} else {
				// Romance was lower than friendship, but no romance interactions are available
				return selectFriendship(blockedInteractions);
			}
		} else {
		// Romance is higher than friendship, so try to increase friendship
			if ( selectFriendship(blockedInteractions) ) {
				return true;
			} else {
				// Romance was higher than friendship, but no friendly interactions are available
				return selectRomance(allowSexual);
			}
		}
	} else {
		// Otherwise the choice is simple, only one of both is allowed...
		if ( allowFriendship ) {
			return selectFriendship(blockedInteractions);
		} else if ( allowRomance ) {
			return selectRomance(allowSexual);
		}
	}
}

function chooseFriendshipFirst(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship)
{
	var allowFriendship = false;
	var allowRomance    = false;
	var allowSexual     = false;
	var blockedInteractions = [];
	var relationship = getRelationship(character, toID);

	if ( relationship.allowFriendship ) {
		allowFriendship = true;
	}

	if ( relationship.allowRomance ) {
		allowRomance = true;
	}

	if ( relationship.allowSnuggle ) {
		allowSexual = true;
	}

	if (allowRomance) {
		blockedInteractions = [69, 70];
	}

	// If friendship is not full, or both are full..
	if (theirFriendship < 100 || (theirFriendship >= 100 && theirLove >= 100)) {
		if (allowFriendship && selectFriendship() ) {
			return true;
		} else if (allowSexual && selectSexual()) {
			return true;
		} else if (allowRomance && selectRomance(allowSexual)) {
			return true;
		} else {
			return false;
		}
	} else {
		if (allowSexual && selectSexual()) {
			return true;
		} else if (allowRomance && selectRomance(allowSexual)) {
			return true;
		} else if (allowFriendship && selectFriendship() ) {
			return true;
		} else {
			return false;
		}
	}
}

function chooseRomanceFirst(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship)
{
	var allowFriendship = false;
	var allowRomance    = false;
	var allowSexual     = false;
	var blockedInteractions = [];
	var relationship = getRelationship(character, toID);

	if ( relationship.allowFriendship ) {
		allowFriendship = true;
	}

	if ( relationship.allowRomance ) {
		allowRomance = true;
	}

	if ( relationship.allowSnuggle ) {
		allowSexual = true;
	}

	if (allowRomance) {
		blockedInteractions = [69, 70];
	}

	// If love is not full, or both are full..
	if (theirLove < 100 || (theirLove >= 100 && theirFriendship >= 100)) {
		if (allowSexual && selectSexual()) {
			return true;
		} else if (allowRomance && selectRomance(allowSexual)) {
			return true;
		} else if (allowFriendship && selectFriendship() ) {
			return true;
		} else {
			return false;
		}
	} else {
		if (allowFriendship && selectFriendship() ) {
			return true;
		} else if (allowSexual && selectSexual()) {
			return true;
		} else if (allowRomance && selectRomance(allowSexual)) {
			return true;
		} else {
			return false;
		}
	}
}

function chooseSignificantOther(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship)
{
	var allowFriendship = false;
	var allowRomance    = false;
	var allowSexual     = false;
	var blockedInteractions = [];
	var relationship = getRelationship(character, toID);

	if ( relationship.allowFriendship ) {
		allowFriendship = true;
	}

	if ( relationship.allowRomance ) {
		allowRomance = true;
	}

	if ( relationship.allowSnuggle ) {
		allowSexual = true;
	}

	if (allowRomance) {
		blockedInteractions = [69, 70];
	}

	// First attempt sexual
	if (allowSexual && selectSexual()) {
		return true;
	}

	// Matrimonial interactions!
	if (allowRomance && selectMatrimonial()) {
		return true;
	}

	// Same as prefer romance..
	return chooseRomanceFirst(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship);
}

function chooseSnugglePartner(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship)
{
	var allowFriendship = false;
	var allowRomance    = false;
	var allowSexual     = false;
	var actionsLeft     = getActionsLeft();
	var relationship	= getRelationship(character, toID);
	var blockedInteractions = [];

	if ( relationship.allowFriendship ) {
		allowFriendship = true;
	}

	if ( relationship.allowRomance ) {
		allowRomance = true;
	}

	if ( relationship.allowSnuggle ) {
		allowSexual = true;
	}

	if (allowRomance) {
		blockedInteractions = [69, 70];
	}

	// If it's the last action left and the love is full, do a snuggle interaction
	// or keep the interaction for later.
	if (actionsLeft <= 2 && allowSexual && theirLove >= 100) {
		if (selectSexual()) {
			return true;
		} else {
			return false;
		}
	// Otherwise, either sexual interactions are disallowed by the client or the love bar isn't full yet,
	// so allow other interactions.
	} else if (actionsLeft <= 2) {
		if (allowSexual && selectSexual()) {
			return true;
		}
	}

	// Second priority: If romance is low; increase it
	if (theirLove < 100 && allowRomance && selectRomance(allowSexual)) {
		return true;
	}

	// Third priority: If romance is high, but friendship is low; increase friendship
	if (theirFriendship < 100 && allowFriendship && selectFriendship()) {
		return true;
	}

	// Both love and friendship are as high as allowed; always prefer romance
	if (allowRomance && selectRomance(allowSexual)) {
		return true;
	} else if (allowFriendship && selectFriendship()) {
		return true;
	} else {
		// Nothing seems to be allowed...
		return false;
	}
}

function chooseNoLead(fromID, toID, theirLove, theirFriendship, ownLove, ownFriendship) {
	var allowFriendship = false;
	var allowRomance    = false;
	var allowSexual     = false;
	var blockedInteractions = [];
	var relationship = getRelationship(character, toID);

	if ( relationship.allowFriendship ) {
		allowFriendship = true;
	}

	if ( relationship.allowRomance ) {
		allowRomance = true;
	}

	if ( relationship.allowSnuggle ) {
		allowSexual = true;
	}

	if (allowSexual && (theirLove <= ownLove) && (ownLove > 0) && selectSexual()) {
		return true;
	}

	if (allowRomance) {
		blockedInteractions = [69, 70];
	}

	// If we allow romance and their standing towards us is higher..
	if (allowRomance && (theirLove <= ownLove) && (ownLove > 0) && selectRomance(allowSexual)) {
		return true;
	}

	// If we allow friendship and their standing towards us is higher..
	if (allowFriendship && (theirFriendship <= ownFriendship) && (ownFriendship > 0) && selectFriendship()) {
		return true;
	}

	// None of the conditions matched
	return false;
}

function selectMatrimonial(romance, friendship)
{
	romance     = typeof romance    !== 'undefined' ? romance : true;
	friendship  = typeof friendship !== 'undefined' ? friendship : true;

	var found   = false;
	var select  = $("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").first();

	var interactions = [
		[
			145,            // Plan future
			149,            // Compliment partner
			77,             // I love you
		],
	];

	found = selectInteraction(interactions, false);

	return found;
}

function selectRomance(allowSexual)
{
	var found   = false;
	var select  = $("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").first();

	var interactions = [
		[
			35,             // Ask for a dance
			10,             // Kiss passionately
			129,            // Stroll hand in hand
		],
		[
			9,              // Kiss
			7,              // Buy a drink
			30,             // Caress
			64,             // Embrace
			76,             // Naughty joke
			89,             // Flex biceps
		],
		[
			12,             // Tickle
			78,             // Serenade
		],
		[
			71,             // Hey sexy, ...
			14,             // Compliment
		],
		[
			161,            // Wink
		],
		[
			25,             // Lover call
		],
		[
			73,             // Flirty call
			74              // Flirty sms
		]
	];

	if (allowSexual) {
		// Add intimate roleplay to the options
		interactions.unshift([159]);
	}

	found = selectInteraction(interactions, false);

	return found;
}

function selectFriendship(blockedInteractions)
{
	var found = false;
	var interactions = [
		[
			70,         // Hang out
			69,         // Share secrets
			62,         // Share opinions
			139,        // Compare notes
			44,         // Give massage
			18,         // Play with
			130,		// Badmouth judge (Great Heist)

			100,		// Ask about things (Child -> adult)
			97,			// Badmouth parents (child)
			98,			// Talk about hobbies (child)

			6,			// Google-Google
			93,			// Pick up
			103,		// Kiss on forehead
			95,			// Change diapers
			96,			// Sing lullaby

			91,			// Look (Baby -> adult)
			90,			// Babble (Baby -> adult)
			92,			// Grin (Baby -> adult)

		],
		[
			5,          // Tease
			8,          // Hug
			34,         // Profound discussion
			51,         // Comfort
			57,         // Fraternize
			21,         // Sing to
			4,          // Tell joke
			68,         // Offer advice
			134,		// Shoot hoops
		],
		[
			33,         // Do funny magic
			59,         // Rub elbows
			60,         // High five
			65,         // Gossip
			66,         // Braid hair
			63,         // Pat on back
			67,         // Arm wrestle
		],
		[
			56,         // Kiss cheeks
			55,         // Shake hands
			1,          // Greet
			3,          // Talk to
		],
		[
			24,         // Wazzup call
			//26,         // Prank call
		],
		[
			54,			// Smile
			61,         // SMS friendly text
			58,         // sms funny pic
		]
	];

	var filteredInteractions = [];

	if (typeof blockedInteractions !== 'undefined' && Array.isArray(blockedInteractions) && blockedInteractions.length > 0) {
		filteredInteractions = filterInteractions(interactions, blockedInteractions)
	} else {
		filteredInteractions = interactions;
	}

	var found = selectInteraction(filteredInteractions, false);

	return found;
}

function filterInteractions(interactions, blockedInteractions)
{
	var filteredArray = [];

	interactions.forEach(function(value, index) {

		// If the value is an array, we need to go deeper
		if (Array.isArray(value)) {
			// Call recursively
			filteredArray[index] = filterInteractions(value, blockedInteractions);
		}

		// Otherwise, filter out the blocked values
		else {
			if (blockedInteractions.indexOf(value) === -1) {
				// This is an allowed value
				filteredArray.push(value);
			}
		}

	});

	return filteredArray;
}

function selectSexual()
{
	var interactions = [
		19,                 // Tantric
		11,                 // Make love
		13,                 // Quickie
		131,				// Drop soap (Great Heist)
		20,                 // Spank
	];

	if (character.noSpank) {
		interactions.pop();
	}

	var found = selectInteraction(interactions, false);

	return found;
}

function shuffleArray(o)
{
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

function selectInteraction(list, random) {
	// Get the select box and store it for performance
	var select = $("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").first();

	// Hold a list of interactions
	var interactions;

	if (random === true) {
		interactions = shuffleArray(list);
	} else {
		interactions = list;
	}

	var found = false;

	$(interactions).each(function(index, value) {
		if (value instanceof Array) {
			 if (selectInteraction(value, true)) {
				found = true;
				// Does not actually return false, but exits
				return false;
			 }
		} else if ($(select).find("option[value='"+ value.toString() +"']").length > 0) {
			$(select).val(value.toString());
			found = true;
			return false;
		}
	});

	return found;
}

function modifyLocalePage()
{
	$("#pa").remove();
	$("div#ppm-sidemenu").append('\
		<div class="box" id="pa">\
			<h2>Popmundo Assistant</h2>\
			<button type="button" id="pa-qm-add">Add to QuickMove</button>\
			<button type="button" id="pa-qm-del">Remove from QuickMove</button>\
		</div>'
	);

	var cityID = parseCityIDFromLocale();
	var localeID = parseLocaleIDFromLocale();
	var localeName = parseLocaleNameFromLocale();

	if (character.hasOwnProperty('quickmove') &&
		character.quickmove.hasOwnProperty(cityID) &&
		character.quickmove[cityID].hasOwnProperty(localeID)) {
		$("#pa-qm-add").hide();
	} else {
		$("#pa-qm-del").hide();
	}

	$("#pa-qm-add").click(function() {
		$(this).hide();
		$("#pa-qm-del").show();

		if (!character.hasOwnProperty('quickmove')) character.quickmove = {};
		if (!character.quickmove.hasOwnProperty(cityID)) character.quickmove[cityID] = {};
		if (!character.quickmove[cityID].hasOwnProperty(localeID)) character.quickmove[cityID][localeID] = {};
		character.quickmove[cityID][localeID].name = localeName;

		storeCharacter(character);
	});

	$("#pa-qm-del").click(function() {
		$(this).hide();
		$("#pa-qm-add").show();

		if (character.hasOwnProperty('quickmove') &&
			character.quickmove.hasOwnProperty(cityID) &&
			character.quickmove[cityID].hasOwnProperty(localeID)) {
			delete character.quickmove[cityID][localeID];
			storeCharacter(character);
		}
	});
}

function parseCityIDFromLocale()
{
	// First attempt
	var elem = $("#ctl00_cphLeftColumn_ctl00_lnkLocaleCity");

	// Alternative method
	if (elem.length <= 0) {
		elem = $(".localebox > .float_right > a:nth-child(1)");
	}

	if (elem.length <= 0) {
		throw 'Could not parse City ID from locale page.';
	}

	var cityID = $(elem).attr("href").match(/\/City\/([0-9]+)$/)[1];

	return cityID;
}

function parseLocaleIDFromLocale()
{
	return $("div.box div.menu a[href*='/World/Popmundo.aspx/Locale/']").attr("href").match(/\/Locale\/([0-9]+)$/)[1];
}

function parseLocaleNameFromLocale()
{
	return $("h1").text();
}

function modifyInteractPage()
{
	console.log("[DEBUG] Popmundo Assistant modifying interaction page");
	// Add ID's to the boxes to make them easier to select
	var boxes = $("div.interactHolder div.box");

	// More than 4 boxes means a relationship exists, which guarantees the history box to exist
	if (boxes.length > 4) {
		$(boxes[boxes.length-1]).attr("id", "historyBox");
		Array.prototype.pop.call(boxes);
	}

	// Info box is always available and always first
	$(boxes[0]).attr("id", "infoBox");
	Array.prototype.shift.call(boxes);

	// Interact box is always available and always second (after shifting now first)
	$(boxes[0]).attr("id", "interactBox");
	Array.prototype.shift.call(boxes);

	// Loop through the remaining boxes to find out what they are (not ideal because it is dependant on translation strings)
	$(boxes).each(function() {
		var title = $(this).children("h2").first().text();

		if (title.indexOf("Use item") != -1) {
			$(this).attr("id", "itemBox");
		} else if (title.indexOf("Actions") != -1) {
			$(this).attr("id", "actionBox");
		} else if (title.indexOf("End relationship") != -1) {
			$(this).attr("id", "endrelationshipBox");
		} else if (title.indexOf("Ask out") != -1) {
			$(this).attr("id", "dateBox");
		}
	});

	var ownID           = character.id;
	var otherID         = getOtherID();
	var button          = $("#ctl00_cphTopColumn_ctl00_btnInteract");
	var chosen			= false;
	var relationship    = getRelationship(character, otherID);

	// Only insert relationship settings if there is an existing relationship
	if (hasRelationship()) {
		if (!relationship) {
			// There is a relationship between the characters in-game, but PA does not have an object for it yet. Create it.
			relationship = getRelationship(character, otherID, true);
		}

		insertRelationshipSettings(character, otherID);

		// Update relationship info
		relationship.ownLove			= getOwnLove();
		relationship.theirLove			= getTheirLove();
		relationship.ownFriendship		= getOwnFriendship();
		relationship.theirFriendship	= getTheirFriendship();

		try {
			relationship.currentLove		= parseDetailLove();
			relationship.currentFriendship	= parseDetailFriendship();
			relationship.currentHate		= parseDetailHate();
		} catch (e) {
			debugMessage("Unable to parse Love, Friendship, Hate");
		}

		relationship.status = 'active';

		storeRelationship(character, relationship);
	}

	if (isAutoInteractActive()) {
		insertSkipButton();
	}

	$(button).addClass("btn btn-success");

	$(button).click(function(event, isAutomated) {
		// Make changes to relationship in bulk
		var relationship = getRelationship(character, otherID);

		// Reset failed status
		delete relationship.interactFailReason;
		relationship.interactfail		= false;
		relationship.lastInteraction	= new Date();

		if (relationship.hasOwnProperty('status') && relationship.status === 'ended') {
			// Reset ended status
			relationship.status = 'active';
			delete relationship.endedOn;
		}

		if (relationship.hasOwnProperty('endedReason')) {
			// No need to remember the reason
			delete relationship.endedReason;
		}

		// Detect snuggles and phonecalls to increase the counter
		var value = parseInt($("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").val());

		if ([74, 73, 25, 61, 58, 24, 26].indexOf(value) > -1) {
			relationship.lastCallDone = new Date();
		}

		if (!relationship.firstInteraction) {
			relationship.firstInteraction = new Date();
		}

		// Bulk save relationship info
		storeRelationship(character, relationship);

		return true;
	});

	$("#ctl00_cphTopColumn_ctl00_btnEndRelationship").addClass('btn btn-danger').click(function(e) {
		// End relationship button was clicked, override confirmation
		var reason = window.prompt('Enter a reason to end this relationship, or choose cancel to keep the relationship', 'Unknown reason');

		if (reason === null) {
			// Cancel was chosen, do not continue
			return false;
		} else {
			// The OK button was pressed
			deleteRelationship(relationship, reason);
		}

		return false;
	});

	// Prevent starting a relationship with someone after ending it
	if (relationship && relationship.status === 'ended') {
		$(button).prop('disabled', 'disabled');
		$(button).parent().click(function () {
			if (confirm("Are you sure you want to start a new relationship with this person?\nThis relationship was ended because:\n" + relationship.endedReason)) {
				$(button).removeAttr('disabled');
				$(button).unbind('click');
			} else {
				return false;
			}
		});
	}
}

function getActionsLeft()
{
	var scrapedText = $("#interactBox h2").first().text();

	if (typeof scrapedText == "undefined" || scrapedText.length <= 0) {
		debugMessage("[WARNING] Could not find the title element of the interactBox!");
		return 0;
	}

	var matches     = /([0-9]+).*?([0-9])/.exec(scrapedText);

	if (matches && typeof matches[1] != "undefined") {
		// Successfully parsed the interactions left.
		return parseInt(matches[1]);
	} else {
		// Could not parse the number of remaining interactions from text.
		debugMessage("[WARNING] Could not parse the number of interactions remaining! (Did the format change, or is this a phone call?)");

		if (document.getElementById("ctl00_cphTopColumn_ctl00_ddlInteractionTypes")) {
			// The interaction box is present, so there must be at least one remaining interaction.
			// TODO EDIT: Setting this to 10 temporarily to fix phone calls not working on auto interact
			return 10;
		}

		// Cannot find any indication of interactions being available, return 0 by default.
		return 0;
	}
}

function debugMessage(msg)
{
	console.log(msg);
}

function isOwnInteraction(text)
{
	var ownTexts = [
		'You',
		'I...I...I',
		'Love is',
		'Wow, that',
		'\"Wazzu',
		'Nice move',
		'The lovercall'
	];

	var matched = false;

	ownTexts.forEach(function(ownText) {
		if (text.indexOf(ownText) === 0) {
			matched = true;
			return true;
		}
	});

	return matched;
}

function getMaxActions()
{
	var text        = $("div.interactHolder div.ofauto h2").first().text();
	var pattern     = /\(([0-9]+) of ([0-9]+) left today\)/g;
	var match       = pattern.exec(text);

	if (match && match.length >= 3) {
		return match[2];
	} else {
		return -1;
	}
}

function parseDetailLove()
{
	var love = 0;
	love = $("div.progressBar").eq(0).attr("title").replace("%", "");
	return love;
}

function parseDetailFriendship()
{
	var friendship = 0;
	friendship = $("div.progressBar").eq(1).attr("title").replace("%", "");
	return friendship;
}

function parseDetailHate()
{
	var hate = 0;
	hate = $("div.progressBar").eq(0).attr("title").replace("%", "");
	return hate;
}

function getRomance()
{
	var romance = $("div.width300px").first().attr('title');
	//var romance = $("table.bmargin10 tbody tr:nth-child(1) td:nth-child(2) div").attr('title');
	var romPer = romance.replace('%', '');
	return romPer;
}

function getOwnFriendship()
{
	var friendship = $("div.interactPortrait:not(.normargin) div.box:nth-child(3) p").text().split("\n");
	var pattern    = /Friendship: ([0-9]+)/g;
	var match       = pattern.exec(friendship);

	return match[1];
}

function getTheirFriendship()
{
	var friendship = $("div.interactPortrait.normargin div.box:nth-child(3) p").text().split("\n");
	var pattern    = /Friendship: ([0-9]+)/g;
	var match       = pattern.exec(friendship);

	return match[1];
}

function getOwnLove()
{
	var love = $("div.interactPortrait:not(.normargin) div.box:nth-child(3) p").text().split("\n");
	love = love[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '').split(" ");
	love = parseInt(love[1].replace("%", ""));

	return love;
}

function getTheirLove()
{
	var love = $("div.interactPortrait.normargin div.box:nth-child(3) p").text().split("\n");
	love = love[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '').split(" ");
	love = parseInt(love[1].replace("%", ""));

	return love;
}

function getOwnAge()
{
	return $("div.characterPresentation p").text().match("is ([0-9]{1,2}) year")[1];
}

function getOtherID()
{
	return $("div.interactPortrait div.avatar div.idHolder").eq(1).text();
}

function getSpecialRules()
{
	var rules = $("div.interactHolder div.box table tbody tr td:nth(7)");

	if (rules.length == 1) {
		return rules.text().trim();
	}
}

function fillQueue(table)
{
	var relationship	= null;
	var linkList    	= $(table).find("tr td a[href*='/Character/']");
	var pattern     	= /\/Character\/([0-9]+)/;
	var match       	= null;
	var queue			= getQueue();
	var added			= 0;

	$(linkList).each(function() {
		match  			= pattern.exec($(this).attr("href"));

		// Start with a fresh character object
		relationship		  = new Object();
		relationship.id		  = match[1];
		relationship.name	  = $(this).text();

		if ($(this).children("strong").length > 0) {
			// Characters are in the same city
			relationship.sameCity = Date.now().toString();
		} else {
			// Characters are not in the same city
			relationship.sameCity = 0;
		}

		//relationship.sameCity = $(this).has("strong");

		if (addToQueue(relationship) === true) {
			added++;
		}
	});

	if (added > 0) {
		storeQueue(character, queue);
		storeCharacter(character);
		return true;
	} else {
		return false;
	}
}

function shuffleQueue()
{
	var queue = getQueue();
	queue = shuffleArray(queue);
	storeQueue(character, queue);
	storeCharacter(character);
}

function sortQueue(method)
{
	// Specials
	if (method === "shuffle") {
		return shuffleQueue();
	}

	// Sorting options
	var queue 		= getQueue();
	var newQueue 	= [];

	if (method === "romance") {
		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);

			if (relationship.allowRomance) {
				newQueue.unshift(entry); // Add to top
			} else {
				newQueue.push(entry); // Add to bottom
			}

		});
	}

	else if (method === "friendship") {
		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);

			if (relationship.allowFriendship) {
				newQueue.unshift(entry); // Add to top
			} else {
				newQueue.push(entry); // Add to bottom
			}

		});
	}

	else if (method === "snuggles") {
		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			if (relationship.allowSnuggle) {
				newQueue.unshift(entry); // Add to top
			} else {
				newQueue.push(entry); // Add to bottom
			}

		});
	}

	else if (method === "romance-p") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var c = (a.hasOwnProperty("currentLove")) ? a.currentLove : 0;
			var d = (b.hasOwnProperty("currentLove")) ? b.currentLove : 0;
			return c<d;
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	else if (method === "friendship-p") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var c = (a.hasOwnProperty("currentFriendship")) ? a.currentFriendship : 0;
			var d = (b.hasOwnProperty("currentFriendship")) ? b.currentFriendship : 0;
			return c<d;
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	else if (method === "last-interaction-from") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var c = (a.hasOwnProperty("lastInteractionReceived")) ? new Date(a.lastInteractionReceived).getTime() : 0;
			var d = (b.hasOwnProperty("lastInteractionReceived")) ? new Date(b.lastInteractionReceived).getTime() : 0;
			return c<d;
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	else if (method === "last-interaction-to") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var c = (a.hasOwnProperty("lastInteractionDone")) ? new Date(a.lastInteractionDone).getTime() : 0;
			var d = (b.hasOwnProperty("lastInteractionDone")) ? new Date(b.lastInteractionDone).getTime() : 0;
			return c<d;
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	else if (method === "last-snuggle") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var c = (a.hasOwnProperty("lastSnuggle")) ? new Date(a.lastSnuggle).getTime() : 0;
			var d = (b.hasOwnProperty("lastSnuggle")) ? new Date(b.lastSnuggle).getTime() : 0;
			return c<d;
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	else if (method === "most-snuggles-received") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var cReceived = (a.hasOwnProperty("snugglesReceived")) ? a.snugglesReceived : 0;
			var dReceived = (b.hasOwnProperty("snugglesReceived")) ? b.snugglesReceived : 0;
			return cReceived<dReceived;
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	else if (method === "most-snuggles-performed") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var cPerformed = (a.hasOwnProperty("snugglesPerformed")) ? a.snugglesPerformed : 0;
			var dPerformed = (b.hasOwnProperty("snugglesPerformed")) ? b.snugglesPerformed : 0;
			return cPerformed<dPerformed;
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	else if (method === "most-snuggles") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var cReceived = (a.hasOwnProperty("snugglesReceived")) ? a.snugglesReceived : 0;
			var dReceived = (b.hasOwnProperty("snugglesReceived")) ? b.snugglesReceived : 0;
			var cPerformed = (a.hasOwnProperty("snugglesPerformed")) ? a.snugglesPerformed : 0;
			var dPerformed = (b.hasOwnProperty("snugglesPerformed")) ? b.snugglesPerformed : 0;
			return (cReceived+cPerformed)<(dReceived+dPerformed);
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

		else if (method === "most-interactions-received") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var cReceived = (a.hasOwnProperty("interactionsReceived")) ? a.interactionsReceived : 0;
			var dReceived = (b.hasOwnProperty("interactionsReceived")) ? b.interactionsReceived : 0;
			return cReceived<dReceived;
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	else if (method === "most-interactions-performed") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var cPerformed = (a.hasOwnProperty("interactionsDone")) ? a.interactionsDone : 0;
			var dPerformed = (b.hasOwnProperty("interactionsDone")) ? b.interactionsDone : 0;
			return cPerformed<dPerformed;
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	else if (method === "most-interactions") {
		var list = [];

		queue.forEach(function(entry) {
			relationship = getRelationship(character, entry);
			list.push(relationship);
		});

		list.sort(function(a,b) {
			var cReceived = (a.hasOwnProperty("interactionsReceived")) ? a.interactionsReceived : 0;
			var dReceived = (b.hasOwnProperty("interactionsReceived")) ? b.interactionsReceived : 0;
			var cPerformed = (a.hasOwnProperty("interactionsDone")) ? a.interactionsDone : 0;
			var dPerformed = (b.hasOwnProperty("interactionsDone")) ? b.interactionsDone : 0;
			return (cReceived+cPerformed)<(dReceived+dPerformed);
		});

		list.forEach(function(entry) {
			newQueue.push(entry.other);
		});
	}

	storeQueue(character, newQueue);
	storeCharacter(character);
}


function addToQueue(other)
{
	// TODO: Rename to "createRelationship" and adjust functionality accordingly
	var queue		= getQueue();
	var item		= null;
	var found		= false;
	var changed		= false;
	var relationship = getRelationship(character, other.id, true);

	if (typeof other.name !== 'undefined' && other.name.length > 0 && other.name !== relationship.name) {
		// Given names do not match; update the relationship
		relationship.name = other.name;
		storeRelationship(character, relationship, false);
		changed = true;
	}

	if (other.sameCity !== 'undefined' && other.sameCity !== relationship.sameCity) {

		/*if (relationship.sameCity == 0 && other.sameCity != 0) {
			toastr.success('<strong>' + linkCharacter(other.id, relationship.name) + '</strong> is in town!');
		} else if (relationship.sameCity != 0 && other.sameCity == 0) {
			toastr.warning('<strong>' + linkCharacter(other.id, relationship.name) + '</strong> left town!');
		}*/

		relationship.sameCity = other.sameCity;
		changed = true;
	}

	// Check if the queue contains the character
	queue.forEach(function(entry) {
		item = decodeQueueEntry(entry);

		if (item.id == other.id) {
			found = true;
			return false;	// only breaks out of the foreach loop
		}
	});

	if (found) {
		return changed;
	} else {
		other = encodeQueueEntry(other);
		queue.push(other);
		storeQueue(character, queue);
		//toastr.info('New relationship with <strong>' + linkCharacter(other.id, relationship.name) + '</strong>!');
		return true;
	}
}

function removeFromQueue(charid)
{
	var queue			= getQueue();
	var queueEntry		= null;
	var removedPosition = null;
	var queuePosition	= getQueuePosition();

	for (var i = queue.length-1; i >= 0; i--) {
		queueEntry = decodeQueueEntry(queue[i]);

		if (queueEntry.id == charid) {
			queue.splice(i, 1);
			removedPosition = i;
			// Found the element; break out of the loop
			break;
		}
	}

	if (removedPosition < queuePosition) {
		queuePosition -= 1;
		setQueuePosition( (queuePosition) );
	}

	storeQueue(character, queue);

	storeCharacter(character);
}

function orderQueue(element, event, ui)
{
	// This gives the new sort order, but contains only character id's...
	var sortedOrder = $(element).sortable( "toArray", {attribute: 'data-charid'});
	// Fetch the old order
	var queue		= getQueue();
	// Hold the new queue
	var sortedQueue = new Array();

	var queuePosition  = getQueuePosition();
	var oldPosition	   = null;
	var newPosition	   = null;
	var positionsMoved = 0;

	sortedOrder.forEach(function(id, j) {
		for (var i = 0; i < queue.length; i++) {
			item = decodeQueueEntry(queue[i]);

			// These items match
			if (item.id == id) {
				sortedQueue.push( queue.splice(i, 1)[0] );

				if (i != 0) {
					if (i == 1) {
						positionsMoved += 1;
						if (typeof newPosition !== 'undefined') {
							newPosition = j + 1;
						}

						oldPosition = newPosition - positionsMoved;
					} else {
						newPosition = j;
						oldPosition = (j + i);
					}
				}

				break;
			}
		}
	});

	if (oldPosition > queuePosition  && newPosition <= queuePosition) {
		setQueuePosition(++queuePosition);
	} else if (oldPosition < queuePosition && newPosition > queuePosition) {
		setQueuePosition(--queuePosition);
	} else if (oldPosition == queuePosition) {
		// Follow the character that was moved if they were pointed
		setQueuePosition(newPosition);
	}

	storeQueue(character, sortedQueue);
	storeCharacter(character);
}

function advanceQueue()
{
	var position = getQueuePosition();
	var queue	 = getQueue();

	if (++position < queue.length) {
		setQueuePosition(position);
		setQueueAction("find");
		return true;
	} else {
		setQueuePosition(0);
		setQueueAction("find");
		setAutoInteractActive(false);
		return false;
	}
}

function setQueuePosition(position)
{
	var ownID = character.id;

	if (position < 0) {
		position = 0;
	}

	if (ownID > 0) {
		save('missingo_' + ownID.toString() + '_queuePosition', position);
		highlightQueuePosition();
	}
}

function decodeQueueEntry(entry)
{
	var item = new Object();

	if (entry.indexOf(':') !== -1) {
		entry = entry.split(':')[0];
	}

	item.id		= entry;
	//item.name	= entry[1];

	return item;
}

function encodeQueueEntry(entry)
{
	encoded = entry.id.toString();
	return encoded;
}

function getSelectedCharacter()
{
	if (window.location.href.indexOf('/ChooseCharacter') !== -1) {
		console.log('Character selection detected');
		let content = document.getElementById('ppm-content');
		let buttons = content.querySelectorAll('input[type="submit"]');
		let characterMap = [];

		for (let i = 0, len = buttons.length; i < len; i++) {
			let id = buttons[i].parentNode.parentNode.querySelector("div.idHolder").innerText;
			let name = buttons[i].parentNode.parentNode.querySelector("h2 a").innerText;
			characterMap[i] = id + ':' + name;
		}

		save('characterMap', characterMap.join(','));
	} else {
		let dropdown = document.querySelector('#character-tools-character select');

		// Select all option elements in the dropdown
		let options = dropdown.querySelectorAll('option');
		let characterMap = load('characterMap', '').split(',');

		if (characterMap.length > 0) {
			if ((characterMap.length + 1) !== options.length) {
				alert('CharacterMap appears to be invalid. Try logging out and back in again.');
			} else {
				let temp = {};

				for (let i = 0, len = characterMap.length; i < len; i++) {
					let name = btoa(characterMap[i].split(':')[1]);
					let id = characterMap[i].split(':')[0];

					temp[name] = id;
				}

				characterMap = temp;
			}
		}

		// Set attribute on each option
		for (let i = 0, len = options.length; i < len; i++) {
			options[i].setAttribute('data-id', characterMap[btoa(options[i].innerHTML)]);
		}

		// Now find and return the correct ID
		let selectedOption = dropdown.querySelector('option[selected]');
		let selectedValue  = selectedOption.getAttribute('data-id');

		if (selectedValue && selectedValue !== 'undefined') {
			return selectedValue;
		} else {
			return false;
		}
	}
}

function getRelationship(character, id, autoCreate)
{
	var relationship;

	if (typeof autoCreate === 'undefined') {
		autoCreate = false;
	}

	if (typeof id === 'undefined' || id <= 0) {
		throw 'Function getRelationship requires second parameter to be a character ID.';
	}

	if (character.hasOwnProperty('relationships') === true && character.relationships[id]) {
		relationship = character.relationships[id];
	} else if (autoCreate) {
		relationship        = new Object();
		relationship.owner  = character.id;
		relationship.other  = id;
	}

	if (relationship) {convertRelationship(relationship)};

	return relationship;
}

function convertRelationship(relationship)
{
	// Convert old relationship object properties to new ones
	if (relationship.hasOwnProperty('sex')) {
		relationship.allowSnuggle = (relationship.sex == true);
		delete relationship.sex;
	}

	if (relationship.hasOwnProperty('friendship')) {
		relationship.allowFriendship = (relationship.friendship == true);
		delete relationship.friendship;
	}

	if (relationship.hasOwnProperty('romance')) {
		relationship.allowRomance = (relationship.romance == true);
		delete relationship.romance;
	}

	if (relationship.hasOwnProperty('autoInteract')) {
		relationship.allowAutoInteract = (relationship.autoInteract == true);
		delete relationship.autoInteract;
	}

	if (relationship.hasOwnProperty('lastEventParsed')) {
		if (relationship.lastEventParsed > Date.now() + 48*60*60*1000) {
			relationship.lastEventParsed = null;
		}
	}

	if (relationship.hasOwnProperty('ended')) {
		relationship.endedOn = relationship.ended;
		delete relationship.ended;
	}

	if (!relationship.hasOwnProperty('status')) {
		if (relationship.hasOwnProperty('endedOn')) {
			relationship.status = 'ended';
		} else {
			relationship.status = 'active';
		}
	}
}

function storeRelationship(character, relationship, save)
{
	if (character.hasOwnProperty('relationships') === false) {
		character.relationships = {};
	}

	if (!relationship.other.toString().match(/^([0-9]+)$/) || relationship.other <= 0) {
		// Only  allow saving relationship if ID is properly set (integer > 0)
		throw "Cannot store relationship: Property 'other' is required to be an integer.";
	}

	if (!relationship.hasOwnProperty('mode') || !groupMap.hasOwnProperty(relationship.mode)) {
		relationship.mode = 0;
	}

	character.relationships[relationship.other] = relationship;

	// Flush to database if save flag is set (default: true)
	if (save !== false) {
		storeCharacter(character);
	}
}

function getQueue()
{
	var ownID		= character.id;
	var queue		= character.sidebar;

	if (typeof queue === 'undefined' || queue.length <= 0) {
		// This queue does not exist or is in a unsupported format; return an empty array instead
		returnVal = [];
	} else {
		returnVal = queue;
	}

	return returnVal;
}

function storeQueue(character, queue)
{

	if (queue.length <= 0 ) {
		return false;
	} else if (character.hasOwnProperty("sidebar") === false) {
		character.sidebar = [];
	}

	character.sidebar = queue;
}

function parseIdFromCharacterPage()
{
	/*var parsedId = $("#character-tools-character select").val();*/
	var parsedId = $("div.idHolder").text();

	if (parsedId === 'undefined' || parsedId <= 0) {
		throw 'Could not parse Character ID';
	}

	return parsedId;
}

function parseCityIdFromCharacterPage()
{
	var parsedText = $("div.characterPresentation a[href*='/City/']").attr("href");
	var parsedId   = /\/City\/([0-9]+)/g.exec(parsedText);

	return parsedId[1];
}

function modifyOwnCharacterPage()
{
	var cityID = parseCityIdFromCharacterPage();
	var quickMoveButtons = '';

	if (character.hasOwnProperty('quickmove') && character.quickmove.hasOwnProperty(cityID)) {
		for (var key in character.quickmove[cityID]) {
			var obj = character.quickmove[cityID][key];
			quickMoveButtons += '<button type="button" data-localeid="' + key + '">' + obj.name + '</button>';
		}
	}

	$("div.charPresBox").after('\
		<div class="box" id="pa-ownCharacter">\
			<h2>Popmundo Assistant</h2>\
			<div>\
				<span>Move to: </span>\
				<button type="button" id="pa-qm-hotel">Hotel</button>\
				<button type="button" id="pa-qm-gym">Gym</button>\
				' + quickMoveButtons + '\
			</div>\
		</div>'
	);

	// Bind events
	$("#pa-qm-hotel").click(function() {
		var cityId = parseCityIdFromCharacterPage();
		quickMove(cityId, 32);
		return false;
	});
	$("#pa-qm-gym").click(function() {
		var cityId = parseCityIdFromCharacterPage();
		quickMove(cityId, 11);
		return false;
	});
	$("button[data-localeid]").click(function()  {
		navigateTo(window.location.origin + "/World/Popmundo.aspx/Locale/MoveToLocale/" + $(this).attr('data-localeid'));
	});
}

function quickMove(cityId, localeTypeId)
{
	navigateTo(window.location.origin + "/World/Popmundo.aspx/City/Locales/" + cityId + "#pa-qm=" + localeTypeId);
}

function isCharacterDead()
{
	// Can only be called on character overview page
	return ($("#ctl00_cphLeftColumn_ctl00_divFinalStatement").length > 0);
}

function isCharacterInSameCity(relationship)
{
	if (!relationship.hasOwnProperty("sameCity")) {
		return false;
	}

	// Only consider information accurate if it's less than an hour old
	if (Date.now() - relationship.sameCity < 3600*1000) {
		return true;
	}

	return false;
}


$(function() {
	console.log("Popmundo Assistant Active");
	var startTime = new Date();
	var activeCharacterID = getSelectedCharacter();

	if (activeCharacterID) {
		character = getCharacter(activeCharacterID);

		insertBackdrop();
		// Call to main script function
		setTimeout(function() {missingo(), 250});
	} else {
		throw "Could not find the active character ID.";
	}
});