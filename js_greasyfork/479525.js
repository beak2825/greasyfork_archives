// ==UserScript==
// @name         Для Кураторов/ЗГА/ГА Arzamas
// @namespace    https://forum.blackrussia.online
// @version      0.2.7
// @description  Для упрощения работы по форуму руководству сервера
// @author       t.me/arefuer
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        t.me/arefuer
// @license      arefuer
// @collaborator t.me/arefuer
// @icon         https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/479525/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%D0%97%D0%93%D0%90%D0%93%D0%90%20Arzamas.user.js
// @updateURL https://update.greasyfork.org/scripts/479525/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%D0%97%D0%93%D0%90%D0%93%D0%90%20Arzamas.meta.js
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
    const VAJNO_PREFIX = 1;
    const PREFIKS = 0;
    const KACHESTVO = 15;
    const RASSMOTRENO_PREFIX = 9;
    const NARASSMOTRENIIRP_PREFIX = 2;
    const buttons = [
        {
            title: 'Приветствие (ответ от руки)',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            '[CENTER] Текст [/CENTER][/FONT][/SIZE]',
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Рассмотрение',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            '[CENTER]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Дублирование',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER]Данная тема является <u>дубликатом вашей предыдущей темы</u>.<br>Пожалуйста, <u><b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b></u>.<br><br>" +
            '[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/CENTER][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        {
            title: 'Доказательства',
            style: 'width: 97%; background: #34aeeb; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Запрошу док-ва',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Запрошу доказательства у администратора. <br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы. [/COLOR][/FONT][/CENTER]<br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Выдано верно',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Проверив доказательства администратора, было принято решение, что наказание было выдано верно. [/COLOR][/FONT][/CENTER]<br><br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание будет снято (неверная выдача)',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]В следствии тщательной проверки, было выявлено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Приятной игры на сервере [Color=#f7ef07]ARZAMAS.[/COLOR][/COLOR][/FONT][/CENTER]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Форма жалобы на администрацию',
            style: 'width: 97%; background: #34aeeb; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Не по форме',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']Тык[/URL] [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет /time',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]В предоставленных Вами доказательствах отсутствует /time. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет /myreports',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]В предоставленных Вами доказательствах отсутствует /myreports. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'От 3-его лица',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Жалобы, написанные от 3-его лица, рассмотрению не подлежат.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нужен фрапс',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.<br>Вы можете загрузить фрапс на [URL='https://youtube.com']YouTube (кликабельно)[/URL]. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
          {
            title: 'Фрапс обрывается',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваш фрапс обрывается, загрузите полный фрапс на [URL='https://youtube.com']YouTube (кликабельно)[/URL].[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Док-ва отредактированы',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Представленные Вами доказательства, были отредактированны, пожалуйста, прикрепите оригинал в новой жалобе.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Прошло более 48-ми часов',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]С момента выдачи наказания прошло более 48-ми часов, жалоба рассмотрению не подлежит.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет строки с выдачей наказания',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]На Ваших доказательствах отсутствует строка с выдачей наказания.[/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет окна бана',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]На ваших доказательствах отсутствует окно блокировки аккаунта. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Запрещённые соц. сети',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги ([URL='https://youtube.com']YouTube[/URL], [URL='https//yapx.ru']Япикс[/URL], [URL='https://imgur.com']imgur[/URL] (всё кликабельно)). [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет док-в',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]В вашей жалобе отсутствуют доказательства. [/FONT][/COLOR][CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не работают док-ва',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Предоставленные Вами доказательства - не рабочие.[/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Администратор будет проинструктирован',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Благодарим за ваше обращение! Администратор будет проинструктирован.[/FONT][/COLOR][CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Приятной игры на сервере [Color=#f7ef07]ARZAMAS.[/COLOR][/COLOR][/FONT][/CENTER]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Будет проведена беседа',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваша жалоба была одобрена, с администратором будет проведена беседа. [/FONT][/COLOR][CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Приятной игры на сервере [Color=#f7ef07]ARZAMAS.[/COLOR][/COLOR][/FONT][/CENTER]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Беседа с админом + снятие наказания',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваша жалоба была одобрена, администратор будет проинструктирован. [/FONT][/COLOR][/CENTER]" +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше наказание будет снято в течении 12-ти часов. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Приятной игры на сервере [Color=#f7ef07]ARZAMAS.[/COLOR][/COLOR][/FONT][/CENTER]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Администратор будет наказан',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваша жалоба была одобрена и администратор получит наказание.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Приятной игры на сервере [Color=#f7ef07]ARZAMAS.[/COLOR][/COLOR][/FONT][/CENTER]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет нарушений от администратора',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Нарушений со стороны администратора не обнаружено.[/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Администратор был снят',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Администратор был снят с поста администратора. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Ошибка сервером',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию Вашего сервера.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет ссылки на жалобу',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Нет ссылки на данную жалобу.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не написан ник',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Перезагрузите роутер/телефон',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Перезагрузите роутер/телефон или попробуйте использовать VPN`ом.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Обжалования',
            style: 'width: 97%; background: #34aeeb; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Не по форме',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше обжалование составлено не по форме.<br>Убедительная просьба ознакомиться с правилами подачи заявки на обжалование наказания - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Тык[/URL] [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не подлежит обжалованию',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Данное нарушение не подлежит обжалованию.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Не готовы снизить',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Администрация сервера не готова обжаловать ваше наказание. [/FONT][/COLOR][CENTER]" +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Пожалуйста, не создавайте дубликаты, создание дубликатов карается блокировкой форумного аккаунта. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Нет док-в',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]В вашем обжаловании отсутствуют доказательства.<br>Тема рассмотрению не подлежит.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Отказ в обжалование',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]В обжаловании отказано.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Уже был обжалован',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше наказание уже было обжаловано, повторного обжалования не будет.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Ошибка сервером',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись сервером. <br>Подайте обжалование в разделе вашего сервера.[/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Снижено на 30 дн.',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше наказание будет снижено до 30 дней блокировки аккаунта. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Снижено на 15 дн.',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше наказание будет снижено до 15 дней блокировки аккаунта. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Снижено на 7 дн.',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше наказание будет снижено до 7 дней блокировки аккаунта. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Наказание будет снято',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше наказание будет полностью снято. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Приятной игры на сервере [Color=#f7ef07]ARZAMAS.[/COLOR][/COLOR][/FONT][/CENTER]',
            prefix: RASSMOTRENO_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'ЧС ЛД снят',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Вы вынесены из черного списка лидеров. [/FONT][/COLOR][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Приятной игры на сервере [Color=#f7ef07]ARZAMAS.[/COLOR][/COLOR][/FONT][/CENTER]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: '24 часа на смену ника',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Вам дается 24 часа что бы сменить NickName, после смены обязательно прикрепите скриншот с /time. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFA500][SIZE=4]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PINN_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'НонРП развод',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Разблокировка игрового аккаунта будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено. Игрок которого вы обманули должен написать обжалование, после того как вы всё согласуете. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'НонРП развод (24 часа на возврат имущества)',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Игрок разблокирован на 24 часа, когда вам вернут имущество обязательно отпишите в эту тему. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFA500][SIZE=4]На рассмотрении[/COLOR][/FONT][/CENTER]',
            prefix: PINN_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'НонРП развод (пишет с другого акка)',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Вы обманули данного игрока и сейчас пишите обжалование с подставной перепиской.[/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Отказано, закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'НонРП развод (пострадавший пишет обж)',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Игрок которого вы обманули должен сам написать обжалование.[/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'НонРП развод (нет переписки)',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Нет скриншота договора о возврате имущества.[/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передача обжалований',
            style: 'width: 97%; background: #34aeeb; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Для ЗГА',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше обжалование было передано на рассмотрение Заместителю Главного Администратора.[/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Для ГА',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER]Ваша жалоба была передана на рассмотрение [Color=Red]Главному Администратору[/color] - @Rage_Exett[/CENTER]<br>" +
            '[Color=Flame][CENTER]Пожалуйста, ожидайте ответа и не создавайте подобных тем.[/I][/CENTER][/color][/FONT]',
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Для sakaro',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше обжалование было передано на рассмотрение [Color=#1E90FF]Руководству Модерации Дискорда.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Для спец. админов',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваше обжалование было передано на рассмотрение Специальной Администрации.[/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
            prefix: SPECY_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передача жалоб',
            style: 'width: 97%; background: #34aeeb; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'Передано ЗГА',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора.[/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ожидайте его ответа, на рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передано Руководителю модеров ДС',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ваша жалоба была передана на рассмотрение [Color=#1E90FF]Руководителю Модерации Дискорда.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передано ГА',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER]Ваша жалоба была передана на рассмотрение [Color=Red]Главному Администратору[/color] - @Rage_Exett[/CENTER]<br>" +
            '[Color=Flame][CENTER]Пожалуйста, ожидайте ответа и не создавайте подобных тем.[/I][/CENTER][/color][/FONT]',
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'Передано Спец. администратору',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER]Ваша жалоба была передана на рассмотрение Специальному администратору и/или его заместителю.[/CENTER]<br>" +
            '[Color=Flame][CENTER]Пожалуйста, ожидайте ответа и не создавайте подобных тем.[/I][/CENTER][/color][/FONT]',
            prefix: SPECY_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В другой раздел',
            style: 'width: 97%; background: #34aeeb; box-shadow: 0px 0px 5px #fff; border: 3px double;  font-family: JetBrains Mono; border-radius: 13px',
        },
        {
            title: 'В жалобы на админов',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Если вы не согласны с выданным наказанием, то обратитесь в раздел Жалоб на Администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1529/']Тык[/URL] [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на игроков',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Данный игрок не является администратором.<br>Обратитесь в раздел жалоб на игроков - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1531/']Тык[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на лидеров',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Данный игрок является лидером.<br>Обратитесь в раздел Жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1530/']Тык[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В обжалования',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалований наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1528/']Тык[/URL] [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В тех. раздел',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в Технический раздел - [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-arzamas.1502/']Тык[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
        {
            title: 'В жалобы на техов',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][FONT=Arial][COLOR=#FFFFFF][SIZE=4]Выше наказание было выдано Техническим специалистом, вы можете написать жалобу/обжалование здесь - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9633-arzamas.1501/']Тык[/URL] [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][I][FONT=Arial][COLOR=#FF0000][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono',
        },
    ];
 
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'background: #420; border: 2px solid #a50; border-radius: 10px');
        addButton('Важно', 'Vajno', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Команде Проекта', 'teamProject', 'background: #004; border: 2px solid #00a; border-radius: 10px');
        addButton('ГА', 'Ga', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Спецу', 'Spec', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Одобрено', 'accepted', 'background: #040; border: 2px solid #0a0; border-radius: 10px');
        addButton('Отказано', 'unaccept', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Теху', 'Texy', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Закрыто', 'Zakrito', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Ожидание', 'Ojidanie', 'background: #444; border: 2px solid #aaa; border-radius: 10px');
        addButton('Info', 'Info', 'background: #34aeeb88; border: 2px solid #34aeeb; border-radius: 10px; font-family: JetBrains Mono; margin-right: 15px');
        addAnswers();
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
        $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
        $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
        $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
        $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
        $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
        $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
        $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
 
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
        $(`button#Info`).click(() => {
            XF.alert(infoAlert(), null, 'Информация:');
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
        } else  {
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