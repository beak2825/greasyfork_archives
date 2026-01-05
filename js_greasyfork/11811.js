// ==UserScript==
// @name        Reddit Infinite Scrolling
// @include     http://www.reddit.com/*
// @description Map for agario
// @include     https://www.reddit.com/*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @namespace https://greasyfork.org/users/14382
// @downloadURL https://update.greasyfork.org/scripts/11811/Reddit%20Infinite%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/11811/Reddit%20Infinite%20Scrolling.meta.js
// ==/UserScript==
! function() {
	    function i(i, t) {
	        var n = u("<div>").attr("id", "mini-map-token-" + i).css({
	            position: "absolute",
	            width: "5%",
	            height: "5%",
	            background: t,
	            top: "0%",
	            left: "0%"
	        });
	        return n
	    }

	    function t(i, t) {
	        void 0 === window.mini_map_tokens[i] && (window.mini_map.append(t), window.mini_map_tokens[i] = t)
	    }

	    function n(i) {
	        void 0 !== window.mini_map_tokens[i] && (window.mini_map_tokens[i].detach(), delete window.mini_map_tokens[i])
	    }

	    function e(i) {
	        return void 0 !== window.mini_map_tokens[i]
	    }

	    function o(i, t, n) {
	        return void 0 !== window.mini_map_tokens[i] ? (window.mini_map_tokens[i].css("left", t / 26e3 * 104 + "%").css("top", n / 26e3 * 104 + "%"), !0) : !1
	    }

	    function s(i, t) {
	        window.mini_map_pos.text("x: " + i.toFixed(0) + " / y: " + t.toFixed(0))
	    }

	    function a() {
	        var i = window.jQuery;
	        if (window.mini_map_tokens = {}, 0 === i("#mini-map-pos").length && (window.mini_map_pos = i("<div>").attr("id", "mini-map-pos").css({
	                top: 50,
	                left: 10,
	                color: "white",
	                background: "rgba(155, 155, 155, 0.6)",
	                fontSize: 14,
	                fontWeight: 800,
	                position: "fixed",
	                padding: "0px 10px"
	            }).appendTo(document.body)), 0 === i("#mini-map-wrapper").length) {
	            var t = i("<div>").attr("id", "mini-map-wrapper").css({
	                    position: "fixed",
	                    top: "80px",
	                    left: "10px",
	                    width: "150px",
	                    height: "150px",
//	                    background: "rgba(128, 128, 128, 0.58)"
						background: "url('http://haxelite.com/resim/upload/b609c466-mini.png')"
	                }),
	                n = i("<div>").attr("id", "mini-map").css({
	                    width: "100%",
	                    height: "100%",
	                    position: "relative"
	                });
	            t.append(n).appendTo(document.body), window.mini_map = n
	        }
	    }

	    function r(i, t, n, e, o, s) {
	        m[i] = this, this.id = i, this.ox = this.x = t, this.oy = this.y = n, this.oSize = this.size = e, this.color = o, this.points = [], this.pointsAcc = [], this.setName(s)
	    }

	    function d(i, t, n) {
	        Object.defineProperty(i, n, {
	            get: function() {
	                return t[n]
	            },
	            set: function(i) {
	                t[n] = i
	            },
	            enumerable: !0,
	            configurable: !0
	        })
	    }

	    function p(i, t) {
	        var n = +new Date,
	            e = Math.random(),
	            o = t,
	            s = i.getUint16(o, !0);
	        o += 2;
	        for (var a = 0; s > a; ++a) {
	            var d = m[i.getUint32(o, !0)],
	                p = m[i.getUint32(o + 4, !0)],
	                o = o + 8;
	            d && p && (p.destroy(), p.ox = p.x, p.oy = p.y, p.oSize = p.size, p.nx = d.x, p.ny = d.y, p.nSize = p.size, p.updateTime = n)
	        }
	        for (a = 0;;) {
	            var c = i.getUint32(o, !0);
	            if (o += 4, 0 == c) break;
	            ++a;
	            var d = i.getInt16(o, !0),
	                o = o + 2,
	                p = i.getInt16(o, !0),
	                o = o + 2;
	            g = i.getInt16(o, !0), o += 2;
	            for (var h = i.getUint8(o++), u = i.getUint8(o++), l = i.getUint8(o++), h = (h << 16 | u << 8 | l).toString(16); 6 > h.length;) h = "0" + h;
	            var h = "#" + h,
	                w = i.getUint8(o++),
	                u = !!(1 & w),
	                l = !!(16 & w);
	            2 & w && (o += 4), 4 & w && (o += 8), 8 & w && (o += 16);
	            for (var f, w = ""; f = i.getUint16(o, !0), o += 2, 0 != f;) w += String.fromCharCode(f);
	            f = w, w = null, m.hasOwnProperty(c) ? (w = m[c], w.updatePos(), w.ox = w.x, w.oy = w.y, w.oSize = w.size, w.color = h) : (w = new r(c, d, p, g, h, f), w.pX = d, w.pY = p), w.isVirus = u, w.isAgitated = l, w.nx = d, w.ny = p, w.nSize = g, w.updateCode = e, w.updateTime = n, f && w.setName(f)
	        }
	        for (e = i.getUint32(o, !0), o += 4, a = 0; e > a; a++) c = i.getUint32(o, !0), o += 4, w = m[c], null != w && w.destroy()
	    }

	    function c(i) {
	        var t = 0,
	            n = new DataView(i.data);
	        switch (240 == n.getUint8(t) && (t += 5), n.getUint8(t++)) {
	            case 16:
	                p(n, t);
	                break;
	            case 20:
	                l = [];
	                break;
	            case 32:
	                var e = n.getUint32(t, !0);
	                l.push(e)
	        }
	    }
	    var h = window.WebSocket,
	        u = window.jQuery,
	        m = [],
	        l = [];
	    r.prototype = {
	        id: 0,
	        points: null,
	        pointsAcc: null,
	        name: null,
	        nameCache: null,
	        sizeCache: null,
	        x: 0,
	        y: 0,
	        size: 0,
	        ox: 0,
	        oy: 0,
	        oSize: 0,
	        nx: 0,
	        ny: 0,
	        nSize: 0,
	        updateTime: 0,
	        updateCode: 0,
	        drawTime: 0,
	        destroyed: !1,
	        isVirus: !1,
	        isAgitated: !1,
	        wasSimpleDrawing: !0,
	        destroy: function() {
	            delete m[this.id], id = l.indexOf(this.id), -1 != id && l.splice(id, 1), this.destroyed = !0, n(this.id)
	        },
	        setName: function(i) {
	            this.name = i
	        },
	        updatePos: function() {
	            -1 != l.indexOf(this.id) && (e(this.id) || t(this.id, i(this.id, this.color)), o(this.id, this.nx, this.ny), s(this.nx, this.ny))
	        }
	    }, window.WebSocket = function(i, t) {
	        console.log("Listen to MAP"), void 0 === t && (t = []);
	        var n = new h(i, t);
	        d(this, n, "binaryType"), d(this, n, "bufferedAmount"), d(this, n, "extensions"), d(this, n, "protocol"), d(this, n, "readyState"), d(this, n, "url"), this.send = function(i) {
	            return n.send.call(n, i)
	        }, this.close = function(i, t) {
	            return n.close.call(n, i, t)
	        }, this.onopen = function() {}, this.onclose = function() {}, this.onerror = function() {}, this.onmessage = function() {}, n.onopen = function(i) {
	            return this.onopen.call(n, i)
	        }
			.bind(this), n.onmessage = function(i) {
	            return c(i), this.onmessage.call(n, i)
	        }
			.bind(this), n.onclose = function(i) {
	            return this.onclose.call(n, i)
	        }
			.bind(this), n.onerror = function(i) {
	            return this.onerror.call(n, i)
	        }
			.bind(this)
	    }, window.WebSocket.prototype = h, a()
	}();