// ==UserScript==
// @name         SHOWROOMポップアップ
// @namespace    https://greasyfork.org/morca
// @version      0.4
// @description  サムネイルを大きく表示する
// @author       morca
// @match        https://www.showroom-live.com/*
// @downloadURL https://update.greasyfork.org/scripts/473448/SHOWROOM%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/473448/SHOWROOM%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97.meta.js
// ==/UserScript==

if (typeof jQuery == "undefined" || $().jquery < "1.8.0") {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
    script.onload = code;
    document.getElementsByTagName("head")[0].appendChild(script);
} else {
    code();
}
function code() {
    'use strict';
    function appendPreview() {
        $("img").each((i, e) => {
            if (e.parentNode.hasAttribute("preview")) return;
            let src = $(e).attr("src");
            if (/https:\/\/static\.showroom-live\.com\/image\/room\/cover\/.*_[sml]\.\w+(\?.*)?$/.test(src)) {
                // (?:_square)? fails _s.jpeg while _square_s.jpeg with _s.png
                src = src.replace(/_[sml](\.\w+)(\?.*)?$/, "_l$1");
                $(e).parent().attr("src", src).attr("preview", "");
            }
        });
        $("a.st-header__link").each((i, e) => {
            if (e.hasAttribute("preview")) return;
            let src = $("meta[property='og:image']").attr("content");
            if (/https:\/\/static\.showroom-live\.com\/image\/room\/cover\/.*_[sml]\.\w+(\?.*)?$/.test(src)) {
                src = src.replace(/_[sml](\.\w+)(\?.*)?$/, "_l$1");
                $(e).attr("src", src).attr("preview", "");
            }
        });
    }
    appendPreview();
    var imagePreviewSetEvents;
    (function(resolveSrc) {
        /*
         * Image preview script
         * original is written by Alen Grakalic (http://cssglobe.com)
         */
        var cursor;
        function move(ev) {
            if (!ev) ev = cursor; else cursor = ev;
            if (!ev) return;
            const margin = 10;
            const xOffset = 10;
            const yOffset = -30;
            let p = $("#preview");
            let x = ev.clientX + xOffset;
            let y = ev.clientY + yOffset;
            if (x + p.outerWidth(true) > $(window).width() - margin && x >= margin) x = $(window).width() - margin - p.outerWidth(true);
            if (y + p.outerHeight(true) > $(window).height() - margin && y >= margin) y = $(window).height() - margin - p.outerHeight(true);
            if (x < margin & x + p.outerWidth(true) <= $(window).width() - margin) x = margin;
            if (y < margin & y + p.outerHeight(true) <= $(window).height() - margin) y = margin;
            p.css("left", x + "px").css("top", y + "px");
        }
        var timer = setInterval(() => {
            $("#preview > img[srcs*=';']").each((i, e) => {
                if (!e.loaded) return;
                let src = e.getAttribute("src");
                let srcs = $(e).attr("srcs").split(";");
                if (srcs.length >= 2) {
                    if (e.second) {
                        e.loaded = false;
                        e.setAttribute("src", srcs[(srcs.indexOf(src) + 1) % srcs.length]);
                    } else {
                        e.second = true;//skip first trigger
                    }
                }
            });
        }, 2000);
        function create(ev, t) {
            if (!t.focus) return;//check focus still on
            let src = t.getAttribute("src");
            if (!src) {
                if (resolveSrc) resolveSrc(t, create, ev);
                return;
            }
            t.t = t.getAttribute("title");
            t.title = "";
            let style = "display: none;"//fadeIn
                + " position: fixed;"//clientX/Y
                + " z-index: 1000;"//foreground
                + " pointer-events: none;"//avoid hover flicker
                + " *width: auto;"//wrap
                + " line-height: 120%; box-sizing: content-box; padding: 2px; border: 1px solid #333; background: #444; color: #fff;";//design
            let c = (t.t) ? `<span style='font-size: 95%; font-family: 'メイリオ'; text-align: center;'>${t.t}</span>` : "";
            let srcs = src.split(";");
            let img = `<img src='${srcs[0]}' srcs='${src}' srcs0='${src}' style='display: none;' />`;
            let div = $(`<div id='preview' style='${style}''>${c}${img}</div>`);
            $("body").append(div);
            $(div).find("img:last")[0].addEventListener('load', function(e) {//last is to exclude emoji img
                if (this.width == 120 && /\/4\.jpg/.test(this.getAttribute("src"))) {//TODO geo spec 404 image
                    $(div).hide();
                    let src = this.getAttribute("src");
                    console.log("fail", src);
                    this.setAttribute("src", src.replace(/\/4\.jpg/, "/3.jpg"));
                    return;
                }
                if (this.width <= 1) {
                    $(div).hide();
                    let src = this.getAttribute("src");
                    console.log("fail", src);
                    let srcs = this.getAttribute("srcs").split(";");
                    let srcs2 = srcs.filter((e, i, a) => { return a[i] != src });//TODO remove it and after
                    this.setAttribute("srcs", srcs2.join(";"));
                    if (srcs2.length > 0) this.setAttribute("src", srcs2[0]);
                    return;
                }
                this.loaded = true;
                if (this.height > document.documentElement.clientHeight * 0.9) {
                    this.width *= document.documentElement.clientHeight / this.height * 0.9;
                }
                this.parentNode.style.width = this.width + "px";
                this.style.display = "block";
                move(null);
                $(div).fadeIn();//to show hidden img
            }, false);
            move(ev);//just save
            $(div).fadeIn();//to response hover
        }
        imagePreviewSetEvents = function(node, unbind) {
            if (!node.hasAttribute("preview")) return;
            if (unbind) {
                $(node).removeAttr("preview");
                $(node).unbind("mouseenter mouseleave mousemove");
                return;
            }
            let events = $(node).data("events");
            if (events && (events.mouseenter || events.mouseleave || events.mousemove)) return;
            $(node).hover(function(ev) {
                this.focus = true;
                create(ev, this);
            }, function() {
                this.focus = false;
                if (this.t) this.title = this.t;
                $("#preview > img[srcs0*=';']").each((i, e) => {//update shrunk srcs
                    let srcs = e.getAttribute("srcs");
                    let srcs0 = e.getAttribute("srcs0");
                    if (srcs != srcs0) $(`[preview][src="${srcs0}"]`).attr("src", srcs);
                });
                $("#preview").remove();
            }).mousemove(function(ev) {
                if (!$("#preview")[0]) {
                    create(ev, this);//for src added afterward
                    return;
                }
                move(ev);
            });
        }
    })(function(t, create, ev) {
        let href = t.getAttribute("href");
        let m = /&rp=([^&]+)/.exec(href);
        if (m) href = decodeURIComponent(m[1]);
        if (!/^(?:[^/]+:\/\/[^/]+)?(?:\/[^/]+)?\/detail-[0-9]+\.html(\?.+)?$/.test(href)) return;
        href = href.replace(/\.html(\?.+)?$/, ".html");
        if (t.creating) return;
        t.creating = true;
        let title = t.getAttribute("title");
        $.get(href, data => {
            let html = $.parseHTML(data);
            let img = $(html).find("img[itemprop='image']");
            let alt = img.attr("alt");
            let src = img.attr("src");
            if (!src) {
                console.log("not found");
                imagePreviewSetEvents(t, true);
                return;
            }
            if (/\/(.+\/)?cdn\/.+\/[1-4]\.jpg(\?.*)?$/.test(src)) {
                src = src.replace(/\/[1-4]\.jpg(\?.*)?$/, "/4.jpg");
            }
            if (!title) {
                let title = t.getAttribute("title");
                title = `${alt}` + (title && ` ${title}` || "");
                t.setAttribute("title", title);
            }
            t.setAttribute("src", src);
            create(ev, t);
            t.creating  = false;
        });
    });
    $("[preview]").each((i, e) => { imagePreviewSetEvents(e); });
    function watchAutoPager(holder, load) {
        $(holder).each((i, e) => {
            var countDefer = 0;
            var timerDefer;
            let observer = new MutationObserver(ml => ml.filter(m => m.type === 'childList').forEach(m => m.addedNodes.forEach(() => {
                countDefer = 0;
                if (!timerDefer) timerDefer = setInterval(() => {
                    if (countDefer < 2) {
                        countDefer++;
                        return;
                    }
                    clearInterval(timerDefer);
                    timerDefer = null;
                    if (load) load();
                }, 1000);
            })));
            observer.observe(e, {childList: true, subtree: true});
        });
    }
    watchAutoPager("body", () => {
        appendPreview();
        $("[preview]").each((i, e) => { imagePreviewSetEvents(e); });
    });
}