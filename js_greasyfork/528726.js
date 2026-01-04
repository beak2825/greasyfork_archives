// ==UserScript==
// @name        apple click
// @namespace   Violentmonkey Scripts
// @match       https://account.apple.com/account/manage/section/privacy*
// @grant       none
// @version     1.0.1
// @author      -
// @license MIT
// @description 3/4/2025, 2:50:18 PM
// @downloadURL https://update.greasyfork.org/scripts/528726/apple%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/528726/apple%20click.meta.js
// ==/UserScript==
function delay(timeout){
  return new Promise((reslove)=>{
    setTimeout(reslove, timeout)
  })
}

async function init(){
  await waitForSelector('.hide-my-email__icon-container .icon-plus')
  document.querySelector('.hide-my-email__icon-container .icon-plus').click()
  await delay(3000)
  await waitForSelector('.hide-my-email__section input')
  document.querySelector('.hide-my-email__section input').focus()
  document.querySelector('.hide-my-email__section input').value = '1'
  triggerInputChange(document.querySelector('.hide-my-email__section input'), '123')
  await delay(3000)
  await waitForSelector('.modal-button-bar .button-bar-side [type=submit]')
  document.querySelector('.modal-button-bar .button-bar-side [type=submit]').click();
  await delay(3000)
  await waitForSelector('.hide-my-email__detail-email-section-action-right')
  document.querySelector('.modal-button-bar .button-bar-side [type=button]').click();
  await delay(1000 * 60 * 1)
  await init()
}

const triggerInputChange = (node, inputValue) => {
      const descriptor = Object.getOwnPropertyDescriptor(node, 'value');

      node.value = `${inputValue}#`;
      if (descriptor && descriptor.configurable) {
        delete node.value;
      }
      node.value = inputValue;

      const e = document.createEvent('HTMLEvents');
      e.initEvent('change', true, false);
      node.dispatchEvent(e);

      if (descriptor) {
        Object.defineProperty(node, 'value', descriptor);
      }
}

(function() {

    // 创建按钮元素
    const button = document.createElement('button');
    button.textContent = '启动';

    // 设置按钮样式
    button.style.position = 'fixed';
    button.style.bottom = '30px';
    button.style.right = '30px';
    button.style.zIndex = '999999'; // 确保按钮在最上层
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.color = '#fff';
    button.style.backgroundColor = '#007BFF'; // 蓝色背景
    button.style.border = 'none';
    button.style.borderRadius = '25px'; // 圆角
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // 阴影
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.3s ease'; // 过渡动画

    // 悬浮效果
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#0056b3'; // 深蓝色
        button.style.transform = 'translateY(-2px)'; // 轻微上移
        button.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#007BFF';
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });

    // 点击触发 init 事件
    button.addEventListener('click', () => {
      init();
    });

    // 将按钮添加到页面
    document.body.appendChild(button);

})();




    let version = '1.0.1'

    // Create new observer on body to monitor all DOM changes
    let observer = new MutationObserver(mutationHandler)
    observer.observe(document.getElementsByTagName('html')[0], { childList: true, subtree: true })

    // Interface for interacting with the library
    let interface = {
        version,
        observer: observer,
        wait: waitForSelector,
        unwait: unwaitID,
        waits: {},
        waitsByID: {},
        nextID: 0,
    }

    // Start
    installInterface()

    // Creates a new entry to search for whenever a new element is added to the DOM
    function waitForSelector(selector, callback) {
        return new Promise((resolve)=>{
          if (!interface.waits[selector]) interface.waits[selector] = {}
        interface.waits[selector][interface.nextID] = ()=>resolve()
        interface.waitsByID[interface.nextID] = selector
        search(selector, true)
        return interface.nextID++
        })
    }

    // Deletes a previously registered selector
    function unwaitID(ID) {
        delete interface.waits[interface.waitsByID[ID]][ID]
        delete interface.waitsByID[ID]
    }

    // Makes sure that the public interface is the newest version and the same as the local one
    function installInterface() {
        window.wfs = interface
        interface = wfs || interface
    }

    // Waits until there has been more than 300 ms between mutations and then checks for new elements
    let lastMutationDate = 0 // Epoch of last mutation event
    let timeoutID = 0
    function mutationHandler(mutations) {
        let duration = Date.now() - lastMutationDate
        lastMutationDate = Date.now()
        if (duration < 300) {
            clearTimeout(timeoutID)
            timeoutID = setTimeout(() => {
                for (let selector in interface.waits) search(selector)
            }, 300)
        }
    }

    // Searches for the selector and calls the callback on the found elements
    function search(selector, all = false) {
        document.querySelectorAll(selector).forEach((e, i) => {
            let callbacks = Object.values(interface.waits[selector])
            if (all || !e.WFSFound || e.WFSFound == lastMutationDate) {
                for (let callback of callbacks) callback(e)
                e.WFSFound = lastMutationDate
            }
        })
    }
