// ==UserScript==
// @name         UI_2023_JVC_JS
// @namespace    UI_2023_JVC_JS
// @version      7.3.3
// @description  Enleve les border radius abusifs de la mise à jour à jour décembre 2023 (JVC) (JS).
// @author       Atlantis
// @match        *://www.jeuxvideo.com/*
// @grant        none
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/128px/1f7e7.png
// @license      CC0-1.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526133/UI_2023_JVC_JS.user.js
// @updateURL https://update.greasyfork.org/scripts/526133/UI_2023_JVC_JS.meta.js
// ==/UserScript==

/* SKIN CSS : https://userstyles.world/style/17542/ */

const style = document.createElement("style");
style.textContent = `

    /* CODE */

    /* Buttons */
    .btn {
        border-radius: 5.5px;
    }

    .userParameters {
        border-radius: 0.4rem;
    }

    .link-plus-de-comm {
        border-radius: 0.3rem !important;
    }

    .valider-modif-profil {
        border-radius: 0.3rem;
    }

    .toast,
    .alert {
        border-radius: 0.3rem !important;
    }

    .headerAccount__dropdownContainer {
        border-radius: 0.4rem !important;
    }

    .header__navList--lvl2 {
        border-radius: 0.5rem;
    }


    .quickAccessButton {
        border-radius: 5.5px !important;
    }

    .card-img-top {
        border-radius: 0.4rem !important;
    }

    .form-select,
    .form-control {
        border-radius: 0.4rem;
    }

    .modalWrapper__main {
        border-radius: 5px;
    }

    .imageUploadEditor__preview {
        border-radius: 0.2rem;
    }

    /* Forums */
    .survey__removeSurvey,
    .survey__addSurvey {
        color : var(--jv-blue-gray-color)
    }

    .survey__icon,
    .postMessage__loader,
    .postMessage__icon,
    /*PUB*/
    .js-layout-adHeader,
    .layout__videoFooter,
    .sponsoTab__link,
    .newsletter-popin-modal,
    .ads.anchorWrapper.js-tracking-widget {
        display: none;
    }

    .gameHeaderSubNav__itemLink--active {
        border-radius: 0.4rem;
    }


    #input-topic-title ,
    .messageEditor__containerEdit {
        border-radius: 0.3rem !important;
        box-shadow: none;
        border-color: var(--jv-input-border-color) !important;
    }

    .messageEditor__containerEdit {
        display: grid;
    }

        .messageEditor__buttonEdit {
            order: -1;
            border-top: none;
            border-bottom: 0.0625rem solid var(--jv-border-color);
        }

        .messageEditor__buttonEdit {
            background-color: var(--jv-bg-color-light);
            margin: 0;
        }

        .buttonsEditor {
            margin: 0 0.625rem;
        }

    .messageEditor__containerPreview {
        background-color: inherit;
        border-radius: 0.3rem !important;
    }

    .message__urlImg {
        margin-bottom: 0;
    }

    .topic-list {
        border-radius: 0.3rem;
    }

    .tablesForum {
        border-radius: 0.3rem;
    }

    .bloc-message-forum {
        border-radius: 0.3rem;
    }

    .nouveau-msg > a {
        border-radius: 0.3rem !important;
    }

    .bloc-pre-pagi-forum {
        border-radius: 0rem;
        border-top: none;
        border-left: none;
        border-right: none;
        padding-left: 0;
        padding-right: 0;
        background-color: transparent;
    }

    .btn-lancer-rech {
        border-top-right-radius: 0.3rem !important;
        border-bottom-right-radius: 0.3rem !important;
    }

    .select-search {
        border-top-left-radius: 0.3rem !important;
        border-bottom-left-radius: 0.3rem !important;
    }

    .searchBar__form {
        border-radius: 0.4rem ;
    }

    /* Profil */
    .fiche-abonne {
        border-radius: 0.3rem;
    }

    .wrapper-avatar img {
        border-radius: 0.3rem !important;
    }

    .label-tag {
        border-radius: 0.3rem;
    }

    .type-notif {
        border-radius: 0.3rem !important;
    }

    .bloc-default-profil {
        border-radius: 0.4rem ;
    }

    .bloc-default-profil-body {
        border-radius: 0.4rem ;
    }

    .last-messages {
        border-radius: 0.4rem !important;
    }

    .list-menu-profil {
        border-radius: 0.5rem !important;
    }

    .menu-profil .list-menu-profil .lien-profil {
        border-radius: 0.5rem;
    }

    .simpleButton {
        border-radius: 0.4rem ;
    }

    .link-rediger-article {
        border-radius: 0.5rem ;
    }

    .mon-karma-profil-general {
        border-radius: 0.4rem ;
    }

    /*
    .form-check-input:focus {
        border-color: #5cb85c;
        box-shadow: 0 0 0 .25rem rgba(92,184,92, 0.25);
    }
    .form-check-input:checked {
        background-color: #5cb85c;
        border-color: #5cb85c
    }
    */

    .liste-profil-general .profile-link {
        border-radius: 0.4rem !important;
    }

    .link-articles-precedents.notif-prec {
        border-radius: 0.3rem;
    }

    /* MP */

    #mp-menus {
        border-radius: 0.4rem;
    }

    .action-bar .btn {
        border-radius: 5.5px !important;
    }

    .action-bar .btn-25-msg {
        border-radius: 0.3rem !important;
    }

    .label-default {
        border-radius: 0.2rem !important;
    }

    /* Pagination */
    .bloc-pagi-default .page-active {
        border-radius: 0.3rem;
    }

    .bloc-pagi-default .pagi-debut-actif,
    .bloc-pagi-default .pagi-fin-actif,
    .bloc-pagi-default .pagi-precedent-actif,
    .bloc-pagi-default .pagi-suivant-actif,
    .bloc-pagi-default .pagi-debut-inactif,
    .bloc-pagi-default .pagi-fin-inactif,
    .bloc-pagi-default .pagi-precedent-inactif,
    .bloc-pagi-default .pagi-suivant-inactif {
        border-radius: 0.3rem !important;

        max-width: 36px;
        max-height: 36px;
        align-items: center;
        display: flex;
        justify-content: center;
    }

    /* Cards */

    /*top forum*/
    .card__badge--counter {
        border-radius: 0.4rem;
    }

    /*top card inherit of parent*/
    .card > .card-header {
        border-radius: 0;
    }

    .card {
        border-radius: 0.3rem !important;
    }

    /*homepage = card--default*/
    .card--cover .card-img,
    .card--cover .card-img-overlay,
    .card--cover .card__contentType {
        border-radius: 0.4rem !important;
    }
`;
if (document.head) document.head.append(style);
else setTimeout(() => document.head.append(style), 300);
