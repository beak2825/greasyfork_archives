// ==UserScript==
// @name         Grant's - Nikolay and Nunzio
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Личный
// @author       Nunzio_Grant
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        Nunzio_Grant
// @license      Personal use for Nunzio_Grant and Nikolay_Grant. Any other users are not legal
// @collaborator Grant's
// @icon         https://yapx.ru/album/YXZ5M
// @downloadURL https://update.greasyfork.org/scripts/524438/Grant%27s%20-%20Nikolay%20and%20Nunzio.user.js
// @updateURL https://update.greasyfork.org/scripts/524438/Grant%27s%20-%20Nikolay%20and%20Nunzio.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const UNACCСEPT_PREFIX = 4; 
    const ACCСEPT_PREFIX = 8; 
    const RESHENO_PREFIX = 6; 
    const PINN_PREFIX = 2; 
    const GA_PREFIX = 12; 
    const COMMAND_PREFIX = 10; 
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECY_PREFIX = 11;
    const TEXY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const VAJNO_PREFIX = 1;
    const PREFIKS = 0;
    const KACHESTVO = 15;
    const RASSMOTRENO_PREFIX = 9;
    const NARASSMOTRENIIRP_PREFIX = 2;
    const buttons = [
        {
            title: 'Свой ответ(Для префикса "Рассмотрено" & "Закрыто")',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG]' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            '[CENTER][B]Текст[/CENTER][/B]<br>' +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR][/B]<br>' +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR][/B]<unbr><unbr<unbr>' ,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Для своего ответа(сверху)',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #000000; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
          {
            title: 'Для рассмотрения жалобы(снизу)',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #E25041; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'На рассмотрение',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B]Ваша жалоба взята на рассмотрение. Ожидайте выноса вердикта.[/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR] <unbr><unbr><unbr><unbr>',
            prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Дублирование',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Дублирование предыдущей темы.<br>При повторном дублировании ваш форумный аккаунт может быть заблокирован.[/B]<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Доказательств недостаточно',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Доказательств, предоставленных Вами, недостаточно. Если у вас имеются более весомые доказательства, предоставьте их в следующей жалобе.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Доказательства нерабочие',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Доказательства, предоставленные Вами, не работают или Вы предоставили битую ссылку.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Док-ва отредактированы',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Доказательства, которые вы предоставили - отредактированы. Рассмотрению не подлежит.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Игрок будет наказан',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Игроку будет выдано наказание.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Нарушение не на нашем сервере',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Игрок нарушил регламент проекта не на нашем сервере. Обратитесь на сервер, где Вы заметили нарушение, в соответствующую тему на форуме.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Не по форме. Жалоба рассмотрению не подлежит.[/B][/CENTER] <br><br>" +
            "[CENTER][B]Ознакомьтесь с правилами подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']*кликабельно*[/URL][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
 {
            title: 'Нельзя проверить через логи',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Данное нарушение нельзя проверить с помощью логов. В данной ситуации нужен именно фрапс.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Не подтверждено логами',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Нарушение со стороны игрока, не подтверждено логами.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Заголовок не по форме',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Заголовок не по форме. Рассмотрению не подлежит.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Нет /time',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]В вашей жалобе отсутвует /time. Рассмотрению не подлежит.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет /myreports',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей жалобе отсутвует /myreports. Рассмотрению не подлежит.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Жалоба от 3-его лица',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Жалоба написана от 3-его лица. Рассмотрению не подлежит.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нужен фрапс',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]В данной ситуации нужен фрапс.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Фрапс обрывается',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]На предоставленных доказательствах нет полного фрапса, возможно полный фрапс не совместим с хостингом. Попробуйте сменить хостинг.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Прошло более 72-ух часов',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]С момента нарушения игрока прошло более 72-ух часов. Рассмотрению не подлежит.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Запрещённые соц. сети',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Доказательтсва из социальных сетей не рассматриваются. Рассмотрению не подлежит.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не написан ник или неверный ник',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Неправильно написан ваш ник/ник другого игрока. Либо ник во все отсутсвует.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передача жалобы',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Передача жалобы Теху',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][B][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B]Ваша жалоба была передана [COLOR=blue]Техническому специалисту.[/COLOR][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: TEXY_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Перенаправление в другие разделы',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'В жалобы на администрацию',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Если вы не согласны с наказанием выданым администратором - обратитесь в раздел жалоб на администрацию.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на лидеров',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Данный игрок является лидером какой-либо фракции - обратитесь в жалобы на лидеров.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В обжалование наказаний',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Обратитесь в обжалование наказаний.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В технический раздел',
            content:
            '[CENTER][IMG width="235px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG] <br>' +
            '[HR][/HR]' +
            '[CENTER][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B]Ваше наказание выдано Техническим Специалистом, обратитесь в раздел жалоб на Технических Специалистов.[/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
    ];
 
    $(document).ready(() => {
       
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'background: #F37934; border: 3px solid #000000; border-radius: 10px');
        addButton('Важно', 'Vajno', 'background: #FF0000; border: 3px solid #000000; border-radius: 10px');
        addButton('Главному администратору', 'Ga', 'background: #FF0000; border: 3px solid #000000; border-radius: 10px');
        addButton('Специальной администрации', 'Spec', 'background: #FF0000; border: 3px solid #000000; border-radius: 10px');
        addButton('Рассмотрено', 'Rassmotreno', 'background: #61BD6D; border: 3px solid #000000; border-radius: 10px');
        addButton('Закрыто', 'Zakrito', 'background: #E25041; border: 3px solid #000000; border-radius: 10px');
        addButton('Ожидание', 'Ojidanie', 'background: #CCCCCC; border: 3px solid #000000; border-radius: 10px');
        addAnswers();
 
        
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
        $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
        $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
        $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
        $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
        $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
        $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
        $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
 
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
        $(`button#Info`).click(() => {
            XF.alert(infoAlert(), null, 'Информация:');
        });
    });
 
    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; ${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 25px; border: 3px solid; border-radius: 25px; background: #FAC51C; padding: 0px 27px 0px 27px; font-family: JetBrains Mono; border-color: #000000;">ОТВЕТЫ</button>`,
                                       );
    }
 
    function buttonsMarkup(buttons) {
        return `<div class="select_answer" style="display:flex; flex-direction:row; flex-wrap:wrap">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; ${btn.style}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function infoAlert() {
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
            6 < hours && hours <= 11 ?
            'Доброе утро' :
            12 < hours && hours <= 17 ?
            'Добрый день' :
            18 < hours && hours <= 23 ?
            'Добрый вечер' :
            0 < hours && hours <= 5 ?
            'Доброй ночи' :
            'Доброй ночи',
        };
    }
 
    function editThreadData(prefix, pin = false) {
        
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