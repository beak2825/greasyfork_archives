// ==UserScript==
// @name         Henry
// @author       Tehapollo
// @version      1.0
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  open link 1-3 select submit
// @downloadURL https://update.greasyfork.org/scripts/376557/Henry.user.js
// @updateURL https://update.greasyfork.org/scripts/376557/Henry.meta.js
// ==/UserScript==

(function() {
    'use strict';

  if ( $('p:contains("Academia.edu is the largest open-source library")').length ){
      var thelink = $('div#workContent.row').find('a').attr('href')
      var url_win = window.open(thelink,null, "height=700,width=1000,status=yes,toolbar=no,menubar=no,location=no");
      url_win.open()
  }

     $(document).keypress(function(event){
        if (String.fromCharCode(event.which) == 1){
            // 1: Clicks 1st Radio and Advances
            $('label.btn.btn-default')[0].click();
            $('input#submitButton.btn.btn-primary').click();

        } else if (String.fromCharCode(event.which) == 2){
            // 2: Clicks 2nd Radio and Advances
            $('label.btn.btn-default')[1].click();
            $('input#submitButton.btn.btn-primary').click();;
        } else if (String.fromCharCode(event.which) == 3){
            // 3: Clicks 3rd Radio and Advances
           $('label.btn.btn-default')[2].click();
           $('input#submitButton.btn.btn-primary').click();
        }
        });
})();