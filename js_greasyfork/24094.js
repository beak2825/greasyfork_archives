// ==UserScript==
// @name         Wanikani Combo Streak
// @namespace    Mempo
// @version      1.0
// @description  Shows your review combo
// @author       Mempo
// @match        https://www.wanikani.com/review/session
// @match        http://www.wanikani.com/review/session
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24094/Wanikani%20Combo%20Streak.user.js
// @updateURL https://update.greasyfork.org/scripts/24094/Wanikani%20Combo%20Streak.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var div = $("div").class(
    var css = '#WKCS { ' +
               'position: absolute; ' +
               'top: 10px; '+
               'left: 60px; '+
               'width: 100px; '+
               'z-index: 100; '+
               'color: white; '+
              '} ' +
              '#WKCS p {' +
                'margin-right: 10px;' +
                'display: inline;' +
              '}';
    addStyle(css);

    
    var $WKCS = $('<div id="WKCS">').append('<i class="icon-trophy"></i><p>Combo Streak: 0</p>');
        
    $WKCS.insertAfter("#summary-button");
    
    
    
    function addStyle(aCss) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }
    
    /*$(window).unload(function(){
        if(wki_hit_combo > wki_combo_record)
        {
            //$.jStorage.set('wki_combo_record', wki_hit_combo);
            console.log('WKCS: Combo record saved');
        }
    });
    */
})();