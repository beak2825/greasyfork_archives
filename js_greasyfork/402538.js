// ==UserScript==
// @name         记录错误的xhr请求
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  记录页面中诸如401、403、500之类的错误的ajax请求，并将结果显示在右上角，点击每条链接可以copy具体的错误信息。
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/402538/%E8%AE%B0%E5%BD%95%E9%94%99%E8%AF%AF%E7%9A%84xhr%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/402538/%E8%AE%B0%E5%BD%95%E9%94%99%E8%AF%AF%E7%9A%84xhr%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==

(function(open) {
    'use strict';
    var panel = document.createElement('div')
    panel.classList.add('reqPanel')
    var list = document.createElement('ul')
    panel.appendChild(list)
    GM_addStyle('.reqPanel { position:fixed;z-index:999;top:0;right:0;padding:10px;background-color:bisque;max-height:30%;overflow:auto;} .reqPanel ul{list-style:none;margin:0;padding:0} .reqPanel ul li{margin-bottom:10px;} .reqPanel ul li:last-child{margin-bottom:0;}');
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if(this.readyState === 4){
              if(/^(4|5)/.test(this.status)){
                  renderReq(this)
              }
            }
        });
        open.apply(this, arguments);
    }
    function renderReq(req){
       var node = document.querySelector('.reqPanel')
       if(!node) document.body.appendChild(panel)
       var li = document.createElement('li')
       li.style.cssText +='width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'
       var link = document.createElement('a')
       link.href = 'javascript:;'
       link.textContent = req.responseURL
       link.title = req.responseURL
       link.addEventListener('click',function(e){
          e.preventDefault()
          copyToClipboard(JSON.stringify({
             responseURL: req.responseURL,
             response: req.response
          }))
           alert('copy success')
       })
       li.appendChild(link)
       list.appendChild(li)
    }
    function copyToClipboard(str) {
        var el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };
})(XMLHttpRequest.prototype.open);