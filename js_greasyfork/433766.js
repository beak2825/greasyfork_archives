// ==UserScript==
// @name         TOC
// @namespace    https://r.izyx.xyz/#toc
// @version      1.2
// @description  Generate toc for current page
// @author       稻米鼠
// @match        http://*/*
// @match        https://*/*
// @icon         https://i.v2ex.co/hxfSkJi0s.png
// @require      https://greasyfork.org/scripts/434834-mouseui/code/MouseUI.js?version=984836
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @contributionURL https://r.izyx.xyz/?ref=tocScript#script
// @contributionAmount 6.66
// @antifeature payment
// @downloadURL https://update.greasyfork.org/scripts/433766/TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/433766/TOC.meta.js
// ==/UserScript==

(function(){
  'use strict';
  const mainElSelectors = ['article', 'main', 'content', '#article', '.article', '#main', '.main', '#content', '.content', '#post', '.post', 'body']
  const titleSelectors = 'h1, h2, h3, h4, h5, h6'
  let tocShadow
  /**
   * 判断元素可见性
   * 需要注意一个边界情况，如果当前元素也就是输入框不做任何设置，他的父元素设置为.wrapper {position:fixed;},也就是设置了position属性为fixed，这时，offsetParent也会返回null，所以大家在使用的时候要稍加注意。
   * @param {HTMLElement} el 要进行判断的元素
   * @return {boolean} 是否可见
   */
  const isVisible = el =>{
    const style = window.getComputedStyle(el);
    return  style.width !== 0 &&
            style.height !== 0 &&
            style.opacity !== 0 &&
            style.display!=='none' &&
            style.visibility!== 'hidden' &&
            style.display !== 'none' &&
            el.offsetParent !== null
  }
  const generateTOC = ()=>{
    /* 页面中的主要内容元素 */
    const headerEls = []
    /* 获取并标注所有标题元素 */
    let tocIndex = 0
    for(const selector of mainElSelectors){
      if(!document.querySelectorAll(selector).length) continue
      document.querySelectorAll(selector).forEach(el=>{
        el.querySelectorAll(titleSelectors).forEach(e=>{
          if(!isVisible(e)) return
          headerEls.push(e)
          const eMark = 'toc_index_'+tocIndex++
          e.dataset.headerMark = eMark
        })
      })
      break
    }
    // const levelArray = titleSelectors.split(/,\s*/g).map(s=>s.toUpperCase()).filter(s=>hasTags[s])
    let menuCode = ``
    if(headerEls.length){
      let nowLevel = +headerEls[0].tagName.replace(/H/g, '')
      let nowHeaderLevel = 0
      headerEls.forEach(el=>{
        const thisLevel = +el.tagName.replace(/H/g, '')
        nowHeaderLevel = nowHeaderLevel + thisLevel - nowLevel
        nowHeaderLevel = nowHeaderLevel<0 ? 0 : nowHeaderLevel
        nowLevel = thisLevel
        const tempEl = document.createElement('span')
        tempEl.innerText = el.innerText
        menuCode += `
        <li class="toc_menu_item toc_header_level_`+nowHeaderLevel+`">
          <div id="`+el.dataset.headerMark+`" class='toc-item-link'>`+tempEl.innerHTML+`</div>
        </li>`
      })
    }else{
      menuCode += `<li class="toc_menu_item">[Here is empty.]</li>`
    }
    return menuCode
  }
  const getElPosY = (el, Y=0)=>{
    if(!el || el.tagName==='BODY' || el.tagName==='HTML') return Y
    Y += el.offsetTop
    const pEl = el.offsetParent
    if(!pEl || pEl.tagName==='BODY' || pEl.tagName==='HTML') return Y
    return getElPosY(pEl, Y)
  }
  /* 注入 TOC 菜单 */
  const TOCMenu = ()=>{
    const style = (new MouseUI()).toString()
    const tocRoot = document.createElement('div')
    tocShadow = tocRoot.attachShadow({mode: 'open'})
    tocRoot.id = 'toc_menu_root'
    tocShadow.innerHTML = `
      <style>`
        +style+`
        #toc_menu_root {
          left: 0;
          top: 0;
          font-size: 16px;
        }
        #toc_toggle_button {
          left: -18px;
          top: -18px;
          opacity: .3;
        }
        #toc_content {
          background-color: rgba(233, 233, 233, .8);
          backdrop-filter: blur(12px);
          height: 100vh;
          max-width: 98vw;
          padding: var(--Space_2) calc(var(--Space_2) * 2);
          overflow: auto;
        }
        #toc_content > hr {
          margin-left: calc(var(--Space_2) * -2);
          margin-right: calc(var(--Space_2) * -2);
        }
        li>div {
          color: var(--Gray_1);
          padding: 0 var(--Space);
          border-radius: 4px;
        }
        li>div:hover {
          color: var(--Gray_4);
          background-color: var(--Red);
        }
        li.toc_header_level_0 {
          font-weight: 700;
        }
        li.toc_header_level_1 {
          padding-left: 1.2em;
        }
        li.toc_header_level_2 {
          padding-left: 2.4em;
        }
        li.toc_header_level_3 {
          padding-left: 3.6em;
        }
        li.toc_header_level_4 {
          padding-left: 4.8em;
        }
        li.toc_header_level_5 {
          padding-left: 6em;
        }
      </style>
      <div id="toc_menu_root" class="mouse-root panel">
        <div id="toc_toggle_button" class="trigger"></div>
        <div id="toc_content" class="card">
          <h3>Table of contents:</h3>
          <hr>
          <ul id="toc_menu_list" class="no-point"></ul>
          <hr>
          <small>Power by <a href="https://meta.appinn.net/t/topic/25812" target="_blank">稻米鼠</a></small>
        </div>
      </div>
    `
    document.querySelector('html').appendChild(tocRoot)

    const contentArea = tocShadow.querySelector('#toc_content')
    const tocList = tocShadow.querySelector('#toc_menu_list')
    contentArea.classList.add('hidden')
    tocShadow.querySelector('#toc_toggle_button').addEventListener('click', ()=>{
      contentArea.classList.toggle('hidden')
      if(contentArea.classList.contains('hidden')){
        tocList.innerHTML = ''
        return
      }
      tocList.innerHTML = generateTOC()
    })
    tocList.addEventListener('click', (event)=>{
      const el = event.target
      if(el.tagName==='DIV' && el.classList.contains('toc-item-link')){
        const mark = el.id
        const targetTitle = document.body.querySelector('*[data-header-mark='+mark+']')
        console.log(targetTitle, getElPosY(targetTitle))
        window.scrollTo(window.scrollX, getElPosY(targetTitle))
      }
    })
    document.body.addEventListener('click', ()=>{
      if(!contentArea.classList.contains('hidden')){
        contentArea.classList.add('hidden')
        tocList.innerHTML = ''
      }
    })
  }
  if(!GM_getValue || !GM_getValue('defaultHidenTOC', false)){
    TOCMenu()
  }
  if(GM_registerMenuCommand){
    const defaultHidenTOC = GM_getValue('defaultHidenTOC', false)
    GM_registerMenuCommand(
      defaultHidenTOC
        ? '开启 TOC 菜单的默认显示'
        : '关闭 TOC 菜单的默认显示',
      ()=>{GM_setValue('defaultHidenTOC', !defaultHidenTOC)})

      GM_registerMenuCommand(
        '折叠/展开 TOC 菜单',
        ()=>{
          if(!tocShadow){
            TOCMenu()
          }
          tocShadow.querySelector('#toc_toggle_button').click()
        })

      GM_registerMenuCommand(
        '查看更多脚本',
        ()=>{
          window.open('https://r.izyx.xyz/?ref=tocScript#script', '_blank');
        })
  }
})()