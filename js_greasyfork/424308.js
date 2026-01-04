// ==UserScript==
// @name         Display filename
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!=
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @author       You
// @match        https://1xcms.com/notification/add
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424308/Display%20filename.user.js
// @updateURL https://update.greasyfork.org/scripts/424308/Display%20filename.meta.js
// ==/UserScript==

(function() {
    'use strict';

let counter=0;

waitForKeyElements(".file-load", du_stuff, 1);

    function du_stuff()
    {

        if(counter) return;
        counter++;
        $( ".file-load" ).before( function (index) { return (index==1)? '<div id="filename_display" class="title">Сперва выберите картинку!</div>' :  null;});

                $(".file-load input").change((function() {
            let e = $(this).val();
      $('#filename_display').text(e.slice(e.lastIndexOf("\\") + 1, e.length));

        }
        ));
    }





    


    // Your code here...
})();