// ==UserScript==
// @name попрыгунчик
// @namespace https://www.bestmafia.com/
// @version 1.4
// @description порча кланок
// @author Лёшенька
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/496389/%D0%BF%D0%BE%D0%BF%D1%80%D1%8B%D0%B3%D1%83%D0%BD%D1%87%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/496389/%D0%BF%D0%BE%D0%BF%D1%80%D1%8B%D0%B3%D1%83%D0%BD%D1%87%D0%B8%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

var szd =['Лёшенька'];
var jopa = 1;

setInterval(() => {
    switch (gam_state) {
        case '':
            jopa = 1;
            var create = $('#gml_list').find('span');
            for (var i = 0; i < create.length; i++) {
                if (szd.indexOf($($(create)[i]).text()) != -1) {
                    _GM_action('gml', 'join', parseInt($($(create)[i]).parent('div').parent('li').attr('id').replace(/\D+/g, "")), event);
                }
            }
            break;
            
            
        default:
            if (jopa) {
                setTimeout(function() {
                    _GM_action('', 'exit');
                }, 3500);
                jopa = 0;
            }
            break;
    }
}, 50);

})();