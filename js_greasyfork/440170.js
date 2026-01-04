// ==UserScript==
// @name        v_dian_f_seller
// @namespace   v_dian_f_seller
// @resource    toastr https://cdn.staticfile.org/toastr.js/2.1.4/toastr.min.css
// @require     https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require     https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require     https://cdn.staticfile.org/toastr.js/2.1.4/toastr.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @match       *://h5.weidian.com/m/fxsupplier/goods-list.html?*
// @version     1.0.0
// @author      lluvio
// @license MIT
// @run-at      document-end
// @description 2021/12/30 下午6:17:20
// @downloadURL https://update.greasyfork.org/scripts/440170/v_dian_f_seller.user.js
// @updateURL https://update.greasyfork.org/scripts/440170/v_dian_f_seller.meta.js
// ==/UserScript==
(function () {
  'use strict';
  function init_toastr() {
    GM_addStyle(GM_getResourceText('toastr'));
    toastr.options.timeOut = 800;
    toastr.options.positionClass = 'toast-top-center'
  }
  
  function page_start() {
    document.head.insertAdjacentHTML("beforeend", `<style> #toast-container .toast{left:0}</style>`)
    console.log('plugin page once start')
    init_toastr()
  }

  function add_dom(dom) {
    if(dom.classList.contains('goods-list-item') && 
      !dom.classList.contains('share_dom_added')
    ) {
      const item_url = dom.attributes.itemurl.value
      let button = document.createElement('button')
      const item_title = dom.querySelector('.goods-title').innerHTML

      button.onclick = ()=> {
        console.log(item_url)
        console.log(item_title)
      }
      const copy_template = `${item_title}\n\n${item_url}`
      button.setAttribute('data-clipboard-text', copy_template)
      const clipboard = new ClipboardJS(button);
      clipboard.on('success', function () {
        toastr.success('复制成功')
      });
      button.innerHTML = '选择'
      button.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
      padding: 30px 40px;
      font-size: 40px;
      `
      dom.classList.add('share_dom_added') // 对已添加子节点做个flag
      dom.append(button)
    }
  }

  let timer = setInterval(function () {
    const listen_doms = $('.goods-list-item')
    const listen_doms_wraps = $('#listWrap')[0]
    if (listen_doms.length && listen_doms_wraps) {
      clearInterval(timer)
      // 页面初始化执行一次
      page_start()
      for(let dom of listen_doms) { 
        add_dom(dom)
      }

      // 监听 父节点 下添加的节点
      new MutationObserver((mutations, self) => {
        mutations.forEach(({ addedNodes }) => {
          addedNodes.forEach(node => {
              add_dom(node);
          });
        });
      }).observe(listen_doms_wraps, { childList: true, subtree: true });
  }
  }, 400)
})()
