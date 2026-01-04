// ==UserScript==
// @name         Quick debug (updated default versions)
// @run-at       document-start
// @namespace    org.jixun.quick.debug
// @version      1.0.0.3
// @description  Quick inject scripts/style to current page.
// @author       Jixun
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458709/Quick%20debug%20%28updated%20default%20versions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458709/Quick%20debug%20%28updated%20default%20versions%29.meta.js
// ==/UserScript==

(function () {

var extend = function (src) {
	if (arguments.length <= 1)
		return src;

	var args = [].slice.call(arguments, 1);
	for (var i = 0; i<args.length; i++) {
		var obj = args[i];

		for (var key in obj) {
			if (!obj.hasOwnProperty (key))
				continue;

			if ('object' == typeof obj[key] && !obj[key].map) {
				if (!src[key]) src[key] = {};

				extend(src[key], obj[key]);
				continue;
			}

			src[key] = obj[key];
		}
	}

	return src;
};

window.QuickDebug = window._QD = function () {
	this._QD.script.jQuery();
};

extend (window._QD, {
	script: function (str) {
		var $src = this.script;

		(	this.isUrl(str)
			? $src.url
			: $src.text
		).apply($src, arguments);
	},

	css: function (str) {
		var $src = this.css;

		(	this.isUrl(str)
			? $src.url
			: $src.text
		).apply($src, arguments);
	},

	isUrl: function (str) {
		return /^(https?\:\/\/|\.|\/)/.test(str);
	}
});

extend(window._QD.script, {
	url: function (url, ver, onload) {
		var s = document.createElement('script');
		url = url.replace('%ver', ver);

		s.src = url;
		s.onload = function () {
			console.info ('Script loaded: %s', url);

			onload && onload();
		};
		document.head.appendChild(s);
	},

	text: function (text) {
		var s = document.createElement('script');
		s.textContent = text;
		document.head.appendChild(s);
	},

	jQuery: function (ver) {
		this.url ('https://code.jquery.com/jquery-%ver.js', ver || 'latest');
	},

	vue: function (ver) {
		this.url ('https://cdnjs.cloudflare.com/ajax/libs/vue/%ver/vue.cjs.js', ver || '3.2.45');
	},

	bootstrap: function (ver) {
		if (!window.jQuery) this.jQuery();
                  // https://maxcdn.bootstrapcdn.com/bootstrap/%ver/css/bootstrap.min.css
		this.url ('https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.min.js', ver || '5.2.3');
	},

	mathJax: function (config) {
		this.url ('https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=%ver',
			config || 'TeX-AMS-MML_HTMLorMML');
	}
});

extend(window._QD.css, {
	url: function (url, ver, onload) {
		var s = document.createElement('link');
		url = url.replace('%ver', ver);

		s.rel = 'stylesheet';
		s.href = url;
		s.onload = function () {
			console.info ('Style loaded: %s', url);

			onload && onload();
		};
		document.head.appendChild(s);
	},

	text: function (text) {
		var s = document.createElement('style');
		s.textContent = text;
		document.head.appendChild(s);
	},

	bootstrap: function (ver) {
		this.url ('https://maxcdn.bootstrapcdn.com/bootstrap/%ver/css/bootstrap.min.css', ver || '5.2.3');
	}
});


})();