// ==UserScript==
// @name         Mug targets Hospital
// @namespace    el_professor
// @version      0.0.1
// @description  Export hospital targets
// @author       El_Profesor
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      tornbay.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504120/Mug%20targets%20Hospital.user.js
// @updateURL https://update.greasyfork.org/scripts/504120/Mug%20targets%20Hospital.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertButton(){
        $( "#top-page-links-list" ).append( "<div class='el_recruits_button'><button>Export recruits</button></div>" );
    };

    insertButton();


    GM_addStyle( '.el_recruits_button { color: #62c462; float: right; margin-top: 10px;}');

    $('.el_recruits_button').click(function(){
        var recruits = [];
        $( ".user-info-list-wrap > li" ).each(function( index ) {
            var hospital = false;
            var bazaar = false;
            var className = $( this ).attr('class');
            var userId = className.replace('user', '');
            $(this).find('#iconTray li').each(function( index ) {
                var title = $(this).attr('title');
                if (title.includes('Suffering from an') === true){
                    hospital = true;
                };
                if (title.includes('Got a nasty') === true){
                    hospital = true;
                };
                if (title.includes('Severe emesis') === true){
                    hospital = true;
                };
                if (title.includes('Bazaar') === true){
                    bazaar = true;
                };
              });
            if (hospital === true && bazaar === true) {
                console.log(userId);
                recruits.push( userId);
            }
            
        });
        var recruitsJson = JSON.stringify(recruits);
        postRecruits(recruitsJson);
    });

    function postRecruits(recruits) {
   GM_xmlhttpRequest({
          method: "POST",
          url: "https://tornbay.com/api/v1/london/import/recruits",
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          data: recruits,
          onload: function(response) {
              alert(response.responseText);
          }
    });
  }
})();