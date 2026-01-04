// ==UserScript==
// @name         r34init
// @namespace    http://tampermonkey.net/
// @version      2024-08-01
// @description  r34fix
// @author       You
// @grant        none
// ==/UserScript==


function initKVSPlayTrailer() {
    console.log('init start')
    var n, r, c, e = /iphone|ipad|Android|webOS|iPod|BlackBerry|Windows Phone/gi.test(navigator.appVersion), o = 0;
    function l(e) {
        var i, s = e, e = s.find("video"), o = s.find("img");
        e.length ? (e.get(0).play(),
        o.hide()) : ($(".js-swipe").hide(),
        i = $('<div class="preview-progress"></div>'),
        s.append(i),
        setTimeout(function() {
            i.addClass("is-full")
        }),
        n = setTimeout(function() {
            var e = s.attr("data-preview")
              , t = (s.attr("data-subtitles"),
            $('<video autoplay loop muted playsinline src="' + e + '"></video>'));
            function a() {
                s.append(t),
                t.get(0).play(),
                o.hide(),
                i.remove()
            }
            r = setTimeout(function() {
                0 < t.get(0).readyState ? a() : c = setInterval(function() {
                    0 < t.get(0).readyState && (a(),
                    clearInterval(c))
                }, 0)
            }, 0)
        }, 0))
    }
    e ? $("body").find("[data-preview]").swipe({
        swipeLeft: function(e, t, a, i, s) {
            clearTimeout(n),
            clearTimeout(r),
            clearInterval(c);
            $(this).find("img");
            o++,
            $("[data-preview]").each(function(e) {
                var t = $(this)
                  , a = t.find("video");
                a.length && (a.get(0).remove(),
                $("img").show()),
                t.find(".preview-progress").remove()
            }),
            1 < o ? ($(this).find("video").eq(0).length && ($(this).find("video").get(0).remove(),
            $("img").show()),
            o = 0) : l($(this))
        },
        swipeRight: function(e, t, a, i, s) {
            clearTimeout(n),
            clearTimeout(r),
            clearInterval(c);
            $(this).find("img");
            o++,
            $("[data-preview]").each(function(e) {
                var t = $(this)
                  , a = t.find("video");
                a.length && (a.get(0).remove(),
                $("img").show()),
                t.find(".preview-progress").remove()
            }),
            1 < o ? ($(this).find("video").eq(0).length && ($(this).find("video").get(0).remove(),
            $("img").show()),
            o = 0) : l($(this))
        },
        preventDefaultEvents: !1,
        threshold: 80
    }) : $("body").on("mouseenter", "[data-preview]", function() {
        l($(this))
    }).on("mouseleave", "[data-preview]", function() {
        clearTimeout(n),
        clearTimeout(r),
        clearInterval(c);
        var e = $(this);
        e.find("img").show();
        var t = e.find("video");
        t.length && t.get(0).remove(),
        e.find(".preview-progress").remove()
    })
}
