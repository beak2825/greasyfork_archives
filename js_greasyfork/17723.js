// ==UserScript==
// @name            Green Friends *OLD*
// @namespace       skyboy@kongregate
// @author          skyboy
// @version         1.1.0
// @description     Friends names appear green in chat
// @include         http://www.kongregate.com/games/*/*
// @exclude         http://www.kongregate.com/games/*/*/*
// @homepage        http://userscripts-mirror.org/scripts/show/72289
// @downloadURL https://update.greasyfork.org/scripts/17723/Green%20Friends%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17723/Green%20Friends%20%2AOLD%2A.meta.js
// ==/UserScript==
if (/^\/?games\/[^\/]+\/[^\/?]+(\?.*)?$/.test(window.location.pathname))
setTimeout(function() {
window.location.assign("javascript:(function(){var f=ChatDialogue.prototype.displayUnsanitizedMessage,t=ChatDialogue.prototype.displayUnsanitizedMessage=function(e,d,a,b,q){if(!a){a={}}if(this._user_manager.isFriend(e)){a['class']?a['class']+=' friend_message':a['class']='friend_message'};return f.call(this,e,d,a,b)};t=document.createElement('span');t.update('<style>#kong_game_ui .chat_message_window .friend_message .chat_message_window_username{color:#288855 !important}</style>');$('gamepage_header').appendChild(t)})();void(0)");
}, 1250);