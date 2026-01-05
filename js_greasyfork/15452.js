// ==UserScript==
// @name           Kongregate Chat Timestamp Mover
// @namespace      tag://kongregate
// @description    Moves timestamps to the same line as the username.
// @author         aspyderwebb
// @version        0.0.5
// @date           12.26.2015
// @include        http://www.kongregate.com/games/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/15452/Kongregate%20Chat%20Timestamp%20Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/15452/Kongregate%20Chat%20Timestamp%20Mover.meta.js
// ==/UserScript==   

GM_addStyle( " #kong_game_ui .chat_message_window p .username, #kong_game_ui .chat_message_window p .guildname, #kong_game_ui .chat_message_window p .separator, #kong_game_ui .chat_message_window p .message { display: inline !important; float: none !important; max-width: 97%; }  .timestamp { display: inline !Important; margin-right:.25em !important; } #kong_game_ui .chat_message_window p .separator { margin-right:-.25em !important; } " ) ;