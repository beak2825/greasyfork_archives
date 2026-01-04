// ==UserScript==
// @name         Для Куратора/Заместителя 21-25
// @namespace    https://forum.blackrussia.online
// @version      1.21
// @description  For Curators and Deputy Curators
// @author       Niletto
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator Niletto1
// @icon https://sun6-23.userapi.com/s/v1/ig1/Bg7Sgc3yqNZ1F5YedeolIhnyRKIclMmKRAjpf9Rzj0XKAsgR9fLgLgNB3TUBDBF_N7XKKgPK.jpg?size=2155x2155&quality=96&crop=2,2,2155,2155&ava=1
// @downloadURL https://update.greasyfork.org/scripts/530611/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%2021-25.user.js
// @updateURL https://update.greasyfork.org/scripts/530611/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%2021-25.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
  const PIN_PREFIX = 2; //  префикс закрепить
  const TRANSFER_PREFIX1 = 20; //  префикс передачи админам 21
  const TRANSFER_PREFIX2 = 21; //  префикс передачи в обжалования 21
  const TRANSFER_PREFIX3 = 22; //  префикс передачи в жб на игроков 21
  const TRANSFER_PREFIX4 = 23; //  префикс передачи в тех раздел 21
  const TRANSFER_PREFIX5 = 24 ; //  префикс передачи в жб на тех 21
  const TRANSFER_PREFIX6 = 25; //  префикс передачи админам 22
  const TRANSFER_PREFIX7 = 26; //  префикс передачи в обжалования 22
  const TRANSFER_PREFIX8 = 27; //  префикс передачи в жб на игроков 22
  const TRANSFER_PREFIX9 = 28; //  префикс передачи в тех раздел 22
  const TRANSFER_PREFIX10 = 29; //  префикс передачи в жб на тех 22
  const TRANSFER_PREFIX11 = 30; //  префикс передачи админам 23
  const TRANSFER_PREFIX12 = 31; //  префикс передачи в обжалования 23
  const TRANSFER_PREFIX13 = 32; //  префикс передачи в жб на игроков 23
  const TRANSFER_PREFIX14 = 33; //  префикс передачи в тех раздел 23
  const TRANSFER_PREFIX15 = 34; //  префикс передачи в жб на тех 23
  const TRANSFER_PREFIX16 = 35; //  префикс передачи админам 24
  const TRANSFER_PREFIX17 = 36; //  префикс передачи в обжалования 24
  const TRANSFER_PREFIX18 = 37; //  префикс передачи в жб на игроков 24
  const TRANSFER_PREFIX19 = 38; //  префикс передачи в тех раздел 24
  const TRANSFER_PREFIX20 = 39; //  префикс передачи в жб на тех 24
  const TRANSFER_PREFIX21 = 40; //  префикс передачи админам 25
  const TRANSFER_PREFIX22 = 41; //  префикс передачи в обжалования 25
  const TRANSFER_PREFIX23 = 42; //  префикс передачи в жб на игроков 25
  const TRANSFER_PREFIX24 = 43; //  префикс передачи в тех раздел 25
  const TRANSFER_PREFIX25 = 44; //  префикс передачи в жб на тех 25
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
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
        title: 'Купил ИВ через трейд',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Благодарим вас за обратную связь. Ваше обращение было принято к рассмотрению, и мы вынесли следующий вердикт.[/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Была проведена повторная проверка. В ходе которой было выявлено следующее:<br>' +
        '[COLOR=rgb(255, 0, 0)]4.01.[/COLOR] Создавая игровой аккаунт на нашем проекте, игрок автоматически соглашается со всеми правилами проекта.<br><br>' +
        '[CENTER]Вам через трейд-систему переводились денежные средства от продавца игровой валюты. Ошибки в переводе быть не может, поскольку между вами не было взаимодействий, а также вы зашли в игру в одно время, что уже дает нам дополнительные домыслы о вашем нарушении. Об ошибочном переводе вы никому не сообщали. Исходя из вышеперечисленного делаю вывод, что вы знали от кого и с какой целью вам переводяться денежные средства. Соответственно вы предполагали тот вариант, что ваш игровой аккаунт может быть заблокированным, но почему-то сослались на некомпетентность технического специалиста или же, что данное действие вам сойдёт с рук. Мы понимаем, что блокировка аккаунта приносит вам не самые лучшие эмоции, но хочу вам напомнить, что ваш аккаунт был заблокирован из-за ваших отрицательных действий, которые в дальнейшем могли испортить экономику сервера. <br><br>' +
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
        title: 'Покупка ИВ у бота',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]На ваш банковский счет поступили денежные средства от Ботовода. [COLOR=rgb(255, 0, 0)]Бот[/COLOR] – это программа, задачей которой является выполнение определенных функций с целью заработать игровую валюту для последующей продажи. В результате, на ваш счет были зачислены игровые средства.[/CENTER]<br><br>' +
        '[CENTER]Прошло некоторое время, и вы без колебаний решили снять эти средства с банковского счета. Это было ожидаемо, так как вы знали о предстоящем переводе.[/CENTER]<br>' +
        '[CENTER]Следует отметить, что в наше время использование ботов для заработка игровой валюты становится все более распространенным явлением. Однако важно помнить, что подобные операции могут повлечь за собой нарушение пункта правил [COLOR=rgb(255, 0, 0)]2.28.[/COLOR][/CENTER] <br><br>' +
        '[CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/SPOILER]<br>' +
        '[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'Обход системы 2.21',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств и системы логирования, было принято решение, что наказание выдано [COLOR=rgb(0, 255, 0)]верно. [/COLOR][/CENTER]<br>'+
        '[CENTER]Вы нарушили правило пункта [COLOR=rgb(255, 0, 0)]2.21[/COLOR] общих правил проекта. [SPOILER="2.21"][COLOR=rgb(255, 0, 0)]2.21. [/COLOR]Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/SPOILER][/CENTER] <br>' +
        "[CENTER]Хотелось бы напомнить, что вы автоматически соглашаетесь со всеми установленными правилами и обязуетесь их соблюдать в полной мере при регистрации своего игрового аккаунта на любом из серверов проекта.[/CENTER] <br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Трансфер 4.05',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств и системы логирования, было принято решение, что наказание выдано [COLOR=rgb(0, 255, 0)]верно. [/COLOR][/CENTER]<br>'+
        '[CENTER]На проекте запрещено перекидывать игровую валюту с основного аккаунта на твинк аккаунт или же наоборот. Ваш аккаунт был заблокирован по пункту [COLOR=rgb(255, 0, 0)]4.05[/COLOR] общих правил проекта.[SPOILER="4.05"][COLOR=rgb(255, 0, 0)]4.05.[/COLOR] Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER] <br>' +
        "[CENTER]Хотелось бы напомнить, что вы автоматически соглашаетесь со всеми установленными правилами и обязуетесь их соблюдать в полной мере при регистрации своего игрового аккаунта на любом из серверов проекта.[/CENTER] <br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: CLOSE_PREFIX,
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
        title: 'Жду ответ в личке',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Отписал вам в личные сообщения на форуме. <br> Ожидаю от вас ответа.[/CENTER]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
         prefix: PIN_PREFIX,
         status: true,
    },
    {
        title: 'Покупка ИВ у бота',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]На ваш банковский счет поступили денежные средства от Ботовода. [COLOR=rgb(255, 0, 0)]Бот[/COLOR] – это программа, задачей которой является выполнение определенных функций с целью заработать игровую валюту для последующей продажи. В результате, на ваш счет были зачислены игровые средства.[/CENTER]<br><br>' +
        '[CENTER]Прошло некоторое время, и вы без колебаний решили снять эти средства с банковского счета. Это было ожидаемо, так как вы знали о предстоящем переводе.[/CENTER]<br>' +
        '[CENTER]Следует отметить, что в наше время использование ботов для заработка игровой валюты становится все более распространенным явлением. Однако важно помнить, что подобные операции могут повлечь за собой нарушение пункта правил [COLOR=rgb(255, 0, 0)]2.28.[/COLOR][/CENTER] <br>' +
        '[CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/SPOILER]<br>' +
        '[CENTER][COLOR=rgb(255,207,64)]Остались у вас какие-либо вопросы, касательно блокировки аккаунта?[/color][/CENTER]<br>' +
        '[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
         prefix: PIN_PREFIX,
         status: true,
	},
	{
        title: 'Купил ИВ у игрока',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Благодарим вас за обратную связь. Ваше обращение было принято к рассмотрению, и мы вынесли следующий вердикт.[/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Была проведена повторная проверка. В ходе которой было выявлено следующее:<br>' +
        '[COLOR=rgb(255, 0, 0)]4.01.[/COLOR] Создавая игровой аккаунт на нашем проекте, игрок автоматически соглашается со всеми правилами проекта.<br><br>' +
        '[CENTER]Вам на банковский счёт переводились денежные средства от продавца игровой валюты. Ошибки в переводе быть не может, после перевода деньги благополучно снимались. Об ошибочном переводе вы никому не сообщали. Исходя из вышеперечисленного делаю вывод, что вы знали от кого и с какой целью вам переводяться денежные средства. Соответственно вы предполагали тот вариант, что ваш игровой аккаунт может быть заблокированным, но почему-то сослались на некомпетентность технического специалиста или же, что данное действие вам сойдёт с рук. Мы понимаем, что блокировка аккаунта приносит вам не самые лучшие эмоции, но хочу вам напомнить, что ваш аккаунт был заблокирован из-за ваших отрицательных действий, которые в дальнейшем могли испортить экономику сервера. <br><br>' +
        '[CENTER]Пытаться обмануть техническую администрацию аналогично нету смысла, с данными игроками вы никогда не взаимодействовали и взаимодействовать не могли. Ваши действия противоречат основным принципам нашей игры, созданной для увлекательного и справедливого игрового опыта всех пользователей, которые присоединяются к нашему проекту чтобы получить незабываемые впечатления от игры.<br><br>' +
        '[CENTER]На основании имеющейся информации, решение технического специалиста признано корректным. Нарушений с его стороны нету. Доказательства на каждое слово и действие имеются. С учетом этого, решение технического специалиста выглядит обоснованным и справедливым, ссылаясь на правила проекта и попутно отвечая на Ваши вопросы.<br><br>' +
        '[CENTER]Наша задача - обеспечить честную и справедливую среду для всех пользователей, и нарушение правил в отношении игровой валюты может нанести вред игровой экономике и репутации проекта.<br><br>' +
        '[CENTER]Вы совершили грубейшее нарушение правил проекта, за что понесли заслуженное наказание от технических специалистов. Технический специалист действовал согласно должностным инструкциям, придерживаясь правила 2.28. Это правило имеет крайне серьезное значение, и мы призываем каждого участника соблюдать его безукоризненно. <br><br>' +
        '[CENTER]Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что данный пункт не подлежит обжалованию, и каждый участник должен принять его как часть ответственности за свои действия.<br><br>' +
        '[CENTER]Для создания положительной и уважительной игровой атмосферы призываем каждого из вас проявлять сознательность и уважение к правилам. Вместе мы строим прекрасное и дружелюбное сообщество, которое уважает всех и каждого.<br><br>' +
        '[CENTER]С учетом всего сказанного, давайте будем бдительны и помнить, что соблюдение правил - это залог успешной и приятной игры для всех.<br><br>' +
        '[CENTER]Технический специалист действовал согласно должностным инструкциям, вердикт и наказания верны. В независимости от того, хотели Вы купить-продать или просто поинтересоваться, наказание предусмотрено по пункту 2.28 правил, Выше приложил описание. Любые шутки на тему покупки/продажи игровой валюты также наказуемы.<br><br>' +
        '[CENTER]Помните, что ваше поведение в игре оказывает влияние на ее общую атмосферу и удовлетворение всех игроков.<br><br>' +
        '[CENTER][COLOR=rgb(255,207,64)]Остались у вас какие-либо вопросы, касательно блокировки аккаунта?[/CENTER][/COLOR]<br>' +
        '[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/CENTER]<br>' +
        '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
         prefix: PIN_PREFIX,
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
    {
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Перенаправление тем 21ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Перенаправление в ТР 21',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технический раздел"[/COLOR] сервера [COLOR=rgb(0, 127, 255)]16 | AZURE. [/color][/center]',
		prefix: TRANSFER_PREFIX4,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Тех 21',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(0, 127, 255)]16 | AZURE. [/color][/center]',
		prefix: TRANSFER_PREFIX5,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Адм 21',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(0, 127, 255)]16 | AZURE. [/color][/center]',
		prefix: TRANSFER_PREFIX1,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Игр 21',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(0, 127, 255)]16 | AZURE. [/color][/center]',
		prefix: TRANSFER_PREFIX3,
		status: false,
	},
	{
        title: 'Перенаправление в ОБЖ Адм 21',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(0, 127, 255)]16 | AZURE. [/color][/center]',
		prefix: TRANSFER_PREFIX2,
		status: false,
	},
{

        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Перенаправление тем 22ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Перенаправление в ТР 22',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технический раздел"[/COLOR] сервера [COLOR=rgb(105, 105, 105)]17 | PLATINUM. [/color][/center]',
		prefix: TRANSFER_PREFIX9,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Тех 22',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(105, 105, 105)]17 | PLATINUM. [/color][/center]',
		prefix: TRANSFER_PREFIX10,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Адм 22',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(105, 105, 105)]17 | PLATINUM. [/color][/center]',
		prefix: TRANSFER_PREFIX6,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Игр 22',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(105, 105, 105)]17 | PLATINUM. [/color][/center]',
		prefix: TRANSFER_PREFIX8,
		status: false,
	},
	{
        title: 'Перенаправление в ОБЖ Адм 22',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(105, 105, 105)]17 | PLATINUM. [/color][/center]',
		prefix: TRANSFER_PREFIX7,
		status: false,
	},
{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Перенаправление тем 23ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Перенаправление в ТР 23',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технический раздел"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
		prefix: TRANSFER_PREFIX14,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Тех 23',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
		prefix: TRANSFER_PREFIX15,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Адм 23',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
		prefix: TRANSFER_PREFIX11,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Игр 23',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
		prefix: TRANSFER_PREFIX13,
		status: false,
	},
	{
        title: 'Перенаправление в ОБЖ Адм 23',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
		prefix: TRANSFER_PREFIX12,
		status: false,
	},
{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Перенаправление тем 24ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Перенаправление в ТР 24',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технический раздел"[/COLOR] сервера [COLOR=rgb(128, 128, 128)]19 | GRAY. [/color][/center]',
		prefix: TRANSFER_PREFIX19,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Тех 24',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(128, 128, 128)]19 | GRAY. [/color][/center]',
		prefix: TRANSFER_PREFIX20,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Адм 24',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(128, 128, 128)]19 | GRAY. [/color][/center]',
		prefix: TRANSFER_PREFIX16,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Игр 24',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(128, 128, 128)]19 | GRAY. [/color][/center]',
		prefix: TRANSFER_PREFIX18,
		status: false,
	},
	{
        title: 'Перенаправление в ОБЖ Адм 24',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(0, 255, 127)][COLOR=rgb(128, 128, 128)]19 | GRAY. [/color][/center]',
		prefix: TRANSFER_PREFIX17,
		status: false,
	},
{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Перенаправление тем 25ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Перенаправление в ТР 25',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технический раздел"[/COLOR] сервера [COLOR=rgb(200, 233, 233)]20 | ICE. [/color][/center]',
		prefix: TRANSFER_PREFIX24,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Тех 25',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(200, 233, 233)]20 | ICE. [/color][/center]',
		prefix: TRANSFER_PREFIX25,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Адм 25',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(200, 233, 233)]20 | ICE. [/color][/center]',
		prefix: TRANSFER_PREFIX21,
		status: false,
	},
	{
        title: 'Перенаправление в ЖБ Игр 25',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(200, 233, 233)]20 | ICE. [/color][/center]',
		prefix: TRANSFER_PREFIX23,
		status: false,
	},
	{
        title: 'Перенаправление в ОБЖ Адм 25',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
		'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(200, 233, 233)]20 | ICE. [/color][/center]',
		prefix: TRANSFER_PREFIX22,
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

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX1, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX2, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX3, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX4, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX5, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX6, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX7, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX8, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX9, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX10, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX11, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX12, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX13, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX14, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX15, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX16, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX17, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX18, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX19, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX20, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX21, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX22, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX23, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX24, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX25, false));
	$('button#command').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
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

	function editThreadData(prefix, pin = false, may_lens = true) {
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
	discussion_open: 1,
	sticky: 1,
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
	}),
	}).then(() => location.reload());
	}
	if(may_lens === true) {
	if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
	moveThread(prefix, 230); }

	if(prefix == WAIT_PREFIX) {
	moveThread(prefix, 917);
	}

        if(prefix == TRANSFER_PREFIX1) {
				moveThread(prefix, 721);
      }
        if(prefix == TRANSFER_PREFIX3) {
				moveThread(prefix, 723);
			}
      }
        if(prefix == TRANSFER_PREFIX5) {
				moveThread(prefix, 1197);
			}
        if(prefix == TRANSFER_PREFIX4) {
				moveThread(prefix, 701);
			}
        if(prefix == TRANSFER_PREFIX2) {
				moveThread(prefix, 724);
			}
        if(prefix == TRANSFER_PREFIX6) {
				moveThread(prefix, 783);
      }
        if(prefix == TRANSFER_PREFIX8) {
				moveThread(prefix, 785);
			}
        if(prefix == TRANSFER_PREFIX10) {
				moveThread(prefix, 1198);
			}
        if(prefix == TRANSFER_PREFIX9) {
				moveThread(prefix, 757);
			}
        if(prefix == TRANSFER_PREFIX7) {
				moveThread(prefix, 786);
			}
        if(prefix == TRANSFER_PREFIX11) {
				moveThread(prefix, 842);
      }
        if(prefix == TRANSFER_PREFIX13) {
				moveThread(prefix, 844);
			}
        if(prefix == TRANSFER_PREFIX15) {
				moveThread(prefix, 1199);
			}
        if(prefix == TRANSFER_PREFIX14) {
				moveThread(prefix, 815);
			}
        if(prefix == TRANSFER_PREFIX12) {
				moveThread(prefix, 845);
			}
        if(prefix == TRANSFER_PREFIX16) {
				moveThread(prefix, 883);
      }
        if(prefix == TRANSFER_PREFIX18) {
				moveThread(prefix, 885);
			}
        if(prefix == TRANSFER_PREFIX20) {
				moveThread(prefix, 1200);
			}
        if(prefix == TRANSFER_PREFIX19) {
				moveThread(prefix, 857);
			}
        if(prefix == TRANSFER_PREFIX17) {
				moveThread(prefix, 886);
			}
        if(prefix == TRANSFER_PREFIX21) {
				moveThread(prefix, 952);
                       }
        if(prefix == TRANSFER_PREFIX23) {
				moveThread(prefix, 954);
			}
        if(prefix == TRANSFER_PREFIX25) {
				moveThread(prefix, 1201);
			}
        if(prefix == TRANSFER_PREFIX24) {
				moveThread(prefix, 925);
			}
        if(prefix == TRANSFER_PREFIX22) {
				moveThread(prefix, 955);
			}
        if(prefix == COMMAND_PREFIX) {
				moveThread(prefix, 490);
        }
	}

	function moveThread(prefix, type) {
	// Перемещение темы
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
} )( );

const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

const Button16 = buttonConfig("ЖБ ТЕХ 21", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9621-chilli.1202/');
const Button17 = buttonConfig("ЖБ ТЕХ 22", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9622-choco.1203/');
const Button18 = buttonConfig("ЖБ ТЕХ 23", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9623-moscow.1204/');
const Button19 = buttonConfig("ЖБ ТЕХ 24", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9624-spb.1205/');
const Button20 = buttonConfig("ЖБ ТЕХ 25", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9625-ufa.1206/');
const ButtonComp16 = buttonConfig("ЖБ ИГР 21", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.994/');
const ButtonComp17 = buttonConfig("ЖБ ИГР 22", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1036/');
const ButtonComp18 = buttonConfig("ЖБ ИГР 23", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1082/');
const ButtonComp19 = buttonConfig("ЖБ ИГР 24", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1124/');
const ButtonComp20 = buttonConfig("ЖБ ИГР 25", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1167/');

bgButtons.append(Button16);
bgButtons.append(Button17);
bgButtons.append(Button18);
bgButtons.append(Button19);
bgButtons.append(Button20);
bgButtons.append(ButtonComp16);
bgButtons.append(ButtonComp17);
bgButtons.append(ButtonComp18);
bgButtons.append(ButtonComp19);
bgButtons.append(ButtonComp20);