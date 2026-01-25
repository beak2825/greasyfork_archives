// ==UserScript==
// @name         KOSTROMA | Script for staff
// @namespace    https://greasyfork.org/ru/users/1288704-itsuki-liquid
// @version      3.402
// @description  Basic script for staff GA/ZGA/Kurator
// @author       I.Liquid
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @match        https://forum.blackrussia.online/forums/*
// @include      https://forum.blackrussia.online/forums/
// @match        https://forum.blackrussia.online/forums/Сервер-№77-kostroma.3430/post-thread&inline-mode=1*
// @include      https://forum.blackrussia.online/forums/Сервер-№77-kostroma.3430/post-thread&inline-mode=1
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @supportURL   https://vk.com/id592217977
// @downloadURL https://update.greasyfork.org/scripts/539142/KOSTROMA%20%7C%20Script%20for%20staff.user.js
// @updateURL https://update.greasyfork.org/scripts/539142/KOSTROMA%20%7C%20Script%20for%20staff.meta.js
// ==/UserScript==


// Дополнительная подсказка: Чтобы правильно использовать функцию pasteContent(id, threadData, send) тут id - номер кнопки в листе buttons (37 строка). Например, id На рассмотрении - 2 и тд


(async function() {
    'use strict';
     const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECIAL_PREFIX = 11;
    const GA_PREFIX = 12;
    const TECH_PREFIX = 13;
    const WAIT_PREFIX = 14;
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [

        {
            title: `----------------------------------------------Раздел обжалований (тестовый)---------------------------------------------`,
        },
        {
            title: `Приветствие`,
            content: `[FONT=georgia][CENTER]Здравствуйте, уважаемый  ${user.mention}.<br><br>[/CENTER][/FONT]`+
            `[CENTER]текст[/CENTER]`,
        },
        {
            title: `На рассмотрении`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i]Ваше обжалование взято [color=orange]на рассмотрение[/color].<br>Просьба не создавать дубликатов данной темы.<br><br>`+
            `[color=orange]На рассмотрении...[/color][/i][/b][/font][/center]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Одобрено (сокращение)`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i]Рассмотрев ваше обжалование, ваше наказание будет облегчено<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(97,189,109)]Закрыто.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Одобрено`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Рассмотрев ваше обжалование, ваше наказание будет снято.<br>[/CENTER]`+
            `[CENTER]Впредь не нарушайте!<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(97,189,109)]Закрыто.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Отказано`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]В обжаловании отказано.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: `Жалобу в адм раздел`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Если вы не согласны с наказанием, напишите жалобу на администратора.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Данный вид не обж`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Данный вид наказания не обжалуется.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Пусть обманутая напишет`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Пусть обманутая сторона напишет обжалование, где он будет согласен на возврат имущества.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Обжалован (24 часа -> нрп обман)`,
            content: `[url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>`+
`[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i]Игровой аккаунт нарушителя был разблокирован<br>У нарушителя есть 24 часа на возврат имущества, иначе аккаунт будет снова заблокирован<br><br>[/CENTER]`+
            `[CENTER][COLOR=orange]На рассмотрении.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Обжалован (24 часа -> смена ника`,
            content: `[url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>`+
`[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i]Ваш аккаунт был разблокирован.<br>В случае, если вы не смените никнейм за 24 часа, ваш игровой аккаунт будет заново заблокирован<br><br>[/CENTER]`+
            `[CENTER][COLOR=orange]На рассмотрении.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `-----------------------------------------------------Перенаправления-----------------------------------------------------`,
        },
        {
            title: `Передано ГА`,
            content: `[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Ваше обжалование передано Главному администратору [user=731908]Nikita Oleshov[/user].<br>Просьба не создавать дубликатов темы<br><br>`+
            `[color=red]На рассмотрениии...[/color][/i][/b][/center][/font]`,
            prefix: GA_PREFIX,
            status: true
        },
        {
            title: `В нужный раздел`,
            content: `[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Перенаправляю вашу тему в нужный раздел.<br>Ожидайте ответа.<br><br>`+
            `[color=gray]Ожидание...[/color][/i][/b][/center][/font]`,
            prefix: WAIT_PREFIX,
            status: false,
        },
        {
            title: `Жалобу на теха`,
            content: `[center][color=red][font=georgia][size=4]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[i][b]Напишите жалобу в технический раздел [URL=https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9677-kostroma.3428/]*Кликабельно*[/url].<br><br>`+
            `[color=red]Закрыто.[/color][/b][/i][/font][/center]`,
            prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: `Передано РМ`,
            content: `[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Ваше обжалование передано Руководителю модерации.<br>Просьба не создавать дубликатов темы<br><br>`+
            `[color=red]На рассмотрениии...[/color][/i][/b][/center][/font]`,
            prefix: COMMAND_PREFIX,
            status: true
        },
        {
            title: `В обж`,
            content: `[center][color=red][font=georgia][size=4]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[i][b]Если вы согласны с наказанием, напишите обжалование.<br><br>`+
            `[color=red]Закрыто.[/color][/b][/i][/font][/center]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Спецам`,
            content: `[center][color=red][font=georgia][size=4]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[i][b]Передано специальной адмиинистрации.<br><br>`+
            `[color=orange]На рассмотрении...[/color][/b][/i][/font][/center]`,
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
            title: `----------------------------------------------Отсутствие пункта жалоб/обж (тестовый)---------------------------------------------`,
        },
        {
            title: `Прикрепите ссылку ВК`,
            content: `[center][color=rgb(255,0,0)][size=4][font=georgia]Здравствуйте, уважаемый [/color]${user.mention}[/size]<br><br>`+
            `[b][i][center]Прикрепите ссылку на ваш ВК в новой теме[/center]<br><br>`+
            `[center][color=rgb(255,0,0)]Закрыто.[/color][/center][/i][/b][/font]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Дубликат`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Ответ уже был дан в прошлой теме. Просьба не создавать дубликаты темы.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Не работают доказательства`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Ваши доказательства не работают.<br>Попробуйте залить в другой хостинг.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Прикрепите доказательства`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Прикрепите доказательства в новой теме.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `По форме`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Напишите обжалование по форме.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Ошиблись разделом!`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Ошиблись разделом! Напишите тему в другой раздел.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Нет наказаний`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]У вас нет активного наказания, соответственно обжалование невозможно<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `От 3 лица`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Ваша жалоба/обжалование написано от 3-го лица.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Доказательсва с соц. сетей`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]Доказательства были загружены на соц. сеть.<br>Загрузите пожалуйста в фото или видеохостинг<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Аккаунт не в бане`,
            content: `[url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>`+
            `[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Ваш аккаунт не в блокировке!<br><br>`+
            `[color=red]Закрыто.[/color][/i][/b][/center][/font]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Окно бана`,
            content: `[font=georgia][color=rgb(255,0,0)][size=4][center]Здравствуйте, уважаемый[/color] ${user.mention}.[/center]<br><br>`+
            `[center][b][i]Прикрепите окно вашего бана в новой теме[/center]<br><br>`+
            `[center][color=rgb(255,0,0)] Закрыто.[/color][/center][/i][/b][/size][/font]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Уже 3+ обж`,
            content: `[font=georgia][color=rgb(255, 0, 0)][size=4][center]Здравствуйте, уважаемый [/color] ${user.mention}.[/center]<br><br>`+
            `[center][b][i]Вы уже обжалование несколько раз, мы не готовы обжаловать его заново [/center]<br><br>`+
            `[center][color=rgb(255, 0, 0)] Закрыто.[/color][/center][/i][/b][/size][/font]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
           title: `------------------------------------------------------------Префиксы--------------------------------------------------------------`,
        },
        {
            title: `Закрыто`,
            content: ``,
            prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: `Одобрено`,
            content: ``,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `На рассмотрении`,
            content: ``,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Никите`,
            content: ``,
            prefix: GA_PREFIX,
            status: false,
        },
        {
            title: `Ростику`,
            content: ``,
            prefix: SPECIAL_PREFIX,
            status: false,
        },
        {
            title: `КП`,
            content: ``,
            prefix: COMMAND_PREFIX,
            status: false,
        },
        {
            title: `----------------------------------------------Раздел жалоб (тестовый)---------------------------------------------`,
        },
        {
            title: `На рассмотрении`,
            content: `[center][color=red][font=georgia][size=4]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i]Ваша жалоба взята [color=orange]на рассмотрение[/color].<br>Просьба не создавать дубликатов данной темы.<br><br>`+
            `[color=orange]На рассмотрении...[/color][/i][/b][/font][/center]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Есть опра`,
            content: `[center][color=red][font=georgia][size=4]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i]Администратор предоставил доказательства.<br>Наказание выдано [color=red]верно![/color]<br><br>`+
            `[color=red]Закрыто.[/color][/i][/b][/font][/center]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Администратор наказан`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]С администратором будет проведена беседа.<br>[/CENTER]`+
            `[CENTER][COLOR=rgb(97,189,109)]Закрыто.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Администратор наказан (наказание будет снято)`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]С администратором будет проведена беседа.<br>[/CENTER]`+
            `[CENTER]Ваше наказание будет снято в течении дня, если оно еще не снято.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(97,189,109)]Закрыто.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Администратор наказан (наказание уже снято)`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]С администратором будет проведена беседа.<br>[/CENTER]`+
            `[CENTER]Ваше наказание было снято.<br><br>[/CENTER]`+
            `[CENTER][COLOR=rgb(97,189,109)]Закрыто.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `48 часов`,
            content: `[center][color=red][size=4][font=georgia]Здравствуйте, уважаемый[/color] ${user.mention}[/size]<br><br>`+
            `[b][i][CENTER]С момента получения наказания прошло более 48 часов, невозможно рассмотреть жалобу.<br>[/CENTER]`+
            `[CENTER]Но, если вы считаете свое наказание верным, и хотите снизить/снять наказание, попробуйте подать в обжалование.<br><br>[/CENTER]`+
            `[CENTER][COLOR=red]Закрыто.[/COLOR][/CENTER][/FONT][/b][/i]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Передано ГА`,
            content: `[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Ваша жалоба передано Главному администратору [user=731908]Nikita Oleshov[/user].<br>Просьба не создавать дубликатов темы<br><br>`+
            `[color=red]На рассмотрениии...[/color][/i][/b][/center][/font]`,
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: `Передано ОЗГА`,
            content: `[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Ваша жалоба передано Основному заместителю Главного администратора [user=96976]Itsuki Liquid[/user].<br>Просьба не создавать дубликатов темы<br><br>`+
            `[color=red]На рассмотрениии...[/color][/i][/b][/center][/font]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Передано ЗГА`,
            content: `[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Ваша жалоба передано Заместителю Главного администратора [user=116523]Scally Angelo[/user].<br>Просьба не создавать дубликатов темы<br><br>`+
            `[color=red]На рассмотрениии...[/color][/i][/b][/center][/font]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Забанен техом`,
            content: `[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Ваша аккаунт был передан Техническому специалисту для дополнительной проверки.<br>Если нарушений не будет найдено, ваш аккаунт будет разблокирован.<br><br>`+
            `[color=red]Закрыто.[/color][/i][/b][/center][/font]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Нет нарушений`,
            content: `[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Не нашел тут нарушений<br><br>`+
            `[color=red]Закрыто.[/color][/i][/b][/center][/font]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Доказательства отредактированы`,
            content: `[center][size=4][font=georgia][color=rgb(255,0,0)]Здравствуйте, уважаемый [/color] ${user.mention} [/center]<br><br>`+
            `[center][b][i]Ваши доказательства отредактированы [/center]<br><br>`+
            `[center][color=rgb(255,0,0)]Закрыто [/color][/center][/i][/b][/font][/size]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Test`,
            content: `[url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>`+
`[font=georgia][center][size=4][color=red]Здравствуйте, уважаемый[/color] ${user.mention}.[/size]<br><br>`+
            `[b][i]Спасибо, что польузетесь мои скриптом!<br><br>`+
            `[color=red]Закрыто.[/color][/i][/b][/center][/font]`,
            prefix: CLOSE_PREFIX,
            status: false,
},
    ];
       $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок над промтом пользователя (в экран)
           addButton(`На рассмотрении`, `wait`);
           addButton(`Отказано`, `declined`);
           addButton(`Жалобу на адм`, `toADM`);
           addButton(`Жалобу на теха`, `toTech`);
           addButton(`Данный вид наказ. не обж.`, `cantRedundant`);
           addButton(`Пусть обманутая напишет`, `letScammedType`);
           addButton(`Одобрено (сокращение)`, `acceptedParticuar`);
           addButton(`Одобрено`, `accepted`);
           addButton(`Великому Никите`, `toGA`);
           addButton(`По форме`, `withForm`);
           addButton(`Перенаправление`, `redirect`);
           addButton(`Панель управления`, `selectAnswer`);


        // Информация о теме (префикс, закреплен/незакреплен)
        const threadData = getThreadData();

        // pasteContent раздел - раздел, занимающийся с отправкой сообщения
           $(`button#wait`).click(() => pasteContent(2, threadData, true));
           $(`button#acceptedParticuar`).click(() => pasteContent(3, threadData, true));
           $(`button#accepted`).click(() => pasteContent(4, threadData, true));
           $(`button#declined`).click(() => pasteContent(5, threadData, true));
           $(`button#toADM`).click(() => pasteContent(6, threadData, true));
           $(`button#toTech`).click(() => pasteContent(13, threadData, true));
           $(`button#toGA`).click(() => pasteContent(11, threadData, true));
           $(`button#cantRedundant`).click(() => pasteContent(7, threadData, true));
           $(`button#letScammedType`).click(() => pasteContent(8, threadData, true));
           $(`button#withForm`).click(() => pasteContent(22, threadData, true));
           $(`button#redirect`).click(() => pasteContent(12, threadData, false));

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
            5 < hours && hours <= 11
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

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }






    // Раздел для счета префиксом (НЕ ТРОГАТЬ)
    var titles = document.getElementsByClassName('structItem-title');
    var count_ojidanie = 0;
    var count_ga = 0;
    var count_na_rassmotrenii = 0;
    var count_sa = 0;

    for (var i = 0; i < titles.length; i++) {
        var prefix_ojidanie = titles[i].querySelector('.labelLink .label--silver');
        if (prefix_ojidanie && prefix_ojidanie.textContent.trim() === 'Ожидание') {
            count_ojidanie++;
        }
        var prefix_ga = titles[i].querySelector('.label.label--red');
        if (prefix_ga && prefix_ga.textContent.trim() === 'Главному администратору') {
            count_ga++;
        }
        var prefix_na_rassmotrenii = titles[i].querySelector('.label.label--orange');
        if (prefix_na_rassmotrenii && prefix_na_rassmotrenii.textContent.trim() === 'На рассмотрении') {
            count_na_rassmotrenii++;
        }
        var prefix_sa = titles[i].querySelector('.label.label--accent');
        if (prefix_sa && prefix_sa.textContent.trim() === 'Специальному администратору') {
            count_sa++;
        }
    }

    function getColor(count) {
        if (count<=0) {
            return "white";
        } else if (count>0 && count < 7) {
            return 'lime';
        } else if (count >= 7 && count < 15) {
            return 'orange';
        } else if (count>=16 && count<30) {
            return 'red';
        } else if (count >= 30){
            return `black`;
        }
    }

    var headers = document.getElementsByClassName('block-minorHeader uix_threadListSeparator');
    if (headers.length > 0) {
        var firstHeader = headers[0];
        var secondHeader = headers[1];

        var countElementGA = document.createElement('span');
        countElementGA.style.marginLeft = '10px';
        countElementGA.style.fontSize = '1.4rem';
        countElementGA.style.color = getColor(count_ga);
        countElementGA.textContent = 'Глав.Админу: ' + count_ga + ' ||';

        var countElementNaRassmotrenii = document.createElement('span');
        countElementNaRassmotrenii.style.marginLeft = '10px';
        countElementNaRassmotrenii.style.fontSize = '1.4rem';
        countElementNaRassmotrenii.style.color = getColor(count_na_rassmotrenii);
        countElementNaRassmotrenii.textContent = 'На рассмотрении: ' + count_na_rassmotrenii + ' ||';

        var countElementSA = document.createElement('span');
        countElementSA.style.marginLeft = '10px';
        countElementSA.style.fontSize = '1.4rem';
        countElementSA.style.color = getColor(count_sa);
        countElementSA.textContent = 'Спец.Админу: ' + count_sa;

        var arrowIcon = firstHeader.querySelector('.uix_threadCollapseTrigger');
        firstHeader.insertBefore(countElementGA, arrowIcon);
        firstHeader.insertBefore(countElementNaRassmotrenii, arrowIcon);
        firstHeader.insertBefore(countElementSA, arrowIcon);

        var countElementOjidanie = document.createElement('span');
        countElementOjidanie.style.marginLeft = '10px';
        countElementOjidanie.style.fontSize = '1.4rem';
        countElementOjidanie.style.color = getColor(count_ojidanie);
        countElementOjidanie.textContent = 'Ожидание: ' + count_ojidanie;

        arrowIcon = secondHeader.querySelector('.uix_threadCollapseTrigger');
        secondHeader.insertBefore(countElementOjidanie, arrowIcon);
    }
})();