// ==UserScript==
// @name        Beyonder for dndbeyond.com
// @namespace   Violentmonkey Scripts
// @match       https://www.dndbeyond.com/campaigns/*
// @grant       none
// @grant       GM_addStyle
// @version     1.2
// @author      lumbearjack
// @description Enhanced player character info for DMs.
// @license     GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/470855/Beyonder%20for%20dndbeyondcom.user.js
// @updateURL https://update.greasyfork.org/scripts/470855/Beyonder%20for%20dndbeyondcom.meta.js
// ==/UserScript==

// Custom Styles
const lightColor = 'rgba(255,255,255,1)';
const darkColor = '#111';
var css = `
  
  .beyonder.ddb-campaigns-character-card { height: 100%; }
  .ddb-campaigns-character-card { display: flex; flex-direction: column; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.05)); border: 1px solid #dedede; border-radius: 9px; }
  .ddb-campaigns-character-card::after { display: none; }
  
  .ddb-campaigns-character-card-header { display: flex; order: -1; padding: 10px 10px; position: static; filter: none !important; }
  .ddb-campaigns-character-card-header-cover-image { border-radius: 9px 9px 0 0; overflow: hidden; bottom: 30px; }
  .ddb-campaigns-character-card-header-cover-image::after { backdrop-filter: none; }
  .ddb-campaigns-character-card-header-upper { align-items: center; width: 100%; }
  .ddb-campaigns-character-card-header-upper-portrait { position: relative; }
  .ddb-campaigns-character-card-header-upper-character-info-primary:hover { opacity: 0.8; transition: all .2s ease;}
  .ddb-campaigns-character-card-footer { order: 9999; z-index: 1; background: white; border-radius: 0 0 9px 9px; border: 0; }
  .ddb-campaigns-character-card-footer-links { height: 30px !important; }
  .ddb-campaigns-detail-body-listing-inactive .ddb-campaigns-character-card-header-cover-image { filter: saturate(0); }
  .ddb-campaigns-detail-body-listing-inactive .ddb-campaigns-character-card-header-upper-portrait { filter: saturate(0); }

  .beyonder_container { display: flex; flex-direction: column; grid-gap: 6px; padding: 0 10px 10px; height: 100%; z-index: 1; }
  .beyonder_group { display: flex; grid-gap: 0 3px; }
  .beyonder_group--grid_thirds { display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 0 3px; width: 100%; }
  .beyonder_group--grid_fifths { display: grid; grid-template-columns: repeat(5, 1fr); grid-gap: 0 3px; width: 100%; }
  .beyonder_group--grid_sixths { display: grid; grid-template-columns: repeat(6, 1fr); grid-gap: 0 3px; width: 100%; }
  .beyonder_group--column { display: flex; flex-direction: column; }
  .beyonder_group--nested { display: flex; grid-gap: 0 3px; flex-wrap: wrap; width: 100%; }
  .beyonder_block { display:flex; flex-direction: column; align-items: center; width: 100%; border-radius: 4px; background-color: ${lightColor}; color: ${darkColor}; padding: 2px 3px; }
  .beyonder_block--nested { display: flex; flex-direction: column; text-align: center; flex-grow: 1; }
  .beyonder_header { display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-weight: bold; font-size: 10px; background-color: rgba(0,0,0,0); width: 100%; text-align: center; padding: 1px 0 0;}
  .beyonder_subheader { display: flex; justify-content: center; align-items: center; text-transform: uppercase; font-weight: bold; font-size: 8px; background-color: rgba(0,0,0,0); width: 100%; text-align: center; padding: 1px 0;}
  .beyonder_body_text { font-size: 16px; font-weight: 500; }
  .beyonder_body_text--large { display: flex; text-transform: uppercase; font-weight: 500; font-size: 16px; padding: 0px 6px; align-items: center; justify-content: center; }

  .beyonder_proficient { position: relative; background: #f2faff; outline: 1px solid #00ccff; outline-offset: -1px; color: #004557 }
  .beyonder_proficient:before { content: 'P'; position: absolute; left: 6px; bottom: 2px; font-size: 10px; font-weight: 500; color: #008fb3; opacity: 0.4; }

  .beyonder_expertise { background: #fffdf1; outline: 1px solid gold; outline-offset: -1px; filter: drop-shadow(0px 0px 3px gold); color: #574400; }
  .beyonder_expertise:before { content: 'E'; position: absolute; left: 6px; bottom: 2px; font-size: 10px; font-weight: 500; color: #ae9100; }

  .beyonder_advantage { position: relative; }
  .beyonder_advantage:after { content: 'A'; position: absolute; right: 2px; bottom: 2px; display: flex; height: 11px; width: 11px; background-color: #73c573; border-radius: 50%; font-size: 9px; font-weight: 900; color: white; align-items: center; justify-content: center; }

  .beyonder_proficient--subdued { position: relative; }
  .beyonder_proficient--subdued:before { content: 'P'; position: absolute; left: 4px; bottom: 1.5px; display: flex; font-size: 10px; font-weight: 900; color: #00ccff; }

  .beyonder_expertise--subdued { position: relative; }
  .beyonder_expertise--subdued:before { content: 'E'; position: absolute; left: 4px; bottom: 1.5px; display: flex; font-size: 10px; font-weight: 900; color: gold; }

  .beyonder_tabs { position: absolute; right: 0; bottom: 0; display: flex; flex-direction: column; grid-gap: 3px; background: rgba(255,255,255,0); padding: 0px; border-radius: 11px; color: #aaa; font-size: 10px; font-weight: 500; }
  .beyonder_tabs > .beyonder_tab { padding: 1px 8px; border-radius: 1000px; transition: all 0.3s ease; cursor: pointer; user-select: none; }
  .beyonder_tabs > .beyonder_tab:not(.active):hover { background: rgba(255,255,255,0.3); color: #eee }
  .beyonder_tabs > .beyonder_tab.active { background: rgba(255,255,255,0.6); color: #333 }
  .page:not(.active) { display: none; }
  
  .beyonder_passives .beyonder_block { background: none; color: white; }
  .beyonder_skills_block { flex-direction: row; flex-wrap: wrap; grid-gap: 3px; }
  .beyonder_skills_block > .beyonder_block { width: auto; flex: 1 1 32%; }
  .beyonder_skills_block > .beyonder_block:nth-child(n+1):nth-child(-n+4), .beyonder_skills_block > .beyonder_block:nth-child(n+8):nth-child(-n+11), .beyonder_skills_block > .beyonder_block:nth-child(n+15):nth-child(-n+18) { width: auto; flex: 1 1 calc(100% / 4 - 9px); }
  .beyonder_skills_block .beyonder_header { font-size: 8px; text-align: center; }

  .beyonder_simple_list { flex-wrap: wrap; grid-gap: 3px; }
  .beyonder_simple_list .beyonder_block { flex: 1 1; }
  .beyonder_simple_list .beyonder_block--full { flex: 1 0 100%; }
  .beyonder_simple_list .beyonder_body_text--large { text-transform: none; font-size: 12px; font-weight: 400; text-align: center; }
  `,
  head = document.head || document.getElementsByTagName('head')[0],
  style = document.createElement('style');

  head.appendChild(style);
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
 

// Get data
const ddb_character_api_url = 'https://character-service.dndbeyond.com/character/v5/character/';
const ddb_character_list = 'rpgcharacter-listing'
const ddb_character_list_item = 'ddb-campaigns-character-card';
let characters_ready = false;

waitForKeyElements(`div.${ddb_character_list_item},div.${ddb_character_list}`, Main);

function Main() {
  if (IsCharacterCards()) {
    GetCharacterData();
    return
  }
  console.error("Failed to retrieve character data");
}

function IsCharacterCards() {
  return (document.getElementsByClassName(ddb_character_list_item)[0] != null);
}

function GetCharacterData() {
  if (!characters_ready) {
    const characterCards = document.getElementsByClassName(ddb_character_list_item);

    Array.from(characterCards).forEach(card => {
      
      const characterID = card.getElementsByClassName('ddb-campaigns-character-card-footer-links-item-view')[0].href.split("/")[6];
      const unloadedCharacterViewUrl = card.getElementsByClassName('ddb-campaigns-character-card-header-upper-details-link')[0];
      unloadedCharacterViewUrl.target="_blank" 
      unloadedCharacterViewUrl.rel="noopener noreferrer"
      if (!characterID) {
        return
      }

      let characterData;

      async function getCharacterData() {
        let json;
        const res = await fetch(`${ddb_character_api_url}${characterID}`)
        json = await res.json();
        characterData = json.data

        if (json.success) {
          card.classList.add("beyonder")
          const character_name_el = card.getElementsByClassName('ddb-campaigns-character-card-header-upper-character-info-primary')[0];
          const character_image_el = card.getElementsByClassName('ddb-campaigns-character-card-header-upper-portrait')[0];
          const original_link_el = card.getElementsByClassName('ddb-campaigns-character-card-header-upper-details-link')[0];
          const character_link = card.getElementsByClassName('ddb-campaigns-character-card-footer-links-item-view')[0].getAttribute("href");
          const new_character_link1 = document.createElement('a');
          original_link_el.style = "display: none;";
          character_name_el.style = "position: relative; display: inline-flex;"
          new_character_link1.href = character_link;
          new_character_link1.target="_blank" 
          new_character_link1.rel="noopener noreferrer"
          new_character_link1.style = "position: absolute; top: 0; left: 0; bottom: 0; right: 0;"
          character_name_el.appendChild(new_character_link1)
          const new_character_link2 = document.createElement('a')
          new_character_link2.href = character_link;
          new_character_link2.target="_blank" 
          new_character_link2.rel="noopener noreferrer"
          new_character_link2.style = "position: absolute; top: 0; left: 0; bottom: 0; right: 0;"
          character_image_el.appendChild(new_character_link2)
          card.getElementsByClassName('ddb-campaigns-character-card-footer-links-item-view')[0].target="_blank"
          card.getElementsByClassName('ddb-campaigns-character-card-footer-links-item-view')[0].rel="noopener noreferrer"

          const abilities_list = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma' ]
          const abilities = { 'STR': 'strength', 'DEX': 'dexterity', 'CON': 'constitution', 'INT': 'intelligence', 'WIS': 'wisdom', 'CHA': 'charisma' }
          const strength_skills = ['athletics'];
          const dexterity_skills = ['acrobatics', 'sleight_of_hand', 'stealth'];
          const intelligence_skills = ['arcana','history','investigation','nature','religion'];
          const wisdom_skills = ['animal_handling','insight','medicine','perception','survival'];
          const charisma_skills = ['deception','intimidation','performance','persuasion'];
          const skills = strength_skills.concat(dexterity_skills).concat(intelligence_skills).concat(wisdom_skills).concat(charisma_skills)

          const deriveProficiency = (level) => {
            return level >= 1 && level <= 4 ? 2 :
            level >= 5 && level <= 8 ? 3 :
            level >= 9 && level <= 12 ? 4 :
            level >= 13 && level <= 16 ? 5 :
            level >= 17 && level <= 20 ? 6 : 0
          }

          const charLevel = characterData.classes.reduce((total, obj) => obj.level + total,0)

          let character = {
            test: null,
            name: characterData.name,
            baseHitPoints: characterData.baseHitPoints,
            bonusHitPoints: characterData.bonusHitPoints,
            currentHitPoints: null,
            totalHitPoints: 0,
            armorClass: 10,
            classSave: 0,
            initiative: 0,
            level: charLevel,
            languages: [],
            size: null,
            proficiency: deriveProficiency(charLevel),
            proficiencies: {
              armor: [],
              savingThrows: [],
              skills: [],
              stats: [],
              tools: [],
              weapon: [],
            },
            expertise: {
              skills: [],
              unsorted: []
            },
            resistances: [],
            savingThrows: [],
            savingThrowAdvantages: [],
            skillAdvantages: [],
            speeds: {
              walk: characterData.race.weightSpeeds.normal.walk,
              swim: 0, 
              fly: 0,
              burrow: 0,
              climb: 0,
            },
            vision: {
              dark: 0,
            },
            abilityAdvantages: [],
            stats: {
              strength: {
                bonuses: [],
                bonusScore: null,
                mod: 0,
                set: false,
                setScore: null,
                savingThrow: 0,
                savingThrowBonuses: [],
                score: characterData.stats[0].value,
                baseScore: characterData.stats[0].value,
              },
              dexterity: {
                bonuses: [],
                bonusScore: null,
                mod: 0,
                set: false,
                setScore: null,
                savingThrow: 0,
                savingThrowBonuses: [],
                score: characterData.stats[1].value,
                baseScore: characterData.stats[1].value,
              },
              constitution: {
                bonuses: [],
                bonusScore: null,
                mod: 0,
                set: false,
                setScore: null,
                savingThrow: 0,
                savingThrowBonuses: [],
                score: characterData.stats[2].value,
                baseScore: characterData.stats[2].value,
              },
              intelligence: {
                bonuses: [],
                bonusScore: null,
                mod: 0,
                set: false,
                setScore: null,
                savingThrow: 0,
                savingThrowBonuses: [],
                score: characterData.stats[3].value,
                baseScore: characterData.stats[3].value,
              },
              wisdom: {
                bonuses: [],
                bonusScore: null,
                mod: 0,
                set: false,
                setScore: null,
                savingThrow: 0,
                savingThrowBonuses: [],
                score: characterData.stats[4].value,
                baseScore: characterData.stats[4].value,
              },
              charisma: {
                bonuses: [],
                bonusScore: null,
                mod: 0,
                set: false,
                setScore: null,
                savingThrow: 0,
                savingThrowBonuses: [],
                score: characterData.stats[5].value,
                baseScore: characterData.stats[5].value,
              }
            },
            skills: {
              acrobatics:{
                passive: 10,
                bonus: 0,
              },
              animal_handling:{
                passive: 10,
                bonus: 0,
              },
              arcana:{
                passive: 10,
                bonus: 0,
              },
              athletics:{
                passive: 10,
                bonus: 0,
              },
              deception:{
                passive: 10,
                bonus: 0,
              },
              history:{
                passive: 10,
                bonus: 0,
              },
              insight:{
                passive: 10,
                bonus: 0,
              },
              intimidation:{
                passive: 10,
                bonus: 0,
              },
              investigation:{
                passive: 10,
                bonus: 0,
              },
              medicine:{
                passive: 10,
                bonus: 0,
              },
              nature:{
                passive: 10,
                bonus: 0,
              },
              perception:{
                passive: 10,
                bonus: 0,
              },
              performance:{
                passive: 10,
                bonus: 0,
              },
              persuasion:{
                passive: 10,
                bonus: 0,
              },
              religion:{
                passive: 10,
                bonus: 0,
              },
              sleight_of_hand:{
                passive: 10,
                bonus: 0,
              },
              stealth:{
                passive: 10,
                bonus: 0,
              },
              survival:{
                passive: 10,
                bonus: 0,
              },
            },
            handled: {
              race : [],
              class: [],
              background: [],
              feat: [],
              item: [],
            },
            unhandled: {
              race : [],
              class: [],
              background: [],
              feat: [],
              item: [],
            }
          }

          const deriveModifier = (stat) => {
            return stat === 1 ? -5 :
              stat === 2 ? -4 :
                stat === 3 ? -4 :
                  stat === 4 ? -3 :
                    stat === 5 ? -3 :
                      stat === 6 ? -2 :
                        stat === 7 ? -2 :
                          stat === 8 ? -1 :
                            stat === 9 ? -1 :
                              stat === 10 ? 0 :
                                stat === 11 ? 0 :
                                  stat === 12 ? 1 :
                                    stat === 13 ? 1 :
                                      stat === 14 ? 2 :
                                        stat === 15 ? 2 :
                                          stat === 16 ? 3 :
                                            stat === 17 ? 3 :
                                              stat === 18 ? 4 :
                                                stat === 19 ? 4 :
                                                  stat === 20 ? 5 :
                                                    stat === 21 ? 5 :
                                                      stat === 22 ? 6 :
                                                        stat === 23 ? 6 :
                                                          stat === 24 ? 7 :
                                                            stat === 25 ? 7 :
                                                              stat === 26 ? 8 :
                                                                stat === 27 ? 8 :
                                                                  stat === 28 ? 9 :
                                                                    stat === 29 ? 9 :
                                                                      stat === 30 ? 10 :
                                                                        -5
          }

          let delayedModifiers = [];

          // Modifier loop update
          for (const [type, modifiers] of Object.entries(characterData.modifiers)) {
            modifiers.forEach((mod) => {
              let skillSubType = skills.filter((skill) => mod.subType.split('-').join('_') === skill)[0] || null
              let abilitySubType = abilities_list.filter((skill) => mod.subType.split('-')[0]=== skill)[0] || null

              if (mod.duration) {
                character.unhandled[type].push({ type: mod.type, subType: mod.subType, fixedValue: mod.fixedValue, restriction: mod.restriction , mod: mod}) 
                return
              }

              if (mod.type === 'advantage') {
                if (mod.subType.includes('-ability-checks')) {
                  character.abilityAdvantages.push(abilitySubType)
                } else if (mod.subType.includes('-saving-throws')) {
                  character.savingThrows.push(mod.subType.split('-saving-throws')[0])
                } else if (mod.subType === 'saving-throws' && mod.restriction) {
                  character.savingThrowAdvantages.push(mod.restriction)
                } else if (skillSubType) {
                  character.skillAdvantages.push(mod.subType)
                } else {
                  character.unhandled[type].push({ type: mod.type, subType: mod.subType, fixedValue: mod.fixedValue, restriction: mod.restriction , mod: mod}) 
                  return
                }
              } else if (mod.type === 'bonus') {
                if (mod.subType === 'saving-throws') {
                  abilities_list.forEach((ability) => character.stats[ability].savingThrowBonuses.push({type: type, value: mod.fixedValue }))
                } else if (mod.subType.includes('-score') && !mod.subType.includes('choose-an-ability-score')) {
                  if (abilitySubType) { character.stats[abilitySubType].bonuses.push({type: type, value: mod.fixedValue })}
                } else if (mod.subType === 'hit-points-per-level') {
                  character.bonusHitPoints += mod.fixedValue * character.level
                } else if (mod.subType === 'speed') {
                  character.speeds.walk += mod.fixedValue
                } else if (mod.subType === 'initiative') {
                  character.initiative += mod.fixedValue
                } else if (mod.subType.includes('passive-')) {
                  const skill = mod.subType.split('passive-')[1]
                  character.skills[skill].passive += mod.fixedValue
                } else {
                  character.unhandled[type].push({ type: mod.type, subType: mod.subType, fixedValue: mod.fixedValue, restriction: mod.restriction, mod: mod })
                  return
                }
              } else if (mod.type === 'expertise') {
                skills.forEach((skill) => {
                  if (mod.subType === skill) { character.expertise.skills.push(skill) }
                });
              } else if (mod.type === 'set-base') {
                if (mod.subType === 'darkvision') {
                  character.vision.dark = mod.fixedValue
                } else {
                  character.unhandled[type].push({ type: mod.type, subType: mod.subType, fixedValue: mod.fixedValue, restriction: mod.restriction, mod: mod })
                  return
                }
              } else if (mod.type === 'language') {
                !mod.subType.includes('choose') && character.languages.push(mod.friendlySubtypeName)
              } else if (mod.type === 'resistance') {
                character.resistances.push(mod.friendlySubtypeName)
              } else if (mod.subType === 'saving-throws') {
                character.savingThrows.push(mod)
              } else if (mod.type === 'set'){
                if (mod.subType === 'unarmored-armor-class') {
                  delayedModifiers.push(mod.subType)
                } else if (mod.subType.includes('innate-speed')) {
                  if (mod.subType.includes("swimming")) {
                    character.speeds.swim = characterData.race.weightSpeeds.normal.walk
                  } else if (mod.subType.includes("flying")) {
                    character.speeds.fly = characterData.race.weightSpeeds.normal.walk
                  } else if (mod.subType.includes("burrowing")) {
                    character.speeds.burrow = characterData.race.weightSpeeds.normal.walk
                  } else if (mod.subType.includes("climbing")) {
                    character.speeds.climb = characterData.race.weightSpeeds.normal.walk
                  } else {
                    character.unhandled[type].push({ type: mod.type, subType: mod.subType, fixedValue: mod.fixedValue, restriction: mod.restriction, mod: mod })
                    return
                  }
                } else if (mod.subType === `${abilitySubType}-score`) {
                  character.stats[abilitySubType].setScore = mod.fixedValue
                  character.stats[abilitySubType].set = true
                } else {
                  character.unhandled[type].push({ type: mod.type, subType: mod.subType, fixedValue: mod.fixedValue, restriction: mod.restriction, mod: mod })
                  return
                }
              } else if (mod.type === 'size') {
                character.size = mod.friendlySubtypeName
              } else if (mod.type === 'proficiency') {
                if (mod.subType.includes('-saving-throws')) {
                  character.proficiencies.savingThrows.push(abilitySubType)
                } else if (mod.subType.includes('-armor')) {
                  character.proficiencies.armor.push(mod.friendlySubtypeName)
                } else if (mod.subType === 'shields') {
                  character.proficiencies.armor.push(mod.friendlySubtypeName)
                } else if (mod.subType.includes('-tools')) {
                  !mod.subType.includes('choose') && character.proficiencies.tools.push(mod.friendlySubtypeName)
                } else if (mod.subType === 'unarmored-armor-class') {
                  character.armorClass = 10 + mod.fixedValue;
                } else if (skillSubType) {
                  character.proficiencies.skills.push(skillSubType)
                } else {
                  character.unhandled[type].push({ type: mod.type, subType: mod.subType, fixedValue: mod.fixedValue, restriction: mod.restriction, mod: mod })
                  return
                }
              } else {
                character.unhandled[type].push({ type: mod.type, subType: mod.subType, fixedValue: mod.fixedValue, restriction: mod.restriction, mod: mod })
                return
              }
              character.handled[type].push({type: mod.type, subType: mod.subType, fixedValue: mod.fixedValue, restriction: mod.restriction, mod: mod })
            });
          }
          
          // Build Elements
          const topBlock = document.createElement("div");
          topBlock.classList.add("beyonder_group");
          
          const midBlock = document.createElement("div");
          const statBlock = document.createElement("div");
          midBlock.classList.add("beyonder_group")
          statBlock.classList.add("beyonder_group--grid_sixths")
          midBlock.append(statBlock);
          
          const passiveBlock = document.createElement("div");
          passiveBlock.classList.add("beyonder_group", "beyonder_group--column")

          const addElement = (element, data, header, parent, rider = null, parentModifierClass, selfModifierClass) => {
            const block = document.createElement(element);
            const titleBlock = document.createElement("div");
            const textBlock = document.createElement("div");
            const title = document.createTextNode(header);
            titleBlock.classList.add("beyonder_header")
            titleBlock.appendChild(title);
            block.append(titleBlock)
            if (Array.isArray(data)) {
              const groupBlock = document.createElement("div");
              groupBlock.classList.add("beyonder_group--nested")
              data.forEach((item) => {
                const subBlock = document.createElement("div");
                const subtitleBlock = document.createElement("div");
                const subtextBlock = document.createElement("div");
                const subtitleText = document.createTextNode(item.title)
                const subtextText = document.createTextNode(item.text)
                subtitleBlock.appendChild(subtitleText);
                subtextBlock.appendChild(subtextText);
                subBlock.appendChild(subtitleBlock);
                subBlock.appendChild(subtextBlock);
                subtextBlock.classList.add("beyonder_body_text")
                subtitleBlock.classList.add("beyonder_header", "beyonder_subheader")
                subBlock.classList.add("beyonder_block--nested")
                groupBlock.append(subBlock)
              })
              block.classList.add("beyonder_block");
              block.append(groupBlock)
            } else {
              const text = document.createTextNode(data);
              textBlock.classList.add("beyonder_body_text--large")
              textBlock.appendChild(text);
              block.append(textBlock)
              block.classList.add("beyonder_block");
              if (selfModifierClass) {
                block.classList.add(`beyonder_${selfModifierClass}`)
              }
              if (rider) {
                if (rider.context) {
                  if (rider.context === "fullSkills") {
                    character.proficiencies.skills.forEach((skill) => {
                      if (rider.data === skill) {
                        block.classList.add("beyonder_proficient");
                      }
                    })
                    character.expertise.skills.forEach((skill) => {
                      if (rider.data === skill) {
                        block.classList.add("beyonder_expertise");
                      }
                    })
                    character.skillAdvantages.forEach((skill) => {
                      if (rider.data === skill) {
                        block.classList.add("beyonder_advantage");
                      }
                    })
                      // if (character.skillDisdvantages.includes(skill)) {
                      //   block.classList.add("beyonder_disadvantage");
                      // }
                  }
                }
              }
            }
            if (parentModifierClass) {
              parent.classList.add(`beyonder_${parentModifierClass}`)
            }
            parent.append(block)
          }

          // loop, update ability scores/modifiers/saves
          for (const [key, stat] of Object.entries(abilities)) {
            let score, mod, save;

            // Calculate score adjustment from bonuses
            character.stats[stat].bonuses.forEach(bonus => {
              character.stats[stat].bonusScore += bonus.value
            });

            // Set stat scores and derive modifiers
            if (character.stats[stat].set) {
              score = character.stats[stat].setScore
            } else {
              score = character.stats[stat].baseScore + character.stats[stat].bonusScore
            }
            mod = deriveModifier(score)
            save = mod
            character.stats[stat].mod = mod
            
            // Calculate saving throws
            character.stats[stat].savingThrowBonuses.forEach((bonus) => save += bonus.value )
            character.proficiencies.savingThrows.forEach(saveAbility => {
              saveAbility === stat && (save += character.proficiency)
            });

            const abilityData = [
              {
                title: "SCORE",
                text: score,
              },
              {
                title: "MOD",
                text: mod >= 0 ? `+${mod}` : mod,
              },
              {
                title: "SAVE",
                text: save >= 0 ? `+${save}` : save
              }
            ]

            // add modifiers to skills
            let skills;
            if (stat === 'strength') {
              skills = strength_skills
            } else if (stat === 'dexterity') {
              skills = dexterity_skills
            }  else if (stat === 'intelligence') {
              skills = intelligence_skills
            } else if (stat === 'wisdom') {
              skills = wisdom_skills
            }  else if (stat === 'charisma') {
              skills = charisma_skills
            }
            if (stat != 'constitution') {
              skills.forEach((skill) => {
                character.skills[skill].bonus += mod
                character.skills[skill].passive += mod
              });
            }
            
            addElement("div", abilityData, key, statBlock, null)
          }

          // TO-DO: Recalculate AC, ddbs armor data is unhinged
          // Inventory
          let armorBonusAC = 0;
          let equippedArmor;
          const equippedArmors = characterData.inventory.filter(item => item.equipped && item.definition.armorClass > 0)
          if (equippedArmors.length) {
            const bestArmorIndex = Object.keys(equippedArmors).reduce((a,b) => equippedArmors[a].definition.armorClass > equippedArmors[b].definition.armorClass ? a : b );
            equippedArmor = equippedArmors[bestArmorIndex]
            if (equippedArmor.definition.armorClass > 2 && equippedArmor.definition.grantedModifiers) {
              equippedArmor.definition.grantedModifiers.forEach((mod) => {
                if (mod.type === "bonus" && mod.subType === "armor-class") {
                  armorBonusAC += mod.fixedValue
                }
              });
            }
          }
          const equippedShields = characterData.inventory.filter(item => item.equipped && item.definition.armorClass === 2)
          if (equippedShields.length) {
              armorBonusAC += 2
          }
          if (equippedArmor) {
            character.armorClass = equippedArmor.definition.armorClass + armorBonusAC
          }

          // Adjust skill proficiencies 
          character.proficiencies.skills.forEach((skill) => {
            character.skills[skill].bonus += character.proficiency
            character.skills[skill].passive += character.proficiency
          });
          character.expertise.skills.forEach((skill) => {
            character.skills[skill].bonus += character.proficiency
            character.skills[skill].passive += character.proficiency
          });
          
          // Final Stat / Skills value Adjustments
          character.languages.sort();
          character.resistances.sort();
          character.totalHitPoints = character.baseHitPoints + (character.stats.constitution.mod * character.level) + character.bonusHitPoints;
          character.currentHitPoints = character.totalHitPoints - characterData.removedHitPoints;
          character.initiative += character.stats.dexterity.mod;
          character.armorClass += character.stats.dexterity.mod;
          character.classSave = characterData.classes[0].definition.spellCastingAbilityId > 0 ? character.stats[abilities_list[characterData.classes[0].definition.spellCastingAbilityId - 1]].mod + character.proficiency + 8 : '-'

          characterData.race.racialTraits.forEach((trait) => {
            if (!character.size && trait.definition.name === "Size") {
              let sizeDescription = trait.definition.description
              if (sizeDescription.includes('our size is ')) {
                character.size = sizeDescription.split('our size is ')[1].split('.')[0]
              } else if (sizeDescription.includes('ou are ')) {
                character.size = sizeDescription.split('ou are ')[1].split('.')[0]             
              }
              return
            }
          })

          // Apply delayed modifiers
          delayedModifiers.forEach((mod) => {
            if (mod === "unarmored-armor-class") {
              character.armorClass += character.stats.wisdom.mod
            }
          });

          // Classic Passives
          const passiveGroup = document.createElement("div");
          passiveGroup.classList.add("beyonder_group")
          const passiveScoresShort = [ 
            {score: 'Perception', value: character.skills.perception.passive },
            {score: 'Investigation', value: character.skills.investigation.passive },
            {score: 'Insight', value: character.skills.insight.passive },
           ]
          passiveScoresShort.forEach((passive) => {
            addElement("div", passive.value, passive.score, passiveGroup, null, "passives");
          });

          // Vision
          const visionBlock = document.createElement("div");
          visionBlock.classList.add("beyonder_group")
          const visionBlocks = [ 
            {score: 'Darkvision', value: character.vision.dark > 0 ? `${character.vision.dark} ft.` : '-' },
           ]
           visionBlocks.forEach((vision) => {
            addElement("div", vision.value, vision.score, passiveGroup, null, "vision_block");
          });

           // Skills (Passives + Modifiers)
           const fullSkillsBlock = document.createElement("div");
           fullSkillsBlock.classList.add("beyonder_group")

           for (const [key, value] of Object.entries(character.skills)) {
             addElement("div", `${value.passive} (${value.bonus >= 0 ? `+${value.bonus}` : `${value.bonus}`})`, key.split('_').join(' '), fullSkillsBlock, { context:"fullSkills",data:key },  "skills_block")
           };

           // Misc (Languages, Tools)
           const miscBlock = document.createElement("div");
           miscBlock.classList.add("beyonder_group")
           addElement("div", character.languages.join(', '), "Languages", miscBlock, null, "simple_list")
           character.resistances.length && addElement("div", character.resistances.join(', '), "Resistances", miscBlock, null, "simple_list")
           character.proficiencies.tools.length && addElement("div", character.proficiencies.tools.join(', '), "Tools", miscBlock, null, "simple_list")
           character.savingThrowAdvantages.length && addElement("div", character.savingThrowAdvantages.join(', '), "Advantage on Saving Throws...", miscBlock, null, null, "block--full")
          //  character.savingThrows.length && addElement("div", character.savingThrows.join(', '), "Saving Throws", miscBlock, null, "simple_list")

          // Build main info items
          addElement("div", `${character.initiative >= 0 ? `+${character.initiative}` : `${character.initiative}`}`, "Initiative", topBlock, null)
          addElement("div", character.speeds.walk, "Speed", topBlock, null)
          addElement("div", character.classSave, "Save DC", topBlock, null)
          addElement("div", character.armorClass, "AC", topBlock, null)
          addElement("div", `${character.currentHitPoints}/${character.totalHitPoints}`, "HP", topBlock, null)

          console.log(character.name, characterData, character)

          // page 1
          const cardBodyA = document.createElement("div");
          cardBodyA.classList.add("beyonder_container", "page", "page-1",  "active")
          cardBodyA.setAttribute("page", "page-1");
          card.append(cardBodyA)
          cardBodyA.append(topBlock);
          midBlock.append(statBlock);
          cardBodyA.append(midBlock);
          cardBodyA.append(passiveGroup);

          // page 2
          const cardBodyB = document.createElement("div");
          cardBodyB.classList.add("beyonder_container", "page", "page-2")
          cardBodyB.setAttribute("page", "page-2");
          card.append(cardBodyB)
          cardBodyB.append(fullSkillsBlock);

          // page 3
          const cardBodyC = document.createElement("div");
          cardBodyC.classList.add("beyonder_container", "page", "page-3")
          cardBodyC.setAttribute("page", "page-3");
          card.append(cardBodyC)
          cardBodyC.append(miscBlock);
          
          // Tabs
          const cardTabs = card.getElementsByClassName('ddb-campaigns-character-card-header-upper')[0];
          const toggleTab = (event) => {
            let targetGroup;
            targetGroup = event.shiftKey ? [card] : characterCards;
            const thisPage = event.target.getAttribute('page')

            Array.from(targetGroup).forEach((target) => {
              const pages = target.querySelectorAll(`[page]`);
              const activePages = target.querySelectorAll(`[page=${thisPage}]`);

              Array.from(pages).forEach((page) => {
                page.classList.remove('active')
              })
              Array.from(activePages).forEach((page) => {
                page.classList.add('active')
              })
            })
          }

          const tabsEl = document.createElement("div");
          tabsEl.classList.add("beyonder_tabs")
          
          const tabs = ["Main", "Skills", "Misc"]
          tabs.forEach((tab, i) => {
            const tabEl = document.createElement("div");
            tabEl.appendChild(document.createTextNode(tab))
            i === 0 ? tabEl.classList.add("beyonder_tab", "active") :  tabEl.classList.add("beyonder_tab")
            tabEl.setAttribute("page", `page-${i+1}`);
            tabEl.addEventListener("click", (e) => toggleTab(e));
            tabsEl.append(tabEl)
          })

          cardTabs.append(tabsEl)

          // Header & Footer
          card.style = "display: flex; flex-direction: column;";
        }
      }
      getCharacterData();
    });
  }
  characters_ready = true;
}

//https://github.com/CoeJoder/waitForKeyElements.js
/**
 * A utility function for userscripts that detects and handles AJAXed content.
 *
 * @example
 * waitForKeyElements("div.comments", (element) => {
 *   element.innerHTML = "This text inserted by waitForKeyElements().";
 * });
 *
 * waitForKeyElements(() => {
 *   const iframe = document.querySelector('iframe');
 *   if (iframe) {
 *     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
 *     return iframeDoc.querySelectorAll("div.comments");
 *   }
 *   return null;
 * }, callbackFunc);
 *
 * @param {(string|function)} selectorOrFunction - The selector string or function.
 * @param {function}          callback           - The callback function; takes a single DOM element as parameter.
 *                                                 If returns true, element will be processed again on subsequent iterations.
 * @param {boolean}           [waitOnce=true]    - Whether to stop after the first elements are found.
 * @param {number}            [interval=300]     - The time (ms) to wait between iterations.
 * @param {number}            [maxIntervals=-1]  - The max number of intervals to run (negative number for unlimited).
 */
function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
  if (typeof waitOnce === "undefined") {
      waitOnce = true;
  }
  if (typeof interval === "undefined") {
      interval = 300;
  }
  if (typeof maxIntervals === "undefined") {
      maxIntervals = -1;
  }
  var targetNodes = (typeof selectorOrFunction === "function")
          ? selectorOrFunction()
          : document.querySelectorAll(selectorOrFunction);

  var targetsFound = targetNodes && targetNodes.length > 0;
  if (targetsFound) {
      targetNodes.forEach(function(targetNode) {
          var attrAlreadyFound = "data-userscript-alreadyFound";
          var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
          if (!alreadyFound) {
              var cancelFound = callback(targetNode);
              if (cancelFound) {
                  targetsFound = false;
              }
              else {
                  targetNode.setAttribute(attrAlreadyFound, true);
              }
          }
      });
  }

  if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
      maxIntervals -= 1;
      setTimeout(function() {
          waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
      }, interval);
  }
}