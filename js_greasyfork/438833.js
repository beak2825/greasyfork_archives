// ==UserScript==
// @name        蝦皮網址縮短
// @namespace   https://greasyfork.org/scripts/438833
// @version     1.7
// @description 蝦皮商品頁面的網址很冗長，將其縮短，方便複製、分享、儲存成乾淨的書籤
// @author      fmnijk
// @match       https://shopee.tw/*
// @icon        https://shopee.tw/favicon.ico
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438833/%E8%9D%A6%E7%9A%AE%E7%B6%B2%E5%9D%80%E7%B8%AE%E7%9F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/438833/%E8%9D%A6%E7%9A%AE%E7%B6%B2%E5%9D%80%E7%B8%AE%E7%9F%AD.meta.js
// ==/UserScript==

/* $ and $$ */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/*----https://raw.githubusercontent.com/einaregilsson/Redirector/master/js/redirect.js start----*/
function Redirect(o) {
	this._init(o);
}

//Static
Redirect.WILDCARD = 'W';
Redirect.REGEX = 'R';

Redirect.requestTypes = {
	main_frame: "Main window (address bar)",
	sub_frame: "IFrames",
	stylesheet : "Stylesheets",
	font: "Fonts",
	script : "Scripts",
	image : "Images",
	imageset: "Responsive Images in Firefox",
	object : "Objects (e.g. Flash content, Java applets)",
	object_subrequest : "Object subrequests",
	xmlhttprequest : "XMLHttpRequests (Ajax)",
	history : "HistoryState",
	other : "Other"
};


Redirect.prototype = {

	//attributes
	description : '',
	exampleUrl : '',
	exampleResult : '',
	error : null,
	includePattern : '',
	excludePattern : '',
	patternDesc:'',
	redirectUrl : '',
	patternType : '',
	processMatches : 'noProcessing',
	disabled : false,
	grouped: false,

	compile : function() {

		var incPattern = this._preparePattern(this.includePattern);
		var excPattern = this._preparePattern(this.excludePattern);

		if (incPattern) {
			this._rxInclude = new RegExp(incPattern, 'gi');
		}
		if (excPattern) {
			this._rxExclude = new RegExp(excPattern, 'gi');
		}
	},

	equals : function(redirect) {
		return this.description == redirect.description
			&& this.exampleUrl == redirect.exampleUrl
			&& this.includePattern == redirect.includePattern
			&& this.excludePattern == redirect.excludePattern
			&& this.patternDesc == redirect.patternDesc
			&& this.redirectUrl == redirect.redirectUrl
			&& this.patternType == redirect.patternType
			&& this.processMatches == redirect.processMatches
			&& this.appliesTo.toString() == redirect.appliesTo.toString();
	},

	toObject : function() {
		return {
			description : this.description,
			exampleUrl : this.exampleUrl,
			exampleResult : this.exampleResult,
			error : this.error,
			includePattern : this.includePattern,
			excludePattern : this.excludePattern,
			patternDesc : this.patternDesc,
			redirectUrl : this.redirectUrl,
			patternType : this.patternType,
			processMatches : this.processMatches,
			disabled : this.disabled,
			grouped: this.grouped,
			appliesTo : this.appliesTo.slice(0)
		};
	},

	getMatch: function(url, forceIgnoreDisabled) {
		if (!this._rxInclude) {
			this.compile();
		}
		var result = {
			isMatch : false,
			isExcludeMatch : false,
			isDisabledMatch : false,
			redirectTo : '',
			toString : function() { return JSON.stringify(this); }
		};
		var redirectTo = this._includeMatch(url);

		if (redirectTo !== null) {
			if (this.disabled && !forceIgnoreDisabled) {
				result.isDisabledMatch = true;
			} else if (this._excludeMatch(url)) {
				result.isExcludeMatch = true;
			} else {
				result.isMatch = true;
				result.redirectTo = redirectTo;
			}
		}
		return result;
	},

	//Updates the .exampleResult field or the .error
	//field depending on if the example url and patterns match
	//and make a good redirect
	updateExampleResult : function() {

		//Default values
		this.error = null;
		this.exampleResult = '';


		if (!this.exampleUrl) {
			this.error = 'No example URL defined.';
			return;
		}

		if (this.patternType == Redirect.REGEX && this.includePattern) {
			try {
				new RegExp(this.includePattern, 'gi');
			} catch(e) {
				this.error = 'Invalid regular expression in Include pattern.';
				return;
			}
		}

		if (this.patternType == Redirect.REGEX && this.excludePattern) {
			try {
				new RegExp(this.excludePattern, 'gi');
			} catch(e) {
				this.error = 'Invalid regular expression in Exclude pattern.';
				return;
			}
		}

		if (!this.appliesTo || this.appliesTo.length == 0) {
			this.error = 'At least one request type must be chosen.';
			return;
		}

		this.compile();

		var match = this.getMatch(this.exampleUrl, true);

		if (match.isExcludeMatch) {
			this.error = 'The exclude pattern excludes the example url.'
			return;
		}

		//Commented out because this code prevents saving many types of valid redirects.
		//if (match.isMatch && !match.redirectTo.match(/^https?\:\/\//)) {
		//	this.error = 'The redirect result must start with http:// or https://, current result is: "' + match.redirectTo;
		//	return;
		//}

    if (!match.isMatch) {
			this.error = 'The include pattern does not match the example url.';
			return;
		}

		this.exampleResult = match.redirectTo;
	},

	isRegex: function() {
		return this.patternType == Redirect.REGEX;
	},

	isWildcard : function() {
		return this.patternType == Redirect.WILDCARD;
	},

	test : function() {
		return this.getMatch(this.exampleUrl);
	},

	//Private functions below
	_rxInclude : null,
	_rxExclude : null,

	_preparePattern : function(pattern) {
		if (!pattern) {
			return null;
		}
		if (this.patternType == Redirect.REGEX) {
			return pattern;
		} else { //Convert wildcard to regex pattern
			var converted = '^';
			for (var i = 0; i < pattern.length; i++) {
				var ch = pattern.charAt(i);
				if ('()[]{}?.^$\\+'.indexOf(ch) != -1) {
					converted += '\\' + ch;
				} else if (ch == '*') {
					converted += '(.*?)';
				} else {
					converted += ch;
				}
			}
			converted += '$';
			return converted;
		}
	},

	_init : function(o) {
		o = o || {};
		this.description = o.description || '';
		this.exampleUrl = o.exampleUrl || '';
		this.exampleResult = o.exampleResult || '';
		this.error = o.error || null;
		this.includePattern = o.includePattern || '';
		this.excludePattern = o.excludePattern || '';
		this.redirectUrl = o.redirectUrl || '';
		this.patternType = o.patternType || Redirect.WILDCARD;

		this.patternTypeText = this.patternType == 'W' ? 'Wildcard' : 'Regular Expression'

		this.patternDesc = o.patternDesc || '';
		this.processMatches = o.processMatches || 'noProcessing';
		if (!o.processMatches && o.unescapeMatches) {
			this.processMatches = 'urlDecode';
		}
		if (!o.processMatches && o.escapeMatches) {
			this.processMatches = 'urlEncode';
		}

		this.disabled = !!o.disabled;
		if (o.appliesTo && o.appliesTo.length) {
			this.appliesTo = o.appliesTo.slice(0);
		} else {
			this.appliesTo = ['main_frame'];
		}
	},

	get appliesToText() {
		return this.appliesTo.map(type => Redirect.requestTypes[type]).join(', ');
	},

	get processMatchesExampleText() {
		let examples = {
			noProcessing : 'Use matches as they are',
			urlEncode : 'E.g. turn /bar/foo?x=2 into %2Fbar%2Ffoo%3Fx%3D2',
			urlDecode : 'E.g. turn %2Fbar%2Ffoo%3Fx%3D2 into /bar/foo?x=2',
			doubleUrlDecode : 'E.g. turn %252Fbar%252Ffoo%253Fx%253D2 into /bar/foo?x=2',
			base64Decode : 'E.g. turn aHR0cDovL2Nubi5jb20= into http://cnn.com'
		};

		return examples[this.processMatches];
	},

	toString : function() {
		return JSON.stringify(this.toObject(), null, 2);
	},

	_includeMatch : function(url) {
		if (!this._rxInclude) {
			return null;
		}
		var matches = this._rxInclude.exec(url);
		if (!matches) {
			return null;
		}
		var resultUrl = this.redirectUrl;
		for (var i = matches.length - 1; i > 0; i--) {
			var repl = matches[i] || '';
			if (this.processMatches == 'urlDecode') {
				repl = unescape(repl);
			} else if (this.processMatches == 'doubleUrlDecode') {
				repl = unescape(unescape(repl));
			} else if (this.processMatches == 'urlEncode') {
				repl = encodeURIComponent(repl);
			} else if (this.processMatches == 'base64decode') {
				if (repl.indexOf('%') > -1) {
					repl = unescape(repl);
				}
				repl = atob(repl);
			}
			resultUrl = resultUrl.replace(new RegExp('\\$' + i, 'gi'), repl);
		}
		this._rxInclude.lastIndex = 0;
		return resultUrl;
	},

	_excludeMatch : function(url) {
		if (!this._rxExclude) {
			return false;
		}
		var shouldExclude = this._rxExclude.test(url);
		this._rxExclude.lastIndex = 0;
		return shouldExclude;
	}
};
/*----https://raw.githubusercontent.com/einaregilsson/Redirector/master/js/redirect.js end----*/

// main function
(function() {
    'use strict';
    sturl();
    window.addEventListener('locationchange', function (){
        sturl();
    })
})();

// shorten url
function sturl() {
    // url
    var url = window.location.href;
    // new url
    var nurl = window.location.href;
    // query string need to be removed
    var qs = [
        'sp_atk',
        'xptdk',
        'af_siteid',
        'pid',
        'af_click_lookback',
        'af_viewthrough_lookback',
        'is_retargeting',
        'af_reengagement_window',
        'af_sub_siteid',
        'c',
        'smtt',
        'is_from_login',
        'entryPoint',
        'upstream',
        'extraParams',
    ];
    // query string need to be removed if equal to something
    var qseq = [['page', '0']];
    // includePattern
    var inp = 'https://shopee.tw/*-i.*.*'
    // redirectUrl
    var reu = 'https://shopee.tw/product/$2/$3'

    // remove not necessary query string
    nurl = rmqs(nurl, qs);
    // remove not necessary query string if equal to something
    nurl = rmqseq(nurl, qseq);
    // rewrite url from includePattern to redirectUrl
    nurl = rwurl(nurl, inp, reu);

    // do nothing if new url is the same as url
    if (url == nurl){
        return false;
    }

    // update url in address bar to new url
    window.history.replaceState(null, null, nurl);

    // update url in address bar to new url(deprecated)
    //window.location.replace(nurl)
}

// remove not necessary query string
function rmqs(url, qs) {
    url = new URL(url);
    qs.forEach(function(i){
        url.searchParams.delete(i);
    });
    return url;
}

// remove not necessary query string if equal to something
function rmqseq(url, qseq) {
    url = new URL(url);
    qseq.forEach(function(i){
        if (url.searchParams.get(i[0]) == i[1]){
            url.searchParams.delete(i[0]);
        }
    });
    return url.toString();
}

// rewrite url from includePattern to redirectUrl
function rwurl(url, inp, reu) {
    var activeRedirect = new Redirect();
    activeRedirect.appliesTo = Redirect.requestTypes.main_frame;
    activeRedirect.patternType = Redirect.WILDCARD;
    activeRedirect.exampleUrl = url
    activeRedirect.includePattern = inp;
    activeRedirect.redirectUrl = reu;
    activeRedirect.updateExampleResult();
    if (activeRedirect.error == null){
        url = activeRedirect.exampleResult
    }
    return url;
}

/*----force listen to locationchange work start----*/
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('locationchange'))
});
/*----force listen to locationchange work end----*/

