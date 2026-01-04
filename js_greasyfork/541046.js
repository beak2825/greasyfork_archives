// ==UserScript==
// @name         IdlePixel UI Tweaks - TheeMarcel Fork
// @namespace    com.anwinity.idlepixel
// @version      2.9.0
// @description  Adds some options to change details about the IdlePixel user interface.
// @author       Original Author: Anwinity || Modded By: GodofNades/TheeMarcel
// @license      MIT
// @match        *://idle-pixel.com/login/play/
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require      https://cdnjs.cloudflare.com/ajax/libs/anchorme/2.1.2/anchorme.min.js
// @downloadURL https://update.greasyfork.org/scripts/541046/IdlePixel%20UI%20Tweaks%20-%20TheeMarcel%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/541046/IdlePixel%20UI%20Tweaks%20-%20TheeMarcel%20Fork.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let IPP, getVar, getThis, purpleKeyGo, utcDate, currUTCDate;

    let gems = {};

    window.UIT_IMAGE_URL_BASE =
        document
        .querySelector("itembox[data-item=copper] img")
        .src.replace(/\/[^/]+.png$/, "");

    // Start New Base Code Re-work
    const uitLevel = function () {
        window.uitSkills = [
            "mining",
            "crafting",
            "gathering",
            "farming",
            "brewing",
            "woodcutting",
            "cooking",
            "fishing",
            "breeding",
            "invention",
            "melee",
            "archery",
            "magic",
        ];

        return {
            LEVELS: function () {
                let result = [];
                result[1] = 0;
                for (let lv = 2; lv <= 300; lv++) {
                    result[lv] = Math.ceil(Math.pow(lv, 3 + lv / 200));
                }
                return result;
            },

            xpToLevel: function (xp) {
                if (xp <= 0) {
                    return 1;
                }
                if (xp >= uitLevel().LEVELS()[300]) {
                    return 300;
                }
                let lower = 1;
                let upper = 300;
                while (lower <= upper) {
                    let mid = Math.floor((lower + upper) / 2);
                    let midXP = uitLevel().LEVELS()[mid];
                    let midPlus1XP = uitLevel().LEVELS()[mid + 1];
                    if (xp < midXP) {
                        upper = mid;
                        continue;
                    }
                    if (xp > midPlus1XP) {
                        lower = mid + 1;
                        continue;
                    }
                    if (mid < 100 && xp == uitLevel().LEVELS()[mid + 1]) {
                        return mid + 1;
                    }
                    return mid;
                }
            },

            extendedLevelsUpdate: function () {
                let overallLevel = 0;

                uitSkills.forEach((skill) => {
                    const xp = getVar(`${skill}_xp`, 0, "int");
                    const level = uitLevel().calculateExtendedLevel(xp);
                    uitLevel().updateExtendedLevel(skill, level);
                    overallLevel += level;
                });

                uitLevel().updateOverallLevel(overallLevel);

                uitLevel().hideOriginalLevels();
            },

            calculateExtendedLevel: function (xp) {
                let extendedLevel = 0;
                while (Math.pow(extendedLevel, 3 + extendedLevel / 200) < xp) {
                    extendedLevel++;
                }
                if (extendedLevel == 0) {
                    return 1;
                }
                return extendedLevel - 1;
            },

            updateExtendedLevel: function (skill, extendedLevel) {
                const skillElement = document.querySelector(
                    `#overallLevelExtended-${skill}`
                );
                const colorStyle = extendedLevel >= 100 ? "color:cyan" : "";
                skillElement.textContent = `(LEVEL ${Math.max(extendedLevel, 1)})`;
                skillElement.setAttribute("style", colorStyle);
            },

            updateOverallLevel: function (overallLevel) {
                const totalElement = document.querySelector(
                    "#overallLevelExtended-total"
                );
                if (overallLevel >= 100) {
                    totalElement.textContent = ` (${overallLevel})`;
                    totalElement.style.color = "cyan";
                } else {
                    totalElement.textContent = "";
                    totalElement.style.display = "none";
                }
            },

            hideOriginalLevels: function () {
                uitSkills.forEach((skill) => {
                    const skillElement = document.querySelector(
                        `#menu-bar-${skill}-level`
                    );
                    if (skillElement) {
                        skillElement.style.display = "none";
                    }
                });
            },

            addLoadingSpanAfterElement: function (selector, id) {
                const element = document.querySelector(selector);
                const loadingSpan = document.createElement("span");
                loadingSpan.id = id;
                loadingSpan.textContent = "(Loading)";
                loadingSpan.className = "color-silver";
                element.insertAdjacentElement("afterend", loadingSpan);
            },

            initExtendedLevels: function () {
                if (
                    document.querySelector(".game-top-bar-upper > a:nth-child(4) > item-display")
                ) {
                    uitLevel().addLoadingSpanAfterElement(
                        ".game-top-bar-upper > a:nth-child(4) > item-display",
                        "overallLevelExtended-total"
                    );
                } else {
                    uitLevel().addLoadingSpanAfterElement(
                        ".game-top-bar-upper > a:nth-child(5) > item-display",
                        "overallLevelExtended-total"
                    );
                }
                uitSkills.forEach((skill) => {
                    uitLevel().addLoadingSpanAfterElement(
                        `#menu-bar-${skill}-level`,
                        `overallLevelExtended-${skill}`
                    );
                });
            },

            initNextLevel: function () {
                const itemDisplayElements = document.querySelectorAll("item-display");

                itemDisplayElements.forEach((el) => {
                    const dataKey = el.getAttribute("data-key");
                    if (dataKey && dataKey.endsWith("_xp")) {
                        const parent = el.parentElement;
                        const uiTweaksXpNext = document.createElement("span");
                        uiTweaksXpNext.className = "ui-tweaks-xp-next";
                        uiTweaksXpNext.innerHTML = "&nbsp;&nbsp;Next Level: ";
                        const itemDisplayNext = document.createElement("item-display");
                        itemDisplayNext.setAttribute("data-format", "number");
                        itemDisplayNext.setAttribute("data-key", `ipp_${dataKey}_next`);
                        uiTweaksXpNext.appendChild(itemDisplayNext);
                        parent.appendChild(uiTweaksXpNext);
                    }
                });
            },
        };
    };

    const uitPurpleKey = function () {
        // No global constants/declarations
        return {
            onPurpleKey: function (monster, rarity, timer) {
                if (purpleKeyGo) {
                    const timeLeft = format_time(timer);
                    const imageSrc = monster;
                    const monsterName = imageSrc
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (letter) => letter.toUpperCase());

                    const purpleKeyNotification = document.querySelector(
                        "#notification-purple_key"
                    );
                    const imageElement = document.querySelector(
                        "#notification-purple_key-image"
                    );
                    const imageTextElement = document.querySelector(
                        "#notification-purple_key-image-text"
                    );
                    const rarityElement = document.querySelector(
                        "#notification-purple_key-rarity"
                    );
                    const timeElement = document.querySelector(
                        "#notification-purple_key-time"
                    );

                    imageElement.setAttribute(
                        "src",
                        `${UIT_IMAGE_URL_BASE}/${imageSrc}_icon.png`
                    );
                    imageTextElement.innerText = `${monsterName} `;
                    rarityElement.innerText = ` ${rarity}`;
                    timeElement.innerText = ` ⏲️${timeLeft}`;

                    if (rarity === "Very Rare") {
                        purpleKeyNotification.style.backgroundColor = "DarkRed";
                        [imageTextElement, rarityElement, timeElement].forEach(
                            (element) => (element.style.color = "white")
                        );
                    } else {
                        let textColor = "black";
                        if (rarity === "Rare") {
                            purpleKeyNotification.style.backgroundColor = "orange";
                        } else if (rarity === "Uncommon") {
                            purpleKeyNotification.style.backgroundColor = "gold";
                        } else if (rarity === "Common") {
                            purpleKeyNotification.style.backgroundColor = "DarkGreen";
                            textColor = "white";
                        }
                        [imageTextElement, rarityElement, timeElement].forEach(
                            (element) => (element.style.color = textColor)
                        );
                    }
                    return;
                }
            },

            addPurpleKeyNotifications: function () {
                var purpleKeyUnlocked = getVar("guardian_purple_key_hint", 0, "int");
                const notifDiv = document.createElement("div");
                notifDiv.id = `notification-purple_key`;
                notifDiv.onclick = function () {
                    websocket.send("CASTLE_MISC=guardian_purple_key_hint");
                };
                notifDiv.className = "notification hover";
                //notifDiv.style = "margin-right: 4px; margin-bottom: 4px; display: none";
                notifDiv.style = "margin-bottom: 4px; display: none";
                notifDiv.style.display = "inline-block";

                var elem = document.createElement("img");
                elem.setAttribute("src", "");
                const notifIcon = elem;
                notifIcon.className = "w20";
                notifIcon.id = `notification-purple_key-image`;
                notifIcon.innerText = "";

                const notifDivImgText = document.createElement("span");
                notifDivImgText.id = `notification-purple_key-image-text`;
                notifDivImgText.innerText = "";
                notifDivImgText.className = "color-white";

                var elemKey = document.createElement("img");
                elemKey.setAttribute(
                    "src",
                    `${UIT_IMAGE_URL_BASE}/purple_gaurdian_key.png`
                );
                const notifDivRarityKey = elemKey;
                notifDivRarityKey.className = "w20";
                notifDivRarityKey.id = `notification-purple_key-rarity-img`;
                notifDivRarityKey.style = `transform: rotate(-45deg)`;

                const notifDivRarity = document.createElement("span");
                notifDivRarity.id = `notification-purple_key-rarity`;
                notifDivRarity.innerText = "Purple Key Info Loading";
                notifDivRarity.className = "color-white";

                const notifDivTime = document.createElement("span");
                notifDivTime.id = `notification-purple_key-time`;
                notifDivTime.innerText = "";
                notifDivTime.className = "color-white";

                notifDiv.append(
                    notifIcon,
                    notifDivImgText,
                    notifDivRarityKey,
                    notifDivRarity,
                    notifDivTime
                );
                document.querySelector("#notifications-area").prepend(notifDiv);
                if (purpleKeyUnlocked == 0) {
                    document.querySelector("#notification-purple_key").style.display =
                        "none";
                } else {
                    document.querySelector("#notification-purple_key").style.display =
                        "inline-block";
                }
            },
        };
    };

    const uitCriptoe = function () {
        // No global constants/declarations
        return {
            addCriptoeValues: function () {
                fetch('https://idle-pixel.com/criptoe/')
                    .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                    .then(data => {
                    let walletPercentages = {};
                    let seenWallets = new Set();

                    const dataArray = data.data;

                    for (let i = dataArray.length - 1; i >= 0; i--) {
                        let entry = dataArray[i];
                        if (!seenWallets.has(entry.wallet)) {
                            seenWallets.add(entry.wallet);
                            walletPercentages[`wallet_${entry.wallet}`] = entry.percentage;
                        }

                        if (seenWallets.size === 4) break;
                    }

                    const wallets = ["wallet_1", "wallet_2", "wallet_3", "wallet_4"];

                    wallets.forEach((walletKey) => {
                        const payoutElementId = `${walletKey}_payout`;
                        const payoutElement = document.getElementById(payoutElementId);
                        let percentage = walletPercentages[walletKey];
                        const investedAmount = getVar(`${walletKey.replace("_", "")}_invested`, 0, "int");
                        if (investedAmount > 0) {
                            if (percentage > -100) {
                                payoutElement.innerText = ` ${uitCriptoe().getPayout(investedAmount, percentage)}`;
                            } else {
                                payoutElement.innerText = ` Full Loss`;
                            }
                        } else {
                            payoutElement.innerText = ` No Investment`;
                        }
                        const percentageElementId = `criptoe-${walletKey.replace("_", "-")}-percentage`;
                        const percentageElement = document.getElementById(percentageElementId);

                        let percentageText = "";
                        let weekday = new Date().getUTCDay();
                        if (weekday == 0) {
                            percentage = -20;
                            percentageText = `${percentage} %`;
                        } else if (weekday == 1) {
                            percentage = 0;
                            percentageText = `Go invest!`;

                        } else {
                            percentageText = `${percentage} %`;
                        }

                        percentageElement.innerText = `${percentageText}`;

                        if (percentage < 0) {
                            percentageElement.style.color = "red";
                        } else if (percentage > 0) {
                            percentageElement.style.color = "lime";
                        } else {
                            percentageElement.style.color = "white";
                        }
                    });
                })
                    .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
            },

            initCriptoe: function () {
                document
                    .querySelector(
                    "#panel-criptoe-market > div.charts-content > div > table:nth-child(1) > tbody > tr > td:nth-child(1) > item-display"
                )
                    .insertAdjacentHTML(
                    "afterend",
                    `<br><b>Current Payout: </b><span id="wallet_1_payout"></span>`
                    );
                document
                    .querySelector(
                    "#panel-criptoe-market > div.charts-content > div > table:nth-child(3) > tbody > tr > td:nth-child(1) > item-display"
                )
                    .insertAdjacentHTML(
                    "afterend",
                    `<br><b>Current Payout: </b><span id="wallet_2_payout"></span>`
                    );
                document
                    .querySelector(
                    "#panel-criptoe-market > div.charts-content > div > table:nth-child(5) > tbody > tr > td:nth-child(1) > item-display"
                )
                    .insertAdjacentHTML(
                    "afterend",
                    `<br><b>Current Payout: </b><span id="wallet_3_payout"></span>`
                    );
                document
                    .querySelector(
                    "#panel-criptoe-market > div.charts-content > div > table:nth-child(7) > tbody > tr > td:nth-child(1) > item-display"
                )
                    .insertAdjacentHTML(
                    "afterend",
                    `<br><b>Current Payout: </b><span id="wallet_4_payout"></span>`
                    );

                document.getElementById("left-panel-item_panel-criptoe-market").onclick =
                    function () {
                    switch_panels('panel-criptoe-market');
                    uitCriptoe().addCriptoeValues();
                }
            },

            getPayout: function (wallet, perct) {
                let weekday = new Date().getUTCDay();
                let payout;
                if (weekday == "0") {
                    payout = Math.floor(
                        wallet * 0.8
                    )
                    return payout;
                }
                if (weekday == "1") {
                    return 0;
                }
                payout = Math.floor(
                    wallet * (perct / 100 + 1)
                ).toLocaleString();
                return payout;
            },

            updateCrippledToeTimer: function () {
                var now = new Date(); // Create a new date object with the current date and time
                var hours = now.getUTCHours(); // Get the hours value in UTC
                var minutes = now.getUTCMinutes(); // Get the minutes value in UTC
                var seconds = now.getUTCSeconds(); // Get the seconds value in UTC

                // Pad the hours, minutes, and seconds with leading zeros if they are less than 10
                hours = hours.toString().padStart(2, "0");
                minutes = minutes.toString().padStart(2, "0");
                seconds = seconds.toString().padStart(2, "0");

                // Concatenate the hours, minutes, and seconds with colons

                let path = getVar("criptoe_path_selected", "none", "string");
                if (path === "none") {
                    path = "No Path Selected"
                } else {
                    path = `${path.replace(/\b\w/g, (letter) => letter.toUpperCase())} Path`;

                }
                const menuBarCrippledtoeRow = document.querySelector(
                    "#left-panel-item_panel-criptoe-market table tbody tr"
                );

                let researchTimer = IdlePixelPlus.getVarOrDefault("criptoe_path_timer", 0, "int");
                let rTimerText;

                if (researchTimer > 0) {
                    rTimerText = format_time(researchTimer);
                } else {
                    rTimerText = "Can swap";
                }

                // Find the cell that contains the text "CRIPTOE MARKET"
                const cells = menuBarCrippledtoeRow.getElementsByTagName("td");
                let criptoeMarketCell = null;
                for (let cell of cells) {
                    if (cell.textContent.includes("CRIPTOE MARKET")) {
                        criptoeMarketCell = cell;
                        break;
                    }
                }
                if (criptoeMarketCell) {
                    criptoeMarketCell.innerHTML = `CRIPTOE MARKET <span style="color:cyan;">(${hours + ":" + minutes + ":" + seconds
                })</span>
					<i class="font-small" style="" id="criptoe_path_selected-left-label"><br>${path} (${rTimerText})</i>`;
                }
            },
        };
    };

    const uitTableLabels = function () {
        window.UIT_POTION_XP_MAP = {
            // DOES NOT ACCOUNT SKILLING OUTFITS!!!
            stardust_potion: 75,
            energy_potion: 50,
            anti_disease_potion: 250,
            tree_speed_potion: 525,
            smelting_upgrade_potion: 550,
            breeding_anti_disease_potion: 900,
            great_stardust_potion: 1925,
            farming_speed_potion: 500,
            rare_monster_potion: 2125,
            cure_animal_disease_potion: 350,
            super_stardust_potion: 4400,
            gathering_unique_potion: 3000,
            heat_potion: 2500,
            potion_of_twins: 6000,
            bait_potion: 1000,
            bone_potion: 1550,
            furnace_speed_potion: 6000,
            promethium_potion: 2000,
            //oil_potion: 5000, doesnt exist anymore
            super_rare_monster_potion: 6000,
            ultra_stardust_potion: 12900,
            cooks_dust_potion: 100000,
            fighting_dust_potion: 100000,
            tree_dust_potion: 100000,
            farm_dust_potion: 100000,
            cure_all_animal_disease_potion: 1200,
            magic_shiny_crystal_ball_potion: 7000,
            birdhouse_potion: 800,
            rocket_potion: 1500,
            titanium_potion: 5000,
            blue_orb_potion: 50000,
            raids_hp_potion: 17500,
            geode_potion: 9500,
            magic_crystal_ball_potion: 12000,
            stone_converter_potion: 4000,
            rain_potion: 2500,
            raids_mana_potion: 21000,
            combat_loot_potion: 9500,
            animal_attractor_potion: 8000,
            gathering_worker_potion: 15000,
            rotten_potion: 1250,
            merchant_speed_potion: 50000,
            green_orb_potion: 200000,
            ancient_potion: 40000,
            potion_of_triplets: 12000,
            raids_crits_potion: 47500,
            guardian_key_potion: 42500,
            breeding_feeding_potion: 90000,
            red_orb_potion: 500000,
            infinite_oil_potion: 0,
            faradox_potion: 1475000,
            //raids_bomb_potion: 0, what potion?
        };

        return {
            addTableCraftLabels: function () {
                // Invention Table
                const inventionTableRows = document.querySelectorAll(
                    "#invention-table tbody tr[data-tablette-required]"
                );
                inventionTableRows.forEach((row) => {
                    const outputs = row.querySelectorAll(
                        "td:nth-child(4) item-invention-table"
                    );
                    outputs.forEach((output) => {
                        output.textContent =
                            Number(output.textContent).toLocaleString() +
                            " (" +
                            output.getAttribute("data-materials-item").replaceAll("_", " ") +
                            ")";
                    });
                });

                // Crafting Table
                const craftingTableRows = document.querySelectorAll(
                    "#crafting-table tbody tr[data-crafting-item]"
                );
                craftingTableRows.forEach((row) => {
                    const outputs = row.querySelectorAll(
                        "td:nth-child(3) item-crafting-table"
                    );
                    outputs.forEach((output) => {
                        output.textContent =
                            Number(output.textContent).toLocaleString() +
                            " (" +
                            output.getAttribute("data-materials-item").replaceAll("_", " ") +
                            ")";
                    });
                });

                // Brewing Table
                const brewingTableRows = document.querySelectorAll(
                    "#brewing-table tbody tr[data-brewing-item]"
                );
                brewingTableRows.forEach((row) => {
                    const outputs = row.querySelectorAll(
                        "td:nth-child(3) item-brewing-table"
                    );
                    outputs.forEach((output) => {
                        output.textContent =
                            output.textContent +
                            " (" +
                            output.getAttribute("data-materials-item").replaceAll("_", " ") +
                            ")";
                    });
                });
            },

            updateTableCraftLabels: function () {
                const brewingTable = document.getElementById("brewing-table");
                if (brewingTable) {
                    const rows = brewingTable.querySelectorAll(
                        "tbody tr[data-brewing-item]"
                    );
                    rows.forEach((row) => {
                        if (row.id != "id-raids_hp_potion" || row.id != "id-raids_mana_potion" || row.id != "id-raids_bomb_potion") {
                            const brewingXP = row.querySelector("td:nth-child(6)");
                            if (brewingXP) {
                                const potionName = brewingXP.getAttribute("data-xp").replace("_xp", "");
                                const potionXP =
                                      UIT_POTION_XP_MAP[potionName]?.toLocaleString() + " xp";
                                const potionOrig = document.createElement("span");
                                potionOrig.classList.add("font-small", "color-grey");
                                potionOrig.textContent = potionXP;
                                brewingXP.innerHTML = "";
                                brewingXP.appendChild(potionOrig);
                            }
                        }
                    });
                }
            },

            fixShortcutModel: function() {
                Modals.openBrewingShortcutModel = function(skill) {
                    var shortcutTable = document.getElementById('brewing-shortcut-table');
                    var originalTable = document.getElementById("brewing-table");
                    //var rows = originalTable.getElementsByTagName("tr");
                    var rows = originalTable.rows;

                    while (shortcutTable.rows.length > 1) {
                        shortcutTable.deleteRow(1);
                    }

                    for(var i = 0; i < rows.length; i++) {
                        if(!rows[i].hasAttribute("data-brewing-item"))
                            continue;

                        if(rows[i].getAttribute('data-brewing-item-category') == skill) {
                            var tr = document.createElement("tr");
                            tr.setAttribute("data-brewing-item", rows[i].getAttribute('data-brewing-item'));
                            tr.classList.add("center", "border", "hover-tr");
                            tr.innerHTML = rows[i].innerHTML;
                            shortcutTable.appendChild(tr);
                        }
                    }

                    Brewing.refresh_table(shortcutTable);
                    Modals.toggle('modal-brewing-table-shortcut')

                }
            },

            disableTableRefreshBrewing: function() {
                Brewing.refresh_table = function(brewing_table) {
                    Brewing._refresh_click_events(brewing_table)
                    Brewing._refresh_materials(brewing_table)
                    Brewing._refresh_timers(brewing_table)
                    Brewing._refresh_backgrounds(brewing_table)
                    //Brewing._refresh_xp_labels(brewing_table)
                }
            },

            Crafting_getMaterials: function () {
                Crafting._refresh_materials_and_level = function (crafting_table) {
                    // var crafting_table = document.getElementById("crafting-table");
                    if(!crafting_table) {
                        crafting_table = document.getElementById("crafting-table");
                    }

                    var materials_req_array = crafting_table.getElementsByTagName("item-crafting-table");
                    var levels_req_array = crafting_table.getElementsByTagName("item-crafting-table-level");

                    for (var i = 0; i < materials_req_array.length; i++) {
                        var materials_req = materials_req_array[i];
                        var item = materials_req.getAttribute("data-materials-item");
                        var originalAmount = materials_req.innerHTML;
                        var amountText = originalAmount.split(" ")[0];
                        var cleanedAmountText = amountText.replace(/[,.\s]/g, '');
                        var amount = parseInt(cleanedAmountText, 10);

                        if (Items.getItem(item) >= amount)
                            materials_req_array[i].style.color = "#00a200";
                        else
                            materials_req_array[i].style.color = "red";
                    }

                    for (var ix = 0; ix < levels_req_array.length; ix++) {
                        var levels_req = levels_req_array[ix];
                        var level_found = parseInt(levels_req.innerHTML);
                        if (get_level(Items.getItem("crafting_xp")) >= level_found)
                            levels_req.style.color = "green";
                        else
                            levels_req.style.color = "red";
                    }
                }
                Crafting._refresh_click_events = function(crafting_table)
                {
                    if(!crafting_table) {
                        crafting_table = document.getElementById("crafting-table");
                    }
                    if (!Crafting._click_events_loaded) {
                        var crafting_row_array = crafting_table.getElementsByTagName("tr");

                        for (var i = 0; i < crafting_row_array.length; i++) {
                            var crafting_row = crafting_row_array[i];
                            if (!crafting_row.hasAttribute("data-crafting-item"))
                                continue;

                            crafting_row.addEventListener('click', (e) => {
                                var target_clicked = e.target;
                                var tr = target_clicked.closest("tr");
                                var crafting_row_item = tr.getAttribute("data-crafting-item");
                                var can_use_crafting_input_multiple = tr.getAttribute("data-crafting-item-multiple") === "true";

                                if (can_use_crafting_input_multiple)
                                    Modals.open_input_dialogue(crafting_row_item, "Crafting", "How many do you want to craft?", "CRAFT");
                                else {
                                    var materials = Crafting.get_materials(crafting_row_item);
                                    var html = "<div class='modal-crafting-ingredients shadow'>";
                                    html += "<b>MATERIALS</b><hr />";
                                    for (var i = 0; i < materials.length; i++) {
                                        var name = materials[i];
                                        i++;
                                        var amount = materials[i];
                                        var originalAmount = materials[i];
                                        //console.log(originalAmount);
                                        var amountText = originalAmount.split(" ")[0];
                                        var cleanedAmountText = amountText.replace(/[,.\s]/g, '');
                                        var amountClick = parseInt(cleanedAmountText, 10);

                                        var img = `<img width="15px" height="15px" src="${UIT_IMAGE_URL_BASE}/x.png">`;

                                        if (Items.getItem(name) >= amountClick)
                                            img = `<img width="15px" height="15px" src="${UIT_IMAGE_URL_BASE}/check.png">`;

                                        html += `<img class='w40' src="${UIT_IMAGE_URL_BASE}/${name}.png">` + originalAmount + " " + img;
                                        html += "<br />";
                                    }
                                    html += "</div><br /><br />Craft Item?";

                                    document.getElementById("modal-brew-ingredients").innerHTML = html;
                                    Modals.open_image_modal("Crafting", "images/" + crafting_row_item + ".png", html, "Craft", "Cancel", "CRAFT=" + crafting_row_item + "~" + 1)
                                }

                            });
                        }
                        Crafting._click_events_loaded = true;
                    }

                }
            },

            Invention_getMaterials: function () {
                Invention._refresh_materials = function () {
                    var invention_table = document.getElementById("invention-table");
                    var materials_req_array = invention_table.getElementsByTagName("item-invention-table");

                    for (var i = 0; i < materials_req_array.length; i++) {
                        var materials_req = materials_req_array[i];
                        var item = materials_req.getAttribute("data-materials-item");
                        var originalAmount = materials_req.innerHTML;
                        var amountText = originalAmount.split(" ")[0];
                        var cleanedAmountText = amountText.replace(/[,.\s]/g, '');
                        var amount = parseInt(cleanedAmountText, 10);

                        if (Items.getItem(item) >= amount)
                            materials_req_array[i].style.color = "#00a200";
                        else
                            materials_req_array[i].style.color = "red";
                    }
                }
            },
            Modals_changeModal: function () {
                Modals.open_brew_dialogue = function (item) {
                    document.getElementById("modal-brew-item-name-hidden").value = item;
                    document.getElementById("modal-brew-item-image").src = get_image("images/" + item + ".png");
                    document.getElementById("modal-brew-item-amount").value = "1";
                    var materials = Brewing.get_ingredients(item);
                    var html = "<b>INGREDIENTS</b><hr />";
                    var dict = {};
                    for(var i = 0; i < materials.length; i++)
                    {
                        var name = materials[i];
                        i++;
                        var amount = materials[i];
                        var originalAmount = materials[i];
                        //console.log(originalAmount);
                        var amountText = originalAmount.split(" ")[0];
                        var cleanedAmountText = amountText.replace(/[,.\s]/g, '');
                        var amountClick = parseInt(cleanedAmountText, 10);
                        html += `<img class='w40' src="${UIT_IMAGE_URL_BASE}/${name}.png">` + format_number(amountClick);
                        html += "<br />";
                        dict[name] = amountClick;
                    }
                    //console.log(dict);
                    document.getElementById("modal-brew-ingredients").innerHTML = html;
                    Modals.open_modern_input_dialogue_with_value(
                        item,
                        "images/" + item + ".png",
                        dict,
                        'PLUS_ONE',
                        null,
                        "Brew",
                        "BREW=" + item,
                    )
                }
            },
        };
    };

    const uitFishing = function () {
        window.UIT_FISH_ENERGY_MAP = {
            // Normal Raw Fish
            shrimp: 25,
            anchovy: 100,
            sardine: 200,
            crab: 500,
            piranha: 1000,
            salmon: 100,
            trout: 300,
            pike: 1000,
            eel: 3000,
            rainbow_fish: 30000,
            tuna: 500,
            swordfish: 3000,
            manta_ray: 9000,
            shark: 20000,
            whale: 40000,

            // Shiny Raw Fish
            shrimp_shiny: 125,
            anchovy_shiny: 500,
            sardine_shiny: 1000,
            crab_shiny: 2500,
            piranha_shiny: 5000,
            salmon_shiny: 500,
            trout_shiny: 1500,
            pike_shiny: 5000,
            eel_shiny: 15000,
            rainbow_fish_shiny: 150000,
            tuna_shiny: 2500,
            swordfish_shiny: 15000,
            manta_ray_shiny: 45000,
            shark_shiny: 100000,
            whale_shiny: 200000,

            // Mega Shiny Raw Fish
            shrimp_mega_shiny: 625,
            anchovy_mega_shiny: 2500,
            sardine_mega_shiny: 5000,
            crab_mega_shiny: 12500,
            piranha_mega_shiny: 25000,
            salmon_mega_shiny: 2500,
            trout_mega_shiny: 7500,
            pike_mega_shiny: 25000,
            eel_mega_shiny: 75000,
            rainbow_fish_mega_shiny: 750000,
            tuna_mega_shiny: 12500,
            swordfish_mega_shiny: 75000,
            manta_ray_mega_shiny: 225000,
            shark_mega_shiny: 500000,
            whale_mega_shiny: 1000000,

            // Misc Fish
            bloated_shark: 20000,
            small_stardust_fish: 1000,
            medium_stardust_fish: 2500,
            large_stardust_fish: 5000,
            angler_fish: 100000,
        };

        window.UIT_FISH_HEAT_MAP = {
            // Normal Raw Fish
            shrimp: 10,
            anchovy: 20,
            sardine: 40,
            crab: 75,
            piranha: 120,
            salmon: 20,
            trout: 40,
            pike: 110,
            eel: 280,
            rainbow_fish: 840,
            tuna: 75,
            swordfish: 220,
            manta_ray: 1200,
            shark: 3000,
            whale: 5000,

            //Shiny Raw Fish
            shrimp_shiny: 10,
            anchovy_shiny: 20,
            sardine_shiny: 40,
            crab_shiny: 75,
            piranha_shiny: 120,
            salmon_shiny: 20,
            trout_shiny: 40,
            pike_shiny: 110,
            eel_shiny: 280,
            rainbow_fish_shiny: 840,
            tuna_shiny: 75,
            swordfish_shiny: 220,
            manta_ray_shiny: 1200,
            shark_shiny: 3000,
            whale_shiny: 5000,

            //Mega Shiny Raw Fish
            shrimp_mega_shiny: 10,
            anchovy_mega_shiny: 20,
            sardine_mega_shiny: 40,
            crab_mega_shiny: 75,
            piranha_mega_shiny: 120,
            salmon_mega_shiny: 20,
            trout_mega_shiny: 40,
            pike_mega_shiny: 110,
            eel_mega_shiny: 280,
            rainbow_fish_mega_shiny: 840,
            tuna_mega_shiny: 75,
            swordfish_mega_shiny: 220,
            manta_ray_mega_shiny: 1200,
            shark_mega_shiny: 3000,
            whale_mega_shiny: 5000,

            // Misc Fish
            bloated_shark: 3000,
            small_stardust_fish: 300,
            medium_stardust_fish: 600,
            large_stardust_fish: 2000,
            angler_fish: 10000,
        };
        return {
            initFishing: function () {
                const fishingNetItembox = document.querySelector(
                    'itembox[data-item="fishing_net"]'
                );
                if (fishingNetItembox) {
                    const heatFishingTab = document.createElement("itembox");
                    heatFishingTab.id = "heat-fishing-tab";
                    heatFishingTab.dataset.item = "heat";
                    heatFishingTab.classList.add("shadow", "hover");
                    heatFishingTab.setAttribute("data-bs-toggle", "tooltip");

                    heatFishingTab.innerHTML = `
                        <div class="center mt-1">
                            <img src="${UIT_IMAGE_URL_BASE}/heat.png" width="50px" height="50px">
                        </div>
                        <div class="center mt-2">
                            <item-display data-format="number" data-key="heat"></item-display>
                        </div>
                    `;
                    fishingNetItembox.before(heatFishingTab);
                }

                // Fishing Energy/Heat Info
                const panelFishing = document.querySelector("#panel-fishing");
                const progressBar = panelFishing.querySelector(".progress-bar");

                const hrElement = document.createElement("hr");
                progressBar.insertAdjacentElement("afterend", hrElement);

                const containerDiv = document.createElement("div");
                containerDiv.style.display = "flex";
                containerDiv.style.flexDirection = "column";

                const h5Element = document.createElement("h5");
                h5Element.textContent = "Fish Energy";

                const buttonElement = document.createElement("button");
                buttonElement.textContent = "Show";
                buttonElement.id = "fish_energy-visibility-button";
                buttonElement.addEventListener("click", show_hide);
                h5Element.appendChild(buttonElement);

                const innerDiv = document.createElement("div");
                innerDiv.id = "fishing-calculator-div";

                const rawFishEnergySpan = document.createElement("span");
                rawFishEnergySpan.textContent = "Total Raw Fish Energy: ";

                const rawFishEnergyNumberSpan = document.createElement("span");
                rawFishEnergyNumberSpan.textContent = "0";
                rawFishEnergyNumberSpan.id = "raw-fish-energy-number";
                rawFishEnergySpan.appendChild(rawFishEnergyNumberSpan);

                const br1Element = document.createElement("br");

                const heatToCookAllSpan = document.createElement("span");
                heatToCookAllSpan.textContent = "Heat To Cook All: ";

                const fishHeatRequiredNumberSpan = document.createElement("span");
                fishHeatRequiredNumberSpan.textContent = "0";
                fishHeatRequiredNumberSpan.id = "fish-heat-required-number";
                heatToCookAllSpan.appendChild(fishHeatRequiredNumberSpan);

                const br2Element = document.createElement("br");

                const totalCookedFishEnergySpan = document.createElement("span");
                totalCookedFishEnergySpan.textContent = "Total Cooked Fish Energy: ";

                const cookedFishEnergyNumberSpan = document.createElement("span");
                cookedFishEnergyNumberSpan.textContent = "0";
                cookedFishEnergyNumberSpan.id = "cooked-fish-energy-number";
                totalCookedFishEnergySpan.appendChild(cookedFishEnergyNumberSpan);

                innerDiv.appendChild(rawFishEnergySpan);
                innerDiv.appendChild(br1Element);
                innerDiv.appendChild(heatToCookAllSpan);
                innerDiv.appendChild(br2Element);
                innerDiv.appendChild(totalCookedFishEnergySpan);

                containerDiv.appendChild(h5Element);
                containerDiv.appendChild(innerDiv);

                hrElement.insertAdjacentElement("afterend", containerDiv);

                function show_hide() {
                    const button = document.querySelector(
                        "#fish_energy-visibility-button"
                    );
                    const div = document.querySelector("#fishing-calculator-div");

                    if (button.textContent === "Hide") {
                        div.style.display = "none";
                        button.textContent = "Show";
                    } else {
                        div.style.display = "block";
                        button.textContent = "Hide";
                    }
                }
                uitFishing().calcFishEnergy();
                document.querySelector("#fishing-calculator-div").style.display =
                    "none";
            },

            calcFishEnergy: function () {
                const fishRawEnergy = Object.keys(UIT_FISH_ENERGY_MAP);
                const fishHeat = Object.keys(UIT_FISH_HEAT_MAP);
                const fishCookedEnergy = Object.keys(UIT_FISH_ENERGY_MAP);
                let totalRawEnergy = 0;
                let totalHeat = 0;
                let totalCookedEnergy = 0;
                const collectorModeFish = getThis.getConfig("minusOneHeatInFishingTab");

                fishRawEnergy.forEach((fish) => {
                    let currentRawFish = getVar("raw_" + fish, 0, "int");
                    let currentCookedFish = getVar("cooked_" + fish, 0, "int");

                    if (currentRawFish > 0 && collectorModeFish) {
                        currentRawFish--;
                    }
                    if (currentCookedFish > 0 && collectorModeFish) {
                        currentCookedFish--;
                    }
                    const currentRawEnergy = currentRawFish * UIT_FISH_ENERGY_MAP[fish];
                    const currentHeat = currentRawFish * UIT_FISH_HEAT_MAP[fish];
                    const currentCookedEnergy =
                          currentCookedFish * UIT_FISH_ENERGY_MAP[fish];
                    totalRawEnergy += currentRawEnergy;
                    totalHeat += currentHeat;
                    totalCookedEnergy += currentCookedEnergy;
                });

                document.getElementById("raw-fish-energy-number").textContent =
                    totalRawEnergy.toLocaleString();
                document.getElementById("fish-heat-required-number").textContent =
                    totalHeat.toLocaleString();
                document.getElementById("cooked-fish-energy-number").textContent =
                    totalCookedEnergy.toLocaleString();
            },
        };
    };

    const uitInvention = function () {
        // No global constants/declarations
        return {
            hideOrbsAndRing: function () {
                if (Globals.currentPanel === "panel-invention") {
                    const masterRing = getVar("master_ring_assembled", 0, "int");
                    const fishingOrb = getVar(
                        "mega_shiny_glass_ball_fish_assembled",
                        0,
                        "int"
                    );
                    const leafOrb = getVar(
                        "mega_shiny_glass_ball_leaf_assembled",
                        0,
                        "int"
                    );
                    const logsOrb = getVar(
                        "mega_shiny_glass_ball_logs_assembled",
                        0,
                        "int"
                    );
                    const monstersOrb = getVar(
                        "mega_shiny_glass_ball_monsters_assembled",
                        0,
                        "int"
                    );
                    const volcanoTab = getVar("volcano_tablette_charged", 0, "int");
                    const ancientTab = getVar("ancient_tablette_charged", 0, "int");

                    const selectors = {
                        masterRing:
                        "#invention-table > tbody [data-invention-item=master_ring]",
                        fishingOrb:
                        "#invention-table > tbody [data-invention-item=mega_shiny_glass_ball_fish]",
                        leafOrb:
                        "#invention-table > tbody [data-invention-item=mega_shiny_glass_ball_leaf]",
                        logsOrb:
                        "#invention-table > tbody [data-invention-item=mega_shiny_glass_ball_logs]",
                        monstersOrb:
                        "#invention-table > tbody [data-invention-item=mega_shiny_glass_ball_monsters]",
                    };

                    const uiTweaksConfig = getThis.getConfig("hideOrbRing");

                    for (const orb in selectors) {
                        if (selectors.hasOwnProperty(orb)) {
                            const element = document.querySelector(selectors[orb]);
                            if (uiTweaksConfig) {
                                if (orb === "masterRing" && masterRing === 1) {
                                    element.style.display = "none";
                                } else if (orb === "fishingOrb" && fishingOrb === 1) {
                                    element.style.display = "none";
                                } else if (orb === "leafOrb" && leafOrb === 1) {
                                    element.style.display = "none";
                                } else if (orb === "logsOrb" && logsOrb === 1) {
                                    element.style.display = "none";
                                } else if (orb === "monstersOrb" && monstersOrb === 1) {
                                    element.style.display = "none";
                                } else {
                                    element.style.display = "";
                                }
                            } else {
                                if (orb !== "masterRing" && volcanoTab === 1) {
                                    element.style.display = "";
                                } else if (orb === "masterRing" && ancientTab === 1) {
                                    element.style.display = "";
                                } else {
                                    element.style.display = "none";
                                }
                            }
                        }
                    }
                }
            },
        };
    };

    const uitRocket = function () {
        window.uitMoonImg = `${UIT_IMAGE_URL_BASE}/moon.png`;
        window.uitSunImg = `${UIT_IMAGE_URL_BASE}/sun.png`;
        window.uitRocketImg = `${UIT_IMAGE_URL_BASE}/rocket.gif`;
        window.uitMegaRocketImg = `${UIT_IMAGE_URL_BASE}/mega_rocket.gif`;
        return {
            configChange: function () {
                const rocketETATimer = getThis.getConfig("rocketETATimer");
                if (rocketETATimer) {
                    document.getElementById("notification-rocket-timer").style.display =
                        "inline-block";
                    document.getElementById(
                        "notification-mega_rocket-timer"
                    ).style.display = "inline-block";
                } else {
                    document.getElementById("notification-rocket-timer").style.display =
                        "none";
                    document.getElementById(
                        "notification-mega_rocket-timer"
                    ).style.display = "none";
                }

                const hideRocketKM = getThis.getConfig("hideRocketKM");
                if (hideRocketKM) {
                    document.getElementById("notification-rocket-label").style.display =
                        "none";
                    document.getElementById(
                        "notification-mega_rocket-label"
                    ).style.display = "none";
                } else {
                    document.getElementById("notification-rocket-label").style.display =
                        "inline-block";
                    document.getElementById(
                        "notification-mega_rocket-label"
                    ).style.display = "inline-block";
                }

                const rocket_usable = getVar("rocket_usable", 0, "int");
                const rocket_travel_check = getVar(
                    "rocket_distance_required",
                    0,
                    "int"
                );
                const rocket_pot_timer_check = getVar("rocket_potion_timer", 0, "int");
                const rocket_check = getVar("mega_rocket", 0, "int");

                if (
                    getThis.getConfig("leftSideRocketInfoSection") &&
                    rocket_usable > 0
                ) {
                    document.getElementById("current-rocket-info").style.display =
                        "block";

                    if (getThis.getConfig("leftSideRocketInfo")) {
                        document.getElementById("rocket-travel-info").style.display =
                            "block";
                        document.getElementById("notification-mega_rocket").style.display =
                            "none";
                        document.getElementById("notification-rocket").style.display =
                            "none";
                    } else if (rocket_travel_check > 0 && rocket_check == 1) {
                        document.getElementById("notification-mega_rocket").style.display =
                            "block";
                        document.getElementById("rocket-travel-info").style.display =
                            "none";
                    } else if (rocket_travel_check > 0 && rocket_check == 0) {
                        document.getElementById("notification-rocket").style.display =
                            "block";
                        document.getElementById("rocket-travel-info").style.display =
                            "none";
                    } else {
                        document.getElementById("rocket-travel-info").style.display =
                            "none";
                    }

                    if (getThis.getConfig("leftSideRocketFuel")) {
                        document.getElementById("current-rocket-fuel-info").style.display =
                            "block";
                    } else {
                        document.getElementById("current-rocket-fuel-info").style.display =
                            "none";
                    }

                    if (getThis.getConfig("leftSideRocketPot")) {
                        document.getElementById("current-rocket-pot-info").style.display =
                            "block";
                        document.getElementById(
                            "notification-potion-rocket_potion_timer"
                        ).style.display = "none";
                    } else if (rocket_pot_timer_check > 0) {
                        document.getElementById(
                            "notification-potion-rocket_potion_timer"
                        ).style.display = "block";
                        document.getElementById("current-rocket-pot-info").style.display =
                            "none";
                    } else {
                        document.getElementById("current-rocket-pot-info").style.display =
                            "none";
                    }
                } else {
                    document.getElementById("current-rocket-info").style.display = "none";
                }
            },

            onLogin: function () {
                const moonImg = `${UIT_IMAGE_URL_BASE}/moon.png`;
                const sunImg = `${UIT_IMAGE_URL_BASE}/sun.png`;
                const rocketImg = `${UIT_IMAGE_URL_BASE}/rocket.png`;
                const megaRocketImg = `${UIT_IMAGE_URL_BASE}/mega_rocket.gif`;
                const currentLocation = uitRocket().currentLocation();
                const currentRocket = uitRocket().currentRocketImg();

                // "Moon & Sun Distance Info
                const rocketInfoSideCar = document.createElement("div");
                rocketInfoSideCar.id = "rocket-info-side_car";
                rocketInfoSideCar.style.paddingLeft = "20px";
                rocketInfoSideCar.style.paddingTop = "10px";
                rocketInfoSideCar.style.paddingBottom = "10px";

                rocketInfoSideCar.innerHTML = `
			<span id="rocket-info-label">MOON & SUN DISTANCE</span>
			<br/>
			<style type="text/css">
				.span2 {
					display: inline-block;
					text-align: right;
					width: 100px;
				}
			</style>
			<span onClick="websocket.send(Modals.clicks_rocket())" id="menu-bar-rocket_moon">
			<img id="moon-img" class="img-20" src="${uitMoonImg}">
			<span class="span2 rocket-dist_moon">0</span>
			<span style='margin-left:0.75em;' class="rocket-dist_moon-symbol">🔴</span>
			<img id="moon-rocket-img" class="img-20" src="${currentRocket}">
			<br/>
			</span>
			<span onClick="websocket.send(Modals.clicks_rocket())" id="menu-bar-rocket_sun">
			<img id "sun-img" class="img-20" src=${uitSunImg}>
			<span class="span2 rocket-dist_sun">0</span>
			<span style='margin-left:0.75em;' class="rocket-dist_sun-symbol">🔴</span>
			<img id="sun-rocket-img" class="img-20" src="${currentRocket}">
			<br/>
			</span>
		`;

                document
                    .getElementById("game-menu-bar-skills")
                    .insertAdjacentElement("beforebegin", rocketInfoSideCar);

                // "Current Rocket Info" side car
                const rocketInfoSideCarElement = document.getElementById(
                    "rocket-info-side_car"
                );

                // Append HTML after #rocket-info-side_car
                const currentRocketInfo = document.createElement("div");
                currentRocketInfo.id = "current-rocket-info";
                currentRocketInfo.style.borderTop = "1px solid rgba(66, 66, 66, 1)";
                currentRocketInfo.style.borderBottom = "1px solid rgba(66, 66, 66, 1)";
                currentRocketInfo.style.paddingTop = "10px";
                currentRocketInfo.style.paddingBottom = "10px";
                /*
                    Commented out code
                    <img id="rocket-current-travel-location-sun" class="img-20" src="${sunImg}">
                    <img id="rocket-type-img-mega" class="img-20" src="${megaRocketImg}">
                    <img id="rocket-type-img-reg" class="img-20" src="${rocketImg}">
                */
                currentRocketInfo.innerHTML = `
		<div style="padding-left: 20px;">
			<span id="current-rocket-info-label" style:>CURRENT ROCKET INFO</span>
			<br/>
			<div id="rocket-travel-info">
				<div id="rocket-travel-info-dist">
					<img id="rocket-current-travel-location" class="img-20" src="${currentLocation}">
					<span id="current-rocket-travel-distances" style="padding-left: 20px;">Loading...</span>
					<br/>
				</div>
				<div id="rocket-travel-info-eta">
					<img id="rocket-type-img" class="img-20" src="${currentRocket}">
					<span id="current-rocket-travel-times" style="padding-left: 20px;">00:00:00</span>
					<br/>
				</div>
			</div>
			<div onClick="switch_panels('panel-crafting')" id="current-rocket-fuel-info">
				<img id="rocket-rocket_fuel-img" class="img-20" src="${UIT_IMAGE_URL_BASE}/rocket_fuel.png">
				<span style="padding-left: 20px;">Rocket Fuel - </span>
				<span id="rocket-fuel-count">0</span>
				<br/>
			</div>
			<div onClick="switch_panels('panel-brewing')" id="current-rocket-pot-info">
				<img id="rocket-rocket_potion-img" class="img-20" src="${UIT_IMAGE_URL_BASE}/rocket_potion.png">
				<span style="padding-left: 20px;">Rocket Potion </span>
				(<span id="rocket-pot-count">0</span>)
				<span> - </span>
				<span id=rocket-pot-timer>0:00:00</span>
			</div>
		</div>
		`;
                rocketInfoSideCarElement.parentNode.insertBefore(
                    currentRocketInfo,
                    rocketInfoSideCarElement.nextSibling
                );

                const elementsToHide = ["sun-rocket-img", "moon-rocket-img"];

                elementsToHide.forEach((elementId) => {
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.style.display = "none";
                    }
                });

                const currentRocketInfoElement = document.getElementById(
                    "current-rocket-info"
                );
                if (currentRocketInfoElement) {
                    currentRocketInfoElement.style.display = "none";
                }
            },

            timeout: function () {
                const rocket_fuel = getVar("rocket_fuel", 0, "int");
                const rocket_pot_count = getVar("rocket_potion", 0, "int");
                document.querySelector("#rocket-fuel-count").textContent = rocket_fuel.toLocaleString();
                document.querySelector("#rocket-pot-count").textContent =
                    rocket_pot_count.toLocaleString();
            },

            onVar: function () {
                const rocket_usable = getVar("rocket_usable", 0, "int");
                const rocket_travel_check = getVar(
                    "rocket_distance_required",
                    0,
                    "int"
                );
                const rocket_pot_timer_check = getVar("rocket_potion_timer", 0, "int");
                const rocket_check = getVar("mega_rocket", 0, "int");
                if (
                    getThis.getConfig("leftSideRocketInfoSection") &&
                    rocket_usable > 0
                ) {
                    document.getElementById("current-rocket-info").style.display =
                        "block";

                    if (getThis.getConfig("leftSideRocketInfo")) {
                        document.getElementById("rocket-travel-info").style.display = "block";
                        document.getElementById("notification-mega_rocket").style.display = "none";
                        document.getElementById("notification-rocket").style.display = "none";
                    } else if (rocket_travel_check > 0 && rocket_check == 1) {
                        document.getElementById("notification-mega_rocket").style.display = "block";
                        document.getElementById("rocket-travel-info").style.display = "none";
                    } else if (rocket_travel_check > 0 && rocket_check == 0) {
                        document.getElementById("notification-rocket").style.display = "inline-block";
                        document.getElementById("rocket-travel-info").style.display = "none";
                    } else {
                        document.getElementById("rocket-travel-info").style.display = "none";
                    }

                    if (getThis.getConfig("leftSideRocketFuel")) {
                        document.getElementById("current-rocket-fuel-info").style.display =
                            "block";
                    } else {
                        document.getElementById("current-rocket-fuel-info").style.display =
                            "none";
                    }

                    if (getThis.getConfig("leftSideRocketPot")) {
                        document.getElementById("current-rocket-pot-info").style.display =
                            "block";
                        document.getElementById(
                            "notification-potion-rocket_potion_timer"
                        ).style.display = "none";
                    } else if (rocket_pot_timer_check > 0) {
                        document.getElementById(
                            "notification-potion-rocket_potion_timer"
                        ).style.display = "inline-block";
                        document.getElementById("current-rocket-pot-info").style.display =
                            "none";
                    } else {
                        document.getElementById("current-rocket-pot-info").style.display =
                            "none";
                    }
                } else {
                    document.getElementById("current-rocket-info").style.display = "none";
                }
            },

            varChange: function () {
                const status = getVar("rocket_status", "none", "string");
                const km = getVar("rocket_km", 0, "int");
                var rocket_quest = getVar("junk_planet_quest", 0, "int");
                var rQComp;
                if (rocket_quest == -1) {
                    rQComp = 2;
                } else {
                    rQComp = 1;
                }
                const total = getVar("rocket_distance_required", 0, "int");
                const rocket_pot = getVar("rocket_potion_timer", 0, "int");
                const rocket_type = getVar("mega_rocket", 0, "int");
                const rocket_fuel = getVar("rocket_fuel", 0, "int");
                const rocket_pot_count = getVar("rocket_potion", 0, "int");
                const rocket_pot_timer = format_time(rocket_pot);
                const rocket_speed_moon = rocket_pot * 12 * rQComp;
                const rocket_speed_sun = rocket_pot * 2400 * rQComp;
                let pot_diff = "";
                let pot_diff_mega = "";
                let label = "";
                let label_side = "";
                let label_side_car_dist = "";
                let label_side_car_eta = "";
                if (status == "to_moon" || status == "from_moon") {
                    const remaining =
                          status == "to_moon" ? (total - km) / rQComp : km / rQComp;
                    pot_diff = Math.round(remaining / 1.5) - rocket_pot * 8;
                    let eta = "";
                    if (rocket_pot > 0) {
                        if (rocket_speed_moon <= remaining * rQComp) {
                            eta = rocket_pot + pot_diff;
                        } else {
                            eta = Math.round(remaining / 12);
                        }
                    } else {
                        eta = Math.round(remaining / 1.5);
                    }
                    label = format_time(eta);
                    label_side = format_time(eta);
                    if (
                        getThis.getConfig("rocketETATimer") &&
                        !getThis.getConfig("hideRocketKM")
                    ) {
                        label = " - " + label;
                        label_side_car_dist =
                            km.toLocaleString() + "/" + total.toLocaleString();
                        label_side_car_eta = label_side;
                    }
                } else if (status == "to_sun" || status == "from_sun") {
                    const remaining =
                          status == "to_sun" ? (total - km) / rQComp : km / rQComp;
                    pot_diff_mega = Math.round(remaining / 300) - rocket_pot * 8;
                    let eta = "";
                    if (rocket_pot > 0) {
                        if (rocket_speed_sun <= remaining * rQComp) {
                            eta = rocket_pot + pot_diff_mega;
                        } else {
                            eta = Math.round(remaining / 2400);
                        }
                    } else {
                        eta = Math.round(remaining / 300);
                    }
                    label = format_time(eta);
                    label_side = format_time(eta);
                    if (
                        getThis.getConfig("rocketETATimer") &&
                        !getThis.getConfig("hideRocketKM")
                    ) {
                        label = " - " + label;
                        if (km == total) {
                            label_side_car_dist = "LANDED";
                        } else if (total == 0) {
                            label_side_car_dist = "IDLE";
                        } else {
                            label_side_car_dist =
                                km.toLocaleString() + "/" + total.toLocaleString();
                            label_side_car_eta = label_side;
                        }
                    }
                }

                document.querySelector("#current-rocket-travel-distances").textContent =
                    label_side_car_dist;
                document.querySelector("#current-rocket-travel-times").textContent =
                    label_side_car_eta;
                document.querySelector("#rocket-fuel-count").textContent = rocket_fuel.toLocaleString();
                document.querySelector("#rocket-pot-count").textContent =
                    rocket_pot_count.toLocaleString();
                document.querySelector("#rocket-pot-timer").textContent =
                    rocket_pot_timer;
            },

            rocketInfoUpdate: function (variable) {
                if (variable == "moon_distance") {
                    var distanceMoon = Number(var_moon_distance);
                    document
                        .getElementById("menu-bar-rocket_moon")
                        .querySelector(".rocket-dist_moon").textContent =
                        distanceMoon.toLocaleString();
                    var goodMoon = Number(getThis.getConfig("goodMoon"));
                    var rocketDistMoonSymbol = document
                    .getElementById("menu-bar-rocket_moon")
                    .querySelector(".rocket-dist_moon-symbol");
                    rocketDistMoonSymbol.textContent =
                        goodMoon >= distanceMoon ? "🟢" : "🔴";
                } else if (variable == "sun_distance") {
                    var distanceSun = Number(var_sun_distance);
                    document
                        .getElementById("menu-bar-rocket_sun")
                        .querySelector(".rocket-dist_sun").textContent =
                        distanceSun.toLocaleString();
                    var goodSun = Number(getThis.getConfig("goodSun"));
                    var rocketDistSunSymbol = document
                    .getElementById("menu-bar-rocket_sun")
                    .querySelector(".rocket-dist_sun-symbol");
                    rocketDistSunSymbol.textContent =
                        goodSun >= distanceSun ? "🟢" : "🔴";
                }
            },

            currentRocketImg: function () {
                if (getVar("mega_rocket_crafted", 0, "int") == 1) {
                    return uitMegaRocketImg;
                } else {
                    return uitRocketImg;
                }
            },

            currentLocation: function () {
                const status = getVar("rocket_status", "none", "string");
                if (
                    status === "to_sun" ||
                    status === "from_sun" ||
                    status === "at_sun"
                ) {
                    return uitSunImg;
                } else if (
                    status === "to_moon" ||
                    status === "from_moon" ||
                    status === "at_moon"
                ) {
                    return uitMoonImg;
                } else {
                    return uitMoonImg;
                }
            },

            rocketStatus: function () {
                const rocketStatus = getVar("rocket_status", "");
                if (rocketStatus.startsWith("to")) {
                    uitRocket().toLocation(rocketStatus);
                } else if (rocketStatus.startsWith("from")) {
                    uitRocket().fromLocation(rocketStatus);
                } else if (rocketStatus.startsWith("at")) {
                    uitRocket().atLocation(rocketStatus);
                } else {
                    uitRocket().noLocation();
                }
            },

            toLocation: function (location) {
                // Moon & Sun Distance Area
                const locationImg = uitRocket().currentLocation();
                const rocketImg = uitRocket().currentRocketImg();
                if (location.endsWith("moon")) {
                    document.getElementById("moon-rocket-img").src = rocketImg;
                    document.getElementById("moon-rocket-img").style.transform = "rotate(0deg)";
                    document.getElementById("moon-rocket-img").style.display = "inline-block";
                    document.getElementById("sun-rocket-img").style.display = "none";
                } else {
                    document.getElementById("sun-rocket-img").src = rocketImg;
                    document.getElementById("sun-rocket-img").style.transform = "rotate(0deg)";
                    document.getElementById("sun-rocket-img").style.display = "inline-block";
                    document.getElementById("moon-rocket-img").style.display = "none";
                }

                // Rocket Info Section
                document.getElementById("rocket-travel-info-dist").style.display = "";
                document.getElementById("rocket-current-travel-location").src = locationImg;
                document.getElementById("rocket-type-img").src = rocketImg;
                document.getElementById("rocket-type-img").style.transform = "rotate(0deg)";
            },

            fromLocation: function (location) {
                const status = uitRocket().currentLocation();
                // Moon & Sun Distance Area
                const locationImg = uitRocket().currentLocation();
                const rocketImg = uitRocket().currentRocketImg();
                if (location.endsWith("moon")) {
                    document.getElementById("moon-rocket-img").src = rocketImg;
                    document.getElementById("moon-rocket-img").style.transform = "rotate(180deg)";
                    document.getElementById("moon-rocket-img").style.display = "inline-block";
                    document.getElementById("sun-rocket-img").style.display = "none";
                } else {
                    document.getElementById("sun-rocket-img").src = rocketImg;
                    document.getElementById("sun-rocket-img").style.transform = "rotate(180deg)";
                    document.getElementById("sun-rocket-img").style.display = "inline-block";
                    document.getElementById("moon-rocket-img").style.display = "none";
                }

                // Rocket Info Section
                document.getElementById("rocket-travel-info-dist").style.display = "";
                document.getElementById("rocket-current-travel-location").src =
                    locationImg;
                document.getElementById("rocket-type-img").src = rocketImg;
                document.getElementById("rocket-type-img").style.transform =
                    "rotate(180deg)";
            },

            atLocation: function (location) {
                const status = uitRocket().currentLocation();
                // Moon & Sun Distance Area
                const locationImg = uitRocket().currentLocation();
                const rocketImg = uitRocket().currentRocketImg();
                if (location.endsWith("moon")) {
                    document.getElementById("moon-rocket-img").src = rocketImg;
                    document.getElementById("moon-rocket-img").style.transform = "rotate(135deg)";
                    document.getElementById("moon-rocket-img").style.display = "inline-block";
                    document.getElementById("sun-rocket-img").style.display = "none";
                } else {
                    document.getElementById("sun-rocket-img").src = rocketImg;
                    document.getElementById("sun-rocket-img").style.transform = "rotate(135deg)";
                    document.getElementById("sun-rocket-img").style.display = "inline-block";
                    document.getElementById("moon-rocket-img").style.display = "none";
                }

                // Rocket Info Section
                document.getElementById("rocket-travel-info").style.display = "";
                document.getElementById("rocket-current-travel-location").src = locationImg;
                document.getElementById("rocket-type-img").src = rocketImg;
                document.getElementById("rocket-type-img").style.transform = "rotate(135deg)";
                document.getElementById("current-rocket-travel-times").textContent = "LANDED";
            },

            noLocation: function () {
                // Moon & Sun Distance Area
                document.getElementById("moon-rocket-img").style.display = "none";
                document.getElementById("sun-rocket-img").style.display = "none";

                // Rocket Info Section
                document.getElementById("rocket-travel-info-dist").style.display = "none";
                document.getElementById("rocket-type-img").style.transform =
                    "rotate(-45deg)";
                document.getElementById("current-rocket-travel-times").textContent =
                    "IDLE";
            },
        };
    };

    const uitMisc = function () {
        // Globals constants
        return {
            initStyles: function () {
                const style = document.createElement("style");
                style.id = "styles-ui-tweaks";
                style.textContent = `
				#chat-top {
				  display: flex;
				  flex-direction: row;
				  justify-content: left;
				}
				#chat-top > button {
				  margin-left: 2px;
				  margin-right: 2px;
				  white-space: nowrap;
				}
				#content.side-chat {
				  display: grid;
				  column-gap: 0;
				  row-gap: 0;
				  grid-template-columns: 2fr minmax(300px, 1fr);
				  grid-template-rows: 1fr;
				}
				#content.side-chat #game-chat {
				  max-height: calc(100vh - 32px);
				}
				#content.side-chat #game-chat > :first-child {
				  display: grid;
				  column-gap: 0;
				  row-gap: 0;
				  grid-template-columns: 1fr;
				  grid-template-rows: auto 1fr auto;
				  height: calc(100% - 16px);
				}
				#content.side-chat #chat-area {
				  height: auto !important;
				}
				.farming-plot-wrapper.condensed {
                  min-width: 115px;
				  display: flex;
				  flex-direction: row;
				  justify-items: flex-start;
				  width: fit-content;
                  height: unset;
                  min-height: unset;
                  max-height: unset;
				}
				.farming-plot-wrapper.condensed > span {
				  width: 100px;
				  max-height: 200px;
				}
				.farming-plot-wrapper.condensed img {
				  width: 100px;
				}
				#panel-gathering .gathering-box.condensed {
				  height: 240px;
				  position: relative;
				  margin: 4px auto;
				  padding-left: 4px;
				  padding-right: 4px;
				}
				#panel-gathering .gathering-box.condensed img.gathering-area-image {
				  position: absolute;
				  top: 10px;
				  left: 10px;
				  width: 68px;
				  height: 68px;
				}
				#panel-gathering .gathering-box.condensed br:nth-child(2),
				#panel-gathering .gathering-box.condensed br:nth-child(3)
				{
				  display: none;
				}
				#panel-mining.add-arrow-controls itembox {
				  position: relative;
				}
				#panel-mining:not(.add-arrow-controls) itembox .arrow-controls {
				  display: none !important;
				}
				itembox .arrow-controls {
				  position: absolute;
				  top: 0px;
				  right: 2px;
				  height: 100%;
				  padding: 2px;
				  display: flex;
				  flex-direction: column;
				  justify-content: space-around;
				  align-items: center;
				}
				itembox .arrow {
				  border: solid white;
				  border-width: 0 4px 4px 0;
				  display: inline-block;
				  padding: 6px;
				  cursor: pointer;
				  opacity: 0.85;
				}
				itembox .arrow:hover {
				  opacity: 1;
				  border-color: yellow;
				}
				itembox .arrow.up {
				  transform: rotate(-135deg);
				  -webkit-transform: rotate(-135deg);
				  margin-top: 3px;
				}
				itembox .arrow.down {
				  transform: rotate(45deg);
				  -webkit-transform: rotate(45deg);
				  margin-bottom: 3px;
				}

                .itembox-large {
                  width: 204px;
                  margin-bottom: 15px;
                }

				#menu-bar-sd_watch {
					margin-left: 20px;
				}
				.sd-watch-text {
					padding-left: 20px;
				}
				.sd-watch-text2 {
					padding-left: 0px;
				}
				.game-menu-bar-left-table-btn tr
				{
				  background-color: transparent !important;
				  border:0 !important;
				  font-size:medium;
				}
				.hover-menu-bar-item:hover {
				  background: #256061 !important;
				  border:0 !important;
				  filter:unset;
				  font-size:medium;
				}
                .hover-menu-bar-item-combat:hover {
                    div {
                        background: #256061 !important;
                        border:0 !important;
				        filter:unset;
				        font-size:medium;
                    }
				    background: #256061 !important;
                    border:0 !important;
				    filter:unset;
				    font-size:medium;
				}
                .thin-progress-bar {
				  background:#437b7c !important;
				  border:0 !important;
				  height:unset;
				}
				.thin-progress-bar-inner {
				  background:#88e8ea !important;
				}
				.game-menu-bar-left-table-btn td{
				  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
                  color:white;
				}

                .game-menu-bar-left-table-btn div td{
				  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
				  background-color: transparent !important;
				}

                #menu-bar-archery-table-btn-wrapper {
                  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
                }

                #menu-bar-magic-table-btn-wrapper {
                  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
                }

				.game-menu-bar-left-table-btn {
				  background-color: transparent !important;
				}
				.left-menu-item {
				  margin-bottom:unset;
				  font-size:medium;
				}
				.left-menu-item > img {
				  margin-left: 20px;
				  margin-right: 20px;
				}
                .raids-option-bar {
                  width: 90px !important;
                  height: 25px !important;
                  margin-right: 5px !important;
                }
                .raids-buttons {
                justify-content: center !important;
                align-items: center !important;
                border-radius: 5px !important;
                }
				`;

                document.head.appendChild(style);
            },

            fixGKeys: function () {
                // Get the original itembox
                const itemBox = document.getElementById('itembox-fight-guardians');

                // Update the main div's style
                itemBox.style.overflow = 'hidden';
                itemBox.style.marginBottom = '-20px';

                // Select the first and second child divs
                const firstDiv = itemBox.querySelector('.mt-1');
                const secondDiv = itemBox.querySelector('.mt-2');

                // Clear existing content from the firstDiv and create a new structure
                firstDiv.innerHTML = `
        <span style="display: inline-flex;width: 116px;height 50px;">
            <span id="fight-guardians-itemxbox-large-green_gaurdian_key" style="background-color: rgb(0, 0, 0, 0.5); padding: 2px;">
                <img class="w25" src="${UIT_IMAGE_URL_BASE}/green_gaurdian_key.png" title="green_gaurdian_key">
                <item-display data-format="number" data-key="green_gaurdian_key">290</item-display>
            </span>
            <span id="fight-guardians-itemxbox-large-blue_gaurdian_key" style="background-color: rgba(0, 0, 0, 0.5); padding: 2px;">
                <img class="w25" src="${UIT_IMAGE_URL_BASE}/blue_gaurdian_key.png" title="blue_gaurdian_key">
                <item-display data-format="number" data-key="blue_gaurdian_key">430</item-display>
            </span>
            <span id="fight-guardians-itemxbox-large-purple_gaurdian_key" style="background-color: rgba(0, 0, 0, 0.5); padding: 2px;">
                <img class="w25" src="${UIT_IMAGE_URL_BASE}/purple_gaurdian_key.png" title="purple_gaurdian_key">
                <item-display data-format="number" data-key="purple_gaurdian_key">33</item-display>
            </span>
            <span id="fight-guardians-itemxbox-large-mixed_gaurdian_key" style="background-color: rgba(0, 0, 0, 0.5); padding: 2px;">
                <img class="w25" src="${UIT_IMAGE_URL_BASE}/mixed_gaurdian_key.png" title="mixed_gaurdian_key">
                <item-display data-format="number" data-key="mixed_gaurdian_key">19</item-display>
            </span>
        </span>
				`;

                // Modify the second div
                secondDiv.textContent = 'Guardian Keys';
            },

            recolorTableText: function () {
                const tables = [document.getElementById("brewing-table"), document.getElementById("brewing-shortcut-table"), document.getElementById("crafting-table"), document.getElementById("invention-table"), document.getElementById("cooks_book-table")];
                //document.querySelectorAll(".font-small.color-grey").forEach((cell) => { cell.style.color = "black"; cell.style.fontSize = "1em";}) //changes more than just table text
                document.querySelectorAll(".font-small.color-grey").forEach((cell) => {
                    if (tables.includes(cell.parentNode.parentNode.parentNode) || tables.includes(cell.parentNode.parentNode.parentNode.parentNode)) {
                        cell.style.color = "black";
                        cell.style.fontSize = "1em";
                    }
                })
                //document.querySelectorAll(".p-2.color-grey.font-small").forEach((cell) => { cell.style.color = "black"; cell.style.fontSize = "1em";})  //changes more than just table text
                document.querySelectorAll(".p-2.color-grey.font-small").forEach((cell) => {
                    if (tables.includes(cell.parentNode.parentNode.parentNode) || tables.includes(cell.parentNode.parentNode.parentNode.parentNode)) {
                        cell.style.color = "black";
                        cell.style.fontSize = "1em";
                    }
                })
            },

            fixAchiLabels: function () {
                Achievements.refresh_achievement_area = function (skill, difficulty)  {
                    var html = "";

                    html += "<button onclick='switch_panels(\"panel-achievements\")'>Go Back</button>"
                    html += "<h1 class='center'>" + skill.toUpperCase() + " <span class='color-grey'>("+difficulty.toUpperCase()+")</span></h1>";

                    html += "<center>";
                    for(var entry of Achievements._get_dict(skill, difficulty))
                    {
                        html += "<div class='achievement-entry mt-3 shadow' style='color: black !important'>";
                        html += entry.description
                        if(Items.getItem("ach_"+difficulty+"_"+entry.slug) == 1)
                            html += "<span class='float-end color-green'>Complete</span>";
                        else
                            html += "<span class='float-end color-red'>Incomplete</span>";
                        html += "</div>";
                    }

                    html += "<br />";
                    html += "<br />";
                    html += "<hr />";
                    html += "<br />";
                    html += "<h2 class='center'>ACHIEVEMENT PERK</h2>";
                    html += "<h5 class='center color-grey'>Complete all the achievements in this section for the achievement perk.</h5>";
                    html += "<div class='achievement-entry achievement-entry-reward mt-3 shadow' style='color: black !important'>";
                    html += Achievements._get_reward_text(skill, difficulty);
                    if(Achievements.has_completed_set(skill, difficulty))
                        html += "<span class='float-end color-green'>ACTIVE</span>";
                    else
                        html += "<span class='float-end color-red'>INACTIVE</span>";
                    html += "</div>";
                    html += "</center>";

                    document.getElementById("achievements-area").innerHTML = html;
                    document.getElementById("achievements-buttons").style.display = "none";
                }
            },
            replaceLinks: function(message) {
                return anchorme({
                    input: message,
                    options: {
                        attributes: {
                            target: "_blank"
                        }
                    }
                }).replace(/<a(.*?)href="(.+?)">(.*?)<\/a>(-*)/g, '<a$1href="$2$4">$3$4</a>');
            }
        };
    };

    const uitRaids = function () {
        window.uitSoloRaiding = false;
        return {
            initElements: function () {
                var optionsContainer = document.createElement('div');
                optionsContainer.id = 'raid-options-container';
                optionsContainer.style.marginBottom = '10px'

                var raidLocationDropdown = document.createElement('select');
                raidLocationDropdown.id = 'raid-location-dropdown';
                raidLocationDropdown.className = 'raids-option-bar';
                var locations = ['Toybox', 'Mansion'];
                locations.forEach(function (location) {
                    var option = document.createElement('option');
                    option.value = location.toLowerCase();
                    option.text = location;
                    raidLocationDropdown.appendChild(option);
                });

                // Create the second dropdown for raid difficulty
                var raidDifficultyDropdown = document.createElement('select');
                raidDifficultyDropdown.id = 'raid-difficulty-dropdown';
                raidDifficultyDropdown.className = 'raids-option-bar';
                var difficulties = ['Practice', 'Normal', 'Hard'];
                difficulties.forEach(function (difficulty) {
                    var option = document.createElement('option');
                    option.value = difficulty.toLowerCase();
                    option.text = difficulty;
                    raidDifficultyDropdown.appendChild(option);
                });

                // Create the third dropdown for Public/Private
                var raidVisibilityDropdown = document.createElement('select');
                raidVisibilityDropdown.id = 'raid-visibility-dropdown';
                raidVisibilityDropdown.className = 'raids-option-bar';
                var visibility = ['Public', 'Private']
                visibility.forEach(function (vis) {
                    var option = document.createElement('option');
                    option.value = vis.toLowerCase();
                    option.text = vis;
                    raidVisibilityDropdown.appendChild(option);
                });

                let advertRaid = document.createElement('button');
                advertRaid.id = 'raids-advert-button';
                advertRaid.innerText = 'Advertise';
                advertRaid.onclick = function () {
                    uitRaids().advertRaid();
                    this.disabled = true;
                    setTimeout(() => {
                        this.disabled = false;
                    }, 3000);
                }
                advertRaid.className = 'button raids-option-bar raids-buttons';
                advertRaid.style.display = 'none';

                let startRaid = document.createElement('button');
                startRaid.id = 'raids-start-button';
                startRaid.innerText = 'Start Raid';
                startRaid.onclick = function () {
                    uitRaids().startRaid();
                    this.disabled = true;
                    setTimeout(() => {
                        this.disabled = false;
                    }, 30000);
                }
                startRaid.className = 'button raids-option-bar raids-buttons';
                startRaid.style.display = 'none';

                let soloRaid = document.createElement('input');
                soloRaid.id = 'raids-solo-button';
                soloRaid.className = 'raid-button';
                soloRaid.value = 'Solo Raid';
                soloRaid.type = 'button';


                // Find the insertion point in the DOM
                var insertionPoint = document.getElementById('raids-create-or-join-team-btns');

                // Insert the dropdowns into the DOM before the specified element
                optionsContainer.appendChild(raidLocationDropdown);
                optionsContainer.appendChild(raidDifficultyDropdown);
                optionsContainer.appendChild(raidVisibilityDropdown);
                optionsContainer.appendChild(advertRaid);
                optionsContainer.appendChild(startRaid);
                insertionPoint.appendChild(soloRaid);
                insertionPoint.parentNode.insertBefore(optionsContainer, insertionPoint);

                document
                    .getElementById('raids-create-or-join-team-btns')
                    .innerHTML = document.getElementById('raids-create-or-join-team-btns')
                    .innerHTML.replace("Modals.raid_create_team_button()", "uitRaids().createRaid()");


                document.getElementById('raids-solo-button').addEventListener('click', function() {
                    uitRaids().soloRaid();
                });
                const panel = document.getElementById('raids-team-panel');
                panel.innerHTML = panel.innerHTML.replace(/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/g, '<br/>');
            },
            createRaid: function () {
                let locationRaids = document.getElementById('raid-location-dropdown').value;
                let modeRaids = document.getElementById('raid-difficulty-dropdown').value;
                websocket.send(`CREATE_RAID_TEAM=0`);
                document.getElementById('raids-start-button').style.display = 'inline-flex';
                document.getElementById('raids-advert-button').style.display = 'inline-flex';
            },
            advertRaid: function () {
                let locationRaids = document.getElementById('raid-location-dropdown').selectedOptions[0].text;
                let modeRaids = document.getElementById('raid-difficulty-dropdown').selectedOptions[0].text;;
                let raidPW = document.getElementById('raids-team-panel-uuid').innerText;
                let users = ['user1', 'user2', 'user3', 'user4'];
                let userCount = 0;
                users.forEach((user) => {
                    if (!document.getElementById(`raids-team-panel-${user}`).innerHTML.includes('(none)')) {
                        userCount++;
                    }
                })
                let neededCount = 4 - userCount;

                let fp = {
                    toybox: {
                        practice: "0 FP",
                        normal: "4k FP",
                        hard: "4k FP"
                    },
                    mansion: {
                        practice: "0 FP",
                        normal: "8k FP",
                        hard: "8k FP"
                    },
                }

                let energy = {
                    toybox: {
                        practice: "0 Energy",
                        normal: "10k Energy",
                        hard: "50k Energy"
                    },
                    mansion: {
                        practice: "0 Energy",
                        normal: "100k Energy",
                        hard: "250k Energy"
                    },
                }

                websocket.send(`CHAT=${raidPW} : [${locationRaids}] || [${modeRaids}] || [${fp[locationRaids.toLowerCase()][modeRaids.toLowerCase()]} & ${energy[locationRaids.toLowerCase()][modeRaids.toLowerCase()]}] || [${neededCount} Open Spots]`);
                //console.log(`${raidPW} : [${locationRaids}] || [${modeRaids}] || [${fp[locationRaids.toLowerCase()][modeRaids.toLowerCase()]} &  ${energy[locationRaids.toLowerCase()][modeRaids.toLowerCase()]}] || [${neededCount} Open Spots]`)
            },
            startRaid: function () {
                let locationRaids = document.getElementById('raid-location-dropdown').value;
                let modeRaids = document.getElementById('raid-difficulty-dropdown').value;
                let locationMatch = {
                    toybox: 2,
                    mansion: 1,
                };
                let modeMatch = {
                    practice: 0,
                    normal: 1,
                    hard: 2
                };

                let locationValue = locationMatch[locationRaids];
                let modeValue = modeMatch[modeRaids];
                websocket.send(`START_RAID_${locationValue}=${modeValue}`);
            },
            soloRaid: function () {
                let locationRaids = document.getElementById('raid-location-dropdown').value;
                let modeRaids = document.getElementById('raid-difficulty-dropdown').value;
                let locationMatch = {
                    toybox: 2,
                    mansion: 1,
                };
                let modeMatch = {
                    practice: 0,
                    normal: 1,
                    hard: 2
                };

                let locationValue = locationMatch[locationRaids];
                let modeValue = modeMatch[modeRaids];
                websocket.send(`START_RAID_${locationValue}=${modeValue}`);
                uitSoloRaiding = true;
            },
        }
    }

    const uitHoliday = function () {
        window.uitEaster = [
            "chocolate_scythe",
            "chocolate_skeleton_sword",
            "chocolate_dagger",
            "chocolate_stinger",
            "chocolate_fish",
            "chocolate_logs",
            "chocolate_mushroom",
            "chocolate_leaf",
            "chocolate_bar",
            "chocolate_ore"
        ];
        return {
            easter2024: function () {
                let certificateElement = document.querySelector("itembox[data-item=chocolate_certificate]");
                if (certificateElement) {
                    certificateElement.setAttribute("data-item", "playtime");
                    uitEaster.forEach((item) => {
                        let element = document.querySelector(`itembox[data-item=${item}`);
                        element.setAttribute("data-item", "playtime");
                        certificateElement.insertAdjacentElement("afterEnd", element);
                        element.insertAdjacentHTML("beforebegin", `\n\n`)
                        let numElem = element.querySelector(`item-display[data-key=${item}`);
                        element.className = "itembox-fight shadow hover";
                    });
                    document.getElementById("panel-keyitems");
                }
            }
        }
    }

    const uitDustPotions = function () {
        window.dustPots = [
            "cooks_dust",
            "cooks_dust_potion",
            "fighting_dust_potion",
            "fighting_dust",
            "tree_dust",
            "tree_dust_potion",
            "farm_dust",
            "farm_dust_potion",
        ];
        return {
            cloneDust: function () {
                const brewing = document.getElementById("panel-brewing");
                const cooking = document.getElementById("panel-cooking").querySelector("itembox[data-item=maggots]");
                const fighting = document.getElementById("combat-badge-itembox");
                const woodcut = document.getElementById("panel-woodcutting").querySelector("itembox[data-item=flexible_logs]");
                const farming = document.getElementById("panel-farming").querySelector("itembox[data-item=bonemeal_bin]");

                dustPots.forEach((item) => {
                    let moveMe = brewing.querySelector(`itembox[data-item=${item}]`).cloneNode(true);
                    if (item.startsWith("cooks")) {
                        cooking.insertAdjacentElement("beforebegin", moveMe);
                        moveMe.insertAdjacentHTML("afterend", `\n\n`);
                    }
                    if (item.startsWith("fighting")) {
                        fighting.insertAdjacentElement("beforebegin", moveMe);
                        moveMe.insertAdjacentHTML("afterend", `\n\n`);
                    }
                    if (item.startsWith("tree")) {
                        woodcut.insertAdjacentElement("beforebegin", moveMe);
                        moveMe.insertAdjacentHTML("afterend", `\n\n`);
                    }
                    if (item.startsWith("farm")) {
                        farming.insertAdjacentElement("beforebegin", moveMe);
                        moveMe.insertAdjacentHTML("afterend", `\n\n`);
                    }
                });

            }
        }
    }

    // End New Base Code Re-work
    // Window Calls for initializing
    window.uitLevel = uitLevel;
    window.uitPurpleKey = uitPurpleKey;
    window.uitCriptoe = uitCriptoe;
    window.uitTableLabels = uitTableLabels;
    window.uitFishing = uitFishing;
    window.uitInvention = uitInvention;
    window.uitRocket = uitRocket;
    window.uitMisc = uitMisc;
    window.uitRaids = uitRaids;
    window.uitHoliday = uitHoliday;

    let onLoginLoaded = false;

    // will be overwritten if data available in IdlePixelPlus.info
    const SMELT_TIMES = {
        copper: 3,
        iron: 6,
        silver: 15,
        gold: 50,
        promethium: 100,
        titanium: 500,
        ancient_ore: 1800,
        dragon_ore: 3600,
        faradox_ore: 12*3600,
    };

    const copperItemBox = document.querySelector("itembox[data-item=copper] img");

    const FONTS = [];
    const FONT_DEFAULT = "IdlePixel Default";
    const FONT_FAMILY_DEFAULT = 'pixel, "Courier New", Courier, monospace';
    (async () => {
        const FONTS_CHECK = new Set(
            [
                // Windows 10
                "Arial",
                "Arial Black",
                "Bahnschrift",
                "Calibri",
                "Cambria",
                "Cambria Math",
                "Candara",
                "Comic Sans MS",
                "Consolas",
                "Constantia",
                "Corbel",
                "Courier New",
                "Ebrima",
                "Franklin Gothic Medium",
                "Gabriola",
                "Gadugi",
                "Georgia",
                "HoloLens MDL2 Assets",
                "Impact",
                "Ink Free",
                "Javanese Text",
                "Leelawadee UI",
                "Lucida Console",
                "Lucida Sans Unicode",
                "Malgun Gothic",
                "Marlett",
                "Microsoft Himalaya",
                "Microsoft JhengHei",
                "Microsoft New Tai Lue",
                "Microsoft PhagsPa",
                "Microsoft Sans Serif",
                "Microsoft Tai Le",
                "Microsoft YaHei",
                "Microsoft Yi Baiti",
                "MingLiU-ExtB",
                "Mongolian Baiti",
                "MS Gothic",
                "MV Boli",
                "Myanmar Text",
                "Nirmala UI",
                "Palatino Linotype",
                "Segoe MDL2 Assets",
                "Segoe Print",
                "Segoe Script",
                "Segoe UI",
                "Segoe UI Historic",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "SimSun",
                "Sitka",
                "Sylfaen",
                "Symbol",
                "Tahoma",
                "Times New Roman",
                "Trebuchet MS",
                "Verdana",
                "Webdings",
                "Wingdings",
                "Yu Gothic",
                // macOS
                "American Typewriter",
                "Andale Mono",
                "Arial",
                "Arial Black",
                "Arial Narrow",
                "Arial Rounded MT Bold",
                "Arial Unicode MS",
                "Avenir",
                "Avenir Next",
                "Avenir Next Condensed",
                "Baskerville",
                "Big Caslon",
                "Bodoni 72",
                "Bodoni 72 Oldstyle",
                "Bodoni 72 Smallcaps",
                "Bradley Hand",
                "Brush Script MT",
                "Chalkboard",
                "Chalkboard SE",
                "Chalkduster",
                "Charter",
                "Cochin",
                "Comic Sans MS",
                "Copperplate",
                "Courier",
                "Courier New",
                "Didot",
                "DIN Alternate",
                "DIN Condensed",
                "Futura",
                "Geneva",
                "Georgia",
                "Gill Sans",
                "Helvetica",
                "Helvetica Neue",
                "Herculanum",
                "Hoefler Text",
                "Impact",
                "Lucida Grande",
                "Luminari",
                "Marker Felt",
                "Menlo",
                "Microsoft Sans Serif",
                "Monaco",
                "Noteworthy",
                "Optima",
                "Palatino",
                "Papyrus",
                "Phosphate",
                "Rockwell",
                "Savoye LET",
                "SignPainter",
                "Skia",
                "Snell Roundhand",
                "Tahoma",
                "Times",
                "Times New Roman",
                "Trattatello",
                "Trebuchet MS",
                "Verdana",
                "Zapfino",
                // other
                "Helvetica",
                "Garamond",
            ].sort()
        );
        await document.fonts.ready;
        for (const font of FONTS_CHECK.values()) {
            if (document.fonts.check(`12px "${font}"`)) {
                FONTS.push(font);
            }
        }
        FONTS.unshift("IdlePixel Default");
    })();

    const BG_COLORS = {
        "#chat-area .server_message": "",
        body: "rgb(200, 247, 248)",
        ".top-bar": getComputedStyle(document.querySelector(".game-top-bar-upper"))
        .backgroundColor,
        "#menu-bar": getComputedStyle(document.querySelector("#menu-bar"))
        .backgroundColor,
        "#chat-area": getComputedStyle(document.querySelector("#chat-area"))
        .backgroundColor,
        "#game-chat": getComputedStyle(document.querySelector("#game-chat"))
        .backgroundColor,
        "#panels": getComputedStyle(document.querySelector("#panels"))
        .backgroundColor,
    };

    const FONT_COLORS = {
        "#chat-area .server_message": "",
        "#chat-area": document.querySelector("#chat-area")
        ? getComputedStyle(document.querySelector("#chat-area")).color
        : "",
        "#chat-area .color-green": document.querySelector("#chat-area .color-green")
        ? getComputedStyle(document.querySelector("#chat-area .color-green"))
        .color
        : "",
        "#chat-area .color-grey": document.querySelector("#chat-area .color-grey")
        ? getComputedStyle(document.querySelector("#chat-area .color-grey")).color
        : "",
        "#chat-area .chat-username": document.querySelector(
            "#chat-area .chat-username"
        )
        ? getComputedStyle(document.querySelector("#chat-area .chat-username"))
        .color
        : "",
        "#panels": document.querySelector("#panels")
        ? getComputedStyle(document.querySelector("#panels")).color
        : "",
        "#panels .color-grey": document.querySelector("#panels .color-grey")
        ? getComputedStyle(document.querySelector("#panels .color-grey")).color
        : "",
        "#panels .font-large": document.querySelector("#panels .font-large")
        ? getComputedStyle(document.querySelector("#panels .font-large")).color
        : "",
        "#menu-bar-button .color-grey": document.querySelector(
            "#panels .color-grey"
        )
        ? getComputedStyle(document.querySelector("#panels .color-grey")).color
        : "",
    };

    const CHAT_UPDATE_FILTER = [
        "#chat-area",
        "#chat-area .color-green",
        "#chat-area .color-grey",
        "#chat-area .chat-username",
        "#chat-area .server_message",
    ];

    const PANEL_UPDATE_FILTER = ["#panels"];

    let condensedLoaded = false;

    class UITweaksPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("ui-tweaks", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description,
                },
                config: [
                    {
                        label:
                        "------------------------------------------------<br/>Chat/Images<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "font",
                        label: "Primary Font",
                        type: "select",
                        options: FONTS,
                        default: FONT_DEFAULT,
                    },
                    {
                        id: "sideChat",
                        label: "Side Chat",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "condensedUI",
                        label: "Enable Condensed UI and Left Bar Tweaks",
                        type: "boolean",
                        default: true,
                    },
                    /*{
                        id: "pinChat",
                        label: "Pin Chat on Side (Only works if Side Chat is active. Thanks BanBan)",
                        type: "boolean",
                        default: false
                    },*/
                    {
                        id: "chatLimit",
                        label: "Chat Message Limit (&leq; 0 means no limit)",
                        type: "int",
                        min: -1,
                        max: 5000,
                        default: 0,
                    },
                    {
                        id: "combatChat",
                        label: "Enable Chat to be visible while in combat.",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "convertNameLink",
                        label: "Enable alternate links when clicking player name in chat.",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "imageTitles",
                        label: "Image Mouseover",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "tableLabels",
                        label:
                        "Turn on item component labels for crafting/brewing/invention<br/>May require restart to disable",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "scrollingNotifications",
                        label: "Turn on making the notifications area scrollable at the top of the screen<br/>Will set a standard size and stop screen movement as notifications are added and removed.",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "lowerToast",
                        label: "Lower Toast (top-right popup)",
                        type: "boolean",
                        default: false,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Combat<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "fightPointsStats",
                        label: "Fight Points in Left Menu",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "combatInfoSideSelect",
                        label:
                        "Choose which side you want to see the<br/>Fight Points / Rare Pot Duration / Loot Pot info on.<br/>Left (Player info) || Right (Enemy Info)",
                        type: "select",
                        default: "left",
                        options: [
                            { value: "left", label: "Left - Player Side" },
                            { value: "right", label: "Right - Enemy Side" },
                        ],
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Condensed Information<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "condenseWoodcuttingPatches",
                        label: "Condensed Woodcutting Patches",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "condenseFarmingPatches",
                        label: "Condensed Farming Patches",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "condenseGatheringBoxes",
                        label: "Condensed Gathering Boxes",
                        type: "boolean",
                        default: false,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Fishing<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "heatInFishingTab",
                        label: "Heat In Fishing Tab",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "minusOneHeatInFishingTab",
                        label: "Heat In Fishing Tab (Minus 1 for collectors)",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "hideAquarium",
                        label: "Hide the notification for Aquarium needing to be fed",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "hideBoat",
                        label: "Hide the notification for Boats (Timer and Collect)",
                        type: "boolean",
                        default: false,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Invention<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "hideOrbRing",
                        label: "Hide crafted glass orbs and master ring in invention",
                        type: "boolean",
                        default: false,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Misc<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "robotReady",
                        label: "Show Robot Ready",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "moveSDWatch",
                        label: "Move Stardust Watch notifications to left side pannel",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "showHeat",
                        label: "Show heat on left side pannel",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "showPurpleKeyNotification",
                        label: "Show quick button notification for purple key",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "hideCrystalBall",
                        label: "Hide the notification for crystal ball",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "merchantReady",
                        label: "Show Merchant Ready notification",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "mixerTimer",
                        label: "Show Brewing Mixer timer and charges available",
                        type: "boolean",
                        default: true,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Oil<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "oilSummaryMining",
                        label: "Oil Summary, Mining Panel",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "oilSummaryCrafting",
                        label: "Oil Summary, Crafting Panel",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "oilFullNotification",
                        label: "Oil Full",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "oilGainNotification",
                        label: "Oil Gain Timer",
                        type: "boolean",
                        default: true,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Rocket<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "rocketETATimer",
                        label: "Rocket Notification ETA",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "leftSideRocketInfoSection",
                        label:
                        "Enable moving of rocket information to left side (hides notifications)",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "leftSideRocketInfo",
                        label:
                        "Enable Rocket Distance/Travel Time on left side (hides rocket notification)",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "leftSideRocketFuel",
                        label: "Enable Rocket Fuel Info on left side.",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "leftSideRocketPot",
                        label:
                        "Enable Rocket Pot Info on left side. (hides rocket pot notification)",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "hideRocketKM",
                        label: "Rocket Notification Hide KM",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "goodMoon",
                        label:
                        "Good moon distance<br/>(Range: 250,000 - 450,000)<br/>Type entire number without ','",
                        type: "int",
                        default: 300000,
                    },
                    {
                        id: "goodSun",
                        label:
                        "Good sun distance<br/>(Range: 100,000,000 - 200,000,000)<br/>Type entire number without ','",
                        type: "int",
                        default: 130000000,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Smelting/Mining<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "miningMachineArrows",
                        label: "Mining Machine Arrows",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "smeltingNotificationTimer",
                        label: "Smelting Notification Timer",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "furnaceEmptyNotification",
                        label: "Furnace Empty Notification",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "hideDrillNotifications",
                        label: "Hide Active Mining Machine Notifications on top bar",
                        type: "boolean",
                        default: false,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>BG Color Overrides<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "disableBGColorOverrides",
                        label:
                        "Disable background color overrides (Check = disabled)<br/>Disable the BG Color Overrides if you are wanting to use<br/>the built in settings for the game for your colors<br/>REFRESH REQUIRED WHEN DISABLING THE BG COLORS<br/>",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "color-enabled-body",
                        label: "Main Background: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "color-body",
                        label: "Main Background: Color",
                        type: "color",
                        default: BG_COLORS["body"],
                    },
                    {
                        id: "color-enabled-panels",
                        label: "Panel Background: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "color-panels",
                        label: "Panel Background: Color",
                        type: "color",
                        default: BG_COLORS["#panels"],
                    },
                    {
                        id: "color-enabled-top-bar",
                        label: "Top Background: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "color-top-bar",
                        label: "Top Background: Color",
                        type: "color",
                        default: BG_COLORS[".top-bar"],
                    },
                    {
                        id: "color-enabled-menu-bar",
                        label: "Menu Background: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "color-menu-bar",
                        label: "Menu Background: Color",
                        type: "color",
                        default: BG_COLORS["#menu-bar"],
                    },
                    {
                        id: "color-enabled-chat-area",
                        label: "Inner Chat BG: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "color-chat-area",
                        label: "Inner Chat BG: Color",
                        type: "color",
                        default: BG_COLORS["#chat-area"],
                    },
                    {
                        id: "color-enabled-game-chat",
                        label: "Outer Chat BG: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "color-game-chat",
                        label: "Outer Chat BG: Color",
                        type: "color",
                        default: BG_COLORS["#game-chat"],
                    },
                    {
                        id: "color-enabled-chat-area-server_message",
                        label: "Server Message Tag: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "color-chat-area-server_message",
                        label: "Server Message Tag: Color",
                        type: "color",
                        default: BG_COLORS["#chat-area .server_message"],
                    },
                    {
                        label: "Text Color Overrides",
                        type: "label",
                    },
                    {
                        id: "font-color-enabled-chat-area",
                        label: "Chat Text: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "font-color-chat-area",
                        label: "Chat Text: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area"],
                    },
                    {
                        id: "font-color-enabled-chat-area-color-green",
                        label: "Chat Timestamp: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "font-color-chat-area-color-green",
                        label: "Chat Timestamp: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .color-green"],
                    },
                    {
                        id: "font-color-enabled-chat-area-chat-username",
                        label: "Chat Username: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "font-color-chat-area-chat-username",
                        label: "Chat Username: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .chat-username"],
                    },
                    {
                        id: "font-color-enabled-chat-area-color-grey",
                        label: "Chat Level: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "font-color-chat-area-color-grey",
                        label: "Chat Level: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .color-grey"],
                    },



                    {
                        id: "font-color-chat-area-chat-raid-password",
                        label: "Raid Password Link Text: Color",
                        type: "color",
                        default: "#c5baba",
                    },
                    {
                        id: "background-color-chat-area-raid-password",
                        label: "Raid Password Link Background: Color",
                        type: "color",
                        default: "darkred",
                    },
                    {
                        id: "font-color-enabled-chat-area-server_message",
                        label: "Server Message Tag: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "font-color-chat-area-server_message",
                        label: "Server Message Tag: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .server_message"],
                    },
                    {
                        id: "serverMessageTextOverrideEnabled",
                        label: "Server Message Text: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "serverMessageTextOverrideColor",
                        label: "Server Message Text: Color",
                        type: "color",
                        default: "blue",
                    },
                    {
                        id: "chatBorderOverrideColorEnabled",
                        label: "Chat Border Color: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "chatBorderOverrideColor",
                        label: "Chat Border Color: Color",
                        type: "color",
                        default: "blue",
                    },
                    {
                        id: "font-color-enabled-panels",
                        label: "Panels 1: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "font-color-panels",
                        label: "Panels 1: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area"],
                    },
                    {
                        id: "font-color-enabled-panels-color-grey",
                        label: "Panels 2: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "font-color-panels-color-grey",
                        label: "Panels 2: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .color-grey"],
                    },
                    {
                        id: "font-color-enabled-panels-font-large",
                        label: "Skill Level Color: Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "font-color-panels-font-large",
                        label: "Skill Level: Color",
                        type: "color",
                        default: FONT_COLORS["#panels .font-large"],
                    },
                ],
            });
        }

        condensedUI() {
            let leftbar = document.getElementById("menu-bar-buttons");

            let styleElement = document.getElementById("condensed-ui-tweaks");

            if (styleElement) {
                styleElement.parentNode.removeChild(styleElement);
            }
            document
                .getElementById("menu-bar-buttons")
                .querySelectorAll(".font-small")
                .forEach(function (smallFont) {
                let classInfo = smallFont.className.replaceAll(
                    "font-small",
                    "font-medium"
                );
                smallFont.className = classInfo;
            });

            var spans = document.querySelectorAll(
                "#menu-bar-cooking-table-btn-wrapper span"
            );

            var cookingSpan = Array.from(spans).find(
                (span) => span.textContent === "COOKING"
            );

            if (cookingSpan) {
                cookingSpan.className = "font-medium color-white";
            }

            leftbar.querySelectorAll("img").forEach(function (img) {
                img.className = "w20";
            });

            setTimeout(function () {
                document.getElementById(
                    "market-sidecar"
                ).parentNode.parentNode.style.paddingLeft = "20px";
                document.getElementById(
                    "market-sidecar"
                ).parentNode.parentNode.style.padding = "";
            }, 1000);
            document.getElementById("left-menu-bar-labels").style.paddingBottom =
                "10px !important";
        }

        defaultUI() {
            var styleElement = document.getElementById("condensed-ui-tweaks");

            if (styleElement) {
                styleElement.parentNode.removeChild(styleElement);
            }
        }

        miningMachTimer() {
            const drillNotifications = getThis.getConfig("hideDrillNotifications");

            if (drillNotifications) {
                document.getElementById("notification-drill").style.display = "none";
                document.getElementById("notification-crusher").style.display = "none";
                document.getElementById("notification-giant_drill").style.display = "none";
                document.getElementById("notification-excavator").style.display = "none";
                document.getElementById("notification-giant_excavator").style.display = "none";
                document.getElementById("notification-massive_excavator").style.display = "none";
            } else {
                const drill = getVar("drill_on", 0, "int");
                const crusher = getVar("crusher_on", 0, "int");
                const giant_drill = getVar("giant_drill_on", 0, "int");
                const excavator = getVar("excavator_on", 0, "int");
                const giant_excavator = getVar("giant_excavator_on", 0, "int");
                const massive_excavator = getVar("massive_excavator_on", 0, "int");

                if (drill > 0) {
                    document.getElementById("notification-drill").style.display = "inline-block";
                }
                if (crusher > 0) {
                    document.getElementById("notification-crusher").style.display = "inline-block";
                }
                if (giant_drill > 0) {
                    document.getElementById("notification-giant_drill").style.display = "inline-block";
                }
                if (excavator > 0) {
                    document.getElementById("notification-excavator").style.display = "inline-block";
                }
                if (giant_excavator > 0) {
                    document.getElementById("notification-giant_excavator").style.display = "inline-block";
                }
                if (massive_excavator > 0) {
                    document.getElementById("notification-massive_excavator").style.display = "inline-block";
                }
            }
        }

        oilTimerNotification() {
            const notifDiv = document.createElement("div");
            notifDiv.id = "notification-oil_gain";
            notifDiv.className = "notification hover";
            notifDiv.style.marginRight = "4px";
            notifDiv.style.marginBottom = "4px";
            notifDiv.style.display = "none";

            const elem = document.createElement("img");
            elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/oil.png`);
            const notifIcon = elem;
            notifIcon.className = "w20";

            const notifDivLabel = document.createElement("span");
            notifDivLabel.id = "notification-oil_gain-label";
            notifDivLabel.innerText = " Loading";
            notifDivLabel.className = "color-white";

            notifDiv.appendChild(notifIcon);
            notifDiv.appendChild(notifDivLabel);

            const notificationFurnaceAvail = document.getElementById(
                "notification-furnace_avail"
            );
            if (notificationFurnaceAvail) {
                notificationFurnaceAvail.parentNode.insertBefore(
                    notifDiv,
                    notificationFurnaceAvail
                );
                notifDiv.style.display = "none";
            }
        }

        oilGain() {
            const notificationFurnaceAvail = document.getElementById(
                "notification-furnace_avail"
            );
            const oilDelta = getVar("oil_delta", 0, "int");
            const oil = getVar("oil", 0, "int");
            const oilMax = getVar("max_oil", 0, "int");
            const notificationOilGain = document.getElementById(
                "notification-oil_gain"
            );
            const notificationOilGainLabel = document.getElementById(
                "notification-oil_gain-label"
            );

            if (notificationOilGainLabel) {
                if (getThis.getConfig("oilGainNotification")) {
                    if (oilDelta === 0) {
                        notificationOilGainLabel.textContent = " Balanced";
                        notificationOilGain.style.display = "inline-block";
                    } else if (oilDelta < 0) {
                        const oilNega = (oilMax - (oilMax - oil)) / -oilDelta;
                        const oilNegETA = format_time(oilNega);
                        notificationOilGainLabel.textContent =
                            " " + oilNegETA + " Until Empty";
                        notificationOilGain.style.display = "inline-block";
                    } else if (oilDelta > 0 && oil !== oilMax) {
                        const oilPosi = (oilMax - oil) / oilDelta;
                        const oilPosETA = format_time(oilPosi);
                        notificationOilGainLabel.textContent =
                            " " + oilPosETA + " Until Full";
                        notificationOilGain.style.display = "inline-block";
                    } else if (oilDelta > 0 && oil === oilMax) {
                        notificationOilGain.style.display = "none";
                    }
                } else {
                    notificationOilGain.style.display = "none";
                }
            }
        }

        loot_pot_avail() {
            const notifDiv = document.createElement("div");
            notifDiv.id = `notification-loot_pot_avail`;
            notifDiv.className = "notification hover";
            notifDiv.style = "margin-right: 4px; margin-bottom: 4px; display: none";
            notifDiv.style.display = "inline-block";

            var elem = document.createElement("img");
            elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/combat_loot_potion.png`);
            const notifIcon = elem;
            notifIcon.className = "w20";

            const notifDivLabel = document.createElement("span");
            notifDivLabel.id = `notification-loot_pot_avail-label`;
            notifDivLabel.innerText = " Loot Pot Active";
            notifDivLabel.className = "color-white";

            notifDiv.append(notifIcon, notifDivLabel);
            document.querySelector("#notifications-area").append(notifDiv);
        }

        fightPointsFull() {
            const max = getVar("max_fight_points", 0, "int");
            const current = getVar("fight_points", 0, "int");
            const remaining = max - current;
            const remaining_time = format_time(remaining);

            const fightPointsFullTimerMain = document.querySelector(
                "#fight-points-full-id-menu"
            );
            const fightPointsFullTimerMain_2 = document.querySelector(
                "#fight-points-full-id-menu_2"
            );
            const fightPointsFullTimerCombat = document.querySelector(
                "#fight-points-full-id-combat"
            );

            if (remaining === 0) {
                fightPointsFullTimerMain.textContent = "full";
                fightPointsFullTimerCombat.textContent = "full";
            } else {
                var masterRingEquip = getVar("master_ring_equipped", 0, "int");
                if (masterRingEquip === 1) {
                    fightPointsFullTimerMain.textContent = format_time(remaining / 2);
                    fightPointsFullTimerMain_2.textContent = format_time(remaining / 2);
                    fightPointsFullTimerCombat.textContent = format_time(remaining / 2);
                } else {
                    fightPointsFullTimerMain.textContent = remaining_time;
                    fightPointsFullTimerMain_2.textContent = remaining_time;
                    fightPointsFullTimerCombat.textContent = remaining_time;
                }
            }
        }

        //Zlef Code Start
        addChatDisplayWatcher() {
            const chatElement = document.getElementById('game-chat');
            const panelRaidTeam = document.getElementById('raids-team-panel');
            if (!chatElement) {
                console.log('Chat element not found.');
                return;
            }

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'style' && chatElement.style.display === 'none' && IdlePixelPlus.plugins['ui-tweaks'].getConfig("combatChat")) {
                        chatElement.style.display = 'block'; // Force chat to be visible
                    } else if (mutation.attributeName === 'style' && panelRaidTeam.style.display === 'none') {
                        document.getElementById('raids-advert-button').style.display = 'none';
                        document.getElementById('raids-start-button').style.display = 'none';
                    }
                });
            });

            observer.observe(chatElement, { attributes: true, attributeFilter: ['style'] });
            observer.observe(panelRaidTeam, { attributes: true, attributeFilter: ['style'] });
            //Initiator in onLogin
        }
        //Zlef Code End

        //////////////////////////////// updateColors Start ////////////////////////////////
        updateColors(filter) {
            const bgColorCheck = getThis.getConfig("disableBGColorOverrides");

            if (!bgColorCheck) {
                Object.keys(BG_COLORS).forEach((selector) => {
                    if (!filter || filter.includes(selector)) {
                        const key = selector.replace(/[#\.]/g, "").replace(/-?\s+-?/, "-");
                        const enabled = getThis.getConfig(`color-enabled-${key}`);
                        const color = enabled
                        ? getThis.getConfig(`color-${key}`)
                        : BG_COLORS[selector];
                        const selected = document.querySelectorAll(selector);

                        for (const element of selected) {
                            element.style.backgroundColor = color;
                        }
                    }
                });

                Object.keys(FONT_COLORS).forEach((selector) => {
                    if (!filter || filter.includes(selector)) {
                        const key = selector.replace(/[#\.]/g, "").replace(/-?\s+-?/, "-");
                        const enabled = getThis.getConfig(`font-color-enabled-${key}`);
                        const color = enabled
                        ? getThis.getConfig(`font-color-${key}`)
                        : FONT_COLORS[selector];
                        const selected = document.querySelectorAll(selector);

                        for (const element of selected) {
                            element.style.color = color;
                        }
                    }
                });

                const chatBorderOverrideColorEnabled = getThis.getConfig(
                    "chatBorderOverrideColorEnabled"
                );
                const chatBorderOverrideColor = getThis.getConfig(
                    "chatBorderOverrideColor"
                );
                if (chatBorderOverrideColorEnabled) {
                    const chatElements = document.querySelectorAll("#game-chat.chat.m-3");
                    for (const element of chatElements) {
                        element.style.borderColor = chatBorderOverrideColor;
                    }
                }

                const serverMessageTextOverrideEnabled = getThis.getConfig(
                    "serverMessageTextOverrideEnabled"
                );
                const serverMessageTextOverrideColor = serverMessageTextOverrideEnabled
                ? getThis.getConfig("serverMessageTextOverrideColor")
                : "blue";
                const serverMessageElements = document.querySelectorAll(
                    "#chat-area .server_message"
                );
                for (const element of serverMessageElements) {
                    element.parentElement.style.color = serverMessageTextOverrideColor;
                }
            }
            const bodyClassUpdate = document
            .getElementById("body")
            .className.replaceAll("background-primary-gradient ", "");
            document.getElementById("body").className = bodyClassUpdate;
        }

        //////////////////////////////// updateColors end ////////////////////////////////

        //////////////////////////////// onConfigsChanged Start ////////////////////////////////
        onConfigsChanged() {
            if (onLoginLoaded) {
                getThis.fightPointsFull();
                getThis.miningMachTimer();
                uitRocket().configChange();

                document.body.style.fontFamily = "";
                const font = getThis.getConfig("font");
                if (font && font !== FONT_DEFAULT) {
                    const bodyStyle = document.body.getAttribute("style");
                    document.body.setAttribute(
                        "style",
                        `${bodyStyle}; font-family: ${font} !important`
                    );
                }

                const sideChat = getThis.getConfig("sideChat");
                if (sideChat) {
                    document.getElementById("content").classList.add("side-chat");
                } else {
                    document.getElementById("content").classList.remove("side-chat");
                }

                if (getThis.getConfig("fightPointsStats")) {
                    document.getElementById("menu-bar-fight-points").style.display =
                        "inline-block";
                }
                if (getThis.getConfig("fightPointsStats")) {
                    document.getElementById("menu-bar-fight-points").style.display =
                        "inline-block";
                    document.getElementById("menu-bar-fight-fight-points").style.display =
                        "block";
                } else {
                    document.getElementById("menu-bar-fight-points").style.display =
                        "none";
                    document.getElementById("menu-bar-fight-fight-points").style.display =
                        "none";
                }

                //////
                const condenseWoodcuttingPatches = getThis.getConfig(
                    "condenseWoodcuttingPatches"
                );
                if (condenseWoodcuttingPatches) {
                    const farmingPatchesArea = document.querySelectorAll(
                        "#panel-woodcutting .farming-plot-wrapper"
                    );
                    farmingPatchesArea.forEach((plot) => {
                        plot.classList.add("condensed");
                        document
                            .querySelectorAll(
                            "#panel-woodcutting .farming-plot-wrapper img[id^='img-tree_shiny']"
                        )
                            .forEach(function (el) {
                            el.removeAttribute("width");
                            el.removeAttribute("height");
                        });
                    });
                } else {
                    const farmingPatchesArea = document.querySelectorAll(
                        "#panel-woodcutting .farming-plot-wrapper"
                    );
                    farmingPatchesArea.forEach((plot) => {
                        plot.classList.remove("condensed");
                        document
                            .querySelectorAll(
                            "#panel-woodcutting .farming-plot-wrapper img[id^='img-tree_shiny']"
                        )
                            .forEach(function (el) {
                            el.setAttribute("width", el.getAttribute("original-width"));
                            el.setAttribute("height", el.getAttribute("original-height"));
                        });
                    });
                }

                const condenseFarmingPatches = getThis.getConfig(
                    "condenseFarmingPatches"
                );
                if (condenseFarmingPatches) {
                    const farmingPatchesArea = document.querySelectorAll(
                        "#panel-farming .farming-plot-wrapper"
                    );
                    farmingPatchesArea.forEach((plot) => {
                        plot.classList.add("condensed");
                        document
                            .querySelectorAll(
                            "#panel-farming .farming-plot-wrapper img[id^='img-farm_shiny']"
                        )
                            .forEach(function (el) {
                            el.removeAttribute("width");
                            el.removeAttribute("height");
                        });
                    });
                } else {
                    const farmingPatchesArea = document.querySelectorAll(
                        "#panel-farming .farming-plot-wrapper"
                    );
                    farmingPatchesArea.forEach((plot) => {
                        plot.classList.remove("condensed");
                        document
                            .querySelectorAll(
                            "#panel-farming .farming-plot-wrapper img[id^='img-farm_shiny']"
                        )
                            .forEach(function (el) {
                            el.setAttribute("width", el.getAttribute("original-width"));
                            el.setAttribute("height", el.getAttribute("original-height"));
                        });
                    });
                }

                const condenseGatheringBoxes = getThis.getConfig(
                    "condenseGatheringBoxes"
                );
                if (condenseGatheringBoxes) {
                    const gatheringBoxes = document.querySelectorAll(
                        "#panel-gathering .gathering-box"
                    );
                    gatheringBoxes.forEach(function (el) {
                        el.classList.add("condensed");
                    });
                } else {
                    const gatheringBoxes = document.querySelectorAll(
                        "#panel-gathering .gathering-box"
                    );
                    gatheringBoxes.forEach(function (el) {
                        el.classList.remove("condensed");
                    });
                }

                if (getThis.getConfig("imageTitles")) {
                    const images = document.querySelectorAll("img");
                    images.forEach(function (el) {
                        const src = el.getAttribute("src");
                        if (src && src !== "x") {
                            const title = src.replace(/.*\//, "").replace(/\.\w+$/, "");
                            el.setAttribute("title", title);
                        }
                    });
                } else {
                    const images = document.querySelectorAll("img");
                    images.forEach(function (el) {
                        el.removeAttribute("title");
                    });
                }

                if (getThis.getConfig("miningMachineArrows")) {
                    const panelMining = document.querySelector("#panel-mining");
                    panelMining.classList.add("add-arrow-controls");
                } else {
                    const panelMining = document.querySelector("#panel-mining");
                    panelMining.classList.remove("add-arrow-controls");
                }
                //////
                document.addEventListener("DOMContentLoaded", function () {
                    const toast = document.querySelector(".toast-container");
                    if (toast) {
                        if (getThis.getConfig("lowerToast")) {
                            toast.classList.remove("top-0");
                            toast.style.top = "45px";
                        } else {
                            toast.style.top = "";
                            toast.classList.add("top-0");
                        }
                    }
                });

                const oilSummaryMining = getThis.getConfig("oilSummaryMining");
                if (oilSummaryMining) {
                    document.getElementById("oil-summary-mining").style.display = "block";
                } else {
                    document.getElementById("oil-summary-mining").style.display = "none";
                }

                const oilSummaryCrafting = getThis.getConfig("oilSummaryCrafting");
                if (oilSummaryCrafting) {
                    document.getElementById("oil-summary-crafting").style.display =
                        "block";
                } else {
                    document.getElementById("oil-summary-crafting").style.display =
                        "none";
                }

                const smeltingNotificationTimer = getThis.getConfig(
                    "smeltingNotificationTimer"
                );
                if (smeltingNotificationTimer) {
                    document.getElementById("notification-furnace-timer").style.display =
                        "inline-block";
                } else {
                    document.getElementById("notification-furnace-timer").style.display =
                        "none";
                }

                const heatInFishingTab = getThis.getConfig("heatInFishingTab");
                const heatFishingTab = document.getElementById("heat-fishing-tab");
                if (heatInFishingTab) {
                    heatFishingTab.style.display = "block";
                    heatFishingTab.setAttribute("data-item", "heat");
                } else {
                    heatFishingTab.style.display = "none";
                    heatFishingTab.removeAttribute("data-item");
                }

                const merchantReady = getThis.getConfig("merchantReady");
                const merchAvail = getVar("merchant");
                const merchantAvailNotification = document.getElementById(
                    "notification-merchant_avail"
                );
                if (merchAvail === 1) {
                    if (merchantReady) {
                        merchantAvailNotification.style.display = "inline-block";
                    } else {
                        merchantAvailNotification.style.display = "none";
                    }
                }

                const mixerTimer = getThis.getConfig("mixerTimer");
                const mixerAvail = getVar("brewing_xp_mixer_crafted");
                const brewingMixerTimerNotification = document.getElementById(
                    "notification-brewing_mixer_timer"
                );
                if (mixerAvail == 1) {
                    if (mixerTimer) {
                        brewingMixerTimerNotification.style.display = "inline-block";
                    } else {
                        brewingMixerTimerNotification.style.display = "none";
                    }
                }

                const robotReady = getThis.getConfig("robotReady");
                const robotAvail = getVar("robot_crafted");
                const robotAvailNotification = document.getElementById(
                    "notification-robot_avail"
                );
                if (robotReady && robotAvailNotification) {
                    if (robotReady) {
                        robotAvailNotification.style.display = "inline-block";
                    } else {
                        robotAvailNotification.style.display = "none";
                    }
                }

                const drillNotifications = getThis.getConfig("hideDrillNotifications");
                if (drillNotifications) {
                    getThis.miningMachTimer();
                }

                //////
                const sdWatchShow = getThis.getConfig("moveSDWatch");
                const sdWatchUnlocked = getVar("stardust_watch_crafted", 0, "int");
                if (sdWatchShow && sdWatchUnlocked === 1) {
                    document.getElementById("notification-stardust_watch").style.display =
                        "none";
                    document.getElementById("menu-bar-sd_watch").style.display = "block";
                } else if (!sdWatchShow && sdWatchUnlocked === 1) {
                    document.getElementById("notification-stardust_watch").style.display =
                        "inline-block";
                    document.getElementById("menu-bar-sd_watch").style.display = "none";
                } else {
                    document.getElementById("notification-stardust_watch").style.display =
                        "none";
                    document.getElementById("menu-bar-sd_watch").style.display = "none";
                }

                const showHeat = getThis.getConfig("showHeat");
                if (showHeat) {
                    document.getElementById("menu-bar-heat").style.display = "block";
                } else {
                    document.getElementById("menu-bar-heat").style.display = "none";
                }

                getThis.onVariableSet("oil", window.var_oil, window.var_oil);

                getThis.updateColors();

                const combatInfoPanel = getThis.getConfig("combatInfoSideSelect");
                if (combatInfoPanel === "left") {
                    document.getElementById(
                        "combat-info-fight_point-left"
                    ).style.display = "block";
                    document.getElementById("combat-info-rare_pot-left").style.display =
                        "block";
                    document.getElementById("combat-info-loot_pot-left").style.display =
                        "block";
                    document.getElementById(
                        "combat-info-fight_point-right"
                    ).style.display = "none";
                    document.getElementById("combat-info-rare_pot-right").style.display =
                        "none";
                    document.getElementById("combat-info-loot_pot-right").style.display =
                        "none";
                } else {
                    document.getElementById(
                        "combat-info-fight_point-left"
                    ).style.display = "none";
                    document.getElementById("combat-info-rare_pot-left").style.display =
                        "none";
                    document.getElementById("combat-info-loot_pot-left").style.display =
                        "none";
                    document.getElementById(
                        "combat-info-fight_point-right"
                    ).style.display = "block";
                    document.getElementById("combat-info-rare_pot-right").style.display =
                        "block";
                    document.getElementById("combat-info-loot_pot-right").style.display =
                        "block";
                }

                const showPurpleKey = getThis.getConfig("showPurpleKeyNotification");
                const purpleKeyUnlock = getVar("guardian_purple_key_hint", 0, "int");
                if (showPurpleKey && purpleKeyUnlock === 1) {
                    document.getElementById("notification-purple_key").style.display =
                        "inline-block";
                } else {
                    document.getElementById("notification-purple_key").style.display =
                        "none";
                }

                const hideBoatNotifications = getThis.getConfig("hideBoat");
                const pirate_ship_timer = getVar("pirate_ship_timer", 0, "int");
                const row_boat_timer = getVar("row_boat_timer", 0, "int");
                const canoe_boat_timer = getVar("canoe_boat_timer", 0, "int");
                const stardust_boat_timer = getVar("stardust_boat_timer", 0, "int");
                if (hideBoatNotifications) {
                    document.getElementById("notification-row_boat").style.display =
                        "none";
                    document.getElementById("notification-canoe_boat").style.display =
                        "none";
                    document.getElementById("notification-stardust_boat").style.display =
                        "none";
                    document.getElementById("notification-pirate_ship").style.display =
                        "none";
                } else {
                    if (row_boat_timer > 0) {
                        document.getElementById("notification-row_boat").style.display =
                            "inline-block";
                    }
                    if (canoe_boat_timer > 0) {
                        document.getElementById("notification-canoe_boat").style.display =
                            "inline-block";
                    }
                    if (stardust_boat_timer > 0) {
                        document.getElementById(
                            "notification-stardust_boat"
                        ).style.display = "inline-block";
                    }
                    if (pirate_ship_timer > 0) {
                        document.getElementById("notification-pirate_ship").style.display =
                            "inline-block";
                    }
                }

                setTimeout(function () {
                    if (document.getElementById("notification-furnace_avail")) {
                        const furnaceOreTypeVar = getVar(
                            "furnace_ore_amount_set",
                            0,
                            "int"
                        );
                        const furnaceNotifVar = IdlePixelPlus.plugins[
                            "ui-tweaks"
                        ].getConfig("furnaceEmptyNotification");
                        if (furnaceOreTypeVar <= 0 && furnaceNotifVar) {
                            document.getElementById(
                                "notification-furnace_avail"
                            ).style.display = "inline-block";
                        } else {
                            document.getElementById(
                                "notification-furnace_avail"
                            ).style.display = "none";
                        }
                    }
                }, 500);

                purpleKeyGo = getThis.getConfig("showPurpleKeyNotification");

                if (getThis.getConfig("condensedUI")) {
                    getThis.condensedUI();
                } else {
                    getThis.defaultUI();
                }

                let scrollingNotifications = getThis.getConfig("scrollingNotifications");
                let notifArea = document.getElementById("notifications-area");

                if (scrollingNotifications) {
                    notifArea.style.overflowY = "auto";
                    notifArea.style.height = "140px";
                } else {
                    notifArea.style.overflowY = "unset";
                    notifArea.style.height = "unset";
                }
            }
        }
        //////////////////////////////// onConfigsChanged End ////////////////////////////////

        /*restructureTopBar() {
            let topRow = document
                .getElementById("top-menu-bar-labels")
                .querySelector("tr");
            let topCell = document
                .getElementById("top-menu-bar-labels")
                .querySelectorAll("td");
            let gearIcon = topCell[topCell.length - 1];

            topRow.style.justifyContent = "center";
            topRow.style.display = "flex";
            topCell.forEach((element) => {
                element.style =
                    "padding-right:20px; padding-left: 20px; border:1px solid white";
            });
            gearIcon.style = "";
        }*/

        //////////////////////////////// onLogin Start ////////////////////////////////
        onLogin() {
                currUTCDate = new Date().getUTCDate();
                IPP = IdlePixelPlus;
                getVar = IdlePixelPlus.getVarOrDefault;
                getThis = IdlePixelPlus.plugins["ui-tweaks"];
                document.getElementById("menu-bar").style.borderTop = "1px solid grey";
                document.getElementById("menu-bar").style.paddingTop = "10px";
                document.getElementById("left-menu-bar-labels").style.borderBottom =
                    "1px solid rgba(66,66,66,1)";
                uitMisc().initStyles();
                uitLevel().initExtendedLevels();
                uitRocket().onLogin();
                uitSkills.forEach((skill) => {
                    let xpVar = `var_ipp_${skill}_xp_next`;
                    let xp = getVar(`${skill}_xp`, 0, "int");
                    let level = uitLevel().xpToLevel(xp);
                    const xpAtNext = uitLevel().LEVELS()[level + 1];
                    const next = xpAtNext - xp;
                    window[xpVar] = `${next}`;
                });

                uitPurpleKey().addPurpleKeyNotifications();
                uitCriptoe().initCriptoe();
                uitFishing().initFishing();
                uitRaids().initElements();

                getThis.updateColors();
                document.querySelector("item-display.color-grey").style.color = "white"; //playtime

                var loot_pot = getVar("combat_loot_potion_active", 0, "int");
                var merchantTiming = getVar("merchant_timer", 0, "int");
                var merchantUnlocked = getVar("merchant", 0, "int");
                let robotTiming = getVar("robot_wave_timer", 0, "int");
                var robotUnlocked = getVar("robot_crafted", 0, "int");
                const tableLabel = getThis.getConfig("tableLabels");
                getThis.loot_pot_avail();
                if (tableLabel) {
                    uitTableLabels().addTableCraftLabels();
                }

				const addFpOrbNotifications = () => {
					var FpOrbUnlocked = getVar("green_raid_fp_orb_absorbed", 0, "int");
					const notifDiv = document.createElement("div");
					notifDiv.id = `notification-green_raid_fp_orb_timer`;
					notifDiv.className = "notification-cooks-book hover color-white";
					notifDiv.style = "margin-right: 4px; margin-bottom: 4px";

					var elem = document.createElement("img");
					elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/green_raid_fp_orb.png`);
					const notifIcon = elem;
					notifIcon.className = "w20";
					notifIcon.id = `green_raid_fp_orb`;
					notifIcon.innerText = "";

					const notifDivTime = document.createElement("item-display");
					notifDivTime.setAttribute("data-format", "timer");
					notifDivTime.setAttribute("data-key", "green_raid_fp_orb_timer");

					notifDiv.append(notifIcon," ", notifDivTime);

					document
						.getElementById("notification-red_farming_orb_absorbed_timer")
						.insertAdjacentElement("beforebegin", notifDiv);
					if (FpOrbUnlocked == 0) {
						document.querySelector("#notification-green_raid_fp_orb_timer").style.display =
							"none";
					} else {
						document.querySelector("#notification-green_raid_fp_orb_timer").style.display =
							"inline-block";
					}

					const checkTimer = setInterval(function () {
						var timer = (getVar("green_raid_fp_orb_timer"));
						if (timer == 0) {
							document.querySelector("#notification-green_raid_fp_orb_timer").style.display =
								"none";
						} else {
							document.querySelector("#notification-green_raid_fp_orb_timer").style.display =
								"inline-block";
						}
					}, 1000);
				};

				const addCrystalBallNotification = () => {
					var CrystalBallUnlocked = getVar("crystal_ball", 0, "int");
					const notifDiv = document.createElement("div");
					notifDiv.id = `notification-crystal_ball`;
					notifDiv.onclick = function () {
                        websocket.send(switch_panels("panel-combat"));
                        websocket.send("CLICKS_CRYSTAL_MAGIC_BALL");
                    };
					notifDiv.className = "notification hover";
					notifDiv.style = "margin-right: 4px; margin-bottom: 4px";

					var elem = document.createElement("img");
					elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/crystal_ball.png`);
					const notifIcon = elem;
					notifIcon.className = "w20";
					notifIcon.id = `crystal_ball`;
					notifIcon.innerText = "";

					const notifDivTime = document.createElement("item-display");
					notifDivTime.id = `Crystal_ball-label_1`;
					notifDivTime.setAttribute("data-format", "timer");
					notifDivTime.setAttribute("data-key", "crystal_ball_timer");

					const notifDivLabelExtraElement = document.createElement("span");
                    notifDivLabelExtraElement.id = `Crystal_ball-label_2`;
					notifDivLabelExtraElement.innerText = document.querySelector(
						"#angel-ball-extra-label-value"
					).innerText;
					notifDivLabelExtraElement.className = "color-white";

					notifDiv.append(notifIcon, " ", notifDivTime, notifDivLabelExtraElement);

					document.querySelector("#notifications-area").prepend(notifDiv);
                    if (CrystalBallUnlocked == 0) {
                        document.querySelector("#notification-crystal_ball").style.display =
							"none";
                    } else {
						document.querySelector("#notification-crystal_ball").style.display =
							"inline-block";
					}

					const checkTimer = setInterval(function () {
						var timer = (getVar("crystal_ball_timer"));
						if (timer == 0) {
							document.getElementById("Crystal_ball-label_1").style.display =
								"none";
							const label = document.getElementById("Crystal_ball-label_2")
							label.innerText = document.querySelector(
								"#angel-ball-extra-label-value"
							).innerText;
							label.style.display =
								"inline-block";
						} else {
							document.getElementById("Crystal_ball-label_1").style.display =
								"inline-block";
							document.getElementById("Crystal_ball-label_2").style.display =
								"none";
						}
					}, 1000);
				};

                const addBrewerNotifications = (timer, charges) => {
                    var mixerUnlocked = getVar("brewing_xp_mixer_crafted", 0, "int");
                    var stardustMixerUnlocked = getVar("stardust_brewing_xp_mixer_crafted", 0, "int");
                    const notifDiv = document.createElement("div");
                    notifDiv.id = `notification-brewing_mixer_timer`;
                    notifDiv.onclick = function () {
                        websocket.send(switch_panels("panel-brewing"));
                        websocket.send(Modals.clicks_brewing_xp_mixer());
                    };
                    notifDiv.className = "notification hover";
                    //notifDiv.style = "margin-bottom: 4px; display: none";
                    notifDiv.style = "margin-right: 4px; margin-bottom: 4px; display: none";
                    notifDiv.style.display = "inline-block";

                    const brewingExtraElement = document.querySelector(
                        "#brewing-kit-extra-label-value"
                    ).innerText;

                    var elem = document.createElement("img");
                    if (stardustMixerUnlocked == 1) {
                        elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/stardust_brewing_xp_mixer.png`);
                    } else {
                        elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/brewing_xp_mixer.png`);
                    }
                    const notifIcon = elem;
                    notifIcon.className = "w20";

                    const notifDivLabel = document.createElement("span");
                    notifDivLabel.id = `notification-brewing_mixer_timer-label`;
                    //notifDivLabel.innerText = " " + timer + " (" + charges + "/5)";
                    notifDivLabel.innerText = " " + brewingExtraElement + " (" + charges + "/5)";
                    notifDivLabel.className = "color-white";

                    notifDiv.append(notifIcon, notifDivLabel);
                    document.querySelector("#notifications-area").prepend(notifDiv);
                    if (mixerUnlocked == 0) {
                        document.querySelector("#brewing_mixer_timer").style.display = "none";
                    }
                };

                const brewingTimer = () => {
                    var mixerUnlocked = getVar("brewing_xp_mixer_crafted", 0, "int");
                    if (mixerUnlocked == 1) {
                        let playerTimer = getVar("playtime", 0, "int");
                        let chargesUsed = getVar("brewing_xp_mixer_used", 0, "int");
                        let chargesLeft = 5 - chargesUsed;
                        let playTimeMod =
                            1 - (playerTimer / 86400 - Math.floor(playerTimer / 86400));
                        let etaTimerBrew = format_time(playTimeMod * 86400);

                        const runBrewingTimer = setInterval(function () {
                            playerTimer = getVar("playtime", 0, "int");
                            chargesUsed = getVar("brewing_xp_mixer_used", 0, "int");
                            chargesLeft = 5 - chargesUsed;
                            playTimeMod =
                                1 - (playerTimer / 86400 - Math.floor(playerTimer / 86400));
                            etaTimerBrew = format_time(playTimeMod * 86400);
                            const brewingLabel = document.querySelector(
                                "#notification-brewing_mixer_timer-label"
                            );
                            const brewingExtraElement = document.querySelector(
                                "#brewing-kit-extra-label-value"
                            ).innerText;
                            //brewingLabel.innerText = ` ${etaTimerBrew} (${chargesLeft}/5)`;
                            if (chargesUsed == 5) {
                              brewingLabel.innerText = ` ${etaTimerBrew}`;
                            } else {
                              brewingLabel.innerText = ` ${brewingExtraElement} (${chargesUsed}/5)`;
                            }
                        }, 1000);

                        //addBrewerNotifications(etaTimerBrew, chargesLeft);
                        addBrewerNotifications(etaTimerBrew, chargesUsed);
                    }
                };

                const addMerchantNotifications = () => {
                    var merchantTimerCheck = getVar("merchant_timer", 0, "int");
                    var merchantUnlocked = getVar("merchant", 0, "int");
                    const notifDiv = document.createElement("div");
                    notifDiv.id = `notification-merchant_avail`;
                    notifDiv.onclick = function () {
                        websocket.send(switch_panels("panel-shop"));
                    };
                    notifDiv.className = "notification hover";
                    notifDiv.style = "margin-right: 4px; margin-bottom: 4px; display: none";
                    notifDiv.style.display = "inline-block";

                    var elem = document.createElement("img");
                    elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/merchant.png`);
                    const notifIcon = elem;
                    notifIcon.className = "w20";

                    const notifDivLabel = document.createElement("span");
                    notifDivLabel.id = `notification-merchant_avail-label`;
                    notifDivLabel.innerText = " Merchant Ready";
                    notifDivLabel.className = "color-white";

                    notifDiv.append(notifIcon, notifDivLabel);
                    document.querySelector("#notifications-area").prepend(notifDiv);
                    if (merchantTimerCheck > 0 || merchantUnlocked == 0) {
                        document.querySelector("#notification-merchant_avail").style.display =
                            "none";
                    }
                };

				const addRaidFightPointNotification = () => {
					var maxFightPoints = getVar("max_raids_fight_points", 1, "int");
					const notifDiv = document.createElement("div");
                    notifDiv.id = `menu-bar-raid-fp-2`;
                    notifDiv.onclick = function () {
						websocket.send(switch_panels('panel-combat'));
                        websocket.send(Combat.switchToRaidFightsScreen());
                    };
					notifDiv.className = "top-bar-entry";
					notifDiv.style.display = "inline-block";

					var elem = document.createElement("img");
					switch(maxFightPoints) {
						case 1:
							elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/raids_fight_points.png`);
							break;
						case 2:
							elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/raids_fight_points_sapphire.png`);
							break;
						case 4:
							elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/raids_fight_points_emerald.png`);
							break;
					}
                    const notifIcon = elem;
                    notifIcon.className = "w20";

					const notifCurrentFP = document.createElement("item-display");
					notifCurrentFP.setAttribute("data-format", "number");
					notifCurrentFP.setAttribute("data-key", "raids_fight_points");

					const notifMaxFP = document.createElement("item-display");
					notifMaxFP.setAttribute("data-format", "number");
					notifMaxFP.setAttribute("data-key", "max_raids_fight_points");

					notifDiv.append(notifIcon, " ", notifCurrentFP, " / ", notifMaxFP);
					document
                    .getElementById("menu-bar-heat-2")
                    .insertAdjacentElement("beforebegin", notifDiv);
				};

				const addBreedingFightPointNotification = () => {
					var breedingCombatUnlocked = getVar("breeding_fight_unlocked", 0, "int");
					const notifDiv = document.createElement("div");
                    notifDiv.id = `menu-bar-breeding-fp-2`;
                    notifDiv.onclick = function () {
						websocket.send(switch_panels('panel-breeding-fight'));
                    };
					notifDiv.className = "top-bar-entry";
					notifDiv.style.display = "none";

					var elem = document.createElement("img");
					elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/breeding_fight_points.png`);
                    const notifIcon = elem;
                    notifIcon.className = "w20";

					const notifCurrentFP = document.createElement("item-display");
					notifCurrentFP.setAttribute("data-format", "number");
					notifCurrentFP.setAttribute("data-key", "breeding_fight_points");

					notifDiv.append(notifIcon, " ", notifCurrentFP, " / 10");
					document
                    .getElementById("menu-bar-heat-2")
                    .insertAdjacentElement("beforebegin", notifDiv);

					if (breedingCombatUnlocked) {
						notifDiv.style.display = "inline-block";
					}
				};

                const merchantTimer = () => {
                    var merchantUnlocked = getVar("merchant", 0, "int");
                    if (merchantUnlocked == 1) {
                        let merchantTiming = getVar("merchant_timer", 0, "int");
                        let etaTimerMerch = format_time(merchantTiming);
                        const runMerchantTimer = setInterval(function () {
                            merchantTiming = getVar("merchant_timer", 0, "int");
                            etaTimerMerch = format_time(merchantTiming);
                            const merchantLabel = document.querySelector(
                                "#notification-merchant_avail-label"
                            );
                            if (merchantTiming == 0) {
                                merchantLabel.innerText = ` Merchant Ready`;
                                document.querySelector(
                                    "#notification-merchant_avail"
                                ).style.display = "inline-block";
                            } else {
                                document.querySelector(
                                    "#notification-merchant_avail"
                                ).style.display = "none";
                            }
                        }, 1000);

                        addMerchantNotifications(etaTimerMerch);
                    }
                };

                const addFurnaceNotification = () => {
                    if (getVar("stone_furnace_crafted", 0, "int") == 1) {
                        var furnaceOreType = getVar("furnace_ore_type", "none", "string");
                        var dragFur = getVar("dragon_furnace", 0, "int");
                        var ancFur = getVar("ancient_furnace_crafted", 0, "int");
                        var titFur = getVar("titanium_furnace_crafted", 0, "int");
                        var promFur = getVar("promethium_furnace_crafted", 0, "int");
                        var goldFur = getVar("gold_furnace_crafted", 0, "int");
                        var silvFur = getVar("silver_furnace_crafted", 0, "int");
                        var ironFur = getVar("iron_furnace_crafted", 0, "int");
                        var bronzeFur = getVar("bronze_furnace_crafted", 0, "int");
                        var stoneFur = getVar("stone_furnace_crafted", 0, "int");
                        var furnImg;

                        if (dragFur == 1) {
                            furnImg = `${UIT_IMAGE_URL_BASE}/dragon_furnace.png`;
                        } else if (ancFur == 1) {
                            furnImg = `${UIT_IMAGE_URL_BASE}/ancient_furnace.png`;
                        } else if (titFur == 1) {
                            furnImg = `${UIT_IMAGE_URL_BASE}/titanium_furnace.png`;
                        } else if (promFur == 1) {
                            furnImg = `${UIT_IMAGE_URL_BASE}/promethium_furnace.png`;
                        } else if (goldFur == 1) {
                            furnImg = `${UIT_IMAGE_URL_BASE}/gold_furnace.png`;
                        } else if (silvFur == 1) {
                            furnImg = `${UIT_IMAGE_URL_BASE}/silver_furnace.png`;
                        } else if (ironFur == 1) {
                            furnImg = `${UIT_IMAGE_URL_BASE}/iron_furnace.png`;
                        } else if (bronzeFur == 1) {
                            furnImg = `${UIT_IMAGE_URL_BASE}/bronze_furnace.png`;
                        } else if (stoneFur == 1) {
                            furnImg = `${UIT_IMAGE_URL_BASE}/stone_furnace.png`;
                        } else {
                            document.querySelector(
                                "#notification-furnace_avail"
                            ).style.display = "none";
                        }

                        const notifDiv = document.createElement("div");
                        notifDiv.id = `notification-furnace_avail`;
                        notifDiv.onclick = function () {
                            websocket.send(switch_panels("panel-crafting"));
                        };
                        notifDiv.className = "notification hover";
                        notifDiv.style =
                            "margin-right: 4px; margin-bottom: 4px; display: none";
                        notifDiv.style.display = "inline-block";

                        var elem = document.createElement("img");
                        elem.setAttribute("src", furnImg);
                        const notifIcon = elem;
                        notifIcon.className = "w20";

                        const notifDivLabel = document.createElement("span");
                        notifDivLabel.id = `notification-furnace_avail-label`;
                        notifDivLabel.innerText = " Furnace Empty";
                        notifDivLabel.className = "color-white";

                        notifDiv.append(notifIcon, notifDivLabel);
                        document.querySelector("#notifications-area").prepend(notifDiv);
                        var furnaceNotif = getThis.getConfig("furnaceEmptyNotification");
                        if (furnaceOreType != "none" || !furnaceNotif) {
                            document.querySelector(
                                "#notification-furnace_avail"
                            ).style.display = "none";
                        }
                    }
                };

                const addRobotNotifications = () => {
                    var robotTimerCheck = getVar("robot_wave_timer", 0, "int");
                    var robotUnlocked = getVar("robot_crafted", 0, "int");
                    const notifDiv = document.createElement("div");
                    notifDiv.id = `notification-robot_avail`;
                    notifDiv.onclick = function () {
                        websocket.send(Modals.open_robot_waves());
                    };
                    notifDiv.className = "notification hover";
                    notifDiv.style = "margin-right: 4px; margin-bottom: 4px; display: none";
                    notifDiv.style.display = "inline-block";

                    var elem = document.createElement("img");
                    elem.setAttribute("src", `${UIT_IMAGE_URL_BASE}/robot.png`);
                    const notifIcon = elem;
                    notifIcon.className = "w20";

                    const notifDivLabel = document.createElement("span");
                    notifDivLabel.id = `notification-robot_avail-label`;
                    notifDivLabel.innerText = " Waves Ready";
                    notifDivLabel.className = "color-white";

                    notifDiv.append(notifIcon, notifDivLabel);
                    document.querySelector("#notifications-area").prepend(notifDiv);
                    if (robotTimerCheck > 0 || robotUnlocked == 0) {
                        document.querySelector("#notification-robot_avail").style.display =
                            "none";
                    }
                };

                const robotTimer = () => {
                    let robotNotification = false;
                    var robotUnlocked = getVar("robot_crafted", 0, "int");
                    var thisScript = "";
                    if (robotUnlocked == 1) {
                        let robotTiming = getVar("robot_wave_timer", 0, "int");
                        let etaTimerRobot = format_time(robotTiming);
                        const runRobotTimer = setInterval(function () {
                            robotNotification =
                                IdlePixelPlus.plugins["ui-tweaks"].getConfig("robotReady");
                            robotTiming = getVar("robot_wave_timer", 0, "int");
                            etaTimerRobot = format_time(robotTiming);
                            const robotLabel = document.querySelector(
                                "#notification-robot_avail-label"
                            );
                            if (robotTiming == 0 && robotNotification) {
                                //console.log(robotNotification);
                                robotLabel.innerText = ` Waves Ready`;
                                document.querySelector(
                                    "#notification-robot_avail"
                                ).style.display = "inline-block";
                            } else {
                                document.querySelector(
                                    "#notification-robot_avail"
                                ).style.display = "none";
                            }
                        }, 1000);

                        addRobotNotifications(etaTimerRobot);
                    }
                };

                addFpOrbNotifications();
				addCrystalBallNotification();
				addRaidFightPointNotification();
				addBreedingFightPointNotification();
				brewingTimer();
                merchantTimer();
                robotTimer();
                addFurnaceNotification();

                const lootPotAvail = document.querySelector(
                    "#notification-loot_pot_avail"
                );
                if (loot_pot == 0) {
                    lootPotAvail.style.display = "none";
                } else {
                    lootPotAvail.style.display = "inline-block";
                }

                const merchantAvail = document.querySelector(
                    "#notification-merchant_avail"
                );
                if (merchantAvail) {
                    if (merchantTiming > 0 || merchantUnlocked == 0) {
                        merchantAvail.style.display = "none";
                    } else {
                        merchantAvail.style.display = "inline-block";
                    }
                }

                const robotAvail = document.querySelector("#notification-robot_avail");
                if (robotAvail) {
                    if (robotTiming > 0 || robotUnlocked == 0) {
                        robotAvail.style.display = "none";
                    } else {
                        robotAvail.style.display = "inline-block";
                    }
                }

                getThis.miningMachTimer();
                // fix chat
                purpleKeyGo = getThis.getConfig("showPurpleKeyNotification");

                getThis.onConfigsChanged();

                //Left menu energy info
                const menuBarEnergy = document.getElementById("menu-bar-energy");
                const menuBarFightPoints = document.createElement("span");
                menuBarFightPoints.id = "menu-bar-fight-points";
                menuBarFightPoints.innerHTML = `
              (<span class="fight-points-full-timmer" id="fight-points-full-id-menu"></span>)
            `;

                const menuBarFightPoints_2 = document.createElement("span");
                menuBarFightPoints_2.id = "menu-bar-fight-points";
                menuBarFightPoints_2.innerHTML = `
              (<span class="fight-points-full-timmer" id="fight-points-full-id-menu_2"></span>)
            `;

                document
                    .getElementById("menu-bar-fp")
                    .insertAdjacentElement("beforeend", menuBarFightPoints);
                document
                    .getElementById("menu-bar-fp-2")
                    .insertAdjacentElement("beforeend", menuBarFightPoints_2);

                const menuBarCrystals = document.getElementById("menu-bar-crystals");

                // SD Watch Left Side

                const sdWatchElement = document.createElement("span");
                sdWatchElement.innerHTML = `<br>
  <span onClick="websocket.send(Modals.clicks_stardust_watch())" id="menu-bar-sd_watch">
    <img id="sd-watch-img" class="img-20" src="${UIT_IMAGE_URL_BASE}/stardust_watch.png">
    <span class="sd-watch-text">Watch Charges</span>
    (<span class="sd-watch-charges">0</span>)
  </span>
`;
                const sdWatchElement2 = document.createElement("span");
                sdWatchElement2.innerHTML = `
            <div class="top-bar-entry">
  <span onClick="websocket.send(Modals.clicks_stardust_watch())" id="menu-bar-sd_watch_2">
    <img id="sd-watch-img" class="img-20" src="${UIT_IMAGE_URL_BASE}/stardust_watch.png">
    <span class="sd-watch-text2">Watch Charges</span>
    (<span class="sd-watch-charges_2">0</span>)
  </span>
  </div>
`;

                document
                    .getElementById("menu-bar-crystals")
                    .insertAdjacentElement("beforebegin", sdWatchElement);
                document
                    .getElementById("menu-bar-crystals-2")
                    .insertAdjacentElement("beforebegin", sdWatchElement2);

                const energyItemDisplay = document.querySelector(
                    '#menu-bar-hero item-display[data-key="energy"]'
                );

                const menuBarFightPointsCombat = document.createElement("span");
                menuBarFightPointsCombat.id = "menu-bar-fight-fight-points";
                menuBarFightPointsCombat.innerHTML = `<img id="menu-bar-fight-points-img" class="img-20" src="${UIT_IMAGE_URL_BASE}/fight_points.png"> <item-display data-format="number" data-key="fight_points"> 0</item-display> (<span class="fight-points-full-timmer" id="fight-points-full-id-combat"></span>)`;

                energyItemDisplay.parentElement.insertBefore(
                    menuBarFightPointsCombat,
                    energyItemDisplay.nextSibling
                );

                uitLevel().initNextLevel();

                // machine arrows
                const machineryList = [
                    "drill",
                    "crusher",
                    "giant_drill",
                    "excavator",
                    "giant_excavator",
                    "massive_excavator",
                ];

                machineryList.forEach((machine) => {
                    const itemBox = document.querySelector(`itembox[data-item=${machine}]`);
                    if (itemBox) {
                        const arrowControlsDiv = document.createElement("div");
                        arrowControlsDiv.className = "arrow-controls";
                        arrowControlsDiv.onclick = function (event) {
                            event.stopPropagation();
                        };

                        const arrowUpDiv = document.createElement("div");
                        arrowUpDiv.className = "arrow up";
                        arrowUpDiv.onclick = function (event) {
                            event.stopPropagation();
                            IdlePixelPlus.sendMessage(`MACHINERY=${machine}~increase`);
                        };

                        const itemDisplay = document.createElement("item-display");
                        itemDisplay.setAttribute("data-format", "number");
                        itemDisplay.setAttribute("data-key", `${machine}_on`);
                        itemDisplay.innerHTML = "1";

                        const arrowDownDiv = document.createElement("div");
                        arrowDownDiv.className = "arrow down";
                        arrowDownDiv.onclick = function (event) {
                            event.stopPropagation();
                            IdlePixelPlus.sendMessage(`MACHINERY=${machine}~decrease`);
                        };

                        arrowControlsDiv.appendChild(arrowUpDiv);
                        arrowControlsDiv.appendChild(itemDisplay);
                        arrowControlsDiv.appendChild(arrowDownDiv);

                        itemBox.appendChild(arrowControlsDiv);
                    }
                });

                // custom notifications
                const notificationsArea = document.getElementById("notifications-area");

                if (notificationsArea) {
                    const notificationOilFull = document.createElement("div");
                    notificationOilFull.id = "ui-tweaks-notification-oil-full";
                    notificationOilFull.style.display = "none";
                    notificationOilFull.classList.add("notification", "hover");
                    notificationOilFull.onclick = function () {
                        switch_panels("panel-mining");
                    };

                    notificationOilFull.innerHTML = `
        <img src="${UIT_IMAGE_URL_BASE}/oil.png" class="w20">
        <span class="font-small color-yellow">Oil Full</span>
    `;

                    notificationsArea.appendChild(notificationOilFull);
                }

                const panelMining = document.querySelector("#panel-mining .progress-bar");
                const panelCrafting = document.querySelector(
                    "#panel-crafting .progress-bar"
                );

                if (panelMining) {
                    const oilSummaryMining = document.createElement("div");
                    oilSummaryMining.id = "oil-summary-mining";
                    oilSummaryMining.style.marginTop = "0.5em";

                    const oilLabel = document.createElement("strong");
                    oilLabel.textContent = "Oil: ";

                    const oilDisplay = document.createElement("item-display");
                    oilDisplay.setAttribute("data-format", "number");
                    oilDisplay.setAttribute("data-key", "oil");

                    const maxOilDisplay = document.createElement("item-display");
                    maxOilDisplay.setAttribute("data-format", "number");
                    maxOilDisplay.setAttribute("data-key", "max_oil");

                    const inLabel = document.createElement("strong");
                    inLabel.textContent = "In: ";

                    const inDisplay = document.createElement("item-display");
                    inDisplay.setAttribute("data-format", "number");
                    inDisplay.setAttribute("data-key", "oil_in");

                    const outLabel = document.createElement("strong");
                    outLabel.textContent = "Out: ";

                    const outDisplay = document.createElement("item-display");
                    outDisplay.setAttribute("data-format", "number");
                    outDisplay.setAttribute("data-key", "oil_out");

                    const deltaLabel = document.createElement("strong");
                    deltaLabel.textContent = "Delta: ";

                    const deltaDisplay = document.createElement("item-display");
                    deltaDisplay.setAttribute("data-format", "number");
                    deltaDisplay.setAttribute("data-key", "oil_delta");

                    oilSummaryMining.appendChild(oilLabel);
                    oilSummaryMining.appendChild(oilDisplay);
                    oilSummaryMining.appendChild(document.createTextNode(" / "));
                    oilSummaryMining.appendChild(maxOilDisplay);
                    oilSummaryMining.appendChild(document.createElement("br"));
                    oilSummaryMining.appendChild(inLabel);
                    oilSummaryMining.appendChild(document.createTextNode("+"));
                    oilSummaryMining.appendChild(inDisplay);
                    oilSummaryMining.appendChild(
                        document.createTextNode("\u00A0\u00A0\u00A0")
                    );
                    oilSummaryMining.appendChild(outLabel);
                    oilSummaryMining.appendChild(document.createTextNode("-"));
                    oilSummaryMining.appendChild(outDisplay);
                    oilSummaryMining.appendChild(document.createElement("br"));
                    oilSummaryMining.appendChild(deltaLabel);
                    oilSummaryMining.appendChild(deltaDisplay);

                    panelMining.parentNode.insertBefore(
                        oilSummaryMining,
                        panelMining.nextSibling
                    );
                }

                if (panelCrafting) {
                    const oilSummaryCrafting = document.createElement("div");
                    oilSummaryCrafting.id = "oil-summary-crafting";
                    oilSummaryCrafting.style.marginTop = "0.5em";

                    const oilLabel = document.createElement("strong");
                    oilLabel.textContent = "Oil: ";

                    const oilDisplay = document.createElement("item-display");
                    oilDisplay.setAttribute("data-format", "number");
                    oilDisplay.setAttribute("data-key", "oil");

                    const maxOilDisplay = document.createElement("item-display");
                    maxOilDisplay.setAttribute("data-format", "number");
                    maxOilDisplay.setAttribute("data-key", "max_oil");

                    const inLabel = document.createElement("strong");
                    inLabel.textContent = "In: ";

                    const inDisplay = document.createElement("item-display");
                    inDisplay.setAttribute("data-format", "number");
                    inDisplay.setAttribute("data-key", "oil_in");

                    const outLabel = document.createElement("strong");
                    outLabel.textContent = "Out: ";

                    const outDisplay = document.createElement("item-display");
                    outDisplay.setAttribute("data-format", "number");
                    outDisplay.setAttribute("data-key", "oil_out");

                    const deltaLabel = document.createElement("strong");
                    deltaLabel.textContent = "Delta: ";

                    const deltaDisplay = document.createElement("item-display");
                    deltaDisplay.setAttribute("data-format", "number");
                    deltaDisplay.setAttribute("data-key", "oil_delta");

                    oilSummaryCrafting.appendChild(oilLabel);
                    oilSummaryCrafting.appendChild(oilDisplay);
                    oilSummaryCrafting.appendChild(document.createTextNode(" / "));
                    oilSummaryCrafting.appendChild(maxOilDisplay);
                    oilSummaryCrafting.appendChild(document.createElement("br"));
                    oilSummaryCrafting.appendChild(inLabel);
                    oilSummaryCrafting.appendChild(document.createTextNode("+"));
                    oilSummaryCrafting.appendChild(inDisplay);
                    oilSummaryCrafting.appendChild(
                        document.createTextNode("\u00A0\u00A0\u00A0")
                    );
                    oilSummaryCrafting.appendChild(outLabel);
                    oilSummaryCrafting.appendChild(document.createTextNode("-"));
                    oilSummaryCrafting.appendChild(outDisplay);
                    oilSummaryCrafting.appendChild(document.createElement("br"));
                    oilSummaryCrafting.appendChild(deltaLabel);
                    oilSummaryCrafting.appendChild(deltaDisplay);

                    panelCrafting.parentNode.insertBefore(
                        oilSummaryCrafting,
                        panelCrafting.nextSibling
                    );
                }

                document
                    .querySelector("#notification-furnace-label")
                    .insertAdjacentHTML(
                    "afterend",
                    '<span id="notification-furnace-timer" class="font-small color-white"></span>'
                );
                document
                    .querySelector("#notification-rocket-label")
                    .insertAdjacentHTML(
                    "afterend",
                    '<span id="notification-rocket-timer" class="font-small color-white"></span>'
                );
                document
                    .querySelector("#notification-mega_rocket-label")
                    .insertAdjacentHTML(
                    "afterend",
                    '<span id="notification-mega_rocket-timer" class="font-small color-white"></span>'
                );

                // clear chat button
                var chatAutoScrollButton = document.getElementById(
                    "chat-auto-scroll-button"
                );
                var chatClearButton = document.createElement("button");
                chatClearButton.id = "chat-clear-button";
                chatClearButton.textContent = "CLEAR";
                chatClearButton.style.color = "green";
                chatClearButton.onclick = function () {
                    IdlePixelPlus.plugins["ui-tweaks"].clearChat();
                };

                chatAutoScrollButton.insertAdjacentElement("afterend", chatClearButton);

                // reorganize chat location
                const self = this;
                const chat = document.querySelector("#game-chat > :first-child");
                const chatTop = document.createElement("div");
                chatTop.id = "chat-top";
                const chatArea = document.querySelector("#chat-area");
                const chatBottom = document.querySelector(
                    "#game-chat > :first-child > :last-child"
                );

                while (chat.firstChild) {
                    chatTop.appendChild(chat.firstChild);
                }

                chat.appendChild(chatTop);
                chat.appendChild(chatArea);
                chat.appendChild(chatBottom);

                // override for service messages
                const original_yell_to_chat_box = Chat.yell_to_chat_box;
                Chat.yell_to_chat_box = function () {
                    original_yell_to_chat_box.apply(Chat, arguments);
                    self.updateColors();
                };

                var currentFP = getVar("fight_points", 0, "int").toLocaleString();
                var rarePotTimer = getVar("rare_monster_potion_timer", 0, "int");
                var rarePotPlusTimer = getVar(
                    "super_rare_monster_potion_timer",
                    0,
                    "int"
                );
                var rarePotInfo = "";

                if (rarePotTimer > 0) {
                    rarePotInfo = rarePotTimer;
                } else if (rarePotPlusTimer > 0) {
                    rarePotInfo = rarePotPlusTimer;
                } else {
                    rarePotInfo = "Inactive";
                }

                var combatLootPotActive = getVar("combat_loot_potion_active", 0, "int");
                var combatLootPotTimer = getVar("combat_loot_potion_timer", 0, "int");
                var combatLootPotInfo = "";

                if (combatLootPotActive == 1) {
                    combatLootPotInfo = "Active";
                } else {
                    combatLootPotInfo = "Inactive";
                }

                function createCombatStatEntry(id, imgSrc, imgTitle, text, value) {
                    const entry = document.createElement("div");
                    entry.className = "td-combat-stat-entry";
                    entry.id = id;

                    let content;

                    if (
                        id == "combat-info-loot_pot-right" ||
                        id == "combat-info-loot_pot-left"
                    ) {
                        content = `
                <br>
        <img class="img-15" src="${imgSrc}" title="${imgTitle}">
        <span style="color:white">${text}:</span>
        <span id="${id}-lp">${value}</span>
    `;
                    } else if (
                        id == "combat-info-fight_point-right" ||
                        id == "combat-info-fight_point-left"
                    ) {
                        content = `
        <img class="img-15" src="${imgSrc}" title="${imgTitle}">
        <span style="color:white">${text}:</span>
        <span id="${id}-fp">${value}</span>
    `;
                    } else {
                        content = `
        <img class="img-15" src="${imgSrc}" title="${imgTitle}">
        <span style="color:white">${text}:</span>
        <span id="${id}-rp">${value}</span>
    `;
                    }

                    entry.innerHTML = content;
                    return entry;
                }

                function insertAfter(newNode, referenceNode) {
                    referenceNode.parentNode.insertBefore(
                        newNode,
                        referenceNode.nextSibling
                    );
                }

                var lastChildInPanel = document.querySelector(
                    "#panel-combat-canvas > center > table > tbody > tr:nth-child(2) > td.fight-left-border > div.td-combat-bottom-panel.shadow > div:last-child"
                );
                insertAfter(
                    createCombatStatEntry(
                        "combat-info-fight_point-right",
                        `${UIT_IMAGE_URL_BASE}/fight_points.png`,
                        "fight_points_white-right",
                        "FP",
                        currentFP
                    ),
                    lastChildInPanel
                );
                insertAfter(
                    createCombatStatEntry(
                        "combat-info-rare_pot-right",
                        `${UIT_IMAGE_URL_BASE}/rare_monster_potion.png`,
                        "rare_potion_white-right",
                        "Rare Pot",
                        rarePotInfo
                    ),
                    lastChildInPanel
                );
                insertAfter(
                    createCombatStatEntry(
                        "combat-info-loot_pot-right",
                        `${UIT_IMAGE_URL_BASE}/combat_loot_potion.png`,
                        "combat_loot_potion_white-right",
                        "Loot Pot",
                        combatLootPotInfo
                    ),
                    lastChildInPanel
                );

                var idleHeroArrowsArea = document.querySelector(
                    "#menu-bar-idle-hero-arrows-area-2"
                );
                insertAfter(
                    createCombatStatEntry(
                        "combat-info-fight_point-left",
                        `${UIT_IMAGE_URL_BASE}/fight_points.png`,
                        "fight_points_white-left",
                        "FP",
                        currentFP
                    ),
                    idleHeroArrowsArea
                );
                insertAfter(
                    createCombatStatEntry(
                        "combat-info-rare_pot-left",
                        `${UIT_IMAGE_URL_BASE}/rare_monster_potion.png`,
                        "rare_potion_white-left",
                        "Rare Pot",
                        rarePotInfo
                    ),
                    idleHeroArrowsArea
                );
                insertAfter(
                    createCombatStatEntry(
                        "combat-info-loot_pot-left",
                        `${UIT_IMAGE_URL_BASE}/combat_loot_potion.png`,
                        "combat_loot_potion_white-left",
                        "Loot Pot",
                        combatLootPotInfo
                    ),
                    idleHeroArrowsArea
                );

                getThis.oilTimerNotification();
                setTimeout(function () {
                    uitRocket().timeout();
                    IdlePixelPlus.plugins["ui-tweaks"].onConfigsChanged();
                }, 20);

                var existingElement = document.getElementById(
                    "menu-bar-idlepixelplus-icon"
                ).parentNode;

                var newContainer = document.createElement("div");
                newContainer.setAttribute(
                    "onclick",
                    "IdlePixelPlus.setPanel('idlepixelplus')"
                );
                newContainer.className = "hover hover-menu-bar-item left-menu-item";

                // Create the inner table structure
                var table = document.createElement("table");
                table.className = "game-menu-bar-left-table-btn left-menu-item-other";
                table.style.width = "100%";

                var tbody = document.createElement("tbody");
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                td1.style.width = "30px";

                // Assuming there's only one image in the existing element
                var img = existingElement.querySelector("img");
                img.className = "w30";
                td1.appendChild(img);

                var td2 = document.createElement("td");
                // The text node for 'PLUGINS'
                var textNode = document.createTextNode("PLUGINS");
                td2.appendChild(textNode);

                // Append everything together
                tr.appendChild(td1);
                tr.appendChild(td2);
                tbody.appendChild(tr);
                table.appendChild(tbody);
                newContainer.appendChild(table);

                existingElement.parentNode.replaceChild(newContainer, existingElement);

                if (getThis.getConfig("condensedUI")) {
                    getThis.condensedUI();
                } else {
                    getThis.defaultUI();
                }

                /*getThis.restructureTopBar();*/

                uitCriptoe().addCriptoeValues();

                // Add event listener to the element
                document.getElementById('raids-team-panel-uuid').addEventListener('click', function (event) {
                    // This will copy the text content of the element to the clipboard
                    IdlePixelPlus.plugins['ui-tweaks'].copyTextToClipboard(event.target.innerText);
                });

                document.getElementById("raids-team-panel-uuid").addEventListener("click", function (event) {
                    // Copy text to clipboard
                    navigator.clipboard.writeText(this.innerText).then(() => {
                        // Check if the message element already exists, create if not
                        let message = document.getElementById("copy-message");
                        if (!message) {
                            message = document.createElement("div");
                            message.id = "copy-message";
                            message.style.position = "absolute";
                            message.style.backgroundColor = "black";
                            message.style.color = "white";
                            message.style.padding = "5px";
                            message.style.borderRadius = "5px";
                            message.style.zIndex = "1000"; // Ensure it appears above other content
                            message.style.fontSize = "20px";
                            message.innerText = "Password Copied";
                            document.getElementById("panel-combat").appendChild(message);
                        }

                        // Show the "Password Copied" message
                        message.style.display = "block";
                        message.style.left = `${event.clientX}px`;
                        message.style.top = `${event.clientY}px`; // 20 pixels below the cursor for visibility

                        // Hide the message after 2 seconds
                        setTimeout(() => {
                            message.style.display = "none";
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                });
                IdlePixelPlus.plugins['ui-tweaks'].addChatDisplayWatcher();
                let archery = document.getElementById("left-panel-item_panel-archery");
                let magic = document.getElementById("left-panel-item_panel-magic");
                let labels = document.getElementById("left-menu-bar-labels");
                archery.className = "";
                magic.className = "";
                archery.querySelector("span[data-menu-bar-skill-label]").style.paddingLeft = "8px";
                magic.querySelector("span[data-menu-bar-skill-label]").style.paddingLeft = "8px";
                labels.style.padding = "unset";
                uitTableLabels().disableTableRefreshBrewing();
                uitTableLabels().fixShortcutModel();
                uitTableLabels().Crafting_getMaterials();
                uitTableLabels().Invention_getMaterials();
                uitTableLabels().Modals_changeModal();
                uitHoliday().easter2024();
                uitDustPotions().cloneDust();
                uitMisc().fixGKeys();


                let woodcuttingContainer = document.createElement('span');
                woodcuttingContainer.id = "uit-woodcutting-container";
                woodcuttingContainer.style.display = "flex";
                woodcuttingContainer.style.flexWrap = "wrap";
                let firstWoodcuttingPlot = document.getElementById("panel-woodcutting").querySelector(".farming-plot-wrapper");
                firstWoodcuttingPlot.insertAdjacentElement("beforeBegin", woodcuttingContainer);
                let newWoodcuttingContainer = document.getElementById("uit-woodcutting-container");
                document.getElementById('panel-woodcutting').querySelectorAll('.farming-plot-wrapper').forEach((plot) => {
                    newWoodcuttingContainer.insertAdjacentElement('beforeEnd', plot);
                });

                let farmingContainer = document.createElement('span');
                farmingContainer.id = "uit-farming-container";
                farmingContainer.style.display = "flex";
                farmingContainer.style.flexWrap = "wrap";
                let firstPlot = document.getElementById("panel-farming").querySelector(".farming-plot-wrapper");
                firstPlot.insertAdjacentElement("beforeBegin", farmingContainer);
                let newFarmingContainer = document.getElementById("uit-farming-container");
                document.getElementById('panel-farming').querySelectorAll('.farming-plot-wrapper').forEach((plot) => {
                    newFarmingContainer.insertAdjacentElement('beforeEnd', plot);
                })

                uitMisc().fixAchiLabels();

                onLoginLoaded = true;
        }
        //////////////////////////////// onLogin End ////////////////////////////////

        clearChat() {
            const chatArea = document.getElementById("chat-area");
            while (chatArea.firstChild) {
                chatArea.removeChild(chatArea.firstChild);
            }
        }

        limitChat() {
            const chatArea = document.getElementById("chat-area");
            const chatLength = chatArea.innerHTML.length;
            const limit = getThis.getConfig("chatLimit");

            if (limit > 0 || chatLength > 190000) {
                const children = chatArea.children;

                if (limit > 0) {
                    if (children.length > limit) {
                        const toDelete = children.length - limit;

                        for (let i = 0; i < toDelete; i++) {
                            try {
                                chatArea.removeChild(children[i]);
                            } catch (err) {
                                console.error("Error cleaning up chat", err);
                            }
                        }

                        if (Chat._auto_scroll) {
                            chatArea.scrollTop = chatArea.scrollHeight;
                        }
                    }
                }

                if (chatLength > 190000) {
                    for (let i = 0; i < 3; i++) {
                        try {
                            chatArea.removeChild(children[i]);
                        } catch (err) {
                            console.error("Error cleaning up chat", err);
                        }
                    }
                }
            }
        }

        onPanelChanged(panelBefore, panelAfter) {
            if (onLoginLoaded) {
                if (panelAfter = "brewing") {
                    uitTableLabels().updateTableCraftLabels();
                }
                uitInvention().hideOrbsAndRing();

                if (panelBefore !== panelAfter && panelAfter === "idlepixelplus") {
                    const options = document.querySelectorAll(
                        "#idlepixelplus-config-ui-tweaks-font option"
                    );
                    if (options) {
                        options.forEach(function (el) {
                            const value = el.getAttribute("value");
                            if (value === "IdlePixel Default") {
                                el.style.fontFamily = FONT_FAMILY_DEFAULT;
                            } else {
                                el.style.fontFamily = value;
                            }
                        });
                    }
                }

                if (
                    ["farming", "woodcutting", "combat"].includes(panelAfter) &&
                    getThis.getConfig("imageTitles")
                ) {
                    const images = document.querySelectorAll(`#panel-${panelAfter} img`);
                    if (images) {
                        images.forEach(function (el) {
                            let src = el.getAttribute("src");
                            if (src && src !== "x") {
                                src = src.replace(/.*\//, "").replace(/\.\w+$/, "");
                                el.setAttribute("title", src);
                            }
                        });
                    }
                }

                /*if (Globals.currentPanel === "panel-brewing" || Globals.currentPanel === "panel-crafting" || Globals.currentPanel === "panel-cooking") {
                    uitMisc().recolorTableText();
                }*/

                if (["mining", "crafting", "gathering", "farming", "brewing", "woodcutting", "cooking", "breeding", "invention", "combat"].includes(panelAfter)) {
                    uitMisc().recolorTableText();
                }

                if (Globals.currentPanel === "panel-fishing") {
                    uitFishing().calcFishEnergy();
                }

                if (Globals.currentPanel === "panel-criptoe-market") {
                    uitCriptoe().addCriptoeValues();
                }
            }
        }

        //////////////////////////////// onVariableSet Start ////////////////////////////////
        onVariableSet(key, valueBefore, valueAfter) {
            if (onLoginLoaded) {
                //console.log(new Date() + " " + document.readyState);
                if (Globals.currentPanel != "panel-combat-canvas" && Globals.currentPanel != "panel-combat-canvas-raids") {
                    if (key.endsWith("_on")) {
                        setTimeout(function () {
                            IdlePixelPlus.plugins["ui-tweaks"].miningMachTimer();
                        }, 100);
                    }

                    /*if (Globals.currentPanel == "panel-brewing") {
                        uitTableLabels().updateTableCraftLabels();
                    }*/

                    if (key == "oil") {
                        getThis.oilGain();
                    }

                    if (key == "criptoe" && valueBefore != valueAfter) {
                        uitCriptoe().addCriptoeValues();
                    }

                    if (key.endsWith("_xp")) {
                        const varName = `var_ipp_${key}_next`;
                        const xp = parseInt(valueAfter || "0");
                        const level = uitLevel().xpToLevel(xp);
                        const xpAtNext = uitLevel().LEVELS()[level + 1];
                        const next = xpAtNext - xp;
                        window[varName] = `${next}`;
                    }

                    if (["oil", "max_oil"].includes(key)) {
                        const oil = IdlePixelPlus.getVar("oil");
                        const maxOil = IdlePixelPlus.getVar("max_oil");
                        if (
                            oil &&
                            oil == maxOil &&
                            getThis.getConfig("oilFullNotification")
                        ) {
                            document.querySelector(
                                "#ui-tweaks-notification-oil-full"
                            ).style.display = "";
                        } else {
                            document.querySelector(
                                "#ui-tweaks-notification-oil-full"
                            ).style.display = "none";
                        }
                    }

                    if (["oil_in", "oil_out"].includes(key)) {
                        const oilIn = getVar("oil_in", 0, "int");
                        const oilOut = getVar("oil_out", 0, "int");
                        window.var_oil_delta = `${oilIn - oilOut}`;
                    }

                    getThis.fightPointsFull();

                    if (["rocket_km", "rocket_status", "rocket_potion_timer", "rocket_fuel", "rocket_potion"].includes(key)) {
                        uitRocket().varChange();
                    }

                    uitRocket().onVar();

                    if (key == "moon_distance" || key == "sun_distance") {
                        uitRocket().rocketInfoUpdate(key);
                    }
                    uitRocket().rocketStatus();

                    if (
                        [
                            "furnace_ore_type",
                            "furnace_countdown",
                            "furnace_ore_amount_at",
                        ].includes(key)
                    ) {
                        const el = document.querySelector("#notification-furnace-timer");
                        const ore = getVar("furnace_ore_type", "none");
                        if (ore == "none") {
                            el.textContent = "";
                            return;
                        }
                        const timerRemaining = getVar("furnace_countdown", 0, "int");
                        const timePerOre = SMELT_TIMES[ore] - 1;
                        const startAmount = getVar("furnace_ore_amount_set", 0, "int");
                        const doneAmount = getVar("furnace_ore_amount_at", 0, "int");
                        const remaining = startAmount - doneAmount - 1;
                        const totalTime = remaining * timePerOre + timerRemaining;
                        el.textContent = " - " + format_time(totalTime);
                    }

                    if (key == "combat_loot_potion_active") {
                        const loot_pot = getVar("combat_loot_potion_active", 0, "int");
                        if (loot_pot == 0) {
                            hideElement(
                                document.getElementById("notification-loot_pot_avail")
                            );
                        } else {
                            showInlineBlockElement(
                                document.getElementById("notification-loot_pot_avail")
                            );
                        }
                    }

                    ////////// SD Watch Notification
                    const sdWatchCrafted = getVar("stardust_watch_crafted", 0, "int");
                    const sdWatchCharges = getVar("stardust_watch_charges", 0, "int");
                    if (getThis.getConfig("moveSDWatch") && sdWatchCrafted === 1) {
                        hideElement(document.getElementById("notification-stardust_watch"));
                        document.querySelector(
                            "#menu-bar-sd_watch .sd-watch-charges"
                        ).textContent = sdWatchCharges;
                        document.querySelector(
                            "#menu-bar-sd_watch_2 .sd-watch-charges_2"
                        ).textContent = sdWatchCharges;
                    } else if (!getThis.getConfig("moveSDWatch") && sdWatchCharges > 0) {
                        showElement(document.getElementById("notification-stardust_watch"));
                    } else {
                        hideElement(document.getElementById("notification-stardust_watch"));
                        hideElement(document.getElementById("menu-bar-sd_watch"));
                    }

                    if (key.startsWith("gathering_working_gathering_loot_bag_")) {
                        var today = new Date();
                        var time =
                            today.getHours().toLocaleString("en-US", {
                                minimumIntegerDigits: 2,
                                useGrouping: false,
                            }) +
                            ":" +
                            today.getMinutes().toLocaleString("en-US", {
                                minimumIntegerDigits: 2,
                                useGrouping: false,
                            }) +
                            ":" +
                            today.getSeconds().toLocaleString("en-US", {
                                minimumIntegerDigits: 2,
                                useGrouping: false,
                            });
                        var location = key.replace(
                            "gathering_working_gathering_loot_bag_",
                            ""
                        );
                        var bagCount = getVar(key, 0, "int").toLocaleString();
                    }

                    if (key.includes("raw_") || key.includes("cooked_")) {
                        if (Globals.currentPanel == "panel-fishing") {
                            uitFishing().calcFishEnergy();
                        }
                    }

                    if (key.endsWith("_xp")) {
                        uitLevel().extendedLevelsUpdate();
                    }

                    const hideBoatNotifications = getThis.getConfig("hideBoat");
                    const pirate_ship_timer = getVar("pirate_ship_timer", 0, "int");
                    const row_boat_timer = getVar("row_boat_timer", 0, "int");
                    const canoe_boat_timer = getVar("canoe_boat_timer", 0, "int");
                    const stardust_boat_timer = getVar("stardust_boat_timer", 0, "int");
                    const submarine_boat_timer = getVar("submarine_boat_timer", 0, "int");
                    if (hideBoatNotifications) {
                        hideElement(document.getElementById("notification-row_boat"));
                        hideElement(document.getElementById("notification-canoe_boat"));
                        hideElement(document.getElementById("notification-stardust_boat"));
                        hideElement(document.getElementById("notification-pirate_ship"));
                        hideElement(document.getElementById("notification-submarine_boat"));
                    } else {
                        if (row_boat_timer > 0) {
                            showElement(document.getElementById("notification-row_boat"));
                        }
                        if (canoe_boat_timer > 0) {
                            showElement(document.getElementById("notification-canoe_boat"));
                        }
                        if (stardust_boat_timer > 0) {
                            showElement(
                                document.getElementById("notification-stardust_boat")
                            );
                        }
                        if (pirate_ship_timer > 0) {
                            showElement(document.getElementById("notification-pirate_ship"));
                        }
                        if (submarine_boat_timer > 0) {
                            showElement(
                                document.getElementById("notification-submarine_boat")
                            );
                        }
                    }

                    if (key === "furnace_ore_amount_set") {
                        setTimeout(function () {
                            var furnaceOreTypeVar = getVar(
                                "furnace_ore_amount_set",
                                0,
                                "int"
                            );
                            var furnaceNotifVar = IdlePixelPlus.plugins[
                                "ui-tweaks"
                            ].getConfig("furnaceEmptyNotification");

                            if (furnaceOreTypeVar <= 0 && furnaceNotifVar) {
                                document.getElementById(
                                    "notification-furnace_avail"
                                ).style.display = "inline-block";
                            } else {
                                hideElement(
                                    document.getElementById("notification-furnace_avail")
                                );
                            }
                        }, 500);
                    }

                    if (key.startsWith("nades_purple_key")) {
                        let purpKeyMonst = getVar("nades_purple_key_monster", "", "string");
                        let purpKeyRarity = getVar("nades_purple_key_rarity", "", "string");
                        let purpKeyTimer = getVar("nades_purple_key_timer", 0, "int");

                        uitPurpleKey().onPurpleKey(
                            purpKeyMonst,
                            purpKeyRarity,
                            purpKeyTimer
                        );
                    }

                    if (key === "playtime") {
                        uitCriptoe().updateCrippledToeTimer();
                    }
                }
                ////////// Allowed to Run while in combat
                ////////// Current FP with Timer (Left Sidecar)
                if (Globals.currentPanel == "panel-combat-canvas") {
                    var currentFP = getVar("fight_points", 0, "int").toLocaleString();
                    var rarePotTimer = getVar("rare_monster_potion_timer", 0, "int");
                    var rarePotPlusTimer = getVar(
                        "super_rare_monster_potion_timer",
                        0,
                        "int"
                    );
                    var rarePotInfo = "";

                    if (rarePotTimer > 0) {
                        rarePotInfo = rarePotTimer;
                    } else if (rarePotPlusTimer > 0) {
                        rarePotInfo = format_time(rarePotPlusTimer);
                    } else {
                        rarePotInfo = "Inactive";
                    }

                    var combatLootPotActive = getVar(
                        "combat_loot_potion_active",
                        0,
                        "int"
                    );
                    var combatLootPotInfo = combatLootPotActive ? "Active" : "Inactive";

                    document.getElementById(
                        "combat-info-fight_point-right-fp"
                    ).textContent = " " + currentFP;
                    document.getElementById(
                        "combat-info-fight_point-left-fp"
                    ).textContent = " " + currentFP;
                    document.getElementById("combat-info-rare_pot-right-rp").textContent =
                        " " + rarePotInfo;
                    document.getElementById("combat-info-rare_pot-left-rp").textContent =
                        " " + rarePotInfo;
                    document.getElementById("combat-info-loot_pot-right-lp").textContent =
                        " " + combatLootPotInfo;
                    document.getElementById("combat-info-loot_pot-left-lp").textContent =
                        " " + combatLootPotInfo;
                }

                function setTransform(element, transformValue) {
                    element.style.transform = transformValue;
                }

                function clearTransform(element) {
                    element.style.transform = "";
                }

                function showInlineBlockElement(element) {
                    element.style.display = "inline-block";
                }

                function showBlockElement(element) {
                    element.style.display = "block";
                }

                function showElement(element) {
                    element.style.display = "";
                }

                function showFlexElement(element) {
                    element.style.display = "block";
                }

                function hideElement(element) {
                    element.style.display = "none";
                }

                if (key == "playtime") {
                    utcDate = new Date().getUTCDate();
                    if (utcDate != currUTCDate) {
                        currUTCDate = utcDate;
                        //console.log(`UTCDate is now: ${currUTCDate}, and the criptoe update has fired off.`);
                        uitCriptoe().addCriptoeValues();
                    }
                }
                if (key == "in_raids" && valueAfter == 1) {
                    document.getElementById('raids-advert-button').style.display = 'none';
                    document.getElementById('raids-start-button').style.display = 'none';
                }
            }
        }
        //////////////////////////////// onVariableSet end ////////////////////////////////

        onChat(data) {
            getThis.updateColors(CHAT_UPDATE_FILTER);
            getThis.limitChat();
            IdlePixelPlus.plugins['ui-tweaks'].makeUUIDClickable();
            IdlePixelPlus.plugins['ui-tweaks'].convertNameLinks();
            const el = $("#chat-area > *").last();
            el.html(uitMisc().replaceLinks(el.html()));
        }

        onMessageReceived(data) {
            if (data.startsWith("OPEN_DIALOGUE_CALLBACK=NO TEAM") && uitSoloRaiding) {
                uitSoloRaiding = false;
                document.getElementById('modal-image-btn-primary').click();
            }
        }

        onCombatEnd() {
            getThis.updateColors(PANEL_UPDATE_FILTER);
            getThis.updateColors();
        }

        makeUUIDClickable() {
            const regex = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
            let chatArea = document.getElementById("chat-area");
            let lastMessageElement = chatArea.lastChild;
            let player = lastMessageElement.querySelector('.chat-username').innerText;
            let bgColor = `background-color: ${IdlePixelPlus.plugins['ui-tweaks'].getConfig('background-color-chat-area-raid-password')}; `;
            let fColor = `color: ${IdlePixelPlus.plugins['ui-tweaks'].getConfig('font-color-chat-area-chat-raid-password')}; `;

            if (lastMessageElement && 'innerHTML' in lastMessageElement) {
                let lastMessage = lastMessageElement.innerHTML;
                lastMessage = lastMessage.replace(regex, function (match) {
                    //console.log("Found UUID");
                    return `<a href="#" style="${bgColor}${fColor}font-weight: bold; font-style:italic" onclick="IdlePixelPlus.plugins['ui-tweaks'].sendRaidJoinMessage('${match}'); switch_panels('panel-combat'); document.getElementById('game-panels-combat-items-area').style.display = 'none';document.getElementById('combat-stats').style.display = 'none';document.getElementById('game-panels-combat-raids').style.display = ''; return false;">${player} Raid</a>`;
                });

                lastMessageElement.innerHTML = lastMessage;
            } else {
                console.log("No valid last message element found");
            }
        }

        convertNameLinks() {
            if( IdlePixelPlus.plugins['ui-tweaks'].getConfig("convertNameLink") ) {
                let chatArea = document.getElementById("chat-area");
                let lastMessageElement = chatArea.lastChild;
                let player = lastMessageElement.querySelector('.chat-username').innerText;
                lastMessageElement.querySelector('.chat-username').href = `https://data.idle-pixel.com/compare/?player1=${window['var_username']}&player2=${player}`;
            }
        }

        sendRaidJoinMessage(uuid) {
            websocket.send(`JOIN_RAID_TEAM=${uuid}`);
        }

        copyTextToClipboard(text) {
            navigator.clipboard.writeText(text).then(function () {
                //console.log('Copying to clipboard was successful!');
            }, function (err) {
                console.error('Could not copy text: ', err);
            });
        }

    }

    const elementsWithWidth = document.querySelectorAll("[width]");
    elementsWithWidth.forEach(function (el) {
        el.setAttribute("original-width", el.getAttribute("width"));
    });

    const elementsWithHeight = document.querySelectorAll("[height]");
    elementsWithHeight.forEach(function (el) {
        el.setAttribute("original-height", el.getAttribute("height"));
    });

    const plugin = new UITweaksPlugin();
    IdlePixelPlus.registerPlugin(plugin);
})();
