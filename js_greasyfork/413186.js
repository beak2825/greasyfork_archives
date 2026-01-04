// ==UserScript==
// @name         Tesco Delivery Slots
// @author       Than
// @version      0.02
// @description  Makes it easier to shop for groceries on tesco.com
// @match        https://*.tesco.com/groceries/*
// @include      https://*.tesco.com/groceries/*
// @include      https://secure.tesco.com/account/en-GB/login*
// @connect      tesco.com
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/288098
// @downloadURL https://update.greasyfork.org/scripts/413186/Tesco%20Delivery%20Slots.user.js
// @updateURL https://update.greasyfork.org/scripts/413186/Tesco%20Delivery%20Slots.meta.js
// ==/UserScript==


(function() {
    //  'use strict';
    try {
        /*--------------------------------------------------------------------------------------------------------------------
    ------------------------------------------- General functions --------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
        //   var Email = { send: function (e, o, t, n, a, s, r, c) { var d = Math.floor(1e6 * Math.random() + 1), i = "From=" + e; i += "&to=" + o, i += "&Subject=" + encodeURIComponent(t), i += "&Body=" + encodeURIComponent(n), void 0 == a.token ? (i += "&Host=" + a, i += "&Username=" + s, i += "&Password=" + r, i += "&Action=Send") : (i += "&SecureToken=" + a.token, i += "&Action=SendFromStored", c = a.callback), i += "&cachebuster=" + d, Email.ajaxPost("https://smtpjs.com/v2/smtp.aspx?", i, c) }, sendWithAttachment: function (e, o, t, n, a, s, r, c, d) { var i = Math.floor(1e6 * Math.random() + 1), m = "From=" + e; m += "&to=" + o, m += "&Subject=" + encodeURIComponent(t), m += "&Body=" + encodeURIComponent(n), m += "&Attachment=" + encodeURIComponent(c), void 0 == a.token ? (m += "&Host=" + a, m += "&Username=" + s, m += "&Password=" + r, m += "&Action=Send") : (m += "&SecureToken=" + a.token, m += "&Action=SendFromStored"), m += "&cachebuster=" + i, Email.ajaxPost("https://smtpjs.com/v2/smtp.aspx?", m, d) }, ajaxPost: function (e, o, t) { var n = Email.createCORSRequest("POST", e); n.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), n.onload = function () { var e = n.responseText; void 0 != t && t(e) }, n.send(o) }, ajax: function (e, o) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; void 0 != o && o(e) }, t.send() }, createCORSRequest: function (e, o) { var t = new GM.xmlHttpRequest; return "withCredentials" in t ? t.open(e, o, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, o) : t = null, t } };
        //Check the DOM for changes and run a callback function on each mutation
        function observeDOM(callback){
            var mutationObserver = new MutationObserver(function(mutations) { //https://davidwalsh.name/mutationobserver-api
                mutations.forEach(function(mutation) {
                    callback(mutation) // run the user-supplied callback function,
                });
            });
            // Keep an eye on the DOM for changes
            mutationObserver.observe(document.body, { //https://blog.sessionstack.com/how-javascript-works-tracking-changes-in-the-dom-using-mutationobserver-86adc7446401
                attributes: true,
                //  characterData: true,
                childList: true,
                subtree: true,
                //  attributeOldValue: true,
                //  characterDataOldValue: true,
                attributeFilter: ["class"] // We're really only interested in stuff that has a className
            });}

        function convertKtoM(price){ // converts kg to g, for example
            return (price / 10).toFixed(2);
        }
        function percentColour(percent){ // 100% = red, 0% = green
            var color = 'rgb(' + (percent *2.56) +',' + ((100 - percent) *2.96) +',0)'
            return color;
        }
        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }

        /*--------------------------------------------------------------------------------------------------------------------
    ------------------------------------------- Init functions --------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
        if (!localStorage.openSlotsTimes){localStorage.openSlotsTimes = JSON.stringify([])}
        if (!localStorage.openSlots){localStorage.openSlots = JSON.stringify([])}
        if (!localStorage.errors){localStorage.errors = JSON.stringify([])}
        function sleep(ms) { // usage: await sleep(4000)
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        var gmFetch = {} // https://www.vojtechruzicka.com/javascript-async-await/ AND https://gomakethings.com/promise-based-xhr/
        gmFetch.get = function (address,headers,anonymous) {
            return new Promise((resolve, reject) => {
                if (!headers){headers = ""}
                anonymous = anonymous ? anonymous : false;
                GM.xmlHttpRequest({
                    method: "GET",
                    url: address,
                    headers: headers,
                    anonymous: anonymous,
                    onload: e => resolve(e.response),
                    onerror: reject,
                    ontimeout: reject,
                });
            });
        }
        gmFetch.post = function (address,postData,headers,anonymous,simple=true) {
            return new Promise((resolve, reject) => {
                if (!headers){headers = {"Content-Type": "application/x-www-form-urlencoded"}}
                anonymous = anonymous ? anonymous : false;
                GM.xmlHttpRequest({
                    method: "POST",
                    url: address,
                    headers: headers,
                    data: postData,
                    anonymous: anonymous,
                    onload: (simple ? e => resolve(e.response) : e => resolve(e)),
                    onerror: reject,
                    ontimeout: reject,
                });
            });
        }
        async function checkSlotsXhr(){
            if (!document.querySelector("a[class*=slot-selector]")){return} // this querySelector signifies that we are on the slot page
            document.querySelector("a[class*=slot-selector]").scrollIntoView(); // scroll the slots into view just so we can identify whether there are slots
            var headers = { // headers will be the same for everey request
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:75.0) Gecko/20100101 Firefox/75.0",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.5",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                "ADRUM": "isAjax:true",
            }
            var slotTabs = document.querySelectorAll("a[class*=slot-selector]"); // get all the week selection tabs
            var slotUrls = getSlotUrls(slotTabs); // and the urls from each
            var slotDates = getSlotDates(slotUrls);
            while (true){
                await visitEachSlotUrl(slotDates)
            }
            //  var avaiableSlots = await visitEachSlotUrl(slotUrls); // runs the function which checks the responses for slots
            async function visitEachSlotUrl(slotDates){
                for (var i=0,j = slotDates.length;i<j;i++){ // for each url
                    var randomNumber = getRndInteger(22000, 45000) // generates a random millisecond around 6000;
                  //  randomNumber =3;
                    console.log(`waiting for ${randomNumber} ms`);
                    await sleep(randomNumber); // first do nothing for a little while
                    var address = "https://www.tesco.com/groceries/en-GB/resources";
                    var weekBeginning = slotDates[i]; // the current address of this loop
                    var postData = getPostData(weekBeginning);
                    var headers = getHeaders();
                    console.log(address);
                    console.log(postData);
                    console.log(headers);
                    var response = await gmFetch.post(address,postData,headers); // get the response
                    console.log(response);
                    //redirect-to
                    if (!response.includes("slots")){
                        console.log(response);
                        GM_notification("Error? What's going on");
                    }
                    if (response.includes("redirect-to")){
                        console.log("Error - we got redirected. Slowing things down a little.");
                        console.log(response);
                        await sleep(60000); // give it a minute
                        location.reload(); // reload the whole page
                        return;
                    }
                    if (response.includes("503 Service Temporarily Unavailable")){location.reload();} // reload, to trigger more frequent reloads
                    console.log(response);
                    var json = JSON.parse(response); // parse it
                    console.log(json);
                    var slots = json.slot.data.slots; // get the slot array
                    var slotAvailable = searchForAvailable(slots); // returns true or false depending on whether this group has slots
                    console.log(slotAvailable);
                    if (slotAvailable){ // if it returns true
                        var existingSlotInfo = JSON.parse(localStorage.openSlots);
                        existingSlotInfo.push(json);
                        localStorage.openSlots = JSON.stringify(existingSlotInfo);
                        var existingTimeInfo = JSON.parse(localStorage.openSlotsTimes);
                        existingTimeInfo.push(Date());
                        localStorage.openSlotsTimes = JSON.stringify(existingTimeInfo);
                        var selectorHref = json.selectedDate + "?slotGroup=1"; // get the css selector we're gonna click on
                        GM_notification("Slots available!"); // alert them 3 times in case they miss it
                        document.querySelector(`[href*='${weekBeginning}']`).click(); // click on the corrosponding week for the user's convenience
                        await sleep(8000);
                        GM_notification("Slots available!");
                        await sleep(8000);
                        GM_notification("Slots available!");
                        await sleep(8000);
                        return; // quit this function so we're just sitting on the week with the first available slot
                    }
                }
                function searchForAvailable(slots){

                    for (var i=0,j = slots.length;i<j;i++){ // for each slot in this array
                        if (slots[i].status != "UnAvailable" && slots[i].status != "Unavailable" && slots[i].status != "Booked"){ // if the slot isn't marked "unavailable" or already "Booked"
                            checkIfSpecificDateWanted(slots[i].start);
                            if (checkIfSpecificDateWanted(slots[i].start)){ // but now we want to search a specific date.
                                console.log(slots[i]) // log it
                                return true; // quit this whole function cos we got one
                            }
                        }
                    }
                    return false; // otherwise, if we get through all the loops without an open slot, return false
                    function checkIfSpecificDateWanted(date){
                        var wantedSlotsArray = [
                            "2020",
"2021",
"2022",
"2023",
"2024",
                        ]
                        for (var i=0,j = wantedSlotsArray.length;i<j;i++){
                            if (date.includes(wantedSlotsArray[i])){
                                return true
                            }
                        }
                    }
                }
            }
            function getHeaders(){
                var csrfToken = document.querySelector("input[name=_csrf]").value;
                var headers = {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:81.0) Gecko/20100101 Firefox/81.0",
                    "Accept": "application/json",
                    "Accept-Language": "en-US,en;q=0.5",
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken,
                }
                return headers;
                }
            function getPostData(date){
                var finalPostData = {
                    "acceptWaitingRoom": false,
                    "resources": [
                        {
                            "type": "slot",
                            "params": {
                                "query": {
                                    "locationId": null,
                                    "postcode": "",
                                    "slotGroup": 1
                                },
                                "shoppingMethod": "delivery",
                                "date": date
                            },
                            "hash": "8864683814091659"
                        },
                        {
                            "type": "fulfilmentMetadata",
                            "params": {
                                "shoppingMethod": "delivery"
                            },
                            "hash": "478896531623469"
                        },
                        {
                            "type": "trolleyContents",
                            "params": {},
                            "hash": "8812624788225991"
                        }
                    ],
                    "sharedParams": {
                        "date": date,
                        "shoppingMethod": "delivery",
                        "query": {
                            "locationId": null,
                            "postcode": "",
                            "slotGroup": 1
                        }
                    }
                }
                return JSON.stringify(finalPostData);
            }
            function getSlotUrls(slots){
                var urlArray = []
                for (var i=0,j = slots.length;i<j;i++){
                    urlArray.push(slots[i].href);
                }
                return urlArray;
            }
        }
        checkSlotsXhr();
        // checkForSlots();
        checkForQueue();
        function getSlotDates(slotUrls){
            var finalArray = []
            for (var i=0,j = slotUrls.length;i<j;i++){
                finalArray.push(slotUrls[i].match(/\d\d\d\d-\d\d-\d\d/)[0])
            }
            return finalArray;
        }
        function reloadPageAfter(seconds){
            setTimeout(function() {
                location.reload();
            }, (seconds * 1000));
        }

        async function checkForQueue(){
            var currentHour = Date().split("2020 ")[1].split(":")[0];
            var randomNumber = getRndInteger(600, 900) // generates a number around 160 or so by default
            var pageText = document.body.textContent;
            if (currentHour == 23){ // it's 11pm
                randomNumber = getRndInteger(230, 270); // reload more frequently
            }
            if (pageText.includes("now in a queue")){
                GM_notification("In a queue!");
                randomNumber = getRndInteger(65, 79); // reload about once a minute, in case it doesn't happen automatically
            }
            if (pageText.includes("Sign in to your account")){ // let's autologin
                await sleep(16000);
                randomNumber = 5;
                document.querySelector(".ui-component__button").click(); // click the login button
            }
            if (pageText.includes("503 Service Temporarily Unavailable")){
                randomNumber = getRndInteger(20, 31); // reload more frequently to make sure we get back in.
            }
            if (pageText.includes("Oops, something went wrong! (504)")){
                randomNumber = getRndInteger(20, 31); // reload more frequently to make sure we get back in.
            }
            console.log(`Reloading after ${randomNumber} seconds`)
            reloadPageAfter(randomNumber);
        }
        function checkForSlots(){
            return; // don't need this right now
            if (!document.querySelector("a[class*=slot-selector]")){return} // this signifies that we are on the slot page
            var firstSlot = document.querySelector("a[class*=slot-selector]").textContent
            var lastSlot = document.querySelectorAll("a[class*=slot-selector]")[2].textContent
            console.log(firstSlot);
            if (!firstSlot.includes("Apr 06 - 12")){
                GM_notification("New Slots! " + lastSlot);
                beep();
            }
            reloadPageAfter(30);
        }
        function beep() {
            var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
            snd.play();
        }
    }
    catch(err){console.log(err);
               var existingErrors = JSON.parse(localStorage.errors);
               existingErrors.push(err);
               localStorage.errors = JSON.stringify(existingErrors);
              }
    // Your code here...
})();