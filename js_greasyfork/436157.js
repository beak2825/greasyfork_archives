// ==UserScript==
// @name         BR FORUM | ОБЖ
// @namespace    https://forum.blackrussia.online
// @version      1.0.5.16
// @description  try to take over the world!
// @author       Amirka
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator William
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @downloadURL https://update.greasyfork.org/scripts/436157/BR%20FORUM%20%7C%20%D0%9E%D0%91%D0%96.user.js
// @updateURL https://update.greasyfork.org/scripts/436157/BR%20FORUM%20%7C%20%D0%9E%D0%91%D0%96.meta.js
// ==/UserScript==


(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const SPECADM_PREFIX = 11;
  const DECIDED_PREFIX = 6;
  const MAINADM_PREFIX = 12;
  const TECHADM_PREFIX = 13
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [ {
    title: `Приветствие`,
      content: `[CENTER][/CENTER][SIZE=5][FONT=georgia][B][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>`+
        `[CENTER]  [/CENTER][/FONT]<br>`+
         `[CENTER][FONT=georgia][SIZE=5][B][I][COLOR=rgb(204, 255, 204)]Приятной игры на [/COLOR][COLOR=rgb(0, 0, 0)]Black[/COLOR] [COLOR=rgb(255, 36, 0)]Russia[/COLOR] [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][/I][/B][/SIZE][/FONT]`,
    },

    {
      title: `Pin`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Ваше обжалование находится на рассмотрении администрации сервера[/COLOR][COLOR=rgb(105, 105, 105)] [/COLOR][/SIZE][COLOR=rgb(103, 171, 207)][color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][SIZE=5]. [/SIZE][/COLOR][COLOR=rgb(255, 250, 250)][SIZE=5]Просим вас не создавать обжалования с подобным содержанием, ответ будет дан в этой теме как только это будет возможно. Благодарим за ожидание[/SIZE].[/COLOR][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
   prefix: PIN_PREFIX,
   status: true,
    },
    {
      title: `F.P`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Ваш аккаунт будет разблокирован для выдачи компенсации пострадавшей стороне. Весь процесс нужно фиксировать на запись экрана с (/time), у вас есть 24 часа на ответ после совершения сделки с пострадавшим.<br>Напомню, попытки перекинуть имущество на другие аккаунты будет наказываться и вы можете лишиться права обжалования.[/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
   prefix: PIN_PREFIX,
    },
    {
      title: `Fraud`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Данное наказание можно обжаловать только при условии выдачи компенсации пострадавшей стороне. Для этого вы должны связаться с обманутой стороной, обсудить условия. Примечание: обманутый игрок должен отриписать в теме вашего обжалования. <br>Рассмотрено.[/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>",
   prefix: WATCHED_PREFIX,
   status: false,
    },
        {
      title: `Обж--`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Ваше обжалование рассмотрено[/COLOR][/SIZE][COLOR=rgb(255, 250, 250)]. К сожалению наказание с данной причиной не подлежит обжалованию со стороны администрации сервера.<br>Также причины из за которых обжалования получают статус «Отказано», так как они не подлежат обжалованию.[/COLOR][/FONT][/B]<br>[FONT=courier new][B][QUOTE][COLOR=rgb(255, 36, 0)]4.1.[/COLOR] различные формы «слива».[/B][/FONT]<br>[B][FONT=courier new][COLOR=rgb(255, 36, 0)]4.2.[/COLOR] продажа игровой валюты;<br>[COLOR=rgb(255, 36, 0)]4.3[/COLOR]. махинации;<br>[COLOR=rgb(255, 36, 0)]4.4[/COLOR]. целенаправленный багоюз;<br>[COLOR=rgb(255, 36, 0)]4.5[/COLOR]. продажа, передача аккаунта;<br>[COLOR=rgb(255, 36, 0)]4.6.[/COLOR] сокрытие ошибок, багов системы;<br>[COLOR=rgb(255, 36, 0)]4.7[/COLOR]. использование стороннего программного обеспечения;<br>[COLOR=rgb(255, 36, 0)]4.8[/COLOR]. распространение конфиденциальной информации;[/FONT][/B]<br>[FONT=courier new][B][COLOR=rgb(255, 36, 0)]4.9[/COLOR]. обман администрации.[/B][/FONT][/QUOTE]<br>[CENTER][COLOR=rgb(103, 171, 207)]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
        {
      title: `No`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br><br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]В обжаловании вашего наказания [/COLOR][COLOR=rgb(255, 36, 0)]отказано[/COLOR][COLOR=rgb(255, 250, 250)]. Мы не готовы пойти к вам навстречу.[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
            {
      title: `Обж ранее`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Вы уже получили шанс на обжалование вашего наказания, срок наказания был снижен.[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
    prefix: CLOSE_PREFIX,
    status: false,
    },
        {
      title: `Ans`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Ответ на обжалование дан в предыдущей теме. [/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
      title: `Punish+`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Проверив доказательства было принято решение: Наказание выдано верно. [/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
      title: `T`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][B][FONT=times new roman][SIZE=5]Ваше обжалование на рассмотрении Технического специалиста.<be>Ожидайте ответа.[/SIZE][/FONT][/B][/CENTER]<br>Благодарим за обращение.[/SIZE][/FONT][/B][/CENTER]<br>" +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении.[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
   prefix: TECHADM_PREFIX,
   status: true,
   },
            {
      title: `T.R`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Обратитесь в технический раздел по ссылке — [/COLOR][/SIZE][/FONT][/B] [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-spb.1095/']Технический раздел | SPB | Кликабельно.[/URL] \n " +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                            {
          title: `T.C`,
          content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
            "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Обратитесь в жалобы на технических специалистов по ссылке — [/COLOR][/SIZE][/FONT][/B][URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9624-spb.1205/']Технический раздел сервера №24 | SPB | Кликабельно[/URL]<br>" +
            `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
        prefix: UNACCEPT_PREFIX,
             status: false,
                },
                            {
      title: `Server`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Напишите обжалование в соответующий раздел вашего сервера. В данный момент обжалование составлено на сервере [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color].[/SIZE][/FONT][/B]<br><br>[CENTER][URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.89/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера RED (1)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.120/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера GREEN (2)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.157/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера BLUE (3)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.195/`][B][SIZE=5]Раздел обжалований сервера  YELLOW (4)[/SIZE][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.274/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера ORANGE (5)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.313/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера PURPLE (6)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.353/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера LIME (7)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.395/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера PINK (8)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.436/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера CHERRY (9)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.471/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера BLACK (10)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.520/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера INDIGO (11)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.561/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера WHITE (12)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.600/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера MAGENTA (13)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.641/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера CRIMSON (14)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.683/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера GOLD (15)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.724/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера AZURE (16)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.786/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера PLATINUM (17)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.845/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера AQUA (18)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.886/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера GRAY (19)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.955/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера ICE (20)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.995/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера CHILLI (21)[/COLOR][/SIZE][/FONT][/B][/URL]<br>[URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1037/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера CHOCO (22)[/COLOR][/SIZE][/FONT][/B][/URL]<br><br>[CENTER][URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1083/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера MOSCOW (23)[/COLOR][/SIZE][/FONT][/B][/URL]<br> [URL=`https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1168/`][CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Раздел обжалований сервера UFA (25)[/COLOR][/SIZE][/FONT][/B][/URL]<br> [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 255, 255)]Весь вышеописанный текст кликабельный, выберите нужный сервер и кликните по нужному тексту.[/COLOR][/SIZE][/FONT][/B]<br>[COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER] <br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
    prefix: CLOSE_PREFIX,
    status: false,
    },
                                           {
      title: `3.Per`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Обжалование составлено от 3-его лица. <br>Рассмотрению не подлежит.[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
   {
      title: `Edit`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваше обжалование отклонено по причине:[/FONT][/SIZE]<br>[COLOR=rgb(255, 36, 0)][SIZE=6][FONT=georgia]3.4.[/FONT][/SIZE][/COLOR] [FONT=georgia][SIZE=5]Доказательства должны быть в первоначальном виде.<br>Примечание: видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств. Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/SIZE][/FONT][/B][/CENTER]<br>" +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                        {
      title: `Ban WIN`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Уважаемый игрок, просим вас прикрепить скриншот окна блокировки вашего аккаунта.[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
         status: false,
            },


                    {
      title: `Form`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Уважаемый игрок, составьте обжалование по форме. Форма для заполнения обжалования доступна по ссылке — [/COLOR][/SIZE][/FONT][/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']Правила подачи заявки на обжалование наказания | Кликабельно[/URL]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
        {
      title: `S.M`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5][COLOR=rgb(255, 250, 250)]Уважаемый игрок, просим вас прикрепить скриншот через фото/видео хостинги. По правилам обжалований [/COLOR][COLOR=rgb(255, 36, 0)]3.3 [/COLOR]ваше обжалование отказано.<br>[QUOTE][COLOR=rgb(255, 36, 0)]3.3[/COLOR]. Прикрепление доказательств обязательно.<br>Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
   prefix: UNACCEPT_PREFIX,
   status: false,
    },

    {
      title: `SS -`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER] ${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Вы не предоставили скриншот выдачи наказания от администрации.[/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
   prefix: UNACCEPT_PREFIX,
   status: false,
    },

{
      title: `Proof err -`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Проблемы с открытием ссылки, предоставленной вами.<br>1. Ссылка не открывается/работает.<br>2. Ошибка в ссылке.<br>3. Подозрительный адрес ссылки/домена.<br><br>Попрошу вас загрузить доказательства на другой хостинг или же проверить правильность ссылки.[/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
                     {
      title: `Proof --`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][B][I]Недостаточно доказательств на нарушение от данного Администратора.<br><br>" +
       `[FONT=georgia][SIZE=5][B][I][COLOR=rgb(204, 255, 204)]Приятной игры на [/COLOR][COLOR=rgb(0, 0, 0)]Black[/COLOR] [COLOR=rgb(255, 36, 0)]Russia[/COLOR] [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][/I][/B][/SIZE][/FONT][/FONT]<br>`+
         `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
prefix: UNACCEPT_PREFIX,
    status: false,
    },
        {
      title: `Error +`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][FONT=georgia][SIZE=5]Ваше обжалование было рассмотрено администрацией сервера, далее было вынесено данное решение:[/SIZE]<br>[SIZE=5]Администратор получит наказание по данной жалобе. Приносим свои извинения за доставленные неудобства. Если вам выдали наказание, оно будет снято.[/SIZE]<br>[SIZE=5][B]Благодарим за обращение.[/B][/SIZE][/FONT][/CENTER]<br>" +
        `[RIGHT][B][FONT=georgia][SIZE=6][COLOR=rgb(52, 201, 36)]Решено[/COLOR] • Закрыто.[/SIZE][/FONT][/B][/RIGHT]`,
    prefix: DECIDED_PREFIX,
    status: false,
    },

                        {
      title: `Error -`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][FONT=georgia][SIZE=5]Ваше обжалование было рассмотрено администрацией сервера, далее было вынесено данное решение:[/SIZE]<br>[SIZE=5]Нарушений со стороны администратора не замечено/выявлено.[/SIZE]<br>[SIZE=5][B]Благодарим за обращение.[/B][/SIZE][/FONT][/CENTER]<br>" +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
        {
      title: `Min+`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br><br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Ваше наказание будет снижено до минимальных мер. Рекомендую прочитать правила серверов [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-9430816']Общие правила серверов | Кликабельно[/URL] [/SIZE][/FONT][/B]<br>[SIZE=5][COLOR=null]Желаю приятного времяпровождения на сервере [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][COLOR=null].[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][FONT=georgia][SIZE=6][COLOR=rgb(52, 201, 36)]Одобрено[/COLOR] • Закрыто.[/SIZE][/FONT][/B][/RIGHT]`,
    prefix: ACCEPT_PREFIX,
    status: false,
    },
                     {
      title: `Min++`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br><br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Вам и так выдано минимальное наказания, за ваше нарушения. Рекомендую прочитать правила серверов по ссылке — [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-9430816']Общие правила серверов | Кликабельно[/URL] [/SIZE][/FONT][/B]<br>[SIZE=5][COLOR=null]Желаю приятного времяпровождения на сервере [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][COLOR=null].[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][FONT=georgia][SIZE=6][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто.[/SIZE][/FONT][/B][/RIGHT]`,
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
        {
      title: `Обж++`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br><br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Ваше наказание будет полностью снято. Рекомендую прочитать правила серверов по ссылке — [/SIZE][/FONT][/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-9430816']Общие правила серверов | Кликабельно[/URL] <br>[SIZE=5][COLOR=null]Желаю приятного времяпровождения на сервере [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][COLOR=null].[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][FONT=georgia][SIZE=6][COLOR=rgb(52, 201, 36)]Одобрено[/COLOR] • Закрыто.[/SIZE][/FONT][/B][/RIGHT]`,
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: `7D`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br><br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Ваше наказание будет сокращено до 7 дней блокировки. Рекомендую прочитать правила серверов по ссылке — [/SIZE][/FONT][/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-9430816']Общие правила серверов | Кликабельно[/URL]<br>[SIZE=5][COLOR=null]Желаю приятного времяпровождения на сервере [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][COLOR=null].[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][FONT=georgia][SIZE=6][COLOR=rgb(52, 201, 36)]Одобрено[/COLOR] • Закрыто.[/SIZE][/FONT][/B][/RIGHT]`,
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: `15D`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br><br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Ваше наказание будет сокращено до 15 дней блокировки. Рекомендую прочитать правила серверов по ссылке — [/SIZE][/FONT][/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-9430816']Общие правила серверов | Кликабельно[/URL] <br> [SIZE=5][SIZE=5][COLOR=null]Желаю приятного времяпровождения на сервере [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][COLOR=null].[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][FONT=georgia][SIZE=6][COLOR=rgb(52, 201, 36)]Одобрено[/COLOR] • Закрыто.[/SIZE][/FONT][/B][/RIGHT]`,
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: `30D`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br><br>` +
        "[CENTER] [CENTER] [B][FONT=Georgia][SIZE=5]Ваше наказание будет сокращено до 30 дней блокировки. Рекомендую прочитать правила серверов по ссылке — [/SIZE][/FONT][/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-9430816']Общие правила серверов | Кликабельно[/URL] <br> [SIZE=5][SIZE=5][COLOR=null]Желаю приятного времяпровождения на сервере [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][COLOR=null].[/COLOR][/SIZE][/FONT][/B]<br>[CENTER][COLOR=rgb(103, 171, 207)][/SIZE][/COLOR][/CENTER]<br>" +
        `[RIGHT][B][FONT=georgia][SIZE=6][COLOR=rgb(52, 201, 36)]Одобрено[/COLOR] • Закрыто.[/SIZE][/FONT][/B][/RIGHT]`,
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
      title: `Talk`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][FONT=georgia][SIZE=5]Ваше обжалование было рассмотрено администрацией сервера, далее было вынесено данное решение:[/SIZE]<br>[SIZE=5]С Администратором будет проведена беседа  по данной жалобе. Приносим свои извинения за доставленные неудобства.Если вам выдали наказание, оно будет снято.[/SIZE]<br>[SIZE=5][B]Благодарим за обращение.[/B][/SIZE][/FONT][/CENTER<br>" +
        `[RIGHT][B][FONT=georgia][SIZE=6][COLOR=rgb(52, 201, 36)]Решено[/COLOR] • Закрыто.[/SIZE][/FONT][/B][/RIGHT]`,
    prefix: DECIDED_PREFIX,
    status: false,
    },
     
        {
      title: `S.ADM`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваше обжвлование на рассмотрении Специального Администратора, ожидайте его ответа.[/FONT][/SIZE]<br><br>[SIZE=5][FONT=georgia]Иногда решение/рассмотрение подобных обжалований требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/FONT][/SIZE][/B][/CENTER]<br>" +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
   prefix: SPECADM_PREFIX,
   status: true,
    },
            {
      title: `TOP`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][B][SIZE=5][FONT=georgia]Вашe обжалование передано Команде Проекта, ожидайте ответа.[/FONT][/SIZE]<br><br>[SIZE=5][FONT=georgia]Иногда решение/рассмотрение подобных обжалований требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/FONT][/SIZE][/B][/CENTER]<br>" +
        `[RIGHT][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]`,
   prefix: COMMAND_PREFIX,
   status: true,
    },
    {
      title: `Sec.ERR`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][B][I]Созданная  вами тема никоим образом не относится к теме данного раздела. [/CENTER]<br>" +
        `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
        prefix: CLOSE_PREFIX,
    status: false,
    },
    {
      title: `Duplicate`,
      content: `[CENTER][/CENTER][FONT=georgia][B][I][SIZE=5][CENTER]${greeting}, уважаемый(-ая)${user.mention}![/CENTER]<br>` +
        "[CENTER][B][I]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br>" +
        `[FONT=georgia][SIZE=5][B][I][COLOR=rgb(204, 255, 204)]Приятной игры на [/COLOR][COLOR=rgb(0, 0, 0)]Black[/COLOR] [COLOR=rgb(255, 36, 0)]Russia[/COLOR] [color=#c3d1db]S[/color][color=#a3bccc]P[/color][color=#6f91a8]B[/color][/I][/B][/SIZE][/FONT][/FONT]<br>` +
     `[RIGHT][B][SIZE=6][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]`,
   prefix: CLOSE_PREFIX,
   status: false,
    },
    
  ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`Ans`, `selectAnswer`);
        addButton(`Pin`, `pin`);
        addButton(`Approved`, `accepted`);
        addButton(`Denied`, `unaccept`);
        addButton(`КП`, `teamProject`);
        addButton(`viewed`, `watched`);
        addButton(`Close`, `closed`);
        addButton (`Spec.A`, `specialAdmin`);
        addButton (`ГА`, `mainAdmin`);
        addButton(`Tech.S`, `techspec`);




        // Поиск информации о теме
        const threadData = getThreadData();

       $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
$(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
$(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
$(`button#specadm`).click(() => editThreadData(SPECADM_PREFIX, true));
$(`button#mainadm`).click(() => editThreadData(MAINADM_PREFIX, true));
$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#decided`).click(() => editThreadData(DECIDED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
$(`button#techspec`).click(() => editThreadData(TECHADM_PREFIX, true));
        $(`button#statusTheme`).click(() => {
            const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

            let status = threadData.theme_status
            if ( status == false) status = 1
            else status = 0

            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    title: threadTitle,
                    discussion_open: status,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        });

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Select an answer:`);
            buttons.forEach((btn, id) => {
                if (id > 0) {
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
            `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
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
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const theme_status = $(`a.discussion_open`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
        ? `Доброе утро`
    : 11 < hours && hours <= 15
    ? `Добрый день`
       : 15 < hours && hours <= 21
    ? `Добрый вечер`
           : `Доброй ночи`

    return {
        user: {
            id: authorID,
            name: authorName,
            mention: `[USER=${authorID}]${authorName}[/USER]`,
        },
        theme_status,
        greeting: greeting
    };
    }

    function editThreadData(prefix, pin = false) {
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
        if (pin == true) {
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
