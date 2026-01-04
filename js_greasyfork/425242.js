// ==UserScript==
// @name                Reading mode for mobile
// @namespace           Reading_mode_for_mobile
// @version             0.1.5Preview
// @description         [Preview] try to let reading return to reading.
// @author              稻米鼠
// @icon                https://i.v2ex.co/UuYzTkNus.png
// @supportURL          https://meta.appinn.net/t/23292
// @contributionURL     https://afdian.net/@daomishu
// @contributionAmount  8.88
// @antifeature         payment 本脚本为付费脚本
// @match               *://*/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/425242/Reading%20mode%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/425242/Reading%20mode%20for%20mobile.meta.js
// ==/UserScript==
(function() {
  'use strict';
  const version = 'v0.1.5Preview'
  const opt = window.RMFM ? window.RMFM : window.RMFM={}
  const addons = (opt.addons && opt.addons instanceof Array) ? opt.addons : opt.addons=[]
  const rulers = (opt.rulers && opt.rulers instanceof Array) ? opt.rulers : opt.rulers=[]
const mainRulers = [
  {
    name: "小众软件-主站",
    reg: /^https?:\/\/(www\.)?appinn\.com\/\w+/,
    titleGetter: 'article div.single_post > header > h1',
    concentGetter: 'article div.single_post > div.post-single-content',
  },
  {
    name: 'Bilibili-专栏',
    reg: /^https?:\/\/(www\.)?bilibili\.com\/read\/\w+/,
    concentGetter: '#read-article-holder'
  },
  {
    name: '百度经验',
    reg: /^https?:\/\/jingyan\.baidu\.com\/article\/\w+/,
    concentGetter: '#abstract-wp, .content-box',
    contentFilter: cEl=>{
      changeLazyImg(cEl, '_src')
    }
  },
  {
    name: '人民日报',
    reg: /^https?:\/\/(\w+\.)?people\.com\.cn\/\w+/,
    titleGetter: 'h1:not([class])',
    concentGetter: '.rm_txt_con'
  },
  {
    name: '凤凰网',
    reg: /^https?:\/\/(\w+\.)?ifeng\.com\/\w+/,
    concentGetter: 'div[class|=main_content]',
    contentFilter: cEl=>{
      changeLazyImg(cEl, 'data-lazyload')
    }
  },
  {
    name: '今日头条',
    reg: /^https?:\/\/((www|m)\.)?toutiao\.com\/\w+/,
    contentFilter: cEl=>{
      changeLazyImg(cEl, 'data-src')
    }
  },
  {
    name: '什么值得买',
    reg: /^https?:\/\/(\w+\.)?smzdm\.com\/p\/\w+/,
    concentGetter: 'article'
  },
]
const changeLazyImg = (el, att)=>{
  el.querySelectorAll('img').forEach(img=>{
    if(img.getAttribute(att)){
      img.src = img.getAttribute(att)
    }
  })
}
  mainRulers.forEach(r=>{ rulers.push(r) })
  addons.unshift({ name: "default" })
  const Glo = {}
  const createEl = (tagName, id)=>{
    const el = document.createElement(tagName)
    if(id) el.id = id
    return el
  }
  const addStyle = (parent, styCode, id)=>{
    const styEl = createEl('style', id)
    styEl.innerHTML = styCode
    parent.appendChild(styEl)
    return  styEl
  }
  const titleGetter = (selector)=>{
    if(selector){
      if(typeof(selector)==="string" && selector.length){
        return document.body.querySelector(selector).innerText
      }
      if(typeof(selector)==="function"){
        return selector()
      }
    }
    const titleH1 = document.body.querySelector('h1')
    if(titleH1){
      return titleH1.innerText
    }
    return document.title
  }
  const contentGetter = (selector)=>{
    const selctorArray = ['article', 'main', 'content', '#article', '.article', '#main', '.main', '#content', '.content', '#post', '.post']
    if(selector){
      if(typeof(selector)==="function"){
        return selector()
      }
      if(typeof(selector)==="string" && selector.length){
        selctorArray.unshift(selector)
      }
    }
    for(const s of selctorArray){
      const els = document.body.querySelectorAll(s)
      if(els.length){
        let contentHtmlCode = ''
        els.forEach(el=>{
          contentHtmlCode += `<div class="rmfm-section">`+el.innerHTML+`</div>`
        })
        return contentHtmlCode
      }
    }
    return document.body.innerHTML
  }
  const contentCleaner = (content)=>{
    content.querySelectorAll('*').forEach(el=>{
      if(/^(style|script|header|footer|aside|nav)$/i.test(el.tagName)){
        el.parentNode.removeChild(el)
        return
      }
      el.removeAttribute('class')
      el.removeAttribute('id')
      el.removeAttribute('style')
      el.removeAttribute('width')
      el.removeAttribute('height')
    })
  }
  const creatRoot = ()=>{
    const root = createEl('div', 'rmfm-root')
    document.querySelector('html').appendChild(root)
    return root
  }
  const runAddons = (timeName, argsObj)=>{
    for(const addon of addons){
      if(
        addon.name
        && addon[timeName]
        && typeof(addon[timeName])==='function'
      ){
        try {
          addon[timeName](Glo, argsObj)
        } catch (error) {
          console.warn('RMFM addons Error: ','Addon name: '+addon.name, 'Run time: '+timeName, error)
        }
      }
    }
  }
  const getAddonsStyle = (timeName)=>{
    let style = ''
    for(const addon of addons){
      if(
        addon.name
        && addon[timeName]
        && typeof(addon[timeName])==='string'
      ){
        style += addon[timeName]
      }
    }
    return style
  }
  const defAddon = (timeName, func)=>{
    const defAddonObj = addons[0]
    if(defAddonObj.name !== 'default'){
      console.error('RMFM ERROR: default addon is not found.')
      return
    }
    defAddonObj[timeName] = func
  }
  const getRuler = ()=>{
    const matchRulers = []
    for(const ruler of rulers){
      if(ruler.reg.test(window.location.href) && ruler.name){
        matchRulers.push(ruler)
      }
    }
    matchRulers.sort((a, b)=>{
      return (a.weight ? a.weight : 10)-(b.weight ? b.weight : 10)
    })
    const rulerResult = {}
    const rulersName = []
    for(const ruler of matchRulers){
      Object.assign(rulerResult, ruler)
      rulersName.push(ruler.name)
    }
    console.log('RMFM use rulers: '+rulersName.join(', ')+'.')
    return rulerResult
  }
  const addParentContainer = (el, tag, className)=>{
    const parent = document.createElement(tag)
    parent.className = className;
    el.parentNode.replaceChild(parent, el)
    parent.appendChild(el)
    return parent
  }
  const parentNoIndent = (el)=>{
    if(el.id === 'rmfm-page-article') return
    if(el.tagName === 'P'){
      el.classList.add('no-indent')
      return
    }
    parentNoIndent(el.parentElement)
  }
  Glo.RMFMRoot = creatRoot()
  Glo.RMFMShadow = Glo.RMFMRoot.attachShadow({mode: 'closed'})
  class initMainButton {
    lastScrollPos = window.scrollY
    constructor(){
      addStyle(
        Glo.RMFMShadow,
        getAddonsStyle('buttonStyle'),
        'style-for-main-button'
      )
      this.el = createEl('div', 'rmfm-main-button')
      Glo.RMFMShadow.appendChild(this.el)
      document.addEventListener('scroll', ()=>{
        if(this.lastScrollPos<=window.scrollY || window.scrollY<=window.innerHeight/20){
          this.hide()
          this.lastScrollPos = window.scrollY
          return
        }
        this.show()
        this.lastScrollPos = window.scrollY
      })
      this.el.addEventListener('click', ()=>{
        runAddons('onButtonClick', this)
      })
      runAddons('onButtonInit', this)
    }
    show(){
      this.el.classList.add('show')
    }
    hide(){
      this.el.classList.remove('show')
    }
    toggle(){
      this.el.classList.toggle('show')
    }
  }
  class initContentArea {
    constructor(){
      this.box = createEl('div', 'rmfm-content-card')
      Glo.mainArea.el.appendChild(this.box)
      this.header = createEl('div', 'rmfm-content-header')
      this.box.appendChild(this.header)
      this.menu = createEl('span', 'rmfm-content-menu')
      this.menu.innerText = 'Menu'
      this.header.appendChild(this.menu)
      this.close = createEl('span', 'rmfm-content-close')
      this.close.innerText = 'Close'
      this.header.appendChild(this.close)
      this.close.addEventListener('click', ()=>{ Glo.mainArea.hide() })
      this.el = createEl('div', 'rmfm-content-area')
      this.box.appendChild(this.el)
      this.footer = createEl('div', 'rmfm-content-footer')
      this.box.appendChild(this.footer)
      this.verInfo = createEl('span', 'rmfm-content-version')
      this.verInfo.innerText = 'RMFM '+version
      this.footer.appendChild(this.verInfo)
      this.addInfo = createEl('span', 'rmfm-content-addons')
      this.addInfo.innerText = addons.length+' addons, '+rulers.length+' rulers.'
      this.footer.appendChild(this.addInfo)
    }
    getContent(){
      this.addInfo.innerText = addons.length+' addons, '+rulers.length+' rulers.'
      const ruler = Glo.ruler = getRuler()
      addStyle(
        this.el,
        getAddonsStyle('contentStyle'),
        'style-for-this-site-from-addons'
      )
      if(ruler.style){
        addStyle(
          this.el,
          ruler.style,
          'style-for-this-site-from-ruler'
        )
      }
      const titleSource = titleGetter(ruler.titleGetter)
      Glo.title = {
        titleSource,
        title: titleSource,
        el: createEl('h1', 'rmfm-page-title')
      }
      runAddons('titleFilter')
      Glo.title.el.innerText = Glo.title.title
      this.el.appendChild(Glo.title.el)
      this.contentEl = createEl('div', 'rmfm-page-article')
      this.contentEl.classList.add('hide')
      this.contentEl.innerHTML = contentGetter(ruler.concentGetter)
      this.el.appendChild(this.contentEl)
      if(ruler.sourceFilter && typeof(ruler.sourceFilter)==='function'){ ruler.sourceFilter(this.contentEl) }
      runAddons('sourceFilter', this.contentEl)
      contentCleaner(this.contentEl)
      this.contentEl.classList.remove('hide')
      if(ruler.contentFilter && typeof(ruler.contentFilter)==='function'){ ruler.contentFilter(this.contentEl) }
      runAddons('contentFilter', this.contentEl)
    }
    clearContent(){
      this.el.innerHTML = ''
    }
    refreshContent(){
      this.clearContent()
      this.getContent()
    }
  }
  class initMainArea {
    eventRemover = {}
    constructor(){
      addStyle(
        Glo.RMFMShadow,
        getAddonsStyle('mainStyle'),
        'style-for-reading-mode'
      )
      this.el = createEl('div', 'rmfm-main-area')
      Glo.RMFMShadow.appendChild(this.el)
      runAddons('onMainInit', this)
    }
    show(){
      this.el.classList.remove('hide')
      runAddons('onMainShow')
    }
    hide(){
      this.el.classList.add('hide')
      runAddons('onMainHide')
    }
    toggle(){
      this.el.classList.toggle('hide')
      if(this.el.classList.contains('hide')){
        runAddons('onMainHide')
        return
      }
      runAddons('onMainShow')
    }
    clear(){
      for(const name in this.eventRemover){
        this.runRemover(name)
      }
      this.contentEl.innerHTML = ''
    }
    addRemover(name, remover){
      if(typeof(remover)!=='function'){
        console.warn('addRemover: '+name+' is not a function.')
        return
      }
      this.eventRemover[name] = remover
    }
    removeRemover(name){
      delete this.eventRemover[name]
    }
    runRemover(name){
      this.eventRemover[name]()
      this.removeRemover(name)
    }
  }
  defAddon('onButtonClick', glo=>{
    if(glo.mainArea){
      glo.mainArea.toggle()
      return
    }
    glo.mainArea = new initMainArea()
    glo.mainArea.show()
  })
  defAddon('onMainShow', glo=>{
    glo.mainButton.el.classList.add('lower-level')
    if(!glo.content){
      glo.content = new initContentArea()
    }
    glo.content.getContent()
  })
  defAddon('onMainHide', glo=>{
    glo.mainButton.el.classList.remove('lower-level')
    if(glo.content){
      glo.content.clearContent()
    }
  })
  defAddon('sourceFilter', (glo, contentEl)=>{
    contentEl.querySelectorAll('iframe').forEach(el => {
      if(el.width && el.height){
        el.setAttribute('data-frame-ratio', el.width+'/'+el.height)
      }
    })
  })
  defAddon('contentFilter', (glo, contentEl)=>{
    contentEl.querySelectorAll('img, video, picture, svg, canvas, iframe, pre').forEach(el => {
      if(el.tagName==='VIDEO'){
        addParentContainer(el, 'div', 'block-container')
        return
      }
      if(el.tagName==='IFRAME'){
        addParentContainer(el, 'div', 'block-container')
        el.width = '100%'
        el.style.aspectRatio = el.getAttribute('data-frame-ratio')
        return
      }
      if(el.tagName!=='IMG' && el.offsetWidth >= contentEl.offsetWidth/3){
        addParentContainer(el, 'div', 'block-container')
        return
      }
      const img = new Image()
      img.src = el.src
      img.onload = ()=>{
        if(img.width >= contentEl.offsetWidth/3){
          const bc = addParentContainer(el, 'div', 'block-container')
          parentNoIndent(bc)
        }
      }
    });
    contentEl.querySelectorAll('p').forEach(p=>{
      if(p.querySelectorAll('.block-container').length){
        p.classList.add('no-indent')
      }
    })
    contentEl.querySelectorAll('pre>*').forEach(el=>{
      if(el.tagName!=='CODE' && !el.classList.contains('code-copy-button')){
        el.parentElement.removeChild(el)
      }
    })
  })
  defAddon('buttonStyle', `
  #rmfm-main-button {
    position: fixed;
    z-index: 2147483647;
    right: 24px;
    bottom: 24px;
    width: 24px;
    height: 24px;
    background-color: rgba(0, 0, 0, .3);
    border: 6px solid rgba(255, 255, 255, .3);
    border-radius: 5vmin;
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, .1);
    display: none;
  }
  #rmfm-main-button.show {
    display: block;
    cursor: pointer;
  }
  #rmfm-main-button.lower-level {
    z-index: 1999999999;
  }
  `)
  defAddon('mainStyle', `
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: rgba(0,0,0,0.05);
}
::-webkit-scrollbar-button {
  display: none;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.5);
  border-radius: 3px;
}
#rmfm-main-area {
  --Gray_0: #333336;
  --Gray_1: #666669;
  --Gray_2: #99999c;
  --Gray_3: #cccccf;
  --Gray_4: #efeff3;
  --Gray_bg: #e3e3e3;
  --Red: #e06c6c;
  --Light_Red: #ffacac;
  --Blue: #007bda;
  --Light_Blue: #6cc6e6;
  --Code_BG: #282c34;
  --Font_Size: 18px;
  --Line_Height: 1.8;
  --Space: 6px;
  font-size: var(--Font_Size);
  font-family: -apple-system, BlinkMacSystemFont, "Apple Color Emoji", "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Lantinghei SC", "Source Han Sans", "Microsoft YaHei", "Helvetica Neue", "Noto Sans CJK", Helvetica, Arial, sans-serif;
  font-weight: normal;
  line-height: var(--Line_Height);
  color: var(--Gray_0);
  position: fixed;
  z-index: 2147483647;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  overflow: hidden;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(12px);
}
.hide {
  display: none;
}
#rmfm-content-card {
  box-sizing: border-box;
  width: 98vw;
  max-width: 800px;
  height: 98vh;
  margin: 1vh auto;
  padding: 0;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1vmin 6vmin rgba(0,0,0,0.4);
  border-radius: 4px;
}
#rmfm-content-header,
#rmfm-content-footer {
  position: relative;
  font-size: 14px;
  line-height: calc(var(--Font_Size) * 2);
  height: calc(var(--Font_Size) * 2);
  overflow: hidden;
  color: var(--Gray_2);
}
#rmfm-content-menu,
#rmfm-content-close,
#rmfm-content-version,
#rmfm-content-addons {
  display: inline-block;
  font-size: 16px;
  font-weight: 200;
  padding: 0 8px;
}
#rmfm-content-menu,
#rmfm-content-close {
  cursor: pointer;
}
#rmfm-content-close,
#rmfm-content-addons {
  float: right;
}
#rmfm-content-area {
  position: relative;
  box-sizing: border-box;
  width: 98vw;
  max-width: 800px;
  height: calc(98vh - var(--Font_Size) * 4);
  padding: 0;
  overflow: hidden auto;
}
#rmfm-content-area h1#rmfm-page-title {
  text-align: center;
}
#rmfm-content-area #rmfm-page-article {
  padding: 0 calc(var(--Font_Size) * 4);
}
#rmfm-content-area * {
  max-width: 100%;
}
#rmfm-content-area a {
  color: var(--Red);
  text-decoration: none;
  padding: 0 var(--Space);
  border-radius: var(--Space);
  display: inline-block;
}
#rmfm-content-area a:visited {
  color: var(--Red);
}
#rmfm-content-area a:hover {
  color: var(--Gray_4);
  background-color: var(--Red);
}
#rmfm-content-area a:active {
  color: var(--Gray_4);
  background-color: var(--Light_Red);
}
#rmfm-content-area p,
#rmfm-content-area h1,
#rmfm-content-area h2,
#rmfm-content-area h3,
#rmfm-content-area h4,
#rmfm-content-area h5,
#rmfm-content-area h6,
#rmfm-content-area hr,
#rmfm-content-area ul,
#rmfm-content-area ol {
  margin: var(--Space) 0;
}
#rmfm-content-area p {
  text-indent: 2em;
}
#rmfm-content-area p.no-indent {
  text-indent: 0;
}
#rmfm-content-area p * {
  text-indent: 0;
}
#rmfm-content-area p code {
  color: var(--Red);
  background: var(--Gray_4);
}
#rmfm-content-area code,
#rmfm-content-area pre {
  font-family: Consolas, Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace;
}
#rmfm-content-area hr {
  border: none;
  background: var(--Gray_4);
  height: 1px;
}
#rmfm-content-area blockquote {
  background-color: var(--Gray_4);
  padding: calc(var(--Font_Size) / 2);
  border-left: 5px solid var(--Gray_2);
}
#rmfm-content-area pre {
  margin: 0;
  padding: var(--Space) 0;
  background-color: var(--Code_BG);
  color: var(--Gray_4);
  white-space: pre-wrap;
  word-break: break-all;
  text-align: left;
  line-height: 1.2;
}
#rmfm-content-area pre code {
  padding: var(--Font_Size) calc(var(--Font_Size) * 4);
  position: relative;
}
#rmfm-content-area pre code::before {
  content: ' ';
  position: absolute;
  height: 100%;
  left: calc(var(--Font_Size) * 3.5);
  top: 0;
  z-index: 100;
  border-left: 1px solid var(--Gray_3);
}
#rmfm-content-area pre code .rmfm-code-line {
  position: relative;
}
#rmfm-content-area pre code .rmfm-code-line .rmfm-code-line-num {
  position: absolute;
  top: 0;
  left: calc(var(--Font_Size) * -5);
  width: calc(var(--Font_Size) * 4);
  height: 100%;
  background-repeat: no-repeat;
  background-position: top right;
}
#rmfm-content-area .block-container {
  position: relative;
  width: 98vw;
  max-width: 800px;
  margin: var(--Space) 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}
@media screen and (max-width: 800px) {
  #rmfm-content-card {
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: none;
    border-radius: 0;
  }
  #rmfm-content-area {
    width: 100%;
    height: calc(100vh - var(--Font_Size) * 4);
  }
  #rmfm-content-area #rmfm-page-article {
    padding: 0 5%;
  }
  #rmfm-content-area .block-container {
    width: 100vw;
  }
}
  `)
  rulers.unshift({
    name: 'default',
    weight: 1,
    reg: /^https?:\/\/.*$/
  })
  runAddons('onStart')
  let timer_A = 0
  let timer_B = 0
  const starter = ()=>{
    if(!timer_A){
      timer_A = window.setTimeout(()=>{
        window.clearTimeout(timer_A)
        window.clearTimeout(timer_B)
        if(Glo.mainButton) return
        Glo.mainButton = new initMainButton()
      }, 1200)
    }
  }
  window.addEventListener('load', ()=>{
    starter()
  })
  document.addEventListener('readystatechange', ()=>{
    if(document.readyState == 'complete'){
      starter()
    }
  })
  if(document.readyState == 'complete'){
    starter()
  }
  timer_B = window.setTimeout(starter, 5e3)
})();