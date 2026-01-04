// ==UserScript==
// @name         eSim BAttle
// @namespace    eSim-BAttle
// @version      a2
// @description  Request Supps directly from the Battle page
// @author       gg
// @match        https://*.e-sim.org/battle.html?id=*
// @icon         https://cdn.discordapp.com/icons/316566483021070356/cfffdee309ec53078e9a9698ec4eef42.png?size=256
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/443377/eSim%20BAttle.user.js
// @updateURL https://update.greasyfork.org/scripts/443377/eSim%20BAttle.meta.js
// ==/UserScript==

/*
Things todo :
- better colors
- fix padding
- update stock after request
- remove console.logs
----
const red = "#B8061C"
$("#optionQ1WEP").css("background-color", "orange")
$("#optionQ1WEP").css("background-color", "darkgreen")
*/

//global
let Q1WEPSTOCK = 0
let Q5WEPSTOCK = 0
let Q5FOODSTOCK = 0
let Q5GIFTSTOCK = 0
let playerId = 0
let citizenId = 0


const delay = ms => new Promise(res => setTimeout(res, ms))

function randomNumber() {
  const n = Math.floor(Math.random() * 6345)
  return n
}

function run() {
  console.log("mustorage")
  $.get("militaryUnitStorage.html", function(data) {
    let recipients = $(data).find(':input.receipments')
    for (let i = 0; i < recipients.length; i++) {
      let muMember = recipients[i]
      if (muMember.value == playerId) {
        console.log(`PlayerID: ${playerId} , citizenId = ${muMember.name}`)
        citizenId = muMember.name
      }
    }


    let storage = $(data).find(".storage")
    storage.each(function(i, item) {
      let storageItem = item.children[0].className
      switch (storageItem) {
        case 'Weapon-1-ammount':
          Q1WEPSTOCK = item.innerText.trim()
          $("#optionQ1WEP").html(Q1WEPSTOCK + "\nQ1 WEAP");
          break;
        case 'Weapon-5-ammount':
          Q5WEPSTOCK = item.innerText.trim();
          $("#optionQ5WEP").html(Q5WEPSTOCK + "\nQ5 WEAP");
          break;
        case 'Gift-5-ammount':
          Q5GIFTSTOCK = item.innerText.trim();
          $("#optionQ5GIFT").html(Q5GIFTSTOCK + "\nQ5 GIFT");
          break;
        case 'Food-5-ammount':
          Q5FOODSTOCK = item.innerText.trim();
          $("#optionQ5FOOD").html(Q5FOODSTOCK + "\nQ5 FOOD");
          break;
      }
    })
  })
}

async function sendSupp(type, quantityInput) {
  const quantityCheck = parseInt(quantityInput)
  console.log(quantityCheck)
  if (isNaN(quantityCheck)) {
    alert("Please enter a number for : " + type)
  } else {
    quantityInput = parseInt(quantityInput)
    switch (type) {
      case 'Weapon-1':
        if (quantityInput > parseInt(Q1WEPSTOCK)) {
          alert("Your MU doesn't have " + quantityInput + " Q1 WEPS. ");
          break;
        } else {
          await changeColor("#optionQ1WEP", "orange")
          await postMuStorage({
            'product': '1-WEAPON',
            'quantity': quantityInput,
            'reason': "",
            [citizenId]: playerId
          })
          await changeColor("#optionQ1WEP", "")
          break;
        }
        break;
      case 'Weapon-5':
        if (quantityInput > parseInt(Q5WEPSTOCK)) {
          alert("Your MU doesn't have " + quantityInput + " Q5 WEPS. ");
          break;
        } else {
          await changeColor("#optionQ5WEP", "orange")
          await postMuStorage({
            'product': '5-WEAPON',
            'quantity': quantityInput,
            'reason': "",
            [citizenId]: playerId
          })
          await changeColor("#optionQ5WEP", "")
          break;
        }
        break;
      case 'Gift-5':
        if (quantityInput > parseInt(Q5GIFTSTOCK)) {
          alert("Your MU doesn't have " + quantityInput + " Q5 GIFT. ");
          break;
        } else {
          await changeColor("#optionQ5GIFT", "orange")
          await postMuStorage({
            'product': '5-GIFT',
            'quantity': quantityInput,
            'reason': "",
            [citizenId]: playerId
          })
          await changeColor("#optionQ5GIFT", "")
          break;
        }
        break;
      case 'Food-5':
        if (quantityInput > parseInt(Q5FOODSTOCK)) {
          alert("Your MU doesn't have " + quantityInput + " Q5 FOOD. ");
          break;
        } else {
          await changeColor("#optionQ5FOOD", "orange")
          await postMuStorage({
            'product': '5-FOOD',
            'quantity': quantityInput,
            'reason': "",
            [citizenId]: playerId
          })
          await changeColor("#optionQ5FOOD", "")
          break;
        }
        break;
    }
  }
}

const postMuStorage = async (form) => {
  await delay(randomNumber())
  $.post(`https://${location.host}/militaryUnitStorage.html`, form, function(data, status) {
    console.log(status)
    console.log(data)
  })
}

const changeColor = async (el, color) => {
  $(el).css("background-color", color)
}

function createContextMenu() {
  const scope = document.querySelector("body");

  const contextMenu = document.createElement("div");
  contextMenu.id = "context-menu";


  let menuOptionRefresh = $("<div id=optionRefresh class='option'>Refresh the Page</div><hr/>")
  let menuOptionWep = $(`<div><div style='display:flex'><p class='option' id='optionQ1WEP'>0\nQ1 WEP</p><p class='option' id='optionQ5WEP'>0\nQ5 WEP</p></div><input autocomplete='off' id='inputQ1WEP' style='height:20px; width:30px;'><input autocomplete='off' id='inputQ5WEP' style='height:20px; width:30px;margin-left:25px;'></div><hr/>`)
  let menuOptionEat = $(`<div><div style='display:flex'><p class='option' id='optionQ5FOOD'>0\nQ5 FOOD</p><p class='option' id='optionQ5GIFT'>0\nQ5 Gift</p></div><input autocomplete='off' id='inputQ5FOOD' style='height:20px; width:30px;'><input autocomplete='off' id='inputQ5GIFT' style='height:20px; width:30px;margin-left:25px;'></div><hr/>`)

  $(contextMenu).append(menuOptionRefresh, menuOptionWep, menuOptionEat)
  $(menuOptionRefresh).on("click", function() {
    window.location.reload(true)
  })

  let location = document.querySelector("#newFightView")
  location.appendChild(contextMenu);

  scope.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const {
      clientX: mouseX,
      clientY: mouseY
    } = event;

    contextMenu.style.top = `${mouseY}px`;
    contextMenu.style.left = `${mouseX}px`;

    contextMenu.classList.add("visible");
    run()
    console.log(Q1WEPSTOCK, Q5WEPSTOCK, Q5FOODSTOCK, Q5GIFTSTOCK)
  });

  scope.addEventListener("click", (e) => {
    if (e.target.offsetParent != contextMenu) {
      contextMenu.classList.remove("visible");
    }
  });

  //ADD EVENTS
  $("#optionQ1WEP").on("click", function() {
    sendSupp("Weapon-1", $("#inputQ1WEP").val())
  });
  $("#optionQ5WEP").on("click", function() {
    sendSupp("Weapon-5", $("#inputQ5WEP").val())
  });
  $("#optionQ5FOOD").on("click", function() {
    sendSupp("Food-5", $("#inputQ5FOOD").val())
  });
  $("#optionQ5GIFT").on("click", function() {
    sendSupp("Gift-5", $("#inputQ5GIFT").val())
  });
}


$(document).ready(function() {
  playerId = $("#userName").attr("href").replace("profile.html?id=", "")
  const style = document.createElement('style');
  style.innerHTML = `html,
        body {
        width: 100%;
        height: 100%;
        font-family: "Open Sans", sans-serif;
        padding: 0;
        margin: 0;
        }
        #context-menu {
        position: fixed;
        z-index: 10000;
        width: 150px;
        background: #1b1a1a;
        border-radius: 5px;
        display: none;
        }
        #context-menu.visible{
            display: block;
        }
        #context-menu .option {
        padding: 8px 10px;
        font-size: 15px;
        color: #eee;
        cursor: pointer;
        border-radius: inherit;
        }

        #context-menu .option:hover {
        background: #343434;
        }`;
  document.body.appendChild(style);
  createContextMenu();
})
