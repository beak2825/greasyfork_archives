// ==UserScript==
// @name         Slack AIM Away Skin
// @namespace    https://lucidinternets.com/
// @version      2024-01-05
// @description  Make the Slack status page look like AIM Awae Message page.
// @author       MallardDuck
// @match        https://app.slack.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483979/Slack%20AIM%20Away%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/483979/Slack%20AIM%20Away%20Skin.meta.js
// ==/UserScript==

GM_addStyle ( `
.p-custom_status_modal {
    background-color: rgb(213, 209, 200);
    border: 1px solid white;

    &, & > .c-sk-modal_header {
        border-radius: 0;
    }

    & > .c-sk-modal_header,
    & > .c-sk-modal_content,
    & > .c-sk-modal_footer {
        background: unset;
    }

    & > .c-sk-modal_header {
        background-image: linear-gradient(to right, rgba(54,39,155,1), rgba(213, 209, 200,0));
        color: white;

        &, & > .c-sk-modal_title_bar {
            min-height: unset;
        }

        & > .c-sk-modal_title_bar {
            padding: .25rem;
        }

        & .c-sk-modal_title_bar__text > h1::before {
            font-size: 1rem;
            content: "Edit Away Message";
            font-weight: 400;
        }
        & .c-sk-modal_title_bar__text > h1 {
            font-size: 0;
        }
    }

    & > .c-sk-modal_header::after {
        background-color: rgb(213, 209, 200);
        content: "Enter new Away message:";
        color: black;
        padding-top: .5rem;
        padding-left: 1rem;
        height: 32px;
        width: 100%;
        display: inline-block;
    }

    & > .c-icon_button--default {
        background-color: rgb(213, 209, 200);
        border-radius: 0;
        width: 24px;
        height: 24px;
        top: 2px;
        right: 4px;
        border-width: 2px;
        border-style: outset;
        border-color: buttonface;
        border-right-color: #424242;
        border-bottom-color: #424242;

        & > svg {
            --s: 8px !important;
            width: 16px;
            height: 16px;
        }
    }

    & > .c-icon_button--default,
    & .c-button {
        background-color: rgb(213, 209, 200);
        border-radius: 1px;
        border-width: 2px;
        border-style: outset;
        border-color: buttonface;
        border-right-color: #424242;
        border-bottom-color: #424242;

    }
}
` );