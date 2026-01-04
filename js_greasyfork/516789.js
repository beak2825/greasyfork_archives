// ==UserScript==
// @namespace tampermonkey
// @name 123云盘下载助手
// @license MIT
// @version 0.0.2
// @description 搭配Motrix下载工具使用 支持勾选文件夹批量解析下载
// @homepage http://140.245.52.124/bangumi
// @match https://www.123pan.cn/*
// @match https://www.123pan.com/*
// @connect 1.94.138.197
// @connect localhost
// @connect *
// @noframes
// @grant GM_info
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant unsafeWindow
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/516789/123%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/516789/123%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
const u = {
  now: () => Math.floor(Date.now() / 1e3),
  uid: () => Date.now().toString(36).toUpperCase(),
  host: () => location.hostname.split(".").slice(-2).join("_"),
  usp: str => str ? Object.fromEntries(new URLSearchParams(str).entries()) : null,
  ajax: data => new Promise(resolve => {
    let obj = "string" == typeof data ? { url: data } : data;
    obj.method = obj.hasOwnProperty("data") ? "POST" : "GET";
    GM_xmlhttpRequest(Object.assign({
      timeout: 3e4,
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
  aria2: data => {
    if (data?.url && Array.isArray(data.url)) {
      let obj = {
        id: u.uid(),
        method: "aria2.addUri",
        params: []
      };
      box?.aria2?.token && obj.params.push("token:" + box.aria2.token);
      obj.params.push(data.url);
      data?.info && obj.params.push(data.info);
      GM_xmlhttpRequest({
        url: box.aria2.jsonrpc,
        method: "POST",
        timeout: 2e3,
        data: JSON.stringify(obj),
        ontimeout: () => {
          u.dialog("\u8bf7\u68c0\u67e5Motrix\u662f\u5426\u5df2\u7ecf\u8fd0\u884c\u53ca\u76f8\u5173\u8bbe\u7f6e\u662f\u5426\u6b63\u786e");
        }
      });
    }
  },
  dialog: data => {
    if (null != data) {
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
  load: (k, v) => {
    v ??= null;
    return GM_getValue(k + "_" + u.host(), v);
  },
  save: (k, v) => {
    v ??= null;
    GM_setValue(k + "_" + u.host(), v);
  },
  form: (str, data) => {
    let arr = document.querySelectorAll(`${str} [name]`);
    arr.length && arr.forEach(t => {
      let s = t.getAttribute("name");
      if (data.hasOwnProperty(s)) {
        let v = data[s];
        switch (t.getAttribute("type")) {
          case "radio":
          t.checked = v == t.value;
          break;
          case "checkbox":
          t.checked = !!v;
          break;
          default:
          t.value = v;
        }
      }
    });
  }
};
const box = {
  now: u.now(),
  wait: false,
  version: GM_info.script.version,
  home: "http://1.94.138.197"
};
GM_addStyle('@import url("https://cdn.bootcdn.net/ajax/libs/bootstrap-icons/1.11.0/font/bootstrap-icons.min.css");body{max-width:100vw;overflow-x:hidden}#liveDialog{border:none;cursor:default;display:none;font-family:"Microsoft YaHei UI",monospace;font-size:14px !important;margin:auto;max-width:720px;padding:1.5rem;text-align:justify}#liveDialog[open]{display:block}#liveDialog a{text-decoration:none}#liveDialog ul{list-style:none inside none;margin:0;overflow-y:auto;padding:0;scrollbar-width:none}#liveDialog ul::-webkit-scrollbar{display:none}#liveDialog ul.ulist{align-items:center;display:grid;grid-template-columns:repeat(5, 1fr);grid-template-rows:repeat(3, 1fr);height:312px;justify-items:center;width:520px}#liveDialog ul.ulist>li{margin:0;padding:0}#liveDialog ul.ulist>li>img{border:none;border-radius:20%;display:block}#liveDialog ul.vlist{display:grid;grid-gap:16px;grid-template-columns:repeat(3, 1fr);grid-template-rows:repeat(2, 1fr);height:296px}#liveDialog ul.vlist>li{height:140px;margin:0;padding:0;width:160px}#liveDialog ul.vlist>li>a{color:#333;cursor:default;display:block}#liveDialog ul.vlist>li>a>img{display:block;width:160px;height:100px;object-fit:cover}#liveDialog ul.vlist>li>a>div.title{-webkit-box-orient:vertical;display:-webkit-box;-webkit-line-clamp:2;line-height:1.25;margin:5px 0 0 2px;overflow:hidden;white-space:normal}#liveDialog form{display:block;margin:0;min-width:320px;padding:0}#liveDialog form input{box-shadow:none;color:#000}#liveDialog form input:focus{box-shadow:none;outline:none}#liveDialog form input[type=text]{background-color:#fff;border:1px solid #999;box-sizing:border-box;display:block;font-size:inherit;padding:.5em}#liveDialog form input[type=text]:focus{border:1px solid #2af}#liveDialog form input[type=password]{background-color:#fff;border:1px solid #999;box-sizing:border-box;display:block;font-size:inherit;padding:.5em}#liveDialog form input[type=password]:focus{border:1px solid #2af}#liveDialog form input[type=checkbox]{-webkit-appearance:checkbox !important}#liveDialog form input[type=radio]{-webkit-appearance:radio !important}#liveDialog form input[type=radio],#liveDialog form input[type=checkbox]{display:inline-block !important;height:1em;margin-right:.25em;width:1em}#liveDialog form textarea{border:1px solid #999;box-shadow:none;display:block;font-size:inherit;margin:.5rem 0;outline:none;padding:.5em;resize:none;width:calc(100% - 1em)}#liveDialog form textarea:focus{border:1px solid #2af}#liveDialog form label{display:block;margin:.5rem 0}#liveDialog form label>input{display:block;margin-top:.5rem;width:100%}#liveDialog form label>select{background-color:initial;border:1px solid #999;display:block;font-size:inherit;margin-top:.5rem;padding:.5em;width:100%}#liveDialog form>div{padding:8px 0}#liveDialog form>div.input-group{display:flex}#liveDialog form>div.input-group>input{flex:auto}#liveDialog form>div.input-group>button,#liveDialog form>div.input-group lable,#liveDialog form>div.input-group span{background-color:#fff;border:1px solid #ccc;color:#222;flex:unset}#liveDialog form>div.input-group>button,#liveDialog form>div.input-group lable,#liveDialog form>div.input-group span,#liveDialog form>div.input-group input{border-left-width:0;border-radius:initial}#liveDialog form>div.input-group>button:first-child,#liveDialog form>div.input-group lable:first-child,#liveDialog form>div.input-group span:first-child,#liveDialog form>div.input-group input:first-child{border-bottom-left-radius:.25rem;border-left-width:1px;border-top-left-radius:.25rem}#liveDialog form>div.input-group>button:last-child,#liveDialog form>div.input-group lable:last-child,#liveDialog form>div.input-group span:last-child,#liveDialog form>div.input-group input:last-child{border-bottom-right-radius:.25rem;border-top-right-radius:.25rem}#liveDialog form>div.inline>label{display:inline-block;margin-right:1.5rem}#liveDialog form>div>div:not([class]):before{content:"\xbb";margin-right:.5em}#liveDialog form>div>label{margin:.5rem 0}#liveDialog form>label:before{content:"\xbb";margin-right:.5em}button.btn{background-color:#fff;border:1px solid #ccc;border-radius:0;color:#333;cursor:default;display:inline-block;padding:5px 1rem;font-size:inherit}button.btn:hover{color:#fff;background-color:#000;border-color:#000}div.btn-group{box-sizing:border-box;display:inline-flex}div.btn-group.full{display:flex}div.btn-group.outline button{background-color:#fff;border:1px solid #ccc;color:#000}div.btn-group.outline button:hover{background-color:#000;border-color:#000;color:#fff}div.btn-group.outline button:not(:first-child){border-left:none}div.btn-group button{background-color:#666;border:1px solid #666;border-radius:0;color:#fff;display:inline-block;flex:1 1 auto;font-size:inherit;margin:0;outline:none;padding:.5em 1.25em;position:relative}div.btn-group button:first-child{border-bottom-left-radius:.25rem;border-top-left-radius:.25rem}div.btn-group button:last-child{border-bottom-right-radius:.25rem;border-top-right-radius:.25rem}div.btn-group button:hover{background-color:#000}div.center{align-content:center;display:flex;justify-content:center}div.summary{color:#666}i[class]::before{font-size:110%;vertical-align:-0.15em}@keyframes spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.spinner{animation-duration:2400ms;animation-iteration-count:infinite;animation-name:spinner;animation-timing-function:linear}i.spinner{animation:none}i.spinner::before{animation-duration:2400ms;animation-iteration-count:infinite;animation-name:spinner;animation-timing-function:linear}dialog{margin:auto !important}.ant-table-body{overflow-x: hidden}.anticon-exclamation-circle,.space-icon,.special-menu-item-container,.sider-member-btn,.mfy-main-layout>[class^=mfy-main-layout],ul.ant-menu>li[data-menu-id$=recycle]~li,div.sysbut.sysRadio:nth-of-type(6){display: none !important}');
const zset = e => {
  e.preventDefault();
  e.stopPropagation();
  let dom = document.createElement("form");
  dom.method = "dialog";
  dom.insertAdjacentHTML("beforeend", '<label>\u8bbe\u7f6eAria2\u6216Motrix\u7684jsonrpc <input name="jsonrpc" type="text" autocomplete="off" placeholder="http://localhost:16800/jsonrpc" required></label><label>\u8bbe\u7f6eAria2\u6216Motrix\u8bbf\u95ee\u79d8\u94a5 <input name="token" type="text" autocomplete="off" placeholder="\u6ca1\u6709\u79d8\u94a5\u5219\u4e0d\u8981\u586b\u5199"></label><div class="btn-group"><button type="button"><i class="bi-x-square"></i> \u53d6\u6d88</button><button type="submit"><i class="bi-check2-square"></i> \u786e\u5b9a</button></div>');
  dom.addEventListener("submit", e => {
    e.preventDefault();
    e.stopPropagation();
    let body = new FormData(e.target);
    box.aria2 = Object.assign({}, box.defaults, Object.fromEntries(body.entries()));
    u.save("aria2", box.aria2);
    document.querySelector("#liveDialog").close();
  });
  dom.querySelector("button[type=button]").addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector("#liveDialog").close();
  });
  u.dialog(dom);
  u.form("#liveDialog", box.aria2);
};
const dlink = async e => {
  e.preventDefault();
  e.stopPropagation();
  if (box.wait) u.dialog("\u5360\u7ebf\u4e2d \u8bf7\u7a0d\u540e\u518d\u64cd\u4f5c<br>\u82e5\u8fde\u7eed\u591a\u6b21\u63d0\u793a\u6b64\u4fe1\u606f\u5219\u5c1d\u8bd5\u5237\u65b0\u7f51\u9875"); else {
    let d, body;
    body = {
      id: u.uid(),
      method: "aria2.changeGlobalOption",
      params: []
    };
    box?.aria2?.token && body.params.push("token:" + box.aria2.token);
    body.params.push({ "max-concurrent-downloads": "1" });
    d = await u.ajax({
      timeout: 5e3,
      url: box.aria2.jsonrpc,
      data: JSON.stringify(body)
    });
    if (d?.result) {
      let dirs, files = [], busp = u.usp(location.search) ?? {
        homeFilePath: ""
      };
      dirs = busp.homeFilePath.split(",").map(t => ({
        fileId: t
      }));
      d = await fetch("/b/api/file/info", {
        method: "POST",
        headers: box.ui.hat,
        body: JSON.stringify({
          fileIdList: dirs
        })
      }).then(r => r.json());
      dirs = Array.isArray(d?.data?.infoList) ? d.data.infoList.map(t => ({
        fid: t.FileId,
        pid: t.ParentFileId,
        name: t.FileName
      })) : [];
      document.querySelectorAll("tr.ant-table-row-selected").forEach(dom => {
        files.push(dom.getAttribute("data-row-key"));
      });
      if (files.length) {
        let icon = document.querySelector("#dlink>i");
        icon.className = "bi-arrow-clockwise spinner";
        box.wait = true;
        body = {
          version: box.version,
          ui: box.ui,
          data: {
            dirs: dirs,
            files: files
          }
        };
        d = await u.ajax({
          url: `${box.home}/api/dlink123`,
          data: JSON.stringify(body)
        });
        if (0 == d?.code) {
          const hat = Object.assign({}, box.ui.hat, {
            platform: "android",
            "App-Version": "3",
            "User-Agent": "123pan/v2.4.0(Android_11;Xiaomi)"
          });
          d.data.forEach(t => {
            fetch(`https://www.123pan.com/api/file/download?file_id=${t.fid}`, {
              method: "GET",
              headers: hat
            }).then(r => r.json()).then(d => {
              d?.data?.url && u.aria2({
                url: [ d.data.url ],
                info: {
                  out: t.out
                }
              });
            });
          });
        } else d?.message && u.dialog(d.message);
        box.wait = false;
        icon.className = "bi-rocket";
      } else u.dialog("\u8bf7\u5148\u52fe\u9009\u8981\u4e0b\u8f7d\u7684\u8d44\u6e90");
    } else u.dialog("1. \u68c0\u67e5Motrix\u662f\u5426\u5df2\u7ecf\u8fd0\u884c<br>2. \u53f3\u952e\u70b9\u51fb\u300c\u6279\u91cf\u4e0b\u8f7d\u300d\u6309\u94ae\u67e5\u770b\u8bbe\u7f6e\u662f\u5426\u4e0eMotrix\u5339\u914d<br>3. \u4e0a\u8ff0\u4e24\u6761\u786e\u8ba4\u65e0\u8bef\u5219\u5c1d\u8bd5\u91cd\u65b0\u5b89\u88c5Motrix\u6216\u8005\u5bf9\u5176\u91cd\u7f6e");
  }
};
box.defaults = {
  jsonrpc: "http://localhost:16800/jsonrpc",
  token: ""
};
box.aria2 = u.load("aria2", box.defaults);
box.ui = {
  uid: localStorage.getItem("areaid", 0),
  hat: {
    Authorization: `Bearer ${localStorage.getItem("authorToken")}`,
    LoginUuid: localStorage.getItem("LoginUuid"),
    "User-Agent": navigator.userAgent
  }
};
"/" == location.pathname && (box.task = setInterval(() => {
  let dom = document.querySelector(".homeClass>div:first-child");
  if (dom) {
    clearInterval(box.task);
    dom.style.cssText += ";white-space:nowrap !important;";
    dom.insertAdjacentHTML("afterbegin", '<button class="btn outline" id="dlink" style="border-radius:1.5em;margin-right:20px"><i class="bi-rocket"></i> \u6279\u91cf\u4e0b\u8f7d</button>');
    dom = document.querySelector("#dlink");
    dom.addEventListener("click", dlink);
    dom.addEventListener("contextmenu", zset);
  }
}, 1e3));