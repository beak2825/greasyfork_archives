// ==UserScript==
// @name         Neopets: Battledome helper
// @author       Tombaugh Regio
// @version      1.0
// @description  Clicks through repetitive menus. Saves default weapons and abilities.
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/dome/arena.phtml
// @match        http://www.neopets.com/dome/fight.phtml
// @match        http://www.neopets.com/dome/neopets.phtml
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/431657/Neopets%3A%20Battledome%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/431657/Neopets%3A%20Battledome%20helper.meta.js
// ==/UserScript==


// ===========================================

const CHALLENGER = {
  // Enter the name of your challenger (Spelling and capitalization matters!)
  name: "Koi Warrior",
  
  // Enter the toughness
  // Green (Average) is 1
  // Orange (Strong) is 2
  // Red (Mighty) is 3
  toughness: 1
}

// ===========================================

function selectEquipment() {
  const ACTIVE = {
    equipment1: "",
    equipment2: "",
    ability: "",
    isEquip1: true
  }

  const equipments = new Array()
  const abilities = new Array()
  let count = 0
  
  function setActiveClass(element, activeElement) {
    if (element == activeElement) {
      element.classList.add("active-for-battle")
      count++
    }
  }
  
  function highlightActiveEquipments() {
    for (const equipment of equipments) {
      equipment.classList.remove("active-for-battle")

      equipment.onclick = function() {
        if (ACTIVE.isEquip1) {
          ACTIVE.equipment1 = equipment
        } else {
          ACTIVE.equipment2 = equipment
        }
        ACTIVE.isEquip1 = !ACTIVE.isEquip1
        
        GM_setValue("battleEquipment", JSON.stringify({
          equipment1: ACTIVE.equipment1.textContent.trim(),
          equipment2: ACTIVE.equipment2.textContent.trim(),
          ability: ACTIVE.ability.querySelectorAll("p")[1].textContent.trim() 
        }))
        
        highlightActiveEquipments()
      }
      
      setActiveClass(equipment, ACTIVE.equipment1)
      setActiveClass(equipment, ACTIVE.equipment2)
    }
    
    if (count == 0) {
      ACTIVE.equipment1 = equipments[0]
      ACTIVE.equipment2 = equipments[1]
      
      highlightActiveEquipments()
    }
  }
  
  function highlightActiveAbility() {
    for (const ability of abilities) {
      ability.classList.remove("active-for-battle")

      ability.onclick = function() {
        ACTIVE.ability = ability
        
        GM_setValue("battleEquipment", JSON.stringify({
          equipment1: ACTIVE.equipment1.textContent.trim(),
          equipment2: ACTIVE.equipment2.textContent.trim(),
          ability: ACTIVE.ability.querySelectorAll("p")[1].textContent.trim() 
        }))
        
        highlightActiveAbility()
      }

      setActiveClass(ability, ACTIVE.ability)
    }
    
    if (count == 0) {
      ACTIVE.ability = abilities[0]
      highlightActiveAbility()
    }
  }
  
  //Get all equipments
  $.each($(".equipFrame"), function(i, equip) {
    const name = equip.textContent.trim()
    if (name.length > 0) equipments.push(equip)
  })

  //Get all abilities
  $.each($(".container"), function(i, ability) {
    if (ability.nextSibling.nextSibling) {
      const nextNode = ability.nextSibling.nextSibling
      if (nextNode.nodeName == "P") abilities.push(ability.parentNode)
    }
  })
  
  //Highlight active equipments and abilities
  highlightActiveEquipments()
  
  count = 0
  highlightActiveAbility()
}

function selectFight() {
  //Choose pet
  window.setTimeout(() => $("#bdFightStep1 .nextStep").click(), 1000)
  
  //Choose 1p or 2p
  window.setTimeout(() => $("#bdFightStep2 .nextStep").click(), 1000)
  
  //Choose challenger & difficulty
  window.setTimeout(() => $(`tr.npcRow:contains(${CHALLENGER.name}) .tough${CHALLENGER.toughness}`).click(), 1000)
}

function refreshBattle() {
  
  //Start battle
  if($("#start").length > 0) {
    window.setTimeout(() => $("#start").click(), 1000)
  }
  
  //Fill in equipment
  if($("#fight").hasClass("inactive")) {  
    const battleEquipment = JSON.parse(GM_getValue("battleEquipment"))
    
    function setEquipment() {
      let count = 0
      
      function getEquipment(equipID) {
        let previousName = ""
        $.each($(".fsmid img:visible"), function(j, image) {
          const name = image.title
          if (name.length > 0) {
            if (name == equipID && name != previousName) image.click()
            previousName = name
            
            count++
          }
        })
      }
            
      //Set equipment 1
      $("#p1e1m").click()
      getEquipment(battleEquipment.equipment1)
      
      //Set equipment 2
      $("#p1e2m").click()
      getEquipment(battleEquipment.equipment2)
      
      //Set ability
      $("#p1am").click()
      $.each($(".fsmid td"), function(j, image) {
        const name = image.title
        if(name == battleEquipment.ability) image.childNodes[0].click()
      })
     
      if (count == 0) window.setTimeout(setEquipment, 1000)
    }
    
    setEquipment()
  }
  
  //Collect items
  if($(".end_ack.collect").length > 0) {
    window.setTimeout(() => $(".end_ack.collect").click(), 100)
  }
  
  //Refresh every 1 second
  window.setTimeout(refreshBattle, 1000)
}

const URL = document.URL

if (URL.includes("neopets.phtml")) selectEquipment()
if (URL.includes("fight.phtml")) selectFight()
if (URL.includes("arena.phtml")) refreshBattle()

GM_addStyle(`
.active-for-battle {
  border: 5px solid #1fe;
}
`)