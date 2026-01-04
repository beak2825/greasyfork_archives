// ==UserScript==
// @name         PowerBox4e for Roll20
// @namespace    jackpoll4100
// @version      1.3
// @description  Creates a ui for roll20 that allows for importing dnd 4e character sheets and rolling powers/skills from them.
// @author       jackson pollard
// @match        https://app.roll20.net/editor/
// @match        https://*.discordsays.com/*
// @icon         https://raw.githubusercontent.com/jackpoll4100/PowerBox4e/main/d20.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494440/PowerBox4e%20for%20Roll20.user.js
// @updateURL https://update.greasyfork.org/scripts/494440/PowerBox4e%20for%20Roll20.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function onDOMLoad(){
        let uiContainer = document.createElement('div');
        uiContainer.innerHTML = `
        <div id="powerBoxUI" class="hideUI">
        <div id="charBox" style="display: flex; flex-direction: row; justify-content: space-between;">
            <input id="charName" style="margin: 5px; width: 100%" disabled value="No character found" type="text">
        </div>
        <div class="hideUI" style="padding: 5px; display: flex; flex-direction: column; border-radius: 5px; justify-content: space-between; row-gap: 5px;border:  1px solid;" id="situationalModifiers">
            <div style="display: flex;flex-direction: row;min-width: 100%;justify-content: space-between;">
                Situational Modifiers:
            </div>
            <div style="display: flex;flex-direction: row;min-width: 100%;justify-content: space-between;">
                <input style="width: 50%;" type="text" placeholder="Attack Modifier" id="attackInput" title="Situational Attack Modifier">
                <input style="width: 50%;margin-left:  10px;" type="text" placeholder="Damage Modifier" id="damageInput" title="Situational Damage Modifier">
            </div>
            <div style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">
                <input style="width: 50%;" type="text" placeholder="Skill Modifier" id="skillInput" title="Situational Skill Modifier">
                <input style="width: 50%;margin-left:  10px;" type="text" placeholder="Saving Throw Modifier" id="savingInput" title="Situational Saving Throw Modifier">
            </div>
            <div style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">
                <input style="width: 25%;" type="text" placeholder="AC Mod" id="acInput" title="Situational Armor Class Modifier">
                <input style="width: 25%;margin-left:  10px;" type="text" placeholder="Fort Mod" id="fortInput" title="Situational Fortitude Modifier">
                <input style="width: 25%;margin-left:  10px;" type="text" placeholder="Ref Mod" id="refInput" title="Situational Reflex Modifier">
                <input style="width: 25%;margin-left:  10px;" type="text" placeholder="Will Mod" id="willInput" title="Situational Will Modifier">
            </div>
        </div>
        </div>
        <div class="hideUI" style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;" id="skillActions">
        </div>
        <div class="hideUI" style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;" id="powerActions">
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <input style="margin: 5px; width: 100%;" type="file" id="uploadedFile" />
            <span id="initiativeButton" class="btn" style="
                padding: 2px;
                margin: 5px;
                min-width: 48px;
                border-radius: 5px;
                display: inline-grid;
                align-items: center;
                text-align: center;
                cursor: pointer;"
                class="hideUI">
                    Initiative
            </span>
            <span id="usePower" class="btn" style="
                padding: 3px;
                margin: 5px;
                min-width: 60px;
                border-radius: 5px;
                display: inline-grid;
                align-items: center;
                text-align: center;
                cursor: pointer;"
                class="hideUI">
                    Use Power
            </span>
        </div>`;
        document.getElementById('textchat-input').appendChild(uiContainer);

        // Get the chat button and append the new "hide ui" button
        let cb = document.getElementById('chatSendBtn');
        if (cb){
            cb.outerHTML += '<style>.hideUI{ display: none !important; } .pb-button{ padding-left: 4px !important; padding-right: 1px !important; }</style><button class="btn pb-button" id="pbuiBtn" style="margin-left:  10px;">Power Box <b id="expandoIcon" style="font-size: 0.9em;">◃</b></button>';
            document.getElementById("pbuiBtn").addEventListener("click",function() {
                let box = document.getElementById('powerBoxUI');
                let icon = document.getElementById('expandoIcon');
                icon.innerHTML = icon.innerHTML === '◃' ? '▿' : '◃';
                icon.style = icon.innerHTML === '◃' ? 'font-size: 0.9em;' : 'font-size: 1.3em;';
                document.getElementById('powerBoxUI').classList.toggle('hideUI');
                window.dispatchEvent(new Event('resize'));
            });
        }
        else {
            console.log('PowerBox - Error: could not locate chat button to append content.');
        }

        let actionBox = document.getElementById('powerActions');
        let skillBox = document.getElementById('skillActions');

        let elStyles = 'margin: 5px;';

        //Create and append power ui elements
        let selectList = document.createElement("select");
        selectList.id = 'powerDropdown';
        selectList.style = elStyles + ' width: 75%';
        actionBox.appendChild(selectList);
        let targetsInput = document.createElement("input");
        targetsInput.type = 'number';
        targetsInput.id = 'myTargets';
        targetsInput.placeholder = '# of Targets';
        targetsInput.style = elStyles + ' width: 25%;';
        actionBox.appendChild(targetsInput);

        document.getElementById('initiativeButton').addEventListener('click', function(){
            window.constructInitiativeRoll();
        });

        document.getElementById('usePower').addEventListener('click', function() {
            if (!window?.foundCharacter){
                window.execMacro('Error: No character found. Please import a character first.');
            }
            let powerQuery = document.getElementById('powerDropdown').value;
            powerQuery = powerQuery.split('||');
            let targets = parseInt(document.getElementById('myTargets').value || 1);
            let macro = window.constructMacro(window.powerObject[powerQuery[0]], powerQuery.length > 1 ? window.powerObject[powerQuery[0]]['WeaponMap'][powerQuery[1]] : {}, targets);
            window.execMacro(macro);
            if (window?.powerBoxSettings?.autoCheck && window.frames?.length > 1){
                for (let y = 1; y < window.frames?.length; y++){
                    let w = window.frames[y];
                    for (let x = 1; x < 100; x++){
                        if (w?.document?.querySelector(`[name="attr_power-${ x }-name"]`)?.value?.replaceAll(' ', '')?.toLowerCase() === window.powerObject[powerQuery[0]].Name.replaceAll(' ', '').toLowerCase()){
                            if (w?.document?.querySelectorAll(`[name="attr_power-${ x }-used"]`)?.[0]){
                                w.document.querySelectorAll(`[name="attr_power-${ x }-used"]`)[0].click();
                            }
                        }
                    }
                }
            }
        });

        //Create and append skill ui elements
        let selectSkillList = document.createElement("select");
        selectSkillList.id = 'skillDropdown';
        selectSkillList.style = elStyles + ' width: 45%';
        skillBox.appendChild(selectSkillList);
        let buttonCss = `
                padding: 5px;
                margin: 5px;
                min-width: 70px;
                border-radius: 5px;
                display: inline-grid;
                align-items: center;
                text-align: center;
                cursor: pointer;`;
        skillBox.innerHTML += `<span class="btn" style="${ buttonCss } width: 25%;" id="skillCheckButton">Skill Check</span>
                               <span class="btn" style="${ buttonCss } width: 30%;" id="savingThrowButton">Saving Throw</span>`;
        document.getElementById("skillCheckButton").addEventListener("click",()=>{ window.constructSkillCheck(); });
        document.getElementById("savingThrowButton").addEventListener("click",()=>{ window.constructSavingThrow(); });

        const fileInputElement = document.getElementById('uploadedFile');

        // Improved dice process with 'or' handler and multiple dice matching.
        function processDiceFormula(macroString, weapon){
            // Construct the weapon dice from the first part of the damage formula (if applicable).
            let wDice = window?.foundCharacter?.weaponDiceMap?.[weapon?.Weapon];
            let statMods = window?.foundCharacter?.statMods;
            let reconstructedString = macroString;

            if (statMods){
                let stats = ['Charisma', 'Constitution', 'Dexterity', 'Strength', 'Wisdom', 'Intelligence'];
                for (let stat of stats){
                    for (let stat2 of stats){
                        if (stat !== stat2 && reconstructedString.includes(`${ stat } or ${ stat2 } Modifier`)){
                            reconstructedString = reconstructedString.replaceAll(`${ stat } or ${ stat2 } Modifier`,
                                                                                 statMods[`${ stat } Modifier`] > statMods[`${ stat2 } Modifier`] ? statMods[`${ stat } Modifier`] : statMods[`${ stat2 } Modifier`]);
                        }
                    }
                }
                for (let stat in statMods){
                    reconstructedString = reconstructedString.replaceAll(stat, statMods[stat]);
                }
            }
            let diceFound = reconstructedString.match(/[0-9][0-9]*d[0-9][0-9]*/g);
            if (diceFound?.length){
                let matchedSet = [];
                for (let x = 0; x < diceFound.length; x++){
                    let add = true;
                    for (let y = 0; y < diceFound.length; y++){
                        if (x !== y && diceFound[y] !== diceFound[x] && diceFound[y].includes(diceFound[x])){
                            add = false;
                        }
                    }
                    if (add && !matchedSet.includes(diceFound[x])){
                        matchedSet.push(diceFound[x]);
                    }
                }
                for (let match of matchedSet){
                    reconstructedString = reconstructedString.replaceAll(match, `[[${ match }]]`);
                }
            }
            // Replace weapon dice with expressions.
            for (let x = 1; x < 10; x++){
                reconstructedString = reconstructedString.replaceAll(`${ x }[W]`, `${ x }${ wDice } (Roll: [[${ x }${ wDice }]])`);
            }
            return reconstructedString;
        }

        function execMacro(macro){
            console.log('PowerBox - Executing Macro: ', macro);
            document.querySelectorAll('[title="Text Chat Input"]')[0].value = macro;
            document.getElementById('chatSendBtn').click();
        }

        function constructSkillCheck(){
            let skill = document.getElementById('skillDropdown')?.value;
            let sitBonus = document.getElementById('skillInput')?.value;
            let joiningChar = '+';
            if (sitBonus?.length && ['+','-'].includes(sitBonus[0])){
                joiningChar = '';
            }
            let macro = `&{template:default} {{name=${ skill } Check}} {{result=[[1d20+${ window.foundCharacter.skillMods[skill] }${ sitBonus ? `${ joiningChar }${ sitBonus }` : '' }]]}}`;
            window.execMacro(macro);
        }

        function buildSkillDropdown(){
            let sd = document.getElementById('skillDropdown');
            sd.innerHTML = '';
            let skills = ['Acrobatics','Arcana','Athletics','Bluff','Diplomacy','Dungeoneering','Endurance','Heal','History','Insight','Intimidate','Nature','Perception','Religion','Stealth','Streetwise','Thievery'];

            for (let skill of skills) {
                let option = document.createElement("option");
                option.text = skill;
                option.value = skill;
                sd.appendChild(option);
            }
        }

        function constructSavingThrow(){
            let sitBonus = document.getElementById('savingInput')?.value;
            let joiningChar = '+';
            if (sitBonus?.length && ['+','-'].includes(sitBonus[0])){
                joiningChar = '';
            }
            let macro = `&{template:default} {{name=Saving Throw}} {{result=[[1d20${ sitBonus ? `${ joiningChar }${ sitBonus }` : '' }]]}}`;
            window.execMacro(macro);
        }

        function constructInitiativeRoll(){
            if (!window?.foundCharacter?.initiativeBonus){
                window.execMacro('Error: No initiative bonus found, please import a character first (or reimport your character sheet if it was added in an older version).');
                return;
            }
            let macro = `&{template:default} {{name=Initiative}} {{result=[[1d20+${ window.foundCharacter.initiativeBonus } &{tracker}]]}}`;
            window.execMacro(macro);
        }

        function constructMacro(power, weapon, targets){
            let macro = `&{template:default} {{name=${power.Name}}}`;
            let attributes = ['Flavor','Power','Charge','Display','Channel Divinity','Power Type','Attack','Effect','Aftereffect','Axe','Mace','Heavy Blade','Spear or Polearm','Hit','Miss','Power Usage','Keywords','Action Type','Attack Type','Target','Targets','Requirement','Special','Weapon','Conditions'];
            let processForDice = ['Power','Charge','Channel Divinity','Effect','Aftereffect','Axe','Mace','Heavy Blade','Spear or Polearm','Hit','Miss','Power Usage','Requirement','Special','Weapon','Conditions'];
            for (let att of attributes){
                if (power?.[att]?.replaceAll(' ', '') || weapon?.[att]?.replaceAll(' ', '')){
                    if (processForDice.includes(att)){
                        macro += processDiceFormula(`{{${ att }=${ power[att] || weapon[att] }}}`, weapon);
                    }
                    else {
                        macro += `{{${ att }=${ power[att] || weapon[att] }}}`;
                    }
                }
            }
            if (power['Attack Bonus'] || weapon['Attack Bonus']){
                let sitBonus = document.getElementById('attackInput')?.value;
                let joiningChar = '+';
                if (sitBonus?.length && ['+','-'].includes(sitBonus[0])){
                    joiningChar = '';
                }
                macro += `{{attack=[[1d20+${ power['Attack Bonus'] || weapon['Attack Bonus'] || 0 }${ sitBonus ? `${ joiningChar }${ sitBonus }` : '' }]]}}`;
                for (let x = 1; x < targets; x++){
                    macro += `{{attack ${ x+1 }=[[1d20+${ power['Attack Bonus'] || weapon['Attack Bonus'] || 0 }${ sitBonus ? `${ joiningChar }${ sitBonus }` : '' }]]}}`;
                }
            }
            if (power?.Damage?.replaceAll(' ', '') || weapon?.Damage?.replaceAll(' ', '')){
                let sitBonus = document.getElementById('damageInput')?.value;
                let joiningChar = '+';
                if (sitBonus?.length && ['+','-'].includes(sitBonus[0])){
                    joiningChar = '';
                }
                macro += `{{damage=[[${ power['Damage'] || weapon['Damage'] }${ sitBonus ? `${ joiningChar }${ sitBonus }` : '' }]]}}`;
                if (window?.powerBoxSettings?.multiDamage){
                    for (let x = 1; x < targets; x++){
                        macro += `{{damage ${ x+1 }=[[${ power['Damage'] || weapon['Damage'] }${ sitBonus ? `${ joiningChar }${ sitBonus }` : '' }]]}}`;
                    }
                }
            }
            if (power?.['Crit Damage']?.replaceAll(' ', '') || weapon?.['Crit Damage']?.replaceAll(' ', '')){
                let sitBonus = document.getElementById('damageInput')?.value;
                let joiningChar = '+';
                if (sitBonus?.length && ['+','-'].includes(sitBonus[0])){
                    joiningChar = '';
                }
                macro += `{{Crit Damage=[[${ power['Crit Damage'] || weapon['Crit Damage'] }${ sitBonus ? `${ joiningChar }${ sitBonus.replaceAll('d', '*') }` : '' }]]}}`;
                if (window?.powerBoxSettings?.multiDamage){
                    for (let x = 1; x < targets; x++){
                        macro += `{{Crit Damage ${ x+1 }=[[${ power['Crit Damage'] || weapon['Crit Damage'] }${ sitBonus ? `${ joiningChar }${ sitBonus.replaceAll('d', '*') }` : '' }]]}}`;
                    }
                }
            }
            return macro;
        }

        // Add macro constructor to the window context.
        window.constructMacro = constructMacro;

        // Add skill check constructor to the window context.
        window.constructSkillCheck = constructSkillCheck;

        // Add saving throw constructor to the window context.
        window.constructSavingThrow = constructSavingThrow;

        // Add initiative constructor to the window context.
        window.constructInitiativeRoll = constructInitiativeRoll;

        // Add macro exec to the window context.
        window.execMacro = execMacro;

        function buildPowerDropdown(powersConstruct){
            let pd = document.getElementById('powerDropdown');
            pd.innerHTML = '';
            for (let p of powersConstruct) {
                if (p?.Weapons?.length){
                    for (let w of p?.Weapons){
                        let option = document.createElement("option");
                        option.text = p.Name + ', Weapon: ' + w.Weapon;
                        option.value = p.Name + '||' + w.Weapon;
                        pd.appendChild(option);
                    }
                }
                else{
                    let option = document.createElement("option");
                    option.text = p.Name;
                    option.value = p.Name;
                    pd.appendChild(option);
                }
            }
        }

        function buildCharacter(characterObj){
            window.foundCharacter = characterObj;
            window.powerBoxSettings = JSON.parse(localStorage.getItem('powerBoxSettings')) || { autoCheck: false, multiDamage: false };
            let cBox = document.getElementById('charBox');
            cBox.innerHTML = `
                <input id="charName" style="margin: 5px 5px 5px 5px; width: 74%" disabled value="Character: ${characterObj.name}" type="text">
                <input id="charLevel" style="margin: 5px 5px 5px 5px; width: 26%" disabled value="Level: ${characterObj.level}" type="text">`;
            if (!document.getElementById('settingsRow1')){
                cBox.outerHTML += `
                    <div style="margin-bottom: 5px; padding: 5px; display: flex; flex-direction: column; border-radius: 5px; justify-content: space-between; border:  1px solid; row-gap: 5px;" id="settingsWrapper">
                    <div>Settings:</div>
                    <div id="settingsRow1" style="display: flex; flex-direction: row; justify-content: space-between;">
                        <input type="checkbox" id="autoCheck" title="Check off powers when used (requires character sheet to be open).">
                        <input id="autoCheckLabel" style="margin: 5px 5px 5px 5px; width: 45%" disabled value="Auto Check Powers" type="text" title="Check off powers when used (requires character sheet to be open).">
                        <input type="checkbox" id="multiDamage" title="Roll damage for each target of the chosen power.">
                        <input id="multiDamageLabel" style="margin: 5px 5px 5px 5px; width: 45%; font-size: 0.9em;" title="Roll damage for each target of the chosen power." disabled value="Roll Damage Per Target" type="text">
                    </div>
                    </div>
                `;
            }
            let autoCheckBox = document.getElementById("autoCheck");
            autoCheckBox.checked = window?.powerBoxSettings?.autoCheck ? true : false;
            autoCheckBox.addEventListener("click",function() {
                window.powerBoxSettings.autoCheck = !window.powerBoxSettings.autoCheck;
                localStorage.setItem('powerBoxSettings', JSON.stringify(window.powerBoxSettings));
            });
            let multiDamageBox = document.getElementById("multiDamage");
            multiDamageBox.checked = window?.powerBoxSettings?.multiDamage ? true : false;
            multiDamageBox.addEventListener("click",function() {
                window.powerBoxSettings.multiDamage = !window.powerBoxSettings.multiDamage;
                localStorage.setItem('powerBoxSettings', JSON.stringify(window.powerBoxSettings));
            });
            document.getElementById('powerActions').classList.remove('hideUI');
            document.getElementById('usePower').classList.remove('hideUI');
            document.getElementById('skillActions').classList.remove('hideUI');
            document.getElementById('situationalModifiers').classList.remove('hideUI');
            buildSkillDropdown();
            window.dispatchEvent(new Event('resize'));
        }

        // Check localStorage for an existing character
        let foundCharacter = localStorage.getItem('powerBox');
        if (foundCharacter){
            foundCharacter = JSON.parse(foundCharacter);
            buildCharacter(foundCharacter);
            window.powerObject = foundCharacter.powerObject;
            buildPowerDropdown(foundCharacter.powersConstruct);
        }

        window.dispatchEvent(new Event('resize'));

        // Add event listener to the file input
        fileInputElement.addEventListener('change', (event) => {
            var file = document.getElementById("uploadedFile").files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = function(){
                var parser = new DOMParser();
                var doc = parser.parseFromString(reader.result, "text/xml");
                let name = doc.getElementsByTagName('name')[0].innerHTML;
                let level = doc.getElementsByTagName('Level')[0].innerHTML;
                let experience = doc.getElementsByTagName('Experience')[0].innerHTML;
                let carriedMoney = doc.getElementsByTagName('CarriedMoney')[0].innerHTML;
                let storedMoney = doc.getElementsByTagName('StoredMoney')[0].innerHTML;

                // Construct stat mod array
                let statMods = {};
                let stats = ['Strength', 'Intelligence', 'Wisdom', 'Charisma', 'Constitution', 'Dexterity'];
                for (let stat of stats){
                    statMods[`${ stat } modifier`] = doc.querySelectorAll(`[name="${ stat } modifier"]`)[0].parentElement.getAttribute('value');
                }

                // Construct skill mod array
                let skillMods = {};
                let skills = ['Acrobatics','Arcana','Athletics','Bluff','Diplomacy','Dungeoneering','Endurance','Heal','History','Insight','Intimidate','Nature','Perception','Religion','Stealth','Streetwise','Thievery'];
                for (let skill of skills){
                    skillMods[`${ skill }`] = doc.querySelectorAll(`alias[name="${ skill }"]`)[0].parentElement.getAttribute('value');
                }

                // Construct initiative bonus
                let initiativeBonus = doc.querySelectorAll(`alias[name="Initiative"]`)[0].parentElement.getAttribute('value');

                let weaponDiceMap = {};

                // Construct the power set
                let powers = doc.getElementsByTagName('Power');
                let powersConstruct = [];
                window.powerObject = {};
                for (let x = 0; x < powers.length; x++){
                    console.log('PowerBox - Importing Power: ', powers[x].getAttribute('name'));
                    let tempPower = {
                        Name: powers[x].getAttribute('name')
                    };
                    let specs = powers[x].getElementsByTagName('specific');
                    let weirdFields = ['Aftereffect', 'Axe', 'Mace', 'Heavy Blade', 'Spear or Polearm'];
                    for (let y = 0; y < specs.length; y++){
                        tempPower[specs[y].getAttribute('name')] = specs[y].innerHTML;
                    }
                    for (let field of weirdFields){
                        for (let y = 0; y < specs.length; y++){
                            if (specs[y].getAttribute('name').includes(field)){
                                tempPower[field] = specs[y].innerHTML;
                            }
                        }
                    }
                    let weapons = powers[x].getElementsByTagName('Weapon');
                    tempPower.Weapons = [];
                    tempPower.WeaponMap = {};

                    // Construct the weapon set for each power
                    for (let y = 0; y < weapons.length; y++){
                        let tempWeapon = {};
                        tempWeapon.Weapon = weapons[y].getAttribute('name');
                        tempWeapon['Attack Bonus'] = weapons[y].getElementsByTagName('AttackBonus')[0].innerHTML;
                        tempWeapon.Damage = weapons[y].getElementsByTagName('Damage')[0].innerHTML;
                        let diceNoSpaces = tempWeapon?.Damage?.replaceAll(' ', '');
                        if (diceNoSpaces?.length > 2){
                            if (diceNoSpaces?.length > 3 && diceNoSpaces[3] !== '+'){
                                weaponDiceMap[tempWeapon.Weapon] = `${ diceNoSpaces.slice(1, 4) }`;
                            }
                            else{
                                weaponDiceMap[tempWeapon.Weapon] = `${ diceNoSpaces.slice(1, 3) }`;
                            }
                        }
                        let hasCrit = false;
                        if (weapons[y].getElementsByTagName('CritDamage')?.length){
                            hasCrit = true;
                            tempWeapon['Crit Damage'] = weapons[y].getElementsByTagName('CritDamage')[0].innerHTML;
                        }
                        else {
                            tempWeapon['Crit Damage'] = `${ weapons[y].getElementsByTagName('Damage')[0].innerHTML.replace('d','*') }`;
                        }
                        if (weapons[y].getElementsByTagName('Conditions')?.length){
                            tempWeapon.Conditions = weapons[y].getElementsByTagName('Conditions')[0].innerHTML;
                        }
                        if (weapons[y].getElementsByTagName('CritComponents')?.length){
                            tempWeapon['Crit Components'] = weapons[y].getElementsByTagName('CritComponents')[0].innerHTML;
                        }
                        else {
                            let shortRule = weapons[y].querySelector('RulesElement[type="Magic Item"]')?.getAttribute('internal-id');
                            if (shortRule){
                                let critSet = doc.querySelectorAll(`specific[name="Critical"]`);
                                for (let x of critSet){
                                    if (x?.parentElement?.getAttribute('internal-id') === shortRule){
                                        tempWeapon['Crit Components'] = x.innerHTML;
                                    }
                                }
                            }
                        }
                        function sanitizeCrits(crit, reconstructedString, plus){
                            let finalString = crit.replaceAll(' ', '') || '0';
                            let diceFound = reconstructedString.match(/[0-9][0-9]*d[0-9][0-9]*/g);
                            if (diceFound?.length){
                                let matchedSet = [];
                                for (let x = 0; x < diceFound.length; x++){
                                    let add = true;
                                    for (let y = 0; y < diceFound.length; y++){
                                        if (x !== y && diceFound[y] !== diceFound[x] && diceFound[y].includes(diceFound[x])){
                                            add = false;
                                        }
                                    }
                                    if (add && !matchedSet.includes(diceFound[x])){
                                        matchedSet.push(diceFound[x]);
                                    }
                                }
                                for (let match of matchedSet){
                                    if (reconstructedString.includes('per plus') && plus){
                                        for (let x = 0; x < plus; x++){
                                            finalString += '+' + match;
                                        }
                                    }
                                    else {
                                        finalString += '+' + match;
                                    }
                                }
                            }
                            return finalString;
                        }
                        if (!hasCrit && tempWeapon['Crit Components']){
                            let bonus = parseInt(tempWeapon.Weapon.replace(/\D/g,''));
                            tempWeapon['Crit Damage'] = sanitizeCrits(tempWeapon['Crit Damage'], tempWeapon['Crit Components'], bonus);
                        }
                        tempPower.Weapons.push(tempWeapon);
                        tempPower.WeaponMap[tempWeapon.Weapon] = tempWeapon;
                    }
                    powersConstruct.push(tempPower);
                    window.powerObject[tempPower.Name] = tempPower;

                    // Add Charge power options
                    if (tempPower.Name === 'Melee Basic Attack' || tempPower.Name === 'Bull Rush Attack'){
                        let chargePower = Object.assign({}, tempPower);
                        chargePower.Name = `Charge (${ chargePower.Name })`;
                        chargePower.Flavor = `You throw yourself into the fight, dashing forward and launching an attack. ${ chargePower.Flavor }`;
                        chargePower.Charge = `Move your speed as part of the charge and make an attack at the end of your move. You gain a +1 bonus to the attack roll.`
                        chargePower.Weapons = [];
                        chargePower.WeaponMap = {};
                        for (let wpn of tempPower.Weapons) {
                            let tmp = Object.assign({}, wpn);
                            tmp['Attack Bonus'] = tmp['Attack Bonus'] ? parseInt(tmp['Attack Bonus'])+1 : 1;
                            chargePower.Weapons.push(tmp);
                            chargePower.WeaponMap[tmp.Weapon] = tmp;
                        }
                        powersConstruct.push(chargePower);
                        window.powerObject[chargePower.Name] = chargePower;
                    }
                }

                let magicItems = doc.querySelectorAll('LootTally > loot > RulesElement[type="Magic Item"]');
                if (magicItems?.length){
                    for (let item of magicItems){
                        let flavor = item.querySelector('Flavor');
                        let power = item.querySelector('specific[name="Power"]');
                        let tempPower = {
                            Name: item.getAttribute('name'),
                            Flavor: flavor?.innerHTML || '',
                            Power: power?.innerHTML || ''
                        };
                        if (tempPower?.Power){
                            powersConstruct.push(tempPower);
                            window.powerObject[tempPower.Name] = tempPower;
                        }
                    }
                }

                console.log('PowerBox - Imported ' + powersConstruct.length + ' powers.');

                //Create and append the options
                powersConstruct = powersConstruct.sort((p1, p2)=>{
                    if (p1.Name < p2.Name) {
                        return -1;
                    } else if (p2.Name < p1.Name) {
                        return 1;
                    }
                    return 0;
                });
                let characterObj = {
                    powersConstruct: powersConstruct,
                    powerObject: window.powerObject,
                    name,
                    carriedMoney,
                    storedMoney,
                    experience,
                    level,
                    statMods,
                    skillMods,
                    initiativeBonus,
                    weaponDiceMap
                };
                window.foundCharacter = characterObj;
                buildCharacter(characterObj);
                buildPowerDropdown(powersConstruct);
                localStorage.setItem('powerBox', JSON.stringify(characterObj));
            };
        });
    }
    function timer (){
        if (document.getElementById('chatSendBtn')){
            onDOMLoad();
        }
        else{
            setTimeout(timer, 500);
        }
    }
    setTimeout(timer, 0);
})();

