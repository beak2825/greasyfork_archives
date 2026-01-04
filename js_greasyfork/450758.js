// ==UserScript==
// @name         YouMail - Download Multiple Voicemails
// @namespace    http://tampermonkey.net/
// @license      GNU GPLv3
// @version      0.25
// @description  Adds an mp3 and wav download option to YouMail's inbox - an option that is normally only available for paid users.
// @author       YAK
// @match        https://dashboard.youmail.com/messages/inbox
// @include      /^https:\/\/dashboard\.youmail\.com\/messages\/(inbox\/)?.+/
// @icon         https://www.google.com/s2/favicons?domain=youmail.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/luxon@2.3.0/build/global/luxon.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @connect      youmail.com
// @downloadURL https://update.greasyfork.org/scripts/450758/YouMail%20-%20Download%20Multiple%20Voicemails.user.js
// @updateURL https://update.greasyfork.org/scripts/450758/YouMail%20-%20Download%20Multiple%20Voicemails.meta.js
// ==/UserScript==

// This userscript downloads voicemails by detecting what order, pagination, folder, ect is currently selected and endeavoring
//    to make a mostly identical API call to the YouMail server that Youmail itself makes. Then, when the download button is pressed,
//    we get the id number of checked voicemails which should directly correlate to the index of our API call. From there,
//    we can download the individual files from a URL provided in our API call.

// GM_setValue() and GM_getValue() is used to store the 'jsonData' we get from the API call. This is done so the data will
//    always be up to date and GM_setValue() is used as a global variable instead of a singleton.

(function() {
    'use strict';


    GM_setValue("jsonData", null);

    //.btn-group is not created when the page loads so we use a series of MutationObserver to trigger getData() instead onClick operators

    //Outer MutationObserver
    let observer = new MutationObserver(() => {
        let search = document.querySelector(".btn-group");
        if(search){
            observer.disconnect();

            //Now that we have buttons we can monitor the Actions dropdown to add the downloads buttons
            bind();

            // We make an API call now so we don't get stuck without the data if the user presses the download button before a request is made.
            let authToken = getAuthToken();
            getData(authToken);


            //Inner MutationObserver
            let getDataTrigger = new MutationObserver(() => {
                //The authToken is required for the API call and is included in the innitial page load.
                let authToken = getAuthToken();
                getData(authToken);
                console.log("TamperMonkey - Download Multiple Voicemails, network request");
            });


            //When these selctors change state (ie. when a dropdown gets expanded) a new API call will be made
            //It seems like the checkboxes don't work
            let triggers = document.querySelectorAll(".form-check-input, .dropdown-toggle, .btn-group, entity-search-input");

            let param = {
                childList: true, // observe direct children
                subtree: true, // and lower descendants too
                attributes: true,
                characterData: true
            };

            // This binds all our triggers to our observer
            triggers.forEach(trigger => {getDataTrigger.observe(trigger, param)});
        }
    });

    //For outer MutationObserver
    let seen = document.querySelector(".entity-list-page");

    observer.observe(seen, {
        childList: true, // observe direct children
        subtree: true, // and lower descendants too
        characterDataOldValue: true // pass old data to callback
    });



    // bind();
    //   var jsonData = getData(authToken);

})();

// This function creates the download button.
function bind(){
    // $(".entity-list-heading").click(() => {
    //     downloadMultiple(jsonData, true);
    //  });


    // The dropdowns are dynamically created so we must create the botton each time the dropdown is expanded
    let addButtons = new MutationObserver(() => {

        let menu = $(".popover-enter-done");
        //The .popover-enter-done class is used for the other dropdown menus and we only want to add one set of buttons.
        //    Therefore, we set upper and lower bounds to the amount of elements a dropdown menu can have before proceeding
        if(menu.first().children().length < 8 && menu.first().children().length > 5){
            let downloadMp3 = menu.children().last().clone();
            let downloadWav = menu.children().last().clone();

            downloadMp3.text("TM Download - mp3");
            downloadMp3.addClass("tm-download-mp3");

            downloadWav.text("TM Download - wav");
            downloadWav.addClass("tm-download-wav");

            downloadMp3.appendTo(menu);
            downloadWav.appendTo(menu);

            downloadMp3.click(() => {
                downloadMultiple(true);
            });

            downloadWav.click(() => {
                downloadMultiple(false);
            });

            $(".dropdown").click(() => {
                downloadMp3.remove();
                downloadWav.remove();
            });
        }
    });

    let dropdown = document.querySelectorAll(".dropdown")[2];

    addButtons.observe(dropdown, {
        childList: true, // observe direct children
        subtree: true, // and lower descendants too
        attributes: true,
        characterData: true
    });
}

// After the download button gets clicked it calls this function to download
function downloadMultiple(isMp3){
    let jsonData = GM_getValue("jsonData", []);

    let fileType = isMp3 ? 2 : 1;
    var DateTime = luxon.DateTime

    // get the index of the checked voicemails
    let elements = getCheckedIndex();

    if(!elements)
        return;

    //We loop through the checked voicemails and create a name and download each one in turn
    elements.forEach(index => {
        // Load up the json data for the current checked voicemail
        let item = jsonData[index];


        //Create a luxon object corresponding to the voicemail's timestamp
        let time = DateTime.fromMillis(item.createTime);

        let callerName = item.callerName;
        // If YouMail doesn't have a name it will use the number instead. We detect if it is a number by whether there is a "+", "(", or ")".
        //    If it is a number we replace callerName with a blank string otherwise we format callerName.
        callerName = ['+', '(', ')'].some(el => callerName.includes(el)) ? "" : "__" + callerName;


        let number = item.source;
        //If the number starts with "+1" (US area code) we remove it. If it starts with some other known area code we add a hyphen after the area code.
        number = number.replaceAll(/^\+1/igm, "");
        let phoneRegex = /^(\+1242|\+1246|\+1264|\+1268|\+1268|\+1284|\+1340|\+1345|\+1441|\+1473|\+1649|\+1664|\+1670|\+90392|\+1671|\+1684|\+1721|\+1758|\+1767|\+1784|\+1787|\+1939|\+1808|\+1808|\+1809|\+1829|\+1868|\+1869|\+1869|\+1658|\+1876|\+20|\+211|\+212|\+213|\+216|\+218|\+220|\+221|\+222|\+223|\+224|\+225|\+226|\+227|\+228|\+229|\+230|\+231|\+232|\+233|\+234|\+235|\+236|\+237|\+238|\+239|\+240|\+241|\+242|\+243|\+244|\+245|\+246|\+246|\+247|\+248|\+249|\+250|\+251|\+252|\+253|\+254|\+255|\+888|\+25524|\+256|\+257|\+258|\+260|\+261|\+262|\+262269|\+262639|\+263|\+264|\+265|\+266|\+267|\+268|\+269|\+27|\+290|\+2908|\+291|\+297|\+298|\+299|\+30|\+31|\+32|\+33|\+34|\+350|\+351|\+352|\+353|\+354|\+355|\+356|\+357|\+358|\+35818|\+359|\+36|\+370|\+371|\+372|\+373|\+3732|\+3735|\+374|\+37447|\+37497|\+375|\+376|\+377|\+378|\+380|\+381|\+382|\+383|\+385|\+386|\+387|\+389|\+39|\+3906698|\+40|\+41|\+420|\+421|\+423|\+43|\+44|\+441481|\+447781|\+441534|\+441624|\+447524|\+4428|\+45|\+46|\+47|\+4779|\+4779|\+48|\+49|\+500|\+500|\+501|\+502|\+503|\+504|\+505|\+506|\+507|\+508|\+509|\+51|\+52|\+53|\+54|\+55|\+56|\+56|\+57|\+58|\+590|\+590|\+590|\+591|\+592|\+593|\+594|\+595|\+596|\+596|\+597|\+598|\+5993|\+5993|\+5994|\+5997|\+5994|\+5997|\+5999|\+60|\+61|\+6189162|\+6189164|\+62|\+63|\+64|\+64|\+64|\+65|\+66|\+670|\+672|\+6721|\+6723|\+673|\+674|\+675|\+676|\+677|\+678|\+679|\+680|\+681|\+682|\+683|\+685|\+686|\+687|\+688|\+689|\+690|\+691|\+692|\+800|\+808|\+81|\+82|\+84|\+850|\+852|\+853|\+855|\+856|\+86|\+870|\+878|\+880|\+881|\+8810|\+8811|\+8812|\+8813|\+8816|\+8817|\+8818|\+8819|\+882|\+883|\+88213|\+88216|\+886|\+90|\+91|\+92|\+93|\+94|\+95|\+960|\+961|\+962|\+963|\+964|\+965|\+966|\+967|\+968|\+970|\+971|\+972|\+973|\+974|\+975|\+976|\+977|\+979|\+98|\+992|\+993|\+994|\+995|\+99534|\+996|\+998)/igm;
        number = number.replaceAll(phoneRegex, "$1-");


        let url = item.messageDataUrl;
        //We replace the last digit with a "1" or "2" depending if mp3 or WAV is selected.
        url = url.replaceAll(/\d$/igm, fileType);

        let name = time.toFormat("y-MM-dd--hh-mm-ss-a") +"__"+ number + callerName + (isMp3 ? ".mp3" : ".wav");


        // We download the file using TamperMonkey's built in downloader. Access must be granted and "@connect youmail.com" must be stated.
        GM_download(url, name);
    });

}

function getCheckedIndex(){
    let elementList = [];

    $("input:checkbox[name=entityCheckbox]:checked").each(function() {
        let id = $(this).attr("id");
        id = id.replaceAll(/\D/igm, '');
        id = parseInt(id);
        elementList.push(id);
    });

    return elementList;
}

function getData(authToken){
    let jsonDatatemp;

    let folderId = $(".chosenMenuLink > div > div > div").get()[1].innerHTML;

    let pageLengthMessage = $(".dropdown-toggle:contains(per page)").text();
    let pageLengthNumber = pageLengthMessage.replaceAll(/,| per page/igm, "");
    let pageLength = parseInt(pageLengthNumber);

    let messageCountList = $(".entity-list-footer-info").text();
    let messageCount = messageCountList.replaceAll(/(^Showing )|(-.+)/igm, "");
    messageCount = parseInt(messageCount);
    let pageNumber = ((messageCount - 1) / pageLength) + 1;


    let sortByMessage = $(".dropdown-toggle:contains(Oldest)").text();
    let sortBy = sortByMessage.includes("Newest to Oldest") ? '-created' : "created";

    // This is currently not implemented and so is blank.
    let keywordSearch = "";

    // As of yet "GM_" does not support fetch()
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.youmail.com/api/v4/messagebox/entry/query?folderId=" + folderId +
        "&pageLength=" + pageLength +
        "&pageNumber=" + pageNumber +
        "&sortBy=" + sortBy +
        "&keywordSearch=" + keywordSearch +
        //Strictly speaking not all fields are required
        "&messageTypes=all&actionTypes=all&fields=id,status,messageDataUrl,body,preview,imageUrl,callerName,impliedCallerName,createTime,length,transcript,source,destination,folderId,flagged,shareKey,messageType,mediaType,phonebookSourceId,contactActionType,notes,shared",
        headers: {
            "authority": "api.youmail.com",
            "pragma": "no-cache",
            "cache-control": "no-cache",
            "youmail-client-id": "YouMailWeb/1.1",
            "authorization": "YouMail " + authToken,
            "content-type": "application/json",
            "accept": "application/json",
            "origin": "https://dashboard.youmail.com",
            "sec-fetch-site": "same-site",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            "referer": "https://dashboard.youmail.com/",
            "accept-language": "en-US:en;q=0.9",
        },
        onload: (response) => {
            jsonDatatemp = JSON.parse(response.responseText).entries;
            GM_setValue("jsonData", jsonDatatemp);

            //bind();
        }
    });
    return jsonDatatemp;
}

function getAuthToken(){
    let script = document.getElementById("__NEXT_DATA__").innerHTML;
    return JSON.parse(script).props.contextProps.auth.authToken;
}