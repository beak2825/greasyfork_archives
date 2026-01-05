// ==UserScript==
// @name         Boursorama - Téléchargement en masse
// @namespace    https://clients.boursorama.com
// @version      0.1
// @description  Télécharge en masse les documents du coffre fort
// @author       Niks
// @match        https://clients.boursorama.com/documents/coffre-fort/factures/*
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/24263/Boursorama%20-%20T%C3%A9l%C3%A9chargement%20en%20masse.user.js
// @updateURL https://update.greasyfork.org/scripts/24263/Boursorama%20-%20T%C3%A9l%C3%A9chargement%20en%20masse.meta.js
// ==/UserScript==


GM_registerMenuCommand('Télécharger', downloadFiles);

function downloadFiles()
{
    var tags = document.getElementsByTagName('tr');

    for (var i = 0; i < tags.length; i++)
    {
        if (tags[i].className == "table__line")
        {
            var dataID = tags[i].getAttribute("data-id");
            var reqURL = "https://clients.boursorama.com/documents/coffre-fort/telecharger?ids=" + dataID;
            var fileName = tags[i].children[1].innerText + tags[i].children[0].innerText.trim() + "-" + tags[i].children[3].innerText + "-" + tags[i].children[2].innerText + ".pdf";
            GM_download({
                url: reqURL,
                name: fileName,
                saveAs: false,
                onerror: function (e) {
                    console.log(e);
                    error();
                }
            }); 
        }
    }
}

