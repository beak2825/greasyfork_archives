// ==UserScript==
// @name         ゲオ宅配レンタル・ぽすれん
// @namespace    https://greasyfork.org/morca
// @version      0.11
// @description  ゲオ宅配レンタル・ぽすれんの総合評価でフィルターする
// @author       morca
// @match        https://rental.geo-online.co.jp/*
// @match        https://posren.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/390062/%E3%82%B2%E3%82%AA%E5%AE%85%E9%85%8D%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB%E3%83%BB%E3%81%BD%E3%81%99%E3%82%8C%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/390062/%E3%82%B2%E3%82%AA%E5%AE%85%E9%85%8D%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB%E3%83%BB%E3%81%BD%E3%81%99%E3%82%8C%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const posren = /^https:\/\/posren\.com\/\.*/.test(location.href) === true;
    function getCookie(name, dfl) {
        let value = GM_getValue(name);
        if (value) return value;
        return dfl;
    }
    function setCookie(name, value) {
        GM_setValue(name, value);
    }
    function time(f, ...args) {
        let start = performance.now();
        let r = f(...args);
        console.log(f.name + ": " + parseInt(performance.now() - start) + "us");
        return r;
    }
    var autoPagerElem = typeof wrapElem !== "undefined" && wrapElem || "#searchResultWrapper";
    function filterRate() {
        let select = document.getElementById("rateSelector");
        if (!select) return;
        let select2 = document.getElementById("rateSelector2");
        if (!select2) return;
        let low = select.options[select.selectedIndex].value;
        let high = select2.options[select2.selectedIndex].value;
        if (low > high) {
            high = select.options[select.selectedIndex].value;
            low = select2.options[select2.selectedIndex].value;
        }
        if (getCookie("filterEnabled", "0") == 0) {
            low = 0;
            high = 5;
        }
        Array.prototype.slice.call(document.getElementsByClassName("rate")).forEach(item => {
            let outer;
            if (posren) {
                if (item.getAttribute("star") == "true") {
                    outer = item.parentNode.parentNode.parentNode;
                } else {
                    outer = item.parentNode;
                }
            } else {
                if (item.getAttribute("star") == "true") {
                    outer = item.parentNode.parentNode.parentNode;
                } else {
                    outer = item.parentNode.parentNode;
                }
            }
            let val = item.getAttribute("value");
            if (low == 0) {
                outer.style.display = (val !== null && (val < low || high < val)) ? "none" : "block";
            } else {
                outer.style.display = (val === null || (val < low || high < val)) ? "none" : "block";
            }
        });
        posTop = $(autoPagerElem).height() + $(autoPagerElem).position().top + 50;//for autoPager
    }
    function onChangeRate(name, value) {
        setCookie(name, value);
        filterRate();
    }
    function appendRateForm() {
        let outer;
        if (posren) {
            outer = document.getElementById("refineSearch");
        } else {
            outer = document.getElementById("keywordSearch");
        }
        if (!outer) return;
        let form = document.createElement("form");
        if (posren) {
            let h3 = document.createElement("h3");
            h3.innerHTML = "総合評価で絞り込む";
            let div = document.createElement("div");
            div.setAttribute("class", "rightRoupe");
            div.appendChild(h3);
            outer = outer.previousSibling.previousSibling;
            outer.parentNode.insertBefore(div, outer);
            form.style.borderBottom = "1px solid #34679a";
            form.style.padding = "4px 8px";
            form.style.background = "#f5f5f5";
        } else {
            let h4 = document.createElement("h4");
            h4.innerHTML = "総合評価で絞り込む";
            outer.parentNode.insertBefore(h4, outer);
            form.style.borderBottom = "1px solid #ccc";
            form.style.padding = "5px 0";
            form.style.background = "#fff";
            form.style.textAlign = "center";
        }
        function createSelect() {
            let select = document.createElement("select");
            for (let i = 9; i <= 50; i++) {
                let ii = "0" + i;
                ii = ii.substr(ii.length - 2, 2);
                ii = ii.substr(0, 1) + "." + ii.substr(1, 2);
                let option = document.createElement("option");
                if (i <= 9) {
                    option.setAttribute("value", "0.0");
                    option.innerHTML = "0.0点";
                } else {
                    option.setAttribute("value", ii);
                    option.innerHTML = ii + "点";
                }
                select.appendChild(option);
            }
            return select;
        }
        let select = createSelect();
        select.id = "rateSelector";
        select.selectedIndex = getCookie("filterRate", "0");
        select.addEventListener("change", function() { onChangeRate("filterRate", select.selectedIndex); }, false);
        form.appendChild(select);
        form.appendChild(document.createTextNode("～"));
        let select2 = createSelect();
        select2.id = "rateSelector2";
        select2.selectedIndex = getCookie("filterRate2", "5");
        select2.addEventListener("change", function() { onChangeRate("filterRate2", select2.selectedIndex); }, false);
        form.appendChild(select2);
        form.appendChild(document.createTextNode(" "));
        let check = document.createElement('input');
        check.type = "checkbox";
        check.id = "rateEnabled";
        check.checked = getCookie("filterEnabled", "0") != 0;
        check.addEventListener("change", function() { onChangeRate("filterEnabled", check.checked ? "1" : "0"); }, false);
        form.appendChild(check);
        outer.parentNode.insertBefore(form, outer);
    }
    appendRateForm();
    function getGeoDetail(id, each, last, error, retry) {
        if (retry === undefined) retry = 0;
        $.ajax({ type: "get", url: "/json/cb_products_detail", data: "id=" + [id].join("-"), dataType: "json" }).done(result => {
            let details = result.cb_products_detail;
            if (!details || Object.keys(details).length === 0) {
                console.log("empty", id);
                if (error) error();
            } else {
                for (let id in details) {
                    if (each) each(id, details[id]);
                }
            }
            if (last) last();
        }).fail(() => {
            if (retry > 0) {
                console.log("retry", id);
                getGeoDetail(id, each, last, error, retry - 1);
            } else {
                console.log("error", id);
                if (error) error();
            }
        });
    }
    function appendRateNodes() {
        let items;
        let star = false;//whether item already has star bar
        if (posren) {
            items = $("div.imageBox > a.dvdImage2Wrapper, div.imageBox > a.cdImage2Wrapper");
            if (items.length === 0) {
                items = $("div.titleSection > div.title > a[href]").filter(function(i) {
                    return $(this).parent().parent().find(".rating").length == 1;
                });
                star = true;
            }
        } else {
            items = $("a.productTitleCut");
            if (items.length === 0) {
                items = $("li.item_box > div.info > div.title > h3 > a[href]").filter(function(i) {
                    return $(this).parent().parent().parent().find(".date_rate").length == 1;
                });
                star = true;
            }
        }
        items = Array.prototype.slice.call(items);
        let remain = 0;
        let rateNodes = [];
        for (let item of items) {
            let div = document.createElement("span");
            div.className = "rate";
            if (posren) {
                if (star) {
                    div.setAttribute("star", "true");
                    if ($(item).parent().parent().find(".rate").length) continue;
                   $(item).parent().parent().children().first().append(div);
                } else {
                    div.setAttribute("star", "false");
                    if ($(item).parent().find(".rate").length) continue;
                    $(item).parent().children().last().before(div);
                }
            } else {
                if (star) {
                    div.setAttribute("star", "true");
                    if ($(item).parent().parent().parent().find(".rate").length) continue;
                    $(item).parent().parent().next().append(div);
                } else {
                    div.setAttribute("star", "false");
                    if ($(item).parent().parent().hasClass("productOutFrame")) {
                        if ($(item).parent().parent().find(".rate").length) continue;
                        $(item).parent().parent().append(div);
                    } else {
                        if ($(item).parent().parent().parent().find(".rate").length) continue;
                        $(item).parent().parent().parent().children().last().before(div);
                    }
                }
            }
            let href = item.getAttribute("href");
            if (href === null) continue;
            let m = /\/detail-([0-9]+)\.html$/.exec(href);
            if (m === null) continue;
            let id = m[1];
            if (!rateNodes[id]) rateNodes[id] = [];
            rateNodes[id].push(div);
            remain++;
        }
        Object.keys(rateNodes).forEach(id => {
            getGeoDetail(id, (id, detail) => {
                let rate = detail.rating_avg;
                let star = detail.stars_avg;
                rateNodes[id].forEach(n => {
                    n.setAttribute("value", rate);
                    if (posren) {
                        if (n.getAttribute("star") == "true") {
                            n.parentNode.style.width = "100px";
                            n.innerHTML = `<span class="px12"> (${rate})</span>`;
                        } else {
                            n.innerHTML = `<div class="px12"><img src="/img/cmn/icon/icon_star${star}.gif" width="56" height="12" alt="${rate}"> (${rate})</div>`;
                        }
                    } else {
                        if (n.getAttribute("star") == "true") {
                            n.innerHTML = ` (${rate})`;
                        } else {
                            n.innerHTML = `<center><img src="/pc/img/detail/star_rate_0${star}.gif" width="80" alt="${rate}"> (${rate})</center>`;
                        }
                    }
                    if (remain > 0) remain--;
                });
            }, () => { if (remain <= 0) filterRate(); }, () => { if (remain > 0) remain--; }, 1);
        });
    }
    time(appendRateNodes);
    function appendPreview() {
        $("img").each((i, e) => {
            if (e.parentNode.classList.contains("preview")) return;
            let src = $(e).attr("src");
            if (/\/(.+\/)?cdn\/.+\/[1-4]\.jpg(\?.*)?$/.test(src)) {
                src = src.replace(/\/[1-4]\.jpg(\?.*)?$/, "/4.jpg");
                $(e).parent().addClass("preview").attr("src", src);
            } else if (/\/sample\/[sml]\/.+\/...\.jpg$/.test(src)) {
                src = src.replace(/\/sample\/[sml]\//, "/sample/l/");
                $(e).parent().addClass("preview").attr("src", src);
            }
        });
        $("a").each((i, e) => {
            if (e.classList.contains("preview")) return;
            let href = $(e).attr("href");
            if (/^(?:[^/]+:\/\/[^/]+)?(?:\/[^/]+)?\/detail-[0-9]+\.html(\?.+)?$/.test(href)) {
                $(e).addClass("preview");
            } else if (/^https?:\/\/dsp00\.deqwas\.net\/recommend\/choice\.aspx\?.+&rp=[^&]+/.test(href)) {
                $(e).addClass("preview");
            } else {
                let rel = $(e).attr("rel");
                if (/\/(.+\/)?cdn\/.+\/[1-4]\.jpg(\?.*)?$/.test(rel)) {
                    rel = rel.replace(/\/[1-4]\.jpg(\?.*)?$/, "/4.jpg");
                    $(e).addClass("preview").attr("src", rel);
                } else if (/\/sample\/[sml]\/.+\/...\.jpg$/.test(rel)) {
                    rel = rel.replace(/\/sample\/[sml]\//, "/sample/l/");
                    $(e).addClass("preview").attr("src", rel);
                }
            }
        });
    }
    time(appendPreview);
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
                + " z-index: 10001;"//foreground
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
            if (!node.classList.contains("preview")) return;
            if (unbind) {
                $(node).removeClass("preview");
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
                    if (srcs != srcs0) $(`.preview[src="${srcs0}"]`).attr("src", srcs);
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
        let id = href.match(/\/detail-[0-9]+\.html$/)[0].match(/[0-9]+/)[0];
        getGeoDetail(id, (id, detail) => {
            let rating = detail.rating_avg;
            let title = t.getAttribute("title");
            title = (title && `${title} ` || "") + `(${rating})`;
            t.setAttribute("title", title);
        });
    });
    $(".preview").each((i, e) => { imagePreviewSetEvents(e); });
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
    watchAutoPager("#deqwasBox, #deqwasWrapper, .newSliderBox", () => {
        time(appendPreview);
        $(".preview").each((i, e) => { imagePreviewSetEvents(e); });
    });
    watchAutoPager(autoPagerElem, () => {
        time(appendRateNodes);
        time(appendPreview);
        $(".preview").each((i, e) => { imagePreviewSetEvents(e); });
    });
})();
