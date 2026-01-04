// ==UserScript==
// @name         蓝湖px2rpx
// @version      0.0.1
// @namespace aizigao
// @description  小程序都是rpx 麻烦哦
// @author       aizigao
// @license      MIT
// @run_at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @include        *://lanhuapp.com/web*
// @include        *://lanhu.zuoyebang.cc/web*
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/489357/%E8%93%9D%E6%B9%96px2rpx.user.js
// @updateURL https://update.greasyfork.org/scripts/489357/%E8%93%9D%E6%B9%96px2rpx.meta.js
// ==/UserScript==


const logR = console.log // log 被蓝湖重写了 日
const log = (...v) => logR('[蓝湖px2rpx🐱]', ...v)

function checkHash() {
  const href = location.href;
  return href.includes("#/item/project/detailDetach")
}

const delay = (ms) => new Promise(res => { setTimeout(res, ms) })

const awaitDomCreated = async (query) => {
  const $dom = $(query)
  if ($dom.length > 0) {
    return $dom
  }
  await delay(1000)
  return awaitDomCreated(query)
}

let $sideBar = null
let $checkBoxBtn = null
let isOn = GM_getValue('cc_px2rpx', true)
const codeAreaPx2Rpx = async () => {
  if ($sideBar.hasClass('open')) {
    const $cssCodeBlock = $sideBar.find('.annotation_item.code_detail code.language-css')
    $cssCodeBlock.html(
      $cssCodeBlock.html().replace(/([\d.]+)px/g, (match, p1) => {
        return `${p1}rpx`
      })
    )
    log('已替换')
  }
}
let observer = null;
async function createObserver() {
  observer && observer.disconnect() // 销毁上次内容
  if (!checkHash()) { return; }
  $checkBoxBtn.show()
  log('等待sidebar 创建')
  const $sideBarInner = await awaitDomCreated('.annotation_container_b')
  $sideBar = $sideBarInner.parent()
  log('sidebar 已创建', $sideBar[0])
  let $watchDomP = $sideBar.find('.annotation_container')

  log('监听dom变化')
  var observerOptions = {
    childList: true, // 观察目标子节点的变化，是否有添加或者删除
    attributes: true, // 观察属性变动
    subtree: true // 观察后代节点，默认为 false
  }
  observer = new MutationObserver(function (mutations, observer) {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach(n => {
        if (n.tagName === 'PRE' && n.classList.contains('language-css')) {
          codeAreaPx2Rpx()
        }
      })
    });
  });
  observer.observe($watchDomP[0], observerOptions);
  await delay(1000)
  codeAreaPx2Rpx()
}

const stopObserver = () => {
  log('stop', observer)
  observer && observer.disconnect()
}

const createDom = () => {
  const $dom = $(`
    <label class='cc-px2rpx-btn'>
      <input type='checkbox' checked='${isOn}'/>
      <span>px2rpx</span>
    <label/>
  `).css({
    position: 'fixed',
    top: '11px',
    left: '138px',
    zIndex: 1000,
    fontSize: '18px',
    fontWeight: 'normal',
    color: '#fefefe',
    background: '#3d8a55',
    padding: '0 8px',
    borderRadius: '6px',
    userSelect: 'none',
    display: 'none'
  })

  $dom.appendTo($('body'))
  const $checkBox = $dom.find('input')
  $checkBoxBtn = $dom
  $checkBox.on('change', e => {
    const nIsOn = e.target.checked
    if (nIsOn === isOn) {
      return
    }
    isOn = nIsOn
    GM_setValue('cc_px2rpx', isOn)
    if (isOn) {
      createObserver()
    } else {
      stopObserver()
    }
  })
}

// -----------
(function main() {
  log('init')
  createDom()
  createObserver()

  let old = history.pushState
  history.pushState = function (...arg) {
    log('改变了路由');
    setTimeout(() => {
      if (checkHash()) {
        createObserver()
      } else {
        stopObserver()
        $checkBoxBtn.hide()
      }
    }, 200)
    return old.call(this, ...arg)
  }
})()
