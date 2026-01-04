// ==UserScript==
// @name         All Nomination Submission Data Copy
// @author       Saiful Islam
// @version      2.4
// @description  Help users in review
// @namespace    https://github.com/AN0NIM07
// @match        https://www.google.com/*
// @grant        GM.setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/477928/All%20Nomination%20Submission%20Data%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/477928/All%20Nomination%20Submission%20Data%20Copy.meta.js
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

                if(parseInt(localStorage.getItem("StartPosition")) >= objectLength)
                {
                    alert("There's No More Nomination Stored in The Sheet");
					return;
                }

                var x = parseInt(localStorage.getItem("StartPosition"));

                var RowNumberInSheet = x+2;
                console.log("Row Number Starts from: "+RowNumberInSheet);
                title = `${data[x].Title}`;
                description = `${data[x].Description}`;
                supportingText = `${data[x].SupportingText}`;
                category = `${data[x].Category}`;
                photoLink = `${data[x].PhotoLink}`;
                let photoDownloadLink ='';
                let rowInformation = 'Current Nom Row: '+RowNumberInSheet.toString();
				
                let locationCord = `${data[x].Latitude}`.toString() + "," + `${data[x].Longitude}`.toString();
                //let locationCord = "Row Number in Sheet: " + RowNumberInSheet.toString();
				
				if(`${data[x].Latitude}`.toString() == '' || `${data[x].Longitude}`.toString() == '' || `${data[x].Latitude}` === null || `${data[x].Longitude}` === null)
				{
					alert('Location Cord Cells are Empty.  \n\nExiting Program');
					return;
				}

                if(photoLink != '')
                {
                   photoDownloadLink = "https://drive.google.com/uc?export=download&id=" + photoLink.substring(32,photoLink.length - 17);
                }


                x = x+1;
                RowNumberInSheet = RowNumberInSheet + 1;
                window.localStorage.removeItem("StartPosition");
                localStorage.setItem("StartPosition", x );
                console.log("Row Number Set to: " + RowNumberInSheet);

                console.log("Loc: " +locationCord);
                //console.log(photoDownloadLink);
                //console.log(category);
                //console.log(supportingText);
                //console.log(description);
                //console.log(title);


                if(photoLink == '' && category =='')
                {
                    window.location.reload();
                }

                sleep(500)
                    .then(() => GM.setClipboard(rowInformation))
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