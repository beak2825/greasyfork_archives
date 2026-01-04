// ==UserScript==
// @name         Bilibili 啵啵动态卡片 - bilibili.com
// @namespace    https://github.com/milkiq/bilibili-bobo-card
// @supportURL   https://github.com/milkiq/bilibili-bobo-card/issues
// @match        https://*.bilibili.com/*
// @version      1.0
// @author       milkiq
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @description  把给三三点赞的人卡片换成三三的图案
// @downloadURL https://update.greasyfork.org/scripts/447337/Bilibili%20%E5%95%B5%E5%95%B5%E5%8A%A8%E6%80%81%E5%8D%A1%E7%89%87%20-%20bilibilicom.user.js
// @updateURL https://update.greasyfork.org/scripts/447337/Bilibili%20%E5%95%B5%E5%95%B5%E5%8A%A8%E6%80%81%E5%8D%A1%E7%89%87%20-%20bilibilicom.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 使用沙盒模式只能自己穿透注入xhook，否则xhook无法初始化
  if (!unsafeWindow.xhook) {
    const xhookScriptEl = document.createElement('script');
    xhookScriptEl.type = 'text/javascript';
    xhookScriptEl.src = 'https://unpkg.com/xhook@1.4.9/dist/xhook.min.js';

    // script 标签加载完成后添加钩子
    xhookScriptEl.onload = () => {
      addXHRHooks();
    }
    unsafeWindow.document.head.appendChild(xhookScriptEl);
  } else {
    // 如果其他插件注入了脚本就不用自己插入了
    addXHRHooks();
  }

  // 获取存储的点赞列表
  const allUids = GM_getValue('bobo_liker_uids') ?? [];

  function uidMatch(uid) {
    if (uid === 33605910) return true;
    return allUids.some(id => id === uid);
  }
  
  function getFansNumber(uid) {
    return uid === 33605910 ? 1 : (uid + '').slice(-6);
  }

  function injectDynamicItem(item) {
    const uid = item?.modules?.module_author?.mid;
    if (!uidMatch(uid)) return;

    const number = getFansNumber(uid);
    item.modules.module_author.decorate = {
        "card_url": "https://i0.hdslb.com/bfs/new_dyn/a3c6601ddcf82030e4e3bd3ebf148e411320060365.png",
        "fan": {
            "color": "#ff7373",
            "is_fan": true,
            "num_str": number,
            "number": +number
        },
        "id": 33521,
        "jump_url": "https://space.bilibili.com/33605910",
        "name": "三三与她的小桂物",
        "type": 3
    };
  }

  function addXHRHooks() {
    // 动态直接通过 Hook XHR 响应完成
    unsafeWindow.xhook.after(function(request, response) {
      if (request.url.includes('//api.bilibili.com/x/polymer/web-dynamic/v1/detail')) {
        if (request.url.includes('timezone_offset')) {
          // 动态详情页
          let response_json = JSON.parse(response.text);
          injectDynamicItem(response_json?.data?.item);
          response.text = JSON.stringify(response_json);
        }
      } else if (
        request.url.includes('//api.bilibili.com/x/polymer/web-dynamic/v1/feed/space') ||
        request.url.includes('//api.bilibili.com/x/polymer/web-dynamic/v1/feed/all')
      ) {
          // 主时间线和个人主页
          let response_json = JSON.parse(response.text);
          for (let i in response_json.data.items) {
              injectDynamicItem(response_json.data.items[i]);
          }
          response.text = JSON.stringify(response_json);
      } else if (request.url.includes('//app.bilibili.com/x/topic/web/details/cards')) {
          // 话题页
          let response_json = JSON.parse(response.text);
          for (let i in response_json.data.topic_card_list.items) {
              let item = response_json.data.topic_card_list.items[i]
              if (item.topic_type == 'DYNAMIC') {
                  injectDynamicItem(item.dynamic_card_item);
              }
          }
          response.text = JSON.stringify(response_json);
      }
    });
  }


  function sleep(times) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), times);
    });
  }

  // 获取动态的所有点赞者
  async function getLikersUid(tid) {
    const res = await fetch(`https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${tid}&`).then(res => res.json());
    const likes = res.data.item.modules.module_stat.like.count;
    let uids = [];
    let actions = [];
    for (let i = 1; (i - 1) * 20 < likes; i++) {
      actions.push(
        fetch(`https://api.vc.bilibili.com/dynamic_like/v1/dynamic_like/spec_item_likes?dynamic_id=${tid}&pn=${i}&ps=20`)
          .then(response => response.json())
          .then(res => {
            return res.data?.item_likes?.map(e => e.uid) ?? [];
          })
      );
      // 每一百页一起发请求
      if (actions.length >= 100) {
        const results = await Promise.all(actions);
        console.log('>>> 正在获取uid，获取100条');
        uids = uids.concat(...results);
        actions = [];
        // 接口请求太频繁会导致失败，所以休眠一秒
        await sleep(1000);
      }
    }
    GM_setValue('bobo_liker_uids', uids);
  }

  // 页面加载完成后
  unsafeWindow.addEventListener('load', () => {

    // 在动态页面增加设置按钮，用来更新点赞者列表
    if (location.hostname === 't.bilibili.com') {
      let boboListUpdating = false;
      const settingBtnEl = unsafeWindow.document.createElement("div");
      settingBtnEl.innerHTML = `
          <div
            style="
              width: 50px;
              height: 50px;
              border-radius:10px;
              position:fixed;
              bottom: 30px;
              left: 30px;
              border: 1px #000 solid;
              z-index: 9999;
              background-image: url(https://i0.hdslb.com/bfs/face/6bd8870432b9c0fffc755bf29de03856df6d9efe.jpg);
              background-size: 100% 100%;"
            id="bobo-settings-btn"
          >
          </div>
      `;

      function createWrapper() {
        const wrapperEl = document.createElement('div');
        wrapperEl.setAttribute('id', 'bobo-card-settings-dialog-wrapper');
        wrapperEl.setAttribute('style', 'width: 100%;height: 100%;position:fixed;top: 0;left: 0;background: rgba(0,0,0,0.5);z-index: 10000;justify-content: center;align-items: center;display: flex;');
        wrapperEl.innerHTML = `
            <div id="bobo-card-settings-dialog-body" style="width: 400px;height: 300px;background: #fff;border-radius:10px;padding: 30px;">
              <button id="bobo-card-update-likes">更新啵版点赞列表</button>
              <div id="bobo-card-update-text" style="width: 100%; height: 100px;margin: 40px 0 80px 0;"></div>
              <button id="bobo-card-setting-cancel" style="float: right;">退出设置</button>
            </div>
        `;
        unsafeWindow.document.body.appendChild(wrapperEl);
        let updateBtn = unsafeWindow.document.getElementById('bobo-card-update-likes');
        let cancelBtn = unsafeWindow.document.getElementById('bobo-card-setting-cancel');
        updateBtn.addEventListener('click', async () => {
          boboListUpdating = true;
          const el = unsafeWindow.document.getElementById('bobo-card-update-text');
          el.innerText = '正在获取列表，请稍等…';
          // 啵版动态id
          await getLikersUid('662016827293958168');
          el.innerText = '获取成功！';
          boboListUpdating = false;
        });
        unsafeWindow.document.getElementById('bobo-card-setting-cancel').addEventListener('click', () => {
          if (boboListUpdating) {
            alert('正在更新中，请勿退出，关闭页面会导致更新失败');
            return;
          }
          wrapperEl.remove();
        });
      }

      unsafeWindow.document.body.appendChild(settingBtnEl);

      settingBtnEl.addEventListener('click', () => {
        createWrapper(settingBtnEl);
      });
    }

    console.log('啵啵动态卡片插件加载完成');
  });
  
  function modifyUserSailing(replies) {
    replies = replies ?? [];
    for (let i = 0; i < replies.length; i++) {
      const memberData = replies[i]?.member;
      if (!memberData) continue;
      if (uidMatch(+memberData.mid)){
        const number = getFansNumber(+memberData.mid);
        memberData.user_sailing.cardbg = {
            "id": 33521,
            "name": "三三与她的小桂物",
            "image": "https://i0.hdslb.com/bfs/new_dyn/223325d6ff3c467a762eacd8cebad5bd1320060365.png",
            "jump_url": "https://space.bilibili.com/33605910",
            "fan": {
                "is_fan": 1,
                "number": number,
                "color": "#ff7373",
                "name": "三三与她的小桂物",
                "num_desc": number + ''
            },
            "type": "suit"
        }
      }
    }
  }

  // 添加jsonp钩子，评论数据使用jsonp方式获取，修改jquery的函数进行代理
  // jquery jsonp 原理见 https://www.cnblogs.com/aaronjs/p/3785646.html
  const jsonpMutation = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        if (mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.localName === 'script' && node.src.includes('//api.bilibili.com/x/v2/reply/main')) {
              const callbackName = node.src.match(/callback=(.*?)&/)[1];
              const originFunc = unsafeWindow[callbackName];
              unsafeWindow[callbackName] = (value) => {
                modifyUserSailing(value.data.replies);
                modifyUserSailing([value.data.top?.upper]);
                originFunc(value);
              }
            }
          }
        }
      }
    }
  });
  jsonpMutation.observe(unsafeWindow.document.head, { childList: true, subtree: true });
})();
