// ==UserScript==
// @name         Polyglot Additional Instructions Provider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The script collects 'Additional Instructions' from SymLite and provides it to linguists when they open a job in Polyglot.
// @author       KSabrsulo@moravia.com
// @match        https://localization.google.com/polyglot/tasks/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/394724/Polyglot%20Additional%20Instructions%20Provider.user.js
// @updateURL https://update.greasyfork.org/scripts/394724/Polyglot%20Additional%20Instructions%20Provider.meta.js
// ==/UserScript==

main();

function main() {
    var addInstructions = getAdditionalInstructions();
    if(addInstructions) {
        console.log('Showing additional instructions for this job: ' + addInstructions);
        showAdditionalInstructions(addInstructions);
    } else {
        console.log('There isn\'t any additional instructions for this job.');
    }
}

function getAdditionalInstructions() {
    var docCode = encodeURIComponent(window.location.href.match(/(tasks\/\d+)/)[0]);
    var endpointUrl = 'https://symlite.moravia.com/api/documents/getinstructions?docCode=' + docCode + '&authCode=Q7k8Eurakp38HjuH6AyM';
    var response;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);
        }
    };
    xmlhttp.open('GET', endpointUrl, false);
    try {
        xmlhttp.send();
    } catch(err) {
        console.log('Problem getting info from SymLite: ' + err);
    }
    var addInfo = response.notes;
    return addInfo;
}

function showAdditionalInstructions(addInstructions) {
    var xpath = '//span[text()="Help"]';
    var templateButton = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentElement;
    var toolbar = $(templateButton).parents(":eq(3)");
    var popupText = '<div id="instructions-box" style="position:fixed;left: 65%;font-family:Roboto,Arial,sans-serif;font-size:14px;background-color:white;'+
        'padding: 7px 20px 20px 20px;z-index:5;max-width: 300%;border-radius:7px;box-shadow:0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2);">'+
        '<span id="close-instructions" style="float: right; font-size: 18px; cursor: pointer;">×</span><br><span style="font-weight:bold;">Additional Instructions</span><br><br>' + addInstructions + '</div>';
    $(toolbar).append(popupText);
    $('#close-instructions').hover(function () {
        $('#close-instructions').css('font-weight', 'bold');
    }, function () {
        $('#close-instructions').css('font-weight', 'normal');
    });
    $('#close-instructions').click(function () {
        $('#instructions-box').remove();
    });
}