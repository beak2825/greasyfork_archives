// ==UserScript==
// @name         Submission Data Copy
// @author       Saiful Islam
// @version      1.0
// @description  Help users in review
// @namespace    https://github.com/AN0NIM07
// @match        https://www.google.com/*
// @grant        GM.setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/450183/Submission%20Data%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/450183/Submission%20Data%20Copy.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */
(function() {

    //window.localStorage.removeItem("RowNumber");
    //localStorage.setItem("RowNumber", 0);
   // return;


    let title ='';
    let description = '';
    let supportingText = '';
    let category = '';
    let photoLink = '';
    const url = 'https://script.google.com/macros/s/AKfycbwdG9ZwB5qQMYauq4MsXAOj_DPE9HRptMPLy9VcgnOTHZwDQEMkFsxQZ0mMSZnaCcy6/exec?action=getUsers';
            fetch(url)
                .then(res => res.json())
                .then(data =>{
                //console.log(data);
                var objectLength = Object.keys(data).length;
                console.log("Length:"+ objectLength);

                if (localStorage.getItem("RowNumber") === null || localStorage.getItem("RowNumber") == 1000 || parseInt(localStorage.getItem("RowNumber")) > objectLength-1) {

                    for(var i=0; i<objectLength; i++)
                    {
                        if(`${data[i].Submit}` != 'DONE')
                        {
                            localStorage.setItem("RowNumber", i);
                            break;
                        }
                    }
                }

                var x = parseInt(localStorage.getItem("RowNumber"));
                if(`${data[x].Submit}` == 'DONE')
                {
                    window.localStorage.removeItem("RowNumber");
                    localStorage.setItem("RowNumber", 1000);
                    return;
                }
                console.log("Row Number Starts from: "+x);
                title = `${data[x].Title}`;
                description = `${data[x].Description}`;
                supportingText = `${data[x].SupportingText}`;
                category = `${data[x].Category}`;
                photoLink = `${data[x].PhotoLink}`;

                let locationCord = `${data[x].Latitude}`.toString() + "," + `${data[x].Longitude}`.toString();

                let photoDownloadLink = "https://drive.google.com/uc?export=download&id=" + photoLink.substring(32,photoLink.length - 17);


                if(parseInt(localStorage.getItem("RowNumber")) == objectLength)
                {
                    window.localStorage.removeItem("RowNumber");
                     localStorage.setItem("RowNumber", 1000);
                    console.log("Row Number Set to: 1000");
					return;
					
                }
                else
                {
                    x = x+1;
                    window.localStorage.removeItem("RowNumber");
                    localStorage.setItem("RowNumber", x );
                    console.log("Row Number Set to: " + x);
                }
                //console.log(photoDownloadLink);
                //console.log(locationCord);
                //console.log(category);
                //console.log(supportingText);
                //console.log(description);
                //console.log(title);

                sleep(500)
                    .then(() => GM.setClipboard(photoDownloadLink))
                    .then(() => sleep(1000))
                    .then(() => GM.setClipboard(category))
                    .then(() => sleep(1000))
                    .then(() => GM.setClipboard(supportingText))
                    .then(() => sleep(1000))
                    .then(() => GM.setClipboard(title))
                    .then(() => sleep(1000))
                    .then(() => GM.setClipboard(description))
                    .then(() => sleep(1000))
                    .then(() => GM.setClipboard(locationCord))
                    .then(() => sleep(1000))
                    .then(() => GM_openInTab(photoDownloadLink))

                return;

            }
                      )

    function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


})();