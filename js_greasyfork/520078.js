// ==UserScript==
// @name         ГА / ЗГА / Кураторы ||
// @namespace    https://forum.blackrussia.online
// @version      3.1.5
// @description  Специально для BlackRussia ||
// @author       Daniil Korobka
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license      none
// @supportURL   https://vk.com/danmak
// @downloadURL https://update.greasyfork.org/scripts/520078/%D0%93%D0%90%20%20%D0%97%D0%93%D0%90%20%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%7C%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/520078/%D0%93%D0%90%20%20%D0%97%D0%93%D0%90%20%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%7C%7C.meta.js
// ==/UserScript==

(async function () {
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
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [
     {
      title: `____________________________________________________ПРИВЕТСТВИЕ____________________________________________________`,
      dpstyle: `oswald: 3px;     color: #ffff00; background: #ffffee; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
         `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`,
     },
{
      title: `--------------------------------------------------------------------> АДМИН РАЗДЕЛ <--------------------------------------------------------------------`,
    dpstyle: `oswald: 3px;     color: #ffc355; background: #fff9ee; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
},
     {
	  title: `Неактивы`,
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на неактив были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)] С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
     },
     {
	  title: `Доп. Баллы`,
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши доп. баллы были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
     },
     {
	  title: `Имущество`,
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления покупку/продажу/обмен имущества были успешно проверены и одобрены![/COLOR]<br><br>`+
        `Отказанные заявки перечислил выше. Все взаимодействия с имуществом после 22:00, при репорте меньше 10.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
     },
     {
	  title: `Снятие наказаний`,
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на снятие наказаний были проверены и одобрены! Отказанные заявки отметил выше.[/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
     },
     {
	  title: `Повышение`,
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS]Уважаемая Администрация! Сообщаю вам, что ваши заявления повышение были проверены и одобрены! Отказанные заявки отметил выше.[/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
     },
{
      title: `-------------------------------------------------------------------> ПЕРЕАДРЕСАЦИИ <-------------------------------------------------------------------`,
    dpstyle: `oswald: 3px;     color: #55ff55; background: #eeffee; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
},
    {
      title: `Жалобу в адм раздел`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Вам нужно обратиться в раздел жалоб на Администрацию → [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.271/']*Кликабельно*[/URL]<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `В раздел ОБЖ`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Вам нужно обратиться в раздел Обжалование → [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.274/']*Кликабельно*[/URL]<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `В раздел жалоб на игроков`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Вам нужно обратиться в раздел жалоб на игроков → [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.273/']*Кликабельно*[/URL]<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел жалоб на лидеров`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Вам нужно обратиться в раздел жалоб на лидеров → [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1911/']*Кликабельно*[/URL]<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
        prefix: CLOSE_PREFIX,
        status: false,
	},
    {
      title: `Жалобу на теха`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Вам нужно обратиться в раздел жалоб на технических специалистов → [URL='https://forum.blackrussia.online/forums/Сервер-№5-orange.1186/']*Кликабельно*[/URL]<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
	  title: `Передать ЗГА ГОСС & ОПГ`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора по направлению ГОСС & ОПГ — @Kostya_Belik 🤙.<br><br>` +
        `Ожидайте ответа.[/CENTER][/FONT]`,
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать Main ЗГА`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `[CENTER]Передаю вашу жалобу Основному Заместителю Главного Администратора — @Jesus Wiston.<br><br>`+
        `Ожидайте ответа.[/CENTER][/FONT]`,
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать ГА`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `[CENTER][FONT=verdana]Передаю вашу жалобу Главному Администратору — @Daniil Peresada.<br><br>`+
        `Ожидайте ответа.[/CENTER][/FONT]`,
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: `Спец. Админ`,
      content:
         `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
         `[CENTER] [FONT=verdana]Ваша жалоба передана Специальной Администрации.<br><br>`+
         `Ожидайте ответа.[/CENTER][/FONT]`,
      prefix: SPECIAL_PREFIX,
      status: true,
    },
{
	   title: `---------------------------------------------------> Раздел Жалоб на администрацию <---------------------------------------------------`,
       dpstyle: `oswald: 3px;     color: #5555ff; background: #eeeeff; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
},
    {
	  title: `Проведена работа`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`С администратором будет проведена необходимая работа.<br><br>`+
		`Спасибо за обращение.[/CENTER][/FONT]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `Проведена работа + снятие`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`С администратором будет проведена необходимая работа. Наказание будет снято в ближайшее время.<br><br>`+
		`Приносим извинения за предоставленные неудобства.[/CENTER][/FONT]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Меры приняты`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`К администратору будут приняты необходимые меры.<br><br>`+
		`Спасибо за обращение.[/CENTER][/FONT]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `Меры приняты + снятие`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `К администратору будут приняты необходимые меры. Наказание будет снято в ближайшее время.<br><br>`+
		`Приносим извинения за предоставленные неудобства.[/CENTER][/FONT]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `Наказание по ошибке`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Наказание будет снято в ближайшее время.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: `Администратор Снят`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Администратор будет снят со своего поста.<br><br>`+
		`Одобрено.[/CENTER][/FONT]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
	  title: `На рассмотрении (док-ва)`,
         dpstyle: `oswald: 3px;     color: #FFF44F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
         `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
         `Запросил доказательства у администратора.<br><br>`+
         `Ожидайте ответа.[/CENTER][/FONT]`,
	  prefix: PIN_PREFIX,
	  status: true,
     },
     {
	  title: `На рассмотрении`,
         dpstyle: `oswald: 3px;     color: #FFF44F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
         `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
         `Ваша жалоба находится на рассмотрении.<br><br>`+
         `Ожидайте ответа.[/CENTER][/FONT]`,
	  prefix: PIN_PREFIX,
	  status: true,
     },
     {
      title: `Переслать сообщения в ВК`,
         dpstyle: `oswald: 3px;     color: #FFF44F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Перешлите мне эти сообщения в VK → https://vk.com/danmak.<br><br>`+
		`На рассмотрении.[/FONT][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	 },
     {
	  title: `Наказание верное`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Наказание выдано верно.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: `ЖБ Не по форме`,
         dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи жалоб → [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Кликабельно*[/URL]<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
     },
     {
	  title: `Неадекват в ЖБ`,
         dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Ваша жалоба составлена в неадекватном формате. Рассмотрению не подлежит.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `ЖБ От 3 лица`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Жалоба составлена от 3-го лица. Рассмотрению не подлежит.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Прошло 48 Часов`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`С момента выдачи наказания прошло более 48-ми часов.<br><br>`+
		`Жалоба не подлежит рассмотрению.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
	  title: `Не по теме`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Ваше обращение никаким образом не относится к предназначению данного раздела.<br><br>`+
		`Пожалуйста, ознакомьтесь с его предназначением.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Нет нарушений`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Исходя из выше приложенных доказательств, нарушения со стороны администратора отсутствуют<br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Жалоба уже на рассмотрении`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Подобная жалоба находится на рассмотрении. Не создавайте дубликатов данной жалобы.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: `Дублирование`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
         `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
         `Ответ вам уже был дан в предыдущей теме. Напоминаю, что за дублирование тем ваш форумный аккаунт будет заблокирован.<br><br>`+
         `Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `Нет ссылки на жалобу`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Отсутствует ссылка на жалобу. Создайте новую тему и прикрепите её.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Соц. сети`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Доказательства из социальных сетей не принимаются. Вам нужно загрузить доказательств на фото/видео хостинг.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Нет окна бана`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Отсутствует окно блокировки. Создайте новую тему и прикрепите его.<br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Не рабочие док-ва`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`В вашей жалобе нерабочие доказательства.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        	{
	  title: `Нужен фрапс`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`В данном случае нужна видеофиксация.<br><br>`+
		`Отказано.[/CENTER][/FONT]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `Док-ва обрываются`,
            dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Ваши доказательства обрываются. Дальнейшее рассмотрение жалобы не представляется возможным.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Док-во отредактировано`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Представленные доказательства были подвергнуты редактированию.<br><br>`+
		`Подобные жалобы рассмотрению не подлежат.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Док-во в плохом качестве`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`Создайте новое обращение, прекрепив доказательства в более хорошем качестве.<br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: `Нет строки выдачи`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
     content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `В ваших доказательствах отсутствует строка выдачи наказания от Администратора.<br><br>`+
        `Отказано.[/CENTER][/FONT]`,
	 prefix: UNACCEPT_PREFIX,
     status: false,
    },
    {
     title: `Мало док-в`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
     content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Недостаточно доказательств, которые могут подтвердить нарушение администратора.<br><br>`+
        `Отказано.[/CENTER][/FONT]`,
	 prefix: UNACCEPT_PREFIX,
     status: false,
    },
	{
	  title: `Нет /time`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`В предоставленных доказательствах отсутствует /time. Рассмотрению не подлежит.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: `Нет док-в в ЖБ`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	 content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
		`В вашей жалобе отсутствуют доказательства для её рассмотрения.<br><br>`+
		`Закрыто.[/CENTER][/FONT]`,
	 prefix: CLOSE_PREFIX,
	 status: false,
	},
{
            title: `--------------------------------------------------------------------> ОБЖАЛОВАНИЯ <--------------------------------------------------------------------`,
            dpstyle: `oswald: 3px;     color: #b255ff; background: #f7eeff; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
},
    {
      title: `Сократить наказание`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Ваше обжалование одобрено. Наказание будет снижено.<br><br>`+
        `Одобрено.[/CENTER][/FONT]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Снять наказание`,
        dpstyle: `oswald: 3px;     color: #54FF9F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Ваше обжалование одобрено, наказание будет полностью снято.<br><br>`+
        `Одобрено.[/CENTER][/FONT]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Обжалование на рассмотрении`,
        dpstyle: `oswald: 3px;     color: #FFF44F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Ваша тема взята на рассмотрение. Пожалуйста, не создавайте её копии.<br><br>`+
        `Ожидайте ответа.[/CENTER][/FONT]`,
      prefix: PIN_PREFIX,
      status: true,
    },
    {
	  title: `Смена ника`,
        dpstyle: `oswald: 3px;     color: #FFF44F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Ваш аккаунт будет разблокирован на 24 часа. За это время вы должны успеть поменять свой игровой nickname через /mm -> Смена имени или через /donate. После чего пришлите в данную тему скриншот с доказательтвом того, что вы изменили его. Если он не будет изменён, то аккаунт будет обратно заблокирован.<br><br>`+
        `На рассмотрении.[/CENTER][/FONT]`,
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `NonRP обман (разбан на 24 часа)`,
        dpstyle: `oswald: 3px;     color: #FFF44F; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Аккаунт разблокирован на 24 часа. За это время ущерб должен быть возмещен обманутой стороне в полном объёме.<br>`+
        `Прикрепите фрапс обмена с /time в данную тему.<br><br>`+
        `Ожидаю ответа.[/CENTER][/FONT]`,
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `Отказать ОБЖ`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `В обжаловании отказано.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `ОБЖ не подлежит`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Данное наказание не подлежит обжалованию.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `NonRP обман (не тот написал)`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Если вы готовы возместить ущерб обманутой стороне, то самостоятельно свяжитесь с игроком в любым способом.<br>`+
        `Для возврата имущества он должен оформить обжалование.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Обж не по форме`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Обжалование составлено не по форме, ознакомьтесь с правилами подачи обжалований → [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL].<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Ошиблись сервером`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Вы ошиблись сервером или разделом, переподайте тему в нужный раздел..<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
      {
      title: `НРП обманы`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Для того чтобы снизить или снять данное наказание вам нужно связаться с игроком для возврата имущества, а после снова создать обжалование.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет док-в в ОБЖ`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `В вашем обжаловании отсутствуют доказательства для дальнейшего расмотрения.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нерабочие док-ва в ОБЖ`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `В вашем обжаловании не работают доказательства.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Дублирование ОБЖ`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Ответ был дан в прошлой теме. Напоминаю, что за дублирование тем ваш форумный аккаунт будет заблокирован.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `ОБЖ уже на рассмотрении`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Уже одно подобное обжалование от вашего лица находится на рассмотрении у Руководства сервера.<br>`+
        `Пожалуйста, прекратите создавать повторяющиеся темы.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Неадекват ОБЖ`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Обжалование составлено в неадекватном формате. Рассмотрению не подлежит.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет ссылки на VK`,
        dpstyle: `oswald: 3px;     color: #FF2B2B; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
        `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `В вашем обжаловании отсутствует ссылка на вашу страницу VK. Прикрепите ее в следующем обращении для дальнейшего рассмотрения.<br><br>`+
        `Закрыто.[/CENTER][/FONT]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `Обж для ГА`,
        dpstyle: `oswald: 3px;     color: #FF0000; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
	  content:
		`[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
        `Передаю ваше обжалование Главному Администратору — [USER=454761]Egor_Kristofer👑[/USER].<br><br>`+
        `Ожидайте ответа.[/CENTER][/FONT]`,
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: `ОБЖ для Спец. Админ`,
        dpstyle: `oswald: 3px;     color: #FEFE22; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000`,
      content:
         `[CENTER][FONT=verdana]${greeting}, уважаемый ${user.mention}.<br><br>`+
         `Ваше обжалование передано Специальной Администрации на рассмотрение.<br><br>`+
         `Ожидайте ответа.[/CENTER][/FONT]`,
      prefix: SPECIAL_PREFIX,
      status: true,
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
            XF.alert(buttonsMarkup(buttons), null, `бродяга, выбери ответ`);
            buttons.forEach((btn, id) => {
                if (id > 6) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });

        $(`button#igroki-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons2), null, `бродяга, выбери ответ`);
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