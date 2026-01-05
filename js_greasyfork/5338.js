// ==UserScript==
// @name       PadeiroWoot!
// @namespace  http://www.memebook.com.ar/
// @version    6.9
// @description  AutoWoot das Montanhas!
// @match      https://plug.dj/*
// @copyright  2014+, Padeiro
// @downloadURL https://update.greasyfork.org/scripts/5338/PadeiroWoot%21.user.js
// @updateURL https://update.greasyfork.org/scripts/5338/PadeiroWoot%21.meta.js
// ==/UserScript==

var baseUrl = "/web/20140512220953/http://i.imgur.com/";
var wooting = true;
 
function startWooting() {
        stopWooting();
 
        API.on(API.ADVANCE, function() {
	wootSong();
	});
        API.sendChat('PadeiroWoot!');
}
 
startWooting();