// ==UserScript==
// @name        Pop-Up Block (Weaboo)
// @namespace   http://tampermonkey.net/
// @description Simple popup window blocker
// @include     *
// @version     4.1.1
// @author      weaboo
// @license     aanriski™ - ©weaboo
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/525162/Pop-Up%20Block%20%28Weaboo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525162/Pop-Up%20Block%20%28Weaboo%29.meta.js
// ==/UserScript==

! function() {
	var t, e = 2,
		o = 4,
		n = 8,
		s = 16,
		i = 32,
		r = 0,
		a = {
			a: !0,
			button: {
				type: "submit"
			},
			input: !0,
			select: !0,
			option: !0
		},
		l = 0,
		p = window.open,
		c = window.showModalDialog,
		d = null,
		m = 0;

	function y(t, arguments) {
		return !!(r & e) && function(t, e) {
			return confirm(t + " (" + Array.prototype.slice.apply(arguments).join(", ") + ")")
		}(t, arguments)
	}

	function u() {
		return !(r & o) || Date.now() > l + 100
	}

	function x() {
		return !!(r & n) && "https:" == location.protocol
	}

	function w(t) {
		var e = t.tagName && a[t.tagName.toLowerCase()];
		if (e && "object" == typeof e)
			for (var o in e)
				if (t[o] != t[o]) return !1;
		return e
	}

	function T(e) {
		var o = e.target;
		if (!(e instanceof MouseEvent && (null != e.button ? 0 != e.button : 1 != e.which))) {
			for (; o.parentElement && !w(o);) o = o.parentElement;
			t = o
		}
	}

	function f(t) {
		return String(t).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
	}
	window.addEventListener("mousedown", (function(t) {
		l = Date.now(), T(t)
	}), !0), window.addEventListener("click", (function(t) {
		l = Date.now(), T(t)
	}), !0), window.addEventListener("change", (function(t) {
		l = Date.now(), T(t)
	}), !0);
	var g = new RegExp("^((" + f(location.protocol) + "//" + f(location.host) + ")?(" + f(location.pathname) + ")?)?");

	function h(t) {
		var e = t.replace(g, ""),
			o = (e = e.replace(/#.*$/, "")).match(/\?[^?]+/);
		return o && (o = "?" + o[0].substr(1).split("&").sort().join("&")), e = e.replace(/\?[^?]+/, o || "")
	}
	r & s || "function" != typeof window.location.watch || window.location.watch("href", (function(e, o, n) {
		var s, i = h(n);
		console.info("location." + e, "->", n), t && t.tagName && "a" == t.tagName.toLowerCase() && (s = h(t.href));
		var r = null != s && 0 !== n.indexOf("#") && i != s;
		return x() && !u() || t && w(t) && !r && "_blank" != t.target ? n : (v("Denied redirection to", n, null, 0, null, "_self"), console.error("Pop-Up Blocker denied redirection to " + n), "#" + location.hash.replace(/^#/, ""))
	}));
	var b = window.onbeforeunload;

	function v(t, e, o, n, s, i) {
		var r = document.body.parentElement,
			a = document.createElement("div");
		a.onclick = function() {
			return !1
		}, null === d && (d = parseFloat((r.currentStyle || window.getComputedStyle(r)).marginTop)), k(a), a.style.cssText += "background: InfoBackground !important", a.style.cssText += "border-bottom: 1px solid WindowFrame !important", a.style.cssText += "box-sizing: border-box !important", a.style.cssText += "font: small-caption !important", a.style.cssText += "padding: .5em 1em !important", a.style.cssText += "position: fixed !important", a.style.cssText += "left: 0 !important", a.style.cssText += "right: 0 !important", a.style.cssText += "top: -100% !important", a.style.cssText += "transition: top .25s !important", a.style.cssText += "display: flex !important", a.style.cssText += "align-items: center !important", a.style.cssText += "justify-content: space-between !important", a.style.cssText += "white-space: nowrap !important", a.style.cssText += "z-index: 2147483647 !important", a.style.cssText += "border-radius: 8px !important";
		var l = document.createElement("span");

		function p(t) {
			return t && t.stopPropagation(), --m || (r.style.cssText += "margin-top: " + d + " !important"), a.style.cssText += "top: -" + a.offsetHeight + "px !important", setTimeout((function() {
				document.body.removeChild(a)
			}), 250), !1
		}
		k(l), l.style.cssText += "cursor: pointer !important", l.style.cssText += "display: inline-block !important", l.style.cssText += "font: inherit !important", l.style.cssText += "margin-left: .75em !important", l.style.cssText += "line-height: 2.1 !important", l.appendChild(document.createTextNode("╳")), l.onclick = p, a.appendChild(l), a.appendChild(document.createTextNode(" ⛔ " + t));
		for (var c = "_self" == i ? 1 : 2, y = 0; y < c; y++) {
			var u = document.createElement(y ? "button" : "a");
			k(u), y ? (u.style.cssText += "-moz-appearance: button !important", u.style.cssText += "-webkit-appearance: button !important", u.style.cssText += "appearance: button !important", u.style.cssText += "background: ButtonFace !important", u.style.cssText += "border: 1px solid ButtonShadow !important", u.style.cssText += "color: ButtonText !important", u.style.cssText += "font: small-caption !important", u.style.cssText += "padding: .25em .75em !important", u.style.cssText += "display: inline-block !important", u.style.cssText += "vertical-align: middle !important", u.style.cssText += "position: relative !important", u.style.cssText += "margin-left: .5em !important", u.style.cssText += "flex-shrink: 0 !important", u.style.cssText += "min-width: 70px !important", u.style.cssText += "text-align: center !important") : (u.style.cssText += "color: #00e !important", u.style.cssText += "text-decoration: underline !important", u.style.cssText += "display: inline-block !important", u.style.cssText += "max-width: 50% !important", u.style.cssText += "overflow: hidden !important", u.style.cssText += "text-overflow: ellipsis !important", u.style.cssText += "white-space: nowrap !important", u.setAttribute("href", e), u.setAttribute("target", i || "_blank")), o && u.setAttribute("title", o);
			var x = y ? "Open" : e;
			u.appendChild(document.createTextNode(x)), u.onclick = function(t) {
				if (t.stopPropagation(), p(), "a" != this.tagName.toLowerCase()) location.href = e;
				else if (s) return s(t), !1
			}, a.appendChild(document.createTextNode(" ")), a.appendChild(u)
		}
		m || (r.style.cssText += "transition: margin-top .25s !important"), document.body.appendChild(a), a.style.cssText += "top: -" + a.offsetHeight + "px !important", setTimeout((function() {
			a.style.cssText += "top: 0 !important", m || (r.style.cssText += "margin-top: " + (d + a.offsetHeight) + "px !important"), m++
		}), 0), n && setTimeout((function() {
			p()
		}), n)
	}

	function k(t) {
		"button" != t.tagName.toLowerCase() ? (t.style.cssText = "background: transparent !important", t.style.cssText += "border: none !important", t.style.cssText += "border-radius: 0 !important", "a" == t.tagName.toLowerCase() && (t.style.cssText += "cursor: pointer !important")) : t.style.cssText += "cursor: auto !important", t.style.cssText += "bottom: auto !important", t.style.cssText += "box-shadow: none !important", t.style.cssText += "color: WindowText !important", t.style.cssText += "font: medium serif !important", t.style.cssText += "letter-spacing: 0 !important", t.style.cssText += "line-height: normal !important", t.style.cssText += "margin: 0 !important", t.style.cssText += "opacity: 1 !important", t.style.cssText += "outline: none !important", t.style.cssText += "padding: 0 !important", t.style.cssText += "position: static !important", t.style.cssText += "text-align: left !important", t.style.cssText += "text-shadow: none !important", t.style.cssText += "text-transform: none !important", t.style.cssText += "left: auto !important", t.style.cssText += "right: auto !important", t.style.cssText += "top: auto !important", t.style.cssText += "white-space: normal !important", t.style.cssText += "width: auto !important"
	}
	r & i && (window.onbeforeunload = function(t) {
		return x() ? "function" == typeof b ? b.apply(window, arguments) : void 0 : (console.warn("You are possibly involuntarily being redirected to another page."), (t || window.event).returnValue = "You are possibly involuntarily being redirected to another page. Do you want to leave " + location.href + " or stay?", (t || window.event).returnValue)
	}), window.open = function() {
		var t = arguments;
		return !y("Allow popup?", arguments) || !x() && u() ? (console.error("Pop-Up Blocker blocked window.open", Array.prototype.slice.apply(arguments)), v("Pop-Up Blocked!", arguments[0], arguments[1], 0, (function() {
			console.info("Pop-Up Blocker user clicked window.open", Array.prototype.slice.apply(t)), p.apply(window, t)
		})), {}) : (console.info("Pop-Up Blocker allowed window.open", Array.prototype.slice.apply(arguments)), p.apply(window, arguments))
	}, window.showModalDialog = function() {
		return !y("Allow modal dialog?", arguments) || !x() && u() ? (console.error("Pop-Up Blocker blocked modal showModalDialog", Array.prototype.slice.apply(arguments)), v("Blocked modal dialog", arguments[0], null, 0, (function() {
			console.info("Pop-Up Blocker user clicked window.showModalDialog", Array.prototype.slice.apply(oargs)), c.apply(window, oargs)
		})), {}) : (console.info("Pop-Up Blocker allowed window.showModalDialog", Array.prototype.slice.apply(arguments)), c.apply(window, arguments))
	}
}();