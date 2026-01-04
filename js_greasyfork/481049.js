// ==UserScript==
// @name         DeadFrontier Ironman 2023
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Disabled and redirects you away from potential disqualifiers for the 2023 ironman event
// @author       Runonstof
// @match        *fairview.deadfrontier.com/onlinezombiemmo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/481049/DeadFrontier%20Ironman%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/481049/DeadFrontier%20Ironman%202023.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var data = unsafeWindow.document.querySelector('#sidebar');
    //console.log(data.childNodes[0].tagName)

    // # ========================================
    // # CONFIG
    // # ========================================

    // RIGHT NOW THE DEFAULT VALUES ARE SET FOR THE 2023 HARDCORE IRON MAN EVENT
    // BUT YOU CAN CHANGE THIS TO YOUR HEARTS CONTENT

    var reviveButtonEnabled = false; // If false, it hides the revive button on death screen, as your account is not ironman anymore if you revive

    var hiddenPages = [ //index.php?page=<pagenum>
        // Important to hide
        // Marketplace is handled with some special rules, this is to be able to accept items from helpbot
        // 35, //Uncomment to disable marketplace as a whole, else it will only show Help Bot
        61, //fast travel
        27, //private trade

        // Not important to hide, remove if you still want to see those pages
        21, //Arena
        22, //Records
        56, //Clan HQ
        0, //Arcade

        // Add more pages if you wish...
    ];

    // # =========== END CONFIG, ITS RECOMMENDED TO NOT EDIT ANYTHING BELOW THIS LINE

    // @credits to SilverScripts for the location check code
    var locations = {
        "inventories": [
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25",
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35",
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24",
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50",
            "fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31",
        ],
        "marketplace" : ["https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"],
        "yard" : ["fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24"],
        "storage" : ["fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50"],
        "ICInventory" : ["fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31"],
        "forum" : ["fairview.deadfrontier.com/onlinezombiemmo/index.php?board=","fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum","fairview.deadfrontier.com/onlinezombiemmo/index.php?topic="]
    };

    function isAtLocation(location){ // <-- by SilverScripts
        //Make an exception check for the homepage as its address is contained in each one
        if(location == "home"){
            if(window.location.href.split("fairview.deadfrontier.com/onlinezombiemmo/index.php")[1] == ""){
                return true;
            }else{
                return false;
            }
        }
        //Check if location name exists first
        if(locations[location] != undefined){
            for(var i=0;i<locations[location].length;i++){
                if(window.location.href.indexOf(locations[location][i]) != -1){
                   return true;
                }
            }
        }
        return false;
    }

    /////////////////////////////
    /// FUNCTIONS
    /////////////////////////////

    var helpBotUserId = 3; // Used to only show the 'View trade' button for HelpBot to claim rewards, all other incoming item-for-item will NOT show view trade button

    if (unsafeWindow.localStorage && unsafeWindow.localStorage.ironManAlert) {
        var text = unsafeWindow.localStorage.ironManAlert;
        delete unsafeWindow.localStorage.ironManAlert;
        setTimeout(function(){

            alert(text);
        }, 1000);

    }

    function GM_addStyle(css) {
        var style = document.getElementById("GM_addStyle_ironman") || (function() {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle_ironman";
            document.head.appendChild(style);
            return style;
        })();
        var sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    function GM_addStyle_object(selector, styles) {
        var css = selector + "{";
        for (var key in styles) {
            css += key + ":" + styles[key] + ";";
        }
        css += "}";
        GM_addStyle(css);
    }

    // Insert ironman mode label
    var heldCreditsLabel = unsafeWindow.document.querySelector('.heldCredits');
    console.log(heldCreditsLabel)
    if (heldCreditsLabel) {
        // '<span class="" style="color: #0066ff; position: relative;">Ironman Mode</span>'
        var ironManLabel = document.createElement("span");
        // ironManLabel.classList.add('custom')
        ironManLabel.style.color = "#0066ff";
        ironManLabel.style.position = "relative";
        ironManLabel.innerText = "Ironman Mode";
        
        heldCreditsLabel.after(ironManLabel);
        ironManLabel.before(document.createElement("br"));
        ironManLabel.after(document.createElement("br"));

    }

    /////////////////////////////
    /// STYLES
    /////////////////////////////

    var selector = hiddenPages.map(function(pageId) {
        return '[data-page="' + pageId+ '"]' + (pageId == 21 ? '[data-mod="2"]' : '');
    }).join(', ');

    GM_addStyle_object(selector, { // Hide all hiddenPages buttons in outpost mode
        'display': 'none !important',
    });

    GM_addStyle_object('[data-action="switchMarket"][data-page="buy"], [data-action="switchMarket"][data-page="sell"], [data-action="switchMarket"][data-page="private"]', { // Hide Marketplace buttons, except for i-for-i
        'display': 'none !important',
    });
    GM_addStyle_object('[data-page="35"]', { // Rename marketplace button, it will only open HelpBot trade
        'visibility': 'hidden'
    });
    GM_addStyle_object('[data-page="35"]::after', { // Rename marketplace button, it will only open HelpBot trade
        'visibility': 'visible',
        'display': 'block',
        'content': '"Collect Rewards"'
    });

    GM_addStyle_object('#searchArea, #tradesLabels', { // Hide main marketplace screen
        'display': 'none !important',
    })
    GM_addStyle_object('#itemDisplay .tradeSlot button:not([data-target="' + helpBotUserId + '"]):not([data-action="declineTrade"])', { // Hide all view trades button except for Help Bot's
        'display': 'none !important',
    })
    GM_addStyle_object('.tradeSlot:has(button:not([data-target="' + helpBotUserId + '"]))', {
        'text-decoration': 'line-through !important',
    });

    GM_addStyle_object('#inventoryholder #pageLogo', { // Hide marketplace logo
        'background-image': 'unset !important',
    });
    // GM_addStyle_object('#inventoryholder #marketplace button:last-child:not([data-action="acceptTrade"])', { // Hide marketplace "Back to trades" button
    //     'display': 'none !important',
    // });
    GM_addStyle_object('#getRich', { // Hide buy credits button
        'display': 'none !important',
    });
    GM_addStyle_object('[data-action="mdye"], [data-action="mdye"]+div, [data-action="mdye"]+div+div', { // Hide master dye
        'display': 'none !important',
    });
    GM_addStyle_object('[data-action="godcraft"], [data-action="godcraft"]+div, [data-action="godcraft"]+div+div', { // Hide godcraft
        'display': 'none !important',
    });
    GM_addStyle_object('[data-action="rename"], [data-action="rename"]+div, [data-action="rename"]+div+div', { // Hide rename
        'display': 'none !important',
    });
    GM_addStyle_object('textarea.messages', {
        'display': 'none !important',
    });
    GM_addStyle_object('button[data-page="ironman_forum"]', {
        'font-size': '30px !important',
    });

    // Hide revive button
    GM_addStyle_object('#death button, #death div:not(#pageLogo):not(.custom)', {
        'display': 'none !important',
    });

    /////////////////////////////
    /// FUNCTION OVERRIDES
    /////////////////////////////
    var origInfoCard = unsafeWindow.infoCard || null;
    console.log({origInfoCard})
    if (origInfoCard) {
        inventoryHolder.removeEventListener("mousemove", origInfoCard, false);

        unsafeWindow.infoCard = function (e) {
            // infoBox.style.color = '';
            
            //Remove previous ironman warning
            var warnings = document.getElementsByClassName("ironmanWarning");
            for(var i = warnings.length - 1; i >= 0; i--) {
                warnings[i].parentNode.removeChild(warnings[i]);
            }

            origInfoCard(e);
            if(active || pageLock || !allowedInfoCard(e.target)) {
                return;
            }

            if (!e.target.dataset.type) {
                return;
            }

            var itemId = e.target.dataset.type.split('_')[0];
            var itemData = globalData[itemId] || null;

            if (!itemData || !['armour', 'weapon'].includes(itemData.itemcat)) {
                return;
            }


            var checkRequirement = parseInt(itemData.itemcat == 'armour' ? itemData.shop_level : itemData.pro_req);
            var checkLevel = itemData.itemcat == 'armour' ? 75 : 120;

            if (checkRequirement < checkLevel) {
                return;
            }

            
            var warning = document.createElement("div");
            warning.className = "itemData ironmanWarning";
            warning.style.color = "#ff0000";
            warning.style.textDecoration = "underline";
            warning.innerHTML = "This item is not allowed in ironman mode!";
            infoBox.appendChild(warning);
            infoBox.firstElementChild.after(warning.cloneNode(true));


            // At this point, we know the item is either a weapon or armour, and the requirement is high enough
            // Which means not allowed in ironman mode
            infoBox.style.borderColor = '#ff0000';
            // infoBox.style.color = '#ff0000';
        }.bind(unsafeWindow);

        inventoryHolder.addEventListener("mousemove", unsafeWindow.infoCard, false);
    }

    var origCompleteOutpostInit = unsafeWindow.completeOutpostInit;
    // console.log(outpostData);
    if (origCompleteOutpostInit) {
        var origChancePage = unsafeWindow.nChangePage;
        unsafeWindow.nChangePage = function(e) {
            var elem = e.target;
            var page = elem.dataset.page;
            if (page == 'ironman_forum') {
                window.location.href='https://fairview.deadfrontier.com/onlinezombiemmo/index.php?topic=955779.0';
                return;
            }
            return origChancePage(e);
        }

        unsafeWindow.completeOutpostInit = function() {
            outpostData.links.ironman = {
                content: 'Ironman Event 2023',
                location: {
                    top: 5,
                    left: 200,
                },
                page: 'ironman_forum',
            }
            // console.log(outpostData);
            return origCompleteOutpostInit();
        }
        // console.log('outpostContainer', outpostContainer)
        // var btnContainer = unsafeWindow.document.createElement("div");
        // btnContainer.style.top = '50px';
        // btnContainer.style.left = '300px';
        // div.classList.add('opElem');
        // var btn = unsafeWindow.document.createElement("button");
        // btn.innerText = "Ironman Event 2023";
        // btnContainer.appendChild(btn);
        // outpostContainer.appendChild(btnContainer);
    }

    // Check if death screen is open
    var deathElem = null;
    if (!reviveButtonEnabled && (deathElem = unsafeWindow.document.getElementById('death'))) {
        
        $(unsafeWindow.document).ajaxComplete(function(event, jqXHR, ajaxOptions) {
            if (ajaxOptions.url.indexOf('get_values.php') == -1) return;
            var response = jqXHR.responseText;
            var diedLevel = parseInt(response.match(/df_level=(\d+)/)[1]);
            var deathText = document.createElement("div");
            deathText.classList.add('custom')
            deathText.style.color = "#cccccc";
            deathText.style.fontSize = "10pt";
            deathText.style.fontWeight = "900";
            deathText.classList.add("opElem");
            deathText.style.top = "345px";
            deathText.style.left = "0px";
            deathText.style.right = "0px";
            deathText.style.textAlign = "center";
            deathText.style.fontFamily = "Courier New";
            var deathLines = [
                "Looks like you kinda ruined it, what a shame. Let's take a look at how you did:",
                "",
                "Level: " + diedLevel,
            ];
            
            if (diedLevel < 50) {
                deathLines.push("Well, that was a short run.");
            } else if (diedLevel < 100) {
                deathLines.push("Rough, but not too bad. You reached a decent level, but it probably hurts to lose all that progress")
            } else if (diedLevel < 150) {
                deathLines.push("Pretty good! Most normal accounts never reach this level. You should be proud of yourself.")
            } else if (diedLevel < 200) {
                deathLines.push("Wow, you really put in the hours! The vast majority of players have never reached this point on normal accounts! It sucks to lose it all but you clearly enjoyed it.")
            } else if (diedLevel < 220) {
                deathLines.push("An amazing accomplishment, but... Ouch. So close to the Dusk Shop milestone. But think about it; you went this long without making a mistake, something was bound to happen. Take a good long break and try again when you're in the right mindset!")
            } else if (diedLevel < 324) {
                deathLines.push("Honestly, losing all that progress really sucks. But you made it to level 220; the sole goal of the vast majority of players! In real terms, you basically won; past this point is honestly just New Game+. Try again some time when you're emotionally ready.")
            } else if (diedLevel == 324) {
                deathLines.push("What a shame. I wish there was something more I could say... What a rotten way to die. This is terrible... I'm so sorry.");
            } else if (diedLevel >= 325) {
                // max level
                deathLines.push("You only died to flex, didn't you? You defeated the Dragon and saved the Kingdom, GGs. What do you want? A Blue Peter Badge?</br></br>Same...");
            }
    
            deathText.innerHTML = deathLines.map(function(line) {
                return line ? "<span style='letter-spacing: 0px;'>" + line + "</span><br />" : '<br />';
            }).join('');
            // deathText.innerHTML = "<span style='letter-spacing: 0px;'>An overwhelming sense of agony grips your body as you fall to the</span><br />";
            // deathText.innerHTML += "<span style='letter-spacing: 0px;'>floor. Your vision blurs and the world around you slowly turns to</span><br />";
            // deathText.innerHTML += "<span style='letter-spacing: 0px;'>darkness. You are dead and must wait until the timer reaches zero</span><br />";
            // deathText.innerHTML += "<span style='letter-spacing: 0px;'>before you can return to life. Your corpse will most likely be</span><br />";
            // deathText.innerHTML += "<span style='letter-spacing: 0px;'>looted of all cash...</span>";
            
            deathElem.appendChild(deathText);
        })
        
    }

    // Check if should redirect away based on url
    var rawParams = unsafeWindow.location.search.replace(/^\?/, '').split('&');
    var params = {};
    for(var i = 0; i < rawParams.length; i++) {

        var keyValue = rawParams[i].split('=');
        params[keyValue[0]] = keyValue[1]
    }

    if (typeof params.page !== 'undefined') {
        if (hiddenPages.indexOf(parseInt(params.page)) > -1 && params.page != 21) {

            if (unsafeWindow.localStorage) {
                unsafeWindow.localStorage.ironManAlert = 'You cannot visit this page in ironman mode!';
            }
            unsafeWindow.location = '/onlinezombiemmo';
        }

        // Immediatly open marketplace item-for-item
        if (params.page == 35) {
            setTimeout(function(){ // Timeout to let SilverScripts not crash, if someone has that installed too.
                marketAction({ // Create a fake event object
                    target: {
                        dataset: {
                            action: 'switchMarket',
                            page: 'itemforitem'
                        }
                    }
                })
                // unsafeWindow.promptLoading("Opening Ironman Reward Collect...");
				// unsafeWindow.userVars.member_to_name = 'Help Bot';
				// unsafeWindow.loadPrivateItemForItem(helpBotUserId, '3');
            }, 500)

        }
    }

    // This is funny
    var origDisplayPlacementMessage = unsafeWindow.displayPlacementMessage || null;
    if (origDisplayPlacementMessage) {
        unsafeWindow.displayPlacementMessage = function(msg, x, y, type) {
            if(msg.match(/to dye this$/)) {
                var price = msg.match(/\$?[\d,]+(?:\s+credits)?/);
                if (price) {
                    price = price[0] || ''
                }
                msg = 'As an ironman this is a literal waste of ur money. Either way its ' + price + ' to dye this, but don\'t expect to win.';
            }
            origDisplayPlacementMessage(msg, x, y, type)
        }
    }


})();