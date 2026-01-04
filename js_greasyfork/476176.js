// ==UserScript==
// @name         Smartschool+
// @name:nl      Smartschool+
// @name:en      Smartschool+
// @namespace    http://tampermonkey.net/
// @icon         https://static1.smart-school.net/smsc/svg/favicon/favicon.svg
// @version      5.2
// @description:en  Change your name and customize Smartschool! Search for other students! Calculate the total score of your grades! Add quick shortcuts. Adds a customizable menu bar for Smartschool. Removes useless buttons and adds quick shortcuts like the "Planner" button in your navigation bar. You can change your name and profile picture by typing the word "change" on your keyboard. You can find all existing users by typing the word "find" on your keyboard.
// @description:nl Voegt een aanpasbare menubalk toe voor Smartschool. Verwijdert nutteloze knoppen en voegt snelle snelkoppelingen toe, zoals de "Planner" knop in je navigatiebalk. Je kunt je naam en profielfoto wijzigen door het woord "change" op je toetsenbord in te typen. Alle bestaande gebruikers kun je vinden door het woord "find" op je toetsenbord in te typen.
// @author       Chromeextensions
// @match        https://*.smartschool.be/*
// @homepage     https://greasyfork.org/en/scripts/476176-smartschool
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-body
// @copyright    Copyright (c) 2021 Chromeextensions. The content presented herein may not, under any circumstances, be reproduced in whole or in any part or form without written permission from Chromeextensions.
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require https://update.greasyfork.org/scripts/481384/1290420/Grid%20Smartschool.js
// @description Change your name and customize Smartschool! Search for other students! Calculate the total score of your grades! Add quick shortcuts. Adds a customizable menu bar for Smartschool. Calculate the total score of your grades. Removes useless buttons and adds quick shortcuts. You can change your name and profile picture by typing the word "change" on your keyboard. You can find all existing users by typing the word "find" on your keyboard.
// @downloadURL https://update.greasyfork.org/scripts/476176/Smartschool%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/476176/Smartschool%2B.meta.js
// ==/UserScript==

if (typeof GM_getValue("ShouldGoTo") !== "undefined" && GM_getValue("ShouldGoTo") !== null) {
    window.location.href = GM_getValue("ShouldGoTo");
    console.log(GM_getValue("ShouldGoTo"))
    GM_deleteValue("ShouldGoTo");
}
// top bar
let topnav_go_button = document.getElementsByClassName("js-btn-go topnav__btn")[0];
topnav_go_button.parentNode.removeChild(topnav_go_button);
let topnavElement = document.getElementsByClassName("topnav")[0];

function setCookie(cookieName, value) {
    var TIME = new Date;
    TIME.setTime(TIME.getTime() + 31536e6); //31536e6 is one year
    var EXPR = "expires=" + TIME.toUTCString();
    document.cookie = cookieName + "=" + value + ";" + EXPR + ";path=/";
}

function getCookie(cookieName) {
    var cookievalue = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieAray = decodedCookie.split(";");
    for (var i = 0; i < cookieAray.length; i++) {
        var currentCookie = cookieAray[i];
        while (currentCookie.charAt(0) == " ") {
            currentCookie = currentCookie.substring(1);
        }
        if (currentCookie.indexOf(cookievalue) == 0) {
            return currentCookie.substring(cookievalue.length, currentCookie.length);
        }
    }
    return "";
}



(function() {
    ("AND ITS NAME IS PLANNER!!!");
    let topnavElement = document.getElementsByClassName("topnav")[0];
    let plannerElement = document.createElement("a");
    plannerElement.setAttribute("href", "/planner/main/");
    plannerElement.setAttribute("class", "js-btn-messages topnav__btn");
    plannerElement.innerHTML = "Planner";
    topnavElement.appendChild(plannerElement)
    for (let i = 0; i < 5; i++) {
        topnavElement.insertBefore(plannerElement, plannerElement.previousElementSibling);
    }
}());




let lastTime = performance.now();
let deltaTime = 0;

function update() {
    let currentTime = performance.now();
    deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    requestAnimationFrame(update);
}

// Start the loop
update();

let usernameElement;
let username = getCookie("username");
const interval = setInterval(function () {
    let userIconImageElement = document.getElementsByTagName("img")[0];
    if (userIconImageElement) {
        userIconImageElement.style.display = "none"
    }

    usernameElement = document.querySelector(".hlp-vert-box span");
    if (usernameElement) {
        clearInterval(interval);
        doProfileThings();
        customizePage()

    }
}, 1);

async function doProfileThings() {
    let userIconImageElement = document.getElementsByTagName("img")[0];

    if (!username) {
        username = "@MACHINE.DON4TCHANGE7829";
        setCookie("username", username);
    }
    if (username !== "@MACHINE.DON4TCHANGE7829") {

        usernameElement.innerHTML = username;
        userIconImageElement.style.display = "none"
        let userIconUrl = getCookie("usericon")
        userIconImageElement.src = userIconUrl;
        userIconImageElement.style.display = "block"

        let mainPfpElement = document.getElementsByClassName("header__avatar js-header-avatar")[0];
        if (mainPfpElement) {
            mainPfpElement.remove();
        }
        let pfpElement = document.getElementsByClassName("splitdetail__header__avatar js-splitdetail-header-avatar")[0];
        if (pfpElement) {
            pfpElement.remove();
        }

        let tempImageElement = new Image();
        tempImageElement.src = userIconUrl;
        tempImageElement.onload = function () {
            userIconImageElement.src = userIconUrl;
        };
        tempImageElement.onerror = function () {
            userIconImageElement.src = "https://previews.123rf.com/images/asmati/asmati1701/asmati170100239/68986859-no-user-sign-illustration-.jpg";
            setCookie("usericon", "https://previews.123rf.com/images/asmati/asmati1701/asmati170100239/68986859-no-user-sign-illustration-.jpg");
        };


    } else {

        let userIconImageElement = document.getElementsByTagName("img")[0];
        userIconImageElement.style.display = "block"
    }
}


async function customizePage () {

    // top bar
    let topnav_go_button = document.getElementsByClassName("js-btn-go topnav__btn")[0];

    if (topnav_go_button) {
        topnav_go_button.parentNode.removeChild(topnav_go_button);
    }
    let topnavElement = document.getElementsByClassName("topnav")[0];
    let hueValue = parseFloat(getCookie("hue")) || 0;
    if (isNaN(hueValue)) {
        hueValue = 0;
    }
    topnavElement.style.backgroundColor = `hsl(${hueValue}, 100%, 50%)`;



    function incrementAndSetHueValue(newHueValue) {
        if (typeof newHueValue === 'string' && newHueValue.toLowerCase() === 'rainbow') {
            hueValue = hueValue + (0.5*(deltaTime*40)) % 360;
        } else if (typeof newHueValue === 'string' && newHueValue.toLowerCase() === 'slider') {
            hueValue = sliderID.value
        } else if (typeof newHueValue === 'number') {
            hueValue = newHueValue;
        }
        if (typeof newHueValue === 'string' && newHueValue.toLowerCase() === 'rainbow') {
            let secondHue = hueValue+50
            topnavElement.style.background = `linear-gradient(to left, hsl(${hueValue}, 100%, 40%), hsl(${secondHue}, 100%, 40%))`;
        }
        else {
            topnavElement.style.background = `hsl(${hueValue}, 100%, 40%)`;
        }
        setCookie("hue", hueValue);
    }
    var colorMethod = GM_getValue("colorMethod") || "rainbow";
    setInterval(function () {
        if (!document.hidden) {
            if (typeof getColorMethod === "function") {
                colorMethod = getColorMethod()
            }
            incrementAndSetHueValue(colorMethod);
            GM_setValue("colorMethod", colorMethod);
        }
        else {
            if (typeof getColorMethod === "function") {
                colorMethod = getColorMethod()
            }
            deltaTime = 0
        }
    }, 15);
}
function getColorMethod () {
    return colorMethod
}




function changeProfile() {
    let userIconImageElement = document.getElementsByTagName("img")[0];
    let usernameValue = prompt("Enter your new username:");
    if (!usernameValue) {
       username = "@MACHINE.DON4TCHANGE7829";
        setCookie("username", username);
        alert("Your username and profile picture have been reset.\nReload the page to see changes.")
    }
    if (username !== "@MACHINE.DON4TCHANGE7829") {
    usernameElement.innerHTML = usernameValue;
    setCookie("username", usernameValue);
        let tempImageElement = new Image();
    let iconUrlValue = prompt("Enter your new user icon URL:");
    tempImageElement.src = iconUrlValue;
    tempImageElement.onload = function () {
        userIconImageElement.src = iconUrlValue;
        setCookie("usericon", iconUrlValue);
    };
    tempImageElement.onerror = function () {
        userIconImageElement.src = "https://previews.123rf.com/images/asmati/asmati1701/asmati170100239/68986859-no-user-sign-illustration-.jpg";
        setCookie("usericon", "https://previews.123rf.com/images/asmati/asmati1701/asmati170100239/68986859-no-user-sign-illustration-.jpg");
    };
    }
}

// the change keybuffer is defined in the profile_customizationAndTopBar.js
let keyBuffer = "";
document.addEventListener("keydown", EventListener => {
    keyBuffer += EventListener.key;
    if (keyBuffer.endsWith("change")) {
        changeProfile()
        keyBuffer = "";
    }
    else if (keyBuffer.endsWith("find")) {
        search()
        keyBuffer = "";
    }
});

window.onload = function() {
    let mainPfpElement = document.getElementsByClassName("header__avatar js-header-avatar")[0];
    if (mainPfpElement) {
        mainPfpElement.remove();
    }
    let pfpElement = document.getElementsByClassName("splitdetail__header__avatar js-splitdetail-header-avatar")[0];
    if (pfpElement) {
        pfpElement.remove();
    }
};


// Create the modal element
const modal = document.createElement("div");
modal.id = "settingsModal";
modal.style.display = "none";
modal.style.position = "fixed";
modal.style.zIndex = "1";
modal.style.left = "0";
modal.style.top = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.overflow = "auto";
modal.style.backgroundColor = "rgba(0,0,0,0.4)";

// Create the modal content
const modalContent = document.createElement("div");
modalContent.id = "settingsContent";
modalContent.style.backgroundColor = "#fefefe";
modalContent.style.margin = "15% auto";
modalContent.style.padding = "20px";
modalContent.style.border = "1px solid #888";
modalContent.style.width = "80%";

// Add the modal content to the modal element
modal.appendChild(modalContent);

// Create the "Settings" button
const settingsBtn = document.createElement("a");
settingsBtn.classList.add("topnav__menuitem", "topnav__menuitem--img");
settingsBtn.setAttribute("role", "menuitem");
settingsBtn.setAttribute("id", "settingsBtn");

const settingsImg = document.createElement("img");
settingsImg.src = "https://upload.wikimedia.org/wikipedia/commons/6/6d/Windows_Settings_app_icon.png";
settingsImg.alt = "Profiel afbeelding";

const settingsSpan = document.createElement("span");
settingsSpan.textContent = "Settings";

// Add the image and span to the "Settings" button
settingsBtn.appendChild(settingsImg);
settingsBtn.appendChild(settingsSpan);

// Add the "Settings" button to the topnav menu
const topnavMenu = document.getElementsByClassName("topnav__menu")[0];
topnavMenu.appendChild(settingsBtn);

// Add an event listener to the "Settings" button to show the modal
settingsBtn.addEventListener("click", function(e) {
    e.preventDefault();
    modal.style.display = "block";
});

// Create the "Close" button
const closeBtn = document.createElement("button");
closeBtn.textContent = "Close";
closeBtn.id = "closeSettings";

// Add an event listener to the "Close" button to hide the modal
closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
});
var slider = document.createElement("input");
slider.setAttribute("id", "slider-id");
slider.type = "range";
slider.min = 0;
slider.max = 360;
slider.value = getCookie('hue');
slider.step = 1;
slider.style.width = "200px";

var checkbox = document.createElement("input");
checkbox.setAttribute("id", "checkbox");
checkbox.type = "checkbox";
checkbox.style.width = "200px";
var colorMethod = GM_getValue("colorMethod") || "rainbow";
if (colorMethod === "rainbow") {
    checkbox.checked = true
}
else {
    checkbox.checked = false
}
function updateColor(checkbox) {
    checkbox = document.getElementById("checkbox")
    if (checkbox.checked === true) {
        colorMethod = 'rainbow'
    }
    else {
        colorMethod = 'slider'
    }
}
setInterval(updateColor,500)


// Add the "Close" button to the modal content
modalContent.appendChild(closeBtn);

// Add the "Close" button to the modal content
modalContent.appendChild(checkbox);
modalContent.appendChild(slider);
// Add your custom code here to modify the modal content and add event listeners

// Add the modal to the page
document.body.appendChild(modal);

var sliderID = document.getElementById("slider-id");

// Grid

// License: https://raw.githubusercontent.com/EbbDrop/SmarterSmartchool/main/LICENSE

// Target element
const smartersmartschool = document.getElementById("show-grid");

// Callback function to be executed when the element exists
const handleElementExistence = () => {
    alert('Delete SmarterSmartschool or this script will not work!!!');
};

// Check if the element already exists
if (smartersmartschool) {
    handleElementExistence();
} else {
    // Create a MutationObserver instance
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            // Check if the target element is added to the DOM
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                const addedElement = mutation.addedNodes[0];
                if (addedElement.id === "show-grid") {
                    // Call the callback function when the element is added
                    handleElementExistence();
                    // Disconnect the observer since the task is complete
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    // Start observing changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });
}



(function() {
    ("Message/tutorial"); // future feature
    if (false) {
        // Get the reference to the container div
        var containerDiv = document.getElementById("smscTopContainer");
        var newDiv = document.createElement("div");
        newDiv.innerHTML = '<div id="smsctopnavmessage" class="smscTopNavMessage blue" role="alert">Smartschool wil graag jouw feedback weten over Planner. <a href="/infobarlink?i=2303&amp;c=1&amp;l=MUIEAM7BADyBFPG6g-zRyNxZIGXE0iECnTOpwbYXYNyWXy8iEYoJdFcUsSXPJJThDOOmSWXl50pgTVWceshutc02nwvq9B_NJzFBVfjUnUNetvhrf2rDxCM2UQ9MuHHYnKSHeJs3hzgWkWhJt3EcHuttGVp0BiMtRuZefW0uoLgCdfNNRvM2VrMTH8HXZ0hYzejSUhX_2-5eEeOnQHUTrvk=" target="_blank"> Vul deze korte bevraging in (max. 5 min.).</a></div>';
        containerDiv.appendChild(newDiv.firstChild);
    }
}());

const pupilCache = {}; // Cache object to store fetched pupils

async function dataBaseImport (){
    // Function to make a request for a specific letter, with caching
    async function importData () {
        let time = performance.now()
        const cachedPupilsDB = await databaseGetItem("allPupilsJSON").catch((error) => {
            console.error("Error fetching cached pupils:", error);
            return null;
        });
        pupilCache["_"] = cachedPupilsDB
        console.log("Time to load DataBase ms:",performance.now()-time)
        time = performance.now()
        console.log(pupilCache["_"])
        console.log(performance.now()-time)

    }
    // IndexedDB Database
    let db;

    // Function to Initialize the IndexedDB
    function databaseInit() {
        const request = indexedDB.open("database", 1);

        request.onerror = function (event) {
            console.log("error: ");
        };

        request.onsuccess = function (event) {
            console.log("success: ");
            db = request.result;
            importData()

        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore("items", { keyPath: "name" });
        };
    }

    // Function to Add a New Item to the IndexedDB Database
    function databaseSetItem(name, value) {
        const transaction = db.transaction(["items"], "readwrite");
        const objectStore = transaction.objectStore("items");

        // Instead of storing each item individually, store the entire pupilCache object
        objectStore.add({ name, value: JSON.stringify(value) });
    }

    // Function to Retrieve an Item from the IndexedDB Database
    function databaseGetItem(name) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["items"], "readonly");
            const objectStore = transaction.objectStore("items");

            const request = objectStore.get(name);

            request.onsuccess = function (event) {
                const result = event.target.result;
                if (result) {
                    resolve(JSON.parse(result.value));
                } else {
                    reject(new Error("Item not found"));
                }
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }

    // Initialize the Database
    databaseInit();

}

function search () {
    var search = prompt("What user\(s\) do you want to search?")

    fetch("/planner/api/v1/quick-search/planned-meetings/extra-participants/search", {
        method: "POST",
        headers: {
            "accept": "*/*",
            "accept-language": "en,nl;q=0.9,en-US;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Chrome OS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        referrer: location.host,
        referrerPolicy: "strict-origin",
        body: JSON.stringify({
            "searchString": search,
            "searchOptions": []
        }),
        mode: "cors",
        credentials: "include"
    })
        .then(response => {
        // Log the response status and optionally the JSON body
        console.log("Response status:", response.status);
        return response.json(); // This returns a Promise as well
    })
        .then(data => {
        if (data !== null) {
            al(data,search)
            // Log the parsed JSON data
            console.log("Response data:", data);
            let stringResult = JSON.stringify(data);
            let singleUser = JSON.parse(stringResult); // Parse the JSON string to an object and access the first element in the 'a' property
            var g = JSON.stringify(singleUser).replace(/[\[\]\,\"]/g, ''); // stringify and remove all "stringification" extra data
            console.log("Bytes:",g.length); // this will be your length.

        }
    })
        .catch(error => {
        // Log any errors that occurred during the fetch
        console.error("Fetch error:", error);
    });
}
function al(parm_data, searchQuery) {
    for (var i = 0; i < parm_data.length; i++) {
        var name = parm_data[i].origin.name;
        var id = parm_data[i].identifier.id;
        var titleArray = parm_data[i].title;
        var lastPart = titleArray[titleArray.length - 1].part;

        if (searchQuery == "3Dd") {
            console.log("3Dd was searched");
        }

        let isStudent = titleArray.some(item => item.part === "•");
        if (isStudent) {
            console.log(lastPart);
            alert("Name: " + name + "\nId: " + id + "\nClass: " + lastPart);
        } else {
            console.log("No class");
            alert("Name: " + name + "\nId: " + id + "\nClass: No class");
        }
    }


}