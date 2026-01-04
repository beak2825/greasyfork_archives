// ==UserScript==
// @name         London Recruits
// @namespace    el_professor_london_recruits
// @version      0.0.1
// @description  Import recruits
// @author       El_Profesor
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      tornbay.com
// @downloadURL https://update.greasyfork.org/scripts/426061/London%20Recruits.user.js
// @updateURL https://update.greasyfork.org/scripts/426061/London%20Recruits.meta.js
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
            var className = $( this ).attr('class');
            var userId = className.replace('user', '');
            recruits.push( userId);
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