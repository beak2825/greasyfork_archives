// ==UserScript==
// @name         wsmud_api
// @namespace    com.wsmud
// @version      0.0.9
// @description  使用于 Tampermonkey 的武神传说脚本的前置 API 库
// @author       sq
// @date         2020/08/24
// @modified     2020/08/30
// @license      MIT
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news/*
// @exclude      http://*.wsmud.com/pay.html
// @homepage     https://greasyfork.org/zh-CN/scripts/409901
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/409901/wsmud_api.user.js
// @updateURL https://update.greasyfork.org/scripts/409901/wsmud_api.meta.js
// ==/UserScript==

(function() {

'use strict'

if (!unsafeWindow.WebSocket) return

// GM_info.script.version

unsafeWindow.console.green = function(log) {
  console.log(`%c${log}`, 'color:green')
}
unsafeWindow.console.orange = function(log) {
  console.log(`%c${log}`, 'color:orange')
}
unsafeWindow.console.red = function(log) {
  console.log(`%c${log}`, 'color:red')
}
console.green = unsafeWindow.console.green
console.orange = unsafeWindow.console.orange
console.red = unsafeWindow.console.red

const RegExpListForColorValue = [
  /\s/,
  /^<wht>\S+<\/wht>$/i,
  /^<hig>\S+<\/hig>$/i,
  /^<hic>\S+<\/hic>$/i,
  /^<hiy>\S+<\/hiy>$/i,
  /^<hiz>\S+<\/hiz>$/i,
  /^<hio>\S+<\/hio>$/i,
  /^<(hir|ord)>\S+<\/(hir|ord)>$/i,
  /^\S+$/,
]
const RegExpListForBaseSkillSort = [
  /\s/,
  /^force$/,
  /^unarmed$/,
  /^dodge$/,
  /^parry$/,
  /^blade$/,
  /^sword$/,
  /^club$/,
  /^staff$/,
  /^whip$/,
  /^throwing$/,
  /^literate$/,
  /^\S+$/,
]
const RegExpListForPackSort = [
  /\s/,
  /师门补给包/, /背包扩充石/, /小箱子/, /随从礼包/,
  /^<hig>玄晶<\/hig>$/i,
  /^<hio>元晶<\/hio>$/i, /^<hio>帝魄碎片<\/hio>$/i,
  /^<(hir|ord)>神魂碎片<\/(hir|ord)>$/i,
  /^<hio>武道<\/hio>$/i, /^<hio>武道残页<\/hio>$/i,
  /^<hic>扫荡符<\/hic>$/i, /^<hiy>天师符<\/hiy>$/i,
  /洗髓丹/, /叛师符/,
  /^<hio>养精丹<\/hio>$/i, /^<hiz>养精丹<\/hiz>$/i,
  /^<hiy>养精丹<\/hiy>$/i, /^<hic>养精丹<\/hic>$/i, /^<hig>养精丹<\/hig>$/i,
  /^<hio>培元丹<\/hio>$/i, /^<hiz>培元丹<\/hiz>$/i,
  /^<hiy>培元丹<\/hiy>$/i, /^<hic>培元丹<\/hic>$/i, /^<hig>培元丹<\/hig>$/i,
  /^<hio>喜宴\S+<\/hio>$/i, /^<hiz>喜宴\S+<\/hiz>$/i,
  /^<hiy>喜宴\S+<\/hiy>$/i, /^<hic>喜宴\S+<\/hic>$/i, /^<hig>喜宴\S+<\/hig>$/i,
  /^<hio>师门令牌<\/hio>$/i, /^<hiz>师门令牌<\/hiz>$/i,
  /^<hiy>师门令牌<\/hiy>$/i, /^<hic>师门令牌<\/hic>$/i, /^<hig>师门令牌<\/hig>$/i,
  /^<ord>\S+秘籍<\/ord>$/i, /^<ord>\S+残页<\/ord>$/i,
  /^<hio>攻击之石<\/hio>$/i, /^<hio>命中之石<\/hio>$/i,
  /^<hio>躲闪之石<\/hio>$/i, /^<hio>气血之石<\/hio>$/i,
  /^<hio>\S+秘籍<\/hio>$/i, /^<hiz>\S+秘籍<\/hiz>$/i,
  /^<hiy>\S+秘籍<\/hiy>$/i, /^<hic>\S+秘籍<\/hic>$/i, /^<hig>\S+秘籍<\/hig>$/i,
  /^<hio>\S+残页<\/hio>$/i, /^<hiz>\S+残页<\/hiz>$/i,
  /^<hiy>\S+残页<\/hiy>$/i, /^<hic>\S+残页<\/hic>$/i, /^<hig>\S+残页<\/hig>$/i,
  /^<hiz>\S*红宝石<\/hiz>$/i, /^<hiy>\S*红宝石<\/hiy>$/i, /^<hic>\S*红宝石<\/hic>$/i, /^<hig>\S*红宝石<\/hig>$/i,
  /^<hiz>\S*绿宝石<\/hiz>$/i, /^<hiy>\S*绿宝石<\/hiy>$/i, /^<hic>\S*绿宝石<\/hic>$/i, /^<hig>\S*绿宝石<\/hig>$/i,
  /^<hiz>\S*蓝宝石<\/hiz>$/i, /^<hiy>\S*蓝宝石<\/hiy>$/i, /^<hic>\S*蓝宝石<\/hic>$/i, /^<hig>\S*蓝宝石<\/hig>$/i,
  /^<hiz>\S*黄宝石<\/hiz>$/i, /^<hiy>\S*黄宝石<\/hiy>$/i, /^<hic>\S*黄宝石<\/hic>$/i, /^<hig>\S*黄宝石<\/hig>$/i,
  /^<hio>聚气丹<\/hio>$/i, /^<hiz>聚气丹<\/hiz>$/i,
  /^<hiy>聚气丹<\/hiy>$/i, /^<hic>聚气丹<\/hic>$/i, /^<hig>聚气丹<\/hig>$/i,
  /^<hio>突破丹<\/hio>$/i, /^<hiz>突破丹<\/hiz>$/i,
  /^<hiy>突破丹<\/hiy>$/i, /^<hic>突破丹<\/hic>$/i, /^<hig>突破丹<\/hig>$/i,
  /鲤鱼/, /草鱼/, /鲢鱼/,
  /鲮鱼/, /鳊鱼/, /鲂鱼/,
  /黄金鳉/, /黄颡鱼/, /太湖银鱼/,
  /虹鳟/, /孔雀鱼/, /反天刀/,
  /银龙鱼/, /黑龙鱼/, /罗汉鱼/,
  /巨骨舌鱼/, /七星刀鱼/, /帝王老虎魟/,
  /当归/, /芦荟/, /山楂叶/,
  /柴胡/, /金银花/, /石楠叶/,
  /茯苓/, /沉香/, /熟地黄/,
  /九香虫/, /络石藤/, /冬虫夏草/,
  /人参/, /何首乌/, /凌霄花/,
  /灵芝/, /天仙藤/, /盘龙参/,
  /^<wht>\S+秘籍<\/wht>$/i,
  /四十二章经一/, /四十二章经二/, /四十二章经三/, /四十二章经四/,
  /四十二章经五/, /四十二章经六/, /四十二章经七/, /四十二章经八/,
  /^<wht>欠条<\/wht>$/i,
  /^<wht>高级皮毛<\/wht>$/i,
  /^<wht>阎基的头颅<\/wht>$/i,
  /^<hig>熊胆<\/hig>$/i,
  /^<hig>朱果<\/hig>$/i,
  /^<hig>潜灵果<\/hig>$/i,
  /^<hiy>补签卡<\/hiy>$/i,
  /^<hiy>玫瑰花<\/hiy>$/i,
  /^<hiy>蒙古密函<\/hiy>$/i,
  /^<hiz>技能重置卡<\/hiz>$/i,
  /^<hio>粽子<\/hio>$/i,
  /^<hio>顿悟丹<\/hio>$/i,
  /铁镐/, /钓鱼竿/, /药王神篇/,
  /^\S+$/,
]

class Api {
  constructor() {
    this.roles = this.getValue('roles')
    this.id = String()
    this.name = String()
    this.state = String()
    this.skills = Array()
    this.skilllimit = Number()
    this.packs = Array()
    this.packlimit = Number()
    this.money = Number()
    this.eqs = Array(11)
    this.performs = Array()
    this.prop = Object()
    this.room = Object()
    this.damage = Object()

    this.monitors = Object()
    this.commandQueue = Array()
    this.commandState = false
  }
  set roles(value) {
    if (value instanceof Array) {
      value.sort((a, b) => a.sort - b.sort)
      value.forEach((item, index) => {
        if (item.server) item.sort = index + 1
        else item.sort = 9999
      })
      this._roles = value
    } else {
      this._roles = []
    }
    this.setValue('roles', this._roles)
  }
  get roles() { return this._roles }

  set hp(value) { this.prop.hp = value }
  get hp() { return this.prop.hp }
  set hpmax(value) { this.prop.max_hp = value }
  get hpmax() { return this.prop.max_hp }
  set mp(value) { this.prop.mp = value }
  get mp() { return this.prop.mp }
  set mpmax(value) { this.prop.max_mp = value }
  get mpmax() { return this.prop.max_mp }
  set mplimit(value) { this.prop.limit_mp = value }
  get mplimit() { return this.prop.limit_mp }
  set jy(value) { this.prop.exp = value }
  get jy() { return this.prop.exp }
  set qn(value) { this.prop.pot = value }
  get qn() { return this.prop.pot }
  get wx1() { return this.prop.int }
  get wx2() { return this.prop.int_add }
  get xxxl() { return parseInt(this.prop.study_per) }
  get lxxl() { return parseInt(this.prop.lianxi_per) }

  ondata(data) {
    const type = data.type === 'dialog' ? data.dialog : data.type
    if (this.monitors[type]) {
      Object.keys(this.monitors[type]).forEach(name => {
        const callback = this.monitors[type][name]
        callback(data)
      })
    }
    const data2event = function(data) {
      if (!data.type) return
      if (data.type === 'text') return { data: data.text }
      else return { data: JSON.stringify(data) }
    }
    const event = data2event(data)
    if (event) this._onmessage(event)
  }
  ontext(text) {
    this.ondata({ type: 'text', text})
  }

  send(...args) {
    // 分割含有英文逗号的字符串
    args.forEach((item, index) => {
      if (typeof item === 'string' && /,/.test(item) && /^(?!setting)/.test(item)) args[index] = item.split(',')
    })
    // 加入指令队列
    this.commandQueue.push(...args.flat(Infinity))
    // 开启消息队列
    if (!this.commandState) {
      this.commandState = true
      this.sendloop(0)
    }
  }
  sendloop(delay = 256) {
    if (!this._websocket || !this.commandState || this.commandQueue.length === 0) {
      this.commandState = false
      return
    }
    // 取出首位元素
    const cmd = this.commandQueue.splice(0, 1)[0]
    // 判断是否数字
    const number = Number(cmd)
    if (!isNaN(number)) {
      console.orange(`CommandQueue: Wait for ${number}ms.`)
      this.sendloop(number)
      return
    }
    // 判断是否字符串
    if (typeof cmd === 'string') {
      setTimeout(() => {
        console.orange(cmd)
        this._websocket.send(cmd)
        this.sendloop()
      }, delay)
      return
    }
    // 判断是否函数
    if (typeof cmd === 'function') {
      setTimeout(() => {
        cmd()
        this.sendloop()
      }, delay)
      return
    }
  }
  clearCommandQueue() {
    this.commandQueue.splice(0)
  }

  addMonitor(type, name, callback) {
    if (!type || !name || typeof callback !== 'function') return
    if (!this.monitors[type]) this.monitors[type] = {}
    this.monitors[type][name] = callback.bind(this)
    console.green(`AddMonitor: [${type}]${name}`)
  }
  removeMonitor(type, name) {
    if (!type || !name) return
    delete this.monitors[type][name]
    console.red(`RemoveMonitor: type = ${type}; name = ${name};`)
    api.roles = new Object(api.roles)
  }
  addStyle(css) {
    GM_addStyle(css)
  }
  cookie() {
    const cookies = document.cookie.split(';').reduce((accumulator, currentValue) => {
      const i = currentValue.indexOf('=')
      const name = currentValue.substr(0, i).trim()
      const value = currentValue.substr(i + 1)
      accumulator[name] = value
      return accumulator
    }, {})
    const setCookie = (name, value) => document.cookie = name + '=' + value
    const deleteCookie = name => document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    return new Proxy(cookies, {
      set: (target, name, value) => {
        setCookie(name, value)
        return Reflect.set(target, name, value)
      },
      deleteProperty: (target, name) => {
        deleteCookie(name)
        return Reflect.deleteProperty(target, name)
      },
    })
  }
  setValue(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
  getValue(key) {
    return JSON.parse(localStorage.getItem(key))
  }
  deleteValue(key) {
    localStorage.removeItem(key)
  }
}

unsafeWindow.Vue = Vue
unsafeWindow.api = Vue.observable(new Api())

unsafeWindow.WebSocket = function (uri) {
  api._websocket = new WebSocket(uri)
}
unsafeWindow.WebSocket.prototype = {
  set onopen(fn) {
    api._websocket.onopen = fn
  },
  set onclose(fn) {
    api._websocket.onclose = fn
  },
  set onerror(fn) {
    api._websocket.onerror = fn
  },
  set onmessage(fn) {
    const event2data = function(event) {
      const data = event.data
      if (typeof data === 'string' && data[0] === '{') {
        try {
          return new Function('return ' + data)()
        } catch (error) {
          console.red(error)
          console.red(data)
        }
      }
      return { 'type': 'text', 'text': data }
    }
    api._onmessage = fn
    api._websocket.onmessage = function(event) {
      const data = event2data(event)
      api.ondata(data)
    }
  },
  get readyState() {
    return api._websocket.readyState
  },
  send: function(command) {
    api.send(command)
  },
}

api.addMonitor('roles', 'RoleList', function(data) {
  if (!(data.roles instanceof Array)) return
  data.roles.forEach(item => {
    const { id, name, title } = item
    const index = this.roles.findIndex(role => role.id === id)
    if (index === -1) {
      this.roles.push({ id, name, title, sort: 9999 })
    } else {
      this.roles[index].name = name
      this.roles[index].title = title
    }
  })
  this.roles = this.roles.slice(0)
})
api.addMonitor('login', 'Login', function(data) {
  const id = data.id
  if (this.id || !id) return
  this.id = id
  const index = this.roles.findIndex(role => role.id === id)
  this.name = this.roles[index].name
  const cookie = this.cookie()
  this.roles[index].u = cookie.u
  this.roles[index].p = cookie.p
  this.roles[index].s = cookie.s
  this.roles[index].server = ['一区', '二区', '三区', '四区', '测试'][cookie.s]
  this.roles = this.roles.slice(0)

  setTimeout(() => {
    this.send('pack,score2,score')
    setTimeout(() => $('[command=skills]').click(), 1000)
    setTimeout(() => $('[command=tasks]').click(), 2000)
    setTimeout(() => $('.dialog-close').click(), 3000)
    if (!$('.right-bar').width()) {
      setTimeout(() => $('[command=showtool]').click(), 500)
    }
    if (!$('.content-bottom').height()) {
      setTimeout(() => $('[command=showcombat]').click(), 1000)
    }
  }, 3000)
  // greet master 请安师傅
})
api.addMonitor('state', 'State', function(data) {
  if (typeof data.state !== 'string') {
    this.state = ''
    return
  }
  const list = [
    { regexp: /^你正在疗伤$/, value: '疗伤' },
    { regexp: /^你正在修炼$/, value: '修炼' },
    { regexp: /^你正在闭关$/, value: '闭关' },
    { regexp: /^你正在炼药$/, value: '炼药' },
    { regexp: /^你正在读书$/, value: '读书' },
    { regexp: /^你正在挖矿中$/, value: '挖矿' },
    { regexp: /^你正在打坐运功$/, value: '打坐' },
    { regexp: /^你正在练习技能$/, value: '练习' },
    { regexp: /^你正在学习(\S+)$/, value: '学习' },
    { regexp: /^你正在领悟技能$/, value: '武道领悟' },

  ]
  const result = list.find(item => item.regexp.test(data.state))
  if (result) data.state = result.value + (RegExp.$1 || '')
  this.state = data.state
  delete data.desc
})
api.addMonitor('combat', 'FightState', function(data) {
  if (data.start === 1) {
    this.state = '战斗'
    // if (this.fightTimer) clearInterval(this.fightTimer)
    // this.fightTimer = setInterval(() => {
    //   const now = Date.now()
    //   this.performs.find(pfm => {
    //     if (pfm.auto && (pfm.time < now)) {
    //       this.send(`perform ${pfm.id}`)
    //       return true
    //     }
    //   })
    // }, 256)
  } else if (data.end === 1) {
    this.state = ''
    // clearInterval(this.fightTimer)
  }
})
api.addMonitor('die', 'DieState', function(data) {
  if (data.relive) {
    this.state = ''
  } else {
    this.state = '死亡'
    // // 自动武庙复活
    // if (this.CanReliveWuMiao && !this.roomName.includes('副本')) {
    // this.send('relive')
  }
})
class Perform {
  constructor(item) {
    this.id = item.id
    this.name = item.name
    this.distime = item.distime
    this.timestamp = 0
    this.auto = api.getValue(this.key('auto')) || false
    this.sort = api.getValue(this.key('sort')) || 999
  }
  key(value) {
    return `${api.id}-${this.id}-${value}`
  }
  set auto(value) {
    this._auto = Boolean(value)
    api.setValue(this.key('auto'), this._auto)
  }
  get auto() {
    return this._auto
  }
  set sort(value) {
    this._sort = Number(value)
    api.setValue(this.key('sort'), this._auto)
  }
  get sort() {
    return this._sort
  }
}
api.addMonitor('perform', 'PerformList', function(data) {
  if (!(data.skills instanceof Array)) return
  data.skills.forEach((item, index) => data.skills[index] = new Perform(item))
  data.skills.forEach((a, b) => a.sort - b.sort)
  data.skills.forEach((item, index) => item.sort = index + 1)
  api.performs = data.skills
})
api.addMonitor('dispfm', 'PerformDistime', function(data) {
  if (data.hasOwnProperty('id') && data.hasOwnProperty('distime')) {
    api.performs.forEach(pfm => {
      if (pfm.id === data.id) {
        pfm.distime = data.distime
        pfm.timestamp = Date.now() + data.distime
      }
      if (data.hasOwnProperty('rtime')) {
        pfm.time = Math.max(Date.now() + data.rtime, pfm.timestamp)
      }
    })
  }
})
class Room {
  constructor(item) {
    this.name = item.name
    this.path = item.path
    this.commands = item.commands || Array()
    this.desc = item.desc
    this.exits = Object()
    this.items = Array()
  }
  get x() {
    if (/^(\S+)-(\S+)$/.test(this.name)) {
      return RegExp.$1
    }
  }
  get y() {
    if (/^(\S+)-(\S+)\(副本区域\)$/.test(this.name)) {
      return RegExp.$2
    } else if (/^(\S+)-(\S+)$/.test(this.name)) {
      return RegExp.$2
    }
  }
  set desc(value) {
    if (/cmd/.test(value)) {
      // 统一使用双引号
      value = value.replace(/'/g, '"')
      // 去除英文括号和里面的英文单词
      value = value.replace(/\([A-Za-z]+?\)/g, '')
      // 新手教程中的椅子
      value = value.replace(/<hig>椅子<\/hig>/, '椅子')
      // 兵营副本中的门
      value = value.replace(/<CMD cmd="look men">门<CMD>/, '<cmd cmd="look men">门</cmd>');
      // 古墓副本中的画和古琴
      value = value.replace(/span/ig, 'cmd')

      const htmls = value.match(/<cmd cmd="[^"]+?">[^<]+?<\/cmd>/g)
      htmls.forEach(html => {
        if (/<cmd cmd="([^"]+?)">([^<]+?)<\/cmd>/.test(html)) {
          this.commands.unshift({ cmd: RegExp.$1, name: `<hic>${RegExp.$2}</hic>` })
        }
      })
    }
    this._desc = value
  }
  get desc() {
    return this._desc
  }
  get npcs() {
    return this.items.filter(item => item.isNpc)
  }
}
api.addMonitor('room', 'RoomInfo', function(data) {
  api.room = new Room(data)
  data.desc = api.room.desc
  data.commands = api.room.commands
})
api.addMonitor('exits', 'RoomExitInfo', function(data) {
  if (typeof data.items !== 'object') return
  api.room.exits = {}
  Object.keys(data.items).forEach(key => api.room.exits[`go ${key}`] = data.items[key])
})
class Role {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    if (data.hasOwnProperty('hp')) this.hp = data.hp
    if (data.hasOwnProperty('mp')) this.mp = data.mp
    if (data.hasOwnProperty('max_hp')) this.max_hp = data.max_hp
    if (data.hasOwnProperty('max_mp')) this.max_mp = data.max_mp
    if (data.hasOwnProperty('status')) this.status = data.status
    if (data.hasOwnProperty('p')) this.p = data.p // 玩家肯定有 p === 1
  }
  get isNpc() {
    return !this.hasOwnProperty('p') && this.hasOwnProperty('hp')
  }
  get sort() {
    // 自身
    if (this.id === api.id) return 1
    // NPC
    if (this.isNpc) return 10
    // 玩家
    if (this.hasOwnProperty('hp')) {
      const list = ['武神 ', '武帝 ', '武圣 ', '宗师 ', '武师 ', '武士 ', '普通百姓 ', '']
      const index = list.findIndex(item => this.name.includes(item))
      return 100 * index * (this.name.includes('<red>&lt;断线中&gt;</red>') ? 100 : 1)
    }
    // 其他物品或尸体
    return 1000
  }
}
api.addMonitor('items', 'RoomItemList', function(data) {
  if (!data.items instanceof Array) return
  data.items.splice(-1, 1) // 删除最后一个 0
  data.items.forEach((item, index) => data.items[index] = new Role(item))
  data.items.sort((a, b) => a.sort - b.sort)
  api.room.items = data.items
})
api.addMonitor('itemadd', 'RoomAddItem', function(data) {
  const item = new Role(data)
  const index = api.room.items.findIndex(item => item.id === data.id)
  if (index === -1) api.room.items.push(item)
  else api.room.items.splice(index, 1, item)
})
api.addMonitor('itemremove', 'RoomRemoveItem', function(data) {
  const index = api.room.items.findIndex(item => item.id === data.id)
  if (index !== -1) api.room.items.splice(index, 1)
})
api.addMonitor('score', 'PropData', function(data) {
  if (api.id !== data.id) return
  Object.keys(data).forEach(key => api.prop[key] = data[key])
  api.prop = Object.assign({}, api.prop)
})
class Skill {
  constructor(item) {
    this.id = item.id
    this.name = item.name
    this.level = item.level
    this.exp = item.exp
    if (item.hasOwnProperty('enable_skill')) this.enable_skill = item.enable_skill
    if (item.hasOwnProperty('can_enables')) this.can_enables = item.can_enables
    this.target = api.getValue(this.key('target'))
  }
  key(value) {
    return `${api.id}-${this.id}-${value}`
  }
  set target(value) {
    const number = Number(value)
    this._target = isNaN(number) ? 0 : number
    api.setValue(this.key('target'), this._target)
  }
  get target() {
    return this._target
  }
  get color() {
    return RegExpListForColorValue.findIndex(regexp => regexp.test(this.name))
  }
  get sort() {
    if (this.color === 1) {
      return RegExpListForBaseSkillSort.findIndex(regexp => regexp.test(this.id))
    }
    return 99999 - (this.level + this.color)
  }
}
api.addMonitor('skills', 'SkillData', function(data) {
  // 潜能
  if (data.hasOwnProperty('pot')) this.qn = data.pot
  // 等级上限
  if (data.hasOwnProperty('limit')) this.skilllimit = data.limit
  // 技能列表
  if (data.items instanceof Array) {
    data.items.forEach((item, index) => data.items[index] = new Skill(item))
    data.items.sort((a, b) => a.sort - b.sort)
    api.skills = data.items
  }
  // 学会新技能
  if (data.hasOwnProperty('item')) api.skills.push(new Skill(data.item))
  // 装备技能
  if (data.hasOwnProperty('enable')) {
    api.skills.find(skill => {
      if (skill.id === data.id) {
        skill.enable_skill = data.enable
        return true
      }
    })
  }
  // 技能经验提升
  if (data.hasOwnProperty('exp')) {
    const skill = this.skills.find(skill => skill.id === data.id)
    if (!skill) return
    skill.exp = data.exp
    // 技能等级提升
    if (data.hasOwnProperty('level')) skill.level = parseInt(data.level)
    // 技能消耗系数
    const k = skill.color * 2.5
    // 需要消耗潜能
    const target = skill.target > skill.level ? skill.target : this.skilllimit
    const qn = (Math.pow(target, 2) - Math.pow(skill.level, 2)) * k
    // 练习状态
    if (this.state.includes('练习')) {
      // 练习每跳消耗=(先天悟性+后天悟性)*(100%+练习效率%-先天悟性%)
      const cost = Math.ceil((this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100))
      this.ontext(`你练习${ skill.name }消耗了${ cost }点潜能。<wht>${ skill.level }级 / ${ skill.exp }%</wht>`)
      // 需要分钟时间
      const minutes = Math.ceil(qn / cost / (60 / 5))
      const text = minutes < 60 ? minutes + '分钟' : Math.floor(minutes / 60) + '小时' + (minutes % 60) + '分钟'
      this.ondata({ type: 'state', state: `练习${ skill.name.replace(/<\S+?>/g, '') }至${ target }级余${ text }` })
    }
    // 学习状态
    if (this.state.includes('学习')) {
      // 学习每跳消耗=(先天悟性+后天悟性)*(100%+学习效率%-先天悟性%)*3
      const cost = Math.ceil((this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100)) * 3
      this.ontext(`你学习${ skill.name }消耗了${ cost }点潜能。<wht>${ skill.level }级 / ${ skill.exp }%</wht>`)
    }
    // 炼药状态
    if (this.state.includes('炼药')) {
      this.ontext(`你修习${skill.name}消耗了药材换取经验。<wht>${ skill.level }级 / ${ skill.exp }%</wht>`)
    }
  }
})
api.addMonitor('master', 'MasterSkillData', function(data) {
  // 师傅技能或随从技能
  if (data.items instanceof Array) {
    data.items.forEach((item, index) => data.items[index] = new Skill(item))
    data.items.sort((a, b) => a.sort - b.sort)
  }
})
class Pack {
  constructor(item) {
    this.id = item.id
    this.name = item.name
    this.count = item.count
    this.unit = item.unit
    this.value = item.value
    if (item.hasOwnProperty('can_combine')) this.can_combine = item.can_combine
    if (item.hasOwnProperty('can_study')) this.can_study = item.can_study
    if (item.hasOwnProperty('can_use')) this.can_use = item.can_use
    if (item.hasOwnProperty('can_eq')) this.can_eq = item.can_eq
  }
  get color() {
    return RegExpListForColorValue.findIndex(regexp => regexp.test(this.name))
  }
  get sort() {
    return RegExpListForPackSort.findIndex(regexp => regexp.test(this.name))
  }
}
api.addMonitor('pack', 'PackData', function(data) {
  console.log(data)
  if (data.hasOwnProperty('money')) this.money = data.money
  if (data.hasOwnProperty('max_item_count')) this.packlimit = data.max_item_count
  // 物品列表
  if (data.items instanceof Array) {
    data.items.forEach((item, index) => data.items[index] = new Pack(item))
    data.items.sort((a, b) => a.sort - b.sort)
    this.packs = data.items
  }
  // 装备列表
  if (data.eqs instanceof Array) {
    data.eqs.forEach((eq, index) => this.eqs.splice(index, 1, eq ? new Pack(eq) : null))
  }
  // 穿装备
  if (typeof data.eq === 'number' && data.id) {
    // { id: "c7mj3f552d3", eq: 3 }
  }
  // 脱装备
  if (typeof data.uneq === 'number' && data.id) {
    // { id: "wpur2aee755", uneq: 0 }
  }
  // 物品描述
  if (data.from === 'eq' || data.from === 'item') {
    // { id: "pd232aa6f4c", desc: "<hic>★★★★神龙袍</hic>↵高级↵神龙教管理层的标准制服↵<hic>防御：+195↵气血：+975↵根骨：+39</hic>↵◇" }
    // { id: "sbgw4bfb80a", desc: "<hio>高级叛师符</hio>↵使用后可以使脱离当前门派，门派学到的所有武功会遗忘，会返还你学习和练习技能消耗的潜能" }
  }
})
api.addMonitor('pack2', 'SuiCongPackData', function(data) {
  if (data.items instanceof Array) {
    data.items.forEach((item, index) => data.items[index] = new Pack(item))
    data.items.sort((a, b) => a.sort - b.sort) // 随从背包物品排序
  }
})
api.addMonitor('list', 'ItemListData', function(data) {
  // 仓库数据
  if (data.stores instanceof Array) {
    data.stores.forEach((item, index) => data.stores[index] = new Pack(item))
    data.stores.sort((a, b) => a.sort - b.sort)
  }
})
api.addMonitor('sc', 'ScoreData', function(data) {
  // 自身气血内力数据
  if (this.id === data.id) {
    if (data.hasOwnProperty('hp')) this.hp = data.hp
    if (data.hasOwnProperty('mp')) this.mp = data.mp
    if (data.hasOwnProperty('max_hp')) this.hpmax = data.max_hp
    if (data.hasOwnProperty('max_mp')) this.mpmax = data.max_mp
  }
  // BOSS
  if (data.hasOwnProperty('damage')) {
    const id = data.id
    const npc = this.room.npcs.find(npc => npc.id === id)
    if (npc) {
      const name = npc.name
      const max = npc.max_hp
      // 当 damage === -1 时直接计算，否则根据具体的 damage 值计算伤害占比。
      const value = data.damage === -1 ? ((max-data.hp)/max*100).toFixed(2) : (data.damage/max*100).toFixed(2)
      if (this.damage.id !== id) this.damage.value = 0

      if (Math.floor((this.damage.value+5)/5)*5 < value) {
        // this.ontext(`<hir>Damage: [${value}]${name.replace(/<\S+?>|\s/g, '')}`)
      }
      this.damage = { id, name, value, max }
    } else if (this.damage.id === id) {
      const name = this.damage.name
      const max = this.damage.max
      const value = data.damage === -1 ? ((max-data.hp)/max*100).toFixed(2) : (data.damage/max*100).toFixed(2)
      if (Math.floor((this.damage.value+5)/5)*5 < value) {
        // this.ontext(`<hir>Damage: [${value}]${name.replace(/<\S+?>|\s/g, '')}`)
      }
      this.damage = { id, name, value, max }
    }
  }
})


api.addMonitor('', '', function(data) {})


new Vue({
  computed: {
    title() {
      return `${api.name} ${api.state}`
    },
  },
  watch: {
    title(value) {
      document.title = value
    },
  },
})

document.addEventListener('DOMContentLoaded', () => api.addStyle(`
`), false)

})()