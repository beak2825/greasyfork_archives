// ==UserScript==
// @name         百度云提取码自动填写
// @namespace    https://pan.baidu.com/
// @version      0.2
// @description  调用第三方api填写百度云提取码
// @author       TUT
// @match        https://pan.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396309/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%8F%90%E5%8F%96%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/396309/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%8F%90%E5%8F%96%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function () {
  /* 判断是否该执行 */
  const whiteList = ['yun.baidu.com/s/*', 'pan.baidu.com/share/*', 'pan.baidu.com/s/*', 'pan.baidu.com/wap/*'];
  const local = window.location.href;
  const key = encodeURIComponent('谷花泰:百度云提取码自动填写:执行判断');

  const isWhiteList = whiteList.some(regStr => {
    const reg = new RegExp(regStr);
    return reg.test(local);
  });

  if (!isWhiteList || window[key]) {
    return;
  };

  window[key] = true;

  /* 开始执行代码 */
  class autoPassword {
    constructor() {
      this.auto = false;
      this.init();
    };
    init() {
      const shareId = this.getShareId();
      this.tips('正在获取提取码...');
      this.getPassword(shareId).then(password => {
        this.tips(`获取提取码成功: ${password}`);
        this.insertPassword(password);
        this.auto && this.autoSubmit();
      }).catch(err => {
        this.tips('获取密码失败');
      })
    };
    getShareId() {
      return (location.href.match(/\/init\?(?:surl|shareid)=((?:\w|-)+)/) || location.href.match(/\/s\/1((?:\w|-)+)/))[1];
    };
    getPassword(sharId) {
      return new Promise((resolve, reject) => {
        this.ajax({
          url: `https://ypsuperkey.meek.com.cn/api/items/BDY-${sharId}?access_key=4fxNbkKKJX2pAm3b8AEu2zT5d2MbqGbD&client_version=2018.8`,
          proxy: `https://jsonp.afeld.me/?url=`,
          method: 'get',
          success(res) {
            res = JSON.parse(res);
            const password = res.access_code || '';
            if (password) {
              resolve(password);
            } else {
              reject('密码获取为空');
            }
          },
          error(err) {
            reject('密码获取失败');
          }
        })
      })
    };
    insertPassword(password) {
      if (!password) {
        return;
      };
      const passwordInput = document.querySelector('.extractInputWrap.extract input');
      passwordInput.value = password;

      /** 手动触发 input 事件 */
      passwordInput.dispatchEvent(new Event('input'));
    };
    autoSubmit() {
      const submitBtn = document.querySelector('.tipsBox + button');
      submitBtn.click();
    };
    tips(text) {
      console.log(text);
      const passwordInput = document.querySelector('.extractInputWrap.extract input');
      passwordInput.placeholder = text;
    };
    ajax({ url, method = 'get', header = {}, data = {}, success = () => { }, error = () => { }, proxy, encodeUrl = true }) {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      let urlForGet = url;
      method = method.toLowerCase();

      /* 数据 */
      Object.keys(data).forEach((key, index) => {
        const connectSymbol = index === 0 ? '?' : '&';
        urlForGet += `${connectSymbol + key}=${encodeURIComponent(data[key])}`;
        formData.append(key, data[key]);
      });

      /* 请求地址 */
      method === 'get' ? (url = urlForGet) : '';

      if (proxy && encodeUrl) {
        url = proxy + encodeURIComponent(url);
      } else if (proxy && !encodeUrl) {
        url = proxy + url;
      };

      xhr.open(method, url, true);

      /* 请求头 */
      Object.keys(header).forEach(key => {
        xhr.setRequestHeader(key, header[key]);
      });

      /* 监听回调 */
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            success && success(xhr.responseText);
          } else {
            error && error(xhr.responseText);
          };
        };
      };

      /* 发送 */
      method === 'get' ? xhr.send() : xhr.send(formData);
    };
  };
  function canRun({ condition, maxTime = 5000, interval = 100, pastTime = 0 }) {
    return new Promise((resolve, reject) => {
      let timerId = null;
      timerId = setInterval(() => {
        if (pastTime >= maxTime) {
          clearInterval(timerId);
          reject();
          return;
        };
        if (condition()) {
          clearInterval(timerId);
          resolve();
          return;
        };
        pastTime += interval;
      }, interval);
    });
  };
  canRun({
    condition() {
      const passwordInput = document.querySelector('.extractInputWrap.extract input');
      return (passwordInput && passwordInput.hasAttribute('placeholder'));
    }
  }).then(() => {
    try {
      new autoPassword();
    } catch (err) {
      console.log(err);
    };
  }).catch(() => console.log('百度云提取码自动填写：执行超时'));
})();