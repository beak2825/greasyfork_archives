// ==UserScript==
// @name         CrazyNinjaOdds Devigged Odds on OddsJam EV Page
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Injects devigged odds from CrazyNinjaOdds into the OddsJam EV page for each bet.
// @author       You
// @match        https://oddsjam.com/betting-tools/positive-ev
// @grant        GM_xmlhttpRequest
// @connect      crazyninjaodds.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514760/CrazyNinjaOdds%20Devigged%20Odds%20on%20OddsJam%20EV%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/514760/CrazyNinjaOdds%20Devigged%20Odds%20on%20OddsJam%20EV%20Page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BASE_CNO_URL = "https://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open"
    const BANK_ROLL = 30000
    const KELLY_MULTI = 0.25

    async function main() {
        console.log('OddsJam EV page loaded.');

        const betOdds = Array.from(document.querySelectorAll("div.p-4.px-2")).map(e=>e.querySelector("p.text-sm.text-inherit.__className_214dfe.font-bold").innerHTML) // ex. [-135, 200, 100]
        const betDivs = [...document.querySelectorAll("div.tour__bet_row")]

        // open bets
        betDivs.forEach(e=>e.click())
        await timeout(5000)

        const sportsbooksOddsDivs = [...document.querySelectorAll("div.border-x.border-b.tour__compare.mb-4.rounded-b-lg")]
        const overOddsParentDivs = sportsbooksOddsDivs.map(e => Array.from(e.querySelectorAll("div.grid.gap-2"))[2])
        const overOdds = overOddsParentDivs.map(e=>Array.from(e.children).slice(1).map(e=>e.querySelector("p").innerHTML))
        const underOddsParentDivs = sportsbooksOddsDivs.map(e => Array.from(e.querySelectorAll("div.grid.gap-2"))[3])
        const underOdds = underOddsParentDivs.map(e=>Array.from(e.children).slice(1).map(e=>e.querySelector("p").innerHTML))
        let deviggedOdds = []

        for(let i=0; i<betOdds.length; i++){
            const finalOdds = betOdds[i]
            const overs = overOdds[i]
            const unders = underOdds[i]
            const isOverBet = Array.from(document.querySelectorAll("div.tour__both_sides"))[i].children[0].querySelector("a.tour__one_click_bet") !== null

            deviggedOdds.push([])

            for(let j=0; j<overs.length; j++){
                if (finalOdds && overs[j] && unders[j]) {
                    deviggedOdds[i].push(CNODevigger(finalOdds, overs[j], unders[j], isOverBet).then(odds => deviggedOdds[i][j]= odds))
                } else {
                    deviggedOdds[i].push(null)
                }
            }

            await Promise.all(deviggedOdds[i])
            injectDeviggedOdds(deviggedOdds, i)
            console.log(`Bet ${i}`)
        }

        console.log({betOdds, betDivs, sportsbooksOddsDivs, overOddsParentDivs, overOdds, underOddsParentDivs, underOdds, deviggedOdds})
    }

    function CNODevigger(betOdd, over, under, isOverBet) {
        const legOdds = isOverBet ? `&LegOdds=${over}\/${under}` : `&LegOdds=${under}\/${over}`
        const finalOdds = `&FinalOdds=${betOdd}`
        return _fetch(`${BASE_CNO_URL}${legOdds}${finalOdds}&Args=ev_p,kelly`).then(response=>{
            return ((JSON.parse(response).Final.Kelly_Full/100) * BANK_ROLL * KELLY_MULTI).toFixed(2)
        })
    }

    function _fetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    resolve(response.responseText)
                }
            })
        })
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function injectDeviggedOdds(odds, i) {
        const oddsDivs = Array.from(document.querySelectorAll("div.border-x.border-b.tour__compare.mb-4.rounded-b-lg"))
        let overOddsDiv = Array.from(oddsDivs[i].querySelectorAll("div.grid.gap-2"))[2]
        let devigDiv = overOddsDiv.cloneNode(true)
        let parentDivs = document.querySelectorAll("div.relative.overflow-x-auto")
        devigDiv.removeChild(Array.from(devigDiv.children)[0])
        for(let j=0; j<Array.from(devigDiv.children).length; j++) {
            let oddDiv = Array.from(devigDiv.children)[j]
            oddDiv.querySelector("p").innerHTML = odds[i][j]
            if (Number(odds[i][j]) > 0){
                Array.from(devigDiv.children)[j].querySelector(`[role="presentation"]`).classList.add("border-brand-green")
                Array.from(devigDiv.children)[j].querySelector(`[role="presentation"]`).classList.add("bg-brand-green-1")
            } else {
                Array.from(devigDiv.children)[j].querySelector(`[role="presentation"]`).classList.remove("border-brand-green")
                Array.from(devigDiv.children)[j].querySelector(`[role="presentation"]`).classList.remove("bg-brand-green-1")
                Array.from(devigDiv.children)[j].querySelector(`[role="presentation"]`).classList.remove("bg-brand-green-3")
            }
        }
        devigDiv.prepend(document.createElement("div"))
        parentDivs[i].prepend(devigDiv)
    }

    setTimeout(main, 3000)
})();
