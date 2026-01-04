// ==UserScript==
// @name          Telegram Web better CSS
// @name:de          Telegram Web besseres CSS
// @namespace     http://tampermonkey.net/
// @version       0.7.6
// @description   Changes the CSS of web telegram to more contrast, message separation, broader view and one-line buttons  (if text is short - beta ^^)
// @description:de   Ändert das CSS von Web-Telegram zu mehr Kontrast, Trennenung von Nachrichten, breitere Anzeige und einzeilige Buttons (für kurzen Text - beta ^^)
// @author        Eld0r
// @match         https://web.telegram.org/
// @grant         none
// @copyright      2018, Eld0r (https://gist.github.com/Eld0r)
// @copyright:de      2018, Eld0r (https://gist.github.com/Eld0r)
// @license        CC-BY-NC-ND-3.0 (https://creativecommons.org/licenses/by-nc-nd/3.0/legalcode)
// @license:de        CC-BY-NC-ND-3.0 de (https://creativecommons.org/licenses/by-nc-nd/3.0/de/legalcode)
// @downloadURL https://update.greasyfork.org/scripts/368150/Telegram%20Web%20better%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/368150/Telegram%20Web%20better%20CSS.meta.js
// ==/UserScript==

// Feel free to leave GIST or greasyfork Comments
// wishes or suggestions for further CSS adjustments are welcome
// - or even scripts for other websites ;)

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
  'use strict';
  var css = `
/* Message Separation / Contrast */
    body {
        background: #DDD;
    }
    .im_history_col {
        background: #DDD;
    }
    .im_content_message_wrap {
        background: #FFF;
    }
    .im_message_reply {
        background: #DDD;
    }
    .im_send_form_wrap {
        background: #FFF;
    }
    .im_message_date_split {
        background: #FFB;
    }
    .im_message_unread_split {
        background: #FFB;
    }

/* Better Select / Contrast */
    .im_message_selected .im_message_outer_wrap {
        background: #CCF;
    }
    .im_history_select_active .im_message_outer_wrap:hover {
        background: #BBF;
    }
    .im_message_focus_active {
        background: #00F;
    }

/* Broarder View */
    .im_page_wrap {
        border-radius: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
    }
    .im_message_wrap {
        max-width: 100%;
        padding: 0 0 0 15px;
    }
    .im_send_panel_wrap {
        max-width: 100%;
    }
    .im_send_form {
        max-width: 100%;
    }
    .im_history_messages {
        margin: 0 20px 0 0;
    }
    .im_dialogs_col .nano > .nano-pane > .nano-slider {
        width: 8px;
        margin: 0 -3px
    }
    .im_history_col .nano > .nano-pane > .nano-slider{
        width: 12px;
    }

/* Better Buttons */
    .reply_markup_button_w4 {
        width: auto;
    }
    .reply_markup_button_w3 {
        width: auto
    }
    .reply_markup_button_w2 {
        width: auto;
    }
    .reply_markup_button_w1 {
        width: auto;
    }
    .reply_markup {
        width: 100%;
    }
    .reply_markup_row {
        float: left;
        padding: 0;
    }
    .reply_markup_button {
        height: auto;
        background: #DDF;
        padding: 0.4em 0.5em 0.45em 0.5em;
    }
    .reply_markup_button:hover {
        background: #CCF;
    }
    .reply_markup_button_wrap {
        padding: 2px;
    }
    .reply_markup_wrap {
        margin: 0;
        padding: 2px;
    }

/* Better Checkbox / Contrast */
    .tg_checkbox span.icon-checkbox-outer {
        background-color: #FAA;
    }
    .tg_checkbox i.icon-checkbox-inner {
        background-color: #A88;
    }
    .tg_checkbox.tg_checkbox_on span.icon-checkbox-outer {
        background-color: #8F8;
    }
    .tg_checkbox.tg_checkbox_on i.icon-checkbox-inner {
        background-color: #0A0;
    }
`;
  addGlobalStyle(css);
})();
