// ==UserScript==
// @name         WorkTile通知脚本
// @namespace    YXKJ.WorkTile.lzg
// @license      MIT
// @version      0.3.3
// @description  监听消息通知进行提示
// @author       Lzg
// @match        https://*.worktile.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worktile.com
// @grant        GM_xmlhttpRequest
// @connect      qyapi.weixin.qq.com
// @downloadURL https://update.greasyfork.org/scripts/453392/WorkTile%E9%80%9A%E7%9F%A5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/453392/WorkTile%E9%80%9A%E7%9F%A5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  var _a, _b;
  "use strict";
  var r = (_a = document.__monkeyWindow) != null ? _a : window;
  r.GM;
  r.unsafeWindow = (_b = r.unsafeWindow) != null ? _b : window;
  r.unsafeWindow;
  r.GM_info;
  r.GM_cookie;
  var b = (...e) => r.GM_xmlhttpRequest(...e);
  const originUrl = window.location.origin;
  let timeStamp = new Date().getTime();
  const time = 5e3;
  var userinfo = false;
  var projectName = "";
  const tipsObj = { infoData: [] };
  let notificationPush = false;
  var setIntervalFunc = null;
  let WebHookUrl = "";
  {
    WebHookUrl = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=93ef0c54-b9a4-4734-9c6c-aa6d8b717cca";
  }
  function getApiData(url, method = "GET", data) {
    let header = {};
    if (method === "POST") {
      header = { "Content-Type": "application/json" };
    }
    return new Promise((resolve) => b({
      header,
      method,
      url,
      data,
      onload: function(response) {
        if (response.status >= 200 && response.status < 400) {
          resolve(response.responseText);
        } else {
          console.error(`Error getting ${url}:`, response.status, response.statusText, response.responseText);
          resolve();
        }
      },
      onerror: function(response) {
        console.error(`Error during GM.xmlHttpRequest to ${url}:`, response);
        resolve(response);
      }
    }));
  }
  setIntervalFunc && clearInterval(setIntervalFunc);
  async function tesingLoginFuc() {
    var _a2, _b2, _c;
    try {
      const userData = await getApiData(originUrl + "/api/user/me?t=" + timeStamp);
      const userJsonData = userData && JSON.parse(userData);
      userinfo = (_b2 = (_a2 = userJsonData == null ? void 0 : userJsonData.data) == null ? void 0 : _a2.me) != null ? _b2 : false;
      if (!userinfo)
        return;
      const teamData = await getApiData(originUrl + "/api/team?t=" + timeStamp);
      const teamJsonData = teamData && JSON.parse(teamData);
      projectName = (_c = teamJsonData == null ? void 0 : teamJsonData.data) == null ? void 0 : _c.name;
      let wsTime = 0;
      window.ws = new WebSocket("wss://im.worktile.com/socket.io/?token=" + userinfo.imToken + "&uid=" + userinfo.uid + "&client=web&EIO=3&transport=websocket");
      ws.onopen = () => {
        console.log("==\u8FDE\u63A5\u670D\u52A1\u5668\u6210\u529F==");
        setTimeout(() => {
          ws.send("40/message?token=" + userinfo.imToken + "&uid=" + userinfo.uid + "&client=web,");
        });
      };
      ws.onclose = () => {
        console.log("==Error to websocket\u5173\u95ED==");
        setIntervalFunc && clearInterval(setIntervalFunc);
        setIntervalFunc = setInterval(() => {
          console.log("==\u5DF2\u5F00\u542F\u517C\u5BB9\u6A21\u5F0F==");
          if (userinfo) {
            handleNotificationData();
            timeStamp = new Date().getTime();
          } else {
            setIntervalFunc && clearInterval(setIntervalFunc);
          }
        }, time);
      };
      ws.onerror = () => {
        console.log("==Error to websocket\u8FDE\u63A5\u51FA\u9519==");
        setIntervalFunc && clearInterval(setIntervalFunc);
        setIntervalFunc = setInterval(() => {
          console.log("==\u5DF2\u5F00\u542F\u517C\u5BB9\u6A21\u5F0F==");
          if (userinfo) {
            handleNotificationData();
            timeStamp = new Date().getTime();
          } else {
            setIntervalFunc && clearInterval(setIntervalFunc);
          }
        }, time);
      };
      ws.onmessage = (evt) => {
        var _a3;
        wsTime++;
        if (wsTime === 1) {
          const params = JSON.parse(evt.data.substring(1));
          setInterval(() => {
            ws.send("2");
          }, (_a3 = params == null ? void 0 : params.pingInterval) != null ? _a3 : 1e4);
        } else {
          const params = JSON.parse(evt.data.substring(evt.data.indexOf(",") + 1));
          if (params[1] && params[0] !== "feed") {
            handleNotificationData();
          }
        }
      };
    } catch (error) {
      console.log(error);
      setIntervalFunc && clearInterval(setIntervalFunc);
    }
  }
  tesingLoginFuc();
  async function handleNotificationData() {
    var _a2, _b2, _c, _d;
    try {
      const data = await getApiData(originUrl + "/api/team/chats?t=" + timeStamp);
      const jsonData = data && JSON.parse(data);
      const infoData = [];
      let info = projectName + "\n\n";
      (_b2 = (_a2 = jsonData == null ? void 0 : jsonData.data) == null ? void 0 : _a2.channels) == null ? void 0 : _b2.map((item) => {
        if (item.unread) {
          infoData.push({ name: item == null ? void 0 : item.name, unread: item.unread });
          info += (item == null ? void 0 : item.name) + "\u6709" + item.unread + "\u6761\u672A\u8BFB\n";
        }
      });
      (_d = (_c = jsonData == null ? void 0 : jsonData.data) == null ? void 0 : _c.sessions) == null ? void 0 : _d.map((item) => {
        var _a3, _b3;
        if (item.unread) {
          infoData.push({ name: (_a3 = item == null ? void 0 : item.to) == null ? void 0 : _a3.display_name, unread: item.unread });
          info += ((_b3 = item == null ? void 0 : item.to) == null ? void 0 : _b3.display_name) + "\u53D1\u6765" + item.unread + "\u6761\u6D88\u606F\n";
        }
      });
      info += "\n\u8BF7\u6CE8\u610F\u67E5\u770B";
      if (!userinfo.mobile) {
        info += "\n@" + userinfo.display_name + "(\u8BF7\u7ED1\u5B9A\u624B\u673A\u53F7)";
      }
      if (infoData.length > 0) {
        infoData.map((item) => {
          if (!tipsObj.infoData.find((item1) => item.name === item1.name && item.unread === item1.unread)) {
            notificationPush = true;
          }
        });
        notificationPush = notificationPush ? notificationPush : tipsObj.infoData.length !== infoData.length;
      }
      tipsObj.infoData = infoData;
      if (notificationPush) {
        notificationPush = false;
        const key = "yxkj@" + userinfo.display_name + "@" + projectName + "@notificationPush";
        if (getCookie(key) !== info) {
          setCookie(key, info);
          const webhook_data = { "msgtype": "text", "text": { "content": info, "mentioned_mobile_list": [userinfo.mobile] } };
          handleWebHook(JSON.stringify(webhook_data));
        }
      }
      if (jsonData.code !== 200) {
        setIntervalFunc && clearInterval(setIntervalFunc);
      }
    } catch (error) {
      setIntervalFunc && clearInterval(setIntervalFunc);
    }
  }
  function handleWebHook(data) {
    getApiData(WebHookUrl, "POST", data).catch(() => {
      setIntervalFunc && clearInterval(setIntervalFunc);
    });
  }
  function setCookie(name, value) {
    let hours = 8;
    let exp = new Date();
    exp.setTime(exp.getTime() + hours * 60 * 60 * 1e3);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  }
  function getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  }
})();
