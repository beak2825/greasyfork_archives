// ==UserScript==
// @name           MangaLib helper
// @version        0.0.4
// @description    Улучшение UX и функционала для сайта
// @icon           https://mangalib.me/icons/android-icon-192x192.png?333
// @match          https://mangalib.me/*
// @match          https://senkuro.com/*
// @match          https://readmanga.live/*
// @match          https://mangabuff.ru/*
// @grant          unsafeWindow
// @grant          GM.xmlHttpRequest
// @grant          GM_cookie
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_getResourceText
// @grant          GM_addStyle
// @run-at         document-end
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @namespace      https://greasyfork.org/users/728771
// @downloadURL https://update.greasyfork.org/scripts/496800/MangaLib%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/496800/MangaLib%20helper.meta.js
// ==/UserScript==
GM_addStyle(`.link-wrapper {
    position: relative;
    padding-right: 16px;
}

.link-wrapper.fade a {
    pointer-events: none;
    opacity: 0.7;
}

.link-wrapper span {
    position: absolute;
    right: 0;
    top: calc(50% - 10px);
    cursor: pointer;
}`);

(() => {
    const oldPushState = history.pushState;
    history.pushState = function pushState() {
        const ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    const oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        const ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });

    $.fn.extend({
        serializeJSON: function (exclude) {
            exclude || (exclude = []);
            return _.reduce(this.serializeArray(), function (hash, pair) {
                pair.value && !(pair.name in exclude) && (hash[pair.name] = pair.value);
                return hash;
            }, {});
        }
    });
})();

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) return resolve(document.querySelector(selector));

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

class CustomPromise {
    constructor(executor, timeout, defaultValue) {
        this.promise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                resolve(defaultValue); // Возвращаем дефолтное значение
            }, timeout);

            executor(resolve, reject).finally(() => clearTimeout(timer));
        });
    }

    then(onFulfilled, onRejected) {
        return this.promise.then(onFulfilled, onRejected);
    }

    catch(onRejected) {
        return this.promise.catch(onRejected);
    }
}

class DB {
    static websites = {
        SENKURO: 'senkuro',
        MANGABUFF: 'mangabuff',
        READMANGA: 'readmanga',
        MANGALIB: 'mangalib',
    };

    static milliseconds = 3600000;

    static _isExpired(data) {
        return data?._expiresAfter && Date.now() >= data._expiresAfter;
    }

    static _generateExpireDate(value) {
        if (!value) return false;
        if (value === true) return this.milliseconds + Date.now();
        if (!isNaN(value)) return +value + Date.now();
    }

    /**
     *
     * @param website
     * @param slug
     * @param prop
     * @param defaultValue
     * @param getExpired
     * @returns {Promise<data|defaultValue>}
     */
    static async get(website, slug, prop, defaultValue = null, getExpired = false) {
        const websiteData = await GM.getValue(website, {});
        const data = _.get(websiteData, [slug, prop], defaultValue);
        if (!getExpired && this._isExpired(data)) return defaultValue;
        return data && Object.hasOwn(data, '_value') ? data._value : data;
    }

    /**
     *
     * @param website
     * @param slug
     * @param prop
     * @param data
     * @param expiryMilliseconds
     * @returns {Promise<data>}
     */
    static async set(website, slug, prop, data, expiryMilliseconds = false) {
        const oldData = await GM.getValue(website, {});
        if (typeof data !== 'object') data = {_value: data};
        data._expiresAfter = this._generateExpireDate(expiryMilliseconds);
        const newData = _.set(oldData, [slug, prop], data);
        await GM.setValue(website, newData);
        return data && Object.hasOwn(data, '_value') ? data._value : data;
    }

    static async getAndDelete(website, slug, prop, defaultValue = null, getExpired = false) {
        const data = this.get(website, slug, prop, defaultValue, getExpired);
        await this.delete(website, slug, prop);
        return data;
    }

    static async delete(website, slug, prop) {
        const oldData = await GM.getValue(website, {});
        if (_.unset(oldData, [slug, prop])) {
            await GM.setValue(website, oldData);
        }
        return true;
    }

    static async flushExpired() {
        const websites = await GM.listValues();
        for (const website of websites) {
            const data = await GM.getValue(website);
            for (const slug in data) {
                for (const prop in data[slug]) {
                    if (this._isExpired(data)) _.unset(data, [slug, prop]);
                }
            }
            await GM.setValue(website, data);
        }
    }

    static async flushDB() {
        return Promise.all((await GM.listValues()).map(key => GM.deleteValue(key)));
    }

    static async _getCache(website, slug) {
        return await DB.getAndDelete(website, slug, `invalidate`) ? false : await this.get(website, slug, 'cache');
    }
}

class API {
    static links = {
        SENKURO: (slug) => `https://senkuro.com/manga/${slug}/chapters`,
        READMANGA: (slug) => `https://readmanga.live/${slug}#chapters-list`,
        MANGABUFF: (slug) => `https://mangabuff.ru/manga/${slug}`,
    };

    static hosts = {
        MANGALIB: 'mangalib.me',
        SENKURO: 'senkuro.com',
        READMANGA: 'readmanga.live',
        MANGABUFF: 'mangabuff.ru',
    };

    static prepareResponse(urlFunc, slug, chapter, lastChapterRead) {
        return {url: urlFunc(slug), slug, chapter, lastChapterRead};
    }

    static async senkuro(slug, titles) {
        const websiteSlug = await DB.get(DB.websites.MANGALIB, slug, DB.websites.SENKURO);
        if (websiteSlug === false) return false;
        const cache = await DB._getCache(DB.websites.SENKURO, websiteSlug);
        if (cache) return this.prepareResponse(this.links.SENKURO, websiteSlug, cache.chapter, cache.lastChapterRead);

        const slugs = websiteSlug ? [websiteSlug] : await new CustomPromise(resolve => {
            //const symbolic = titles.filter(title => !/[a-zа-я]/i.test(title.toLowerCase()));
            return GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.senkuro.com/graphql",
                data: `{"extensions":{"persistedQuery":{"sha256Hash":"a2ccb7472c4652e21a7914940cce335683d37abdecccfeb6bbf9674e0a5bda80","version":1}},"operationName":"search","variables":{"query":"${/*symbolic.length ? symbolic[0] : */titles[1]}","type":"MANGA"}}`,
                onload: async response => {
                    const data = JSON.parse(response.responseText);
                    const slugs = [];
                    let entity = data.data.search.edges.find(entity => {
                        slugs.push(entity.node.slug);
                        const entityTitles = [entity.node.originalName, ...entity.node.titles.map(title => title.content)];
                        return entityTitles.filter(value => titles.includes(value)).length;
                    });
                    return resolve(entity?.node.slug ? [entity.node.slug] : slugs);
                }
            });
        }, 5000);
        for (const entitySlug of slugs) {
            const data = await this._senkuroDetails(entitySlug);
            if (data?.manga.alternativeNames.map(name => titles.includes(name.content))) {
                await DB.set(DB.websites.SENKURO, data.manga.slug, 'cache', {
                    chapter: data.chapter,
                    lastChapterRead: data.lastChapterRead,
                }, true);
                await DB.set(DB.websites.MANGALIB, slug, DB.websites.SENKURO, data.manga.slug);
                return this.prepareResponse(this.links.SENKURO, data.manga.slug, data.chapter, data.lastChapterRead);
            }
        }

        return DB.set(DB.websites.MANGALIB, slug, DB.websites.SENKURO, false, true);
    }

    static async _senkuroDetails(slug) {
        return new CustomPromise(resolve => {
            let headers = {};
            if (tokens.SENKURO) headers = {"authorization": `Bearer ${tokens.SENKURO}`};
            return GM_xmlhttpRequest({
                method: "POST",
                url: `https://api.senkuro.com/graphql`,
                data: `{"extensions":{"persistedQuery":{"sha256Hash":"a44132a9483c73f8db43edf8d171c8e108de93ad3c990148f8474ffc546901e9","version":1}},"operationName":"fetchManga","variables":{"slug": "${slug}"}}`,
                headers,
                onload: function (response) {
                    const data = JSON.parse(response.responseText);
                    const manga = data?.data?.manga;
                    if (!manga) return resolve();
                    const chapter = Math.max(...manga.branches.map(branch => branch.primaryTeamActivities?.[0].ranges?.map(range => range.end)).flat()) || manga.chapters;
                    const lastChapterRead = +manga.viewerBookmark?.number || 0;
                    return resolve({
                        chapter,
                        lastChapterRead: lastChapterRead > chapter ? chapter : lastChapterRead,
                        manga
                    });
                }
            });
        }, 5000, {});
    }

    static async mangabuff(slug, titles) {
        let websiteSlug = await DB.get(DB.websites.MANGALIB, slug, DB.websites.MANGABUFF);
        if (websiteSlug === false) return false;
        const cache = await DB._getCache(DB.websites.MANGABUFF, websiteSlug);
        if (cache) return this.prepareResponse(this.links.MANGABUFF, websiteSlug, cache.chapter, cache.lastChapterRead);

        if (!websiteSlug) {
            websiteSlug = await new CustomPromise(resolve => {
                return GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://mangabuff.ru/search/suggestions?q=${titles[1]}`,
                    onload: async response => {
                        const data = JSON.parse(response.responseText);
                        const entity = data.find(entity => titles.includes(entity.name));
                        return resolve(entity?.slug);
                    }
                });
            }, 5000);
        }
        if (websiteSlug) {
            const {chapter, lastChapterRead} = await this._mangabuffDetails(websiteSlug);
            if (chapter) {
                await DB.set(DB.websites.MANGABUFF, websiteSlug, 'cache', {
                    chapter,
                    lastChapterRead,
                }, true);
                await DB.set(DB.websites.MANGALIB, slug, DB.websites.MANGABUFF, websiteSlug);
                return this.prepareResponse(this.links.MANGABUFF, websiteSlug, chapter, lastChapterRead);
            }
        }

        return DB.set(DB.websites.MANGALIB, slug, DB.websites.MANGABUFF, false, true);
    }

    static async _mangabuffDetails(slug) {
        return new CustomPromise(resolve => {
            return GM_xmlhttpRequest({
                method: "GET",
                url: this.links.MANGABUFF(slug),
                onload: async response => {
                    return resolve({
                        chapter: $(response.responseText).find('.hot-chapters__wrapper .hot-chapters__number').eq(0)[0]?.firstChild.nodeValue.trim(),
                        lastChapterRead: await DB.get(DB.websites.MANGABUFF, slug, `lastChapterRead`, 0)
                    });
                }
            });
        }, 5000, {});
    }

    static async readmanga(slug, titles) {
        let websiteSlug = await DB.get(DB.websites.MANGALIB, slug, DB.websites.READMANGA);
        if (websiteSlug === false) return false;
        const cache = await DB._getCache(DB.websites.READMANGA, websiteSlug);
        if (cache) return this.prepareResponse(this.links.READMANGA, websiteSlug, cache.chapter, cache.lastChapterRead);

        if (!websiteSlug) {
            websiteSlug = await new CustomPromise(resolve => {
                return GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://readmanga.live/search/suggestion?query=${titles[0]}`,
                    onload: async response => {
                        const data = JSON.parse(response.responseText);
                        const websiteSlug = data.suggestions.find(suggestion => titles.filter(value => [suggestion.value, ...suggestion.names || []].includes(value)).length)?.link.replace('/', '');
                        return resolve(websiteSlug);
                    }
                });
            }, 5000);
        }

        if (websiteSlug) {
            const {chapter, lastChapterRead} = await this._readmangaDetails(websiteSlug);
            if (chapter) {
                await DB.set(DB.websites.READMANGA, websiteSlug, 'cache', {
                    chapter,
                    lastChapterRead,
                }, true);
                await DB.set(DB.websites.MANGALIB, slug, DB.websites.READMANGA, websiteSlug);
                return this.prepareResponse(this.links.READMANGA, websiteSlug, chapter, lastChapterRead);
            }
        }

        return DB.set(DB.websites.MANGALIB, slug, DB.websites.READMANGA, false, true);
    }

    static async _readmangaDetails(slug) {
        return new CustomPromise(resolve => {
            return GM_xmlhttpRequest({
                method: "GET",
                url: this.links.READMANGA(slug),
                onload: async response => {
                    return resolve({
                        chapter: $(response.responseText).find('.chapters tr a').length,
                        lastChapterRead: 0
                    });
                }
            });
        }, 5000, {});
    }

    static requesters = {
        SENKURO: this.senkuro.bind(API),
        MANGABUFF: this.mangabuff.bind(API),
        READMANGA: this.readmanga.bind(API)
    };

    static getSlugFromURL(website, url) {
        try {
            if (url && !url.includes(this.hosts[website])) return '';
            return this._urlParsers[website](url);
        } catch (e) {
            return '';
        }
    }

    static _urlParsers = {
        SENKURO: (url) => new URL(url).pathname.match(/[^\/]+/g)[1],
        MANGABUFF: (url) => new URL(url).pathname.match(/[^\/]+/g)[1],
        READMANGA: (url) => new URL(url).pathname.match(/[^\/]+/g)[0],
    };
}

class Mangalib {
    // language=HTML
    static dropdownDOM = `
        <div class='dropdown button_block'>
            <button class='dropbtn button button_primary button_block'>
                Открыть на сайте
                <i class='fa fa-caret-down'></i>
            </button>
            <div class='dropdown-content media-info-list paper'></div>
        </div>
    `;
    // language=HTML
    static modalDOM = `
        <div class="modal" id="edit-link-modal">
            <div class="modal__inner">
                <div class="modal__content" data-size="small">
                    <div class="modal__header">
                        <div class="modal__title text-center">Изменить ссылку</div>
                        <div class="modal__close" data-close-modal>
                            <svg class="modal__close-icon">
                                <use xlink:href="#icon-close"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="modal__body">
                        <form>
                            <div class="form__field">
                                <div class="form__label flex justify_between align-items_end">
                                    <span>Ссылка на произведение</span>
                                </div>
                                <input type="url" name="link" class="form__input" placeholder="Ссылка на произведение"/>
                            </div>
                            <div class="form__footer">
                                <button class="button button_md button_green button_save" type="submit"
                                        data-close-modal>
                                    <i class="fa fa-floppy-o far fa-save fa-fw"></i>
                                    Сохранить
                                </button>
                                <button class="button button_md button_red button_clean" data-close-modal>
                                    <i class="fa fa-trash-o far fa-trash-alt fa-fw fa-sm"></i>
                                    Удалить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    static async mangaPage() {
        await waitForElm('.media-name__main');

        const slug = new URL(unsafeWindow.location).pathname.match(/[^\/]+/g)[0];
        const titles = [
            $('.media-name__main').text().trim(),
            $('.media-name__alt').text().trim(),
            ...$('.media-info-list__item_alt-names .media-info-list__value div').toArray().map(function (i) {
                return i.innerText;
            })
        ];
        const teamsWrapper = $('.media-chapters-teams');
        const tab = $('.tabs__item[data-key="chapters"]');
        let lastChapter = 0;
        let team;

        if (teamsWrapper.length) {
            const teams = teamsWrapper.find('.team-list-item');
            for (const node of teams.toArray()) {
                const vue = node.__vue__;
                const propsData = vue.$options.propsData;
                const isSubscribed = propsData.branch.is_subscribed;
                const lastTeamChapter = propsData.lastCreatedChapters[propsData.branch.id].chapter_number;
                if (isSubscribed || lastChapter < lastTeamChapter) {
                    lastChapter = lastTeamChapter;
                    team = node;
                    if (isSubscribed) break;
                }
            }
        } else lastChapter = $('.media-chapters .media-chapters-list .media-chapter')[0]?.['__vue__'].$options.propsData.chapter.chapter_number || 0;

        const state = $('.media-sidebar button').text().trim();
        switch (state) {
            case 'Читаю':
                tab.click();
                $('.media-sidebar button').after(this.dropdownDOM);
                $(".dropdown-content").hide();
                $(".dropbtn").click(() => $(".dropdown-content").toggle());
                let dataArr = await Promise.all(Object.keys(API.requesters).map(async (website) => {
                    const data = (await API.requesters[website](slug, titles)) || {};
                    data.website = _.capitalize(website);
                    return data;
                }));
                dataArr = dataArr.sort((a, b) => {
                    if (!b.chapter) return -1;
                    return b.chapter - a.chapter || b.lastChapterRead - a.lastChapterRead;
                });
                $('.dropdown-content').append(dataArr.map(data => `
                    <div class="link-wrapper ${!data.url ? 'fade' : ''}">
                        <a href="${data.url || '#'}" class="media-info-list__item">
                            ${data.website} | ${data.chapter || '0'} (${data.lastChapterRead || '0'})
                        </a>
                        <span class="edit-link" data-website="${data.website.toUpperCase()}" data-slug="${slug}" data-open-modal="#edit-link-modal">
                            <i class="fa fa-pencil"></i>
                        </span>
                    </div>
                `));
                $(".dropdown-content a").click(() => $(".dropdown-content").hide());
                break;
            case 'Senkuro':
            case 'Readmanga':
            case 'Mangabuff':
                tab.click();
                const data = await API.requesters[state](slug, titles);
                if (data) $('.media-sidebar button').after(`
                    <div class="button button_block link-wrapper">
                        <a href="${data.url || '#'}" class="button button_block button_primary">
                            ${state} | ${data.chapter || '0'} (${data.lastChapterRead || '0'})
                        </a>
                        <span class="edit-link" data-website="${state.toUpperCase()}" data-slug="${slug}" data-open-modal="#edit-link-modal">
                            <i class="fa fa-pencil"></i>
                        </span>
                    </div>`);
        }
        $('.page-modals').append(this.modalDOM);
        $('.edit-link').on('click', async function (e) {
            const modal = $('#edit-link-modal');
            modal.data('website', $(this).data('website')).data('slug', $(this).data('slug'));

            const websiteSlug = await DB.get(DB.websites.MANGALIB, slug, DB.websites[$(this).data('website')]);
            modal.find('input').val(websiteSlug ? API.links[$(this).data('website')](websiteSlug) : '');
        });

        $('#edit-link-modal .button_save').on('click', async function (e) {
            const data = $('#edit-link-modal').data();
            const fields = {...{link: ''}, ...$(e.target.form).serializeJSON()};

            if (fields.link) fields.link = API.getSlugFromURL(data.website, fields.link);
            await DB.set(DB.websites.MANGALIB, slug, DB.websites[data.website], fields.link);
            unsafeWindow.location.reload();
        });
        $('#edit-link-modal .button_clean').on('click', async function (e) {
            const data = $('#edit-link-modal').data();
            await DB.delete(DB.websites.MANGALIB, slug, DB.websites[data.website]);
            unsafeWindow.location.reload();
        });

        tab.text(`${tab.text()} | ${lastChapter}`);
        setTimeout(() => $(team).click(), 100);
    }

    static async chapterPage() {
        $(window).scroll(function () {
            const scrolledTo = window.scrollY + window.innerHeight;
            const isReachBottom = document.body.scrollHeight === scrolledTo;
            if (isReachBottom) {
                $('.reader-bookmark').not(".is-marked").click();
                $('.reader-next__btn.button_label_right')[0]?.click();
            }
        });
    }
}

const tokens = {};
if (!unsafeWindow.$) unsafeWindow.$ = $;
unsafeWindow.GM_xmlhttpRequest = GM.xmlHttpRequest;

$(unsafeWindow.document).ready(() => {
    (async () => {
        await DB.flushExpired();

        const host = unsafeWindow.location.host;
        const path = new URL(unsafeWindow.location).pathname.replace(/^\//, '');
        switch (host) {
            case API.hosts.MANGALIB:
                tokens.SENKURO = await DB.get(DB.websites.SENKURO, '_GLOBAL', `token`, '');
                if (!path.includes('/')) await Mangalib.mangaPage();
                else if (path.match(/v\d+\/c\d+/)) await Mangalib.chapterPage();
                break;
            case API.hosts.SENKURO:
                GM_cookie.list({name: "access_token"}, async (cookies, error) => {
                    await DB.set(DB.websites.SENKURO, '_GLOBAL', `token`, cookies?.[0]?.value);
                });

                const setInvalidateCache = async () => {
                    const path = new URL(unsafeWindow.location).pathname.replace(/^\//, '');
                    if (path.match(/chapters\/\d+\/pages\/\d+/g)) {
                        const slug = path.match(/[^\/]+/g)[1]
                        await DB.set(DB.websites.SENKURO, slug, 'invalidate', true);
                    }
                }

                await setInvalidateCache();
                window.addEventListener('locationchange', setInvalidateCache);
                break;
            case API.hosts.MANGABUFF:
                const history = JSON.parse(localStorage.getItem('history')) || [];
                const slug = path.match(/[^\/]+/g)[1];
                const existingVisit = history.find(visit => visit.slug === slug);
                await DB.set(DB.websites.MANGABUFF, slug, 'invalidate', true);
                if (existingVisit) await DB.set(DB.websites.MANGABUFF, slug, 'lastChapterRead', +existingVisit.chapter);
                break;
            default:
                console.log('NOT IMPLEMENTED');
        }
    })()
});

