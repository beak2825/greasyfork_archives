// ==UserScript==
// @name         BARNAUL | Скрипт для Руководства сервера R.Kligan
// @namespace    https://forum.blackrussia.online
// @version      3.5.4
// @description  Специально для BARNAUL(69)
// @author       Rock_Kligan
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/486804/BARNAUL%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20RKligan.user.js
// @updateURL https://update.greasyfork.org/scripts/486804/BARNAUL%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20RKligan.meta.js
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
    uixLogo.src = 'https://i.postimg.cc/dV1mqxPf/uix-logo-cust-3.png';
    uixLogo.srcset = 'https://i.postimg.cc/dV1mqxPf/uix-logo-cust-3.png';
//стиль оформления форума
    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#383c488';
    });

    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#383c4288';
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
        background-color: #4a4e54;
    }

    /* Стиль полосы прокрутки */
    ::-webkit-scrollbar-thumb {
        background-color: #656570;
        border-radius: 0px;
        transition-duration: .3s;
    }

    /* Стиль полосы прокрутки при наведении */
    ::-webkit-scrollbar-thumb:hover {
        background-color: #5d5f66;
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
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 42px; margin-top: 2px;">Снежочек</span>
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
        border: 1px solid #545454; // обводка кнопки снега
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #4f4f4f;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #a3a3a3; //цвет кнопки снега
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #636363; //цвет при нажатии (2)
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
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
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
            title: 'Правила RolePlay процесса ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| NonRP Поведение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
        "[B][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| NonRP охрана Казино |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Охраннику казино запрещено выгонять игрока без причины [Color=#ff0000]| Увольнение с должности | Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
{
	  title: '| Уход от RP |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>"+
        "[B][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/FONT][/SIZE][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| NonRP drive |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
        "[B][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Помеха работе игрокам |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[Color=#ff0000]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color].[/COLOR]<br><br>"+
        "[B][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/FONT][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| NonRP Обман |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR][COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Долг |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban [Color=#ff0000] Ban 30 дней / permban [/color].[/COLOR]<br><br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда.[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами..[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR][COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| RP отыгровки в свою сторону |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.06.[/color] Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR][COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Аморал |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
        "[B][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Слив склада |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR][COLOR=#797cc7]BARNAUL[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Затягивание RP |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.12.[/color] Запрещено целенаправленное затягивание Role Play процесса [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
        "[B][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]/me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| DB |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
        "[B][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR][COLOR=#797cc7]BARNAUL[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| RK |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| TK |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR][COLOR=#797cc7]BARNAUL[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| SK |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| PG |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},

{
	  title: '| MG |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
		"[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]телефонное общение также является IC чатом.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| DM |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>"+
		"[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Mass DM |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| nRP никнейм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.06.[/color] Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#ff0000]| Устное замечание + смена игрового никнейма[/color].[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Oск. ник |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan.[/color][/Spoiler]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Фейк ник |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan.[/color][/Spoiler]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Сборка/чит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Уход от наказания |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.34.[/color] Запрещен уход от наказания [Color=#ff0000]| Ban 15 - 30 дней[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]выход игрока из игры не является уходом от наказания.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| OОC угрозы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Злоуп наказаниями |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 30 дней[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Оск проекта |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Продажа промо |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| ЕПП (фура/инк) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Арест на аукционе |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| NonRP аксессуар |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR][COLOR=#797cc7]BARNAUL[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Мат в названии (Бизнеса) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=#ff0000]| Ban 1 день / При повторном нарушении обнуление бизнеса[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]названия семей, бизнесов, компаний и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Оск адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#ff0000]Mute 180 минут[/color].[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	    prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
{
	  title: '| сбив/багаюз аним |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=#ff0000]| Jail 120 минут[/color]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR][COLOR=#797cc7]BARNAUL[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| П/П/ИВ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [Color=#ff0000]| PermBan с обнулением аккаунта + ЧС проекта[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.[/COLOR][/SIZE][/FONT]<br>" +
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]официальная покупка через сайт.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| П/П/В |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.03.[/color] Запрещена совершенно любая передача игровых аккаунтов третьим лицам [Color=#ff0000]| PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Обман администрации |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Обход системы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/COLOR][/SIZE][/FONT]<br>" +
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками. Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками. Банк и личные счета предназначены для передачи денежных средств между игроками. Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Тим Мертв. рука |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.56.[/color] Запрещается объединение в команду между убийцей и выжившим на мини-игре «Мертвая рука» [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]правило действует только на время Хэллоуинского ивента.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
        {
            title: 'Правила бизнесов ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| Казино/Клуб должность за ИВ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика. [Color=#ff0000]| Ban 3 - 5 дней.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Казино/Клуб налоги за должность |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги в виде денежных средств за должность в казино. [Color=#ff0000]| Ban 3 - 5 дней.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Ставку выше чем просят игроки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика. [Color=#ff0000]| Ban 3 - 5 дней.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Правила купли/продажи казино/СТО |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.01.[/color] После покупки казино владелец обязан ждать срока окончания владения Казино / СТО - 15 суток. Запрещено продавать и передавать казино/СТО третьим лицам, продавать бизнес в государство и выкупать обратно, любые другие виды и способы сохранения бизнеса у себя. [Color=#ff0000]| Permban / обнуление аккаунта.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
        {
            title: 'Правила чата ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| Разговор не на русском |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#ff0000]| Устное замечание / Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Caps |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| OOC оск |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Оск/Упом родни |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]термины «MQ», «rnq» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br>" +
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Flood |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Злоуп символами |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Оск секс. характера |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.07.[/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Слив гл. чата (СМИ) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Угроза о наказании(адм) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Выдача себя за администратора |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 + ЧС администрации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Ввод в заблужд командами |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Музыка в Voice |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Оск/упом род в Voice |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Шумы в Voice |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Реклама в Voice |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.17.[/color] Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Полит/религ пропоганда |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Изменение голоса софтом |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.19.[/color] Запрещено использование любого софта для изменения голоса [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Транслит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«Privet», «Kak dela», «Narmalna».[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Реклама промо |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.21.[/color] ЗЗапрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Обьявления в госс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
        {
            title: 'Передача жалоб',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| На рассмотрение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]Рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: PIN_PREFIX,
            status: true,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Тех. спецу |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]Рассмотрение[/COLOR] [COLOR=#0000ff]Техническому специалисту[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: TEXY_PREFIX,
	  status: true,
      style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| В жб на адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| В жб на лд |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров».<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| В жб на игроков |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Вы ошиблись разделом. Обратитесь в раздел «Жалобы на игроков».<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| В жб на сотрудников |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Вы ошиблись разделом. Обратитесь в раздел «Жалобы на сотрудников» нужной вам организации. <br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| В жб на АП |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Вы ошиблись разделом. Обратитесь в раздел (Раздел для агентов поддержки), а именно в «Жалобы на Агентов Поддержки».<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| В обжалования |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| В тех раздел |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| В жб на теха |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
        {
            title: 'Правила форума',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| Неадекват |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Травля пользователя |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Провокация, розжиг конфликта |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04.[/color] Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Реклама |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещена совершенно любая реклама любого направления.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| 18+ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.06.[/color] Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Flood , Offtop |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.07.[/color] Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Религия/политика |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещены споры на тему религии/политики.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Помеха развитию проекта |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Попрошайничество |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещено вымогательство или попрошайничество во всех возможных проявлениях.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Злоуп Caps/транслит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещено злоупотребление Caps Lock`ом или транслитом.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Дубликат тем (в случае если подали на игрока) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещена публикация дублирующихся тем.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Бесмысленный/оск Nik фа |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Feik Nik фа адм/лд |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.03.[/color] Запрещено регистрировать аккаунты с никнеймами похожими на никнеймы администрации.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
        {
            title: 'Правила госс. структур',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| Работа в форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Казино в форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Т/С в личных целях |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Военный ДМит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Министерства Обороны:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#ff0000]| предупреждение (Warn) выдается только в случае Mass DM[/color].[/COLOR]<br><br>"+
"[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Н/ПРО |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| nRP эфир |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Редактирование в лич. целях |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| УМВД ДМит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории УМВД [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| ГИБДД ДМит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| ФСБ ДМит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| ФСИН ДМит |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСИН:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]9.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Розыск без причины (УМВД) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Розыск/штраф без причины (ГИБДД) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.02.[/color] Запрещено выдавать розыск, штраф без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Розыск без причины (ФСБ) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| nRP поведение УМВД |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику УМВД.[/COLOR][/SIZE][/FONT]<br>" +
                "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| nRP поведение ГИБДД |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику ГИБДД.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/SIZE][/FONT]<br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| nRP поведение ФСБ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику ФСБ.[/COLOR][/SIZE][/FONT]<br>" +
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/SIZE][/FONT]<br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br>" +
        "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Права в погоне (ГИБДД) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Одиночный патруль |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Обыск без отыгровки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.05.[/color] Запрещено проводить обыск игрока без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| NRP Cop |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR][COLOR=#797cc7]BARNAUL[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
         {
            title: 'Правила ОПГ ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| Нарушение правил ОПГ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан за нарушение общих правил криминальных организаций.<br><br>"+
        "[B][CENTER][Spoiler][/COLOR][COLOR=rgb(209, 213, 216)] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
		"[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Строгий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| NonRP В/Ч |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn[/color].<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| NonRP В/Ч (не ОПГ) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Jail 30 минут[/color].<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| NonRP огр/похищ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан за нарушение правил ограблений и похищений.<br><br>"+
        "[B][CENTER][Spoiler][/COLOR][COLOR=rgb(209, 213, 216)] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
		"[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Строгий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Провокация Госсников |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.[/color] Запрещено провоцировать сотрудников государственных организаций [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Провокация ОПГшников |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.[/color] Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Дуэли |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]5.[/color] Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
        "[B][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]территория проведения войны за бизнес, когда мероприятие не проходит[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Перестрелки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.[/color] Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Рекламирование в чате |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.[/color] Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Уход от погони |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], игрок будет наказан по следующему пункту правил для криминальных организаций:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.[/color] Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
        {
            title: 'Отказ жалоб ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| Дублирование |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован. <br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Ответ был ранее |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как ответ на вашу жалобу был дан ранее. <br><br>"+
		"[B][CENTER][COLOR=lavender]Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован. <br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Нарушений не найдено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
      "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с общими правилами проекта — [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Вирт на донат |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как по следующему пункту правил проекта:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman]Обмен автокейса, покупка доп. слота на транспорт в семью и т.д. за виртуальную валюту запрещено.<br>Соответственно никакого [COLOR=#FF0000]нарушения[/COLOR] со стороны данного игрока [COLOR=#FF0000]нет.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с общими правилами проекта — [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Возврат средств |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с общими правилами проекта — [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Недостаточно док-в |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
      "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с общими правилами проекта — [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как доказательств на нарушение от данного игрока  отсутствуют. <br><br>"+
      "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с общими правилами проекта — [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Док-ва отредактированы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как доказательств на нарушение от данного игрока  отредактированы. <br><br>"+
      "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с общими правилами проекта — [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Слив семьи |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
      "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с общими правилами проекта — [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Заголовок не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как заголовок вашей жалобы составлен не по форме. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Нет /time |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Нет тайм-кодов |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как отсутствует тайм-коды. Если видео длится больше 3-х минут - Вы должны указать тайм-коды нарушений. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Более 72-х часов |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Док-ва соц сеть |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Условия сделки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Нужен фрапс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Фрапс обрывается |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Док-ва не открываются |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Док-ва в плохом качестве |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Ваши доказательства в плохом качестве. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Жалоба от 3-го лицо |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Жалоба на 2+ игроков |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как нельзя писать одну жалобу на двух и более игроков (на каждого игрока отдельная жалоба). <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Жб с оскорблениями |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как в ней присутствуют оскорбительные фразы. Убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему.<br><br>"+
        '[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
         "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Ошиблись сервером |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
         {
            title: 'RP Биографии ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },
      {
        title: '| RP био одобрена |',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография получает статус: Одобрена.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(76, 175, 80)][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]<br>"+
        "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
       prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био отказана |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография получает статус: Отказана.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP На доработке |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография получает статус: На доработке.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 152, 0)][ICODE]На доработке.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био ник |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay биография получает статус: Отказана, так как у Вас NonRP NickName.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био заголовок не по форме |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay биография Отказана, так как Ваш заголовок оформлен неправильно.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| Более 1 рп био на ник |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как запрещено создавать более одной RP Биографии на один NickName.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био некоррект. возраст |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как в ней указан некорректный возраст.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био мало информации |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как в ней написано мало информации. [/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био нет 18 лет |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как Вашему персонажу нет 18 лет.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био от 3-го лица |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как она составлена от 3-го лица.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био не по форме |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как она составлена не по форме. [/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био не дополнил |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как Вы её не дополнили.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био неграмотная |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как она оформлена неграмотно.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/COLOR][/SIZE][/FONT]<br>" +
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/COLOR][/SIZE][/FONT]<br>" +
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
     {
        title: '| RP био тавтология |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как она оформлена неграмотно.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP био скопирована |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как она была скопирована. [/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
      title: '| RP био скопирована со своей старой |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как она была скопирована с Вашей прошлой RP Биографии на другой NickName.<br>На новый NickName нужно создать новую историю персонажа.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| Мало инфо детство |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как в пункте *Детство* предоставлено мало информации.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| Мало инфо юность |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как в пункте *Юность и Взрослая жизнь* предоставлено мало информации.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| Мало инфо в 3-х пунктах |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как в пунктах *Детство*, *Юность и Взрослая жизнь* предоставлено мало информации.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
      title: '| Нет города на проекте |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как на проекте нет данного города или населенного пункта.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
      title: '| Нелогичность |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, причиной послужило не логичность ее написания.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            //style: 'flex-grow: 1; border-radius: 25px; font-family: JetBrains Mono',
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
      title: '| Прибывание в городе которого нет |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay - биография Отказана, так как в ней описывается прибывание в городе которого не существует на проекте.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
        {
            title: 'RP Ситуации ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

    {
        title: '| RP сит одобрена |',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay ситуация получает статус: Одобрена.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(76, 175, 80)][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]<br>"+
        "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
       prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
     },
     {
        title: '| RP сит отказана |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay ситуация - Отказана.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP сит скопирована |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay ситуация - Отказана, так как она была скопирована. [/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP сит не по форме |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay ситуация - Отказана, так как она составлена не по форме. [/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP сит заголовок не по форме |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay ситация - Отказана, так как Ваш заголовок оформлен неправильно.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP сит нет смысла |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша RolePlay ситация - Отказана, так как в ней нет имеющего смысла.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
         {
            title: ' Неофициальные RP организации ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },
    {
        title: '| RP неоф орг одобрена |',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша Неофициальная RolePlay организация получает статус: Одобрена. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(76, 175, 80)][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]<br>"+
        "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
        prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
     },
     {
        title: '| RP неоф орг отказана |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша Неофициальная RolePlay организация - Отказана.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания Неофициальных RP организаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP неоф орг скопирована |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша Неофициальная RolePlay организация - Отказана, так как она была скопирована. [/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания Неофициальных RP организаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP неоф орг не по форме |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша Неофициальная RolePlay организация - Отказана, так как она составлена не по форме. [/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания Неофициальных RP организаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]<br><br>",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP неоф орг состав 3+ |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша Неофициальная RolePlay организация - Отказана, так как у Вас нет стартового состава от 3(-х)+ человек.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания Неофициальных RP организаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
    {
        title: '| RP неоф орг нет смысла |',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vT3RR4Vc/footer-barnaul.png[/img][/url]<br>"+
         "[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=rgb(121, 124, 199)][ICODE] Ваша Неофициальная RolePlay организация - Отказана, так как в ней нет имеющего смысла.[/ICODE][/COLOR][/CENTER][/B]"+
        "[I][FONT=georgia][SIZE=3][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)] Внимательно прочитайте правила создания Неофициальных RP организаций закрепленные в данном разделе. [/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
       "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[HEADING=3][B][FONT=georgia][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR][/FONT][/HEADING]",
       prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
    },
         {
            title: 'ЖБ на Лидеров ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| Лидер снят/чс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]Одобрена[/COLOR], Лидер будет снят со своей должности.<br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman]`[center]Будет выдан Черный список.<br>"+
        "[B][CENTER][color=red]Закрыто[/color][/center][/font][/size]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| На рассмотрении ЛД |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER] Ваша жалоба взята на рассмотрение.<br><br>" +
		"[B][CENTER]Пожалуйста ожидайте ответа.<br>" +
        "[B][COLOR=orange]На рассмотрении.[/color][/CENTER]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	prefix: PIN_PREFIX,
	  status: true,
         style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Не по форме ЛД |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
        "[B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто.<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на лидеров — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.3429391/']*Кликабельно*[/URL]<br>"+
        "[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Проведена беседа |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Благодарим за ваше обращение!<br>" +
		"[B][CENTER]С Лидером будет проведена профилактическая беседа.<br><br>" +
        "[B][CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Получит наказание |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Благодарим за ваше обращение!<br>" +
		"[B][CENTER]Лидер получит соответствующие наказание.<br><br>"+
        "[B][CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},

{
	  title: '| Не являеться ЛД |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Данный игрок больше не являеться лидером.<br>" +
        "[B][CENTER][COLOR=rgb(255, 0, 0)]Отказано.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: CLOSE_PREFIX,
           status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Лидер был снят |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Благодарим за ваше обращение, Лидер был снят со своей должности<br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][center]Черный список будет выдан на<br>"+
        "[B][CENTER][color=red]Закрыто.[/color][/center]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
          status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Недостаточно док-в ЛД |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как доказательств на нарушение от Лидера недостаточно.<br><br>"+
        "[B][CENTER][color=red]Отказано.[/color][/center]<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на лидеров, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Нету нарушение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как нарушений со стороны Лидера не было найдено.<br><br>"+
        "[B][CENTER][color=red]Отказано.[/color][/center]<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на лидеров, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Правила раздела |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.<br><br>"+
        "[B][CENTER][color=red]Закрыто.[/color][/center]<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на лидеров, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Опра у ЛД |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Запросил доказательсва у Лидера, жалоба взята на [COLOR=#ffff00]Рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
        "[B][COLOR=orange]На рассмотрении.[/color] [/CENTER]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: PIN_PREFIX,
	  status: false,
         style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Проинструктировать |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Лидер не предоставил доказательства вашего нарушения!<br>" +
		"[B][CENTER]Лидер получит соответствующие наказание.<br><br>"+
        "[B][CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	 prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Лидер прав |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как Лидер предоставил доказательтво вашего нарушения.<br><br>"+
        "[B][CENTER][color=red]Закрыто.[/color][/center]<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на лидеров, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
          status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| 48ч на заполнение форума |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как на заполнение форумного раздела Лидеру даётся около 48 часов.<br><br>"+
        "[B][CENTER][color=red]Закрыто.[/color][/center]<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на лидеров, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
      status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
        {
            title: 'Жб на администрацию ',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },

{
	  title: '| На рассмотрение на адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба взята на [COLOR=#FFAD33]Рассмотрение[/COLOR], пожалуйста не создавайте дубликатов темы. Ожидайте ответа.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: PIN_PREFIX,
	  status: true,
         style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Запросил опру |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]У администратора были запрошены доказательства о выданном наказании. Ожидайте ответа и не нужно создавать копии этой темы.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: PIN_PREFIX,
	  status: true,
         style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Недостаточно док-в адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как доказательств на нарушение от Администратора недостаточно. <br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Нарушений от адм нет |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как нарушений со стороны Администратора не было найдено. [SIZE=4]<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Будет проведена беседа с админом |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была [COLOR=#00FF00]Одобрена[/COLOR], будет проведена беседа с администратором.[SIZE=4]<br><br>"+
		"[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Наказание по ошибке |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была [COLOR=#00FF00]Одобрена[/COLOR], так как в следствии беседы с администратором, было выяснено, наказание было выдано по ошибке.<br>С администратором будет проведена профилактическая беседа, Ваше наказание будет снято.[SIZE=4]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Приносим свои извинения за предоставленные неудобства.[SIZE=4]<br><br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Док-ва в соц сети |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
      	"[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Выговор адм |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была [COLOR=#00FF00]Одобрена[/COLOR], администратор получит соответсвующее наказание на своем посту.[SIZE=4]<br>"+
        "[B][CENTER][COLOR=lavender]Благодарим за ваше обращение.<br><br>"+
		"[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
     prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| ПСЖ адм |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Администратор был снят/ушел по собстевенному желанию со своего поста.[SIZE=4]<br>"+
        "[B][CENTER][COLOR=lavender]Ваше наказание будет снято, благодарим за ваше обращение.<br><br>"+
        '[B][CENTER][COLOR=green][ICODE]Рассмотрено.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Проинструктировать адм |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была [COLOR=#00FF00]Одобрена[/COLOR], и c администратором будет проведена работа и инструктаж по данной жалобе.[SIZE=4]<br><br>"+
        '[B][CENTER][COLOR=green][ICODE]Одобрено | Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		"[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Будет снят |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была [COLOR=#00FF00]Одобрена[/COLOR], и администратор будет снят с поста.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(0, 128, 0)][ICODE]Отказано | Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Нерабочая док-ва адм |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе не открываются доказательства о нарушении администратора.[SIZE=4]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: CLOSE_PREFIX,
	  status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Нету доквы на адм |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутствуют доказательства о нарушении администратора.[SIZE=4]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: CLOSE_PREFIX,
	  status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Выдано верно (адм) |',
      content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Администратор, выдавший наказание предоставил опровержение на ваше нарушение. Наказание выданное вам, было выдано верно.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано | Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Жалоба от 3-го лица |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[SIZE=4]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: CLOSE_PREFIX,
	  status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Док-ва отредактированы адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], так как доказательства на нарушение от данного администратора отредактированы.[SIZE=4]<br><br>"+
 	    '[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: CLOSE_PREFIX,
	  status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Не по форме (адм) |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба составлена не по форме. С формой создания темы можно ознакомиться ниже:[SIZE=4]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 1. Ваш Nick_Name [SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 2.Nick_Name администратора<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 3.Дата выдачи/получения наказания:<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 4.Суть жалобы:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 5.Доказательство: <br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано | Закрыто.[/ICODE][/COLOR][/B][/CENTER]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами данного раздела, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| 48 часов написания жалобы |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано | Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Нету /time |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутствует /time.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано | Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Нету док-в |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутсвуют доказательства о нарушении администратора[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано | Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Признался в нарушении |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вы сами признались в своём нарушении.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано | Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Окно блокировки |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Зайдите в игру и сделайте скриншот окна с блокировки аккаунта после чего, заново напишите жалобу на администратора.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано | Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Смените IP |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Смените Wi-Fi соединение или же IP адресс на тот с которого Вы играли раньше, дело именно в нем.<br>Перезагрузите ваш роутер или используйте VPN.[SIZE=4] <br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: CLOSE_PREFIX,
	  status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Подобная жалоба(ответ не был дан) |',
      content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы, ожидайте ответа в подобной жалобе. [SIZE=4]<br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней. <br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: CLOSE_PREFIX,
	  status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Правила раздела (адм) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]Отказана[/COLOR], пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.<br>"+
        '[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| Жб с оскорблениями |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба не подлежит Рассмотрению, так как в ней присутствуют оскорбительные фразы. Убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему.<br><br>"+
        '[B][CENTER][COLOR=red][ICODE]Отказано | Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Подобная жалоба (ответ был дан) |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы,  ответ был дан в подобной жалобе. <br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней.[SIZE=4] <br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
      prefix: CLOSE_PREFIX,
	  status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| П. СА |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана [COLOR=red]Специальному Администратору[/COLOR] —  @Sander_Kligan. Ожидайте ответа, пожалуйста не создавайте дубликатов данной темы.[SIZE=4]<br><br>'+
        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: SPECY_PREFIX,
       status: true,
    style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| П. ЗСА |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана [COLOR=red]Заместителям Специального Администратора.[/COLOR]<br>Ожидайте ответа, пожалуйста не создавайте дубликатов данной темы.[SIZE=4]<br><br>'+
        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: SPECY_PREFIX,
       status: true,
    style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| П. ГА |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана [COLOR=red]Главному Администратору[/COLOR] —  @Evgeniy Yurievich ♡. Ожидайте ответа.[SIZE=4]<br><br>'+
        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: GA_PREFIX,
       status: true,
    style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| П. ЗГА (Осн) |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана [COLOR=red]Заместителю Главного Администратора[/COLOR] —  @Ilya Vifer 𓆩♡𓆪. Ожидайте ответа.[SIZE=4]<br><br>'+
        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: GA_PREFIX,
	  status: true,
         style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| П. ЗГА (Орг) |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана [COLOR=red]Заместителю Главного Администратора[/COLOR] —  @Rock Kligan 𓆩♡𓆪. Ожидайте ответа.[SIZE=4]<br><br>'+
        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в разделе правил сервера.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	   prefix: GA_PREFIX,
	  status: true,
         style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
            title: 'Прочие ответы',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
},
{
	  title: `| Приветствие |`,
	  content:
		`[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>`+
		`[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE][/COLOR][/CENTER][/B]<br><br>`+
		`[B][CENTER][COLOR=lavender]      [/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с общими правилами проекта — [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/']*Кликабельно*[/URL]<br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>`+
		`[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>`,
        style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: `| Покупка/продажа |`,
      content:
      `[center][size=4][font=georgia][color=yellow]Все выше:[/color][color=rgb(0, 255, 0)] Одобрено[/color]<br><br>`+
      `[color=red]Примечание:[/color] Продавать/Покупать Т/С разрашается после 23:00 по МСК.<br><br>`+
      `[SIZE=4][FONT=times new roman][CENTER][COLOR=lavender]С уважением[/COLOR][COLOR=rgb(216, 0, 0)] Заместитель Главного администратора - Rock Kligan![/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: PIN_PREFIX,
      style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: `| Пропуск еж. собр |`,
      content:
      `[center][size=4][FONT=times new roman][color=yellow]Все выше:[/color][color=rgb(0, 255, 0)] Одобрено[/color]<br><br>`+
      `[SIZE=4][FONT=times new roman][CENTER][COLOR=lavender]С уважением[/COLOR][COLOR=rgb(216, 0, 0)] Заместитель Главного администратора - Rock Kligan![/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: PIN_PREFIX,
      style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: `| Снятие выг |`,
      content:
      `[center][size=4][FONT=times new roman][color=yellow]Все выше:[/color][color=rgb(0, 255, 0)] Одобрено[/color]<br><br>`+
      `[color=red][FONT=times new roman]Примечание:[/color] Перевыполнение игрового норматива должно быть сделано после получения наказания.<br><br>`+
      `[SIZE=4][FONT=times new roman][CENTER][COLOR=lavender]С уважением[/COLOR][COLOR=rgb(216, 0, 0)] Заместитель Главного администратора - Rock Kligan![/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: PIN_PREFIX,
      style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
            title: `| Итоги неактива |`,
            content :  `[CENTER] [CENTER][FONT=georgia][SIZE=5][COLOR=rgb(230, 230, 250)]Приветствую,  неактивы успешно проверены.[/CENTER] <br>`+
            `[SIZE=4] [CENTER] [COLOR=red] Список отказанных администраторов:[/color]<br>`+
             `[CENTER] [LIST]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [*]  — [COLOR=red] Причина отказа: [/color]
             [/LIST]<br><br>`+
            `[SIZE=4][FONT=times new roman][CENTER][COLOR=lavender]С уважением[/COLOR][COLOR=rgb(216, 0, 0)] Заместитель Главного администратора - Rock Kligan![/COLOR][/FONT][/SIZE][/CENTER]`,
             style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: `| Заяв на неактив |`,
      content:
      `[center][size=4][FONT=times new roman][color=yellow]Все выше:[/color][color=rgb(0, 255, 0)] Одобрено[/color]<br><br>`+
      `[color=red][FONT=times new roman]Примечание:[/color] С нетерпением ждем вашего возвращения к работе!<br><br>`+
      `[SIZE=4][FONT=times new roman][CENTER][COLOR=lavender]С уважением[/COLOR][COLOR=rgb(216, 0, 0)] Заместитель Главного администратора - Rock Kligan![/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: PIN_PREFIX,
      style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
        {
            title: 'Обжалования',
            style: 'width: 97%; background: #797cc7', //(подсветка)box-shadow: 0px 0px 5px #fff',
        },
{
      title: '| Обжалованию не подлежит |',
      content:
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование [COLOR=#FF0000]Отказано[/COLOR].[SIZE=4]<br><br>"+
		"[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>"+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Прошло меньше 48ч |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование [COLOR=#FF0000]Отказано[/COLOR], со времени выданного Вам наказания не прошло еще 48 часов для подачи обжалования.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Не по форме |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование [COLOR=#FF0000]Отказано[/COLOR], так как Ваше обжалование составлено не по форме.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Наказание будет смягчено |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование [COLOR=#00FF00]Одобрено[/COLOR], Ваше наказание будет смягчено, впредь не совершайте подобных ошибок.[SIZE=4]<br><br>"+
        '[B][CENTER][COLOR=green][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+       "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Обж NonRp обман |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Если Вы хотите хотите обжаловать наказание за NonRp обман Вы должны сами связаться с человеком, которого обманули.[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]После чего он должен написать на Вас обжалование прикрепив доказательства договора о возврате имущества, ссылку на жалобу которую писал на Вас, скриншот окна блокировки обманувшего, ссылки на ВК обеих сторон.[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]По другому Вы никак не сможете обжаловать наказание за NonRp обман.[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Возврат производиться без моральной компенсации.[SIZE=4]<br><br>"+
		'[B][CENTER][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Возврат имущества (24ч) |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование взято на [COLOR=#FFAD33]Рассмотрение[/COLOR], Ваш аккаунт будет разблокирован на 24 часа, в течении этого времени, Вы должны вернуть имущество игроку по договоренности , и прикрепить видеофиксацию сделки в данную тему.[SIZE=4]<br><br>"+
        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		"[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: PIN_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Обж на рассмотрении |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование взято на [COLOR=#FFAD33]Рассмотрение[/COLOR], пожалуйста не создавайте дубликатов темы. Ожидайте ответа.[SIZE=4]<br><br>"+
        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		"[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: PIN_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Смена ника |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваш аккаунт будет разблокирован на 24 часа для смены игрового NickName<br>"+
        "[B][CENTER][COLOR=lavender]После смены NickName Вы должны будете прикрепить доказательства в данной теме.[SIZE=4]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: PIN_PREFIX,
	        status: true,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Возврат имущества |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование взято на [COLOR=#FFAD33]Рассмотрение[/COLOR], если Вы согласны возместить ущерб, свяжитесь с обманутой стороной любым способом чтобы вернуть украденное, после прикрепите доказательства в данную тему.[SIZE=4]<br><br>"+
        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		"[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: PIN_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
      title: '| Обжалован |',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование [COLOR=#00FF00]Одобрено[/COLOR], Ваше наказание будет снято, впредь не совершайте подобных ошибок.[SIZE=4]<br><br>"+
        '[B][CENTER][COLOR=green][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		"[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: ACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
{
	  title: '| В жалобы на адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/brtvQFHp/footer-barnaul-1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше обжалование [COLOR=#FF0000]Отказано[/COLOR], Если Вы не согласны с выданным наказанием, то вам в раздел «Жалобы на администрацию».<br>"+
        '[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи обжалования наказаний — [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL(69)[/COLOR]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	        prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; font-Arial: JetBrains Mono',
},
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'background: #73450088; border: 2px solid #ffad33; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Важно', 'Vajno', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Команде Проекта', 'teamProject', 'background: #6b600188; border: 2px solid #fff06e; border-radius: 10px; font-family: JetBrains Mono');
        addButton('ГА', 'Ga', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Спецу', 'Spec', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Одобрено', 'accepted', 'background: #00440088; border: 2px solid #0a0; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Отказано', 'unaccept', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Теху', 'Texy', 'background: #00004488; border: 2px solid #00a; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Закрыто', 'Zakrito', 'background: #44000088; border: 2px solid #a00; border-radius: 10px; font-family: JetBrains Mono');
        addButton('Ожидание', 'Ojidanie', 'background: #444444ff; border: 2px solid #aaa; border-radius: 10px; font-family: JetBrains Mono');
        //addButton('Информация о скрипте', 'Info', 'background: #34aeeb88; border: 2px solid #34aeeb; border-radius: 10px; font-family: JetBrains Mono');
        //addButton('Памятка', 'Help', 'background: #34aeeb88; border: 2px solid #34aeeb; border-radius: 10px; font-family: JetBrains Mono');
        addAnswers();

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true, false));
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
            XF.alert(buttonsMarkup(buttons), null, '(Барнаул рулит) Выберите ответ:');
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
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 10px; border: 3px solid; border-radius: 10px; background: #797cc7; padding: 0px 10px 0px 10px; font-Arial-Black: JetBrains Mono; border-color: #9c9ff0;">ОТВЕТЫ</button>`,
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
            `<span class="button-text" style="margin-bottom: 20px; text-align: center; font-size: 16px; font-weight: 500; background: #34aaeb; padding: 5px; border-radius: 15px">Автором и разработчиком данного скрипта является Андрей - r.kl1gan. Выразим ему огромное спасибо за помощь!<br>По всем вопросам и предложениям обращайтесь в телеграмм.</span>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #34aeeb; flex-grow: 1;"><a href="https://t.me/kligan333" target="_blank"  class="button-text">Telegram arefuer</a></button>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #34aeeb; flex-grow: 1;"><a href="https://greasyfork.org/ru/users/1088949-arefuer" target="_blank" class="button-text">greasyfork</a></button>` +
            `<span class="button-text" style="margin: 0 auto 0; text-align: center; font-size: 16px; font-weight: 500; background: #34aaeb; padding: 10px; border-radius: 25px">by R.Kligan</span></div>`;
    }

    function helpAlert() {
        return `<div class="help_menu" style="display:flex; flex-direction:column; flex-wrap:wrap">` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">1. Barnaul(69)</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">2. Barnaul(69)</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">3. Barnaul(69)</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">4. Barnaul(69)</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #34aeeb; padding: 10px; border-radius: 20px">5. Barnaul(69)</span>`;
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
                                'Доброе утро',
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