// ==UserScript==
// @name         Pikabu Enhancement Suite
// @version      1.4.8
// @license      CC-BY-SA-4.0
// @description  Новый новый дизайн пикабу. Не забудь установить юзерстиль.
// @author       NeverLoved
// @match        https://pikabu.ru/*
// @grant        none
// @namespace https://greasyfork.org/users/175168
// @downloadURL https://update.greasyfork.org/scripts/39640/Pikabu%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/39640/Pikabu%20Enhancement%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
    (function (arr) {
        arr.forEach(function (item) {
            if (item.hasOwnProperty('prepend')) {
                return;
            }
            Object.defineProperty(item, 'prepend', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function prepend() {
                    var argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();

                    argArr.forEach(function (argItem) {
                        var isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });

                    this.insertBefore(docFrag, this.firstChild);
                }
            });
        });
    })([Element.prototype, Document.prototype, DocumentFragment.prototype]);

    let _c;
    var defconfig = {
        "top_big_searchbar":false,
        "top_no_avatar":true,
        "porn_stealth":true,
        "restore_f":true,
        "great_comment_links":true,
        "post_header_collapse":true,
        "sidebar_icons":true,
        "sidebar_feed_link":false,
        "enable_nano_nav":true,
        "oldschool_favicon": false,

    };
    try {
        _c = JSON.parse(window.localStorage.getItem('enhancements'));
        if(!Object.keys(_c).length) {
            throw new Error('Empty');
        }
    } catch(e) {
        console.log('Config is empty, using defconfig');
        _c = defconfig;
    }

    var config = {
        values:_c,
        set:function(param, value) {
            this.values[param] = value;
            window.localStorage.setItem('enhancements', JSON.stringify(this.values));
        },
        get:function(param) {
            return this.values[param];
        }
    };

    function findParentByTag(el, tag) {
        while (el.parentNode) {
            el = el.parentNode;
            if (el.tagName === tag)
                return el;
        }
        return null;
    }

    function nodeIndex(node) {
        var children = node.parentNode.children;
        var num = 0;
        for (var i=0; i<children.length; i++) {
            if (children[i]==node) return num;
            if (children[i].nodeType==1) num++;
        }
        return -1;
    }

    var scrollTo = function(elem) {
        if(elem) {
            try {
                elem.scrollIntoView({behavior:'smooth', 'block':'start'});
            } catch(e) {
                console.log('Не удалось проскроллить к элементу', elem, e);
            }
        }
    };

    var scrollInstant = function(elem) {
        if(elem) {
            try {
                elem.scrollIntoView({behavior:'instant', 'block':'start'});
            } catch(e) {
                console.log('Не удалось проскроллить к элементу', elem, e);
            }
        }
    };


    if(window.location.pathname == '/settings') {
        var onchange = function(e) {
            let checkbox = e.target;
            config.set(checkbox.id, checkbox.checked);
        };

        var create_config_item = function(caption, id, value) {
            let checkbox = document.createElement('input');
            checkbox.setAttribute('id', id);
            checkbox.setAttribute('type', 'checkbox');
            if(value) {
                checkbox.checked = true;
            }
            checkbox.onchange = onchange;
            let label = document.createElement('label');
            label.innerText = caption;
            label.setAttribute('for', id);

            let tr = document.createElement('tr');
            tr.append(document.createElement('td'));
            tr.append(document.createElement('td'));
            tr.children[0].append(label);
            tr.children[1].append(checkbox);
            return tr;
        };

        var sett_table = document.createElement('table');
        sett_table.className = "enhanced_settings";
        var pew = document.createElement('style');
        pew.innerText = ".enhanced_settings [type=checkbox] { visibility: visible!important; }";
        document.body.append(pew);
        console.log(pew);
        [
            create_config_item("Иконки в меню сайдбара", 'sidebar_icons', config.get('sidebar_icons')),
            create_config_item('"Моя Лента" в правом меню', 'sidebar_feed_link', config.get('sidebar_feed_link')),
            create_config_item("Скрывать пост нажатием на пустое место в заголовке", 'post_header_collapse', config.get('post_header_collapse')),
            create_config_item("Скрытие просмотренных постов по F", 'restore_f', config.get('restore_f')),
            create_config_item("Включить плавающую навигацию справа", 'enable_nano_nav', config.get('enable_nano_nav')),
            create_config_item("Добавить нормальные ссылки на комментарии [#]", 'great_comment_links', config.get('great_comment_links')),
            create_config_item("Строка поиска всегда развёрнута", 'top_big_searchbar', config.get('top_big_searchbar')),
            create_config_item("Убрать быстрое меню в шапке", 'top_no_avatar', config.get('top_no_avatar')),
            create_config_item("Скрытная иконка клубнички", 'porn_stealth', config.get('porn_stealth')),
            create_config_item("Старая иконка сайта", 'oldschool_favicon', config.get('oldschool_favicon')),
        ].forEach(function(tr) { sett_table.append(tr); });
        document.querySelector('form[name="general"] section').append(sett_table);
        //document.querySelector('form[name="general"] .page-settings__table tbody').append();
    }

    var sidebar = document.querySelector('.sidebar aside');
    var top_menu = document.querySelector('header.header');
    var profile_info = sidebar.querySelector('.profile-info');
    var answers_link = sidebar.querySelector('.menu a.menu__item[href="/answers"]');
    var main_menu = answers_link.parentNode;
    var rating_container = profile_info.children[0];
    var subscribers_container = profile_info.children[1];

    var rating_val = 0;
    try {
        rating_val = JSON.parse(document.querySelector('[data-entry=initParams]').innerText).userKarma;
    } catch(e) {
        if((rating_val = rating_container.getAttribute('aria-label')) == null) {
            rating_val = rating_container.children[0].innerText;
            rating_val = parseFloat(rating_val.replace(/[^0-9.]/g, ''));
        }
    }

    var subscribers_val = 0;
    if((subscribers_val = subscribers_container.getAttribute('aria-label')) == null) {
        subscribers_val = subscribers_container.children[0].innerText;
    }
    subscribers_val = parseInt(subscribers_val.replace(/[^0-9]/g, ''));

    var rating = document.createElement('span');
    rating.innerText = "Рейтинг: "+rating_val;
    rating.style['padding-left'] = getComputedStyle(answers_link)['padding-left'];
    rating.className = "rating";

    var subscribers = document.createElement('span');
    subscribers.innerText = "Подписчиков: "+subscribers_val;
    subscribers.style['padding-left'] = getComputedStyle(answers_link)['padding-left'];
    subscribers.className = "subscribers";

    if(config.get('sidebar_feed_link')) {
        var feed_link_top = top_menu.querySelector('a[href="/subs"]');
        var bell = feed_link_top.querySelector('.bell');
        if(bell) {
            bell.className = "bell bell_profile-menu";
        }
        var clss = "menu__item";
        if(feed_link_top.parentNode.className.indexOf("header-menu__item_current")+1) {
            clss += " menu__item_current";
        }
        feed_link_top.className += clss;
        main_menu.prepend(feed_link_top);
        feed_link_top.style.display = 'block';
    }

    if(config.get('oldschool_favicon')) {
        document.getElementById("favicon").setAttribute("href", "https://cs.pikabu.ru/favicon2x.ico");
    }

    main_menu.prepend(subscribers);
    main_menu.prepend(rating);

    var edits = sidebar.querySelector('.menu a.menu__item[href="/edits"]');
    if(edits) {
        var unneeded_menu = edits.parentNode;
        main_menu.append(edits);
        unneeded_menu.remove();
    }
    profile_info.remove();

    try {
        var styluses = [].slice.call(document.querySelectorAll('.stylus'));
        var stylus;
        for(var i in styluses) {
            stylus = styluses[i];
            stylus.innerHTML = stylus.innerHTML.replace('.sidebar-block__header {', '.'+sidebar.querySelector(".sidebar-block__content").previousElementSibling.className+' {');
        }
    } catch(e) {
        console.log("Не установлен юзерстиль или нет доступа к блоку контента в сайдбаре.");
    }


    if(config.get('sidebar_icons')) {
        var menu_items = [].slice.call(main_menu.children); //Конвертируем HTMLCollection в массив
        menu_items.forEach(function(item) {
            let icon_container = document.createElement('span');

            icon_container.className = "icon_container";
            let i = document.createElement('i');
            let space = document.createTextNode(' ');
            let icon = 'circle-o';
            switch(item.getAttribute('href')) {
                case '/answers':
                    if(item.children.length) {
                        icon = "envelope-o";
                    } else {
                        icon = "envelope-open-o";
                    }
                    break;
                case '/comments':
                    icon = "comments-o";
                    break;
                case '/liked':
                    icon = "thumbs-o-up";
                    break;
                case '/saved-stories':
                    icon = 'floppy-o';
                    break;
                case '/subs-list':
                    icon = 'list';
                    break;
                case '/ignore-list':
                    icon = 'times';
                    break;
                case '/notes':
                    icon = 'sticky-note-o';
                    break;
                case '/edits':
                    icon = 'pencil';
                    break;
                case '/subs':
                    icon = "file-text-o";
                    break;
                default:
                    if(item.className == "rating") {
                        icon = "bar-chart";
                    } else if(item.className == "subscribers") {
                        icon = "users";
                    }
                    break;
            }
            i.className = 'fa fa-'+icon;
            icon_container.prepend(i);
            item.prepend(space);
            item.prepend(icon_container);
        });
    }
    var right_menu = top_menu.querySelector('.header-right-menu');
    var search_bar = right_menu.querySelector('.header-right-menu__search');

    if(config.get('top_big_searchbar')) {
        search_bar.style.width = "250px";
        search_bar.style['background-color'] = "#fff";
        search_bar.style['border-radius'] = "2px";
        search_bar.querySelector('button').style.color = "#8ac858";
    }
    if(config.get('top_no_avatar')) {
        right_menu.querySelector('.avatar').remove();
    }
    var notify_btn = right_menu.querySelector('.header-right-menu__notification');
    notify_btn.innerHTML = '<i class="fa fa-bell fa-bigger" style="font-size:1.3em"></i>';
    notify_btn.style['line-height'] = '1px';
    notify_btn.style['margin-right'] = '0px';


    var user_info = sidebar.querySelector('.user');
    var settings = user_info.querySelector('a[href="/settings"]');
    var exit = user_info.querySelector('.user__exit');
    var nick_container = user_info.querySelector('.user__nick_big').parentNode;

    try {
        var straw = sidebar.querySelector('[data-role="switch-adult"]');
        if(config.get('porn_stealth')) {
            straw.children[0].innerHTML = '<i class="fa fa-bigger fa-user-secret"></i>';
        } else {
            straw.children[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon--ui__strawberry"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon--ui__strawberry"></use></svg>';
        }
        var qs = straw.parentNode.remove();
    } catch(err) {
        console.log('Настройка клубнички выключена.');
        var straw = document.createTextNode('');
    }

    try {
        var displaymode = sidebar.querySelector('[data-role="display-mode"]');
        displaymode.previousElementSibling.remove();
        var quickset = displaymode.parentNode.parentNode.parentNode;
        displaymode.style.float = "none";
        displaymode.style.display = "inline-block";
        var dtxt = displaymode.children[0];
        if(dtxt.innerText.indexOf('скрыто')+1) {
            dtxt.innerText += ' просмотренных постов';
        } else {
            dtxt.innerText += ' просмотренные посты';
        }
        var panel = document.querySelector('main section:first-child');
        //panel.insertBefore(displaymode, panel.lastChild);
        panel.insertBefore(displaymode, panel.lastElementChild);
        quickset.remove();

    } catch(err) {
        //var straw = document.createTextNode('');
    }

    settings.innerHTML = '<i class="fa fa-cog fa-bigger"></i>';
    settings.style.color = '#757575';

    exit.style.display = "inline-block";
    exit.innerHTML = '<i class="fa fa-sign-out fa-2x"></i>';


    var btn_container = exit.parentNode;
    btn_container.className += " btn_container";

    btn_container.append(settings);
    btn_container.append(document.createTextNode(' '));

    btn_container.append(notify_btn);
    btn_container.append(document.createTextNode(' '));
    btn_container.append(straw);

    user_info.append(exit);
    if(config.get('post_header_collapse')) {
        document.querySelector('main').addEventListener('click', function(e) {
            if(e.target.nodeName == "HEADER") {
                e.target.parentNode.parentNode.querySelector('.collapse-button').click();
            }
        }, false);
    }

    var remove_visited = function(shortcut) {
        document.querySelectorAll('article.story a.story__title-link_visited').forEach(function(item) {
            var story = item.parentNode.parentNode.parentNode.parentNode;
            story.setAttribute('data-visited', "true");
        });
        var curr = current_story();
        var scroll_next = true;
        var is_video = false;
        [].slice.call(document.querySelectorAll('article.story[data-visited="true"]')).forEach(function(item) {
            if(item == curr) {
                var yt = item.querySelector('iframe');
                if(yt) {
                    console.log('Нельзя прятать текущий пост если в нём есть iframe плеера. TODO: получать статус воспроизведения через Youtube Api. Или не TODO, ну его нафиг.');
                    scroll_next = false;
                    if(shortcut) { //Если remove_visited вызвано нажатием клавиши то пытаемся развернуть плеер в фуллскрин
                        var requestFullscreen = yt.requestFullScreen || yt.mozRequestFullScreen || yt.webkitRequestFullScreen || yt.msRequestFullscreen;
                        if(requestFullscreen) {
                            scrollInstant(item); //Скроллим к посту т.к скролл уезжает при удалении предыдущих постов
                            requestFullscreen.call(yt);
                        }
                    }
                    return;
                }
            }
            item.style.display = "none"; //для обратной совместимости с теми, кто не обновит юзерцсс
            item.setAttribute('data-hidden', "true");
        });
        if(scroll_next) {
            var next_story = document.querySelector('article.story[data-visited="false"]');
            scrollInstant(next_story);
        }
    };

    var current_story = function(){
        /* Множитель зума нужен только для хрома, в фаерфоксе там будет ~1 */
        var zoom = parseFloat((window.outerWidth/parseInt(getComputedStyle(document.documentElement,null).width)).toFixed(2));
        var el = document.elementFromPoint((window.outerWidth/zoom)/2, (window.outerHeight/zoom)/4);
        if(el.className.indexOf('stories-feed__container')+1) {
            console.log('Попали в margin.');
            window.scroll(0, window.scrollY-15); //margin-top поста 15px, сдвинув скролл на 15 пикселей мы куда-нибудь да попадём :)
            el = document.elementFromPoint((window.outerWidth/zoom)/2, (window.outerHeight/zoom)/4);
        }
        var story = findParentByTag(el, 'ARTICLE');
        return story;
    };
    var next_story = function() {
        try {
            var cs = current_story();
            if(!cs) {
                console.log('Текущей истории нет, переходим к первой видимой.');
                return document.querySelector('article.story:not([data-hidden="true"])');
            }
            var ni = nodeIndex(cs)+1;
            var ns = [].slice.call(document.querySelectorAll('article.story:nth-child(n+'+ni+'):not(:nth-child('+ni+')):not([data-hidden="true"])'));
            var next = ns.shift();

            var prev = prev_story(true);
            if(prev && prev.getClientRects()[0].top > 0) {
                console.log('Ох уж эти короткие посты.');
                next = cs; //следующий пост на самом деле тот, что мы уже считаем текущим
            }

            if(!next) {
                throw('');
            }
            return next;
        } catch(e) {
            console.log('Нет следующей истории.');
        }
    };
    var prev_story = function(simple) {
        try {
            var cs = current_story();
            var ni = nodeIndex(cs)+1;
            var ps = [].slice.call(document.querySelectorAll('article.story:nth-child(-n+'+ni+'):not(:nth-child('+ni+')):not([data-hidden="true"])'));
            var prev = ps.pop();
            if(!simple) {
                if(prev.getClientRects()[0].top > 0) { //пост слишком маленький, и это он на самом деле является current_story
                    console.log('Ох уж эти короткие посты.');
                    prev = ps.pop(); //достаём предыдущий пост
                }
            }
            if(!prev) {
                throw('');
            }
            return prev;
        } catch(e) {
            if(!simple) {
                console.log('Нет предыдущей стории.');
            }
            //return null;
        }
    };

    if(config.get('restore_f')) {
        if(document.querySelectorAll('article.story').length > 1) {
            /**
             * UPD: mutationObserver больше не нужен для целей скрытия,
             * в последнем обновлении посты сами помечаются прочитанными.
             * Используем это:
            */

            window.addEventListener('keyup', function(e) {
                if(e.key == "f" || e.key == "F" || e.key == "а" || e.key == "А") {
                    remove_visited(true);
                }
            });

            try {
                var fkey = document.querySelector('.hotkeys').parentNode.querySelector('[aria-label="Показать полностью"]');
                fkey.setAttribute('aria-label', 'Скрыть прочитанное');
                fkey.children[1].innerHTML = "<i class='fa fa-eye-slash'></i>";
            } catch(e) {
                //console.log('хоткеи не найдены');
            }
        }
    }

    if(config.get('enable_nano_nav')) {
        if(document.querySelectorAll('article.story').length > 1) {
            var nano_nav = document.createElement('div');
            nano_nav.id = "nano_nav";
            nano_nav.className = "sidebar-block sidebar-block_border";

            var separator = document.createElement('span');
            separator.className = "separator";

            var separator_empty = document.createElement('span');
            separator_empty.className = "separator empty";

            var prev = document.createElement('span');
            var next = document.createElement('span');
            var hide = document.createElement('span');

            prev.className = "link";
            next.className = "link";
            hide.className = "link";
            prev.innerHTML = '<i class="fa fa-chevron-left fa-2x hint" aria-label="Назад (или нажмите кнопку A)"></i>';
            next.innerHTML = '<i class="fa fa-chevron-right fa-2x hint" aria-label="Вперед (или нажмите кнопку D)"></i>';
            hide.innerHTML = '<i class="fa fa-eye-slash fa-2x hint" aria-label="Скрыть просмотренные (или нажмите кнопку F)"></i>';
            prev.onclick = function() { scrollTo(prev_story()); };
            next.onclick = function() { scrollTo(next_story()); };
            hide.onclick = function() { remove_visited(); };
            nano_nav.append(prev);
            nano_nav.append(document.createTextNode(' '));
            nano_nav.append(separator);
            nano_nav.append(document.createTextNode(' '));
            nano_nav.append(next);
            nano_nav.append(document.createTextNode(' '));
            nano_nav.append(separator_empty);
            nano_nav.append(document.createTextNode(' '));
            nano_nav.append(hide);
            document.body.append(nano_nav);
        }
    }

    if(config.get('great_comment_links')) {

        var makeCommentGreatAgain = function(element) {
            let comment_tools = element.querySelector('.comment__tools');
            let branch_link = comment_tools.querySelector('[data-role="link"]');
            let branch_link_href = branch_link.getAttribute('href');
            branch_link.setAttribute('aria-label', 'Ссылка на ветку комментариев');

            let comment_link = document.createElement('a');
            comment_link.className = 'comment__tool hint';
            comment_link.setAttribute('data-role', 'comment_link');
            comment_link.setAttribute('aria-label', 'Ссылка на комментарий');
            comment_link.setAttribute('href', branch_link_href.replace('?cid=', '#comment_'));
            comment_link.innerText = '#';
            comment_tools.insertBefore(comment_link, branch_link);
            element.setAttribute('data-great', "true");
        };
        var makeCommentsGreatAgain = function() {
            document.querySelectorAll('.comment:not([data-great])').forEach(function(item) {
                makeCommentGreatAgain(item);
            });
        };
        makeCommentsGreatAgain();
        var jumpto = function() {
            if(window.location.hash.indexOf('comment_')+1) {
                var comment = document.querySelector(window.location.hash);
                if(comment) {
                    comment.scrollIntoView({behavior:'smooth', 'block':'start'});
                } else { //В списке комментариев нет загруженного комментария
                    var more_comments = document.querySelector('button.comments__more-button');
                    if(more_comments) {
                        more_comments.scrollIntoView({behavior:'smooth', 'block':'start'});
                        more_comments.className = more_comments.className += " button_yellow";
                        (function() { setTimeout(function() { console.log('release');more_comments.className = more_comments.className.replace(' button_yellow', ''); }, 2500); })();
                    }
                }
            }
        };


        if(window.location.href.indexOf('/story/')+1) {
            jumpto();
            var is_comment_already = null;
            if(window.location.hash.indexOf('comment_')+1) {
                 is_comment_already = document.querySelector(window.location.hash);
            }
            var more_comments_btn = document.querySelector('button.comments__more-button');
            if(more_comments_btn) {
                more_comments_btn.addEventListener('click', function() {
                    var emitted = false;
                    var e = document.createEvent('Event');
                    e.initEvent('comments.loaded', true, true);
                    var comment_observer = new MutationObserver(function(records) {
                        records.some(function(record) {
                            if(record.target.className.indexOf('comment')+1) {
                                document.dispatchEvent(e);
                                comment_observer.disconnect();
                                return true;
                            } else {
                                return false;
                            }
                        });
                    });
                    comment_observer.observe(document.querySelector('section.comments'),  {'childList':true, 'subtree':true});

                });
            }



            document.addEventListener('comments.loaded', function() {
                console.log('comments loaded emitted');
                makeCommentsGreatAgain();
                if(!is_comment_already) {
                    jumpto();
                }
            });
        }
    }

})();