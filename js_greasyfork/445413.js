// ==UserScript==
// @namespace greasyfork
// @name B站番剧解锁
// @version 0.1.23
// @description 解除哔哩哔哩番剧的大会员和港澳台在线观看限制 油管和B站视频下载
// @match *://*.bilibili.com/*
// @match *://*.biligame.com/*
// @match *://*.youtube.com/*
// @exclude *://message.bilibili.com/*
// @connect bilibili.com
// @connect 121.5.226.51
// @connect 127.0.0.1
// @grant GM_addStyle
// @grant GM_info
// @grant GM_cookie
// @grant GM_download
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/445413/B%E7%AB%99%E7%95%AA%E5%89%A7%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/445413/B%E7%AB%99%E7%95%AA%E5%89%A7%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==
void function() {
  function zset() {
    if (u.zdom(), document.querySelector("#zyset")) ipod.aria2 && u.zform("#zyset input", ipod.aria2), document.querySelector("#zyset").setAttribute("style", "display: flex"); else {
      let str;
      switch (u.zhost()) {
       case "baidu.com":
        str = '<div class="tamper" id="zyset"><div><form><div><label>\u8282\u70b9\u9009\u62e9</label><input name="host" type="radio" value="1"><label>\u81ea\u52a8\u9002\u5e94 &nbsp; </label><input name="host" type="radio" value="2"><label>\u9655\u897f\u8054\u901a &nbsp; </label><input name="host" type="radio" value="3"><label>\u4e91\u5357\u8054\u901a &nbsp; </label><input name="host" type="radio" value="4"><label>\u6e56\u5357\u7535\u4fe1</label></div><div><input name="idm" type="checkbox" value="1"><label>\u4ec5\u63d0\u53d6\u4e0b\u8f7d\u5730\u5740 \u53ef\u7c98\u8d34\u5230<span style="margin:0 2px;font-family:Tahoma">IDM</span>\u4e2d\u4f7f\u7528 &nbsp; <span name="cpua">\u590d\u5236UA</span></label></div><div><label>\u8bbe\u7f6e aria2 jsonrpc</label><input name="jsonrpc" type="text"></div><div><label>\u8bbe\u7f6e aria2 \u8bbf\u95ee\u53e3\u4ee4</label><input name="token" type="password" placeholder="\u6ca1\u6709\u53e3\u4ee4\u5219\u4e0d\u8981\u586b\u5199"></div><div><label>\u8bbe\u7f6e\u4e0b\u8f7d\u4fdd\u5b58\u8def\u5f84</label><input name="dir" type="text"><div class="summary"> \u8bf7\u4f7f\u7528\u5de6\u659c\u6760\u4f5c\u4e3a\u5206\u9694\u7b26</div></div><div class="btn-group"><button type="button"><i class="ion-close"></i> \u53d6\u6d88</button><button type="submit"><i class="ion-checkmark"></i> \u786e\u5b9a</button></div></form></div></div>';
        break;
       case "youtube.com":
        str = '<div class="tamper" id="zyset"><div><form><div><input name="mode" type="checkbox" value="1"><label>\u4f7f\u7528\u6d4f\u89c8\u5668\u76f4\u63a5\u4e0b\u8f7d\u800c\u975eAria2</label><div class="summary">\u4e0d\u77e5\u9053\u5982\u4f55\u8bbe\u7f6e\u4ee3\u7406\u670d\u52a1\u5668\u8bf7\u52fe\u9009\u6d4f\u89c8\u5668\u4e0b\u8f7d<br>\u662f\u540e\u53f0\u4e0b\u8f7d\u65e0\u4ea4\u4e92\u63d0\u793a\u6ce8\u610f\u52ff\u91cd\u590d\u4e0b\u8f7d</div></div><div><label>\u8bbe\u7f6e aria2 jsonrpc</label><input name="jsonrpc" type="text"></div><div><label>\u8bbe\u7f6e aria2 \u8bbf\u95ee\u53e3\u4ee4</label><input name="token" type="password" placeholder="\u6ca1\u6709\u53e3\u4ee4\u5219\u4e0d\u8981\u586b\u5199"></div><div><label>\u8bbe\u7f6e\u4ee3\u7406\u670d\u52a1\u5668</label><input name="proxy" type="text" placeholder="\u4e0d\u4f7f\u7528\u4ee3\u7406\u5219\u7559\u7a7a"><div class="summary">\u4e0d\u9700\u8981\u901a\u8fc7\u4ee3\u7406\u670d\u52a1\u5668\u4e0b\u8f7d\u5219\u5c06\u6b64\u8bbe\u7f6e\u6e05\u7a7a</div></div><div><label>\u8bbe\u7f6e\u4e0b\u8f7d\u4fdd\u5b58\u8def\u5f84</label><input name="dir" type="text"></div><div class="btn-group"><button type="button"><i class="ion-close"></i> \u53d6\u6d88</button><button type="submit"><i class="ion-checkmark"></i> \u786e\u5b9a</button></div></form></div></div>';
        break;
       default:
        str = '<div class="tamper" id="zyset"><div><form><div><label>\u8bbe\u7f6e aria2 jsonrpc</label><input name="jsonrpc" type="text"></div><div><label>\u8bbe\u7f6e aria2 \u8bbf\u95ee\u53e3\u4ee4</label><input name="token" type="password" placeholder="\u6ca1\u6709\u53e3\u4ee4\u5219\u4e0d\u8981\u586b\u5199"></div><div><label>\u8bbe\u7f6e\u4e0b\u8f7d\u4fdd\u5b58\u8def\u5f84</label><input name="dir" type="text"></div><div class="btn-group"><button type="button"><i class="ion-close"></i> \u53d6\u6d88</button><button type="submit"><i class="ion-checkmark"></i> \u786e\u5b9a</button></div></form></div></div>';
      }
      document.body.insertAdjacentHTML("beforeend", str), ipod.aria2 && u.zform("#zyset input", ipod.aria2);
      let dom = document.querySelector("span[name=cpua]");
      dom && dom.addEventListener("click", () => {
        u.zdom(), GM_xmlhttpRequest({
          url: `${ipod.home}/baiduyun/ua.txt`,
          method: "GET",
          responseType: "text",
          onload(r) {
            console.log("ua = %s", r.response), GM_setClipboard(r.response, "text");
          }
        });
      }), document.querySelector("#zyset").setAttribute("style", "display:flex"), document.querySelector("#zyset button[type=button]").addEventListener("click", () => {
        u.zdom(), document.querySelector("#zyset").removeAttribute("style");
      }), document.querySelector("#zyset form").addEventListener("submit", () => {
        let dom = u.zdom(), d = new FormData(dom);
        ipod.aria2 = Object.assign({}, ipod.defaults, Object.fromEntries(d.entries())), u.save("aria2", ipod.aria2), document.querySelector("#zyset").setAttribute("style", "display:none");
      });
    }
  }
  function zproxy() {
    let xhr2 = unsafeWindow.XMLHttpRequest, ajax2 = (url, cookie = 0) => {
      let xhr = new xhr2();
      return xhr.open("GET", url, false), xhr.withCredentials = cookie, xhr.send(), xhr.responseText;
    };
    unsafeWindow.XMLHttpRequest = new Proxy(XMLHttpRequest, {
      construct(target) {
        let pod = {};
        return new Proxy(new target(), {
          set: (target, prop, value) => (target[prop] = value, true),
          get(target, prop) {
            if (pod.hasOwnProperty(prop)) return pod[prop];
            let value = target[prop];
            if ("function" == typeof value) {
              let bc = value;
              value = function() {
                if ("open" == prop) pod.method = arguments[0], pod.url = arguments[1]; else if ("send" == prop) if (pod.url.includes("/info?mid=11783021&")) pod.responseText = '{"code":0,"message":"0","ttl":1,"data":{"mid":11783021,"name":"\u54d4\u54e9\u54d4\u54e9\u756a\u5267\u51fa\u5dee","sex":"\u4fdd\u5bc6","face":"http://i2.hdslb.com/bfs/face/9f10323503739e676857f06f5e4f5eb323e9f3f2.jpg","sign":"","rank":10000,"level":6,"jointime":0,"moral":0,"silence":0,"birthday":"","coins":0,"fans_badge":false,"fans_medal":{"show":false,"wear":false,"medal":null},"official":{"role":3,"title":"\u54d4\u54e9\u54d4\u54e9\u756a\u5267\u51fa\u5dee \u5b98\u65b9\u8d26\u53f7","desc":"","type":1},"vip":{"type":0,"status":0,"du6e_date":0,"vip_pay_type":0,"theme_type":0,"label":{"path":"","text":"","label_theme":"","text_color":"","bg_style":0,"bg_color":"","border_color":""},"avatar_subscript":0,"nickname_color":"","role":0,"avatar_subscript_url":""},"pendant":{"pid":0,"name":"","image":"","expire":0,"image_enhance":"","image_enhance_frame":""},"nameplate":{"nid":0,"name":"","image":"","image_small":"","level":"","condition":""},"user_honour_info":{"mid":0,"colour":null,"tags":null},"is_followed":false,"top_photo":"http://i1.hdslb.com/bfs/space/cb1c3ef50e22b6096fde67febe863494caefebad.png","theme":{},"sys_notice":{},"live_room":{"roomStatus":0}}}'; else if (pod.url.includes("/game/comment/user/my_comment")) pod.responseText = '{"code":-703,"message":"\u6570\u636e\u4e3a\u7a7a","request_id":"20c36cc00e7a11ec84a2b6c4aae96307","ts":1630867824012}'; else if (pod.url.includes("/pc/game/user/space/comment_list")) pod.responseText = '{"code":0,"message":"\u6210\u529f","request_id":"64b686e00e7c11ec9f779a4ceb236e23","ts":0,"data":[]}'; else if (pod.url.includes("/pgc/player/web/playurl?")) {
                  let url = pod.url.startsWith("//") ? location.protocol + pod.url : pod.url, s = ajax2(url, 1), d = JSON.parse(s);
                  0 == d.code && 0 == d.result.is_preview || ipod.pay ? pod.responseText = s : (s = url.substring(url.indexOf("?") + 1), s = ajax2(url = `${ipod.home}/ajax?act=bvlink&${s}&version=${ipod.version}&sign=${ipod.sign}`), 0 == (d = JSON.parse(s)).code && (pod.responseText = 86 == ipod.zone.country_code && u.now() > ipod.dtpub ? s.replace(/\/\/.+?\//g, "//" + ipod.aria2.cdn + "/") : s));
                } else if (pod.url.includes("/pgc/view/web/season?")) {
                  let id = u.strcut(location.pathname, "/play/ep"), url = pod.url.startsWith("//") ? location.protocol + pod.url : pod.url, d = JSON.parse(ajax2(url, 1));
                  0 == d.code && (ipod.pay = 0, d.result.hasOwnProperty("payment") && (0 == Number.parseFloat(d.result.payment.price) || (ipod.pay = 1)), d.result.episodes.forEach(t => {
                    t.status = 2, t.rights.area_limit = 0, t.badge = "", t.badge_type = 0, t.id == id && (ipod.dtpub = t.pub_time + 9e4);
                  })), pod.responseText = JSON.stringify(d);
                } else if (pod.url.includes("/pgc/view/web/season/user/status")) {
                  let url = pod.url.startsWith("//") ? location.protocol + pod.url : pod.url, d = JSON.parse(ajax2(url, 1));
                  0 == d.code && (d.result.area_limit = 0, d.result.ban_area_show = 0, d.result.vip_info.due_date = ipod.dtvip, d.result.vip_info.status = 1, d.result.vip_info.type = 1), pod.responseText = JSON.stringify(d);
                }
                return bc.apply(target, arguments);
              };
            }
            return value;
          }
        });
      }
    });
  }
  var ipod = {}, u = {
    now: () => Math.ceil(Date.now() / 1e3),
    uid: () => Date.now().toString(36).toUpperCase(),
    zhost: () => location.hostname.split(".").slice(-2).join("."),
    rand: max => Math.floor(1e6 * Math.random()) % max,
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
      let i, arr = [], str = "abcdefghijklmnopqrstuvwxyz23456789ABCDEFGHKLMNPSTVWXY", len = str.length;
      for (i = 0; bit > i; i++) arr.push(str.charAt(u.rand(len)));
      return arr.join("");
    },
    zdom(child = 0) {
      let e = window.event;
      return e.preventDefault(), e.stopPropagation(), child ? e.target : e.currentTarget;
    },
    zero(num, bit = 3) {
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
    urlopen(url, w = 1) {
      let dom = document.createElement("a");
      dom.setAttribute("href", url), 1 == w && dom.setAttribute("target", "_blank"), dom.click();
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
        if (obj.hasOwnProperty(s)) switch (t.getAttribute("type")) {
         case "radio":
          obj[s] == t.value && (t.checked = true);
          break;
         case "checkbox":
          obj[s] && (t.checked = true);
          break;
         default:
          t.value = obj[s];
        }
      });
    },
    cpdom(node) {
      let dom = null;
      return node instanceof HTMLElement && (dom = node.cloneNode(true), node.after(dom), node.remove()), dom;
    },
    load(name, val) {
      name += "." + u.zhost();
      let s = GM_getValue(name);
      return s ? JSON.parse(s) : val;
    },
    save(name, data) {
      name += "." + u.zhost(), GM_setValue(name, JSON.stringify(data));
    },
    strcut(str, x, y) {
      let a, b, s = "";
      return str && x && str.includes(x) && (a = str.indexOf(x) + x.length, y ? -1 == (b = str.indexOf(y, a)) && (b = str.length) : b = str.length, s = str.substring(a, b)), s;
    },
    str2obj(str) {
      let o = null;
      return u.vstr(str) && str.length && (o = str.includes('"') ? JSON.parse(str) : JSON.parse(str.replaceAll(/'/g, '"'))), o;
    },
    sprintf(str) {
      let i, regx, s = u.vstr(str) ? str : "";
      if (s.length) for (i = arguments.length - 1; i > 0; i--) regx = RegExp("%" + i, "g"), s = s.replaceAll(regx, arguments[i]);
      return s;
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
    tpl(str, data) {
      const jstpl = (html, obj) => html.replaceAll(/\[(\w{1,16})\]/g, (mat, k) => obj.hasOwnProperty(k) ? obj[k] : "[" + k + "]");
      return (Array.isArray(data) ? data : [data]).map(t => jstpl(str, t)).join("");
    },
    history(str) {
      const origin = history[str];
      return function() {
        let e = new Event(str);
        return e.arguments = arguments, window.dispatchEvent(e), origin.apply(this, arguments);
      };
    },
    jsload(url, name) {
      let dom = document.createElement("script");
      dom.src = u.urlfix(url), name && dom.setAttribute("name", name), dom.setAttribute("async", "true"), dom.setAttribute("crossorigin", "anonymous"), document.head.appendChild(dom);
    },
    swClassName(str) {
      if (str && u.vstr(str)) {
        let arr = Array.from(ipod.checkbox.classList);
        arr.includes(str) ? arr = arr.filter(t => t != str) : arr.push("on"), ipod.checkbox.className = arr.join(" ");
      }
    }
  };
  if (ipod.version = GM_info.script.version, ipod.cookie = "", ipod.idle = 1, ipod.now = u.now(), GM_addStyle(String.raw`@font-face{font-family:"Ionicons";src:url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.eot?v=4.5.5#iefix") format("embedded-opentype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff2?v=4.5.5") format("woff2"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff?v=4.5.5") format("woff"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.ttf?v=4.5.5") format("truetype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.svg?v=4.5.5#Ionicons") format("svg");font-weight:normal;font-style:normal}i[class|=ion]{display:inline-block;font-family:"Ionicons";font-size:120%;font-style:normal;font-variant:normal;font-weight:normal;line-height:1;text-rendering:auto;text-transform:none;vertical-align:text-bottom;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased}.ion-android:before{content:"\f225"}.ion-angular:before{content:"\f227"}.ion-apple:before{content:"\f229"}.ion-bitbucket:before{content:"\f193"}.ion-bitcoin:before{content:"\f22b"}.ion-buffer:before{content:"\f22d"}.ion-chrome:before{content:"\f22f"}.ion-closed-captioning:before{content:"\f105"}.ion-codepen:before{content:"\f230"}.ion-css3:before{content:"\f231"}.ion-designernews:before{content:"\f232"}.ion-dribbble:before{content:"\f233"}.ion-dropbox:before{content:"\f234"}.ion-euro:before{content:"\f235"}.ion-facebook:before{content:"\f236"}.ion-flickr:before{content:"\f107"}.ion-foursquare:before{content:"\f237"}.ion-freebsd-devil:before{content:"\f238"}.ion-game-controller-a:before{content:"\f13b"}.ion-game-controller-b:before{content:"\f181"}.ion-github:before{content:"\f239"}.ion-google:before{content:"\f23a"}.ion-googleplus:before{content:"\f23b"}.ion-hackernews:before{content:"\f23c"}.ion-html5:before{content:"\f23d"}.ion-instagram:before{content:"\f23e"}.ion-ionic:before{content:"\f150"}.ion-ionitron:before{content:"\f151"}.ion-javascript:before{content:"\f23f"}.ion-linkedin:before{content:"\f240"}.ion-markdown:before{content:"\f241"}.ion-model-s:before{content:"\f153"}.ion-no-smoking:before{content:"\f109"}.ion-nodejs:before{content:"\f242"}.ion-npm:before{content:"\f195"}.ion-octocat:before{content:"\f243"}.ion-pinterest:before{content:"\f244"}.ion-playstation:before{content:"\f245"}.ion-polymer:before{content:"\f15e"}.ion-python:before{content:"\f246"}.ion-reddit:before{content:"\f247"}.ion-rss:before{content:"\f248"}.ion-sass:before{content:"\f249"}.ion-skype:before{content:"\f24a"}.ion-slack:before{content:"\f10b"}.ion-snapchat:before{content:"\f24b"}.ion-steam:before{content:"\f24c"}.ion-tumblr:before{content:"\f24d"}.ion-tux:before{content:"\f2ae"}.ion-twitch:before{content:"\f2af"}.ion-twitter:before{content:"\f2b0"}.ion-usd:before{content:"\f2b1"}.ion-vimeo:before{content:"\f2c4"}.ion-vk:before{content:"\f10d"}.ion-whatsapp:before{content:"\f2c5"}.ion-windows:before{content:"\f32f"}.ion-wordpress:before{content:"\f330"}.ion-xbox:before{content:"\f34c"}.ion-xing:before{content:"\f10f"}.ion-yahoo:before{content:"\f34d"}.ion-yen:before{content:"\f34e"}.ion-youtube:before{content:"\f34f"}.ion-add:before{content:"\f273"}.ion-add-circle:before{content:"\f272"}.ion-add-circle-outline:before{content:"\f158"}.ion-airplane:before{content:"\f15a"}.ion-alarm:before{content:"\f274"}.ion-albums:before{content:"\f275"}.ion-alert:before{content:"\f276"}.ion-american-football:before{content:"\f277"}.ion-analytics:before{content:"\f278"}.ion-aperture:before{content:"\f279"}.ion-apps:before{content:"\f27a"}.ion-appstore:before{content:"\f27b"}.ion-archive:before{content:"\f27c"}.ion-arrow-back:before{content:"\f27d"}.ion-arrow-down:before{content:"\f27e"}.ion-arrow-dropdown:before{content:"\f280"}.ion-arrow-dropdown-circle:before{content:"\f27f"}.ion-arrow-dropleft:before{content:"\f282"}.ion-arrow-dropleft-circle:before{content:"\f281"}.ion-arrow-dropright:before{content:"\f284"}.ion-arrow-dropright-circle:before{content:"\f283"}.ion-arrow-dropup:before{content:"\f286"}.ion-arrow-dropup-circle:before{content:"\f285"}.ion-arrow-forward:before{content:"\f287"}.ion-arrow-round-back:before{content:"\f288"}.ion-arrow-round-down:before{content:"\f289"}.ion-arrow-round-forward:before{content:"\f28a"}.ion-arrow-round-up:before{content:"\f28b"}.ion-arrow-up:before{content:"\f28c"}.ion-at:before{content:"\f28d"}.ion-attach:before{content:"\f28e"}.ion-backspace:before{content:"\f28f"}.ion-barcode:before{content:"\f290"}.ion-baseball:before{content:"\f291"}.ion-basket:before{content:"\f292"}.ion-basketball:before{content:"\f293"}.ion-battery-charging:before{content:"\f294"}.ion-battery-dead:before{content:"\f295"}.ion-battery-full:before{content:"\f296"}.ion-beaker:before{content:"\f297"}.ion-bed:before{content:"\f160"}.ion-beer:before{content:"\f298"}.ion-bicycle:before{content:"\f299"}.ion-bluetooth:before{content:"\f29a"}.ion-boat:before{content:"\f29b"}.ion-body:before{content:"\f29c"}.ion-bonfire:before{content:"\f29d"}.ion-book:before{content:"\f29e"}.ion-bookmark:before{content:"\f29f"}.ion-bookmarks:before{content:"\f2a0"}.ion-bowtie:before{content:"\f2a1"}.ion-briefcase:before{content:"\f2a2"}.ion-browsers:before{content:"\f2a3"}.ion-brush:before{content:"\f2a4"}.ion-bug:before{content:"\f2a5"}.ion-build:before{content:"\f2a6"}.ion-bulb:before{content:"\f2a7"}.ion-bus:before{content:"\f2a8"}.ion-business:before{content:"\f1a4"}.ion-cafe:before{content:"\f2a9"}.ion-calculator:before{content:"\f2aa"}.ion-calendar:before{content:"\f2ab"}.ion-call:before{content:"\f2ac"}.ion-camera:before{content:"\f2ad"}.ion-car:before{content:"\f2b2"}.ion-card:before{content:"\f2b3"}.ion-cart:before{content:"\f2b4"}.ion-cash:before{content:"\f2b5"}.ion-cellular:before{content:"\f164"}.ion-chatboxes:before{content:"\f2b6"}.ion-chatbubbles:before{content:"\f2b7"}.ion-checkbox:before{content:"\f2b9"}.ion-checkbox-outline:before{content:"\f2b8"}.ion-checkmark:before{content:"\f2bc"}.ion-checkmark-circle:before{content:"\f2bb"}.ion-checkmark-circle-outline:before{content:"\f2ba"}.ion-clipboard:before{content:"\f2bd"}.ion-clock:before{content:"\f2be"}.ion-close:before{content:"\f2c0"}.ion-close-circle:before{content:"\f2bf"}.ion-close-circle-outline:before{content:"\f166"}.ion-cloud:before{content:"\f2c9"}.ion-cloud-circle:before{content:"\f2c2"}.ion-cloud-done:before{content:"\f2c3"}.ion-cloud-download:before{content:"\f2c6"}.ion-cloud-outline:before{content:"\f2c7"}.ion-cloud-upload:before{content:"\f2c8"}.ion-cloudy:before{content:"\f2cb"}.ion-cloudy-night:before{content:"\f2ca"}.ion-code:before{content:"\f2ce"}.ion-code-download:before{content:"\f2cc"}.ion-code-working:before{content:"\f2cd"}.ion-cog:before{content:"\f2cf"}.ion-color-fill:before{content:"\f2d0"}.ion-color-filter:before{content:"\f2d1"}.ion-color-palette:before{content:"\f2d2"}.ion-color-wand:before{content:"\f2d3"}.ion-compass:before{content:"\f2d4"}.ion-construct:before{content:"\f2d5"}.ion-contact:before{content:"\f2d6"}.ion-contacts:before{content:"\f2d7"}.ion-contract:before{content:"\f2d8"}.ion-contrast:before{content:"\f2d9"}.ion-copy:before{content:"\f2da"}.ion-create:before{content:"\f2db"}.ion-crop:before{content:"\f2dc"}.ion-cube:before{content:"\f2dd"}.ion-cut:before{content:"\f2de"}.ion-desktop:before{content:"\f2df"}.ion-disc:before{content:"\f2e0"}.ion-document:before{content:"\f2e1"}.ion-done-all:before{content:"\f2e2"}.ion-download:before{content:"\f2e3"}.ion-easel:before{content:"\f2e4"}.ion-egg:before{content:"\f2e5"}.ion-exit:before{content:"\f2e6"}.ion-expand:before{content:"\f2e7"}.ion-eye:before{content:"\f2e9"}.ion-eye-off:before{content:"\f2e8"}.ion-fastforward:before{content:"\f2ea"}.ion-female:before{content:"\f2eb"}.ion-filing:before{content:"\f2ec"}.ion-film:before{content:"\f2ed"}.ion-finger-print:before{content:"\f2ee"}.ion-fitness:before{content:"\f1ac"}.ion-flag:before{content:"\f2ef"}.ion-flame:before{content:"\f2f0"}.ion-flash:before{content:"\f17e"}.ion-flash-off:before{content:"\f12f"}.ion-flashlight:before{content:"\f16b"}.ion-flask:before{content:"\f2f2"}.ion-flower:before{content:"\f2f3"}.ion-folder:before{content:"\f2f5"}.ion-folder-open:before{content:"\f2f4"}.ion-football:before{content:"\f2f6"}.ion-funnel:before{content:"\f2f7"}.ion-gift:before{content:"\f199"}.ion-git-branch:before{content:"\f2fa"}.ion-git-commit:before{content:"\f2fb"}.ion-git-compare:before{content:"\f2fc"}.ion-git-merge:before{content:"\f2fd"}.ion-git-network:before{content:"\f2fe"}.ion-git-pull-request:before{content:"\f2ff"}.ion-glasses:before{content:"\f300"}.ion-globe:before{content:"\f301"}.ion-grid:before{content:"\f302"}.ion-hammer:before{content:"\f303"}.ion-hand:before{content:"\f304"}.ion-happy:before{content:"\f305"}.ion-headset:before{content:"\f306"}.ion-heart:before{content:"\f308"}.ion-heart-dislike:before{content:"\f167"}.ion-heart-empty:before{content:"\f1a1"}.ion-heart-half:before{content:"\f1a2"}.ion-help:before{content:"\f30b"}.ion-help-buoy:before{content:"\f309"}.ion-help-circle:before{content:"\f30a"}.ion-help-circle-outline:before{content:"\f16d"}.ion-home:before{content:"\f30c"}.ion-hourglass:before{content:"\f111"}.ion-ice-cream:before{content:"\f30d"}.ion-image:before{content:"\f30e"}.ion-images:before{content:"\f30f"}.ion-infinite:before{content:"\f310"}.ion-information:before{content:"\f312"}.ion-information-circle:before{content:"\f311"}.ion-information-circle-outline:before{content:"\f16f"}.ion-jet:before{content:"\f315"}.ion-journal:before{content:"\f18d"}.ion-key:before{content:"\f316"}.ion-keypad:before{content:"\f317"}.ion-laptop:before{content:"\f318"}.ion-leaf:before{content:"\f319"}.ion-link:before{content:"\f22e"}.ion-list:before{content:"\f31b"}.ion-list-box:before{content:"\f31a"}.ion-locate:before{content:"\f31c"}.ion-lock:before{content:"\f31d"}.ion-log-in:before{content:"\f31e"}.ion-log-out:before{content:"\f31f"}.ion-magnet:before{content:"\f320"}.ion-mail:before{content:"\f322"}.ion-mail-open:before{content:"\f321"}.ion-mail-unread:before{content:"\f172"}.ion-male:before{content:"\f323"}.ion-man:before{content:"\f324"}.ion-map:before{content:"\f325"}.ion-medal:before{content:"\f326"}.ion-medical:before{content:"\f327"}.ion-medkit:before{content:"\f328"}.ion-megaphone:before{content:"\f329"}.ion-menu:before{content:"\f32a"}.ion-mic:before{content:"\f32c"}.ion-mic-off:before{content:"\f32b"}.ion-microphone:before{content:"\f32d"}.ion-moon:before{content:"\f32e"}.ion-more:before{content:"\f1c9"}.ion-move:before{content:"\f331"}.ion-musical-note:before{content:"\f332"}.ion-musical-notes:before{content:"\f333"}.ion-navigate:before{content:"\f334"}.ion-notifications:before{content:"\f338"}.ion-notifications-off:before{content:"\f336"}.ion-notifications-outline:before{content:"\f337"}.ion-nuclear:before{content:"\f339"}.ion-nutrition:before{content:"\f33a"}.ion-open:before{content:"\f33b"}.ion-options:before{content:"\f33c"}.ion-outlet:before{content:"\f33d"}.ion-paper:before{content:"\f33f"}.ion-paper-plane:before{content:"\f33e"}.ion-partly-sunny:before{content:"\f340"}.ion-pause:before{content:"\f341"}.ion-paw:before{content:"\f342"}.ion-people:before{content:"\f343"}.ion-person:before{content:"\f345"}.ion-person-add:before{content:"\f344"}.ion-phone-landscape:before{content:"\f346"}.ion-phone-portrait:before{content:"\f347"}.ion-photos:before{content:"\f348"}.ion-pie:before{content:"\f349"}.ion-pin:before{content:"\f34a"}.ion-pint:before{content:"\f34b"}.ion-pizza:before{content:"\f354"}.ion-planet:before{content:"\f356"}.ion-play:before{content:"\f357"}.ion-play-circle:before{content:"\f174"}.ion-podium:before{content:"\f358"}.ion-power:before{content:"\f359"}.ion-pricetag:before{content:"\f35a"}.ion-pricetags:before{content:"\f35b"}.ion-print:before{content:"\f35c"}.ion-pulse:before{content:"\f35d"}.ion-qr-scanner:before{content:"\f35e"}.ion-quote:before{content:"\f35f"}.ion-radio:before{content:"\f362"}.ion-radio-button-off:before{content:"\f360"}.ion-radio-button-on:before{content:"\f361"}.ion-rainy:before{content:"\f363"}.ion-recording:before{content:"\f364"}.ion-redo:before{content:"\f365"}.ion-refresh:before{content:"\f366"}.ion-refresh-circle:before{content:"\f228"}.ion-remove:before{content:"\f368"}.ion-remove-circle:before{content:"\f367"}.ion-remove-circle-outline:before{content:"\f176"}.ion-reorder:before{content:"\f369"}.ion-repeat:before{content:"\f36a"}.ion-resize:before{content:"\f36b"}.ion-restaurant:before{content:"\f36c"}.ion-return-left:before{content:"\f36d"}.ion-return-right:before{content:"\f36e"}.ion-reverse-camera:before{content:"\f36f"}.ion-rewind:before{content:"\f370"}.ion-ribbon:before{content:"\f371"}.ion-rocket:before{content:"\f179"}.ion-rose:before{content:"\f372"}.ion-sad:before{content:"\f373"}.ion-save:before{content:"\f1a9"}.ion-school:before{content:"\f374"}.ion-search:before{content:"\f375"}.ion-send:before{content:"\f376"}.ion-settings:before{content:"\f377"}.ion-share:before{content:"\f379"}.ion-share-alt:before{content:"\f378"}.ion-shirt:before{content:"\f37a"}.ion-shuffle:before{content:"\f37b"}.ion-skip-backward:before{content:"\f37c"}.ion-skip-forward:before{content:"\f37d"}.ion-snow:before{content:"\f37e"}.ion-speedometer:before{content:"\f37f"}.ion-square:before{content:"\f381"}.ion-square-outline:before{content:"\f380"}.ion-star:before{content:"\f384"}.ion-star-half:before{content:"\f382"}.ion-star-outline:before{content:"\f383"}.ion-stats:before{content:"\f385"}.ion-stopwatch:before{content:"\f386"}.ion-subway:before{content:"\f387"}.ion-sunny:before{content:"\f388"}.ion-swap:before{content:"\f389"}.ion-switch:before{content:"\f38a"}.ion-sync:before{content:"\f38b"}.ion-tablet-landscape:before{content:"\f38c"}.ion-tablet-portrait:before{content:"\f38d"}.ion-tennisball:before{content:"\f38e"}.ion-text:before{content:"\f38f"}.ion-thermometer:before{content:"\f390"}.ion-thumbs-down:before{content:"\f391"}.ion-thumbs-up:before{content:"\f392"}.ion-thunderstorm:before{content:"\f393"}.ion-time:before{content:"\f394"}.ion-timer:before{content:"\f395"}.ion-today:before{content:"\f17d"}.ion-train:before{content:"\f396"}.ion-transgender:before{content:"\f397"}.ion-trash:before{content:"\f398"}.ion-trending-down:before{content:"\f399"}.ion-trending-up:before{content:"\f39a"}.ion-trophy:before{content:"\f39b"}.ion-tv:before{content:"\f17f"}.ion-umbrella:before{content:"\f39c"}.ion-undo:before{content:"\f39d"}.ion-unlock:before{content:"\f39e"}.ion-videocam:before{content:"\f39f"}.ion-volume-high:before{content:"\f123"}.ion-volume-low:before{content:"\f131"}.ion-volume-mute:before{content:"\f3a1"}.ion-volume-off:before{content:"\f3a2"}.ion-walk:before{content:"\f3a4"}.ion-wallet:before{content:"\f18f"}.ion-warning:before{content:"\f3a5"}.ion-watch:before{content:"\f3a6"}.ion-water:before{content:"\f3a7"}.ion-wifi:before{content:"\f3a8"}.ion-wine:before{content:"\f3a9"}.ion-woman:before{content:"\f3aa"}#zym{position:absolute;top:62px;right:15px;background-color:rgba(255,255,255,0.9);box-sizing:border-box;width:400px;font-size:13px}#zym>div{margin:0 15px 15px 15px}#zym>div:first-child{margin-top:15px}#zym>div[name="path"]>span{cursor:default}#zym>div[name="path"]>span:not(:first-child):before{padding:0 8px;font-family:"Ionicons";content:"\f284";color:#09f}#zym>div[name="full"]{margin:0;padding:0}#zym>div>table{width:100%}#zym>div>table>tbody>tr{border-top:1px solid #bdf}#zym>div>table>tbody>tr:last-child{border-bottom:1px solid #bdf}#zym>div>table>tbody>tr.on{color:#000;background-color:#cbedff}#zym>div>table>tbody>tr.on>td:nth-child(1){color:#09f}#zym>div>table>tbody>tr.on>td:nth-child(1):before{content:"\f2b8"}#zym>div>table>tbody>tr>td{cursor:default;line-height:40px}#zym>div>table>tbody>tr>td:nth-child(1){text-align:left;padding-left:12px;color:#999;font-family:"Ionicons";font-size:120%}#zym>div>table>tbody>tr>td:nth-child(1):before{content:"\f380"}#zym>div>table>tbody>tr>td:nth-child(2){overflow:hidden;white-space:nowrap;text-overflow:"";word-wrap:normal;max-width:292px}#zym>div>table>tbody>tr>td:nth-child(2)>input{background-color:transparent;border:none;outline:none;width:100%}#zym>div>table>tbody>tr>td:nth-child(3){text-align:right;padding-right:12px}div.tamper{align-items:center;background-color:rgba(0,0,0,0.7);box-sizing:border-box;cursor:default;display:none;font-size:14px !important;height:100%;justify-content:center;left:0;position:fixed;top:0;text-align:left;width:100%;z-index:999999}div.tamper>div{background-color:white;box-sizing:border-box;padding:1em;width:360px}div.tamper>div.w2{padding:0;width:720px}div.tamper>div.w2>div{padding:10px 20px}div.tamper>div.w2>ul{margin:0;padding:0;display:flex;flex-wrap:wrap;justify-content:center;list-style-type:none;list-style-position:inside}div.tamper>div.w2>ul[id="vlist"]{height:460px;scrollbar-width:none}div.tamper>div.w2>ul[id="vlist"]::-webkit-scrollbar{display:none}div.tamper>div.w2>ul[id="vlist"]>li{width:160px;margin:0px;padding:0px 8px 16px 8px}div.tamper>div.w2>ul[id="vlist"]>li img.pic{display:block;width:160px;height:100px;margin-bottom:5px}div.tamper>div.w2>ul[id="vlist"]>li div.title{white-space:normal;line-height:1.25;display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical}div.tamper a{color:#333 !important;text-decoration:none}div.tamper h1{font-size:1.8rem;font-weight:400;margin:10px 0 20px 0;text-align:center}div.tamper form{display:block}div.tamper form>div{padding:0.5em 0}div.tamper form>div>div{margin:0.5em 0}div.tamper form>div>div:last-child{margin-bottom:0}div.tamper form label{color:#000}div.tamper form label:first-child{display:block;margin-bottom:0.5em}div.tamper form label:first-child:before{content:"\00bb";margin:0 0.25em}div.tamper form label:not(:first-child){display:inline}div.tamper form input{box-shadow:none;color:#000}div.tamper form input[type="text"]{background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:0.5em;width:100%}div.tamper form input[type="text"]:focus{border:1px solid #59c1f0}div.tamper form input[type="password"]{background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:0.5em;width:100%}div.tamper form input[type="password"]:focus{border:1px solid #59c1f0}div.tamper form input[type="radio"],div.tamper form input[type="checkbox"]{display:inline-block !important;height:1em;margin-right:0.25em;width:1em}div.tamper form input[type="checkbox"]{-webkit-appearance:checkbox !important}div.tamper form input[type="radio"]{-webkit-appearance:radio !important}div.tamper ul{margin:0;padding:0;list-style-type:none;list-style-position:inside;max-height:500px;overflow-y:auto;scrollbar-width:none}div.tamper ul>li{box-sizing:content-box;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0.25em 0;cursor:default}div.tamper ul>li.on{color:#f45a8d}div.summary{color:#666}div.btn-group{box-sizing:border-box;display:inline-flex}div.btn-group.full{display:flex}div.btn-group.outline>button{background-color:#fff;border:1px solid #ccc;color:#000}div.btn-group.outline>button:hover{color:#ffffff;background-color:#000;border-color:#000}div.btn-group.outline>button:not(:first-child){border-left:none}div.btn-group>button{background-color:#666;border-radius:0;border:none;color:#fff;display:inline-block;flex:1 1 auto;margin:0;outline:none;padding:0.5em 1.25em;position:relative;font-size:inherit}div.btn-group>button:hover{background-color:#000}div.btn-group>button:first-child{border-bottom-left-radius:0.25rem;border-top-left-radius:0.25rem}div.btn-group>button:last-child{border-bottom-right-radius:0.25rem;border-top-right-radius:0.25rem}.mt1{margin-top:10px !important}@keyframes spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.spinner{animation-name:spinner;animation-duration:2400ms;animation-timing-function:linear;animation-iteration-count:infinite}`), location.hostname.includes("bilibili.com")) if (GM_addStyle(String.raw`html,div.list-wrapper,div.section-ep-wrapper{scrollbar-width:thin}div.list-wrapper:-webkit-scrollbar,div.section-ep-wrapper:-webkit-scrollbar{display:none}`), ipod.defaults = {
    token: "",
    jsonrpc: "http://127.0.0.1:16800/jsonrpc",
    dir: "D:/HD2A",
    cdn: "upos-sz-mirrorks3.bilivideo.com",
    coin: 0,
    follow: 0
  }, ipod.aria2 = u.load("aria2", ipod.defaults), ipod.aria2.hasOwnProperty("cdn") || (ipod.aria2.cdn = "upos-sz-mirrorks3.bilivideo.com", u.save("aria2", ipod.aria2)), ipod.home = "https://121.5.226.51/bz", ipod.dtvip = 1e3 * (ipod.now + 9e4), ipod.dtpub = 0, ipod.latest = u.load("latest", 0), ipod.bzui = u.load("bzui"), ipod.sign = btoa(JSON.stringify(ipod.bzui)), ipod.zone = u.load("zone"), ipod.mid = document.cookie.includes("DedeUserID") ? Number.parseInt(u.strcut(document.cookie, "DedeUserID=", ";")) : 0, ipod.mid ? (setTimeout(() => {
    document.querySelector("div.logout") && u.cpdom(document.querySelector("div.logout > span")).addEventListener("click", () => {
      u.zdom(), GM_cookie.list({}, r => {
        r.forEach(t => {
          GM_cookie.delete(t);
        });
      }), location.href = "https://passport.bilibili.com/login";
    });
  }, 3e3), (null == ipod.bzui || ipod.mid != ipod.bzui.mid || ipod.now > ipod.latest) && (ipod.latest = ipod.now + 9e4, u.save("latest", ipod.latest), GM_cookie.list({}, r => {
    let arr = Array.isArray(r) && r.length ? u.cclean(r) : [];
    arr.length ? (arr.sort(), ipod.cookie = arr.join(";")) : setTimeout(() => {
      console.log("\u67e5\u8be2\u4e0d\u5230\u8d26\u53f7cookie\u4fe1\u606f");
    }, 5e3);
  }), fetch("https://api.bilibili.com/x/web-interface/nav", {
    method: "GET",
    mode: "cors",
    credentials: "include"
  }).then(r => r.json()).then(d => {
    ipod.bzui = 0 == d.code ? {
      mid: d.data.mid,
      level: d.data.level_info.current_level,
      vip: d.data.vipStatus,
      csrf: u.strcut(document.cookie, "bili_jct=", ";"),
      cookie: ipod.cookie
    } : null, null == ipod.bzui ? setTimeout(() => {
      console.clear(), console.log("\u67e5\u8be2\u4e0d\u5230\u8d26\u53f7\u57fa\u672c\u4fe1\u606f");
    }, 2e3) : (ipod.sign = btoa(JSON.stringify(ipod.bzui)), u.save("bzui", ipod.bzui));
  }), fetch("https://api.bilibili.com/x/web-interface/zone", {
    method: "GET",
    mode: "cors",
    credentials: "omit"
  }).then(r => r.json()).then(d => {
    0 == d.code && (ipod.zone = d.data, u.save("zone", ipod.zone));
  }))) : "passport.bilibili.com" == location.hostname || (location.href = "https://passport.bilibili.com/ajax/miniLogin/minilogin"), "space.bilibili.com" == location.hostname) {
    function urlplayer() {
      let dom = u.zdom(1).closest("a");
      if (ipod.idle) if (dom.getAttribute("href").includes("/video/BV")) {
        ipod.idle = 0;
        let bvid = u.strcut(dom.getAttribute("href"), "/video/");
        GM_xmlhttpRequest({
          url: `${ipod.home}/ajax?act=bangumi&bvid=${bvid}&version=${ipod.version}&sign=${ipod.sign}`,
          method: "GET",
          responseType: "json",
          onload(r) {
            ipod.idle = 1;
            let d = r.response;
            switch (d.code) {
             case 0:
              location.href = "https://www.bilibili.com/bangumi/play/ep" + d.message;
              break;
             case 999:
              u.urlopen(d.message);
              break;
             default:
              alert(d.message);
            }
          }
        });
      } else location.href = dom.getAttribute("href");
    }
    function vbangumi() {
      ipod.task = setInterval(() => {
        if (document.querySelector("#app")) {
          clearInterval(ipod.task);
          let dom = document.querySelector("div.video>div.content");
          dom && dom.addEventListener("click", urlplayer), (dom = document.querySelector("#submit-video-list")) && dom.addEventListener("click", urlplayer), (dom = document.querySelector("div.col-1")) && dom.addEventListener("click", urlplayer);
        }
      }, 1e3);
    }
    "11783021" == u.strcut(location.pathname, "/", "/") && (history.pushState = u.history("pushState"), unsafeWindow.addEventListener("pushState", vbangumi), history.replaceState = u.history("replaceState"), unsafeWindow.addEventListener("replaceState", vbangumi), vbangumi(), zproxy());
  } else if ("www.bilibili.com" == location.hostname) {
    function dp(name, hook) {
      let tmp;
      Object.defineProperty(unsafeWindow, name, {
        configurable: true,
        enumerable: true,
        get: () => tmp,
        set(val) {
          tmp = hook.call(null, val);
        }
      });
    }
    function dphook(obj) {
      return obj.initEpList && obj.initEpList.forEach(t => {
        t.epStatus = 2, t.status = 2, t.rights.allow_dm = 0, t.rights.allow_limit = 0;
      }), obj.epList && obj.epList.forEach(t => {
        t.epStatus = 2, t.status = 2, t.rights.allow_dm = 0, t.rights.allow_limit = 0;
      }), obj.epInfo && (obj.epInfo.epStatus = 2, obj.epInfo.status = 2, obj.epInfo.rights.allow_dm = 0, obj.epInfo.rights.area_limit = 0), obj.mediaInfo && (obj.mediaInfo.episodes && obj.mediaInfo.episodes.forEach(t => {
        t.epStatus = 2, t.status = 2, t.rights.allow_dm = 0, t.rights.allow_limit = 0;
      }), obj.mediaInfo.rigths && (obj.mediaInfo.rights.allowBp = false, obj.mediaInfo.rights.allowBpRank = false, obj.mediaInfo.rights.appOnly = false, obj.mediaInfo.rights.area_limit = 0, obj.mediaInfo.rights.canWatch = true), obj.mediaInfo.user_status && (obj.mediaInfo.user_status.area_limit = 0, obj.mediaInfo.user_status.ban_area_show = 0, obj.mediaInfo.user_status.sponsor = 0)), obj;
    }
    function dvideo(arr) {
      arr.forEach(t => {
        GM_xmlhttpRequest({
          url: `${ipod.home}/ajax?act=bvlink2&bvid=${t.bvid}&cid=${t.cid}&sign=${ipod.sign}`,
          method: "GET",
          responseType: "json",
          onload(r) {
            ipod.idx++, 0 == r.response.code && ipod.list.push({
              "use-header": "true",
              header: ipod.header,
              split: "16",
              dir: ipod.aria2.dir,
              out: t.out,
              url: [r.response.data.durl[0].url]
            }), ipod.idx == ipod.len && (ipod.idle = 1, document.querySelector("#zydl > i").removeAttribute("style"), u.aria2(ipod.list));
          }
        });
      });
    }
    function bvlist(str) {
      let dom = document.querySelector("#zylist");
      dom ? (dom.querySelector("div > ul").innerHTML = str, dom.setAttribute("style", "display: flex")) : (document.body.insertAdjacentHTML("beforeend", `<div id="zylist" class="tamper"><div><div class="btn-group full"><button name="cancel"> \u53d6\u6d88 </button><button name="all"> \u5168\u9009 </button><button name="invert"> \u53cd\u9009 </button><button name="download"><i class="ion-download"></i> \u4e0b\u8f7d </button></div><ul class="mt1">${str}</ul></div></div>`), document.querySelector("#zylist > div > ul").addEventListener("click", () => {
        let dom = u.zdom(1);
        dom.className = "on" == dom.className ? "" : "on";
      }), document.querySelector("#zylist > div > div.btn-group").addEventListener("click", () => {
        switch (u.zdom(1).getAttribute("name")) {
         case "cancel":
          document.querySelector("#zylist").setAttribute("style", "display: none"), document.querySelector("#zydl > i").removeAttribute("style");
          break;
         case "all":
          document.querySelectorAll("#zylist > div > ul > li").forEach(t => {
            t.className = "on";
          });
          break;
         case "invert":
          document.querySelectorAll("#zylist > div > ul > li").forEach(t => {
            t.className = "on" == t.className ? "" : "on";
          });
          break;
         default:
          let arr = [], list = [];
          document.querySelector("#zylist").setAttribute("style", "display: none"), document.querySelectorAll("#zylist > div > ul > li").forEach(t => {
            "on" == t.className && arr.push(Number.parseInt(t.getAttribute("name")));
          }), ipod.len = arr.length, "video" == ipod.vt && (ipod.vi.videoData.pages.forEach(t => {
            arr.includes(t.cid) && list.push({
              bvid: ipod.bvid,
              cid: t.cid,
              out: ipod.bvid + "/" + u.namefix(t.part.replaceAll("/", " ").replaceAll(/\s+/g, " ")) + ".flv"
            });
          }), dvideo(list)), "anime" == ipod.vt && (ipod.vi.epList.forEach(t => {
            arr.includes(t.cid) && list.push({
              bvid: t.bvid,
              cid: t.cid,
              out: ipod.title + "/" + (t.longTitle ? u.zero(t.title, 3) + " " + u.namefix(t.longTitle.replaceAll("/", " ").replaceAll(/\s+/g, " ")) : t.titleFormat) + ".flv"
            });
          }), dvideo(list));
        }
      }), document.querySelector("#zylist").setAttribute("style", "display: flex"));
    }
    function bvdl() {
      ipod.idle && (u.zdom(), document.querySelector("#zydl > i").setAttribute("style", "color: #fb7299"), ipod.header = ["User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36", "Referer: " + location.href], ipod.list = [], ipod.idx = 0, ipod.vi = unsafeWindow.__INITIAL_STATE__, ipod.vi.hasOwnProperty("videoData") && (ipod.vt = "video", ipod.bvid = ipod.vi.bvid, ipod.len = ipod.vi.videoData.pages.length, ipod.len > 1 ? bvlist(ipod.vi.videoData.pages.map(t => `<li name="${t.cid}">${t.part}</li>`).join("")) : dvideo(ipod.vi.videoData.pages.map(t => ({
        bvid: ipod.bvid,
        cid: t.cid,
        out: ipod.bvid + ".flv"
      })))), ipod.vi.hasOwnProperty("mediaInfo") && (ipod.vt = "anime", ipod.title = u.namefix(ipod.vi.mediaInfo.title.replaceAll("/", " ").replaceAll(/\s+/g, " ")), ipod.len = ipod.vi.epList.length, ipod.len > 1 ? bvlist(ipod.vi.epList.map(t => {
        let s = t.longTitle ? u.zero(t.title, 3) + " " + t.longTitle : t.titleFormat;
        return `<li name="${t.cid}">${s}</li>`;
      }).join("")) : dvideo(ipod.vi.epList.map(t => ({
        bvid: t.bvid,
        cid: t.cid,
        out: ipod.title + "/" + u.namefix(t.titleFormat.replaceAll("/", " ").replaceAll(/\s+/g, " ")) + ".flv"
      })))));
    }
    if (location.pathname.startsWith("/video")) {
      let bvid = location.pathname.substring(7, 19);
      fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`).then(r => r.json()).then(d => {
        switch (d.code) {
         case -404:
          GM_xmlhttpRequest({
            url: `${ipod.home}/ajax?act=bangumi&version=${ipod.version}&sign=${ipod.sign}&bvid=${bvid}`,
            method: "GET",
            responseType: "json",
            onload(r) {
              console.log("r = %o", r);
              let d = r.response;
              switch (console.log("d = %o", d), d.code) {
               case 0:
                location.href = "https://www.bilibili.com/bangumi/play/ep" + d.message;
                break;
               case 999:
                u.urlopen(d.message);
                break;
               default:
                alert(d.message);
              }
            }
          });
          break;
         default:
          ipod.task = setInterval(() => {
            document.querySelector("#app").hasAttribute("data-server-rendered") || (clearInterval(ipod.task), ipod.mid && setTimeout(() => {
              document.querySelector("#zydl") || (document.querySelector("#arc_toolbar_report > div.ops").insertAdjacentHTML("beforeend", '<span id="zydl" title="\u4e0b\u8f7d" style="margin-left: 30px"><i class="van-icon-download"></i>\u4e0b\u8f7d</span>'), document.querySelector("#zydl").addEventListener("click", bvdl), document.querySelector("#zydl").addEventListener("contextmenu", zset));
            }, 3e3));
          }, 3e3);
        }
      });
    }
    if (location.pathname.startsWith("/bangumi")) {
      function initbangumi() {
        let bvi = unsafeWindow.__INITIAL_STATE__;
        void 0 === bvi ? dp("__INITIAL_STATE__", dphook) : bvi = dphook(bvi);
      }
      history.pushState = u.history("pushState"), unsafeWindow.addEventListener("pushState", initbangumi), history.replaceState = u.history("replaceState"), unsafeWindow.addEventListener("replaceState", initbangumi), document.addEventListener("DOMContentLoaded", () => {
        if (null == document.querySelector("#app")) {
          let s = u.strcut(location.pathname, "/play/"), id = +s.match(/^(ep|ss)(\d+)/)[2], url = "https://bangumi.bilibili.com/view/web_api/season?" + (s.startsWith("ep") ? "ep_id=" : "season_id=") + id;
          fetch(url).then(r => r.json()).then(d => {
            if (0 == d.code) {
              let ep = s.startsWith("ep") ? d.result.episodes.find(t => t.ep_id == id) : d.result.episodes[0], eplist = JSON.stringify(d.result.episodes.map((t, idx) => (/^\d+(\.\d+)?$/.exec(t.index) ? t.titleFormat = "\u7b2c" + t.index + "\u8bdd " + t.index_title : (t.titleFormat = t.index, t.index_title = t.index), t.loaded = true, t.epStatus = t.episode_status, t.sectionType = 0, t.id = +t.ep_id, t.i = idx, t.link = "https://www.bilibili.com/bangumi/play/ep" + t.ep_id, t.title = t.index, t.rights = {
                allow_demand: 0,
                allow_dm: 0,
                allow_download: 0,
                area_limit: 0
              }, t))), obj = {
                id: ep.ep_id,
                aid: ep.aid,
                cid: ep.cid,
                bvid: ep.bvid,
                title: ep.index,
                titleFormat: titleForma = ep.index_title ? ep.index_title : "\u7b2c" + ep.index + "\u8bdd",
                htmlTitle: d.result.title,
                mediaInfoId: d.result.media_id,
                mediaInfoTitle: d.result.title,
                evaluate: d.result.evaluate.replace(/\n/g, "\\\n").replace(/"/g, '\\"').replace(/\r/g, "\\\r").replace(/\t/g, "\\\t").replace(/\b/g, "\\\b").replace(/\f/g, "\\\f"),
                cover: d.result.cover,
                episodes: eplist,
                ssId: d.result.season_id,
                appOnly: false
              }, doc = String.raw`<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="referrer" content="no-referrer-when-downgrade"><link rel="dns-prefetch" href="//s1.hdslb.com"><link rel="dns-prefetch" href="//s2.hdslb.com"><link rel="dns-prefetch" href="//s3.hdslb.com"><link rel="dns-prefetch" href="//i0.hdslb.com"><link rel="dns-prefetch" href="//i1.hdslb.com"><link rel="dns-prefetch" href="//i2.hdslb.com"><link rel="dns-prefetch" href="//static.hdslb.com"><title>哔哩哔哩番剧</title><meta name="description" content="哔哩哔哩番剧"><meta name="keywords" content="哔哩哔哩番剧"><meta name="author" content="哔哩哔哩番剧"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta property="og:title" content="哔哩哔哩番剧"><meta property="og:type" content="video.anime"><meta property="og:url" content="https://www.bilibili.com/bangumi/play/ss33577/"><meta property="og:image" content="https://i0.hdslb.com/bfs/archive/65dc2aa1781fbb507dbb7faef1d0a6169162ffed.jpg"><meta name="spm_prefix" content="666.25"><link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico"><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/pgcv/css/video.1.d78d6e85da752e622f857a963ae79be916fe4c01.css"><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/pgcv/css/video.0.d78d6e85da752e622f857a963ae79be916fe4c01.css"><script type="text/javascript" src="//s1.hdslb.com/bfs/static/player/main/video.70db8af8.js?v=20210111"></script><script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList",itemListElement:[{"@type":"VideoObject",position:1,name:"\u54d4\u54e9\u54d4\u54e9\u756a\u5267",url:"https://www.bilibili.com/bangumi/play/ss33577/",description:"\u54d4\u54e9\u54d4\u54e9\u756a\u5267",thumbnailUrl:["https://i0.hdslb.com/bfs/archive/65dc2aa1781fbb507dbb7faef1d0a6169162ffed.jpg"],uploadDate:"2006-04-06T11:26:00.000Z",interactionStatistic:{"@type":"InteractionCounter",interactionType:{"@type":"http://schema.org/WatchAction"},userInteractionCount:"786346"}}]}</script><style type="text/css">@font-face{font-family:"Ionicons";src:url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.eot?v=4.5.5#iefix") format("embedded-opentype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff2?v=4.5.5") format("woff2"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff?v=4.5.5") format("woff"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.ttf?v=4.5.5") format("truetype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.svg?v=4.5.5#Ionicons") format("svg");font-weight:normal;font-style:normal}i[class|=ion]{display:inline-block;font-family:"Ionicons";font-size:120%;font-style:normal;font-variant:normal;font-weight:normal;line-height:1;text-rendering:auto;text-transform:none;vertical-align:text-bottom;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased}.ion-android:before{content:"\f225"}.ion-angular:before{content:"\f227"}.ion-apple:before{content:"\f229"}.ion-bitbucket:before{content:"\f193"}.ion-bitcoin:before{content:"\f22b"}.ion-buffer:before{content:"\f22d"}.ion-chrome:before{content:"\f22f"}.ion-closed-captioning:before{content:"\f105"}.ion-codepen:before{content:"\f230"}.ion-css3:before{content:"\f231"}.ion-designernews:before{content:"\f232"}.ion-dribbble:before{content:"\f233"}.ion-dropbox:before{content:"\f234"}.ion-euro:before{content:"\f235"}.ion-facebook:before{content:"\f236"}.ion-flickr:before{content:"\f107"}.ion-foursquare:before{content:"\f237"}.ion-freebsd-devil:before{content:"\f238"}.ion-game-controller-a:before{content:"\f13b"}.ion-game-controller-b:before{content:"\f181"}.ion-github:before{content:"\f239"}.ion-google:before{content:"\f23a"}.ion-googleplus:before{content:"\f23b"}.ion-hackernews:before{content:"\f23c"}.ion-html5:before{content:"\f23d"}.ion-instagram:before{content:"\f23e"}.ion-ionic:before{content:"\f150"}.ion-ionitron:before{content:"\f151"}.ion-javascript:before{content:"\f23f"}.ion-linkedin:before{content:"\f240"}.ion-markdown:before{content:"\f241"}.ion-model-s:before{content:"\f153"}.ion-no-smoking:before{content:"\f109"}.ion-nodejs:before{content:"\f242"}.ion-npm:before{content:"\f195"}.ion-octocat:before{content:"\f243"}.ion-pinterest:before{content:"\f244"}.ion-playstation:before{content:"\f245"}.ion-polymer:before{content:"\f15e"}.ion-python:before{content:"\f246"}.ion-reddit:before{content:"\f247"}.ion-rss:before{content:"\f248"}.ion-sass:before{content:"\f249"}.ion-skype:before{content:"\f24a"}.ion-slack:before{content:"\f10b"}.ion-snapchat:before{content:"\f24b"}.ion-steam:before{content:"\f24c"}.ion-tumblr:before{content:"\f24d"}.ion-tux:before{content:"\f2ae"}.ion-twitch:before{content:"\f2af"}.ion-twitter:before{content:"\f2b0"}.ion-usd:before{content:"\f2b1"}.ion-vimeo:before{content:"\f2c4"}.ion-vk:before{content:"\f10d"}.ion-whatsapp:before{content:"\f2c5"}.ion-windows:before{content:"\f32f"}.ion-wordpress:before{content:"\f330"}.ion-xbox:before{content:"\f34c"}.ion-xing:before{content:"\f10f"}.ion-yahoo:before{content:"\f34d"}.ion-yen:before{content:"\f34e"}.ion-youtube:before{content:"\f34f"}.ion-add:before{content:"\f273"}.ion-add-circle:before{content:"\f272"}.ion-add-circle-outline:before{content:"\f158"}.ion-airplane:before{content:"\f15a"}.ion-alarm:before{content:"\f274"}.ion-albums:before{content:"\f275"}.ion-alert:before{content:"\f276"}.ion-american-football:before{content:"\f277"}.ion-analytics:before{content:"\f278"}.ion-aperture:before{content:"\f279"}.ion-apps:before{content:"\f27a"}.ion-appstore:before{content:"\f27b"}.ion-archive:before{content:"\f27c"}.ion-arrow-back:before{content:"\f27d"}.ion-arrow-down:before{content:"\f27e"}.ion-arrow-dropdown:before{content:"\f280"}.ion-arrow-dropdown-circle:before{content:"\f27f"}.ion-arrow-dropleft:before{content:"\f282"}.ion-arrow-dropleft-circle:before{content:"\f281"}.ion-arrow-dropright:before{content:"\f284"}.ion-arrow-dropright-circle:before{content:"\f283"}.ion-arrow-dropup:before{content:"\f286"}.ion-arrow-dropup-circle:before{content:"\f285"}.ion-arrow-forward:before{content:"\f287"}.ion-arrow-round-back:before{content:"\f288"}.ion-arrow-round-down:before{content:"\f289"}.ion-arrow-round-forward:before{content:"\f28a"}.ion-arrow-round-up:before{content:"\f28b"}.ion-arrow-up:before{content:"\f28c"}.ion-at:before{content:"\f28d"}.ion-attach:before{content:"\f28e"}.ion-backspace:before{content:"\f28f"}.ion-barcode:before{content:"\f290"}.ion-baseball:before{content:"\f291"}.ion-basket:before{content:"\f292"}.ion-basketball:before{content:"\f293"}.ion-battery-charging:before{content:"\f294"}.ion-battery-dead:before{content:"\f295"}.ion-battery-full:before{content:"\f296"}.ion-beaker:before{content:"\f297"}.ion-bed:before{content:"\f160"}.ion-beer:before{content:"\f298"}.ion-bicycle:before{content:"\f299"}.ion-bluetooth:before{content:"\f29a"}.ion-boat:before{content:"\f29b"}.ion-body:before{content:"\f29c"}.ion-bonfire:before{content:"\f29d"}.ion-book:before{content:"\f29e"}.ion-bookmark:before{content:"\f29f"}.ion-bookmarks:before{content:"\f2a0"}.ion-bowtie:before{content:"\f2a1"}.ion-briefcase:before{content:"\f2a2"}.ion-browsers:before{content:"\f2a3"}.ion-brush:before{content:"\f2a4"}.ion-bug:before{content:"\f2a5"}.ion-build:before{content:"\f2a6"}.ion-bulb:before{content:"\f2a7"}.ion-bus:before{content:"\f2a8"}.ion-business:before{content:"\f1a4"}.ion-cafe:before{content:"\f2a9"}.ion-calculator:before{content:"\f2aa"}.ion-calendar:before{content:"\f2ab"}.ion-call:before{content:"\f2ac"}.ion-camera:before{content:"\f2ad"}.ion-car:before{content:"\f2b2"}.ion-card:before{content:"\f2b3"}.ion-cart:before{content:"\f2b4"}.ion-cash:before{content:"\f2b5"}.ion-cellular:before{content:"\f164"}.ion-chatboxes:before{content:"\f2b6"}.ion-chatbubbles:before{content:"\f2b7"}.ion-checkbox:before{content:"\f2b9"}.ion-checkbox-outline:before{content:"\f2b8"}.ion-checkmark:before{content:"\f2bc"}.ion-checkmark-circle:before{content:"\f2bb"}.ion-checkmark-circle-outline:before{content:"\f2ba"}.ion-clipboard:before{content:"\f2bd"}.ion-clock:before{content:"\f2be"}.ion-close:before{content:"\f2c0"}.ion-close-circle:before{content:"\f2bf"}.ion-close-circle-outline:before{content:"\f166"}.ion-cloud:before{content:"\f2c9"}.ion-cloud-circle:before{content:"\f2c2"}.ion-cloud-done:before{content:"\f2c3"}.ion-cloud-download:before{content:"\f2c6"}.ion-cloud-outline:before{content:"\f2c7"}.ion-cloud-upload:before{content:"\f2c8"}.ion-cloudy:before{content:"\f2cb"}.ion-cloudy-night:before{content:"\f2ca"}.ion-code:before{content:"\f2ce"}.ion-code-download:before{content:"\f2cc"}.ion-code-working:before{content:"\f2cd"}.ion-cog:before{content:"\f2cf"}.ion-color-fill:before{content:"\f2d0"}.ion-color-filter:before{content:"\f2d1"}.ion-color-palette:before{content:"\f2d2"}.ion-color-wand:before{content:"\f2d3"}.ion-compass:before{content:"\f2d4"}.ion-construct:before{content:"\f2d5"}.ion-contact:before{content:"\f2d6"}.ion-contacts:before{content:"\f2d7"}.ion-contract:before{content:"\f2d8"}.ion-contrast:before{content:"\f2d9"}.ion-copy:before{content:"\f2da"}.ion-create:before{content:"\f2db"}.ion-crop:before{content:"\f2dc"}.ion-cube:before{content:"\f2dd"}.ion-cut:before{content:"\f2de"}.ion-desktop:before{content:"\f2df"}.ion-disc:before{content:"\f2e0"}.ion-document:before{content:"\f2e1"}.ion-done-all:before{content:"\f2e2"}.ion-download:before{content:"\f2e3"}.ion-easel:before{content:"\f2e4"}.ion-egg:before{content:"\f2e5"}.ion-exit:before{content:"\f2e6"}.ion-expand:before{content:"\f2e7"}.ion-eye:before{content:"\f2e9"}.ion-eye-off:before{content:"\f2e8"}.ion-fastforward:before{content:"\f2ea"}.ion-female:before{content:"\f2eb"}.ion-filing:before{content:"\f2ec"}.ion-film:before{content:"\f2ed"}.ion-finger-print:before{content:"\f2ee"}.ion-fitness:before{content:"\f1ac"}.ion-flag:before{content:"\f2ef"}.ion-flame:before{content:"\f2f0"}.ion-flash:before{content:"\f17e"}.ion-flash-off:before{content:"\f12f"}.ion-flashlight:before{content:"\f16b"}.ion-flask:before{content:"\f2f2"}.ion-flower:before{content:"\f2f3"}.ion-folder:before{content:"\f2f5"}.ion-folder-open:before{content:"\f2f4"}.ion-football:before{content:"\f2f6"}.ion-funnel:before{content:"\f2f7"}.ion-gift:before{content:"\f199"}.ion-git-branch:before{content:"\f2fa"}.ion-git-commit:before{content:"\f2fb"}.ion-git-compare:before{content:"\f2fc"}.ion-git-merge:before{content:"\f2fd"}.ion-git-network:before{content:"\f2fe"}.ion-git-pull-request:before{content:"\f2ff"}.ion-glasses:before{content:"\f300"}.ion-globe:before{content:"\f301"}.ion-grid:before{content:"\f302"}.ion-hammer:before{content:"\f303"}.ion-hand:before{content:"\f304"}.ion-happy:before{content:"\f305"}.ion-headset:before{content:"\f306"}.ion-heart:before{content:"\f308"}.ion-heart-dislike:before{content:"\f167"}.ion-heart-empty:before{content:"\f1a1"}.ion-heart-half:before{content:"\f1a2"}.ion-help:before{content:"\f30b"}.ion-help-buoy:before{content:"\f309"}.ion-help-circle:before{content:"\f30a"}.ion-help-circle-outline:before{content:"\f16d"}.ion-home:before{content:"\f30c"}.ion-hourglass:before{content:"\f111"}.ion-ice-cream:before{content:"\f30d"}.ion-image:before{content:"\f30e"}.ion-images:before{content:"\f30f"}.ion-infinite:before{content:"\f310"}.ion-information:before{content:"\f312"}.ion-information-circle:before{content:"\f311"}.ion-information-circle-outline:before{content:"\f16f"}.ion-jet:before{content:"\f315"}.ion-journal:before{content:"\f18d"}.ion-key:before{content:"\f316"}.ion-keypad:before{content:"\f317"}.ion-laptop:before{content:"\f318"}.ion-leaf:before{content:"\f319"}.ion-link:before{content:"\f22e"}.ion-list:before{content:"\f31b"}.ion-list-box:before{content:"\f31a"}.ion-locate:before{content:"\f31c"}.ion-lock:before{content:"\f31d"}.ion-log-in:before{content:"\f31e"}.ion-log-out:before{content:"\f31f"}.ion-magnet:before{content:"\f320"}.ion-mail:before{content:"\f322"}.ion-mail-open:before{content:"\f321"}.ion-mail-unread:before{content:"\f172"}.ion-male:before{content:"\f323"}.ion-man:before{content:"\f324"}.ion-map:before{content:"\f325"}.ion-medal:before{content:"\f326"}.ion-medical:before{content:"\f327"}.ion-medkit:before{content:"\f328"}.ion-megaphone:before{content:"\f329"}.ion-menu:before{content:"\f32a"}.ion-mic:before{content:"\f32c"}.ion-mic-off:before{content:"\f32b"}.ion-microphone:before{content:"\f32d"}.ion-moon:before{content:"\f32e"}.ion-more:before{content:"\f1c9"}.ion-move:before{content:"\f331"}.ion-musical-note:before{content:"\f332"}.ion-musical-notes:before{content:"\f333"}.ion-navigate:before{content:"\f334"}.ion-notifications:before{content:"\f338"}.ion-notifications-off:before{content:"\f336"}.ion-notifications-outline:before{content:"\f337"}.ion-nuclear:before{content:"\f339"}.ion-nutrition:before{content:"\f33a"}.ion-open:before{content:"\f33b"}.ion-options:before{content:"\f33c"}.ion-outlet:before{content:"\f33d"}.ion-paper:before{content:"\f33f"}.ion-paper-plane:before{content:"\f33e"}.ion-partly-sunny:before{content:"\f340"}.ion-pause:before{content:"\f341"}.ion-paw:before{content:"\f342"}.ion-people:before{content:"\f343"}.ion-person:before{content:"\f345"}.ion-person-add:before{content:"\f344"}.ion-phone-landscape:before{content:"\f346"}.ion-phone-portrait:before{content:"\f347"}.ion-photos:before{content:"\f348"}.ion-pie:before{content:"\f349"}.ion-pin:before{content:"\f34a"}.ion-pint:before{content:"\f34b"}.ion-pizza:before{content:"\f354"}.ion-planet:before{content:"\f356"}.ion-play:before{content:"\f357"}.ion-play-circle:before{content:"\f174"}.ion-podium:before{content:"\f358"}.ion-power:before{content:"\f359"}.ion-pricetag:before{content:"\f35a"}.ion-pricetags:before{content:"\f35b"}.ion-print:before{content:"\f35c"}.ion-pulse:before{content:"\f35d"}.ion-qr-scanner:before{content:"\f35e"}.ion-quote:before{content:"\f35f"}.ion-radio:before{content:"\f362"}.ion-radio-button-off:before{content:"\f360"}.ion-radio-button-on:before{content:"\f361"}.ion-rainy:before{content:"\f363"}.ion-recording:before{content:"\f364"}.ion-redo:before{content:"\f365"}.ion-refresh:before{content:"\f366"}.ion-refresh-circle:before{content:"\f228"}.ion-remove:before{content:"\f368"}.ion-remove-circle:before{content:"\f367"}.ion-remove-circle-outline:before{content:"\f176"}.ion-reorder:before{content:"\f369"}.ion-repeat:before{content:"\f36a"}.ion-resize:before{content:"\f36b"}.ion-restaurant:before{content:"\f36c"}.ion-return-left:before{content:"\f36d"}.ion-return-right:before{content:"\f36e"}.ion-reverse-camera:before{content:"\f36f"}.ion-rewind:before{content:"\f370"}.ion-ribbon:before{content:"\f371"}.ion-rocket:before{content:"\f179"}.ion-rose:before{content:"\f372"}.ion-sad:before{content:"\f373"}.ion-save:before{content:"\f1a9"}.ion-school:before{content:"\f374"}.ion-search:before{content:"\f375"}.ion-send:before{content:"\f376"}.ion-settings:before{content:"\f377"}.ion-share:before{content:"\f379"}.ion-share-alt:before{content:"\f378"}.ion-shirt:before{content:"\f37a"}.ion-shuffle:before{content:"\f37b"}.ion-skip-backward:before{content:"\f37c"}.ion-skip-forward:before{content:"\f37d"}.ion-snow:before{content:"\f37e"}.ion-speedometer:before{content:"\f37f"}.ion-square:before{content:"\f381"}.ion-square-outline:before{content:"\f380"}.ion-star:before{content:"\f384"}.ion-star-half:before{content:"\f382"}.ion-star-outline:before{content:"\f383"}.ion-stats:before{content:"\f385"}.ion-stopwatch:before{content:"\f386"}.ion-subway:before{content:"\f387"}.ion-sunny:before{content:"\f388"}.ion-swap:before{content:"\f389"}.ion-switch:before{content:"\f38a"}.ion-sync:before{content:"\f38b"}.ion-tablet-landscape:before{content:"\f38c"}.ion-tablet-portrait:before{content:"\f38d"}.ion-tennisball:before{content:"\f38e"}.ion-text:before{content:"\f38f"}.ion-thermometer:before{content:"\f390"}.ion-thumbs-down:before{content:"\f391"}.ion-thumbs-up:before{content:"\f392"}.ion-thunderstorm:before{content:"\f393"}.ion-time:before{content:"\f394"}.ion-timer:before{content:"\f395"}.ion-today:before{content:"\f17d"}.ion-train:before{content:"\f396"}.ion-transgender:before{content:"\f397"}.ion-trash:before{content:"\f398"}.ion-trending-down:before{content:"\f399"}.ion-trending-up:before{content:"\f39a"}.ion-trophy:before{content:"\f39b"}.ion-tv:before{content:"\f17f"}.ion-umbrella:before{content:"\f39c"}.ion-undo:before{content:"\f39d"}.ion-unlock:before{content:"\f39e"}.ion-videocam:before{content:"\f39f"}.ion-volume-high:before{content:"\f123"}.ion-volume-low:before{content:"\f131"}.ion-volume-mute:before{content:"\f3a1"}.ion-volume-off:before{content:"\f3a2"}.ion-walk:before{content:"\f3a4"}.ion-wallet:before{content:"\f18f"}.ion-warning:before{content:"\f3a5"}.ion-watch:before{content:"\f3a6"}.ion-water:before{content:"\f3a7"}.ion-wifi:before{content:"\f3a8"}.ion-wine:before{content:"\f3a9"}.ion-woman:before{content:"\f3aa"}div.tamper{align-items:center;background-color:rgba(0,0,0,0.7);box-sizing:border-box;cursor:default;display:none;font-size:14px !important;height:100%;justify-content:center;left:0;position:fixed;top:0;text-align:left;width:100%;z-index:999999}div.tamper>div{background-color:white;box-sizing:border-box;padding:1em;width:360px}div.tamper>div.w2{padding:0;width:720px}div.tamper>div.w2>div{padding:10px 20px}div.tamper>div.w2>ul{margin:0;padding:0;display:flex;flex-wrap:wrap;justify-content:center;list-style-type:none;list-style-position:inside}div.tamper>div.w2>ul[id=vlist]{height:468px;scrollbar-width:none}div.tamper>div.w2>ul[id=vlist]>li{width:160px;margin:0px;padding:0px 8px 16px 8px}div.tamper>div.w2>ul[id=vlist]>li img.pic{display:block;width:160px;height:100px;margin-bottom:5px}div.tamper>div.w2>ul[id=vlist]>li div.title{white-space:normal;line-height:1.25;display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical}div.tamper a{color:#333 !important;text-decoration:none}div.tamper h1{font-size:1.8rem;font-weight:400;margin:10px 0 20px 0;text-align:center}div.tamper form{display:block}div.tamper form>div{padding:0.5em 0}div.tamper form>div>div{margin:0.5em 0}div.tamper form>div>div:last-child{margin-bottom:0}div.tamper form label{color:#000}div.tamper form label:first-child{display:block;margin-bottom:0.5em}div.tamper form label:first-child:before{content:"\00bb";margin:0 0.25em}div.tamper form label:not(:first-child){display:inline}div.tamper form input{box-shadow:none;color:#000}div.tamper form input[type="text"]{background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:0.5em;width:100%}div.tamper form input[type="text"]:focus{border:1px solid #59c1f0}div.tamper form input[type="password"]{background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:0.5em;width:100%}div.tamper form input[type="password"]:focus{border:1px solid #59c1f0}div.tamper form input[type="radio"],div.tamper form input[type="checkbox"]{display:inline-block !important;height:1em;margin-right:0.25em;vertical-align:text-bottom;width:1em}div.tamper form input[type="checkbox"]{-webkit-appearance:checkbox !important}div.tamper form input[type="radio"]{-webkit-appearance:radio !important}div.tamper ul{margin:0;padding:0;list-style-type:none;list-style-position:inside;max-height:500px;overflow-y:auto;scrollbar-width:none}div.tamper ul>li{box-sizing:content-box;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0.25em 0;cursor:default}div.tamper ul>li.on{color:#f45a8d}div.summary{color:#666}div.btn-group{box-sizing:border-box;display:inline-flex}div.btn-group.full{display:flex}div.btn-group.outline>button{background-color:#fff;border:1px solid #ccc;color:#000}div.btn-group.outline>button:hover{color:#ffffff;background-color:#000;border-color:#000}div.btn-group.outline>button:not(:first-child){border-left:none}div.btn-group>button{background-color:#666;border-radius:0;border:none;color:#fff;display:inline-block;flex:1 1 auto;margin:0;outline:none;padding:0.5em 1.25em;position:relative;font-size:inherit}div.btn-group>button:hover{background-color:#000}div.btn-group>button:first-child{border-bottom-left-radius:0.25rem;border-top-left-radius:0.25rem}div.btn-group>button:last-child{border-bottom-right-radius:0.25rem;border-top-right-radius:0.25rem}.mt1{margin-top:10px !important}@keyframes spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.spinner{animation-name:spinner;animation-duration:2400ms;animation-timing-function:linear;animation-iteration-count:infinite}html,div.list-wrapper,div.section-ep-wrapper{scrollbar-width:thin}div.list-wrapper:-webkit-scrollbar,div.section-ep-wrapper:-webkit-scrollbar{display:none}</style></head><body class="" style="opacity:0"><script type="text/javascript">window.bid=13,window.spmReportData={},window.reportConfig={sample:1,scrollTracker:true,msgObjects:"spmReportData",errorTracker:true,hasAbtest:true,abtestPlatform:4};</script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/log/report/log-reporter.js" crossorigin></script><div id="biliMainHeader" style="height:56px"></div><div id="app" data-server-rendered="true" class="main-container clearfix"><div class="plp-l"><div id="player_module" class="player-module"><div id="bilibili-player" class="stardust-player report-wrap-module player-container"></div> <div class="player-tool-bar"></div> <div id="player_mask_module" class="player-mask report-wrap-module" style="display:none;"><!----> <!----> <!----> <!----> <!----> <!----> <!----> <div class="bar-wrapper"><div class="left-bar"></div><div class="right-bar"></div></div></div></div> <div class="media-wrapper"><h1 title="哔哩哔哩番剧">哔哩哔哩番剧</h1> <div id="toolbar_module" class="tool-bar clearfix report-wrap-module report-scroll-module"><div class="like-info"><i class="iconfont icon-like"></i><span>点赞</span> <div id="sanlin"></div> <!----> <!----> <!----></div> <div class="coin-info"><i class="iconfont icon-coins"></i><span>--</span></div> <div class="share-info"><i class="iconfont icon-share"></i><span>分享</span> <!----></div> <div class="mobile-info"><i class="iconfont icon-mobile-full"></i><span>用手机观看</span> <!----></div> <!----></div> <div id="media_module" class="media-info clearfix report-wrap-module"><a href="//www.bilibili.com/bangumi/media/md___mediaInfoId___/" target="_blank" class="media-cover"><!----></a> <div class="media-right"><a href="//www.bilibili.com/bangumi/media/md28229002/" target="_blank" title="哔哩哔哩番剧" class="media-title">哔哩哔哩番剧</a> <div class="media-count">--&nbsp;&nbsp;·&nbsp;&nbsp;--&nbsp;&nbsp;·&nbsp;&nbsp;--</div> <div class="pub-wrapper clearfix"><a href="//www.bilibili.com/anime/" target="_blank" class="home-link">番剧</a> <span class="pub-info">连载中</span> <!----> <!----></div> <a href="//www.bilibili.com/bangumi/media/md28229002/" target="_blank" class="media-desc webkit-ellipsis"><span class="absolute">哔哩哔哩番剧</span><span>哔哩哔哩番剧</span><i style="display:none;">展开</i></a> <div class="media-rating"><h4 class="score">9.7</h4> <p>1368人评分</p></div> <div class="media-tool-bar clearfix"><div report-id="click_review_publish" class="btn-rating"><ul class="star-wrapper clearfix"><li><i class="iconfont icon-star-empty"></i> <!----></li><li><i class="iconfont icon-star-empty"></i> <!----></li><li><i class="iconfont icon-star-empty"></i> <!----></li><li><i class="iconfont icon-star-empty"></i> <!----></li><li><i class="iconfont icon-star-empty"></i> <!----></li></ul><span>点评</span></div> <div report-id="click_follow" class="btn-follow"><i class="iconfont icon-follow"></i><span>追番</span> <div class="bangumi-options clearfix"><ul class="opt-list"><li>标记为 想看</li> <li>标记为 在看</li> <li>标记为 已看</li> <li>取消追番</li></ul></div></div></div></div></div></div> <div id="review_module" class="review-module report-wrap-module report-scroll-module"><div class="module-title clearfix"><h4>点评</h4> <a href="//www.bilibili.com/bangumi/media/md28229002/" target="_blank" class="more-link">查看全部</a></div> <div class="review-list"><div class="review-item"><div class="review-empty pre-mask"></div> <!----></div><div class="review-item"><div class="review-empty pre-mask"></div> <!----></div><div class="review-item"><div class="review-empty pre-mask"></div> <!----></div> <!----></div></div> <!----> <div id="comment_module" class="comment-wrapper common report-wrap-module report-scroll-module" style="display:;"><div class="b-head"><span class="results"></span><span>评论</span></div> <div class="comm"></div></div></div> <div class="plp-r"><div id="paybar_module" class="pay-bar report-wrap-module pre-mask" style="display:none;"><!----> <!----> <!----> <!----> <!----> <!----></div> <div id="danmukuBox" class="danmaku-box" style="display:;"><div class="danmaku-wrap"></div></div> <div id="eplist_module" class="ep-list-wrapper report-wrap-module"><div class="list-title clearfix"><h4 title="选集">选集</h4> <span class="mode-change" style="position:relative"><i report-id="click_ep_switch" class="iconfont icon-ep-list-simple"></i> <!----></span> <!----> <span class="ep-list-progress">1/220</span></div> <div class="list-wrapper simple" style="display:none;"><ul class="clearfix" style="height:50px;"></ul></div></div>  <div class="omit-hint" style="display:none;">部分集数受地区限制不予展示</div> <!----> <div id="recom_module" class="recom-wrapper report-wrap-module report-scroll-module"><div class="recom-title">相关推荐</div> <div class="recom-list"><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div></div> <!----></div></div> <div class="nav-tools" style="display:none;"><div title="返回顶部" class="tool-item backup iconfont icon-up"></div> <!----> <a title="帮助反馈" href="//www.bilibili.com/blackboard/help.html#常见问题自救方法?id=c9954d53034d43d796465e24eb792593" target="_blank"><div class="tool-item help iconfont icon-customer-serv"></div></a></div> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----></div><script>const vipExpire=Date.now()+9e7;window.__PGC_USERSTATE__={area_limit:1,ban_area_show:1,follow:0,follow_status:2,login:1,pay:0,pay_pack_paid:0,sponsor:0,vip_info:{due_date:vipExpire,status:1,type:2}},window.__BILI_CONFIG__={show_bv:true};</script><script>window.__INITIAL_STATE__={"loginInfo":{},"isLogin":false,"couponSelected":null,"payGlobal":null,"loaded":true,"ver":{},"ssr":{},"h1Title":"哔哩哔哩番剧","mediaInfo":{"stat":{"coins":3444,"danmakus":8325,"favorites":75951,"likes":0,"reply":2614,"share":515,"views":786346},"id":___mediaInfoId___,"ssId":___ssId___,"title":"___mediaInfoTitle___","jpTitle":"","series":"哔哩哔哩番剧","alias":"","evaluate":"___evaluate___","ssType":1,"ssTypeFormat":{"name":"番剧","homeLink":"\u002F\u002Fwww.bilibili.com\u002Fanime\u002F"},"status":2,"multiMode":true,"forceWide":false,"specialCover":"","squareCover":"\u002F\u002Fi0.hdslb.com\u002Fbfs\u002Fbangumi\u002Fimage\u002Ff22bfaf955d4938d426029582fdd2303e6844a09.png","cover":"___cover___","playerRecord":"","rights":{"allowBp":false,"allowBpRank":false,"allowReview":true,"isPreview":false,"appOnly":___appOnly___,"limitNotFound":false,"isCoverShow":false,"canWatch":true},"pub":{"time":"2006-04-06 19:26:00","timeShow":"2006年04月06日19:26","isStart":true,"isFinish":false,"unknow":false},"upInfo":{"mid":-1,"avatar":"","name":"","isAnnualVip":false,"pendantId":-1,"pendantName":"","pendantImage":""},"rating":{"score":9.7,"count":1368},"newestEp":{"id":331925,"desc":"连载中","isNew":false},"payMent":{"tip":"","promotion":"","vipProm":"","vipFirstProm":"","discount":1,"vipDiscount":1,"sixType":{"allowTicket":false,"allowTimeLimit":false,"allowDiscount":false,"allowVipDiscount":false}},"payPack":{"title":"","appNoPayText":"","appPayText":"","url":""},"activity":{"id":0,"title":"","pendantOpsImg":"","pendantOpsLink":""},"count":{"coins":0,"danmus":0,"follows":0,"views":0,"likes":0},"pgcType":"anime","epSpMode":true,"newEpSpMode":false,"mainSecTitle":"选集","premiereInfo":{},"sectionBottomDesc":""},"epList":___episodes___,"epInfo":{"loaded":true,"id":___id___,"badge":"","badgeType":0,"badgeColor":"#999999","epStatus":2,"aid":___aid___,"bvid":"___bvid___","cid":___cid___,"from":"bangumi","cover":"\u002F\u002Fi0.hdslb.com\u002Fbfs\u002Farchive\u002F65dc2aa1781fbb507dbb7faef1d0a6169162ffed.jpg","title":"___title___","titleFormat":"___titleFormat___","vid":"","longTitle":"","hasNext":true,"i":0,"sectionType":0,"releaseDate":"","skip":{},"hasSkip":false,"rights":{"allow_demand":0,"allow_dm":0,"allow_download":0,"area_limit":1},"stat":{}},"sections":[],"orderSections":[],"ssList":[{"id":33577,"title":"TV","type":1,"pgcType":"anime","cover":"\u002F\u002Fi0.hdslb.com\u002Fbfs\u002Fbangumi\u002Fimage\u002Fed473b3c6ccc653074e66a3f586bb960c25a9707.png","epCover":"\u002F\u002Fi0.hdslb.com\u002Fbfs\u002Farchive\u002F5dae515b205b46feb2f69c0f2f79f95c1ca234d8.png","desc":"更新至第2话","badge":"","badgeType":0,"badgeColor":"#FB7299","views":786346,"follows":75946}],"userState":{"loaded":false,"vipInfo":{},"history":{}},"ssPayMent":{},"epPayMent":null,"player":{"loaded":false,"miniOn":false,"limitType":0},"sponsor":{"allReady":false,"allState":0,"allRank":[],"allMine":null,"allCount":0,"weekReady":false,"weekState":0,"weekRank":[],"weekMine":null,"weekCount":0},"ssRecom":{"status":"loading","data":[]},"showBv":false,"interact":{"shown":false,"btnText":"","callback":null},"nextEp":null,"playerEpList":{"code":0,"message":"","result":{"main_section":{"episodes":[]}}},"isOriginal":false,"premiereCountDown":"","premiereStatus":{},"premiereEp":{},"likeMap":{},"uperMap":{},"hasPlayableEp":false,"insertScripts":["\u002F\u002Fs1.hdslb.com\u002Fbfs\u002Fstatic\u002Fpgcv\u002F1.video.d78d6e85da752e622f857a963ae79be916fe4c01.js","\u002F\u002Fs1.hdslb.com\u002Fbfs\u002Fstatic\u002Fpgcv\u002Fvideo.d78d6e85da752e622f857a963ae79be916fe4c01.js"]};</script><script>if(window.__INITIAL_STATE__){var jsUrls=window.__INITIAL_STATE__.insertScripts||[];function insertLink(){for(var e=["//static.hdslb.com/phoenix/dist/css/comment.min.css?v="+Date.now(),"//pay.bilibili.com/paysdk/bilipay.css"],i=0;i<e.length;i++){var t=document.createElement("link");t.rel="stylesheet",t.type="text/css",t.href=e[i],document.body.appendChild(t)}}function insertScript(){if(!(window.scriptIsInject||jsUrls[0]&&-1<window.document.body.innerHTML.indexOf(jsUrls[0]))){window.scriptIsInject=!0,window.jQuery||jsUrls.unshift("//static.hdslb.com/js/jquery.min.js"),window.Promise||jsUrls.unshift("//static.hdslb.com/js/promise.auto.min.js"),jsUrls.push("//s1.hdslb.com/bfs/static/ogv/fe/iris.min.js?v=20210112.1");for(var e=0;e<jsUrls.length;e++){loadScript(jsUrls[e])}}}function loadScript(e,i){var t=document.createElement("script");t.type="text/javascript",-1==(t.src=e).indexOf("jquery")&&-1==e.indexOf("promise")&&(t.crossOrigin="true"),document.body.appendChild(t),t.onload=function(){i&&i()}}var ep=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.epInfo,md=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.mediaInfo;function getCookie(e){var i=new RegExp("(^| )"+e+"=([^;]*)(;|$)"),t=document.cookie.match(i);return t?unescape(t[2]):null}function setSize(){var e=md.specialCover?1070:1280,i=350,t=window.innerHeight||document.documentElement.clientHeight,o=window.innerWidth||window.document.documentElement.clientWidth,n=Math.round(md.specialCover?16*(t-264)/9-i:16*(0.743*t-108.7)/9),d=o-152-i,s=d<n?d:n;s<638&&(s=638),e<s&&(s=e);var a=s+i,r=o<a+152,l=document.querySelector(".main-container");if(l.style.width=(r?a+76:a)+"px",l.style.paddingLeft=(r?76:0)+"px",l.style.marginLeft=r?"0":"",l.style.marginRight=r?"0":"",md.specialCover){var p=Math.round(9*a/16+46);(y=document.querySelector("#player_module")).style.height=p+"px",y.style.width=a+"px",y.style.paddingLeft="",y.style.left=r?"76px":"",y.style.transform=r?"none":"",y.style.webkitTransform=r?"none":"";var _=document.querySelector(".special-cover"),w=document.querySelector(".plp-l"),c=document.querySelector(".plp-r"),m=document.querySelector("#danmukuBox");_.style.height=p+218+"px",w.style.paddingTop=p+24+"px",c.style.marginTop=p+40+"px",window.isWide?(m.style.top="0px",m.style.position="relative"):(m.style.top=-(p+40)+"px",m.style.position="absolute")}else{var u=parseInt(9*(s+(window.isWide?i:0))/16)+46+(window.hasBlackSide&&!window.isWide?96:0);if((m=document.querySelector("#danmukuBox")).style.top="",window.isWide){(y=document.querySelector("#player_module")).style.height=u-0+"px",y.style.width="",y.style.paddingLeft=r?"76px":"",y.style.left="",y.style.transform="",y.style.webkitTransform="";w=document.querySelector(".plp-l"),c=document.querySelector(".plp-r");w.style.paddingTop=u-0+"px",c.style.marginTop=u+16+"px"}else{var y;(y=document.querySelector("#player_module")).style.height=u-0+"px",y.style.width="",y.style.paddingLeft="",y.style.left="",y.style.transform="",y.style.webkitTransform="";w=document.querySelector(".plp-l"),c=document.querySelector(".plp-r");w.removeAttribute("style"),c.removeAttribute("style")}}}if(window.isWide=md.forceWide||!!md.specialCover||!md.multiMode,window.hasBlackSide=Boolean(parseInt(getCookie("blackside_state"))),window.PlayerAgent={player_widewin:function(){window.isWide=!0,setSize()},player_fullwin:function(){window.isWide=!1,setSize()},toggleBlackSide:function(e){window.hasBlackSide=e,setSize()}},setSize(),window.document.body.style.opacity="",window.addEventListener("resize",setSize),!(ep&&ep.loaded&&-1<ep.id)||md.rights.appOnly||md.premiereInfo&&md.premiereInfo.epid===ep.id){insertScript()}else{var r=function(s){window.pgcPlayerLoaded=!0;var e=window.__PGC_USERSTATE__.vip_info||{},a=window.__PGC_USERSTATE__.login&&(1===window.__PGC_USERSTATE__.pay||1===window.__PGC_USERSTATE__.sponsor||1===window.__PGC_USERSTATE__.pay_pack_paid||0!==e.type&&1===e.status);window.playerCallback=function(){window.jwTimer=setInterval(function(){var e=window.document.querySelector("#player_placeholder");"function"==typeof e.jwAddEventListener&&(e.jwAddEventListener("jwplayerMediaComplete","function(){ window.showPreviewMask();}"),clearInterval(window.jwTimer))},1000);var e=function(){window.player&&"function"==typeof window.player.addEventListener&&(window.player.addEventListener("video_media_play",function(){window.hadVideoPlay=!0}),window.player.addEventListener("video_media_seek",function(){window.hadVideoPlay=!0}),clearInterval(window.vMediaPTimer))};window.vMediaPTimer=setInterval(e,1000),e()},window.getPlayerExtraParams=function(){var e=window.__PGC_USERSTATE__.paster||{},i=ep.skip||{},t=window.__PGC_USERSTATE__.progress||{last_ep_id:-1},o=!1;o=!window.hadVideoPlay&&(t.last_ep_id<0&&!t.last_ep_index&&!t.last_time);var n=window.__PGC_USERSTATE__&&window.__PGC_USERSTATE__.epsToastType,d=window.__PGC_USERSTATE__&&window.__PGC_USERSTATE__.toastTypeMap;return{title:ep.longTitle?ep.titleFormat+" "+ep.longTitle:ep.titleFormat,mediaTitle:md.title,epTitle:ep.longTitle,epIndex:ep.titleFormat,epCover:ep.cover,epStat:ep.epStatus||md.status,squarePic:md.squareCover||"//static.hdslb.com/images/square-cover-default.png",record:0!==ep.sectionType?"":md.playerRecord?encodeURIComponent(md.playerRecord):"",shareText:window.__INITIAL_STATE__.h1Title+" #哔哩哔哩#",sharePic:md.cover,shareUrl:"//www.bilibili.com/bangumi/play/ss"+md.ssId+"/",isStart:md.pub.isStart||!md.rights.canWatch&&0!==ep.sectionType,isPreview:md.rights.isPreview&&s,allowTicket:md.payMent.sixType.allowTicket,deadLineToast:md.payMent.sixType.allowTimeLimit&&!s&&window.__PGC_USERSTATE__.dead_line?window.__PGC_USERSTATE__.dead_line:undefined,canPlay1080:a,allowSponsor:md.rights.allowBp,multiMode:md.multiMode,epNeedPay:s,isFollow:1===window.__PGC_USERSTATE__.follow,canWatch:md.rights.canWatch,sponsorWeekList:[],sponsorTotalList:[],sponsorCount:0,danmakuListOffset:md.specialCover?0:64,paster:{aid:ep.aid||0,cid:e.aid||0,type:e.type||0,duration:e.duration||0,allow_jump:e.allow_jump||0,url:e.url?e.url:""},pubTime:md.pub.timeShow,recommend:[],epList:{},nextEp:null,headTail:{first:!!window.__PGC_USERSTATE__.login&&o,op:[i.op&&i.op.start||0,i.op&&i.op.end||0],ed:[i.ed&&i.ed.start||0,i.ed&&i.ed.end||0],hasSkip:ep.hasSkip||!1},whitelistToast:n&&d&&"white_can_watch"===n[ep.id]&&d[n[ep.id]]&&d[n[ep.id]].text_info,preSaleToast:n&&d&&"presell"===n[ep.id]&&d[n[ep.id]]&&d[n[ep.id]].text_info}};var i,t,o;if("bangumi"===ep.from){var n=(i=new RegExp("(^|&)"+"t"+"=([^&|^#]*)(&|#|$)"),t=window.location.href.split("?"),null!==(o=(1<t.length?t[1]:"").match(i))?unescape(o[2]):""),d=window.__PGC_USERSTATE__.progress||{},r=d.last_time||0,l=-1<d.last_ep_id?d.last_ep_id:undefined,p=encodeURIComponent("module="+(2!==md.ssType?"bangumi":"movie")+"&season_type="+md.ssType),_=(1===(e=window.__PGC_USERSTATE__.vipInfo||{}).type||2===e.type)&&1===e.status,w=window.__PGC_USERSTATE__.paster||{},c=!_&&1!==window.__PGC_USERSTATE__.pay&&1!==window.__PGC_USERSTATE__.sponsor&&w.cid&&0<w.cid?1:undefined,m=window.__BILI_CONFIG__&&window.__BILI_CONFIG__.show_bv&&ep.bvid?"&bvid="+ep.bvid+"&show_bv=1":"",u="cid="+ep.cid+"&aid="+ep.aid+m+"&season_type="+md.ssType+(r?"&lastplaytime="+1000*r:"")+(l?"&last_ep_id="+l:"")+(c?"&pre_ad=1":"")+"&has_next="+(ep.hasNext?1:"")+(window.isWide?"&as_wide=1":"")+"&player_type="+(2!==md.ssType?1:2)+"&urlparam="+p+"&seasonId="+md.ssId+"&episodeId="+ep.id+"&record="+(0!==ep.sectionType?"":md.playerRecord?encodeURIComponent(md.playerRecord):"")+"&t="+n+(ep.attribute?"&attribute="+ep.attribute:"");window.EmbedPlayer("player","//static.hdslb.com/play.swf",u,"","",window.playerCallback)}else{(window.document.querySelector("#bilibili-player")||window.document.querySelector("#bofqi")).innerHTML='<embed height="100%" width="100%" src="//static.hdslb.com/tc.swf" type="application/x-shockwave-flash" pluginspage="//www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" quality="high" flashvars="bili-cid='+ep.cid+"&amp;bili-aid="+ep.aid+"&amp;vid="+ep.vid+'" allowfullscreen="true">'}},promiseArr=[];if(window.__PGC_USERSTATE__){startPlayer()}else{var cnt=0;function t(){new Promise(function(e){window.$.ajax({url:"//api.bilibili.com/pgc/view/web/season/user/status",type:"get",dataType:"json",xhrFields:{withCredentials:!0},data:{season_id:md.ssId,ts:(new Date).getTime()},success:function(e){0===e.code?window.__PGC_USERSTATE__=e.result||{}:window.__PGC_USERSTATE__={}}}).always(e)}).then(function(){startPlayer()})}window.jQuery||(cnt+=1,loadScript("//static.hdslb.com/js/jquery.min.js",function(){0==--cnt&&t()})),window.Promise||(cnt+=1,loadScript("//static.hdslb.com/js/promise.auto.min.js",function(){0==--cnt&&t()}))}function startPlayer(){var e=!1,i=!0,t=!1;window.__INITIAL_STATE__.sections.forEach(function(e){0<e.epList.length&&(t=!0)});var o=window.__PGC_USERSTATE__.vipInfo||{},n=o&&(1===o.type||2===o.type)&&1===o.status,d=!(6!==ep.epStatus&&7!==ep.epStatus&&13!==ep.epStatus||window.__PGC_USERSTATE__.login&&n),s=12===ep.epStatus&&(!window.__PGC_USERSTATE__.login||1!==window.__PGC_USERSTATE__.pay_pack_paid),a=ep.rights&&ep.rights.allow_demand&&window.__PGC_USERSTATE__.demand&&window.__PGC_USERSTATE__.demand.no_pay_epids&&-1!==window.__PGC_USERSTATE__.demand.no_pay_epids.indexOf(ep.id);if(1!==window.__PGC_USERSTATE__.pay&&(d||8===ep.epStatus||9===ep.epStatus||s)&&(e=!0),a||14===ep.epStatus?e=!0:md.pub.isStart||0!==window.__INITIAL_STATE__.epList.length||t?md.rights.isPreview&&!ep.attribute&&(0<window.__INITIAL_STATE__.epList.length||t)?i=!0:e&&(i=!1):i=!1,i){if("bangumi"===ep.from){var l=setTimeout(function(){clearTimeout(l),window.PlayerMediaLoaded=undefined,insertScript()},4000);window.PlayerMediaLoaded=function(){clearTimeout(l),window.performance&&window.performance.timing&&(window.performance.timing.firstscreenfinish=window.performance.timing.playerStage3||(new Date).getTime()),insertScript(),window.PlayerMediaLoaded=undefined}}else{insertScript()}r(e)}else{insertScript()}}}};</script></body></html>`;
              document.open(), document.write(doc.replaceAll(/___(\w+)___/g, (mat, name) => obj[name])), document.close();
            }
          });
        }
        ipod.task = setInterval(() => {
          if (document.querySelector("#app")) {
            clearInterval(ipod.task), setTimeout(() => {
              GM_xmlhttpRequest({
                url: `${ipod.home}/vlist.json?t=${ipod.now}`,
                method: "GET",
                responseType: "json",
                nocache: true,
                onload(r) {
                  let d1 = r.response;
                  Array.isArray(d1) && d1.length && d1.forEach(vi => {
                    fetch("https://api.bilibili.com/x/web-interface/archive/stat?bvid=" + vi.bvid, {
                      method: "GET",
                      mode: "cors",
                      credentials: "include"
                    }).then(r => r.json()).then(d2 => {
                      0 == d2.code && (vi.like = d2.data.like - vi.like1, vi.view = d2.data.view - vi.view1, vi.num > vi.like && (0 == vi.num2 || Math.ceil(100 * vi.num / vi.num2) >= Math.round(100 * vi.like / vi.view)) && fetch("https://api.bilibili.com/x/web-interface/archive/relation?aid=" + vi.aid + "&bvid=" + vi.bvid, {
                        method: "GET",
                        mode: "cors",
                        credentials: "include"
                      }).then(r => r.json()).then(d3 => {
                        0 == d3.code && 0 == d3.data.like && fetch("https://api.bilibili.com/x/web-interface/archive/like", {
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                          },
                          method: "POST",
                          mode: "cors",
                          credentials: "include",
                          body: u.serialize({
                            aid: vi.aid,
                            like: 1,
                            csrf: ipod.bzui.csrf
                          })
                        });
                      }));
                    });
                  });
                }
              });
            }, 9e4), document.querySelector("#bvchk") || setTimeout(() => {
              let dom = document.querySelector("#toolbar_module");
              dom.querySelector("div.watch-info") && dom.querySelector("div.watch-info").remove(), dom.querySelector("div.mobile-info") && dom.querySelector("div.mobile-info").remove(), dom.insertAdjacentHTML("beforeend", '<div class="coin-info" style="float:right;margin-right:auto"><i id="bvchk" class="iconfont icon-bili" style="font-size:24px;width:auto"></i></div><div id="zydl" class="coin-info"><i class="iconfont icon-download"></i><span>\u4e0b\u8f7d</span></div>'), document.querySelector("#zydl").addEventListener("click", bvdl), document.querySelector("#zydl").addEventListener("contextmenu", zset), document.querySelector("#bvchk").addEventListener("click", () => {
                if (ipod.bzui) {
                  let cid = unsafeWindow.__INITIAL_STATE__.epInfo.cid;
                  cid && GM_xmlhttpRequest({
                    url: `${ipod.home}/ajax?act=bvfix&cid=${cid}&version=${ipod.version}&sign=${ipod.sign}`,
                    method: "GET",
                    responseType: "json",
                    onload(r) {
                      let d = r.response;
                      switch (d.code) {
                       case 0:
                        location.reload();
                        break;
                       case 999:
                        u.urlopen(d.message);
                        break;
                       default:
                        alert(d.message);
                      }
                    }
                  });
                } else alert("1. \u5982\u679c\u672a\u767b\u5f55\u54d4\u54e9\u54d4\u54e9\u8d26\u53f7\u8bf7\u5148\u767b\u5f55\u5e76\u5237\u65b0\u9875\u9762\n2. \u8bf7\u66f4\u6362\u811a\u672c\u7ba1\u7406\u5668\u4e3aTamperMonkey Beta\uff08\u7ea2\u7334\uff09");
              }), document.querySelector("#bvchk").addEventListener("contextmenu", () => {
                u.zdom(), document.querySelector("#bvset") ? (u.zform("#bvset input", ipod.aria2), document.querySelector("#bvset").setAttribute("style", "display:flex")) : (document.body.insertAdjacentHTML("beforeend", '<div class="tamper" id="bvset"><div><form><div><label>\u8282\u70b9\u9009\u62e9</label><input name="cdn" type="radio" value="upos-sz-mirrorks3.bilivideo.com"><label>\u5e7f\u4e1c\u7535\u4fe1 &nbsp; </label><input name="cdn" type="radio" value="upos-sz-mirrorkodo.bilivideo.com"><label>\u6c5f\u82cf\u7535\u4fe1 &nbsp; </label><input name="cdn" type="radio" value="upos-sz-mirrorcos.bilivideo.com"><label>\u5c71\u4e1c\u8054\u901a &nbsp; </label></div><div><label>\u52a0\u5165\u6c34\u519b</label><input name="coin" type="checkbox" value="1"><label>\u6388\u6743\u811a\u672c\u53ef\u8fdb\u884c\u4e00\u952e\u4e09\u8fde\u64cd\u4f5c</label></div><div><input name="follow" type="checkbox" value="1"><label>\u6388\u6743\u811a\u672c\u53ef\u8fdb\u884c\u5173\u6ce8UP\u64cd\u4f5c</label></div><div id="info1" class="summary"></div><div class="btn-group"><button type="button"><i class="ion-close"></i> \u53d6\u6d88</button><button type="submit"><i class="ion-checkmark"></i> \u786e\u5b9a</button></div></form></div></div>'), u.zform("#bvset input", ipod.aria2), document.querySelector("#bvset button[type=button]").addEventListener("click", () => {
                  u.zdom(), document.querySelector("#bvset").setAttribute("style", "display: none");
                }), document.querySelector("#bvset form").addEventListener("submit", () => {
                  let dom = u.zdom(), d = new FormData(dom);
                  ipod.aria2 = Object.assign({}, ipod.defaults, Object.fromEntries(d.entries())), u.save("aria2", ipod.aria2), document.querySelector("#bvset").setAttribute("style", "display: none"), GM_xmlhttpRequest({
                    url: `${ipod.home}/ajax?act=bzuset?mid=${ipod.mid}&coin=${ipod.aria2.coin}&follow=${ipod.aria2.follow}&sign=${ipod.sign}`,
                    method: "GET"
                  });
                }), GM_xmlhttpRequest({
                  url: `${ipod.home}/info1.txt`,
                  method: "GET",
                  responseType: "text",
                  nocache: true,
                  onload(r) {
                    document.querySelector("#info1").innerText = r.response;
                  }
                }));
              });
            }, 1e3);
            let dom = document.querySelector("#seasonlist_module");
            if (dom) {
              function fixList() {
                setTimeout(() => {
                  dom.querySelectorAll("a").forEach(t => {
                    let s = t.getAttribute("href");
                    "/" == s.charAt(s.length - 1) && t.setAttribute("href", s.substring(0, s.length - 1)), u.cpdom(t);
                  });
                }, 1e3);
              }
              dom.querySelector("div.expand-more") && dom.querySelector("div.expand-more").addEventListener("click", fixList), fixList();
            }
          }
        }, 5e3);
      }), initbangumi(), zproxy();
    }
  } else location.pathname.startsWith("/detail/") && zproxy(), location.pathname.startsWith("/platform/mine") && zproxy();
  if (location.hostname.includes("youtube.com")) {
    function ytbdl(data) {
      let s, dom, arr = [], ignore = [], id = data.videoDetails.videoId, ia = {
        bitrate: 0
      };
      data.streamingData.adaptiveFormats.forEach(t => {
        t.hasOwnProperty("signatureCipher") && (t.url = t.signatureCipher), t.url && t.mimeType.includes("audio/") && t.bitrate > ia.bitrate && (ia = {
          bitrate: t.bitrate,
          name: id + ".mp3",
          summary: "\u97f3\u9891",
          url: t.url
        }), t.url && t.mimeType.includes("video/") && !ignore.includes(s = /p$/.test(t.qualityLabel) ? t.qualityLabel + t.fps : t.qualityLabel) && (ignore.push(s), t.mimeType.includes("video/webm") && Number.parseInt(t.height, 10) > 720 && arr.push({
          name: id + ".mp4",
          summary: s,
          url: t.url
        }), t.mimeType.includes("video/mp4") && Number.parseInt(t.height, 10) > 360 && arr.push({
          name: id + ".mp4",
          summary: s,
          url: t.url
        }));
      }), arr.length ? (arr.push(ia), arr.reverse(), (dom = document.querySelector("#zydl")) ? (dom.innerHTML = u.tpl(ipod.tpls.dlist, arr), dom.insertAdjacentHTML("afterbegin", '<button name="zyset"><i class="ion-settings"></i> \u8bbe\u7f6e</button>')) : ipod.task = setInterval(() => {
        document.querySelector("#meta-contents") && (clearInterval(ipod.task), document.querySelector("#meta-contents").insertAdjacentHTML("beforebegin", '<div id="zydl" class="btn-group outline"></div>'), (dom = document.querySelector("#zydl")).setAttribute("style", "font-size: 14px; margin-top: .5em"), dom.innerHTML = u.tpl(ipod.tpls.dlist, arr), dom.insertAdjacentHTML("afterbegin", '<button name="zyset"><i class="ion-settings"></i> \u8bbe\u7f6e</button>'), dom.addEventListener("click", async () => {
          let node = u.zdom(1);
          if (node.hasAttribute("data-url")) {
            let url = node.getAttribute("data-url");
            if (!url.startsWith("http")) {
              u.vfunc(ipod.decsign) || (ipod.decsign = await fetch(document.querySelector('script[src$="base.js"]').src).then(r => r.text()).then(str => {
                let arr, name, body;
                return arr = /=([\$\w]+?)\(decodeURIComponent/.exec(str), name = (arr = RegExp(arr[1] + "=function\\((.+?)\\){(.+?)}", "s").exec(str))[1], arr = /;(.+?)\..+?\(/.exec(body = arr[2]), arr = RegExp("var " + arr[1] + "={.+?};", "s").exec(str), Function(name, body = arr[0] + "\n" + body);
              }));
              let o = u.usp(url), sign = ipod.decsign.call(null, o.s);
              o.url = decodeURIComponent(o.url), console.log("url = %s", url = `${o.url}&${o.sp}=${sign}`);
            }
            ipod.aria2.mode ? (o = {
              url,
              name: node.getAttribute("data-name"),
              saveAs: false
            }, GM_download(o)) : (o = {
              "all-proxy": ipod.aria2.proxy,
              referer: "https://www.youtube.com/",
              "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
              url: [url],
              dir: ipod.aria2.dir,
              out: node.getAttribute("data-name"),
              split: "16"
            }, u.aria2([o]));
          } else zset();
        }));
      }, 1e3)) : (dom = document.querySelector("#zydl")) && (dom.innerHTML = "");
    }
    unsafeWindow.fetch = new Proxy(fetch, {
      apply: (target, obj, args) => target.apply(obj, args).then(r => {
        let o = args[0];
        return o instanceof Request && o.url.includes("player") && r.clone().json().then(ytbdl), r;
      })
    }), ipod.tpls = {
      dlist: '<button data-name="[name]" data-url="[url]">[summary]</button>'
    }, ipod.defaults = {
      dir: "D:/HD2A",
      jsonrpc: "http://127.0.0.1:16800/jsonrpc",
      proxy: "http://127.0.0.1:1081"
    }, ipod.aria2 = u.load("aria2", ipod.defaults), document.addEventListener("DOMContentLoaded", () => {
      location.pathname.startsWith("/watch") && ytbdl(unsafeWindow.ytplayer.config.args.raw_player_response);
    });
  }
}();
