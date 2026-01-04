// ==UserScript==
// @name         CAI Chat2 Look
// @description  Makes the CAI chat interface look more like the old chat2 interface
// @version      0.3.10
// @namespace    https://ShareYourCharacters.com/
// @author       SycAdmin
// @match        https://character.ai/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/509868/CAI%20Chat2%20Look.user.js
// @updateURL https://update.greasyfork.org/scripts/509868/CAI%20Chat2%20Look.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@200;400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        * {
            font-family: 'Noto Sans', sans-serif !important;
        }

        body, .bg-background {
            background-color: #242525;
            color: rgba(229, 224, 216, 0.85) !important;
        }

        .bg-primary-foreground {
            background-color: #242525;
        }

        /* always show avatars */
        #chat-messages > div.group > div > div.items-center.hidden:first-child {
            display: block !important;
        }
        div#chat-messages div.swiper-slide div.hidden:first-child {
            display: flex !important;
        }

        /* center letter drawn when speaker lacks image (to fix another fix) */
        span.rounded-full > div.justify-center {
            justify-content: center !important;
            font-size: 1.125rem !important;
        }
        /* message text */
        div.prose p {
            /* font-family: 'Noto Sans', sans-serif !important; */
            /* font-size: 16px; */
            font-size: 1rem !important;
            font-weight: 400;
            color: rgba(229, 224, 216, 0.85) !important;
        }
        div.prose strong,h1,h2,h3,h4,h5,h6 {
            color: rgba(229, 224, 216, 0.85) !important;
        }
        div.prose a {
            color: rgb(35, 148, 253) !important;
            decoration-color: rgb(35, 148, 253) !important;
        }

        button {
            color: rgba(229, 224, 216) !important;
        }


        div.absolute button {
           background-color: rgba(13, 13, 13, 0.2);
        }

        div.w-full > .absolute > .absolute > button {
            margin-right: 2rem;
        }

        /* speaker name */
        #chat-messages div.text-small, /* old version */
        #chat-messages div.text-sm {
            font-family: 'Noto Sans', sans-serif !important;
            font-weight: 650;
            font-size: 15px;
        }

        .max-w-xl {
            max-width: 824px;
        }
        .max-w-3xl {
            max-width: 824px;
        }

        #chat-messages {
            padding-right: 3rem;
        }
        #chat-messages > div:last-child {
            padding-left: 3rem;
        }
        div.align-middle.h-full.overflow-y-scroll {
            overflow-y: hidden;
        }

        .text-muted-foreground > a {
           color: rgba(172, 168, 162, 0.925);
        }

        /* message timestamp */
        #chat-messages div.text-small.text-muted-foreground, /* old version */
        #chat-messages div.text-sm.text-muted-foreground {
            display: none;
        }
        #chat-messages p + div.text-sm.text-muted-foreground {
            display: block;
            font-weight: 300;
        }

        div.text-sm.bg-secondary {
            height: min-content;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px;
            margin-left: 5px;
            background-color: rgb(60, 133, 246);
            color: rgb(229, 224, 216);
            font-weight: 600;
            font-size: 12px;
            --darkreader-inline-bgcolor: #1c4d99;
            --darkreader-inline-color: #e5e0d8;
            background-color: rgb(28, 77, 153);
            padding-left: .25rem;
            padding-right: .25rem;
            padding-top: 0;
            padding-bottom: 0;
        }

        .rounded-2xl {
            border-radius: .25rem;
        }

        span.rounded-full, img.object-cover {
            min-width: 45px !important;
            min-height: 45px !important;
        }

        /* "Edited" text shown below edited message */
        #chat-messages p.text-sm.text-muted-foreground {
           font-size: 12px;
           color: rgb(131, 174, 213) !important;
           --darkreader-inline-color: #83aed5;
        }
        /* Left-justify prose with name of speaker */
        .px-3 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
        }
        /* Left-justify prose */
        #chat-messages div.justify-center {
            justify-content: start;
        }
        /* Left-justify leftmost star with text */
        .rah-static + .-bottom-0 {
            margin-left: 45px;
        }

        div.pr-4 * {
            background-color: #242525;
        }
        textarea::placeholder {
            color: rgb(207, 201, 191, 0.7) !important;
        }
        textarea {
            font-family: 'Noto Sans', sans-serif !important;
              font-size: 11pt; padding: 3px; min-height: 24px; overflow: hidden; height: 28px;
        }

        p.text-muted-foreground.select-none {
            /* this is the reminder that everything characters say is made up */
            /* color: rgb(200, 103, 106) !important; */
            display: none;
        }

        /* Use less obtrusive colors for new reminder that the bot is just an A.I. */
        p.text-foreground.select-none {
            color: rgba(229, 224, 216, 0.85);
            animation: aiReminderFadeColor 10s forwards;
        }
        p.text-foreground.select-none:hover {
            color: rgba(229, 224, 216, 0.85) !important;
        }
        #chat-body > div:last-child > div:last-child > button:last-child {
            background-color: transparent;
        }
        #chat-body > div:last-child > div:last-child > button:last-child > svg:last-child {
            color: rgba(229, 224, 216, 0.85);
            animation: aiReminderFadeColor 10s forwards;
        }
        @keyframes aiReminderFadeColor {
            from { color: rgba(229, 224, 216, 0.85); }
            to { color: rgba(229, 224, 216, 0.3); }
        }

      /* reduce padding at bottom of window */
      div.pb-4.z-10 {
           padding-bottom: 0;
      }

      /* the Call button */
      div.pb-4.z-10 > div > button {
          /* color: rgba(229, 224, 216, 0.85); */
          display: none;
      }

      /* arrow of Send button */
      button[aria-label="Send a message..."] > div > svg {
          color: rgb(88, 126, 224);
          background-color: transparent;
      }
      /* circle of Send button */
      button[aria-label="Send a message..."] {
          background-color: transparent;
      }
      /* square of Send button */
      div.flex.gap-3 {
          background-color: transparent;
      }


      div.swiper-slide > div > div.absolute > div.flex button {
           background-color: transparent;
      }

      /* Cancel button when editing */
      #chat-messages > div.group div:last-child > div.flex.gap-2 > button:first-child {
          background-color: transparent;

          color: rgb(99, 165, 216) !important;
          font-family: "Roboto", "Helvetica", "Arial", sans-serif !important;
          font-weight: 500;
          text-transform: uppercase;

          border-color: rgb(39, 98, 156);
          border-width: 0.8px;
          border-radius: .25rem;
      }

      /* Save button when editing */
      #chat-messages > div.group div:last-child > div.flex.gap-2 > button:last-child {
          background-color: rgb(39, 98, 156);

          font-family: "Roboto", "Helvetica", "Arial", sans-serif !important;
          color: rgb(229, 224, 216) !important;
          font-weight: 500;
          text-transform: uppercase;

          border-radius: .25rem;
      }

      /* upper-left panel button */
      .text-icon-secondary {
          color: rgba(229, 224, 216, 0.66);
      }



        /* on the editing screen, bring the Back button out from behind the side panel button */
        main.min-h-screen > div:first-child > div:first-child > div:first-child > button {
            margin-left: 2rem;
        }
        /* the editing screen avatar image */
        form > div > div.space-y-2:first-child,
        form > div > div.space-y-2:first-child > button > div >span {
            width: 200px !important;
            height: 200px !important;
        }
        /* the editing screen labels */
        form label, form > div:first-child > div:last-child > p.text-md.font-medium {
            font-size: 1rem !important;
            color: rgba(232, 230, 227, 0.85) !important;
            font-weight: 700 !important;
            text-decoration: none !important;
        }
        /* the text input areas */
        textarea, input {
            font-size: 1rem !important;
            border-radius: .25rem !important;
        }
        textarea {
            resize: vertical !important;
            max-height: none !important;
            line-height: 1.5 !important;
        }
        /* the Description textarea */
        #\:r9\:-form-item {
            height: 160px;
        }
        /* the "Keep Character definition private" checkbox */
        form button[role="checkbox"][data-state="checked"] {
            background-color: transparent;
        }
        form button[role="checkbox"][data-state="unchecked"]:has(+ input[name="copyable"]) {
            background-color: #990000;
        }
        /* the "Save and Chat" button */
        form > div > button[type="submit"]:last-child {
            background-color: rgb(39, 98, 156);
        }
        /* Make Greetings resizable */
        textarea.flex-1 {
            flex: 1 1 auto;
        }



        /* color of buttons of selected modes in user preferences */
        .bg-primary {
            background-color: rgb(39, 98, 156);
        }

        /* the notifications that descend from the top of the screen */
        div.Toastify > div.Toastify__toast-container > div.Toastify__toast {
            background-color: rgba(39, 98, 156, 0.85);
            color: rgb(248, 242, 234) !important;
        }

        /* the column in the profile where it displays your bots */
        div[role="tabpanel"] {
            max-width: 34rem !important;
            min-width: 32rem;
        }

        /* taglines in profile and in search */
        div[role="tabpanel"] p.text-ellipsis,
        a.group p.text-ellipsis.w-full {
            overflow: visible;
            white-space: normal;
            display: block;

            font-size: 14px !important;
            font-weight: 200 !important;
            color: rgba(232, 230, 227, 0.85) !important;
        }

        /* Restyle the Default layout */
        #chat-messages .bg-surface-elevation-2,
        #chat-messages .bg-surface-elevation-3 {
            background-color: transparent;
        }
        .flex-row-reverse > .flex-col > div {
            padding-left: 0;
            margin-left: 0;
        }
        div#chat-messages > div.group > div.flex-row-reverse {
            flex-direction: row;
            margin-right: 0;
            margin-left: 0;
        }
        @media only screen and (min-width: 768px) {
            div#chat-messages > div.group > div.flex-row-reverse {
                margin-left: 1.5rem;
            }
        }
        /* remove indent of bot's messages in mobile view */
        @media only screen and (max-width: 768px) {
            div#chat-messages > div.group .mx-2 {
                margin-left: 0 !important;
            }
            div#chat-messages > div.group .px-3 {
                padding-left: 0 !important;
            }
        }
        div#chat-messages > div.group > div.flex-row-reverse > div.items-end {
            align-items: flex-start;
        }
        /* relevant to default chat style */
        div#chat-messages > div.group .py-3 {
            padding-top: 0;
            padding-bottom: 1rem;
        }
        /* relevant to classic chat style */
        div#chat-messages > div.group .pb-4 {
            padding-top: 0;
            padding-bottom: 1rem;
        }
        div#chat-messages > div.group {
            margin-top: 5px;
        }

        /* the "..." button of a message */
        #chat-messages > .group > .absolute.right-6 {
            right: 0;
            top: 0;
            left: auto;
        }

   `);
})();