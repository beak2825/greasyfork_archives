// ==UserScript==
// @name         XHR/Fetch Error Notifier
// @namespace    https://yourdomain.example.com/
// @version      2025-07-10.3
// @description  Notification Center: auto-minimize to corner button with badge, expand for error list; only show unread count as badge, no 'read' state.
// @author       andychai
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542092/XHRFetch%20Error%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/542092/XHRFetch%20Error%20Notifier.meta.js
// ==/UserScript==

(function () {
  if (window.__xhr_fetch_notifycenter_injected) return;
  window.__xhr_fetch_notifycenter_injected = true;

  // ===== CSS =====
  const style = document.createElement('style');
  style.textContent = `
#xff-notify-btn {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 99998;
  min-width: 54px;
  min-height: 54px;
  border-radius: 18px;
  background: #23272e;
  color: #fff;
  box-shadow: 0 2px 20px #0005, 0 0.5px 2px #0007;
  font-family: 'Segoe UI', 'Menlo', 'monospace', 'Arial', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow .18s, background .12s;
  font-size: 17px;
  border: none;
  outline: none;
  padding: 0 18px 0 16px;
  gap: 13px;
  opacity: 0.94;
}
#xff-notify-btn:hover { background: #31384c; }
#xff-notify-badge {
  background: #d93b41;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  border-radius: 14px;
  padding: 1.5px 10px 1.5px 10px;
  margin-left: 4px;
  min-width: 22px;
  box-shadow: 0 2px 8px #9e1a1e30;
  text-align: center;
  transition: background .18s, color .18s;
}
#xff-notify-btn.xff-hide { display: none !important; }
#xff-notify-center {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 490px;
  max-width: 97vw;
  background: #23272e;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 6px 40px #1b1b1b88, 0 2px 10px #0004;
  font-family: 'Segoe UI', 'Menlo', 'monospace', 'Arial', sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  height: 100vh;
  z-index: 99999;
  transition: right .23s, opacity .17s;
}
#xff-notify-center.xff-hide { display: none !important; }
.xff-center-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg,#23272e 80%,#303842);
  padding: 13px 22px 11px 22px;
  border-bottom: 1.5px solid #31343c;
  user-select: none;
  font-size: 15.5px;
}
.xff-center-title {
  color: #fff;
  font-weight: bold;
  letter-spacing: .03em;
  display: flex;
  align-items: center;
  font-size: 16px;
  gap: 9px;
}
.xff-center-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.xff-center-btn {
  background: #32384a;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  padding: 4px 16px;
  cursor: pointer;
  opacity: 0.88;
  transition: background .15s;
}
.xff-center-btn:hover {
  background: #5d80d6;
  opacity: 1;
}
#xff-center-list {
  flex: 1 1 auto;
  max-height: 100vh;
  min-height: 70px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding: 20px 16px 18px 16px;
  background: none;
}
.xff-popup {
  background: #23272e;
  color: #ececec;
  border-radius: 14px;
  box-shadow: 0 4px 18px #181c2088;
  pointer-events: auto;
  font-family: inherit;
  min-width: 220px;
  max-width: 100%;
  border-left: 6px solid #d45d79;
  display: flex;
  flex-direction: column;
  animation: xff-fade-in 0.45s;
  border-right: 3px solid transparent;
  transition: background .2s, border-right .2s;
  position: relative;
}
@keyframes xff-fade-in {
  from { transform: translateY(20px) scale(0.95); opacity:0 }
  to { transform: translateY(0) scale(1); opacity:1 }
}
.xff-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 15px 5px 15px;
  background: none;
}
.xff-popup-title {
  font-weight: bold;
  font-size: 13.5px;
  color: #fff;
}
.xff-popup-status {
  font-weight: bold;
  margin-left: 11px;
  color: #ffbcb5;
  letter-spacing: 1.2px;
  font-size: 12.5px;
}
.xff-popup-btns {
  display: flex;
  gap: 3px;
  align-items: center;
}
.xff-popup-btn {
  background: #32384a;
  color: #fff;
  border: none;
  outline: none;
  border-radius: 5px;
  padding: 2px 9px;
  font-size: 12px;
  cursor: pointer;
  transition: background .15s;
  opacity: 0.80;
  margin-left: 0;
}
.xff-popup-btn:hover {
  background: #5d80d6;
  color: #fff;
  opacity: 1;
}
.xff-popup-section {
  padding: 8px 16px 4px 16px;
  border-bottom: 1px solid #292c35;
  background: none;
}
.xff-popup-section:last-child { border-bottom: none; }
.xff-label {
  font-size: 11px;
  font-weight: bold;
  color: #aeb2b7;
  margin-bottom: 2px;
  display: block;
}
.xff-code {
  background: #181a21;
  color: #e6e9ef;
  border-radius: 6px;
  padding: 6px 7px;
  margin: 2px 0 8px 0;
  font-size: 12px;
  font-family: 'JetBrains Mono', 'Menlo', 'Consolas', monospace;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 110px;
  line-height: 1.5;
  box-sizing: border-box;
  word-break: break-all;
  transition: max-height .3s;
}
.xff-code.collapsed {
  max-height: 22px;
  overflow-y: hidden;
  cursor: pointer;
  filter: blur(0.5px);
}
.xff-toggle {
  color: #4ea7ff;
  font-size: 11px;
  cursor: pointer;
  padding-left: 3px;
  user-select: none;
}
.xff-popup-url {
  color: #8cd7ff;
  cursor: pointer;
  text-decoration: underline dotted #8cd7ff;
  word-break: break-all;
}
@media (max-width: 600px) {
  #xff-notify-btn { right: 4vw; bottom: 4vw; }
  #xff-notify-center { right: 0; top:0; width: 100vw; height: 100vh; }
  #xff-center-list { max-height: 98vh; }
}
`;
  document.head.appendChild(style);

  // ===== 通知按钮与中心区域 =====
  let unreadCount = 0;
  let lastCardId = 1;

  function ensureNotifyBtn() {
    let btn = document.getElementById('xff-notify-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'xff-notify-btn';
      btn.innerHTML = `<span>🔔</span><span id="xff-notify-badge">0</span>`;
      btn.onclick = openCenter;
      document.body.appendChild(btn);
      btn.style.display = '';
    }
    return btn;
  }
  function updateBadge() {
    let badge = document.getElementById('xff-notify-badge');
    if (!badge) return;
    badge.textContent = unreadCount > 0 ? unreadCount : '0';
    badge.style.visibility = unreadCount > 0 ? 'visible' : 'hidden';
  }

  function ensureCenter() {
    let center = document.getElementById('xff-notify-center');
    if (!center) {
      center = document.createElement('div');
      center.id = 'xff-notify-center';
      center.classList.add('xff-hide');
      // header
      const header = document.createElement('div');
      header.className = 'xff-center-header';
      const title = document.createElement('span');
      title.className = 'xff-center-title';
      title.innerHTML = `🔔 Error Notification Center`;
      // 操作区
      const actions = document.createElement('div');
      actions.className = 'xff-center-actions';
      // 清空全部
      const clearBtn = document.createElement('button');
      clearBtn.className = 'xff-center-btn';
      clearBtn.textContent = 'Clear All';
      clearBtn.onclick = function(e) {
        e.stopPropagation();
        document.getElementById('xff-center-list').innerHTML = '';
      };
      // 收起/关闭
      const closeBtn = document.createElement('button');
      closeBtn.className = 'xff-center-btn';
      closeBtn.textContent = 'Minimize';
      closeBtn.onclick = function(e) {
        e.stopPropagation();
        closeCenter();
      };
      actions.appendChild(clearBtn);
      actions.appendChild(closeBtn);

      header.appendChild(title);
      header.appendChild(actions);

      // 列表
      const list = document.createElement('div');
      list.id = 'xff-center-list';

      center.appendChild(header);
      center.appendChild(list);
      document.body.appendChild(center);
    }
    return center;
  }
  function openCenter() {
    document.getElementById('xff-notify-center').classList.remove('xff-hide');
    document.getElementById('xff-notify-btn').classList.add('xff-hide');
    unreadCount = 0;
    updateBadge();
  }
  function closeCenter() {
    document.getElementById('xff-notify-center').classList.add('xff-hide');
    document.getElementById('xff-notify-btn').classList.remove('xff-hide');
  }
  function scrollToBottom() {
    const list = document.getElementById('xff-center-list');
    if (list) list.scrollTop = list.scrollHeight;
  }

  // ====== 卡片内容生成 ======
  function pretty(txt) {
    if (!txt) return "[Empty]";
    try { const o = JSON.parse(txt); return JSON.stringify(o, null, 2); } catch { return txt; }
  }
  function makeKVBlock(obj) {
    const entries = obj && typeof obj === "object" ? Object.entries(obj) : [];
    const isLong = entries.length > 4;
    const div = document.createElement('div');
    div.className = 'xff-code' + (isLong ? ' collapsed' : '');
    if (entries.length === 0) {
      div.textContent = '[Empty]';
    } else {
      div.innerHTML = entries.map(([k, v]) =>
        `<span style="color:#9cdcfb">${k}:</span> <span style="color:#e7d37d">${v}</span>`
      ).join('<br>');
    }
    if (isLong) {
      div.classList.add('collapsed');
      div.title = 'Click to expand/collapse';
      div.style.cursor = 'pointer';
      div.onclick = function () { div.classList.toggle('collapsed'); };
      const toggle = document.createElement('span');
      toggle.className = 'xff-toggle';
      toggle.textContent = '[Expand]';
      toggle.onclick = (e) => {
        div.classList.toggle('collapsed');
        toggle.textContent = div.classList.contains('collapsed') ? '[Expand]' : '[Collapse]';
        e.stopPropagation();
      };
      return [toggle, div];
    }
    return [div];
  }
  function makeCodeBlock(content) {
    const isLong = content.length > 340;
    const pre = document.createElement('pre');
    pre.className = 'xff-code' + (isLong ? ' collapsed' : '');
    pre.textContent = content || '[Empty]';
    if (isLong) {
      pre.title = 'Click to expand/collapse';
      pre.onclick = () => pre.classList.toggle('collapsed');
      const toggle = document.createElement('span');
      toggle.className = 'xff-toggle';
      toggle.textContent = '[Expand]';
      toggle.onclick = (e) => {
        pre.classList.toggle('collapsed');
        toggle.textContent = pre.classList.contains('collapsed') ? '[Expand]' : '[Collapse]';
        e.stopPropagation();
      };
      return [toggle, pre];
    } else {
      return [pre];
    }
  }
  function parseRespHeaders(raw) {
    const obj = {};
    if (!raw) return obj;
    raw.trim().split(/[\r\n]+/).forEach(line => {
      const parts = line.split(': ');
      if (parts.length >= 2) obj[parts.shift()] = parts.join(': ');
    });
    return obj;
  }

  function createPopup({ type, url, method, status, request, requestHeaders, responseHeaders, requestBody, response, error }) {
    const cardId = "xff-card-" + (lastCardId++);
    const popup = document.createElement('div');
    popup.className = 'xff-popup';
    popup.id = cardId;

    // Header
    const header = document.createElement('div');
    header.className = 'xff-popup-header';
    const title = document.createElement('span');
    title.className = 'xff-popup-title';
    title.textContent = `${type} ${method ? method.toUpperCase() : ''} error`;
    const statusEl = document.createElement('span');
    statusEl.className = 'xff-popup-status';
    statusEl.textContent = status ? `[${status}]` : '';
    const btns = document.createElement('div');
    btns.className = 'xff-popup-btns';
    const btnCopy = document.createElement('button');
    btnCopy.className = 'xff-popup-btn';
    btnCopy.textContent = 'Copy';
    btnCopy.onclick = (e) => {
      let allText =
        `Type: ${type}\n` +
        `URL: ${url}\n` +
        (method ? `Method: ${method}\n` : "") +
        (status ? `Status: ${status}\n` : "") +
        (error ? `Error: ${error}\n` : "") +
        (requestHeaders ? `\nRequest Headers:\n${JSON.stringify(requestHeaders, null, 2)}` : "") +
        (request ? `\nRequest:\n${request}` : "") +
        (requestBody ? `\nRequest Body:\n${requestBody}` : "") +
        (responseHeaders ? `\nResponse Headers:\n${JSON.stringify(responseHeaders, null, 2)}` : "") +
        (response ? `\nResponse:\n${response}` : "");
      navigator.clipboard.writeText(allText);
      btnCopy.textContent = 'Copied!';
      setTimeout(() => btnCopy.textContent = 'Copy', 1500);
      e.stopPropagation();
    };
    const btnClose = document.createElement('button');
    btnClose.className = 'xff-popup-btn';
    btnClose.textContent = 'Close';
    btnClose.onclick = (e) => {
      popup.remove();
      e.stopPropagation();
    };
    btns.appendChild(btnCopy);
    btns.appendChild(btnClose);
    header.appendChild(title);
    header.appendChild(statusEl);
    header.appendChild(btns);

    // Section: URL
    const secUrl = document.createElement('div');
    secUrl.className = 'xff-popup-section';
    const urlLabel = document.createElement('span');
    urlLabel.className = 'xff-label';
    urlLabel.textContent = 'URL';
    const urlValue = document.createElement('span');
    urlValue.className = 'xff-popup-url';
    urlValue.textContent = url;
    urlValue.title = 'Click to copy';
    urlValue.onclick = (e) => {
      navigator.clipboard.writeText(url);
      urlValue.style.background = "#3c4f6a";
      setTimeout(() => urlValue.style.background = "none", 800);
      e.stopPropagation();
    };
    secUrl.appendChild(urlLabel);
    secUrl.appendChild(urlValue);

    // Section: Request Headers
    const secReqHeaders = document.createElement('div');
    secReqHeaders.className = 'xff-popup-section';
    const reqHLabel = document.createElement('span');
    reqHLabel.className = 'xff-label';
    reqHLabel.textContent = 'Request Headers';
    secReqHeaders.appendChild(reqHLabel);
    makeKVBlock(requestHeaders).forEach(node => secReqHeaders.appendChild(node));

    // Section: Request Params/Init
    const secReq = document.createElement('div');
    secReq.className = 'xff-popup-section';
    const reqLabel = document.createElement('span');
    reqLabel.className = 'xff-label';
    reqLabel.textContent = 'Request Params / Options';
    secReq.appendChild(reqLabel);
    makeCodeBlock(request || '').forEach(node => secReq.appendChild(node));

    // Section: Request Body
    let secBody = null;
    if (requestBody) {
      secBody = document.createElement('div');
      secBody.className = 'xff-popup-section';
      const bodyLabel = document.createElement('span');
      bodyLabel.className = 'xff-label';
      bodyLabel.textContent = 'Request Body';
      secBody.appendChild(bodyLabel);
      makeCodeBlock(pretty(requestBody)).forEach(node => secBody.appendChild(node));
    }

    // Section: Response Headers
    const secRespHeaders = document.createElement('div');
    secRespHeaders.className = 'xff-popup-section';
    const respHLabel = document.createElement('span');
    respHLabel.className = 'xff-label';
    respHLabel.textContent = 'Response Headers';
    secRespHeaders.appendChild(respHLabel);
    makeKVBlock(responseHeaders).forEach(node => secRespHeaders.appendChild(node));

    // Section: Response/Err
    const secResp = document.createElement('div');
    secResp.className = 'xff-popup-section';
    const respLabel = document.createElement('span');
    respLabel.className = 'xff-label';
    respLabel.textContent = error ? 'Error Message' : 'Response Body';
    secResp.appendChild(respLabel);
    makeCodeBlock(pretty(response || error || "[Empty]")).forEach(node => secResp.appendChild(node));

    // 组装
    popup.appendChild(header);
    popup.appendChild(secUrl);
    popup.appendChild(secReqHeaders);
    popup.appendChild(secReq);
    if (secBody) popup.appendChild(secBody);
    popup.appendChild(secRespHeaders);
    popup.appendChild(secResp);

    // 容器插入
    ensureCenter();
    const list = document.getElementById('xff-center-list');
    list.appendChild(popup);

    scrollToBottom();

    // 自动消失计时
    let timeoutId, startTime = Date.now(), remain = 30000;
    function startTimer() { timeoutId = setTimeout(() => { popup.remove(); }, remain); }
    function stopTimer() { clearTimeout(timeoutId); remain = remain - (Date.now() - startTime); if (remain < 0) remain = 0; }
    popup.addEventListener('mouseenter', function () { stopTimer(); });
    popup.addEventListener('mouseleave', function () { if (remain > 0 && !timeoutId) { startTime = Date.now(); startTimer(); } });
    startTimer();
  }

  // ===== fetch/xhr代理 =====
  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    let url = (typeof args[0] === "string" ? args[0] : args[0].url || "");
    let reqInit = args[1] || {};
    let reqHeaders = reqInit.headers || {};
    let reqBody = reqInit.body ? (typeof reqInit.body === "string" ? reqInit.body : "[object body]") : "";
    try {
      const res = await origFetch.apply(this, args);
      if (!res.ok) {
        let resHeaders = {};
        res.headers.forEach((val, key) => resHeaders[key] = val);
        let resText = "";
        try { resText = await res.clone().text(); } catch {}
        // 状态判断，若为最小化则+1，否则不计数
        let btn = ensureNotifyBtn();
        if (document.getElementById('xff-notify-center').classList.contains('xff-hide')) {
          unreadCount++;
          updateBadge();
        }
        createPopup({
          type: "Fetch",
          url,
          method: reqInit.method || "GET",
          status: res.status,
          request: JSON.stringify(reqInit, null, 2),
          requestHeaders: reqHeaders,
          responseHeaders: resHeaders,
          requestBody: reqBody,
          response: resText
        });
      }
      return res;
    } catch (err) {
      if (document.getElementById('xff-notify-center').classList.contains('xff-hide')) {
        unreadCount++;
        updateBadge();
      }
      createPopup({
        type: "Fetch",
        url,
        method: reqInit.method || "GET",
        error: err + "",
        request: JSON.stringify(reqInit, null, 2),
        requestHeaders: reqHeaders
      });
      throw err;
    }
  };

  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._xff_url = url;
    this._xff_method = method;
    return origOpen.call(this, method, url, ...rest);
  };
  XMLHttpRequest.prototype.send = function (body) {
    this._xff_body = body;
    const xhr = this;
    const origSetRequestHeader = xhr.setRequestHeader;
    xhr._xff_headers = {};
    xhr.setRequestHeader = function(key, val) {
      xhr._xff_headers[key] = val;
      return origSetRequestHeader.call(this, key, val);
    };
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4 && (this.status < 200 || this.status >= 300)) {
        let resHeaders = parseRespHeaders(this.getAllResponseHeaders());
        if (document.getElementById('xff-notify-center').classList.contains('xff-hide')) {
          unreadCount++;
          updateBadge();
        }
        createPopup({
          type: "XHR",
          url: this._xff_url,
          method: this._xff_method,
          status: this.status,
          request: "",
          requestHeaders: xhr._xff_headers,
          responseHeaders: resHeaders,
          requestBody: xhr._xff_body ? (typeof xhr._xff_body === "string" ? xhr._xff_body : "[object body]") : "",
          response: this.responseText
        });
      }
    });
    return origSend.apply(this, arguments);
  };

  // 初始化
  ensureNotifyBtn();
  ensureCenter();

})();
