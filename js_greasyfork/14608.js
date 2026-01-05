// ==UserScript==
// @id SoHabr
// @name Всегдабр
// @version 0.1.4
// @namespace sohabr
// @author leenr <i@leenr.ru> https://sohabr.net/vsegdabr
// @author i20664d
// @description Позволяет быстро перейти на СоХабр/SavePearlHarbor, если просматриваемый пост на Хабрахабре, Гиктаймсе или Мегамозге недоступен.
// @include habrahabr.ru/company/post/*
// @include habrahabr.ru/post/*
// @include geektimes.ru/company/post/*
// @include geektimes.ru/post/*
// @include megamozg.ru/company/post/*
// @include megamozg.ru/post/*
// @run-at document-end
// @icon https://greasyfork.org/system/screenshots/screenshots/000/002/738/original/sohabr.png
// @resource necontabr https://greasyfork.org/system/screenshots/screenshots/000/002/740/original/necontabr.png
// @resource animation https://greasyfork.org/system/screenshots/screenshots/000/002/741/thumb/animated.png
// @resource razdolbabr https://greasyfork.org/system/screenshots/screenshots/000/002/739/original/razdolbabr.png
// @require https://greasyfork.org/scripts/14604-scriptsettings/code/ScriptSettings.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/14608/%D0%92%D1%81%D0%B5%D0%B3%D0%B4%D0%B0%D0%B1%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/14608/%D0%92%D1%81%D0%B5%D0%B3%D0%B4%D0%B0%D0%B1%D1%80.meta.js
// ==/UserScript==
'use strict';
Notification.requestPermission();
const notifId=('sohabr-всегдабр-скрипт'+Math.random())+Math.random();
let c = new ScriptSettings({
  mode : [
    'auto',//Автоматически переходить на СоХабр/SavePearlHarbor
    'manual',//Отобразить информацию о посте (заголовок и дату публикации), а также ссылки на СоХабр и SavePearlHarbor
    'off'//Не предпринимать никаких действий
  ],
  immediatelyRedirect : [!1, 'sohabr', 'savepearlharbor'],
  dontCheckout : !1,
  checkoutSoHabr : !0,
  checkoutSavePearlHarbor : !0,
  showPostInfo : !0//Показывать заголовок поста и дату его публикации
});
function d(a, e) {
  var b = document.createElement('A');
  b.href = a;
  b.textContent = 'Проследовать на ' + e;
  document.body.appendChild(b);
  return b;
}
function f() {
  GM_xmlHttpRequest({
    method : 'GET',
    url : 'https://sohabr.net/vsegdabr/check/post/' + g + ':' + h + '/',
    onload(a) {
      a = JSON.parse(a);
      document.getElementById('checking').style.display='none';
      var e = !1,
      b = null;
      'sohabr' in a && (d(a.sohabr.url, 'СоХабр'), e = !0, b = a.sohabr.url);
      'savepearlharbor' in a && (d(a.savepearlharbor.url, 'SavePearlHarbor'), e = !0, null == b && (b = a.savepearlharbor.url));
      if (e) {
        if ('manual' != c.mode || c.showPostInfo) {
          document.createElement('time').textContent = a.date_humanlystr,
          document.createElement('h1').textContent = a.title;
        }
        'auto' == c.mode && (window.top.location.href = b);
      } else {
        new Notification('Никогдабр',{body:'К сожалению, Всегдабр не может найти этот пост... :(', icon:GM_getResourceUrl('razdolbabr'), lang:'ru',tag:notifId});
      }
    },
    onerror() {
      new Notification('Неконтабр',{body:'Не получается проверить наличие резервной копии', icon:GM_getResourceUrl('necontabr'), lang:'ru',tag:notifId});
    }
  });
}
{
  if (document.getElementById('reg-wrapper')) {
    var k = location.pathname.match(/\/(?:company\/.+\/blog|post)?\/(\d+)\//);
    if (null != k) {
      var g = null;
      switch (location.hostname) {
      case 'habrahabr.ru':
        g = 'habr';
        break;
      case 'geektimes.ru': ;
      case 'geektimes.com':
        g = 'gt';
        break;
      case 'megamozg.ru':
        g = 'mm';
      }
      var h = Number.parseInt(k[1]),
      l = c.mode;
      if (NaN !== h) {
        var m = d('https://sohabr.net/' + g + '/post/' + h + '/', 'СоХабр'),
        n = d('http://savepearlharbor.com/?p=' + h, 'SavePearlHarbour');
        if ('auto' == l && c.immediatelyRedirect) {
          var p = null;
          'sohabr' == c.immediatelyRedirectTo ? p = m.href : 'habr' == g && (p = n.href);
          if (null != p) {
            window.top.location.replace(p);
            break a;
          }
          l = 'manual';
        }
        if ('auto' == l || 'manual' == l && !c.dontCheckout) {
          new Notification('ГдеХабр?',{body:'Проверка наличия статьи в других источниках', icon:GM_getResourceUrl('animation'), lang:'ru',tag:notifId});
          f();
        }
      } else {
        new Notification('Раздолбабр',{body:'Почему-то ид статьи не является числом', icon:GM_getResourceUrl('razdolbabr'), lang:'ru',tag:notifId});
      }
    }
  }
};