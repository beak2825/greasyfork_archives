// ==UserScript==
// @name           SL-autoquote
// @name:ru        СЛ-автоцитата
// @namespace      Reshpekt Fund Russia
// @author         Reshpekt Fund Russia
// @description    Preload quotes to comments (profile)
// @description:ru Загружает цитату в ленту комментариев (в профиле)
// @version        0.2
// @include        http://smart-lab.ru/my/*
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/19687/SL-autoquote.user.js
// @updateURL https://update.greasyfork.org/scripts/19687/SL-autoquote.meta.js
// ==/UserScript==

(function () {

var x = document.querySelector('.content_desc');
if ( !x || x.textContent.indexOf('Комментарии пользователя') != 0) return;
var d = document.querySelectorAll('div.comments'), l, t, a = [], b = [], I = 0, s;
if (!d) return;
for (var i = 0; i < d.length; i++) {
    if ((l = d[i].querySelector('ul a[href*="#comment"]'))
        && (t = d[i].querySelector('div.text'))) {
            a[a.length] = [l.href.split('#')[0], [l.href.split('#comment')[1], t]];
    }
}
if (!a.length) return;
a.sort(function (a, b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
});
b[b.length] = a[0];
for (i = 1; i < a.length; i++) {
    if (a[i][0] == b[b.length-1][0]) {
        b[b.length-1].push(a[i][1]);
    } else {
        b.push(a[i]);
    }
}
function Q(d) {
    var p, pl;
    for (var i = 1; i < b[I].length; i++) {
        if ((pl = d.querySelector('#comment_id_' + b[I][i][0] + ' li.goto-comment-parent a'))
            && (p  = d.querySelector('#comment_id_' + pl.getAttribute('href').split('#comment')[1] + ' div.text'))
                && p.textContent.replace(/^\s*|\s*$|/g, '')) {
                    b[I][i][1].innerHTML = '<blockquote style="font-style:italic">' + p.textContent
                        + '<br><p style="text-align:right;font-size:60%;font-style:normal;margin:0 -12px -6px 0;">[autoquote]</p></blockquote><br>'
                        + b[I][i][1].innerHTML;
        }
    }
    if (++I < b.length) P(Q);
    else s.style.cssText = 'display:none;';
}
function P(f) {
    s.textContent = '.....автозагрузка цитат, получаю страницу ' + (I+1) + ' (' + b[I][0] + ')';
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
s = document.createElement('p');
s.id = 'infospan';
s.style.cssText = 'margin:2px 0 -14px 0;color:green;font-size:10px;';
document.querySelector('div#content div').appendChild(s);
P(Q);

})();