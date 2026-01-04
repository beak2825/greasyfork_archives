// ==UserScript==
// @name         方块网页 CDKey 激活
// @namespace    local.CR
// @version      0.0.2
// @description  方块游戏激活码网页激活
// @author       CharRun breastsexy(Cloud)
// @connect      cubejoy.com
// @match        *://account.cubejoy.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387930/%E6%96%B9%E5%9D%97%E7%BD%91%E9%A1%B5%20CDKey%20%E6%BF%80%E6%B4%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/387930/%E6%96%B9%E5%9D%97%E7%BD%91%E9%A1%B5%20CDKey%20%E6%BF%80%E6%B4%BB.meta.js
// ==/UserScript==

(function () {
  "use strict"

  const keyRegex = /[A-Za-z0-9]{4}(-[A-Za-z0-9]{5}){4}/g;
  const unique = a => [...new Set(a)];
  const token = getToken();

  const userBannerElem = document.getElementsByClassName('UsermaneageRight').item(0)

  const wrapperElem = document.createElement('div')
  wrapperElem.setAttribute('id', 'cube-script-wrapper')

  const inputElem = document.createElement('textarea')
  inputElem.setAttribute('id', 'cube-script-textarea')
  inputElem.placeholder = '请输入游戏 CDKey，可自动提取大量文本中的多个 CDKey'

  const buttonElem = document.createElement('button')
  buttonElem.setAttribute('id', 'cube-script-button')
  buttonElem.textContent = '激活'
  buttonElem.onclick = handleActivation.bind(this);

  const resultElem = document.createElement('div')
  resultElem.setAttribute('id', 'cube-script-result')
  const resultTitle = document.createElement('h4')
  resultTitle.textContent = '激活结果：'
  resultElem.appendChild(resultTitle)
  const resultHint = document.createElement('i')
  resultHint.textContent = '“请求成功” 不一定 “成功激活游戏”（如已拥有、无效 CDKey 等情况也属于请求成功），请留意 Key 后面的文字。'
  resultElem.appendChild(resultHint)
  resultElem.appendChild(document.createElement('br'))

  wrapperElem.appendChild(inputElem)
  wrapperElem.appendChild(document.createElement('br'))
  wrapperElem.appendChild(buttonElem)
  wrapperElem.appendChild(document.createElement('br'))
  wrapperElem.appendChild(resultElem)
  wrapperElem.appendChild(document.createElement('br'))
  userBannerElem.appendChild(wrapperElem)

  let style = `
    #cube-script-textarea {
      border: none;
      width: 600px;
      height: 180px;
      margin-top: 15px;
      margin-right: 15px;
      padding: 10px 10px;
      font-size: 14px;
      color: #FFFFFF;
      background: #09101f;
    }
    #cube-script-button {
      border: none;
      width: 80px;
      height: auto;
      margin-top: 10px;
      padding: 8px 8px;
      font-size: 14px;
      color: #FFFFFF;
      background: #09101f;
      cursor: pointer;
    }
    #cube-script-result {
      margin-top: 10px;
      color: #FFFFFF;
    }
    `

  GM_addStyle(style)

  function getToken() {
    var arr, reg = new RegExp("(^| )AllCookie=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) {
      return arr[2].split("|")[1];
    }
    else {
      return null;
    }
  }

  function createOpt(u, code, resolve, reject) {
    var data = "data=" + JSON.stringify({ u: u, Code: code });
    var opt = {
      url: "https://invoke.cubejoy.com/boxinvoke.ashx",
      method: "post",
      data: data,
      headers: {
        Host: "invoke.cubejoy.com",
        "User-Agent": "libcurl-agent/1.0",
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*"
      },
      onload: resolve,
      onerror: reject,
      anonymous: true
    };
    return opt;
  }

  function activate(code) {
    return new Promise(function (resolve, reject) {
      if (token) {
        var opt = createOpt(token, code, resolve, reject);
        GM_xmlhttpRequest(opt);
      }
      else {
        reject();
      }
    });
  }

  function handleActivation() {
    let text = inputElem.value
    const keys = unique(text.match(keyRegex));
    console.log('提取出的所有 CDKey：', keys)

    if (keys.length > 0) {
      for (let key of keys) {
        activate(key).then((res) => {
          var r = res;
          r = JSON.parse(r.response);
          r = JSON.stringify(r.result);
          let resElem = document.createElement('label')
          resElem.textContent = `请求成功（${key}）：${r}`
          resultElem.appendChild(resElem)
          resultElem.appendChild(document.createElement('br'))
        }, () => {
          let resElem = document.createElement('label')
          resElem.textContent = `请求失败（${key}）！`
          resultElem.appendChild(resElem)
          resultElem.appendChild(document.createElement('br'))
        })
      }
    }
  }
})();