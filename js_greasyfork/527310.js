// ==UserScript==
// @name         help fight (Old Firefox Support)
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Adding button to save your time
// @match        https://www.edominacy.com/*/battlefield/*/*
// @grant        none
// @license free 
// @downloadURL https://update.greasyfork.org/scripts/527310/help%20fight%20%28Old%20Firefox%20Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527310/help%20fight%20%28Old%20Firefox%20Support%29.meta.js
// ==/UserScript==

(function () {
    var PREFIX = {
        NAVY: "a#battleWeapons_25_",
        TANK: "a#battleWeapons_26_",
        SPECIAL_WEAPON: "a#battleWeapons_32_5"  // Special weapon selector
    };

    // Weapon quality management (Older Syntax)
    function WeaponQualityManager() {
        this.quality = 5; // Default to quality 5
        this.isInitial = true;
    }

    WeaponQualityManager.prototype.pickNextQuality = function (callback) {
        if (this.quality > 1) {
            this.quality--; // Decrease quality if possible
        } else {
            callback(); // Call function when quality reaches 1
        }
    };

    WeaponQualityManager.prototype.getCurrentQuality = function () {
        return this.quality;
    };

    WeaponQualityManager.prototype.isInitialState = function () {
        return this.isInitial;
    };

    WeaponQualityManager.prototype.reset = function () {
        this.quality = 5;
        this.isInitial = true;
    };

    var weaponQualityManager = new WeaponQualityManager();

    function getProfileId() {
        var profileLink = document.querySelector("ul.dropdown-menu a[href*='/en/profile/']");
        if (profileLink) {
            var href = profileLink.href;
            var profileId = href.split("/").pop(); // Extract number after /profile/
            console.log("Profile ID found:", profileId);
            return profileId;
        }
        console.log("Profile link not found!");
        return null;
    }

    function selectWeapon(quality) {
        var weapon = document.querySelector(PREFIX.TANK + quality);
        if (!weapon) {
            weapon = document.querySelector(PREFIX.NAVY + quality);
        }
        return weapon;
    }

    function checkSpecialWeapon() {
        var specialWeapon = document.querySelector(PREFIX.SPECIAL_WEAPON);
        if (specialWeapon && !specialWeapon.classList.contains('disabled')) {
            console.log("Special weapon is available.");
            return specialWeapon;
        }
        console.log("Special weapon is not available.");
        return null;
    }

    function fighter(options) {
        console.log("Starting fighter...");

        var intervalId = setInterval(function () {
            console.log("Interval running...");

            var energy = document.getElementById("energyBarT");
            if (!energy) {
                console.log("Energy bar not found!");
                return;
            }

            var numberEnergy = parseInt(energy.innerText, 10);
            console.log("Energy:", numberEnergy);

            var energyBar = document.getElementById("battleEnergy");
            var countDown = document.querySelector(".countdown_row.countdown_amount");
            var profileId = getProfileId();
            if (!profileId) {
                console.log("Profile ID not found, stopping...");
                return;
            }

            var fightButton = document.getElementById("battleFight" + profileId);
            if (!fightButton) {
                console.log("Fight button not found for profile ID:", profileId);
                return;
            }

            if (!countDown || countDown.innerText === "00:00:00" || countDown.innerText < "00:00:01") {
                console.log("Countdown ended, stopping...");
                fightButton.innerText = "FIGHT";

                restoreDefaultButtonState(options);
                options.clearParentInterval();
                console.info("STOPPED");
                return;
            }

            fightButton.innerText = "CLICKING";

            var weapon = checkSpecialWeapon();
            if (!weapon) {
                if (weaponQualityManager.isInitialState()) {
                    console.log("Selecting first weapon...");
                    weapon = selectWeapon(weaponQualityManager.getCurrentQuality());
                    if (!weapon) {
                        console.log("No weapon found, fighting without weapon.");
                    } else {
                        console.log("Selected weapon of quality:", weaponQualityManager.getCurrentQuality());
                        weapon.click();
                    }
                }
            } else {
                weapon.click();
            }

            if (numberEnergy < 1001) {
                console.log("Low energy, trying to refill...");
                if (!energyBar) {
                    console.log("Energy bar not found!");
                    fightButton.innerText = "FIGHT";
                    restoreDefaultButtonState(options);
                    options.clearParentInterval();
                    console.info("STOPPED: NO MORE ENERGY");
                    return;
                }

                energyBar.click();
            } else {
                console.log("Sufficient energy, clicking fight button...");
                fightButton.click();
            }
        }, 2300);

        return intervalId;
    }

    function restoreDefaultButtonState(options) {
        console.log("Restoring default button...");
        options.icon.className = "fa fa-fighter-jet";
        options.button.className = "btn btn-success";
        options.button.blur();
    }

    function appendChildrenToVs919() {
        console.log("Appending start/stop button...");
        var container = document.querySelector("div.vs919");
        if (!container) {
            console.log("VS919 container not found!");
            return;
        }

        container.style.display = "flex";
        var startStopButton = document.createElement("button");
        startStopButton.title = "Fight";
        startStopButton.className = "btn btn-success";

        var icon = document.createElement("i");
        icon.className = "fa fa-fighter-jet";
        icon.style.pointerEvents = "none";
        startStopButton.appendChild(icon);

        var interval = null;
        startStopButton.addEventListener("click", function (e) {
            console.log("Start/Stop button clicked...");

            if (interval) {
                console.log("Stopping...");
                restoreDefaultButtonState({
                    button: e.target,
                    icon: icon
                });
                clearInterval(interval);
                interval = null;
                return;
            }

            console.log("Starting...");
            icon.className = "fa fa-pause";
            e.target.className = "btn btn-info";
            e.target.blur();
            interval = fighter({
                button: e.target,
                icon: icon,
                clearParentInterval: function () {
                    console.log("Clearing interval...");
                    clearInterval(interval);
                    interval = null;
                }
            });
        });

        container.appendChild(startStopButton);
    }

    appendChildrenToVs919();
})();
