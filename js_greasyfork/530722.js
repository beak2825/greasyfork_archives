// ==UserScript==
// @name         Sokol
// @namespace    https://forum.blackrussia.online
// @version      Beta 5.1
// @description  Личный
// @author       Aleksey_Sokolov
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @Sokol        Aleksey_Sokolov
// @license      To use the manual for server 33 "ARZAMAS"
// @collaborator Aleksey_Sokolov
// @icon         https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/530722/Sokol.user.js
// @updateURL https://update.greasyfork.org/scripts/530722/Sokol.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
    const PINN_PREFIX = 2; // Prefix that will be set when thread pins
    const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
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
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            '[CENTER][SIZE=4][B]Текст[/CENTER][/SIZE][/B]<br>' +
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
            title: 'Дублирование',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Дублирование в предедущей теме уже был дан ответ. <br>При повторном дублировании ваш форумный аккаунт может быть заблокирован.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Запрошу док-ва',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Запрошу доказательства у администратора.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Выдано верно',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Доказательства вашего нарушения предоставлены, наказание выдано верно.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Выдано не верно',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Наказание будет снято.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Выдано не верно + работа с администратором',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Наказание будет снято, с администратором будет проведена работа.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Наказание не на нашем сервере',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание выдано не на нашем сервере. Обратитесь на сервер, где вам выдали наказание, в соотвествующую тему на форуме.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Не по форме. Жалоба рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            "[CENTER][B][SIZE=4]Ознакомьтесь с правилами подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*кликабельно*[/URL][/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Работа с администратором',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]В сторону администратора будет проведена работа.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Взятие темы на рассмотрение',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша тема взята на рассмотрение руководством сервера, ожидайте вердикта.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Жалобы на игроков и администрацию',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Игроку будет выдано наказание(нет сути какое наказание)',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Игроку будет выдано наказание.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Недостаточно доказательтсв (ЛД)',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Недостаточно доказательств о нарушении лидера, на предоставленных вами доказательствах.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Нельзя проверить через логи',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Данное нарушение нельзя проверить с помощью логов. В данной ситуации нужен именно фрапс.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
                {
            title: 'Не подтверждено логами',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Нарушение со стороны игрока, не подтверждено логами.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Заголовок не по форме',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Заголовок не по форме. Рассмотрению не подлежит.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Нет /time',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей жалобе отсутвует /time. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет /myreports',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей жалобе отсутвует /myreports. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Жалоба от 3-его лица',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Жалоба написана от 3-его лица. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нужен фрапс',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В данной ситуации нужен фрапс.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
          {
            title: 'Фрапс обрывается',
            content:
             '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]На предоставленых доказательтсвах нет полного фрапса, возможно полный фрапс не совместим с хостингом. Попробуйте сменить хостинг.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Док-ва отредактированы',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Доказательтсва, которые вы предоставили - отредактированы. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Прошло более 48-ми часов(адм)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]С момента выдачи наказания прошло более 48-ми часов. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Прошло более 72-ух часов(игроки)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]С момента нарушения игрока прошло более 72-ух часов. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет строки с выдачей наказания',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Нет строки с выдачей наказания. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет окна бана',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Нет окна блокировки вашего аккаунта. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Запрещённые соц. сети',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Доказательтсва из социальных сетей не рассматриваются. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет доказательтсв',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей теме отсутвуют доказательства, Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не работают доказательства',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей теме доказательства нерабочие, проверте правильность ссылки или смените фотохостинг.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет нарушений от администратора',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Нет нарушений со стороны администратора.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не написан ник или неверный ник(адм)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Неправильно написан ваш Nick|Nick администратора. Либо ник во все отсутсвует.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не написан ник или неверный ник(игроки)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Неправильно написан ваш Nick/Nick другого игрока. Либо ник во все отсутсвует.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Перезагрузите роутер/телефон',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Перезагрузите ваш роутер | телефон, или попробуйте воспользоваться VPN.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передача жалоб',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Передача жалобы ЗГА',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба была передана [COLOR=red]Заместителю Главного администратора.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },

        {
            title: 'Передача жалобы ГА',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба была передана [COLOR=red]Главному администратору[/COLOR] - @Rage_Exett.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передано Спец. администратору',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба была передана [COLOR=red]Специальной администрации.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: SPECY_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Обжалование наказаний',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
         {
            title: 'Обжаловано',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Наказание будет снято.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Отказ в обжаловании',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Обжаловано не будет.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не подлежит рассмотрению',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Наказание, выданое вам, не подлежит рассмотрению.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Не по форме. Обжалование рассмотрению не подлежит. [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не готовы снять/снизить',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Руководство сервера не готово вам снять | снизить ваше наказание.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет док-в',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей теме отсутвуют доказательства.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание уже обжаловано',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание уже было обжаловано.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Ссылка на ВКонтакте(Если в доказательтсвах нет)',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Нет доказательтсв, укажите вашу ссылку на страницу Вконтакте в новой теме.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание снижено до 30 дней бана',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание будет снижено до 30 дней блокировки игрового аккаунта.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание снижено до 15 дней бана',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание будет снижено до 15 дней блокировки игрового аккаунта.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание снижено до 7 дней бана',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание будет снижено до 7 дней блокировки игрового аккаунта.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Вынесены из черного списка',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Вынеc вас с чёрного списка.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Смена ника(при оскорблени  в нике)',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]У вас есть 24 часа на смену игрового никнейма. Если по истечению этого срока вы не измените никнейм ваш аккаунт будет вновь заблокирован, без возможности обжалования.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Обжалование при NonRP обмане',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Обжалование на ваше имя должен писать игрок, которого вы обманули. Повторные темы от вас будут отказаны.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Обжалование NonRP обман(игрок пишет с другого форумного аккаунта)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Проверив ваш форумный аккаунт, не увидел жалобу на данного игрока. Не пытайтесь обмануть администрацию.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Обжалование NonRP обман(нет переписки с игроком о возврате имущества)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В предоставленных вами доказательтсвах не увидел переписки с игроком, который вас обманул. Подайте повторную тему с исправлением всех недочетов при обжаловании.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передача на рассмотрение обжалований',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Передача обжалования Главному Администратору',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше обжалование было передано [COLOR=red]Главному администратору[/COLOR] - @Rage_Exett.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передача обжалования Руководителю Модераторов',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше обжалование было передано [COLOR=blue]Руководителю Модераторов Discord.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передача обжалования Специальной Администрации',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше обжалование было передано [COLOR=red]Специальной Администрации.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: SPECY_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Перенаправление в другие разделы',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'В жалобы на администрацию',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Если вы не согласны с наказанием выданым администратором - обратитесь в раздел жалоб на администрацию. [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1529/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на игроков',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Раздел не предназначен для подобных тем - обратитесь в жалобы на игроков. [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1531/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на лидеров',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Данный игрок является лидером какой-либо фракции - обратитесь в жалобы на лидеров. [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1530/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В обжалование наказаний',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Обратитесь в обжалование наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1528/']*кликабельно*[/URL].[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В технический раздел',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше наказание выдано Техническим Специалистом, обратитесь в раздел жалоб на Технических Специалистов - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9633-arzamas.1501/']*кликабельно*[/URL]. [/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
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

        // Поиск информации о теме
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
})