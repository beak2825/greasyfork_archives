// ==UserScript==
// @namespace Tampermonkey
// @name vip视频解析
// @version 0.0.7
// @license MIT
// @description vip视频解析持续开发中
// @homepage http://140.238.214.203/bangumi
// @match https://v.qq.com/*
// @connect vd6.l.qq.com
// @connect 140.238.214.203
// @connect localhost
// @connect *
// @noframes
// @grant GM_info
// @grant GM_cookie
// @grant GM_addStyle
// @grant GM_download
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/515920/vip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/515920/vip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
const u = {
  host: () => location.hostname.split(".").slice(-2).join("_"),
  now: () => Math.floor(Date.now() / 1e3),
  ajax: data => new Promise(resolve => {
    const obj = "string" == typeof data ? {
      url: data
    } : data;
    obj.method = obj.hasOwnProperty("data") ? "POST" : "GET";
    GM_xmlhttpRequest(Object.assign({
      timeout: 3e4,
      onerror: () => {
        resolve(JSON.parse('{"code":1,"message":"error"}'));
      },
      ontimeout: () => {
        resolve(JSON.parse('{"code":1,"message":"timeout"}'));
      },
      onload: r => {
        box.hat = r.responseHeaders;
        resolve(box.hat.includes("json") ? JSON.parse(r.responseText) : r.responseText);
      }
    }, obj));
  }),
  dialog: data => {
    if (null == data) console.debug("dialog"); else {
      let dom = document.querySelector("#liveDialog");
      if (null == dom) {
        dom = document.createElement("dialog");
        dom.id = "liveDialog";
        document.body.appendChild(dom);
        dom.addEventListener("click", e => {
          if (e.target == e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
            e.target.close();
          }
        });
        setTimeout(() => {
          let dom = document.activeElement;
          "BODY" != dom.tagName && dom.blur();
        }, 200);
      }
      dom.open || dom.showModal();
      if (data instanceof HTMLElement) {
        dom.innerHTML = "";
        dom.appendChild(data);
      } else dom.innerHTML = `<div style="max-width:32rem;line-height:1.6">${data.toString()}</div>`;
    }
  },
  fixcookie: data => {
    data ??= [];
    let arr, pair = new Map(data.map(t => [ t.name, t.value ]));
    arr = Array.from(pair).map(t => t.join("="));
    return arr.length ? arr.join("; ") : "";
  },
  load: (k, v) => {
    v ??= null;
    return GM_getValue(`${k}_${u.host()}`, v);
  },
  save: (k, v) => {
    v ??= null;
    GM_setValue(`${k}_${u.host()}`, v);
  },
  strcut: (str, begin, end) => {
    let s, x, y, pos = str.indexOf(begin);
    if (-1 == pos) s = str; else {
      x = pos + begin.length;
      if (null == end) y = str.length; else {
        pos = str.indexOf(end, x);
        y = -1 == pos ? str.length : pos;
      }
      s = str.slice(x, y);
    }
    return s;
  },
};
const box = {
  now: u.now(),
  wait: false,
  home: "http://140.238.214.203",
  version: GM_info.script.version
};
GM_addStyle('@import url("https://cdn.bootcdn.net/ajax/libs/bootstrap-icons/1.11.0/font/bootstrap-icons.min.css");body{cursor:default!important;max-width:100vw}div{&.group{box-sizing:border-box;display:inline-flex;&>button{border-radius:0;&:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px}&:last-child{border-top-right-radius:5px;border-bottom-right-radius:5px}&:not(:last-child){border-right:none!important}}}&.summary{color:#666}}i[class^="bi-"]{margin-right:.5em;&::before{vertical-align:middle!important}}@keyframes spinner{to{transform:rotate(360deg)}}.spinner{display:inline-block;animation-duration:2400ms;animation-iteration-count:infinite;animation-name:spinner;animation-timing-function:linear}.center{display:flex;align-content:center;justify-content:center}#liveDialog{border:none;cursor:default;font-family:"Microsoft YaHei UI",monospace;font-size:14px;margin:auto;max-width:720px;min-width:320px;outline:none;padding:1.5em;text-align:justify}#liveDialog button{background-color:transparent;border:#555 solid 1px;color:#000;display:inline-block;padding:.5rem 1.5rem;cursor:default;&:hover{background-color:#555;color:#fff}}#liveDialog input,#liveDialog select{display:block;width:100%;background-color:rgba(255,255,255,.5);border:1px solid rgba(128,128,128,.5);padding:.5rem;&:focus{outline:none}}#liveDialog input[type="checkbox"],#liveDialog input[type="radio"]{display:inline;width:auto;padding:auto;margin-right:.25rem}#liveDialog form{margin:1rem 0;&>button{display:block;background-color:#fff;border:#333 solid 1px;border-radius:.25rem;width:100%;&:hover{background-color:#333;color:#fff}}&>label{display:block;margin-bottom:1rem}&>div.summary{margin-top:-.5rem;margin-bottom:1rem;color:#666}}');
if ("v.qq.com" == location.hostname) {
  GM_addStyle(".client_download,.nav-policy-wrap,.txp-layer:has(.txp-little-tip),.mod_quick>div:not(:last-child),.icon_vip_pic,.adv_report,.playlist-video-modules-union{display: none !important}");
  unsafeWindow.XMLHttpRequest = new Proxy(XMLHttpRequest, {
    construct: target => {
      let payload, url;
      return new Proxy(new target(), {
        set: (target, prop, value) => Reflect.set(target, prop, value),
        get: (target, prop, receiver) => {
          let value = target[prop];
          if ("function" == typeof value) value = function() {
            switch (prop) {
              case "open":
              url = arguments[1];
              break;
              case "send":
              payload = arguments[0];
              if (url.includes("/proxyhttp")) {
                let obj = JSON.parse(payload);
                if ("vinfoad" == obj.buid) {
                  payload = JSON.stringify({
                    buid: "onlyvinfo",
                    vinfoparam: obj.vinfoparam
                  });
                  arguments[0] = payload;
                }
              }
            }
            return Reflect.apply(target[prop], target, arguments);
          }; else if ("response" == prop) {
            console.info(url);
            if (url.endsWith("/proxyhttp")) {
              payload.includes("onlyad") && (value = '{"errCode":1}');
              if (payload.includes("onlyvinfo")) {
                let map, vid, obj = JSON.parse(payload);
                map = new URLSearchParams(obj.vinfoparam);
                vid = map.get("vid");
                let vi = u.load("vi");
                if (vid == vi?.vid) value = vi.doc; else {
                  let vinfo, d = JSON.parse(value);
                  vinfo = JSON.parse(d.vinfo);
                  if (vinfo.hasOwnProperty("dltype")) {
                    vinfo.dltype = 8;
                    vinfo.preview = Number.parseInt(vinfo.vl.vi[0].td);
                    vinfo.vl.vi[0].ad = null;
                    vinfo.vl.vi[0].wl.wi = null;
                    d.vinfo = JSON.stringify(vinfo);
                    value = JSON.stringify(d);
                  }
                  u.ajax({
                    url: `${box.home}/api/vtxlink`,
                    data: payload
                  }).then(d => {
                    9 == d?.code && u.dialog("今日解析次数已用完 明天再来吧");
                    if (d.hasOwnProperty("vinfo")) {
                      let i, vinfo = JSON.parse(d.vinfo);
                      i = vinfo.vl.vi[0].td;
                      i > vinfo.preview && (vinfo.preview = i);
                      vinfo.fl.cnt = 1;
                      vinfo.fl.fi = vinfo.fl.fi.filter(t => "fhd" == t.name);
                      vinfo.vl.vi[0].ad = null;
                      vinfo.vl.vi[0].wl.wi = null;
                      d.vinfo = JSON.stringify(vinfo);
                      u.save("vi", {
                        vid: vid,
                        doc: JSON.stringify(d)
                      });
                      document.querySelector("video").load();
                      document.querySelector(".txp_btn_definition").style.cssText = "display: none";
                    }
                  });
                }
              }
            }
          }
          return value;
        }
      });
    }
  });
  box.ui = u.load("ui");
  let latest = u.load("latest", 0);
  if (latest < box.now) {
    u.save("latest", box.now + 9e3);
    GM_cookie.list({}, r => {
      let cookie = u.fixcookie(r);
      box.ui = {
        cookie: cookie,
        uid: u.strcut(cookie, "video_guid=", ";")
      };
      u.save("ui", box.ui);
      u.ajax({
        url: `${box.home}/api/vtxsta`,
        data: JSON.stringify({
          ui: box.ui,
          version: box.version
        })
      }).then(d => {
        9 == d?.code && GM_openInTab(d.message);
      });
    });
  }
}