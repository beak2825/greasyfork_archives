// ==UserScript==
// @name        New  - simple-mmo.com
// @namespace   Violentmonkey Scripts
// @match       https://web.simple-mmo.com/*
// @grant       none
/// require https://unpkg.com/ssim.js@^2.0.0
// @version     2.3
// @author      -
// @license     MIT
// @description 1/16/2023, 5:34:14 PM
// @downloadURL https://update.greasyfork.org/scripts/458441/New%20%20-%20simple-mmocom.user.js
// @updateURL https://update.greasyfork.org/scripts/458441/New%20%20-%20simple-mmocom.meta.js
// ==/UserScript==
var tabPressed = false; //press tab to stop the step process
//notyf is a notification library
const gtm =20
document.addEventListener("keydown", function (event) {
  if (event.code === "KeyA") {
    //        event.preventDefault();
    tabPressed = !tabPressed;
    if (tabPressed) {
      notyf.success("Paused")
    } else {
      notyf.success("Activated")
    }
  }
});

document.addEventListener("click", function (event) {
  addOneToCounter()
});

//var cancelUntrustedEvents = () => {
//window.onfocus = (event) => {console.error(event)}
window.onclick = function () {
  return;
}
saveData = (...data) => {
  console.log("prevented ", data, " from being sent") //prevents unwanted tracking data
}
//}

if (typeof notyf == "undefined") { // On different pages, notyf might not be defined, so we're using console as backup
  notyf = console
  notyf.success = notyf.info
  notyf.open = console.log
}

var logVerifTimes = () => {
  var getDateHhMm = () => {
    return (new Date()).getHours() + ":" + (new Date()).getMinutes()
  }
  if (localStorage.getItem("vTimes") == null) {
    localStorage.setItem("vTimes", getDateHhMm())
  } else localStorage.setItem("vTimes", localStorage.getItem("vTimes") + "," + getDateHhMm())
}

var originalFetch = window.fetch;
window.fetch = function (...args) {
  console.log("We're in the fetch rn")
  var shouldPreventRequest = false
  var zeroes = 0
  var requestBody = args[1] && args[1].body
  var targetModification;
  var modifiableArgs = args
  var changesWereMade = false;

  if (!requestBody) {
    return originalFetch.apply(this, args)
  }

  console.log("includes travel: ", args[0].includes("travel"))
  if (args[0] == "https://api.simple-mmo.com/api/travel/perform/f4gl4l3k" || args[0].startsWith("https://api.simple-mmo.com/api/action/travel/")) {
    targetModification = "travel"
    console.log("the request we're trying to change should be a travel one")
  } else if (args[0].includes("/api/quest/") && args[0].includes("gj83h")) {
    targetModification = "quests"
    console.log("the request we're trying to change should be a quests one")
  }

  switch (targetModification) {
    case "travel":
      for (const [key, value] of requestBody) {
        if (value == "true" && key == "s") {
          modifiableArgs[1].body.set("s", "false")
          changesWereMade=true
        }
        if (value == "0" && (key == "d_1" || key == "d_2")) {
          var minX = Number(step_button.getBoundingClientRect().x)
          var minY = Number(step_button.getBoundingClientRect().y)
          if (key == "d_1") {
            modifiableArgs[1].body.set(key, Math.round(minX + (Math.random(69) + Math.random(420) + (Math.random() / 2)) / 2.5 * Number(step_button.getBoundingClientRect().width)))
          } else {
            modifiableArgs[1].body.set(key, Math.round(minY + (Math.random(69) + Math.random(420) + (Math.random() / 2)) / 2.5 * Number(step_button.getBoundingClientRect().height)))
          }
          changesWereMade=true
        }
        try {
          if (modifiableArgs[1].body.get("key") == "0") zeroes++;
          if (modifiableArgs[1].body.get("key") == "NaN") zeroes += 100;
          if (modifiableArgs[1].body.get("key") == "") zeroes += 100
        } catch { }

      }


      break;

    case "quests":
      for (const [key, value] of requestBody) {
        if (key == "s" && value == "1") {
          changesWereMade=true
          modifiableArgs[1].body.set(key, "0")
        } else if ((key == "x" || key == "y") && value == "0") {
          var minX = Number(questButton.getBoundingClientRect().x)
          var minY = Number(questButton.getBoundingClientRect().y)

          if (key == "x") {
            modifiableArgs[1].body.set(key, Math.round(minX + (Math.random(69) + Math.random(420) + (Math.random() / 2)) / 2.5 * Number(questButton.getBoundingClientRect().width)))
          } else {
            modifiableArgs[1].body.set(key, Math.round(minY + (Math.random(69) + Math.random(420) + (Math.random() / 2)) / 2.5 * Number(questButton.getBoundingClientRect().height)))
          }
          changesWereMade=true
        }

        try {
          if (modifiableArgs[1].body.get("key") == "0") zeroes++;
          if (modifiableArgs[1].body.get("key") == "NaN") zeroes += 100;
          if (modifiableArgs[1].body.get("key") == "") zeroes += 100
        } catch { }
      }


      break;

    default:
      console.log("We should not have touched that request?")
      break;

  }





  requestBody = modifiableArgs[1] && modifiableArgs[1].body;

  try {
    if (requestBody.get("s") == "true" || requestBody.get("s") == "1") shouldPreventRequest = true;

  } catch { }
  if (!changesWereMade) {console.warn("no changes made. either the request was legit, or it was ignored")}
  if (shouldPreventRequest || zeroes >= 2) { console.error(modifiableArgs); return notyf.error("ALERT WITH A REQUEST WHERE UNUSUAL PARAMS!! SEE CONSOLE; prev:" + shouldPreventRequest + " zeroes:" + zeroes); }
  // Call the original fetch function for all other requests
  console.log("we reached the end oof fetch")
  return originalFetch.apply(this, modifiableArgs)
}

var getRandomTimeout = function (min) {
  return Math.round(min + (300+gtm) * Math.random())
}

var updateActions = function () {

  var test = [...document.querySelector("[x-html^='travel']").parentElement.querySelectorAll("button")]
  test = test.concat([...document.querySelector("[x-html^='travel']").parentElement.querySelectorAll("[href^='/npcs']")])
    test = test.concat([...document.querySelector("[x-html^='travel']").parentElement.querySelectorAll("[href^='/i-am-not-a-bot']")])

  // var availableActions = Array.prototype.slice.call(document.querySelector("[x-html='travel.text']").parentElement.parentElement.children[1].querySelectorAll(["a"]))
  // var test = availableActions.concat(Array.prototype.slice.call(document.querySelector("[x-html='travel.text']").parentElement.parentElement.children[1].querySelectorAll(["button"])))
  if (test.length != 0) return handleActions(test)
  // if (availableActions.length == 0) {
  //    availableActions = document.querySelector("[x-html='travel.text']").parentElement.parentElement.children[1].querySelectorAll(["button"])
  // }
  // if (availableActions.length != 0) {
  //    handleActions(availableActions)
  // }
}

var handleActions = function (aact) {
  console.log(aact)
  var intz = false
  console.debug("ahndling actions")
  checkForBotVerification()
  aact.forEach((act) => {
    if (intz || tabPressed || act.getAttribute('hbc')) return console.debug("returned early! " + intz + " for " + act.innerText)
    act.setAttribute('hbc', "true")
    if (act.innerText == "Wave") {
      notyf.error("AAAAAAAAAAAAAAAAAAAAAas")
      intz = true
      act.click()
      document.querySelector(".swal2-confirm").click()
      setTimeout(() => {
        document.querySelector(".swal2-confirm").click()
        console.log("clicked ok")
      }, getRandomTimeout(700))
      setTimeout(() => {
        //tabPressed = false
      }, getRandomTimeout(600))
      console.debug("WAved at someone")
    } else if (["Attack", "Mine", "Chop", "Salvage", "Catch", "Grab"].includes(act.innerText) && !document.querySelector("small")) { //
      intz = true;
      //addOneToCounter()
      return act.click()
    } else {
      if (!intz) {
        tabPressed = false;
        notyf.success("Resumed (no interesting actions found)")
      }
    }
    //todel    }
  })
}

var initializeItemHandling = () => {
  return
  var recentItems = []
  var popup = document.querySelector("[x-show=showItemPopup]")
  popup.ontransitionend = () => {

    if (popup._x_isShown) {
      console.log("New item found")
      var waitForItemToBeReadyInterval = setInterval(() => {
        readyItem = popup.querySelector("[x-text='item.name']").innerText
        if (readyItem != "Loading..." && !recentItems.includes(popup.querySelector("[x-text='item.name']").innerText)) {

          recentItems.push(readyItem)
          var equipButton = popup.querySelector("[x-show^='item.equipable && item.yours && !item.currently_equipped && item.level <=']")
          var isAnUpgrade = (!!popup.querySelector("[class*=caret-up]"))

          if (!equipButton.disabled && isAnUpgrade) {
            equipButton.click();
            notyf.success("Better item equipped")

          } else notyf.error(`Item rejected (${(isAnUpgrade) ? "level too high" : "lower effect"})`)
          setTimeout(() => {
            document.elementFromPoint(1, 1).click()
          }, 1000)
        }
      }, 1000)
    }

  }
}

var tryToTriggerItemPopup = () => {
  var item = document.querySelector("[onclick^=retrieveItem]")
  if (item != undefined && !(item.getAttribute('hbc'))) {
    //item.click()
    if (["legendary", "celestial", "exotic"].includes(item.className.split("-")[0])) {
      document.focus();
      var ol = document.title
      document.title += " celestial found"
      setTimeout(() => { document.title = ol }, 5000)

      //tabPressed = true
    }
    console.log("Triggered open item")
    item.setAttribute('hbc', "true")
  }
  return
}

var handleGathering = function () {
  if (document.querySelector("#crafting_button")) {
    var gatherInterval = setInterval(function () {
      if (!crafting_button.disabled) {
        checkForBotVerification()
        if (!tabPressed) {
      //    addOneToCounter()
          crafting_button.click()
          if (crafting_button.innerText.includes("close")) {
            clearInterval(gatherInterval)
          }
        }
      }
    }, getRandomTimeout(220))
  }
}

var handleAttack = () => {
  //if (!(document.hasFocus())) window.focus()//document.focus()
  var attackButton = document.querySelector("div.gap-2:nth-child(2)").querySelectorAll(["button"]).item(0)
  var attackInterval = setInterval(function () {
    console.log((new Date()).getMinutes() + ":" + (new Date()).getSeconds())
    console.log("This is attackbutton:", attackButton, "window is focused:" + document.hasFocus())
    if (!tabPressed) checkForBotVerification()
    if (tabPressed) return
    if ((!attackButton.disabled) && !["0"].includes(document.querySelector("[x-text^='format_number(enemy']").innerText)) {
      console.log("we found attackbutton was not disabled and enemy hp ", document.querySelector("[x-text^='format_number(enemy']").innerText)
      attackButton.click()
    //  addOneToCounter()
    } else if (document.querySelector("div.transform:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h3:nth-child(1)").innerText == "Winner winner chicken dinner!") {
      clearInterval(attackInterval)
      i = 0;
      tryToTriggerItemPopup() //todel.then(() => {
      setTimeout(function () {
        if (document.querySelector(".text-indigo-700")) {
          setTimeout(() => {
            document.querySelector(".text-indigo-700").click()
          }, 300)
        } else
          if (document.querySelector("a.mt-2") && !tabPressed) {
         //   addOneToCounter()
            document.querySelector("a.mt-2").click()}
      }, getRandomTimeout(200))

    } else { }
  }, 700+gtm)
}

var handleQuests = () => {

  if (location.pathname.includes("quests/viewall")) {
    var allQuests = document.querySelectorAll("li.py-4 > div:nth-child(1) > div:nth-child(3) > span")
    var nextUnfinishedQuest = allQuests.item(allQuests.length - 1)
    console.log("Going to next unfinished quest", nextUnfinishedQuest)
    nextUnfinishedQuest.scrollIntoView()
    setTimeout(() => {
      document.elementFromPoint(nextUnfinishedQuest.getBoundingClientRect().x + 1, nextUnfinishedQuest.getBoundingClientRect().y + 1).click()
    }, getRandomTimeout(300))
    // nextUnfinishedQuest.parentElement.parentElement.parentElement.onclick()

  } else if (location.pathname.includes("quests/view/")) {
    var repeatQuestInterval = setInterval(() => {
      console.log("in interval")
      if (tabPressed) return;
      if (checkForBotVerification()) return;
      var maxSuccessChance = document.querySelector("div.divide-y:nth-child(1) > div:nth-child(2) > div:nth-child(2)").innerText.includes("100")
      var questSuccessFull = (document.querySelector(".bg-green-100")) ? ((document.querySelector(".bg-green-100").innerText == "Completed") ? true : false) : false
      var questPoints = document.querySelector('[x-text="$store.quest_points"]').innerText
      if (questPoints != "0" && ((!questSuccessFull && maxSuccessChance) || document.referrer.startsWith("https://web.simple-mmo.com/tasks")) && !tabPressed) {
        if (questButton) {
          questButton.click();
        }
      } else if (questPoints == "0") {
        clearInterval(repeatQuestInterval)
        if (document.referrer.startsWith("https://web.simple-mmo.com/tasks")) history.back()

      } else if (questSuccessFull) {
        history.back()
      }

    }, getRandomTimeout(500+gtm))

  }
}

var checkForBotVerification = () => {
  if (tabPressed) return true;
  var link = [...document.querySelectorAll("[href^='/i-am-not-a-bot']")]
  link = link.filter((el) => el.checkVisibility())[0]
  if (link && link.checkVisibility() && !link.disabled) {
    console.log("need verif!")
    link.disabled = true;
    tabPressed = true
    var verified = false
    notyf.error("Human Verification Required ! (checkForBotVerification)")
    var win = window.open(link.href, '_blank');
    console.log("opened 1st verif window")
    win.onmessage = (msg) => {
      if (msg.data == "verification success") {
        verified = true
        win.close()
        if (document.querySelector("div.mt-4:nth-child(1) > button:nth-child(1)")) document.querySelector("div.mt-4:nth-child(1) > button:nth-child(1)").click()
        tabPressed = false

        // link.remove()
        return false
      }
    }
    win.focus()

    var redoInterval = setInterval(() => {
      if (!tabPressed) win.focus()
      if (!win.onmessage) {
        win.onmessage = (msg) => {
          if (msg.data == "verification success") {
            console.log("received completion")
            verified = true
            win.close()
            if (document.querySelector("div.mt-4:nth-child(1) > button:nth-child(1)")) document.querySelector("div.mt-4:nth-child(1) > button:nth-child(1)").click()
            tabPressed = false
            link.remove()
            return false
          }
        }

      }
      console.log("checking for win")
      if (win.closed && !verified) {
        notyf.error("Not completed !! Complete the verification process.")
        return win = window.open(link.href, '_blank')
      } else if (verified) {
        clearInterval(redoInterval);
        win.close()
        return false
      }
    }, 3000)

  } else {
    console.log("no need for verification found")
    return false
  }
}

var handleItemFunctions = () => {

  if (localStorage.getItem("itemMode") == null) {
    localStorage.setItem("itemMode", "")
  }
  var itemMode;
  var itemsData = {}
  var showItemModeElement = document.querySelector("div.mt-4:nth-child(3) > div:nth-child(1) > div:nth-child(1)")

  //set up buttons
  var setUpButtons = () => {
    var btnActions = ["", "Equip", "Collect", "Sell"]
    var buttons = {}
    btnActions.forEach((act) => {
      buttons[act] = document.createElement('button')
      buttons[act].setAttribute("class", ((localStorage.getItem("itemMode").includes(act)) ? "bg-green-50" : "bg-red-50") + " inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500")
      buttons[act].innerText = ((act == "") ? "Reset" : act);
      buttons[act].onclick = () => {
        if (act == "") {
          return localStorage.setItem("itemMode", "")
        }
        if (localStorage.getItem("itemMode").includes(act)) {
          buttons[act].setAttribute("class", buttons[act].getAttribute("class").replace("bg-green-50", 'bg-red-50'))
          console.log("we should have disabled " + act)
          localStorage.setItem("itemMode", localStorage.getItem("itemMode").replace(act, ""))
        } else {
          console.log("we should have enabled " + act)
          buttons[act].setAttribute("class", buttons[act].getAttribute("class").replace("bg-red-50", 'bg-green-50'))
          localStorage.setItem("itemMode", localStorage.getItem("itemMode") + act)
        }
      }
      showItemModeElement.parentElement.append(buttons[act])
    })

  }
  setUpButtons()

  setInterval(() => {
    if (itemMode != localStorage.getItem("itemMode")) { //reset if mode changes
      itemMode = localStorage.getItem("itemMode")
      showItemModeElement.innerText = "Mode: " + itemMode;
      document.querySelectorAll("tr[id^=item-]").forEach((item) => {
        item.hidden = false
        item.querySelector("#option-menu-button").onclick = () => { }
        item.bgColor = ""
      })

    }


    if (itemMode.includes("Equip")) {
      betterItems = document.querySelectorAll("[class*=caret-up]")
      betterItems.forEach((item) => {
        item.parentElement.parentElement.bgColor = "006400"
      })
    }

    if (itemMode.includes("Collect")) {
      if (document.querySelector(".swal2-input")) {
        if (document.querySelector(".swal2-confirm").innerText.includes("collection")) {
          document.querySelector(".swal2-confirm").click()
        }
      }
      allNotCollected = document.querySelectorAll("tr[id^=item-]")
      allNotCollected.forEach((col) => {
        if (col.innerHTML.includes("Use") || col.querySelector("svg[stroke-width]") || col.innerHTML.includes("Craft") || (col.querySelector("svg[stroke-width]") && col.querySelector("[id$=qty]").innerText == "1")) {
          col.hidden = true;
        } else {
          col.querySelector("#option-menu-button").onclick = () => {
            col.querySelector("div:nth-child(1) > a:nth-child(7)").click()
          }
          col.bgColor = "4b2f36"
        }
      })
    }

    if (itemMode.includes("Sell")) {

      if (document.querySelector(".sm\\:max-w-xl")._x_isShown && document.querySelector(".text-lg").innerText != "Loading...") { //watch item lower prices
        var inspectItemBtn = document.querySelector("div.my-4:nth-child(1) > a:nth-child(1)")
        var id = inspectItemBtn.pathname.split("/")[3]
        var op = document.querySelector("dl.grid-cols-1 > div:nth-child(1) > dd:nth-child(2) > span:nth-child(2)").innerText.split(" ")[0]
        itemsData[id] = ((Number(op.replaceAll(",", "")) * (1 - 0.095)) * 0.1).toFixed() * 10;
        console.log("set price:", itemsData[id])
      }

      var allItems = document.querySelectorAll("tr[id^=item-]")

      allItems.forEach((item) => {
        if (!item.querySelector("svg[stroke-width]") && item.querySelector("[id$=qty]").innerText == "1") {
          item.hidden = true;
        }
        item.querySelector("#option-menu-button").onclick = () => {
          item.querySelector("[onclick*=marketSellItem]").click()
          var sellableNumber = item.querySelector("[id$=qty]").innerText
          document.querySelector("#swal-input1").value = (sellableNumber <= 20) ? sellableNumber : 20;


          setTimeout(() => {
            var id = document.querySelector("#swal2-content").children[0].id.split("-")[2];
            if (!document.querySelector("#swal-input2").oninput) {
              document.querySelector("#swal-input2").oninput = () => {
                setTimeout(() => { itemsData[id] = document.querySelector("#swal-input2").value.replace(",", "") }, 30)
              }
            }

            document.querySelector("#swal-input2").value = (itemsData[id]) ? numberWithCommas(itemsData[id]) : ""
          }, 50)

        }

      })

    }
  }, 100)

}

var numberWithCommas = nwc

var findText = () => {
  var textList = [
    "You wonder where all the falling leaves are coming from.",
    "You wonder why the leaves that are falling all look the same.",
    "You begin to wonder how autumn leaves keep falling even though it's spring.",
    "A falling leaf lands perfectly in your mouth. Yum!",
    "You wonder where the falling leaves have gone..."
  ]
  if (textList.includes(document.querySelector('.travel-text').innerText)) {
    if (!tabPressed) {
      console.log("ça marche")
      tabPressed = true
      sendDMessage("Text Find")
    }
  }
}

var addOneToCounter = () => {
  notyf.open({message:"Added one to counter"})
  if (localStorage.getItem("rQty") == null || isNaN(localStorage.getItem("rQty"))) {
    localStorage.setItem("rQty", 0)
  } else localStorage.setItem("rQty", Number(localStorage.getItem("rQty")) +1)

}

var resetCounter = () => {
  localStorage.setItem("rQty", 0)
}

//DO NOT SHARE

var sendDMessage = (msg) => {
  var id = (document.querySelector("[href*=collection]").href.split("/")[4] == '956121') ? "532967505438965780" : "271671703967367169";

  var request = new XMLHttpRequest();
  request.open("POST", "https://discord.com/api/webhooks/1066492275808538654/eFYeRFYhc1wBo1ASY4uQv_uQ-Nu3F79D9pzB9g7Hfga5DIMukTXixRD5kHAjKIp3veJ7");

  request.setRequestHeader('Content-type', 'application/json');

  var params = {
    username: "SMMO Verification",
    avatar_url: "https://cdn.discordapp.com/icons/444067492013408266/3c4255d6a4eb6b15f8dba75f3245b8fe.webp?size=96",
    content: `<@${id}> ${msg}`
  }

  request.send(JSON.stringify(params));
}

if (document.querySelector("#step_button")) { //on step page
  initializeItemHandling()
  setInterval(function () {
    // findText();
    if (!step_button.disabled && !tabPressed) {
      //addOneToCounter()
      step_button.click()
    }
  }, getRandomTimeout(200)) //200
  setInterval(function () {
    if (!tabPressed) {
      updateActions();
      tryToTriggerItemPopup();
    }
  }, getRandomTimeout(421))
} else if (location.pathname.includes("npcs/attack")) { //on attack (npcs only)
  initializeItemHandling()
  handleAttack()

} else if (location.pathname.includes("gather")) {
  handleGathering()
} else if (location.pathname.includes("i-am-not-a-bot")) {
  setTimeout(() => {
    if (document.querySelector(".bg-green-50")) window.postMessage("verification success")
  }, 500)

  window.addEventListener("load", function () {



    bih = JSON.parse(localStorage.getItem('rQtyHistory'))
	bih.push(localStorage.getItem('rQty'))
	 localStorage.setItem('rQtyHistory', JSON.stringify(bih))
    resetCounter()

    var f = document.body;
    var i = 0;
    var interv = setInterval(function () {
      f.style.display = (f.style.display == 'none' ? '' : 'none');
      i++;
      if (i > 7) {
        clearInterval(interv)
      }
    }, 40);
  }, false);

  document.addEventListener('load', sendDMessage("you need to get verified ! https://web.simple-mmo.com/i-am-not-a-bot"))

  logVerifTimes()
  var i = 0;
  setInterval(() => {

    if (document.querySelector(".bg-green-50") || document.querySelector("[class='swal2-success-ring']")?.checkVisibility() && !tabPressed) {
      //sendDMessage(" Verification complete.")
      console.log("sending a success")
      window.postMessage("verification success")
      setTimeout(() => { tabPressed = true }, 5000)

    }
  }, 500)
} else if (location.pathname.includes("quests")) {
  handleQuests()
} else if (location.pathname.includes("inventory/items")) {
  handleItemFunctions()
} else if(location.href.includes("inventory/storage")){
  var filterRarity=document.querySelector('.xs\\:grid-cols-2 > div:nth-child(4) > div:nth-child(2) > div:nth-child(1)').children
    var nbmats=0;
    for(let i=0;i<document.querySelectorAll('[id^="item-"][id$="-qty"]').length;i++){
      if(document.querySelectorAll('[id^="item-"][id$="-block"]')[i].innerText.includes("radable")){
        nbmats += parseInt(document.querySelectorAll('[id^="item-"][id$="-qty"]')[i].innerText)
      }
    if(nbmats!=0 && filterRarity.length!=1){
      var rarity="";
      for(let i=1;i<filterRarity.length;i++){
        rarity+=filterRarity[i].innerText
      }
      var Name="New "+rarity+"mats = "+nbmats
      document.querySelector("div.mt-4:nth-child(3) > div:nth-child(1)").innerText=Name
    }
  }
}



else if (location.pathname.includes("item-dump")) {
  initializeItemHandling()
  setInterval(() => {
    tryToTriggerItemPopup()
  }, 500)

} else if (location.pathname.includes("/crafting/menu")) {
  setInterval(() => {
    var sum = 0;
    var cont = document.querySelector("div.dark\\:bg-gray-800:nth-child(2) > div:nth-child(1)")
    if (!cont) return;
    for (i = 0; i < cont.childElementCount; i++) {
      var material = cont.children[i]
      sum += Number(material.innerText.match("[0-9]*")[0])
    }
    document.querySelector("div.sm\\:px-4:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)").innerText = "What materials do you want to use? You have " + sum


  }, 200)
} else if (location.pathname.includes("/worldboss/attack/")) {
  var test = setInterval(() => { if (document.querySelector("#attackButton").innerText == "Attack" && !document.querySelector("#attackButton").disabled && !tabPressed) { console.log("auto attack on"); document.querySelector("#attackButton").click() } }, getRandomTimeout(130034))
} else if (location.pathname.includes('/user/view/')) {
  document.addEventListener("keydown", function (event) {
    console.log("event.target.type?.includes(\"text\") is ", event.target.type?.includes("text"))

    if (event.code === "KeyW" && !event.target.type?.includes("text")) {
      //        event.preventDefault();
      var uid = location.pathname.split("/")[3]
      waveToUser(uid)
      document.querySelector(".swal2-confirm").click()
    }
  });



} else if (location.pathname.includes('market/listings')) {
  addBan = (item) => {
    item=item.trim()
  bi = JSON.parse(localStorage.getItem('bannedItems'))
	bi.push(item)
	 localStorage.setItem('bannedItems', JSON.stringify(bi))
console.log("ok")
}

  removeBan = (item) => {

    item=item.trim()
  bi = JSON.parse(localStorage.getItem('bannedItems'))
    if (bi.findIndex((ind) => ind == item)>=0) {
	bi.pop(bi.findIndex((ind) => ind == item))
	 localStorage.setItem('bannedItems', JSON.stringify(bi))
console.log("ok")

    }
}
   test = document.querySelectorAll("span[id^=item-id]")
  bannedItems = JSON.parse(localStorage.getItem('bannedItems'))
  test.forEach((it) => {
  if (bannedItems.includes(it.innerText)) {
    it.parentElement.parentElement.parentElement.parentElement.parentElement.setAttribute("hidden","true")
  }
})

}
  /*boss
 *
 * var test = setInterval(()=> {if(document.querySelector("#attackButton").innerText == "Attack" && !document.querySelector("#attackButton").disabled){document.querySelector("#attackButton").click()}},getRandomTimeout(1234))
 */