// ==UserScript==
// @name         SalesForce Notes Helper
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://zayo.my.salesforce.com/apex/AddNCCCaseComment?Id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395536/SalesForce%20Notes%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/395536/SalesForce%20Notes%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

//##################################################################################################################################
//##################################################################################################################################
//####                                        USER-CONFIGURABLE LINES BELOW:                                                    ####
//####                                                                                                                          ####

    const Greeting_Text = "Dear Zayo customer,"; //              Initial greeting
    const Lines_Between_Greeting_and_Signature = 5; //           How much whitespae you want between the greeting and your Signature
    const Signature_Line1 = "ZAYO"; //                           Self explanatory. Any line left blank will be ignored
    const Signature_Line2 = "";
    const Signature_Line3 = "Optical NCC | Zayo Bandwidth";
    const Signature_Line4 = "4500 S 129th East Avenue | Suite 132 | Tulsa, OK 74134";
    const Signature_Line5 = "NCC: 866.236.2824 Opt: 1";
    const Signature_Line6 = "";

    const caseOpeningStatement = "ZAYO ONCC has investigated your reported incident. During your reported"; //Initial opening statement when picking up a case.

    const Paste_Template_Immediately_Upon_Clicking_New = "TRUE";
//####                                          USER-CONFIGURABLE LINES ABOVE                                                   ####
//##################################################################################################################################
//##################################################################################################################################


//Adding a couple of other templates
//If these templates ever change, use the webpage below to convert them to Javascript-friendly one-line strings
//https://www.freeformatter.com/javascript-escape.htm
    const summaryTemplate = "***************************************SUMMARY***************************************\r\n1)\r\n2)\r\n3)\r\n\r\n***************************************ACTIONS***************************************\r\n1)\r\n2)\r\n3)";
    const typeIITemplate = "<mark>TYPE II REQUEST<\/mark>\r\n- What is needed:\r\n- Location:\r\n- Type 2 provider:\r\n- Type 2 Circuit:\r\n- Testing and Investigation: ";
    const spareTemplate = "<mark>SPARE REQUEST<\/mark>\r\n- Asset Definition:\r\n- Site spare is needed at:\r\n- Equipment & Port:";

    //Compute the signature
    var singatureArray = [Signature_Line1, Signature_Line2, Signature_Line3, Signature_Line4, Signature_Line5, Signature_Line6] //Create an array of each potential line on the signature
    var signature = ""
    for (var i = 0; i < 6; i++){ //Iterate through each line of the signature array
        if (singatureArray[i].length > 0){ //if the line is not empty, add it to the signature
            signature = signature + "\r\n" + singatureArray[i];
        }
    }

    //Compute a blank lines
    var blankLines = ""
    for (i = 0; i < Lines_Between_Greeting_and_Signature; i++){
        blankLines = blankLines + "\r\n";
    }


    var blankTemplate = Greeting_Text + blankLines + signature;
    var openCaseTemplate = Greeting_Text + "\r\n\r\n\r\n" + caseOpeningStatement + "\r\n\r\n" +signature;

    var helperDiv = document.createElement("div");
    //helperDiv.style.width = "30%";
    //helperDiv.style.height = "25px";
    //helperDiv.style.background = "red";
    helperDiv.style.color = "black";
    helperDiv.style.zIndex = "99999";
    //helperDiv.style.right = "0px";
    helperDiv.id = "helperDiv";
    //helperDiv.style.bottom = "0px";
    //helperDiv.style.position = "fixed";
    document.getElementById("j_id0:j_id3:j_id4:j_id11:comment").style.rows = 15;
    document.getElementById("j_id0:j_id3:j_id4:j_id11:comment").style.cols = 50;



    //helperDiv.appendChild("");
    document.getElementById("j_id0:j_id3:j_id4:j_id5:btnPanel").appendChild(helperDiv);
    var buttonValues = ["Blank Template", "Opening Statement", "Summary", "Type II", "Spare"];
    var buttonPasteText = [blankTemplate, openCaseTemplate, summaryTemplate, typeIITemplate, spareTemplate];
    var masterButton;
//So apparently you can't call a function within a loop and expect it to work properly.
//Since clicking the button calls the function after to loop has been completed, i is always buttonValues.length + 1, and thus querying a property or an array index results in the last state they were in before exiting the loop
// So I guess I'll go with the ugly code underneath it.
//    for (i = 0; i < buttonValues.length; i++){
//        masterButton = document.createElement("input");
//        masterButton.type = "button";
//        masterButton.name = buttonValues[i];
//        masterButton.value = buttonValues[i];
//        masterButton.onclick = function() {
//            document.getElementById("j_id0:j_id3:j_id4:j_id11:comment").value = buttonPasteText[buttonValues.indexOf(masterButton.value)];
//        }
//        document.getElementById("helperDiv").appendChild(masterButton);
//    }

    masterButton = document.createElement("input"); //create and style the button
    masterButton.type = "button";
//Blank Template Button
	masterButton = document.createElement("input"); //create and style the button
    masterButton.type = "button";
    masterButton.value = "Blank Template";
    masterButton.onclick = function() {
        //document.getElementById("j_id0:j_id3:j_id4:j_id11:comment").value = blankTemplate;
        populateTextArea(blankTemplate);
    };
    document.getElementById("helperDiv").appendChild(masterButton);
//Opening Statement Template
	masterButton = document.createElement("input"); //create and style the button
    masterButton.type = "button";
    masterButton.value = "Opening Statement";
    masterButton.onclick = function() {
        populateTextArea(openCaseTemplate);
    };
    document.getElementById("helperDiv").appendChild(masterButton);
//Summary Template
	masterButton = document.createElement("input"); //create and style the button
    masterButton.type = "button";
    masterButton.value = "Summary";
    masterButton.onclick = function() {
        populateTextArea(summaryTemplate);
    };
    document.getElementById("helperDiv").appendChild(masterButton);

//Type II Request Template
	masterButton = document.createElement("input"); //create and style the button
    masterButton.type = "button";
    masterButton.value = "Type II";
    masterButton.onclick = function() {
        populateTextArea(typeIITemplate);
    };
    document.getElementById("helperDiv").appendChild(masterButton);
//Spare Request Template
	masterButton = document.createElement("input"); //create and style the button
    masterButton.type = "button";
    masterButton.value = "Spare";
    masterButton.onclick = function() {
        populateTextArea(spareTemplate);
    };
    document.getElementById("helperDiv").appendChild(masterButton);
//Clear Button
	masterButton = document.createElement("input"); //create and style the button
    masterButton.type = "button";
    masterButton.value = "Clear";
    masterButton.onclick = function() {
        if (confirm("F'real?")){
            populateTextArea("");
    }
    };
    document.getElementById("helperDiv").appendChild(masterButton);


//IdiotLight check to make sure someone doesn't hit a button by accident (Ctrl+Z doesn't work in this instance);
    function populateTextArea (pasteText){
        var currentText = document.getElementById("j_id0:j_id3:j_id4:j_id11:comment").value;
        if (currentText == "" || currentText == null || pasteText == ""){
             document.getElementById("j_id0:j_id3:j_id4:j_id11:comment").value = pasteText;
        }else if (confirm("Are you sure? It looks like there's something already in there. This can't be undone")){
            document.getElementById("j_id0:j_id3:j_id4:j_id11:comment").value = pasteText;
        }
    }

})();