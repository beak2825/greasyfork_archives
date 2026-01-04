// ==UserScript==
// @name         DECIPHER - Map highlighter
// @version      1.0
// @description  Adds background highlighting to the page where you add things to the map, unsure why it isn't there already
// @author       Scott
// @include      https://survey-*.researchnow.com/report/selfserve/*config=*
// @grant        none
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/378032/DECIPHER%20-%20Map%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/378032/DECIPHER%20-%20Map%20highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jQuery = window.jQuery; //Need for Tampermonkey or it raises warnings.
    var myInitTimer = setInterval(mainFunction,50);

    function mainFunction()
    {
        var checkBoxes = jQuery(":checkbox");		//Gets the checkboxes
        var checkBoxesLength = checkBoxes.length	//Gets their number
        var len1 = 0;								//Precach for loop

        if (checkBoxesLength > 0)
        {
            for(len1; len1 < checkBoxesLength; len1++) 		//Cycle over all of the checkboxes
            {
                if (checkBoxes.eq(len1).prop("checked")) 	//If ticked
                {
                    if (checkBoxes.eq(len1).closest("tr").attr("class") == "even") //and is an even row
                    {
                        checkBoxes.eq(len1).closest("tr").css("background-color","#ffc23f")
                    }
                    if (checkBoxes.eq(len1).closest("tr").attr("class") == "odd") //and is an even row
                    {
                        checkBoxes.eq(len1).closest("tr").css("background-color","#ffe83f")
                    }
                }
                else //Set to white
                {
                    checkBoxes.eq(len1).closest("tr").css("background-color","#ffffff")
                }
            }
            clearInterval(myInitTimer); 				//Stop the annoying script
        }
    }
    clearInterval(myInitTimer);							//Then stop

    document.addEventListener('mousemove', function (event) {mainFunction();}, true); //On mouse move tun main script again, as Decipher Ajax loads more studies in
    document.addEventListener('click', function (event) {mainFunction();}, true); //On mouse move tun main script again, as Decipher Ajax loads more studies in
})();