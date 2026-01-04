// ==UserScript==
// @name         Disconnect Tools
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2025-05-24v1.9.0
// @description  Advanced Tools For VRChat Website
// @author       Disconnect3301
// @match        https://vrchat.com/*
// @grant        GM_addStyle
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/530958/Disconnect%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/530958/Disconnect%20Tools.meta.js
// ==/UserScript==

'use strict';

let savedAvatars = GM_getValue('savedAvatars', []) || [];
let sortSettings = GM_getValue('sortSettings', { sortBy: 'default', isReversed: false });
let isCustomFavoritesMenuOpen = false;
let databaseLink = 'https://api.avtrdb.com/v2/avatar/search/vrcx?search=';
let morePages = 0;

let homeContentElement = null;
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

const addMetod = {
    current : 'current',
    ID : 'ID'
}
let authorName = null;
let authorId = null;
let created_at = null;
let description = null;
let avatarID = null;
let imageUrl = null;
let avatarName = null;
let releaseStatus = null;
let updated_at = null;
let version = null;

let userId = null;
let authCookie = null;

let allAvatars = [];
let totalPages = 0;
let currentPage = 1;
const avatarsPerPage = 20;

let mainWindow_currentPage = 1;
let mainWindow_TotalPages = 0;
const mainWindow_MaxRender = 16;
let mainWindow_SortedAvatars = [];

let lastUpdaterAvatars = null;

GM_addStyle(`
    #notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3050;
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 10px;
        pointer-events: none;
        transition: all .15s ease-in-out;
    }

    .notification {
        position: relative;
        min-width: 280px;
        max-width: 400px;
        width: auto;
        padding: 18px 35px 18px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: linear-gradient(135deg, #2d2d2d, #242424);
        color: #e0e0e0;
        font-family: 'Segoe UI', system-ui, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        cursor: pointer;
        transform: translateY(-20px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        pointer-events: auto;
        overflow: hidden;
        border: 1px solid transparent;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .notification.hide {
        height: 0 !important; /* Схлопываем высоту */
        padding: 0 !important; /* Убираем отступы */
        margin: 0 !important; /* Убираем внешние отступы */
        opacity: 0;
        transform: translateY(-20px);
        border-radius: 0;
        box-shadow: none;
        pointer-events: none;
    }

    .notification.info {
        border-left: 5px solid #2196F3;
        background-color: #2196F31A;
    }

    .notification.success {
        border-left: 5px solid #4CAF50;
        background-color: #4CAF501A;
    }

    .notification.warning {
        border-left: 5px solid #FFA726;
        background-color: #FFA7261A;
    }

    .notification.error {
        border-left: 5px solid #F44336;
        background-color: #F443361A;
    }

    .status-icon {
        font-size: 20px;
        opacity: 0.9;
    }

    .message {
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
    }

    .progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%; /* Занимает всю ширину */
        height: 3px; /* Фиксированная высота */
        background: linear-gradient(90deg, #ddd, #bbb);
        transform-origin: left;
        transform: scaleX(1); /* Начальное состояние */
        transition: transform 0.1s linear;
    }

    .notification:hover {
        transform: scale(1.02) translateY(-2px);
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
    }
        
    @media (max-width: 480px) {
        .notification {
            width: 90vw;
            min-width: unset;
        }
    }

    .btn-custom {
        --bs-btn-font-family: ;
        --bs-btn-font-weight: normal;
        --bs-btn-line-height: 1.25;
        --bs-btn-color: var(--bs-body-color);
        --bs-btn-bg: transparent;
        --bs-btn-border-width: 1px;
        --bs-btn-border-color: transparent;
        --bs-btn-hover-border-color: transparent;
        --bs-btn-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 1px rgba(10, 10, 13, 0.075);
        --bs-btn-disabled-opacity: 0.65;
        --bs-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), .5);
        display: inline-block;
        padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
        font-family: var(--bs-btn-font-family);
        font-size: var(--bs-btn-font-size);
        font-weight: var(--bs-btn-font-weight);
        line-height: var(--bs-btn-line-height);
        color: var(--bs-btn-color);
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        border: var(--bs-btn-border-width) solid var(--bs-btn-border-color);
        border-radius: var(--bs-btn-border-radius);
        background-color: var(--bs-btn-bg);
        background-image: var(--bs-gradient);
        transition: all .15s ease-in-out;
        --bs-btn-padding-y: 0.5rem;
        --bs-btn-padding-x: 1rem;
        --bs-btn-font-size: 1.25rem;
        --bs-btn-border-radius: 0.3rem;
        position: relative;
        flex: 1 1 auto;
        width: 100%;
        margin-top: calc(1px* -1);
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .btn-custom:active {
        color: var(--bs-btn-active-color);
        background-color: var(--bs-btn-active-bg);
        background-image: none;
        border-color: var(--bs-btn-active-border-color);
        z-index: 1;
    }

    .btn-custom:focus-visible {
        color: var(--bs-btn-hover-color);
        background-color: var(--bs-btn-hover-bg);
        background-image: var(--bs-gradient);
        border-color: var(--bs-btn-hover-border-color);
        outline: 0;
        box-shadow: var(--bs-btn-focus-box-shadow);
    }

    .btn-custom:hover {
        color: var(--bs-btn-hover-color);
        text-decoration: none;
        background-color: var(--bs-btn-hover-bg);
    }

    .css-yjay0l-custom {
        background: rgb(7, 36, 43);
        border: 2px solid rgb(5, 60, 72);
        color: rgb(106, 227, 249);
        display: flex;
        flex-direction: row;
        place-content: start space-between;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        height: 45px;
        border-radius: 8px !important;
        box-shadow: none !important;
        padding: 0px 10px !important;
    }

    .css-yjay0l-custom:hover {
        background: rgb(7, 52, 63);
        border-color: rgb(8, 108, 132);
        transform: scale(1.1);
    }

    .css-yjay0l-custom:active {
        color: var(--bs-btn-active-color);
        background-color: var(--bs-btn-active-bg);
        background-image: none;
        border-color: var(--bs-btn-active-border-color);
        z-index: 1;
    }

    .css-1vrq36y-custom {
        border: 2px solid rgb(6, 75, 92);
        border-radius: 4px;
        background: rgb(6, 75, 92);
        color: rgb(106, 227, 249);
        padding: 5px;
        box-sizing: border-box;
        flex: 1 1 0%;
        outline: none !important;
        transition: all .15s ease-in-out;
    }

    .css-1vrq36y-custom.syncButton {
        width: 35px;
        height: 35px;
        padding: 0px;
    }

    .css-1vrq36y-custom:hover {
        border-color: rgb(8, 108, 132);
    }

    .avatarCardToggles {
        border: 2px solid rgb(6, 75, 92);
        border-radius: 4px;
        background: rgb(6, 75, 92);
        color: rgb(106, 227, 249);
        padding: 5px;
        box-sizing: border-box;
        outline: none !important;
        transition: all .15s ease-in-out;
    }

    .avatarCardToggles:hover {
        border-color: rgb(8, 108, 132);
    }

    .avatarCardToggles.Remove {
        border: 2px solid rgb(6, 75, 92);
        border-radius: 4px;
        background: rgba(255, 0, 0, 0.1); !important
        color: rgb(106, 227, 249);
        padding: 5px;
        box-sizing: border-box;
        outline: none !important;
        font-weight: bold;
    }

    .avatarCardToggles.Remove:hover {
        background: rgb(5, 25, 29) !important;
    }

    .css-14ngdq4-custom {
        display: flex;
        background: rgb(54, 54, 54);
        border-radius: 4px;
        padding: 0.25rem 0.75rem;
        -webkit-box-align: center;
        align-items: center;
        font-weight: bold;
        font-size: 1.1rem;
        color: rgb(230, 230, 230);
    }

    .css-zjik7-custom {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .AvatarNameSelection {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 20px;
    }

    .avatarCardTogglesSelection {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: center;
        flex-direction: row;
        margin-top: 10px;
    }

    .css-qcqlg7-custom {
        display: flex;
        margin-bottom: 0.8rem;
        color: rgb(255, 255, 255);
        text-decoration: none;
        flex-direction: column;
        border-radius: 8px;
        background-color: rgb(24, 27, 31);
        transition: border-color 0.2s ease-in-out;
        overflow: visible;
    }

    .css-qcqlg7-custom:hover .card-top,
    .css-qcqlg7-custom:hover .card-bottom  {
        border-color: rgb(5, 77, 94);
    }

    .css-qcqlg7-custom:hover .platform-background {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .css-1kj6np9-custom {
        padding-top: 75%;
        height: 0px;
        overflow: hidden;
        border-radius: 8px;
        position: relative;
        display: flex;
        flex-shrink: 0;
        margin-bottom: 0.5rem;
    }

    .avatarCardImage {
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        position: absolute;
        z-index: 0;
        border: 4px solid #656565a8;
    }

    .css-1brgsnm-custom {
        display: flex;
        flex-direction: column;
        padding: 0.9rem;
        background-color: rgb(37, 42, 48);
        border-color: rgb(37, 42, 48);
        border-style: solid;
        border-width: 3px 3px 0px;
        border-radius: 8px 8px 0px 0px;
    }

    .css-1106r7n-custom {
        display: flex;
        flex-direction: column;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: end;
        justify-content: flex-end;
        z-index: 1;
        border-radius: 8px;
        border: 4px solid rgba(255, 255, 255, 0.184);
    }

    .css-1il99ht-custom {
        display: grid;
        grid-template-columns: 20px 1fr 1fr;
        gap: 0.25rem 1rem;
        -webkit-box-align: center;
        align-items: center;
        color: rgb(115, 115, 114);
    }

    .css-13sdljk-custom {
        position: relative;
        overflow: hidden;
        border-radius: 4px;
        display: flex;
    }

    .css-13sdljk-2-custom {
        display: flex;
        align-items: center;
        padding: 0.5rem 0.5rem;
    }

    .css-kfjcvw-custom {
        display: flex;
        flex-direction: column;
        padding: 0.9rem;
        border-style: solid;
        background-color: rgb(24, 27, 31);
        border-color: rgb(24, 27, 31);
        border-width: 0px 3px 3px;
        border-radius: 0px 0px 8px 8px;
    }

    .svg-icon {
        color: rgb(84, 181, 197);
        font-size: 20px;
        text-align: center;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
    }

    .css-1grfcoa-custom {
        display: flex;
        font-weight: bold;
        font-size: 0.85rem;
    }

    .css-so1s8h-custom {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        font-size: 0.85rem;
        white-space: nowrap;
    }

    .css-so1s8h-custom.Excellent {
        color: rgb(81, 255, 0);
    }

    .css-so1s8h-custom.Good {
        color: rgb(0, 255, 55);
    }
    .css-so1s8h-custom.Medium {
        color: rgb(255, 162, 41);
    }

    .css-so1s8h-custom.Poor {
        color: rgb(255, 84, 41);
    }

    .css-so1s8h-custom.VeryPoor {
        color: rgb(255, 0, 0);
    }

    .css-w9ziq0-custom {
        display: flex;
        margin-bottom: 0px;
        -webkit-box-align: center;
        align-items: center;
        height: 50px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .css-1fttcpj-custom {
        display: flex;
        flex-direction: column;
    }

    .css-1bcpvc0-custom {
        display: flex;
        width: 100%;
        min-width: 10%;
        padding: 0.5rem 0.75rem;
        font-size: 1rem;
        line-height: 1.25;
        background: rgb(5, 25, 29);
        border: 2px solid rgb(5, 60, 72);
        border-radius: 4px;
        color: rgb(106, 227, 249);
        box-shadow: none;
        transition: 250ms ease-in-out;
        outline: none !important;
    }

    .css-1alc1xs-custom {
        padding: 0px;
        margin: 0px;
        color: rgb(14, 155, 177);
        outline: none !important;
    }

    .css-1alc1xs-custom:hover {
        color: rgb(9, 93, 106);
        text-decoration: none;
    }

    .css-1yw163h-custom {
        font-size: 1.2em;
        margin-top: 0.25rem;
        word-break: break-all;
        text-align: left;
        margin-bottom: 0px;
        color: rgb(255, 255, 255);
    }

    .css-1yw163h-custom:hover {
        color: #1fd1ed;
        text-decoration: none;
    }

    .realiseStatus {
        display: flex;
        border: 1px solid var(--bs-primary);
        border-radius: 4px;
        background-color: rgba(31, 209, 237, 0);
        color: var(--bs-primary);
        padding: 2px 10px;
        margin: 2px 5px 0px 5px;
        transition: background-color 0.2s ease-in-out;
        font-size: 0.85rem;
        outline: none !important;
        cursor: default;
    }

    .realiseStatus.private{
        color: rgb(238, 84, 84);
        border-color: rgb(238, 84, 84);
    }

    .platform {
        z-index: 2;
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        border: 4px solid #505153;
        border-left-width: 0px;
        border-bottom-width: 0px;
        border-bottom-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        padding: 0.5rem;
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        --tw-backdrop-saturate: saturate(2);
        --tw-backdrop-blur: blur(8px) !important;
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia) !important;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
        transition-duration: 150ms !important;
        top: 0px !important;
        right: 0px !important;
        position: absolute !important;
    }

    .sync {
        z-index: 2;
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        border: 4px solid #505153;
        border-right-width: 0px;
        border-bottom-width: 0px;
        padding: 0.2rem;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
        transition-duration: 150ms !important;
        top: 0px !important;
        left: 0px !important;
        position: absolute !important;
    }

    .me-1-custom{
        margin-left: 0.25rem;
    }

    @keyframes modalEnter {
        0% { opacity: 0; transform: scale(1.15); }
        100% { opacity: 1; transform: scale(1); }
    }

    @keyframes modalExit {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.15); }
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(4px);
        animation: modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modal-overlay.exit {
        animation: modalExit 0.2s ease-out forwards;
    }

    .modal-content {
        background: rgb(24, 27, 31);
        color: #e0e0e0;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        width: 512px;
        border: 2px solid rgb(37, 42, 48);
        position: relative;
    }

    #avatar-search-modal .modal-content {
        background: rgb(24, 27, 31);
        color: #e0e0e0;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        border: 2px solid rgb(37, 42, 48);
        position: relative;
    }

    #avatar-search-modal h3 {
        margin: 0 0 1.25rem 0;
        font-size: 1.5rem;
        color: rgb(106, 227, 249);
        text-align: center;
        font-weight: 500;
    }

    #search-results {
        max-height: 400px;
        overflow-y: auto;
        padding: 1rem;
        border: 2px solid rgb(5, 60, 72);
        border-radius: 8px;
        background-color: rgb(24, 27, 31);

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgb(6, 75, 92);
            border-radius: 4px;
        }

        &::-webkit-scrollbar-track {
            background-color: rgb(37, 42, 48);
            border-radius: 4px;
        }
    }

    #avatar-search-modal #search-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-height: 400px;
        overflow-y: auto;
        padding: 0.5rem 0;
        border-top: 1px solid rgb(5, 60, 72);
        border-bottom: 1px solid rgb(5, 60, 72);
        transition: all 0.2s ease-in-out;
    }

    .search-result-card {
        display: flex;
        align-items: center;
        background: rgb(37, 42, 48);
        padding: 0.75rem;
        border-radius: 4px;
        transition: all 0.2s ease-in-out;
    }

    .search-result-card:hover {
        background: rgb(10, 57, 69);
    }

    .search-result-card img {
        width: 65px;
        height: 50px;
        border-radius: 5px;
        margin-right: 10px;
        object-fit: cover;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    }

    .search-result-card img:hover {
        transform: scale(2.5) translate(20%, 20%);
        box-shadow: 0 8px 10px rgb(0, 0, 0);
    }

    .search-result-card .info {
        flex-grow: 1;
    }

    .search-result-card h4 {
        margin: 0;
        font-size: 1rem;
        color: rgb(106, 227, 249);
    }

    .search-result-card p {
        margin: 0.25rem 0 0 0;
        font-size: 0.9rem;
        color: rgb(160, 160, 160);
    }

    .search-result-card button {
        padding: 0.5rem 1rem;
        border: 2px solid rgb(6, 75, 92);
        border-radius: 4px;
        background: rgb(6, 75, 92);
        color: #e0e0e0;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        max-width: 150px;
        min-width: 150px;
    }

    .search-result-card button:hover {
        background: rgb(8, 108, 132);
        border-color: rgb(8, 108, 132);
        transform: scale(1.05);
    }

    #avatar-search-modal #close-modal-btn {
        display: block;
        margin: 1.5rem auto 0;
        padding: 0.35rem 1.5rem;
        border: 2px solid rgb(6, 75, 92);
        border-radius: 4px;
        background: rgb(6, 75, 92);
        color: #e0e0e0;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    #avatar-search-modal #close-modal-btn:hover {
        background: rgba(8, 108, 132, 0.25);
        border-color: rgb(8, 108, 132);
        transform: scale(1.05);
    }

    #pagination-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    #pagination-container button {
        margin: 0 5px;
    }

    .vrc-button {
        border: 2px solid rgb(6, 75, 92);
        border-radius: 4px;
        background: rgb(6, 75, 92);
        color: rgb(106, 227, 249);
        padding: 0.4rem 1.2rem;
        box-sizing: border-box;
        outline: none !important;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        transition: all 0.2s ease-in-out;
    }
    
    .vrc-button.danger {
        color: rgb(238, 84, 84);
        border: 2px solid rgb(238, 84, 84);
        background: rgba(255, 0, 0, 0.1);
    }
    .vrc-button.danger:hover {
        background: rgb(4, 19, 22) !important;
        border-color: rgb(238, 84, 84) !important;
    }

    .vrc-button:hover {
        border-color: rgb(8, 108, 132);
    }

    .mod-settings-checkbox {
        opacity: 0;
        position: absolute;
    }

    .mod-settings-checkbox + label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        position: relative;
        padding-left: 28px;
        color: rgb(106, 227, 249);
        transition: color 0.2s ease-in-out;
    }

    .mod-settings-checkbox + label::before {
        content: '';
        position: absolute;
        left: 0;
        width: 16px;
        height: 16px;
        border: 2px solid rgb(6, 75, 92);
        border-radius: 2px;
        background: rgb(4, 18, 21);
        transition: all 0.2s ease-in-out;
    }

    .mod-settings-checkbox + label:hover::before {
        border-color: rgb(8, 108, 132);
    }

    .mod-settings-checkbox:checked + label::before {
        background: rgb(8, 108, 132);
        border-color: rgb(8, 108, 132);
    }

    .mod-settings-checkbox:checked + label::after {
        content: '';
        position: absolute;
        left: 4px;
        bottom: 7px;
        width: 8px;
        height: 14px;
        border: solid rgb(106, 227, 249);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        transition: all 0.2s ease-in-out;
    }

    .sync-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(4px);
        animation: modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sync-modal-overlay.exit {
        animation: modalExit 0.2s ease-out forwards;
    }

    .modal-sync {
        background: rgb(24, 27, 31);
        color: #e0e0e0;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        border: 2px solid rgb(37, 42, 48);
        position: relative;
    }

    .modal-sync-title {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        color: rgb(106, 227, 249);
        text-align: center;
        font-weight: 500;
    }

    #sync-changes-list {
        max-height: 470px;
        overflow-y: auto;
        padding: 10px;
    }

    .sync-change-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        background: linear-gradient(135deg, rgba(20, 40, 50, 0.8), rgba(10, 25, 30, 0.8));
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        margin-bottom: 0.5rem;
        transition: all 0.3s ease-in-out;
        border: 2px solid transparent;
        border-color: rgb(0, 40, 55);
    }

    .sync-change-item:hover {
        background: linear-gradient(135deg, rgba(25, 50, 60, 0.9), rgba(15, 35, 40, 0.9));
        border-color: rgba(106, 227, 249, 0.5);
        transform: scale(1.03);
    }

    .sync-change-label {
        font-size: 1rem;
        color: rgb(140, 230, 250);
        font-weight: bold;
        width: 100%;
    }

    .sync-change-checkbox {
        appearance: none;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 4px;
        background: rgb(10, 30, 35);
        border: 2px solid rgb(15, 50, 60);
        outline: none;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        position: relative;
        margin-right: 0.75rem;
    }
    .sync-change-checkbox:checked {
        background: rgb(90, 255, 60);
        border-color: rgb(255, 255, 255);
        box-shadow: 0 0 8px rgb(255, 255, 255);
    }

    .sync-field-name {
        font-size: 1rem;
        color: rgb(160, 180, 200);
        font-weight: bold;
        letter-spacing: 1px;
    }

    .sync-field-value {
        font-size: 0.9rem;
        color: rgb(180, 200, 220);
        word-break: break-word;
        line-height: 1.4;
        max-width: 200px;
        transition: all 0.2s ease-in-out;
    }

    .modal-sync-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
    }

    @keyframes modalEnter {
        0% { opacity: 0; transform: scale(1.15); }
        100% { opacity: 1; transform: scale(1); }
    }

    @keyframes modalExit {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.15); }
    }

    #sync-changes-list::-webkit-scrollbar {
        width: 8px;
    }

    #sync-changes-list::-webkit-scrollbar-track {
        background: rgb(7, 36, 43);
    }

    #sync-changes-list::-webkit-scrollbar-thumb {
        background: rgba(106, 227, 249, 0.5);
        border-radius: 4px;
    }

    .sync-change-checkbox-container {
        display: flex;
        align-items: center;
    }

    .sync-change-arrow {
        margin-top: auto;
        margin-bottom: auto;
    }

    .sync-image {
        width: 150px;
        border-radius: 10px;
        transition: all 0.2s ease-in-out;
    }

    .sync-image:hover {
        transform: scale(1.4) translateY(-12px);
    }

    @keyframes modalEnter {
        0% { opacity: 0; transform: scale(1.15); }
        100% { opacity: 1; transform: scale(1); }
    }

    @keyframes modalExit {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.15); }
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(4px);
        animation: modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modal-overlay.exit {
        animation: modalExit 0.2s ease-out forwards;
    }

    .modal-content {
        background: rgb(24, 27, 31);
        color: #e0e0e0;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        width: 512px;
        border: 2px solid rgb(37, 42, 48);
        position: relative;
    }

    .modal-content h3 {
        margin: 0 0 1.25rem 0;
        font-size: 1.5rem;
        color: rgb(106, 227, 249);
        text-align: center;
        font-weight: 500;
    }

    .modal-content label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: rgb(160, 160, 160);
    }

    .modal-content input {
        width: 100%;
        padding: 0.75rem 1rem;
        margin: 0.5rem 0 1.25rem 0;
        border: 2px solid rgb(6, 75, 92);
        border-radius: 4px;
        background: rgb(7, 36, 43);
        color: #e0e0e0;
        font-size: 1rem;
        transition: all 0.2s ease-in-out;
    }

    .modal-content input:focus {
        outline: none;
        border-color: rgb(8, 108, 132);
        box-shadow: 0 0 0 3px rgba(106, 227, 249, 0.1);
    }

    .modal-content input:hover {
        border-color: rgb(8, 108, 132);
    }

    .modal-buttons {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
    }

    #save-avatar-btn, #cancel-btn {
        flex: 1;
        padding: 0.75rem 1.25rem;
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease-in-out;
        background-color: rgb(37, 42, 48);
        color: rgb(106, 227, 249);
    }

    #save-avatar-btn {
        background-color: rgb(6, 75, 92);
        border-color: rgb(8, 108, 132);
    }

    #save-avatar-btn:hover {
        background-color: rgb(8, 108, 132);
        border-color: rgb(255, 255, 255);
        transform: scale(1.05);
    }
        
    #cancel-btn {
        color: rgb(238, 84, 84);
        background-color: rgb(7, 36, 43);
        border: 3px solid rgb(5, 60, 72);
    }

    #cancel-btn:hover {
        background-color: rgb(5, 25, 29);
        border-color: rgb(5, 25, 29)
        transform: scale(1.05);
    }

    .modal-buttons button {
        --bs-btn-border-radius: 4px;
        --bs-btn-padding-y: 0.75rem;
        --bs-btn-padding-x: 1.25rem;
        --bs-btn-font-size: 1rem;
        border-width: 2px;
    }

    .modal-content input:focus {
        background: linear-gradient(#242424, #242424) padding-box,
                    linear-gradient(135deg, rgba(106, 227, 249, 0.4), rgba(8, 108, 132, 0.4)) border-box;
        border: 2px solid transparent;
    }

    .modal-content input.valid {
        border-color: #4CAF50 !important;
    }

    .modal-content input.invalid {
        border-color: #FF5722 !important;
    }

    .modal-content input:hover {
        border-color: inherit;
    }

    #save-avatar-btn:disabled {
        background-color: rgb(37, 42, 48);
        border-color: transparent;
        cursor: not-allowed;
        transform: none;
    }

    #save-avatar-btn:disabled:hover {
        background-color: rgb(37, 42, 48);
        border-color: transparent;
        box-shadow: none;
    }
    
    .settings-container {
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
    }

    .settings-container .dropdown {
        position: relative;
    }

    .nav-btn {
        min-width: 45px;
        min-height: 45px;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        font-weight: bold;
        white-space: nowrap;
        background: rgb(7, 36, 43) !important;
        border-radius: 100px !important;
        border: 3px solid rgb(5, 60, 72) !important;
    }

    .nav-btn:hover {
        background: rgb(5, 25, 29) !important;
        box-shadow: rgb(5, 25, 29) 0px 0px 0px 0.2rem !important;
    }

    .settings-btn {
        --bs-btn-padding-x: 0.75rem;
        --bs-btn-padding-y: 0.5rem;
        --bs-btn-font-family: ;
        --bs-btn-font-size: 1rem;
        --bs-btn-font-weight: normal;
        --bs-btn-line-height: 1.25;
        --bs-btn-color: var(--bs-body-color);
        --bs-btn-bg: transparent;
        --bs-btn-border-width: 1px;
        --bs-btn-border-color: transparent;
        --bs-btn-border-radius: 0.25rem;
        --bs-btn-hover-border-color: transparent;
        --bs-btn-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 1px rgba(10, 10, 13, 0.075);
        --bs-btn-disabled-opacity: 0.65;
        --bs-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), .5);
        display: inline-block;
        padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
        font-family: var(--bs-btn-font-family);
        font-size: var(--bs-btn-font-size);
        font-weight: var(--bs-btn-font-weight);
        line-height: var(--bs-btn-line-height);
        color: var(--bs-btn-color);
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        border: var(--bs-btn-border-width) solid var(--bs-btn-border-color);
        border-radius: var(--bs-btn-border-radius);
        background-color: var(--bs-btn-bg);
        background-image: var(--bs-gradient);
        transition: all .15s ease-in-out;
    }

    .settings-btn:hover {
        color: var(--bs-btn-hover-color);
        text-decoration: none;
        background-color: var(--bs-btn-hover-bg);
        border-color: var(--bs-btn-hover-border-color);
    }

    .settings-btn-secondary {
        --bs-gradient: #798897 linear-gradient(180deg, #697683, #798897) repeat-x;
    }

    .padding-1 {
        padding: 0.25rem !important;
    }

    .text-white-custom {
        --bs-text-opacity: 1;
        color: rgba(var(--bs-white-rgb), var(--bs-text-opacity)) !important;
    }

    .settings-svg {
        text-align: center;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
        font-size: 1.25em;
        line-height: 0.05em;
        display: var(--fa-display, inline-block);
        height: 1em;
        vertical-align: -0.125em;
        overflow: visible;
        box-sizing: content-box;
    }

    .dropdown-arrow2::before {
        content: "";
        position: absolute;
        background: transparent;
        left: 50%;
        transform: translateX(-50%);
        border-width: 15px;
        border-style: solid;
        border-color: transparent transparent rgb(5, 60, 72);
        bottom: -20px;
        z-index: 1;
        pointer-events: none;
    }

    .dropdown-arrow2::after {
        content: "";
        position: absolute;
        background: transparent;
        left: 50%;
        transform: translateX(-50%);
        border-width: 22px;
        border-style: solid;
        border-color: transparent transparent rgb(5, 25, 29);
        bottom: -30px;
        z-index: 2;
        pointer-events: none;
    }
    
    .dropdown-window { 
        position: relative;
        box-shadow: rgba(0, 0, 0, 0.8) 0px 9px 26px 5px;
        padding: 0px !important;
        transform: translate(-45%, 9%);
        background: rgb(5, 25, 29) !important;
        border: 2px solid rgb(5, 60, 72) !important;
        border-radius: 10px !important;
        width: 400px !important;
    }

    .pages-container {
        position: sticky;
        bottom: 0px;
        align-self: flex-end;
        padding: 0.5rem 2.5rem;
        z-index: 20;
    }
    .control-area {
        display: flex;
        gap: 5px;
        padding: 0.7rem;
        background-color: rgb(0, 0, 0, 0.6);
        border-radius: 15px;
    }
`);

window.onload = async function () {
    try {
        showNotification('Initializing...', 'info');
        await Get_ID_And_Cookie();
        await handleUrlChange(window.location.href);
        ConnectToSocket();
        settingsTab();
        Button_CustomFavorites();
        showNotification('Everything is fine!', 'success');
    } catch (error) {
        console.error(error);
        showNotification(`Error while Initializing: ${error}`, 'error');
    }
};

async function Button_CustomFavorites() {
    try {
        const leftVRCPanel = await awaitForElement('div[role="group"].w-100.css-1bfow8s.btn-group-lg.btn-group-vertical');
        leftVRCPanel.insertAdjacentHTML('afterbegin', `
            <a id="VRChat_ButtonList" class="btn-custom css-yjay0l-custom" title="Open Custom Favorite Avatars">
                <svg viewBox="0 0 60 60" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <linearGradient id="paint0_linear_203_10527" gradientUnits="userSpaceOnUse" x1="30" x2="30" y1="7" y2="53">
                        <stop offset="0" stop-color="#ce9ffc"></stop>
                        <stop offset="1" stop-color="#7367f0"></stop>
                    </linearGradient>
                    <g fill="url(#paint0_linear_203_10527)">
                        <path fill="url(#paint0_linear_203_10527)" d="m14 44c-.803 0-1.557-.313-2.122-.88l-10.999-10.999c-.566-.564-.879-1.318-.879-2.121s.313-1.557.88-2.122l10.999-10.999c.564-.566 1.318-.879 2.121-.879 1.654 0 3 1.346 3 3 0 .803-.313 1.557-.88 2.122l-8.878 8.878 8.879 8.879c.567.564.879 1.318.879 2.121 0 1.654-1.346 3-3 3z"></path>
                        <path fill="url(#paint0_linear_203_10527)" d="m46 45c-1.654 0-3-1.346-3-3 0-.803.313-1.557.88-2.122l8.878-8.878-8.879-8.879c-.566-.566-.879-1.32-.879-2.121 0-1.654 1.346-3 3-3 .803 0 1.557.313 2.122.88l10.999 10.999c.567.566.879 1.32.879 2.121 0 .803-.313 1.557-.88 2.122l-10.999 10.999c-.564.567-1.318.879-2.121.879z"></path>
                        <path fill="url(#paint0_linear_203_10527)" d="m21 53c-1.654 0-3-1.346-3-3 0-.398.078-.787.23-1.155l18.001-40.002c.47-1.12 1.557-1.843 2.769-1.843 1.654 0 3 1.346 3 3 0 .398-.078.787-.23 1.155l-18.001 40.002c-.47 1.12-1.557 1.843-2.769 1.843z"></path>
                    </g>
                </svg>
                <div>Custom Favorites</div>
                <svg class="svg-inline--fa fa-angle-right css-1efeorg e9fqopp0" viewBox="0 0 320 512">
                    <path fill="currentColor" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
                </svg>
            </a>
        `);
        const Button_CustomFavorites = document.getElementById('VRChat_ButtonList');
        Button_CustomFavorites.addEventListener('click', async () => {
            history.pushState({ page: 'custom' }, "Custom Page", "/home/custom-favorites");
            document.title = 'Custom Favorites - VRChat';
        });
    } catch (error) {
        console.error(`Error: ${error.message}\nStack trace: ${error.stack}`);
        showNotification(`Error: ${error.message}\nStack trace: ${error.stack}`, 'error');
    }
}

async function openCustomFavorites() {
    try {
        const HomeContent = homeContentElement;
        console.log(`home content: ${HomeContent}`);
        HomeContent.insertAdjacentHTML('beforeend', `
            <div id="custom-favorites-window" class="pb-5 css-1fttcpj-custom">
                <div class="css-zjik7-custom">
                    <h2 class="css-w9ziq0-custom">Custom Favorites</h2>
                </div>
                <div class="css-zjik7-custom">
                    <input id="main-search-input" type="text" class="css-1bcpvc0-custom" placeholder="Search Avatars"></input>
                    <div class="d-flex align-items-center gap-2" style="flex: 0 0 auto;">
                        <button id="main-search-button" class="px-3 css-1vrq36y-custom" style="flex: 0 0 auto; margin-left: 10px;">Search in Database</button>
                        <span style="color: rgb(136, 136, 136); margin-left: 0.5rem; margin-right: 0.5rem;">Sorting By:</span>
                        <select id="main-sort-select" class="css-1bcpvc0-custom" style="width: 220px;">
                            <option value="default">Date Added</option>
                            <option value="lastUpdated">Last Updated</option>
                            <option value="name">Avatar Name</option>
                            <option value="performance">Performance</option>
                            <option value="recent">Recently Used</option>
                        </select>
                        <img id="main-reverse-button" src="https://img.icons8.com/?size=28&id=Ne3MRho4pubZ&format=png&color=6ae3f9" alt="Reverse Icon" class="css-1vrq36y-custom" style="cursor: pointer;"></img>
                    </div>
                </div>
                <div class="css-zjik7-custom">
                    <div class="align-items-center css-zjik7-custom">
                        <h2 class="css-w9ziq0-custom">Total Avatars</h2>
                        <div class="ms-2 css-14ngdq4-custom">
                            <div class="counter">Loading</div>
                            <div class="mx-1">/</div>
                            <div>∞</div>
                        </div>
                    </div>
                    <div class="align-items-center justify-content-center justify-content-md-end flex-column flex-md-row flex-1 css-zjik7-custom">
                        <div class="css-13sdljk-custom">
                            <button id="main-saveCurrent-button" class="px-3 me-1-custom css-1vrq36y-custom">Save Current Avatar</button>
                        </div>
                        <div class="css-13sdljk-custom">
                            <button id="main-saveID-button" class="px-3 me-1-custom css-1vrq36y-custom">Save By ID</button>
                        </div>
                    </div>
                </div>
                <div id="custom-avatars" class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 3xl:tw-grid-cols-4 tw-grid-flow-row tw-gap-4"></div>
            </div>
        `);

        const UserInput = document.getElementById('main-search-input');
        UserInput.addEventListener('input', () => {
            const query = UserInput.value.trim().toLowerCase();
            renderAvatarsPage(query);
        });

        const searchInDBButton = document.getElementById('main-search-button');
        searchInDBButton.addEventListener('click', () => {
            const query = UserInput.value.trim();
            showAvatarSearchModal(query || undefined);
        });

        const sortSelect = document.getElementById('main-sort-select');
        sortSelect.value = sortSettings.sortBy;
        sortSelect.addEventListener('change', () => {
            sortSettings.sortBy = sortSelect.value;
            saveSortSettings(sortSettings.sortBy, sortSettings.isReversed);
            renderAvatarsPage();
        });

        const reverseButton = document.getElementById('main-reverse-button');
        reverseButton.src = sortSettings.isReversed ? 'https://img.icons8.com/?size=28&id=r1k2t6YcvxL1&format=png&color=6ae3f9' : 'https://img.icons8.com/?size=28&id=Ne3MRho4pubZ&format=png&color=6ae3f9';
        reverseButton.addEventListener('click', () => {
            sortSettings.isReversed = !sortSettings.isReversed;
            if (sortSettings.isReversed) {
                reverseButton.src = 'https://img.icons8.com/?size=28&id=r1k2t6YcvxL1&format=png&color=6ae3f9';
            } else {
                reverseButton.src = 'https://img.icons8.com/?size=28&id=Ne3MRho4pubZ&format=png&color=6ae3f9';
            }
            saveSortSettings(sortSettings.sortBy, sortSettings.isReversed);
            renderAvatarsPage();
        });

        const SaveCurrentAvatar = document.getElementById('main-saveCurrent-button');
        SaveCurrentAvatar.addEventListener('click', async (e) => {
            e.preventDefault();
            AddAvatar(addMetod.current);
        });

        const SaveByID = document.getElementById('main-saveID-button');
        SaveByID.addEventListener('click', async (e) => {
            e.preventDefault();
            showSaveByIDModal();
        });

        const MainWindow = document.getElementById('custom-favorites-window');
        addPageButtons(MainWindow);
        
        renderAvatarsPage();
        isCustomFavoritesMenuOpen = true;
    } catch (error) {
        console.error(`Error: ${error.message}\nStack trace: ${error.stack}`);
        showNotification(`Error: ${error.message}\nStack trace: ${error.stack}`, 'error');
    }
}

function addPageButtons(container) {
    try {
        container.insertAdjacentHTML('beforeend', `
            <div class="pages-container">
                <div id="buttons-control-container" class="control-area">
                    <button id="prev-page-button" class="vrc-button"><</button>
                    <input id="page-input" class="css-1bcpvc0-custom" style="text-align: center; width: 75px !important;" autocomplete="off">
                    <button id="next-page-button" class="vrc-button">></button>
                </div>
            </div>
        `);
    
        const prev_page = document.getElementById('prev-page-button');
        prev_page.addEventListener('click', () => {
            if (mainWindow_currentPage > 1) {
                mainWindow_currentPage--;
                renderAvatarsPage();
            }
        });
        const next_page = document.getElementById('next-page-button');
        next_page.addEventListener('click', () => {
            if (mainWindow_currentPage < mainWindow_TotalPages) {
                mainWindow_currentPage++;
                renderAvatarsPage();
            }
        });
        const input_page = document.getElementById('page-input');
        input_page.addEventListener('change', (e) => {
            const pageNumber = parseInt(e.target.value);
            if (pageNumber && pageNumber >= 1 && pageNumber <= mainWindow_TotalPages) {
                input_page.blur();
                mainWindow_currentPage = pageNumber;
                renderAvatarsPage();
            } else {
                input_page.blur();
                e.target.value = `${mainWindow_currentPage}/${mainWindow_TotalPages}`;
            }
        });
        input_page.addEventListener('click', () => { 
            input_page.select();
        });
    } catch (error) {
        console.error(`Error: ${error.message}\nStack trace: ${error.stack}`);
        showNotification(`Error: ${error.message}\nStack trace: ${error.stack}`, 'error');
    }
}

function renderAvatarsPage(query = '') {
    try {
        const avatarsContainer = document.getElementById('custom-avatars');
        if (!avatarsContainer) return;
        avatarsContainer.innerHTML = '';
    
        sortAvatars(sortSettings.sortBy, sortSettings.isReversed);
        if (query !== '') {
            mainWindow_SortedAvatars = mainWindow_SortedAvatars.filter(avatar => 
                avatar.avatarName.toLowerCase().includes(query.toLowerCase()) || 
                avatar.authorName.toLowerCase().includes(query.toLowerCase())
            );
        }
        const startIndex = (mainWindow_currentPage - 1) * mainWindow_MaxRender;
        const endIndex = startIndex + mainWindow_MaxRender;
        const avatarsToRender = mainWindow_SortedAvatars.slice(startIndex, endIndex);
    
        avatarsToRender.forEach(createAvatarCard);
        updateCounter();
        updateAvatarPages();
    } catch (error) {
        console.error(`Error: ${error.message}\nStack trace: ${error.stack}`);
        showNotification(`Error: ${error.message}\nStack trace: ${error.stack}`, 'error');
    }
}

function updateAvatarPages() {
    try {
        const prevPageButton = document.getElementById('prev-page-button');
        const nextPageButton = document.getElementById('next-page-button');
        const pageInput = document.getElementById('page-input');
    
        const buttons_area = document.getElementById('buttons-control-container');
        let firstPageButton = document.getElementById('first-page-button');
        let lastPageButton = document.getElementById('last-page-button');
        if (mainWindow_currentPage > 1) {
            if (!firstPageButton) {
                buttons_area.insertAdjacentHTML("afterbegin", `<button id="first-page-button" class="vrc-button">l<</button>`);
                firstPageButton = document.getElementById('first-page-button');
                firstPageButton.addEventListener('click', () => {
                    mainWindow_currentPage = 1;
                    renderAvatarsPage();
                })
            }
        } else if (firstPageButton)
            firstPageButton.remove();
        if (mainWindow_currentPage < mainWindow_TotalPages) {
            if (!lastPageButton) {
                buttons_area.insertAdjacentHTML("beforeend", `<button id="last-page-button" class="vrc-button">>l</button>`);
                lastPageButton = document.getElementById('last-page-button');
                lastPageButton.addEventListener('click', () => {
                    mainWindow_currentPage = mainWindow_TotalPages;
                    renderAvatarsPage();
                })
            }
        } else if (lastPageButton)
            lastPageButton.remove();
    
        if (prevPageButton) prevPageButton.disabled = mainWindow_currentPage === 1;
        if (nextPageButton) nextPageButton.disabled = mainWindow_currentPage === mainWindow_MaxRender;
        if (pageInput) pageInput.value = `${mainWindow_currentPage}/${mainWindow_TotalPages}`;
    } catch (error) {
        console.error(`Error: ${error.message}\nStack trace: ${error.stack}`);
        showNotification(`Error: ${error.message}\nStack trace: ${error.stack}`, 'error');
    }
}

function sortAvatars(sortBy, reverse) {
    try {
        const savedAvatars = getAllSavedAvatars();
        const sortedAvatars = [...savedAvatars].sort((avatarA, avatarB) => {
            let comparison = 0;
    
            switch (sortBy) {
                case 'default':
                    const dateA = parseCustomDate(avatarA.dateAdded);
                    const dateB = parseCustomDate(avatarB.dateAdded);
                    comparison = dateB - dateA;
                    break;
    
                case 'lastUpdated':
                    const updatedA = parseCustomDate(avatarA.updated_at);
                    const updatedB = parseCustomDate(avatarB.updated_at);
                    comparison = updatedB - updatedA;
                    break;
    
                case 'name':
                    comparison = avatarA.avatarName.localeCompare(avatarB.avatarName);
                    break;
                
                case 'performance':
                    const order = { 'Excellent': 5, 'Good': 4, 'Medium': 3, 'Poor': 2, 'VeryPoor': 1, 'None': 0 };
                    comparison = (order[avatarB.PC_Performance] || 0) - (order[avatarA.PC_Performance] || 0);
                    break;
            }
    
            return reverse ? -comparison : comparison;
        });
        mainWindow_SortedAvatars = sortedAvatars;
    } catch (error) {
        console.error(`Error: ${error.message}\nStack trace: ${error.stack}`);
        showNotification(`Error: ${error.message}\nStack trace: ${error.stack}`, 'error');
    }
}

async function AddAvatar(metod, avatarID = null) {
    try {
        let link = null;
    
        if (metod == addMetod.current) {
            link = `https://api.vrchat.cloud/api/1/users/${userId}/avatar`;
        } else if (metod == addMetod.ID) {
            link = `https://api.vrchat.cloud/api/1/avatars/${avatarID}`
        }
    
        let isUnavailable = false;
        let unavailableData = null;
        let data = null;
    
        const response = await SendRequest('GET', `${link}`, authCookie);
        if (response) {
            const { responseText } = response;
            if (responseText) {
                data = JSON.parse(responseText);
            }
        } else {
            isUnavailable = true;
            let privateAvatarInfo = await GetPrivateAvatarInfo('GET', `https://vrchat.com/home/avatar/${avatarID}`, authCookie);
    
            unavailableData = {
                PrivateImage: privateAvatarInfo.PrivateImage,
                PrivateName: privateAvatarInfo.PrivateName,
                PrivateDescription: privateAvatarInfo.PrivateDescription,
                PrivateAuthor: privateAvatarInfo.PrivateAuthor
            };
        }
    
        let hasPC = false;
        let hasQuest = false;
        let pcPerformance = '';
        let questPerformance = '';
    
        if (!isUnavailable && Array.isArray(data.unityPackages) && data.unityPackages.length > 0) {
            data.unityPackages.forEach(pkg => {
                let category = '';
                if (pkg.platform === 'standalonewindows' && pkg.variant === 'security') {
                    category = 'pc';
                    hasPC = true;
                    pcPerformance = pkg.performanceRating;
                } else if (pkg.platform === 'android' && pkg.variant === 'security') {
                    category = 'quest';
                    hasQuest = true;
                    questPerformance = pkg.performanceRating;
                }
            });
        }
        let avatarData = null;
    
        let currentTime = new Date().toLocaleString();
    
        if (!isUnavailable) {
            avatarData = {
                authorName: data.authorName,
                authorId: data.authorId,
                created_at: FixDisplayTime(data.created_at),
                description: data.description,
                avatarID: data.id,
                imageUrl: data.imageUrl,
                avatarName: data.name,
                releaseStatus: data.releaseStatus,
                updated_at: FixDisplayTime(data.updated_at),
                version: data.version,
        
                isPlatformPC: hasPC,
                PC_Performance: pcPerformance,
                isPlatformQuest: hasQuest,
                Quest_Performance: questPerformance,
    
                isUnavalibleAvatar: isUnavailable,
                dateAdded: currentTime
            };
        } else {
            avatarData = {
                authorName: unavailableData.PrivateAuthor,
                authorId: 'Unknown',
                created_at: 'Unknown',
                description: unavailableData.PrivateDescription,
                avatarID: avatarID,
                imageUrl: unavailableData.PrivateImage,
                avatarName: unavailableData.PrivateName,
                releaseStatus: 'private',
                updated_at: 'Unknown',
                version: 'Unknown',
        
                isPlatformPC: hasPC,
                PC_Performance: 'Unknown',
                isPlatformQuest: hasQuest,
                Quest_Performance: 'Unknown',
    
                isUnavalibleAvatar: isUnavailable,
                dateAdded: currentTime
            };
        }
    
        if (!savedAvatars.some(a => a.avatarID === avatarData.avatarID)) {
            savedAvatars.push(avatarData);
            GM_setValue('savedAvatars', savedAvatars);
            createAvatarCard(avatarData);
            renderAvatarsPage();
            showNotification(`Saved Avatar: ${avatarData.avatarName}!`, 'success');
        } else {
            showNotification('This avatar is already saved!', 'warning', 7000);
        }
    } catch (error) {
        console.error(`Error: ${error.message}\nStack trace: ${error.stack}`);
        showNotification(`Error: ${error.message}\nStack trace: ${error.stack}`, 'error');
    }
}

function createAvatarCard(avatar) {
    const AvatarsSelection = document.getElementById('custom-avatars');

    const AvatarCard = document.createElement('div');
    AvatarCard.classList.add('css-qcqlg7-custom', 'AvatarCard');
    AvatarCard.setAttribute('data-avatar-id', avatar.avatarID);
    AvatarsSelection.appendChild(AvatarCard);

	const ImageAndName = document.createElement('div');
    ImageAndName.classList.add('css-1brgsnm-custom', 'card-top');
    if (avatar.isUnavalibleAvatar) {
        ImageAndName.style.borderColor = 'rgb(238, 84, 84)';
    }
    if (avatar.PC_Performance === 'None') {
        ImageAndName.style.borderColor = 'rgb(235, 114, 33)';
    }
	AvatarCard.appendChild(ImageAndName);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('aria-label', 'Avatar Image');
    linkElement.classList.add('css-1kj6np9-custom');
    linkElement.href = `/home/avatar/${avatar.avatarID}`;
    ImageAndName.appendChild(linkElement);
    
    const syncContainer = document.createElement('div');
    syncContainer.classList.add('sync');
    linkElement.appendChild(syncContainer);

    const syncImage = document.createElement('img');
    syncImage.src = 'https://img.icons8.com/?size=28&id=YyqIYbMdZ1i5&format=png&color=6ae3f9';
    syncImage.classList.add('css-1vrq36y-custom', 'syncButton');
    syncImage.addEventListener('click', async (event) => {
        event.stopPropagation();
        event.preventDefault();
        await syncAvatar(avatar.avatarID);
    });
    syncContainer.appendChild(syncImage);
    
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('platform', 'platform-background');
    if (avatar.isUnavalibleAvatar) {
        iconDiv.style.display = 'none';
    }
    linkElement.appendChild(iconDiv);

    if (avatar.isPlatformPC) {
        const Windows = document.createElement('div');
        Windows.setAttribute('role', 'note');
        Windows.setAttribute('title', 'Is a Windows Avatar');
        Windows.classList.add('tw-flex', 'tw-items-center', 'tw-justify-center', 'tw-w-6', 'tw-h-6', 'tw-border', 'tw-border-solid', 'tw-border-current', 'tw-rounded-full');
        Windows.style.color = 'rgb(23, 120, 255)';
        iconDiv.appendChild(Windows);
    
        const PC_Icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        PC_Icon.setAttribute('aria-hidden', 'true');
        PC_Icon.setAttribute('focusable', 'false');
        PC_Icon.setAttribute('data-prefix', 'fab');
        PC_Icon.setAttribute('data-icon', 'windows');
        PC_Icon.classList.add('svg-inline--fa', 'fa-windows', 'css-1efeorg', 'e9fqopp0');
        PC_Icon.setAttribute('role', 'presentation');
        PC_Icon.setAttribute('viewBox', '0 0 448 512');
        Windows.appendChild(PC_Icon);
    
        const PC_IconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        PC_IconPath.setAttribute('fill', 'currentColor');
        PC_IconPath.setAttribute('d', 'M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z');
        PC_Icon.appendChild(PC_IconPath);
    }

    if (avatar.isPlatformQuest) {
        const Quest = document.createElement('div');
        Quest.setAttribute('role', 'note');
        Quest.setAttribute('title', 'Is an Android Avatar');
        Quest.classList.add('tw-flex', 'tw-items-center', 'tw-justify-center', 'tw-w-6', 'tw-h-6', 'tw-border', 'tw-border-solid', 'tw-border-current', 'tw-rounded-full');
        Quest.style.color = 'rgb(43, 207, 92)';
        iconDiv.appendChild(Quest);
    
        const Quest_Icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        Quest_Icon.setAttribute('aria-hidden', 'true');
        Quest_Icon.setAttribute('focusable', 'false');
        Quest_Icon.setAttribute('data-prefix', 'fab');
        Quest_Icon.setAttribute('data-icon', 'windows');
        Quest_Icon.classList.add('svg-inline--fa', 'fa-windows', 'css-1efeorg', 'e9fqopp0');
        Quest_Icon.setAttribute('role', 'presentation');
        Quest_Icon.setAttribute('viewBox', '0 0 576 512');
        Quest.appendChild(Quest_Icon);
    
        const Quest_IconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        Quest_IconPath.setAttribute('fill', 'currentColor');
        Quest_IconPath.setAttribute('d', 'M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55');
        Quest_Icon.appendChild(Quest_IconPath);
    }

    const imgElement = document.createElement('img');
    if (avatar.isUnavalibleAvatar && !avatar.authorName) {
        imgElement.src = 'https://assets.vrchat.com/default/unavailable-avatar.png';
    } else{
        imgElement.src = `${avatar.imageUrl}`;
    }
    imgElement.alt = `${avatar.avatarName}`;
    imgElement.classList.add('avatarCardImage');
    linkElement.appendChild(imgElement);

    const avatarDisplayName = document.createElement('div');
    avatarDisplayName.classList.add('AvatarNameSelection');
    ImageAndName.appendChild(avatarDisplayName);

    const OpenAvatarPage = document.createElement('a');
    OpenAvatarPage.setAttribute('aria-label', 'Open Avatar Page');
    OpenAvatarPage.classList.add('css-1alc1xs-custom');
    OpenAvatarPage.href = `/home/avatar/${avatar.avatarID}`;
    avatarDisplayName.appendChild(OpenAvatarPage);

    const avatarH4 = document.createElement('h4');
    avatarH4.classList.add('css-1yw163h-custom');
    avatarH4.textContent = `${avatar.avatarName}`;
    avatarH4.title = `Description:\n${avatar.description}`;
    if (avatarH4.textContent.length > 23) {
        const fontSize = 1.1 - (avatarH4.textContent.length - 23) * 0.02;
        avatarH4.style.fontSize = `${fontSize}rem`;
    }
    OpenAvatarPage.appendChild(avatarH4);

    const releaseStatus = document.createElement('h2');
    releaseStatus.classList.add('realiseStatus');
    if (avatar.releaseStatus === 'private') {
        if (avatar.isUnavalibleAvatar) {
            avatar.releaseStatus = avatar.authorName ? 'private/deleted' : 'Fully Deleted';
        }
    }
    if (['private', 'private/deleted', 'Fully Deleted'].includes(avatar.releaseStatus)) {
        releaseStatus.classList.add('private');
        if (avatar.authorId === userId) {
            releaseStatus.title = 'Only you can use this avatar';
        }
    }
    releaseStatus.textContent = avatar.releaseStatus;
    avatarDisplayName.appendChild(releaseStatus);

	const mainDiv = document.createElement('div');
    mainDiv.classList.add('css-kfjcvw-custom', 'card-bottom');
    if (avatar.isUnavalibleAvatar) {
        mainDiv.style.borderColor = 'rgb(238, 84, 84)';
    }
    if (avatar.PC_Performance === 'None') {
        mainDiv.style.borderColor = 'rgb(235, 114, 33)';
    }
	AvatarCard.appendChild(mainDiv);

    const innerDiv = document.createElement('div');
    innerDiv.classList.add('css-1il99ht-custom');
    mainDiv.appendChild(innerDiv);

    const userSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    userSvg.classList.add('svg-icon');
    userSvg.setAttribute('viewBox', '0 0 448 512');
    userSvg.setAttribute('color', '#54b5c5');
    userSvg.setAttribute('width', '20');
    innerDiv.appendChild(userSvg);

    const userPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    userPath.setAttribute('fill', 'currentColor');
    userPath.setAttribute('d', 'M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z');
    userSvg.appendChild(userPath);

    const authorText = document.createElement('div');
    authorText.classList.add('css-1grfcoa-custom');
    authorText.textContent = 'Author';
    innerDiv.appendChild(authorText);

    const userLink = document.createElement('div');
    userLink.classList.add('css-so1s8h-custom');
    innerDiv.appendChild(userLink);

    const link = document.createElement('a');
    if (!avatar.isUnavalibleAvatar) {
        link.href = `/home/user/${avatar.authorId}`;
    }
    link.textContent = `${avatar.authorName}`;
    userLink.appendChild(link);

    const cloudSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cloudSvg.classList.add('svg-icon');
    cloudSvg.setAttribute('viewBox', '0 0 640 512');
    cloudSvg.setAttribute('color', '#54b5c5');
    cloudSvg.setAttribute('width', '20');
    innerDiv.appendChild(cloudSvg);

    const cloudPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    cloudPath.setAttribute('fill', 'currentColor');
    cloudPath.setAttribute('d', 'M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39L296 392c0 13.3 10.7 24 24 24s24-10.7 24-24l0-134.1 39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z');
    cloudSvg.appendChild(cloudPath);

    const updatedText = document.createElement('div');
    updatedText.classList.add('css-1grfcoa-custom');
    updatedText.textContent = 'Last Updated';
    innerDiv.appendChild(updatedText);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('text-start', 'css-so1s8h-custom');
    dateDiv.textContent = `${avatar.updated_at}`;
    dateDiv.setAttribute('title', `Created: ${avatar.created_at}\nLast Update: ${avatar.updated_at}\nAvatar Version: ${avatar.version}\nAdded In Favortes: ${avatar.dateAdded}`);
    innerDiv.appendChild(dateDiv);

    const perfomanceElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    perfomanceElement.classList.add('svg-icon');
    perfomanceElement.setAttribute('viewBox', '0 0 512 512');
    perfomanceElement.setAttribute('color', '#54b5c5');
    perfomanceElement.setAttribute('width', '20');
    innerDiv.appendChild(perfomanceElement);

    const performanceSVG = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    performanceSVG.setAttribute('fill', 'currentColor');
    performanceSVG.setAttribute('d', 'M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z');
    perfomanceElement.appendChild(performanceSVG);

    const perfomance = document.createElement('div');
    perfomance.classList.add('css-1grfcoa-custom');
    perfomance.textContent = 'Performance';
    innerDiv.appendChild(perfomance);

    const PCText = document.createElement('div');
    PCText.classList.add('text-start', 'css-so1s8h-custom');
    PCText.textContent = `PC`;
    innerDiv.appendChild(PCText);

    const raiting = document.createElement('div');
    if (avatar.PC_Performance === 'Excellent') {
        raiting.classList.add('text-start', 'css-so1s8h-custom', 'Excellent');
    } else if (avatar.PC_Performance === 'Good') {
        raiting.classList.add('text-start', 'css-so1s8h-custom', 'Good');
    } else if (avatar.PC_Performance === 'Medium') {
        raiting.classList.add('text-start', 'css-so1s8h-custom', 'Medium');
    } else if (avatar.PC_Performance === 'Poor') {
        raiting.classList.add('text-start', 'css-so1s8h-custom', 'Poor');
    } else if (avatar.PC_Performance === 'VeryPoor') {
        raiting.classList.add('text-start', 'css-so1s8h-custom', 'VeryPoor');
    }
    if (avatar.PC_Performance !== 'None') {
        raiting.textContent = `${avatar.PC_Performance}`;
    } else {
        raiting.textContent = 'Security Failed';
        raiting.style.color = 'red';
        raiting.style.textDecoration = 'underline';
        raiting.style.textDecorationLine = 'spelling-error';
    }
    raiting.style.marginLeft = '10px';
    PCText.appendChild(raiting);

    if (avatar.PC_Performance !== 'None' && avatar.PC_Performance !== 'Unknown' || !avatar.isUnavalibleAvatar) {
        const verypoorImage = document.createElement('img');
        if (avatar.PC_Performance === 'Excellent') {
            verypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/b7e99cd3c42a6f1ff2e6f3faaada0e75366945997a7fa5e7e014d26b1d100ef7.svg';
        } else if (avatar.PC_Performance === 'Good') {
            verypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/db3f587335a6602a84d0f0f18d6fbb10904973d0ddb659009f0fc56b3d1f026b.svg';
        } else if (avatar.PC_Performance === 'Medium') {
            verypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/24001ed5aa8ebabaa63a09ffb88ccecccc4c5feb1b4179579e8e6c9f1fed3f16.svg';
        } else if (avatar.PC_Performance === 'Poor') {
            verypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/467c01a863f0a61d30a09465f743678c95a5e6ae6d439b2fecd257464ec111d0.svg';
        } else if (avatar.PC_Performance === 'VeryPoor') {
            verypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/b4bf11dfbd8c3076cb66e8457b3f78659854700e79d5256516e205e37af89247.svg';
        } else if (avatar.PC_Performance === 'None') {
            verypoorImage.style.display = 'none';
        }
        // verypoorImage.alt = 'Avatar Icon';
        verypoorImage.style.width = '20px';
        verypoorImage.style.height = '20px';
        verypoorImage.style.marginLeft = '10px';
        verypoorImage.style.marginRight = '10px';
        verypoorImage.classList.add('css-1il99ht-custom');
        raiting.appendChild(verypoorImage);
    }

    const QuestText = document.createElement('div');
    QuestText.classList.add('text-start', 'css-so1s8h-custom');
    QuestText.textContent = `Quest`;
    PCText.appendChild(QuestText);

    const Qraiting = document.createElement('div');
    if (avatar.Quest_Performance === 'Excellent') {
        Qraiting.classList.add('text-start', 'css-so1s8h-custom', 'Excellent');
    } else if (avatar.Quest_Performance === 'Good') {
        Qraiting.classList.add('text-start', 'css-so1s8h-custom', 'Good');
    } else if (avatar.Quest_Performance === 'Medium') {
        Qraiting.classList.add('text-start', 'css-so1s8h-custom', 'Medium');
    } else if (avatar.Quest_Performance === 'Poor') {
        Qraiting.classList.add('text-start', 'css-so1s8h-custom', 'Poor');
    } else if (avatar.Quest_Performance === 'VeryPoor') {
        Qraiting.classList.add('text-start', 'css-so1s8h-custom', 'VeryPoor');
    }
    if (avatar.Quest_Performance) {
        Qraiting.textContent = `${avatar.Quest_Performance}`;
    } else {
        Qraiting.textContent = 'None';
    }
    Qraiting.style.marginLeft = '10px';
    QuestText.appendChild(Qraiting);

    if (avatar.Quest_Performance && avatar.Quest_Performance !== 'None' && !avatar.isUnavalibleAvatar) {
        const QverypoorImage = document.createElement('img');
        if (avatar.Quest_Performance === 'Excellent') {
            QverypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/b7e99cd3c42a6f1ff2e6f3faaada0e75366945997a7fa5e7e014d26b1d100ef7.svg';
        } else if (avatar.Quest_Performance === 'Good') {
            QverypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/db3f587335a6602a84d0f0f18d6fbb10904973d0ddb659009f0fc56b3d1f026b.svg';
        } else if (avatar.Quest_Performance === 'Medium') {
            QverypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/24001ed5aa8ebabaa63a09ffb88ccecccc4c5feb1b4179579e8e6c9f1fed3f16.svg';
        } else if (avatar.Quest_Performance === 'Poor') {
            QverypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/467c01a863f0a61d30a09465f743678c95a5e6ae6d439b2fecd257464ec111d0.svg';
        } else if (avatar.Quest_Performance === 'VeryPoor') {
            QverypoorImage.src = 'https://dtuitjyhwcl5y.cloudfront.net/b4bf11dfbd8c3076cb66e8457b3f78659854700e79d5256516e205e37af89247.svg';
        }
        QverypoorImage.alt = 'Avatar Icon';
        QverypoorImage.style.width = '20px';
        QverypoorImage.style.height = '20px';
        QverypoorImage.style.marginLeft = '10px';
        QverypoorImage.classList.add('css-1il99ht-custom');
        Qraiting.appendChild(QverypoorImage);
    }

    const ButtonsNew = document.createElement('div');
    ButtonsNew.classList.add('avatarCardTogglesSelection');
    if (avatar.isUnavalibleAvatar) {
        ButtonsNew.style.justifyContent = 'flex-end';
    }
    mainDiv.appendChild(ButtonsNew);

    if (!avatar.isUnavalibleAvatar) {
        const selectAvatar = document.createElement('button');
        selectAvatar.textContent = 'Select Avatar';
        selectAvatar.classList.add('px-3', 'avatarCardToggles');
        selectAvatar.addEventListener('click', async (e) => {
            e.preventDefault();
            changeSelectedAvatar(avatar.avatarID);
        });
        ButtonsNew.appendChild(selectAvatar);
    }

	const deleteAvatar = document.createElement('button');
	deleteAvatar.textContent = 'Remove';
	deleteAvatar.style.color = '#ee5454';
	deleteAvatar.style.border = '2px solid #ee5454';
	deleteAvatar.classList.add('px-3', 'avatarCardToggles', 'Remove');
	deleteAvatar.addEventListener('click', async (e) => {
    	e.preventDefault();
        const avatarCard = e.target.closest('.AvatarCard');
        if (avatarCard) {
            const avatarID = avatarCard.getAttribute('data-avatar-id');
            savedAvatars = savedAvatars.filter(a => a.avatarID !== avatarID);
            GM_setValue('savedAvatars', savedAvatars);
            avatarCard.remove();
            renderAvatarsPage();
            showNotification(`Avatar removed: ${avatar.avatarName}!`, 'info');
        } else {
            showNotification('Failed to remove avatar.', 'error');
        }
    });
    ButtonsNew.appendChild(deleteAvatar);
}

async function syncAvatar(avatarID) {
    try {
        let isUnavailable = false;
        let unavailableData = null;
        let newData = null;

        const response = await SendRequest('GET', `https://api.vrchat.cloud/api/1/avatars/${avatarID}`, authCookie);
        if (response) {
            const { responseText } = response;
            if (responseText) {
                newData = JSON.parse(responseText);
            }
        } else {
            isUnavailable = true;
            let privateAvatarInfo = await GetPrivateAvatarInfo('GET', `https://vrchat.com/home/avatar/${avatarID}`, authCookie);

            unavailableData = {
                PrivateImage: privateAvatarInfo.PrivateImage,
                PrivateName: privateAvatarInfo.PrivateName,
                PrivateDescription: privateAvatarInfo.PrivateDescription,
                PrivateAuthor: privateAvatarInfo.PrivateAuthor
            };
        }

        const savedAvatar = savedAvatars.find(a => a.avatarID === avatarID);
        let changes = [];
        let hasPC = false;
        let hasQuest = false;
        let pcPerformance = '';
        let questPerformance = '';
        let releaseStatusPrivate = 'private/deleted';

        if (!isUnavailable && Array.isArray(newData.unityPackages) && newData.unityPackages.length > 0) {
            newData.unityPackages.forEach(pkg => {
                let category = '';
                if (pkg.platform === 'standalonewindows' && pkg.variant === 'security') {
                    category = 'pc';
                    hasPC = true;
                    pcPerformance = pkg.performanceRating;
                } else if (pkg.platform === 'android' && pkg.variant === 'security') {
                    category = 'quest';
                    hasQuest = true;
                    questPerformance = pkg.performanceRating;
                }
            });
        }

        if (isUnavailable) {
            if (savedAvatar.authorName !== unavailableData.PrivateAuthor) {
                changes.push({
                    field: 'authorName',
                    fieldName: 'Author Name',
                    oldVal: savedAvatar.authorName,
                    newVal: unavailableData.PrivateAuthor,
                    apply: false
                });
            }

            if (savedAvatar.description !== unavailableData.PrivateDescription) {
                if (unavailableData.PrivateDescription !== 'VRChat lets you create, publish, and explore virtual worlds with other people from around the world.') {
                    changes.push({
                        field: 'description',
                        fieldName: 'Description',
                        oldVal: savedAvatar.description,
                        newVal: unavailableData.PrivateDescription,
                        apply: false
                    });
                } else {
                    releaseStatusPrivate = 'Fully Deleted';
                }
            }

            if (savedAvatar.imageUrl !== unavailableData.PrivateImage) {
                changes.push({
                    field: 'imageUrl',
                    fieldName: 'Image',
                    oldVal: savedAvatar.imageUrl,
                    newVal: unavailableData.PrivateImage,
                    apply: false
                });
            }
    
            if(savedAvatar.avatarName !== unavailableData.PrivateName) {
                changes.push({
                    field: 'avatarName',
                    fieldName: 'Avatar Name',
                    oldVal: savedAvatar.avatarName,
                    newVal: unavailableData.PrivateName,
                    apply: false
                });
            }

            if (savedAvatar.releaseStatus !== releaseStatusPrivate) {
                changes.push({
                    field: 'releaseStatus',
                    fieldName: 'Release Status',
                    oldVal: savedAvatar.releaseStatus,
                    newVal: releaseStatusPrivate,
                    apply: false
                });
            }

            if (savedAvatar.isUnavalibleAvatar !== true) {
                changes.push({
                    field: 'isUnavalibleAvatar',
                    fieldName: 'Unavalible Avatar',
                    oldVal: savedAvatar.isUnavalibleAvatar,
                    newVal: true,
                    apply: false
                });
            }
        } else {
            if (savedAvatar.authorName !== newData.authorName) {
                changes.push({
                    field: 'authorName',
                    fieldName: 'Author Name',
                    oldVal: savedAvatar.authorName,
                    newVal: newData.authorName,
                    apply: false
                });
            }
    
            if (savedAvatar.authorId !== newData.authorId) {
                changes.push({
                    field: 'authorId',
                    fieldName: 'Author ID',
                    oldVal: savedAvatar.authorId,
                    newVal: newData.authorId,
                    apply: false
                });
            }
    
            if(savedAvatar.created_at !== FixDisplayTime(newData.created_at)) {
                changes.push({
                    field: 'created_at',
                    fieldName: 'Created At',
                    oldVal: savedAvatar.created_at,
                    newVal: FixDisplayTime(newData.created_at),
                    apply: false
                });
            }
            
            if (savedAvatar.description !== newData.description) {
                changes.push({
                    field: 'description',
                    fieldName: 'Description',
                    oldVal: savedAvatar.description,
                    newVal: newData.description,
                    apply: false
                });
            }
    
            if (savedAvatar.avatarID !== newData.id) {
                changes.push({
                    field: 'avatarID',
                    fieldName: 'Avatar ID',
                    oldVal: savedAvatar.avatarID,
                    newVal: newData.id,
                    apply: false
                });
            }
    
            if (savedAvatar.imageUrl !== newData.imageUrl) {
                changes.push({
                    field: 'imageUrl',
                    fieldName: 'Image',
                    oldVal: savedAvatar.imageUrl,
                    newVal: newData.imageUrl,
                    apply: false
                });
            }
    
            if(savedAvatar.avatarName !== newData.name) {
                changes.push({
                    field: 'avatarName',
                    fieldName: 'Avatar Name',
                    oldVal: savedAvatar.avatarName,
                    newVal: newData.name,
                    apply: false
                });
            }
    
            if (savedAvatar.releaseStatus !== newData.releaseStatus) {
                changes.push({
                    field: 'releaseStatus',
                    fieldName: 'Release Status',
                    oldVal: savedAvatar.releaseStatus,
                    newVal: newData.releaseStatus,
                    apply: false
                });
            }
    
            if(savedAvatar.updated_at !== FixDisplayTime(newData.updated_at)) {
                changes.push({
                    field: 'updated_at',
                    fieldName: 'Updated At',
                    oldVal: savedAvatar.updated_at,
                    newVal: FixDisplayTime(newData.updated_at),
                    apply: false
                });
            }
    
            if(savedAvatar.version !== newData.version) {
                changes.push({
                    field: 'version',
                    fieldName: 'Version',
                    oldVal: savedAvatar.version,
                    newVal: newData.version,
                    apply: false
                });
            }
    
            if(savedAvatar.isPlatformPC !== hasPC) {
                changes.push({
                    field: 'isPlatformPC',
                    fieldName: 'PC Avatar',
                    oldVal: savedAvatar.isPlatformPC,
                    newVal: hasPC,
                    apply: false
                });
            }
    
            if(savedAvatar.PC_Performance !== pcPerformance) {
                changes.push({
                    field: 'PC_Performance',
                    fieldName: 'PC Performance',
                    oldVal: savedAvatar.PC_Performance,
                    newVal: pcPerformance,
                    apply: false
                });
            }
    
            if(savedAvatar.isPlatformQuest !== hasQuest) {
                changes.push({
                    field: 'isPlatformQuest',
                    fieldName: 'Quest Avatar',
                    oldVal: savedAvatar.isPlatformQuest,
                    newVal: hasQuest,
                    apply: false
                });
            }
    
            if (savedAvatar.Quest_Performance !== questPerformance) {
                changes.push({
                    field: 'Quest_Performance',
                    fieldName: 'Quest Performance',
                    oldVal: savedAvatar.Quest_Performance,
                    newVal: questPerformance,
                    apply: false
                });
            }
            if (savedAvatar.isUnavalibleAvatar !== false) {
                changes.push({
                    field: 'isUnavalibleAvatar',
                    fieldName: 'Unavalible Avatar',
                    oldVal: savedAvatar.isUnavalibleAvatar,
                    newVal: false,
                    apply: false
                });
            }
        }

        if (changes.length === 0) {
            showNotification('No changes detected!', 'success');
            return;
        }

        showSyncConfirmation(changes, avatarID);
    } catch (error) {
        showNotification(`Error during sync: ${error.message}`, 'error');
    }
}

function showSaveByIDModal() {
    const modal = document.createElement('div');
    modal.id = 'save-by-id-modal';
    modal.classList.add('modal-overlay');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Save New Avatar</h3>
            <label>Avatar URL or ID:</label>
            <input type="text" id="avatar-url" placeholder="Enter URL or ID" />
            <label>For example: avtr_26187637-0c30-4a09-86e1-bc928c07309e</label>
            <div class="modal-buttons">
                <button id="save-avatar-btn" disabled>Save</button>
                <button id="cancel-btn">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const saveBtn = modal.querySelector('#save-avatar-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');
    const inputField = modal.querySelector('#avatar-url');

    const urlPattern = /^https:\/\/vrchat\.com\/home\/avatar\/avtr_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const idPattern = /^avtr_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const validateInput = () => {
        const value = inputField.value.trim();
        const isValidURL = urlPattern.test(value);
        const isValidID = idPattern.test(value);
        const isValid = isValidURL || isValidID;

        inputField.classList.toggle('valid', isValid);
        inputField.classList.toggle('invalid', !isValid);
        saveBtn.disabled = !isValid;
    };

    inputField.addEventListener('input', validateInput);

    const handleClose = () => {
        modal.classList.add('exit');
        setTimeout(() => {
            modal.remove();
        }, 200);
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            handleClose();
        }
    });

    saveBtn.addEventListener('click', async () => {
        const value = inputField.value.trim();
        let avatarID;

        if (urlPattern.test(value)) {
        avatarID = value.split('/').pop();
        } else if (idPattern.test(value)) {
            avatarID = value;
        } else {
            showNotification('Invalid URL or ID format!', 'error');
            return;
        }

        try {
            AddAvatar(addMetod.ID, avatarID);
            handleClose();
        } catch (error) {
            showNotification(`Failed to add avatar: ${error.message}`, 'error');
        }

        handleClose();
    });
    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveBtn.click();
        }
    });

    cancelBtn.addEventListener('click', () => {
        handleClose();
    });

    modal.addEventListener('click', (event) => {
        const modalContent = modal.querySelector('.modal-content');
        const modalRect = modalContent.getBoundingClientRect();

        const safeZone = 150;

        const isClickOutsideSafeZone = 
            event.clientX < modalRect.left - safeZone ||
            event.clientX > modalRect.right + safeZone ||
            event.clientY < modalRect.top - safeZone ||
            event.clientY > modalRect.bottom + safeZone;

        if (isClickOutsideSafeZone) {
            handleClose();
        }
    });
}

function showAvatarSearchModal(initialQuery = '') {
    const modal = document.createElement('div');
    modal.id = 'avatar-search-modal';
    modal.classList.add('modal-overlay');
    modal.innerHTML = `
        <div class="modal-content" id="avatar-search-modal-content">
            <h3>Search Avatars</h3>
            <div style="display: flex; flex-direction: column;">
                <div style="display: flex;">
                    <input 
                        type="text" 
                        id="search-input" 
                        placeholder="Enter search query"
                        value="${initialQuery}"
                        style="width: 100%; height: 2.5rem; padding: 0.75rem; margin-bottom: 0.5rem; margin-right: 10px; border: 2px solid rgb(6, 75, 92); border-radius: 4px; background: rgb(7, 36, 43); color: #e0e0e0;"
                    >
                    <button id="search-btn" class="css-1vrq36y-custom" style="height: 40px; padding: 0rem 1.5rem; border-radius: 4px; background: rgb(6, 75, 92);">Search</button>
                </div>
                
                <div style="display: flex; justify-content: flex-end; align-items: baseline; gap: 0.5rem;">
                    <span>Database:</span>
                    <select id="search-selection" class="database" style="margin-bottom: 1rem; border: 2px solid rgb(6, 75, 92); border-radius: 4px; background: rgb(7, 36, 43); color: #e0e0e0;">
                        <option value="vrcxv2">VRCX v2</option>
                        <option value="vrcx">VRCX</option>
                    </select>
                </div>
                
            </div>
            <div id="pagination-container"></div>
            <div id="search-results" style="max-height: 400px; overflow-y: auto;">The results will appear here</div>
            <button id="close-modal-btn">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    const searchInput = modal.querySelector('#search-input');
    const searchBtn = modal.querySelector('#search-btn');
    const resultsContainer = modal.querySelector('#search-results');
    const closeModalBtn = modal.querySelector('#close-modal-btn');
    const databaseSelector = modal.querySelector('.database');

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') searchBtn.click();
    });

    const handleClose = () => {
        modal.classList.add('exit');
        setTimeout(() => modal.remove(), 200);
    };

    closeModalBtn.addEventListener('click', handleClose);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            handleClose();
        }
    });

    modal.addEventListener('click', (event) => {
        const modalContent = modal.querySelector('.modal-content');
        const modalRect = modalContent.getBoundingClientRect();

        const safeZone = 150;

        const isClickOutsideSafeZone = 
            event.clientX < modalRect.left - safeZone ||
            event.clientX > modalRect.right + safeZone ||
            event.clientY < modalRect.top - safeZone ||
            event.clientY > modalRect.bottom + safeZone;

        if (isClickOutsideSafeZone && !event.target.closest('.modal-content')) {
            handleClose();
        }
    });

    databaseSelector.addEventListener('change', () => {
        switch (databaseSelector.value) {
            case 'vrcxv2':
                databaseLink = `https://api.avtrdb.com/v2/avatar/search/vrcx?search=`;
                break;
            case 'vrcx':
                databaseLink = `https://vrcx.vrcdb.com/avatars/Avatar/VRCX?search=`;
                break;
            default:
                showNotification('Invalid database selection', 'error');
                return;
        }
    });

    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        // const database = databaseSelector.value;
        // const count = countSelector.value;
        if (!query) {
            showNotification('Please enter a search query', 'warning');
            return;
        }

        allAvatars = [];

        performAvatarSearch(query, resultsContainer, 1, databaseLink);
        morePages = 0;
    });

    if (initialQuery) {
        performAvatarSearch(initialQuery, resultsContainer, 1);
    }
}

async function performAvatarSearch(query, container, page = 1, database, pageNumber = 0, isNeedUpdate = true) {
    const isGoodDatabase = database === 'https://api.avtrdb.com/v2/avatar/search/vrcx?search=';
    if (container) {
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    if (!query.trim()) {
        showNotification('Please enter a search query', 'warning');
        return;
    }

    container.innerHTML = '';

    if (isNeedUpdate) {
        try {
            const { response } = await SendRequest('GET', `${database}${query}${!isGoodDatabase ? '' : `&n=50&page=${pageNumber}`}`);
            const data = JSON.parse(response);
    
            if (data.length === 0) {
                container.innerHTML = '<p style="margin: inherit;">No results found</p>';
            }
    
            allAvatars = data;
            totalPages = Math.ceil(allAvatars.length / avatarsPerPage);
        } catch (error) {
            showNotification(`Error while searching: ${error.message}`, 'error');
            return;
        }
    }

    const startIdx = (page - 1) * avatarsPerPage;
    const endIdx = startIdx + avatarsPerPage;
    const currentAvatars = allAvatars.slice(startIdx, endIdx);

    currentAvatars.forEach(avatar => {
        const avatarCard = document.createElement('div');
        avatarCard.classList.add('search-result-card');
        avatarCard.style.display = 'flex';
        avatarCard.style.alignItems = 'center';
        avatarCard.style.marginBottom = '10px';
        avatarCard.style.width = '95%';

        const img = document.createElement('img');
        img.src = avatar.imageUrl || 'https://assets.vrchat.com/default/unavailable-avatar.png';
        avatarCard.appendChild(img);

        const infoDiv = document.createElement('div');
        infoDiv.style.flexGrow = 1;
        infoDiv.style.width = 'min-content';

        const name = document.createElement('h4');
        name.textContent = avatar.avatarName || avatar.name;
        name.title = `Description:\n${avatar.description || 'No description available.'}`;
        name.style.margin = '0';
        infoDiv.appendChild(name);

        const author = document.createElement('p');
        author.textContent = `Created by: ${avatar.authorName}`;
        author.style.margin = '0';
        author.style.fontSize = '0.9em';
        author.style.color = '#aaa';
        infoDiv.appendChild(author);

        avatarCard.appendChild(infoDiv);

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Favorites';
        addButton.classList.add('css-1vrq36y-custom');
        addButton.addEventListener('click', () => {
            AddAvatar(addMetod.ID, avatar.id);
            showNotification(`Added ${avatar.avatarName} to favorites`, 'success');
        });

        avatarCard.appendChild(addButton);
        container.appendChild(avatarCard);
    });

    addPaginationButtons(container, totalPages, page, database);
}

function addPaginationButtons(container, totalPages, currentPage, database) {
    const isGoodDatabase = database === 'https://api.avtrdb.com/v2/avatar/search/vrcx?search=';
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const createButton = (text, disabled, onClick) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.classList.add('css-1vrq36y-custom');
        btn.style.margin = '0 5px';
        btn.disabled = disabled;
        btn.addEventListener('click', onClick);
        return btn;
    };

    if (isGoodDatabase) {
        paginationContainer.insertBefore(createButton('Previous', morePages === 0, () => {
            morePages--;
            performAvatarSearch(document.getElementById('search-input').value.trim(), container, 1, database, morePages);
        }), paginationContainer.firstChild);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Current Page: ${morePages + 1}`;
        pageInfo.style.margin = '0 10px';
        paginationContainer.appendChild(pageInfo);

        paginationContainer.appendChild(createButton('Next', false, () => {
            morePages++;
            performAvatarSearch(document.getElementById('search-input').value.trim(), container, 1, database, morePages);
        }));
    } else {
        paginationContainer.appendChild(createButton('Previous', currentPage === 1, () => {
        performAvatarSearch(document.getElementById('search-input').value.trim(), container, currentPage - 1, database, undefined, false);
        }));

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        pageInfo.style.margin = '0 10px';
        paginationContainer.appendChild(pageInfo);

        paginationContainer.appendChild(createButton('Next', currentPage >= totalPages, () => {
            performAvatarSearch(document.getElementById('search-input').value.trim(), container, currentPage + 1, database, undefined, false);
        }));
    }
}

async function settingsTab() {
    const settingsContainer = await awaitForElement('div.navbar-section.left-nav');
    settingsContainer.insertAdjacentHTML('beforeend', `
        <div class="settings-container">
            <div class="dropdown">
                <button type="button" class="padding-1 nav-btn text-white-custom settings-btn settings-btn-secondary settings-btn-event">
                    <img width="32" height="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAABJFJREFUWEftVltoXFUUnVqNfmgF0foAxdJKaaxa0aqNufdkxEegoiWQ+vjQv35I7EdbsVKK+CMIxp+KDyhWjZl7zx2jFaXgV7Ba1PpA2/gj+IA+MDRtkrnn3EmtyXWtPTvpmLQlZlAUuuAw5+yzz1p77/O4UziL/zyKUXVx+O7YdTqcNYytLuFaHc4dRTu6NIzdwb8TBMVD6w4U7dhSNc0dpje/1FifzzaImnh2gGtabeUyNc8dnUk+38RuYiqI3tHTBjGZOX255tk8P0enGgMIjwlpXSWYXRhVOgLrVt9rJy6pz1zbMV3eOJDNz1MBWHcC4/dMMnhhaP16NvZpQ/9EXQA/6fLGAbJv0H6HSLcp+1uNzZ5C/wPaUZEvwtj34PexYjSyGLZu+sL2tS5vHCZK3zJJ1griFyB8HL+sxCGIfMoAjHWjYov9YBilj+J3pYn9m7p8djCJu0K7M3B3kl8MkU9U+H2THF+hUwLTn5+L8j8A4YGaj3+eNp2egaDPXandk4DAVmTz6qkmZc9rN6FLTXI7+EYEUXa1mgrtuybOR+ZWgkj8OjVPgdzUoJaaTgKLF2ByCM2buLJGzRD3ayazUlMhtOk9sB+mvTbnPg+ioxJIc5I31bbFV1a9nS6UBQB5yI0qDbX3TCxQ81+B/dsgpDj1yLCJNox3i9iO/AKOW7YfuQjBDIswDhrEf9H+R5wnAutvE5vNtnDMoMhZs6UbxOl0MGV3PwT34eB13WFHcL/dOCJ/SacLQZyFJILPYCHP54Uld3MtAFdVFwHGA6wE++RCAPvILZPTgUelGZk8jQU7ccU24YFZ1ha7+7C/LSJms0fUFQHyGtLmxvH7HNaUNaCj6iJAlXaAc5T9AFxhNLYMazah7aRWsZRer47ZWkT3pR4yeUJB+hVKtTYsYa9hC0putTgTzNr6/loQdS12Vj0E4NiG9of0oUFODboWPDRpF2dCTmjZd7SU/FUQvwFRbinG7iYumH6ib3k9P8/E6cMg6Z0MIIgroU4LINIH+2H2yUVO4VYNcZqOu0rp5WHk3sGC8TabmVV96UJEnqKV1aUO+TyWUwK0/kM1CpqTgSbYjnCe3wycgTZy4qD2UEPdZoLimtEuGcfpRhC9gf3F6zeyRJwU3EcRj/3InUl2jZoFYeTXcQ5JPIQqPUMbOcUfGuI0HSw3Mh1nNoGtLqINwt8GkX8QYlVkswevm1xFlH85yL5na8M8bZPglxI8w+D5rrWU3ojf/bSTk1eVGtQS53rgrd/M916HAgj8iPYZFj4h0ceu/5TPqIK3Bj6HkHWldj3dHgT/q04LTFJpxbO/WYdnBsgOUhhEr6EaT2LMzy0/PN1hXC2aqHot/6Cg5B3wSdBYwd+CMgLh1slavBdzBQRfBuleVCAFYSSPUJx+TCEln2rw9cj2FQkIhxb+Q6jEbsy9qHQNAHc/sMOLULoV8kiV/O0mzjohst5EvgsBtSPIldxzno8zbVPD4GcW27EdmQ0i4/3o/4D+KB6VbZ1JMl/d/mnIG7AVDa8n73e2USf+XeAP6eO86zo8i/8jCoU/Aer6obzE84gLAAAADmVYSWZNTQAqAAAACAAAAAAAAADSU5MAAAAASUVORK5CYII=" alt="tupper-logo"/>
                    <div class="dropdown-arrow2" style="display: none;"></div>
                </button>
                <div style="position: absolute;">
                    <div class="dropdown-window my-menu" style="display: none;">
                        <div style="height: 20px; width: 100%; padding-right: 10px; text-align: right; border-bottom: 2px solid rgb(5, 60, 72);">
                            <h6 style="background: linear-gradient(45deg, rgb(255, 0, 255) 55%, rgb(0, 150, 2255) 100%); -webkit-background-clip: text; color: transparent;">Disconnect Tools</h6>
                        </div>
                        <div style="padding: 20px 15px; background: rgb(4, 18, 21); display: flex; flex-direction: column; gap: 10px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" class="mod-settings-checkbox" id="checkbox-1" />
                                <label for="checkbox-1">Auto-Apply Changes When Sync</label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" class="mod-settings-checkbox" id="checkbox-2" />
                                <label for="checkbox-2">Sync Avatar When Selected</label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" class="mod-settings-checkbox" id="checkbox-3" />
                                <label for="checkbox-3">Hide Private Or Deleted Avatars</label>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" class="mod-settings-checkbox" id="checkbox-4" />
                                <label for="checkbox-4">Hide Security Check Failed Avatars</label>
                            </div>
                            <div style="display: flex; justify-content: space-around;">
                                <button class="vrc-button mod-settings-event">Export Avatars</button>
                                <button class="vrc-button mod-settings-event">Import Avatars</button>
                            </div>
                            <button class="vrc-button danger mod-settings-event" style="margin-top: 10px;">Delete Saved Avatars</button>
                        </div>
                        <div style="height: 20px; width: 100%; border-top: 2px solid rgb(5, 60, 72);"></div>
                    </div>
                </div>
            </div>
        </div>
    `);

    const modSettingsButton = settingsContainer.querySelector('.settings-btn-event');
    const dropdown = settingsContainer.querySelector('.my-menu');
    const dropdownArrow = settingsContainer.querySelector('.dropdown-arrow2');

    modSettingsButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        dropdownArrow.style.display = dropdownArrow.style.display === 'block' ? 'none' : 'block';

    });

    document.addEventListener('click', (event) => {
        const isClickInside = modSettingsButton.contains(event.target) || dropdown.contains(event.target);
        if (!isClickInside) {
            dropdown.style.display = 'none';
            dropdownArrow.style.display = 'none';
        }
    });
}

function showSyncConfirmation(changes, avatarID) {
    const modal = document.createElement('div');
    modal.className = 'sync-modal-overlay';
    modal.innerHTML = `
        <div class="modal-sync" style="width: 600px">
            <h3 class="modal-sync-title">Changes detected</h3>
            <div id="status-warning" class="sync-warning" style="display: none;">
                <strong>⚠️ Avatar is now PRIVATE/DELETED! Some data may become unavailable.</strong>
            </div>
            <div id="sync-changes-list""></div>
            <div class="modal-sync-buttons">
                <div>
                    <button id="sync-select-all" class="vrc-button">Select All</button>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button id="sync-apply-changes" class="vrc-button">Apply Selected</button>
                    <button id="sync-cancel-changes" class="vrc-button">Cancel</button>
                </div>
            </div>
        </div>
    `;

    const statusChange = changes.find(change => 
        change.field === 'releaseStatus' && 
        (change.newVal === 'private/deleted' || change.newVal === 'Fully Deleted')
    );

    if (statusChange) {
        const warning = modal.querySelector('#status-warning');
        warning.style.display = 'block';
        warning.style.backgroundColor = 'rgb(81, 22, 22)';
        warning.style.padding = '10px';
        warning.style.borderRadius = '5px';
        warning.style.marginBottom = '15px';
    }
    
    const changesList = modal.querySelector('#sync-changes-list');
    changes.forEach(change => {
        const div = document.createElement('div');
        div.className = 'sync-change-item';
        if (change.field === 'imageUrl') {
            div.innerHTML = `
                <label class="sync-change-label">
                    <div class="sync-change-checkbox-container" style="margin-bottom: 0.5rem;">
                        <input type="checkbox" class="sync-change-checkbox">
                        <span class="sync-field-name">${change.fieldName}</span>
                    </div>
                    <div class="sync-change-checkbox-container" style="justify-content: space-around; align-items: center;">
                        <div class="sync-field-value">
                            ${change.oldVal ? `<img src="${change.oldVal}" alt="Old Image" class="sync-image"">` : 'No image'}
                        </div>
                        <p class="sync-change-arrow">➤</p>
                        <div class="sync-field-value">
                            ${change.newVal ? `<img src="${change.newVal}" alt="New Image" class="sync-image">` : 'No image'}
                        </div>
                    </div>
                </label>
            `;
        } else {
            div.innerHTML = `
                <label class="sync-change-label">
                    <div class="sync-change-checkbox-container" style="margin-bottom: 0.5rem;">
                        <input type="checkbox" class="sync-change-checkbox">
                        <span class="sync-field-name">${change.fieldName}</span>
                    </div>
                    <div class="sync-change-checkbox-container" style="justify-content: space-around;">
                        <div class="sync-field-value">${change.oldVal}</div>
                        <p class="sync-change-arrow">➤</p>
                        <div class="sync-field-value">${change.newVal}</div>
                    </div>
                </label>
            `;
        }
        changesList.appendChild(div);
    });

    const checkboxes = modal.querySelectorAll('.sync-change-checkbox');
    if (!statusChange) {
        checkboxes.forEach(checkbox => checkbox.checked = true);
    }

    const selectAllBtn = modal.querySelector('#sync-select-all');
    let allChecked = !statusChange;

    const updateSelectAllBtnText = () => {
        selectAllBtn.textContent = allChecked ? 'Uncheck All' : 'Check All';
    };

    selectAllBtn.addEventListener('click', () => {
        allChecked = !allChecked;
        checkboxes.forEach(checkbox => checkbox.checked = allChecked);
        updateSelectAllBtnText();
        updateApplyButtonText();
    });
    updateSelectAllBtnText();

    const applyBtn = modal.querySelector('#sync-apply-changes');

    const updateApplyButtonText = () => {
        const checkedCount = modal.querySelectorAll('.sync-change-checkbox:checked').length;
        if (checkedCount === 0) {
            applyBtn.style.display = 'none';
        } else {
            applyBtn.style.display = 'block';
        }
    };

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateApplyButtonText);
    });
    updateApplyButtonText();

    document.body.appendChild(modal);

    modal.querySelector('#sync-apply-changes').addEventListener('click', () => {
        const selected = Array.from(modal.querySelectorAll('.sync-change-checkbox:checked'))
            .map(cb => changes[Array.from(changesList.children).indexOf(cb.closest('.sync-change-item'))]);
        
        if (selected.length === 0) {
            showNotification('Select somethig first!', 'warning');
            return;
        }

        const avatarIndex = savedAvatars.findIndex(a => a.avatarID === avatarID);
        selected.forEach(change => {
            savedAvatars[avatarIndex][change.field] = change.newVal;
        });

        GM_setValue('savedAvatars', savedAvatars);
        updateAvatarCard(avatarID);
        handleClose();
    });

    const handleClose = () => {
        modal.classList.add('exit');
        setTimeout(() => {
            modal.remove();
        }, 200);
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            handleClose();
        }
    });

    modal.querySelector('#sync-cancel-changes').addEventListener('click', () => {
        handleClose();
    });
}

async function Get_ID_And_Cookie() {
    try {
        authCookie = await getAuthCookieValue();
        const { responseText } = await SendRequest('GET', `https://api.vrchat.cloud/api/1/auth/user`, authCookie);
        const data = JSON.parse(responseText);
        userId = data.id;
    } catch (error) {
        showNotification(`Error while Get_ID_And_Cookie: ${error}`, 'error');
    }
}

async function getAuthCookieValue() {
    return new Promise((resolve) => {
        GM_cookie.list({
            domain: "vrchat.com",
            name: "auth"
        }, (cookies) => {
            resolve(cookies?.[0]?.value || null);
        });
    });
}

async function getUserID(keyName) {
    const data = JSON.parse(localStorage.getItem(keyName));
    if (!Array.isArray(data) || !data[0]?.user_id) {
        throw new Error('user_id not found in first item of array');
    }
    return data[0].user_id;
}

async function SendRequest(method, url, authCookie) {
    // showNotification(`Sending request to ${url}`, 'info', 15000);
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method,
            url,
            headers: {
                "Cookie": `auth=${authCookie}`
            },
            onload: async function(response) {
                if (response.status === 200) {
                    // Debug
                    const { responseText } = response;
                    const data = JSON.parse(responseText);
                    console.dir(data);
                    showNotification(`Request to ${url} completed with status ${response.status}`, 'success');
                    // -------

                    resolve(response);
                } else if (response.status === 404) {
                    showNotification(`Request failed!\nStatus: ${response.status}\nError: ${response.responseText}`, 'warning', 15000);
                    resolve(null);
                } else {
                    showNotification(`Request failed!\nStatus: ${response.status}\nError: ${response.responseText}`, 'warning', 15000);
                }
            }
        });
    });
}

async function GetPrivateAvatarInfo(method, url, authCookie) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method,
            url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Cookie": `auth=${authCookie}`
            },
            onload: function (response) {
                const htmlContent = response.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, "text/html");

                const metaData = {
                    title: doc.title,
                    metaTags: Array.from(doc.querySelectorAll('meta')).map(tag => ({
                        name: tag.getAttribute('name') || tag.getAttribute('property') || tag.getAttribute('itemprop'),
                        content: tag.getAttribute('content')
                    })),
                    scripts: Array.from(doc.querySelectorAll('script')).map(script => script.src),
                    styles: Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href)
                };

                const ogImageTag = metaData.metaTags.find(tag => tag.name === 'og:image');
                const ogTitleTag = metaData.metaTags.find(tag => tag.name === 'og:title');
                const ogDescriptionTag = metaData.metaTags.find(tag => tag.name === 'og:description');

                const [name, author] = ogTitleTag.content.trim().split(/[\s]*by[\s]*/).map(x => x.trim());

                const result = {
                    PrivateImage: ogImageTag.content,
                    PrivateName: name,
                    PrivateDescription: ogDescriptionTag.content,
                    PrivateAuthor: author
                };

                resolve(result);
            }
        });
    })
}

async function changeSelectedAvatar(avatarID) {
    const authCookie = await getAuthCookieValue();
    await SendRequest('PUT', `https://api.vrchat.cloud/api/1/avatars/${avatarID}/select`, authCookie);
    showNotification(`Avatar selected: ${avatarID}!`, 'success');
}

function ConnectToSocket() {
    const socketUrl = `wss://vrchat.com/?authToken=${authCookie}`;
    const server = new WebSocket(socketUrl);

    server.addEventListener('open', function (event) {
        console.log('[DT][WebSocket] Соединение установлено:', event);
    });
    server.addEventListener('message', function (event) {
        try {
            const message = JSON.parse(event.data);
            console.dir(message);
            const dataContent = JSON.parse(message.content);
            if (message && message.type === 'user-update') {
                console.log(`[DT][WebSocket] Получено сообщение типа: ${message.type} id ${dataContent.user.currentAvatar}`);
                CheckCurrentAvatar(message.content.currentAvatar);
            }
        } catch (error) {
            console.error('[DT][WebSocket] Ошибка при обработке сообщения:', error);
        }
    });

    server.addEventListener('error', function (event) {
        console.error('[DT][WebSocket] Произошла ошибка:', event);
    });

    server.addEventListener('close', function (event) {
        console.log('[DT][WebSocket] Соединение закрыто:', event);
    });
}

async function CheckCurrentAvatar(currentAvatarId) {
    // получение текущего аватара
    const { responseText } = await SendRequest('GET', `https://api.vrchat.cloud/api/1/users/${userId}/avatar`, authCookie);
    const data = JSON.parse(responseText);

    // получение списка сохраненных аватаров
    const savedAvatars = GM_getValue('savedAvatars', []);

    // сравнение текущего аватара с сохраненными
    for (const savedAvatar of savedAvatars) {
        if (savedAvatar.avatarID === data.id) {
            console.log(`аватар найден: ${data.id} его имя в массиве: ${savedAvatar.avatarName}`);
            return;
        }
    }
}

async function awaitForElement(selector, timeout = 5000) {
    try {
        await awaitForLoadingToDisappear();

        const element = document.querySelector(selector);
        if (element) return element;

        return new Promise((resolve, reject) => {
            let interval, timeoutId;

            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    clearTimeout(timeoutId);
                    resolve(element);
                }
            };

            interval = setInterval(checkElement, 100);

            timeoutId = setTimeout(() => {
                clearInterval(interval);
                showNotification(`Timed out waiting for ${selector}`, 'error');
                reject(new Error(`Timed out waiting for ${selector}`));
            }, timeout);
        });
    } catch (error) {
        showNotification(`Error while waiting for ${selector}: ${error.message}`, 'error');
        throw error;
    }
}

async function awaitForLoadingToDisappear(maxWaitTime = 1000) {
    const loadingElement = document.querySelector('[aria-label="Loading"]');
    if (!loadingElement) return;
    try {
        return new Promise((resolve) => {
            const startTime = Date.now();
            let timeoutId;
    
            const checkLoading = () => {
                const loadingElement = document.querySelector('[aria-label="Loading"]');
                
                if (!loadingElement) {
                    clearTimeout(timeoutId);
                    resolve();
                } else if (Date.now() - startTime > maxWaitTime) {
                    clearTimeout(timeoutId);
                    resolve();
                } else {
                    timeoutId = setTimeout(checkLoading, 100);
                }
            };
            
            checkLoading();
        });
    } catch (error) {
        showNotification(`Error while waiting for loading to disappear: ${error.message}`, 'error');
        throw error;
    }
}

function parseCustomDate(dateString) {
    if (!dateString) return new Date(0);
    const dateParts = dateString.split(', ');
    if (dateParts.length === 2) {
        const [date, time] = dateParts;
        const [day, month, year] = date.split('.').map(Number);
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    } else if (dateString.includes('.')) {
        const [day, month, year] = dateString.split('.').map(Number);
        return new Date(year, month - 1, day);
    } else if (dateString.includes('-')) {
        return new Date(dateString);
    }
    return new Date(dateString);
}

function updateCounter() {
    const avatars = getAllSavedAvatars();
    const counter = document.querySelector('.counter');
    if (avatars.length !== lastUpdaterAvatars) {
        counter.textContent = avatars.length;
        mainWindow_TotalPages = Math.ceil(avatars.length / mainWindow_MaxRender);
    }
    else {
        counter.textContent = lastUpdaterAvatars;
    }
    lastUpdaterAvatars = avatars.length;
}

function getAllSavedAvatars() {
    return GM_getValue('savedAvatars', []);
}

function FixDisplayTime(time) {
    let date = new Date(time);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
}

function saveSortSettings(currentSort, isReversed) {
    sortSettings = { sortBy: currentSort, isReversed: isReversed };
    GM_setValue('sortSettings', sortSettings);
}

function updateAvatarCard(avatarID) {
    const avatarCard = document.querySelector(`[data-avatar-id="${avatarID}"]`);
    if (avatarCard) {
        avatarCard.remove();
        const avatarData = savedAvatars.find(a => a.avatarID === avatarID);
        createAvatarCard(avatarData);
        showNotification('Avatar Updated!', 'success');
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    const container = document.getElementById('notification-container');
    if (type === 'error') {
        console.error(message);
        duration = 0;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="status-icon">${getIcon(type)}</div>
        <div class="message">${message}</div>
        <div class="progress-bar"></div>
    `;

    container.prepend(notification);

    enforceNotificationLimit(container);

    setTimeout(() => notification.classList.add('show'), 50);

    const progressBar = notification.querySelector('.progress-bar');
    if (duration > 0) {
        progressBar.style.transitionDuration = `${duration}ms`;
        requestAnimationFrame(() => {
            progressBar.style.transform = 'scaleX(0)';
        });
    } else {
        progressBar.style.display = 'none';
    }

    function close() {
        notification.classList.remove('show');
        notification.classList.add('hide');

        notification.addEventListener('transitionend', () => {
            notification.remove();
        }, { once: true });
    }

    notification.addEventListener('click', close);

    if (duration > 0) {
        setTimeout(close, duration);
    }
}

function enforceNotificationLimit(container) {
    const notifications = Array.from(container.children);
    const maxNotifications = 10;

    if (notifications.length > maxNotifications) {
        const excessCount = notifications.length - maxNotifications;
        for (let i = 0; i < excessCount; i++) {
            const oldNotification = notifications[i];
            oldNotification.classList.remove('show');
            oldNotification.classList.add('hide');
            oldNotification.addEventListener('transitionend', () => {
                oldNotification.remove();
            }, { once: true });
        }
    }
}

function getIcon(type) {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    return icons[type] || '';
}

history.pushState = function(state, title, url) {
    originalPushState.apply(history, arguments);
    handleUrlChange(url || window.location.href);
};

history.replaceState = function(state, title, url) {
    originalReplaceState.apply(history, arguments);
    handleUrlChange(url || window.location.href);
};

window.addEventListener('popstate', () => {
    handleUrlChange(window.location.href);
});

async function handleUrlChange(url) {
    try {
        const path = new URL(url, window.location.origin).pathname;
        // showNotification(`Path: ${path}`, 'info');
    
        if (path === '/home/custom-favorites' && !isCustomFavoritesMenuOpen) {
            homeContentElement = await awaitForElement('.home-content');
            const firstChild = homeContentElement.firstElementChild;
            if (firstChild === null) {
                openCustomFavorites();
            } else {
                firstChild.style.display = 'none';
                openCustomFavorites();
            }
        } else if (path !== '/home/custom-favorites' && isCustomFavoritesMenuOpen) {
            homeContentElement = await awaitForElement('.home-content');
            const oldCreatedWindow = document.getElementById('custom-favorites-window');
            if (oldCreatedWindow) {
                oldCreatedWindow.remove();
            }
            if (homeContentElement.firstElementChild) {
                homeContentElement.firstElementChild.style.display = 'block';
                isCustomFavoritesMenuOpen = false;
            } else {
                showNotification('Home content element not found, trying to open again', 'error');
                handleUrlChange(url);
            }
        }
    } catch (error) {
        showNotification(
            `Error while handling URL change: ${error.message}\nStack trace: ${error.stack}`,
            'error'
        );
    }
}