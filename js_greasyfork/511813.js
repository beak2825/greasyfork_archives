// ==UserScript==
// @name              Inject Jyutping
// @name:zh-HK        注入粵拼
// @name:zh-TW        注入粵拼
// @name:zh-CN        注入粤拼
// @name:ja           粤拼を注入
// @name:ko           월병(粵拼)을 주입
// @description       Add Cantonese pronunciation (Jyutping) on Chinese characters.
// @description:zh-HK 為漢字標註粵語發音（粵拼）。
// @description:zh-TW 為漢字標註粵語發音（粵拼）。
// @description:zh-CN 为汉字标注粤语发音（粤拼）。
// @description:ja    漢字に広東語の発音（粤拼）を付けます。
// @description:ko    한자에 광동어의 발음(월병/粵拼)을 붙인다.
// @namespace         https://jyutping.org
// @version           0.5.0
// @license           BSD-2-Clause
// @icon              https://raw.githubusercontent.com/CanCLID/inject-jyutping/refs/heads/main/icons/128.png
// @match             *://*/*
// @grant             GM_addStyle
// @run-at            context-menu
// @downloadURL https://update.greasyfork.org/scripts/511813/Inject%20Jyutping.user.js
// @updateURL https://update.greasyfork.org/scripts/511813/Inject%20Jyutping.meta.js
// ==/UserScript==

'use strict';

GM_addStyle(`
    ruby.inject-jyutping > rt {
        font-size: 0.74em;
        font-variant: initial;
        margin-left: 0.1em;
        margin-right: 0.1em;
        text-transform: initial;
        letter-spacing: initial;
    }

    ruby.inject-jyutping > rt::after {
        content: attr(data-content);
    }
`);

// src/MessageManager.ts
function isMessage(obj) {
  return obj && typeof obj === "object" && typeof obj.id === "number" && "msg" in obj;
}
var getUniqueId = ((id) => () => id++)(0);

class MessageManager {
  worker;
  constructor(worker) {
    this.worker = worker;
  }
  sendMessage(handlerName, msg) {
    const { worker } = this;
    const id = getUniqueId();
    return new Promise((resolve) => {
      worker.addEventListener("message", function f({ data: response }) {
        if (isMessage(response) && response.id === id) {
          worker.removeEventListener("message", f);
          resolve(response.msg);
        }
      });
      worker.postMessage({ msg, id, name: handlerName });
    });
  }
  registerHandler(handlerName, f) {
    const { worker } = this;
    worker.addEventListener("message", ({ data: msg }) => {
      if (isMessage(msg) && "name" in msg && msg.name === handlerName) {
        const res = f(msg.msg);
        worker.postMessage({ msg: res, id: msg.id });
      }
    });
  }
}

// src/index.ts
function hasHanChar(s) {
  return /[\p{Unified_Ideograph}\u3006\u3007]/u.test(s);
}
function isTargetLang(locale) {
  const [lang] = locale.split("-", 1);
  return lang !== "ja" && lang !== "ko" && lang !== "vi";
}
function makeRuby(ch, pronunciation) {
  const ruby = document.createElement("ruby");
  ruby.classList.add("inject-jyutping");
  ruby.textContent = ch;
  const rt = document.createElement("rt");
  rt.lang = "yue-Latn";
  rt.dataset["content"] = pronunciation;
  ruby.appendChild(rt);
  return ruby;
}
function forEachText(node, callback, lang = "") {
  if (!isTargetLang(lang)) {
    return;
  }
  if (node.nodeType === Node.TEXT_NODE) {
    if (hasHanChar(node.nodeValue || "")) {
      callback(node);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (["RUBY", "OPTION", "TEXTAREA", "SCRIPT", "STYLE"].includes(node.nodeName)) {
      return;
    }
    for (const child of node.childNodes) {
      forEachText(child, callback, node.lang);
    }
  }
}
async function convertText(node) {
  const conversionResults = await mm.sendMessage("convert", node.nodeValue || "");
  const newNodes = document.createDocumentFragment();
  for (const [k, v] of conversionResults) {
    newNodes.appendChild(v === null ? document.createTextNode(k) : makeRuby(k, v));
  }
  if (node.isConnected) {
    node.parentNode?.replaceChild(newNodes, node);
  }
}
var worker = new Worker(URL.createObjectURL(new Blob(["function o(e){return e&&typeof e===\"object\"&&typeof e.id===\"number\"&&\"msg\"in e}var d=((e)=>()=>e++)(0);class n{e;constructor(e){this.worker=e}sendMessage(e,r){const{worker:s}=this,t=d();return new Promise((i)=>{s.addEventListener(\"message\",function g({data:a}){if(o(a)&&a.id===t)s.removeEventListener(\"message\",g),i(a.msg)}),s.postMessage({msg:r,id:t,name:e})})}registerHandler(e,r){const{worker:s}=this;s.addEventListener(\"message\",({data:t})=>{if(o(t)&&\"name\"in t&&t.name===e){const i=r(t.msg);s.postMessage({msg:i,id:t.id})}})}}importScripts(\"https://cdn.jsdelivr.net/npm/to-jyutping@3.1.1\");var c=new n(globalThis);c.registerHandler(\"convert\",ToJyutping.getJyutpingList);\n"], { type: "text/javascript" })));
var mm = new MessageManager(worker);
var mo = new MutationObserver((changes) => {
  for (const change of changes) {
    for (const node of change.addedNodes) {
      const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentNode;
      forEachText(node, convertText, element?.closest?.("[lang]")?.lang);
    }
  }
});
forEachText(document.body, convertText, document.body.lang || document.documentElement.lang);
mo.observe(document.body, {
  characterData: true,
  childList: true,
  subtree: true
});
