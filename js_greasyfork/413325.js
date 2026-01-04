// ==UserScript==
// @name         flash-swagger
// @namespace    https://www.flashexpress.com/
// @version      0.5
// @description  swagger 快捷插件
// @author       杨淼
// @match        http://*/swagger-ui.html*
// @grant        GM_addStyle
// @run-at       document-end
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.js
// @downloadURL https://update.greasyfork.org/scripts/413325/flash-swagger.user.js
// @updateURL https://update.greasyfork.org/scripts/413325/flash-swagger.meta.js
// ==/UserScript==

(function() {
  'use strict'

  console.log('油猴启动')
  new ClipboardJS('.copy-btn')

  function createATag(text, content) {
    const temp = $(`<button class="btn copy-btn" data-clipboard-text="${content}">${text}</button>`)

    temp.on('click', function(event) {
      event.preventDefault()
    })

    return temp
  }

  function toHump(name) {
    return name.replace(/\-(\w)/g, function(all, letter){
      return letter.toUpperCase();
    });
  }

  function createFunc(methoud, path, description) {
    const methoudName = toHump(path.match('[^/]+(?!.*/)')[0])
    switch (methoud.toUpperCase()) {
      case 'POST':
        return `// ${description}
                export const ${methoudName} = (data) => {
                  return axiosRequest({
                    url: '${path}',
                    data
                  })
                }`

      case 'GET':
        return `// ${description}
                export const ${methoudName} = (params) => {
                  return axiosRequest({
                    url: '${path}',
                    method: 'get',
                    params
                  })
                }`

      case 'PUT':
        return `// ${description}
                export const ${methoudName} = (data) => {
                  return axiosRequest({
                    url: '${path}',
                    method: 'put',
                    data
                  })
                }`

      default:
        return '暂不支持当前请求格式'
    }
  }

  $('body')
    .delegate('.opblock-tag', 'click', function(event) {
      console.log($(this).next())
      // DOM异步展示 用宏任务包裹
      setTimeout(() => {
        $(this).next().children('span').each((index, $el) => {
          console.log($el)
          $el = $($el)

          const methoud = $($el).find('.opblock-summary-method').text()
          const path = $($el).find('.opblock-summary-path > a > span').text()
          const description = $($el).find('.opblock-summary-description').text()

          $el.before($('<div></div>')
            .append(createATag('复制URL', path))
            .append(createATag('复制函数', createFunc(methoud, path, description)))
          )
        })
      })
    })
})()
