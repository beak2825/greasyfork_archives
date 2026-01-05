// ==UserScript==
// @name           chat-test
// @name:ru        чат-тест
// @namespace      Reshpekt Fund Russia
// @author         Reshpekt Fund Russia
// @description    Beautify it!
// @description:ru Наводим красотень!
// @version        0.4
// @include        http://чаттрейдеров.рф/chat*
// @include        http://xn--80aefdbw1bleoa1d.xn--p1ai/chat*
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/20486/chat-test.user.js
// @updateURL https://update.greasyfork.org/scripts/20486/chat-test.meta.js
// ==/UserScript==

var timeout;

(function () {

    function P(v, d, m, p) {
        GM_registerMenuCommand(m, function () {
            var val = prompt(p, GM_getValue(v, d));
            if (val === null) return;
            val = val.replace(/^\s*|\s*$|/g, '').replace(/^,*|,*$/g, '');
            GM_setValue(v, val);
            location.reload();
        });
    }

    P('CHAT-names',
        'ator(mediumblue), Blanch(green), Gambler(steelblue), Gamer(crimson), kaa(red), Korax(maroon), ' +
        'ktototam(navy), Lawyer(red), Papay(#660066), RFR(navy), sgl(darkgreen), Кхолле Кхокк(darkolivegreen), Фыва(seagreen)',
        'Раскраска ников',
        'Введите ЧЕРЕЗ ЗАПЯТУЮ имена (ники), которые вы видите в чате и хотите «раскрасить», порядок в списке не важен, но в алфавитном будет удобнее.\r\n\ ' + 
        'Рядом с именем В СКОБКАХ укажите любой понравившийся цвет в формате X11 или формате HTML ( таблица цветов здесь: http://tinyurl.com/zndkb59 ).\r\n\ ' +
        'По умолчанию некоторые ники уже «раскрашены», но можно заменить цвет или удалить, все остальные в чате будут, как чёрно-белое кино, прости, Lawyer...\r\n\r\n'
    );

    P('CHAT-avatars',
        '0',
        'Отображение аватарок',
        'Отображение аватарок, введите число:\r\n\r\n' +
        '1 - показывать аватарки\r\n' +
        '0 - не показывать аватарки, беречь глаза (по умолчанию)\r\n'
    );

    P('CHAT-date',
        '0',
        'Отображение даты слева от времени',
        'Отображение даты, введите число:\r\n\r\n' +
        '1 - показывать дату, удобно для копирования сигнала, цитаты и проч.\r\n' +
        '0 - не показывать дату (по умолчанию)\r\n'
    );
    
    P('CHAT-highlight',
        'Введите в это поле свой никнейм',
        'Подсветка сообщений в свой адрес',
        'Укажите свой никнейм, чтобы сообщения в ваш адрес были подсвечены.\r\n\r\n'
    );

    P('CHAT-highlight2',
        'брент|сбер|газ|биндекс|сиськ|путин',
        'Подсветка сообщений, в которых есть определённый текст',
        'Укажите набор текста через вертикальный слеш (без пробелов), чтобы сообщения были подсвечены.\r\n\r\n'
    );

    var key =  GM_getValue('CHAT-avatars') || 0,
        key2 = GM_getValue('CHAT-date') || 0,
        nam =  GM_getValue('CHAT-names') || '',
        hlt =  GM_getValue('CHAT-highlight') || '',
        hlt2 = GM_getValue('CHAT-highlight2') || '';

        nam = nam.split(',');

    var text_area = document.querySelector('#chat-textarea'),
        bbcd_area = document.querySelector('#bbcode_bb_bar'),
        chat_body = document.querySelector('ul.chat-body');
    
    if (chat_body) {
      var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
              for (var i = 0; i < mutation.addedNodes.length; i++){
                  if (mutation.addedNodes[i].nodeType == 1) {
                      F(mutation.addedNodes[i]);
                  }
              }
          });
      });
      observer.observe(chat_body, {childList: true, subtree: true});
    }

    // стиль-1
    var st1 = '.time {cursor:pointer;color:#606060;font-size:80%;}'+
              '.showall {color:#606060;padding-right:3px;cursor:pointer;}' +
              '.footer {display:none !important}' +
              '.chat-block{margin:10px 0 !important}' +
              '.chat-buttons {margin:0 0 2px 0 !important}' +
              '.chat-input {padding: 2px 12px 12px 12px !important}' +
              '.chat-block .chat-body > li .chat-text {padding:1px 0 1px 0;}' +
              '.left-content-block {padding-bottom: 0 !important}' +
              '.chat-input .input-group textarea{padding:2px;height:74px !important}' +
              '#privat {color:red;padding-left:20px;}';

    // стиль-2, если скрытие аватарок
    var st2 = '.chat-block .chat-body > li img.avatar,.chat-room-users li img {display:none !important;}'+
              '.chat-block .chat-body > li .chat-text,.chat-room-users li a {margin-left:4px !important;}';

    // функция добавления стилей
    function ST(st) {
        try {
            var h = document.getElementsByTagName('head')[0],
                s = document.createElement('style');
            s.type = 'text/css';
            h.appendChild(s);
            s.innerHTML = st;
        } catch (e) {
            if (!document.styleSheets.length) {
                document.createStyleSheet();
            }
            document.styleSheets[0].cssText += st;
        }
    }

    // добавить стиль-1
    ST(st1);
    // добавить стиль-2 (аватарки)
    if (key == 0) ST(st2);

    var privat_span = document.createElement('span');
    privat_span.id = 'privat';


    function F(x) {
        // имя, время коммента, текст коммента
        var name = x.querySelector('span.user-nickname'),
            time = x.querySelector('span.time'),
            text = x.querySelector('span.body');

        // выход, если нет хотя бы одного элемента
        if (!name && !time && !text) return;

        // удалить собачатину поганую
        text.innerHTML = text.innerHTML.replace(/(^| )@/g, '$1');

        // подсветка текста
        if (hlt2) {
                if (text.textContent.search(hlt2) != -1) {
                    text.style.cssText = 'background-color:#FBF3D3 !important;';
                }
        }

        // подсветка текста со своим ником
        if (hlt) {
            if (text.textContent.search(hlt) != -1) {
                text.style.cssText = 'background-color:#DFE8FF !important;';
           }
        }

        // раскрасить ники
        for (var i = 0; i < nam.length; i++) {
            var n  = nam[i].split('('),
                n1 = n[0].replace(/^\s*|\s*$|/g, ''),
                n2 = n[1].replace(')', '').replace(/^\s*|\s*$|/g, '');
            if (name.textContent.replace(/^\s*|\s*$|/g, '').toLowerCase() == n1.toLowerCase()) {
                name.style.cssText = 'color:' + n2;
                break;
            } else if (i == (nam.length - 1)) {
                name.style.cssText = 'color:#555;';
            }
        }

        // добавить дату в таймстэмп и убрать тултип
        if (key2 == 1) {
            time.textContent = '(' + time.getAttribute('data-original-title').replace(' ', ', ') + ')';
        } else {
            time.textContent = '(' + time.getAttribute('data-original-title').replace(' ', ', ').split(' ')[1] + ')';
        }
        time.setAttribute('data-toggle', 'v_pizdu_tooltip');

        // создать спан, при наведении на который подсвечиваются видимые комменты
        var s = document.createElement('span');
        s.className = 'showall';
        s.innerHTML = '•';
        name.parentNode.insertBefore(s, name);

        // подсветить все комменты при наведении
        s.onmouseover = function() {
            var d = chat_body.querySelectorAll('span.user-nickname');
            for (var i = 0; i < d.length; i++) {
                if (d[i].textContent == this.nextSibling.textContent) {
                    d[i].parentNode.style.background = '#CFE6CF';
                }
            }
        }
        // снять подсветку при отведении
        s.onmouseout = function() {
            var d = chat_body.querySelectorAll('span.user-nickname');
            for (var i = 0; i < d.length; i++) {
                if (d[i].textContent == this.nextSibling.textContent) {
                    d[i].parentNode.style.background = '';
                }
            }
        }

        // вешать обработчики ТОЛЬКО если мы не архиве (если есть строка ввода) иначе выход
        if (!text_area) return;

        // клик на таймстэмп
        time.onclick = function () {
            var t = document.querySelector('#chat-textarea');
            t.focus();
            t.value = '(' + time.getAttribute('data-original-title').replace(' ', ', ').split(' ')[1] + ') @' + name.textContent.replace(/^\s*|\s*$|/g, '') + '> ';
        }

        // обработка привата при клике правой кнопки
        name.oncontextmenu = function(e) {
            var d = document.querySelector('ul.chat-room-users').querySelectorAll('a.user-nickname'),
                f = document.querySelector('form.chat-form').querySelector('span.hidden-xs');
            // если открыт приват, то закрыть
            if (f && f.textContent == 'Сказать приватно') {
                bbcd_area.removeChild(document.querySelector('#privat'));
                text_area.style.background = '';
                f.parentNode.nextElementSibling.click();
            }
            // поиск имени в боковой таблице ников
            for (var i = 0; i < d.length; i++) {
                if (d[i].textContent == this.textContent) {
                    // принудительно включить приват, нажав на имя
                    d[i].click();
                    // подсветить красным строку ввода
                    text_area.style.background = '#FFABAB';
                    // добавить в панель bbcode имя того, с кем включён приват
                    privat_span.textContent = '[приват] @'+ this.textContent;
                    bbcd_area.appendChild(privat_span);
                    // добавить функцию очистки от привата на кнопку закрыть приват
                    // таймаут нужен, т.к. кнопки привата создаются онлайн
                    timeout = setTimeout(function () {
                        document.querySelector('form.chat-form').querySelector('span.hidden-xs').parentNode.nextElementSibling.onclick = function () {
                            //alert([text_area, bbcd_area, document.querySelector('#privat')]);
                            text_area.style.background = '';
                            if (document.querySelector('#privat')) {
                                bbcd_area.removeChild(document.querySelector('#privat'));
                            }
                        }
                        clearTimeout(timeout);
                    }, 600);
                    break;
                // если имени нет в списке, то кинуть алерт
                } else if (i == (d.length - 1)) alert(this.textContent + ' не найден в списке!')
            }
            text_area.focus();
            // отключить появление контекстного меню
            if (e.preventDefault) e.preventDefault();
            return false;
        }
    }

})();