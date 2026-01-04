// ==UserScript==
// @name         badge granter
// @include      https://www.imvu.com/catalog/web_manage_badges.php?action=grant-revoke&*
// @namespace    oribadgegranter
// @version      0.3
// @description  automates the granting of a badge to multiple names
// @author       ori@imvu
// @grant        GM_setValue
// @grant        GM_getValue
// persistent variables:  count, shouldRun, grantMessages, names
// @downloadURL https://update.greasyfork.org/scripts/32667/badge%20granter.user.js
// @updateURL https://update.greasyfork.org/scripts/32667/badge%20granter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    //text area and buttons
    document.body.innerHTML = document.body.innerHTML + "<textarea id=\"textstuff\" name=\"textstuff\" rows=\"20\"cols=\"25\"></textarea> <br><input type=\"button\" value=\" send \" id=\"load\" />     <input type=\"button\" value=\" results \" id=\"results\" />";

    //event listeners for buttons
    document.getElementById("load").addEventListener ("click", loadNames, false);
    document.getElementById("results").addEventListener ("click", showResults, false);

    //testing output
    console.log('count: ' + GM_getValue('count'));
    console.log('shouldRun: ' + GM_getValue('shouldRun'));

    //populate grantMessages array with message from page
    //this is skipped while count is 0 so will populate last, first, second, ect-- solved in showResults
    if(document.getElementsByClassName('grant-message').length > 0) {
        GM_setValue('grantMessages'[GM_getValue('count')],document.getElementsByClassName('grant-message')[0].innerHTML);
    }

    //continue sending badges after page refresh
    if(GM_getValue('shouldRun',false)) sendBadges();


    //places names into array -- delimited by new line
    function loadNames() {

        var textArea = document.getElementById("textstuff");
        GM_setValue('names',textArea.value.split("\n"));
        console.log("successfully created array of names");

        GM_setValue('grantMessages', new Array(GM_getValue('names').length));

        sendBadges();

    }

    //iterates through array and calls form .send()
    function sendBadges() {
        GM_setValue('shouldRun', true);
        while (GM_getValue('count',0) < GM_getValue('names').length) {
            document.getElementById('grant-userid').value = GM_getValue('names')[GM_getValue('count',0)];
            GM_setValue('count',(GM_getValue('count',0)+1)); //count++

            if(GM_getValue('count') == GM_getValue('names').length) {
                resetValues();
            }

            document.querySelectorAll('input[type="submit"]')[0].click();
            break;

        }
    }

    //display contents of grantMessages -- shows imvu 'result' message
    function showResults() {   //to do:  if contents are "" don't clear run.
        var lastInArray = parseInt(GM_getValue('grantMessages').length)-1;  //element - not value

        if (GM_getValue('grantMessages'[0]) !== "") {

            for(var a=1; a < GM_getValue('grantMessages').length; a++) {
                document.getElementById('textstuff').innerHTML += GM_getValue('grantMessages'[a]) + '\n\n';
            }
            //the last value is added first to the array because it's skipped when count is 0 but added after resetValues() is called
            document.getElementById('textstuff').innerHTML += GM_getValue('grantMessages'[0]) + '\n\n';
            var b = 0;
            while(b < GM_getValue('grantMessages').length) {
                GM_setValue('grantMessages'[b],"");
                b++;
            }
        }
    }

    //clears out persistent variables
    function resetValues() {

        GM_setValue('count',0);
        GM_setValue('shouldRun',false);

        for(var i=0; i < GM_getValue('names').length; i++) {
            GM_setValue('names',"");
        }
    }

})();