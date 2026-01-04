// ==UserScript==
// @name        Torn War Hits Counter
// @author      Shizaka [3476738]
// @namespace   Shizaka
// @version     1.0.0.202512261820
// @description Displays your war hits count for the current war on the war page.
// @match       https://www.torn.com/factions.php*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/538892/Torn%20War%20Hits%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/538892/Torn%20War%20Hits%20Counter.meta.js
// ==/UserScript==

(async function ($) {

    try {
        GM_registerMenuCommand('Enter Limited Api Key', function () {
            promptForApiKey();
        });
    } catch (error) {
        console.warn('[Torn War Hits Counter] Tampermonkey not detected!');
    }

    let apiKey = localStorage.getItem("szk-torn-war-hits-counter") ?? '###PDA-APIKEY###';
    let warHitCounterStarted = false
    addStyles()

    if (checkAPIKey() === true) {
        setWarPageObserver()
    }

    function addStyles() {
        $("<style type='text/css'>" +
            ".war-hits-count {" +
            "   padding: 5px;" +
            "   min-height: 11px;" +
            "   display: flex;" +
            "   align-items: center;" +
            "   justify-content: center;" +
            "   text-align: center;" +
            "   font-size: 12px;" +
            "   line-height: 120%;" +
            "   font-family: arial;" +
            "   text-transform: uppercase;" +
            "   font-weight: bold;" +
            "}" +
            "@media only screen and (min-width: 785px) {" +
            "  .war-hits-count-top-wrap {" +
            "    display: flex;" +
            "    justify-content: flex-end;" +
            "  }" +
            "  .war-hits-count-top {" +
            "    display: flex;" +
            "    width: 50%;" +
            "    align-items: center;" +
            "    justify-content: center;" +
            "    align-self: flex-end;" +
            "    padding: 0.5em 0;" +
            "    margin-bottom: 0.5em;" +
            "  }" +
            "}" +
            "</style>"
        ).appendTo("head");
    }

    function setWarPageObserver() {
        const observerTarget = document.querySelector("#factions");
        if (observerTarget == null) return
        if (typeof observerTarget !== 'object') return
        const observerConfig = {attributes: false, childList: true, characterData: false, subtree: true};
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(mutationRaw => {
                let mutation = mutationRaw.target;
                if (typeof mutation.className !== "string") return
                if (mutation.className.indexOf('desc-wrap warDesc') !== -1) {
                    if (warHitCounterStarted) return
                    let myFactionWarTable = document.querySelector(".your-faction ");
                    if (myFactionWarTable !== null) {
                        warHitCounterStarted = true
                        showMyWarHitsCount(myFactionWarTable)
                    }
                }
            });
        });
        observer.observe(observerTarget, observerConfig);
    }

    async function showMyWarHitsCount(myFactionWarTable) {
        let myWarHitCount = await getMyWarHitsCount()
        let myPlayerId = await getMyPlayerId()

        // TornPDA fix
        $('.war-hits-count-top-wrap').add('.war-hits-count').remove()

        const myWarHitCounterDisplay = myWarHitCount.rwHitsCount + ` + ` + myWarHitCount.assistCount + ` assists<br>`
            + ` (` + myWarHitCount.attackCount + ` Leave | `
            + myWarHitCount.mugCount + ` Mug | `
            + myWarHitCount.hospCount + ` Hosp)<br>`
            + `Avg FF ` + myWarHitCount.FfAvg
            + ` | Avg R ` + myWarHitCount.respectAvg
            + ` | Avg Flat R ` + myWarHitCount.flatRespectAvg + `<br>&nbsp;<br>`
            + `Non-war hits: ` + myWarHitCount.chainHitsCount + `<br>&nbsp;<br>`
            + `Received Hits: <br>`
            + `War: ` + myWarHitCount.receivedWarCount + ` | Non War: ` + myWarHitCount.receivedNonWarCount + ` | Stealth: ` + myWarHitCount.receivedStealthCount


        $('.faction-names').prepend(`<div class="war-hits-count-top-wrap"><div class="war-hits-count war-hits-count-top"> My War Hits: ` + myWarHitCounterDisplay + `</div></div>`)
    }

    async function getMyPlayerId() {
        const localStorageKey = "szk-torn-war-hits-counter-player-id"
        let storedPlayerId = localStorage.getItem(localStorageKey)
        let parsedStoredPlayerId = JSON.parse(storedPlayerId)

        if (parsedStoredPlayerId === null || (Date.now() - parsedStoredPlayerId.timestamp) / 1000 >= 60) {
            let userApiUrl = 'https://api.torn.com/v2/user?key=' + apiKey
            let userApiResponse = await fetchApiResponse(userApiUrl)
            parsedStoredPlayerId = {
                playerId: userApiResponse.profile.id,
                timestamp: Date.now()
            }
            localStorage.setItem(localStorageKey, JSON.stringify(parsedStoredPlayerId));
        }
        return parsedStoredPlayerId.playerId
    }

    async function getLatestRwData() {
        const localStorageKey = "szk-torn-war-hits-counter-latest-rw"
        const storedLatestFactionRw = localStorage.getItem(localStorageKey)
        let parsedStoredLatestFactionRw = JSON.parse(storedLatestFactionRw)

        if (parsedStoredLatestFactionRw === null || (Date.now() - parsedStoredLatestFactionRw.timestamp) / 1000 >= 60) {
            const factionRWApiUrl = 'https://api.torn.com/v2/faction/rankedwars?sort=DESC&key=' + apiKey
            const factionRWApiResponse = await fetchApiResponse(factionRWApiUrl)
            parsedStoredLatestFactionRw = {
                latestWarStartTimestamp: factionRWApiResponse.rankedwars[0].start,
                opposingFactionId: factionRWApiResponse.rankedwars[0].factions[0].id,
                timestamp: Date.now()
            }
            localStorage.setItem(localStorageKey, JSON.stringify(parsedStoredLatestFactionRw));
        }
        return parsedStoredLatestFactionRw
    }

    async function getLatestRwStartTimestamp() {
        const parsedStoredLatestFactionRw = await getLatestRwData()
        return parsedStoredLatestFactionRw.latestWarStartTimestamp
    }

    async function getLatestRwOpposingFactionId() {
        const parsedStoredLatestFactionRw = await getLatestRwData()
        return parsedStoredLatestFactionRw.opposingFactionId
    }

    async function getMyWarHitsCount() {
        const timestampNow = Date.now()

        const myPlayerId = await getMyPlayerId()
        const latestWarStartTimestamp = await getLatestRwStartTimestamp()
        const opposingFactionId = await getLatestRwOpposingFactionId()

        let myAttacksApiUrl, myAttacksApiResponse
        let fetchedAttacks = []
        let oldestFetchedAttack = timestampNow

        while (latestWarStartTimestamp < oldestFetchedAttack) {
            myAttacksApiUrl = 'https://api.torn.com/v2/user/attacks?limit=100&to=' + oldestFetchedAttack + '&timestamp=' + timestampNow + '&key=' + apiKey
            myAttacksApiResponse = await fetchApiResponse(myAttacksApiUrl)
            fetchedAttacks = fetchedAttacks.concat(myAttacksApiResponse.attacks)
            oldestFetchedAttack = fetchedAttacks.at(-1).started
        }

        let myRwHitsCount = myAttackCount = myHospCount = myMugCount = myAssistCount = myChainHitsCount = 0
        let myReceivedWarHits = myReceivedNonWarHits = myReceivedStealthHits = 0
        let FFArray = []
        let respectArray = []
        let flatRespectArray = []

        fetchedAttacks.forEach((attack) => {
            if (attack.started < latestWarStartTimestamp) return

            if (attack.attacker === null) {
                myReceivedStealthHits++
                return
            }

            if (attack.attacker.id === myPlayerId) {
                // attack.is_ranked_war is false for assists. We check whether this is a war hit assist based on the defender's faction ID
                if (attack.defender.faction !== null && attack.defender.faction.id === opposingFactionId && attack.result === "Assist") {
                    myAssistCount++
                    // We do not take assists into consideration to calculate average respect.
                    return
                }

                if (!["Attacked", "Hospitalized", "Mugged"].includes(attack.result)) return
                if (attack.is_ranked_war) {
                    if (attack.result === "Attacked") myAttackCount++
                    else if (attack.result === "Hospitalized") myHospCount++
                    else if (attack.result === "Mugged") myMugCount++
                    FFArray.push(attack.modifiers.fair_fight)
                    respectArray.push(attack.respect_gain)
                    // TODO: change flat R calculation on bonus hits
                    flatRespectArray.push(attack.respect_gain / attack.modifiers.chain / attack.modifiers.group)
                } else {
                    myChainHitsCount++
                }
            } else {
                if (attack.is_ranked_war) {
                    myReceivedWarHits++
                } else {
                    myReceivedNonWarHits++
                }
            }
        })
        let FFAverage = averageRespect = averageFlatRespect = 0

        if (FFArray.length > 0) {
            FFAverage = FFArray.reduce((a, b) => a + b, 0) / FFArray.length
            averageRespect = respectArray.reduce((a, b) => a + b, 0) / respectArray.length
            averageFlatRespect = flatRespectArray.reduce((a, b) => a + b, 0) / flatRespectArray.length
        }

        return {
            rwHitsCount: myAttackCount + myHospCount + myMugCount,
            attackCount: myAttackCount,
            hospCount: myHospCount,
            mugCount: myMugCount,
            assistCount: myAssistCount,
            chainHitsCount: myChainHitsCount,
            receivedStealthCount: myReceivedStealthHits,
            receivedWarCount: myReceivedWarHits,
            receivedNonWarCount: myReceivedNonWarHits,
            FfAvg: FFAverage.toFixed(2),
            respectAvg: averageRespect.toFixed(2),
            flatRespectAvg: averageFlatRespect.toFixed(2)
        }
    }

    async function fetchApiResponse(url) {
        return fetch(url)
            .then(response => response.json())
            .then(json => json)
            .catch(error => console.log(error))
    }

    function checkAPIKey() {
        return !(apiKey === null || apiKey.indexOf('PDA-APIKEY') > -1 || apiKey.length !== 16);
    }

    function promptForApiKey() {
        let userInput = prompt("Please enter a limited Api Key:", apiKey ?? '');
        if (userInput !== null && userInput.length === 16) {
            apiKey = userInput;
            localStorage.setItem("szk-torn-war-hits-counter", userInput);
        } else {
            console.error("[Torn War Hits Counter] User cancelled the Api Key input.");
        }
    }

})(jQuery)
