// ==UserScript==
// @name        HWM_Def_Pre_Notifications
// @namespace   Рианти
// @description Уведомления о начинающемся вскоре наборе в защиты (уведомляет когда вкладка битв становится оранжевой)
// @include     *heroeswm.ru*
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24881/HWM_Def_Pre_Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/24881/HWM_Def_Pre_Notifications.meta.js
// ==/UserScript==

var sound = 'http://www.freesfx.co.uk/rx2/mp3s/4/16584_1460661075.mp3';

if(Notification.permission !== 'denied' && Notification.permission !== "granted") Notification.requestPermission(function (permission) {
  if (permission === "granted") {
    var notification = new Notification("Теперь вы будете получать уведомления о предствоящих защитах.");
  } else {
    alert ('Без разрешения на уведомления вам будет доступно только уведомление звуковым сигналом.');
  }
});

var lastCheckResult, lastNotifyTime, now, isActive, lastCheckTime;

check(document);

function check(dom){
    lastCheckResult = parseInt(GM_getValue('lastCheckResult', '1'));
    lastNotifyTime = parseInt(GM_getValue('lastNotifyTime', '0'));
    now = Date.now();
    isActive = dom.querySelector('body').innerHTML.indexOf('<font color="#ff9c00">Битвы</font>') > -1 ? 1 : 0;

    if(isActive && !lastCheckResult && (now > 60 * 1000 + lastNotifyTime)) notify();

    GM_setValue('lastCheckTime', now);
    GM_setValue('lastCheckResult', isActive);
    setTimeout(intervalCheck, 60 * 1000);
}

function intervalCheck(){
  now = Date.now();
  lastCheckTime = parseInt(GM_getValue('lastCheckTime', '0'));
  console.log(60 * 1000 + lastCheckTime - now);
  if (now >= 60 * 1000 + lastCheckTime){
    GM_setValue('lastCheckTime', now);
    requestPage(location.protocol + '//' + location.hostname + '/home.php', check);
  } else {
    setTimeout(intervalCheck, 60 * 1000 + lastCheckTime - now + Math.random() * 500); // Случайная прибавка позволяет избежать риска загрузки на лишних вкладках.
  }
}

function notify(){
  GM_setValue('lastNotifyTime', now);
  new Audio(sound).play();

  if (Notification.permission === "granted") {
    var notification = new Notification("Силы тьмы на подходе!");
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        var notification = new Notification("Силы тьмы на подходе!");
      }
    });
  }
}

function requestPage (url, onloadHandler){
  console.log('[HWM_Def_Pre_Notifications] loading: ', url);
  GM_xmlhttpRequest({
    overrideMimeType: 'text/plain; charset=windows-1251',
    synchronous: false,
    url: url,
    method: "GET",
    onload: function(response){
      onloadHandler(new DOMParser().parseFromString(response.responseText, 'text/html').documentElement);
    },
    onerror: function(){ requestPage (url, onloadHandler) },
    ontimeout: function(){ requestPage (url, onloadHandler) },
    timeout: 5000
  });
}