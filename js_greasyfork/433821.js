// ==UserScript==
// @name         swagger-cp
// @namespace    swagger-cp-ll
// @version      0.3
// @description  swagger复制小插件!
// @author       ll
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @match        https://*/swagger-ui.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433821/swagger-cp.user.js
// @updateURL https://update.greasyfork.org/scripts/433821/swagger-cp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
    * 得到接口方法
    * @param {*} blockItem 元素
    * @returns GET/POST
    */
    function getRequestMethod (blockItem) {
      if (!blockItem) return
      return blockItem.getElementsByClassName('opblock-summary-method')[0].innerHTML
    }
    /**
    * 得到接口url
    * @param {*} blockItem 元素
    * @returns path
    */
    function getRequestPath (blockItem) {
      if (!blockItem) return
      const urlElement = blockItem.getElementsByClassName('nostyle')[0]
      return urlElement.children[0].innerHTML
    }
    /**
    * 接口名字拼接
    * @param {*} path 接口路径
    * @returns api大驼峰名字
    */
    function getRequestName (path) {
      const lastPath = path.split('/')
      const nameList = lastPath[lastPath.length - 1].split('-')
      for(let i = 0; i < nameList.length; i++) {
        // 首字母大写
        nameList[i] = nameList[i].replace(nameList[i][0],nameList[i][0].toUpperCase())
      }
      return `api${nameList.join('')}`
    }
    /**
    * 得到接口注释
    * @param {*} blockItem 元素
    * @returns text
    */
    function getRequestNote (blockItem) {
      if (!blockItem) return
      return blockItem.getElementsByClassName('opblock-summary-description')[0].innerHTML
    }
    // 复制
    function clipboardUrl (e) {
      e.preventDefault();
      var clipboard = new ClipboardJS('.copy_btn')
      clipboard.on('error', function(e) { window.alert('复制失败')})
    }

    function handleCopyUrl (blockItem) {
        return getRequestPath(blockItem)
    }

    function handleCopyFunc (blockItem, parentNote) {
      const method = getRequestMethod(blockItem)
      const path = getRequestPath(blockItem)
      const name = getRequestName(path)
      const note = getRequestNote(blockItem)

      if (method === 'GET') {
        return `
         // ${parentNote}-${note}
         export const ${name} = (params) => {
           return axiosRequest({
             url: '${path}',
             method: 'get',
             params
             })
           }`
        } else {
          return `
          // ${parentNote}-${note}
          export const ${name} = (data) => {
            return axiosRequest({
              url: '${path}',
              data
            })
          }`
        }
    }
    // 生成btn
    function createBtnElement(text, clipboardText){
      const urlBtn = document.createElement('button')
      urlBtn.innerHTML = text
      urlBtn.style.width = '80px'
      urlBtn.style.height = '40px'
      urlBtn.style.margin = '0 5px 5px 0'
      urlBtn.classList.add('copy_btn')
      urlBtn.dataset.clipboardText = clipboardText
      urlBtn.onclick = clipboardUrl
      return urlBtn
    }
    function setBtn(blockList, parentNote){
        for(let i = 0; i< blockList.length; i++){
            blockList[i].parentNode.prepend(createBtnElement('复制函数', handleCopyFunc(blockList[i], parentNote)))

            blockList[i].parentNode.prepend(createBtnElement('复制url', handleCopyUrl(blockList[i])))
        }
    }
    function initBtn (tagItem) {
      if (tagItem) {
        const parentNote = tagItem.getElementsByClassName('nostyle')[0].children[0].innerHTML
        const blockList = tagItem.parentNode.getElementsByClassName('opblock') || []
        if (blockList.length) {
            setBtn(blockList, parentNote)
        }
        tagItem.addEventListener('click', (e) => {
          setTimeout(() => {
            const blockList = tagItem.parentNode.getElementsByClassName('opblock') || []
            setBtn(blockList, parentNote)
          }, 0)
        }, false)
      }
    }
    function init () {
      document.addEventListener('readystatechange', () => {
        let loadDom = false
        let timer = null
        if (!loadDom) {
        timer = setInterval(() => {
          const tagList = document.querySelectorAll('.opblock-tag')
          if (tagList.length) {
            // 直到dom加载完成
            clearInterval(timer)
            timer = null
            loadDom = true
            for(let i = 0; i< tagList.length; i++){
                initBtn(tagList[i])
              }
            }
          }, 1000)
        }
      })
    }

    init()
})();