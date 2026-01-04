// ==UserScript==
// @name         Confluence Plus
// @namespace    https://blog.simplenaive.cn
// @version      0.14
// @description  Add permalink to conflucence document, Enhanced side tree, Markdown Editor, Fast Access Badges.
// @author       Yidadaa
// @match        https://confluence.zhenguanyu.com/*
// @match        https://iwiki.woa.com/pages/*
// @icon         https://www.google.com/s2/favicons?domain=zhenguanyu.com
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/markdown-it@12.2.0/dist/markdown-it.min.js
// @downloadURL https://update.greasyfork.org/scripts/431285/Confluence%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/431285/Confluence%20Plus.meta.js
// ==/UserScript==

// extend history listener
(function (history) {
  const pushState = history.pushState;
  history.pushState = function (state) {
    if (typeof history.onpushstate == "function") {
      history.onpushstate({ state: state });
    }
    return pushState.apply(history, arguments);
  };
})(window.history);

class Markdown {
  constructor() {
    this.createInputDom()
    this.mdit = new window.markdownit()
    this.dom = document.createElement('div')
    this.dom.className = '_yifei-md-content'
  }

  createInputDom() {
    const mdWrapper = document.createElement('div')
    mdWrapper.className = '_yifei-markdown'

    const mdInput = document.createElement('textarea')
    mdInput.className = '_yifei-md-input _yifei-markdown-hidden'
    mdInput.placeholder = '本编辑器会在页面的光标处插入 html 文本'
    
    const mdTitle = document.createElement('div')
    mdTitle.className = '_yifei-md-title'
    mdTitle.innerText = 'Markdown 编辑器'
    mdTitle.onclick = () => {
      mdTitle.shouldShow = !mdTitle.shouldShow
      if (mdTitle.shouldShow) {
        mdInput.classList.remove('_yifei-markdown-hidden')
      } else {
        mdInput.classList.add('_yifei-markdown-hidden')
      }
    }

    mdInput.oninput = () => {
      const res = this.mdit.render(mdInput.value)
      console.log('[md] ', res)
      this.dom.innerHTML = res
      this.render()
    }

    mdWrapper.appendChild(mdTitle)
    mdWrapper.appendChild(mdInput)
    document.body.appendChild(mdWrapper)
  }

  render() {
    let contentDom = Array.from(window.frames).find(v => v.document.body.id == 'tinymce')

    if (contentDom.enhanced) return
    const select = contentDom.getSelection()
    select.getRangeAt(0).insertNode(this.dom)
    contentDom.enhanced = true
  }
}

(function () {
  'use strict';
  const styles = `
    .header-with-link {
        display: flex;
        align-items: center;
    }
    .header-link {
        color: #0049B0!important;
        border: 2px solid #0049B0;
        border-radius: 5px;
        font-size: 14px;
        margin-left: 10px;
        padding: 0px 3px;
    }
    ._yifei-message {
        position: fixed;
        top: 150px;
        box-shadow: 0 2px 10px rgb(0 0 0 / 25%);
        background: white;
        color: black: translateY(-50px);
        transition: all ease .3s;
        left: 50%;
        padding: 10px 20px;
        border-radius: 5px;
        opacity: 0;
    }

    ._yifei-message-show {
        transform: translateY(0);
        opacity: 1;
    }

    ._yifei-markdown {
      position: fixed;
      z-index: 999;
      top: 20vh;
      right: 100px;
      z-index: 999;
      opacity: 0.8;
      background: white;
      padding: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 5px;
    }
    
    ._yifei-markdown-hidden {
      display: none;
    }
    
    ._yifei-md-title {
      cursor: pointer;
      line-height: 2;
    }

    ._yifei-md-input {
      height: 60vh;
      width: 300px;
      padding: 10px;
      background: white;
    }

    .plugin_pagetree_children_content:hover {
        background: #eee;
        cursor: pointer;
    }

    .plugin_pagetree_children_list > li {
        margin: 0!important;
    }

    .plugin_pagetree_children_content {
        padding: 5px;
        border-radius: 3px;
    }

    .plugin_pagetree_childtoggle_container {
        padding-top: 3px;
    }
  `

  // utils
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const wait = (delay = 100) => new Promise((res) => {
    setTimeout(
      res, delay
    )
  });

  // config
  const config = {
    debug: false
  }
  
  // 只在 iframe 中生效
  if (self == top) return

  const addMouseMoveListener = (cb = () => { }) => {
    if (document.subs === undefined) {
      document.subs = new Set()
      document.onmousemove = () => {
        document.subs.forEach((cb, i) => {
          config.debug && console.log(`[Mouse Move Listenser] ${i} called`)
          cb()
        })
      }
    }

    document.subs.add(cb)
  }
  const addStyle = () => {
    const styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
  }

  class Message {
    constructor() {
      this.dom = document.createElement('div')
      this.dom.className = '_yifei-message'
      this.SHOW_CLASS = '_yifei-message-show'
      this.timeout = null;
      document.body.appendChild(this.dom)
    }
    show(text) {
      this.timeout && clearTimeout(this.timeout)
      this.dom.innerText = text
      this.dom.classList.add(this.SHOW_CLASS)
      this.timeout = setTimeout(() => this.hide(), 1500)
    }

    hide() {
      this.dom.classList.remove(this.SHOW_CLASS)
    }
  }

  const message = new Message()
  const md = new Markdown()

  const addLinkToHeader = () => {
    const headers = new Array(6).fill(0).map((v, i) => {
      return $$(`h${i + 1}`)
    }).reduce((p, c) => p.concat(c), []).filter(v => v.id)
    console.log(headers)

    headers.forEach(h => {
      const link = document.createElement('a')
      link.className = 'header-link'
      link.innerText = '#'

      link.href = location.hash ? location.href.replace(location.hash, `#${h.id}`) : location.href + `#${h.id}`
      link.title = 'click to copy link'

      link.onclick = () => {
        console.log('click', link.href)
        message.show('链接已复制到剪切板')
        navigator.clipboard.writeText(link.href)
      };

      h.classList.add('header-with-link')
      h.appendChild(link)
    })
  }

  const addLinkToComment = () => {
    const comments = $$('.comment-thread')
    console.log(comments)

    comments.forEach(c => {
      const actions = c.querySelector('.comment-actions')

      const action = document.createElement('ul')
      action.className = 'comment-action-copy'

      const link = document.createElement('a')

      link.innerText = '复制评论链接'
      link.href = location.hash ? location.href.replace(location.hash, `#${c.id}`) : location.href + `#${c.id}`
      link.title = 'click to copy link'

      link.onclick = () => {
        console.log('click', link.href)
        message.show('链接已复制到剪切板')
        navigator.clipboard.writeText(link.href)
      };

      action.appendChild(link)
      actions.appendChild(action)
    })
  }

  const addPreviewBtnToEditPage = () => {
    if (location.href.indexOf('resumedraft') < 0 || location.href.indexOf('editpage') < 0) return;
    console.log('add preview btn')
    const expandBtn = $('#rte-button-ellipsis')
    const btnContainer = $('.cancel-button-container-shared-draft')

    const doPreview = () => {
      wait().then(() => {
        expandBtn.click()
        const previewBtn = $('#rte-button-preview')
        previewBtn.click()
      })
    }

    const prevBtn = document.createElement('button')
    prevBtn.className = 'aui-button'
    btnContainer.appendChild(prevBtn)
  }

  const enhanceTree = () => {
    const doEnhance = () => {
      const items = $$('.plugin_pagetree_children_content')

      items.forEach(dom => {
        if (dom.enhanced) return
        dom.enhanced = true
        dom.onclick = () => {
          dom.previousElementSibling.children[0].click()
        }
      })
    }

    const listenDom = () => {
      const side = $('.acs-side-bar')
      if (!side || side.enhanced) return

      // observe side bar
      const config = { childList: true, attributes: true }
      const callback = function (mutationsList) {
        // enhance child tree when new items loaded
        doEnhance()
      };

      const observer = new MutationObserver(callback)
      observer.observe(side, config)

      side.enhanced = true
      console.log('observed', side)

      // enhance first
      doEnhance()

      // disable onmousemove event
      document.subs.delete(listenDom)
    }

    addMouseMoveListener(listenDom)
  }

  const openDialog = () => {
    const dialog = $('.content-macro')
    console.log('opening', dialog)
    dialog.click()
    closeDialog()
  }

  const closeDialog = () => {
    const cancel = $('#macro-details-page .button-panel-cancel-link')
    cancel.click()
  }

  const confirmDialog = (t = 500) => {
    setTimeout(() => $('#macro-details-page .button-panel-button.ok').click(), t)
  }

  const addFastInfo = () => {
    const buttons = [
      ['#macro-info', 'info-filled', '信息', confirmDialog],
      ['#macro-children', 'overview', '子页面', () => {
        setTimeout(() => {
          $('#macro-param-all').click()
          confirmDialog(100)
        }, 500)
      }],
      ['#macro-status', ' confluence-icon-status-macro', '状态', () => {
        confirmDialog(500)
      }]
    ]

    const tryToAddDom = () => {
      const toolbar = $('.aui-toolbar2-primary')
      if (!toolbar || toolbar.enhanced || !location.href.includes('resume')) return

      openDialog()
      const newTools = document.createElement('ul')
      newTools.className = 'aui-buttons'

      buttons.forEach(([bid, icon, name, cb]) => {
        console.log(bid, icon, name)

        // create new icons
        const li = document.createElement('li')
        li.className = 'toolbar-item aui-button aui-button-subtle'

        li.innerHTML = `
                  <span class="icon aui-icon aui-icon-small aui-iconfont-${icon}">${name}</span>
              `
        li.onclick = () => {
          $(bid).click()
          console.log('click', bid)
          cb()
        }

        newTools.appendChild(li)
      })

      toolbar.enhanced = true
      document.subs.delete(tryToAddDom)

      toolbar.appendChild(newTools)
    }


    addMouseMoveListener(tryToAddDom)
  }

  const enhanceStatus = () => {
    const colorActionMap = {
      'Grey': 'PLAN',
      'Red': 'BLOCKED',
      'Yellow': 'DELAY',
      'Green': 'RESOLVED',
      'Blue': 'PENDING'
    }
    const remapColor = {
      'Yellow': '#ffab00'
    }
    const doEnhanceStatus = () => {
      const statusDoms = $$('.status-macro-title')
      statusDoms.forEach(input => {
        const statusDom = input.parentElement.parentElement;
        if (statusDom.enhanced) return
        input.click()
        const statusInput = statusDom.querySelector('.status-macro-title')
        console.log(statusInput)

        Array.from(statusDom.querySelectorAll('.aui-button')).filter(v => v.className.includes('macro-property')).forEach(v => {
          const color = v.classList[1].split('-')[3]

          const newStatusDom = document.createElement('div')
          newStatusDom.className = 'aui-button'
          newStatusDom.innerText = colorActionMap[color]
          newStatusDom.style.color = remapColor[color] || color.toLowerCase()
          newStatusDom.style.marginTop = '10px'
          newStatusDom.onclick = () => {
            statusInput.value = colorActionMap[color]
            v.click()
          }

          statusDom.appendChild(newStatusDom)
        })
        statusDom.enhanced = true

      })
    }

    addMouseMoveListener(doEnhanceStatus)
  }

  const debugMode = () => {
    const userLinks = $$('.confluence-userlink')
    userLinks.forEach(v => v.style.filter = 'blur(4px)')
    $('#breadcrumbs').style.filter = 'blur(4px)'
    document.onclick = () => $('#wm').style.filter = 'blur(5px)'
  }
  
  const addHighlight = () => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js'
    script.onload = () => hljs.highlightAll();
    document.head.appendChild(script);
  }

  addStyle()
  addLinkToHeader()
  addLinkToComment()
  addPreviewBtnToEditPage()
  enhanceTree()
  addFastInfo()
  enhanceStatus()
  addHighlight()

  history.onpushstate = addFastInfo // listen history change
  config.debug && debugMode()
})();