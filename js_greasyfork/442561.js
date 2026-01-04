// ==UserScript==
// @name         BR FORUM ZGA
// @namespace    https://forum.blackrussia.online
// @version      1.0.5.11
// @description  aika top
// @author       William
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator William
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @downloadURL https://update.greasyfork.org/scripts/442561/BR%20FORUM%20ZGA.user.js
// @updateURL https://update.greasyfork.org/scripts/442561/BR%20FORUM%20ZGA.meta.js
// ==/UserScript==


(function () {
  'use strict';
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
  const buttons = [{
      title: 'Приветствие',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
    },

    {
      title: 'Запрос доказательств',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][FONT=georgia][SIZE=5]У администратора были запрошены доказательства на выданное наказание.<br><br>Ожидайте рассмотрения вашей жалобы в данной теме. Темы с подобным содержанием создавать не нужно.<br>Благодарим за обращение.[/SIZE][/FONT][/B][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
   prefix: PIN_PREFIX,
   status: true,
    },
    {
      title: 'Наказание выдано верно/Админ Кинул опровержение',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=Courier New][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(31, 206, 203)][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]Администратор, выдавший наказание предоставил опровержение на ваше нарушение. Наказание выданное вам, было выдано верно.[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][B][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'На рассмотрении',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][SIZE=5][B][COLOR=rgb(31, 206, 203)]Ваша жалоба находится на рассмотрении. Просьба не создавать жалобы с подобными содержаниями, ожидайте ответа в данной теме.[/COLOR]<br>[COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
   prefix: PIN_PREFIX,
   status: true,
    },
                           {
      title: 'На рассмотрении (Заявка на амнистию)',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][SIZE=5][B][COLOR=rgb(31, 206, 203)]Ваша заявка на амнистию находится на рассмотрении Основного Заместитель Главного Администратора. Просьба не создавать заявки с подобными содержанием, ожидайте ответа в данной теме.[/COLOR]<br>[COLOR=rgb(31, 206, 203)]Вам будет дан ответ в ближайшее время, благодарим за терпение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
   prefix: PIN_PREFIX,
   status: true,
    },
    {
      title: 'Техническому специалисту',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][FONT=times new roman][SIZE=5]Ваша жалоба на рассмотрении Технического специалиста.<be>Ожидайте ответа.[/SIZE][/FONT][/B][/CENTER]<br>Благодарим за обращение.[/SIZE][/FONT][/B][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении.[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
   prefix: TECHADM_PREFIX,
   status: true,
   },
            {
      title: 'Идите в технический раздел',
      content: '[FONT=georgia][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=#1fcecb][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:<br>Вам нужно обратиться в технический раздел.[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]<br>Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                            {
          title: 'Идите в жб на техов',
          content: '[FONT=georgia][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
            "[CENTER][FONT=georgia][COLOR=#1fcecb][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:<br>Вам нужно обратиться в раздел „Жалобы на технических специалистов”: https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]<br>Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
            '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
        prefix: UNACCEPT_PREFIX,
             status: false,
                },
                                           {
      title: 'Жалобы от 3-его лица',
      content: '[FONT=georgia][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваша жалоба отклонена по причине:[/FONT][/SIZE]<br>[COLOR=rgb(255, 36, 0)][SIZE=7][FONT=georgia]3.3.[/FONT][/SIZE][/COLOR] [SIZE=4][FONT=georgia]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/FONT][/SIZE][/B][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                                        {
      title: 'Присутвуют редактирования',
      content: '[FONT=georgia][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваша жалоба отклонена по причине:[/FONT][/SIZE]<br>[COLOR=rgb(255, 36, 0)][SIZE=7][FONT=georgia]3.7.[/FONT][/SIZE][/COLOR] [FONT=georgia][SIZE=4]Доказательства должны быть в первоначальном виде.<br>Примечание: видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств. Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/SIZE][/FONT][/B][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                        {
      title: 'Предоставьте скрин бана',
      content: '[FONT=georgia][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(31, 206, 203)][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]Предоставьте скриншот окна блокировки вашего аккаунта. Далее создайте новую тему.[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                        {
      title: 'Нет нарушений',
      content: '[FONT=georgia][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=#1fcecb][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]Нарушений со стороны администратора не замечено/выявлено.[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },

                        {
      title: 'Нет /time',
      content: '[FONT=georgia][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=#1fcecb][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:<br>На ваших скриншотах(-е) отсутвует (/time)[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]<br>Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                                    {
      title: 'Прошло более 24 часов',
      content: '[FONT=georgia][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(31, 206, 203)][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]Ваша жалоба не подлежит рассмотрению, так как прошло более 24 часов с момента выдачи наказания.<br>Пункт правила: [/SIZE][/COLOR]<br>[COLOR=rgb(97, 189, 109)][SIZE=4]3.1. Срок написания жалобы составляет один день (24 часа) с момента совершенного нарушения со стороны администратора сервера.<br>Примечание: в случае истечения срока жалоба рассмотрению не подлежит.[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
    prefix: CLOSE_PREFIX,
         status: false,
            },

                    {
      title: 'Не по форме',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=Courier New][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(31, 206, 203)][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]Ваша жалоба составлена не по форме. С формой создания темы можно ознакомиться тут: [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.559802/']https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.559802/[/URL][/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][B][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },

        {
      title: 'В обжалование',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=#1fcecb][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=rgb(255, 71, 202)][SIZE=5]Обратитесь в раздел Обжалование наказаний:[/SIZE][/COLOR][COLOR=#1fcecb][SIZE=5] [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.683/']https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.683/[/URL][/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][B][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]',
   prefix: UNACCEPT_PREFIX,
   status: false,
    },
        {
      title: 'Доква с соц сетей не принимаются',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=#1fcecb][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]Доказательства с социальных сетей не принимаются.<br>Пункт правила: [/SIZE][COLOR=rgb(97, 189, 109)][SIZE=4]3.6. Прикрепление доказательств обязательно.[/SIZE][/COLOR][/COLOR]<br>[COLOR=#ff47ca][COLOR=rgb(97, 189, 109)][SIZE=4]Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/COLOR][/COLOR][/FONT][/CENTER]<br>[FONT=georgia][COLOR=#ff47ca][COLOR=rgb(255, 36, 17)][FONT=courier new][SIZE=7]F.A.Q [/SIZE][/FONT][FONT=times new roman][SIZE=6]как загрузить скриншот с выданным наказанием.[/SIZE][/FONT][/COLOR][/COLOR][/FONT]<br>[FONT=georgia][COLOR=#ff47ca][COLOR=rgb(255, 36, 17)][FONT=times new roman]<br>[FONT=georgia][FONT=times new roman][SIZE=4]1. Зайти на сайт [URL]https://yapx.ru/[/URL] [/SIZE][/FONT][/FONT]<br>[INDENT][FONT=georgia][FONT=times new roman][SIZE=4]2. Нажать на кнопку «загрузить изображения»[IMG]https://i.yapx.ru/O5vD8.jpg[/IMG][/SIZE][/FONT][/FONT][/INDENT]<br>[INDENT][FONT=georgia][FONT=times new roman][SIZE=4]3. Выбираем нужный скриншот и нажимаем на него.[/SIZE][/FONT][/FONT][/INDENT]<br>[INDENT][/INDENT]<br>[INDENT][/INDENT]<br>[CENTER][FONT=georgia][SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][B][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]',
   prefix: UNACCEPT_PREFIX,
   status: false,
    },
    {
      title: 'слив адм',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][I]Вы будете  наказаны по пункту правил: 2.32. Запрещен обман администрации, ее оскорбление, неуважительное отношение, неконструктивная критика, унижение чести и достоинства и тому подобное | Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
        '[RIGHT][B][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U] Закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]',
    prefix: WATCHED_PREFIX,
   status: false,
    },
    {
      title: 'Не предост. скрин выдачи',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=Courier New][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER]<br>[FONT=georgia][COLOR=#1fcecb][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]Вы не предоставили скриншот выдачи наказания от администрации.[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][B][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]',
   prefix: UNACCEPT_PREFIX,
   status: false,
    },

{
      title: 'Ссылка не работает',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=Courier New][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=#1fcecb][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]Предоставленная вами ссылка не работает/открывается или вовсе не действительна.[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][B][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]Отказано • закрыто[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/B][/RIGHT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Админ будет наказан',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=Courier New][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(31, 206, 203)][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]Администратор получит наказание по данной жалобе. Приносим свои извинения за доставленные неудобства. Если вам выдали наказание, оно.будет снято.[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][B][FONT=georgia][SIZE=7][COLOR=rgb(52, 201, 36)]Одобрено[/COLOR] • Закрыто.[/SIZE][/FONT][/B][/RIGHT]',
    prefix: DECIDED_PREFIX,
    status: false,
    },
    {
      title: 'С админом будет беседа',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=Courier New][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][FONT=georgia][COLOR=rgb(31, 206, 203)][SIZE=5]Ваша жалоба была рассмотрена администрацией сервера, далее было вынесено данное решение:[/SIZE][/COLOR]<br>[COLOR=#ff47ca][SIZE=5]С Администратором будет проведена беседа  по данной жалобе. Приносим свои извинения за доставленные неудобства.Если вам выдали наказание, оно будет снято.[/SIZE][/COLOR]<br>[SIZE=5][B][COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br>" +
        '[RIGHT][B][FONT=georgia][SIZE=7][COLOR=rgb(52, 201, 36)]Одобрено[/COLOR] • Закрыто.[/SIZE][/FONT][/B][/RIGHT]',
    prefix: DECIDED_PREFIX,
    status: false,
    },
        {
      title: 'Кинул доква/Передано ЗГА',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][FONT=times new roman][SIZE=5]Предоставил опровержение на ваше нарушение Основному Заместителю Главного Администратора, а также Главному Администратору, ожидайте его ответа.[/SIZE]<br><br>[SIZE=4]Иногда решение/рассмотрение подобных жалоб требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/SIZE][/FONT][/B][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
   prefix: PIN_PREFIX,
   status: true,
    },
        {
      title: 'Передано ЗГА',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][FONT=times new roman][SIZE=5]Ваша жалоба передана Заместителю Главного Администратора, ожидайте его ответа.[/SIZE]<br><br>[SIZE=4]Иногда решение/рассмотрение подобных жалоб требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/SIZE][/FONT][/B][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
   prefix: PIN_PREFIX,
   status: true,
    },
        {
      title: 'Главному Администратору',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваша жалоба передана Главному Администратору, ожидайте его ответа.[/FONT][/SIZE]<br><br>[SIZE=4][FONT=georgia]Иногда решение/рассмотрение подобных жалоб требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/FONT][/SIZE][/B][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
   prefix: MAINADM_PREFIX,
   status: true,
    },
        {
      title: 'Специальному Администратору',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваша жалоба передана Специальному Администратору, ожидайте его ответа.[/FONT][/SIZE]<br><br>[SIZE=4][FONT=georgia]Иногда решение/рассмотрение подобных жалоб требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/FONT][/SIZE][/B][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
   prefix: SPECADM_PREFIX,
   status: true,
    },
            {
      title: 'Команде проекта',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=georgia][B][I][CENTER]{{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваша жалоба передана Команде Проекта, ожидайте ответа.[/FONT][/SIZE]<br><br>[SIZE=4][FONT=georgia]Иногда решение/рассмотрение подобных жалоб требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/FONT][/SIZE][/B][/CENTER]<br>" +
        '[RIGHT][SIZE=7][FONT=georgia][COLOR=rgb(245, 64, 33)][B][U]На Рассмотрении[/U][/B][/COLOR][B].[/B][/FONT][/SIZE][/RIGHT]',
   prefix: COMMAND_PREFIX,
   status: true,
    },
    {
      title: 'Правила раздела',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=Courier New][B][I][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][I]Созданная  вами тема никоим образом не относится к теме данного раздела. [/CENTER]<br>" +
        '[RIGHT][B][I][COLOR=rgb(255, 36, 17)][FONT=georgia][SIZE=7][/SIZE][SIZE=10]закрыто.[/SIZE][/FONT][/COLOR][/I][/B][/RIGHT][FONT=georgia][SIZE=5][B][I][COLOR=rgb(204, 255, 204)]Приятной игры на [/COLOR][COLOR=rgb(0, 0, 0)]Black[/COLOR] [COLOR=rgb(255, 36, 0)]Russia[/COLOR] [COLOR=rgb(255, 255, 0)](GOLD)[/COLOR][/I][/B][/SIZE][/FONT][/FONT]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
      title: 'Дублирование темы',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=Courier New][B][I][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][I]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br>" +
        '[RIGHT][B][I][COLOR=rgb(255, 36, 17)][FONT=georgia][SIZE=7][/SIZE][SIZE=5]закрыто.[/SIZE][/FONT][/COLOR][/I][/B][/RIGHT][FONT=georgia][SIZE=5][B][I][COLOR=rgb(204, 255, 204)]Приятной игры на [/COLOR][COLOR=rgb(0, 0, 0)]Black[/COLOR] [COLOR=rgb(255, 36, 0)]Russia[/COLOR] [COLOR=rgb(255, 255, 0)](GOLD)[/COLOR][/I][/B][/SIZE][/FONT][/FONT]',
   prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content: '[CENTER][SIZE=4][/SIZE][/CENTER][FONT=Courier New][B][I][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>' +
        "[CENTER][B][I]Недостаточно доказательств на нарушение от данного Администратора.<br><br>" +
        '[RIGHT][B][I][COLOR=rgb(255, 36, 17)][FONT=georgia][SIZE=7]Отказано, [/SIZE][SIZE=5]закрыто.[/SIZE][/FONT][/COLOR][/I][/B][/RIGHT][FONT=georgia][SIZE=5][B][I][COLOR=rgb(204, 255, 204)]Приятной игры на [/COLOR][COLOR=rgb(0, 0, 0)]Black[/COLOR] [COLOR=rgb(255, 36, 0)]Russia[/COLOR] [COLOR=rgb(255, 255, 0)](GOLD)[/COLOR][/I][/B][/SIZE][/FONT][/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
  ];

$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Отказано', 'unaccept');
addButton('Рассмотрено', 'watched');
addButton('Решено', 'decided');
addButton('Одобрено', 'accepted');
addButton('Закрыто', 'closed');
addButton('Специальному Администратору', 'specadm');
addButton('Главному Администратору', 'mainadm');
addButton('Техническому спецалисту', 'techspec');
addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

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
