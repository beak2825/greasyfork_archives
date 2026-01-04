// ==UserScript==
// @name         Скрипт для жалоб/обж
// @version      1.6
// @description  Для Кураторов/Обж
// @author       Ruslan_Aodzaki
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1281296
// @downloadURL https://update.greasyfork.org/scripts/491201/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D0%BE%D0%B1%D0%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/491201/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D0%BE%D0%B1%D0%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
    {
          title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Обжалование ----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
        },
    {
          title: '| Приветствие |',
          content:
                "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender] [/CENTER][/COLOR][/B]",
        },
        {
          title: '| На рассмотрение |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Ваше обжалование взято на рассмотрение, пожалуйста не создавайте дубликаты данной темы до полного рассмотрения обжалования.<br><br>"+
                '[B][I][COLOR=rgb(250, 197, 28)]На рассмотрении...[/I][/COLOR][/B]',
          prefix: PIN_PREFIX,
          status: true,
        },
    {
        title: '| Не обжалуется |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]В обжалование Вашего наказания - [COLOR=RED]Отказано[/COLOR].<br>"+
                "[B][I]Наказание данного типа не подлежит обжалованию.[/I][/B]<br><br>"+
        '[B][I]Закрыто[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
    {
        title: '| Обманы |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Для обжалования данного типа наказания Вам необходимо зафиксировать на запись экрана, как Вы договариваетесь с игроком о возврате имущества и прикрепить доказательства к вашему обжалованию.<br><br>"+
                '[B][I]Закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
    {
          title: '| Не по форме |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалования наказаний: [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']Кликабельно[/URL]<br><br>"+
                '[B][I]Отказано[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
        title: '| Адм не готова |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I]<br><br>"+
                "[B][I]В обжалование Вашего наказания - [COLOR=RED]Отказано.[/COLOR]<br>"+
                "[B][I]Администрация сервера не готова пойти к Вам навстречу[/I][/B]<br><br>"+
                '[B][I]Закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: '| Одобрено |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]В обжалование Вашего наказания - [COLOR=rgb(65, 168, 95)]Одобрено.[/COLOR] .<br>"+
        "[B][I]Аккаунт будет разблокирован. Советую прочитать регламент проекта, дабы не нарушать впредь - [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']Кликабельно[/URL]<br><br>"+
                '[B][I]Закрыто.[/I][/B]',
          prefix: RESHENO_PREFIX,
          status: false,
        },
        {
          title: '| Обманы(1 день) |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Ваш аккаунт будет разблокирован на 1 день для возврата имущества. После возврата имущества прикрепите видеодоказательства с /time в данную тему.<br><br>"+
                '[B][I]На рассмотрении...[/I][/B]',
          prefix: PIN_PREFIX,
          status: true,
        },
        {
        title: '| Ники/Фейки |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I]<br><br>"+
                "[B][I]Ваш аккаунт будет разблокирован на 1 день для смены NickName. После смены NickName прикрепите скриншот статистики с /time в данную тему.<br><br>"+
                '[B][I]На рассмотрении...[/I][/B]',
          prefix: PIN_PREFIX,
          status: true,
        },
        {
          title: '| Ссылка Vk |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Прикрепите ссылку на Ваш VK.<br><br>"+
                '[B][I]Закрыто.[/I][/B]',
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title: '| ППВ |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Для разблокировки необходимо предоставить информацию об аккаунте:<br><br>"+
                "[B][I]Ссылка на Ваш Telegram аккаунт, привязанный к игровому аккаунту;<br><br>"+
                "[B][I]Ссылка на Ваш VK аккаунт, привязанный к игровому аккаунту;<br><br>"+
                "[B][I]Email, привязанный к игровому аккаунту;<br><br>"+
                '[B][I]На рассмотрение.[/I][/B]',
          prefix: PIN_PREFIX,
          status: true,
        },
    {
          title: '| Передано CА |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Передаю Ваше обжалование Специальной Администрации.Просьба не создавать дубликаты данной темы.<br><br>"+
                '[B][I]Ожидайте ответа.[/I][/B]',
          prefix: SPECIAL_PREFIX,
          status: true,
        },
        {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Без опр. пунтка (ЖАЛОБЫ НА АДМ)╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
        },
    {
          title: '| Беседа с адм |',
          content:
                "[B][I][COLOR=rgb(255, 255, 255)]{{ greeting }} {{ user.name }} [/COLOR][/I][/B]<br><br>"+
                "[B][I][COLOR=rgb(255, 255, 255)] С Администратором будет проведена необходимая работа. Наказание будет снято.[/COLOR][/I][/B]<br><br>"+
        '[B][I][COLOR=rgb(255, 255, 255)] Одобрено.[/COLOR][/I][/B]',
      prefix: ACCEPT_PREFIX,
      status: false,
            },
    {
          title: '| Не по форме |',
          content:
                "[B][I][COLOR=rgb(255, 255, 255)]{{ greeting }} {{ user.name }} [/COLOR][/I][/B]<br><br>"+
                "[B][I][COLOR=rgb(255, 255, 255)]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349//'][COLOR=rgb(255, 255, 255)]Кликабельно[/URL]<br><br>"+
                '[B][I]Отказано, закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
  {
          title: '| На рассмотрение |',
          content:
                "[B][I][COLOR=rgb(255, 255, 255)]{{ greeting }} {{ user.name }} [/COLOR][/I][/B]<br><br>"+
                "[B][I][COLOR=rgb(255, 255, 255)]Ваша жалоба взята на рассмотрение. Просьба не создавать дубликаты данной темы.<br><br>"+
                '[B][I][COLOR=rgb(250, 197, 28)]На рассмотрении...[/COLOR][/I][/B]',
          prefix: PIN_PREFIX,
          status: true,
        },
    {
          title: '| Передано ГА |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Передаю Вашу жалобу Главному Администратору.Просьба не создавать дубликаты данной темы.<br><br>"+
                '[B][I]Ожидайте ответа.[/I][/B]',
          prefix: GA_PREFIX,
          status: true,
        },
     {
          title: '| Передано CА |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Передаю Вашу жалобу Специальной Администрации.Просьба не создавать дубликаты данной темы.<br><br>"+
                '[B][I]Ожидайте ответа.[/I][/B]',
          prefix: SPECIAL_PREFIX,
          status: true,
        },
    {
          title: '| Передано ЗГА |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Передаю Вашу жалобу Заместителю Главного Администратора.Просьба не создавать дубликаты данной темы.<br><br>"+
                '[B][I]Ожидайте ответа.[/I][/B]',
          prefix: PIN_PREFIX,
          status: true,
        },
    {
          title: '| Нет нарушений |',
          content:
                "[B][I][COLOR=rgb(255, 255, 255)]{{ greeting }} {{ user.name }} [/COLOR][/I][/B]<br><br>"+
                "[B][I][COLOR=rgb(255, 255, 255)]Нарушений со стороны Администратора нет. Наказание выдано верно.<br><br>"+
                '[B][I][COLOR=rgb(255, 255, 255)]Отказано, закрыто.[/COLOR][/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
    {
          title: '| От 3 лица |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Жалобы составленные от 3-его лица не принимаются к рассмотрению.<br><br>"+
                '[B][I]Отказано, закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
    {
          title: '| Жалобы на теха |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Обратитесь в раздел «Жалобы на тех. специалистов» - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9624-spb.1205/']Кликабельно[/URL].<br><br>"+
                '[B][I]Отказано, закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
    {
        title: '| 48 часов |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]С момента получения наказания прошло более 48-ми часов. Вы можете попробовать обжаловать наказание в разделе «Обжалование наказаний».<br><br>"+
                '[B][I]Отказано, закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
    {
        title: '| Дубликаты |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Ответ был дан в прошлой жалобе. Напоминаю, за три жалобы с одинаковым содержанием Ваш форумный аккаунт будет заблокирован.<br><br>"+
                '[B][I]Отказано, закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
    {
          title: '| Доказательства |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Прикрепите доказательства полученного Вами наказания на любой из фото/видеохостингов - Imgur, Япикс, Youtube и тд.<br><br>"+
                '[B][I]Отказано, закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: '| Нету /time |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br><br>"+
                '[B][I]Отказано, закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: '| Не по теме |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Ваша жалоба не относится к данному разделу.<br><br>"+
                '[B][I]Отказано, закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
     {
          title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Жалобы на игроков ----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
        },
    {
          title: '| Приветствие |',
          content:
                "[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender] [/CENTER][/COLOR][/B]",
        },
        {
          title: '| NonRP обман |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Игрок будет наказан по следующему пункту регламента:<br><br>"+
                "[B][I][COLOR=#FF0000]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=#FF0000]| PermBan[/COLOR]<br>"+
                "[B][I][COLOR=#FF0000]Примечание:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br>"+
                "[B][I][COLOR=#FF0000]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны)..<br><br>"+
                '[B][I]Одобрено[/I][/B]',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
    {
        title: '| Оск родни |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Игрок будет наказан по следующему пункту регламента:[/B][/I]<br><br>"+
                "[B][I][COLOR=#FF0000]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=#FF0000]| Mute 120 минут / Ban 7 - 15 дней[/COLOR]<br>"+
                "[B][I][COLOR=#FF0000]Примечание:[/COLOR] термины 'MQ', 'rnq' расценивается, как упоминание родных.<br>"+
                "[B][I][COLOR=#FF0000]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.<br><br>"+
                '[B][I]Одобрено.[/I][/B]',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
    {
        title: '| FLOOD |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Игрок будет наказан по следующему пункту регламента:[/B][/I]<br><br>"+
                "[B][I][COLOR=#FF0000]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=#FF0000] | Mute 30 минут[/COLOR]<br><br>"+
                '[B][I]Одобрено.[/I][/B]',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
      {
        title: '| СapsLock |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Игрок будет наказан по следующему пункту регламента:[/B][/I]<br><br>"+
                "[B][I][COLOR=#FF0000]3.02.[/COLOR] Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате[COLOR=#FF0000] | Mute 30 минут[/COLOR]<br>"+
                "[B][I][COLOR=#FF0000]Пример:[/COLOR] 'ПрОдАм', 'куплю МАШИНУ'.<br><br>"+
                '[B][I]Одобрено.[/I][/B]',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
     {
        title: '| MG |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Игрок будет наказан по следующему пункту регламента:[/B][/I]<br><br>"+
                "[B][I][COLOR=#FF0000]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[COLOR=#FF0000] | Mute 30 минут[/COLOR]<br>"+
                "[B][I][COLOR=#FF0000]Примечание:[/COLOR] использование смайлов в виде символов «))», «=D» запрещено в IC чате.<br>"+
                "[B][I][COLOR=#FF0000]Примечание:[/COLOR] телефонное общение также является IC чатом.<br>"+
                "[B][I][COLOR=#FF0000]Исключение:[/COLOR] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.<br><br>"+
                '[B][I]Одобрено.[/I][/B]',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
      {
        title: '| DM |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Игрок будет наказан по следующему пункту регламента:[/B][/I]<br><br>"+
                "[B][I][COLOR=#FF0000]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[COLOR=#FF0000] | Jail 60 минут[/COLOR]<br>"+
                "[B][I][COLOR=#FF0000]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br>"+
                "[B][I][COLOR=#FF0000]Примечание:[/COLOR] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.<br>"+
                '[B][I]Одобрено.[/I][/B]',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
     {
        title: '| DB |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Игрок будет наказан по следующему пункту регламента:[/B][/I]<br><br>"+
                "[B][I][COLOR=#FF0000]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=#FF0000] | Jail 60 минут[/COLOR]<br><br>"+
                '[B][I]Одобрено.[/I][/B]',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
     {
        title: '| TK |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Игрок будет наказан по следующему пункту регламента:[/B][/I]<br><br>"+
                "[B][I][COLOR=#FF0000]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=#FF0000] | Jail 60 минут / Warn (за два и более убийства)[/COLOR]<br><br>"+
                '[B][I]Одобрено.[/I][/B]',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
         {
        title: '| Таран инко |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Игрок будет наказан по следующему пункту регламента:[/B][/I]<br><br>"+
                "[B][I][COLOR=#FF0000]2.04.[/COLOR]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=#FF0000] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR]<br>"+
                "[B][I][COLOR=#FF0000]Пример:[/COLOR] таран дальнобойщиков, инкассаторов под разными предлогами..<br><br>"+
                '[B][I]Одобрено.[/I][/B]',
          prefix: ACCEPT_PREFIX,
          status: false,
        },
     {
          title: '| Доказательства |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Предоставленных Вами доказательств недостаточно для корректного рассмотрения жалобы.<br><br>"+
                '[B][I]Отказано, закрыто.[/I][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
    {
          title: '| Передано Теху |',
          content:
                "[B][I]{{ greeting }} {{ user.name }} [/I][/B]<br><br>"+
                "[B][I]Ваша жалоба передана тех. специалисту.<br>"+
                "[B][I]Не создавайте дубликаты темы до полного рассмотрения.<br><br>"+
                '[B][I]Ожидайте ответа.[/I][/B]',
          prefix: TECH_PREFIX,
          status: true,
        },
        

];

$(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы

        addButton('На рассмотрение', 'pin');
        addButton('Закрыть', 'closed');
    addButton('Меню', 'selectAnswer');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
                XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
                buttons.forEach((btn, id) => {
                        if(id > 1) {
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
  greeting: () =>
        4 < hours && hours <= 11
          ? 'Доброе утро, уважаемый(ая)'
          : 11 < hours && hours <= 15
          ? 'Добрый день, уважаемый(ая)'
          : 15 < hours && hours <= 21
          ? 'Добрый вечер, уважаемый(ая)'
          : 'Доброй ночи, уважаемый(ая)',
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
        }
        if(pin == true){
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