// ==UserScript==
// @name        Bilibili直播免登录
// @namespace   Bilibili直播免登录
// @match       https://live.bilibili.com/*
// @grant       unsafeWindow
// @version     1.3
// @author      js216
// @run-at      document-start
// @description 避免未登录状态下在B站看直播时跳转到404页面
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/486358/Bilibili%E7%9B%B4%E6%92%AD%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/486358/Bilibili%E7%9B%B4%E6%92%AD%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(()=>{

const origFetch = unsafeWindow.fetch;
unsafeWindow.fetch = async (resource, config) => {
  let response = await origFetch(resource, config);
  if (typeof resource === "string" && resource.search(/\/get(H5)?InfoByRoom\?/) > 0) {
      const json = () => response.clone().json().then((data) => {
        if (data?.data?.block_info?.block) {
          data.data.block_info.block = false;
        }
        return data;
      });
      response.json = json;
  }
  return response;
};

try {
  let desc = Object.getOwnPropertyDescriptor(unsafeWindow, "__NEPTUNE_IS_MY_WAIFU__");
  let getter, setter;
  if (desc != undefined) {
    getter = desc.get;
    setter = desc.set;
  }
  let value;
  Object.defineProperty(unsafeWindow, "__NEPTUNE_IS_MY_WAIFU__", {
    enumerable: true,
    get: () => {
      if (getter != undefined) {
        let v = getter();
        if (v?.roomInfoRes?.data?.block_info?.block) {
          v.roomInfoRes.data.block_info.block = false;
        }
        return v;
      } else {
        return value;
      }
    },
    set: (v) => {
      value = v;
      if (value?.roomInfoRes?.data?.block_info?.block) {
        value.roomInfoRes.data.block_info.block = false;
      }
      if (setter != undefined) {
        setter(value);
      }
    }
  });
} catch(ex) {
  if (/^\/[0-9]+/.test(location.pathname)) {
    location.pathname = "/blanc" + location.pathname;
  }
}

})();