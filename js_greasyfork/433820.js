// ==UserScript==
// @name         doc.html-cp
// @namespace    doc.html-cp-ll
// @version      0.1
// @description  doc.html复制小插件!
// @author       ll
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @match        https://*/doc.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433820/dochtml-cp.user.js
// @updateURL https://update.greasyfork.org/scripts/433820/dochtml-cp.meta.js
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
      return blockItem.children[0].children[1].children[1].innerHTML
    }
    /**
    * 得到接口url
    * @param {*} blockItem 元素
    * @returns path
    */
    function getRequestPath (blockItem) {
      if (!blockItem) return
      return blockItem.children[0].children[0].children[1].innerHTML
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
      return blockItem.children[0].children[4].children[1].innerHTML
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
      urlBtn.classList.add('btn', 'btn-default', 'btn-info', 'copy_btn')
      urlBtn.dataset.clipboardText = clipboardText
      urlBtn.onclick = clipboardUrl
      return urlBtn
    }
    function setBtn (tagItem) {
      if (tagItem) {
        // hash：如果此元素下btn存在，就不再添加
        if (tagItem.getElementsByClassName('copy_btn').length) return
        setTimeout(function() {
          tagItem.children[0].children[0].append(createBtnElement('复制url', handleCopyUrl(tagItem)))
          const parentNote = document.querySelectorAll('.detailMenu.open')[0].title
          tagItem.children[0].children[1].append(createBtnElement('复制函数', handleCopyFunc(tagItem, parentNote)))
        }, 0)
      }
    }
    function hashChange(){
      // hash路由改变
      window.onhashchange = function() {
        const tagList = document.querySelectorAll('.tab-pane > .swbu-main')
        if (tagList.length) {
          // 直到dom加载完成
          for(let i = 0; i<tagList.length; i++) {
            setBtn(tagList[i])
          }
        }
      }
    }
    function init () {
      document.addEventListener('readystatechange', () => {
        let loadDom = false
        let timer = null
        if (!loadDom) {
          timer = setInterval(() => {
            const tagList = document.querySelectorAll('.tab-pane > .swbu-main')
            if (tagList.length) {
              // 直到dom加载完成
              clearInterval(timer)
              timer = null
              loadDom = true
              // 若第一页需要加复制按钮
              setBtn(tagList[0])
            }
          }, 1000)
        }
      })

      hashChange()
    }

    init()
})();