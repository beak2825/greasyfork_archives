// ==UserScript==
// @name         Patent Classify
// @namespace
// @version      1.8
// @description  获取专利数据并进行分类
// @author       lyr
// @match        https://workspace.zhihuiya.com/detail/patent/table?*
// @grant        GM_xmlhttpRequest
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/468545/Patent%20Classify.user.js
// @updateURL https://update.greasyfork.org/scripts/468545/Patent%20Classify.meta.js
// ==/UserScript==
var script = document.createElement('script')
script.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js'
document.head.appendChild(script)

function createHTML(data) {
  // button接口
  GM_xmlhttpRequest({
    method: 'POST',
    url: 'http://10.111.32.4:8055/patentclassification/patent/button',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    onload: function (response) {
      let responseText = response.responseText
      responseText = JSON.parse(responseText)
      if (responseText.status == 200) {
        if (responseText.data.display) {
          setTimeout(function () {
            let example = document.createElement('div')
            example.classList.add('tamperBtn')
            example.innerHTML = `<div style="
                        overflow: hidden;
                        z-index: 9999;
                        position: fixed;
                        right: 20px;
                        top: 108px;
                        cursor:pointer;
                        background-color: #409eff;
                        border-color: #409eff;
                        border: 1px solid #dcdfe6;
                        color: #fff;
                        -webkit-appearance: none;
                        text-align: center;
                        box-sizing: border-box;
                        outline: none;
                        margin: 0;
                        transition: .1s;
                        font-weight: 500;
                        -moz-user-select: none;
                        -webkit-user-select: none;
                        -ms-user-select: none;
                        padding: 8px 20px;
                        font-size: 14px;
                        border-radius: 4px;">分类</div>`
            if (data.locationHref.includes('detail/patent/table?spaceId')) {
              $('body').append(example)
            } else {
              $('.tamperBtn').remove();
            }
            example.addEventListener('click', function (event) {
              // 创建loading元素
              let loadingElement = document.createElement('div')
              loadingElement.classList.add('loading')

              // 设置loading样式
              loadingElement.style.width = '100px'
              loadingElement.style.height = '100px'
              loadingElement.style.border = '5px solid #f3f3f3'
              loadingElement.style.borderTop = '5px solid #3498db'
              loadingElement.style.borderRadius = '50%'
              loadingElement.style.animation = 'spin 1s infinite linear'
              loadingElement.style.position = 'absolute'
              loadingElement.style.top = '50%'
              loadingElement.style.left = '50%'
              loadingElement.style.zIndex = '9999'

              // 创建style标签并添加动画规则
              let styleTag = document.createElement('style')
              styleTag.innerHTML = `
                            @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                            }`

              // 将style标签插入到head标签中
              document.head.appendChild(styleTag)

              // 将loading元素插入到body中
              document.body.appendChild(loadingElement)
              let loadingText = document.createElement('div')
              loadingText.classList.add('loadingText')
              loadingText.style.color = 'red'
              loadingText.innerHTML = `<div style="
                            color: red;
                            position:absolute;
                            top:60%;
                            left:60%
                            z-index:9999;
                            >加载中...</div>`
              document.body.appendChild(loadingText)
              // 创建遮罩层元素
              var overlayElement = document.createElement('div')
              overlayElement.classList.add('overlay')

              // 设置遮罩层样式
              overlayElement.style.position = 'fixed'
              overlayElement.style.top = '0'
              overlayElement.style.left = '0'
              overlayElement.style.width = '100%'
              overlayElement.style.height = '100%'
              overlayElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
              overlayElement.style.zIndex = '9998'

              // 将遮罩层插入到body中
              document.body.appendChild(overlayElement)
              const clickedElement = event.target
              let token = localStorage.getItem('patsnap-authorizations')
              const token_type = 'Bearer'
              let accessToken = JSON.parse(token).token
              let params = {
                locationHref: window.document.location.href,
                authorization: token_type + ' ' + accessToken
              }

              GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://10.111.32.4:8055/patentclassification/patent/classify',
                data: JSON.stringify(params),
                headers: {
                  'Content-Type': 'application/json'
                },
                onload: function (res) {
                  let loading = document.getElementsByClassName('loading')
                  let overlay = document.getElementsByClassName('overlay')
                  document.body.removeChild(loading[0])
                  document.body.removeChild(overlay[0])
                  let go_page = document.getElementById('go_page')
                  $('#go_page').click()
                  if (res.status == 200) {
                    // let next  = document.getElementsByClassName("pt-ui-btn")
                    // console.log("aaa",a);  // 28 前一页  29后一页
                    // previous [28].setAttribute("id","previous ");
                    // previous [29].setAttribute("id","next ");
                    // $("#previous ").click();
                    // $("#next ").click();
                  }
                }
              })
            })
          }, 4000)
        }
      } else {
        $('.tamperBtn').remove();
      }
    }
  })
};

(function () {
  'use strict'
  /* globals jQuery, $, waitForKeyElements */
  console.log('运行')
  let oldPushState = history.pushState;
  let oldReplaceState = history.replaceState;

  // 重写pushState和replaceState方法，以便在它们被调用时也能触发自定义处理逻辑
  history.pushState = function (state, title, url) {
    console.log('路由被pushState改变');
    handleRouteChange();
    return oldPushState.apply(history, arguments);
  };

  history.replaceState = function (state, title, url) {
    console.log('路由被replaceState改变');
    handleRouteChange();
    return oldReplaceState.apply(history, arguments);
  };

  function handleRouteChange() {
    // 监听popstate事件，当路由因浏览器前进/后退按钮或直接更改地址栏而改变时触发
    window.addEventListener('popstate', function (event) {
      console.log('路由因popstate事件改变');
      getCurrentUrl();
    });
  }

  function getCurrentUrl() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('detail/patent/table?spaceId')) {
      let data = {
        locationHref: currentUrl
      }
      createHTML(data)
    } else {
      $('.tamperBtn').remove();
    }
  }
  // 在脚本加载时立即获取一次当前URL
  getCurrentUrl();
})()