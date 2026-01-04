// ==UserScript==
// @name         SalesForce case helper - ONCC (Customer)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds a few helpful buttons to the bottom right of the screen of customer cases. Links to bookmarked peices of the page: Top, Notes, Contact, Service. Buttons to generate email subject; ONCC Handoff template
// @author       You
// @match        https://zayo.my.salesforce.com/5000z*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395535/SalesForce%20case%20helper%20-%20ONCC%20%28Customer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/395535/SalesForce%20case%20helper%20-%20ONCC%20%28Customer%29.meta.js
// ==/UserScript==
var subjectCopyText = "";
(function() {
    'use strict';

    var floatingHelperdiv = document.createElement("div"); //Create the Floating DIV and style/position it
    //floatingHelperdiv.style.width = "400px";
    //floatingHelperdiv.style.height = "25px";
    floatingHelperdiv.style.background = "white";
    floatingHelperdiv.style.color = "black";
    floatingHelperdiv.style.zIndex = "99999";
    floatingHelperdiv.style.right = "0px";
    floatingHelperdiv.style.bottom = "0px";
    floatingHelperdiv.style.position = "fixed";
    floatingHelperdiv.style.border = "3px solid black";
    floatingHelperdiv.style.borderRadius = "6px";
    floatingHelperdiv.style.padding = "4px";
    //Goal: "Notes | Contact | Service | Subject | Top";

    var currentURL = window.location.href; //Store the window's URL in a variable (this is updated live)
    if (currentURL.search("#") > 0) { //if the URL has a "#" in it, indicating we're already at a bookmarked place, then remove it from the variable. If this is not done, the code below will just keep appending bookmarks on top of each other (ie link might become "salesforce.com/500x000#Contacts#TOP#Notes" and be unusable)
        var hashPos = currentURL.search("#");
        currentURL = currentURL.slice(0, hashPos);
    }

    currentURL = currentURL.concat("#"); //add the Hashmark to the current URL so that we don't have to keep doing that for all of the links we add
    var innerHTML = "";
    const spacer = " | ";
//Create bookmark to go to Top
    var topURL = currentURL.concat("phHeaderLogoImage");
    var topTXT = "Top";
    var topHTML = topTXT.link(topURL);

//Create bookmark for the Notes section
    var notesURL = currentURL.concat("img_01B0z000005ZMrU")
    var notesTXT = "Notes";
    var notesHTML = notesTXT.link(notesURL);

//Create a bookmark for the Contact section
    var contactURL = currentURL.concat("img_01B60000002yWHR")
    var contactTXT = "Contact";
    var contactHTML = contactTXT.link(contactURL);

//Create a bookmark for the Service section
    var serviceURL = currentURL.concat("img_01B60000002yWHJ")
    var serviceTXT = "Service";
    var serviceHTML = serviceTXT.link(serviceURL);

//Create a button to copy email subject to clipboard (I couldn't figure out how to make this into a link, so a button will have to do)
    var subjectTXT = "Copy Subject";
    subjectCopyText = subjectCopyText.concat(document.getElementsByClassName("pageDescription")[0].innerText, " ", document.getElementById("cas14_ileinner").innerText); //Pull the data from the page that we want to copy and store the results in a variable
    var subjectButton = document.createElement("input"); //create and style the button
    subjectButton.type = "button";
    subjectButton.name = subjectTXT;
    subjectButton.value = subjectTXT;

    subjectButton.onclick = function() {
        document.getElementById("phSearchInput").value = subjectCopyText; //typically, you'd want to create a hidden text field and put the text to be coppied into it, but I don't see the point. This just puts it in the search field at the top of the page
        document.getElementById("phSearchInput").select(); //select all the text in the search field
        document.execCommand("copy"); //Copy the selected text to the clipboard
        document.getElementById("phSearchInput").value = ""; //Clear the search box at the top, like it never happened
    };

//Create a button to copy ONCC Handoff Template to clipboard, with relevant details already embedded (God help me if the template ever changes)
//If for some reason the format ever changes, use https://www.freeformatter.com/javascript-escape.html to conver the plain text into Javascript escaped text
//The below part for the Handoff template is pretty convoluted
//We startoff by initializing our variables and populating them
//Then we have the functions to populate some of the more pesky fields that we need (ServiceImpacting?, Last Public Update, and adding the customer ticket number to their contact info)
//Then, we build the template
//Finally, we create the button
    //Initializing variables
    var handoffTXT = ""
    var TTN = document.getElementsByClassName("pageDescription")[0].innerText;
    var customerName = document.getElementById("cas4_ileinner").innerText;
    var CID = document.getElementById('06660000000CdOa').contentWindow.document.getElementById('j_id0:j_id15:j_id16:j_id17').innerText;
    var serviceImpacting = determineServiceImpact(); //will need to calculate this value
    var symptom = document.getElementById("00N0z000003DmjV_ileinner").innerText;
    var lastPublicUpdate = findLastPublicUpdate(); //this one was hard and not even remotely worth it, especially with the hacky way it was done
    var customerContactInfo = document.getElementById("cas4_ileinner").innerText + " " + document.getElementById("cas9_ileinner").innerText;
    var customerTicket = customerTicketOutput();

    //Functions to populate the pesky fields
    function determineServiceImpact (){
        var impact = document.getElementById("00N0z000003DmjW_ileinner").innerText;
        if (impact == "Out of Service" || impact == "Impaired"){
            return "Yes";
        } else {
            return "No";
        }
    };

    function findLastPublicUpdate (){
        var caseGUID = currentURL.slice(currentURL.length - 16, currentURL.length -1); //extract the GUID from the URL
        var caseMetricsElementId = caseGUID + "_00N60000002fLtK_body";
        var caseMetricsElementHTML = ""
        try {
            caseMetricsElementHTML = document.getElementById(caseMetricsElementId.toString()).outerHTML; //this can fail miserably because this portion of the page is loaded after the main part of the page has loaded, but can be loaded before this script is executed
                                                                                                         //In addition this just grabs the only HTML node that has the Last Public Update since the cell we need to extract the data from doesn't have a callable ID
        } catch(err){ //not really trying to catch the error, just don't wanna throw a console error
            console.log(err);
        }

        if (caseMetricsElementHTML.length > 100){ //Just check and make sure there's something useful in there. 100 is abritrary. This can still go horribly wrong.
            //It just so happens that the value we're looking for is the last peice of plain text in the HTML blob we extracted in the Try/Catch statement.
            caseMetricsElementHTML = caseMetricsElementHTML.slice(0, caseMetricsElementHTML.length - 35); //Slice off the last 27 characters of closing HTML tags, leaving us with something like "<tr><tr><tr>......>1/23/19 12:34 AM"
            var positionOfLastClosingCaret = caseMetricsElementHTML.lastIndexOf(">") + 1; //Figure out where the HTML code ends and the text starts (aka, where's the last ">")
            lastPublicUpdate = caseMetricsElementHTML.slice(positionOfLastClosingCaret, caseMetricsElementHTML.length); //Extract just the Date/Time
        } else{
            lastPublicUpdate = "Whoopsie doodles! Something went wrong here 🙃"; //since this is code is shoddy af
        }
        if (lastPublicUpdate.search("AM") <0 || lastPublicUpdate.search("PM")){ //If the case has never had a MP, then this shoddy script will fail
            lastPublicUpdate = "🙃";
        }
    }

    function customerTicketOutput() {
        var customerTicketInnerText = document.getElementById("00N60000001iwjg_ileinner").innerText; //extract the customer ticket from the page
        if (customerTicketInnerText.length > 1){ //if the ticket has at least 1 character in it, format it. Otherwise (if there's no ticket number), don't do anything
            return " (Tkt# " + customerTicketInnerText + ")";
        } else {
            return "";
        }
    }
    //Build the template
    //This totally could have been done in one line of code, but it's just easier to read this way
    //If for some reason the format ever changes, use https://www.freeformatter.com/javascript-escape.html to convert the plain text into Javascript escaped text

    function buildHandoffTXT () {
        handoffTXT = "ONCC Handoff\r\nTrouble Ticket Number: "
        handoffTXT = handoffTXT.concat(TTN);
        handoffTXT = handoffTXT.concat("\r\nCustomer Name: ");
        handoffTXT = handoffTXT.concat(customerName);
        handoffTXT = handoffTXT.concat("\r\nCircuit ID: ");
        handoffTXT = handoffTXT.concat(CID);
        handoffTXT = handoffTXT.concat("\r\nService-Affecting? ");
        handoffTXT = handoffTXT.concat(serviceImpacting);
        handoffTXT = handoffTXT.concat("\r\nSymptom: ");
        handoffTXT = handoffTXT.concat(symptom);
        handoffTXT = handoffTXT.concat("\r\nLast Public Update: ");
        handoffTXT = handoffTXT.concat(lastPublicUpdate);
        handoffTXT = handoffTXT.concat("\r\nTech\/Field resource currently on site? ");
        handoffTXT = handoffTXT.concat("\r\nTech Contact Information: ");
        handoffTXT = handoffTXT.concat("\r\nType II Contact Information: ");
        handoffTXT = handoffTXT.concat("\r\nCustomer Contact Information: ");
        handoffTXT = handoffTXT.concat(customerContactInfo + customerTicket);
        console.log(handoffTXT);
    };


    var handoffButton = document.createElement("input"); //create and style the button
    handoffButton.type = "button";
    handoffButton.name = "Copy Handoff Template";
    handoffButton.value = "Copy Handoff Template";
    handoffButton.onclick = function() {
        findLastPublicUpdate();
        buildHandoffTXT();
        var textArea = document.createElement("textarea");
        textArea.id = "handoffTextArea";
        textArea.value = handoffTXT;

        document.body.appendChild(textArea);
        textArea = document.getElementById("handoffTextArea");
        textArea.select();
        document.execCommand("copy");
    };


    floatingHelperdiv.innerHTML = topHTML + spacer + notesHTML + spacer + contactHTML + spacer + serviceHTML + "   "; //creat the DIV and add the text fields (buttons cannot be added this way)
    floatingHelperdiv.appendChild(subjectButton); //Add the "Copy Subject" button
    floatingHelperdiv.appendChild(handoffButton); //Add the "Copy Handoff Template" button
    document.getElementById("contentWrapper").appendChild(floatingHelperdiv); //Put the DIV on the page

//The last part just adds the customer's ticket number next to their phone number
//Just because this annoys me so much that they're so far apart on the page
    document.getElementById("cas9_ileinner").style.whiteSpace = "pre-wrap";
    document.getElementById("cas9_ileinner").innerText = document.getElementById("cas9_ileinner").innerText + customerTicket;

})();