// ==UserScript==
// @name         For the management of the technical department
// @namespace    https://forum.blackrussia.online
// @version      10.7.5
// @description  Для определенного круга лиц
// @author       Denny Archer
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator Denny Archer
// @icon https://i.dailymail.co.uk/1s/2021/12/07/18/26397236-10285081-ANSWER_BLOOD_DIAMOND_This_2006_political_war_thriller_raked_in_a-a-68_1638900061648.jpg
// @downloadURL https://update.greasyfork.org/scripts/532528/For%20the%20management%20of%20the%20technical%20department.user.js
// @updateURL https://update.greasyfork.org/scripts/532528/For%20the%20management%20of%20the%20technical%20department.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
    const PIN_PREFIX = 2; //  префикс закрепить
    const COMMAND_PREFIXX = 10; // команде проекта
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [     
        {
        title: 'Перенаправление в поддержку',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5); color: rgb(80,200,120, 1)',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Обратитесь в техническую поддежку проекта.<br><br>Конктактная информация:[/CENTER]<br>'+
        '[CENTER]Telegram - @br_techBot[/CENTER]<br>'+
        '[CENTER]VK - vk.com/br_tech[/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: WATCHED_PREFIX,
        status: false,
    },
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Рассмотрение Жалоб на Теховᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
        {
        title: 'Покупка ив у бота',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER]На ваш банковский счет поступили денежные средства от Ботовода. Бот – это программа, задачей которой является выполнение определенных функций с целью заработать игровую валюту для последующей продажи. В результате, на ваш счет были зачислены игровые средства.[/CENTER]<br><br>' +
        '[CENTER]Прошло некоторое время, и вы без колебаний решили снять эти средства с банковского счета. Это было ожидаемо, так как вы знали о предстоящем переводе.[/CENTER]<br><br>' +
        '[CENTER]Следует отметить, что в наше время использование ботов для заработка игровой валюты становится все более распространенным явлением. Однако важно помнить, что подобные операции могут повлечь за собой нарушение пункта правил 2.28.[/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
         "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: CLOSE_PREFIX,
		status: false,
	},
        {
        title: 'взломал акк игрока',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
            '[CENTER]Поступило обращение от игрока, о взломе его игрового аккаунта. После восстановления доступа к игровому аккаунту, игрок обнаружил, то-что его игровое имущество пропало. <br>После проверки системы логирования, выяснилось, что данная игровая валюта во время взлома была переведена на ваш аккаунт. <br>Думаете это совпадение?<br>Ваш интернет протокол (IP) абсолютно схож с (IP) взломанного игрока.<br>Игровые аккаунты обжалованию/апелляции не подлежат.<br><br>[COLOR=rgb(255, 255, 0)][SIZE=4][I][ICODE]Остались ли у вас вопросы касаемо данной блокировки? Ожидаю ваш ответ.[/ICODE][/COLOR]',
	},
                {
        title: 'покупка ИВ через трейд',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
            '[CENTER]На ваш счёт с помощью системы трейда поступила игровая валюта от игрока, который продает игровую валюту. До этого момента вы не взаимодействовали; договорились встретиться вне игры, что нельзя подтвердить. Встретились, получили деньги, что является нарушением правил. Никаких обсуждений в игре не было, поэтому можно предположить, что произошла покупка игровой валюты.<br>Пункт 2.28<br>[SPOILER]<br>2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта<br>Примечание: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>Примечание: также запрещен обмен доната на игровые ценности и наоборот;<br>Пример: пополнение донат счет любого игрока взамен на игровые ценности;<br>Исключение: официальная покупка через сайт.<br>[/SPOILER]<br><br>'+
                    '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
                    "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: CLOSE_PREFIX,
		status: false,
     },
	{
        title: 'Бан по IP',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Вы попали на заблокированный айпи адрес. Ваш аккаунт не находится в блокировке. Переживать не стоит. Причиной попадания в данную ситуацию могло быть разное, например, смена мобильного интернета, переезд и тому подобное. Чтобы избежать данную ситуацию, вам необходимо перезагрузить телефон или воспользоваться услугами VPN. Приносим свои извинения за доставленные неудобства. [/CENTER]<br>'+
        '[CENTER]Желаем приятного времяпровождения на нашем проекте.[/CENTER]<br>'+
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: WATCHED_PREFIX,
        status: false,
    },
        {
        title: 'Тариф BR, награды не зачислились',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER] Если вы приобрели тариф Black Russia, но награды не были зачислены или у Вас не получается активировать номер с тарифом Black Russia, тогда убедитесь в следующем:[/CENTER]<br><br>'+
        '[CENTER]1. У вас тариф Black Russia, а не другой тариф, например, тариф Black.[/CENTER]<br>'+
        '[CENTER]2. Номер активирован.[/CENTER]<br>'+
        '[CENTER]3. После активации номера прошло более 48-ми часов.[/CENTER]<br><br>'+
        '[CENTER]Если пункты выше не описывают вашу ситуацию в обязательном порядке обратитесь в службу поддержки для дальнейшего решения:[/CENTER]<br><br>'+
        '[CENTER]На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot[/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: WATCHED_PREFIX,
        status: false,
    },
        {
        title: 'Выдано верно',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
      '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]После проверки системы логирования и обсуждения с коллегами, мы пришли к выводу, что наказание было выдано верно.[/CENTER]<br>'+
        '[CENTER]Мы заметили, что у вас имеются нарушения правил проекта, за которые и были применены меры наказания.[/CENTER]<br>'+
        '[CENTER]Рекомендуем вам более детально ознакомиться с [URL= https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/][COLOR=rgb(255,207,64)]правилами проекта[/COLOR].[/URL][/CENTER]<br>' +
         '[CENTER]На данный момент мы не готовы снизить срок блокировки или разблокировать аккаунт.[/CENTER]<br>'+
            '[CENTER]Мы надеемся, что вы понимаете данную ситуацию и не возникнет никаких претензий.[/CENTER]<br><br>'+
            '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Беседа с техом',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]С Техническим Специалистом будет проведена строгая профилактическая беседа.[/CENTER]<br>'+
        '[CENTER]Приносим свои извинения за предоставленные неудобства.[/CENTER]<br>' +
		'[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: WATCHED_PREFIX,
		status: false,
     },
        {
        title: 'Наруш правил при взломе',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]К сожалению, если вы были жертвой взлома своего аккаунта, что привело к нарушению правил игры, это все равно не освобождает его от ответственности. Правила игры предусматривают наказание за нарушения, даже если они были совершены без ведома владельца аккаунта.[/CENTER]<br><br>'+
        '[CENTER]Наказание за нарушения правил обычно зависит от серьезности нарушения и может варьироваться от временной блокировки аккаунта до перманентной. В любом случае, Вы должны осознавать, что Вы несёте ответственность за безопасность своего аккаунта и должны предпринимать все необходимые меры для его защиты.[/CENTER]<br><br>' +
		'[CENTER]Таким образом, даже если Вы стали жертвой взлома аккаунта, он все равно может быть подвергнут наказанию за нарушение правил игры, если его аккаунт был использован для этого.[/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: PIN_PREFIX,
		status: false,
     },
     {
        title: 'Купил ИВ 2.28',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
         "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Благодарим вас за обратную связь. Ваше обращение было принято к рассмотрению, и мы вынесли следующий вердикт.[/CENTER]<br><br>'+
        '[CENTER]Была проведена повторная проверка. В ходе которой было выявлено следующее:<br><br>' +
        '[CENTER]4.01. Создавая игровой аккаунт на нашем проекте, игрок автоматически соглашается со всеми правилами проекта.<br><br>' +
        '[CENTER]Вам на банковский счёт неоднократно переводились денежные средства от продавцов игровой валют. Ошибки в переводе быть не может, после перевода деньги благополучно снимались. Об ошибочном переводе вы никому не сообщали. Исходя из вышеперечисленного делаю вывод, что вы знали от кого и с какой целью вам переводяться денежные средства. Соответственно вы предполагали тот вариант, что ваш игровой аккаунт может быть заблокированным, но почему-то сослались на некомпетентность технического специалиста или же, что данное действие Вам сойдёт с рук. Мы понимаем, что блокировка аккаунта приносит вам не самые лучшие эмоции, но хочу вам напомнить, что ваш аккаунт был заблокирован из-за ваших отрицательных действий, которые в дальнейшем могли испортить экономику сервера. <br><br>' +
        '[CENTER]Пытаться обмануть техническую администрацию аналогично нету смысла, с данными игроками вы никогда не взаимодействовали и взаимодействовать не могли. Ваши действия противоречат основным принципам нашей игры, созданной для увлекательного и справедливого игрового опыта всех пользователей, которые присоединяются к нашему проекту чтобы получить незабываемые впечатления от игры.<br><br>' +
        '[CENTER]На основании имеющейся информации, решение технического специалиста признано корректным. Нарушений с его стороны нету. Доказательства на каждое слово и действие имеются. С учетом этого, решение технического специалиста выглядит обоснованным и справедливым, ссылаясь на правила проекта и попутно отвечая на Ваши вопросы.<br><br>' +
        '[CENTER]Наша задача - обеспечить честную и справедливую среду для всех пользователей, и нарушение правил в отношении игровой валюты может нанести вред игровой экономике и репутации проекта.<br><br>' +
        '[CENTER]Вы совершили грубейшее нарушение правил проекта, за что понесли заслуженное наказание от технических специалистов. Технический специалист действовал согласно должностным инструкциям, придерживаясь правила 2.28. Это правило имеет крайне серьезное значение, и мы призываем каждого участника соблюдать его безукоризненно. <br><br>' +
        '[CENTER]Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что данный пункт не подлежит обжалованию, и каждый участник должен принять его как часть ответственности за свои действия.<br><br>' +
        '[CENTER]Для создания положительной и уважительной игровой атмосферы призываем каждого из вас проявлять сознательность и уважение к правилам. Вместе мы строим прекрасное и дружелюбное сообщество, которое уважает всех и каждого.<br><br>' +
        '[CENTER]С учетом всего сказанного, давайте будем бдительны и помнить, что соблюдение правил - это залог успешной и приятной игры для всех.<br><br>' +
        '[CENTER]Технический специалист действовал согласно должностным инструкциям, вердикт и наказание верны. В независимости от того, хотели Вы купить-продать или просто поинтересоваться, наказание предусмотрено по пункту 2.28 правил, Выше приложил описание. Любые шутки на тему покупки/продажи игровой валюты также наказуемы.<br><br>' +
        '[CENTER]Помните, что ваше поведение в игре оказывает влияние на ее общую атмосферу и удовлетворение всех игроков.<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Наказание остается без изменений.[/ICODE][/COLOR][/FONT][/CENTER]'+
         "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Продан/Передан 2.41',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств было принято решение, что наказание, выданное техническим специалистом, является верным.[/CENTER]<br>'+
        '[CENTER]Вы нарушили правило пункта 2.41 общих правил проекта. [SPOILER="2.41"][COLOR=rgb(255, 0, 0)]2.41. [/COLOR]Передача своего личного игрового аккаунта третьим лицам | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/SPOILER][/CENTER] <br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Трансфер 4.05',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств было принято решение, что наказание, выданное техническим специалистом, является верным.[/CENTER]<br>'+
        '[CENTER]Вы нарушили правило пункта 4.05 общих правил проекта.[SPOILER="4.05"][COLOR=rgb(255, 0, 0)]4.05.[/COLOR] Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER] <br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {

        title: 'Чужая привязка',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. [/CENTER] <br>' +
        '[CENTER]Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей [/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'Будет разблокирован',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Ваш аккаунт будет разблокирован в течении 24 часов.[/CENTER]<br>' +
        '[CENTER]Надеемся, что в процессе разблокировки никакое имущество не слетело в государство.[/CENTER]<br>' +
        '[CENTER]Если возникли проблемы с имуществом, пожалуйста, создайте новую тему для обсуждения компенсации.[/CENTER]<br>' +
        '[CENTER]Приносим свои извинения за предоставленные неудобства.[/CENTER]<br>' +
        '[CENTER]Спасибо за понимание![/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: WATCHED_PREFIX,
		status: false,
     },
         {
        title: 'Отсутсвует доступ к привязке(-ам)',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER] Здравствуйте, уважаемый игрок!<br>Мы не можем подтвердить ваши слова без предоставления доказательств.<br>Удаленный аккаунт привязки указывает на то, что на аккаунте может быть привязка другого пользователя.<br><br>'+
              '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
             prefix: WATCHED_PREFIX,
		status: false,
    },
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Чистка от оффтопа ЖБ на техᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #008000',
    },
        {
		title: 'Вам в раздел государственных орг.',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		 "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Вам в раздел криминальных орг.',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		 "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера [/CENTER]<br><br>'+
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'Форма подачи "ЖБ НА ТЕХ"',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>' +
        '[CENTER]Пример: Lev_Kalashnikov | махинации<br>[COLOR=rgb(255, 0, 0)]Форма заполнения темы:[/COLOR]<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code][/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше. В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться. Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста. Заранее, настоятельно рекомендуем ознакомиться с [URL= https://forum.blackrussia.online/forums/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.231/][COLOR=rgb(225,204,79)]данным разделом[/COLOR].[/URL][/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(244,169,0)]Ваша жалоба также может быть отказана[/COLOR]<br><br>А) Если в содержании темы присутствует оффтоп/оскорбления.<br> Б) Если в заголовке темы отсутствует никнейм технического специалиста.<br>В) С момента выдачи наказания прошло более 14 дней.[/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(0,128,0)]Благодарим вас за обращение![/COLOR][/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Жб на адм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER]Вы получили наказание от Администратора сервера. Ваше обращение не относится к разделу «Жалобы на Технических Специалистов».<br>' +
        '[CENTER]Пожалуйста, обратитесь в раздел «Жалобы на администрацию» вашего сервера.<br>Форма для подачи жалобы - [URL= https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/]Кликабельно.[/URL]<br>' +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
    },
	{
		title: 'ЖБ на игроков',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Данная тема не относится к разделу «Жалобы на Технических Специалистов». Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']Клик[/URL]" +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,

	},
    {
		title: 'ОБЖ Наказания от адм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения блокировки вам нужно обратиться в раздел «Обжалования» вашего сервера. <br> Форма подачи темы находится здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Кликабельно.[/URL]<br>" +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'НЕ ОТНОСИТСЯ',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']Кликабельно.[/URL]" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]',
		 prefix: UNACCEPT_PREFIX,
		 status: false,
	},
        {
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Обжалованияᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
     {
        title: 'ОБЖ одобрено',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5); color: rgb(0,128,0, 1)',
        content:
       '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Мы рассмотрели ваше обжалование, и пришли к вердикту, что срок блокировки аккаунта будет будет сокращён.[/CENTER]<br>' +
        '[CENTER]Рекомендуем вам ознакомиться с [URL= https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-25703465][COLOR=rgb(255,207,64)]правилами проекта[/COLOR][/URL], чтобы такого больше не повторилось. Мы очень надеемся, что данная ситуация станет для вас уроком.[/CENTER]<br>' +
        '[CENTER]К сожалению, мы не всегда сможем пойти к вам на встречу и обжаловать/амнистировать вас.[/FONT][/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/CENTER][/I][/SIZE]<br>',
		prefix: WATCHED_PREFIX,
		status: false,
    },
    {
        title: 'В ОБЖ отказано',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5); color: rgb(255,36,0, 1)',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
      '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Мы рады, что вы осознали свои ошибки. Настоятельно рекомендуем вам изучить правила проекта.<br>Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что каждый участник должен принять его как часть ответственности за свои действия.<br>Надеюсь, что данная ситуация станет для вас уроком и в будущем, вы больше не будете нарушать правила проекта.[/CENTER]<br>' +
        '[CENTER]Рекомендуем вам ознакомиться с [URL= https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/][COLOR=rgb(255,207,64)]правилами проекта[/COLOR].[/URL], чтобы такого больше не повторилось. Мы очень надеемся, что данная ситуация станет для вас уроком.[/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]В обжаловании отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
     {
        title: 'Не подлежит обж',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
         "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]В соответствии с правилами проекта, аккаунт, который был заблокирован, не подлежит разблокировке или обжалованию.<br> Это окончательное решение, принятое на основании действующих правил проекта.<br><br>" +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]В обжаловании отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
         "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: 'Срок блокировки будет снижен',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Проверив вашу историю наказаний, было принято решение о снижении срока блокировки аккаунта.<br>Будьте аккуратнее в следующие разы, ведь на встречу пойти мы вряд-ли сможем.<br><br>" +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br><br>",
		prefix: CLOSE_PREFIX,
		status: false,
	},
        {
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Передачаᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
        {
        title: 'Передано Руководству',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5); color: rgb(255,215,0, 1)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER]Ваше обращение передано Вышестоящему руководству технического отдела.<br>Создавать подобные темы не нужно, пожалуйста, ожидайте ответа.[/FONT][/CENTER]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: COMMAND_PREFIXX,
		status: true,
	},
        	{
        title: 'На рассмотрении у Тех. Спец',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5); color: rgb(0,149,182, 1)',
		content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
         '[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER][FONT=georgia]Ваша тема взята на рассмотрение.[/CENTER]<br>' +
        '[CENTER]Пожалуйста, ожидайте ответа от нашего технического специалиста.[/CENTER]<br>' +
        '[CENTER]Иногда рассмотрение темы может занять определенное время.[/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 255, 0)]Ваша тема взята на рассмотрение.[/COLOR][/FONT][/CENTER]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: TECHADM_PREFIX,
		status: true,
	},
        {
		title: 'Передача тестерам',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5); color: rgb(66,170,255, 1)',
		content:
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/COLOR]<br><br>' +
		"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]",
		  prefix: WAIT_PREFIX,
		  status: false,
	},
                {
	title: 'Команде проекта',
	dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5); color: rgb(255,215,0, 1)',
	content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
	"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>"+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
	prefix: COMMAND_PREFIX,
	status: true,
},
        {
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Закрытие темᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Нет окна блокировки',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'Срок подачи жб',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER]С момента выдачи наказания от технического специалиста прошло более 14-ти дней.<br>Пересмотр/изменение меры наказания невозможно, вы можете попробовать написать обжалование через N-ый промежуток времени.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию,амнистии.[/center]<br><br>'+
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
    },
	{
		title: 'Восст. доступа к аккаунту',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет ответственность за безопасность своего аккаунта.<br><br>" +
		'[CENTER]Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/FONT]<br>",
		prefix: WATCHED_PREFIX,
		status: false,
	},
        	{
        title: 'Нет ответа от игрока',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]К сожалению, ответа от вас так и не поступило. <br>Пожалуйста, создайте новую тему, если вы все ещё не согласны с выданным наказанием.<br><br>" +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'Дубль Темы',
        color: 'orange',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Данная тема является дубликатом вашей предыдущей темы. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован. На первый раз предупреждение будет устное, при повторном дублировании на ваш аккаунт будет выдвинуты санкции в виде штрафных баллов. При последующих нарушениях ваш формный аккаунт будет заблокирован. <br>" +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
     },
        {
title: 'Отсутствие ответа',
 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
"[CENTER]По техническим соображениям было принято решение закрыть данное обращение.<br>" +
"[CENTER] Пожалуйста, если данная проблема все ещё актуальна, оставьте новую заявку в данном разделе.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
	prefix: CLOSE_PREFIX,
	status: false,
},
        {
		title: 'Хочу занять должность',
		dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: CLOSE_PREFIX,
		status: false,
	},
                {
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Для рассмотрения обычных темᅠ ᅠ ᅠᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
        {
	title: 'Законопослушность',
	dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
	'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
	'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>[/CENTER]'+
	'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]<br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
	prefix: CLOSE_PREFIX,
	status: false,
},
        {
	title: 'Известно КП',
	dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
	'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
	"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
	'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I][/CENTER][/FONT][/SIZE]'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
	prefix: CLOSE_PREFIX,
	status: false,
},
        {
	title: 'Не является багом',
	dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
	'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br>' +
	'[CENTER]Проблема с которой вы столкнулись не является багом, ошибкой сервера.<br><br>[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]<br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
	prefix: UNACCEPT_PREFIX,
	status: false,
},
        {
	title: 'Сервер не отвечает',
	dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
	'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
	"[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
	"[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
	"[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
	"[LEFT]• Использование VPN; <br>"+
	"[LEFT]• Перезагрузка роутера.<br><br>" +

	"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +

	'[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
	'[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
	'[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
	'[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br>' +

	"[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]<br>"+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
	prefix: CLOSE_PREFIX,
	status: false,
},
 {
	title: 'ФОРМА',
	color: 'oswald: 3px; color: #DC143C; background: #FFEFD5; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER]/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
        {
		title: 'Отвязка привязок',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на Ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной «Чужая привязка». В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях. <br><br>" +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: CLOSE_PREFIX,
		status: false,
	},
        {
	title: 'Игрок будет заблокирован(Жб игроков)',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(65, 168, 95)][FONT=verdana]Игрок будет заблокирован[/COLOR][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Игрок не будет заблокирован(Жб игроков)',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(255, 0, 0)]Доказательств недостаточно для блокировки игрока[/COLOR][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/CENTER]",
    prefix: UNACCEPT_PREFIX,
	status: false,
},
       {
	title: 'Имущество восстановлено',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
	'[CENTER]Для активации восстановления используйте команды:[COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(127, 255, 0)]Решено[/COLOR][/CENTER][/FONT][/SIZE]',
	status: false,
	prefix: DECIDED_PREFIX,
},
        {
 	title: 'Кик за ПО',
 	content:
 	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
 	'[CENTER]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
 	prefix: CLOSE_PREFIX,
 	status: false,
},
        {
	title: 'Нет скринов/видео',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
        {
		title: 'Запрос доп. информации',
		dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
		content:
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER] Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5][FONT=Veranda]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
		'[CENTER][COLOR=rgb(255,165,0)][SIZE=4][I][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER]',
		prefix: PIN_PREFIX,
		status: true,

}


	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
    addButton('Тех. Спец', 'techspec', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('Рассмотрено', 'watched', 'border-radius: 50px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Решено', 'decided', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Закрыто', 'closed', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
    addButton('Команде проекта', 'teamProject', 'border-radius: 50px; margin-right: 10px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
    $('button#teamProject1').click(() => editThreadData(COMMAND_PREFIXX, true));

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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="georgia: 3px; margin-left: 3px; margin-top: 10px; border-radius: 30px;">Меню ответов</button>`,
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
				moveThread(prefix, 917); }
		}
        if(prefix == COMMAND_PREFIXX) {
				moveThread(prefix, 490); }
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
	})();