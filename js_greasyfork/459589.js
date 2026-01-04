// ==UserScript==
// @name         Guru-machine
// @version      0.0.1
// @description  Make your wikidot account beautiful!
// @author       HelloOSMe
// @match        http://*.wikidot.com/*
// @match        https://*.wikidot.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1023158
// @downloadURL https://update.greasyfork.org/scripts/459589/Guru-machine.user.js
// @updateURL https://update.greasyfork.org/scripts/459589/Guru-machine.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = Math.random() + ""
var rand1 = a.charAt(5)
var quotes = new Array
quotes[1] = 'guru'
quotes[2] = 'I want guru!'
quotes[3] = 'water'
quotes[4] = 's'
quotes[5] = 'Be guru!'
quotes[6] = 's'
quotes[7] = 's'
quotes[8] = 'ahahaha'
quotes[9] = '5 Karma!haha!'
quotes[0] = 'Karma!'
var quote = quotes[rand1]
    WIKIDOT.modules.ForumViewThreadModule.listeners.newPost(event,null);/**/
    setTimeout(()=>$j("#np-text").val(quote),1000);
    setTimeout(()=>WIKIDOT.modules.ForumNewPostFormModule.listeners.save(event),1200);
})();