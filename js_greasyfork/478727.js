// ==UserScript==
// @name         Curators Forum Arzamas
// @namespace    https://forum.blackrussia.online
// @version      1.0.2
// @description  Для упрощения работы кураторам форумных разделов
// @author       t.me/arefuer
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        t.me/arefuer
// @license      arefuer
// @collaborator t.me/arefuer
// @icon         https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/478727/Curators%20Forum%20Arzamas.user.js
// @updateURL https://update.greasyfork.org/scripts/478727/Curators%20Forum%20Arzamas.meta.js
// ==/UserScript==
// Запрещено копирование без согласия и ссылки на автора

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
        background-color: #3474eb;
    }

    /* Стиль полосы прокрутки */
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(335deg, #68fceb, #8b42ff);
        border-radius: 35px;
        transition-duration: .3s;
    }

    /* Стиль полосы прокрутки при наведении */
    ::-webkit-scrollbar-thumb:hover {
        background-color: #02e812;
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
    }`;
    document.head.appendChild(sliderStyle);

    const UNACCСEPT_PREFIX = 4;
    const ACCСEPT_PREFIX = 8;
    const RESHENO_PREFIX = 6;
    const PINN_PREFIX = 2;
    const GA_PREFIX = 12;
    const COMMAND_PREFIX = 10;
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECY_PREFIX = 11;
    const TEXY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const OTKAZBIOG_PREFIX = 4;
    const ODOBRENOBIO_PREFIX = 8;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const RASSMOTRENO_PREFIX = 9;
    const NOTKAZRPА_PREFIX = 4;
    const ODOBRENORP_PREFIX = 8;
    const NARASSMOTRENIIRP_PREFIX = 2;
    const buttons = [
        {
            title: 'Приветствие (ответ от руки)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                '[CENTER] текст [/CENTER][/FONT][/SIZE]',
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Рассмотрение',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                '[CENTER]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT]',
            prefix: PINN_PREFIX,
            status: true,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Дублирование',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Данная тема является <u>дубликатом вашей предыдущей темы</u>.<br>Пожалуйста, <u><b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b></u>.<br><br>" +
                '[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Правила сервера',
            style: 'width: 97%; background: linear-gradient(135deg, #6ec6f5, #6529b3); box-shadow: 0px 0px 5px #fff',
        },
        {
            title: 'Нонрп поведение',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][FONT=georgia][I][B]Нарушитель будет наказан по пункту правил: [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [Color=Red]Jail 30 минут [/color][/FONT][/I][/B][/CENTER] " +
                '[Color=Lime][CENTER]Одобрено, закрыто[/color].<br> ' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Уход от РП',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил:[Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нонрп вождение',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.03[/color]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'NonRP Обман',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [Color=Red]PermBan[/color].[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Аморал действия',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Слив склада',
            content:
                '[Color=rgb(213, 171, 255][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [Color=Red]Ban 15 - 30 дней / PermBan[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'ДБ',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [Color=Red]Jail 60 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'РК',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.14[/color]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'ТК',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color])[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'СК',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color]).[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'ПГ',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.17[/color]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [Color=Red]Jail 30 минут[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'МГ',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'ДМ',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [Color=Red]Jail 60 минут[/color].[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Масс. ДМ',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [Color=Red]Warn / Ban 3 - 7 дней[/color].[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Стороннее ПО',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][FONT=georgia][B][I]Нарушитель будет наказан по пункту правил: [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [Color=Red] Ban 15 - 30 дней / PermBan[/color] <br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Реклама сторонних ресурсов',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [Color=Red]Ban 7 дней / PermBan[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Оск. адм',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.32[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [Color=Red]Ban 7 - 15 дней[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Уяз. правил',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.33[/color]. Запрещено пользоваться уязвимостью правил | [Color=Red]Ban 15 дней[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Уход от наказания',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.34[/color]. Запрещен уход от наказания | [Color=Red]Ban 15 - 30 дней[/color]([Color=Orange]суммируется к общему наказанию дополнительно[/color])[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'IC и OCC угрозы',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.35[/color]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [Color=Red]Mute 120 минут / Ban 7 дней[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'IC конфликты в OOC',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.36[/color]. Запрещено переносить конфликты из IC в OOC и наоборот | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Угрозы OOC',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пункту правил: [Color=Red]2.37[/color]. Запрещены OOC угрозы, в том числе и завуалированные | [Color=Red]Mute 120 минут / Ban 7 дней [/color]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER]Приятной игры на сервере [COLOR=rgb(222, 12, 98)]CHERRY.[/COLOR][/FONT][/B]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Злоуп. наказаниями',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]Нарушитель будет наказан по пункту правил: [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера | [Color=Red]Ban 7 - 30 дней [/color][/CENTER]" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Оск. проекта',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [Color=Red]Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором[/color])[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Продажа промо.',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.43[/color]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [Color=Red]Mute 120 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'ЕПП (фура/инко)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.47[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [Color=Red]Jail 60 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Покупка фам.репы',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.48[/color]. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. | [Color=Red]Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/color]<br>" +
                "[CENTER][Color=Orange]Примечание[/color]: скрытие информации о продаже репутации семьи приравнивается к [Color=Red]пункту правил 2.24.[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Помеха РП процессу',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.51[/color]. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'НонРП акс.',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.52[/color]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [Color=Red]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: '2.53 (Маты в названии)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.53[/color]. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | [Color=Red]Ban 1 день / При повторном нарушении обнуление бизнеса[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Багоюз аним.',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.55[/color]. Запрещается багоюз связанный с анимацией в любых проявлениях. | [Color=Red]Jail 60 / 120 минут [/color]<br>" +
                "[Color=Orange]Пример[/color]: если Нарушитель, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=Red]Jail на 120 минут[/COLOR]. <br>" +
                "Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. <br>" +
                "[Color=Orange]Пример[/color]: если Нарушитель использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=Red]Jail на 60 минут[/color].[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Игровые чаты',
            style: 'width: 97%; background: linear-gradient(135deg, #6ec6f5, #6529b3); box-shadow: 0px 0px 5px #fff',
        },
        {
            title: 'Транслит',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.01[/color]. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | [Color=Red]Устное замечание / Mute 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER]<br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Капс',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.02[/color]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Оск в ООС',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.03[/color]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> ' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Оск/Упом родни',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил:[Color=Red] 3.04. |[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [Color=Red]Mute 120 минут / Ban 7 - 15 дней[/color].[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Флуд',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.05[/color]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Злоуп знаками',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.06[/color]. Запрещено злоупотребление знаков препинания и прочих символов | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> ' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Оскорбление',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.07[/color]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Редактирование в л/ц',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Запрещено редактировать поданные объявления в личных целях заменяя текст обьявления на несоответствующий отправленному игроком | [Color=Red]Ban 7 дней + Чс Организации[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Слив СМИ',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.08[/color]. Запрещены любые формы «слива» посредством использования глобальных чатов | [Color=Red]PermBan[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Угрозы о наказании со стороны адм',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]Нарушитель будет наказан по пункту правил: [Color=Red]3.09[/color]. Запрещены любые угрозы о наказании игрока со стороны администрации | [Color=Red]Mute 30 минут[/color]. <br>" +
                "[CENTER][Color=Lime]Одобрено, закрыто[/I][/B][/CENTER] <br>" +
                "[CENTER][DON'T=georgia]Приятной игры на сервере [COLOR=rgb(222, 12, 98)]CHERRY.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Выдача себя за адм ',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.10[/color]. Запрещена выдача себя за администратора, если таковым не являетесь | [Color=Red]Ban 7 - 15 + ЧС администрации[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Ввод в заблуждение командами (3.11)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил [Color=Red]3.11[/color]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [Color=Red]Ban 15 - 30 дней / PermBan[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Ввод в заблуждение и обман (2.32)',
            content:
            '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
            "[CENTER]Нарушитель будет наказан по данному пункту правил [Color=Red]3.11[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [Color=Red]Ban 7 - 15 дней[/color]<br>" +
            '[Color=Red]Пример:[/color] подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.<br>' +
            "[Color=Red]Примечание:[/color] за подделку доказательств по решению руководства сервера может быть выдана перманентная блокировка, как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя. | [Color=Red]PermBan[/color][/CENTER]<br>" +
            '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
            "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Репорт: Капс/Оффтоп/Транслит',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.12[/color]. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) | [Color=Red]Report Mute 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Музыка в voice',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.14[/color]. Запрещено включать музыку в Voice Chat | [Color=Red]Mute 60 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Оск/Упом род в voice',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.15[/color]. Запрещено оскорблять игроков или родных в Voice Chat | [Color=Red]Mute 120 минут / Ban 7 - 15 дней[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> ' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Шум в voice',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.16[/color]. Запрещено создавать посторонние шумы или звуки | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Реклама в voice',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.17[/color]. Запрещена реклама в Voice Chat не связанная с игровым процессом | [Color=Red]Ban 7 - 15 дней[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Религиозное и политическая пропаганда',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.18[/color]. Запрещено политическое и религиозное пропагандирование | [Color=Red]Mute 120 минут / Ban 10 дней[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> ' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Реклама промо',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.21[/color]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [Color=Red]Ban 30 дней[/color].[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Торговля на тт гос. структур',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.22[/color]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> ' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Положение об игровых аккаунтах',
            style: 'width: 97%; background: linear-gradient(135deg, #6ec6f5, #6529b3); box-shadow: 0px 0px 5px #fff',
        },
        {
            title: 'Мультиаккаунт (более 3-х)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере | [Color=Red]PermBan[/color].<br>" +
                "[Color=Orange]Примечание[/color]: блокировке подлежат все аккаунты созданные после третьего твинка.[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Фейк-аккаунт',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.10[/color]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [Color=Red]Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Правила гос. структур',
            style: 'width: 97%; background: linear-gradient(135deg, #6ec6f5, #6529b3); box-shadow: 0px 0px 5px #fff',
        },
        {
            title: 'Прогул Р/Д',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]1.07[/color]. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Исп. фрак. т/с в личных целях',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]1.08[/color]. Запрещено использование фракционного транспорта в личных целях | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'ДМ/масс ДМ от МО',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]2.02[/color]. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Н/ПРО (Объявы СМИ)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]4.01[/color]. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Н/ППЭ (Эфиры СМИ)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]4.02[/color]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Задержание в интерьере',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.50[/color]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий  | [Color=Red]Ban 7 - 15 дней + увольнение из организации[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
                "[CENTER] Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'ДМ/масс ДМ от УМВД',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Розыск без причины(УМВД)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Задержание без РП (УМВД: Нонрп коп)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.03[/color]. Запрещено оказывать задержание без Role Play отыгровки | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нонрп поведение (УМВД)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.04[/color]. Запрещено nRP поведение | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'ДМ/масс ДМ от ГИБДД',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | [Color=Red]Jail 30[/color] минут / Warn[/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Штраф без RP (ГИБДД)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.02[/color]. Запрещено выдавать розыск, штраф без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Розыск без причины (ГИБДД)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Задержание без РП (ГИБДД: Нонрп коп)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.03[/color]. Запрещено оказывать задержание без Role Play отыгровки | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Изъятие В/У во время погони(ГИБДД)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.05[/color]. Запрещено отбирать водительские права во время погони за нарушителем | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'ДМ/масс ДМ от ФСБ',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Розыск без причины (ФСБ)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Задержание без РП (ФСБ: Нонрп коп)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.03[/color]. Запрещено оказывать задержание без Role Play отыгровки | [Color=Red]Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Урон на территории ФСИН без причины',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]9.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Правила ОПГ',
            style: 'width: 97%; background: linear-gradient(135deg, #6ec6f5, #6529b3); box-shadow: 0px 0px 5px #fff',
        },
        {
            title: 'Нарушение правил В/Ч',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: За нарушение правил нападения на [Color=Orange]Войсковую Часть[/color] выдаётся предупреждение | [Color=Red]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нападение на В/Ч через стену',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан по пунтку правил: Нападение на [Color=Orange]военную часть[/color] разрешено только через блокпост КПП с последовательностью взлома | [Color=Red]Warn NonRP В/Ч[/color][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нарушение правил похищения/ограбления',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушитель будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Кликабельно[/URL][/CENTER]<br>" +
                '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Отсутствие пунка жалоб (отказы)',
            style: 'width: 97%; background: linear-gradient(135deg, #6ec6f5, #6529b3); box-shadow: 0px 0px 5px #fff',
        },
        {
            title: 'Неадекватная жалоба',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]В Вашей жалобе содержатся неадекватные высказывание и/или неадекватное отношение к игрокам проекта и/или политические и религиозные высказывания.[/CENTER]<br>" +
                '[CENTER]По крайней мере Ваши действия и слова нарушают правила данной площадки, а так же провила подачи жалоб.[/CENTER]<br>' +
                "[CENTER]К нашему большому сожалению, но увы, мы не можем продолжить рассмотрение Вашей жалобы.[/CENTER]<br><br>" +
                '[CENTER]Приятной игры на сервере [COLOR=rgb(247, 244, 22)]ARZAMAS.[/COLOR][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нарушений не найдено',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Сборка на док-вах',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]' +
                "[CENTER]Вы используете не оригинальные файлы игры (сборку), поэтому ваша жалоба не подлежит рассмотрению.[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Недостаточно доказательств',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Недостаточно доказательств на нарушение от данного игрока. Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'В жалобы на админов',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Жалобы на администрацию[/color].[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'В обжалования',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Обжалование наказаний[/color].[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Форма подачи',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']правилами подачи жалоб на игроков[/URL].[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нет /time',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]На Ваших доказательствах отсутствует /time.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Требуются TimeCode',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Заголовок не по форме',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][FONT=Georgia][I]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Более 72 часов',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]С момента получения наказания прошло более 72 часов[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Док-ва через запрет соц. сети',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]3.6. Прикрепление доказательств обязательно. <br>" +
                "[Color=Orange]Примечание[/color]: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нет условий сделки',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]На данных доказательствах нет условий сделки между игроками[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нужен фрапс',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]В таких случаях нужен фрапс[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Сомнения в подлинности доказательств',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]У администрации появились сомнения в подлинности доказательств, которые Вы предоставили в данной жалобе![/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нужен фрапс + промотка чата',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]В таких случаях нужен фрапс + промотка чата.[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Нужна промотка чата',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]В таких случаях нужна промотка чата.[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Неполный фрапс',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на YouTube.[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Не работают док-ва',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Предоставленные доказательства не работают.[/CENTER]<br>" +
                '[Color=Flame][CENTER]Закрыто[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Доказательства отредактированы',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]На Ваших доказательствах видно, что они отредакторованны.[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'От 3-го лица',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются.[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Ответный ДМ (запись)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]В случае ответного ДМ нужен видеозапись. Пересоздайте тему и прикрепите видеозапись.[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Ответный ДМ (от игрока)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER][B][I][FONT=georgia]В данном случае было видно, что ДМ был ответным.[/CENTER]" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Ошиблись разделом',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/CENTER]<br>",
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Обратитесь в жб на сотруд.',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Вы ошиблись разделом, переподайте свою жалобу в раздел жалоб на сотрудников организации.[/CENTER]<br>",
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Док-ва не рабочие',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваши доказательства не рабочие/обрезанные, перезалейте их правильно и без обрезаний.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Фотохостинги',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Неправильно указанный ник',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Вы неправильно указали свой никнейм/никнейм игрока.<br>Пожалуйста, перепроверьте правильность написания никнейма и создайте ещё одну тему.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Оффтоп',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваше сообщение выходит за рамки темы этого раздела. Убедительно просим ознакомиться с назначением данного раздела[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Передача жалоб',
            style: 'width: 97%; background: linear-gradient(135deg, #6ec6f5, #6529b3); box-shadow: 0px 0px 5px #fff',
        },
        {
            title: 'Техническому специалисту',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту[/CENTER]<br>" +
                '[Color=Flame][CENTER]Пожалуйста, ожидайте ответа и не создавайте подобных тем.[/I][/CENTER][/color][/FONT]',
            prefix: TEXY_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Передано ГА',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша жалоба была передана на рассмотрение [Color=Red]Главному Администратору[/color] - @Rage_Exett[/CENTER]<br>" +
                '[Color=Flame][CENTER]Пожалуйста, ожидайте ответа и не создавайте подобных тем.[/I][/CENTER][/color][/FONT]',
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Спец.администратору',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша жалоба была передана на рассмотрение Специальному администратору и/или его заместителю.[/CENTER]<br>" +
                '[Color=Flame][CENTER]Пожалуйста, ожидайте ответа и не создавайте подобных тем.[/I][/CENTER][/color][/FONT]',
            prefix: SPECY_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'RP Биографии',
            style: 'width: 97%; background: linear-gradient(135deg, #6ec6f5, #6529b3); box-shadow: 0px 0px 5px #fff',
        },
        {
            title: 'Биография одобрена',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]",
            prefix: ODOBRENOBIO_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Биография не по форме',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография составлена не по форме.<br>Форма подачи:<br>[CODE]1. Имя Фамилия:<br>2. Пол:<br>3. Национальность:<br>4. Возраст:<br>5. Дата и место рождения:<br>6. Семья:<br>7. Место текущего проживания:<br>8. Описание внешности:<br>9. Особенности характера:<br>10. ( От сюда требуется расписать каждый из пунктов ) Детство:<br>11. Юность и взрослая жизнь:<br>12. Настоящее время:<br>13. Хобби:[/CODE][/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][CENTER][/color][/FONT]',
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Уже есть одна на доработке',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]У вас уже имеется RolePlay биография на рассмотрении, работайте там.[/CENTER]<br>" +
                '[Color=Red][CENTER] Отказано, закрыто.[/I][CENTER][/color][/FONT]',
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Биография скопирована',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография скопирована/украдена.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][CENTER][/color][/FONT]',
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Биография пуста',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша RolePlay биография практически пуста. Рекомендую подумать над новым сценарием вашего игрового персонажа. Не забудьте ознакомиться с правилами подачи биографии в этом разделе.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][CENTER][/color][/FONT]',
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Биография от 3-его лица (отказ)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3го лица.[/CENTER][/FONT]",
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Много ошибок в биографии (отказ)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить большое количество грамматических ошибок.[/CENTER][/FONT]",
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Ошибка в возрасте/дате (отказ)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить несовпадение возраста и даты рождения.[/CENTER][/FONT]",
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'В биографии возраст меньше 18 (отказ)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина отказа: минимальный возраст для составления биографии: 18 лет.[/CENTER][/FONT]",
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Мало инфы (отказ)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Добавьте больше информации о себе в новой биографии.[/CENTER][/FONT]",
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Неправильный заголовок (отказ)',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Ваш заголовок составлен не по форме RP биографий.<br>Составьте заголовок по форме, напромер: 'РП Биография гражданина Рубина Калашникова'[/CENTER][/FONT]",
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'Биография об известной личности',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша РП биография является пересказом биографии известной личности.[/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][CENTER][/color][/FONT]',
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'RP ситуации',
            style: 'width: 97%; background: linear-gradient(135deg, #6ec6f5, #6529b3); box-shadow: 0px 0px 5px #fff',
        },
        {
            title: 'RP ситуация - одобрена',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша RP ситуация получает статус: [Color=Lime]Одобрено[/Color].[/CENTER]<br>" +
                '[Color=Red][CENTER]Закрыто.[/I][CENTER][/color][/FONT]',
            prefix: ODOBRENORP_PREFIX,
            status: false,
            rptransfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'RP ситуация - на доработку',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша RP ситуация отправляется на даработку.[/CENTER]<br>" +
                '[Color=orange][CENTER]На рассмотрении...[/I][CENTER][/color][/FONT]',
            prefix: NARASSMOTRENIIRP_PREFIX,
            status: false,
            rptransfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
        {
            title: 'RP ситуация - отказана',
            content:
                '[Color=rgb(213, 171, 255)][FONT=Georgia][CENTER][I]{{ greeting }}.[/color][/CENTER]<br>' +
                "[CENTER]Ваша RP ситуация получает статус: [Color=Red]Отказано.[/Color][/CENTER]<br>" +
                '[Color=Red][CENTER]Отказано, закрыто.[/I][CENTER][/color][/FONT]',
            prefix: NOTKAZRPА_PREFIX,
            status: false,
            rptransfer: true,
            style: 'border-radius: 25px; font-family: JetBrains Mono; border: 1px solid #2960b3',
        },
    ];

    $(document).ready(() => {
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        addButton('На рассмотрении', 'pin', 'background: #44220088; border: 2px solid #a50; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Важно', 'Vajno', 'background: #44000088; border: 2px solid #a00; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Команде Проекта', 'teamProject', 'background: #00004488; border: 2px solid #00a; border-radius: 30px; font-family: JetBrains Mono');
        addButton('ГА', 'Ga', 'background: #44000088; border: 2px solid #a00; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Спецу', 'Spec', 'background: #44000088; border: 2px solid #a00; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Одобрено', 'accepted', 'background: #00440088; border: 2px solid #0a0; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Отказано', 'unaccept', 'background: #44000088; border: 2px solid #a00; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Теху', 'Texy', 'background: #44000088; border: 2px solid #a00; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Закрыто', 'Zakrito', 'background: #44000088; border: 2px solid #a00; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Ожидание', 'Ojidanie', 'background: #444444ff; border: 2px solid #aaa; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Info', 'Info', 'background: linear-gradient(335deg, #68fceb, #2960b3); border: 0; border-radius: 30px; font-family: JetBrains Mono');
        addButton('Памятка', 'Help', 'background: linear-gradient(335deg, #68fceb, #2960b3); border: 0; border-radius: 30px; font-family: JetBrains Mono');
        addAnswers();

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
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 25px; border: 0; border-radius: 25px; background: linear-gradient(335deg, #68fceb, #2960b3); padding: 0px 27px 0px 27px; font-family: JetBrains Mono; border-color: #3474eb;">ОТВЕТЫ</button>`,
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
            `<span class="button-text" style="margin-bottom: 20px; text-align: center; font-size: 16px; font-weight: 500; background: #2960b3; padding: 5px; border-radius: 15px">Автором и разработчиком данного скрипта является Игорь - arefuer, так же данный скрипт помогал писать Влад - lukky. Выразим ему огромную благодарность за помощь!<br>По всем вопросам и предложениям обращайтесь в Телеграм.</span>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #2960b3; flex-grow: 1;"><a href="https://t.me/arefuer" target="_blank"  class="button-text">Telegram arefuer</a></button>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #2960b3; flex-grow: 1;"><a href="https://greasyfork.org/ru/users/1088949-arefuer" target="_blank" class="button-text">greasyfork</a></button>` +
            `<span class="button-text" style="margin: 0 auto 0; text-align: center; font-size: 16px; font-weight: 500; background: #2960b3; padding: 10px; border-radius: 25px">by R.Kalashnikov</span></div>`;
    }

    function helpAlert() {
        return `<div class="help_menu" style="display:flex; flex-direction:column; flex-wrap:wrap">` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #2960b3; padding: 10px; border-radius: 20px">Форма для подачи жалобы на игроков.<br>1. Ваш Nick_Name: текст<br>2. Nick_Name игрока: текст<br>3. Суть жалобы: текст<br>4. Доказательство: текст/ссылка</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #2960b3; padding: 10px; border-radius: 20px">2. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #2960b3; padding: 10px; border-radius: 20px">3. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #2960b3; padding: 10px; border-radius: 20px">4. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #2960b3; padding: 10px; border-radius: 20px">5. На доработке</span>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status, buttons[id].transfer, buttons[id].rptransfer);
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

    function editThreadData(prefix, pin = false, transfer = false, rptransfer = false) {
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
                    discussion_open: 0,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if (transfer === true) {
            if (prefix == ODOBRENOBIO_PREFIX) {
                moveThread(prefix, 1535);
            }
            if (prefix == OTKAZBIOG_PREFIX) {
                moveThread(prefix, 1537);
            }
        }
        if (rptransfer === true){    
            if (prefix == ODOBRENORP_PREFIX) {
                moveThread(prefix, 1532);
            }
            if (prefix == NOTKAZRPА_PREFIX) {
                moveThread(prefix, 1534);
            }
            if (prefix == NARASSMOTRENIIRP_PREFIX) {
                moveThread(prefix, 1533);
            }
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

})();