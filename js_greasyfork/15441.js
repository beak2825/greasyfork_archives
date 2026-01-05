// ==UserScript==
// @name           Kongregate Chat Timestamp Killer
// @namespace      tag://kongregate
// @description    Remove timestamps from kong chat and fix whitespace
// @author         aspyderwebb
// @version        0.0.6
// @date           3.25.2016
// @include        http://www.kongregate.com/games/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/15441/Kongregate%20Chat%20Timestamp%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/15441/Kongregate%20Chat%20Timestamp%20Killer.meta.js
// ==/UserScript==    
GM_addStyle (" .timestamp { display: none !Important; } #kong_game_ui .chat_message_window p .username, #kong_game_ui .chat_message_window p .guildname, #kong_game_ui .chat_message_window p .separator, #kong_game_ui .chat_message_window p .message { display: inline !important; float: none !important; max-width: 97%; } #kong_game_ui .chat_message_window p .separator { margin-right:-.25em !important; }  #kong_game_ui .chat_message_window p { padding: 1px 2px 1px 2px !important; } ") ;