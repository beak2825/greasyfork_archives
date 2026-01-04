// ==UserScript==
// @name         WSIS Vote Script
// @namespace    http://yu.net/
// @version      2024-03-31
// @description  Auto Vote
// @author       Yu
// @match        https://www.itu.int/net4/wsis/stocktaking/Prizes/2024/Vote*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itu.int
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490337/WSIS%20Vote%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/490337/WSIS%20Vote%20Script.meta.js
// ==/UserScript==


async function vote() {
  await GM_setValue("autoVote", true)
  const data = {
      "Category 1 ": "17077462885438574",
      "Category 2 ": "17065007250257807",
      "Category 3 ": 1,
      "Category 4 ": "17065083018468123",
      "Category 5 ": 1,
      "Category 6 ": 1,
      "Category 7 ": 1,
      "Category 8 ": "17066979367120074",
      "Category 9 ": "17050574167544732",
      "Category 10 ": "17067199147248683",
      "Category 11 ": "17062673590252220",
      "Category 12 ": 1,
      "Category 13 ": 1,
      "Category 14 ": 1,
      "Category 15 ": "17011474035654711",
      "Category 16 ": "17079901693552076",
      "Category 17 ": "17061523848923839",
      "Category 18 ": 1,
  }

  await new Promise(res => setTimeout(res, parseInt(Math.floor((Math.random() * 5) * 1000))))

  const title = document.querySelector("h4");
  const id = Object.entries(data).filter(([key, value]) => title.innerText.includes(key))
  if(id.length === 0) {
      await GM_setValue("autoVote", false)
      alert("Data tidak ditemukan")
  } else {
      if(id[0][1] === 1) {
          const button = document.querySelector(`form#setWsisStatusForm button`);
          if(button) {
              button.scrollIntoView({ behavior: "smooth" })
              button.click()
          } else {
              await GM_setValue("autoVote", false)
              alert("Button tidak ditemukan")
              console.log(id)
          }
      } else {
          const button = document.querySelector(`button[value='${id[0][1]}']`);
          if(button) {
              button.scrollIntoView({ behavior: "smooth" })
              button.click()
          } else {
              await GM_setValue("autoVote", false)
              alert("Button tidak ditemukan")
              console.log(id)
          }
      }
  }
}

(async function() {
  'use strict';

  const isAuto = await GM_getValue("autoVote")
  if(isAuto) {
      GM_registerMenuCommand("Turn Off", async () => {
          await GM_setValue("autoVote", false)
          document.location.reload();
      })
      vote()
  } else {
      GM_registerMenuCommand("Turn On", vote, "v")
  }
})();