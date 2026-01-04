// ==UserScript==
// @name         Для ГС/ЗГС ГОСС & ОПГ || TAMBOV
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Специально для BlackRussia || TAMBOV
// @author       Roman_Innocence
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://ltdfoto.ru/images/2025/03/30/FOTO5ede3108d5ce4811.png
// @grant        none
// @license      none
// @supportURL   https://vk.com/innocenetti
// @downloadURL https://update.greasyfork.org/scripts/531706/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20%20%D0%9E%D0%9F%D0%93%20%7C%7C%20TAMBOV.user.js
// @updateURL https://update.greasyfork.org/scripts/531706/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20%20%D0%9E%D0%9F%D0%93%20%7C%7C%20TAMBOV.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const GA_PREFIX = 12; // Префикс "Главному администратору"
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [
     {
      title: `____________________________________________________ПРИВЕТСТВИЕ____________________________________________________`,
      dpstyle: `oswald: 3px;     color: #ffff00; background: #ffffee; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
         `[B]${greeting}.<br><br>`,
     },
{
      title: `-------------------------------------------------------------------> ПЕРЕАДРЕСАЦИИ <-------------------------------------------------------------------`,
    dpstyle: `oswald: 3px;     color: #55ff55; background: #eeffee; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
},
    {
      title: `Жалобу в адм раздел`,
      content:
        `[B]${greeting}.<br><br>`+
        `Внимательно ознакомившись с вашей жалобой было принято решение, что вам нужно обратиться в раздел жалоб на Администрацию → [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3307/']*Кликабельно*[/URL]<br><br>`+
        `Закрыто.[/B]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `В раздел ОБЖ`,
      content:
        `[B]${greeting}.<br><br>`+
        `Внимательно ознакомившись с вашей жалобой было принято решение, что вам нужно обратиться в раздел Обжалование → [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3310/']*Кликабельно*[/URL]<br><br>`+
        `Закрыто.[/B]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `В раздел жалоб на игроков`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Внимательно ознакомившись с вашей жалобой было принято решение, что вам нужно обратиться в раздел жалоб на игроков → [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3309/']*Кликабельно*[/URL]<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: `Жалобу на теха`,
      content:
        `[B]${greeting}.<br><br>`+
        `Внимательно ознакомившись с вашей жалобой было принято решение, что вам нужно обратиться в раздел жалоб на технических специалистов → [URL='https://forum.blackrussia.online/forums/Сервер-№73-tambov.3288/']*Кликабельно*[/URL]<br><br>`+
        `Закрыто.[/B]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
	  title: `Передать ЗГА ГОСС & ОПГ`,
	  content:
		`[B]${greeting}.<br><br>`+
        `Ваша жалоба передана Заместителю Главного Администратора по направлению ГОСС & ОПГ — [USER=963397]Egor Versachi[/USER].<br><br>` +
        `Ожидайте ответа.[/B]`,
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать Main ЗГА`,
	  content:
		`[B]${greeting}.<br><br>`+
        `Ваша жалоба передана Основному Заместителю Главного Администратора — [USER=1098111]Pasha_Versachi[/USER].<br><br>`+
        `Ожидайте ответа.[/B]`,
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать ГА`,
	  content:
		`[B]${greeting}.<br><br>`+
        `Ваша жалоба передана Главному Администратору — [USER=369388]Lars_Crown[/USER].<br><br>`+
        `Ожидайте ответа.[/B]`,
      prefix: GA_PREFIX,
	  status: true,
    },
{
	   title: `---------------------------------------------------> Раздел Жалоб на лидеров <---------------------------------------------------`,
       dpstyle: `oswald: 3px;     color: #5555ff; background: #eeeeff; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
},
    {
	  title: `Проведена работа`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`С лидером будет проведена необходимая работа. Спасибо за обращение.<br><br>`+
		`Одобрено.[/B]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Меры приняты`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`К лидеру будут приняты необходимые меры. Спасибо за обращение.<br><br>`+
		`Одобрено.[/B]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `Наказание по ошибке + восст в орг`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Наказание было выдано по ошибке. Свяжитесь с лидером для восстановления. Приносим извинения за предоставленные неудобства.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: `Лидер снят`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Лидер снят/ушел со своего поста.<br><br>`+
		`Одобрено.[/B]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
	  title: `На рассмотрении (док-ва)`,
         dpstyle: `oswald: 3px;     color: #FFF44F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
         `[B]${greeting}.<br><br>`+
         `Запросил доказательства у лидера.<br><br>`+
         `Ожидайте ответа.[/B]`,
	  prefix: PIN_PREFIX,
	  status: true,
     },
     {
	  title: `На рассмотрении`,
         dpstyle: `oswald: 3px;     color: #FFF44F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
         `[B]${greeting}.<br><br>`+
         `Ваша жалоба взята на рассмотрение.<br><br>`+
         `Ожидайте ответа.[/B]`,
	  prefix: PIN_PREFIX,
	  status: true,
     },
     {
	  title: `Наказание верное`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Проверив доказательства лидера, было принято решение, что нарушений со стороны лидера нет.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: `ЖБ не по форме`,
         dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи жалоб → [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.3429391/']*Кликабельно*[/URL]<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
     },
     {
      title: `Дублирование`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
         `[B]${greeting}.<br><br>`+
         `Ответ вам был дан в предыдущей теме. За дальнейшее дублирование тем ваш форумный аккаунт будет заблокирован.<br><br>`+
         `Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
      status: false,
    },
     {
	  title: `Жалоба уже на рассмотрении`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Подобная жалоба уже находится на рассмотрении. За дальнейшее дублирование тем ваш форумный аккаунт будет заблокирован.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Неадекват в ЖБ`,
         dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Ваша жалоба составлена в неадекватном формате. Рассмотрению не подлежит.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `ЖБ от 3 лица`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Жалоба составлена от 3-го лица. Рассмотрению не подлежит.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Не по теме`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
        `Ваше обращение никаким образом не относится к предназначению данного раздела. Пожалуйста, ознакомьтесь с его предназначением.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Нет нарушений`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Нарушения со стороны лидера отсутствуют.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Соц. сети`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Доказательства из социальных сетей не принимаются. Вам нужно загрузить доказательств на фото/видео хостинг.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Не рабочие док-ва`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`В вашей жалобе нерабочие доказательства. Загрузите их повторно на фото/видео хостинг и создайте новое обращение.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        	{
	  title: `Нужен фрапс`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`В данном случае нужна видеофиксация (фрапс), где будет полностью видна ситуация.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Док-ва обрываются`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Ваши доказательства обрываются. Дальнейшее рассмотрение жалобы не представляется возможным.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Док-во отредактировано`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Представленные доказательства были подвергнуты редактированию.<br><br>`+
		`Подобные жалобы рассмотрению не подлежат.`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Док-во в плохом качестве`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`Создайте новое обращение, прикрепив доказательства в более хорошем качестве.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: `Мало док-в`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
     content:
        `[B]${greeting}.<br><br>`+
        `Недостаточно доказательств, которые могут подтвердить нарушение лидера.<br><br>`+
        `Отказано.[/B]`,
	 prefix: UNACCEPT_PREFIX,
     status: false,
    },
	{
	  title: `Нет /time`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[B]${greeting}.<br><br>`+
		`В предоставленных доказательствах отсутствует /time. Рассмотрению не подлежит.<br><br>`+
		`Закрыто.[/B]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: `Нет док-в в ЖБ`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	 content:
		`[B]${greeting}.<br><br>`+
		`В вашей жалобе отсутствуют доказательства для её рассмотрения. Загрузите их на фото/видео хостинг и создайте новое обращение.<br><br>`+
		`Закрыто.[/B]`,
	 prefix: CLOSE_PREFIX,
	 status: false,
	},
];
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы

        addButton(`На рассмотрение`, `pin`, `border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,165,0, 0.5);`);
        addButton(`Одобрено`, `accepted`, `border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);`);
        addButton(`Отказано`, `unaccept`, `border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);`);
        addButton(`Закрыто`, `closed`, `border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);`);
        addAnswers();

        // Поиск информации о теме

        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));

        $(`button#admin-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `sex ответы`);
            buttons.forEach((btn, id) => {
                if (id > 6) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });

        $(`button#igroki-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons2), null, `sex ответы`);
            buttons2.forEach((btn, id) => {
                if (id > 15) {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id, style) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
        );
        if(id === 21) {
            button.hide()
        }
    }
        function addAnswers() {
        $(`.button--icon--reply`).after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="admin-otvet" style="oswald: 4px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,);
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
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
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
            ? `Здравствуйте`
            : 11 < hours && hours <= 15
                ? `Здравствуйте`
                : 15 < hours && hours <= 21
                    ? `Здравствуйте`
                    : `Здравствуйте`

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
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