// ==UserScript==
// @name         plants VS 僵尸
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  自动开箱,3分钟跑一次
// @author       er567、cosatr
// @license      MIT
// @match        https://www.plantmaster.club/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plantmaster.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466422/plants%20VS%20%E5%83%B5%E5%B0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/466422/plants%20VS%20%E5%83%B5%E5%B0%B8.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // Your code here...
  let sunflowerIds = []
  let plantIds = [752, 786, 794, 799]
  let openData = []

  const gameWins = (options) => {
    options.map((it, index) => {
      console.log(index, openData[index])
      if (it.level < 10) {
        gameWin({ sunflowerId: it.tokenId, plants: plantIds, level: it.level + 1 })
      } else if (it.level == 10 && (openData[index] + 86400) <= (new Date() / 1000)) {
        openMysteryBox(it.tokenId)
      } else if (it.level == 10 && openData[index] == 0) {
        openMysteryBox(it.tokenId)
      }
    })
  }
  const gameWin = (options) => {
    fetch('https://www.plantmaster.club/api/gameWin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(options),
    })
  }
  const getPlantsData = () => {
    fetch('https://www.plantmaster.club/api/getPlantsData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ queryTypes: [1, 2, 3, 4] }),
    })
      .then((data) => {
        return data.json()
      })
      .then((update) => {
        console.error(update)
        if (update.plants.length > 0) {
          plantIds = Object.assign([])
          let type1Id = update.plants.find((it) => it.type == 1)
          let type2Id = update.plants.find((it) => it.type == 2)
          let type3Id = update.plants.find((it) => it.type == 3)
          let type4Id = update.plants.find((it) => it.type == 4)
          if (type1Id != undefined) {
            plantIds.push(type1Id.propId)
          }
          if (type2Id != undefined) {
            plantIds.push(type2Id.propId)
          }
          if (type3Id != undefined) {
            plantIds.push(type3Id.propId)
          }
          if (type4Id != undefined) {
            plantIds.push(type4Id.propId)
          }
          console.error(plantIds)
        }
      })
  }
  const getBoxData = () => {
    fetch('https://www.plantmaster.club/api/getBoxData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(),
    })
      .then((data) => {
        return data.json()
      })
      .then((update) => {
        console.error(update)
        if (update.boxes.length > 0) {
          sunflowerIds = Object.assign(
            [],
            update.boxes.map((it) => it.nftId)
          )
          openData = Object.assign(
            [],
            update.boxes.map((it) => it.lastOpenTime)
          )
          console.error(sunflowerIds)
          getSunflowers(sunflowerIds)
        }
      })
  }
  const getSunflowers = (options) => {
    fetch('https://www.plantmaster.club/api/getSunflowers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ tokenIds: options }),
    })
      .then((data) => {
        return data.json()
      })
      .then((update) => {
        console.error(update)
        if (update.sunflowers.length > 0) {
          gameWins(update.sunflowers)
        }
        setTimeout(() => {
          getBoxData()
        }, 3 * 60 * 1000)
      })
  }
  const queryGoldAmount = () => {
    fetch('https://www.plantmaster.club/api/queryGoldAmount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(),
    })
      .then((data) => {
        return data.json()
      })
      .then((update) => {
        console.error(update)
        if (update.amount) {
          console.warn(update.amount)
        }
      })
  }
  const openMysteryBox = (options) => {
    fetch('https://www.plantmaster.club/api/openMysteryBox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ boxId: options }),
    })
      .then((data) => {
        return data.json()
      })
      .then((update) => {
        console.error(update)
        if (update.type == '5') {
          console.warn(update.amount)
        }
      })
  }
  // openMysteryBox(1500)
  // getPlantsData()
  getBoxData()
})()
