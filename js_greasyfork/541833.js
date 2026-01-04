// ==UserScript==
// @name         橙光无限鲜花
//仅备份使用
// @version      1.0.4.0
// @namespace    http://tampermonkey.net/
// @description  使用说明：进入游戏后右上角点击启用
// @author       希尔顿
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @match        https://*.66rpg.com/h5/*
// @downloadURL https://update.greasyfork.org/scripts/541833/%E6%A9%99%E5%85%89%E6%97%A0%E9%99%90%E9%B2%9C%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/541833/%E6%A9%99%E5%85%89%E6%97%A0%E9%99%90%E9%B2%9C%E8%8A%B1.meta.js
// ==/UserScript==
(function () {
  'use strict';
 
  const m = document.createElement("button");
  m.textContent = "商城菜单";
  m.style.backgroundColor = "rgba(128, 128, 128, 0.5)";
  m.style.background = "#FF69B4";
  m.style.color = "white";
  m.style.border = "none";
  m.style.zIndex = "9999";
  m.style.borderRadius = "20px";
  m.style.padding = "5px 10px";
  m.style.position = "fixed";
  m.style.top = "20px";
  m.style.left = "20px";
  m.style.select = "none";
  m.style.cursor = "pointer";
  document.body.appendChild(m);
  const n = document.createElement("div");
  n.style.position = "fixed";
  n.style.top = "50px";
  n.style.left = "20px";
  n.style.backgroundColor = "rgba(255, 255, 255, 0)";
  n.style.border = "1px solid #FF69B4";
  n.style.display = "none";
  n.style.zIndex = "9998";
  document.body.appendChild(n);
  const a = (b, a) => {
    const c = document.createElement("div");
    c.textContent = b;
    c.style.padding = "10px";
    c.style.cursor = "pointer";
    c.style.border = "1px solid #ddd";
    c.style.margin = "2px";
    c.style.backgroundColor = "rgba(128, 128, 128, 0.5)";
    c.style.background = "#FF69B4";
    c.style.color = "white";
    c.style.borderRadius = "20px";
    c.style.select = "none";
    c.onclick = a;
    n.appendChild(c);
    return c;
  };
  m.onclick = () => {
    n.style.display = n.style.display === "none" ? "block" : "none";
  };
  const b = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };
  a("商城开关", function () {
    q = !q;
    this.innerText = q ? "商城开启" : "商城关闭";
    if (q) {
      console.log("拦截器已开启");
    } else {
      console.log("拦截器已关闭");
    }
  });
  a("退出菜单", () => {
    n.style.display = "none";
  });
  a("屏蔽按钮", () => {
    m.style.display = "none";
  });
  function o() {
    const f = new Date();
    const a = f.getFullYear().toString();
    const b = p(f.getMonth() + 1);
    const c = p(f.getDate());
    const d = p(f.getHours());
    const e = p(f.getMinutes());
    const g = p(f.getSeconds());
    const h = p(f.getMilliseconds(), 4);
    return "" + a + b + c + d + e + g + h;
  }
  function p(d, a = 2) {
    let b = d.toString();
    while (b.length < a) {
      b = "0" + b;
    }
    return b;
  }
  let q = false;
  const c = [];
  c.push({
    match: b => b.includes("/createBuyOrder"),
    modify: (e, a) => {
      const b = new URLSearchParams(a.split("?")[1]);
      const c = b.get("goods_id");
      const d = b.get("buy_num");
      const f = o();
      const g = {
        goods_id: c,
        order_id: "${orderId}",
        buy_num: d
      };
      const h = {
        status: 1,
        msg: "successful",
        data: g
      };
      return JSON.stringify(h);
    }
  });
  const h = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (g, i, a = true, b = null, d = null) {
    this._url = i;
    if (!q) {
      return h.call(this, g, i, a, b, d);
    }
    h.apply(this, arguments);
    this.addEventListener("readystatechange", () => {
      if (this.readyState === 4 && this.status === 200) {
        let d = this.responseText;
        c.forEach(a => {
          if (a.match(this._url)) {
            try {
              d = a.modify(d, this._url);
              console.log("拦截成功: " + this._url);
            } catch (b) {
              console.error("拦截失败: " + this._url, b);
            }
          }
        });
        const a = {
          value: d,
          writable: true
        };
        Object.defineProperty(this, "responseText", a);
        if (typeof this.onload === "function") {
          this.onload();
        }
      }
    });
    let j = i;
    if (i.includes("/get_goods_list")) {
      const b = new URL(i);
      const f = new URLSearchParams(b.search);
      const a = getUserData();
      const c = a && a.vip_level;
      if (!c) {
        const b = f.get("token");
        if (!b || b === "") {
          f.set("token", "c25a7a3cdf7a49e41d96950437a9b17d");
        }
      }
      f.set("gindex", "1682828");
      b.search = f.toString();
      j = b.toString();
      console.log("请求URL修改成功: " + j);
    }
    return h.call(this, g, j, a, b, d);
  };
  const e = b => {
    return b.includes("createBuyOrder");
  };
  const f = (d, a, b) => {
    return {
      status: 1,
      msg: "successful",
      data: {
        goods_id: a,
        order_id: "${djhsj}",
        buy_num: parseInt(b, 10)
      }
    };
  };
  const d = () => {
    const g = document.createElement;
    document.createElement = function (a, ...b) {
      const c = g.call(this, a, ...b);
      if (a.toLowerCase() === "script") {
        Object.defineProperty(c, "src", {
          set(h) {
            if (e(h)) {
              console.log("拦截到 JSONP 请求:", h);
              const a = new URL(h).searchParams;
              const i = a.get("goods_id");
              const c = a.get("buy_num");
              const b = a.get("jsonCallBack");
              const d = o();
              if (i && c && b) {
                const d = window[b];
                window[b] = function (a) {
                  const b = f(a, i, c);
                  if (typeof d === "function") {
                    d(b);
                  }
                };
              } else {
                console.error("缺少必要的参数: goods_id, buy_num, jsonCallBack");
              }
            }
            return c.setAttribute("src", h);
          },
          get() {
            return c.getAttribute("src");
          }
        });
      }
      return c;
    };
  };
  d();
})();
(function () {
  'use strict';
 
  const k = window.document.createElement("button");
  k.textContent = "累充菜单";
  k.style.position = "fixed";
  k.style.background = "#ffffff";
  k.style.top = "03px";
  k.style.right = "10px";
  k.style.borderRadius = "0px";
  k.style.zIndex = "9999";
  k.addEventListener("click", e);
  window.document.body.appendChild(k);
  const l = window.document.createElement("div");
  l.style.display = "none";
  l.style.position = "fixed";
  l.style.top = "3.60px";
  l.style.left = "80px";
  l.style.transform = "translate(-0%, -0%)";
  l.style.width = "200px";
  l.style.backgroundColor = "ffffff";
  l.style.padding = "10px";
  l.style.borderRadius = "0px";
  l.style.zIndex = "9999";
  const a = {
    label: "累充",
    action: g
  };
  const b = {
    label: "全屏",
    action: h
  };
  const c = [a, b];
  c.forEach(b => {
    const a = window.document.createElement("button");
    a.textContent = b.label;
    a.addEventListener("click", b.action);
    l.appendChild(a);
  });
  const d = window.document.createElement("button");
  d.textContent = "退出";
  d.addEventListener("click", f);
  l.appendChild(d);
  window.document.body.appendChild(l);
  function e() {
    l.style.display = "block";
  }
  function f() {
    l.style.display = "none";
  }
  function g() {
    const d = prompt("请填写需要的鲜花数量大小");
    if (d) {
      var a = getUserData();
      ["totalFlower", "freshFlower", "wildFlower", "tempFlower", "realFlower", "haveFlower"].forEach(function (b) {
        a[b] = d;
      });
      累充 = 鲜花数量("填写鲜花数值");
    }
  }
  function h() {
    if (!window.document.fullscreenElement && !window.document.mozFullScreenElement && !window.document.webkitFullscreenElement && !window.document.msFullscreenElement) {
      if (window.document.documentElement.requestFullscreen) {
        window.document.documentElement.requestFullscreen();
      } else if (window.document.documentElement.msRequestFullscreen) {
        window.document.documentElement.msRequestFullscreen();
      } else if (window.document.documentElement.mozRequestFullScreen) {
        window.document.documentElement.mozRequestFullScreen();
      } else if (window.document.documentElement.webkitRequestFullscreen) {
        window.document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else if (window.document.exitFullscreen) {
      window.document.exitFullscreen();
    } else if (window.document.msExitFullscreen) {
      window.document.msExitFullscreen();
    } else if (window.document.mozCancelFullScreen) {
      window.document.mozCancelFullScreen();
    } else if (window.document.webkitExitFullscreen) {
      window.document.webkitExitFullscreen();
    }
  }
})();