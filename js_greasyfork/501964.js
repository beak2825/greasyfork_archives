// ==UserScript==
// @name        一键复制 Cloudflare R2 的外部地址
// @namespace   Violentmonkey Scripts
// @match       https://dash.cloudflare.com/*
// @grant       none
// @version     0.0.4
// @author      bling-yshs
// @description 提供一键复制 Cloudflare R2 的外部地址的操作
// @license     MIT
// @homepageURL https://greasyfork.org/zh-CN/scripts/501964-%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6-cloudflare-r2-%E7%9A%84%E5%A4%96%E9%83%A8%E5%9C%B0%E5%9D%80
// @downloadURL https://update.greasyfork.org/scripts/501964/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%20Cloudflare%20R2%20%E7%9A%84%E5%A4%96%E9%83%A8%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/501964/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%20Cloudflare%20R2%20%E7%9A%84%E5%A4%96%E9%83%A8%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

// 开源地址：https://github.com/bling-yshs/r2-copy-link，欢迎反馈

async function main() {
  const domainXpath = '//*[@id="react-app"]/div/div/div/div[1]/main/div/div/dl/div[2]/dd/ul/li/span'
  await waitForElement(domainXpath)
  console.log('Cloudflare R2 外部地址复制脚本已启动')
  const notificationHTML = `
            <div id="notification" style="
                display: none;
                position: fixed;
                top: 20%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #4CAF50;
                color: white;
                padding: 20px;
                border-radius: 5px;
                transition: opacity 0.5s;
                z-index: 1000;
            ">已复制到剪贴板</div>`
  document.body.insertAdjacentHTML('beforeend', notificationHTML)
  const copyButton = createCopyButton()
  
  // 创建一个 MutationObserver 监听选中文件名的变化
  const fileXpath = '//*[@id="react-app"]/div/div/div/div[1]/main/div/div/section/div/section/div/div/div/div/div/div[2]'
  const targetElement = document.evaluate(fileXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  
  let filename = ''
  if (targetElement) {
    console.log('目标节点已找到。')
    // 创建 MutationObserver 实例
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const changedElement = mutation.target
          if (changedElement.parentNode === targetElement) {
            console.log('Class changed for element:', changedElement)
            // 只要changedElement的//*[@id="table_1_rowrow_你要的全拿走.mp3_cell_1"]/div/a的文本
            const specificElement = changedElement.children[0].children[1]
            if (specificElement) {
              filename = specificElement.textContent.trim()
            } else {
              console.log('未找到特定元素')
            }
          }
        }
      })
    })
    // 配置观察选项
    const config = {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
      childList: true
    }
    
    // 开始观察目标元素及其子元素
    observer.observe(targetElement, config)
  } else {
    console.error('目标节点未找到。')
  }
  
  copyButton.addEventListener('click', function () {
    
    // 获取域名
    const domainElement = document.evaluate(domainXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    const domain = domainElement.textContent.trim()
    console.log('domain:', domain)
    
    // 获取文件夹路径，是//*[@id="react-app"]/div/div/div/div[1]/main/div/div/div[6]/div[1]下的所有文本
    const folderXpath = '//*[@id="react-app"]/div/div/div/div[1]/main/div/div/div[6]/div[1]'
    const folderElement = document.evaluate(folderXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    const folder = folderElement.textContent.trim().split('/')[1]
    console.log('folder:', folder)
    
    // url 编码
    filename = encodeURIComponent(filename)
    console.log('filename:', filename)
    
    const url = `https://${domain}/${folder ? `${folder}/` : ''}${filename}`
    console.log('url:', url)
    
    // 复制到剪贴板
    navigator.clipboard.writeText(url).then(() => {
      // 显示通知
      const notification = document.getElementById('notification')
      notification.textContent = `${url} 已复制到剪贴板`
      notification.style.display = 'block'
      
      // 设置定时器在3秒后隐藏通知
      setTimeout(() => {
        notification.style.display = 'none'
      }, 1000)
      // 弹窗提示
      // alert(`${url} 已复制到剪贴板`)
    }, (err) => {
      alert(`复制失败 ${url}`)
      console.error('复制失败:', err)
    })
  })
}

function createCopyButton() {
  const copyButton = document.createElement('button')
  copyButton.type = 'button'
  // 获取 data-testid="refresh" 的元素的类名
  const refreshButton = document.querySelector('[data-testid="refresh"]')
  if (refreshButton) {
    // 将类名设置为与 refreshButton 一致
    copyButton.className = refreshButton.className
  }
  
  // 添加按钮文本
  copyButton.innerHTML = '<span>复制链接</span>'
  refreshButton.parentNode.insertBefore(copyButton, refreshButton)
  return copyButton
}


// 创建一个函数，用于等待元素出现
function waitForElement(xpath) {
  return new Promise((resolve, reject) => {
    // 创建一个观察器，监视 DOM 变化
    const observer = new MutationObserver(() => {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
      if (element) {
        // 如果找到元素，停止观察并解析 Promise
        observer.disconnect()
        resolve(element)
      }
    })
    
    // 开始观察文档的变化
    observer.observe(document, {
      childList: true, subtree: true
    })
    
    // 超时处理
    setTimeout(() => {
      observer.disconnect()
      reject(new Error('Element not found within the timeout period'))
    }, 10000) // 设置超时为10秒
  })
}


main()
