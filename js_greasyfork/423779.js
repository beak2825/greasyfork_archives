// ==UserScript==
// @name         Melvor Bank Menu
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Adds a menu to bank items and modifies tooltips to include item stats
// @author       NotCorgan#1234
// @match        https://melvoridle.com/*
// @match        https://www.melvoridle.com/*
// @match        https://test.melvoridle.com/*
// @exclude      https://melvoridle.com/update/*
// @exclude      https://www.melvoridle.com/update/*
// @exclude      https://test.melvoridle.com/update/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/423779/Melvor%20Bank%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/423779/Melvor%20Bank%20Menu.meta.js
// ==/UserScript==

// Made for version 0.19.1

(function () {
    function injectScript(main) {
        var script = document.createElement('script');
        script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(script).parentNode.removeChild(script);
    }

    function script() {
        // Loading script
        let addMenuItem = function(title, el, cb, instance, shouldHide) {
            let li = document.createElement('li');
            li.className = 'nav-main-item';
            li.addEventListener('click', function(instance, cb, shouldHide = true, event) {
                instance.shouldHide = shouldHide;
                cb.call(li, event);
                instance.hide();
            }.bind(li, instance, cb, shouldHide));

            let mainLink = document.createElement('div');
            mainLink.className = 'nav-main-link pointer-enabled';
            mainLink.style.setProperty('font-size', '.6rem', 'important');
            mainLink.style.setProperty('min-height', '1.5rem', 'important');
            mainLink.style.setProperty('padding-top', '.10rem', 'important');
            mainLink.style.setProperty('padding-bottom', '.10rem', 'important');

            let span = document.createElement('span');
            span.className = 'nav-main-link-name';
            $(span).html(title);
            mainLink.appendChild(span);

            li.appendChild(mainLink);
            el.appendChild(li);
            return li;
        }

        let showMenu = function(id, instance, event) {
            selectBankItem(id);
            let item = items[id];
            event.preventDefault();

            instance.setProps({
                interactive: true,
                getReferenceClientRect: () => ({
                    width: 0,
                    height: 0,
                    top: event.clientY,
                    bottom: event.clientY,
                    left: event.clientX,
                    right: event.clientX,
                }),
            });

            let content = document.createElement('div');
            content.className = 'content-side';
            content.style.setProperty('padding-top', '.25rem', 'important');
            content.style.setProperty('text-align', 'center', 'important');
            let ul = document.createElement('div');
            ul.className = 'nav-main';
            ul.style.width = '225px';
            content.appendChild(ul);
            let li = document.createElement('li');
            li.className = 'nav-main-heading';
            $(li).html(item.name);
            li.style.setProperty('padding-top', '0', 'important');

            ul.appendChild(li);

            if(item.equipmentSlot !== undefined) {
                let li = addMenuItem('Equip Item', ul, function(id, event) { equipItem(id, (items[id].equipmentSlot == CONSTANTS.equipmentSlot.Quiver ? bank[getBankId(id)].qty : 1), -1); }.bind(null, id), instance);

                let small = document.createElement('small');
                small.style.setProperty('position', 'absolute');
                small.style.setProperty('right', '0');
                small.style.setProperty('top', '0');

                let btn = document.createElement('button');
                btn.className = 'btn m-1 btn-success';
                btn.style.setProperty('margin', '0.05rem 0.1rem', 'important');
                btn.style.setProperty('padding', '0.15rem 0.35rem', 'important');
                btn.style.setProperty('font-size', '.6rem', 'important');
                btn.style.setProperty('min-height', '1rem', 'important');
                btn.appendChild(document.createTextNode('1'));
                btn.addEventListener('click', function(instance, event) {
                    instance.shouldHide = true;
                    equipItem(id, 1, 0);
                    instance.hide();
                    event.stopPropagation();
                    return false;
                }.bind(li, instance), true)
                small.appendChild(btn);

                if (playerModifiers.increasedEquipmentSets >= 1) {
                    btn = document.createElement('button');
                    btn.className = 'btn m-1 btn-success';
                    btn.style.setProperty('margin', '0.05rem 0.1rem', 'important');
                    btn.style.setProperty('padding', '0.15rem 0.35rem', 'important');
                    btn.style.setProperty('font-size', '.6rem', 'important');
                    btn.style.setProperty('min-height', '1rem', 'important');
                    btn.appendChild(document.createTextNode('2'));
                    btn.addEventListener('click', function(instance, event) {
                        instance.shouldHide = true;
                        equipItem(id, 1, 1);
                        instance.hide();
                        event.stopPropagation();
                        return false;
                    }.bind(li, instance), true)
                    small.appendChild(btn);
                }

                if (playerModifiers.increasedEquipmentSets >= 2) {
                    btn = document.createElement('button');
                    btn.className = 'btn m-1 btn-success';
                    btn.style.setProperty('margin', '0.05rem 0.1rem', 'important');
                    btn.style.setProperty('padding', '0.15rem 0.35rem', 'important');
                    btn.style.setProperty('font-size', '.6rem', 'important');
                    btn.style.setProperty('min-height', '1rem', 'important');
                    btn.appendChild(document.createTextNode('3'));
                    btn.addEventListener('click', function(instance, event) {
                        instance.shouldHide = true;
                        equipItem(id, 1, 2);
                        instance.hide();
                        event.stopPropagation();
                        return false;
                    }.bind(li, instance), true)
                    small.appendChild(btn);
                }

                li.firstChild.firstChild.appendChild(small);
            }
            if(item.equipmentSlot !== undefined && items[id].isPassiveItem) {
                let li = addMenuItem('Equip Passive', ul, function(id, event) { equipItem(id, 1, -1, false, true); }.bind(null, id), instance);

                let small = document.createElement('small');
                small.style.setProperty('position', 'absolute');
                small.style.setProperty('right', '0');
                small.style.setProperty('top', '0');

                let btn = document.createElement('button');
                btn.className = 'btn m-1 btn-success';
                btn.style.setProperty('margin', '0.05rem 0.1rem', 'important');
                btn.style.setProperty('padding', '0.15rem 0.35rem', 'important');
                btn.style.setProperty('font-size', '.6rem', 'important');
                btn.style.setProperty('min-height', '1rem', 'important');
                btn.appendChild(document.createTextNode('1'));
                btn.addEventListener('click', function(instance, event) {
                    instance.shouldHide = true;
                    equipItem(id, 1, 0, false, true);
                    instance.hide();
                    event.stopPropagation();
                    return false;
                }.bind(li, instance), true)
                small.appendChild(btn);

                if (equipmentSetCount >= 1) {
                    btn = document.createElement('button');
                    btn.className = 'btn m-1 btn-success';
                    btn.style.setProperty('margin', '0.05rem 0.1rem', 'important');
                    btn.style.setProperty('padding', '0.15rem 0.35rem', 'important');
                    btn.style.setProperty('font-size', '.6rem', 'important');
                    btn.style.setProperty('min-height', '1rem', 'important');
                    btn.appendChild(document.createTextNode('2'));
                    btn.addEventListener('click', function(instance, event) {
                        instance.shouldHide = true;
                        equipItem(id, 1, 1, false, true);
                        instance.hide();
                        event.stopPropagation();
                        return false;
                    }.bind(li, instance), true)
                    small.appendChild(btn);
                }

                if (equipmentSetCount >= 2) {
                    btn = document.createElement('button');
                    btn.className = 'btn m-1 btn-success';
                    btn.style.setProperty('margin', '0.05rem 0.1rem', 'important');
                    btn.style.setProperty('padding', '0.15rem 0.35rem', 'important');
                    btn.style.setProperty('font-size', '.6rem', 'important');
                    btn.style.setProperty('min-height', '1rem', 'important');
                    btn.appendChild(document.createTextNode('3'));
                    btn.addEventListener('click', function(instance, event) {
                        instance.shouldHide = true;
                        equipItem(id, 1, 2, false, true);
                        instance.hide();
                        event.stopPropagation();
                        return false;
                    }.bind(li, instance), true)
                    small.appendChild(btn);
                }

                li.firstChild.firstChild.appendChild(small);
            }
            if(item.equipmentSlot !== undefined)
                addMenuItem('View Item Stats', ul, function(event) { viewItemStats(-1); }, instance)

            if (item.canUpgrade) {
                let li = addMenuItem('Upgrade', ul,  function(event) { upgradeItem(); }, instance);

                let upgradeItemID = items[id].trimmedItemID;
                let upgradeCheck = [];
                for (let i = 0; i < items[upgradeItemID].itemsRequired.length; i++) {
                    upgradeCheck.push(true);
                    let checkBankForItem = getBankId(items[upgradeItemID].itemsRequired[i][0]);
                    if (checkBankForItem >= 0 && bank[checkBankForItem] !== undefined) {
                        if (bank[checkBankForItem].qty < items[upgradeItemID].itemsRequired[i][1]) {
                            upgradeCheck[i] = false;
                        }
                    } else
                        upgradeCheck[i] = false;
                }

                let gpCost = items[upgradeItemID].trimmedGPCost;
                if(gp < gpCost)
                    upgradeCheck.push(false);

                if (items[upgradeItemID].isPotion) {
                    let masteryID = items[upgradeItemID].masteryID[1];
                    if (getMasteryLevel(CONSTANTS.skill.Herblore, masteryID) < masteryTiers[items[upgradeItemID].potionTier]) {
                        upgradeCheck.push(false);
                    }
                }

                if(upgradeCheck.includes(false)) {
                    li.firstChild.firstChild.classList.add('text-danger');
                } else {
                    let small = document.createElement('small');
                    small.style.setProperty('position', 'absolute');
                    small.style.setProperty('right', '0');
                    small.style.setProperty('top', '0');

                    let btn = document.createElement('button');
                    btn.className = 'btn m-1 btn-success';
                    btn.style.setProperty('margin', '0.05rem 0.1rem', 'important');
                    btn.style.setProperty('padding', '0.15rem 0.35rem', 'important');
                    btn.style.setProperty('font-size', '.6rem', 'important');
                    btn.style.setProperty('min-height', '1rem', 'important');
                    btn.appendChild(document.createTextNode('1'));
                    btn.addEventListener('click', function(id, upgradeItemID, instance, event) {
                        instance.shouldHide = true;
                        confirmUpgradeItem(id, upgradeItemID);
                        instance.hide();
                        event.stopPropagation();
                        return false;
                    }.bind(li, id, upgradeItemID, instance), true)
                    small.appendChild(btn);

                    btn = document.createElement('button');
                    btn.className = 'btn m-1 btn-success';
                    btn.style.setProperty('margin', '0.05rem 0.1rem', 'important');
                    btn.style.setProperty('padding', '0.15rem 0.35rem', 'important');
                    btn.style.setProperty('font-size', '.6rem', 'important');
                    btn.style.setProperty('min-height', '1rem', 'important');
                    btn.appendChild(document.createTextNode('All'));
                    btn.addEventListener('click', function(id, upgradeItemID, instance, event) {
                        instance.shouldHide = true;
                        confirmUpgradeItemAll(id, upgradeItemID);
                        instance.hide();
                        event.stopPropagation();
                        return false;
                    }.bind(li, id, upgradeItemID, instance), true)
                    small.appendChild(btn);

                    li.firstChild.firstChild.appendChild(small);
                }
            }

            if (item.canOpen) {
                addMenuItem('View Contents', ul,  function(event) { viewItemContents(); }, instance);
                addMenuItem('Open All', ul,  function(id, event) { openItemQty = bank[getBankId(id)].qty; openBankItem(); }.bind(window, id), instance);
            }

            if (item.prayerPoints !== undefined)
                addMenuItem('Bury All', ul,  function(id, event) { buryItemQty = bank[getBankId(id)].qty; buryItem(); }.bind(window, id), instance);

            if (item.isToken)
                addMenuItem('Claim All', ul,  function(id, event) {
                    claimTokenQty = bank[getBankId(id)].qty;
                    if(id === CONSTANTS.item.Bank_Slot_Token) {
                        claimBankToken();
                    } else {
                        claimToken();
                    }
                }.bind(window, id), instance);

            if (item.canRead)
                addMenuItem('Read', ul,  function(event) { readItem(id) }.bind(window, id), instance);

            if (item.healsFor !== undefined)
                addMenuItem('Equip All', ul,  function(id, event) { equipFoodQty = bank[getBankId(id)].qty; equipFood(); }.bind(window, id), instance);



            addMenuItem('Toggle Lock', ul, function(instance, event) {
                lockItem();
                let li = instance.popper.querySelector('.sell-all');

                let bankID = getBankId(selectedBankItem);
                if (bank[bankID].locked) {
                    li.firstChild.firstChild.classList.add('text-danger');
                } else {
                    li.firstChild.firstChild.classList.remove('text-danger');
                }
            }.bind(window, instance), instance, false)

            li = addMenuItem('Sell All -1', ul,  function(id, event) {
                let bankID = getBankId(selectedBankItem);
                if (!bank[bankID].locked) {
                    updateSellQty(1)
                    sellItem();
                }
            }.bind(window, id), instance);
            li.classList.add('sell-all');

            let small = document.createElement('small');
            small.style.setProperty('position', 'absolute');
            small.style.setProperty('right', '0');
            small.style.setProperty('top', '0');

            let btn = document.createElement('button');
            btn.className = 'btn m-1 btn-success';
            btn.style.setProperty('margin', '0.05rem 0.1rem', 'important');
            btn.style.setProperty('padding', '0.15rem 0.35rem', 'important');
            btn.style.setProperty('font-size', '.6rem', 'important');
            btn.style.setProperty('min-height', '1rem', 'important');
            btn.appendChild(document.createTextNode('All'));
            btn.addEventListener('click', function(id, instance, event) {
                instance.shouldHide = true;
                let bankID = getBankId(selectedBankItem);
                if (!bank[bankID].locked) {
                    updateSellQty(0)
                    sellItem();
                }
                instance.hide();
                event.stopPropagation();
                return false;
            }.bind(li, id, instance), true)
            small.appendChild(btn);

            li.firstChild.firstChild.appendChild(small);

            if (bank[getBankId(selectedBankItem)].locked)
                li.firstChild.firstChild.classList.add('text-danger');

            instance.setContent(content);

            instance.show();
        }

        let bankTips = [];
        setInterval(function() {
            let bankItems = document.querySelectorAll('.bank-item');
            bankItems.forEach((item) => {
                let id = parseInt(item.id.split('-')[3]);
                let instance = bankTips[id];
                if(instance) {
                    if (instance.reference !== item) {
                        instance.destroy();
                        instance = false;
                    }
                }
                if(!instance) {
                    instance = tippy(item, {
                        placement: 'right-start',
                        trigger: 'manual',
                        interactive: true,
                        arrow: false,
                        allowHTML: true,
                        sticky: true,
                        onHide(instance) {
                            if(instance.shouldHide === true) {
                                instance.shouldHide = false;
                                return true;
                            } else {
                                return false
                            }
                        },
                        onClickOutside(instance) {
                            instance.shouldHide = true;
                        }
                    });
                    bankTips[id] = instance;
                    item.addEventListener('contextmenu', showMenu.bind(item, id, instance));
                }
            });
        }, 1000)

        let tooltips = [];

        let generateTooltip = function(bankItemID) {
            let itemDesc = [];
            let itemStat = [];
            let item = items[bankItemID];
            if (item.isPotion)
                itemDesc.push("<small class='text-warning'>" + item.potionCharges + " Potion Charges</small>");
            if (item.description !== undefined)
                itemDesc.push("<small class='text-info'>" + item.description + "</small>");
            if (item.hasSpecialAttack)
                itemDesc.push("<small class='text-success'>SPECIAL ATTACK<br><span class='text-danger'>" + playerSpecialAttacks[item.specialAttackID].name + " (" + playerSpecialAttacks[item.specialAttackID].chance + "%): </span><span class='text-warning'>" + playerSpecialAttacks[item.specialAttackID].description + "</span></small>");
            if(item.equipmentSlot !== undefined) {
                if (item.attackBonus[0] > 0)
                    itemStat.push('<span class="text-success">+' + item.attackBonus[0] + " Melee Stab Bonus</span>");
                if (item.attackBonus[0] < 0)
                    itemStat.push('<span class="text-danger">' + item.attackBonus[0] + " Melee Stab Bonus</span>");
                if (item.attackBonus[1] > 0)
                    itemStat.push('<span class="text-success">+' + item.attackBonus[1] + " Melee Slash Bonus</span>");
                if (item.attackBonus[1] < 0)
                    itemStat.push('<span class="text-danger">' + item.attackBonus[1] + " Melee Slash Bonus</span>");
                if (item.attackBonus[2] > 0)
                    itemStat.push('<span class="text-success">+' + item.attackBonus[2] + " Melee Block Bonus</span>");
                if (item.attackBonus[2] < 0)
                    itemStat.push('<span class="text-danger">' + item.attackBonus[2] + " Melee Block Bonus</span>");
                if (item.strengthBonus != undefined && item.strengthBonus > 0)
                    itemStat.push('<span class="text-success">+' + item.strengthBonus + " Melee Strength Bonus</span>");
                if (item.strengthBonus != undefined && item.strengthBonus < 0)
                    itemStat.push('<span class="text-danger">' + item.strengthBonus + " Melee Strength Bonus</span>");
                if (item.rangedStrengthBonus != undefined && item.rangedStrengthBonus > 0)
                    itemStat.push('<span class="text-success">+' + item.rangedStrengthBonus + " Ranged Strength Bonus</span>");
                if (item.rangedStrengthBonus != undefined && item.rangedStrengthBonus < 0)
                    itemStat.push('<span class="text-danger">' + item.rangedStrengthBonus + " Ranged Strength Bonus</span>");
                if (item.defenceBonus != undefined && item.defenceBonus > 0)
                    itemStat.push('<span class="text-success">+' + item.defenceBonus + " Melee Defence Bonus</span>");
                if (item.defenceBonus != undefined && item.defenceBonus < 0)
                    itemStat.push('<span class="text-danger">' + item.defenceBonus + " Melee Defence Bonus</span>");
                if (item.rangedAttackBonus != undefined && item.rangedAttackBonus > 0)
                    itemStat.push('<span class="text-success">+' + item.rangedAttackBonus + " Ranged Attack Bonus</span>");
                if (item.rangedAttackBonus != undefined && item.rangedAttackBonus < 0)
                    itemStat.push('<span class="text-danger">' + item.rangedAttackBonus + " Ranged Attack Bonus</span>");
                if (item.rangedDefenceBonus != undefined && item.rangedDefenceBonus > 0)
                    itemStat.push('<span class="text-success">+' + item.rangedDefenceBonus + " Ranged Defence Bonus</span>");
                if (item.rangedDefenceBonus != undefined && item.rangedDefenceBonus < 0)
                    itemStat.push('<span class="text-danger">' + item.rangedDefenceBonus + " Ranged Defence Bonus</span>");
                if (item.magicAttackBonus != undefined && item.magicAttackBonus > 0)
                    itemStat.push('<span class="text-success">+' + item.magicAttackBonus + " Magic Attack Bonus</span>");
                if (item.magicAttackBonus != undefined && item.magicAttackBonus < 0)
                    itemStat.push('<span class="text-danger">' + item.magicAttackBonus + " Magic Attack Bonus</span>");
                if (item.magicDefenceBonus != undefined && item.magicDefenceBonus > 0)
                    itemStat.push('<span class="text-success">+' + item.magicDefenceBonus + " Magic Defence Bonus</span>");
                if (item.magicDefenceBonus != undefined && item.magicDefenceBonus < 0)
                    itemStat.push('<span class="text-danger">' + item.magicDefenceBonus + " Magic Defence Bonus</span>");
                if (item.magicDamageBonus != undefined && item.magicDamageBonus > 0)
                    itemStat.push('<span class="text-success">+' + item.magicDamageBonus + "% Magic Damage Bonus</span>");
                if (item.magicDamageBonus != undefined && item.magicDamageBonus < 0)
                    itemStat.push('<span class="text-danger">' + item.magicDamageBonus + "% Magic Damage Bonus</span>");
                if (item.damageReduction != undefined && item.damageReduction > 0)
                    itemStat.push('<span class="text-success">+' + item.damageReduction + "% Damage Reduction</span>");
                if (item.damageReduction != undefined && item.damageReduction < 0)
                    itemStat.push('<span class="text-danger">' + item.damageReduction + "% Damage Reduction</span>");
                if(itemStat.length > 0)
                    itemDesc.push("<small>" + itemStat.join("</br>") + "</small>");
            }
            itemDesc.push("<img class='skill-icon-xs' src='" + CDNDIR + "assets/media/main/coins.svg'> " + item.sellsFor);

            if (item.canEat)
                itemDesc[itemDesc.length-1] += "<img class='skill-icon-xs ml-2' src='" + CDNDIR + "assets/media/skills/hitpoints/hitpoints.svg'><span class='text-success'>+" + getFoodHealValue(bankItemID) + "</span>";

            if (item.isPassiveItem !== undefined) {
                if (item.isPassiveItem && dungeonCompleteCount[CONSTANTS.dungeon.Into_the_Mist] > 0)
                    itemDesc.push('<small class="text-success">Passive Slot Compatible</small>');
            }
            itemDesc = itemDesc.join("</br>");
            let bankTooltip = "<div class='text-center'><div class='media d-flex align-items-center push'><div class='mr-3'><img class='bank-img m-1' src='" + getItemMedia(bankItemID) + "'></div><div class='media-body'><div class='font-w600'>" + item.name + "</div>" + itemDesc + "</div></div></div>";


            const tInstance = tippy("#bank-item-button-" + bankItemID, {
                content: bankTooltip,
                placement: "top",
                allowHTML: true,
                interactive: false,
                animation: false,
                touch: "hold",
                hideOnClick: false
            });
            tooltipInstances.bank = tooltipInstances.bank.concat(tInstance);
        }

        let updateBankTooltips = function() {
            let diff = tooltipInstances.bank.filter(x => !tooltips.includes(x))
            diff.forEach((instance) => {
                let id = parseInt(instance.reference.id.split('-')[3]);
                instance.destroy();
                generateTooltip(id);
            });
            tooltips = tooltipInstances.bank;
        }

        let __createBankItem = createBankItem;
        createBankItem = function() {
            __createBankItem.apply(window, arguments);
            updateBankTooltips();
        }
        updateBankTooltips();

        console.log('Melvor Bank Menu Loaded');
    }

    function loadScript() {
        if ((window.isLoaded && !window.currentlyCatchingUp) || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) { // Only load script after game has opened
            clearInterval(scriptLoader);
            injectScript(script);
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
})();