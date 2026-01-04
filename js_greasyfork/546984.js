// ==UserScript==
// @name         71/Ulyanovsk||Руководство АП
// @namespace    https://forum.blackrussia.online
// @version      1.0.1
// @description  by D.Walter
// @author       Dimitry_Walter
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://sun36-1.userapi.com/s/v1/ig2/ABc_7mzhNjiaghbppbYEVJQjJBxscTOh6w6Ww5EWUWeLvq9fk6ccFZC_CPXy50VrZDpXknFsKtoYfH78gPTnKta7.jpg?quality=96&crop=0,0,200,200&as=32x32,48x48,72x72,108x108,160x160&ava=1&u=olvt8TqNDAXL6j4AowpsGaoo6-Nw8skWyxdJTjHW7JE&cs=80x80
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/546984/71Ulyanovsk%7C%7C%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20%D0%90%D0%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/546984/71Ulyanovsk%7C%7C%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20%D0%90%D0%9F.meta.js
// ==/UserScript==

(async function () {
  `use strict`;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes - Префикс "Отказано"
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted - Префикс "Одобрено"
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem - Префикс "Решено"
const PIN_PREFIX = 2; // Prefix that will be set when thread pins - "На рассмотрении"
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga Префикс "Главному Администратору"
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team Префикс "Команде Проекта"
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes. Префикс "Закрыто"
const VAJNO_PREFIX = 1; // Префикс "Важно"
const WATCHED_PREFIX = 9; //Префикс "Рассмотрено"
const TEX_PREFIX = 13; //Префикс "Тех Специалисту "
const SPECY_PREFIX = 11; //Префикс "Специальному Администратору"
const OJIDANIE_PREFIX = 14; //Префикс "Ожидание"
const REALIZOVANO_PREFIX = 5; //Префикс "Реализовано"
const PREFIKS = 0; // Нет префикса
const KACHESTVO = 15; //Префикс "Проверено контролем качества"
const OTKAZRP_PREFIX = 4; // Префикс "Отказано"
const ODOBRENORP_PREFIX = 8;  //Префикс "Одобрено"
const NARASSMOTRENIIRP_PREFIX = 2; //"На рассмотрении"
const NARASSMOTRENIIORG_PREFIX = 2;  //"На рассмотрении"
const data = await getThreadData(),
      greeting = data.greeting, // greeting уже строка!
      user = data.user;
const buttons = [
    {
      title: '| Заявки на Неактив -----------------------------------------------------------------------------------------------------------------------------|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
      },
    {
      title: ' Одобрено ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Уход в неактив| получила статус - [COLOR=#00FF00]Одобрено[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
      {
      title: ' ГС/ЗГС не предупреждены ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Уход в неактив| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]ГС/ЗГС не были предупреждены.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не является АП ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Уход в неактив| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Вы не являетесь Агентом Поддержки.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не по форме ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Уход в неактив| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Заявка заполнена не по Форме.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: '| Заявки на Обмен баллов ------------------------------------------------------------------------------------------------------------------|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
      },
    {
      title: ' Одобрено ',
         dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Обмен баллов| получила статус - [COLOR=#00FF00]Одобрено[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не хватает баллов ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Обмен баллов| получила статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]У вас не хватает баллов в |Таблице Успеваемости|.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Транзакция повторилась за неделю ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Обмен баллов| получила статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Вы совершали данный обмен менее недели назад.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не является АП ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Обмен баллов| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Вы не являетесь Агентом Поддержки.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не по форме ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Обмен баллов| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Заявка заполнена не по Форме.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },

    {
      title: '| ЖБ на АП ---------------------------------------------------------------------------------------------------------------------------------------------|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
      },
    {
      title: ' Одобрено ',
         dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок. [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша Жалоба на Агентов Поддержки получила статус - [COLOR=#00FF00]Одобрено[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]С агентом Поддержки будет проведена работа. <br>[COLOR=#F08080]Благодарю за обращение.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не по форме ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша Жалоба на Агента Поддержки получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Заявка заполнена не по Форме.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не является АП ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша Жалоба на Агента Поддержки получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Игрок не является Агентом Поддержки.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Док-ва не рабочие/редакт. ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша Жалоба на Агента Поддержки получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Ваши доказательства не работают/либо отредактированы.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Нет нарушений ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша Жалоба на Агента Поддержки получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Нарушений не найдено.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
     {
      title: '| Предложение по улучшению ----------------------------------------------------------------------------------------------------------|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
      },
    {
      title: ' На рассмотрении ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 115, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваше |Предложение по улучшению| получила статус - [COLOR=#FF0000]На рассмотрение[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Одобрено ',
         dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваше |Предложение по улучшению| получила статус - [COLOR=#FF0000]Одобрено[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Отказано ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваше |Предложение по улучшению| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: '| Заявки на снятие наказаний ---------------------------------------------------------------------------------------------------------|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
      },
    {
      title: ' Одобрено ',
         dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |снятие Выговора/Предупреждения| получила статус - [COLOR=#FF0000]Одобрено[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не прошло 24/48 ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |снятие Выговора/Предупреждения| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]С момента получени наказания не прошло 24/48 часов.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Мало баллов ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |снятие Выговора/Предупреждения| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]У вас не достаточно баллов.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Нет наказаний ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |снятие Выговора/Предупреждения| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]У вас отсутствует Предупреждение/Выговор.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не является АП ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Обмен баллов| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Вы не являетесь Агентом Поддержки.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не по форме ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Обмен баллов| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Заявка заполнена не по Форме.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },

     {
      title: '| Заявки на Пропуск собрания ---------------------------------------------------------------------------------------------------------|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
      },
    {
      title: ' Одобрено ',
         dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Пропуск собрания| получила статус - [COLOR=#FF0000]Одобрено[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Поздно ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Пропуск собрания| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Собрание уже Началось/Прошло.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не является АП ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый Игрок.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Пропуск собрания| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Вы не являетесь Агентом Поддержки.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },
    {
      title: ' Не по форме ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) Агент Поддержки[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша заявка на |Пропуск собрания| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Заявка заполнена не по Форме.[/COLOR]`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: PIN_PREFIX,
      status: true,
      pin: false,
    },

    {
      title: '| Заявки ----------------------------------------------------------------------------------------------------------------------------------------------|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
      },
    {
      title: ' На рассмотрении ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 3px solid; border-color: rgb(255, 115, 0, 1); font-family: UtromPressKachat',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}.[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Заявки взяты - [COLOR=#FF0000]На рассмотрение[/COLOR]. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#cc920c]ULYANOVSK[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      status: false,
      pin: true,
    },
    {
      title: ' Форма ответа ',
        dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
      content:
        `[B][CENTER][COLOR=#FFFF00]${greeting}.[/COLOR][/CENTER][/B]<br><br>`+
        `[CENTER]По итогу проверки заявок выношу следующий вердикт:<br><br>`+

        `Статус [COLOR=rgb(97, 189, 109)]одобрено[/COLOR] получают:<br>`+
        `[URL='https://postimages.org/'][IMG]https://i.postimg.cc/L8gZwc5F/1596361849446-1.png[/IMG][/URL]<br><br>`+

        `(Одобреные)<br><br>`+

        `[URL='https://postimages.org/'][IMG]https://i.postimg.cc/L8gZwc5F/1596361849446-1.png[/IMG][/URL]<br><br>`+

        `Статус [COLOR=rgb(184, 49, 47)]отказ[/COLOR] получили:<br>`+
        `[URL='https://postimages.org/'][IMG]https://i.postimg.cc/L8gZwc5F/1596361849446-1.png[/IMG][/URL]<br><br>`+

        `(Отказаные)<br><br>`+

        `[URL='https://postimages.org/'][IMG]https://i.postimg.cc/L8gZwc5F/1596361849446-1.png[/IMG][/URL]<br>`+
        `Одобренным отпишут с данной страницы ВК — -[URL='https://vk.com/id652235882'][COLOR=rgb(247, 218, 100)]Клик[/COLOR][/URL]-<br>`+
        `[/CENTER]`,
      status: false,
      pin: true,
    },










];

$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
           addButton('!!!Ответы СХ!!!', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Ответы:');
        buttons.forEach((btn, id) => {
            if(id >= 1) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
            } else {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
            }
        });
    });
});

function addButton(name, id) {
$('.button--icon--reply').before(
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
    (btn, i) =>
      `<button id="answers-${i}" class="button--primary button ` +
      `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if(send == true){
        editThreadData(buttons[id].prefix, buttons[id].status);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}

function getThreadData() {
const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
const authorName = $('a.username').html();
const hours = new Date().getHours();
return {
  user: {
    id: authorID,
    name: authorName,
    mention: `[USER=${authorID}]${authorName}[/USER]`,
  },
  greeting:
  4 < hours && hours <= 11
    ? 'Доброе утро'
    : 11 < hours && hours <= 15
    ? 'Добрый день'
    : 15 < hours && hours <= 21
    ? 'Добрый вечер'
    : 'Доброй ночи',
};
}

$(document).ready(() => {
        // Загрузка скрипта для работы шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);



        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 2) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {

        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join(``)}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    async function getThreadData() {
      const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
      const authorName = $('a.username').html();
      const hours = new Date().getHours();

      const greeting = 4 < hours && hours <= 11
          ? 'Доброе утро'
          : 11 < hours && hours <= 15
          ? 'Добрый день'
          : 15 < hours && hours <= 21
          ? 'Добрый вечер'
          : 'Доброй ночи';

      return {
          user: {
              id: authorID,
              name: authorName,
              mention: `[USER=${authorID}]${authorName}[/USER]`,
          },
          greeting: greeting // теперь это просто строка
      };
  }

    function editThreadData(prefix, pin = false, open = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true && open) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();

// Кнопки перехода

const bgButtons = document.querySelector(".pageContent");
  const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.style = "color: #E6E6FA; background-color: #000000; border-color: #E6E6FA; border-radius: 13px";
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
  window.location.href = href;
  });
  return button;
  };

  const Button50 = buttonConfig("71", 'https://forum.blackrussia.online/forums/Сервер-№71-ulyanovsk.3004/');
  const Button51 = buttonConfig("Тех. раздел 71", 'https://forum.blackrussia.online/forums/Технический-раздел-ulyanovsk.3003/');
  const Button52 = buttonConfig("Жб на техов 71", 'https://forum.blackrussia.online/forums/Сервер-№71-ulyanovsk.3002/');
  const Button53 = buttonConfig("Жб 71", 'https://forum.blackrussia.online/forums/Жалобы.3020/');
  const Button54 = buttonConfig("Заявки 71", 'https://forum.blackrussia.online/forums/Сервер-№71-ulyanovsk.3231/');
  const Button55 = buttonConfig("BIO 71", 'https://forum.blackrussia.online/forums/РП-биографии.3026/');
  const Button56 = buttonConfig("ADMINS 71", 'https://forum.blackrussia.online/forums/Админ-раздел.3005/');
  const Button57 = buttonConfig("Курилка", 'https://forum.blackrussia.online/forums/Курилка.15/');

  bgButtons.append(Button50);
  bgButtons.append(Button51);
  bgButtons.append(Button52);
  bgButtons.append(Button53);
  bgButtons.append(Button54);
  bgButtons.append(Button55);
  bgButtons.append(Button56);
  bgButtons.append(Button57);