// ==UserScript==
// @name         Bot for Hamster
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Add autoupgrades and autokeys
// @author       SPomodor
// @match        *://*.hamsterkombat.io/*
// @match        *://*.hamsterkombatgame.io/*
// @downloadURL https://update.greasyfork.org/scripts/507194/Bot%20for%20Hamster.user.js
// @updateURL https://update.greasyfork.org/scripts/507194/Bot%20for%20Hamster.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var maxUpgrades = 10;
    var statusUpgrades = false
    // for (var i = 0; i < localStorage.length; i++){
    //     console.log(localStorage.getItem(localStorage.key(i)));
    // };
    const games = {
        1: {
            name: 'Riding Extreme 3D',
            appToken: 'd28721be-fd2d-4b45-869e-9f253b554e50',
            promoId: '43e35910-c168-4634-ad4f-52fd764a843f',
            timing: 30000, // 30 seconds
            attempts: 25,
        },
        2: {
            name: 'Chain Cube 2048',
            appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
            promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
            timing: 30000, // 30 seconds
            attempts: 20,
        },
        3: {
            name: 'My Clone Army',
            appToken: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb',
            promoId: 'fe693b26-b342-4159-8808-15e3ff7f8767',
            timing: 180000, // 180 seconds
            attempts: 30,
        },
        4: {
            name: 'Train Miner',
            appToken: '82647f43-3f87-402d-88dd-09a90025313f',
            promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
            timing: 30000, // 30 seconds
            attempts: 15,
        },
        5: {
            name: 'Merge Away',
            appToken: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833',
            promoId: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',
            timing: 30000, // 30 seconds
            attempts: 25,
        },
        6: {
            name: 'Twerk Race 3D',
            appToken: '61308365-9d16-4040-8bb0-2f4a4c69074c',
            promoId: '61308365-9d16-4040-8bb0-2f4a4c69074c',
            timing: 30000, // 30 seconds
            attempts: 20,
        },
        7: {
            name: 'Polysphere',
            appToken: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            promoId: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            timing: 20000, // 20 seconds
            attempts: 20,
        },
        8: {
            name: 'Mow and Trim',
            appToken: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            promoId: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
            timing: 20000, // 20 seconds
            attempts: 20,
        },
        9: {
            name: 'Mud Racing',
            appToken: '8814a785-97fb-4177-9193-ca4180ff9da8',
            promoId: '8814a785-97fb-4177-9193-ca4180ff9da8',
            timing: 20000, // 20 seconds
            attempts: 20,
        },
        10: {
            name: 'Tile Trio',
            appToken: 'e68b39d2-4880-4a31-b3aa-0393e7df10c7',
            promoId: 'e68b39d2-4880-4a31-b3aa-0393e7df10c7',
            timing: 20000, // 20 seconds
            attempts: 20,
        },
        11: {
            name: 'Zoopolis',
            appToken: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
            promoId: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
            timing: 20000, // 20 seconds
            attempts: 20,
        },
        12: {
            name: 'Fluff Crusade',
            appToken: '112887b0-a8af-4eb2-ac63-d82df78283d9',
            promoId: '112887b0-a8af-4eb2-ac63-d82df78283d9',
            timing: 20000, // 20 seconds
            attempts: 30,
        },
        13: {
            name: 'Stone Age',
            appToken: '04ebd6de-69b7-43d1-9c4b-04a6ca3305af',
            promoId: '04ebd6de-69b7-43d1-9c4b-04a6ca3305af',
            timing: 20000, // 20 seconds
            attempts: 30,
        },
       14: {
            name: 'Bouncemasters',
            appToken: 'bc72d3b9-8e91-4884-9c33-f72482f0db37',
            promoId: 'bc72d3b9-8e91-4884-9c33-f72482f0db37',
            timing: 20000, // 20 seconds
            attempts: 30,
        },
        15: {
            name: 'Hide Ball',
            appToken: '4bf4966c-4d22-439b-8ff2-dc5ebca1a600',
            promoId: '4bf4966c-4d22-439b-8ff2-dc5ebca1a600',
            timing: 40000, // 30 seconds
            attempts: 30,
        },
        16: {
            name: 'Pin Out Master',
            appToken: 'd2378baf-d617-417a-9d99-d685824335f0',
            promoId: 'd2378baf-d617-417a-9d99-d685824335f0',
            timing: 20000, // 30 seconds
            attempts: 30,
        },
        17: {
            name: 'Count Masters',
            appToken: '4bdc17da-2601-449b-948e-f8c7bd376553',
            promoId: '4bdc17da-2601-449b-948e-f8c7bd376553',
            timing: 20000, // 30 seconds
            attempts: 30,
        },
        18: {
            name: 'Infected Frontier',
            appToken: 'eb518c4b-e448-4065-9d33-06f3039f0fcb',
            promoId: 'eb518c4b-e448-4065-9d33-06f3039f0fcb',
            timing: 20000, // 30 seconds
            attempts: 30,
        },
        19: {
            name: 'Among Water',
            appToken: 'daab8f83-8ea2-4ad0-8dd5-d33363129640',
            promoId: 'daab8f83-8ea2-4ad0-8dd5-d33363129640',
            timing: 20000, // 30 seconds
            attempts: 30,
        },
        20: {
            name: 'Factory World',
            appToken: 'd02fc404-8985-4305-87d8-32bd4e66bb16',
            promoId: 'd02fc404-8985-4305-87d8-32bd4e66bb16',
            timing: 20000, // 30 seconds
            attempts: 30,
        }
    };
    let longestString = "";
    let secondLongestString = "";
    for (let i = 0; i < localStorage.length; i++) {
        const value = localStorage.getItem(localStorage.key(i));
        if (value.length > longestString.length) {
            secondLongestString = longestString;
            longestString = value;
        } else if (value.length > secondLongestString.length && value !== longestString) {
            secondLongestString = value;
        }
    }
    const auth = longestString;

    function getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

    // Function to be executed when the first button is clicked


    // Create the buttons and input fields
    const buttonContainer = document.createElement("div");
    buttonContainer.style.position = "fixed";
    buttonContainer.style.top = "50%";
    buttonContainer.style.right = "10px";
    buttonContainer.style.transform = "translateY(-50%)";
    buttonContainer.style.padding = "10px";
    buttonContainer.style.zIndex = "9999";
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexDirection = "column";
    buttonContainer.style.alignItems = "center";
    buttonContainer.style.gap = "10px";


    const button1 = document.createElement("button");
    button1.textContent = "Upgrade";
    button1.addEventListener("click", buttonOneClicked);
    button1.style.borderRadius = "20px";
    button1.style.padding = "6px 12px";
    button1.style.backgroundColor = "red";
    button1.style.border = "none";
    button1.style.cursor = "pointer";
    button1.style.opacity = "0.5";

    const button2 = document.createElement("button");
    button2.textContent = "autoKeys";
    button2.addEventListener("click", buttonTwoClicked);
    button2.style.borderRadius = "20px";
    button2.style.padding = "6px 12px";
    button2.style.backgroundColor = "#f1f1f1";
    button2.style.border = "none";
    button2.style.cursor = "pointer";
    button2.style.opacity = "0.5";

    function buttonOneClicked() {
        if (statusUpgrades == false) {
            button1.style.backgroundColor = "green";
            statusUpgrades = true
            autoUpgrades();
            console.log("Upgrades started!");
        }
        else {
            statusUpgrades = false
            button1.style.backgroundColor = "red";
            console.log("Upgrades disabled!");
        }
        // Add your function logic here
    }

    // Function to be executed when the second button is clicked
    function buttonTwoClicked() {
        keys();

        // Add your function logic here
        console.log("Auto Keys started!");
    }

    buttonContainer.appendChild(button1);
    buttonContainer.appendChild(button2);
    document.body.appendChild(buttonContainer);

    function autoUpgrades() {
        console.log(statusUpgrades);
        if (statusUpgrades == false) {
            console.log("return");
            return;

        }
        console.log("next?");
        let longestString = "";

        for (let i = 0; i < localStorage.length; i++) {
            const value = localStorage.getItem(localStorage.key(i));
            if (value.length > longestString.length) {
                longestString = value;
            }
        }

        const auth = longestString;
        fetch("https://api.hamsterkombat.io/interlude/upgrades-for-buy", {
  "headers": {
    "authorization": "Bearer "+auth,
  },
  "method": "POST",

        })
            .then(response => response.json())
            .then(data => {
            console.log(data);
            const upgrades = data.upgradesForBuy;
            const ProfInHour = [];

            for (const up of upgrades) {
                //(up.isAvailable && !up.isExpired && up.cooldownSeconds == 0)
                if (up.isAvailable && !up.isExpired) {
                    if (up.price !== 0 && up.profitPerHour !== 0) {
                        const hours = up.price / (up.profitPerHour + up.profitPerHourDelta);
                        ProfInHour.push({
                            section: up.section,
                            id: up.id,
                            name: up.name,
                            hours: hours,
                            price: up.price,
                            profitPerHour: up.profitPerHour+up.profitPerHourDelta,
                            cooldownSeconds: up.cooldownSeconds
                        });
                    }
                }
            }
            const sorted = ProfInHour.sort((a, b) => a.hours - b.hours);
            //https://api.hamsterkombatgame.io/interlude/sync
            console.log("sync");
            const response = fetch("https://api.hamsterkombatgame.io/interlude/sync", {
                "headers": {
                    "authorization": "Bearer " + auth,
                    "Content-Type": "application/json;charset=utf-8"
                },
                "method": "POST",
            })
            .then(response => response.json())
            .then(data => {
                console.log("data");
                console.log(data);
                console.log(data.interludeUser.balanceDiamonds);
                for (let i = 0; i < maxUpgrades; i++) {
                    console.log(i);
                    if (sorted[i].price < data.interludeUser.balanceDiamonds && (sorted[i].cooldownSeconds == 0 || sorted[i].cooldownSeconds == null)) {
                        console.log("if yes");
                        console.log(sorted[i].id);
                        const response = fetch("https://api.hamsterkombatgame.io/interlude/buy-upgrade", {
                            "headers": {
                                "authorization": "Bearer " + auth,
                                "Content-Type": "application/json;charset=utf-8"
                            },
                            "method": "POST",
                            "body": JSON.stringify({ timestamp : Date.now(), upgradeId: sorted[i].id })
                        })
                        .then(response => {

                            console.log(response);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                        console.log("time out : this is good");
                        setTimeout(autoUpgrades, getRandomNumber(3000, 3500));
                        break;
                    }
                    else if (sorted[i].price > data.interludeUser.balanceDiamonds) {
                        if (i == maxUpgrades-1) {
                            setTimeout(autoUpgrades, getRandomNumber(250000, 300000));
                            break;
                        }
                        continue;
                    }
                    // проверить
                    // else if ((sorted[i].cooldownSeconds != 0 || sorted[i].cooldownSeconds != null) && sorted[i].price > data.interludeUser.balanceDiamonds) {
                    //     continue;
                    // }
                    else if (i == maxUpgrades-1 && (sorted[i].cooldownSeconds != 0 || sorted[i].cooldownSeconds != null)) {
                        console.log("time out : i == 9 && sorted[i].cooldownSeconds != 0");
                        var newSort = sorted.slice(0, maxUpgrades);
                        newSort.sort((a, b) => a.cooldownSeconds - b.cooldownSeconds);
                        console.log(newSort);
                        console.log("------------------");
                        console.log(newSort[0]);
                        console.log(newSort[0].cooldownSeconds);
                        setTimeout(autoUpgrades, newSort[0].cooldownSeconds*1000);
                        break;

                    }
                    else if (sorted[i].cooldownSeconds != 0 || sorted[i].cooldownSeconds != null) {
                        console.log("sorted[i].cooldownSeconds != 0");
                        continue;

                    }

                }

            })





            for (let i = 0; i < maxUpgrades; i++) {
                const priceString = sorted[i].price.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                const profitString = sorted[i].profitPerHour.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                console.log(
                    `seconds: ${sorted[i].cooldownSeconds} | name: ${sorted[i].name} | hours: ${Math.round(sorted[i].hours)} | price: ${priceString} | profitPerHour: ${profitString}`
                    //`seconds: ${sorted[i].cooldownSeconds} | name: ${sorted[i].name}`
                );
            }

        })
    }
    function keys() {
        const response = fetch('https://api.hamsterkombatgame.io/interlude/get-promos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth}`,
            }
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            const result = data.states.map(state => {
                const gameKey = Object.keys(games).find(key => games[key].promoId === state.promoId);
                return {
                    gameNo: gameKey ? parseInt(gameKey) : 0,
                    receiveKeysToday: state.receiveKeysToday
                };
            });

            for (const { gameNo, receiveKeysToday } of result) {
                autoKeys(gameNo, 4-receiveKeysToday);
            }
        })

        //console.log(response.json())
    }

    function autoKeys(gameChoice, keyCount) {
        //const EVENTS_DELAY = 20000;

        console.log('start');
        console.log(gameChoice);
        console.log(keyCount);
        const game = games[gameChoice];
        const generateClientId = () => {
            console.log("generateClientId");
            const timestamp = Date.now();
            const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
            return `${timestamp}-${randomNumbers}`;
        };

        const login = async (clientId, appToken) => {
            console.log("login");
            const response = await fetch('https://api.gamepromo.io/promo/login-client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appToken,
                    clientId,
                    clientOrigin: 'deviceid'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to login');
            }

            const data = await response.json();
            return data.clientToken;
        };

        const emulateProgress = async (clientToken, promoId) => {
            console.log("emulateProgress");
            const response = await fetch('https://api.gamepromo.io/promo/register-event', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${clientToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    promoId,
                    eventId: generateUUID(),
                    eventOrigin: 'undefined'
                })
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.hasCode;
        };

        const generateKey = async (clientToken, promoId) => {
            console.log("generateKey");
            const response = await fetch('https://api.gamepromo.io/promo/create-code', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${clientToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    promoId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate key');
            }

            const data = await response.json();
            console.log(data.promoCode);
            fetch("https://api.hamsterkombatgame.io/interlude/apply-promo", {
                "headers": {
                    "authorization": "Bearer " + auth,
                    "Content-Type": "application/json;charset=utf-8"
                },
                "method": "POST",
                "body": JSON.stringify({ promoCode: data.promoCode })
            })
                .then(response => {
                // обработка ответа для каждого запроса
                console.log(response);
            })
                .catch(error => {
                // обработка ошибок для каждого запроса
                console.error(error);
            });
            return data.promoCode;
        };

        const generateUUID = () => {
            console.log("generateUUID");
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

        const delayRandom = () => Math.random() / 3 + 1;

        const generateKeyProcess = async () => {
            console.log("generateKeyProcess");
            const clientId = generateClientId();
            let clientToken;
            try {
                clientToken = await login(clientId, game.appToken);
            } catch (error) {
                alert(`Failed to login: ${error.message}`);
                return null;
            }

            for (let i = 0; i < game.attempts; i++) {
                await sleep(game.timing * delayRandom());
                const hasCode = await emulateProgress(clientToken, game.promoId);
                if (hasCode) {
                    break;
                }
            }

            try {
                const key = await generateKey(clientToken, game.promoId);
                return key;
            } catch (error) {
                alert(`Failed to generate key: ${error.message}`);
                return null;
            }
        };

        const keys = Array.from({ length: keyCount }, generateKeyProcess);
        console.log(keys);

    }


})();