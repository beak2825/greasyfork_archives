// ==UserScript==
// @name        Alternative search engines 2
// @description На странице поиска «Google» добавляет возможность для альтернативного поиска на других Поисковиках и Веб-сайтах.
// @namespace   2k1dmg@userscript
// @license     GPL version 3 or any later version; http://www.gnu.org/licenses/gpl.html
// @version     0.2.0
// @author      2k1dmg
// @homepageURL https://greasyfork.org/ru/scripts/8928-alternative-search-engines-2
// @grant       none
// @noframes
// @icon       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAaVBMVEUAAABBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeFBaeGr9xyCAAAAI3RSTlMA/gzNEQjfmxz1xr5gQeauo4BULyvVinYm7rWllnJKOiTzbFlNSDMAAACiSURBVBjTVc5JDsMgEETRasBMBs/znNz/kGnkOFLeBvVXLQDrTD/rNeJRO3O0cZir7HvrzlZ92VpZImldJ3Qe1tekigbMbAgFj/MBbw+mI3bJb2VgSQBwE1oKiI73ZDkUJzASkQEUKQ5lDS7pRtODHQXna+uATO5ISi9snE6bVfL+mVh0UBCNlL6+C4IkR3rMBsoFbupSaet/5emeFvwRufwAXtMHARXQZIsAAAAASUVORK5CYII=
// @include       *://*.google.*/search?*
// @include       *://*yandex.*/yandsearch?*
// @include       *://*yandex.*/search/?*
// @include       *://duckduckgo.com/?*
// @include       *://go.mail.ru/search?*
// @include       *://*bing.com/*
// @downloadURL https://update.greasyfork.org/scripts/408455/Alternative%20search%20engines%202.user.js
// @updateURL https://update.greasyfork.org/scripts/408455/Alternative%20search%20engines%202.meta.js
// ==/UserScript==
// 2015.10.18 - 2019.05.20

var SEARCH_ON = 'Искать в: • ';
var SEARCH_ON_END = ' •';
var LINK_BOX_ID = 'oeid-box';
var ENGINES_SEPARATOR = ' • ';
var POSITION = 'left';

    var ENGINES = {
/****************  ПОИСКОВИКИ ****************/
        Google: 'https://www.google.ru/search?q=',
        YouTube: 'http://www.youtube.com/results?search_query=',
        Yandex: 'https://yandex.ru/yandsearch?text=',  // Не будет отображаться на стр. поиска «Яндекс»
//        Яндекс: 'https://yandex.ru/yandsearch?text=',  // Будет отображаться и на стр. поиска «Яндекс»
//        "Янд.Картинки": 'https://yandex.ru/images/search?text=',
//        "Янд.Карты": 'https://yandex.ru/maps/?mode=search&text=',
        DuckGo: 'https://duckduckgo.com/?q=',
        MailRu: 'https://go.mail.ru/search?q=',
        Rambler: 'http://nova.rambler.ru/search?query=',
        Bing: 'https://www.bing.com/search?q=',
        Yahoo: 'http://search.yahoo.com/search?p=',
//        WolframAlpha: 'http://www3.wolframalpha.com/input/?i=',
/**************** ТОРРЕНТЫ ****************/
        RuTor: 'http://rutor.info/search/',
        КиноЗал: 'http://kinozal.tv/browse.php?s=',
//        КиноЗал: 'http://kinozal.website/browse.php?s=', // «КиноЗал» - зеркало
        NNMclub: 'http://nnmclub.to/forum/tracker.php?nm=',
//        NNMclub: 'http://nnm-club.me/forum/tracker.php?nm=', // «NNMclub» зеркало
        RuTracker: 'https://rutracker.org/forum/tracker.php?nm=',
//        "Riper.AM": 'http://riperam.org/search.php?keywords=',
//        TorLook: 'https://torlook.info/',  // Быстрый и простой в использовании поиск торрентов
//        Tparser: 'http://tparser.me/torrent/',  // Быстрый и простой в использовании поиск торрентов
        КиноПоиск: 'http://www.kinopoisk.ru/index.php?first=no&what=&kp_query=',
/**************** RU-BOARD ****************/
        "Ru-Board": 'http://forum.ru-board.com/google.cgi?cx=partner-pub-3191513952494802%3A7041921594&cof=FORID%3A10&ie=Windows-1251&q=',
//        Проги: 'http://forum.ru-board.com/forum.cgi?action=filter&forum=5&filterby=topictitle&word=', // Поиск в разделе «Программы» на "Ru-Board"
//        Варез: 'http://forum.ru-board.com/forum.cgi?action=filter&forum=35&filterby=topictitle&word=',  // Поиск в разделе «Варез» на "Ru-Board" (Надо быть зарегистрированным на "Ru-Board")
/****************  РАЗНОЕ ****************/
//       Mozilla: 'https://forum.mozilla-russia.org/search.php?action=search&keywords=', // Форум «Mozilla»
//        Легион: 'http://легион.net/?s=', //  Программы ('Халявное' скачивание)
        "4PDA": 'http://4pda.ru/forum/index.php?act=search&source=all&forums[]=all&query=',
//        Ответы: 'http://otvet.mail.ru/search/',  // Ответы на Mail.ru
        Wiki: 'https://ru.wikipedia.org/w/index.php?search=',
/****************  СОЦ. СЕТИ ****************/
        ВК: 'https://vk.com/search?c[section]=auto&c[q]=',  // общий поиск «ВКонтакте»
//        "ВК-люди": 'http://vk.com/search?c[section]=people&c[q]=',  // поиск Людей «ВКонтакте»
//        "ВК-новости": 'http://vk.com/search?c[section]=statuses&c[q]=',  // поиск в 'Новостях' «ВКонтакте»
//        "ВК-видео": 'http://vk.com/search?c[section]=video&c[q]=',  // поиск 'Видео' «ВКонтакте»
//        "ВК-аудио": 'http://vk.com/search?c[section]=audio&c[q]=',  // поиск в 'Аудиозаписях' «ВКонтакте»
        OK: 'https://ok.ru/search?st.query=', // поиск в «Одноклассниках»
//        Instag: 'https://www.instagram.com/explore/tags/', // поиск в «Instagram»
//        Twit: 'http://www.twitter.com/search?q=',// поиск в «Twitter»
        Face: 'https://www.facebook.com/search/top/?q=', // общий поиск в «Facebook»
//        "Face-люди": 'https://www.facebook.com/search/people/?q=',  // поиск Людей в «Facebook»
//        "Face-видео": 'https://www.facebook.com/search/videos/?q=',  // поиск 'Видео'в «Facebook»
//        "Face-фото": 'https://www.facebook.com/search/photos/?q=',  // поиск 'Фото'в «Facebook»
/**************** ТОВАРЫ ****************/
//        Avito: 'https://www.avito.ru/moskva?q=', // поиск в 'Avito' «по Москве»
//        Avito: 'https://www.avito.ru/rossiya?s_trg=3&sgtd=12&q=',// поиск в 'Avito' «по всей России»
//       Маркет: 'https://market.yandex.ru/search?&text=',
//        Rozetka: 'https://rozetka.com.ua/search/?text=',
/**************** отзывы на товары и т.д. ****************/
//        IRec: 'https://irecommend.ru/srch?query=',
//        Отзовик: 'https://otzovik.com/?search_text=',
    };

var PLACEHOLDER_SELECTORS = [
    '.serp-navigation', // yandex
    '#before-appbar', // google
    '#b_tween', // bing
    '#links_wrapper', // duckduckgo
    '.top_menu__wrapper' // mail.ru
].join(',');

var INPUT_FIELD_SELECTORS = [
    '.input__control', // yandex
    'input[name=q]', // google
    '#sb_form_q', // bing
    '#search_form_input' // duckduckgo
].join(',');

function onClick(event) {
    var link = event.target;
    if(link.nodeName.toLowerCase() !== 'a')
        return;
    var engineSource = ENGINES[link.engineName];
    var engineURL;
    var engineParam = '';
    if(Array.isArray(engineSource)) {
        engineParam = engineSource[1];
        engineURL = engineSource[0];
    }
    else if(typeof engineSource === 'string') {
        engineURL = engineSource;
    }
    else {
        return;
    }
    var searchText = document.querySelector(INPUT_FIELD_SELECTORS);
    if(engineURL && searchText && searchText.value.length > 0) {
        var url = engineURL + encodeURIComponent(searchText.value) + engineParam;
        window.open(url, '_blank');
    }
}

function addCSSStyle() {
    var cssStyle = document.createElement('style');
    cssStyle.type = 'text/css';
    cssStyle.textContent = [
/****************  css Стиль для «Google» ****************/
    '#before-appbar #oeid-box {padding: 2px 0 0 170px !important;}', // положение «Alternative search engines»
    '#hdtb  {margin-top: -30px !important;}', // уменьшить расстояние от «строки поиска» до «инстументов поиска - 'Все, Картинки  и т.д....'»
    '#hdtbMenus {margin-top: 25px; margin-left: 10px;}', // расстояние от «Alternative search engines» до «инстументов поиска - 'На всех языках, За всё время  и т.д.....'»
//      '#resultStats  {display: none !important;}', // скрыть злемент «Результатов: примерно...»
    '#resultStats  {margin: -5px 0 0 5px !important;}', //положение злемента «Результатов: примерно...»
//      'body.vasq .ab_tnav_wrp  {margin-top: 10px !important;}', // расстояние от «инстументов поиска - 'На всех языках, За всё время  и т.д.....'»  до «контента страницы»
//// размер шрифта для подсказок поиска - «Возможно, вы имели в виду» и т.п.............
    '.d2IKib, std, .stp, .card-section, gL9Hy, .spell_orig {font-size: 14px !important;}',
    '.std, .stp, .card-section  {font-size: 14px !important;}',
    '.gL9Hy, .spell_orig  {font-size: 14px !important;}',

/****************  css Стиль для «Яндекс» ****************/
    '.serp-header__search2 {background-color: #fff;}',
    '.serp-header__wrapper {margin-top: -5px !important;  line-height: 27px; height: 60px;}',
    '.serp-navigation {position: fixed; overflow: hidden; width: 100%; height: 58px;  background-color: #fff; padding-bottom: 0px; padding-left: 0px;} ',
    '.navigation, .navigation .navigation__region {margin-top: -1px !important; height: 43px !important;}',
    '.serp-navigation #oeid-box {padding-left: 116px; margin-top: -1px;  line-height: 18px;',
    '.content__right { margin-top: 18px;  margin-left: 90px;}',
    '.content__left { margin-top: 18px;}',
    '.main__top {padding-top: 57px !important;}',
    '.main__center {padding-top: 8px !important;}',
    
/****************  css Стиль для «MAIL.RU» ****************/
    '.top_menu__wrapper {margin: -15px 0 -5px 0 !important;}',
    '.top_menu__wrapper #oeid-box {padding: 8px 0 10px 140px !important;}',
    
/****************  css Style для «Bing» ****************/
    '.sb_count {display: none;}', // скрыть злемент «Результатов: примерно...»
    '#b_tween  {margin-top: -37px; height: 35px;}',
    '#b_tween #oeid-box {padding-left: 0px!important;}',
    '.b_scopebar {margin-top: 10px;}',
    '.b_scopebar, .b_scopebar li {line-height: 30px;}',
/********************************************************/
    '#links_wrapper #oeid-box {padding-left: 0px !important;} ', // css Style для «DuckDuckGo»
    'A:link {text-decoration: none; color: #0000CC;}',  // Убирает подчеркивание ссылок на «Яндекс» и т.д.

        '#' + LINK_BOX_ID + ' {',
        '    display: inline-block;',
        '    padding-right: 10px;',
        '    font-family: Arial, Sans-serif;', // шрифт
        '    font-size: 14px;', // размер шрифта
        '    color: #777 !important;', // цвет шрифта
        '    z-index: 10000;',
        '}'
        ].join('\n');
        document.head.appendChild(cssStyle);
}

var createFragment = (function() {
    var setCommon = function(node, sAttr, reason) {
        var aAttr = sAttr.split(',');
        aAttr.forEach(function(attr) {
            var attrSource = /:=/.test(attr) ? attr.split(':=') : [attr, ''];
            var attrName = attrSource[0].trim();
            var attrValue = attrSource[1].trim().replace(/^(['"])([^\1]*)\1$/, '$2');
            if(reason === 'a') {
                node.setAttribute(attrName, attrValue);
            }
            else {
                node[attrName] = attrValue;
            }
        });
        return node;
    };
    var setAttr = function(node, sAttr) {
        return setCommon(node, sAttr, 'a');
    };
    var setProp = function(node, sAttr) {
        return setCommon(node, sAttr, 'p');
    };
    var createFragmentInner = function(data, fragment) {
        if(data.n) {
            var node = document.createElement(data.n);
            if(data.a)
                node = setAttr(node, data.a);
            if(data.p)
                node = setProp(node, data.p);
            if(data.s)
                node.style.cssText = data.s;
            fragment.appendChild(node);
        }
        if(data.c) {
            data.c.forEach(function(cn) {
                createFragmentInner(cn, node || fragment);
            });
        }
        if(data.t && node) {
            node.appendChild(document.createTextNode(data.t));
        }
        if(data.tc) {
            fragment.appendChild(document.createTextNode(data.tc));
        }
        if(data.dn) {
            fragment.appendChild(data.dn);
        }
        return fragment;
    };
    return function(data) {
        var fragment = document.createDocumentFragment();
        return createFragmentInner({c:data}, fragment);
    };
})();

function createLinkBox() {
    return createFragment([
        {n:'div',a:'id:="'+LINK_BOX_ID+'"',c:(function() {
            var domain = document.domain;
            var aLinks = [{tc:SEARCH_ON}];
            for(var engine in ENGINES) {
                if(domain.indexOf(engine.toLowerCase()) !== -1)
                    continue;
                aLinks.push(
                    {n:'a',a:'href:="javascript:void(0)"',p:'engineName:="'+engine+'"',t:engine},
                    {tc:ENGINES_SEPARATOR}
                );
            }
            aLinks[aLinks.length-1] = {tc:SEARCH_ON_END};
            return aLinks;
        })()}
    ]);
}

function onDOMLoad() {
    var results = document.querySelector(PLACEHOLDER_SELECTORS);
    if(!results)
        return;
    if(document.getElementById(LINK_BOX_ID))
        return;
    addCSSStyle();
    var fragment = createLinkBox();
    var linkBox = fragment.querySelector('#'+LINK_BOX_ID);
    linkBox.onclick = onClick;
    results.insertBefore(fragment, results.firstChild);
}

function addObserver(target, config, callback) {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            callback.call(this, mutation);
        });
    });
    observer.observe(target, config);
    return observer;
}

function removeObserver(observer) {
    observer.disconnect();
}

function getNodes() {
    var _slice = Array.slice || Function.prototype.call.bind(Array.prototype.slice);
    var trg = document.body;
    var params = { childList: true, subtree: true };
    var getNode = function(mut) {
        var addedNodes = mut.addedNodes;
        var nodes = _slice(addedNodes);
        nodes.forEach(function(node) {
            if(node.querySelector &&
                    node.querySelector(PLACEHOLDER_SELECTORS)) {
                onDOMLoad();
            }
        });
    };
    var observer = addObserver(trg, params, getNode);
    window.addEventListener('unload', function(event) {
        removeObserver(observer);
    }, false);
}

onDOMLoad();
getNodes();
