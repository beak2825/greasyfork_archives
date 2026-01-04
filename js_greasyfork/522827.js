// ==UserScript==
// @name         HDRezka Dubbing Marker
// @namespace    http://tampermonkey.net/
// @version      2.1.5.1
// @description  Добавляет флажки стран, значки телеканалов и студий рядом с названием озвучки на HDRezka
// @author       T.Er
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @icon         https://statichdrezka.ac/templates/hdrezka/images/avatar.png
// @grant        GM.addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522827/HDRezka%20Dubbing%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/522827/HDRezka%20Dubbing%20Marker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Добавляем кнопки в меню TamperMonkey
    let menuCommands = {};

    // Описываем функции в массиве
    const features = [
        { keyFunc: 'funcRaitingIconEnabled', name: 'Иконки в Рейтинге озвучек' },
        { keyFunc: 'funcRaitingColorEnabled', name: 'Цветной блок с Рейтингом озвучек' },
    ];

    // Регистрируем все пункты меню
    function registerAllMenus() {
        // Удаляем старые команды меню
        for (let id in menuCommands) {
            GM_unregisterMenuCommand(menuCommands[id]);
        }
        menuCommands = {};

        // Регистрируем новые команды
        for (let feature of features) {
            let enabled = GM_getValue(feature.keyFunc, true);
            let title = (enabled ? "✅ Вкл: " : "❌ Выкл: ") + feature.name;

            menuCommands[feature.keyFunc] = GM_registerMenuCommand(title, () => toggleFeature(feature));
        }
    }

    // Функция переключения состояния
    function toggleFeature(feature) {
        let currentState = GM_getValue(feature.keyFunc, true);
        let newState = !currentState;
        GM_setValue(feature.keyFunc, newState);

        alert(`${feature.name} ${newState ? '✅ Включен (а)' : '❌ Выключен (а)'}\nПерезагрузите страницу!`);

        registerAllMenus(); // Перерегистрировать меню после переключения
    }

    // При старте скрипта
    registerAllMenus();

   // CSS-код
GM.addStyle(`
.b-translators__block {
    background-color: #151515;
    padding: 10px 5px;
    text-align: left !important;
    box-sizing: border-box;
    overflow: auto;
    /* display: flex; */
    flex-wrap: wrap;
    gap: 8px;
    justify-content: space-between;
}

.b-translator__item {
    box-sizing: border-box;
    border-radius: 3px;
    background-color: #2D2D2D;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
    overflow: hidden;
    padding: 5px;
    position: relative;
    text-overflow: ellipsis;
    text-align: center;
    white-space: nowrap;
    flex: 1 1 calc((100% / 3) - 8px);
}
.b-translator__item:hover{
   background-color: #157FAC;
}
.b-translator__item.active{
   background: #5D5D5D !important;
   cursor: pointer;
}

`);


    function addFlags(select_block) {
        const flagData = [
            //Флажки стран
            { key: "Белорусский", src: "https://statichdrezka.ac/i/flags/by.png", title: "Белорусский" },
            { key: "Грузинский", src: "https://statichdrezka.ac/i/flags/ge.png", title: "Грузинский" },
            { key: "Азербайджанский", src: "https://statichdrezka.ac/i/flags/az.png", title: "Азербайджанский" },
            { key: "Узбекский", src: "https://statichdrezka.ac/i/flags/uz.png", title: "Узбекский" },
            { key: "субтитры", src: "https://img.icons8.com/?size=100&id=XCcnZrg9lnPM&format=png&color=000000", title: "Субтитры" },
            { key: "без цензуры", src: "https://img.icons8.com/?size=100&id=o3iN2IEeyqAq&format=png&color=000000", title: "18+" },
            //Иконки озвучек и релиз-групп
            { key: "HDrezka Studio", src: "https://statichdrezka.ac/templates/hdrezka/images/avatar.png", title: "HDRezka Studio", width: 17, height: 17, bottom: "-1px" },
            { key: "лостфильм", src: "https://lostpix.com/img/2025-01/04/75o3n6md7s5qo9p5vpz8b9a4b.jpg", title: "ЛостФильм" },
            { key: "яскъер", src: "https://lostpix.com/img/2025-01/04/b2ply34edh156aphznvkectqv.png", title: "Яскъер", width: 16, height: 16, radius: "10%" },
            { key: "Кубе", src: "https://lostpix.com/img/2025-01/04/24g0thmtvc936tr2nfc56plvi.jpg", title: "Кубик в Кубе", radius: "10%" },
            { key: "Red Head Sound", src: "https://lostpix.com/img/2025-01/04/wzlvivblwmiw56h432d43fzcd.jpg", title: "RHS", radius: "50%" },
            { key: "TVShows", src: "https://lostpix.com/img/2025-01/04/pmjr5qoeybuar1e1xlv3b1sak.jpg", title: "TVShows", height: 14, width: 32, radius: "5%" },
            { key: "VHSник", src: "https://lostpix.com/img/2025-03/23/5g082agrvbumq4roxrqdso57r.png", title: "VHSник", height: 12, width: 32, bottom: "1px" },
            { key: "Flarrow Films", src: "https://lostpix.com/img/2025-01/04/emgaf24p5utbmomglbnvg4svd.png", title: "FF" },
            { key: "Киномания", src: "https://upload.wikimedia.org/wikipedia/uk/1/18/Kinomania_loho.png", title: "Киномания", width: 24 },
            { key: "СВ-Дубль", src: "https://lostpix.com/img/2025-01/06/ztky56bs65xck9ndxa6gmhlos.jpg", title: "СВ-Дубль" },
            { key: "Варус", src: "https://lostpix.com/img/2025-03/23/ob52pg4rv3b2k6iyt3fybn8jh.png", title: "Варус Видео", width: 22 },
            { key: "Союз", src: "https://upload.wikimedia.org/wikipedia/ru/thumb/e/e6/Logo_souz.svg/800px-Logo_souz.svg.png", title: "Союз", height: 16, width: 13 },
            { key: "CP Digital", src: "https://lostpix.com/img/2025-03/23/y130r1u5gl5rqhzr9vjm76gt4.png", title: "CP Digital", radius: "5%" },
            { key: "Лазер-Видео", src: "https://lostpix.com/img/2025-01/06/1lp5ifxsdpmogsl0ymh67sj43.png", title: "Лазер-Видео" },
            { key: "Tycoon", src: "https://lostpix.com/img/2025-01/06/f8q1n6zunkcon5kgoeka6ns28.gif", title: "Tycoon" },
            { key: "West Video", src: "https://lostpix.com/img/2025-03/23/2t38pz9v4frn58m0czpnkry2j.png", title: "West Video", width: 24 },
            { key: "колдфильм", src: "https://lostpix.com/img/2025-01/07/i7m2nsqihte3dyp12m3e01hlz.png", title: "Колдфильм" },
            { key: "Condor", src: "https://lostpix.com/img/2025-01/07/0kaxqknxd4ws07njxwsgpck4f.png", title: "Condor" },
            { key: "RStudioSound", src: "https://lostpix.com/img/2025-01/07/gnbqcht943wn4qn0kmanzgl0s.png", title: "RStudioSound" },
            { key: "Le-Production", src: "https://lostpix.com/img/2025-01/07/ezufgwoyjcjamz9jn6sx5s9ry.jpg", title: "Le-Production", height: 13, width: 15, radius: "10%" },
            { key: "RUDUB", src: "https://lostpix.com/img/2025-01/07/ozoi9scvxcxm8ypboh6i8qco6.png", title: "RUDUB", height: 16, width: 16 },
            { key: "NewStudio", src: "https://lostpix.com/img/2025-01/07/b4kqxpu41xk75kpysq21hsqft.png", title: "NewStudio", height: 12, width: 32, bottom: "2px" },
            { key: "Цікава Ідея", src: "https://lostpix.com/img/2025-03/23/egngt6s4rukc3054z7eam8qym.png", title: "Цікава Ідея" },
            { key: "Novamedia", src: "https://lostpix.com/img/2025-05/03/kgstoi9zb9xrimhnmj6ey2pgj.png", title: "Novamedia", height: 14, width: 14 },
            { key: "Amedia", src: "https://upload.wikimedia.org/wikipedia/ru/6/6d/Logo_Amedia.png", title: "Amedia" },
            { key: "NovaFilm", src: "http://fandub.wiki/images/4/43/Novafilm.png", title: "NovaFilm", height: 14, width: 32 },
            { key: "Fox", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/FOX_wordmark-orange_2.svg/1920px-FOX_wordmark-orange_2.svg.png", title: "FOX", height: 12, width: 30, bottom: "1px" },
            { key: "AlexFilm", src: "https://lostpix.com/img/2025-01/12/bn3j92rytskxn32jrud0nq5fe.png", title: "AlexFilm", height: 16, width: 16, radius: "10%" },
            { key: "Видеосервис", src: "https://lostpix.com/img/2025-03/23/cpjor1m40yj1x6ag4zfmkh4cj.png", title: "Видеосервис" },
            { key: "Премьер", src: "https://upload.wikimedia.org/wikipedia/ru/e/e1/Премьер_Видео_Фильм.png", title: "Премьер", width: 12 },
            { key: "Good", src: "https://lostpix.com/img/2025-01/12/1fd0lvm6kvct0a3mufhc5v3xr.jpg", title: "Good People", height: 16, width: 16, radius: "50%" },
            { key: "1win", src: "https://lostpix.com/img/2025-01/12/d8dv3ayvjbf6ufjm3wd70cm84.jpg", title: "1win", height: 16, width: 16, radius: "50%" },
            { key: "байбако", src: "https://lostpix.com/img/2025-01/12/pqatyqrd34h0bi8u8cfmzrw4p.jpg", title: "BaibaKoTV", height: 15, width: 30 },
            { key: "Кураж", src: "https://lostpix.com/img/2025-01/12/fv6sye0rmcqrolblhac9yqbwi.png", title: "Кураж-Бамбей", height: 16, width: 16 },
            { key: "StudioBand", src: "https://lostpix.com/img/2025-03/23/63yhpdovqozqr2giw68t6gszs.jpg", title: "StudioBand", height: 16, width: 16, radius: "50%" },
            { key: "Гоблин", src: "https://lostpix.com/img/2025-01/16/b2mvyp1l2xigl84720g0fkmvr.jpg", title: "Гоблин", height: 16, width: 16, radius: "10%" },
            { key: "Viruse", src: "https://lostpix.com/img/2025-01/17/g0wnqpr7cbcgxnobhumbkw23y.jpg", title: "ViruseProject", height: 16, width: 16, radius: "50%" },
            { key: "R5", src: "https://lostpix.com/img/2025-01/18/vzlmcdea6is64963lwevd3lzx.png", title: "R5", height: 14, width: 30 },
            { key: "Hate Studio", src: "https://lostpix.com/img/2025-07/13/gqt6g69uepaxjmu4wvr2ydaz1.jpg", title: "Hate Studio", height: 16, width: 16, radius: "50%" },
            { key: "Jetvis", src: "https://lostpix.com/img/2025-07/14/x05wejrncapirxdr31n14yhm0.jpg", title: "Jetvis Studio", height: 16, width: 16, radius: "50%" },
            { key: "Whiskey Sound", src: "https://lostpix.com/img/2025-07/14/9htemhkok1s9xvplz0hph148h.jpg", title: "Whiskey Sound", height: 16, width: 16, radius: "50%" },
            { key: "DVD Магия", src: "https://lostpix.com/img/2025-07/28/ktyj4cekr02pzodzoemjbgxri.png", title: "DVD Магия", height: 14, width: 30 },
            { key: "Pazl Voice", src: "https://lostpix.com/img/2025-08/14/56bzqfx0z98zbhpmeja3bulq6.png", title: "Pazl Voice", height: 16, width: 16 },
            { key: "AlphaProject", src: "https://lostpix.com/img/2025-10/03/4foniwe765lzvfd32mg52bc51.jpg", title: "AlphaProject", height: 16, width: 16, radius: "50%" },
            //Иконки телеканалов
            { key: "РенТВ", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/REN_TV_logo_2017.svg/300px-REN_TV_logo_2017.svg.png", title: "РенТВ" },
            { key: "НТВ", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/NTV_logo_2003.svg/300px-NTV_logo_2003.svg.png", title: "НТВ", radius: "5%" },
            { key: "ОРТ", src: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Channel_one_russia_logo_3.PNG", title: "ОРТ" },
            { key: "SDI Media", src: "https://upload.wikimedia.org/wikipedia/ru/3/30/SDI-media.png", title: "SDI Media", height: 14, width: 32, radius: "5%" },
            { key: "ТВ-3", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/TV-3_logo_%282015%29.png/1024px-TV-3_logo_%282015%29.png", title: "ТВ-3" },
            { key: "СТС", src: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Логотип_СТС_2005-2012.png", title: "СТС" },
            { key: "ТВ6", src: "https://upload.wikimedia.org/wikipedia/commons/e/e0/TV-6.jpg", title: "ТВ6", height: 14, width: 22, radius: "5%" },
            { key: "5 канал", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/5-tv_logo_%282023%29.svg/1024px-5-tv_logo_%282023%29.svg.png", title: "5 канал" },
            { key: "РТР", src: "https://upload.wikimedia.org/wikipedia/ru/1/1a/VGTRK_logo_VGTRK_sign.png", title: "РТР", height: 14, width: 32, bottom: "1px", radius: "5%" },
            { key: "ВГТРК", src: "https://upload.wikimedia.org/wikipedia/ru/1/1a/VGTRK_logo_VGTRK_sign.png", title: "ВГТРК", height: 14, width: 32, bottom: "1px", radius: "5%" },
            { key: "ТНТ", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Logo_tnt.png", title: "ТНТ", height: 12, width: 36, bottom: "3px" },
            { key: "Первый", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/1канал-5.svg/1024px-1канал-5.svg.png", title: "Первый" },
            { key: "ТВЦ", src: "https://upload.wikimedia.org/wikipedia/ru/thumb/7/72/TV_Tsentr_2013_Logo.svg/170px-TV_Tsentr_2013_Logo.svg.png", title: "ТВЦ", height: 14, width: 32, bottom: "1px" },
            { key: "DreamCast", src: "https://dreamerscast.com/favicon.ico", title: "DreamCast", height: 15, width: 15, radius: "50%" },
            { key: "AMC", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/AMC_logo_2019.svg/1024px-AMC_logo_2019.svg.png", title: "AMC", width: 30 },
            { key: "Останкино", src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Логотип_1-й_канал_Останкино_%28фиолетовый%29.png", title: "Останкино" },
            { key: "Paramount", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Paramount_Network.svg/1024px-Paramount_Network.svg.png", title: "Paramount" },
            { key: "Карусель", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Karusel_2022.svg/640px-Karusel_2022.svg.png", title: "Карусель", height: 14, width: 38 },
            { key: "Universal", src: "https://upload.wikimedia.org/wikipedia/commons/4/49/Universal_Pictures_logo_2.png", title: "Universal", height: 16, width: 30 },
            { key: "Селена", src: "https://lostpix.com/img/2025-01/12/k1xs6kzito87say3gfb7sv0xe.png", title: "Селена", height: 16, width: 26 },
            { key: "MTV", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/MTV_2021_%28brand_version%29.svg/1920px-MTV_2021_%28brand_version%29.svg.png", title: "MTV", width: 24 },
            { key: "Sony", src: "https://upload.wikimedia.org/wikipedia/ru/7/7f/Логотип_телеканал_Sony_Sci-Fi.png", title: "Sony", height: 16, width: 13 },
            { key: "Домашний", src: "https://upload.wikimedia.org/wikipedia/ru/thumb/a/a5/Логотип_телеканала_«Домашний»_с_16_декабря_2017.png/1024px-Логотип_телеканала_«Домашний»_с_16_декабря_2017.png", title: "Домашний", height: 16, width: 16 },
            { key: "CBS", src: "https://m.media-amazon.com/images/M/MV5BMDZhMzNhNjktNzAzZi00YzIxLThhMjgtYjg4Yzk5ZTQwZjIwXkEyXkFqcGdeQXVyNDY1NTYzMDA@._V1_FMjpg_UX1000_.jpg", title: "CBS", height: 16, width: 16, radius: "10%" },
            { key: "ДТВ", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/DTV_Logo.svg/1920px-DTV_Logo.svg.png", title: "ДТВ", height: 14, width: 32, bottom: "1px" },
            { key: "2x2", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/2x2_TV_Logo.svg/1920px-2x2_TV_Logo.svg.png", title: "2x2", height: 14, width: 32 },
            { key: "Арт", src: "https://lostpix.com/img/2025-03/23/g6ogrptzyf3j1hv8bzheakdvk.png", title: "Екб АРТ", height: 16, width: 16, radius: "10%" },
            { key: "Кириллица", src: "https://lostpix.com/img/2025-01/16/545gfsyxijaq5ehg489o5s0h2.jpg", title: "Кириллица", height: 15, width: 15, radius: "50%" },
            { key: "Культура", src: "https://lostpix.com/img/2025-07/27/xf78ef4ehf5fsegr7un4o6szk.jpg", title: "Культура", height: 15, width: 15, radius: "10%" },
            //украинские
            { key: "1+1", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/1%2B1_logo.svg/1920px-1%2B1_logo.svg.png", title: "1+1", height: 10, width: 32, bottom: "2.5px"},
            { key: "Новый канал", src: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Новий_канал_%28Украина%29_%282012-н.в.%29.png", title: "Новый канал", height: 15, width: 15},
            { key: "СТБ", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/STB_logo.svg/1024px-STB_logo.svg.png", title: "СТБ", height: 16, width: 18},
            { key: "ICTV", src: "https://upload.wikimedia.org/wikipedia/commons/6/6f/ICTV_2003-2005.png", title: "ICTV", height: 16, width: 30},
            { key: "Интер", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Inter_TV-Channel_%282000-2007%29.svg/800px-Inter_TV-Channel_%282000-2007%29.svg.png", title: "Интер"},
            { key: "ТЕТ", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/TETUA_logo%282022%29.svg/1920px-TETUA_logo%282022%29.svg.png", title: "ТЕТ", height: 10, width: 32, bottom: "3px"},
            { key: "2+2", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/2%2B2_logo_2017.svg/1920px-2%2B2_logo_2017.svg.png", title: "2+2", height: 10, width: 30, bottom: "3px"},
            { key: "НТН", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/NTNUA_logo_%282013%29.svg/1920px-NTNUA_logo_%282013%29.svg.png", title: "НТН", height: 14, width: 30, bottom: "1px", radius: "5%"},
            { key: "К1", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/K1_Logo_2014.svg/800px-K1_Logo_2014.svg.png", title: "К1", height: 16, width: 14},
            { key: "ТРК Украина", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/TRK_Ukraina_%282022%29.svg/1024px-TRK_Ukraina_%282022%29.svg.png", title: "ТРК Украина", height: 14, width: 16},
            { key: "НЛО", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/NLOTV_logo.svg/1024px-NLOTV_logo.svg.png", title: "НЛО", height: 16, width: 17},
            { key: "Cine+", src: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Cine%2B_Hit.png", title: "Cine+", height: 16, width: 25},
            // Аниме
            { key: "Amanogawa", src: "https://lostpix.com/img/2025-05/14/8z9o9n8izl9c1no0z0chw0lic.jpg", title: "Amanogawa", height: 15, width: 15, radius: "50%" },
            { key: "AniBaza", src: "https://lostpix.com/img/2025-05/14/2ymjnisqy5ftriuzsn5htoacg.jpg", title: "AniBaza", height: 15, width: 15, radius: "50%" },
            { key: "AniDUB", src: "https://lostpix.com/img/2025-05/14/pmoblifh1jtgugf4q3qrjshk4.jpg", title: "AniDUB", height: 15, width: 15, radius: "50%" },
            { key: "AniLibria", src: "https://lostpix.com/img/2025-05/14/8ew4zypnydph1mx89f54hwyab.jpg", title: "AniLibria", height: 15, width: 15, radius: "50%" },
            { key: "AniStar", src: "https://lostpix.com/img/2025-05/14/pz06udmfrns14fiy76mu6skc5.jpg", title: "AniStar", height: 15, width: 15, radius: "50%" },
            { key: "FanVoxUA", src: "https://lostpix.com/img/2025-05/14/3y34fvi3fnykakfdvjf1lzwnf.jpg", title: "FanVoxUA", height: 15, width: 15, radius: "50%" },
            { key: "JAM", src: "https://lostpix.com/img/2025-05/14/exvp3jywcea4mnjmu6cx76wn2.jpg", title: "JAM", height: 15, width: 15, radius: "50%" },
            { key: "SHIZA Project", src: "https://lostpix.com/img/2025-05/14/yxg5tq8q0ky61tqy1t4g6ci43.jpg", title: "SHIZA Project", height: 15, width: 15, radius: "50%" },
            { key: "ТО Дубляжная", src: "https://lostpix.com/img/2025-05/14/p2qfxr2m6kvqz6ch8qs94z3v2.jpg", title: "ТО Дубляжная", height: 15, width: 15, radius: "50%" },
            { key: "Amazing Dubbing", src: "https://lostpix.com/img/2025-05/14/yqpgjxobouavxzhqjpwz9iec9.jpg", title: "Amazing Dubbing", height: 15, width: 15, radius: "50%" },
            { key: "Youkai Studio", src: "https://lostpix.com/img/2025-05/14/zbve2dfxtvcqloh0l78j6ijh7.jpg", title: "Youkai Studio", height: 15, width: 15, radius: "50%" },
            { key: "Amber", src: "https://lostpix.com/img/2025-05/14/kdt8xb2z6w64fo72mu3dhrpmi.jpg", title: "Amber", height: 15, width: 15, radius: "50%" },
            { key: "SoftBox", src: "https://lostpix.com/img/2025-05/14/503vt325svyo103pn6i5j8286.jpg", title: "SoftBox", height: 15, width: 15, radius: "50%" }
        ];

        const processItems = (selector) => {
            const items = document.querySelectorAll(selector);

            items.forEach(item => {
                const titleText = item.textContent.trim();

                // Проверка: если уже есть картинка и она соответствует контенту, пропускаем
                const existingFlag = item.querySelector('img');
                if (existingFlag && titleText.includes(existingFlag.title) && !titleText.includes("Украинский") && !titleText.includes("Казахский")) {
                    return;
                }

                for (const data of flagData) {
                    if (titleText.toLowerCase().includes(data.key.toLowerCase())) {
                        const testImg = new Image();
                        testImg.onload = () => {
                            const img = document.createElement('img');
                            img.src = data.src;
                            img.title = data.title;
                            img.alt = data.title;
                            img.width = data.width || 16;
                            img.height = data.height || 16;
                            img.style.borderRadius = data.radius || "";
                            img.style.cursor = "help";
                            img.style.verticalAlign = "text-bottom";
                            img.style.marginLeft = "3px";
                            if (data.bottom) img.style.marginBottom = data.bottom;

                            item.appendChild(img);
                        };
                        testImg.onerror = () => {
                            console.warn(`Картинка недоступна: ${data.src}`);
                        };
                        testImg.src = data.src;

                        break; // нашли нужное — дальше не проверяем
                    }
                }

                // 🔥 Добавление иконки дубляжа отдельно, даже если был флаг
                if (titleText.toLowerCase().includes("дубляж")) {
                    const dubbingImg = new Image();
                    dubbingImg.onload = () => {
                        dubbingImg.title = "Дубляж";
                        dubbingImg.width = 12;
                        dubbingImg.height = 13;
                        dubbingImg.style.cursor = "help";
                        dubbingImg.style.marginLeft = "3px";
                        dubbingImg.style.marginBottom = "2px";
                        item.appendChild(dubbingImg);
                    };
                    dubbingImg.src = "https://img.icons8.com/?size=100&id=3YAUk7TXYr22&format=png&color=000000";
                }
                // 🔥 Добавление иконки "Многоголосый" отдельно, даже если был флаг
                if (titleText.toLowerCase().includes("многоголосый")) {
                    const dubbingImg = new Image();
                    dubbingImg.onload = () => {
                        dubbingImg.title = "Многоголосый закадровый";
                        dubbingImg.width = 12;
                        dubbingImg.height = 13;
                        dubbingImg.style.cursor = "help";
                        dubbingImg.style.marginLeft = "3px";
                        dubbingImg.style.marginBottom = "2px";
                        item.appendChild(dubbingImg);
                    };
                    dubbingImg.src = "https://img.icons8.com/?size=100&id=tiQOOXH6h8Fa&format=png&color=000000";
                }
                // 🔥 Добавление иконки "Двухголосый" отдельно, даже если был флаг
                if (titleText.toLowerCase().includes("двухголосый")) {
                    const dubbingImg = new Image();
                    dubbingImg.onload = () => {
                        dubbingImg.title = "Двухголосый закадровый";
                        dubbingImg.width = 12;
                        dubbingImg.height = 13;
                        dubbingImg.style.cursor = "help";
                        dubbingImg.style.marginLeft = "3px";
                        dubbingImg.style.marginBottom = "2px";
                        item.appendChild(dubbingImg);
                    };
                    dubbingImg.src = "https://img.icons8.com/?size=100&id=R2PcXXoDEDKi&format=png&color=000000";
                }
            });
        };

        processItems(select_block);
    }

    const observer = new MutationObserver(() => {
        const block = document.querySelector('.b-translators__block');
        if (block) {
            addFlags('.b-translator__item');
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (GM_getValue('funcRaitingIconEnabled', true)) {

        let lastElements = [];

        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('.b-rgstats__help')) {
                setTimeout(() => {
                    const currentElements = Array.from(document.querySelectorAll('.b-rgstats__list_item .inner .title'));
                    if (currentElements.length === 0) return;

                    const isSame = currentElements.length === lastElements.length &&
                          currentElements.every((el, i) => el === lastElements[i]);

                    if (!isSame) {
                        lastElements = currentElements;
                        addFlags('.b-rgstats__list_item .inner .title');
                    }
                }, 100);
            }
        });
    } else {
        console.log("✅ Иконки в меню рейтинга озвучек выключены!");
    }

    if (GM_getValue('funcRaitingColorEnabled', true)) {
        const styleId = 'custom-tooltip-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
              .b-rgstats__list_item {
                box-shadow: 0 0 20px 6px #03A9F4;
                background: linear-gradient(to bottom, #23566E, #007BFF);
                border-radius: 5px;
           `;
            document.head.appendChild(style);
        }
    }else {
            console.log("✅ Цветной блок с Рейтингом выключен!");
    }

})();
