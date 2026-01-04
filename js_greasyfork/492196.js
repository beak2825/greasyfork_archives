// ==UserScript==
// @name         快捷提交SQL工单
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  KIWIPlus 提供快捷提交SQL工单功能
// @author       ka1D0u
// @match        https://kiwi.akusre.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @resource customCSS https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492196/%E5%BF%AB%E6%8D%B7%E6%8F%90%E4%BA%A4SQL%E5%B7%A5%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/492196/%E5%BF%AB%E6%8D%B7%E6%8F%90%E4%BA%A4SQL%E5%B7%A5%E5%8D%95.meta.js
// ==/UserScript==




const addGlobalStyle = (css) => {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}


/* Notify.js - http://notifyjs.com/ Copyright (c) 2015 MIT */
(function (factory) {
	// UMD start
	// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function( root, jQuery ) {
			if ( jQuery === undefined ) {
				// require('jQuery') returns a factory that requires window to
				// build a jQuery instance, we normalize how we use modules
				// that require this pattern but the window provided is a noop
				// if it's defined (how jquery works)
				if ( typeof window !== 'undefined' ) {
					jQuery = require('jquery');
				}
				else {
					jQuery = require('jquery')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	//IE8 indexOf polyfill
	var indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	};

	var pluginName = "notify";
	var pluginClassName = pluginName + "js";
	var blankFieldName = pluginName + "!blank";

	var positions = {
		t: "top",
		m: "middle",
		b: "bottom",
		l: "left",
		c: "center",
		r: "right"
	};
	var hAligns = ["l", "c", "r"];
	var vAligns = ["t", "m", "b"];
	var mainPositions = ["t", "b", "l", "r"];
	var opposites = {
		t: "b",
		m: null,
		b: "t",
		l: "r",
		c: null,
		r: "l"
	};

	var parsePosition = function(str) {
		var pos;
		pos = [];
		$.each(str.split(/\W+/), function(i, word) {
			var w;
			w = word.toLowerCase().charAt(0);
			if (positions[w]) {
				return pos.push(w);
			}
		});
		return pos;
	};

	var styles = {};

	var coreStyle = {
		name: "core",
		html: "<div class=\"" + pluginClassName + "-wrapper\">\n	<div class=\"" + pluginClassName + "-arrow\"></div>\n	<div class=\"" + pluginClassName + "-container\"></div>\n</div>",
		css: "." + pluginClassName + "-corner {\n	position: fixed;\n	margin: 5px;\n	z-index: 1050;\n}\n\n." + pluginClassName + "-corner ." + pluginClassName + "-wrapper,\n." + pluginClassName + "-corner ." + pluginClassName + "-container {\n	position: relative;\n	display: block;\n	height: inherit;\n	width: inherit;\n	margin: 3px;\n}\n\n." + pluginClassName + "-wrapper {\n	z-index: 1;\n	position: absolute;\n	display: inline-block;\n	height: 0;\n	width: 0;\n}\n\n." + pluginClassName + "-container {\n	display: none;\n	z-index: 1;\n	position: absolute;\n}\n\n." + pluginClassName + "-hidable {\n	cursor: pointer;\n}\n\n[data-notify-text],[data-notify-html] {\n	position: relative;\n}\n\n." + pluginClassName + "-arrow {\n	position: absolute;\n	z-index: 2;\n	width: 0;\n	height: 0;\n}"
	};

	var stylePrefixes = {
		"border-radius": ["-webkit-", "-moz-"]
	};

	var getStyle = function(name) {
		return styles[name];
	};

	var removeStyle = function(name) {
		if (!name) {
			throw "Missing Style name";
		}
		if (styles[name]) {
			delete styles[name];
		}
	};

	var addStyle = function(name, def) {
		if (!name) {
			throw "Missing Style name";
		}
		if (!def) {
			throw "Missing Style definition";
		}
		if (!def.html) {
			throw "Missing Style HTML";
		}
		//remove existing style
		var existing = styles[name];
		if (existing && existing.cssElem) {
			if (window.console) {
				console.warn(pluginName + ": overwriting style '" + name + "'");
			}
			styles[name].cssElem.remove();
		}
		def.name = name;
		styles[name] = def;
		var cssText = "";
		if (def.classes) {
			$.each(def.classes, function(className, props) {
				cssText += "." + pluginClassName + "-" + def.name + "-" + className + " {\n";
				$.each(props, function(name, val) {
					if (stylePrefixes[name]) {
						$.each(stylePrefixes[name], function(i, prefix) {
							return cssText += "	" + prefix + name + ": " + val + ";\n";
						});
					}
					return cssText += "	" + name + ": " + val + ";\n";
				});
				return cssText += "}\n";
			});
		}
		if (def.css) {
			cssText += "/* styles for " + def.name + " */\n" + def.css;
		}
		if (cssText) {
			def.cssElem = insertCSS(cssText);
			def.cssElem.attr("id", "notify-" + def.name);
		}
		var fields = {};
		var elem = $(def.html);
		findFields("html", elem, fields);
		findFields("text", elem, fields);
		def.fields = fields;
	};

	var insertCSS = function(cssText) {
		var e, elem, error;
		elem = createElem("style");
		elem.attr("type", 'text/css');
		$("head").append(elem);
		try {
			elem.html(cssText);
		} catch (_) {
			elem[0].styleSheet.cssText = cssText;
		}
		return elem;
	};

	var findFields = function(type, elem, fields) {
		var attr;
		if (type !== "html") {
			type = "text";
		}
		attr = "data-notify-" + type;
		return find(elem, "[" + attr + "]").each(function() {
			var name;
			name = $(this).attr(attr);
			if (!name) {
				name = blankFieldName;
			}
			fields[name] = type;
		});
	};

	var find = function(elem, selector) {
		if (elem.is(selector)) {
			return elem;
		} else {
			return elem.find(selector);
		}
	};

	var pluginOptions = {
		clickToHide: true,
		autoHide: true,
		autoHideDelay: 5000,
		arrowShow: true,
		arrowSize: 5,
		breakNewLines: true,
		elementPosition: "bottom",
		globalPosition: "top right",
		style: "bootstrap",
		className: "error",
		showAnimation: "slideDown",
		showDuration: 400,
		hideAnimation: "slideUp",
		hideDuration: 200,
		gap: 5
	};

	var inherit = function(a, b) {
		var F;
		F = function() {};
		F.prototype = a;
		return $.extend(true, new F(), b);
	};

	var defaults = function(opts) {
		return $.extend(pluginOptions, opts);
	};

	var createElem = function(tag) {
		return $("<" + tag + "></" + tag + ">");
	};

	var globalAnchors = {};

	var getAnchorElement = function(element) {
		var radios;
		if (element.is('[type=radio]')) {
			radios = element.parents('form:first').find('[type=radio]').filter(function(i, e) {
				return $(e).attr("name") === element.attr("name");
			});
			element = radios.first();
		}
		return element;
	};

	var incr = function(obj, pos, val) {
		var opp, temp;
		if (typeof val === "string") {
			val = parseInt(val, 10);
		} else if (typeof val !== "number") {
			return;
		}
		if (isNaN(val)) {
			return;
		}
		opp = positions[opposites[pos.charAt(0)]];
		temp = pos;
		if (obj[opp] !== undefined) {
			pos = positions[opp.charAt(0)];
			val = -val;
		}
		if (obj[pos] === undefined) {
			obj[pos] = val;
		} else {
			obj[pos] += val;
		}
		return null;
	};

	var realign = function(alignment, inner, outer) {
		if (alignment === "l" || alignment === "t") {
			return 0;
		} else if (alignment === "c" || alignment === "m") {
			return outer / 2 - inner / 2;
		} else if (alignment === "r" || alignment === "b") {
			return outer - inner;
		}
		throw "Invalid alignment";
	};

	var encode = function(text) {
		encode.e = encode.e || createElem("div");
		return encode.e.text(text).html();
	};

	function Notification(elem, data, options) {
		if (typeof options === "string") {
			options = {
				className: options
			};
		}
		this.options = inherit(pluginOptions, $.isPlainObject(options) ? options : {});
		this.loadHTML();
		this.wrapper = $(coreStyle.html);
		if (this.options.clickToHide) {
			this.wrapper.addClass(pluginClassName + "-hidable");
		}
		this.wrapper.data(pluginClassName, this);
		this.arrow = this.wrapper.find("." + pluginClassName + "-arrow");
		this.container = this.wrapper.find("." + pluginClassName + "-container");
		this.container.append(this.userContainer);
		if (elem && elem.length) {
			this.elementType = elem.attr("type");
			this.originalElement = elem;
			this.elem = getAnchorElement(elem);
			this.elem.data(pluginClassName, this);
			this.elem.before(this.wrapper);
		}
		this.container.hide();
		this.run(data);
	}

	Notification.prototype.loadHTML = function() {
		var style;
		style = this.getStyle();
		this.userContainer = $(style.html);
		this.userFields = style.fields;
	};

	Notification.prototype.show = function(show, userCallback) {
		var args, callback, elems, fn, hidden;
		callback = (function(_this) {
			return function() {
				if (!show && !_this.elem) {
					_this.destroy();
				}
				if (userCallback) {
					return userCallback();
				}
			};
		})(this);
		hidden = this.container.parent().parents(':hidden').length > 0;
		elems = this.container.add(this.arrow);
		args = [];
		if (hidden && show) {
			fn = "show";
		} else if (hidden && !show) {
			fn = "hide";
		} else if (!hidden && show) {
			fn = this.options.showAnimation;
			args.push(this.options.showDuration);
		} else if (!hidden && !show) {
			fn = this.options.hideAnimation;
			args.push(this.options.hideDuration);
		} else {
			return callback();
		}
		args.push(callback);
		return elems[fn].apply(elems, args);
	};

	Notification.prototype.setGlobalPosition = function() {
		var p = this.getPosition();
		var pMain = p[0];
		var pAlign = p[1];
		var main = positions[pMain];
		var align = positions[pAlign];
		var key = pMain + "|" + pAlign;
		var anchor = globalAnchors[key];
		if (!anchor || !document.body.contains(anchor[0])) {
			anchor = globalAnchors[key] = createElem("div");
			var css = {};
			css[main] = 0;
			if (align === "middle") {
				css.top = '45%';
			} else if (align === "center") {
				css.left = '45%';
			} else {
				css[align] = 0;
			}
			anchor.css(css).addClass(pluginClassName + "-corner");
			$("body").append(anchor);
		}
		return anchor.prepend(this.wrapper);
	};

	Notification.prototype.setElementPosition = function() {
		var arrowColor, arrowCss, arrowSize, color, contH, contW, css, elemH, elemIH, elemIW, elemPos, elemW, gap, j, k, len, len1, mainFull, margin, opp, oppFull, pAlign, pArrow, pMain, pos, posFull, position, ref, wrapPos;
		position = this.getPosition();
		pMain = position[0];
		pAlign = position[1];
		pArrow = position[2];
		elemPos = this.elem.position();
		elemH = this.elem.outerHeight();
		elemW = this.elem.outerWidth();
		elemIH = this.elem.innerHeight();
		elemIW = this.elem.innerWidth();
		wrapPos = this.wrapper.position();
		contH = this.container.height();
		contW = this.container.width();
		mainFull = positions[pMain];
		opp = opposites[pMain];
		oppFull = positions[opp];
		css = {};
		css[oppFull] = pMain === "b" ? elemH : pMain === "r" ? elemW : 0;
		incr(css, "top", elemPos.top - wrapPos.top);
		incr(css, "left", elemPos.left - wrapPos.left);
		ref = ["top", "left"];
		for (j = 0, len = ref.length; j < len; j++) {
			pos = ref[j];
			margin = parseInt(this.elem.css("margin-" + pos), 10);
			if (margin) {
				incr(css, pos, margin);
			}
		}
		gap = Math.max(0, this.options.gap - (this.options.arrowShow ? arrowSize : 0));
		incr(css, oppFull, gap);
		if (!this.options.arrowShow) {
			this.arrow.hide();
		} else {
			arrowSize = this.options.arrowSize;
			arrowCss = $.extend({}, css);
			arrowColor = this.userContainer.css("border-color") || this.userContainer.css("border-top-color") || this.userContainer.css("background-color") || "white";
			for (k = 0, len1 = mainPositions.length; k < len1; k++) {
				pos = mainPositions[k];
				posFull = positions[pos];
				if (pos === opp) {
					continue;
				}
				color = posFull === mainFull ? arrowColor : "transparent";
				arrowCss["border-" + posFull] = arrowSize + "px solid " + color;
			}
			incr(css, positions[opp], arrowSize);
			if (indexOf.call(mainPositions, pAlign) >= 0) {
				incr(arrowCss, positions[pAlign], arrowSize * 2);
			}
		}
		if (indexOf.call(vAligns, pMain) >= 0) {
			incr(css, "left", realign(pAlign, contW, elemW));
			if (arrowCss) {
				incr(arrowCss, "left", realign(pAlign, arrowSize, elemIW));
			}
		} else if (indexOf.call(hAligns, pMain) >= 0) {
			incr(css, "top", realign(pAlign, contH, elemH));
			if (arrowCss) {
				incr(arrowCss, "top", realign(pAlign, arrowSize, elemIH));
			}
		}
		if (this.container.is(":visible")) {
			css.display = "block";
		}
		this.container.removeAttr("style").css(css);
		if (arrowCss) {
			return this.arrow.removeAttr("style").css(arrowCss);
		}
	};

	Notification.prototype.getPosition = function() {
		var pos, ref, ref1, ref2, ref3, ref4, ref5, text;
		text = this.options.position || (this.elem ? this.options.elementPosition : this.options.globalPosition);
		pos = parsePosition(text);
		if (pos.length === 0) {
			pos[0] = "b";
		}
		if (ref = pos[0], indexOf.call(mainPositions, ref) < 0) {
			throw "Must be one of [" + mainPositions + "]";
		}
		if (pos.length === 1 || ((ref1 = pos[0], indexOf.call(vAligns, ref1) >= 0) && (ref2 = pos[1], indexOf.call(hAligns, ref2) < 0)) || ((ref3 = pos[0], indexOf.call(hAligns, ref3) >= 0) && (ref4 = pos[1], indexOf.call(vAligns, ref4) < 0))) {
			pos[1] = (ref5 = pos[0], indexOf.call(hAligns, ref5) >= 0) ? "m" : "l";
		}
		if (pos.length === 2) {
			pos[2] = pos[1];
		}
		return pos;
	};

	Notification.prototype.getStyle = function(name) {
		var style;
		if (!name) {
			name = this.options.style;
		}
		if (!name) {
			name = "default";
		}
		style = styles[name];
		if (!style) {
			throw "Missing style: " + name;
		}
		return style;
	};

	Notification.prototype.updateClasses = function() {
		var classes, style;
		classes = ["base"];
		if ($.isArray(this.options.className)) {
			classes = classes.concat(this.options.className);
		} else if (this.options.className) {
			classes.push(this.options.className);
		}
		style = this.getStyle();
		classes = $.map(classes, function(n) {
			return pluginClassName + "-" + style.name + "-" + n;
		}).join(" ");
		return this.userContainer.attr("class", classes);
	};

	Notification.prototype.run = function(data, options) {
		var d, datas, name, type, value;
		if ($.isPlainObject(options)) {
			$.extend(this.options, options);
		} else if ($.type(options) === "string") {
			this.options.className = options;
		}
		if (this.container && !data) {
			this.show(false);
			return;
		} else if (!this.container && !data) {
			return;
		}
		datas = {};
		if ($.isPlainObject(data)) {
			datas = data;
		} else {
			datas[blankFieldName] = data;
		}
		for (name in datas) {
			d = datas[name];
			type = this.userFields[name];
			if (!type) {
				continue;
			}
			if (type === "text") {
				d = encode(d);
				if (this.options.breakNewLines) {
					d = d.replace(/\n/g, '<br/>');
				}
			}
			value = name === blankFieldName ? '' : '=' + name;
			find(this.userContainer, "[data-notify-" + type + value + "]").html(d);
		}
		this.updateClasses();
		if (this.elem) {
			this.setElementPosition();
		} else {
			this.setGlobalPosition();
		}
		this.show(true);
		if (this.options.autoHide) {
			clearTimeout(this.autohideTimer);
			this.autohideTimer = setTimeout(this.show.bind(this, false), this.options.autoHideDelay);
		}
	};

	Notification.prototype.destroy = function() {
		this.wrapper.data(pluginClassName, null);
		this.wrapper.remove();
	};

	$[pluginName] = function(elem, data, options) {
		if ((elem && elem.nodeName) || elem.jquery) {
			$(elem)[pluginName](data, options);
		} else {
			options = data;
			data = elem;
			new Notification(null, data, options);
		}
		return elem;
	};

	$.fn[pluginName] = function(data, options) {
		$(this).each(function() {
			var prev = getAnchorElement($(this)).data(pluginClassName);
			if (prev) {
				prev.destroy();
			}
			var curr = new Notification($(this), data, options);
		});
		return this;
	};

	$.extend($[pluginName], {
		defaults: defaults,
		addStyle: addStyle,
		removeStyle: removeStyle,
		pluginOptions: pluginOptions,
		getStyle: getStyle,
		insertCSS: insertCSS
	});

	//always include the default bootstrap style
	addStyle("bootstrap", {
		html: "<div>\n<span data-notify-text></span>\n</div>",
		classes: {
			base: {
				"font-weight": "bold",
				"padding": "8px 15px 8px 14px",
				"text-shadow": "0 1px 0 rgba(255, 255, 255, 0.5)",
				"background-color": "#fcf8e3",
				"border": "1px solid #fbeed5",
				"border-radius": "4px",
				"white-space": "nowrap",
				"padding-left": "25px",
				"background-repeat": "no-repeat",
				"background-position": "3px 7px"
			},
			error: {
				"color": "#B94A48",
				"background-color": "#F2DEDE",
				"border-color": "#EED3D7",
				"background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=)"
			},
			success: {
				"color": "#468847",
				"background-color": "#DFF0D8",
				"border-color": "#D6E9C6",
				"background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==)"
			},
			info: {
				"color": "#3A87AD",
				"background-color": "#D9EDF7",
				"border-color": "#BCE8F1",
				"background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYFAhkSsdes/QAAA8dJREFUOMvVlGtMW2UYx//POaWHXg6lLaW0ypAtw1UCgbniNOLcVOLmAjHZolOYlxmTGXVZdAnRfXQm+7SoU4mXaOaiZsEpC9FkiQs6Z6bdCnNYruM6KNBw6YWewzl9z+sHImEWv+vz7XmT95f/+3/+7wP814v+efDOV3/SoX3lHAA+6ODeUFfMfjOWMADgdk+eEKz0pF7aQdMAcOKLLjrcVMVX3xdWN29/GhYP7SvnP0cWfS8caSkfHZsPE9Fgnt02JNutQ0QYHB2dDz9/pKX8QjjuO9xUxd/66HdxTeCHZ3rojQObGQBcuNjfplkD3b19Y/6MrimSaKgSMmpGU5WevmE/swa6Oy73tQHA0Rdr2Mmv/6A1n9w9suQ7097Z9lM4FlTgTDrzZTu4StXVfpiI48rVcUDM5cmEksrFnHxfpTtU/3BFQzCQF/2bYVoNbH7zmItbSoMj40JSzmMyX5qDvriA7QdrIIpA+3cdsMpu0nXI8cV0MtKXCPZev+gCEM1S2NHPvWfP/hL+7FSr3+0p5RBEyhEN5JCKYr8XnASMT0xBNyzQGQeI8fjsGD39RMPk7se2bd5ZtTyoFYXftF6y37gx7NeUtJJOTFlAHDZLDuILU3j3+H5oOrD3yWbIztugaAzgnBKJuBLpGfQrS8wO4FZgV+c1IxaLgWVU0tMLEETCos4xMzEIv9cJXQcyagIwigDGwJgOAtHAwAhisQUjy0ORGERiELgG4iakkzo4MYAxcM5hAMi1WWG1yYCJIcMUaBkVRLdGeSU2995TLWzcUAzONJ7J6FBVBYIggMzmFbvdBV44Corg8vjhzC+EJEl8U1kJtgYrhCzgc/vvTwXKSib1paRFVRVORDAJAsw5FuTaJEhWM2SHB3mOAlhkNxwuLzeJsGwqWzf5TFNdKgtY5qHp6ZFf67Y/sAVadCaVY5YACDDb3Oi4NIjLnWMw2QthCBIsVhsUTU9tvXsjeq9+X1d75/KEs4LNOfcdf/+HthMnvwxOD0wmHaXr7ZItn2wuH2SnBzbZAbPJwpPx+VQuzcm7dgRCB57a1uBzUDRL4bfnI0RE0eaXd9W89mpjqHZnUI5Hh2l2dkZZUhOqpi2qSmpOmZ64Tuu9qlz/SEXo6MEHa3wOip46F1n7633eekV8ds8Wxjn37Wl63VVa+ej5oeEZ/82ZBETJjpJ1Rbij2D3Z/1trXUvLsblCK0XfOx0SX2kMsn9dX+d+7Kf6h8o4AIykuffjT8L20LU+w4AZd5VvEPY+XpWqLV327HR7DzXuDnD8r+ovkBehJ8i+y8YAAAAASUVORK5CYII=)"
			},
			warn: {
				"color": "#C09853",
				"background-color": "#FCF8E3",
				"border-color": "#FBEED5",
				"background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABJlBMVEXr6eb/2oD/wi7/xjr/0mP/ykf/tQD/vBj/3o7/uQ//vyL/twebhgD/4pzX1K3z8e349vK6tHCilCWbiQymn0jGworr6dXQza3HxcKkn1vWvV/5uRfk4dXZ1bD18+/52YebiAmyr5S9mhCzrWq5t6ufjRH54aLs0oS+qD751XqPhAybhwXsujG3sm+Zk0PTwG6Shg+PhhObhwOPgQL4zV2nlyrf27uLfgCPhRHu7OmLgAafkyiWkD3l49ibiAfTs0C+lgCniwD4sgDJxqOilzDWowWFfAH08uebig6qpFHBvH/aw26FfQTQzsvy8OyEfz20r3jAvaKbhgG9q0nc2LbZxXanoUu/u5WSggCtp1anpJKdmFz/zlX/1nGJiYmuq5Dx7+sAAADoPUZSAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfdBgUBGhh4aah5AAAAlklEQVQY02NgoBIIE8EUcwn1FkIXM1Tj5dDUQhPU502Mi7XXQxGz5uVIjGOJUUUW81HnYEyMi2HVcUOICQZzMMYmxrEyMylJwgUt5BljWRLjmJm4pI1hYp5SQLGYxDgmLnZOVxuooClIDKgXKMbN5ggV1ACLJcaBxNgcoiGCBiZwdWxOETBDrTyEFey0jYJ4eHjMGWgEAIpRFRCUt08qAAAAAElFTkSuQmCC)"
			}
		}
	});

	$(function() {
		insertCSS(coreStyle.css).attr("id", "core-notify");
		$(document).on("click", "." + pluginClassName + "-hidable", function(e) {
			$(this).trigger("notify-hide");
		});
		$(document).on("notify-hide", "." + pluginClassName + "-wrapper", function(e) {
			var elem = $(this).data(pluginClassName);
			if(elem) {
				elem.show(false);
			}
		});
	});

}));

/*--- End of coreNotify.js ---*/


/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
  selectorTxt,    /* Required: The jQuery selector string that
                      specifies the desired element(s).
                  */
  actionFunction, /* Required: The code to run when elements are
                      found. It is passed a jNode to the matched
                      element.
                  */
  bWaitOnce,      /* Optional: If false, will continue to scan for
                      new elements even after the first match is
                      found.
                  */
  iframeSelector  /* Optional: If set, identifies the iframe to
                      search.
                  */
) {
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined")
      targetNodes     = $(selectorTxt);
  else
      targetNodes     = $(iframeSelector).contents ()
                                         .find (selectorTxt);

  if (targetNodes  &&  targetNodes.length > 0) {
      btargetsFound   = true;
      /*--- Found target node(s).  Go through each and act if they
          are new.
      */
      targetNodes.each ( function () {
          var jThis        = $(this);
          var alreadyFound = jThis.data ('alreadyFound')  ||  false;

          if (!alreadyFound) {
              //--- Call the payload function.
              var cancelFound     = actionFunction (jThis);
              if (cancelFound)
                  btargetsFound   = false;
              else
                  jThis.data ('alreadyFound', true);
          }
      } );
  }
  else {
      btargetsFound   = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj      = waitForKeyElements.controlObj  ||  {};
  var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
  var timeControl     = controlObj [controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval (timeControl);
      delete controlObj [controlKey]
  }
  else {
      //--- Set a timer, if needed.
      if ( ! timeControl) {
          timeControl = setInterval ( function () {
                  waitForKeyElements (    selectorTxt,
                                          actionFunction,
                                          bWaitOnce,
                                          iframeSelector
                                      );
              },
              300
          );
          controlObj [controlKey] = timeControl;
      }
  }
  waitForKeyElements.controlObj   = controlObj;
}

//--- End of waitForKeyElements() function.


const _ = window._

const getSQLValue = () => {
  const codeMirror = document.
    querySelector(".CodeMirror").CodeMirror

  if (codeMirror !== undefined) {
    return codeMirror.getValue()
  }
  return ""
}

const detectSqlType =(sql) =>{
  const cleanedSql = sql.replace(
    /--.*$/gm, '').
    replace(/\n/g, ' ').
    replace(/\/\*[\s\S]*?\*\//g, '').toLowerCase();

  const keywords = [
    {
      type: 'droptable',
      fn: (t) => {
        return /drop\s+table\s+if\s+exists\s+/i.test(t) || /drop\s+table\s+/i.test(t)
      }
    },
    {
      type: 'dropdatabase',
      fn: (t) => {
        return /drop\s+database\s+if\s+exists\s+/i.test(t) || /drop\s+database\s+/i.test(t)
      }
    },
    {
      type: 'createtable',
      fn: (t) => {
        return /create\s+table\s+if\s+not\s+exists\s+/i.test(t) || /create\s+table\s+/i.test(t)
      }
    },
    {
      type: 'createdatabase',
      fn: (t) => {
        return /create\s+database\s+if\s+not\s+exists\s+/i.test(t) || /create\s+database\s+/i.test(t)
      }
    },
    {

      type: 'dml',
      fn: (t) => {
        return ["insert", "update", "delete", "select", "merge"].map(
          k => t.includes(k)).includes(true)
      }
    },
    {
      type: 'ddl',
      fn: (t) => {
        return ["create", "alter", "drop", "truncate", "rename"].map(
          k => t.includes(k)).includes(true)
      }
    },
  ];
  
  for (let {type, fn} of keywords) {
    if (fn(cleanedSql)) {
      return type;
    }
  }

  return 'init';
}


const splitSQL = (sql) => {
  var result = {
    ddl: [],
    dml: [],
    createtable: [],
    createdatabase: [],
    dropdatabase: [],
    droptable:[],
    init: [],
  }

  var temp = "";
  var _1qOpen = false;
  var _2qOpen = false;

  for (let i = 0; i < sql.length; i++) {
    // check ' ", ignore \'
    if (sql[i] === "'") {
      _1qOpen =!_1qOpen;
    }

    if (sql[i] === '"') {
      _2qOpen =!_2qOpen;
    }

    if (_1qOpen || _2qOpen) {
      temp += sql[i];
      continue;
    }

    if (sql[i] === ";") {
      var scanLines = temp.split("\n");
      var newLines= [];

      for (let j = 0; j < scanLines.length; j++) {
        // clean \n and \n\r
        if (scanLines[j].replace(/(\r\n|\n|\r)/gm, "").trim() === "") {
          continue;
        }
        // clean /* */ and --
        if (scanLines[j].replace(/(\/\*[\s\S]*?\*\/)|(--.*$)/gm, "").trim() === "") {
          continue;
        }

        newLines.push(scanLines[j].trim());
      }
      temp = newLines.join("\n");
 
      if (temp.trim() !== "") {
        result[detectSqlType(temp)].push(temp + ";");
        temp = "";
      }
    } else {
      temp += sql[i];
    }
  }
  
  return {
    ddl: result.ddl.join("\n"),
    dml: result.dml.join("\n"),
    createtable: result.createtable.join("\n"),
    createdatabase: result.createdatabase.join("\n"),
    droptable: result.droptable.join("\n"),
    init: result.init.join("\n"),
  }
}

const showMenu = () => {
  const all = [
  "personal-workbench",
  "workbench-approve",
  "work-order-system",
  "database-system",
  "database-system_selfServiceData",
  "database-system_dataAudit",
  "database-system_desensitizationRules",
  "basic-information-manage",
  "basic-information-manage_operationalAudit",
  "authority-manage",
  "authority-manage_list",
  "authority-manage_memberManage",
  "authority-manage_resourceManage",
  "authority-manage_batch-operation",
  "process-detail"];
  const store = useStore();
  const userInfo = store.state.user.user_info;
  userInfo.menu.push(...all);
}

const getMySQLInstanceList = async () => {
	const res = await rGet("/gw/v1/dataquery/instances", {source_type:4})
	if (res.code === 0) {
		return res.result.map(item => item.name)
	}
	return []
}

const renderAntdList = (title, list, onClick) => {
		const antListElement = document.createElement("div");
		// margin-left:10px
		antListElement.style.marginLeft = "10px";


		antListElement.classList.add(
			"ant-list", "ant-list-split", "ant-list-bordered", "ant-list-something-after-last-item", "css-1hsjdkk");
		


		const antListHeader = document.createElement("div");
		antListHeader.classList.add("ant-list-header");
		antListHeader.textContent = title;


		const antListBody = document.createElement("div");
		antListBody.classList.add("ant-spin-nested-loading", "css-1hsjdkk");


		const antListContainer = document.createElement("div");
		antListContainer.classList.add("ant-spin-container");


		const antListItems = document.createElement("ul");
		antListItems.classList.add("ant-list-items");

		for (let i = 0; i < list.length; i++) {
			const li = document.createElement("li");
			li.classList.add("ant-list-item");

			const span = document.createElement("span");
			span.textContent = list[i];

			li.appendChild(span);
			li.addEventListener("click", () => {
				onClick(list[i]);
			})
			antListItems.appendChild(li);
		}

		antListBody.appendChild(antListItems);
		antListContainer.appendChild(antListBody);
		antListElement.appendChild(antListHeader);
		antListElement.appendChild(antListContainer);
		return antListElement;
}

const renderMySQLDatabaseSelect = async (databases, rootElement) => {
	console.log(rootElement)
	console.log(rootElement.children.length)

	if (rootElement.children.length > 2) {
		// remove last one(list element)
		rootElement.removeChild(rootElement.lastChild);
	};

	// render database select
	const listElement = renderAntdList(
		"数据库名", databases, async (dbName) => {

		const inputElement = rootElement.
				childNodes[1].firstChild;

		inputElement.dispatchEvent(new Event('focus'));
		inputElement.value = dbName;
		const inputEvent = new Event('input', { bubbles: true });
		inputElement.dispatchEvent(inputEvent);
		inputElement.dispatchEvent(new Event('blur'));
		});
	rootElement.appendChild(listElement);
}

const renderMySQLInstanceSelect = async () => {
	const formElement = document.querySelector(
		".basic-information-label");
	if (formElement==null) {
		console.log("formElement is null");
		return;
	}

	// formitem: 数据库实例地址
	const instanceElement = formElement.childNodes[3];

	// formitem: 数据库名
	const databaseElement = formElement.childNodes[4];

	// instance list
	const instanceList = await getMySQLInstanceList();

	const listElement = renderAntdList(
		"数据库实例", instanceList, async (instanceName) => {
		
		// first child
		const inputElement = instanceElement.
				childNodes[1].firstChild;

    // focus
    inputElement.dispatchEvent(new Event('focus'));
		inputElement.value = instanceName;
		
		const inputEvent = new Event('input', { bubbles: true });
		inputElement.dispatchEvent(inputEvent);
		inputElement.dispatchEvent(new Event('blur'));

		const databases = await getMySQLDatabaseList(instanceName);

		// render database select
		await renderMySQLDatabaseSelect(databases, databaseElement);
	})

	instanceElement.appendChild(listElement);
	//
}

const getMySQLDatabaseList = async (instance_name) => {
	const res =await rGet("/gw/v1/dataquery/databases", {domain: instance_name,source_type:4})
	if (res.code === 0) {
		return res.result.map(item => item.name)
	}
	return []
}

const requestHeaders = () => {
  // get cookie: Admin-Token
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)Admin-Token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  return {
    "Content-Type": "application/json",
    "authorization": token,
  }
}

const requestUrl = (sub) => {
  // get current host
  if (sub.startsWith("/")) {
    return  window.location.origin + sub;
  }
  return  window.location.origin + "/" + sub;
}

const rPost = (suburl, data) => {
  // use $.ajax
  const headers = requestHeaders();
  const url = requestUrl(suburl);
  return $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(data),
    headers: headers,
  })
}

const rGet = (suburl, params) => {
  // use $.ajax
  const headers = requestHeaders();
  const url = requestUrl(suburl);
  return $.ajax({
    url: url,
    type: "GET",
    data: params,
    headers: headers,
  })
}

const getRdsInfo = (instance) => {
  return rGet("/gw/v1/sql/order/get_rds", {instance_name: instance, db_type:0})
}

const fastPostButton = (onclick) => {
  var btn = document.createElement('button');
  // add class: ant-btn ant-btn-primary ant-btn-background-ghost

  btn.classList.add(
    "ant-btn", "ant-btn-primary", "ant-btn-dangerous");
  
  btn.textContent = "暴力提交SQL工单[Beta]";
  btn.onclick = onclick
  return btn;
}

const getFormElementItem = (key) => {
	const rootElement = document.querySelector(".container-body-left");
	// find all input and textarea
	const pElements = rootElement.querySelectorAll("p");
	for (let i = 0; i < pElements.length; i++) {
		const pe = pElements[i];
		const keyElementText = pe.firstChild.textContent.trim();
		if (keyElementText === key) {
			return pe;
		}
	}
	return null;
}

const getFormElementsData = (keys = ["数据库名", "数据库实例地址"]) => {
  const rootElement = document.querySelector(".container-body-left");
  // find all input and textarea
  const pElements = rootElement.querySelectorAll("p");
  const formData = {};


  for (let i = 0; i < pElements.length; i++) {
    const pe = pElements[i];
    

    const keyElementText = pe.firstChild.textContent.trim();
    
    let isMatch = false;
    let key = "";

    for (let j = 0; j < keys.length; j++) {
      if (keyElementText.includes(keys[j])) {
        isMatch = true;
        key = keys[j];
        break;
      }
    }

    if (!isMatch) {
      continue;
    }

    // pe second child son
    var valueElement = pe.children[1];

    //
    if (valueElement !== undefined) {
      valueElement = valueElement.firstChild;
    }

    //
    const value = valueElement.value.trim();
    formData[key] = value;
  }

  return formData;
}

const useStore = () => {
  return window.
  __VUE_DEVTOOLS_PLUGINS__[0].
  pluginDescriptor.
  app.
  config.
  globalProperties.
  $store;
}

const newPostData = (
  username,
  nickname, 
  dept_id,
  comment, 
  env_name, 
  db_bussiness_owner,
  idc_name,
  sql_type,
  content,
  instance_addr,
  rds_connection_str,
  db_name,
  bussiness_name) => {

  comment = comment+`[${sql_type}]`

  const name = `SQL工单申请-${nickname}-(说明：${comment})`

  return {
    //
    id:"",
    store_type: 0,
    file_path:"",
    file_size:0,
    db_type:0,
    db_num:0,
    order_type:"sql",
    status:5,

    current_node:"",
    exec_type:0,
    create_at:"",
    update_at:"",
    reject_comment:"",
    exec_time:"",
    hummingbird_version:0,
    sleep:0,
    sleep_rows:0,
    pre_procinst_id:0,
    rollback_id:"",
    backup_status:2,
    ident:"end",
    rollback_type:"normal",
    target_id:"",

    create_user_aliasname: nickname,
    create_username: username,

    name,
    comment,
    env_name,
    db_bussiness_owner,
    
    idc_name,
    sql_type,
    
    instance_addr,
    db_name,
    bussiness_name,

    content,
    rds_connection_str,
  
    dept_id,
  }
}

(function () {
  'use strict';
  waitForKeyElements(".footerButton", () => {
    const footerDiv = document.querySelector(".footerButton");
    if (footerDiv==null){
      return;
    }

    // first child
    const firstChild = footerDiv.firstChild;

    $.notify("正在加载快捷提交SQL工单插件...", "success", {
      position: "bottom right",
      autoHideDelay: 1 * 1000,
    });

    if (window.__VUE_DEVTOOLS_PLUGINS__[0] === undefined) {
      $.notify("请关闭Vue Devtools插件，以便使用快捷提交SQL工单功能。", "error", {
        position: "bottom right",
        autoHideDelay: 1 * 1000,
      });
      return;
    }

    // show all menu
    showMenu();

		// render mysql instance select
		renderMySQLInstanceSelect();
    
    // store
    const store = useStore();

    // user Object
    const user = store.state.user.user_info;


    firstChild.appendChild(
      fastPostButton(
       async () => {
          const sql = getSQLValue();

          if (sql.trim() === "") {
            $.notify("无法获取SQL语句，请检查SQL编辑器是否有内容。", "error", {
              position: "bottom right",
              autoHideDelay: 1 * 1000,
            });
          }

          const splitedSqlMap = splitSQL(sql);

          const formData = getFormElementsData(["数据库实例", "数据库名", "说明"]);

          const rdsInfo = await getRdsInfo(formData["数据库实例"]);
          if (rdsInfo.code!== 0) {
            $.notify(
              `获取数据库实例信息失败，请检查数据库实例名称是否正确。${rdsInfo.message}`, "error", {
              position: "bottom right",
              autoHideDelay: 1 * 1000,
            });
            return;
          }

          const instanInfo = rdsInfo.result;
          const localCache = localStorage.getItem("orderHistory");
          const localCacheObj = localCache ? JSON.parse(localCache) : {};

          for (let sql_type in splitedSqlMap) {
            const content = splitedSqlMap[sql_type];

            if (content.trim() === "") {
              continue;
            }

            const postData = newPostData(
              user.username,
              user.alias_name,
              user.department_id,
              formData["说明"],
              instanInfo.env,
              instanInfo.db_bussiness_owner,
              instanInfo.account,
              sql_type,
              content,
              formData["数据库实例"],
              instanInfo.rds_connection_str,
              formData["数据库名"],
              instanInfo.business,
            );

            if (localCacheObj[postData.comment]) {
              $.notify(
                `工单${postData.comment}已存在，请勿重复提交。`, "error", {
                position: "bottom right",
                autoHideDelay: 1 * 1000,
              });
              continue;
            }

            const orderResult = await rPost("/gw/v1/sql/order", postData);
            if (orderResult.code === 0) {
              $.notify(
                `提交${sql_type}工单成功，工单编号：${orderResult.result.id}`, "success", {
                position: "bottom right",
                clickToHide: true,
                autoHideDelay: 1 * 1000});

              // save local storage
              localCacheObj[postData.comment] = true;
            }
          } //

          // save local storage
          localStorage.setItem(
            "orderHistory", JSON.stringify(localCacheObj));
        } // onclick
      ) 
    );
    
  })

})();
