// ==UserScript==
// @name         Discord Capitaliser
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  duh
// @author       xShirase
// @match        https://discordapp.com/channels/*
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29667/Discord%20Capitaliser.user.js
// @updateURL https://update.greasyfork.org/scripts/29667/Discord%20Capitaliser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $jq = window.jQuery;
        $jq('body').on('keypress','.channel-textarea-inner textarea',function(e){
            var key = e.which;
            var v = $jq(this).val();
            if(key==13 && v!=='' && window.location.href.indexOf('290930782812241941')===-1 && v.substring(0,4)!== 'http'){
                console.log('trig');
                var res = applySentenceCase(v+'.')
                    .replace(/ i /g,' I ')
                    .replace(/ im /g,' I\'m ');
                $jq(this).val(res.slice(0, -1));
            }
        });

    function applySentenceCase(str) {
        return str.replace(/.+?[\.\?\!](\s|$)/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        });
    }
})();