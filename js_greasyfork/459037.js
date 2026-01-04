// ==UserScript==
// @name     Goatlings Stat Viewer & Quick Swap Add-On
// @namespace goatlings.statandswap
// @description View stats of active Goatling and swap them from anywhere.
// @version  2.0.0
// @license GPL
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.xmlHttpRequest
// @match https://www.goatlings.com/*
// @downloadURL https://update.greasyfork.org/scripts/459037/Goatlings%20Stat%20Viewer%20%20Quick%20Swap%20Add-On.user.js
// @updateURL https://update.greasyfork.org/scripts/459037/Goatlings%20Stat%20Viewer%20%20Quick%20Swap%20Add-On.meta.js
// ==/UserScript==


// CHANGE ME (if you want):
let showStats = true // default true
let showList = true // default true
let showScrollbar = false // default false, change to true if you to see the scrollbar on the Goatling list
// (most) CSS can be changed at the bottom


//  GOATLING STAT VIEWER (updated for the tabs update!!!):
GM.xmlHttpRequest( {
    method:     "GET",
    url:        "https://www.goatlings.com/MyGoatlings/",
    onload:     parseResponse
} );

// adding this for greasemonkey compatibility (plus gm_addstyle is deprecated)
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
} // credit arserbin3 on stackoverflow

async function parseResponse(response) {
    const myGoatlingsHTML = response.responseText;
    const parser = new DOMParser();
    const doc = parser.parseFromString(myGoatlingsHTML, "text/html");

    // 1. Figure out what the active Goatlings name is:
    let activeGoatling = doc.querySelector("a[href='https://www.goatlings.com/mypets/']").innerHTML;
    let activeImage = doc.getElementById("active_pet_image").getElementsByTagName('img')[0].src;
    let activeHP = null, activeMood = null, activeLevel = null, activeHunger = null, activeEXP = null

    // 2. We have pain in the ass tabs now, so we gotta grab a list of em all along with their urls:
    let tabDivs = doc.querySelectorAll('.pv-cat');
    let tabMap = {};

    tabDivs.forEach(function(div) {
        let tabLink = div.querySelectorAll('a[href^="https://www.goatlings.com/MyGoatlings/manage/"]')[1];
        if (tabLink) {
            let tabName = tabLink.textContent.trim();
            let link = tabLink.getAttribute('href');
            tabMap[tabName] = link;
        }
    });

    // So that I can re-use as much of the existing code as possible, I'm just going to combine all of the tabs into one page
    async function fetchAndParse(url) {
        let response = await fetch(url);
        let text = await response.text();
        return parser.parseFromString(text, "text/html");
    }

    async function combineTheTabs(tabMap) {
        let allGoats = document.implementation.createHTMLDocument("All Goats");
        for (let [tabName, url] of Object.entries(tabMap)) {
            let doc = await fetchAndParse(url);

            // Create a wrapper div so there can be some separation between the tabs even though they're all being combined onto one page
            let wrapperDiv = allGoats.createElement('div');
            wrapperDiv.className = 'tab-content-wrapper';
            wrapperDiv.setAttribute('data-tab-name', tabName); // Tab name is stored here in case it's needed in the future
            wrapperDiv.append(...doc.body.children);
            allGoats.body.appendChild(wrapperDiv);
        }
        return allGoats
    }

    let myGoatsDoc = await combineTheTabs(tabMap);
    let myGoats = Array.from(myGoatsDoc.querySelectorAll ("div.mystuff"));
    let myGoatNames = [], goatData = null, splitData = null
    //iterate through goatling stats and find which belongs to active
    for (let goat of myGoats){
        let currentGoat = goat.innerText;
        if (currentGoat.includes("Goatlings:")) continue; // Filtering out the tabs amongst the goats
        myGoatNames.push(currentGoat.split("\n")[2].trim());
        if (currentGoat.includes(activeGoatling)){
            goatData = currentGoat;
        }
    }
    splitData = goatData.split("\n");
    for (let data of splitData){
        if (data.includes("Level:")){
            activeLevel = data.trim();
        } else if (data.includes("HP:")){
            activeHP = data.trim();
        } else if (data.includes("Hunger:")){
            activeHunger = data.trim();
        } else if (data.includes("Mood:")){
            activeMood = data.trim();
        } else if (data.includes("EXP:")){
            activeEXP = data.trim();
        }
    }


    // Doing some basic scaling:
    let scaleVal = 1;
    if (window.innerWidth < 1400){
        scaleVal = 0.75
    } if (window.innerWidth < 1300) {
        scaleVal = 0.6
    }


    // STAT VIEWER CODE:
    let stats = document.createElement("div");
    stats.id = 'stats'
    if (activeGoatling.length > 18){
        stats.innerHTML = "<div style='text-align:center;font-size:16px'>" + activeGoatling + "</div>";
    } else{
        stats.innerHTML = "<div style='text-align:center'>" + activeGoatling + "</div>";
    }
    stats.innerHTML += "<div style='border-radius:12px;background:white;width:80%;display:flex;justify-content:center;margin:auto'><div style='position:relative;left:2.5px'><img src=" + activeImage +"></div></div>";
    // making the font size for exp smaller when it's huge
    if (activeEXP.length >= 20){
        stats.innerHTML += activeLevel + "<br /><div style=font-size:14px>" + activeEXP + "</div>" + activeHP + "<br />" + activeHunger + "<br />" + activeMood;
    } else{
        stats.innerHTML += activeLevel + "<br />" + activeEXP + "<br />" + activeHP + "<br />" + activeHunger + "<br />" + activeMood;
    }
    stats.classList.add("based","basedCard");
    // grabbing the stored values for the element coordinates (default to 10)
    stats.style.left = await GM.getValue("startX", 10);
    stats.style.top = await GM.getValue("startY", 10);
    stats.style.transform = "scale(" + scaleVal + "," + scaleVal + ")";
    // add it into the page
    if (showStats === true){
        document.body.appendChild(stats);
    }


    // QUICK SWITCHER CODE:
    // get the links to post to for switching goatlings
    let makeActiveMap = {};
    myGoats.forEach(currentGoat => {
        if (currentGoat.innerText.includes("Goatlings:")) return; // Filtering out the tabs amongst the goats (again)
        let name = currentGoat.querySelector('p:nth-of-type(2)').textContent.trim();
        let makeActiveLink = Array.from(currentGoat.querySelectorAll('a')).find(a => a.textContent.trim() === 'Make Active');
        makeActiveMap[name] = makeActiveLink.href;
    });

    // start cooking up the div to display your goats
    let goatList = document.createElement("div");
    goatList.id = 'goatList'
    goatList.innerHTML = "<div style='text-align:center'> My Goatlings </div>";
    // add each goat name as a button
    for (let goat of myGoatNames){
        goatList.innerHTML += "<div class='basedButtonGroup' id='swapButton'><button class='basedButton'>" + goat + "</button></div>"
    }
    goatList.classList.add("based","basedList");
    goatList.style.left = await GM.getValue("listX", 10);
    goatList.style.top = await GM.getValue("listY", 10);
    goatList.style.transform = "scale("+scaleVal+","+scaleVal+")";
    // add it into the page
    if (showList === true){
        document.body.appendChild(goatList);
    }
    // function to send a post request to tell the game we want to swap to a specific goatling
    function swapGoatling(event){
        let targetGoat = event.currentTarget.innerText
        GM.xmlHttpRequest({
            method: "GET",
            url: makeActiveMap[targetGoat],
            onload: function(response) {
                // refresh after requesting
                window.location = document.URL;
            }
        });
    }

    let goatButtons = document.querySelectorAll("#swapButton");
    // add in a listener, so once the buttons are clicked, the function is called
    for (let goatButton of goatButtons){
        goatButton.addEventListener ("click", swapGoatling, false);
    }

    // adjust scale when resizing past some thresholds
    window.addEventListener("resize", reSize);
    function reSize(){
        let scaleVal = 1;
        if (window.innerWidth < 1400){
            scaleVal = 0.75
        } if (window.innerWidth < 1300) {
            scaleVal = 0.6
        }
        stats.style.transform = "scale("+scaleVal+","+scaleVal+")";
        goatList.style.transform = "scale("+scaleVal+","+scaleVal+")";
    }

    // following is shamelessly lifted from w3schools
    if (showStats === true){
        dragElement(document.getElementById("stats"));
    }
    if (showList === true){
        dragElement(document.getElementById("goatList"));
    }
    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculating new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        async function closeDragElement(e) {
            document.onmouseup = null;
            document.onmousemove = null;

            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // saving element co-ordinates for some level of location persistence
            let setValY = "startY", setValX = "startX";
            // need to keep 2 separate values for both elements
            if (elmnt.id === "goatList"){
                setValY = "listY";
                setValX = "listX";
            }
            GM.setValue(setValY, (elmnt.offsetTop - pos2));
            GM.setValue(setValX, (elmnt.offsetLeft - pos1));
        }
    }
}


// EDIT HERE FOR STYLE!
addGlobalStyle (`
    .basedButtonGroup .basedButton {
        background-color: #956e43;
        border: 4px solid #ad8a60;
        color: white;
        padding: 5px 10px;
        text-align: center;
        text-decoration: none;
        font-size: 15px;
        cursor: pointer;
        min-width: 122px;
        display: block;
        margin: auto;
        border-radius:8px;
        text-shadow:-2px -2px 0 #ae8c5c, 2px -2px 0 #ae8c5c, -2px 2px 0 #ae8c5c, 2px 2px 0 #ae8c5c;
        font-weight:bold;
        font-family:Trebuchet MS;
        margin-bottom: 2px;

    }

    .basedButtonGroup .basedButton:not(:last-child) {
        border-bottom: none;
    }

    .basedButtonGroup .basedButton:hover {
        background-color: #755839;
    }

    .based {
        font-family:Trebuchet MS;
        text-shadow:-1px -1px 0 #a2bfa1, 1px -1px 0 #a2bfa1, -1px 1px 0 #a2bfa1, 1px 1px 0 #a2bfa1;
        cursor:move;
        position:absolute;
        border-radius:12px;
        font-size:21px;
        color:white;
        font-weight:bold;
        background-image:url('https://www.goatlings.com/images/layout/greenbg.gif');
        border:3px rgb(220,228,220) solid;
        }

    .basedCard {
        z-index:10000;
        padding:3px;
    }

    .basedList {
        z-index:10001;
        min-height:100px;
        max-height:284px;
        overflow-y:auto;
        overflow-x:hidden;
        min-width:135px;
    }
`);

if (showScrollbar === false){
    addGlobalStyle (`
    .basedList {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .basedList::-webkit-scrollbar {
        display: none;
    }
    `);
}