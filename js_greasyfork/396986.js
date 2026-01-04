// ==UserScript==
// @name           Atelier 801 new messages notifications
// @name:ru        Оповещение о новых сообщениях на Atelier 801
// @namespace      https://greasyfork.org/ru/users/155145-inlifeuser
// @version        2020.03.18
// @description    This script notifies of unread messages on the Atelier 801 website (atelier801.com) in the browser and is a temporary solution until this website officially has support for browser notifications.
// @description:ru Этот скрипт уведомляет о непрочитанных сообщениях на сайте Atelier 801 (atelier801.com) в браузере и является временным решением, пока на этом сайте официально нету поддержки браузерных уведомлений.
// @author         Inlifeuser
// @license        MIT
// @include        *
// @grant          GM_addValueChangeListener
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_notification
// @connect        atelier801.com
// @downloadURL https://update.greasyfork.org/scripts/396986/Atelier%20801%20new%20messages%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/396986/Atelier%20801%20new%20messages%20notifications.meta.js
// ==/UserScript==

'use strict';

var checkInterval = 300; // In seconds

function getTimestamp () {
  return Date.now() / 1000 | 0
}

function checkConversations () {
  if (getTimestamp() - GM_getValue('atelier801NewMessagesNotificationsLastCheckTimestamp') >= checkInterval) {
    GM_setValue('atelier801NewMessagesNotificationsLastCheckTimestamp', getTimestamp());
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://atelier801.com/index',
      onload: function (response) {
        var websiteLanguage = (this.responseText.match(/<input type="hidden" id="langue_principale" name="langue_principale" value="(.*?)"/i) || [])[1];
        var loginButton = (this.responseText.match(/<div class="contenant-bouton-connexion-menu"><a href="(.*?)"/i) || [])[1];
        var loginLink = 'https://atelier801.com/' + loginButton;
        if (loginButton) {
          if (websiteLanguage === 'ru') {
            GM_notification({text: 'Для работы этого скрипта нужно войти в аккаунт на Atelier 801', title: 'Оповещение о новых сообщениях на Atelier 801 (UserScript)', onclick: function () { window.open(loginLink); }});
          } else {
            GM_notification({text: 'For this script to work, you need to log in to your Atelier 801 account', title: 'Atelier 801 new messages notifications (UserScript)', onclick: function () { window.open(loginLink); }});
          }
        }
        var unreadMessagesCount = (this.responseText.match(/<a href="\/conversations">(\d+)/i) || [])[1];
        var messagesLink = 'https://atelier801.com/conversations';
        if (unreadMessagesCount) {
          if (websiteLanguage === 'ru') {
            GM_notification({text: 'Новых сообщений: ' + unreadMessagesCount, title: 'Оповещение о новых сообщениях на Atelier 801 (UserScript)', onclick: function () { window.open(messagesLink); }});
          } else {
            GM_notification({text: unreadMessagesCount + ' new message(s)', title: 'Atelier 801 new messages notifications (UserScript)', onclick: function () { window.open(messagesLink); }});
          }
        }
      }
    });
  }
};

(function () {
  GM_addValueChangeListener('atelier801NewMessagesNotificationsLastCheckTimestamp');

  if (GM_getValue('atelier801NewMessagesNotificationsLastCheckTimestamp') === undefined) {
    GM_setValue('atelier801NewMessagesNotificationsLastCheckTimestamp', 0);
  }

  checkConversations();
  setInterval(checkConversations, checkInterval + '000');
})();
