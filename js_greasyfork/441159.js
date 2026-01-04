// ==UserScript==
// @name            Melvor Astrology Upgrade
// @version         1.0.0
// @license         MIT
// @description     Adds a button to upgrade an existing Astrology modifier
// @author          lucidobservor
// @match           https://*.melvoridle.com/*
// @exclude         https://wiki.melvoridle.com*
// @namespace       https://greasyfork.org/users/884123
// @downloadURL https://update.greasyfork.org/scripts/441159/Melvor%20Astrology%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/441159/Melvor%20Astrology%20Upgrade.meta.js
// ==/UserScript==

function AstrologyUpgrade() {
    // Configurable values
    const CONFIG = {
        inputDustArray: [40, 100, 400, 2000],
        showConfirmation: true,
    }

    // Grab Melvor data
    const MELVOR = {
        stardustIcons: {
            xs: '<img class="skill-icon-xs mr-1" src="https://cdn.melvor.net/core/v018/assets/media/bank/stardust.png">',
            xxs: '<img class="skill-icon-xxs mr-1" src="https://cdn.melvor.net/core/v018/assets/media/bank/stardust.png">',
        },
        goldStardustIcons: {
            xs: '<img class="skill-icon-xs mr-1" src="https://cdn.melvor.net/core/v018/assets/media/bank/golden_stardust.png">',
            xxs: '<img class="skill-icon-xxs mr-1" src="https://cdn.melvor.net/core/v018/assets/media/bank/golden_stardust.png">',
        },
    };

    for (let i = 0; i < 3; i++) {
        astrologyMenus.explorePanel.standardModifiers[i].querySelector(".media").appendChild(createUpgradeButton(i))
        astrologyMenus.explorePanel.uniqueModifiers[i].querySelector(".media").appendChild(createUpgradeButton(i, true))
    }

    // TODO: Actually render the cost on the button
    function createUpgradeButton(index, isUnique) {
        let icon = isUnique ? MELVOR.goldStardustIcons.xs : MELVOR.stardustIcons.xs;
        let btn = document.createElement("button");
        btn.id = "astrology-upgrade-btn";
        btn.classList.add(...["btn", "btn-sm", "btn-primary", "m-1"]);
        btn.innerHTML = icon + " <span>Upgrade</span>";
        btn.addEventListener("click", () => checkAndPerformUpgrade(index, isUnique));
        return btn;
    }

    function checkAndPerformUpgrade(index, isUnique) {
        // Check if unlocked
        const modifiers = game.astrology.constellationModifiers.get(game.astrology.exploredConstellation)[isUnique ? "unique" : "standard"];
        if (index >= modifiers.length) {
            notifyPlayer(CONSTANTS.skill.Astrology, "This modifier is not yet unlocked", "danger");
            return;
        }

        // Check if already maxed
        const modifier = modifiers[index];
        const currentValue = 'values' in modifier ? modifier.values[0][1] : modifier.value;
        if (currentValue === 5) {
            notifyPlayer(CONSTANTS.skill.Astrology, "This modifier cannot be upgraded any further", "danger");
            return;
        }

        // Calculate cost and check if stardust is available
        const cost = CONFIG.inputDustArray[currentValue - 1] / (game.astrology.isPoolTierActive(3) ? 2 : 1);
        const currentStardust = getBankQty(isUnique ? CONSTANTS.item.Golden_Stardust : CONSTANTS.item.Stardust)
        const icons = isUnique ? MELVOR.goldStardustIcons : MELVOR.stardustIcons;
        if (currentStardust < cost) {
            notifyPlayer(CONSTANTS.skill.Astrology, `You need ${cost} ${icons.xxs} to upgrade this modifier`, "danger");
            return;
        }

        // Check for confirmation
        if (CONFIG.showConfirmation) {
            SwalLocale.fire({
                title: "Confirm Upgrade",
                html: `<h5 class="font-w600 mb-1">Spend ${cost} ${icons.xs} to upgrade this modifier from ${currentValue}% to ${currentValue + 1}%?<br><br>This cost is halved if the 95% mastery pool bonus is active.</h5>`,
                showCancelButton: true,
                confirmButtonText: "Upgrade",
            }).then((result) => {
                if (result.value) {
                    performUpgrade(index, isUnique, modifier, cost);
                }
            });
        } else {
            performUpgrade(index, isUnique, modifier, cost);
        }
    }

    function performUpgrade(index, isUnique, modifier, cost) {
        let newModifier;
        if (isSkillKey(modifier.key)) {
            newModifier = {
                key: modifier.key,
                values: [
                    [modifier.values[0][0], modifier.values[0][1] + 1]
                ],
            };
        } else {
            newModifier = {
                key: modifier.key,
                value: modifier.value + 1,
            };
        }

        game.astrology.checkStardustCostsAndConsume(isUnique ? Items.Golden_Stardust : Items.Stardust, cost);
        game.astrology.setModifier(game.astrology.exploredConstellation, isUnique ? AstrologyModifierType.Unique : AstrologyModifierType.Standard, index, newModifier);
    }
}


// Injecting the script when possible
(() => {
    function loadScript() {
        // Load script after the actual Melvor game has loaded
        if (typeof isLoaded !== typeof undefined && isLoaded) {
            clearInterval(scriptLoader);

            const scriptElem = document.createElement("script");
            scriptElem.textContent = `try {(${AstrologyUpgrade})();} catch (e) {console.log(e);}`;
            document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem);
        }
    }

    const scriptLoader = setInterval(loadScript, 250);
})();