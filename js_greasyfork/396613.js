// ==UserScript==
// @name         Forum Signature
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Set your personal post signature for the forum via a new Button "Signature".
// @author       Dominik Hirsch
// @include      https://de*.die-staemme.de/game.php?village=*&screen=forum&screenmode=view_thread&thread_id=*&answer=true*
// @include      https://de*.die-staemme.de/game.php?village=*&screen=forum&screenmode=view_thread&action=new_post&thread_id=*&answer=true*
// @match        https://de*.die-staemme.de/game.php?village=*&screen=forum&screenmode=view_thread&thread_id=*&answer=true*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396613/Forum%20Signature.user.js
// @updateURL https://update.greasyfork.org/scripts/396613/Forum%20Signature.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // set the signature string ("\n" displays as new Line)
    var sigDivider = "\n\n______________\n";
    var signature = "";

    // get the textarea from html
    var messageBox = document.getElementById("message");
    var elements = document.getElementById("bb_bar");

    // create new button for generating a signature
    var input = document.createElement("input");
    input.type="button";
    input.value="Signatur";
    input.onclick = onSignatureClick;
    elements.append(input);

    if (localStorage.UserSignature != null || localStorage.UserSignature != "")
    {
        signature = localStorage.UserSignature;
        if (signature != "" && !messageBox.value.includes(signature))
        {
            messageBox.value.replace(sigDivider+"[i]"+signature+"[/i]", "");
        }

        console.log("signature: "+signature);
    }


    /*
     * OnClickHandler for Signature Button
     */
    function onSignatureClick()
    {
        var sig = prompt("Enter your preferred signature", "Your Name");

        localStorage.removeItem("UserSignature");
        messageBox.value.replace(sigDivider+"[i]"+signature+"[/i]", "");

        if (sig != null)
        {
            AddToLocalStorage("[i]"+sig+"[/i]");
        }
        AppendSignatureToMessage(sig);
    }

    /*
     *get the html element containing the message and append the signature to the message.
     */
    function AppendSignatureToMessage(sig)
    {
        messageBox.value += sigDivider+"[i]"+sig+"[/i]";
    }

    /*
     * Saves a given string into the local storage.
     */
    function AddToLocalStorage(str)
    {
        if ("localStorage" in window)
        {
            localStorage.setItem("UserSignature", str);
        }
        else
        {
            alert("no localStorage in window");
        }
    }
})();