// ==UserScript==
// @id             gelbooru-slide
// @name           Gelbooru Image Viewer
// @version        1.9.8.2
// @namespace      intermission
// @author         intermission
// @license        WTFPL; http://www.wtfpl.net/about/
// @description    Adds a fullscreen image view option when you click on images and various other neat features
// @match          *://gelbooru.com/*
// @match          *://rule34.xxx/*
// @match          *://e621.net/*
// @match          *://*.booru.org/*
// @match          *://*.paheal.net/*
// @match          *://yande.re/post*
// @match          *://lolibooru.moe/*
// @match          *://konachan.com/*
// @match          *://atfbooru.ninja/*
// @match          *://safebooru.org/*
// @match          *://hypnohub.net/*
// @match          *://tbib.org/*
// @match          *://*.sankakucomplex.com/*
// @exclude        http://www.sankakucomplex.com/*
// @exclude        https://www.sankakucomplex.com/*
// @run-at         document-start
// @grant          GM_registerMenuCommand
// @grant          GM_xmlhttpRequest
// @grant          GM_info
// @downloadURL https://update.greasyfork.org/scripts/24964/Gelbooru%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/24964/Gelbooru%20Image%20Viewer.meta.js
// ==/UserScript==

/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */
 
/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
/* jshint bitwise: false, asi: true, boss: true */
/* globals GM_info, GM_xmlhttpRequest, GM_registerMenuCommand, unsafeWindow */

(function(d, w, stor){
  "use strict";

  const domain = location.hostname.match(/[^.]+\.[^.]+$/)[0], site = function(){
    const info = GM_info.scriptMetaStr, regex = /match.*?[/.](\w+\.\w+)\//g, ret = {};
    let line;
    while (line = regex.exec(info))
      if (line[1] === domain) {
        ret[domain.split(".").shift()] = true;
        break;
      }
    const qS = 'document.querySelector("#post-list > .content', iB = 'insertBefore';
    switch(domain) {
      case "sankakucomplex.com":
        ret.inject = `
Object.defineProperty(${qS}"), "${iB}", {
  value: function ${iB}(newEl, pos) {
    if (newEl.nodeType !== 11)
      return (pos.nodeType === 3 ? pos.nextElementSibling : pos).insertAdjacentElement("beforebegin", newEl);
    else {
      let s = ${qS} > div:first-of-type");
      for (let t of newEl.firstElementChild.children) {
        t.classList.remove("blacklisted");
        t.removeAttribute("style");
        s.appendChild(t);
      }
    }
    return newEl;
  }
})`;
        break;
      case "hypnohub.net":
        ret.inject = `
Object.defineProperties(window.PostModeMenu, {
  "post_mouseover": {
    value() {}
  },
  "post_mouseout": {
    value() {}
  }
});`;
        break;
    }
    return Object.freeze(ret);
  }(), ns = "gelbooru-slide", full_image = stor[ns] === "true", paheal = site.paheal ? 20 : 0, passive = { passive: true }, once = { once: true }, svg = '<svg xmlns="http://www.w3.org/2000/svg" ', http_ok = [200, 304],
  WIREFRAME = 0; // 0 - off, 1 - on during image viewer, 2 - always on

  let slideshow, Pos, Menu, Btn, Main, Prog, Hover;

  if (!stor[ns]) stor[ns] = "false";

  if (!site.booru)
    GM_registerMenuCommand(`Current image mode: ${full_image ? "Always original size" : "Sample only"}`, () => { stor[ns] = full_image ? "false" : "true"; location.reload(); });

  const $ = function(a, b) {
    return [...(b || d).querySelectorAll(a)];
  };

  $.keys = Object.keys;

  $.extend = function(obj, props) {
    $.keys(props).forEach(key => obj[key] = props[key]);
    return obj;
  };

  $.extend($, {
    cache(id, b) {
      const val = full_image ? "original" : "sample";
      let ret, obj, temp;
      if (!b) {
        try { ret = JSON.parse(stor[ns + id])[val]; } catch(e) {}
        ret = ret || "loading";
      } else {
        try { temp = JSON.parse(stor[ns + id]); } catch(e) {}
        obj = temp || {};
        obj[val] = b;
        stor[ns + id] = JSON.stringify(obj);
        ret = b;
      }
      return ret;
    },
    base: a => a.match(Main.r[5]),
    current: src => $("a[data-id] > img[src*='" + $.base(src || Main.el.dataset.src) + "']")[0].parentNode,
    find(el, method) {
      let a;
      el = el.parentNode;
      do {
        try {
          el = el[(method ? "next" : "previous") + "ElementSibling"];
          a = el.querySelector("a[data-full]");
        } catch(err) {
          return false;
        }
        if (a) break;
        a = false;
      } while(!a);
      return a;
    },
    preload() {
      const curr = $.current();
      Main.req($.find(curr, true));
      return Main.req($.find(curr, false));
    },
    keyDown(e) {
      let move;
      if (slideshow) return;
      if (e.ctrlKey && Main.el.style.objectFit !== "none")
        Main.el.style.objectFit = "none";
      switch(e.keyCode) {
        case 32: case 39:
          move = true;
          break;
        case 37:
          move = false;
          break;
        case 38:
          if (e.event) Menu.fn(e.event);
          else w.location = $.current().href;
          return;
        case 40:
          e.preventDefault();
          return Main.el.click();
      }
      if (typeof move !== "undefined") {
        e = $.find($.current(), move);
        if (e) {
          if (Prog.el) {
            Prog.el.classList.remove("progdone");
            Prog.el.style.width = 0;
          }
          Main.slide(e.firstElementChild.src);
          Pos.fn(move);
          $.preload();
        } else if ($.safe(() => !Hover.next_el.classList.contains("loadingu")) && move === true)
          Hover.next();
        else if (!$.keyDown.el) {
          const el = ($.keyDown.el = $.c("div"));
          el.classList.add("nomoreimages");
          let side = move ? "right" : "left";
          el.setAttribute("style", "background: linear-gradient(to " + side + ", transparent, rgba(255,0,0,.5));" + side + ": 0;");
          $.add(el);
        }
      }
    },
    keyUp() {
      if (slideshow) return;
      if (Main.el.style.objectFit === "none") {
        $.zoom.el = $.rm($.zoom.el);
        Main.el.removeAttribute("style");
      }
    },
    zoom(e) {
      if (Main.gif.hasAttribute("style")) return;
      if (!e.ctrlKey) {
        $.zoom.el = $.rm($.zoom.el);
        return Main.el.removeAttribute("style");
      } else
        Main.el.style.objectFit = "none";
      if (slideshow) return;
      const min_y = 200 + paheal, max_x = w.innerWidth, max_y = w.innerHeight,
        { clientX: x, clientY: y } = e,
        tall = Main.el.naturalHeight > max_y, wide = Main.el.naturalWidth > max_x;
      if (!$.zoom.el) {
        let el = ($.zoom.el = $.c("span"));
        el.id = "zoom_top";
        el.innerHTML = "<span></span>";
        $.add(el);
      }
      if ((wide || tall) && min_y < y && max_y >= y && 0 <= x && max_x >= x) {
        let x_pos = 50, y_pos = 50, margin, width, height;
        if (tall) {
          margin = (max_y - min_y) * 0.075;
          height = max_y - min_y - margin * 2;
          if (y < min_y + margin)
            y_pos = 0;
          else if (y > max_y - margin)
            y_pos = 100;
          else
            y_pos = (y - min_y - margin) / height * 100;
        }
        if (wide) {
          margin = max_x * 0.075;
          width = max_x - margin * 2;
          if (x < margin)
            x_pos = 0;
          else if (x > max_x - margin)
            x_pos = 100;
          else
            x_pos = (x - margin) / width * 100;
        }
        $.zoom.el.removeAttribute("style");
        if (tall && y_pos < 10) {
          let w = max_x / 40 + 30;
          $.zoom.el.style.left = `${x - (w < 55 ? 55 : w)}px`;
          void $.zoom.el.offsetWidth;
          $.zoom.el.style.animationName = "topglowything";
        }
        Main.el.style.objectPosition = `${x_pos}% ${y_pos}%`;
      } else if (!Main.el.style.objectPosition)
        Main.el.style.objectPosition = "50% 50%";
    },
    c: c => d.createElement(c),
    r: function(){
      let queue = [];
      d.addEventListener("DOMContentLoaded", function() { 
        const length = queue.length;
        for (let i = 0; i < length; ++i) {
          try { queue[i](); } catch(e) { if (!site.safebooru) console.error(e); }
        }
        queue = $.u;
      }, once);
      return fn => { if (typeof fn === "function") queue.push(fn) };
    }(),
    rm: el => { if (el) el.parentNode.removeChild(el) },
    ins: (el, m, t) => el.insertAdjacentHTML(m, t),
    eval(text) {
      const script = $.c("script");
      $.add(d.createTextNode(text), script);
      $.add(script);
      $.rm(script);
    },
    in: (key, o) => o[Array.isArray(o) ? "includes" : "hasOwnProperty"](key),
    add(el, to = d.body) {
      const fn = () => to.appendChild(el);
      if (to) fn();
      else $.r(fn);
      return el;
    },
    safe(fn, q = false) {
      let ret;
      try { ret = fn(); }
      catch(e) { if (!q) console.error("Error executing:\n", fn.toSource()); }
      return ret;
    },
    u: void 0
  });

  if (stor[ns + "-firstrun"] !== "1.8.8") {
    const r = /^gelbooru-slide./;
    $.keys(stor).forEach(a => r.test(a) && stor.removeItem(a));
    stor[ns + "-firstrun"] = "1.8.8";
  }

  Pos = {
    fn(a) {
      let el = Pos.el;
      if (a !== $.u) {
        const no = $("span", el)[0];
        no.innerHTML = typeof a === "boolean" ? +no.innerHTML + (a ? 1 : -1) : a;
        el.title = el.textContent;
        if (Menu.el) {
          for (let a of $("a:not([download])", Menu.el)) a.href = $.current().href;
          Menu.download();
        }
      } else {
        if (Main.el && !el) {
          const thumbs = $(".thumb a[data-full]");
          el = $.c("div");
          $.ins(el, "beforeend", `<div><span>${thumbs.indexOf($.current()) + 1}</span> / ${thumbs.length}</div>`);
          el.className = "posel";
          el.title = el.textContent;
          Main.el.insertAdjacentElement("afterend", el);
          Pos.el = el;
        } else if (el) Pos.el = $.rm(el);
      }
    }
  };

  Menu = {
    fn(e) {
      const height = $("span.gif[style]").length === 0 ? 71 : 48,
        _l = e.clientX + 1, _t = e.clientY + 1,
        left = (_l > w.innerWidth - 139 ? (_l - 139) : _l) + "px",
        top = (_t > w.innerHeight - height ? (_t - height) : _t) + "px";
      let el = Menu.el;
      if (el) {
        el.removeAttribute("class");
        setTimeout(() => el.classList.add("menuel"), 10);
      } else {
        const href = $.current().href, s = '" style="margin-bottom: 2px"';
        el = $.c("div");
        el.id = "menuel";
        $.ins(el, "beforeend", `<a href="${href+s}>Open in This Tab</a><a href="${href+s} target="_blank">Open in New Tab</a><a download>Save Image As...</a>`);
        $.add(el);
        Menu.el = el;
        el.classList.add("menuel");
        Menu.download();
      }
      return $.extend(el.style, {left, top});
    },
    download() {
      const el = Menu.el.lastElementChild;
      el.href = Main.el.src;
      el.download = Main.el.src.split("/").pop() + "." + Main.el.dataset.src.match(Main.r[2])[1];
    }
  };

  Btn = {
    fn() {
      const sel = "this.previousElementSibling.firstElementChild";
      let el = Btn.el;
      if (el) {
        clearTimeout(Btn.hide_timer);
        Btn.clear();
        Btn.el = $.rm(Btn.el);
        Hover.el.removeAttribute("style");
      } else {
        el = $.c("div");
        el.setAttribute("style", 'opacity: .7;');
        el.className = "slideshow";
        $.ins(el, 'beforeend', `<span title="Slideshow">${Btn.svg_play}</span><div style="display:none;padding:10px 0">Options<hr><label>Loop:&nbsp;<input type="checkbox" checked></label>&nbsp;<label onclick="${sel}.checked=true;${sel}.disabled=!${sel}.disabled">Shuffle:&nbsp;<input type="checkbox"></label><br>Interval:&nbsp;<input type="number" value="5" style="width:100px"></div>`);
        Btn.svg_state = true;
        el.firstElementChild.onclick = Btn.cb;
        $.add(el);
        Btn.el = el;
      }
    },
    clear: () => {
      clearTimeout(+Btn.el.dataset.timer);
      Btn.el.removeAttribute("data-timer");
    },
    cb: function() {
      let el, options, thumbs = [], orig;
      const sel = ".thumb a[data-full]",
        _fnS = () => { if (el.dataset.timer) el.dataset.timer = setTimeout(_fnT, options[2]) },
        _fnT = () => {
          let _el;
          if (options[1]) {
            if (thumbs.length === 0) thumbs = $(sel);
            thumbs.splice(thumbs.indexOf($.current()), 1);
            _el = thumbs[Math.random() * thumbs.length & -1];
          } else _el = $.find($.current(), true);
          if (!_el && options[0]) _el = $(sel)[0];
          if (!_el) return Btn.cb();
          Main.el.addEventListener("load", _fnS, once);
          Main.slide(_el.firstElementChild.src);
        };
      return function() {
        el = Btn.el;
        Pos.fn();
        slideshow = !!Btn.svg_state;
        el.firstElementChild.innerHTML = (Btn.svg_state = !Btn.svg_state) ? Btn.svg_play : Btn.svg_pause;
        if (slideshow) {
          thumbs = [];
          options = $("div input", el).map(a =>
            a.type === "number" ? (a.value >= 1 ? +a.value : 1) * 1E3 : a.checked
          );
          el.dataset.timer = setTimeout(_fnT, options[2]);
          el.style.opacity = ".4";
          Hover.el.setAttribute("style", "display: none !important");
          orig = d.body.getAttribute("style");
          d.addEventListener("mousemove", Btn.hide);
        } else {
          Btn.clear();
          el.style.opacity = ".7";
          el.removeAttribute("data-timer");
          Hover.el.removeAttribute("style");
          Hover.center($.current().firstElementChild.src);
          d.removeEventListener("mousemove", Btn.hide);
          clearTimeout(Btn.hide_timer);
          if (orig) d.body.setAttribute("style", orig);
          else d.body.removeAttribute("style");
        }
      };
    }(),
    hide() {
      const b = d.body;
      b.style.cursor = "";
      clearTimeout(Btn.hide_timer);
      Btn.hide_timer = setTimeout(() => b.style.cursor = "none", 5E3);
    },
    svg_play: svg + 'width="50" height="50"><rect rx="5" height="48" width="48" y="1" x="1" fill="#fff" /><polygon fill="#000" points="16 12 16 38 36 25" /></svg>',
    svg_pause: svg + 'width="50" height="50"><rect fill="#fff" x="1" y="1" width="48" height="48" rx="5" /><rect fill="#000" x="12" y="12" width="10" height="26" /><rect fill="#000" x="28" y="12" width="10" height="26" /></svg>'
  };

  Prog = {
    check: id => Main.el.dataset.id === id,
    load(e) {
      const el = Prog.el, {id, url, ext} = e.context;
      delete Prog.reqs[id];
      if (!el) throw Error("There was an event order issue with GM_xmlhttpRequest");
      if (!$.in(e.status, http_ok) || !Main.r[5].test(e.finalUrl))
        if (url !== false && e.finalUrl.split('/').pop() === "redirect.png") Prog.fn(url, id, true);
        else return Prog.error(e);
      else {
        let blob_url = w.URL.createObjectURL(
          new Blob([e.response], {type: "image/" + ext.replace("jpeg", "jpg")})
        );
        $("a[data-id='" + id + "']")[0].dataset.blob = blob_url;
        if (Main.el && Prog.check(id)) {
          el.classList.add("progdone");
          Main.el.src = blob_url;
          if (Menu.el) Menu.download();
        }
      }
    },
    progress(e) {
      let el = Prog.el;
      if (!el) {
        Prog.el = el = $.c("span");
        el.setAttribute("style", "width:0");
        el.classList.add("progress");
        $.add(el);
      }
      if (!e) return el;
      const id = $.safe(() => e.context.id);
      if (Main.el && Prog.check(id) && el) {
        el.classList.remove("progfail");
        el.style.width = ($.in(id, Prog.reqs) ? e.loaded / e.total * 100 : 0) + "%";
      }
    },
    error(e) {
      const el = Prog.el, id = e.context.id;
      if (Main.el && Prog.check(id) && el) {
        el.classList.add("progfail");
        try { Prog.reqs[id].abort(); }
        catch(err) {}
        delete Prog.reqs[id];
      }
      if (slideshow)
        Main.el.dispatchEvent(new Event("load"));
      stor.removeItem(ns + id);
      $("a[data-id='" + id + "']")[0].dataset.full = "loading";
    },
    fn(url, id, nocache) {
      const details = {}, context = { id, url, ext: url.match(Main.r[2])[1], nocache };
      if (Prog.el) Prog.el.style.width = 0;
      $.extend(details, {
        context: context,
        method: "GET",
        url: url,
        responseType: "arraybuffer",
        onload: Prog.load,
        onprogress: Prog.progress,
        onerror: Prog.error,
        onabort: Prog.error,
        ontimeout: Prog.error,
        headers: {}
      });
      if (site.sankakucomplex)
        details.headers.Referrer = details.headers.Origin = location.origin + "/post/show/" + id;
      if (nocache === true) {
        details.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        context.nocache = false;
      }
      if (!$.in(id, Prog.reqs))
        Prog.reqs[id] = GM_xmlhttpRequest(details);
    },
    reqs: {}
  };

  Hover = {
    init() {
      const el = $.c("div");
      $.ins(el, "beforeend", `<div class="layover"></div><div class="tentcon"><div class="wrapthatshit"><div class="listimage"></div></div></div>${svg}style="width: 0; height: 0"><filter id="__dropshadow"><feGaussianBlur in="SourceAlpha" stdDeviation="2"></feGaussianBlur><feOffset result="offsetblur" dx="1" dy="1"></feOffset><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></svg>`);
      el.className = "viewpre";
      $.add(el);
      Hover.index = -1;
      Hover.target = $(".listimage", Hover.el)[0];
      Hover.wrap = Hover.target.parentNode;
      if (!site.sankakucomplex) {
        $.add(Hover.next_el = $.c("span"), Hover.target);
        Hover.next_el.className = "next";
        Hover.next_el.addEventListener("click", Hover.next, passive);
      }
      $("a[data-full]").forEach(Hover.build);
      Hover.el = el;
      Hover.kinetic();
    },
    noGears() {
      Hover.gears.style.opacity = 0;
      setTimeout(() => Hover.gears = $.rm(Hover.gears), 300);
    },
    next() {
      if (Hover.next_el.classList.contains("loadingu")) return;
      if (!Hover.gears) {
        let el, z = " 0 0 0", a = "a29.3 29.3", b = "a20.6 20.6", c = 's></animateTransform></path>', r = '" class=a><animateTransform attributeName=transform type=rotate repeatCount=indefinite from="', fn = () => el.style.right = "3vw";
        Hover.gears = el = $.c("div");
        el.className = "nextgears";
        $.ins(el, "beforeend", `${svg}viewBox="0 0 118 118"><style>.a{fill:none;stroke-linejoin:round;stroke-width:4;stroke:#fff}</style><path d="M78.6 71.8l-7.6-1.6${a}${z}-1-3.7l5.8-5.2a4.3 4.3${z}-4.2-7.3l-7.4 2.4a29.7 29.7${z}-2.7-2.7l2.4-7.4a4.3 4.3${z}-7.3-4.2L51.5 48${a}${z}-3.7-1l-1.6-7.6a4.3 4.3${z}-8.4 0l-1.6 7.6${a}${z}-3.7 1l-5.2-5.8a4.3 4.3${z}-7.3 4.2l2.4 7.4a29.7 29.7${z}-2.7 2.7l-7.4-2.4a4.3 4.3${z}-4.2 7.3L14 66.5${a}${z}-1 3.7l-7.6 1.6a4.3 4.3${z} 0 8.4l7.6 1.6${a}${z} 1 3.7l-5.8 5.2a4.3 4.3${z} 4.2 7.3l7.4-2.4a29.8 29.8${z} 2.7 2.7l-2.4 7.4a4.3 4.3${z} 7.3 4.2l5.2-5.8${a}${z} 3.7 1l1.6 7.6a4.3 4.3${z} 8.4 0l1.6-7.6${a}${z} 3.7-1l5.2 5.8a4.3 4.3${z} 7.3-4.2l-2.4-7.4a29.8 29.8${z} 2.7-2.7l7.4 2.4a4.3 4.3${z} 4.2-7.3L70 85.5${a}${z} 1-3.7l7.6-1.6A4.3 4.3${z} 78.6 71.8zM42 92.5A16.5 16.5 0 1 1 58.5 76 16.5 16.5 0 0 1 42 92.5z${r}0 42 76.051" to="360 42 76.051" dur=3${c}<path d="M113.2 24.5l-6.9-1.6${b}${z}-1.1-3l3.7-5.9a3.6 3.6${z}-5-5L98 12.8${b}${z}-3-1.1l-1.6-6.9a3.6 3.6${z}-7 0l-1.6 6.9a16.9 16.9${z}-2.8 1.2l-6-3.8a3.6 3.6${z}-5 5l3.8 6a16.9 16.9${z}-1.2 2.8l-6.9 1.6a3.6 3.6${z} 0 7l6.9 1.6${b}${z} 1.1 3l-3.7 5.9a3.6 3.6${z} 5 5L82 43.2${b}${z} 3 1.1l1.6 6.9a3.6 3.6${z} 7 0l1.6-6.9a16.9 16.9${z} 2.8-1.2l6 3.8a3.6 3.6${z} 5-5l-3.8-6a16.9 16.9${z} 1.2-2.8l6.9-1.6A3.6 3.6${z} 113.2 24.5z${r}360 89.97 28" to="0 89.97 28" dur=2${c}<circle r=8.4 style="fill:none;stroke-width:4;stroke:#fff" cx=89.97 cy=28></circle></svg>`);
        $.add(el);
        requestAnimationFrame(fn);
      }
      Hover.next_el.className = "next loadingu";
      const timer = setTimeout(() => {
        Hover.next_el = $.rm(Hover.next_el);
        Hover.size();
        Hover.noGears();
      }, 2E3);
      d.dispatchEvent(new CustomEvent(ns + "-next", { detail: timer }));
    },
    size() {
      let length = Hover.target.children.length;
      Hover.target.style.width = length * (180 + paheal) + "px";
      if (Pos.el) Pos.fn(--length);
    },
    build(el) {
      const span = $.c("span"), img = $.c("img");
      img.src = el.firstElementChild.src;
      img.alt = img.dataset.nth = ++Hover.index;
      img.title = el.firstElementChild.title;
      if (el.dataset.gif) img.style.outline = "2px solid lime";
      if (el.dataset.res) span.dataset.res = el.dataset.res;
      $.add(img, span);
      if (Hover.next_el) Hover.target.insertBefore(span, Hover.next_el);
      else $.add(span, Hover.target);
      img.addEventListener("click", Hover.click, passive);
      img.addEventListener("dragstart", e => e.preventDefault());
      Hover.size();
    },
    click(e) {
      if (Hover.prevent)
        return (Hover.prevent = null);
      e = e.currentTarget.src;
      Main.slide(e);
      Hover.center(e);
      if (Pos.el) Pos.fn(+$("img[src*='" + $.base(e) + "']", Hover.el)[0].dataset.nth);
    },
    center(src) {
      if (!(Hover.wrap || Hover.el)) return;
      const base = $.base(src),
        img = $("img[src*='" + base + "']", Hover.el)[0],
        pos = img.dataset.nth,
        scroll = Hover.wrap,
        half = scroll.offsetWidth / 2,
        width = 180 + paheal,
        dist = width * pos + width / 2,
        res = dist - half,
        curr = $(".current", Hover.el)[0];
      if (curr) curr.removeAttribute("class");
      Hover.cancel();
      Hover.el.children[1].removeAttribute("style");
      scroll.scrollLeft = res > 0 ? res : 0;
      img.parentNode.setAttribute("class", "current");
    },
    kinetic() {
      let view = Hover.target.parentNode, pressed = false,
        offset, reference, velocity, frame, timestamp, ticker, amplitude, target,
        rm = () => Hover.el.children[1].removeAttribute("style"),
        unset = () => Hover.el.children[1].setAttribute("style", "transform: unset");
      function scroll(x) {
        const max = view.scrollLeftMax;
        offset = x > max ? max : x < 0 ? 0 : x;
        view.scrollLeft = offset;
        if (offset === 0 || offset === max) {
          amplitude = 0;
          Hover.cancel();
          rm();
        }
      }
      function track() {
        let now = Date.now(),
          elapsed = now - timestamp,
          delta = offset - frame,
          v = 1000 * delta / (1 + elapsed);
        timestamp = now;
        frame = offset;
        velocity = 0.8 * v + 0.2 * velocity;
      }
      function autoScroll() {
        if (amplitude) {
          const elapsed = Date.now() - timestamp, delta = -amplitude * Math.exp(-elapsed / 15E2);
          if (delta > 5 || delta < -5) {
            unset();
            scroll(target + delta);
            Hover.kinetID = requestAnimationFrame(autoScroll);
          } else {
            rm();
            scroll(target);
          }
        }
      }
      function tap(e) {
        Hover.prevent = !(pressed = true);
        unset();
        clearInterval(ticker);
        velocity = amplitude = 0;
        if (e.target === Hover.target.parentNode) return (pressed = false);
        reference = e.clientX;
        offset = view.scrollLeft;
        frame = offset;
        timestamp = Date.now();
        ticker = setInterval(track, 100 / 3);
      }
      function drag(e) {
        if (pressed) {
          const x = e.clientX, delta = reference - x;
          if (delta > 1 || delta < -1) {
            Hover.prevent = true;
            reference = x;
            scroll(offset + delta);
          }
        }
      }
      function release() {
        pressed = false;
        clearInterval(ticker);
        if (velocity > 10 || velocity < -10) {
          amplitude = 0.8 * velocity;
          target = offset + amplitude & -1;
          timestamp = Date.now();
          Hover.kinetID = requestAnimationFrame(autoScroll);
        } else rm();
      }
      view.addEventListener('mousedown', tap, passive);
      d.body.addEventListener('mousemove', drag, passive);
      d.body.addEventListener('mouseup', release, passive);
    },
    cancel() {
      try { cancelAnimationFrame(Hover.kinetID); }
      catch(e) {}
    }
  };

  Main = {
    sel: ".thumb:not(a)",
    click(e) {
      if (e.button === 0) {
        e.preventDefault();
        e.stopPropagation();
        Main.fn(e.currentTarget);
      }
    },
    process(node, full) {
      let a, id, alt;
      try {
        if (!$.safe(() => node.nodeType === 1)) return;
        if (node.matches("li[id^='p'][class*='creator-id-']")) return setTimeout(Main.myImuoto, 0, node);
        if (node.matches(Main.sel) && $.safe(() => !(a = node.firstElementChild).dataset.full)) {
          alt = $("img[alt]", node)[0];
          if (!$.safe(() => alt = alt.alt || alt.title, true))
            return;
          id = (node.id || a.id || a.children[0].id).match(Main.r[4])[0];
          if (site.gelbooru)
            a.setAttribute("href", "/index.php?page=post&s=view&id=" + id);
          if (Main.r[3].test(alt) || $("img[src*='webm-preview.png']", node).length) return (a.style.cursor = "alias");
          if (~alt.indexOf("animated_gif")) {
            a.firstElementChild.style.border = "2px solid lime";
            a.dataset.gif = "gif";
          }
          a.dataset.id = id;
          a.dataset.full = typeof full === "string" ? full : site.paheal ? node.lastElementChild.previousElementSibling.href : $.cache(id);
          node.removeAttribute("onclick");
          a.removeAttribute("onclick");
          if (Hover.el) Hover.build(a);
          if ($.safe(() => Hover.gears.style.opacity !== "0", true))
            Hover.noGears();
          a.addEventListener("click", Main.click);
        }
      } catch(err) { console.error(err); }
    },
    init() {
      if (!(site.sankakucomplex || site.atfbooru) && location.pathname === "/")
        return $.r(Main.front);
      function hijack() {
        if (!$(Main.sel).length) return;
        $.eval(site.inject);
      }
      switch(domain) {
        case "booru.org":
          Main.r[0] = Main.r[1] = /<img alt="img" src="([^"]+)/i;
          Main.css += "span.thumb {\n  float: left\n}";
          break;
        case "e621.net":
          Main.css += ".thumb > a[data-id] {\n  display: inline-block;\n  margin-bottom: -3px\n}";
          break;
        case "tbib.org":
          Main.r[0] = /<a href="?([^"> ]+)"? [^>]*?highres[^>]*?>\s*Orig/;
          Main.r[1] = /<img[^>]*?src="?([^"> ]+)"? [^>]*?id="?image"?[^>]*>/;
          Main.css += "div:not([style*='none;padding:10px 0']) {\n  background-color: transparent\n}";
          break;
        case "sankakucomplex.com":
          Main.r[0] = /<a href="([^"> ]+)" id=highres [^>]*?>/;
          Main.r[1] = /<img[^>]*?id="?image"? [^>]*?src="?([^"> ]+)"?[^>]*>/;
          Main.sel = "#post-list div.content > div:first-of-type > .thumb";
          $.r(hijack);
          break;
        case "hypnohub.net":
          $.r(() => $.eval(site.inject));
          /* falls through */
        case "yande.re":
        case "lolibooru.moe":
        case "konachan.com":
          Main.r[1] = /<img[^>]*?id="?image"? [^>]*?src="([^">]+)"[^>]*>/;
          Main.css += `.javascript-hide[id] {
  display: inherit ! important
}
span.thumb {
  width: 180px;
  height: 180px;
  text-align: center
}
span.thumb, span.thumb a {
  display: inline-block
}
span.thumb .preview, .listimage span img {
  max-width: 150px;
  max-height: 150px
}`;
          break;
        case "atfbooru.ninja":
          Main.sel = 'div#posts article[id^="post"]';
          Main.r[0] = /<file-url>([^<]+)/;
          Main.r[1] = /<large-file-url>([^<]+)/;
          break;
        case "safebooru.org":
          Main.css += "img[title*=' rating:'][src*='.png'] {\n  background-color: rgba(255,255,255,.5)\n}";
          break;
      }
      const observer = new MutationObserver(mutations => mutations.forEach(mutation => [...mutation.addedNodes].forEach(Main.process)));
      observer.observe(d, {
        childList: true,
        subtree: true
      });
      d.addEventListener("animationend", e => {
        switch(e.animationName) {
          case "Outlined":
            e.target.classList.remove("outlined");
            break;
          case "nomoreimages":
            $.keyDown.el = $.rm(e.target);
            break;
          case "menuelement":
            Menu.el = $.rm(e.target);
            break;
          case "warn":
            $.rm(e.target);
            break;
          case "progfail": case "progdone":
            Prog.el = $.rm(e.target);
        }
      }, passive);
      w.addEventListener("keypress", e => {
        if (e.key === "Enter" || e.keyCode === 13) {
          if (slideshow) {
            Btn.cb();
          } else if (e.target.matches(".thumb > a[data-full]")) {
            e.preventDefault();
            Main.fn(e.target);
          }
        }
      });
      w.addEventListener("wheel", e => {
        if (e.ctrlKey)
          e.preventDefault();
        if (Main.el)
          $.keyDown({ keyCode: e.deltaY > 0 ? 39 : e.deltaY < 0 ? 37 : 0 });
      });
      $.r(Main.ready);
      $.r(Hover.init);
    },
    ready() {
      const style = $.c("style");
      if (WIREFRAME) {
        let debug = $.c("div"), l = '<line vector-effect="non-scaling-stroke" shape-rendering="crispEdges" class=';
        debug.id = "debug";
        $.add(debug);
        $.ins(debug, "beforeend", `<div style="width:calc(100vw - 2px);height:${198+paheal}px;position:absolute;top:0;left:0;border:1px solid cyan"></div><div style="width:calc(100vw - 2px);height:calc(100vh - ${202+paheal}px);position:absolute;top:200px;border:1px solid red;display:block">${svg}viewBox="0 0 200 200" preserveAspectRatio=none style="width: 100%;height: 100%;"><style>.a{fill:none;stroke-width:1px;stroke:#ff0}</style>${l}a y2=15 x2=200 y1=15></line>${l}a y2=185.5 x2=200 y1=185.5></line>${l}a x2=15 y1=200 x1=15></line>${l}a x2=185 y1=200 x1=185></line></svg></div><div style="width:100vw;height:100vh;position:absolute;top:0;left:0">${svg}viewBox="0 0 200 200" preserveAspectRatio=none style="width: 100%;height: 100%;"><style>.b{fill:none;stroke-width:1px;stroke:#0f0}</style>${l}b y2=100 x2=200 y1=100></line>${l}b y2=200 x2=100 x1=100></line></svg></div>`);
        Main.css += `#debug{display:${["none","block"][WIREFRAME-1]};position:fixed;z-index:10;top:0;left:0}.sliding > div#debug{pointer-events:none;display:block;width:100vw;height:100vh}#debug *{pointer-events:none}`;
      }
      $.add(d.createTextNode(Main.css), style);
      $.add(style, d.head);
      setTimeout(() => {
        let san_el = $("a#sc-auto-toggle")[0];
        if (!san_el) return;
        Main.san_fix = val => (unsafeWindow || window).Sankaku.Pagination.auto_enabled !== val && san_el.click();
      }, 500);
    },
    myImuoto(el) {
      const thumb = $.c("span"), id = el.id.substr(1), img = el.children[0].children[0].children[0], full = el.lastElementChild.href;
      if (!Main.myImuoto.loadHandler) {
        Main.myImuoto.loadHandler = el.parentNode;
        $.r(() =>
          [...Main.myImuoto.loadHandler.childNodes]
            .forEach(textNode => textNode.nodeType !== 1 && Main.myImuoto.loadHandler.removeChild(textNode)));
      }
      thumb.id = el.id;
      thumb.className = "creator-id-" + id + " thumb";
      thumb.innerHTML = `<a id="${"s" + id}" href="/post/show/${id}" data-res="${el.lastElementChild.lastElementChild.textContent.replace(Main.r[6], "\u00A0")}"><img class="preview" src="${img.src}" alt="${img.alt}" title="${img.alt}" /></a>`;
      el.parentNode.replaceChild(thumb, el);
      return Main.process(thumb, full_image || full.match(Main.r[2])[1].toLowerCase() === "gif" ? full : null);
    },
    fn(node) {
      d.dispatchEvent(new CustomEvent(ns, { detail: Main.el ? true : false }));
      return Main[Main.el ? "off" : "on"](node);
    },
    off(a) {
      $.keys(Prog.reqs).forEach(id => {
        try { Prog.reqs[id].abort(); }
        catch(e) {}
        delete Prog.reqs[id];
      });
      if (slideshow) Btn.cb();
      slideshow = !(a = $.current());
      Main.el = $.rm(Main.el);
      d.body.classList.remove("sliding");
      a.classList.add("outlined");
      d.removeEventListener("mousemove", $.zoom);
      d.removeEventListener("keydown", $.keyDown);
      d.removeEventListener("keyup", $.keyUp);
      let correction = 0;
      if (site.sankakucomplex) {
        a = a.firstElementChild;
        correction = a.offsetParent.offsetTop;
      }
      w.scrollTo(0, a.offsetTop + correction + a.offsetHeight / 2 - w.innerHeight / 2);
      Pos.fn(); Btn.fn();
      Main.gif = $.rm(Main.gif);
      Prog.el = $.rm(Prog.el);
      Main.san_fix(true);
    },
    on(a) {
      if (Main.san_fix) Main.san_fix(false);
      d.body.classList.add("sliding");
      for (let a of $("a.outlined[data-full]")) a.classList.remove("outlined");
      let el = (Main.el = $.c("img"));
      el.id = "slide";
      el.alt = "Loading...";
      el.onclick = Main.fn;
      el.onmouseup = e => e.button === 1 && $.keyDown({keyCode:38, event:e});
      $.add(el);
      d.documentElement.scrollIntoView();
      Main.gif = el = $.c("span");
      el.innerHTML = svg + 'viewBox="-10 -3 36 22"><path d="M26 16c0 1.6-1.3 3-3 3H-7c-1.7 0-3-1.4-3-3V0c0-1.7 1.3-3 3-3h30c1.7 0 3 1.3 3 3v16z" opacity=".6"/><path fill="#FFF" d="M22-1H-6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2V1c0-1.1-.9-2-2-2zM6.3 13.2H4.9l-.2-1.1c-.4.5-.8.9-1.3 1.1-.5.2-1 .3-1.4.3-.8 0-1.5-.1-2.1-.4s-1.1-.6-1.5-1.1-.7-1-1-1.6C-2.9 9.7-3 9-3 8.3c0-.7.1-1.4.3-2.1.2-.6.5-1.2 1-1.7s.9-.8 1.5-1.1C.5 3.2 1.2 3 1.9 3c.5 0 1 .1 1.5.2.5.2.9.4 1.3.7.4.3.7.7 1 1.1.2.5.4 1 .4 1.5H4c-.1-.5-.3-.9-.7-1.2-.4-.3-.8-.4-1.4-.4-.5 0-.9.1-1.2.3-.4.1-.7.4-.9.7-.2.3-.3.7-.4 1.1s-.1.8-.1 1.3c0 .4 0 .8.1 1.2s.3.8.5 1.1c.2.3.5.6.8.8s.8.3 1.3.3c.7 0 1.3-.2 1.7-.6.4-.4.6-.9.7-1.6H2.1V7.8h4.2v5.4zm4 0H8.1v-10h2.2v10zm8.9-8.1h-4.8v2.3h4.2v1.7h-4.2v4.1h-2.2v-10h7v1.9z"/></svg>';
      el.classList.add("gif");
      $.add(el);
      try { Main.slide(a.firstElementChild.src); }
      catch (err) { console.error(err); }
      d.addEventListener("keyup", $.keyUp);
      d.addEventListener("keydown", $.keyDown);
      d.addEventListener("mousemove", $.zoom);
      Pos.fn(); Btn.fn(); $.preload();
    },
    slide(src) {
      if (!slideshow && !(site.sankakucomplex && ~src.indexOf("//cs.") < 0))
        Main.el.src = src;
      if ($.zoom.el)
        $.zoom.el = $.rm($.zoom.el);
      Hover.center(src);
      Main.el.dataset.src = src;
      Main.gif.removeAttribute("style");
      Main.el.removeAttribute("style");
      const curr = $.current(src), data = curr.dataset.full;
      Main.el.dataset.id = curr.dataset.id;
      /* dirty hack ahead because GIF doesn't want to play as a blob
       * and doesn't give proper progress info for 
       * GM_xmlhttpRequest for whatever reason */
      let isGif;
      try { isGif = data.match(Main.r[2])[1].toLowerCase() === "gif"; }
      catch(e) { isGif = null; }
      if (data === "loading") Main.req(curr);
      // hack start
      else if ($.in(isGif, [null, true])) {
        if (isGif) {
          Main.el.removeAttribute("src");
          Main.el.src = data;
          Main.gif.setAttribute("style", "display: inline-block");
        } else
          Main.el.dispatchEvent(new Event("load"));
      }
      // hack end
      else if (curr.dataset.blob) {
        Main.el.src = curr.dataset.blob;
        if (Menu.el) Menu.download();
        if (Prog.el) Prog.el = $.rm(Prog.el);
        let el = Prog.progress();
        el.style.width = "100%";
        el.classList.add("progdone");
      } else Prog.fn(data, curr.dataset.id);
    },
    r: [/file_url[=>]"?([^" <]+)"?/i,/* 0 */ /sample_url[=>]"?([^" <]+)"?/i,/* 1 */ /\.(gif|png|jpe?g)/i,/* 2 */ /\b(webm|video|mp4|flash)\b/i,/* 3 */ /\d+/,/* 4 */ /[a-f0-9]{32}/,/* 5 */ / /g]/* 6 */,
    process_http: x => { if (!$.in(x.status, http_ok)) throw `HTTP status: ${x.status}`; return x.text(); },
    req(node) {
      let id = "", api;
      if (!node || node.dataset.alreadyLoading || node.dataset.full !== "loading") return;
      switch(domain) {
        case "atfbooru.ninja":
          api = `/posts/${node.parentNode.id.substr(5)}.xml`;
          break;
        case "e621.net":
          id = node.parentNode.id.substr(1);
          api = "/post/show.xml?id=";
          break;
        case "sankakucomplex.com":
        case "yande.re":
        case "lolibooru.moe":
        case "konachan.com":
        case "hypnohub.net":
          id = node.parentNode.id.substr(1);
          api = "/post/show/";
          break;
        case "booru.org":
        case "tbib.org":
          id = node.dataset.id;
          api = "/index.php?page=post&s=view&id=";
          break;
        default:
          id = node.dataset.id;
          api = "/index.php?page=dapi&s=post&q=index&id=";
      }
      const process_text = function(img) {
        if (!$.safe(() => img = img.match((!node.dataset.gif && !full_image) ? Main.r[1] : Main.r[0])[1]))
          throw "API error";
        node.dataset.full = $.cache(id, img);
        if ($.safe(() => ~Main.el.dataset.src.indexOf($.base(img)))) {
          try { Main.slide(img); } catch (err) { console.error(err); }
        }
        $("img", node)[0].style.outline = "";
        return node.removeAttribute("data-already-loading");
      };
      node.dataset.alreadyLoading = "true";
      return fetch(api + id)
        .then(Main.process_http)
        .then(process_text)
        .catch(err => {
          Main.warn();
          $("img", node)[0].style.outline = "6px solid red";
          console.error(`Main.req failure:\n\n${err} | ${location.origin + api + id}`);
          node.removeAttribute("data-already-loading");
        });
    },
    warn() {
      const warn = $.c("span");
      warn.innerHTML = svg + 'viewBox="0 0 1000 1000"><style>path.a{fill:red;stroke-width:8px;stroke:black;}</style><path d="M500 673c-17 0-34 4-48 11-24 12-44 33-55 58-5 14-9 28-9 44 0 62 50 113 112 113 63 0 113-50 113-113C613 723 562 673 500 673zM500 843c-32 0-58-26-58-58 0-32 26-58 58-58 32 0 59 26 59 58C558 817 532 843 500 843z" class="a"/><path d="M285 643c4 3 8 5 12 5l132-138c-57 14-109 47-149 94C272 617 273 634 285 643z" class="a"/><path d="M606 522L565 565c43 13 83 39 112 75 5 7 13 10 21 10 6 0 12-2 17-6 11-9 13-27 3-38C689 568 650 539 606 522z" class="a"/><path d="M500 384c16 0 32 1 48 3l46-48c-30-7-61-10-93-10-137 0-265 61-351 167-10 11-8 29 4 38 5 4 11 7 17 7 8 0 15-4 21-10C267 438 379 384 500 384z" class="a"/><path d="M729 393l-38 40c45 24 86 58 119 98 10 12 27 14 39 4 12-9 13-27 4-38C817 454 776 420 729 393z" class="a"/><path d="M685 244l41-43c-70-28-147-42-226-42-188 0-364 84-484 230-9 12-7 29 4 39 5 4 11 6 17 6 8 0 16-3 21-10 109-133 270-210 442-210C564 214 626 224 685 244z" class="a"/><path d="M984 389c-38-48-83-88-133-121l-38 40c49 32 93 71 130 117 9 11 27 13 38 4C991 418 994 401 984 389z" class="a"/><path d="M907 110c-11-10-28-10-38 1L181 828c-10 11-10 28 1 38 5 5 12 8 19 8 7 0 14-3 20-8L908 148C918 138 918 120 907 110z" class="a"/></svg>';
      warn.classList.add("warn");
      if ($(".sliding>.warn").length === 0) $.add(warn);
      if (slideshow)
        Main.el.dispatchEvent(new Event("load"));
    },
    front() {
      let target, method = "beforeend";
      switch(domain) {
        case "e621.net":
          target = "#mascot_artist";
          method = "afterend";
          break;
        case "booru.org":
        case "rule34.xxx":
          target = "#static-index > div:last-child > p:first-child";
          break;
        case "lolibooru.moe":
          target = "#links + *";
          break;
        case "safebooru.org":
          target = "div.space + div > p";
          method = "afterend";
          break;
        case "hypnohub.net":
          target = "form > div";
          break;
        default:
          target = "form:last-of-type + div";
      }
      $("#tags")[0].focus();
      $.ins($(target)[0], method, `<br><br>Gelbooru&nbsp;Enhancement:<br><pre style="font-size: 11px;text-align: left;display: inline-block;margin-top: 5px;">- Gelbooru Image Viewer ${GM_info.script.version}</pre>`);
    },
    css: `
@keyframes Outlined {
  0% { outline: 6px solid orange }
  60% { outline: 6px solid orange }
  100% { outline: 6px solid transparent }
}
@keyframes nomoreimages {
  0% { opacity: 0 }
  20% { opacity: 1 }
  100% { opacity: 0 }
}
@keyframes menuelement {
  0% { opacity: 1 }
  80% { opacity: 1 }
  100% { opacity: 0 }
}
@keyframes progfail {
  0% { opacity: 1 }
  80% { opacity: 1 }
  100% { opacity: 0 }
}
@keyframes warn {
  0% { opacity: 0; bottom: 5vh }
  25% { opacity: 1; bottom: 10vh }
  90% { opacity: 1 }
  100% { opacity: 0 }
}
@keyframes topglowything {
  0% { opacity: 1 }
  80% { opacity: 1 }
  100% { opacity: 0 }
}
body.sliding > * {
  display: none
}
body.sliding > .warn {
  z-index: 2;
  display: inline-block;
  position: absolute;
  width: 10vw;
  left: 45vw;
  bottom: 10vh;
  animation-duration: 2s;
  animation-name: warn;
  pointer-events: none
}
#slide {
  position: absolute;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  object-fit: contain;
  display: inherit;
  top: 0;
  left: 0
}
.outlined {
  outline: 6px solid transparent;
  animation-duration: 4s;
  animation-name: Outlined
}
body.sliding > div.nextgears {
  display: block;
  position: absolute;
  z-index: 2;
  width: 10vw;
  filter: url(#__dropshadow);
  right: -30vw;
  top: 50%;
  transform: translateY(-50%);
  min-width: 50px;
  transition: all ease .3s
}
body.sliding > .nomoreimages {
  z-index: 4;
  pointer-events: none;
  display: block;
  width: 33vw;
  height: 100vh;
  top: 0;
  position: fixed;
  animation-duration: 1s;
  animation-name: nomoreimages
}
span.thumb {
  max-width: 180px;
  max-height: 180px
}
#menuel {
  z-index: 3;
  opacity: 1;
  position: fixed;
  display: block;
  padding: 2px;
  background: black;
  width: 139px;
  height: 67px;
  overflow: hidden;
  animation-duration: 1s
}
.gif[style] ~ #menuel {
  height: 44px
}
body.sliding > .menuel {
  animation-name: menuelement
}
#menuel:hover {
  animation-name: keepalive
}
#menuel a {
  background: #fff;
  color: #006FFA;
  display: block;
  font-size: 16px;
  font-family: verdana, sans-serif;
  font-weight: unset
}
#menuel a:hover {
  color: #33CFFF ! important
}
#menuel a:visited {
  color: #006FFA
}
#zoom_top {
  position: fixed;
  top: ${200 + paheal}px;
  left: 0;
  pointer-events: none;
  width: calc(5vw + 60px);
  height: 60px;
  min-width: 110px;
  z-index: 2;
  overflow: hidden;
  animation-duration: .6s;
  opacity: 0
}
#zoom_top[style] {
  display: block
}
#zoom_top > span {
  position: absolute;
  top: 1px;
  transform: translateY(-100%);
  box-shadow: 0 0 30px cyan;
  background: black;
  left: 30px;
  width: 5vw;
  height: 1.6vw;
  border-radius: .8vw;
  min-width: 50px
}
body.sliding > .slideshow {
  z-index: 2;
  display: block;
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 16px;
  font-family: verdana, sans-serif
}
body.sliding > .progress {
  z-index: 6;
  display: block;
  background-color: rgb(128,200,255);
  height: 1vh;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 .5vh 10px rgba(0,0,0,.7), inset 0 0 .1vh black;
  transition: ease-in-out .08s width;
  min-height: 3px;
  min-width: 5px ! important;
  max-width: 100vw;
  pointer-events: none;
  will-change: width, opacity
}
body.sliding > .progfail {
  background-color: red;
  width: 100% ! important;
  animation-name: progfail;
  animation-duration: 1.5s
}
body.sliding > .progdone {
  width: 100% ! important;
  animation-name: progfail;
  animation-duration: .6s
}
.slideshow:hover:not([data-timer]) > div {
  background: white;
  color: black;
  position: fixed;
  display: block ! important;
  bottom: 70px;
  right: 20px
}
body.sliding > .gif {
  z-index: 5;
  pointer-events: none;
  position: absolute;
  top: 3vh;
  right: 2vw;
  width: 3.5vw;
  opacity: .7;
  min-width: 50px;
  transition: ease .15s margin-top;
  margin-top: 0;
  will-change: margin-top
}
body.sliding {
  padding: 0;
  overflow: hidden
}
body.sliding > .viewpre {
  display: block
}
.viewpre > div {
  display: inherit;
  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${200 + paheal}px
}
.viewpre > .tentcon {
  transform: translateY(-100%);
  transition: ease .15s transform;
  background: linear-gradient(to bottom, black, transparent);
  will-change: transform
}
.viewpre:hover > .tentcon {
  transform: unset
}
.viewpre .wrapthatshit, .viewpre .wrapthatshit > .listimage {
  transform: rotateX(180deg);
}
.viewpre:hover ~ .gif {
  margin-top: ${200 + paheal * 2}px
}
.wrapthatshit {
  height: 100%;
  width: 100%;
  overflow-x: auto
}
.listimage {
  height: ${180 + paheal}px;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  margin: 0 auto
}
.listimage span {
  height: ${180 + paheal}px;
  width: ${180 + paheal}px;
  text-align: center;
  display: table-cell ! important;
  vertical-align: middle
}
.listimage span img {
  cursor: pointer
}
.listimage .current {
  background: linear-gradient(to top, transparent 0%, hsla(204, 100%, 56%, .8) 2%, transparent 30%, transparent 100%)
}
.listimage .next::after {
  content: "LOAD\\ANEXT\\APAGE";
  font-size: 30px;
  text-transform: full-width;
  white-space: pre-wrap;
  color: white;
  filter: url(#__dropshadow)
}
.listimage .next {
  cursor: pointer
}
body.sliding > .posel {
  position: fixed;
  bottom: 20px;
  left: 0;
  display: block;
  pointer-events: none;
  z-index: 2;
  font-size: 16px;
  font-family: verdana, sans-serif
}
.posel > div {
  position: relative;
  color: #fff;
  z-index: 2
}
.posel::before {
  content: attr(title);
  position: absolute;
  -webkit-text-stroke: 2px black;
  left: 0;
  z-index: 1
}
[data-res]:hover::after {
  content: attr(data-res);
  color: white;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 5px;
  background: rgba(0,0,0,.7);
  border-radius: 5px;
  border: 2px black solid;
  box-shadow: 0 0 2px 1px black;
  pointer-events: none
}
[data-res]:hover {
  position: relative;
  display: inline-block
}
body:not(.sliding) > div.viewpre {
  display: none ! important
}
`
  };

  Main.init();

}(document, window, localStorage));