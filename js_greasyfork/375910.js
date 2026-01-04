// ==UserScript==
// @name          Native implementation of a jsFiddle.net in-pane log console
// @version       0.1.0
// @description   To be used among external libraries when testing other jsFiddle.net scripts
// @namespace     https://greasyfork.org/en/users/15562
// @author        Jonathan Brochu (https://greasyfork.org/en/users/15562)
// @license       GPLv3 or later (http://www.gnu.org/licenses/gpl-3.0.en.html)
// @include       https://jsfiddle.net/*
// @grant         GM_addStyle
// ==/UserScript==

/***
 * History:
 *
 * 0.1.0  First implementation, based on own's previous work. (2018-12-24)
 *
 */

// Helpers, implemented on Element/Document/DocumentFragment.prototype
(function (arrTargets, arrSpecs) {
	var __fn__ = 'function',
		__und__ = 'undefined';
	arrTargets.forEach(function (target) {
		arrSpecs.forEach(function (spec) {
			if (typeof spec.prop  === __und__) {
				return;
			}
			if (typeof spec.impl === __und__) {
				return;
			}
			var propName = spec.prop,
				propImpl = spec.impl;
				accessors = spec.accessors.split('|'),
				getArgCount = spec.getArgCount || spec.setArgCount-1 || 0,
				readOnly = (typeof spec.readOnly !== __und__ ? spec.readOnly : false);
			if (target.hasOwnProperty(propName)) {
				return;
			}
			if (typeof propImpl !== __fn__) {
				return;
			}
			var desc = {
				configurable: true,
				enumerable: true,
				writable: !readOnly
			};
			['get', 'set', 'value'].forEach(function(item) {
				if (accessors.indexOf(item) == -1) return;
				switch(item) {
					case 'get': desc[item] = function() {
						return (typeof propImpl === __fn__ ? propImpl.apply(this, arguments) : propImpl);
					}; break;
					case 'set': desc[item] = function() {
						return (typeof propImpl === __fn__ ? propImpl.apply(this, arguments) : propImpl);
					}; break;
					default: desc[item] = propImpl;
				}
			});
			if (typeof desc.get !== __und__) {
				delete desc.value;
				delete desc.writable;
			}
			if (typeof desc.set !== __und__) {
				delete desc.writable;
			}
			Object.defineProperty(target, propName, desc);
		});
	});
})(
	[Element.prototype, Document.prototype, DocumentFragment.prototype],
	[
		{
			/*
			 * Source: https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append
			 * Original Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
			 */
			prop: 'append',
			accessors: 'value',
			impl: function append() {
					console.$nativeImpl.log('.append() { console.log(this); } => ' + this);
					var argArr = Array.prototype.slice.call(arguments),
						docFrag = document.createDocumentFragment();
					argArr.forEach(function (argItem) {
						var isNode = argItem instanceof Node;
						docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
					});
					this.appendChild(docFrag);
					return this;
				}
		},
		{
			prop: 'empty',
			accessors: 'value',
			impl: function empty() {
					while (this.childNodes.length) this.removeChild(this.firstChild);
					return this;
				}
		},
		{
			prop: 'html',
			accessors: 'value',
			impl: function html() {
					if (arguments.length) {
						switch(typeof arguments[0]) {
							case 'string':
								this.innerHTML = arguments[0];
								break;
							default:
								this.empty();
								this.append(arguments[0]);
						}
						return this;
					} else {
						return this.innerHTML;
					}
				}
		}
	]
);

// doc.gEBI() & createElementFromHTML() Wrapper
$ = function() {
	if (!arguments.length) return;
	if (typeof arguments[0] === 'string') {
		var arg = arguments[0];
		if (/\s/.test(arg)) {
			/*
			 * function createElementFromHTML()
			 * Source: https://stackoverflow.com/a/494348/3865919
			 * Author: Crescent Fresh <https://stackoverflow.com/users/45433/crescent-fresh>
			 */
			try {
				var tmpDiv = document.createElement('div');
				tmpDiv.innerHTML = arg.trim();
				return tmpDiv.firstChild;
			} catch(e) {
				return null;
			}
		} else {
			return document.getElementById(arg);
		}
	} else if (arguments[0] instanceof Element) {
		return arguments[0];
	} else return null;
};
$.addCSS = function(css, media) {
	/*
	 * Rewrite of own's addStyle() using code from...
	 * Source: https://stackoverflow.com/a/524721
	 * Author: Christoph <https://stackoverflow.com/users/48015/christoph>
	 */
	if (typeof(GM_addStyle) !== 'undefined' && !media) {
		GM_addStyle(css);
	} else {
		if (!media) { media = 'all'; }
		var head = document.head || document.getElementsByTagName('head')[0],
			styleNode = document.createElement('style');
		styleNode.type = 'text/css';
		if (media) styleNode.media = media;
		if (styleNode.styleSheet){
			// This is required for IE8 and below.
			styleNode.styleSheet.cssText = css;
		} else {
			styleNode.appendChild(document.createTextNode(css));
		}
		head.appendChild(styleNode);
	}
};

// console.{} implementation
(function(_) {
	// make sure we don't override native implementation more than once
	if (_.console.clear.toString() !== 'function clear() { [native code] }') { return; }
	var __fn__ = 'function',
		consoleId = 'console-log',
		consoleLine = '<p id="%" class="*-line"></p>',
		_console = _.console || {},
		methods = ['log', 'info', 'warn', 'error', 'trace'];
	_.console = {
		$init: function() {
			if ($(consoleId)) { return; }
			var container = '<div id="console-log" class="scrollbar"></div>',
				css = 
					'body {\n' +
					'	/*background: #1F252D;\n*/' +
					'}\n' +
					'#console-log {\n' +
					'	font-family: "SF Mono", Monaco, "Andale Mono", "Lucida Console", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace;\n' +
					'	font-size: 12px;\n' +
					'	font-variant-ligatures: contextual;\n' +
					'	color: rgb(207, 208, 210);\n' +
					'	background: #313B47;\n' +
					'	border: 3px solid #1B2027;\n' +
					'	border-radius: 5px;\n' +
					'	padding: 10px; \n' +
					'	margin: 5px;\n' +
					'	width: 93%;\n' +
					'	min-height: 50px;\n' +
					'	max-height: 150px;\n' +
					'	position: absolute;\n' +
					'	bottom: 5px;\n' +
					'	overflow: scroll;\n' +
					'}\n' +
					'.log-line,\n' +
					'.info-line,\n' +
					'.warn-line,\n' +
					'.error-line,\n' +
					'.trace-line {\n' +
					'	font-family: monospace;\n' +
					'	margin: 2px;\n' +
					'	white-space: nowrap;\n' +
					'}\n' +
					'.log-line {\n' +
					'	color: rgb(207, 208, 210);\n' +
					'}\n' +
					'.info-line {\n' +
					'	color: #6ce890;\n' +
					'}\n' +
					'.warn-line {\n' +
					'	color: #f8b068;\n' +
					'}\n' +
					'.error-line {\n' +
					'	color: #ff4f68;\n' +
					'	font-weight: bold;\n' +
					'}\n' +
					'.trace-line {\n' +
					'	color: #b896ed;\n' +
					'}\n' +
					'#console-log.scrollbar::-webkit-scrollbar-track {\n' +
					'	-webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.3);\n' +
					'	border-radius: 5px;\n' +
					'	background-color: #313B47;\n' +
					'}\n' +
					'#console-log.scrollbar::-webkit-scrollbar {\n' +
					'	width: 10px;\n' +
					'	height: 10px;\n' +
					'	background-color: #313B47;\n' +
					'}\n' +
					'#console-log.scrollbar::-webkit-scrollbar-thumb {\n' +
					'	border-radius: 5px;\n' +
					'	-webkit-box-shadow: inset 0 0 4px rgba(0,0,0,.3);\n' +
					'	background-color: #262E38;\n' +
					'}\n' +
					'#console-log.scrollbar::-webkit-scrollbar-corner {\n' +
					'	background: #262E38;\n' +
					'}\n',
				body = document.body || document.getElementsByTagName('body')[0];
			$.addCSS(css);
			body.append($(container));
		},
		$typedLog: function(logMethod, text) {
			if (methods.indexOf(logMethod) == -1) { return; }
			if (!this.$enabled) { return; }
			this.$init();
			var consoleEl = $(consoleId),
				lineHTML = consoleLine
					.replace(/\*.{0}/, logMethod)
					.replace(/\%/, 'console-line-'+this.$lineCounter),
				newLineEl = $(lineHTML);
			newLineEl.html(text);
			consoleEl.append(newLineEl);
			consoleEl.scrollTop = consoleEl.scrollHeight;
			this.$lineCounter++;
		},
		$enabled: true,
		$echoNative: false,
		$lineCounter: 0,
		$nativeImpl: _console,
		clear: function() {
			this.$init();
			$(consoleId).empty();
		}
	};
	for (var prop in _.console) {
		if (!Object.prototype.hasOwnProperty.call(_.console, prop)) continue;
		if (typeof _.console[prop] !== __fn__) continue;
		_.console[prop] = _.console[prop].bind(_.console);
	}
	methods.forEach(function(method) {
		_.console[method] = function() { this.$typedLog(method,  Array.prototype.slice.call(arguments).join(' ')); }.bind(_.console);
	});
	var doEcho = function(method, args) {
			if (!this.$echoNative && this.$enabled) { return; }
			if (typeof _console.clear !== __fn__ ) { return; }
			if (typeof _console[method] !== __fn__ ) { return; }
			_console[method].apply(this, args);
		}.bind(_.console);
	// wrap methods to include echo calls
	(function(target) {
		for (var prop in target) {
			if (!Object.prototype.hasOwnProperty.call(target, prop)) continue;
			if (typeof target[prop] !== __fn__) continue;
			if (target[prop].$extended) continue;
			if (prop.charAt(0) === '$') continue;
			target[prop] = (function(){
				var _prop = prop,
					_fn = target[prop];
				return function() {
					doEcho(_prop, Array.prototype.slice.call(arguments));
					_fn.apply(_fn, arguments);
				};
			})();
			target[prop].$extended = true;
		}
	})(_.console);
})(window);

/*
 * Examples:
 *
console.$echoNative = true;
console.clear();
console.log("Hello console");
console.info("Need some info?");
console.warn("I might not have what you need though");
console.error("ERROR: Data not found!!");
console.trace("This is somevery long line of unnecessary text his is somevery long line of unnecessary text his is somevery long line of unnecessary text");
 */