// ==UserScript==
// @name         Преміум доступ
// @namespace    http://tampermonkey.net/
// @version      2024-11-09
// @description  Необмежений доступ до розв'язків тестових завдань на zno.osvita.ua.
// @author       erxson
// @match        https://zno.osvita.ua/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=osvita.ua
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515425/%D0%9F%D1%80%D0%B5%D0%BC%D1%96%D1%83%D0%BC%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/515425/%D0%9F%D1%80%D0%B5%D0%BC%D1%96%D1%83%D0%BC%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF.meta.js
// ==/UserScript==

// Це жарт якийсь?
window.isPrem = function() { return true; };
window.showComment = function (commentId) {
  let testId = '';

  if (typeof window.test_id === 'undefined') {
    var locationParts = window.location.pathname.split('/');
    testId = locationParts[1];
  } else {
    testId = window.test_id;
  }

  let op = window.zrtt('comop_' + testId);

  document.getElementById('btn_show_' + commentId).style.display = 'none';
  document.getElementById('commentar_' + commentId).style.display = 'inline-block';

  if (typeof window.dataLayer !== 'undefined') {
    let eventData = { eventAction: 'openComment' };
    eventData.eventCategory = 'ЗНО-онлайн';
    eventData.eventLabel = 'showComment';
    eventData.event = testId + '|' + op + '|' + 1;
    window.dataLayer.push(eventData);
  }
};

/* index.html:
<script type="text/javascript">
window.onload = function () {
  if (window.zStat) {
    zStat()
  }
  setTimeout(function () {
    if (getCookie('ost') === undefined || getCookie('ost').length < 10) {
      $('.explanation')
        .html('<p>Коментарі для зареєстрованих користувачів!</p>')
        .hide()
    }
  }, 10000)
}
</script>
*/
if (window.getCookie('ost') === undefined || window.getCookie('ost').length < 10) {
    window.setCookie('ost', '00000000000000000000000000000000')
}