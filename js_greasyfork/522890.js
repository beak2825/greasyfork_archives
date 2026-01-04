// ==UserScript==
// @name         Kinopoisk - Add to folder
// @namespace    scriptomatika
// @author       mouse-karaganda
// @description  Добавить фильм в папку
// @license      MIT
// @match        https://*.kinopoisk.ru/film/*
// @match        https://*.kinopoisk.ru/series/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinopoisk.ru
// @version      1.9
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522890/Kinopoisk%20-%20Add%20to%20folder.user.js
// @updateURL https://update.greasyfork.org/scripts/522890/Kinopoisk%20-%20Add%20to%20folder.meta.js
// ==/UserScript==

(function() {
    let $ = window.jQuery;
    console.log('kinoscript :: userscript run at == ', location.href);

    let cls = {
        opened: 'opened',
        selected: 'selected'
    };

    let poisk = {};

    let plugin = {
        createStyle: function() {
            if ($('style[name="kinoscript"]').length > 0) {
                return;
            }
            let styleText = [
                '.styles_userFoldersContainer { margin-bottom: 24px; --ks-padding: 12px; }',
                '.styles_userFoldersContainer .container_outer { font-weight: bold; }',
                '.styles_userFoldersContainer .container_outer .button { margin: 0 8px; }',
                '.styles_userFoldersContainer .btn_outer { display: flex; justify-content: center; cursor: pointer; color: #3bb33b; }',
                '.styles_userFoldersContainer .btn_outer:hover { color: #266fff; }',
                '.styles_userFoldersContainer .btn_outer .arrow_right { transform: rotate(90deg); }',
                'div[class*=styles_rootDark] .styles_userFoldersContainer .menu_outer { background-color: #000000; color: white; }',
                '.styles_userFoldersContainer .menu_outer { position: absolute; left: 0; right: 0; margin-top: var(--ks-padding); padding: var(--ks-padding) 0; z-index: 10; border: 2px dotted #3bb33b; border-radius: var(--ks-padding); background-color: #ffffff; }',
                '.styles_userFoldersContainer .menu_inner { height: 250px; overflow-x: hidden; overflow-y: scroll; scrollbar-width: thin; }',
                '.styles_userFoldersContainer .menu_outer .item { display: flex; justify-content: space-between; padding: 8px 20px; margin: 4px 0; cursor: pointer; }',
                '.styles_userFoldersContainer .menu_outer .item:hover { background-color: rgba(0, 0, 0, 0.04) }',
                '.styles_userFoldersContainer .menu_outer .item:hover .button { color: #266fff; }',
                '.styles_userFoldersContainer .styles_foldersAll { margin-top: var(--ks-padding); text-align: center; }',
                '.styles_userFoldersContainer .styles_foldersAll a { text-decoration: none; }',

                '.styles_userFoldersContainer.opened .btn_outer .arrow_right,',
                '.styles_userFoldersContainer:not(.opened) .btn_outer .arrow_down,',
                '.styles_userFoldersContainer:not(.opened) .btn_outer .count,',
                '.styles_userFoldersContainer:not(.opened) .menu_outer,',
                '.styles_userFoldersContainer .menu_outer .item:not(.selected) .mark { display: none; }'
            ];
            $('<style name="kinoscript" type="text/css" />').appendTo(document.head)
                .text(styleText.join('\n'));
        },

        createFoldersButton: function() {
            let getYandexFolders = () => $('div[class*=styles_foldersMenu]').parents('div[class*=styles_userControlsContainer]');
            plugin.missingElement(getYandexFolders, plugin.insertFoldersButton);
        },

        insertFoldersButton: function(foldersMenu) {
            console.log('kinoscript :: folders old menu = ', foldersMenu);
            if (foldersMenu.length == 0) {
                return;
            }
            poisk.section = $('<div />').insertBefore(foldersMenu).addClass('styles_userFoldersContainer styles_section');
            console.log('kinoscript :: folders new section = ', poisk.section);

            poisk.link = $('<div />').addClass('container_outer btn_outer').appendTo(poisk.section).on('click', plugin.clickFolderList);
            $('<span />').addClass('arrow_down').text('🔻').appendTo(poisk.link);
            $('<span />').addClass('arrow_right').text('🔺').appendTo(poisk.link);
            $('<span />').addClass('button').text('Список папок').appendTo(poisk.link);
            poisk.count = $('<span />').addClass('count').text('(0)').appendTo(poisk.link);

            let menuOuter = $('<div />').addClass('menu_outer').appendTo(poisk.section);
            poisk.menu = $('<div />').addClass('menu_inner').appendTo(menuOuter);

            poisk.allFolders = $('<div />').addClass('container_outer styles_foldersAll').appendTo(menuOuter);
            let link = $('<a href="/mykp/folders/1/" target="_blank" />').appendTo(poisk.allFolders);
            $('<span />').text('👀').appendTo(link);
            $('<span />').addClass('button').text('Все папки').appendTo(link);
            poisk.allCount = $('<span />').addClass('count').text('(0)').appendTo(link);
        },

        clickFolderList: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            plugin.openFolderList(true);
        },

        openFolderList: function(toggleClass) {
            poisk.menu.empty();
            poisk.count.text('(0)');
            poisk.allCount.text('(0)');

            if (toggleClass) {
                // Открытое меню нужно закрыть
                if (poisk.section.hasClass(cls.opened)) {
                    poisk.section.removeClass(cls.opened);
                    return;
                }
            } else {
                if (!poisk.section.hasClass(cls.opened)) {
                    return;
                }
            }

            let afterToken = () => {
                let film = { id: plugin.getCurrentFilm() };

                $.post('/handler_mustsee_ajax.php?mode=multiple&rnd=' + plugin.random(), {
                    //mode: multiple | single
                    token: plugin.xsrftoken,
                    id_films: film.id
                }, function(data) {
                    console.log('kinoscript :: openFolderList POST = ', data);
                    poisk.section.addClass(cls.opened);
                    let selectedCount = 0;

                    data.folders.forEach((folder, index) => {
                        let info = {
                            'data-folderid': folder.id,
                            'data-filmid': film.id
                        };
                        let div = $('<div />').addClass('item').attr(info).appendTo(poisk.menu)
                            .on('click', plugin.toggleFilmToFolder);
                        $('<span />').addClass('button').html(folder.name).appendTo(div);
                        $('<span />').addClass('mark').text('✔️').appendTo(div);

                        if (film.id in data.objFolders) {
                            if (folder.id in data.objFolders[film.id]) {
                                div.addClass(cls.selected);
                                selectedCount++;
                            }
                        }
                    });
                    poisk.count.text(`(${selectedCount})`);
                    poisk.allCount.text(`(${data.folders.length})`);
                });
            };
            plugin.checkToken(afterToken);
        },

        toggleFilmToFolder: function(evt) {
            let item = $(this);
            let info = item.data();
            //console.log('kinoscript :: toggleFilmToFolder = ', info, this);

            let addToFolder = () => {
                let link = (`/handler_mykp/folders/${info.folderid}/film/${info.filmid}/`);
                $.post(link, {
                    token: plugin.xsrftoken
                }, function(data) {
                    //console.log('kinoscript :: toggleFilmToFolder POST add = ', data);
                    if (data.result == 'ok') {
                        plugin.openFolderList(false);
                    }
                });
            };
            let removeFromFolder = () => {
                $.get('/handler_mustsee_ajax.php', {
                    mode: 'del_film',
                    id_film: info.filmid,
                    from_folder: info.folderid,
                    //recount: 1,
                    recount: 0,
                    rnd: plugin.random(),
                    token: plugin.xsrftoken
                }, function(data) {
                    //console.log('kinoscript :: toggleFilmToFolder POST remove = ', data);
                    if (data.result == 'ok') {
                        plugin.openFolderList(false);
                    }
                });
            };
            let selected = item.hasClass(cls.selected);
            plugin.checkToken(selected ? removeFromFolder : addToFolder);
        },

        random: function() {
            return Math.round(Math.random() * 1e8);
        },

        cookie: function(name) {
            let exp = new RegExp('\\b' + encodeURIComponent(name) + '=(.+?)(;|$)');
            let match = document.cookie.match(exp);
            console.log('kinoscript :: cookie = ', exp, match);
            if (match) {
                return decodeURIComponent(match[1]);
            }
            return null;
        },

        getCurrentFilm: function() {
            let match = location.pathname.match(/\/(film|series)\/(\d+)/);
            if (match) {
                return match[2];
            }
            return '0';
        },

        missingElement: function(elemGetter, callback) {
            // Итерации 10 раз в секунду
            let missingOne = 100;
            // Ограничим количество попыток разумными пределами
            let maxIterCount = 3000;

            let elemTimer;
            let iterCount = 0;

            let missingHandler = () => {
                let elemList = elemGetter();
                // Определим, что вышел элемент
                let elemStop = (elemList.length > 0);
                // Определим, что кончилось количество попыток
                let iterStop = (iterCount >= maxIterCount);

                if (elemStop || iterStop) {
                    clearInterval(elemTimer);

                    // Если элемент так и не появился
                    if (!elemStop && iterStop) {
                        console.log('kinoscript :: Нет элемента = ', elemGetter.toString());
                        return;
                    }
                    if (elemList.length == 1) {
                        elemList = elemList.eq(0);
                    }
                    callback.call(plugin, elemList);
                }
                iterCount++;
            };
            elemTimer = setInterval(missingHandler, missingOne);
        },

        checkLocation: function () {
            return /(film|series)\/\d+\/?$/.test(location.pathname);
        },

        checkToken: function(callback) {
            if (plugin.xsrftoken) {
                callback();
            } else {
                // Запрос со страницы с папками
                $.get('/mykp/folders/1/', function(data) {
                    let match = data.match(/xsrftoken += +('.+');/);
                    if (match) {
                        console.log('kinoscript :: checkToken [%o] = ', eval(match[1]), match);
                        plugin.xsrftoken = eval(match[1]);
                        callback();
                    }
                });
            }
        },

        checkLibrary: function () {
            if (window.jQuery) {
                plugin.afterLoad();
            } else {
                let tagJS = document.createElement('script');
                tagJS.src = ('https://yastatic.net/jquery/3.3.1/jquery.min.js');
                tagJS.onload = plugin.afterLoad;
                document.body.append(tagJS);
            }
        },

        createChangeTimer: function() {
            $(window).on('kinochange', (evt) => {
                let loc = plugin.checkLocation();
                console.log('kinoscript :: kinochange [loc: %o] = %o', loc, location.href);
                console.log('kinoscript :: kinochange jQuery = %o, event = ', window.jQuery, evt);
                if (loc) {
                    plugin.createFoldersButton();
                }
            });

            let urlChanger = () => {
                if (!plugin.location) {
                    plugin.location = location.href;
                }
                // Если адрес страницы изменился
                if (plugin.location != location.href) {
                    $(window).trigger({
                        type: 'kinochange',
                        oldValue: plugin.location,
                        newValue: location.href
                    });
                    plugin.location = location.href;
                }
            };
            setInterval(urlChanger, 200);
            urlChanger();
        },

        afterLoad: function () {
            //window.jQuery.noConflict();
            $ = window.jQuery;
            console.log('kinoscript :: jQuery = ', $);

            plugin.createStyle();
            plugin.createChangeTimer();
            plugin.createFoldersButton();
        },

        start: function() {
            let loc = plugin.checkLocation();
            console.log('kinoscript :: plugin START [loc: %o] = ', loc, location.href);
            plugin.checkLibrary();

            window.addEventListener('popstate', (evt) => {
                // Эксперимент показал, что popstate на сайте не вызывается,
                // хотя внешний вид страницы изменяется. Вместо него будет
                // кастомное событие kinochange
                console.log('kinoscript :: popstate [%o] = ', location.href, evt);
            });
        }
    };

    plugin.start();

    console.log('Kinopoisk - Add to folder 💬 1.9');
})();