// ==UserScript==
// @name Link Cleaner
// @namespace Link_Cleaner
// @version 1.1.0
// @author 稻米鼠
// @description Reduce the link address to the shortest available state and copy it to the clipboard to make it easier to share. [In the bottom centre of each page, there is a small button to call out the panel]
// @icon https://i.v2ex.co/vpQpSrfgl.png
// @require https://greasyfork.org/scripts/434834-mouseui/code/MouseUI.js?version=986988
// @homepage https://script.izyx.xyz/clean-the-link/
// @updateURL
// @downloadURL
// @match *://*/*
// @grant GM_setClipboard
// @grant GM_notification
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @noframes
// @contributionURL https://r.izyx.xyz/?ref=linkCleaner#script
// @contributionAmount 6.66
// @antifeature payment
// @downloadURL https://update.greasyfork.org/scripts/435305/Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/435305/Link%20Cleaner.meta.js
// ==/UserScript==
(function(){
  "use strict"
const rules = {
  'www.bilibili.com': {
    testReg: /^http(?:s)?:\/\/www\.bilibili\.com\/video\/(av\d+|bv\w+).*$/i,
    query: ['p'],
    hash: true
  },
  'www.youtube.com': {
    testReg: /^http(?:s)?:\/\/www\.youtube\.com\/watch\?.*$/i,
    query: ['v', 'list'],
    hash: true
  },
  'itunes.apple.com': {
    testReg: /^http(?:s)?:\/\/itunes\.apple\.com\/(?:\w{2}\/)?([^\/]+)\/(?:[^\/]+\/)?((?:id)\d+).*$/i,
    replace: 'https://itunes.apple.com/cn/$1/$2',
  },
  'apps.apple.com': {
    testReg: /^http(?:s)?:\/\/apps\.apple\.com\/(?:\w{2}\/)?([^\/]+)\/(?:[^\/]+\/)?((?:id)\d+).*$/i,
    replace: 'https://apps.apple.com/cn/$1/$2',
  },
  'microsoft.com/win10-store': {
    testReg: /^http(?:s)?:\/\/www\.microsoft\.com\/[a-zA-Z-]{2,5}\/p\/[^/]+\/([a-zA-Z0-9]{12,})(?:[^a-zA-Z0-9].*|$)/i,
    replace: 'https://www.microsoft.com/store/apps/$1',
  },
  'chrome.google.com/webstore': {
    testReg: /^http(?:s)?:\/\/chrome\.google\.com\/webstore\/detail\/[^\/]+\/([a-z]{32}).*/i,
    replace: 'https://chrome.google.com/webstore/detail/$1',
  },
  's.taobao.com': {
    testReg: /^http(?:s)?:\/\/s\.taobao\.com\/search.*$/i,
    query: ['q'],
  },
  'list.tmall.com': {
    testReg: /^http(?:s)?:\/\/list\.tmall\.com\/search_product\.htm.*$/i,
    query: ['q'],
  },
  'item.taobao.com': {
    testReg: /^http(?:s)?:\/\/item\.taobao\.com\/item\.htm.*$/i,
    query: ['id'],
  },
  'detail.tmall.com': {
    testReg: /^http(?:s)?:\/\/detail\.tmall\.com\/item\.htm.*$/i,
    query: ['id'],
  },
  'taobao/tmall.com/shop': {
    testReg: /^http(?:s)?:\/\/(\w+)\.(taobao|tmall)\.com\/shop\/view_shop\.htm.*$/i,
    replace: 'https://$1.$2.com/',
  },
  'c.pc.qq.com': {
    testReg: /^http(?:s)?:\/\/c\.pc\.qq\.com\/middle.html\?.*pfurl=([^&]*)(?:&.*$|$)/i,
    replace: '$1',
    query: [],
    methods: ['decodeUrl'],
  },
  'item.m.jd.com': {
    testReg: /^http(?:s)?:\/\/item\.m\.jd\.com\/product\/(\d+)\.html(\?.*)?$/i,
    replace: 'https://item.jd.com/$1.html',
  },
  'item.m.jd.com/ware/': {
    testReg: /^http(?:s)?:\/\/item\.m\.jd\.com\/ware\/view\.action\?.*wareId=(\d+).*$/i,
    replace: 'https://item.jd.com/$1.html',
  },
  'search.jd.com': {
    testReg: /^http(?:s)?:\/\/search\.jd\.com\/Search\?.*$/i,
    query: ['keyword', 'enc'],
  },
  're.jd.com': {
    testReg: /^http(?:s)?:\/\/re\.jd\.com\/cps\/item\/(\d+)\.html.*$/i,
    replace: 'https://item.jd.com/$1.html',
  },
  'weibo.com/u': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?weibo\.com\/u\/(\d+)(\?.*)?$/i,
    replace: 'https://m.weibo.cn/$1',
  },
  'weibo.com': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?weibo\.com\/(?:\d+)\/(\w+)(\?.*)?$/i,
    replace: 'https://m.weibo.cn/status/$1',
  },
  'greasyfork.org/script/tabs': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?greasyfork\.org\/(?:[\w-]*\/)?scripts\/(\d+)-[^//]*\/(code|versions|stats|derivatives|admin).*$/i,
    replace: 'https://greasyfork.org/scripts/$1/$2',
    hash: true
  },
  'greasyfork.org': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?greasyfork\.org\/(?:[\w-]*\/)?(scripts|users)\/(\d+)-[^//]*$/i,
    replace: 'https://greasyfork.org/$1/$2',
  },
  'greasyfork.org/scripts/list': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?greasyfork\.org\/(?:[\w-]*\/)?scripts\?.*$/i,
    query: ['set', 'page']
  },
  'greasyfork.org/script/discussions': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?greasyfork\.org\/(?:[\w-]*\/)?scripts\/(\d+)-[^//]*\/discussions\/(\d+).*$/i,
    replace: 'https://greasyfork.org/scripts/$1/discussions/$2',
    hash: true
  },
  'greasyfork.org/discussions': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?greasyfork\.org\/(?:[\w-]*\/)?discussions\/(greasyfork|development|requests)\/(\d+)(?:[^\d].*)?$/i,
    replace: 'https://greasyfork.org/discussions/$1/$2',
    hash: true
  },
  'store.steampowered.com|steamcommunity.com': {
    testReg: /^http(?:s)?:\/\/(store\.steampowered|steamcommunity)\.com\/app\/(\d+).*$/i,
    replace: 'https://$1.com/app/$2',
  },
  'meta.appinn.com': {
    testReg: /^http(?:s)?:\/\/meta\.appinn\.net\/t(?:\/[^/]*)*?\/(\d+)(\/.*$|$)/i,
    replace: 'https://meta.appinn.net/t/$1',
  },
  'amazon.co.jp': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?amazon\.co\.jp\/([^\/]+)\/dp\/(\w+)\/.*$/i,
    replace: 'https://www.amazon.co.jp/$1/dp/$2',
  },
  'amazon.com': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?amazon\.com\/([^\/]+)\/dp\/(\w+)\/.*$/i,
    replace: 'https://www.amazon.com/$1/dp/$2',
  },
  'yangkeduo.com': {
    testReg: /^http(?:s)?:\/\/mobile\.yangkeduo\.com\/goods.html\?.*$/i,
    query: ['goods_id'],
  },
  'trello.com': {
    testReg: /^http(?:s)?:\/\/(?:www\.)?trello\.com\/(\w)\/(\w+)(\/.*$|$)/i,
    replace: 'https://trello.com/$1/$2',
    hash: true,
  },
  'detail.1688.com/offer': {
    testReg: /^http(?:s)?:\/\/detail\.1688\.com\/offer\/(\d+)\.html\?.*$/i,
    replace: 'https://detail.1688.com/offer/$1.html',
  },
  'other': {
    testReg: /^(http(?:s)?:\/\/[^?#]*)[?#].*$/i,
    query: ['id', 'tid', 'uid', 'q', 'wd', 'query', 'keyword', 'keywords'],
  }
}
  // 主功能代码
// version 0.0.2
// update 2021-11-10 15:08:05
function dms_get_pure_url (url=window.location.href) {
  const hash = url.replace(/^[^#]*(#.*)?$/, '$1')
  const base = url.replace(/(\?|#).*$/, '')
  let pureUrl = url
  const getQueryString = function(key) {
    let ret = url.match(new RegExp('(?:\\?|&)(' + key + '=[^?#&]*)', 'i'))
    return ret === null ? '' : ret[1]
  }
  const methods = {
    decodeUrl: function(url){return decodeURIComponent(url) }
  }
  for(const i in rules){
    const rule = rules[i]
    const reg = rule.testReg
    const replace = rule.replace
    if (reg.test(url)){
      let newQuerys = ''
      if(rule.query && rule.query.length>0){
        rule.query.map(query=>{
          const ret = getQueryString(query)
          if(ret !== ''){
            newQuerys += (newQuerys.length ? '&' : '?') + ret
          }
        })
      }
      if(rule.hash ) newQuerys += hash
      pureUrl = (replace ? url.replace(reg, replace) : base ) + newQuerys
      if(rule.methods && rule.methods.length>0){
        rule.methods.map(methodName=>{
          pureUrl = methods[methodName](pureUrl)
        })
      }
      break
    }
  }
  return pureUrl
}
  const defaultConfig = {
    textFormat: 0,
    showTrigger: 1,
    autoClosePlane: 1,
    autoTestLink: 1,
    quickActions: []
  }
  if(GM_getValue) Object.assign(defaultConfig, JSON.parse(GM_getValue('config', '{}')))
  const config = new Proxy(defaultConfig, {
    set: function(obj, prop, value){
      obj[prop] = value
      if(GM_setValue){
        GM_setValue('config', JSON.stringify(config))
      }
      return true
    }
  })
  const temp = {}
  const dmsCLNotification = text=>{
    GM_notification({
      text,
      title: 'Success! by Link Cleaner.',
      image: 'data:image/png;base64,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',
      silent: true,
      timeout: 5000,
    });
  };
  const formater = (type, url, title)=>{
    url = url ? temp.purifiedLink : temp.originalLink
    title = title ? temp.title : ''
    if(type===0){
      return (title ? title+' ' : '') + url
    }
    if(type===1){
      return `[`+(title ? title : url)+`](`+url+`)`
    }
    if(type===2){
      return title ?
          `[url=`+url+`]`+title+`[/url]` :
          `[url]`+url+`[/url]`
    }
    if(type===3){
      return `<a href="`+url+`">`+(title ? title : url)+`</a>`
    }
  }
  const toCopy = (type, url, title)=>{
    GM_setClipboard(formater(type, url, title));
    dmsCLNotification('Copied~');
    if(url && config.autoTestLink) window.location.href = temp.purifiedLink
    if(config.autoClosePlane && panelActions.hide) panelActions.hide()
  }
  const formatType = ['Plain Text', 'Markdown', 'BBCode', "HTML"]
  const urlType = ['Original Link', 'Purified Link']
  const titleType = ['', 'With Title']
  const copyActions = {}
  for(let f=0; f<=3; f++){
    for(let u=0; u<=1; u++){
      for(let t=0; t<=1; t++){
        const key = 'copy'
                  + urlType[u].replace(' ', '')
                  + titleType[t].replace(' ', '')
                  + formatType[f].replace(' ', '')
        const actionObj = {
          desc: ('Copy '
                    + urlType[u]+ ' '
                    + (t ? titleType[t]: '')
                    + (f>0 ? '('+formatType[f]+')' : '')).trim()
                    + '.',
          action: ()=>{
            toCopy(f, u, t)
          }
        }
        copyActions[key] = actionObj
      }
    }
  }
  const cleanAllPage = () => {
    document.body.querySelectorAll('a').forEach(a=>{
      let theLink = a.href;
      if (/^(https?:)?\/\//.test(theLink)) {
        theLink = theLink.replace(/^(http:)?\/\//, 'https://');
        a.href = dms_get_pure_url(theLink);
      }
    })
    dmsCLNotification(
      'All links are cleaned~\nIf link don\'t work, refresh the page.'
    );
  };
  const groupClassToggle = (items, index, className, addClass=1)=>{
    items.forEach((el, elIndex)=>{
      if((addClass && elIndex===index) || (!addClass && elIndex!==index)){
        el.classList.add(className)
        return
      }
      el.classList.remove(className)
    })
  }
  const configSwitchInit = (item, configName)=>{
    groupClassToggle(item.querySelectorAll('button.radio'), config[configName], 'checked')
    item.addEventListener(
      'click',
      function(e){
        if(e.target.tagName==='BUTTON' && e.target.classList.contains('radio')){
          const newVal = Array.prototype.indexOf.call(this.children, e.target);
          groupClassToggle(this.querySelectorAll('button.radio'), newVal, 'checked')
          config[configName] = newVal
        }
      }, true)
  }
  const panelActions = {}
  const initPanel = (defaultShow=0, tabToShow=0)=>{
    const mouseStyle = (new MouseUI()).toString()
    const panelRoot = document.createElement('div')
    panelRoot.id = 'link-cleaner'
    const panel = panelRoot.attachShadow({mode: 'open'})
    panel.innerHTML = `
    <style>`
    +mouseStyle+`
    </style>
    <style>
  .panel {
    width: 640px;
    max-width: 96vw;
    bottom: 0;
  }
  .trigger {
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: .3;
  }
  .card {
    background-color: rgba(233, 233, 233, .8);
    backdrop-filter: blur(12px);
    max-height: 96vh;
    overflow-y: auto;
  }
  #quick-actions > li > input,
  #quick-actions > li > label {
    cursor: pointer;
  }
</style>
<div class="mouse-root panel fixed-center">
  <div class="trigger"></div>
  <div class="card scroll-box hidden">
    <div class="flex-area flex-ver">
      <h1 class="text-center">Link cleaner.</h1>
      <div class="flex-area tab-group">
        <div class="tab">Main</div>
        <div class="tab">Options</div>
        <div class="tab">Quick actions</div>
      </div>
      <div id="main" class="content-group">
        <div id="copy-actions-group">
          <h3 class="text-center">Original link.</h3>
          <div class="button-group">
            <button id="copyOriginalLink">Just link</button>
            <button id="copyOriginalLinkWithTitle">With title</button>
          </div>
          <h3 class="text-center">Purified link.<small> (Short ≈ <span id="short-per"></span>% / <span id="short-letter"></span> letters)</small></h3>
          <div class="button-group">
            <button id="copyPurifiedLink">Just link</button>
            <button id="copyPurifiedLinkWithTitle">With title</button>
          </div>
        </div>
        <h3 class="text-center">Text format.</h3>
        <div id="text-format" class="button-group">
          <button class="radio">Plain text</button>
          <button class="radio">Markdown</button>
          <button class="radio">BBCode</button>
          <button class="radio">HTML</button>
        </div>
        <h3 class="text-center">Clean all links in this page.</h3>
        <p>After this, if some links don't work right, you can refresh this page to reset.</p>
        <div class="button-group">
          <button id="clean-all-page">Clean all page</button>
        </div>
      </div>
      <div id="options" class="content-group">
        <h3 class="text-center">How to trigger the panel.</h3>
        <p>You can find the pop trigger on bottom center of window.</p>
        <div id="show-trigger" class="button-group">
          <button class="radio">Script menu</button>
          <button class="radio">Pop trigger</button>
        </div>
        <h3 class="text-center">Auto close panel after copy.</h3>
        <div id="auto-close-plane" class="button-group">
          <button class="radio">No</button>
          <button class="radio">Yes</button>
        </div>
        <h3 class="text-center">Auto test purified link.</h3>
        <p>This page will be redirected to the purified link after copy, to test if this link works.</p>
        <div id="auto-test-link" class="button-group">
          <button class="radio">No</button>
          <button class="radio">Yes</button>
        </div>
      </div>
      <div id="quick-action" class="content-group">
        <h3 class="text-center">Check actions to show in script menu.</h3>
        <ul id="copy-actions" class=""></ul>
      </div>
      <hr>
      <div id="footer" class="text-center text-small">Power by 稻米鼠 - Version: 1.1.0</div>
    </div>
  </div>
</div>
    `
    document.querySelector('html').appendChild(panelRoot)
    const trigger = panel.querySelector('.trigger')
    const card = panel.querySelector('.card')
    const toContentGroup = (tabIndex=0)=>{
      groupClassToggle(card.querySelectorAll('.content-group'), tabIndex, 'hidden', 0)
      groupClassToggle(card.querySelectorAll('.tab-group >.tab'), tabIndex, 'checked')
    }
    panelActions.tempInit = ()=>{
      temp.title = document.title
      temp.originalLink = window.location.href
      temp.purifiedLink = dms_get_pure_url()
      card.querySelector('#short-per').innerText = (100*(temp.originalLink.length - temp.purifiedLink.length)/temp.originalLink.length).toFixed(2)
      card.querySelector('#short-letter').innerText = temp.originalLink.length - temp.purifiedLink.length
    }
    panelActions.show = (tabTo=0)=>{
      card.classList.remove('hidden')
      panelActions.tempInit()
      toContentGroup(tabTo)
    }
    panelActions.hide = ()=>{
      card.classList.add('hidden')
      Object.keys(temp).forEach(key=>delete temp[key])
    }
    panelActions.toggle = (tabTo=0)=>{
      if(card.classList.contains('hidden')){
        panelActions.show(tabTo)
        return
      }
      panelActions.hide()
    }
    trigger.addEventListener('click', ()=>{
      panelActions.toggle()
    })
    if(defaultShow) panelActions.show()
    toContentGroup(tabToShow)
    card.querySelectorAll('.tab-group >.tab').forEach((tab, index)=>{
      tab.addEventListener('click', ()=>{
        toContentGroup(index)
      })
    })
    configSwitchInit(card.querySelector('#text-format'), 'textFormat')
    configSwitchInit(card.querySelector('#show-trigger'), 'showTrigger')
    configSwitchInit(card.querySelector('#auto-close-plane'), 'autoClosePlane')
    configSwitchInit(card.querySelector('#auto-test-link'), 'autoTestLink')
    card.querySelector('#copy-actions-group').addEventListener('click', function(e){
      if(e.target.tagName==='BUTTON'){
        copyActions[e.target.id+formatType[config.textFormat].replace(' ', '')].action()
      }
    }, true)
    card.querySelector('button#clean-all-page').addEventListener('click', ()=>{
      cleanAllPage()
      if(config.autoClosePlane) panelActions.hide()
    })
    const quickActions = card.querySelector('#copy-actions')
    const copyFragment = new DocumentFragment()
    for(const actionName in copyActions){
      const action = copyActions[actionName]
      const item = document.createElement('li')
      item.innerHTML = `
      <input type="checkbox" id="`+actionName+`">
      <label for="`+actionName+`">`+action.desc+`</label>
      `
      copyFragment.appendChild(item)
    }
    quickActions.appendChild(copyFragment)
    config.quickActions.forEach(action=>{
      quickActions.querySelector('#'+action).checked = true
    })
    quickActions.addEventListener(
      'change',
      function(e){
        const checkbox = e.target
        if(checkbox.tagName==='INPUT' && checkbox.type==='checkbox'){
          const tempActions = []
          this.querySelectorAll('li > input').forEach(cb=>{
            if(cb.checked) tempActions.push(cb.id)
          })
          config.quickActions = tempActions
        }
      }, true)
    document.addEventListener('fullscreenchange', ()=>{
      if(document.fullscreenElement){
        card.classList.add('hidden')
        trigger.classList.add('hidden')
        return
      }
      trigger.classList.remove('hidden')
    });
  }
  if(config.showTrigger) initPanel()
  GM_registerMenuCommand('Show/hide panel', ()=>{
    if(!panelActions.toggle){
      initPanel(1)
      return
    }
    panelActions.toggle()
  });
  config.quickActions.forEach(actionName=>{
    GM_registerMenuCommand(copyActions[actionName].desc, ()=>{
      temp.title = document.title
      temp.originalLink = window.location.href
      temp.purifiedLink = dms_get_pure_url()
      copyActions[actionName].action()
      Object.keys(temp).forEach(key=>delete temp[key])
    });
  })
  GM_registerMenuCommand('Show options', ()=>{
    if(!panelActions.show){
      initPanel(1, 1)
      return
    }
    panelActions.show(1)
  });
  GM_registerMenuCommand(
    'More Scripts',
    ()=>{
      window.open('https://r.izyx.xyz/?ref=linkcleaner#script', '_blank');
    })
})()