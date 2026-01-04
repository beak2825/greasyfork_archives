// ==UserScript==
// @name         Скрипт для ГКФ || GOLD
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Скрипт для ГКФ
// @author       August Feretty
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://sun6-22.userapi.com/s/v1/ig2/RZGuXZAD6kfgaNSlhG7GFWD9bDludhq93QWuoQVzST22Wv7HBIXPPfjxWC6uOVkaNTNWaR0G8qUOU0YjbeXWh27t.jpg?size=696x696&quality=95&crop=11,1,696,696&ava=1
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/486568/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%9A%D0%A4%20%7C%7C%20GOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/486568/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%9A%D0%A4%20%7C%7C%20GOLD.meta.js
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
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Одобрение/Отказ жалоб <<<<<<<<<<<<<<<<<<<<<<<<<|'
         },
{
	  title: '| Нарушений не найдено |',
     content:
    "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
	"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока недостаточно. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
	"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока отсутствуют. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
	 "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока отредактированы. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR],  так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
	 "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она составлена не по форме. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ее заголовок составлен не по форме. [/SIZE][/FONT] <br><br>"+
    "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED] 1.2. [/COLOR] [COLOR=lavender] В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: Nick_Name | Суть жалобы. [/COLOR][/SIZE][/FONT] <br><br>"+
 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED] Пример: [/COLOR] [COLOR=lavender] Bruce_Banner | nRP Drive [/COLOR][/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
	   "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
	   "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
	"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс (запись экрана). Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:
	   "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нужен фрапс + промотка чата. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
	 "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-его лица |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она написана от 3-его лица. Жалоба от третьего лица не принимается (она должна быть подана участником ситуации). Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Переношу вашу жалобу на нужный сервер для дальнейшего рассмотрения. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Перенаправлено[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Дублирование темы |',
	  content:
	 "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Вам уже был дан ответ в прошлой теме. Просьба не создавать темы-дубликаты, иначе Ваш форумный аккаунт будет заблокирован. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| РП отыгровки не нужны |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Нарушений со стороны игрока нет, так как RP отыгровки не обязательны для совершения обыска, надевания наручников и тд. За игрока это делает система со своими системными отыгровками. Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленными в данном разделе. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Неадекватная жалоба |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]В данном виде ваша жалоба не будет рассмотрена администрацией сервера. Составьте жалобу адекватно, создав новую тему. При повторных попытках дублирования данной темы Вы получите блокировку форумного аккаунта. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Док-ва в плохом качестве |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства предоставлены в плохом качестве. Доказательства на нарушение от игрока должны быть загружены в отличном формате, так, что бы все было видно без проблем. [/SIZE][/FONT] <br><br>"+
                "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Отказано, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
    	  title: '| Нарушение правил долга |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ниже приведены условия взятия денежных средств в долг, ознакомьтесь: [/SIZE][/FONT] <br><br>"+
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT]<br><br>"+
         "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Закрыто[/COLOR][/SIZE][/FONT]<br><br>",
        prefix: CLOSE_PREFIX,
	  status: false,
    },
{
    title: '| Стороннее ПО - читы, сборки |',
	  content:
		"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
           "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP Обман |',
	  content:
		"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT]<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Долг |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
         "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено, закрыто[/COLOR][/SIZE][/FONT]<br><br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| NonRP Nick |',
	  content:
	   "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.06.[/color] Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#ff0000]| Устное замечание + смена игрового никнейма[/color]. [/COLOR][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Oск Nick |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color]. [/COLOR][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
 "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Fake |',
	  content:
	  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
   "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Оск/Упом родни |',
	  content:
	  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
    "[B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Flood |',
	  content:
	     "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
               "[B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
            prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Caps |',
	  content:
	     "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Разговор не на русском |',
	  content:
	    "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]одобрена[/COLOR], игрок будет наказан по следующему пункту правил: [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#ff0000]| Устное замечание / Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
                	  title: '| Жалоба одобрена |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Данный игрок получит наказание в соответствии с общими правилами серверов.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
     prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
                	  title: '| Игрок уже наказан |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Данный игрок уже наказан.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Закрыто[/COLOR][/SIZE][/FONT]<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
      },
{
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Передача на рассмотрение <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
	  title: '| На рассмотрении |',
	  content:
  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение[/COLOR], пожалуйста, ожидайте ответа и не создавайте копии данной темы. В противном случае Вы можете получить блокировку форумного аккаунта. [/SIZE][/FONT]<br><br>"+
   "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=YELLOW]На рассмотрении[/COLOR][/SIZE][/FONT]<br><br>",
        prefix: PINN_PREFIX,
	  status: true,
},
{
    	   title: '| Тех. спецу |',
	  content:
	"[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B][/I]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=RED]Техническому специалисту сервера[/COLOR], пожалуйста, ожидайте ответа и не создавайте копии данной темы. В противном случае Вы можете получить блокировку форумного аккаунта. [/SIZE][/FONT]<br><br>"+
  "[I][B][CENTER][FONT=georgia][SIZE=3][COLOR=YELLOW]На рассмотрении у тех. специалиста[/COLOR][/SIZE][/FONT]<br><br>",
        prefix: TEXY_PREFIX,
	  status: true,
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
	})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/threads/%D1%82%D0%B5%D1%81%D1%82.6285985/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();