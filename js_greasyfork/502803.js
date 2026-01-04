// ==UserScript==
// @name 喜加一
// @version v2024-08-09
// @description xiawanshe.com一键领取喜加一游戏
// @author xiawanshetudou
// @match https://*.xiawanshe.com/*
// @match https://xiawanshe.com/*
// @match https://*.epicgames.com/*
// @match https://*.steampowered.com/*
// @license MIT
// @grant none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/502803/%E5%96%9C%E5%8A%A0%E4%B8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/502803/%E5%96%9C%E5%8A%A0%E4%B8%80.meta.js
// ==/UserScript==

function postMessage(message) {
  let domain_list = ['https://www.xiawanshe.com', 'https://xiawanshe.com']
  for(let domain of domain_list) {
    console.log('向', domain, '发送消息', message)
    window.opener.postMessage(message, domain);
  }
}


function setLocalData(c_name, value) {
  let expdate = new Date(new Date().getTime() + (3 * 60 * 1000));
  let c_value = escape(value) + "; expires=" + expdate.toUTCString();
  document.cookie = c_name + "=" + c_value;
  window.localStorage.setItem(c_name, value.toString());
}

function getLocalData(c_name) {
  let i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x === c_name) {
      return unescape(y);
    }
  }
  return window.localStorage.getItem(c_name)
}

const xijiayiCookieKey = '_xws_xjy'


function createCenteredModal(htmlContent) {
  // 创建模态背景
  let modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.zIndex = "1000";
  modal.style.left = "0";
  modal.style.top = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.4)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  // 创建模态内容容器
  let modalContent = document.createElement("div");
  modalContent.style.background = "#fefefe";
  modalContent.style.padding = "20px";
  modalContent.style.border = "1px solid #888";
  modalContent.style.borderRadius = "5px";
  modalContent.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  modalContent.style.minWidth = "300px"; // 最小宽度

  // 创建显示HTML内容的容器
  let contentHolder = document.createElement("div");
  contentHolder.innerHTML = htmlContent;
  modalContent.appendChild(contentHolder);

  // 创建确认按钮
  let confirmBtn = document.createElement("button");
  confirmBtn.textContent = "确认";
  confirmBtn.style.background = "#007BFF";
  confirmBtn.style.color = "white";
  confirmBtn.style.border = "none";
  confirmBtn.style.padding = "8px 16px";
  confirmBtn.style.fontSize = "16px";
  confirmBtn.style.borderRadius = "5px";
  confirmBtn.style.cursor = "pointer";
  confirmBtn.style.marginTop = "10px";
  confirmBtn.style.alignSelf = "center";

  confirmBtn.onclick = function () {
    document.body.removeChild(modal);
  };

  // 组装模态窗口
  modalContent.appendChild(confirmBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// xijiayi_receive 喜加一林领取
function xijiayi_receive() {
  let u = new URL(window.location.href);
  if (!window.opener) {
    return
  }
  window.addEventListener('message', (event) => {
    let data = event.data;
    if (data && event.origin.includes('xiawanshe.com')) {
      console.log('接收到父窗口的消息：', event.origin, event.data);
      if (data.new_url) {
        window.location.href = data.new_url
      } else if (data.close) {
        window.close();
      }
    }
  }, false);
  let idx = parseInt(u.searchParams.get('index'));
  if (isNaN(idx)) {
    console.log('获取出来的idx为空', idx)
    idx = -1;
  }
  let parseIdx = function () {
    let v = getLocalData(xijiayiCookieKey);
    if (v === '' || v === null) {
      return -1;
    }
    return parseInt(v);
  }
  if (u.hostname.includes('steampowered')) {
    if (u.searchParams.get('xijiayi')) {
      setLocalData(xijiayiCookieKey, idx);
      postMessage({
        'url': window.location.href,
        'msg': '喜加一页面',
        'idx': parseIdx()
      });
      if (document.getElementById('account_pulldown')) {
        // 点击领取逻辑
        // postMessage({'url': window.location.href, 'msg': '包含account_pulldown', 'x': Array.from(document.getElementsByClassName('game_purchase_action')).toString()});
        let found = false;
        Array.from(document.getElementsByClassName('game_purchase_action')).forEach(item => {
          // console.log(item.textContent);
          if (item.textContent.includes('-100%')) {
            console.log('找到折扣100%');
            let btn = item.getElementsByClassName('btn_green_steamui btn_medium');
            if (btn) {
              btn[0].click();
              found = true;
            } else {
              postMessage({
                'url': window.location.href,
                'msg': '喜加一页面',
                'data': '已领取，无需重复领取',
                'idx': parseIdx()
              });
            }
          }
        });
        if (!found) {
          postMessage({
            'url': window.location.href,
            'msg': '喜加一页面',
            'data': '已领取，无需重复领取',
            'idx': parseIdx()
          });
        }
      } else {
        postMessage({
          'url': window.location.href,
          'msg': '喜加一页面',
          'data': '领取失败，用户未登录，请先前往<a href="https://store.steampowered.com/" target="_blank">store.steampowered.com</a>登录',
          'idx': parseIdx()
        });
      }
    } else {
      postMessage({
        'url': window.location.href,
        'data': '领取完成',
        'idx': parseIdx()
      });
    }
  } else if (u.hostname.includes('epicgames')) {
    if (u.searchParams.get('xijiayi')) {
      setLocalData(xijiayiCookieKey, idx);
      postMessage({
        'url': window.location.href,
        'msg': '喜加一页面',
        'idx': parseIdx()
      });
      let epicWaitPage = 0;
      const epicInterval = setInterval(function () {
        console.log('epic定时器执行')
        let ele = document.getElementById('dieselReactWrapper');
        if (ele && ele.textContent.toLowerCase().includes('missing account id')) {
          console.log('发现账号未登录, 清理定时器')
          clearInterval(epicInterval);
          postMessage({
            'url': window.location.href,
            'data': '领取失败，用户未登录，请先前往<a href="https://store.epicgames.com/" target="_blank">store.epicgames.com</a>登录',
            'idx': parseIdx()
          });
          return
        }
        let block_ele = document.getElementsByClassName('payment-blocked__container');
        if (Array.from(block_ele).length > 0 ) {
          let msg = document.getElementsByClassName('payment-blocked__container')[0].getElementsByTagName('h2')[0];
          if(!msg) {
            msg = '领取失败'
          } else {
            msg = '领取失败, ' + msg.textContent
          }
          console.log('发现账号无法领取, 清理定时器', msg)
          clearInterval(epicInterval);
          postMessage({
            'url': window.location.href,
            'data': msg,
            'idx': parseIdx()
          });
          return
        }
        const btns = document.getElementsByClassName('payment-order-confirm__btn');
        epicWaitPage += 1;
        console.log('获取下订单按钮', btns);
        postMessage({
          'url': window.location.href,
          'idx': parseIdx(),
          'msg': '发现按钮' + btns.toString()
        });
        if (Array.from(btns).length > 0) {
          console.log('准备点击喜加一按钮');
          postMessage({
            'url': window.location.href,
            'idx': parseIdx(),
            'msg': '准备点击喜加一按钮'
          });
          let hasSubmit = false;
          // window.addEventListener('beforeunload', function (event) {
          //   console.log('页面准备跳转');
          //   if (!hasSubmit) {
          //     postMessage({
          //       'url': window.location.href,
          //       'data': '领取完成',
          //       'idx': parseIdx(),
          //       'msg': 'page_jump'
          //     });
          //     hasSubmit = true;
          //   }
          // });
          clearInterval(epicInterval);
          btns[0].click();
          postMessage({
            'url': window.location.href,
            'idx': parseIdx(),
            'msg': '完成点击'
          });
          let epicWaitResult = 0;
          const epicWaitResultInterval = setInterval(function () {
            if (btns[0] === null || btns[0] === undefined) {
              clearInterval(epicWaitResultInterval);
              postMessage({
                'url': window.location.href,
                'data': '领取完成',
                'idx': parseIdx()
              });
              return
            }
            btns[0].click();
            epicWaitResult += 1;
            let captcha = document.getElementById('h_captcha_challenge_checkout_free_prod');
            if (captcha) {
              let iframes = captcha.getElementsByTagName('iframe');
              let found = true;

              for (let i = 0; i < iframes.length; i++) {
                if (iframes[i].getAttribute('aria-hidden') === 'true' || iframes[i].style.visibility === 'hidden'){
                  found = false;
                  break;
                }
              }
              if (found) {
                // console.log('网页中存在验证码');
                postMessage({
                  'url': window.location.href,
                  'idx': parseIdx(),
                  'msg': '网页中存在验证码'
                });
                if (epicWaitResult > 60) {
                  clearInterval(epicWaitResultInterval);
                  postMessage({
                    'url': window.location.href,
                    'data': '存在验证码，可能未领取成功',
                    'idx': parseIdx()
                  });
                }
              }
            }
            if (epicWaitResult > 20) {
              clearInterval(epicWaitResultInterval);
              postMessage({
                'url': window.location.href,
                'data': '领取完成，但不确定订单状态，请到epic查看',
                'idx': parseIdx()
              });
              return
            }
            const resultText = document.getElementsByClassName('payment-alert__content');
            console.log('获取到的订单结果数据为', resultText)
            if (Array.from(resultText).length > 0 && resultText[0] && resultText[0].textContent) {
              console.log('订单有结果', resultText[0].textContent);
              hasSubmit = true;
              clearInterval(epicWaitResultInterval);
              postMessage({
                'url': window.location.href,
                'data': '领取结果: ' + resultText[0].textContent,
                'idx': parseIdx()
              });
            }
          }, 1000)
        }
      }, 1000);
    }
  } else {
    postMessage({
      'url': window.location.href,
      'data': '未知页面，领取错误',
      'idx': parseIdx()
    });
  }
}

// check_xijiayi_btn 检查页面是否包含喜加一页面并包含喜加一按钮，没有的话创建按钮
function check_xijiayi_btn() {
  const xijiayiElement = document.getElementById('xijiayi');
  if(!xijiayiElement) {
    return
  }

  // 创建按钮
  if (document.getElementById('xijiayi_btn')) {
    return;
  }
  const createBtn = function (id, text) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.style.background = "#007BFF";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "8px 16px";
    button.style.fontSize = "13px";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.marginTop = "10px";
    button.style.alignSelf = "center";
    return button
  }
  const button = createBtn('xijiayi_btn', '一键喜加一入库');
  xijiayiElement.appendChild(button);

  let urls = [];
  let names = [];
  let doing = false;
  let index = 0;
  let results = {};
  let name_urls = {};
  let childWindow = null;

  window.addEventListener('message', (event) => {
    if (event.origin.includes("steampowered.com") || event.origin.includes('epicgames.com')) {
      console.log('收到子窗口的消息：', event.data);
      if (event.data && event.data.data) {
        let new_idx = event.data.idx;
        if(isNaN(new_idx) || new_idx < 0) {
            console.log('未知下标，复用旧下标', new_idx)
            new_idx = index
        }
        if (new_idx >= 0) {
          index = new_idx;
        }
        results[names[new_idx]] = event.data.data;
        index = index + 1;
        console.log('处理下一个index', new_idx, index)
        processUrl();
      }
    }
  }, false);

  function processUrl() {
    if (index >= urls.length) { // 如果处理完所有URL，结束递归
      if (!childWindow) {
        alert("出现异常，请关闭页面并重试");
        return
      }
      doing = false;
      childWindow.postMessage({'close': 1}, 'https://' + new URL(urls[urls.length - 1]).hostname);
      console.log('所有窗口已处理完毕');
      setTimeout(function () {
        let display = '';
        Object.keys(results).forEach(key => {
          let value = results[key];
          display += `<span><a href="${name_urls[key]}" target="_blank">${key}</a> ${value}</span><br/>`;
        })
        createCenteredModal(display);
      }, 1000);
      return;
    }
    const u = new URL(urls[index]);
    u.searchParams.set('xijiayi', '1');
    u.searchParams.set('index', index.toString());
    const url = u.toString();
    if (childWindow) {
      console.log('开始处理url，复用旧窗口', url, names[index], index);
      setTimeout(function () {
        if (childWindow) {
          childWindow.postMessage({'new_url': url}, 'https://' + new URL(urls[index - 1]).hostname);
        }
      }, 1000);
      return
    }
    console.log('开始处理url，创建窗口', url, names[index]);

    // 创建窗口
    const width = 1000;
    const height = 800;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    const features = `width=${width},height=${height},left=${left},top=${top}`;
    childWindow = window.open(url, 'SmallWindow', features);
    // const newWindow = window.open(url);
    console.log('windows', childWindow);
    if (!childWindow) {
      alert('请设置浏览器上方允许弹出式窗口，或者关闭浏览器禁止弹出式窗口插件，并重新刷新页面');
      return
    }
    childWindow.postMessage({'msg': '打开了窗口'}, 'https://' + u.hostname);
    // 检查新窗口是否关闭
    const checkClosedInterval = setInterval(function () {
      if (childWindow.closed) {
        clearInterval(checkClosedInterval);
        console.log(`窗口已关闭`);
        if (doing) {
          alert('处理中断，窗口被强制关闭，请重试')
        }
        doing = false;
        index = 0;
        childWindow = null;
      }
    }, 1000);
  }

  button.addEventListener('click', function () {
    if (doing) {
      return
    }
    let currentFree = document.getElementById('current_free');
    if (!currentFree) {
      alert("获取不到喜加一")
      return;
    }
    let links = {};
    Array.from(currentFree.getElementsByClassName('link')).forEach(item => {
      if (item.href) {
        links[item.textContent] = item.href;
      }
    });
    if (Object.keys(links).length === 0) {
      alert("获取不到喜加一")
      return;
    }
    Object.keys(links).forEach(key => {
      urls[index] = links[key];
      names[index] = key;
      name_urls[key] = links[key];
      index = index + 1;
    })
    names.forEach(name => {
      results[name] = '未领取';
    })
    index = 0;
    console.log('处理数据', urls, names);

    childWindow = null;
    index = 0;
    doing = true;
    processUrl();
  });
}

(function () {
  'use strict';

  xijiayi_receive();
  check_xijiayi_btn();
  setInterval(function () {
    check_xijiayi_btn();
  }, 1000);
})();