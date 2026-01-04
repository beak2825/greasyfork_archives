// ==UserScript==
// @name ! Кнопки навигации ГТС/ЗГТС
// @match https://forum.blackrussia.online/*
// @version 1.0
// @license none
// @namespace Botir_Soliev
// @grant GM_addStyle
// @description by B.Soliev
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/519760/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%20%D0%93%D0%A2%D0%A1%D0%97%D0%93%D0%A2%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/519760/%21%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8%20%D0%93%D0%A2%D0%A1%D0%97%D0%93%D0%A2%D0%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Скрипт загружен");

    // Добавляем стили для кнопок и меню
    GM_addStyle(`
    .button-container {
        position: fixed; /* Устанавливает контейнер с кнопками как фиксированный на экране */
        left: 50%; /* Располагает контейнер по центру относительно левой стороны экрана */
        top: 50px; /* Отступ сверху от верхней границы экрана (под меню) */
        transform: translateX(-50%); /* Смещает контейнер влево на 50%, чтобы он был точно в центре */
        z-index: 9999; /* Устанавливает высокий уровень наложения, чтобы контейнер был сверху всех элементов */
        display: none; /* Контейнер кнопок скрыт по умолчанию */
        flex-wrap: wrap; /* Позволяет кнопкам переходить на новые строки, если они не помещаются */
        justify-content: flex-start; /* Выравнивание кнопок по левому краю в контейнере */
        width: 90vw; /* Ширина контейнера — 90% от ширины экрана */
        padding: 15px; /* Внутренний отступ для контейнера */
        background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный черный фон */
        border-radius: 10px; /* Закругленные углы контейнера */
        transition: opacity 0.3s ease; /* Плавный переход для изменения прозрачности */
    }
    .custom-button {
        color: white; /* Белый цвет текста */
        padding: 5px 10px; /* Увеличенные отступы для кнопки */
        border: none; /* Без границы */
        border-radius: 5px; /* Закругленные углы кнопки */
        font-size: 12px; /* Размер шрифта текста в кнопке */
        cursor: pointer; /* Курсор в виде руки при наведении */
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5); /* Легкая тень под кнопкой */
        transition: background-color 0.3s, transform 0.2s; /* Плавный переход для фона и трансформации */
        margin: 5px; /* Отступы между кнопками */
        width: 10%; /* Ширина кнопки — 18% от ширины контейнера */
        text-align: center; /* Центрируем текст внутри кнопки */
        white-space: nowrap; /* Запрещаем перенос текста на новую строку */
    }
    .custom-button:hover {
        opacity: 0.8; /* Прозрачность при наведении */
        transform: scale(1.05); /* Немного увеличиваем кнопку при наведении */
    }
    .menu-container {
        position: fixed; /* Устанавливает контейнер с меню как фиксированный */
        left: 50%; /* Центрирует контейнер по горизонтали */
        top: 8px; /* Отступ сверху от верхней границы экрана (выше контейнера кнопок) */
        z-index: 9999; /* Высокий уровень наложения, чтобы меню было сверху */
        display: flex; /* Используем flexbox для горизонтального расположения кнопок */
        justify-content: center; /* Центрируем кнопки по горизонтали */
        transform: translateX(-50%); /* Смещаем контейнер влево на 50% для точного центрирования */
    }
    .menu-button {
        padding: 3px 10px; /* Уменьшенные отступы для кнопки меню */
        color: white; /* Белый текст */
        border: none; /* Без границы */
        border-radius: 5px; /* Закругленные углы */
        cursor: pointer; /* Курсор в виде руки при наведении */
        font-size: 14px; /* Размер шрифта */
        width: 120px; /* Устанавливаем фиксированную ширину для кнопок меню */
        transition: background-color 0.3s ease; /* Плавный переход для изменения фона */
        margin: 0 10px; /* Отступы между кнопками меню */
    }
    .menu-button-1 {
        background-color: #8B008B; /* Синий фон для первой кнопки */
    }
    .menu-button-2 {
        background-color: #0000CD; /* Зеленый фон для второй кнопки */
    }
    .menu-button-3 {
        background-color: #DC143C; /* Желтый фон для третьей кнопки */
    }
    .background-overlay {
        position: fixed; /* Фиксированное положение фона */
        top: 0;
        left: 0;
        width: 100%; /* Ширина на весь экран */
        height: 100%; /* Высота на весь экран */
        background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный черный фон */
        z-index: 9998; /* Наложение на фон */
        display: none; /* Скрыт по умолчанию */
    }
    .container-header {
        color: white;
        font-size: 16px;
        margin-bottom: 10px;
        text-align: center;
        font-weight: bold;
    }
    `);

    // Создаем контейнеры для кнопок
    const buttonContainer1 = document.createElement('div');
    buttonContainer1.className = 'button-container';
    document.body.appendChild(buttonContainer1);

    const buttonContainer2 = document.createElement('div');
    buttonContainer2.className = 'button-container';
    document.body.appendChild(buttonContainer2);

    const buttonContainer3 = document.createElement('div');
    buttonContainer3.className = 'button-container';
    document.body.appendChild(buttonContainer3);

    // Массивы с данными кнопок для каждого контейнера
    const buttonsData1 = [    
        { text: 'RED (1)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-red.226/', color: '#8B008B' },
        { text: 'GREEN (2)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-green.227/', color: '#8B008B' },
        { text: 'BLUE (3)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-blue.228/', color: '#8B008B' },
        { text: 'YELLOW (4)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-yellow.229/', color: '#8B008B' },
        { text: 'ORANGE (5)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-orange.245/', color: '#8B008B' },
        { text: 'PURPLE (6)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-purple.325/', color: '#8B008B' },
        { text: 'LIME (7)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-lime.365/', color: '#8B008B' },
        { text: 'PINK (8)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-pink.396/', color: '#8B008B' },
        { text: 'CHERRY (9)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-cherry.408/', color: '#8B008B' },
        { text: 'BLACK (10)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-black.488/', color: '#8B008B' },
        { text: 'INDIGO (11)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-indigo.493/', color: '#8B008B' },
        { text: 'WHITE (12)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-white.554/', color: '#8B008B' },
        { text: 'MAGENTA (13)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-magenta.613/', color: '#8B008B' },
        { text: 'CRIMSON (14)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-crimson.653/', color: '#8B008B' },
        { text: 'GOLD (15)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-gold.660/', color: '#8B008B' },
        { text: 'AZURE (16)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-azure.701/', color: '#8B008B' },
        { text: 'PLATINUM (17)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-platinum.757/', color: '#8B008B' },
        { text: 'AQUA (18)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-aqua.815/', color: '#8B008B' },
        { text: 'GRAY (19)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-gray.857/', color: '#8B008B' },
        { text: 'ICE (20)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ice.925/', color: '#8B008B' },
        { text: 'CHILLI (21)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-chilli.1007/', color: '#8B008B' },
        { text: 'CHOCO (22)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-choco.1048/', color: '#8B008B' },
        { text: 'MOSCOW (23)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-moscow.1052/', color: '#8B008B' },
        { text: 'SPB (24)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-spb.1095/', color: '#8B008B' },
        { text: 'UFA (25)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ufa.1138/', color: '#8B008B' },
        { text: 'SOCHI (26)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-sochi.1248/', color: '#8B008B' },
        { text: 'KAZAN (27)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kazan.1290/', color: '#8B008B' },
        { text: 'SAMARA (28)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-samara.1292/', color: '#8B008B' },
        { text: 'ROSTOV (29)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-rostov.1334/', color: '#8B008B' },
        { text: 'ANAPA (30)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-anapa.1416/', color: '#8B008B' },
        { text: 'EKB (31)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ekb.1458/', color: '#8B008B' },
        { text: 'KRASNODAR (32)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-krasnodar.1460/', color: '#8B008B' },
        { text: 'ARZAMAS (33)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-arzamas.1502/', color: '#8B008B' },
        { text: 'NOVOSIBIRSK (34)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-novosibirsk.1544/', color: '#8B008B' },
        { text: 'GROZNY (35)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-grozny.1586/', color: '#8B008B' },
        { text: 'SARATOV (36)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-saratov.1628/', color: '#8B008B' },
        { text: 'OMSK (37)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-omsk.1670/', color: '#8B008B' },
        { text: 'IRKUTSK (38)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-irkutsk.1712/', color: '#8B008B' },
        { text: 'VOLGOGRAD (39)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-volgograd.1758/', color: '#8B008B' },
        { text: 'VORONEZH (40)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-voronezh.1800/', color: '#8B008B' },
        { text: 'BELGOROD (41)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-belgorod.1840/', color: '#8B008B' },
        { text: 'MAKHACHKALA (42)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-makhachkala.1884/', color: '#8B008B' },
        { text: 'VLADIKAVKAZ (43)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-vladikavkaz.1926/', color: '#8B008B' },
        { text: 'VLADIVOSTOK (44)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-vladivostok.1968/', color: '#8B008B' },
        { text: 'KALININGRAD (45)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kaliningrad.2010/', color: '#8B008B' },
        { text: 'CHELYABINSK (46)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-chelyabinsk.2052/', color: '#8B008B' },
        { text: 'KRASNOYARSK (47)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-krasnoyarsk.2094/', color: '#8B008B' },
        { text: 'CHEBOKSARY (48)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-cheboksary.2136/', color: '#8B008B' },
        { text: 'KHABAROVSK (49)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-khabarovsk.2178/', color: '#8B008B' },
        { text: 'PERM (50)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-perm.2220/', color: '#8B008B' },
        { text: 'TULA (51)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-tula.2262/', color: '#8B008B' },
        { text: 'RYAZAN (52)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ryazan.2304/', color: '#8B008B' },
        { text: 'MURMANSK (53)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-murmansk.2346/', color: '#8B008B' },
        { text: 'PENZA (54)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-penza.2388/', color: '#8B008B' },
        { text: 'KURSK (55)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kursk.2430/', color: '#8B008B' },
        { text: 'ARKHANGELSK (56)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-arkhangelsk.2472/', color: '#8B008B' },
        { text: 'ORENBURG (57)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-orenburg.2514/', color: '#8B008B' },
        { text: 'KIROV (58)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kirov.2516/', color: '#8B008B' },
        { text: 'KEMEROVO (59)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kemerovo.2598/', color: '#8B008B' },
        { text: 'TYUMEN (60)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-tyumen.2639/', color: '#8B008B' },
        { text: 'TOLYATTI (61)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-tolyatti.2682/', color: '#8B008B' },
        { text: 'IVANOVO (62)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ivanovo.2714/', color: '#8B008B' },
        { text: 'STAVROPOL (63)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-stavropol.2747/', color: '#8B008B' },
        { text: 'SMOLENSK (64)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-smolensk.2779/', color: '#8B008B' },
        { text: 'PSKOV (65)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-pskov.2811/', color: '#8B008B' },
        { text: 'BRYANSK (66)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-bryansk.2843/', color: '#8B008B' },
        { text: 'OREL (67)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-orel.2875/', color: '#8B008B' },
        { text: 'YAROSLAVL (68)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-yaroslavl.2907/', color: '#8B008B' },
        { text: 'BARNAUL (69)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-barnaul.2939/', color: '#8B008B' },
        { text: 'LIPETSK (70)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-lipetsk.2971/', color: '#8B008B' },
        { text: 'ULYANOVSK (71)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-ulyanovsk.3003/', color: '#8B008B' },
        { text: 'YAKUTSK (72)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-yakutsk.3035/', color: '#8B008B' },
        { text: 'TAMBOV (73)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-tambov.3289/', color: '#8B008B' },
        { text: 'BRATSK (74)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-bratsk.3324/', color: '#8B008B' },
        { text: 'ASTRAKHAN (75)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-astrakhan.3359/', color: '#8B008B' },
        { text: 'CHITA (76)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-chita.3394/', color: '#8B008B' },
        { text: 'KOSTROMA (77)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kostroma.3429/', color: '#8B008B' },
        { text: 'VLADIMIR (78)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-vladimir.3464/', color: '#8B008B' },
        { text: 'KALUGA (79)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-kaluga.3499/', color: '#8B008B' },
        { text: 'NOVGOROD (80)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-novgorod.3535/', color: '#8B008B' },
        { text: 'TAGANROG (81)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-taganrog.3570/', color: '#8B008B' },
        { text: 'VOLOGDA (82)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-vologda.3605/', color: '#8B008B' },
        { text: 'TVER (83)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-tver.3643/', color: '#8B008B' },
        { text: 'TOMSK (84)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-tomsk.3740/', color: '#8B008B' },
        { text: 'IZHEVSK (85)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-izhevsk.3747/', color: '#8B008B' },
        { text: 'SURGUT (86)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-surgut.3812/', color: '#8B008B' },
        { text: 'PODOLSK (87)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-podolsk.3817/', color: '#8B008B' },
        { text: 'MAGADAN (88)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-magadan.3912/', color: '#8B008B' },
        { text: 'CHEREPOVETS (89)', link: 'https://forum.blackrussia.online/forums/Технический-раздел-cherepovets.3978/', color: '#8B008B' },
        
    ];

    const buttonsData2 = [
        { text: 'RED (1)', link: 'https://forum.blackrussia.online/forums/Сервер-№1-red.1182/', color: '#0000CD' },
        { text: 'GREEN (2)', link: 'https://forum.blackrussia.online/forums/Сервер-№2-green.1183/', color: '#0000CD' },
        { text: 'BLUE (3)', link: 'https://forum.blackrussia.online/forums/Сервер-№3-blue.1184/', color: '#0000CD' },
        { text: 'YELLOW (4)', link: 'https://forum.blackrussia.online/forums/Сервер-№4-yellow.1185/', color: '#0000CD' },
        { text: 'ORANGE (5)', link: 'https://forum.blackrussia.online/forums/Сервер-№5-orange.1186/', color: '#0000CD' },
        { text: 'PURPLE (6)', link: 'https://forum.blackrussia.online/forums/Сервер-№6-purple.1187/', color: '#0000CD' },
        { text: 'LIME (7)', link: 'https://forum.blackrussia.online/forums/Сервер-№7-lime.1188/', color: '#0000CD' },
        { text: 'PINK (8)', link: 'https://forum.blackrussia.online/forums/Сервер-№8-pink.1189/', color: '#0000CD' },
        { text: 'CHERRY (9)', link: 'https://forum.blackrussia.online/forums/Сервер-№9-cherry.1190/', color: '#0000CD' },
        { text: 'BLACK (10)', link: 'https://forum.blackrussia.online/forums/Сервер-№10-black.1191/', color: '#0000CD' },
        { text: 'INDIGO (11)', link: 'https://forum.blackrussia.online/forums/Сервер-№11-indigo.1192/', color: '#0000CD' },
        { text: 'WHITE (12)', link: 'https://forum.blackrussia.online/forums/Сервер-№12-white.1193/', color: '#0000CD' },
        { text: 'MAGENTA (13)', link: 'https://forum.blackrussia.online/forums/Сервер-№13-magenta.1194/', color: '#0000CD' },
        { text: 'CRIMSON (14)', link: 'https://forum.blackrussia.online/forums/Сервер-№14-crimson.1195/', color: '#0000CD' },
        { text: 'GOLD (15)', link: 'https://forum.blackrussia.online/forums/Сервер-№15-gold.1196/', color: '#0000CD' },
        { text: 'AZURE (16)', link: 'https://forum.blackrussia.online/forums/Сервер-№16-azure.1197/', color: '#0000CD' },
        { text: 'PLATINUM (17)', link: 'https://forum.blackrussia.online/forums/Сервер-№17-platinum.1198/', color: '#0000CD' },
        { text: 'AQUA (18)', link: 'https://forum.blackrussia.online/forums/Сервер-№18-aqua.1199/', color: '#0000CD' },
        { text: 'GRAY (19)', link: 'https://forum.blackrussia.online/forums/Сервер-№19-gray.1200/', color: '#0000CD' },
        { text: 'ICE (20)', link: 'https://forum.blackrussia.online/forums/Сервер-№20-ice.1201/', color: '#0000CD' },
        { text: 'CHILLI (21)', link: 'https://forum.blackrussia.online/forums/Сервер-№21-chilli.1202/', color: '#0000CD' },
        { text: 'CHOCO (22)', link: 'https://forum.blackrussia.online/forums/Сервер-№22-choco.1203/', color: '#0000CD' },
        { text: 'MOSCOW (23)', link: 'https://forum.blackrussia.online/forums/Сервер-№23-moscow.1204/', color: '#0000CD' },
        { text: 'SPB (24)', link: 'https://forum.blackrussia.online/forums/Сервер-№24-spb.1205/', color: '#0000CD' },
        { text: 'UFA (25)', link: 'https://forum.blackrussia.online/forums/Сервер-№25-ufa.1206/', color: '#0000CD' },
        { text: 'SOCHI (26)', link: 'https://forum.blackrussia.online/forums/Сервер-№26-sochi.1247/', color: '#0000CD' },
        { text: 'KAZAN (27)', link: 'https://forum.blackrussia.online/forums/Сервер-№27-kazan.1289/', color: '#0000CD' },
        { text: 'SAMARA (28)', link: 'https://forum.blackrussia.online/forums/Сервер-№28-samara.1291/', color: '#0000CD' },
        { text: 'ROSTOV (29)', link: 'https://forum.blackrussia.online/forums/Сервер-№29-rostov.1333/', color: '#0000CD' },
        { text: 'ANAPA (30)', link: 'https://forum.blackrussia.online/forums/Сервер-№30-anapa.1415/', color: '#0000CD' },
        { text: 'EKB (31)', link: 'https://forum.blackrussia.online/forums/Сервер-№31-ekb.1457/', color: '#0000CD' },
        { text: 'KRASNODAR (32)', link: 'https://forum.blackrussia.online/forums/Сервер-№32-krasnodar.1459/', color: '#0000CD' },
        { text: 'ARZAMAS (33)', link: 'https://forum.blackrussia.online/forums/Сервер-№33-arzamas.1501/', color: '#0000CD' },
        { text: 'NOVOSIBIRSK (34)', link: 'https://forum.blackrussia.online/forums/Сервер-№34-novosibirsk.1543/', color: '#0000CD' },
        { text: 'GROZNY (35)', link: 'https://forum.blackrussia.online/forums/Сервер-№35-grozny.1585/', color: '#0000CD' },
        { text: 'SARATOV (36)', link: 'https://forum.blackrussia.online/forums/Сервер-№36-grozny.1585/', color: '#0000CD' },
        { text: 'OMSK (37)', link: 'https://forum.blackrussia.online/forums/Сервер-№37-omsk.1669/', color: '#0000CD' },
        { text: 'IRKUTSK (38)', link: 'https://forum.blackrussia.online/forums/Сервер-№38-irkutsk.1711/', color: '#0000CD' },
        { text: 'VOLGOGRAD (39)', link: 'https://forum.blackrussia.online/forums/Сервер-№39-volgograd.1757/', color: '#0000CD' },
        { text: 'VORONEZH (40)', link: 'https://forum.blackrussia.online/forums/Сервер-№40-voronezh.1801/', color: '#0000CD' },
        { text: 'BELGOROD (41)', link: 'https://forum.blackrussia.online/forums/Сервер-№41-belgorod.1841/', color: '#0000CD' },
        { text: 'MAKHACHKALA (42)', link: 'https://forum.blackrussia.online/forums/Сервер-№42-makhachkala.1883/', color: '#0000CD' },
        { text: 'VLADIKAVKAZ (43)', link: 'https://forum.blackrussia.online/forums/Сервер-№43-vladikavkaz.1925/', color: '#0000CD' },
        { text: 'VLADIVOSTOK (44)', link: 'https://forum.blackrussia.online/forums/Сервер-№44-vladivostok.1967/', color: '#0000CD' },
        { text: 'KALININGRAD (45)', link: 'https://forum.blackrussia.online/forums/Сервер-№45-kaliningrad.2009/', color: '#0000CD' },
        { text: 'CHELYABINSK (46)', link: 'https://forum.blackrussia.online/forums/Сервер-№46-chelyabinsk.2051/', color: '#0000CD' },
        { text: 'KRASNOYARSK (47)', link: 'https://forum.blackrussia.online/forums/Сервер-№47-krasnoyarsk.2093/', color: '#0000CD' },
        { text: 'CHEBOKSARY (48)', link: 'https://forum.blackrussia.online/forums/Сервер-№48-cheboksary.2135/', color: '#0000CD' },
        { text: 'KHABAROVSK (49)', link: 'https://forum.blackrussia.online/forums/Сервер-№49-khabarovsk.2177/', color: '#0000CD' },
        { text: 'PERM (50)', link: 'https://forum.blackrussia.online/forums/Сервер-№50-perm.2219/', color: '#0000CD' },
        { text: 'TULA (51)', link: 'https://forum.blackrussia.online/forums/Сервер-№51-tula.2261/', color: '#0000CD' },
        { text: 'RYAZAN (52)', link: 'https://forum.blackrussia.online/forums/Сервер-№52-ryazan.2303/', color: '#0000CD' },
        { text: 'MURMANSK (53)', link: 'https://forum.blackrussia.online/forums/Сервер-№53-murmansk.2345/', color: '#0000CD' },
        { text: 'PENZA (54)', link: 'https://forum.blackrussia.online/forums/Сервер-№54-penza.2387/', color: '#0000CD' },
        { text: 'KURSK (55)', link: 'https://forum.blackrussia.online/forums/Сервер-№55-kursk.2429/', color: '#0000CD' },
        { text: 'ARKHANGELSK (56)', link: 'https://forum.blackrussia.online/forums/Сервер-№56-arkhangelsk.2471/', color: '#0000CD' },
        { text: 'ORENBURG (57)', link: 'https://forum.blackrussia.online/forums/Сервер-№57-orenburg.2513/', color: '#0000CD' },
        { text: 'KIROV (58)', link: 'https://forum.blackrussia.online/forums/Сервер-№58-kirov.2515/', color: '#0000CD' },
        { text: 'KEMEROVO (59)', link: 'https://forum.blackrussia.online/forums/Сервер-№59-kemerovo.2597/', color: '#0000CD' },
        { text: 'TYUMEN (60)', link: 'https://forum.blackrussia.online/forums/Сервер-№60-tuymen.2640/', color: '#0000CD' },
        { text: 'TOLYATTI (61)', link: 'https://forum.blackrussia.online/forums/Сервер-№61-tolyatti.2681/', color: '#0000CD' },
        { text: 'IVANOVO (62)', link: 'https://forum.blackrussia.online/forums/Сервер-№62-ivanovo.2713/', color: '#0000CD' },
        { text: 'STAVROPOL (63)', link: 'https://forum.blackrussia.online/forums/Сервер-№63-stavropol.2746/', color: '#0000CD' },
        { text: 'SMOLENSK (64)', link: 'https://forum.blackrussia.online/forums/Сервер-№64-smolensk.2778/', color: '#0000CD' },
        { text: 'PSKOV (65)', link: 'https://forum.blackrussia.online/forums/Сервер-№65-pskov.2810/', color: '#0000CD' },
        { text: 'BRYANSK (66)', link: 'https://forum.blackrussia.online/forums/Сервер-№66-bryansk.2842/', color: '#0000CD' },
        { text: 'OREL (67)', link: 'https://forum.blackrussia.online/forums/Сервер-№67-orel.2874/', color: '#0000CD' },
        { text: 'YAROSLAVL (68)', link: 'https://forum.blackrussia.online/forums/Сервер-№68-yaroslavl.2906/', color: '#0000CD' },
        { text: 'BARNAUL (69)', link: 'https://forum.blackrussia.online/forums/Сервер-№69-barnaul.2938/', color: '#0000CD' },
        { text: 'LIPETSK (70)', link: 'https://forum.blackrussia.online/forums/Сервер-№70-lipetsk.2970/', color: '#0000CD' },
        { text: 'ULYANOVSK (71)', link: 'https://forum.blackrussia.online/forums/Сервер-№71-ulyanovsk.3002/', color: '#0000CD' },
        { text: 'YAKUTSK (72)', link: 'https://forum.blackrussia.online/forums/Сервер-№72-yakutsk.3034/', color: '#0000CD' },
        { text: 'TAMBOV (73)', link: 'https://forum.blackrussia.online/forums/Сервер-№73-tambov.3288/', color: '#0000CD' },
        { text: 'BRATSK (74)', link: 'https://forum.blackrussia.online/forums/Сервер-№74-bratsk.3323/', color: '#0000CD' },
        { text: 'ASTRAKHAN (75)', link: 'https://forum.blackrussia.online/forums/Сервер-№75-astrakhan.3358/', color: '#0000CD' },
        { text: 'CHITA (76)', link: 'https://forum.blackrussia.online/forums/Сервер-№76-chita.3393/', color: '#0000CD' },
        { text: 'KOSTROMA (77)', link: 'https://forum.blackrussia.online/forums/Сервер-№77-kostroma.3428/', color: '#0000CD' },
        { text: 'VLADIMIR (78)', link: 'https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3463/', color: '#0000CD' },
        { text: 'KALUGA (79)', link: 'https://forum.blackrussia.online/forums/Сервер-№79-kaluga.3498/', color: '#0000CD' },
        { text: 'NOVGOROD (80)', link: 'https://forum.blackrussia.online/forums/Сервер-№80-novgorod.3533/', color: '#0000CD' },
        { text: 'TAGANROG (81)', link: 'https://forum.blackrussia.online/forums/Сервер-№81-taganrog.3569/', color: '#0000CD' },
        { text: 'VOLOGDA (82)', link: 'https://forum.blackrussia.online/forums/Сервер-№82-vologda.3604/', color: '#0000CD' },
        { text: 'TVER (83)', link: 'https://forum.blackrussia.online/forums/Сервер-№83-tver.3642/', color: '#0000CD' },
        { text: 'TOMSK (84)', link: 'https://forum.blackrussia.online/forums/Сервер-№84-tomsk.3739/', color: '#0000CD' },
        { text: 'IZHEVSK (85)', link: 'https://forum.blackrussia.online/forums/Сервер-№85-izhevsk.3746/', color: '#0000CD', },
        { text: 'SURGUT (86)', link: 'https://forum.blackrussia.online/forums/Сервер-№86-surgut.3811/', color: '#0000CD', },
        { text: 'PODOLSK (87)', link: 'https://forum.blackrussia.online/forums/Сервер-№87-podolsk.3816/', color: '#0000CD', },
        { text: 'MAGADAN (88)', link: 'https://forum.blackrussia.online/forums/Сервер-№88-magadan.3911/', color: '#0000CD', },
        { text: 'CHEREPOVETS (89)', link: 'https://forum.blackrussia.online/forums/Сервер-№89-cherepovets.3946/', color: '#0000CD', },
    ];

    const buttonsData3 = [
       { text: 'RED (1)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.88/', color: '#DC143C' },
        { text: 'GREEN (2)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.119/', color: '#DC143C' },
        { text: 'BLUE (3)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.156/', color: '#DC143C' },
        { text: 'YELLOW (4)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.194/', color: '#DC143C' },
        { text: 'ORANGE (5)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.273/', color: '#DC143C' },
        { text: 'PURPLE (6)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.312/', color: '#DC143C' },
        { text: 'LIME (7)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.352/', color: '#DC143C' },
        { text: 'PINK (8)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.394/', color: '#DC143C' },
        { text: 'CHERRY (9)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.435/', color: '#DC143C' },
        { text: 'BLACK (10)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.470/', color: '#DC143C' },
        { text: 'INDIGO (11)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.519/', color: '#DC143C' },
        { text: 'WHITE (12)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.560/', color: '#DC143C' },
        { text: 'MAGENTA (13)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.599/', color: '#DC143C' },
        { text: 'CRIMSON (14)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.640/', color: '#DC143C' },
        { text: 'GOLD (15)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.682/', color: '#DC143C' },
        { text: 'AZURE (16)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.723/', color: '#DC143C' },
        { text: 'PLATINUM (17)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.785/', color: '#DC143C' },
        { text: 'AQUA (18)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.844/', color: '#DC143C' },
        { text: 'GRAY (19)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.885/', color: '#DC143C' },
        { text: 'ICE (20)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.954/', color: '#DC143C' },
        { text: 'CHILLI (21)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.994/', color: '#DC143C' },
        { text: 'CHOCO (22)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1036/', color: '#DC143C' },
        { text: 'MOSCOW (23)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1082/', color: '#DC143C' },
        { text: 'SPB (24)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1124/', color: '#DC143C' },
        { text: 'UFA (25)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1167/', color: '#DC143C' },
        { text: 'SOCHI (26)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1234/', color: '#DC143C' },
        { text: 'KAZAN (27)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1276/', color: '#DC143C' },
        { text: 'SAMARA (28)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1320/', color: '#DC143C' },
        { text: 'ROSTOV (29)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1362/', color: '#DC143C' },
        { text: 'ANAPA (30)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1402/', color: '#DC143C' },
        { text: 'EKB (31)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1444/', color: '#DC143C' },
        { text: 'KRASNODAR (32)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1488/', color: '#DC143C' },
        { text: 'ARZAMAS (33)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1531/', color: '#DC143C' },
        { text: 'NOVOSIBIRSK (34)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1572/', color: '#DC143C' },
        { text: 'GROZNY (35)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1614/', color: '#DC143C' },
        { text: 'SARATOV (36)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1656/', color: '#DC143C' },
        { text: 'OMSK (37)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1698/', color: '#DC143C' },
        { text: 'IRKUTSK (38)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1740/', color: '#DC143C' },
        { text: 'VOLGOGRAD (39)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1786/', color: '#DC143C' },
        { text: 'VORONEZH (40)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1828/', color: '#DC143C' },
        { text: 'BELGOROD (41)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1870/', color: '#DC143C' },
        { text: 'MAKHACHKALA (42)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1912/', color: '#DC143C' },
        { text: 'VLADIKAVKAZ (43)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1954/', color: '#DC143C' },
        { text: 'VLADIVOSTOK (44)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1996/', color: '#DC143C' },
        { text: 'KALININGRAD (45)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2038/', color: '#DC143C' },
        { text: 'CHELYABINSK (46)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2080/', color: '#DC143C' },
        { text: 'CHELYABINSK (47)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2122/', color: '#DC143C' },
        { text: 'CHEBOKSARY (48)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2164/', color: '#DC143C' },
        { text: 'KHABAROVSK (49)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2206/', color: '#DC143C' },
        { text: 'PERM (50)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2248/', color: '#DC143C' },
        { text: 'TULA (51)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2290/', color: '#DC143C' },
        { text: 'RYAZAN (52)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2332/', color: '#DC143C' },
        { text: 'MURMANSK (53)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2374/', color: '#DC143C' },
        { text: 'PENZA (54)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2416/', color: '#DC143C' },
        { text: 'KURSK (55)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2458/', color: '#DC143C' },
        { text: 'ARKHANGELSK (56)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2500/', color: '#DC143C' },
        { text: 'ORENBURG (57)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2545/', color: '#DC143C' },
        { text: 'KIROV (58)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2584/', color: '#DC143C' },
        { text: 'KEMEROVO (59)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2626/', color: '#DC143C' },
        { text: 'TYUMEN (60)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2663/', color: '#DC143C' },
        { text: 'TOLYATTI (61)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2702/', color: '#DC143C' },
        { text: 'IVANOVO (62)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2735/', color: '#DC143C' },
        { text: 'STAVROPOL (63)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2767/', color: '#DC143C' },
        { text: 'SMOLENSK (64)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2799/', color: '#DC143C' },
        { text: 'PSKOV (65)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2831/', color: '#DC143C' },
        { text: 'BRYANSK (66)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2863/', color: '#DC143C' },
        { text: 'OREL (67)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2895/', color: '#DC143C' },
        { text: 'YAROSLAVL (68)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2927/', color: '#DC143C' },
        { text: 'BARNAUL (69)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2959/', color: '#DC143C' },
        { text: 'LIPETSK (70)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2991/', color: '#DC143C' },
        { text: 'ULYANOVSK (71)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3023/', color: '#DC143C' },
        { text: 'YAKUTSK (72)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3055/', color: '#DC143C' },
        { text: 'TAMBOV (73)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3309/', color: '#DC143C' },
        { text: 'BRATSK (74)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3344/', color: '#DC143C' },
        { text: 'ASTRAKHAN (75)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3379/', color: '#DC143C' },
        { text: 'CHITA (76)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3414/', color: '#DC143C' },
        { text: 'KOSTROMA (77)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3449/', color: '#DC143C' },
        { text: 'VLADIMIR (78)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/', color: '#DC143C' },
        { text: 'KALUGA (79)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3519/', color: '#DC143C' },
        { text: 'NOVGOROD (80)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3555/', color: '#DC143C' },
        { text: 'TAGANROG (81)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3590/', color: '#DC143C' },
        { text: 'VOLOGDA (82)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3625/', color: '#DC143C' },
        { text: 'TVER (83)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3666/', color: '#DC143C' },
        { text: 'TOMSK (84)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3728/', color: '#DC143C' },
        { text: 'IZHEVSK (85)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3767/', color: '#DC143C' },
        { text: 'SURGUT (86)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3800/', color: '#DC143C' },
        { text: 'PODOLSK (87)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3837/', color: '#DC143C' },
        { text: 'MAGADAN (88)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3932/', color: '#DC143C' },
        { text: 'CHEREPOVETS (89)', link: 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3967/', color: '#DC143C' },
        
    ];

    // Функция для создания кнопок
    function createButtons(buttonsData, container) {
        buttonsData.forEach((buttonData) => {
            const button = document.createElement('div');
            button.className = 'custom-button';
            button.innerHTML = buttonData.text;
            button.style.backgroundColor = buttonData.color;

            button.addEventListener('click', function() {
                window.location.href = buttonData.link; // Открываем ссылку в том же окне
            });

            container.appendChild(button);
        });
    }

    // Функция для создания заголовка контейнера
    function createContainerHeader(container, headerText) {
        const header = document.createElement('div');
        header.className = 'container-header';
        header.innerText = headerText;
        container.appendChild(header);
        return header;
    }

    // Создаем заголовки для каждого контейнера
    const header1 = createContainerHeader(buttonContainer1, '');                        // Заголовок
    const header2 = createContainerHeader(buttonContainer2, '');                        // Заголовок
    const header3 = createContainerHeader(buttonContainer3, '');                        // Заголовок

    // Создаем кнопки для каждого контейнера
    createButtons(buttonsData1, buttonContainer1);
    createButtons(buttonsData2, buttonContainer2);
    createButtons(buttonsData3, buttonContainer3);

    // Создаем 3 кнопки меню (горизонтально)
    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container';

    const menuButton1 = document.createElement('button');
    menuButton1.className = 'menu-button menu-button-1';
    menuButton1.innerHTML = 'Тех.разделы';

    const menuButton2 = document.createElement('button');
    menuButton2.className = 'menu-button menu-button-2';
    menuButton2.innerHTML = 'ЖБ на техов';

    const menuButton3 = document.createElement('button');
    menuButton3.className = 'menu-button menu-button-3';
    menuButton3.innerHTML = 'ЖБ на игроков';

    // Добавляем кнопки в контейнер
    menuContainer.appendChild(menuButton1);
    menuContainer.appendChild(menuButton2);
    menuContainer.appendChild(menuButton3);

    // Создаем фон для контейнера
    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.className = 'background-overlay';
    document.body.appendChild(backgroundOverlay);

    // Обработчики события для кнопок меню
    menuButton1.addEventListener('click', function() {
        buttonContainer1.style.display = buttonContainer1.style.display === 'flex' ? 'none' : 'flex';
        buttonContainer2.style.display = 'none';
        buttonContainer3.style.display = 'none';
        backgroundOverlay.style.display = buttonContainer1.style.display === 'flex' ? 'block' : 'none';
        header1.style.display = buttonContainer1.style.display === 'flex' ? 'block' : 'none';
    });

    menuButton2.addEventListener('click', function() {
        buttonContainer2.style.display = buttonContainer2.style.display === 'flex' ? 'none' : 'flex';
        buttonContainer1.style.display = 'none';
        buttonContainer3.style.display = 'none';
        backgroundOverlay.style.display = buttonContainer2.style.display === 'flex' ? 'block' : 'none';
        header2.style.display = buttonContainer2.style.display === 'flex' ? 'block' : 'none';
    });

    menuButton3.addEventListener('click', function() {
        buttonContainer3.style.display = buttonContainer3.style.display === 'flex' ? 'none' : 'flex';
        buttonContainer1.style.display = 'none';
        buttonContainer2.style.display = 'none';
        backgroundOverlay.style.display = buttonContainer3.style.display === 'flex' ? 'block' : 'none';
        header3.style.display = buttonContainer3.style.display === 'flex' ? 'block' : 'none';
    });

    // Добавляем меню в тело страницы
    document.body.appendChild(menuContainer);

})();
