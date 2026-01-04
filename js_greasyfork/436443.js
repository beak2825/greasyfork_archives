// ==UserScript==
// @name         排队姬
// @namespace    http://tampermonkey.net/
// @version      0.0.18
// @description  原神直播间深渊排队脚本
// @author       Mimiko
// @license      MIT
// @match        *://live.bilibili.com/3140454*
// @match        *://live.bilibili.com/21738259*
// @icon         http://i0.hdslb.com/bfs/activity-plat/static/20211202/dddbda27ce6f43bf18f5bca141752a99/fCo7evLooK.webp@128w
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/436443/%E6%8E%92%E9%98%9F%E5%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/436443/%E6%8E%92%E9%98%9F%E5%A7%AC.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/436443-%E6%8E%92%E9%98%9F%E5%A7%AC

;(() => {
  if (window.top !== window.self) return
  // variable
  const Dictionary = {
    admin_not_found: '未指定管理员',
    already_in_queue: '{name}已经排过队了，序号是{index}',
    draw_cancel: '报号已取消',
    draw_countdown: '报号倒计时十秒',
    draw_done: '请序号为{index}的{name}使用手机扫码',
    draw_fail: '未能成功报号',
    draw_start: '开始报号啦，请大家输入自己的序号',
    empty_draw: '没有人在报号',
    found_in_queue: '{name}已经排过队了，序号是{index}',
    not_found_in_queue: '{name}还没有排队',
    queued_done: '{name}已经排队成功，序号是{index}',
    server_not_ready: '排队姬尚未启动',
    server_ready: '排队姬已经启动',
    voice_server_unavailable: '无法连接语音服务器',
    voice_setting_done: '语音已设置为{name}',
    voice_setting_fail: '语音设置失败',
    voice_unavailable: '语音不存在',
  }
  const Keyword = {
    draw_cancel: ['停止报号'],
    draw_start: ['报号'],
    queue_add: ['排队'],
    queue_find: ['查询排队', '排队查询'],
    queue_set_current: ['设置当前序号'],
    voice_set: ['切换语音', '语音切换'],
  }
  const Monkey = GM
  // class
  class Admin {
    #list = new Set()
    has(name) {
      return this.#list.has(name)
    }
    async load() {
      const data = await system.get('admin/list')
      if (!data) return false
      if (!data.list.length) {
        speaker.say(Dictionary.admin_not_found)
        return false
      }
      this.#list = new Set(data.list.filter(name => !!name.trim()))
      return true
    }
    watch() {
      window.setInterval(() => this.load(), 30e3)
    }
  }
  const admin = new Admin()
  class Browser {
    #observer = new MutationObserver(() => {
      browser.pick()
      browser.clearDanmaku()
    })
    clearDanmaku() {
      const $el = document.getElementById('chat-items')
      if (!$el) return
      $el.innerHTML = ''
    }
    observe() {
      const timer = window.setInterval(() => {
        const $el = document.getElementById('chat-items')
        if (!$el) return
        window.clearInterval(timer)
        this.#observer.observe($el, {
          childList: true,
          attributes: true,
          characterData: true,
        })
      }, 50)
    }
    pauseVideo() {
      document.querySelector('video')?.pause()
    }
    pick() {
      Array.from(
        document.querySelectorAll('#chat-items .danmaku-item'),
      ).forEach($danmaku => {
        const content = $danmaku.getAttribute('data-danmaku')?.trim() || ''
        const name = $danmaku.getAttribute('data-uname')?.trim() || ''
        console.log(
          [name, admin.has(name) ? '[Admin]' : '', ': ', content].join(''),
        )
        // admin
        if (admin.has(name)) {
          if (Keyword.draw_start.includes(content)) return drawing.start()
          if (Keyword.draw_cancel.includes(content)) return drawing.cancel()
          for (const key of Keyword.queue_set_current) {
            if (content.startsWith(key))
              return queue.setCurrent(
                parseInt(content.slice(key.length).trim() || '0'),
              )
          }
          for (const key1 of Keyword.voice_set) {
            if (content.startsWith(key1))
              return speaker.setVoice(content.replace(key1, '').trim() || '')
          }
        }
        // user
        if (Keyword.queue_add.includes(content)) return queue.add(name)
        for (const key2 of Keyword.queue_find) {
          if (content.startsWith(key2))
            return queue.find(content.replace(key2, '').trim() || name)
        }
        if (drawing.isPending) {
          const idx = parseInt(content)
          if (idx > 0 && idx.toString() === content) return drawing.add(idx)
        }
        // others
        return
      })
    }
  }
  const browser = new Browser()
  class Drawing {
    #cache = new Set()
    #delay = 30e3
    isPending = false
    add(idx) {
      if (this.#cache.has(idx)) return
      this.#cache.add(idx)
    }
    cancel() {
      if (!this.isPending) return
      this.isPending = false
      this.#cache.clear()
      system.removeTimer('waiting/countdown')
      system.removeTimer('waiting/speak')
      speaker.say(Dictionary.draw_cancel)
    }
    end() {
      if (!this.isPending) return
      this.isPending = false
      if (!this.#cache.size) {
        speaker.say(Dictionary.empty_draw)
        return
      }
      const idx = Math.min(...this.#cache)
      this.#cache.clear()
      queue.setCurrent(idx)
    }
    start() {
      if (this.isPending) return
      this.isPending = true
      this.#cache.clear()
      system.addTimer('waiting/countdown', this.#delay, () => this.end())
      speaker.say(Dictionary.draw_start)
      system.addTimer('waiting/speak', this.#delay - 10e3, () =>
        speaker.say(Dictionary.draw_countdown),
      )
    }
  }
  const drawing = new Drawing()
  class Queue {
    async add(name) {
      if (!system.validate(name)) return
      const data = await system.get(`queue/add?name=${name}`)
      if (!data) return
      if (!data.status) {
        speaker.say(Dictionary.already_in_queue, {
          index: data.index.toString(),
          name,
        })
        return
      }
      speaker.say(Dictionary.queued_done, {
        index: data.index.toString(),
        name,
      })
    }
    async find(name) {
      if (!system.validate(name)) return
      const data = await system.get(`queue/find?name=${name}`)
      if (!data) return
      if (!data.status) {
        speaker.say(Dictionary.not_found_in_queue, {
          name,
        })
        return
      }
      speaker.say(Dictionary.found_in_queue, {
        index: data.index.toString(),
        name,
      })
    }
    async setCurrent(index) {
      const data = await system.get(`queue/setCurrent?index=${index}`)
      if (!data) return
      if (!data.status) {
        speaker.say(Dictionary.draw_fail)
        return
      }
      speaker.say(Dictionary.draw_done, {
        index: data.index.toString(),
        name: data.name,
      })
    }
  }
  const queue = new Queue()
  class Speaker {
    #listLocal = ['huihui', 'kangkang', 'yaoyao']
    #listValid = [
      'hiumaan',
      'hsiaochen',
      'huihui',
      'kangkang',
      'xiaoxiao',
      'yaoyao',
      'yunyang',
    ]
    #speaker = new SpeechSynthesisUtterance()
    say(message, data) {
      let msg = message
      if (data)
        Object.keys(data).forEach(
          key => (msg = msg.replace(`{${key}}`, data[key].toString())),
        )
      console.log(msg)
      this.#speaker.text = msg
      window.speechSynthesis.speak(this.#speaker)
    }
    async setVoice(name) {
      if (!this.#listValid.includes(name)) return
      if (!this.#listValid.includes(name)) {
        this.say(Dictionary.voice_unavailable)
        return
      }
      const isLocal = this.#listLocal.includes(name)
      if (!isLocal) {
        const result = await system.get('https://speech.platform.bing.com/')
        if (!result) {
          this.say(Dictionary.voice_server_unavailable)
          return
        }
      }
      let n = 0
      const fn = () => {
        const voice = speechSynthesis
          .getVoices()
          .filter(it => it.name.toLowerCase().includes(name))[0]
        if (!voice) {
          n++
          if (n > 10) {
            this.say(Dictionary.voice_setting_fail)
            return
          }
          system.addTimer('voice/set', 100, fn)
          return
        }
        this.#speaker.voice = voice
        this.say(Dictionary.voice_setting_done, {
          name,
        })
      }
      fn()
    }
  }
  const speaker = new Speaker()
  class System {
    #cacheTimer = new Map()
    #cacheTs = new Map()
    #interval = 5e3
    #port = 9644
    addTimer(token, delay, callback) {
      this.removeTimer(token)
      this.#cacheTimer.set(token, window.setTimeout(callback, delay))
    }
    get(url) {
      return new Promise(resolve => {
        Monkey.xmlHttpRequest({
          method: 'GET',
          onerror: () => resolve(null),
          onload: response =>
            resolve(
              url.startsWith('http')
                ? response.responseText
                : JSON.parse(response.responseText),
            ),
          url: url.startsWith('http')
            ? url
            : `http://localhost:${this.#port}/${url}`,
        })
      })
    }
    async ping() {
      const data = await system.get('system/ping')
      if (!data) {
        speaker.say(Dictionary.server_not_ready)
        return false
      }
      speaker.say(Dictionary.server_ready)
      return true
    }
    removeTimer(token) {
      const n = this.#cacheTimer.get(token)
      if (!n) return
      this.#cacheTimer.delete(token)
      window.clearTimeout(n)
    }
    validate(name) {
      if (admin.has(name)) return true
      const ts = this.#cacheTs.get(name) || 0
      const now = Date.now()
      if (now - ts < this.#interval) return false
      this.#cacheTs.set(name, now)
      return true
    }
  }
  const system = new System()
  // function
  const main = async () => {
    browser.pauseVideo()
    if (!(await system.ping())) return
    if (!(await admin.load())) return
    browser.observe()
    browser.clearDanmaku()
  }
  // execute
  system.addTimer('main', 1e3, main)
})()
