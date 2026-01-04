// ==UserScript==
// @name         DSP2B戴森球蓝图预览工具
// @namespace    maxzhang666/dsp-viewer
// @version      0.0.4
// @author       maxzhang666
// @description  快速预览戴森球蓝图
// @license      MIT
// @icon         https://www.dsp2b.com/favicon.ico
// @include      https://www.dsp2b.com/*
// @include      https://www.dsp2b.com/zh-CN/blueprint/*
// @include      https://www.dysonsphereblueprints.com/*
// @include      https://www.dysonsphereblueprints.com/blueprints/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/486748/DSP2B%E6%88%B4%E6%A3%AE%E7%90%83%E8%93%9D%E5%9B%BE%E9%A2%84%E8%A7%88%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/486748/DSP2B%E6%88%B4%E6%A3%AE%E7%90%83%E8%93%9D%E5%9B%BE%E9%A2%84%E8%A7%88%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(' .dsp-viewer-cn{padding:1em 2em;border:none;border-radius:5px;font-weight:700;letter-spacing:5px;text-transform:uppercase;cursor:pointer;color:#2c9caf;transition:all 1s;font-size:15px;position:relative;overflow:hidden;outline:2px solid #2c9caf}.dsp-viewer-cn:hover{color:#fff;transform:scale(1.1);outline:2px solid #70bdca;box-shadow:4px 5px 17px -4px #268391}.dsp-viewer-cn:before{content:"";position:absolute;left:-50px;top:0;width:0;height:100%;background-color:#2c9caf;transform:skew(45deg);z-index:-1;transition:width 1s}.dsp-viewer-cn:hover:before{width:250%}.dsp-viewer-box,details{display:flex;justify-content:center;padding-bottom:15px}.dsp-viewer-box button{width:100%}.dsp-viewer-en{position:relative;padding:0 35px;background:#d7265f;font-size:17px;font-weight:500;color:#fff;border:3px solid #d7265f;border-radius:.4rem;box-shadow:0 0 #fec1958c;transition:all .3s ease-in-out;cursor:pointer;margin-bottom:0;line-height:1em}.star-1{position:absolute;top:20%;left:20%;width:25px;height:auto;filter:drop-shadow(0 0 0 #fffdef);z-index:-5;transition:all 1s cubic-bezier(.05,.83,.43,.96)}.star-2{position:absolute;top:45%;left:45%;width:15px;height:auto;filter:drop-shadow(0 0 0 #fffdef);z-index:-5;transition:all 1s cubic-bezier(0,.4,0,1.01)}.star-3{position:absolute;top:40%;left:40%;width:5px;height:auto;filter:drop-shadow(0 0 0 #fffdef);z-index:-5;transition:all 1s cubic-bezier(0,.4,0,1.01)}.star-4{position:absolute;top:20%;left:40%;width:8px;height:auto;filter:drop-shadow(0 0 0 #fffdef);z-index:-5;transition:all .8s cubic-bezier(0,.4,0,1.01)}.star-5{position:absolute;top:25%;left:45%;width:15px;height:auto;filter:drop-shadow(0 0 0 #fffdef);z-index:-5;transition:all .6s cubic-bezier(0,.4,0,1.01)}.star-6{position:absolute;top:5%;left:50%;width:5px;height:auto;filter:drop-shadow(0 0 0 #fffdef);z-index:-5;transition:all .8s ease}.dsp-viewer-en:hover{background:transparent;color:#d7265f;border-color:#d7265f;box-shadow:0 0 25px #fec1958c}.dsp-viewer-en:hover .star-1{position:absolute;top:-80%;left:-30%;width:25px;height:auto;filter:drop-shadow(0 0 10px #fffdef);z-index:2}.dsp-viewer-en:hover .star-2{position:absolute;top:-25%;left:10%;width:15px;height:auto;filter:drop-shadow(0 0 10px #fffdef);z-index:2}.dsp-viewer-en:hover .star-3{position:absolute;top:55%;left:25%;width:5px;height:auto;filter:drop-shadow(0 0 10px #fffdef);z-index:2}.dsp-viewer-en:hover .star-4{position:absolute;top:30%;left:80%;width:8px;height:auto;filter:drop-shadow(0 0 10px #fffdef);z-index:2}.dsp-viewer-en:hover .star-5{position:absolute;top:25%;left:115%;width:15px;height:auto;filter:drop-shadow(0 0 10px #fffdef);z-index:2}.dsp-viewer-en:hover .star-6{position:absolute;top:5%;left:60%;width:5px;height:auto;filter:drop-shadow(0 0 10px #fffdef);z-index:2}.fil0{fill:#fffdef} ');

(function () {
  'use strict';

  var _GM_openInTab = /* @__PURE__ */ (() => "undefined" != typeof GM_openInTab ? GM_openInTab : void 0)(), _unsafeWindow = /* @__PURE__ */ (() => "undefined" != typeof unsafeWindow ? unsafeWindow : void 0)();
  _unsafeWindow.addEventListener("popstate", () => {
  }), setInterval(function process() {
    let url = _unsafeWindow.location.href;
    if (currentUrl === url) return;
    (/dsp2b\.com\/zh-CN(?:\?.*|\/?)$/i.test(url) || /dsp2b\.com\/zh-CN\/collection/i.test(url)) && listInit();
    /dsp2b\.com\/zh-CN\/blueprint/i.test(url) && detailInit();
    /dysonsphereblueprints\.com\/blueprints/i.test(url) && detailInit("en");
    /dysonsphereblueprints\.com(\/(blueprints\?search=[\w&=]*))?\/?$/.test(url) && listInit("en");
    currentUrl = url;
  }, 500);
  let currentUrl = "";
  function listInit(type = "cn") {
    let cards;
    cards = "cn" == type ? _unsafeWindow.document.querySelectorAll(".ant-card-cover") : _unsafeWindow.document.querySelectorAll(".o-blueprint-card__cover"), cards.forEach((ele) => {
      var _a;
      ele.querySelectorAll(".dsp-viewer").forEach((btn) => {
        btn.remove();
      }), "cn" == type ? ((_a = ele.querySelector(".dsp-viewer-cn")) == null ? void 0 : _a.remove(), ele.append(getBtn("list", type))) : ele.after(getBtn("list", type));
    });
  }
  function detailInit(type = "cn") {
    let desc;
    "cn" == type ? (desc = _unsafeWindow.document.querySelector(".markdown-body"), desc && desc.before(getBtn("details", type))) : (desc = _unsafeWindow.document.querySelector(".t-blueprint__title"), desc && desc.append(getBtn("details", type)));
  }
  function getBtn(suffix = "list", type = "cn") {
    let btn, div = _unsafeWindow.document.createElement("div");
    return div.className = `dsp-viewer-box ${suffix}`, "cn" == type ? (btn = _unsafeWindow.document.createElement("button"), btn.textContent = "蓝图预览") : (btn = _unsafeWindow.document.createElement("button"), btn.innerHTML = '蓝图预览<div class="star-1"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1"     style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"      viewBox="0 0 784.11 815.53" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs>\n      <g id="Layer_x0020_1">\n        <metadata id="CorelCorpID_0Corel-Layer"></metadata>\n        <path\n          class="fil0"\n          d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"\n        ></path>\n      </g>\n    </svg>\n  </div><div class="star-2">\n    <svg\n      xmlns="http://www.w3.org/2000/svg"\n      xml:space="preserve"\n      version="1.1"\n      style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"\n      viewBox="0 0 784.11 815.53"\n      xmlns:xlink="http://www.w3.org/1999/xlink"\n    >\n      <defs></defs>\n      <g id="Layer_x0020_1">\n        <metadata id="CorelCorpID_0Corel-Layer"></metadata>\n        <path\n          class="fil0"\n          d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"\n        ></path>\n      </g>\n    </svg>\n  </div><div class="star-3">\n    <svg\n      xmlns="http://www.w3.org/2000/svg"\n      xml:space="preserve"\n      version="1.1"\n      style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"\n      viewBox="0 0 784.11 815.53"\n      xmlns:xlink="http://www.w3.org/1999/xlink"\n    >\n      <defs></defs>\n      <g id="Layer_x0020_1">\n        <metadata id="CorelCorpID_0Corel-Layer"></metadata>\n        <path\n          class="fil0"\n          d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"\n        ></path>\n      </g>\n    </svg>\n  </div><div class="star-4">\n    <svg\n      xmlns="http://www.w3.org/2000/svg"\n      xml:space="preserve"\n      version="1.1"\n      style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"\n      viewBox="0 0 784.11 815.53"\n      xmlns:xlink="http://www.w3.org/1999/xlink"\n    >\n      <defs></defs>\n      <g id="Layer_x0020_1">\n        <metadata id="CorelCorpID_0Corel-Layer"></metadata>\n        <path\n          class="fil0"\n          d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"\n        ></path>\n      </g>\n    </svg>\n  </div><div class="star-5">\n    <svg\n      xmlns="http://www.w3.org/2000/svg"\n      xml:space="preserve"\n      version="1.1"\n      style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"\n      viewBox="0 0 784.11 815.53"\n      xmlns:xlink="http://www.w3.org/1999/xlink"\n    >\n      <defs></defs>\n      <g id="Layer_x0020_1">\n        <metadata id="CorelCorpID_0Corel-Layer"></metadata>\n        <path\n          class="fil0"\n          d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"\n        ></path>\n      </g>\n    </svg>\n  </div><div class="star-6">\n    <svg\n      xmlns="http://www.w3.org/2000/svg"\n      xml:space="preserve"\n      version="1.1"\n      style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"\n      viewBox="0 0 784.11 815.53"\n      xmlns:xlink="http://www.w3.org/1999/xlink"\n    >\n      <defs></defs>\n      <g id="Layer_x0020_1">\n        <metadata id="CorelCorpID_0Corel-Layer"></metadata>\n        <path\n          class="fil0"\n          d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"\n        ></path>\n      </g>\n    </svg>\n  </div>'), btn.className = `dsp-viewer-${type}`, btn.onclick = (event) => {
      !function viewBlueprint(event2, suffix2, type2 = "cn") {
        var _a, _b, _c;
        let id, regex, url = "";
        if ("list" == suffix2) {
          let a = (_a = event2.target.parentNode) == null ? void 0 : _a.querySelector("a");
          a || (a = (_c = (_b = event2.target.parentNode) == null ? void 0 : _b.parentNode) == null ? void 0 : _c.querySelector("a")), a && (url = a.href);
        } else url = currentUrl;
        regex = "cn" == type2 ? /\/blueprint\/([a-f0-9]+)$/ : /\/blueprints\/(.*)$/;
        const match = url.match(regex);
        match && match.length > 0 && (id = match[1]);
        id && _GM_openInTab(`https://dsp.huizhek.com/?bp=${id}&type=${type2}`);
      }(event, suffix, type);
    }, "list" == suffix && "cn" == type ? btn : (div.append(btn), div);
  }

})();