// ==UserScript==
// @name        AutoRecipe - Allchemy
// @namespace   https://greasyfork.org/en/users/945115-unmatchedbracket
// @match       https://allchemy.io/guides/*
// @grant       none
// @version     1.2
// @author      Unmatched Bracket
// @run-at      document-start
// @license     Unlicense
// @description Makes following Allchemy recipes much less tedious
// @downloadURL https://update.greasyfork.org/scripts/487307/AutoRecipe%20-%20Allchemy.user.js
// @updateURL https://update.greasyfork.org/scripts/487307/AutoRecipe%20-%20Allchemy.meta.js
// ==/UserScript==

const { fetch: originalFetch } = window;

let namemap = null;

function getItemsFromToast(toast) {
    if (toast.children[0].childNodes[3]?.textContent.replaceAll(" ", "") != "Combine") return null
    let names = [...toast.getElementsByClassName("line-clamp-2")].map(x => x.innerText)
    if (names.length != 2) return null
    let ids = names.map(x => namemap[x])
    if (!ids[0] || !ids[1]) return null
    console.log(names, ids)
    return ids
}

let fetchqueue = []
let fetchActive = false
let lastCombo = null;
let clearTic = 0;

function updateDisplay() {
  requestAnimationFrame(updateDisplay)
  if (autoRecipeStatus) {
    let txt = "AutoRecipe idle"
    if (fetchActive || fetchqueue.length) {
      txt = "AutoRecipe combining; queue of " + fetchqueue.length
    }
    autoRecipeStatus.innerText = txt
  }
}
requestAnimationFrame(updateDisplay)

let autoRecipeStatus;


window.fetch = async (...args) => {
  let [ resource, config ] = args;
  let thisIsAMix = false;

  let ids;
  if (resource == "/api/items" && location.pathname.indexOf("guides") != -1) {
    thisIsAMix = true
    if (fetchqueue.length || fetchActive) {
      await new Promise(r => {fetchqueue.push(r)})
    }
    fetchActive = true
    console.log("a")
    while (!ids || ids == lastCombo) {
      ids = [...document.getElementsByClassName("toast")].map(getItemsFromToast).filter(Boolean)[0]
      await new Promise(r => setTimeout(r, 10))
    }
    console.log("b")
    config.body = JSON.stringify({recipe: ids})
  }

  const response = await originalFetch(resource, config);
  if (thisIsAMix) {
    console.log("c")
    fetchActive = false
    if (fetchqueue.length) {
      let next = fetchqueue.shift()
      setTimeout(next, 100)
    }
    console.log("d")
    let text = await response.text()
    let json = JSON.parse(text)
    console.log("e")
    console.log(json)
    lastCombo = ids.toString()
    namemap[json.item.name] = json.item.id
    response.text = async function () {
      return text
    }
    response.json = async function () {
      return json
    }
    console.log("f")
    clearTic++
    if (clearTic >= 6) {
      document.getElementsByClassName("canvas")[0].getElementsByTagName("button")[0].click()
      clearTic = 0
    }
  }
  return response;
};

(async () => {
  let itemsrq = await fetch("https://allchemy.io/api/users/me/items?after=air&count=999999")
  let itemsjs = await itemsrq.json()
  namemap = {}
  itemsjs.forEach(i => {
    namemap[i.item.name] = i.item.id
  })
  window.namemap = namemap

  // status
  let titleThing = [...document.getElementsByClassName("title")].filter(x => x.innerText.indexOf("Items") != -1)[0]
  titleThing.children[0].style.display = "inline-block"
  let spacer = document.createElement("span")
  spacer.style.width = "5ch"
  spacer.innerText = "•••"
  spacer.style.textAlign = "center"
  spacer.classList.add("text")
  spacer.style.display = "inline-block"
  titleThing.appendChild(spacer)
  autoRecipeStatus = document.createElement("span")
  autoRecipeStatus.innerText = "AutoRecipe idle"
  autoRecipeStatus.classList.add("text")
  titleThing.appendChild(autoRecipeStatus)

  alert("AutoRecipe is ready!\nType something into search and then spam Ctrl-Enter.")
})()


