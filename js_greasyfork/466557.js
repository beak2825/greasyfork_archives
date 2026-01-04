// ==UserScript==
// @name         Скрипт для жалоб на игроков
// @namespace    https://forum.blackrussia.online
// @version      7.3
// @description  Comfort moderation
// @author       Prokhor Adzinets
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @icon https://i.yapx.ru/RMTMT.png
// @copyright 2023,
// @downloadURL https://update.greasyfork.org/scripts/466557/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/466557/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';
  const FAIL_PREFIX = 4;
  const OKAY_PREFIX = 8;
  const WAIT_PREFIX = 2;
  const TECH_PREFIX = 13;
  const WATCH_PREFIX = 9;
  const CLOSE_PREFIX = 7;

  const FONT = "Courier New"
  const SIZE = "4"

  const buttons = [
      {
        title: 'Приветствие',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER][/CENTER]<br><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
      },
      {
        title: 'Жалобу на рассмотрение',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ваша жалоба взята в процессе рассмотрения. Не создавайте дубликаты данной темы.[/CENTER]<br>" +
          "[CENTER]Ожидайте ответа.[/CENTER][/SIZE][/FONT]",
        prefix: WAIT_PREFIX,
        status: true,
      },
      {
        title: '______________________ОТКАЗЫ______________________',
      },
      {
        title: '______________________ОТКАЗЫ______________________',
      },
      {
        title: 'Форма темы',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ваша жалоба составлена не по форме, либо не все пункты формы правильно заполнены. Пересоздайте тему, заполнив каждый из пунктов, представленных ниже:[/CENTER]<br>" +
          "[QUOTE][SIZE=4]1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/SIZE][/QUOTE]<br><br>" +
          '[CENTER]<span style="color: rgb(255, 0, 0)">Отказано</span>, закрыто.<br>[/CENTER]<br>' +
          '[CENTER]Приятной игры на Black Russia <span style="color: red">RED</span></CENTER>[/FONT][/SIZE]',
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Не тот сервер',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Вы ошиблись сервером при подаче заявки, обратитесь в нужный раздел.[/CENTER]<br><br>" +
"[CENTER]<span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br>[/CENTER]<br>" +
          '[CENTER]Приятной игры на Black Russia <span style="color: red">RED</span></CENTER>[/FONT][/SIZE]',
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'В жб на админинов',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
"[CENTER]Обратитесь в раздел жалоб на администрацию → *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.86/']Кликабельно[/URL]*[/CENTER]<br><br>" +
"[CENTER]<span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br><br>[/CENTER]" +
'[CENTER]Приятной игры на Black Russia <span style="color: red">RED</span>[/FONT][/SIZE]</CENTER></center>',

        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'В обжалования',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Обратитесь в раздел обжалований наказаний → *[URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.89/']Кликабельно[/URL]*[/CENTER]<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: CLOSE_PREFIX,
        status: false,
      },
      {
        title: 'В жб на сотрудников',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Обратитесь в раздел жалоб на сотрудников фракции.[/CENTER]<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Нет тайма',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]В ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Нет таймкодов',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: '3+ дня',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Вашим доказательствам более трёх дней.[/CENTER]<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Доква в соц сетях',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Жалоба от 3-го лица',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ваша жалоба составлена от третьего лица.[/CENTER]<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Ответ был дан в предыдущей теме',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ответ вам был дан в предыдущей теме.[/CENTER]<br><br>" +
'[center]<span style="color: rgb(255, 0, 0)">Отказано</span>, закрыто.<br>[/center]<br>' +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Нет нарушений',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]В ваших доказательствах нет нарушений.<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Недостаточно доказательств',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]После проверки ваших доказательств и системы логирование был вынесен вердикт - Нарушений от игрока не было обнаружено.<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Загрузка доказательств',
        content:
        `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>` +
        "[CENTER]Загрузите доказательства на любой фото/видео хостинг, например Imgur, Yapx, Youtube, и оставьте полученную ссылку в новой теме.[/CENTER]<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: CLOSE_PREFIX,
        status: false,
      },
      {
        title: 'Доказательства отредактированы',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: 'Док-ва в плохом качестве',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Ваши доказательства в плохом качестве.<br><br>" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: FAIL_PREFIX,
        status: false,
      },
      {
        title: '____________________ОДОБРЕНИЯ____________________',
      },
      {
        title: '____________________ОДОБРЕНИЯ____________________',
      },
      {
        title: 'НРП Обман',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
            {
        title: 'ДОЛГ',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[/CENTER]<br>" +
          "[CENTER][QUOTE]<span style='color: rgb(255, 0, 0)'>-Примечание:</span> займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>" +
          "[CENTER]<span style='color: rgb(255, 0, 0)'>-Примечание:</span> при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(255, 0, 0)'>-Примечание:</span> жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/CENTER]<br><br>[/QUOTE]" +
"<center><span style='color: rgb(255, 0, 0)'>Отказано</span>, закрыто.<br></center><br>" +
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ДМ',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ДБ',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ПГ',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ТК',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства).[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'СК',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства).[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'МАСС ДМ',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'МГ',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ОСК РОДНИ',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Обман адм',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Оск адм',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Оск проекта',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ОСК | 3.03',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ОСК | 3.07',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Оск национальности или религии',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'КАПС',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ФЛУД',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Транслит',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'НРП поведение',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Ндрайв',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Фдрайв',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'НРП ВЧ',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан за нарушение правил нападения на Воинскую Часть.[/CENTER]<br>" +
          "[CENTER]Подробнее с правилами можно ознакомиться по ссылке → [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B0%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D0%B2%D0%BE%D0%B5%D0%BD%D0%BD%D1%83%D1%8E-%D1%87%D0%B0%D1%81%D1%82%D1%8C.185332/']*Нажмите сюда*.[/URL][/CENTER]<br><br>" +
        "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ООС Угрозы',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Угрозы наказанием от адм',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Аморал',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br><br>" +
        "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Промокоды',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Выдача за адм',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Политическая пропаганда',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Прогул Р/Д',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Объявления в ГОСС',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Реклама',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Слив глоб. чата',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Замена объяв сми',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Мат в VIP',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Слив склада',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        status: false,
      },
      {
        title: 'Злоуп. командами',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Злоуп. знаками',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 30 дней.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Злоуп. нарушениями',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.39. Злоупотребление нарушениями правил сервера | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Богоюз или Обход с-мы',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br><br>" +
        "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Багоюз анимации',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'ПО | 2.22',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br><br>" +
        "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Уход от РП',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/SIZE][/QUOTE][/CENTER]<br><br>" +
         "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Любой оск в войс',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.15. Запрещено оскорблять игроков или родных в Voice Chat | Mute 120 минут / Ban 7 - 15 дней.[/SIZE][/QUOTE][/CENTER]<br><br>" +
        "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Задержание без отыгровок РП',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Розыск или штраф без отыгровок РП',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]6.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Любое НРП поведение ГОСС сотрудника',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]6.04. Запрещено nRP поведение | Warn.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Забрал В/У во время погони',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]7.05. Запрещено отбирать водительские права во время погони за нарушителем | Warn.[/SIZE][/QUOTE][/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
      {
        title: 'Будет выдано предупреждение на ФА',
        content:
          `[SIZE=${SIZE}][FONT=${FONT}][CENTER]Здравствуйте,  {{ user.mention }}.[/CENTER]<br><br>` +
          "[CENTER]Нарушитель получит предупреждение на форумный аккаунт.[/CENTER]<br><br>" +
          "[CENTER]<span style='color: rgb(0, 255, 0)'>Одобрено</span>, закрыто.[/CENTER]<br><br>[CENTER]"+
          "[CENTER]Приятной игры на Black Russia <span style='color: red'>RED</span></CENTER>[/FONT][/SIZE]",
        prefix: OKAY_PREFIX,
        status: false,
      },
  ];
  
  $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

      addButton('МЕНЮ ЖАЛОБ', 'selectAnswer');
      addButton('|', '');
  
      // Поиск информации о теме
      const threadData = getThreadData();
  
   $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
   $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
   $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
   $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
   $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
   $('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));
  
      $(`button#selectAnswer`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if (id > 1) {
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
        ? 'Доброе утро'
        : 11 < hours && hours <= 15
        ? 'Добрый день'
        : 15 < hours && hours <= 21
        ? 'Добрый вечер'
        : 'Доброй ночи',
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
  
  function moveThread(prefix, type) {
  // Функция перемещения тем
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
  })();