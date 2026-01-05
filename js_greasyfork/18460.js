// ==UserScript==
// @name        Inverted Telegram
// @description “Telegram web for night owls”
// @namespace   https://tripu.info/
// @version     0.0.1
// @include     https://web.telegram.org*
// @license     GNU General Public License v3.0 only
// @license     https://spdx.org/licenses/GPL-3.0.html
// @supportURL  https://tripu.info/
// @author      tripu
// @downloadURL https://update.greasyfork.org/scripts/18460/Inverted%20Telegram.user.js
// @updateURL https://update.greasyfork.org/scripts/18460/Inverted%20Telegram.meta.js
// ==/UserScript==

'use strict';

var style = 'body, div.im_dialogs_col_wrap, div.im_history_col_wrap { background-color: #404040; color: #c0c0c0; }';
document.styleSheets[document.styleSheets.length - 1].insertRule(style, 0);
