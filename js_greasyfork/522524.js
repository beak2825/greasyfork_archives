// ==UserScript==
// @name        Warlord Inactivity Tracker
// @namespace   antril.torn.warlord
// @version     1.5
// @description shows last activity status for holders of RW weapons
// @author      Antril [3021498]
// @license     GNU GPLv3
// @run-at      document-end
// @match       https://www.torn.com/factions.php?step=your*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     api.torn.com
// @require     https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/522524/Warlord%20Inactivity%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/522524/Warlord%20Inactivity%20Tracker.meta.js
// ==/UserScript==

/////////////
// OPTIONS //
/////////////

let manualAPIKey = null; // Optionally set API key

// Changee the background colour here
let darkModeLoanColour = "#544413"
let lightModeLoanColour = "yellow"

let darkModeFreeColour = "darkgreen"
let lightModeFreeColour = "#00ff00"


////////////
// SCRIPT //
////////////

let rgxp = "\/.*tab=armoury.*sub=weapons.*"
let previous_fragment = ""
let members = {}
let backgroundLoanColour = getCookie("darkModeEnabled") === "false" ? lightModeLoanColour : darkModeLoanColour
let backgroundFreeColour = getCookie("darkModeEnabled") === "false" ? lightModeFreeColour : darkModeFreeColour

let apiKey = manualAPIKey || loadAPIKey() || requestAPIKey()

if (!apiKey || !apiKey?.length == 16) { alert('Warlord Inactivity Tracker - No APIkey set'); return }

checkURLFragment();

window.addEventListener("hashchange", function (){
    checkURLFragment()
});

function loadAPIKey() {
    let blob = localStorage.getItem("torn.antril.keys") || null;
    if (blob !== null) {
        let keys = JSON.parse(blob);
        if ("warlord_key" in keys) return keys.warlord_key;
        if ("common_key" in keys && confirm("Antril common key detected, do you want to use it for this script?")) {
            keys.warlord_key = keys.common_key
            localStorage.setItem("torn.antril.keys", JSON.stringify(keys));
            return keys.common_key;
        }
    }
    return null;
}


function requestAPIKey() {
    let blob = localStorage.getItem('torn.antril.keys') || null;
    let keys = blob? JSON.parse(blob) : {}

    const key = prompt("Enter your Torn API key (leave blank to skip):");
    if (!key) return;

    keys.warlord_key = key;
    if (confirm("Would you like to use this key for other scripts from Antril? (This will override the common key if already set")) {
        keys.common_key = key;

    }
    localStorage.setItem("torn.antril.keys", JSON.stringify(keys));
    return key;
}


function getCookie (name) {
	let value = `; ${document.cookie}`;
	let parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

function setArmouryObserver() {
    var observer = new MutationObserver(function(mutations, observer) {
        $.each(mutations, function (i, mutation) {
            let addedNodes = $(mutation.addedNodes);
            let selector = $("#armoury-weapons > .item-list > li")
            let filteredEls = addedNodes.find(selector).addBack(selector);
            if(filteredEls.length > 0) {
                checkLoans();
            }
        });
    });
    observer.observe($("#armoury-weapons")[0], {childList: true, subtree: true});
}


async function checkURLFragment() {
    let fragment = window.location.hash;
    if(fragment.match(rgxp)) {
        if (!previous_fragment.match(rgxp)) {
             await loadFactionMemberStatus();
        }
        await waitForArmoury();
        setArmouryObserver();
        checkLoans();
    }
    previous_fragment = fragment
}

function JSONparse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log(e);
  }
  return null;
}

async function loadFactionMemberStatus() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/faction/members?key=${apiKey}`,
            onload: (r) => {
                let j = JSONparse(r.responseText);
                if (!j || !j.members) {
                    return;
                }
                j.members.forEach(
                    (m) => {
                        members[m.name] = m.last_action;
                    }
                )
                resolve();
            }
        });
    })
}

function getWarlordWeaponsLoans() {
    let warlordWeapons = $("#armoury-weapons > .item-list > li").filter(function() { return $(this).find('.bonus-attachment-warlord').length != 0;})
    return warlordWeapons.filter(function() {return $(this).find(".loaned > a").length != 0}).toArray();
}

function waitForArmoury() {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            if($("#armoury-weapons > .item-list > li").length !== 0) {
                clearInterval(intervalId);
                resolve();
            }
        }, 100);
    });
}

async function checkLoans() {
    await waitForArmoury();
    let warlordWeapons = $("#armoury-weapons > .item-list > li").filter(function() { return $(this).find('.bonus-attachment-warlord').length != 0;})
    warlordWeapons.filter(function() {return $(this).find(".loaned > a").length !== 0}).toArray().forEach((loan) => checkLoan(loan, Date.now()/1000));
    warlordWeapons.filter(function() {return $(this).find(".loaned > a").length === 0}).toArray().forEach((free) => markAsFree(free));
}

function checkLoan(loan, currentTimestamp) {
   let player = $(loan).find(".loaned > a")[0].text
   let playerState = members[player]
   let timestampDelta = currentTimestamp - playerState.timestamp
   if ((playerState.status === "Idle" && timestampDelta > 3600) || playerState.status === "Offline") {
       markLoanAsOverdue(loan)
   }
}

function markLoanAsOverdue(loan) {
    $(loan).find(".loaned").css("background-color", backgroundLoanColour);
}

function markAsFree(free) {
    $(free).find(".loaned").css("background-color", backgroundFreeColour);
}
