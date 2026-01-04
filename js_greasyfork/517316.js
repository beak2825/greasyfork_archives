// ==UserScript==
// @name         ProcessOn去水印
// @description  如题所示,去掉水印
// @license MIT
// @namespace    https://github.com/NatureTao/
// @version      2025-4-28 1.2
// @author       NatureTao
// @match        *://www.processon.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIGlkPSLlm77lsYJfMSIgeD0iMCIgeT0iMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjUwIDI1MCI+PHN0eWxlPi5zdDF7ZmlsbDojZmZmfTwvc3R5bGU+PHBhdGggZD0iTTIwOC4yIDI0OS42SDQxLjhDMTguOSAyNDkuNi40IDIzMS4xLjQgMjA4LjJWNDEuOEMuNCAxOC45IDE4LjkuNCA0MS44LjRoMTY2LjRjMjIuOSAwIDQxLjQgMTguNSA0MS40IDQxLjR2MTY2LjRjMCAyMi45LTE4LjUgNDEuNC00MS40IDQxLjQiIHN0eWxlPSJmaWxsOiMwNjdiZWYiLz48cGF0aCBkPSJNMTM1LjIgMTIzLjdjMCA0Mi4zLTI1LjcgNjYuNS02MC41IDY2LjUtMzUuNiAwLTU4LjEtMjcuMi01OC4xLTY0LjMgMC0zOC44IDI0LjQtNjYuMSA1OS45LTY2LjEgMzcgLjEgNTguNyAyOCA1OC43IDYzLjlNNDEgMTI1LjZjMCAyNS43IDEyLjkgNDYuMSAzNSA0Ni4xIDIyLjMgMCAzNC44LTIwLjYgMzQuOC00NyAwLTIzLjgtMTEuOC00Ni4zLTM0LjgtNDYuMy0yMi44IDAtMzUgMjEuMi0zNSA0Ny4yTTE1MC44IDEyNC4xYzAtMTAuNS0uMi0xOS4zLS43LTI3LjJoMjAuMmwxLjEgMTMuN2guNmMzLjktNy4xIDEzLjktMTUuNyAyOS0xNS43IDE1LjkgMCAzMi40IDEwLjMgMzIuNCAzOS4ydjU0LjFoLTIzdi01MS41YzAtMTMuMS00LjktMjMtMTcuNC0yMy05LjIgMC0xNS41IDYuNi0xOCAxMy41LS43IDIuMS0uOSA0LjktLjkgNy41djUzLjZoLTIzLjJ6IiBjbGFzcz0ic3QxIi8+PC9zdmc+
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517316/ProcessOn%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/517316/ProcessOn%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

const tips = document.createElement("div");
tips .innerHTML = `
  <div style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 9999;
  ">
    ✅ 去水印成功</br>选择[ 系统水印 ] 即可
  </div>
`;

(function() {
    'use strict';
        // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找并移除水印元素
        var watermark = document.querySelector("body > div.water_mark_bg > div > div.water_content_detail > div.water_mark_choose_detail > div.system_wm_detail.w_m_text");
        if (watermark) {
            watermark.remove();
            document.body.appendChild(tips);
            setTimeout(() => tips.remove(), 5000);
        }
    }, false);

})();
