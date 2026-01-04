// ==UserScript==
// @namespace greasyfork
// @name HD2A
// @version 0.1.31
// @description 111
// @match https://v.qq.com/*
// @match https://www.bilibili.com/*
// @match https://www.iqiyi.com/*
// @connect 121.5.226.51
// @connect *
// @grant GM_addStyle
// @grant GM_info
// @grant GM_cookie
// @grant GM_download
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_setClipboard
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.onurlchange
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/456865/HD2A.user.js
// @updateURL https://update.greasyfork.org/scripts/456865/HD2A.meta.js
// ==/UserScript==
!(function () {
  function e() {
    if ((t.zdom(), document.querySelector("#zyset")))
      o.aria2 && t.zform("#zyset input", o.aria2),
        (document.querySelector("#zyset").style.cssText = "display: flex");
    else {
      let e;
      switch (t.zhost()) {
        case "baidu_com":
          e =
            '<div class="tamper" id="zyset"><div><form><div><label>节点选择</label><input name="host" type="radio" value="1"><label>自动适应 &nbsp; </label><input name="host" type="radio" value="2"><label>陕西联通 &nbsp; </label><input name="host" type="radio" value="3"><label>云南联通 &nbsp; </label><input name="host" type="radio" value="4"><label>湖南电信</label></div><div><label>设置 aria2 jsonrpc</label><input name="jsonrpc" type="text"></div><div><label>设置 aria2 访问口令</label><input name="token" type="password" placeholder="没有口令则不要填写"></div><div><label>设置下载保存路径</label><input name="dir" type="text"><div class="summary"> 请使用左斜杠作为分隔符</div></div><div class="btn-group"><button type="button"><i class="ion-close"></i> 取消</button><button type="submit"><i class="ion-checkmark"></i> 确定</button></div></form></div></div>';
          break;
        case "bilibili_com":
          e =
            '<div class="tamper" id="zyset"><div><form><div><label>常规设置</label><input name="vhd" type="checkbox" value="1"><label>启用大会员高画质播放视频</label><div class="summary">服务器配置低HD2A有次数限制 每天重置</div></div><div><label>设置 aria2 jsonrpc</label><input name="jsonrpc" type="text"></div><div><label>设置 aria2 访问口令</label><input name="token" type="password" placeholder="没有口令则不要填写"></div><div><label>设置下载保存路径</label><input name="dir" type="text"></div><div class="btn-group"><button type="button"><i class="ion-close"></i> 取消</button><button type="submit"><i class="ion-checkmark"></i> 确定</button></div></form></div></div>';
          break;
        case "youtube_com":
          e =
            '<div class="tamper" id="zyset"><div><form><div><label>设置 aria2 jsonrpc</label><input name="jsonrpc" type="text"></div><div><label>设置 aria2 访问口令</label><input name="token" type="password" placeholder="没有口令则不要填写"></div><div><label>设置代理服务器</label><input name="proxy" type="text" placeholder="不使用代理则留空"><div class="summary">不需要通过代理服务器下载则将此设置清空</div></div><div><label>设置下载保存路径</label><input name="dir" type="text"></div><div class="btn-group"><button type="button"><i class="ion-close"></i> 取消</button><button type="submit"><i class="ion-checkmark"></i> 确定</button></div></form></div></div>';
          break;
        default:
          e =
            '<div class="tamper" id="zyset"><div><form><div><label>设置 aria2 jsonrpc</label><input name="jsonrpc" type="text"></div><div><label>设置 aria2 访问口令</label><input name="token" type="password" placeholder="没有口令则不要填写"></div><div><label>设置下载保存路径</label><input name="dir" type="text"></div><div class="btn-group"><button type="button"><i class="ion-close"></i> 取消</button><button type="submit"><i class="ion-checkmark"></i> 确定</button></div></form></div></div>';
      }
      document.body.insertAdjacentHTML("beforeend", e),
        o.aria2 && t.zform("#zyset input", o.aria2),
        (document.querySelector("#zyset").style.cssText = "display: flex"),
        document
          .querySelector("#zyset button[type=button]")
          .addEventListener("click", () => {
            t.zdom(),
              (document.querySelector("#zyset").style.cssText =
                "display: none");
          }),
        document.querySelector("#zyset form").addEventListener("submit", () => {
          let e = t.zdom(),
            n = new FormData(e);
          (o.aria2 = Object.assign(
            {},
            o.defaults,
            Object.fromEntries(n.entries())
          )),
            o.aria2.hasOwnProperty("vhd") &&
              (o.aria2.vhd = Number.parseInt(o.aria2.vhd)),
            o.aria2.hasOwnProperty("mode") &&
              (o.aria2.mode = Number.parseInt(o.aria2.mode)),
            t.save("aria2", o.aria2),
            (document.querySelector("#zyset").style.cssText = "display: none");
        });
    }
  }
  const t = {
    now: () => Math.floor(Date.now() / 1e3),
    uid: () => Date.now().toString(36).toUpperCase(),
    cclean: (e) =>
      Object.entries(Object.fromEntries(e.map((e) => [e.name, e.value]))).map(
        (e) => e.join("=")
      ),
    rand: (e) => Math.floor(1e3 * Math.random()) % e,
    serialize: (e) =>
      "object" == typeof e
        ? new URLSearchParams(Object.entries(e)).toString()
        : e,
    unique: (e) => e.fliter((e, t, o) => o.indexOf(e) == t),
    urlfix: (e) =>
      e.startsWith("http")
        ? e
        : e.startsWith("//")
        ? location.protocol + e
        : e.startsWith("/")
        ? location.origin + e
        : location.origin + "/" + e,
    usp: (e) => Object.fromEntries(new URLSearchParams(e).entries()),
    vobj: (e) => "[object Object]" == Object.prototype.toString.call(e),
    wait: (e) => new Promise((t) => setTimeout(t, e)),
    xpath: (e) => document.evaluate(e, document).iterateNext(),
    zhost: () => location.hostname.split(".").slice(-2).join("_"),
    pwd(e = 4) {
      let o,
        n = [];
      for (o = 0; e > o; o++)
        n.push(
          "abcdefghijklmnopqrstuvwxyz23456789ABCDEFGHKLMNPSTVWXY".charAt(
            t.rand(53)
          )
        );
      return n.join("");
    },
    zdom(e = 0) {
      let t = window.event;
      return (
        t.preventDefault(), t.stopPropagation(), e ? t.target : t.currentTarget
      );
    },
    zinput(e, t) {
      (e.value = t),
        e.hasOwnProperty("_valueTracker") && e._valueTracker.setValue(""),
        e.dispatchEvent(new Event("input", { bubbles: !0 }));
    },
    zero(e, t = 2) {
      let o,
        n = +e;
      return (o = isNaN(n) ? "0" : n.toString()).padStart(t, "0");
    },
    fsize(e, t = 2) {
      let o,
        n = +e;
      if (0 == n) o = "";
      else {
        let i = 0,
          r = ["B", "KB", "MB", "GB", "TB", "PB"];
        for (; n > 1024; ) i++, (n = Math.ceil(n / 1024));
        o = Math.round(e / Math.pow(1024, i)) + r[i + t];
      }
      return o;
    },
    urlopen(e, t) {
      let o = document.createElement("a");
      o.setAttribute("href", e),
        o.setAttribute("referrerpolicy", "no-referrer"),
        null == t && o.setAttribute("target", "_blank"),
        o.click();
    },
    aria2(e) {
      let n = [],
        i = e[0].url[0].includes("baidupcs.com") ? "1" : "5",
        r = { id: t.uid(), method: "system.multicall", params: [] };
      n.push({
        methodName: "aria2.changeGlobalOption",
        params: [
          {
            "allow-overwrite": "false",
            "auto-file-renaming": "false",
            "max-concurrent-downloads": i
          }
        ]
      }),
        e.forEach((e) => {
          Object.keys(e).forEach((t) => {
            "number" == typeof e[t] && (e[t] = e[t].toString());
          });
          let t = { methodName: "aria2.addUri", params: [] };
          o.aria2.token && t.params.push(`token:${o.aria2.token}`),
            t.params.push(e.url),
            e.hasOwnProperty("split") ||
              (e.split = 1 == e.url.length ? "4" : e.url.length.toString()),
            e.hasOwnProperty("extype") && (e.out = r.id + e.extype),
            t.params.push(e),
            n.push(t);
        }),
        r.params.push(n),
        GM_xmlhttpRequest({
          url: o.aria2.jsonrpc,
          method: "POST",
          responseType: "json",
          data: JSON.stringify(r),
          onerror() {
            alert("请检查Motrix是否运行以及脚本设置里填写的jsonrpc是否正确");
          }
        });
    },
    zform(e, t) {
      document.querySelectorAll(e).forEach((e) => {
        let o = e.getAttribute("name");
        if (t.hasOwnProperty(o)) {
          let n = t[o];
          switch (e.getAttribute("type")) {
            case "radio":
              e.checked = n == e.value;
              break;
            case "checkbox":
              e.checked = !!n;
              break;
            default:
              e.value = n;
          }
        }
      });
    },
    domcopy(e) {
      let t = null;
      return (
        e instanceof HTMLElement &&
          ((t = e.cloneNode(!0)), e.after(t), e.remove()),
        t
      );
    },
    domremove(e) {
      e.forEach((e) => {
        let o = e.startsWith("/html/") ? t.xpath(e) : document.querySelector(e);
        null == o || o.remove();
      });
    },
    domhide(e) {
      e.forEach((e) => {
        let o = e.startsWith("/html/") ? t.xpath(e) : document.querySelector(e);
        null == o || (o.style.cssText = "display: none !important");
      });
    },
    loread(e, t = "") {
      let o = localStorage.getItem(e);
      return null == o ? t : o;
    },
    losave(e, t) {
      localStorage.setItem(e, t);
    },
    load(e, o = null) {
      e += "_" + t.zhost();
      let n = GM_getValue(e, null);
      return null == n ? o : JSON.parse(n);
    },
    save(e, o) {
      (e += "_" + t.zhost()), GM_setValue(e, JSON.stringify(o));
    },
    strcut(e, t, o) {
      let n,
        i,
        r = e;
      return (
        e.includes(t) &&
          ((n = e.indexOf(t) + t.length),
          (null == o || -1 == (i = e.indexOf(o, n))) && (i = e.length),
          (r = e.substring(n, i))),
        r
      );
    },
    str2obj(e) {
      let t = null;
      return (
        "string" == typeof e &&
          e.length &&
          (t = e.includes('"')
            ? JSON.parse(e)
            : JSON.parse(e.replaceAll(/'/g, '"'))),
        t
      );
    },
    download(e) {
      if (e) {
        let n = e.startsWith("magnet:")
          ? { url: [] }
          : {
              url: [],
              "use-header": "true",
              "min-split-size": "1M",
              split: "8"
            };
        Object.assign(n, o.aria2),
          (e = e.startsWith("magnet:")
            ? t.magnet(e)
            : e.startsWith("http")
            ? e
            : e.startsWith("//")
            ? location.protocol + e
            : e.startsWith("/")
            ? location.origin + e
            : location.origin + "/" + e),
          n.url.push(e),
          t.aria2([n]);
      }
    },
    magnet(e) {
      let t = e.indexOf("&");
      return -1 == t ? e : e.substring(0, t);
    },
    namefix(e) {
      let t,
        o = ['"', "'", "*", ":", "<", ">", "?", "|"];
      for (t = 0; o.length > t; t++) e = e.replaceAll(o[t], "");
      return e.replaceAll("\\", "/").replaceAll("//", "/");
    },
    tpl: (e, t) =>
      (Array.isArray(t) ? t : [t])
        .map((t) =>
          ((e, t) =>
            e.replaceAll(/\[(\w{1,16})\]/g, (e, o) =>
              t.hasOwnProperty(o) ? t[o] : o
            ))(e, t)
        )
        .join(""),
    history(e) {
      const t = history[e];
      return function () {
        let o = new Event(e);
        return (
          (o.arguments = arguments),
          window.dispatchEvent(o),
          t.apply(this, arguments)
        );
      };
    },
    jsload(e, o) {
      let n = document.createElement("script");
      (n.src = t.urlfix(e)),
        null == o || n.setAttribute("name", o),
        n.setAttribute("charset", "utf-8"),
        n.setAttribute("crossorigin", "anonymous"),
        document.head.appendChild(n);
    },
    swClassName(e) {
      if ("string" == typeof e && e.length) {
        let t = Array.from(o.checkbox.classList);
        t.includes(e) ? (t = t.filter((t) => t != e)) : t.push("on"),
          (o.checkbox.className = t.join(" "));
      }
    }
  };
  let o = {
    version: GM_info.script.version,
    home: "https://121.5.226.51",
    cookie: "",
    wait: 0,
    now: t.now()
  };
  if (
    (GM_addStyle(
      String.raw`@font-face{font-family:"Ionicons";src:url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.eot?v=4.5.5#iefix") format("embedded-opentype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff2?v=4.5.5") format("woff2"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff?v=4.5.5") format("woff"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.ttf?v=4.5.5") format("truetype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.svg?v=4.5.5#Ionicons") format("svg");font-weight:normal;font-style:normal}i[class|=ion]{display:inline-block;font-family:"Ionicons";font-size:120%;font-style:normal;font-variant:normal;font-weight:normal;line-height:1;text-rendering:auto;text-transform:none;vertical-align:text-bottom;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased}.ion-android:before{content:"\f225"}.ion-angular:before{content:"\f227"}.ion-apple:before{content:"\f229"}.ion-bitbucket:before{content:"\f193"}.ion-bitcoin:before{content:"\f22b"}.ion-buffer:before{content:"\f22d"}.ion-chrome:before{content:"\f22f"}.ion-closed-captioning:before{content:"\f105"}.ion-codepen:before{content:"\f230"}.ion-css3:before{content:"\f231"}.ion-designernews:before{content:"\f232"}.ion-dribbble:before{content:"\f233"}.ion-dropbox:before{content:"\f234"}.ion-euro:before{content:"\f235"}.ion-facebook:before{content:"\f236"}.ion-flickr:before{content:"\f107"}.ion-foursquare:before{content:"\f237"}.ion-freebsd-devil:before{content:"\f238"}.ion-game-controller-a:before{content:"\f13b"}.ion-game-controller-b:before{content:"\f181"}.ion-github:before{content:"\f239"}.ion-google:before{content:"\f23a"}.ion-googleplus:before{content:"\f23b"}.ion-hackernews:before{content:"\f23c"}.ion-html5:before{content:"\f23d"}.ion-instagram:before{content:"\f23e"}.ion-ionic:before{content:"\f150"}.ion-ionitron:before{content:"\f151"}.ion-javascript:before{content:"\f23f"}.ion-linkedin:before{content:"\f240"}.ion-markdown:before{content:"\f241"}.ion-model-s:before{content:"\f153"}.ion-no-smoking:before{content:"\f109"}.ion-nodejs:before{content:"\f242"}.ion-npm:before{content:"\f195"}.ion-octocat:before{content:"\f243"}.ion-pinterest:before{content:"\f244"}.ion-playstation:before{content:"\f245"}.ion-polymer:before{content:"\f15e"}.ion-python:before{content:"\f246"}.ion-reddit:before{content:"\f247"}.ion-rss:before{content:"\f248"}.ion-sass:before{content:"\f249"}.ion-skype:before{content:"\f24a"}.ion-slack:before{content:"\f10b"}.ion-snapchat:before{content:"\f24b"}.ion-steam:before{content:"\f24c"}.ion-tumblr:before{content:"\f24d"}.ion-tux:before{content:"\f2ae"}.ion-twitch:before{content:"\f2af"}.ion-twitter:before{content:"\f2b0"}.ion-usd:before{content:"\f2b1"}.ion-vimeo:before{content:"\f2c4"}.ion-vk:before{content:"\f10d"}.ion-whatsapp:before{content:"\f2c5"}.ion-windows:before{content:"\f32f"}.ion-wordpress:before{content:"\f330"}.ion-xbox:before{content:"\f34c"}.ion-xing:before{content:"\f10f"}.ion-yahoo:before{content:"\f34d"}.ion-yen:before{content:"\f34e"}.ion-youtube:before{content:"\f34f"}.ion-add:before{content:"\f273"}.ion-add-circle:before{content:"\f272"}.ion-add-circle-outline:before{content:"\f158"}.ion-airplane:before{content:"\f15a"}.ion-alarm:before{content:"\f274"}.ion-albums:before{content:"\f275"}.ion-alert:before{content:"\f276"}.ion-american-football:before{content:"\f277"}.ion-analytics:before{content:"\f278"}.ion-aperture:before{content:"\f279"}.ion-apps:before{content:"\f27a"}.ion-appstore:before{content:"\f27b"}.ion-archive:before{content:"\f27c"}.ion-arrow-back:before{content:"\f27d"}.ion-arrow-down:before{content:"\f27e"}.ion-arrow-dropdown:before{content:"\f280"}.ion-arrow-dropdown-circle:before{content:"\f27f"}.ion-arrow-dropleft:before{content:"\f282"}.ion-arrow-dropleft-circle:before{content:"\f281"}.ion-arrow-dropright:before{content:"\f284"}.ion-arrow-dropright-circle:before{content:"\f283"}.ion-arrow-dropup:before{content:"\f286"}.ion-arrow-dropup-circle:before{content:"\f285"}.ion-arrow-forward:before{content:"\f287"}.ion-arrow-round-back:before{content:"\f288"}.ion-arrow-round-down:before{content:"\f289"}.ion-arrow-round-forward:before{content:"\f28a"}.ion-arrow-round-up:before{content:"\f28b"}.ion-arrow-up:before{content:"\f28c"}.ion-at:before{content:"\f28d"}.ion-attach:before{content:"\f28e"}.ion-backspace:before{content:"\f28f"}.ion-barcode:before{content:"\f290"}.ion-baseball:before{content:"\f291"}.ion-basket:before{content:"\f292"}.ion-basketball:before{content:"\f293"}.ion-battery-charging:before{content:"\f294"}.ion-battery-dead:before{content:"\f295"}.ion-battery-full:before{content:"\f296"}.ion-beaker:before{content:"\f297"}.ion-bed:before{content:"\f160"}.ion-beer:before{content:"\f298"}.ion-bicycle:before{content:"\f299"}.ion-bluetooth:before{content:"\f29a"}.ion-boat:before{content:"\f29b"}.ion-body:before{content:"\f29c"}.ion-bonfire:before{content:"\f29d"}.ion-book:before{content:"\f29e"}.ion-bookmark:before{content:"\f29f"}.ion-bookmarks:before{content:"\f2a0"}.ion-bowtie:before{content:"\f2a1"}.ion-briefcase:before{content:"\f2a2"}.ion-browsers:before{content:"\f2a3"}.ion-brush:before{content:"\f2a4"}.ion-bug:before{content:"\f2a5"}.ion-build:before{content:"\f2a6"}.ion-bulb:before{content:"\f2a7"}.ion-bus:before{content:"\f2a8"}.ion-business:before{content:"\f1a4"}.ion-cafe:before{content:"\f2a9"}.ion-calculator:before{content:"\f2aa"}.ion-calendar:before{content:"\f2ab"}.ion-call:before{content:"\f2ac"}.ion-camera:before{content:"\f2ad"}.ion-car:before{content:"\f2b2"}.ion-card:before{content:"\f2b3"}.ion-cart:before{content:"\f2b4"}.ion-cash:before{content:"\f2b5"}.ion-cellular:before{content:"\f164"}.ion-chatboxes:before{content:"\f2b6"}.ion-chatbubbles:before{content:"\f2b7"}.ion-checkbox:before{content:"\f2b9"}.ion-checkbox-outline:before{content:"\f2b8"}.ion-checkmark:before{content:"\f2bc"}.ion-checkmark-circle:before{content:"\f2bb"}.ion-checkmark-circle-outline:before{content:"\f2ba"}.ion-clipboard:before{content:"\f2bd"}.ion-clock:before{content:"\f2be"}.ion-close:before{content:"\f2c0"}.ion-close-circle:before{content:"\f2bf"}.ion-close-circle-outline:before{content:"\f166"}.ion-cloud:before{content:"\f2c9"}.ion-cloud-circle:before{content:"\f2c2"}.ion-cloud-done:before{content:"\f2c3"}.ion-cloud-download:before{content:"\f2c6"}.ion-cloud-outline:before{content:"\f2c7"}.ion-cloud-upload:before{content:"\f2c8"}.ion-cloudy:before{content:"\f2cb"}.ion-cloudy-night:before{content:"\f2ca"}.ion-code:before{content:"\f2ce"}.ion-code-download:before{content:"\f2cc"}.ion-code-working:before{content:"\f2cd"}.ion-cog:before{content:"\f2cf"}.ion-color-fill:before{content:"\f2d0"}.ion-color-filter:before{content:"\f2d1"}.ion-color-palette:before{content:"\f2d2"}.ion-color-wand:before{content:"\f2d3"}.ion-compass:before{content:"\f2d4"}.ion-construct:before{content:"\f2d5"}.ion-contact:before{content:"\f2d6"}.ion-contacts:before{content:"\f2d7"}.ion-contract:before{content:"\f2d8"}.ion-contrast:before{content:"\f2d9"}.ion-copy:before{content:"\f2da"}.ion-create:before{content:"\f2db"}.ion-crop:before{content:"\f2dc"}.ion-cube:before{content:"\f2dd"}.ion-cut:before{content:"\f2de"}.ion-desktop:before{content:"\f2df"}.ion-disc:before{content:"\f2e0"}.ion-document:before{content:"\f2e1"}.ion-done-all:before{content:"\f2e2"}.ion-download:before{content:"\f2e3"}.ion-easel:before{content:"\f2e4"}.ion-egg:before{content:"\f2e5"}.ion-exit:before{content:"\f2e6"}.ion-expand:before{content:"\f2e7"}.ion-eye:before{content:"\f2e9"}.ion-eye-off:before{content:"\f2e8"}.ion-fastforward:before{content:"\f2ea"}.ion-female:before{content:"\f2eb"}.ion-filing:before{content:"\f2ec"}.ion-film:before{content:"\f2ed"}.ion-finger-print:before{content:"\f2ee"}.ion-fitness:before{content:"\f1ac"}.ion-flag:before{content:"\f2ef"}.ion-flame:before{content:"\f2f0"}.ion-flash:before{content:"\f17e"}.ion-flash-off:before{content:"\f12f"}.ion-flashlight:before{content:"\f16b"}.ion-flask:before{content:"\f2f2"}.ion-flower:before{content:"\f2f3"}.ion-folder:before{content:"\f2f5"}.ion-folder-open:before{content:"\f2f4"}.ion-football:before{content:"\f2f6"}.ion-funnel:before{content:"\f2f7"}.ion-gift:before{content:"\f199"}.ion-git-branch:before{content:"\f2fa"}.ion-git-commit:before{content:"\f2fb"}.ion-git-compare:before{content:"\f2fc"}.ion-git-merge:before{content:"\f2fd"}.ion-git-network:before{content:"\f2fe"}.ion-git-pull-request:before{content:"\f2ff"}.ion-glasses:before{content:"\f300"}.ion-globe:before{content:"\f301"}.ion-grid:before{content:"\f302"}.ion-hammer:before{content:"\f303"}.ion-hand:before{content:"\f304"}.ion-happy:before{content:"\f305"}.ion-headset:before{content:"\f306"}.ion-heart:before{content:"\f308"}.ion-heart-dislike:before{content:"\f167"}.ion-heart-empty:before{content:"\f1a1"}.ion-heart-half:before{content:"\f1a2"}.ion-help:before{content:"\f30b"}.ion-help-buoy:before{content:"\f309"}.ion-help-circle:before{content:"\f30a"}.ion-help-circle-outline:before{content:"\f16d"}.ion-home:before{content:"\f30c"}.ion-hourglass:before{content:"\f111"}.ion-ice-cream:before{content:"\f30d"}.ion-image:before{content:"\f30e"}.ion-images:before{content:"\f30f"}.ion-infinite:before{content:"\f310"}.ion-information:before{content:"\f312"}.ion-information-circle:before{content:"\f311"}.ion-information-circle-outline:before{content:"\f16f"}.ion-jet:before{content:"\f315"}.ion-journal:before{content:"\f18d"}.ion-key:before{content:"\f316"}.ion-keypad:before{content:"\f317"}.ion-laptop:before{content:"\f318"}.ion-leaf:before{content:"\f319"}.ion-link:before{content:"\f22e"}.ion-list:before{content:"\f31b"}.ion-list-box:before{content:"\f31a"}.ion-locate:before{content:"\f31c"}.ion-lock:before{content:"\f31d"}.ion-log-in:before{content:"\f31e"}.ion-log-out:before{content:"\f31f"}.ion-magnet:before{content:"\f320"}.ion-mail:before{content:"\f322"}.ion-mail-open:before{content:"\f321"}.ion-mail-unread:before{content:"\f172"}.ion-male:before{content:"\f323"}.ion-man:before{content:"\f324"}.ion-map:before{content:"\f325"}.ion-medal:before{content:"\f326"}.ion-medical:before{content:"\f327"}.ion-medkit:before{content:"\f328"}.ion-megaphone:before{content:"\f329"}.ion-menu:before{content:"\f32a"}.ion-mic:before{content:"\f32c"}.ion-mic-off:before{content:"\f32b"}.ion-microphone:before{content:"\f32d"}.ion-moon:before{content:"\f32e"}.ion-more:before{content:"\f1c9"}.ion-move:before{content:"\f331"}.ion-musical-note:before{content:"\f332"}.ion-musical-notes:before{content:"\f333"}.ion-navigate:before{content:"\f334"}.ion-notifications:before{content:"\f338"}.ion-notifications-off:before{content:"\f336"}.ion-notifications-outline:before{content:"\f337"}.ion-nuclear:before{content:"\f339"}.ion-nutrition:before{content:"\f33a"}.ion-open:before{content:"\f33b"}.ion-options:before{content:"\f33c"}.ion-outlet:before{content:"\f33d"}.ion-paper:before{content:"\f33f"}.ion-paper-plane:before{content:"\f33e"}.ion-partly-sunny:before{content:"\f340"}.ion-pause:before{content:"\f341"}.ion-paw:before{content:"\f342"}.ion-people:before{content:"\f343"}.ion-person:before{content:"\f345"}.ion-person-add:before{content:"\f344"}.ion-phone-landscape:before{content:"\f346"}.ion-phone-portrait:before{content:"\f347"}.ion-photos:before{content:"\f348"}.ion-pie:before{content:"\f349"}.ion-pin:before{content:"\f34a"}.ion-pint:before{content:"\f34b"}.ion-pizza:before{content:"\f354"}.ion-planet:before{content:"\f356"}.ion-play:before{content:"\f357"}.ion-play-circle:before{content:"\f174"}.ion-podium:before{content:"\f358"}.ion-power:before{content:"\f359"}.ion-pricetag:before{content:"\f35a"}.ion-pricetags:before{content:"\f35b"}.ion-print:before{content:"\f35c"}.ion-pulse:before{content:"\f35d"}.ion-qr-scanner:before{content:"\f35e"}.ion-quote:before{content:"\f35f"}.ion-radio:before{content:"\f362"}.ion-radio-button-off:before{content:"\f360"}.ion-radio-button-on:before{content:"\f361"}.ion-rainy:before{content:"\f363"}.ion-recording:before{content:"\f364"}.ion-redo:before{content:"\f365"}.ion-refresh:before{content:"\f366"}.ion-refresh-circle:before{content:"\f228"}.ion-remove:before{content:"\f368"}.ion-remove-circle:before{content:"\f367"}.ion-remove-circle-outline:before{content:"\f176"}.ion-reorder:before{content:"\f369"}.ion-repeat:before{content:"\f36a"}.ion-resize:before{content:"\f36b"}.ion-restaurant:before{content:"\f36c"}.ion-return-left:before{content:"\f36d"}.ion-return-right:before{content:"\f36e"}.ion-reverse-camera:before{content:"\f36f"}.ion-rewind:before{content:"\f370"}.ion-ribbon:before{content:"\f371"}.ion-rocket:before{content:"\f179"}.ion-rose:before{content:"\f372"}.ion-sad:before{content:"\f373"}.ion-save:before{content:"\f1a9"}.ion-school:before{content:"\f374"}.ion-search:before{content:"\f375"}.ion-send:before{content:"\f376"}.ion-settings:before{content:"\f377"}.ion-share:before{content:"\f379"}.ion-share-alt:before{content:"\f378"}.ion-shirt:before{content:"\f37a"}.ion-shuffle:before{content:"\f37b"}.ion-skip-backward:before{content:"\f37c"}.ion-skip-forward:before{content:"\f37d"}.ion-snow:before{content:"\f37e"}.ion-speedometer:before{content:"\f37f"}.ion-square:before{content:"\f381"}.ion-square-outline:before{content:"\f380"}.ion-star:before{content:"\f384"}.ion-star-half:before{content:"\f382"}.ion-star-outline:before{content:"\f383"}.ion-stats:before{content:"\f385"}.ion-stopwatch:before{content:"\f386"}.ion-subway:before{content:"\f387"}.ion-sunny:before{content:"\f388"}.ion-swap:before{content:"\f389"}.ion-switch:before{content:"\f38a"}.ion-sync:before{content:"\f38b"}.ion-tablet-landscape:before{content:"\f38c"}.ion-tablet-portrait:before{content:"\f38d"}.ion-tennisball:before{content:"\f38e"}.ion-text:before{content:"\f38f"}.ion-thermometer:before{content:"\f390"}.ion-thumbs-down:before{content:"\f391"}.ion-thumbs-up:before{content:"\f392"}.ion-thunderstorm:before{content:"\f393"}.ion-time:before{content:"\f394"}.ion-timer:before{content:"\f395"}.ion-today:before{content:"\f17d"}.ion-train:before{content:"\f396"}.ion-transgender:before{content:"\f397"}.ion-trash:before{content:"\f398"}.ion-trending-down:before{content:"\f399"}.ion-trending-up:before{content:"\f39a"}.ion-trophy:before{content:"\f39b"}.ion-tv:before{content:"\f17f"}.ion-umbrella:before{content:"\f39c"}.ion-undo:before{content:"\f39d"}.ion-unlock:before{content:"\f39e"}.ion-videocam:before{content:"\f39f"}.ion-volume-high:before{content:"\f123"}.ion-volume-low:before{content:"\f131"}.ion-volume-mute:before{content:"\f3a1"}.ion-volume-off:before{content:"\f3a2"}.ion-walk:before{content:"\f3a4"}.ion-wallet:before{content:"\f18f"}.ion-warning:before{content:"\f3a5"}.ion-watch:before{content:"\f3a6"}.ion-water:before{content:"\f3a7"}.ion-wifi:before{content:"\f3a8"}.ion-wine:before{content:"\f3a9"}.ion-woman:before{content:"\f3aa"}body{max-width:100vw;overflow-x:hidden}#zym{position:absolute;top:62px;right:15px;background-color:rgba(255,255,255,0.9);box-sizing:border-box;width:410px;font-size:14px;padding:15px 12px}#zym>div{margin:8px}#zym>div:first-child{margin:0;font-size:13px}#zym>div[name="path"]>span{cursor:default}#zym>div[name="path"]>span:not(:first-child):before{padding:0 8px;font-family:"Ionicons";content:"\f284";color:#09f}#zym>div[name="full"]{overflow-y:auto;scrollbar-width:none}#zym>div[name="full"]::-webkit-scrollbar{display:none}#zym>div>table{width:100%}#zym>div>table>tbody>tr{border-top:1px solid #bdf}#zym>div>table>tbody>tr:last-child{border-bottom:1px solid #bdf}#zym>div>table>tbody>tr.on{color:#000;background-color:#cbedff}#zym>div>table>tbody>tr.on>td:nth-child(1){color:#09f}#zym>div>table>tbody>tr.on>td:nth-child(1):before{content:"\f2b8"}#zym>div>table>tbody>tr>td{cursor:default;line-height:40px}#zym>div>table>tbody>tr>td:nth-child(1){text-align:left;padding-left:12px;color:#999}#zym>div>table>tbody>tr>td:nth-child(1):before{font-family:"Ionicons";font-size:110%;content:"\f380"}#zym>div>table>tbody>tr>td:nth-child(2){overflow:hidden;white-space:nowrap;text-overflow:"";word-wrap:normal;max-width:278px}#zym>div>table>tbody>tr>td:nth-child(2)>input{background-color:transparent;border:none;outline:none;width:100%}#zym>div>table>tbody>tr>td:nth-child(3){text-align:right;padding-right:12px}#zylist ul{margin:0;padding:0;list-style-type:none;list-style-position:inside;max-height:500px;overflow-y:auto;scrollbar-width:none}#zylist ul>li{box-sizing:content-box;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0.25em 0;cursor:default}#zylist ul>li.on{color:#f45a8d}div.tamper{background-color:rgba(0,0,0,0.7);box-sizing:border-box;align-items:center;justify-content:center;text-align:left;cursor:default;display:none;position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:999999;font-size:14px}div.tamper>div{background-color:white;box-sizing:border-box;padding:1em;width:360px}div.tamper>div.w2{padding:0;width:720px}div.tamper>div.w2>div{padding:10px 20px}div.tamper>div.w2>ul{margin:0;padding:0;display:flex;flex-wrap:wrap;justify-content:center;list-style:none inside none}div.tamper>div.w2>ul[id="vlist"]{height:460px;overflow-y:auto;scrollbar-width:none}div.tamper>div.w2>ul[id="vlist"]::-webkit-scrollbar{display:none}div.tamper>div.w2>ul[id="vlist"]>li{width:160px;margin:0;padding:0px 8px 16px 8px}div.tamper>div.w2>ul[id="vlist"]>li div.title{white-space:normal;line-height:1.25;display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical}div.tamper a{color:#333 !important;text-decoration:none}div.tamper form{display:block}div.tamper form>div{padding:0.5em 0}div.tamper form>div>div{margin:0.5em 0}div.tamper form>div>div:last-child{margin-bottom:0}div.tamper form label{color:#000}div.tamper form label:first-child{display:block;margin-bottom:0.5em}div.tamper form label:first-child:before{content:"\00bb";margin:0 0.25em}div.tamper form label:not(:first-child){display:inline}div.tamper form input{box-shadow:none;color:#000}div.tamper form input[type="text"]{background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:0.5em;width:100%}div.tamper form input[type="text"]:focus{border:1px solid #59c1f0}div.tamper form input[type="password"]{background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:0.5em;width:100%}div.tamper form input[type="password"]:focus{border:1px solid #59c1f0}div.tamper form input[type="radio"],div.tamper form input[type="checkbox"]{display:inline-block !important;height:1em;margin-right:0.25em;width:1em}div.tamper form input[type="checkbox"]{-webkit-appearance:checkbox !important}div.tamper form input[type="radio"]{-webkit-appearance:radio !important}div.tamper table>tbody{overflow-y:auto;scrollbar-width:none}div.tamper table>tbody>tr.on>td:first-child{color:#09f}div.tamper table>tbody>tr.on>td:first-child:before{content:"\f2b8"}div.tamper table>tbody>tr>td{cursor:default}div.tamper table>tbody>tr>td:first-child{text-align:left;color:#999}div.tamper table>tbody>tr>td:first-child:before{font-family:"Ionicons";font-size:110%;content:"\f380"}div.tamper table>tbody>tr>td:last-child{overflow:hidden;white-space:nowrap;text-overflow:"";word-wrap:normal}div.summary{color:#666}div.btn-group{box-sizing:border-box;display:inline-flex}div.btn-group.full{display:flex}div.btn-group.outline>button{background-color:#fff;border:1px solid #ccc;color:#000}div.btn-group.outline>button:hover{color:#ffffff;background-color:#000;border-color:#000}div.btn-group.outline>button:not(:first-child){border-left:none}div.btn-group>button{background-color:#666;border-radius:0;border:none;color:#fff;display:inline-block;flex:1 1 auto;margin:0;outline:none;padding:0.5em 1.25em;position:relative;font-size:inherit}div.btn-group>button:hover{background-color:#000}div.btn-group>button:first-child{border-bottom-left-radius:0.25rem;border-top-left-radius:0.25rem}div.btn-group>button:last-child{border-bottom-right-radius:0.25rem;border-top-right-radius:0.25rem}@keyframes spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.spinner{animation-name:spinner;animation-duration:2400ms;animation-timing-function:linear;animation-iteration-count:infinite}`
    ),
    location.hostname.includes("nyaa"))
  ) {
    GM_addStyle(
      String.raw`#navFilter-category .btn{background-color:#fff; color:#333; font-size: 14px}i.fa-download{display:none}`
    ),
      (o.defaults = {
        dir: "D:/HD2A",
        jsonrpc: "http://127.0.0.1:16800/jsonrpc",
        token: ""
      }),
      (o.aria2 = t.load("aria2", o.defaults)),
      document.querySelectorAll("div.input-group > div").forEach((e, o) => {
        if (2 === o)
          e.removeAttribute("placeholder"),
            e.addEventListener("focus", () => {
              t.zdom().value = "";
            });
        else e.style.cssText = "display: none";
      }),
      document.querySelectorAll("a[title],a[rel~=nofollow]").forEach((e) => {
        e.setAttribute("target", "_blank");
      }),
      document.querySelectorAll("i.fa-magnet").forEach((e) => {
        (e.dataset.url = e.parentElement.getAttribute("href")),
          e.parentElement.removeAttribute("href"),
          (e.parentElement.style.cssText = "cursor: default"),
          e.addEventListener("click", () => {
            let e = t.zdom();
            console.clear(),
              window.event.ctrlKey
                ? GM_setClipboard(t.magnet(e.dataset.url), "text")
                : t.download(e.dataset.url);
          });
      });
    let g = document.querySelector("#navbar").firstElementChild;
    null == g
      ? (console.clear(), console.log("null #navbar"))
      : ((g.innerHTML =
          "sukebei.nyaa.si" == location.host
            ? '<li><a id="czyset" href="/">A2DH</a></li><li><a href="/?c=1_1">动漫</a></li><li><a href="/?c=1_3">游戏</a></li><li><a href="/?c=1_4">漫画</a></li><li><a href="/?c=1_5">图片</a></li><li><a href="/?c=1_2">同人</a></li><li><a href="/?c=2_1">写真</a></li><li><a href="/?c=2_2">视频</a></li><li><a href="https://nyaa.si">nyaa</a></li>'
            : '<li><a id="czyset" href="/">A2DH</a></li><li><a href="/?c=1_3&s=seeders&o=desc">Anime</a></li><li><a href="/?c=1_1&s=seeders&o=desc">AMV</a></li><li><a href="/?c=2_0&s=seeders&o=desc">Audio</a></li><li><a href="/?c=5_1&s=seeders&o=desc">Graphic</a></li><li><a href="/?c=5_2&s=seeders&o=desc">Photo</a></li><li><a href="/?c=6_1&s=seeders&o=desc">App</a></li><li><a href="/?c=6_2&s=seeders&o=desc">Game</a></li><li><a href="https://sukebei.nyaa.si">18X</a></li>'),
        document.querySelector("#czyset").addEventListener(
          "click",
          () => {
            t.zdom(), e();
          },
          !1
        ));
  } else if (location.hostname.includes("bilibili.com")) {
    function n() {
      let n = unsafeWindow.XMLHttpRequest,
        i = (e) => {
          let t = new n();
          return t.open("GET", e, !1), t.send(), t.responseText;
        };
      unsafeWindow.XMLHttpRequest = new Proxy(XMLHttpRequest, {
        construct(n) {
          let r, a;
          return new Proxy(new n(), {
            set: (e, t, o) => ((e[t] = o), !0),
            get(n, l) {
              let s = n[l];
              if ("function" == typeof s)
                s = function () {
                  switch (l) {
                    case "open":
                      r = arguments[1];
                      break;
                    case "send":
                      a = arguments[0];
                  }
                  return n[l].apply(n, arguments);
                };
              else if ("responseText" == l)
                if (r.includes("/acc/info?mid=11783021&"))
                  console.log(r),
                    (s =
                      '{"code":0,"message":"0","ttl":1,"data":{"mid":11783021,"name":"哔哩哔哩番剧出差","sex":"保密","face":"http://i2.hdslb.com/bfs/face/9f10323503739e676857f06f5e4f5eb323e9f3f2.jpg","sign":"","rank":10000,"level":6,"jointime":0,"moral":0,"silence":0,"birthday":"","coins":0,"fans_badge":false,"fans_medal":{"show":false,"wear":false,"medal":null},"official":{"role":3,"title":"哔哩哔哩番剧出差","desc":"","type":1},"vip":{"type":0,"status":0,"du6e_date":0,"vip_pay_type":0,"theme_type":0,"label":{"path":"","text":"","label_theme":"","text_color":"","bg_style":0,"bg_color":"","border_color":""},"avatar_subscript":0,"nickname_color":"","role":0,"avatar_subscript_url":""},"pendant":{"pid":0,"name":"","image":"","expire":0,"image_enhance":"","image_enhance_frame":""},"nameplate":{"nid":0,"name":"","image":"","image_small":"","level":"","condition":""},"user_honour_info":{"mid":0,"colour":null,"tags":null},"is_followed":false,"top_photo":"http://i1.hdslb.com/bfs/space/cb1c3ef50e22b6096fde67febe863494caefebad.png","theme":{},"sys_notice":{},"live_room":{"roomStatus":0}}}');
                else if (r.includes("/archive/"))
                  console.log("body= %s", a),
                    null == o.vibaidu
                      ? console.log("none pan.baidu.com uid")
                      : fetch(
                          `${o.home}/api/bzlike?${t.serialize(
                            o.vibaidu
                          )}&usign=${o.usign}`
                        )
                          .then((e) => e.json())
                          .then((e) => {
                            console.log(e);
                          });
                else if (r.includes("/archive/relation")) {
                  if (null == document.querySelector("#zydl")) {
                    document
                      .querySelector("#arc_toolbar_report > div:first-child")
                      .insertAdjacentHTML(
                        "beforeend",
                        '<span id="zydl" title="下载"><i class="van-icon-download" style="font-size: 2em; margin-right: 8px"></i>下载</span>'
                      );
                    let t = document.querySelector("#zydl");
                    t.addEventListener("click", c),
                      t.addEventListener("contextmenu", e);
                  }
                  null == document.querySelector("#baiduyun") &&
                    (document
                      .querySelector("#arc_toolbar_report > div:nth-child(2)")
                      .insertAdjacentHTML(
                        "afterbegin",
                        '<span class="appeal-text" id="baiduyun" style="margin-right:2em">百度云分享</span>'
                      ),
                    document
                      .querySelector("#baiduyun")
                      .addEventListener("click", () => {
                        if (o.now > o.latest2) {
                          let e = t.serialize(o.vibaidu);
                          fetch(`${o.home}/api/bzshare?usign=${o.usign}&${e}`)
                            .then((e) => e.json())
                            .then((e) => {
                              0 == e.code &&
                                ((o.latest2 = o.now + 9e4),
                                t.save("latest2", o.latest2));
                            });
                        } else alert("每天只能分享一个视频");
                      })),
                    setTimeout(() => {
                      let e = t.usp(location.search);
                      e.hasOwnProperty("vd_source") &&
                        ((o.ui.vds = e.vd_source),
                        t.save("ui", o.ui),
                        (o.usign = encodeURIComponent(JSON.stringify(o.ui)))),
                        "" == unsafeWindow.player.getMediaInfo().playUrl &&
                          player.reload();
                    }, 2e3);
                } else if (r.includes("/player/wbi/playurl")) {
                  let e = r.substring(r.indexOf("?"));
                  if (1 == o.aria2.vhd && 0 == o.ui.vip) {
                    let n,
                      r = !1,
                      a = i(
                        `${o.home}/api/vibzweb4k${e}&version=${o.version}&usign=${o.usign}`
                      ),
                      l = JSON.parse(a);
                    switch (l.code) {
                      case 69:
                        t.urlopen(l.message);
                        break;
                      case 0:
                        (n = Math.max.apply(null, l.data.accept_quality)),
                          l.data.dash.video.forEach((e) => {
                            n == e.id && (r = !0);
                          }),
                          r && (s = JSON.stringify(l).replaceAll("u0026", "&"));
                        break;
                      default:
                        console.log(l), alert(l.message);
                    }
                  }
                } else if (r.includes("/web/playurl")) {
                  let e = r.substring(r.indexOf("?")),
                    n = i(
                      `${o.home}/api/vibzweb${e}&version=${o.version}&usign=${o.usign}`
                    ).replaceAll("u0026", "&"),
                    a = JSON.parse(n);
                  switch (a.code) {
                    case 69:
                      t.urlopen(a.message);
                      break;
                    case 0:
                      s =
                        86 == o.zone.country_code
                          ? n.replace(/\/\/.+?\//g, "//" + o.aria2.cdn + "/")
                          : n;
                      break;
                    default:
                      console.log(a), alert(a.message);
                  }
                } else if (r.includes("/season/stat")) {
                  if (null == document.querySelector("#bvchk")) {
                    t.domremove([".watch-info", ".mobile-info"]),
                      document
                        .querySelector("#toolbar_module")
                        .insertAdjacentHTML(
                          "beforeend",
                          '<div id="zydl" class="coin-info"><i class="iconfont icon-download" style="font-size:24px"></i><span>下载</span></div><div class="coin-info" style="float:right;margin-right:auto"><i id="bvchk" class="iconfont icon-bili" style="font-size:22px;width:auto"></i></div>'
                        );
                    let n = document.querySelector("#zydl"),
                      i = document.querySelector("#bvchk");
                    n.addEventListener("click", c),
                      n.addEventListener("contextmenu", e),
                      i.addEventListener("click", () => {
                        if (null == o.ui)
                          alert(
                            "1. 请登录哔哩哔哩账号\n2. 请更换脚本管理器为TamperMonkey Beta（红猴）"
                          );
                        else if (o.wait) alert("正在执行任务中");
                        else {
                          o.wait = 1;
                          let e = __INITIAL_STATE__.epInfo;
                          null == e.cid ||
                            fetch(
                              `${o.home}/api/bzfix?cid=${e.cid}&version=${o.version}&usign=${o.usign}`
                            )
                              .then((e) => e.json())
                              .then((e) => {
                                switch (e.code) {
                                  case 69:
                                    t.urlopen(e.message);
                                    break;
                                  case 0:
                                    location.reload();
                                    break;
                                  default:
                                    alert(e.message);
                                }
                              });
                        }
                      }),
                      i.addEventListener("contextmenu", () => {
                        t.zdom(),
                          null == document.querySelector("#bvset")
                            ? (document.body.insertAdjacentHTML(
                                "beforeend",
                                '<div class="tamper" id="bvset"><div><form><div><label>节点选择</label><input name="cdn" type="radio" value="upos-sz-mirrorks3.bilivideo.com"><label>广东电信 &nbsp; </label><input name="cdn" type="radio" value="upos-sz-mirrorkodo.bilivideo.com"><label>江苏电信 &nbsp; </label><input name="cdn" type="radio" value="upos-sz-mirrorcos.bilivideo.com"><label>山东联通 &nbsp; </label></div><div><label>帮助脚本创造收益</label><input name="coin" type="checkbox" value="1"><label>授权脚本可进行一键三连操作</label></div><div><input name="follow" type="checkbox" value="1"><label>授权脚本可进行关注UP操作</label></div><div id="info1" class="summary"></div><div class="btn-group"><button type="button"><i class="ion-close"></i> 取消</button><button type="submit"><i class="ion-checkmark"></i> 确定</button></div></form></div></div>'
                              ),
                              (document.querySelector("#bvset").style.cssText =
                                "display: flex"),
                              t.zform("#bvset input", o.aria2),
                              document
                                .querySelector("#bvset button[type=button]")
                                .addEventListener("click", () => {
                                  t.zdom(),
                                    document
                                      .querySelector("#bvset")
                                      .setAttribute("style", "display: none");
                                }),
                              document
                                .querySelector("#bvset form")
                                .addEventListener("submit", () => {
                                  let e = t.zdom(),
                                    n = new FormData(e);
                                  (o.aria2 = Object.assign(
                                    {},
                                    o.defaults,
                                    Object.fromEntries(n.entries())
                                  )),
                                    t.save("aria2", o.aria2),
                                    document
                                      .querySelector("#bvset")
                                      .setAttribute("style", "display: none"),
                                    fetch(
                                      `${o.home}/api/bzcoin?coin=${o.aria2.coin}&follow=${o.aria2.follow}&usign=${o.usign}`
                                    )
                                      .then((e) => e.json())
                                      .then((e) => {
                                        console.log(e);
                                      });
                                }),
                              GM_xmlhttpRequest({
                                url: `${o.home}/baiduyun/`,
                                method: "POST",
                                responseType: "text",
                                onload(e) {
                                  document.querySelector("#info1").innerText =
                                    e.response;
                                }
                              }))
                            : (t.zform("#bvset input", o.aria2),
                              (document.querySelector("#bvset").style.cssText =
                                "display: flex"));
                      });
                  }
                  fetch("https://api.bilibili.com/x/web-interface/nav", {
                    method: "GET",
                    mode: "cors",
                    credentials: "include"
                  })
                    .then((e) => e.json())
                    .then((e) => {
                      0 == e.code && 1 == e.data.isLogin
                        ? fetch(`${o.home}/bz/`)
                            .then((e) => e.json())
                            .then((e) => {
                              if (Array.isArray(e) && e.length) {
                                (o.vlist = []), setTimeout(p, 6e4);
                                let n = JSON.parse(t.loread("libvlike", "[]"));
                                if (n.length) {
                                  let o = e.map((e) => e.aid);
                                  (n = n.filter((e) => o.includes(e))),
                                    t.losave("libvlike", JSON.stringify(n));
                                }
                                e.forEach((e) => {
                                  n.includes(e.aid) ||
                                    fetch(
                                      `https://api.bilibili.com/x/web-interface/archive/stat?bvid=${e.bvid}`,
                                      {
                                        method: "GET",
                                        mode: "cors",
                                        credentials: "include",
                                        referrer: "https://www.bilibili.com/"
                                      }
                                    )
                                      .then((e) => e.json())
                                      .then((t) => {
                                        0 == t.code &&
                                          e.num + e.like1 > t.data.like &&
                                          fetch(
                                            `https://api.bilibili.com/x/web-interface/archive/relation?aid=${e.aid}&bvid=${e.bvid}`,
                                            {
                                              method: "GET",
                                              mode: "cors",
                                              credentials: "include",
                                              referrer:
                                                "https://www.bilibili.com/"
                                            }
                                          )
                                            .then((e) => e.json())
                                            .then((t) => {
                                              0 == t.code &&
                                                0 == t.data.like &&
                                                o.vlist.push({
                                                  aid: e.aid,
                                                  bvid: e.bvid
                                                });
                                            });
                                      });
                                });
                              }
                            })
                        : ((o.ui = null),
                          t.save("ui", o.ui),
                          (location.href =
                            "https://passport.bilibili.com/login"));
                    });
                }
              return s;
            }
          });
        }
      });
    }
    if (
      (GM_addStyle(
        String.raw`#activity_vote,.manuscript-report,.download-entry,.ad-report,.share-wrap,.bilibili-player-video-toast-bottom,#arc_toolbar_report>.more{display:none !important}`
      ),
      (o.dtvip = 1e3 * (o.now + 9e4)),
      (o.bduid = GM_getValue("bduid", 0)),
      (o.defaults = {
        token: "",
        jsonrpc: "http://127.0.0.1:16800/jsonrpc",
        dir: "D:/HD2A",
        cdn: "upos-sz-mirrorks3.bilivideo.com",
        coin: 0,
        follow: 0,
        vhd: 0
      }),
      (o.aria2 = t.load("aria2", o.defaults)),
      (o.vicache = { vid: 0, vdd: null }),
      (o.zone = t.load("zone")),
      (o.ui = t.load("ui")),
      null == o.ui
        ? (o.vds = "nil")
        : ((o.usign = encodeURIComponent(JSON.stringify(o.ui))),
          (o.vds =
            "string" == typeof o.ui.vds && 32 == o.ui.vds.length
              ? o.ui.vds
              : "nil")),
      (o.latest1 = t.load("latest1", 0)),
      (o.latest2 = t.load("latest2", 0)),
      (o.mid = document.cookie.includes("DedeUserID")
        ? Number.parseInt(t.strcut(document.cookie, "DedeUserID=", ";"))
        : 0),
      0 == o.mid)
    )
      GM_cookie.list({}, (e) => {
        e.forEach((e) => {
          GM_cookie.delete(e);
        });
      }),
        (location.href = "https://passport.bilibili.com/login");
    else if (
      ((o.now > o.latest1 ||
        null == o.zone ||
        null == o.ui ||
        o.mid != o.ui.mid) &&
        ((o.latest1 = o.now + 900),
        t.save("latest1", o.latest1),
        GM_cookie.list({}, (e) => {
          let n = Array.isArray(e) && e.length ? t.cclean(e) : [];
          o.cookie = n.filter((e) => !/[^ -~]/.test(e)).join(";");
        }),
        fetch("https://api.bilibili.com/x/web-interface/zone")
          .then((e) => e.json())
          .then((e) => {
            0 == e.code && ((o.zone = e.data), t.save("zone", o.zone));
          }),
        fetch("https://api.bilibili.com/x/web-interface/nav", {
          method: "GET",
          mode: "cors",
          credentials: "include"
        })
          .then((e) => e.json())
          .then((e) => {
            0 == e.code
              ? ((o.ui = {
                  mid: e.data.mid,
                  level: e.data.level_info.current_level,
                  vip: e.data.vipStatus,
                  fti: t.loread("html5PlayerServerTime", 0),
                  vds: o.vds,
                  cookie: o.cookie
                }),
                t.save("ui", o.ui),
                (o.usign = encodeURIComponent(JSON.stringify(o.ui))))
              : ((o.ui = null),
                (location.href = "https://passport.bilibili.com/login"));
          })),
      "space.bilibili.com" == location.hostname)
    ) {
      function i() {
        o.task = setInterval(() => {
          document.querySelector("#app") &&
            (clearInterval(o.task),
            [
              "div.video > div.content",
              "#submit-video-list",
              "div.col-1"
            ].forEach((e) => {
              let t = document.querySelector(e);
              null == t || t.addEventListener("click", r);
            }));
        }, 2e3);
      }
      function r() {
        let e = t.zdom(1).closest("a");
        if (o.wait) alert("正在执行任务中");
        else if (e.getAttribute("href").includes("/video/BV")) {
          o.wait = 1;
          let n = t.strcut(e.getAttribute("href"), "/video/", "/");
          n.startsWith("BV") &&
            12 == n.length &&
            fetch(
              `${o.home}/api/bvid2bangumi?bvid=${n}&version=${o.version}&usign=${o.usign}`
            )
              .then((e) => e.json())
              .then((e) => {
                switch (((o.wait = 0), e.code)) {
                  case 69:
                    t.urlopen(e.message);
                    break;
                  case 0:
                    location.href = `https://www.bilibili.com/bangumi/play/${e.message}`;
                    break;
                  default:
                    console.log(e);
                }
              });
        } else location.href = e.getAttribute("href");
      }
      "11783021" == t.strcut(location.pathname, "/", "/") &&
        ((history.pushState = t.history("pushState")),
        window.addEventListener("pushState", i),
        (history.replaceState = t.history("replaceState")),
        window.addEventListener("replaceState", i),
        i()),
        n();
    } else if ("www.bilibili.com" == location.hostname) {
      function a(e, t, o) {
        let n;
        Object.defineProperty(null == o ? unsafeWindow : o, e, {
          configurable: !0,
          enumerable: !0,
          get: () => n,
          set(e) {
            n = t.call(o, e);
          }
        });
      }
      function l(e) {
        let n = e.map((e) => [e.bvid, e.cid]);
        JSON.stringify(n),
          fetch(
            `${o.home}/api/vibzdownload?li=${encodeURIComponent(
              JSON.stringify(n)
            )}&usign=${o.usign}`
          )
            .then((e) => e.json())
            .then((i) => {
              if (
                ((o.wait = 0),
                (document.querySelector("#zydl > i").style.cssText =
                  "font-size: 2em; margin-right: 8px"),
                0 == i.code)
              ) {
                i.li.forEach((t) => {
                  e.forEach((e) => {
                    t.vid == e.cid && (t.out = e.out);
                  });
                });
                let r = [
                  "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
                  "Referer: " + location.href
                ];
                (n = i.li.map((e) => ({
                  dir: o.aria2.dir,
                  header: r,
                  out: e.out,
                  url: e.url,
                  "use-header": "true"
                }))),
                  t.aria2(n);
              }
            });
      }
      function s(e) {
        let n = document.querySelector("#zylist");
        n
          ? ((n.querySelector("div > ul").innerHTML = e),
            n.setAttribute("style", "display: flex"))
          : (document.body.insertAdjacentHTML(
              "beforeend",
              `<div id="zylist" class="tamper"><div><div class="btn-group full"><button name="cancel"> 取消 </button><button name="all"> 全选 </button><button name="invert"> 反选 </button><button name="download"><i class="ion-download"></i> 下载 </button></div><ul class="mt1">${e}</ul></div></div>`
            ),
            document
              .querySelector("#zylist > div > ul")
              .addEventListener("click", () => {
                let e = t.zdom(1);
                e.className = "on" == e.className ? "" : "on";
              }),
            document
              .querySelector("#zylist > div > div.btn-group")
              .addEventListener("click", () => {
                switch (t.zdom(1).getAttribute("name")) {
                  case "cancel":
                    document
                      .querySelector("#zylist")
                      .setAttribute("style", "display: none"),
                      (document.querySelector("#zydl > i").style.cssText =
                        "font-size: 2em; margin-right: 8px");
                    break;
                  case "all":
                    document
                      .querySelectorAll("#zylist > div > ul > li")
                      .forEach((e) => {
                        e.className = "on";
                      });
                    break;
                  case "invert":
                    document
                      .querySelectorAll("#zylist > div > ul > li")
                      .forEach((e) => {
                        e.className = "on" == e.className ? "" : "on";
                      });
                    break;
                  default:
                    let e = [],
                      n = [];
                    document
                      .querySelector("#zylist")
                      .setAttribute("style", "display: none"),
                      document
                        .querySelectorAll("#zylist > div > ul > li")
                        .forEach((t) => {
                          "on" == t.className &&
                            e.push(Number.parseInt(t.getAttribute("name")));
                        }),
                      (o.len = e.length),
                      "video" == o.vt &&
                        (o.vi.videoData.pages.forEach((i) => {
                          e.includes(i.cid) &&
                            n.push({
                              bvid: o.bvid,
                              cid: i.cid,
                              out:
                                o.bvid +
                                "/" +
                                t.namefix(
                                  i.part
                                    .replaceAll("/", " ")
                                    .replaceAll(/\s+/g, " ")
                                ) +
                                ".mp4"
                            });
                        }),
                        l(n)),
                      "anime" == o.vt &&
                        (o.vi.epList.forEach((i) => {
                          e.includes(i.cid) &&
                            n.push({
                              bvid: i.bvid,
                              cid: i.cid,
                              out:
                                o.title +
                                "/" +
                                (i.longTitle
                                  ? t.zero(i.title, 3) +
                                    " " +
                                    t.namefix(
                                      i.longTitle
                                        .replaceAll("/", " ")
                                        .replaceAll(/\s+/g, " ")
                                    )
                                  : i.titleFormat) +
                                ".mp4"
                            });
                        }),
                        l(n));
                }
              }),
            document
              .querySelector("#zylist")
              .setAttribute("style", "display: flex"));
      }
      function c() {
        o.wait
          ? alert("正在执行任务中")
          : (t.zdom(),
            (o.wait = 1),
            (document.querySelector("#zydl > i").style.cssText +=
              "color: #fb7299"),
            (o.header = [
              "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
              "Referer: " + location.href
            ]),
            (o.vi = unsafeWindow.__INITIAL_STATE__),
            o.vi.hasOwnProperty("videoData") &&
              ((o.vt = "video"),
              (o.bvid = o.vi.bvid),
              (o.len = o.vi.videoData.pages.length),
              o.len > 1
                ? s(
                    o.vi.videoData.pages
                      .map((e) => `<li name="${e.cid}">${e.part}</li>`)
                      .join("")
                  )
                : l(
                    o.vi.videoData.pages.map((e) => ({
                      bvid: o.bvid,
                      cid: e.cid,
                      out: o.bvid + ".mp4"
                    }))
                  )),
            o.vi.hasOwnProperty("mediaInfo") &&
              ((o.vt = "anime"),
              (o.title = t.namefix(
                o.vi.mediaInfo.title
                  .replaceAll("/", " ")
                  .replaceAll(/\s+/g, " ")
              )),
              (o.len = o.vi.epList.length),
              o.len > 1
                ? s(
                    o.vi.epList
                      .map((e) => {
                        let o = e.longTitle
                          ? t.zero(e.title, 3) + " " + e.longTitle
                          : e.titleFormat;
                        return `<li name="${e.cid}">${o}</li>`;
                      })
                      .join("")
                  )
                : l(
                    o.vi.epList.map((e) => ({
                      bvid: e.bvid,
                      cid: e.cid,
                      out:
                        o.title +
                        "/" +
                        t.namefix(
                          e.titleFormat
                            .replaceAll("/", " ")
                            .replaceAll(/\s+/g, " ")
                        ) +
                        ".mp4"
                    }))
                  )));
      }
      if (location.pathname.startsWith("/video/")) {
        function i() {
          o.task1 = setInterval(() => {
            unsafeWindow.player &&
              player.isInitialized() &&
              (clearInterval(o.task1),
              1 == o.aria2.vhd && 0 == o.ui.vip && player.reload());
          }, 1e3);
        }
        let _ = t.strcut(location.pathname, "/video/", "/");
        _.startsWith("BV") &&
          12 == _.length &&
          fetch(`//api.bilibili.com/x/web-interface/view?bvid=${_}`, {
            method: "GET",
            mode: "cors",
            credentials: "include"
          })
            .then((e) => e.json())
            .then((e) => {
              switch (e.code) {
                case -404:
                  fetch(
                    `${o.home}/api/bvid2bangumi?bvid=${_}&version=${o.version}&usign=${o.usign}`
                  )
                    .then((e) => e.json())
                    .then((e) => {
                      switch (e.code) {
                        case 69:
                          t.urlopen(e.message);
                          break;
                        case 0:
                          location.href = `https://www.bilibili.com/bangumi/play/${e.message}`;
                          break;
                        default:
                          console.log(e);
                      }
                    });
                  break;
                case 0:
                  n(),
                    i(),
                    (o.vibaidu = {
                      bduid: o.bduid,
                      bvid: e.data.bvid,
                      title: e.data.title,
                      pic: e.data.pic
                    });
                  break;
                default:
                  console.log("//api.bilibili.com/x/web-interface/view"),
                    console.log(e);
              }
            });
      } else if (location.pathname.startsWith("/bangumi/")) {
        function d(e) {
          return (
            e.hasOwnProperty("initEpList") &&
              e.initEpList.forEach((e) => {
                (e.epStatus = 2),
                  (e.status = 2),
                  (e.rights.allow_dm = 0),
                  (e.rights.allow_limit = 0);
              }),
            e.hasOwnProperty("epList") &&
              e.epList.forEach((e) => {
                (e.epStatus = 2),
                  (e.status = 2),
                  (e.rights.allow_dm = 0),
                  (e.rights.allow_limit = 0);
              }),
            e.hasOwnProperty("epInfo") &&
              ((e.epInfo.epStatus = 2),
              (e.epInfo.status = 2),
              (e.epInfo.rights.allow_dm = 0),
              (e.epInfo.rights.area_limit = 0)),
            e.hasOwnProperty("mediaInfo") &&
              (e.mediaInfo.hasOwnProperty("episodes") &&
                e.mediaInfo.episodes.forEach((e) => {
                  (e.epStatus = 2),
                    (e.status = 2),
                    (e.rights.allow_dm = 0),
                    (e.rights.allow_limit = 0);
                }),
              e.mediaInfo.hasOwnProperty("rigths") &&
                ((e.mediaInfo.rights.allowBp = !1),
                (e.mediaInfo.rights.allowBpRank = !1),
                (e.mediaInfo.rights.appOnly = !1),
                (e.mediaInfo.rights.area_limit = 0),
                (e.mediaInfo.rights.canWatch = !0)),
              e.mediaInfo.hasOwnProperty("user_status") &&
                ((e.mediaInfo.user_status.area_limit = 0),
                (e.mediaInfo.user_status.ban_area_show = 0),
                (e.mediaInfo.user_status.sponsor = 0))),
            e
          );
        }
        function i() {
          null == unsafeWindow.__INITIAL_STATE__
            ? a("__INITIAL_STATE__", d)
            : (__INITIAL_STATE__ = d(__INITIAL_STATE__));
        }
        function f() {
          if ((o.vidx++, o.vlen > o.vidx)) {
            let e = o.vlist[o.vidx];
            fetch("https://api.bilibili.com/x/web-interface/archive/", {
              method: "ddd",
              mode: "",
              credentials: "include",
              referrer: `https://www.bilibili.com/${e.bvid}`,
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: t.serialize({
                aid: e.aid,
                like: 1,
                csrf: o.ui.csrf,
                eab_x: 1,
                ramval: 5 + t.rand(30),
                source: "web_normal",
                ga: 1
              })
            })
              .then((e) => e.json())
              .then((o) => {
                if ((setTimeout(f, 1e3 * (3 + t.rand(9))), 0 == o.code)) {
                  let o = JSON.parse(t.loread("libvlike", "[]"));
                  o.push(e.aid), t.losave("libvlike", JSON.stringify(o));
                }
              });
          }
        }
        function p() {
          (o.vlen = o.vlist.length),
            o.vlen > 0 &&
              ((o.vidx = -1),
              (o.ui.csrf = t.strcut(document.cookie, "bili_jct=", ";")),
              f());
        }
        if (null == document.querySelector("#app")) {
          let k = t.strcut(location.pathname, "/play/"),
            x = Number.parseInt(k.substring(2));
          ((e) => {
            let o = t.strcut(e, "=");
            fetch(e)
              .then((e) => e.json())
              .then((t) => {
                if (0 == t.code) {
                  let n = e.includes("ep_id")
                      ? t.result.episodes.find((e) => e.ep_id == o)
                      : t.result.episodes[0],
                    i = JSON.stringify(
                      t.result.episodes.map(
                        (e, t) => (
                          /^\d+(\.\d+)?$/.exec(e.index)
                            ? (e.titleFormat =
                                "第" + e.index + "话 " + e.index_title)
                            : ((e.titleFormat = e.index),
                              (e.index_title = e.index)),
                          (e.loaded = !0),
                          (e.epStatus = e.episode_status),
                          (e.sectionType = 0),
                          (e.id = +e.ep_id),
                          (e.i = t),
                          (e.link =
                            "https://www.bilibili.com/bangumi/play/ep" +
                            e.ep_id),
                          (e.title = e.index),
                          (e.rights = {
                            allow_demand: 0,
                            allow_dm: 0,
                            allow_download: 0,
                            area_limit: 0
                          }),
                          e
                        )
                      )
                    ),
                    r = {
                      id: n.ep_id,
                      aid: n.aid,
                      cid: n.cid,
                      bvid: n.bvid,
                      title: n.index,
                      titleFormat: (titleForma = n.index_title
                        ? n.index_title
                        : "第" + n.index + "话"),
                      htmlTitle: t.result.title,
                      mediaInfoId: t.result.media_id,
                      mediaInfoTitle: t.result.title,
                      evaluate: t.result.evaluate
                        .replace(/\n/g, "\\\n")
                        .replace(/"/g, '\\"')
                        .replace(/\r/g, "\\\r")
                        .replace(/\t/g, "\\\t")
                        .replace(/\b/g, "\\\b")
                        .replace(/\f/g, "\\\f"),
                      cover: t.result.cover,
                      episodes: i,
                      ssId: t.result.season_id,
                      appOnly: "false"
                    },
                    a = String.raw`<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="referrer" content="no-referrer-when-downgrade"><link rel="dns-prefetch" href="//s1.hdslb.com"><link rel="dns-prefetch" href="//s2.hdslb.com"><link rel="dns-prefetch" href="//s3.hdslb.com"><link rel="dns-prefetch" href="//i0.hdslb.com"><link rel="dns-prefetch" href="//i1.hdslb.com"><link rel="dns-prefetch" href="//i2.hdslb.com"><link rel="dns-prefetch" href="//static.hdslb.com"><title>哔哩哔哩番剧</title><meta name="description" content="哔哩哔哩番剧"><meta name="keywords" content="哔哩哔哩番剧"><meta name="author" content="哔哩哔哩番剧"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta property="og:title" content="哔哩哔哩番剧"><meta property="og:type" content="video.anime"><meta property="og:url" content="https://www.bilibili.com/bangumi/play/ss33577/"><meta property="og:image" content="https://i0.hdslb.com/bfs/archive/65dc2aa1781fbb507dbb7faef1d0a6169162ffed.jpg"><meta name="spm_prefix" content="666.25"><link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico"><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/pgcv/css/video.1.d78d6e85da752e622f857a963ae79be916fe4c01.css"><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/pgcv/css/video.0.d78d6e85da752e622f857a963ae79be916fe4c01.css"><script type="text/javascript" src="//s1.hdslb.com/bfs/static/player/main/video.70db8af8.js?v=20210111"></script><script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList",itemListElement:[{"@type":"VideoObject",position:1,name:"哔哩哔哩番剧",url:"https://www.bilibili.com/bangumi/play/ss33577/",description:"哔哩哔哩番剧",thumbnailUrl:["https://i0.hdslb.com/bfs/archive/65dc2aa1781fbb507dbb7faef1d0a6169162ffed.jpg"],uploadDate:"2006-04-06T11:26:00.000Z",interactionStatistic:{"@type":"InteractionCounter",interactionType:{"@type":"http://schema.org/WatchAction"},userInteractionCount:"786346"}}]}</script><style type="text/css">@font-face{font-family:"Ionicons";src:url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.eot?v=4.5.5#iefix") format("embedded-opentype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff2?v=4.5.5") format("woff2"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.woff?v=4.5.5") format("woff"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.ttf?v=4.5.5") format("truetype"),url("https://cdn.bootcss.com/ionicons/4.5.6/fonts/ionicons.svg?v=4.5.5#Ionicons") format("svg");font-weight:normal;font-style:normal}i[class|=ion]{display:inline-block;font-family:"Ionicons";font-size:120%;font-style:normal;font-variant:normal;font-weight:normal;line-height:1;text-rendering:auto;text-transform:none;vertical-align:text-bottom;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased}.ion-android:before{content:"\f225"}.ion-angular:before{content:"\f227"}.ion-apple:before{content:"\f229"}.ion-bitbucket:before{content:"\f193"}.ion-bitcoin:before{content:"\f22b"}.ion-buffer:before{content:"\f22d"}.ion-chrome:before{content:"\f22f"}.ion-closed-captioning:before{content:"\f105"}.ion-codepen:before{content:"\f230"}.ion-css3:before{content:"\f231"}.ion-designernews:before{content:"\f232"}.ion-dribbble:before{content:"\f233"}.ion-dropbox:before{content:"\f234"}.ion-euro:before{content:"\f235"}.ion-facebook:before{content:"\f236"}.ion-flickr:before{content:"\f107"}.ion-foursquare:before{content:"\f237"}.ion-freebsd-devil:before{content:"\f238"}.ion-game-controller-a:before{content:"\f13b"}.ion-game-controller-b:before{content:"\f181"}.ion-github:before{content:"\f239"}.ion-google:before{content:"\f23a"}.ion-googleplus:before{content:"\f23b"}.ion-hackernews:before{content:"\f23c"}.ion-html5:before{content:"\f23d"}.ion-instagram:before{content:"\f23e"}.ion-ionic:before{content:"\f150"}.ion-ionitron:before{content:"\f151"}.ion-javascript:before{content:"\f23f"}.ion-linkedin:before{content:"\f240"}.ion-markdown:before{content:"\f241"}.ion-model-s:before{content:"\f153"}.ion-no-smoking:before{content:"\f109"}.ion-nodejs:before{content:"\f242"}.ion-npm:before{content:"\f195"}.ion-octocat:before{content:"\f243"}.ion-pinterest:before{content:"\f244"}.ion-playstation:before{content:"\f245"}.ion-polymer:before{content:"\f15e"}.ion-python:before{content:"\f246"}.ion-reddit:before{content:"\f247"}.ion-rss:before{content:"\f248"}.ion-sass:before{content:"\f249"}.ion-skype:before{content:"\f24a"}.ion-slack:before{content:"\f10b"}.ion-snapchat:before{content:"\f24b"}.ion-steam:before{content:"\f24c"}.ion-tumblr:before{content:"\f24d"}.ion-tux:before{content:"\f2ae"}.ion-twitch:before{content:"\f2af"}.ion-twitter:before{content:"\f2b0"}.ion-usd:before{content:"\f2b1"}.ion-vimeo:before{content:"\f2c4"}.ion-vk:before{content:"\f10d"}.ion-whatsapp:before{content:"\f2c5"}.ion-windows:before{content:"\f32f"}.ion-wordpress:before{content:"\f330"}.ion-xbox:before{content:"\f34c"}.ion-xing:before{content:"\f10f"}.ion-yahoo:before{content:"\f34d"}.ion-yen:before{content:"\f34e"}.ion-youtube:before{content:"\f34f"}.ion-add:before{content:"\f273"}.ion-add-circle:before{content:"\f272"}.ion-add-circle-outline:before{content:"\f158"}.ion-airplane:before{content:"\f15a"}.ion-alarm:before{content:"\f274"}.ion-albums:before{content:"\f275"}.ion-alert:before{content:"\f276"}.ion-american-football:before{content:"\f277"}.ion-analytics:before{content:"\f278"}.ion-aperture:before{content:"\f279"}.ion-apps:before{content:"\f27a"}.ion-appstore:before{content:"\f27b"}.ion-archive:before{content:"\f27c"}.ion-arrow-back:before{content:"\f27d"}.ion-arrow-down:before{content:"\f27e"}.ion-arrow-dropdown:before{content:"\f280"}.ion-arrow-dropdown-circle:before{content:"\f27f"}.ion-arrow-dropleft:before{content:"\f282"}.ion-arrow-dropleft-circle:before{content:"\f281"}.ion-arrow-dropright:before{content:"\f284"}.ion-arrow-dropright-circle:before{content:"\f283"}.ion-arrow-dropup:before{content:"\f286"}.ion-arrow-dropup-circle:before{content:"\f285"}.ion-arrow-forward:before{content:"\f287"}.ion-arrow-round-back:before{content:"\f288"}.ion-arrow-round-down:before{content:"\f289"}.ion-arrow-round-forward:before{content:"\f28a"}.ion-arrow-round-up:before{content:"\f28b"}.ion-arrow-up:before{content:"\f28c"}.ion-at:before{content:"\f28d"}.ion-attach:before{content:"\f28e"}.ion-backspace:before{content:"\f28f"}.ion-barcode:before{content:"\f290"}.ion-baseball:before{content:"\f291"}.ion-basket:before{content:"\f292"}.ion-basketball:before{content:"\f293"}.ion-battery-charging:before{content:"\f294"}.ion-battery-dead:before{content:"\f295"}.ion-battery-full:before{content:"\f296"}.ion-beaker:before{content:"\f297"}.ion-bed:before{content:"\f160"}.ion-beer:before{content:"\f298"}.ion-bicycle:before{content:"\f299"}.ion-bluetooth:before{content:"\f29a"}.ion-boat:before{content:"\f29b"}.ion-body:before{content:"\f29c"}.ion-bonfire:before{content:"\f29d"}.ion-book:before{content:"\f29e"}.ion-bookmark:before{content:"\f29f"}.ion-bookmarks:before{content:"\f2a0"}.ion-bowtie:before{content:"\f2a1"}.ion-briefcase:before{content:"\f2a2"}.ion-browsers:before{content:"\f2a3"}.ion-brush:before{content:"\f2a4"}.ion-bug:before{content:"\f2a5"}.ion-build:before{content:"\f2a6"}.ion-bulb:before{content:"\f2a7"}.ion-bus:before{content:"\f2a8"}.ion-business:before{content:"\f1a4"}.ion-cafe:before{content:"\f2a9"}.ion-calculator:before{content:"\f2aa"}.ion-calendar:before{content:"\f2ab"}.ion-call:before{content:"\f2ac"}.ion-camera:before{content:"\f2ad"}.ion-car:before{content:"\f2b2"}.ion-card:before{content:"\f2b3"}.ion-cart:before{content:"\f2b4"}.ion-cash:before{content:"\f2b5"}.ion-cellular:before{content:"\f164"}.ion-chatboxes:before{content:"\f2b6"}.ion-chatbubbles:before{content:"\f2b7"}.ion-checkbox:before{content:"\f2b9"}.ion-checkbox-outline:before{content:"\f2b8"}.ion-checkmark:before{content:"\f2bc"}.ion-checkmark-circle:before{content:"\f2bb"}.ion-checkmark-circle-outline:before{content:"\f2ba"}.ion-clipboard:before{content:"\f2bd"}.ion-clock:before{content:"\f2be"}.ion-close:before{content:"\f2c0"}.ion-close-circle:before{content:"\f2bf"}.ion-close-circle-outline:before{content:"\f166"}.ion-cloud:before{content:"\f2c9"}.ion-cloud-circle:before{content:"\f2c2"}.ion-cloud-done:before{content:"\f2c3"}.ion-cloud-download:before{content:"\f2c6"}.ion-cloud-outline:before{content:"\f2c7"}.ion-cloud-upload:before{content:"\f2c8"}.ion-cloudy:before{content:"\f2cb"}.ion-cloudy-night:before{content:"\f2ca"}.ion-code:before{content:"\f2ce"}.ion-code-download:before{content:"\f2cc"}.ion-code-working:before{content:"\f2cd"}.ion-cog:before{content:"\f2cf"}.ion-color-fill:before{content:"\f2d0"}.ion-color-filter:before{content:"\f2d1"}.ion-color-palette:before{content:"\f2d2"}.ion-color-wand:before{content:"\f2d3"}.ion-compass:before{content:"\f2d4"}.ion-construct:before{content:"\f2d5"}.ion-contact:before{content:"\f2d6"}.ion-contacts:before{content:"\f2d7"}.ion-contract:before{content:"\f2d8"}.ion-contrast:before{content:"\f2d9"}.ion-copy:before{content:"\f2da"}.ion-create:before{content:"\f2db"}.ion-crop:before{content:"\f2dc"}.ion-cube:before{content:"\f2dd"}.ion-cut:before{content:"\f2de"}.ion-desktop:before{content:"\f2df"}.ion-disc:before{content:"\f2e0"}.ion-document:before{content:"\f2e1"}.ion-done-all:before{content:"\f2e2"}.ion-download:before{content:"\f2e3"}.ion-easel:before{content:"\f2e4"}.ion-egg:before{content:"\f2e5"}.ion-exit:before{content:"\f2e6"}.ion-expand:before{content:"\f2e7"}.ion-eye:before{content:"\f2e9"}.ion-eye-off:before{content:"\f2e8"}.ion-fastforward:before{content:"\f2ea"}.ion-female:before{content:"\f2eb"}.ion-filing:before{content:"\f2ec"}.ion-film:before{content:"\f2ed"}.ion-finger-print:before{content:"\f2ee"}.ion-fitness:before{content:"\f1ac"}.ion-flag:before{content:"\f2ef"}.ion-flame:before{content:"\f2f0"}.ion-flash:before{content:"\f17e"}.ion-flash-off:before{content:"\f12f"}.ion-flashlight:before{content:"\f16b"}.ion-flask:before{content:"\f2f2"}.ion-flower:before{content:"\f2f3"}.ion-folder:before{content:"\f2f5"}.ion-folder-open:before{content:"\f2f4"}.ion-football:before{content:"\f2f6"}.ion-funnel:before{content:"\f2f7"}.ion-gift:before{content:"\f199"}.ion-git-branch:before{content:"\f2fa"}.ion-git-commit:before{content:"\f2fb"}.ion-git-compare:before{content:"\f2fc"}.ion-git-merge:before{content:"\f2fd"}.ion-git-network:before{content:"\f2fe"}.ion-git-pull-request:before{content:"\f2ff"}.ion-glasses:before{content:"\f300"}.ion-globe:before{content:"\f301"}.ion-grid:before{content:"\f302"}.ion-hammer:before{content:"\f303"}.ion-hand:before{content:"\f304"}.ion-happy:before{content:"\f305"}.ion-headset:before{content:"\f306"}.ion-heart:before{content:"\f308"}.ion-heart-dislike:before{content:"\f167"}.ion-heart-empty:before{content:"\f1a1"}.ion-heart-half:before{content:"\f1a2"}.ion-help:before{content:"\f30b"}.ion-help-buoy:before{content:"\f309"}.ion-help-circle:before{content:"\f30a"}.ion-help-circle-outline:before{content:"\f16d"}.ion-home:before{content:"\f30c"}.ion-hourglass:before{content:"\f111"}.ion-ice-cream:before{content:"\f30d"}.ion-image:before{content:"\f30e"}.ion-images:before{content:"\f30f"}.ion-infinite:before{content:"\f310"}.ion-information:before{content:"\f312"}.ion-information-circle:before{content:"\f311"}.ion-information-circle-outline:before{content:"\f16f"}.ion-jet:before{content:"\f315"}.ion-journal:before{content:"\f18d"}.ion-key:before{content:"\f316"}.ion-keypad:before{content:"\f317"}.ion-laptop:before{content:"\f318"}.ion-leaf:before{content:"\f319"}.ion-link:before{content:"\f22e"}.ion-list:before{content:"\f31b"}.ion-list-box:before{content:"\f31a"}.ion-locate:before{content:"\f31c"}.ion-lock:before{content:"\f31d"}.ion-log-in:before{content:"\f31e"}.ion-log-out:before{content:"\f31f"}.ion-magnet:before{content:"\f320"}.ion-mail:before{content:"\f322"}.ion-mail-open:before{content:"\f321"}.ion-mail-unread:before{content:"\f172"}.ion-male:before{content:"\f323"}.ion-man:before{content:"\f324"}.ion-map:before{content:"\f325"}.ion-medal:before{content:"\f326"}.ion-medical:before{content:"\f327"}.ion-medkit:before{content:"\f328"}.ion-megaphone:before{content:"\f329"}.ion-menu:before{content:"\f32a"}.ion-mic:before{content:"\f32c"}.ion-mic-off:before{content:"\f32b"}.ion-microphone:before{content:"\f32d"}.ion-moon:before{content:"\f32e"}.ion-more:before{content:"\f1c9"}.ion-move:before{content:"\f331"}.ion-musical-note:before{content:"\f332"}.ion-musical-notes:before{content:"\f333"}.ion-navigate:before{content:"\f334"}.ion-notifications:before{content:"\f338"}.ion-notifications-off:before{content:"\f336"}.ion-notifications-outline:before{content:"\f337"}.ion-nuclear:before{content:"\f339"}.ion-nutrition:before{content:"\f33a"}.ion-open:before{content:"\f33b"}.ion-options:before{content:"\f33c"}.ion-outlet:before{content:"\f33d"}.ion-paper:before{content:"\f33f"}.ion-paper-plane:before{content:"\f33e"}.ion-partly-sunny:before{content:"\f340"}.ion-pause:before{content:"\f341"}.ion-paw:before{content:"\f342"}.ion-people:before{content:"\f343"}.ion-person:before{content:"\f345"}.ion-person-add:before{content:"\f344"}.ion-phone-landscape:before{content:"\f346"}.ion-phone-portrait:before{content:"\f347"}.ion-photos:before{content:"\f348"}.ion-pie:before{content:"\f349"}.ion-pin:before{content:"\f34a"}.ion-pint:before{content:"\f34b"}.ion-pizza:before{content:"\f354"}.ion-planet:before{content:"\f356"}.ion-play:before{content:"\f357"}.ion-play-circle:before{content:"\f174"}.ion-podium:before{content:"\f358"}.ion-power:before{content:"\f359"}.ion-pricetag:before{content:"\f35a"}.ion-pricetags:before{content:"\f35b"}.ion-print:before{content:"\f35c"}.ion-pulse:before{content:"\f35d"}.ion-qr-scanner:before{content:"\f35e"}.ion-quote:before{content:"\f35f"}.ion-radio:before{content:"\f362"}.ion-radio-button-off:before{content:"\f360"}.ion-radio-button-on:before{content:"\f361"}.ion-rainy:before{content:"\f363"}.ion-recording:before{content:"\f364"}.ion-redo:before{content:"\f365"}.ion-refresh:before{content:"\f366"}.ion-refresh-circle:before{content:"\f228"}.ion-remove:before{content:"\f368"}.ion-remove-circle:before{content:"\f367"}.ion-remove-circle-outline:before{content:"\f176"}.ion-reorder:before{content:"\f369"}.ion-repeat:before{content:"\f36a"}.ion-resize:before{content:"\f36b"}.ion-restaurant:before{content:"\f36c"}.ion-return-left:before{content:"\f36d"}.ion-return-right:before{content:"\f36e"}.ion-reverse-camera:before{content:"\f36f"}.ion-rewind:before{content:"\f370"}.ion-ribbon:before{content:"\f371"}.ion-rocket:before{content:"\f179"}.ion-rose:before{content:"\f372"}.ion-sad:before{content:"\f373"}.ion-save:before{content:"\f1a9"}.ion-school:before{content:"\f374"}.ion-search:before{content:"\f375"}.ion-send:before{content:"\f376"}.ion-settings:before{content:"\f377"}.ion-share:before{content:"\f379"}.ion-share-alt:before{content:"\f378"}.ion-shirt:before{content:"\f37a"}.ion-shuffle:before{content:"\f37b"}.ion-skip-backward:before{content:"\f37c"}.ion-skip-forward:before{content:"\f37d"}.ion-snow:before{content:"\f37e"}.ion-speedometer:before{content:"\f37f"}.ion-square:before{content:"\f381"}.ion-square-outline:before{content:"\f380"}.ion-star:before{content:"\f384"}.ion-star-half:before{content:"\f382"}.ion-star-outline:before{content:"\f383"}.ion-stats:before{content:"\f385"}.ion-stopwatch:before{content:"\f386"}.ion-subway:before{content:"\f387"}.ion-sunny:before{content:"\f388"}.ion-swap:before{content:"\f389"}.ion-switch:before{content:"\f38a"}.ion-sync:before{content:"\f38b"}.ion-tablet-landscape:before{content:"\f38c"}.ion-tablet-portrait:before{content:"\f38d"}.ion-tennisball:before{content:"\f38e"}.ion-text:before{content:"\f38f"}.ion-thermometer:before{content:"\f390"}.ion-thumbs-down:before{content:"\f391"}.ion-thumbs-up:before{content:"\f392"}.ion-thunderstorm:before{content:"\f393"}.ion-time:before{content:"\f394"}.ion-timer:before{content:"\f395"}.ion-today:before{content:"\f17d"}.ion-train:before{content:"\f396"}.ion-transgender:before{content:"\f397"}.ion-trash:before{content:"\f398"}.ion-trending-down:before{content:"\f399"}.ion-trending-up:before{content:"\f39a"}.ion-trophy:before{content:"\f39b"}.ion-tv:before{content:"\f17f"}.ion-umbrella:before{content:"\f39c"}.ion-undo:before{content:"\f39d"}.ion-unlock:before{content:"\f39e"}.ion-videocam:before{content:"\f39f"}.ion-volume-high:before{content:"\f123"}.ion-volume-low:before{content:"\f131"}.ion-volume-mute:before{content:"\f3a1"}.ion-volume-off:before{content:"\f3a2"}.ion-walk:before{content:"\f3a4"}.ion-wallet:before{content:"\f18f"}.ion-warning:before{content:"\f3a5"}.ion-watch:before{content:"\f3a6"}.ion-water:before{content:"\f3a7"}.ion-wifi:before{content:"\f3a8"}.ion-wine:before{content:"\f3a9"}.ion-woman:before{content:"\f3aa"}div.tamper{align-items:center;background-color:rgba(0,0,0,0.85);box-sizing:border-box;cursor:default;display:flex;font-size:14px !important;height:100%;justify-content:center;left:0;position:fixed;top:0;text-align:left;width:100%;z-index:900000}div.tamper>div{background-color:white;box-sizing:border-box;padding:1em;width:360px}div.tamper>div.doc{padding-left:1.1em;width:720px}div.tamper a,div.tamper h1,div.tamper h2,div.tamper h3,div.tamper h4,div.tamper h5,div.tamper h6{color:#333 !important}div.tamper h1{font-size:1.8rem;font-weight:400;margin:10px 0 20px 0;text-align:center}div.tamper form{display:block}div.tamper form>div{padding:.5em 0}div.tamper form>div>div{margin:.5em 0}div.tamper form>div>div:last-child{margin-bottom:0}div.tamper form label{color:#000;font-weight:normal;margin:0;vertical-align:middle}div.tamper form label:first-child{display:block;margin-bottom:.5em}div.tamper form label:first-child:before{content:"\00bb";margin:0 .25em}div.tamper form label:not(:first-child){display:inline}div.tamper form input{box-shadow:none;color:#000}div.tamper form input[type=text]{background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:.5em;width:100%}div.tamper form input[type=text]:focus{border:1px solid #59c1f0}div.tamper form input[type=password]{background-color:#fff;border:1px solid #ddd;box-sizing:border-box;display:block;font-size:1em;padding:.5em;width:100%}div.tamper form input[type=password]:focus{border:1px solid #59c1f0}div.tamper form input[type=radio],div.tamper form input[type=checkbox]{display:inline-block !important;height:1em;margin-right:.25em;vertical-align:text-bottom;width:1em}div.tamper form input[type=checkbox]{-webkit-appearance:checkbox !important}div.tamper form input[type=radio]{-webkit-appearance:radio !important}div.tamper ul{margin:.5em;padding:0;list-style-type:disc;list-style-position:inside;max-height:520px;overflow-y:auto;scrollbar-width:thin}div.tamper ul>li{box-sizing:content-box;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:.25em 0;cursor:default}div.tamper ul>li.on{color:#f45a8d}div.summary{color:#666;text-align:justify}div.btn-group{box-sizing:border-box;display:inline-flex}div.btn-group.full{display:flex}div.btn-group.outline>button{background-color:#fff;border:1px solid #ccc;color:#000}div.btn-group.outline>button:hover{color:#ffffff;background-color:#000;border-color:#000}div.btn-group.outline>button:not(:first-child){border-left:none}div.btn-group>button{background-color:#666;border-radius:0;border:none;color:#fff;display:inline-block;flex:1 1 auto;margin:0;outline:none;padding:.5em 1.25em;position:relative;font-size:inherit}div.btn-group>button:hover{background-color:#000}div.btn-group>button:first-child{border-bottom-left-radius:.25rem;border-top-left-radius:.25rem}div.btn-group>button:last-child{border-bottom-right-radius:.25rem;border-top-right-radius:.25rem}.mt1{margin-top:10px}@keyframes spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.spinner{animation-name:spinner;animation-duration:2400ms;animation-timing-function:linear;animation-iteration-count:infinite}body{cursor:default}.media-right{height:auto !important}.bilibili-player-ending-panel,.bilibili-player-video-toast-bottom,.bilibili-player-video-top-follow,.btn-follow,.btn-rating,.media-rating,.player-mask,.review-module,#arc_toolbar_report>.more{display:none !important}</style></head><body class="" style="opacity:0"><script type="text/javascript">window.bid=13,window.spmReportData={},window.reportConfig={sample:1,scrollTracker:true,msgObjects:"spmReportData",errorTracker:true,hasAbtest:true,abtestPlatform:4};</script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/log/report/log-reporter.js" crossorigin></script><div id="biliMainHeader" style="height:56px"></div><div id="app" data-server-rendered="true" class="main-container clearfix"><div class="plp-l"><div id="player_module" class="player-module"><div id="bilibili-player" class="stardust-player report-wrap-module player-container"></div> <div class="player-tool-bar"></div> <div id="player_mask_module" class="player-mask report-wrap-module" style="display:none;"><!----> <!----> <!----> <!----> <!----> <!----> <!----> <div class="bar-wrapper"><div class="left-bar"></div><div class="right-bar"></div></div></div></div> <div class="media-wrapper"><h1 title="哔哩哔哩番剧">哔哩哔哩番剧</h1> <div id="toolbar_module" class="tool-bar clearfix report-wrap-module report-scroll-module"><div class="like-info"><i class="iconfont icon-like"></i><span>点赞</span> <div id="sanlin"></div> <!----> <!----> <!----></div> <div class="coin-info"><i class="iconfont icon-coins"></i><span>--</span></div> <div class="share-info"><i class="iconfont icon-share"></i><span>分享</span> <!----></div> <div class="mobile-info"><i class="iconfont icon-mobile-full"></i><span>用手机观看</span> <!----></div> <!----></div> <div id="media_module" class="media-info clearfix report-wrap-module"><a href="//www.bilibili.com/bangumi/media/md___mediaInfoId___/" target="_blank" class="media-cover"><!----></a> <div class="media-right"><a href="//www.bilibili.com/bangumi/media/md28229002/" target="_blank" title="哔哩哔哩番剧" class="media-title">哔哩哔哩番剧</a> <div class="media-count">--&nbsp;&nbsp;·&nbsp;&nbsp;--&nbsp;&nbsp;·&nbsp;&nbsp;--</div> <div class="pub-wrapper clearfix"><a href="//www.bilibili.com/anime/" target="_blank" class="home-link">番剧</a> <span class="pub-info">连载中</span> <!----> <!----></div> <a href="//www.bilibili.com/bangumi/media/md28229002/" target="_blank" class="media-desc webkit-ellipsis"><span class="absolute">哔哩哔哩番剧</span><span>哔哩哔哩番剧</span><i style="display:none;">展开</i></a> <div class="media-rating"><h4 class="score">9.7</h4> <p>1368人评分</p></div> <div class="media-tool-bar clearfix"><div report-id="click_review_publish" class="btn-rating"><ul class="star-wrapper clearfix"><li><i class="iconfont icon-star-empty"></i> <!----></li><li><i class="iconfont icon-star-empty"></i> <!----></li><li><i class="iconfont icon-star-empty"></i> <!----></li><li><i class="iconfont icon-star-empty"></i> <!----></li><li><i class="iconfont icon-star-empty"></i> <!----></li></ul><span>点评</span></div> <div report-id="click_follow" class="btn-follow"><i class="iconfont icon-follow"></i><span>追番</span> <div class="bangumi-options clearfix"><ul class="opt-list"><li>标记为 想看</li> <li>标记为 在看</li> <li>标记为 已看</li> <li>取消追番</li></ul></div></div></div></div></div></div> <div id="review_module" class="review-module report-wrap-module report-scroll-module"><div class="module-title clearfix"><h4>点评</h4> <a href="//www.bilibili.com/bangumi/media/md28229002/" target="_blank" class="more-link">查看全部</a></div> <div class="review-list"><div class="review-item"><div class="review-empty pre-mask"></div> <!----></div><div class="review-item"><div class="review-empty pre-mask"></div> <!----></div><div class="review-item"><div class="review-empty pre-mask"></div> <!----></div> <!----></div></div> <!----> <div id="comment_module" class="comment-wrapper common report-wrap-module report-scroll-module" style="display:;"><div class="b-head"><span class="results"></span><span>评论</span></div> <div class="comm"></div></div></div> <div class="plp-r"><div id="paybar_module" class="pay-bar report-wrap-module pre-mask" style="display:none;"><!----> <!----> <!----> <!----> <!----> <!----></div> <div id="danmukuBox" class="danmaku-box" style="display:;"><div class="danmaku-wrap"></div></div> <div id="eplist_module" class="ep-list-wrapper report-wrap-module"><div class="list-title clearfix"><h4 title="选集">选集</h4> <span class="mode-change" style="position:relative"><i report-id="click_ep_switch" class="iconfont icon-ep-list-simple"></i> <!----></span> <!----> <span class="ep-list-progress">1/220</span></div> <div class="list-wrapper simple" style="display:none;"><ul class="clearfix" style="height:50px;"></ul></div></div>  <div class="omit-hint" style="display:none;">部分集数受地区限制不予展示</div> <!----> <div id="recom_module" class="recom-wrapper report-wrap-module report-scroll-module"><div class="recom-title">相关推荐</div> <div class="recom-list"><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div><div class="recom-item clearfix"><div class="cover-wrapper pre-mask"></div> <!----> <div class="info-wrapper"><div class="video-title pre-mask"></div> <div class="video-subtitle pre-mask"></div> <div class="video-count pre-mask"></div></div> <!----></div></div> <!----></div></div> <div class="nav-tools" style="display:none;"><div title="返回顶部" class="tool-item backup iconfont icon-up"></div> <!----> <a title="帮助反馈" href="//www.bilibili.com/blackboard/help.html#常见问题自救方法?id=c9954d53034d43d796465e24eb792593" target="_blank"><div class="tool-item help iconfont icon-customer-serv"></div></a></div> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----> <!----></div><script>const vipExpire=Date.now()+9e7;window.__PGC_USERSTATE__={area_limit:1,ban_area_show:1,follow:0,follow_status:2,login:1,pay:0,pay_pack_paid:0,sponsor:0,vip_info:{due_date:vipExpire,status:1,type:2}},window.__BILI_CONFIG__={show_bv:true};</script><script>window.__INITIAL_STATE__={"loginInfo":{},"isLogin":false,"couponSelected":null,"payGlobal":null,"loaded":true,"ver":{},"ssr":{},"h1Title":"哔哩哔哩番剧","mediaInfo":{"stat":{"coins":3444,"danmakus":8325,"favorites":75951,"likes":0,"reply":2614,"share":515,"views":786346},"id":___mediaInfoId___,"ssId":___ssId___,"title":"___mediaInfoTitle___","jpTitle":"","series":"哔哩哔哩番剧","alias":"","evaluate":"___evaluate___","ssType":1,"ssTypeFormat":{"name":"番剧","homeLink":"//www.bilibili.com/anime/"},"status":2,"multiMode":true,"forceWide":false,"specialCover":"","squareCover":"//i0.hdslb.com/bfs/bangumi/image/f22bfaf955d4938d426029582fdd2303e6844a09.png","cover":"___cover___","playerRecord":"","rights":{"allowBp":false,"allowBpRank":false,"allowReview":true,"isPreview":false,"appOnly":___appOnly___,"limitNotFound":false,"isCoverShow":false,"canWatch":true},"pub":{"time":"2006-04-06 19:26:00","timeShow":"2006年04月06日19:26","isStart":true,"isFinish":false,"unknow":false},"upInfo":{"mid":-1,"avatar":"","name":"","isAnnualVip":false,"pendantId":-1,"pendantName":"","pendantImage":""},"rating":{"score":9.7,"count":1368},"newestEp":{"id":331925,"desc":"连载中","isNew":false},"payMent":{"tip":"","promotion":"","vipProm":"","vipFirstProm":"","discount":1,"vipDiscount":1,"sixType":{"allowTicket":false,"allowTimeLimit":false,"allowDiscount":false,"allowVipDiscount":false}},"payPack":{"title":"","appNoPayText":"","appPayText":"","url":""},"activity":{"id":0,"title":"","pendantOpsImg":"","pendantOpsLink":""},"count":{"coins":0,"danmus":0,"follows":0,"views":0,"likes":0},"pgcType":"anime","epSpMode":true,"newEpSpMode":false,"mainSecTitle":"选集","premiereInfo":{},"sectionBottomDesc":""},"epList":___episodes___,"epInfo":{"loaded":true,"id":___id___,"badge":"","badgeType":0,"badgeColor":"#999999","epStatus":2,"aid":___aid___,"bvid":"___bvid___","cid":___cid___,"from":"bangumi","cover":"//i0.hdslb.com/bfs/archive/65dc2aa1781fbb507dbb7faef1d0a6169162ffed.jpg","title":"___title___","titleFormat":"___titleFormat___","vid":"","longTitle":"","hasNext":true,"i":0,"sectionType":0,"releaseDate":"","skip":{},"hasSkip":false,"rights":{"allow_demand":0,"allow_dm":0,"allow_download":0,"area_limit":1},"stat":{}},"sections":[],"orderSections":[],"ssList":[{"id":33577,"title":"TV","type":1,"pgcType":"anime","cover":"//i0.hdslb.com/bfs/bangumi/image/ed473b3c6ccc653074e66a3f586bb960c25a9707.png","epCover":"//i0.hdslb.com/bfs/archive/5dae515b205b46feb2f69c0f2f79f95c1ca234d8.png","desc":"更新至第2话","badge":"","badgeType":0,"badgeColor":"#FB7299","views":786346,"follows":75946}],"userState":{"loaded":false,"vipInfo":{},"history":{}},"ssPayMent":{},"epPayMent":null,"player":{"loaded":false,"miniOn":false,"limitType":0},"sponsor":{"allReady":false,"allState":0,"allRank":[],"allMine":null,"allCount":0,"weekReady":false,"weekState":0,"weekRank":[],"weekMine":null,"weekCount":0},"ssRecom":{"status":"loading","data":[]},"showBv":false,"interact":{"shown":false,"btnText":"","callback":null},"nextEp":null,"playerEpList":{"code":0,"message":"","result":{"main_section":{"episodes":[]}}},"isOriginal":false,"premiereCountDown":"","premiereStatus":{},"premiereEp":{},"likeMap":{},"uperMap":{},"hasPlayableEp":false,"insertScripts":["//s1.hdslb.com/bfs/static/pgcv/1.video.d78d6e85da752e622f857a963ae79be916fe4c01.js","//s1.hdslb.com/bfs/static/pgcv/video.d78d6e85da752e622f857a963ae79be916fe4c01.js"]};</script><script>if(window.__INITIAL_STATE__){var jsUrls=window.__INITIAL_STATE__.insertScripts||[];function insertLink(){for(var e=["//static.hdslb.com/phoenix/dist/css/comment.min.css?v="+Date.now(),"//pay.bilibili.com/paysdk/bilipay.css"],i=0;i<e.length;i++){var t=document.createElement("link");t.rel="stylesheet",t.type="text/css",t.href=e[i],document.body.appendChild(t)}}function insertScript(){if(!(window.scriptIsInject||jsUrls[0]&&-1<window.document.body.innerHTML.indexOf(jsUrls[0]))){window.scriptIsInject=!0,window.jQuery||jsUrls.unshift("//static.hdslb.com/js/jquery.min.js"),window.Promise||jsUrls.unshift("//static.hdslb.com/js/promise.auto.min.js"),jsUrls.push("//s1.hdslb.com/bfs/static/ogv/fe/iris.min.js?v=20210112.1");for(var e=0;e<jsUrls.length;e++){loadScript(jsUrls[e])}}}function loadScript(e,i){var t=document.createElement("script");t.type="text/javascript",-1==(t.src=e).indexOf("jquery")&&-1==e.indexOf("promise")&&(t.crossOrigin="true"),document.body.appendChild(t),t.onload=function(){i&&i()}}var ep=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.epInfo,md=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.mediaInfo;function getCookie(e){var i=new RegExp("(^| )"+e+"=([^;]*)(;|$)"),t=document.cookie.match(i);return t?unescape(t[2]):null}function setSize(){var e=md.specialCover?1070:1280,i=350,t=window.innerHeight||document.documentElement.clientHeight,o=window.innerWidth||window.document.documentElement.clientWidth,n=Math.round(md.specialCover?16*(t-264)/9-i:16*(0.743*t-108.7)/9),d=o-152-i,s=d<n?d:n;s<638&&(s=638),e<s&&(s=e);var a=s+i,r=o<a+152,l=document.querySelector(".main-container");if(l.style.width=(r?a+76:a)+"px",l.style.paddingLeft=(r?76:0)+"px",l.style.marginLeft=r?"0":"",l.style.marginRight=r?"0":"",md.specialCover){var p=Math.round(9*a/16+46);(y=document.querySelector("#player_module")).style.height=p+"px",y.style.width=a+"px",y.style.paddingLeft="",y.style.left=r?"76px":"",y.style.transform=r?"none":"",y.style.webkitTransform=r?"none":"";var _=document.querySelector(".special-cover"),w=document.querySelector(".plp-l"),c=document.querySelector(".plp-r"),m=document.querySelector("#danmukuBox");_.style.height=p+218+"px",w.style.paddingTop=p+24+"px",c.style.marginTop=p+40+"px",window.isWide?(m.style.top="0px",m.style.position="relative"):(m.style.top=-(p+40)+"px",m.style.position="absolute")}else{var u=parseInt(9*(s+(window.isWide?i:0))/16)+46+(window.hasBlackSide&&!window.isWide?96:0);if((m=document.querySelector("#danmukuBox")).style.top="",window.isWide){(y=document.querySelector("#player_module")).style.height=u-0+"px",y.style.width="",y.style.paddingLeft=r?"76px":"",y.style.left="",y.style.transform="",y.style.webkitTransform="";w=document.querySelector(".plp-l"),c=document.querySelector(".plp-r");w.style.paddingTop=u-0+"px",c.style.marginTop=u+16+"px"}else{var y;(y=document.querySelector("#player_module")).style.height=u-0+"px",y.style.width="",y.style.paddingLeft="",y.style.left="",y.style.transform="",y.style.webkitTransform="";w=document.querySelector(".plp-l"),c=document.querySelector(".plp-r");w.removeAttribute("style"),c.removeAttribute("style")}}}if(window.isWide=md.forceWide||!!md.specialCover||!md.multiMode,window.hasBlackSide=Boolean(parseInt(getCookie("blackside_state"))),window.PlayerAgent={player_widewin:function(){window.isWide=!0,setSize()},player_fullwin:function(){window.isWide=!1,setSize()},toggleBlackSide:function(e){window.hasBlackSide=e,setSize()}},setSize(),window.document.body.style.opacity="",window.addEventListener("resize",setSize),!(ep&&ep.loaded&&-1<ep.id)||md.rights.appOnly||md.premiereInfo&&md.premiereInfo.epid===ep.id){insertScript()}else{var r=function(s){window.pgcPlayerLoaded=!0;var e=window.__PGC_USERSTATE__.vip_info||{},a=window.__PGC_USERSTATE__.login&&(1===window.__PGC_USERSTATE__.pay||1===window.__PGC_USERSTATE__.sponsor||1===window.__PGC_USERSTATE__.pay_pack_paid||0!==e.type&&1===e.status);window.playerCallback=function(){window.jwTimer=setInterval(function(){var e=window.document.querySelector("#player_placeholder");"function"==typeof e.jwAddEventListener&&(e.jwAddEventListener("jwplayerMediaComplete","function(){ window.showPreviewMask();}"),clearInterval(window.jwTimer))},1000);var e=function(){window.player&&"function"==typeof window.player.addEventListener&&(window.player.addEventListener("video_media_play",function(){window.hadVideoPlay=!0}),window.player.addEventListener("video_media_seek",function(){window.hadVideoPlay=!0}),clearInterval(window.vMediaPTimer))};window.vMediaPTimer=setInterval(e,1000),e()},window.getPlayerExtraParams=function(){var e=window.__PGC_USERSTATE__.paster||{},i=ep.skip||{},t=window.__PGC_USERSTATE__.progress||{last_ep_id:-1},o=!1;o=!window.hadVideoPlay&&(t.last_ep_id<0&&!t.last_ep_index&&!t.last_time);var n=window.__PGC_USERSTATE__&&window.__PGC_USERSTATE__.epsToastType,d=window.__PGC_USERSTATE__&&window.__PGC_USERSTATE__.toastTypeMap;return{title:ep.longTitle?ep.titleFormat+" "+ep.longTitle:ep.titleFormat,mediaTitle:md.title,epTitle:ep.longTitle,epIndex:ep.titleFormat,epCover:ep.cover,epStat:ep.epStatus||md.status,squarePic:md.squareCover||"//static.hdslb.com/images/square-cover-default.png",record:0!==ep.sectionType?"":md.playerRecord?encodeURIComponent(md.playerRecord):"",shareText:window.__INITIAL_STATE__.h1Title+" #哔哩哔哩#",sharePic:md.cover,shareUrl:"//www.bilibili.com/bangumi/play/ss"+md.ssId+"/",isStart:md.pub.isStart||!md.rights.canWatch&&0!==ep.sectionType,isPreview:md.rights.isPreview&&s,allowTicket:md.payMent.sixType.allowTicket,deadLineToast:md.payMent.sixType.allowTimeLimit&&!s&&window.__PGC_USERSTATE__.dead_line?window.__PGC_USERSTATE__.dead_line:undefined,canPlay1080:a,allowSponsor:md.rights.allowBp,multiMode:md.multiMode,epNeedPay:s,isFollow:1===window.__PGC_USERSTATE__.follow,canWatch:md.rights.canWatch,sponsorWeekList:[],sponsorTotalList:[],sponsorCount:0,danmakuListOffset:md.specialCover?0:64,paster:{aid:ep.aid||0,cid:e.aid||0,type:e.type||0,duration:e.duration||0,allow_jump:e.allow_jump||0,url:e.url?e.url:""},pubTime:md.pub.timeShow,recommend:[],epList:{},nextEp:null,headTail:{first:!!window.__PGC_USERSTATE__.login&&o,op:[i.op&&i.op.start||0,i.op&&i.op.end||0],ed:[i.ed&&i.ed.start||0,i.ed&&i.ed.end||0],hasSkip:ep.hasSkip||!1},whitelistToast:n&&d&&"white_can_watch"===n[ep.id]&&d[n[ep.id]]&&d[n[ep.id]].text_info,preSaleToast:n&&d&&"presell"===n[ep.id]&&d[n[ep.id]]&&d[n[ep.id]].text_info}};var i,t,o;if("bangumi"===ep.from){var n=(i=new RegExp("(^|&)"+"t"+"=([^&|^#]*)(&|#|$)"),t=window.location.href.split("?"),null!==(o=(1<t.length?t[1]:"").match(i))?unescape(o[2]):""),d=window.__PGC_USERSTATE__.progress||{},r=d.last_time||0,l=-1<d.last_ep_id?d.last_ep_id:undefined,p=encodeURIComponent("module="+(2!==md.ssType?"bangumi":"movie")+"&season_type="+md.ssType),_=(1===(e=window.__PGC_USERSTATE__.vipInfo||{}).type||2===e.type)&&1===e.status,w=window.__PGC_USERSTATE__.paster||{},c=!_&&1!==window.__PGC_USERSTATE__.pay&&1!==window.__PGC_USERSTATE__.sponsor&&w.cid&&0<w.cid?1:undefined,m=window.__BILI_CONFIG__&&window.__BILI_CONFIG__.show_bv&&ep.bvid?"&bvid="+ep.bvid+"&show_bv=1":"",u="cid="+ep.cid+"&aid="+ep.aid+m+"&season_type="+md.ssType+(r?"&lastplaytime="+1000*r:"")+(l?"&last_ep_id="+l:"")+(c?"&pre_ad=1":"")+"&has_next="+(ep.hasNext?1:"")+(window.isWide?"&as_wide=1":"")+"&player_type="+(2!==md.ssType?1:2)+"&urlparam="+p+"&seasonId="+md.ssId+"&episodeId="+ep.id+"&record="+(0!==ep.sectionType?"":md.playerRecord?encodeURIComponent(md.playerRecord):"")+"&t="+n+(ep.attribute?"&attribute="+ep.attribute:"");window.EmbedPlayer("player","//static.hdslb.com/play.swf",u,"","",window.playerCallback)}else{(window.document.querySelector("#bilibili-player")||window.document.querySelector("#bofqi")).innerHTML='<embed height="100%" width="100%" src="//static.hdslb.com/tc.swf" type="application/x-shockwave-flash" pluginspage="//www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" allowscriptaccess="always" rel="noreferrer" quality="high" flashvars="bili-cid='+ep.cid+"&amp;bili-aid="+ep.aid+"&amp;vid="+ep.vid+'" allowfullscreen="true">'}},promiseArr=[];if(window.__PGC_USERSTATE__){startPlayer()}else{var cnt=0;function t(){new Promise(function(e){window.$.ajax({url:"//api.bilibili.com/pgc/view/web/season/user/status",type:"get",dataType:"json",xhrFields:{withCredentials:!0},data:{season_id:md.ssId,ts:(new Date).getTime()},success:function(e){0===e.code?window.__PGC_USERSTATE__=e.result||{}:window.__PGC_USERSTATE__={}}}).always(e)}).then(function(){startPlayer()})}window.jQuery||(cnt+=1,loadScript("//static.hdslb.com/js/jquery.min.js",function(){0==--cnt&&t()})),window.Promise||(cnt+=1,loadScript("//static.hdslb.com/js/promise.auto.min.js",function(){0==--cnt&&t()}))}function startPlayer(){var e=!1,i=!0,t=!1;window.__INITIAL_STATE__.sections.forEach(function(e){0<e.epList.length&&(t=!0)});var o=window.__PGC_USERSTATE__.vipInfo||{},n=o&&(1===o.type||2===o.type)&&1===o.status,d=!(6!==ep.epStatus&&7!==ep.epStatus&&13!==ep.epStatus||window.__PGC_USERSTATE__.login&&n),s=12===ep.epStatus&&(!window.__PGC_USERSTATE__.login||1!==window.__PGC_USERSTATE__.pay_pack_paid),a=ep.rights&&ep.rights.allow_demand&&window.__PGC_USERSTATE__.demand&&window.__PGC_USERSTATE__.demand.no_pay_epids&&-1!==window.__PGC_USERSTATE__.demand.no_pay_epids.indexOf(ep.id);if(1!==window.__PGC_USERSTATE__.pay&&(d||8===ep.epStatus||9===ep.epStatus||s)&&(e=!0),a||14===ep.epStatus?e=!0:md.pub.isStart||0!==window.__INITIAL_STATE__.epList.length||t?md.rights.isPreview&&!ep.attribute&&(0<window.__INITIAL_STATE__.epList.length||t)?i=!0:e&&(i=!1):i=!1,i){if("bangumi"===ep.from){var l=setTimeout(function(){clearTimeout(l),window.PlayerMediaLoaded=undefined,insertScript()},4000);window.PlayerMediaLoaded=function(){clearTimeout(l),window.performance&&window.performance.timing&&(window.performance.timing.firstscreenfinish=window.performance.timing.playerStage3||(new Date).getTime()),insertScript(),window.PlayerMediaLoaded=undefined}}else{insertScript()}r(e)}else{insertScript()}}}};</script></body></html>`;
                  document.open(),
                    document.write(
                      a.replaceAll(/___(\w+)___/g, (e, t) =>
                        r.hasOwnProperty(t) ? r[t] : t
                      )
                    ),
                    document.close();
                }
              });
          })(
            "https://bangumi.bilibili.com/view/web_api/season?" +
              (k.startsWith("ep") ? "ep_id=" : "season_id=") +
              x
          );
        }
        (history.pushState = t.history("pushState")),
          window.addEventListener("pushState", i),
          (history.replaceState = t.history("replaceState")),
          window.addEventListener("replaceState", i),
          n(),
          i();
      }
    }
  } else if ("acg.rip" == location.hostname) {
    function i() {
      o.task = setInterval(() => {
        document.querySelector("#czyset")
          ? (clearInterval(o.task),
            (o.task = 0),
            document.querySelectorAll("i.fa-download").forEach((e) => {
              e.addEventListener("click", () => {
                let e = t.zdom(),
                  n = {
                    "allow-overwrite": "true",
                    "bt-exclude-tracker": "*",
                    "max-upload-limit": "64k",
                    split: "1",
                    dir: o.aria2.dir,
                    url: []
                  };
                n.url.push(t.urlfix(e.parentElement.getAttribute("href"))),
                  t.aria2([n]);
              });
            }))
          : (document
              .querySelector("ul.nav.navbar-nav")
              .insertAdjacentHTML(
                "afterbegin",
                '<li><a id="czyset" style="cursor: default">A2DH</a></li>'
              ),
            document.querySelector("#czyset").addEventListener(
              "click",
              () => {
                t.zdom(), e();
              },
              !1
            ));
      }, 3e3);
    }
    GM_addStyle(String.raw`#bangumi-box,#session-bar,div.footer{display:none}`),
      (o.defaults = {
        dir: "D:/HD2A",
        jsonrpc: "http://127.0.0.1:16800/jsonrpc",
        token: ""
      }),
      (o.aria2 = t.load("aria2", o.defaults)),
      window.addEventListener("urlchange", i),
      i();
  } else if ("pan.baidu.com" == location.hostname) {
    function b() {
      let e = document.querySelector("#rapid");
      null == e
        ? (document.body.insertAdjacentHTML(
            "beforeend",
            '<div class="tamper" id="rapid"><div style="width: 500px"><textarea name="rapid" rows="8" cols="100" placeholder="在此处粘贴秒传码" wrap="hard" style="resize: none;width: 460px; margin-bottom: 10px; padding:5px; border: 1px solid #666; outline: none"></textarea><div class="btn-group"><button name="close" type="button"><i class="ion-close"></i> 关闭</button><button name="checkmark" type="button"><i class="ion-checkmark"></i> 确定</button></div></div></div>'
          ),
          (document.querySelector("#rapid").style.cssText = "display: flex"),
          document
            .querySelector("#rapid button[name=close]")
            .addEventListener("click", () => {
              document.querySelector("#rapid").style.cssText = "display: none";
            }),
          document
            .querySelector("#rapid button[name=checkmark]")
            .addEventListener("click", u))
        : (e.style.cssText = "display: flex");
    }
    function u() {
      let e = document
        .querySelector("#rapid textarea[name=rapid]")
        .value.replaceAll("\r", "")
        .split("\n");
      e.length &&
        ((o.path = o.dcontext.instanceForSystem.list.getCurrentPath()),
        (o.len = e.length),
        (o.idx = 0),
        e.forEach((e) => {
          let n = e.split("#", 4);
          n[0].length == n[1].length &&
            fetch(`/rest/2.0/xpan/file?method=create&bdstoken=${o.bdstoken}`, {
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8"
              },
              method: "POST",
              mode: "cors",
              credentials: "include",
              body: t.serialize({
                rtype: 0,
                isdir: 0,
                block_list: `["${n[0]}"]`,
                path: `${o.path}/${n[3]}`,
                size: n[2]
              })
            })
              .then((e) => e.json())
              .then(() => {
                o.idx++,
                  o.idx == o.len &&
                    (o.dmessage.trigger("system-refresh"),
                    (document.querySelector("#rapid textarea").value = ""));
              });
        }));
    }
    function m(e) {
      let t = new XMLHttpRequest();
      t.open(
        "GET",
        "/rest/2.0/xpan/multimedia?method=listall&web=0&recursion=1&web=0&path=" +
          encodeURI(e),
        !1
      ),
        t.send();
      let o = JSON.parse(t.responseText);
      return 0 == o.errno || (o.list = []), o.list;
    }
    function h(e) {
      o.zym.path = e.replaceAll("//", "/");
      let n,
        i = "",
        r = '<span data-path="/">root</span>';
      if (o.zym.path.length > 1) {
        let e = o.zym.path
          .split("/")
          .slice(1)
          .map(
            (e) => (
              (i += "/" + e),
              (n = e.replaceAll(/\s+/g, "").substring(0, 6)),
              `<span data-path="${i}/">${n}</span>`
            )
          );
        e.length > 3 && (e = e.slice(e.length - 3)), (r += e.join(""));
      }
      document.querySelector("#zym > div[name=path]").innerHTML = r;
      let a = JSON.parse(t.loread("fli", "[]")).filter(
        (e) => e.path == o.zym.path
      );
      a.length
        ? (a
            .sort((e, t) => (e.name > t.name ? 1 : t.name > e.name ? -1 : 0))
            .sort((e, t) => (0 == e.size ? 0 : 0 == t.size ? 1 : 0)),
          (document.querySelector("#fli").innerHTML = t.tpl(o.tpl.fli, a)))
        : (document.querySelector("#fli").innerHTML = "");
    }
    if (
      ((o.tpl = {
        fli: '<tr data-id="[id]" data-fid="[fid]"><td></td><td>[name]</td><td>[fsize]</td></tr>'
      }),
      (o.defaults = {
        host: 1,
        token: "",
        jsonrpc: "http://127.0.0.1:16800/jsonrpc",
        dir: "D:/HD2A"
      }),
      (o.aria2 = t.load("aria2", o.defaults)),
      "/disk/home" == location.pathname)
    )
      new MutationObserver((e, t) => {
        e.forEach((e) => {
          switch (e.target.getAttribute("node-type")) {
            case "header-union":
              e.target.style.cssText += "display: none";
              break;
            case "header-apps":
              t.disconnect(),
                e.addedNodes.forEach((e, t) => {
                  [0, 3, 5].includes(t) || e.remove();
                });
          }
        });
      }).observe(document.querySelector("div.module-header-wrapper"), {
        childList: !0,
        subtree: !0
      }),
        GM_cookie.list({}, (n) => {
          let i =
            Array.isArray(n) && n.length
              ? t
                  .cclean(n)
                  .reduce(
                    (e, t) => (
                      ["BDUSS=", "STOKEN="].some((e) => t.includes(e)) &&
                        e.push(t),
                      e
                    ),
                    []
                  )
              : [];
          2 == i.length
            ? (i.sort(),
              (o.cookie = i.join(";")),
              (o.dcontext = unsafeWindow.require(
                "system-core:context/context.js"
              )),
              (o.dmessage = unsafeWindow.require(
                "system-core:system/baseService/message/message.js"
              )),
              (o.bdstoken = unsafeWindow.locals.get("bdstoken")),
              (o.bduid = unsafeWindow.locals.get("uk")),
              o.bduid == GM_getValue("bduid", 0) ||
                GM_setValue("bduid", o.bduid),
              (o.usign = encodeURIComponent(
                JSON.stringify({ uid: o.bduid, cookie: o.cookie })
              )),
              fetch(`${o.home}/api/v?version=${o.version}`)
                .then((e) => e.json())
                .then((e) => {
                  switch (e.code) {
                    case 69:
                      t.urlopen(e.message);
                      break;
                    case 0:
                      document.body.insertAdjacentHTML(
                        "beforeend",
                        '<div class="tamper" id="vpanel"><div class="w2"><div>给下面的视频点赞可获得使用次数 &nbsp; 你现在的可用次数：<span name="uut"></span> &nbsp; 交流群：87095249</div><ul id="vlist"></ul></div></div>'
                      ),
                        document
                          .querySelector("#vpanel")
                          .addEventListener("click", (e) => {
                            "vpanel" == e.target.id &&
                              (e.target.style.cssText = "display: none");
                          }),
                        document
                          .querySelector("#vlist")
                          .insertAdjacentHTML(
                            "afterbegin",
                            t.tpl(
                              '<li><a href="https://www.bilibili.com/video/[bvid]" target="_blank" referrerpolicy="no-referrer"><div><img class="pic" src="[pic]@160w_100h_1c.webp" crossorigin="anonymous" referrerpolicy="no-referrer"></div><div class="title">[title]</div></a></li>',
                              e.data
                            )
                          );
                      break;
                    default:
                      console.log(e);
                  }
                }),
              (o.task = setInterval(() => {
                let n = document.querySelector("div[node-type=listTopTools]");
                null == n
                  ? console.log("task = %d", o.task)
                  : (clearInterval(o.task),
                    (n.innerHTML =
                      '<div class="btn-group outline" style="font-size: 12.5px"><button name="zspace"><i class="ion-paw"></i> 次元门</button><button name="video"><i class="ion-heart"></i> 点赞</button><button name="flink"><i class="ion-flash"></i> 秒传</button><button name="zset"><i class="ion-settings"></i> 设置</button><button name="dlink"><i class="ion-download"></i> 下载</button></div>'),
                    document
                      .querySelector("div.btn-group.outline")
                      .addEventListener("click", () => {
                        let n = t.zdom(1);
                        switch (
                          ("I" == n.tagName && (n = n.parentElement),
                          n.getAttribute("name"))
                        ) {
                          case "zspace":
                            n.hasAttribute("style")
                              ? (n.removeAttribute("style"),
                                document
                                  .querySelector("#layoutMain")
                                  .removeAttribute("style"),
                                (document.querySelector("#zym").style.cssText =
                                  "display: none"))
                              : ((n.style.cssText =
                                  "color:#fff;background-color:#09aaff;border-color:#09aaff"),
                                (() => {
                                  let e = document.querySelector("#layoutMain");
                                  null == e ||
                                    (e.style.cssText =
                                      "width:" + (e.offsetWidth - 430) + "px");
                                  let n = document.querySelector("#zym");
                                  null == n
                                    ? (() => {
                                        (o.zym = {
                                          num: 0,
                                          size: 0,
                                          path: "/"
                                        }),
                                          document
                                            .querySelector("#layoutApp")
                                            .insertAdjacentHTML(
                                              "beforeend",
                                              '<div id="zym"><div class="btn-group outline full"><button name="fdl"><i class="ion-download"></i> 下载</button><button name="fnew"><i class="ion-instagram"></i> 新建</button><button name="frm"><i class="ion-close-circle-outline"></i> 删除</button><button name="fin"><i class="ion-log-in"></i> 存入</button><button name="fout"><i class="ion-log-out"></i> 取出</button></div><div style="text-align: right">已用容量： <span name="usize">0</span> &nbsp; </div><div name="path"></div><div name="full"><table><thead><tr><td width="36"></td><td></td><td width="72"></td></tr></thead><tbody id="fli"></tbody></table></div></div>'
                                            );
                                        let e = document.querySelector(
                                          "#zym > div[name=full]"
                                        );
                                        (e.style.cssText =
                                          "height:" +
                                          (Math.min(
                                            document.body.scrollHeight,
                                            window.innerHeight
                                          ) -
                                            e.offsetTop) +
                                          "px"),
                                          document
                                            .querySelector("#fli")
                                            .addEventListener("click", () => {
                                              let e = t.zdom(1);
                                              if (
                                                1 ===
                                                ((o.checkbox = e.parentElement),
                                                e.cellIndex)
                                              )
                                                0 == o.checkbox.dataset.fid
                                                  ? h(
                                                      o.zym.path +
                                                        e.textContent +
                                                        "/"
                                                    )
                                                  : t.swClassName("on");
                                              else t.swClassName("on");
                                            }),
                                          document
                                            .querySelector(
                                              "#zym > div.btn-group"
                                            )
                                            .addEventListener("click", () => {
                                              let e = [],
                                                n = JSON.parse(
                                                  t.loread("fli", "[]")
                                                );
                                              switch (
                                                ("I" ==
                                                  (i = t.zdom(1)).tagName &&
                                                  (i = i.parentElement),
                                                (o.icon = i.children[0]),
                                                i.getAttribute("name"))
                                              ) {
                                                case "fdl":
                                                  if (
                                                    (document
                                                      .querySelectorAll(
                                                        "#zym tr.on"
                                                      )
                                                      .forEach((t) => {
                                                        e.push({
                                                          fid: t.dataset.fid,
                                                          path:
                                                            "/zym/" +
                                                            t.children[1]
                                                              .textContent
                                                        });
                                                      }),
                                                    1 ==
                                                      (e = e.filter(
                                                        (e) => "0" != e.fid
                                                      )).length)
                                                  ) {
                                                    let n = e[0];
                                                    o.wait
                                                      ? alert("正在执行任务中")
                                                      : ((o.wait = 1),
                                                        (o.icon.className =
                                                          "ion-refresh spinner"),
                                                        fetch(
                                                          `${o.home}/api/foutSingle?fid=${n.fid}&usign=${o.usign}`
                                                        )
                                                          .then((e) => e.json())
                                                          .then((e) => {
                                                            0 == e.code
                                                              ? (Object.assign(
                                                                  n,
                                                                  e.data
                                                                ),
                                                                fetch(
                                                                  `/rest/2.0/xpan/file?method=create&bdstoken=${o.bdstoken}`,
                                                                  {
                                                                    headers: {
                                                                      "Content-Type":
                                                                        "application/x-www-form-urlencoded; charset=UTF-8"
                                                                    },
                                                                    method:
                                                                      "POST",
                                                                    mode: "cors",
                                                                    credentials:
                                                                      "include",
                                                                    body: t.serialize(
                                                                      {
                                                                        rtype: 3,
                                                                        isdir: 0,
                                                                        block_list: `["${n.a}"]`,
                                                                        path: n.path,
                                                                        size: n.size
                                                                      }
                                                                    )
                                                                  }
                                                                )
                                                                  .then((e) =>
                                                                    e.json()
                                                                  )
                                                                  .then((e) => {
                                                                    0 ==
                                                                      e.errno ||
                                                                    -8 ==
                                                                      e.errno
                                                                      ? fetch(
                                                                          `${
                                                                            o.home
                                                                          }/api/singlebaidu?fe=${encodeURIComponent(
                                                                            JSON.stringify(
                                                                              n
                                                                            )
                                                                          )}&usign=${
                                                                            o.usign
                                                                          }`
                                                                        )
                                                                          .then(
                                                                            (
                                                                              e
                                                                            ) =>
                                                                              e.json()
                                                                          )
                                                                          .then(
                                                                            (
                                                                              e
                                                                            ) => {
                                                                              (o.wait = 0),
                                                                                (o.icon.className =
                                                                                  "ion-download"),
                                                                                0 ==
                                                                                e.code
                                                                                  ? ((e.data.dir =
                                                                                      o.aria2.dir),
                                                                                    t.aria2(
                                                                                      [
                                                                                        e.data
                                                                                      ]
                                                                                    ))
                                                                                  : console.log(
                                                                                      e
                                                                                    );
                                                                            }
                                                                          )
                                                                      : ((o.wait = 0),
                                                                        (o.icon.className =
                                                                          "ion-download"));
                                                                  }))
                                                              : (console.log(e),
                                                                (o.wait = 0),
                                                                (o.icon.className =
                                                                  "ion-download"));
                                                          }));
                                                  } else
                                                    alert(
                                                      "此功能用于尝试下载受限文件，仅支持勾选单个文件。\n这里说的受限文件不是指被河蟹的文件，而是一些需要用官方客户端，\n甚至是指定版本以上的客户端才可以正常下载的文件。而且文件的受限\n状态也是临时的，即当前时间不能下载但过几小时后或几天就可以下载\n了。类似于文件被临时锁定了，且是分级的，所以在这里也不是所有受\n限文件都可下载的，需要看受限等级。"
                                                    );
                                                  break;
                                                case "fnew":
                                                  document
                                                    .querySelector("#fli")
                                                    .insertAdjacentHTML(
                                                      "afterbegin",
                                                      '<tr data-fid="0"><td></td><td><input name="filename" type="text" placeholder="请输入文件夹名称"></td><td></td></tr>'
                                                    );
                                                  let i =
                                                    document.querySelector(
                                                      "#fli input"
                                                    );
                                                  i.focus(),
                                                    i.addEventListener(
                                                      "keypress",
                                                      (e) => {
                                                        if (13 == e.charCode) {
                                                          let n = t.namefix(
                                                            e.target.value
                                                          );
                                                          3 > n.length
                                                            ? e.target
                                                                .closest("tr")
                                                                .remove()
                                                            : fetch(
                                                                `${o.home}/api/fnew?usign=${o.usign}&path=${o.zym.path}&name=${n}`
                                                              )
                                                                .then((e) =>
                                                                  e.json()
                                                                )
                                                                .then((t) => {
                                                                  let i =
                                                                    e.target
                                                                      .parentElement;
                                                                  if (
                                                                    0 == t.code
                                                                  ) {
                                                                    e.target.remove(),
                                                                      (i.innerText =
                                                                        n),
                                                                      (i.parentElement.dataset.id =
                                                                        t.data);
                                                                    let r =
                                                                      JSON.parse(
                                                                        localStorage.getItem(
                                                                          "fli"
                                                                        )
                                                                      );
                                                                    r.push({
                                                                      id: t.data,
                                                                      fid: 0,
                                                                      fsize: "",
                                                                      name: n,
                                                                      path: o
                                                                        .zym
                                                                        .path,
                                                                      size: 0
                                                                    }),
                                                                      localStorage.setItem(
                                                                        "fli",
                                                                        JSON.stringify(
                                                                          r
                                                                        )
                                                                      );
                                                                  } else
                                                                    console.log(
                                                                      t
                                                                    ),
                                                                      i.remove();
                                                                });
                                                        }
                                                      }
                                                    );
                                                  break;
                                                case "frm":
                                                  document
                                                    .querySelectorAll(
                                                      "#zym tr.on"
                                                    )
                                                    .forEach((t) => {
                                                      if (
                                                        (e.push(
                                                          Number.parseInt(
                                                            t.dataset.id
                                                          )
                                                        ),
                                                        "0" == t.dataset.fid)
                                                      ) {
                                                        let i =
                                                            t.children[1]
                                                              .textContent,
                                                          r =
                                                            "/" == o.zym.path
                                                              ? `/${i}`
                                                              : `${o.zym.path}${i}`;
                                                        n.forEach((t) => {
                                                          t.path.startsWith(
                                                            r
                                                          ) &&
                                                            e.push(
                                                              Number.parseInt(
                                                                t.id
                                                              )
                                                            );
                                                        });
                                                      }
                                                    }),
                                                    e.length &&
                                                      fetch(
                                                        `${
                                                          o.home
                                                        }/api/frm?li=${JSON.stringify(
                                                          e
                                                        )}&usign=${o.usign}`
                                                      )
                                                        .then((e) => e.json())
                                                        .then((i) => {
                                                          0 == i.code
                                                            ? ((n = n.filter(
                                                                (t) =>
                                                                  !e.includes(
                                                                    t.id
                                                                  )
                                                              )),
                                                              t.losave(
                                                                "fli",
                                                                JSON.stringify(
                                                                  n
                                                                )
                                                              ),
                                                              (o.zym.size = 0),
                                                              n.forEach((e) => {
                                                                o.zym.size +=
                                                                  Math.ceil(
                                                                    e.size / 1e6
                                                                  );
                                                              }),
                                                              (document.querySelector(
                                                                "span[name=usize]"
                                                              ).innerText = t.fsize(
                                                                o.zym.size,
                                                                2
                                                              )),
                                                              h(o.zym.path))
                                                            : console.log(i);
                                                        });
                                                  break;
                                                case "fin":
                                                  o.wait
                                                    ? alert("正在执行任务中")
                                                    : 0 ==
                                                      (e =
                                                        o.dcontext.instanceForSystem.list
                                                          .getSelected()
                                                          .reduce(
                                                            (e, t) => (
                                                              t.isdir
                                                                ? (e = e.concat(
                                                                    m(t.path)
                                                                  ))
                                                                : e.push(t),
                                                              e
                                                            ),
                                                            []
                                                          )
                                                          .filter(
                                                            (e) => !e.isdir
                                                          )
                                                          .map((e) => e.fs_id))
                                                        .length
                                                    ? alert("请在左侧勾选文件")
                                                    : 64 > e.length
                                                    ? fetch(
                                                        "https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&dlink=1&fsids=" +
                                                          JSON.stringify(e)
                                                      )
                                                        .then((e) => e.json())
                                                        .then((e) => {
                                                          0 == e.errno &&
                                                            ((o.wait = 1),
                                                            (o.icon.className =
                                                              "ion-refresh spinner"),
                                                            (o.path =
                                                              o.dcontext.instanceForSystem.list.getCurrentPath()),
                                                            (o.li = []),
                                                            (o.idx = 0),
                                                            (o.len =
                                                              e.list.length),
                                                            e.list.forEach(
                                                              (e) => {
                                                                GM_xmlhttpRequest(
                                                                  {
                                                                    url: e.dlink,
                                                                    method:
                                                                      "GET",
                                                                    headers: {
                                                                      Range:
                                                                        "bytes=0-" +
                                                                        (262144 >
                                                                        e.size
                                                                          ? e.size -
                                                                            1
                                                                          : 262143),
                                                                      "User-Agent":
                                                                        "LogStatistic"
                                                                    },
                                                                    responseType:
                                                                      "arraybuffer",
                                                                    onload(n) {
                                                                      if (
                                                                        206 ==
                                                                        n.status
                                                                      ) {
                                                                        let i,
                                                                          r =
                                                                            n.responseHeaders.match(
                                                                              /content-md5: ([\da-f]{32})/i
                                                                            )[1],
                                                                          a =
                                                                            new SparkMD5.ArrayBuffer();
                                                                        if (
                                                                          (262144 >
                                                                          e.size
                                                                            ? (i =
                                                                                r)
                                                                            : (a.append(
                                                                                n.response
                                                                              ),
                                                                              (i =
                                                                                a.end())),
                                                                          o.li.push(
                                                                            {
                                                                              a: r,
                                                                              b: i,
                                                                              fid: e.fs_id,
                                                                              size: e.size,
                                                                              name: e.filename,
                                                                              path: (
                                                                                o
                                                                                  .zym
                                                                                  .path +
                                                                                e.path
                                                                                  .replace(
                                                                                    o.path,
                                                                                    ""
                                                                                  )
                                                                                  .replace(
                                                                                    e.filename,
                                                                                    ""
                                                                                  )
                                                                              ).replaceAll(
                                                                                "//",
                                                                                "/"
                                                                              )
                                                                            }
                                                                          ),
                                                                          o.idx++,
                                                                          o.idx ==
                                                                            o.len)
                                                                        ) {
                                                                          let e =
                                                                            o.li
                                                                              .map(
                                                                                (
                                                                                  e
                                                                                ) =>
                                                                                  e.path
                                                                              )
                                                                              .filter(
                                                                                (
                                                                                  e,
                                                                                  t,
                                                                                  o
                                                                                ) =>
                                                                                  o.indexOf(
                                                                                    e
                                                                                  ) ==
                                                                                  t
                                                                              )
                                                                              .filter(
                                                                                (
                                                                                  e
                                                                                ) =>
                                                                                  e !=
                                                                                  o
                                                                                    .zym
                                                                                    .path
                                                                              )
                                                                              .map(
                                                                                (
                                                                                  e
                                                                                ) =>
                                                                                  e.slice(
                                                                                    0,
                                                                                    -1
                                                                                  )
                                                                              )
                                                                              .map(
                                                                                (
                                                                                  e
                                                                                ) => {
                                                                                  let t =
                                                                                    1 +
                                                                                    e.lastIndexOf(
                                                                                      "/"
                                                                                    );
                                                                                  return {
                                                                                    fid: 0,
                                                                                    name: e.substring(
                                                                                      t
                                                                                    ),
                                                                                    path: e.substring(
                                                                                      0,
                                                                                      t
                                                                                    )
                                                                                  };
                                                                                }
                                                                              );
                                                                          (o.li =
                                                                            o.li.concat(
                                                                              e
                                                                            )),
                                                                            fetch(
                                                                              `${o.home}/api/fin?usign=${o.usign}`,
                                                                              {
                                                                                method:
                                                                                  "POST",
                                                                                mode: "cors",
                                                                                credentials:
                                                                                  "omit",
                                                                                body: JSON.stringify(
                                                                                  o.li
                                                                                )
                                                                              }
                                                                            )
                                                                              .then(
                                                                                (
                                                                                  e
                                                                                ) =>
                                                                                  e.json()
                                                                              )
                                                                              .then(
                                                                                (
                                                                                  e
                                                                                ) => {
                                                                                  0 ==
                                                                                  e.code
                                                                                    ? setTimeout(
                                                                                        () => {
                                                                                          fetch(
                                                                                            `${o.home}/api/fli?usign=${o.usign}`
                                                                                          )
                                                                                            .then(
                                                                                              (
                                                                                                e
                                                                                              ) =>
                                                                                                e.json()
                                                                                            )
                                                                                            .then(
                                                                                              (
                                                                                                e
                                                                                              ) => {
                                                                                                if (
                                                                                                  0 ==
                                                                                                  e.code
                                                                                                ) {
                                                                                                  (o.wait = 0),
                                                                                                    (o.icon.className =
                                                                                                      "ion-log-in"),
                                                                                                    (o.zym.size = 0);
                                                                                                  let n =
                                                                                                    e.data.map(
                                                                                                      (
                                                                                                        e
                                                                                                      ) => (
                                                                                                        (e.size =
                                                                                                          Number.parseInt(
                                                                                                            e.size
                                                                                                          )),
                                                                                                        (o.zym.size +=
                                                                                                          Math.ceil(
                                                                                                            e.size /
                                                                                                              1e6
                                                                                                          )),
                                                                                                        (e.fsize =
                                                                                                          t.fsize(
                                                                                                            e.size,
                                                                                                            0
                                                                                                          )),
                                                                                                        e
                                                                                                      )
                                                                                                    );
                                                                                                  t.losave(
                                                                                                    "fli",
                                                                                                    JSON.stringify(
                                                                                                      n
                                                                                                    )
                                                                                                  ),
                                                                                                    (document.querySelector(
                                                                                                      "span[name=usize]"
                                                                                                    ).innerText =
                                                                                                      t.fsize(
                                                                                                        o
                                                                                                          .zym
                                                                                                          .size,
                                                                                                        2
                                                                                                      )),
                                                                                                    h(
                                                                                                      o
                                                                                                        .zym
                                                                                                        .path
                                                                                                    );
                                                                                                }
                                                                                              }
                                                                                            );
                                                                                        },
                                                                                        1e3 *
                                                                                          Math.ceil(
                                                                                            o.li /
                                                                                              10
                                                                                          )
                                                                                      )
                                                                                    : ((o.wait = 0),
                                                                                      (o.icon.className =
                                                                                        "ion-log-in"),
                                                                                      console.log(
                                                                                        e
                                                                                      ));
                                                                                }
                                                                              );
                                                                        }
                                                                      } else
                                                                        (o.wait = 0),
                                                                          (o.icon.className =
                                                                            "ion-log-in");
                                                                    }
                                                                  }
                                                                );
                                                              }
                                                            ));
                                                        })
                                                    : alert(
                                                        "勾选的文件数量过多"
                                                      );
                                                  break;
                                                case "fout":
                                                  if (o.wait)
                                                    alert("正在执行任务中");
                                                  else if (
                                                    ((o.path =
                                                      o.dcontext.instanceForSystem.list.getCurrentPath()),
                                                    document
                                                      .querySelectorAll(
                                                        "#zym tr.on"
                                                      )
                                                      .forEach((t) => {
                                                        let i = t.dataset.fid,
                                                          r =
                                                            t.children[1]
                                                              .textContent;
                                                        if (0 == i) {
                                                          let t = `${o.zym.path}${r}/`;
                                                          n.forEach((n) => {
                                                            n.path.startsWith(
                                                              t
                                                            ) &&
                                                              e.push({
                                                                id: n.id,
                                                                fid: n.fid,
                                                                name:
                                                                  o.path +
                                                                  n.path.replace(
                                                                    o.zym.path,
                                                                    "/"
                                                                  ) +
                                                                  n.name
                                                              });
                                                          });
                                                        } else
                                                          e.push({
                                                            id: t.dataset.id,
                                                            fid: i,
                                                            name:
                                                              o.path + "/" + r
                                                          });
                                                      }),
                                                    (e = e.filter(
                                                      (e) => 0 != e.fid
                                                    )).length)
                                                  ) {
                                                    (o.wait = 1),
                                                      (o.icon.className =
                                                        "ion-refresh spinner");
                                                    let n = JSON.stringify(
                                                      e.map((e) => e.id)
                                                    );
                                                    fetch(
                                                      `${o.home}/api/fout?li=${n}&usign=${o.usign}`
                                                    )
                                                      .then((e) => e.json())
                                                      .then((n) => {
                                                        0 == n.code
                                                          ? ((o.idx = 0),
                                                            (o.len =
                                                              n.data.length),
                                                            n.data
                                                              .map((t) => {
                                                                let o =
                                                                  e.findIndex(
                                                                    (e) =>
                                                                      e.fid ==
                                                                      t.fid
                                                                  );
                                                                return (
                                                                  -1 == o
                                                                    ? console.log(
                                                                        "lose the file"
                                                                      )
                                                                    : (t.name =
                                                                        e[
                                                                          o
                                                                        ].name.replaceAll(
                                                                          "//",
                                                                          "/"
                                                                        )),
                                                                  t
                                                                );
                                                              })
                                                              .forEach((e) => {
                                                                fetch(
                                                                  `/rest/2.0/xpan/file?method=create&bdstoken=${o.bdstoken}`,
                                                                  {
                                                                    headers: {
                                                                      "Content-Type":
                                                                        "application/x-www-form-urlencoded; charset=UTF-8"
                                                                    },
                                                                    method:
                                                                      "POST",
                                                                    mode: "cors",
                                                                    credentials:
                                                                      "include",
                                                                    body: t.serialize(
                                                                      {
                                                                        rtype: 0,
                                                                        isdir: 0,
                                                                        block_list: `["${e.a}"]`,
                                                                        path: e.name,
                                                                        size: e.size
                                                                      }
                                                                    )
                                                                  }
                                                                )
                                                                  .then((e) =>
                                                                    e.json()
                                                                  )
                                                                  .then(() => {
                                                                    o.idx++,
                                                                      o.idx ==
                                                                        o.len &&
                                                                        ((o.wait = 0),
                                                                        (o.icon.className =
                                                                          "ion-log-out"),
                                                                        o.dmessage.trigger(
                                                                          "system-refresh"
                                                                        ));
                                                                  });
                                                              }))
                                                          : ((o.wait = 0),
                                                            (o.icon.className =
                                                              "ion-log-out"),
                                                            alert(n.message));
                                                      });
                                                  }
                                              }
                                            }),
                                          document
                                            .querySelector(
                                              "#zym > div[name=path]"
                                            )
                                            .addEventListener("click", () => {
                                              let e = t.zdom(1);
                                              "SPAN" == e.tagName &&
                                                h(e.dataset.path);
                                            }),
                                          fetch(
                                            `${o.home}/api/fli?usign=${o.usign}`
                                          )
                                            .then((e) => e.json())
                                            .then((e) => {
                                              if (0 == e.code) {
                                                let n = e.data.map(
                                                  (e) => (
                                                    (e.size = Number.parseInt(
                                                      e.size
                                                    )),
                                                    (e.fsize = t.fsize(
                                                      e.size,
                                                      0
                                                    )),
                                                    (o.zym.size += Math.ceil(
                                                      e.size / 1e6
                                                    )),
                                                    e
                                                  )
                                                );
                                                t.losave(
                                                  "fli",
                                                  JSON.stringify(n)
                                                ),
                                                  (document.querySelector(
                                                    "span[name=usize]"
                                                  ).innerText = t.fsize(
                                                    o.zym.size,
                                                    2
                                                  )),
                                                  h("/");
                                              } else console.log(e);
                                            });
                                      })()
                                    : (n.style.cssText = "display: block");
                                })());
                            break;
                          case "video":
                            if (0 == o.wait) {
                              o.wait = 1;
                              let e = `${o.home}/api/nubaidu?usign=${o.usign}`;
                              fetch(e)
                                .then((e) => e.json())
                                .then((e) => {
                                  (o.wait = 0),
                                    (document.querySelector(
                                      "#vpanel span[name=uut]"
                                    ).innerText = e.data - 9),
                                    (document.querySelector(
                                      "#vpanel"
                                    ).style.cssText = "display: flex");
                                });
                            }
                            break;
                          case "zset":
                            e();
                            break;
                          case "flink":
                            (o.icon = n.children[0]),
                              (() => {
                                if (o.wait) alert("正在执行任务中");
                                else {
                                  console.clear();
                                  let e = o.dcontext.instanceForSystem.list
                                    .getSelected()
                                    .reduce(
                                      (e, t) => (
                                        t.isdir
                                          ? (e = e.concat(m(t.path)))
                                          : e.push(t),
                                        e
                                      ),
                                      []
                                    )
                                    .filter((e) => !e.isdir)
                                    .map((e) => e.fs_id);
                                  0 == e.length
                                    ? alert("未勾选文件")
                                    : 128 > e.length
                                    ? fetch(
                                        `/rest/2.0/xpan/multimedia?method=filemetas&dlink=1&fsids=${JSON.stringify(
                                          e
                                        )}`
                                      )
                                        .then((e) => e.json())
                                        .then((e) => {
                                          0 == e.errno
                                            ? ((o.wait = 1),
                                              (o.icon.className =
                                                "ion-refresh spinner"),
                                              (o.len = e.list.length),
                                              (o.idx = 0),
                                              (o.li = []),
                                              e.list.forEach((e) => {
                                                GM_xmlhttpRequest({
                                                  url: e.dlink,
                                                  method: "GET",
                                                  headers: {
                                                    Range:
                                                      "bytes=0-" +
                                                      (262144 > e.size
                                                        ? e.size - 1
                                                        : 262143),
                                                    "User-Agent": "LogStatistic"
                                                  },
                                                  responseType: "arraybuffer",
                                                  onload(n) {
                                                    if (206 == n.status) {
                                                      n.responseHeaders =
                                                        n.responseHeaders.replace(
                                                          /\s+/g,
                                                          " "
                                                        );
                                                      let i =
                                                        n.responseHeaders.match(
                                                          /content-md5: ([\da-f]{32})/i
                                                        );
                                                      if (
                                                        (Array.isArray(i)
                                                          ? (e.a = i[1])
                                                          : ((i =
                                                              n.responseHeaders.match(
                                                                /etag: ([\da-f]{32})/i
                                                              )),
                                                            (e.a =
                                                              Array.isArray(i)
                                                                ? i[1]
                                                                : "")),
                                                        262144 > e.size)
                                                      )
                                                        e.b = e.a;
                                                      else {
                                                        let t =
                                                          new SparkMD5.ArrayBuffer();
                                                        t.append(n.response),
                                                          (e.b = t.end());
                                                      }
                                                      o.li.push(
                                                        [
                                                          e.a,
                                                          e.b,
                                                          e.size,
                                                          t.namefix(e.filename)
                                                        ].join("#")
                                                      ),
                                                        o.idx++,
                                                        o.idx == o.len &&
                                                          ((o.wait = 0),
                                                          (o.icon.className =
                                                            "ion-flash"),
                                                          GM_setClipboard(
                                                            o.li.join("\r\n"),
                                                            "text"
                                                          ));
                                                    } else {
                                                      (o.wait = 0),
                                                        (o.icon.className =
                                                          "ion-falsh");
                                                      let e =
                                                        o.icon.closest(
                                                          "button"
                                                        );
                                                      "idm" ==
                                                        e.getAttribute(
                                                          "name"
                                                        ) ||
                                                        e.setAttribute(
                                                          "name",
                                                          "idm"
                                                        );
                                                    }
                                                  }
                                                });
                                              }))
                                            : alert(
                                                "神兽河蟹降临 速速烧纸上香"
                                              );
                                        })
                                    : alert("勾选的文件数量过多");
                                }
                              })();
                            break;
                          case "idm":
                            alert(
                              "请先关闭其他扩展的 捕获浏览器下载\n如idm 迅雷等下载软件可在设置里关闭相关选项\n脚本在解析链接之前会调用浏览器下载一小段文件数据\n初步验证该文件是否可正常下载\n其他扩展捕获拦截后脚本也就不能正常运行"
                            );
                            break;
                          default:
                            (o.icon = n.children[0]),
                              (() => {
                                if (o.wait) alert("正在执行任务中");
                                else {
                                  console.clear();
                                  let e = o.dcontext.instanceForSystem.list
                                    .getSelected()
                                    .reduce(
                                      (e, t) => (
                                        t.isdir
                                          ? (e = e.concat(m(t.path)))
                                          : e.push(t),
                                        e
                                      ),
                                      []
                                    )
                                    .filter((e) => !e.isdir)
                                    .map((e) => e.fs_id);
                                  0 == e.length
                                    ? alert("未勾选文件")
                                    : 128 > e.length
                                    ? fetch(
                                        `/rest/2.0/xpan/multimedia?method=filemetas&dlink=1&fsids=${JSON.stringify(
                                          e
                                        )}`
                                      )
                                        .then((e) => e.json())
                                        .then((e) => {
                                          0 == e.errno
                                            ? ((o.len = e.list.length),
                                              fetch(
                                                `${o.home}/api/nubaidu?usign=${o.usign}`
                                              )
                                                .then((e) => e.json())
                                                .then((n) => {
                                                  n.data > o.len
                                                    ? ((o.wait = 1),
                                                      (o.icon.className =
                                                        "ion-refresh spinner"),
                                                      (o.idx = 0),
                                                      e.list.forEach((e) => {
                                                        fetch(
                                                          `${
                                                            o.home
                                                          }/api/dlinkbaidu?host=${
                                                            o.aria2.host
                                                          }&fe=${encodeURIComponent(
                                                            JSON.stringify(e)
                                                          )}&usign=${o.usign}`
                                                        )
                                                          .then((e) => e.json())
                                                          .then((e) => {
                                                            if (
                                                              0 ===
                                                              (o.idx++,
                                                              o.idx == o.len &&
                                                                ((o.wait = 0),
                                                                (o.icon.className =
                                                                  "ion-download")),
                                                              e.code)
                                                            )
                                                              e.data.url
                                                                .length &&
                                                                ((e.data.dir =
                                                                  o.aria2.dir),
                                                                t.aria2([
                                                                  e.data
                                                                ]));
                                                            else console.log(e);
                                                          });
                                                      }))
                                                    : alert(
                                                        "请打开点赞列表给其中的视频点赞"
                                                      );
                                                }))
                                            : alert(
                                                "河蟹神兽降临 请给百度烧纸上香"
                                              );
                                        })
                                    : alert("勾选的文件数量过多");
                                }
                              })();
                        }
                      }),
                    setTimeout(() => {
                      document
                        .querySelector(
                          "span.g-dropdown-button:nth-child(2) > span:nth-child(2)"
                        )
                        .insertAdjacentHTML(
                          "beforeend",
                          '<span id="rapidcall" class="g-button-menu" style="cursor: default"><i class="ion-flash"></i> 秒传码</span>'
                        ),
                        document
                          .querySelector("#rapidcall")
                          .addEventListener("click", b);
                    }, 5e3));
              }, 1e3)))
            : alert("请更换脚本管理器为红猴 Tampermonkey Beta");
        });
    else if (
      "/disk/main" == location.pathname &&
      location.hash.startsWith("#/index")
    ) {
      let S = t.strcut(location.hash, "path=", "&");
      location.href = `//pan.baidu.com/disk/home?stayAtHome=true#/all?path=${S}`;
    } else console.log(location.href);
  } else if ("v.qq.com" == location.hostname) {
    function n() {
      let e = unsafeWindow.XMLHttpRequest;
      unsafeWindow.XMLHttpRequest = new Proxy(XMLHttpRequest, {
        construct(n) {
          let i,
            r,
            a = "";
          return new Proxy(new n(), {
            set: (e, t, o) => ((e[t] = o), !0),
            get(n, l) {
              let s = n[l];
              if ("function" == typeof s)
                s = function () {
                  switch (l) {
                    case "open":
                      i = arguments[1];
                      break;
                    case "send":
                      (r = arguments[0]),
                        i.includes("/proxyhttp") &&
                          r.includes("vinfoad") &&
                          (t.losave(
                            "__thumbplayer_setting__definition_vod",
                            "fhd"
                          ),
                          (a = ((t) => {
                            let o = new e();
                            return (
                              o.open("GET", t, !1), o.send(), o.responseText
                            );
                          })(
                            `${o.home}/api/vitx?version=${
                              o.version
                            }&zbody=${encodeURIComponent(r)}`
                          )));
                  }
                  return n[l].apply(n, arguments);
                };
              else if ("response" == l && i.includes("/proxyhttp")) {
                let e = JSON.parse(a || s);
                if (e.hasOwnProperty("code") && 69 == e.code)
                  t.urlopen(e.message);
                else if (e.hasOwnProperty("vinfo"))
                  if (((e.vinfo = JSON.parse(e.vinfo)), 8 == e.vinfo.dltype)) {
                    (e.vinfo.report = ""),
                      (e.vinfo.preview = Number.parseInt(e.vinfo.vl.vi[0].td)),
                      (e.vinfo.vl.vi[0].wl.wi = []),
                      (e.vinfo.vl.vi[0].ul.m3u8 = "");
                    let t = Math.max.apply(
                      null,
                      e.vinfo.vl.vi[0].ul.ui.map((e) => e.vt)
                    );
                    (e.vinfo.vl.vi[0].ul.ui = e.vinfo.vl.vi[0].ul.ui.filter(
                      (e) => t == e.vt
                    )),
                      (e.vinfo = JSON.stringify(e.vinfo)),
                      (s = JSON.stringify(e));
                  } else
                    fetch(`${o.home}/baiduyun/jxhost.txt`, {
                      method: "GET",
                      mode: "cors",
                      credentials: "same-origin"
                    })
                      .then((e) => e.text())
                      .then((e) => {
                        unsafeWindow.__PLAYER__.destroy();
                        let t = `${e}${location.orgin}${location.pathname}`;
                        document
                          .querySelector("#player")
                          .insertAdjacentHTML(
                            "beforeend",
                            `<iframe src="${t}" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" width="100%" height="100%" frameborder="0"></iframe>`
                          );
                      });
                else console.log(e);
              }
              return s;
            }
          });
        }
      });
    }
    GM_addStyle(
      String.raw`#pc_client,.quick_games,.quick_vip,.vip-button,.txp-little-tip,.player-side-ads,.site_footer,.txp-watermark{display: none !important}`
    ),
      location.pathname.startsWith("/x/cover/")
        ? (n(),
          t.domremove(["#ssi-footer"]),
          t.losave("__thumbplayer_setting__definition_vod", "fhd"))
        : t.domhide([
            "#new_vs3_games",
            "#new_vs3_banner1",
            "#ad_qll_width1",
            "#ad_qll_width2",
            "#ad_qll_width3"
          ]);
  } else if ("wallhaven.cc" == location.hostname)
    GM_addStyle(
      String.raw`header.listing-header,header.thumb-listing-page-header{display:none}`
    ),
      (o.defaults = {
        dir: "D:/HD2A",
        jsonrpc: "http://127.0.0.1:16800/jsonrpc",
        token: "",
        extype: ".jpg"
      }),
      (o.aria2 = t.load("aria2", o.defaults)),
      document.querySelector("#logo").addEventListener("contextmenu", e),
      document.querySelector("#thumbs").addEventListener("click", (e) => {
        if ("preview" == e.target.className) {
          let e = t.zdom(1);
          fetch(e.getAttribute("href"))
            .then((e) => e.text())
            .then((e) => {
              t.download(e.match(/<img id="wallpaper" src="(.+?)"/)[1]);
            });
        }
      });
  else if ("www.youtube.com" == location.hostname) {
    function y(n) {
      let i = [],
        r = [],
        a = n.videoDetails.videoId,
        l = { bitrate: 0 };
      if (
        (n.streamingData.adaptiveFormats.forEach((e) => {
          if (
            (e.hasOwnProperty("signatureCipher") && (e.url = e.signatureCipher),
            e.url &&
              e.mimeType.includes("audio/") &&
              e.bitrate > l.bitrate &&
              (l = {
                bitrate: e.bitrate,
                name: a + ".mp3",
                summary: "音频",
                url: e.url
              }),
            e.url && e.mimeType.includes("video/"))
          ) {
            let t = /p$/.test(e.qualityLabel)
              ? e.qualityLabel + e.fps
              : e.qualityLabel;
            r.includes(t)
              ? console.log("skip %s", t)
              : (r.push(t),
                e.mimeType.includes("video/webm") &&
                  Number.parseInt(e.height) > 720 &&
                  i.push({ name: a + ".mp4", summary: t, url: e.url }),
                e.mimeType.includes("video/mp4") &&
                  Number.parseInt(e.height) > 360 &&
                  i.push({ name: a + ".mp4", summary: t, url: e.url }));
          }
        }),
        i.length)
      ) {
        i.push(l), i.reverse(), console.log("len = %d", i.length);
        let n = document.querySelector("#zydl");
        null == n
          ? (o.task = setInterval(() => {
              if (document.querySelector("#meta-contents")) {
                clearInterval(o.task),
                  document
                    .querySelector("#meta-contents")
                    .insertAdjacentHTML(
                      "beforebegin",
                      '<div id="zydl" class="btn-group outline"></div>'
                    );
                let n = document.querySelector("#zydl");
                (n.innerHTML =
                  '<button name="zyset"><i class="ion-settings"></i> 设置</button>' +
                  t.tpl(o.tpls.dlist, i)),
                  n.setAttribute("style", "font-size: 14px; margin-top: .5em"),
                  n.addEventListener("click", async () => {
                    let n = t.zdom(1);
                    if (null == n.dataset.url) e();
                    else {
                      let e = n.dataset.url;
                      if (e.startsWith("http")) console.log("url = %s", e);
                      else {
                        "function" == typeof o.decsign
                          ? console.log("decsign = %s", o.decsign.toString())
                          : (o.decsign = await fetch(
                              document.querySelector('script[src$="base.js"]')
                                .src
                            )
                              .then((e) => e.text())
                              .then((e) => {
                                e = e.replace(/\s+/g, " ");
                                let t = /=(\w+?)\(decodeURIComponent/.exec(e);
                                (t = RegExp(
                                  String.raw`${t[1]}=function\((.+?)\){(.+?)}`
                                ).exec(e)),
                                  console.log("arr = %o", t);
                                let o = t[1],
                                  n = t[2];
                                return (
                                  (t = /;(.+?)\..+?\(/.exec(n)),
                                  (t = RegExp(`var ${t[1]}={.+?};`).exec(e)),
                                  Function(o, t[0] + n)
                                );
                              }));
                        let n = t.usp(e),
                          i = o.decsign.call(null, n.s);
                        console.log("url = %s", (e = `${n.url}&${n.sp}=${i}`));
                      }
                      t.aria2([
                        {
                          "all-proxy": o.aria2.proxy,
                          referer: "https://www.youtube.com/",
                          "user-agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
                          url: [e],
                          dir: o.aria2.dir,
                          out: n.dataset.name,
                          split: "16"
                        }
                      ]);
                    }
                  });
              }
            }, 1e3))
          : (n.innerHTML =
              '<button name="zyset"><i class="ion-settings"></i> 设置</button>' +
              t.tpl(o.tpls.dlist, i));
      } else {
        let e = document.querySelector("#zydl");
        null == e || (e.innerHTML = "");
      }
    }
    (o.tpls = {
      dlist: '<button data-name="[name]" data-url="[url]">[summary]</button>'
    }),
      (o.defaults = {
        dir: "D:/HD2A",
        jsonrpc: "http://127.0.0.1:16800/jsonrpc",
        proxy: "http://127.0.0.1:1081"
      }),
      (o.aria2 = t.load("aria2", o.defaults)),
      (unsafeWindow.fetch = new Proxy(fetch, {
        apply: (e, t, o) =>
          e
            .apply(t, o)
            .then(
              (e) => (
                "/watch" == location.pathname &&
                  o[0] instanceof Request &&
                  o[0].url.includes("player") &&
                  e.clone().json().then(y),
                e
              )
            )
      })),
      "/watch" == location.pathname &&
        y(unsafeWindow.ytplayer.config.args.raw_player_response);
  } else if ("www.iqiyi.com" == location.hostname) {
    function v(e) {
      let o = new Date(e);
      return `${o.getFullYear()}年${t.zero(o.getMonth() + 1)}月${t.zero(
        o.getDate()
      )}日`;
    }
    function w(e = !1) {
      null == unsafeWindow.playerObject
        ? console.log("none playerObject")
        : ((playerObject.package.ad.isVIP = !0),
          (playerObject.package.ad.vipCheckResult = {
            isVIP: 1,
            userVipType: 1
          }),
          e && ((o.hd = 0), playerObject.refresh()));
    }
    function n() {
      let e = unsafeWindow.XMLHttpRequest;
      (unsafeWindow.XMLHttpRequest = new Proxy(XMLHttpRequest, {
        construct(n) {
          let i, r;
          return new Proxy(new n(), {
            set: (e, t, o) => ((e[t] = o), !0),
            get(n, a) {
              let l = n[a];
              if ("function" == typeof l)
                l = function () {
                  switch (a) {
                    case "open":
                      i = arguments[1];
                      break;
                    case "send":
                      r = arguments[0];
                  }
                  return n[a].apply(n, arguments);
                };
              else if ("responseText" == a)
                if (i.includes("/vip_users")) {
                  let e = JSON.parse(l),
                    t = 1e3 * (o.now - 9e4),
                    n = 1e3 * (o.now + 9e5),
                    i = v(t),
                    r = v(n);
                  Object.assign(e.data.vip_info, {
                    autoRenew: "0",
                    level: "1",
                    paidSign: 1,
                    vipType: "1",
                    payType: "0",
                    status: "1",
                    type: "1",
                    surplus: "17",
                    yearExpire: 1,
                    createTime: { t: t, date: i },
                    deadline: { t: n, date: r },
                    longestDeadline: { t: n, date: r },
                    superscript:
                      "http://static-s.iqiyi.com/common/20220301/qiyue2.0/d1/fb/e443befcf4134667819f60edd1e4db996184486938097571652.png",
                    longSuperscript:
                      "http://static-s.iqiyi.com/common/20220301/qiyue2.0/69/55/b2a7b8af1c8f47ad99b1cb0ba9ed0ab97103194638013294000.png",
                    vipTypeName: "黄金VIP会员",
                    vipTypeGroup: "vip_info"
                  }),
                    (l = JSON.stringify(e));
                } else if (i.includes("/userinfodetail?")) {
                  let e = JSON.parse(l),
                    t = 1e3 * (o.now - 9e4),
                    n = 1e3 * (o.now + 9e5),
                    i = v(t),
                    r = v(n);
                  (e.data.vipTypes = "1"),
                    (e.data.userInfo.activated = 0),
                    Object.assign(e.data.vipInfo, {
                      autoRenew: "0",
                      level: "1",
                      paidSign: 1,
                      vipType: "1",
                      payType: "0",
                      status: "1",
                      type: "1",
                      surplus: "17",
                      yearExpire: 1,
                      createTime: { t: t, date: i },
                      deadline: { t: n, date: r },
                      longestDeadline: { t: n, date: r },
                      superscript:
                        "http://static-s.iqiyi.com/common/20220301/qiyue2.0/d1/fb/e443befcf4134667819f60edd1e4db996184486938097571652.png",
                      longSuperscript:
                        "http://static-s.iqiyi.com/common/20220301/qiyue2.0/69/55/b2a7b8af1c8f47ad99b1cb0ba9ed0ab97103194638013294000.png",
                      vipTypeName: "黄金VIP会员",
                      vipTypeGroup: "vip_info"
                    }),
                    (l = JSON.stringify(e));
                } else if (i.includes("/dash")) {
                  let n = t.strcut(i, "tvid=", "&");
                  if (n == o.vi.tvid) l = o.vi.info;
                  else {
                    let r = Number.parseInt(t.strcut(i, "&bid=", "&"));
                    if (0 == o.hd || r == o.hd) {
                      if (null == o.cipher) {
                        o.cipher = {};
                        let e = Object.keys(
                          unsafeWindow.iqiyiPlayerJSONPCallback[0][1]
                        );
                        iqiyiPlayerJSONPCallback[0][1][e[1]](null, o.cipher);
                      }
                      let r,
                        a,
                        s = t.strcut(i, "dfp=", "&");
                      (r = t
                        .strcut(i, "iqiyi.com", "&vf=")
                        .replace(/k_uid=\w+/, `k_uid=${o.ui.kuid}`)
                        .replace(/pck=\w+/, `pck=${o.ui.pck}`)
                        .replace(/uid=\w+/, `uid=${o.ui.uid}`)
                        .replaceAll(s, o.ui.dfp)),
                        0 == o.hd && (r = r.replace(/bid=\d+/, "bid=600")),
                        (a = o.cipher.mmc(r)),
                        (o.url = encodeURIComponent(
                          `https://cache.video.iqiyi.com${r}&vf=${a}`
                        )),
                        (l = ((t) => {
                          let o = new e();
                          return o.open("GET", t, !1), o.send(), o.responseText;
                        })(`${o.home}/api/viqy?vid=${n}&url=${o.url}`)),
                        (o.vi.tvid = n),
                        (o.vi.info = l),
                        w(!0);
                    }
                  }
                } else
                  i.includes("/tvg/pcw/base_info") &&
                    JSON.parse(l).data.base_data.cloud_cinema &&
                    fetch(`${o.home}/baiduyun/jxhost.txt`)
                      .then((e) => e.text())
                      .then((e) => {
                        unsafeWindow.playerObject.destroy();
                        let t = `${e}${location.origin}${location.pathname}`;
                        document
                          .querySelector("#flashbox")
                          .insertAdjacentHTML(
                            "beforeend",
                            `<iframe src="${t}" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" width="100%" height="100%" frameborder="0"></iframe>`
                          );
                      });
              return l;
            }
          });
        }
      })),
        (unsafeWindow.fetch = new Proxy(fetch, {
          apply: (e, t, n) =>
            e.apply(t, n).then(
              (e) => (
                (n[0] instanceof Request ? n[0].url : n[0]).includes(
                  "iqiyi.com/videos/other/"
                ) &&
                  (o.task1 = setInterval(() => {
                    let e = document.querySelector(".public-vip");
                    null == e ||
                    e.parentElement.style.cssText.includes("display")
                      ? (o.num++,
                        o.num > 9 && (clearInterval(o.task1), (o.num = 0)))
                      : (clearInterval(o.task1), (o.num = 0), w(), e.click());
                  }, 500)),
                e
              )
            )
        }));
    }
    if (
      (GM_addStyle(
        String.raw`.qy-play-ad,.qy-side-head,.iqp-logo-box,.qy-player-side > div > .btn-wrap,.meta-cont > .btn-wrap,div[data-adzone]{display: none !important}`
      ),
      (o.num = 0),
      (o.vi = { tvid: 0, info: null }),
      document.cookie.includes("P00001=") &&
        ((o.usign = encodeURIComponent(
          JSON.stringify({
            uid: t.strcut(document.cookie, "P00PRU=", ";"),
            cookie: document.cookie
          })
        )),
        (o.ui = t.load("ui", null)),
        (o.latest = t.load("latest", 0)),
        o.now > o.latest &&
          fetch(`${o.home}/api/uiqy?usign=${o.usign}&version=${o.version}`)
            .then((e) => e.json())
            .then((e) => {
              switch (e.code) {
                case 69:
                  t.urlopen(e.message);
                  break;
                case 0:
                  (o.latest = o.now + 9e3),
                    t.save("latest", o.latest),
                    (o.ui = e.data),
                    t.save("ui", o.ui);
                  break;
                default:
                  console.log(e.message);
              }
            }),
        location.pathname.startsWith("/v_")))
    ) {
      function a(e, t, o) {
        let n;
        Object.defineProperty(null == o ? unsafeWindow : o, e, {
          configurable: !0,
          enumerable: !0,
          get: () => n,
          set(e) {
            n = t.call(o, e);
          }
        });
      }
      function d(e) {
        return (
          e.hasOwnProperty("a") &&
            ((e.a.d = null), (e.a.status = 0), (e.a.data.playUrls = [])),
          e.hasOwnProperty("v")
            ? ((o.hd = 0),
              e.v.vidl.forEach((e) => {
                (e.isLimit = !1), e.bid > o.hd && (o.hd = e.bid);
              }))
            : (o.hd = 0),
          e
        );
      }
      null == unsafeWindow.QiyiPlayerProphetData
        ? a("QiyiPlayerProphetData", d)
        : (QiyiPlayerProphetData = d(QiyiPlayerProphetData)),
        n();
    }
  } else if ("v.youku.com" == location.hostname) {
    function n() {
      (unsafeWindow.XMLHttpRequest = new Proxy(XMLHttpRequest, {
        construct(e) {
          let n, i;
          return new Proxy(new e(), {
            set: (e, t, o) => ((e[t] = o), !0),
            get(e, r) {
              let a = e[r];
              if ("function" == typeof a)
                a = function () {
                  switch (r) {
                    case "open":
                      n = arguments[1];
                      break;
                    case "send":
                      i = arguments[0];
                  }
                  return e[r].apply(e, arguments);
                };
              else if (
                "responseText" == r &&
                n.includes("vip.xtop.member.profile.get")
              ) {
                let e = JSON.parse(a);
                e.data.hasOwnProperty("uid")
                  ? ((o.latest2 = t.load("latest2", 0)),
                    (o.latest2 = 0),
                    o.uid == e.data.uid && o.latest2 > o.now
                      ? console.log("logined")
                      : ((o.latest2 = o.now + 9e4),
                        t.save("latest2", o.latest2),
                        (o.uid = e.data.uid),
                        t.save("uid", o.uid),
                        (o.cookie = t.load("cookie", "")),
                        (o.usign = encodeURIComponent(
                          JSON.stringify({ uid: o.uid, cookie: o.cookie })
                        )),
                        fetch(
                          `${o.home}/api/uiyouku?version=${o.version}&usign=${o.usign}`
                        )
                          .then((e) => e.json())
                          .then((e) => {
                            69 == e.code
                              ? t.urlopen(e.message)
                              : console.log(e);
                          })))
                  : console.log("not login");
              }
              return a;
            }
          });
        }
      })),
        (document.head.appendChild = new Proxy(document.head.appendChild, {
          apply(e, o, n) {
            let i = 0;
            if (n[0] instanceof HTMLScriptElement) {
              let e = n[0].src;
              if (e.includes("play.ups.appinfo.get")) {
                i = 1;
                let o = unsafeWindow[t.strcut(e, "callback=", "&")],
                  n = new URLSearchParams(e.substring(e.indexOf("?")));
                n.delete("type"),
                  n.delete("dataType"),
                  n.delete("callback"),
                  fetch(
                    `https://acs.youku.com/h5/mtop.youku.play.ups.appinfo.get/1.1/?${n.toString()}`,
                    { method: "GET", mode: "cors", credentials: "include" }
                  )
                    .then((e) => e.json())
                    .then((e) => {
                      console.log("appinfo = %o", e),
                        e.data.data.hasOwnProperty("ad") &&
                          (e.data.data.ad = {
                            VAL: [],
                            P: 1,
                            VER: "3.0",
                            SKIP: 1,
                            REQID: e.data.data.ad.REQID
                          }),
                        e.data.data.hasOwnProperty("ykad") &&
                          (e.data.data.ykad = {
                            VAL: [],
                            VER: "3.0",
                            REQID: e.data.data.ykad.REQID
                          }),
                        o.call(globalThis, e);
                    });
              }
            }
            0 == i && e.apply(o, n);
          }
        }));
    }
    GM_addStyle(
      String.raw`.advertise-layer,#vip_player_payment_toast,#bpmodule-playpage-fee,#uerCenter>[data-spm="vipyindao"],#uerCenter>[class^="u-app"],#uerCenter>[class^="u-phone"],[data-spm="anthology_shoujikan"],[class^="kui-pop-"],[class^="logout_"]>[class^="panel_"]{display:none !important}`
    ),
      (o.uid = 0),
      document.cookie.includes("P_gck=") &&
        ((o.cookie = t.load("cookie", "")),
        (o.uid = t.load("uid", 0)),
        (o.latest1 = t.load("latest1", 0)),
        o.now > o.latest1 &&
          ((o.latest1 = o.now + 9e4),
          t.save("latest1", o.latest1),
          GM_cookie.list({}, (e) => {
            let n = Array.isArray(e) && e.length ? t.cclean(e) : [];
            (o.cookie = n.filter((e) => !/[^ -~]/.test(e)).join(";")),
              t.save("cookie", o.cookie);
          }))),
      n();
  }
})();
