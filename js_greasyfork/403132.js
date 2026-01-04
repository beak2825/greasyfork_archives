// ==UserScript==
// @name         Swagger Tool DAWN
// @version      1.0.3
// @description  内部使用swagger-ui增强脚本，方便复制url为函数
// @author      lixiang
// @match        http://*/swagger-ui.html*
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.11.0/beautify.js

// @grant        GM_addStyle
// @run-at       document-end
// @license     MIT
// @namespace https://greasyfork.org/users/559637
// @downloadURL https://update.greasyfork.org/scripts/403132/Swagger%20Tool%20DAWN.user.js
// @updateURL https://update.greasyfork.org/scripts/403132/Swagger%20Tool%20DAWN.meta.js
// ==/UserScript==
// https://developer.chrome.com/extensions/match_patterns
(async function (open) {
  let totalRes = null
  const opts = {
    indent_size: 2
}

  function splitLast (str) {
    const lastIndex = str.lastIndexOf('/')
    return str.slice(lastIndex + 1)
  }
  function highlight () {
    for (const codeblock of document.getElementsByTagName('code')) {
      hljs.highlightBlock(codeblock)
    }
  }
  function addOutCss (href) {
    var head = document.querySelector('head')
    var link = document.createElement('link')
    link.href = href + ''
    link.rel = 'stylesheet'
    link.type = 'text/css'
    head.appendChild(link)
  }
  function firstUpperCase (str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
  }
  function splitLastSecond (str) {
    const arr = str.split('/')
    return arr[arr.length - 2]
  }
  function toHump (str) {
    if (!str) { return }
    let newStr = ''
    let big = false
    for (const i in str) {
      let s = str[i]
      if (big) {
        s = s.toLocaleUpperCase()
        big = false
      }
      if (s === '_') { big = true } else newStr += s
    }
    return newStr
  }
  function getSelectValue () {
    const selectUrl = document.querySelector('#selectUrl')
    const index = selectUrl.selectedIndex // 序号，取当前选中选项的序号
    const select = selectUrl.options[index].value
    return select
  }
  function getUrlName (url) {
    const type = getSelectValue()
    let urlName = ''
    if (type === 'first') {
      urlName = toHump(splitLast(url))
    } else if (type === 'second') {
      const urlName2 = firstUpperCase(toHump(splitLast(url)))
      const urlName1 = toHump(splitLastSecond(url))
      urlName = urlName1 + urlName2
    }
    return urlName
  }
  function getPrefix () {
    return document.querySelector('#urlPrefix').value ? '/' + document.querySelector('#urlPrefix').value : ''
  }
  function setClipboardDisplay (e) {
    const text = e.text
    document.querySelector('#cliDisplaySpan').textContent = text
    highlight()
    e.clearSelection()
  }
  function addSheet (params) {
    GM_addStyle(
      `
      #cliDisplay .hljs {
  display: block !important;
  overflow-x: auto !important;
  padding: 0.5em !important;
  color: #abb2bf !important;
  background: #282c34 !important;
}

#cliDisplay .hljs-comment,
#cliDisplay .hljs-quote {
  color: #5c6370 !important;
  font-style: italic !important;
}

#cliDisplay .hljs-doctag,
#cliDisplay .hljs-keyword,
#cliDisplay .hljs-formula {
  color: #c678dd !important;
}

#cliDisplay .hljs-section,
#cliDisplay .hljs-name,
#cliDisplay .hljs-selector-tag,
#cliDisplay .hljs-deletion,
#cliDisplay .hljs-subst {
  color: #e06c75 !important;
}

#cliDisplay .hljs-literal {
  color: #56b6c2 !important;
}

#cliDisplay .hljs-string,
#cliDisplay .hljs-regexp,
#cliDisplay .hljs-addition,
#cliDisplay .hljs-attribute,
#cliDisplay .hljs-meta-string {
  color: #98c379 !important;
}

#cliDisplay .hljs-built_in,
#cliDisplay .hljs-class .hljs-title {
  color: #e6c07b !important;
}

#cliDisplay .hljs-attr,
#cliDisplay .hljs-variable,
#cliDisplay .hljs-template-variable,
#cliDisplay .hljs-type,
#cliDisplay .hljs-selector-class,
#cliDisplay .hljs-selector-attr,
#cliDisplay .hljs-selector-pseudo,
#cliDisplay .hljs-number {
  color: #d19a66 !important;
}

#cliDisplay .hljs-symbol,
#cliDisplay .hljs-bullet,
#cliDisplay .hljs-link,
#cliDisplay .hljs-meta,
#cliDisplay .hljs-selector-id,
#cliDisplay .hljs-title {
  color: #61aeee !important;
}

#cliDisplay .hljs-emphasis {
  font-style: italic !important;
}

#cliDisplay .hljs-strong {
  font-weight: bold !important;
}

#cliDisplay .hljs-link {
  text-decoration: underline !important;
}

      `
    )
    GM_addStyle(
      `
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    border-radius: 3px;
    background: #c678dd57;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
}
.swagger-section #header {
  position:relative;
}
.search_wrapper {
 
}
.setting_card {
       position: absolute;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 2px 6px 2px rgba(60,64,67,.15);
    overflow-x: hidden;
    padding-top: 0;
    height: 120px;
    width: 320px;
    right: 10px;
    top: 60px;
    padding: 10px 10px;
    visibility:hidden;
    z-index:1
}
.setting_item {
      padding: 5px 0;
    margin-bottom: 5px;
    border-bottom: 1px solid #f2f2f2;
}
.setting_icon {
  position:absolute;
  right:10px;
  top:10px;
   cursor: pointer;
}
.setting_icon:hover {
   animation: myRotate 3s linear infinite;
}
@keyframes myRotate{
    0%{ -webkit-transform: rotate(0deg);}
    50%{ -webkit-transform: rotate(180deg);}
    100%{ -webkit-transform: rotate(360deg);}
}
        .card {
          position: relative;
          background: #282c34 !important;

          margin: 1rem 0;
          padding: 1em 1em;
          border-radius: 0.2rem;
          border:none !important;
        max-height: 150px;
    overflow: auto;
        }
        .card:hover {
          box-shadow:2px 2px 9px 0px #1e3b50;
        }
        .header-label {
          color:#666;
              width: 120px;
    display: inline-block;
        }
        select {
          border: 1px solid #ccc;
          padding: 7px 0px;
          border-radius: 3px;
          padding-left: 5px;
          -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          box-shadow: inset 0 1px 1px rgba(80, 69, 69, 0.075);
          -webkit-transition: border-color ease-in-out 0.15s,
            -webkit-box-shadow ease-in-out 0.15s;
          -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
          transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
        }
        option {
          height: 30px;
          padding: 5px 4px;
        }
        input {
          border: 1px solid #ccc;
          padding: 7px 0px;
          border-radius: 3px;
          padding-left: 5px;
          -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          -webkit-transition: border-color ease-in-out 0.15s,
            -webkit-box-shadow ease-in-out 0.15s;
          -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
          transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
        }
        input:focus {
          border-color: #66afe9;
          outline: 0;
          -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(102, 175, 233, 0.6);
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(102, 175, 233, 0.6);
        }
        button {
          display: inline-block;
          position: relative;
          cursor: pointer;
          padding: 7px 4px;
          color: white;
          font-size: 0.7em;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          vertical-align: middle;
          white-space: nowrap;
          outline: none;
          border: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          border-radius: 2px;
          background-color: #89bf04;
        }
        button + button {
          margin-left: 5px;
        }
        button:hover {
          background-color: #aee032;
          text-decoration: none;
          box-shadow: 0 4px 10px 0px rgba(0, 0, 0, 0.225);
        }
    `)
  }
  function readyAsync () {
    return new Promise((resolve, reject) => {
      XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
        this.addEventListener('readystatechange', () => {
        }, false)
        let timer = null
        let inited = false
        let myUrl = null
        if (url.includes('api-docs')) {
          myUrl = url
          timer = setInterval(() => {
            if (inited) {
              clearInterval(timer)
              inited = false
            } else {
              const elementArr = document.querySelectorAll('.http_method')
              if (elementArr.length !== 0) {
                if (myUrl.includes('api-docs')) {
                  inited = true
                  resolve(myUrl)
                }
              }
            }
          }, 1000)
        }
        open.call(this, method, url, async, user, pass)
      }
    })
  }
  function readyAndWatch (func) {
    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
      this.addEventListener('readystatechange', () => {
      }, false)
      let timer = null
      let inited = false
      let myUrl = null
      if (url.includes('api-docs')) {
        myUrl = url
        timer = setInterval(() => {
          if (inited) {
            clearInterval(timer)
            inited = false
          } else {
            const elementArr = document.querySelectorAll('.http_method')
            if (elementArr.length !== 0) {
              if (myUrl.includes('api-docs')) {
                inited = true
                func(myUrl)
              }
            }
          }
        }, 1000)
      }
      open.call(this, method, url, async, user, pass)
    }
  }
  function getJsonAsync (url) {
    return new Promise((resolve, reject) => {
      const res = fetch(url)
        .then(res => {
          return res.json()
        })
        .catch(e => {
          reject(e)
        })
      res.then(res => {
        const totalRes = res
        resolve(totalRes)
      })
    })
  }

  function createExpand () {
    document.querySelector('#message-bar').insertAdjacentHTML('afterbegin', `
      <button id='collapse'>合起全部</button>
      <button id='expandAll'>展开全部</button>
    `)
    document.querySelector('#collapse').onclick = collapse
    document.querySelector('#expandAll').onclick = expandAll
    function expandAll () {
      const list = document.querySelector('#resources')
      const items = list.children;
      [...items].forEach(li => {
        li.classList.add('active')
        li.querySelector('ul.endpoints').style.display = 'block'
      })
    }
    function collapse () {
      const list = document.querySelector('#resources')
      const items = list.children;
      [...items].forEach(li => {
        li.classList.remove('active')
        li.querySelector('ul.endpoints').style.display = 'none'
      })
    }
  }

  function createCliDisplay () {
    document.querySelector('#message-bar').insertAdjacentHTML('afterbegin',
        `
          <pre class='card' id='cliDisplay'><code class='code javascript' id='cliDisplaySpan'>剪贴板展示</code></pre>   
        `
    )
  }
  function createCopyUrlAll () {
    const blockArr = document.querySelectorAll('#resources > .resource')

    blockArr.forEach(ele => {
      const button = document.createElement('button')
      button.innerHTML = '复制所有url'
      button.classList.add('copy_url_all')

      ele.querySelector('.heading').children[0].prepend(button)

      const paths = new Set();

      [...ele.querySelector('.endpoints').children].forEach(li => {
        const url = li.querySelector('.path').children[0].innerHTML
        const method = li
          .querySelector('.http_method')
          .children[2].innerHTML.toUpperCase()
        const note = li.querySelector('.markdown').children[0].innerHTML
        const obj = {
          url,
          method,
          note
        }
        const objStr = JSON.stringify(obj)
        paths.add(objStr)
      })
      button.dataset.clipboardText = Array.from(paths).join(';')
    })
  }
  function createCopyUrl () {
    const elementArr = document.querySelectorAll('.endpoint')
    elementArr.forEach(ele => {
      const button = document.createElement('button')
      button.innerHTML = '复制url'
      button.classList.add('copy_url')
      ele.querySelector('.http_method').prepend(button)
      const url = ele.querySelector('.path').children[0].innerHTML
      const method = ele.querySelector('.http_method').children[2].innerHTML.toUpperCase()
      const note = ele.querySelector('.markdown').children[0].innerHTML
      const obj = {
        url,
        method,
        note
      }
      const objStr = JSON.stringify(obj)
      button.dataset.clipboardText = objStr
    })
  }
  function createCopyFunc () {
    const elementArr = document.querySelectorAll('.endpoint')
    elementArr.forEach(ele => {
      const button = document.createElement('button')
      button.innerHTML = '复制为async函数'
      button.classList.add('copy_func')
      ele.querySelector('.http_method').prepend(button)
      const url = ele.querySelector('.path').children[0].innerHTML

      const pathRes = totalRes.paths[url].get || totalRes.paths[url].post
      const parameters = pathRes.parameters
      if (!parameters) {
        return
      }
      const parameterLast = parameters[parameters.length - 1]

      let ref
      let comment
      if (parameterLast.in === 'body') {
        if (parameterLast.schema.$ref) {
          ref = splitLast(parameterLast.schema.$ref)

          const definition = totalRes.definitions[ref]
          if (definition) {
            const properties = definition.properties

            const parameters = Object.keys(properties).map(key => {
              const property = properties[key]
              const obj = {}
              obj.name = key
              obj.description = property.description
              obj.type = property.type

              return obj
            })

            comment = parameters.reduce((acc, cur) => {
              if (cur.name == 'token') {
                return acc
              }
              acc = `${acc}
                    ${cur.name}:'',//${cur.description} ${cur.type}`
              return acc
            }, '')
          }
        }
      } else {
        comment = parameters.reduce((acc, cur) => {
          if (cur.name == 'token') {
            return acc
          }
          acc = `${acc}
                ${cur.name}:'', //${cur.description} ${cur.type}`
          return acc
        }, '')
      }

      if (!comment) {
        comment = '//无需参数'
      }
      const obj = {
        url,
        comment
      }
      button.dataset.clipboardText = JSON.stringify(obj)
    })
  }
  function createMock() {
     const elementArr = document.querySelectorAll('.endpoint')
    elementArr.forEach(ele => {
      const button = document.createElement('button')
      button.innerHTML = '复制mock'
      button.classList.add('copy_mock')
      ele.querySelector('.http_method').prepend(button)
      const url = ele.querySelector('.path').children[0].innerHTML
      const method = ele.querySelector('.http_method').children[2].innerHTML.toUpperCase()
      const note = ele.querySelector('.markdown').children[0].innerHTML
      const obj = {
        url,
        method,
        note
      }
      const objStr = JSON.stringify(obj)
      button.dataset.clipboardText = objStr
    })
  }


  function createButtonTable () {
    const elementArr = document.querySelectorAll('.endpoint')
    elementArr.forEach(ele => {
      const button = document.createElement('button')
      button.innerHTML = '复制为列表项'
      button.classList.add('copy_table')
      if (ele.querySelector('.description')) {
        ele.querySelector('.description').prepend(button)
        const description = ele.querySelector('.description')
        const div = description.querySelectorAll('div')
        const list = [...div]
        const table = list.reduce((acc, cur) => {
          if (cur.querySelector('.propDesc')) {
            const propName = cur.querySelector('.propName').innerHTML
            const noPropNameList = ['code', 'data', 'message', 'list', 'pageNum', 'pageSize', 'total ']
            if (noPropNameList.includes(propName)) {
              return acc
            }
            const propDesc = cur.querySelector('.propDesc').querySelector('p').innerHTML
            acc = `
            ${acc}
              {
                prop:"${propName}",
                label:"${propDesc}"
              },
              `
            return acc
          } else {
            return acc
          }
        }, '')
        button.dataset.clipboardText = table
      }
    })
  }
  function getResponse(url,totalRes) {
    const paths = totalRes.paths
    const path = paths[url]
    const responseDes = path['get'] || path['post']
    const response = responseDes.responses['200']
    const schemaUrl = response.schema['$ref']
    if (!schemaUrl) {
      return
    }
    const schema = splitLast(schemaUrl)
   
    const value = generateMockRef(schema)
    return value
 
  }
  function generateMockRef(schema) {
    const definitions = totalRes.definitions
    const definition = definitions[schema]
    const value = generateMock('',definition)
 
    return value
  }
  function generateMock(key,data) {
    if (key==='code') {
      return "code:'200',"
    }
    if (key==='message') {
      return "message:'成功',"
    }
    const schemaUrl = data['$ref'] ||null
    const type = data['type']  ||null
    const format = data['format']  ||null
    const description = data['description'] || '无注释'
    const items = data['items']  ||null
    let dataType = null
    if (schemaUrl) {
      dataType = 'ref'
    } else if (type==='object') {
      dataType = 'object'
    }else if (type && (type === 'integer'||type==='number')) {
      dataType = 'number'
    }else if (type&&type === 'string' && !format) {
      dataType = 'string'
    } else if (type&&type === 'string' && (format && format === 'date-time')) {
      dataType = 'time'
    } else if (type&&type==='array') {
      dataType ='array'
    } else if (type && type === 'boolean') {
      dataType='boolean'
    }
    let value = null
    switch (dataType) {
      case 'ref':
        const schema = splitLast(schemaUrl)
        value = generateMockRef(schema)
        break;
      case 'object':
        const properties = data['properties']
        if (!properties||Object.keys(properties).length===0) {
          value = generateMockString(description)
        } else {
           value = generateMockObject(properties)
        }
       
        break;
    
      case 'number':
        value = generateMockNumber(description)
        break;
    
      case 'string':
        value = generateMockString(description)
        break;
    
      case 'boolean':
        value = generateMockBoolean(description)
        break;
    
      case 'time':
        value = generateMockDate(description)
        break;
    
      case 'array':
        value = generateMockArray(items)
        break;
    
      default:
        break;
    }
    let res = null
    if (key && (dataType !== 'array')) {
       res= `'${key}':${value}`
    } else if (key&&dataType==='array') {
      res = `'${key}|5-15':[
        ${value}
      ], // ${description}`
    } else {
       res= `${value}`
    }
   return res
  }
  function generateMockBoolean(description) {
    return `Random.boolean(), //${description}`
  }
  function generateMockNumber(description) {
    return `Random.integer(), //${description}`
  }

  function generateMockString(description) {
    return `Random.csentence(3,5), //${description}`
  }
  function generateMockDate(description) {
    return `Random.date('T'), //${description}`
  }
  function generateMockObject(properties) {
   const mockObject  = Object.keys(properties).reduce((acc, cur) => {
      const key = cur
      const data = properties[key]
      const keyMock =  generateMock(key, data)
     acc = acc + ` 
      ${keyMock}`
     return acc
   }, '')
    return `{${mockObject}
    },`
  }
  function generateMockArray(items) {
    const value = generateMock('',items) 
    return value
  }
  function clipboard () {
    const clipboardUrl = new ClipboardJS('.copy_url', {
      text: function (trigger) {
        const objStr = trigger.dataset.clipboardText
        const obj = JSON.parse(objStr)
        const urlPrefix = getPrefix()
        const urlName = getUrlName(obj.url)
        const url = `export const ${urlName}  = data => request('${urlPrefix}${obj.url}', data,"${obj.method}")//${obj.note}`
        return url
      }
    })

    const clipboardMock = new ClipboardJS('.copy_mock', {
      text:function (trigger) {
        const objStr = trigger.dataset.clipboardText
        const obj = JSON.parse(objStr)
        const { url } = obj
        const response = getResponse(url, totalRes)
        const source = `
        '/mock${url}':${response}
        `
       return js_beautify(source, opts)
      }
    })

    const clipboardUrlAll = new ClipboardJS('.copy_url_all', {
      text: function (trigger) {
        const arr = trigger.dataset.clipboardText.split(';')
        const paths = new Set()
        arr.forEach(objStr => {
          const obj = JSON.parse(objStr)
          const urlPrefix = getPrefix()
          const urlName = getUrlName(obj.url)
          const url = `export const ${urlName}  = data => request('${urlPrefix}${obj.url}', data,"${obj.method}")//${obj.note}`
          paths.add(url)
        })
        return Array.from(paths).join('\n')
      }
    })

    const clipboardFunc = new ClipboardJS('.copy_func', {
      text: function (trigger) {
        const objStr = trigger.dataset.clipboardText
        const obj = JSON.parse(objStr)
        const comment = obj.comment
        const asyncName = getUrlName(obj.url)
        const fun = `
        async ${asyncName}Async() {
          let params = {
          ${comment}
          }
          let res = await api.${asyncName}(params)
          },
          `
        return fun
      }
    })
    const clipboardTable = new ClipboardJS('.copy_table', {
      text: function (trigger) {
        const table = trigger.dataset.clipboardText
        return table
      }
    })

    clipboardUrl.on('success', setClipboardDisplay)
    clipboardMock.on('success', setClipboardDisplay)
    clipboardUrlAll.on('success', setClipboardDisplay)
    clipboardFunc.on('success', setClipboardDisplay)
    clipboardTable.on('success', setClipboardDisplay)
  }
  function createSelect () {
    document.querySelector('.setting_card').insertAdjacentHTML('afterbegin',
        `
        <div class='setting_item'>
           <label for="selectUrl" class='header-label'>url截取范围:</label>
        <select name='selectUrl' id='selectUrl'>
          <option value="first"  selected = "selected">最后一级</option>
          <option value="second">最后二级</option>
        </select>
        </div>
        `
    )
  }
  function createInput () {
    document.querySelector('.setting_card').insertAdjacentHTML('afterbegin',
        `
        <div class='setting_item'>
           <label for="prefix" class='header-label'>url前缀:</label>
          <input type="text" id="urlPrefix" name="prefix" placeholder='后端微服务名'>
        </div>
         
        `
    )
  }
  function createSetting () {
    document.querySelector('#header').insertAdjacentHTML('beforeend',
        `
          <div class='setting_icon'>
           <svg t="1589098334770" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2404" width="35" height="35"><path d="M935.69113 523.130435c0-58.590609 36.797217-108.232348 88.30887-128a513.669565 513.669565 0 0 0-56.097391-135.635478 136.97113 136.97113 0 0 1-181.047652-181.092174A515.962435 515.962435 0 0 0 651.152696 22.26087 137.371826 137.371826 0 0 1 523.130435 110.569739 137.171478 137.171478 0 0 1 395.130435 22.26087a513.669565 513.669565 0 0 0-135.635478 56.141913 137.126957 137.126957 0 0 1-28.093218 152.932174 137.371826 137.371826 0 0 1-152.887652 28.16A510.21913 510.21913 0 0 0 22.26087 395.130435 137.371826 137.371826 0 0 1 110.569739 523.130435c0 58.590609-36.797217 108.232348-88.308869 128a513.669565 513.669565 0 0 0 56.141913 135.635478 136.97113 136.97113 0 0 1 180.980869 181.092174A515.650783 515.650783 0 0 0 395.130435 1024a137.371826 137.371826 0 0 1 128.022261-88.30887c58.590609 0 108.232348 36.797217 128 88.30887a513.669565 513.669565 0 0 0 135.635478-56.097391 137.126957 137.126957 0 0 1 28.093217-152.998957 137.371826 137.371826 0 0 1 152.887652-28.137739A510.21913 510.21913 0 0 0 1024 651.130435a137.171478 137.171478 0 0 1-88.30887-128.022261z m-401.719652 152.442435a141.55687 141.55687 0 1 1 0.111305-283.11374 141.55687 141.55687 0 0 1-0.111305 283.11374z" fill="#2DAA9D" p-id="2405"></path><path d="M754.042435 512c0-34.370783 21.593043-63.510261 51.801043-75.108174a301.345391 301.345391 0 0 0-32.901565-79.560348 80.361739 80.361739 0 0 1-106.22887-106.228869 302.703304 302.703304 0 0 0-79.604869-32.946087A80.584348 80.584348 0 0 1 512 269.957565 80.473043 80.473043 0 0 1 436.891826 218.156522c-27.959652 7.123478-54.761739 18.209391-79.560348 32.946087a80.450783 80.450783 0 0 1-16.473043 89.711304 80.584348 80.584348 0 0 1-89.711305 16.517565A299.341913 299.341913 0 0 0 218.156522 436.891826 80.584348 80.584348 0 0 1 269.957565 512c0 34.370783-21.593043 63.510261-51.801043 75.108174 7.123478 27.959652 18.209391 54.761739 32.946087 79.560348a80.361739 80.361739 0 0 1 106.184348 106.228869 302.525217 302.525217 0 0 0 79.604869 32.946087A80.584348 80.584348 0 0 1 512 754.042435c34.370783 0 63.510261 21.593043 75.108174 51.801043 27.959652-7.123478 54.761739-18.18713 79.560348-32.901565a80.450783 80.450783 0 0 1 16.473043-89.755826 80.584348 80.584348 0 0 1 89.711305-16.517565 299.341913 299.341913 0 0 0 32.990608-79.560348A80.473043 80.473043 0 0 1 754.042435 512z m-235.675826 89.421913a83.033043 83.033043 0 1 1 0.044521-166.066087 83.033043 83.033043 0 0 1-0.044521 166.066087z" fill="#A4E8E1" p-id="2406"></path></svg>
          </div>
          <div class='setting_card'>
           
          </div>
        `
    )
    document.querySelector('.setting_icon').onclick = changeShow
    let isShow = false
    function changeShow () {
      if (isShow) {
        isShow = false
        document.querySelector('.setting_card').style.visibility = 'hidden'
      } else {
        isShow = true
        document.querySelector('.setting_card').style.visibility = 'visible'
      }
    }
  }
  function createSearch (params) {
    document.querySelector('#header').insertAdjacentHTML('beforeend',
        `
          <div class='search_wrapper'>
            <label for="search" class='header-label'>搜索：</label>
          <input type="text" id="search" name="search" placeholder='输入汉字'>
          </div>
          
        `
    )
  }
  addSheet()
  async function init (url) {
    totalRes = await getJsonAsync(url)
    createExpand()
    createSetting()
    createSelect()
    createInput()

    createCliDisplay()
    createCopyFunc()
    createCopyUrl()
    createMock()
    createCopyUrlAll()
    createButtonTable()
   
    clipboard()
    highlight()
  }
  readyAndWatch(init)
}
)(XMLHttpRequest.prototype.open)
