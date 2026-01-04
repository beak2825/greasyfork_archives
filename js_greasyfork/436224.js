// ==UserScript==
// @name         ficbook.notifications.improvement
// @namespace    https://siwatcher.ru
// @version      1.2.28.beta
// @description  Скрывает на сайте элементы, которые чем-то не угодили. Например фанфики, со слэшем, фэмслэшем, с нелюбимыми жанрами... Или рекламу. Возвращает старые отметки обновлений на страницы избранных авторов и новых частей в текстах, а также помечает изменённые сборники и новые тексты в них. Убирает промежуточную страницу при переходе по ссылкам. Добавляет прямое скачивание FB2-файла в шапку произведения. Сделано на основе скрипта Wilat Collany - https://github.com/ShadowOfKing/JSScripts/
// @author       El'Drako, Wilat Collany
// @include      https://ficbook.net/
// @match        *://ficbook.me/*
// @match        *://ficbook.net/*
// @license MIT
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/436224/ficbooknotificationsimprovement.user.js
// @updateURL https://update.greasyfork.org/scripts/436224/ficbooknotificationsimprovement.meta.js
// ==/UserScript==

var cntAllNotification = '';

// имя файла спрайтов. периодически обновляется фикбуком
var sprite = '';//"icons-sprite31.svg";

//настройки скрипта
var settings = {
    cookies: //пока не реализовано
    {
        enabled: true,    //если true, то настройки будут сохраняться в куках браузера. если их там нет, то первый раз настройки будут взяты из параметров ниже.
    },
    download:
    {
        enabled: true,     //если true, то показывает кнопку скачать на странице произведения
        format: "fb2",     //возможные варианты: "txt", "epub", "pdf", "fb2"
        autosave: false,   //если true, то скачивает файл при открытии страницы содержания произведения
    },
    display:
    {
        notification_bar:  //настройки отображения панели оповещений на странице новостей пользователя
        {
            enabled: true, //если true, то показывает панель оповещений
            show:
            {
                favourites: true,   //показывать плашку избранных авторов
                newparts: true,     //показывать плашку новых частей в текстах
                collections: true,  //показывать плашку добавлений в коллекциях
                comments: true,  //показывать плашку с числом комментариев
                requests:true, //показывать плашку с числом заявок
                pubbeta: true, //публичная бета
                otzyv: true, //новые отзывы
                blogs: true, //новые блоги
                messaging: true, //новые ЛС
                requests_to_share: true, //новые запросы на бету
                edited: true, //новые правки текстов
            }
        },
        top_bar:           //настройки отображения иконок в шапке сайта (рядом с колокольчиком)
        {
            enabled: true, //если true, то показывает иконки оповещений
            show:
            {
                favourites: true,   //иконка избранных авторов
                newparts: true,     //иконка новых частей в текстах
                collections: true,  //иконка добавлений в коллекциях
                comments: true,  //иконка числа комментариев
                requests: true,  //иконка с числом заявок
                pubbeta: true, //публичная бета
                otzyv: true, //новые отзывы
                blogs: true, //новые блоги
                messaging: true, //новые ЛС
                requests_to_share: true, //новые запросы на бету
                edited: true, //новые правки текстов
            }
        },
    },
    fixes: // настройки для тех, кого идиотизм нововведений задрал в край.
    {
        remove_thanks_author_page_link: true, //заменяет на странице последней части ссылку на страницу с предложением поблагодарить автора на переход к содержанию.
        remove_away_page: true, //убирает промежуточную страницу при переходе по ссылкам (кроме ссылок в подгружаемых комментариях)
        redirect_from_rkn_page: true, //для fanfic.me - перенаправляет с заглушки про блокировку для РФ на страницу текста на ficbook.net
    }
}

//Условия блокировки
var blocks = {
    slash: {
        constraints:
        [
            {
                selector: ".icon-slash, .ic_slash",
                parent: "article, .festival-thumb",
            },
            {
                selector: ".direction-slash",
                parent: "article.fanfic-inline",
            },
            {
                selector: ".slash",
                parent: "arvicle, .fanfic-inline.mbt-2",
            },
            {
                selector: "div.small-direction-slash",
                parent: "a",
            },
            {
                selector: "div.small-direction-slash",
                parent: "article.fanfic-inline",
            },
        ],
        message: "Тут был слэш",
        block: true,
    },
    femslash: {
        constraints:
        [
            {
                selector: ".icon-femslash, ic-femslash",
                parent: "article, .festival-thumb",
            },
            {
                selector: ".direction-femslash",
                parent: "article.fanfic-inline",
            },
            {
                selector: "div.small-direction-femslash",
                parent: "article.fanfic-inline",
            },
            {
                selector: ".femslash",
                parent: "arvicle, .fanfic-inline.mbt-2",
            },
            {
                selector: "div.small-direction-femslash",
                parent: "a, article.fanfic-inline",
            },
        ],
        message: "Тут был фемслэш",
        block: false,
        saveContent: true,
    },
    ads: {
        constraints:
        [
            {
                selector: "yatag, .rkl-banner > a",
                parent: "div, main, #main, body",
            },
            {
                selector: ".adsbygoogle > *",
                parent: ".adsbygoogle",
            },
        ],
        message: "Тут была реклама",
        block: true,
        delay: 0,
        repeats: 10,
        step: 500,
        css: {
            "background-color": "#4d2917",
            color: "#f6ecda",
        },
        saveContent: true,
    },
    genres: {
        constraints:
        [
            {
                selector: "a.tag.disliked-parameter-link",
                parent: "article.fanfic-block-disliked",
            },
            {
                selector: "a.tag.disliked-parameter-link",
                parent: "article.fanfic-inline.mbt-2",
            },
            {
                selector: "a.tag-disliked",
                parent: "article.fanfic-inline",
            },
        ],
        message: "Тут был нелюбимый жанр",
        block: true,
        css: {
            "background-color": "#2c1a14",
            color: "#dd3131",
        },
        saveContent: true,
    },
    authors: {
        constraints: [
            { //для добавления нелюбимого автора перечислите в параметре text ниже в кавычках ники авторов через запятую в каждом блоке (они для разных мест)
                selector: "div.fanfic-main-info dl.fanfic-inline-info span.author a",
                parent: "article.fanfic-inline",
                text: [
                    "ник автора",
                ]
            }, //для добавления нелюбимого автора перечислите в параметре text ниже в кавычках ники авторов через запятую
            {
                selector: "article.comment-container div.comment-content header div.author a",
                parent: "article.comment-container",
                text: [
                    "nick","ник автора 2",
                ]
            }
        ],
        message: "Здесь был нелюбимый автор",
        block: true,
        css: {
            "background-color": "black",
            color: "white;"
        },
        saveContent: true
    },
    comments_authors: {
        constraints: [
            { //для добавления нелюбимого автора в комментариях перечислите в параметре text ниже в кавычках ники авторов через запятую в каждом блоке (они для разных мест)
                selector: "a.js-comment-author",
                parent: "article.comment-container",
                text: [
                    "ник автора",
                ]
            },
        ],
        message: "Здесь был особо не важный комментарий",
        block: true,
        css: {
            "background-color": "black",
            color: "white;"
        },
        saveContent: true
    }
};

//Блок кнопок для отметок прочитанными и удаления оповещений в категории
var btnNotifBlock = '<div class="notification-action-buttons" style="float:right">'+
    '<form class="d-inline-block mr-5 jsAjaxSubmitForm" action="/user_notifications/mark_old_all" method="post">'+
    '<input type="hidden" name="type" value="__TYPE">'+
    '<button type="submit" class="btn btn-default" onclick="return confirm(\'Отметить все оповещения в выбранной категории как прочитанные?\')">'+
    '<svg class="ic_ok2 icon mr-5"><use href="/assets/icons/'+sprite+'#ic_ok2"></use></svg>'+
    'Всё прочитано'+
    '</button>'+
    '</form>'+
    '<form class="d-inline-block" action="/user_notifications/delete_all" method="post">'+
    '<input type="hidden" name="type" value="__TYPE">'+
    '<button type="submit" class="btn btn-default" onclick="return confirm(\'Удалить все оповещения в выбранной категории?\')">'+
    '<svg class="ic_bin icon mr-5"><use href="/assets/icons/'+sprite+'#ic_bin"></use></svg>'+
    'Удалить оповещения'+
    '</button>'+
    '</form>'+
    '</div>';

//Функция блокировки
function blockElement(el) {
    var message = el.message;
    var delay = el.delay == null ? 1 : el.delay;
    var count = el.repeats == null ? 1 : el.repeats;
    var step = el.step == null ? delay : el.step;
    var saveContent = el.saveContent;
    var changeContent = el.changeContent;
    var content = el.content;
    for (var iter = 0; iter < count; iter++) {
        setTimeout(function() {
            for (var i = 0; i < el.constraints.length; i++) {
                var con = el.constraints[i];
                var $selector = $(con.selector);
                var count = con.text ? con.text.length : 1;
                $selector.each(function() {
                    if ($(this).parents('.blockedContent').length > 0) {
                        return;
                    }
                    for (var ii = 0; ii < count; ii++) {
                        var text = con.text && con.text.length > 0 ? con.text[ii].trim().toLowerCase() : "";
                        if (text == "" || text == $(this).text().trim().toLowerCase()) {
                            var $parent = $(this).parents(con.parent).first();
                            if (el.hide == true) {
                                $parent.remove();
                                return;
                            }
                            $parent.wrap("<div></div>");
                            $parent = $parent.parent();
                            var css = "";
                            if (el.css != null) {
                                css = 'style="';
                                for (var j in el.css) {
                                    css += j + ': ' + el.css[j] + ';';
                                }
                                css += '"';
                            }
                            if (saveContent) {
                                $parent.wrapInner("<div style='display: none;' class='blockedContent'></div>"); //так сохраняются привязанные события
                                //$parent.html("<div style='display: none;' class='blockedContent'>" + $parent.html() + "</div>");
                                $parent.append('<div class="openBlockedContent">Показать скрытый контент</div>');
                                $parent.css('position', 'relative');
                                $parent.children('.openBlockedContent').click(function(e) {
                                    $(this).hide();
                                    var $el = $(this).parent().slideUp(500);
                                    setTimeout(function() {
                                        $el.children('.BlockContent').hide();
                                        $el.children('.blockedContent').show();
                                        $el.slideDown(500);
                                    }, 500);
                                });
                            } else {
                                $parent.html("<span></span>");
                            }

                            $parent.children().last().before("<div class='BlockContent'" + css + ">" + message + "</div>");
                            $parent.children('.BlockContent').click(function(e) {
                                $(this).addClass('closed');
                                var $par = $(this).parent();
                                $par.slideUp(500);
                                setTimeout(function() {
                                    $par.remove();
                                }, 600);
                            });
                        }
                    }
                });
            }
        }, delay);
        delay += step;
    }
}

//Удаляем переходную страницу на ссылках
function removeAwayPage() {
    var awayString = '/away?url=';
    $('a[href^="' + awayString + '"]').each(function(){
        // Update the 'rules[0]' part of the name attribute to contain the latest count
        $(this).attr('href', $(this).attr('href').replace(awayString,''));
        // Add attribute target="_blank"
        $(this).attr('target', '_blank' );
        $(this).attr('href', decodeURIComponent($(this).attr('href')));
    });

}

//Добавление стилей для заблокированного элемента
function addStyles() {
    var styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    var styleSheet = styleEl.sheet;
    styleSheet.insertRule(".BlockContent {text-align: center;font-size: 1.5em;background-color: rgb(146, 32, 32); opacity: 0.46; color: black;padding: 5px 0px;margin-bottom: 15px;border: 1px solid red;cursor: pointer; transition: 0.3s linear all;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".BlockContent:hover:not(.closed) { opacity: 0.76;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".BlockContent.closed {cursor: default;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".openBlockedContent {transition: 0.5s ease-in-out all; position: absolute;color: #fafafa;right: 5px;bottom: 1.35em;background-color: #121517;padding: 5px;border-radius: 15px;border: 1px solid red; opacity: 0.7; cursor: pointer;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".openBlockedContent:hover {opacity: 1.7; background-color: #fafafa; color: #121517;}", styleSheet.cssRules.length);
    //стили плашек панели обновлений
    styleSheet.insertRule(".iconblock-5 { color: #8b724d;position: relative; margin:30px 10px 5px; border: 2px solid #cdbea2; border-radius:4px;background-color: #f6ecda; transition: transform 300ms ease, box-shadow 300ms ease;text-align:center;width:130px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5 .np-icon { display: block; position: absolute; left: 50%; width: 60px; transform: translate(-50%, -50%); }", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5 .np-icon svg.np-i {transition: all 0.7s ease 0s;position: absolute;top: 40%;left: 50%;font-size: 32px; transform: translate(-50%, -50%); fill: #8b724d;width: 32px;height: 32px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5 .np-icon img{position: absolute; top: 40%; left: 50%; font-size: 32px; transform: translate(-50%, -50%);color: #cdbea2;width: 32px;height: 32px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5 .np-icon svg path {stroke-width: 8px;stroke: #cdbea2;transition: stroke 300ms ease;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5 .np-icon svg polygon {fill: #f6ecda; }", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5 h3 {transition: all 0.7s ease 0s; margin:32px 0 1px 0;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5 p {transition: all 0.7s ease 0s; margin:5px 0 5px 0;line-height: 1.2em; font-size:0.9em;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5:hover h3 {color: #000;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5:hover p {color: #000;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5:hover {transform: translateY(-10px);box-shadow: 0px 7px 10px 1px rgba(84, 84, 84, 0.5); border-color: #8b724d;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5:hover .np-icon svg path {stroke: #8b724d;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".iconblock-5:hover .np-icon svg.np-i {transition: all 1.7s ease 0s;fill: #000;}", styleSheet.cssRules.length);
    styleSheet.insertRule("section.np-info {display: flex;flex-direction: row;justify-content: flex-start;flex-wrap: wrap;align-items: baseline;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".my-news-panel {background: var(--primary-0);border-radius: var(--radius-4);padding: var(--gap-6) var(--gap-8);column-rule: var(--gap-8);gap: 0 var(--gap-8);grid-template-areas: \"data content count\";text-decoration: none;display: grid;justify-content: start;justify-items: start;}", styleSheet.cssRules.length);
    //стили всплывающего окна
    styleSheet.insertRule("#myModal-fav {flex-direction: column;width: 90%; height: fit-content; max-height: 90%;margin: 0 auto; border-radius: 4px; background: #f6ecda; position: fixed; top: 0; left: 0; right: 0; bottom: 0; margin: auto; display: none; opacity: 0;  z-index: 55;overflow: none}", styleSheet.cssRules.length);
    styleSheet.insertRule("#myModal-fav #myModal__close-fav { width: 21px; height: 21px; position: absolute; top: 1px; right: 11px; cursor: pointer; display: block; font-size: 29px;}", styleSheet.cssRules.length);
    styleSheet.insertRule("#myOverlay-fav { z-index: 37; position: fixed; background-color: rgba(0,0,0,.7); width: 100%; height: 100%; top: 0; left: 0; cursor :pointer; display :none;}", styleSheet.cssRules.length);
    styleSheet.insertRule("#myModal-fav > h3{box-shadow: 0 4px 8px rgba(0,0,0,0.25), 0 2px 2px rgba(0,0,0,0.22);text-align: left;background-color: #ddc9af;margin: 0 0 10px!important;border-radius: 4px 4px 0 0;height: 2em;line-height: 2em;padding: 0 10px;}", styleSheet.cssRules.length);
    styleSheet.insertRule("#myModal-upd {flex-direction: column;width: 90%; height: fit-content; max-height: 90%;margin: 0 auto; border-radius: 4px; background: #f6ecda; position: fixed; top: 0; left: 0; right: 0; bottom: 0; margin: auto; display: none; opacity: 0;  z-index: 55;overflow: none}", styleSheet.cssRules.length);
    styleSheet.insertRule("#myModal-upd #myModal__close-upd { width: 21px; height: 21px; position: absolute; top: 1px; right: 11px; cursor: pointer; display: block; font-size: 29px;}", styleSheet.cssRules.length);
    styleSheet.insertRule("#myOverlay-upd { z-index: 37; position: fixed; background-color: rgba(0,0,0,.7); width: 100%; height: 100%; top: 0; left: 0; cursor :pointer; display :none;}", styleSheet.cssRules.length);
    styleSheet.insertRule("#myModal-upd > h3{box-shadow: 0 4px 8px rgba(0,0,0,0.25), 0 2px 2px rgba(0,0,0,0.22);text-align: left;background-color: #ddc9af;margin: 0 0 10px!important;border-radius: 4px 4px 0 0;height: 2em;line-height: 2em;padding: 0 10px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".overfl{overflow: auto;display: flex;flex-flow: column nowrap;justify-content: flex-start;align-items: stretch;flex-direction: column;flex-wrap: nowrap;align-content: stretch;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".margin-5{margin:5px;overflow: auto;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".mp-1{margin:1px;padding:1px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".mp-0-1{margin:0px 1px;padding:0 1px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".m-0-5{margin:0px 5px!important;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".mbt-2{margin-bottom:2px;margin-top:2px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".p-0-10-10{padding:0 10px 10px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".p-5-10-10{padding:5px 10px 10px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".p-5-10-5-5{padding: 5px 10px 5px 5px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".myshadow{box-shadow: 0 4px 8px rgba(0,0,0,0.25), 0 2px 2px rgba(0,0,0,0.22);border-radius: 4px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".mp-0{margin:0;padding:0;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".maxwd{max-width: none!important;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".custom-scroll::-webkit-scrollbar {width: 10px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".custom-scroll::-webkit-scrollbar-track {-webkit-box-shadow: #503e2299 5px 5px 5px -5px inset;background-color: #dfc79c; border-radius: 4px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".custom-scroll::-webkit-scrollbar-thumb {border-radius: 5px;background: linear-gradient(#c3aa7e, #b68752);}", styleSheet.cssRules.length);
    styleSheet.insertRule("div#notifications .icon {stroke-width: 0;stroke: currentColor;fill: currentColor;vertical-align: middle;width: 1em;height: 1em;display: inline-block;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".fanfic-inline .direction {border-top-left-radius: 0;border-bottom-left-radius: 0;margin-left: -7px;}", styleSheet.cssRules.length);
    styleSheet.insertRule(".fanfic-main-info > .badge-with-icon .svg-icon {margin-left: 8px;}", styleSheet.cssRules.length);
}

//Для генерации хешей контрольных сумм для подтверждения, что нажали скачать на странице выбора формата файла
function p(t) {
    return (
        (function (t) {
            if (Array.isArray(t)) return m(t);
        })(t) ||
        (function (t) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t);
        })(t) ||
        (function (t, e) {
            if (!t) return;
            if ("string" == typeof t) return m(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === n && t.constructor && (n = t.constructor.name);
            if ("Map" === n || "Set" === n) return Array.from(t);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return m(t, e);
        })(t) ||
        (function () {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        })()
    );
}
function m(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
    return r;
}



function markNotifOld(events, cur){
    $.post("/user_notifications/mark_old",{notification_ids:[events['id'][cur]]},
           function(){

        if (settings.download.autosave == true) {
            setCookie('ficbook_startdownload_from_contents',1);
        }
        sleep(getRndInteger(200, 500));
    });
}

function getNotifications(url,cnt) {
    var dfrs = [];
    var uri = " div.d-flex a.notification-item";
    var items = 0;

    $("body").append('<div id="notification-selector" style="display:none"></div>');
    var p = 1+(cnt - cnt % 30) / 30;

    var i =1;
    //загружаем все события со страниц пагинации оповещений
    for (; i <= 2*p; i++) {
        dfrs.push( $.Deferred(function( promise ) {
            $("#notification-selector").append('<span id="page'+i+'">'+i+'</span>');
            $("#notification-selector span#page"+i).load(url+"?p="+i+uri, function() {
                promise.resolve();
            });
        }).promise() );
    }
    return dfrs;
}

function parseNotifications(url, cnt){
    let result = {count: 0, notifications: []};

    //загружаем все события со страниц пагинации оповещений
    $.when.apply(null,getNotifications(url,cnt)).done(function() {
        //формируем строку json
        $("#notification-selector span").find("a.notification-item").each(function() {
            let item = {
                date: 0,
                id: "",
                is_new: true,
                message: "",
                type: 0,
                url: "",
            };

            item.id = $(this).attr("data-notification-id");
            item.url = $(this).attr("href");
            item.message = $(this).find('div.content > div.text-t3').last().text().trim();
            item.date =  $(this).find('div.date').text().trim();
            item.is_new =  $(this).find('div.content > div > span.badge-new').text().trim() === "новое" ? true: false;
            item.type = 0;

            let type_str = $(this).find('div.content > div.text-n1').children().remove().end().text().trim();
            //console.info(type_str);
            type_str == "Обновления избранных авторов" ? item.type = 17 : item.type=item.type;
            item.type == 0 && type_str == "Обновления в сборниках" ? item.type = 18 : item.type=item.type;
            item.type == 0 && type_str == "Новые части" ? item.type = 19 : item.type=item.type;
            item.type == 0 && type_str == "Новая часть" ? item.type = 19 : item.type=item.type;
            item.type == 0 && type_str == "Новая часть в работе" ? item.type = 19 : item.type=item.type;
            item.type == 0 && type_str == "Сообщения об ошибках" ? item.type = 9 : item.type=item.type;
            item.type == 0 && type_str == "Новые работы по понравившимся заявкам" ? item.type = 3 : item.type=item.type;
            item.type == 0 && type_str == "Обсуждения" ? item.type = 14 : item.type=item.type;
            item.type == 0 && type_str == "Обсуждения заявки" ? item.type = 15 : item.type=item.type;
            item.type == 0 && type_str == "Новые отзывы" ? item.type = 1 : item.type=item.type;
            item.type == 0 && type_str == "Новый отзыв" ? item.type = 1 : item.type=item.type;
            item.type == 0 && type_str == "Новый блог" ? item.type = 25 : item.type=item.type;
            item.type == 0 && type_str == "Личные сообщения" ? item.type = 16 : item.type=item.type;
            item.type == 0 && type_str == "Запросы на бету" ? item.type = 11 : item.type=item.type;
            item.type == 0 && type_str == "Изменения от автора" ? item.type = 8 : item.type=item.type;
            item.type == 0 && type_str == "Изменение в тексте работы" ? item.type = 8 : item.type=item.type;
            item.type == 0 && type_str == "Системные сообщения" ? item.type = 2 : item.type=item.type;
            result.notifications.push(item);

            //console.info("parseNotifications: "+JSON.stringify(item));
            item.length = 0;
            result.count++;
        });

        let curURL = document.location.href;
        let pathURL = document.location.pathname;
        let searchURL = document.location.search;
        let data=groupNotifications(result.notifications);
        //выделяем второй массив только с непрочитанными оповещениями
        let notif_new = [];
        result.notifications.forEach(function(it, pos) {
            //если это уже прочитанное оповещение, то сохраняем его
            if (it.is_new == true) notif_new.push(it);
        });

        //console.info(notif_new);
        if (settings.display.top_bar.enabled == true) {
            var favData = data.filter(data => data.type == 17); //избранные авторы
            //console.info(favData);
            //добавляем количество обновлений в шапку
            if (favData.length > 0 ) var favCount = favData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (favCount > 0 && settings.display.top_bar.show.favourites == true) {
                var starHtml = '<li><a class="important-link" style="color:#caaa6a;" href="/home/favourites"><svg class="icon ic_star-empty"><use href="/assets/icons/'+sprite+'#ic_star-empty"></use></svg> <span class="notification-cnt">'+favCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var updData = data.filter(data => data.type == 19); //новые части в текстах
            if (updData.length > 0 ) var updCount = updData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (updCount > 0 && settings.display.top_bar.show.newparts == true) {
                starHtml = '<li><a href="/home/collections?type=update" class="important-link" style="color:#caaa6a;"><svg class="icon ic_file-check"><use href="/assets/icons/'+sprite+'#ic_file-check"></use></svg> <span class="notification-cnt">'+updCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var collData = data.filter(data => data.type == 18); //чужие сборники
            if (collData.length > 0 ) var collCount = collData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (collCount > 0 && settings.display.top_bar.show.collections == true) {
                starHtml = '<li><a href="https://'+document.location.hostname+'/home/collections?type=other" class="important-link" style="color:#eaca9a;"><svg class="icon ic_stack-plus"><use href="/assets/icons/'+sprite+'#ic_stack-plus"></use></svg> <span class="notification-cnt">'+collCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var commentsData = data.filter(data => data.type == 14); //комментарии
            if (commentsData.length > 0 ) var commentsCount = commentsData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (commentsCount > 0 && settings.display.top_bar.show.comments == true) {
                starHtml = '<li><a href="/notifications?type=14" class="important-link" style="color:#eaca9a;"><svg class="icon ic_comment"><use href="/assets/icons/'+sprite+'#ic_comment"></use></svg> <span class="notification-cnt">'+commentsCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var commentsreqData = data.filter(data => data.type == 15); //комментарии в заявках
            if (commentsreqData.length > 0 ) var commentsreqCount = commentsreqData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (commentsreqCount > 0 && settings.display.top_bar.show.comments == true) {
                starHtml = '<li><a href="/notifications?type=15" class="important-link" style="color:#eaca9a;"><svg class="icon ic_comment"><use href="/assets/icons/'+sprite+'#ic_comment"></use></svg> <span class="notification-cnt">'+commentsreqCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var requestsData = data.filter(data => data.type == 3); //заявки
            if (requestsData.length > 0 ) var requestsCount = requestsData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (requestsCount > 0 && settings.display.top_bar.show.requests == true) {
                starHtml = '<li><a href="/notifications?type=3" class="important-link" style="color:#eaca9a;"><svg class="icon ic_lamp"><use href="/assets/icons/'+sprite+'#ic_lamp"></use></svg> <span class="notification-cnt">'+requestsCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var pubbetaData = data.filter(data => data.type == 9); //публичная бета
            if (pubbetaData.length > 0 ) var pubbetaCount = pubbetaData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (pubbetaCount > 0 && settings.display.top_bar.show.pubbeta == true) {
                starHtml = '<li><a href="/notifications?type=9" class="important-link" style="color:#eaca9a;"><svg class="icon ic_spell-check"><use href="/assets/icons/'+sprite+'#ic_spell-check"></use></svg> <span class="notification-cnt">'+pubbetaCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var otzyvData = data.filter(data => data.type == 1); //новые отзывы
            if (otzyvData.length > 0 ) var otzyvCount = otzyvData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (otzyvCount > 0 && settings.display.top_bar.show.otzyv == true) {
                starHtml = '<li><a href="/notifications?type=1" class="important-link" style="color:#eaca9a;"><svg class="icon ic_comment"><use href="/assets/icons/'+sprite+'#ic_comment"></use></svg> <span class="notification-cnt">'+otzyvCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var blogData = data.filter(data => data.type == 25); //новые сообщения в блогах
            if (blogData.length > 0 ) var blogCount = blogData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (blogCount > 0 && settings.display.top_bar.show.blogs == true) {
                starHtml = '<li><a href="/notifications?type=25" class="important-link" style="color:#eaca9a;"><svg class="icon ic_bubble-dark"><use href="/assets/icons/'+sprite+'#ic_bubble-dark"></use></svg> <span class="notification-cnt">'+blogCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var messagingData = data.filter(data => data.type == 16); //новые сообщения в ЛС
            if (messagingData.length > 0 ) var messagingCount = messagingData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (messagingCount > 0 && settings.display.top_bar.show.messaging == true) {
                starHtml = '<li><a href="/notifications?type=16" class="important-link" style="color:#eaca9a;"><svg class="icon ic_envelop"><use href="/assets/icons/'+sprite+'#ic_envelop"></use></svg> <span class="notification-cnt">'+messagingCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var requests_to_shareData = data.filter(data => data.type == 11); //новые запросы на бету
            if (requests_to_shareData.length > 0 ) var requests_to_shareCount = requests_to_shareData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (requests_to_shareCount > 0 && settings.display.top_bar.show.requests_to_share == true) {
                starHtml = '<li><a href="/notifications?type=11" class="important-link" style="color:#eaca9a;"><svg class="icon ic_users"><use href="/assets/icons/'+sprite+'#ic_users"></use></svg> <span class="notification-cnt">'+requests_to_shareCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var editedData = data.filter(data => data.type == 8); //новые запросы на бету
            if (editedData.length > 0 ) var editedCount = editedData[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (editedCount > 0 && settings.display.top_bar.show.edited == true) {
                starHtml = '<li><a href="/notifications?type=8" class="important-link" style="color:#eaca9a;"><svg class="icon ic_history"><use href="/assets/icons/'+sprite+'#ic_history"></use></svg> <span class="notification-cnt">'+editedCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
            var sysMsg = data.filter(data => data.type == 2); //Системные сообщения
            if (sysMsg.length > 0 ) var sysMsgCount = sysMsg[0]['is_new'].reduce(function(acc, el) {el ? acc++ : el=el; return acc;}, 0);
            if (sysMsgCount > 0 && settings.display.top_bar.show.edited == true) {
                starHtml = '<li><a href="/notifications?type=2" class="important-link" style="color:#eaca9a;"><svg class="icon ic_warning"><use href="/assets/icons/'+sprite+'#ic_warning"></use></svg> <span class="notification-cnt">'+sysMsgCount+'</span></a></li>';
                $('ul.top-notifications').append(starHtml);
            }
        }
        //console.info(cntAllNotification);
        if (cntAllNotification > 0) {
            //Добавляем для страницы новостей пользователя блок оповещений
            if (document.location.href == 'https://'+document.location.hostname+'/home/news' && settings.display.notification_bar.enabled == true) {
                let newdata=groupNotifications(notif_new);
                let bar_item_count = 0;
                let tmp = newdata.filter(newdata => newdata.type == 17);
                if (tmp.length > 0 && settings.display.notification_bar.show.favourites == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 18);
                if (tmp.length > 0 && settings.display.notification_bar.show.collections == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 19);
                if (tmp.length > 0 && settings.display.notification_bar.show.newparts == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 14);
                if (tmp.length > 0 && settings.display.notification_bar.show.comments == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 15);
                if (tmp.length > 0 && settings.display.notification_bar.show.comments == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 3);
                if (tmp.length > 0 && settings.display.notification_bar.show.requests == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 9);
                if (tmp.length > 0 && settings.display.notification_bar.show.pubbeta == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 1);
                if (tmp.length > 0 && settings.display.notification_bar.show.otzyv == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 25);
                if (tmp.length > 0 && settings.display.notification_bar.show.blogs == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 16);
                if (tmp.length > 0 && settings.display.notification_bar.show.messaging == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 11);
                if (tmp.length > 0 && settings.display.notification_bar.show.requests_to_share == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 11);
                if (tmp.length > 0 && settings.display.notification_bar.show.edited == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                tmp = newdata.filter(newdata => newdata.type == 2);
                if (tmp.length > 0 && settings.display.notification_bar.show.edited == true) {
                    bar_item_count = bar_item_count + tmp.length;
                }
                if (bar_item_count > 0) { //при подсчёте обновлений не учитывались отключённые группы
                    $("section.content-section").prepend('<section class="d-flex flex-column gap-4"><div class="news-container"> <div id="sc-news-container" style="display:none;"></div></div></section>');
                    //console.info("при подсчёте обновлений не учитывались отключённые группы");
                    updNotificationPanel(newdata);
                }
            }
        }

        //проверяем адрес страницы и если это избранные авторы, то выбираем из type = 17
        var show_dot = '';
        //if (curURL == 'https://'+document.location.hostname+'/home/favourites') {
        if (pathURL == '/home/favourites') {
            //console.info(favData);
            setCookie('ficbook_lasturl',17);
            //Добавляем кнопки
            $('section.content-section h1').before(btnNotifBlock.replace(/__TYPE/g, '17'));
            favData[0]['url'].forEach(function(url, cur){
                var dt = favData[0]['date'][cur];
                if (favData[0]['is_new'][cur] === true) {show_dot = '<div class="dot" style="color: darkred;">&nbsp;&#9733;&nbsp;</div>';}
                $('a[href="'+url+'"]')
                    .parents('h3')
                    .next()
                    .prepend('<div><div class="badge-with-icon direction direction-before-het small-direction-het">'+show_dot+'&nbsp;Обновлено '+dt+'&nbsp;</div></div>')
                ;
                $('a[href="'+url+'"]').on('click', function(){markNotifOld(favData[0], cur)}).attr('target', '_blank');
                show_dot = '';
            });
        }

        //проверяем адрес страницы и если это фанфики по дате обновления, то выбираем из type = 19
        if (pathURL == '/home/collections' && searchURL.indexOf('type=update') == 1) {
            $('section.content-section h1').before(btnNotifBlock.replace(/__TYPE/g, '19'));
            setCookie('ficbook_lasturl',19);
            updData[0]['url'].forEach(function(url, cur){
                var dt = updData[0]['date'][cur];
                if (updData[0]['is_new'][cur] == true) {show_dot = '<div class="dot" style="color: darkred;">&nbsp;&#9733;&nbsp;</div>';}
                var uri = /readfic\/(.+)/m;
                var fid = url.match(uri);
                $('a[href="/readfic/'+fid[1]+'"]').parents('h3').next().prepend('<a href="'+url+'" target="_blank" style="text-decoration: none;"><div><div class="badge-with-icon direction direction-before-het small-direction-het">'+show_dot+'&nbsp;Обновлено '+dt+'&nbsp;</div></div></a>');
                $('a[href="/readfic/'+fid[1]+'"]').on('click', function(){markNotifOld(updData[0], cur)}).attr('target', '_blank');
                show_dot = '';
            });
        }
        //проверяем адрес страницы и если это сборники, то выбираем из type = 18
        if (pathURL == '/home/collections' && searchURL.indexOf('type=other') == 1) {
            $('section.content-section h1').before(btnNotifBlock.replace(/__TYPE/g, '18'));
            setCookie('ficbook_lasturl', 18);
            if (collData.length > 0 ) {
                var regex = /^Сборник "(.+)", работа: (.+), фэндом.*: "(.+)", автор сборника (.+)/;
                var newFandomsInColl = [];
                collData[0]['message'].forEach(function(coll, cur){
                    if (collData[0]['is_new'][cur] == true) {
                        var collection = coll.match(regex);
                        $('div.collection-thumb').each(function(){
                            if ($(this).find('div.collection-thumb-info > a').text() == collection[1] &&
                                $(this).find('div.collection-thumb-author > a').text().trim() == collection[4]) {
                                $(this).attr('style','background-color: beige');
                                let colHref = $(this).find('div.collection-thumb-info > a').attr('href');
                                let colUri = /collections\/(.+)/m;
                                var colFid = colHref.match(colUri);
                                colFid[1]=colFid[1].replace("?sort=7",'')

                                if (newFandomsInColl[colFid[1]] === undefined) {
                                    newFandomsInColl[colFid[1]] = [];
                                    newFandomsInColl[colFid[1]]['fandoms'] = '';
                                    newFandomsInColl[colFid[1]]['count'] = 0;
                                }
                                newFandomsInColl[colFid[1]]['fandoms'] = newFandomsInColl[colFid[1]]['fandoms'].replace("?sort=7",'')

                                newFandomsInColl[colFid[1]]['fandoms'] = newFandomsInColl[colFid[1]]['fandoms'] + collection[3].replace(/"/g,'') + ', '; //создаём список фандомов каждого текста в массиве по номеру коллекции
                                newFandomsInColl[colFid[1]]['count']++;
                                $(this).find('div.collection-thumb-info > a').attr('href', '/collections/' + colFid[1] + '?sort=7').attr('target', '_blank');
                                $(this).find('div.collection-thumb-info').append('<div id="collID-'+colFid[1]+'" style="font-size:0.8em"></div>');

                            }
                        });
                        //второй обход для вывода списка фендомов новых текстов
                        $('div.collection-thumb').each(function(){
                            if ($(this).find('div.collection-thumb-info > a').text() == collection[1] &&
                                $(this).find('div.collection-thumb-author > a').text().trim() == collection[4]) {
                                $(this).attr('style','background-color: beige');
                                let colHref = $(this).find('div.collection-thumb-info > a').attr('href');
                                let colUri = /collections\/(.+)/m;
                                var colFid = colHref.match(colUri);
                                colFid[1]=colFid[1].replace("?sort=7",'')
                                //убираем повторы фендомов
                                let fanNames = clearDuples(newFandomsInColl[colFid[1]]['fandoms']).trim().slice(0, -1);
                                let fanCount = fanNames.split(",").length;
                                //выводим
                                $(this).find('#collID-'+colFid[1]).text(newFandomsInColl[colFid[1]]['count']+' '+
                                                                        declOfNum(newFandomsInColl[colFid[1]]['count'], ['работа', 'работы', 'работ'])+
                                                                        ' по '+
                                                                        declOfNum(fanCount, ['фэндому', 'фэндомам', 'фэндомам'])+' '+
                                                                        fanNames);
                            }
                        });
                    }
                });

            }
        }
        //var collUri = curURL.match(/^https:\/\/ficbook.net\/(.+)\/\d+/);
        //var collUri = curURL.match(new RegExp("^https:\/\/"+document.location.hostname+"\/(.+)\/\d+"));
        var collUri = curURL.match(new RegExp("^https:\/\/"+document.location.hostname+"\/(.+)\/(.+)"));
        if (collUri != null && collUri[1] == 'collections') {
            collData[0]['url'].forEach(function(url, cur){
                var dt = collData[0]['date'][cur];
                if (collData[0]['is_new'][cur] === true) {show_dot = '<div class="dot" style="color: darkred;">&nbsp;&#9733;&nbsp;</div>';}
                var uri = /readfic\/(.+)/m;
                var fid = url.match(uri);
                $('a[href="/readfic/'+fid[1]+'"]').parents('h3').next().prepend('<a href="'+url+'" target="_blank" style="text-decoration: none;"><div><div class="badge-with-icon direction direction-before-het small-direction-het">'+show_dot+'&nbsp;Добавлено '+dt+'&nbsp;</div></div></a>');
                $('a[href="/readfic/'+fid[1]+'"]').on('click', function(){markNotifOld(collData[0], cur)}).attr('target', '_blank');
                show_dot = '';
            });
        }
    })
}
//склонение числительных
// from https://gist.github.com/realmyst/1262561
//use: declOfNum(count, ['найдена', 'найдено', 'найдены']);
function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}


function clearDuples(str) {
    return str.split(' ')
        .filter(function(word, i, arr){
        return i === arr.lastIndexOf(word);
    })
        .join(" ");
}

function showUserNotifications() {
    // Получение списка обновлений
    $.post("https://"+document.location.hostname+"/user_notifications/get_new", function(e) {
        parseNotifications('https://'+document.location.hostname+'/notifications', 3 * e.data.count);
        cntAllNotification = e.data.count;
    });

}

//загружаем по ссылкам из массива непрочитанных оповещений карточки текстов и заливаем в блок всплывающего окна
function loadFicUpdDetails (data) {
    $("main#main").append('<div id="notification-fic-upd-details" style="display:none"></div>');
    //загружаем все данные о тексте со страниц произведений
    $.when.apply(null,getFicUpdDetails(data)).done(function() {
        //заполняем ленту обновлений новых глав
        updNotifOfParts(data);

    });
}
function loadFavAuthorsFicDetails (data) {
    $("main#main").append('<div id="notification-fic-fav-details" style="display:none"></div>');
    //загружаем все данные о тексте со страниц произведений
    $.when.apply(null,getFavAuthorsFicDetails(data)).done(function() {
        //заполняем ленту обновлений новых глав
        updNotifOfFav(data);
    });
}

function getFicUpdDetails(data) {
    var dfrs = [];
    var uri = " section.chapter-info";
    var items = 0;
    //console.info('getFicUpdDetails(data):');
    //console.info(data);
    //console.info('url-upd:');
    var i =1;
    //загружаем все события со страниц пагинации оповещений
    for (; i <= data[0]['url'].length; i++) {
        dfrs.push( $.Deferred(function( promise ) {
            var rgx = /readfic\/(.+)/m;
            var fid = data[0]['url'][i-1].match(rgx);
            $("#notification-fic-upd-details").append('<span id="updDetails'+i+'">'+i+'</span>');
            sleep(getRndInteger(200, 500));
            $("#notification-fic-upd-details span#updDetails"+i).load('/readfic/'+fid[1]+uri, function() {
                getRndInteger(200, 500);
                promise.resolve();
            });
            //console.info(data[0]['url'][i-1]);
        }).promise() );
    }
    return dfrs;
}

function getFavAuthorsFicDetails(data) {
    var dfrs = [];
    var uri = " section.chapter-info > header";
    var items = 0;
    //console.info('getFavAuthorsFicDetails(data):');
    //console.info(data);
    //console.info('url-fav:');
    var i =1;
    //загружаем все события со страниц пагинации оповещений
    for (; i <= data[0]['url'].length; i++) {
        dfrs.push( $.Deferred(function( promise ) {
            $("#notification-fic-fav-details").append('<span id="favDetails'+i+'">'+i+'</span>');
            getRndInteger(200, 500);
            //console.info("i = " + i);
            //console.info("1. data[0]['url'][i-1]+uri = " + data[0]['url'][i-1]+uri);
            $("#notification-fic-fav-details span#favDetails"+i).load(data[0]['url'][i-1]+uri, function() {
                //console.info("data[0]['url'].length = " + data[0]['url'].length);
                //console.info("data[0]['url'] = " + data[0]['url']);
                //console.info("data[0]['url'][i-1] = " + data[0]['url'][i-1]);
                //console.info("uri = " + uri);
                //console.info("2. data[0]['url'][i-1]+uri = " + data[0]['url'][i-1]+uri);
                getRndInteger(200, 500);
                promise.resolve();
            });
            //console.info(data[0]['url'][i-1]);
        }).promise() );
    }
    return dfrs;
}

function groupNotifications(t) {
    var map = t.reduce((acc, cur)=>{
        acc[cur.type] = acc[cur.type] || {
            type: cur.type,
            id: [],
            url: [],
            date: [],
            is_new: [],
            message: [],
        };
        acc[cur.type].id.push(cur.id);
        acc[cur.type].url.push(cur.url);
        acc[cur.type].date.push(cur.date);
        acc[cur.type].is_new.push(cur.is_new);
        acc[cur.type].message.push(cur.message);
        return acc;
    },{});
    return Object.values(map);
}

function updNotificationPanel(data) {
    //функция парсит массив группированных оповещений и выводит результат в панель оповещений на странице новостей

    var starHtml = '<section class="d-flex flex-column gap-4"><h3 class="text-t2 text-bold">Всего <span style="font-size: 1.4em;font-weight:bold;">' + cntAllNotification + '</span> ' + declOfNum(cntAllNotification, ['оповещение', 'оповещения', 'оповещений'])+':</h3><div class="np-main-info"><section class="my-news-panel" style="font-size:1.1em;"></section></div></section>';
    $('section.content-section > div.flex-column').prepend(starHtml);
    starHtml = '';

    var favData = data.filter(data => data.type == 17); //избранные авторы
    //console.info('updNotificationPanel - favData:');
    //console.info(favData);
    //добавляем количество обновлений избранных авторов
    if (favData.length > 0 ) var favCount = favData[0]['is_new'].length;
    //console.info('updNotificationPanel - favCount:');
    //console.info(favCount);
    if (favCount > 0) {
        starHtml = '<a class="important-link myLinkModal-fav" style="text-decoration:none" href="#"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_star-empty"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+favCount+'</h3> <p>Избранные<br/>авторы</p></div></a>';
    }
    var updData = data.filter(data => data.type == 19); //сборники по датам
    if (updData.length > 0 ) var updCount = updData[0]['is_new'].length;
    if (updCount > 0) {
        starHtml += '<a class="important-link myLinkModal-upd" style="text-decoration:none" href="#"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_file-check"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+updCount+'</h3> <p>Новые<br/>главы</p></div></a>';
    }
    var collData = data.filter(data => data.type == 18); //чужие сборники
    if (collData.length > 0 ) var collCount = collData[0]['is_new'].length;
    if (collCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/home/collections?type=other"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_stack-plus"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+collCount+'</h3> <p>Добавлено<br/>в коллекции</p></div></a>';
    }
    var commentsData = data.filter(data => data.type == 14); //комментарии
    if (commentsData.length > 0 ) var commentsCount = commentsData[0]['is_new'].length;
    if (commentsCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/notifications?type=14"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_comment"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+commentsCount+'</h3> <p>Новые<br/>комментарии</p></div></a>';
    }
    var commentsreqData = data.filter(data => data.type == 15); //комментарии к заявкам
    if (commentsreqData.length > 0 ) var commentsreqCount = commentsreqData[0]['is_new'].length;
    if (commentsreqCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/notifications?type=15"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_comment"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+commentsreqCount+'</h3> <p>Комментарии<br/>к заявкам</p></div></a>';
    }
    var requestsData = data.filter(data => data.type == 3); //заявки
    if (requestsData.length > 0 ) var requestsCount = requestsData[0]['is_new'].length;
    if (requestsCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/notifications?type=3"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_lamp"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+requestsCount+'</h3> <p>Добавлено<br/>по заявкам</p></div></a>';
    }
    var pubbetaData = data.filter(data => data.type == 9); //публичная бета
    if (pubbetaData.length > 0 ) var pubbetaCount = pubbetaData[0]['is_new'].length;
    if (pubbetaCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/notifications?type=9"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_spell-check"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+pubbetaCount+'</h3> <p>Добавлено<br/>исправлений</p></div></a>';
    }
    var otzyvData = data.filter(data => data.type == 1); //отзывы
    if (otzyvData.length > 0 ) var otzyvCount = otzyvData[0]['is_new'].length;
    if (otzyvCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/notifications?type=1"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_comment"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+otzyvCount+'</h3> <p>Добавлено<br/>отзывов</p></div></a>';
    }
    var blogData = data.filter(data => data.type == 25); //сообщения в блоге
    if (blogData.length > 0 ) var blogCount = blogData[0]['is_new'].length;
    if (blogCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/notifications?type=25"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_bubble-dark"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+blogCount+'</h3> <p>Сообщений<br/>в блогах</p></div></a>';
    }
    var messagingData = data.filter(data => data.type == 16); //сообщения в ЛС
    if (messagingData.length > 0 ) var messagingCount = messagingData[0]['is_new'].length;
    if (messagingCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/notifications?type=16"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_envelop"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+messagingCount+'</h3> <p>Личных<br/>сообщений</p></div></a>';
    }
    var requests_to_shareData = data.filter(data => data.type == 11); //запросы на бету
    if (requests_to_shareData.length > 0 ) var requests_to_shareCount = requests_to_shareData[0]['is_new'].length;
    if (requests_to_shareCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/notifications?type=11"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_users"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+requests_to_shareCount+'</h3> <p>Запросы<br/>на бету</p></div></a>';
    }
    var editedData = data.filter(data => data.type == 8); //правки текстов
    if (editedData.length > 0 ) var editedCount = editedData[0]['is_new'].length;
    if (editedCount > 0) {
        starHtml += '<a class="important-link" style="text-decoration:none" href="/notifications?type=8"><div class="iconblock-5"><div class="np-icon"><svg version="1.1" id="Layer_0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve" class="np-i"><use href="/assets/icons/'+sprite+'#ic_history"></use></svg><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -10 300 320" xml:space="preserve"><polygon points="22.3,223.7 22.3,76.3 150,2.5 277.7,76.3 277.7,223.7 150,297.5"/> <path d="M150,4.8l125.7,72.6v145.2L150,295.2L24.3,222.6V77.4L150,4.8 M150,0.2L20.3,75.1v149.8L150,299.8l129.7-74.9V75.1L150,0.2 L150,0.2z"/></svg></div><h3>'+editedCount+'</h3> <p>Правки<br/>текстов</p></div></a>';
    }

    $('div.np-main-info >section.my-news-panel').append(starHtml);

    if (updData.length > 0 ) loadFicUpdDetails(updData);
    if (updData.length > 0 && favData.length > 0) sleep(getRndInteger(500, 1000));
    if (favData.length > 0 ) loadFavAuthorsFicDetails(favData);

}

//загрузка в блоки всплывающих окон с лентами оповещений по типам обновлений
function updNotifOfParts(data) { //новые части в сборниках
    //шаблон всплывающего окна
    var popupWindow_upd = '<div id="myModal-upd"><h3>Новые главы в отслеживаемых произведениях</h3>__content<span id="myModal__close-upd" class="close">ₓ</span></div><div id="myOverlay-upd"></div>';
    //добавляем скрытые блоки по типам и загружаем в них списки обновлений
    var updBlock = '<div class="p-5-10-5-5" data-cur="__cursor"><div class="myshadow"><article class="fanfic-inline mbt-2" style="margin-top:5px!important;"><div class="js-toggle-description"><h3 class="fanfic-inline-title"><a class="visit-link" href="__url" target="_blank">__title</a></h3><div class="fanfic-main-info">__ficdata __annotation</div></div></article></div></div>';
    //console.info('upd-text-parts:');
    //console.info(data);
    if (data.length > 0) {
        var outBlockUpdData = '';
        $("#notification-fic-upd-details > span").each(function(cur) {
            var item = updBlock;
            var title = '';
            //title = $(this).find("div.fanfic-main-info").find('h1').text();
            title = $(this).find('h1.heading').text();
            //console.info("title: " + title);
            if (title.length < 1) return true;
            item = item.replace('__title',title);
            //var text_fid = $(this).find('div.hat-actions-container.hidden-xs > div > span').attr("data-fanfic-id");
            //if (text_fid == undefined) {
            var dt = data[0]['url'][cur];
            var uri = /readfic\/(.+)/m;
            var text_fid = dt.match(uri);
            text_fid = text_fid[1];
            //}
            var text_url = '/readfic/'+text_fid;
            item = item.replace('__url',text_url);
            item = item.replace('__cursor',text_url);
            //console.info("text_url: " + text_url);
            //var genre = $(this).find("div.fanfic-main-info > section > div > div.badge-icon-container > svg").attr('class');
            var genre = $(this).find("section > div.badge-with-icon > svg").attr('class');
            if (genre != 'undefined' && genre.length > 1) genre = genre.replace('ic_','');
            //console.info(genre);
            item = item.replace('__ficdata',$(this).find("section.chapter-info > header > div > section").html());

            //в одну строку аватары и ники авторов текста
            $(this).find("section").css({'display': 'flex', 'flex-wrap':'wrap'});
            $(this).find("section > div.hat-creator-container").css({
                'display': 'inline-flex',
                'flex-flow': 'column nowrap',
                'align-content': 'center',
                'margin': '0px 10px',
                'flex-direction': 'row'
            });
            $(this).find("section > div.hat-creator-container > div.creator-info").css({
                'display': 'inline-flex',
                'flex-direction': 'column',
                'flex-wrap': 'nowrap',
                'align-content': 'center'
            });
            $(this).find("section > div.hat-creator-container > div.avatar-decoration-holder").css({
                'display': 'inline-flex',
                'flex-direction': 'column',
                'flex-wrap': 'nowrap',
                'align-content': 'center',
                'align-items': 'center',
                'text-align': 'center'
            });
            $(this).find("div.description").find("div.mb-5").each(function(){
                var str = $(this).find('strong').text();
                if (str == 'Примечания:' || str =='Публикация на других ресурсах:' || str =='Посвящение:') $(this).css('display','none');
            });
            //забираем блок аннотации текста после правок стилей выше
            //item = item.replace('__annotation',$(this).find("section.fanfic-hat > section > div > div.fanfic-hat-body").html());
            item = item.replace('__annotation',$(this).find("section.fanfic-hat > div.fanfic-hat-body").html());

            outBlockUpdData +=item;

        });
        outBlockUpdData = '<main id="main" class="clearfix" style="display:flex;overflow:auto;border-radius: 0 0 4px 4px;"><div class="main-holder alt p-5-10-10" style="display: inline-flex;width: 100%;flex-direction: column;flex-wrap: wrap;align-content: stretch;justify-content: space-evenly;align-items: stretch;padding:0px;"><section class="content-section overfl custom-scroll maxwd m-0-5" id="updated-text-parts" style="margin-bottom:10px!important;">'+outBlockUpdData+'</section></div></main>';
        popupWindow_upd = popupWindow_upd.replace(/__content/,outBlockUpdData);
        $('body').prepend(popupWindow_upd);
        //console.info("dfdfafadf: "+popupWindow_upd);
       // $('div.np-main-info').prepend(popupWindow_upd);

        $("#notification-fic-upd-details > span").each(function() {
            data[0]['url'].forEach(function(url, cur){
                var dt = data[0]['url'][cur];
                var uri = /readfic\/(.+)/m;
                var fid = url.match(uri);

                $('#updated-text-parts').find('article.fanfic-inline').find('a[href="/readfic/'+fid[1]+'"]').on('click', function(){
                    $('#updated-text-parts').find('div[data-cur="/readfic/'+fid[1]+'"]').css('display','none');
                    if (getCookie('ficbook_last_marknotifold') != data[0]['id'][cur]) {
                        markNotifOld(data[0], cur);
                        setCookie('ficbook_last_marknotifold',data[0]['id'][cur]);
                    }
                    if ($('#myModal-upd')[0].offsetHeight < 140) {
                        $('#myModal__close-upd').click(); //если все элементы списка скрыты - вызвать событие закрытия окна
                        $('.myLinkModal-upd').hide();
                    }
                }).attr('target', '_blank');
            });
        });

        //события для всплывающего окна
        $('a.myLinkModal-upd').click( function(event){
            event.preventDefault();
            $('#myOverlay-upd').fadeIn(297, function(){
                $('#myModal-upd')
                    .css('display', 'inline-flex')
                    .animate({opacity: 1}, 198);
            });
        });

        $('#myModal__close-upd, #myOverlay-upd').click( function(){
            $('#myModal-upd').animate({opacity: 0}, 198,
                                      function(){
                $(this).css('display', 'none');
                $('#myOverlay-upd').fadeOut(297);
            });
        });
        $(document).keydown(function(e) {
            if (e.keyCode === 27) {
                e.stopPropagation();
                $('#myModal-upd').animate({opacity: 0}, 198,
                                          function(){
                    $(this).css('display', 'none');
                    $('#myOverlay-upd').fadeOut(297);
                });
            }
        });

        for (var i in blocks) {
            var el = blocks[i];
            if (blocks[i].block == true || blocks[i].changeContent == true) {
                blockElement(el);
            }
        }


    }

}
//загрузка в блоки всплывающих окон с лентами оповещений по типам обновлений
function updNotifOfFav(data) {
    //шаблон всплывающего окна
    var popupWindow_fav = '<div id="myModal-fav"><h3>Новые обновления ваших избранных авторов</h3>__content<span id="myModal__close-fav" class="close">ₓ</span></div><div id="myOverlay-fav"></div>';
    //добавляем скрытые блоки по типам и загружаем в них списки обновлений
    var updBlock = '<div class="p-5-10-5-5" data-cur="__cursor"><div class="myshadow"><article class="fanfic-inline mbt-2" style="margin-top:5px!important;"><div class="js-toggle-description"><h3 class="fanfic-inline-title"><a class="visit-link" data-fav-authors-text-url="true" href="__url">__title</a></h3><div class="fanfic-main-info">__ficdata __annotation</div></div></article></div></div>';
    //console.info('updNotifOfFav:');
    //console.info(data.length);
    //console.info(data);

    if (data.length > 0) {
        var outBlockUpdData = '';
        $("#notification-fic-fav-details > span").each(function(cur) {
            var item = updBlock;
            var title = '';
            title = $(this).find('h1.heading').text().trim();
            //console.info("title:" + title);
            if (title.length < 1) return true;
            item = item.replace('__title',title);
            //var text_fid = $(this).find('div.hat-actions-container.hidden-xs > div > span').attr("data-fanfic-id");
            //if (text_fid == undefined) {
            var dt = data[0]['url'][cur];
            var uri = /readfic\/(.+)/m;
            var text_fid = dt.match(uri);
            //console.info(text_fid);
            text_fid = text_fid[1];
            //}
            var text_url = '/readfic/'+text_fid;
            item = item.replace('__url',text_url);
            item = item.replace('__cursor',text_url);
            var genre = $(this).find("section > div.badge-with-icon > svg").attr('class');
            //console.info(genre);
            if (genre != 'undefined' && genre.length > 1) genre = genre.replace('ic_','');
            //console.info(text_url);
            //console.info(genre);
            item = item.replace('__ficdata',$(this).find("section").html());
            //console.info($(this).find('h1.text-h1 + div').html());
            //в одну строку аватары и ники авторов текста
            $(this).find("section").css({'display': 'flex', 'flex-wrap':'wrap'});
            $(this).find("section > div.hat-creator-container").css({
                'display': 'inline-flex',
                'flex-flow': 'column nowrap',
                'align-content': 'center',
                'margin': '0px 10px',
                'flex-direction': 'row'
            });
            $(this).find("section > div.hat-creator-container > div.creator-info").css({
                'display': 'inline-flex',
                'flex-direction': 'column',
                'flex-wrap': 'nowrap',
                'align-content': 'center'
            });
            $(this).find("section > div.hat-creator-container > div.avatar-decoration-holder").css({
                'display': 'inline-flex',
                'flex-direction': 'column',
                'flex-wrap': 'nowrap',
                'align-content': 'center',
                'align-items': 'center',
                'text-align': 'center'
            });
            $(this).find("div.description").find("div.mb-5").each(function(){
                var str = $(this).find('strong').text();
                if (str == 'Примечания:' || str =='Публикация на других ресурсах:' || str =='Посвящение:') $(this).css('display','none');
            });
            //забираем блок аннотации текста после правок стилей выше
            item = item.replace('__annotation',$(this).find("section.fanfic-hat > div.fanfic-hat-body").html());

            outBlockUpdData +=item;
        });
        outBlockUpdData = '<main id="main" class="clearfix" style="display:flex;overflow:auto;border-radius: 0 0 4px 4px;"><div class="main-holder alt p-5-10-10" style="display: inline-flex;width: 100%;flex-direction: column;flex-wrap: wrap;align-content: stretch;justify-content: space-evenly;align-items: stretch;padding:0px;"><section id="favorites-authors" class="content-section overfl custom-scroll maxwd m-0-5" style="margin-bottom:10px!important;">'+outBlockUpdData+'</section></div></main>';
        popupWindow_fav = popupWindow_fav.replace(/__content/,outBlockUpdData);

        $('body').prepend(popupWindow_fav);

        $("#notification-fic-fav-details > span").each(function() {
            data[0]['url'].forEach(function(url, cur){
                var dt = data[0]['date'][cur];
                var uri = /readfic\/(.+)/m;
                var fid = url.match(uri);
                $('#favorites-authors').find('a[href="/readfic/'+fid[1]+'"]').on('click', function(){
                    $('#favorites-authors').find('div[data-cur="/readfic/'+fid[1]+'"]').css('display','none');
                    if (getCookie('ficbook_last_marknotifold') != data[0]['id'][cur]) {
                        markNotifOld(data[0], cur);
                        setCookie('ficbook_last_marknotifold',data[0]['id'][cur]);
                    }

                    if ($('#myModal-fav')[0].offsetHeight < 140) {
                        $('#myModal__close-fav').click(); //если все элементы списка скрыты - вызвать событие закрытия окна
                        $('.myLinkModal-fav').hide();
                    }
                }).attr('target', '_blank');
            });
        });

        //события для всплывающего окна fav
        $('a.myLinkModal-fav').click( function(event){
            event.preventDefault();
            $('#myOverlay-fav').fadeIn(297, function(){
                $('#myModal-fav')
                    .css('display', 'inline-flex')
                    .animate({opacity: 1}, 198);
            });
        });

        $('#myModal__close-fav, #myOverlay-fav').click( function(){
            $('#myModal-fav').animate({opacity: 0}, 198,
                                      function(){
                $(this).css('display', 'none');
                $('#myOverlay-fav').fadeOut(297);
            });
        });
        $(document).keydown(function(e) {
            if (e.keyCode === 27) {
                e.stopPropagation();
                $('#myModal-fav').animate({opacity: 0}, 198,
                                          function(){
                    $(this).css('display', 'none');
                    $('#myOverlay-fav').fadeOut(297);
                });
            }
        });

        for (var i in blocks) {
            var el = blocks[i];
            if (blocks[i].block == true || blocks[i].changeContent == true) {
                blockElement(el);
            }
        }
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function downloadfic() {
    var dwnLink = document.location.pathname;
    var uri = /readfic\/(.+)/m;
    var fid = dwnLink.match(uri);
    if (Array.isArray(fid)) {
        downloadfic_new();
    }
}

function downloadfic_new(force_click = 0) {
    var dwnLink = document.location.pathname;
    var uri = /(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})|(\d+)/g // /readfic\/(.+)/m;
    var fid = dwnLink.match(uri);

    if (Array.isArray(fid)) {
        if (settings.download.autosave == true && getCookie('ficbook_startdownload_from_contents') == 1 || force_click == 1) {
            deleteCookie('ficbook_startdownload_from_contents');
            location.href='/fanfic_download/'+fid[0]+'/'+settings.download.format;
        } else {
            $("#content-download-page-selector").load('/readfic/'+fid[0]+'/download fanfics-download-button[metrics-id="download-fic-'+settings.download.format+'"]', function() {
                location.href=$("#content-download-page-selector fanfics-download-button").attr('link');
            });
            //location.href='/fanfic_download/'+fid[0]+'/'+settings.download.format;
        }
    }
}

/*© Un Sstrennen,2020*/function getCookie(e,t=!1){if(!e)return;let n=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([.$?*|{}()\[\]\\\/+^])/g,"\\$1")+"=([^;]*)"));if(n){let e=decodeURIComponent(n[1]);if(t)try{return JSON.parse(e)}catch(e){}return e}}function setCookie(e,t,n={path:"/"}){if(!e)return;(n=n||{}).expires instanceof Date&&(n.expires=n.expires.toUTCString()),t instanceof Object&&(t=JSON.stringify(t));let o=encodeURIComponent(e)+"="+encodeURIComponent(t);for(let e in n){o+="; "+e;let t=n[e];!0!==t&&(o+="="+t)}document.cookie=o}function deleteCookie(e){setCookie(e,null,{expires:new Date,path:"/"})}

//Удаляем переходную страницу на ссылках
function removeThanksPage() {
    var awayString = '/thanks-author-page';
    $('a[href$="' + awayString + '"]').each(function(){
        // Update the 'rules[0]' part of the name attribute to contain the latest count
        $(this).attr('href', $(this).attr('href').replace(awayString,'#part_content'));
        $(this).prev().hide();
        $(this).html('<svg class="svg-icon ic_ordered-list "><use href="/assets/icons/'+sprite+'#ic_ordered-list"></use></svg><span class="hidden-xs">Содержание</span>');
    });
}

//Выполняет переход с заглушки про блокировку на ficbook.me на страницу произведения на ficbook.net
function redirectRKNPage() {
    var freeString = 'ficbook.net';
    var rknString = 'ficbook.me';
    var hostname = document.location.hostname;
    var href = document.location.href;

    if ($('a[href^="http://eais.rkn.gov.ru/faq/"]').length > 0) {
        if (hostname == rknString) {
            var regex = /(ficbook.me)/gi
            var uri = href.replace(regex, freeString);
            location.href = uri;
        }
    }
}

//генерация случайного числа в диапазоне
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

//определение номера текущего спрайта для использования в стилях скрипта
function getNumSprite() {
     if (document.location.href != 'https://'+document.location.hostname+'/user_notifications/mark_old_all')
         return $('a[href="/"]').find('svg.logo_min').find('use').attr('href').replace('/assets/icons/','').replace('#logo_min','');

}

//Запуск после загрузки документа
(function() {
    'use strict';

    sprite = getNumSprite();

    //Блок кнопок для отметок прочитанными и удаления оповещений в категории
    btnNotifBlock = '<div class="notification-action-buttons" style="float:right">'+
    '<form class="d-inline-block mr-5 jsAjaxSubmitForm" action="/user_notifications/mark_old_all" method="post">'+
    '<input type="hidden" name="type" value="__TYPE">'+
    '<button type="submit" class="btn btn-default" onclick="return confirm(\'Отметить все оповещения в выбранной категории как прочитанные?\')">'+
    '<svg class="svg-icon ic_ok icon mr-5"><use href="/assets/icons/'+sprite+'#ic_ok"></use></svg>'+
    'Всё прочитано'+
    '</button>'+
    '</form>'+
    '<form class="d-inline-block" action="/user_notifications/delete_all" method="post">'+
    '<input type="hidden" name="type" value="__TYPE">'+
    '<button type="submit" class="btn btn-default" onclick="return confirm(\'Удалить все оповещения в выбранной категории?\')">'+
    '<svg class="svg-icon ic_bin icon mr-5"><use href="/assets/icons/'+sprite+'#ic_bin"></use></svg>'+
    'Удалить оповещения'+
    '</button>'+
    '</form>'+
    '</div>';


    //Проверяем куку настроек и грузим их из неё, а если её нет, то создаём куку.
    if (settings.cookies.enabled == true) {
        var storedSettings = getCookie('fni_settings');
        if (typeof storedSettings !== 'undefined') { //если есть, то грузим и пользуемся
            settings = JSON.parse(storedSettings);
        } else {
            //если нет, то сохраняем дефолтные в куку
            setCookie('fni_settings', JSON.stringify(settings));
        }
    }

    //если получили ответ со страницы https://ficbook.net/user_notifications/mark_old_all, то
    //значит, что нажимали на кнопку отметки прочитанным или удаления оповещений и нужно вернуться назад
    if (document.location.href == 'https://'+document.location.hostname+'/user_notifications/mark_old_all') {
        switch (getCookie('ficbook_lasturl')) {
            case '17':
                deleteCookie('ficbook_lasturl');
                document.location.replace( 'https://'+document.location.hostname+'/home/favourites' );
                break;
            case '18':
                deleteCookie('ficbook_lasturl');
                document.location.replace( 'https://'+document.location.hostname+'/home/collections?type=other' );
                break;
            case '19':
                deleteCookie('ficbook_lasturl');
                document.location.replace( 'https://'+document.location.hostname+'/home/collections?type=update' );
                break;
        }

    }

    //добавляем стили
    addStyles();
    //убераем заглушку РКН
    if (settings.fixes.redirect_from_rkn_page == true) redirectRKNPage();

    //кнопка скачать
    if (settings.download.enabled == true) {
        $("section.chapter-info > header").append(
            '<div class="button-container" style="margin:1rem 0;">'+
            '<a id="downloadfic_dynbutton" type="submit" class="btn btn-primary btn-with-description">'+
            '<span class="main-info"><svg class="svg-icon ic_download ">'+
            '<use href="/assets/icons/'+sprite+'#ic_download"></use>'+
            '</svg></span><span class="description"> Скачать '+ (settings.download.format).toUpperCase() +'</span>'+
            '</a>'+
            '<div id="content-download-page-selector" style="display:none;"></div>');
        $("a#downloadfic_dynbutton").on("click", function(e){downloadfic_new(); e.stopPropagation();});

        if (getCookie('ficbook_startdownload_from_contents') == 1) {
            downloadfic_new();
        }
    }

    for (var i in blocks) {
        var el = blocks[i];
        if (blocks[i].block == true || blocks[i].changeContent == true) {
            blockElement(el);
        }
        //alert(i);
    }

    //блокировка авторов комментариев в динамической подгрузке
    $("body").on("mouseover", "section", function (event) {
        blockElement(blocks['authors']);
        blockElement(blocks['comments_authors']);
    });
    $("body").on("touchmove", "section", function (event) {
        blockElement(blocks['authors']);
        blockElement(blocks['comments_authors']);
    });
    $("body").on("focus", "section", function (event) {
        blockElement(blocks['authors']);
        blockElement(blocks['comments_authors']);
    });
    $('body').on('scroll', 'section', function (event) {
        blockElement(blocks["authors"]);
        blockElement(blocks['comments_authors']);
    });
    $('body').on("keydown", "section", function (event) {
        blockElement(blocks['authors']);
        blockElement(blocks['comments_authors']);
    });

    if (settings.fixes.remove_away_page == true) {
        removeAwayPage();
        //вырезаем страницу перенаправления по всем сторонним ссылкам в динамически подгружаемых комментариях
        $("body").on("focus", ".js-comments-container", function () {

            var awayString = '/away?url=';
            $(this).find('a[href^="' + awayString + '"]').each(function(){
                // Update the 'rules[0]' part of the name attribute to contain the latest count
                $(this).attr('href', $(this).attr('href').replace(awayString,''));
                // Add attribute target="_blank"
                $(this).attr('target', '_blank' );
                $(this).attr('href', decodeURIComponent($(this).attr('href')));
            });

        });
        $("body").on("touchmove", ".js-comments-container", function () {

            var awayString = '/away?url=';
            $(this).find('a[href^="' + awayString + '"]').each(function(){
                // Update the 'rules[0]' part of the name attribute to contain the latest count
                $(this).attr('href', $(this).attr('href').replace(awayString,''));
                // Add attribute target="_blank"
                $(this).attr('target', '_blank' );
                $(this).attr('href', decodeURIComponent($(this).attr('href')));
            });

        });
    }
    if (settings.fixes.remove_thanks_author_page_link == true) removeThanksPage();

    showUserNotifications();

})();