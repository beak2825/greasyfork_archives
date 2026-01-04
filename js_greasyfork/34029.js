// ==UserScript==
// @name         Sauver vos yeux (écriture inclusive)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Vous fait gagner 3 points de vision
// @author       Victor Hugo
// @match        http://*/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/34029/Sauver%20vos%20yeux%20%28%C3%A9criture%20inclusive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34029/Sauver%20vos%20yeux%20%28%C3%A9criture%20inclusive%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elts = {
        'é·e·?' : 'é',
        "·e·s" :'s',
        '·rice·?' : '',
        '·euse·?' : '',
        'eur·e·?' : 'eur',
        '·trice·?' : '',
        'aux·ales': 'aux',
        '·te·s' : 's',
        'is·es' : '',
        '·le·?' : '',
   };

    for (var id in elts) {
        var i = id.replace(new RegExp('·','gi'),'[·\\-\\.]');
        var reg = new RegExp(i, 'gi');
        var replaced = $("body").html().replace(reg,elts[id]);
        $("body").html(replaced);
    }

})();