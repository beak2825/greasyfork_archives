// ==UserScript==
// @name         Mousehunt - Auto Golem Sender
// @namespace    https://greasyfork.org/en/scripts/483809-mousehunt-auto-golem-sender
// @version      1.0
// @author       Nicholas Kam
// @description  To practice Javascript using TamperMonkey
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM.setValue
// @grant    GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/483809/Mousehunt%20-%20Auto%20Golem%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/483809/Mousehunt%20-%20Auto%20Golem%20Sender.meta.js
// ==/UserScript==

(async function() {

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {

        // Runs this section every time the browser updates.
        this.addEventListener("load", async function () {
            try {
                // Checks if user is in Winter Hunt locations, based on if golems exists.
                if(checkIfWinterHuntLocation()){
                    // Inject html elements to MH HUD
                    const htmlElement = await createUserSettingHTMLElement()
                    const winterHunt = document.querySelector(".headsUpDisplayWinterHuntRegionView")
                    var isClicking = false
                    var waitingPeriod = 0
                    var waitingPeriodInterval

                    if(await GM_SuperValue.get("runAutoGolem", false)){
                        // Looks for any golems to claim, and claim all of them, if any.
                        const golemsComplete = completedGolems(winterHunt)
                        if (golemsComplete.length !== 0){
                            // Attempts to claim the golems, one at a time. If any of the golems take too long to claim, throw an error and reload the page after 10 seconds
                            await claimGolems(golemsComplete)
                                .then(() => console.log("Golem claiming successful"),
                                      async (value) => {
                                console.log("claiming of golems failed. Refreshing page in 20 seconds")
                                setTimeout(() => document.location.reload(), 20000)
                                throw "claiming of golems failed. Refreshing page in 20 seconds"
                            })
                        }
                        // If there are no golems to be claimed, check if there's any golem idling.
                        var golemIdle = idleGolems(winterHunt)

                        if(idleGolems(winterHunt).length > 0 || golemsNeedParts(winterHunt).length > 0){
                            console.log(`${idleGolems(winterHunt).length} golems idling.`)
                            // If there are any idling, check if there's enough resource to send the first golem.
                            if(getGolemResources().totalGolems < 1){

                                // If there aren't enough parts to send one golem, check if the "automatically covert resources". If it isn't checked, no further actions is done.
                                if(await !GM_SuperValue.get("autoResourceConvertion", false)){
                                    console.log("Not enough parts! Enable part convertion, or convert some parts then refresh this page!")
                                    return
                                } else {
                                    // If there aren't enough parts to make a new golem, console log it, and no further action is done.
                                    if(!getGolemResources().enoughSnow){
                                        console.log("Not enough animated snow for any more golems. Get more animated snow or parts!")
                                        return
                                    } else {
                                        // If there are enough parts to make a golem, convert enough to make one golem.
                                        console.log("Attempting to convert Animated Snow to parts.")
                                        await convertResourcesOneGolem()

                                        // Set a timer for 20 seconds to allow the resources convertion to occur. If the resources aren't converted in time, refresh the page.
                                        waitingPeriodInterval = setInterval(() => {
                                            waitingPeriod++
                                            if(waitingPeriod > 20) document.location.reload()
                                        }, 1000)

                                        clearInterval(waitingPeriodInterval)
                                        waitingPeriod = 0
                                    }
                                }
                            }

                            // If there are enough parts, check if "Enable default locations" is checked. If it isn't, just send the "first" golem.
                            // If "Enable default locations" is checked, check if there's enough bonuses stated and  send the golems as per the locations chosen
                            // If there's no bonuses, just send the golems as per the second option, with the bonuses stated.
                            idleGolems(winterHunt)[0] && sendGolem(idleGolems(winterHunt)[0])
                        }

                    }
                }
            } catch(err){
                console.log(err)
            }
        })
        originalOpen.apply(this, arguments);
    }

})();

function getGolemStatuses(){
    return checkGolemStatus(getGolems())
}

function getGolems(){
    const golems = []
    // Loops through all 3 golems and looks for the click button.
    for (let golemNumber = 0; golemNumber < 3; golemNumber++){
        let currentGolem = document.querySelector(`.headsUpDisplayWinterHuntRegionView__golem[data-slot="${golemNumber}"]`)
        golems.push(currentGolem)
    }
    return golems
}

function checkGolemStatus(golems){
    const golemStatus = Array(3)

    // Looks for the "completed", "idle", "no parts" and "Active" and check if the displays are active (or not "none").
    for(let golemNumber = 0; golemNumber < 3; golemNumber++){

        if(isCompleted(golems[golemNumber])){
            golemStatus[golemNumber] = "completed"
        }

        if(isIdle(golems[golemNumber])){
            golemStatus[golemNumber] = "idle"
        }

        if(isExploring(golems[golemNumber])){
            golemStatus[golemNumber] = "exploring"
        }

        if(isNeedsParts(golems[golemNumber])){
            golemStatus[golemNumber] = "needsParts"
        }
    }

    console.log(`Golem Status is: `, golemStatus)
    return golemStatus
}

function getGolemResources(){
    const golemResourcesContainer = document.querySelector(".headsUpDisplayWinterHuntRegionView__golemPartContainer")

    console.log("golemResourcesContainer: ", golemResourcesContainer)
    const head = parseInt(golemResourcesContainer.querySelector('.quantity[data-item-type="golem_part_head_stat_item"]').innerHTML)
    const torso = parseInt(golemResourcesContainer.querySelector('.quantity[data-item-type="golem_part_torso_stat_item"]').innerHTML)
    const limb = parseInt(golemResourcesContainer.querySelector('.quantity[data-item-type="golem_part_limb_stat_item"]').innerHTML)
    const animatedSnow = parseInt(golemResourcesContainer.querySelector('.quantity[data-item-type="animate_snow_stat_item"]').innerHTML)
    const hat = parseInt(document.querySelector('.headsUpDisplayWinterHuntRegionView__golemBuffQuantity[data-item-type="golem_magical_hat_stat_item"]').textContent)
    const scarf = parseInt(document.querySelector('.headsUpDisplayWinterHuntRegionView__golemBuffQuantity[data-item-type="golden_scarf_stat_item"]').textContent)

    const totalGolems = Math.min(head, torso, limb/4)
    const animatedSnowRequiredForConversion = Math.max(1 - head, 0) * 20 + Math.max(1 - torso, 0) * 20 + Math.max(4 - limb, 0) * 10
    return {
        head: head,
        torso: torso,
        limb: limb,
        animatedSnow: animatedSnow,
        totalGolems: totalGolems,
        enoughSnow: animatedSnow >= animatedSnowRequiredForConversion,
        hat: hat,
        scarf: scarf
    }
}
function isCompleted(golem){

    const element = golem.querySelector(".headsUpDisplayWinterHuntRegionView__golemState--complete")
    const status = getComputedStyle(element).display !== "none"

    return status
}

function completedGolems(winterHuntHud){
    return Array.from(winterHuntHud.querySelectorAll(".headsUpDisplayWinterHuntRegionView__golemState--complete")).filter(golem => {
        return getComputedStyle(golem).display !== "none"
    })
}
function isIdle(golem){

    const element = golem.querySelector(".headsUpDisplayWinterHuntRegionView__golemState--idle")
    const status = getComputedStyle(element).display !== "none"

    return status
}
function idleGolems(winterHuntHud){

    return Array.from(winterHuntHud.querySelectorAll(".headsUpDisplayWinterHuntRegionView__golemState--idle")).filter(golem => {
        return getComputedStyle(golem).display !== "none"
    })
}

function isExploring(golem){

    const element = golem.querySelector(".headsUpDisplayWinterHuntRegionView__golemState--exploring")
    const status = getComputedStyle(element).display !== "none"

    return status
}

function golemsNeedParts(winterHuntHud){
    return Array.from(winterHuntHud.querySelectorAll(".headsUpDisplayWinterHuntRegionView__golemState--needsParts")).filter(golem => (
        getComputedStyle(golem).display !== "none"))
}
function isNeedsParts(golem){

    const element = golem.querySelector(".headsUpDisplayWinterHuntRegionView__golemState--needsParts")
    const status = getComputedStyle(element).display !== "none"

    return status
}

function checkIfWinterHuntLocation(){
    const golemContainer = document.querySelectorAll(".headsUpDisplayWinterHuntRegionView__golemsContainer")
    console.log("Checking for Winter Hunt Location 2023... Winter Hunt is", golemContainer.length !== 0 ? "active" : "inactive", "in this location.")
    return golemContainer.length !== 0
}

async function claimGolems(golems){
    return new Promise((Resolve, Reject) => {
        console.log("claiming golems: ", golems)
        const golemButtons = golems.map((golem) => golem.querySelector("button"))
        golemButtons.forEach(golem => {
            claimGolem(golem)
                .then(() => {
                console.log("claimGolems succeeded")
                Resolve()
            },
                      (value) => {
                console.log(value)
                Reject("claimGolems failed. " + value)
            })
        })
    })
}

function promiseRejectTemplate(errorMessage,reloadPageTimer){
    console.log(errorMessage)
    setTimeout(document.location.reload(), reloadPageTimer)
}
async function claimGolem(golem){
    return new Promise(async (Resolve, Reject) => {
        golem.click()
        const checkPeriod = await checkDisabled(golem, 100, 10)
        .then(() => {
            console.log(`claiming of following golem succeeded. Claiming took less than ${checkPeriod/1000} seconds.`, golem)
            Resolve()
        },
              () => {
            console.log("claiming of following golem failed: ", golem)
            Reject("claimGolem failed. ")
        })
        })
}
async function checkDisabled(element, checkPeriod, maxFrequency){
    return new Promise((Resolve, Reject) => {
        var intervalCount = 0
        const checkInterval = setInterval(() => {
            // Check if the display element is gone. If it is, then incremement.
            if(!(getComputedStyle(element).display == "none" || !document.contains(element))){
                // If the increment value is too high, send error.
                if(++intervalCount > maxFrequency) {
                    console.log("Following element's display status did not turn into 'disabled':", element)
                    clearInterval(checkInterval)
                    Reject(false)
                }

            } else {
                clearInterval(checkInterval)
                Resolve(checkPeriod * intervalCount)
            }
        }, checkPeriod)
        })
}

async function sendGolem(golem){
    // If there are enough parts, check if "Enable default locations" is checked. If it isn't, just send the "first" golem.
    // If "Enable default locations" is checked, check if there's enough bonuses stated and  send the golems as per the locations chosen
    // If there's no bonuses, just send the golems as per the second option, with the bonuses stated.

    console.log("golem: ", golem)
    const golemButton = golem.querySelector("button")
    const golemSlot = golemButton.attributes["data-slot"].value
    const golemName = golemSlot == 0 ? "Left" : golemSlot == 1 ? "Mid" : "Right"
    const golemTargetLocation = await GM_SuperValue.get(`${golemName}GolemDropdown`,"No Change")
    const golemFallbackLocation = await GM_SuperValue.get(`${golemName}NoBonuses`,"Same as above") === "Same as above" ? golemTargetLocation : await GM_SuperValue.get(`${golemName}NoBonuses`,"Same as above")
    const golemHatUse = await GM_SuperValue.get(`${golemName}GolemHat`,false)
    const golemScarfUse = await GM_SuperValue.get(`${golemName}GolemScarf`,false)
    const overrideGolemLocation = await GM_SuperValue.get(`overrideGolemLocation`, false)
    const {hat, scarf} = getGolemResources()
    console.log("hat: ", hat)
    console.log("scarf: ", scarf)
    var timeoutCount = 0
    var timeoutInterval
    var delayingLaunch = true

    // opening up the golem exploration
    const golemCurrLocation = document.querySelector(".greatWinterHuntGolemManagerTabView__destinationName")

    // Opens the Explore page and waits 500ms.
    const openExploration = () => new Promise((Resolve) => {
        golemButton.click()
        setTimeout(() => {
            console.log("Opening Exploration Tab: ", document.querySelector('.greatWinterHuntGolemManagerDialogView__tabHeader[data-tab="explore"]'))
            document.querySelector('.greatWinterHuntGolemManagerDialogView__tabHeader[data-tab="explore"]').click()
            Resolve()
        },2000)
    })

    // Clicks on the "select destination" button, then waits a moment, then selects the target location.
    const selectDestination = (destination) => new Promise((Resolve) => {
        console.log("selectDestination")
        setTimeout(() => {
            console.log("Selecting destination: ", document.querySelector("button.greatWinterHuntGolemManagerLaunchTabView__destinationButton"), "\nTarget Destination: ", destination)
            document.querySelector("button.greatWinterHuntGolemManagerLaunchTabView__destinationButton").click()

            // Checks if the destination needs to be changed. If so, change it to the target destination.
            if (!(destination == "No Change" || golemCurrLocation == destination)){
                console.log(`destination !== "No Change" || golemCurrLocation !== destination`, destination !== "No Change" || golemCurrLocation !== destination)
                setTimeout(async () => {
                    const locationButton = await Array.from(document.querySelectorAll(".greatWinterHuntGolemDestinationView__environment")).filter((location) => {
                        return location.querySelector(".greatWinterHuntGolemDestinationView__environmentName").textContent == destination
                    })
                    console.log(locationButton)
                    locationButton[0].click()
                    Resolve()
                }, 2000)
            } else Resolve()
        }, 2000)
    })

    // Toggle on the bonuses, if required. If any bonuses are toggled, returns "true". else false.
    const toggleBonuses = async () => new Promise((Resolve) => {
        var usedBonus = false
        if(golemHatUse && hat > 0) {
            document.querySelector("button.greatWinterHuntGolemManagerLaunchTabView__toggleHatButton").click()
            usedBonus = true
        }
        if(golemScarfUse && scarf){
            document.querySelector(".greatWinterHuntGolemManagerLaunchTabView__toggleScarfButton").click()
            usedBonus = true
        }
        // if golem scarf or golem hat is used, return true, else false.
        console.log("ToggleBonuses Results: ", usedBonus)
        Resolve(usedBonus)
    })
    const launchExpedition = () => new Promise((Resolve, Reject) => {
        setTimeout(async () => {
            const launchButton = document.querySelector("button.greatWinterHuntGolemManagerLaunchTabView__buildButton")
            launchButton.click()
            await checkDisabled(launchButton, 200, 40).then(() => console.log("Golem launched!"), () => {
                Reject ("Golem failed to launch. Reloading page soon.")
            })

            Resolve()
        }, 2000)
    })

    // If there are enough parts, check if "Enable default locations" is checked. If it isn't, just send the "first" golem.
    // If there's no bonuses, just send the golems as per the second option, with the bonuses stated.

    await openExploration()

    // If "Enable default locations" is not checked, just send the golem and completes the script here.
    console.log("overrideGolemLocation: ", overrideGolemLocation)
    if (!overrideGolemLocation){
        console.log("launching expedition")
        await launchExpedition().then(() => {}, value => {
            throw value
        })
        return true
    }
    console.log("golemTargetLocation: " & await golemTargetLocation)
    console.log("golemFallbackLocation: " & await golemFallbackLocation)
    // Checks if the bonuses are required, and if there are any used select destination using golemTargetLocation.
    // if none are used, then send it to the fallback location.
    if (await toggleBonuses()){
        console.log("checking toggle bonuses")
        await selectDestination(golemTargetLocation)
    } else await selectDestination(golemFallbackLocation)

    // Launching Golem
    await launchExpedition()
    return true
}

async function createUserSettingHTMLElement(){
    const hasUserSettings = document.querySelectorAll("#autoGolemUserSettings")

    if(hasUserSettings.length === 0){

        // userSettings CSS
        const userSettingsCSS = {
            marginLeft: "30px",
            marginTop: "10px",
            marginBottom: "10px",
            color: "White",
            fontSize: "1.25em",
            display: await GM_SuperValue.get("hideGolemSettings", false) ? "none" : "flex",
            flexDirection: "column",
            transition: "700ms ease"
        }

        // Create toggle for hiding golem location settings
        const golemSettingsToggle = await createCheckboxWithLabel("hideGolemSettings", "Hide Golem Settings Visibility")
        css(golemSettingsToggle, {marginLeft:"10px"})
        css(golemSettingsToggle.querySelector("label"), {color: "White",fontSize: "1.25em", fontWeight:"bold", textDecoration:"underline"})
        golemSettingsToggle.querySelector("input").addEventListener("click", async () => {
            const golemSettingsContainer = document.querySelector("#autoGolemUserSettings")
            await GM_SuperValue.get("hideGolemSettings", false) ? css(golemSettingsContainer, {...userSettingsCSS, display: "flex"}) : css(golemSettingsContainer, {...userSettingsCSS, display:"none" })
        })



        const hudLocationContent = document.querySelector("#hudLocationContent")
        const userSettings = document.createElement("div")

        // Top level container for all settings
        userSettings.id = "autoGolemUserSettings"
        css(userSettings, userSettingsCSS)

        const runAutoGolem = await createCheckboxWithLabel("runAutoGolem","Automatically Send Golems")
        const autoResourceConvertion = await createCheckboxWithLabel("autoResourceConvertion", "Automatically Convert Resources")

        // Add default hunting locations for each golem
        const golemLocationSettingsTopContainer = document.createElement("div")
        css(golemLocationSettingsTopContainer, {display: "flex", flexDirection: "column"})
        const golemLocationCheckboxContainer = await createCheckboxWithLabel("overrideGolemLocation", "Enable Golem Default Locations")

        // Hides the extra settings if no changes to golem locations is planned
        golemLocationSettingsTopContainer.appendChild(golemLocationCheckboxContainer)
        golemLocationCheckboxContainer.querySelector("input").addEventListener("change", async () => {
            await GM_SuperValue.set("overrideGolemLocation", golemLocationCheckboxContainer.querySelector("input").checked? true: false)
            document.querySelector("#golemLocationSettings").style.display = await GM_SuperValue.get("overrideGolemLocation", false) ? "flex" : "none"
        })

        // Individual Golem's location settings
        const golemLocationSettingsContainer = document.createElement("div")
        golemLocationSettingsTopContainer.appendChild(golemLocationSettingsContainer)
        golemLocationSettingsContainer.id = "golemLocationSettings"
        css(golemLocationSettingsContainer, {display: "flex", flexDirection: "row"})
        golemLocationSettingsContainer.style.display = await GM_SuperValue.get("overrideGolemLocation", false) ? "flex" : "none"

        // Each golem has a golem position, dropdown for next location, "use hat" and "use scarf" button

        const leftGolemLocationSettingsContainer = await createGolemLocationSettingsHTML("Left")
        const midGolemLocationSettingsContainer = await createGolemLocationSettingsHTML("Mid")
        const rightGolemLocationSettingsContainer = await createGolemLocationSettingsHTML("Right")
        golemLocationSettingsContainer.appendChild(leftGolemLocationSettingsContainer)
        golemLocationSettingsContainer.appendChild(midGolemLocationSettingsContainer)
        golemLocationSettingsContainer.appendChild(rightGolemLocationSettingsContainer)

        userSettings.appendChild(runAutoGolem)
        userSettings.appendChild(autoResourceConvertion)
        userSettings.appendChild(golemLocationSettingsTopContainer)
        hudLocationContent.insertBefore(userSettings, hudLocationContent.firstChild)
        hudLocationContent.insertBefore(golemSettingsToggle, hudLocationContent.firstChild)
    }
}
async function createGolemLocationSettingsHTML(golemName){

    const golemLocationSettingsContainer = document.createElement("div")
    const golemHeader = document.createElement("span")
    golemLocationSettingsContainer.appendChild(golemHeader)
    golemHeader.textContent = `${golemName} Golem Location`
    css(golemHeader, {color: "inherit", fontWeight: "bold", marginTop: "auto", marginBottom:"auto"})
    const golemDropdown = await createDropdown(`visit with scarf and/or hats`, `${golemName}GolemDropdown`, ["No Change", ...mhLocations()])
    golemLocationSettingsContainer.appendChild(golemDropdown)
    const golemUseHat = await createCheckboxWithLabel(`${golemName}GolemHat`, "Send with hat")
    const golemUseScarf = await createCheckboxWithLabel(`${golemName}GolemScarf`, "Send with scarf")
    const golemLocationIfNoBonus = await createDropdown(`visit when without hats/scarf`, `${golemName}NoBonuses`, ["Same as above", ...mhLocations()])

    golemLocationSettingsContainer.appendChild(golemUseHat)
    golemLocationSettingsContainer.appendChild(golemUseScarf)
    golemLocationSettingsContainer.appendChild(golemLocationIfNoBonus)


    return golemLocationSettingsContainer
}
function createDropdown(dropdownLabelText, dropdownID, dropdownOptions){
    const container = document.createElement("div")
    const label = document.createElement("label")
    label.htmlFor = dropdownID
    label.textContent = dropdownLabelText
    label.style.color = "inherit"
    label.style.marginRight = "10px"

    const select = document.createElement("select")

    dropdownOptions.map(async option => {
        const optionElement = document.createElement("option")
        optionElement.value = option
        optionElement.textContent = option
        select.appendChild(optionElement)
        if(optionElement.value === await GM_SuperValue.get(dropdownID)) optionElement.selected = "selected"
    })

    select.addEventListener("change", async () => {
        console.log(select.options[select.selectedIndex].text)
        await GM_SuperValue.set(dropdownID, select.options[select.selectedIndex].text)
        console.log("GM_SuperValue ", dropdownID,": ", await GM_SuperValue.get(dropdownID))
    })
    container.appendChild(label)
    container.appendChild(select)

    return container
}

function mhLocations(){
    return [
        // Gnawnia
        "Meadow",
        "Town of Gnawnia",
        "Windmill",
        "Harbour",
        "Mountain",
        // Great Winter Taiga
        //"Cinnamon Hill",
        //"Golem Workshop",
        //"Ice Fortress",
        // Valour
        "King's Arms",
        "Tournament Hall",
        "King's Gauntlet",
        // Whisker Woods
        "Calm Clearing",
        "Great Gnarled Tree",
        "Lagoon",
        // Burroughs
        "Laboratory",
        "Mousoleum",
        "Town of Digby",
        "Bazaar",
        "Toxic Spill",
        // Furoma
        "Training Grounds",
        "Dojo",
        "Meditation Room",
        "Pinnacle Chamber",
        // Bristle Woods
        "Catacombs",
        "Forbidden Grove",
        "Acolyte Realm",
        // Tribal Isles
        "Cape Clawed",
        "Elub Shore",
        "Nerg Plains",
        "Derr Dunes",
        "Jungle of Dread",
        "Dracano",
        "Balack's Cove",
        // Varmint Valley
        "Claw Shot City",
        "Gnawnian Express Station",
        "Fort Rox",
        // Sandtail Desert
        "Fiery Warpath",
        "Muridae Market",
        "Living Garden",
        "Lost City",
        "Sand Dunes",
        // Rodentia
        "S.S. Huntington IV",
        "Seasonal Garden",
        "Zugzwang's Tower",
        "Crystal Library",
        "Slushy Shoreline",
        "Iceberg",
        "Sunken City",
        // Queso Canyon
        "Queso River",
        "Prickly Plains",
        "Cantera Quarry",
        "Queso Geyser",
        // Hollow Heights
        "Fungal Cavern",
        "Labyrinth",
        "Zokor",
        "Moussu Picchu",
        "Floating Islands",
        // Folklore Forest
        "Foreword Farm",
        "Prologue Pond",
        "Table of Contents",
        "Bountiful Beanstalk",
        // Rift Plane
        "Gnawnia Rift",
        "Burroughs Rift",
        "Whisker Woods Rift",
        "Furoma Rift",
        "Bristle Woods Rift",
        "Valour Rift"
    ]
}
async function createCheckboxWithLabel(checkboxID, labelText){
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = checkboxID
    checkbox.checked = await GM_SuperValue.get(checkboxID, false)
    checkbox.addEventListener("change", async () => {
        await GM_SuperValue.set(checkboxID, checkbox.checked ? true : false)
        console.log(checkboxID, ": ", await GM_SuperValue.get(checkboxID, false))
    })

    const label = document.createElement("label")
    label.textContent = labelText
    label.htmlFor = checkboxID
    css(label, {color: "inherit", userSelect: "none"})

    const container = document.createElement("div")
    container.appendChild(checkbox)
    container.appendChild(label)

    return container
}

function convertResourcesOneGolem(){

    return new Promise(async (Resolve, Reject) => {
        const numGolems = 1
        const currGolemResource = getGolemResources()
        const animateSnowButton = document.querySelector('[data-item-type="animate_snow_stat_item"]')

        let golemHeadCount = 0
        let golemTorsoCount = 0
        let golemLimbCount = 0
        let convertionCount = 0
        let golemHeadInterval
        let golemTorsoInterval
        let golemLimbInterval


        // Calaculating requirements
        const convertHeadNum = Math.max(numGolems - currGolemResource.head, 0)
        const convertTorsoNum = Math.max(numGolems - currGolemResource.torso, 0)
        const convertLimbNum = Math.max(numGolems * 4 - currGolemResource.limb, 0)

        // Calculating required snow, and console logging notes if there aren't enough snow.
        const snowRequired = convertHeadNum * 20 + convertTorsoNum * 20 + convertLimbNum * 10
        const snowDeficit = snowRequired - currGolemResource.animatedSnow
        const singleGolemSnowReq = Math.min(convertHeadNum, 1) * 20 + Math.min(convertTorsoNum, 1) * 20 + ((convertLimbNum - 1) % 4 + 1) * 10
        const twoGolemSnowReq = Math.min(convertHeadNum, 2) * 20 + Math.min(convertTorsoNum, 2) * 20 + clamp(convertLimbNum, 0,8) * 10
        console.log("animateSnowButton: ", animateSnowButton)

        const convertParts = (golemButton, currentAmountElement, target) => new Promise(async (Resolve, Reject) => {
            var numChecks = 0
            console.log("parseInt(currentAmountElement.textContent) < target", currentAmountElement)
            if (parseInt(currentAmountElement.textContent) < target){

                golemButton.click()
                console.log("converting part by clicking: ", golemButton)
                // Checks if the part is converted for a few seconds. Throws an error if it isn't.
                const checkConverted = setInterval(() => {
                    if(!golemButton.classList.contains("busy")){
                        console.log(`Part bought. Took ${numChecks * 0.1} seconds`)
                        clearInterval(checkConverted)
                        Resolve()
                    } else if(numChecks++ > 70){
                        Reject(`Part failed to convert within ${numChecks * 0.1} seconds`)
                    }
                } , 100)
                }
        })

        if(await GM_SuperValue.get("autoResourceConvertion", false)){
            console.log("Opening convertion menu: ", animateSnowButton)
            animateSnowButton.click()
            snowDeficit > 0 && console.log(`Not enough snow for ${currGolemResource.animatedSnow >= singleGolemSnowReq ? "any" : "all"} of the golems. ${snowDeficit} more Animated Snows required to complete all golems. `)

            // Set a slight delay before doing convertions
            if(convertHeadNum){
                console.log("Converting head")
                const golemHeadButton = document.querySelector('.greatWinterHuntRecycleDialogView__craftButton[data-item-type="golem_part_head_stat_item"]')
                const golemHeadCurrAmount = document.querySelector(`.greatWinterHuntRecycleDialogView__itemQuantity[data-item-type="golem_part_head_stat_item"]`)
                await convertParts(golemHeadButton, golemHeadCurrAmount, 1)
            }

            if(convertTorsoNum){
                console.log("Converting torso")
                const golemTorsoButton = document.querySelector('.greatWinterHuntRecycleDialogView__craftButton[data-item-type="golem_part_torso_stat_item"]')
                const golemTorsoCurrAmount = document.querySelector(`.greatWinterHuntRecycleDialogView__itemQuantity[data-item-type="golem_part_torso_stat_item"]`)
                await convertParts(golemTorsoButton, golemTorsoCurrAmount, 1)
            }

            if(convertLimbNum){
                console.log("Converting limbs")
                const golemLimbButton = document.querySelector('.greatWinterHuntRecycleDialogView__craftButton[data-item-type="golem_part_limb_stat_item"]')
                const golemLimbCurrAmount = document.querySelector(`.greatWinterHuntRecycleDialogView__itemQuantity[data-item-type="golem_part_limb_stat_item"]`)
                await convertParts(golemLimbButton, golemLimbCurrAmount, 4)
            }
        }
        Resolve()
    })
}

function css(element, style) {
    for (const property in style) {
        element.style[property] = style[property];
    }
}

function clamp(num, min, max){
    return Math.min(Math.max(num, min), max);
}

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