// ==UserScript==
// @name         Neopets - Karla's Battledome Bot
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.3.1
// @description  A bot that automatically fights for you in battledome
// @author       Karla
// @match        *://*.neopets.com/dome/fight*
// @match        *://*.neopets.com/dome/arena*
// @match        *://*.neopets.com/dome/barracks*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/545897/Neopets%20-%20Karla%27s%20Battledome%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/545897/Neopets%20-%20Karla%27s%20Battledome%20Bot.meta.js
// ==/UserScript==

const MIN_WAIT = 700;
const MAX_WAIT = 1200;

GM_addStyle("#QuestLogStreakRewards { display: block !important; }")

let battleType = GM_getValue('battle_type') || 'fixed';
let fixedCount = GM_getValue('fixed_count') || 1;
let battlesLeft = GM_getValue('battles_left') || 0;
let rewardsNp = GM_getValue('rewards_np') || false;
let rewardsItems = GM_getValue('rewards_items') || false;
let rewardsPlot = GM_getValue('rewards_plot') || false;
let infiniteCount = GM_getValue('infinite_count') || 1;
let infiniteWait = GM_getValue('infinite_wait') || 1;
let battlesDone = GM_getValue('battles_done') || 0;
let paused = GM_getValue('paused') || false;

const random_in_range = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

function extractVarObject(html, varName) {
    const assignIndex = html.indexOf(`var ${varName} =`);
    if (assignIndex === -1) return null;

    // Find the first '{' after the variable name
    const start = html.indexOf('{', assignIndex);
    if (start === -1) return null;

    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let escaped = false;
    let end = -1;

    for (let i = start; i < html.length; i++) {
        const char = html[i];

        if (inString) {
            if (!escaped && char === stringChar) {
                inString = false;
            }
            escaped = char === '\\' && !escaped;
        } else {
            if (char === '"' || char === "'") {
                inString = true;
                stringChar = char;
                escaped = false;
            } else if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                    end = i;
                    break;
                }
            }
        }
    }

    if (end === -1) return null;

    const objectString = html.slice(start, end + 1);
    return eval(`(${objectString})`); // safe only if source is trusted
}

function addRound(el, weapons, abilities, n, weaponSetting = {}) {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.className = 'round_row';
    const round = document.createElement('div');
    round.style.marginRight = '12px';
    round.style.width = '65px';
    round.style.textAlign = 'left';
    round.innerHTML = n === 0 ? 'Cycle' : `Step`;
    const weapon1 = document.createElement('select');
    weapon1.className = 'weapon1';
    weapon1.style.width = '25%';
    weapon1.innerHTML = "<option value=\"\">Select Weapon 1</option>";
    weapons.forEach(function(weapon) {
        const option = document.createElement('option');
        option.value = weapon;
        option.innerHTML = weapon;
        weapon1.appendChild(option);
    });
    weapon1.value = weaponSetting.weapon1;
    const weapon2 = document.createElement('select');
    weapon2.className = 'weapon2';
    weapon2.style.width = '25%';
    weapon2.innerHTML = "<option value=\"\">Select Weapon 2</option>";
    weapons.forEach(function(weapon) {
        const option = document.createElement('option');
        option.value = weapon;
        option.innerHTML = weapon;
        weapon2.appendChild(option);
    });
    weapon2.value = weaponSetting.weapon2;
    div.appendChild(round);
    div.appendChild(weapon1);
    div.appendChild(weapon2);
    if (abilities.length > 0) {
        const ability1 = document.createElement('select');
        ability1.className = 'ability1';
        ability1.style.width = '25%';
        ability1.innerHTML = "<option value=\"\">Select Ability</option>";
        abilities.forEach(function(ability) {
            const option = document.createElement('option');
            option.value = ability;
            option.innerHTML = ability;
            ability1.appendChild(option);
        });
        ability1.value = weaponSetting.ability1;
        div.appendChild(ability1);
    }

    const removeButton = document.createElement('button');
    removeButton.innerHTML = '-';
    removeButton.className = 'remove_button';
    if (n > 0) {
        div.appendChild(removeButton);
    }
    el.appendChild(div);
    return div;
}

function parseWeaponSetting(roundsPanel) {
    try {
        const rows = roundsPanel.querySelectorAll('.round_row');
        return Array.from(rows).map(row => ({
            weapon1: row.querySelector('.weapon1').value,
            weapon2: row.querySelector('.weapon2').value,
            ability1: row.querySelector('.ability1')?.value || '',
        }));
    } catch (e) {
        console.log(e);
    }
}

async function insertButtons (target, stamp) {
    const settingButton = document.createElement('button');
    settingButton.style.display = 'flex';
    settingButton.style.alignItems = 'center';
    settingButton.style.background = '#fcc604';
    settingButton.style.color = '#fff';
    settingButton.style.fontWeight = 'bold';
    settingButton.style.padding = '8px';
    settingButton.style.border = '1px solid black';
    settingButton.style.cursor = 'pointer';
    settingButton.innerHTML = '<section style="background-image: url(https://images.neopets.com/themes/h5/basic/images/v3/settings-icon.svg); width: 20px; height: 20px; background-size: contain; margin-right: 6px;"></section>Settings';
    const panel = document.querySelector('div');
    panel.className = 'togglePopup__2020 movePopup__2020';
    panel.id = 'bd_setting_popup';
    panel.style.display = 'none';
    panel.style.transform = 'translate(-50%, -50%)';
    panel.style.margin = '0 !important';
    panel.innerHTML = `<div class="popup-header__2020">
		<button tabindex="0" class="popup-exit button-default__2020 button-red__2020">
			<div class="popup-exit-icon"></div>
		</button>
		<h3>Battledome Bot Settings</h3>
		<div class="popup-header-pattern__2020"></div>
	</div>

	<div class="popup-body__2020" style="max-height: 679.9px; padding-left: 20px; padding-right: 20px;">
      <div>
        <div style="display: flex; align-items: center;">
          <label style="margin-right: 5px" for="fixed" class="settings-label">Fixed</label>
          <input class="settings-radio" id="fixed" name="battle_type" title="Fixed" type="radio" value="fixed" style="margin: 0">
        </div>
        <div id="fixed_panel" style="text-align: left; padding-left: 16px; display: none;">
          <label style="margin-right: 5px" for="fixed_count" class="settings-label">Number of rounds:</label>
          <input id="fixed_count" type="number" min="1">
        </div>
        <div style="display: flex; align-items: center;">
          <label style="margin-right: 5px" for="rewards" class="settings-label">For rewards</label>
          <input class="settings-radio" id="rewards" name="battle_type" title="Fixed number of rounds" type="radio" value="rewards" style="margin: 0">
        </div>
        <div id="rewards_panel" style="display: none;">
          <div style="text-align: left; padding-left: 16px;">
            <label style="margin-right: 5px" for="rewards_np" class="settings-label">Neopoints</label>
            <input id="rewards_np" type="checkbox">
          </div>
          <div style="text-align: left; padding-left: 16px;">
            <label style="margin-right: 5px" for="rewards_items" class="settings-label">Items</label>
            <input id="rewards_items" type="checkbox">
          </div>
          <div style="text-align: left; padding-left: 16px;">
            <label style="margin-right: 5px" for="rewards_plot" class="settings-label">Plot points</label>
            <input id="rewards_plot" type="checkbox">
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <label style="margin-right: 5px" for="infinite" class="settings-label">Infinite</label>
          <input class="settings-radio" id="infinite" name="battle_type" title="Fixed number of rounds" type="radio" value="rewards" style="margin: 0">
        </div>
        <div id="infinite_panel" style="display: none;">
          <div id="fixed_panel" style="text-align: left; padding-left: 16px;">
            <label style="margin-right: 5px" for="infinite_count" class="settings-label">After <input id="infinite_count" type="number" min="1"> battles</label>
          </div>
          <div id="fixed_panel" style="text-align: left; padding-left: 16px;">
            <label style="margin-right: 5px" for="infinite_count" class="settings-label">Wait for <input id="infinite_wait" type="number" min="1"> (+1~20)s</label>
          </div>
        </div>
        <div style="margin-top: 16px;">
          <div style="text-align: left;">Battle Settings - <span id="pet_name_slot"></span></div>
          <div id="loading_state">Loading...</div>
          <div id="rounds_panel">

          </div>
          <div id="rounds_panel_cycle">

          </div>
        </div>
      </div>
	</div>

	<div class="popup-footer__2020 popup-grid3__2020">
		<div></div>
        <div style="text-align:center; font-weight: bold;">Settings is auto saved</div>
		<div class="popup-footer-pattern__2020"></div>
	</div>`

    const fixedToggle = panel.querySelector('#fixed');
    const rewardsToggle = panel.querySelector('#rewards');
    const infiniteToggle = panel.querySelector('#infinite');
    const fixedPanel = panel.querySelector('#fixed_panel');
    const rewardsPanel = panel.querySelector('#rewards_panel');
    const infinitePanel = panel.querySelector('#infinite_panel');

    const fixedCountInput = panel.querySelector('#fixed_count');
    const rewardsNpInput = panel.querySelector('#rewards_np');
    const rewardsItemsInput = panel.querySelector('#rewards_items');
    const rewardsPlotInput = panel.querySelector('#rewards_plot');
    const infiniteCountInput = panel.querySelector('#infinite_count');
    const infiniteWaitInput = panel.querySelector('#infinite_wait');

    const roundsPanel = panel.querySelector('#rounds_panel');
    const roundsPanelCycle = panel.querySelector('#rounds_panel_cycle');

    switch(battleType) {
        case 'fixed':
            fixedToggle.checked = true;
            fixedPanel.style.display = 'block';
            break;
        case 'rewards':
            rewardsToggle.checked = true;
            rewardsPanel.style.display = 'block';
            break;
        case 'infinite':
            infiniteToggle.checked = true;
            infinitePanel.style.display = 'block';
            break;
        default:
    }
    fixedCountInput.value = fixedCount;
    rewardsNpInput.checked = rewardsNp;
    rewardsItemsInput.checked = rewardsItems;
    rewardsPlotInput.checked = rewardsPlot;
    infiniteCountInput.value = infiniteCount;
    infiniteWaitInput.value = infiniteWait;

    fixedToggle.addEventListener('change', function(event) {
        if (event.target.checked) {
            fixedPanel.style.display = 'block';
            rewardsPanel.style.display = 'none';
            infinitePanel.style.display = 'none';
            GM_setValue('battle_type', 'fixed');
        }
    });
    rewardsToggle.addEventListener('change', function(event) {
        if (event.target.checked) {
            fixedPanel.style.display = 'none';
            rewardsPanel.style.display = 'block';
            infinitePanel.style.display = 'none';
            GM_setValue('battle_type', 'rewards');
        }
    });
    infiniteToggle.addEventListener('change', function(event) {
        if (event.target.checked) {
            fixedPanel.style.display = 'none';
            rewardsPanel.style.display = 'none';
            infinitePanel.style.display = 'block';
            GM_setValue('battle_type', 'infinite');
        }
    });
    fixedCountInput.addEventListener('change', function(event) {
        GM_setValue('fixed_count', Number(event.target.value));
        fixedCount = Number(event.target.value);
        battlesLeft = fixedCount;
        GM_setvalue('battles_left', battlesLeft);
    });
    rewardsNpInput.addEventListener('change', function(event) {
        GM_setValue('rewards_np', event.target.checked);
    });
    rewardsItemsInput.addEventListener('change', function(event) {
        GM_setValue('rewards_items', event.target.checked);
    });
    rewardsPlotInput.addEventListener('change', function(event) {
        GM_setValue('rewards_plot', event.target.checked);
    });
    infiniteCountInput.addEventListener('change', function(event) {
        GM_setValue('infinite_count', Number(event.target.value));
    });
    infiniteWaitInput.addEventListener('change', function(event) {
        GM_setValue('infinite_wait', Number(event.target.value));
    });

    settingButton.innerHTML = 'Loading';
    settingButton.disabled = true;
    if (document.querySelector('.npcContainer')) {
        document.querySelector('.npcContainer').style.position = 'relative';
        settingButton.style.bottom = '14px';
        settingButton.style.left = '125px';
        settingButton.style.position = 'absolute';
        document.querySelector('.npcContainer').appendChild(settingButton);
    } else if (document.querySelector('#rbfightStep2')) {
        settingButton.style.margin = 'auto';
        document.querySelector('#rbfightStep2').appendChild(settingButton);
    }

    const htmlWeapon = await fetch('https://www.neopets.com/dome/neopets.phtml').then(function(res) {
        return res.text();
    });

    const htmlAbility = await fetch('https://www.neopets.com/dome/abilities.phtml').then(function(res) {
        return res.text();
    });

    settingButton.addEventListener('click', function() {
        panel.style.display = 'block';
        const activePet = typeof BDFight !== 'undefined' ? BDFight.selectedPet : Array.from(document.querySelectorAll('.rb-fight_petNameLabel')).find(n => n.style.display === 'grid')?.dataset?.name;
        document.querySelector('#pet_name_slot').innerHTML = activePet;

        let weaponSetting = JSON.parse(GM_getValue(`${activePet}_weapon`) || '[]');

        const divWeapon = new DOMParser().parseFromString(htmlWeapon, "text/html").querySelector("#bdStatus");
        const counts = {};
        const weapons = Array.from(divWeapon.querySelectorAll(`[data-name="${activePet}"] .equipTable .equipFrame`)).map(el => el.textContent.trim()).map(item => {
            counts[item] = (counts[item] || 0) + 1;
            return counts[item] > 1 ? `${item} ${counts[item]}` : item;
        }).filter(n => n !== '' && !n.startsWith(' '));

        const abilityData = extractVarObject(htmlAbility, 'BDAbilities');
        const abilities = Object.keys(abilityData.pets[activePet].abilities).map(function(n) {
            return abilityData.abilities[n].name;
        });
        document.querySelector('#loading_state').style.display = 'none';

        function getWeaponSetting() {
            weaponSetting = parseWeaponSetting(roundsPanel);
            GM_setValue(`${activePet}_weapon`, JSON.stringify(weaponSetting));
        }

        function addRow(ws) {
            const div = addRound(roundsPanel, weapons, abilities, weaponSetting.length, ws);

            div.querySelector('.remove_button').addEventListener('click', function () {
                event.target.parentNode.remove();
                getWeaponSetting();
            });
            Array.from(div.querySelectorAll('select')).forEach(select => {
                select.addEventListener('change', getWeaponSetting);
            });
        }

        weaponSetting.forEach((ws, i) => {
            addRow(ws);
        });

        const weaponCycleSetting = JSON.parse(GM_getValue(`${activePet}_weapon_cycle`) || '{"weapon1":"","weapon2":"","ability1":""}');
        const divCycle = addRound(roundsPanelCycle, weapons, abilities, 0, weaponCycleSetting);
        Array.from(divCycle.querySelectorAll('select')).forEach(select => {
            select.addEventListener('change', function() {
                weaponCycleSetting[select.className] = select.value;
                GM_setValue(`${activePet}_weapon_cycle`, JSON.stringify(weaponCycleSetting));
            });
        });

        const addRoundButton = document.createElement('button');
        addRoundButton.innerHTML = '+ Add Round';
        addRoundButton.addEventListener('click', function() {
            weaponSetting.push({
                weapon1: '',
                weapon2: '',
                ability1: '',
            });
            GM_setValue(`${activePet}_weapon`, JSON.stringify(weaponSetting));
            addRow();
            if (weaponSetting.length >= 10) {
                addRoundButton.disabled = true;
            }
        });
        roundsPanelCycle.appendChild(addRoundButton);
    });
    panel.querySelector('.popup-exit').addEventListener('click', function() {
        panel.style.display = 'none';
        roundsPanel.innerHTML = '';
        roundsPanelCycle.innerHTML = '';
    });

    settingButton.innerHTML = 'Battle Bot Settings';
    settingButton.disabled = false;
    document.querySelector('body').appendChild(panel);

    document.querySelector('#bdFightStep3FightButton, #BattleContinueButton').addEventListener('click', function() {
        GM_setValue('battles_left', fixedCount);
        GM_setValue('battles_done', 0);
    });
}

function getCurrentEquippedWeapon(id) {
    const weaponImages = Array.from(document.querySelectorAll('#p1usedequipment .item, #p1equipment .item')).reduce((acc, el) => ({ ...acc, [el.src]: el.title || el.alt }), {});
    const selectedWeaponImage = document.querySelector(`#p1e${id}m.p1.selected.menu div`);
    if (!selectedWeaponImage) {
        return '';
    }
    const selectedWeapon = weaponImages[selectedWeaponImage.style.backgroundImage.replace('url("', '').replace('")', '')]
    return selectedWeapon;
}

function getCurrentEquippedAbility() {
    const abilityImages = Array.from(document.querySelectorAll('#p1ability td')).reduce((acc, el) => ({ ...acc, [el.querySelector('img')?.src]: el.title || el.alt }), {});
    const selectedAbilityImage = document.querySelector('#p1am div').style.backgroundImage;
    if (!selectedAbilityImage) {
        return '';
    }
    const selectedAbility = abilityImages[selectedAbilityImage.replace('url("', '').replace('")', '')]
    return selectedAbility;
}

(async function() {
    'use strict';

    // Your code here...
    try {
        if (document.querySelector('.npcContainer, #rbfightStep2')) {
            await insertButtons();
        } else {
            document.querySelector('#bdNav').style.marginBottom = '30px';
            const div = document.createElement('div');
            div.id = 'battle_status';
            document.querySelector('#arenacontainer').appendChild(div);
            div.style.position = 'absolute';
            div.style.bottom = '100%';
            div.style.left = '50%';
            div.style.transform = 'translateX(-50%)';
            if (battleType === 'fixed') {
                div.innerHTML = `${battlesLeft} battles left&nbsp;<button>${paused ? 'resume' : 'pause'}</button>`;
            } else if (battleType === 'infinite') {
                div.innerHTML = `${battlesDone} battles done&nbsp;<button>${paused ? 'resume' : 'pause'}</button>`;
            } else if (battleType === 'rewards') {
                div.innerHTML = `<button>${paused ? 'resume' : 'pause'}</button>`;
            }
            div.querySelector('button').addEventListener('click', function() {
                paused = !paused;
                GM_setValue('paused', paused);
                div.querySelector('button').innerHTML = paused ? 'resume' : 'pause';
            });
            while (paused) {
                await sleep(1000);
            }
            let pet = '';
            let weaponSetting;
            let weaponCycleSetting;
            let round = 0;
            async function battle(n) {
                try {
                    while (document.querySelector('#p1e1m').style.cursor !== 'auto' && document.querySelector('#p1e1m').style.cursor !== 'pointer') {
                        await sleep(MAX_WAIT);
                    }
                    if (weaponSetting && weaponCycleSetting) {
                        const { weapon1, weapon2, ability1 } = (n < weaponSetting.length) ? weaponSetting[n] : weaponCycleSetting;
                        const weaponsToEquip = [weapon1, weapon2].map(n => n.replace(/\s\d+$/, "")) ;
                        let usedId = '';

                        const freeSlots = [];

                        let x = weaponsToEquip.length;
                        for (let i = 1; i <= x; i += 1) {
                            const slot = document.querySelector(`#p1e${i}m`);
                            const equippedItemInSlot = getCurrentEquippedWeapon(i);
                            console.log(weaponsToEquip, equippedItemInSlot);
                            if (weaponsToEquip.indexOf(equippedItemInSlot) > -1) {
                                console.log(equippedItemInSlot, "equipped");
                                weaponsToEquip.splice(weaponsToEquip.indexOf(equippedItemInSlot), 1);
                            } else {
                                freeSlots.push(slot);
                            }
                        }

                        for (let i = 0; i <= freeSlots.length; i += 1) {
                            const slot = freeSlots[i];
                            const weaponToEquip = weaponsToEquip.shift();
                            if (!weaponToEquip) {
                                break;
                            }
                            if (slot.classList.contains('.selected')) {
                                slot.click();
                                await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                            }
                            slot.click();
                            await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                            const lis = document.querySelectorAll(`#p1equipment li`);

                            for (let j = 0; j < lis.length; j += 1) {
                                const li = lis[j];
                                if (li.style.display !== 'none' && li.querySelector(`[title="${weaponToEquip}"]:not(.hide), [alt="${weaponToEquip}"]:not(.hide)`)) {
                                    if (li.querySelector(`[title="${weaponToEquip}"], [alt="${weaponToEquip}"]`).id === usedId) {
                                        continue;
                                    }
                                    li.querySelector(`[title="${weaponToEquip}"], [alt="${weaponToEquip}"]`).click();
                                    usedId = li.querySelector(`[title="${weaponToEquip}"], [alt="${weaponToEquip}"]`).id
                                    break;
                                }
                            }
                            await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                        }

                        await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                        if (ability1) {
                            const currentSelectedAbility = getCurrentEquippedAbility();
                            if (currentSelectedAbility && currentSelectedAbility !== ability1) {
                                document.querySelector('#p1am').click();
                                await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                            }
                            if (!document.querySelector(`#p1ability [title="${ability1}"] .cooldown.act`)) {
                                document.querySelector('#p1am').click();
                                await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                                document.querySelector(`#p1ability [title="${ability1}"] .ability`)?.click();
                            }
                        }

                        while (document.querySelector('#fight .inactive')) {
                            await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                        }
                        await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                        document.querySelector('#fight').click();

                        while (!document.querySelector('#skipreplay:not(.replay')) {
                            await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                        }
                        while (!document.querySelector('.replay')) {
                            await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                            document.querySelector('#skipreplay:not(.replay').click();
                        }

                        await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                        while (!document.querySelector('#fight') && !document.querySelector('#start') && !document.querySelector('.end_ack.collect')) {
                            console.log(1);
                            await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                        }

                        // #playground .end_game
                        if (document.querySelector('#p2hp').textContent === '0') {
                            await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                            const itemLimit = document.querySelector('#bd_rewards').textContent.includes('You have reached the item limit for today');
                            const npLimit = document.querySelector('#bd_rewards').textContent.includes('You have reached the NP limit for today');
                            const plotLimit = !document.querySelector('#bd_rewards').textContent.includes('Plot') || document.querySelector('#bd_rewards').textContent.includes('You have reached the Plot Points limit');
                            switch (battleType) {
                                case 'fixed':
                                    if (battlesLeft > 1) {
                                        document.querySelector('#bdplayagain').click();
                                        GM_setValue('battles_left', battlesLeft - 1);
                                    }
                                    break;
                                case 'rewards':
                                    document.querySelector('.end_ack.collect').click();
                                    if ((rewardsNp && !npLimit) || (rewardsItems && !itemLimit) || (rewardsPlot && !plotLimit)) {
                                        document.querySelector('#bdplayagain').click();
                                    }
                                    break;
                                case 'infinite':
                                    if (battlesDone % infiniteCount === 0 && battlesDone > 0) {
                                        infiniteWait += random_in_range(0, 20);
                                        await new Promise(function(resolve) {
                                            const interval = setInterval(function() {
                                                infiniteWait -= 1;
                                                document.querySelector('#battle_status').innerHTML = `Waiting... ${infiniteWait}s left`;
                                                if (infiniteWait <= 0) {
                                                    clearInterval(interval);
                                                    resolve();
                                                }
                                            }, 1000);
                                        });
                                    }
                                    GM_setValue('battles_done', battlesDone + 1);
                                    document.querySelector('#bdplayagain').click();
                                    break;
                                default:
                            }
                        } else {
                            battle(n + 1);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            async function loop() {
                if (document.querySelector('#start')) {
                    await sleep(random_in_range(MIN_WAIT, MAX_WAIT));
                    document.querySelector('#start').click();
                }
                if (document.querySelector('#p1name')) {
                    pet = document.querySelector('#p1name').textContent;
                    if (!weaponSetting) {
                        weaponSetting = JSON.parse(GM_getValue(`${pet}_weapon`) || '[]');
                    }
                    if (!weaponCycleSetting) {
                        weaponCycleSetting = JSON.parse(GM_getValue(`${pet}_weapon_cycle`) || '{"weapon1":"","weapon2":"","ability1":""}');
                    }

                    battle(0);
                    return;
                }

                setTimeout(loop, MIN_WAIT);
            }
            loop();
        }
    } catch (e) {
        console.log(e);
    }
})();
