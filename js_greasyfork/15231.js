// ==UserScript==
// @name           Youtube Downloader
// @namespace      http://userscripts.org/users/531617
// @description    create download button for Youtube
// @version        3.524
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://s.ytimg.com/yts/jsbin/html5player*
// @match https://s.ytimg.com/yts/jsbin/html5player*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/15231/Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/15231/Youtube%20Downloader.meta.js
// ==/UserScript==

(function () {
start();
function start() {
    (document.URL.match(".youtube.com/") || document.URL.match("s.ytimg.com/yts/jsbin/html5player") || document.URL.match(".googlevideo.com/videoplayback")) && function () {
        function N(k) {
            k && k.target && "watch7-container" == k.target.id && z()
        }

        function z() {
            function aa(g) {
                var d = g.currentTarget;
                g.returnValue = !1;
                g.preventDefault && g.preventDefault();
                (g = d.getAttribute("loop")) && GM_download(h[g].url, D + "." + E[h[g].format]);
                return !1
            }

            function ba(g, d) {
                if (s && void 0 == t[d] && O && "max" == P.m4a) {
                    var a = m(s, /\/s\/([a-zA-Z0-9\.]+)\//i);
                    if (a) {
                        var b = Q(a);
                        b && (s = s.replace("/s/" + a + "/", "/signature/" + b + "/"))
                    }
                    0 == s.indexOf("//") && (s = ("http:" == document.location.protocol ? "http:" : "https:") + s);
                    z({
                        method: "GET",
                        url: s,
                        onload: function (a) {
                            if (4 === a.readyState && 200 === a.status && a.responseText && (a = m(a.responseText, RegExp("<BaseURL.+>(http[^<]+itag=" + d + "[^<]+)<\\/BaseURL>", "i")))) {
                                a = a.replace(/&amp\;/g, "&");
                                for (var F = 0; F < h.length; F++)
                                    if (h[F].format == g) {
                                        h[F].format == d;
                                        var b = document.getElementById(w + g);
                                        b.setAttribute("id", w + d);
                                        b.parentNode.setAttribute("href", a);
                                        h[F].url = a;
                                        b.firstChild.nodeValue = R[d];
                                        n(a, d)
                                    }
                            }
                        }
                    })
                }
            }

            function ca(g) {
                var d = document.createElement("script");
                d.type = "application/javascript";
                d.textContent = g;
                document.body.appendChild(d);
                document.body.removeChild(d)
            }

            function y(g) {
                var d = document.getElementById(G);
                d || (d = U("div", G));
                d.appendChild(document.createTextNode(g + " "))
            }

            function U(g, d) {
                var a = document.createElement(g);
                a.setAttribute("id", d);
                a.setAttribute("style", "display:none;");
                document.body.appendChild(a);
                return a
            }

            function da(g, d) {
                if (/^af|bg|bn|ca|cs|de|el|es|et|eu|fa|fi|fil|fr|gl|hi|hr|hu|id|it|iw|kn|lv|lt|ml|mr|ms|nl|pl|pt|ro|ru|sl|sk|sr|sw|ta|te|th|uk|ur|vi|zu$/.test(g)) {
                    var a = document.getElementById("watch-like");
                    a && (a = a.getElementsByClassName("yt-uix-button-content")) && (a[0].style.display = "none");
                    a = 10;
                    /^bg|ca|cs|el|es|eu|fr|hr|it|ml|ms|pl|ro|ru|sl|sw|te$/.test(g) && (a = 1);
                    var a = "#watch7-secondary-actions .yt-uix-button{margin-" + d + ":" + a + "px!important}",
                        b = document.createElement("style");
                    b.type = "text/css";
                    b.appendChild(document.createTextNode(a));
                    document.getElementsByTagName("head")[0].appendChild(b)
                }
            }

            function m(g, a) {
                var b = g.match(a);
                return b ? b[1] : null
            }

            function I(g) {
                return "number" === typeof g && 0 == g % 1
            }

            function J(g) {
                if ("function" !== typeof GM_getValue || "undefined" !== typeof GM_getValue.toString && -1 !== GM_getValue.toString().indexOf("not supported")) {
                    var a = null;
                    try {
                        a = window.localStorage || null
                    } catch (b) {}
                    if (a) return a.getItem(g)
                } else return GM_getValue(g, null)
            }

            function x(g, a) {
                if ("function" !== typeof GM_setValue || "undefined" !== typeof GM_setValue.toString && -1 !== GM_setValue.toString().indexOf("not supported")) {
                    var b = null;
                    try {
                        b = window.localStorage || null
                    } catch (c) {}
                    if (b) return b.setItem(g, a)
                } else GM_setValue(g, a)
            }

            function z(a) {
                if ("function" === typeof GM_xmlhttpRequest) GM_xmlhttpRequest(a);
                else if ("undefined" !== typeof window.opera && window.opera && "undefined" !== typeof opera.extension && "undefined" !== typeof opera.extension.postMessage) {
                    var d = K.length;
                    opera.extension.postMessage({
                        action: "xhr-" + d,
                        url: a.url,
                        method: a.method
                    });
                    K[d] = a
                } else if ("undefined" === typeof window.opera && "function" === typeof XMLHttpRequest) {
                    var b = new XMLHttpRequest;
                    b.onreadystatechange = function () {
                        if (4 == b.readyState && a.onload) a.onload(b)
                    };
                    b.open(a.method, a.url, !0);
                    b.send()
                }
            }

            function n(a, d) {
                function b(a, g) {
                    var d = document.getElementById(w + g);
                    d && (a = parseInt(a, 10), a = 1073741824 <= a ? parseFloat((a / 1073741824).toFixed(1)) + " GB" : 1048576 <= a ? parseFloat((a / 1048576).toFixed(1)) + " MB" : parseFloat((a / 1024).toFixed(1)) + " KB", 1 < d.childNodes.length ? d.lastChild.nodeValue = " (" + a + ")" : 1 == d.childNodes.length && d.appendChild(document.createTextNode(" (" + a + ")")))
                }
                var c = m(a, /[&\?]clen=([0-9]+)&/i);
                if (c) b(c, d);
                else try {
                    z({
                        method: "HEAD",
                        url: a,
                        onload: function (a) {
                            if (4 == a.readyState && 200 == a.status) {
                                var g = 0;
                                "function" === typeof a.getResponseHeader ? g = a.getResponseHeader("Content-length") : a.responseHeaders && (a = /^Content-length: (.*)$/im.exec(a.responseHeaders)) && (g = a[1]);
                                g && b(g, d)
                            }
                        }
                    })
                } catch (p) {}
            }

            function N(a) {
                var d = m(a, /\.signature\s*=\s*(\w+)\(\w+\)/);
                if (null == d) return x(k, "error");
                a = m(a, RegExp("function " + d + '\\s*\\(\\w+\\)\\s*{\\w+=\\w+\\.split\\(""\\);(.+);return \\w+\\.join'));
                if (null == a) return x(k, "error");
                var d = /slice\s*\(\s*(.+)\s*\)/,
                    b = /\w+\s*\(\s*\w+\s*,\s*([0-9]+)\s*\)/,
                    c = /\w+\[0\]\s*=\s*\w+\[([0-9]+)\s*%\s*\w+\.length\]/,
                    p = a.split(";"),
                    e = [],
                    l = 81;
                for (a = 0; a < p.length; a++)
                    if (p[a] = p[a].trim(), 0 != p[a].length)
                        if (0 <= p[a].indexOf("slice")) {
                            var f = m(p[a], d),
                                f = parseInt(f, 10);
                            if (I(f)) e.push(-f), l += f;
                            else return x(k, "error")
                        } else if (0 <= p[a].indexOf("reverse")) e.push(0);
                else if (0 <= p[a].indexOf("[0]"))
                    if (a + 2 < p.length && 0 <= p[a + 1].indexOf(".length") && 0 <= p[a + 1].indexOf("[0]")) f = m(p[a + 1], c), f = parseInt(f, 10), e.push(f), a += 2;
                    else return x(k, "error");
                else if (0 <= p[a].indexOf(","))
                    if (f = m(p[a], b), f = parseInt(f, 10), I(f)) e.push(f);
                    else return x(k, "error");
                else return x(k, "error"); if (e)
                    for (x(V, r), x(k, e.toString()), L[l] = e, a = 0; a < h.length; a++) d = document.getElementById(w + h[a].format), b = h[a].url, c = h[a].sig, d && b && c && (b = b.replace(/\&signature=[\w\.]+/, "&signature=" + Q(c)), d.parentNode.setAttribute("href", b), n(b, h[a].format))
            }

            function W(a) {
                if (!a) return !1;
                if ("error" == a) return !0;
                a = a.split(",");
                for (var d = 0; d < a.length; d++)
                    if (!I(parseInt(a[d], 10))) return !1;
                return !0
            }

            function ea(a) {
                var d = J(V),
                    b = J(k);
                if (!(b && W(b) && d && a.replace(/^https?/i, "") == d.replace(/^https?/i, ""))) try {
                    X = !0, z({
                        method: "GET",
                        url: a,
                        onload: function (a) {
                            4 === a.readyState && 200 === a.status && a.responseText && N(a.responseText)
                        }
                    })
                } catch (c) {}
            }

            function fa(a) {
                var d = J(k);
                if (d && "error" != d && W(d)) {
                    for (var d = d.split(","), b = 81, c = 0; c < d.length; c++) d[c] = parseInt(d[c], 10), 0 > d[c] && (b -= d[c]);
                    a[b] = d
                }
                return a
            }

            function Q(a) {
                if (null == a) return "";
                var b = L[a.length];
                if (b) {
                    a: if ("string" === typeof a || a instanceof String) {
                        for (var c = a.split(""), e = 0; e < b.length; e++) {
                            var f = b[e];
                            if (!I(f)) {
                                b = null;
                                break a
                            }
                            if (0 < f) {
                                var h = c[0];
                                c[0] = c[f % c.length];
                                c[f] = h
                            } else c = 0 == f ? c.reverse() : c.slice(-f)
                        }
                        b = c.join("");
                        b = 81 == b.length ? b : a
                    } else b = null; if (b && 81 == b.length) return b
                }
                return a
            }
            if (!(document.getElementById(Y) || document.getElementById("p") && document.getElementById("vo"))) {
                var e, a, f, s, r = null,
                    X = !1,
                    K = [],
                    A = document.documentElement.getAttribute("lang"),
                    u = "left";
                "rtl" == document.body.getAttribute("dir") && (u = "right");
                da(A, u);
                var c = null,
                    b = "undefined" !== typeof this.unsafeWindow ? this.unsafeWindow : window;
                b.ytplayer && b.ytplayer.config && b.ytplayer.config.args && (c = b.ytplayer.config.args);
                c && (e = c.video_id, a = c.url_encoded_fmt_stream_map, f = c.adaptive_fmts, s = c.dashmpd, y("DYVAM - Info: Standard mode. videoID " + (e ? e : "none") + "; "));
                b.ytplayer && b.ytplayer.config && b.ytplayer.config.assets && (r = b.ytplayer.config.assets.js);
                if (null == e) {
                    if (c = document.getElementById(G + "2"))
                        for (; c.firstChild;) c.removeChild(c.firstChild);
                    else c = U("pre", G + "2");
                    ca('document.getElementById("' + G + '2").appendChild(document.createTextNode(\'"video_id":"\'+ytplayer.config.args.video_id+\'", "js":"\'+ytplayer.config.assets.js+\'", "dashmpd":"\'+ytplayer.config.args.dashmpd+\'", "url_encoded_fmt_stream_map":"\'+ytplayer.config.args.url_encoded_fmt_stream_map+\'", "adaptive_fmts":"\'+ytplayer.config.args.adaptive_fmts+\'"\'));');
                    if (c = c.innerHTML) e = m(c, /\"video_id\":\s*\"([^\"]+)\"/), a = m(c, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/), a = a.replace(/&amp;/g, "\\u0026"), f = m(c, /\"adaptive_fmts\":\s*\"([^\"]+)\"/), f = f.replace(/&amp;/g, "\\u0026"), s = m(c, /\"dashmpd\":\s*\"([^\"]+)\"/), r = m(c, /\"js\":\s*\"([^\"]+)\"/);
                    y("DYVAM - Info: Injection mode. videoID " + (e ? e : "none") + "; ")
                }
                null == e && (c = document.body.innerHTML, null != c && (e = m(c, /\"video_id\":\s*\"([^\"]+)\"/), a = m(c, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/), f = m(c, /\"adaptive_fmts\":\s*\"([^\"]+)\"/), s = m(c, /\"dashmpd\":\s*\"([^\"]+)\"/), null == r && (r = m(c, /\"js\":\s*\"([^\"]+)\"/), r = r.replace(/\\/g, ""))), y("DYVAM - Info: Brute mode. videoID " + (e ? e : "none") + "; "));
                y("DYVAM - Info: url " + window.location.href + "; useragent " + window.navigator.userAgent);
                if (null == e || null == a || 0 == e.length || 0 == a.length) y("DYVAM - Error: No config information found. YouTube must have changed the code.");
                else {
                    "undefined" !== typeof window.opera && window.opera && "undefined" !== typeof opera.extension && (opera.extension.onmessage = function (a) {
                        var b = m(a.data.action, /xhr\-([0-9]+)\-response/);
                        b && K[parseInt(b, 10)] && (b = parseInt(b, 10), b = K[b].onload, "function" === typeof b && 4 == a.data.readyState && b && b(a.data))
                    });
                    Z || (L = fa(L), Z = !0);
                    r && (0 == r.indexOf("//") && (r = ("http:" == document.location.protocol ? "http:" : "https:") + r), ea(r));
                    var D = document.title || "video",
                        D = D.replace(/\s*\-\s*YouTube$/i, "").replace(/[#"\?:\*]/g, "").replace(/[&\|\\\/]/g, "_").replace(/'/g, "'").replace(/^\s+|\s+$/g, "").replace(/\.+$/g, ""),
                        q = "%2C",
                        c = "%26",
                        b = "%3D"; - 1 < a.indexOf(",") && (q = ",", c = -1 < a.indexOf("&") ? "&" : "\\u0026", b = "=");
                    var t = [];
                    e = [];
                    f && (a = a + q + f);
                    f = a.split(q);
                    for (a = 0; a < f.length; a++) {
                        for (var l = f[a].split(c), q = [], B = 0; B < l.length; B++) {
                            var H = l[B].split(b);
                            2 == H.length && (q[H[0]] = H[1])
                        }
                        null != q.url && (l = unescape(unescape(q.url)).replace(/\\\//g, "/").replace(/\\u0026/g, "&"), null != q.itag && (B = q.itag, (H = q.sig || q.signature) ? (l = l + "&signature=" + H, e[B] = null) : q.s && (l = l + "&signature=" + Q(q.s), e[B] = q.s), -1 == l.toLowerCase().indexOf("ratebypass") && (l += "&ratebypass=yes"), 0 == l.toLowerCase().indexOf("http") && (t[B] = l + "&title=" + D)))
                    }
                    var c = [],
                        v;
                    for (v in P) {
                        a = P[v];
                        for (var C in E) E[C] == v && (c[C] = "all" == a);
                        if ("max" == a)
                            for (a = M.length - 1; 0 <= a; a--)
                                if (b = M[a], E[b] == v && void 0 != t[b]) {
                                    c[b] = !0;
                                    break
                                }
                    }
                    v = J($);
                    "1" == v ? O = !0 : "0" != v && x($, "0");
                    var h = [];
                    for (a = 0; a < M.length; a++) b = M[a], "37" == b && void 0 == t[b] ? (t["137"] && (b = "137"), c[b] = c["37"]) : "38" == b && void 0 == t[b] && (t["138"] && (b = "138"), c[b] = c["38"]), !O && 2 < b.length || void 0 == t[b] || void 0 == R[b] || !c[b] || (h.push({
                        url: t[b],
                        sig: e[b],
                        format: b,
                        label: R[b]
                    }), y("DYVAM - Info: itag" + b + " url:" + t[b]));
					// 20140830 : 버튼 레이아웃 위치 호환성 처리
					if (v = document.getElementById("watch7-action-buttons"), null == v)
						v = document.getElementById("watch8-secondary-actions");
					//
                    if (0 == h.length) y("DYVAM - Error: No download URL found. Probably YouTube uses encrypted streams.");
                    else if (null == v) y("DYVAM - No container for adding the download button. YouTube must have changed the code.");
                    else {
                        a = S[A] ? S[A] : S.ja;
                        A = T[A] ? T[A] : T.ja;
                        C = document.createElement("span");
                        e = document.createElement("span");
                        e.setAttribute("class", "yt-uix-button-content");
                        e.appendChild(document.createTextNode(a + " "));
                        C.appendChild(e);
                        a = document.createElement("img");
                        a.setAttribute("class", "yt-uix-button-arrow");
                        a.setAttribute("src", "//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif");
                        C.appendChild(a);
                        e = document.createElement("ol");
                        e.setAttribute("style", "display:none;");
                        e.setAttribute("class", "yt-uix-button-menu");
                        for (a = 0; a < h.length; a++) c = document.createElement("li"), b = document.createElement("a"), b.setAttribute("style", "text-decoration:none;"), b.setAttribute("href", h[a].url), b.setAttribute("download", D + "." + E[h[a].format]), f = document.createElement("span"), f.setAttribute("class", "yt-ui-menu-item"), f.setAttribute("loop", a + ""), f.setAttribute("id", w + h[a].format), f.appendChild(document.createTextNode(h[a].label)), b.appendChild(f), c.appendChild(b), e.appendChild(c);
                        C.appendChild(e);
                        a = document.createElement("button");
                        a.setAttribute("id", ga);
                        a.setAttribute("class", "yt-uix-button yt-uix-tooltip yt-uix-button-empty yt-uix-button-text");
						// 20141002 : 버튼 레이아웃 수정
						a.setAttribute("style", "margin-left:" + ("left" == u ? 5 : 10) + "px;");
                        //a.setAttribute("style", "margin-top:4px; margin-left:" + ("left" == u ? 5 : 10) + "px;");
                        a.setAttribute("data-tooltip-text", A);
                        a.setAttribute("type", "button");
                        a.setAttribute("role", "button");
                        a.addEventListener("click", function () {
                            return !1
                        }, !1);
                        a.appendChild(C);
                        u = document.createElement("span");
                        u.setAttribute("id", Y);
                        u.appendChild(document.createTextNode(" "));
                        u.appendChild(a);
                        v.appendChild(u);
                        if (!X)
                            for (a = 0; a < h.length; a++) n(h[a].url, h[a].format);
                        if ("undefined" !== typeof GM_download)
                            for (a = 0; a < h.length; a++) u = document.getElementById(w + h[a].format), l = h[a].url.toLowerCase(), 0 < l.indexOf("clen=") && 0 < l.indexOf("dur=") && 0 < l.indexOf("gir=") && 0 < l.indexOf("lmt=") && u.addEventListener("click", aa, !1);
                        ba("140", "141")
                    }
                }
            }
        }
        var R = {
                5: "FLV 240p",
                18: "MP4 360p",
                22: "MP4 720p",
                34: "FLV 360p",
                35: "FLV 480p",
                37: "MP4 1080p",
                38: "MP4 2160p",
                43: "WebM 360p",
                44: "WebM 480p",
                45: "WebM 720p",
                46: "WebM 1080p",
				// 20150219 : 3D 포멧 추가
				84: "MP4 720p3D",
                85: "MP4 1080p3D",
				102: "WebM 720p3D",
				//
                135: "MP4 480p - \u97f3\u58f0\u306a\u3057",
				// 20150219 : MP4V 포멧 추가
				136: "MP4V 720p - \u97f3\u58f0\u306a\u3057",
				//
                137: "MP4 1080p - \u97f3\u58f0\u306a\u3057",
                138: "MP4 Original - \u97f3\u58f0\u306a\u3057",
                139: "M4A 48kbps - \u97f3\u58f0\u306e\u307f",
                140: "M4A 128kbps - \u97f3\u58f0\u306e\u307f",
                141: "M4A 256kbps - \u97f3\u58f0\u306e\u307f",
				// 20150219 : WebMV 포멧 추가
				244: "WebMV 480p - \u97f3\u58f0\u306a\u3057",
				245: "WebMV 480p245 - \u97f3\u58f0\u306a\u3057",
				246: "WebMV 480p246 - \u97f3\u58f0\u306a\u3057",
				247: "WebMV 720p - \u97f3\u58f0\u306a\u3057",
				248: "WebMV 1080p - \u97f3\u58f0\u306a\u3057",
				//
                264: "MP4V 1440p - \u97f3\u58f0\u306a\u3057",
				// 20150219 : MP4V,WebMV 포멧 추가
				266: "MP4V Original - \u97f3\u58f0\u306a\u3057",
				271: "WebMV 1440p - \u97f3\u58f0\u306a\u3057",
				272: "WebMV Original - \u97f3\u58f0\u306a\u3057",
				//
				// 20141118 : 60fps 포멧 추가
				298: "MP4 720p60 - \u97f3\u58f0\u306a\u3057",
				299: "MP4 1080p60 - \u97f3\u58f0\u306a\u3057",
				// 20150219 : WebMV 포멧 추가
				302: "WebMV 720p60 - \u97f3\u58f0\u306a\u3057",
				303: "WebMV 1080p60 - \u97f3\u58f0\u306a\u3057",
				// 20150625 : 고화질 & 60fps 포멧 추가
				308: "WebMV 1440p60 - \u97f3\u58f0\u306a\u3057",
				313: "WebMV Original - \u97f3\u58f0\u306a\u3057",
				315: "WebMV Original60 - \u97f3\u58f0\u306a\u3057",
				//
            },
            E = {
                5: "flv",
                18: "mp4",
                22: "mp4",
                34: "flv",
                35: "flv",
                37: "mp4",
                38: "mp4",
                43: "webm",
                44: "webm",
                45: "webm",
                46: "webm",
				// 20150219 : 3D 포멧 추가
				84: "mp4",
                85: "mp4",
                102: "webm",
				//
                135: "mp4",
				// 20150219 : MP4V 포멧 추가
				136: "mp4v",
				//
                137: "mp4",
                138: "mp4",
                139: "m4a",
                140: "m4a",
                141: "m4a",
				// 20150219 : WebMV 포멧 추가
				244: "webmv",
				245: "webmv",
				246: "webmv",
				247: "webmv",
				248: "webmv",
				//
                264: "mp4v",
				// 20150219 : MP4V,WebMV 포멧 추가
				266: "mp4v",
				271: "webmv",
				272: "webmv",
				//
				// 20141118 : 60fps 포멧 추가
				298: "mp4",
				299: "mp4",
				// 20150219 : WebMV 포멧 추가
				302: "webmv",
				303: "webmv",
				// 20150625 : 고화질 & 60fps 포멧 추가
				308: "webmv",
				313: "webmv",
				315: "webmv",
				//
            },
			// 20150219 : 3D, MP4V, WebMV 포멧 추가
			M = "5 18 34 43 35 135 44 22 45 37 46 38 84 136 298 85 299 264 266 244 102 247 302 248 303 271 272 308 313 315 139 140 141".split(" "),
			// 20141118 : 60fps 포멧 추가
			//M = "5 18 34 43 35 135 44 22 45 37 46 264 38 264 298 299 139 140 141".split(" "),
            //M = "5 18 34 43 35 135 44 22 45 37 46 264 38 139 140 141".split(" "),
            P = {
                flv: "max",
                mp4: "all",
				// 20150219 : 3D, MP4V, WebMV 포멧 추가
				mp4v: "all",
                webm: "all",
				webmv: "all",
                //webm: "none",
                m4a: "max"
            },
            O = !0,
            S = {
                ar: "\u062a\u0646\u0632\u064a\u0644",
                cs: "St\u00e1hnout",
                de: "Herunterladen",
                en: "Download",
                es: "Descargar",
                fr: "T\u00e9l\u00e9charger",
                hi: "\u0921\u093e\u0909\u0928\u0932\u094b\u0921",
                id: "Unduh",
                it: "Scarica",
                ja: "\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9",
                ko: "\ub0b4\ub824\ubc1b\uae30",
                pl: "Pobierz",
                pt: "Baixar",
                ro: "Desc\u0103rca\u021bi",
                ru: "\u0421\u043a\u0430\u0447\u0430\u0442\u044c",
                tr: "\u0130ndir",
                zh: "\u4e0b\u8f7d"
            },
            T = {
                ar: "\u062a\u0646\u0632\u064a\u0644 \u0647\u0630\u0627 \u0627\u0644\u0641\u064a\u062f\u064a\u0648",
                cs: "St\u00e1hnout toto video",
                de: "Dieses Video herunterladen",
                en: "Download this video",
                es: "Descargar este v\u00eddeo",
                fr: "T\u00e9l\u00e9charger cette vid\u00e9o",
                hi: "\u0935\u0940\u0921\u093f\u092f\u094b \u0921\u093e\u0909\u0928\u0932\u094b\u0921 \u0915\u0930\u0947\u0902",
                id: "Unduh video ini",
                it: "Scarica questo video",
                ja: "\u3053\u306e\u30d3\u30c7\u30aa\u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3059\u308b",
                ko: "\uc774 \ube44\ub514\uc624\ub97c \ub0b4\ub824\ubc1b\uae30",
                pl: "Pobierz plik wideo",
                pt: "Baixar este v\u00eddeo",
                ro: "Desc\u0103rca\u021bi acest videoclip",
                ru: "\u0421\u043a\u0430\u0447\u0430\u0442\u044c \u044d\u0442\u043e \u0432\u0438\u0434\u0435\u043e",
                tr: "Bu videoyu indir",
                zh: "\u4e0b\u8f7d\u6b64\u89c6\u9891"
            },
            L = {},
            n = Math.floor(1E7 * Math.random()),
            Y = "download-youtube-video" + n,
            w = "download-youtube-video-fmt" + n,
            ga = "download-youtube-video-button" + n,
            G = "download-youtube-video-debug-info",
            V = "download-youtube-script-url",
            k = "download-youtube-signature-code",
            $ = "download-youtube-dash-enabled",
            Z = !1;
        (function () {
            var k = document.getElementById("page-container");
            if (k) {
                /^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href) && z();
                var n = /class[\w\s"'-=]+spf\-link/.test(k.innerHTML),
                    w = document.getElementById("content");
                n && w && (n = window.MutationObserver || window.WebKitMutationObserver, "undefined" !== typeof n ? (new n(function (k) {
                    k.forEach(function (k) {
                        if (null !== k.addedNodes)
                            for (var n = 0; n < k.addedNodes.length; n++)
                                if ("watch7-container" == k.addedNodes[n].id) {
                                    z();
                                    break
                                }
                    })
                })).observe(w, {
                    childList: !0,
                    subtree: !0
                }) : k.addEventListener("DOMNodeInserted", N, !1))
            }
        })()
    }()
}
})();