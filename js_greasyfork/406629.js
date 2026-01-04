// ==UserScript==
// @name         CSDB Search
// @author       Than
// @version      0.01
// @description  Makes it easier to find CSDB links for C64 demos
// @match        https://archive.org*
// @include      https://archive.org*
// @connect      csdb.dk
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/288098
// @downloadURL https://update.greasyfork.org/scripts/406629/CSDB%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/406629/CSDB%20Search.meta.js
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
add buttons to bottom of item as well as top
Maybe put AKA under the image on the hover
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
        searchPageInit();
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
        numberOfLinksInput.value = "55";
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
                console.log(link)
                window.open(link.href,"_blank");
                var row = link.closest("[data-id]");
                row.style.backgroundColor = "#b3ffb3";
                row.style.display = "none";
                row.setAttribute("processed","true");
                k++;
            }
        }
    }
    function itemPageInit(){
        var collections = document.querySelectorAll(".collection-item");
        for (var i=0,j = collections.length;i<j;i++){
            if (!collections[i].textContent.includes("Software Library: C64 Demos")){continue}
            addCsdbSearchToPage();
            showAllScreenshots();
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
        screenshotStrip.style = "width: 40%; visibility: visible; right: 1px;position:fixed;z-index:100;top:0;";
        //var screenshotStripContainer = document.createElement("div");
        //screenshotStripContainer.style = "width: 600px; visibility: visible; right: 20px;position:absolute;z-index:1000;top:0;";
        document.body.appendChild(screenshotStrip);
        // screenshotStripContainer.appendChild(screenshotStrip)
        // theaterControls.style.width = "200px";
        //theaterControls.parentElement.appendChild(screenshotStrip);
        for (var i=0,j = screenshotLinks.length;i<j;i++){
            var a = document.createElement("a");
            var img = document.createElement("img");
            img.className = "all-images"
            img.src = screenshotLinks[i].href;
            a.href = screenshotLinks[i].href;
            img.style.width = "120px";
            a.appendChild(img);
            screenshotStrip.appendChild(a);
        }
    }
    function addCsdbSearchToPage(){
        if (!localStorage.csdbList){localStorage.csdbList = JSON.stringify({})}
        if (!localStorage.csdbNone){localStorage.csdbNone = JSON.stringify({})}
        var itemId = document.querySelector("[itemprop=identifier]").textContent;
        // var container = document.querySelector(".item-details-about");
        var container = document.querySelector("#descript");
        var searchBoxContainer = document.createElement("div");
        searchBoxContainer.innerHTML = `<input id=csdb_search>&nbsp;<button id=csdb_search_go>Search CSDB</button>
<button id=csdb_show_list>Show List</button>
<button id=csdb_wipe_list>Wipe List</button>
<button id=csdb_cant_find title="Can't find this in CSDB">🤷‍♀️</button>`;
        container.appendChild(searchBoxContainer);
        var itemTitleContainer = document.querySelector("[itemprop=name]");
        itemTitleContainer.scrollIntoView();
        var itemTitle = itemTitleContainer.textContent;
        var searchBox = document.querySelector("#csdb_search");
        searchBox.style.width = "300px"
        var searchBoxGo = document.querySelector("#csdb_search_go");
        if (JSON.parse(localStorage.csdbList)[itemId]){
            searchBoxGo.textContent = "CSDB url already added!";
        }

        try {
            itemTitle = decodeURI(itemTitle);
            itemTitle = itemTitle.trim();
            console.log(itemTitle);
            try {var itemDate = itemTitle.match(/\(.*?(20\d\d|19\d\d).*?\)/)[1];console.log(itemDate)}catch(err){}
            try {var itemCredit = itemTitle.match(/\(([^0-9\(\)]+.*?)\)/)[1];console.log(itemCredit)}catch(err){}
            try {var itemFullDate = itemTitle.match(/\((19\d\d|20\d\d)\s(\d\d)\s(\d\d)\)/);console.log(itemFullDate)}catch(err){}
            itemTitle = itemTitle.match(/(.*?)(?:$|\.d64|\(|\[|%|\sby\s|199\d|198\d|20\d\d|,\sThe|,\sA)/i)[1];
        }
        catch(err){}
        itemTitle = itemTitle.replace(/percent/i,"%");
        itemTitle = itemTitle.replace(/#/,"");
        itemTitle = itemTitle.replace(/(\D\s)0(\d\s)/,"$1$2");
        itemTitle = itemTitle.replace(/\s1\s/," ");
        itemTitle = itemTitle.replace(/\sI\s/i," ");
        itemTitle = itemTitle.replace(/picture/i,"");
        itemTitle = itemTitle.replace(/sub\szero/i,"Sub-Zero");
        searchBox.value = itemTitle;
        searchBoxGo.addEventListener("click",searchCsdb);
        searchBox.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) { //
                searchBoxGo.click();
            }
        });
        var csdbShowList = document.querySelector("#csdb_show_list");
        csdbShowList.addEventListener("click",showCsdbList);
        try {csdbShowList.textContent = csdbShowList.textContent + ` (${Object.keys(JSON.parse(localStorage.csdbList)).length})`;}catch(err){}// show the current number of urls in the JSON
        var csdbWipeList = document.querySelector("#csdb_wipe_list");
        csdbWipeList.addEventListener("click",wipeCsdbList);
        var csdbCantFind = document.querySelector("#csdb_cant_find");
        csdbCantFind.addEventListener("click",addToCsdbCantFind);
        var searchResultContainer = document.createElement("div");
        container.appendChild(searchResultContainer);
        searchBoxGo.click();
        searchBox.focus();
        function addToCsdbCantFind(e){
            var currentList = JSON.parse(localStorage.csdbNone);
            currentList[itemId] = true;
            localStorage.csdbNone = JSON.stringify(currentList);
            e.target.innerHTML = "✅"
            e.target.textContent = e.target.textContent + ` (${Object.keys(JSON.parse(localStorage.csdbNone)).length})` // tell the user how many can't be found in total
            unsafeWindow.close(); // close the window. we're done here
        }
        function wipeCsdbList(){
            var really = confirm("Do you really want to wipe the list?");
            if (!really){return}
            localStorage.csdbList = JSON.stringify({})
        }
        async function searchCsdb(){
            searchResultContainer.innerHTML = spinningLoadingCircle;
            searchBox.focus();
            var searchTerm = encodeURI(searchBox.value);
            var address = `https://csdb.dk/search/?seinsel=releases&search=${searchTerm}&all=1`; // checking releases only
            //  var address = "https://csdb.dk/search/advancedresult.php";
            //  var postData = `form%5Bcategory%5D=releases&form%5Bgroup_name%5D=&form%5Bgroup_slogan%5D=&form%5Bgroup_website%5D=&form%5Bgroup_trivia%5D=&form%5Bgroup_fday1%5D=1&form%5Bgroup_fmonth1%5D=1&form%5Bgroup_fyear1%5D=1982&form%5Bgroup_fday2%5D=1&form%5Bgroup_fmonth2%5D=1&form%5Bgroup_fyear2%5D=2021&form%5Bgroup_rating_c%5D=1&form%5Bgroup_rating%5D=1&form%5Bscener_handle%5D=&form%5Bscener_trivia%5D=&form%5Brelease_name%5D=${searchTerm}&form%5Brelease_rday1%5D=1&form%5Brelease_rmonth1%5D=1&form%5Brelease_ryear1%5D=1982&form%5Brelease_rday2%5D=1&form%5Brelease_rmonth2%5D=1&form%5Brelease_ryear2%5D=2021&form%5Brelease_achievement_c%5D=0&form%5Brelease_achievement%5D=&form%5Brelease_text%5D=&form%5Brelease_rating_c%5D=1&form%5Brelease_rating%5D=1&form%5Bevent_name%5D=&form%5Bevent_tagline%5D=&form%5Bevent_hday1%5D=1&form%5Bevent_hmonth1%5D=1&form%5Bevent_hyear1%5D=1982&form%5Bevent_hday2%5D=1&form%5Bevent_hmonth2%5D=1&form%5Bevent_hyear2%5D=2021&form%5Bevent_address%5D=&form%5Bevent_website%5D=&showprpage=25&testsubmit=Perform+Search`
            //  var csdbResultHtml = await gmFetch.post(address,postData);
            var csdbResultHtml = await gmFetch.get(address);
            var csdbMainContent = csdbResultHtml.split("<!-- ----- START MAIN CONTENT ----- -->")[1];
            csdbMainContent = csdbMainContent.split("<!-- ----- END MAIN CONTENT ----- -->")[0]
            csdbMainContent = csdbMainContent.replace(/href="/g,'href="https://csdb.dk')
            var csdbPageTitle = csdbMainContent.match(/<font size=6>(.*?)<\/font>/)[1];
            // console.log(csdbPageTitle);
            if (csdbPageTitle === "CSDb Search"){ // it's the search page
                csdbMainContent = csdbMainContent.replace(/<a href="https:\/\/csdb\.dk\/release\/download\.php.*?<\/a>/g,""); // remove all download links
                //csdbMainContent = csdbMainContent.replace(/<br>\n<li>/g,"&nbsp;&nbsp;<button class='csdb-this-one'>This one!</BUTTON><br>\n<li>"); // add a button saying THIS ONE!
                csdbMainContent = csdbMainContent.replace(/\n<li></g,"\n<li>&nbsp;&nbsp;<button class='csdb-this-one'>This one!</BUTTON><"); // add a button saying THIS ONE!
                csdbMainContent = csdbMainContent.replace(/<\/BUTTON><a/gi,"</BUTTON><a class=\"csdb-tooltip\""); // add tooltip span
                csdbMainContent = csdbMainContent.replace(/<\/a>(?!\s?<br>|\s?<font|,)/gi,`<span class="csdb-tooltiptext"></span></a>`); // for hovering over images
            }
            else{
                csdbMainContent = csdbMainContent.replace(/<\/font>/,"</font><button class='csdb-this-one'>This one!</button>");
                csdbMainContent = csdbMainContent.replace(/src="\/gfx/,"src=\"https://csdb.dk/gfx")
                var csdbItemId = csdbResultHtml.match(/<a href="\/navigate\.php\?type=release&action=prev&id=(\d+)">Prev<\/a>/)[1];
            }
            if (itemDate){
                var dateRegex = new RegExp(itemDate,"g");
                if (itemFullDate){
                    var csdbFormattedFullDate = `${parseInt(itemFullDate[3])}/${parseInt(itemFullDate[2])}-${itemFullDate[1]}`;
                    console.log(csdbFormattedFullDate);
                    var fullDateRegex = new RegExp(csdbFormattedFullDate,"g");
                    csdbMainContent = csdbMainContent.replace(fullDateRegex,`<mark style="background-color:cyan">${csdbFormattedFullDate}</mark>`);
                }
                else{
                    csdbMainContent = csdbMainContent.replace(dateRegex,`<mark style="background-color:light-green">${itemDate}</mark>`);
                }
            }
            if (itemCredit){
                if (itemCredit.trim().length > 2){
                    var creditRegex = new RegExp(itemCredit,"gi");
                    csdbMainContent = csdbMainContent.replace(creditRegex,`<mark style="background-color:pink">${itemCredit}</mark>`)}
            }
            // do some stuff to the main content before we put it on the page
            // make links relative to csdb
            // add a button beside every search result (if any) saying "YES THIS IS THE ONE!"
            // add a button beside page title (if it's a release page) saying "yes this is the one" etc
            //console.log(csdbMainContent);
            searchResultContainer.innerHTML = csdbMainContent;
            addImageHover();
            var thisOneButtons = document.querySelectorAll(".csdb-this-one");
            for (var i=0,j = thisOneButtons.length;i<j;i++){
                thisOneButtons[i].addEventListener("click",addToList)
            }
            document.addEventListener('keyup',chooseFirstResult);
            function chooseFirstResult(e){
                var key = e.keyCode;
                if (key != 192){return}
                document.querySelector(".csdb-this-one").click()
            }
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
            function addToList(e){
                console.log(e.target);
                var releaseUrl;
                var button = e.target;
                if (button.closest("li")){ // it's the search results page
                    if (!button.closest("li").querySelector("a[href*=release]")){
                        alert("The URL is not a release URL");
                        return;
                    }
                    releaseUrl = button.closest("li").querySelector("a[href*=release]").href;
                }
                else if (button.closest("div")){ // it's an actual item page
                    //var releaseId = button.closest("div").querySelector("img").src.match(/([\d]+)\.(?:png|gif)/)[1];
                    var releaseId = csdbItemId;
                    releaseUrl = `https://csdb.dk/release/?id=${releaseId}`;
                }
                if (!releaseUrl){alert("The URL is likely not a release URL")}
                //  alert(itemId + " | " + releaseUrl);
                var currentList = JSON.parse(localStorage.csdbList);
                currentList[itemId] = releaseUrl;
                localStorage.csdbList = JSON.stringify(currentList);
                button.textContent = "ADDED!";
                unsafeWindow.close(); // close the window. we're done here
            }

        }
        function showCsdbList(){
            var tab = window.open('about:blank', '_blank');
            tab.document.write(localStorage.csdbList); // where 'html' is a variable containing your HTML
            tab.document.close(); // to finish loading the page
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