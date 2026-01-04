// ==UserScript==
// @name        Melvor Equipment Menu
// @namespace   http://tampermonkey.net/
// @version     0.1.5
// @description Adds an equipment menu to equipment slots on Combat page and top bar, forked from Melvor Equipment Menu by NotCorgan#1234
// @author		GMiclotte
// @include		https://melvoridle.com/*
// @include		https://*.melvoridle.com/*
// @exclude		https://melvoridle.com/index.php
// @exclude		https://*.melvoridle.com/index.php
// @exclude		https://wiki.melvoridle.com/*
// @exclude		https://*.wiki.melvoridle.com/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/433162/Melvor%20Equipment%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/433162/Melvor%20Equipment%20Menu.meta.js
// ==/UserScript==

// Made for version 0.22

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

    // Loading script
    function generateTooltip(item, isPassive = false) {
        let itemStat = "";
        if (item.description != undefined)
            itemStat += '<br><span class="text-info">' + item.description + "</span>";
        /*
        for (const spec in item.specialAttacks)
            itemStat += "<br><span class='text-success'>SPECIAL ATTACK<br><span class='text-danger'>" + describeAttack(spec, youNoun, enemyNoun) + "</span></span>";
        */
        /*
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
        */
        return '<div class="text-center"><span class="text-warning">' + item.name + "</span><small class='text-success'>" + itemStat + "</small></div>";
    }

    const showEquipment = function (slot, instance, event) {
        if (game.isGolbinRaid) {
            return;
        }
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

        const possibleEquipment = bank.filter(e => items[e.id].validSlots?.includes(slot));

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
            li.addEventListener('click', function (instance, id, qty, slot, event) {
                player.equipItem(id, player.selectedEquipmentSet, slot, qty);
                instance.hide();
            }.bind(li, instance, possibleEquipment[equip].id, (['Quiver', 'Summon1', 'Summon1'].includes(equippableItem.validSlots[0]) ? possibleEquipment[equip].qty : 1), slot));
            let mainLink = document.createElement('div');
            mainLink.className = 'nav-main-link pointer-enabled';
            mainLink.style.setProperty('font-size', '.6rem', 'important');
            mainLink.style.setProperty('min-height', '1.5rem', 'important');
            mainLink.style.setProperty('padding-top', '.10rem', 'important');
            mainLink.style.setProperty('padding-bottom', '.10rem', 'important');
            tippy(mainLink, {
                content: generateTooltip(equippableItem, slot === 'Passive'),
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
            for (const validSlot in equippableItem.validSlots) {
                if (['Quiver', 'Summon1', 'Summon2'].includes(validSlot)) {
                    mainLink.appendChild(small);
                }
            }
            li.appendChild(mainLink);
            ul.appendChild(li);
        }
        instance.setContent(content);

        instance.show();
    }

    function startEquipmentMenu() {
        for (const slot in equipmentSlotData) {
            const equipmentSlot = document.getElementById(`combat-equipment-slot-${EquipmentSlots[slot]}-0`);
            const equipmentSlotTop = document.getElementById(`combat-equipment-slot-${EquipmentSlots[slot]}-1`);

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
        if (typeof isLoaded !== typeof undefined && isLoaded) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            startEquipmentMenu();
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
});