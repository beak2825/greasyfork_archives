// ==UserScript== //
// @name         Batoto MyFollows
// @version      15.11.30.1
// @description  Filter your follows from comic search; info button and sorting in the old follows page; links between Batoto-MU-Mal and other features.
// @namespace    https://greasyfork.org/users/168
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @include      *://bato.to/*
// @include      *://www.mangaupdates.com/*
// @include      *://myanimelist.net/*
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/365/Batoto%20MyFollows.user.js
// @updateURL https://update.greasyfork.org/scripts/365/Batoto%20MyFollows.meta.js
// ==/UserScript==

//-----------------------------------------------------
// Batoto
//-----------------------------------------------------

var batoto = {
    init: function() {
        if (GM_config.get('batoto_defaultToOldFollows')) {
            this.defaultToOldFollows();
        }
        ready(function() {
            batoto.loadingImg.init();
            if (/^\/$/.test(path)) {
                batoto.p_home.main();
            } else if (/^\/myfollows/.test(path)) {
                batoto.p_newFollows.main();
            } else if (/^\/follows_comics/.test(path)) {
                batoto.p_oldFollows.main();
            } else if (/^\/search/.test(path)) {
                batoto.p_comicSearch.main();
            } else if (/^\/comic\/_\/comics\/$/.test(path)) {
                batoto.p_comicDir.main();
            } else if (/^\/comic\/_\/comics\/.+/.test(path)) {
                batoto.p_comic.main();
            } else if (/^\/group\/_\/.\/.+/.test(path)) {
                batoto.p_group.main();
            } else if (/^\/forums/.test(path)) {
                batoto.p_forums.main();
            }
            batoto.addOptionsButton();
        });
    },

    comicIdRegex: /bato\.to\/comic\/_\/.*\-r(\d+)\/?$/i,

    getComicId: function(url) {
        if (!url) return null;
        var id = url.match(batoto.comicIdRegex);
        return id !== null ? id[1] : id;
    },

    chapterRegex: /(?:Vol\.([0-9.]+) )?Ch\.(?:(?: *- *)?([0-9.]+)([a-uA-U])?){0,2}(?: ?\)?[vV]([0-9]))?/,

    parseChapter: function(string) {
        var match = string.match(batoto.chapterRegex),
            obj = {};
        if (!match) {
            return null;
        }
        obj.vol = match[1] === undefined ? false : match[1] * 1,
        obj.ch = match[2] === undefined ? true : match[2] * 1,
        obj.ch = match[3] === undefined ? obj.ch : obj.ch + (match[3].toLowerCase().charCodeAt(0) - 96) * 0.1,
        obj.ver = match[4] === undefined ? 1 : match[4] * 1;
        return obj;
    },

    parseDate: function(string) {
        var now, num, month, hour,
            match = string.match(/(\d+) (\w{3})\w* (\d+) - (\d+):(\d+) ?(\w+)?/);
        if (match) {
            month = match[2];
            if (month === 'Jan') month = 0;
            else if (month === 'Feb') month = 1;
            else if (month === 'Mar') month = 2;
            else if (month === 'Apr') month = 3;
            else if (month === 'May') month = 4;
            else if (month === 'Jun') month = 5;
            else if (month === 'Jul') month = 6;
            else if (month === 'Aug') month = 7;
            else if (month === 'Sep') month = 8;
            else if (month === 'Oct') month = 9;
            else if (month === 'Nov') month = 10;
            else if (month === 'Dec') month = 11;
            hour = match[4] === '12' ? 0 : match[4] * 1;
            hour = match[6] === 'AM' ? hour : hour + 12;
            return [match[3] * 1, month, match[1] * 1, hour, match[5] * 1];
        }
        match = string.match(/(An?|\d+) (week|day|hour|minute)s? ago/);
        if (match) {
            now = new Date();
            num = match[1] * 1 || 1;
            if (match[2] === 'week') now.setDate(now.getDate() - num * 7);
            else if (match[2] === 'day') now.setDate(now.getDate() - num);
            else if (match[2] === 'hour') now.setHours(now.getHours() - num);
            else if (match[2] === 'minute') now.setMinutes(now.getMinutes() - num);
            return [now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()];
        }
        match = string.match(/(Today|Yesterday), (\d+):(\d+) (\w+)/);
        if (match) {
            now = new Date();
            if (match[1] === 'Yesterday') now.setDate(now.getDate() - 1);
            hour = match[2] === '12' ? 0 : match[2] * 1;
            hour = match[4] === 'AM' ? hour : hour + 12;
            return [now.getFullYear(), now.getMonth(), now.getDate(), hour, match[3] * 1];
        }
        return [0, 0, 0, 0, 0];
    },

    theme: null,

    getTheme: function() {
        if (this.theme === null) {
            var storedTheme = getStorage('batoto_theme', true);
            if (this.isLoggedIn()) {
                ready(function() {
                    var pageTheme = querySel('#new_skin_menucontent > .selected > a'),
                        dropList = document.getElementById('new_skin_menucontent');
                    if (pageTheme) {
                        pageTheme = pageTheme.textContent.toLowerCase().replace(/ .*/, '');
                    } else {
                        pageTheme = 'subway';
                    }
                    if (pageTheme !== storedTheme) {
                        setStorage('batoto_theme', pageTheme, true);
                        reload();
                        return;
                    }
                    dropList.addEventListener('click', function(e) {
                        pageTheme = e.target.textContent.toLowerCase().replace(/ .*/, '');
                        setStorage('batoto_theme', pageTheme, true);
                    }, true);
                });
            } else {
                setStorage('batoto_theme', 'subway', true);
            }
            this.theme = storedTheme || 'subway';
        }
        return this.theme;
    },

    loggedIn: null,

    isLoggedIn: function() {
        if (this.loggedIn === null) {
            var storedLoggedIn = getStorage('batoto_logged_in', true);
            ready(function() {
                var pageLoggedIn = Window.ipb.vars['member_id'] !== 0;
                setStorage('batoto_logged_in', pageLoggedIn, true);
                if (!storedLoggedIn && pageLoggedIn === true) {
                    reload();
                }
            });
            this.loggedIn = storedLoggedIn || false;
        }
        return this.loggedIn || false;
    },

    defaultToOldFollows: function() {
        var oldFollows = 'http://bato.to/follows_comics';
        if (path === '/myfollows' && location.search === '') {
            Window.stop();
            location.replace(oldFollows);
        }
        ready(function() {
            document.getElementById('nav_menu_4_trigger').href = oldFollows;
            if (path === '/') {
                querySel('#hook_watched_items > div:last-child > a').href = oldFollows;
            }
        });
    },

    setComicPopup: function(selector) {
        //uses the same ipb function that previews the profiles
        var links = selector ? querySelAll(selector) : document.getElementsByTagName('a'),
            popupConf, anchor, id;
        for (var i = 0, len = links.length; i < len; i++) {
            anchor = links[i];
            id = batoto.getComicId(anchor.getAttribute('href'));
            if (id !== null) {
                anchor.className += ' _hovertrigger';
                anchor.setAttribute('hovercard-ref', 'comicPopup');
                anchor.setAttribute('hovercard-id', id);
            }
        }
        popupConf = {
            'w': '680px',
            'delay': GM_config.get('batoto_comicsPopupDelay'),
            'position': 'auto',
            'ajaxUrl': Window.ipb.vars['home_url'] + '/comic_pop?',
            'getId': true,
            'setIdParam': 'id'
        };
        if (typeof cloneInto === 'function') {
            popupConf = cloneInto(popupConf, unsafeWindow);
        }
        Window.ipb.hoverCardRegister.initialize('comicPopup', popupConf);
    },

    followsList: {
        updating: false,

        update: function(callback) {
            if (!this.updating) {
                var self = this;
                self.updating = true;
                batoto.loadingImg.fadeIn();
                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            var followsList = [],
                                regex = /"View topic"><strong>(.*?)<\/strong>/g,
                                title = regex.exec(request.responseText);
                            while (title) {
                                followsList.push(decodeHtmlEntity(title[1]));
                                title = regex.exec(request.responseText);
                            }
                            setStorage('follows_list', toCharObject(followsList));
                            if (typeof callback === 'function') {
                                callback();
                            }
                        }
                        batoto.loadingImg.fadeOut();
                        self.updating = false;
                    }
                };
                request.open('GET', '/follows_comics', true);
                request.send();
            }
        }
    },

    loadingImg: {
        init: function() {
            var div = document.getElementById('ajax_loading');
            if (!div) {
                div = createElemHTML(Window.ipb.templates['ajax_loading']);
                div.style.display = 'none';
                document.getElementById('ipboard_body').appendChild(div);
            }
            if (typeof cloneInto === 'function') {
                this.config = cloneInto(this.config, Window);
            }
        },

        config: {
            duration: 0.25
        },

        queue: 0,

        effect: null,

        fadeIn: function() {
            this.queue++;
            if (this.queue === 1) {
                if (this.effect) {
                    this.effect.cancel();
                    this.effect = null;
                }
                this.effect = new Window.Effect.Appear('ajax_loading', this.config);
            }
        },

        fadeOut: function() {
            this.queue--;
            if (this.queue === 0) {
                if (this.effect) {
                    this.effect.cancel();
                    this.effect = null;
                }
                this.effect = new Window.Effect.Fade('ajax_loading', this.config);
            }
        }
    },

    addOptionsButton: function() {
        var btn = createElem('li'),
            anchor = createElem('a', {
                href: 'javascript:void(0)'
            });
        anchor.textContent = 'Open BFM Options';
        btn.appendChild(anchor);
        anchor.addEventListener('click', function() {
            GM_config.open();
        }, false);
        querySel('#footer_utilities .ipsList_inline.left').appendChild(btn);
    }
};


//------------------
// Specific pages
//------------------

batoto.p_home = {
    main: function() {
        if (GM_config.get('batoto_followingIcon_home') && batoto.isLoggedIn()) {
            this.addFollowsIcons();
        }
    },

    addFollowsIcons: function() {
        var followsList = getStorage('follows_list'),
            icon = createElem('img', {
                title: 'Following',
                alt: '',
                src: getResource('batoto_followingIcon'),
                className: 'bmf_following_icon'
            }),
            titles = querySelAll("td > a[style='font-weight:bold;']"),
            comic;
        if (!followsList) {
            batoto.followsList.update(this.addFollowsIcons);
            return;
        }
        for (var i = 1, len = titles.length; i < len; i += 2) {
            comic = titles[i];
            if (inCharObject(followsList, comic.textContent)) {
                comic.parentNode.insertBefore(icon.cloneNode(false), comic.previousSibling);
            }
        }
    }
};

batoto.p_newFollows = {
    main: function() {
        if (!batoto.isLoggedIn()) return;
        this.saveFollowsList();
    },

    saveFollowsList: function() {
        var followsList = [],
            titles = document.getElementById('categories').parentNode.children;
        for (var i = 7, len = titles.length - 7; i < len; i++) {
            followsList.push(titles[i].textContent);
        }
        setStorage('follows_list', toCharObject(followsList));
    }
};

batoto.p_oldFollows = {
    main: function() {
        if (!batoto.isLoggedIn()) return;
        this.getComics();
        this.saveFollowsList();
        this.sorting.main();

        if (GM_config.get('batoto_showTotalFollows')) {
            this.showTotalFollows();
        }
        if (GM_config.get('batoto_addInfoBtns')) {
            this.info.addBtns();
        }
        if (GM_config.get('batoto_addBoxToNewFollows')) {
            this.addBoxToNewFollows();
        }
        if (GM_config.get('batoto_categorizeFollows')) {
            this.categorizeFollows();
        }
    },

    comics: null,

    getComics: function() {
        if (this.gotComics) return;
        var nodes = document.getElementsByClassName('ipb_table')[0].getElementsByTagName('tr'),
            len = nodes.length,
            comics = this.comics = new Array(len / 2);
        for (var i = 0; i < len; i += 2) {
            comics[i / 2] = {
                first: nodes[i],
                second: nodes[i + 1]
            };
        }
        this.gotComics = true;
    },

    getComicsTitle: function() {
        if (this.gotComicsTitle) return;
        var comics = this.comics;
        for (var i = 0, len = comics.length; i < len; i++) {
            comics[i].title = comics[i].first.getElementsByTagName('strong')[0].textContent;
        }
        this.gotComicsTitle = true;
    },

    getComicsLastRead: function() {
        if (this.gotComicsLastRead) return;
        var comics = this.comics,
            comic, text, c;
        for (var i = 0, len = comics.length; i < len; i++) {
            comic = comics[i];
            text = comic.first.lastElementChild.textContent;
            comic.lastReadDate = batoto.parseDate(text);
            c = batoto.parseChapter(text);
            if (c === null) {
                comic.lastReadCh = false;
                comic.lastReadVol = false;
            } else {
                comic.lastReadCh = c.ch;
                comic.lastReadVol = c.vol;
            }
        }
        this.gotComicsLastRead = true;
    },

    getComicsLastUpdate: function() {
        if (this.gotComicsLastUpdate) return;
        var comics = this.comics,
            comic, dateText, chText, c;
        for (var i = 0, len = comics.length; i < len; i++) {
            comic = comics[i];
            dateText = comic.second.lastElementChild.textContent;
            chText = comic.second.firstElementChild.textContent;
            comic.lastUpdateDate = batoto.parseDate(dateText);
            c = batoto.parseChapter(chText);
            if (c === null) {
                comic.lastUpdateCh = false;
                comic.lastUpdateVol = false;
            } else {
                comic.lastUpdateCh = c.ch;
                comic.lastUpdateVol = c.vol;
            }
        }
        this.gotComicsLastUpdate = true;
    },

    getComicsUnreadCh: function() {
        if (this.gotUnreadCh) return;
        this.getComicsLastUpdate();
        this.getComicsLastRead();
        var comics = this.comics,
            comic;
        for (var i = 0, len = comics.length; i < len; i++) {
            comic = comics[i];
            if (typeof comic.lastUpdateCh === 'number' && comic.lastReadCh === false) {
                comic.unreadChs = comic.lastUpdateCh;
            } else if (typeof comic.lastUpdateCh === 'number' && typeof comic.lastReadCh === 'number') {
                if (comic.lastUpdateCh === comic.lastReadCh) {
                    comic.unreadChs = -0.03;
                } else {
                    comic.unreadChs = comic.lastUpdateCh - comic.lastReadCh;
                }
            } else if (comic.lastUpdateCh === false && comic.lastReadCh === false) {
                comic.unreadChs = -0.04;
            } else if (comic.lastUpdateCh === true && comic.lastReadCh === false) {
                comic.unreadChs = -0.01;
            } else {
                comic.unreadChs = -0.02;
            }
        }
        this.gotUnreadCh = true;
    },

    saveFollowsList: function() {
        var comics = this.comics,
            followsList = [];
        if (!this.gotComicsTitle) {
            this.getComicsTitle();
        }
        for (var i = 0, len = comics.length; i < len; i++) {
            followsList.push(comics[i].title);
        }
        setStorage('follows_list', toCharObject(followsList));
    },

    showTotalFollows: function() {
        var total = String(this.comics.length),
            elem = document.createElement('strong');
        elem.id = 'bmf_total_follows';
        elem.textContent = total + ' Comics!';
        document.getElementsByClassName('maintitle')[0].appendChild(elem);
    },

    sorting: {
        modes: {
            "Last Update's Date": {
                prepare: function() {
                    batoto.p_oldFollows.getComicsLastUpdate();
                },
                sortCallback: function(a, b) {
                    var arrayA = a.lastUpdateDate,
                        arrayB = b.lastUpdateDate,
                        i;
                    for (var i = 0; i < 5; i++) {
                        if (arrayB[i] > arrayA[i]) return 1;
                        if (arrayB[i] < arrayA[i]) return -1;
                    }
                    return 0;
                }
            },
            "Last Update's Ch": {
                prepare: function() {
                    batoto.p_oldFollows.getComicsLastUpdate();
                },
                sortCallback: function(a, b) {
                    var A = a.lastUpdateCh,
                        B = b.lastUpdateCh;
                    if (A === B) {
                        A = a.lastUpdateVol;
                        B = b.lastUpdateVol;
                        A = A === false ? -2 : (A === true ? -1 : A);
                        B = B === false ? -2 : (B === true ? -1 : B);
                        return B - A;
                    }
                    A = A === false ? -2 : (A === true ? -1 : A);
                    B = B === false ? -2 : (B === true ? -1 : B);
                    return B - A;
                }
            },
            "Last Read's Date": {
                prepare: function() {
                    batoto.p_oldFollows.getComicsLastRead();
                },
                sortCallback: function(a, b) {
                    var arrayA = a.lastReadDate,
                        arrayB = b.lastReadDate,
                        i;
                    for (var i = 0; i < 5; i++) {
                        if (arrayB[i] > arrayA[i]) return 1;
                        if (arrayB[i] < arrayA[i]) return -1;
                    }
                    return 0;
                }
            },
            "Last Read's Ch": {
                prepare: function() {
                    batoto.p_oldFollows.getComicsLastRead();
                },
                sortCallback: function(a, b) {
                    var A = a.lastReadCh,
                        B = b.lastReadCh;
                    if (A === B) {
                        A = a.lastReadVol;
                        B = b.lastReadVol;
                        A = A === false ? -2 : (A === true ? -1 : A);
                        B = B === false ? -2 : (B === true ? -1 : B);
                        return B - A;
                    }
                    A = A === false ? -2 : (A === true ? -1 : A);
                    B = B === false ? -2 : (B === true ? -1 : B);
                    return B - A;
                }
            },
            'Unread Chs': {
                prepare: function() {
                    batoto.p_oldFollows.getComicsUnreadCh();
                },
                sortCallback: function(a, b) {
                    return b.unreadChs - a.unreadChs;
                }
            },
            'Title': {
                prepare: function() {
                    batoto.p_oldFollows.getComicsTitle();
                },
                sortCallback: function(a, b) {
                    if (a.title > b.title) return 1;
                    if (a.title < b.title) return -1;
                    return 0;
                }
            }
        },

        main: function() {
            if (GM_config.get('batoto_autoSort')) {
                this.run(GM_config.get('batoto_defaultSort'));
            }
            var self = this,
                mainTitle = document.getElementsByClassName('maintitle')[0],
                handler = function() {
                    self.run(this.textContent);
                },
                btnClass = 'bmf_sort_btn',
                mode, btn;

            if (GM_config.get('batoto_adaptSortButton')) {
                btnClass += ' f_icon';
            }
            if (batoto.getTheme() === 'blood') {
                btnClass += ' ipsButton_secondary';
            } else {
                btnClass += ' ipsButton';
            }

            for (var modeName in self.modes) {
                mode = self.modes[modeName];
                btn = createElem('button', {
                    className: btnClass,
                    href: 'javascript:void(0)'
                });
                btn.textContent = modeName;
                btn.addEventListener('click', handler, false);
                mainTitle.appendChild(btn);
            }
        },

        prev: null,
        reversed: false,

        run: function(modeName) {
            var comics = batoto.p_oldFollows.comics,
                modes = this.modes,
                mode = modes[modeName],
                revI;
            if (typeof mode.prepare === 'function') {
                mode.prepare();
            }

            if (this.prev === modeName) {
                this.reversed = !this.reversed;
            } else {
                this.reversed = false;
                this.prev = modeName;
            }
            revI = this.reversed ? -1 : 1;
            comics.sort(function(a, b) {
                var i = mode.sortCallback(a, b) * revI;
                if (i === 0) {
                    i = modes.Title.sortCallback(a, b);
                }
                return i;
            });

            this.updateTable(true, true);
        },

        updateTable: function(updateSort, updateClasses) {
            if (!updateSort && !updateClasses) return;
            var table = querySel('.clearfix > table'),
                tbody = table.firstElementChild,
                comics = batoto.p_oldFollows.comics,
                rowEven = false,
                node1, nodeInfo, node2;
            table.removeChild(tbody);
            for (var i = 0, len = comics.length; i < len; i++) {
                node1 = comics[i].first;
                nodeInfo = node1.nextElementSibling;
                node2 = comics[i].second;
                if (updateSort) {
                    tbody.appendChild(node1);
                    if (nodeInfo !== node2) {
                        tbody.appendChild(nodeInfo);
                    }
                    tbody.appendChild(node2);
                }
                if (updateClasses) {
                    node1.classList.toggle('row1', rowEven);
                    node1.classList.toggle('row0', !rowEven);
                    if (nodeInfo !== node2) {
                        nodeInfo.classList.toggle('row1', rowEven);
                        nodeInfo.classList.toggle('row0', !rowEven);
                    }
                    node2.classList.toggle('row1', rowEven);
                    node2.classList.toggle('row0', !rowEven);
                    rowEven = !rowEven;
                }
            }
            table.appendChild(tbody);
        }
    },

    info: {
        addBtns: function() {
            var that = batoto.p_oldFollows,
                comics = that.comics,
                table = querySel('.clearfix > table > tbody'),
                infoBtn = createElem('a', {
                    href: 'javascript:void(0)',
                    className: 'bmf_info_button'
                }),
                title;
            for (var i = 0, len = comics.length; i < len; i++) {
                title = comics[i].first.getElementsByTagName('a')[1];
                title.parentNode.insertBefore(infoBtn.cloneNode(false), title);
            }
            table.addEventListener('click', function(e) {
                if (e.target.className === 'bmf_info_button') {
                    that.info.showBox(e.target);
                }
            }, false);
        },

        showBox: function(infoBtn) {
            // modification of the function used by batoto:
            // bato.to/js/shortcuts_20131231.js
            //(prototype.js)
            var anchor = infoBtn.nextElementSibling,
                comicId = batoto.getComicId(anchor.getAttribute('href')),
                div = document.getElementById('cId_' + comicId);
            if (div === null) {
                div = this.addBoxContainer(infoBtn, comicId);
            }
            if (div.children.length === 0) {
                batoto.loadingImg.fadeIn();

                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        batoto.loadingImg.fadeOut();

                        if (request.status === 200) {
                            div.innerHTML = request.responseText;
                            setTimeout(function() {
                                div.style.display = '';
                            }, 30);
                        }
                    }
                };
                request.open('GET', '/comic_pop?id=' + comicId, true);
                request.send();

            } else if (div.style.display === '') {
                div.style.display = 'none';
            } else {
                div.style.display = '';
            }
        },

        addBoxContainer: function(infoBtn, comicId) {
            var nextRow = infoBtn.parentNode.parentNode.nextElementSibling,
                div = createElem('div', {
                    id: 'cId_' + comicId,
                    style: 'display: none;'
                }),
                tr = createElem('tr', {
                    className: nextRow.className.replace('altrow', '') + ' bmf_info_row'
                }),
                td = createElem('td', {
                    colspan: '2',
                    style: 'border-bottom-width:0 !important'
                });

            td.appendChild(div);
            tr.appendChild(td);
            querySel('.ipb_table > tbody').insertBefore(tr, nextRow);
            infoBtn.parentNode.previousElementSibling.setAttribute('rowspan', '3');
            return div;
        }
    },

    categorizeFollows: function() {
        var rows = document.getElementsByTagName('table')[0].rows,
            read = 0,
            reading = 0,
            noReads = 0,
            className, row1, row2, link1, link2, viewOptionsBox, views;
        for (var i = 0, len = rows.length; i < len; i = i + 2) {
            row1 = rows[i];
            row2 = rows[i + 1];
            if (row1.children[2].textContent !== 'Last Read: No Record') {
                link1 = row1.children[2].children[0].getAttribute('href');
                link2 = row2.firstElementChild.children[1].getAttribute('href');
                if (link1 === link2) {
                    className = ' bmf_read';
                    read++;
                } else {
                    className = ' bmf_reading';
                    reading++;
                }
            } else {
                className = ' bmf_noreads';
                noReads++;
            }
            row1.className = row2.className += className;
        }

        viewOptionsBox = createElemHTML(
            '<div class="general_box clearfix"><h3>View Settings</h3><div class="_sbcollapsable">' +
            '<a href="javascript:void(0)" onclick=\"$(\'view\').toggle();">Alter Settings</a>' +
            '<div id="view" style="display: none;">' +
            '<table><tbody>' +
            '<tr><td>All read (' + read + ')</td><td style="text-align: left; vertical-align: top; padding: 6px 0;">' +
            '<label><input id="show1" type="radio" name="read" value="show" checked="checked"> Show</label>' +
            '<label><input id="hide1" type="radio" name="read" value="hide" style="margin-left: 6px"> Hide</label></td></tr>' +
            '<tr><td>Reading (' + reading + ')</td><td style="text-align: left; vertical-align: top; padding: 6px 0;">' +
            '<label><input id="show2" type="radio" name="reading" value="show" checked="checked"> Show</label>' +
            '<label><input id="hide2" type="radio" name="reading" value="hide" style="margin-left: 6px"> Hide</label></td></tr>' +
            '<tr><td>No reads (' + noReads + ')</td><td style="text-align: left; vertical-align: top; padding: 6px 0;">' +
            '<label><input id="show3" type="radio" name="noreads" value="show" checked="checked"> Show</label>' +
            '<label><input id="hide3" type="radio" name="noreads" value="hide" style="margin-left: 6px"> Hide</label></td></tr>' +
            '</tbody></table></div></div>');
        document.getElementById('index_stats').insertBefore(viewOptionsBox, null);
        views = function() {
            var table = document.getElementsByClassName('ipb_table')[0];
            if (this.value === 'hide') {
                table.classList.add('bmf_hide_' + this.name);
            } else {
                table.classList.remove('bmf_hide_' + this.name);
            }
        };
        for (var i = 1; i < 4; i++) {
            document.getElementById('show' + i).addEventListener('click', views, false);
            document.getElementById('hide' + i).addEventListener('click', views, false);
        }
    },

    addBoxToNewFollows: function() {
        var box = document.createElement('div');
        box.className = 'general_box alt clearfix';
        box.innerHTML = '<h3><img src=" ' + Window.ipb.vars['rate_img_on'] + '" alt="">' +
            '\nFollows by Chapters (new follows)</h3>' +
            '<div class="recent_activity _sbcollapsable">' +
            '<div class="tab_toggle_content" style="text-align:center;">' +
            '<a href="/myfollows?noRedirect">Right here!</a></div></div>';
        document.getElementById('index_stats').appendChild(box);
    }
};

batoto.p_comicSearch = {
    main: function() {
        if (!batoto.isLoggedIn()) return;

        this.runMatch('last');
        this.addUpdateFollowsBtn();
        this.addExcludeOption();
        this.watchForNewResults();
    },

    runMatch: function(table) {
        var comics = this.getMatchComics(table),
            addFollowingIcon = GM_config.get('batoto_followingIcon_search');
        if (comics === false) {
            batoto.followsList.update(function() {
                batoto.p_comicSearch.runMatch('last');
            });
            return;
        }
        var icon = createElem('img', {
            title: 'Following',
            alt: '',
            src: getResource('batoto_followingIcon'),
            className: 'bmf_following_icon'
        }),
            matches = comics[0],
            mismatches = comics[1],
            comic, title;

        for (var i = 0, len = matches.length; i < len; i++) {
            comic = matches[i];
            title = comic.firstChild;
            if (addFollowingIcon && title.childNodes.length === 2) {
                title.insertBefore(icon.cloneNode(false), title.firstChild.nextSibling);
            }
            comic.parentNode.parentNode.setAttribute('class', 'bmf_match');
        }

        for (var i = 0, len = mismatches.length; i < len; i++) {
            // if the icon was added but then you unfollowed the comic
            // and updated the list, then css will hide the icon
            mismatches[i].parentNode.parentNode.setAttribute('class', 'bmf_mismatch');
        }
    },

    getMatchComics: function(table) {
        var followsList = getStorage('follows_list'),
            matches = [],
            mismatches = [],
            comics, comic, len, i;

        if (!followsList) {
            return false;
        }

        if (table === 'all') {
            comics = document.getElementsByTagName('strong');
            i = 1;
            len = comics.length - 3;
        } else if (table === 'last') {
            table = document.getElementsByClassName('chapters_list').length - 1;
            comics = document.getElementsByClassName('chapters_list')[table].getElementsByTagName('strong');
            i = 0;
            len = comics.length;
        }

        for (; i < len; i++) {
            comic = comics[i];
            if (inCharObject(followsList, comic.textContent.trim())) {
                matches.push(comic);
            } else {
                mismatches.push(comic);
            }
        }
        return [matches, mismatches];
    },

    matchesVisibility: function(action) {
        if (action === 'hide') {
            document.getElementById('comic_search_results').className = 'bmf_hide_matches';
            // hides the info boxes of matches if shown
            var infoBoxes = document.getElementsByClassName('ipsBox'),
                infoBox;
            for (var i = 0, len = infoBoxes.length; i < len; i++) {
                infoBox = infoBoxes[i].parentNode.parentNode;
                if (infoBox.previousElementSibling.className === 'bmf_match') {
                    infoBox.style.display = 'none';
                }
            }
        } else if (action === 'show') {
            document.getElementById('comic_search_results').className = '';
        }
    },

    addExcludeOption: function() {
        var self = this,
            optionsBar = document.getElementById('advanced_options').children[0],
            optionInput = document.createElement('tr');
        optionInput.innerHTML =
            '<tr><td style="text-align: right; font-weight: bold;">Include MyFollows:</td>' +
            '<td style="text-align: left; vertical-align: top; padding: 8px 0;">' +
            '<label><input id="incl_follows" type="radio" name="follows" value="show" checked="checked"> Yes</label>' +
            '<label><input id="excl_follows" type="radio" name="follows" value="hide" style="margin-left: 4px"> No</label>' +
            '</td></tr>';
        optionsBar.insertBefore(optionInput, optionsBar.children[6]);
        document.getElementById('incl_follows').addEventListener('click', function() {
            self.matchesHidden = false;
            self.matchesVisibility('show');
        }, false);
        document.getElementById('excl_follows').addEventListener('click', function() {
            self.matchesHidden = true;
            self.matchesVisibility('hide');
        }, false);
    },

    watchForNewResults: function() {
        var self = this,
            tablesContainer = document.getElementById('comic_search_results'),
            observer = new MutationObserver(function(mutations) {
                if (mutations.length === 2 || mutations.length === 4) {
                    self.runMatch('last');
                }
            });
        observer.observe(tablesContainer, {
            childList: true
        });
    },

    addUpdateFollowsBtn: function() {
        var self = this,
            searchBar = querySel('#comic_search_form > div > div'),
            updateBtn = createElem('a', {
                id: 'bmf_upd_follows_btn',
                className: 'input_submit',
                title: 'Update Follows',
                href: 'javascript:void(0)'
            });
        updateBtn.textContent = 'Update Follows';
        searchBar.appendChild(updateBtn);
        updateBtn.addEventListener('click', function() {
            batoto.followsList.update(function() {
                self.runMatch('all');
                if (self.matchesHidden) {
                    self.matchesVisibility('hide');
                }
            });
        }, false);
    }
};

batoto.p_comicDir = {
    main: function() {
        if (GM_config.get('batoto_comicsPopup_comicDir')) {
            batoto.setComicPopup();
        }
    }
};

batoto.p_comic = {
    main: function() {
        if (GM_config.get('batoto_comicsPopup_comic')) {
            batoto.setComicPopup();
        }
        if (GM_config.get('i_batoto_mu')) {
            this.addInterlinkBtn('mu', 'Search in MangaUpdates');
        }
        if (GM_config.get('i_batoto_mal')) {
            this.addInterlinkBtn('mal', 'Search in MyAnimeList');
        }
        if (GM_config.get('batoto_hyperlinkDesc')) {
            this.doHyperlinkDesc();
        }
        if (GM_config.get('batoto_showMoreRecentBtn')) {
            this.addShowMoreRecentBtn();
        }
        if (GM_config.get('batoto_autoOpenImgSpoilers') || GM_config.get('batoto_addSpoilersType')) {
            this.doSpoilersTweaks();
        }
        if (GM_config.get('batoto_fixPageTitle')) {
            this.fixPageTitle();
        }
    },

    addInterlinkBtn: function(target, title) {
        var comicTitle = document.getElementsByClassName('ipsType_pagetitle')[0],
            comicName = comicTitle.textContent.replace(/\(doujinshi\)/gi, '(Doujin)'),
            iconUrl = getResource(target + '_icon'),
            button = createImgBtn(title, 'bmf_interlink_btn ipsButton_secondary', iconUrl);
        comicTitle.insertBefore(button, comicTitle.firstChild);
        interlinks.getUrl(target, comicName, location.href, function(url) {
            button.href = url;
        });
        button.addEventListener('click', function(event) {
            if (!event.ctrlKey || !event.shiftKey) return;
            event.preventDefault();
            interlinks.saveFromPrompt(location.href, target);
        }, false);
    },

    doHyperlinkDesc: function() {
        var desc = document.getElementsByTagName('tbody')[0].children[6].children[1],
            regex = /(\b(https?):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/gim;
        desc.innerHTML = desc.innerHTML.replace(regex, '<a href="$1">$1</a>');
    },

    addShowMoreRecentBtn: function() {
        var btn = createElem('div', {
            id: 'bmf_show_recent_btn'
        });
        var a = createElem('a', {
            className: 'input_submit',
            href: '/comic/_/comics/?sort_col=record_saved&sort_order=desc'
        });
        a.textContent = 'Show More';
        btn.appendChild(a);
        querySelAll('.general_box')[2].appendChild(btn);
    },

    doSpoilersTweaks: function() {
        var spoilers = document.getElementsByClassName('bbc_spoiler_wrapper'),
            autoOpen = GM_config.get('batoto_autoOpenImgSpoilers'),
            addType = GM_config.get('batoto_addSpoilersType'),
            spoiler, imgs, text, type;
        for (var i = 0, len = spoilers.length; i < len; i++) {
            spoiler = spoilers[i];
            imgs = spoiler.getElementsByClassName('bbc_img').length !== 0;
            text = spoiler.textContent.trim() !== '';
            if (imgs && !text && autoOpen) {
                spoiler.previousElementSibling.value = 'Hide';
                spoiler.firstElementChild.style.display = '';
            }
            if (addType) {
                if (!imgs && text) {
                    type = 'Spoiler (Text)';
                } else if (imgs && text) {
                    type = 'Spoiler (Text/Image)';
                } else if (imgs && !text) {
                    type = 'Spoiler (Image)';
                }
                spoiler.parentNode.firstElementChild.textContent = type;
            }
        }
    },

    fixPageTitle: function() {
        document.title = document.title.split('- Scanlations ')[0] + '- Batoto';
    }
};

batoto.p_group = {
    main: function() {
        if (GM_config.get('batoto_comicsPopup_group')) {
            batoto.setComicPopup();
        }
    }
};

batoto.p_forums = {
    main: function() {
        if (GM_config.get('batoto_comicsPopup_forums')) {
            batoto.setComicPopup();
        }
    }
};


//-----------------------------------------------------
// MangaUpdates
//-----------------------------------------------------

var mu = {
    init: function() {
        ready(function() {

            var url = location.href;
            if (/\/series\.html\?(?:.+&|&?)id=[^&]+/.test(url)) {
                mu.p_comic.main();
            }
            mu.addOptionsButton();

        });
    },

    comicIdRegex: /mangaupdates\.com\/series\.html\?(?:.+&|&?)id=([^&]+)/i,

    getComicId: function(url) {
        if (!url) return null;
        var id = url.match(mu.comicIdRegex);
        return id !== null ? id[1] : id;
    },

    addOptionsButton: function() {
        var trBtn = createElem('tr'),
            tr = createElem('tr'),
            td = createElem('td'),
            a = document.createElement('a');
        trBtn.className = 'newsname',
        trBtn.appendChild(a);
        td.height = '15',
        tr.appendChild(td);
        a.textContent = 'Open BMF Opts';
        a.style.color = 'rgb(49, 70, 110)';
        a.addEventListener('click', function() {
            GM_config.open();
        }, false);
        document.querySelector('#right_row2 tbody').appendChild(tr);
        document.querySelector('#right_row2 tbody').appendChild(trBtn);
    }
};

//------------------
// Specific pages
//------------------

mu.p_comic = {
    main: function() {
        if (GM_config.get('i_mu_mal')) {
            this.addInterlinkBtn('mal', ' Search in MyAnimeList');
        }
        if (GM_config.get('i_batoto_mu')) {
            this.addInterlinkBtn('batoto', ' Search in Batoto');
        }
    },

    addInterlinkBtn: function(target, title) {
        var comicTitle = document.getElementsByClassName('releasestitle')[0],
            comicName = comicTitle.textContent;
        if (comicName.indexOf('(Novel)') === -1) {
            var button = createImgBtn(title, 'bmf_interlink_btn', getResource(target + '_icon'));
            comicTitle.parentNode.insertBefore(button, comicTitle);
            interlinks.getUrl(target, comicName, location.href, function(url) {
                button.href = url;
            });
            button.addEventListener('click', function(event) {
                if (!event.ctrlKey || !event.shiftKey) return;
                event.preventDefault();
                interlinks.saveFromPrompt(location.href, target);
            }, false);
        }
    }
};


//-----------------------------------------------------
// MyAnimeList
//-----------------------------------------------------

var mal = {
    init: function() {
        ready(function() {

            if (/manga/.test(path)) {
                mal.p_comic.main();
            }
            mal.addOptionsButton();

        });
    },

    comicIdRegex: /myanimelist\.net\/manga\/(\d+)/i,

    getComicId: function(url) {
        if (!url) return null;
        var id = url.match(mal.comicIdRegex);
        return id !== null ? id[1] : id;
    },

    addOptionsButton: function() {
        var toolbox = querySel('#footer-block > div.footer-link-block'),
            btn = createElem('p', {
                className: 'footer-link login di-ib',
                children: [
                    createElem('a', {
                        href: 'javascript:void(0)',
                        textContent: 'Open BMF Options',
                        onclick: function() {
                            GM_config.open();
                        }
                    })
                ]
            });
        toolbox.appendChild(btn);
    }
};

mal.p_comic = {
    main: function() {
        if (GM_config.get('i_mu_mal')) {
            this.addInterlinkBtn('mu', 'Search in MangaUpdates');
        }
        if (GM_config.get('i_batoto_mal')) {
            this.addInterlinkBtn('batoto', 'Search in Batoto');
        }
    },

    addInterlinkBtn: function(target, title) {
        var comicTitle = querySel('#contentWrapper h1 span'),
            comicName = comicTitle.textContent,
            button = createImgBtn(title, 'bmf_interlink_btn', getResource(target + '_icon'));
        comicTitle.parentNode.insertBefore(button, comicTitle);
        interlinks.getUrl(target, comicName, location.href, function(url) {
            button.href = url;
        });
        button.addEventListener('click', function(event) {
            if (!event.ctrlKey || !event.shiftKey) return;
            event.preventDefault();
            interlinks.saveFromPrompt(location.href, target);
        }, false);
    }
};


//-----------------------------------------------------
// Interlinks between sites
//-----------------------------------------------------

var interlinks = {
    getUrl: function(targetName, comicName, sourceUrl, callback) {
        var target = this.sites[targetName],
            targetId, source, sourceName, sourceId, searchRequest, savedUrl, temporalUrl;
        if (sourceUrl) {
            for (sourceName in this.sites) {
                source = this.sites[sourceName];
                if (source.urlRegex.test(sourceUrl)) {
                    sourceId = source.getId(sourceUrl);
                    if (sourceId) {
                        savedUrl = this.getSaved(sourceName, sourceId, targetName);
                        if (savedUrl) {
                            callback(savedUrl, 'saved');
                            return;
                        }
                    }
                    break;
                }
            }
        }
        if (!savedUrl) {
            if (GM_config.get('i_searchEngine') === 'Google') {
                searchRequest = googleRequest;
            } else if (GM_config.get('i_searchEngine') === 'DuckDuckGo') {
                searchRequest = duckRequest;
            }
            temporalUrl = searchRequest(comicName, target.queryUrl, function(res) {
                if (res.success && res.finalUrl.indexOf(target.queryUrl) !== -1) {
                    callback(res.finalUrl, 'finalUrl');
                    targetId = target.getId(res.finalUrl);
                    if (GM_config.get('i_saveUrls') && sourceId && targetId) {
                        interlinks.save(sourceName, sourceId, targetName, targetId);
                    }
                } else if (res.finalUrl !== 'not supported') {
                    callback(res.searchUrl, 'search');
                }
            });
            callback(temporalUrl, 'temporal');
        }
    },

    getSaved: function(sourceName, sourceId, targetName) {
        var key = 'interlinks_' + sourceName + '->' + targetName,
            stored = getStorage(key),
            targetId;
        if (!stored) {
            return false;
        }
        targetId = stored[sourceId];
        if (targetId) {
            return this.sites[targetName].comicUrl.replace('$comicId$', targetId);
        }
        return false;
    },

    save: function(sourceName, sourceId, targetName, targetId) {
        var key = 'interlinks_' + sourceName + '->' + targetName,
            stored = getStorage(key);
        if (!stored) {
            stored = {};
        }
        if (targetId === false) {
            delete stored[sourceId];
        } else {
            stored[sourceId] = targetId;
        }
        setStorage(key, stored);
    },

    saveFromPrompt: function(sourceUrl, targetName) {
        var sourceName, source, sourceId, userUrl, target, targetId;
        for (sourceName in this.sites) {
            source = this.sites[sourceName];
            if (source.urlRegex.test(sourceUrl)) {
                sourceId = source.getId(sourceUrl);
                break;
            }
        }
        if (!sourceId) {
            alert('Sorry. Couldn\'t get the ID for the comic here.');
            return;
        }
        userUrl = prompt('Write the URL for ' + targetName.toUpperCase() +
            ' (leave empty to remove):');
        if (userUrl === null) return;
        userUrl = userUrl.trim();
        if (userUrl === '') {
            this.save(sourceName, sourceId, targetName, false);
            alert('Removed successfully.');
            return;
        }
        target = this.sites[targetName];
        if (!target.urlRegex.test(userUrl)) {
            alert('Doesn\'t look like a valid URL for ' + targetName.toUpperCase() + '.');
            return;
        }
        targetId = this.sites[targetName].getId(userUrl);
        if (!targetId) {
            alert('Sorry. Couldn\'t get the ID for the comic.');
            return;
        }
        this.save(sourceName, sourceId, targetName, targetId);
        alert('Saved successfully.');
    },

    sites: {
        batoto: {
            urlRegex: /(bato\.to)|(batoto\.net)/i,
            getId: batoto.getComicId,
            comicUrl: 'http://bato.to/comic/_/comics/-r$comicId$',
            queryUrl: 'bato.to/comic/_/'
        },
        mu: {
            urlRegex: /mangaupdates\.com/i,
            getId: mu.getComicId,
            comicUrl: 'https://www.mangaupdates.com/series.html?id=$comicId$',
            queryUrl: 'mangaupdates.com/series.html?'
        },
        mal: {
            urlRegex: /myanimelist\.net/i,
            getId: mal.getComicId,
            comicUrl: 'http://myanimelist.net/manga/$comicId$',
            queryUrl: 'myanimelist.net/manga/'
        }
    }
};


//-----------------------------------------------------
// CSS
//-----------------------------------------------------

var CSS = {
    load: function(site) {
        if (!document.head) {
            setTimeout(function() {
                CSS.load(site);
            }, 1);
            return;
        }
        GM_addStyle(this[site]());
    },

    batoto: function() {
        var css = [
            // various
            '.bmf_following_icon {',
                'vertical-align: top;',
                'margin-left: 1px; }',

            '.general_box.clearfix img {',
                'vertical-align: bottom; }',

            '#pu_____hover___comicPopup_inner .ipsBox td {',
                'padding: 4px; }',

            '#pu_____hover___comicPopup_inner .ipsBox td span ~ span {',
                'display: none !important; }',

            '#pu_____hover___comicPopup_inner .ipsBox tr:last-child {',
                'display: none; }',

            'body table.ipb_table td {',
                'padding: ' + GM_config.get('batoto_followRowsHeight') + '; }',

            'body .chapters_list td {',
                'padding: 3px 3px 4px 3px !important; }',

            // search
            '.bmf_hide_matches .bmf_match {',
                'display: none; }',

            '.bmf_mismatch .bmf_following_icon {',
                'display: none; }',

            '#bmf_upd_follows_btn {',
                'position: absolute;',
                'top: 10px;',
                'left: 110px;',
                'font-weight: normal; }',

            // old follows
            '.bmf_sort_btn {',
                'float: right;',
                'margin : 0 0 0 5px !important;',
                'min-width: 50px !important;',
                'height: 26px !important;',
                'line-height: 26px !important;',
                'padding: 0 11px !important;',
            batoto.getTheme() === 'sylo' ? 'font-size: 11px;' : '',
                'font-family: helvetica,arial,sans-serif; }',

            '.clearfix > h3.maintitle {',
                'line-height: 26px;',
                'padding-top: 11px;',
                'padding-bottom: 11px; }',

            '.bmf_hide_read .bmf_read, ',
                '.bmf_hide_reading .bmf_reading, ',
                '.bmf_hide_noreads .bmf_noreads {',
                'display: none; }',

            '.bmf_read sup {',
                'display: none; }',

            '.bmf_info_row > td {',
                'padding: 0px !important;',
                'border: none !important; }',

            '.bmf_info_row .ipsBox {',
                'background-color: transparent; }',

            '.bmf_info_button {',
                'padding: 0px 8px;',
                'margin-right: 3px;',
                'background-repeat: no-repeat;',
                'background-position: center;',
                'background-image: url(' + getResource('batoto_infoIcon') + '); }',

            '#bmf_total_follows {',
                'font-size: 12px;',
                'padding-left: 8px;',
                'color: ' + GM_config.get('batoto_totalTextColor') + ';',
                'display: inline;',
                'vertical-align: baseline;',
                'line-height: 12px; }',

            'table .row0 ~ .row0 > td:last-child > div, table .row1 ~ .row1 > td:last-child > div {',
                'vertical-align: -3px; }',

            'table .row0 + .row0 > td > div, table .row1 + .row1 > td > div {',
                'vertical-align: -5px; }',

            // comic page
            '.bmf_interlink_btn {',
                'display: inline-block !important;',
                'width: 28px;',
                'height: 28px !important;',
                'vertical-align: -2px !important;',
                'text-align: center;',
                'margin: 0px 8px 0px 0px !important;',
                'padding: 0px !important; }',

            '.bmf_interlink_btn img {',
                'padding: 6px;',
                'margin: 0px !important;',
                'vertical-align: -2px !important; }',

            '#bmf_show_recent_btn {',
                'width: 100%;',
                'margin-top: 5px;',
                'position: absolute;',
                'display: flex; }',

            '#bmf_show_recent_btn a {',
                'margin: 0 auto;',
                'font-weight: bold;',
                'font-size: 12px; }'

        ].join('');

        if (GM_config.get('batoto_hideBloodHeader') && batoto.getTheme() === 'blood') {
            css += [

                '#branding { ',
                    'position: absolute !important; } '

            ].join('');
        }

        var customPrimary = readCookie('customPrimary'),
            customSecondary = readCookie('customSecondary'),
            customPattern = readCookie('customPattern');
        if (batoto.getTheme() === 'subway' && (customPrimary || customSecondary || customPattern)) {
            if (customPrimary) {
                css += ".cpe #primary_nav, .cpe .maintitle, .cpe #community_app_menu > li.active > a, .cpe .col_c_icon img[src*='f_'], .cpe .f_icon, .cpe .topic_buttons li a, .cpe .pagination .pages li.active, .cpe #primary_extra_menucontent, .cpe #more_apps_menucontent, .cpe .post_block h3, .cpe .mini_pagination a, .cpe .user_controls li a, .cpe #vnc_filter_popup_close, .cpe #search .submit_input, .cpe .col_f_icon img, .cpe .ipsBadge_green, body.cpe #logo, .cpe #themeToggle, .cpe #primary_extra_menucontent, .cpe #more_apps_menucontent, .cpe .submenu_container{ background-color: #" + customPrimary + ';}.cpe .forum_name a, .cpe .subforums a{ color: #' + customPrimary + ';}';
            }
            if (customSecondary) {
                css += 'body.cpe, #themeEditor #editPattern span, .cpe #socialLinks li, .cpe #secondary_navigation, .cpe ul.post_controls a:hover, .cpe .answerBadgeInPost, .cpe .ipsLikeButton.ipsLikeButton_enabled, .input_submit, .cpe .ipsTag{ background-color: #' + customSecondary + ';}.cpe ul.post_controls a{ color: #' + customSecondary + ';}';
            }
            if (customPattern) {
                css += 'body.cpe, .cpe #logo, .cpe #primary_nav, .cpe #community_app_menu > li.active > a, .cpe #themeToggle {background-image: url(http://bato.to/forums/public/style_images/subway/patterns/' + customPattern + ');}';
            }
        }

        return css;
    },

    mu: function() {
        var css = [
            // comic page
            '.bmf_interlink_btn {',
                'background: #e4e4e4;',
                'background: linear-gradient(to bottom ,#f6f6f6, #d7d7d7);',
                'box-shadow: -1px 1px 0px 0px #dfdcdc inset, 1px -1px 0px 0px #bfbfbf inset;',
                'border-radius: 4px;',
                'display: inline-block;',
                'width: 28px;',
                'height: 28px;',
                'margin-right: 5px;',
                'vertical-align: -6px;',
                'text-align: center; }',

            '.bmf_interlink_btn img {',
                'padding: 5px;',
                'vertical-align: 0;',
                'margin-top: 1px; }'

        ].join('');

        return css;
    },

    mal: function() {
        var css = [
            // comic page
            '.bmf_interlink_btn {',
                'background: #e4e4e4;',
                'background: linear-gradient(to bottom ,#f6f6f6, #d7d7d7);',
                'box-shadow: -1px 1px 0px 0px #dfdcdc inset, 1px -1px 0px 0px #bfbfbf inset;',
                'border-radius: 4px;',
                'display: inline-block;',
                'width: 28px;',
                'height: 28px;',
                'margin-right: 5px;',
                'vertical-align: -6px;',
                'text-align: center; }',

            '.bmf_interlink_btn img {',
                'padding: 5px;',
                'vertical-align: 0;',
                'margin-top: 1px; }'

        ].join('');

        return css;
    }
};


//-----------------------------------------------------
// Utility functions
//-----------------------------------------------------

function googleRequest(query, queryUrl, callback) {
    var encodedQuery = query.toLowerCase().replace(/\||-|~|"|\*|:/g, ' ').replace(/\s+/g, ' '),
        encodedQuery = encodeURIComponent(encodedQuery),
        encodedQueryUrl = encodeURIComponent(queryUrl),
        temporalUrl = 'https://www.google.com/webhp?#btnI=I&q=' + encodedQuery + '&sitesearch=' + encodedQueryUrl,
        requestUrl = 'https://www.google.com/search?btnI=I&q=' + encodedQuery + '&sitesearch=' + encodedQueryUrl,
        searchUrl = 'https://www.google.com/search?q=' + encodedQuery + '&sitesearch=' + encodedQueryUrl;
    GM_xmlhttpRequest({
        method: 'HEAD',
        url: requestUrl,
        headers: {
            referer: 'https://www.google.com/'
        },
        onload: function(response) {
            var finalUrl = response.finalUrl;
            callback({
                'success': (finalUrl && finalUrl.indexOf('https://www.google.com/') !== 0),
                'query': query,
                'queryUrl': queryUrl,
                'finalUrl': finalUrl || 'not supported',
                'searchUrl': searchUrl
            });
        }
    });
    return temporalUrl;
}

function duckRequest(query, queryUrl, callback) {
    var encodedQuery = query.toLowerCase().replace(/\\|"|!|-|:/g, ' ').replace(/\s+/g, ' '),
        encodedQuery = encodeURIComponent(encodedQuery),
        encodedQueryUrl = encodeURIComponent(queryUrl),
        requestUrl = 'https://duckduckgo.com/?kp=-1&q=%5C' + encodedQuery + '+site%3A' + encodedQueryUrl,
        searchUrl = 'https://duckduckgo.com/?kp=-1&q=' + encodedQuery + '+site%3A' + encodedQueryUrl;
    GM_xmlhttpRequest({
        method: 'GET',
        url: requestUrl,
        onload: function(response) {
            var finalUrl = response.responseText.match(/&uddg=(.+?)'/);
            finalUrl = decodeURIComponent(finalUrl[1]);
            callback({
                'success': (finalUrl && finalUrl.indexOf('https://duckduckgo.com/') !== 0),
                'query': query,
                'queryUrl': queryUrl,
                'finalUrl': finalUrl || false,
                'searchUrl': searchUrl
            });
        }
    });
    // temporalUrl = requestUrl
    return requestUrl;
}

function getStorage(key, GM) {
    var value = GM ? GM_getValue('BMF_' + key) : localStorage.getItem('BMF_' + key);
    if (value !== undefined && value !== null) {
        value = JSON.parse(value);
    }
    return value;
}

function setStorage(key, value, GM) {
    if (GM) {
        GM_setValue('BMF_' + key, JSON.stringify(value));
    } else {
        localStorage.setItem('BMF_' + key, JSON.stringify(value));
    }
}

function decodeHtmlEntity(encoded) {
    var div = document.createElement('div');
    div.innerHTML = encoded;
    return div.firstChild.nodeValue;
}

function createImgBtn(title, className, src, href) {
    var button = createElem('a', {
        title: title || '',
        className: className || '',
        href: href || 'javascript:void(0)'
    });
    var img = createElem('img', {
        src: src,
        alt: ''
    });
    button.appendChild(img);
    return button;
}

function querySel(selector, doc) {
    doc = doc || document;
    return doc.querySelector(selector);
}

function querySelAll(selector, doc, toArray) {
    doc = doc || document;
    var nodes = doc.querySelectorAll(selector);
    return toArray ? [].slice.call(nodes, 0) : nodes;
}

function createElem(tag, props, doc) {
    doc = doc || document;
    var elem = typeof tag === 'object' ? tag : doc.createElement(tag);
    if (props) {
        for (var key in props) {
            var prop = props[key];
            switch (key) {
                case 'children':
                    for (var i = 0; i < prop.length; i++) {
                        elem.appendChild(prop[i]);
                    }
                    break;
                case 'className':
                case 'value':
                case 'disabled':
                case 'textContent':
                case 'readOnly':
                case 'innerHTML':
                    elem[key] = prop;
                    break;
                default:
                    if (key.indexOf('on') === 0) {
                        elem.addEventListener(key.substring(2), prop, false);
                    } else {
                        elem.setAttribute(key, prop);
                    }
            }
        }
    }
    return elem;
}

function createElemHTML(html, doc) {
    doc = doc || document;
    var elem = doc.createElement('div');
    elem.innerHTML = html;
    return elem.firstElementChild;
}

function toCharObject(stringArray) {
    var object = {},
        firstChar;
    for (var i = 0, len = stringArray.length; i < len; i++) {
        firstChar = stringArray[i].charAt(0);
        object[firstChar] = object[firstChar] || [];
        object[firstChar].push(stringArray[i]);
    }
    return object;
}

function inCharObject(charObject, string) {
    var charArray = charObject[string.charAt(0)] || [];
    return (charArray.indexOf(string) !== -1);
}

function ready(callback) {
    ready.queue = ready.queue || [];
    ready.fired = ready.fired || false;

    if (ready.fired) {
        setTimeout(callback, 0);
        return;
    } else if (document.readyState === 'complete') {
        ready.fired = true;
        setTimeout(callback, 0);
        return;
    }
    if (!ready.whenReady) {
        ready.whenReady = function() {
            if (!ready.fired) {
                ready.fired = true;
                for (var i = 0; i < ready.queue.length; i++) {
                    ready.queue[i].call(window);
                }
                ready.queue = [];
            }
        };
        document.addEventListener('DOMContentLoaded', ready.whenReady, false);
        document.onreadystatechange = function() {
            if (document.readyState === 'complete') {
                ready.whenReady();
            }
        };
    }
    ready.queue.push(callback);
}

function reload() {
    Window.stop();
    setTimeout(function() {
        location.reload();
    }, 0);
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = '; expires=' + date.toGMTString();
    } else var expires = '';
    document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, '', -1);
}

function getResource(key) {
    var res = getStorage('resource_' + key, true),
        config = GM_config.get(key);
    if ((!res || !res.base64) && config) {
        updateResource(key, config);
        return config;
    } else if (!config) {
        console.log('BMF: No resource nor config for:' + key);
        return null;
    }
    return res.base64;
}

function updateResource(key, url) {
    var res = getStorage('resource_' + key, true);
    if (GM_xmlhttpRequest && (!res || !res.base64 || res.url !== url)) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            overrideMimeType: 'text/plain; charset=x-user-defined',
            onload: function(response) {
                res = {
                    url: url,
                    base64: 'data:image/png;base64,' + btoa(response.responseText.replace(/[\u0100-\uffff]/g, function(c) {
                        return String.fromCharCode(c.charCodeAt(0) & 0xff);
                    }))
                };
                setStorage('resource_' + key, res, true);
            },
            onfail: function(response) {
                console.log('BMF: Could\'nt update resource:', key, url, response);
            }
        });
    }
}


//-----------------------------------------------------
// Run Script (GM_config and then BMF)
//-----------------------------------------------------

GM_config.init({
    id: 'BMF_Options',
    title: 'BMF Options',
    css: '.section_desc { text-align: left !important; } .section_desc, .section_header { margin: 18px 0 6px !important; }',
    events: {
        save: function() {
            // update icons
            for (var id in GM_config.fields) {
                if (GM_config.fields[id].settings.label.match(/Icon URL:/)) {
                    updateResource(id, GM_config.get(id), true);
                }
            }
            // update subway theme cookies
            var customPrimary = GM_config.get('batoto_s_customPrimary').trim();
            if (customPrimary !== '') {
                eraseCookie('customPrimary');
                createCookie('customPrimary', customPrimary, 360);
            }
            var customSecondary = GM_config.get('batoto_s_customSecondary').trim();
            if (customSecondary !== '') {
                eraseCookie('customSecondary');
                createCookie('customSecondary', customSecondary, 360);
            }
        }
    },
    fields: {
        // Interlinks
        'i_searchEngine': {
            'label': 'Search Engine:',
            'section': ['Interlinks'],
            'options': [
                    'Google',
                    'DuckDuckGo'
            ],
            'type': 'select',
            'default': 'Google'
        },
        'i_saveUrls': {
            'type': 'checkbox',
            'label': 'Save URLs.',
            'title': 'You can also edit them manually by doing CTRL + SHIFT + CLICK on the buttons',
            'default': true
        },
        'i_batoto_mu': {
            'section': [undefined, 'Add links in the comic pages between:'],
            'label': 'Batoto and Mangaupdates.',
            'type': 'checkbox',
            'default': true
        },
        'i_batoto_mal': {
            'type': 'checkbox',
            'label': 'Batoto and MyAnimeList.',
            'default': true
        },
        'i_mu_mal': {
            'type': 'checkbox',
            'label': 'Mangaupdates and MyAnimeList.',
            'default': true
        },

        //====== Batoto ======
        'batoto_icon': {
            'label': 'Icon URL:',
            'section': ['Batoto'],
            'type': 'text',
            'size': 100,
            'default': 'https://bato.to/forums/favicon.ico'
        },
        'batoto_infoIcon': {
            'label': 'Info Icon URL:',
            'type': 'text',
            'size': 100,
            'default': 'https://bato.to/forums/public/style_images/master/information.png'
        },
        'batoto_followingIcon': {
            'label': 'Following Icon URL:',
            'type': 'text',
            'size': 100,
            'default': 'https://bato.to/forums/public/style_images/master/star.png'
        },
        'batoto_comicsPopupDelay': {
            'label': 'Comic popup/hovercard delay (ms):',
            'title': 'Opens while hovering a URL to a comic page.',
            'type': 'unsigned int',
            'size': 5,
            'default': 1000
        },
        'batoto_defaultToOldFollows': {
            'type': 'checkbox',
            'label': "Set 'Old Follows' as default.",
            'title': 'Replace links in the upper toolbar.',
            'default': true
        },
        // Subway Theme
        'batoto_s_customPrimary': {
            'label': 'Primary color (Hex):',
            'section': [undefined, 'Subway Theme:'],
            'type': 'text',
            'size': 10,
            'default': '59b6dd'
        },
        'batoto_s_customSecondary': {
            'label': 'Secondary color (Hex):',
            'type': 'text',
            'size': 10,
            'default': '333535'
        },
        // Blood Theme
        'batoto_hideBloodHeader': {
            'section': [undefined, 'Blood Theme:'],
            'type': 'checkbox',
            'label': 'Make the header scroll with the page.',
            'default': true
        },
        // Home Page
        'batoto_followingIcon_home': {
            'section': [undefined, 'Home:'],
            'type': 'checkbox',
            'label': 'Add icon to follows.',
            'default': true
        },
        // Old Follows Page
        'batoto_autoSort': {
            'section': [undefined, 'Old Follows:'],
            'type': 'checkbox',
            'label': 'Sort follows automatically.',
            'default': true
        },
        'batoto_defaultSort': {
            'label': 'Default sort:',
            'options': [
                    "Last Update's Date",
                    "Last Update's Ch",
                    "Last Read's Date",
                    "Last Read's Ch",
                    'Unread Chs',
                    'Title'
            ],
            'type': 'select',
            'default': "Last Update's Date"
        },
        'batoto_adaptSortButton': {
            'type': 'checkbox',
            'label': 'Adapt the color of the sorting buttons to the theme (Subway).',
            'default': true
        },
        'batoto_addInfoBtns': {
            'type': 'checkbox',
            'label': 'Add info button to follows.',
            'default': true
        },
        'batoto_showTotalFollows': {
            'type': 'checkbox',
            'label': 'Add text showing the total of follows.',
            'default': true
        },
        'batoto_totalTextColor': {
            'label': 'Text color of the total of follows:',
            'type': 'text',
            'size': 15,
            'default': '#EEEEEE'
        },
        'batoto_addBoxToNewFollows': {
            'type': 'checkbox',
            'label': "Add box linking to 'New Follows'.",
            'default': true
        },
        'batoto_categorizeFollows': {
            'type': 'checkbox',
            'label': 'Categorize follows.',
            'default': true
        },
        'batoto_followRowsHeight': {
            'label': 'Height of the rows of follows.',
            'type': 'text',
            'size': 4,
            'default': '12px'
        },
        // Comic Search Page
        'batoto_followingIcon_search': {
            'section': [undefined, 'Comic Search:'],
            'type': 'checkbox',
            'label': 'Add icon to follows.',
            'default': true
        },
        // Comic Directory Page
        'batoto_comicsPopup_comicDir': {
            'section': [undefined, 'Comic Directory:'],
            'type': 'checkbox',
            'label': 'Enable comic info popup/hovercard.',
            'title': 'Opens while hovering a URL to a comic page.',
            'default': true
        },
        // Comic Page
        'batoto_hyperlinkDesc': {
            'section': [undefined, 'Comic:'],
            'type': 'checkbox',
            'label': 'Hyperlink description.',
            'default': true
        },
        'batoto_showMoreRecentBtn': {
            'type': 'checkbox',
            'label': "Add a 'Show more' button under 'Recently Added Comics'.",
            'default': true
        },
        'batoto_comicsPopup_comic': {
            'type': 'checkbox',
            'label': 'Enable comic info popup/hovercard.',
            'title': 'Opens while hovering a URL to a comic page.',
            'default': true
        },
        'batoto_addSpoilersType': {
            'type': 'checkbox',
            'label': 'Add text indicating the content of each spoiler (Text/Image).',
            'default': true
        },
        'batoto_autoOpenImgSpoilers': {
            'type': 'checkbox',
            'label': 'Auto open image spoilers.',
            'default': true
        },
        'batoto_fixPageTitle': {
            'type': 'checkbox',
            'label': 'Shorter comic page title.',
            'title': "Replaces '- Scanlations - Comic - Comic Directory - Batoto - Batoto Home.' with '- Batoto'.",
            'default': true
        },
        // Group Page
        'batoto_comicsPopup_group': {
            'section': [undefined, 'Group:'],
            'type': 'checkbox',
            'label': 'Enable comic info popup/hovercard.',
            'title': 'Opens while hovering a URL to a comic page.',
            'default': false
        },
        // Forums
        'batoto_comicsPopup_forums': {
            'section': [undefined, 'Forums:'],
            'type': 'checkbox',
            'label': 'Enable comic info popup/hovercard.',
            'title': 'Opens while hovering a URL to a comic page.',
            'default': true
        },

        //====== MangaUpdates ======
        'mu_icon': {
            'label': 'Icon URL:',
            'section': ['MangaUpdates'],
            'type': 'text',
            'size': 100,
            'default': 'https://www.mangaupdates.com/favicon.ico'
        },

        //====== MyAnimeList ======
        'mal_icon': {
            'label': 'Icon URL:',
            'section': ['MyAnimeList'],
            'type': 'text',
            'size': 100,
            'default': 'http://cdn.myanimelist.net/images/faviconv5.ico'
        }
    }
});


var Window = this.unsafeWindow || unsafeWindow || window,
    host = location.host,
    path = location.pathname;

if (host === 'bato.to') {
    CSS.load('batoto');
    batoto.init();
} else if (host === 'www.mangaupdates.com') {
    CSS.load('mu');
    mu.init();
} else if (host === 'myanimelist.net') {
    CSS.load('mal');
    mal.init();
}


if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Open BMF Options', function() {
        GM_config.open();
    });
}