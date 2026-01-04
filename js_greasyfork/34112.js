// ==UserScript==
// @name           Display additional information in VK profile
// @name:ru        Отображение доп. информации на странице ВКонтакте
// @name:uk        Відображення доп. інформації на сторінці VK
// @namespace      https://greasyfork.org/ru/users/155145-inlifeuser
// @version        2021.05.31
// @description    Display profile ID, registration date, last profile edit and last seen in VK user profile
// @description:ru Отображение номера страницы (ID), даты регистрации, последнего редактирования страницы и последний заход на странице пользователя ВКонтакте
// @description:uk Відображення номера сторінки (ID), дати реєстрації, останнього редагування сторінки і останній візит на сторінці користувача VK
// @author         Inlifeuser
// @license        MIT
// @include        *://vk.com/*
// @exclude        *://vk.com/notifier.php*
// @exclude        *://vk.com/*widget*.php*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/34112/Display%20additional%20information%20in%20VK%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/34112/Display%20additional%20information%20in%20VK%20profile.meta.js
// ==/UserScript==

'use strict';
function addLeadingZeroToDate (date) {
  return ('0' + date).slice(-2);
}
function convert24HoursTo12Hours (hours) {
  hours = hours % 12;
  return hours ? hours : 12;
}
function convert24HoursToAmPmLc (hours) {
  return hours >= 12 ? 'pm' : 'am';
}
(function () {
  new MutationObserver(function () {
    var vkProfilePage = document.body.querySelector('#profile_short:not(.display_additional_information_in_vk_profile)');
    if (!vkProfilePage) return;
    var vkScripts = document.body.querySelectorAll('script');
    if (!vkScripts) return;
    var vkProfileId = (vkScripts[vkScripts.length - 1].textContent.match(/("|')user_id("|'):( *)(|"|')(\d+)/i) || [])[5];
    if (!vkProfileId) return;
    vkProfilePage.className += ' display_additional_information_in_vk_profile';
    var vkPageLang = document.body.querySelector('a.ui_actions_menu_item[onclick*="lang_dialog"]');
    var vkCurrentLang;
    if (vkPageLang) {
      vkCurrentLang = vkPageLang.textContent;
    } else {
      vkCurrentLang = navigator.language.substring(0, 2);
    }
    var vkLang, vkMonthName;
    if (vkCurrentLang === 'Language: english' || vkCurrentLang === 'en') {
      vkLang = 'en';
      vkMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    } else if (vkCurrentLang === 'Язык: русский' || vkCurrentLang === 'ru') {
      vkLang = 'ru';
      vkMonthName = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    } else if (vkCurrentLang === 'Мова: українська' || vkCurrentLang === 'uk') {
      vkLang = 'uk';
      vkMonthName = ['сiчня', 'лютого', 'березня', 'квiтня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    }
    var i = 0;
    while (i < 4) {
      var vkProfilePageElement = document.createElement('div');
      vkProfilePageElement.style.display = 'none';
      vkProfilePage.insertBefore(vkProfilePageElement, vkProfilePage.firstChild);
      i++;
    }
    var vkProfileIdElement = document.createElement('div');
    vkProfileIdElement.className = 'clear_fix profile_info_row';
    if (vkLang === 'en') {
      vkProfileIdElement.innerHTML = '<div class="label fl_l">Profile ID:</div><div class="labeled">' + vkProfileId + '</div>';
    } else if (vkLang === 'ru') {
      vkProfileIdElement.innerHTML = '<div class="label fl_l">Номер страницы:</div><div class="labeled">' + vkProfileId + '</div>';
    } else if (vkLang === 'uk') {
      vkProfileIdElement.innerHTML = '<div class="label fl_l">Номер сторінки:</div><div class="labeled">' + vkProfileId + '</div>';
    } else {
      vkProfileIdElement.innerHTML = '<div class="label fl_l">Profile ID:</div><div class="labeled">' + vkProfileId + '</div>';
    }
    vkProfilePage.replaceChild(vkProfileIdElement, vkProfilePage.childNodes[0]);
    var requestVkFoaf = new XMLHttpRequest();
    requestVkFoaf.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var vkFoafRegDate = (this.responseText.match(/ya:created dc:date="(.+)"/i) || [])[1];
        var vkFoafLastProfileEditDate = (this.responseText.match(/ya:modified dc:date="(.+)"/i) || [])[1];
        var vkFoafLastSeenDate = (this.responseText.match(/ya:lastLoggedIn dc:date="(.+)"/i) || [])[1];
        if (vkFoafRegDate) {
          var vkRegDate = new Date(vkFoafRegDate);
          var vkRegDateElement = document.createElement('div');
          vkRegDateElement.className = 'clear_fix profile_info_row';
          if (vkLang === 'en') {
            vkRegDateElement.innerHTML = '<div class="label fl_l">Registration date:</div><div class="labeled">' + vkMonthName[vkRegDate.getMonth()] + ' ' + vkRegDate.getDate() + ', ' + vkRegDate.getFullYear() + ' at ' + convert24HoursTo12Hours(vkRegDate.getHours()) + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + ' ' + convert24HoursToAmPmLc(vkRegDate.getHours()) + '</div>';
          } else if (vkLang === 'ru') {
            vkRegDateElement.innerHTML = '<div class="label fl_l">Дата регистрации:</div><div class="labeled">' + vkRegDate.getDate() + ' ' + vkMonthName[vkRegDate.getMonth()] + ' ' + vkRegDate.getFullYear() + ' в ' + vkRegDate.getHours() + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + '</div>';
          } else if (vkLang === 'uk') {
            vkRegDateElement.innerHTML = '<div class="label fl_l">Дата реєстрації:</div><div class="labeled">' + vkRegDate.getDate() + ' ' + vkMonthName[vkRegDate.getMonth()] + ' ' + vkRegDate.getFullYear() + ' о ' + vkRegDate.getHours() + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + '</div>';
          } else {
            vkRegDateElement.innerHTML = '<div class="label fl_l">Registration date:</div><div class="labeled">' + addLeadingZeroToDate(vkRegDate.getDate()) + '.' + addLeadingZeroToDate(vkRegDate.getMonth() + 1) + '.' + vkRegDate.getFullYear() + ' ' + addLeadingZeroToDate(vkRegDate.getHours()) + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + '</div>';
          }
          vkProfilePage.replaceChild(vkRegDateElement, vkProfilePage.childNodes[1]);
        } else {
          console.info('Registration date on VK FOAF profile is empty or unavailable');
        }
        if (vkFoafLastProfileEditDate) {
          var vkLastProfileEditDate = new Date(vkFoafLastProfileEditDate);
          var vkLastProfileEditDateElement = document.createElement('div');
          vkLastProfileEditDateElement.className = 'clear_fix profile_info_row';
          if (vkLang === 'en') {
            vkLastProfileEditDateElement.innerHTML = '<div class="label fl_l">Last profile edit:</div><div class="labeled">' + vkMonthName[vkLastProfileEditDate.getMonth()] + ' ' + vkLastProfileEditDate.getDate() + ', ' + vkLastProfileEditDate.getFullYear() + ' at ' + convert24HoursTo12Hours(vkLastProfileEditDate.getHours()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + ' ' + convert24HoursToAmPmLc(vkLastProfileEditDate.getHours()) + '</div>';
          } else if (vkLang === 'ru') {
            vkLastProfileEditDateElement.innerHTML = '<div class="label fl_l">Посл. ред. страницы:</div><div class="labeled">' + vkLastProfileEditDate.getDate() + ' ' + vkMonthName[vkLastProfileEditDate.getMonth()] + ' ' + vkLastProfileEditDate.getFullYear() + ' в ' + vkLastProfileEditDate.getHours() + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + '</div>';
          } else if (vkLang === 'uk') {
            vkLastProfileEditDateElement.innerHTML = '<div class="label fl_l">Останнє ред. стор.:</div><div class="labeled">' + vkLastProfileEditDate.getDate() + ' ' + vkMonthName[vkLastProfileEditDate.getMonth()] + ' ' + vkLastProfileEditDate.getFullYear() + ' о ' + vkLastProfileEditDate.getHours() + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + '</div>';
          } else {
            vkLastProfileEditDateElement.innerHTML = '<div class="label fl_l">Last profile edit:</div><div class="labeled">' + addLeadingZeroToDate(vkLastProfileEditDate.getDate()) + '.' + addLeadingZeroToDate(vkLastProfileEditDate.getMonth() + 1) + '.' + vkLastProfileEditDate.getFullYear() + ' ' + addLeadingZeroToDate(vkLastProfileEditDate.getHours()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + '</div>';
          }
          vkProfilePage.replaceChild(vkLastProfileEditDateElement, vkProfilePage.childNodes[2]);
        } else {
          console.info('Last profile editing date on VK FOAF profile is empty or unavailable');
        }
        if (vkFoafLastSeenDate) {
          var vkLastSeenDate = new Date(vkFoafLastSeenDate);
          var vkLastSeenDateElement = document.createElement('div');
          vkLastSeenDateElement.className = 'clear_fix profile_info_row';
          if (vkLang === 'en') {
            vkLastSeenDateElement.innerHTML = '<div class="label fl_l">Last seen:</div><div class="labeled">' + vkMonthName[vkLastSeenDate.getMonth()] + ' ' + vkLastSeenDate.getDate() + ', ' + vkLastSeenDate.getFullYear() + ' at ' + convert24HoursTo12Hours(vkLastSeenDate.getHours()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + ' ' + convert24HoursToAmPmLc(vkLastSeenDate.getHours()) + '</div>';
          } else if (vkLang === 'ru') {
            vkLastSeenDateElement.innerHTML = '<div class="label fl_l">Последний заход:</div><div class="labeled">' + vkLastSeenDate.getDate() + ' ' + vkMonthName[vkLastSeenDate.getMonth()] + ' ' + vkLastSeenDate.getFullYear() + ' в ' + vkLastSeenDate.getHours() + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + '</div>';
          } else if (vkLang === 'uk') {
            vkLastSeenDateElement.innerHTML = '<div class="label fl_l">Останній візит:</div><div class="labeled">' + vkLastSeenDate.getDate() + ' ' + vkMonthName[vkLastSeenDate.getMonth()] + ' ' + vkLastSeenDate.getFullYear() + ' о ' + vkLastSeenDate.getHours() + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + '</div>';
          } else {
            vkLastSeenDateElement.innerHTML = '<div class="label fl_l">Last seen:</div><div class="labeled">' + addLeadingZeroToDate(vkLastSeenDate.getDate()) + '.' + addLeadingZeroToDate(vkLastSeenDate.getMonth() + 1) + '.' + vkLastSeenDate.getFullYear() + ' ' + addLeadingZeroToDate(vkLastSeenDate.getHours()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + '</div>';
          }
          vkProfilePage.replaceChild(vkLastSeenDateElement, vkProfilePage.childNodes[3]);
        } else {
          console.info('Last seen date on VK FOAF profile is empty or unavailable');
        }
      } else if (this.readyState === 4 && this.status !== 200) {
        console.error('Failed to get VK FOAF profile (registration date, last profile edit date and last seen date): ' + this.status + ' ' + this.statusText);
      }
    };
    requestVkFoaf.open('GET', '/foaf.php?id=' + vkProfileId, true);
    requestVkFoaf.send();
  }).observe(document.body, { childList: true, subtree: true });
})();
