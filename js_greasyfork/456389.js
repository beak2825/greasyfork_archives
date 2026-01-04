// ==UserScript==
// @name         Photopea 之——一键转为 PNG/WebP
// @description  单张图片格式快捷转换
// @mechanism    不过是个鼠标和输入的宏
// @version      1.0.2~20221211
// @match        https://www.photopea.com/
// @license      Unlicense
// @namespace    https://greasyfork.org/users/871942
// @downloadURL https://update.greasyfork.org/scripts/456389/Photopea%20%E4%B9%8B%E2%80%94%E2%80%94%E4%B8%80%E9%94%AE%E8%BD%AC%E4%B8%BA%20PNGWebP.user.js
// @updateURL https://update.greasyfork.org/scripts/456389/Photopea%20%E4%B9%8B%E2%80%94%E2%80%94%E4%B8%80%E9%94%AE%E8%BD%AC%E4%B8%BA%20PNGWebP.meta.js
// ==/UserScript==

// 自定义预设之例子：`localStorage.setItem('convertOptions', JSON.stringify({width:1280}))`

const fnName = '一键转 PNG/WebP'
const [$, $$] = ['', 'All'].map(_ => document[`querySelector${_}`].bind(document))

addEventListener('load', () => {
  console.log(`「${fnName}」已加载！`)
  topbar(1).addEventListener('click', () => {
    const cp = $(`.contextpanel`), el = cp.querySelector('div:last-child').cloneNode(true)
    cp.insertAdjacentElement('beforeend', el).addEventListener('click', main)
    el.querySelector('.label').innerHTML = fnName
  }, { once: true })
})


function main() {
  if (/*当前无打开的项目*/!$('.panelhead > .active')) {
    clickMenu.msg = '打开文件'
    clickMenu(1,2)
    /*一开就转*/onAppend($('.panelhead'), main, {once:true})
    return
  }

  const { width, fmt = 'PNG' } = JSON.parse(localStorage.getItem('convertOptions')) || {}

  if (!isNaN(width)) {
    clickMenu.msg = `调整图片大小为 ${width} px`
    clickMenu(3,9)
    setParam([document.activeElement, width])
    click('.spread')
  }

  clickMenu.msg = '调整视图大小'
  clickMenu(7,3)

  clickMenu.msgEnd =
  clickMenu.msg = `导出 ${fmt}`
  switch (fmt.toLowerCase()) {
    case 'png': clickMenu(1,9,1); break
    case 'webp': clickMenu(1,9,-1,1); setParam([$('.trangeinput > input'), '100%']); break
    default: unsafeWindow.alert(`不支持一键导出 ${fmt} 格式`, 7000); return
  }
  click('.spread',0)

  // 移除假阳性的反反广告弹框
  setTimeout(() => onAppend($('.app'), () => dE($('.confirm .cross'), 'pointerup'), {once:true, timeout:10000}))
}


function clickMenu(..._) {
  // 最核心的函数，移植定制你自己的其他操作流程之利器。系检试而成且即使某天原站界面大改大变也只需修改此处的CSS选择器
  let __, ___
  _[0] && (___ = topbar(_[0])) && ___.dispatchEvent(new Event('pointerdown'))
  Array.from(Array(_.length - 1).keys(), _ => ++_).every(n =>
    _[n] && (__ = $$(`.contextpanel`)[n-1]) && (__ = __.querySelector(`div:nth${_[n]<0?'-last':''}-of-type(${_[n]<0?-_[n]:_[n]})`)) && ((___ = __).click(), true)
  )
  clickMenu.msg && console.log(`${clickMenu.msgEnd?'✅ ':''}${clickMenu.msg}`)
  delete clickMenu.msg; delete clickMenu.msgEnd
  return [___, $$('[style^="position: absolute; z-index: 10"]')]
}

function topbar(n) { return $(`.topbar > span:nth-child(1) > button:nth-child(${n})`) }


function click(selector, instant) { instant === undefined ? $(selector).click() : setTimeout(()=>$(selector).click(),instant) }
function onAppend(el, cb, {once, timeout}={}) {
  const mr = el._onAppend ??= new MutationObserver(function ([m]) { (cb(m)||once) && this.disconnect() })
  mr.observe(el, {childList:true, subtree:true})
  timeout && setTimeout(mr.disconnect, timeout)
}
function setParam(...inputs) { inputs.forEach(([input,val]) => { input.value = val; input.dispatchEvent(new Event('change')) }) }
function dE(el, ev) { el.dispatchEvent(new Event(ev)) }

'clickMenu setParam dE'.split(' ').forEach(f => unsafeWindow[`_${f}`] = eval(f))