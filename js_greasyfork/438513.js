// ==UserScript==
// @name         QPushForTerm.Ptt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在term.ptt點擊imgur連結時發送推播到Qpush裝置
// @author       You
// @match        https://term.ptt.cc/
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438513/QPushForTermPtt.user.js
// @updateURL https://update.greasyfork.org/scripts/438513/QPushForTermPtt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).on("click", "a", function() {
        var name = '' // QPush的推名
        var code = '' // QPush的推碼

        if(/^https:\/\/i.imgur.com\/.*$/.test(this.href))
        {
            var data = new FormData();
            data.append( 'name', name  );
            data.append( 'code', code  );
            data.append( 'sig', ''  );
            data.append( 'cache', false  );
            data.append( 'msg[text]', this.href  );

            var xhr = new XMLHttpRequest();

            xhr.open( 'POST', 'https://qpush.me/pusher/push_site/', true );
            xhr.onreadystatechange = function ( response ) {};
            xhr.send( data );
            return false;
        }

    });
    
})();