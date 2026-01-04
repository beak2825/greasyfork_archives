// ==UserScript==
// @name         gooboo 煤渣购买建议
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  煤渣活动的生产者购买建议
// @author       baicy
// @match        *://*/gooboo/
// @match        *://gooboo.g8hh.com.cn/
// @match        *://gooboo.tkfm.online/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523837/gooboo%20%E7%85%A4%E6%B8%A3%E8%B4%AD%E4%B9%B0%E5%BB%BA%E8%AE%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/523837/gooboo%20%E7%85%A4%E6%B8%A3%E8%B4%AD%E4%B9%B0%E5%BB%BA%E8%AE%AE.meta.js
// ==/UserScript==

(function () {
  "use strict"

  let inventory = null
  const store = document.getElementsByClassName("primary")[0].__vue__.$store

  const producers = {
    firefly: "萤火虫",
    glowshroom: "发光蘑菇",
    glowfish: "发光鱼",
    lantern: "灯",
    campfire: "营火",
    coral: "珊瑚",
    jellyfish: "海蜇",
    nightbloom: "夜花",
    neonlight: "霓虹灯",
    sun: "太阳",
  }
  let bestProducer = Object.keys(producers)[0]
  const productions = {}
  const producerRatio = new Proxy(productions, {
    set(target, key, value) {
      const infoDom = document.querySelector('#cinder_info')
      if(infoDom) {
        const dom = infoDom.querySelector(`#cinder_info_${String(key)}`)
        if (dom) {
          if (target[key]!==value) {
            dom.innerHTML = value.toExponential(4)
          }
          if (bestProducer===key) {
            dom.parentElement.classList.add('success--text')
          } else {
            dom.parentElement.classList.remove('success--text')
          }
        } else {
          const newDom = document.createElement("div")
          newDom.classList.add('d-flex')
          const labelDom = document.createElement('div')
          labelDom.style.width = '80px'
          labelDom.innerHTML =  producers[key]
          newDom.appendChild(labelDom)
          const ratioDom = document.createElement('div')
          ratioDom.id = `cinder_info_${String(key)}`
          ratioDom.innerHTML =  value.toExponential(4)
          newDom.appendChild(ratioDom)
          infoDom.appendChild(newDom)
        }
      }
      target[key] = value
      return true
    }
  })

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  function formatTime(remain) {
    const day = Math.floor(remain / (24 * 3600))
    remain -= day * 24 * 3600
    const hour = Math.floor(remain / 3600)
    remain -= hour * 3600
    const minute = Math.floor(remain / 60)
    remain -= minute * 60
    const second = Math.floor(remain)
    return `${day > 0 ? `${day}d` : ""}${day > 0 || hour > 0 ? `${hour}h` : ""}${day > 0 || hour > 0 || minute > 0 ? `${minute}m` : ""}${second}s`
  }

  const infoStyles = [
    "background: white;",
    "color: black;",
    "display: flex;",
    "flex-direction: column;",
    "justify-content: space-between;",
    "padding: 10px 20px;",
  ]
  function addInfo() {
    const infoDiv = document.createElement("div")
    infoDiv.id = "cinder_info"
    infoDiv.style = infoStyles.join("")
    inventory.insertBefore(infoDiv, inventory.childNodes[1])
    let lightInfo = getLight()
    if (lightInfo) {
      inventory.childNodes[0].appendChild(lightInfo)
    }
    for (const p in producers) {
      const span = getSingleInfo(p)
    }
  }
  function getLight() {
    const light = store.state.stat.event_light.value
    let lightGain = store.getters["cinders/totalProduction"] * Math.pow(1.015, store.getters["meta/globalEventLevel"])
    if (store.state.cinders.activeCandle) {
      lightGain = lightGain * store.getters["mult/get"]("cindersCandlePower", store.state.cinders.candle[store.state.cinders.activeCandle.name].lightMult - 1, 1, 1)
    }
    lightGain = store.getters["mult/get"]("currencyEventLightGain", lightGain)
    const token = Math.floor(
      store.getters["mult/get"](
        "currencyEventCindersTokenGain",
        Math.log(light / 10000) / Math.log(1.2)
      )
    )
    const needLight = Math.exp(Math.log(1.2) * (token + 1)) * 10000
    const needTime = (needLight - light) / lightGain
    let lightInfo = document.querySelector(`#cinder_info_light`)
    if (lightInfo) {
      document.querySelector("#cinder_info_light_gain").innerHTML = lightGain.toExponential(4)
      document.querySelector("#cinder_info_token").innerHTML = `${formatTime(needTime)}`
    } else {
      lightInfo = document.createElement("div")
      lightInfo.id = "cinder_info_light"
      lightInfo.style = "background:white;color: black;line-height:30px;display:flex;flex-direction:column;"
      const lightSpan = document.createElement("span")
      lightSpan.innerHTML = `光增益 <span id="cinder_info_light_gain">${lightGain}</span>/秒`
      const tokenSpan = document.createElement("span")
      tokenSpan.innerHTML = `代币+1需要 <span id="cinder_info_token">${needTime}</span>`
      lightInfo.appendChild(lightSpan)
      lightInfo.appendChild(tokenSpan)
      return lightInfo
    }
  }
  function getSingleInfo(p) {
    const producer = store.state.upgrade.item[`event_${p}`]
    let val = 0
    if (producer.requirement()) {
      const price = producer.price(producer.level).event_light
      const mult = store.state.mult.items[`cindersProduction${capitalize(p)}`]
      const gain = mult.baseCache * mult.multCache
      val = gain / price
      producerRatio[p] = val
    }
    return null
  }
  function getBest() {
    let max = 0
    for (const p in productions) {
      if (productions[p] > max) {
        max = productions[p]
        bestProducer = p
      }
    }
  }

  setInterval(() => {
    const ci = document.querySelector(".cinders-inventory")
    if (ci) {
      if (!inventory) {
        inventory = ci
        console.log("抵达煤渣现场...停止继续寻找")
        addInfo()
      }
    } else {
      inventory = null
    }
  }, 2000)
  setInterval(() => {
    getLight()
    for (const p in producers) {
      const upgrades = store.state.upgrade.item
      const val = upgrades[`event_${p}`]
      if (val.requirement()) {
        if (!productions[p]) {
          producerRatio[p] = 0
        } else {
          getSingleInfo(p)
        }
      }
    }
    getBest()
  }, 1000)
})()
