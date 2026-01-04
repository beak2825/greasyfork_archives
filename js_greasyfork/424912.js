// ==UserScript==
// @name        Swagger 文档自定义请求头
// @description 匹配 swagger-ui.html 页面并为每个请求注入自定义 header
// @namespace   https://github.com/liuycy
// @match       *://*/swagger-ui*
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require     https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @version     2.0.1
// @author      liuycy
// @downloadURL https://update.greasyfork.org/scripts/424912/Swagger%20%E6%96%87%E6%A1%A3%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%B7%E6%B1%82%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/424912/Swagger%20%E6%96%87%E6%A1%A3%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%B7%E6%B1%82%E5%A4%B4.meta.js
// ==/UserScript==

!(function () {
  var FETCH = unsafeWindow.fetch
  var XHR_SEND = XMLHttpRequest.prototype.send
  
  function resetHeader(headers) {
    Object.defineProperty(unsafeWindow, 'fetch', {
      value: function() {
        const options = arguments[1] || {}
        options.headers = { ...options.headers, ...headers }
        arguments[1] = options
        return FETCH.apply(this, arguments)
      }
    })
    
    XMLHttpRequest.prototype.send = function() {
      for (const key in headers) this.setRequestHeader(key, headers[key])
      return XHR_SEND.apply(this, arguments)
    }
  }
  
  function renderHeaderTable($info) {
    var $header = $info.querySelector('#headers-table')
    if ($header) $header.remove()
    
    Vue.component('add-icon', {
      template: `<svg v-once t="1617866353541" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1882" width="25" height="25"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 64C311.701333 149.333333 149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333z m0 128a32 32 0 0 1 32 32v170.645334l170.666667 0.021333a32 32 0 0 1 0 64l-170.688-0.021333 0.021333 170.688a32 32 0 0 1-64 0l-0.021333-170.688-170.645334 0.021333a32 32 0 0 1 0-64l170.666667-0.021333V309.333333A32 32 0 0 1 512 277.333333z" fill="#333333" p-id="1883"></path></svg>`
    })
    Vue.component('del-icon', {
      template: `<svg v-once t="1617866380222" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1882" width="25" height="25"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 64C311.701333 149.333333 149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333z m202.666667 330.666667a32 32 0 0 1 0 64h-405.333334a32 32 0 0 1 0-64h405.333334z" fill="#333333" p-id="1883"></path></svg>`
    })
    
    var headerTable = new Vue({
      template: `
      <div id="headers-table">
        <p>自定义请求头: 请在下方填写 key-value 形式的请求头</p>
        <div v-for="(item, i) in headers" :key="i" style="display: grid; gap: 10px; grid-template-columns: 150px auto 25px 25px; margin-top: 5px;">
          <input v-model="item.key" placeholder="header key" />
          <input v-model="item.value" placeholder="header value" />
          <del-icon @click.native="handleDel(i)" />
          <add-icon @click.native="handleAdd" v-if="i === headers.length - 1" />
        </div>
      </div>
      `,
      data() {
        return { headers: GM_getValue('headersList', [{}]) }
      },
      methods: {
        handleDel(i) {
          this.headers.splice(i, 1)
          if (!this.headers.length) this.handleAdd()
        },
        handleAdd() {
          this.headers.push({})
        }
      },
      watch: {
        headers: {
          handler: _.debounce(function(list) {
            GM_setValue('headersList', list)
            
            var headersMap = list.reduce((map, item) => {
              if (item.key) map[item.key] = item.value
              return map
            }, {})
            
            resetHeader(headersMap)
          }, 200),
          deep: true,
          immediate: true
        }
      }
    }).$mount()
    
    $info.insertBefore(headerTable.$el, null)
  }
  
  function init() {
    var observer = new MutationObserver(() => {
      var $info = document.querySelector('.information-container .info')
      
      if ($info) {
        observer.disconnect()
        renderHeaderTable($info)
      }
    }) 
    
    observer.observe(document.querySelector('#swagger-ui'), {
      childList: true,
      subtree: true
    })
  }
  
  function wrapper(type) {
    var origin = history[type];
    return function() {
      var event = new Event(type)
      event.arguments = arguments
      window.dispatchEvent(event)
      return origin.apply(this, arguments)
    }
  }
  
  history.pushState = wrapper('pushState')
  history.replaceState = wrapper('replaceState')
  
  window.addEventListener('replaceState', init)
  window.addEventListener('pushState', init)
  window.addEventListener('load', init)
  
})()
