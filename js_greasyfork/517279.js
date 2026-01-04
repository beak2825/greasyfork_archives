// ==UserScript==
// @name        azusa_partner
// @namespace   https://greasyfork.org/users/1396048-moeruotaku
// @version     2025.03.16.00
// @description add bgm info to azusa
// @author      moeruotaku
// @license     MIT
// @match       https://azusa.wiki/torrents.php*
// @match       https://zimiao.icu/torrents.php*
// @icon        https://bgm.tv/img/favicon.ico
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @connect     greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/517279/azusa_partner.user.js
// @updateURL https://update.greasyfork.org/scripts/517279/azusa_partner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let table = document.querySelector('.torrents');
    if (!table) return;

    unsafeWindow = unsafeWindow ?? window;

    let first_info = '首次加载将花费较长时间，请耐心等待。。。';
    let error_info = '无法访问数据，请尝试把 greasyfork.org 加入到科学上网列表，并刷新页面。';

    // 扩宽页面。如果不需要该功能，请删除或注释掉这段代码。
    // let mainouter = document.querySelector('.mainouter');
    // let main = document.querySelector('.main');
    // if (mainouter && main && mainouter.parentNode.offsetWidth - mainouter.clientWidth > 600) main.width = (parseInt(main.width, 10) + 400).toString();

    let set_html = (e, h) => e.innerHTML === h || (e.innerHTML = h);
    let bgm_icon = (s) => `<div style="display: inline-block; background-image: url('https://bgm.tv/img/favicon.ico'); background-repeat: no-repeat; background-position: 0 -4px; width: 16px; height: 12px${s}"></div>`;
    let go = async (data, info) => {
        let torrents = Array.from(document.querySelectorAll('.torrents > tbody > tr'));
        for (let i = 0; i < torrents.length; ++i) {
            let tr = torrents[i];

            let add_cover = tr.querySelector('td[name=cover]');
            if (!add_cover) {
                add_cover = document.createElement('td');
                add_cover.setAttribute('name', 'cover');
                tr.insertBefore(add_cover, tr.children[1]); // 添加封面。如果不需要该功能，请删除或注释掉这行代码。
            }

            if (i === 0) {
                add_cover.className = 'colhead';
                add_cover.innerHTML = '封面';
                continue;
            }
            add_cover.className = 'rowfollow nowrap';
            add_cover.valign = 'middle';
            add_cover.style.padding = '0px';

            let a = tr.querySelector('a[href^="details.php"]');
            if (!a) continue;
            let a_id = new URL(a.href, location.href).searchParams.get('id');
            if (!a_id) continue;
            let tds = Array.from(tr.querySelectorAll('.torrentname > tbody > tr > td'));
            if (tds.length === 0) continue;

            let b_id = data.bgm_a2b?.[a_id];
            if (!b_id) {
                let a_cover = data.azusa_covers?.[a_id] ?? data.azusa_covers_realtime?.[a_id];
                if (a_cover) {
                    set_html(add_cover, `<a href="/details.php?id=${a_id}&hit=1" target="_blank"><img class="nexus-lazy-load preview" src="${a_cover}" style="max-width: 46px; max-height: 46px"></a>`);
                }
                continue;
            }

            let b_cover = data.bgm_covers?.[b_id];
            if (b_cover) {
                set_html(add_cover, `<a href="https://bgm.tv/subject/${b_id}" target="_blank"><img class="nexus-lazy-load preview" src="https://lain.bgm.tv/r/400/pic/cover/l/${b_cover}" style="max-width: 46px; max-height: 46px"></a>`);
            }

            let b_score = data.bgm_scores?.[b_id];
            if (b_score !== undefined) {
                let add_score = tr.querySelector('td[name=score]');
                if (!add_score) {
                    add_score = document.createElement('td');
                    add_score.setAttribute('name', 'score');
                    add_score.className = 'embedded';
                    add_score.style.width = '20px';
                    tds[tds.length - 1].parentNode.insertBefore(add_score, tds[tds.length - 1]); // 添加评分。如果不需要该功能，请删除或注释掉这行代码。
                }
                set_html(add_score, `<a href="https://bgm.tv/subject/${b_id}" target="_blank">${bgm_icon('; margin: 0px 2px 2px 2px')}</a><div style="padding-top: 4px; text-align: center">${b_score > 0 ? b_score.toFixed(1) : 'N/A'}</div>`);
            }

            let b_tags = data.bgm_tags?.[b_id];
            if (b_tags) {
                let add_tags = tr.querySelector('div[name=tags]');
                if (!add_tags) {
                    add_tags = document.createElement('div');
                    add_tags.setAttribute('name', 'tags');
                    let td_status = tds[0].querySelector('div');
                    td_status ? tds[0].insertBefore(add_tags, td_status) : tds[0].append(add_tags); // 添加标签。如果不需要该功能，请删除或注释掉这行代码。
                }
                set_html(add_tags, `<a href="https://bgm.tv/subject/${b_id}" target="_blank">${bgm_icon('; vertical-align: text-bottom')}</a>${b_tags}`);
            }
        }

        for (let i = 0; i < 10; ++i) {
            if (!unsafeWindow.azusa_partner_callback) await new Promise((r) => setTimeout(r, 200));
            else { unsafeWindow.azusa_partner_callback?.(data, info ? bgm_icon('; vertical-align: text-bottom; margin-right: 2px') + info : ''); break; }
        }
    };

    let now = Date.now();
    let v2t = (v) => ((vs) => new Date(`${vs[0]}-${vs[1]}-${vs[2]}`).setHours(parseFloat('0.' + vs[3]) * 24, 0, 0))(v.split('.'));
    let GM_fetch = async (url) => new Promise((resolve, reject) => GM_xmlhttpRequest({ method: 'GET', url, onload: resolve, onerror: reject })).then((response) => response.responseText).catch((error) => { throw new Error(`${error_info}当前数据地址：${url}`); });
    let get_version = async (url) => GM_fetch(url).then((text) => /^.*@version +([^\/]+)\/\/.*$/.exec(text.replace(/\n/g, ''))?.[1] || '');
    let get_version_data = async (url) => GM_fetch(url).then((text) => ((r) => (r ? [r[1], JSON.parse(r[2].replace(/  ([0-9]+):/g, '"$1":'))] : ['', {}]))(/^.*@version +([^\/]+)\/\/.*const [\w]+ = (.*);$/.exec(text.replace(/\n/g, ''))));
    let refresh_data = async (n, uid, fid) => {
        let um = `https://update.greasyfork.org/scripts/${uid}/azusa_partner_library_${n}_updates.meta.js?_=${now}`;
        let ur = `https://update.greasyfork.org/scripts/${uid}/azusa_partner_library_${n}_updates.js?_=${now}`;
        let fr = `https://update.greasyfork.org/scripts/${fid}/azusa_partner_library_${n}.js?_=${now}`;
        let d = JSON.parse(localStorage.getItem(n) || '{}');
        let v = d.version;
        if (!v) return [n, d, get_version_data(fr).then(([fv, fd]) => { fd.version = fv; localStorage.setItem(n, JSON.stringify(fd)); return [n, fd]; })];
        return [
            n,
            d,
            get_version(um).then((uv) => {
                if (uv === v) return [n, d];
                return (
                    v2t(uv) - v2t(v) > 5 * 24 * 60 * 60 * 1000 || [1, 16].includes(new Date().getDate()) // 大于5天, 或每月1、16日
                        ? get_version_data(fr).then(([fv, fd]) => ({ ...fd, version: fv }))
                        : get_version_data(ur).then(([uv, ud]) => ({ ...d, ...ud, version: uv }))
                ).then((d) => {
                    localStorage.setItem(n, JSON.stringify(d));
                    return [n, d];
                });
            }),
        ];
    };
    let azusa_covers_realtime = async (p) => GM_fetch(`/waterfall-ajax.php?page=${p}&incldead=1`).then((r) => Object.fromEntries(JSON.parse(r).torrents.map((e) => [e.id, e.cover])));

    Promise.all([
        refresh_data('bgm_a2b', '519040', '517523'), //
        refresh_data('bgm_covers', '519041', '517524'),
        refresh_data('bgm_scores', '519042', '517525'),
        refresh_data('bgm_tags', '519043', '517533'),
        refresh_data('azusa_covers', '529557', '529556'),
        azusa_covers_realtime(1).then((res1) => ['azusa_covers_realtime', res1, azusa_covers_realtime(2).then((res2) => ['azusa_covers_realtime', { ...res1, ...res2 }])]),
    ])
        .then(async (rets) => {
            await go(Object.fromEntries(rets.map(([n, d, p]) => [n, d])), !rets[0][1].version ? first_info : '');
            rets = await Promise.all(rets.map(([n, d, p]) => p));
            await go(Object.fromEntries(rets), '');
        })
        .catch((error) => unsafeWindow.azusa_partner_callback?.({}, error.message));
})();
