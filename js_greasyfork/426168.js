// ==UserScript==
// @name           Pixiv Faview
// @namespace      https://solact.blogspot.com/
// @version        0.2
// @description    Automatically adds links to your favorite works on a specific artist page(/users/xxxxxxxx).
// @description:ja 作者ごとの作品一覧ページ(/users/xxxxxxxx)で、自分がお気に入りに追加した作品へのリンクを自動で追加します。
// @author         Solact
// @include        https://www.pixiv.net/*
// @match          https://www.pixiv.net/*
// @license        GPL-3.0
// @icon           https://www.google.com/s2/favicons?domain=pixiv.net
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/426168/Pixiv%20Faview.user.js
// @updateURL https://update.greasyfork.org/scripts/426168/Pixiv%20Faview.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // definition
    const i18nLib = {
        'ja': {
            works: '作品',
            illusts_manga: 'イラスト・マンガ',
            favs: 'ブックマーク',
        },
        'en': {
            works: 'Works',
            illusts_manga: 'Illustrations and Manga',
            favs: 'Bookmarks',
        },
        'ko': {
            works: '작품',
            illusts_manga: '일러스트・만화',
            favs: '북마크',
        },
        'zh-cn': {
            works: '作品',
            illusts_manga: '插画·漫画',
            favs: '收藏',
        },
        'zh-tw': {
            works: '作品',
            illusts_manga: '插畫·漫畫',
            favs: '收藏',
        },
    };
    const i18n = key => i18nLib[lang][key];

    const debug = false;
    const debugMsg = (...str) => debug ? console.log(str) : '';

    // main code
    const lang = document.documentElement.getAttribute('lang').toLowerCase();
    if (!lang) {
        throw new Error('pixiv lang not found');
        return;
    }

    // initialize
    let prevHref, prevUrlUserID;
    let bookmarksCount, $bookmarksNode;
    let isOnUserPage, rewriteDone;

    const mainLoop = setInterval(async () => {

        if (location.href != prevHref) {
            // page changed (SPA)
            debugMsg('location.href changed', location.href);
            prevHref = location.href;
            if (!location.href.match(/users\/(\d+)/) || location.href.match(/users\/(\d+)\/bookmarks/)) {
                // not on pixiv.net/users/xxx
                // ignore pixiv.net/users/xxx/bookmarks
                debugMsg("not on an artist's user page");
                isOnUserPage = false;
                return;
            }
            const urlUserID = location.href.match(/users\/(\d+)/)[1];
            if (urlUserID != prevUrlUserID) {
                let profileAllJson, profileIdsJsonBodyWorks = {};

                // user id changed
                debugMsg('urlUserID changed', urlUserID);
                prevUrlUserID = urlUserID;

                // get an artist's all works
                profileAllJson = await fetch(`/ajax/user/${urlUserID}/profile/all?lang=${lang}`).then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('pixiv API [/ajax/user/UID/profile/all] failed');
                    }
                });
                let illustIds = Object.keys({ ...profileAllJson.body.illusts, ...profileAllJson.body.manga });
                while (illustIds.length) {
                    const illustIdsRemaining = illustIds.splice(100); // default 48, maximum approved 100
                    const params = { 'work_category': 'illust', 'is_first_page': 1, 'lang': lang };
                    const qs = new URLSearchParams(params);
                    for (const id of illustIds) {
                        qs.append('ids[]', id);
                    }
                    // get details of an artist's all works
                    const tmpJson = await fetch(`/ajax/user/${urlUserID}/profile/illusts?${qs}`).then(res => {
                        if (res.ok) {
                            return res.json();
                        } else {
                            throw new Error('pixiv API [/ajax/user/UID/profile/illusts] failed');
                        }
                    });
                    profileIdsJsonBodyWorks = { ...profileIdsJsonBodyWorks, ...tmpJson.body.works };

                    illustIds = illustIdsRemaining;
                }
                // bookmarksCount = parseInt(profileAllJson.body.bookmarkCount.public.illust) + parseInt(profileAllJson.body.bookmarkCount.public.novel);
                bookmarksCount = 0;
                $bookmarksNode = document.createElement('ul');
                for (const [id, val] of Object.entries(profileIdsJsonBodyWorks)) {
                    if (val.bookmarkData) {
                        // found a work which you liked
                        const url = `https://www.pixiv.net/artworks/${id}`;
                        const $a = document.createElement('a');
                        $a.setAttribute('href', url);
                        $a.innerHTML = val.title;
                        $a.style.color = 'red';
                        const $li = document.createElement('li');
                        $li.appendChild($a);
                        $bookmarksNode.appendChild($li);
                        bookmarksCount++;
                    }
                }
                debugMsg('bookmarksCount', bookmarksCount);
                debugMsg('$bookmarksNode', $bookmarksNode);

                // we have to set this flag here or we'll get (Bookmarks:undefined)
                // because the next 1000ms timer will start rewriting before $bookmarksNode is prepared
                isOnUserPage = true;
            }
            else {
                debugMsg('urlUserId not changed');
                isOnUserPage = true;
            }
            rewriteDone = false;
        }

        if (!isOnUserPage || rewriteDone) {
            // return if we're not on an artist's user page
            // return if we're on an artist's user page and we've finished rewriting
            return;
        }

        // wait for target and rewrite it
        debugMsg('wait for target');
        for (const $elem of document.querySelectorAll("h2")) {
            if ($elem.innerHTML == i18n('illusts_manga') || $elem.innerHTML == i18n('works')) {
                // add fav count like Illustrations and Manga(Bookmarks: xxx)
                $elem.innerHTML += `(${i18n('favs')}: ${bookmarksCount})`;

                // add fav list after fav count with red title
                const insertAfter = (referenceNode, newNode) => {
                    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                };
                insertAfter($elem.parentNode.parentNode.parentNode, $bookmarksNode);

                debugMsg('rewriting');
                rewriteDone = true;
            }
        }
    }, 1000);
})();

