// ==UserScript==
// @name         Aleks Yurievich Script
// @namespace    http://tampermonkey.net/
// @version      7.3
// @description  Обновление 7.3 - 04.09.2025 - Удаление нескольких пунктов (потеряли актуальность). Переделал скрипт под себя.
// @author       Aleks_Yurievich
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.postimg.cc/DfQ2nFyG/photo-2024-10-28-20-46-22.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/482400/Aleks%20Yurievich%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/482400/Aleks%20Yurievich%20Script.meta.js
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
      title: 'Свой ответ',
      content:
    '[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/FONT][/SIZE] <br><br>' +
        "[FONT=georgia][COLOR=#D1D5D8][SIZE=3] . [/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][FONT=georgia][COLOR=Red][SIZE=3]Закрыто. [/COLOR][/FONT][/CENTER]',
    },

{
	  title: '| На рассмотрении |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение[/COLOR], ожидайте ответа. [/SIZE][/FONT]<br><br>"+
                 "[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрении[/ICODE][/COLOR]<br><br>",
        prefix: PINN_PREFIX,
	  status: true,
    },
{
    	   title: '| Тех. специалисту |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=RED]Техническому специалисту сервера [/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрении у тех. специалиста[/ICODE][/COLOR]<br><br>",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
    title: '| Жалоба одобрена |',
    content:
    "[SIZE=3][CENTER][B][FONT=Georgia][COLOR=#B8312F​]Добрый день, уважаемый игрок.[/COLOR] <br><br>"+
    "[COLOR=#D1D5D8]Ваша жалоба была одобрена, игрок получит наказание.[/COLOR]<br><br>"+
          "[COLOR=Green][ICODE]Одобрено[/ICODE][/FONT][/B][/CENTER][/COLOR][/SIZE]<br><br>",
            prefix: ACCСEPT_PREFIX,
    status: false,
},
{
	  title: '| В жб на адм |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел «Жалобы на администрацию».[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел «Жалобы на лидеров».[/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
    },
{
	  title: '| В жб на сотрудников орг-ции |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел жалоб на сотрудников той или иной организации.[/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел «Обжалование наказаний».[/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в технический раздел. [/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел «Жалобы на технических специалистов».[/SIZE][/FONT] <br><br>"+
                 "[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR]<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Нарушений не найдено |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока недостаточно. [/SIZE][/FONT]<br><br>"+
"[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока  отсутствуют. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока  отредактированы. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
    content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она составлена не по форме. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ее заголовок составлен не по форме. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений.  [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера. [/SIZE][/FONT] <br><br>"+
               "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки.[/SIZE][/FONT] <br><br>"+
               "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс (запись экрана). [/SIZE][/FONT] <br><br>"+
              "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нужен фрапс + промотка чата.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-его лица |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она написана от 3-его лица. Жалоба от третьего лица не принимается (она должна быть подана участником ситуации). [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дублирование темы |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Вам уже был дан ответ в прошлой теме. Просьба не создавать темы-дубликаты, иначе Ваш форумный аккаунт будет заблокирован. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| РП отыгровки для сотрудников не нужны |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Нарушений со стороны игрока нет, так как RP отыгровки не обязательны для совершения обыска, надевания наручников и тд. За игрока это делает система со своими системными отыгровками. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Неадекватная жалоба |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] В данном виде ваша жалоба не будет рассмотрена администрацией сервера. Составьте жалобу адекватно, создав новую тему. При повторных попытках дублирования данной темы Вы получите блокировку форумного аккаунта. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '| Док-ва в плохом качестве |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства представлены в плохом качестве. Доказательства на нарушение от игрока должны быть загружены в отличном формате, так, что бы все было видно без проблем. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
        	  title: '| Био одобрена |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,

},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как в ней содержится недостаточное количество информации о Вашем персонаже.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как она скопирована. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (имя/фамилия не на русском) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как Имя/фамилия написаны не на русском языке. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как заголовок биографии написан не по форме. [/SIZE][/FONT] <br><br>"+
      "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (не по форме) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как она составлена не по форме.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как Ваш возраст не совпадает с датой рождения. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,

},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как в ней допущено большое количество грамматических/пунктуационных ошибок. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
         },
  {
                	  title: '| Био отказ (nRP nick) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как у Вас nRP Nick_Name. [/SIZE][/FONT]  <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (присвоение супер-способностей) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как Вы присвоили своему персонажу супер-способности (то, чего не может быть в данной ситуации). [/SIZE][/FONT]   <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
          },
  {
                	  title: '| Био отказ (пропаганда политических и религиозных взглядов) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как в ней присутствует пропаганда политических/религиозных взглядов.. [/SIZE][/FONT]  <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
       },
  {
                	  title: '| Био отказ (дата рождения отсутствует/написана неполностью) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как Ваша дата рождения отсутствует/написана неполностью. [/SIZE][/FONT]  <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
       },
  {
                	  title: '| Био отказ (OOC информация в био) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как в ней присутствует OOC информация. [/SIZE][/FONT]  <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| RP биография (на рассмотрении) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша RP-биография находится на [COLOR=YELLOW]рассмотрении[/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрении[/ICODE][/COLOR]<br><br>",
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
           },
{
        	  title: '| RP ситуация одобрена |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-ситуация получает статус - [COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",

    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| RP ситуация (на рассмотрении) |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша RP-ситуация находится на [COLOR=YELLOW]рассмотрении[/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрении[/ICODE][/COLOR]<br><br>",
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
       },
  {
                	  title: '| RP ситуация отказ |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша RolePlay-ситуация получает статус - [COLOR=#FF0000]Отказано[/COLOR]. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
{
        	  title: '| RP организация одобрена |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша Неофициальная RolePlay-организация получает статус - [COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
        	  title: '| RP организация отказана |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша Неофициальная RolePlay-организация получает статус - [COLOR=RED]Отказано[/COLOR][/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
    prefix: UNACCСEPT_PREFIX,
	  status: false,
     },
{
        	  title: '| RP организация на рассмотрении |',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Добрый день, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша Неофициальная RolePlay-организация находится на [COLOR=YELLOW]рассмотрении[/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрении[/ICODE][/COLOR]<br><br>",
    prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,

           },


];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin');
	addButton('Отказано', 'unaccept');
	addButton('Одобрено', 'accepted');
	addButton('Теху', 'Texy');
    addButton('Закрыто', 'Zakrito');
    addButton('Ожидание', 'Ojidanie');
 	addButton('Ответы', 'selectAnswer');

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
	XF.alert(buttonsMarkup(buttons), null, 'by Aleks Yurievich');
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 0px; border-color: white; border-style: solid; margin-right: 5px; margin-bottom: 0px; background: black; text-decoration-style: wavy;">${name}</button>`,
);
}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="border-radius: 0px 0px; border-color: white; border-style: solid; margin-right: 7px; margin-bottom: 10px; background: black; text-decoration-style: wavy;">${name}${btn.title}</button>`,
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
	})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/im?peers=c59
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();