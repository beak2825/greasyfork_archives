// ==UserScript==
// @name         boss直聘显示活跃度
// @namespace    https://greasyfork.org/zh-CN/users/1208108-%E8%BD%BB%E8%BD%BB%E8%AF%B4%E5%87%BA%E6%9D%A5?locale_override=1
// @version      0.4
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAC6wk3/usJN/7rCTf+6wk3/usFN/7nBS/+6wEz/usFL/7rAS/+5wU3/u8JP/7vBTf+6wk3/usJN/7rCTf+6wk3/u8JP/7vCT/+7wk//u8JP/7vDUP+8xFP/u8JR/7zCT/+8wlD/usFM/7e/Rf+8wk7/u8JP/7vCT/+7wk//u8JP/7rCTv+6wk7/u8JQ/7a+Q//S143/9/ju//f57v/6+vX/+fv1//Dy3v/R1Yz/usBK/7rCTv+6wk7/usJO/7rCTv+7w07/u8NO/7zEUf+2v0H/19uZ///////o6sX/3eGl/+Hksv/29+v//////9XZk/+4wEX/vMRQ/7vDTv+7w07/vcRP/73ET/++xVL/uMBD/9bblv//////y9B5/7K7Nv+4vkH/wshf//n68//z9eP/vcRR/73ETv+9xE//vcRP/7zET/+8xE//vcVS/7jAQ//X25b//////9DVhv+7wkr/vsZT/7rARf/t79X//Pz3/7/GVv+7w03/vcRQ/7zET/++xE//vsRP/7/FUv+6wUP/19uX///////P1IL/ucFE/7zDTf/N0nv//////+3w0v+9xE3/vsVQ/77FUP++xE//vsVQ/77FUP+/xlP/usFE/9jcmf//////9PXk/+/x2f/x8t7//P36//T15P/Kz3D/vMNK/7/GUv++xVD/vsVQ/77GUf++xlH/v8dU/7rCRf/Y3Zj///////T25P/v8dj/+Pnu//3+/f/T2Iz/usJE/7/HU/++xlH/vsZR/77GUf+/x1H/v8dR/8DIVP+7xET/2N2Y///////Q1oT/u8NG/8HHVf/s7cr//f79/8jOaf+9xkz/v8hS/7/HUf+/x1H/wMlQ/8DJUP/ByVP/u8VE/9nel///////0deE/77GSf+7w0H/0daE///////Y3Zj/u8VE/8HJU//AyVD/wMlQ/8DIU//AyFP/wclW/7zER//Z3Zf//////9LYhv+/xkr/xMpa/+frwf//////1dqQ/7zFSP/ByVb/wMhT/8DIU//ByVL/wclS/8HKVf+8xUb/3OCf///////8/Pf/+frz//39+///////7vDT/8LKV//AyVH/wclT/8HJUv/ByVL/wclT/8HJU//BylT/v8hN/87Udv/i5a7/4eWr/+Hlr//i5a3/2dyT/8TKVv/ByE//wcpU/8HJU//ByVP/wclT/8HKVP/BylT/wcpT/8LKVP/Ax03/vMVF/73FRf+9xUT/vcVE/7/HR//CyVP/wspU/8HKU//CylT/wcpU/8HKVP/Cy1P/wstT/8LLU//Cy1P/xcpV/8TMV//Fy1f/xMxW/8TLV//Ey1b/wspU/8PLU//Cy1P/wstT/8LLU//Cy1P/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @description  显示活跃度和低活跃度删掉且去掉登录弹窗
// @author       轻轻说出来
// @license      轻轻说出来
// @match        https://www.zhipin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489953/boss%E7%9B%B4%E8%81%98%E6%98%BE%E7%A4%BA%E6%B4%BB%E8%B7%83%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/489953/boss%E7%9B%B4%E8%81%98%E6%98%BE%E7%A4%BA%E6%B4%BB%E8%B7%83%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let listData = getLocalDate("listData") || []
  let condition = {
    new: { filter: ["刚刚", "今日"], color: "#00bebd", hour: 3 },
    old: { filter: ["日", "周", "本月"], color: "#007acc", hour: 24 }
  }

  let observer = new MutationObserver((mutations) => {
    try {
      mutations.forEach((i) => {
        let getclass = i.addedNodes[0]?.attributes?.class
        let item = i.addedNodes[0]
        if (!getclass) return
        if (getclass.value == "boss-login-dialog") {
          console.log("出现登录框")
          item.querySelector(".icon-close").click()
        }
        if (getclass.value == "job-list-box") {
          for (const subItem of item.querySelectorAll(".job-card-left")) {
            let baseURL = new URL(subItem.href)
            let securityId = baseURL.searchParams.get("securityId")
            let pathId = baseURL.pathname
            let index = listData.findIndex(item => item.pathId == pathId)
            index > -1 ? trueIndex() : noIndex()
            async function trueIndex() {
              let date = new Date()
              let { oldDate, value } = listData[index]
              let { hour, color } = getDate(value)
              date = date.getDay() == 1 && date.getHours() >= 10 ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10).getTime() : 0
              let expirationTime = date == 0 ? hour : (date < oldDate) || value.includes("刚刚") ? hour : date
              if (timeFilter(expirationTime) > timeFilter(oldDate)) {
                processingElements(subItem, value, color)
              } else {
                await getActivityLevel((value) => {
                  listData = listData.filter((item) => item.pathId != pathId)
                  listData.unshift({ pathId, value, oldDate: Date.now() })
                }, subItem, securityId)
              }
            }

            async function noIndex() {
              await getActivityLevel((value) => {
                listData.unshift({ pathId, value, oldDate: Date.now() })
              }, subItem, securityId)

            }
          }
        }

      })
    } catch (e) {
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })



  function getActivityLevel(callback, subItem, securityId) {
    return new Promise((resolve) => {
      fetch(`https://www.zhipin.com/wapi/zpgeek/job/card.json?securityId=${securityId}`)
        .then((res) => res.json() || {})
        .then(({ zpData }) => {
          let { activeTimeDesc: value } = zpData.jobCard
          callback(value, zpData.jobCard)
          setLocalDate("listData", listData)
          processingElements(subItem, value, getDate(value).color)
          resolve(zpData)
        })
    })
  }

  function getDate(text) {
    for (const key in condition) {
      for (const item of condition[key].filter) {
        let subitem = condition[key]
        if (text.includes(item)) {
          return subitem
        }
      }
    }
    return false
  }

  function processingElements(item, value, color) {
    if (color) {
      let span = document.createElement("span")
      span.style.color = color
      span.style.marginLeft = "30px"
      span.innerText = value
      item.querySelector(".job-title.clearfix") && item.querySelector(".job-title.clearfix").append(span)
    } else {
      item.parentElement.parentElement.remove()
    }
  }

  function getLocalDate(id) {
    let list = JSON.parse(localStorage.getItem(id))
    if (!list) return
    list = list.sort((item1, item2) => item2.oldDate - item1.oldDate).splice(0, 3000)
    setLocalDate("listData", list)
    return list
  }

  function setLocalDate(id, list) {
    localStorage.setItem(id, JSON.stringify(list))
  }

  function timeFilter(time) {
    if (String(time).length < 4) {
      return time * 60 * 60
    } else if (time) {
      return (Date.now() - Number(time)) / 1000
    } else {
      return 72 * 60 * 60
    }
  }
})();