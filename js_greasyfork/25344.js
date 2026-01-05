// ==UserScript==
// @name        Select Link RU
// @source      https://chrome.google.com/webstore/detail/select-like-a-boss/mnbiiidkialopoakajjpeghipbpljffi
// @namespace   https://addons.opera.com/ru/extensions/details/select-like-a-boss/?display=en
// @version     2014.9.15
// @date        15.09.2014
// @author      Dzianis Rusak (adaptation by kuchkan)
// @description Быстро и удобно выделяем часть ссылки, как в Opera Presto (based on "Select like a Boss")
// @homepage    http://kuchkan.zz.mu/select-link-ru/
// @include     *
// @exclude     about:*
// @exclude     chrome://*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEEklEQVRoge2ZTWxUVRTHf+e96ffQpJiW6bQJbIgGWIgfLFRS4kcagVoh0AVBWJgQdKGJMRpcaDcmggqadKNGjYZIUqVjiyboQoIbEzWGrlw0mLSUzhQEmn6RMvPucdFopjPvvd43My6M81/e/z3/c/7z3r3vnjtQRRVVVFHF/xlSSbFBNtc2MLPdw7tbkIRg2hR33iBph9zVWeovPsN4upI5K2JghHWPKu5R0G6Q5rC5CpcUb9DBG+jlz7lyc5dlIEX7/SDHHXgsf1zhsmDOKowLtIJsVegRxMmbc0PhxChTJ/shV2oNJRsYof2IgQFBavJKV9BXl8ic7AMvf/4gHffWYc6A3JM/ruiPhrn9e5m/VkodJRlIkXjXwXmpcFzRo0+T/iAo7jRrO+PU/yTQuTKOyRhe126m/4hai7P6lJVI0fGcX/Gg58OKBzjIzUmDvlg4LtCZJTY8CPGo9UQykCKxTdD3/DiDvmGjsZf0EMgvxYXoljqSn0SpZzku0mR3QKDWhxrdQ+ZnWx0P77MAav+XdO6IVpMlUrQ+CfqgH2fwzkVJWsfc2WAudzyKlrUBh9hrQZyBi1GS7mIho3DFj1OcbedIPmJflwWGiLcBDwfxHrd/s02Yl/hSEJfF7I6gszpcGp8A8d1yFZ3vY/ambcK8uMkgTnB32epYGTDEHg+hJ2yT5UMwgaYddMvn0GSjY2VAYH0Id8tGoxBKLPSpraEtYaNjZUCR1hB60UajEAKhBgyxyhlwMIEGDCzYaBRC0JkwPoZ3l41O5KNEIVzELSUuh4bG3aFm1kbH9hUKbEIMNNhoFCf26sP4OnLX7XQsIGgmmIt+AFuOc0N3mVu4gTnzYbmN6lgwq0kbjWJIRwg5dpirN2xULBcx34XQyf4S1pJX0BOshFyw1bE04FwAlgKSxR6gZZNtwn+i0M1BnMF8b6tjZaCHqUWFVBDv0Wh9+AL4lA31IFv9WZ0YJT1sq2X96HM4r4P6Nt8G022rA9DCYldAX4FgTvVHaPKtDexjcswgH/onlZ2DNK+11RLcw37jCpdnmP7IVgciLr45pl5Rn2OwQG0da5630fiW9vUge4oZzSnmwKGIX/ZIBg7Bggu9oNPFrDl2hsSG1TSycArw+YiZl6O0pX8j8vbXw9REFne7oL+vZKSxAef8FzStC4odIvm2FP36mgPv2V6m349aC5RxsXUamuMkPhacfQUFZcC8ZdBvRrk2vol4Sy2N9wk1x0C78mcadNyFI0+Rtt42C1H23ejXtD3k4LypODuKWVW/Tk7ReUHfWSJzog9ul5O/YrfTX9G5sYbsToh1g24EbQdpUrgDTC+vG/1V8UaucP2HFwI/jFX8t2D1Cg2T1H+7ED/0MlXRP2CqqKKKKiqPvwAMlDEaqPm3pQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/25344/Select%20Link%20RU.user.js
// @updateURL https://update.greasyfork.org/scripts/25344/Select%20Link%20RU.meta.js
// ==/UserScript==

window.SelectLink = window.SelectLink || (function() {
	var f = function(a) {
		if (a.nodeType === 3) a = a.parentNode;
		do {
			if (a.constructor === HTMLAnchorElement) return a
		} while ((a = a.parentNode) && a !== document.body);
		return null
	};
	var g = function(e) {
		return e.preventDefault(), e.stopPropagation(), false
	};
	var h = (function() {
		var w = typeof InstallTrigger === 'undefined';
		return {
			qq: function(x, y) {
				if (w) {
					return document.caretRangeFromPoint(x, y)
				} else {
					var a = document.createRange();
					var p = document.caretPositionFromPoint(x, y);
					a.setStart(p.offsetNode, p.offset);
					return a
				}
				return null
			},
			qr: ((w ? '-webkit-' : '-moz-') + 'user-select')
		}
	})();
	var j = (function() {
		var o = [{
			p: h.qr,
			v: 'text'
		}, {
			p: 'outline-width',
			v: 0
		}];
		var n;
		var s;
		return function(a) {
			if (a) {
				n = a, s = [];
				for (var i = o.length - 1; i >= 0; i -= 1) {
					s.push([n.style.getPropertyValue(o[i].p), n.style.getPropertyPriority(o[i].p)]);
					n.style.setProperty(o[i].p, o[i].v, 'important')
				}
			} else if (n) {
				for (var i = o.length; i-- > 0;) {
					n.style.removeProperty(o[i].p);
					if (s[i][0] !== null) n.style.setProperty(o[i].p, s[i][0], s[i][1])
				}
				n = s = null
			}
		}
	})();
	var k = function(a, b) {
		if (b === undefined) b = true;
		if (a.constructor !== Array) a = [a];
		var c = b ? 'addEventListener' : 'removeEventListener';
		for (var i = 0, len = a.length; i < len; i += 1) document[c](a[i], E[a[i]], true)
	};
	var l = function(a) {
		k(a, false)
	};
	var m, q, u, v, z, A = function() {
		q = v = true;
		u = z = false
	};
	var B, s = document.getSelection(),
		C = function(e) {
			if (e.which < 2) {
				A();
				var x = e.clientX,
					y = e.clientY;
				if (s.rangeCount > 0) {
					var a = s.getRangeAt(0);
					if (!a.collapsed) {
						var r = h.qq(x, y);
						if (r && a.isPointInRange(r.startContainer, r.startOffset)) return
					}
				}
				j();
				var t = e.target,
					n = f(t);
				if (!n) n = t.nodeType !== 3 ? t : t.parentNode;
				if (n.constructor === HTMLCanvasElement || n.textContent === '') return;
				var r = n.getBoundingClientRect();
				B = {
					n: n,
					x: Math.round(r.left),
					y: Math.round(r.top),
					c: 0
				};
				m = {
					x: x,
					y: y
				};
				k(['mousemove', 'mouseup', 'dragend', 'dragstart']);
				j(n)
			}
		};
	var D = 3,
		K = 0.8,
		E = {
			'mousemove': function(e) {
				if (B) {
					if (B.c++ < 12) {
						var r = B.n.getBoundingClientRect();
						if (Math.round(r.left) !== B.x || Math.round(r.top) !== B.y) {
							l(['mousemove', 'mouseup', 'dragend', 'dragstart', 'click']);
							j();
							s.removeAllRanges();
							return
						}
					} else {
						B = null
					}
				}
				var x = e.clientX,
					y = e.clientY;
				if (v) {
					s.removeAllRanges();
					var a = x > m.x ? -2 : 2;
					var b = h.qq(x + a, y);
					if (b) {
						s.addRange(b);
						v = false
					}
				}
				if (q) {
					var c = Math.abs(m.x - x),
						d = Math.abs(m.y - y);
					u = d === 0 || c / d > K;
					if (c > D || d > D) {
						q = false;
						z = true;
						k('click')
					}
				}
				if (u) {
					var b = h.qq(x, y);
					if (b) s.extend(b.startContainer, b.startOffset)
				}
			},
			'dragstart': function(e) {
				l('dragstart');
				if (u) return g(e)
			},
			'mouseup': function(e) {
				l(['mousemove', 'mouseup', 'dragstart', 'dragend']);
				if (!u && z) z = false;
				setTimeout(function() {
					l('click')
				}, 111)
			},
			'dragend': function(e) {
				l(['dragend', 'mousemove', 'mouseup'])
			},
			'click': function(e) {
				l('click');
				if (z) return g(e)
			}
		};
	var F;
	return {
		toggle: function(a) {
			F = a !== undefined ? a : !F;
			document[F ? 'addEventListener' : 'removeEventListener']('mousedown', C, true);
			if (!F) j()
		},
		on: function() {
			this.toggle(true)
		},
		off: function() {
			this.toggle(false)
		}
	}
})(window);
window.SelectLink.on();