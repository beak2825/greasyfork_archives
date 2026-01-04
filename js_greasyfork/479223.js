// ==UserScript==
// @name         Customisable auto move
// @namespace    https://tampermonkey.net/
// @version      v1.0
// @description  create your own points on the map and move along them repeatedly
// @author       me ofc and probably chatgpt
// @match        *://zombs.io/*
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/479223/Customisable%20auto%20move.user.js
// @updateURL https://update.greasyfork.org/scripts/479223/Customisable%20auto%20move.meta.js
// ==/UserScript==
/* global game */
/* global Game */
let markerIds = 0;
let maxMarkers = 69420;
let markers = [];
let goToMarkerInterval;
let repeatingMoveInterval;
let currentIndex = 0;
let markermoveTimeout;

function addMarker(x, y) {
    if (markerIds >= maxMarkers) {
        game.ui.getComponent('PopupOverlay').showHint('Max number of markers reached.', 1500);
    } else {
        markerIds++;
        markers.push({ id: markerIds, x, y });

        var map = document.getElementById("hud-map");
        map.insertAdjacentHTML("beforeend", `<div data-marker-id="${markerIds}" style="color: red; display: block; left: ${x}px; top: ${y}px; position: absolute;" class='hud-map-player marker-placed-by-command'></div>`);
        game.ui.getComponent('PopupOverlay').showHint(`Added Marker ${markerIds}`, 1500);
    }
}

function resetMarkerIds() {
    markerIds = 0;
    markers = [];

    game.ui.getComponent('PopupOverlay').showHint('Marker IDs reset.', 1500);
}

function moveToNextMarker() {
    if (markers.length === 0) {
        game.ui.getComponent('PopupOverlay').showHint('No markers placed.', 1500);
        return;
    }

    currentIndex = (currentIndex + 1) % markers.length;

    const marker = markers[currentIndex];

    if (marker) {
        goToMarkerPos(marker.x, marker.y);
    }
}

function startRepeatingMove() {
    if (markers.length === 0) {
        game.ui.getComponent('PopupOverlay').showHint('No markers placed.', 1500);
        return;
    }

    repeatingMoveInterval = setInterval(() => {
        moveToNextMarker();
    }, 100);
}

function stopRepeatingMove() {
        clearInterval(goToMarkerInterval);
        clearTimeout(markermoveTimeout);
        game.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
        game.ui.getComponent('PopupOverlay').showHint('Successfully stopped MapMover.', 4000);
}

function handleMarkerMove() {
    stopRepeatingMove();

    currentIndex = 0;
    moveToNextMarker();
}

game.network.addRpcHandler('ReceiveChatMessage', function (e) {
    if (e.uid == game.ui.playerTick.uid) {
    const message = e.message.trim();

    if (message === "!markers") {
        addMarker(game.ui.playerTick.position.x, game.ui.playerTick.position.y);
    } else if (message === "!delmarkers") {
        const markerElements = document.querySelectorAll('.marker-placed-by-command');

        markerElements.forEach(markerElement => {
            const markerId = markerElement.getAttribute("data-marker-id");
            if (markerId) {
                const idToRemove = parseInt(markerId);
                const indexToRemove = markers.findIndex(m => m.id === idToRemove);
                if (indexToRemove !== -1) {
                    markers.splice(indexToRemove, 1);
                    markerElement.remove();
                }
            }
        });

        game.ui.getComponent('PopupOverlay').showHint('Deleted Markers', 1500);
        resetMarkerIds();
    } else if (message === "!markermove") {
        handleMarkerMove();
    } else if (message === "!stop") {
        stopRepeatingMove();
    }
    }
});

function goToMarkerPos(x, y) {
    clearInterval(goToMarkerInterval);
    goToMarkerInterval = setInterval(() => {
        let myX = Math.round(game.ui.playerTick.position.x);
        let myY = Math.round(game.ui.playerTick.position.y);

        let offset = 69

        if (-myX + x > offset) game.network.sendInput({ left: 0 }); else game.network.sendInput({ left: 1 });
        if (myX - x > offset) game.network.sendInput({ right: 0 }); else game.network.sendInput({ right: 1 });

        if (-myY + y > offset) game.network.sendInput({ up: 0 }); else game.network.sendInput({ up: 1 });
        if (myY - y > offset) game.network.sendInput({ down: 0 }); else game.network.sendInput({ down: 1 });

        if (-myX + x < offset && myX - x < offset && -myY + y < offset && myY - y < offset) {
            game.ui.getComponent('PopupOverlay').showHint('Finished moving!', 1e4);
            clearInterval(goToMarkerInterval);

            markermoveTimeout = setTimeout(() => {
                moveToNextMarker();
            }, 100);
        }
    });
}