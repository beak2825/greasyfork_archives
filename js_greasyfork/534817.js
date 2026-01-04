// ==UserScript==
// @name         Qobuz Linkifier
// @version      0.1.1
// @description  make templates copy links to clipboard
// @author       You
// @match        https://www.qobuz.com/*/shop
// @match        https://www.qobuz.com/*/shop/*/*
// @match        https://www.qobuz.com/*/search*
// @match        https://www.qobuz.com/*/label/*/*/*
// @match        https://www.qobuz.com/*/interpreter/*/*
// @match        https://www.qobuz.com/*/album/*/*
// @match        https://www.qobuz.com/*/playlists/*/*
// @match        https://www.qobuz.com/*/genre/*/*
// @icon         https://www.qobuz.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1465219
// @downloadURL https://update.greasyfork.org/scripts/534817/Qobuz%20Linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/534817/Qobuz%20Linkifier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BASE_URL = 'https://play.qobuz.com/',
        LOAD_MORE_TRACKS_DELAY = 500,
        COPY_MESSAGE_DISPLAY_DURATION = 1500,
        DEFAULT_LOC = { lang: 'en', country: '_' };

    addCustomStyle(`
        .store-wallpaper,
        .album-addtocart,
        .player__ad,
        .store-cart,
        .shop-cart,
        .price-box .price,
        .on-sale {
            display: none !important;
        }

        #store-search {
            padding-right: 0 !important;
            border-right: none !important
        }

        .shop-search {
            margin-right: 16px !important;
        }

        .track__item--button span.pct {
            position: absolute !important;
            top: 8px !important;
            left: 5px !important;
        }

        .catalog-heading__button span.pct {
            margin-right: 18px;
            font-size: 12px;
            font-weight: 700;
        }

        .product__button span.pct {
            left: 11px;
            position: absolute;
        }

        .player__webplayer span.pct {
            margin-right: 8px;
        }

        .player__webplayer span:last-child {
            padding-top: 2px;
        }

        .no-wrap {
            white-space: nowrap !important;
        }

        .color-white {
            color: #FFF !important;
        }
    `);

    const templates = infuseTemplates(window.location.pathname.split('/')[1].split('-').reverse(), {
        en: {
            _: {
                label: 'label',
                artist: 'artist',
                album: 'album',
                playlist: 'playlist',
                track: 'track',
                copyLink: function (type) {
                    return type ? `Copy ${this[type]} link` : 'Copy link'
                },
                copyLinkWithHighlight: function (type) {
                    return `<span class="color-white">Copy</span> ${this[type]} link`
                },
                linkCopied: function (type) {
                    return type ? `${this[type].toTitleCase()} link copied!` : 'Link copied!'
                },
                linkCopiedWithHighlight: function (type) {
                    return `<span class="color-white">${this[type].toTitleCase()} link</span> copied!`
                },
            },
            get uk() { return this._ },
            get ie() { return this._ },
            get us() { return this._ },
            get au() { return this._ },
            get ca() { return this._ },
            get nz() { return this._ },
            get dk() { return this._ },
            get fi() { return this._ },
            get se() { return this._ },
            get no() { return this._ }
        },
        de: {
            _: {
                label: 'Verlag',
                artist: 'Interpret',
                album: 'Album',
                playlist: 'Wiedergabeliste',
                track: 'Titel',
                copyLink: function (type) { return type ? `${this[type]}-Link kopieren` : 'Link kopieren' },
                copyLinkWithHighlight: function (type) {
                    return `<span class="color-white">${this[type]}-Link</span> kopieren`
                },
                linkCopied: function (type) {
                    return type ? `${this[type]}-Link kopiert!` : 'Link kopiert!'
                },
                linkCopiedWithHighlight: function (type) {
                    return `<span class="color-white">${this[type]}-Link</span> kopiert!`
                },
            },
            get de() { return this._ },
            get at() { return this._ },
            get ch() { return this._ },
            get lu() { return this._ }
        },
        /*         es: {
                    _: {
        
                    },
                    get es() { return this._ },
                    get mx() { return this._ },
                    get ar() { return this._ },
                    get cl() { return this._ },
                    get co() { return this._ }
                },
                pt: {
                    get pt() { return this._ },
                    get br() { return this._ }
                },
                nl: {
                    get nl() { return this._ },
                    get be() { return this._ }
                },
                fr: {
                    get fr() { return this._ },
                    get ch() { return this._ },
                    get lu() { return this._ },
                    get be() { return this._ },
                    get ca() { return this._ }
                },
                it: {
                    get it() { return this._ }
                } */
    }, (data) => ({
        track: {
            content: () => `
                <span class="pct pct pct-edit"></span>
                <span class="no-wrap">${data.copyLink()}</span>
            `,
            message: () => `
                <span class="pct pct pct-checkbox"></span>
                <span class="no-wrap">${data.linkCopied()}</span>
            `
        },
        albumGrid: {
            content: () => `
                <span class="pct pct pct-edit"></span>
                <span class="product__button--highlight">
                    ${data.copyLinkWithHighlight('album')}
                </span>
            `,
            message: () => `
                <span class="pct pct pct-checkbox"></span>
                <span class="product__button--highlight">
                    ${data.linkCopiedWithHighlight('album')}</span>
                </span>
            `
        },
        search: {
            content: () => `
                <span class="no-wrap">${data.copyLink('album')}</span>
            `,
            message: () => `
                <span class="no-wrap">${data.linkCopied('album')}</span>
            `
        },
        main: {
            content: (type) => `
                <span class="pct pct pct-edit"></span>
                <span class="no-wrap">${data.copyLink(type)}</span>
            `,
            message: (type) => `
                <span class="pct pct pct-checkbox"></span>
                <span class="no-wrap">${data.linkCopied(type)}</span>
            `
        }
    }));

    templates["main"].content("album")

    const selectors = {
        main: '.catalog-heading__button, .player__webplayer',
        search: '.btn__qobuz.btn__qobuz--see-album',
        album: '.product__button.add_to_cart',
        track: '.track__item.track__item--button',
        loadMore: '.player-more'
    }

    const mainButton = document.querySelector(selectors.main);

    if (mainButton) {
        const [type, id] = mainButton.attributes.href.value.split('/').slice(-2);

        replaceButton(mainButton, id, type, 'main');

        document.querySelectorAll(selectors.track).forEach((el, i) => {
            if (el.classList.contains('track__unavailable')) return;

            const trackButton = replaceButton(
                el,
                el.dataset.url.split('/').slice(-1)[0],
                'track'
            );

            trackButton.addEventListener('dblclick', ev => { ev.preventDefault(); ev.stopPropagation(); })
        });
    }

    document.querySelectorAll(selectors.album).forEach((el, i) => {
        replaceButton(
            el,
            el.dataset.url.split('/').slice(-1)[0],
            'album',
            'albumGrid'
        );
    });

    document.querySelectorAll(selectors.search).forEach((el, i) => {
        replaceButton(
            el,
            el.attributes.href.value.split('/').slice(-1)[0],
            'album',
            'search'
        );
    });

    const loadMore = document.querySelector(selectors.loadMore)

    if (loadMore) {
        loadMore.addEventListener('click', ev => {
            setTimeout(() => {
                document.querySelectorAll(selectors.track).forEach((el, i) => {
                    if (el.classList.contains('track__unavailable')) return;

                    const trackButton = replaceButton(
                        el,
                        el.dataset.url.split('/').slice(-1)[0],
                        'track'
                    );

                    trackButton.addEventListener('dblclick', ev => { ev.preventDefault(); ev.stopPropagation(); })
                });
            }, LOAD_MORE_TRACKS_DELAY);
        })
    }

    function replaceButton(button, id, type, contentType = type) {
        let timeout;

        const content = templates[contentType].content(type),
            url = BASE_URL + `${type}/${id}`,
            newButton = button.cloneNode(true);

        newButton.setAttribute('title', url);
        newButton.setAttribute('href', url);
        newButton.innerHTML = content;

        button.replaceWith(newButton);
        button.remove();

        let wasCopied = false;

        newButton.addEventListener('click', ev => {
            ev.preventDefault();

            navigator.clipboard.writeText(url);

            if (wasCopied) {
                clearTimeout(timeout);
            }
            else {
                newButton.innerHTML = templates[contentType].message(type);
                wasCopied = true;
            }

            timeout = window.setTimeout(
                () => {
                    newButton.innerHTML = content;
                    wasCopied = false;
                },
                COPY_MESSAGE_DISPLAY_DURATION
            );

            ev.stopPropagation();

            return false;
        });

        return newButton;
    }

    function addCustomStyle(style) {
        document.body.append(
            document.createElement('style')
                .appendChild(
                    document.createTextNode(style)
                )
                .parentNode
        );
    }

    function infuseTemplates([country, lang], strings, templates) {
        return templates(strings[country]?.[lang] || strings[DEFAULT_LOC.lang][DEFAULT_LOC.country]);
    }

    Object.defineProperty(String.prototype, "toTitleCase", {
        value: function () {
            return this[0].toUpperCase() + this.slice(1);
        },
        writable: true,
        configurable: true,
    });
})();