// ==UserScript==
// @name         DECIPHER - ComradeButtonXML
// @namespace    https://greasyfork.org/en/scripts/376031-comradebuttonxml
// @version      1.6
// @description  Makes the comrade button go straight to XML editor, instead of builder
// @author       Scott
// @match        https://survey-d.dynata.com/*
// @match        https://survey-ca.dynata.com/*
// @match        https://survey-uk.dynata.com/*
// @match        https://survey-au.dynata.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376031/DECIPHER%20-%20ComradeButtonXML.user.js
// @updateURL https://update.greasyfork.org/scripts/376031/DECIPHER%20-%20ComradeButtonXML.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jQuery = window.jQuery; //Need for Tampermonkey or it raises warnings.
    var myInitTimer = setInterval(mainFunction,200);
    var numOfComradesConverted = 0; //Number of comrades converted

    function mainFunction()
    {
        var comradeSigns = jQuery(".ion-ios-construct") //Gets all the icons on the page
        var comradeLength = comradeSigns.length //Gets their number
        var len1 = 0; //Precached for loop
        var curLink = ""; //Holds current link
        var curState = ""; //Holds current state

        if (comradeLength > 0 && (numOfComradesConverted < comradeLength))
        {
            for(len1; len1 < comradeLength; len1++)
            {
                curLink = comradeSigns.eq(len1).closest("div").parent().attr("href");
                if (curLink.includes(":edit")) //If not yet changed
                {
                    curState = comradeSigns.eq(len1).closest("div").parent().parent().siblings().eq(2).text().trim(); //Get state of study

                    if (curState == "draft" || curState == "live") //Ignores closed studies on purpose
                    {
                        curLink = curLink.replace(":edit",":xmledit");
                        comradeSigns.eq(len1).closest("div").parent().attr("href",curLink)
                        numOfComradesConverted = numOfComradesConverted + 1;
                    }
                    if (curState == "closed") //Makes closed studies go to view, instead of edit
                    {
                        curLink = curLink.replace(":edit","/temp-view:xmledit");
                        comradeSigns.eq(len1).closest("div").parent().attr("href",curLink)
                        numOfComradesConverted = numOfComradesConverted + 1;
                    }
                }
                clearInterval(myInitTimer); //Stop the annoying script
            }
        }
    } //END OF MAIN FUNCTION

    document.addEventListener('mousemove', function (event) {//On page scroll
        mainFunction() //Run main script again, as Decipher Ajax loads more studies in
    }, true);

})();