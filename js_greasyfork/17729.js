// ==UserScript==
// @name            MuteList *OLD*
// @namespace       skyboy@kongregate
// @author          skyboy
// @version         1.0.1
// @description     Adds a /mutelist <regxp> command
// @include         http://www.kongregate.com/games/*/*
// @exclude         http://www.kongregate.com/games/*/*/*
// @homepage        http://userscripts-mirror.org/scripts/show/73254
// @downloadURL https://update.greasyfork.org/scripts/17729/MuteList%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17729/MuteList%20%2AOLD%2A.meta.js
// ==/UserScript==
if (/^\/?games\/[^\/]+\/[^\/?]+(\?.*)?$/.test(window.location.pathname))
setTimeout(function() {
window.location.assign("javascript:holodeck.addChatCommand(\"mutelist\", function(h,d){d=d.match(/^\\/mutelist\\s*(\\S+)?/i)[1];var a=0,b=holodeck._chat_window._mutings,s=\"\",p,o=[];if(!!d){for(p in b){if(b[p]&&p.match(d)){o.push(p)}}a=o.length+' matching users muted:\\xa0 '+o.join(', \\xa0')}else{for(p in b){s+=p+', \\xa0';++a};a=a+' users muted:\\xa0 '+s.substr(0,s.length-3);}h.activeDialogue().kongBotMessage(a);return false});void(0)");
}, 1250);