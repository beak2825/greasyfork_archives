// ==UserScript==
// @name             B站玩家指示器
// @namespace        http://853lab.com/
// @version          1.1
// @description      B站评论区自动标注玩家，依据是动态里是否有游戏的相关内容。灵感来自于原神玩家指示器。
// @author           Sonic853
// @match            https://www.bilibili.com/video/*
// @icon             https://static.hdslb.com/images/favicon.ico
// @run-at           document-end
// @license          MIT License
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_registerMenuCommand
// @grant            GM_xmlhttpRequest
// @original-author  xulaupuz
// @original-license MIT
// @original-script  https://greasyfork.org/zh-CN/scripts/450720-%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8
// @downloadURL https://update.greasyfork.org/scripts/451142/B%E7%AB%99%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451142/B%E7%AB%99%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==
// 凭实力走在对立面，
// 这就是我的觉悟。
// https://h.bilibili.com/67313825
// So FUCK YOU, miHoYo!

// 如何超越米哈游公司？

// ChatGPT：米哈游公司是一家拥有极高知名度和成功游戏产品的公司，要超越它需要做出一些艰苦的工作和采取正确的策略。以下是几个可能有用的建议：

// 注重产品质量：米哈游公司之所以能够取得成功，是因为他们推出了高质量、受玩家欢迎的游戏。要超越米哈游公司，您需要注重产品质量，确保游戏具有高水准的游戏体验和优秀的画面效果。

// 创新：在游戏行业，创新是非常重要的。米哈游公司之所以能够在市场上脱颖而出，是因为他们不断尝试新的玩法和元素。如果您想要超越米哈游公司，需要不断探索新的玩法和游戏元素，推出具有创新性的产品。

// 建立强大的社区：米哈游公司拥有一个庞大的社区，这个社区不仅可以帮助他们推广游戏，还可以为游戏提供反馈和建议。要超越米哈游公司，您需要建立一个强大的社区，与玩家建立良好的互动关系，并且倾听他们的反馈和建议。

// 投入足够的资源：游戏开发需要大量的资源，包括人力、物力、资金等。如果您想要超越米哈游公司，需要投入足够的资源，包括聘请优秀的开发团队、研发创新技术、开展广告宣传等。

// 扩大市场：米哈游公司的成功，与其在全球市场上的表现密不可分。如果您想要超越米哈游公司，需要扩大市场，将游戏推向更广泛的受众，特别是在海外市场上建立自己的品牌和口碑。

// 请注意，要超越米哈游公司是一个艰难的任务，需要付出大量的努力和资源。同时，市场竞争也是不断变化的，需要时刻保持敏锐的洞察力和灵活性，随时调整自己的策略。

(async function () {
  'use strict'

  const DEV_Log = Boolean(localStorage.getItem("Dev-853"))
  const localItem = "miHoYoCheck"
  const NAME = "miHoYoCheck"
  const D = () => {
    return new Date().toLocaleTimeString()
  }
  const Console_log = function (...text) {
    let d = new Date().toLocaleTimeString()
    console.log(`[${NAME}][${d}]: `, ...text)
  }
  const Console_Devlog = function (...text) {
    let d = new Date().toLocaleTimeString()
    DEV_Log && (console.log(`[${NAME}][${d}]: `, ...text))
  }
  const Console_error = function (...text) {
    let d = new Date().toLocaleTimeString()
    console.error(`[${NAME}][${d}]: `, ...text)
  }

  const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

  const RList = new class {
    time = 200
    #list = -1
    async Push() {
      this.#list++
      await snooze(this.#list * this.time)
      Promise.resolve().finally(() => {
        setTimeout(() => { this.#list-- }, (this.#list + 1) * this.time)
      })
    }
  }

  if (typeof GM_xmlhttpRequest === 'undefined'
    && typeof GM_registerMenuCommand === 'undefined'
    && typeof GM_setValue === 'undefined'
    && typeof GM_getValue === 'undefined') {
    console.error(`[${NAME}][${D()}]: `, "GM is no Ready.")
  } else {
    console.log(`[${NAME}][${D()}]: `, "GM is Ready.")
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {Object.<string, any>} headers
   * @param {string} responseType
   * @param {*} successHandler
   * @param {*} errorHandler
   * @returns
   */
  let HTTPsend = function (url, method, headers, responseType, successHandler, errorHandler) {
    Console_Devlog(url)
    if (typeof GM_xmlhttpRequest != 'undefined') {
      return new Promise((rl, rj) => {
        try {
          GM_xmlhttpRequest({
            method,
            url,
            headers,
            responseType,
            onerror: function (response) {
              Console_Devlog(response.status)
              errorHandler && errorHandler(response.status)
              rj(response.status)
            },
            onload: function (response) {
              let status
              if (response.readyState == 4) { // `DONE`
                status = response.status
                if (status == 200) {
                  Console_Devlog(response.response)
                  successHandler && successHandler(response.response)
                  rl(response.response)
                } else {
                  Console_Devlog(status)
                  errorHandler && errorHandler(status)
                  rj(status)
                }
              }
            },
          })
        } catch (error) {
          rj(error)
        }
      })
    } else {
      return new Promise((rl, rj) => {
        try {
          let xhr = new XMLHttpRequest()
          xhr.open(method, url, true)
          xhr.withCredentials = true
          xhr.responseType = responseType
          xhr.onreadystatechange = function () {
            let status
            if (xhr.readyState == 4) { // `DONE`
              status = xhr.status
              if (status == 200) {
                Console_log(xhr.response)
                successHandler && successHandler(xhr.response)
                rl(xhr.response)
              } else {
                Console_log(status)
                errorHandler && errorHandler(status)
                rj(status)
              }
            }
          }
          xhr.send()
        } catch (error) {
          rj(error)
        }
      })
    }
  }

  let BLab8A = class {
    /**
     * @type {Object.<string, {
     * name: string,
     * uid: string
     *  }[]>} data
     */
    data
    constructor() {
      this.data = this.load()
    }
    load() {
      console.log(`[${NAME}][${D()}]: `, "正在加载数据")
      const defaultData = "{\"unknown\":[],\"miHoYo\":[],\"none_Player\":[]}"
      if (typeof GM_getValue !== 'undefined') {
        let gdata = GM_getValue(localItem, JSON.parse(defaultData))
        return gdata
      } else {
        let ldata = JSON.parse(localStorage.getItem(localItem) === null ? defaultData : localStorage.getItem(localItem))
        return ldata
      }
    }
    save(d) {
      console.log(`[${NAME}][${D()}]: `, "正在保存数据")
      d === undefined ? (d = this.data) : (this.data = d)
      typeof GM_getValue != 'undefined' ? GM_setValue(localItem, d) : localStorage.setItem(localItem, JSON.stringify(d))
      return this
    }
  }
  let bLab8A = new BLab8A()


  GM_registerMenuCommand("清空插件所有数据", () => {
    if (!confirm("确定要清空数据吗？")) return
    bLab8A.data = JSON.parse("{\"unknown\":[],\"miHoYo\":[],\"none_Player\":[]}")
    bLab8A.save()
    console.log(`[${NAME}][${D()}]: `, "数据已清空")
  })
  GM_registerMenuCommand("清空插件里的玩家数据", () => {
    if (!confirm("确定要清空数据吗？")) return
    // 除了 none_Player ，其他都清空
    for (let key in bLab8A.data) {
      if (key != "none_Player") {
        bLab8A.data[key] = []
      }
    }
    bLab8A.save()
    console.log(`[${NAME}][${D()}]: `, "数据已清空")
  })
  GM_registerMenuCommand("清空插件里的非玩家数据", () => {
    if (!confirm("确定要清空数据吗？")) return
    bLab8A.data.none_Player = []
    bLab8A.save()
    console.log(`[${NAME}][${D()}]: `, "数据已清空")
  })

  class Checker {
    running = false
    /**
       * @type {{
     * name: string,
     * uid: string,
     * dom: HTMLElement
     * }[]}
     */
    list = []
    /**
     * @type {{
     *  keywords: string[],
     *  soeWithKeywords: string[],
     *  uids: string[],
     *  games: string[],
     *  tag: string,
     *  type: string
     * }[]}
     */
    KeywordChecklist = [
      {
        keywords: [
          "玩原神",
          "原神玩家",
          "#原神#",
          "【原神",
          "《原神",
          "[原神",
          "米哈游",
          "崩坏三",
          "崩坏3",
          "崩坏学园",
          "崩坏学院",
          "miHoYo",
          "崩坏星穹铁道",
          "崩坏:星穹铁道",
          "崩坏：星穹铁道",
          "未定事件簿",
          "绝区零",
          "米游社",
          // "鹿鸣",
        ],
        soeWithKeywords: [
          "原神",
        ],
        uids: [
          // 崩坏3
          "256667467",
          // 米哈游miHoYo
          "318432901",
          // 崩坏学园2-灵依娘desu
          "133934",
          // 崩坏3第一偶像爱酱
          "27534330",
          // 崩坏3情报姬
          "358367842",
          // 崩坏星穹铁道
          "1340190821",
          // 原神
          "401742377",
          // 米哈游崩坏3客服娘
          "33307860",
          "52957002",
          // 米游姬
          "510189715",
          // yoyo鹿鸣_Lumi
          "488836173",
          // 绝区零
          "1636034895",
          // 未定事件簿
          "436175352",
        ],
        games: [
          "原神",
          "崩坏3",
          "崩坏学园2",
          "崩坏：星穹铁道",
          "绝区零",
        ],
        tag: "[米哈游玩家]",
        icon: "https://i1.hdslb.com/bfs/face/fda1b06144d41092a9ffb9a687f99bad078e7395.jpg",
        color: "#00abf1",
        type: "miHoYo",
      },
      {
        keywords: [
          "玩原神",
          "原神玩家",
          "#原神#",
          "【原神",
          "《原神",
          "[原神",
        ],
        soeWithKeywords: [
          "原神",
        ],
        uids: [
          // 原神
          "401742377",
        ],
        games: [
          "原神",
        ],
        tag: "[原神玩家]",
        icon: "https://i2.hdslb.com/bfs/face/d2a95376140fb1e5efbcbed70ef62891a3e5284f.jpg",
        color: "#ff0000",
        type: "Genshin",
      },
      // {
      //   keywords: [
      //     "王者荣耀",
      //   ],
      //   soeWithKeywords: [],
      //   uids: [
      //     "57863910",
      //     "392836434",
      //   ],
      //   games: [
      //     "王者荣耀",
      //   ],
      //   tag: "[王者荣耀玩家]",
      //   icon: "https://i2.hdslb.com/bfs/face/effbafff589a27f02148d15bca7e97031a31d772.jpg",
      //   color: "#79c7e7",
      //   type: "HOK",
      // },
    ]
    dynamicURL = "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space"
    lastplaygameURL = "https://api.bilibili.com/x/space/lastplaygame"
    get is_new() {
      return document.querySelectorAll(".reply-list").length != 0
    }
    get getDom() {
      if (this.is_new) {
        return document.querySelectorAll(".reply-list")
        // sub-reply-list
      }
      else {
        return document.querySelectorAll(".comment-list")
        // reply-box
      }
    }
    /**
     * @param {HTMLElement} node 
     * @returns {{
     * name: string,
     * uid: string,
     * dom: HTMLElement
     * }}
     */
    getUser(node) {
      if (this.is_new) {
        // console.log(node)
        return {
          name: node.innerText,
          uid: node.getAttribute("data-user-id"),
          dom: node
        }
      }
      else {
        /** @type {HTMLAnchorElement} */
        let child = node.children[0]
        if (child.href == undefined) {
          for (let _child of node.children) {
            if (_child.href != undefined) {
              child = _child
              break
            }
          }
        }
        if (child === undefined && child.href == undefined) return
        // console.log(child)
        let uid = child.getAttribute("data-usercard-mid") === null ? child.href.replace(/[^\d]/g, "") : child.getAttribute("data-usercard-mid")
        return {
          name: child.innerText,
          uid,
          dom: child
        }
      }
    }
    getUserList() {
      /**
       * @type {{
       * name: string,
       * uid: string,
       * dom: HTMLElement
       * }[]}
       */
      let list = []
      if (this.is_new) {
        let users = document.querySelectorAll(".user-name")
        let subuser = document.querySelectorAll(".sub-user-name")
        for (let user of users) {
          let u = this.getUser(user)
          if (u != undefined
            && !list.some(e => e.uid == u.uid)) {
            {
              list.push(u)
            }
          }
        }
        for (let user of subuser) {
          let u = this.getUser(user)
          if (u != undefined
            && !list.some(e => e.uid == u.uid)) {
            {
              list.push(u)
            }
          }
        }
      }
      else {
        let users = document.querySelectorAll(".user")
        for (let user of users) {
          let u = this.getUser(user)
          if (u != undefined
            && !list.some(e => e.uid == u.uid)) {
            {
              list.push(u)
            }
          }
        }
      }
      return list
    }
    /**
     * @param {string} uid 
     * @param {string} offset
     */
    async getUserDynamic(uid, offset = "") {
      // ?offset=&host_mid=
      if (uid == undefined) return
      /**
       * @type {{
       * code: number,
       * message: string,
       * ttl: number,
       * data: {
       *  has_more: boolean,
       *  items: {
       *   id_str: string,
       *   modules: {
       *    module_dynamic: {
       *     desc?: {
       *      rich_text_nodes: {
       *       orig_text: string,
       *       text: string,
       *       type: string
       *      }[],
       *      text: string
       *     },
       *     major?: {
       *      archive: {
       *       aid: string,
       *       title: string,
       *       desc: string,
       *      }
       *     }
       *    }
       *   },
       *   orig?: {
       *    modules: {
       *     module_author: {
       *      mid: string,
       *      name: string
       *     },
       *     module_dynamic: {
       *      desc?: {
       *       rich_text_nodes: {
       *        orig_text: string,
       *        text: string,
       *        type: string
       *       }[],
       *       text: string
       *      },
       *      major?: {
       *       archive: {
       *        aid: string,
       *        title: string,
       *        desc: string,
       *       }
       *      }
       *     }
       *    },
       *    type: string
       *   },
       *   type: string
       *  }[],
       *  offset: string,
       *  update_baseline: string,
       *  update_num: number
       * }
       * }}
       */
      let data = JSON.parse(await HTTPsend(`${this.dynamicURL}?offset=${offset}&host_mid=${uid}`,
        "GET",
        {
          "Referer": `https://space.bilibili.com/${uid}/dynamic`,
        }
      ))
      if (data.code != 0) {
        console.error(`[${NAME}][${D()}]: `, data)
        return
      }
      let items = data.data.items
      return {
        items,
        offset: data.data.offset,
      }
    }
    async getUserLastPlayGame(uid) {
      /**
       * @type {{
       * code: number,
       * message: string,
       * ttl: number,
       * data: {
       *  website: string,
       *  name: string,
       *  image: string
       * }[]
       * }}
       */
      let data = JSON.parse(await HTTPsend(`${this.lastplaygameURL}?mid=${uid}`,
        "GET",
        {
          "Referer": `https://space.bilibili.com/${uid}`,
        }
      ))
      if (data.code != 0) {
        console.error(`[${NAME}][${D()}]: `, data)
        return []
      }
      let items = data.data
      return items
    }
    /**
     * @param {{
       *   id_str: string,
     *   modules: {
     *    module_dynamic: {
     *     desc?: {
     *      rich_text_nodes: {
     *       orig_text: string,
     *       text: string,
     *       type: string
     *      }[],
     *      text: string
     *     },
     *     major?: {
     *      archive: {
     *       aid: string,
     *       title: string,
     *       desc: string,
     *      }
     *     }
     *    }
     *   },
     *   orig?: {
     *    modules: {
     *     module_author: {
     *      mid: string,
     *      name: string
     *     },
     *     module_dynamic: {
     *      desc?: {
     *       rich_text_nodes: {
     *        orig_text: string,
     *        text: string,
     *        type: string
     *       }[],
     *       text: string
     *      },
     *      major?: {
     *       archive: {
     *        aid: string,
     *        title: string,
     *        desc: string,
     *       }
     *      }
     *     }
     *    },
     *    type: string
     *   },
     *   type: string
     *  }[]} items
     */
    checkDynamicsIncludeKeyword(items) {
      let types = []
      for (let item of items) {
        let _types = this.checkDynamicIncludeKeyword(item)
        for (let type of _types) {
          if (!types.includes(type)) {
            types.push(type)
          }
        }
      }
      return [...new Set(types)]
      // return types
    }
    /**
     * @param {{
       *   id_str: string,
     *   modules: {
     *    module_dynamic: {
     *     desc?: {
     *      rich_text_nodes: {
     *       orig_text: string,
     *       text: string,
     *       type: string
     *      }[],
     *      text: string
     *     },
     *     major?: {
     *      archive: {
     *       aid: string,
     *       title: string,
     *       desc: string,
     *      }
     *     }
     *    }
     *   },
     *   orig?: {
     *    modules: {
     *     module_author: {
     *      mid: string,
     *      name: string
     *     },
     *     module_dynamic: {
     *      desc?: {
     *       rich_text_nodes: {
     *        orig_text: string,
     *        text: string,
     *        type: string
     *       }[],
     *       text: string
     *      },
     *      major?: {
     *       archive: {
     *        aid: string,
     *        title: string,
     *        desc: string,
     *       }
     *      }
     *     }
     *    },
     *    type: string
     *   },
     *   type: string
     *  }} item
     */
    checkDynamicIncludeKeyword(item) {
      if (item == undefined) return []
      /** @type {string[]} */
      let types = []
      if (item.modules.module_dynamic.desc != null) {
        types = this.checkKeyword(item.modules.module_dynamic.desc.text)
      }
      switch (item.type) {
        case "DYNAMIC_TYPE_FORWARD":
          {
            if (item.orig != undefined) {
              for (let _item of this.KeywordChecklist) {
                for (let uid of _item.uids) {
                  if (item.orig.modules.module_author.mid == uid) {
                    if (!types.includes(_item.type)) {
                      types.push(_item.type)
                    }
                  }
                }
              }
              switch (item.orig.type) {
                case "DYNAMIC_TYPE_DRAW":
                case "DYNAMIC_TYPE_COMMON_SQUARE":
                case "DYNAMIC_TYPE_WORD":
                  {
                    if (item.orig.modules.module_dynamic.desc != null) {
                      let _types = this.checkKeyword(item.orig.modules.module_dynamic.desc.text)
                      // 加入 types 中并去重
                      for (let type of _types) {
                        if (!types.includes(type)) {
                          types.push(type)
                        }
                      }
                    }
                  }
                  break
                case "DYNAMIC_TYPE_AV":
                  {
                    if (item.orig.modules.module_dynamic.desc != null) {
                      let _types = this.checkKeyword(item.orig.modules.module_dynamic.desc.text)
                      // 加入 types 中并去重
                      for (let type of _types) {
                        if (!types.includes(type)) {
                          types.push(type)
                        }
                      }
                    }
                    if (item.orig.modules.module_dynamic.major != null) {
                      Console_Devlog(item.orig.modules.module_dynamic.major)
                      let _types = this.checkKeyword(item.orig.modules.module_dynamic.major?.archive?.title)
                      // 加入 types 中并去重
                      for (let type of _types) {
                        if (!types.includes(type)) {
                          types.push(type)
                        }
                      }
                      _types = this.checkKeyword(item.orig.modules.module_dynamic.major?.archive?.desc)
                      // 加入 types 中并去重
                      for (let type of _types) {
                        if (!types.includes(type)) {
                          types.push(type)
                        }
                      }
                    }
                  }
                  break
                case "DYNAMIC_TYPE_NONE":
                  {
                  }
                  break
              }
            }
          }
          break
        case "DYNAMIC_TYPE_AV":
          {
            if (item.modules.module_dynamic.major != null) {
              let _types = this.checkKeyword(item.modules.module_dynamic.major?.archive?.title)
              // 加入 types 中并去重
              for (let type of _types) {
                if (!types.includes(type)) {
                  types.push(type)
                }
              }
              _types = this.checkKeyword(item.modules.module_dynamic.major?.archive?.desc)
              // 加入 types 中并去重
              for (let type of _types) {
                if (!types.includes(type)) {
                  types.push(type)
                }
              }
            }
          }
          break
        case "DYNAMIC_TYPE_DRAW":
        case "DYNAMIC_TYPE_WORD":
          {
          }
          break
        default:
          break
      }
      return [...new Set(types)]
      // return types
    }
    /**
     * 
     * @param {string} text 
     * @returns {string[]}
     */
    checkKeyword(text) {
      let types = []
      // 循环 this.KeywordChecklist
      if (text != null) {
        for (let item of this.KeywordChecklist) {
          for (let keyword of item.keywords) {
            if (text.includes(keyword)
              && !types.includes(item.type)) {
              types.push(item.type)
            }
          }
          for (let keyword of item.soeWithKeywords) {
            if ((text.startsWith(keyword) || text.endsWith(keyword))
              && !types.includes(item.type)) {
              types.push(item.type)
            }
          }
        }
      }
      return types
    }
    async checkUser() {
      if (this.running) return
      if (this.list.length == 0) return
      this.running = true
      // 复制一份 this.list
      let list = this.list.slice()
      for (let user of list) {
        /** 
         * @type {{
         * website: string;
         * name: string;
         * image: string;
         * }[]|undefined} */
        let games = undefined
        let needCheck = false
        for (let item of this.KeywordChecklist) {
          if (!bLab8A.data[item.type]) {
            bLab8A.data[item.type] = []
          }
          if (bLab8A.data[item.type].some(e => e.uid == user.uid)) {
            console.log(`[${NAME}][${D()}]: `, `已知的${item.tag}`, user)
            if (user.dom != undefined) {
              this.insertSpan(user.dom, item)
            }
            continue
          }
          else if (!bLab8A.data.none_Player.some(e => e.uid == user.uid)) {
            needCheck = true
          }
        }
        if (!needCheck) {
          continue
        }
        console.log(`[${NAME}][${D()}]: `, `检查用户 ${user.name}`)
        /** @type {string[]} */
        let types = []
        if (games === undefined) {
          games = await this.getUserLastPlayGame(user.uid)
          if (games.length != 0) {
            for (let game of games) {
              // 判断 game.name 是否和 this.KeywordChecklist 里的 games 一致
              for (let item of this.KeywordChecklist) {
                if (item.games.includes(game.name)
                  && !types.includes(item.type)) {
                  types.push(item.type)
                }
              }
            }
          }
        }
        // await RList.Push()
        let dynamic = await this.getUserDynamic(user.uid)
        if (dynamic == undefined) continue
        if (dynamic.items.length == 0) continue
        types = [...new Set([...types, ...this.checkDynamicsIncludeKeyword(dynamic.items)])]
        // await RList.Push()
        dynamic = await this.getUserDynamic(user.uid, dynamic.offset)
        if (dynamic != undefined
          && dynamic.items.length !== 0) {
          // 合并 types 并去重
          types = [...new Set([...types, ...this.checkDynamicsIncludeKeyword(dynamic.items)])]
        }
        if (types.length !== 0) {
          console.log(`[${NAME}][${D()}]: `, `游戏玩家${types.join(",")}`, user)
          for (let type of types) {
            if (!bLab8A.data[type]) {
              bLab8A.data[type] = []
            }
            bLab8A.data[type].push({
              uid: user.uid,
              name: user.name,
            })
            bLab8A.save()
            // 从 this.KeywordChecklist 找到 type 一致的项
            let _item = this.KeywordChecklist.find(e => e.type == type)
            if (_item != undefined) {
              this.insertSpan(user.dom, _item)
            }
          }
        }
        else {
          console.log(`[${NAME}][${D()}]: `, "非游戏玩家", user)
          if (!bLab8A.data.none_Player) {
            bLab8A.data.none_Player = []
          }
          bLab8A.data.none_Player.push({
            uid: user.uid,
            name: user.name,
          })
          bLab8A.save()
        }
      }
      this.running = false
      // 删除已经检查过的用户
      for (let user of list) {
        this.list.splice(this.list.indexOf(user), 1)
      }
      if (this.list.length != 0) {
        this.checkUser()
      }
    }
    /**
     * @param {HTMLElement} dom 
     * @param {{
     *  tag: string,
     *  type: string,
     *  color: string,
     * }} item 
     */
    insertSpan(dom, item) {
      if (dom != undefined) {
        if (dom.querySelector(`span.check_tag_${item.type}`) != null) {
          return
        }
        let span = document.createElement("span")
        span.classList.add(`check_tag_${item.type}`)
        span.style.color = item.color
        span.title = `非准确结果，是否为${item.tag}请自行判断`
        span.innerText = item.tag
        dom.appendChild(span)
      }
    }
  }
  let checker = new Checker()

  /**
   * @param {MutationRecord[]} mutationList 
   * @param {MutationObserver} observer 
   */
  let callback = (mutationList, observer) => {
    Console_Devlog(`[${NAME}][${D()}]: `, "callback", mutationList)
    let list = checker.getUserList()
    for (let item of list) {
      if (!checker.list.some(e => e.dom == item.dom)) {
        checker.list.push(item)
      }
    }
    checker.checkUser()
    // mutationList.forEach(mutation => {
    //   if (mutation.type == "childList") {
    //     // [0].addedNodes[0].children[1].children[0].children[0].href
    //     // mutation.addedNodes.forEach(node => {
    //     //   if (checker.is_new) {
    //     //     try {

    //     //     } catch (error) {

    //     //     }
    //     //   }
    //     //   else {
    //     //     try {
    //     //       console.log(node.childNodes[1].childNodes[0].childNodes[0].href)
    //     //     } catch (error) {

    //     //     }
    //     //   }
    //     // })
    //   }
    // })
  }

  /** @type {MutationObserverInit} */
  let observerOption = {
    childList: true,
    subtree: true,
  }

  let observer = new MutationObserver(callback)
  // while 检测 checker.getDom
  while (checker.getDom.length == 0) {
    console.log(`[${NAME}][${D()}]: `, "寻找中")
    await RList.Push()
  }
  for (let _dom of checker.getDom) {
    observer.observe(_dom, observerOption)
  }
  // observer.observe(checker.getDom[0], observerOption)
  Console_Devlog(`[${NAME}][${D()}]: `, "开始监听")

  // 先获取一次列表
  let list = checker.getUserList()
  for (let item of list) {
    if (!checker.list.some(e => e.dom == item.dom)) {
      checker.list.push(item)
    }
  }
  checker.checkUser()
})()