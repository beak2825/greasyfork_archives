// ==UserScript==
// @name        Script for admin's Black Moscow by Keksik_Dyson
// @namespace   Violentmonkey Scripts
// @match       https://forumblackmoscow.ru/index.php
// @license     https://forumblackmoscow.ru/index.php
// @grant       none
// @version     development
// @author      Keksik_Dyson
// @description 02.11.2024, 20:58:20
// @downloadURL https://update.greasyfork.org/scripts/515680/Script%20for%20admin%27s%20Black%20Moscow%20by%20Keksik_Dyson.user.js
// @updateURL https://update.greasyfork.org/scripts/515680/Script%20for%20admin%27s%20Black%20Moscow%20by%20Keksik_Dyson.meta.js
// ==/UserScript==
(function () {
  'use strict';
'esversion 6' ;
const UNACCEPT_PREFIX = 8; // Отказано
const ACCEPT_PREFIX = 1; // Одобрено
const EXPECT_PREFIX = 7; // На рассмотрении
const CLOSE_PREFIX = 4; // Закрыто
const GA_PREFIX = 11; // Главному администратору
const KP_PREFIX = 10; // Команде проекта
const buttons = [
  {
    title: '___________________________________Ответы на жалобы___________________________________',
  },
  {
    title: 'Другой язык при общении',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Официальный язык в BLACK MOSCOW - русский, за разговором на иностранном языке выдаётся наказание [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'MG - Meta Gaming',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено переносить информацию с реальной жизни в RP чат (MG) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'CapsLock',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.03.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено писать слова с верхним регистром (CapsLock) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'nRP поведение',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено несоблюдение норм RolePlay процесса (nRP поведение) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'DM - Death Match',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено убийство игрока или нанесение урона без причины (DM) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'TK - Team Kill',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.06.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено убийство или нанесение урона союзнику (TK) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'RK - c целью мести',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.07.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено убийство с целью мести (RK) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'RK - убийство одного и того же игрока',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.08.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено намеренное убийство одного и того же игрока (RK) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'mass DM',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.09.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено массовое убийство игроков без причины (mass DM) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Warn / Ban 3 дня [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'Drive by',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено убийство или намеренное нанесение урона машиной (DB) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'Бред в /me, /do, /try',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.11.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещен бред в /me, /do, /try [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'Оскорбления в нон рп чат',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.12.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено оскорбление игроков в OOC чат [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'DM в зеленой зоне',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.13.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено убийство или нанесение игроку (DM), находящегося в зелёной зоне (ZZ) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 120 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'Оск админов',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.14.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено оскорблять администрацию сервера [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 60 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'AFK без esc',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.15.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено стоять в AFK без использования паузы (Esc) [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Устное предупреждение / Kick (после минуты) [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'Политика/религия/национальность/расса и т.д.',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.16.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено обсуждать политику/религию/национальность/рассу и т.п. в любых чатах [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 3 дня [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
  {
    title: 'Неуважение к админам',
        content:
          '[COLOR=rgb(255,202,128)][B][FONT=times new roman][SIZE=4][I] {{ greeting }}, уважаемый {{ user.mention }}.[/I][/B][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][B][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Нарушитель будет наказан по следующему пункту Общих правил:[/SIZE][/FONT][/B][/I]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]2.17.[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] Запрещено неуважение в сторону администрации сервера [/SIZE][/FONT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 60 минут [/SIZE][/FONT][/COLOR]<br><br>" +
          "[COLOR=rgb(225, 0, 0)][B][FONT=times new roman][SIZE=4]•Пример:[/SIZE][/FONT][/COLOR][COLOR=rgb(255,255,255)][FONT=book antiqua][SIZE=4] ало поставьте меня на адм быстро , ПОМОГИТЕ БЛ , Все капец тебе нафиг и т.п. [/SIZE][/FONT][/COLOR]<br><br>" +
          "[B][I][COLOR=rgb(255,255,255)][FONT=times new roman][SIZE=4] Приятной игры на BLACK MOSCOW [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]| RED[/SIZE][/FONT][/COLOR][COLOR=rgb(209,213,216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][B][I]Одобрено.[/I][/B][/SIZE][/FONT][/COLOR]',
        prefix: 1,
        status: false,
 },
];


// Кнопки скрипта и многое другое
    $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Отказано', 'unaccept');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(EXPECT_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(KP_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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