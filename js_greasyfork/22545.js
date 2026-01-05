// ==UserScript==
// @name        Anti BD Redirect
// @namespace   fengwn1997@163.com
// @author      fengwn1997@163.com
// @description 反重定向
// @include     https://www.baidu.com/s*
// @include     https://www.baidu.com/baidu*
// @version     0.1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/22545/Anti%20BD%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/22545/Anti%20BD%20Redirect.meta.js
// ==/UserScript==

function checkUrl(url){
  var headUrls = ['http://www.baidu.com/link?url=',]
  for(var i=0;i<headUrls.length;i++){
    if(url.startsWith(headUrls[i])){
      return true
    }
  }
}

function setTrueUrl(element) {
  var url = element.getAttribute('href')
  GM_xmlhttpRequest({
    url: url,
    method: 'HEAD',
    onload: function (response) {
      console.log(response)
      element.setAttribute('href', response.finalUrl)
    }
  })
}
function main(al) {
  for (var i = 0; i < al.length; i++) {
    var href = al[i].getAttribute('href')
    if (href && checkUrl(href)) {
      (function (a) {
        setTrueUrl(a)
      }) (al[i])
    }
  }
}
function listener(e) {
  var al = document.querySelectorAll('#container a')
  main(al)
}
listener()
var target = document.querySelector('#container');
 
// 创建观察者对象
var observer = new MutationObserver(function(mutations) {
  listener()
  //mutations.forEach(function(mutation) {});    
});
 
// 配置观察选项:
var config = {'childList': true, 'subtree': true}
 
// 传入目标节点和观察选项
observer.observe( document.querySelector('#wrapper_wrapper'), config);