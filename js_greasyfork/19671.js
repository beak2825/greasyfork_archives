// ==UserScript==
// @name           SL-autoquote-test
// @name:ru        СЛ-автоцитата-тест
// @namespace      Reshpekt Fund Russia
// author          Reshpekt Fund Russia
// @description    Preload quotes
// @description:ru Загружает цитату в ленту комментариев (в профиле)
// @version        0.2
// @include        http://smart-lab.ru/my/*
// @exclude        http://smart-lab.ru/uploads/*
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/19671/SL-autoquote-test.user.js
// @updateURL https://update.greasyfork.org/scripts/19671/SL-autoquote-test.meta.js
// ==/UserScript==

(function () {
    // проверить, что нужная нам страница, если нет, то свалить
    var x = document.querySelector('.content_desc');
    if ( !x || x.textContent.indexOf('Комментарии пользователя') != 0) return;

    //все контейнеры с комментом
    var d = document.querySelectorAll('div.comments'),
        l, t, a = [], b = [], I = 0;
    // если нет комментов, то свалить
    if (!d) return;
    for (var i = 0; i < d.length; i++) {
        l = d[i].querySelector('ul a[href*="#comment"]');
        t = d[i].querySelector('div.text');
        if (l && t) {
            a[a.length] = [l.href.split('#')[0], [l.href.split('#comment')[1], t]];
        }
   }

    a.sort(function (a, b) {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    });
    // первый элемент в новый массив
    b[b.length] = a[0];
    // !!!со второго элемента, первый уже положили
    for (var i = 1; i < a.length; i++) {
        if (a[i][0] == b[b.length-1][0]) {
            b[b.length-1].push(a[i][1]);
        } else {
            b.push(a[i]);
        }
    }

    function getQuote(d) {
        var p, pl;
        // со 2-ого элемента, в первом адрес страницы
        for (var i = 1; i < b[I].length; i++) {
            //ищем линк на папу
            pl = d.querySelector('#comment_id_' + b[I][i][0] + ' li.goto-comment-parent a');
            // если есть линк на папу, то ищем папу
            if (pl) {
                p = d.querySelector('#comment_id_' + pl.getAttribute('href').split('#comment')[1] + ' div.text');
            }
            // папа может быть удалён, а папалинк остаётся, проверять обоих
            if (pl && p) {
                b[I][i][1].innerHTML = '<blockquote>' + p.textContent
                    + '<br><p style="text-align:right;font-size:60%;font-style:normal;margin:0 -12px -6px 0;">[autoquote]</p></blockquote><br>'
                    + b[I][i][1].innerHTML;
            }
        }
        // пока счётчик меньше длины массива с адресами грузим страницы
        if (++I < b.length) {
            getPage(getQuote);
        } else {
            info.style.cssText = 'display:none;';
        }
    }

    function getPage(f) {
        var x = new XMLHttpRequest();
        x.open('GET', b[I][0], true);
        x.onreadystatechange = function () {
            if (x.readyState == 4) {
                if(x.status == 200) {
                    f((new DOMParser()).parseFromString(x.responseText,'text/html'));
                }
            }
        };
        x.send(null);
    }

    var info = document.createElement('p');
    info.id = 'infospan';
    info.style.cssText = 'color:green;';
    document.querySelector('div#content div').appendChild(info);
    info.textContent = 'Идёт автоматическая загрузка цитат.....';

    getPage(getQuote);

})();