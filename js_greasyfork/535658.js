// ==UserScript==
// @name         BLACK RUSSIA || Скрипт для Руководства Сервера by V.Anonim
// @namespace    https://forum.blackrussia.online
// @version      1.3
// @description  Специально для BlackRussia || by V.Anonim.
// @author       Vlad Anonim
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://ltdfoto.ru/images/2025/03/30/FOTO5ede3108d5ce4811.png
// @grant        none
// @license      none
// @supportURL   https://vk.com/id634241193
// @downloadURL https://update.greasyfork.org/scripts/535658/BLACK%20RUSSIA%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20VAnonim.user.js
// @updateURL https://update.greasyfork.org/scripts/535658/BLACK%20RUSSIA%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20VAnonim.meta.js
// ==/UserScript==
 
(function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const COMMAND_PREFIX = 10; // Префикс "Команде проекта"
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному админитсратору"
    const GA_PREFIX = 12; // Префикс "Главному администратору"
    const TECH_PREFIX = 13; // Префикс "Техническому специалисту"
    const buttons = [
        {
            title: `-----------------------------------------------------------> ДОПОЛНИТЕЛЬНО ДЛЯ ОБЖ <-----------------------------------------------------------`,
        },
        {
            title: `NonRP обман (разбан на 24 часа)`,
            content:
           	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Аккаунт разблокирован на 24 часа. За это время ущерб должен быть возмещен обманутой стороне в полном объёме. Прикрепите фрапс обмена с /time в данную тему.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]Ожидаю ответа.[/ICODE][/COLOR][/CENTER][/B]',
        },
        {
            title: `Смена ника`,
            content:
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваш аккаунт будет разблокирован на 24 часа. За это время вы должны успеть поменять свой игровой NickName через /mm -> Смена имени или через /donate. После чего пришлите в данную тему скриншот с доказательством того, что вы изменили его. Если он не будет изменён, то аккаунт будет обратно заблокирован.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
        },
        {
            title: `Предоставить VK ссылку`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Предоставьте ссылку на вашу VK страницу.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
        },
        {
            title: `--------------------------------------------------------------------> ОБЖАЛОВАНИЯ <--------------------------------------------------------------------`,
        },
        {
            title: `Обж не по форме`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Обжалование составлено не по форме. Ознакомьтесь с правилами подачи обжалований → [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL].[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Дублирование`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ответ вам был дан в предыдущей теме. За дальнейшее дублирование тем ваш форумный аккаунт будет заблокирован.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Сократить наказание`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Проверив обжалование, было принято решение сократить срок Вашего наказания. Впредь не нарушайте и также ознакомьтесь с правилами проекта, чтобы подобных ситуаций больше не происходило.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Снять наказание`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Проверив обжалование, было принято решение полностью снять наказание. Впредь не нарушайте и также ознакомьтесь с правилами проекта, чтобы подобных ситуаций больше не происходило.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `ЧС снят`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Черный список снят. Впредь не нарушайте и также ознакомьтесь с правилами проекта, чтобы подобных ситуаций больше не происходило.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Обжалование на рассмотрении`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование взято на рассмотрение, ожидайте ответа.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Не готовы снизить`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Руководство сервера не готово снизить вам наказание. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]В обжаловании отказано.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `ОБЖ не подлежит`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Данное наказание не подлежит обжалованию. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `NonRP обман (не тот написал)`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Если вы готовы возместить ущерб обманутой стороне, то самостоятельно свяжитесь с игроком любым способом. [SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Для возврата имущества он должен оформить обжалование. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Нет док-в в ОБЖ`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашем обжаловании отсутствуют доказательства для дальнейшего рассмотрения. Загрузите их на фото/видео хостинг и создайте новое обращение.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Нерабочие док-ва в ОБЖ`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашем обжаловании не работают доказательства. Загрузите их повторно на фото/видео хостинг и создайте новое обращение.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `ОБЖ уже на рассмотрении`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Уже одно подобное обжалование от вашего лица находится на рассмотрении у Руководства сервера. Пожалуйста, прекратите создавать повторяющиеся темы и ожидайте ответа.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Обж для ГА`,
            dpstyle: `oswald: 3px;     color: #FF0000; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование передано Главному администратору сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: `ОБЖ для Спец. Админ`,
            dpstyle: `oswald: 3px;     color: #FEFE22; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование передано Специальной Администрации на рассмотрение. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
            title: `ОБЖ для Рук. Модер`,
            dpstyle: `oswald: 3px;     color: #FEFE22; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование передано Руководству модерации на рассмотрение.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: COMMAND_PREFIX,
            status: true,
        },
        {
            title: `Док-ва в соц.сетях`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube).[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: true,
        },
        {
            title: `Окно бана`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Создайте новое обжалование прикрепив в доказательствах окно блокировки при входе[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: true,
        },
        {
            title: `Ошиблись сервером`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вы ошиблись сервером, напишите обжалование на сервере на котором вы получили блокировку[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: true,
        },
        {
            title: `Обжалован`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование одобрено [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: true,
        },
        {
            title: `Ник не изменён`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вы не изменили Nick_Name за 24 часа аккаунт будет заблокирован снова[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: true,
        },
         {
            title: `В жб на адм`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Если вы не согласны с выданным наказанием, то вам в раздел Жалобы на администрацию. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: true,
        },
        {
            title: `---------------------------------------------------> Раздел Жалоб на администрацию <---------------------------------------------------`,
        },
        {
            title: `На рассмотрении`,
            content:
           	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `На рассмотрении (док-ва)`,
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]У администратора были запрошены доказательства о выданном наказании. Ожидайте ответа[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Проведена беседа`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и будет проведена беседа с администратором.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Проведена работа`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и будет проведена работа с администратором.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Проведена беседа + снятие наказания`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и будет проведена беседа с администратором. Ваше наказание будет снято в ближайшее время, если еще не снято. Приносим извинения за предоставленные неудобства.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Будет снят`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и администратор будет снят с поста.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Наказание по ошибке`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Наказание было выдано по ошибке и будет снято в ближайшее время. Приносим извинения за предоставленные неудобства.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Наказание верное`,
            dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Администратор, выдавший наказание предоставил опровержение на ваше нарушение. Наказание выданное вам, было выдано верно.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `ЖБ не по форме`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба составлена не по форме. С формой создания темы можно ознакомиться тут:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 1. Ваш Nick_Name [SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 2.Nick_Name администратора<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 3.Дата выдачи/получения наказания:<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 4.Суть жалобы:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 5.Доказательство: <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Жалоба уже на рассмотрении`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы, ожидайте ответа в подобной жалобе. [SIZE=4]<br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `ЖБ от 3 лица`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Прошло 48 часов`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]С момента выдачи наказания прошло более 48-ми часов. В следующий раз при возникновении подобных ситуаций подавайте жалобу заранее.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Нет нарушений`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
            	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Нарушения со стороны администратора отсутствуют.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Док-ва из соц. сетей`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Доказательства из социальных сетей не принимаются. Вам нужно загрузить доказательств на фото/видео хостинг.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Нет окна бана`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутствует окно блокировки аккаунта. Создайте новую тему и прикрепите его.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Не рабочие док-ва`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе нерабочие доказательства. Загрузите их повторно на фото/видео хостинг и создайте новое обращение.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Нужен фрапс`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В данном случае нужна видеофиксация (фрапс), где будет полностью видна ситуация.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Док-ва обрываются`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваши доказательства обрываются. Дальнейшее рассмотрение жалобы не представляется возможным.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Док-ва отредактированы`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
            	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Представленные доказательства были подвергнуты редактированию. Подобные жалобы рассмотрению не подлежат.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Мало док-в`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Недостаточно доказательств, которые могут подтвердить нарушение администратора.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет /time`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В предоставленных доказательствах отсутствует /time. Рассмотрению не подлежит.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Нет док-в в ЖБ`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутствуют доказательства для её рассмотрения. Загрузите их на фото/видео хостинг и создайте новое обращение.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Смена IP`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Попробуйте перезагрузить роутер или телефон.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
         {
            title: `В жб на теха`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам нужно обратится в жалобы на технических специалистов.[SIZE=3] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },

        {
            title: `-------------------------------------------------------------------> ПЕРЕАДРЕСАЦИИ <-------------------------------------------------------------------`,
        },
        {
            title: `Передать тех`,
            dpstyle: `oswald: 3px;     color:rgb(0, 22, 185); background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=orange][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Техническому Специалисту сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: TECH_PREFIX,
            status: true,
        },
        {
            title: `Передать ЗГА`,
            dpstyle: `oswald: 3px;     color: #FF0000; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Заместителю Главного Администратора. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Передать ГА`,
            dpstyle: `oswald: 3px;     color: #FF0000; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Главному администратору сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: `Спец. Админ`,
            dpstyle: `oswald: 3px;     color: #FEFE22; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Специальной администрации. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
            title: `Рук. модер`,
            dpstyle: `oswald: 3px;     color: #FEFE22; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба передана Руководству модерации. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: COMMAND_PREFIX,
            status: true,
        },
];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
	addButton('Одобрить✅', 'ACCEPT_PREFIX');
	addButton('Отказать⛔', 'UNACCEPT_PREFIX');
        addButton('Закрыто⛔', 'CLOSE_PREFIX');
        addButton('На рассмотрение💫', 'PIN_PREFIX');
 
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 0) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});
});
 
function addButton(name, id) {
$('.button--icon--reply').before(
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
);
}
 
function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
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
 
function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();