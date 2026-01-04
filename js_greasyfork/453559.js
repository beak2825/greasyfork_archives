// ==UserScript==
// @author		test
// @name		Agar Tool M PELEA
// @version		13.04
// @namespace	AgarTool
// @description	Adds new features to agar.io such as free coins, and unlimited zoom. To see all new features, visit our website at https://www.agartool.io
// @match		*://*.agar.io/*
// @match		*://*.agartool.io/*
// @run-at		document-start
// @icon        data:image/png;base64,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
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/453559/Agar%20Tool%20M%20PELEA.user.js
// @updateURL https://update.greasyfork.org/scripts/453559/Agar%20Tool%20M%20PELEA.meta.js
// ==/UserScript==
 
! function(e) {
    var n = "13.04",
        t = !0,
        i = e;
 
    function c(o) {
        try {
            var t = e.document.createElement("script");
            t.type = "text/javascript", t.charset = "utf-8", t.src = o, t.onerror = function() {
                e.setTimeout(function() {
                    c(o)
                }, 2500)
            }, e.document.head.appendChild(t)
        } catch (t) {
            e.setTimeout(function() {
                c(o)
            }, 2500)
        }
    }
 
 
 
    function s() {
        try {
            e.document.documentElement.innerHTML = '<html><head></head><body style="display:none;"><div id="agarToolLoaded" style="display: none;">' + e.Date.now() + "</div></body></html>"
        } catch (t) {}
    }
 
    function o() {
        s(), e.location = "https://agar.io/agartool/" + e.location.search + e.location.hash
    }
    "undefined" != typeof unsafeWindow && (i = unsafeWindow);
    var a = e.location.pathname.includes(".htm") || e.location.pathname.includes(".php") || e.location.pathname.includes(".asp") || e.location.pathname.includes(".jsp") || !e.location.pathname.includes(".");
    if (e.location.hostname.includes("agartool.io")) a && (i.AgarToolInstalled = n);
    else if (e.location.hostname.includes("agar.io")) {
        c("https://cdn.agartool.io/integrity.js");
        var l = !1,
            r = e.document.getElementById("agarToolLoaded");
        if (r) {
            var d = r.innerHTML;
            !e.isNaN(d) && e.Date.now() - d < 500 && (l = !0)
        }
        l || (e.location.pathname.startsWith("/agartool") ? function o() {
            try {
                s(), "/" != e.location.pathname && e.history.replaceState({}, "", "/" + e.location.search + e.location.hash);
                var a = new e.XMLHttpRequest;
                a.overrideMimeType("application/json"), a.open("GET", "https://cdn.agartool.io/extension_" + n + ".js" + (t ? "" : "?v=" + e.Date.now()), !0), a.onreadystatechange = function() {
                    if (4 === a.readyState && "200" == a.status) {
                        var t = a.responseText;
                        t = t.replace("{%%283269335152219%%}", e.Date.now());
                        var o = e.JSON.parse(t);
                        i.document.open(), i.document.write(o.html), i.document.close(), c("https://cdn.agartool.io/" + n + "/" + o.js + ".js");
 
                        var k = e.document.createElement('link');
						k.rel  = 'stylesheet';
                        k.type = 'text/css';
                        k.href = 'https://deltav4.gitlab.io/agartool/css/styles.2b3fff4166b87b4809da.css';
                        k.media = 'all';
                        e.document.querySelector("html").appendChild(k);
                    }
                }, a.onerror = function() {
                    e.setTimeout(o, 2500)
                }, a.send()
            } catch (t) {
                e.setTimeout(o, 2500)
            }
        }() : "/" == e.location.pathname || e.location.pathname.startsWith("/index.") && a ? o() : a && e.setTimeout(o, 1e3))
    }
}(window);