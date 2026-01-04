// ==UserScript==
// @name         Auto Clicker for Cookie Clicker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto click, auto buy, auto click shimmers, fully customizable with console functions!
// @author       Wesley Vermeulen (https://weave-development.com)
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/421709/Auto%20Clicker%20for%20Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/421709/Auto%20Clicker%20for%20Cookie%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        setTimeout(function() {
            // Turn on extension
            unsafeWindow.autoClickerEnabled = true;

            // Set autoClicker to true
            unsafeWindow.autoClicker = true;

            // Set auto click shimmers to true
            unsafeWindow.autoClickShimmers = true;

            // Set global auto-buy to true
            unsafeWindow.autoBuy = true;

            // Set specific auto-buy to true
            unsafeWindow.autoBuyUpgrades = true;
            unsafeWindow.autoBuyProducts = true;

            // Set stop on buff to true
            unsafeWindow.stopOnBuff = true;
            let buffActive = false;

            // Set console notifications to true
            unsafeWindow.notifications = true;

            // Trigger help once
            setTimeout(function() {
                help();
            }, 1000);

            // Trigger help function from console
            unsafeWindow.help = help;

            // Show help menu in console
            function help() {
                console.log("[=== Auto Clicker for Cookie Clicker ===]\n\nYou can use several commands which are listed below:\n\nautoClickerEnabled = true/false [turn on/off the auto clicker extension!]\nautoClicker = true/false [turn on/off the auto clicker]\nautoClickShimmers = true/false [turn on/off the auto clicker for shimmers]\nautoBuy = true/false [turn on/off auto buy of upgrades & products]\nautoBuyUpgrades = true/false [turn on/off auto buy of upgrades]\nautoBuyProducts = true/false [turn on/off auto buy of products]\nstopOnBuff = true/false [temporarily turn off auto-buy when buff is active]\nnotifications = true/false [turn on/off console notifications]\n\nYou can view your current settings with the settings() command and you can always call for help again with the help() command!");
            }

            // Trigger settings function from console
            unsafeWindow.settings = settings;

            // Show settings in console
            function settings() {
                console.log("[=== Auto Clicker Settings ===]\n\nYou are currently using the following settings:\n\nautoClickerEnabled = " + unsafeWindow.autoClickerEnabled + "\nautoClicker = " + unsafeWindow.autoClicker + "\nautoClickShimmers = " + unsafeWindow.autoClickShimmers + "\nautoBuy = " + unsafeWindow.autoBuy + "\nautoBuyUpgrades = " + unsafeWindow.autoBuyUpgrades + "\nautoBuyProducts = " + unsafeWindow.autoBuyProducts + "\nstopOnBuff = " + unsafeWindow.stopOnBuff + "\nnotifications = " + unsafeWindow.notifications + "\n\nYou can view your current settings with the settings() command and you can always call for help again with the help() command!");
            }

            // Click on the cookie
            let clicker = setInterval(function() {
                if (unsafeWindow.autoClicker && unsafeWindow.autoClickerEnabled) {
                    Game.ClickCookie();
                }
            }, 10);


            let loop = setInterval(function() {
                if (unsafeWindow.autoClickerEnabled) {
                    // Click shimmer
                    if (unsafeWindow.autoClickShimmers) {
                        let shimmer = $(".shimmer");
                        if (shimmer.length > 0) {
                            shimmer.click();

                            if (unsafeWindow.notifications) {
                                console.log("Shimmer clicked!");
                            }

                            if (unsafeWindow.stopOnBuff) {
                                let buffCrate = $("#buffs").find(".crate");
                                if (buffCrate.length > 0) {
                                    buffActive = true;

                                    if (unsafeWindow.notifications) {
                                        console.log("Auto-buy temporarily disabled during buff!");
                                    }
                                }
                            }
                        }
                    }

                    // Check if buff is finished and resume auto-buy
                    if (buffActive) {
                        let buffCrate = $("#buffs").find(".crate");
                        if (buffCrate.length == 0) {
                            buffActive = false;

                            if (unsafeWindow.notifications) {
                                console.log("Auto-buy enabled again!");
                            }
                        }
                    }

                    if (unsafeWindow.autoBuy && !buffActive) {
                        // Buy upgrades
                        if (unsafeWindow.autoBuyUpgrades) {
                            let upgrades = $("#upgrades").find(".crate");
                            upgrades.each(function(index) {
                                if ($(upgrades[index]).hasClass("enabled")) {
                                    $(upgrades[index]).click();

                                    if (unsafeWindow.notifications) {
                                        console.log("Upgrade bought!");
                                    }

                                    return false;
                                }
                            });
                        }

                        // Buy products
                        if (unsafeWindow.autoBuyProducts) {
                            let products = $("#products").find(".product");
                            let price = 0;
                            let cheapest = "";

                            products.each(function(index) {
                                if ($(products[index]).hasClass("enabled")) {
                                    let productPrice = $(products[index]).find(".price").html();

                                    if (price == 0 || productPrice <= price) {
                                        price = productPrice;
                                        cheapest = $(products[index]);
                                    }
                                }
                            });

                            // Buy cheapest product
                            // After a buff or when your window was inactive is buys the best product when using short numbers. 14 trillion is in that case less than 400 billion (14 < 400).
                            if (cheapest != "") {
                                cheapest.click();
                                if (unsafeWindow.notifications) {
                                    let productTitle = cheapest.find(".title");
                                    if (productTitle.find("span").length > 0) {
                                        console.log(productTitle.find("span").html() + " nr." + cheapest.find(".title.owned").html() + " bought!");
                                    } else {
                                        console.log(productTitle.html() + " nr." + cheapest.find(".title.owned").html() + " bought!");
                                    }
                                }
                            }

                            price = 0;
                            cheapest = "";
                        }
                    }
                }

                // Auto click fullest wrinkler when max is reached
                let wrinklers = Game.wrinklers;
                let count = 0;
                let fullestWrinkler;
                let amount = 0;

                // Get fullest wrinkler
                $(wrinklers).each(function(index) {
                    if ($(wrinklers[index])[0].close == 1) {
                        let sucked = $(wrinklers[index])[0].sucked;

                        if (sucked > amount) {
                            amount = sucked;
                            fullestWrinkler = $(wrinklers[index])[0];
                        }

                        count++;
                    }
                });

                // Click fullest wrinkler until it popped
                if (count == Game.getWrinklersMax()) {
                    for (var i = 0; i < 10; i++) {
                        if (fullestWrinkler.close==1) {
                            fullestWrinkler.hp--;
                        }
                    }
                }
            }, 200);
        }, 1000);
    })
})();