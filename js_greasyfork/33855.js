// ==UserScript==
// @name         Show spammers' Life-saver
// @version      1
// @description  Script that allows me to access DOM elements of the chat
// @author       A Meaty Alt
// @include      /fairview\.deadfrontier\.com/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/33855/Show%20spammers%27%20Life-saver.user.js
// @updateURL https://update.greasyfork.org/scripts/33855/Show%20spammers%27%20Life-saver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var imgs = document.getElementsByTagName("img");
    for(var i=0; i<imgs.length; i++){
        if("Turn CB Radio On" == imgs[i].alt){
            var click = imgs[i].getAttribute("onclick");
            var oldUrl = click.match(/http.*\?/)[0];
            var newUrl = "http://email.deadfrontier.com:8081/?";
            var oldWidth = click.match(/width=.*\,/)[0];
            var newWidth = "width=800";
            click = click.replace(oldUrl, newUrl);
            click = click.replace(oldWidth, newWidth);
            imgs[i].setAttribute("onclick",  click + "; return false;");
        }
    }

})();