// ==UserScript==
// @name         Скрипт для ГС/ЗГС || GOLD
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Скрипт для Кураторов Форума
// @author       Angel Flyweather
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://sun6-21.userapi.com/s/v1/ig2/viJTLKoFiPbNucgMm8pwRY_NQXJU4yNdkRIom-iDuLrbJKE6ywN3PmzBBmKwI5-33pYurrVGooyL5w1oQZVBHFDA.jpg?size=1276x1276&quality=95&crop=0,3,1276,1276&ava=1
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/503252/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%7C%7C%20GOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/503252/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%7C%7C%20GOLD.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCСEPT_PREFIX = 4; // префикс отказано
	const ACCСEPT_PREFIX = 8; // префикс одобрено
	const PINN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const GA_PREFIX = 12; // главному администратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
         {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Рассмотрение жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении',
      content:
		 "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Ваша жалоба взята на рассмотрение, ожидайте ответа и не создавайте тем-дубликатов.[/FONT] <br><br>"+
                "[FONT=georgia]На рассмотрении[/FONT]<br><br>",
      prefix: PINN_PREFIX,
      status: true,
	},
        {
      title: 'У лидера была запрошена опра',
      content:
	 "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]У [U]Лидера[/U] были запрошены доказательства на выдачу наказания, ожидайте ответа. [/FONT] <br><br>"+
                "[FONT=georgia]На рассмотрении[/FONT]<br><br>",
      prefix: PINN_PREFIX,
      status: true,
	},
      {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрение жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
   {
      title: 'Будет проведена беседа с лидером',
      content:
		 "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Ваша жалоба [COLOR=#008000]одобрена, с лидером будет проведена профилактическая беседа.[/FONT] <br><br>"+
                "[FONT=georgia][COLOR=#008000]Одобрено[/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Будет проведена работа с лидером',
      content:
	 "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Ваша жалоба [COLOR=#008000]одобрена, с лидером будет проведена работа по данному случаю.[/FONT] <br><br>"+
                "[FONT=georgia][COLOR=#008000]Одобрено[/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Лидер будет снят',
      content:
		 "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
         "[FONT=georgia]Ваша жалоба [COLOR=#008000]одобрена, лидер будет снят со своего поста.[/FONT] <br><br>"+
                "[FONT=georgia][COLOR=#008000]Одобрено[/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Отсутствуют доказательства о нарушении лидера',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]В вашей жалобе отсутствуют доказательства о нарушении со стороны лидера.[/FONT] <br><br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
         },
    {
      title: 'Недостаточно док-в на нарушение от лидера',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Ваших доказательств недостаточно для корректного рассмотрения жалобы.[/FONT] <br><br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Наказание выдано верно ',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Нарушений со стороны лидера не найдено, наказание выдано верно.[/FONT] <br><br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Жалоба от 3-его лица',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]3.3.Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/FONT] <br><br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
            {
      title: 'Доказательства отредактированы',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]3.7.Доказательства должны быть предоставлены в первоначальном виде.[/FONT] <br><br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Форма темы',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Ваша жалоба составлена не по форме. С формой создания темы можно ознакомиться тут:<br>"+
        "[url=https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.559805/][/url]<br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: '48 часов написания жалобы',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]3.1.Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера.[/FONT] <br><br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Нет /time',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]В вашей жалобе отсутствует /time[/FONT] <br><br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Подобная жалоба (ответ не был дан)',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Дублирование темы, ожидайте ответа в подобной жалобе, иначе Вы можете получить блокировку форумного аккаунта.[/FONT] <br><br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
         {
      title: 'Подобная жалоба (ответ был дан)',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Дублирование темы,  ответ был дан в подобной жалобе.[/FONT] <br><br>"+
                "[FONT=georgia]Отказано[/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
         },
    {
      title: 'В нужный раздел',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Вы ошиблись форумным разделом, обратитесь в тот, который Вам нужен.[/FONT] <br><br>"+
                "[FONT=georgia]Закрыто[/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на тех.спецов',
      content:
		  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Обратитесь в раздел жалоб на тех. специалистов.[/FONT] <br><br>"+
                "[FONT=georgia]Закрыто[/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'В жалобы на игроков',
      content:
	  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Обратитесь в раздел жалоб на игроков.[/FONT] <br><br>"+
                "[FONT=georgia]Закрыто[/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
             },
        {
      title: 'В жалобы на адм',
      content:
	  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Обратитесь в раздел жалоб на администрацию.[/FONT] <br><br>"+
                "[FONT=georgia]Закрыто[/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
      },
{
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Передача на рассмотрение <<<<<<<<<<<<<<<<<<<<<<<<<|'
      },
        {
      title: ' Одобрено ',
      content:
	  "[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
        "[FONT=georgia]Ваша жалоба одобрена, игрок получит наказание в течение 24 часов[/FONT] <br><br>"+
                "[FONT=georgia]Закрыто[/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
},
{
	  title: '| На рассмотрении |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба взята на рассмотрение. [/FONT]<br><br>"+
                 "[FONT=georgia]На рассмотрении<br><br>",
     prefix: PINN_PREFIX,
	  status: true,
    },
{
	  title: '| На рассмотрении у ГКФ |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба передана на рассмотрение Главному куратору форума, ожидайте ответа.[/FONT]<br><br>"+
                 "[FONT=georgia]На рассмотрении<br><br>",
        prefix: PINN_PREFIX,
	  status: true,
},
{
    	   title: '| Тех. спецу |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба передана на рассмотрение Техническому специалисту сервера. [/FONT]<br><br>"+
                "[FONT=georgia]На рассмотрении<br><br>",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Перенаправление в другой раздел <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
	  title: '| В жб на адм |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia]Обратитесь в раздел «Жалобы на администрацию».[/FONT] <br><br>"+
               "[FONT=georgia]Закрыто<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia]Обратитесь в раздел «Жалобы на лидеров».[/FONT] <br><br>"+
                "[FONT=georgia]Закрыто<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
    },
{
	  title: '| В жб на сотрудников орг-ции |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia]Обратитесь в раздел жалоб на сотрудников той или иной организации.[/FONT] <br><br>"+
                 "[FONT=georgia]Закрыто<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia]Обратитесь в раздел «Обжалование наказаний».[/FONT] <br><br>"+
                "[FONT=georgia]Закрыто<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia]Обратитесь в технический раздел.[/FONT] <br><br>"+
                "[FONT=georgia]Закрыто<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia]Обратитесь в раздел «Жалобы на технических специалистов».[/FONT] <br><br>"+
                "[FONT=georgia]Закрыто<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Отказ жалобы <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
	  title: '| Нарушений не найдено |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как нарушений со стороны данного игрока не было найдено.  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| В логах не найдено |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia]Каждая жалоба проходит проверку в системе логирования, предоставленных вами доказательств недостаточно для вынесения вердикта.[/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как доказательств на нарушение от данного игрока недостаточно.  [/FONT]<br><br>"+
"[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Нарушение правил долга |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia]Долг происходит путем переводов между банковскими счетами должника и заемщика, в остальных случаях взятие денег не считается долгом.[/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как доказательства на нарушение от данного игрока  отсутствуют.  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как доказательства на нарушение от данного игрока  отредактированы.  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
    content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как она составлена не по форме.  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как ее заголовок составлен не по форме.  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как на ваших доказательствах отсутствует /time.  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] У вас есть 24 часа на добавление тайм-кодов для видео, тема открыта. [/FONT] <br><br>"+
                "На рассмотрении<br><br>",
      prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Более 72-х часов |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.  [/FONT] <br><br>"+
               "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как в Ваших доказательствах отсутствуют условия сделки.  [/FONT] <br><br>"+
               "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как доказательств недостаточно. В данной ситуации необходим фрапс (запись экрана).  [/FONT] <br><br>"+
              "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как нужен фрапс + промотка чата.  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как ваши доказательства не открываются.  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-его лица |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как она написана от 3-его лица. Жалоба от третьего лица не принимается (она должна быть подана участником ситуации).  [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером (ставит на рассмотрение) |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia]Вы ошиблись сервером, переношу в нужный Вам раздел. [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дублирование темы |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Вам уже был дан ответ в прошлой теме. Просьба не создавать темы-дубликаты, иначе Ваш форумный аккаунт будет заблокирован. [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| РП отыгровки для сотрудников не нужны |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Нарушений со стороны игрока нет, так как RP отыгровки не обязательны для совершения обыска, надевания наручников и тд. За игрока это делает система со своими системными отыгровками. [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Неадекватная жалоба |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] В данном виде ваша жалоба не будет рассмотрена администрацией сервера. Составьте жалобу адекватно, создав новую тему. При повторных попытках дублирования данной темы Вы получите блокировку форумного аккаунта. [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Док-ва в плохом качестве |',
	  content:
		"[FONT=georgia]Приветствую, уважаемый {{ user.mention }}[/FONT]<br><br>"+
		"[FONT=georgia] Ваша жалоба отказана, так как ваши доказательства представлены в плохом качестве. Доказательства на нарушение от игрока должны быть загружены в отличном формате, так, что бы все было видно без проблем. [/FONT] <br><br>"+
                "[FONT=georgia]Отказано<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,

           },


];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('★ На рассмотрении ★', 'pin');
	addButton('★ Отказано ★', 'unaccept');
	addButton('★ Одобрено ★', 'accepted');
	addButton('★ Теху ★', 'Texy');
    addButton('★ Закрыто ★', 'Zakrito');
    addButton('★ Ожидание ★', 'Ojidanie');
 	addButton('★ Ответы ★', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));



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