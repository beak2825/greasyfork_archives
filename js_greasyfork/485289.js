// ==UserScript==
// @name         Pistenkov для ГА
// @namespace    https://forum.blackrussia.online
// @version      0.3.5
// @description  Для упрощения работы
// @author       Pistenkov
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        Pistenkov
// @license      arefuer
// @collaborator Pistenkov
// @icon         https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/485289/Pistenkov%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/485289/Pistenkov%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createAnimatedSnow() {

        const snowflakes = [];

        function setupCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.id = 'snow-flakes';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.filter = 'blur(2px)';
            document.body.appendChild(canvas);

            return canvas.getContext('2d');
        }

        function createSnowflake(x, y) {
            const size = Math.random() * 2 + 1;
            const speedY = Math.random() * 1 + 1;
            const speedX = (Math.random() - 0.5) * 2;

            return { x, y, size, speedY, speedX };
        }

        function drawSnowflake(ctx, snowflake) {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }

        function updateSnowflakes(ctx) {
            for (let i = 0; i < snowflakes.length; i++) {
                const snowflake = snowflakes[i];

                snowflake.y += snowflake.speedY;
                snowflake.x += snowflake.speedX;

                if (snowflake.y > window.innerHeight || snowflake.x > window.innerWidth) {
                    snowflakes[i] = createSnowflake(Math.random() * window.innerWidth, Math.random() * -window.innerHeight);
                }

                drawSnowflake(ctx, snowflake);
            }
        }

        function animateSnow() {
            const ctx = setupCanvas();

            for (let i = 0; i < 500; i++) {
                snowflakes.push(createSnowflake(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }

            function animate() {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateSnowflakes(ctx);
                requestAnimationFrame(animate);
            }

            animate();
        }

        animateSnow();

    }

    function removeAnimatedSnow() {
        const snowCanvas = document.querySelector('#snow-flakes');
        document.body.removeChild(snowCanvas);
    }

    const uixLogo = document.querySelector('a.uix_logo img');
    uixLogo.src = 'https://i.postimg.cc/y8fk35Ds/uix-logo-cust-1.png';
    uixLogo.srcset = 'https://i.postimg.cc/y8fk35Ds/uix-logo-cust-1.png';

    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#29586c88';
    });

    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#15293788';
    });

    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'style-scrollbar';
    scrollbarStyle.textContent = `
    /* Стили для полосы прокрутки */
    ::-webkit-scrollbar {
        width: 16px;
    }

    /* Дорожка (track) */
    ::-webkit-scrollbar-track {
        background-color: #171e29;
    }

    /* Стиль полосы прокрутки */
    ::-webkit-scrollbar-thumb {
        background-color: #1f2b3b;
        border-radius: 0px;
        transition-duration: .3s;
    }

    /* Стиль полосы прокрутки при наведении */
    ::-webkit-scrollbar-thumb:hover {
        background-color: #2f4b6b;
        transition-duration: .3s;
    }
    `;
    document.head.appendChild(scrollbarStyle);

    const pageHeader = document.querySelector('.pageContent');
    const switchStyleBlock = document.createElement('label');
    switchStyleBlock.className = 'switch';
    switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 42px; margin-top: 2px;">Снег</span>
            </span>
        `;
    pageHeader.appendChild(switchStyleBlock);

    const styleToggleCheck = document.getElementById('styleToggleCheck');
    if (localStorage.getItem('snowEnabled') === 'true') {
        styleToggleCheck.checked = true;
        createAnimatedSnow();
    }
    styleToggleCheck.addEventListener('change', function () {
        if (styleToggleCheck.checked) {
            createAnimatedSnow();
            localStorage.setItem('snowEnabled', 'true');
        } else {
            removeAnimatedSnow();
            localStorage.setItem('snowEnabled', 'false');
        }
    });

    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
`;
    document.head.appendChild(sliderStyle);

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
    const OTKAZBIO_PREFIX = 4;
    const ODOBRENOBIO_PREFIX = 8;
    const NARASSMOTRENIIBIO_PREFIX = 2;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
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
            title: 'Жалоба на администрацию ',
            style: 'width: 97%; background: #34aeeb; box-shadow: 0px 0px 5px #fff',
        },
        {
            title: `Приветствие`,
            content:
                "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
                `[CENTER]      [/CENTER][/FONT]<br><br>`+
                `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        },

        {

            title: `Нету нарушение`,
            content:
               "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны администратора - не имеется!<br>`+
            `[CENTER][color=red] Отказано[/color],закрыто. [/CENTER][/FONT]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
           prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
	},
         {
	  title: `ЖБ от 3 лица`,
	 content:
                "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
		"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `[color=red]Отказано[/color],закрыто! [/CENTER][/FONT]<br><br>`+
           `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
	},
	{
	  title: `Отправить на рассмотрение`,
	  content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, пока администратор предоставит мне доказательства и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER][color=orange]На рассмотрении[/color].[/CENTER][/FONT]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
	},
         {
            title: `Недостаточно док-вы`,
           content:
                "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение администратора.<br>`+
            ` [CENTER][color=red] Отказано[/color],закрыто.[/CENTER][/FONT]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
        },
  {
            title: `Нету док-вы`,
           content:
             "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[CENTER] Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
            `[CENTER] [color=red]Закрыто[/color]<br>`+
           `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
        },
         {
            title: `Правила раздела`,
          content:
             "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER][color=red]Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`+
              `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
           prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: `Окно бана`,
           content:
             "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[CENTER]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>`+
            `[CENTER][color=red] Отказано[/color],закрыто[/CENTER][/FONT]<br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://yapx.ru/v/PnPvS'](Кликабельно)[/URL][/FONT][/SIZE]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
        },
	{
	  title: `Беседа с адм`,
		 content:
              "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято. <br><br>" +
		`[CENTER][color=green]Одобрено[/color], закрыто.[CENTER][FONT=georgia]<br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
	},
	{
	  title: `Админ прав`,
	  content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
		"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		`[CENTER][color=red]Закрыто[/color].[/CENTER][/FONT][/SIZE]<br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
	   prefix: PINN_PREFIX,
	  status: false,
         style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
	},
	{
	  title: `Жалоба не по форме`,
	 content:
              "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
		`[CENTER][color=red]Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
         style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
	},


 {
            title: `В раздел обж`,
          content:
               "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[CENTER]Пожалуйста обратитесь в раздел - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1363/']Обжалование (кликабельно)[/URL]<br>`+
            `[CENTER][color=red] Отказано[/color],закрыто[/CENTER][/FONT]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
           prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
        },
    {
	  title: `Наказание по ошибке`,
 content:
          "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
		"[CENTER]В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br>С администратором будет проведена профилактическая беседа.<br>Ваше наказание будет снято. <br><br>" +
		`[CENTER][color=green]Одобрено[/color], закрыто.[CENTER][FONT=georgia]<br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
	},
    {
	  title: `Бан IP`,
	 content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
		"[CENTER]Смените wi-fi соединение или же ip адресс на тот с которого вы играли раньше, дело именно в нем.<br>Перезагрузите ваш роутер или используйте VPN. <br><br>" +
		`[CENTER][color=red]Закрыто[/color].[CENTER][FONT=georgia]<br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
         style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
	},
    {
        title: `Опра в соц.сети`,
      content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia][color=red]Отказано[/color],[S] закрыто.[/S][/FONT]<br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
    {
        title: ` 48 ч `,
       content:
         "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
       " С момента выдачи наказание прошло более 48 часов, жалоба не подлежит рассмотрению.<br><br>"+
        `[color=red]Отказано[/color], закрыто.[/FONT][/CENTER]<br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
    },
    {
        title: `Проинструктировать`,
        content:
               "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        `[SIZE=4][FONT=georgia]Благодарим за ваше обращение!  Администратор будет проинструктирован.<br><br>`+
        `[color=green]Одобрено[/color],закрыто.[/FONT]<br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
    },
{
            title: `Выговор`,
           content:
              "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[CENTER] Администратор получит выговор.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
          `[CENTER][color=green]Одобрено[/color],закрыто<br><br>`+
           `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
             prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
    },
    {
        title: `Дублирование`,
        content:
               "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        `Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован<br><br>`+
        `[color=red]Отказано[/color],закрыто<br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
    },
    {
      title: `ЖБ на техов`,
      content:
         "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
       `[CENTER] Ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br><br>`+
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
     {
            title: `В тех раздел`,
             content:
             "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[CENTER] Пожалуйста составьте свою жалобу в "Техническом Разделе сервера"[URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-rostov.1334/'][SIZE=4][FONT=georgia](кликабельно)[/URL]<br><br>`+
            `[CENTER][color=red] Отказано[/color],закрыто!<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
     },
 {
            title: `Админ ПСЖ`,
           content:
             "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[CENTER] Администратор был снят/ушел по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER][color=green] Рассмотрено[/color]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: WATCHED_PREFIX,
            status:false,
      style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
        },
{
            title: `Админ снят`,
           content:
             "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            `[center] Администратор будет снят с поста администратора. Просим прощение за неудобство. <br>` +
             `[color=rgb(0, 255, 0)]Рассмотрено[/color],[color=red]Закрыто.[/color] [/FONT][/CENTER]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: WATCHED_PREFIX,
        status:  false,
     style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
                                                                                         },
{
            title: `Таймкоды`,
           content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            "Ваше видео длится  более 3-х минут, укажите тайм-коды. <br><br>"+
            `[size=5][QUOTE]3.7. Доказательства должны быть в первоначальном виде.

<p>
[color=red]Примечание[/color]: видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств. Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/QUOTE][/size]
<p>
<br><br>`+
          `[color=red]Отказано[/color],Закрыто.[/font][/center]  <br><br>`+
         `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
            },



         {
        title: `Админ прав Mass DM`,
      content:
                "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/QUOTE][/FONT][QUOTE][/QUOTE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
         {
        title: `Админ прав  DM`,
       content:
             "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут [/QUOTE][/FONT][QUOTE][/QUOTE][QUOTE][/QUOTE]"+
             "[QUOTE][color=red]Примечание:[/color] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/QUOTE]"+
             "[QUOTE][color=red]Примечание:[/color] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/QUOTE]"+
        `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
          {
        title: `Админ прав MG`,
       content:
             "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/QUOTE][/FONT][QUOTE][/QUOTE][QUOTE][/QUOTE]"+
              "[QUOTE][color=red]Примечание:[/color] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/QUOTE]"+
              "[QUOTE][color=red]Примечание:[/color] телефонное общение также является IC чатом.[/QUOTE]"+
              "[QUOTE][color=red]Исключение:[/color] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/QUOTE]"+
        `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
          `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
          {
        title: `Админ прав Слив склада`,
        content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan [/QUOTE][/FONT][QUOTE][/QUOTE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
          {
        title: `Админ прав ТС в личных целях`,
       content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут [/QUOTE][/FONT][QUOTE][/QUOTE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
           `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
             {
        title: `Админ прав DB`,
 content:
         "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут [/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
                 "[QUOTE][color=red]Исключение:[/color] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
         {
        title: `Админ прав RK`,
       content:
          "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут[/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
              `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
         {
        title: `Админ прав CK`,
        content:
          "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства) [/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
         {
        title: `Админ прав TK`,
        content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][[FONT=georgia][QUOTE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
              `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
         {
        title: `Админ прав TK`,
       content:
          "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    }, {
        title: `Админ прав Упом род`,
       content:
         "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
        "[QUOTE][color=red]Примечание:[/color] термин 'MQ' расценивается, как упоминание родных.[/QUOTE]"+
        "[QUOTE][color=red]Исключение:[/color] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
           {
        title: `Админ прав Флуд`,
       content:
          "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
          {
        title: `Админ прав Злоуп знаком`,
         content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
              "[QUOTE][color=red]Пример:[/color] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
         {
        title: `Админ прав Сексизм`,
       content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут[/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
              "[QUOTE][color=red]Примечание: [/color] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
          {
        title: `Админ прав слив ГЧ`,
       content:
          "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
              `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
         {
        title: `Админ прав Выдача себя за адм `,
        content:
          "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации [/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
         {
        title: `Админ прав Музыка в войс чат  `,
        content:
         "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE] 3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут[/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',

    },
             {
        title: `Админ прав Caps Lock`,
        content:
           "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/FONT][FONT=georgia][QUOTE]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут[/QUOTE][/FONT][QUOTE][/quote][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT]<br><br>`+
             `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
                   },

    {
            title: 'Обжалование',
            style: 'width: 97%; background: #34aeeb; box-shadow: 0px 0px 5px #fff',
        },
    {
      title: 'Не по форме',
	  content:
              "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            "Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.2639626/']*Нажмите сюда*[/URL]<br>"+
            '[CENTER][FONT=Verdana][COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
               },
    {
      title: ' Отказ ОБЖ[Не готовы снизить]',
		 content:
                "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "[B][CENTER][COLOR=lavender]Рассмотрев ваше обжалование было принято решение об его отказе.<br>"+
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,

         prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
               },
         {
      title: 'Одобрено',
	  content:
		  "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        '[CENTER][FONT=verdana][SIZE=4]После рассмотрения темы было принято решение о снятии вашего наказания полностью.<br>' +
        "Наказание будет снято в течении 24 часов.[/FONT][/CENTER]<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
           prefix: ACCСEPT_PREFIX,
         status: false,
              style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
               },
    {
      title: 'дай вк',
	  content:
		"[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        '[CENTER][FONT=verdana][SIZE=4]Предоставьте ссылку на ваш ВКонтакте на котором блокировка.<br>' +
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
         prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
               },
    {
      title: 'ОБЖ на рассмотрении',
	 content:
                "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Ваше обжалование взято на рассмотрение.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
         prefix: PINN_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
               },
        {
                                                	  title: ' Смена NikName ',
	  content:
		 "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
		"[B][CENTER][COLOR=White] Ваш аккаунт будет разблокирован на 24 часа для смены NikName.<br>После смены NikName Вы должны будете закрепить в данной теме доказательства. <br>"+
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
                    prefix: PINN_PREFIX,
      status: true,
             style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
    },
    {
      title: 'Жб теху',
		 content:
               "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        '[CENTER][FONT=verdana][SIZE=4]Если Вы не согласны с решением Технического Специалиста.<br>' +
        "Обратитесь в раздел жалоб на [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9629-rostov.1333/']Технических специалистов[/URL].[/FONT][/CENTER]<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
               },
    {
      title: 'Nonrp обман',
	 content:
                "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        '[CENTER][SIZE=4][FONT=verdana]Аккаунт будет разблокирован на 24 часа, в течении этого времени, вы должны вернуть имущество игроку по договоренности, и прикрепить видеофиксацию сделки в данную тему.<br><br>' +
        "[COLOR=rgb(255, 255, 0)]На рассмотрении.[/COLOR][/FONT][/CENTER]<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
               },
    {
      title: 'Nonrp обман вернул',
	  content:
               "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "Ваш аккаунт останется [COLOR=rgb(0, 255, 0)]разблокированным.[/COLOR][/FONT]<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
               },
         {
                                                        	  title: ' Невозврат ущерба ',
	  content:
		"[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
		"[B][CENTER][COLOR=White]У вас было 24 часа на возмещение ущерба, время истекло аккаунт будет заблокирован навсегда. <br>"+
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        	      prefix: CLOSE_PREFIX,
      status: false,
         style: 'border-radius: 25px; font-family: JetBrains Mono',
         },
    {
      title: 'В жб на админов',
	 content:
               "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "[CENTER][FONT=verdana][SIZE=4]Если вы не согласны с выданным наказанием, то вам в раздел \"[url='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1360/']Жалобы на администрацию.[/url]\"[/FONT][/CENTER]<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
               },
          {
      title: 'Обжалованию не подналежит',
	 content:
               "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
        "[CENTER][FONT=verdana][SIZE=4]Данное нарушение не подлежит обжалованию, в обжаловании отказано.[/FONT][/CENTER]<br><br>" +
       `[SIZE=4][FONT=georgia][CENTER][COLOR=rgb(216, 0, 0)] С уважением Главный администратор[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
               },
         {
            title: 'Соц. сети ОБЖ',
           content:
               "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый игрок.<br><br>"+
            " Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
              style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
        },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'background: #44220088; border: 2px solid #a50; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Важно', 'Vajno', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Команде Проекта', 'teamProject', 'background: #00004488; border: 2px solid #00a; border-radius: 10px; font-family: JetBrains Mono');
        addButton('ГА', 'Ga', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Спецу', 'Spec', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Одобрено', 'accepted', 'background: #00440088; border: 2px solid #0a0; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Отказано', 'unaccept', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Теху', 'Texy', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Закрыто', 'Zakrito', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Ожидание', 'Ojidanie', 'background: #444444ff; border: 2px solid #aaa; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Памятка', 'Help', 'background: #34aeeb88; border: 2px solid #34aeeb; border-radius: 10px; font-family: JetBrains Mono');
        addAnswers();

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PINN_PREFIX, true, false));
        $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true, false));
        $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true, false));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true, false));
        $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false, false));
        $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false, false));
        $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false, false));
        $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false, false));
        $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false, false));
        $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false, false));
        $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false, false));
        $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, '(Зимняя тема) Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                }
            });
        });

        $(`button#Info`).click(() => {
            XF.alert(infoAlert(), null, 'Информация:');
        });

        $(`button#Help`).click(() => {
            XF.alert(helpAlert(), null, 'Памятка по работе с форумом:');
        });
    });

    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; ${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 25px; border: 3px solid; border-radius: 25px; background: #34aeeb; padding: 0px 27px 0px 27px; font-family: JetBrains Mono; border-color: #0678c4;">ОТВЕТЫ</button>`,
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
        return `<div class="bug_tracker" style="display:flex; flex-direction:column; flex-wrap:wrap">` +
            `<span class="button-text" style="margin-bottom: 20px; text-align: center; font-size: 16px; font-weight: 500; background: #34aaeb; padding: 5px; border-radius: 15px">Автором и разработчиком данного скрипта является Игорь - arefuer, так же данный скрипт редактирует Влад - lukky. Выразим ему огромное спасибо за помощь!<br>По всем вопросам и предложениям обращайтесь в наши телеграммы.</span>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #34aeeb; flex-grow: 1;"><a href="https://t.me/arefuer" target="_blank"  class="button-text">Telegram arefuer</a></button>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #34aeeb; flex-grow: 1;"><a href="https://t.me/solukky" target="_blank" class="button-text">Telegram lukky</a></button>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #34aeeb; flex-grow: 1;"><a href="https://greasyfork.org/ru/users/1088949-arefuer" target="_blank" class="button-text">greasyfork</a></button>` +
            `<span class="button-text" style="margin: 0 auto 0; text-align: center; font-size: 16px; font-weight: 500; background: #34aaeb; padding: 10px; border-radius: 25px">by R.Kalashnikov & S.Sinclair</span></div>`;
    }

    function helpAlert() {
        return `<div class="help_menu" style="display:flex; flex-direction:column; flex-wrap:wrap">` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">1. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">2. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">3. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">4. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">5. На доработке</span>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status, buttons[id].transfer);
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

    function editThreadData(prefix, pin = false, transfer = false) {
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
                    discussion_open: 1,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if (transfer == true) {
            if (prefix == ODOBRENOBIO_PREFIX) {
                moveThread(prefix, 1535);
            }
            if (prefix == OTKAZBIO_PREFIX) {
                moveThread(prefix, 1537);
            }
            if (prefix == ODOBRENORP_PREFIX) {
                moveThread(prefix, 1532);
            }
            if (prefix == OTKAZRP_PREFIX) {
                moveThread(prefix, 1534);
            }
            if (prefix == NARASSMOTRENIIRP_PREFIX) {
                moveThread(prefix, 1533);
            }
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