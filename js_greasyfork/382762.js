// ==UserScript==
// @name Cuties UG Script
// @description Join the Cuties UG on v3rmillion!
// @icon https://v3rmillion.net/favicon.ico
// @include https://v3rmillion.net/*
// @include https://www.v3rmillion.net/*
// @include https://*.v3rmillion.net/*
// @namespace https://www.v3rmillion.net/
// @run-at document-end
// @version 2.0.9
// @downloadURL https://update.greasyfork.org/scripts/382762/Cuties%20UG%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/382762/Cuties%20UG%20Script.meta.js
// ==/UserScript==

let CUTIES_UG_TEXT_COLOUR = "#FF4CD8";
let CUTIES_UG_USER_BADGE = "https://i.imgur.com/gA7R5ZQ.png";
let cuties = {
    "SegFault": "2",
    "MeguminSama": "584265",
    "Seby": "1439",
    "Senko": "520567",
    "Fires": "172565",
    "weeb expert": "477828",
    "Miners": "356184",
    "Anamika Hepburn": "1486221",
    "Missingno74": "53721",
    "Beauty": "874312",
    "Lukkan99": "209658",
    "Chaddy": "548970",
    "Viper": "496546",
    "Raccoon": "596885",
    "IGRC": "783",
    "szn": "22838",
    "chocomilk": "972722",
    "giddy": "524449",
    "Snoop Giraffe": "1112",
    "Dorime": "1980",
    "SilvaGunner": "1017760",
    "Shiro": "55021",
    "mathew": "258829",
    "Derpy Lua": "77011",
    "vyx": "1208272",
    "MReP": "122831",
    "emialis": "1797404"
};
function searchForPostAuthors() {
    let allLinks = document.getElementsByTagName('a');
    let allImages = document.getElementsByTagName('img');
    if (window.location.href.includes('member.php')) {
        sortMemberPage(allLinks, allImages);
    } else {
        sortEverything(allLinks, allImages);
    }
}

function sortEverything(allLinks, allImages) {
    for (let i = 0; i < allImages.length; i++) {
        if (allImages[i].src.includes("UserBars/")
        && allImages[i].alt != null
        && allImages[i].parentNode != null
        && allImages[i].parentNode.parentNode != null) {
            let profileUrl = allImages[i].parentNode.parentNode.getElementsByClassName('largetext');
            if (profileUrl[0] != null && profileUrl[0].getElementsByTagName('a').length > 0) {
                let profileLink = profileUrl[0].getElementsByTagName('a')[0].href;
                let regex = new RegExp(`uid=(${Object.values(cuties).join("|")})$`);
                if (regex.test(profileLink)) {
                    allImages[i].src = CUTIES_UG_USER_BADGE;
                    allImages[i].parentNode.parentNode.getElementsByTagName('a')[0].getElementsByTagName('span')[0].style.color = CUTIES_UG_TEXT_COLOUR
                }
            } else {
                profileUrl = allImages[i].parentNode.parentNode.getElementsByTagName('a')[0].href;
                let regex = new RegExp(`uid=(${Object.values(cuties).join("|")})$`);
                if (regex.test(profileUrl)) {
                    allImages[i].src = CUTIES_UG_USER_BADGE;
                    allImages[i].parentNode.parentNode.getElementsByTagName('a')[0].getElementsByTagName('span')[0].style.color = CUTIES_UG_TEXT_COLOUR + " !important"
                }
            }
        }
    }
}

function sortMemberPage(allLinks, allImages) {
    let url = new URL(window.location.href);
    let uid = url.searchParams.get("uid");
    if (findUserById(uid)) {
        let title = window.document.title;
        let username = title.replace("V3rmillion - Profile of ", "");
        let elementsOfUsername = $(`strong:contains("${username}")`).filter(function () {
            return $(this).text() == `${username}`;
        }).addClass('active');
        for (let i = 0; i < elementsOfUsername.length; i++) {
            if (!elementsOfUsername[i].parentElement.parentElement.classList.value.includes("ddm_anchor")) {
                elementsOfUsername[i].style.color = CUTIES_UG_TEXT_COLOUR;
            }
        }
        elementsOfUsername = $(`bold:contains("${username}")`).filter(function () {
            return $(this).text() == `${username}`;
        }).addClass('active');
        for (let i = 0; i < elementsOfUsername.length; i++) {
            if (!elementsOfUsername[i].parentElement.parentElement.classList.value.includes("ddm_anchor")) {
                elementsOfUsername[i].style.color = CUTIES_UG_TEXT_COLOUR;
            }
        }
        for (let i = 0; i < allImages.length; i++) {
            if (allImages[i].src.includes("UserBars/")
                && allImages[i].alt != null
                && allImages[i].parentNode != null) {
                allImages[i].src = CUTIES_UG_USER_BADGE;
            }
        }
    }
}

function findUserById(id) {
    let found = false;
    Object.keys(cuties).forEach(function (key) {
        if (cuties[key] == id) found = true;
    })
    return found;
}

searchForPostAuthors();