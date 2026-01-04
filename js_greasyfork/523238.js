// ==UserScript==
 // @name   KF_Refrenovs
 // @name:ru script Refrenov
 // @description  Suggestions for improving the script write here ---> https://vk.com/personasl
 // @description:ru Предложения по улучшению скрипта и информацию о багах писать сюда ---> https://vk.com/personasl
// @version 2
 // @namespace https://forum.blackrussia.online
 // @match        https://forum.blackrussia.online/threads/*
 // @include      https://forum.blackrussia.online/threads/
 // @grant        none
 // @license   MIT
 // @supportURL https://vk.com/personasl | Kirill_Refrenov | Lipetsk
 // @icon
// @downloadURL https://update.greasyfork.org/scripts/523238/KF_Refrenovs.user.js
// @updateURL https://update.greasyfork.org/scripts/523238/KF_Refrenovs.meta.js
// ==/UserScript==
 (function () {
   'use strict';
     const OJIDANIE_PREFIX = 14;
const buttons = [

 {
 		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠЖалобы на игроков   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
         dpstyle: 'oswald: 3px;     color: #FFD700; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FFD700; width: 96%',
 	},
       {
       title: 'NRP поведение',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
           "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
       prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Уход от RP',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn [/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,
     },
     {
       title: 'NDrive',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Помеха RP',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=rgb(255, 0, 0)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'NRP обман',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)] | PermBan [/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
       {
       title: 'Аморал. действия',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
           "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'DB',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'RK',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'TK',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 0, 0)]  | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'SK',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 0, 0)] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
{
       title: 'PG',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
    "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'MG',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'DM',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: true,

     },
      {
       title: 'TDM',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=rgb(255, 0, 0)] | Warn / Ban 3 - 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
    {
       title: 'Читы',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
        "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'Сокрытие багов',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.23.[/color] Запрещено скрывать от администрации баги системы, а также распространять их игрокам [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'Сокрытие нарушителей',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'Вред репутации проекта',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.25.[/color] Запрещены попытки или действия, которые могут навредить репутации проекта [COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
      {
       title: 'Вред ресурсам проекта',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.26.[/color] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) [COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
          "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Реклама',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)] | Ban 7 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
  {
       title: 'Уход от наказания',
       content:
       '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.34.[/color] Запрещен уход от наказания [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
      "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Межнац. и религ. конфликт',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'OOC угрозы',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Распр. личной информ.',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.38.[/color] Запрещено распространять личную информацию игроков и их родственников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Злоуп. наказаниями',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.39.[/color] Злоупотребление нарушениями правил сервера [COLOR=rgb(255, 0, 0)] | Ban 7 - 30 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Оск. проекта',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(255, 0, 0)] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
        {
       title: 'Продажа промокода',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=rgb(255, 0, 0)] | Mute 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
            "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'ЕПП',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.46.[/color] Запрещено ездить по полям на любом транспорте [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
        "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",

prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'ЕПП фура и инко',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
    {
       title: 'Арест на аукционе',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней + увольнение из организации[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
        "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
   {
       title: 'NRP аксессуар',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(255, 0, 0)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
       "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",

prefix: OJIDANIE_PREFIX,
	  status: false,
     },
     {
       title: 'Оск. названия ценностей',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [COLOR=rgb(255, 0, 0)] | Ban 1 день / При повторном нарушении обнуление бизнеса[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Оск. администрации',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(255, 0, 0)] | Mute 180 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Багоюз анимации',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)] | Jail 60 / 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Невозврат долга',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=rgb(255, 0, 0)] | Ban 30 дней / Permban=[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Разговор на другом языке',
       content:
       '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [COLOR=rgb(255, 0, 0)] | Устное замечание / Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
{
       title: 'CapsLock',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
    "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Оскорбление в OOC',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Упоминание родных',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Флуд',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Злоуп. символами',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'аморальное оскорбление',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.07.[/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Слив CMИ',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Угрозы о наказании адм.',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=rgb(255, 0, 0)] | Mute 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Выдача себя за адм.',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 + ЧС администрации[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Введение в заблуждение',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Музыка в voice',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.14.[/color] Запрещено включать музыку в Voice Chat [COLOR=rgb(255, 0, 0)] | Mute 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Оск. родных в voice',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Шумы в voice',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.16.[/color] Запрещено создавать посторонние шумы или звуки [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Реклама в voice',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.17.[/color] Запрещена реклама в Voice Chat не связанная с игровым процессом [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Политика, провокация',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 10 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Смена голоса в voice',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.19.[/color] Запрещено использование любого софта для изменения голоса [COLOR=rgb(255, 0, 0)] | Mute 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Транслит',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.20.[/color] Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Реклама промо',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)] | Ban 30 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Объявления в ГОСС',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Мат в VIP чат',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
        {
       title: 'Оскорбительный ник',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
            "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
     {
       title: 'Фейк ник',
       content:
         '[url=https://postimg.cc/Bt8CmbQc][img]https://i.postimg.cc/pVC1X5w7/Picsart-24-10-05-23-38-22-745.png[/img][/url]' +
         "[CENTER]Вы были наказаны по следующему пункту правил[/CENTER]<br><br>" +
         "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER] Передано руководству [/CENTER]<br><br>" +
         "[url=https://postimg.cc/kBfp9LMC][img]https://i.postimg.cc/vZsF7dp4/Picsart-24-10-09-22-11-31-308.png[/img][/url]",
prefix: OJIDANIE_PREFIX,
	  status: false,

     },
];
 	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы


   addButton('Скрипт', 'selectAnswer');


	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(GA_PREFIX, true));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, true));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));


	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
	buttons.forEach((btn, id) => {
	if (id > 0) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
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

	function editThreadData(prefix, pin = true) {
	// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	if (pin == false) {
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
	}
	if (pin == true) {
	fetch(`${document.URL}edit`, {
	method: 'POST',
	body: getFormData({
	prefix_id: prefix,
	title: threadTitle,
	sticky: 1,
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
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