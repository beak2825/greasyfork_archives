// ==UserScript==
// @name         autodance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  just for fun!
// @author       Naidy
// @match        http://audance.com.tw/dance/play?song=lovely
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25004/autodance.user.js
// @updateURL https://update.greasyfork.org/scripts/25004/autodance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function active(){
        //console.log('active');
        if (status == 1){
            userKeyIn($('#arrow-' + activeArrow).attr('arrow'));
            //console.log($('#arrow-' + activeArrow).attr('arrow'));
        }
        setTimeout(active, 200);
    }
    $('#gameStart').on('click', function(){
        initPlayGround();
        music.play();
        startTime = getT();
        start_music.play();
        clearArrow();
        $('.startWindow').hide();
        active();
    });
})();