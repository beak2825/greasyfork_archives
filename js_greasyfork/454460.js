// ==UserScript==
// @name           Display addinformation in VKprofile (Alina)
// @name:ru        Отображение доп. информации на странице ВКонтакте (Алина)
// @name:uk        Відображення доп. інформації на сторінці VK (Алина)
// @namespace      https://greasyfork.org/ru/users/717310-alina-novikova
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEr0lEQVRYR8VXfVBUVRT/3WW3YEVFmgk0B0QNnYbMnf4wEywQNJvxaygdSm1ygsECx/zCGoc+bByjsDEInWroA1OLYQyZGBjpwwb8GsCEMmNa6AMYyHYGIb529+3r3Pf27bK7b3fZNzadP3bfve+c3/nde+459zwGLzFbLOfioqLSzAM9QuetjjCIjMVPS8T8GTPZ5+0jjq2np3ILnbedc+yACAEMNhqP0vMgPffTfxeNW2BHDY6wjom2TBnUdYjpqXMd9e9cPaJr7G5SxU+elYF8Uw4eek+P9j4/FAJNi0QFqKbf7XiLSQgSAe48OrKr/nDzfp1VsAZEDteHY7fpEHIqE7SRkNF/gwNLOQmJwLhdELJqs4I6V5hFEInylRWYWqjXsA1OExFfoohtYDzmleby9MYe9W3352FZbDpiDJuxrXK6NhI8HHYsZDZBEDaczfR3qAKCn1lbhfADOggObRyIwh52w/KHdc/3OwxaIIqSS7D19Gw0d2uxlmxOstrOBqHsWqmmHchdlI+zP6Th/SuaCVxmteYGR1lbqSsdQ4HKXZRHBFZoJ0D1gf10809HQWO+JgLFy0tQfH42vvoZ6Bn0pJ4QDcRFyXM2Abjwu+rSLGzcbhcza54IZeEu3ep1VdAxHXbWAEe9kuh8DrB8rqzKnS87pupihH16dVDotVboGnvPhURiVXwGtiU9C6MhwofA0jigaTtVOee+qhGUnImwMRSIwvBBu+6Z+i0Ys49NisQUgxEVj30MQ5icPBMdGGnq8gtAUqwM1T8E3Ps2MDSuCu3gBMT7SfmDjV0obn0Zo0FIcOcvLn4DS+5JcCEqBCLIedVmYPUC+ZVIlX/TSaCy3f+6JAL8NSdx4Xk7SluPo6nva1WLFLqMch/IRsoxA67tdKvsrQWu9wOHV8s4irz5HbC/LvCmuggoauVPDmKLKRLdQ734deAXaXph9ALMnDILH7WMIbvKCD1VDdshNzBfghJvPuug8WsNwOvq6/Bg5EOAvw0jB7uSgaLH3boX6SSnHAcEAvcm4L3G6utA1ilqCHhXEERUCXAbHZ3gdtrm+2LcCGUXgbxqmeDEHVDz0XETyDwB/EihCSR+CXCj1HlAw3MyGUXqKCqFlLFX8txzn7QA3beAp03AnBnu+YFRIONDoLnHPwUpDfmC/akcSAMOrgy8CiULDGHAqyuAl1LdZ6KP0tB0FOj7RxWD0nCfaKW+KOBt+AqBFqZ77sREOO9CU/CInBGKfNEmp6OPOAvRML0wBjssGfOBd9dSRtztq6lW6b7JlkPIhWfJYtqFNt8+coSH4G/SuSsYAf6en4VViXS4koCH44F5dOHcQV2ZGoFH6R74lu4DRUrorthBd4aXWHgIOikE7rI2GSZOHX42I+8ErHbqK/lJ8pKocPeEjbqmYe9+l1/HtAOXSG1JCH5vp+olTuAzQnzqdqJOGkvEKR6C3RQCuq/+B+FNKXaJidDjBpHQ1BVppq205RLAPvEMuV+vGUyLofJhItnuFWOpFlKlxxwtWBpsPD/NXCQYeOe27j8Lh7+PU48VyGdiDc09KNUHETH0P43GEfRsoGeq+CF9nv9F+maybVX7PP8XnlyqoWQc/vYAAAAASUVORK5CYII=
// @version        10.03.2023
// @description:en    Display profile ID, registration date, last profile edit and last seen in VK user profile
// @description Отображение номера страницы (ID), даты регистрации, последнего редактирования страницы и последний заход на странице пользователя ВКонтакте
// @description:ru Отображение номера страницы (ID), даты регистрации, последнего редактирования страницы и последний заход на странице пользователя ВКонтакте
// @description:uk Відображення номера сторінки (ID), дати реєстрації, останнього редагування сторінки і останній візит на сторінці користувача VK
// @author         Inlifeuser, Alina
// @license        MIT
// @include        *://vk.com/*
// @exclude        *://vk.com/notifier.php*
// @exclude        *://vk.com/*widget*.php*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/454460/Display%20addinformation%20in%20VKprofile%20%28Alina%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454460/Display%20addinformation%20in%20VKprofile%20%28Alina%29.meta.js
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

    //boxQueue.hideAll();

    var vkProfilePage = document.body.querySelector('.OwnerPageName:not(.display_additional_information_in_vk_profile)');
    if (!vkProfilePage) return;
    //console.info('vkProfilePage: ', vkProfilePage);
    //var vkScripts = document.body.querySelectorAll('.ScrollStickyWrapper');
    //console.info('vkProfilePage vkScripts', vkScripts[vkScripts.length - 1].textContent);

    var PageSource = new XMLHttpRequest();

    PageSource.open('GET', window.location.href, false);
    PageSource.send();

    if (PageSource.status === 200) {
        //console.log(PageSource.responseText);
        var vkProfileId = (PageSource.responseText.match(/"ownerId":(\d+),"/i) || [])[1];
        console.info('vkProfileId: ', vkProfileId);
    }
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
      vkProfilePage.insertBefore(vkProfilePageElement, vkProfilePage.firstChild );
      i++;
    }
    var vkProfileIdElement = document.createElement('div');
    vkProfileIdElement.className = 'clear_fix profile_info_row';
    if (vkLang === 'en') {
      vkProfileIdElement.innerHTML = '<div class="ProfileModalInfoRow__label">Profile ID:</div><div class="ProfileModalInfoRow__in">' + vkProfileId + '</div>';
    } else if (vkLang === 'ru') {
      vkProfileIdElement.innerHTML = '<div class="ProfileModalInfoRow__label">Номер страницы:</div><div class="ProfileModalInfoRow__in">' + vkProfileId + '</div>';
    } else if (vkLang === 'uk') {
      vkProfileIdElement.innerHTML = '<div class="ProfileModalInfoRow__label">Номер сторінки:</div><div class="ProfileModalInfoRow__in">' + vkProfileId + '</div>';
    } else {
      vkProfileIdElement.innerHTML = '<div class="ProfileModalInfoRow__label">Profile ID:</div><div class="ProfileModalInfoRow__in">' + vkProfileId + '</div>';
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
            vkRegDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Registration date:</div><div class="ProfileModalInfoRow__in">' + vkMonthName[vkRegDate.getMonth()] + ' ' + vkRegDate.getDate() + ', ' + vkRegDate.getFullYear() + ' at ' + convert24HoursTo12Hours(vkRegDate.getHours()) + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + ' ' + convert24HoursToAmPmLc(vkRegDate.getHours()) + '</div>';
          } else if (vkLang === 'ru') {
            vkRegDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Дата регистрации:</div><div class="ProfileModalInfoRow__in">' + vkRegDate.getDate() + ' ' + vkMonthName[vkRegDate.getMonth()] + ' ' + vkRegDate.getFullYear() + ' в ' + vkRegDate.getHours() + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + '</div>';
          } else if (vkLang === 'uk') {
            vkRegDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Дата реєстрації:</div><div class="ProfileModalInfoRow__in">' + vkRegDate.getDate() + ' ' + vkMonthName[vkRegDate.getMonth()] + ' ' + vkRegDate.getFullYear() + ' о ' + vkRegDate.getHours() + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + '</div>';
          } else {
            vkRegDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Registration date:</div><div class="ProfileModalInfoRow__in">' + addLeadingZeroToDate(vkRegDate.getDate()) + '.' + addLeadingZeroToDate(vkRegDate.getMonth() + 1) + '.' + vkRegDate.getFullYear() + ' ' + addLeadingZeroToDate(vkRegDate.getHours()) + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + '</div>';
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
            vkLastProfileEditDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Last profile edit:</div><div class="ProfileModalInfoRow__in">' + vkMonthName[vkLastProfileEditDate.getMonth()] + ' ' + vkLastProfileEditDate.getDate() + ', ' + vkLastProfileEditDate.getFullYear() + ' at ' + convert24HoursTo12Hours(vkLastProfileEditDate.getHours()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + ' ' + convert24HoursToAmPmLc(vkLastProfileEditDate.getHours()) + '</div>';
          } else if (vkLang === 'ru') {
            vkLastProfileEditDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Посл. ред. страницы:</div><div class="ProfileModalInfoRow__in">' + vkLastProfileEditDate.getDate() + ' ' + vkMonthName[vkLastProfileEditDate.getMonth()] + ' ' + vkLastProfileEditDate.getFullYear() + ' в ' + vkLastProfileEditDate.getHours() + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + '</div>';
          } else if (vkLang === 'uk') {
            vkLastProfileEditDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Останнє ред. стор.:</div><div class="ProfileModalInfoRow__in">' + vkLastProfileEditDate.getDate() + ' ' + vkMonthName[vkLastProfileEditDate.getMonth()] + ' ' + vkLastProfileEditDate.getFullYear() + ' о ' + vkLastProfileEditDate.getHours() + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + '</div>';
          } else {
            vkLastProfileEditDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Last profile edit:</div><div class="ProfileModalInfoRow__in">' + addLeadingZeroToDate(vkLastProfileEditDate.getDate()) + '.' + addLeadingZeroToDate(vkLastProfileEditDate.getMonth() + 1) + '.' + vkLastProfileEditDate.getFullYear() + ' ' + addLeadingZeroToDate(vkLastProfileEditDate.getHours()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + '</div>';
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
            vkLastSeenDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Last seen:</div><div class="ProfileModalInfoRow__in">' + vkMonthName[vkLastSeenDate.getMonth()] + ' ' + vkLastSeenDate.getDate() + ', ' + vkLastSeenDate.getFullYear() + ' at ' + convert24HoursTo12Hours(vkLastSeenDate.getHours()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + ' ' + convert24HoursToAmPmLc(vkLastSeenDate.getHours()) + '</div>';
          } else if (vkLang === 'ru') {
            vkLastSeenDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Последний заход:</div><div class="ProfileModalInfoRow__in">' + vkLastSeenDate.getDate() + ' ' + vkMonthName[vkLastSeenDate.getMonth()] + ' ' + vkLastSeenDate.getFullYear() + ' в ' + vkLastSeenDate.getHours() + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + '</div>';
          } else if (vkLang === 'uk') {
            vkLastSeenDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Останній візит:</div><div class="ProfileModalInfoRow__in">' + vkLastSeenDate.getDate() + ' ' + vkMonthName[vkLastSeenDate.getMonth()] + ' ' + vkLastSeenDate.getFullYear() + ' о ' + vkLastSeenDate.getHours() + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + '</div>';
          } else {
            vkLastSeenDateElement.innerHTML = '<div class="ProfileModalInfoRow__label">Last seen:</div><div class="ProfileModalInfoRow__in">' + addLeadingZeroToDate(vkLastSeenDate.getDate()) + '.' + addLeadingZeroToDate(vkLastSeenDate.getMonth() + 1) + '.' + vkLastSeenDate.getFullYear() + ' ' + addLeadingZeroToDate(vkLastSeenDate.getHours()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + '</div>';
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