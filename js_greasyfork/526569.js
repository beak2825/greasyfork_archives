// ==UserScript==
// @name         PornoLab Hider-Fixer
// @namespace    copyMister
// @version      1.1
// @description  Allows to hide unwanted categories everywhere and remember tracker search options, fixes some things
// @description:ru  Позволяет скрывать ненужные категории отовсюду и запоминать настройки поиска по трекеру, исправляет некоторые вещи
// @author       copyMister
// @license      MIT
// @match        https://pornolab.net/forum/*
// @match        https://pornolab.cc/forum/*
// @match        https://pornolab.biz/forum/*
// @match        https://pornolab.lib/forum/*
// @require      https://cdn.jsdelivr.net/npm/@github/check-all@0.3.0/dist/check-all.umd.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornolab.net
// @run-at       document-body
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @homepageURL  https://pornolab.net/forum/viewtopic.php?t=2714164
// @downloadURL https://update.greasyfork.org/scripts/526569/PornoLab%20Hider-Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/526569/PornoLab%20Hider-Fixer.meta.js
// ==/UserScript==

var hiddenCats = JSON.parse(GM_getValue('hiddenCats', '[]'));
var torrentCats = [36,38,60,284,508,509,512,553,555,883,902,903,997,1110,1111,1112,1124,1143,1296,1450,1451,1644,1646,1671,1673,1675,1676,1678,1679,1680,1681,1682,1683,1685,1689,1691,1692,1707,1711,1712,1713,1715,1718,1719,1720,1726,1728,1729,1731,1733,1734,1735,1740,1741,1750,1752,1754,1755,1756,1757,1758,1760,1762,1763,1765,1767,1768,1769,1775,1777,1780,1781,1784,1785,1787,1788,1789,1790,1791,1792,1793,1797,1798,1801,1802,1803,1804,1805,1815,1818,1819,1820,1823,1825,1826,1827,1828,1829,1830,1831,1834,1836,1837,1842,1843,1845,1846,1847,1849,1851,1853,1856,1857,1859,1861,1862,1863,1864,1865,1867,1868,1869,1870,1872,1873];
var adsCats = [1753, 1761, 1821];

var menuFields = ['tracker_torrent', 'tracker_hide', 'tracker_less',
                  'tracker_params', 'tracker_forums', 'tracker_focus', 'tracker_second',
                  'link_exclude', 'link_forums', 'link_params',
                  'search_topics', 'search_msgs', 'search_hide',
                  'other_qsearch', 'other_buttons', 'mode_edit', 'mode_cats'];

var menuDefaults = [true, true, true,
                    false, false, true, true,
                    false, false, false,
                    true, true, true,
                    true, true, true, true];

var options = JSON.parse(GM_getValue('options', null));
if (!options) {
    options = defaultOptions();
}

function defaultOptions() {
    var obj = {};
    menuFields.forEach(function(item, ind) {
        obj[item] = menuDefaults[ind];
    });
    return obj;
}

function saveOptions(custom) {
    GM_setValue('options', JSON.stringify(custom ? custom : options));
}

function menuHtml(title, id) {
    var disabled = (id === 'link_exclude' && options.link_forums) ||
                   (id === 'link_forums' && options.link_exclude);

    return `<label><input id="hfix_${id}" type="checkbox"
                          ${options[id] ? 'checked' : ''}
                          ${disabled ? 'disabled' : ''}
                          >${title}</label>`;
}

function closeMenu() {
    document.querySelector('#hfix-btn').click();
}

function addCheckbox(elem, isItem) {
    var forumId = parseInt(elem.lastElementChild.href.split('=')[1]);
    var isChecked = hiddenCats.includes(forumId);

    elem.insertAdjacentHTML(
        'beforeend',
        `<input class="hide-cbox" type="checkbox" title="Скрывать" ${isChecked ? 'checked' : ''}
                ${isItem ? 'data-check-all-item' : 'data-check-all'}>`
    );
}

(function() {
    'use strict';

    var cssCode = [
        '#hfix-menu .menu-header { position: relative; }',
        '#hfix-menu .menu-btn { position: absolute; bottom: 3px; height: 19.33px; }',
        '#hfix-menu label { user-select: none; }',
        '#hfix-menu > table, #hfix-menu fieldset { border-collapse: collapse; height: 100%; }',
        '#hfix-reload { width: 50%; }',
        '#hfix-menu td { padding: 4px; }',
        '#hfix-res-opt { left: 3px; }',
        '#hfix-res-cat { right: 3px; }',
        '.forums tr[id^="f-"]:not(:has(a[href*="viewforum.php"])) { display: none; }',
        '#fs optgroup:not(:has(> option)) { display: none; }',
    ].join('\n');

    if (options.mode_edit) {
        cssCode += [
            '.hide-cbox { float: left; margin: 2px 7px 0 0 !important; }',
            ':is(.forumlink, .subforums > .sf_title):has(> .hide-cbox:checked) { filter: grayscale(1); }',
        ].join('\n');
    }

    if (options.other_buttons) {
        cssCode += [
            'a.menu-root[href="#pg-jump"] ~ :is(b, a) { padding: 4px 7px; margin-right: 1px; border: 1px solid #969696; border-radius: 4px; text-decoration: none; }',
            'a.menu-root[href="#pg-jump"] ~ :is(b, a:hover) { background-color: rgba(124, 190, 255, .3); text-decoration: none !important; }',
            '.bottom_info .nav, #pagination .nav { padding: 1em 6px; margin: 0; }',
        ].join('\n');
    }

    GM_addStyle(cssCode);

    $.holdReady(true);

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelector('#main-nav td').insertAdjacentHTML(
            'beforeend',
            '<a href="#hfix-menu" id="hfix-btn" class="menu-root bold">Hider-Fixer</a>'
        );

        document.body.insertAdjacentHTML(
            'beforeend',
            `<div class="menu-sub" id="hfix-menu">
                <table>
                    <tr>
                        <th colspan="2" class="menu-header pad_6">Опции юзерскрипта Hider-Fixer
                        <input id="hfix-res-opt" class="menu-btn" type="submit" value="🔄 опции" title="Вернуть опции по умолчанию">
                        <input id="hfix-res-cat" class="menu-btn" type="submit" value="🔄 форумы" title="Снять отметки со всех форумов">
                        </th>
                    </tr>
                    <tr><td rowspan="2"><fieldset>
                        <legend>Трекер</legend>
                        <div class="pad_4">
                            ${menuHtml('Скрывать торренты', 'tracker_torrent')}
                            ${menuHtml('Убирать скрытые форумы', 'tracker_hide')}
                            ${menuHtml('Убирать лишние категории', 'tracker_less')}
                            ${menuHtml('Запоминать выбранные форумы', 'tracker_forums')}
                            ${menuHtml('Запоминать параметры', 'tracker_params')}
                            ${menuHtml('Фокус на поле поиска', 'tracker_focus')}
                            ${menuHtml('Вторая строка поиска', 'tracker_second')}
                        </div>
                    </fieldset></td>
                    <td><fieldset>
                        <legend>Ссылка на Трекер</legend>
                        <div class="pad_4">
                            ${menuHtml('Исключать скрытые форумы', 'link_exclude')}
                            ${menuHtml('Добавлять выбранные форумы', 'link_forums')}
                            ${menuHtml('Добавлять параметры', 'link_params')}
                        </div>
                    </fieldset></td></tr>
                    <tr><td><fieldset>
                        <legend>Поиск</legend>
                        <div class="pad_4">
                            ${menuHtml('Скрывать темы', 'search_topics')}
                            ${menuHtml('Скрывать сообщения', 'search_msgs')}
                            ${menuHtml('Убирать скрытые форумы', 'search_hide')}
                        </div>
                    </fieldset></td></tr>
                    <tr><td><fieldset>
                        <legend>Главная</legend>
                        <div class="pad_4">
                            ${menuHtml('Режим редактирования', 'mode_edit')}
                            ${menuHtml('Скрывать форумы (вне режима)', 'mode_cats')}
                        </div>
                    </fieldset></td>
                    <td><fieldset>
                        <legend>Разное</legend>
                        <div class="pad_4">
                            ${menuHtml('Запоминать тип быстрого поиска', 'other_qsearch')}
                            ${menuHtml('Номера страниц в виде кнопок', 'other_buttons')}
                        </div>
                    </fieldset></td></tr>
                    <tr><th colspan="2" class="pad_4">
                        <input id="hfix-reload" type="submit" value="Обновить страницу" title="Для применения опций">
                    </th></tr>
                </table>
            </div>`
        );

        document.querySelector('#hfix-res-opt').addEventListener('click', function() {
            saveOptions(defaultOptions());
            closeMenu();
        });

        document.querySelector('#hfix-res-cat').addEventListener('click', function() {
            GM_setValue('hiddenCats', '[]');
            closeMenu();
        });

        document.querySelector('#hfix-reload').addEventListener('click', function() {
            window.location.reload();
        });

        menuFields.forEach(function(item) {
            document.querySelector(`#hfix_${item}`).addEventListener('change', function() {
                if (this.id === 'hfix_link_exclude') {
                    document.querySelector(`#hfix_link_forums`).disabled = this.checked;
                } else if (this.id === 'hfix_link_forums') {
                    document.querySelector(`#hfix_link_exclude`).disabled = this.checked;
                }
                options[item] = this.checked;
                saveOptions();
            });
        });

        var quickSearch = document.querySelector('#search-action');
        if (quickSearch) {
            if (options.other_qsearch && options.qsearch_type) {
                quickSearch.value = options.qsearch_type;
            }

            quickSearch.addEventListener('change', function() {
                options.qsearch_type = this.value;
                saveOptions();
            });
        }

        var trackerLink = document.querySelector('#main-nav a[href^="tracker.php"]');
        if (trackerLink) {
            var href = 'tracker.php?';

            if (options.link_exclude && hiddenCats.length > 0) {
                href += 'fn=1&f=';
                hiddenCats.forEach(function(fid) {
                    if (torrentCats.includes(fid)) {
                        href += fid + ',';
                    }
                });
            } else if (options.link_forums && options.tracker_selected && options.tracker_selected.length > 0) {
                href += 'f=';
                options.tracker_selected.forEach(function(fid) {
                    href += fid + ',';
                });
            }

            if (options.link_params && options.tracker_options) {
                if (href.endsWith(',')) {
                    href = href.slice(0, -1);
                    href += '&';
                }
                Object.keys(options.tracker_options).forEach(function(key) {
                    if (key === 'fn' && options.link_exclude) {
                        return;
                    }
                    href += `${key}=${options.tracker_options[key]}&`;
                });
            }

            href = href.slice(0, -1);
            trackerLink.href = href;
        }

        if (document.querySelector('.forumlink')) {
            if (options.mode_edit) {
                document.querySelectorAll('.subforums > .sf_title').forEach(function(forum) {
                    addCheckbox(forum, true);
                })

                document.querySelectorAll('.forumlink').forEach(function(category) {
                    if (category.firstElementChild.href.startsWith('https://pornolab')) {
                        addCheckbox(category, false);
                        checkAll.default(category.parentElement);
                    }
                });

                document.querySelectorAll('.hide-cbox').forEach(function(cbox) {
                    cbox.addEventListener('change', function() {
                        var forumId = parseInt(cbox.previousElementSibling.href.split('=')[1]);
                        var found = hiddenCats.indexOf(forumId);
                        if (this.checked && found === -1) {
                            hiddenCats.push(forumId);
                        }
                        if (!this.checked && found !== -1) {
                            hiddenCats.splice(found, 1);
                        }
                        GM_setValue('hiddenCats', JSON.stringify(hiddenCats));
                    });
                });
            } else if (options.mode_cats) {
                hiddenCats.forEach(function(fid) {
                    var forum = document.querySelector(`:is(.forumlink, .subforums) a[href$="f=${fid}"]`);
                    if (forum) {
                        if (forum.parentElement.classList.contains('forumlink')) {
                            forum.closest('tr').remove();
                        } else {
                            forum.closest('span').remove();
                        }
                    }
                });
            }
        }

        if (options.search_topics && document.querySelector('.topictitle') && !document.querySelector('.dl-chbox, #show-edit-btn')) {
            hiddenCats.forEach(function(fid) {
                var rows = document.querySelectorAll(`.forumline a[href$="f=${fid}"]`);
                if (rows.length > 0) {
                    rows.forEach(function(td) {
                        td.closest('tr').remove();
                    });
                }
            });
        }

        if (options.search_msgs && document.querySelector('.cat.nav')) {
            hiddenCats.forEach(function(fid) {
                var cats = document.querySelectorAll(`.cat.nav > a[href$="f=${fid}"]`);
                if (cats.length > 0) {
                    cats.forEach(function(cat) {
                        var root = cat.closest('tr');
                        var msg = root.nextElementSibling;
                        while (msg.hasAttribute('class')) {
                            var nextMsg = msg.nextElementSibling;
                            msg.remove();
                            msg = nextMsg;
                        }
                        root.remove();
                    });
                }
            });
        }

        if (options.search_hide && document.querySelector('form[action="search.php"] #fs')) {
            document.querySelectorAll('select[name="f[]"] > optgroup > option[id^="fs-"]').forEach(function(opt) {
                if (hiddenCats.concat(adsCats).includes(parseInt(opt.value))) {
                    opt.remove();
                }
            });
        }

        var trackerForm = document.querySelector('#tr-form');
        if (trackerForm) {
            if (options.tracker_torrent) {
                document.querySelectorAll('#tor-tbl .gen.f').forEach(function(link) {
                    if (hiddenCats.includes(parseInt(link.href.split('=')[1]))) {
                        link.closest('tr').remove();
                    }
                });
            }

            if (options.tracker_less) {
                document.querySelectorAll('#fs-main > optgroup:not([label$="Releases"])').forEach(function(cat) {
                    cat.remove();
                });
            }

            if (options.tracker_hide) {
                document.querySelectorAll('#fs-main option').forEach(function(opt) {
                    if (hiddenCats.includes(parseInt(opt.value))) {
                        opt.remove();
                    }
                });
            }

            if (options.tracker_forums) {
                if (options.tracker_selected && options.tracker_selected.length > 0) {
                    document.querySelectorAll('#fs-main option').forEach(function(opt) {
                        opt.selected = options.tracker_selected.includes(opt.value);
                    });
                }

                trackerForm.addEventListener('submit', function() {
                    options.tracker_selected = [];
                    document.querySelectorAll('#fs-main option').forEach(function(opt) {
                        if (opt.selected && opt.value !== '-1' && torrentCats.includes(parseInt(opt.value))) {
                            options.tracker_selected.push(opt.value);
                        }
                    });
                    saveOptions();
                });
            }

            if (options.tracker_params) {
                var inputs = '.fieldsets fieldset:not([id="fs"]) :is(input, select)';

                if (options.tracker_options) {
                    document.querySelectorAll(inputs).forEach(function(elem) {
                        if (options.tracker_options[elem.name]) {
                            if (elem.type === 'select-one') {
                                elem.value = options.tracker_options[elem.name];
                            } else if (elem.value === options.tracker_options[elem.name]) {
                                elem.checked = true;
                            }
                        }
                    });
                }

                trackerForm.addEventListener('submit', function() {
                    options.tracker_options = {};
                    document.querySelectorAll(inputs).forEach(function(elem) {
                        if (!['hidden', 'text', 'search'].includes(elem.type) && !elem.disabled) {
                            if (elem.type === 'select-one' || elem.checked) {
                                options.tracker_options[elem.name] = elem.value;
                            }
                        }
                    });
                    saveOptions();
                });
            }

            var titleSearch = document.querySelector('#title-search');
            if (options.tracker_focus) {
                titleSearch.focus();
            }

            if (options.tracker_second) {
                var secondValue = options.second_search ?? '';

                if (secondValue) {
                    titleSearch.value = titleSearch.value.replace(secondValue, '');
                }

                titleSearch.parentElement.insertAdjacentHTML(
                    'afterend',
                    `<p class="input">
                         <input id="second-search" style="width: 95%;" type="search" size="50" value="${secondValue.replaceAll('"', '&quot;')}">
                         <a id="second-icon" class="med" href="#" style="font-size: 0.9rem;" title="Вторая строка с запоминанием и автоматической подстановкой; нажмите для вставки заготовки">
                             <i class="fas fa-question-circle"></i>
                         </a>
                     </p>`
                );

                var secondSearch = document.querySelector('#second-search');
                document.querySelector('#second-icon').addEventListener('click', function(e) {
                    e.preventDefault();
                    secondSearch.focus();
                    secondSearch.value = '-transex* -transsex* -=trans -shemale -scat -defecation -cbt -strapon -="strap-on" -yaoi -futanari -=futa';
                });

                trackerForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    secondSearch.value = secondSearch.value.trim();

                    if (secondSearch.value) {
                        titleSearch.value = titleSearch.value.trim() + ' ' + secondSearch.value;
                    }

                    options.second_search = secondSearch.value;
                    saveOptions();
                    secondSearch.value = '';
                    trackerForm.submit();
                });
            }
        }

        $.holdReady(false);
    });
})();