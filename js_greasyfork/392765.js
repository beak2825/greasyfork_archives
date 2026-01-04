// ==UserScript==
// @name         npmjs
// @description  npm下载量查看
// @namespace    npm_script
// @version      1.2.2
// @author       vizo
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @include      *://*npmjs.com/search*
// @include      *://*npmjs.com/package*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes

// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/392765/npmjs.user.js
// @updateURL https://update.greasyfork.org/scripts/392765/npmjs.meta.js
// ==/UserScript==

'use strict'

GM_addStyle(`
  .spr7s {
    color: #f00;
    font-size: 12px;
    font-weight: normal;
    margin-left: 10px;
    font-family: Arial;
    font-style: italic;
  }
  .i_mxs {
    font-style: italic;
    color: #b1b1b1;
    font-size: 12px;
    margin-left: 15px;
    font-weight: normal;
  }
  .code1s {
    display: block;
    border: 1px solid #0ad;
    padding: 5px;
  }
  .code1s * {
    font-family: Consolas, "Helvetica Neue", PingFang SC, sans-serif !important;
    font-size: 14px;
    font-weight: normal;
  }
  .code1s pre {
    margin-bottom: 0;
  }
`)

let timer1s = null

$(function () {
  
  function initScript() {
    eachItem()
  }
  
  function reqItemDetail(url, domTit) {
    GM_xmlhttpRequest({
      url,
      method: 'get',
      onload: function(xhr) {
        try {
          let text = xhr.response
          let downNum = text.replace(/[\n\r\f]/g, '').replace(/.+pb1">(.+?)<\/p>.+/g, '$1')
          if (downNum.length > 20) return
          domTit.append(`<span class="spr7s">${downNum}</span><i class="i_mxs">流行度,质量,更新</i>`)
        } catch (e) {}
      },
    })
  }
  
  // 遍历item
  function eachItem() {
    let ns = $('.pt2-ns .pl1-ns')
    ns.each((i, v) => {
      let tis = $(v)
      let url = tis.find('.pr3 > a').attr('href')
      let h3 = tis.find('.pr3 > a > h3.fw6')
      let cts = h3.find('.spr7s')
      if (!cts.length && i < 4) {
        reqItemDetail(url, h3)
      }
    })
  }
  
  setTimeout(() => {
    $('.highlight pre').wrap('<code class="code1s"></code>')
  }, 1000)
  
  initScript()
})