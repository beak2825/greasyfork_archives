// ==UserScript==
// @name         UDesign px2rem
// @version      0.0.1
// @namespace aizigao
// @description  UDesign 都是 px
// @author       aizigao
// @license      MIT
// @run_at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @include        *://pelican.zuoyebang.cc/static/hy/pelecanus-admin*
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @reauire https://cdn.jsdelivr.net/npm/jquery-throttle-debounce@1.0.0/jquery.ba-throttle-debounce.min.js

// @downloadURL https://update.greasyfork.org/scripts/493825/UDesign%20px2rem.user.js
// @updateURL https://update.greasyfork.org/scripts/493825/UDesign%20px2rem.meta.js
// ==/UserScript==


const logR = console.log
const log = (...v) => logR('[uDesign px2rem🐱]', ...v)

function checkHash() {
  const href = location.href;
  return href.includes("#/mark/detail?projectId=")
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

function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    const context = this;

    // 清除之前的计时器
    clearTimeout(timeoutId);

    // 创建一个新的计时器，延迟执行函数
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

let $main = null
let $sideBar = null
let $checkBoxBtn = null
let isOn = GM_getValue('cc_px2rem', true)
const codeAreaPx2rem = debounce(async () => {
  const $cssCodeBlock = $main.find('#code .web-label')
  console.log('dom 变化')
  if ($cssCodeBlock.length) {
    $cssCodeBlock.html(
      $cssCodeBlock.html().replace(/([\d.]+)px/g, (match, p1) => {
        return `${p1 / 100}rem`
      })
    )
    log('已替换')
  }
}, 500)
const rewriteClipBoard = async () => {
  $main = await awaitDomCreated('.mark-content')
  const clipboardData = await navigator.clipboard.readText()
  const newContent = clipboardData.replace(/([\d.]+)px/g, (match, p1) => {
    return `${p1 / 100}rem`
  })
  navigator.clipboard.writeText(newContent)
    .then(function () {
      console.log('文本已成功写入剪切板');
    })
    .catch(function (error) {
      console.error('写入剪切板时出错：', error);
    });
}


let observer = null;
async function createObserver() {
  observer && observer.disconnect() // 销毁上次内容
  if (!checkHash()) { return; }
  $checkBoxBtn.show()
  log('等待sidebar 创建')
  // 监听剪切板
  $main = await awaitDomCreated('.mark-content')
  $main.on('click', ".btn-copy", () => {
    setTimeout(() => {
      rewriteClipBoard()
    }, 500)
  })
  $sideBar = await awaitDomCreated('.mark-content .inspector-active.attrs')

  // $sideBar = $main.find('.mark-content > .attr')
  // log($sideBar,'zzzzzzzzzzzzz sidebar')

  // 监听dom
  log('监听dom变化')
  var observerOptions = {
    childList: true, // 观察目标子节点的变化，是否有添加或者删除
    attributes: true, // 观察属性变动
    subtree: true // 观察后代节点，默认为 false
  }
  observer = new MutationObserver(function (mutations, observer) {
    mutations.forEach(({ addedNodes,...others }) => {
      // console.log(addedNodes, others)
      addedNodes.forEach(n => {
        if (n?.classList?.contains('inspector')) {
          codeAreaPx2rem()
        }
      })
    });
  });
  observer.observe($sideBar[0], observerOptions);

}

const stopObserver = () => {
  log('stop', observer)
  observer && observer.disconnect()
}

const createDom = () => {
  const $dom = $(`
    <label class='cc-px2rem-btn'>
      <input type='checkbox' checked='${isOn}'/>
      <span>px2rem</span>
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
    GM_setValue('cc_px2rem', isOn)
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
