// ==UserScript==
// @name          Sketchful Auto Join
// @namespace     https://greasyfork.org/users/281093
// @match         https://sketchful.io/*
// @grant         none
// @version       1.2
// @author        Bell
// @description   Right-click on a full lobby to auto-refresh and join when there's a spot available.
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/406163/Sketchful%20Auto%20Join.user.js
// @updateURL https://update.greasyfork.org/scripts/406163/Sketchful%20Auto%20Join.meta.js
// ==/UserScript==

const refreshInterval = 500; // Refresh interval, in milliseconds

(function requestPermission() {
    if (Notification.permission === "granted") {
        console.log("Notifications allowed, Sketchful Auto Join loaded");
    } else {
        Notification.requestPermission()
            .then(result => {
                console.log(result);
            });
    }
})();

window.onfocus = () => {
    sessionStorage.setItem('tabFocus', '1');
};

window.onblur = () => {
    sessionStorage.setItem('tabFocus', '0');
};

const lobbiesTable = document.querySelector("#menuLobbiesTable");
const menuNav = document.querySelector("#menu > div.menuNav > ul");
let refreshing = false;

const config = {
    attributes: false,
    childList: true,
    subtree: true
};

const onLobbyRefresh = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        let newNode = mutation.addedNodes[0];
        if (newNode.classList.contains("table")) {
            updateLobbies(newNode.querySelectorAll(".menuLobbiesRoom"));
        }
    }
};

const lobbyObserver = new MutationObserver(onLobbyRefresh);

lobbyObserver.observe(lobbiesTable, config);

lobbiesTable.addEventListener("contextmenu", setActiveLobby, false);
lobbiesTable.addEventListener("click", clearActiveLobby, false);
menuNav.addEventListener("click", clearActiveLobby, true);

let activeLobby = null;

function setActiveLobby(e) {
    e.preventDefault();
    let lobby = e.target.parentNode;
    try {
        const hash = getLobbyHash(lobby);
        if (!activeLobby && isLobbyFull(lobby)) {
            activeLobby = hash;
            refreshLobbies();
        } else {
            clearActiveLobby();
        }
    } catch (error) {
        clearActiveLobby();
    }
}

function clearActiveLobby() {
    if (activeLobby) {
        activeLobby = null;
        window.clearTimeout(this.refreshingID);
        refreshLobbies();
    }
}

function refreshLobbies() {
    document.querySelector("#menuLobbiesRefresh").click();
}

function isLobbyFull(lobby) {
    const capacity = getLobbyCapacity(lobby);
    return capacity.current >= capacity.max;
}

function getLobbyCapacity(lobby) {
    const capacityRegexp = /<td>(\d+)\/(\d+)<\/td>/;
    const capacityMatch = lobby.innerHTML.match(capacityRegexp);

    return {
        current: parseInt(capacityMatch[1]),
        max: parseInt(capacityMatch[2])
    };
}

function getLobbyHash(lobby) {
    const hashRegexp = /lobbyConnect\([^#]+(#[\w]+)/;
    return lobby.outerHTML.match(hashRegexp)[1];
}

function notify() {
    if (Notification.permission === "granted") {
        let notification = new Notification("Joined", {
            icon: "https://sketchful.io/res/logo/pencils%20optimized.png",
            body: "Click the notification to return to the game.",
            requireInteraction: true,
        });

        notification.onclick = function() {
            window.focus();
            notification.close();
        };
    } else {
        console.log("Notifications are blocked.");
    }
}

function tryToJoin(lobby) {
    if (isLobbyFull(lobby)) {
        console.log(activeLobby + " is full, refreshing");
        console.log(getLobbyCapacity(lobby));
        this.refreshingID = window.setTimeout(refreshLobbies, refreshInterval);
    } else {
        console.log("Joining " + activeLobby);
        lobbyConnect(activeLobby);
        let focus = parseInt(sessionStorage.getItem('tabFocus'));
        console.log("AUOT JOIN NOTIFIC", focus);
        if (!focus) {
            notify();
        }
        clearActiveLobby();
    }
}

function updateLobbies(lobbies) {
    if (activeLobby) {
        for (let lobby of lobbies) {
            if (getLobbyHash(lobby) === activeLobby) {
                lobby.style.backgroundColor = "pink";
                tryToJoin(lobby);
            }
        }
    } else {
        console.log("No active lobby");
    }
}