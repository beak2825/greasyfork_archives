// ==UserScript==
// @name         NoCheapskates
// @namespace    SobieskiCodes
// @version      0.3
// @description  [12:34:09 AM] TheMainLogic: someone make a script where i cant see bid offers of 1 and 2 coins please
// @author       probsjustin
// @match        *://*www.milkywayidle.com/*
// @match        *://*test.milkywayidle.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449785/NoCheapskates.user.js
// @updateURL https://update.greasyfork.org/scripts/449785/NoCheapskates.meta.js
// ==/UserScript==
(function () {
    "use strict";
    let found = false
    function onGameReady(callback) {
        const gameConnection = document.getElementsByClassName("GamePage_connectionMessage__1ZU5B");
        if (gameConnection.length === 1 && !found) {
            found = true
        }
        if(gameConnection.length === 0 && found) {
            callback();
        }
        else {
            setTimeout(function () {
                onGameReady(callback);
            }, 250);
        }
    }

    onGameReady(() => {console.log('Ready to go.')});
    const IgnoredBids = ['1', '2']
    let observer = new MutationObserver(onMutation);
    observer.observe(document.body, { childList: true, subtree: true });
    function onMutation(mutations) {
        for (let mutation of mutations) {
            const marketPanel = document.getElementsByClassName('MarketplacePanel_marketplacePanel__21b7o')
            if (marketPanel.length >= 1) {
                const bestBids = marketPanel[0].getElementsByClassName('MarketplacePanel_bestBidPrice__6q3Oh');
                if (bestBids.length !== 0) {
                    for (const bid of bestBids) {
                        if(IgnoredBids.includes(bid.innerText)) {
                            bid.innerText = ''
                        }
                    }
                }
            }
            const table = document.getElementsByClassName("MarketplacePanel_orderBookTable__3zzrv")
            if (table.length !== 0) {
                for(let i = 0; i < table[1].tBodies.length; i++) {
                    const tbody = table[1].tBodies[i];
                    for (let j = 0; j < tbody.rows.length; j++) {
                        const row = tbody.rows[j]
                        for (let k = 0; k < row.cells.length; k++) {
                            const cell = row.cells[k];
                            if (k === 1) {
                                if(IgnoredBids.includes(cell.innerText)) {
                                    row.remove()
                                }
                            }
                        }
                    }
                }
            }
            // add time remaining to finish your actions formatted as [24H:54M] in front of the page title.
            const playerStatus = document.getElementsByClassName("Header_actionNameAndButton__1WOtJ")[0];
            const playerActions = ['Cheesesmithing', 'Cooking', 'Brewing', 'Enhancing'];
            if(playerActions.includes(playerStatus.innerText.split(":")[0])) {
                const actionBarList = document.getElementsByClassName("ProgressBar_text__102Yn")[0].innerText
                const actionLength = actionBarList.split("s")[0]
                const productionAmount = actionBarList.split("(")[1].split(")")[0]
                console.log(actionLength, productionAmount)
                const totalSeconds = actionLength * productionAmount
                const totalMinutes = totalSeconds / 60
                const hours = totalMinutes / 60
                const minutes = totalMinutes % 60
                let titleTime = ''
                if (totalMinutes<=60) {
                    titleTime = '[' +minutes.toFixed((0)) +':M]'
                }
                if(totalMinutes >= 60) {
                    titleTime = '[' + hours.toFixed(0) + 'H:' + minutes.toFixed() + 'M]'
                }
                document.title = titleTime + ' ' + playerStatus.innerText.split("\n")[0]
            }


        }
    }
})()