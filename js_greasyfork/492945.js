// ==UserScript==
// @name         Poker Odds Calculator
// @namespace    https://openuserjs.org/users/torn/pokerodds
// @version      1.3.38
// @description  Show poker hand odds on TC
// @author       Torn Community
// @match        https://www.torn.com/page.php?sid=holdem
// @run-at       document-body
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492945/Poker%20Odds%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/492945/Poker%20Odds%20Calculator.meta.js
// ==/UserScript==

let GM_addStyle = function(s)
{
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = s;
    
    document.head.appendChild(style);
}

class Utils
{
    static async sleep(ms)
    {
        return new Promise(e => setTimeout(e, ms));
    }
    
}

class PokerCalculatorModule
{
    constructor()
    {
        this.upgradesToShow = 10;
        this.lastLength = 0;
        this.addStyle();
    }
    
    update()
    {
        //console.time("Update");
        
        let allCards = this.getFullDeck();
        
        let knownCards = Array.from(document.querySelectorAll("[class*='flipper___'] > div[class*='front___'] > div")).map(e => 
        {
          //<div class="fourColors___ihYdi clubs-10___SmzgY cardSize___BbTMe"></div>
          //Desire: "hearts-4", "clubs-14"
            var card = (e.classList[1] || "null-0").split("_")[0]
            .replace("-A", "-14")
            .replace("-K", "-13")
            .replace("-Q", "-12")
            .replace("-J", "-11");
            if(card == "cardSize") {
              card = "null-0";
            }
            return card;
        });
        
        let communityCards = knownCards.slice(0, 5);
        
        allCards = this.filterDeck(allCards, knownCards.filter(e => !e.includes("null")));
        
        if(JSON.stringify(knownCards).length != this.lastLength)
        {
            let playerNodes = document.querySelectorAll("[class*='playerMeGateway___']");
            
            document.querySelector("#pokerCalc-myHand tbody").innerHTML = "";
            document.querySelector("#pokerCalc-upgrades tbody").innerHTML = "";
            document.querySelector("#pokerCalc-oppPossHands tbody").innerHTML = "";

            
            playerNodes.forEach(player =>
            {
                let myCards = Array.from(player.querySelectorAll("div[class*='front___'] > div")).map(e => 
                {
                    var card = (e.classList[1] || "null-0").split("_")[0]
                    .replace("-A", "-14")
                    .replace("-K", "-13")
                    .replace("-Q", "-12")
                    .replace("-J", "-11");

                  if(card == "cardSize") {
                    card = "null-0";
                  }
                    return card;
                });
                
                let myHand = this.getHandScore(communityCards.concat(myCards));

                if(myHand.score > 0)
                {
                    let myUpgrades = {};
                    let bestOppHands = {};
                    let additionalCards = [];
                    let additionalOppCards = [];

                    let myRank = this.calculateHandRank(myHand, communityCards, allCards);

                    if(communityCards.filter(e => !e.includes("null")).length == 3)
                    {
                        for(let a of allCards)
                        {
                            for(let b of allCards)
                            {
                                if(a > b)
                                {
                                    additionalCards.push([a, b]);
                                }
                            }
                        }
                    }
                    else if(communityCards.filter(e => !e.includes("null")).length == 4)
                    {
                        for(let a of allCards)
                        {
                            additionalCards.push([a]);
                        }
                    }
                    else if(communityCards.filter(e => !e.includes("null")).length == 5)
                    {
                        for(let a of allCards)
                        {
                            for(let b of allCards)
                            {
                                if(a > b)
                                {
                                    additionalOppCards.push([a, b]);
                                }
                            }
                        }
                    }

                    /******* My Hand *******/
                    document.querySelector("#pokerCalc-myHand tbody").innerHTML += `<tr><td>Me</td><td>${myHand.description}</td><td>${myRank.rank}</td><td>${myRank.top}</td></tr>`;
                    
                    /******* My Upgrades *******/
                    for(let cards of additionalCards)
                    {
                        let thisHand = this.getHandScore(communityCards.concat(cards).concat(myCards));
                        if(thisHand.score > myHand.score)
                        {
                            let type = thisHand.description.split(":")[0];
                        
                            if(thisHand.description.includes("Four of a kind") || thisHand.description.includes("Three of a kind") || thisHand.description.includes("Pair"))
                            {
                                type += ": " + thisHand.description.split("</span>")[1].split("<span")[0].trim() + "s";
                            }
                            else if(thisHand.description.includes("Full house"))
                            {
                                type += ": " + thisHand.description.split("</span>")[1].split("<span")[0].trim() + "s full of " + thisHand.description.split("</span>").reverse()[0].split("</td>")[0] + "s";
                            }
                            else if(thisHand.description.includes("Straight"))
                            {
                                type += ": " + thisHand.description.split("</span>")[1].split("<span")[0].trim() + "-high";
                            }
                            else if(thisHand.description.includes("Two pairs"))
                            {
                                type += ": " + thisHand.description.split("</span>")[1].split("<span")[0].trim() + "s and " + thisHand.description.split("</span>")[3].split("<span")[0].trim() + "s";
                            }
                            
                            if(!myUpgrades.hasOwnProperty(type))
                            {
                                myUpgrades[type] = {hand: thisHand, type: type, cards: cards, score: thisHand.score, duplicates: 0, chance: 0};
                            }
                            
                            myUpgrades[type].description = thisHand.description;
                            myUpgrades[type].duplicates++;
                        }
                    }

                    let topUpgrades = Object.values(myUpgrades);
        
                    topUpgrades.forEach(e => 
                    {
                        e.chance = ((e.duplicates / additionalCards.length)*100);
                    });
                    
                    // Order by top hands
                    //topUpgrades = Object.values(topUpgrades).sort((a, b) => b.score - a.score).slice(0, this.upgradesToShow);
                    
                    // Order by chance
                    topUpgrades = Object.values(topUpgrades).sort((a, b) => b.chance - a.chance).slice(0, this.upgradesToShow);
                    
                    topUpgrades.forEach(e => 
                    {
                        if(!e.rank)
                        {
                            let thisRank = this.calculateHandRank(e.hand, communityCards.concat(e.cards), this.filterDeck(allCards, e.cards));
                            
                            e.rank = thisRank.rank;
                            e.top = thisRank.top;
                            e.topNumber = thisRank.topNumber;
                        }
                    });
                    
                    let upgradeString = "";
                    
                    for(let upgrade of topUpgrades)
                    {
                        upgradeString += "<tr>";
                        upgradeString += `<td>${upgrade.chance.toFixed(2)}%</td><td>${upgrade.type}</td><td>${upgrade.rank}</td><td>${upgrade.top}</td>`;
                        upgradeString += "</tr>"
                    }
                    
                    document.querySelector("#pokerCalc-upgrades tbody").innerHTML = upgradeString;


                    /******* Best Opp Hands *******/

                    for(let cards of additionalOppCards)
                    {
                        let oppPossHand = this.getHandScore(communityCards.concat(cards));
                        let type = oppPossHand.description.split(":")[0];
                    
                        if(oppPossHand.description.includes("Four of a kind") || oppPossHand.description.includes("Three of a kind") || oppPossHand.description.includes("Pair"))
                        {
                            type += ": " + oppPossHand.description.split("</span>")[1].split("<span")[0].trim() + "s";
                        }
                        else if(oppPossHand.description.includes("Full house"))
                        {
                            type += ": " + oppPossHand.description.split("</span>")[1].split("<span")[0].trim() + "s full of " + oppPossHand.description.split("</span>").reverse()[0].split("</td>")[0] + "s";
                        }
                        else if(oppPossHand.description.includes("Straight"))
                        {
                            type += ": " + oppPossHand.description.split("</span>")[1].split("<span")[0].trim() + "-high";
                        }
                        else if(oppPossHand.description.includes("Two pairs"))
                        {
                            type += ": " + oppPossHand.description.split("</span>")[1].split("<span")[0].trim() + "s and " + oppPossHand.description.split("</span>")[3].split("<span")[0].trim() + "s";
                        }
                        
                        if(!bestOppHands.hasOwnProperty(type))
                        {
                            bestOppHands[type] = {hand: oppPossHand, type: type, cards: cards, score: oppPossHand.score, duplicates: 0, chance: 0};
                        }
                        
                        bestOppHands[type].description = oppPossHand.description;
                        bestOppHands[type].duplicates++;
                    }
                    
                    let topOppHands = Object.values(bestOppHands);
        
                    topOppHands.forEach(e => 
                    {
                        e.chance = ((e.duplicates / additionalOppCards.length)*100);
                    });
                    
                    // Order by top hands
                    topOppHands = Object.values(topOppHands).sort((a, b) => b.score - a.score).slice(0, this.upgradesToShow);
                    
                    // Order by chance
                    //topOppHands = Object.values(topOppHands).sort((a, b) => b.chance - a.chance).slice(0, this.upgradesToShow);
                    
                    topOppHands.forEach(e => 
                    {
                        let thisRank = this.calculateHandRank(e.hand, communityCards.concat(e.cards), this.filterDeck(allCards, e.cards));
                        
                        e.rank = thisRank.rank;
                        e.top = thisRank.top;
                        e.topNumber = thisRank.topNumber;
                    });
                        
                    let oppHandString = "";
                    
                    for(let upgrade of topOppHands)
                    {
                        oppHandString += "<tr>";
                        oppHandString += `<td>${upgrade.chance.toFixed(2)}%</td><td>${upgrade.type}</td><td>${upgrade.rank}</td><td>${upgrade.top}</td>`;
                        oppHandString += "</tr>"
                    }
                    
                    document.querySelector("#pokerCalc-oppPossHands tbody").innerHTML = oppHandString;

                }
            });

            let playerRows = Array.from(document.querySelectorAll("#pokerCalc-div #pokerCalc-myHand tr")).slice(1);
            
            if(playerRows.length > 0)
            {
                playerRows.reduce((a, b) => parseFloat(a.children[3].innerText.replace(/[^0-9\.]/g, "")) <= parseFloat(b.children[3].innerText.replace(/[^0-9\.]/g, "")) ? a : b).style.background = "#dfd";
            }
            
            let upgradeRows = Array.from(document.querySelectorAll("#pokerCalc-div #pokerCalc-upgrades tr")).slice(1);
            
            if(upgradeRows.length > 0)
            {
                upgradeRows.reduce((a, b) => parseFloat(a.children[3].innerText.replace(/[^0-9\.]/g, "")) <= parseFloat(b.children[3].innerText.replace(/[^0-9\.]/g, "")) ? a : b).style.background = "#dfd";
            }

            let bestOppHandRows = Array.from(document.querySelectorAll("#pokerCalc-div #pokerCalc-oppPossHands tr")).slice(1);
            
            if(bestOppHandRows.length > 0)
            {
                bestOppHandRows.reduce((a, b) => parseFloat(a.children[3].innerText.replace(/[^0-9\.]/g, "")) <= parseFloat(b.children[3].innerText.replace(/[^0-9\.]/g, "")) ? a : b).style.background = "#dfd";
            }


            
            
            this.lastLength = JSON.stringify(knownCards).length;
        }
        
        //console.timeEnd("Update");
        
        setTimeout(this.update.bind(this), 500);
    }
    
    addStyle()
    {
        GM_addStyle(`
            #pokerCalc-div *
            {
                all: revert;
            }
            
            #pokerCalc-div
            {
                background-color: #eee;
                color: #444;
                padding: 5px;
                margin-top: 10px;
            }
            
            #pokerCalc-div table
            {
                border-collapse: collapse;
                margin-top: 10px;
                width: 100%;
            }
            
            #pokerCalc-div th, #pokerCalc-div td
            {
                border: 1px solid #444;
                padding: 5px;
                width: 25%;
            }
            
            #pokerCalc-div tr td:nth-child(1), #pokerCalc-div tr td:nth-child(3), #pokerCalc-div tr td:nth-child(4)
            {
                text-align: center;
            }
            
            #pokerCalc-div caption
            {
                margin-bottom: 2px;
                font-weight: 600;
            }
        `);
    }
    
    addStatisticsTable()
    {

        while(!(root = document.querySelector("#react-root"))) {
            setTimeout(function(){
                window.pokerCalculator.addStatisticsTable();
            }, 1000);
            return;
        }

        if (!document.getElementById("pokerCalc-div")) {
            var pokercalcdiv = document.createElement("div");
            pokercalcdiv.id = "pokerCalc-div";
            var root = document.querySelector("#react-root");
            root.after(pokercalcdiv);
        }

        let div = document.getElementById("pokerCalc-div");

        div.innerHTML = `
        <table id="pokerCalc-myHand">
        <caption>Your Hand</caption>
        <thead>
        <tr>
            <th>Name</th>
            <th>Hand</th>
            <th>Rank</th>
            <th>Top</th>
        </tr>
        </thead>
        <tbody>
        
        </tbody>
        </table>
        
        <table id="pokerCalc-upgrades">
        <caption>Your Potential Hands</caption>
        <thead>
        <tr>
            <th>Chance</th>
            <th>Hand</th>
            <th>Rank</th>
            <th>Top</th>
        </tr>
        </thead>
        <tbody>
        
        </tbody>
        </table>

        <table id="pokerCalc-oppPossHands">
        <caption>Opponent Potential Hands</caption>
        <thead>
        <tr>
            <th>Chance</th>
            <th>Hand</th>
            <th>Rank</th>
            <th>Top</th>
        </tr>
        </thead>
        <tbody>
        
        </tbody>
        </table>
        `;
        
        this.update();
    }
    
    prettifyHand(hand)
    {
        let resultText = "";
        
        for(let card of hand)
        {
            if(card != "null-0")
            {
                resultText += " " + card
                                    .replace("diamonds", "<span style='color: red'>♦</span>")
                                    .replace("spades", "<span style='color: black'>♠</span>")
                                    .replace("hearts", "<span style='color: red'>♥</span>")
                                    .replace("clubs", "<span style='color: black'>♣</span>")
                                    .replace("-14", "-A")
                                    .replace("-13", "K")
                                    .replace("-12", "Q")
                                    .replace("-11", "J")
                                    .replace("-", "");
            }
        }
        
        return resultText;
    }
    
    getFullDeck()
    {
        let result = [];
        
        for(let suit of ["hearts", "diamonds", "spades", "clubs"])
        {
            for(let value of [2,3,4,5,6,7,8,9,10,11,12,13,14])
            {
                result.push(suit + "-" + value);
            }
        }
        
        return result;
    }
    
    filterDeck(deck, cards)
    {
        for(let card of cards)
        {
            let index = deck.indexOf(card);
            
            if(index != -1)
            {
                delete deck[index];
            }
        }
        
        return deck.filter(e => e != "empty");
    }
    
    calculateHandRank(myHand, communityCards, allCards) {
        // Improved input validation
        if (!myHand?.score || !Array.isArray(communityCards) || !Array.isArray(allCards) || 
            communityCards.length === 0 || allCards.length === 0) {
            return {
                rank: "N/A",
                top: "N/A",
                topNumber: 0,
                betterHands: 0,
                equalHands: 0,
                worseHands: 0,
                totalHands: 0
            };
        }
    
        let betterHands = 0;
        let equalHands = 0;
        let worseHands = 0;
        let totalHands = 0;
        
        const availableCards = allCards.filter(card => 
            card && 
            typeof card === 'string' &&
            !communityCards.includes(card) && 
            !myHand.result.includes(card)
        );
        
        // Calculate possible hands
        for(let i = 0; i < availableCards.length - 1; i++) {
            for(let j = i + 1; j < availableCards.length; j++) {
                const combo = [availableCards[i], availableCards[j]];
                let thisHand = this.getHandScore(communityCards.concat(combo));
                
                if(thisHand.score > myHand.score) {
                    betterHands++;
                } else if(thisHand.score === myHand.score) {
                    const tieBreaker = this.compareTiedHands(myHand, thisHand);
                    if (tieBreaker > 0) betterHands++;
                    else if (tieBreaker < 0) worseHands++;
                    else equalHands++;
                } else {
                    worseHands++;
                }
                totalHands++;
            }
        }
        
        if (totalHands === 0) return {
            rank: "N/A",
            top: "N/A",
            topNumber: 0,
            betterHands: 0,
            equalHands: 0,
            worseHands: 0,
            totalHands: 0
        };
        
        // Calculate percentile where lower is better (top 1% means you're in the best 1%)
        const trueRank = betterHands + Math.ceil(equalHands / 2);
        const percentile = ((betterHands + equalHands/2) / totalHands) * 100;
        
        return {
            rank: `${trueRank + 1} / ${totalHands}`,  // Add 1 to make rank 1-based
            top: `${percentile.toFixed(1)}%`,
            topNumber: percentile / 100,
            betterHands,
            equalHands,
            worseHands,
            totalHands
        };
    }
    
    // Helper function for comparing tied hands
    compareTiedHands(hand1, hand2) {
        // Compare kicker cards when hands are tied
        const kickers1 = hand1.result.map(card => parseInt(card.split('-')[1])).sort((a, b) => b - a);
        const kickers2 = hand2.result.map(card => parseInt(card.split('-')[1])).sort((a, b) => b - a);
        
        for (let i = 0; i < kickers1.length; i++) {
            if (kickers1[i] !== kickers2[i]) {
                return kickers2[i] - kickers1[i];
            }
        }
        return 0;
    }
    
    getHandScore(hand)
    {
        hand = hand.filter(e => !e.includes("null"));
        
        if(hand.length < 5){return {description: "", score: 0};}
        
        let resultString = "";
        let resultText = "";
        let handResult;
        let handObject = this.makeHandObject(hand);

        if(handResult = this.hasFourOfAKind(hand, handObject))
        {
            resultString += "7";
            resultText += "Four of a kind:";
        }
        else if(handResult = this.hasFullHouse(hand, handObject))
        {
            resultString += "6";
            resultText += "Full house:";
        }
        else if(handResult = this.hasFlush(hand, handObject))
        {
            let isRoyal = this.hasRoyalFlush(hand, handObject);
            
            if(isRoyal)
            {
                handResult = isRoyal;
                resultString += "9";
                resultText += "Royal flush:";
            }
            else
            {
                let isStraight = this.hasStraightFlush(hand, handObject);
                
                if(isStraight)
                {
                    handResult = isStraight;
                    resultString += "8";
                    resultText += "Straight flush:";
                }
                else
                {
                    resultString += "5";
                    resultText += "Flush:";
                }
            }
        }
        else if(handResult = this.hasStraight(hand, handObject))
        {
            resultString += "4";
            resultText += "Straight:";
        }
        else if(handResult = this.hasThreeOfAKind(hand, handObject))
        {
            resultString += "3";
            resultText += "Three of a kind:";
        }
        else if(handResult = this.hasTwoPairs(hand, handObject))
        {
            resultString += "2";
            resultText += "Two pairs:";
        }
        else if(handResult = this.hasPair(hand, handObject))
        {
            resultString += "1";
            resultText += "Pair:";
        }
        else
        {
            resultString += "0";
            resultText += "High card:";
            
            handResult = hand.slice(0, 5);
        }

        for(let card of handResult)
        {
            resultString += parseInt(card.split("-")[1]).toString(16);
        }
        
        resultText += this.prettifyHand(handResult);

        return {description: resultText, result: handResult, score: parseInt(resultString, 16)};
    }
    
    makeHandObject(hand)
    {
        let resultMap = {cards: hand, suits: {}, values: {}};
        
        hand.sort((a, b) => parseInt(b.split("-")[1]) - parseInt(a.split("-")[1])).filter(e => e != "null-0").forEach(e => 
        {
            let suit = e.split("-")[0];
            let value = e.split("-")[1];
            
            if(!resultMap.suits.hasOwnProperty(suit))
            {
                resultMap.suits[suit] = [];
            }
            
            if(!resultMap.values.hasOwnProperty(value))
            {
                resultMap.values[value] = [];
            }
            
            resultMap.suits[suit].push(e);
            resultMap.values[value].push(e);
        });

        return resultMap;
    }
    
    hasRoyalFlush(hand, handObject) {
        // Check each suit for royal flush
        for (let suit in handObject.suits) {
            const suitCards = handObject.suits[suit];
            if (suitCards.length >= 5) {
                // Check if this suit has A,K,Q,J,10
                const values = new Set(suitCards.map(card => parseInt(card.split("-")[1])));
                if ([10,11,12,13,14].every(value => values.has(value))) {
                    return suitCards
                        .filter(card => parseInt(card.split("-")[1]) >= 10)
                        .sort((a,b) => parseInt(b.split("-")[1]) - parseInt(a.split("-")[1]))
                        .slice(0,5);
                }
            }
        }
        return null;
    }
    
    hasStraightFlush(hand, handObject)
    {
        for (let suit in handObject.suits) {
            const suitCards = handObject.suits[suit];
            if (suitCards.length >= 5) {
                const straightFlush = this.hasStraight(suitCards, this.makeHandObject(suitCards));
                if (straightFlush) {
                    return straightFlush;
                }
            }
        }
        return null;
    }
    
    hasFourOfAKind(hand, handObject)
    {
        let quadruplets = Object.values(handObject.values).filter(e => e.length == 4);

        if(quadruplets.length > 0)
        {
            delete hand[hand.indexOf(quadruplets[0][0])];
            delete hand[hand.indexOf(quadruplets[0][1])];
            delete hand[hand.indexOf(quadruplets[0][2])];
            delete hand[hand.indexOf(quadruplets[0][3])];
            
            hand = hand.filter(e => e != "empty");
            
            return quadruplets[0].concat(hand).slice(0, 5);
        }
    }
    
    hasFullHouse(hand, handObject) {
        // First find three of a kind (exactly 3 cards)
        let triplets = Object.values(handObject.values)
            .filter(e => e.length === 3)
            .sort((a, b) => parseInt(b[0].split("-")[1]) - parseInt(a[0].split("-")[1]));
        
        // Don't consider four of a kind as it's a higher hand
        if (triplets.length === 0) {
            return null;
        }
        
        // For each three of a kind, look for the highest available pair
        for (let threeOfKind of triplets) {
            const threeValue = parseInt(threeOfKind[0].split("-")[1]);
            
            const pairs = Object.values(handObject.values)
                .filter(e => e.length >= 2 && parseInt(e[0].split("-")[1]) !== threeValue)
                .sort((a, b) => parseInt(b[0].split("-")[1]) - parseInt(a[0].split("-")[1]));
                
            if (pairs.length > 0) {
                return threeOfKind.slice(0, 3).concat(pairs[0].slice(0, 2));
            }
        }
        return null;
    }
    
    hasFlush(hand, handObject)
    {
        for (let suit in handObject.suits) {
            if (handObject.suits[suit].length >= 5) {
                // Sort by value and take highest 5 cards
                return handObject.suits[suit]
                    .sort((a, b) => parseInt(b.split("-")[1]) - parseInt(a.split("-")[1]))
                    .slice(0, 5);
            }
        }
        return null;
    }

    hasStraight(hand, handObject) {
        // Remove duplicates by value while keeping track of original cards
        const valueMap = new Map(); // value -> card
        hand.forEach(card => {
            const value = parseInt(card.split("-")[1]);
            if (!valueMap.has(value) || parseInt(valueMap.get(value).split("-")[1]) < value) {
                valueMap.set(value, card);
            }
        });
        
        const uniqueValues = Array.from(valueMap.keys()).sort((a, b) => b - a);
        
        // Check normal straights
        for (let i = 0; i <= uniqueValues.length - 5; i++) {
            const possibleStraight = uniqueValues.slice(i, i + 5);
            if (possibleStraight[0] - possibleStraight[4] === 4) {
                // Map back to original cards in correct order
                return possibleStraight.map(value => valueMap.get(value));
            }
        }
        
        // Check Ace-low straight (A,2,3,4,5)
        if (uniqueValues.includes(14) && 
            uniqueValues.includes(2) && 
            uniqueValues.includes(3) && 
            uniqueValues.includes(4) && 
            uniqueValues.includes(5)) {
            // Return cards in correct order: 5,4,3,2,A
            return [
                valueMap.get(5),
                valueMap.get(4),
                valueMap.get(3),
                valueMap.get(2),
                valueMap.get(14)
            ];
        }
        
        return null;
    }
    
    hasThreeOfAKind(hand, handObject)
    {
        let triplets = Object.values(handObject.values).filter(e => e.length == 3);

        if(triplets.length > 0)
        {
            delete hand[hand.indexOf(triplets[0][0])];
            delete hand[hand.indexOf(triplets[0][1])];
            delete hand[hand.indexOf(triplets[0][2])];
            
            hand = hand.filter(e => e != "empty");
            
            return triplets[0].concat(hand).slice(0, 5);
        }
    }
    
    hasTwoPairs(hand, handObject)
    {
        let pairs = Object.values(handObject.values).filter(e => e.length == 2);

        if(pairs.length > 1)
        {
            delete hand[hand.indexOf(pairs[0][0])];
            delete hand[hand.indexOf(pairs[0][1])];
            delete hand[hand.indexOf(pairs[1][0])];
            delete hand[hand.indexOf(pairs[1][1])];
            
            hand = hand.filter(e => e != "empty");
            
            if(parseInt(pairs[0][0].split("-")[1]) > parseInt(pairs[1][0].split("-")[1]))
            {
                return pairs[0].concat(pairs[1].concat(hand)).slice(0, 5);
            }
            else
            {
                return pairs[1].concat(pairs[0].concat(hand)).slice(0, 5);
            }
        }
    }
    
    hasPair(hand, handObject)
    {
        let pairs = Object.values(handObject.values).filter(e => e.length == 2);

        if(pairs.length > 0)
        {
            delete hand[hand.indexOf(pairs[0][0])];
            delete hand[hand.indexOf(pairs[0][1])];
            
            hand = hand.filter(e => e != "empty");
            
            return pairs[0].concat(hand).slice(0, 5);
        }
    }
}

window.pokerCalculator = new PokerCalculatorModule();
window.pokerCalculator.addStatisticsTable()