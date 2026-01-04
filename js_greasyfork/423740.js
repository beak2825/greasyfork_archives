// ==UserScript==
// @name         show-magnet
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  show magnet link under the result item
// @author       kakapo

// @match        *://*/*

// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues

// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/linq@3.2.3/linq.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.10.4/dayjs.min.js
// @downloadURL https://update.greasyfork.org/scripts/423740/show-magnet.user.js
// @updateURL https://update.greasyfork.org/scripts/423740/show-magnet.meta.js
// ==/UserScript==

/* globals jQuery, $, Enumerable, dayjs */
'use strict';

$(() => {
    let linq = Enumerable;

    let ctx = {};
    let conf = {};
    ctx.handlers = [];

    ctx.init = () => {
        let pageUrl = $(location).attr("href");
        let arr = linq.from(ctx.handlers).where(t => t.key.test(pageUrl)).toArray();
        if (arr.length > 0) {
            ctx.prepare();
            for (const t of arr) {
                try {
                    t.exec();
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    ctx.prepare = () => {
        conf.now = dayjs();
        conf.tryCount = 3;
        conf.tryTimeout = 100;
        ctx.cleanValues();
    }

    ctx.showValues = () => {
        for (let val of GM_listValues()) {
            console.log(val);
        }
    }

    ctx.getValue = (tag, key) => {
        return GM_getValue(`${tag}:${key}`);
    }

    ctx.setValue = (tag, key, val) => {
        GM_setValue(`${tag}:${key}`, val);
    }

    ctx.cleanValues = () => {
        let keys = GM_listValues();
        let datas = linq.from(keys).select(key => { return { key, val: GM_getValue(key) } });
        datas.where(t => !ctx.isValidInfo(t.val)).forEach(t => GM_deleteValue(t.key));
    }

    ctx.isValidInfo = info => {
        return info && conf.now.diff(dayjs(info.create_at), 'month') < 1 && ctx.isValidLink(info.link);
    }

    ctx.isValidLink = link => {
        return link && link.startsWith('magnet:?');
    }

    ctx.addHandler = handler => {
        ctx.handlers.push(handler);
    }

    ctx.requestUrl = (url, on_done, on_fail) => {
        let t = {};
        t.count = conf.tryCount;
        t.on_done = html => {
            on_done(html);
        }
        t.on_fail = () => {
            if (t.count == 0) {
                console.warn(`get ${url} failed...`);
                if (on_fail) {
                    on_fail(url);
                }
            } else {
                console.warn(`${t.count} try ${url} failed...`);
                t.count -= 1;
                setTimeout(t.get, conf.tryTimeout);
            }
        }
        t.get = () => {
            $.get(url).done(t.on_done).fail(t.on_fail);
        };
        t.get();
    }

    ctx.addCopyAllLink = (el, links) => {
        if (!el) {
            return;
        }
        let a = $(`<a style="cursor: pointer;">拷贝所有链接</a>`);
        a.on('click', () => {
            let s = linq.from(links).toJoinedString('\n');
            GM_setClipboard(s);
        });
        el.append(a);
    }

    ctx.addMagnetLink = (href, links, el, link, cache) => {
        let p = $(`<p>`);
        el.append(p);
        let a = $(`<a href="${link}">${link}</a>`);
        a.on('click', () => GM_setClipboard(link));
        el.append(a);
        links.push(link);
        if (cache) {
            return;
        }
        let info = {};
        info.create_at = dayjs();
        info.href = href;
        info.link = link;
        ctx.setValue('magnet', href, info);
    }

    ctx.addErrorTip = el => {
        let p = $(`<p>`);
        el.append(p);
        let div = $(`<div>获取链接失败</div>`);
        el.append(div);
    }

    ctx.addHandler({
        key: /clg\d+\./g,
        exec: () => {
            let items = $('#Search_list_wrapper > li');
            let links = [];
            ctx.addCopyAllLink($('#Search_container > div.Search_box > div.Search_nav'), links);
            linq.from(items.toArray()).forEach(t => {
                let title = $('a.SearchListTitle_result_title', t);
                if (!title) {
                    return;
                }
                let anchor = $('div.Search_list_info', t);
                let href = title.prop('href');
                let info = ctx.getValue('magnet', href);
                if (info) {
                    ctx.addMagnetLink(href, links, anchor, info.link, true);
                    return;
                }
                ctx.requestUrl(href, html => {
                    let root = $(html);
                    let link = $('a.Information_magnet', root).prop('href');
                    if (ctx.isValidLink(link)) {
                        ctx.addMagnetLink(href, links, anchor, link);
                    } else {
                        ctx.addErrorTip(anchor);
                    }
                }, () => {
                    ctx.addErrorTip(anchor);
                });
            });
        },
    });

    ctx.addHandler({
        key: /eclzz\./g,
        exec: () => {
            let items = $('div.search-item');
            let links = [];
            ctx.addCopyAllLink($('#sort-bar'), links);
            linq.from(items.toArray()).forEach(t => {
                let title = $('div.item-title a', t);
                if (!title) {
                    return;
                }
                let anchor = $(t);
                let href = title.prop('href');
                let info = ctx.getValue('magnet', href);
                if (info) {
                    ctx.addMagnetLink(href, links, anchor, info.link, true);
                    return;
                }
                ctx.requestUrl(href, html => {
                    let root = $(html);
                    let link = $('#m_link', root).prop('value');
                    if (ctx.isValidLink(link)) {
                        ctx.addMagnetLink(href, links, anchor, link);
                    } else {
                        ctx.addErrorTip(anchor);
                    }
                }, () => {
                    ctx.addErrorTip(anchor);
                });
            });
        },
    });

    ctx.addHandler({
        key: /cilichong\./g,
        exec: () => {
            let items = $('li.hash-name');
            let links = [];
            ctx.addCopyAllLink($('div.hash-info'), links);
            linq.from(items.toArray()).forEach(t => {
                let title = $('a', t);
                if (!title) {
                    return;
                }
                let anchor = $(t);
                let href = title.prop('href');
                let info = ctx.getValue('magnet', href);
                if (info) {
                    ctx.addMagnetLink(href, links, anchor, info.link, true);
                    return;
                }
                ctx.requestUrl(href, html => {
                    let root = $(html);
                    let link = $('a.magnet-download', root).prop('href');
                    if (ctx.isValidLink(link)) {
                        ctx.addMagnetLink(href, links, anchor, link);
                    } else {
                        ctx.addErrorTip(anchor);
                    }
                }, () => {
                    ctx.addErrorTip(anchor);
                });
            });
        },
    });

    ctx.init();
});
