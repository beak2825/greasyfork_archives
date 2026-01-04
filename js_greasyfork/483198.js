

    // ==UserScript==
    // @name         VaporDEX++
    // @namespace    http://tampermonkey.net/
    // @version      0.2.0.3
    // @description  Extra information, notifications for important events, and other enhancements!
    // @author       theimperious1
    // @match        *://app.vapordex.io/*
    // @grant        GM_notification
    // @grant        GM.xmlHttpRequest
    // @require      https://code.jquery.com/jquery-3.7.1.min.js
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483198/VaporDEX%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/483198/VaporDEX%2B%2B.meta.js
    // ==/UserScript==

    // TODO: Add backend server. Backend server should handle browser notification tokens allowing for notifications on all connected browsers. e.g Desktop and Mobile Firefox/w.e should be pinged simultaniously. // this is unfortunately impossible due to technical restrictions of userscripts+extensions
    // TODO: Add version endpoint on backend to notify end user of new version releases - **is this needed? apparently tampermonkey auto updates users?**
    // TODO: Add backend VaporDEX API call /api/v1/announcements. If they don't add the endpoint, remove it later. *crying face*
    // TODO: Daily USDC vape mining rewards.
    var boostEnhancementTimer = setInterval(enhanceBoost, 500)
    var moddedData = {}
    var moddedUIData = {}
    var moddedUIElements = []

    document.moddingPlatformErrorsEnabled = false;

    function enhanceBoost() {

        if (location.pathname != "/earn/vape") {
            return;
        }

        try {
            var vpndDepositedText = document.getElementsByClassName("text-light text-lg font-semibold")[0].innerText
            var isBoostOpen = document.getElementsByClassName("text-light text-sm font-normal")[4].innerText == "Boost amount" || document.getElementsByClassName("text-light text-sm font-normal")[6].innerText == "Boost amount"

            moddedData.totalVapeSeasonRewards = Number(document.getElementsByClassName("text-turquoise-500 text-base font-semibold")[3].innerText.replaceAll(" ", "").replaceAll(",", "").replace("VAPE", ""))
            moddedData.totalVpndDeposited = Number(document.getElementsByClassName("text-turquoise-500 text-base font-semibold")[4].innerText.replaceAll(" ", "").replaceAll(",", "").replace("VPND", ""))
            moddedData.myVpndDeposited = Number(vpndDepositedText.substring(0, vpndDepositedText.indexOf(" ")).replaceAll(",", ""))
            moddedData.currentPotentialVape = moddedData.totalVapeSeasonRewards / (moddedData.totalVpndDeposited / moddedData.myVpndDeposited)

            if (isBoostOpen) {
                var boostContainerClassItemLength = document.getElementsByClassName("box-border outline-none flex justify-between").length
                var isFreeBoost = boostContainerClassItemLength == 20 || boostContainerClassItemLength >= 25

                var boostPoints = Number(document.getElementsByClassName("text-light text-sm font-normal")[!isFreeBoost ? 5 : 7].innerText.replace(" points", ""))
                moddedData.effectiveBoostInVpnd = boostPoints / 31
                moddedData.effectiveVpndAfterBoost = moddedData.myVpndDeposited + moddedData.effectiveBoostInVpnd
                // console.log(`Effective VPND after boost: ${moddedData.effectiveVpndAfterBoost}`)
                moddedData.vpndPrice = Number(document.getElementsByClassName("text-turquoise-500 text-base font-semibold")[5].innerText.replace(" USDC", ""))
                moddedData.boostInVpndUSDCValue = moddedData.effectiveBoostInVpnd * moddedData.vpndPrice
                moddedData.potentialVapeAfterBoost = moddedData.totalVapeSeasonRewards / (moddedData.totalVpndDeposited / moddedData.effectiveBoostInVpnd)
                // console.log(`Boost in VPND's USDC Value: ${moddedData.boostInVpndUSDCValue}`)
                // console.log(`Approximate VAPE gained from boost: ${moddedData.potentialVapeAfterBoost}`)
                // console.log(`Approximate VAPE rewards without boost: ${moddedData.currentPotentialVape}`)

                moddedUIData.effectiveVpndAfterBoost = {
                    descriptor: "Effective VPND after boost:",
                    value: moddedData.effectiveVpndAfterBoost
                }
                moddedUIData.boostInVpndUSDCValue = {
                    descriptor: "Boost in VPND's USD Value:",
                    value: moddedData.boostInVpndUSDCValue
                }
                moddedUIData.potentialVapeAfterBoost = {
                    descriptor: "VAPE gained w boost:",
                    value: moddedData.potentialVapeAfterBoost
                }
                moddedUIData.currentPotentialVape = {
                    descriptor: "VAPE rewards w/o boost:",
                    value: moddedData.currentPotentialVape
                }

                var boostContainer = document.getElementsByClassName("box-border outline-none flex flex-col w-full gap-4")[0]

                if (document.getElementsByClassName("box-border outline-none flex justify-between").length > 20) {
                    var i = 0
                    console.log(moddedUIData)
                    for (var key in moddedUIData) {
                        let uiData = moddedUIData[key]
                        moddedUIElements[i].childNodes.forEach(($element, $index) => {
                            // This isn't very efficient. It's constantly updating .innerText on these two elements.
                            // The problem with fixing it is just refactoring. With this current loop mechanic, I can't fix it without descriptor still being updated continuously.
                            if ($index == 0) {
                                $element.innerText = uiData.descriptor
                            } else {
                                $element.innerText = uiData.value.toFixed(5)
                            }
                        })
                        i++
                    }
                    return
                } else {

                    for (var key in moddedUIData) { // eslint-disable-line no-redeclare
                        var moddedElementContainer = document.getElementsByClassName("box-border outline-none flex justify-between")[5].cloneNode()
                        var moddedElementDescriptor = document.getElementsByClassName("box-border outline-none flex justify-between")[5].childNodes[0].cloneNode()
                        var moddedElementValue = document.getElementsByClassName("box-border outline-none flex justify-between")[5].childNodes[1].cloneNode()
                        var uiData = moddedUIData[key]
                        moddedElementDescriptor.innerText = uiData.descriptor
                        moddedElementValue.innerText = uiData.value.toFixed(5)
                        moddedElementContainer.appendChild(moddedElementDescriptor)
                        moddedElementContainer.appendChild(moddedElementValue)
                        boostContainer.appendChild(moddedElementContainer)
                        moddedUIElements.push(moddedElementContainer)
                        console.log(uiData)
                    }
                }
            }
        } catch ($ex) {
            if (!document.moddingPlatformErrorsEnabled) {
                return
            }
            console.log($ex)
        }
    }

    if (localStorage.getItem("boostScriptWalletAddress") == undefined) {
        const ready = prompt("Welcome to the VaporDEX++ Boost Notifications setup!", "Would you like to setup Boost Notifications for Liquid Mining? If you don't want this feature, type exit. Otherwise, you will need your wallet address copied and ready. If you are ready, type yes. If not, type no. If you say no, you'll be prompted again once you refresh VaporDEX.")
        if (ready.toLowerCase() == "yes") {
            const walletAddress = prompt("Enter the wallet address that you use for Liquid Mining on VaporDEX. It's used to fetch your wallet on Snowtrace.io to keep track of when your last boost was claimed. Ensure there are no spaces or otherwise unintended characters.")
            if (!walletAddress.startsWith("0x") || walletAddress.length != 42) {
                alert("The wallet address you entered is formatted incorrectly, or generally incorrect. A valid address begins with 0x and is no shorter or longer than 42 characters.")
                location.reload();
            }
            const correct = prompt(`Your wallet address is \"${walletAddress}\". Is this correct? Type yes or no.`) == 'yes'
            if (!correct) {
                alert("The page will now refresh to restart the setup process.")
                location.reload();
            } else {
                localStorage.setItem('boostScriptWalletAddress', walletAddress)
            }
        } else {
            alert("The page will now refresh to restart the setup process.")
            location.reload()
        }
    }


    var checkTimer = setInterval(boostCheck, 3600000) // 1 hour in milliseconds
    var contractId = "0xAe950fdd0CC79DDE64d3Fffd40fabec3f7ba368B"

    function boostCheck() {
        var boostScriptWalletAddress = localStorage.getItem("boostScriptWalletAddress")

        GM.xmlHttpRequest({
            method: "GET",
            url: `https://snowtrace.io/api/evm/all/transactions?count=true&ecosystem=avalanche&fromAddresses=${boostScriptWalletAddress}&limit=100&sort=desc&toAddresses=${boostScriptWalletAddress}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:121.0) Gecko/20100101 Firefox/121.0',
                'DNT': '1',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            onload: function(response) {
                try {
                    var data = JSON.parse(response.responseText)
                    var items = data.items
                    var now = new Date().getTime() / 1000
                    for (var i = 0; i < items.length; i++) {
                        var lastNotificationTs = localStorage.getItem("lastNotificationTs")
                        var clickedLastNotification = localStorage.getItem("clickedLastNotification")
                        var item = items[i]

                        if (item.to.id == contractId && item.hasOwnProperty("methodId") && item.methodId == "0x502d2967") { // 0x502d2967 = Claim Boost methodId
                            var timestamp = Date.parse(item.timestamp) / 1000
                            console.log(`now: ${now} - timestamp: ${timestamp} - now-timestamp: ${now - timestamp} - lastNotificationTs: ${lastNotificationTs} - now-lastNotificationTs: ${now - lastNotificationTs}`)
                            if (now - timestamp >= 86400 && now - lastNotificationTs > 21600 && !clickedLastNotification) {

                                GM_notification({
                                    title: "Your next boost on VaporDEX is available now!",
                                    text: "Click here to open a new tab and claim your boost",
                                    onclick: () => {
                                        localStorage.setItem("clickedLastNotification", true)
                                        window.open("https://app.vapordex.io/earn/vape")
                                    }
                                })
                                localStorage.setItem("lastNotificationTs", new Date().getTime() / 1000)
                                return;
                            } else if (now - timestamp >= 86400 && now - lastNotificationTs > 82800 && clickedLastNotification) {
                                localStorage.setItem("clickedLastNotification", false)
                            }
                        }
                    }
                } catch ($ex) {
                    console.log(`VaporDEX++ Boost Notifications exception thrown in GM.XMLHttpRequest: ${$ex}`)
                    console.log(`Snowtrace API response: ${response.responseText}`)
                }
            }
        })

    }

