// ==UserScript==
// @name         swaggerSkipToCustomMethods
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  让swagger支持跳转到指定方法位置并打开
// @author       aXia
// @match        http://*/swagger/index.html*
// @match        http://*/index.html
// @icon         data:image/jpeg;base64,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
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/450328/swaggerSkipToCustomMethods.user.js
// @updateURL https://update.greasyfork.org/scripts/450328/swaggerSkipToCustomMethods.meta.js
// ==/UserScript==

// 拦截响应
var originalSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function() {
    // 全部请求相关信息
    var self = this;

    // 监听readystatechange事件
    this.onreadystatechange = function() {
        // 当readyState变为4时获取响应
        if (self.readyState === 4) {
          if(self.responseURL.includes('-API.json')){
            window.jsonData = JSON.parse(self.response)
          }
        }
    };

    // 调用原始的send方法
    originalSend.apply(this, arguments);
};


// 获取路由参数值
const getQuery = (query) => {
    return new URLSearchParams(window.location.hash).get(query)
}

function copyText(text){
  if (navigator.clipboard) {
      // clipboard api 复制
      navigator.clipboard.writeText(text);
  } else {
      var textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      // 隐藏此输入框
      textarea.style.position = 'fixed';
      textarea.style.clip = 'rect(0 0 0 0)';
      textarea.style.top = '10px';
      // 赋值
      textarea.value = text;
      // 选中
      textarea.select();
      // 复制
      document.execCommand('copy', true);
      // 移除输入框
      document.body.removeChild(textarea);
  }
}


// 等待指定dom加载完成并返回
function waitDom(domName){
  return new Promise((resolve, reject) => {
      let total = 0;
      let timer = setInterval(() => {
          const versionSelectDom = document.querySelector(domName);
          total +=1;
          if(versionSelectDom){
              total=0
              clearInterval(timer)
              resolve(versionSelectDom)
          }
          if(total > 200){
              reject(new Error('dom 获取失败'))
          }
      }, 100)
  })
}

/** 添加复制方法名按钮 */
function extendBtn(methodName){
  const btnRowDom = document.querySelector(".document").children[0].children[0]
  btnRowDom.children[0].setAttribute('class','ant-col ant-col-16')
  
  const copyBtn = btnRowDom.lastChild.cloneNode()
  copyBtn.innerText = '复制方法名'
  copyBtn.setAttribute('id','copyMethodName')
  btnRowDom.appendChild(copyBtn)
  document.querySelector("#copyMethodName").addEventListener("click", function(e){
    copyText(methodName+'()')
    alert('复制成功')
  });
}

(function async () {
  const hash = window.location.hash;
  if(!hash) return;
  hash.includes('?x=1') ? extendNewDocMethod(hash) : extendMethod(hash);

  // 新版本定位方法
  async function extendNewDocMethod(){
    console.log('进入新版本')
    const versionSelectDom = await waitDom(".ant-spin-container .ant-select-selection-selected-value")
    const version = getQuery('version');
    // 没有版本号，代表能直接打开方法详情路由
    if(!version){
      const methodName = getQuery("methodName");
      setTimeout(()=> {
        extendBtn(methodName)
      }, 300)
      return;
    }
    if(versionSelectDom.innerText === version){
      const url = getQuery('url');
      const tag = getQuery('tag');
      const requestType = getQuery('requestType');
      const methodName = getQuery("methodName")
      const layoutContentDom = await waitDom(".ant-layout-content")
      let urlLabelDom = null;
      layoutContentDom.querySelectorAll("h3").forEach(item => {
        if(item.innerText === '分组Url') {urlLabelDom = item}
      });
      if(!urlLabelDom){
        console.error("没有获取到jsonDom元素地址");
        return;
      }
      const rowDom = urlLabelDom.closest(".ant-row")
      const jsonUrl = rowDom.querySelector(".ant-col-19").innerText
      if(!jsonUrl){
        console.error("没有获取到url地址");
        return;
      }
        // 请求描述
      const requestConfig = Reflect.get(window.jsonData.paths[url],requestType.toLowerCase())
      const summary = requestConfig.summary
      const pickTagIndex = window.jsonData.tags.findIndex(i => i.name === tag)
      const menuListDom = await waitDom(".sider .ant-menu")
      const menuItem = menuListDom.querySelectorAll("li.ant-menu-submenu-inline")[pickTagIndex+1]
      menuItem && menuItem.querySelector(".ant-menu-submenu-title").click()
      setTimeout(()=> {
        menuItem.querySelectorAll("span").forEach(item => {
          if(item.innerText === summary){
           item.closest("a").click()
           setTimeout(() => {
            extendBtn(methodName)
           },300)
          }
        })
      }, 300)
    } else {
      versionSelectDom.click()
    }
  }

  // 旧版本swagger定位方法
  async function extendMethod(hashName) {
    console.log(hashName)
    console.log('进入旧版本')
    const methodName = getQuery('methodName')
    const idName = hashName.split('&').at(0)
    await waitDom(".opblock-tag-section")
    let methodElement = document.querySelector(`${idName}`);
    if (!methodElement) {
      console.error('未找到页面元素', hashName);
    }
    let methodIsOpen = methodElement.className.indexOf('is-open') > -1;
    if (!methodIsOpen) {
      let methodHref = methodElement.querySelector('.opblock-summary');
      methodHref.click();
      methodHref && setTimeout(() =>{
        methodHref.scrollIntoView()
        const btnWrap = methodElement.querySelector(".try-out")
        const copyBtn = btnWrap.lastChild.cloneNode()
        copyBtn.innerText = '复制方法名'
        copyBtn.setAttribute('id','copyMethodName')
        copyBtn.style.marginLeft='10px';
        btnWrap.appendChild(copyBtn)
        document.querySelector("#copyMethodName").addEventListener("click", function(e){
          copyText(methodName+'()')
          alert('复制成功')
        });
      }, 200);
    } else {
      let methodHref = methodElement.querySelector('.opblock-summary');
      methodHref && methodHref.scrollIntoView();
      const btnWrap = methodElement.querySelector(".try-out")
      const copyBtn = btnWrap.lastChild.cloneNode()
      copyBtn.innerText = '复制方法名'
      copyBtn.setAttribute('id','copyMethodName')
      copyBtn.style.marginLeft='10px';
      btnWrap.appendChild(copyBtn)
      document.querySelector("#copyMethodName").addEventListener("click", function(e){
        copyText(methodName+'()')
        alert('复制成功')
      });
    }
  }

})();