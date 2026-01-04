// ==UserScript==
// @name         helpdesk messages redirect
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/helpdeskmessage/
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/helpdeskmessage/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367803/helpdesk%20messages%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/367803/helpdesk%20messages%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.match(/http:\/\/bakeacakeserver\.milamit\.cz\/bakeacake(-qa)?\/admin\/bakeacakeios\/helpdeskmessage\//) != null){
        window.location.replace(window.location.href + "?q=problem");
    }
    else if (window.location.href.match(/http:\/\/matchlandserver\.milamit\.cz\/matchland(-qa)?\/admin\/matchlandios\/helpdeskmessage\//) != null){
        window.location.replace(window.location.href + "?q=problem");
    }

})();