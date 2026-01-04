// ==UserScript==
// @name         Melvor Equipment Menu
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Adds an equipment menu to equipment slots on Combat page and top bar
// @author       NotCorgan#1234
// @match        https://melvoridle.com/*
// @match        https://www.melvoridle.com/*
// @match        https://test.melvoridle.com/*
// @exclude      https://melvoridle.com/update/*
// @exclude      https://www.melvoridle.com/update/*
// @exclude      https://test.melvoridle.com/update/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/419049/Melvor%20Equipment%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/419049/Melvor%20Equipment%20Menu.meta.js
// ==/UserScript==

// Made for version 0.20

(function () {
    function injectScript(main) {
        var script = document.createElement('script');
        script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(script).parentNode.removeChild(script);
    }

    function script() {
        // Loading script
        let equipmentSlots = Object.assign({ SummonAlt: 13 }, CONSTANTS.equipmentSlot)
        function generateTooltip(item, isPassive=false) {
            let itemStat = "";
            if (item.description != undefined)
                itemStat += '<br><span class="text-info">' + item.description + "</span>";
            if (item.hasSpecialAttack)
                itemStat += "<br><span class='text-success'>SPECIAL ATTACK<br><span class='text-danger'>" + playerSpecialAttacks[item.specialAttackID].name + " (" + playerSpecialAttacks[item.specialAttackID].chance + "%): </span><span class='text-warning'>" + playerSpecialAttacks[item.specialAttackID].description + "</span></span>";
            if (!isPassive) {
                if (item.attackBonus[0] > 0)
                    itemStat += "<br>+" + item.attackBonus[0] + " Melee Stab Bonus";
                if (item.attackBonus[0] < 0)
                    itemStat += '<br><span class="text-danger">' + item.attackBonus[0] + " Melee Stab Bonus</span>";
                if (item.attackBonus[1] > 0)
                    itemStat += "<br>+" + item.attackBonus[1] + " Melee Slash Bonus";
                if (item.attackBonus[1] < 0)
                    itemStat += '<br><span class="text-danger">' + item.attackBonus[1] + " Melee Slash Bonus</span>";
                if (item.attackBonus[2] > 0)
                    itemStat += "<br>+" + item.attackBonus[2] + " Melee Block Bonus";
                if (item.attackBonus[2] < 0)
                    itemStat += '<br><span class="text-danger">' + item.attackBonus[2] + " Melee Block Bonus</span>";
                if (item.strengthBonus != undefined && item.strengthBonus > 0)
                    itemStat += "<br>+" + item.strengthBonus + " Melee Strength Bonus";
                if (item.strengthBonus != undefined && item.strengthBonus < 0)
                    itemStat += '<br><span class="text-danger">' + item.strengthBonus + " Melee Strength Bonus</span>";
                if (item.rangedStrengthBonus != undefined && item.rangedStrengthBonus > 0)
                    itemStat += "<br>+" + item.rangedStrengthBonus + " Ranged Strength Bonus";
                if (item.rangedStrengthBonus != undefined && item.rangedStrengthBonus < 0)
                    itemStat += '<br><span class="text-danger">' + item.rangedStrengthBonus + " Ranged Strength Bonus</span>";
                if (item.defenceBonus != undefined && item.defenceBonus > 0)
                    itemStat += "<br>+" + item.defenceBonus + " Melee Defence Bonus";
                if (item.defenceBonus != undefined && item.defenceBonus < 0)
                    itemStat += '<br><span class="text-danger">' + item.defenceBonus + " Melee Defence Bonus</span>";
                if (item.rangedAttackBonus != undefined && item.rangedAttackBonus > 0)
                    itemStat += "<br>+" + item.rangedAttackBonus + " Ranged Attack Bonus";
                if (item.rangedAttackBonus != undefined && item.rangedAttackBonus < 0)
                    itemStat += '<br><span class="text-danger">' + item.rangedAttackBonus + " Ranged Attack Bonus</span>";
                if (item.rangedDefenceBonus != undefined && item.rangedDefenceBonus > 0)
                    itemStat += "<br>+" + item.rangedDefenceBonus + " Ranged Defence Bonus";
                if (item.rangedDefenceBonus != undefined && item.rangedDefenceBonus < 0)
                    itemStat += '<br><span class="text-danger">' + item.rangedDefenceBonus + " Ranged Defence Bonus</span>";
                if (item.magicAttackBonus != undefined && item.magicAttackBonus > 0)
                    itemStat += "<br>+" + item.magicAttackBonus + " Magic Attack Bonus";
                if (item.magicAttackBonus != undefined && item.magicAttackBonus < 0)
                    itemStat += '<br><span class="text-danger">' + item.magicAttackBonus + " Magic Attack Bonus</span>";
                if (item.magicDefenceBonus != undefined && item.magicDefenceBonus > 0)
                    itemStat += "<br>+" + item.magicDefenceBonus + " Magic Defence Bonus";
                if (item.magicDefenceBonus != undefined && item.magicDefenceBonus < 0)
                    itemStat += '<br><span class="text-danger">' + item.magicDefenceBonus + " Magic Defence Bonus</span>";
                if (item.magicDamageBonus != undefined && item.magicDamageBonus > 0)
                    itemStat += "<br>+" + item.magicDamageBonus + "% Magic Damage Bonus";
                if (item.magicDamageBonus != undefined && item.magicDamageBonus < 0)
                    itemStat += '<br><span class="text-danger">' + item.magicDamageBonus + "% Magic Damage Bonus</span>";
                if (item.damageReduction != undefined && item.damageReduction > 0)
                    itemStat += "<br>+" + item.damageReduction + "% Damage Reduction";
                if (item.damageReduction != undefined && item.damageReduction < 0)
                    itemStat += '<br><span class="text-danger">' + item.damageReduction + "% Damage Reduction</span>";
            }

            return '<div class="text-center"><span class="text-warning">' + item.name + "</span><small class='text-success'>" + itemStat + "</small></div>";
        }

        let showEquipment = function(slot, instance, event) {
            if(isGolbinRaid) return;
            event.preventDefault();

            instance.setProps({
                getReferenceClientRect: () => ({
                    width: 0,
                    height: 0,
                    top: event.clientY,
                    bottom: event.clientY,
                    left: event.clientX,
                    right: event.clientX,
                }),
            });

            let possibleEquipment = bank.filter((e) => items[e.id].equipmentSlot == equipmentSlots[slot])
            if(equipmentSlots[slot] == equipmentSlots.Passive)
                possibleEquipment = bank.filter((e) => items[e.id].isPassiveItem)
            if(equipmentSlots[slot] == equipmentSlots.SummonAlt)
                possibleEquipment = bank.filter((e) => items[e.id].equipmentSlot == equipmentSlots.Summon)

            let content = document.createElement('div');
            content.className = 'content-side';
            content.style.setProperty('padding-top', '.25rem', 'important');
            content.style.setProperty('max-height', '600px');
            content.style.setProperty('overflow-y', 'scroll');
            let ul = document.createElement('div');
            ul.className = 'nav-main text-center';
            ul.style.width = '270px';
            content.appendChild(ul);
            let li = document.createElement('li');
            li.className = 'nav-main-heading';
            $(li).text(slot)
            li.style.setProperty('padding-top', '0', 'important');
            ul.appendChild(li);
            for (let equip = 0; equip < possibleEquipment.length; equip++) {
                let equippableItem = items[possibleEquipment[equip].id]
                let li = document.createElement('li');
                li.className = 'nav-main-item';
                li.addEventListener('click', function(instance, id, qty, slot, event) {
                    equipItem(id, qty, -1, false, (items[id].isPassiveItem && equipmentSlots[slot] == equipmentSlots.Passive ? true : false), equipmentSlots[slot]);
                    instance.hide();
                }.bind(li, instance, possibleEquipment[equip].id, ([equipmentSlots.Quiver, equipmentSlots.Summon, equipmentSlots.SummonAlt].includes(equippableItem.equipmentSlot) ? possibleEquipment[equip].qty : 1), slot));
                let mainLink = document.createElement('div');
                mainLink.className = 'nav-main-link pointer-enabled';
                mainLink.style.setProperty('font-size', '.6rem', 'important');
                mainLink.style.setProperty('min-height', '1.5rem', 'important');
                mainLink.style.setProperty('padding-top', '.10rem', 'important');
                mainLink.style.setProperty('padding-bottom', '.10rem', 'important');
                tippy(mainLink, {
                    content: generateTooltip(equippableItem, equipmentSlots[slot] == equipmentSlots.Passive),
                    allowHTML: true,
                    placement: "right",
                    interactive: false,
                    animation: false,
                });

                let img = document.createElement('img');
                img.className = 'nav-img';
                img.src = equippableItem.media;
                let span = document.createElement('span');
                span.className = 'nav-main-link-name';
                $(span).html(equippableItem.name);
                mainLink.appendChild(img);
                mainLink.appendChild(span);
                let small = document.createElement('small');
                small.className = 'text-warning';
                $(small).text(formatNumber(possibleEquipment[equip].qty))
                if([equipmentSlots.Quiver, equipmentSlots.Summon, equipmentSlots.SummonAlt].includes(equippableItem.equipmentSlot))
                    mainLink.appendChild(small);
                li.appendChild(mainLink);
                ul.appendChild(li);
            }
            instance.setContent(content);

            instance.show();
        }

        for(var slot in equipmentSlots) {
            let equipmentSlot = document.querySelector(`.combat-equipment-slot-${equipmentSlots[slot]}`);
            let equipmentSlotTop = document.querySelector(`.combat-equipment-slot-${equipmentSlots[slot]}-1`);

            let instance = tippy(equipmentSlot, {
                placement: 'right-start',
                trigger: 'manual',
                interactive: true,
                arrow: false,
                allowHTML: true,
                offset: [0, 0],
            });

            let instanceTop = tippy(equipmentSlotTop, {
                placement: 'left-start',
                trigger: 'manual',
                interactive: true,
                arrow: false,
                allowHTML: true,
                offset: [0, 0],
            });

            equipmentSlot.addEventListener('contextmenu', showEquipment.bind(equipmentSlot, slot, instance));
            equipmentSlotTop.addEventListener('contextmenu', showEquipment.bind(equipmentSlotTop, slot, instanceTop));
        }
        console.log('Melvor Equipment Menu Loaded');
    }

    function loadScript() {
        if ((window.isLoaded && !window.currentlyCatchingUp) || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) { // Only load script after game has opened
            clearInterval(scriptLoader);
            injectScript(script);
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
})();