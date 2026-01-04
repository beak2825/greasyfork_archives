// ==UserScript==
// @name         RuTracker Infinite Scroll
// @namespace    copyMister
// @version      1.1
// @description  Autoloads next pages when scrolling down torrents, topics, messages, etc.
// @description:ru  Автозагрузка следующих страниц при прокрутке торрентов, тем, сообщений и т.п.
// @author       copyMister
// @license      MIT
// @match        https://rutracker.org/forum/tracker.php*
// @match        https://rutracker.org/forum/viewforum.php*
// @match        https://rutracker.org/forum/viewtopic.php*
// @match        https://rutracker.org/forum/bookmarks.php*
// @match        https://rutracker.org/forum/search.php*
// @match        https://rutracker.org/forum/privmsg.php*
// @match        https://rutracker.org/forum/posts.php*
// @match        https://rutracker.org/forum/groupcp.php*
// @match        https://rutracker.net/forum/tracker.php*
// @match        https://rutracker.net/forum/viewforum.php*
// @match        https://rutracker.net/forum/viewtopic.php*
// @match        https://rutracker.net/forum/bookmarks.php*
// @match        https://rutracker.net/forum/search.php*
// @match        https://rutracker.net/forum/privmsg.php*
// @match        https://rutracker.net/forum/posts.php*
// @match        https://rutracker.net/forum/groupcp.php*
// @match        https://rutracker.nl/forum/tracker.php*
// @match        https://rutracker.nl/forum/viewforum.php*
// @match        https://rutracker.nl/forum/viewtopic.php*
// @match        https://rutracker.nl/forum/bookmarks.php*
// @match        https://rutracker.nl/forum/search.php*
// @match        https://rutracker.nl/forum/privmsg.php*
// @match        https://rutracker.nl/forum/posts.php*
// @match        https://rutracker.nl/forum/groupcp.php*
// @match        https://rutracker.lib/forum/tracker.php*
// @match        https://rutracker.lib/forum/viewforum.php*
// @match        https://rutracker.lib/forum/viewtopic.php*
// @match        https://rutracker.lib/forum/bookmarks.php*
// @match        https://rutracker.lib/forum/search.php*
// @match        https://rutracker.lib/forum/privmsg.php*
// @match        https://rutracker.lib/forum/posts.php*
// @match        https://rutracker.lib/forum/groupcp.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @homepageURL  https://rutracker.org/forum/viewtopic.php?t=4717182
// @downloadURL https://update.greasyfork.org/scripts/485607/RuTracker%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/485607/RuTracker%20Infinite%20Scroll.meta.js
// ==/UserScript==

var waitTime = 500; // сколько мс ждать между запросами страниц (по умолчанию 0.5 сек)
var observer, topSelect, bottomSelect, nextPageSelect, topPager, bottomPager;
var options, rootSelect, rowSelect, lastRowSelect, rootBlock, lastElem;
var menuFields = ['tracker', 'forum', 'topic', 'message', 'bookmark', 'group', 'future', 'search'];
var scrollLoad, autoLoad, autoNum;
var needFixFuture = true;

function locationIs(address) {
    return window.location.pathname.startsWith(address);
}

function searchIs(parameter) {
    return window.location.search.includes(parameter);
}

var isTracker = locationIs('/forum/tracker.php');
var isForum = locationIs('/forum/viewforum.php');
var isTopic = locationIs('/forum/viewtopic.php');
var isMessage = locationIs('/forum/privmsg.php');
var isBookmark = locationIs('/forum/bookmarks.php');
var isGroup = locationIs('/forum/groupcp.php');
var isSearch = locationIs('/forum/search.php');
var isAnswer = locationIs('/forum/posts.php');

var isMsgSearch = searchIs('search_author') || searchIs('dm=1');
var isFuture = searchIs('future_dls');

function optionEnabled(value) {
    return (isTracker && options.tracker[value]) ||
        (isForum && options.forum[value]) ||
        (isTopic && options.topic[value]) ||
        (isMessage && options.message[value]) ||
        (isBookmark && options.bookmark[value]) ||
        (isGroup && options.group[value]) ||
        (isSearch && isFuture && options.future[value]) ||
        ((isSearch || isAnswer) && !isFuture && options.search[value]);
}

function getLoadNum() {
    if (isTracker) return options.tracker.num;
    else if (isForum) return options.forum.num;
    else if (isTopic) return options.topic.num;
    else if (isMessage) return options.message.num;
    else if (isBookmark) return options.bookmark.num;
    else if (isGroup) return options.group.num;
    else if (isSearch && isFuture) return options.future.num;
    else if ((isSearch || isAnswer) && !isFuture) return options.search.num;
}

function menuHtml(title, id) {
    var onCheck = options[id].on ? ' checked' : '';
    var loadCheck = options[id].load ? ' checked' : '';
    var loadNum = options[id].num;

    return '<td class="pad_4"><fieldset><legend>' + title + '</legend><div class="pad_4">' +
        '<label><input id="' + id + '_on" type="checkbox"' + onCheck + '>загрузка при прокрутке страницы</label>' +
        '<label><input id="' + id + '_load" type="checkbox"' + loadCheck + '>автозагрузка до ' +
        '<input id="' + id + '_num" type="number" value="' + loadNum + '" min="1" max="100" style="width: 4em;"> страниц</label>' +
        '</div></fieldset></td>';
}

function closeMenu() {
    document.querySelector('#inf-btn').click();
}

function defaultOptions() {
    var obj = {};
    menuFields.forEach(function(item) {
        obj[item] = {on: true, load: false, num: 5};
    });
    return obj;
}

function menuObject(id) {
    return {
        on: document.querySelector('#' + id + '_on').checked,
        load: document.querySelector('#' + id + '_load').checked,
        num: Math.abs(parseInt(document.querySelector('#' + id + '_num').value))
    };
}

function selectFutureRow(element) {
    var checkBox = element.closest('tr.hl-tr').querySelector('input.topic-id');
    if (!checkBox.checked) {
        checkBox.click();
    }
}

function fetchNextPage() {
    var nextPage = document.querySelector(nextPageSelect);

    if (nextPage) {
        var url = nextPage.href;
        var fragment = new DocumentFragment();
        var xhr = new XMLHttpRequest();
        var needPostInit = rootBlock.parentElement.classList.contains('topic') || rootBlock.classList.contains('topic');
        var postSign, myMsgsBtn, fdlToggler, fdlIds;

        if (scrollLoad) {
            observer.unobserve(lastElem);
        }

        if (needFixFuture && isSearch && isFuture) {
            fdlToggler = document.querySelector('#fdl-toggler');
            unsafeWindow.jQuery(fdlToggler).off('click');
            fdlToggler.addEventListener('click', function() {
                document.querySelectorAll('input.topic-id').forEach(function(chBox) {
                    chBox.click();
                });
            });

            unsafeWindow.ajax.del_future_dl = function() {
                fdlIds = [];
                document.querySelectorAll('input.topic-id:checked').forEach(function(chBox) {
                    fdlIds.push(chBox.value);
                });
                if (!fdlIds.length) {
                    return unsafeWindow.bb_alert('Отметьте раздачи, которые нужно удалить');
                }
                unsafeWindow.ajax.exec({
                    action: 'del_future_dl',
                    topic_id: fdlIds.join()
                });
            };

            needFixFuture = false;
        }

        xhr.open('get', url, true);
        xhr.responseType = 'document';
        xhr.onload = function() {
            myMsgsBtn = document.querySelector('#show-edit-btn');

            xhr.response.querySelectorAll(rootSelect + ' > ' + rowSelect).forEach(function(tr) {
                fragment.append(tr);

                if (unsafeWindow.BB) {
                    if (needPostInit) {
                        unsafeWindow.BB.initPost(tr.querySelector('.post_body'));
                        postSign = tr.querySelector('.signature');
                        if (postSign) {
                            unsafeWindow.BB.initPost(postSign);
                        }
                    }

                    if (myMsgsBtn) {
                        tr.querySelector('td.topic_id').addEventListener('click', function() {
                            if (!unsafeWindow.BB.in_edit_mode) {
                                myMsgsBtn.click();
                                this.firstElementChild.checked = true;
                            }
                        });
                    }
                }

                if (fdlToggler) {
                    tr.querySelector('input.topic-id').addEventListener('click', function() {
                        this.closest('tr.hl-tr').classList.toggle('hl-sel-row-3');
                    });
                    tr.querySelector('a.tr-dl').addEventListener('click', function() {
                        selectFutureRow(this);
                    });
                    tr.querySelector('a.topictitle').addEventListener('click', function(e) {
                        if (e.ctrlKey || e.metaKey) {
                            selectFutureRow(this);
                        }
                    });
                }
            });

            if (isTracker) {
                document.dispatchEvent(new CustomEvent('new-torrents', { detail: fragment }));
            }

            rootBlock.append(fragment);

            topPager.innerHTML = xhr.response.querySelector(topSelect).innerHTML;
            bottomPager.innerHTML = xhr.response.querySelector(bottomSelect).innerHTML;

            if (document.querySelector(nextPageSelect) && scrollLoad) {
                lastElem = rootBlock.querySelector(lastRowSelect);
                observer.observe(lastElem);
            }
        };
        xhr.send();
    }
}

function interCallback(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            fetchNextPage();
        }
    });
}

(function() {
    'use strict';

    options = JSON.parse(GM_getValue('options', null));
    if (!options) {
        options = defaultOptions();
    }

    document.querySelector('#main-nav > .floatL').insertAdjacentHTML(
        'beforeend',
        '<li><a href="#inf-menu" id="inf-btn" class="menu-root menu-alt1 bold">Infinite Scroll ▼</a></li>'
    );

    document.body.insertAdjacentHTML(
        'beforeend',
        '<div id="inf-menu" class="menu-sub"><table style="border-spacing: 1px;">' +
        '<tbody><tr><th class="pad_6" colspan="2" style="position: relative;">' +
        '<input id="inf-reset" type="submit" value="Сбросить" title="После обновления страницы" style="position: absolute; right: 3px; bottom: 3px;">' +
        'Опции бесконечной прокрутки</th></tr><tr>' +
        menuHtml('Трекер (список торрентов)', 'tracker') +
        menuHtml('Поиск (сообщения и темы)', 'search') + '</tr><tr>' +
        menuHtml('Форумы (список тем)', 'forum') +
        menuHtml('Избранное', 'bookmark') + '</tr><tr>' +
        menuHtml('Темы (посты пользователей)', 'topic') +
        menuHtml('Будущие закачки', 'future') + '</tr><tr>' +
        menuHtml('Личные сообщения', 'message') +
        menuHtml('Группы (список пользователей)', 'group') + '</tr><tr>' +
        '<td colspan="2" class="catBottom" style="background: #dee3e7;">' +
        '<input id="inf-save" type="submit" value="Сохранить" class="bold x-long"></td>' +
        '</tr></tbody></table></div>'
    );

    document.querySelector('#inf-save').addEventListener('click', function() {
        options = {};
        menuFields.forEach(function(item) {
            options[item] = menuObject(item);
        });
        GM_setValue('options', JSON.stringify(options));
        closeMenu();
    });

    document.querySelector('#inf-reset').addEventListener('click', function() {
        GM_setValue('options', JSON.stringify(defaultOptions()));
        closeMenu();
    });

    scrollLoad = optionEnabled('on');
    autoLoad = optionEnabled('load');

    if (isTracker || isForum || isTopic || isSearch) {
        topSelect = '.maintitle ~ .small';
    } else if (isBookmark || isAnswer) {
        topSelect = '.title-pagination';
    } else if (isMessage) {
        topSelect = '#pm_header ~ .nav';
    } else if (isGroup) {
        topSelect = '.pagetitle ~ .med:nth-last-child(2)';
    }

    if (isTracker || isMessage) {
        bottomSelect = '.bottom_info';
    } else if (isForum || isTopic || isSearch || isBookmark || isAnswer) {
        bottomSelect = '#pagination';
    } else if (isGroup) {
        bottomSelect = '.forumline ~ .nav';
    }

    nextPageSelect = bottomSelect + ' .pg:last-child';

    if (document.querySelector(nextPageSelect)) {
        topPager = document.querySelector(topSelect);
        bottomPager = document.querySelector(bottomSelect);
        lastRowSelect = 'tr:nth-last-child(10)';

        if (isTracker) {
            rootSelect = '#tor-tbl > tbody';
            rowSelect = 'tr[id^=trs-tr-]';
        } else if (isForum) {
            rootSelect = '.vf-table > tbody';
            rowSelect = 'tr[id^=tr-]';
        } else if (isTopic) {
            rootSelect = '#topic_main';
            rowSelect = 'tbody[id^=post_]';
            lastRowSelect = rowSelect + ':nth-last-child(5)';
        } else if (isMessage) {
            rootSelect = '.forumline > tbody';
            rowSelect = 'tr[id^=tr-]';
        } else if (isBookmark) {
            rootSelect = '.topics-list > tbody';
            rowSelect = '.hl-tr';
        } else if (isGroup) {
            rootSelect = '#gr-members > tbody';
            rowSelect = 'tr[id^=tr-]';
        } else if (isAnswer || (isSearch && isMsgSearch)) {
            rootSelect = '.topic > tbody';
            rowSelect = 'tr';
            lastRowSelect = 'tr:nth-last-child(5)';
        } else if (isSearch && isFuture) {
            rootSelect = '.future-dls > tbody';
            rowSelect = 'tr[id^=t-]';
        } else if (isSearch) {
            rootSelect = '.forum > tbody';
            rowSelect = 'tr[id^=tr-]';
        }

        rootBlock = document.querySelector(rootSelect);
        lastElem = rootBlock.querySelector(lastRowSelect);

        if (scrollLoad) {
            observer = new IntersectionObserver(interCallback);
            observer.observe(lastElem);
        }

        if (autoLoad) {
            autoNum = getLoadNum();
            if (autoNum > 1) {
                for (var page = 1; page < autoNum; page++) {
                    setTimeout(function() {
                        fetchNextPage();
                    }, page * waitTime);
                }
            }
        }
    }
})();