// ==UserScript==
// @name Chat2Desk Dark Theme
// @namespace https://userstyles.world/user/TrJVoRoN
// @version 20240719.12.03
// @description Dark theme for Chat2Desk with larger icons
// @author TRJ-VoRoN
// @license No License
// @grant GM_addStyle
// @run-at document-start
// @match *://*.chat2desk.com/*
// @downloadURL https://update.greasyfork.org/scripts/502784/Chat2Desk%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/502784/Chat2Desk%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `

/* Основной фон */
body, html {
    background-color: #fff !important;
    color: #f4f4f4 !important;
}

.sc-cMFEbG.kjdPfC {
    background-color: #192024 !important;
}
    
/* Фон контейнера чата и других элементов */
#c2d-chat-container, .dhGrcK, .panel-body.bg_color_orange, .sc-2yxzr2-0, .sc-1qr00v0, .sc-1dihv9n-0, .bg_color_orange {
    background-color: #192024 !important;
    color: #b6f480 !important;
}

/* Фон боковой панели */
.sc-htpNat {
    background-color: #524848 !important;
    color: #000 !important;
}

/* Скрыть кнопку позвонить в тру каллер */
.sc-cbfGDZ.chtdX {
    display: none !important;
}

/* Скрыть аватар из шапки */
div#c2d-chat-container .fzVDzW, div#c2d-chat-container .gbOlZy {
    display: none !important;
}

/* Короткие ссылки кнопкой */
.jTNEPb a {
    height: 15px !important;
    width: 80px !important;
    overflow: hidden !important;
    display: inline-flex !important;
    margin-right: 10px !important;
    color: transparent !important;
    background: rgba(135, 201, 182, 0.15) !important;
    border-radius: 3px;
    position: relative; /* Добавляем для псевдоэлемента */
}

.jTNEPb a:hover {
    background: rgba(161, 215, 200, 0.3) !important;
}

.jTNEPb a:after {
    font-weight: 500;
    content: "⎆ Ссылка";
    color: #49c19d;
    position: absolute;
    pointer-events: none;
    padding: 2px 0px 0px 8px;
}

/* Рамка */
.jTNEPb {
    border: solid 1px #16af4436;
}

/* Скрыть стрелку в шапке */
.inGCYu {
    display: none !important;
}

/* Размер ФИО водителя */
.sc-UTuSi.gbXpTY {
    font-size: 109% !important;
    color: #3aa87f !important;
}

/* Отступ от ФИО */
.jTNEPb > :not(:last-child) {
    margin-bottom: -5px !important;
}

/* Иконки */
.leiLDT {
    width: 36px !important;
    height: 36px !important; /* Убедимся, что высота также установлена */
    background: rgb(0, 143, 255) !important;
    border-radius: 8px !important;
    justify-content: center !important;
    align-items: center !important;
    color: rgb(232, 230, 227) !important;
    display: flex !important; /* Для выравнивания иконок */
}

.ezuJvo:hover {
    background: rgba(255, 255, 255, 0.11) !important;
}

/* Уменьшить аватар в списке */
.jOLDLk {
    width: 45px !important;
    height: 45px !important;
}

/* В списке - уменьшить шрифты */
.cIDUWu {
    font-size: 105% !important;
}

.bQsXNM {
    font-size: 15px !important;
}

/* Размер корешков чата */
.eBOWqc::before, .iLLzpF::before, .gzoNKS::before, .bfwqHi::before {
    width: 5px !important;
}

/* Цвет сообщения - сотрудников */
.conversation-list .odd .css-33m3mk {
    background: rgba(57, 252, 142, 0.13) !important;
}

.css-33m3mk {
    background: rgba(119, 172, 236, 0.13) !important; 
}

/* Глобальные отступы */
.panel-body {
    padding: 2px !important;
}

.cRCsOj {
    font-weight: bold !important;
}

.iLLzpF {
     background-color: rgba(38, 163, 255, 0.14) !important;
}

/* Присвоить класс iLLzpF каждому элементу с data-testid="DialogItemId" */
[data-testid="DialogItemId"] {
    background-color: rgba(18, 255, 251, .14) !important;
}

 /* Увеличить иконки аналов */
.dfuCe{ 
    background-color: rgb(42, 46, 48) !important;
    color: rgb(232, 230, 227) !important;
    box-sizing: border-box !important;
    height: 35px !important; /* Обновленная высота */
    width: 35px !important; /* Обновленная ширина */
    border-radius: 8px !important;
    display: flex !important; /* Для выравнивания иконок */
    justify-content: center !important;
    align-items: center !important;
   /* background: rgb(210, 224, 235) !important;*/
}   
/* Увеличить круг авы */
.lglOPF {
  position: absolute;
  width: 39px;
  height: 39px;
  border-radius: 20px;
  border: 3.0px solid rgb(225, 87, 77);
    border-top-color: rgb(225, 87, 77);
    border-right-color: rgb(225, 87, 77);
    border-bottom-color: rgb(225, 87, 77);
    border-left-color: rgb(225, 87, 77);
}


/* Изменение значков непрочитанных уведомлений */
div[data-testid="BadgeId"] {
    width: 22px !important; /* Обновленная ширина */
    height: 23px !important; /* Обновленная высота */
    font-size: 15px !important; /* Размер шрифта */
    transform: none !important;
}

.bymeut {
    font-size: 15px !important; /* Размер шрифта */
}

    
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
