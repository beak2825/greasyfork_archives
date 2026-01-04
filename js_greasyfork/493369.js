// ==UserScript==
// @name        Allchemy Challenge Mode
// @namespace   https://greasyfork.org/en/users/945115-unmatchedbracket
// @match       https://allchemy.io/*
// @grant       none
// @version     1.3.2
// @author      Unmatched Bracket
// @run-at      document-start
// @license     Unlicense
// @description four random items, good luck
// @downloadURL https://update.greasyfork.org/scripts/493369/Allchemy%20Challenge%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/493369/Allchemy%20Challenge%20Mode.meta.js
// ==/UserScript==

// delete cache
{
  let ohno = "Could not delete Allchemy cache; some items may appear even if you haven't obtained them yet.\n"

  let oldinDB = window.indexedDB
  var request = oldinDB.open("keyval-store-c4");

  request.onsuccess = function(event) {
      // Close the database connection to ensure it can be deleted without being blocked
      request.result.close();

      // Request the deletion of the database
      var deleteRequest = oldinDB.deleteDatabase("keyval-store-c4");

      deleteRequest.onsuccess = function(event) {
          console.debug("Allchemy cache deleted");
      };

      deleteRequest.onerror = function(event) {
          console.error(ohno + "Reason - Delete request errored: ", request.error);
      };

      deleteRequest.onblocked = function(event) {
          console.warn(ohno + "Reason - Delete request blocked");
      };
  };

  request.onerror = function(event) {
      console.error(ohno + "Reason - Open request errored: ", request.error);
  };

  request.onblocked = function(event) {
      console.warn(ohno + "Reason - Open request blocked");
  };

  window.__defineGetter__("indexedDB", ()=>({
    open: function (name) {
      if (name == "keyval-store") {
        name = "keyval-store-c4"
      }
      return oldinDB.open(name)
    }
  }))
}


let c4 = {
  reset: () => {
    let items = [...c4.allItems].sort(() => 0.5 - Math.random())
    let goalItem = items.filter(x => x.depth == c4.config.goalComplexity)[0].item.id
    let startItems = items.filter(x => x.depth == c4.config.startComplexity && x.item.id != goalItem).map(x => x.item.id).slice(0, c4.config.startCount)
    c4.data = {
      start: [...startItems],
      unlocked: [...startItems],
      goal: goalItem
    }
    c4.write()
    localStorage["c4justReset"] = "true"
    if (inited) {
      location.reload()
    }
  },
  write: () => {
    localStorage.c4 = JSON.stringify(c4.data)
    localStorage.c4conf = JSON.stringify(c4.config)
  },
  read: () => {
    try {
      c4.config = JSON.parse(localStorage.c4conf)
    } catch (e) {}
    c4.data = JSON.parse(localStorage.c4)
  },
  data: null,
  config: {
    startComplexity: 2,
    startCount: 5,
    goalComplexity: 5,
  }
}

if (localStorage["c4justReset"] == "true") {
  localStorage.removeItem("c4justReset")
  localStorage.removeItem("pages/index/canvas/v1")
}

window.c4 = c4

let namemap = null;

let initFinish;
let inited = false;
let init = new Promise(r => {initFinish = () => {r(); inited = true}})
window.if = initFinish

const { fetch: originalFetch } = window;

let alreadyGotItems = false

window.fetch = async (...args) => {
  let [ resource, config ] = args;
  let actionType = null;

  let url = new URL(resource.url || resource, window.location)

  let jsonOverride = null
  let overrideOptions = {headers: {"content-type": "application/json"}}

  if (url.pathname == "/api/items") {
    actionType = "mix"
    await init
  } else if (url.pathname == "/api/users/me/items") {
    await init
    if (!alreadyGotItems) {
      jsonOverride = c4.allItems.filter(x => c4.data.unlocked.indexOf(x.item.id) >= 0)
      console.log(jsonOverride)
      alreadyGotItems = true
    } else jsonOverride = []
  }

  if (jsonOverride) {
    return new Response(JSON.stringify(jsonOverride), overrideOptions)
  }

  const response = await originalFetch(resource, config);

  switch (actionType) {
    case "mix":
      let data = await response.json()
      jsonOverride = data
      if (c4.data.unlocked.indexOf(data.item.id) == -1) {
        c4.data.unlocked.push(data.item.id)
        c4.write()
        if (data.item.id == c4.data.goal) {
          let startNames = c4.allItems.filter(x => c4.data.start.indexOf(x.item.id) >= 0).map(x => x.item.name)
          setTimeout(() => alert(`CHALLENGE COMPLETED
You made ${data.item.name} with only ${startNames.slice(0, startNames.length-1).join(", ")} and ${startNames.at(-1)}.
You used ${c4.data.unlocked.length - c4.data.start.length - 1} other items.
Click on the status text for menu and reset`), 0)
        }
      }
      overrideOptions.headers["x-owns-item"] = "true"
      overrideOptions.headers["x-energy-remaining"] = response.headers.get("x-energy-remaining")
  }

  if (jsonOverride) {
    return new Response(JSON.stringify(jsonOverride), overrideOptions)
  }

  return response;
};

function assembleConfig() {
  let tmp = `Current config:\n`
  Object.keys(c4.config).forEach(k => {
    tmp += `${k}: ${c4.config[k]}\n`
  })
  return tmp
}

function config () {
  let originalConf = JSON.stringify(c4.config)
  while (true) {
    let action = prompt(assembleConfig() + `Type, e.g. "startCount=7" to change values or nothing to exit`)
    if (!action) {
      break
    }
    let match = /^([a-zA-Z]+)=([0-9]+)$/.exec(action)
    if (match) {
      if (c4.config[match[1]] === undefined) {
        alert(`Key "${match[1]}" does not exist`)
      } else {
        let num = Number(match[2])
        if (match[1] == "startCount" && num == 0) {
          alert("Cannot set startCount to 0; must start with items")
        } else {
          c4.config[match[1]] = num
          c4.write()
        }
      }
    } else {
      alert(`Invalid command "${action}"`)
    }
  }
  if (JSON.stringify(c4.config) != originalConf) {
    if (confirm("Reset game with new settings?")) {
      c4.reset()
    }
  }
}

(async () => {
  console.log("AllChallenge: fetching all items")
  let itemsrq = await originalFetch("https://allchemy.io/api/users/me/items?after=air&count=999999")
  console.log("AllChallenge: parsing all items")
  let itemsjs = await itemsrq.json()
  console.log("AllChallenge: all items processed")

  c4.allItems = itemsjs

  try {
    c4.read()
  } catch (e) {
    c4.reset()
  }

  try {
    let titleThing = [...document.getElementsByClassName("title")].filter(x => x.innerText.indexOf("Items") != -1)[0]
    titleThing.children[0].style.display = "inline-block"
    let chaltag = document.createElement("span")
    chaltag.style.whiteSpace = "pre"
    let goal = c4.allItems.filter(x => x.item.id == c4.data.goal)[0] || {item: {name: c4.data.goal}}
    console.log("GOAL: ", goal)
    chaltag.innerText = " - Challenge Mode active (goal: " + goal.item.name + ")"
    chaltag.style.textAlign = "center"
    chaltag.classList.add("text")
    chaltag.style.display = "inline-block"
    titleThing.appendChild(chaltag)

    let canv = document.getElementsByClassName("canvas")[0]

    let template = document.createElement("div")
    template.innerHTML = `<button data-v-3ea00591="" class="absolute px-3 py-1 bg-white" style="left:8px;bottom:8px"><div class="text">Challenge</div></button>`
    let button = template.children[0]
    button.onclick = () => {
      let p = prompt(`CHALLENGE MODE
Starter items: ${c4.allItems.filter(x => c4.data.start.indexOf(x.item.id) >= 0).map(x => x.item.name).join(", ")}
Other items unlocked: ${c4.data.unlocked.length - c4.data.start.length}
Type "reset" to reset the challenge
"config" to change config
"import"/"export" to share games`)
      if (p == "reset" && (c4.data.unlocked.indexOf(c4.data.goal) >= 0 || confirm("Really reset?"))) {
        c4.reset()
      } else if (p == "config") {
        config()
      } else if (p == "export") {
        let dat = JSON.parse(JSON.stringify(c4.data))
        delete dat.unlocked
        prompt("Share this game JSON to share a game", JSON.stringify(dat))
      } else if (p == "import") {
        let txt = prompt("Paste the JSON for a game:")
        try {
          let dat = JSON.parse(txt)
          if (!dat) return
          // sanity check
          dat.start.aaaa, dat.goal.aaaa
          dat.unlocked = [...dat.start]
          c4.data = dat
          c4.write()
          localStorage["c4justReset"] = "true"
          location.reload()
        } catch (e) {
          alert("Invalid game. Did you copy the entire JSON, and are you sure this is a game?")
        }
      }
    }
    canv.appendChild(button)
  } catch (e) {}

  initFinish()
})()


