// ==UserScript==
// @name        笔趣阁优化 for iOS
// @namespace   Violentmonkey Scripts
// @match       https://lingjingxingzhe.com/*.html
// @match       https://m.xxbiqudu.com/*.html
// @grant       GM.addStyle
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @version     0.1.1
// @author      LinHQ
// @license     GPLv3
// @description 极简的 iOS Safari 端辅助小说阅读脚本
// @downloadURL https://update.greasyfork.org/scripts/459480/%E7%AC%94%E8%B6%A3%E9%98%81%E4%BC%98%E5%8C%96%20for%20iOS.user.js
// @updateURL https://update.greasyfork.org/scripts/459480/%E7%AC%94%E8%B6%A3%E9%98%81%E4%BC%98%E5%8C%96%20for%20iOS.meta.js
// ==/UserScript==

(async () => {
  const version = '0.1.1'

  // 自定义主题
  const themes = {
    black: {
      background: 'black',
      foreground: '#d3d3d3'
    },
    light: {
      background: '#eeeeee',
      foreground: 'black'
    }
  }

  const typo = new Proxy({
    // 字体大小
    fontSize: 20,
    // 行高
    lineHeight: 1.5,
    // 默认主题
    theme: 'light'
  }, {
    set(target, prop, value) {
      switch (prop) {
        case 'theme':
          const content = document.body.querySelector(site.content)
          document.head.querySelector('meta[name="theme-color"]').content = themes[value]['background']
          content.style.backgroundColor = themes[value]['background']
          content.style.color = themes[value]['foreground']
          break
      }
      return Reflect.set(...arguments)
    }
  })

  // 注入 meta 更改状态栏颜色
  document.head.insertAdjacentHTML('beforeend', `<meta name="theme-color" content="${themes[typo.theme].background}">`)

  // 自定义网站配置
  let sites = [
    {
      host: 'lingjingxingzhe.com',
      title: 'h1.title',
      content: '#content',
      segment: 'div.read_tip', // 控制拼页的元素，不能隐藏
      filters: ['.header', '.nav'],
      banRegex: []
    },
    {
      host: 'm.xxbiqudu.com',
      title: '.title',
      content: 'div.text',
      segment: 'div.navigator-nobutton', // 控制拼页的元素，不能隐藏
      filters: ['.navigator-no', '.title+script+div', '.google-auto-placed'],
      banRegex: [/请记住.+网址/g]
    }
  ]
    , basicStyle = `
  body {
    padding-top: 0!important;
  }
  img {
    display: none!important;
  }
  `
    , navigator = null
    , storeKey = null
    , config = null

  /** 
   * 注入基本样式并加载配置
   *
   * @return
   */
  async function boot() {
    const currentSite = sites.find(site => document.URL.includes(site.host))
    // 添加广告过滤样式和默认央视
    basicStyle += `
    ${currentSite.filters.join(',')} {display: none!important}
    ${currentSite.content} {background: ${themes[typo.theme].background}; color: ${themes[typo.theme].foreground};}
    `
    GM.addStyle(basicStyle)

    const urlArr = new URL(document.URL).pathname.split('/')
    urlArr.pop()
    storeKey = currentSite.host + urlArr.join('/')

    const defaultConfig = {
      version: version,
      last: document.URL
    }

    // 状态读取与还原
    config = await GM.getValue(storeKey, defaultConfig)
    if (config.version !== version) {
      await GM.deleteValue(storeKey)
      config = defaultConfig
    }
    if (config.last !== document.URL) {
      if (confirm("是否回到上次阅读章节？")) {
        window.open(config.last, "_self")
      } else {
        config = defaultConfig
      }
    }

    navigator = parseNav(document.body)

    GM.setValue(storeKey, config)

    return currentSite
  }

  function sleep(time) {
    return new Promise(res => {
      setTimeout(res, time)
    })
  }

  function parseNav(doc) {
    let links = {}
    for (const a of doc.querySelectorAll('a')) {
      if (Object.keys(links).length === 2) break
      else if (a.textContent.includes('上一'))
        links.previous = a.href
      else if (a.textContent.includes('下一'))
        links.next = a.href
    }
    return links
  }

  function navigate(url, jump = false) {
    return GM.setValue(storeKey, {...config, last: url}).then(() => {
      if (jump) window.open(url, '_self')
    })
  }

  const site = await boot()

  const txt = document.querySelector(site.content)
    , segment = document.querySelector(site.segment)
  if (!segment) {
    return console.error('无法寻找到 segment，请重新配置脚本。')
  }
  const observer = new IntersectionObserver(async entries => {
    if (entries[0].isIntersecting) {
      observer.unobserve(segment)

      // 下面开始执行无限加载
      try {
        const newPage = await fetch(navigator.next).then(resp => resp.arrayBuffer()),
          decoder = new TextDecoder(document.characterSet)

        const newDoc = new DOMParser().parseFromString(decoder.decode(newPage), 'text/html')

        const newTitle = newDoc.querySelector(site.title).textContent
        if (newTitle !== document.querySelector(site.title).textContent) {
          txt.insertAdjacentHTML("beforeend", "<br><hr style='border: unset;border-top: 1px solid gray; margin: 30px 0'>")
          txt.insertAdjacentHTML("beforeend", `<h3 style='width: 100%; text-align: center; color: gray;'>${newTitle}</h3>`)
        }

        let newText = newDoc.querySelector(site.content).innerHTML
        site.banRegex.forEach(reg => newText = newText.replaceAll(reg, ''))
        txt.insertAdjacentHTML('beforeend', newText)

        // 更新状态
        navigate(navigator.next)
        navigator = parseNav(newDoc.body)
      } catch (e) {
        console.error(e)
      } finally {
        observer.observe(segment)
      }
    }
  }, {
    // 进入可见区域之前进行检测
    rootMargin: window.innerHeight / 3 + 'px'
  })
  observer.observe(segment)

  txt.style.fontSize = `${typo.fontSize}px`
  txt.style.lineHeight = typo.lineHeight + ''

  txt.addEventListener('click', async event => {
    const viewHeight = window.innerHeight,
      viewWidth = window.innerWidth
    /*
     * 先判断上下翻页
     * 再判断左右跳章
     */
    if (event.clientY <= viewHeight / 3) {
      window.scrollBy(0, -1 * viewHeight - typo.fontSize * typo.lineHeight * 2)
    } else if (event.clientY >= viewHeight * 3 / 4) {
      window.scrollBy(0, viewHeight - typo.fontSize * typo.lineHeight * 2)
    } else {
      const {previous, next, current} = navigator
      if (event.clientX < viewWidth / 3) {
        navigate(previous, true)
      } else if (event.clientX > viewWidth * 3 / 4) {
        navigate(next, true)
      } else {
        typo.theme = typo.theme === 'black' ? 'light' : 'black'
      }
    }
  })

  // 清除进度数据，并重新载入
  window.onbeforeunload = async function () {
    const keys = await GM.listValues()
    await Promise.all(keys.filter(key => key !== storeKey).map(GM.deleteValue))
  }
})()
