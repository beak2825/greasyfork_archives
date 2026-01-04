// ==UserScript==
// @name         Visual discography
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Display discography as a grid of album covers
// @author       zortilox
// @license MIT
// @match        https://redacted.sh/artist.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446678/Visual%20discography.user.js
// @updateURL https://update.greasyfork.org/scripts/446678/Visual%20discography.meta.js
// ==/UserScript==

(function() {
    const setupToggle = () => {
        zcv.dom.$toggle = $('<button/>', {
            text: 'Viewer mode',
            class: 'zcv-toggle',
            style: 'margin-left: 10px;'
        }).appendTo($('#content .header h2'))

        zcv.dom.$toggle.on('click', init)
    }

    const init = () => {
        setupViewer()
        setupCSS()
        open()

        queryArtist().then(() => {
            getAlbums()
            addItems(zcv.data.albums)
            bindEvents()
            toggleLoader()

        })
    }

    if (!window.jQuery) {
        throw new Error('No jQuery. This will not work')
    }

    const $ = window.jQuery;

    let zcv = {
        config: {},
        state: {
            isOpen: false,
            currentItem: 0,
            currentPage: 0,
            currentTag: 'all',
            order: 'default'
        },
        data: {
            api: {},
            defaultOrder: [],
            customOrder: [],
            filtered: [],
            tags: [],
            relatedCollages: [],
            relatedCollagesIDs: []
        },
        dom: {}
    }

    setupToggle()

    const queryArtist = () => {
        return new Promise((resolve) => {
            const apiBaseUrl = 'https://redacted.sh/ajax.php';

            const searchParams = new URLSearchParams(window.location.search)
            zcv.config.artistID = searchParams.get('id')
            let apiUrl = apiBaseUrl

            apiUrl += '?action=artist&id=' + zcv.config.artistID
            $.get(apiUrl, (data) => {
                zcv.data.api = data.response;
                resolve()
            })
        })
    }

    const getAlbums = () => {
        zcv.data.albums = zcv.data.api.torrentgroup.filter((group) => {
            return group.releaseType === 1
        })
    }

    const addItems = (items) => {
        console.log(items)
        items.forEach((item, key) => {
            const $item = $('<li/>', {
                class: 'zcv-item',
            }).appendTo(zcv.dom.$list)
            const $link = $('<a/>', {
                class: 'zcv-link',
                target: '_blank',
                href: 'https://redacted.sh/torrents.php?id=' + item.groupId
            }).appendTo($item)
            const $img = $('<img/>', {
                class: 'zcv-itemImg',
                src: item.wikiImage
            }).appendTo($link)
            console.log(item)
        })
    }


    const setupViewer = () => {
        zcv.dom.$viewer = $('<div/>', {
            class: 'zcv'
        }).appendTo('body')

        zcv.dom.$loader = $('<div/>', {
            class: 'zcv-loader zcv-loader--isVisible'
        }).appendTo(zcv.dom.$viewer)

        zcv.dom.$loaderSpinner = $('<div/>', {
            class: 'zcv-loaderSpinner'
        }).appendTo(zcv.dom.$loader)

        zcv.dom.$loaderLabel = $('<div/>', {
            class: 'zcv-loaderLabel',
            text: 'Loading discography...'
        }).appendTo(zcv.dom.$loader)

        zcv.dom.$loaderProgress = $('<div/>', {
            class: 'zcv-loaderProgress'
        }).appendTo(zcv.dom.$loader)

        zcv.dom.$art = $('<div/>', {
            class: 'zcv-art'
        }).appendTo(zcv.dom.$viewer)

        zcv.dom.$list = $('<ul/>', {
            class: 'zcv-list'
        }).appendTo(zcv.dom.$art)

        zcv.dom.$controls = $('<div/>', {
            class: 'zcv-controls',
        }).appendTo(zcv.dom.$viewer)

        zcv.dom.$close = $('<button/>', {
            class: 'zcv-close',
            text: 'X'
        }).appendTo(zcv.dom.$controls)


    }

    const setupCSS = () => {
        $('<style/>', {
            rel: 'stylesheet',
            type: 'text/css',
            text: ".zcv{background-color:rgba(0,0,0,.9);height:100%;display:flex;flex-direction:column;left:0;opacity:0;pointer-events:none;position:fixed;top:0;width:100%;z-index:10}.zcv--isOpen,.zcv--isOpen .zcv-item--isVisible{opacity:1;pointer-events:all;overflow-y:scroll}.zcv-pagination{font-size:18px;padding:13px 10px;position:absolute;left:0;top:0}.zcv-controls,.zcv-meta{padding:15px 0;text-align:center}.zcv-art{flex:1;max-width:1080px;margin:0 auto}.zcv-list{height:100%;display:flex;flex-wrap:wrap;list-style:none;margin:0;justify-content:center;padding:30px 0;position:relative;width:100%}.zcv-item{width:20%}.zcv-itemImg{max-width:100%}.zcv-metaTitle:after,.zcv-metaTitle:before,.zcv-metaYear:after{content:' - '}.zcv-metaArtist,.zcv-metaTitle{color:white}.zcv-metaArtist:hover,.zcv-metaTitle:hover{color:gold}.zcv-metaTags,.zcv-metaYear{color:gray}.zcv-toggle{margin-left:10px}.zcv-discover,.zcv-next,.zcv-next:focus,.zcv-prev,.zcv-prev:focus{background:transparent;border:0;color:white;font-size:35px;font-weight:bold;height:50px;padding:5px 10px 6px;position:absolute;top:0;width:50px}.zcv-next{right:50px}.zcv-prev{right:100px}.zcv-discover{font-size:12px;right:150px;width:auto}.zcv-discoverList{position:absolute;right:0;top:50px;text-align:right;max-height:80%;overflow-y:scroll;background:rgba(0,0,0,.8)}.zcv-discover:hover{background:blueviolet}.zcv-next:hover,.zcv-prev:hover{background:gold;color:white}.zcv-next--isDisabled,.zcv-prev--isDisabled{opacity:.5;cursor:not-allowed}.zcv-close{background:transparent;border:0;color:white;font-size:35px;font-weight:bold;height:50px;position:absolute;right:0;top:0;transform:rotate(90deg);width:50px}.zcv-close:hover,.zcv-colse:focus{background:crimson;color:white}.zcv-option,.zcv-select,.zcv-select:focus,.zcv-select:hover{background-color:azure;color:black}.zcv-loader{left:0;opacity:0;pointer-events:none;position:fixed;top:50%;text-align:center;width:100%;z-index:11}.zcv-loader--isVisible{opacity:1}.zcv-loaderSpinner{animation:spin 2s linear infinite;border:6px solid darkgray;border-top:6px solid azure;border-radius:50%;height:30px;margin:0 auto;width:30px}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.zcv--hidden{display:none}"
        }).appendTo($('head'))
    }


    const addGroup = (group) => {
        let artist = ''
        let artistID = ''

        if (group.musicInfo && group.musicInfo.artists.length) {
            artist = unescapeHtmlEntities(group.musicInfo.artists[0].name)
            artistId = group.musicInfo.artists[0].id
        }


        const $item = $('<li/>', {
            class: 'zcv-item',
            'data-group-id': group.id,
            'data-name': unescapeHtmlEntities(group.name),
            'data-artist': artist,
            'data-artist-id': artistID,
            'data-year': group.year,
            'data-snatched': group.snatched,
            'data-tags': group.tagList
        }).appendTo(zcv.dom.$list)

        const $img = $('<img/>', {
            src: group.wikiImage,
            class: 'zcv-image'
        }).appendTo($item)

        zcv.dom.$items = zcv.dom.$list.find('.zcv-item')
    }


    const changeItem = () => {
        zcv.dom.$items.removeClass('zcv-item--isVisible')
        const $item = zcv.dom.$items.eq(zcv.state.currentItem)

        $item.addClass('zcv-item--isVisible')
        zcv.dom.$metaArtist.text($item.data('artist'))
        zcv.dom.$metaArtist.attr('href', 'https://redacted.sh/artist.php?id=' + $item.data('artist-id'))
        zcv.dom.$metaTitle.text($item.data('name'))
        zcv.dom.$metaTitle.attr('href', 'https://redacted.sh/torrents.php?id=' + $item.data('group-id'))
        zcv.dom.$metaYear.text($item.data('year'))
        zcv.dom.$metaSnatched.text('(Snatched: ' + $item.data('snatched') + ')')
        zcv.dom.$metaTags.text($item.data('tags'))
        if (zcv.state.currentTag == 'all') {
            zcv.dom.$pagination.text((zcv.state.currentItem + 1) + '/' + zcv.data.api.torrentgroups.length)
        } else {
            zcv.dom.$pagination.text((zcv.state.currentItem + 1) + '/' + zcv.data.filtered.length)
        }
    }

    const bindEvents = () => {
        $('html').on('keydown', (e) => {
            if (zcv.state.isOpen) {
                if ((zcv.dom.$tagsSelect.is(':focus') || zcv.dom.$orderSelect.is(':focus')) && (e.keyCode != 38 && e.keyCode != 40)) {
                    e.preventDefault()
                    zcv.dom.$tagsSelect.blur()
                    zcv.dom.$orderSelect.blur()
                }

                if (e.keyCode == 27) {
                    close()
                }
            }
        })

        zcv.dom.$toggle.on('click', open)
        zcv.dom.$close.on('click', close)
    }

    const open = () => {
        zcv.dom.$viewer.addClass('zcv--isOpen')
        zcv.state.isOpen = true
    }

    const close = () => {
        zcv.dom.$viewer.removeClass('zcv--isOpen')
        zcv.state.isOpen = false
    }

    const empty = () => {
        zcv.state.currentItem = 0
        zcv.state.currentPage = 0
        zcv.dom.$list.empty()
    }

    const toggleLoader = () => {
        zcv.dom.$loader.toggleClass('zcv-loader--isVisible')
    }

    // Utils
    const unescapeHtmlEntities = (string) => {
        return new DOMParser().parseFromString(string,'text/html').querySelector('html').textContent;
    }

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
})();
