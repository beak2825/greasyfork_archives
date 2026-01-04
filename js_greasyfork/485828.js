// ==UserScript==
// @name         Bangumi-More-CH
// @namespace    chitanda
// @description  Show Chinese episode name in episode page and Chinese character name in character page
// @version      0.0.8
// @homepage     https://github.com/NeKoOuO/bangumiscripts
// @homepage     https://greasyfork.org/scripts/485828-bangumi-more-ch
// @include      /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/(ep|subject)\/\d+/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/485828/Bangumi-More-CH.user.js
// @updateURL https://update.greasyfork.org/scripts/485828/Bangumi-More-CH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Chinese episode name in episode page
    if (window.location.pathname.includes('/ep/')) {
        const subject = $('h1.nameSingle a').attr('href').match(/\/subject\/(\d+)/)[1];
        const episode = window.location.href.match(/\/ep\/(\d+)/)[1];

        async function writeTitle() {
            const title = episodes.getTitle(episode);
            $('h2.title').append(`<small><a class="l" onclick="(function(){localStorage.removeItem('${STORAGE_PREFIX}${subject}');window.location.reload();})()" href="#">[刷新中文名缓存]</small>`);
            if (title !== '') {
                $('h2.title').append(` / ${title} <small`);
                document.title = document.title.replace(/ \/ /, ` | ${title} / `);
            }
        }

        async function writeEpisodeList() {
            const list = $('.sideEpList li a');
            for (let i = 0; i < list.length; i++) {
                const liId = (list[i].href.match(/ep\/(\d+)/) || [-1, -1])[1];
                const liTitle = episodes.getTitle(liId);
                if (liTitle !== '') list[i].innerHTML += ' / ' + liTitle;
            }
        }

        const STORAGE_PREFIX = `binota_bec_`;
        const storage = new (function(driver) {
            this._storage = driver;

            this.set = function(key, value) {
                this._storage.setItem(`${STORAGE_PREFIX}${key}`, value);
                return value;
            };

            this.get = function(key) {
                return this._storage.getItem(`${STORAGE_PREFIX}${key}`);
            };

            this.remove = function(key) {
                this._storage.removeItem(`${STORAGE_PREFIX}${key}`);
                return key;
            };
        })(localStorage);

        const episodes = new (function(storage, id) {
            const subject = (JSON.parse(storage.get(id)) || {});

            this.getTitle = function(episode) {
                return subject[episode] || '';
            };

            this.setTitle = function(episode, title) {
                return subject[episode] = title.trim();
            };

            this.save = function() {
                return storage.set(id, JSON.stringify(subject));
            };
        })(storage, subject);

        if (storage.get(subject)) {
            writeTitle();
            writeEpisodeList();
        } else {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bgm.tv/subject/${subject}?responseGroup=large`,
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    for (const ep of data.eps) {
                        if (ep.id == episode) {
                            writeTitle();
                        }
                        episodes.setTitle(ep.id, ep.name_cn);
                    }
                    episodes.save();
                    writeEpisodeList();
                }
            });
        }
    }

    // Chinese character name in character page
    else if (window.location.pathname.includes('/subject/')) {
        const charas = $('#columnCrtRelatedA ul#crtRelateSubjects  li.old');

        (async () => {
            const subid = window.location.href.match(/\d+/g)[0];
            const url = `https://bgm.tv/subject/${subid}/characters`;
            const charaPage = await getResBody(url);
            for (let i = 0; i < charas.length; i++) {
                const chara = charas.eq(i).find('.title');
                const charaName = chara.text().trim();
                const chsName = $(charaPage).find(`h2:contains(${charaName})`).find('span.tip').text().replace('/', '').trim();
                if (chsName) {
                    chara.find('a').text(chsName);
                }
            }
        })();

        async function getResBody(url, ua) {
            let res = await get(url, undefined, ua);
            let body;
            if (res) {
                body = res.responseText;
                return body;
            } else {
                console.error(`链接${url}返回40x，无法正常访问`);
            }
        }

        async function baseGet(url, type, ua) {
            if (!type) {
                type = 'document';
            }
            if (ua) {
                ua = "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36''Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36";
            } else {
                ua = undefined;
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'get',
                    url: url,
                    headers: {
                        'User-Agent': ua,
                        'Referer': url
                    },
                    responseType: type,
                    onload: function(res) {
                        if (res.status == 200) {
                            return resolve(res);
                        } else if (res.status.toString().startsWith('50')) {
                            reject(res);
                        } else {
                            resolve(res);
                            return false;
                        }
                    }
                });
            });
        }

        async function get(url, type, ua) {
            return baseGet(url, type, ua).catch(function(err) {
                if (err) {
                    return get(url, type, ua);
                }
            });
        }
    }
})();
