// ==UserScript==
// @name         JavDB Infinite Scroll
// @namespace    https://sleazyfork.org/
// @version      1.0.0
// @license      MIT
// @description  提取自 javdb_infinite_scroll.user.js 的無限滾動功能，適用於 JavDB 網站
// @author       Roo (原作者 Hobby)
// @include      *://*javdb*.com/*
// @require      https://lib.baomitu.com/jquery/2.2.4/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529145/JavDB%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/529145/JavDB%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 多线程异步队列 依赖 jQuery 1.8+
     * @param {Number} n 正整数, 线程数量
     */
    function Queue(n) {
        n = parseInt(n, 10);
        return new Queue.prototype.init((n && n > 0) ? n : 1);
    }

    Queue.prototype = {
        init: function (n) {
            this.threads = [];
            this.taskList = [];
            while (n--) {
                this.threads.push(new this.Thread());
            }
        },
        push: function (callback) {
            if (typeof callback !== 'function') return;
            var index = this.indexOfIdle();
            if (index != -1) {
                this.threads[index].idle(callback);
            } else {
                this.taskList.push(callback);
                for (var i = 0, l = this.threads.length; i < l; i++) {
                    ((thread, self, id) => {
                        thread.idle(() => {
                            if (self.taskList.length > 0) {
                                let promise = self.taskList.shift()();
                                return promise.promise ? promise : $.Deferred().resolve().promise();
                            } else {
                                return $.Deferred().resolve().promise();
                            }
                        });
                    })(this.threads[i], this, i);
                }
            }
        },
        indexOfIdle: function () {
            var threads = this.threads,
                thread = null,
                index = -1;
            for (var i = 0, l = threads.length; i < l; i++) {
                thread = threads[i];
                if (thread.promise.state() === 'resolved') {
                    index = i;
                    break;
                }
            }
            return index;
        },
        Thread: function () {
            this.promise = $.Deferred().resolve().promise();
            this.idle = (callback) => {
                this.promise = this.promise.then(callback);
            };
        }
    };
    Queue.prototype.init.prototype = Queue.prototype;

    var thirdparty = {
        waterfallScrollInit: () => {
            var w = new thirdparty.waterfall({});
            var $pages4 = $('.movie-list.v.cols-4.vcols-8 .item, .movie-list.v.cols-4.vcols-5 .item, .movie-list.h.cols-4.vcols-8 .item, .movie-list.h.cols-4.vcols-5 .item');
            if ($pages4.length) {
                GM_addStyle(`
                    .container {max-width: inherit !important;}
                    .tags {display: block !important;}
                    .tag.hobby {display: block; float: right; color: #fff; line-height: 2em;}
                `);
                $pages4[0].parentElement.id = "waterfall";
                w = new thirdparty.waterfall({
                    next: '.pagination .pagination-next',
                    item: '.movie-list.v.cols-4.vcols-8 .item, .movie-list.v.cols-4.vcols-5 .item, .movie-list.h.cols-4.vcols-8 .item, .movie-list.h.cols-4.vcols-5 .item',
                    cont: '#waterfall',
                    pagi: '.pagination',
                });
            }
            if (GM_getValue('scroll_status', 1) > 0) {
                document.addEventListener('scroll', w.scroll.bind(w));
                document.addEventListener('wheel', w.wheel.bind(w));
            }
        },
        waterfall: function (selectorcfg = {}) {
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
            this.queue = new Queue(1);
            this.page_queue = new Queue(1);
            this.lock = new Lock();
            this.baseURI = this.getBaseURI();
            this.selector = {
                next: 'a.next',
                item: '',
                cont: '#waterfall',
                pagi: '.pagination',
            };
            Object.assign(this.selector, selectorcfg);
            this.pagegen = this.fetchSync(location.href);
            this.anchor = $(this.selector.pagi)[0];
            this._count = 0;
            this._1func = (cont, elems) => {
                cont.empty().append(elems);
            };
            this._2func = (cont, elems) => {
                cont.append(elems);
            };
            if ($(this.selector.item).length) {
                this.appendElems(this._1func);
            }
        }
    };

    thirdparty.waterfall.prototype.getBaseURI = function () {
        let _ = location;
        return `${_.protocol}//${_.hostname}${(_.port && `:${_.port}`)}`;
    };
    thirdparty.waterfall.prototype.getNextURL = function (href) {
        let a = document.createElement('a');
        a.href = href;
        return `${this.baseURI}${a.pathname}${a.search}`;
    };
    thirdparty.waterfall.prototype.fetchURL = function (url) {
        console.log(`fetchUrl = ${url}`);
        let status = 404;
        const fetchwithcookie = fetch(url, { credentials: 'same-origin' });
        return fetchwithcookie.then(response => {
            status = response.status;
            return response.text();
        }).then(html => new DOMParser().parseFromString(html, 'text/html'))
        .then(doc => {
            let $doc = $(doc);
            let elems = [];
            let nextURL;
            if (status < 300) {
                let href = $doc.find(this.selector.next).attr('href');
                nextURL = href ? this.getNextURL(href) : undefined;
                elems = $doc.find(this.selector.item);
                for (const elem of elems) {
                    const links = elem.getElementsByTagName('a');
                    for (const link of links) {
                        link.target = "_blank";
                    }
                }
                if ($(this.selector.item).length && (this._count !== 0) && url === nextURL) {
                    if ($(`#waterfall>div>a[href="${$(elems[0]).find('a.box')[0].attr('href')}"]`).length > 0) {
                        nextURL = undefined;
                        elems = [];
                    }
                }
            } else {
                nextURL = $doc.url;
            }
            return { nextURL, elems };
        });
    };
    thirdparty.waterfall.prototype.fetchSync = function* (urli) {
        let url = urli;
        do {
            yield new Promise((resolve, reject) => {
                if (this.lock.locked) {
                    reject();
                } else {
                    this.lock.lock();
                    resolve();
                }
            }).then(() => {
                return this.fetchURL(url).then(info => {
                    url = info.nextURL;
                    return info.elems;
                });
            }).then(elems => {
                this.lock.unlock();
                return elems;
            }).catch(() => {});
        } while (url);
    };
    thirdparty.waterfall.prototype.appendElems = function () {
        let nextpage = this.pagegen.next();
        if (!nextpage.done) {
            nextpage.value.then(elems => {
                const cb = (this._count === 0) ? this._1func : this._2func;
                cb($(this.selector.cont), elems);
                this._count += 1;
            });
        }
        return nextpage.done;
    };
    thirdparty.waterfall.prototype.end = function () {
        document.removeEventListener('scroll', this.scroll.bind(this));
        document.removeEventListener('wheel', this.wheel.bind(this));
        let $end = $(`<h1>The End</h1>`);
        $(this.anchor).replaceWith($end);
    };
    thirdparty.waterfall.prototype.reachBottom = function (elem, limit) {
        return (elem.getBoundingClientRect().top - $(window).height()) < limit;
    };
    thirdparty.waterfall.prototype.scroll = function () {
        this.pageQueuePush();
    };
    thirdparty.waterfall.prototype.wheel = function () {
        this.pageQueuePush();
    };
    thirdparty.waterfall.prototype.pageQueuePush = function () {
        this.page_queue.push(() => {
            let defer = $.Deferred();
            new Promise(resolve => {
                if (this.reachBottom(this.anchor, 1200) && this.appendElems(this._2func)) {
                    this.end();
                }
                resolve();
            }).then(() => {
                setTimeout(() => {
                    defer.resolve();
                }, 500);
            });
            return defer.promise();
        });
    };

    thirdparty.waterfallScrollInit();
})();