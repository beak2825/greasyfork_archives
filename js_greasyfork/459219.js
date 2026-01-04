// ==UserScript==
// @name         KinoBox Player for Shikimori
// @name:ru      Плеер для Шикимори
// @version      1.1
// @license      GPL-3.0-or-later
// @description  Зайдите на страницу с аниме и нажмите F5
// @description:ru  Зайдите на страницу с аниме и нажмите F5 / Shikimori видео плеер прямо на сайте. Все доступные озвучки.
// @author       MjKey
// @match        https://shikimori.one/animes/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shikimori.one
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/519758
// @downloadURL https://update.greasyfork.org/scripts/459219/KinoBox%20Player%20for%20Shikimori.user.js
// @updateURL https://update.greasyfork.org/scripts/459219/KinoBox%20Player%20for%20Shikimori.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // API KINOBOX.TV START
    function Kinobox(n, t) {
        this.baseUrl = new URL(t.baseUrl || "https://kinobox.tv/");
        this.container = n instanceof Object ? n : document.querySelector(n);
        this.params = t;
        this.params.view = t.view || {};
        this.params.view.defaultMenu = t.view.defaultMenu || "menuList";
        this.params.view.mobileMenu = t.view.mobileMenu || "menuButton";
        this.params.view.format = t.view.format || "{N} :: {T} ({Q})";
        this.params.view.limit = t.view.limit || null;
        this.params.hide = t.hide || [];
        this.params.order = t.order || [];
        this.params.params = t.params || {};
        this.players = [];
        this.state = {
            isMenuOpen: !1
        }
    }
    Kinobox.isMobile = "ontouchstart" in document.documentElement || window.screen.width < 500;
    Kinobox.prototype.log = function(n, t) {
        if (t)
            for (var i in t) n = n.replace("{" + i + "}", t[i]);
        console.info("[Kinobox] " + n)
    };
    Kinobox.prototype.request = function(n, t) {
        var i = new XMLHttpRequest,
            r;
        i.onload = function() {
            if (i.status === 200) t(i.response);
            else i.onerror(null)
        };
        i.onerror = function() {
            console.error("Error " + i.status + ": " + i.statusText + "\n" + i.response);
            t(i.response)
        };
        r = "";
        i.open("GET", n + r);
        i.send()
    };
    Kinobox.prototype.init = function() {
        var n = this,
            t, i;
        this.log("Initializing");
        t = document.createElement("link");
        t.rel = "stylesheet";
        i = this.baseUrl;
        i.pathname = "kinobox.min.css";
        t.href = i.toString();
        document.head.appendChild(t);
        typeof CSS != "undefined" && CSS.supports("aspect-ratio", "1/1") || (this.container.style.height = this.container.offsetWidth / 1.777777 + "px", this.container.style.maxHeight = this.container.offsetHeight + "px");
        n.buildMain();
        this.log("Searching");
        this.request(this.getSearchUrl(), function(t) {
            try {
                var i = JSON.parse(t);
                if (!i) {
                    n.showMessage("Error loading data.");
                    return
                }
                if (i.message) {
                    n.showMessage(i.message);
                    return
                }
                if (i.length === 0) {
                    n.showMessage("Видео не найдено.");
                    return
                }
                n.players = i;
                n.buildMenu();
                n.selectPlayer(1)
            } catch (r) {
                console.error(r);
                n.showMessage("Error loading data.")
            }
        })
    };
    Kinobox.prototype.getSearchUrl = function() {
        var n = new URLSearchParams,
            t;
        return this.params.token && n.set("token", this.params.token), this.params.search.kinopoisk && n.set("kinopoisk", this.params.search.kinopoisk), this.params.search.imdb && n.set("imdb", this.params.search.imdb), this.params.search.title && n.set("title", this.params.search.title), this.params.search.query && n.set("query", this.params.search.query), t = this.baseUrl, t.pathname = "api/players/main", t.search = n.toString(), t.toString()
    };
    Kinobox.prototype.buildMain = function() {
        this.container.innerHTML = "";
        this.wrapper = document.createElement("div");
        this.wrapper.className = "kinobox__wrapper";
        this.container.appendChild(this.wrapper);
        this.message = document.createElement("div");
        this.message.className = "kinobox__message kinobox__hidden";
        this.wrapper.appendChild(this.message);
        this.iframeWrapper = document.createElement("div");
        this.iframeWrapper.className = "kinobox__iframeWrapper";
        this.wrapper.appendChild(this.iframeWrapper);
        this.nav = document.createElement("nav");
        this.nav.className = "kinobox__nav";
        this.wrapper.appendChild(this.nav)
    };
    Kinobox.prototype.buildMenu = function() {
        var n = this,
            t;
        this.ul = document.createElement("ul");
        this.nav.appendChild(this.ul);
        this.buttonMenu = document.createElement("button");
        this.nav.appendChild(this.buttonMenu);
        Kinobox.isMobile ? this.nav.classList.add(this.params.view.mobileMenu) : this.nav.classList.add(this.params.view.defaultMenu);
        this.nav.classList.contains("menuList") && this.touch();
        this.params.view.open && this.showMenu(!0);
        this.ul.addEventListener("mouseenter", function() {
            n.nav.classList.contains("menuList") && n.showMenu(!0)
        });
        this.ul.addEventListener("mouseleave", function() {
            n.nav.classList.contains("menuList") && n.showMenu(!1)
        });
        this.buttonMenu.addEventListener("click", function() {
            n.showMenu(!n.state.isMenuOpen)
        });
        t = this.players;
        this.params.hide.length > 0 && (t = this.players.filter(function(t) {
            return n.params.hide.includes(t.source.toLowerCase()) === !1
        }));
        this.params.order.length > 0 && (t = t.sort(function(t, i) {
            return n.params.order.indexOf(i.source.toLowerCase()) === -1 ? -99 : n.params.order.indexOf(t.source.toLowerCase()) - n.params.order.indexOf(i.source.toLowerCase())
        }));
        t.forEach(function(t, i) {
            var u = (i + 1).toString(),
                r = document.createElement("li");
            r.dataset.number = u;
            r.dataset.url = n.getIframeUrl(t.iframeUrl, t.source, n.params.params);
            r.title = "{N}. {T} ({Q})".replace("{N}", u).replace("{T}", t.translation || "-").replace("{Q}", t.quality || "-");
            r.innerHTML = n.params.view.format.replace("{N}", u).replace("{S}", t.source).replace("{T}", t.translation || "-").replace("{Q}", t.quality || "-");
            n.ul.appendChild(r);
            r.addEventListener("click", function() {
                n.log("Switch to player: {number}, {source}", {
                    number: r.dataset.number,
                    source: t.source
                });
                [].forEach.call(n.ul.querySelectorAll("li"), function(n) {
                    n.classList.remove("active")
                });
                r.classList.add("active");
                n.showIframe(r.dataset.url)
            })
        });
        this.hotkeys()
    };
    Kinobox.prototype.getIframeUrl = function(n, t, i) {
        var u, r;
        if (n = new URL(n), t = t.toLowerCase(), u = new URLSearchParams(n.search), i.hasOwnProperty("all"))
            for (r in i.all) u.set(r, i.all[r]);
        if (i.hasOwnProperty(t))
            for (r in i[t]) u.set(r, i[t][r]);
        return n.search = u, n.toString()
    };
    Kinobox.prototype.touch = function() {
        function s(t) {
            i = {
                x: t.changedTouches[0].clientX,
                y: t.changedTouches[0].clientY
            };
            u = {
                x: i.x,
                y: i.y
            };
            n = 0;
            r = !1
        }
    
        function h(o) {
            if (o.preventDefault(), o.stopImmediatePropagation(), !r)
                if (u = {
                        x: o.changedTouches[0].clientX,
                        y: o.changedTouches[0].clientY
                    }, n = u.x - i.x, n = Math.abs(n), n > 0 && n < 70) t.style.marginRight = (f ? -1 : 1) * n + "px", r = !1;
                else return f ? e.showMenu(!1) : e.showMenu(!0), t.style.marginRight = "0px", n = 0, r = !0, f = !f, null
        }
    
        function o() {
            t.style.marginRight = "0px";
            i = null;
            u = null;
            n = 0;
            r = !0
        }
        var e = this,
            t = this.container.querySelector("ul");
        t.addEventListener("touchstart", s);
        t.addEventListener("touchmove", h);
        t.addEventListener("touchend", o);
        t.addEventListener("touchcancel", o);
        var i = null,
            u = null,
            n = 0,
            r = !0,
            f = !1
    };
    Kinobox.prototype.hotkeys = function() {
        var n = this;
        document.addEventListener("keypress", function(t) {
            var r = t.target.parentNode.firstElementChild.tagName,
                i, u;
            r !== "INPUT" && r !== "TEXTAREA" && (i = parseInt(t.key), i ? n.selectPlayer(i) : t.key === "x" ? n.showMenu(!0) : t.key === "z" ? n.showMenu(!1) : !1 && (u = document.querySelector("iframe"), u.contentWindow.focus()))
        })
    };
    Kinobox.prototype.showMessage = function(n) {
        n ? (this.message.textContent = n, this.message.classList.remove("kinobox__hidden")) : (this.message.textContent = "", this.message.classList.add("kinobox__hidden"))
    };
    Kinobox.prototype.showMenu = function(n) {
        this.state.isMenuOpen = n;
        n ? this.ul.classList.add("active") : this.ul.classList.remove("active")
    };
    Kinobox.prototype.showIframe = function(n) {
        var i = this,
            t, r;
        this.log("Loading iframe: {url}", {
            url: n
        });
        t = document.createElement("iframe");
        t.className = "kinobox__iframe";
        t.allowFullscreen = !0;
        t.frameBorder = "0";
        t.src = n;
        i.iframeWrapper.innerHTML = "";
        i.iframeWrapper.appendChild(t);
        r = Date.now();
        t.addEventListener("load", function() {
            i.log("Iframe loaded in {time} ms: {url}", {
                time: Date.now() - r,
                url: t.src
            })
        })
    };
    Kinobox.prototype.selectPlayer = function(n) {
        if (this.ul) {
            var i = '[data-number="{id}"]'.replace("{id}", n),
                t = this.ul.querySelector(i);
            t && t.click()
        }
    };
    // API KINOBOX.TV END
    let player = document.createElement("div")
    player.style.width = "100%"
    player.style.margin_bottom = "4%"
    player.className = "kinobox_player"
    let tit = document.getElementsByClassName('head')[0].getElementsByTagName('meta')[0].content
    document.getElementsByClassName('c-about')[0].appendChild(player)
    new Kinobox('.kinobox_player', {search: {title: tit}}).init()
    let author = document.createElement("div")
    author.className = "author_script"
    author.innerHTML = '<p>Поддержать автора скрипта: <a href="https://mjkey.ru/donate">MjKey</a> | Приятного просмотра &#128156;</p>';
    $('.kinobox_player').before(author);
    //фиксы
    $(".c-about .cc").css('margin-bottom', '0');
    $(".kinobox_player").css('margin-bottom', '4%');
    $(".author_script").css('font-family', 'var(--font-main)');
    $(".author_script").css('color', '#7b8084');
})()

//API Kinobox.tv/api