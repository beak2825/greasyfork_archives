// ==UserScript==
// @name         WhatsApp Web
// @namespace    Angular Layout
// @description  New angular layout for WhatsApp Web
// @version      0.0.1
// @author       UID 2825755
// @run-at       document-end
// @icon         data:image/png;base64,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
// @match        *://web.whatsapp.com/
// @include      *://web.whatsapp.com/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/12647/WhatsApp%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/12647/WhatsApp%20Web.meta.js
// ==/UserScript==

GM_addStyle ( "                                     \
    .avatar, .avatar-image {                        \
        background-color: lightgrey !important;     \
    }                                               \
    * { \
        border-radius: 0px !important;              \
    }                                               \
    .app-wrapper::before {                          \
        background-color: transparent !important;   \
    }                                               \
    .app {                                          \
        top: 0px !important;                        \
        height: 100% !important;                    \
        width: 100% !important;                     \
    }                                               \
    .drawer-container-mid, .drawer-container-right, .pane-chat, .pane-intro { \
        width: 100% !important;                     \
    }                                               \
" );