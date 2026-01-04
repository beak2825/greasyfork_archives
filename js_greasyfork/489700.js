// ==UserScript==
// @name 度盘下载
// @description 使用前先打开下载器
// @version 0.3.13
// @match https://pan.baidu.com/*
// @connect 127.0.0.1
// @connect localhost
// @connect *
// @noframes
// @grant GM_info
// @grant GM_cookie
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @run-at document-end
// @namespace https://greasyfork.org/users/1273683
// @downloadURL https://update.greasyfork.org/scripts/489700/%E5%BA%A6%E7%9B%98%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/489700/%E5%BA%A6%E7%9B%98%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
const u = {
  host: () => location.hostname.split(".").slice(-2).join("_"),
  now: () => Math.floor(Date.now() / 1e3),
  uid: () => Date.now().toString(36).toUpperCase(),
  tpl: (str, obj) => (Array.isArray(obj) ? obj : [obj]).map(row => str.replaceAll(/\[([a-z]{2,12})\]/g, (_matched, itx) => row.hasOwnProperty(itx) ? row[itx] : itx)).join(""),
  serialize: obj => "object" == typeof obj ? new URLSearchParams(Object.entries(obj)).toString() : obj,
  usp: str => str ? Object.fromEntries(new URLSearchParams(str).entries()) : null,
  ajax: obj => new Promise(resolve => {
    "string" == typeof obj && (obj = {
      url: obj
    }), GM_xmlhttpRequest(Object.assign({
      method: "GET",
      responseType: "json",
      onerror: () => {
        resolve(JSON.parse('{"code":1,"message":"error"}'));
      },
      ontimeout: () => {
        resolve(JSON.parse('{"code":1,"message":"timeout"}'));
      },
      onload: r => {
        resolve("json" == r.responseType ? r.response : r);
      }
    }, obj));
  }),
  aria2: obj => {
    if (obj?.url && Array.isArray(obj.url)) {
      Object.keys(obj).forEach(k => {
        "number" == typeof obj[k] && (obj[k] = obj[k].toString());
      });
      let o = {
        id: u.uid(),
        method: "aria2.addUri",
        params: []
      };
      box?.aria2?.token && o.params.push("token:" + box.aria2.token), o.params.push(obj.url), obj?.info && o.params.push(obj.info), GM_xmlhttpRequest({
        url: box.aria2.jsonrpc,
        method: "POST",
        timeout: 2e3,
        data: JSON.stringify(o)
      });
    }
  },
  dialog: obj => {
    if (null != obj) {
      let dom = document.querySelector("#liveDialog");
      null == dom && (dom = document.createElement("dialog"), document.body.appendChild(dom), dom.id = "liveDialog", dom.style.cssText = "margin: auto", dom.addEventListener("click", e => {
        e.target == e.currentTarget && (e.preventDefault(), e.stopPropagation(), e.target.close());
      })), obj instanceof HTMLElement ? (dom.innerHTML = "", dom.appendChild(obj)) : dom.innerHTML = `<div style="max-width:30rem;line-height:1.6">${obj.toString()}</div>`, dom.showModal(), setTimeout(() => {
        let dom = document.activeElement;
        "BODY" != dom.tagName && dom.blur();
      }, 200);
    }
  },
  hash: (str, m) => {
    m ??= "SHA-1";
    const s = new TextEncoder().encode(str);
    return new Promise(resolve => {
      crypto.subtle.digest(m, s).then(bin => {
        const arr = Array.from(new Uint8Array(bin)).map(b => b.toString(16).padStart(2, "0"));
        resolve(arr.join(""));
      });
    });
  },
  mcookie: (x, y, num) => {
    num ??= y.length;
    let a = [], b = x.reduce((d, t) => (y.includes(t.name) && d.push([t.name, t.value]), d), []);
    return new Map(b).forEach((v, k) => {
      a.push(`${k}=${v}`);
    }), num > a.length ? "" : a.join("; ");
  },
  load: (k, v) => (v ??= null, GM_getValue(k + "_" + u.host(), v)),
  save: (k, v) => {
    v ??= null, GM_setValue(k + "_" + u.host(), v);
  },
  strcut: (str, a, b) => {
    let x, y, s = str;
    return str.includes(a) && (x = str.indexOf(a) + a.length, null != b && -1 != (y = str.indexOf(b, x)) || (y = str.length), s = str.slice(x, y)), s;
  },
  pwd: len => {
    len ??= 4;
    let pwd = "";
    for (let i = 0; i < len; i++) pwd += "abcdefghijklmnopqrstuvwxyz23456789ABCDEFGHKLMNPSTVWXY"[Math.floor(1e3 * Math.random()) % 53];
    return pwd;
  },
  zform: (str, obj) => {
    let arr = document.querySelectorAll(str);
    arr.length && arr.forEach(t => {
      let s = t.getAttribute("name");
      if (obj.hasOwnProperty(s)) {
        let v = obj[s];
        switch (t.getAttribute("type")) {
         case "radio":
          t.checked = v == t.value;
          break;
         case "checkbox":
          t.checked = !!t.value;
          break;
         default:
          t.value = v;
        }
      }
    });
  }
};
let box = {
  now: u.now(),
  wait: false,
  version: GM_info.script.version,
  home: "http://pan.baidu.com"
};
if (GM_addStyle('@import url("https://cdn.bootcdn.net/ajax/libs/bootstrap-icons/1.11.0/font/bootstrap-icons.min.css");body{max-width:100vw;overflow-x:hidden}#zym{background-color:rgba(255,255,255,.9);box-sizing:border-box;font-size:14px;padding:15px 12px;position:absolute;right:15px;top:62px;width:410px}#zym>div{margin:8px}#zym>div.btn-group{font-size:12.5px;margin:0}#zym>div[name=path]>span{cursor:default}#zym>div[name=path]>span:not(:first-child):before{color:#666;content:"\uf231";font-family:"bootstrap-icons";font-size:12px;padding:0 8px;vertical-align:-0.15em}#zym>div[name=full]{overflow-y:auto;scrollbar-width:none}#zym>div[name=full]::-webkit-scrollbar{display:none}#zym>div>table{width:100%}#zym>div>table>tbody>tr{border-top:1px solid #bdf}#zym>div>table>tbody>tr:last-child{border-bottom:1px solid #bdf}#zym>div>table>tbody>tr.on{background-color:#cbedff;color:#000}#zym>div>table>tbody>tr.on>td:nth-child(1){color:#09f}#zym>div>table>tbody>tr.on>td:nth-child(1):before{content:"\uf517"}#zym>div>table>tbody>tr>td{cursor:default;line-height:40px}#zym>div>table>tbody>tr>td:nth-child(1){color:#000;padding:0 .5rem}#zym>div>table>tbody>tr>td:nth-child(1):before{content:"\uf28a";font-family:"bootstrap-icons";font-size:12px;vertical-align:-0.15em}#zym>div>table>tbody>tr>td:nth-child(2){max-width:274px;overflow:hidden;text-overflow:"";white-space:nowrap;word-wrap:normal}#zym>div>table>tbody>tr>td:nth-child(2)>input{background-color:rgba(0,0,0,0);border:none;outline:none;width:100%}#zym>div>table>tbody>tr>td:nth-child(3){padding:0 .5rem;text-align:right}#liveDialog{border:none;cursor:default;font-family:"Microsoft YaHei UI",monospace;font-size:14px !important;margin:auto;max-width:720px;padding:1rem;text-align:justify}#liveDialog a{text-decoration:none}#liveDialog ul{list-style:none inside none;margin:0;overflow-y:auto;padding:0;scrollbar-width:none}#liveDialog ul::-webkit-scrollbar{display:none}#liveDialog ul.ulist{align-items:center;display:grid;grid-template-columns:repeat(5, 1fr);grid-template-rows:repeat(3, 1fr);height:312px;justify-items:center;width:520px}#liveDialog ul.ulist>li{margin:0;padding:0}#liveDialog ul.ulist>li>img{border:none;border-radius:20%;display:block}#liveDialog ul.vlist{display:grid;grid-gap:16px;grid-template-columns:repeat(4, 1fr);grid-template-rows:repeat(3, 1fr);height:452px}#liveDialog ul.vlist>li{height:140px;margin:0;padding:0;width:160px}#liveDialog ul.vlist>li>a{color:#333;cursor:default;display:block}#liveDialog ul.vlist>li>a>img{display:block}#liveDialog ul.vlist>li>a>div.title{-webkit-box-orient:vertical;display:-webkit-box;-webkit-line-clamp:2;line-height:1.25;margin:5px 0 0 2px;overflow:hidden;white-space:normal}#liveDialog form{display:block;margin:0;min-width:320px;padding:0}#liveDialog form input{box-shadow:none;color:#000}#liveDialog form input:focus{box-shadow:none;outline:none}#liveDialog form input[type=text]{background-color:#fff;border:1px solid #999;box-sizing:border-box;display:block;font-size:inherit;padding:.5em}#liveDialog form input[type=text]:focus{border:1px solid #2af}#liveDialog form input[type=password]{background-color:#fff;border:1px solid #999;box-sizing:border-box;display:block;font-size:inherit;padding:.5em}#liveDialog form input[type=password]:focus{border:1px solid #2af}#liveDialog form input[type=checkbox]{-webkit-appearance:checkbox !important}#liveDialog form input[type=radio]{-webkit-appearance:radio !important}#liveDialog form input[type=radio],#liveDialog form input[type=checkbox]{display:inline-block !important;height:1em;margin-right:.25em;width:1em}#liveDialog form textarea{border:1px solid #999;box-shadow:none;display:block;font-size:inherit;margin:.5rem 0;outline:none;padding:.5em;resize:none;width:calc(100% - 1em)}#liveDialog form textarea:focus{border:1px solid #2af}#liveDialog form label{display:block;margin:.5rem 0}#liveDialog form label>input{display:block;margin-top:.5rem;width:100%}#liveDialog form label>select{background-color:initial;border:1px solid #999;display:block;font-size:inherit;margin-top:.5rem;padding:.5em;width:100%}#liveDialog form>div{padding:8px 0}#liveDialog form>div.input-group{display:flex}#liveDialog form>div.input-group>input{flex:auto}#liveDialog form>div.input-group>button,#liveDialog form>div.input-group lable,#liveDialog form>div.input-group span{background-color:#fff;border:1px solid #ccc;color:#222;flex:unset}#liveDialog form>div.input-group>button,#liveDialog form>div.input-group lable,#liveDialog form>div.input-group span,#liveDialog form>div.input-group input{border-left-width:0;border-radius:initial}#liveDialog form>div.input-group>button:first-child,#liveDialog form>div.input-group lable:first-child,#liveDialog form>div.input-group span:first-child,#liveDialog form>div.input-group input:first-child{border-bottom-left-radius:.25rem;border-left-width:1px;border-top-left-radius:.25rem}#liveDialog form>div.input-group>button:last-child,#liveDialog form>div.input-group lable:last-child,#liveDialog form>div.input-group span:last-child,#liveDialog form>div.input-group input:last-child{border-bottom-right-radius:.25rem;border-top-right-radius:.25rem}#liveDialog form>div.inline>label{display:inline-block;margin-right:1.5rem}#liveDialog form>div>div:not([class]):before{content:"\xbb";margin-right:.5em}#liveDialog form>div>label{margin:.5rem 0}#liveDialog form>label:before{content:"\xbb";margin-right:.5em}button.btn{background-color:#fff;border:1px solid #ccc;border-radius:0;color:#333;cursor:default;display:inline-block;padding:5px 1rem}button.btn :hover{color:#fff;background-color:#000;border-color:#000}div.btn-group{box-sizing:border-box;display:inline-flex}div.btn-group.full{display:flex}div.btn-group.outline button{background-color:#fff;border:1px solid #ccc;color:#000}div.btn-group.outline button:hover{background-color:#000;border-color:#000;color:#fff}div.btn-group.outline button:not(:first-child){border-left:none}div.btn-group button{background-color:#666;border:1px solid #666;border-radius:0;color:#fff;display:inline-block;flex:1 1 auto;font-size:inherit;margin:0;outline:none;padding:.5em 1.25em;position:relative}div.btn-group button:first-child{border-bottom-left-radius:.25rem;border-top-left-radius:.25rem}div.btn-group button:last-child{border-bottom-right-radius:.25rem;border-top-right-radius:.25rem}div.btn-group button:hover{background-color:#000}div.center{align-content:center;display:flex;justify-content:center}div.summary{color:#888}i[class]::before{font-size:110%;vertical-align:-0.15em}@keyframes spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.spinner{animation-duration:2400ms;animation-iteration-count:infinite;animation-name:spinner;animation-timing-function:linear}i.spinner{animation:none}i.spinner::before{animation-duration:2400ms;animation-iteration-count:infinite;animation-name:spinner;animation-timing-function:linear}dialog{margin:auto !important}'), "www.bilibili.com" == location.hostname) {
  GM_addStyle("#biliMainFooter,#slide_ad,#activity_vote,.eva-banner,.manuscript-report,.download-entry,.ad-report,.share-wrap,.bilibili-player-video-toast-bottom,.mobile-info,.video-ai-assistant,.watch-info,.video-complaint,.video-tool-more.video-toolbar-right-item,#arc_toolbar_report>.more,#share-container-id+span{display:none !important}");
  const uinit = () => {
    box.latest1 = box.now + 9e4, u.save("latest1", box.latest1), GM_cookie.list({}, (r, e) => {
      if (null == e) {
        const uc = u.mcookie(r, ["CURRENT_FNVAL", "CURRENT_QUALITY", "DedeUserID", "DedeUserID__ckMd5", "SESSDATA", "_uuid", "b_lsid", "b_nut", "bili_jct", "bili_ticket", "bili_ticket_expires", "buvid3", "buvid4", "buvid_fp", "rpdid", "sid"], 9);
        uc.includes("SESSDATA") && fetch("https://api.bilibili.com/x/web-interface/nav", {
          method: "GET",
          mode: "cors",
          credentials: "include"
        }).then(r => r.json()).then(d => {
          0 == d.code && d.data.isLogin ? (box.ui = {
            mid: d.data.mid.toString(),
            money: Number.parseInt(d.data.money) || 1,
            level: d.data.level_info.current_level,
            vip: d.data.vipStatus,
            vds: box.vds,
            cookie: uc
          }, u.save("ui", box.ui), box.usign = encodeURIComponent(JSON.stringify(box.ui))) : logout();
        });
      }
    });
  }, logout = () => {
    fetch("//passport.bilibili.com/login/exit/v2", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      body: u.serialize({
        biliCSRF: u.strcut(document.cookie, "bili_jct=", ";"),
        gourl: "https://www.bilibili.com"
      })
    }).then(r => r.json()).then(d => {
      u.save("latest1", 0), location.href = "https://passport.bilibili.com/login";
    });
  };
  if (box.vi = null, box.vds = null, box.bduid = GM_getValue("bduid", 0), box.ui = u.load("ui"), box.latest1 = u.load("latest1", 0), box.latest2 = u.load("latest2", 0), box.mid = document.cookie.includes("DedeUserID") && document.cookie.includes("bili_jct") ? Number.parseInt(u.strcut(document.cookie, "DedeUserID=", ";")) : 0, 0 == box.mid) logout(); else if (box.usign = encodeURIComponent(JSON.stringify(box.ui)), null == box.ui || box.now > box.latest1 ? uinit() : (box.mid == box.ui.mid && (box.vds = box.ui.vds), u.ajax({
    url: "https://api.bilibili.com/x/web-interface/nav",
    anonymous: true,
    headers: {
      Cookie: box.ui.cookie,
      Referer: "https://www.bilibili.com/"
    }
  }).then(d => {
    0 == d.code && d.data.isLogin || uinit();
  })), location.pathname.startsWith("/video/")) {
    unsafeWindow.XMLHttpRequest = new Proxy(XMLHttpRequest, {
      construct: target => {
        let url, body;
        return new Proxy(new target(), {
          set: (target, prop, value) => Reflect.set(target, prop, value),
          get: (target, prop) => {
            let value = target[prop];
            if ("function" == typeof value) value = function() {
              switch (prop) {
               case "open":
                url = arguments[1];
                break;
               case "send":
                body = arguments[0];
              }
              return Reflect.apply(target[prop], target, arguments);
            }; else if ("responseText" == prop) if (url.includes("/archive/like")) {
              const vi = null == box.vi ? null : {
                bvid: box.vi.bvid,
                bduid: box.vi.bduid
              };
              if (vi && body.includes("like=1") && u.ajax(`${box.home}/baidu/api/bzlike?${u.serialize(vi)}&usign=${box.usign}`), null == box.ui.vds) {
                const usp = u.usp(location.search);
                usp && usp.hasOwnProperty("vd_source") && (box.ui.vds = usp.vd_source, u.save("ui", box.ui), box.usign = encodeURIComponent(JSON.stringify(box.ui)));
              }
            } else url.includes("/web-interface/view/cards") && null == document.querySelector("#baiduyun") && (document.querySelector("#arc_toolbar_report > div:nth-child(2)").insertAdjacentHTML("afterbegin", '<span class="appeal-text" id="baiduyun" title="\u53f3\u952e\u8bbe\u7f6e" style="margin-right:2em"><i class="bi-share"></i> \u767e\u5ea6</span>'), document.querySelector("#baiduyun").addEventListener("click", e => {
              if (e.preventDefault(), e.stopPropagation(), box.vi) {
                const now = u.now();
                if (now > box.latest2) {
                  const usp = u.serialize(box.vi);
                  u.ajax(`${box.home}/bilibili/api/bzshare?${usp}&usign=${box.usign}`).then(d => {
                    0 == d.code ? (box.latest2 = box.now + 9e3, u.save("latest2", box.latest2), GM_setValue("latest", 0), u.dialog("\u89c6\u9891\u5206\u4eab\u6210\u529f<br>\u53ef\u8fd4\u56de\u5ea6\u76d8\u7f51\u9875\u5237\u65b0\u540e\u6253\u5f00\u70b9\u8d5e\u5217\u8868\u67e5\u770b")) : u.dialog(d.message);
                  });
                } else u.dialog(`冷却中 ${box.latest2 - now} 秒后才可分享视频`);
              } else u.dialog("\u672a\u8bfb\u53d6\u5230\u89c6\u9891\u76f8\u5173\u4fe1\u606f \u8bf7\u5c1d\u8bd5\u5237\u65b0\u4e00\u6b21\u9875\u9762\u540e\u518d\u64cd\u4f5c");
            }));
            return value;
          }
        });
      }
    });
    const bvid = u.strcut(location.pathname, "/video/", "/");
    bvid.startsWith("BV") && fetch(`//api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
      method: "GET",
      mode: "cors",
      credentials: "include"
    }).then(r => r.json()).then(d => {
      0 == d.code && (box.vi = {
        bduid: box.bduid,
        bvid: d.data.bvid,
        title: d.data.title,
        pic: d.data.pic
      });
    });
  }
} else if ("pan.baidu.com" == location.hostname) if (GM_addStyle('#layoutMain{font-size:14px}div.file-name{font-family:"Microsoft YaHei UI", monospace}.wp-side-options,span.newIcon,span[node-type=find-apps],[node-type=header-union],dd.desc-box>div,span.user-name{display:none !important}div[node-type=listTopTools]>a:nth-child(8){display:none !important}'), box.defaults = {
  jsonrpc: "http://localhost:16800/jsonrpc",
  token: ""
}, box.aria2 = u.load("aria2", box.defaults), "/disk/home" == location.pathname) {
  const vlist2html = list => {
    box.vli = document.createElement("div"), box.vli.insertAdjacentHTML("beforeend", '<div style="padding-bottom: 10px">\u7ed9\u4e0b\u9762\u7684\u89c6\u9891\u70b9\u8d5e\u83b7\u5f97\u89e3\u6790\u70b9\u6570 &nbsp; \u5f53\u524d\u89e3\u6790\u70b9\u6570\uff1a<span name="uut"></span> &nbsp; <span name="sta"></span> &nbsp; <span name="cd"></span> <div style="float:right"><span style="color:#666">\u9f20\u6807\u6eda\u8f6e\u7ffb\u9875</span></div></div><ul class="vlist"></ul>'), box.vli.querySelector("ul.vlist").insertAdjacentHTML("afterbegin", u.tpl('<li><a href="https://www.bilibili.com/video/[bvid]" target="_blank" referrerpolicy="no-referrer"><img width="160" height="100" src="[pic]@160w_100h_1c.webp" crossorigin="anonymous" referrerpolicy="no-referrer"><div class="title">[title]</div></a></li>', list));
  };
  new MutationObserver((list, obs) => {
    list.forEach(t => {
      switch (t.target.getAttribute("node-type")) {
       case "header-union":
        t.addedNodes.length && t.addedNodes.forEach(dom => {
          dom.remove();
        });
        break;
       case "header-apps":
        obs.disconnect(), t.addedNodes.forEach((dom, idx) => {
          [3, 5].includes(idx) || dom.remove();
        });
      }
    });
  }).observe(document.querySelector("#layoutHeader"), {
    childList: true,
    subtree: true
  }), unsafeWindow.XMLHttpRequest = new Proxy(XMLHttpRequest, {
    construct: target => {
      let url, body;
      return new Proxy(new target(), {
        set: (target, prop, value) => Reflect.set(target, prop, value),
        get: (target, prop) => {
          let value = target[prop];
          if ("function" == typeof value) value = function() {
            switch (prop) {
             case "open":
              url = arguments[1];
              break;
             case "send":
              body = arguments[0];
            }
            return Reflect.apply(target[prop], target, arguments);
          }; else if ("responseText" == prop && url.includes("/api/quota")) {
            let usp = new URLSearchParams(u.strcut(url, "?"));
            box.logid = usp.get("logid"), box.dplogid = usp.get("dp-logid"), box.bdstoken = usp.get("bdstoken"), null == box?.sign && (box.sign = "nil", fetch(`/api/gettemplatevariable?fields=${encodeURIComponent(JSON.stringify(["sign2", "sign1", "sign3", "timestamp"]))}&channel=chunlei&web=1&app_id=250528&bdstoken=${box.bdstoken}&logid=${box.logid}&clienttype=0&dp-logid=${box.dplogid}`).then(r => r.json()).then(d => {
              if (0 == d.errno) {
                box.timestamp = d.result.timestamp;
                const foo = Function("return " + d.result.sign2)();
                if (box.sign = btoa(foo(d.result.sign3, d.result.sign1)), box?.usign) {
                  let dom = document.querySelector("div[node-type=listTopTools]");
                  dom && (dom.innerHTML = '<div class="btn-group outline" style="font-size: 12.5px"> <button name="zset"> <i class="bi-gear"></i> \u8bbe\u7f6e </button> <button name="video"> <i class="bi-heart"></i> \u70b9\u8d5e </button> <button name="dlink"> <i class="bi-cloud-download"></i> \u4e0b\u8f7d </button> </div>', document.querySelector("div.btn-group.outline").addEventListener("click", e => {
                    e.preventDefault(), e.stopPropagation();
                    let dom = e.target.closest("button");
                    switch (dom.getAttribute("name")) {
                     case "video":
                      u.ajax(`${box.home}/baidu/api/pibaidu?name=baidu&version=${box.version}&usign=${box.usign}`).then(d => {
                        switch (d.code) {
                         case 69:
                          GM_openInTab(d.message), u.dialog("\u300c\u767e\u5ea6\u7f51\u76d8\u6279\u91cf\u4e0b\u8f7d\u300d\u5df2\u6709\u65b0\u7684\u7248\u672c\u4e86 \u8bf7\u66f4\u65b0\u811a\u672c\u540e\u518d\u4f7f\u7528");
                          break;
                         case 0:
                          (dom = box.vli.querySelector("span[name=uut]")) && (dom.textContent = d.num, u.dialog(box.vli.cloneNode(true))), d.cd ? ((dom = document.querySelector("span[name=sta]")) && (dom.style.cssText = "color: #933", dom.textContent = "\u51b7\u5374\u4e2d"), (dom = document.querySelector("span[name=cd]")) && (dom.style.cssText = "color: #666", dom.textContent = d.cd, box.taskcd && clearInterval(box.taskcd), box.taskcd = setInterval(() => {
                            let i = Number.parseInt(dom.textContent) - 1;
                            dom.textContent = i, d.cd > 99 + i && clearInterval(box.taskcd);
                          }, 1e3))) : (dom = document.querySelector("span[name=sta]")) && (dom.style.cssText = "color: #393", dom.textContent = "\u51b7\u5374\u7ed3\u675f");
                          break;
                         default:
                          u.dialog(d.message);
                        }
                      });
                      break;
                     case "zset":
                      !function() {
                        let dom = document.createElement("form");
                        dom.method = "dialog", dom.insertAdjacentHTML("beforeend", '<label>\u8bbe\u7f6eAria2\u6216Motrix\u7684jsonrpc <input name="jsonrpc" type="text" placeholder="http://localhost:16800/jsonrpc" required></label><label>\u8bbe\u7f6eAria2\u6216Motrix\u8bbf\u95ee\u79d8\u94a5 <input name="token"  type="text" placeholder="\u6ca1\u6709\u79d8\u94a5\u5219\u4e0d\u8981\u586b\u5199"></label><div class="btn-group"><button type="button"><i class="bi-x-square"></i> \u53d6\u6d88</button><button type="submit"><i class="bi-check2-square"></i> \u786e\u5b9a</button></div>'), dom.addEventListener("submit", e => {
                          e.preventDefault(), e.stopPropagation();
                          let body = new FormData(e.target);
                          box.aria2 = Object.assign({}, box.defaults, Object.fromEntries(body.entries())), u.save("aria2", box.aria2), document.querySelector("#liveDialog").close();
                        }), dom.querySelector("button[type=button]").addEventListener("click", e => {
                          e.preventDefault(), e.stopPropagation(), document.querySelector("#liveDialog").close();
                        }), u.dialog(dom), u.zform("#liveDialog input[name]", box.aria2);
                      }();
                      break;
                     default:
                      box.icon = dom.children[0], (async () => {
                        if (box.wait) u.dialog("\u8bf7\u7a0d\u540e\u518d\u8bd5"); else {
                          let d = await u.ajax({
                            url: box.aria2.jsonrpc,
                            method: "POST",
                            timeout: 2e3,
                            data: JSON.stringify({
                              id: u.uid(),
                              method: "aria2.changeGlobalOption",
                              params: [{
                                "max-concurrent-downloads": "1"
                              }]
                            })
                          });
                          if (1 == d?.code) u.dialog("1. \u8bf7\u68c0\u67e5\u4e0b\u8f7d\u5de5\u5177\u662f\u5426\u8fd0\u884c<br>2. \u70b9\u51fb\u300c\u8bbe\u7f6e\u300d\u6309\u94ae\u67e5\u770b\u8bbe\u7f6e\u662f\u5426\u6b63\u786e<br>\u7aef\u53e3\uff1aaria2 = 6800, Motrix = 16800<br>"); else {
                            let arr = box.dcontext.instanceForSystem.list.getSelected().reduce((d, t) => (t.isdir ? d = d.concat((path => {
                              let xhr = new XMLHttpRequest(), d = (xhr.open("GET", `/rest/2.0/xpan/multimedia?method=listall&recursion=1&path=${encodeURIComponent(path)}`, false), xhr.send(), JSON.parse(xhr.responseText));
                              return 0 == d.errno ? d.list : [];
                            })(t.path)) : d.push(t), d), []).filter(t => !t.isdir);
                            if (arr.length) {
                              box.wait = 1, box.icon.className = "bi-arrow-clockwise spinner";
                              let d = await u.ajax(`${box.home}/baidu/api/pibaidu?name=baidu&version=${box.version}&usign=${box.usign}`);
                              if (69 == d.code) u.dialog("\u8bf7\u66f4\u65b0\u300c\u767e\u5ea6\u7f51\u76d8\u6279\u91cf\u4e0b\u8f7d\u300d\u7136\u540e\u5237\u65b0\u9875\u9762\u65b0\u7248\u672c\u624d\u80fd\u751f\u6548"), location.replace(d.message); else if (0 == d.code) if (2 == box.ui.vip) if (null == box.token && (d = await u.ajax({
                                url: "https://openapi.baidu.com/oauth/2.0/authorize?client_id=IlLqBbU3GjQ0t46TRwFateTprHWl39zF&response_type=token&redirect_uri=oob&scope=basic,netdisk",
                                responseType: "text"
                              }), box.token = u.strcut(d?.finalUrl, "access_token=", "&")), box.token) if (arr = arr.map(t => t.fs_id), 0 == (d = await fetch(`/rest/2.0/xpan/multimedia?method=filemetas&access_token=${box.token}&dlink=1&fsids=${encodeURIComponent(JSON.stringify(arr))}`, {
                                headers: {
                                  "User-Agent": "pan.baidu.com"
                                }
                              }).then(r => r.json())).errno) {
                                let bduss = u.strcut(box.ui.cookie, "BDUSS=", ";");
                                d.list.forEach(t => {
                                  u.aria2({
                                    url: [t.dlink],
                                    info: {
                                      header: ["User-Agent: pan.baidu.com", `Cookie: BDUSS=${bduss}`],
                                      out: `baiduyun${t.path}`,
                                      split: "8"
                                    }
                                  });
                                });
                              } else u.dialog(d.errmsg); else u.dialog("\u8bf7\u5c1d\u8bd5\u5173\u95ed\u5176\u4ed6\u53ef\u80fd\u6709\u51b2\u7a81\u7684\u811a\u672c\u548c\u63d2\u4ef6\u5e76\u6e05\u7406\u6d4f\u89c8\u5668"); else {
                                let total = arr.reduce((d, t) => d + Math.ceil(t.size / (1 << 30)), 0);
                                if (d.num > total) {
                                  const li = arr.map(t => t.fs_id);
                                  {
                                    var list = li;
                                    box.share = null, box.lishare = null;
                                    const pwd = u.pwd();
                                    let d1, d2, body = {
                                      channel_list: "[]",
                                      period: "1",
                                      pwd: pwd,
                                      schannel: "4",
                                      fid_list: JSON.stringify(list)
                                    };
                                    if (0 == (d1 = await fetch(`/share/set?app_id=250528&channel=chunlei&clienttype=0&web=1&bdstoken=${box.bdstoken}&dp-logid=${box.dplogid}&logid=${box.logid}`, {
                                      headers: {
                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                                      },
                                      method: "POST",
                                      mode: "cors",
                                      credentials: "same-origin",
                                      body: u.serialize(body)
                                    }).then(r => r.json())).errno && 0 == (d2 = await fetch(`/share/tplconfig?surl=${d1.link.slice(-23)}&fields=sign,timestamp&app_id=250528&channel=chunlei&clienttype=0&web=1&bdstoken=${box.bdstoken}&dp-logid=${box.dplogid}&logid=${box.logid}`).then(r => r.json())).errno) {
                                      box.share = {
                                        pwd: pwd,
                                        url: d1.link,
                                        sid: d1.shareid,
                                        sign: d2.data.sign,
                                        timestamp: d2.data.timestamp
                                      }, body = {
                                        encrypt: 0,
                                        product: "share",
                                        uk: box.ui.uid,
                                        primaryid: box.share.sid,
                                        fid_list: JSON.stringify(list),
                                        extra: box.sekey
                                      };
                                      const d = await fetch(`/api/sharedownload?app_id=250528&channel=chunlei&clienttype=12&web=1&sign=${box.share.sign}&timestamp=${box.share.timestamp}`, {
                                        headers: {
                                          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                                        },
                                        referrer: box.share.url,
                                        method: "POST",
                                        mode: "cors",
                                        credentials: "same-origin",
                                        body: u.serialize(body)
                                      }).then(r => r.json());
                                      box.lishare = 0 == d.errno ? d.list : null;
                                    }
                                  }
                                  if (await 0, box?.lishare) {
                                    for (const f of box.lishare) {
                                      const i = arr.find(t => t.fs_id == f.fs_id), fe = {
                                        fs_id: f.fs_id,
                                        dlink: f.dlink,
                                        size: Math.ceil(f.size / (1 << 20)),
                                        out: i.path
                                      }, d = await u.ajax(`${box.home}/baidu/api/dlink?usign=${box.usign}&share=${encodeURIComponent(JSON.stringify(box.share))}&fe=${encodeURIComponent(JSON.stringify(fe))}`);
                                      0 == d.code && u.aria2(d.data);
                                    }
                                    fetch(`/share/cancel?app_id=250528&channel=chunlei&clienttype=0&web=1&bdstoken=${box.bdstoken}&dp-logid=${box.dplogid}`, {
                                      headers: {
                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                                      },
                                      method: "POST",
                                      mode: "cors",
                                      credentials: "same-origin",
                                      body: u.serialize({
                                        shareid_list: JSON.stringify([box.share.sid])
                                      })
                                    });
                                  } else u.dialog("\u6587\u4ef6\u5206\u4eab\u5931\u8d25 \u8be5\u6587\u4ef6\u53ef\u80fd\u88ab\u9650\u5236\u5206\u4eab\u4e86");
                                } else u.dialog('\u89e3\u6790\u70b9\u6570\u4e0d\u8db3\uff0c\u8bf7\u70b9\u51fb\u300c<span style="color:#f33">\u70b9\u8d5e</span>\u300d\u6309\u94ae\u6253\u5f00\u5217\u8868\u7ed9\u5176\u4e2d\u7684\u89c6\u9891\u70b9\u8d5e<br><br>\u7ed9\u4e00\u4e2a\u89c6\u9891\u70b9\u8d5e\u589e\u52a0\u89e3\u6790\u70b9\u6570\u540e\u8fdb\u5165\u51b7\u5374\uff0c\u7b49\u5f85<span style="color:#66f">\u51b7\u5374\u7ed3\u675f</span>\u540e\u7684\u70b9\u8d5e\u624d\u4f1a\u589e\u52a0\u89e3\u6790\u70b9\u6570\uff0c\u5728\u51b7\u5374\u671f\u95f4\u70b9\u8d5e\u64cd\u4f5c\u4e0d\u4f1a\u52a0\u70b9\u3002\u70b9\u8d5e\u76f8\u5173\u7684\u89e3\u6790\u70b9\u6570\u548c\u51b7\u5374\u65f6\u95f4\u6839\u636e\u4e0d\u540c\u65f6\u671f\u7684\u7ef4\u62a4\u6210\u672c\u4f5c\u76f8\u5e94\u8c03\u6574\u3002<br><br>\u6bcf\u4e2a\u89c6\u9891\u53ea\u6709\u9996\u6b21\u70b9\u8d5e\u4f1a\u52a0\u89e3\u6790\u70b9\u6570\uff0c\u540c\u4e00\u4e2a\u89c6\u9891\u53cd\u590d\u70b9\u8d5e\u65e0\u6548\u3002\u9700\u8981\u7b49\u5f85\u89c6\u9891\u64ad\u653e\u533a\u4e0b\u65b9\u7684\u300c<span style="color:#f33">\u767e\u5ea6\u5206\u4eab</span>\u300d\u663e\u793a\u51fa\u6765\u518d\u8fdb\u884c\u64cd\u4f5c\uff0c\u5426\u5219\u4e0d\u80fd\u8bc6\u522b\u3002\u672a\u5b8c\u6210\u7b54\u9898\u8f6c\u6b63\u7684\u96f6\u7ea7\u53f7\u4e5f\u4f1a\u8bc6\u522b\u4e0d\u4e86\u3002\u5728B\u7ad9\u6253\u5f00\u4efb\u610f\u4e00\u4e2a\u81ea\u5df1\u559c\u6b22\u7684\u89c6\u9891\uff0c\u70b9\u51fb\u64ad\u653e\u533a\u57df\u4e0b\u65b9\u7684\u300c<span style="color:#f33">\u767e\u5ea6\u5206\u4eab</span>\u300d\u53ef\u4ee5\u628a\u5f53\u524d\u89c6\u9891\u6dfb\u52a0\u8fdb\u811a\u672c\u7684\u70b9\u8d5e\u5217\u8868\u3002<br><br>\u6bcf\u4e2a\u6587\u4ef6\u81f3\u5c11\u9700\u8981\u6d88\u80171\u4e2a\u89e3\u6790\u70b9\u6570\uff0c\u89e3\u6790\u5c0f\u4e8e1GB\u7684\u6587\u4ef6\u6d88\u80171\u70b9\uff0c\u5927\u4e8e1GB\u5c0f\u4e8e2GB\u7684\u6d88\u80172\u70b9\uff0c\u5927\u4e8e2GB\u5c0f\u4e8e3GB\u7684\u6d88\u80173\u70b9\uff0c\u4ee5\u6b64\u7c7b\u63a8\u3002\u672a\u4f7f\u7528\u7684\u89e3\u6790\u70b9\u6570\u4e00\u76f4\u4fdd\u5b58\uff0c\u6700\u591a\u53ef\u79ef\u6512200\u7684\u89e3\u6790\u70b9\u6570\u3002<br> ');
                              } else u.dialog(d.message);
                              box.wait = 0, box.icon.className = "bi-cloud-download";
                            }
                          }
                        }
                      })();
                    }
                  }));
                }
              }
            }));
          }
          return value;
        }
      });
    }
  }), fetch("/rest/2.0/xpan/nas?method=uinfo").then(r => r.json()).then(d => {
    0 == d.errno ? (box.ui = {
      uid: d.uk.toString(),
      vip: d.vip_type
    }, GM_cookie.list({}, (r, e) => {
      if (null == e) if (box.ui.cookie = u.mcookie(r, ["BDUSS", "STOKEN"]), box.ui.cookie) {
        {
          const arr = GM_getValue("vlist", []), latest = GM_getValue("latest", 0);
          arr.length && latest > box.now ? vlist2html(arr) : (GM_setValue("latest", box.now + 9e3), u.ajax(`${box.home}/baidu/api/vlist?name=baidu&version=${box.version}`).then(d => {
            switch (d.code) {
             case 69:
              GM_openInTab(d.message);
              break;
             case 0:
              GM_setValue("vlist", d.data), GM_setValue("greasyfork", d.message), vlist2html(d.data);
              break;
             default:
              u.dialog(d.message);
            }
          }));
        }
        box.ui.uid != GM_getValue("bduid", 0) && GM_setValue("bduid", box.ui.uid), null != unsafeWindow?.locals && (locals.set("is_vip", 1), locals.set("is_svip", 1), locals.set("vip_level", 6)), box.sekey = JSON.stringify({
          skey: decodeURIComponent(u.strcut(document.cookie, "BDCLND=", ";"))
        }), box.dcontext = unsafeWindow.require("system-core:context/context.js"), box.usign = encodeURIComponent(JSON.stringify(box.ui));
      } else u.dialog("\u300c\u767e\u5ea6\u7f51\u76d8\u6279\u91cf\u4e0b\u8f7d\u300d\u521d\u59cb\u5316\u5931\u8d25<br>\u8bf7\u5c1d\u8bd5\u5173\u95ed\u5176\u4ed6\u53ef\u80fd\u6709\u51b2\u7a81\u7684\u811a\u672c\u548c\u63d2\u4ef6\u5e76\u6e05\u7406\u6d4f\u89c8\u5668<br>"); else u.dialog("\u300c\u767e\u5ea6\u7f51\u76d8\u6279\u91cf\u4e0b\u8f7d\u300d\u9700\u8981\u5b89\u88c5\u6700\u65b0\u7684\u7be1\u6539\u7334Beta\u7248\u4f7f\u7528");
    })) : u.dialog(d.errmsg);
  });
} else if ("/disk/main" == location.pathname && location.hash.startsWith("#/index")) {
  let s = u.strcut(location.hash, "path=", "&");
  location.href = `/disk/home?stayAtHome=true#/all?path=${s}`;
}