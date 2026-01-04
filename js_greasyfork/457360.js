// ==UserScript==
// @name         zwl-show-doc
// @namespace    *
// @version      0.1
// @description  show-doc 快捷插件
// @author       ll
// @match        */web/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.js
// @downloadURL https://update.greasyfork.org/scripts/457360/zwl-show-doc.user.js
// @updateURL https://update.greasyfork.org/scripts/457360/zwl-show-doc.meta.js
// ==/UserScript==

(function() {
  'use strict'

  console.log('油猴启动')
  new ClipboardJS('.copy-btn')

  function createATag(text, content) {
    const temp = $(`<button class="btn copy-btn" data-clipboard-text="${content}" style="margin: 0 10px 15px 0">${text}</button>`)

    temp.on('click', function(event) {
      event.preventDefault()
    })

    return temp
  }

  function toHump(name) {
    return name.replace(/\_(\w)/g, function(all, letter){
      return letter.toUpperCase();
    });
  }

  function createFunc(method, path, description) {
    const urlList = path.split('/')
    const methodName = toHump('_' + urlList[urlList.length - 1])
    console.log(method.trim())
    switch (method.trim().toUpperCase()) {
      case 'POST':
        return `// ${description}
                export const ${'api' + methodName} = (data) => {
                  return request({
                    url: '${path}',
                    method: 'post',
                    data
                  })
                }`

      case 'GET':
        return `// ${description}
                export const ${'api' + methodName} = (params) => {
                  return request({
                    url: '${path}',
                    method: 'get',
                    params
                  })
                }`

      case 'PUT':
        return `// ${description}
                export const ${methodName} = (data) => {
                  return request({
                    url: '${path}',
                    method: 'put',
                    data
                  })
                }`

      case 'DELETE':
        return `// ${description}
                export const ${methodName} = (data) => {
                  return request({
                    url: '${path}',
                    method: 'delete',
                    data
                  })
                }`

      default:
        return '暂不支持当前请求格式'
    }
  }
function initPage() {
    let path = $('#editor-md > ul > li > code').text()
    path = path.replace(/[\u200B-\u200D\uFEFF]/g, '')
    const description = $('#doc-title-box #doc-title').text()

    const urlList = path.split('/')
    const methodName = toHump('_' + urlList[urlList.length-1])

    const el = $('#editor-md').children()[5]
    const method = $(el).children().text()

    $('#editor-md').before($('<div id="add-api-btn"></div>')
       .append(createATag('复制URL', path))
       .append(createATag('复制函数', createFunc(method, path, description)))
       .append(createATag('复制函数名', 'api' + methodName))
    )
}
    // 初始化
    const _vue = document.querySelector('#app').__vue__
    _vue.$router.afterHooks.push(function(){
        _vue.$router.go(0)
    })
    window.setTimeout(initPage, 300);
})()
