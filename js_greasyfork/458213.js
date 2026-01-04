// ==UserScript==
// @name     Mousehunt - Bristle Woods Rift Auto Chamber Bot
// @namespace  https://greasyfork.org/en/scripts/458213-mousehunt-bristle-woods-rift-auto-chamber-bot
// @version   1.11
// @author    Nicholas Kam
// @description Automatic Bristle Woods Rift Chamber Chooser & cheese choices.
// @match    http://www.mousehuntgame.com/*
// @match    https://www.mousehuntgame.com/*
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM.setValue
// @grant    GM.getValue
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458213/Mousehunt%20-%20Bristle%20Woods%20Rift%20Auto%20Chamber%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/458213/Mousehunt%20-%20Bristle%20Woods%20Rift%20Auto%20Chamber%20Bot.meta.js
// ==/UserScript==

// Need this to translate information from GM.getValue
const GM_SuperValue = new function () {
    // Couldn't include this part of the script as an @include on greesyfork. Script taken and slightly modified from:
    // https://userscripts-mirror.org/scripts/source/107941.user.js
    var JSON_MarkerStr = 'json_val: ';
    var FunctionMarker = 'function_code: ';

    function ReportError (msg) {
        if (console && console.error) console.log (msg);
        else throw new Error (msg);
    }

    //--- Check that the environment is proper.
    if (typeof GM.setValue != "function") ReportError ('This library requires Greasemonkey! GM_setValue is missing.');
    if (typeof GM.setValue != "function") ReportError ('This library requires Greasemonkey! GM_getValue is missing.');


    /*--- set ()
    GM_setValue (http://wiki.greasespot.net/GM_setValue) only stores:
    strings, booleans, and integers (a limitation of using Firefox
    preferences for storage).

    This function extends that to allow storing any data type.

    Parameters:
      varName
        String: The unique (within this script) name for this value.
        Should be restricted to valid Javascript identifier characters.
      varValue
        Any valid javascript value. Just note that it is not advisable to
        store too much data in the Firefox preferences.

    Returns:
      undefined
  */
    this.set = async function (varName, varValue) {
        await GM.setValue(varName, varValue)
    }//-- End of set()

    this.get = async function (varName, defaultValue) {

        if ( ! varName) {
            ReportError ('Illegal varName sent to GM_SuperValue.get().');
            return;
        }
        if (/[^\w _-]/.test (varName) ) {
            ReportError ('Suspect, probably illegal, varName sent to GM_SuperValue.get().');
        }

        //--- Attempt to get the value from storage.
        var varValue = await GM.getValue (varName);
        if (typeof varValue === "undefined") return defaultValue;

        //--- We got a value from storage. Now unencode it, if necessary.
        if (typeof varValue == "string") {
            //--- Is it a JSON value?
            var regxp    = new RegExp ('^' + JSON_MarkerStr + '(.+)$');
            var m      = varValue.match (regxp);
            if (m && m.length > 1) {
                varValue  = JSON.parse ( m[1] );
                return varValue;
            }

            //--- Is it a function?
            regxp    = new RegExp ('^' + FunctionMarker + '((?:.|\n|\r)+)$');
            m      = varValue.match (regxp);
            if (m && m.length > 1) {
                varValue  = eval ('(' + m[1] + ')');
                return varValue;
            }
        }

        return varValue;
    }//-- End of get()


    /*--- runTestCases ()
    Tests storage and retrieval every every knid of value.
    Note: makes extensive use of the console.

    Parameters:
      bUseConsole
        Boolean: If this is true, uses the console environment to store
        the data. Useful for dev test.
    Returns:
      true, if pass. false, otherwise.
  */
    this.runTestCases = async function (bUseConsole) {

        if (bUseConsole) {
            //--- Set up the environment to use local JS, and not the GM environment.
            this.testStorage  = {};
            var context     = this;
            this.oldSetFunc   = (typeof await GM.setValue == "function") ? await GM.setValue : null;
            this.oldGetFunc   = (typeof await GM.setValue == "function") ? await GM.setValue : null;

            GM.setValue  = function (varName, varValue) {
                console.log ('Storing: ', varName, ' as: ', varValue);
                context.testStorage[varName] = varValue;
            }

            GM.setValue  = function (varName, defaultValue) {
                var varValue  = context.testStorage[varName];
                if (!varValue)
                    varValue  = defaultValue;

                console.log ('Retrieving: ', varName, '. Got: ', varValue);

                return varValue;
            }
        }

        var dataBefore =  [null, true, 1, 1.1, -1.0, 2.0E9, 2.77E9, 2.0E-9, 0xA9, 'string',
                           [1,2,3], {a:1, B:2}, function () {console.log ("Neat! Ain't it?"); }
                          ];

        for (var J = 0; J <= dataBefore.length; J++)
        {
            var X    = dataBefore[J];
            console.log (J, ': ', typeof X, X);

            this.set ('Test item ' + J, X);
            console.log ('\n');
        }

        console.log ('\n***********************\n***********************\n\n');

        var dataAfter  = [];

        for (J = 0; J < dataBefore.length; J++)
        {
            X    = this.get ('Test item ' + J);
            dataAfter.push (X);
            console.log ('\n');
        }

        console.log (dataBefore);
        console.log (dataAfter);

        dataAfter[12]();

        //--- Now test for pass/fail. The objects won't be identical but contenets are.
        var bPass;
        if (dataBefore.toString() == dataAfter.toString() ) {
            var pfStr  = 'PASS!';
            bPass    = true;
        } else {
            pfStr  = 'FAIL!';
            bPass    = false;
        }
        console.log ( "\n***************************    \
\n***************************    \
\n***************************    \
\n*****   " + pfStr + "    *****    \
\n***************************    \
\n***************************    \
\n***************************\n");

        if (bUseConsole) {
            //--- Restore the GM functions.
            GM.setValue  = this.oldSetFunc;
            GM.setValue  = this.oldGetFunc;
        }
        else {
            //--- Clean up the FF storage!

            for (J = 0; J < dataBefore.length; J++)
            {
                GM_deleteValue ('Test item ' + J);
            }
        }

        return bPass;

    }//-- End of runTestCases()
    //await GM_SuperValue.runTestCases (true);

    //--- EOF
};

(function() {
    var scriptRunning = false
    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function () {
        // Runs this section every time the browser updates.
        this.addEventListener("load", async (event) => {
            // check if the script is running. If it is, then don't run it again.
            // This is to prevent the script from running twice on first load. Idk why this is the case.
            if (!scriptRunning) {
                try {
                    scriptRunning = true

                    // Create button for testing some random code.
                    // document.querySelector("#testButton") || createCodeTestingButton()
                    // Checks if user is in Bristle Woods Rift. Ends script if not.
                    const currLocation = document.querySelector(".hud_location").textContent
                    if(currLocation !== "Bristle Woods Rift") {
                        // console.log("User is not in Bristle Woods Rift.")
                        return
                    }

                    // Get game state: Portal status, current room, current buff, relevant cheese/potion amounts
                    const gameState = await parseGameState()
                    console.log("gameState", gameState)
                    const charmList = getCharms(gameState)

                    // create HTML elements
                    await createUserSettingHTMLElement(gameState)

                    // Check if user wants the bot to run
                    const runBot = await GM_SuperValue.get("runBristleWoodRiftBot", true)
                    await GM_SuperValue.get("runBristleWoodRiftBot") || await GM_SuperValue.set("runBristleWoodRiftBot", true)

                    if(runBot){
                        // Run the bulk of the logic (function names says exactly what it does)
                        await choosePortal(await parseGameState())
                            .then(async value => await updateEquipment(await parseGameState()))
                            .then(async value => await toggleQuartz(await parseGameState()))
                            .catch(err => {throw err})
                    }
                }
                catch (err){
                    console.log("Error encountered in Bristle Woods Rift Auto Chamber Bot: ", err)
                    const prevErrors = localStorage.getItem("errorHistory") ? JSON.parse(localStorage.getItem("errorHistory")) : ""
                    const newErrors = [err]
                    prevErrors && newErrors.push(prevErrors)
                    if(newErrors.length > 10) newErrors.pop
                    localStorage.setItem("errorHistory", JSON.stringify(newErrors))
                    console.log(JSON.parse(localStorage.getItem("errorHistory")))
                    setTimeout(location.reload(), 10000)
                } finally {
                    scriptRunning = false
                }
            }
        })
        originalOpen.apply(this, arguments);
    }

})();

function createCodeTestingButton(callback, optionalVariable){
    console.log("creating test button")

    const button = document.createElement("button")
    css(button, {width: "150px", height: "50px"})
    button.textContent = "Delete GM Values"
    const input = document.createElement("input")
    const container = document.createElement("div")
    button.addEventListener("click", () => {
        console.log("deleting variable: ", input.value,`\nGM.deleteValue("${input.value}")`)
        console.log(input)
        GM.deleteValue(input.value)
    })
    const button2 = document.createElement("button")
    css(button2, {width: "150px", height: "50px"})
    button2.textContent = "Get GM Values"
    button2.addEventListener("click", async () => {
        console.log("Getting variable (GM.getValue): ", input.value, "\n", await GM.getValue(input.value))
        console.log("Getting variable (GM_SuperValue.get): ", input.value, "\n", await GM_SuperValue.get(input.value))
    })
    container.appendChild(button)
    container.appendChild(button2)
    container.appendChild(input)
    button.id = "testButton"
    document.querySelector(".pageFrameView-contentContainer").insertBefore(container, document.querySelector(".pageFrameView-contentContainer").firstChild)
}
function testCode(callback, gameState){

}
async function toggleQuartz(gameState){
    const { chamberID, items, obelisk_percent} = gameState
    const chamber = allKeyValuePairs()[chamberID]
    const chamberPreferences = await GM_SuperValue.get(`${chamber} Settings`)
    const useQuartz = chamberPreferences ? chamberPreferences.checked : false
    const obeliskFilledOffQuartz = await GM_SuperValue.get("autoAcolyteQuartz", false)
    const isQuartzActivePrev = !!document.querySelector('.riftBristleWoodsHUD-portalEquipment.lootBooster.mousehuntTooltipParent.selected')

    // Checks if current chamber is in Acolyte Chamber, and if it should be on
    if(chamber === "Acolyte Chamber" && (obelisk_percent < 100 && useQuartz || obeliskFilledOffQuartz)) {
        setQuartz(true)
        return
    }
    else if(chamber !== "Acolyte Chamber" && useQuartz) setQuartz(true)
    else setQuartz(false)

    if (isQuartzActivePrev !== !!document.querySelector('.riftBristleWoodsHUD-portalEquipment.lootBooster.mousehuntTooltipParent.selected')) throw "Quartz status changed"
}
function setQuartz(targetStatus){
    const isQuartzActive = !!document.querySelector('.riftBristleWoodsHUD-portalEquipment.lootBooster.mousehuntTooltipParent.selected')

    if(isQuartzActive !== targetStatus){
        document.querySelector('.lootBooster .riftBristleWoodsHUD-portalEquipment-action').click()
        return true
    }
    return false
}
async function choosePortal(gameState){
    const {portals, statusEffects, items} = gameState
    const currPortalNames = portals.map(portal => portal.name)
    const currPortalTypes = portals.map(portal => portal.type)
    const sandsNum = items.rift_hourglass_sand_stat_item.quantity
    const isDebuffed = statusEffects.fr == "active" || statusEffects.un == "active" || statusEffects.st == "active"

    // Always choose to enter the tower
    if(portals[1].type === "entrance_chamber") {
        document.querySelector('a.riftBristleWoodsHUD-chamberSpecificTextContainer.entrance_chamber .riftBristleWoodsHUD-portal-padding').click()
        await confirmSelection('.riftBristleWoodsHUD-dialog-actions .mousehuntActionButton.small:not(.busy, .cancel)')
    }
    // Check if the portals are active. If it isn't, exit function.
    if(portals[1].type !== "closed"){
        // If all of the portals are not preferrable, reshuffle and exit the function.
        // This checks for whether the minimum cheese quantities are available, and if the room is checked for "shuffle chambers when ONLY the following chambers are available"
        // Also, this step will be skipped if we have zero shuffles available.

        const alwaysRerollCurse = await GM_SuperValue.get("bristleWoodsRiftRerollCurses", false)
        let potentialPortals = await getPotentialPortals()

        // If there are any choosable portal, check if you should shuffle, then shuffle. If not, choose the highest rated portal.
        console.log("potentialPortals:", potentialPortals, potentialPortals.length)
        let portalScrambleItemNum = items.rift_scramble_portals_stat_item.quantity
        while (potentialPortals.length === 0 && !alwaysRerollCurse && portalScrambleItemNum > 0){
            console.log("Scrambling portal")
            document.querySelector('.riftBristleWoodsHUD-portalEquipment-action[data-confirm-type="scramblePortals"]').click()
            await confirmSelection('.riftBristleWoodsHUD-dialog-actions .mousehuntActionButton.small:not(.busy, .cancel)')
            portalScrambleItemNum--

            console.log("Portal Scrambler Remaining: ", portalScrambleItemNum)
            potentialPortals = await getPotentialPortals()
            console.log("New portals:", potentialPortals)
        }

        // Whether there's any "decent" portal or not, choose the 'least worst' one anyway.
        const chamberPreferences = await GM_SuperValue.get("chamberPreferences")
        let chosenChamber = chamberPreferences.find(chamberName => {
            return potentialPortals.find(portal => {
                return portal.name === chamberName})
        })

        // Checks if minimum dust is met, and removes acolyte chambers from options if it isn't.
        if(items.rift_hourglass_sand_stat_item.quantity < await GM_SuperValue.get("minDustCount", 0)){
            chamberPreferences.splice(chamberPreferences.indexOf("Acolyte Chamber"), 1)
        }
        // if there's no chambers matching the best "potentially good" portals, choose the least worst one
        if(!chosenChamber){
            chosenChamber = chamberPreferences.find(chamberName => {
                return currPortalNames.find(currPortalName => chamberName === currPortalName)
            })
        }
        const chosenChamberID = nameToID(chosenChamber)
        const chosenChamberButton = document.querySelector(`a[data-confirm-type="enterPortal"][data-portal-type="${chosenChamberID}"] .riftBristleWoodsHUD-portal-image`)

        console.log("Entering bestChamber:\n", chosenChamber,"\n", chosenChamberID, chosenChamberButton)
        chosenChamberButton.click()

        if(chosenChamber === "Acolyte Chamber") GM_SuperValue.set(`Entered Acolyte Chamber with ${sandsNum} sands`)
        await confirmSelection('.riftBristleWoodsHUD-dialog-actions .mousehuntActionButton.small:not(.busy, .cancel)')
    }
    return
}
function clickButton(el){
    var clickEvent = document.createEvent('MouseEvents');

    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
        clickEvent.initEvent(eventType, true, true)
        el.dispatchEvent(clickEvent)
    })
}
async function getPotentialPortals(){
    const gameState = await parseGameState()
    const {portals, statusEffects, items} = gameState
    const sandsNum = items.rift_hourglass_sand_stat_item.quantity
    const isDebuffed = statusEffects.fr == "active" || statusEffects.un == "active" || statusEffects.st == "active"
    const portalPreferences = await GM_SuperValue.get("whenToShuffle", {})
    const ignorePortalTypes = Object.keys(portalPreferences).filter(portalType => portalPreferences[portalType])
    const alwaysRerollCurse = await GM_SuperValue.get("bristleWoodsRiftRerollCurses", false)

    const potentialPortals = await portals.filter(async (portal, portalNum) => {
        const {name, status, type} = portal
        const preferences = await GM_SuperValue.get(`${name} Settings`, {option1: "", option2:"", value: 0, checked: false})
        const cheeseReq = preferences.option1 || "Ancient String Cheese"
        const skipChamber = ignorePortalTypes.find(ignorePortal => ignorePortal === type) || false
        const minCheese = preferences.value
        const cheeseID = nameToID(cheeseReq)
        const cheeseQuantity = items[cheeseID].quantity

        // Skip the chamber if the user had defined to skip it.
        if(skipChamber) return false

        // Check if user is debuffed, and if user defined "always reroll to dispell debuffs" as true.

        if(isDebuffed && alwaysRerollCurse && status === "" && !(name === 'Pursuer Mousoleum' || name === 'Security Chamber' || name === 'Furnace Room')) return false
        // Check if it's acolyte chamber, if there's enough sands, cheese, portal is actually enter-able, and if user specified to skip.
        if (name === "Acolyte Chamber" && sandsNum > await GM_SuperValue.get("minDustCount", 0) && status === "" && cheeseQuantity >= minCheese) return true
        // check for enough cheese, if the portal is actually enter-able, and if user specified to skip.
        if (name !== "Acolyte Chamber" && status === "" && cheeseQuantity >= minCheese) return true
        else return false
    })

    return potentialPortals
}
async function updateEquipment(gameState){
    const {currCharm, currCheese, chamberID, items, obelisk_percent} = gameState
    const allCharms = getCharms(gameState)
    const chamber = chamberKeyValuePairs()[chamberID]
    const chamberPreferences = await GM_SuperValue.get(`${chamber} Settings`) ? await GM_SuperValue.get(`${chamber} Settings`) : {checked: false, value: 0, option1: "Ancient String Cheese", option2: "Rift Vacuum Charm"}
    const obeliskFallbackCharm = await GM_SuperValue.get("fullObeliskCharm")
    const targetCheese = chamberPreferences.option1 || "Ancient String Cheese"
    const targetCheeseNum = parseInt(items[nameToID(targetCheese)].quantity)
    const targetCharm = chamber === "Acolyte Chamber" && obelisk_percent === 100 ? obeliskFallbackCharm : chamberPreferences.option2 || "Rift Vacuum Charm"
    const targetCharmNum = allCharms.find(charm => charm.name === targetCharm).quantity
    const fallbackCheese = await GM_SuperValue.get("BristleWoodsRiftfallbackCheese", "Brie String Cheese")
    const fallbackCheeseNum = items[nameToID(fallbackCheese)].quantity
    const fallbackCharm = await GM_SuperValue.get("BristleWoodsRiftfallbackCharm", "Rift Vacuum Charm")
    const fallbackCharmNum = allCharms.find(charm => charm.name === targetCharm).quantity

    // Check if Cheese is the right one for the chamber. Change it if it isn't.
    if(currCheese !== targetCheese && targetCheeseNum > 0) {
        console.log("Current cheese does not match chamber's target cheese. Changing cheese to", targetCheese)
        changeEquipment('bait', nameToID(targetCheese))

    } else if (targetCheeseNum === 0 && currCheese !== fallbackCheese && fallbackCheeseNum > 0){
        console.log("Target cheese is empty. Changing cheese to fallback cheese: ", fallbackCheese)
        changeEquipment('bait', nameToID(fallbackCheese))

    }

    // Check if charm is the right one for the chamber. Change it if it isn't.
    if(currCharm !== targetCharm && targetCharmNum > 0) {
        console.log("Current charm does not match chamber's target charm. Changing charm to", targetCharm)
        changeEquipment('trinket', allCharms.find(charm => charm.name === targetCharm).type)

    } else if (targetCharmNum === 0 && currCharm !== fallbackCharm && fallbackCharmNum > 0){
        console.log("Target charm is empty. Changing charm to fallback charm: ", fallbackCharm)
        changeEquipment('trinket', allCharms.find(charm => charm.name === fallbackCharm).type)

    }

}
function changeEquipment(type, itemName){
    const equipmentElement = document.createElement("a")
    equipmentElement.setAttribute('data-item-classification', type)
    //equipmentElement.setAttribute('data-item-id',"1841")
    equipmentElement.setAttribute("data-item-type", itemName)
    console.log("attempting to change equipment", equipmentElement)
    hg.utils.TrapControl.toggleItem(equipmentElement);
    equipmentElement.remove()
}
function confirmSelection(activeButtonSelector){
    return new Promise((Resolve, Reject) => {
        const button = document.querySelector(activeButtonSelector)

        button.click()
        checkDisabled(button, 100, 20)
            .then(checkTime => {
            console.log(`Confirmation complete. Confirmation took less than ${checkTime/1000} seconds.`)
            Resolve()
        })
            .catch(() => {
            console.log("Confirmation failed ")
            Reject("Confirmation failed.")
        })
    })
}
async function getGameState(){
    // Portal rooms
    const portalRooms = Array.from(document.querySelectorAll("a.riftBristleWoodsHUD-portal")).map((el, num) => {
        return Array.from(el.classList)[2]
    })

    // Portal Status
    const portalsIsDisabled = portalRooms[0] === "closed"

    // Current Room
    const currRoom = document.querySelector(".riftBristleWoodsHUD-chamberTitle").title

    // Current Buffs - potential status: Buff/Debuff Active, Buff/Debuff "default", Buff/Debuff "in chamber", Debuff "removed"
    // Paladin's Bane Status
    const paladinBuff = document.querySelector(`.riftBristleWoodsHUD-statusEffect-icon[title="Paladin's Bane"]`).classList[2]
    const paladinDebuff = document.querySelector(`.riftBristleWoodsHUD-statusEffect-icon[title="Unlucky Alarm"]`).classList[2]

    const acolyteBonusBuff = document.querySelector(`.riftBristleWoodsHUD-statusEffect-icon[title="Acolyte Influence"]`).classList[2]
    const acolyteBonusDebuff = document.querySelector(`.riftBristleWoodsHUD-statusEffect-icon[title="Frozen Portals"]`).classList[2]

    const extraPortalBuff = document.querySelector(`.riftBristleWoodsHUD-statusEffect-icon[title="Fourth Portal"]`).classList[2]
    const extraPortalDebuff = document.querySelector(`.riftBristleWoodsHUD-statusEffect-icon[title="Pursued"]`).classList[2]

    const buffs = {
        paladin: paladinBuff,
        acolyteBonus: acolyteBonusBuff,
        extraPoratl: extraPortalBuff
    }

    const debuffs = {
        paladin: paladinDebuff,
        acolyteBonus: acolyteBonusDebuff,
        extraPoratl: extraPortalDebuff,
    }
    // Current Cheese & Amount
    const currCheese = document.querySelector("#hud_baitName").textContent
    const currCheeseAmount = parseInt(document.querySelector(".hud_baitQuantity.value").textContent)

    // Notable Cheese's amounts
    const cheeseInventory = {
        stringCheese: parseInt(document.querySelector(`[data-item-type="brie_string_cheese"]`).textContent),
        ancientCheese: parseInt(document.querySelector(`[data-item-type="ancient_string_cheese"]`).textContent),
        runicCheese: parseInt(document.querySelector(`[data-item-type="runic_string_cheese"]`).textContent)
    }
    // Current Potion Amount
    const potionInventory = {
        ancientPotion: parseInt(document.querySelector(`[data-item-type="ancient_string_cheese_potion"]`).textContent),
        runicPotion: parseInt(document.querySelector(`[data-item-type="runic_string_cheese_potion"]`).textContent)
    }
    // Time Sand amount
    const timeSand = parseInt(document.querySelector(`[data-item-type="rift_hourglass_sand_stat_item"]`).textContent)
    // scrambler amount
    const scrambler = parseInt(document.querySelector(`[data-item-type="rift_scramble_portals_stat_item"]`).textContent)
    // portal melter amount
    const portalWarmer = parseInt(document.querySelector(`[data-item-type="rift_portal_warmer_stat_item"]`).textContent)
    // Quantum Quartz amount
    const quartz = parseInt(document.querySelector(`[data-item-type=rift_quantum_quartz_stat_item]`).textContent)

    const gameStateObj = {
        currRoom: currRoom,
        buffs: buffs,
        debuffs: debuffs,
        currCheese: currCheese,
        currCheeseAmount: currCheeseAmount,
        cheeseInventory: cheeseInventory,
        potionInventory: potionInventory,
        timeSand: timeSand,
        scrambler: scrambler,
        portalWarmer: portalWarmer,
        quartz: quartz,
    }

    fetchGameState()
    return gameStateObj
}
async function parseGameState(){
    const gameState = await fetchGameState()
    const locationInfo = gameState.user.quests.QuestRiftBristleWoods

    const userHash = gameState.user.unique_hash
    const items = locationInfo.items
    const portals = locationInfo.portals
    const statusEffects = locationInfo.status_effects
    const currCheese = gameState.user.bait_name
    const currCheeseId = gameState.user.bait_item_id
    const currCharm = gameState.user.trinket_name
    const currCharmId = gameState.user.trinket_item_id
    const chamber = locationInfo.chamber_name
    const chamberID = locationInfo.chamber_type
    const components = gameState.components
    const obelisk_percent = locationInfo.obelisk_percent
    const returnObj = {
        userHash: userHash,
        items: items,
        portals: portals,
        statusEffects: statusEffects,
        currCheese: currCheese,
        currCheeseId: currCheeseId,
        currCharm: currCharm,
        currCharmId: currCharmId,
        chamber: chamber,
        chamberID: chamberID,
        components: components,
        obelisk_percent: obelisk_percent,
    }
    return returnObj
}
async function fetchGameState(){
    const gameStateJSON =fetch('https://www.mousehuntgame.com/managers/ajax/users/gettrapcomponents.php')
    const gameState = await gameStateJSON.then(res => res.json())
    .catch((err) => {
        throw err
    })

    return gameState
}
async function createUserSettingHTMLElement(gameState){
    const hasUserSettings = document.querySelectorAll("#autoBristleWoodsRiftSettings")

    if(hasUserSettings.length === 0){

        // userSettings CSS
        const userSettingsCSS = {
            marginLeft: "15px",
            marginRight: "15px",
            marginTop: "10px",
            marginBottom: "10px",
            color: "White",
            fontSize: "1.25em",
            display: await GM_SuperValue.get("hideBristleRiftSettings", false) ? "none" : "flex",
            flexDirection: "column",
            transition: "700ms ease"
        }

        // Create toggle for hiding location settings
        const settingsToggle = await createCheckboxWithLabel("hideBristleRiftSettings", "Hide Settings", false)
        css(settingsToggle, {marginLeft:"10px", display:'grid', gridTemplateColumns:"max-content max-content auto"})
        css(settingsToggle.querySelector("label"), {color: "White",fontSize: "1.25em", fontWeight:"bold", textDecoration:"underline"})
        await settingsToggle.querySelector("input").addEventListener("click", async () => {
            const settingsContainer = document.querySelector("#autoBristleWoodsRiftSettings")
            await GM_SuperValue.get("hideBristleRiftSettings", false) ? css(settingsContainer, {...userSettingsCSS, display: "flex"}) : css(settingsContainer, {...userSettingsCSS, display:"none" })
        })

        const donationLink = document.createElement("a")
        css(donationLink, {marginLeft: 'auto', marginRight:'10px', color:'lightblue', display:'inline-block', fontSize:'10px'})
        donationLink.href = "https://www.paypal.com/donate/?business=XU2YLNYR3EUVY&no_recurring=0&item_name=Like+my+work?+Support+by+buying+me+some+coffee%21%0AYour+donation+will+allow+me+to+spend+more+time+making+better+scripts.&currency_code=NZD"
        donationLink.textContent = "buy me a coffee?"

        donationLink.addEventListener("mouseover", (event) => {
            event.target.style.textDecoration = "underline"
        })
        donationLink.addEventListener("mouseout", (event) => {
            event.target.style.textDecoration = "none"
        })

        settingsToggle.appendChild(donationLink)
        // Top level container for all settings.
        // Add all toggles/UI under this div.
        const userSettings = document.createElement("div")
        userSettings.id = "autoBristleWoodsRiftSettings"
        css(userSettings, userSettingsCSS)

        // const GMValues = await GM.listValues()
        // GMValues.forEach(async value => {
        //     console.log(`${value}:`, await GM.getValue(value))
        // })

        // Create draggable elements for chamber preferences
        const chamberPreferences = await createDraggable("Reorder chamber preferences from most to least preferred (left to right)", "chamberPreferences", await GM_SuperValue.get("chamberPreferences", defaultChamberList()), defaultChamberList())
        await GM_SuperValue.get("chamberPreferences") || await GM_SuperValue.set("chamberPreferences",defaultChamberList())

        userSettings.appendChild(chamberPreferences)

        // Create checkboxes for when to shuffle portals.
        const whenToShuffleLabel = document.createElement("label")
        whenToShuffleLabel.textContent = "Shuffle chambers when ONLY the following chambers are available. If no portal scramblers available, it will continue with the chamber preferences above."
        css(whenToShuffleLabel, {
            color: "inherit",
            fontWeight: "bold",
            marginTop: "5px",
        })
        userSettings.appendChild(whenToShuffleLabel)

        const whenToShuffleContainer = document.createElement("div")
        const whenToShuffleContent = createCheckboxesWithLabel("whenToShuffle", chamberList(), chamberID())
        whenToShuffleContainer.appendChild(whenToShuffleContent)

        // I don't know why, but the above "appendChild" doesn't actually work, but the one in the zero second timer does.
        // If anyone figures out why, please do fix it/contact me about it.
        const timer = setInterval(() => {
            whenToShuffleContainer.appendChild(whenToShuffleContent)
            clearInterval(timer)
        }, 0)

        css(whenToShuffleContainer, {
            display: "grid",
            gridTemplateRows: "auto auto auto",
            gridTemplateColumns: "auto auto auto auto auto ",
        })


        userSettings.appendChild(whenToShuffleContainer)
        userSettings.appendChild(whenToShuffleContent)
        const hr1 = document.createElement("hr")
        css(hr1, {width: '80%'})
        userSettings.appendChild(hr1)

        // create section for preferred cheeses for each chambers, and the associated minimum cheese before entering.
        const chamberDefaults = document.createElement("div")
        css(chamberDefaults, {display: "grid", gap: "5px", gridTemplateColumns: "auto", height:"300px", overflowY:"scroll", border:"grey 1px solid", padding: "10px"})

        const charmList = getCharms(gameState).map(charm => charm.name)
        Object.values(chamberKeyValuePairs()).forEach(async (chamber, num) => {
            chamberDefaults.appendChild(
                await createDropdownCheckboxAndNumberInputWithLabel(
                    `${chamber} Settings`,chamber, Object.values(itemsKeyValuePairs().cheese), charmList, await GM_SuperValue.get(`${chamber} Settings`) || {option1: "Brie String Cheese", option2: "Rift Vacuum Charm", value: 20, checked: false }))
            //async function createDropdownCheckboxAndNumberInputWithLabel(setID, topLevelText, dropdownOption1, dropdownOption2, defaultObject){
        })

        const chamberDefaultsHeader = document.createElement("div")
        chamberDefaultsHeader.textContent = "Choose Default Cheese for each chamber. Bot will not enter chamber if minimum cheese is not met. Tick the checkbox to enable quantum pocketwatch if available."
        css(chamberDefaultsHeader, {fontWeight: 'bold', color: 'inherit'})
        chamberDefaultsHeader.appendChild(chamberDefaults)
        userSettings.appendChild(chamberDefaultsHeader)
        const hr2 = document.createElement("hr")
        css(hr2, {width: '80%'})
        userSettings.appendChild(hr2)
        // Create mics settings section.

        const miscSettingsHeader = document.createElement("div")
        miscSettingsHeader.textContent = "Misc Settings"
        userSettings.appendChild(miscSettingsHeader)

        const miscSettingsContainer = document.createElement("div")
        miscSettingsHeader.appendChild(miscSettingsContainer)
        css(miscSettingsContainer, {display: 'grid', gridColumnTemplate: 'auto auto auto'})
        miscSettingsContainer.appendChild(await createCheckboxWithLabel('runBristleWoodRiftBot', "Run Bot", true))
        await GM_SuperValue.get("runBristleWoodRiftBot", "undefined") === "undefined" || await GM_SuperValue.set("runBristleWoodRiftBot", true)
        miscSettingsContainer.appendChild(await createCheckboxWithLabel('autoAcolyteQuartz', "Turn off Quartz when Obelisk is charged", true))
        miscSettingsContainer.appendChild(await createCheckboxWithLabel('bristleWoodsRiftRerollCurses', "Always reroll portals to remove debuffs", false))
        miscSettingsContainer.appendChild(await createDropdown("Choose charm after oblisk is filled", 'fullObeliskCharm', charmList, "Rift Vacuum Charm"))
        miscSettingsContainer.appendChild(await createDropdown('Fallback Charm','BristleWoodsRiftfallbackCharm', charmList, "Rift Vacuum Charm"))
        miscSettingsContainer.appendChild(await createDropdown('Fallback Cheese','BristleWoodsRiftfallbackCheese', Object.values(itemsKeyValuePairs().cheese)), "Brie String Cheese")

        const minDustCount = await createInput('minDustCount', 'number', 'Minimum Dust before entering Acolyte Chamber', 45)
        miscSettingsContainer.appendChild(minDustCount)
        const hudLocationContent = document.querySelector("#hudLocationContent")
        hudLocationContent.insertBefore(userSettings, hudLocationContent.firstChild)
        hudLocationContent.insertBefore(settingsToggle, hudLocationContent.firstChild)
    }
}
function allKeyValuePairs(){
    return {
        ...chamberKeyValuePairs(),
        ...itemsKeyValuePairs(),
    }
}
function chamberKeyValuePairs(){
    return {
        acolyte_chamber: "Acolyte Chamber",
        basic_chamber: "Gearworks",
        entrance_chamber: "Enter Tower",
        guard_chamber: "Guard Barracks",
        icebreak_chamber: "Furnace Room",
        icy_chamber: "Frozen Alcove",
        ingress_chamber: "Ingress Chamber",
        lucky_chamber: "Lucky Tower",
        magic_chamber: "Runic Laboratory",
        potion_chamber: "Ancient Lab",
        silence_chamber: "Security Chamber",
        stalker_chamber: "Pursuer Mousoleum",
        timewarp_chamber: "Timewarp Chamber",
        treasury_chamber: "Hidden Treasury",
    }
}
function chamberList(){
    return ["Acolyte Chamber", "Gearworks", "Enter Tower", "Guard Barracks", "Furnace Room", "Frozen Alcove", "Ingress Chamber", "Lucky Tower", "Runic Laboratory", "Ancient Lab", "Security Chamber", "Pursuer Mousoleum", "Timewarp Chamber", "Hidden Treasury"]
}
function chamberID(){
    return ["acolyte_chamber", "basic_chamber", "entrance_chamber", "guard_chamber", "icebreak_chamber", "icy_chamber", "ingress_chamber", "lucky_chamber", "magic_chamber", "potion_chamber", "silence_chamber", "stalker_chamber", "timewarp_chamber", "treasury_chamber"]
}
function nameToID(name){
    const allItemsObject = allKeyValuePairs()
    return Object.keys(allItemsObject).find(key => allItemsObject[key] === name);
}
function getCharms(gameObject){
    const allItems = Array.from(gameObject.components)
    const charmsArray = allItems.filter(item => item.classification === "trinket")
    const charms = charmsArray.map(item => ({
        item_id: item.item_id,
        name: item.name,
        quantity: item.quantity,
        type: item.type,
        available: item.quantity !== 0
    }))

    return charms
}
function defaultChamberList(){
    return ["Lucky Tower","Hidden Treasury","Security Chamber","Ingress Chamber","Furnace Room","Guard Barracks","Pursuer Mousoleum","Frozen Alcove","Acolyte Chamber","Timewarp Chamber","Runic Laboratory","Ancient Lab","Gearworks","Entrance"]
}
function itemsKeyValuePairs(){
    return {
        cheese: {
            ancient_string_cheese: 'Ancient String Cheese',
            brie_string_cheese: 'Brie String Cheese',
            magical_string_cheese: "Magical String Cheese",
            marble_string_cheese: "Marble String Cheese",
            runic_string_cheese: "Runic String Cheese",
            swiss_string_cheese: "Swiss String Cheese",
        },

        potions: {
            ancient_string_cheese_potion: 'Ancient String Cheese Potion',
            runic_string_cheese_potion: "Runic String Cheese Potion",
        },
        ancient_string_cheese: 'Ancient String Cheese',
        ancient_string_cheese_potion: 'Ancient String Cheese Potion',
        brie_string_cheese: 'Brie String Cheese',
        magical_string_cheese: "Magical String Cheese",
        marble_string_cheese: "Marble String Cheese",
        rift_anti_skele_trinket: "Rift Anti Skele Trinket",
        rift_hourglass_sand_stat_item: "Rift Hourglass Sand Stat Item",
        rift_hourglass_stat_item: "Rift Hourglass Stat Item",
        rift_portal_warmer_stat_item: "Rift Portal Warmer Stat Item",
        rift_quantum_quartz_stat_item: "Rift Quantum Quartz Stat Item",
        rift_scramble_portals_stat_item: "Rift Scramble Portals Stat Item",
        runic_string_cheese: "Runic String Cheese",
        runic_string_cheese_potion: "Runic String Cheese Potion",
        swiss_string_cheese: "Swiss String Cheese",
    }
}

async function checkDisabled(element, checkPeriod, maxFrequency){
    return new Promise((Resolve, Reject) => {
        var intervalCount = 0
        const checkInterval = setInterval(() => {
            if(getComputedStyle(element).display !== "none" || !element){
                if(++intervalCount > maxFrequency) {
                    console.log("Following element's display status did not turn into 'disabled':", element)
                    clearInterval(checkInterval)
                    Reject(false)
                }

            } else {
                clearInterval(checkInterval)
                console.log("Following element's display was turned into 'disabled': ", element)
                Resolve(checkPeriod * intervalCount)
            }
        }, checkPeriod)
        })
}
async function createInput(id, type, labelText, defaultValue){
    const input = document.createElement("input")
    input.type = type
    input.id = id

    // if there are no saved values, give it a default value.
    if(!await GM_SuperValue.get(id) && defaultValue) await GM_SuperValue.set(id, defaultValue)

    if(type === "checkbox") input.checked = await GM_SuperValue.get(id, false)
    if(type === "number") {
        input.valueAsNumber = await GM_SuperValue.get(id)
        input.style.width = "40px"
    }
    else input.textContent = await GM_SuperValue.get(id)

    input.addEventListener("change", async () => {
        await GM_SuperValue.set(id, input.valueAsNumber || input.textContent)
        console.log(id, ": ", await GM_SuperValue.get(id))
    })

    const label = document.createElement("label")
    label.textContent = labelText
    label.htmlFor = id
    css(label, {color: "inherit", userSelect: "none"})

    const container = document.createElement("div")
    container.appendChild(label)
    container.appendChild(input)


    return container
}
async function createDraggable(draggableLabelText, draggableID, draggableContents, defaultOrder){

    // Checks if there's any locally saved value. If there isn't, it to the default order, if it's defined.
    if(!await GM_SuperValue.get(draggableID) && defaultOrder) await GM_SuperValue.set(defaultOrder)

    const container = document.createElement("div")
    const label = document.createElement("label")
    label.htmlFor = draggableID
    label.textContent = draggableLabelText
    css(label, {
        color: "inherit",
        marginRight: "10px",
        fontWeight: "bold",
    })

    const draggableContainer = document.createElement("div")
    const draggableContainerBackground = document.createElement("div")
    draggableContainer.id = draggableID
    css(draggableContainer, {
        color: "inherit",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "fit-content",
        minWidth: "100px",
        gap: "3px",
        paddingTop: "15px",
        paddingBottom: "15px",
        paddingLeft: "7px",
        paddingRight: "7px",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "rgba(0,0,0, 0.3)"
    })


    // Creates the draggable contents, and adds it to a container
    draggableContents.forEach((content) => {
        const draggableContent = document.createElement("p")
        draggableContent.setAttribute('draggable', true)
        draggableContent.textContent = content
        draggableContent.classList.add("draggable")

        css(draggableContent, {
            border: "1px solid grey",
            fontSize: "10px",
            cursor: "move",
            color: "inherit",
            opacity: "1",
            zIndex: "10",
            position: "relative",
            margin: "0px",
            padding: "1.5px",
            userSelect: "none",
        })
        draggableContainer.appendChild(draggableContent)
    })

    // Adds logic for draggable
    const draggables = draggableContainer.querySelectorAll(".draggable")
    draggables.forEach(draggable => {
        draggable.addEventListener("dragstart", (el) => {
            css(el.target, {opacity: "0.4"})
            el.target.classList.add("dragging")
            console.log("element being dragged", el.target)
        })
        draggable.addEventListener("dragend", async (el) => {
            console.log("element dropped", el.target)
            css(el.target, {opacity: "1"})
            el.target.classList.remove("dragging")

            // Update local preferences.
            const preferences = [...draggableContainer.querySelectorAll("p")].map((el) => {
                return el.textContent
            })

            await GM_SuperValue.set(draggableID, preferences)
            console.log(`await GM_SuperValue.get(${draggableID})`, await GM_SuperValue.get(draggableID))
        })
    })

    draggableContainer.addEventListener("dragover", (event) => {
        event.preventDefault()
        const draggable = document.querySelector('.dragging')
        const afterElement = getDragAfterElement(draggableContainer, event.clientX)

        if(afterElement == null){
            draggableContainer.appendChild(draggable)
        } else {
            draggableContainer.insertBefore(draggable, afterElement)
        }
    })

    container.appendChild(label)
    container.appendChild(draggableContainer)
    return container

    function getDragAfterElement(container, x){
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = x - (box.left + box.width / 2)

            if (offset < 0 && offset > closest.offset) {
                return {offselt: offset, element: child}
            } else {
                return closest
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element
    }
}
async function createDropdown(dropdownLabelText, dropdownID, dropdownOptions, defaultSelection){
    const container = document.createElement("div")
    const label = document.createElement("label")
    label.htmlFor = dropdownID
    label.textContent = dropdownLabelText
    label.style.color = "inherit"
    label.style.marginRight = "10px"

    if(!await GM_SuperValue.get(dropdownID) && defaultSelection) await GM_SuperValue.set(dropdownID, defaultSelection)
    const select = document.createElement("select")
    select.id = dropdownID

    dropdownOptions.map(async option => {
        const optionElement = document.createElement("option")
        optionElement.value = option
        optionElement.textContent = option
        select.appendChild(optionElement)
        if(optionElement.value === await GM_SuperValue.get(dropdownID)) optionElement.selected = "selected"
    })

    select.addEventListener("change", async () => {
        await GM_SuperValue.set(dropdownID, select.options[select.selectedIndex].text)
        console.log("GM_SuperValue ", dropdownID,": ", await GM_SuperValue.get(dropdownID))
    })
    container.appendChild(label)
    container.appendChild(select)

    return container
}
async function createCheckboxWithLabel(checkboxID, labelText, defaultCheck){
    if(typeof (await GM_SuperValue.get(checkboxID)) === "undefined" && typeof defaultCheck !== "undefined") await GM_SuperValue.set(checkboxID, defaultCheck)
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = checkboxID
    checkbox.checked = await GM_SuperValue.get(checkboxID)
    checkbox.addEventListener("change",async () => {
        await GM_SuperValue.set(checkboxID, checkbox.checked ? true : false)
        console.log(checkboxID, ": ", await GM_SuperValue.get(checkboxID, false))
    })

    const label = document.createElement("label")
    label.textContent = labelText
    label.htmlFor = checkboxID
    css(label, {color: "inherit", userSelect: "none"})
    label.addEventListener("mouseover", (event) => {
        event.target.style.textDecoration = "underline"
    })
    label.addEventListener("mouseout", (event) => {
        event.target.style.textDecoration = "none"
    })
    const container = document.createElement("div")
    container.appendChild(checkbox)
    container.appendChild(label)

    return container
}
function createCheckboxesWithLabel(setID, labelTexts, labelIDs){
    const topContainer = document.createDocumentFragment()
    labelTexts.forEach(async (text, num) => {
        const container = document.createElement("div")
        const checkbox = document.createElement("input")
        container.appendChild(checkbox)

        checkbox.type = "checkbox"
        checkbox.id = labelIDs[num]
        checkbox.checked = await GM_SuperValue.get(setID) ? (await GM_SuperValue.get(setID))[labelIDs[num]] : false
        checkbox.addEventListener("change",async (event) => {
            const originalValues = await GM_SuperValue.get(setID, {})
            await GM_SuperValue.set(setID, {...originalValues, [labelIDs[num]]: event.target.checked})
            console.log(`${setID}:`, await GM_SuperValue.get(setID))
        })

        const label = document.createElement("label")
        label.textContent = text
        label.htmlFor = labelIDs[num]
        css(label, {color: "inherit"})
        container.appendChild(label)
        label.addEventListener("mouseover", (event) => {
            event.target.style.textDecoration = "underline"
        })
        label.addEventListener("mouseout", (event) => {
            event.target.style.textDecoration = "none"
        })

        topContainer.appendChild(container)
    })

    return topContainer
}
async function createDropdownCheckboxAndNumberInputWithLabel(setID, topLevelText, dropdownOption1, dropdownOption2, defaultObject){

    if(typeof await GM_SuperValue.get(setID) === "undefined" && defaultObject) await GM_SuperValue.set(setID, defaultObject)

    const label = document.createElement("label")
    label.textContent = topLevelText
    label.htmlFor = setID
    css(label, {color: "inherit", userSelect: "none", display:"inline-block", fontWeight:'normal'})

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    const tempVar = await GM_SuperValue.get(setID)

    checkbox.checked = (await GM_SuperValue.get(setID)).checked
    checkbox.addEventListener("change", async () => {
        await GM_SuperValue.set(setID, {
            ...await GM_SuperValue.get(setID),
            checked: checkbox.checked ? true : false
        })
        console.log(setID, ": ", await GM_SuperValue.get(setID))
    })

    const select = document.createElement("select")
    css(select, {display: 'inline-block'})

    dropdownOption1.map(async option => {
        const optionElement = document.createElement("option")
        optionElement.value = option
        optionElement.textContent = option
        select.appendChild(optionElement)
        if(await GM_SuperValue.get(setID))
        {
            if(optionElement.value === (await GM_SuperValue.get(setID)).option1) optionElement.selected = "selected"
        }
    })

    select.addEventListener("change",async (event) => {
        const prevValue = await GM_SuperValue.get(setID, {option1:"", option2: "", value: 0, checked: false})
        await GM_SuperValue.set(setID, {
            ...prevValue,
            option1: select.options[select.selectedIndex].text})
        console.log(`GM_SuperValue ${setID}`, await GM_SuperValue.get(setID))
    })

    const numTextbox = document.createElement("input")
    numTextbox.setAttribute('type', 'number')
    numTextbox.valueAsNumber = await GM_SuperValue.get(setID) ? (await GM_SuperValue.get(setID)).value : 0
    numTextbox.addEventListener("change", async (event) => {
        const prevValue = await GM_SuperValue.get(setID, {option1:"", option2: "", value: 0, checked: false})
        await GM_SuperValue.set(setID, {
            ...prevValue,
            value: parseInt(event.target.valueAsNumber)
        })
        console.log(`GM_SuperValue ${setID}`, await GM_SuperValue.get(setID))
    })
    css(numTextbox, {width: "3em", fontSize: "11px"})

    let select2 = ""
    if(dropdownOption2){
        select2 = document.createElement("select")
        css(select2, {display: 'inline-block'})

        dropdownOption2.map(async option => {
            const optionElement = document.createElement("option")
            optionElement.value = option
            optionElement.textContent = option
            select2.appendChild(optionElement)
            if(await GM_SuperValue.get(setID))
            {
                if(option === (await GM_SuperValue.get(setID)).option2) optionElement.selected = "selected"
            }
        })

        select2.addEventListener("change", async (event) => {
            const prevValue = await GM_SuperValue.get(setID, {option1:"", option2: "", value: 0, checked: false})
            await GM_SuperValue.set(setID, {
                ...prevValue,
                option2: select2.options[select2.selectedIndex].text})
            console.log(`GM_SuperValue ${setID}`, await GM_SuperValue.get(setID))
        })

    }
    const container = document.createElement("div")
    const dropdownAndTextboxContainer = document.createElement("div")
    css(dropdownAndTextboxContainer, {display: "flex", flexDirection: "row", gap: "5px", height: 'fit-content', })
    container.appendChild(label)
    container.appendChild(dropdownAndTextboxContainer)
    dropdownAndTextboxContainer.appendChild(checkbox)
    dropdownAndTextboxContainer.appendChild(select)
    dropdownAndTextboxContainer.appendChild(numTextbox)
    dropdownOption2 && dropdownAndTextboxContainer.appendChild(select2)

    css(container, {display: "grid", gridTemplateColumns:"180px auto", gap: "20px", padding: "5px", backgroundColor: "rgba(0,0,0,0.3)", borderRadius:"3px"})
    return container
}
function css(element, style) {
    for (const property in style) {
        element.style[property] = style[property];
    }
}
function clamp(num, min, max){
    return Math.min(Math.max(num, min), max);
}
