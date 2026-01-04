// ==UserScript==
// @name    Ответы для СС | A.Russo
// @namespace https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9643-vladikavkaz.1927/
// @version 3.5
// @description  Скрипт для рассмотрения тем старшему составу на Black Russia.
// @author       Alexey_Russo
// @match       https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9643-vladikavkaz.1927/
// @include https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9643-vladikavkaz.1927/
// @grant        none
// @license    MIT
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/502374/%D0%9E%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%A1%D0%A1%20%7C%20ARusso.user.js
// @updateURL https://update.greasyfork.org/scripts/502374/%D0%9E%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%A1%D0%A1%20%7C%20ARusso.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const CLOSE_PREFIX = 7;
const ERWART_PREFIX = 14;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons =' '[
    {
        title: '__________________________________________________Передачи_________________________________________________',
    },
 
    {
      title: 'Следяйщему',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(25, 25, 112)]Следящему за ФСИН[/COLOR] @Alexey_Russo.[/CENTER]<br><br>" +
        
        '[Color=Flame][CENTER]Ожидайте окончательного вердикта...[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
        {
      title: 'Лидеру',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба передана [COLOR=rgb(139, 0, 0)]Полковнику ФСИН[/COLOR] @Lisa_Russo.[/CENTER]<br><br>" +
        
        '[Color=Flame][CENTER]Ожидайте окончательного вердикта...[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
    {
       title: 'На рассмотрении',
       content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br><br>' +
        "[CENTER]Ваша жалоба взята на [COLOR=rgb(255, 102, 0)]рассмотрение.[/CENTER]<br>" +
        
        '[Color=Flame][CENTER][COLOR=rgb(255, 255, 255)]Ожидайте окончательного вердикта...[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
        {
       title: 'На рассмотрении',
       content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER] На рассмотрении.[/CENTER]<br><br>" +
        '[Color=Flame][CENTER][COLOR=rgb(255, 255, 255)]Ожидайте окончательного вердикта...[/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
    {
        title: '__________________________________________________Одобрения______________________________________________',
    },
            {
      title: 'Сотрудник получит наказание',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Сотрудник Получит Наказание![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Заявка одобрена',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER] Ваша Заявка Была Рассмотрена, с уважением Подполковник ФСИН![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Зам получит наказание',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Заместитель Получит наказание![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Беседа с замом',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С заместителем будет проведена беседа![/CENTER]<br><br>" +
 
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]Одобрено.[/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
        title: '__________________________________________________Отказы__________________________________________________',
    },
        {
      title: 'Нарушений нет',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны сотрудника - нет.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Недостаточно доказательств',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушения со стороны Сотрудника организации.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
          title: 'Ответ дан ранее',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ответ на вашу жалобу был дан в предыдущей теме.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    
        {
      title: 'Нет /time',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На Ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Докв нет',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства в жалобе отсутсвуют. Прикрепите опровержение на нарушения сотрудника, используя фото и видео хостинги.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE] [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
          {
      title: 'Более 3 дней',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Срок подачи жалобы истек.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Доква отредактированы',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]<br><br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]<br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Неадекват',
      content:
        '[Color=rgb(128, 128, 0)][FONT=Georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][FONT=georgia]Жалоба в таком формате рассматриваться не будет.[/CENTER]<br><br>" +
        "[CENTER][B][FONT=georgia]Пересоздайте жалобу без оскорблений и завуалированных предлогов, несущих оскорбительный характер.[/CENTER]<br></br>" +
 
        '[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано.[/FONT][/COLOR][/SIZE][/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
        }
 ]
     
 
    function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    if(pin == false){
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    }
 if(pin == false){
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
           }
function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;
fetch(`${document.URL}move`, {
  method: 'POST',
  body: getFormData({
    prefix_id: prefix,
    title: threadTitle,
    target_node_id: type,
    redirect_type: 'none',
    notify_watchers: 1,
    starter_alert: 1,
    starter_alert_reason: "",
    _xfToken: XF.config.csrf,
    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
    _xfWithData: 1,
    _xfResponseType: 'json',
  }),
}).then(() => location.reload());
}
function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
  }
    }
})();