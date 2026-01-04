// ==UserScript==
// @name         Chelyabinsk | Скрипт для технических специалистов
// @namespace    https://forum.blackrussia.online
// @version      0.1.5
// @description  -
// @author       Johnathan Kingsman
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      none
// @copyright    2025,
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/532706/Chelyabinsk%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/532706/Chelyabinsk%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const PIN_PREFIX = 2; // На рассмотрение
    const TECH_PREFIX = 13; // Тех. специалисту
    const KP_PREFIX = 10; // Команде проекта
    const WATCHED_PREFIX = 9; // Рассмотрено
    const DECIDED_PREFIX = 6; // Решено
    const UNACCEPT_PREFIX = 4 // Отказано
    const CLOSE_PREFIX = 7; // Закрыто
    const EXPECTATION_PREFIX = 14 // Ожидание
  
    const START_COLOR_1 = `<font color=#FFB6C1>`
    const START_COLOR_2 = `<font color=#FFFAFA>`
    const END_COLOR = `</font>`
 
    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Times New Roman';font-size: 14px">`
    const END_DECOR = `</span></div>`

    const buttons = [
        {
            title: 'Приветствие',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
            `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Покупка ИВ (банк)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}На ваш банковский счёт была переведена игровая валюта от игрока, известного как продавец игровой валюты.<br>Спустя некоторое время вы сняли эту игровую валюту с банковского счета, что и было ожидаемо, так как Вы знали о переводе.<br>Отсутствие каких либо договорённостей и взаимодействий до и после этого момента подтверждают тот факт, что денежные средства были получены в ходе их покупки за реальные деньги.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вставляю Вам строчку из системы логирования:<br><br>[CODE]*строчка*[/CODE]${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Покупка ИВ (трейд)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы получили игровую валюту от игрока, известного как продавец игровой валюты через систему трейда.<br>До этого момента между вами не было никаких взаимодействий, так как вы не знаете этого игрока и договаривались встретиться с ним вне игры.<br>Помимо этого между вами не было никаких обсуждений и договорённости в момент получения игровой валюты, что и подтверждает тот факт, что денежные средства были получены в ходе их покупки за реальные деньги.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вставляю Вам строчку из системы логирования:<br><br>[CODE]*строчка*[/CODE]${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Покупка ИВ (бот)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}На ваш банковский счёт была переведена игровая валюта от ботовода.<br>Спустя некоторое время вы сняли эту игровую валюту с банковского счета, что и было ожидаемо, так как Вы знали о переводе, именно это и стало причиной Вашей блокировки.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вставляю Вам строчку из системы логирования:<br><br>[CODE]*строчка*[/CODE]${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: '======================================> ЛОГИСТАМ <======================================',
            color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'На рассмотрение',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема взята${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Передать ЗКТС / КТС',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема передана руководству технических специалистов${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Передать тестерам',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема передана${END_COLOR} ${START_COLOR_1}на тестирование${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: EXPECTATION_PREFIX,
             status: false,
             open: true,
             move: 917,
        },
        {
            title: 'Передать КП',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема передана команде проекта${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: KP_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Не по форме (жб на техов)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша жалоба составлена${END_COLOR} ${START_COLOR_1}не по форме${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ознакомиться с правилами раздела жалоб на технических специалистов можно в этой теме — *<a href="https://forum.blackrussia.online/threads/Шаблон-для-подачи-жалобы-на-технического-специалиста.11906522/">Кликабельно</a>*.<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Не по теме (жб на техов)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема${END_COLOR} ${START_COLOR_1}не относится${END_COLOR} ${START_COLOR_2}к разделу жалоб на технических специалистов.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ознакомиться с правилами раздела жалоб на технических специалистов можно в этой теме — *<a href="https://forum.blackrussia.online/threads/Шаблон-для-подачи-жалобы-на-технического-специалиста.11906522/">Кликабельно</a>*.<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Срок подачи жб на теха',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}С момента выдачи наказания техническим специалистом прошло${END_COLOR} ${START_COLOR_1}более 14 дней${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В настоящий момент пересмотр решения о блокировке аккаунта невозможен, однако Вы можете попробовать написать обжалование через некоторый промежуток времени.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Нет окна блокировки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Жалоба без прикрепленного скриншота окна блокировки игрового аккаунта рассмотрению${END_COLOR} ${START_COLOR_1}не подлежит${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Не подлежит обжалованию',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Выданное вам наказание обжалованию${END_COLOR} ${START_COLOR_1}не подлежит${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Доква в соц. сетях',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Загрузка доказательств в социальные сети (VK, Instagram и т.д.)${END_COLOR} ${START_COLOR_1}запрещена${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Воспользуйтесь фото / видео - хостингом (например: Imgur, Япикс и т.д.).${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Доква отредактированы',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Жалобы с отредактированными доказательствами рассмотрению${END_COLOR} ${START_COLOR_1}не подлежат${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Доква подделаны',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваши доказательства${END_COLOR} ${START_COLOR_1}подделаны${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваш форумный аккаунт будет заблокирован за подделку доказательств и обман администрации.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Аккаунт будет разблокирован',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}После дополнительного разбора ситуации по Вашей блокировке было принято решение${END_COLOR} ${START_COLOR_1}о разблокировке Вашего аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Приносим извинения за доставленные неудобства.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Запросить привязки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Укажите имеющиеся${END_COLOR} ${START_COLOR_1}привязки${END_COLOR + START_COLOR_2} к игровому аккаунту:${END_COLOR}<br><br>` +
            `${START_COLOR_2}1. VK ID (узнать можно здесь — *<a href="https://regvk.com/">Кликабельно</a>*):${END_COLOR}<br>` +
            `${START_COLOR_2}2. Telegram ID (узнать можно здесь — *<a href="https://t.me/id_users_bot">Кликабельно</a>*):${END_COLOR}<br>` +
            `${START_COLOR_2}3. Email:${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если какие либо привязки отсутствуют поставьте${END_COLOR} ${START_COLOR_1}прочерк${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: TECH_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Указал верные привязки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваш игровой аккаунт будет${END_COLOR} ${START_COLOR_1}разблокирован${END_COLOR} ${START_COLOR_2}в ближайшее время.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Впредь тщательнее относитесь к безопасности своего аккаунта и не допускаете его получения злоумышленниками.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Взломали',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В целях безопасности Ваш игровой аккаунт будет заблокирован с причиной${END_COLOR} ${START_COLOR_1}«Взломан»${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Для восстановления доступа к игровому аккаунту обратитесь в раздел жалоб на технических специалистов.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Взломали и украли имущество',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В целях безопасности Ваш игровой аккаунт будет заблокирован с причиной${END_COLOR} ${START_COLOR_1}«Взломан»${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Аккаунт, на который было передано Ваше имущество будет заблокирован с причиной${END_COLOR} ${START_COLOR_1}"Махинации"${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Для восстановления доступа к игровому аккаунту обратитесь в раздел жалоб на технических специалистов.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Также напомню, что в подобных случаях имущество не восстанавливается.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Перебан на чужую привязку',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}На Вашем игровом аккаунте обнаружена${END_COLOR} ${START_COLOR_1}чужая привязка${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваш игровой аккаунт будет переблокирован с причиной "Чужая привязка", дальнейшее снятие блокировки будет невозможным.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Имущество будет восстановлено',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Имущество будет восстановлено в течение${END_COLOR} ${START_COLOR_1}14 дней${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Убедительная просьба не менять игровой Nickname в течении этого времени. Для активации восстановления воспользуйтесь командами: /roulette, /recovery.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: WATCHED_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Имущество не может быть восстановлено',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Созданная Вами тема не относится к технической проблеме.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ознакомиться с правилами восстановления игровых ценностей можно в этой теме — *<a href="https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B2%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D1%8B%D1%85-%D1%86%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9.11906607/unread">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Репутация семьи будет обнулена (жб на игроков)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}После проверки доказательств и системы логирования, было принято решение , что репутация семьи${END_COLOR} ${START_COLOR_1}будет обнулена${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: WATCHED_PREFIX,
            status: false,
            open: false,
            move: 0,
        },
        {
            title: 'Игрок будет заблокирован (жб на игроков)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}После проверки доказательств и системы логирования было принято решение, что игрок${END_COLOR} ${START_COLOR_1}будет заблокирован${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: WATCHED_PREFIX,
            status: false,
            open: false,
            move: 0,
        },
        {
            title: 'Игрок  не будет заблокирован (жб на игроков)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}После проверки доказательств и системы логирования было принято решение, что игрок${END_COLOR} ${START_COLOR_1}не будет заблокирован${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 0,
        },
        {
            title: 'Вам в тех. раздел',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в технический раздел своего сервера — *<a href="https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на адм',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в раздел жалоб на администрацию своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на лд',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в раздел жалоб на лидеров своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на игроков',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в раздел жалоб на игроков своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title:'Вам в обжалования',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в раздел обжалований наказаний своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title:'Вам в тех. поддержку',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Обратитесь в техническую поддержку${END_COLOR} ${START_COLOR_1}BLACK RUSSIA${END_COLOR} ${START_COLOR_2}для последующей консультации.${END_COLOR}<br><br>` +
            `${START_COLOR_2}1. Тех. поддержка (VK) - *<a href="http://vk.com/br_tech">Кликабельно</a>*;<br>2. Тех. поддержка (Telegram) - *<a href="https://t.me/br_techBot">Кликабельно</a>*;<br>3. Тех. поддержка (Сайт)  - *<a href="https://blackrussia.online/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Бан ФА за дубликат',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваш форумный аккаунт будет${END_COLOR} ${START_COLOR_1}заблокирован${END_COLOR} ${START_COLOR_2}за дубликат тем.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: '======================================> ФОРУМНИКАМ <======================================',
            color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Передать логисту',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема передана техническому специалисту по логированию${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: TECH_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Передать тестерам',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема передана${END_COLOR} ${START_COLOR_1}на тестирование${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: EXPECTATION_PREFIX,
             status: false,
             open: true,
             move: 917,
        },
        {
            title: 'Передать КП',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема передана команде проекта${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: KP_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Известно КП',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Команде проекта уже известно${END_COLOR} ${START_COLOR_1}о данной проблеме${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
             title: 'Не баг',
             content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Проблема с которой вы столкнулись${END_COLOR} ${START_COLOR_1}не является${END_COLOR + START_COLOR_2} багом или недоработкой.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {   title: 'Не по форме (тех. раздел)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваше обращение составлено${END_COLOR} ${START_COLOR_1}не по форме${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ознакомиться с правилами технического раздела можно в этой теме — *<a href="https://forum.blackrussia.online/threads/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%B2-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-%D0%B5%D1%81%D0%BB%D0%B8-%D0%BD%D0%B5-%D0%BF%D0%BE-%D1%84%D0%BE%D1%80%D0%BC%D0%B5-%E2%80%94-%D0%BE%D1%82%D0%BA%D0%B0%D0%B7.11906517/unread">Кликабельно</a>*.<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Не по теме (тех. раздел)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема${END_COLOR} ${START_COLOR_1}не относится${END_COLOR} ${START_COLOR_2}к техническому разделу.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ознакомиться с правилами технического раздела можно в этой теме — *<a href="https://forum.blackrussia.online/threads/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%B2-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-%D0%B5%D1%81%D0%BB%D0%B8-%D0%BD%D0%B5-%D0%BF%D0%BE-%D1%84%D0%BE%D1%80%D0%BC%D0%B5-%E2%80%94-%D0%BE%D1%82%D0%BA%D0%B0%D0%B7.11906517/unread">Кликабельно</a>*.<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Срок подачи недоработки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}С момента обнаружения недоработки прошло${END_COLOR} ${START_COLOR_1}более 30 дней${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Нет фото / видео - фиксации',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}К сожалению без наличия фото / видео - фиксации ошибки / недоработки решить проблему${END_COLOR} ${START_COLOR_1}не получится${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Загрузка доказательств',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Для загрузки скриншотов или видеозаписей воспользуйтесь любым удобным для Вас${END_COLOR} ${START_COLOR_1}фото / видео - хостингом${END_COLOR} ${START_COLOR_2}, например: Imgur, Google фото, Япикс и т.д.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Доква в соц. сетях',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Загрузка доказательств в социальные сети (VK, Instagram и т.д.)${END_COLOR} ${START_COLOR_1}запрещена${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Воспользуйтесь фото / видео - хостингом (например: Imgur, Япикс и т.д.).${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Нерабочая ссылка',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ссылка на ваши доказательства${END_COLOR} ${START_COLOR_1}не работает${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Отвязка привязок',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Удаление уже существующих привязок к игровому аккаунту на данный момент${END_COLOR} ${START_COLOR_1}не представляется возможным${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Блокировка по IP',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Блокировка по IP адресу была выдана${END_COLOR} ${START_COLOR_1}не вам.${END_COLOR + START_COLOR_2} Для последующего решения проблемы перезагрузите роутер.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Запросить доп. информацию',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Для дальнейшего рассмотрения темы заполните${END_COLOR} ${START_COLOR_1}форму ниже:${END_COLOR}<br><br>` +
            `${START_COLOR_2}1. Доказательства вашего владения этим имуществом:<br>2. Все детали пропажи (дата, время, действия после которых пропало имущество):<br>3. Информация о том, как вы получили это имущество:${END_COLOR}<br><br>` +
            `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Проблемы с кешем (форум)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если вы столкнулись с проблемой загрузки страниц форума, то выполните${END_COLOR} ${START_COLOR_1}следующие действия${END_COLOR + START_COLOR_2}:${END_COLOR}<br><br>` +
            `${START_COLOR_2}• Откройте Настройки.<br>• Найдите во вкладке Приложения свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите Очистить -> Очистить Кэш.<br><br>После следуйте${END_COLOR} ${START_COLOR_1}данным инструкциям${END_COLOR + START_COLOR_2}:<br>• Перейдите в настройки браузера.<br>• Выберите Конфиденциальность и безопасность -> Очистить историю.<br>• В основных и дополнительных настройках поставьте галочку в пункте Файлы cookie и данные сайтов.<br>После этого нажмите Удалить данные.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Кик за ПО',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если вы были отключены от сервера${END_COLOR} ${START_COLOR_1}античитом${END_COLOR + START_COLOR_2}<br><br>Пример:<br><img src="https://i.ibb.co/FXXrcVS/image.png"><br>Обратите внимания на значения PacketLoss и Ping.<br><br>${END_COLOR + START_COLOR_1}PacketLoss${END_COLOR + START_COLOR_2} - минимальное значение 0.000000, максимальное 1.000000. При показателе выше нуля происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>${END_COLOR + START_COLOR_1}Ping${END_COLOR + START_COLOR_2} - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Для решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
             title: 'Законопослушность',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Администрация, технические специалисты и другие должностные лица на проекте не могут поспособствовать${END_COLOR} ${START_COLOR_1}обнулению законопослушности${END_COLOR + START_COLOR_2}.<br><br>Для повышения законопослушности вы можете воспользоваться одним из трех${END_COLOR} ${START_COLOR_1}доступных способов${END_COLOR + START_COLOR_2}:<br><br>1. Повышение законопослушности через /donate - услуги.<br>2. Повышение законопослушности путем выполнения заказов на работе «Электрик».<br>3. Повышение законопослушности в PayDay.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Баг со штрафами',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}У вас произошла ошибка${END_COLOR} ${START_COLOR_1}со штрафами${END_COLOR + START_COLOR_2}, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Сервер не отвечает',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте выполнить${END_COLOR} ${START_COLOR_1}следующие действия${END_COLOR + START_COLOR_2}:<br><br>• Изменить свой IP - адрес;<br>• Переключиться на Wi-Fi или мобильный интернет;<br>• Включить VPN;<br>• Перезагрузить роутер или интернет.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если методы выше не помогли, то попробуйте переустановить игру.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Проблемы с донатом',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Система построена таким образом, что денежные средства не будут списаны со счета, пока наша платформа не уведомит платежную систему о начислении Black Coins. Для проверки зачисления Black Coins необходимо ввести в игре команду:${END_COLOR} ${START_COLOR_1}/donat${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В остальных же случаях, если не были зачислены Black Coins, то вероятнее всего, была допущена ошибка при вводе реквизитов.<br>В данном случае мы не восстанавливаем денежные средства согласно нашей политике оферты — *<a href="https://blackrussia.online/oferta.php">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 24-х часов, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения — *<a href="https://vk.com/br_tech">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Слетел аккаунт',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Игровой аккаунт не может просто так пропасть. Проверьте правильность введённых данных${END_COLOR} ${START_COLOR_1}(Nickname, Server)${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Хочу занять должность',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Команда технических специалистов${END_COLOR} ${START_COLOR_1}не занимается назначением${END_COLOR + START_COLOR_2} тех или иных лиц на какие либо должности проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Создайте заявление на пост лидера / агента поддержки в разделе своего сервера — *<a href="https://forum.blackrussia.online/forums/%D0%97%D0%90%D0%AF%D0%92%D0%9A%D0%98-%D0%9D%D0%90-%D0%94%D0%9E%D0%9B%D0%96%D0%9D%D0%9E%D0%A1%D0%A2%D0%98-%D0%9B%D0%98%D0%94%D0%95%D0%A0%D0%9E%D0%92-%D0%98-%D0%90%D0%93%D0%95%D0%9D%D0%A2%D0%9E%D0%92-%D0%9F%D0%9E%D0%94%D0%94%D0%95%D0%A0%D0%96%D0%9A%D0%98.3066/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,

        },
        {
            title: 'Предложения по улучшению',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Команда технических специалистов${END_COLOR} ${START_COLOR_1}не занимается рассмотрением${END_COLOR + START_COLOR_2} предложений, связанных с улучшением игрового мода.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Оставить своё предложение вы можете здесь — *<a href="https://forum.blackrussia.online/categories/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE-%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8E.656/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Нужны все детали для прошивки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Для установки прошивки на автомобиль нужно приобрести${END_COLOR} ${START_COLOR_1}все детали${END_COLOR + START_COLOR_2} для ее установки.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Пропали вещи с аукциона',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если вы выставили то или иное имущество на аукцион, а его никто не купил, то воспользуйтесь командой${END_COLOR} ${START_COLOR_1}/reward${END_COLOR + START_COLOR_2}. В случае отсутствия имущества в добыче, пересоздайте тему в техническом разделе.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {   title: 'Вам в жб на техов',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в раздел жалоб на технических специалистов своего сервера — *<a href="https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на адм',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в раздел жалоб на администрацию своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на лд',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в раздел жалоб на лидеров своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на игроков',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в раздел жалоб на игроков своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title:'Вам в обжалования',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом.${END_COLOR + START_COLOR_2}<br>Обратитесь в раздел обжалований наказаний  своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title:'Вам в тех. поддержку',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Обратитесь в техническую поддержку${END_COLOR} ${START_COLOR_1}BLACK RUSSIA${END_COLOR} ${START_COLOR_2}для последующей консультации.${END_COLOR}<br><br>` +
            `${START_COLOR_2}1. Тех. поддержка (VK) - *<a href="http://vk.com/br_tech">Кликабельно</a>*;<br>2. Тех. поддержка (Telegram) - *<a href="https://t.me/br_techBot">Кликабельно</a>*;<br>3. Тех. поддержка (Сайт)  - *<a href="https://blackrussia.online/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Ответ от тестеров в прошлой теме',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В одной из прошлых тем, вы уже${END_COLOR} ${START_COLOR_1}получили ответ${END_COLOR + START_COLOR_2} от представителя отдела тестирования.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Бан ФА за дубликат',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваш форумный аккаунт будет${END_COLOR} ${START_COLOR_1}заблокирован${END_COLOR} ${START_COLOR_2}за дубликат тем.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        }
    ];
        
    const tasks = [
        {
            title: 'В тех. раздел',
            prefix: EXPECTATION_PREFIX,
            status: false,
            open: true,
            move: 2052,
        },
        {
            title: 'В жб на тех. специалистов',
            prefix: EXPECTATION_PREFIX,
            status: false,
            open: true,
            move: 2051,
        },
        {
            title: 'В жб на администрацию',
            prefix: EXPECTATION_PREFIX,
            status: false,
            open: true,
            move: 2078,
        },
        {
            title: 'В жб на лидеров',
            prefix: EXPECTATION_PREFIX,
            status: false,
            open: true,
            move: 2079,
        },
        {
            title: 'В жб на игроков',
            prefix: EXPECTATION_PREFIX,
            status: false,
            open: true,
            move: 2080,
        },
        {
            title: 'В обжалования наказаний',
            prefix: EXPECTATION_PREFIX,
            status: false,
            open: true,
            move: 2081,
        },
        {
            title: 'В заявки с окончательным ответом',
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        }
    ];
    
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

    const Button51 = buttonConfig("Тех. раздел", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-chelyabinsk.2052/');
    const Button52 = buttonConfig("Жб на тех. спецов", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9646-chelyabinsk.2051/');
    const Button53 = buttonConfig("Жб на игроков", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2080/');
    const Button54 = buttonConfig("Правила серверов", 'https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/');
 
    bgButtons.append(Button51);
    bgButtons.append(Button52);
    bgButtons.append(Button53);
    bgButtons.append(Button54);

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #FFA500');
        addButton('Команде проекта', 'kp', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #FFD700');
        addButton('Тех. специалисту', 'tech', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #0000FF');
        addButton('Рассмотрено', 'watch', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #008000');
        addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #008000');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #FF0000');
        addButton('Закрыто', 'close', 'border-radius: 13px; margin-right: 5px; border: 1px solid; background-color: #000000; border-color: #FF0000');
        addMoveTasks();
        addAnswers();
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(0, PIN_PREFIX, true, true));
        $('button#tech').click(() => editThreadData(0, TECH_PREFIX, true, true));
        $('button#kp').click(() => editThreadData(0, KP_PREFIX, true, true));
        $('button#watch').click(() => editThreadData(230, WATCHED_PREFIX, false));
        $('button#decided').click(() => editThreadData(230, DECIDED_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(230, UNACCEPT_PREFIX, false));
        $('button#close').click(() => editThreadData(230, CLOSE_PREFIX, false));
        
        $(`button#selectAnswers`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 4) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    
        $(`button#selectMoveTasks`).click(() => {
            XF.alert(tasksMarkup1(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });
    
    
    function addButton(name, id, hex="grey") {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
        );
    }
    
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Ответы</button>`,
        );
    }
    
    function addMoveTasks() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectMoveTasks" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Перемещение</button>`,
        );
    }
 
    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function tasksMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
    
    function buttonsMarkup1(tasks) {
        return `<div class="select_answer">${tasks
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function tasksMarkup1(tasks) {
        return `<div class="select_answer">${tasks
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
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
            editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
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
 
    function editThreadData(move, prefix, pin = false, open = false) {
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
        } else if(pin == true && open){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    discussion_open: 1,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        } else {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json'
                }),
            }).then(() => location.reload());
        }
        if (move > 0) {
            moveThread(prefix, move);
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