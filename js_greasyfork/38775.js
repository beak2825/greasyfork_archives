// ==UserScript==
// @name         HFR form
// @namespace    HFR_form
// @include      https://forum.hardware.fr/message.php*
// @version      0.1
// @description  Affiche un formulaire de réponse standardisé dans le champ réponse d'HFR
// @grant         GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/38775/HFR%20form.user.js
// @updateURL https://update.greasyfork.org/scripts/38775/HFR%20form.meta.js
// ==/UserScript==


if (document.URL.indexOf("post=110935") !== -1)
{

    var addFormButton = document.createElement('input');
    addFormButton.setAttribute('type', 'button');
    addFormButton.setAttribute('id', 'fuckYeah');
    addFormButton.setAttribute('value', 'Poster un rapport de make');

    var postButton = document.getElementById('addCommentMessage');
    postButton.parentNode.insertBefore(addFormButton, postButton);

    document.getElementById ("fuckYeah").addEventListener (
        "click", postShit, false
    );
}

function postShit()
{
    var tab = document.getElementById('pseudoform');
    var pseudo = tab.children[1].children[0].value;

    GM.xmlHttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/Niks4925/hfr-forms/master/make",
        onload: function(response) {
            var newContent = response.responseText.replace("$pseudo$", pseudo);
            var content = document.getElementById("content_form").value = newContent;
        }
    });


}