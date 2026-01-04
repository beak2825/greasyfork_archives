// ==UserScript==
// @name         Granat | ARZAMAS
// @namespace    https://forum.blackrussia.online
// @version      0.1
// @description  Для руководства (Кураторы +)
// @author       Cobra_Grant
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        Cobra_Grant
// @license      Cobra_Grant
// @collaborator Cobra_Grant
// @icon         https://i.postimg.cc/zGgg7Nnc/image.gif
// @downloadURL https://update.greasyfork.org/scripts/516368/Granat%20%7C%20ARZAMAS.user.js
// @updateURL https://update.greasyfork.org/scripts/516368/Granat%20%7C%20ARZAMAS.meta.js
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
            title: 'Свой ответ (Для префикса "Рассмотрено" & "Закрыто")',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            '[CENTER][SIZE=4][B]Текст[/CENTER][/SIZE][/B]<br>' +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR][/B]<br>' +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR][/B]<unbr><unbr<unbr>' ,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Для своего ответа (сверху)',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #000000; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
          {
            title: 'Для рассмотрения жалобы (снизу)',
            style: 'width: 97%; background: #FBA026; box-shadow: 0px 0px 5px #E25041; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Дублирование',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В предыдущей теме уже был дан ответ.<br>При повторном дублировании ваш форумный аккаунт может быть заблокирован.[/SIZE][/B]<br><br>" +
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
            "[CENTER]Доказательства предоставлены, наказание выдано верно.<br><br>" +
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
            "[CENTER]Наказание будет снято, с администратором проведена работа.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Одобрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Наказание не на нашем сервере',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Наказание выдано не на нашем сервере. Обратитесь на нужный, где получено наказание, в соотвествующую тему на форуме.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Жалоба составлена не по форме. Подайте новую правильно.[/SIZE][/B][/CENTER] <br><br>" +
            "[CENTER][B][SIZE=4]Правила подачи жалоб - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажми*[/URL][/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Работа с администратором',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]С администратором будет проведена работа и приняты все необходимые меры.<br><br>" +
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
            title: 'Игроку будет выдано наказание',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Игроку будет выдано наказание.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Недостаточно доказательтсв',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Недостаточно доказательств о нарушении. Прикрепите все имеющиеся скриншоты или фрапсы.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Нельзя проверить через логи',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Данное нарушение невозможно проверить с помощью логов. В данной ситуации нужен именно фрапс.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
                {
            title: 'Не подтверждено логами',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Нарушение от игрока не подтвердилось в логах.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Заголовок не по форме',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Заголовок составлен не по форме. Рассмотрению не подлежит. Напишите новую тему правильно.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Нет /time',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]На ваших доказательствах отсутвует /time. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
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
            "[CENTER][B][SIZE=4]Жалоба написана от 3-его лица, а должна быть от 1-го (участника ситуации).[/SIZE][/B][/CENTER] <br><br>" +
            "[CENTER][B][SIZE=4]Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
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
            "[CENTER][B][SIZE=4]Фрапс обрывается, загрузите несколько частей или смените фото/видео хостинг.[/SIZE][/B][/CENTER] <br><br>" +
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
            "[CENTER][B][SIZE=4]Не пытайтесь обмануть администрацию.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Прошло более 48-ми часов (адм)',
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
            "[CENTER][B][SIZE=4]С момента нарушения от игрока прошло более 72-ух часов. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет строки с выдачей наказания',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В доказательствах нет строки с выдачей наказания. Рассмотрению не подлежит.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет окна бана',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В доказательствах должно быть окно блокировки аккаунта при входе в игру.[/SIZE][/B][/CENTER] <br><br>" +
            "[CENTER][B][SIZE=4]Подайту новую тему.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Запрещённые соц. сети',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Доказательтсва из социальных сетей не принимаются/запрещены. Используйте другие фотохостинги.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет доказательтсв',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В вашей теме отсутвуют доказательства.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не работают доказательства',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Доказательства не работают. Проверьте правильность ссылки, откройте доступ или загрузите на другой фотохостинг.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет нарушений от администратора',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Со стороны администратора нет нарушений.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не написан ник или неверный ник(адм)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Неправильно написан ваш ник или администратора (отсутствует).[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не написан ник или неверный ник(игроки)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Неправильно написан ваш ник или другого игрока (отсутствует).[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Перезагрузите роутер/телефон',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Перезагрузите роутер/телефон или попробуйте воспользоваться VPN.[/SIZE][/B][/CENTER] <br><br>" +
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
            "[CENTER][B][SIZE=4]Ваша жалоба передана [COLOR=red]Заместителю Главного администратора.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
 
        {
            title: 'Передача жалобы ГА',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба передана [COLOR=red]Главному администратору[/COLOR] - @Rage_Exett.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передано Спец. администратору',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваша жалоба передана [COLOR=red]Специальной администрации.[/COLOR][/SIZE][/B]<br><br>" +
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
            "[CENTER]Обжаловано, наказание будет снято.<br><br>" +
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
            title: 'Не подлежит обж',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше наказание не подлежит обжалованию.[/SIZE][/B][/CENTER] <br><br>" +
            "[CENTER][B][SIZE=4]Ознакомьтесь с правилами по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/3429398/']*Нажми*[/URL][/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Обжалование составлено не по форме. Подайте новую тему правильно.[/SIZE][/B][/CENTER] <br><br>" +
            "[CENTER][B][SIZE=4]Правила подачи по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/3429398/']*Нажми*[/URL][/SIZE][/B][/CENTER] <br><br>" +
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
            "[CENTER]В доказательствах прикрепите ссылку на вашу страницу во ВКонтакте. Создайте новую тему правильно.<br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Замена нак на 60 мин дмг',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание будет заменено на деморган (jail) на 60 минут.<br><br>" +
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
            title: 'Замена нак на 120 мин мута',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Ваше наказание будет заменено на блокировку чатов (мут) на 120 минут.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Вынесены из черного списка',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER]Вынесены.<br><br>" +
            '[COLOR=rgb(97, 189, 109)][B]Рассмотрено.[/COLOR]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Смена ника',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]У вас есть 24 часа на смену игрового никнейма. Если по истечению этого срока вы не измените, то аккаунт будет вновь заблокирован (без возможности обжалования)[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Обж при NonRP обмане',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Обжалование на ваше имя должен писать игрок, которого вы обманули. Повторные темы от Вас будут отказаны.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Обж NonRP обман(игрок пишет с другого форумного аккаунта)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]На вашем Форумном аккаунте не найдена жалоба на данного игрока. Не пытайтесь обмануть администрацию.[/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Обж NonRP обман (нет переписки с игроком о возврате имущества)',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]В предоставленных доказательтсвах нет переписки с игроком, который вас обманул. Подайте повторную тему с исправлением недочетов.[/SIZE][/B][/CENTER] <br><br>" +
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
            title: 'Передача обж Главному Администратору',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше обжалование передано [COLOR=red]Главному администратору[/COLOR] - @Rage_Exett.[/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передача обж Руководителю Модераторов',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше обжалование передано [COLOR=blue]Руководителю Модераторов дискорда.[/COLOR][/SIZE][/B]<br><br>" +
            '[COLOR=rgb(243, 121, 52)][B]На рассмотрении.[/COLOR]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передача обж Специальной Администрации',
            content:
            '[CENTER][B][SIZE=4][COLOR=rgb(247, 218, 100)]Доброго времени суток.[/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше обжалование передано [COLOR=red]Специальной Администрации.[/COLOR][/SIZE][/B]<br><br>" +
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
            "[CENTER][B][SIZE=4]Если вы не согласны с выданным наказанием - обратитесь в раздел жалоб на администрацию по ссылке - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1529/']*Нажми*[/URL][/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на игроков',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Раздел не предназначен для подобных тем - обратитесь в жалобы на игроков по ссылке - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1531/']*Нажми*[/URL][/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на лидеров',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Данный игрок является лидером какой-либо фракции - обратитесь в жалобы на лидеров по ссылке - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1530/']*Нажми*[/URL][/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В обжалование наказаний',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Если вы признаете вину и хотите снять/снизить наказание, то обратитесь в обжалование наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1528/']*Нажми*[/URL][/SIZE][/B][/CENTER] <br><br>" +
            '[COLOR=rgb(226, 80, 65)][B]Закрыто.[/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В технический раздел',
            content:
            '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток.[/B][/COLOR]<br><br>' +
            "[CENTER][B][SIZE=4]Ваше наказание выдано Техническим Специалистом, обратитесь в раздел жалоб на Технических Специалистов - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9633-arzamas.1501/']*Нажми*[/URL][/SIZE][/B][/CENTER] <br><br>" +
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
        addButton('Рассмотрено', 'RASSMOTRENO', 'background: #61BD6D; border: 3px solid #000000; border-radius: 10px');
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
})();