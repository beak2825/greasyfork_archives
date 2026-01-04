// ==UserScript==
// @name          Для настоящих принцев | Тех Империя
// @namespace      http://tampermonkey.net/
// @version      1.9.7
// @description  По вопросам в ВК - https://vk.com/vserdcaxxx, туда же и по предложениям на улучшение скрипта)
// @author       Anna_Provinceva
// @match        https://forum.blackrussia.online/threads/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/530606/%D0%94%D0%BB%D1%8F%20%D0%BD%D0%B0%D1%81%D1%82%D0%BE%D1%8F%D1%89%D0%B8%D1%85%20%D0%BF%D1%80%D0%B8%D0%BD%D1%86%D0%B5%D0%B2%20%7C%20%D0%A2%D0%B5%D1%85%20%D0%98%D0%BC%D0%BF%D0%B5%D1%80%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/530606/%D0%94%D0%BB%D1%8F%20%D0%BD%D0%B0%D1%81%D1%82%D0%BE%D1%8F%D1%89%D0%B8%D1%85%20%D0%BF%D1%80%D0%B8%D0%BD%D1%86%D0%B5%D0%B2%20%7C%20%D0%A2%D0%B5%D1%85%20%D0%98%D0%BC%D0%BF%D0%B5%D1%80%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTENO_PREFIX = 9; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
{
        title: 'Приветствие',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER] текст [/CENTER]',
    },
	{
            title: 'Дубликат',
            content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Эта тема является копией вашей предыдущей темы, ссылка на тему - [/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Пожалуйста, не создавайте похожие или одинаковые темы, иначе [COLOR=rgb(255, 0, 0)] ваш аккаунт на форуме может быть заблокирован.[/COLOR][/CENTER]<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
          },
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Рассмотрение Жалоб на Теховᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'На рассмотрении',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px] Ваша тема взята на [COLOR=rgb(255, 242, 0)]рассмотрение.[/color] Ответ поступит в ближайшее время. Пожалуйста, ожидайте.[/size][/FONT][/COLOR][/CENTER]<br>" +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: 'Выдано верно',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]После проверки доказательств и системы логирования, было принято решение, что наказание выдано [COLOR=rgb(0, 255, 0)]верно. [/COLOR][/CENTER]<br> <br>"+
        '[CENTER]Хотелось бы напомнить, что вы автоматически соглашаетесь со всеми установленными правилами и обязуетесь их соблюдать в полной мере при регистрации своего игрового аккаунта на любом из серверов проекта.[/CENTER]<br>' +
        '[CENTER]Рекомендуем вам более детально ознакомиться с [URL= https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/][COLOR=rgb(255,207,64)]правилами проекта.[/URL][/COLOR][/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Беседа с техом',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]С Техническим специалистом будет проведена строгая профилактическая беседа.[/CENTER]<br>'+
        '[CENTER]Приносим свои извинения за предоставленные неудобства.[/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: WATCHED_PREFIX,
		status: false,
     },
     {
        title: 'Купил ИВ у игрока',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Благодарим вас за обратную связь. Ваше обращение было принято к рассмотрению, и мы вынесли следующий вердикт.[/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Была проведена повторная проверка. В ходе которой было выявлено следующее:<br>' +
        '[COLOR=rgb(255, 0, 0)]4.01.[/COLOR] Создавая игровой аккаунт на нашем проекте, игрок автоматически соглашается со всеми правилами проекта.<br><br>' +
        '[CENTER]Вам на банковский счёт неоднократно переводились денежные средства от продавцов игровой валют. Ошибки в переводе быть не может, после перевода деньги благополучно снимались. Об ошибочном переводе вы никому не сообщали. Исходя из вышеперечисленного делаю вывод, что вы знали от кого и с какой целью вам переводяться денежные средства. Соответственно вы предполагали тот вариант, что ваш игровой аккаунт может быть заблокированным, но почему-то сослались на некомпетентность технического специалиста или же, что данное действие вам сойдёт с рук. Мы понимаем, что блокировка аккаунта приносит вам не самые лучшие эмоции, но хочу вам напомнить, что ваш аккаунт был заблокирован из-за ваших отрицательных действий, которые в дальнейшем могли испортить экономику сервера. <br><br>' +
        '[CENTER]Пытаться обмануть техническую администрацию аналогично нету смысла, с данными игроками вы никогда не взаимодействовали и взаимодействовать не могли. Ваши действия противоречат основным принципам нашей игры, созданной для увлекательного и справедливого игрового опыта всех пользователей, которые присоединяются к нашему проекту чтобы получить незабываемые впечатления от игры.<br><br>' +
        '[CENTER]На основании имеющейся информации, решение технического специалиста признано корректным. Нарушений с его стороны нету. Доказательства на каждое слово и действие имеются. С учетом этого, решение технического специалиста выглядит обоснованным и справедливым, ссылаясь на правила проекта и попутно отвечая на Ваши вопросы.<br><br>' +
        '[CENTER]Наша задача - обеспечить честную и справедливую среду для всех пользователей, и нарушение правил в отношении игровой валюты может нанести вред игровой экономике и репутации проекта.<br><br>' +
        '[CENTER]Вы совершили грубейшее нарушение правил проекта, за что понесли заслуженное наказание от технических специалистов. Технический специалист действовал согласно должностным инструкциям, придерживаясь правила 2.28. Это правило имеет крайне серьезное значение, и мы призываем каждого участника соблюдать его безукоризненно. <br><br>' +
        '[CENTER]Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что данный пункт не подлежит обжалованию, и каждый участник должен принять его как часть ответственности за свои действия.<br><br>' +
        '[CENTER]Для создания положительной и уважительной игровой атмосферы призываем каждого из вас проявлять сознательность и уважение к правилам. Вместе мы строим прекрасное и дружелюбное сообщество, которое уважает всех и каждого.<br><br>' +
        '[CENTER]С учетом всего сказанного, давайте будем бдительны и помнить, что соблюдение правил - это залог успешной и приятной игры для всех.<br><br>' +
        '[CENTER]Технический специалист действовал согласно должностным инструкциям, вердикт и наказания верны. В независимости от того, хотели Вы купить-продать или просто поинтересоваться, наказание предусмотрено по пункту 2.28 правил, Выше приложил описание. Любые шутки на тему покупки/продажи игровой валюты также наказуемы.<br><br>' +
        '[CENTER]Помните, что ваше поведение в игре оказывает влияние на ее общую атмосферу и удовлетворение всех игроков.<br><br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Наказание остается без изменений.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
         title: 'Заблокированный IP',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы попали на заблокированный айпи адрес. Ваш аккаунт не находится в блокировке, переживать не стоит. Причиной попадания в данную ситуацию могло быть разное, например, смена мобильного интернета, переезд и тому подобное. Чтобы избежать данную ситуацию, вам необходимо перезагрузить телефон или воспользоваться услугами VPN.[/CENTER] <br>' +
        '[CENTER]Приносим свои извинения за доставленные неудобства. Желаем приятного времяпровождения на нашем проекте.[/CENTER] <br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: WATCHED_PREFIX,
		status: false,
     },
     {
        title: 'Чужая привязка',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. [/CENTER] <br><br>' +
        '[CENTER]Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей. [/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'Аккаунт будет разблокирован',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваш аккаунт будет разблокирован в течение 24х часов.  [/CENTER]<br>' +
        '[CENTER]Надеемся, что в процессе разблокировки никакое имущество не слетело в государство.[/CENTER]<br>' +
        '[CENTER]Если возникли проблемы с имуществом, пожалуйста, создайте новую тему для обсуждения компенсации. [/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: WATCHED_PREFIX,
		status: false,
     },
     {
        title: 'Не подлежит обж',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Мы рады, что вы осознали свою ошибку. Вы получили блокировку за серьезное нарушение, мы не в силах снизить срок вашего наказания.<br><br>' +
		'[CENTER]Рекомендуем вам ознакомиться с [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/][COLOR=rgb(255,207,64)]правилами обжалования нарушения при выдаче наказания от технического специалиста.[/COLOR][/URL] (кликабельно)[/center]<br><br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'В ОБЖ отказано',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Мы рады, что вы осознали свою ошибку.[/CENTER]<br>' +
        '[CENTER]На данный момент мы не готовы пойти к вам на встречу и снизить срок блокировки аккаунта.[/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'ОБЖ одобрено',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Мы рассмотрели ваше обжалование, и пришли к вердикту, что срок блокировки аккаунта будет будет сокращён.[/CENTER]<br>' +
        '[CENTER]Рекомендуем вам ознакомиться с [URL= https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-25703465][COLOR=rgb(255,207,64)]правилами проекта[/URL][/COLOR] (кликабельно), чтобы такого больше не повторилось. Мы очень надеемся, что данная ситуация станет для вас уроком.[/CENTER]<br>' +
        '[CENTER]К сожалению, мы не всегда сможем пойти к вам на встречу и обжаловать/амнистировать вас.[/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: WATCHED_PREFIX,
		status: false,
    },
          {
        title: 'Нет окна блокировки',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'Истек срок подачи',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]С момента выдачи наказания от Технического специалиста прошло более 14-и дней.<br> Изменение меры наказания новозможно. Вы можете попробовать написать обжалование.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию. Рекомендуем вам ознакомиться с [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/][COLOR=rgb(255,207,64)]правилами обжалования нарушения при выдаче наказания от технического специалиста.[/COLOR][/URL][/center]<br><br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
    },
	{
        title: 'Нет ответа от игрока',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]К сожалению, ответа от вас в теме так и не поступило. <br>Пожалуйста, создайте новую тему, если вы все ещё не согласны с выданным наказанием.<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
   {
        title: 'Решено, разбан',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ситуация решена, ваш аккаунт будет разблокирован в течение 24 часов.[/CENTER]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
         prefix: CLOSE_PREFIX,
		     status: false,
   },
	{
		title: 'Восст. доступа к аккаунту',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
		'[CENTER]Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
 { title: 'Смена пароля',
content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER]Сбросьте пароль через любую из привязок ВКонтакте или Telegram, после чего прикрепите скриншот.<br>Новый пароль необходимо замазать (обязательно).<br><br>Ожидаю вашего ответа.' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
 },
{
        title: 'Ситуация решена',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ситуация решена.[/CENTER]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
         prefix: CLOSE_PREFIX,
		     status: false,
   },
{
        title: 'Запрос привязок',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        'Будьте добры, заполните данную форму, с целью убеждения, что вы являетесь владельцем аккаунта:<br><br>1) Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/:<br>2) Почта, привязанная к аккаунту (если имеется на аккаунте):<br>3) Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: t.me/getmyid_bot:<br><br>Ожидаю обратной связи.'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
   },
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Для Куратора/Заместителяᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7B68EE; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'ЖБ передана руководству',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 242, 0)]руководству.[/COLOR] Пожалуйста, ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
        title: 'ОБЖ передано руководству',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваше обжалование передано на рассмотрение [COLOR=rgb(255, 242, 0)]руководству.[/COLOR] Пожалуйста, ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
        title: 'ЖБ передана Куратору',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 142, 0)]Куратору технических специалистов.[/COLOR] Пожалуйста, ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 255,255)]@Maxim Legasy [/COLOR][/CENTER]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: 'Обж передано Куратору',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваше обжалование передано на рассмотрение [COLOR=rgb(255, 142, 0)]Куратору технических специалистов.[/COLOR] Пожалуйста, ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 255,255)]@Maxim Legasy [/COLOR][/CENTER]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: 'Жб передана Заместителю',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 142, 0)]Заместителю куратора технических специалистов.[/COLOR] Пожалуйста, ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 255,255)]@Niletto_Provincev [/COLOR][/CENTER]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: 'Передача темы на рассмотрение теху',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша тема передана на рассмотрение [COLOR=rgb(255, 142, 0)]Техническому специалисту.[/COLOR] Пожалуйста, наберитесь терпения и ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: TECHADM_PREFIX,
		status: true,
	},
    {
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Чистка от оффтопа ЖБ на техᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Форма подачи "ЖБ НА ТЕХ"',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | [COLOR=rgb(255, 0, 0)]Махинации[/COLOR]<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Правила раздела ЖБ на тех',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Хочу занять должность',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе вашего игрового сервера, где вы можете ознакомиться с открытыми должностями и формами подач.<br><br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'Перенаправление в поддержку',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Пожалуйста, обратитесь в Техническую поддежку проекта.<br><br>[COLOR=rgb(255, 255, 0)]Конктактная информация:[/COLOR][/CENTER]<br>'+
        '[CENTER]Телеграмм -  [URL=http://t.me/br_techBot]t.me/br_techBot[/URL][/CENTER]<br>'+
        '[CENTER]ВКонтакте - [URL= https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vYnJfdGVjaA==]vk.com/br_tech[/URL] [/CENTER]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: WATCHED_PREFIX,
        status: false,
    },
	{
		title: 'Перенаправление в гос. раздел',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша тема не относится к разделу "Жалобы на технических специалистов". Пожалуйста, оставьте ваше заявление в соответствующем разделе Государственных организаций вашего сервера.[/CENTER]<br><br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Перенаправление в крим. раздел',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша тема не относится к разделу "Жалобы на технических специалистов". Пожалуйста, оставьте ваше заявление в соответствующем разделе Криминальных организаций вашего сервера [/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'Перенаправление в тех. раздел',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваше обращение не относится к разделу «Жалобы на технических специалистов».<br>' +
        '[CENTER]Пожалуйста, обратитесь с данной темой в «Технический раздел» вашего сервера» - [URL= https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]<br><br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
{
        title: 'Перенаправление в ЖБ ТС',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		    '[CENTER][FONT=arial][COLOR=rgb(204, 204, 204)]Ваше обращение не относится к разделу "Технический раздел"<br>' +
        '[CENTER]Пожалуйста, обратитесь с данной темой в «Жалобы на технических специалистов» вашего сервера» - [URL= https://forum.blackrussia.online/forums/Жалобы-на-технических-специалистов.490/][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]<br><br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Перенаправление в жб на адм',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы получили наказание от Администратора сервера. Ваше обращение не относится к разделу «Жалобы на технических специалистов».<br>' +
        '[CENTER]Пожалуйста, обратитесь в раздел «Жалобы на администрацию» вашего сервера.<br>Форма для подачи жалобы - [URL= https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
    },
	{
		title: 'Перенаправление в жб на игр',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Данная тема не относится к разделу «Жалобы на технических специалистов». Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
		title: 'Перенаправление в обж от адм',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы получили наказание от администратора своего сервера.<br> Для его снижения блокировки вам нужно обратиться в раздел «Обжалования» вашего сервера. <br> Форма подачи темы находится здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/'][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'НЕ ОТНОСИТСЯ',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела - [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][COLOR=rgb(255,207,64)]кликабельно.[COLOR][/URL]" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',

		 prefix: UNACCEPT_PREFIX,
		 status: false,
	},
 
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
    addButton('Тех. Спец', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
    addButton('Команде проекта', 'command', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 219, 139, 0.5);');
	addAnswers();
// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
	$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));

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
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
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

