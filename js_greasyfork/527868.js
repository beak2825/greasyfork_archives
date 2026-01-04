// ==UserScript==
// @name         ZedHelper
// @description  Misc helper tools for Zed City
// @version      0.5.8
// @namespace    kvassh.zedhelper
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @homepage     https://greasyfork.org/en/scripts/527868-zedhelper
// @author       Kvassh
// @match        https://www.zed.city/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.onurlchange
// @connect      api.zed.city
// @downloadURL https://update.greasyfork.org/scripts/527868/ZedHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/527868/ZedHelper.meta.js
// ==/UserScript==

/** 
 * ZedHelper
 * 
 * Features:
 * - Displays market value for items in inventory
 * - Calculates your inventory networth based on current market values
 * - Extra nav menu with some useful shortcuts (togglable in settings)
 * - Autopopulates gym train input fields to use maximum energy
 * - Autopopulates input field for junk shop with 360 item buy qty
 * - Show value of trades at Radio Tower
 * - Show timer for various features (Raid, Junk Store limit)
 *
 * If you have any questions, feel free to reach out to Kvassh [12853] in Zed City
 * 
 * Changelog:
 * - 0.5.8:  Faction raid report: Fix bug in date comparison - dont use local timezone
 * - 0.5.7:  Faction raid report: Redesign implementation, fixes bug when storing faction logs and generating raid report
 * - 0.5.6:  Faction raid report: Fetch all data from API instead of parsing HTML from website
 * - 0.5.5:  Faction raid report: Fetch ZedCityTime from server instead of trying to parse locale
 * - 0.5.4:  Fix bug if local date uses dd.mm.yyyy format instead of mm/dd/yyyy like ZedCity
 * - 0.5.3:  Slightly increase max height of Raid Report element
 *           Remove shortcut to ZED MART
 *           Add shortcut to Faction storage for beer rations
 * - 0.5.2:  Add fallback URL detection listener if navigation API fails (like on Firefox)
 *           Fixed bug in time comparison for Raid Report log
 * - 0.5.1:  Add Faction Raid Report on logs page
 * - 0.4.17: Add Max Rad btn on scavenge page
 *           Make icons/links smaller on the timer bar
 * - 0.4.16: Try to click MAX button to set input to max in stores
 *           Add more buttons to timer bar (Gym, RadioTower, Scavenge)
 *           Make the timer links go to the page without reloading webbrowser page
 * - 0.4.15: Add bulk scavenge buttons for 5 and 30 scavenges at a time.
 *           Fix bug in Radio Tower trade value calculation.
 * - 0.4.14: Another fix for the duplicate timer bar issue, hopefully 100% fixed now.
 * - 0.4.13: Fix error with duplicate timer bar appearing.
 *           Add link to respective functions for timers also when not ready
 * - 0.4.12: Fix another bug in time parsing for timer bar
 * - 0.4.11: Fix bug in time parsing for timer bar
 * - 0.4.10: Fix correct link for Raid timer shortcut
 * - 0.4.9: Add timer for Raid
 * - 0.4.8: Add timer for Junk Store limit
 * - 0.4.7: Fix container width for mobile in Settings page.
 * - 0.4.6: Add ZH icon to statusbar that points to new Settings page.
 *          Add setting for toggling extra nav menu on or off.
 *          Include cash on hand when calculating networth.
 * - 0.4.5: Avoid duplicate inventory networth elements
 *          Less padding for item values in inventory to fit better on mobile.
 * - 0.4.4: Change homepage and downloadURL to use greasyfork.org + change icon to zed.city favicon.
 * - 0.4.3: Use navigation navigate eventlistener instead to detect page change.
 * - 0.4.2: Try to force window eventlistener for urlchange to work on mobile.
 * - 0.4.1: Show warning if market values has not been cached yet. 
 *          Show warning on Radio Tower if the cached data is old.
 *          Indicate if the trade is good or bad with checkmark on Radio Tower.
 *          Fixed bug on inventory page where it would potentially not update prices if changing to next page in inventorylist.
 * - 0.4: Add value of trades at Radio Tower.
 * - 0.3: Fix bug in gym autopopulate + add new autopopulate in junk store for 360 items.
 * - 0.2: Add feature to autopopulate gym input fields.
 * - 0.1: Initial release.
*/

(function() {
    'use strict';

    // Add CSS for displaying prices (optional, but makes it look nicer)
    GM_addStyle(`
        .market-price {
            color:#999999;
            float:right;
            position:absolute;
            top:18px;
            right:100px;
        }
        .green {
            color: #00cc66;
        }
        .red {
            color: #ff6666;
        }
        .gray {
            color: #888;
        }
        .zedhelper-networth {
            text-align: center;
            margin: 10px auto;
            color: #ccc;
            font-size: 1.6rem;
        }
        .zedhelper-inventory-warning {
            text-align: center;
            margin: 10px auto;
            color: #ccc;
            font-size: 0.8rem;
        }
        .radio-warning {
            text-align: center;
        }
        .zedhelper-timer-bar {
            margin-top:0px;
        }
        .zedhelper-timer-span {
            padding: 0 10px;
        }
        .zedhelper-timer-span a {
            text-decoration:none;
        }
    `);

    const baseApiUrl = 'https://api.zed.city';

    /** Dont modify anything below this line */

    let module = "index";
    let checkForInventoryUpdates = null;








    /** Utils */

    function get(key) {
        return localStorage.getItem(`kvassh.zedhelper.${key}`);
    }
    function set(key, value) {
        localStorage.setItem(`kvassh.zedhelper.${key}`, value);
    }

    function log(msg) {
        const spacer = "          ";
        const ts = new Date();
        console.log("ZedHelper (" + ts.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' } )+ ") " +
            "[" + module + "]" + ((module.length < spacer.length) ? spacer.substring(0, spacer.length - module.length) : "") + ": " +
            (typeof msg === 'object' ? JSON.stringify(msg) : msg));
    }

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
    
            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function getCodename(itemName) {
        let codename = itemName.toString().toLowerCase().replace(' ', '_').trim().split(/\n/)[0];

        let nametable = {
            "arrows": "ammo_arrows",
            "bows": "ammo_bows",
            "logs": "craft_log",
            "nails": "craft_nails",
            "rope": "craft_rope",
            "scrap": "craft_scrap",
            "wire": "craft_wire",
            "army_helmet": "defense_army_helmet",
            "camo_hat": "defense_camo_hat",
            "camo_vest": "defense_camo_vest",
            "e-cola": "ecola",
            "lighter":"misc_lighter",
            "lockpick":"misc_lockpick",
            "pickaxe":"misc_pickaxe",
            "security_card":"defense_security_card",
            "zed_coin": "points",
            "baseball_bat": "weapon_baseball_bat",
            "bow":"weapon_bow",
            "chainsaw":"weapon_chainsaw",
            "spear":"weapon_spear",
            "switchblade":"weapon_switchblade",
        };

        for (const [key, value] of Object.entries(nametable)) {
            if (codename === key) {
                return value;
            }
        }
        return codename;
    }

    function formatNumber(number) {
        const formatter = new Intl.NumberFormat('nb-NO', {
            maximumFractionDigits: 0,
            

        });
        return formatter.format(number);
    }


















    /** XHR Interceptor */

    const originalXHR = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        this.addEventListener('load', async function () {
            const url = this.responseURL;

            // if (url.includes("/getOffers")) {
            //     const item = JSON.parse(this.responseText)[0];
            //     log(`Caching market value for: ${item['name']} (${item['codename']})`);
            //     set(`mv_${item["codename"]}`, JSON.stringify({ "name": item["name"], "marketValue": item["market_price"], "tz": Date.now() }));
            // }

            if (url.endsWith("/getMarket")) {
                const items = JSON.parse(this.responseText).items;
                let itemsCached = 0;
                for (let item of items) {
                    let codename = getCodename(item["name"]);
                    set(`mv_${codename}`, JSON.stringify({ "name": item["name"], "marketValue": item["market_price"], "tz": Date.now() }));
                    itemsCached++;
                }
                set(`mv_lastupdate`, Date.now());
                log(`Cached market value for ${itemsCached} items.`);
            }

            else if (url.endsWith("/loadItems")) {
                const data = JSON.parse(this.responseText);
                const items = data.items;
                let networthVendor = 0;
                let networthMarket = 0;
                for (let item of items) {

                    networthVendor += item.value * item.quantity;

                    const codename = item.codename;
                    if(get(`mv_${codename}`)) {
                        const mv = JSON.parse(get(`mv_${codename}`));
                        networthMarket += mv.marketValue * item.quantity;
                    } else {
                        networthMarket += item.value * item.quantity;
                    }
                }
                set(`mv_networth_vendor`, networthVendor);
                set(`mv_networth_market`, networthMarket);
                log(`cached inventory networth (vendor: ${networthVendor}, market: ${networthMarket})`);
            }

            else if (url.endsWith("/getStats")) {
                const data = JSON.parse(this.responseText);
                set(`energy`, data.energy);
                set(`morale`, data.morale);
                set(`rad`, data.rad);
                set(`refills`, data.refills);
                set(`money`, data.money);
                set(`xpUntilNextRank`, parseInt(data.xp_end-data.experience));

                set(`raidCooldownSecondsLeft`, data.raid_cooldown); 
                set(`raidCooldownTime`, Date.now()); 
            }

            else if (url.endsWith("/getRadioTower")) {
                const data = JSON.parse(this.responseText);
                saveCurrentTradeValues(data);
                set(`radio_lastupdate`, Date.now());
            }

            else if (url.endsWith("/getStore?store_id=junk")) {
                const data = JSON.parse(this.responseText);
                if (data.hasOwnProperty('limits')) {
                    set(`junkStoreLimitSecondsLeft`, data.limits.reset_time); 
                    set(`junkStoreLimitTime`, Date.now()); 
                } else {
                    set(`junkStoreLimitSecondsLeft`, 0); 
                    set(`junkStoreLimitTime`, 0); 
                }
            }

            else if (url.endsWith("/getStore?store_id=zedmart")) {
                const data = JSON.parse(this.responseText);
                if (data.hasOwnProperty('limits')) {
                    set(`zedMartLimitSecondsLeft`, data.limits.reset_time); 
                    set(`zedMartLimitTime`, Date.now()); 
                } else {
                    set(`zedMartLimitSecondsLeft`, 0); 
                    set(`zedMartLimitTime`, 0); 
                }
            }

            else if (url.endsWith("/getFactionMembers")) {
                const data = JSON.parse(this.responseText);
                log("Intercepting faction members!!!");
                if (data.hasOwnProperty('members')) {
                    set('factionMembers', JSON.stringify(data.members));
                }
            }

            else if (url.indexOf("getFactionNotifications") !== -1) {

                showRaidReport(true);
                await storeFactionLogs(url, this.responseText);
                setTimeout(() => { showRaidReport() }, 250);
            }

        });
        originalXHR.apply(this, args);
    };


















    /** Main script */

    log("Starting up ZedHelper!");

    let navigationTimeout = null;

    let urlChangeHandler = async () => {
        if (navigationTimeout === null) {

            const page = location.pathname;

            // Ensure we dont watch for inventory updates after changing subpage
            clearInterval(checkForInventoryUpdates);
            checkForInventoryUpdates = null;

            // Update the timer bar
            addZedHelperIconAndTimerBar();

            if (page.includes("inventory")) {
                module = "inventory";
                // log("Waiting for inventory list...");
                
                waitForElement("#q-app > div > div.q-page-container > main > div > div:nth-child(4) > div > div.grid-cont.no-padding").then(() => {
                    waitForElement(".item-row").then(() => {
                        log("Inventory list loaded! Adding market prices...");
                        addMarketPrices();
                    });
                });

                waitForElement("#q-app > div > div.q-page-container > main > div").then(() => {
                    showNetworth();
                });
            }
            else if (page.includes("market-listings")) {
                module = "market";
                log("Navigated to Market Listings - Watching for element to add new listing...");
                waitForElement("div > div > button.q-btn.q-btn-item.bg-positive").then(() => {
                    log("Detected form for adding new market listing... showing market values for inventory!");
                    addMarketPrices();
                })
            }
            else if (page.includes("stronghold/2375014")) {
                module = "gym";
                log("Navigated to Gym");
                autoPopulateTrainInput();
            }
            else if (page.includes("stronghold/2375016")) {
                module = "crafting";
                log("Navigated to Crafting Bench");
            }
            else if (page.includes("stronghold/2375017")) {
                module = "furnace";
                log("Navigated to Furnace");
            }
            else if (page.includes("stronghold/2375019")) {
                module = "radio";
                log("Navigated to Radio Tower");
                setTimeout(() => {
                    showTradeValues();
                },1000);
            }
            else if (page.includes("/store/")) {
                module = "store";
                log("Setting up auto input for store - click max btn automatically");
                // autoPopulate360Items();
                autoPopulateMaxItems();
            }
            else if (page.includes("/zedhelper")) {
                showSettingsPage();
            }
            else if (/\/scavenge\/\d+$/.test(page)) {
                module = "scavenge";
                log("Navigated to Scavenge");
                addBulkScavengeButtons();
            }
            else if (page.includes('/faction/logs')) {
                module = "faction-logs";
                log("Navigated to Faction Logs");
                clearFactionLogsCache();
                /* XHR interceptor will automatically fetch logs
                then call on the showRaidReport */
            }
            else {
                module = "unknown";
                log(`Unknown subpage: ${page}`);
            }

            navigationTimeout = setTimeout(() => {
                clearTimeout(navigationTimeout);
                navigationTimeout = null;
            }, 250);
        }
    }

    try {
        navigation.addEventListener('navigate', () => {
            setTimeout(() => {
                urlChangeHandler();
            },100);
        });
    } catch (error) {
        log("FATAL ERROR: Could not add EventListener for navigation navigate: " + JSON.stringify(error));
        log("Trying to use fallback method");
        try {
            let currentPage = '';
            let prevPage = '';
            setInterval(() => {
                currentPage = location.pathname;
                if (currentPage !== prevPage) {
                    log("URL changed - handle it!");
                    urlChangeHandler();
                }
                prevPage = currentPage;
            },1000);
            log("Activated fallback method for listening to URL change events.");
        } catch(e) {
            log("FATAL ERROR: Fallback method for URL changes didn't work. Sorry, you're SOL...");
        }
    }













    /** Add a second nav menu with some useful shortcuts */

    // document.querySelector("#q-app > div > header > div:nth-child(2) > div > div > div").app
    const secondNavBar = document.createElement('div');
    secondNavBar.innerHTML = `
<div>
    <div class="gt-xs bg-grey-3 text-grey-5 text-h6">
        <div class="q-tabs row no-wrap items-center q-tabs--not-scrollable q-tabs--horizontal q-tabs__arrows--inside q-tabs--mobile-with-arrows q-tabs--dense" role="tablist" inside-arrows="">

            <div class="q-tabs__content scroll--mobile row no-wrap items-center self-stretch hide-scrollbar relative-position q-tabs__content--align-center">

                <a class="q-tab relative-position self-stretch flex flex-center text-center q-tab--inactive q-tab--full q-focusable q-hoverable cursor-pointer menu-link" tabindex="0" role="tab" aria-selected="false" href="/stronghold/2375017">
                    <div class="q-focus-helper" tabindex="-1"></div>
                    <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
                        <div class="q-tab__label">Furnace</div>
                    </div>
                    <div class="q-tab__indicator absolute-bottom text-transparent"></div>
                </a>
                
                <a class="q-tab relative-position self-stretch flex flex-center text-center q-tab--inactive q-tab--full q-focusable q-hoverable cursor-pointer menu-link" tabindex="0" role="tab" aria-selected="false" href="/stronghold/2375014">
                    <div class="q-focus-helper" tabindex="-1"></div>
                    <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
                        <div class="q-tab__label">Gym</div>
                    </div>
                    <div class="q-tab__indicator absolute-bottom text-transparent"></div>
                </a>

                <a class="q-tab relative-position self-stretch flex flex-center text-center q-tab--inactive q-tab--full q-focusable q-hoverable cursor-pointer menu-link" tabindex="0" role="tab" aria-selected="false" href="/scavenge/2">
                    <div class="q-focus-helper" tabindex="-1"></div>
                    <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
                    <div class="q-tab__label">Scrapyard</div>
                    </div>
                    <div class="q-tab__indicator absolute-bottom text-transparent"></div>
                </a>

                <a class="q-tab relative-position self-stretch flex flex-center text-center q-tab--inactive q-tab--full q-focusable q-hoverable cursor-pointer menu-link" tabindex="0" role="tab" aria-selected="false" href="/market">
                    <div class="q-focus-helper" tabindex="-1"></div>
                    <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
                    <div class="q-tab__label">Market</div>
                    </div>
                    <div class="q-tab__indicator absolute-bottom text-transparent"></div>
                </a>

                <a class="q-tab relative-position self-stretch flex flex-center text-center q-tab--inactive q-tab--full q-focusable q-hoverable cursor-pointer menu-link" tabindex="0" role="tab" aria-selected="false" href="/store/junk">
                    <div class="q-focus-helper" tabindex="-1"></div>
                    <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
                    <div class="q-tab__label">Junk Store</div>
                    </div>
                    <div class="q-tab__indicator absolute-bottom text-transparent"></div>
                </a>

                <a class="q-tab relative-position self-stretch flex flex-center text-center q-tab--inactive q-tab--full q-focusable q-hoverable cursor-pointer menu-link" tabindex="0" role="tab" aria-selected="false" href="/zedhelper">
                    <div class="q-focus-helper" tabindex="-1"></div>
                    <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
                    <div class="q-tab__label">Settings</div>
                    </div>
                    <div class="q-tab__indicator absolute-bottom text-transparent"></div>
                </a>

            </div>
        </div>
    </div>
    `;  

    if(get('extraNavMenu') && (get('extraNavMenu') === 'true' || get('extraNavMenu') === true)) {
        log("Enabling extra navigation menu");
        waitForElement("#q-app > div > header").then(() => {
            document.querySelector("#q-app > div > header").appendChild(secondNavBar);
        });
    }











    /** Add icon for ZedHelper settings + timer bar */

    function addZedHelperIconAndTimerBar() {

        const zedHelperIcon = document.createElement('div');
        zedHelperIcon.classList = 'zedhelper-icon-bar';
        zedHelperIcon.innerHTML = `
    <div class="row items-center">
        <b><a href="/zedhelper" title="ZedHelper Settings" style="color:dodgerblue;text-decoration:none;font-weight:bold;">ZH</a></b>
    </div>
        `;

        const timerBar = document.createElement('div');
        timerBar.classList = "row q-col-gutter-md justify-center items-center zedhelper-timer-bar";

        let timeDiff = 0;
        let timeLeft = 0;
        let timeLeftFormatted = "";

        let html = `<div class="q-tab__label">`;

        /** GYM */
        // const maxEnergy = 150;
        // const currentEnergy = get('energy') || 0; // Retrieve current energy from storage
        // const energyRegenRate = 5; // Energy regenerated per interval
        // const regenIntervalMinutes = 10; // Interval in minutes
        // const missingEnergy = maxEnergy - currentEnergy;
        // const timeToFullEnergyMinutes = Math.ceil((missingEnergy / energyRegenRate) * regenIntervalMinutes);
        // if (timeToFullEnergyMinutes > 0) {
        //     const hours = Math.floor(timeToFullEnergyMinutes / 60);
        //     const minutes = timeToFullEnergyMinutes % 60;
        //     timeLeftFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        // }
        // html += `<span class="zedhelper-timer-span">Gym: <a id="zhOpenGym" style="cursor:pointer;">${timeToFullEnergyMinutes > 0 ? `<span class="red">${timeLeftFormatted}</span>` : `<span class="green">Ready</span>`}</a></span>`;
        // html += `<span class="zedhelper-timer-span"><a id="zhOpenGym" style="cursor:pointer;">⚡</a></span>`;
        // html += `<span class="zedhelper-timer-span"><a id="zhOpenGym" style="cursor:pointer;"><img src="https://www.zed.city/assets/gym-cOgAonBN.png" style="width:20px;position:relative;top:5px;"></a></span>`;
        html += `<span class="zedhelper-timer-span"><a id="zhOpenGym" style="cursor:pointer;">💪</a></span>`;

        /** RADIO TOWER */
        // const last = get("radioTower_last_visited") || 0;
        // const ready = parseInt(last) + (12*60*60*1000);
        // timeLeft = ready - Date.now();
        // const h = Math.floor(timeLeft / 36e5);
        // const m = Math.floor((timeLeft % 36e5) / 6e4);
        // const s = Math.floor((timeLeft % 6e4) / 1000);
        // // return `${h}h ${m}m ${s}s left`;
        // console.log(`last: ${last} - ready: ${ready} - now: ${Date.now()} - timeLeft: ${timeLeft}`);
        // // console.log("timeLeft: " + timeLeft);
        // try {
        //     timeLeftFormatted = new Date(timeLeft * 1000).toISOString().substr(11, 5);
        // } catch (error) {
        //     timeLeftFormatted = "00:00";
        // }
        // html += `<span class="zedhelper-timer-span">Radio&nbsp;Tower: <a id="zhOpenRadioTower" style="cursor:pointer;">${timeLeft > 0 ? `<span class="red">${timeLeftFormatted}</span>` : `<span class="green">Ready</span>`}</a></span>`;
        // html += `<span class="zedhelper-timer-span"><a id="zhOpenRadioTower" style="cursor:pointer;"><img src="https://www.zed.city/assets/radio_tower-DZgBlHS5.png" style="width:20px;position:relative;top:5px;"></a></span>`;
        html += `<span class="zedhelper-timer-span"><a id="zhOpenRadioTower" style="cursor:pointer;">📡</a></span>`;

        
        /** SCAVENGE */
        // const maxRad = 50;
        const currentRad = get('rad') || 0; // Retrieve current rad from storage
        // const radRegenRate = 1;             // Rad regenerated per interval
        // const regenIntervalMinutesRad = 5;    // Interval in minutes
        // const missingRad = maxRad - currentRad;
        // const timeToFullRadMinutes = Math.ceil((missingRad / radRegenRate) * regenIntervalMinutesRad);

        // let radTimeLeftFormatted = '';
        // if (timeToFullRadMinutes > 0) {
        //     const hours = Math.floor(timeToFullRadMinutes / 60);
        //     const minutes = timeToFullRadMinutes % 60;
        //     radTimeLeftFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        // }
        // html += `<span class="zedhelper-timer-span">Scavenge: <a id="zhOpenScavenge" style="cursor:pointer;">${timeToFullRadMinutes > 0 ? 
        //     `<span class="red">${radTimeLeftFormatted}</span>`
        //     : `<span class="green">Ready</span>`
        // }</a></span>`;
        // html += `<span class="zedhelper-timer-span"><a id="zhOpenScavenge" style="cursor:pointer;"><img src="https://www.zed.city/assets/scrapyard-BrTM3-qI.jpg" style="width:20px;position:relative;top:5px;"></a></span>`;
        // html += `<span class="zedhelper-timer-span"><a id="zhOpenScavenge" style="cursor:pointer;">${currentRad < 10 ? `<span class="red">Scavenge</span>` : `<span class="green">Scavenge</span>`}</a></span>`;
        html += `<span class="zedhelper-timer-span"><a id="zhOpenScavenge" style="cursor:pointer;">${currentRad < 10 ? `<span class="red">🛢️</span>` : `<span class="green">🛢️</span>`}</a></span>`;
                

        /** BEER RATIONS */
        html += `<span class="zedhelper-timer-span"><a id="zhOpenFactionStorage" style="cursor:pointer;">🍺</a></span>`;

        /** RAID */
        const raidCooldownSecondsLeft = get('raidCooldownSecondsLeft');
        const raidCooldownTime = get('raidCooldownTime');
        if (raidCooldownSecondsLeft && raidCooldownTime) {
            timeDiff = (Date.now() - raidCooldownTime)/1000;
            timeLeft = raidCooldownSecondsLeft - Math.round(timeDiff);
            try {
                timeLeftFormatted = new Date(timeLeft * 1000).toISOString().substr(11, 5);
            } catch (error) {
                timeLeftFormatted = "00:00";
            }
        }
        html += `<span class="zedhelper-timer-span" tooltip="${timeLeftFormatted}"><a id="zhOpenRaid" style="cursor:pointer;">${timeLeft > 0 ? `<span class="red">🪖&nbsp;${timeLeftFormatted}</span>` : `<span class="green">🪖✅</span>`}</a></span>`;

        /** JUNK STORE */
        const junkStoreLimitSecondsLeft = get('junkStoreLimitSecondsLeft');
        const junkStoreLimitTime = get('junkStoreLimitTime');
        if (junkStoreLimitSecondsLeft && junkStoreLimitTime) {
            timeDiff = (Date.now() - junkStoreLimitTime)/1000;
            timeLeft = junkStoreLimitSecondsLeft - Math.round(timeDiff);
            try {
                timeLeftFormatted = new Date(timeLeft * 1000).toISOString().substr(11, 5);
            } catch (error) {
                timeLeftFormatted = "00:00";
            }
        }
        html += `<span class="zedhelper-timer-span"><a id="zhOpenJunkStore" style="cursor:pointer;">${timeLeft > 0 ? `<span class="red">🏪&nbsp;${timeLeftFormatted}</span>` : `<span class="green">🏪✅</span>`}</a></span>`;
        
        /** ZED MART */
        // const zedMartLimitSecondsLeft = get('zedMartLimitSecondsLeft');
        // const zedMartLimitTime = get('zedMartLimitTime');
        // if (zedMartLimitSecondsLeft && zedMartLimitTime) {
        //     timeDiff = (Date.now() - zedMartLimitTime)/1000;
        //     timeLeft = zedMartLimitSecondsLeft - Math.round(timeDiff);
        //     try {
        //         timeLeftFormatted = new Date(timeLeft * 1000).toISOString().substr(11, 5);
        //     } catch (error) {
        //         timeLeftFormatted = "00:00";
        //     }
        // }
        // html += `<span class="zedhelper-timer-span"><a id="zhOpenZedMart" style="cursor:pointer;">${timeLeft > 0 ? `<span class="red">🏬&nbsp;${timeLeftFormatted}</span>` : `<span class="green">🏬✅</span>`}</a></span>`;

        html += `</div>`;

        timerBar.innerHTML = html;

        const selector = ".q-col-gutter-md.justify-center.items-center.currency-stats";
        log("Searching for statusbar...");
        waitForElement(selector).then((el) => {

            try {
                document.querySelectorAll('.zedhelper-icon-bar').entries().forEach((entry) => {
                    log("Remove entry of icon bar: " + entry[1]);
                    entry[1].remove();
                });
                document.querySelectorAll('.zedhelper-timer-bar').entries().forEach((entry) => {
                    log("Remove entry of timer bar: " + entry[1]);
                    entry[1].remove();
                });
            } catch (error) {
                // eat exception
            }
            log("Appending ZedHelper icon to statusbar + adding new bar for timers!");
            el.appendChild(zedHelperIcon);
            el.parentElement.appendChild(timerBar);

            // document.querySelector(selector).parentElement.appendChild(zedHelperIcon);

            /** Setup event listener to detect clicks on the timer buttons */
            setTimeout(() => {
                document.querySelector('#zhOpenGym').addEventListener('click', (event) => {
                    event.preventDefault();
                    openGym();
                });
                document.querySelector('#zhOpenRadioTower').addEventListener('click', (event) => {
                    event.preventDefault();
                    openRadioTower();
                });
                document.querySelector('#zhOpenScavenge').addEventListener('click', (event) => {
                    event.preventDefault();
                    openScavenge();
                });
                document.querySelector('#zhOpenFactionStorage').addEventListener('click', (event) => {
                    event.preventDefault();
                    openFactionStorage();
                });
                document.querySelector('#zhOpenRaid').addEventListener('click', (event) => {
                    event.preventDefault();
                    openRaid();
                });
                document.querySelector('#zhOpenJunkStore').addEventListener('click', (event) => {
                    event.preventDefault();
                    openJunkStore();
                });
                // document.querySelector('#zhOpenZedMart').addEventListener('click', (event) => {
                //     event.preventDefault();
                //     openZedMart();
                // });
            },10);

        });
    }
    function openGym() {
        log("Opening Gym...");
        // Navigate to Faction
        const link = [...document.querySelectorAll("a.menu-link")].find(a => a.textContent.trim().toLowerCase() === "stronghold");
        link.click();
        waitForElement('div.building-cont').then(() => {
            setTimeout(() => {
                const gymDiv = [...document.querySelectorAll("div.building-cont")].find(el => el.textContent.trim().includes("Gym"));
                gymDiv.click();
            },250);
        });
    }
    function openRadioTower() {
        log("Opening Radio Tower...");
        // Navigate to Faction
        const link = [...document.querySelectorAll("a.menu-link")].find(a => a.textContent.trim().toLowerCase() === "stronghold");
        link.click();
        waitForElement('div.building-cont').then(() => {
            setTimeout(() => {
                const link = [...document.querySelectorAll("div.building-cont")].find(el => el.textContent.trim().includes("Radio Tower"));
                link.click();
            },250);
        });
    }
    function openScavenge() {
        log("Opening Scavenge...");
        // Navigate to Faction
        const link = [...document.querySelectorAll("a.menu-link")].find(a => a.textContent.trim().toLowerCase() === "scavenge");
        link.click();
        waitForElement('.job-cont').then(() => {
            setTimeout(() => {
                const link = [...document.querySelectorAll(".job-cont")].find(el => el.textContent.includes("Scrapyard"));
                link.click();
            },250);
        });
    }
    function openRaid() {
        log("Opening Raid...");
        // Navigate to Faction
        const link = [...document.querySelectorAll("a.menu-link")].find(a => a.textContent.trim().toLowerCase() === "faction");
        link.click();
        // Then click on Raid
        waitForElement('a[href="/raids"]').then((el) => {
            el.click();
        });
    }
    function openFactionStorage() {
        log("Opening Faction Storage...");
        // Navigate to Faction
        const link = [...document.querySelectorAll("a.menu-link")].find(a => a.textContent.trim().toLowerCase() === "faction");
        link.click();
        // Then click on Storage
        //document.querySelector("#q-app > div > div.q-page-container > main > div > div:nth-child(16) > div.row.items-stretch.q-col-gutter-xs > div:nth-child(2) > div > div > div.building-cont.idle.click-event")
        waitForElement('.building-cont').then(() => {
            setTimeout(() => {
                const link = [...document.querySelectorAll(".building-cont")].find(el => el.textContent.includes("Storage"));
                link.click();
            },250);
        });
    }
    function openJunkStore() {
        log("Opening Junk Store...");
        // Navigate to City
        const link = [...document.querySelectorAll("a.menu-link")].find(a => a.textContent.trim().toLowerCase() === "city");
        link.click();
        // Then click on Junk store
        waitForElement('a[data-cy="citymenu-junk-store"]').then((el) => {
            el.click();
        });
    }
    function openZedMart() {
        log("Opening Zed Mart...");
        // Navigate to City
        const link = [...document.querySelectorAll("a.menu-link")].find(a => a.textContent.trim().toLowerCase() === "city");
        link.click();
        // Then click on Zed Mart
        waitForElement('a[data-cy="citymenu-zed-mart"]').then((el) => {
            el.click();
        });
    }
    
    // addZedHelperIconAndTimerBar();









    /** Settings page */

    function showSettingsPage() {
        const selector = "#q-app > div > div.q-page-container > div";
        waitForElement(selector).then((el) => {
            el.style.top = "40%";
            el.style.width = "90%";
            el.style.border = "2px inset #333";
            el.style.padding = "10px";
            el.innerHTML = `
            <h3>ZedHelper Settings</h3>
            <p>Userscript written by <a href="https://www.zed.city/profile/12853">Kvassh</a><br>
            For any questions or feedback, please reach out to me in Zed City or Discord.</p>

            <br><br><hr><br>
            
            <div style="text-align:left;">
                <label>Enable extra nav menu? <input type="checkbox" id="extraNavMenu" name="extraNavMenu" value="true" ${get('extraNavMenu') === true | get('extraNavMenu') === 'true' ? 'checked' : ''}></label>
            </style>

            <br><br>
            <div id="zedhelper-settings-output" style="height:50px; display:block;"> </div>
            
            `;
            setTimeout(() => {
                document.querySelector("#extraNavMenu").addEventListener('change', (event) => {
                    set('extraNavMenu', event.target.checked);
                    document.querySelector('#zedhelper-settings-output').innerHTML = '<b class="green">Settings saved! &check;<br>You might need to refresh page for some settings like the extra nav menu.</b>';
                    setTimeout(() => {
                        document.querySelector('#zedhelper-settings-output').innerHTML = " ";
                    },1000);
                });
            }, 100);
        });
    }










    /** Gym functions */

    function autoPopulateTrainInput() {

        const energy = get("energy");
        if (energy > 5) {
            const trainsAvailable = Math.floor(energy/5);
            log(`Current energy: ${energy} - Autopopulating ${trainsAvailable} into the input fields`);

            waitForElement("input.q-field__native").then(() => {
                
                const inputs = document.querySelectorAll("input.q-field__native");
                for (let input of inputs) {
                    input.value = trainsAvailable;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                }

            });
        } else {
            log("Current energy is 5 or lower, don't autopopulate input fields");
        }
    }
                    






    /** Scavenge functions */
    function addBulkScavengeButtons() {
        const selector = "#q-app > div > div.q-page-container > main > div > div > div.full-width > div > div.q-mt-lg";
        waitForElement(selector).then(() => {
            // Add buttons for 1, 5, 10, 25, 50, 100 scavenges
            const container = document.querySelector(selector);
            const doScavengeBtn = document.querySelector("#q-app > div > div.q-page-container > main > div > div > div.full-width > div > div.q-mt-lg > button:nth-child(1)");

            const btn5 = document.createElement('button');
            btn5.innerHTML = `<span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><span class="block">x5</span></span>`;
            btn5.classList = "q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-positive text-white q-btn--actionable q-focusable q-hoverable";
            btn5.style.margin = "5px";
            btn5.addEventListener('click', () => {
                console.log("Clicking 5 times...");
                for (let i = 0; i < 5; i++) {
                    doScavengeBtn.click();
                }
            });
            container.append(btn5);

            const btn30 = document.createElement('button');
            btn30.innerHTML = `<span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><span class="block">x30</span></span>`;
            btn30.classList = "q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-positive text-white q-btn--actionable q-focusable q-hoverable";
            btn30.style.margin = "5px";
            btn30.addEventListener('click', () => {
                console.log("Clicking 30 times...");
                for (let i = 0; i < 30; i++) {
                    doScavengeBtn.click();
                }
            });
            container.append(btn30);

            const currentRad = get('rad') || 0;
            const btnMax = document.createElement('button');
            btnMax.innerHTML = `<span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><span class="block">Rad (x${currentRad})</span></span>`;
            btnMax.classList = "q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-positive text-white q-btn--actionable q-focusable q-hoverable";
            btnMax.style.margin = "5px";
            btnMax.addEventListener('click', () => {
                console.log(`Current rad: ${currentRad} - Clicking ${currentRad} times...`);
                for (let i = 0; i < currentRad; i++) {
                    doScavengeBtn.click();
                }
            });
            container.append(btnMax);
        });
    }



    /** Radio Tower functions */
    function showTradeValues() {
        try {

            const timeDiff = get("radio_lastupdate") ? (Date.now() - get("radio_lastupdate"))/1000 : 0;
            log(`Trade values last updated: ${timeDiff} sec ago`);
            if (timeDiff > 60*60*12) {
                log("Trade values are old. Please visit the Radio Tower to cache new values.");

                const el = document.createElement('div');
                el.classList.add('radio-warning');
                waitForElement("div.overlay-cont").then(() => {
                    const container = document.querySelector("div.overlay-cont");
                    // document.querySelector("#q-app > div > div.q-page-container > main > div > div:nth-child(11) > div.overlay-cont > div > div > div > div > div.text-center.text-no-bg-light.subtext-large.q-my-md")
                    el.innerHTML = `Radio trades data are old - please refresh <a href="stronghold/2375019">Radio Tower</a> to cache new values.`;
                    container.prepend(el);
                });
                return;
            }

            const trades = JSON.parse(get(`tradeValues`));
            // [{"give":96,"return":460},{"give":1425,"return":11900},{"give":3000,"return":2380}]
            log("Current trades to show:");
            log(trades);

            waitForElement(".q-pa-md").then(() => {
                const tradeContainers = document.querySelectorAll(".q-pa-md");
                let i = 0;
                for (let tradeContainer of tradeContainers) {
                    const valueEl = document.createElement('div');
                    valueEl.classList.add('trade-value');
                    valueEl.innerHTML = `
                    <div style="float:left;">
                        ${trades[i].giveqty} items worth<br><span class="red">$</span> ${formatNumber(trades[i].give)}
                    </div>
                    <div style="float:right;">
                        ${trades[i].returnqty} items worth<br><span class="green">$</span> ${formatNumber(trades[i].return)}
                    </div>
                    <div style="clear:both;font-size:1.2rem;">
                        ${parseInt(trades[i].return) > parseInt(trades[i].give) ? '<span class="green">&check;</span>' : '<span class="red">&cross;</span>'}
                    </div>
                    `;
                    tradeContainer.appendChild(valueEl);
                    i++;
                }

                // Update radiotower last purchased date
                set(`radioTower_last_visited`, Date.now());
            });
        } catch(error) {
            log("No trade values found");
        }
    }

    function saveCurrentTradeValues(data) {
        try {
            const trades = [];
            for (let trade of data.items) {
                // trade -> vars -> items -> <item_requirement_1> -> codename/req_qty
                // trade -> vars -> output -> <item_list-1> -> codename/quantity
                let worthGive = 0;
                let worthReturn = 0;
                let qtyGive = 0;
                let qtyReturn = 0;
                const items = trade.vars.items;
                Object.keys(items).forEach( (key,val) => {
                    const marketValue = JSON.parse(get(`mv_${items[key].codename}`)).marketValue;
                    worthGive += (marketValue*items[key].req_qty);
                    qtyGive += items[key].req_qty;
                });
                const output = trade.vars.output;
                Object.keys(output).forEach( (key,val) => {
                    const marketValue = JSON.parse(get(`mv_${output[key].codename}`)).marketValue;
                    worthReturn += (marketValue*output[key].quantity);
                    qtyReturn += output[key].quantity;
                });
                log(`Trade: ${trade.name} - Give: ${worthGive} - Return: ${worthReturn}`);
                trades.push({ "give": worthGive, "return": worthReturn, "giveqty": qtyGive, "returnqty": qtyReturn });
            }
            set(`tradeValues`, JSON.stringify(trades));
        } catch(error) {
            log("Error saving trade values");
            set(`tradeValues`, null);
        }
    }



    /** Store functions */

    function autoPopulate360Items() {
        const selector = "input[type=number].q-placeholder";
        waitForElement(selector).then(() => {
            const el = document.querySelector(selector);
            el.value = 360;
            el.dispatchEvent(new Event("input", { bubbles: true }));
        });
    }
    function autoPopulateMaxItems() {
        const selector = "input[type=number].q-placeholder";
        waitForElement(selector).then(() => {
            const maxButton = [...document.querySelectorAll("button")].find(btn => btn.textContent.toLowerCase().includes("max"));
            maxButton.click();
            // const el = document.querySelector(selector);
            // el.value = 360;
            // el.dispatchEvent(new Event("input", { bubbles: true }));
        });
    }



    /** Functions related to market/inventory */

    // Function to process inventory items and add prices
    async function addMarketPrices() {

        const items = document.querySelectorAll('.item-row');

        if (!items) {
        log("No inventory items found. Check your selectors.");
        return;
        }

        const mvLastUpdateEl = document.createElement('div');
        mvLastUpdateEl.classList.add('zedhelper-inventory-warning');
        const mvLastUpdated = get('mv_lastupdate');
        if (mvLastUpdated) {
            const timeDiff = (Date.now() - mvLastUpdated)/1000;
            log(`Market values last updated: ${timeDiff} sec ago`);
            if (timeDiff > 60*60*24) {
                log("Market values are older than 24 hours. Please visit the market page to cache new values.");
                mvLastUpdateEl.innerHTML = `Market values are older than a day - please visit the <a href="market">Market</a> page to cache new values.`;
            }
        }
        else {
            log("Market values not cached. Please visit the market page to cache values.");
            mvLastUpdateEl.innerHTML = `
            Market value has not been cached yet.<br>
            Please visit the <a href="market">Market</a> page first to calculate worth on your inventory.
            `;
        }
        const selector = "#q-app > div > div.q-page-container > main > div > div:nth-child(2)";
        waitForElement(selector).then(() => {
            document.querySelector(selector).prepend(mvLastUpdateEl);
        });

        // Delete any existing market value elements
        const existingMarketValues = document.querySelectorAll('.market-price');
        for (let mvEl of existingMarketValues) {
            mvEl.remove();
        }

        for (let item of items) {

            const codename = getCodename(item.querySelector('.q-item__label').innerText);
            let qty = 1;
            try {
                qty = item.querySelector('.item-qty').innerText;
                if (qty.includes("%")) {
                    qty = 1;
                } else {
                    qty = parseInt(qty.replace(/[^0-9]/g, ''));
                }
            } catch (error) {
                // eat exception
            }
            if (Number.isNaN(qty)) {
                qty = 1;
            }
            log(`Adding market value for ${codename} x ${qty}`);
            
            let data = null;
            if(get(`mv_${codename}`)) {
                data = JSON.parse(get(`mv_${codename}`));
            } 

            const priceElement = document.createElement('span');
            priceElement.classList.add('market-price');
            
            if (data !== null) {
                const datetime = new Date(data.tz).toISOString();
                priceElement.innerHTML = `<span title="${datetime}">
<b class="green">$</b> ${formatNumber(data.marketValue * qty)} 
<small>(<b class="green">$</b> ${formatNumber(data.marketValue)})</small>
</span>`;
            } else {
                priceElement.innerHTML = `<span class="gray">N/A</span>`;
            }
            item.querySelector('.q-item__label').appendChild(priceElement);
        }

        // Setup interval to check if inventory list changes
        let firstItemRowCodename = "";
        try {
            firstItemRowCodename = getCodename(items[0].querySelector('.q-item__label').innerText);
        } catch (error) {
            // eat exception
        }

        checkForInventoryUpdates = setInterval(() => {
            let newItems = document.querySelectorAll('.item-row');
            if (newItems.length !== items.length) {
                log("Inventory list has changed. Updating prices...");
                clearInterval(checkForInventoryUpdates);
                checkForInventoryUpdates = null;
                addMarketPrices();
                return;
            }
            let newFirstItemRowCodename = ""; 
            try {
                newFirstItemRowCodename = getCodename(newItems[0].querySelector('.q-item__label').innerText);
            } catch (error) {
                // eat exception
            }
            if (firstItemRowCodename != newFirstItemRowCodename) {
                log("Inventory list has changed. Updating prices...");
                clearInterval(checkForInventoryUpdates);
                checkForInventoryUpdates = null;
                addMarketPrices();
                return;
            }
        },250);
    }
    function showNetworth() {
        const networthVendor = get(`mv_networth_vendor`) || 0;
        const networthMarket = get(`mv_networth_market`) || 0;
        const networthCash = get(`money`) || 0;
        const networth = parseInt(networthMarket) + parseInt(networthCash);

        const existingElement = document.querySelector('.zedhelper-networth');
        if (existingElement) {
            existingElement.remove8();
        }

        const el = document.createElement('div');
        el.classList.add('zedhelper-networth');
        
        el.innerHTML = `
        Networth:
        <span title="Value of items only if sold to vendor: $ ${formatNumber(networthVendor)}">
            <b class="green">$</b> ${formatNumber(networth)}
        </span>
        `;
        
        const selector = "#q-app > div > div.q-page-container > main > div > div:nth-child(2)";
        waitForElement(selector).then(() => {
            document.querySelector(selector).prepend(el);
        });
    }






    /** 
     * Stuff related to faction logs
     */

    function handleFactionNotificationsResponse(json) {
        if (!json?.notify || !Array.isArray(json.notify)) return;

        const parsed = json.notify.map(entry => {
            const { type, data, date, viewed } = entry;
            const timestamp = Number(date);

            // Convert the timestamp (looks like Unix epoch-ish) to a Date
            // but Zed uses a custom epoch, not standard Unix seconds
            // let's test and detect it:
            const dateMs = timestamp < 2000000000 ? timestamp * 1000 : timestamp; // if smaller, assume seconds
            const formattedDate = new Date(dateMs * 1000); // if Zed uses seconds-since-something

            return {
                type,
                viewed,
                date: formattedDate.toLocaleString(),
                rawTimestamp: date,
                user: data.username || null,
                details: data,
            };
        });

        console.log("✅ Parsed Faction Notifications:", parsed);
        return parsed;
    }

    async function parseFactionNotifications(json) {
        if (!json?.notify || !Array.isArray(json.notify)) return [];

        const serverNow = await getServerTime(); // get current Zed City time
        const serverNowMs = serverNow.getTime();

        return json.notify.map(entry => {
            const { type, data, date, viewed } = entry;

            // Zed's date field seems like a seconds-based timestamp in their own epoch
            const zedTimestampSec = Number(date);

            // compute a Date relative to server time
            // assume the largest timestamp in current notifications is roughly 'now'
            const oldestZedTimestamp = Math.max(...json.notify.map(n => n.date));
            const offsetMs = serverNowMs - oldestZedTimestamp * 1000; // rough offset
            const eventDate = new Date(zedTimestampSec * 1000 + offsetMs);

            return {
                type,
                viewed,
                date: eventDate,           // actual JS Date object
                formatted: eventDate.toLocaleString(),
                rawTimestamp: zedTimestampSec,
                user: data.username || null,
                details: data
            };
        });
    }








    /** === Debug Overlay === */
    let debugOverlay, closeBtn, hideTimer;
    function showDebug(msg, replace = false) {
        if (!debugOverlay) {
            debugOverlay = document.createElement('div');
            Object.assign(debugOverlay.style, {
                position: 'fixed',
                bottom: '10px',
                left: '10px',
                background: 'rgba(20,20,20,0.85)',
                color: '#0f0',
                padding: '30px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'monospace',
                zIndex: 99999,
                maxHeight: '50vh',
                overflowY: 'auto',
                whiteSpace: 'pre-line',
                transition: 'opacity 1s ease',
                opacity: '1',
            });
            document.body.appendChild(debugOverlay);
            debugOverlay.addEventListener('click', () => {
                debugOverlay.remove(); 
                debugOverlay = null; 
            });
        }

        debugOverlay.style.opacity = '1';
        if (replace) debugOverlay.innerText = '';
        debugOverlay.innerText = `[${new Date().toLocaleTimeString()}] ${msg}\n` + debugOverlay.innerText;

        // Auto-hide after 30s
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            debugOverlay.style.opacity = '0';
        }, 60000);
    }







    /** TEST
     * 
    let container = document.querySelector('#q-app > div > div.q-page-container > main > div > div.q-infinite-scroll > div.zed-grid.has-title.has-content > div.grid-cont');
    let rows = Array.from(container.querySelectorAll('.tbl-row'));
    let row = rows[0];
    console.log(row);
    let textCol = row.querySelector('.col');
    let dateBox = row.querySelector('.row .col-shrink');
    let timeText = dateBox.textContent.trim().toLowerCase();
    console.log(`timeText: ${timeText}`);
    console.log(`textCol: `, row.querySelector('.col'));
    console.log(`dateBox: `, row.querySelector('.row .col-shrink'));
    */



    let cachedServerTime = null;
    let cachedServerTimeAt = 0;

    /** Parse server time string as UTC Date */
    function parseServerTimeAsUTC(str) {
        // Convert "2025-10-17 10:32:45" => "2025-10-17T10:32:45Z"
        return new Date(str.replace(" ", "T") + "Z");
    }

    /** Get server time directly from Zed API (cached 10 minutes) */
    async function getServerTime() {
        const now = Date.now();
        const cacheValidMs = 10 * 60 * 1000; // 10 minutes

        if (cachedServerTime && (now - cachedServerTimeAt) < cacheValidMs) {
            log("🕒 Using cached server time:", cachedServerTime);
            return new Date(cachedServerTime);
        }

        try {
            log("🕒 Fetching server time from Zed API...");
            const response = await fetch("https://api.zed.city/serverTime", {
                headers: { "accept": "application/json, text/plain, */*" },
                credentials: "include",
            });
            const data = await response.json();

            let serverTime;
            if (data.serverTime) serverTime = parseServerTimeAsUTC(data.serverTime);
            else if (data.server_time) serverTime = parseServerTimeAsUTC(data.server_time);
            else if (data.time) serverTime = new Date(data.time);
            else serverTime = new Date(data); // fallback

            if (isNaN(serverTime.getTime())) {
                throw new Error("Invalid server time received");
            }

            cachedServerTime = serverTime.toISOString();
            cachedServerTimeAt = now;
            return serverTime;

        } catch (err) {
            console.warn("⚠️ Could not fetch server time, fallback to local:", err);
            return new Date();
        }
    }

    function formatServerTimestamp(ts) {
        // Accepts UNIX seconds or milliseconds
        const d = new Date(ts > 1e12 ? ts : ts * 1000);

        // Format as UTC (ZedCity/server time)
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const hh = String(d.getUTCHours()).padStart(2, '0');
        const mi = String(d.getUTCMinutes()).padStart(2, '0');
        const ss = String(d.getUTCSeconds()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }

    /** Helper function to check if a time string (like "15 hours ago") belongs to yesterday, with debug */
    async function isFromYesterday(timeText) {
        const serverNow = await getServerTime();
        const lower = timeText.toLowerCase().trim();

        // Keyword checks
        if (lower.includes("yesterday") || lower.includes("a day ago")) return true;
        if (lower.includes("days ago")) return false;

        // Relative time parsing
        const hourMatch = lower.match(/(\d+)\s*hours?\s*ago/);
        const minuteMatch = lower.match(/(\d+)\s*minutes?\s*ago/);
        const secondMatch = lower.match(/(\d+)\s*seconds?\s*ago/);

        let diffMs = 0;
        if (hourMatch) diffMs = parseInt(hourMatch[1], 10) * 60 * 60 * 1000;
        else if (minuteMatch) diffMs = parseInt(minuteMatch[1], 10) * 60 * 1000;
        else if (secondMatch) diffMs = parseInt(secondMatch[1], 10) * 1000;
        else return false; // Could not parse

        // Event time in UTC
        const eventDate = new Date(serverNow.getTime() - diffMs);

        // Compute start of today/yesterday in server's UTC
        const startOfToday = new Date(Date.UTC(
            serverNow.getUTCFullYear(),
            serverNow.getUTCMonth(),
            serverNow.getUTCDate()
        ));
        const startOfYesterday = new Date(startOfToday.getTime() - 24*60*60*1000);

        const classification = eventDate >= startOfYesterday && eventDate < startOfToday ? "Yesterday"
                            : eventDate >= startOfToday ? "Today" : "Older than Yesterday";

        console.log(`🔹 "${timeText}" => eventDate: ${eventDate.toISOString()}, classified as: ${classification}`);
        return classification === "Yesterday";
    }


    /** Clears old faction notification logs */
    function clearFactionLogsCache() {
        set('factionNotifications', "[]");   
    }

    /** Displays yesterday's raid report (from already-filtered localStorage data) */
    async function showRaidReport(pending = false) {

        /* Remove any existing elements first */
        document.querySelectorAll('.zedHelperFactionRaidReport1').forEach(el => el.remove());

        const summary = document.createElement('div');
        Object.assign(summary.style, {
            position: 'fixed',
            bottom: '50px',
            right: '10px',
            background: 'rgba(20, 20, 20, 0.95)',
            color: '#fff',
            padding: '15px',
            borderRadius: '12px',
            boxShadow: '0 0 15px rgba(0,0,0,0.5)',
            fontSize: '14px',
            zIndex: 9999,
            maxHeight: '70vh',
            overflowY: 'auto',
            backdropFilter: 'blur(4px)',
            fontFamily: 'monospace',
            transition: 'opacity 0.3s ease'
        });
        summary.classList = 'zedHelperFactionRaidReport1';

        const closeBtn = document.createElement('div');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '5px',
            right: '10px',
            cursor: 'pointer',
            fontSize: '20px',
            color: '#bbb'
        });
        closeBtn.addEventListener('click', () => summary.remove());
        summary.appendChild(closeBtn);

        document.body.appendChild(summary);
        summary.innerHTML = '⏳ Loading yesterday\'s raids...';
        summary.appendChild(closeBtn);

        if (pending) {
            return;
        }

        const raidRegexes = {
            store: /raid.*store/i,
            farm: /raid.*farm/i,
            hospital: /raid.*hospital/i
        };

        // Load data
        const notifications = JSON.parse(get('factionNotifications') || '[]');
        if (!notifications.length) {
            return;
        }

        // Load members if available
        const factionMembers = JSON.parse(get('factionMembers')) || [];
        const allNames = factionMembers.map(m => m.username);
        const raidCounts = {};

        // Initialize from members (so everyone appears)
        allNames.forEach(name => {
            raidCounts[name] = { store: 0, farm: 0, hospital: 0 };
        });

        // Tally raids
        for (const n of notifications) {
            const user = n.data.username || 'Unknown';
            if (!raidCounts[user]) raidCounts[user] = { store: 0, farm: 0, hospital: 0 };

            for (const [type, regex] of Object.entries(raidRegexes)) {
                if (regex.test(n.data.name)) {
                    raidCounts[user][type]++;
                }
            }
        }

        // Build table
        const rows = Object.entries(raidCounts)
            .map(([name, data]) => `
                <tr>
                    <td style="padding:4px;">${name}</td>
                    <td style="text-align:right;padding:4px;">${data.store}</td>
                    <td style="text-align:right;padding:4px;">${data.farm}</td>
                    <td style="text-align:right;padding:4px;">${data.hospital}</td>
                    <td style="text-align:right;padding:4px;">
                        ${data.store > 0 ? '✅' : (data.farm > 0 || data.hospital > 0 ? '⚠️' : '❌')}
                    </td>
                </tr>
            `).join('');

        summary.innerHTML = `
            <div style="font-weight:bold;margin-bottom:4px;">Yesterday's Raids</div>
            <table style="border-collapse:collapse;width:100%;margin-bottom:8px;">
                <thead>
                    <tr style="border-bottom:1px solid #444;">
                        <th style="text-align:left;padding:4px;">Name</th>
                        <th style="text-align:right;padding:4px;">S</th>
                        <th style="text-align:right;padding:4px;">F</th>
                        <th style="text-align:right;padding:4px;">H</th>
                        <th style="text-align:right;padding:4px;">☐</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
        summary.appendChild(closeBtn);

        // Click-to-copy summary
        summary.addEventListener('click', e => {
            if (e.target === closeBtn) return;
            const text =
                "Yesterday's Raids:\n" +
                Object.entries(raidCounts)
                    .map(([name, d]) =>
                        `${d.store > 0 ? '✅' : (d.farm > 0 || d.hospital > 0 ? '⚠️' : '❌')} ${name}: ` +
                        `Store ${d.store}, Farm ${d.farm}, Hospital ${d.hospital}`)
                    .join('\n');

            navigator.clipboard.writeText(text)
                .then(() => {
                    console.log('✅ Raid report copied to clipboard');
                    summary.style.opacity = '0.6';
                    setTimeout(() => summary.style.opacity = '1', 300);
                })
                .catch(e => console.warn('Unable to copy:', e));
        });
    }

    /** Generates raid report from faction logs (Yesterday only) */
    // async function generateRaidReportFromFactionLogs() {

    //     const summary = document.createElement('div');
    //     Object.assign(summary.style, {
    //         position: 'fixed',
    //         bottom: '50px',
    //         right: '10px',
    //         background: 'rgba(20, 20, 20, 0.95)',
    //         color: '#fff',
    //         padding: '15px',
    //         borderRadius: '12px',
    //         boxShadow: '0 0 15px rgba(0,0,0,0.5)',
    //         fontSize: '14px',
    //         zIndex: 9999,
    //         maxHeight: '70vh',
    //         overflowY: 'auto',
    //         backdropFilter: 'blur(4px)',
    //         fontFamily: 'monospace',
    //         transition: 'opacity 0.3s ease'
    //     });

    //     const closeBtn = document.createElement('div');
    //     closeBtn.textContent = '×';
    //     Object.assign(closeBtn.style, {
    //         position: 'absolute',
    //         top: '5px',
    //         right: '10px',
    //         cursor: 'pointer',
    //         fontSize: '20px',
    //         color: '#bbb'
    //     });
    //     closeBtn.addEventListener('click', () => summary.remove());
    //     document.body.appendChild(summary);
    //     summary.innerHTML = '⏳ Loading data...';
    //     summary.appendChild(closeBtn);

    //     const raidRegexes = {
    //         store: /raid.*store/i,
    //         farm: /raid.*farm/i,
    //         hospital: /raid.*hospital/i
    //     };

    //     let lastProcessedIds = new Set();
    //     let newDataChecks = 0;

    //     const factionMembers = JSON.parse(get('factionMembers')) || [];
    //     if (!factionMembers.length) {
    //         summary.innerHTML = `❌ No faction members stored in memory.<br><br>Please go to <a href="https://www.zed.city/faction/2232340">member list</a> before loading logs.`;
    //         summary.appendChild(closeBtn);
    //         return;
    //     }

    //     const yesterdayRaiders = Object.fromEntries(
    //         factionMembers.map(m => [m.username, { store: 0, farm: 0, hospital: 0 }])
    //     );
    //     console.log(yesterdayRaiders);

    //     const interval = setInterval(async () => {
    //         newDataChecks++;

    //         const notifications = JSON.parse(get('factionNotifications') || '[]').filter(n => n.type === "faction_raid");
    //         if (!notifications.length) {
    //             summary.innerHTML = '❌ No faction notifications stored locally.';
    //             summary.appendChild(closeBtn);
    //             return;
    //         }

    //         // const serverTime = await getServerTime();
    //         // const yesterday = new Date(serverTime);
    //         // yesterday.setDate(yesterday.getDate() - 1);
    //         // yesterday.setHours(0, 0, 0, 0);

    //         const serverTime = await getServerTime();
    //         const yesterdayStart = new Date(serverTime);
    //         yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    //         yesterdayStart.setHours(0, 0, 0, 0);
    //         const yesterdayEnd = new Date(yesterdayStart);
    //         yesterdayEnd.setHours(23, 59, 59, 999);

    //         let newDataFound = false;

    //         console.log(`🕒 Server time: ${serverTime.toISOString()}, Yesterday start: ${yesterdayStart.toISOString()}, Yesterday end: ${yesterdayEnd.toISOString()}`)
    //         console.log(`🔍 Scanning ${notifications.length} faction notifications for yesterday's raids...`);
    //         console.log(notifications);

    //         for (const entry of notifications) {

    //             // if (entry.data.username === "Will") {
    //             //     console.log(JSON.stringify(entry));
    //             // }

    //             const uniqueId = `${entry.data.id}_${entry.date}`;

    //             if (lastProcessedIds.has(uniqueId)) {
    //                 log(`Skipping already processed entry: ${uniqueId}`);
    //                 continue;
    //             }

    //             const entryDate = new Date(entry.date > 1e12 ? entry.date : entry.date * 1000);
    //             console.log(yesterdayStart);                
    //             console.log(yesterdayEnd);                
    //             console.log(entryDate);                
    //             // Only count raids done "yesterday" server time
    //             if (entryDate < yesterdayStart || entryDate > yesterdayEnd) {
    //                 log(`Skipping entry ID: ${entry.data.id} - Outside of yesterday range.`);
    //                 continue;
    //             }

    //             lastProcessedIds.add(uniqueId);
    //             newDataFound = true;

    //             const userName =
    //                 entry.data.username ||
    //                 entry.data.user_name ||
    //                 entry.data.user?.username ||
    //                 entry.data.attacker_name ||
    //                 'Unknown';

    //             if (!yesterdayRaiders[userName]) {
    //                 yesterdayRaiders[userName] = { store: 0, farm: 0, hospital: 0 };
    //             }

    //             for (const [type, regex] of Object.entries(raidRegexes)) {
    //                 if (regex.test(entry.data.name)) {
    //                     yesterdayRaiders[userName][type]++;
    //                 }
    //             }
    //         }

    //         if (newDataFound) {
    //             log(`✅ Updated raid report with new data:`, yesterdayRaiders);
    //             const names = Object.keys(yesterdayRaiders);
    //             const rows = names.map(name => `
    //                 <tr>
    //                     <td style="padding:4px;">${name}</td>
    //                     <td style="text-align:right;padding:4px;">${yesterdayRaiders[name].store}</td>
    //                     <td style="text-align:right;padding:4px;">${yesterdayRaiders[name].farm}</td>
    //                     <td style="text-align:right;padding:4px;">${yesterdayRaiders[name].hospital}</td>
    //                     <td style="text-align:right;padding:4px;">${yesterdayRaiders[name].store > 0 ? '✅' : (yesterdayRaiders[name].farm > 0 || yesterdayRaiders[name].hospital > 0 ? '⚠️' : '❌')}</td>
    //                 </tr>
    //             `).join('');

    //             summary.innerHTML = `
    //                 <div style="font-weight:bold;margin-bottom:4px;">Yesterday's Raids</div>
    //                 <table style="border-collapse:collapse;width:100%;margin-bottom:8px;">
    //                     <thead>
    //                         <tr style="border-bottom:1px solid #444;">
    //                             <th style="text-align:left;padding:4px;">Name</th>
    //                             <th style="text-align:right;padding:4px;">S</th>
    //                             <th style="text-align:right;padding:4px;">F</th>
    //                             <th style="text-align:right;padding:4px;">H</th>
    //                             <th style="text-align:right;padding:4px;">☐</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>${rows}</tbody>
    //                 </table>
    //             `;
    //             summary.appendChild(closeBtn);
    //         } else {
    //             log(`ℹ️ No new raid data found since last check.`);
    //         }

    //         // Stop after no new rows appear for 2 seconds
    //         if (!newDataFound && newDataChecks > 10) {
    //             log(`Stopping listener after scanning 30 times.`);
    //             clearInterval(interval);
    //         }

    //     }, 3000);


    //     // Copy on click
    //     summary.addEventListener('click', e => {
    //         if (e.target === closeBtn) return;
    //         const yestNames = Object.keys(yesterdayRaiders);
    //         const text =
    //             "Yesterday's Raids:\n" +
    //             (yestNames.length
    //                 ? yestNames.map(n => `${yesterdayRaiders[n].store > 0 ? '✅' : (yesterdayRaiders[n].farm > 0 || yesterdayRaiders[n].hospital > 0 ? '⚠️' : '❌')} ${n}: Store ${yesterdayRaiders[n].store}, Farm ${yesterdayRaiders[n].farm}, Hospital ${yesterdayRaiders[n].hospital}`).join('\n')
    //                 : 'None');

    //         navigator.clipboard.writeText(text)
    //             .then(() => {
    //                 console.log('✅ Raid report copied to clipboard');
    //                 summary.style.opacity = '0.6';
    //                 setTimeout(() => summary.style.opacity = '1', 300);
    //             })
    //             .catch(e => console.warn('Unable to copy:', e));
    //     });

    // }




    async function storeFactionLogs(url, data) {
   
        try {
            const match = url.match(/page=(\d+)/);
            const page = match ? parseInt(match[1]) : 1;

            let existing = JSON.parse(get('factionNotifications') || "[]");

            // Cleanup: remove notifications older than 2 days
            const serverTime = cachedServerTime ? new Date(cachedServerTime) : await getServerTime();

            // Define yesterday range
            const yesterdayStart = new Date(serverTime);
            yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
            yesterdayStart.setUTCHours(0, 0, 0, 0);
            const yesterdayEnd = new Date(yesterdayStart);
            yesterdayEnd.setUTCHours(23, 59, 59, 999);

            // Parse new data
            const newData = JSON.parse(data)?.notify || [];
            let newEntries = 0,
                duplicateCount = 0,
                filteredNonRaid = 0,
                filteredOutsideTime = 0,
                totalEntries = 0;

            // Build ID cache
            const existingIds = new Set(existing.map(n =>
                `${n.date}_${n.data.id}_${n.data.username}`
            ));

            // Merge new entries
            for (const n of newData) {
                totalEntries++;
                const id = `${n.date}_${n.data.id}_${n.data.username}`;
                const type = n.type;
                const entryDate = new Date(n.date > 1e12 ? n.date : n.date * 1000);
                // const formatted = entryDate.getFullYear() + '-' +
                //     String(entryDate.getMonth() + 1).padStart(2, '0') + '-' +
                //     String(entryDate.getDate()).padStart(2, '0') + ' ' +
                //     String(entryDate.getHours()).padStart(2, '0') + ':' +
                //     String(entryDate.getMinutes()).padStart(2, '0') + ':' +
                //     String(entryDate.getSeconds()).padStart(2, '0');
                const formatted = formatServerTimestamp(n.date);

                if (type !== 'faction_raid') {
                    showDebug(`❌ ${formatted} - Non raid: ${n.data.username} | ${n.data.name} | ${JSON.stringify(n.data.items)}`);
                    filteredNonRaid++;
                    continue;
                }
                // Time check — only store if within yesterday range
                if (entryDate < yesterdayStart || entryDate > yesterdayEnd) {
                    filteredOutsideTime++;
                    showDebug(`❌ ${formatted} - Out of range: ${n.data.username} | ${n.data.name} | ${JSON.stringify(n.data.items)}`);
                    continue;
                }
                if (existingIds.has(id)) {
                    duplicateCount++;
                    showDebug(`❌ ${formatted} - Duplicate: ${n.data.username} | ${n.data.name} | ${JSON.stringify(n.data.items)}`);
                    continue;
                }
                existing.push(n);
                existingIds.add(id);
                newEntries++;
                showDebug(`✅ ${formatted} - Saved: ${n.data.username} | ${n.data.name} | ${JSON.stringify(n.data.items)}`);
            }

            /* Delay save to avoid flooding */
            setTimeout(() => {
                set('factionNotifications', JSON.stringify(existing));
                const msg = [
                    `📄 Page ${page}`,
                    `${totalEntries} logs`,
                    `+${newEntries} saved`,
                    `${duplicateCount} duplicates`,
                    `${filteredNonRaid} non-raid`,
                    `${filteredOutsideTime} out-of-range`,
                    `(${existing.length} total)`
                ].join(' | ');
                showDebug(msg);
                showDebug("");
                log(msg);
            }, page * 200);

        } catch (err) {
            showDebug(`⚠️ Error parsing notifications: ${err.message}`);
            console.error(err);
        }
                

    }





    
})();

































/* EXAMPLE RESPONSE /getOffers:
    [
        {
            "name":"Advanced Tools",
            "codename":"advanced_tools",
            "type":"resources_craft_basic",
            "quantity":2,
            "value":10,
            "vars":{
                "buy":10,"sell":5,"desc":"","weight":"1","ash_value":"20"
            },
            "market_id":15490,
            "market_price":19500,
            "quantity_sold":3,
            "user":{
                "id":11703,"username":"bump","avatar":"","online":1739285402
            }
        },
    ]
*/

/* EXAMPLE RESPONSE /getMarket
{
    "items": 
    [
        {
            "name":"Advanced Tools",
            "codename":"advanced_tools",
            "type":"resources_craft_basic",
            "quantity":35,
            "value":10,
            "vars": {
                "buy":10,
                "sell":5,
                "desc":"",
                "weight":"1",
                "ash_value":"20"
            },
            "market_id":14020,
            "market_price":19500,
            "quantity_sold":0
        },      
    ]
}   

*/