// ==UserScript==
// @name         Idle Infinity - Title
// @namespace    http://dazzyd.org/
// @version      0.4.2
// @description  Idle Infinity
// @author       Dazzy Ding
// @license      MIT
// @grant        none
// @match        https://www.idleinfinity.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// @downloadURL https://update.greasyfork.org/scripts/458465/Idle%20Infinity%20-%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/458465/Idle%20Infinity%20-%20Title.meta.js
// ==/UserScript==


const store = {
  load() {
    const saved = JSON.parse(localStorage.getItem(`dd_ui_title`) || "{}")
    for (const [key, val] of Object.entries(saved)) {
      this[key] = val
    }
  },
  save() {
    localStorage.setItem(`dd_ui_title`, JSON.stringify(this))
  },
}
const rules = {
  "/Home/Index": ["主页"],

  "/Character/Detail": ["角色"],
  "/Skill/Config": ["技能"],
  "/Equipment/Query": ["装备"],
  "/Equipment/Material": ["材料/符文/宝石"],
  "/Battle/BattleField": ["战场"],
  "/Character/Group": ["团队"],

  "/Map/Detail": ["地图"],
  "/Map/Dungeon": ["秘境", () => {
    const san = document.querySelector(".panel-heading .state").textContent
    const explored = document.querySelector('.panel-body .explore').textContent
    const monster = document.querySelector('.panel-body .monster-left').textContent
    const boss = document.querySelector('.panel-body .boss-left').textContent
    return `${Math.floor(100 * explored / 400)}% ${monster}/${boss} ${san}san`
  }],
  "/Battle/InDungeon": ["战斗", () => {
    const timeNode = document.getElementById("time")
    if (timeNode != null) {
      return `in ${timeNode.textContent}s`
    }
    const dataNode = document.querySelector(".battle-data")
    if (dataNode != null) {
      return dataNode.classList.contains("visually-hidden") ? "..." : "done"
    }
  }],

  "/Config/Query": ["物品过滤"],
  "/Character/RankingList": ["赛季排行"],
  "/Character/AllChar": ["角色等级排行"],
  "/Character/AllCharMCU": ["符文掉落排行"],

  "/Help/Content?url=Base": ["基础知识"],
  "/Help/Content?url=CharType": ["职业技能"],
  "/Help/Content?url=Monsters": ["怪物介绍"],
  "/Help/Content?url=Equip": ["物品装备"],
  "/Help/Content?url=BaseEquip": ["普通物品"],
  "/Help/Content?url=Prefix": ["前缀词缀"],
  "/Help/Content?url=Suffix": ["后缀词缀"],
  "/Help/Content?url=SpecialAffix": ["固定词缀"],
  "/Help/Content?url=Set": ["套装物品"],
  "/Help/Content?url=Sacred": ["圣衣套装"],
  "/Help/Content?url=Unique": ["传奇物品"],
  "/Help/Content?url=Artifact": ["神器物品"],

  "/Guide/Query": ["攻略列表"],
  "/Guide/Detail": ["攻略详情"],
}

setTimeout(() => {
  const char = (() => {
    const matches = location.search.match(/\bid=(\d+)/i)
    if (matches == null) return
    const id = matches[1]

    store.load()
    if (store[id] == null) {
      const firstNavItem = document.querySelector("#navbar > ul > li")
      if (firstNavItem.classList.contains("dropdown")) {
        store[id] = firstNavItem.firstElementChild.text
        store.save()
      }
    }
    return store[id]
  })()

  const [title, getInfo] = (() => {
    for (const key of [location.pathname, `${location.pathname}${location.search}`]) {
      if (rules[key] != null) {
        return rules[key]
      }
    }
    return []
  })()

  function update() {
    document.title = [
      char != null ? `[${char}]` : null,
      title != null ? title : location.pathname,
      getInfo != null ? getInfo() : null,
    ].filter(x => x != null).join(' ')
  }
  if (getInfo != null) {
    setInterval(update, 1000)
  }
  update()
}, 0)
