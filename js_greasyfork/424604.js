// ==UserScript==
// @name         Melvor Corruption Roller
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  Bloop Bleep. I roll for corruptions.
// @author       NotCorgan#1234
// @match        https://melvoridle.com/*
// @match        https://www.melvoridle.com/*
// @match        https://test.melvoridle.com/*
// @exclude      https://melvoridle.com/update/*
// @exclude      https://www.melvoridle.com/update/*
// @exclude      https://test.melvoridle.com/update/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/424604/Melvor%20Corruption%20Roller.user.js
// @updateURL https://update.greasyfork.org/scripts/424604/Melvor%20Corruption%20Roller.meta.js
// ==/UserScript==

// Made for version 0.19.2
(function() {
    function injectScript(main) {
        var script = document.createElement('script');
        script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(script).parentNode.removeChild(script);
    }

    function script() {
        if (currentGamemode === 3) {
            items.forEach((item, i) => item.itemID = i);

            let __notifyPlayer = notifyPlayer;
            notifyPlayer = function() {
                let [skill, message, type = "success"] = [...arguments];
                if (skill == CONSTANTS.skill.Attack && message == 'Your item was destroyed :(' && type == "danger")
                    return;
                __notifyPlayer.apply(window, arguments);
            }

            let bannedModifiers = ["golbinRaidWaveSkipCostReduction", "golbinRaidIncreasedMinimumFood", "golbinRaidIncreasedMaximumAmmo", "golbinRaidIncreasedMaximumRunes", "golbinRaidPrayerUnlocked", "golbinRaidIncreasedPrayerLevel", "golbinRaidIncreasedPrayerPointsStart", "golbinRaidIncreasedPrayerPointsWave", "golbinRaidPassiveSlotUnlocked", "golbinRaidIncreasedStartingRuneCount", "golbinRaidStartingWeapon", "freeBonfires", "autoSlayerUnlocked", "increasedEquipmentSets", "dungeonEquipmentSwapping", "increasedTreeCutLimit", "increasedAttackRolls", "decreasedAttackRolls", "increasedBankSpaceShop", "decreasedBankSpaceShop", "increasedGPFromSales", "decreasedGPFromSales", ];
            let activeModifiers = Object.fromEntries(Object.entries(playerModifiersTemplate).filter(([mod, val]) => !bannedModifiers.includes(mod)));

            corruptionRollerSettings = new Proxy(JSON.parse(localStorage.getItem(`corruptionRoller-${currentCharacter}`) || JSON.stringify(Array.from(Array(11)).map((_, i) => []))), {
                get: function(target, id) {
                    return target[id];
                },
                set: function(target, id, value) {
                    target[id] = value
                    localStorage.setItem(`corruptionRoller-${currentCharacter}`, JSON.stringify(target))
                }
            });

            corruptionRollerCount = new Proxy(JSON.parse(localStorage.getItem(`corruptionRollerCount-${currentCharacter}`) || JSON.stringify(Array.from(Array(11)).fill(0))), {
                get: function(target, id) {
                    return target[id];
                },
                set: function(target, id, value) {
                    target[id] = value
                    localStorage.setItem(`corruptionRollerCount-${currentCharacter}`, JSON.stringify(target))
                }
            });

            let levelRequired = (item) => Math.max(item.attackLevelRequired || 0, item.defenceLevelRequired || 0, item.rangedLevelRequired || 0, item.magicLevelRequired || 0, item.slayerLevelRequired || 0)
            let itemSub = (item) => [
                ['Attack', 'attackLevelRequired'],
                ['Defence', 'defenceLevelRequired'],
                ['Ranged', 'rangedLevelRequired'],
                ['Magic', 'magicLevelRequired'],
                ['Slayer', 'slayerLevelRequired']
            ].map(([name, stat]) => item[stat] != undefined && `<br>Requires ${name} <small class='text-warning'>${item[stat]}</small>`).filter(Boolean)

            class CorruptionModal {
                constructor() {
                    this.modal = document.createElement('div');
                    this.modal.id = 'modal-corruption-items';
                    this.modal.className = 'modal';
                    this.modalDialog = document.createElement('div');
                    this.modalDialog.className = 'modal-dialog modal-xl';
                    this.modal.appendChild(this.modalDialog);
                    this.modalContent = document.createElement('div');
                    this.modalContent.className = 'modal-content';
                    this.modalDialog.appendChild(this.modalContent);
                    this.modalHeader = $(`<div class="block block-themed block-transparent mb-0"><div class="block-header bg-primary-dark"><h3 class="block-title">Corruption Items</h3><div class="block-options"><button type="button" class="btn-block-option" data-dismiss="modal" aria-label="Close"><i class="fa fa-fw fa-times"></i></button></div></div></div>`);
                    $(this.modalContent).append(this.modalHeader);
                    this.modalBody = $(`<div class="row"></div>`);
                    this.modalWrap = $(`<div class="block-content"></div`);
                    $(this.modalWrap).append(this.modalBody);
                    $(this.modalContent).append(this.modalWrap);
                    this.tts = [];
                    document.getElementById('page-container').appendChild(this.modal);
                }

                show = (i) => {
                    $(this.modalBody).html("");
                    if (this.tts.length > 0) this.tts.forEach(tt => tt.destroy());
                    this.tts = [];
                    items.filter(item => item.equipmentSlot !== undefined && item.sellsFor >= [0, 200, 10000, 400000, Infinity][i] && item.sellsFor < [0, 200, 10000, 400000, Infinity][i + 1]).sort((a, b) => (a.equipmentSlot == b.equipmentSlot ? levelRequired(a) - levelRequired(b) : a.equipmentSlot - b.equipmentSlot)).forEach(item => {
                        $(this.modalBody).append('<img class="skill-icon-sm" id="corruption-item-img-' + item.itemID + '" src="' + getItemMedia(item.itemID) + '">');
                        let tt = "<div class='text-center'>" + item.name + "<small class='text-info'>" + itemSub(item) + "</small></div>";
                        this.tts = this.tts.concat(tippy("#corruption-item-img-" + item.itemID, {
                            content: tt,
                            placement: "bottom",
                            allowHTML: true,
                            interactive: false,
                            animation: false,
                        }));
                    });
                    $(this.modal).modal("show");
                };
            }

            class AutoComplete {
                constructor(parent, db, [inputValue, valueValue] = []) {
                    this.parent = parent;
                    this.db = db;
                    this.inputElement = document.createElement('input');
                    this.valueElement = document.createElement('input');
                    this.skillElement = document.createElement('select');
                    this.removeElement = document.createElement('div');

                    let anyOpt = document.createElement('option');
                    anyOpt.value = -1;
                    anyOpt.innerHTML = "Any";
                    this.skillElement.appendChild(anyOpt);

                    Object.entries(SKILLS).forEach(([id, skill]) => {
                        let opt = document.createElement('option');
                        opt.value = parseInt(id);
                        opt.innerHTML = skill.name;
                        this.skillElement.appendChild(opt);
                    });

                    if (inputValue != undefined)
                        this.inputElement.value = inputValue;
                    if (valueValue != undefined) {
                        if (Array.isArray(valueValue)) {
                            this.skillElement.style.setProperty('display', 'inline-block');
                            this.skillElement.value = valueValue[0];
                            this.valueElement.value = valueValue[1];
                        } else {
                            this.skillElement.style.setProperty('display', 'none');
                            this.valueElement.value = valueValue;
                        }
                    } else {
                        this.skillElement.style.setProperty('display', 'none');
                    }
                    this.resultsElement = document.createElement('div');

                    this.parent.style.setProperty('text-align', 'left');

                    this.removeElement.style.setProperty('height', '30px');
                    this.removeElement.style.setProperty('display', 'inline-block');
                    this.removeElement.style.setProperty('padding', '5px');
                    this.removeElement.appendChild(document.createTextNode('X'));

                    this.inputElement.style.setProperty('height', '30px');
                    this.inputElement.style.setProperty('width', '350px');

                    this.skillElement.style.setProperty('height', '30px');

                    this.valueElement.style.setProperty('width', '40px');
                    this.valueElement.style.setProperty('height', '30px');

                    this.resultsElement.style.setProperty('position', 'relative');
                    this.resultsElement.style.setProperty('top', '30px;');
                    this.resultsElement.style.setProperty('min-height', '0px');
                    this.resultsElement.style.setProperty('max-height', '100px');
                    this.resultsElement.style.setProperty('transition', 'height 350ms ease');
                    this.resultsElement.style.setProperty('overflow-y', 'hidden');
                    this.resultsElement.style.setProperty('z-index', '99');
                    this.resultsElement.style.setProperty('background-color', '#222');
                    this.resultsElement.style.setProperty('border-radius', '5px');

                    this.parent.appendChild(this.inputElement);
                    this.parent.appendChild(this.valueElement);
                    this.parent.appendChild(this.skillElement);
                    this.parent.appendChild(this.removeElement);
                    this.parent.appendChild(this.resultsElement);

                    this.inputElement.addEventListener("keyup", this.updateAutoComplete);
                    this.inputElement.addEventListener("change", this.updateAutoComplete);
                    this.inputElement.addEventListener("focusin", this.updateAutoComplete);
                    this.inputElement.addEventListener("blur", (e) => {
                        if (e.relatedTarget != null && this.db.findIndex(mod => this.inputElement.value.toLowerCase() == mod.toLowerCase()) == -1) {
                            this.inputElement.value = '';
                        }
                        this.updateAutoComplete();
                    });
                    this.removeElement.addEventListener("mousedown", (e) => this.parent.parentNode.removeChild(this.parent));
                }

                getConfig = () => {
                    let idx = this.db.findIndex(mod => this.inputElement.value.toLowerCase() == mod.toLowerCase());
                    let mod = this.db[idx];

                    if (activeModifiers[mod] !== undefined && this.parent.parentNode != null) {
                        if (Array.isArray(activeModifiers[mod])) {
                            return [mod, [parseInt(this.skillElement.value) || 0, parseInt(this.valueElement.value) || 0]];
                        } else {
                            return [mod, parseInt(this.valueElement.value) || 0];
                        }
                    }
                }

                updateSkill = () => {
                    let idx = this.db.findIndex(mod => this.inputElement.value.toLowerCase() == mod.toLowerCase());
                    let mod = this.db[idx];
                    if (mod) {
                        if (activeModifiers[mod] !== undefined) {
                            if (Array.isArray(activeModifiers[mod])) {
                                this.skillElement.style.setProperty('display', 'inline-block');
                            } else {
                                this.skillElement.style.setProperty('display', 'none');
                            }
                        }
                    }
                }

                updateAutoComplete = e => {
                    this.updateSkill();
                    this.resultsElement.innerHTML = '';
                    this.resultsElement.style.height = '0px';
                    if (!this.inputElement.value || this.db.findIndex(mod => this.inputElement.value == mod) != -1) return;

                    var search = new RegExp(this.inputElement.value, "i");
                    let frag = document.createDocumentFragment();
                    this.db.forEach(mod => {
                        if (search.test(mod)) {
                            var div = document.createElement('div');
                            div.style.setProperty('height', '20px');
                            div.style.setProperty('width', '100%');
                            div.style.setProperty('text-align', 'left');
                            div.appendChild(document.createTextNode(mod));
                            div.addEventListener('mousedown', (e) => (this.inputElement.value = mod, this.resultsElement.innerHTML = '', this.resultsElement.style.height = '0px', this.inputElement.dispatchEvent(new Event('change'))));
                            frag.appendChild(div);
                        }
                    });

                    if (frag.children.length > 1 || frag.children.length == 1 && frag.firstElementChild.innerText != this.inputElement.value)
                        (this.resultsElement.style.height = '100px', this.resultsElement.appendChild(frag))
                }
            }

            Object.entries(corruptionRollerSettings).forEach(([slot, settings]) => {
                let el = $(`#corruption-equipment-slot-${slot}`)[0];
                if (!el) return;

                let btn = document.createElement('button');
                btn.className = 'btn btn-sm btn-dual text-combat-smoke';
                btn.id = `corruption-equipment-slot-${slot}-mods`


                /*

                    */
                tippy(btn, {
                    allowHTML: true,
                    onShow: (instance) => {
                        let count = Math.min(corruptionRollerCount[slot] || 0, corruptionRollerSettings[slot].length);
                        let html = `<h5 class="font-w600 font-size-sm mb-2">Corrupting for ${count} Modifier${count!=1?'s':''}</h5>`;
                        html += corruptionRollerSettings[slot].map(([modifier, value]) => printPlayerModifier(modifier, value))
                            .map(mod => `<h5 class="font-w400 font-size-sm mb-1 ${mod[1]}">${mod[0]}</h5>`).join('');

                        instance.setContent(html);
                    }
                })

                btn.addEventListener('click', (e) => {
                    e.preventDefault()
                    e.stopPropagation();
                    let mods = [];

                    let html = '' +
                        '<div class="corruption-mods">' +
                        ('<div class="corruption-mod-selector"></div>'.repeat(corruptionRollerSettings[slot].length)) +
                        '</div>' +
                        '<div class="corruption-mods-add">Add New</div>';
                    Swal.fire({
                        html: html,
                        width: 700,
                        onBeforeOpen: () => {
                            mods = [...$('.corruption-mod-selector')].map((el, i) => new AutoComplete(el, Object.keys(activeModifiers), corruptionRollerSettings[slot][i]));
                            $('.corruption-mods-add')[0].addEventListener('click', (e) => {
                                let el = document.createElement('div');
                                el.className = 'corruption-mod-selector';
                                $('.corruption-mods')[0].appendChild(el);

                                mods.push(new AutoComplete(el, Object.keys(activeModifiers)))
                            });
                        },
                        preConfirm: () => {
                            if (mods)
                                return mods;
                        }
                    }).then(data => {
                        if (data.isConfirmed) {
                            corruptionRollerSettings[slot] = data.value.map(value => value.getConfig()).filter(v => v != null)
                        }
                    });
                });

                let img = document.createElement('img');
                img.className = 'skill-icon-xxs';
                img.src = 'assets/media/main/corruption.svg';
                btn.appendChild(img);

                let count = document.createElement('select');
                Array.from(Array(5)).map(count => document.createElement('option')).map((el, i) => (el.value = i, el.innerHTML = i, el)).forEach(el => count.appendChild(el));
                count.value = corruptionRollerCount[slot];

                count.addEventListener('click', (e) => (e.preventDefault(), e.stopPropagation()))
                count.addEventListener('change', (e) => corruptionRollerCount[slot] = parseInt(e.target.value))
                btn.appendChild(count);

                //el.parentNode.firstElementChild.insertBefore(count, el.parentNode.firstElementChild.firstElementChild);
                el.parentNode.appendChild(btn)
                el.parentNode.appendChild(count);
            });

            let hasMod = (slot, mod, value = 0) => Object.entries(randomModifiers.equipment[slot]).reduce((acc, [rMod, val]) => {
                let modCount = getRandomModifierMaxValue(Object.keys(randomModifiers.equipment[slot]).length) - 1; // Guess the tier from number of mods on the item?

                if (rMod != mod)
                    return acc;
                if (Array.isArray(value) && Array.isArray(val) && value[0] != val[0][0] && value[0] != -1) // Wrong skill
                    return acc;
                if (Math.min(modCount, (Array.isArray(value) ? value[1] : value)) > (Array.isArray(val) ? val[0][1] : val)) // Rolled value is too low
                    return acc;
                return true;
            }, false);

            let hasQty = (slot) => equippedItems[slot] > 0 && getItemQtyRandomModifier(equippedItems[slot])[0] > 1;
            let hasGP = (slot) => gp >= getRandomModifierCost(slot) && equippedItems[slot] > 0

            let corruptEquipment = () => {
                equippedItems.forEach((item, slot) => {
                    if (randomModifiers.equipment[slot] == undefined || corruptionRollerSettings[slot] == undefined || corruptionRollerSettings[slot].length == 0 || corruptionRollerCount[slot] == 0)
                        return;

                    let modCount = corruptionRollerSettings[slot].map(([mod, val]) => hasMod(slot, mod, val)).filter(Boolean).length;
                    if (modCount >= Math.min(corruptionRollerCount[slot] || 0, corruptionRollerSettings[slot].length))
                        return;
                    if (hasQty(slot) && hasGP(slot))
                        getEquipmentCorruption(slot)
                })
            };

            setInterval(corruptEquipment, 100);

            let modal = new CorruptionModal();
            [...$('#aprilfools2021-container .block-content > div.row > .col-12')].forEach((el, i) => el.addEventListener('click', () => modal.show(i)))
        }
    }

    function loadScript() {
        if ((window.isLoaded && !window.currentlyCatchingUp) || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) { // Only load script after game has opened
            clearInterval(scriptLoader);
            injectScript(script);
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
})();