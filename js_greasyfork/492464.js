// ==UserScript==
// @name        mTorrent (M-Team) PT Helper
// @name:zh-CN  mTorrent (M-Team) PT 助手
// @namespace   https://greasyfork.org/zh-CN/users/163820-ysc3839
// @description Helper script for mTorrent based PT sites (M-Team)
// @description:zh-CN 用于基于 mTorrent PT 站 (M-Team) 的辅助脚本
// @version     1.3.2
// @author      ysc3839
// @license     MIT
// @match       https://kp.m-team.cc/*
// @match       https://test2.m-team.cc/*
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/492464/mTorrent%20%28M-Team%29%20PT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492464/mTorrent%20%28M-Team%29%20PT%20Helper.meta.js
// ==/UserScript==
// This file is built from https://github.com/ysc3839/mTorrent-PT-Helper DO NOT EDIT.
// Icon svgs are from https://github.com/ant-design/ant-design-icons Licensed unser MIT LICENSE.

// jsx.ts
function E(tag, attr, ...nodes) {
  const ns = attr?.xmlns, e = tag ? ns ? document.createElementNS(ns, tag) : document.createElement(tag) : new DocumentFragment();
  if (attr) {
    delete attr.xmlns;
    for (const k in attr) {
      const v = attr[k];
      if (typeof v === "function") {
        e.addEventListener(k, v);
      } else {
        e.setAttribute(k, v);
      }
    }
  }
  e.append(...nodes.flat());
  return e;
}

// icons.tsx
var xmlns = "http://www.w3.org/2000/svg";
var Copy = () => E("span", { role: "img", "aria-label": "copy", class: "anticon anticon-copy" }, E("svg", { xmlns, viewBox: "64 64 896 896", focusable: "false", "data-icon": "copy", width: "1em", height: "1em", fill: "currentColor", "aria-hidden": "true" }, E("path", { xmlns, d: "M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z" })));
var Loading = () => E("span", { role: "img", "aria-label": "loading", class: "anticon anticon-loading anticon-spin" }, E("svg", { xmlns, viewBox: "0 0 1024 1024", focusable: "false", "data-icon": "loading", width: "1em", height: "1em", fill: "currentColor", "aria-hidden": "true" }, E("path", { xmlns, d: "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" })));
var Check = () => E("span", { role: "img", "aria-label": "check", class: "anticon anticon-check" }, E("svg", { xmlns, viewBox: "64 64 896 896", focusable: "false", "data-icon": "check", width: "1em", height: "1em", fill: "currentColor", "aria-hidden": "true" }, E("path", { xmlns, d: "M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" })));
var ArrowUp = () => E("span", { role: "img", "aria-label": "arrow-up", class: "anticon anticon-arrow-up" }, E("svg", { xmlns, viewBox: "64 64 896 896", focusable: "false", "data-icon": "arrow-up", width: "1em", height: "1em", fill: "currentColor", "aria-hidden": "true" }, E("path", { xmlns, d: "M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z" })));
var ArrowDown = () => E("span", { role: "img", "aria-label": "arrow-down", class: "anticon anticon-arrow-down" }, E("svg", { xmlns, viewBox: "64 64 896 896", focusable: "false", "data-icon": "arrow-down", width: "1em", height: "1em", fill: "currentColor", "aria-hidden": "true" }, E("path", { xmlns, d: "M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8.1-6 13.2L487.9 861a31.96 31.96 0 0048.3 0L868 478.5c4.5-5.2.8-13.2-6-13.2z" })));

// content.ts
function addStyle(style) {
  const s = document.createElement("style");
  s.textContent = style;
  document.head.appendChild(s);
}
var specialClass;
function waitForContent() {
  const e = document.getElementsByClassName("mx-auto")[0];
  if (e)
    return Promise.resolve(e);
  return new Promise((resolve) => {
    const root = document.getElementById("root");
    new MutationObserver(function(records) {
      for (const r of records) {
        for (const n of r.addedNodes) {
          if (n.nodeType === Node.ELEMENT_NODE && n.id === "app-content") {
            this.disconnect();
            for (const c of n.classList) {
              if (c.startsWith("css-")) {
                specialClass = c;
                break;
              }
            }
            const e2 = n.getElementsByClassName("mx-auto")[0];
            resolve(e2);
            return;
          }
        }
      }
    }).observe(root, { childList: true });
  });
}

// api.ts
var apiUrls = (() => {
  let urls = [];
  try {
    urls = _APIHOSTS.map((u) => new URL(u));
  } catch (e) {
    console.warn("get _APIHOSTS error:", e);
  }
  urls.push(new URL(location.origin + "/api"));
  return urls;
})();
function isApiUrlWithPath(u, path) {
  for (const a of apiUrls) {
    if (u.origin === a.origin && u.pathname === a.pathname + path)
      return true;
  }
  return false;
}
function getApiUrl() {
  return localStorage.getItem("apiHost") || apiUrls[Math.random() * apiUrls.length | 0].href;
}
function getAuth() {
  return localStorage.getItem("auth");
}
function getVisitorId() {
  return localStorage.getItem("visitorId");
}
function getDid() {
  return localStorage.getItem("did");
}
function getApiFetchOptions() {
  return {
    method: "POST",
    headers: {
      authorization: getAuth(),
      visitorId: getVisitorId(),
      did: getDid(),
      ts: Math.floor(Date.now() / 1e3)
    }
  };
}
async function genDlToken(id) {
  const f = new FormData();
  f.set("id", id);
  const opts = getApiFetchOptions();
  opts.body = f;
  const res = await fetch(getApiUrl() + "/torrent/genDlToken", opts);
  const data = await res.json();
  if (data.code !== "0") {
    console.error("genDlToken API error:", data);
    return null;
  }
  return data.data;
}
async function getTorrentPeers(id) {
  const f = new FormData();
  f.set("id", id);
  const opts = getApiFetchOptions();
  opts.body = f;
  const res = await fetch(getApiUrl() + "/torrent/peers", opts);
  const data = await res.json();
  if (data.code !== "0") {
    console.error("getTorrentPeers API error:", data);
    return null;
  }
  return data.data;
}

// keystate.ts
var modifierState = false;
(() => {
  const onkey = (e) => {
    if (!e.repeat) {
      modifierState = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
    }
  };
  document.addEventListener("keydown", onkey);
  document.addEventListener("keyup", onkey);
})();

// animation.ts
function waitAnimationFrame() {
  return new Promise((r) => requestAnimationFrame(r));
}
function waitAnimationEnd(e) {
  return new Promise((resolve) => {
    const onEnd = () => {
      e.removeEventListener("transitionend", onEnd, true);
      e.removeEventListener("animationend", onEnd, true);
      resolve();
    };
    e.addEventListener("transitionend", onEnd, true);
    e.addEventListener("animationend", onEnd, true);
  });
}
async function doAnimation(e, name, enter) {
  const origCls = e.className;
  const dir = enter ? "enter" : "leave";
  const animCls = origCls + ` ${name} ${name}-${dir} ${name}-${dir}-`;
  e.className = animCls + "prepare";
  await waitAnimationFrame();
  e.className = animCls + "start";
  await waitAnimationFrame();
  e.className = animCls + "active";
  await waitAnimationEnd(e);
  e.className = origCls;
}

// dropdown.tsx
addStyle(`:where(.my-ant-menu-override).ant-menu {
  --ant-menu-item-height: 1.5714285714285714; /* var(--ant-line-height); */
  box-sizing: border-box;
  position: fixed;
}
:where(.my-ant-menu-override).ant-menu-submenu-popup .ant-menu-vertical >.ant-menu-item {
  height: var(--ant-menu-item-height);
  line-height: var(--ant-menu-item-height);
}
:where(.my-ant-menu-override).ant-menu-submenu-popup .ant-menu-vertical .ant-menu-item {
  padding: 5px 12px; /* var(--ant-dropdown-padding-block) var(--ant-control-padding-horizontal); */
  margin: 0;
  width: auto;
}
:where(.my-ant-menu-override).ant-menu-submenu-popup .ant-menu-vertical.ant-menu-sub {
  min-width: auto;
  padding: 4px !important; /* var(--ant-padding-xxs) */
}
:where(.my-ant-menu-override).ant-menu .ant-menu-item-divider {
  height: 1px;
  margin-block: 4px !important; /* var(--ant-margin-xxs) */
}`);
function addDropdownMenu(target, items) {
  let dropdown;
  let state = 0 /* Hide */;
  const win = target.ownerDocument.defaultView;
  const clickCallback = (callback) => function(ev) {
    const r = callback.call(this, ev);
    if (r === false || !ev.defaultPrevented)
      hide();
    return r;
  };
  const create = () => {
    if (!dropdown) {
      dropdown = E(
        "div",
        {
          class: `ant-menu ant-menu-css-var ant-menu-light ant-menu-submenu ant-menu-submenu-hidden ant-menu-submenu-popup my-ant-menu-override ${specialClass}`
        },
        E("ul", { class: "ant-menu ant-menu-sub ant-menu-vertical", role: "menu" }, items.map(
          (i) => (
            /*i === null ?
            <li role="separator" class="ant-menu-item-divider"></li> :*/
            // separator unused
            E("li", { role: "menuitem", tabindex: "-1", class: "ant-menu-item ant-menu-item-only-child", click: clickCallback(i[1]) }, E("span", { class: "ant-menu-title-content" }, i[0]))
          )
        ))
      );
      document.body.appendChild(E("div", null, dropdown));
    }
  };
  const show = async () => {
    state = 3 /* Showing */;
    const { bottom, left } = target.getBoundingClientRect();
    const s = dropdown.style;
    s.top = bottom + 4 + "px";
    s.left = left + "px";
    dropdown.classList.remove("ant-menu-submenu-hidden");
    await doAnimation(dropdown, "ant-slide-up", true);
    state = 2 /* Show */;
    win?.addEventListener("mousedown", onTriggerClose, true);
    win?.addEventListener("contextmenu", onTriggerClose, true);
  };
  const hide = async () => {
    state = 1 /* Hiding */;
    win?.removeEventListener("mousedown", onTriggerClose, true);
    win?.removeEventListener("contextmenu", onTriggerClose, true);
    await doAnimation(dropdown, "ant-slide-up", false);
    dropdown.classList.add("ant-menu-submenu-hidden");
    state = 0 /* Hide */;
  };
  const onTriggerClose = (ev) => {
    if (state === 2 /* Show */ && !dropdown.contains(ev.target))
      hide();
  };
  target.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
    create();
    if (state === 0 /* Hide */) {
      show();
    } else if (state === 2 /* Show */) {
      hide();
    }
  });
}

// tooltip.tsx
addStyle(`:where(.my-ant-tooltip-override).ant-tooltip {
  box-sizing: border-box;
  top: -9999px;
  left: -9999px;
}

:where(.my-ant-tooltip-override).ant-tooltip .ant-tooltip-inner {
  color: #232222;
  background-color: #e7e1e0;
}`);
var Tooltip = class {
  container;
  tooltip;
  inner;
  constructor() {
    this.container = E("div", null, this.tooltip = E("div", { class: `ant-tooltip ant-tooltip-hidden ant-tooltip-placement-top my-ant-tooltip-override ${specialClass}`, style: "top: 100px; left: 100px;" }, E("div", { class: "ant-tooltip-content" }, this.inner = E("div", { class: "ant-tooltip-inner", role: "tooltip" }))));
    document.body.appendChild(this.container);
  }
  show(e) {
    this.tooltip.classList.remove("ant-tooltip-hidden");
    const { left, top } = e.getBoundingClientRect();
    const { scrollX, scrollY } = window;
    const s = this.tooltip.style;
    s.left = left + scrollX + "px";
    s.top = top + scrollY - this.tooltip.getBoundingClientRect().height - 4 + "px";
    doAnimation(this.tooltip, "ant-zoom-big-fast", true);
  }
  async destroy() {
    await doAnimation(this.tooltip, "ant-zoom-big-fast", false);
    this.tooltip.classList.add("ant-tooltip-hidden");
    this.container.remove();
    this.container = this.tooltip = this.inner = void 0;
  }
};

// torrents-table.tsx
var TorrentsTableManager = class {
  type;
  table;
  tbodyObserver;
  rowsCount;
  peersColIndex;
  linkColor;
  linkObserver;
  peersObserver;
  constructor() {
    this.tbodyObserver = new MutationObserver(this.onTbodyChange.bind(this));
    this.linkObserver = new MutationObserver(this.onLinkChange.bind(this));
    this.peersObserver = new MutationObserver(this.onPeersChange.bind(this));
  }
  set(table, type) {
    this.tbodyObserver.disconnect();
    this.linkObserver.disconnect();
    this.type = type;
    this.table = table;
    this.peersColIndex = void 0;
    if (table) {
      const theadr = table.querySelector("thead > tr"), tbody = table.getElementsByTagName("tbody")[0];
      if (theadr && tbody) {
        const c = theadr.children;
        this.rowsCount = c.length;
        if (this.type === 2 /* Rankings */) {
          for (let i = c.length - 1; i >= 0; --i) {
            const e = c[i].firstElementChild;
            if (e && e.getAttribute("color") === "red") {
              this.peersColIndex = i + 1;
              break;
            }
          }
          const colgroup = table.getElementsByTagName("colgroup")[0];
          colgroup?.prepend(E("col", { style: "width: 42px;" }));
        }
        this.modifyPlaceholderColspan(tbody);
        this.addListSelectHead(theadr, tbody);
        this.tbodyObserver.observe(tbody, { childList: true });
      }
    }
  }
  modifyPlaceholderColspan(tbody) {
    const td = tbody.querySelector("tr.ant-table-placeholder > td[colspan]");
    if (td)
      ++td.colSpan;
  }
  addListSelectHead(theadr, tbody) {
    let span, loading = false;
    const button = E(
      "button",
      {
        type: "button",
        class: `ant-btn ant-btn-default ant-btn-sm ant-btn-color-default ant-btn-variant-outlined ant-btn-icon-only ${specialClass}`,
        click: async function() {
          if (!loading) {
            const selected = tbody.getElementsByClassName("ant-table-row-selected");
            if (selected.length !== 0) {
              const setLoading = (l) => {
                loading = l;
                this.classList.toggle("ant-btn-loading", l);
                span.classList.toggle("ant-btn-loading-icon", l);
                span.replaceChildren(l ? Loading() : Check());
              };
              const tooltip = new Tooltip();
              let count = 0;
              const total = selected.length;
              const updateCount = () => {
                tooltip.inner.textContent = `${count}/${total}`;
              };
              setLoading(true);
              updateCount();
              tooltip.show(this);
              const urls = [];
              try {
                for (const tr of selected) {
                  const url = await genDlToken(tr.dataset.id);
                  urls.push(url);
                  ++count;
                  updateCount();
                }
              } catch (e) {
                console.error(e);
                tooltip.inner.textContent = "获取种子链接失败";
              }
              if (!urls.some((i) => !i)) {
                for (let i = 0; i < 2; ++i) {
                  try {
                    await navigator.clipboard.writeText(urls.join("\n"));
                    break;
                  } catch (e) {
                    alert("页面不在前台，复制失败，按确定再次尝试复制");
                    await new Promise((r) => setTimeout(r, 0));
                  }
                }
                setLoading(false);
                tooltip.destroy();
              }
            }
          }
        }
      },
      span = E("span", { class: "ant-btn-icon" }, Copy())
    );
    const select = (all) => {
      const inputs = tbody.getElementsByClassName("ant-checkbox-input");
      const event = new Event("change");
      for (const i of inputs) {
        i.checked = all || !i.checked;
        i.dispatchEvent(event);
      }
    };
    addDropdownMenu(button, [
      ["全选", select.bind(null, true)],
      ["反选", select.bind(null, false)]
    ]);
    let attr;
    if (this.type === 1 /* Torrents */) {
      attr = { class: "border border-solid border-black p-2", style: "width: 42px;" };
    } else if (this.type === 2 /* Rankings */) {
      attr = { class: "ant-table-cell", scope: "col", style: "text-align: center;" };
    }
    theadr.prepend(E("th", attr, button));
  }
  onTbodyChange(records) {
    for (const r of records) {
      for (const n of r.addedNodes) {
        if (n.tagName === "TR" && n.childElementCount === this.rowsCount && n.className !== "ant-table-placeholder") {
          const a = this.addListSelect(n);
          this.setPeersLinkAndColor(n, a);
          this.linkObserver.observe(a, { attributes: true, attributeFilter: ["href"] });
          this.replaceDownloadIcon(n);
        }
      }
    }
  }
  onLinkChange(records) {
    for (const r of records) {
      r.target?.__my_update_id?.();
    }
  }
  addListSelect(tr) {
    const origClass = tr.className;
    tr.style.transition = "background-color .2s";
    const a = tr.querySelector('a[href^="/detail/"]');
    if (a) {
      a.__my_dataset_tr = tr;
      a.__my_update_id = function() {
        const id = this.getAttribute("href").slice(8);
        this.__my_dataset_tr.dataset.id = id;
        const links = this.__my_peers_links;
        if (links) {
          const href = `/detail/${id}#peers`;
          for (const l of links) {
            l.href = href;
          }
        }
      };
      a.__my_update_id();
    }
    let label, span, attr;
    if (this.type === 1 /* Torrents */) {
      attr = { class: "border border-solid border-black p-2 ", align: "center" };
    } else if (this.type === 2 /* Rankings */) {
      attr = { class: "ant-table-cell", style: "text-align: center;" };
    }
    tr.prepend(E(
      "td",
      attr,
      label = E("label", { class: `ant-checkbox-wrapper ${specialClass}`, style: "transform: scale(1.5);" }, span = E("span", { class: `ant-checkbox ${specialClass}` }, E("input", { class: "ant-checkbox-input", type: "checkbox", change: function() {
        const c = this.checked;
        span.classList.toggle("ant-checkbox-checked", c);
        label.classList.toggle("ant-checkbox-wrapper-checked", c);
        if (c) {
          const l = tr.classList;
          l.remove("bg-sticky_top", "bg-sticky_normal");
          l.add("bg-black/10", "ant-table-row-selected");
        } else {
          tr.className = origClass;
        }
      } }), E("span", { class: "ant-checkbox-inner" })))
    ));
    return a;
  }
  onPeersChange(records) {
    const seedersSet = /* @__PURE__ */ new Set();
    for (const r of records) {
      let e = r.target;
      if (e.nodeType === Node.TEXT_NODE) {
        e = e.parentElement;
      }
      const s = e.__my_linked_seeders;
      if (s)
        e = s;
      seedersSet.add(e);
    }
    for (const s of seedersSet) {
      s.__my_update_color();
    }
  }
  setPeersLinkAndColor(n, a) {
    const [seedersTd, leechersTd] = this.getPeersTd(n);
    if (seedersTd && leechersTd) {
      const seeders = seedersTd.lastElementChild, leechers = leechersTd.lastElementChild;
      if (seeders && leechers) {
        leechers.__my_linked_seeders = seeders;
        seeders.__my_linked_leechers = leechers;
        seeders.__my_update_color = function() {
          const seedersCount = parseInt(this.textContent, 10), leechersCount = parseInt(this.__my_linked_leechers.textContent, 10);
          if (leechersCount && !Number.isNaN(seedersCount)) {
            const ratio = seedersCount / leechersCount;
            let color = "";
            if (ratio < 0.025)
              color = "#ff0000";
            else if (ratio < 0.05)
              color = "#ee0000";
            else if (ratio < 0.075)
              color = "#dd0000";
            else if (ratio < 0.1)
              color = "#cc0000";
            else if (ratio < 0.125)
              color = "#bb0000";
            else if (ratio < 0.15)
              color = "#aa0000";
            else if (ratio < 0.175)
              color = "#990000";
            else if (ratio < 0.2)
              color = "#880000";
            else if (ratio < 0.225)
              color = "#770000";
            else if (ratio < 0.25)
              color = "#660000";
            else if (ratio < 0.275)
              color = "#550000";
            else if (ratio < 0.3)
              color = "#440000";
            else if (ratio < 0.325)
              color = "#330000";
            else if (ratio < 0.35)
              color = "#220000";
            else if (ratio < 0.375)
              color = "#110000";
            this.style.color = color;
          }
        };
        seeders.__my_update_color();
        this.peersObserver.observe(seeders, { subtree: true, characterData: true });
        this.peersObserver.observe(leechers, { subtree: true, characterData: true });
        const id = n.dataset.id;
        a.__my_peers_links = [
          this.addPeersLink(seedersTd, id, seeders, leechers),
          this.addPeersLink(leechersTd, id, seeders, leechers)
        ];
      }
    }
  }
  getPeersTd(n) {
    if (!this.peersColIndex && this.type === 1 /* Torrents */) {
      const c = n.children;
      for (let i = c.length - 1; i >= 0; --i) {
        if (c[i].getElementsByClassName("anticon-arrow-down").length !== 0) {
          this.peersColIndex = i;
          break;
        }
      }
    }
    if (!this.peersColIndex)
      return [void 0, void 0];
    const seeders = n.children[this.peersColIndex - 1], leechers = n.children[this.peersColIndex];
    return [seeders, leechers];
  }
  addPeersLink(p, id, seeders, leechers) {
    const c = Array.from(p.children);
    for (const i of c) {
      i.remove();
    }
    const a = E("a", { href: `/detail/${id}#peers`, target: "_blank" }, c);
    if (seeders && leechers) {
      let loading = false, loadingIcon;
      a.addEventListener("click", async function(e) {
        if (!modifierState) {
          e.preventDefault();
          if (!loading) {
            loading = true;
            if (!loadingIcon) {
              loadingIcon = Loading();
              this.prepend(loadingIcon);
            }
            const peers = await getTorrentPeers(id);
            if (peers) {
              let s = 0, l = 0;
              for (const p2 of peers) {
                if (p2.left === "0") {
                  ++s;
                } else {
                  ++l;
                }
              }
              seeders.textContent = s;
              leechers.textContent = l;
              loadingIcon.remove();
              loadingIcon = null;
            }
            loading = false;
          }
        }
      });
    }
    if (this.linkColor) {
      a.style.color = this.linkColor;
      p.append(a);
    } else {
      p.append(a);
      a.style.color = this.linkColor = a.computedStyleMap().get("color");
    }
    return a;
  }
  replaceDownloadIcon(n) {
    const i = n.getElementsByClassName("anticon-download")[0];
    i?.replaceWith(Copy());
  }
};
var torrentsTable = new TorrentsTableManager();
function findAndSetTable(n, type) {
  if (n) {
    const e = n.querySelector("table");
    if (e) {
      torrentsTable.set(e, type);
      return true;
    }
  } else {
    torrentsTable.set(void 0, void 0);
  }
}
function handleTorrentsTable(records, type) {
  for (const r of records) {
    for (const n of r.addedNodes) {
      if (n.nodeType === Node.ELEMENT_NODE) {
        if (findAndSetTable(n, type))
          return;
      }
    }
  }
}

// xhr-hook.ts
var xhr = XMLHttpRequest;
var xhrPrototypeProxy = new Proxy(xhr.prototype, {
  get(target, prop, receiver) {
    const v = Reflect.get(...arguments);
    if (prop === "responseText") {
      const u = new URL(receiver.responseURL);
      if (isApiUrlWithPath(u, "/torrent/peers")) {
        XMLHttpRequest = xhr;
        const data = JSON.parse(v);
        if (data.code === "0") {
          data.data.sort((a, b) => {
            return parseInt(a.left, 10) - parseInt(b.left, 10);
          });
          return JSON.stringify(data);
        }
      }
    }
    return v;
  }
});
var xhrProxy = new Proxy(xhr, {
  construct() {
    const o = Reflect.construct(...arguments);
    Object.setPrototypeOf(o, xhrPrototypeProxy);
    return o;
  }
});
function hookXHR(enable) {
  XMLHttpRequest = enable ? xhrProxy : xhr;
}

// detail-page.ts
var peersTr;
function handlePeersTr(trs, storeTr) {
  for (let i = trs.length - 1; i >= 0; --i) {
    const tr = trs[i], labelText = tr.getElementsByClassName("ant-descriptions-item-label")[0]?.textContent;
    if (labelText === "同伴" || labelText === "Peers") {
      if (storeTr)
        peersTr = tr;
      return tr.getElementsByTagName("button")[0];
    }
  }
}
function clickButton(button) {
  hookXHR(true);
  button.click();
}
function hookButtonClick(button) {
  button.onclick = function() {
    this.onclick = null;
    hookXHR(true);
  };
}
function scrollToPeers() {
  if (peersTr) {
    peersTr.scrollIntoView({ behavior: "smooth" });
    peersTr = null;
  }
}
function handleDetailPage(e) {
  e = e.firstElementChild;
  if (e?.classList.contains("detail-view")) {
    const showPeers = location.hash === "#peers";
    const tbody = e.querySelector(".ant-descriptions-view > table > tbody");
    if (tbody) {
      const button = handlePeersTr(tbody.children, showPeers);
      if (button) {
        if (showPeers) {
          clickButton(button);
          setTimeout(scrollToPeers, 1e3);
        } else {
          hookButtonClick(button);
        }
      }
      let first = true;
      const o = new MutationObserver(function(records) {
        if (first) {
          first = false;
          setTimeout(() => {
            this.disconnect();
            scrollToPeers();
          }, 1e3);
        }
        const button2 = handlePeersTr(tbody.children, showPeers);
        if (button2 && !showPeers) {
          hookButtonClick(button2);
        }
      });
      setTimeout(o.disconnect.bind(o), 1e4);
      o.observe(tbody, { childList: true });
    }
  }
}

// intercept-dl.ts
navigation.addEventListener("navigate", (e) => {
  console.log("navigate", e);
  if (!modifierState && e.cancelable && !e.hashChange && e.navigationType === "push") {
    const url = e.destination.url, u = new URL(url);
    if (isApiUrlWithPath(u, "/rss/dl") || isApiUrlWithPath(u, "/rss/dlv2")) {
      e.preventDefault();
      navigator.clipboard.writeText(url).then(() => {
        alert("复制成功");
      });
    }
  }
});

// upload-page.tsx
var dragging = false;
var dragOverlay;
function onDragEnter() {
  if (!dragging) {
    dragging = true;
    if (!dragOverlay) {
      dragOverlay = E("div", { style: `position: fixed; top: 0; left: 0; z-index: 100; width: 100%; height: 100%; color: white; background: #00000080; user-select: none; justify-content: center; align-items: center; display: none;`, dragleave: function() {
        dragging = false;
        this.style.display = "none";
      }, dragover: function(e) {
        e.preventDefault();
      }, drop: function(e) {
        e.preventDefault();
        dragging = false;
        this.style.display = "none";
        const items = e.dataTransfer?.items;
        if (items) {
          let f;
          for (const i of items) {
            const entry = i.webkitGetAsEntry();
            if (entry?.isFile) {
              f = i.getAsFile();
              break;
            }
          }
          if (f) {
            const torrentInput = document.getElementById("torrent-input");
            if (torrentInput) {
              const dt = new DataTransfer();
              dt.items.add(f);
              torrentInput.files = dt.files;
              torrentInput.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
        }
      } }, E("div", { style: "pointer-events: none; background: #000a; border-radius: 10px; padding: 10px;" }, E("h1", { style: "margin: 0;" }, "放下以选择该文件")));
      document.body.append(dragOverlay);
    }
    dragOverlay.style.display = "flex";
  }
}
function enterUploadPage() {
  addEventListener("dragenter", onDragEnter);
}
function exitUploadPage() {
  removeEventListener("dragenter", onDragEnter);
}

// main.user.tsx
addStyle(`#app-content {
  overflow: unset !important;
}

@media screen and (max-width: 1380px) {
  #app-content > div { width: 100% !important; }
  .mx-auto { margin: 0 !important; }
}

.braft-output-content {
  max-height: none !important;
  overflow-y: auto !important;
}

.ant-image {
  background: unset !important;
}
.ant-image .ant-image-img-placeholder {
  background: unset !important;
}`);
function replaceUpDownIcon() {
  const up = document.querySelector("img.arrowup"), down = document.querySelector("img.arrowdown");
  if (up && down) {
    const upIcon = ArrowUp(), downIcon = ArrowDown();
    upIcon.classList.add("text-mt-dark-green");
    downIcon.classList.add("text-mt-dark-red");
    up.replaceWith(upIcon);
    down.replaceWith(downIcon);
  }
}
function getPageType() {
  return location.pathname.split("/")[1];
}
waitForContent().then((e) => {
  replaceUpDownIcon();
  const page = getPageType();
  if (page === "upload") {
    enterUploadPage();
  } else if (page === "browse") {
    findAndSetTable(e, 1 /* Torrents */);
  } else if (page === "rankings") {
    findAndSetTable(e, 2 /* Rankings */);
  }
  new MutationObserver(function(records) {
    const page2 = getPageType();
    if (page2 === "upload") {
      enterUploadPage();
    } else {
      exitUploadPage();
      if (page2 === "browse") {
        handleTorrentsTable(records, 1 /* Torrents */);
      } else if (page2 === "rankings") {
        handleTorrentsTable(records, 2 /* Rankings */);
      } else {
        findAndSetTable();
        if (page2 === "detail") {
          handleDetailPage(e);
        }
      }
    }
  }).observe(e, { childList: true });
});
