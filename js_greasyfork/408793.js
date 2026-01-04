// ==UserScript==
// @name         Roblox duplicate games remover
// @namespace    billy donjon gang
// @version      1.01
// @description  Removes duplicate game entries from the games section
// @author       billy#0182
// @match        https://www.roblox.com/games*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/408793/Roblox%20duplicate%20games%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/408793/Roblox%20duplicate%20games%20remover.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    function checkDupe(memory, id) {
        if (memory.find(elem => elem === id)) {
            //console.log("dupe " + id);
            return true;
        }
        memory.push(id);
        return false;
    }
    function onNodeAdded(memory, mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className == "game-card game-tile") {
                const element = mutation.addedNodes[0];
                if (checkDupe(memory, element.firstElementChild.firstElementChild.id)) {
                    element.remove();
                }
            }
        }
    }
    function init(memory, grid) {
        for (let child of grid.children) {
            if (checkDupe(memory, child.firstElementChild.firstElementChild.id)) {
                child.remove();
            }
        }
        const observer = new MutationObserver(function(mutList) { onNodeAdded(memory, mutList); });
        window.addEventListener('popstate', (event) => { memory = []; observer.disconnect(); }, { once: true });
        observer.observe(grid, {childList: true});
    }
    function checkForGrid(memory, mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className === "games-list-container") {
                init(memory, mutation.addedNodes[0].querySelector(".game-grid-container"));
                observer.disconnect();
            }
        }
    }
    async function run(){
        var memory = [];
        const nodeAddedObserver = new MutationObserver((mutList, observer) => { checkForGrid(memory, mutList, observer); });
        window.addEventListener('popstate', (event) => { nodeAddedObserver.disconnect(); }, { once: true });
        nodeAddedObserver.observe(document.body, {subtree: true, childList: true});
        const gameGrid = document.querySelector(".game-grid-container");
        if (gameGrid) {
            init(memory, gameGrid);
        }
    }
    window.addEventListener('popstate', (event) => { run(); });
    run();
})();