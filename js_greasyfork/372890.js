// ==UserScript==
// @name         bilibili三连
// @version      0.0.22
// @include      https://www.bilibili.com/video/av*
// @include      https://www.bilibili.com/video/BV*
// @include      https://www.bilibili.com/medialist/play/*
// @description  推荐投币收藏一键三连
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/164996
// @downloadURL https://update.greasyfork.org/scripts/372890/bilibili%E4%B8%89%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/372890/bilibili%E4%B8%89%E8%BF%9E.meta.js
// ==/UserScript==
const find = (selector) => {
  return document.querySelector(selector)
}
const click = (s) => {
  if (!s) return
  if (s instanceof HTMLElement) s.click()
  else {
    const n = document.querySelector(s)
    if (!n) return
    n.click()
  }
  return true
}
const waitForAllByObserver = (
  selectors,
  {
    app = document.documentElement,
    timeout = 3000,
    childList = true,
    subtree = true,
    attributes = true,
    disappear = false,
  } = {}
) => {
  return new Promise((resolve) => {
    let observer_id
    let timer_id
    const check = () => {
      const nodes = selectors.map((i) => document.querySelector(i))
      if (Object.values(nodes).every((v) => (disappear ? !v : v))) {
        if (observer_id != undefined) observer_id.disconnect()
        if (timer_id != undefined) clearTimeout(timer_id)
        resolve(nodes)
      }
    }
    if (check()) return
    observer_id = new MutationObserver(check)
    if (timeout != Infinity) {
      timer_id = setTimeout(() => {
        observer_id.disconnect()
        clearTimeout(timer_id)
        resolve()
      }, timeout)
    }
    observer_id.observe(app, { childList, subtree, attributes })
  })
}
const sleep = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
const state = {
  get(k) {
    return this.state[k]
  },
  set(k, v) {
    this.state[k] = v
    this.render()
    GM_setValue('state', JSON.stringify(this.state))
  },
  toggle(k) {
    this.set(k, !this.state[k])
  },
  state: {},
  node: {},
  default_state: {
    like: true,
    coin: 0,
    collect: true,
    collection: '输入收藏夹名',
  },
  render() {
    const { like, coin, coin_value, collect, collection } = this.node
    const get = this.get.bind(this)
    if (get('like')) like.classList.add('sanlian_on')
    else like.classList.remove('sanlian_on')
    if (get('coin')) coin.classList.add('sanlian_on')
    else coin.classList.remove('sanlian_on')
    coin_value.innerHTML = 'x' + get('coin')
    if (get('collect')) collect.classList.add('sanlian_on')
    else collect.classList.remove('sanlian_on')
    collection.value = get('collection')
  },
  load(state_str) {
    try {
      this.state = JSON.parse(state_str)
      for (let k of Object.keys(this.default_state)) {
        if (typeof this.default_state[k] != typeof this.state[k]) {
          throw `${k}'s type is not same as default`
        }
      }
    } catch (e) {
      this.state = { ...this.default_state }
    }
    this.render()
  },
  remove_coin_leading_space() {
    const trim = () => {
      const coin_text = document.querySelector(this.selector.coin + ' i')
        .nextSibling
      if (
        coin_text.nodeType == Node.TEXT_NODE &&
        coin_text.textContent != coin_text.textContent.trim()
      ) {
        coin_text.textContent = coin_text.textContent.trim()
      }
    }
    new MutationObserver(trim).observe(
      document.querySelector(this.selector.coin),
      { characterData: true, subtree: true }
    )
    trim()
  },
  addStyle() {
    const css = `
      #sanlian > div {
        display: none;
        position: absolute;
        color: SlateGray;
        background: white;
        border: 1px solid #e5e9ef;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
        border-radius: 2px;
        padding: 1em;
        cursor: default;
        z-index: 2;
      }
      #sanlian_like {
        margin: 0 1em 0 0;
      }
      #sanlian_coin {
        margin: 0 1em 0 0;
      }
      #sanlian input {
        color: SlateGrey;
        cursor: text;
      }
      #sanlian span[id^='sanlian_'] * {
        color: SlateGrey;
        cursor: pointer;
        user-select: none;
      }
      #sanlian span[id^='sanlian_'].sanlian_on * {
        color: SlateBlue;
      }
      #sanlian span[id^='sanlian_']:hover * {
        color: DarkSlateBlue;
      }
      #sanlian > div > input {
        border: 0;
        border-bottom: 1px solid;
      }
      #sanlian span#sanlian_coin i {
        margin: 0;
      }
      #sanlian > i.iconfont {
        margin-left: -1em;
        transform-origin: right;
        transform: scale(0.4, 0.8);
        display: inline-block;
      }
      .video-toolbar .ops > span {
        width: 88px;
      }
      ${this.selector.coin_dialog}, ${this.selector.collect_dialog} {
        display: block;
      }
    `
    const style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css))
    document.head.appendChild(style)

    const rules = style.sheet.rules
    this.node.dialog_style = rules[rules.length - 1].style
    this.remove_coin_leading_space()
  },
  addNode() {
    const { collect } = this.node
    const { selector } = this
    const sanlian = collect.cloneNode(true)
    const sanlian_icon = sanlian.querySelector('i')
    const sanlian_text =
      sanlian_icon.nextElementSibling || sanlian_icon.nextSibling
    sanlian.id = 'sanlian'
    sanlian.classList.remove('on')
    sanlian.title = '推荐硬币收藏'
    const sanlian_canvas = sanlian.querySelector('canvas')
    if (sanlian_canvas) sanlian_canvas.remove()
    sanlian_icon.innerText = ''
    sanlian_icon.classList.remove('blue')
    sanlian_icon.classList.add('van-icon-tuodong')
    sanlian_text.textContent = '三连'
    const sanlian_panel = document.createElement('div')
    for (const name of ['like', 'coin', 'collect']) {
      const wrapper = document.createElement('span')
      wrapper.id = `sanlian_${name}`
      const node = document.querySelector(selector[name] + ' i').cloneNode(true)
      node.classList.remove('blue')
      wrapper.appendChild(node)
      if (name == 'coin') {
        wrapper.insertAdjacentHTML('beforeend', `<span>x${state.coin}</span>`)
      }
      sanlian_panel.appendChild(wrapper)
      this.node[name] = wrapper
    }
    sanlian_panel.insertAdjacentHTML('beforeend', `<input type="text">`)
    sanlian.appendChild(sanlian_panel)
    collect.parentNode.insertBefore(sanlian, collect.nextSibling)
    Object.assign(this.node, {
      coin_value: document.querySelector('#sanlian_coin span'),
      collection: document.querySelector('#sanlian input'),
      sanlian,
      sanlian_icon,
      sanlian_text,
      sanlian_panel,
    })
  },
  addListener() {
    const {
      app,
      coin,
      collect,
      collection,
      dialog_style,
      like,
      sanlian,
      sanlian_icon,
      sanlian_panel,
      sanlian_text,
    } = this.node

    const {
      coin_close,
      coin_dialog,
      coin_left,
      coin_off,
      coin_right,
      coin_yes,
      collect_choice,
      collect_close,
      collect_dialog,
      collect_yes,
      like_off,
    } = this.selector
    const selector = this.selector
    const get = this.get.bind(this)
    const set = this.set.bind(this)
    const toggle = this.toggle.bind(this)
    like.addEventListener('click', function () {
      toggle('like')
    })
    coin.addEventListener('click', function () {
      set('coin', (get('coin') + 1) % 3)
    })
    collect.addEventListener('click', function () {
      toggle('collect')
    })
    like.addEventListener('contextmenu', function () {
      toggle('like')
    })
    coin.addEventListener('contextmenu', function () {
      set('coin', (get('coin') + 2) % 3)
    })
    collect.addEventListener('contextmenu', function () {
      toggle('collect')
    })
    collection.addEventListener('keyup', function () {
      set('collection', collection.value)
    })
    sanlian.addEventListener('mouseover', () => {
      sanlian_panel.style.display = 'flex'
    })
    sanlian.addEventListener('mouseout', () => {
      sanlian_panel.style.display = 'none'
    })
    const like_handler = async () => {
      if (get('like')) click(like_off)
    }
    const coin_handler = async () => {
      if (!get('coin') > 0 || !click(coin_off)) return
      if (!(await waitForAllByObserver([coin_left]))) return
      if (get('coin') === 1) click(coin_left)
      else click(coin_right)
      await sleep(0) // only for visual updating
      click(coin_yes)
      await Promise.race([
        waitForAllByObserver([coin_dialog], { disappear: true }),
        waitForAllByObserver(['.error']),
      ])
      click(coin_close)
    }
    const collect_handler = async () => {
      if (
        !get('collect') ||
        !click(selector.collect) ||
        !(await waitForAllByObserver([collect_choice]))
      ) {
        click('i.close')
        return
      }
      const choices = document.querySelectorAll(selector.collect_choice)
      const choice =
        [...choices].find(
          (i) => i.nextElementSibling.textContent.trim() === get('collection')
        ) || choices[0]
      // already collect
      if (
        !choice ||
        choice.previousElementSibling.checked ||
        !click(choice) ||
        !(await waitForAllByObserver([collect_yes]))
      ) {
        click('i.close')
        return
      }
      click(collect_yes)
      await waitForAllByObserver([collect_dialog], { disappear: true })
    }
    sanlian.addEventListener('click', async (e) => {
      if (![sanlian, sanlian_icon, sanlian_text].includes(e.target)) return
      dialog_style.display = 'none'
      const fallback = setTimeout(() => {
        dialog_style.display = 'block'
      }, 3500)
      await like_handler()
      await coin_handler()
      await collect_handler()
      clearTimeout(fallback)
      dialog_style.display = 'block'
    })
  },
  selector: {
    app: 'div#app',
    coin: '#arc_toolbar_report span.coin',
    coin_close: 'div.bili-dialog-m div.coin-operated-m i.close',
    collect_close: 'div.bili-dialog-m div.collection-m i.close',
    coin_dialog: '.bili-dialog-m',
    coin_left: '.mc-box.left-con',
    coin_off: '#arc_toolbar_report span.coin:not(.on)',
    coin_right: '.mc-box.right-con',
    coin_yes: 'div.coin-bottom > span',
    collect: '#arc_toolbar_report span.collect',
    collect_choice: 'div.collection-m div.group-list input+i',
    collect_dialog: '.bili-dialog-m',
    collect_off: '#arc_toolbar_report span.collect:not(.on)',
    collect_yes: 'div.collection-m button.submit-move:not([disable])',
    like: '#arc_toolbar_report span.like',
    like_off: '#arc_toolbar_report span.like:not(.on)',
    people: 'div.bilibili-player-video-info-people-number',
  },
  async init() {
    let { collect, app, people } = this.selector
    ;[collect, app, people] = await waitForAllByObserver(
      [collect, app, people],
      { timeout: Infinity }
    )
    if (!collect) return
    Object.assign(this.node, { collect, app })
    this.addStyle()
    this.addNode()
    this.addListener()
    this.load(GM_getValue('state'))
    GM_addValueChangeListener('state', (name, old_state, new_state) => {
      if (JSON.stringify(this.state) == new_state) return
      this.load(new_state)
    })
  },
}
state.init()
