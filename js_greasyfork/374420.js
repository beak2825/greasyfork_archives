// ==UserScript==
// @name         Alexei Bastidas 0-10
// @author       Tehapollo
// @version      1.1
// @include      *docs.google.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  keypress
// @downloadURL https://update.greasyfork.org/scripts/374420/Alexei%20Bastidas%200-10.user.js
// @updateURL https://update.greasyfork.org/scripts/374420/Alexei%20Bastidas%200-10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).keypress(function(event){
        if (String.fromCharCode(event.which) == 0){
            // 0: Clicks 10th Radio and Advances
            $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[10].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();
           
        } else if (String.fromCharCode(event.which) == "."){
            // Numpad . : Clicks 0 Radio and Advances
             $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[0].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();
            
        } else if (String.fromCharCode(event.which) == 1){
            // 1: Clicks 1st Radio and Advances
             $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[1].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();
        } else if (String.fromCharCode(event.which) == 2){
            // 2: Clicks 2nd Radio and Advances
             $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[2].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();
           
        }else if (String.fromCharCode(event.which) == 3){
            // 3: Clicks 3rd Radio and Advances
             $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[3].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();

            
        }else if (String.fromCharCode(event.which) == 4){
            // 4: Clicks 4th Radio and Advances
            $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[4].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();
            
        }else if (String.fromCharCode(event.which) == 5){
            // 5: Clicks 5th Radio and Advances
            $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[5].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();
           
        }else if (String.fromCharCode(event.which) == 6){
            // 6: Clicks 6th Radio and Advances
           $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[6].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();
           
        }else if (String.fromCharCode(event.which) == 7){
            // 7: Clicks 7th Radio and Advances
             $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[7].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();

            
            }else if (String.fromCharCode(event.which) == 8){
            // 8: Clicks 8th Radio and Advances
            $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[8].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();

            }else if (String.fromCharCode(event.which) == 9){
            // 9: Clicks 9th Radio and Advances
            $('div.quantumWizTogglePaperradioOffRadio.exportOuterCircle')[9].click();
            $('span.quantumWizButtonPaperbuttonLabel.exportLabel')[1].click();

           
        }
    });
})();