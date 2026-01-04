// ==UserScript==
// @name         Aliexpress feedback
// @namespace    https://feedback.aliexpress.com/
// @version      2.0.0
// @description  prefill 5-star rating in aliexpress feedback
// @author       luckylooke
// @match        https://feedback.aliexpress.com/management/leaveFeedback.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31664/Aliexpress%20feedback.user.js
// @updateURL https://update.greasyfork.org/scripts/31664/Aliexpress%20feedback.meta.js
// ==/UserScript==

/*

    source: https://gist.github.com/luckylooke/e44bd8d44d51019d11c54c90cc94e09c
    
    Changelog:
    2.0.0 'enter' feature from 1.1.o replaced by confirm popup
    1.1.0 Available to press 'enter' key for instant feedback submit
    1.0.0 Prefill all 5-star

*/

(function() {
    'use strict';
    
    // setTimeout for page readiness
    setTimeout(function(){
        
       var all = document.getElementsByClassName('star star-5');
       var l = all.length;
     
       for(var i=0; i<l; i++)
           all[i].click();
    
        if (l > 0 && window.confirm("Do you want to submit 5-star feedback?")) { 
            document.getElementById('buyerLeavefb-submit-btn').click();
        }
    
    }, 300);
})();