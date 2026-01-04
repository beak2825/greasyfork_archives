// ==UserScript==
// @name         Alexei Bastidas Image 1 or 2
// @author       Tehapollo
// @version      1.0
// @include      *docs.google.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  keypress
// @downloadURL https://update.greasyfork.org/scripts/374421/Alexei%20Bastidas%20Image%201%20or%202.user.js
// @updateURL https://update.greasyfork.org/scripts/374421/Alexei%20Bastidas%20Image%201%20or%202.meta.js
// ==/UserScript==


  $(document).ready(function(){
       var StartWork = setInterval(function(){ startcheck(); }, 100);

 function startcheck(){
      if ( $('div.freebirdFormviewerViewHeaderDescription:contains(You are taking part in a survey to assess)').length ){
         $('span.quantumWizButtonPaperbuttonLabel.exportLabel').click();

      }
     else if ( $('div.freebirdFormviewerViewItemsPagebreakDescriptionText:contains(Please read the caption)').length ){
              $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();
     }
    }







    $(document).keypress(function(event){
        if (String.fromCharCode(event.which) == 1){
            // 1: Clicks 1st Radio and Advances
            $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[0].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();

        } else if (String.fromCharCode(event.which) == 2){
            //  2: Clicks 2nd Radio and Advances
             $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[1].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();






   }
    });
});