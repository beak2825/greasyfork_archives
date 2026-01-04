// ==UserScript==
// @name         PuTao Helper
// @name:zh-CN   葡萄助理
// @supportURL   http://github.com/tete1030/putao-helper
// @homepageURL  http://github.com/tete1030/putao-helper
// @namespace    http://github.com/tete1030
// @version      1.04
// @description  展示豆瓣分数，连续页面加载
// @author       Te Qi
// @match        http*://pt.sjtu.edu.cn/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.douban.com
// @run-at       document-start
// @note         2018.02.01-V1.0
// @note         2018.02.02-V1.01  修复Safari浏览器支持
// @note         2018.02.02-V1.02  修复表头错位
// @note         2018.02.02-V1.03  支持“候选”栏；末页处理；修复bug
// @note         2018.02.02-V1.04  修复末页bug
// @downloadURL https://update.greasyfork.org/scripts/38059/PuTao%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/38059/PuTao%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 是否开启豆瓣评分加载
    const enable_douban = true;
    // 是否开启连续翻页
    const enable_pageless = true;
    const pagebar_color = "#020089";

    const douban_apikey = "0b2bdeda43b5688921839c8ecb20399b";

    const debug = false;
    function mylog() {
        if(debug) {
            console.log.apply(this, arguments);
        }
    }

    class Lock {
        constructor(d = false) {
            this.locked = d;
        }
        lock() {
            this.locked = true;
        }
        unlock() {
            this.locked = false;
        }
    }

    let PageWaterfall = (function () {
        function waterfall(selectorcfg = {}, start_callback=null){
            this.lock = new Lock();
            this.baseURI = this.getBaseURI();

            this.selector = {
                next: 'a.next',
                item: '',
                cont: '',
                pagi: '.pagination'
            };
            Object.assign(this.selector, selectorcfg);
            let href = $(this.selector.next).attr('href');
            this.nextURL = href ? this.getNextURL(href) : undefined;
            this.pagegen = this.fetchSync(this.nextURL, start_callback, this.selector.cont);
            this.anchor = $(this.selector.pagi)[0];
            this._count = 0;
            this._callback = function(cont, result) {
                let elems = result.elems;
                cont.append(elems);
            };

            if ($(this.selector.item).length) {
                document.addEventListener('scroll', this.scroll.bind(this));
                document.addEventListener('wheel', this.wheel.bind(this));
            }
        }
        waterfall.prototype.getBaseURI = function() {
            let _ = location;
            return `${_.protocol}//${_.hostname}${(_.port && `:${_.port}`)}`;
        };
        waterfall.prototype.getNextURL= function(href) {
            let a = document.createElement('a');
            a.href = href;
            return `${this.baseURI}${a.pathname}${a.search}`;
        };
        waterfall.prototype.fetchURL= function(url) {
            mylog(`fetchUrl = ${url}`);
            if(url) {
                const fetchwithcookie = fetch(url, { credentials: 'same-origin' });
                return fetchwithcookie
                    .then(response => response.text())
                    .then(html => new DOMParser().parseFromString(html, 'text/html'))
                    .then(doc => {
                    let $doc = $(doc);
                    let href = $doc.find(this.selector.next).attr('href');
                    let nextURL = href ? this.getNextURL(href) : undefined;
                    let elems = $doc.find(this.selector.item);
                    return {
                        nextURL,
                        elems
                    };
                });
            } else {
                return new Promise((resolve, reject) => {resolve({nextURL: undefined, elems: undefined});});
            }
        };
        waterfall.prototype.fetchSync= function* (urli, start_callback, cont) {
            let url = urli;
            do {
                yield new Promise((resolve, reject) => {
                    if (this.lock.locked) {
                        reject();
                    } else {
                        this.lock.lock();
                        let start_callback_result;
                        if(start_callback) {
                            start_callback_result = start_callback($(cont));
                        }
                        resolve(start_callback_result);
                    }
                }).then((start_callback_result) => {
                    return this.fetchURL(url)
                        .then(info => {
                        let result = {url: url, elems: info.elems, start_callback_result: start_callback_result};
                        url = info.nextURL;
                        return result;
                    });
                }).then(result => {
                    this.lock.unlock();
                    return result;
                }).catch((err) => {
                    // Locked!
                    if(err) {
                        console.error(err);
                    }
                });
            } while (url);
        };
        waterfall.prototype.appendElems= function () {
            let nextpage = this.pagegen.next();
            if (!nextpage.done) {
                nextpage.value.then(result => {
                    if(result) {
                        this._callback($(this.selector.cont), result);
                        this._count += 1;
                    }
                });
            }
            return nextpage.done;
        };
        waterfall.prototype.end= function () {
            mylog('Page End');
            document.removeEventListener('scroll', this.scroll.bind(this));
            document.removeEventListener('wheel', this.wheel.bind(this));
        };
        waterfall.prototype.reachBottom=function(elem, limit) {
            return (elem.getBoundingClientRect().top - $(window).height()) < limit;
        };

        waterfall.prototype.scroll=function() {
            if (this.reachBottom(this.anchor, 200) && this.appendElems()) {
                this.end();
            }
        };

        waterfall.prototype.wheel= function() {
            if (this.reachBottom(this.anchor, 200) && this.appendElems()) {
                this.end();
            }
        };
        waterfall.prototype.setCallback = function(f) {
            this._callback = f;
        };

        return waterfall;
    })();

    function getURL_GM(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status >= 200 && response.status < 400)
                    callback(response.responseText);
                else
                    console.error('Error getting ' + url + ': ' + response.statusText);
            },
            onerror: function(response) {
                console.error('Error during GM_xmlhttpRequest to ' + url + ': ' + response.statusText);
            }
        });
    }

    function getJSON_GM(url, callback) {
        getURL_GM(url, function(data) {
            callback(JSON.parse(data));
        });
    }

    function getJSON(url, callback) {
        let request = new XMLHttpRequest();
        request.open('GET', url);

        request.onload = function () {
            if (this.status >= 200 && this.status < 400)
                callback(JSON.parse(this.responseText));
            else
                console.error('Error getting ' + url + ': ' + this.statusText);
        };

        request.onerror = function () {
            console.error('Error during XMLHttpRequest to ' + url + 'try again with GM_xmlhttpRequest.');
            getJSON_GM(url, callback);
        };

        request.send();
    }

    function isEmpty(s) {
        return !s || s === 'N/A';
    }

    function addRateCol(elems) {
        elems.each((i,e) => {
            let rate_ele = $("<td class='rowfollow' style='width: auto;'><div style='text-align: left;'>" +
                             "<div name='score'></div>" +
                             "<div name='numrater'></div>" +
                             "</div></td>");
            rate_ele.insertAfter($(e).children().eq(0));
        });
    }

    function loadRate(elems) {
        elems.each((i,e) => {
            if(e.attributes.douban == "1") return;
            e.setAttribute("douban", "1");

            let score_dom = $(e).find("[name='score']")[0];
            let numrater_dom = $(e).find("[name='numrater']")[0];

            if(score_dom == undefined || numrater_dom == undefined) {
                console.error("No score or numrater field found");
                return;
            }

            let cat = $(e).children().eq(0).find("img")[0].attributes.alt.value;
            let title_dom = $(e).children().eq(2).find("a")[0];
            mylog(title_dom);

            if(cat.match(/.+音乐|mp3合辑|游戏|软件|学习|mac|校园原创/)) {
                mylog("Not Movies");
                return;
            }

            let title = title_dom.innerText;
            let match = title.match(/^\s*(?:\[.+\]\s*)*\[(.+)\]/);
            if(match != null) {
                let main_title = match[1].replace(/\s*[第全]\s*(?:[0-9\-]+|[一二三四五六七八九十百\-]+)\s*[集期]/g, "");
                mylog(main_title);
                getJSON_GM('https://api.douban.com/v2/movie/search?count=1&apikey=' + douban_apikey + '&q=' + encodeURIComponent(main_title), function (data) {
                    if (data.code && data.code == 112) {
                        console.error("Douban API rate limit exceed");
                        return;
                    }
                    if (isEmpty(data.count) || isEmpty(data.subjects) || data.count < 1 || data.subjects.length < 1) {
                        mylog(main_title, "No result");
                        return;
                    }
                    let movieid = data.subjects[0].id;
                    getJSON_GM('https://api.douban.com/v2/movie/' + movieid + '?apikey=' + douban_apikey, (data) => {
                        if (data.code && data.code == 112) {
                            console.error("Douban API rate limit exceed");
                            return;
                        }
                        let average = data.rating.average;
                        let num_raters = data.rating.numRaters;
                        let title = data.title + ((data.alt_title == "") ? "" : (" / " + data.alt_title));
                        let year = data.attrs.year;
                        score_dom.innerText = average.toString();
                        numrater_dom.innerText = num_raters.toString();

                        let pos = $(title_dom).siblings("br").last().prev();
                        if(pos.length == 0) {
                            pos = $(title_dom).parent().contents().last();
                        }
                        pos.after("<br><a style='color: #999999' target='_blank' href='https://movie.douban.com/subject/" + movieid + "'>" + title + " / " + year + "</a>");
                    });
                });
            } else {
                console.warn("No Match for", title);
            }
        });
    }

    GM_addStyle(".loadsepbar {background-color: " + pagebar_color + "; color: #ffffff; }");

    $(window).on("load", () => {
        let rows = $("table.torrents > tbody > tr");
        let header = rows.eq(0);
        let body = rows.slice(1);

        if(enable_douban) {
            if(header.attr("douban") != "1") {
                let rate_header = $("<td id='rate_header' class='colhead'><nobr>分数</nobr></td>");
                rate_header.insertAfter(header.children().eq(0));
                header.attr("douban", "1");
            }
            addRateCol(body);
            loadRate(body);
        }

        if(enable_pageless) {
            let w = new PageWaterfall({
                next: '.torrents ~ p:eq(1) > :last',
                item: '.torrents > tbody > tr:gt(0)',
                cont: '.torrents > tbody',
                pagi: '.torrents ~ p:eq(0)'
            }, (cont) => {
                let bar = $("<td colspan='" + (enable_douban ? 10 : 9) + "' class='rowfollow'>正在加载···</td>");
                cont.append($("<tr class='loadsepbar'></tr>").append(bar));
                return bar;
            });

            w.setCallback((cont, result) => {
                let url = result.url;
                let bar = result.start_callback_result;
                let elems = result.elems;

                let match;
                if(url && (match = url.match(/[&\?]page=(\d+)&?/))) {
                    let page_num = (Number(match[1]) + 1).toString();
                    bar[0].innerText = "第" + page_num + "页";
                } else {
                    bar[0].innerText = "无下一页";
                }

                if(elems && elems.length > 0) {
                    if(enable_douban) {
                        addRateCol(elems);
                        loadRate(elems);
                    }
                    cont.append(elems);
                }
            });
        }
    });
})();