// ==UserScript==
 // @name   KF_100
 // @name:ru script КФ Nerrison
 // @description  Suggestions for improving the script write here ---> https://vk.com/exweth
 // @description:ru Предложения по улучшению скрипта и информацию о багах писать сюда ---> https://vk.com/exweth
// @version 2
 // @namespace https://forum.blackrussia.online
 // @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
 // @grant        none
 // @license   MIT
 // @supportURL https://vk.com/exweth
 // @icon
// @downloadURL https://update.greasyfork.org/scripts/495347/KF_100.user.js
// @updateURL https://update.greasyfork.org/scripts/495347/KF_100.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const VAJNO_PREFIX = 1;
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const PREFIKS = 0;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
     {
 		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠОтказанные жалобы на игроков   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
         dpstyle: 'oswald: 3px;     color: #7B0905; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #610C17; width: 96%',
},
       {
       title: 'На рассмотрении',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
         "[CENTER][FONT=georgia][I][B]Ваша жалоба взята на рассмотрение, убедительная просьба не создавать идентичных жалоб и ожидать ответа в данной теме.[/FONT][/I][/B][/CENTER]<br><br> " +
         "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman] 🍃「На рассмотрении 🍃[/FONT][/SIZE][/COLOR][/B][/CENTER]",
       prefix: PIN_PREFIX,
       status: true,
     },
{
       title: 'Передано теху',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(255, 69, 0)]Техническому специалисту.[/color][/CENTER]<br>" +
         '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
       prefix: TEX_PREFIX,
       status: true,
     },
{
       title: 'Не по форме',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша жалоба составлена [COLOR=rgb(255, 0, 0)]не по форме[/color].[/CENTER]<br><br>" +
             "[CENTER][SPOILER=Форма подачи жалобы][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>" +
             "[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Nick_Name игрока:[/CENTER]<br><br>" +
             "[CENTER][COLOR=rgb(255, 0, 0)]3.[/color] Суть жалобы:[/CENTER]<br><br>" +
             "[CENTER][COLOR=rgb(255, 0, 0)]4.[/color] Доказательство:[/SPOILER][/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
         {
       title: 'Фотохостинги',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
{
       title: 'Нет доказательств',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Нет каких-либо доказательств на совершенное нарушение от данного игрока.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
      },
     {
       title: 'Недостаточно доказательств',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Доказательств, предоставленных Вами, недостаточно для выдачи наказания данному игроку.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
      },
        {
       title: 'Не работают док-ва',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Доказательства, предоставленные Вами, нерабочие.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'Нет /time',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][B][I][FONT=georgia]На Ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
{
       title: 'Нет нарушений',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][B][I][FONT=georgia]Нарушений со стороны игрока нет.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
    {
       title: 'Док-ва отредактированы',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][B][I][FONT=georgia]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
    {
       title: ' Нету условий сделки',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][B][I][FONT=georgia]Нарушений со стороны игрока нет.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'От 3 лица',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.[/CENTER]<br><br>"+
        '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
        {
       title: 'Нужен фрапс',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.[/CENTER]<br><br>"+
        '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
            {
       title: 'Cлот фамы',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Запрещено покупать дополнительный слот в семью в обмен на игровую валюту.[/CENTER]<br><br>"+
         '[CENTER] Закрыто.[/CENTER]<br><br>'+
        '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: CLOSE_PREFIX,
       status: false,
     },
                {
       title: 'Cлив фамы склада пт',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Нарушения со стороны игрока отсутствуют. Игрок заплатил опеределенную сумму за разрешение определенного количества патронов, которую вы выдали ему.[/CENTER]<br><br>"+
         '[CENTER] Закрыто.[/CENTER]<br><br>'+
        '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: CLOSE_PREFIX,
       status: false,
     },
                   {
       title: 'Cлив фамы киками',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Нет ни единого правила по которому игрок может быть наказан за исключение участников из семьи, даже в больших количествах.[/CENTER]<br><br>"+
         '[CENTER]Вы сами выдали ему должность заместителя, советуем внимательнее назначать на данную должность людей.[/CENTER]<br><br>'+
         '[CENTER] Закрыто.[/CENTER]<br><br>'+
        '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: CLOSE_PREFIX,
       status: false,
     },
            {
       title: 'Нету Тайм-кодов',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Если видео длится 3х и более минут, вам следует указать таймкоды, в противном случае жалоба будет отказана.[/CENTER]<br><br>"+
        '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
           {
       title: 'Прошло 72 часа',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]С момента совершения нарушения прошло 72 часа, не подлежит рассмотрению.[/CENTER]<br><br>"+
        '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
               {
       title: 'После срока возврата долга прошло 10 дней',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Жалоба на должника подается в течение 10 дней после истечения срока займа.[/CENTER]<br><br>"+
        '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
            {
       title: 'Условия о долге в соц. сетях',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Договоры вне игры не будут считаться доказательствами.[/CENTER]<br><br>"+
        '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
         {
       title: 'Ошиблись разделом',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]К сожалению, Вы ошиблись разделом. Данный раздел предназначен для написания жалоб на игроков.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
 {
 		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠОдобренные жалобы на игроков   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
         dpstyle: 'oswald: 3px;     color: #FFD700; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FFD700; width: 96%',
 	},
       {
       title: 'NRP поведение',
       content:
          '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Уход от RP',
       content:
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn [/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'NDrive',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Помеха RP',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=rgb(255, 0, 0)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'NRP обман',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)] | PermBan [/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
       {
       title: 'Аморал. действия',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
    {
       title: 'Т/С в лич. целях',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.11.[/color] Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'DB',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]'+
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'RK',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
          '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'TK',
       content:
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]'+
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 0, 0)]  | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'SK',
       content:
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 0, 0)] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
{
       title: 'PG',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'MG',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'DM',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'TDM',
       content:
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]'+
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=rgb(255, 0, 0)] | Warn / Ban 3 - 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
    {
       title: 'Читы',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'Сокрытие багов',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.23.[/color] Запрещено скрывать от администрации баги системы, а также распространять их игрокам [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'Сокрытие нарушителей',
       content:
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'Вред репутации проекта',
       content:
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.25.[/color] Запрещены попытки или действия, которые могут навредить репутации проекта [COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'Вред ресурсам проекта',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.26.[/color] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) [COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Реклама',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)] | Ban 7 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
  {
       title: 'Уход от наказания',
       content:
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
       "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.34.[/color] Запрещен уход от наказания [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/QUOTE][/CENTER]<br><br>" +
      '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Межнац. и религ. конфликт',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'OOC угрозы',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Распр. личной информ.',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]'+
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.38.[/color] Запрещено распространять личную информацию игроков и их родственников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Злоуп. наказаниями',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.39.[/color] Злоупотребление нарушениями правил сервера [COLOR=rgb(255, 0, 0)] | Ban 7 - 30 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Оск. проекта',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(255, 0, 0)] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
        {
       title: 'Продажа промокода',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=rgb(255, 0, 0)] | Mute 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'ЕПП',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]'+
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.46.[/color] Запрещено ездить по полям на любом транспорте [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'ЕПП фура и инко',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]'+
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
    {
       title: 'Арест на аукционе',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней + увольнение из организации[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
   {
       title: 'NRP аксессуар',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(255, 0, 0)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Оск. названия ценностей',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [COLOR=rgb(255, 0, 0)] | Ban 1 день / При повторном нарушении обнуление бизнеса[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Оск. администрации',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(255, 0, 0)] | Mute 180 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Багоюз анимации',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)] | Jail 60 / 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Невозврат долга',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=rgb(255, 0, 0)] | Ban 30 дней / Permban=[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Разговор на другом языке',
       content:
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
       "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [COLOR=rgb(255, 0, 0)] | Устное замечание / Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
{
       title: 'CapsLock',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Оскорбление в OOC',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Упоминание родных',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Флуд',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Злоуп. символами',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Аморальное оскорбление',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.07.[/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Слив чата',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Угрозы о наказании адм.',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=rgb(255, 0, 0)] | Mute 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Выдача себя за адм.',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 + ЧС администрации[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Введение в заблуждение',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Музыка в voice',
       content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.14.[/color] Запрещено включать музыку в Voice Chat [COLOR=rgb(255, 0, 0)] | Mute 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Оск. родных в voice',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Шумы в voice',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.16.[/color] Запрещено создавать посторонние шумы или звуки [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Реклама в voice',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.17.[/color] Запрещена реклама в Voice Chat не связанная с игровым процессом [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Политика, провокация',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 10 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Смена голоса в voice',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.19.[/color] Запрещено использование любого софта для изменения голоса [COLOR=rgb(255, 0, 0)] | Mute 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/nsbc80Vw][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Транслит',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.20.[/color] Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Реклама промо',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)] | Ban 30 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix:ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Объявления в ГОСС',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Мат в VIP чат',
       content:
       '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix:ACCEPT_PREFIX,
       status: false,
     },
        {
       title: 'Оскорбительный ник',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Фейк ник',
       content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
       prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
         title: '                                                                          Одобренные жалобы на игроков ГОСС                                               ',
         dpstyle: 'oswald: 3px;     color: #FFD700; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FFD700; width: 96%',
},
     {
         title: ' Работа ГОСС',
         content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=rgb(255, 0, 0)] | Jail 30 минут" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
         prefix: ACCEPT_PREFIX,
         status: false,
     },
          {
         title: 'Арест перед бв',
         content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.13.[/color] Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара. [COLOR=rgb(255, 0, 0)] | Jail 30 минут" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
         title: ' Т\С в личных целях',
         content:
        '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [COLOR=rgb(255, 0, 0)] | Jail 30 минут" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
     title: ' Один. патруль',
         content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=rgb(255, 0, 0)] | Jail 30 минут" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
          {
     title: 'Нарушение ПРО',
         content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=rgb(255, 0, 0)] | Mute 30 минут" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
          prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
     title: 'Нарушение ППЭ',
         content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [COLOR=rgb(255, 0, 0)] | Mute 30 минут" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
     title: '                                                                          Одобренные жалобы на игроков ОПГ                                              ',
         dpstyle: 'oswald: 3px;     color: #FFD700; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FFD700; width: 96%',
},
           {
     title: 'Провокация ГОСС',
         content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.[/color] Запрещено провоцировать сотрудников государственных организаций [COLOR=rgb(255, 0, 0)] | Jail 30 минут" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
               prefix: ACCEPT_PREFIX,
       status: false,
     },
                {
     title: 'Провокация ОПГ',
         content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.[/color] Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [COLOR=rgb(255, 0, 0)] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
          prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
     title: 'Нонрп вч',
         content:
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.[/color] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение  [COLOR=rgb(255, 0, 0)] | Jail 30 минут/ Warn" +
         '[url=https://postimg.cc/p9wrqN3w][img]https://i.postimg.cc/sXXWfsmg/1000004933.png[/img][/url]',
         prefix: ACCEPT_PREFIX,
       status: false,
     },
     {
         title: '                                                                          Перенаправление жалоб в другой раздел                                             ',
         dpstyle: 'oswald: 3px;     color: #FFD700; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FFD700; width: 96%',
},
         {
       title: 'Жалобу на сотрудника',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][B][I][FONT=georgia]Вы ошиблись разделом,обратитесь в раздел жалоб на сотрудников.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: CLOSE_PREFIX,
       status: false,
     },
             {
       title: 'В жалобы на АДМ',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][B][I][FONT=georgia]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: CLOSE_PREFIX,
       status: false,
     },
                 {
       title: 'В жалобы на лидеров',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][B][I][FONT=georgia]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: CLOSE_PREFIX,
       status: false,
     },
          {
       title: 'В жалобы на хелперов',
       content:
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][B][I][FONT=georgia]Вы ошиблись разделом, обратитесь в раздел жалоб на хелперов.[/CENTER]<br><br>" +
         '[url=https://postimg.cc/kVLv7ng1][img]https://i.postimg.cc/Tw37q1M6/1000004939.png[/img][/url]',
       prefix: CLOSE_PREFIX,
       status: false,
     },
     {
 		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠРП биографии   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
         dpstyle: 'oswald: 3px;     color: #FFD700; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FFD700; width: 96%',
},
      {
       title: 'Биография одобрена',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Lime] 🍃 Одобрено 🍃.[/I][/CENTER][/color][/FONT]",
       prefix: ACCEPT_PREFIX,
       status: false,
     },
    {
       title: 'Отказано',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red] Отказано. [/color]<br><br>" +
         " 🍃 Причиной отказа могло послужить какое-либо нарушение из правил написания RP биографии. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Скопированная биография',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано. [/color]<br>Биография скопирована у другого человека.[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Заголовок не по форме',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red] Отказано. [/color]<br>Причина: Заголовок вашей RolePlay Биографии составлен не по форме. Внимательно изучите правила составления РП биографий.[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Не по форме',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: Ваша RolePlay Биография составлена не по форме. Внимательно изучите правила составления РП биографий. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
  {
       title: 'Ник написан на английском',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: Никнейм в заголовке/теме написан на английском языке. Внимательно изучите правила составления РП биографий. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Ники в теме не совпадают',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: Никнеймы в заголовке и теме не совпадают, что является нелогичным. 🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Множество ошибок',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: В вашей РП биографии присутствует множество грамматических/пунктуационных ошибок. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: '3 лицо',
       content:         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: Ваша РП биография написана от 3-го лица. Внимательно изучите правила составления РП биографий. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Возраст - дата',
       content: '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: Возраст Вашего персонажа не соответствует дате рождения, что является нелогичным. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Нет места рождения',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: Отсутствие места рождения. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Нет даты рождения',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина: Отсутствие даты рождения. 🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Возраст - тема',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: Возраст Вашего персонажа не соответствует истории, что является нелогичным. 🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Не заполнены некоторые пункты',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина:  Не заполнены некоторые пункты. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'NonRP nick',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина: У вас NonRP NickName. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Биография уже есть',
       content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: У Вас уже есть существующая РП биография. 🍃[/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
  {
       title: 'Мало информации',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина: Слишком мало информации о вашем персонаже.🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'Недостаточно инфы во внешности',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина:  Недостаточно информации об описании внешности.🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
         {
       title: 'Недостаточно инфы о детстве',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина:  Недостаточно информации о детстве вашего персонажа.🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
             {
       title: 'Недостаточно инфы о юности',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина:  Недостаточно информации о юности вашего персонажа.🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
                {
       title: 'Недостаточно инфы о взрослении',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина:  Недостаточно информации о взрослении вашего персонажа.🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
                        {
       title: 'Недостаточно инфы о  зрелости',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина:  Недостаточно информации о зрелости вашего персонажа.🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
                            {
       title: 'Недостаточно инфы о  наших днях',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         "🍃 Причина:  Недостаточно информации в пункте наши дни.🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
      {
       title: 'Возраст менее 18',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
         " 🍃 Причина: Вашему персонажу менее 18-ти лет. 🍃 [/CENTER][/FONT]",
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
     {
       title: 'Ошиблись разделом',
       content:
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER]К сожалению, Вы ошиблись разделом. Данный раздел предназначен для написания RolePlay биографий.[/CENTER]<br><br>" +
         '[CENTER][B][COLOR=rgb(255, 0, 0)]🍃「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」🍃 [/COLOR][/B] [/CENTER]',
       prefix: UNACCEPT_PREFIX,
       status: false,
     },
];

 $(document).ready(() => {
     // Загрузка скрипта для обработки шаблонов
     $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

     // Добавление кнопок при загрузке страницы
     addButton('KF 100', 'selectAnswer');

     // Поиск информации о теме
     const threadData = getThreadData();

     $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
     $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
     $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
     $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

     $(`button#selectAnswer`).click(() => {
       XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
       buttons.forEach((btn, id) => {
         if (id > 0) {
           $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
         }
         else {
           $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
         }
       });
     });
   });

   function addButton(name, id) {
     $('.button--icon--reply').before(
       `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; border: 2px solid #FFD700;">${name}</button>`,
     );
   }

 	function buttonsMarkup(buttons) {
 	return `<div class="select_answer">${buttons
 	.map(
 	(btn, i) =>
 	`<button id="answers-${i}" class="button--primary button ` +
 	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
 	)
 	.join('')}</div>`;
 	}

   function pasteContent(id, data = {}, send = false) {
     const template = Handlebars.compile(buttons[id].content);
     if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

     $('span.fr-placeholder').empty();
     $('div.fr-element.fr-view p').append(template(data));
     $('a.overlay-titleCloser').trigger('click');

     if (send == true) {
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
       greeting: () =>
         4 < hours && hours <= 11 ?
         'Доброе утро' :
         11 < hours && hours <= 15 ?
         'Добрый день' :
         15 < hours && hours <= 21 ?
         'Добрый вечер' :
         'Доброй ночи',
     };
   }

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
                               sticky: 1,
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
