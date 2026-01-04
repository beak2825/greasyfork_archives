// ==UserScript==
// @name         OLED Lolzteam [MAIN]
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Чёрная тема созданная для OLED/AMOLED мониторов/дисплеев с эффектами акрила/прозрачности в элементах.
// @author       TOPCHEK / o1-pro / GPT-4o
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497473/OLED%20Lolzteam%20%5BMAIN%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/497473/OLED%20Lolzteam%20%5BMAIN%5D.meta.js
// ==/UserScript==

(function() {'use strict';

document.body.style.backgroundColor = 'black'; // Основной чёрный фон
document.head.appendChild(document.createElement("style")).innerHTML="::selection{background-color:#505050}"; // цвет выделения текста в браузере
(function() { document.querySelectorAll("a[href^='//t.me/']").forEach(link => { link.href = link.href.replace("https://t.me/", "tg://resolve?domain="); }); })(); // Замена ссылки https://t.me/* на прямой протокол tg://

//Старый логотип лолза + favicon
GM_addStyle('#lzt-logo { background-size: 100%; margin-top: auto; width: 87px; height: 44px; float: left; margin-left: -5px; margin-right: -5px; background-image: none !important; background: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' id=\'Слой_2\' x=\'0px\' y=\'0px\' viewBox=\'0 0 90 40\' style=\'enable-background:new 0 0 90 40;\' xml:space=\'preserve\'%3E%3Cstyle type=\'text/css\'%3E .st0%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%2323A86D;%7D%0A%3C/style%3E%3Cpath class=\'st0\' d=\'M49,31V13h15.1l4-4H16v4h17L21,32h-8V9H9v27h59l-4-4H49V31 M26,32h19v-1V13h-7L26,32z\'/%3E%3C/svg%3E") !important; }'); var link = document.createElement('link'); link.rel = 'icon'; link.type = 'image/svg+xml'; link.href = "data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath d='M0 0 C5.28 0 10.56 0 16 0 C16 5.28 16 10.56 16 16 C10.72 16 5.44 16 0 16 C0 10.72 0 5.44 0 0 Z ' fill='%2323A86D' transform='translate(0,0)'/%3E%3Cpath d='M0 0 C5.28 0 10.56 0 16 0 C16 2.64 16 5.28 16 8 C13.03 8 10.06 8 7 8 C7 6.35 7 4.7 7 3 C6.01 3 5.02 3 4 3 C4 4.65 4 6.3 4 8 C2.68 8 1.36 8 0 8 C0 5.36 0 2.72 0 0 Z ' fill='%23272727' transform='translate(0,0)'/%3E%3Cpath d='M0 0 C0.99 0 1.98 0 3 0 C3 2.31 3 4.62 3 7 C4.65 7 6.3 7 8 7 C8 7.99 8 8.98 8 10 C5.36 10 2.72 10 0 10 C0 6.7 0 3.4 0 0 Z ' fill='%23F5F5F5' transform='translate(4,3)'/%3E%3C/svg%3E"; document.getElementsByTagName('head')[0].appendChild(link);

//добавление кастомного шрифта
GM_addStyle(`@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');`);
GM_addStyle(`body {font-family: 'Montserrat', sans-serif;}`);

GM_addStyle('.chat2-button.lztng-12iv6pu { background-color: rgb(42 42 42 / 50%) !important; }'); // цвет фона кнопки чата
GM_addStyle('.chat2-button-open.lztng-12iv6pu::before { color: rgb(80, 80, 80) !important; }'); // цвет иконки кнопки чата
GM_addStyle('.chat2-button-open.lztng-12iv6pu::before { color: black !important; }'); // цвет иконки кнопки чата
GM_addStyle('.fr-view .wysiwygHide::before { background: rgb(45 45 45 / 30%) !important; }'); // цвет заголовка хайда когда отвечаешь в теме
GM_addStyle('.marketSidebarMenu a:hover, .marketSidebarMenu a.selected { background: rgb(135 135 135 / 10%) !important; }'); // выделение объектов сайдбара на маркете
GM_addStyle('.SelectExcludedForumsLink:hover, .UpdateFeedButtonIcon:hover { background: rgb(135 135 135 / 10%) !important; }'); // выделение кнопки обновления
GM_addStyle('.PageNav a:hover, .PageNav a:focus { background: rgb(135 135 135 / 10%) !important; }'); // выделение кнопок навигации страниц
GM_addStyle('.messageList .message { background: rgb(39 39 39 / 0%) !important; }');
GM_addStyle('.hasJs .bbCodeSpoilerText { background: black !important; }'); // чёрный фон спойлера
GM_addStyle('input[type="checkbox"]:checked:after { box-Shadow: rgb(34, 142, 93) 0px 0px 15px 0px}'); // светящиеся галочка
GM_addStyle('input[type="radio"]:checked:after { box-Shadow: rgb(34, 142, 93) 0px 0px 20px 0px; border-color: rgb(34, 142, 93)}'); // светящиеся радиокнопка
GM_addStyle('.node .nodeTitle:hover .expandSubForumList { background-color: transparent}'); // фикс кнопки открытия подразделов

// ======================================================================================================================
// ↓ripple эффекты↓
// ======================================================================================================================

GM_addStyle('.discussionListItem{position:relative;overflow:hidden}.discussionListItem:hover{background:rgb(30,30,30)!important}.ripple{position:absolute;width:150px;height:150px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;z-index:1}@keyframes ripple{to{transform:scale(4);opacity:0}}'); document.addEventListener("mousedown", e => { const t = e.target.closest(".discussionListItem"); t && t.appendChild(Object.assign(document.createElement("div"), { className: "ripple", style: `left:${e.clientX - t.getBoundingClientRect().left - 75}px; top:${e.clientY - t.getBoundingClientRect().top - 75}px;` })).addEventListener("animationend", e => e.target.remove()); }); // фон светлее при наведении на тему + ripple эффект
GM_addStyle('.navigationSideBar a{position:relative;overflow:hidden}.ripple{position:absolute;width:150px;height:150px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;z-index:1}@keyframes ripple{to{transform:scale(4);opacity:0}}'); document.addEventListener("mousedown", e => { const t = e.target.closest(".navigationSideBar a"); t && t.appendChild(Object.assign(document.createElement("div"), { className: "ripple", style: `left:${e.clientX - t.getBoundingClientRect().left - 75}px; top:${e.clientY - t.getBoundingClientRect().top - 75}px;` })).addEventListener("animationend", e => e.target.remove()); }); // вкладки настройки профиля
GM_addStyle('.bbCodeSpoilerButton.button{position:relative;overflow:hidden}.ripple{position:absolute;width:150px;height:150px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;z-index:1}@keyframes ripple{to{transform:scale(4);opacity:0}}'); document.addEventListener("mousedown", e => { const t = e.target.closest(".bbCodeSpoilerButton.button"); t && t.appendChild(Object.assign(document.createElement("div"), { className: "ripple", style: `left:${e.clientX - t.getBoundingClientRect().left - 75}px; top:${e.clientY - t.getBoundingClientRect().top - 75}px;` })).addEventListener("animationend", e => e.target.remove()); }); // спойлер
GM_addStyle('.blockLinksList a, .blockLinksList label{position:relative;overflow:hidden}.ripple{position:absolute;width:150px;height:150px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;z-index:1}@keyframes ripple{to{transform:scale(4);opacity:0}}'); document.addEventListener("mousedown", e => { const t = e.target.closest(".blockLinksList a, .blockLinksList label"); t && t.appendChild(Object.assign(document.createElement("div"), { className: "ripple", style: `left:${e.clientX - t.getBoundingClientRect().left - 75}px; top:${e.clientY - t.getBoundingClientRect().top - 75}px;` })).addEventListener("animationend", e => e.target.remove()); }); // панель навигации; blockLinksList
GM_addStyle('.node .nodeText .nodeTitle a{position:relative;overflow:hidden}.ripple{position:absolute;width:150px;height:150px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;z-index:1}@keyframes ripple{to{transform:scale(4);opacity:0}}'); document.addEventListener("mousedown", e => { const t = e.target.closest(".node .nodeText .nodeTitle a"); t && t.appendChild(Object.assign(document.createElement("div"), { className: "ripple", style: `left:${e.clientX - t.getBoundingClientRect().left - 75}px; top:${e.clientY - t.getBoundingClientRect().top - 75}px;` })).addEventListener("animationend", e => e.target.remove()); }); // лист форумов слева
GM_addStyle('.liveHeaderResult--member{position:relative;overflow:hidden}.ripple{position:absolute;width:150px;height:150px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;z-index:1}@keyframes ripple{to{transform:scale(4);opacity:0}}'); document.addEventListener("mousedown", e => { const t = e.target.closest(".liveHeaderResult--member"); t && t.appendChild(Object.assign(document.createElement("div"), { className: "ripple", style: `left:${e.clientX - t.getBoundingClientRect().left - 75}px; top:${e.clientY - t.getBoundingClientRect().top - 75}px;` })).addEventListener("animationend", e => e.target.remove()); }); // юзеры при быстром поиске
GM_addStyle('.xenOverlay.memberCard .userContentLinks .button{position:relative;overflow:hidden}.ripple{position:absolute;width:150px;height:150px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;z-index:1}@keyframes ripple{to{transform:scale(4);opacity:0}}'); document.addEventListener("mousedown", e => { const t = e.target.closest(".xenOverlay.memberCard .userContentLinks .button"); t && t.appendChild(Object.assign(document.createElement("div"), { className: "ripple", style: `left:${e.clientX - t.getBoundingClientRect().left - 75}px; top:${e.clientY - t.getBoundingClientRect().top - 75}px;` })).addEventListener("animationend", e => e.target.remove()); }); // кнопки в мини-профиле
GM_addStyle('.navPopup li.conversationItem{position:relative;overflow:hidden}.ripple{position:absolute;width:150px;height:150px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;z-index:1}@keyframes ripple{to{transform:scale(4);opacity:0}}'); document.addEventListener("mousedown", e => { const t = e.target.closest(".navPopup li.conversationItem"); t && t.appendChild(Object.assign(document.createElement("div"), { className: "ripple", style: `left:${e.clientX - t.getBoundingClientRect().left - 75}px; top:${e.clientY - t.getBoundingClientRect().top - 75}px;` })).addEventListener("animationend", e => e.target.remove()); }); // личные сообщения
GM_addStyle('.navPopup .listItem{position:relative;overflow:hidden}.navPopup .listItem{cursor:pointer}.ripple{position:absolute;width:150px;height:150px;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;z-index:1}@keyframes ripple{to{transform:scale(4);opacity:0}}'); document.addEventListener("mousedown", e => { const t = e.target.closest(".navPopup .listItem"); t && t.appendChild(Object.assign(document.createElement("div"), { className: "ripple", style: `left:${e.clientX - t.getBoundingClientRect().left - 75}px; top:${e.clientY - t.getBoundingClientRect().top - 75}px;` })).addEventListener("animationend", e => e.target.remove()); }); // уведомления


// ======================================================================================================================
// ↓Автоматическая установка цвета заголовка темы в зависимости какой установлен префикс в теме↓
// ======================================================================================================================
const titleBars = document.querySelectorAll('.thread_view .titleBar');
titleBars.forEach(titleBar => {
  // Set default background color
    titleBar.style.backgroundColor = 'rgba(135, 135, 135, 0.1)';

    const prefixes = titleBar.querySelectorAll('span.prefix');
    if (prefixes.length > 0) {
        prefixes.forEach(prefix => {
            if (prefix.classList.contains('bases_pref') && prefix.classList.contains('checked')) {
                titleBar.style.backgroundColor = 'rgba(34, 142, 93, 0.35)';
                titleBar.style.boxShadow = 'rgb(11, 49, 32) 0px 0px 20px 5px';
            } else if (prefix.classList.contains('bases_pref') && prefix.classList.contains('ts_exchange')) {
                titleBar.style.backgroundColor = 'rgba(50, 0, 0, 0.5)';
                titleBar.style.boxShadow = 'rgba(50, 0, 0, 0.5) 0px 0px 20px 5px';
            } else if (prefix.classList.contains('bases_pref') && prefix.classList.contains('ts_sell')) {
                titleBar.style.backgroundColor = 'rgb(81 126 148 / 30%)';
                titleBar.style.boxShadow = '0 0 20px 5px #18262d';
            } else if (prefix.classList.contains('bases_pref') && prefix.classList.contains('ts_buy')) {
                titleBar.style.backgroundColor = 'rgb(45, 22, 35)';
                titleBar.style.boxShadow = 'rgb(45, 22, 35) 0px 0px 20px 5px';
            } else if (prefix.classList.contains('prefix') && prefix.classList.contains('ts_mass_buy')) {
                titleBar.style.backgroundColor = 'rgb(45, 22, 35)';
                titleBar.style.boxShadow = 'rgb(45, 22, 35) 0px 0px 20px 5px';
            } else if (prefix.classList.contains('prefix') && prefix.classList.contains('design') && prefix.classList.contains('senior')) {
                titleBar.style.backgroundColor = 'rgb(34, 20, 55)';
                titleBar.style.boxShadow = '0 0 20px 5px rgb(34, 20, 55)';
            } else if (prefix.classList.contains('prefix') && prefix.classList.contains('important')) {
                titleBar.style.backgroundColor = 'rgba(50, 0, 0, 0.5)';
                titleBar.style.boxShadow = 'rgba(50, 0, 0, 0.5) 0px 0px 20px 5px';
            } else if (prefix.classList.contains('prefix') && prefix.classList.contains('bases_loginpass')) {
                titleBar.style.backgroundColor = 'rgb(33, 26, 41)';
            } else if (prefix.classList.contains('prefix') && prefix.classList.contains('design_studio')) {
                titleBar.style.backgroundColor = 'rgb(18, 43, 35)';
                titleBar.style.boxShadow = 'rgb(18, 43, 35) 0px 0px 20px 5px';
            } else if (prefix.classList.contains('prefix') && prefix.classList.contains('design') && prefix.classList.contains('middle')) {
                titleBar.style.backgroundColor = 'rgb(15, 33, 49)';
                titleBar.style.boxShadow = 'rgb(15, 33, 49) 0px 0px 20px 5px';
            } else if (prefix.classList.contains('prefix') && prefix.classList.contains('design') && prefix.classList.contains('junior')) {
                titleBar.style.backgroundColor = 'rgb(18, 32, 37)';
                titleBar.style.boxShadow = 'rgb(18, 32, 37) 0px 0px 20px 5px';
            } else if (prefix.classList.contains('prefix') && prefix.classList.contains('undetected')) {
                titleBar.style.backgroundColor = 'rgb(57 103 57 / 40%)';
                titleBar.style.boxShadow = '0 0 20px 5px #162916';
            } else if (prefix.classList.contains('prefix') && prefix.classList.contains('shop_pref')) {
                titleBar.style.backgroundColor = 'rgb(101 142 91 / 30%)';
                titleBar.style.boxShadow = 'rgb(101 142 91 / 30%) 0px 0px 20px 5px';
            }
        });
    }
});

// ======================================================================================================================
// ↓Автоматическая установка цвета фона профиля в зависимости какой установлен цвет ника↓
// ======================================================================================================================
const darkBackgrounds = document.querySelectorAll('.darkBackground');
darkBackgrounds.forEach(darkBackground => {
    const profiles = darkBackground.querySelectorAll('span');
    let backgroundColorSet = false;
// Проверка наличия кастомного фонового изображения
    const memberBackground = document.querySelector('#memberBackground');
    let hasCustomBackground = false;
    if (memberBackground) {
        const backgroundImage = memberBackground.style.getPropertyValue('--img');
        if (backgroundImage && backgroundImage.includes('url')) {
            hasCustomBackground = true;
        }
    }
    if (!backgroundColorSet) {
        darkBackground.style.backgroundColor = 'rgb(40 40 40 / 50%)'; //дефолт для всего остального
    }
    profiles.forEach(profile => {
        if (profile.classList.contains('style30')) { //арбитр
            darkBackground.style.backgroundColor = 'rgba(255, 154, 252, 0.3)';
            backgroundColorSet = true;
        } else if (profile.classList.contains('style29')) { //куратор
            darkBackground.style.backgroundColor = 'rgba(10, 120, 94, 0.3)';
            backgroundColorSet = true;
        } else if (profile.classList.contains('style12')) { //главный модератор
            darkBackground.style.backgroundColor = 'rgba(46, 162, 74, 0.3)';
            backgroundColorSet = true;
        } else if (profile.classList.contains('style4')) { //модератор
            darkBackground.style.backgroundColor = 'rgba(18, 71, 13, 0.3)';
            backgroundColorSet = true;
        } else if (profile.classList.contains('style7')) { //разработчик
            darkBackground.style.backgroundColor = 'rgba(191, 110, 4, 0.3)';
            backgroundColorSet = true;
        } else if (profile.classList.contains('style359')) { //спонсор
            darkBackground.style.backgroundColor = 'rgba(229, 217, 163, 0.3)';
            backgroundColorSet = true;
        } else if (profile.classList.contains('banned')) { //заблокирован
            darkBackground.style.backgroundColor = 'rgba(50, 0, 0, 0.5)';
            backgroundColorSet = true;
        }
    });
});

// ============================================================================================================================
// 'black' (вторичный цвет):
// ============================================================================================================================

function applyStyles() {

// чёрный фон статей и их сообщений
        document.querySelectorAll('.messageList, .messageArticle').forEach(({style}) => {
            style.background = 'black';
        });

// фон спойлера
        document.querySelectorAll('.bbCodeSpoilerButton.button').forEach(({style}) => {
        style.background = 'transparent';
        style.borderRadius = '6px 6px 0 0';
        });

// ПОЛУ-ФИКС содержимого спойлера
        document.querySelectorAll('.SpoilerTarget.bbCodeSpoilerText').forEach(({style}) => {
        style.background = 'black';
        });

// фон чата
        document.querySelectorAll('.scrollable.lztng-11ywofs.lztng-11ywofs').forEach(({style}) => {
        style.background = 'black';
        });

// фон сообщений на мобиле
        document.querySelectorAll('.conversationItem._loadConversation').forEach(({style}) => {
        style.background = 'black';
        });

// фон сообщений на мобиле
        document.querySelectorAll('.conversationList--bottomBar').forEach(({style}) => {
        style.background = 'black';
        });

// фон заголовка ЛС на мобиле
        document.querySelectorAll('.ImDialogHeader').forEach(({style}) => {
        style.background = 'black';
        });

// фон заголовка ЛС на мобиле
        document.querySelectorAll('.scroll-wrapper.conversationMessages.scrollbar-macosx.scrollbar-dynamic').forEach(({style}) => {
        style.background = 'black';
        });

// фон ввода текста в ЛС
        document.querySelectorAll('.simpleRedactor').forEach(({style}) => {
        style.background = 'black';
        });

// фон загрузки сообщения в ЛС
        document.querySelectorAll('.conversationViewContainer').forEach(({style}) => {
        style.background = 'black';
        });

// панель навигации для мобилы
        document.querySelectorAll('.mm-ocd__content').forEach(({style}) => {
        style.background = 'black';
        style.setProperty('background', 'rgb(40 40 40 / 50%)', 'important');
        style.setProperty('backdrop-Filter', 'blur(10px) saturate(150%)', 'important');
        });

// ============================================================================================================================
// 'black' (первичный цвет):
// ============================================================================================================================
// Применяем выбранный цвет к списку форумов
        const forumList = document.querySelector('.forum-list');
        if (forumList) {
            forumList.style.backgroundColor = 'black';
        }

// Применяем выбранный цвет к боковой панели
        const sidebarWrappers = document.querySelectorAll('.sidebar .sidebarWrapper');
        sidebarWrappers.forEach(wrapper => {
            wrapper.style.backgroundColor = 'rgba(40, 40, 40, 0.5)';
        });

// кастомный цвет списка тем
        document.querySelectorAll('.discussionListItem').forEach(({style}) => {
            style.background = 'black';
            style.margin = '0 -15px';
        });

// кастомный цвет фона списка тем
        document.querySelectorAll('.discussionList').forEach(({style}) => {
            style.background = 'black';
            style.borderRadius = '6px 6px 6px 6px';
            style.marginTop = '10px';
        });

// кастомный цвет фона поле для ввода поиска тем
        document.querySelectorAll('.universalSearchForm .universalSearchInput').forEach(({style}) => {
            style.background = 'black';
        });

// фон предпросмотра темы в ссылке
        document.querySelectorAll('.unfurl_thread-add-block').forEach(({style}) => {
        style.background = 'black';
        });

// фон предпросмотра товара маркета в ссылке
        document.querySelectorAll('.market-about-block').forEach(({style}) => {
        style.background = 'black';
        });

// отдельный блок заголовка форума
        document.querySelectorAll('.forum_view .titleBar, .forum_list .titleBar').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
            style.marginBottom = '10px';
            style.borderRadius = '10px 10px 10px 10px';
        });

// фикс бордера в pageNavLinkGroup
        document.querySelectorAll('.pageNavLinkGroup').forEach(({style}) => {
        style.borderBottom = '1px solid rgb(45 45 45 / 0%)';
        style.padding = '10px 20px';
        style.borderRadius = '10px 10px 10px 10px';
//style.background = 'rgba(40, 40, 40, 0.5)';
        style.background = 'transparent';
//style.marginTop = '-10px';
        });

// кастомный цвет фона marketSidebarMenu
        document.querySelectorAll('.marketSidebarMenu').forEach(({style}) => {
            style.background = '#141414';
        });

// кастомный цвет фона Последние поиски и Сохраненные поиски на маркете
        document.querySelectorAll('.searchLinksContainer .searchHistoryContainer').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
        });

// кастомный цвет фона значков категории на маркете
        document.querySelectorAll('.categoryLinks .link').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
        });

// кастомный цвет фона фильтров на маркете (цена, поиск по заголовку и т.д)
        document.querySelectorAll('.searchBarContainer').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
        });

// кастомный цвет фона блоков товаров на маркете
        document.querySelectorAll('.marketIndexItem').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
        });

// кастомный цвет фона блока заголовка товара на маркете
        document.querySelectorAll('.market--titleBar').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
            style.borderBottom = '1px solid rgb(45 45 45 / 0%)';
        });

// кастомный цвет фона блока достоверной информации на маркете
        document.querySelectorAll('.marketContainer.marketItemView--Container').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
        });

// кастомный цвет фона блока истории продажи этого аккаунта на маркете
        document.querySelectorAll('.marketCloudContainer').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
        });

// кастомный цвет фона блока отзывов на маркете
        document.querySelectorAll('.market_block_reviews').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
        });

// кастомный цвет фона блока отзывов на маркете
        document.querySelectorAll('.market_block_reviews .quickReply').forEach(({style}) => {
            style.background = 'transparent';
        });

// кастомный цвет фона блока отзывов на маркете (ВСЕ, положительные, отрицательные)
        document.querySelectorAll('.gen-panel_reviews').forEach(({style}) => {
            style.background = 'transparent';
        });

// Кнопка обновления товаров на маркете
        document.querySelectorAll('.market_index .UpdateFeedButtonIcon').forEach(({style}) => {
            style.background = 'transparent';
        });

// Кнопка не пришли бабки на маркете
        document.querySelectorAll('.depositProblemButton.button.dark.full.large.button').forEach(({style}) => {
            style.background = 'rgba(40, 40, 40, 0.5)';
        });

// Фон статей
        document.querySelectorAll('#articlesGrid').forEach(({style}) => {
            style.background = 'black';
        });

// ==========================================================↓↓↓↓↓↓ ПРОФИЛЬ ↓↓↓↓↓↓=============================================

    document.querySelectorAll('.PanelScroller .panel, .PanelScrollerOff .panel').forEach(({style}) => {
        style.background = 'rgb(40 40 40 / 50%)';
    });

    document.querySelectorAll('.pageNavLinkGroup.rounded').forEach(({style}) => {
        style.background = 'rgb(40 40 40 / 50%)';
        style.borderRadius = '10px 10px 10px 10px';
    });

    document.querySelectorAll('.sidebar .section .secondaryContent').forEach(({style}) => {
        style.background = 'rgb(40 40 40 / 50%)';
    });

    document.querySelectorAll('.profilePage .profilePoster.messageSimple').forEach(({style}) => {
        style.background = 'rgb(40 40 40 / 50%)';
    });

    document.querySelectorAll('.member_view #ProfilePanes li ol:not(.messageResponse)>li:not(.deleted)').forEach(({style}) => {
        style.background = 'rgba(40, 40, 40, 0.5)';
    });
    document.querySelectorAll('.tabs.mainTabs.Tabs.member_tabs.mn-15-0-0').forEach(({style}) => {
        style.background = 'rgba(40, 40, 40, 0.5)';
    });

// ==========================================================↓↓↓↓↓↓ СТИЛИ ↓↓↓↓↓↓===============================================

// панель навигации для десктопа
        document.querySelectorAll('.cd-auto-hide-header').forEach(({style}) => {
        style.backgroundColor = 'rgb(0 0 0 / 30%)';
        style.backdropFilter = 'blur(5px) saturate(150%)';
        style.boxShadow = '0 0 10px rgb(0 0 0 / 50%)';
        });

// фон полей для ввода
        document.querySelectorAll('.QuickSearch .primaryControls input.textCtrl').forEach(({style}) => {
            style.backgroundColor = 'rgb(0 0 0 / 30%)';
        });

// фон для прокрутки вверх
        document.querySelectorAll('.cd-top').forEach(({style}) => {
            style.backgroundColor = 'rgb(0 0 0 / 0%)';
        });

// фон BB-кода в программировании
        document.querySelectorAll('.bbCodeSource pre, .bbCodeSourceBlock pre').forEach(({style}) => {
            style.backgroundColor = 'rgb(135 135 135 / 10%)';
        });

// фон сообщений и уведомлений при нажатии | БАГ: ЕСЛИ ВКЛЮЧИТЬ, ОСТАЁТСЯ ОСТАТОЧНОЕ НАЖАТИЕ | background не ставить
        document.querySelectorAll('.navTabs .navTab.PopupOpen .navLink').forEach(({style}) => {
    //style.backgroundColor = 'black';
            style.borderRadius = '0 0 10px 10px';
        });

// зелёная тень прибавления денег на маркете
        document.querySelectorAll('.marketMyPayments .item .amountChange .in').forEach(({style}) => {
            style.textShadow = '0 0 10px rgb(0, 186, 120)';
        });

// зелёная тень баланса на маркете
        document.querySelectorAll('.marketSidebarMenu .balanceNumber').forEach(({style}) => {
            style.textShadow = '0 0 10px rgb(0, 186, 120)';
        });

// зелёная тень зелёной кнопки
        document.querySelectorAll('.button.primary').forEach(({style}) => {
            style.boxShadow = '0 0 10px rgb(34, 142, 93)';
        });

// зелёная тень значка онлайн
        document.querySelectorAll('.message .onlineMarker').forEach(({style}) => {
            style.boxShadow = 'rgb(34, 142, 93) 0px 0px 14px 2px';
        });

// зелёная тень значка онлайн в профиле пользователей
        document.querySelectorAll('.userOnlineMarker').forEach(({style}) => {
            style.boxShadow = 'rgb(34, 142, 93) 0px 0px 14px 2px';
        });

// зелёная тень значка онлайн в мини-профиле
        document.querySelectorAll('.xenOverlay.memberCard .onlineMarker').forEach(({style}) => {
            style.boxShadow = '0 0 7px rgb(34, 142, 93)';
        });

// зелёная тень кнопок страницы в теме
        document.querySelectorAll('.PageNav a.currentPage').forEach(({style}) => {
            style.boxShadow = '0 0 10px rgb(34, 142, 93)';
        });

// зелёная тень кнопки "Отблагодарить автора" в статьях
        document.querySelectorAll('.btnThanksAuthor').forEach(({style}) => {
            style.boxShadow = '0 0 10px rgb(34, 142, 93)';
        });

// тёмный фон "Отблагодарить автора" в статьях
        document.querySelectorAll('.thankAuthorBox').forEach(({style}) => {
            style.background = 'rgb(45 45 45 / 50%)';
        });

// зелёная тень кнопки перевода денег в мини профиле
        document.querySelectorAll('.actionButton--sendMoney.withLeftButton').forEach(({style}) => {
            style.boxShadow = '0 0 10px rgb(34, 142, 93)';
        });

// зелёная тень зелёного title заголовка оверлея + бордер фикс
        document.querySelectorAll('.heading, .xenForm .formHeader').forEach(({style}) => {
            style.boxShadow = '0 0 20px rgb(34, 142, 93)';
            style.borderRadius = '10px 10px 0 0';
        });

// бордер фикс оверлея + прозрачный фон
        document.querySelectorAll('.xenOverlay .formOverlay').forEach(({style}) => {
            style.borderRadius = '0 0 10px 10px';
            style.backgroundColor = 'rgb(39 39 39 / 0%)';
        });

// перекраска цвета баланса на форуме + добавление тени
        document.querySelectorAll('.balanceLabel').forEach(({style}) => {
            style.color = 'rgb(0, 221, 121)';
            style.textShadow = '0 0 20px rgb(0, 255, 139)';
        });

// перекраска цвета уходящего баланса на маркете + добавление тени
        document.querySelectorAll('.marketMyPayments .item .amountChange .out').forEach(({style}) => {
            style.color = '#ff3f3f';
            style.textShadow = '0 0 8px #ff2626d9';
        });

// свечение кнопки "Нет депозита"
        document.querySelectorAll('.deposit_red').forEach(({style}) => {
            style.boxShadow = '0 0 10px #91222275';
            style.background = '#39141482';
        });

// свечение кнопки "Есть депозит"
        document.querySelectorAll('.deposit_green').forEach(({style}) => {
            style.boxShadow = 'rgb(0 83 55) 0px 0px 10px';
            style.background = '#002f1f';
        });

// свечение количества уведомлений/сообщений
        document.querySelectorAll('.navTabs .navLink .itemCount').forEach(({style}) => {
            style.boxShadow = '0 0 10px rgb(34, 142, 93)';
            style.border = '2px solid rgb(31, 93, 65)';
        });

// красная тень нулевого страхового депозита
        document.querySelectorAll('.insuranceDeposit .amount.redc').forEach(({style}) => {
            style.textShadow = '0 0 10px red';
        });

// зелёная тень страхового депозита
        document.querySelectorAll('.insuranceDeposit .amount.mainc').forEach(({style}) => {
            style.textShadow = '0 0 10px rgb(0, 186, 120)';
        });

// красная тень "Пользователь заблокирован"
        document.querySelectorAll('.errorPanel .errorHeading').forEach(({style}) => {
            style.textShadow = '0 0 10px red';
        });

// красный фон "Пользователь заблокирован"
        document.querySelectorAll('.errorPanel').forEach(({style}) => {
            style.background = 'rgba(50, 0, 0, 0.5)';
        });

// красная тень кнопок арбитража и жалобы в профиле
        document.querySelectorAll('.button.red').forEach(({style}) => {
            style.boxShadow = '0 0 10px rgb(136 ,68, 68)';
        });

// красная тень активный арбитраж в профиле
        document.querySelectorAll('.alertNotice>.alertText').forEach(({style}) => {
            style.textShadow = '0 0 10px red';
        });

// красная тень статуса ответчика в арбитраже
        document.querySelectorAll('.as--class.responder').forEach(({style}) => {
            style.boxShadow = '0 0 10px rgb(138, 65, 65)';
        });

// фон всплывающих окон
        document.querySelectorAll('.Menu .secondaryContent').forEach(({style}) => {
            style.backgroundColor = 'rgb(26 26 26 / 30%)';
        });

/*// фон полей для ввода
        document.querySelectorAll('.textCtrl').forEach(({style}) => {
            style.backgroundColor = '#161616';
        });
*/
// красный фон alertNotice
        document.querySelectorAll('.alertNotice').forEach(({style}) => {
            style.background = 'rgba(50, 0, 0, 0.5)';
        });

// Эффект акрила (прозрачности) в уведомлениях, ЛС
        document.querySelectorAll('.Menu').forEach(({style}) => {
            style.background = 'rgba(39, 39, 39, 0.5)';
            style.backdropFilter = 'blur(7px) saturate(150%)';
            style.border = '1px solid rgba(54, 54, 54, 0.7)';

        });

// Эффект акрила (прозрачности) в шапке ЛС
        document.querySelectorAll('.navigation-header').forEach(({style}) => {
            style.background = 'rgb(109 109 109 / 0%)';
   // style.backdropFilter = 'blur(5px) saturate(150%)';

        });

// Эффект акрила (прозрачности) в мини-профиле
        document.querySelectorAll('.xenOverlay.memberCard .top').forEach(({style}) => {
            style.background = 'rgb(109 109 109 / 10%)';
            style.backdropFilter = 'blur(5px) saturate(150%)';

        });

// Эффект акрила (прозрачности) в мини-профиле
        document.querySelectorAll('.xenOverlay.memberCard .bottom').forEach(({style}) => {
            style.background = 'rgb(45 45 45 / 50%)';
            style.backdropFilter = 'blur(5px) saturate(150%)';

        });

// Эффект акрила (прозрачности) в мини-профиле на кнопках контакта
        document.querySelectorAll('.contact').forEach(({style}) => {
            style.background = 'rgb(54 54 54 / 0%)';
            style.backdropFilter = 'blur(10px) saturate(150%)';

        });

// размытие заднего фона при появлении любых объектах
        document.querySelectorAll('.modal-backdrop.in').forEach(({style}) => {
            style.backdropFilter = 'blur(6px) saturate(150%)';

        });

// размытие кнопки в мини-профиле "нельзя написать"
        document.querySelectorAll('input.button.disabled, a.button.disabled, span.button.disabled, input.button.primary.disabled, a.button.primary.disabled, span.button.primary.disabled, html .buttonProxy .button.disabled, button.button.disabled, button.button.primary.disabled, .button:disabled').forEach(({style}) => {
            style.backgroundColor = 'rgb(54 54 54 / 50%)';
            style.boxShadow = 'rgb(34 142 93 / 0%) 0px 0px 10px';

        });

// темнее фон "Просматривают тему" и "Пользователи, прочитавшие эту тему за последний месяц"
        document.querySelectorAll('.sectionMain').forEach(({style}) => {
            style.backgroundColor = 'rgba(135, 135, 135, 0.1)';
        });

// акриловый фон для заголовка уведомлений
        document.querySelectorAll('.tabs.Tabs.noLinks.alertsTabs').forEach(({style}) => {
            style.background = 'transparent';
        });

// перекраска полоски закрепленных тем
        document.querySelectorAll('.stickyThreads').forEach(({style}) => {
            style.borderLeft = '5px solid rgb(34 142 93)';
        });

// прозрачный акриловый фон когда отвечаешь в теме + бордер фикс
        document.querySelectorAll('.simpleRedactor.QuickReplyRedactor').forEach(({style}) => {
            style.background = 'rgb(18 18 18 / 50%)';
            style.backdropFilter = 'blur(10px) saturate(150%)';
            style.borderRadius = '10px 10px 0 0';
        });

// прозрачный акриловый фон когда отвечаешь в теме textbox
        document.querySelectorAll('.fr-box.fr-basic .fr-wrapper, .fr-toolbar.fr-top').forEach(({style}) => {
            style.background = 'rgb(18 18 18 / 0%)';
        });

// убрать верхний бордер когда отвечаешь в теме
        document.querySelectorAll('.quickReply').forEach(({style}) => {
        style.borderTop = '1px solid rgb(45 45 45 / 0%)';
        });

// размытие страниц темы
        document.querySelectorAll('.PageNav.fixed>nav').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        style.backdropFilter = 'blur(3px) saturate(150%)';
        });

// прозрачный фон primaryContent
        document.querySelectorAll('.primaryContent').forEach(({style}) => {
        style.background = 'rgb(40 40 40 / 15%)';
        });

// прозрачный фон кому нравится сообщение
        document.querySelectorAll('.xenOverlay>.section, .xenOverlay>.sectionMain').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

// прозрачная полоска в "кому нравится сообщение"
        document.querySelectorAll('.xenOverlay .section .subHeading, .xenOverlay .sectionMain .subHeading').forEach(({style}) => {
        style.background = 'rgb(45 45 45 / 0%)';
        });

// перекраска хайда когда отвечаешь в теме
        document.querySelectorAll('.fr-view .wysiwygHide').forEach(({style}) => {
        style.backgroundColor = 'rgb(39 39 39 / 0%)';
        style.border = '5px solid rgb(49 49 49 / 40%)';
        });

// чёрный фон (прозрачный) у всех сообщений в теме
        document.querySelectorAll('.messageList .message').forEach(({style}) => {
        style.backgroundColor = 'rgb(39 39 39 / 0%)';
        });

// темнее фон "Посмотреть предыдущие комментарии"
        document.querySelectorAll('.CommentLoader').forEach(({style}) => {
        style.backgroundColor = 'rgb(45 45 45 / 40%)';
        });

// темнее фон bb-кода на код
        document.querySelectorAll('.bbCodeBlock .type').forEach(({style}) => {
        style.backgroundColor = 'rgb(45 45 45 / 50%)';
        });

// темнее фон панели управления темы после заголовка
        document.querySelectorAll('.pageNavLinkGroup.mn-15-0-0').forEach(({style}) => {
        style.background = 'rgb(18 18 18 / 0%)';
        });

// темнее бордер спойлера
        document.querySelectorAll('.bbCodeSpoilerContainer').forEach(({style}) => {
        style.background = 'rgb(135 135 135 / 10%)';
        });

// темнее обводка хайда
        document.querySelectorAll('.bbCodeHide.bbCodeQuote:not(.noQuote)').forEach(({style}) => {
        style.border = '5px solid rgb(45 45 45 / 50%)';
        });

// фон поиска "результатов не найдено" в теме
        document.querySelectorAll('.messageList .noResultsFound').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 48%)';
        style.borderRadius = '10px 10px 10px 10px';
        });

// фон ограничения сообщений в теме
        document.querySelectorAll('.lztThreadRestrictions').forEach(({style}) => {
        style.background = 'rgb(54 54 54 / 50%)';
        });

// фон цены товара маркета в ссылке
        document.querySelectorAll('.market-about-block .marketIndexItem--Price.fl_r').forEach(({style}) => {
        style.background = 'rgb(22 91 60)';
        });

// фикс фон переводов на маркете
        document.querySelectorAll('.marketMyPayments').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 0%)';
        });

// фон ячеек для розыгрышей
        document.querySelectorAll('.Responsive .new-raffle-info .marginBlock').forEach(({style}) => {
        style.background = 'rgb(18 18 18 / 50%)';
        });

// плашка в удаленной теме
        document.querySelectorAll('.grayBlock.deletedThreadNotice').forEach(({style}) => {
        style.background = 'rgba(50, 0, 0, 0.5)';
        });

// убрать фон у тэгов в теме
        document.querySelectorAll('.tagList .tag').forEach(({style}) => {
        style.background = 'rgb(54 54 54 / 0%)';
        style.color = 'rgb(51 217 143)';
        });

// убрать бордер в ответе в профиле на сообщения
        document.querySelectorAll('.messageSimple .messageResponse').forEach(({style}) => {
        style.borderTop = '0px solid rgb(45, 45, 45)';
        });

// постбит "Прочее" на главной странице
        document.querySelectorAll('.section.sidebar--footer.sidebarWrapper').forEach(({style}) => {
        style.background = 'rgba(40, 40, 40, 0.5)';
        });

// сообщение от мецената на главной странице
        document.querySelectorAll('.monthMaecenas--quote').forEach(({style}) => {
        style.background = 'rgb(135 135 135 / 10%)';
        });

// фон Вы не можете выполнить это действие, потому что тема была закрыта
        document.querySelectorAll('.pageNavLinkGroup.pageNavLinkGroupAfterPosts').forEach(({style}) => {
        style.background = 'rgb(135 135 135 / 10%)';
        style.borderRadius = '6px 6px 6px 6px';
        });

// прозрачный фон у окна ошибки
        document.querySelectorAll('.xenOverlay .errorOverlay').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 40%)';
        });

// фикс тени названия форума в списке тем
        document.querySelectorAll('.discussionListItem .threadNode').forEach(({style}) => {
        style.boxShadow = '-4px 2px 0px 0px rgb(45 45 45 / 0%)';
        });

// выделение форума
/*        document.querySelectorAll('.nodeList .node.current > .nodeInfo > .nodeText > .nodeTitle > a, .nodeList .node .current>div>.nodeTitle>a').forEach(({style}) => {
        style.background = 'rgb(255 255 255 / 10%)';
        });
*/
// акриловый предпросмотр темы
        document.querySelectorAll('.tippy-box').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 20%)';
        style.backdropFilter = 'blur(7px) saturate(150%)';
        });

// фон в профиле пользователя (предупреждения, история блокировок, арбитражи и т.д)
        document.querySelectorAll('.profileContent').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 0%)';
        });

// фон заголовка в профиле пользователя (предупреждения, история блокировок, арбитражи и т.д) // баг с заголовком уведомлений
        document.querySelectorAll('.tabs.Tabs').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 0%)';
        });

// фон таблицы истории блокировок пользователя
        document.querySelectorAll('.dataTable tr.dataRow td').forEach(({style}) => {
        style.background = 'rgb(0 0 0 / 30%)';
        });

// фон таблицы истории блокировок пользователя (Имя поля, Старое значение, Новое значение)
        document.querySelectorAll('.userChangeLogs').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        style.borderRadius = '10px 10px 10px 10px';
        });

// акриловый фон у приходящий live-уведомлений
        document.querySelectorAll('.liveAlerts.navPopup.DismissParent').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        style.backdropFilter = 'blur(5px) saturate(150%)';
        });

// кастомный цвет фона списка тем (при наведении управление темой)
        document.querySelectorAll('.discussionListItem .controls').forEach(({style}) => {
            style.background = 'transparent';
        });

// темнее фон списка настроек в профиле
        document.querySelectorAll('.navigationSideBar>ul').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// темнее фон списка настроек в профиле выделение
        document.querySelectorAll('.navigationSideBar a.selected').forEach(({style}) => {
            style.background = 'rgb(45 45 45 / 50%)';
        });

// темнее фон списка чёрного списка в настройках
        document.querySelectorAll('.member-list_ignored').forEach(({style}) => {
            style.background = 'rgb(39 39 39 / 0%)';
        });

// прозрачный кастомный цвет фона блока истории продажи этого аккаунта на маркете выделение
        document.querySelectorAll('.marketItemView--sameItem.current').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// кастомный цвет фона блока отзывов на маркете (Для того чтобы оставить отзыв...)
        document.querySelectorAll('.cannotAddFeedbackError').forEach(({style}) => {
            style.background = 'transparent';
        });

// прозрачность на кнопках добавление заметки на маркете к товару
        document.querySelectorAll('.button.EditNoteButton.buttonWithIcon.editNoteItemButton.OverlayTrigger.Tooltip').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность на кнопках добавление избранного на маркете к товару
        document.querySelectorAll('.button.buttonWithIcon.ToFavouritesButton.Tooltip').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность в цене у товара на маркете в отзывах
        document.querySelectorAll('.message-review-info-buy-acc').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность в цене у товара на маркете в отзывах
        document.querySelectorAll('.message-review-info-buy-acc').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность в блоках описания товара
        document.querySelectorAll('.marketIndexItem-Badge').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность статистики в блоках описания товара
        document.querySelectorAll('.marketIndexItem .stats .stat').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность полей для ввода
        document.querySelectorAll('.textCtrl.large').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность выпадающего списка выбора валюты на маркете
        document.querySelectorAll('.chosen-container.chosen-container-single.textCtrl.SelectCurrency.FormSubmitSelector.chosen-container-single-nosearch').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность рейтинг бокса на маркете
        document.querySelectorAll('.rating_reviews_box').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность списка метки на маркете
        document.querySelectorAll('.itemTags.Popup, .itemTags .setTag, .singleTag.setTag').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность кнопки закрытия (крестик) блоков поисков на маркете
        document.querySelectorAll('.searchHistoryContainer .button-last-search').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность кнопки "Хочу скидку" на маркете
        document.querySelectorAll('.OverlayTrigger.Tooltip.button.buttonWithIcon.askDiscountButton').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность кнопки ссылки профиля товара на маркете
        document.querySelectorAll('.accountLinkButton').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность поле для ввода заметки на маркете
        document.querySelectorAll('.textCtrl.extraLarge').forEach(({style}) => {
            style.background = 'rgba(0, 0, 0, 0.2)';
        });

// прозрачность кнопок блоков последних поисков на маркете
        document.querySelectorAll('.searchBarForm--searchHistoryContainer .item').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность кнопок блоков последних поисков на маркете
        document.querySelectorAll('.searchHistoryContainer .searchBarForm--searchHistory').forEach(({style}) => {
            style.background = 'rgb(54 54 54 / 0%)';
        });

// прозрачность выпадающих списков на маркете (свежие, старые, аукционы)
        document.querySelectorAll('.OrderByPopupClicker ').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// прозрачность выпадающих списков на форуме
        document.querySelectorAll('.chosen-container.textCtrl.extraLarge').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// только онлайн продавцы на данный момент
        document.querySelectorAll('.checkboxLikeButton').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// эффект акрила при выборе сортировки тем на форуме
        document.querySelectorAll('.chosen-container-active.chosen-with-drop .chosen-drop').forEach(({style}) => {
            style.background = 'rgba(39, 39, 39, 0.5)';
            style.backdropFilter = 'blur(7px) saturate(150%)';
        });

// прозрачность при выборе сортировки тем на форуме
        document.querySelectorAll('.chosen-container .chosen-results li.highlighted').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// кнопка создания закладки
        document.querySelectorAll('.button.middle.CreatePersonalExtendedTab').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// Префиксы тем фон в кнопке подписки на раздел
        document.querySelectorAll('.ctrlUnit').forEach(({style}) => {
            style.background = 'transparent';
        });

// Поля для ввода в поиске в теме
        document.querySelectorAll('.textCtrl.full').forEach(({style}) => {
            style.background = 'rgb(0 0 0 / 20%)';
        });

// Прозрачный фон "Вставка изображений"
        document.querySelectorAll('.lzt-fe-editorDialog').forEach(({style}) => {
            style.background = 'rgb(55 55 55 / 35%)';
        });

// Прозрачный фон поля для ввода "Вставка изображений"
        document.querySelectorAll('.xenForm .ctrlUnit > dd .textCtrl').forEach(({style}) => {
            style.background = 'rgb(0 0 0 / 20%)';
        });

// Фикс блоков статей
        document.querySelectorAll('.articleImageBox').forEach(({style}) => {
            style.background = 'transparent';
        });

// Прозрачный фон статистики темы на мобиле
        document.querySelectorAll('.Responsive .discussionListItem .secondRow .mobile--LastReply').forEach(({style}) => {
            style.background = 'rgb(135 135 135 / 10%)';
        });

// кнопка показать непрочитанные в ЛС на мобиле
        document.querySelectorAll('.conversationList--bottomBar--Mode.visible').forEach(({style}) => {
        style.background = 'rgb(135 135 135 / 10%)';
        });

// Непрочитанное сообщение в лс
        document.querySelectorAll('.message.unread .messageWrapper').forEach(({style}) => {
        style.background = 'rgb(135 135 135 / 10%)';
        });

// Прозрачный фон статуса на маркете
        document.querySelectorAll('.descriptionRow').forEach(({style}) => {
        style.background = 'transparent';
        });

// вы не успели принять участие в этом розыгрыше
        document.querySelectorAll('.error.mn-15-0-0').forEach(({style}) => {
        style.background = 'rgba(50, 0, 0, 0.5)';
        });

// Прозрачный фон "Исключить ненужные разделы из ленты"
        document.querySelectorAll('.selectForumsForm select.textCtrl, .selectForumsForm .select2-container .select2-selection--multiple, .selectForumsForm .tabInput').forEach(({style}) => {
        style.background = 'transparent';
        });

// Прозрачный фон у блоков в "Исключить ненужные разделы из ленты"
        document.querySelectorAll('.select2-container--default .select2-selection--multiple .select2-selection__choice').forEach(({style}) => {
        style.background = 'rgb(135 135 135 / 10%)';
        });

// бордер на выделение панели навигации
        document.querySelectorAll('.navLink.accountPopup.NoPopupGadget').forEach(({style}) => {
        style.borderRadius = '0 0 10px 10px';
        });

// фон создания темы
        document.querySelectorAll('.createThreadForm').forEach(({style}) => {
        style.background = 'rgb(135 135 135 / 10%)';
        });

// фон поле для ввода тегов
        document.querySelectorAll('.taggingInput.textCtrl.verticalShift').forEach(({style}) => {
        style.background = 'rgb(0 0 0 / 20%)';
        });

// фон поле для ввода заголовка
        document.querySelectorAll('.xenForm.createThreadForm .ctrlUnit .labeled>.textCtrl').forEach(({style}) => {
        style.background = 'rgb(0 0 0 / 20%)';
        });

// фон поле для ввода заголовка
        document.querySelectorAll('.fr-resizer').forEach(({style}) => {
        style.borderBottom = '5px solid rgb(55 50 50 / 0%)';
        });

// Если вы продали товар или тема уже неактуальна
        document.querySelectorAll('.grayBlock').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Увеличьте количество продаж и узнаваемость вашего бренда
        document.querySelectorAll('.threadView--PaidService').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Кнопка "Добавить метки" (теги)
        document.querySelectorAll('.tagEditStyle').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Обязательно ознакомьтесь с данной информацией
        document.querySelectorAll('.p2p-alertNotice-block').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Поиск пользователей (посмотреть симпы/лайки/сообщения)
        document.querySelectorAll('.bcont.pad').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Поиск пользователей (посмотреть симпы/лайки/сообщения)
        document.querySelectorAll('.likesTabs').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Поиск пользователей (посмотреть симпы/лайки/сообщения)
        document.querySelectorAll('.member_likes .titleBar').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Поиск пользователей (посмотреть симпы/лайки/сообщения)
        document.querySelectorAll('.member_likes2 .titleBar').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Поиск пользователей сообщения в профиле поиск
        document.querySelectorAll('.likeNodes.mn-0-0-15').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Поиск пользователей (посмотреть симпы/лайки/сообщения)
        document.querySelectorAll('.likeContainer').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Поиск пользователей (посмотреть симпы/лайки/сообщения)
        document.querySelectorAll('.likesPagination .PageNav').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// Тень для активной закладки (темы)
        document.querySelectorAll('.StarContent.mainc .star_thread_icon').forEach(({style}) => {
        style.boxShadow = '0 0 20px 0px rgb(0, 186, 120)';
        });

// Тень текста для Обязательно ознакомьтесь с данной информацией
        document.querySelectorAll('.p2p-alertText-title').forEach(({style}) => {
        style.textShadow = '0 0 10px red';
        });

// фон основного поиска
        document.querySelectorAll('.searchForm').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// фон авторизации
        document.querySelectorAll('.loginForm').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// фон количества призов в розыгрыше
        document.querySelectorAll('.moneyPlaces.moneyPlacesScroll.scroll-content').forEach(({style}) => {
        style.background = 'rgb(9 9 9)';
        });

// фон поле для ввода на авторизации
        document.querySelectorAll('.loginForm--input').forEach(({style}) => {
        style.background = '#222222';
        });

// фон правил /rules/
        document.querySelectorAll('.help_terms .blockrow').forEach(({style}) => {
        style.background = 'transparent';
        });

// Сумма платежей за все время
        document.querySelectorAll('.market--userPaymentsFilter').forEach(({style}) => {
        style.background = 'rgba(40, 40, 40, 0.5)';
        });

// Сумма платежей за все время
        document.querySelectorAll('.money_percent_block').forEach(({style}) => {
        style.background = 'rgba(40, 40, 40, 0.5)';
        });

// Поле ввода комментария к переводу денег
        document.querySelectorAll('.smilieInput.lztng-i2uldq').forEach(({style}) => {
        style.backgroundColor = 'transparent';
        });

// Ваши темы в профиле
        document.querySelectorAll('.profile_threads_block').forEach(({style}) => {
        style.background = 'transparent';
        });

// Title ваши тикеты
        document.querySelectorAll('.BRSTS_support_ticket_list_your .titleBar').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

// Показано тикетов 1 с 5 по 5
        document.querySelectorAll('.sectionFooter').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

// Промежуток между вопросами + фон вопросов
        document.querySelectorAll('.ticketListItem').forEach(({style}) => {
        style.borderBottom = '1px solid #000000';
        style.backgroundColor = 'rgb(20 20 20)';
        });

// фон Настройки отображения тикетов поддержки
        document.querySelectorAll('#DiscussionListOptionsHandle a').forEach(({style}) => {
        style.backgroundColor = 'rgb(39 39 39)';
        });

// фон вкладок /members/
        document.querySelectorAll('.member_notable ul.mn-15-0-0').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

// фон лента в профиле (недавняя активность у пользователя отсутствует) + закругленные углы
        document.querySelectorAll('.not-found-block').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        style.borderRadius = '10px';
        });

// прозрачный фон у плашки отзывов (фикс) на маркете
        document.querySelectorAll('.list-tab_reviews').forEach(({style}) => {
        style.background = 'transparent';
        });

// прозрачный фон панели навигации на маркете
        document.querySelectorAll('.Market_Down_BG').forEach(({style}) => {
        style.backgroundColor = 'transparent';
        });

// фикс фона листа транзакций на маркете
        document.querySelectorAll('.transactionList').forEach(({style}) => {
        style.background = 'rgb(45 45 45 / 30%)';
        });

// 50% прозрачность на фоне результатов опроса на форуме
        document.querySelectorAll('.pollResult .barContainer').forEach(({style}) => {
        style.background = 'rgb(54 54 54 / 50%)';
        });

// фон блока уведомления "Форумные турниры для настоящих геймеров"
        document.querySelectorAll('.TournamentNoticeBlock').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

// фон блока в теме "Предупреждение от модератора отзыв без доказательств"
        document.querySelectorAll('.message_warning_message_block').forEach(({style}) => {
        style.background = 'rgb(50 50 50 / 40%)';
        });

// фон блока в теме "Создать заявку для P2P обмена"
        document.querySelectorAll('.p2p_body-block').forEach(({style}) => {
        style.backgroundColor = 'transparent';
        });

// фон блока в теме "Создать заявку для P2P обмена"
        document.querySelectorAll('.field_p2p_list').forEach(({style}) => {
        style.background = 'rgba(135, 135, 135, 0.1)';
        });

// фон текстовых блоков в теме "Создать заявку для P2P обмена"
        document.querySelectorAll('.field_p2p_list .textCtrl').forEach(({style}) => {
        style.background = 'rgb(41 41 41 / 50%)';
        });

// фон страницы гаранта
        document.querySelectorAll('.guarantor_container').forEach(({style}) => {
        style.background = 'transparent';
        });

// фон блоков гаранта
        document.querySelectorAll('.guarantor_block_card').forEach(({style}) => {
        style.background = 'rgb(50 50 50 / 50%)';
        });

// фон блоков гаранта (холд)
        document.querySelectorAll('.guarantor_block_notification.neutrally').forEach(({style}) => {
        style.background = 'rgb(50 50 50 / 50%)';
        });

// фон блоков гаранта (прайс)
        document.querySelectorAll('.guarantor_block_card_price').forEach(({style}) => {
        style.background = 'rgb(50 50 50 / 50%)';
        });

// фон блоков гаранта (актуальные гаранты)
        document.querySelectorAll('.guarantor_block_actual_guarantors').forEach(({style}) => {
        style.background = 'rgb(50 50 50 / 50%)';
        });

// фон блоков гаранта (Отзывы о работе гарант сервиса)
        document.querySelectorAll('.guarantor_block_notification.guarantor_b_notify').forEach(({style}) => {
        style.background = 'rgb(50 50 50 / 50%)';
        });

// фон блоков гаранта (Форма подачи заявки Гаранту)
        document.querySelectorAll('.guarantor_block_form').forEach(({style}) => {
        style.background = 'rgb(50 50 50 / 50%)';
        });

// фон Сохраненные поиски на маркете
        document.querySelectorAll('.searchHistoryContainer.SearchHistoryList').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

// фон Фильтровать по дате публикации
        document.querySelectorAll('.dateRangePickerDiv').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

// Плашка перед созданием темы "Не забудьте ознакомиться с правилами раздела"
        document.querySelectorAll('.notification_rules_block').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

// Футер внизу маркета
        document.querySelectorAll('#footer-market').forEach(({style}) => {
        style.background = '#27272700';
        });

// В тикетах поле для ввода "У Вас недостаточно прав, чтобы здесь отвечать"
        document.querySelectorAll('.pageNavLinkGroup_down').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

// Плашка перед созданием темы "Обратите внимание! В данном разделе размещаются только важные форумные темы"
        document.querySelectorAll('.thread-create-notification').forEach(({style}) => {
        style.background = 'rgb(39 39 39 / 50%)';
        });

    }

applyStyles();


    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                applyStyles();
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    })();