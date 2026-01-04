// ==UserScript==
// @name         Mame resolution fixes
// @author       Than
// @version      0.05
// @description  Helps set the resolution for mame items at the internet archive
// @match        https://archive.org*
// @include      https://archive.org*
// @connect      adb.arcadeitalia.net
// @connect      archive.org
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/288098
// @downloadURL https://update.greasyfork.org/scripts/411434/Mame%20resolution%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/411434/Mame%20resolution%20fixes.meta.js
// ==/UserScript==


/*
var all = document.querySelectorAll	("[data-id]");
for (var i=0,j = all.length;i<j;i++){
if (!all[i].querySelector(".ttl")){continue}
if (all[i].getAttribute("processed")){continue}
var link = all[i].querySelector(".item-ttl").querySelector("a");
window.open(link.href,"_blank");
}
*/

/*
TODO:
fix occasional broken image (search commando)
Maybe put AKA under the image on the hover
change colour for exact date match and also match brackets
at some point we'll have to add regex for titles formatted without brackets (eg Tropical 19xx Mantronix)
*/

(function() {
    'use strict';
    /*--------------------------------------------------------------------------------------------------------------------
    ------------------------------------------- General functions --------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
    var spinningLoadingCircle = `<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="45px" height="45px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="1"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.2" transform="rotate(30 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.2" transform="rotate(60 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.2" transform="rotate(90 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.2" transform="rotate(120 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.3" transform="rotate(150 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.4" transform="rotate(180 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.5" transform="rotate(210 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.6" transform="rotate(240 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.7" transform="rotate(270 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.8" transform="rotate(300 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#800000" fill-opacity="0.9" transform="rotate(330 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64" calcMode="discrete" dur="1080ms" repeatCount="indefinite"></animateTransform></g></svg>`;

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
    //Asynchronous cross-domain XHRs:
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
    gmFetch.post = function (address,postData,headers,anonymous) {
        return new Promise((resolve, reject) => {
            if (!headers){headers = {"Content-Type": "application/x-www-form-urlencoded"}}
            anonymous = anonymous ? anonymous : false;
            GM.xmlHttpRequest({
                method: "POST",
                url: address,
                headers: headers,
                data: postData,
                anonymous: anonymous,
                onload: e => resolve(e.response),
                onerror: reject,
                ontimeout: reject,
            });
        });
    }

    /*--------------------------------------------------------------------------------------------------------------------
    ------------------------------------------- Init functions --------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
    init();
    function init(){
        itemPageInit();
        //  searchPageInit();
        observeDOM(doDomStuff);
    }
    function searchPageInit(){
        var container = document.querySelector("#search-actions");
        if (!container){return}
        var openAllButton = document.createElement("button");
        openAllButton.textContent = "Open All Links shown on page";
        openAllButton.addEventListener("click",openAllLinks)
        container.appendChild(openAllButton);
        var numberOfLinksInput = document.createElement("input");
        numberOfLinksInput.value = "160";
        numberOfLinksInput.type = "number";
        container.appendChild(numberOfLinksInput)
        function openAllLinks(){
            var max = parseInt(numberOfLinksInput.value);
            var all = document.querySelectorAll	("[data-id]");
            for (var i=0,j = all.length,k=0;i<j;i++){
                if (!all[i].querySelector(".ttl")){continue}
                if (all[i].getAttribute("processed")){continue}
                if (k>=max){return} // let's not go crazy
                var link = all[i].querySelector(".item-ttl").querySelector("a");
                window.open(link.href,"_blank");
                k++;
            }
        }
    }
    function itemPageInit(){
        var collections = document.querySelectorAll(".collection-item");
        for (var i=0,j = collections.length;i<j;i++){
            if (!collections[i].textContent.includes("Internet Arcade")){continue}
            addInfoToPage();
            //  showAllScreenshots();
        }
    }
    function doDomStuff(mutation){
        if (!mutation.target.getAttribute("data-id")){
            return;
        }
        var itemId = mutation.target.getAttribute("data-id");
        var cantFindItems = JSON.parse(localStorage.csdbNone);
        var foundItems = JSON.parse(localStorage.csdbList);
        if (cantFindItems[itemId]){
            mutation.target.style.display = "none";
            mutation.target.setAttribute("processed","true");
        }
        if (foundItems[itemId]){
            mutation.target.style.backgroundColor = "#b3ffb3";
            mutation.target.style.display = "none";
            mutation.target.setAttribute("processed","true");
        }
    }
    function showAllScreenshots(){
        var screenshotLinks = document.querySelectorAll(".download-pill[href*=screenshot]");
        var theaterControls = document.querySelector("#theatre-controls");
        var screenshotStrip = document.createElement("div");
        screenshotStrip.style = "width: 600px; visibility: visible; right: 10px;position:fixed;z-index:100;top:0;";
        //var screenshotStripContainer = document.createElement("div");
        //screenshotStripContainer.style = "width: 600px; visibility: visible; right: 20px;position:absolute;z-index:1000;top:0;";
        document.body.appendChild(screenshotStrip);
        // screenshotStripContainer.appendChild(screenshotStrip)
        // theaterControls.style.width = "200px";
        //theaterControls.parentElement.appendChild(screenshotStrip);
        for (var i=0,j = screenshotLinks.length;i<j;i++){
            var img = document.createElement("img");
            img.className = "all-images"
            img.src = screenshotLinks[i].href;
            img.style.width = "150px"
            screenshotStrip.appendChild(img);
        }
    }
    function addInfoToPage(){
        if (!localStorage.mameList){localStorage.mameList = JSON.stringify({})}
        //   if (!localStorage.csdbNone){localStorage.csdbNone = JSON.stringify({})}
        var itemId = document.querySelector("[itemprop=identifier]").textContent;
        var partAfterArcade = itemId.split("arcade_")[1];
        // var container = document.querySelector(".item-details-about");
        var descriptionElement = document.querySelector("#descript") || document.querySelector("#reviews");
        var container = document.createElement("div");
        descriptionElement.parentNode.insertBefore(container, descriptionElement);
        displayArcadeDB();
        async function displayArcadeDB(){
            var dbUrl = `http://adb.arcadeitalia.net/dettaglio_mame.php?game_name=${partAfterArcade}`; // checking releases only
            //  var address = "https://csdb.dk/search/advancedresult.php";
            //  var postData = `form%5Bcategory%5D=releases&form%5Bgroup_name%5D=&form%5Bgroup_slogan%5D=&form%5Bgroup_website%5D=&form%5Bgroup_trivia%5D=&form%5Bgroup_fday1%5D=1&form%5Bgroup_fmonth1%5D=1&form%5Bgroup_fyear1%5D=1982&form%5Bgroup_fday2%5D=1&form%5Bgroup_fmonth2%5D=1&form%5Bgroup_fyear2%5D=2021&form%5Bgroup_rating_c%5D=1&form%5Bgroup_rating%5D=1&form%5Bscener_handle%5D=&form%5Bscener_trivia%5D=&form%5Brelease_name%5D=${searchTerm}&form%5Brelease_rday1%5D=1&form%5Brelease_rmonth1%5D=1&form%5Brelease_ryear1%5D=1982&form%5Brelease_rday2%5D=1&form%5Brelease_rmonth2%5D=1&form%5Brelease_ryear2%5D=2021&form%5Brelease_achievement_c%5D=0&form%5Brelease_achievement%5D=&form%5Brelease_text%5D=&form%5Brelease_rating_c%5D=1&form%5Brelease_rating%5D=1&form%5Bevent_name%5D=&form%5Bevent_tagline%5D=&form%5Bevent_hday1%5D=1&form%5Bevent_hmonth1%5D=1&form%5Bevent_hyear1%5D=1982&form%5Bevent_hday2%5D=1&form%5Bevent_hmonth2%5D=1&form%5Bevent_hyear2%5D=2021&form%5Bevent_address%5D=&form%5Bevent_website%5D=&showprpage=25&testsubmit=Perform+Search`
            //  var csdbResultHtml = await gmFetch.post(address,postData);
            var resultsHtml = await gmFetch.get(dbUrl);
            console.log(resultsHtml);
            var resolution = resultsHtml.match(/(<div class="titolo_sezione sezione_video.*)<div class="titolo_sezione sezione_audio/)[1];
            var resolutionElement = document.createElement("div");
            resolutionElement.innerHTML = `<a href="${dbUrl}"><h1>From Arcade DB:</h1></a>${resolution}`;
            container.appendChild(resolutionElement);
            console.log(resolution);
            var jsonUrl = `https://archive.org/download/emularity_engine_v1/${partAfterArcade}.json`;
            var json = await gmFetch.get(jsonUrl);
            var jsobObj = JSON.parse(json);
            var origJsonTitle = document.createElement("H2");
            origJsonTitle.textContent = "Current JSON";
            container.appendChild(origJsonTitle)
            var origJsonElement = document.createElement("textarea");
            origJsonElement.value = json;
            origJsonElement.rows = 20;
            origJsonElement.cols = 50;
            container.appendChild(origJsonElement);
            var suggestedResolution;
            if (document.querySelector("#displays").querySelectorAll("b")[0].textContent){
                suggestedResolution = document.querySelector("#displays").querySelectorAll("b")[0].textContent;
            }
            var suggestedRotation;
            if (document.querySelector("#displays").querySelectorAll("b")[1].textContent){
                suggestedRotation = document.querySelector("#displays").querySelectorAll("b")[1].textContent;
            }

            if (suggestedResolution){
                var x = suggestedResolution.split("x")[0];
                var y = suggestedResolution.split("x")[1];
                if (suggestedRotation){
                    console.log(suggestedRotation);
                    if (suggestedRotation == "90°" || suggestedRotation == "270°"){
                        var temp = x; // swap them round
                        x = y;
                        y = temp;
                    }
                }
                console.log(x);
                console.log(y);
                jsobObj.native_resolution[0] = x;
                jsobObj.native_resolution[1] = y;
                var suggestedJsonTitle = document.createElement("H2");
                suggestedJsonTitle.textContent = "Suggested JSON (click here to download)";
                container.appendChild(suggestedJsonTitle);
                var suggestedJsonElement = document.createElement("textarea");
                suggestedJsonElement.rows = 20;
                suggestedJsonElement.cols = 50;
                suggestedJsonElement.value = JSON.stringify(jsobObj, undefined, 4);
                container.appendChild(suggestedJsonElement);
                suggestedJsonTitle.addEventListener("click",downloadFile);
                function downloadFile(){
                    var fileTitle = partAfterArcade;
                    var exportedFilename = fileTitle + '.json' || 'export.json';
                    var blob = new Blob([suggestedJsonElement.value], { type: 'text/json;charset=utf-8;' });
                    if (navigator.msSaveBlob) { // IE 10+
                        navigator.msSaveBlob(blob, exportedFilename);
                    } else {
                        var link = document.createElement("a");
                        if (link.download !== undefined) { // feature detection
                            // Browsers that support HTML5 download attribute
                            var url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", exportedFilename);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    }
                }
            }
            //  addImageHover();
            function addImageHover(){
                var tooltipLinks = document.querySelectorAll(".csdb-tooltip");
                for (var i=0,j = tooltipLinks.length;i<j;i++){
                    tooltipLinks[i].addEventListener("mouseover",showImage);
                    async function showImage(e){
                        var link = e.target;
                        var tooltip = link.querySelector("span");
                        if (tooltip.querySelector("img")){return}
                        tooltip.innerHTML = spinningLoadingCircle;
                        var url = link.href;
                        var response = await gmFetch.get(url);
                        var imageHtml = response.match(/<img src="\/gfx\/releases\/.*?>/)[0]
                        imageHtml = imageHtml.replace(/src="\/gfx/,"style=\"position: relative;z-index:999999999999;\" src=\"https://csdb.dk/gfx")
                        tooltip.innerHTML = imageHtml;
                        //  console.log(response);
                    }
                }
            }
        }
    }
    var globalStyle = `/* Tooltip container */
.csdb-tooltip {
position: relative;
display: inline-block;
border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.csdb-tooltip .csdb-tooltiptext {
visibility: hidden;
width: 350px;
background-color: black;
color: #fff;
text-align: center;
padding: 5px 0;
border-radius: 6px;

/* Position the tooltip text - see examples below! */
position: absolute;
z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.csdb-tooltip:hover .csdb-tooltiptext {
visibility: visible;
}
#descript{
min-height: 800px;

}

.all-images{
border: 0.5px solid white;
}

`
    GM_addStyle(globalStyle)
    // Your code here...
})();