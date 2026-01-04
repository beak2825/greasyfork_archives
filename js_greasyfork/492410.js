// ==UserScript==
// @name        给爷新标签打开页面
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      Gwen
// @license     MIT
// @description 在类似Github、Google等网页中新建标签访问页面
// @downloadURL https://update.greasyfork.org/scripts/492410/%E7%BB%99%E7%88%B7%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/492410/%E7%BB%99%E7%88%B7%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
(function() {
  'use strict';
  var $msg = {success:console.log,error:console.log,info:console.log}
  let h0x00=setInterval(()=>{
    if(document&&document.head&&document.body) {
      clearInterval(h0x00)
      function useMessage(){function n(n){for(var o=10,e=0;e<f.length;e++){var t=f[e];if(n&&n===t)break;o+=t.clientHeight+20}return o}function o(o){for(var e=0;e<f.length;e++){if(f[e]===o){f.splice(e,1);break}}o.classList.add(a.hide),f.forEach(function(o){o.style.top=n(o)+"px"})}function e(e){function i(){p.removeEventListener("animationend",i),setTimeout(o,x||t.duration||3e3,p)}function s(){"0"===getComputedStyle(p).opacity&&(p.removeEventListener("transitionend",s),p.remove())}var d=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"info",x=arguments[2],p=r.createElement("div");p.className=a.box+" "+d,p.style.top=n()+"px",p.style.zIndex=c,p.innerHTML='\n    <span class="'+a.icon+'"></span>\n    <span class="'+a.text+'">'+e+"</span>\n    ",c++,f.push(p),r.body.appendChild(p),p.addEventListener("animationend",i),p.addEventListener("transitionend",s)}var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=document,i="__"+Math.random().toString(36).slice(2,7),a={box:"msg-box"+i,hide:"hide"+i,text:"msg-text"+i,icon:"msg-icon"+i},s=r.createElement("style");s.textContent=("\n  ."+a.box+", ."+a.icon+", ."+a.text+" {\n    padding: 0;\n    margin: 0;\n    box-sizing: border-box;\n  }\n  ."+a.box+" {\n    position: fixed;\n    top: 0;\n    left: 50%;\n    display: flex;\n    padding: 12px 16px;\n    border-radius: 2px;\n    background-color: #fff;\n    box-shadow: 0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12);\n    white-space: nowrap;\n    animation: "+a.box+"-move .4s;\n    transition: .4s all;\n    transform: translate3d(-50%, 0%, 0);\n    opacity: 1;\n    overflow: hidden;\n  }\n  ."+a.box+'::after {\n    content: "";\n    position: absolute;\n    left: 0;\n    top: 0;\n    height: 100%;\n    width: 4px;\n  }\n  @keyframes '+a.box+"-move {\n    0% {\n      opacity: 0;\n      transform: translate3d(-50%, -100%, 0);\n    }\n    100% {\n      opacity: 1;\n      transform: translate3d(-50%, 0%, 0);\n    }\n  }\n  ."+a.box+"."+a.hide+" {\n    opacity: 0;\n    /* transform: translate3d(-50%, -100%, 0); */\n    transform: translate3d(-50%, -100%, 0) scale(0);\n  }\n  ."+a.icon+" {\n    display: inline-block;\n    width: 18px;\n    height: 18px;\n    border-radius: 50%;\n    overflow: hidden;\n    margin-right: 6px;\n    position: relative;\n  }\n  ."+a.text+" {\n    font-size: 14px;\n    line-height: 18px;\n    color: #555;\n  }\n  ."+a.icon+"::after,\n  ."+a.icon+'::before {\n    position: absolute;\n    content: "";\n    background-color: #fff;\n  }\n  .'+a.box+".info ."+a.icon+", ."+a.box+".info::after {\n    background-color: #1890ff;\n  }\n  ."+a.box+".success ."+a.icon+", ."+a.box+".success::after {\n    background-color: #52c41a;\n  }\n  ."+a.box+".warning ."+a.icon+", ."+a.box+".warning::after {\n    background-color: #faad14;\n  }\n  ."+a.box+".error ."+a.icon+", ."+a.box+".error::after {\n    background-color: #ff4d4f;\n  }\n  ."+a.box+".info ."+a.icon+"::after,\n  ."+a.box+".warning ."+a.icon+"::after {\n    top: 15%;\n    left: 50%;\n    margin-left: -1px;\n    width: 2px;\n    height: 2px;\n    border-radius: 50%;\n  }\n  ."+a.box+".info ."+a.icon+"::before,\n  ."+a.box+".warning ."+a.icon+"::before {\n    top: calc(15% + 4px);\n    left: 50%;\n    margin-left: -1px;\n    width: 2px;\n    height: 40%;\n  }\n  ."+a.box+".error ."+a.icon+"::after, \n  ."+a.box+".error ."+a.icon+"::before {\n    top: 20%;\n    left: 50%;\n    width: 2px;\n    height: 60%;\n    margin-left: -1px;\n    border-radius: 1px;\n  }\n  ."+a.box+".error ."+a.icon+"::after {\n    transform: rotate(-45deg);\n  }\n  ."+a.box+".error ."+a.icon+"::before {\n    transform: rotate(45deg);\n  }\n  ."+a.box+".success ."+a.icon+"::after {\n    box-sizing: content-box;\n    background-color: transparent;\n    border: 2px solid #fff;\n    border-left: 0;\n    border-top: 0;\n    height: 50%;\n    left: 35%;\n    top: 13%;\n    transform: rotate(45deg);\n    width: 20%;\n    transform-origin: center;\n  }\n  ").replace(/(\n|\t|\s)*/gi,"$1").replace(/\n|\t|\s(\{|\}|\,|\:|\;)/gi,"$1").replace(/(\{|\}|\,|\:|\;)\s/gi,"$1"),r.head.appendChild(s);var c=t.zIndex||1e4,f=[];return{show:e,info:function(n){e(n,"info")},success:function(n){e(n,"success")},warning:function(n){e(n,"warning")},error:function(n){e(n,"error")}}}
      $msg=useMessage();
    }
  },100)
  const store = {
    recordHosts: GM_getValue('recordHosts', []),
    changed: false
  }
  GM_registerMenuCommand('加入or移除' + location.host, () => {
    const host = location.host;
    const index = store.recordHosts.indexOf(host);
    if (index != -1) { // 已存在，移除
      store.recordHosts.splice(index, 1);
      $msg.success(`已移除${host}，刷新页面生效`)
    } else { // 加入
      store.recordHosts.push(host);
      $msg.success('已加入' + host)
      if (!store.changed) {
        const as = document.querySelectorAll('a');
        for (let i = 0; i < as.length; i++) {
          as[i].setAttribute('target', '_blank');
        }
      }
    }
    GM_setValue('recordHosts', store.recordHosts);
  }, { title: '点击添加或移除该域名下网页a标签打开方式为新标签打开' });
  function setTargetToBlank(node) {
    if (node.tagName == 'A') {
      node.setAttribute('target', '_blank')
    } else {
      for (let i = 0; i < node.children.length; i++) {
        setTargetToBlank(node.children[i]);
      }
    }
  }
  console.log("HOSTNAME: " + location.host)
  if (store.recordHosts.indexOf(location.host) != -1 && !store.changed) {
    console.log("%cOBSERVER START", "color:red")
    store.changed = true;
    const observer = new MutationObserver(function(mutationsList) {
      for (var mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              setTargetToBlank(node);
            }
          });
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
})()