// ==UserScript==
// @name         Lab4 Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lab Simetric 
// @author       You
// @match        https://cripto.tiiny.site/
// @run-at       document-end
// @icon         none
// @require      https://code.jquery.com/jquery-3.7.0.min.js#sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g=
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha256-jjsBF/TfS+RSwLavW48KCs+dSt4j0I1V1+MSryIHd2I=
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467185/Lab4%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/467185/Lab4%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Select the <p> element you want to target
        var paragraph = $('p');

        // Get the text content of the <p> element
        var paragraphText = paragraph.text();

        // Get the string made with first characters
        var firstCharacterString = getFirstCharacterString(paragraphText);

        console.log("La llave es: " + firstCharacterString); // Print the first character string to the console

        function getFirstCharacterString(text) {
            var subStrings = text.split('.');
            var firstCharacters = "";

            for (var i = 0; i < subStrings.length; i++) {
                var subString = subStrings[i].trim();

                if (subString.length > 0) {
                    var firstCharacter = subString.charAt(0);
                    firstCharacters += firstCharacter;
                }
            }

            return firstCharacters;
        }

        function countDivElementsWithMClass() {
            var divCount = 0;

            $('div[class^="M"]').each(function() {
                divCount++;
            });

            return divCount;
        }

        var divCount = countDivElementsWithMClass();

        console.log("Los Mensajes cifrados son: "+divCount); // Print the count to the console

        decodeDivIDs(firstCharacterString);

        function addtexttoBody(text) {
            var div = document.createElement("div");
            var content = document.createTextNode(text);
            div.appendChild(content);
            document.body.appendChild(div);
        }

        function decodeDivIDs(key) {
            $('div[class^="M"]').each(function() {
                var div = $(this);
                var encodedID = div.attr('id');
                var decodedID = CryptoJS.TripleDES.decrypt(encodedID, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
                addtexttoBody(decodedID)
                console.log(encodedID + ' ' + decodedID);
            });
        }

    });
})();