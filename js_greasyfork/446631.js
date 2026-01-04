// ==UserScript==
// @name         MUTD MangaSee Subscriptions
// @version      1.91
// @description  Marks Subscription items as up to date on MangaSee if latest chapter has been read & Opens links for newly released chapters
// @author       Null-Cat
// @match        https://mangasee123.com/user/subscription.php
// @icon         https://www.google.com/s2/favicons?domain=mangasee123.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        window.focus
// @license      MIT
// @namespace https://greasyfork.org/users/926659
// @downloadURL https://update.greasyfork.org/scripts/446631/MUTD%20MangaSee%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/446631/MUTD%20MangaSee%20Subscriptions.meta.js
// ==/UserScript==

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function MarkUpToDate() {
    var listOfSubscriptionElements = document.getElementsByClassName("top-10 bottom-5  ng-scope");

    for (var i = 0; i <= (listOfSubscriptionElements.length - 1); i++) {
        if (listOfSubscriptionElements[i].getElementsByClassName("UpToDateNotif")[0] == undefined) { //Duplication prevention
            let currentRowFlexElement = listOfSubscriptionElements[i].getElementsByClassName("row")[1];
            let latestChapterReleased = parseFloat(listOfSubscriptionElements[i].getElementsByClassName("ng-binding")[1].getInnerHTML().replace("Chapter", "").trim());
            let latestChapterUserRead = parseFloat(listOfSubscriptionElements[i].getElementsByClassName("ng-binding")[3].getInnerHTML().replace("Chapter", "").trim());
            currentRowFlexElement.style.justifyContent = "center";
            currentRowFlexElement.style.alignItems = "center";
            if (latestChapterReleased === latestChapterUserRead) { //Match Last Read and Latest Chapter
                currentRowFlexElement.append(upToDate.cloneNode(true));
            } else if (listOfSubscriptionElements[i].getElementsByClassName("ng-binding")[3].getInnerHTML().trim() === "Ongoing (Scan)") { //N/A as the Last Read Chapter
                upToDate.style.color = "#dc3545";
                upToDate.innerHTML = "NOT STARTED";
                currentRowFlexElement.append(upToDate.cloneNode(true));
                upToDate.style.color = "#2588ff";
                upToDate.innerHTML = "UP TO DATE";
            } else { //Display how many chapters the user is behind in
                let chapterDifference = (latestChapterReleased - latestChapterUserRead).toFixed(1);
                if (chapterDifference == 1) {
                    upToDate.style.color = "rgb(232 230 227)";
                    upToDate.style.backgroundColor = "rgb(200 150 0)";
                    upToDate.innerHTML = "NEW CHAPTER";
                    listOfLinksToOpen.push(listOfSubscriptionElements[i].getElementsByClassName("ng-binding")[0].href);
                } else if (chapterDifference < 0) {
                    upToDate.style.color = "rgb(232 230 227)";
                    upToDate.style.backgroundColor = "#dc3545";
                    upToDate.innerHTML = "MISMATCH";
                    listOfLinksToOpen.push(listOfSubscriptionElements[i].getElementsByClassName("ng-binding")[0].href);
                } else if (chapterDifference < 1) {
                    upToDate.style.color = "rgb(232 230 227)";
                    upToDate.style.backgroundColor = "rgb(200 150 0)";
                    upToDate.innerHTML = "<1 CHAPTER(S)";
                    listOfLinksToOpen.push(listOfSubscriptionElements[i].getElementsByClassName("ng-binding")[0].href);
                } else {
                    upToDate.style.color = "#dc3545";
                    upToDate.innerHTML = parseInt(chapterDifference) + " CHAPTERS";
                }
                currentRowFlexElement.append(upToDate.cloneNode(true));
                upToDate.style.color = "#2588ff";
                upToDate.style.backgroundColor = ""
                upToDate.innerHTML = "UP TO DATE";
            }
        }
        if (listOfLinksToOpen.length === 0) {
            buttonText.innerHTML = " Open New Chapters (UP TO DATE)";
        } else {
            buttonText.innerHTML = ` Open New Chapters (${listOfLinksToOpen.length})`;
        }
    }
}

async function Init() {
    await sleep(100);
    var optionsMenu = document.getElementsByClassName("col-sm-7 col-5")[0]; //Open New Chapters Button Creation
    var openAllChaptersButton = document.createElement("button");
    openAllChaptersButton.className = "btn btn-sm btn-outline-primary";
    let buttonIcon = document.createElement("i");
    buttonIcon.className = "fas fa-external-link-alt";
    openAllChaptersButton.append(buttonIcon);
    openAllChaptersButton.append(buttonText);
    optionsMenu.append(openAllChaptersButton);
    openAllChaptersButton.addEventListener("click", function(){
        for (let i = 0; i < listOfLinksToOpen.length; i++) {
            window.open(listOfLinksToOpen[listOfLinksToOpen.length - 1 - i]);
            window.focus();
        }
    });
}

var listOfLinksToOpen = new Array();
var upToDate = document.createElement("div"); //Up to date element creation
upToDate.style.color = "#2588ff";
upToDate.style.fontWeight = "500";
upToDate.style.borderRadius = ".2rem";
upToDate.style.border = "1px solid transparent";
upToDate.style.padding = ".25rem .5rem";
upToDate.style.width = "95%";
upToDate.style.textAlign = "center";
upToDate.className = "UpToDateNotif";
upToDate.innerHTML = "UP TO DATE";

var buttonText = document.createElement("span");
buttonText.className = "d-none d-sm-inline";
buttonText.innerHTML = " Open New Chapters";

async function CheckSubsLoaded() {
    if(document.getElementsByClassName("col-sm-7 col-5")[0] == undefined) {
        window.setTimeout(CheckSubsLoaded, 100); //This checks the flag every 100 milliseconds
    } else {
        await Init();
        MarkUpToDate();
    }
}
CheckSubsLoaded();

window.onscroll = async function (e) {
    if($(window).scrollTop() + $(window).height() >= $(document).height() - 200) { //Executes when reaches a certain scroll point
        await sleep(100);
        MarkUpToDate();
    }
}