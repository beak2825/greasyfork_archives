// ==UserScript==
// @name        Cuisiniere_rasnuff
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @version     0.01
// @grant       none
// @description faire des jets pour créer un plat
// @downloadURL https://update.greasyfork.org/scripts/10011/Cuisiniere_rasnuff.user.js
// @updateURL https://update.greasyfork.org/scripts/10011/Cuisiniere_rasnuff.meta.js
// ==/UserScript==

var re = new RegExp("/roll [a-z]+");

var competenceFormule = new Object();

if (!String.prototype.contains) {
    String.prototype.contains = function(s, i) {
        return this.indexOf(s, i) != -1;
    }
}

var jetDes = function(e) { 
    value = '/roll 1d'+facesde;
    
}

           $("#chatForm .text_chat").val("/me [couleur=jaune] La cuisinière Rasnuff cuisine un "+ result +" "+result2+" avec sa "+result3+" et "+result4+" [/couleur]");
