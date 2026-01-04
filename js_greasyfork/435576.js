// ==UserScript==
// @name         Anime2ru-script
// @namespace    https://anime2ru-script.herokuapp.com/
// @version      2.02
// @description  Скрипт для самых крупных аниме-форумов СНГ
// @author       Руна Дегенерации
// @match        https://dota2.ru/*
// @match        https://esportsgames.ru/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435576/Anime2ru-script.user.js
// @updateURL https://update.greasyfork.org/scripts/435576/Anime2ru-script.meta.js
// ==/UserScript==

console.time('[anime2ru-script] Время инициализации скрипта:')

var _HOST_ = localStorage.getItem('anime_dev_localhost') === 'true' ? 'http://localhost:5000' : "https://anime2ru-script.herokuapp.com";
var _SCRIPT_MODE_ = window.location.host;
var _SCRIPT_VERSION_ = '2.02';

// ------------------------------------
// Оверрайдинг и создание некоторых функций

Math.clamp = function(min, value, max){
    return Math.max(min, Math.min(max, Number(value)))
}

function createHttpRequest(opt){
    if (typeof opt !== 'object') {
        console.error('Некорректная форма отправки запроса');
        return;
    }
    if (!opt || !opt.link) {
        console.error('Link required!');
        return;
    }
    let request_options = {
        method: opt.method || "GET",
        link: opt.link,
        body: opt.body || {},
        success: opt.success || function(){},
        error: opt.error || function(){},
        stringify: opt.stringify !== false,
        anime: opt.anime || false,
        contentType: opt.contentType || "application/json",
        noXHR: opt.noXHR || false
    }
    if (opt.method != 'GET' && opt.anime) {
        request_options.body.token = localStorage.getItem('anime_token');
        request_options.body.mode = _SCRIPT_MODE_;
    }
    let http = new XMLHttpRequest();
    http.open(request_options.method, request_options.link);
    if (!request_options.noXHR) http.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    http.setRequestHeader("Content-Type", request_options.contentType);
    request_options.stringify ? http.send(JSON.stringify(request_options.body)) : http.send(request_options.body)
    http.onreadystatechange = function(){
        if (http.readyState != 4) return;
        http.status == 200 ? request_options.success(http) : request_options.error(http);
    }
};
window.createHttpRequest = createHttpRequest;

window.toggleDev = function(){
    localStorage.setItem('anime_dev_localhost', localStorage.getItem('anime_dev_localhost') !== 'true');
    window.location.reload();
}

// ------------------------------------
// Функции с аниме-форума, которые могут быть полезны

function anime2ruDateTimer(){
    // Взято прямиком из сайта
    var item = ".date-time, time"
    let timestamps = document.querySelectorAll(item)
    , now = moment();
    for (let item of timestamps) {
        let time = item.dataset.time
        , unixdate = moment.unix(time)
        , diff = now.dayOfYear() - unixdate.dayOfYear()
        , diff_year = now.year() - unixdate.year();
        void 0 !== item.dataset.time && void 0 !== item.dataset.timeFormat ?
        item.innerText = unixdate.format(item.dataset.timeFormat) : void 0 !== item.dataset.time && void 0 === item.dataset.timeFormat &&
        (item.innerText = 0 !== diff_year ? unixdate.format("D MMM YYYY в HH:mm") : diff < 0 || diff > 6 ? unixdate.format("D MMM YYYY") : diff < 1 ? now.unix() - time < 60 ? "Только что" :
        unixdate.fromNow() : diff < 2 ? unixdate.format("[Вчера в] HH:mm") : diff < 3 ? unixdate.format("[Позавчера в] HH:mm") : unixdate.calendar())
    }
    let customTimes = document.querySelectorAll(".date-time-custom, .date-time-from");
    for (let customTime of customTimes) {
        let time = customTime.dataset.time;
        customTime.innerText = void 0 !== time ? moment.unix(time).fromNow() : ""
    }
}
function anime2ruNotify(text, bold, timeout){
    Utils.notify(text, bold ? 'error' : 'success', timeout || undefined)
}
function createBooleansPattern(patterns_matrix){
    if (!patterns_matrix || !patterns_matrix.length) return '';
    var result_array = [];
    patterns_matrix.forEach(function(patterns_array){
        result_array.push(patterns_array.map(function(pattern){
            var boolean_name;
            if (pattern.boolean){
                boolean_name = pattern.boolean;
                return `
                <div class='row checkbox'>
                    <input type='checkbox' oninput="AnimeApi.BOOLEANS.toggle('${boolean_name}')" ${_BOOLEANS_[boolean_name] ? 'checked' : ''} id="custom-settings-bool-${boolean_name}">
                    <label for="custom-settings-bool-${boolean_name}">${pattern.text || boolean_name}</label>
                </div>
                `
            } else if (pattern.style){
                boolean_name = pattern.style;
                return `
                <div class='row checkbox'>
                    <input type='checkbox' oninput="AnimeApi.STYLES.toggle('${boolean_name}')" ${_STYLES_[boolean_name] ? 'checked' : ''} id="custom-settings-style-${boolean_name}">
                    <label for="custom-settings-style-${boolean_name}">${pattern.text || pattern.style}</label>
                </div>
                `
            }
        }).join(''))
    })
    return result_array.join('<p></p>');
}

// ------------------------------------
// Отлавливание веб-сокетов

// WebSocket.prototype.oldSend = WebSocket.prototype.send
// WebSocket.prototype.send = function(){
//     WebSocket.prototype.oldSend.apply(this, arguments);
//     console.log(this)
//     if (!this.old_onmessage){
//         this.old_onmessage = this.onmessage;
//         this.onmessage = function(){
//             this.old_onmessage.apply(this, arguments);
//         }
//     }
// };

// ------------------------------------
// Ивенты

function onDOMHeadReady(callback){
    if (!callback) callback = function(){}
    if (document.readyState !== 'loading') return void callback()
    document.addEventListener('Anime2ruDOMHeadReady', callback, {
        once: true
    });
}
var _header_ticker_ = setInterval(function(){
    if (!document.head) return;
    clearInterval(_header_ticker_);
    document.dispatchEvent(new Event('Anime2ruDOMHeadReady'))
}, 5)

function onDOMReady(callback){
    if (!callback) callback = function(){};
    if (document.readyState !== 'loading') return void callback();
    document.addEventListener('DOMContentLoaded', callback, {
        once: true
    })
}
function onClientUserReady(callback){
    if (!callback) callback = function(){};
    if (window.AnimeApi && window.AnimeApi.CLIENT_USER && AnimeApi.CLIENT_USER.is_checked) return void callback();
    document.addEventListener('Anime2ruClientUserReady', callback, {
        once: true
    })
}
function onAnimeUserReady(callback){
    if (!callback) callback = function(){};
    if (window.AnimeApi && window.AnimeApi.ANIME_USER && window.AnimeApi.ANIME_USER.is_checked) return void callback();
    document.addEventListener('Anime2ruAnimeUserUpdate', callback, {
        once: true
    })
}
function onSettingsPanelReady(callback){
    if (!callback) callback = function(){};
    if (document && document.getElementById('custon-settings-panel')) return void callback();
    document.addEventListener('Anime2ruSettingsPanelReady', callback, {
        once: true
    })
}

// ------------------------------------
// Основные классы скрипта

var AnimeStyleData = {
    base: `@charset "utf-8";

    .forum-theme__item[style]{
        text-shadow:
        -0.06em 0 0 rgb(30, 30, 30),
        0 -0.06em 0 rgb(30, 30, 30),
        0.06em 0 0 rgb(30, 30, 30),
        0 0.06em 0 rgb(30, 30, 30);
    }

    .custom-notification-panel{
        display: block !important;
        position: absolute;
        top: 100%;
        transition: opacity 0.2s;
        opacity: 0;
        visibility: collapse;
        right: -10px;
        background-color: #121215bb;
        width: 425px;
        height: 500px;
        overflow-y: scroll;
        z-index: 999999999999;
        padding: 5px 5px 0;
        font-size: 11px;
    }

    .custom-notification-panel::-webkit-scrollbar{
        border: solid 1px white;
        width: 8px;
        background-color: white;
    }

    .custom-notification-panel::-webkit-scrollbar-thumb{
        background-color: #c1c1c1;
    }

    .custom-notification-panel p{
        padding: 10px;
        font-size: 14px;
    }

    .custom-notification-panel .notices-body__items-item.unreaded{
        background-color: hsl(0, 20%, 15%);
    }

    .custom-notification-panel .notices-body__items-item.closed{
        opacity: 0.5;
    }

    @media (max-width: 500px) {
        .custom-notification-panel{
            display: none !important;
        }
    }

    .custom-notification-panel object > div{
        position: relative;
        display: flex;
        align-items: flex-start;
        padding: 5px;
        margin: 0 0 4px;
        background-color: #222328;
    }

    #private-mark-as-read, #mark-as-read{
        justify-content: center;
        width: 100%;
        pointer-events: none;
    }

    .custom-notification-panel .avatar{
        height: 40px;
        width: 40px;
        display: block;
        margin: 3px 10px 3px 3px;
    }

    .custom-notification-panel .smile{
        height: 32px;
        width: 32px;
        display: block;
        margin: 3px 3px 3px 10px;
    }

    .custom-notification-panel .notices-body__items-item{
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .custom-notification-panel abbr{
        color: #989898
    }

    .custom-notification-panel object a {
        color: #3498db !important;
    }

    .custom-notification-panel object a:hover {
        color: #5bb1eb !important;
    }

    .header__link:hover .custom-notification-panel, .custom-notification-panel:hover{
        visibility: visible;
        opacity: 1;
    }

    .custom-image-upload{
        width: 100% !important;
        height: 60px !important;
        border: 2px #acacacac dashed !important;
        color: #858585bd !important;
        cursor: pointer !important;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center !important;
        line-height: 100% !important;
        transition: border-color 0.2s, color 0.2s;
    }
    .custom-image-upload:hover{
        border-color: #f5f5f5ac !important;
        color: #ecececac !important;
    }

    .custom-image-upload input[type='file']{
        display: none;
    }

    .custom-image-upload p{
        text-align: center;
        line-height: 100%;
    }

    iframe{
        border: 2px dashed transparent !important;
    }

    iframe.drag{
        position: relative;
        border: dashed 2px #A8B5BA !important;
    }

    iframe:after{
        content: 'Загрузить изображение...';
        display: block;
        color: white;
        position: absolute;

        top: 0px;
        left: 0px;
    }

    .custon-settings-icon{
        cursor: pointer;
    }

    .custon-settings-icon img{
        filter: invert(70%);
        height: 16px;
    }

    #custon-settings-panel{
        box-sizing: border-box;
        position: fixed;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        background-color: #121215cc;
        z-index: 999999999999999;
        display: none;
    }

    #custom-id, #script-version{
        font-size: 12px;
        color: rgb(142, 142, 142)
    }

    #script-version:after{
        content: "|";
        margin: 0 5px;
    }

    #custon-settings-panel .close{
        transition: filter 0.2s;
        filter: brightness(60%);
        cursor: pointer;
        position: absolute;
        right: 15px;
        top: 7px;
    }

    #custon-settings-panel .close:hover{
        filter: brightness(100%);
    }

    #custon-settings-panel.visible{
        display: block;
    }

    #custon-settings-panel > div{
        margin: auto;
        top: 50%;
        transform: translateY(-50%);
        width: 800px;
        min-height: 550px;
        position: relative;
        padding: 20px;
        background-color: #1b1c20;
    }

    #custon-settings-panel > div:after{
        content: "";
        position: absolute;
        bottom: 10px;
        left: 0px;
        background-image: url("https://i.imgur.com/iH1iKwN.gif");
        background-size: 80px;
        background-repeat: no-repeat;
        height: 100px;
        width: 100px;
        opacity: 0.35;
    }

    .custom-settings-title{
        align-items: baseline;
        gap: 0px !important;
        margin-top: 0px !important;
    }

    #custon-settings-panel h2{
        margin-block-start: 0em !important;
        margin-block-end: 0em !important;
        margin-right: 10px;
    }

    #custon-settings-panel a{
        color: #00ade1;
    }
    #custon-settings-panel a:hover{
        color: #24c8f9 !important;
    }

    #custon-settings-panel > div > div{
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        gap: 20px;
    }

    @media (max-width: 800px), (max-height: 545px){
        #custon-settings-panel{
            overflow-y: scroll;
        }
        #main-settings-container{
            width: 100% !important;
        }
        #custon-settings-panel > div{
            top: 0px;
            transform: translateY(0%);
            width: 100%;
            min-height: 100%;
        }
        #custon-settings-panel > div:after{
            display: none;
        }
        #custon-settings-panel > div > div{
            flex-direction: column;
        }
        #custom-settings-paginator{
            width: 100%;
            min-width: 100%;
        }
        .custom-settings-title{
            flex-direction: column;
        }
        #script-version:after{
            content: ''
        }
    }

    #custom-settings-paginator{
        display: flex;
        gap: 4px;
        flex-direction: column;
        min-width: 180px;
    }

    #custom-settings-paginator > div{
        cursor: pointer;
        padding: 3px 8px 2px;
        background-color: #222224;
    }

    #custom-settings-paginator > div:hover{
        color: white;
    }

    #custom-settings-paginator > div.selected{
        background-color: #2b2c32;
    }

    #main-settings-container{
        box-sizing: border-box;
        width: 565px;
    }

    #main-settings-container div{
        display: none;
        flex-direction: column;
        gap: 8px;
    }

    .small-bottom{
        margin-bottom: -8px !important;
    }

    #main-settings-container div.visible{
        display: flex;
    }

    #main-settings-container div input, #main-settings-container div textarea{
        box-sizing: border-box;
        outline: none;
        border: none;
        color: #c2c2c4;
        background-color: #202020;
        padding: 5px;
    }

    #main-settings-container div input[type='file']{
        height: min-content;
        width: 100%;
    }

    #main-settings-container div textarea{
        resize: vertical;
        min-height: 27px;
        height: 27px;
        max-height: 100px;
    }

    #main-settings-container div select{
        padding: 2px;
        background-color: #202020;
        color: #c2c2c4;
        border: none;
        outline: none;
    }

    #main-settings-container .row{
        display: flex;
        flex-direction: row;
        gap: 5px;
    }

    #main-settings-container .row.checkbox{
        align-items: center;
    }

    #main-settings-container > div input[type="range"]{
        padding: 2px !important;
    }

    #main-settings-container > div input[type="submit"]{
        cursor: pointer;
        background-color: #121212 !important;
        padding: 8px 16px;
    }

    #main-settings-container > div input[type="submit"]:hover{
        background-color: #070707 !important;
    }

    #custom-settings-status{
        height: 20px;
    }

    #custom-smile-section-icon-preview{
        height: 0px;
        width: 0px;
        margin-left: 0px;
    }

    #custom-smile-section-icon-preview[src^='http']{
        height: 26.8px;
        width: 26.8px;
        margin-left: 3px;
    }



    .forum-theme__item{
        z-index: 1;
        position: relative;
        background-size: 0 0 !important;
    }

    .forum-theme__item.forum-theme__block:before{
        content: '';
        z-index: 0;
        background-image: inherit;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        position: absolute;
        background-size: cover;
        background-position-x: center;
        background-position-y: inherit;
        filter: opacity(100%);
        transition: filter 0.25s;
        display: none;
    }

    .forum-theme__item.forum-theme__block:hover:before{
        filter: opacity(25%);
        transition: filter 0.25s 0.2s;
    }

    .forum-theme__item-left, .forum-theme__item-right{
        z-index: 2;
    }

    #custom-id:after{
        color: #c90000;
        content: "Не авторизован"
    }

    #custom-id[data-id]:after{
        color: #22ab00;
        content: attr(data-id)
    }

    .custom-settings-range-full{
        width: 100%;
    }

    .custom-settings-bg-preview{
        padding: 15px;
        display: block !important;
        width: 100%;
        background-size: cover;
    }

    .preview-left-panel{
        font-size: 8px;
        width: 60px;
        display: flex !important;
        flex-direction: column;
    }

    .preview-left-panel img{
        height: 60px;
    }

    .item.control{
        white-space: nowrap;
    }

    .forum-theme__item[style] .forum-theme__item-block-mess{
        height: 100%;
        justify-content: flex-start;
    }

    .onlineMarker {
        background: #379036;
        border: none;
    }

    time{
        z-index: 1;
    }

    /* Скажем "НЕТ!" рекламе! */
    .adv, ins.adsbygoogle{
        display: none !important
    }

    #cfhide{
        display: none !important;
    }

    .ggbetgift{
        display: none !important;
    }

    div[class^="banner"]{
        display: none;
    }


    .smiles-panel__tabs-content{
        display: none !important;
    }

    .smiles-panel__tabs-content--active{
        display: block !important;
    }

    .bttv-search{
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .bttv-search > div{
        display: flex;
        flex-direction: row;
        width: 100%;
        gap: 5px !important;
        flex-wrap: nowrap !important;
        padding: 0;
        margin-bottom: 5px;
    }

    #anime2ru-smile-error{
        color: rgb(189, 0, 0)
    }

    @media (max-width: 480px) {
        .bttv-search{
            flex-direction: column !important;
        }
        .bttv-search input{
            width: 100% !important;
        }
    }

    .bttv-search input{
        background-color: #181819 !important;
        padding: 5px;
        width: 100%;
    }

    .bttv-search div.input{
        cursor: pointer;
        display: inline-block;
        text-align: center;
        background-color: #222224;
        padding: 5px;
        width: 100%;
        max-width: 150px;
        line-height: 100%;
    }

    .bttv-search div.input:hover{
        background-color: rgb(53, 53, 56);
    }

    .bttv-search:after{
        display: none;
    }

    #custom-context-menu{
        position: fixed;
        z-index: 2000;
        top: 100%;
        left: 100%;
        display: flex;
        flex-direction: column;
    }

    #custom-context-menu:not(.left) .context_container{
        left: calc(100% + 1px);
        padding-left: 0;
    }

    #custom-context-menu.left .context_container{
        right: calc(100% + 1px);
        padding-right: 0;
    }

    .context_container{
        padding: 3px;
        background-color: #18181b;
    }

    .context_container > div{
        min-width: 140px;
        padding: 3px 3px;
        box-sizing: content-box;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
    }

    .context_container > div > img{
        height: 24px;
    }

    .context_container > div:hover{
        background-color: #25262a;
    }

    .context_container > div:hover > .context_container{
        display: block;
    }

    .context_container .context_container{
        display: none;
        position: absolute;
        bottom: -3px;
    }

    .most-used-container.with-sections{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .most-used-container-section{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .most-used-container-section:after {
        content: "";
        flex: auto;
    }

    .absolute-container{
        position: relative;
        display: flex !important;
        width: 100%;
    }

    .absolute-container .absolute{
        display: flex !important;
        gap: 0px !important;
        width: 100%;
    }

    .ignore-users-query{
        background-color: #1b1b20;
        overflow-y: scroll;
        height: 97px;
        background-color: #161616
    }

    .ignore-users-query > div{
        display: flex !important;
        flex-direction: row !important;
        align-items: center;
        padding: 5px;
        cursor: pointer;
    }

    .ignore-users-query > div:hover{
        background-color: #29292f;
    }

    .ignore-users-query > div > img{
        height: 20px;
        margin-right: 5px;
    }

    .forum-theme__item-status.custom{
        font-size: 12px;
        min-height: 19px;
        display: none;
        background-color: transparent !important;
        color: #707070 !important;
    }

    .forum-theme__item-status.custom.empty:not(.editable){
        color: #ababb288 !important;
    }

    .forum-theme__item-status.custom.editable{
        background-color: rgba(0, 0, 0, 0.5) !important;
        color: #ababb2 !important;
    }

    .forum-theme__item-status.custom.pressed{
        pointer-events: none;
        opacity: 0.8;
    }

    .adsincont{
        display: none;
    }

    .ignore-background-button.pressed{
        pointer-events: none;
        opacity: 0.7;
    }

    .forum-theme__item-dots--options .forum-theme__item-dots-block{
        z-index: 100;
    }

    #header{
        width: auto !important;
    }

    #id{
        padding-top: 0px !important;
    }

    .header-sub.fixed{
        position: static !important;
    }

    .ignore-background-button:before{
        content: 'Скрыть фон'
    }

    .ignore-background-button.ignored:before{
        content: 'Не скрывать фон'
    }

    #custom-smile-section_delete-icon{
        height: 24px;
        width: 24px;
        margin-left: 6px;
        display: none;
    }

    #custom-smile-section_delete-icon[src]{
        display: block;
    }

    #custom-smile-section-order-preview > div{
        display: block;
        padding: 4px;
        background-color: #1b1c20;
        cursor: pointer;
    }

    #custom-smile-section-order-preview > div > img{
        display: block;
        height: 24px;
        width: 24px;
        opacity: 0.65;
    }

    #custom-smile-section-new-section-preview{
        background-color: #2b2c32 !important;
    }

    #custom-smile-section-new-section-preview > img{
        opacity: 1 !important;
    }

    .settings-status-text{
        animation: status-text 5s linear;
        font-weight: 500;
        opacity: 0;
    }

    .settings-status-text.green{
        color: rgb(0, 200, 0);
    }
    .settings-status-text.orange{
        color: rgb(225, 135, 0);
    }
    .settings-status-text.red{
        color: rgb(220, 0, 0);
    }

    @keyframes status-text {
        0% {
            opacity: 1;
        }
        85% {
            opacity: 1;
        }
        100% {
            opacity: 0
        }
    }

    .bttv-search{
        flex-direction: row;
        flex-wrap: nowrap !important;
        gap: 5px;
    }

    .most-used-container.bttv{
        max-height: 400px;
        overflow-y: scroll;
    }

    .create-smile-status-text{
        height: 24px;
    }

    `,
    old: `
    @charset "utf-8";

    /* ROOT COLORS */

    :root{
        --color-background: #0b0b0d;
        --color-projectAnime2: #121215;

        --color-panel-global: #1b1c20;
        --color-panel-header: #2b2c32;
        --color-panel-hover: #121212;
        --color-panel-2n: #222328;
        --color-panel-thread: #1b1c20;

        --color-spoiler-header: #080808;
        --color-spoiler: #121212;

        --color-header-button: #222224;
        --color-header-button-hover: #121212;
        --color-header-button-selected: #2b2c32;

        --color-button-1: #303035;
        --color-button-1-hover: #363639;
        --color-button-1-selected: #393942;

        --color-text-main: #ababb2;
        --color-text-main-hover: #cccccc;

        --color-toggle: white;
    }

    /* :root{
        --color-background: #e3e5e8;
        --color-projectAnime2: #ffffff;
        --color-panel-global: #f2f3f5;
        --color-panel-header: #e7e7e7;
        --color-panel-header-selected: #ebebeb;
        --color-panel-hover: #ffffff;
        --color-panel-2n: #e9e9e9;
        --color-panel-thread: #e8e8e8;

        --color-spoiler-header: #f4f4f4;
        --color-spoiler: #f0f0f0;

        --color-header-button: #e0e0e0;
        --color-header-button-hover: #d8d8d8;
        --color-header-button-selected: #ffffff;

        --color-button-1: #e0e0e0;
        --color-button-1-hover: #d8d8d8;
        --color-button-1-selected: #eeeeee;

        --color-text-main: #666;
        --color-text-main-hover: #222;

        --color-toggle: black;
    } */

    /* FIRST - MAIN PAGE */

    html{
        background: transparent !important;
        border-radius: 0 !important;
    }

    body{

        border-radius: 0 !important;
        background: var(--color-panel-global) !important;

    }

    #dappo{
        color: var(--color-text-main) !important;
        background-color: var(--color-background) !important;
    }

    #project-dota2{
        padding-bottom: 12px;
        padding-top: 0;
        background-color: var(--color-projectAnime2);
    }

    .footer{
        background: var(--color-panel-global)
    }

    .footer__bottom, .footer__bottom-wrap{
        background: var(--color-panel-header)
    }

    .footer__social-link {
        background: var(--color-button);
    }

    /* Я без понятия что это, но лучше не трогать */
    .forum-theme__item-dots--moderations:hover .forum-theme__item-dots--moderations-hovered-button, .forum-theme__item-dots--moderations:hover .forum-theme__item-dots--options-hovered-button, .forum-theme__item-dots--moderations:hover .forum-theme__item-dots-hovered-button, .forum-theme__item-dots--options:hover .forum-theme__item-dots--moderations-hovered-button, .forum-theme__item-dots--options:hover .forum-theme__item-dots--options-hovered-button, .forum-theme__item-dots--options:hover .forum-theme__item-dots-hovered-button, .forum-theme__item-dots:hover .forum-theme__item-dots--moderations-hovered-button, .forum-theme__item-dots:hover .forum-theme__item-dots--options-hovered-button, .forum-theme__item-dots:hover .forum-theme__item-dots-hovered-button {
        color: var(--color-toggle);
    }

    select, input{
        background: var(--color-header-button) !important;
        color: var(--color-text-main) !important;
        border: none !Important;
    }

    a:not(.forum-page__chat-message-name){
        color: var(--color-text-main);
    }

    a:hover{
        color: var(--color-text-main-hover) !important;
    }

    .global-main__wrap{
        background: var(--color-panel-global);
    }

    .global-content__btn-block-top {
        background: var(--color-panel-header);
    }

    .bg-main-block{
        padding: 12px;
        margin-bottom: 12px;
        background: none;
    }

    /* PAGE SELECTOR */

    .pagination__item a{
        background: var(--color-button-1) !important;
    }

    .pagination__item a:hover{
        background: var(--color-button-1-hover) !important;
    }

    .pagination__item a.pagination__link--active {
        background: var(--color-button-1-selected) !important;
    }

    #pagination-vue .pagination-vue-item:hover {
        background: var(--color-button-1-hover) !important;
    }
    #pagination-vue .pagination-vue-item.checked {
        background: var(--color-button-1-selected) !important;
    }
    #pagination-vue .pagination-vue-item {
        color: var(--color-toggle);
        background: var(--color-button-1) !important;
    }

    .title-global:not(.forum-profile__head-title){
        color: var(--color-text-main-hover) !important;
    }

    .subtitle-global{
        color: var(--color-text-main);
        border-radius: 3px 3px 0px 0px;
        background-color: var(--color-panel-header);
        display: block;
        min-height: 40px !important;
        max-height: 40px;
        padding: 7px 10px 5px;
        text-align: center;
        border: none;
    }

    .forum-customization, .news-customization {
        right: 7px;
        top: 7px;
        background: var(--color-button-1);
    }

    .forum-customization:hover, .news-customization:hover {
        background: var(--color-button-1-hover);
    }

    .btn-global{
        padding: 0 7px;
        margin: 0 6px;
        font-size: 16px;
        background: var(--color-button-1);
    }

    .btn-global:hover{
        background: var(--color-button-1-hover);
    }

    .btn-global--active{
        color: #00c0ff !important;
        background-color: var(--color-button-1-selected);
    }

    .global-content__btn-block-top a:hover{
        background: var(--color-panel-hover)
    }

    .global-content__btn-block-top--active {
        background: var(--color-panel-header-selected) !important;
    }

    .component-block{
        background-color: var(--color-panel-global)
    }

    .component-block__list{
        border: 0;
        padding-bottom: 0;
    }

    .component-block__link{
        padding: 0 12px !important;
    }

    .component-block__link:hover{
        background: var(--color-panel-hover) !important;
    }

    .component-block__link:hover .text-clip{
        color: var(--color-text-main-hover) !important;
    }

    .global-notifications__notification {
        border-radius: 0;
        background: var(--color-panel-global);
        box-shadow: 0 0 3px 0px #555;
    }

    .global-notifications__notification:before {
        background: var(--color-panel-hover);
    }


    /* HEADER */

    .header__logo:hover{
        background: var(--color-header-button-hover)
    }

    .header__logo.header-list__active{
        background: var(--color-header-button)
    }

    .header__link:hover:not(.header__link--user){
        background: var(--color-button-1);
    }

    .header__subb{
        background: var(--color-panel-global);
    }

    .header__subb-menu{
        background: transparent;
    }

    .navigation__list--active{
        background: var(--color-header-button) !important;
    }

    .navigation__link:hover{
        background: var(--color-header-button-hover) !important;
    }

    .navigation__list--active .navigation__link {
        color: var(--color-text-main);
        background: var(--color-header-button-selected) !important;
    }

    .navigation__sublist, #mobile-navigation{
        box-shadow: 0 0 3px 0px #555;
        background: var(--color-panel-global);
    }

    .navigation__sublink:hover{
        background: var(--color-header-button-hover);
    }

    .header__sublist--active {
        box-shadow: 0 0 3px 0px #555;
        background: var(--color-panel-global);
    }

    .header__sublink:hover{
        background: var(--color-header-button-hover);
    }

    .header__subitem-text--name:hover {
        color: var(--text-main-hover);
    }


    /* MATCHES */

    .owl-matches button{
        background: var(--color-button-1);
    }

    .owl-matches button:hover{
        background: var(--color-button-1-hover);
    }

    /* NEWS */

    .index__main{
        background-color: var(--color-panel-global);
        margin-right: 12px;
        margin-left: 0;
        order: 0;
    }

    .index__main .btn-global{
        margin-top: 0;
    }

    #news-categories{
        justify-content: left !important;
        max-height: 40px !important;
        padding: 5px 4px 3px !important;
        border-radius: 3px 3px 0px 0px !important;
        background-color: var(--color-panel-header) !important;
        margin-bottom: 12px !important;
    }

    #news-categories-blocks{
        padding: 0px 12px !important;
    }

    #news-categories .btn-global{
        background: none;
    }

    @media (max-width: 1023px){
        #news-categories-blocks{
            padding: 0px !important;
        }
    }

    .index__news-item{
        margin-bottom: 12px;
    }

    .index__news-name{
        margin-top: 5px;
    }

    .index__news-name a{
        color: var(--color-text-main)
    }

    .index__news-load{
        background: var(--color-button-1)
    }

    /* FORUM PANEL */

    .index__left-bar{
        order: 1;
        margin-right: 12px;
    }

    .forum__list .forum__item{
        background: var(--color-panel-global);
    }

    .forum__block{
        border: none;
        padding: 7px 0 5px;
        flex-direction: row !important;
    }

    .forum__item .text-clip{
        width: 100% !important;
    }

    .forum__block .forum__block-topic-title ~ span.component-text-grey-11{
        display: none;
    }

    .forum .forum__item:nth-of-type(2n){
        background: var(--color-panel-2n);
    }

    .forum .forum__item .component-block__img{
        display: none;
    }

    .forum .forum__item:nth-of-type(-n+4){
        margin-left: -2px;
        border-left: solid 2px #00beff;
    }

    .forum__item .text-clip{
        width: calc(100% - 50px);
    }

    .forum__item .component-text-grey-11 {
        white-space: nowrap;
    }

    .index__right-bar > div, .index__left-bar > div{
        border: none;
        margin-top: 0px;
        margin-bottom: 12px;
    }

    .short{
        border-radius: 0;
        background: var(--color-panel-global)
    }

    .short .message{
        color: var(--color-text-main);
    }

    .short .title{
        color: var(--color-text-main-hover);
        background: var(--color-panel-header);
    }

    /* MEMES */

    .index__right-bar{
        order: 2;
    }

    .memes .component-block__title{
        border: 0;
    }

    .memes__user{
        padding: 8px 12px 7px;
    }

    .memes__btn[href='/memes//']{
        display: none;
    }

    /* STREAMS */

    .streams .streams__item:nth-of-type(2n) a{
        background: var(--color-panel-2n);
    }

    .streams__item-component{
        min-height: 48px;
        padding: 4px 0;
        border: none !important;
    }

    .streams__item .component-block__img{
        border-radius: 18px !important;
        width: 36px !important;
    }

    /* TOURNAMENTS */

    .tournament .tournament__item:nth-of-type(2n) a{
        background: var(--color-panel-2n);
    }

    .tournament__item .component-block__block{
        border: none;
        padding: 8px 0;
    }

    /* VIDEOS */

    .video .video__item:nth-of-type(2n) a{
        background: var(--color-panel-2n);
    }

    .video__item .component-block__block{
        border: none;
        font-size: 12px !important;
        padding: 0;
    }

    .video__img{
        width: auto;
        height: 56px;
        margin-top: 4px;
    }

    .video__item .streams__text{
        padding-top: 4px;
        font-size: 11px !important;
    }

    .video__item .component-block__link:hover .component-text-grey-13 {
        color: var(--color-text-main-hover);
    }

    /* PLAYERS */

    .players .players__item:nth-of-type(2n) a{
        background: var(--color-panel-2n);
    }

    .players__item .component-block__block{
        border: none;
        font-size: 12px !important;
        padding: 8px;
    }

    .players__item .component-block__img{
        height: 36px !important;
    }

    /* SMILES */

    .smiles-panel__tabs-tab{
        cursor: pointer;
        background: var(--color-panel-global);
    }

    .smiles-panel__tabs-tab:hover{
        background: var(--color-panel-2n);
    }

    .smiles-panel__tabs-tab--active{
        background: var(--color-panel-header);
    }

    .smiles-panel__tabs-tab:not(:first-child){
        border-left: solid 2px var(--color-projectAnime2)
    }

    .smiles-panel__tabs-content-block {
        background: var(--color-panel-global);
    }

    /* SECOND - FORUM */

    .bg-main-block{
        padding: 0px;
    }

    .global-main__wrap{
        background: none !important;
    }

    .forum-section__title-unread *{
        color: var(--color-text-main);
        font-weight: 600;
    }

    .forum-section__title-unread:hover *{
        color: var(--color-text-main-hover);
    }

    .forum-page__item{
        background: var(--color-panel-global) !important;
    }

    .forum-section__list .forum-section__item:not(:first-child){
        background-color: var(--color-panel-global);
    }

    .forum-section__list .forum-section__item{
        padding: 4px 12px;
        border-top: solid 2px var(--color-projectAnime2);
    }

    .forum-section__item--first{
        background: var(--color-panel-header)
    }

    .sticky{
        background-color: var(--color-panel-2n) !important;
    }

    .forum-section__title-middled span{
        color: var(--color-text-main) !important;
    }

    .global-main__wrap{
        background: none;
    }

    .global-main__wrap > div{
        margin-bottom: 12px;
    }

    .forum-page__section{
        padding: 0px;
    }

    .forum-page__btn{
        transition: background-color 0.3s;
        background-color: var(--color-button-1) !Important;
    }

    .forum-page__btn:hover{
        background-color: var(--color-button-1-hover) !Important;
    }

    .forum-page__title-block{
        background: var(--color-panel-header);
        border-radius: 3px 3px 0 0;
        padding: 6px 6px 6px 12px;
    }


    /* CHAT */

    #chatFull{
        padding: 0;
    }

    .forum-page__chat-messager {
        color: var(--color-text-main-hover);
        padding: 4px;
        resize: vertical;
        background-color: var(--color-panel-global);
    }

    .forum-page__chat-message-wrap{
        background-color: var(--color-panel-2n);
    }

    .forum-page__chat-message-name{
        font-weight: bold;
        font-size: 14px;
    }

    .forum-page__chat-message-name:hover{
        text-decoration: underline;
    }

    .scroll-down{
        display: none
    }

    #chatFull form{
        background: var(--color-panel-header)
    }

    #chatFull .forum-theme__item-dots-block{
        background: var(--color-panel-global);
        box-shadow: 0 0 2px 0px #666;
    }

    #chatFull form button{
        font-size: 16px;
        border: 0;
        background: var(--color-button-1)
    }

    #chatFull form button:hover{
        background: var(--color-button-1-hover)
    }

    #chatMessageInput{
        background: var(--color-panel-global) !important
    }

    /* THREADS */

    .forum-page__list{
        padding: 0;
    }

    .forum-page__item:before, .forum-page__item:after{
        background: none !important;
    }

    .forum-page__item-list{
        margin: -15px 0 0px 60px;
        padding-bottom: 5px;
    }

    .forum-page__item-list li{
        padding: 0px 8px;
    }

    .forum-page__item-title-block{
        padding: 8px 12px;
        border-top: solid 2px var(--color-projectAnime2);
    }

    .forum-page__section{
        background: var(--color-panel-global);
    }

    .forum-page__online{
        background: var(--color-panel-global);
        color: var(--color-text-main)
    }

    #send-message{
        border: none;
    }

    #send-message:not(:hover){

        background: var(--color-header-button)
    }

    /* STATISTIC */

    .component-block__space-between:nth-child(2) {
        border: none;
    }

    /* THREADS */

    .fa-ellipsis-h:before {
        content: "";
    }

    /* GOLOSOVANIE!!!11!1 */

    #poll-form{
        background: #10101000 !important;
        padding: 0;
    }

    .poll-block__header-title{
        color: var(--color-text-main-hover);
        font-size: 24px;
        margin-bottom: 5px;
    }

    .poll-block__body-item{
        border: solid 1px #888;
        background: var(--color-panel-global);
        width: 500px;
        height: 40px;
    }

    /* .poll-block__body-item--name{
        color: var(--color-text-main) !important;
    } */

    .poll-block__body-item:hover {
        background: var(--color-panel-hover);
    }

    button.poll-block__body-item{
        color: var(--color-text-main)
    }

    button.poll-block__body-item:hover{
        color: var(--color-text-main-hover);
        background-color: var(--conor-button-1-hover);
    }

    .poll-block__body-item--count{
        color: #ababb2;
    }

    .poll-block__body-item--bar{
        background-color: #369ee2;
    }

    .forum-theme__item-dots--options .forum-theme__item-dots-block{
        background-color: var(--color-panel-header);
        box-shadow: 0 0 3px 0px #555;
    }

    .forum-theme__item-dots-block a:hover {
        background: var(--color-panel-hover)
    }


    /* PAGES */

    .forum-theme__top-block-info .btn-global{
        padding: 0 10px;
    }

    /* FORUM MESSAGE */

    .forum-theme__block{
        border-radius: 6px;
        margin-bottom: 20px;
    }

    .forum-theme__item.forum-theme__block:before{
        border-radius: 6px;
    }

    /* AVATAR BLOCK */

    .forum-theme__item-left{
        background: var(--color-panel-thread);
        padding: 6px;
        margin-right: 12px;
        border-right: solid 2px var(--color-panel-global);
        border-bottom: solid 2px var(--color-panel-global);
        width: auto;
        height: min-content;
        border-radius: 6px;
    }

    .forum-theme__item-name{
        max-width: 150px;
        text-align: center;
    }

    /* .forum-theme__item-left{
        box-shadow: 0px 0px 5px 2px #0051b5;
        box-shadow: 0px 0px 5px 2px #009328;
        box-shadow: 0px 0px 5px 2px #a10015;

        box-shadow: -3px 0px 4px 0px #009328, 3px 0px 4px 0px #0051b5;
        box-shadow: -3px 0px 4px 0px #a10015, 3px 0px 4px 0px #0051b5;

    }
    */

    .forum-theme__item-status{
        max-width: 150px;
        display: flex;
        justify-content: center;
        align-items: normal;
        text-align: center;
    }

    .forum-theme__item-status span{
        margin-top: 6px;
    }

    .forum-theme__item-avatar{
        width: 150px;
        margin: 0;
    }

    @media (max-width: 880px){
        .forum-theme__item-avatar{
            width: auto;
        }
    }

    .forum-theme__item-avatar > img{
        max-width: 140px;
        margin: 5px;
    }

    .forum-theme__item-info-desk > *{
        color: #888888;
        padding: 0 6px;
        line-height: 15px;
    }

    .forum-theme__item-info{
        white-space: nowrap;
    }

    .forum-theme__item-block-achiv {
        margin-top: 5px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        height: min-content;
    }

    .forum-theme__item-block-achiv div img{
        width: 38px;
    }

    .forum-theme__item-block-achiv div img[src='/img/dota_plus.png']{
        width: 38px;
    }

    span.rank{
        text-shadow: 1px 1px 2px black !important;
        margin-top: -5px;
    }


    .forum-theme__item-right > div{
        border-right: solid 2px var(--color-panel-global);
        padding: 10px;
        background: var(--color-panel-thread);
    }

    .forum-theme__item-block-mess {
        border-radius: 6px 6px 0px 0px;
    }

    .forum-theme__item-block-mess p{
        color: var(--color-text-main)
    }

    .forum-theme__item-block-mess a{
        color: #428ed5 !important;
    }


    /* MESSAGE BLOCK */

    /* time */
    .flex-row{
        order: 1;
        padding: 15px 10px 10px;
        height: 30px;
    }

    .forum-theme__item-right .forum-theme__item time{
        color: #666;
    }

    /* bottom panel */

    .forum-theme__item-bottom{
        order: 1;
        border-bottom: solid 2px var(--color-panel-global);
        border-radius: 0 0 6px 6px;
        padding: 6px 10px 10px !important;
        margin-top: 0;
        border-top: solid 2px var(--color-panel-global  );
        align-items: normal;
    }

    .forum-theme__item-bottom a, .forum-theme__item-bottom span{
        background: var(--color-button-1);
    }

    .forum-theme__item-bottom span span{
        background: none
    }

    .forum-theme__item-bottom .forum-theme__item-dots-block a:hover {
        background: var(--color-button-1-hover);
    }

    .forum-theme__item-bottom img{
        height: 28px;
        margin-right: 2px;
    }

    .forum-theme__item-bottom li > span{
        padding: 2px 4px;
        margin-top: 6px;
    }

    #rate-btn{
        height: 32px;
        margin-top: 6px;
        padding: 0;
    }

    .forum-theme__item-bottom .forum-theme__item-btn:hover{
        transition: 0s;
    }

    .forum-theme__item-bottom span span{
        margin-top: 2px;
        font-size: 16px;
    }

    .forum-theme__item-like-item{
        margin-right: 4px;
    }

    .forum-theme__item-like-link:hover {
        background: var(--color-button-1-hover);
    }

    .forum-theme__item-like-link-rated{
        background: var(--color-button-1-selected) !important;
    }

    .forum-theme__item-btn{
        margin-top: 6px;
        height: 32px;
    }



    .forum-theme__item-bottom .forum-theme__item-dots{
        background: transparent !important;
        margin-right: 0px;
        margin-top: 9px;
        padding: 0px;
        display: flex;
        justify-content: right !important;
        align-items: center;
        width: auto;
    }

    .forum-theme__item-bottom .forum-theme__item-dots span{
        display: none;
    }

    .forum-theme__item-bottom .forum-theme__item-dots .forum-theme__item-dots-block{
        background-color: transparent;
        bottom: 0;
        transform: none;
        position: relative;
        display: inline-flex;
        flex-direction: row;
        padding: 0;
        margin-top: -2.5px;
    }

    .forum-theme__item-bottom .forum-theme__item-dots .forum-theme__item-dots-block a{
        height: 32px;
        padding: 0 7px;
        margin-right: 5px;
    }


    /* Otvet */

    #quick-reply{
        width: calc(100% - 176px);
        margin-left: auto;
    }

    #forumPost{
        background: none !important;
    }

    @media(max-width: 900px){
        #quick-reply{
            width: 100%;
        }
    }

    /* TOX */

    .tox-editor-container{
        background: var(--color-panel-header) !important;
    }

    .tox-toolbar{
        border-bottom: solid 2px var(--color-projectAnime2) !important;
    }

    form:not(.global-content__edit-post) .tox-tbtn {
        margin: 0 2px !important;
        width: 26px !important;
    }

    .tox-split-button *{
        margin: 0 !important;
        padding: 0 !Important;
    }

    .tox-split-button:hover{
        box-shadow: 0 0 0 transparent !important;
    }

    form:not(.global-content__edit-post) .tox-tbtn {
        width: 26px;
    }

    .tox .tox-split-button .tox-split-button__chevron{
        width: 16px !important;
        margin-left: -5px !important;
        margin-right: 5px;
    }

    .tox-tinymce{
        margin-bottom: 12px;
        padding: 0 !important
    }

    .tox-tbtn:hover{
        background-color: transparent !important;
    }

    .tox-tbtn svg{
        margin: 0px -2px;
        cursor: pointer;
        filter: brightness(120%)
    }

    .tox-tbtn:hover svg{
        filter: brightness(250%)
    }

    .tox-tbtn[aria-disabled='true']{
        display: none;
    }

    form:not(.global-content__edit-post) .tox-tbtn.tox-tbtn--bespoke {
        width: 65px !important;
    }


    /* PING */

    .bbCodeQuote{
        margin-top: 5px;
        padding: 0;
        border: 0;
        background-color: #00000000;
    }

    .bbCodeQuote .attribution{
        border-radius: 6px 6px 0 0;
        border-bottom: solid 2px var(--color-projectAnime2);
        margin: 0;
        padding: 6px 12px 4px;
        background: var(--color-spoiler-header);
    }

    .bbCodeQuote .quote{
        border-radius: 0 0 6px 6px;
        background: var(--color-spoiler) !important;
        padding: 8px 12px 6px;
    }

    .quoteContainer .forum-theme__item-block-remess-btn{
        margin: 0 !important;
        background: var(--color-spoiler-header) !important;
        border-radius: 0 0 6px 6px;
    }

    .forum-theme__item-block-mess .attribution abbr {
        font-weight: 700;
    }


    /* SPOILER */

    .spoiler-btn{
        border: 0 !important;
        padding: 0 14px;
        color: var(--color-text-main);
        font-weight: 500;
        margin-top: 3px;
        background: var(--color-spoiler-header) !important;
    }

    .spoiler-btn:hover{
        color: var(--color-text-main-hover);
    }

    .spoiler-content{
        margin-top: 0px;
        margin-bottom: 5px;
        border: 0 !important;
        background: var(--color-spoiler) !important;
    }

    /* OTHER PAGES */

    .global-content h2, .global-content h3, .global-content h4 {
        color: var(--color-text-main) !important;
    }

    .global-content p{
        color: var(--color-text-main) !important;
    }

    .base-hero__link-hero:hover .base-hero__link-hero-name {
        background: var(--color-panel-header);
    }

    .base-hero__subtitle {
        max-height: 50px;
        padding: 20px 8px;
        display: flex !important;
        align-items: center;
    }

    .base-hero__subtitle:hover {
        color: var(--color-text-main-hover)
    }

    .forum-profile__content-block {
        background: var(--color-panel-global);
    }

    .forum-profile__content-block .stream-content{
        color: var(--color-text-main)
    }

    .forum-profile__content-block .stream-content a{
        color: #00c0ff !important;
    }

    .forum-profile__content-block .stream-content a:hover{
        text-decoration: underline;
    }

    .forum-profile__topblock-btn {
        background: var(--color-panel-header);
        color: #fff;
    }

    .forum-profile__topblock-btn:hover {
        background: var(--color-panel-hover);
        color: #fff;
    }

    .forum-profile__topblock-item-active {
        background: var(--color-panel-header-selected);
        color: #fff;
    }

    .forum-theme__form:not(.without-background) {
        background: var(--color-panel-header);
    }

    .forum-theme__form-block button {
        margin-top: 0px;
        color: var(--color-text-main)
    }

    .forum-theme__form{
        margin-top: 0px;
    }

    #wallPost{
        padding: 4px 8px;
        min-height: 0px;
        background: var(--color-panel-global) !important;
    }

    .global-content__self-menu-block{
        background: var(--color-button-1) !important;
    }

    .global-content__btn-block .btn-global{
        color: var(--color-text-main);
        background: var(--color-button-1);
    }

    .global-content__btn-block .btn-global:hover{
        color: var(--color-text-main-hover);
        background: var(--color-button-1-hover);
    }

    .mems-page__best {
        background: var(--color-panel-2n);
    }

    .global-content__search input{
        background: var(--color-panel-header) !important;
    }

    .global-content__search button{
        background: var(--color-button-1) !important;
    }

    .global-content__search button:hover{
        background: var(--color-button-1-hover) !important;
    }

    #notices{
        padding: 10px;
    }

    #notices .notices-body__categories{
        padding: 5px;
    }

    #notices .notices-body__categories--category.background {
        color: var(--color-text-main);
        background: var(--color-panel-global);
        box-shadow: 0 0 2px 0px #555 !important;
    }

    #notices .notices-body__categories--category.background:hover {
        background: var(--color-header-button-hover);
    }

    #notices .notices-body__categories--category.selected{
        background: var(--color-header-button-selected) !important;
    }

    #notices .notices-body__categories--category-count {
        background: transparent;
    }

    #notices .notices-body__items-item{
        background: var(--color-panel-global) !important;
        box-shadow: 0 0 2px 0px #555 !important;
    }


    .global-content__block-comment {
        background: var(--color-panel-global) ;
        color: var(--color-text-main);
    }

    .news-news__main-footer-wrap ul{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: right;
    }

    .news-news__main-footer-wrap ul li a{
        padding: 5px 10px;
        margin: 0;
    }

    .global-content blockquote, blockquote.news-tweet {
        background: var(--color-panel-2n);
        color: var(--color-text-main)
    }

    .page-title{

        padding: 0 12px;
    }

    #feed .feed-items-list{
        width: calc(100% - 24px);
    }

    #feed .feed-container{
        width: 100%;
    }

    .tox-edit-area__iframe {
        background-color: transparent;
    }

    .settings-page__column{
        padding: 12px;
        margin: 6px 0;
        background: var(--color-panel-global);
    }

    .settings-page__column:not(:last-child){
        margin-right: 6px;
    }

    .settings-page__block-splitter{
        margin: 0 !important;
        padding: 4px 8px;
    }

    .settings-page__block-splitter:hover{
        background: var(--color-panel-hover)
    }

    .settings-page__activity-forum--helper-check-subforums {
        padding-left: 0px;
        background: transparent;
    }

    .settings-page__activity-forum--helper{
        padding: 4px 0 4px 8px;
    }

    .settings-page__activity-forum--subforums-subforum:hover {
        background: var(--color-panel-hover)
    }

    .settings-page__activity-forum--helper:hover {
        background: var(--color-panel-hover)
    }

    .settings-page__activity-forum--helper-item {
        background: transparent
    }

    .settings-page__activity-forum--helper:before {
        opacity: 0.2;
    }

    .settings-page__activity-forum--helper-item > label, .settings-page__block-title {
        color: var(--color-text-main-hover)
    }

    .settings-page__activity label, .settings-page__block-splitter--item {
        color: var(--color-text-main)
    }

    input{
        background: var(--color-header-button) !important;
        cursor: pointer !important;
    }

    .btn-global{
        margin: 8px 0 0;
    }

    /* PROFILE */

    .forum-profile__head-container *{
        color: var(--color-toggle);
    }

    .forum-profile__head-rank {
        color: var(--color-toggle);
    }

    .bg-main-block:not(.forum-profile__wrap-block){
        background: 0;
    }

    .bg-main-block.forum-profile__wrap-block{
        padding: 10px;
        background-size: 100%;
    }

    .forum-theme__form-block button {
        background: var(--color-button-1);
    }

    .forum-profile__left-bar .component-block:first-child {
       background: var(--color-panel-header)
    }

    .forum-profile__left-bar .component-block:last-child .forum__item:nth-of-type(2n){
       background: var(--color-panel-2n)
    }

    .forum-profile__left-bar .component-block:last-child .forum-page__right-bar-block-img{
       height: 36px;
    }

    .forum-profile__left-bar .component-block:last-child .component-block__img{
       height: 36px;
    }

    .forum-profile__left-bar .component-block:last-child .component-block__block{
        padding: 8px;
        border: 0;
    }

    .forum-profile__right-bar-stat-block:last-child {
        padding-bottom: 5px;
    }

    .forum-profile__content-block form {
       margin-top: 0px !important;
    }

    #forum-profile__tab-wall{
        margin-top: 12px;
    }

    #forum-profile__tab-wall > article{
        margin: 0;
        padding: 10px 10px;
    }

    #forum-profile__tab-wall section{
        margin-top: 0px;
        padding: 5px 0 0;
    }

    #forum-profile__tab-wall section section{
        margin-top: -20px !important;
    }

    .forum-profile__content-block .global-content__comment {
        margin: 8px 0;
        padding-left: 53px;
    }

    .forum-profile__topblock {
        background: var(--color-panel-header);
    }

    .forum-profile__topblock-item-active {
        background: var(--color-button-1-selected) !important;
    }

    #user-profile{
        padding: 12px;
    }

    #wallPostComment{
        background: var(--color-panel-global) !Important
    }`,
    quick: `
    @charset "utf-8";

@media (min-width: 480px) {
    #quick-reply{
        max-height: 85%;

        text-align: center;
        padding: 20px;
        background-color: #1a1b20;
        box-shadow: 0 0 6px 2px black;
        position: fixed;
        left: 0;
        width: 100% !important;
        z-index: 1000;
        transform: translateY(100%);
        bottom: 60px;
        transition: transform 0.3s, bottom 0.3s;
    }

    @media (max-width: 1200px) {
        #quick-reply {
            width: 100% !important;
        }
    }

    #quick-reply:before{
        content: 'Написать ответ';
        width: 100%;
        text-align: center;
    }

    #quick-reply:hover{
        overflow-y: auto;
        bottom: 0px;
        transform: translateY(0%);
    }

    #quick-reply > form{
        position: relative;
        width: calc(100% - 178px);
        margin: 0 auto;
    }

    #send-message{
        width: 100%;
        margin-left: 0;
    }

    .quick-reply-pinner{
        display: block !important;
        position: absolute;
        right: 10px;
        top: 10px;
        height: 16px;
        width: 16px;
        background-size: 100%;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAftJREFUWEftVr9rFEEU/t6eQYKpjP4JWmqhTayFQEjm8DKzJxYp1dgZ0E5MSBchdtFYphBvZ3JyGxEEa2200FL/hKiVEoLevrDgwWX2Nm/uuKDFbbOw730/5s2b2UcoeRqN1nIU0cOyeD/fs4xX6vXqci8MlRFZm3I/IlKuMaqn1sjA/1uBf96EflNZm34BcE5qtr/xr8ao8yG5pVtQNNBqAxSFkAKcGVOthOQGGdjaenNqfHz/ZwhhJ2dv7+TEwsL0LwkTZMC51gVm+iSRdceJ+KLW1c8SJsjA9vbOtSzjpkTWHY8iqs3Pz72UMEEGkqR1j4jWJLLuODPfj+PqIwkTZMDa9CmAWxKZF980Rt2WMKKBJHl9Fvj9nIiuSmReBd4CYzfieGb3KNyRBqxN7wBYBXC6H/Gu3B8AHhijNsrwpQac29lg5sUBhQ/BiOiJ1nP5YgpPTwPOpZvMuDkM8Q4HEZ5prQp9VDCQJK8uEWUfhine4WKOLsfx7MdD94UvZG26DuDucRgA8NgYtSQZeAdg6pgMvDdGXZEMDHUU8xfij2aFHhjmHOCL9xpOxYuobCv8obVs6JS2cmRgVIFRBQaugHPpC2bU82NGhIbW6rp05IL/hiFEzWZzst0+8S3PrVT+nKnVat9DcH7OwBXIiZIkdfk7jpUeRDzHHAClR7wh2z61wgAAAABJRU5ErkJggg==");
        cursor: pointer;
    }

    @media (max-width: 900px){
       #quick-reply > form{
        width: 100%;
        margin: 0 auto;
    }
    }
    }`,
    simple: `@charset "utf-8";

    .tournament, .streams, .video, .memes, .index__right-bar, .owl-matches.new-m-matches.overflow-list{
        display: none;
    }

    .index__left-bar{
        min-width: 50%;
        max-width: 50%;
        margin: 0;
    }

    @media (max-width: 1023px){
        .index__left-bar{
            min-width: 100%;
            max-width: 100%;
        }
    }

    .index__left-bar .component-block{
        width: 100%;
    }

    .index__left-bar .forum .forum__item .component-block__img {
        display: block;
        margin: 10px 10px 10px 0;
    }

    .index__left-bar .forum__item .short{
        margin: 0;
        position: static;
        display: block;
    }

    .short .topic-header, .short .author, .short .node{
        display: none;
    }

    .short .message{
        margin-top: 8px;
        padding-left: 66px;
        color: #8F8F91;
    }

    .index__wrap{
        gap: 0 20px;
    }

    .index__main{
        margin: 0 0px;
    }`,
    sticky: `
    .header{
        position: fixed;
        padding: 0;
        top: 0px;
        left: 50%;
        width: 100%;
        height: auto;
        max-width: 1220px;
        transform: translateX(-50%);
        z-index: 100000;
        box-shadow: 0 -1px 5px 2px #00000088;
    }

    .header__subb{
        margin-bottom: 0px !important;
    }

    main{
        padding-top: 75px !important;
    }

    @media (max-width: 700px){
        main{
            padding-top: 95px !important;
        }
    }
    `,

    self_border: `
    .forum-theme__item.self{
        box-shadow: 0 0 4px rgba(255, 255, 255, 0.7);
        border-radius: 5px;
    }
    `,
    ts_border: `
    .custom-ts{
        box-shadow: 0px 0px 7px 4px #0051b5; /*ТС*/
    }
    `,
    friend_border: `
    .custom-friend{
        box-shadow: 0px 0px 7px 4px #009328; /*Подписчик*/
    }
    .custom-ts.custom-friend{
        box-shadow: -4px -4px 7px 0px #009328, 4px 4px 7px 0px #0051b5; /*ТС + подписчик*/
    }
    `,
    ignore_border: `
    .custom-ignore{
        box-shadow: 0px 0px 7px 4px #a10015; /*Игнорщик*/
    }
    .custom-ts.custom-ignore{
        box-shadow: -4px -4px 7px 0px #a10015, 4px 4px 7px 0px #0051b5; /*ТС + игнорщик*/
    }
    `,

    hide_ignored_messages: `
    .forum-theme__item.ignored{
        display: none;
    }
    `,

    spoiler_text: `
    .spoiler-btn:before {
        content: "Спойлер:";
    }
    `,
    self_background: `
    .forum-theme__item.self[style]:before {
        display: initial
    }
    .forum-theme__item.self[style] .forum-theme__item-left, .forum-theme__item.self[style] .forum-theme__item-right > div {
        background: none !important;
        border: none;
        border-radius: 5px;
    }
    `,
    other_backgrounds: `
    .forum-theme__item:not(.self)[style]:before {
        display: initial
    }
    .forum-theme__item:not(.self)[style] .forum-theme__item-left, .forum-theme__item:not(.self)[style] .forum-theme__item-right > div {
        background: none !important;
        border: none;
        border-radius: 5px;
    }
    `,

    show_custom_user_status: `
    .forum-theme__item-status.custom{
        display: block;
    }
    `
}
var AnimeFontsData = {
    'Anime Ace': {
        l: _HOST_ + '/fonts/Anime-Ace',
        f: 'Anime Ace'
    },
    'Arial': {
        f: 'Arial'
    },
    'Calibri': {
        f: 'Calibri'
    },
    'Caveat': {
        f: 'Caveat'
    },
    'Century Gothic': {
        f: 'Century Gothic'
    },
    'Comic Sans': {
        f: 'Comic Sans MS'
    },
    'Exo 2': {
        f: '"Exo 2"'
    },
    'Inter (по умолчанию)': {
        f: 'Inter'
    },
    'Jura': {
        f: 'Jura'
    },
    'Roboto': {
        f: 'Roboto'
    },
    'Leto Text Sans': {
        l: _HOST_ + '/fonts/Leto-Text-Sans',
        f: 'Leto Text Sans'
    },
    'Tahoma': {
        f: 'Tahoma'
    },
    'Times New Roman': {
        f: 'Times New Roman'
    },
}

var _BOOLEANS_OBJECT_ = Object.assign(JSON.parse(localStorage.getItem('anime_booleans') || '{}'), {
    toggle: function(boolean_name){
        _BOOLEANS_[boolean_name] = !_BOOLEANS_[boolean_name];
    },
})
var _BOOLEANS_ = new Proxy(_BOOLEANS_OBJECT_, {
    get: function(target, key){
        return target[key] || false;
    },
    set: function(target, key, value){
        value = !!value;
        if (target[key] === value) return true;
        if (value === true){
            target[key] = value;
            localStorage.setItem('anime_booleans', JSON.stringify(target));
            return true;
        } else {
            delete target[key];
            if (Object.keys(target).length){
                localStorage.setItem('anime_booleans', JSON.stringify(target));
            } else {
                localStorage.removeItem('anime_booleans');
            }
            return true;
        }
    }
})
var _LOCAL_DATA_ = new Proxy(JSON.parse(localStorage.getItem('anime_local_data') || '{}'), {
    get: function(target, key){
        return target[key];
    },
    set: function(target, key, value){
        if (target[key] === value) return true;
        target[key] = value;
        if (Object.keys(target).length){
            localStorage.setItem('anime_local_data', JSON.stringify(target));
        } else {
            localStorage.removeItem('anime_local_data');
        }
        return true;
    }
})
var _STYLES_ = (function(){
    var bools = JSON.parse(localStorage.getItem('anime_styles') || '{}');
    var style_inserter = document.createDocumentFragment();
    var base_style = document.createElement('style');
    base_style.innerHTML = AnimeStyleData.base;
    style_inserter.appendChild(base_style);
    Object.keys(AnimeStyleData).forEach(function(st){
        if (!bools[st]) bools[st] = false;
        var style_element = document.createElement('style');
        style_element.id = 'anime-style-' + st;
        if (bools[st]) style_element.innerHTML = AnimeStyleData[st];
        style_inserter.appendChild(style_element);
    })
    onDOMHeadReady(function(){
        document.head.appendChild(style_inserter)
    })
    return new Proxy(Object.assign(bools, {
        toggle: function(style){
            _STYLES_[style] = !_STYLES_[style]
        }
    }), {
        get: function(target, key){
            return target[key] || false;
        },
        set: function(target, key, value){
            value = !!value;
            if (target[key] === value) return true;
            if (value === true){
                target[key] = value;
                localStorage.setItem('anime_styles', JSON.stringify(target));
                document.getElementById('anime-style-' + key).innerHTML = AnimeStyleData[key];
                return true;
            } else {
                delete target[key];
                document.getElementById('anime-style-' + key).innerHTML = '';
                if (Object.keys(target).length){
                    localStorage.setItem('anime_styles', JSON.stringify(target));
                } else {
                    localStorage.removeItem('anime_styles');
                }
                return true;
            }
        }
    })
})();
var _FONTS_ = (function(){
    var font_element = document.createElement('style');
    
    var selected_font = _LOCAL_DATA_.font_name;
    if (!selected_font) _LOCAL_DATA_.font_name = 'Inter (по умолчанию)';
    let result_object = {
        selector: function(){
            return `
            <select oninput="AnimeApi.FONTS.select(this.value)">
                ${Object.entries(AnimeFontsData).map(function(data){
                    return `<option value="${data[0]}" style="font-family: ${data[1].f}"${data[0] === selected_font ? " selected" : ""}>${data[0]}</option>`
                })}
            </select>
        `
        },
        select: function(font_name){            
            var fonts_data = AnimeFontsData[font_name || 'Inter (по умолчанию)'];
            if (!fonts_data) return;
            _LOCAL_DATA_.font_name = font_name || 'Inter (по умолчанию)';
            font_element.innerHTML = (fonts_data.l ? `@font-face {font-family: ${fonts_data.f};src: url(${fonts_data.l});}` : '') + `#dappo{font-family: ${fonts_data.f}}`
        }
    }
    onDOMHeadReady(function(){
        document.head.appendChild(font_element);
        result_object.select(selected_font);
    })
    return result_object;
})();  

var _CLIENT_USER_ = (function(){
    var client_user_object = {
        is_checked: false,
        is_authorized: false,
        id: null,
        username: null,
        link: null,
        is_staff: false
    };
    onDOMReady(function(){
        var id = /\.(.*)\/$/.exec(document.querySelector('.header__subitem-head > a').getAttribute('href'));
        client_user_object.is_checked = true;
        if (!id) {
            return openSettingsTab('auth', 'need_auth')
        };
        client_user_object.is_authorized = true;
        client_user_object.id = Number(id[1]);
        client_user_object.username = document.querySelector('.header__subitem-text--name').textContent.trim();
        client_user_object.is_staff = document.querySelector('.header__subitem-text').style.color !== 'rgb(172, 172, 172)';
        client_user_object.link = document.querySelector('.header__subitem-head > a').getAttribute('href');
        if (AnimeApi.BOOLEANS.overall_quick_notif){
            var custom_notification_panel = document.createElement('div');
            custom_notification_panel.classList.add('custom-notification-panel');
            custom_notification_panel.style.display = 'none';
            custom_notification_panel.innerHTML = '<p>Секундочку...</p>';
            document.querySelector(".header__link[href='/forum/notifications/']").prepend(custom_notification_panel);
            window.updateNotifications = function(){
                createHttpRequest({
                    method: 'POST',
                    link: '/forum/api/notices/preload',
                    body: {page: 1, name: 'Все уведомления'},
                    success: function(http){
                        let notif_result = '<a><object><div id="mark-as-read">Отметить уведомления прочитанными</div></object></a>';
                        var notif_unreaded_count = 0;
                        JSON.parse(http.responseText).notices.forEach(function(note){
                            let post_link = note.post_id ? ("/forum/posts/" + note.post_id + "/") : null
                            let thread_link = note.topic_id ? ("/forum/threads/" + note.topic_id + "/") : null
                            let wall_link = note.wall_post_id ? ("/forum/wall/" + note.wall_post_id + "/") : null
                            let wall_comment_link = note.wall_comment_id ? ("/forum/wall-comment/" + note.wall_comment_id + "/") : null;
                            let news_link = note.news_id ? ("/news/" + note.news_id + "/") : null;
                            let main_link = news_link || wall_comment_link || wall_link || post_link || thread_link || note.link;
                            let smile_image = '';
                            if (note.is_readed === 0) notif_unreaded_count++;
                            if (note.smile_id) smile_image = `<img class='smile' src='${_HOST_}/smile/${note.smile_id}'>`
                            notif_result += `
                            <a href='${main_link}'>
                                <object>
                                    <div class='notices-body__items-item background ${note.is_readed == 1 ? '' : 'unreaded'}'>
                                        <a href='${note.link}' class='notices-body__items-item-avatar'>
                                            <img src='${note.avatar_link}' class='avatar icon'>
                                        </a>
                                        <div class='notices-body__items-item-content'>
                                            <div class='description'>${note.description}</div>
                                            <abbr data-time='${note.date_created}' class='date-time'>Сколько-то там времени назад</abbr>
                                        </div>
                                        ${smile_image}
                                    </div>
                                </object>
                            </a>`
                            custom_notification_panel.innerHTML = notif_result;
                            var notif_count_obj = document.querySelector(".header__link[href='/forum/notifications/'] > span");
                            if (notif_count_obj) {
                                notif_unreaded_count === 0 ? notif_count_obj.remove() : notif_count_obj.innerHTML = Math.max(Number(notif_count_obj.innerHTML), notif_unreaded_count)
                            }
                            else if (notif_unreaded_count > 0){
                                document.querySelector(".header__link[href='/forum/notifications/']").innerHTML += '<span>' + notif_unreaded_count + '</span>';
                                notif_count_obj = document.querySelector(".header__link[href='/forum/notifications/']");
                            }
                            anime2ruDateTimer();
                            document.querySelector(".header__link[href='/forum/notifications/']").onclick = function(e){
                                if (e.path.includes(document.getElementById('mark-as-read').parentElement)) e.preventDefault(); 
                            }
                            document.getElementById('mark-as-read').parentElement.onclick = function(){
                                createHttpRequest({
                                    method: 'POST',
                                    link: '/forum/api/notices/load',
                                    body: {},
                                    success: function(){
                                        for (let elem of custom_notification_panel.querySelectorAll('.unreaded')){
                                            elem.classList.remove('unreaded')
                                        }
                                        if (notif_count_obj) notif_count_obj.remove();
                                    }
                                })
                            }
                        })
                    }
                })
            }
            var notif_updater_count = 0;
            window.requestAnimationFrame(function(){
                if (notif_updater_count < 1){
                    notif_updater_count = 30000;
                    updateNotifications();
                } else {
                    notif_updater_count--;
                }
            })
        }  
        if (AnimeApi.BOOLEANS.overall_quick_private){
            var custom_private_panel = document.createElement('div');
            custom_private_panel.classList.add('custom-notification-panel');
            custom_private_panel.style.display = 'none';
            custom_private_panel.innerHTML = '<p>Секундочку...</p>';
            document.querySelector(".header__link[href='/forum/conversations/']").prepend(custom_private_panel);
            window.updatePrivate = function(){
                createHttpRequest({
                    method: 'GET',
                    link: "/forum/conversations/",
                    success: function(http){
                        let _document = new DOMParser().parseFromString(http.responseText, 'text/html');
                        let private_result = '<a><object><div id="private-mark-as-read">Отметить первые 20 сообщений прочитанными</div></object></a>';
                        var private_unreaded_count = 0;
                        var unreaded_private_array = [];
                        _document.querySelectorAll('.forum-section__item:not(.forum-section__item--first)').forEach(function(note){
                            var note_title = note.querySelector(".forum-section__title-middled");
                            var is_unreaded = Boolean(note.querySelector(".forum-section__title-unread"));
                            if (is_unreaded) {
                                private_unreaded_count++;
                                unreaded_private_array.push(note_title.getAttribute('href'));
                            }
                            private_result += `
                            <a href='${note_title.getAttribute('href')}'>
                                <object>
                                    <div class='notices-body__items-item background ${is_unreaded ? 'unreaded' : ''} ${note.classList.contains('ignored') ? 'closed' : ''}'>
                                        <a href='${note.querySelector('a[title]')}' class='notices-body__items-item-avatar'>
                                            <img src='${note.querySelector('img').src}' class='avatar icon'>
                                        </a>
                                        <div class='notices-body__items-item-content'>
                                            <div class='description'>${note_title.innerText}<br><div style='font-size: 9px; line-height: 100%'>${note.querySelector('.forum-section__name').innerHTML}</div></div>
                                            <abbr data-time='${note.querySelector(".dateTime").getAttribute('data-time')}' class='date-time'>Сколько-то там времени назад</abbr>
                                        </div>
                                    </div>
                                </object>
                            </a>`
                        })
                        custom_private_panel.innerHTML = private_result;
                        anime2ruDateTimer();
                        var private_count_obj = document.querySelector(".header__link[href='/forum/conversations/'] > span");
                        if (private_count_obj) {
                            private_unreaded_count === 0 ? private_count_obj.remove() : private_count_obj.innerHTML = Math.max(Number(private_count_obj.innerHTML), private_unreaded_count)
                        }
                        else if (private_unreaded_count > 0){
                            document.querySelector(".header__link[href='/forum/conversations/']").innerHTML += '<span>' + private_unreaded_count + '</span>';
                            private_count_obj = document.querySelector(".header__link[href='/forum/conversations/']");
                        }
                        document.querySelector(".header__link[href='/forum/conversations/']").onclick = function(e){
                            if (e.path.includes(document.getElementById('private-mark-as-read').parentElement)) e.preventDefault(); 
                        }
                        document.getElementById('private-mark-as-read').parentElement.onclick = function(){
                            let iterator = function(){
                                if (!unreaded_private_array.length) return;
                                createHttpRequest('GET', unreaded_private_array.shift(), {}, function(http){}, function(http){});
                                setTimeout(iterator, 250);
                            }
                            iterator();
                            for (let elem of custom_private_panel.querySelectorAll('.unreaded')){
                                elem.classList.remove('unreaded')
                            }
                            if (private_count_obj) private_count_obj.remove();
                        }
                    }
                })
            }
            var private_updater_count = 0;
            window.requestAnimationFrame(function(){
                if (private_updater_count < 1){
                    private_updater_count = 30000;
                    updatePrivate();
                } else {
                    private_updater_count--;
                }
            })
        }
        document.dispatchEvent(new Event('Anime2ruClientUserReady'))
    })
    return client_user_object;
})();
var _ANIME_USER_ = (function(){
    var anime_user_object = new Proxy({
        is_checked: false,
        user_id: null,
        background: {
            link: '',
            brightness: 40,
            position: 50,
            is_hidden: false
        },
        smile_sections: [],
        super_ignore: {
            is_active: false,
            users_list: [],
            use_ignore_list: false,
            include: [],
            exclude: [],
        },
        custom_users_status: {},
        login: function(){
            var password = document.getElementById('custom-password').value;
            AnimeApi.SETTINGS_PANEL.status('Авторизовываюсь...')
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/authorize',
                body: {password: password, id: AnimeApi.CLIENT_USER.id, mode: _SCRIPT_MODE_},
                success: function(http){
                    AnimeApi.SETTINGS_PANEL.status('Успешно!', 'green')
                    anime_user_object.update(JSON.parse(http.responseText))
                },
                error: function(http){
                    AnimeApi.SETTINGS_PANEL.status('Не удалось авторизоваться!', 'red')
                }
            })
        },
        logout: function(){
            localStorage.removeItem('anime_token');
            anime_user_object.update();
        },
        register: function(){
            let register_password = document.getElementById('custom-register-password').value;
            if (!register_password || register_password.length < 4){
                return void AnimeApi.SETTINGS_PANEL.status('Пароль слишком короткий! Придумайте что-то хотя бы с 4 символами.', 'red');
            }
            if (register_password !== document.getElementById('custom-register-password-r').value){
                return void AnimeApi.SETTINGS_PANEL.status('Пароли не совпадают!', 'red');
            }
            if (_SCRIPT_MODE_ === "dota2.ru"){
                AnimeApi.SETTINGS_PANEL.status('Начинаю регистрацию...');
                createHttpRequest({
                    method: 'POST',
                    link: '/forum/api/forum/setRateOnPost',
                    body: {pid: 26000919, smileId: 1538},
                    error: function(){
                        AnimeApi.SETTINGS_PANEL.status('Не удалось начать процесс регистрации!', 'red');
                    },
                    success: function(http){
                        if (JSON.parse(http.responseText).status !== 'success'){
                            return void AnimeApi.SETTINGS_PANEL.status('Не удалось начать процесс регистрации!', 'red');
                        }
                        createHttpRequest({
                            method: 'POST',
                            link: _HOST_ + '/registerUser',
                            body: {id: AnimeApi.CLIENT_USER.id, mode: _SCRIPT_MODE_, password: register_password},
                            success: function(http){
                                AnimeApi.SETTINGS_PANEL.status('Регистрация прошла успешно!', 'green');
                                anime_user_object.update(JSON.parse(http.responseText))
                                createHttpRequest({
                                    method: 'POST',
                                    link: '/forum/api/forum/unRatePost',
                                    body: {pid: 26000919, smileId: 1538}
                                })
                            },
                            error: function(http){
                                var error_text;
                                switch(http.status){
                                    case 500:
                                        error_text = 'Не удалось получить информацию для подтверждения!';
                                        break;
                                    case 403:
                                        error_text = 'Неверне данные аккаунта!';
                                        break;
                                    case 404:
                                        error_text = 'Не удалось подтвердить принадлежность аккаунта!';
                                        break;
                                }
                                AnimeApi.SETTINGS_PANEL.status(error_text, 'red');
                                createHttpRequest({
                                    method: 'POST',
                                    link: '/forum/api/forum/unRatePost',
                                    body: {pid: 26000919, smileId: 1538}
                                })
                            }
                        })
                    }
                })
            }
        },
        changePassword: function(){
            var new_password = document.getElementById('custom-new-password').value;
            if (!new_password || new_password.length < 4) return void AnimeApi.SETTINGS_PANEL.status('Пароль слишком короткий! Придумайте что-то хотя бы с 4 символами.', 'red');
            AnimeApi.SETTINGS_PANEL.status('Меняю пароль...');
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/changePassword',
                body: {
                    old_password: document.getElementById('custom-old-password').value,
                    new_password
                },
                anime: true,
                success: function(http){
                    AnimeApi.SETTINGS_PANEL.status('Успешно!', 'green');
                },
                error: function(http){
                    if (http.status === 404) {
                        AnimeApi.SETTINGS_PANEL.status('Неверные данные аккаунта!', 'red');
                    } else AnimeApi.SETTINGS_PANEL.status('Произошла ошибка!', 'red');
                }
            })
        },
        update: function(user_data){
            if (!user_data) user_data = {};
            anime_user_object.user_id = user_data.user_id || user_data.id || null;
            onSettingsPanelReady(function(){
                if (!anime_user_object.user_id || !AnimeApi.CLIENT_USER.is_authorized) {
                    openSettingsTab('auth', AnimeApi.CLIENT_USER.is_authorized ? 'login' : 'need_auth')
                    _SETTINGS_PANEL_.removeSettingsTab('bg');
                    _SETTINGS_PANEL_.removeSettingsTab('smiles');
                    _SETTINGS_PANEL_.removeSettingsTab('thread-ignore');
                    anime_user_object.background = {
                        link: '',
                        brightness: 40,
                        position: 50,
                        is_hidden: false
                    };
                    anime_user_object.smile_sections = [];
                    anime_user_object.super_ignore = {
                        is_active: false,
                        users_list: [],
                        use_ignore_list: false,
                        include: [],
                        exclude: [],
                    };
                    anime_user_object.custom_users_status = {};
                    AnimeApi.SUPER_IGNORE.render();
                    AnimeApi.THREAD_POSTS.update();
                    AnimeApi.SMILE_SECTIONS.updateAllSmileSections();
                    return void document.dispatchEvent(new Event('Anime2ruAnimeUserUpdate'));
                };
                openSettingsTab('auth', 'logout');
                if (user_data.token) localStorage.anime_token = user_data.token;
                // Настройка своего фона
                _SETTINGS_PANEL_.createSettingsTab('Фон своих постов', 'bg', 31, [
                    {
                        name: 'create',
                        inner: `
                        <p>Изображение для заднего фона постов форума</p>
                        <div class='row small-bottom'>
                            <input type='file' id='custom-settings-bg-file' accept="image/png, image/jpg, image/jpeg, image/gif" onchange="AnimeApi.SETTINGS_BACKGROUND.file = this.files[0]" class='small-bottom'>
                            <input type='submit' value='Очистить' onclick="AnimeApi.SETTINGS_BACKGROUND.file = undefined">
                        </div>
                        <p class='small-bottom'>или...</p>
                        <input type='text' placeholder="Ссылка на изображение" id='custom-settings-bg-link' oninput="AnimeApi.SETTINGS_BACKGROUND.link = this.value">
                        <p class='small-bottom'>Расположение фона</p>
                        <input type='range' min=0 max=100 value=50 id='custom-settings-bg-pos-range' class='custom-settings-range-full' oninput="AnimeApi.SETTINGS_BACKGROUND.position = this.value;">
                        <p class='small-bottom'>Яркость</p>
                        <input type='range' min=0 max=100 value=50 id='custom-settings-bg-br-range' class='custom-settings-range-full' oninput="AnimeApi.SETTINGS_BACKGROUND.brightness = this.value;">
                        <p>Предпросмотр</p>
                        <div id='custom-settings-bg-preview' class='visible custom-settings-bg-preview'>
                            <div class='preview-left-panel'>
                                ${document.getElementsByClassName('header__subitem-text--name')[0].innerText}
                                <img src="${document.getElementsByClassName('header__subitem-head')[0].children[0].children[0].src}}">
                            </div>
                        </div>
                        <div class='row checkbox'>
                            <input type="checkbox" id="custom-settings-bg-hide" oninput="AnimeApi.SETTINGS_BACKGROUND.is_hidden = this.checked">
                            <label for="thread-bg-self">Не показывать свой фон другим пользователям</label>
                        </div>
                        <div class='row'>
                            <input type='submit' value='Отправить' onclick='AnimeApi.SETTINGS_BACKGROUND.save()'><input type='submit' value='Удалить фон' onclick='AnimeApi.SETTINGS_BACKGROUND.remove()'>
                        </div>`
                    }
                ])
                anime_user_object.background = user_data.background || {
                    brightness: user_data.thread_bg_br,
                    position: user_data.thread_bg_position,
                    is_hidden: user_data.thread_bg_self,
                    link: user_data.threads_bg
                };

                // Панель смайлов
                _SETTINGS_PANEL_.createSettingsTab('Панель смайлов', 'smiles', 100, [
                    {
                        name: 'main',
                        inner: `
                        <p>Создать вкладку для панели смайлов</p>
                        <p style='font-size: 12px'>Вы можете создать свою вкладку для панели смайлов, в которую можете добавлять любые смайлы нажатием ПКМ по ним в сообщении или внутри панели смайлов. Можно иметь не более 10 вкладок.</p>
                        <input type='text' placeholder="Название вкладки" id='custom-smile-section-name'>
                        <input type='text' placeholder="Ссылка на картинку, что будет иконкой" id='custom-smile-section-image' oninput="AnimeApi.SMILE_SECTIONS.setCreatingPreviewImage(this.value)">
                        <input type='number' placeholder="Позиция по порядку (по умолчанию первая)" min=0 max=9 id='custom-smile-section-order' oninput="AnimeApi.SMILE_SECTIONS.setCreatingPreviewOrderByInput(this.value)">
                        <div class="row" id="custom-smile-section-order-preview"></div>
                        <input type='submit' value="Создать вкладку" onclick="AnimeApi.SMILE_SECTIONS.create()">
                        <p></p>
                        <p>Удалить вкладку для панели смайлов</p>
                        <div class="row">
                            <select id="custom-smile-section_delete" style="width: 100%" oninput="AnimeApi.SMILE_SECTIONS.selectToDelete(this.value)">
                            </select>
                            <img id="custom-smile-section_delete-icon">
                        </div>
                        <input type='submit' value="Удалить вкладку" onclick="AnimeApi.SMILE_SECTIONS.delete()">
                        `
                    }
                ])
                anime_user_object.smile_sections = user_data.smile_sections || user_data.custom_smile_sections;
                AnimeApi.SMILE_SECTIONS.update();

                _SETTINGS_PANEL_.createSettingsTab('Супер-игнор тем', 'thread-ignore', 120, [
                    {
                        name: 'edit',
                        inner: `
                        <div class='row checkbox'>
                            <input type='checkbox' id="custom-super-ignore" oninput="AnimeApi.SUPER_IGNORE.is_active = this.checked">
                            <label for="custom-super-ignore">Включить супер-игнор тем на форуме и главной странице</label>
                        </div>
                        <p class='small-bottom'>Скрывать темы, если их автором является:</p>
                        <div class='absolute-container small-bottom'>
                            <textarea placeholder="Список никнеймов, разделённых запятыми" oninput="AnimeApi.SUPER_IGNORE.searchUser(); AnimeApi.SUPER_IGNORE.users_list = this.value" id='custom-super-ignore-list'></textarea>
                            <div class='absolute ignore-users-query' id='users-ignore-query'>
                            </div>
                        </div>
                        <div class='row checkbox'>
                            <input type='checkbox' id="custom-ignore-users-for-super" oninput="AnimeApi.SUPER_IGNORE.use_ignore_list = this.checked">
                        <label for="custom-ignore-users-for-super">Дополнить этот список пользователями из игнор-листа</label>
                        </div>
                        <p></p>
                        <p class='small-bottom'>Скрывать темы, названия которых содержат текст:</p>
                        <i><p class='small-bottom' style='font-size: 12px; opacity: 0.7'>Пример: <u>вакцин</u> будет скрывать <u>вакцин</u>ированный, <u>вакцин</u>ация и так далее.</p></i>
                        <textarea placeholder="Список слов, разделённых запятыми" id='custom-super-ignore-include' oninput="AnimeApi.SUPER_IGNORE.include = this.value"></textarea>
                        <p class='small-bottom'>Но при этом не содержат текст:</p>
                        <textarea placeholder="Список слов, разделённых запятыми" id='custom-super-ignore-exclude' oninput="AnimeApi.SUPER_IGNORE.exclude = this.value"></textarea>
                        <input type='submit' value='Применить' onclick="AnimeApi.SUPER_IGNORE.save()">`
                    }
                ])

                anime_user_object.super_ignore = user_data.super_ignore || {
                    is_active: user_data.use_super_ignore,
                    use_ignore_list: user_data.ignored_users_to_super,
                    include: user_data.thread_ignore_include,
                    exclude: user_data.thread_ignore_exclude,
                    users_list: user_data.thread_ignore_users
                };
                AnimeApi.SUPER_IGNORE.render();
                AnimeApi.THREAD_POSTS.update();
                AnimeApi.SMILE_SECTIONS.updateAllSmileSections();

                anime_user_object.custom_users_status = user_data.custom_users_status;
                document.dispatchEvent(new Event('Anime2ruAnimeUserUpdate'));
            })
        }
    }, {
        set: function(target, key, value){
            target[key] = value;
            switch (key){
                case 'user_id':
                    onSettingsPanelReady(function(){
                        if (!value){
                            document.getElementById('custom-id').removeAttribute('data-id');
                        } else {
                            document.getElementById('custom-id').setAttribute('data-id', value);
                        }
                    })
                    return true;
                case 'background':
                    if (!anime_user_object.user_id) return true;
                    _SETTINGS_BACKGROUND_.config = {
                        brightness: value.brightness,
                        position: value.position,
                        is_hidden: value.is_hidden,
                        link: value.link
                    }
                    return true;
                case 'smile_sections':
                    return true;
                case 'super_ignore':
                    _SUPER_IGNORE_.config = {
                        is_active: value.is_active,
                        use_ignore_list: value.use_ignore_list,
                        users_list: value.users_list,
                        include: value.include,
                        exclude: value.exclude,
                    }
                default:
                    return true;
            }
        }
    });
    createHttpRequest({
        method: 'POST',
        link: _HOST_ + '/authorize',
        anime: true,
        success: function(http){
            var user_data = JSON.parse(http.responseText);
            // console.log('[anime2ru-script] UserData:', user_data)
            anime_user_object.is_checked = true;
            anime_user_object.update(user_data);
        },
        error: function(){
            anime_user_object.is_checked = true;
            openSettingsTab('auth', 'login');
        }
    })
    return anime_user_object
})();

var _SETTINGS_PANEL_ = (function(){
    var open_settings_button = document.getElementById('open-custom-settings-button');
    if (!open_settings_button){
        open_settings_button = document.createElement('li');
        open_settings_button.id = 'open-custom-settings-button';
        open_settings_button.classList.add('header__item');
        open_settings_button.style.cursor = `pointer`;
        open_settings_button.innerHTML = `<a class='header__link' onclick="toggleSettingsPanel()">
        <img style="filter: invert(70%); height: 16px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik01MTIsMjg5Ljc0di02Ny40NzlsLTY4LjE5Ny0xOC4xMzljLTQuMjUxLTE1LjM5OC0xMC40MDYtMzAuMTg3LTE4LjM4OS00NC4xOTJsMzQuODc2LTYwLjU3NGwtNDcuNjQ2LTQ3LjY0Nw0KCQkJTDM1Mi4wNyw4Ni41ODVjLTE0LjAwMi03Ljk4Mi0yOC43OTQtMTQuMTM3LTQ0LjE5MS0xOC4zODlMMjg5Ljc0LDBoLTY3LjQ4bC0xOC4xNCw2OC4xOTUNCgkJCWMtMTUuMzk3LDQuMjUyLTMwLjE4OSwxMC40MDgtNDQuMTkxLDE4LjM4OUw5OS4zNTUsNTEuNzA4TDUxLjcwOSw5OS4zNTVsMzQuODc2LDYwLjU3Mw0KCQkJYy03Ljk4NCwxNC4wMDUtMTQuMTM4LDI4Ljc5NS0xOC4zODksNDQuMTkyTDAsMjIyLjI2djY3LjQ3OWw2OC4xOTcsMTguMTM5YzQuMjUyLDE1LjM5OCwxMC40MDcsMzAuMTg4LDE4LjM4OSw0NC4xOTINCgkJCUw1MS43MSw0MTIuNjQzbDQ3LjY0Niw0Ny42NDdsNjAuNTc0LTM0Ljg3NmMxNC4wMDIsNy45ODMsMjguNzkzLDE0LjEzOCw0NC4xOSwxOC4zOUwyMjIuMjYsNTEyaDY3LjQ4bDE4LjE0MS02OC4xOTQNCgkJCWMxNS4zOTctNC4yNTMsMzAuMTg3LTEwLjQwNyw0NC4xOS0xOC4zOWw2MC41NzQsMzQuODc2bDQ3LjY0Ni00Ny42NDdsLTM0Ljg3Ni02MC41NzNjNy45ODMtMTQuMDA0LDE0LjEzNy0yOC43OTQsMTguMzg5LTQ0LjE5Mg0KCQkJTDUxMiwyODkuNzR6IE00MTAuMDg2LDI3NS40NThsLTIuNTA0LDEyLjA5OGMtMy45MTMsMTguOTA3LTExLjM2MywzNi44MTctMjIuMTQsNTMuMjMybC02Ljc1NSwxMC4yODlsMzEuNjQ0LDU0Ljk2bC00LjI5Myw0LjI5Mw0KCQkJbC01NC45NjEtMzEuNjQ1bC0xMC4yODksNi43NTVjLTE2LjQxNSwxMC43NzgtMzQuMzI1LDE4LjIyNy01My4yMzIsMjIuMTQxbC0xMi4wOTgsMi41MDVMMjU4Ljk4OSw0NzJoLTUuOTc3bC0xNi40NjktNjEuOTE1DQoJCQlsLTEyLjA5OC0yLjUwNWMtMTguOTA3LTMuOTE0LTM2LjgxNy0xMS4zNjQtNTMuMjMyLTIyLjE0MWwtMTAuMjg5LTYuNzU1bC01NC45NjEsMzEuNjQ1bC00LjI5My00LjI5M2wzMS42NDQtNTQuOTZsLTYuNzU1LTEwLjI4OQ0KCQkJYy0xMC43NzgtMTYuNDE1LTE4LjIyNy0zNC4zMjUtMjIuMTQtNTMuMjMybC0yLjUwNC0xMi4wOThMNDAsMjU4Ljk4OXYtNS45NzdsNjEuOTE0LTE2LjQ3bDIuNTA0LTEyLjA5OQ0KCQkJYzMuOTEyLTE4LjkwNSwxMS4zNjItMzYuODE0LDIyLjE0LTUzLjIzMWw2Ljc1NS0xMC4yODlsLTMxLjY0NC01NC45NjFsNC4yOTMtNC4yOTNsNTQuOTYyLDMxLjY0NWwxMC4yOS02Ljc1Ng0KCQkJYzE2LjQxMy0xMC43NzYsMzQuMzIyLTE4LjIyNSw1My4yMjktMjIuMTM5bDEyLjA5OS0yLjUwNEwyNTMuMDExLDQwaDUuOTc3bDE2LjQ2OSw2MS45MTVsMTIuMDk5LDIuNTA0DQoJCQljMTguOTA3LDMuOTE0LDM2LjgxNiwxMS4zNjMsNTMuMjI5LDIyLjEzOWwxMC4yOSw2Ljc1Nmw1NC45NjItMzEuNjQ1bDQuMjkzLDQuMjkzbC0zMS42NDQsNTQuOTYxbDYuNzU1LDEwLjI4OQ0KCQkJYzEwLjc3OSwxNi40MTYsMTguMjI4LDM0LjMyNiwyMi4xNCw1My4yMzFsMi41MDQsMTIuMDk5TDQ3MiwyNTMuMDExdjUuOTc3TDQxMC4wODYsMjc1LjQ1OHoiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTI1NiwxNDBjLTYzLjk2MywwLTExNiw1Mi4wMzgtMTE2LDExNnM1Mi4wMzcsMTE2LDExNiwxMTZzMTE2LTUyLjAzOCwxMTYtMTE2UzMxOS45NjMsMTQwLDI1NiwxNDB6IE0yNTYsMzMyDQoJCQljLTQxLjkwNiwwLTc2LTM0LjA5My03Ni03NnMzNC4wOTQtNzYsNzYtNzZzNzYsMzQuMDkzLDc2LDc2QzMzMiwyOTcuOTA3LDI5Ny45MDYsMzMyLDI1NiwzMzJ6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=">
        </a>`;
        onDOMReady(function(){
            document.getElementsByClassName('header__list')[0].prepend(open_settings_button);
        })
    }

    var settings_panel = document.getElementById('custon-settings-panel');
    var settings_paginator = document.getElementById('custom-settings-paginator');
    var settings_container = document.getElementById('main-settings-container');
    if (settings_panel){
        var __first_node = settings_paginator.childNodes[0];
        if (__first_node.nodeType === 3) __first_node.remove()
    } else {
        settings_panel = document.createElement('form');
        settings_panel.id = "custon-settings-panel";
        settings_panel.setAttribute('autocomplete', 'off')
        settings_panel.onsubmit = function(e){
            e.preventDefault();
        }
        settings_panel.innerHTML = `
        <div>
            <div class='close' onclick="toggleSettingsPanel()">Закрыть</div>
            <div class='custom-settings-title'>
                <h2>Настройки</h2>
                <span id="script-version">Версия скрипта: ${_SCRIPT_VERSION_}</span><span id='custom-id'>Ваш id: </span>
            </div>
            <div id='custom-settings-status'></div>
            <div id='custom-settings-elements-container'>
                <div id='custom-settings-paginator'>
                </div>
                <div id='main-settings-container'>
                </div>
            </div>
        </div>`;
        onDOMReady(function(){
            document.body.append(settings_panel);
            settings_paginator = document.getElementById('custom-settings-paginator');
            settings_container = document.getElementById('main-settings-container');
            var __first_node = settings_paginator.childNodes[0];
            if (__first_node.nodeType === 3) __first_node.remove(); // Не помню, для чего это нужно
            document.dispatchEvent(new Event('Anime2ruSettingsPanelReady'));
        })
    }

    window.toggleSettingsPanel = function(){
        settings_panel.classList.toggle('visible')
    }
    window.openSettingsTab = function(page_name, subpage_name){
        onSettingsPanelReady(function(){
            for (let button of settings_paginator.children){
                button.classList.toggle('selected', button.getAttribute('name') === 'custom-settings-paginator-' + page_name);
            }
            for (let page of settings_container.children){
                page.classList.remove('visible');
                if (page.getAttribute('name') === 'custom-settings-' + page_name) {
                    page.classList.add('visible');
                    if (!subpage_name) continue;
                    page.querySelectorAll('div').forEach(function(subpage){
                        subpage.classList.toggle('visible', subpage.getAttribute('name') === 'custom-settings-' + page_name + '-' + subpage_name);
                    })
                }
            }
        })
    }

    var result_object = {
        status: function(text, style){
            var status_element = document.getElementById('custom-settings-status');
            if (!status_element) return;
            if (!style) style = 'orange';
            var s = document.createElement('span');
            s.classList.add('settings-status-text')
            s.classList.add(style);
            s.textContent = text;
            s.onanimationend = s.remove
            status_element.innerHTML = '';
            status_element.append(s);
        },
        createSettingsTab: function(page_title, page_name, position, subpages_array){
            onSettingsPanelReady(function(){
                if (!subpages_array.length) return void console.error('[anime2ru-script] Ошибка создания страницы настроек', page_name + ':', 'нет ни одной подстраницы!');
                if (document.getElementsByName('custom-settings-paginator-' + page_name).length) return;

                // Создание кнопки
                var paginator_button = document.createElement('div');
                paginator_button.innerText = page_title;
                paginator_button.setAttribute('name', 'custom-settings-paginator-' + page_name);
                paginator_button.setAttribute('data-position', position);
                paginator_button.onclick = () => {
                    window.openSettingsTab(page_name);
                }
                paginator_button.style.order = position;
                settings_paginator.append(paginator_button)

                // Создание контейнера для вкладок
                var settings_page = document.createElement('div');
                settings_page.setAttribute('name', 'custom-settings-' + page_name);
                // Создание вкладок
                var container_inner = '';
                subpages_array.forEach(function(subpage, index){
                    container_inner += `<div name="custom-settings-${page_name}-${subpage.name}" ${index === 0 ? 'class="visible"' : ''}>${subpage.inner}</div>`
                })
                settings_page.innerHTML += container_inner;

                settings_container.append(settings_page);
            })
        },
        removeSettingsTab: function(page_name){
            onSettingsPanelReady(function(){
                var button = settings_paginator.querySelector('div[name="custom-settings-paginator-' + page_name +'"]');
                if (!button) return;
                button.remove();
                settings_container.querySelector('div[name="custom-settings-' + page_name +'"]').remove();
            })
        }
    }

    result_object.createSettingsTab('Авторизация', 'auth', 1, [
        {
            name: 'login',
            inner: `
            <p>Авторизуйтесь в скрипте для доступа к его функционалу</p>
            <input type='password' id='custom-password' placeholder="Пароль" autocomplete='on'>
            <input type='submit' value="Авторизоваться" onclick="AnimeApi.ANIME_USER.login()">
            <p>Впервые используете скрипт?</p>
            <input type='submit' value="Регистрация" onclick="openSettingsTab('auth', 'register')">`
        },
        {
            name: 'register',
            inner: `
            <p>Регистрация в скрипте</p>
            <p style='font-size: 12px'>· Используя данный скрипт (расширение), Вы даёте согласие на доступ к локальному хранилищу и хранилищу сессии, а также что <b>от имени Вашего аккаунта будут проведены действия для подтверждения его владением</b>, а именно: отправка и удаление оценки под постом форума.</p>
            <p style='font-size: 12px'>· <b>Если Вы - модератор, администратор, или другое лицо, что имеет полномочия на данном сайте</b>, лучше воздержитесь от использования даного скрипта во благо безопасности сайта.</p>
            <p>Придумайте пароль, с помощью которого Вы будете авторизовываться в скрипте. <u><b>Очень желательно</b></u> чтобы он отличался от пароля аккаунта ${_SCRIPT_MODE_}.</p>
            <input type='password' id='custom-register-password' placeholder="Придумайте пароль">
            <input type='password' id='custom-register-password-r' placeholder="Повторите пароль">
            <input type='submit' value="Зарегистрироваться" onclick="AnimeApi.ANIME_USER.register()">
            <p>Уже зарегистрированы?</p>
            <input type='submit' value="Авторизоваться" onclick="openSettingsTab('auth', 'login')">`
        },
        {
            name: 'logout',
            inner: `
            <p>Изменить пароль от аккаунта расширения</p>
            <input type='password' id='custom-old-password' placeholder="Старый пароль">
            <input type='password' id='custom-new-password' placeholder="Новый пароль">
            <input type='submit' value="Отправить" onclick="AnimeApi.ANIME_USER.changePassword()">
            <p></p>
            <p>Разлогиниться в расширении</p>
            <input type='submit' value="Выйти" onclick="AnimeApi.ANIME_USER.logout(); openSettingsTab('auth', 'login')">`
        },
        {
            name: 'need_auth',
            inner: `
                <p>Для получения доступа к остальному функционалу скрипта нужно авторизоваться на ${_SCRIPT_MODE_}, а затем в самом скрипте.</p>
            `
        }
    ])
    result_object.createSettingsTab('Общие функции', 'overall', 2, [
        {
            name: 'main',
            inner: createBooleansPattern([
                [{
                    text: 'Слово "Спойлер" в спойлерах',
                    style: 'spoiler_text',
                },
                {
                    text: 'Сохранение содержимого поля для ввода',
                    boolean: 'overall_input_save',
                },
                {
                    text: 'Поле для быстрой выгрузки изображений',
                    boolean: 'overall_image_uploader',
                }],
                [{
                    text: 'Быстрая панель уведомлений',
                    boolean: 'overall_quick_notif',
                },
                {
                    text: 'Быстрая панель личных сообщений',
                    boolean: 'overall_quick_private',
                }],
                [{
                    text: "Свои подписи для пользователей",
                    style: "show_custom_user_status"
                }]
            ]) + `<input type='submit' onclick="window.location.reload()" value="Применить">`
        },
    ])
    result_object.createSettingsTab('Посты форума', 'threads', 30, [
        {
            name: 'main',
            inner: createBooleansPattern([
                [{
                    text: 'Рамка вокруг Ваших постов',
                    style: 'self_border'
                }],
                [{
                    text: 'Полностью скрывать посты тех, кого Вы игнорируете',
                    style: 'hide_ignored_messages'
                }],
                [{
                    text: 'Рамка создателя темки',
                    style: 'ts_border'
                },
                {
                    text: 'Рамка подписчика',
                    style: 'friend_border'
                },
                {
                    text: 'Рамка того, кто Вас игнорирует',
                    style: 'ignore_border'
                }],
                [{
                    text: 'Показывать свой фон',
                    style: 'self_background'
                },
                {
                    text: 'Показывать фоны других пользователей',
                    style: 'other_backgrounds'
                }]
            ])
        }
    ])
    result_object.createSettingsTab('Стили', 'styles', 3, [
        {
            name: 'styles',
            inner: createBooleansPattern([
                [{
                    text: 'Старый дизайн <a href="https://i.imgur.com/HarSPa1.png" target="_blank">(?)</a>',
                    style: 'old',
                },
                {
                    text: 'Мобильное поле ответов <a href="https://i.imgur.com/EJi1ZgY.gif" target="_blank">(?)</a>',
                    style: 'quick',
                },
                {
                    text: 'Мобильная шапка сайта <a href="https://i.imgur.com/uQufyrs.gif" target="_blank">(?)</a>',
                    style: 'sticky',
                },
                {
                    text: 'Упрощённая главная страница <a href="https://i.imgur.com/Dnb8KLZ.png" target="_blank">(?)</a>',
                    style: 'simple',
                }],
            ]) + 
            `<p></p>
            <p class="small-bottom">Шрифт сайта</p>` +
            _FONTS_.selector()
        }
    ])
    var info_data = {
        'dota2.ru': {
            creator_username: "Руна Дегенерации",
            creator_id: 818100,
            minder_username: "S30N1K",
            minder_id: 474212
        },
        "esportsgames.ru": {
            creator_username: "Руна Дегенерации",
            creator_id: 29,
            minder_username: "S30N1K",
            minder_id:  127
        }
    }
    var current_data = info_data[_SCRIPT_MODE_];
    result_object.createSettingsTab('О скрипте', 'about-script', 1000000, [
        {
            name: 'info',
            inner: `
            <p class="small-bottom">Автор скрипта: <a target="_blank" href="/forum/members/${current_data.creator_id}/">${current_data.creator_username}</a></p>
            <p>Discord: SleepyG11#4128</p>
            <p>Вдохновитель: <a target="_blank" href="/forum/members/${current_data.minder_id}/">${current_data.minder_username}</a></p>
            <p class="small-bottom"><a target="_blank" href="https://github.com/makatymba2001/anime2ru-script">GitHub серверной части скрипта</a></p>
            <p><a target="_blank" href="https://greasyfork.org/ru/scripts/435576-anime2ru-script">Страница скрипта на GreasyFork</a></p>
            <p></p>
            <p style="font-size: 12px">Данный скрипт (расширение) используют для своей работы локальное хранилище и хранилище сессии браузера.</p>
            <p style="font-size: 12px"><b>Автор скрипта не несёт себе цели захватить Вашим или чьим бы то ни было другим аккаунтом в корыстных целях</b>. Весь исходный код открытый и Вы можете самостоятельно изучить его, чтобы убедиться в этом.</p>
            `
        }
    ])

    return result_object;
})();
var _SETTINGS_BACKGROUND_ = (function(){
    var preview_element;
    
    var bg_file = null;
    var bg_link = "";
    var bg_position = 50;
    var bg_brightness = 50;
    var bg_is_hidden = false;

    var result_object = {
        save: function(){
            var data = result_object.config;
            var result_body = {
                type: "link",
                brightness: data.brightness,
                position: data.position,
                hide: data.is_hidden,
                data: data.link
            }
            var executer = function(){
                AnimeApi.SETTINGS_PANEL.status('Обновляю настройки фона...')
                createHttpRequest({
                    method: 'POST',
                    link: _HOST_ + '/updateThreadBg',
                    body: result_body,
                    anime: true,
                    success: function(http){
                        AnimeApi.SETTINGS_PANEL.status('Успешно!', 'green')
                        result_object.config = {
                            link: http.responseText || null
                        }
                        AnimeApi.THREAD_POSTS.update();
                    },
                    error: function(http){
                        AnimeApi.SETTINGS_PANEL.status('Произошла ошибка!', 'red')
                        console.error(http.responseText)
                    }
                })
            }
            if (data.file){
                var reader = new FileReader();
                reader.onloadend = function(){
                    result_body.data = reader.result;
                    result_body.type = 'image';
                    executer();
                }
                reader.readAsDataURL(data.file);
            } else executer();
        },
        remove: function(){
            AnimeApi.SETTINGS_PANEL.status('Удаляю фон...')
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/updateThreadBg',
                body: {type: 'remove'},
                anime: true,
                success: function(http){
                    AnimeApi.SETTINGS_PANEL.status('Успешно!', 'green')
                    result_object.config = {
                        link: null,
                        position: 50,
                        brightness: 50,
                    }
                    AnimeApi.THREAD_POSTS.update();
                },
                error: function(http){
                    AnimeApi.SETTINGS_PANEL.status('Произошла ошибка!', 'red')
                    console.error(http.responseText)
                }
            })
        },
        renderPreview: function(){
            if (!preview_element) preview_element = document.getElementById('custom-settings-bg-preview');
            if (!preview_element) return;
            if (!bg_link) return void preview_element.removeAttribute('style');
            preview_element.style = 'background-image: linear-gradient(to left, rgba(38, 39, 44, '
            + (bg_brightness / 100) + '), rgba(38, 39, 44, ' + (bg_brightness / 100) + ')), url('
            + bg_link + '); background-position-y: ' + bg_position + '%;';
        },
        // Для типизации
        file: bg_file,
        link: bg_link,
        position: bg_position,
        brightness: bg_brightness,
        is_hidden: bg_is_hidden,
        config: {
            file: bg_file,
            link: bg_link,
            position: bg_position,
            brightness: bg_brightness,
            is_hidden: bg_is_hidden,
        }
    }
    Object.defineProperties(result_object, {
        file: {
            set: function(value){
                if (value instanceof File && value.type.includes('image/')) {
                    bg_file = value;
                    bg_link = URL.createObjectURL(value);
                } else if (!value){
                    document.getElementById('custom-settings-bg-file').value = '';
                    bg_file = null;
                    bg_link = document.getElementById('custom-settings-bg-link').value || "";
                } else {
                    AnimeApi.SETTINGS_PANEL.status('Это не изображение!', 'red');
                    document.getElementById('custom-settings-bg-file').value = '';
                    bg_file = null;
                    bg_link = document.getElementById('custom-settings-bg-link').value || "";
                }
                result_object.renderPreview();
            }
        },
        link: {
            get: function(){
                return bg_link
            },
            set: function(value){
                bg_link = value || '';
                result_object.renderPreview();
            }
        },
        position: {
            get: function(){
                return bg_position
            },
            set: function(value){
                bg_position = Math.clamp(0, value, 100);
                result_object.renderPreview();
            }
        },
        brightness: {
            get: function(){
                return bg_brightness
            },
            set: function(value){
                bg_brightness = Math.clamp(0, value, 100);
                result_object.renderPreview();
            }
        },
        is_hidden: {
            get: function(){
                return bg_is_hidden
            },
            set: function(value){
                bg_is_hidden = !!value;
            }
        },
        config: {
            get: function(){
                return {
                    file: bg_file,
                    link: bg_link,
                    brightness: bg_brightness,
                    position: bg_position,
                    is_hidden: bg_is_hidden
                }
            },
            set: function(value){
                var is_contain_elements = !!document.getElementById('custom-settings-bg-file');
                preview_element = document.getElementById('custom-settings-bg-preview'); 
                if (value.link !== undefined) {
                    bg_file = null;
                    bg_link = value.link;
                    if (is_contain_elements){
                        document.getElementById('custom-settings-bg-file').value = '';
                        document.getElementById('custom-settings-bg-link').value = bg_link;
                    }
                }
                if (value.brightness || value.brightness == 0){
                    bg_brightness = +value.brightness
                    if (is_contain_elements){
                        document.getElementById('custom-settings-bg-br-range').value = bg_brightness;
                    }
                }
                if (value.position || value == 0){
                    bg_position = +value.position;
                    if (is_contain_elements){
                        document.getElementById('custom-settings-bg-pos-range').value = bg_position;
                    }
                }
                if (value.is_hidden !== undefined){
                    bg_is_hidden = !!value.is_hidden;
                    if (is_contain_elements){
                        document.getElementById('custom-settings-bg-hide').checked = bg_is_hidden;
                    }
                }
                result_object.renderPreview();
            }
        }
    })
    return result_object;
})();

var _THREAD_POSTS_ = (function(){   
    var theme_creator_id = null;
    var posts = [];
    var posts_objects = [];
    var posts_nickname_map = {};
    var posts_user_id_map = {};
    var is_private = document.location.pathname.startsWith('/forum/conversation/');
    var result_object = {
        update: function(){
            onDOMReady(function(){
                posts_nickname_map = {};
                posts_user_id_map = {};
                var posts_parent = document.getElementById('message-list');
                if (!posts_parent) return;
                posts = is_private ? Array.from(posts_parent.children) : posts_parent.querySelectorAll('div.forum-theme__item.forum-theme__block');
                posts_objects = [];
                posts.forEach(function(post){
                    var post_object = {
                        self: false,
                        friend: false,
                        ignore: false,
                        theme_creator: false,
                        element: post,
                        user_avatar_element: post.querySelector('img'),
                        user_nickname: post.querySelector('a').textContent.trim(),
                        user_id: +post.children[0].className.match(/user-block-(.*)$/)[1],
                        user_link: post.querySelector('a').getAttribute('href'),
                        buttons_container: post.querySelector('.forum-theme__item-dots-block'),
                        background: null,
                        ignore_background: false,
                        ignore_background_button: post.querySelector('a.ignore-background-button'),
                        custom_user_status_element: post.querySelector('.forum-theme__item-status.custom')
                    }

                    if (AnimeApi.ANIME_USER.user_id){
                        if (!post_object.custom_user_status_element){
                            var status_element = document.createElement('p');
                            status_element.className = "forum-theme__item-status custom";
                            status_element.textContent = 'Добавить подпись...';
                            status_element.title = 'Даблклик для редактирования'
                            status_element.ondblclick = function(e){
                                result_object.toggleCustomUserStatus(e, post_object.user_id)
                            }
                            post_object.element.querySelector('.forum-theme__item-left-mob').append(status_element);
                            post_object.custom_user_status_element = status_element;
                        }
                        if (AnimeApi.ANIME_USER.user_id && post_object.buttons_container && !post_object.ignore_background_button){
                            var ignore_bg_button = document.createElement('a');
                            ignore_bg_button.classList.add('ignore-background-button');
                            ignore_bg_button.classList.toggle('ignored', post_object.ignore_background);
                            ignore_bg_button.href = "javascript:void(0)";
                            ignore_bg_button.onclick = _THREAD_POSTS_.toggleIgnore.bind(null, post_object.user_id);
                            post_object.buttons_container.prepend(ignore_bg_button);
                            post_object.ignore_background_button = ignore_bg_button;
                        }
                    } else {
                        if (post_object.custom_user_status_element){
                            post_object.custom_user_status_element.remove();
                            post_object.custom_user_status_element = null;
                        }
                        if (post_object.ignore_background_button){
                            post_object.ignore_background_button.remove();
                            post_object.ignore_background_button = null;
                        }
                    }

                    posts_objects.push(post_object);
                    var array_to_fill = posts_user_id_map[post_object.user_id];
                    if (!array_to_fill){
                        array_to_fill = [post_object];
                        posts_user_id_map[post_object.user_id] = array_to_fill;
                        posts_nickname_map[post_object.user_nickname] = array_to_fill;
                    } else array_to_fill.push(post_object);
                })
                result_object.render();
                onClientUserReady(function(){
                    createHttpRequest({
                        method: 'POST',
                        link: _HOST_ + '/getThreadsBg',
                        body: {
                            id: AnimeApi.CLIENT_USER.id,
                            ids: Object.keys(posts_user_id_map)
                        },
                        anime: true,
                        success: function(http){
                            var bg_data = JSON.parse(http.responseText);
                            posts_objects.forEach(function(post){
                                let d = bg_data[post.user_id];
                                if (!d) return;
                                post.background = d.bg;
                                post.ignore_background = d.ignored;
                            })
                            result_object.render();
                        }
                    })
                })
            })
        },
        render: function(){
            posts_objects.forEach(function(post_object){
                if (theme_creator_id && theme_creator_id == post_object.user_id){
                    post_object.theme_creator = true;
                    post_object.user_avatar_element.classList.add('custom-ts')
                }
                if (AnimeApi.FRIENDS_LIST.contain(post_object.user_id)){
                    post_object.friend = true;
                    post_object.user_avatar_element.classList.add('custom-friend')
                }
                if (AnimeApi.IGNORE_LIST.contain(post_object.user_id)){
                    post_object.ignore = true;
                    post_object.user_avatar_element.classList.add('custom-ignore')
                }
                if (AnimeApi.CLIENT_USER.is_authorized && post_object.user_id == AnimeApi.CLIENT_USER.id) {
                    post_object.element.classList.add('self')
                }
                if (!post_object.background || post_object.ignore_background){
                    post_object.element.removeAttribute('style');
                } else {
                    post_object.element.style = post_object.background;
                }
                if (post_object.ignore_background_button){
                    post_object.ignore_background_button.classList.toggle('ignored', post_object.ignore_background)
                }
                if (post_object.custom_user_status_element){
                    var status = AnimeApi.ANIME_USER.custom_users_status[post_object.user_id];
                    if (!status) status = post_object.custom_user_status_element.classList.contains('editable') ? "" : "Добавить подпись..."
                    post_object.custom_user_status_element.textContent = status;
                }
            })
        },
        getIds: function(){
            return Object.keys(posts_user_id_map)
        },
        getNicknames: function(){
            return Object.keys(posts_nickname_map)
        },
        getLinks: function(){
            return Object.values(posts_nickname_map).map(function(posts){
                return posts[0].user_link
            })
        },

        toggleIgnore: function(user_id){
            if (user_id == AnimeApi.CLIENT_USER.id) return
            var user_posts = posts_user_id_map[user_id];
            if (!user_posts) return;
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/toggleThreadBgIgnore',
                body: {
                    id: user_id
                },
                anime: true,
                success: function(){
                    user_posts.forEach(function(post_object){
                        post_object.ignore_background = !post_object.ignore_background;
                    })
                    result_object.render();
                }
            })
        },

        toggleCustomUserStatus: function(e, user_id){
            e.preventDefault();
            var status_element = e.target;
            status_element.classList.toggle('editable');
            status_element.contentEditable = status_element.classList.contains('editable').toString();
            if (status_element.classList.contains('editable')){
                // Переходим в режим редактирования, добавляя placeholder
                if (status_element.textContent == 'Добавить подпись...') status_element.textContent = '';
                return void status_element.focus();
            }
            status_element.blur();
            let status = status_element.textContent.trim();
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/updateCustomUserStatus',
                body: {
                    id: user_id,
                    status: status
                },
                anime: true,
                success: function(http){
                    if (status){
                        AnimeApi.ANIME_USER.custom_users_status[user_id] = status;
                    } else delete AnimeApi.ANIME_USER.custom_users_status[user_id]
                    AnimeApi.THREAD_POSTS.render();
                }
            })
        }
    }

    onClientUserReady(function(){
        var theme_creator_object = document.getElementsByClassName('forum-theme__top-block-user')[0];
        if (theme_creator_object) {
            theme_creator_id = /\.(.*)\/$/.exec(theme_creator_object.getAttribute('href'));
            theme_creator_id = theme_creator_id ? +theme_creator_id[1] : null;
        };
        result_object.update();
        AnimeApi.IGNORE_LIST.fetch();
    })

    document.addEventListener('Anime2ruFriendsListUpdate', result_object.render)
    document.addEventListener('Anime2ruIgnoreListUpdate', result_object.render)

    return result_object
})();

var _SUPER_IGNORE_ = (function(){
    var user_search_timer;
    
    var ignore_is_active = false;
    var ignore_use_ignore_list = false;
    var ignore_users_list = [];
    var ignore_include = [];
    var ignore_exclude = [];

    var processArray = function(value){
        if (typeof value === 'string') return value.split(',').map(function(element){
            // Другие проверки которые там нужны
            return element.trim();
        })
        if (Array.isArray(value)) return ignore_exclude = value.filter(function(element){
            return element
        }).map(function(element){
            return String(element)
        })
        return [];
    }

    var result_object = {
        render: function(){
            let theme_include = new RegExp(['\n'].concat(AnimeApi.ANIME_USER.super_ignore.include).join('|').replace(/\(|\)|\[|\]/, ''), 'i');
            let theme_exclude = new RegExp(['\n'].concat(AnimeApi.ANIME_USER.super_ignore.exclude).join('|').replace(/\(|\)|\[|\]/, ''), 'i');
            let ignore_nickname_array = AnimeApi.ANIME_USER.super_ignore.users_list.concat();
            if (AnimeApi.ANIME_USER.super_ignore.use_ignore_list) ignore_nickname_array = ignore_nickname_array.concat(AnimeApi.IGNORED_LIST.nicknames());

            document.querySelectorAll('.forum .forum__block').forEach(function(element){
                element.parentElement.parentElement.removeAttribute('style');
                if (!AnimeApi.ANIME_USER.super_ignore.is_active) return;
                let element_data = element.textContent.split('\n');
                let is_main_page = !!element_data[2].replace(/\s{2,}/g, '');
                let nickname = '', theme_name = '';
                if (is_main_page){
                    theme_name = element_data[2].trim();
                    nickname = element_data[5].trim().split('              ')[0];
                } else {
                    theme_name = element_data[3].trim();
                    nickname = element_data[12].trim();
                }
                if (theme_include.test(theme_name) && !theme_exclude.test(theme_name)) element.parentElement.parentElement.style.display = 'none';
                if (ignore_nickname_array.includes(nickname)) element.parentElement.parentElement.style.display = 'none';
            })

            document.querySelectorAll('.forum-page__list .forum-page__item-avtar').forEach(function(element){
                let theme_name_object = element.querySelector('.forum-page__item-avtar-theme.text-clip');
                if (theme_name_object.getAttribute('data-deleted-name')){
                    theme_name_object.innerText = theme_name_object.getAttribute('data-deleted-name');
                    theme_name_object.removeAttribute('data-deleted-name');
                }
                if (!AnimeApi.ANIME_USER.super_ignore.is_active) return;
                let theme_name = theme_name_object.innerText
                if (theme_include.test(theme_name) && !theme_exclude.test(theme_name)) {
                    theme_name_object.setAttribute('data-deleted-name', theme_name_object.innerText);
                    theme_name_object.innerText = '[ТЕМА СКРЫТА]';
                    theme_name_object.removeAttribute('href');
                }
            })

            document.querySelectorAll('.forum-section__list .forum-section__item').forEach(function(element){
                element.removeAttribute('style');
                if (!AnimeApi.ANIME_USER.super_ignore.is_active) return;
                let theme_name_element = element.querySelector('.forum-section__title');
                if (!theme_name_element) return;
                let theme_name = theme_name_element.innerText;
                let nickname = element.querySelector('img').getAttribute('alt');
                if (theme_include.test(theme_name) && !theme_exclude.test(theme_name)) element.style.display = 'none';
                if (ignore_nickname_array.includes(nickname)) element.style.display = 'none';
            })
        },
        searchUser: function(){
            clearTimeout(user_search_timer);
            document.getElementById('users-ignore-query').innerHTML = '';
            user_search_timer = setTimeout(function(){
                var input_element = document.getElementById('custom-super-ignore-list');
                var input_index = input_element.selectionEnd;
                var input_text = input_element.value;
                var nickname_start = input_index;
                
                while(nickname_start > -1 && input_text[nickname_start - 1] !== ','){
                    nickname_start--
                }
                var nickname_end = input_index;
                while(nickname_end < input_text.length && input_text[nickname_end] !== ','){
                    nickname_end++
                }
                var query = input_text.substring(nickname_start, nickname_end).trim();
                if (!query || query.length < 2) return;
                createHttpRequest({
                    link: "/forum/search?type=user&keywords=" + query + "&sort_by=username",
                    success: function(http){
                        var _document = (new DOMParser()).parseFromString(http.responseText, 'text/html');
                        var items =  _document.querySelectorAll('.forum-section__item');
                        var df = document.createDocumentFragment();
                        for (let i = 1; i < 11; i++){
                            var item = items[i];
                            if (!item) break;
                            var element = document.createElement('div');
                            var user_name = item.querySelector('.forum-section__title').textContent.trim()
                            element.onclick = result_object.appyUser.bind(result_object, nickname_start, nickname_end, user_name)
                            element.innerHTML = `<img src="${item.querySelector('img').src}">${user_name}`;
                            df.append(element)
                        }
                        document.getElementById('users-ignore-query').appendChild(df);
                    }
                })
            }, 750)
        },
        appyUser: function(start_index, end_index, name){
            if (start_index < 0) start_index = 0;
            var input_element = document.getElementById('custom-super-ignore-list');
            var text = input_element.value;
            text = text.substring(0, start_index) + ' ' + name + text.substring(end_index);
            input_element.value = text
            result_object.users_list = text;
            document.getElementById('users-ignore-query').innerHTML = '';
            input_element.focus();
            input_element.selectionStart = start_index + name.length + 1;
            input_element.selectionEnd = start_index + name.length + 1;
        },
        save: function(){
            var result_config = result_object.config;
            AnimeApi.SETTINGS_PANEL.status('Сохранение настроек...')
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/updateThreadSuperIgnore',
                body: {
                    use_super_ignore: result_config.is_active,
                    ignored_to_super: result_config.use_ignore_list,
                    users: result_config.users_list,
                    include: result_config.include,
                    exclude: result_config.exclude
                },
                anime: true,
                success: function(http){
                    AnimeApi.ANIME_USER.super_ignore = result_config;
                    AnimeApi.SETTINGS_PANEL.status('Успешно!', 'green')
                    result_object.render();
                },
                error: function(http){
                    AnimeApi.SETTINGS_PANEL.status('Произошла ошибка!', 'red')
                }
            })
        },
        // Для типизации
        is_active: false,
        use_ignore_list: false,
        users_list: [],
        include: [],
        exclude: [],
        config: {
            is_active: false,
            users_list: [],
            use_ignore_list: false,
            include: [],
            exclude: [],
        }
    }

    Object.defineProperties(result_object, {
        is_active: {
            get: function(){
                return ignore_is_active || false;
            },
            set: function(value){
                ignore_is_active = !!value;
            }
        },
        use_ignore_list: {
            get: function(){
                return ignore_use_ignore_list || false;
            },
            set: function(value){
                ignore_use_ignore_list = !!value;
            }
        },
        users_list: {
            get: function(){
                return ignore_users_list || [];
            },
            set: function(value){
                if (typeof value === 'string'){
                    ignore_users_list = value.split(',').map(function(element){
                        // Другие проверки которые там нужны
                        return element.trim();
                    })
                } else if (Array.isArray(value)){
                    ignore_users_list = value.filter(function(element){
                        return element
                    }).map(function(element){
                        return String(element)
                    })
                } else {
                    ignore_users_list = []
                }
            }
        },
        include: {
            get: function(){
                return ignore_include || [];
            },
            set: function(value){
                ignore_include = processArray(value);
            }
        },
        exclude: {
            get: function(){
                return ignore_exclude || [];
            },
            set: function(value){
                ignore_exclude = processArray(value);
            }
        },
        config: {
            get: function(){
                return {
                    is_active: ignore_is_active,
                    use_ignore_list: ignore_use_ignore_list,
                    users_list: ignore_users_list,
                    include: ignore_include,
                    exclude: ignore_exclude,
                }
            },
            set: function(value){
                result_object.is_active = value.is_active;
                result_object.use_ignore_list = value.use_ignore_list;
                result_object.users_list = value.users_list
                result_object.include = value.include
                result_object.exclude = value.exclude
                if (!document.getElementById('custom-super-ignore')) return;
                document.getElementById('custom-super-ignore').checked = ignore_is_active;
                document.getElementById('custom-ignore-users-for-super').checked = ignore_use_ignore_list;
                document.getElementById('custom-super-ignore-list').value = ignore_users_list.join(', ');
                document.getElementById('custom-super-ignore-include').value = ignore_include.join(', ');
                document.getElementById('custom-super-ignore-exclude').value = ignore_exclude.join(', ');
            }
        }
    })
    
    return result_object;
})();

var _FRIENDS_LIST_ = (function(){
    var friends_list_array = sessionStorage.getItem('anime_friends_list');
    if (!friends_list_array) {
        friends_list_array = [];
        onClientUserReady(function(){
            if (!AnimeApi.CLIENT_USER.is_authorized) return;
            createHttpRequest({
                method: 'POST',
                link: AnimeApi.CLIENT_USER.link + 'followers/',
                body: {},
                success: function(http){
                    var ddoc = (new DOMParser()).parseFromString(http.responseText, 'text/html');
                    var pages_count = 1;
                    if (ddoc.getElementsByClassName('pagination')[0]){
                        pages_count = ddoc.getElementsByClassName('pagination')[0].getAttribute('data-pages') || 1;
                    }
                    var friend_users = [];
                    ddoc.querySelectorAll('.settings-page__block-splitter--item.settings-page__block-header-splitter').forEach(e => {
                        friend_users.push(e.getAttribute('href').substring(6))
                    })
                    var i = 1;
                    var friendEmitter = function(){
                        if (++i > pages_count){
                            sessionStorage.setItem('anime_friends_list', JSON.stringify(friend_users))
                            friends_list_array = friend_users;
                            document.dispatchEvent(new Event('Anime2ruFriendsListUpdate'))
                        } else {
                            createHttpRequest({
                                method: 'POST',
                                link: AnimeApi.CLIENT_USER.link + 'followers/page-' + i,
                                body: {},
                                success: function(http){
                                    (new DOMParser()).parseFromString(http.responseText, 'text/html')
                                    .querySelectorAll('.settings-page__block-splitter--item.settings-page__block-header-splitter')
                                    .forEach(e => {
                                        friend_users.push(e.getAttribute('href').substring(6))
                                    })
                                    friendEmitter();
                                }
                            })
                        }
                    }
                    friendEmitter()
                }
            })
        })
    } else {
        friends_list_array = JSON.parse(friends_list_array);
    }
    return {
        contain: function(id){
            return friends_list_array.find(e => {
                return e.indexOf('.' + id + '/') > -1
            })
        }
    };
})();
var _IGNORED_LIST_ = (function(){
    var ignored_list = JSON.parse(sessionStorage.anime_ignored_list || '[]');
    var ignored_nicknames_list = JSON.parse(sessionStorage.anime_ignored_nicknames || '[]');
    if (!sessionStorage.anime_ignored_list || !sessionStorage.anime_ignored_nicknames){
        createHttpRequest({
            method: 'POST',
            link: '/forum/settings/ignorelist/',
            body: {},
            success: function(http){
                var _document = (new DOMParser()).parseFromString(http.responseText, 'text/html');
                var pages_count = 1;
                if (_document.getElementsByClassName('pagination')[0]){
                    pages_count = _document.getElementsByClassName('pagination')[0].getAttribute('data-pages') || 1;
                }
                var ignor_users = [];
                var ignor_nicknames = [];
                _document.querySelectorAll('.settings-page__block-splitter--item.settings-page__block-header-splitter').forEach(e => {
                    ignor_users.push(e.getAttribute('href').substring(6));
                    ignor_nicknames.push(e.querySelector('.settings-page__ignored-user-info--row').innerText.trim())
                })
                var i = 1;
                var ignorEmitter = function(){
                    if (++i > pages_count){
                        ignored_list = ignor_users;
                        ignored_nicknames_list = ignor_nicknames;
                        sessionStorage.setItem('anime_ignored_list', JSON.stringify(ignor_users))
                        sessionStorage.setItem('anime_ignored_nicknames', JSON.stringify(ignor_nicknames))
                        return void _SUPER_IGNORE_.render();
                    }
                    createHttpRequest({
                        method: 'POST',
                        link: '/forum/settings/ignorelist/page-' + i,
                        body: {},
                        success: function(http){
                            (new DOMParser()).parseFromString(http.responseText, 'text/html').querySelectorAll('.settings-page__block-splitter--item.settings-page__block-header-splitter').forEach(e => {
                                ignor_users.push(e.getAttribute('href').substring(6));
                                ignor_nicknames.push(e.querySelector('.settings-page__ignored-user-info--row').innerText.trim())
                            })
                            ignorEmitter();
                        }
                    })
                }
                ignorEmitter()
            }
        })
    }
    return {
        contain: function(id){
            return friends_list_array.find(e => {
                return e.indexOf('.' + id + '/') > -1
            })
        },
        nicknames: function(){
            return ignored_nicknames_list;
        }
    };
})();
var _IGNORE_LIST_ = (function(){
    var session_ignore_array = JSON.parse(sessionStorage.getItem('anime_ignore_list') || "[]");
    var checked_ignore_array = JSON.parse(sessionStorage.getItem('anime_ignore_list_check') || "[]");
    return {
        fetch: function(){
            let processing_array = AnimeApi.THREAD_POSTS.getLinks().filter(function(link){
                return !checked_ignore_array.includes(link)
            });
            let ignoreEmitter = function(){
                let link_to_proceed = processing_array.shift();
                if (!link_to_proceed){
                    clearInterval(ignoreEmitter);
                    sessionStorage.setItem('anime_ignore_list', JSON.stringify(session_ignore_array))
                    sessionStorage.setItem('anime_ignore_list_check', JSON.stringify(checked_ignore_array))
                    document.dispatchEvent(new Event('Anime2ruIgnoreListUpdate'))
                } else {
                    let id_to_proceed = link_to_proceed.match(/.([0-9]{1,})\/$/)?.at(1)
                    createHttpRequest({
                        method: 'POST',
                        link: '/forum/api/user/makeWallPost',
                        body: {uid: id_to_proceed, content: "###".repeat(257), replyTo: null},
                        success: function(http){
                            if (JSON.parse(http.responseText).status === 'ignoredByUser') {
                                session_ignore_array.push(link_to_proceed);
                            }
                            checked_ignore_array.push(link_to_proceed);
                            ignoreEmitter()
                        },
                        error: ignoreEmitter
                    })
                }
            };
            ignoreEmitter()
        },
        contain: function(id){
            return session_ignore_array.find(e => {
                return e.indexOf('.' + id + '/') > -1
            })
        }
    }
})();

var _SMILE_SECTIONS_ = (function(){
    var sections_data = {};
    var selected_id = 0;
    var bttv_search_timer;
    var bttv_scroll = true;

    var new_section_order_preview;

    var result_object = {
        deleteOptions: function(){
            return `<option value=0>Выберите раздел</option>` + 
            Object.values(sections_data).map(function(section){
                return `<option value="${section.id}">${section.name}</option>`
            }).join('')
        },
        creatingPreview: function(rebuild){
            var df = document.createDocumentFragment();
            AnimeApi.ANIME_USER.smile_sections.forEach(function(section, index){
                var element = document.createElement('div');
                element.title = section.name;
                element.innerHTML = '<img src="' + section.image + '"/>';
                element.style.order = ++index;
                element.onclick = function(){
                    var new_p = +element.style.order;
                    var prev_p = +new_section_order_preview.style.order;
                    var p = new_p;
                    if (new_p <= prev_p) p = new_p - 1;
                    result_object.setCreatingPreviewOrder(p);
                }
                df.append(element);
            })
            if (!new_section_order_preview || rebuild){
                new_section_order_preview = document.createElement('div');
                new_section_order_preview.id = "custom-smile-section-new-section-preview";
                new_section_order_preview.style.order = 0;
                new_section_order_preview.innerHTML = '<img src="https://dota2.ru/img/forum/emoticons/justsmile.png?386">';
            }
            df.append(new_section_order_preview);
            document.getElementById('custom-smile-section-order-preview').innerHTML = '';
            document.getElementById('custom-smile-section-order-preview').appendChild(df);
        },
        setCreatingPreviewOrder: function(order){
            new_section_order_preview.style.order = order || 0;
            document.getElementById('custom-smile-section-order').value = order || 0;
        },
        setCreatingPreviewImage: function(link){
            new_section_order_preview.children[0].src = link || "https://dota2.ru/img/forum/emoticons/justsmile.png?386"
        },
        setCreatingPreviewOrderByInput: function(order){
            new_section_order_preview.style.order = order || 0;
        },
        selectToDelete: function(section_id){
            let section_data = sections_data[section_id];
            if (!section_data && section_id != 0) return;
            selected_id = section_id;
            document.getElementById('custom-smile-section_delete').value = section_id;
            if (section_id == 0){
                document.getElementById('custom-smile-section_delete-icon').removeAttribute('src');
            } else {
                document.getElementById('custom-smile-section_delete-icon').src = section_data.image
            }
        },

        update: function(rebuild){
            sections_data = {};
            AnimeApi.ANIME_USER.smile_sections.forEach(function(section){
                sections_data[section.id] = section;
            })
            selected_id = 0;
            if (!document.getElementById('custom-smile-section_delete')) return;
            result_object.creatingPreview(rebuild);
            document.getElementById('custom-smile-section_delete').innerHTML = result_object.deleteOptions();
            document.getElementById('custom-smile-section_delete-icon').removeAttribute('src');
            document.getElementById('custom-smile-section-order').value = 0;
        },

        delete: function(){
            if (selected_id == 0) return;
            AnimeApi.SETTINGS_PANEL.status('Удаляю раздел смайлов...')
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/deleteSmileSection',
                body: {
                    id: selected_id
                },
                anime: true,
                success: function(){
                    AnimeApi.SETTINGS_PANEL.status('Успешно!', 'green')
                    var arr = AnimeApi.ANIME_USER.smile_sections
                    arr.splice(arr.findIndex(function(section){
                        return section.id == selected_id;
                    }), 1)
                    result_object.update();
                    result_object.updateAllSmileSections();
                },
                error: function(){
                    AnimeApi.SETTINGS_PANEL.status('Произошла ошибка!', 'red')
                }
            })
        },
        create: function(){
            var name = document.getElementById('custom-smile-section-name').value;
            if (!name) {
                return void AnimeApi.SETTINGS_PANEL.status('Не указано имя раздела!', 'red')
            };
            var image = document.getElementById('custom-smile-section-image').value;
            if (!image) image = "https://dota2.ru/img/forum/emoticons/justsmile.png?386";
            var order = document.getElementById('custom-smile-section-order').value || 0;
            AnimeApi.SETTINGS_PANEL.status('Создаю раздел смайлов...')
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/createSmileSection',
                body: {
                    name, image, order
                },
                anime: true,
                success: function(http){
                    AnimeApi.SETTINGS_PANEL.status('Успешно!', 'green')
                    document.getElementById('custom-smile-section-name').value = '';
                    document.getElementById('custom-smile-section-image').value = '';
                    AnimeApi.ANIME_USER.smile_sections = JSON.parse(http.responseText);
                    result_object.update(true);
                    result_object.updateAllSmileSections();
                },
                error: function(){
                    AnimeApi.SETTINGS_PANEL.status('Произошла ошибка!', 'red')
                }
            })
        },

        buildSmileSection: function(smile_panel, section_data){
            if (smile_panel.querySelector(`*[data-cat="${section_data.id}"]`)) return;
            var section_button = document.createElement('li');
            section_button.classList.add('smiles-panel__tabs-tab');
            section_button.innerHTML = `
            <a href="#smile-cat-${section_data.id}" title="${section_data.name}" data-cat="${section_data.id}" style="padding: 3px 10px;">
                <img data-cat="9" src="${section_data.image}" style="width: 24px; vertical-align: middle;">
            </a>`;
            section_button.onclick = (section_data.opened || function(){}).bind(null, smile_panel);
            smile_panel.children[0].append(section_button)
            var section_content = document.createElement('div');
            section_content.classList.add("smiles-panel__tabs-content");
            section_content.id = 'smile-cat-' + section_data.id;
            section_content.innerHTML = section_data.inner;
            smile_panel.children[1].append(section_content);
        },
        buildSmileSections: function(smiles_panel){
            result_object.buildSmileSection(smiles_panel, {
                id: 1000,
                name: 'BetterTV',
                image: 'https://i.imgur.com/bmnbvsD.png',
                inner: `
                <div class='bttv-search'>
                    <input type='text' oninput="AnimeApi.SMILE_SECTIONS.bttvSearch(this)" placeholder="Поиск смайлов BTTV. Минимум 3 символа.">
                    <input type='number' oninput="AnimeApi.SMILE_SECTIONS.bttvSearch(this)" placeholder="Смайлов на одной странице" min=1 max=99 style='width:370px'>
                    <input type='number' oninput="AnimeApi.SMILE_SECTIONS.bttvSearch(this)" placeholder="Страница" min=1 style='width:120px'>
                </div>
                <p>Крутите колёсико вниз для дополнительных результатов</p>
                <div class='most-used-container bttv'></div>
                `,
                opened: result_object.bttvDefaultSearch
            })
            // Пока убираю, подумаю надо ли возвращать это
            // result_object.buildSmileSection(smiles_panel, {
            //     id: 1001,
            //     name: 'Anime2.ru',
            //     image: 'https://dota2.ru/img/forum/forum-icons/6.png',
            //     inner: `
            //     <div class='bttv-search'>
            //         <input type='text' placeholder="Ссылка на изображение смайла" id='anime2ru-smile-link'>
            //         <input type='text' placeholder="Краткое название смайла" id='anime2ru-smile-title'>
            //     <div class='input' onclick="AnimeApi.SMILE_SECTIONS.createAnime2ruSmile(this)">Создать смайл</div>
            //     </div>
            //     <div class="create-smile-status-text"></div>
            //     <div class='most-used-container'></div>
            //     `,
            //     opened: result_object.insertAnime2ruSmiles
            // })
            result_object.buildSmileSection(smiles_panel, {
                id: 1002,
                name: 'Пепки с табличками',
                image: 'https://i.imgur.com/zlFgYtQ.gif',
                inner: "<div class='most-used-container with-sections'></div>",
                opened: result_object.insertTablets
            })
            Object.values(sections_data).forEach(function(section){
                result_object.buildSmileSection(smiles_panel, Object.assign(section, {
                    inner: "<div class='most-used-container'>",
                    opened: result_object.getSectionSmiles.bind(result_object, section.id)
                }))
            })
        },

        bttvDefaultSearch: function(smile_panel){
            var f = smile_panel.querySelector('.bttv-search input');
            if (f && !f.value) result_object.bttvSearch(smile_panel)
        },
        bttvSearch: function(smile_panel){
            if (smile_panel.tagName === 'INPUT') smile_panel = smile_panel.parentElement.parentElement.parentElement.parentElement;
            clearTimeout(bttv_search_timer);
            bttv_search_timer = setTimeout(result_object.bttvSearchExecuter.bind(result_object, smile_panel), 750);
        },
        bttvSearchExecuter: function(smile_panel){
            var inputs = smile_panel.querySelectorAll('.bttv-search input');
            var query = inputs[0].value;
            if (query && query.length < 3) return;
            var count = Math.clamp(1, inputs[1].value || 99, 99);
            var offset = count * Math.max(0, inputs[2].value - 1) || 0;
            let link = function(value, offset, count){
                if (value){
                    return "https://api.betterttv.net/3/emotes/shared/search?query=" + value +"&offset="+ offset +"&limit=" + count;
                } else{
                    return "https://api.betterttv.net/3/emotes/shared/top?offset="+ offset +"&limit=" + count;
                }
            }
            createHttpRequest({
                link: link(query, offset, count),
                success: function(http){
                    var smiles_target = smile_panel.querySelector('#smile-cat-1000 .most-used-container');
                    result_object.bttvSmilesInsert(smiles_target, http.responseText, true)
                    smiles_target.onwheel = function(e){
                        if (e.deltaY < 1) return;
                        if (smiles_target.scrollHeight - smiles_target.scrollTop - smiles_target.clientHeight > 15) return;
                        e.preventDefault();
                        if (!bttv_scroll) return;
                        bttv_scroll = false;
                        offset += count;
                        createHttpRequest({
                            link: link(query, offset, count),
                            success: function(http){
                                result_object.bttvSmilesInsert(smiles_target, http.responseText);
                                setTimeout(function(){
                                    bttv_scroll = true;
                                }, 750)
                            }
                        })
                    }
                }
            })
        },
        bttvSmilesInsert: function(container, data, replace){
            var bttv_response = JSON.parse(data);
            var smile_result = '';
            bttv_response.forEach(function(smile){
                if (smile.emote) smile = smile.emote;
                smile_result += `
                <div class="smiles-panel__smile-content" style="display: inline-block; margin: 3px;">
                    <a href="javascript:tinyMCE.activeEditor.plugins.smileys.insert(':${smile.code}:', 'https://cdn.betterttv.net/emote/${smile.id}/2x')"
                    data-shortcut=":${smile.code}:" title=":${smile.code}:">
                        <img src='https://cdn.betterttv.net/emote/${smile.id}/2x.${smile.imageType}' style="max-height: 32px; max-width: 32px;">
                    </a>
                </div>`;
            })
            replace ? (container.innerHTML = smile_result) : (container.innerHTML += smile_result);
        },

        insertTablets: function(smile_panel){
            createHttpRequest({
                link: _HOST_ + '/getAnime2ruSmileTablets',
                success: function(http){
                    var section_response = JSON.parse(http.responseText).smiles;
                    var section_result = '';
                    section_response.forEach(function(smile_sect){
                        var smile_sect_result = '';
                        smile_sect.forEach(function(smile){
                            smile_sect_result += `
                            <div class="smiles-panel__smile-content" style="display: inline-block; margin: 3px;">
                                <a href="javascript:tinyMCE.activeEditor.plugins.smileys.insert('${smile.title}', '${smile.link}')"
                                data-shortcut="${smile.title}" title="${smile.title}">
                                    <img src='${smile.link}' style="max-height: 32px; max-width: 32px;">
                                </a>
                            </div>`;
                        })
                        smile_sect_result = '<div class="most-used-container-section">' + smile_sect_result + '</div>';
                        section_result += smile_sect_result;
                    })
                    smile_panel.querySelector("#smile-cat-1002 .most-used-container").innerHTML = section_result;
                }
            })
        },

        insertAnime2ruSmiles: function(smile_panel){
            createHttpRequest({
                link: _HOST_ + '/getAnime2ruSmiles',
                success: function(http){
                    var section_response = JSON.parse(http.responseText).smiles;
                    var section_result = '';
                    section_response.forEach(function(smile){
                        section_result += `
                        <div class="smiles-panel__smile-content" style="display: inline-block; margin: 3px;">
                            <a href="javascript:tinyMCE.activeEditor.plugins.smileys.insert('${smile.title}', '${smile.link}')"
                            data-shortcut="${smile.title}" title="${smile.title}">
                                <img src='${smile.link}' style="max-height: 32px; max-width: 32px;">
                            </a>
                        </div>`;
                    })
                    smile_panel.querySelector("#smile-cat-1001 .most-used-container").innerHTML = section_result;
                }
            })
        },
        createAnime2ruSmile: function(button){
            let link_input = button.parentElement.children[0];
            let title_input = button.parentElement.children[1];
            let error_input = button.parentElement.parentElement.children[1];
            error_input.innerHTML = '';
            let title = title_input.value;
            let link = link_input.value;
            if (!link) return void result_object.creatingSmileStatus(button, "Не указана ссылка", 'red');
            if (!title) return void result_object.creatingSmileStatus(button, "Не указано название смайла", 'red');
            link_input.value = '';
            title_input.value = ''
            title = ':' + title + ':';
            result_object.creatingSmileStatus(button, "Создаю смайл...", 'red');
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/createAnime2ruSmile',
                body: {
                    link: link,
                    title: title,
                },
                anime: true,
                success: function(http){
                    result_object.creatingSmileStatus(button, "Успешно!", 'green');
                    document.querySelectorAll("#smile-cat-1001 .most-used-container").forEach(function(container){
                        container.innerHTML += `
                        <div class="smiles-panel__smile-content" style="display: inline-block; margin: 3px;">
                            <a href="javascript:tinyMCE.activeEditor.plugins.smileys.insert('${title}', '${link}')"
                            data-shortcut="${title}" title="${title}">
                                <img src='${link}' style="max-height: 32px; max-width: 32px;">
                            </a>
                        </div>`;
                    })
                },
                error: function(http){
                    var text;
                    switch(http.status){
                        case 404:
                            text = 'Это не изображение! Попробуйте другую ссылку...'
                            break;
                        case 403:
                            text = 'Не авторизован!';
                            break;
                        case 400:
                            text = 'Неверный запрос!';
                            break;
                        default:
                            text = 'Произошла ошибка!';
                            break;
                    }
                    result_object.creatingSmileStatus(button, text, 'red');
                }
            })
        },
        creatingSmileStatus: function(button, text, style){
            var status_element = button.parentElement.parentElement.children[1];
            if (!style) style = 'orange';
            var s = document.createElement('span');
            s.classList.add('settings-status-text')
            s.classList.add(style);
            s.textContent = text;
            s.onanimationend = s.remove
            status_element.innerHTML = '';
            status_element.append(s);
        },

        addSmileToSection: function(section_id, title, link){
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/addSmileToSection',
                body: {
                    section_id, title, link,
                },
                anime: true,
                success: function(){
                    document.querySelectorAll("#smile-cat-" + section_id + " .most-used-container").forEach(function(container){
                        container.innerHTML += `
                        <div class="smiles-panel__smile-content" style="display: inline-block; margin: 3px;">
                            <a href="javascript:tinyMCE.activeEditor.plugins.smileys.insert('${title}', '${link}')"
                            data-shortcut="${title}" title="${title}">
                                <img src='${link}' style="max-height: 32px; max-width: 32px;">
                            </a>
                        </div>`;
                    })
                }
            })
        },
        removeSmileFromSection: function(section_id, index){
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/deleteSmileFromSection',
                body: {
                    section_id, index
                },
                anime: true,
                success: function(http){
                    document.querySelectorAll("#smile-cat-" + section_id + " .most-used-container").forEach(function(container){
                        container.children[index].remove();
                    })
                }
            })
        },
        getSectionSmiles: function(section_id){
            createHttpRequest({
                method: 'POST',
                link: _HOST_ + '/getSmilesInSection',
                body: { section_id },
                anime: true,
                success: function(http){
                    let section_response = JSON.parse(http.responseText).smiles;
                    var section_result = '';
                    section_response.forEach(function(smile){
                        section_result += `
                        <div class="smiles-panel__smile-content" style="display: inline-block; margin: 3px;">
                            <a href="javascript:tinyMCE.activeEditor.plugins.smileys.insert('${smile.title}', '${smile.link}')"
                            data-shortcut="${smile.title}" title="${smile.title}">
                                <img src='${smile.link}' style="max-height: 32px; max-width: 32px;">
                            </a>
                        </div>`;
                    })
                    document.querySelectorAll("#smile-cat-" + section_id + " .most-used-container").forEach(function(container){
                        container.innerHTML = section_result;
                    })
                }
            })
        },

        updateAllSmileSections: function(){
            document.querySelectorAll('.smiles-panel__tabs-tab').forEach(function(element){
                if (element.children[0].getAttribute('data-cat') > 1000000) element.remove();
            })
            document.querySelectorAll('.smiles-panel__tabs-content').forEach(function(element){
                if (element.id && element.id.replace('smile-cat-', '') > 1000000) element.remove();
            })
            document.querySelectorAll('.smiles-panel').forEach(function(smile_panel){
                if (!smile_panel.parentElement.getAttribute('data-target')) result_object.buildSmileSections(smile_panel)
            })
        }
    }

    document.addEventListener('Anime2ruSmilesPanelCreated', function(){
        document.querySelectorAll('*:not([data-target]) .smiles-panel').forEach(result_object.buildSmileSections)
    })

    return result_object;
})();
var _CONTEXT_MENU_ = (function(){
    var custom_context_menu = document.createElement('div');
    custom_context_menu.id = "custom-context-menu";
    custom_context_menu.classList.add('context_container')
    onDOMReady(function(){
        document.body.append(custom_context_menu);
    })
    var result_object = {
        remove: function(){
            custom_context_menu.style.top = "100%";
            custom_context_menu.style.left = "100%";
        },
        show: function(e){
            custom_context_menu.classList.remove('left');
            if (document.documentElement.clientWidth - e.clientX < (2 * custom_context_menu.clientWidth)) custom_context_menu.classList.add('left');
            custom_context_menu.style.top = Math.min(e.clientY, document.documentElement.clientHeight - custom_context_menu.clientHeight) + 'px';
            custom_context_menu.style.left = Math.min(e.clientX, document.documentElement.clientWidth - custom_context_menu.clientWidth) + 'px';
        },
        openSmileContextMenu: function(e, smile_item){
            e.preventDefault();
            let smile_data = smile_item.title ? {
                // Это картинка
                title: smile_item.title,
                link: smile_item.src,
                section_id: null,
                delete_index: -1
            } : {
                // Это смайл
                title: smile_item.children[0].title,
                link: smile_item.querySelector('img').src,
                section_id: Number(smile_item.parentElement.parentElement.id.replace('smile-cat-', '')),
                delete_index: -1
            }
            if (smile_data.section_id > 1000000) smile_data.delete_index = Array.from(smile_item.parentElement.children).findIndex(function(elem){
                return elem === smile_item
            });
            var ctx_smile_result = '';
            AnimeApi.ANIME_USER.smile_sections.forEach(function(section){
                ctx_smile_result += `<div onclick="AnimeApi.SMILE_SECTIONS.addSmileToSection(${section.id}, '${smile_data.title}', '${smile_data.link}')">${section.name}</div>`
            })
            let delete_button = smile_data.delete_index > -1 ? `<div onclick="AnimeApi.SMILE_SECTIONS.removeSmileFromSection(${smile_data.section_id}, ${smile_data.delete_index})">Удалить смайл с этой вкладки</div>` : '';
            if (!AnimeApi.ANIME_USER.smile_sections.length < 10) ctx_smile_result += '<div onclick="toggleSettingsPanel(); openSettingsTab(`smiles`, `main`)">Создать вкладку...</div>';
            custom_context_menu.innerHTML = `
            <div onclick="navigator.clipboard.writeText('${smile_data.link}')">Скопировать ссылку на изображение</div>
            <div>Добавить смайл во вкладку...
                <div class='context_container'>
                    ${ctx_smile_result}
                </div>
            </div>
            ${delete_button}`
            result_object.show(e);
        }
    }
    window.addEventListener('scroll', result_object.remove);
    window.addEventListener('resize', result_object.remove);
    window.addEventListener('click', result_object.remove);

    document.addEventListener('contextmenu', function(e){
        var smile_item = e.path.find(function(el){
            return (el.tagName === "IMG" && el.title) || (el.classList && el.classList.contains('smiles-panel__smile-content'))
        })
        if (smile_item) return void result_object.openSmileContextMenu(e, smile_item)
    })
    
    return result_object;
})();

// Главный класс скрипта, который хранит все нужные значения в глобальной области видимости
var AnimeApi = {
    // Определение режима работы скрипта
    SCRIPT_MODE: _SCRIPT_MODE_,
    // Хост
    HOST: _HOST_,
    // Версия скрипта для отображения
    VERSION: _SCRIPT_VERSION_,
    // Менеджер булевых значений, что хранит всё в localStorage
    BOOLEANS: _BOOLEANS_,
    // Менеджер любых значений, что хранит всё в localStorage
    LOCAL_DATA: _LOCAL_DATA_,
    // Менеджер стилей, значения хранятся в localStorage, сами стили внутри скрипта
    STYLES: _STYLES_,
    // Менеджер шрифтов
    FONTS: _FONTS_,
    // Объект пользователя сайта
    CLIENT_USER: _CLIENT_USER_,
    // Объект пользователя скрипта
    ANIME_USER: _ANIME_USER_,
    // Объект работы с панелью настроек
    SETTINGS_PANEL: _SETTINGS_PANEL_,
    // Объект работы с настройками заднего фона
    SETTINGS_BACKGROUND: _SETTINGS_BACKGROUND_,
    // Объект работы с постами на странице
    THREAD_POSTS: _THREAD_POSTS_,
    // Объект работы с списком друзей
    FRIENDS_LIST: _FRIENDS_LIST_,
    // Объект работы с списком тех, кто игнорирует пользователя
    IGNORE_LIST: _IGNORE_LIST_,
    // Объект работы с списком тех,кого игнорирует пользователь
    IGNORED_LIST: _IGNORED_LIST_,
    // Быстрая выгрузка сообщений
    IMAGE_UPLOADER: _IMAGE_UPLOADER_,

    SMILE_SECTIONS: _SMILE_SECTIONS_,

    SUPER_IGNORE: _SUPER_IGNORE_,
}

// Другой хлам, что может быть полезен
var _TEXT_RESTORER_ = function(){
    onDOMReady(function(){
        if (!AnimeApi.BOOLEANS.overall_input_save) return;
        if (!document.querySelector('.forum-theme__bottom-block') && !document.querySelector('.forum-theme__create-thread')) return;
        let limit = 20;
        let path = window.location.pathname.replace(/page-[0-9]{1,}$/, '');
        let checker = function(){
            if (!--limit) return;
            let frame = document.querySelector('.forum-theme__bottom-block iframe') || document.querySelector('.forum-theme__create-thread iframe');
            if (frame) {
                window.onbeforeunload = function(){
                    sessionStorage.setItem('anime_' + path, frame.contentDocument.getElementById('tinymce').innerHTML)
                }
                if (sessionStorage.getItem('anime_' + path)){
                    frame.contentDocument.getElementById('tinymce').innerHTML = sessionStorage.getItem('anime_' + path);
                    sessionStorage.removeItem('anime_' + path);
                    document.querySelectorAll('.forum-theme__bottom-block label[style]').forEach(function(e){e.style.display = 'none'});
                }
                
            } else setTimeout(checker, 200);
        }
        checker()
    })
    
}();
var _IMAGE_UPLOADER_ = (function(){
    var result_object = {
        upload: function(file, label_text){
            if (!file || !file.type.includes('image')){
                label_text.innerText = 'Это не изображение! Выберите или бросьте другое изображение...';
            } else if (file.size > 10485760){
                label_text.innerText = 'Это изображение слишком большое! Выберите или бросьте другое...';
            } else {
                label_text.innerText = 'Изображение загружается. Выберите или бросьте другое изображение...';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function(){
                    createHttpRequest({
                        method: 'POST',
                        link: _HOST_ + '/uploadImage',
                        body: {
                            data: reader.result
                        },
                        success: function(http){
                            let img = new Image();
                            img.src = http.responseText;
                            tinyMCE.activeEditor.insertContent(img.outerHTML);
                            label_text.innerText = 'Выберите или бросьте другое изображение...';
                        },
                        error: function(){
                            label_text.innerText = 'Произошла ошибка загрузки...';
                        }
                    })
                }
            }
            
        },
        init: function(){
            setTimeout(function(){
                document.querySelectorAll('.tox.tox-tinymce').forEach(function(container){
                    if (container.querySelector('.custom-image-upload')) return;
                    let label = document.createElement('label');
                    label.classList.add('custom-image-upload');
                    label.innerHTML = `
                    <p>Выберите или бросьте сюда изображение...<br>
                    Поле для ввода поддерживает вставку картинок с помощью Ctrl + V</p>
                    <input type="file" class="custom-image-upload-input" accept="image/png, image/jpg, image/jpeg, image/gif">`;
                    let label_text = label.children[0];
                    container.querySelector('.tox-editor-container').append(label)
                    var frame = container.querySelector('iframe');
                    label.children[1].oninput = function(){
                        result_object.upload(label.children[1].files[0], label_text);
                    }
                    frame.contentDocument.getElementById('tinymce').onpaste = function(e){
                        if (e.clipboardData.files[0]) result_object.upload(e.clipboardData.files[0], label_text)
                    }
                    label.ondragover = function(e){
                        e.preventDefault();
                    }
                    label.ondrop = function(e){
                        e.preventDefault();
                        result_object.upload(e.dataTransfer.files[0], label_text)
                    }
                })
            }, 250)
        }
    }

    if (!_BOOLEANS_.overall_image_uploader) return;
    document.addEventListener('Anime2ruEditorCreated', result_object.init)

    return result_object;
})();
var _OTHER_ = (function(){
    onDOMReady(function(){
        if (document.querySelector('.tlgmicon')) document.querySelector('.tlgmicon').remove()
    })
    document.addEventListener('DOMNodeInserted', function(event){
        if (!event.target || !event.target.classList) return;
        if (event.target.classList.contains('tox-tinymce')) return void document.dispatchEvent(new Event('Anime2ruEditorCreated'));
        if (event.target.classList.contains('smiles-panel') && !event.target.parentElement.getAttribute('data-target')) {
            return void document.dispatchEvent(new Event('Anime2ruSmilesPanelCreated'));
        }
    })
})();

// onDOMReady(function(){
//     var test_regex = /\/forum\/members\/.+\/(wall|activity|warns|about|likes)/
//     history.replaceState({link: location.href}, '', location.href)
//     var executer = function(link, save){
//         createHttpRequest({
//             link,
//             noXHR: true,
//             success: function(http){
//                 var _document = (new DOMParser()).parseFromString(http.responseText, 'text/html');
//                 document.title = _document.title;
//                 if (!_document.querySelector('main')){
//                     console.log(_document)
//                 }
//                 if (_document.querySelector('.owl-matches')) _document.querySelector('.owl-matches').remove();
//                 if (document.querySelector('.index.list-matches')) document.querySelector('.index.list-matches').remove();
//                 document.querySelector('main').innerHTML = "";
//                 document.querySelector('main').append(_document.querySelector('main'));
//                 if (!save) history.pushState({link: link}, '', link);
//                 window.scrollTo({
//                     top: 0,
//                     behavior: 'smooth'
//                 })
//                 anime2ruDateTimer();
//                 AnimeApi.THREAD_POSTS.update();
//                 AnimeApi.SUPER_IGNORE.render();
//                 AnimeApi.SMILE_SECTIONS.updateAllSmileSections();
//                 tinyMCE.init({
//                     add_form_submit_trigger: true,
//                     add_unload_trigger: true,
//                     anchor_bottom: false,
//                     anchor_top: false,
//                     auto_convert_smileys: false,
//                     automatic_uploads: false,
//                     autoresize_bottom_margin: "5",
//                     autosave_ask_before_unload: false,
//                     autosave_interval: "5s",
//                     autosave_restore_when_empty: true,
//                     autosave_retention: "30m",
//                     body_class: "messageInfo messageText baseHtml without-scroll-hidden forum-theme__item-block-mess forum-theme__item-block-mess--overflowed",
//                     browser_spellcheck: false,
//                     cache_suffix: "?1604099985",
//                     content_css: (3) ['/css/build/style.min.css', '/css/build/tinymce.min.css', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'],
//                     contextmenu: false,
//                     convert_fonts_to_spans: true,
//                     convert_urls: false,
//                     custom_colors: true,
//                     doctype: "<!DOCTYPE html>",
//                     document_base_url: "https://dota2.ru/forum/",
//                     end_container_on_empty_block: true,
//                     entity_encoding: "named",
//                     external_plugins: {},
//                     font_size_legacy_values: "xx-small,small,medium,large,x-large,xx-large,300%",
//                     fontsize_formats: "8px 11px 14px 15px 18px 24px 36px",
//                     forced_root_block: "p",
//                     gecko_spellcheck: true,
//                     height: 198,
//                     hidden_input: true,
//                     icons: "fa",
//                     id: "conversationPost",
//                     image_description: false,
//                     indent: true,
//                     indent_after: "p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,tfoot,tbody,tr,section,summary,article,hgroup,aside,figure,figcaption,option,optgroup,datalist",
//                     indent_before: "p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,tfoot,tbody,tr,section,summary,article,hgroup,aside,figure,figcaption,option,optgroup,datalist",
//                     inline_styles: true,
//                     language: "ru",
//                     max_height: 500,
//                     menubar: false,
//                     min_height: 198,
//                     object_resizing: "img",
//                     paste_as_text: false,
//                     paste_data_images: false,
//                     plugins: "fixforcedblocking image insertvideo link table spoileralt smileys quotealt mentions paste placeholder autoresize spellchecker twitter advlist lists hr noneditable anchor nonbreaking",
//                     readonly: false,
//                     relative_urls: true,
//                     remove_script_host: true,
//                     remove_trailing_brs: true,
//                     resize: false,
//                     root_name: "body",
//                     selector: ".bbcode-editor",
//                     skin: "oxide-dark",
//                     statusbar: false,
//                     submit_patch: true,
//                     theme: "silver",
//                     toolbar: "\n            bold italic underline strikethrough forecolor \n            | alignleft aligncenter alignright alignjustify | fontsizeselect \n            | numlist bullist | outdent indent | link unlink quote spoiler | image insertvideo smileys twitter_status\n            | table hr removeformat | undo redo\n        ",
//                     toolbar_drawer: true,
//                     validate: true,
//                     visual: true,
//                 })
//             }
//         })
//     }
//     document.addEventListener('click', function(event){
//         var target = event.path.find(function(element){
//             return element.tagName === 'A' && element.href.indexOf("https://" + this.location.pathname) && element.getAttribute('target') !== '_blank'
//         });
//         if (!target) return;
//         if (target.href.indexOf('/forum/settings') === 0 || test_regex.test(target.href)) return
//         event.preventDefault();
//         executer(target.href)
//     })
//     window.addEventListener('popstate', function(event){
//         executer(event.state.link, true)
//     })
// })

// window.kek = function(){
//     createHttpRequest({
//         link: '/memes/74204/',
//         success: function(http){
//             var _document = (new DOMParser()).parseFromString(http.responseText, 'text/html');
//             document.querySelector('main').innerHTML = _document.querySelector('main').innerHTML;
//         }
//     })
// }

window.AnimeApi = AnimeApi;

console.timeEnd('[anime2ru-script] Время инициализации скрипта:')