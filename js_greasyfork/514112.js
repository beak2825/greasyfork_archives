// ==UserScript==
// @name         西部世界自动注册获取节点
// @namespace    http://jiangzhipeng.cn/
// @version      0.1.5
// @description  西部世界自动注册获取节点提交
// @author       Jiang
// @match        *://ww9510.com/*
// @icon         https://foruda.gitee.com/avatar/1676959947996164615/1275123_jzp979654682_1578947912.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514112/%E8%A5%BF%E9%83%A8%E4%B8%96%E7%95%8C%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C%E8%8E%B7%E5%8F%96%E8%8A%82%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/514112/%E8%A5%BF%E9%83%A8%E4%B8%96%E7%95%8C%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C%E8%8E%B7%E5%8F%96%E8%8A%82%E7%82%B9.meta.js
// ==/UserScript==

(async function () {
  const randomStr = (len = 16, radix = 16) => {
    let res = '';
    res = Math.random().toString(radix).slice(2, len + 2);
    res.length !== len && (res += randomStr(len - res.length));
    return res;
  }

  async function resetCookie() {
    const sessionId = randomStr(26, 32);
    const vcid = randomStr(10, 16);
    let allCookie = await cookieStore.getAll();
    for (let i = 0; i < allCookie.length; i++) {
      try {
        await cookieStore.delete(allCookie[i].name);
      } catch (error) { }
    }
    try {
      let expires = new Date(Date.now() + 90 * 24 * 60 * 60000);
      let width = Math.floor(Math.random() * 800 + 800);
      await cookieStore.set({ name: 'd__vcid', value: vcid, path: '/', expires });
      await cookieStore.set({ name: 'd__window_width', value: width, path: '/', expires });
      await cookieStore.set({ name: 'SESSIONID', value: sessionId, path: '/' });
    } catch (error) { }
  }

  async function getG() {
    try {
      let res = await fetch(location.href).then(res => res.text());
      let init_text = res.match(/window.init_text.*?=.*?['"](.+?)['"]/)[1];
      var ta = init_text.split('!');
      z_js(ta.pop(), 'base64');
      Function(DD(ta.shift()))();
    } catch (error) { }
  }

  async function getNodeData() {
    try {
      let nodeHtml = await fetch('/portal/order/node').then(res => res.text());
      let nodeHtmlNoWrap = nodeHtml.replaceAll(/\n/gm, '');
      let nodeConfigText = nodeHtmlNoWrap.match(/window.page_config.*?=.*?({.*?)<\/script>/m)[1];
      let nodeMatchList = [...nodeConfigText.matchAll(/"name":"(.*?)",.*?"net_type":"(.*?)",.*?"server_ip":"(.*?)",.*?"server_port_raw":(.*?),.*?"password_raw":"(.*?)",/g)];
      let password = null;
      let ipList = [];
      let portList = [];
      nodeMatchList = nodeMatchList.map(item => {
        let name = item[1] || '';
        let type = item[2];
        let ip = item[3];
        let port = item[4] || '';
        let pd = item[5] || '';
        port = /^\d+$/.test(port) ? port : '';
        ip && ipList.push(ip);
        port && portList.push(port);
        /^\w+$/.test(pd) && (password = pd);
        return {
          name: name.replace(/.*?协议：(.*?)<span.*?>(.*?)<\/span>/, '$1$2'),
          type: type.toLocaleLowerCase(),
          ip,
          port,
        }
      });
      portList = [...new Set(portList)];
      let res = [];
      ipList = [...new Set(ipList)];
      portList = [...new Set(portList)];
      ipList.forEach(ip => {
        portList.forEach(port => {
          res.push({
            ip,
            port,
          })
        });
      });
      res = res.map((item, index) => `trojan://${password}@${item.ip}:${item.port}?allowInsecure=1&peer=download.windowsupdate.com#${encodeURI('jiang ' + (index + 1))}`);
      let nodeText = btoa(res.join('\n'));
      return nodeText;
    } catch (error) {
      console.error(error);
    }
  }

  async function getVerifyImageCode() {
    try {
      const imageFile = await fetch(`/portal/account/get-verify-image?t=${Date.now()}`).then(res => res.blob());
      const base64 = await new Promise((resolve) => {
        const fr = new FileReader();
        fr.onloadend = (e) => {
          e && e.target && e.target.result && resolve(e.target.result);
        }
        fr.readAsDataURL(imageFile);
      });
      const codeObj = await fetch('https://api.jiangzhipeng.cn/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({image: base64})
      }).then(res => res.json());
      if (codeObj.code === 200) {
        const verifyCode = codeObj.data;
        $('.js-switch-verify-image').attr('src', base64);
        $('input[name=verify_code]').val(verifyCode);
        return verifyCode;
      } else {
        return await getVerifyImageCode();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function start() {
    if (location.pathname === '/portal/account/login') {
      await resetCookie();
      await getG();
      // $('.js-switch-verify-image').click();
      await getVerifyImageCode();
      const mail = randomStr(Math.floor(Math.random() * 5 + 8), 32) + '@gmail.com';
      $('input[name="email"]').val(mail);
      $('input[name="password"]').val('c979654682');
      common_request_copy = common_request;
      common_request = function (url, method, data, callback_success) {
        callback_success_copy = callback_success;
        callback_success = async (d) => {
          if (d.code === 0) {
            if (url.endsWith('/user/account/check-is-registed')) {
              callback_success_copy(d);
              if (d.data.is_registed) {
                $('.js_submit_login').click();
              } else {
                $('.js_submit_regist').click();
              }
            } else if (url.endsWith('/user/account/login') || url.endsWith('/user/account/regist')) {
              let userInfo = d.data;
              if (userInfo.vip_time > 0 && userInfo.flow_cycle_used < userInfo.flow_cycle_total) {
                let nodeText = await getNodeData();
                await fetch('https://api.jiangzhipeng.cn/writeNodeToFile', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    node: nodeText,
                    key: '5vuf6q83tuo4d657d8b92c34fb'
                  })
                });
              }
              callback_success_copy(d);
            }
          } else if (d.code === 30011) {
            // 验证码错误
            callback_success_copy(d);
            await getVerifyImageCode();
          }
        }
        common_request_copy(url, method, data, callback_success);
      }
    }
  }
  start();
}());