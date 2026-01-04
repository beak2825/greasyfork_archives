// ==UserScript==
// @name         GitHub 商用协议检查器
// @namespace    https://github.com/
// @version      1.6
// @description  使用 GitHub LICENSE 判断协议是否可商用。
// @author       纸伞笔记
// @match        https://github.com/*/*
// @grant        GM_xmlhttpRequest
// @connect      github.com
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543132/GitHub%20%E5%95%86%E7%94%A8%E5%8D%8F%E8%AE%AE%E6%A3%80%E6%9F%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543132/GitHub%20%E5%95%86%E7%94%A8%E5%8D%8F%E8%AE%AE%E6%A3%80%E6%9F%A5%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getRepoInfo() {
    const match = location.pathname.match(/^\/([^\/]+)\/([^\/]+)(\/|$)/);
    if (!match) return null;
    const [_, owner, repo] = match;
    return { owner, repo };
  }

  function fetchJSON(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { "Accept": "application/json" },
        onload: (res) => {
          try {
            const json = JSON.parse(res.responseText);
            resolve(json);
          } catch {
            resolve(null);
          }
        },
        onerror: () => resolve(null)
      });
    });
  }

  function createSection(title, emoji, items) {
    const section = document.createElement("div");
    section.style.marginTop = "10px";

    const header = document.createElement("div");
    header.textContent = `${emoji} ${title} (${items.length})`;
    header.style.cursor = "pointer";
    header.style.fontWeight = "bold";
    header.style.marginBottom = "4px";
    header.style.userSelect = "none";

    const content = document.createElement("div");
    content.style.display = "none";
    content.style.marginLeft = "8px";
    content.innerHTML = items.map(i => `<div style="margin-bottom:4px;">• <strong>${i.label}</strong>: ${i.description}</div>`).join("");

    header.addEventListener("click", () => {
      content.style.display = content.style.display === "none" ? "block" : "none";
    });

    section.appendChild(header);
    section.appendChild(content);
    return section;
  }

  function showFloatingBox({ result, licenseName, color, permissions, limitations, conditions }) {
    const box = document.createElement("div");
    Object.assign(box.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 9999,
      backgroundColor: color,
      color: "white",
      padding: "12px 16px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      fontSize: "13px",
      fontFamily: "sans-serif",
      maxWidth: "350px",
      lineHeight: "1.5"
    });

    const title = document.createElement("div");
    title.innerHTML = `<strong>📜 协议：${licenseName}｜${result}</strong>`;
    box.appendChild(title);

    const container = document.createElement("div");
    container.style.marginTop = "8px";
    container.style.maxHeight = "400px";
    container.style.overflowY = "auto";
    container.style.paddingRight = "4px";

    container.appendChild(createSection("Permissions", "✅", permissions));
    container.appendChild(createSection("Limitations", "❌", limitations));
    container.appendChild(createSection("Conditions", "📜", conditions));

    box.appendChild(container);
    document.body.appendChild(box);
  }

  async function detectLicenseFromDeferredMetadata() {
    const repo = getRepoInfo();
    if (!repo) return;

    const branch = document.querySelector('button[data-hotkey="w"]')?.textContent.trim() || "main";
    const jsonUrl = `https://github.com/${repo.owner}/${repo.repo}/deferred-metadata/${branch}/LICENSE`;

    const data = await fetchJSON(jsonUrl);
    if (!data || !data.license || !data.license.rules) {
      showFloatingBox({
        result: "⚠️ 无法识别",
        licenseName: "未知协议",
        color: "gray",
        permissions: [],
        limitations: [],
        conditions: []
      });
      return;
    }

    const license = data.license;
    const name = license.name || "未知协议";
    const perms = license.rules.permissions || [];
    const limits = license.rules.limitations || [];
    const conds = license.rules.conditions || [];
    const isCommercial = perms.some(p => p.tag === "commercial-use");

    showFloatingBox({
      result: isCommercial ? "✅ 可商用" : "❌ 禁止商用",
      licenseName: name,
      color: isCommercial ? "green" : "red",
      permissions: perms,
      limitations: limits,
      conditions: conds
    });
  }

  setTimeout(detectLicenseFromDeferredMetadata, 1500);
})();
