// ==UserScript==
// @name         Collage Lightbox Viewer
// @namespace    http://tampermonkey.net/
// @version      1.74
// @description  Lightbox viewer to check collages cover art in bigger resolution
// @author       zortilox
// @match        https://redacted.sh/collages.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433415/Collage%20Lightbox%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/433415/Collage%20Lightbox%20Viewer.meta.js
// ==/UserScript==

(function() {
    const setupToggle = () => {
        zcv.dom.$toggle = $('<button/>', {
            text: 'Viewer mode',
            class: 'zcv-toggle',
            style: 'margin-left: 10px;'
        }).appendTo($('#coverhead'))

        zcv.dom.$toggle.on('click', init)
    }

    const init = () => {
        setupViewer()
        setupCSS()
        open()
        queryCollage().then(() => {
            // console.log(zcv.data.api)

            getTagsList()
            setupFiltering()
            setupOrdering()
            getAllUserPages().then(() => {
                addCurrentPage()
                changeItem()
                zcv.dom.$toggle.off('click')
                bindEvents()
                toggleLoader()
            })
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

    const queryCollage = () => {
        return new Promise((resolve) => {
            const apiBaseUrl = 'https://redacted.sh/ajax.php';

            const searchParams = new URLSearchParams(window.location.search)
            zcv.config.collageID = searchParams.get('id')
            let apiUrl = apiBaseUrl

            apiUrl += '?action=collage&id=' + zcv.config.collageID
            $.get(apiUrl, (data) => {
                zcv.data.api = data.response;
                resolve()
            })
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
            text: 'Loading collage...'
        }).appendTo(zcv.dom.$loader)

        zcv.dom.$loaderProgress = $('<div/>', {
            class: 'zcv-loaderProgress'
        }).appendTo(zcv.dom.$loader)

        zcv.dom.$pagination = $('<div/>', {
            class: 'zcv-pagination',
            text: ''
        }).appendTo(zcv.dom.$viewer)

        zcv.dom.$meta = $('<div/>', {
            class: 'zcv-meta'
        }).appendTo(zcv.dom.$viewer)

        zcv.dom.$metaHead = $('<div/>', {
            class: 'zcv-metaHead',
        }).appendTo(zcv.dom.$meta)

        zcv.dom.$metaArtist = $('<a/>', {
            class: 'zcv-metaArtist',
            href: '#',
        }).appendTo(zcv.dom.$metaHead)

        zcv.dom.$metaTitle = $('<a/>', {
            class: 'zcv-metaTitle',
            href: '#',
        }).appendTo(zcv.dom.$metaHead)

        zcv.dom.$metaYear = $('<span/>', {
            class: 'zcv-metaYear',
            href: '#',
        }).appendTo(zcv.dom.$metaHead)

        zcv.dom.$metaSnatched = $('<span/>', {
            class: 'zcv-metaSnatched',
        }).appendTo(zcv.dom.$metaHead)

        zcv.dom.$metaTags = $('<span/>', {
            class: 'zcv-metaTags',
        }).appendTo(zcv.dom.$meta)

        zcv.dom.$art = $('<div/>', {
            class: 'zcv-art'
        }).appendTo(zcv.dom.$viewer)

        zcv.dom.$list = $('<ul/>', {
            class: 'zcv-list'
        }).appendTo(zcv.dom.$art)

        zcv.dom.$controls = $('<div/>', {
            class: 'zcv-controls',
        }).appendTo(zcv.dom.$viewer)

        zcv.dom.$discover = $('<button/>', {
            class: 'zcv-discover',
            text: 'Discover'
        }).appendTo(zcv.dom.$controls)

        zcv.dom.$discoverList = $('<ul/>', {
            class: 'zcv-discoverList',
        }).appendTo(zcv.dom.$controls)

        zcv.dom.$prev = $('<button/>', {
            class: 'zcv-prev zcv-prev--isDisabled',
            text: '<'
        }).appendTo(zcv.dom.$controls)

        zcv.dom.$next = $('<button/>', {
            class: 'zcv-next',
            text: '>'
        }).appendTo(zcv.dom.$controls)

        zcv.dom.$close = $('<button/>', {
            class: 'zcv-close',
            text: 'X'
        }).appendTo(zcv.dom.$controls)


    }

    const setupFiltering = () => {
        zcv.dom.$tagsSelect = $('<select/>', {
            class: 'zcv-tagsSelect zcv-select',
        }).appendTo(zcv.dom.$controls)

        zcv.tagsKeys = Object.keys(zcv.data.tags)

        zcv.tagsKeys.sort((a, b) => {
            if (zcv.data.tags[a].count > zcv.data.tags[b].count) {
                return -1;
            }

            if (zcv.data.tags[a].count < zcv.data.tags[b].count) {
                return 1;
            }

            return 0;
        })

        $('<option/>', {
            class: 'zcv-tagsOption zcv-option',
            value: 'all',
            text: 'All tags'
        }).appendTo(zcv.dom.$tagsSelect)

        zcv.tagsKeys.forEach((tag) => {
            $('<option/>', {
                class: 'zcv-tagsOption zcv-option',
                value: tag,
                text: tag + ' (' + zcv.data.tags[tag].count  + ')'
            }).appendTo(zcv.dom.$tagsSelect)
        })
    }

    const setupOrdering = () => {
        const options = [
            {
                value: 'default',
                text: 'Original order'
            },
            {
                value: 'album-title-asc',
                text: 'Album Title A-Z'
            },
            {
                value: 'album-title-desc',
                text: 'Album Title Z-A'
            },
            {
                value: 'artist-name-asc',
                text: 'Artist Name A-Z'
            },
            {
                value: 'artist-name-desc',
                text: 'Artist Name Z-A'
            },
            {
                value: 'year-asc',
                text: 'Year (oldest)'
            },
            {
                value: 'year-desc',
                text: 'Year (newest)'
            },
            {
                value: 'snatched-desc',
                text: 'Snatched (most popular)'
            },
            {
                value: 'snatched-asc',
                text: 'Snatched (least popular)'
            },
            {
                value: 'random',
                text: 'Random'
            }
        ]


        zcv.dom.$orderSelect = $('<select/>', {
            class: 'zcv-orderSelect zcv-select',
        }).appendTo(zcv.dom.$controls
)
        $.each(options, (key, option) => {
            $('<option/>', {
                class: 'zcv-orderOption zcv-option',
                value: option.value,
                text: option.text
            }).appendTo(zcv.dom.$orderSelect)

        })
    }
    const setupCSS = () => {
        $('<style/>', {
            rel: 'stylesheet',
            type: 'text/css',
            text: ".zcv{background-color:rgba(0,0,0,.9);height:100%;display:flex;flex-direction:column;left:0;opacity:0;pointer-events:none;position:fixed;top:0;width:100%;z-index:10}.zcv--isOpen,.zcv--isOpen .zcv-item--isVisible{opacity:1;pointer-events:all}.zcv-pagination{font-size:18px;padding:13px 10px;position:absolute;left:0;top:0}.zcv-controls,.zcv-meta{padding:15px 0;text-align:center}.zcv-art{flex:1}.zcv-list{height:100%;list-style:none;margin:0;padding:0;position:relative;width:100%}.zcv-item{align-items:center;display:flex;height:100%;justify-content:center;left:0;margin:0;opacity:0;pointer-events:none;position:absolute;top:0;width:100%}.zcv-image{max-height:100%}.zcv-metaTitle:after,.zcv-metaTitle:before,.zcv-metaYear:after{content:' - '}.zcv-metaArtist,.zcv-metaTitle{color:white}.zcv-metaArtist:hover,.zcv-metaTitle:hover{color:gold}.zcv-metaTags,.zcv-metaYear{color:gray}.zcv-toggle{margin-left:10px}.zcv-discover,.zcv-next,.zcv-next:focus,.zcv-prev,.zcv-prev:focus{background:transparent;border:0;color:white;font-size:35px;font-weight:bold;height:50px;padding:5px 10px 6px;position:absolute;top:0;width:50px}.zcv-next{right:50px}.zcv-prev{right:100px}.zcv-discover{font-size:12px;right:150px;width:auto}.zcv-discoverList{position:absolute;right:0;top:50px;text-align:right;max-height:80%;overflow-y:scroll;background:rgba(0,0,0,.8)}.zcv-discover:hover{background:blueviolet}.zcv-next:hover,.zcv-prev:hover{background:gold;color:white}.zcv-next--isDisabled,.zcv-prev--isDisabled{opacity:.5;cursor:not-allowed}.zcv-close{background:transparent;border:0;color:white;font-size:35px;font-weight:bold;height:50px;position:absolute;right:0;top:0;transform:rotate(90deg);width:50px}.zcv-close:hover,.zcv-colse:focus{background:crimson;color:white}.zcv-option,.zcv-select,.zcv-select:focus,.zcv-select:hover{background-color:azure;color:black}.zcv-loader{left:0;opacity:0;pointer-events:none;position:fixed;top:50%;text-align:center;width:100%;z-index:11}.zcv-loader--isVisible{opacity:1}.zcv-loaderSpinner{animation:spin 2s linear infinite;border:6px solid darkgray;border-top:6px solid azure;border-radius:50%;height:30px;margin:0 auto;width:30px}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.zcv--hidden{display:none}"
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

                if (e.keyCode == 37) {
                    prev()
                }

                if (e.keyCode == 39) {
                    next()
                }

                if (e.keyCode == 27) {
                    close()
                }
            }
        })

        zcv.dom.$toggle.on('click', open)
        zcv.dom.$next.on('click', next)
        zcv.dom.$prev.on('click', prev)
        zcv.dom.$close.on('click', close)
        zcv.dom.$discover.on('click', onDiscoverClick)
        zcv.dom.$tagsSelect.on('change', onTagsSelectChange)
        zcv.dom.$orderSelect.on('change', onOrderSelectChange)
    }

    const onDiscoverClick = (e) => {
        getRelatedCollages()
    }

    const onTagsSelectChange = (e) => {
        const $currentTarget = $(e.currentTarget)
        const tag = $currentTarget.val()

        if (zcv.state.currentTag !== tag) {
            zcv.state.currentTag = tag
            order()
            filter()
        }
    }

    const onOrderSelectChange = (e) => {
        const $currentTarget = $(e.currentTarget)
        const newOrder = $currentTarget.val()

        if (zcv.state.order !== newOrder) {
            zcv.state.order = newOrder
            order()
            filter()
        }
    }

    const addCurrentPage = () => {
        $.each(zcv.data.filtered.slice(zcv.state.currentPage * 50, zcv.state.currentPage * 50 + 49), (key, group) => {
            addGroup(group)
        })
    }

    const getNextUserPage = (page) => {
        return new Promise((resolve) => {
            if (zcv.state.order != 'default') {
                resolve()
            } else {
                const url = 'https://redacted.sh/collages.php?page=' + page + '&legacy=1&id=' + zcv.config.collageID
                $.get(url, (html) => {
                    const $html = $(html)
                    const $groupsLinks = $html.find('.torrent_table .group.discog a[href^="torrents.php?id="]')

                    $.each($groupsLinks, (key, link) => {
                        const $link = $(link)
                        const href = $link.attr('href')
                        const groupID = href.split('torrents.php?id=')[1]

                        let apiGroup = zcv.data.api.torrentgroups.filter((group) => {
                            return group.id == groupID
                        })[0]

                        apiGroup.snatched = getGroupSnatched(apiGroup)

                        zcv.data.defaultOrder.push(apiGroup)
                    })
                    resolve()
                })
            }
        })
    }

    const getAllUserPages = (offset = 0, previousCount = 0) => {
        return new Promise ((resolve) => {
            offset++
            getNextUserPage(offset).then(() => {
                zcv.dom.$loaderProgress.text(zcv.data.defaultOrder.length + '/' + zcv.data.api.torrentgroups.length)

                if (zcv.data.defaultOrder.length == zcv.data.api.torrentgroups.length || (previousCount != 0 && zcv.data.defaultOrder.length == previousCount)) {
                    zcv.data.filtered = zcv.data.defaultOrder
                    return resolve()
                } else {
                    return resolve(getAllUserPages(offset, zcv.data.defaultOrder.length))
                }
            })
        })
    }

    const order = () => {
        empty()

        zcv.data.customOrder = []

        if (zcv.state.order == 'album-title-asc') {
            zcv.data.customOrder = zcv.data.api.torrentgroups.sort((a, b) => {
                const aName = a.name.toUpperCase()
                const bName = b.name.toUpperCase()
                if (aName < bName) {
                    return -1
                }

                if (bName < aName) {
                    return 1
                }

                return 0
            })
        }

        if (zcv.state.order == 'album-title-desc') {
            zcv.data.customOrder = zcv.data.api.torrentgroups.sort((a, b) => {
                const aName = a.name.toUpperCase()
                const bName = b.name.toUpperCase()
                if (bName < aName) {
                    return -1
                }

                if (aName < bName) {
                    return 1
                }

                return 0
            })
        }

        if (zcv.state.order == 'artist-name-asc') {
            zcv.data.customOrder = zcv.data.api.torrentgroups.sort((a, b) => {
                const aName = a.musicInfo.artists[0].name.toUpperCase()
                const bName = b.musicInfo.artists[0].name.toUpperCase()
                if (aName < bName) {
                    return -1
                }

                if (bName < aName) {
                    return 1
                }

                return 0
            })
        }

        if (zcv.state.order == 'artist-name-desc') {
            zcv.data.customOrder = zcv.data.api.torrentgroups.sort((a, b) => {
                const aName = a.musicInfo.artists[0].name.toUpperCase()
                const bName = b.musicInfo.artists[0].name.toUpperCase()
                if (bName < aName) {
                    return -1
                }

                if (aName < bName) {
                    return 1
                }

                return 0
            })
        }

        if (zcv.state.order == 'year-asc') {
            zcv.data.customOrder = zcv.data.api.torrentgroups.sort((a, b) => {
                return a.year - b.year
            })
        }

        if (zcv.state.order == 'year-desc') {
            zcv.data.customOrder = zcv.data.api.torrentgroups.sort((a, b) => {
                return b.year - a.year
            })
        }

        if (zcv.state.order == 'snatched-asc') {
            zcv.data.customOrder = zcv.data.api.torrentgroups.sort((a, b) => {
                return a.snatched - b.snatched
            })
        }

        if (zcv.state.order == 'snatched-desc') {
            zcv.data.customOrder = zcv.data.api.torrentgroups.sort((a, b) => {
                return b.snatched - a.snatched
            })
        }

        if (zcv.state.order == 'random') {
            $.each(shuffleArray(Object.keys(zcv.data.api.torrentgroups)), (key, randomKey) => {
                zcv.data.customOrder.push(zcv.data.api.torrentgroups[randomKey])
            })
        }

        if (zcv.state.order == 'default') {
            zcv.data.customOrder = zcv.data.defaultOrder
        }
    }

    const filter = () => {
        zcv.data.filtered = []

        if (zcv.state.currentTag == 'all') {
            zcv.data.filtered = JSON.parse(JSON.stringify(zcv.data.customOrder))
        } else {
            zcv.data.filtered = zcv.data.customOrder.filter((group) => {
                return group.tags.indexOf(zcv.state.currentTag) != -1
            })
        }

        $.each(zcv.data.filtered.slice(0, 49), (key, group) => {
            addGroup(group)
        })
        changeItem()
    }

    const getRelatedCollages = (index = 0) => {
        // return new Promise((resolve) => {
            if (zcv.data.api.torrentgroups.length > index) {
                zcv.dom.$discover.text('loading' + (index + 1))
                const apiBaseUrl = 'https://redacted.sh/ajax.php';
                let apiUrl = apiBaseUrl

                apiUrl += '?action=torrentgroup&id=' + zcv.data.api.torrentgroups[index].id
                $.get(apiUrl, (data) => {
                    if (data.status === 'success' && data.response.group.personalCollages.length > 1) {
                        data.response.group.personalCollages.forEach((collage) => {
                            if (zcv.config.collageID != collage.id) {
                                if (zcv.data.relatedCollagesIDs.indexOf(collage.id) == -1) {
                                    zcv.data.relatedCollagesIDs.push(collage.id)
                                    zcv.data.relatedCollages.push(collage)
                                }
                            }
                        })
                    }
                    setTimeout(() => {
                        getRelatedCollages(index + 1)
                    }, 1800)
                })
            } else {
                zcv.data.relatedCollages =[... new Set(zcv.data.relatedCollages)]
                zcv.data.relatedCollages.forEach((collage) => {
                    console.log(collage)
                    const $li = $('<li/>').appendTo(zcv.dom.$discoverList)

                    $('<a/>', {
                        href: 'https://redacted.sh/collages.php?id=' + collage.id,
                        target: '_blank',
                        text: collage.name
                    }).appendTo($li)
                })

                zcv.dom.$discover.text('hide/show')

                zcv.dom.$discover.off('click')
                zcv.dom.$discover.on('click', (e) => {
                    zcv.dom.$discoverList.toggleClass('zcv--hidden')
                })
                // resolve()
            }
        // })
    }

    const getTagsList = () => {
        zcv.data.api.torrentgroups.forEach((group) => {
            const tags = group.tags = group.tagList.split(' ')

            tags.forEach((tag) => {
                if (tag in zcv.data.tags) {
                    zcv.data.tags[tag].count++
                } else {
                    zcv.data.tags[tag] = {
                        count: 1
                    }
                }
            })
        })
    }

    const getGroupSnatched = (group) => {
        let snatched = 0

        $.each(group.torrents, (key, torrent) => {
            snatched += torrent.snatched
        })

        return snatched
    }

    const open = () => {
        zcv.dom.$viewer.addClass('zcv--isOpen')
        zcv.state.isOpen = true
    }

    const close = () => {
        zcv.dom.$viewer.removeClass('zcv--isOpen')
        zcv.state.isOpen = false
    }

    const prev = () => {
        if (zcv.state.currentItem > 0) {
            zcv.dom.$next.removeClass('zcv-next--isDisabled')
            zcv.state.currentItem--

            if (zcv.state.currentItem === 0) {
                zcv.dom.$prev.addClass('zcv-prev--isDisabled')
            }

            changeItem()
        }
    }

    const next = () => {
        // console.log(zcv.state.currentItem)
        if (zcv.state.currentItem + 1 === zcv.dom.$items.length - 5) {
            zcv.state.currentPage++
            addCurrentPage()
        }

        if (zcv.state.currentItem + 1 < zcv.dom.$items.length) {
            zcv.dom.$prev.removeClass('zcv-prev--isDisabled')
            zcv.state.currentItem++
            changeItem()
        } else {
            zcv.dom.$next.addClass('zcv-next--isDisabled')
        }
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
 